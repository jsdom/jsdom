"use strict";

module.exports = expand;
const whiteSpace = require("../values/white-space.js");
const defaultsModule = require("../values/defaults.js");
const cssValues = require("../values/value.js");
const substitutionsModule = require("../values/substitutions.js");
const resolveModule = require("../resolve.js");
const shorthandProperties = require("../properties/shorthands.js");
const { splitPosition } = require("../utils/position.js");
const { LRUCache } = require("lru-cache");
const { syntaxSize, syntaxObjectSize } = require("../utils/syntax-size.js");
const expansions = new LRUCache({
  max: 4096,
  maxSize: 4 * 1024 * 1024,
});
const shorthandGroups = new WeakMap();
module.exports.getGroup = (declaration) => shorthandGroups.get(declaration);
const borderTypes = ["<line-width>", "<line-style>", "<color>"];

function getDeclaredOrInitialValue(longhand, declared) {
  return cssValues.isOmitted(declared) ? resolveModule.getInitialValue(longhand) : declared;
}

function getDeclaredOrInitialCoordinatedValue(longhand, declared) {
  return cssValues.isOmitted(declared) ? resolveModule.getInitialValue(longhand)[0] : declared;
}

function getInitialDeclarations(longhands) {
  return new Map(longhands.map((longhand) => [longhand, resolveModule.getInitialValue(longhand)]));
}

function setLonghands(value, longhands) {
  return new Map(longhands.map((longhand) => [longhand, value]));
}

function parseByIndex(values, longhands) {
  return new Map(
    longhands.map((longhand, index) => {
      let value = values[index];
      if (!value || cssValues.isOmitted(value)) {
        value = resolveModule.getInitialValue(longhand);
      }
      return [longhand, value];
    }),
  );
}

function parseCoordinatedValues(lists, longhands) {
  const declarations = new Map(longhands.map((longhand) => [longhand, cssValues.list([], ",")]));
  for (const list of lists) {
    longhands.forEach((longhand, index) => {
      declarations.get(longhand).push(getDeclaredOrInitialCoordinatedValue(longhand, list[index]));
    });
  }
  return declarations;
}

// https://drafts.csswg.org/css-animations-1/#propdef-animation
function parseAnimation(animations, longhands, resetOnly) {
  const declarations = parseCoordinatedValues(animations, longhands);
  resetOnly.forEach((longhand) =>
    declarations.set(longhand, resolveModule.getInitialValue(longhand)),
  );
  return declarations;
}

// https://drafts.csswg.org/scroll-animations-1/#propdef-animation-range
// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger-activation-range
// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger-active-range
function parseAnimationRange(ranges, longhands) {
  return parseCoordinatedValues(
    ranges.map((range) => parseAnimationRangeValue(range, longhands.at(-1))),
    longhands,
  );
}

function parseAnimationRangeValue(boundaries, endType) {
  const [start, end] = boundaries;
  if (cssValues.isList(start) && cssValues.isOmitted(end)) {
    return cssValues.list([start, cssValues.list([start[0], cssValues.omitted], " ", [endType])]);
  }
  return boundaries;
}

// https://drafts.csswg.org/css-backgrounds-4/#propdef-background
//
// It assigns each background layer value to the corresponding longhand values,
// setting an omitted `background-clip` value to the `background-origin` value.
function parseBackground(backgrounds, longhands, resetOnly) {
  let [layers, , final] = backgrounds;
  const color = final.at(-1);
  final = final.slice(0, -1);
  const declarations = new Map(
    longhands.map((longhand) => {
      return longhand === "background-color"
        ? [longhand, getDeclaredOrInitialValue(longhand, color)]
        : [longhand, cssValues.list([], ",")];
    }),
  );
  resetOnly.forEach((longhand) =>
    declarations.set(longhand, resolveModule.getInitialValue(longhand)),
  );
  layers = cssValues.isOmitted(layers) ? [final] : [...layers, final];
  layers.forEach(([image, positionSize, repeat, attachment, origin, clip]) => {
    let position, size;
    if (cssValues.isOmitted(positionSize)) {
      position = size = cssValues.omitted;
    } else {
      [position, size] = positionSize;
      if (!cssValues.isOmitted(size)) {
        size = size[1];
      }
    }
    longhands.forEach((longhand) => {
      if (longhand === "background-color") {
        return;
      }
      if (longhand === "background-repeat-x") {
        if (cssValues.isOmitted(repeat)) {
          const initial = resolveModule.getInitialValue("background-repeat-x")[0];
          declarations.get("background-repeat-x").push(initial);
          declarations.get("background-repeat-y").push(initial);
        } else {
          repeat = parseBackgroundRepeat([repeat]);
          declarations.get("background-repeat-x").push(repeat.get("background-repeat-x")[0]);
          declarations.get("background-repeat-y").push(repeat.get("background-repeat-y")[0]);
        }
        return;
      }
      if (longhand === "background-repeat-y") {
        return;
      }
      let value;
      switch (longhand) {
        case "background-image":
          value = image;
          break;
        case "background-position-x":
        case "background-position-y":
          value = cssValues.isOmitted(position)
            ? position
            : splitPosition(position)[longhand === "background-position-x" ? 0 : 1];
          break;
        case "background-size":
          value = size;
          break;
        case "background-attachment":
          value = attachment;
          break;
        case "background-origin":
          if (cssValues.isOmitted(origin) && !cssValues.isOmitted(clip)) {
            value = cssValues.keyword("border-box", ["<visual-box>"]);
          } else {
            value = origin;
          }
          break;
        case "background-clip":
          value = cssValues.isOmitted(clip) ? origin : clip;
          break;
      }
      declarations
        .get(longhand)
        .push(cssValues.isOmitted(value) ? resolveModule.getInitialValue(longhand)[0] : value);
    });
  });
  return declarations;
}

// https://drafts.csswg.org/css-backgrounds-4/#background-repeat
function parseBackgroundPosition(values) {
  const x = [];
  const y = [];
  for (const position of values) {
    const [horizontal, vertical] = splitPosition(position);
    x.push(horizontal);
    y.push(vertical);
  }
  return new Map([
    ["background-position-x", cssValues.list(x, ",")],
    ["background-position-y", cssValues.list(y, ",")],
  ]);
}
function parseBackgroundRepeat(values) {
  const x = [];
  const y = [];
  values.forEach((style) => {
    if (style.value === "repeat-x") {
      x.push(defaultsModule.repeat);
      y.push(defaultsModule.noRepeat);
    } else if (style.value === "repeat-y") {
      x.push(defaultsModule.noRepeat);
      y.push(defaultsModule.repeat);
    } else {
      x.push(style[0]);
      y.push(style[1] ?? style[0]);
    }
  });
  return new Map([
    ["background-repeat-x", cssValues.list(x, ",")],
    ["background-repeat-y", cssValues.list(y, ",")],
  ]);
}

// https://drafts.csswg.org/css-borders-4/#propdef-border
// https://drafts.csswg.org/css-logical-1/#propdef-border-block
// https://drafts.csswg.org/css-logical-1/#propdef-border-inline
function parseBorder(values, longhands, sides) {
  const length = sides * 3;
  return new Map(
    longhands.map((longhand, index) => {
      if (index < length) {
        const typeIndex = Math.floor((index / sides) % 3);
        const type = borderTypes.at(typeIndex);
        const value = values.find((entryValue) => entryValue.types.includes(type));
        return [longhand, value ?? resolveModule.getInitialValue(longhand)];
      }
      return [longhand, resolveModule.getInitialValue(longhand)];
    }),
  );
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-image
// https://drafts.csswg.org/css-masking-1/#propdef-mask-border
// https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration
function parseNamedProperties(values, longhands) {
  return values.reduce(function setLonghand(entryValues, value) {
    if (!cssValues.isOmitted(value)) {
      const longhand = value.types.at(-1);
      if (longhand?.startsWith("<'")) {
        entryValues.set(longhand.slice(2, -2), value);
      } else if (cssValues.isList(value)) {
        value.reduce(setLonghand, entryValues);
      }
    }
    return entryValues;
  }, getInitialDeclarations(longhands));
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-radius
function parseBorderRadius([horizontal, vertical], longhands) {
  return parseByIndex(
    horizontal.map((radius, index) => cssValues.list([radius, vertical[index]])),
    longhands,
  );
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-top-radius
function parseBorderSideRadius([[ha, hb = ha], vertical], [a, b]) {
  if (cssValues.isOmitted(vertical)) {
    return new Map([
      [a, cssValues.list([ha, ha])],
      [b, cssValues.list([hb, hb])],
    ]);
  }
  const [, [va, vb = va]] = vertical;
  return new Map([
    [a, cssValues.list([ha, va])],
    [b, cssValues.list([hb, vb])],
  ]);
}

// https://drafts.csswg.org/css-borders-4/#propdef-box-shadow
function parseBoxShadow(shadows, longhands) {
  const declarations = new Map(longhands.map((longhand) => [longhand, cssValues.list([], ",")]));
  shadows.forEach(([color, [offset, options], position]) => {
    let blur, spread;
    if (cssValues.isOmitted(color)) {
      color =
        offset.value === "none"
          ? defaultsModule.transparent
          : resolveModule.getInitialValue("box-shadow-color")[0];
    }
    if (cssValues.isOmitted(options)) {
      blur = resolveModule.getInitialValue("box-shadow-blur")[0];
      spread = resolveModule.getInitialValue("box-shadow-spread")[0];
    } else {
      [blur, spread] = options;
      spread = getDeclaredOrInitialCoordinatedValue("box-shadow-spread", spread);
    }
    position = getDeclaredOrInitialCoordinatedValue("box-shadow-position", position);
    declarations.get("box-shadow-color").push(color);
    declarations.get("box-shadow-offset").push(offset);
    declarations.get("box-shadow-blur").push(blur);
    declarations.get("box-shadow-spread").push(spread);
    declarations.get("box-shadow-position").push(position);
  });
  return declarations;
}

// https://drafts.csswg.org/css-multicol-2/#propdef-columns
function parseColumns(columns, longhands) {
  const [width, count, , height] = columns.flat();
  return parseByIndex([width, count, height], longhands);
}

// https://drafts.csswg.org/css-conditional-5/#propdef-container
function parseContainer([name, type]) {
  return new Map([
    ["container-name", name],
    [
      "container-type",
      cssValues.isOmitted(type) ? resolveModule.getInitialValue("container-type") : type[1],
    ],
  ]);
}

// https://drafts.csswg.org/css-borders-4/#propdef-corner
function parseCorner([radii, shape], longhands) {
  if (cssValues.isOmitted(radii)) {
    const direction = cssValues.list([
      defaultsModule.zeroPx,
      defaultsModule.zeroPx,
      defaultsModule.zeroPx,
      defaultsModule.zeroPx,
    ]);
    radii = cssValues.list([direction, direction]);
  } else if (cssValues.isOmitted(shape)) {
    shape = cssValues.list([resolveModule.getInitialValue("corner-top-left-shape")]);
  }
  shape = parseSides(shape, longhands.slice(4));
  return new Map([
    ...parseBorderRadius(radii, longhands.slice(0, 4)),
    ...parseByIndex(shape, longhands.slice(4)),
  ]);
}

// https://drafts.csswg.org/css-borders-4/#propdef-corner-top
function parseCornerSide([radii, shape], longhands) {
  if (cssValues.isOmitted(radii)) {
    radii = cssValues.list([cssValues.list([defaultsModule.zeroPx]), cssValues.omitted]);
  } else if (cssValues.isOmitted(shape)) {
    shape = cssValues.list([resolveModule.getInitialValue("corner-top-left-shape")]);
  }
  shape = parseSides(shape, longhands.slice(2));
  return new Map([
    ...parseBorderSideRadius(radii, longhands.slice(0, 2)),
    ...parseByIndex(shape, longhands.slice(2)),
  ]);
}

// https://drafts.csswg.org/css-flexbox-2/#propdef-flex
function parseFlex(values) {
  if (cssValues.isList(values)) {
    const [growShrink, basis] = values;
    if (cssValues.isOmitted(basis)) {
      const [grow, shrink] = growShrink;
      return new Map([
        ["flex-grow", grow],
        ["flex-shrink", getDeclaredOrInitialValue("flex-shrink", shrink)],
        ["flex-basis", cssValues.percentage(0)],
      ]);
    }
    if (cssValues.isOmitted(growShrink)) {
      return new Map([
        ["flex-grow", defaultsModule.one],
        ["flex-shrink", resolveModule.getInitialValue("flex-shrink")],
        ["flex-basis", basis],
      ]);
    }
    const [grow, shrink] = growShrink;
    return new Map([
      ["flex-grow", grow],
      ["flex-shrink", getDeclaredOrInitialValue("flex-shrink", shrink)],
      ["flex-basis", basis],
    ]);
  }
  // none
  return new Map([
    ["flex-basis", defaultsModule.auto],
    ["flex-grow", defaultsModule.zero],
    ["flex-shrink", defaultsModule.zero],
  ]);
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font
function parseFont(values, longhands, resetOnly) {
  const declarations = getInitialDeclarations([...longhands, ...resetOnly]);
  if (cssValues.isList(values)) {
    const [settings, size, lineHeight, family] = values;
    declarations.set("font-size", size);
    declarations.set("font-family", family);
    if (!cssValues.isOmitted(lineHeight)) {
      declarations.set("line-height", lineHeight[1]);
    }
    if (!cssValues.isOmitted(settings)) {
      const [style, variant, weight, stretch] = settings;
      if (!cssValues.isOmitted(style)) {
        declarations.set("font-style", style);
      }
      if (!cssValues.isOmitted(variant)) {
        declarations.set("font-variant-caps", variant);
      }
      if (!cssValues.isOmitted(weight)) {
        declarations.set("font-weight", weight);
      }
      if (!cssValues.isOmitted(stretch)) {
        declarations.set("font-width", stretch);
      }
    }
  } else {
    const value = {
      name: "system-font",
      types: ["<function>", "<system-font()>"],
      value: values,
    };
    longhands.forEach((longhand) => declarations.set(longhand, value));
  }
  return declarations;
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font-synthesis
function parseFontSynthesis(values, longhands) {
  return cssValues.isList(values)
    ? parseByIndex(
        values.map((value) => {
          return cssValues.isOmitted(value) ? defaultsModule.none : defaultsModule.auto;
        }),
        longhands,
      )
    : setLonghands(values, longhands);
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font-variant
function parseFontVariant(values, longhands) {
  if (cssValues.isList(values)) {
    return parseByIndex(values, longhands);
  }
  const declarations = getInitialDeclarations(longhands);
  if (values.value === "normal") {
    return declarations;
  }
  return declarations.set("font-variant-ligatures", defaultsModule.none);
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid
function parseGrid(template, longhands) {
  const declarations = getInitialDeclarations(longhands);
  if (template.value === "none") {
    return declarations;
  }
  if (template.types.at(-2) === "<'grid-template'>") {
    return new Map([...declarations, ...parseGridTemplate(template)]);
  }
  const [head, ...tail] = template;
  if (head.types.at(-1) === "<'grid-template-rows'>") {
    const [, [, dense], columns] = tail;
    declarations.set("grid-template-rows", head);
    declarations.set("grid-auto-flow", cssValues.list([defaultsModule.column, dense]));
    declarations.set("grid-auto-rows", resolveModule.getInitialValue("grid-auto-rows"));
    declarations.set("grid-auto-columns", getDeclaredOrInitialValue("grid-auto-columns", columns));
    return declarations;
  }
  const dense = head[1];
  const [rows, , columns] = tail;
  declarations.set("grid-template-columns", columns);
  declarations.set("grid-auto-flow", cssValues.list([defaultsModule.row, dense]));
  declarations.set("grid-auto-rows", getDeclaredOrInitialValue("grid-auto-rows", rows));
  declarations.set("grid-auto-columns", resolveModule.getInitialValue("grid-auto-columns"));
  return declarations;
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid-area
function parseGridArea([head, tail], longhands) {
  const lines = [head];
  for (let index = 0; index < longhands.length; index++) {
    const line = tail[index];
    if (line) {
      lines.push(line[1]);
      continue;
    }
    const opposite = index < 2 ? head : lines[1];
    lines.push(opposite.types.includes("<ident>") ? opposite : defaultsModule.auto);
  }
  return parseByIndex(lines, longhands);
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid-column
// https://drafts.csswg.org/css-grid-2/#propdef-grid-row
function parseGridLine([start, end], longhands) {
  return parseGridArea([start, cssValues.isOmitted(end) ? [] : [end]], longhands);
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid-template
function parseGridTemplate(template, longhands) {
  if (template.value === "none") {
    return getInitialDeclarations(longhands);
  }
  const [head, ...tail] = template;
  if (head.types.at(-1) === "<'grid-template-rows'>") {
    const columns = tail[1];
    return new Map([
      ["grid-template-rows", head],
      ["grid-template-columns", columns],
      ["grid-template-areas", defaultsModule.none],
    ]);
  }
  const columns = tail[0];
  const rows = cssValues.list();
  const areas = cssValues.list();
  let lineNames = cssValues.omitted;
  head.forEach(([start, string, size, end]) => {
    areas.push(string);
    if (!cssValues.isOmitted(start)) {
      if (!lineNames || cssValues.isOmitted(lineNames)) {
        lineNames = start;
      } else {
        lineNames = {
          ...lineNames,
          value: cssValues.list(
            [...lineNames.value, ...start.value],
            lineNames.value.separator,
            lineNames.value.types,
          ),
        };
      }
    }
    rows.push(cssValues.list([lineNames, cssValues.isOmitted(size) ? defaultsModule.auto : size]));
    lineNames = end;
  });
  return new Map([
    [
      "grid-template-rows",
      cssValues.list([rows, lineNames], " ", ["<track-list>", "<explicit-track-list>"]),
    ],
    ["grid-template-columns", cssValues.isOmitted(columns) ? defaultsModule.none : columns[1]],
    ["grid-template-areas", areas],
  ]);
}

// https://drafts.csswg.org/css-overflow-4/#propdef-line-clamp
// https://drafts.csswg.org/css-overflow-4/#propdef--webkit-line-clamp
function parseLineClamp(values, longhands, legacy) {
  if (legacy) {
    if (values.value === "none") {
      return new Map([
        ["max-lines", resolveModule.getInitialValue("max-lines")],
        ["block-ellipsis", defaultsModule.ellipsis],
        ["continue", resolveModule.getInitialValue("continue")],
      ]);
    }
    return new Map([
      ["max-lines", values],
      ["block-ellipsis", defaultsModule.ellipsis],
      ["continue", defaultsModule.webkitLegacy],
    ]);
  }
  if (values.value === "none") {
    return getInitialDeclarations(longhands);
  }
  let [[maxLines, blockEllipsis], fragment] = values;
  if (cssValues.isOmitted(maxLines)) {
    maxLines = resolveModule.getInitialValue("max-lines");
  } else if (cssValues.isOmitted(blockEllipsis)) {
    blockEllipsis = defaultsModule.ellipsis;
  }
  if (cssValues.isOmitted(fragment)) {
    fragment = defaultsModule.collapse;
  }
  return new Map([
    ["max-lines", maxLines],
    ["block-ellipsis", blockEllipsis],
    ["continue", fragment],
  ]);
}

// https://drafts.csswg.org/css-lists-3/#propdef-list-style
function parseListStyle(values, longhands) {
  const [position, image, type] = values;
  if (image.value === "none" && cssValues.isOmitted(type)) {
    return new Map([
      ["list-style-position", getDeclaredOrInitialValue("list-style-position", position)],
      ["list-style-image", image],
      ["list-style-type", image],
    ]);
  }
  return parseByIndex(values, longhands);
}

// https://drafts.csswg.org/css-masking-1/#propdef-mask
function parseMask(masks, longhands, resetOnly) {
  const positionIndex = longhands.indexOf("mask-position");
  const declarations = new Map();
  longhands.forEach((longhand) => declarations.set(longhand, cssValues.list([], ",")));
  resetOnly.forEach((longhand) =>
    declarations.set(longhand, resolveModule.getInitialValue(longhand)),
  );
  masks.forEach((layer) => {
    const [, positionSize, , origin, clip] = layer;
    layer = [...layer];
    if (cssValues.isOmitted(positionSize)) {
      layer.splice(positionIndex, 1, positionSize, positionSize);
    } else {
      const [position, size] = positionSize;
      layer.splice(positionIndex, 1, position, cssValues.isOmitted(size) ? size : size[1]);
    }
    longhands.forEach((longhand, longhandIndex) => {
      let value = layer[longhandIndex];
      if (cssValues.isOmitted(value)) {
        if (longhand === "mask-origin" && clip.types.includes("<geometry-box>")) {
          value = clip;
        } else if (longhand === "mask-clip" && !cssValues.isOmitted(origin)) {
          value = origin;
        } else {
          value = resolveModule.getInitialValue(longhand)[0];
        }
      }
      declarations.get(longhand).push(value);
    });
  });
  return declarations;
}

// https://drafts.csswg.org/motion-1/#propdef-offset
function parseOffset([[position, center], anchor], longhands) {
  const declarations = getInitialDeclarations(longhands);
  if (!cssValues.isOmitted(position)) {
    declarations.set("offset-position", position);
  }
  if (!cssValues.isOmitted(anchor)) {
    declarations.set("offset-anchor", anchor[1]);
  }
  if (!cssValues.isOmitted(center)) {
    const [path, tail] = center;
    declarations.set("offset-path", path);
    if (cssValues.isOmitted(tail)) {
      return declarations;
    }
    const [distance, rotate] = tail;
    if (!cssValues.isOmitted(distance)) {
      declarations.set("offset-distance", distance);
    }
    if (!cssValues.isOmitted(rotate)) {
      declarations.set("offset-rotate", rotate);
    }
  }
  return declarations;
}

// https://drafts.csswg.org/css-ui-4/#propdef-outline
function parseOutline([width, style, color], longhands) {
  if (color.value === "auto" && cssValues.isOmitted(style)) {
    style = defaultsModule.auto;
  }
  return parseByIndex([width, style, color], longhands);
}

// https://drafts.csswg.org/css-align-3/#propdef-place-content
function parsePlaceContent([align, justify], longhands) {
  if (cssValues.isOmitted(justify)) {
    justify = align.types.includes("<baseline-position>") ? defaultsModule.start : align;
  }
  return parseByIndex([align, justify], longhands);
}

// https://drafts.csswg.org/css-align-3/#propdef-place-items
function parsePlaceItems([align, justify]) {
  return new Map([
    ["align-items", align],
    ["justify-items", cssValues.isOmitted(justify) ? align : justify],
  ]);
}

// https://drafts.csswg.org/css-text-4/#propdef-text-align
function parseTextAlign(value, longhands) {
  switch (value.value) {
    case "justify-all":
      return parseByIndex([defaultsModule.justify, defaultsModule.justify], longhands);
    case "match-parent":
      return parseByIndex([value, value], longhands);
    default:
      return parseByIndex([value, defaultsModule.auto], longhands);
  }
}

// https://drafts.csswg.org/css-inline-3/#propdef-text-box-edge
function parseTextBox(values, longhands) {
  if (cssValues.isList(values)) {
    let [trim, edge] = values;
    if (cssValues.isOmitted(trim)) {
      trim = cssValues.keyword("trim-both", "text-box-trim");
    } else if (cssValues.isOmitted(edge)) {
      edge = cssValues.keyword("auto", "text-box-edge");
    }
    return new Map([
      ["text-box-trim", trim],
      ["text-box-edge", edge],
    ]);
  }
  return getInitialDeclarations(longhands);
}

// https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration-skip
function parseTextDecorationSkip(value, longhands) {
  if (value.value === "auto") {
    return getInitialDeclarations(longhands);
  }
  const declarations = setLonghands(value, longhands);
  declarations.set(
    "text-decoration-skip-self",
    cssValues.keyword("no-skip", ["text-decoration-skip-self"]),
  );
  return declarations;
}

// https://drafts.csswg.org/css-text-4/#propdef-text-spacing
function parseTextSpacing(values, longhands) {
  if (cssValues.isList(values)) {
    return parseByIndex(values, longhands);
  }
  switch (values.value) {
    case "auto":
      return setLonghands(defaultsModule.auto, longhands);
    case "none":
      return new Map([
        ["text-spacing-trim", defaultsModule.spaceAll],
        ["text-autospace", defaultsModule.noAutospace],
      ]);
    default:
      // normal
      return new Map([
        ["text-spacing-trim", defaultsModule.spacingTrim],
        ["text-autospace", values],
      ]);
  }
}

// https://drafts.csswg.org/css-gaps-1/#propdef-column-rule
// https://drafts.csswg.org/css-gaps-1/#propdef-row-rule
// https://drafts.csswg.org/css-gaps-1/#propdef-rule
function parseRule(rules, longhands, shorthand) {
  if (shorthand === "rule") {
    rules = parseRule(rules, shorthandProperties.get("row-rule")[0], "row-rule");
    const declarations = longhands.map((longhand) => [
      longhand,
      rules.get(longhand.replace("column", "row")),
    ]);
    return new Map(declarations);
  }
  const declarations = new Map(longhands.map((longhand) => [longhand, cssValues.list([], ",")]));
  rules.forEach((rule) => {
    if (cssValues.isList(rule)) {
      const [width, style, color] = rule;
      declarations
        .get(`${shorthand}-width`)
        .push(getDeclaredOrInitialCoordinatedValue(`${shorthand}-width`, width));
      declarations
        .get(`${shorthand}-style`)
        .push(getDeclaredOrInitialCoordinatedValue(`${shorthand}-style`, style));
      declarations
        .get(`${shorthand}-color`)
        .push(getDeclaredOrInitialCoordinatedValue(`${shorthand}-color`, color));
    } else if (cssValues.isFunction(rule)) {
      const {
        name,
        value: [n, , entryRules],
      } = rule;
      const widths = cssValues.list();
      const styles = cssValues.list();
      const colors = cssValues.list();
      entryRules.forEach(([width, style, color]) => {
        widths.push(getDeclaredOrInitialCoordinatedValue(`${shorthand}-width`, width));
        styles.push(getDeclaredOrInitialCoordinatedValue(`${shorthand}-style`, style));
        colors.push(getDeclaredOrInitialCoordinatedValue(`${shorthand}-color`, color));
      });
      declarations.get(`${shorthand}-width`).push({
        name,
        types: ["<function>"],
        value: cssValues.list([n, defaultsModule.comma, widths]),
      });
      declarations.get(`${shorthand}-style`).push({
        name,
        types: ["<function>"],
        value: cssValues.list([n, defaultsModule.comma, styles]),
      });
      declarations.get(`${shorthand}-color`).push({
        name,
        types: ["<function>"],
        value: cssValues.list([n, defaultsModule.comma, colors]),
      });
    }
  });
  return declarations;
}

// https://drafts.csswg.org/css-gaps-1/#propdef-column-rule-inset-cap
// https://drafts.csswg.org/css-gaps-1/#propdef-column-rule-inset-junction
// https://drafts.csswg.org/css-gaps-1/#propdef-column-rule-inset
// https://drafts.csswg.org/css-gaps-1/#propdef-row-rule-inset-cap
// https://drafts.csswg.org/css-gaps-1/#propdef-row-rule-inset-junction
// https://drafts.csswg.org/css-gaps-1/#propdef-row-rule-inset
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-inset-cap
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-inset-junction
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-inset
function parseRuleInset(insets, longhands, name) {
  if (name.endsWith("inset")) {
    insets = insets.flat(2);
    insets.splice(2, 1);
  }
  const divisor = name.startsWith("rule") ? 2 : 1;
  const entries = [];
  longhands.forEach((longhand, index) => {
    index = Math.floor(index / divisor);
    let value = insets[index];
    if (cssValues.isOmitted(value)) {
      value = entries[(index - 1) * divisor][1];
    } else if (!value) {
      value = entries[(index - 2) * divisor][1];
    }
    entries.push([longhand, value]);
  });
  return new Map(entries);
}

function parseSides(values, { length: sides }) {
  values = [...values];
  while (cssValues.isOmitted(values.at(-1))) {
    values.pop();
  }
  let { length } = values;
  while (length < sides) {
    values.push(values[Math.max(0, length++ - 2)]);
  }
  return values;
}

// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger
function parseTimelineTrigger(triggers, longhands) {
  const initial = getInitialDeclarations(longhands);
  if (!cssValues.isList(triggers)) {
    initial.set("timeline-trigger-source", cssValues.list([cssValues.keyword("none")], ","));
    return initial;
  }
  const declarations = new Map(longhands.map((longhand) => [longhand, cssValues.list([], ",")]));
  triggers.forEach((trigger) => {
    const [name, source, ranges] = trigger;
    let activationRangeStart = initial.get("timeline-trigger-activation-range-start")[0];
    let activationRangeEnd = initial.get("timeline-trigger-activation-range-end")[0];
    let activeRangeStart = initial.get("timeline-trigger-active-range-start")[0];
    let activeRangeEnd = initial.get("timeline-trigger-active-range-end")[0];
    if (!cssValues.isOmitted(ranges)) {
      const [activationRange, activeRange] = ranges;
      [activationRangeStart, activationRangeEnd] = parseAnimationRangeValue(
        activationRange,
        "timeline-trigger-activation-range-end",
      );
      if (cssValues.isOmitted(activationRangeEnd)) {
        activationRangeEnd = initial.get("timeline-trigger-activation-range-end")[0];
      }
      if (!cssValues.isOmitted(activeRange)) {
        [activeRangeStart, activeRangeEnd] = parseAnimationRangeValue(
          activeRange[1],
          "timeline-trigger-active-range-end",
        );
        if (cssValues.isOmitted(activeRangeEnd)) {
          activeRangeEnd = initial.get("timeline-trigger-active-range-end")[0];
        }
      }
    }
    declarations.get("timeline-trigger-name").push(name);
    declarations.get("timeline-trigger-source").push(source);
    declarations.get("timeline-trigger-activation-range-start").push(activationRangeStart);
    declarations.get("timeline-trigger-activation-range-end").push(activationRangeEnd);
    declarations.get("timeline-trigger-active-range-start").push(activeRangeStart);
    declarations.get("timeline-trigger-active-range-end").push(activeRangeEnd);
  });
  return declarations;
}

// https://drafts.csswg.org/scroll-animations-1/#propdef-view-timeline
function parseViewTimeline(values, longhands) {
  values = values.map((value) => {
    return cssValues.isOmitted(value[1])
      ? [value[0], cssValues.omitted, cssValues.omitted]
      : value.flat();
  });
  return parseCoordinatedValues(values, longhands);
}

// https://drafts.csswg.org/css-text-4/#propdef-white-space
function parseWhiteSpace(values, longhands) {
  if (!cssValues.isList(values)) {
    values = whiteSpace.mapping.get(values.value);
  }
  return parseByIndex(values, longhands);
}

function parse(value, name, subProperties) {
  if (substitutionsModule.keywords.includes(value.value)) {
    return setLonghands(value, subProperties.flat());
  }
  const [longhands, resetOnly] = subProperties;
  switch (name) {
    case "-webkit-line-clamp":
      return parseLineClamp(value, longhands, true);
    case "animation":
      return parseAnimation(value, longhands, resetOnly);
    case "animation-delay":
    case "transition":
    case "scroll-timeline":
      return parseCoordinatedValues(value, longhands);
    case "animation-range":
    case "timeline-trigger-activation-range":
    case "timeline-trigger-active-range":
      return parseAnimationRange(value, longhands);
    case "background":
      return parseBackground(value, longhands, resetOnly);
    case "background-position":
      return parseBackgroundPosition(value);
    case "background-repeat":
      return parseBackgroundRepeat(value, longhands);
    case "border":
      return parseBorder(value, subProperties.flat(), 4);
    case "border-block":
    case "border-inline":
      return parseBorder(value, longhands, 2);
    case "border-block-color":
    case "border-block-style":
    case "border-block-width":
    case "border-color":
    case "border-inline-color":
    case "border-inline-style":
    case "border-inline-width":
    case "border-style":
    case "border-width":
    case "contain-intrinsic-size":
    case "corner-block-end-shape":
    case "corner-block-start-shape":
    case "corner-bottom-shape":
    case "corner-inline-end-shape":
    case "corner-inline-start-shape":
    case "corner-left-shape":
    case "corner-right-shape":
    case "corner-shape":
    case "corner-top-shape":
    case "gap":
    case "inset":
    case "inset-block":
    case "inset-inline":
    case "interest-delay":
    case "margin":
    case "margin-block":
    case "margin-inline":
    case "overflow":
    case "overscroll-behavior":
    case "padding":
    case "padding-block":
    case "padding-inline":
    case "place-self":
    case "scroll-margin":
    case "scroll-margin-block":
    case "scroll-margin-inline":
    case "scroll-padding":
    case "scroll-padding-block":
    case "scroll-padding-inline":
      return parseByIndex(parseSides(value, longhands), longhands);
    case "border-block-end-radius":
    case "border-block-start-radius":
    case "border-bottom-radius":
    case "border-inline-end-radius":
    case "border-inline-start-radius":
    case "border-left-radius":
    case "border-right-radius":
    case "border-top-radius":
      return parseBorderSideRadius(value, longhands);
    case "border-block-clip":
    case "border-clip":
    case "border-inline-clip":
    case "color-adjust":
    case "column-rule-inset-end":
    case "column-rule-inset-start":
    case "glyph-orientation-vertical":
    case "marker":
    case "overflow-clip-margin":
    case "overflow-clip-margin-block":
    case "overflow-clip-margin-inline":
    case "page-break-after":
    case "page-break-before":
    case "page-break-inside":
    case "row-rule-inset-end":
    case "row-rule-inset-start":
    case "rule-break":
    case "rule-color":
    case "rule-inset-end":
    case "rule-inset-start":
    case "rule-style":
    case "rule-visibility-items":
    case "rule-width":
      return setLonghands(value, longhands);
    case "border-image":
    case "mask-border":
    case "text-decoration":
      return parseNamedProperties(value, longhands);
    case "border-radius":
      return parseBorderRadius(value, longhands);
    case "box-shadow":
      return parseBoxShadow(value, longhands);
    case "column-rule":
    case "row-rule":
    case "rule":
      return parseRule(value, longhands, name);
    case "column-rule-inset":
    case "column-rule-inset-cap":
    case "column-rule-inset-junction":
    case "row-rule-inset":
    case "row-rule-inset-cap":
    case "row-rule-inset-junction":
    case "rule-inset":
    case "rule-inset-cap":
    case "rule-inset-junction":
      return parseRuleInset(value, longhands, name);
    case "columns":
      return parseColumns(value, longhands);
    case "container":
      return parseContainer(value);
    case "corner":
      return parseCorner(value, longhands);
    case "corner-block-end":
    case "corner-block-start":
    case "corner-bottom":
    case "corner-inline-end":
    case "corner-inline-start":
    case "corner-left":
    case "corner-right":
    case "corner-top":
      return parseCornerSide(value, longhands);
    case "flex":
      return parseFlex(value, longhands);
    case "font":
      return parseFont(value, longhands, resetOnly);
    case "font-synthesis":
      return parseFontSynthesis(value, longhands);
    case "font-variant":
      return parseFontVariant(value, longhands);
    case "grid":
      return parseGrid(value, longhands);
    case "grid-area":
      return parseGridArea(value, longhands);
    case "grid-column":
    case "grid-row":
      return parseGridLine(value, longhands);
    case "grid-template":
      return parseGridTemplate(value, longhands);
    case "line-clamp":
      return parseLineClamp(value, longhands);
    case "list-style":
      return parseListStyle(value, longhands);
    case "mask":
      return parseMask(value, longhands, resetOnly);
    case "offset":
      return parseOffset(value, longhands);
    case "outline":
      return parseOutline(value, longhands);
    case "place-content":
      return parsePlaceContent(value, longhands);
    case "place-items":
      return parsePlaceItems(value, longhands);
    case "text-align":
      return parseTextAlign(value, longhands);
    case "text-box":
      return parseTextBox(value, longhands);
    case "text-decoration-skip":
      return parseTextDecorationSkip(value, longhands);
    case "text-spacing":
      return parseTextSpacing(value, longhands);
    case "timeline-trigger":
      return parseTimelineTrigger(value, longhands);
    case "view-timeline":
      return parseViewTimeline(value, longhands);
    case "white-space":
      return parseWhiteSpace(value, longhands);
    default:
      return parseByIndex(value, longhands);
  }
}

function expand(declaration) {
  const { important, name, pending, value } = declaration;
  const subProperties = shorthandProperties.get(name);
  if (pending) {
    return subProperties.flat().map((entryName) => ({
      ...declaration,
      name: entryName,
    }));
  }
  let cached = expansions.get(value);
  const key = `${name}:${Boolean(important)}`;
  if (cached?.has(key)) {
    return cached.get(key);
  }
  cached = new Map(cached);
  const map = parse(value, name, subProperties);
  const declarations = [];
  map.forEach((entryValue, entryName) =>
    declarations.push({
      important,
      name: entryName,
      value: entryValue,
    }),
  );
  const seen = new Set();
  let size = syntaxSize(declarations, seen);
  const shorthandGroup = {
    name,
    length: declarations.length,
    // Replace the expansion array's record/slots with this group's record/name.
    // The record charges cancel; only retained members contribute syntax.
    size: size - declarations.length * 8 + name.length * 2,
  };
  for (const longhand of declarations) {
    shorthandGroups.set(longhand, shorthandGroup);
  }
  size += syntaxSize(value, seen);
  for (const previous of cached.values()) {
    size += syntaxSize(previous, seen);
  }
  cached.set(key, declarations);
  // Reproduce the existing union root's record/slots after visiting every
  // child graph once, starting with new members rather than the parsed input or older variants.
  size += syntaxObjectSize + (cached.size + 1) * 8;
  expansions.set(value, cached, { size });
  return declarations;
}
