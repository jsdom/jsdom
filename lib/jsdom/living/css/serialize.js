"use strict";

// The `FromPrimitive` suffix distinguishes helpers taking a JavaScript number or string
// from their parsed-value adapters.

exports.serializeAttributeSelector = serializeAttributeSelector;
exports.serializeComponentValue = serializeComponentValue;
exports.serializeComponentValues = serializeComponentValues;
exports.serializeDeclarationBlock = serializeDeclarationBlock;
exports.serializeIdentifier = serializeIdentifier;
exports.serializeIdentifierFromPrimitive = serializeIdentifierFromPrimitive;
exports.serializeStringFromPrimitive = serializeStringFromPrimitive;
exports.serializeURL = serializeURL;
exports.serializeURLFromPrimitive = serializeURLFromPrimitive;
exports.serializeDeclarationValue = serializeDeclarationValue;
exports.getShorthandMetadata = getShorthandMetadata;
const { combinePosition } = require("./utils/position.js");
const whiteSpace = require("./values/white-space.js");
const integerModule = require("./values/integer.js");
const dimensionValues = require("./values/dimension.js");
const mathUtils = require("./utils/math.js");
const { hslToRGB, hwbToRGB } = require("./utils/color-spaces.js");
const cssValues = require("./values/value.js");
const stringUtils = require("./utils/string.js");
const blockModule = require("./values/block.js");
const defaultsModule = require("./values/defaults.js");
const colorValues = require("./values/color.js");
const substitutionsModule = require("./values/substitutions.js");
const logicalGroups = require("./properties/logical.js");
const propertyDefinitions = require("../../../generated/css-property-definitions.js");
const shorthandProperties = require("./properties/shorthands.js");
const valueDefinitions = require("../../../generated/css-value-definitions.js");
const fontFamilyKeywords = new Set([
  ...valueDefinitions["<generic-font-complete>"].split(" | "),
  ...valueDefinitions["<generic-font-incomplete>"].split(" | ")
]);
const customIdentifierKeywords = new Set(["default", ...substitutionsModule.keywords]);

function simplifySides(sides) {
  sides = [...sides];
  let index = sides.length;
  while (index-- > 1) {
    const side = sides[index];
    const opposite = sides[index - 2] ?? sides[0];
    if (side !== opposite) {
      break;
    }
    sides.pop();
  }
  return sides.join(" ");
}

// https://drafts.csswg.org/css-color-4/#serializing-alpha-values
function serializeAlpha({ types, value }, is8Bit) {
  if (types.includes("<percentage>")) {
    value /= 100;
  }
  if (is8Bit) {
    const alpha = Math.round(value * 255);
    const integer = Math.round(value * 100);
    if (Math.round(mathUtils.safeFloat(integer * 2.55)) === alpha) {
      value = integer / 100;
    } else {
      value = Math.round(alpha / 0.255) / 1000;
    }
  }
  return serializeNumberFromPrimitive(value);
}

function serializeArbitraryDeclaration(declaration) {
  if (declaration.representation !== undefined) {
    return declaration.representation;
  }
  const { name, important } = declaration;
  return formatDeclaration(name, serializeDeclarationValue(declaration), important, false);
}

// https://drafts.csswg.org/css-syntax-3/#serialize-an-a-n-plus-b-value
function serializeAnB({ value: { a, b } }) {
  if (a === 0) {
    return `${b}`;
  }
  let string = "";
  if (a === 1) {
    string += "n";
  } else if (a === -1) {
    string += "-n";
  } else {
    string += `${a}n`;
  }
  if (b > 0) {
    string += `+${b}`;
  } else if (b < 0) {
    string += b;
  }
  return string;
}

// https://drafts.csswg.org/css-values-5/#funcdef-attr
function serializeAttrFunction({ value }) {
  const [name, syntax, , fallback] = value.map(serializeComponentValue);
  if (syntax === "raw-string" && fallback === '""') {
    return `attr(${name})`;
  }
  let string = `attr(${name}`;
  if (syntax) {
    string += ` ${syntax}`;
  }
  if (fallback) {
    string += `, ${fallback}`;
  }
  string += ")";
  return string;
}

// https://drafts.csswg.org/cssom/#serialize-a-simple-selector
function serializeAttributeSelector({ value }) {
  const hasValue = !value.types.includes("<wq-name>");
  const [name, matcher, expected, modifier] = hasValue ? value : [value];
  const [prefix, localName] = name;
  const namespace = cssValues.isOmitted(prefix) || cssValues.isOmitted(prefix[0]) ?
    "" :
    serializeComponentValue(prefix);
  let string = `[${namespace}${serializeIdentifier(localName)}`;
  if (hasValue) {
    string += serializeComponentValue(matcher) + serializeComponentValue(expected);
    if (!cssValues.isOmitted(modifier)) {
      string += ` ${serializeComponentValue(modifier)}`;
    }
  }
  return `${string}]`;
}

// https://drafts.csswg.org/css-shapes-2/#typedef-shape-arc-command
function serializeArcCommand([, endpoint, [[, radius], sweep, size, rotation]]) {
  let string = `arc ${serializeComponentValue(endpoint)} of ${serializeRadialSize(radius)}`;
  if (sweep.value === "cw") {
    string += " cw";
  }
  if (size.value === "large") {
    string += " large";
  }
  rotation = serializeComponentValue(rotation);
  if (rotation && rotation !== "rotate 0deg") {
    string += ` ${rotation}`;
  }
  return string;
}

// https://drafts.csswg.org/css-align-3/#typedef-baseline-position
function serializeBaselinePosition([place]) {
  if (cssValues.isOmitted(place) || place.value === "first") {
    return "baseline";
  }
  return "last baseline";
}

function serializeGridLine(line) {
  if (!cssValues.isList(line)) {
    return serializeIdentifier(line);
  }
  if (line[0].value === "span") {
    const [count, name] = line[1];
    if (count.value === 1 && !cssValues.isOmitted(name)) {
      return `span ${serializeComponentValue(name)}`;
    }
  }
  return serializeComponentValues(line);
}

// https://drafts.csswg.org/css-shapes-1/#typedef-basic-shape-rect
function serializeBasicShapeRect({ name, value }) {
  const corners = value.at(-1);
  value = name === "inset" ? serializeSides(value[0]) : serializeComponentValues(value.slice(0, -1));
  if (cssValues.isOmitted(corners)) {
    return `${name}(${value})`;
  }
  const radius = serializeBorderRadius(corners[1]);
  if (radius === "0px") {
    return `${name}(${value})`;
  }
  return `${name}(${value} round ${radius})`;
}

function serializeBlock({ associatedToken, value }) {
  return `${associatedToken}${serializeComponentValue(value)}${blockModule.associatedTokens[associatedToken]}`;
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-radius
function serializeBorderRadius([horizontal, vertical]) {
  horizontal = serializeSides(horizontal);
  vertical = serializeSides(vertical);
  if (horizontal === vertical) {
    return horizontal;
  }
  return `${horizontal} / ${vertical}`;
}

function getCalculationTypeOrder(types) {
  for (const type of types) {
    if (type === "<number>") {
      return 0;
    }
    if (type === "<percentage>") {
      return 1;
    }
    if (type === "<dimension-token>") {
      return 2;
    }
  }
  return 3;
}

// https://drafts.csswg.org/css-values-4/#sort-a-calculations-children
function sortCalculation(nodes) {
  return nodes.toSorted(({ types: a, unit: ua }, { types: b, unit: ub }) => {
    a = getCalculationTypeOrder(a);
    b = getCalculationTypeOrder(b);
    if (a === 2 && b === 2 && ua < ub) {
      return -1;
    }
    return a - b;
  });
}

// https://drafts.csswg.org/css-values-5/#funcdef-calc-mix
function serializeCalcMix({ value }) {
  const [[, weight]] = value;
  if (value.every(([, w]) => w.value === weight.value)) {
    value = value.map(([v]) => serializeComponentValue(v)).join(", ");
  } else {
    value = serializeComponentValue(value);
  }
  return `calc-mix(${value})`;
}

// https://drafts.csswg.org/css-values-4/#serialize-a-calculation-tree
function serializeCalculation(calculation, parent) {
  const { name, types, value } = calculation;
  switch (types[0]) {
    case "<calc-invert>": {
      const reciprocal = `1 / ${serializeCalculation(value, calculation)}`;
      return parent && cssValues.isCalculationOperator(parent) ? `(${reciprocal})` : reciprocal;
    }
    case "<calc-product>": {
      const [head, ...tail] = sortCalculation(calculation);
      const product = tail.reduce(
        (entryProduct, child) => {
          if (child.types.includes("<calc-invert>")) {
            entryProduct += ` / ${serializeCalculation(child.value, calculation)}`;
          } else {
            entryProduct += ` * ${serializeCalculation(child, calculation)}`;
          }
          return entryProduct;
        },
        serializeCalculation(head, calculation)
      );
      if (parent && cssValues.isCalculationOperator(parent)) {
        return `(${product})`;
      }
      return product;
    }
    case "<calc-sum>": {
      const [head, ...tail] = sortCalculation(calculation);
      const sum = tail.reduce(
        (entrySum, child) => {
          const { types: entryEntryTypes, value: entryEntryValue } = child;
          if (entryEntryTypes.includes("<calc-negate>")) {
            entrySum += ` - ${serializeCalculation(entryEntryValue, calculation)}`;
          } else if (typeof entryEntryValue === "number" && entryEntryValue < 0) {
            entrySum += ` - ${serializeCalculation(
              {
                ...child,
                value: 0 - entryEntryValue
              },
              calculation
            )}`;
          } else {
            entrySum += ` + ${serializeCalculation(child, calculation)}`;
          }
          return entrySum;
        },
        serializeCalculation(head, calculation)
      );
      if (parent && cssValues.isCalculationOperator(parent)) {
        return `(${sum})`;
      }
      return sum;
    }
    case "<dimension-token>":
    case "<percentage-token>":
      return mathUtils.isDegenerate(calculation.value) ?
        serializeDegenerate(calculation) :
        serializeDimension(calculation);
    case "<number-token>":
      return mathUtils.isDegenerate(calculation.value) ?
        serializeDegenerate(calculation) :
        serializeNumber(calculation);
    case "<ident-token>":
      return value;
    case "<function>":
      if (name === "calc-mix") {
        return serializeCalcMix(calculation);
      }
      if (name === "round") {
        return serializeRound(calculation);
      }
      return serializeFunction(calculation);
    default:
      throw new RangeError("Unexpected calculation type");
  }
}

// https://drafts.csswg.org/css-values-4/#serialize-a-math-function
function serializeCalculationFunction({ value }) {
  if (cssValues.isNumeric(value) || cssValues.isCalculationOperator(value)) {
    return `calc(${serializeCalculation(value)})`;
  }
  return serializeCalculation(value);
}

// https://drafts.csswg.org/css-color-hdr-1/#funcdef-hdr-color
function serializeColorHDR({ name, value }) {
  value = value.map(([color, headroom]) => {
    color = serializeComponentValue(color, name);
    headroom = serializeComponentValue(headroom);
    if (!headroom || headroom === "0") {
      return color;
    }
    return `${color} ${headroom}`;
  });
  return `${name}(${value.join(", ")})`;
}

// https://drafts.csswg.org/css-color-4/#serializing-color-values
// https://drafts.csswg.org/css-color-4/#typedef-hex-color
function serializeColorHex({ value }) {
  const [n1, n2, n3, n4, n5, n6, n7, n8] = value;
  let alpha;
  switch (value.length) {
    case 3:
      value = [Number(`0x${n1}${n1}`), Number(`0x${n2}${n2}`), Number(`0x${n3}${n3}`)];
      break;
    case 4:
      value = [Number(`0x${n1}${n1}`), Number(`0x${n2}${n2}`), Number(`0x${n3}${n3}`)];
      alpha = `0x${n4}${n4}` / 255;
      break;
    case 6:
      value = [Number(`0x${n1}${n2}`), Number(`0x${n3}${n4}`), Number(`0x${n5}${n6}`)];
      break;
    case 8:
      value = [Number(`0x${n1}${n2}`), Number(`0x${n3}${n4}`), Number(`0x${n5}${n6}`)];
      alpha = `0x${n7}${n8}` / 255;
      break;
  }
  if (alpha !== undefined && alpha < 1) {
    return `rgba(${value.join(", ")}, ${serializeAlpha(cssValues.number(alpha), true)})`;
  }
  return `rgb(${value.join(", ")})`;
}

// https://drafts.csswg.org/css-color-5/#color-interpolation-method
function serializeColorInterpolationMethod([, method]) {
  let string = "in";
  if (cssValues.isList(method)) {
    const [colorSpace, hueInterpolationMethod] = method.map(serializeComponentValue);
    string += ` ${colorSpace}`;
    if (hueInterpolationMethod && hueInterpolationMethod !== "shorter hue") {
      string += ` ${hueInterpolationMethod}`;
    }
  } else {
    string += ` ${method.value === "xyz" ? "xyz-d65" : serializeComponentValue(method)}`;
  }
  return string;
}

// https://drafts.csswg.org/css-color-5/#funcdef-color-mix
// https://drafts.csswg.org/css-color-5/#serial-color-mix
function serializeColorMix({ name, value: [interpolation, , items] }) {
  let string = `${name}(`;
  interpolation = serializeComponentValue(interpolation);
  if (interpolation && interpolation !== "in oklab") {
    string += `${interpolation}, `;
  }
  const declared = [];
  let omitted = 0;
  for (const [, percentage] of items) {
    if (cssValues.isFunction(percentage)) {
      return `${string}${serializeComponentValues(items, name)})`;
    }
    if (cssValues.isOmitted(percentage)) {
      omitted++;
    } else {
      declared.push(percentage.value);
    }
  }
  const balanced = 100 / items.length;
  if (declared.every(percentage => percentage === (omitted ? balanced : declared[0]) && percentage >= balanced)) {
    return `${string}${items.map(color => serializeComponentValue(color[0], name)).join(", ")})`;
  }
  const sum = declared.reduce((entrySum, percentage) => entrySum + percentage, 0);
  const normalized = cssValues.percentage((100 - sum) / omitted);
  items = items.map(([color, percentage]) => {
    color = serializeComponentValue(color, name);
    percentage = serializeComponentValue(cssValues.isOmitted(percentage) ? normalized : percentage);
    return `${color} ${percentage}`;
  });
  return `${string}${items.join(", ")})`;
}

// https://drafts.csswg.org/css-color-4/#serializing-color-values
// https://drafts.csswg.org/css-color-5/#serial-origin-color
// https://drafts.csswg.org/css-color-5/#serial-relative-color
// https://drafts.csswg.org/css-color-hdr-1/#typedef-color-function
function serializeColorModel({ name, value }, context) {
  const {
    [name]: { colorSpace = name }
  } = colorValues.colorFunctions;
  const originColor = context === "origin-color" || Object.hasOwn(colorValues.colorFunctions, context);
  let resolved = true;
  let missing = false;
  let source, alpha;
  value = value.flat(2).reduce((channels, component, index, components) => {
    let { types, value: entryEntryValue } = component;
    if (cssValues.isOmitted(component) || types[0] === "<delimiter-token>") {
      return channels;
    }
    if (types.includes("<color>")) {
      source = `from ${serializeComponentValue(component, "origin-color")}`;
      return channels;
    }
    const isAlpha = index + 1 === components.length;
    if (types.includes("<ident>")) {
      if (entryEntryValue === "from") {
        return channels;
      }
      if (entryEntryValue === "xyz") {
        entryEntryValue = "xyz-d65";
      } else if (entryEntryValue === "none") {
        missing = true;
      }
      if (isAlpha) {
        alpha = entryEntryValue;
      } else {
        channels.push(entryEntryValue);
      }
      return channels;
    }
    // Origin colors retain the authored component types and range, even
    // where an independent color would serialize through legacy RGB.
    if (originColor) {
      if (types.includes("<angle>")) {
        entryEntryValue = `${serializeNumber(dimensionValues.canonicalize(component))}deg`;
      } else if (cssValues.isFunction(component)) {
        entryEntryValue = serializeCalculationFunction(component);
      } else {
        entryEntryValue = serializeNumber(component) + (types.includes("<percentage>") ? "%" : "");
      }
      if (isAlpha) {
        alpha = entryEntryValue;
      } else {
        channels.push(entryEntryValue);
      }
      return channels;
    }
    const isHue = types.includes("<hue>");
    if (isHue && types.includes("<angle>")) {
      entryEntryValue = dimensionValues.canonicalize(component).value;
    } else if (cssValues.isFunction(component)) {
      // Extract a resolved calculation function value only in sRGB color functions
      if (
        colorSpace !== "srgb" ||
        entryEntryValue === undefined ||
        !cssValues.isNumeric(entryEntryValue, {
          literal: true
        })
      ) {
        resolved = false;
        entryEntryValue = serializeCalculationFunction(component);
        if (isAlpha) {
          alpha = entryEntryValue;
        } else {
          channels.push(entryEntryValue);
        }
        return channels;
      }
      ({ types, value: entryEntryValue } = entryEntryValue);
      if (Number.isNaN(entryEntryValue)) {
        entryEntryValue = 0;
      }
    }
    if (isAlpha) {
      entryEntryValue = mathUtils.clamp(0, entryEntryValue, types.includes("<percentage>") ? 100 : 1);
      entryEntryValue = serializeAlpha(
        {
          types,
          value: entryEntryValue
        },
        colorSpace === "srgb" && !source && !missing
      );
      // Omitted relative alpha inherits the origin's alpha, so an explicit
      // opaque value must remain. https://github.com/w3c/csswg-drafts/issues/14070
      if (source || entryEntryValue < 1) {
        alpha = entryEntryValue;
      }
      return channels;
    }
    if (isHue) {
      if (source) {
        channels.push(entryEntryValue);
        return channels;
      }
      if (Number.isFinite(entryEntryValue)) {
        entryEntryValue %= 360;
        if (entryEntryValue < 0) {
          entryEntryValue += 360;
        }
        // Rounding can reach a full turn; keep the serialized hue in [0, 360).
        entryEntryValue = Number(serializeNumberFromPrimitive(entryEntryValue)) % 360;
      } else {
        entryEntryValue = 0;
      }
      channels.push(entryEntryValue);
      return channels;
    }
    index = channels.length;
    if (types.includes("<percentage>")) {
      switch (name) {
        case "color":
          entryEntryValue *= 0.01;
          break;
        case "ictcp":
          entryEntryValue *= index === 0 ? 0.01 : 0.005;
          break;
        case "jzazbz":
          entryEntryValue *= index === 0 ? 0.01 : 0.0021;
          break;
        case "jzczhz":
          entryEntryValue *= index === 0 ? 0.01 : 0.0026;
          break;
        case "lab":
          entryEntryValue = index > 0 ? entryEntryValue * 1.25 : entryEntryValue;
          break;
        case "lch":
          entryEntryValue = index > 0 ? entryEntryValue * 1.5 : entryEntryValue;
          break;
        case "oklab":
        case "oklch":
          entryEntryValue = index > 0 ? entryEntryValue * 0.004 : entryEntryValue * 0.01;
          break;
        case "rgb":
        case "rgba":
          entryEntryValue = mathUtils.safeFloat(entryEntryValue * 2.55);
          break;
      }
    }
    if (source) {
      channels.push(entryEntryValue);
      return channels;
    }
    switch (name) {
      case "hsl":
      case "hsla":
        // Clamp saturation in [0,∞], lightness in [-∞,∞]
        entryEntryValue = mathUtils.clamp(
          index === 1 ? 0 : integerModule.MIN_INTEGER,
          entryEntryValue,
          integerModule.MAX_INTEGER
        );
        break;
      case "hwb":
        // Clamp whiteness and blackness in [-∞,∞]
        entryEntryValue = mathUtils.clamp(integerModule.MIN_INTEGER, entryEntryValue, integerModule.MAX_INTEGER);
        break;
      case "lab":
        // Clamp lightness in [0,100], a and b in [-∞,∞]
        entryEntryValue =
          index === 0 ?
            mathUtils.clamp(0, entryEntryValue, 100) :
            mathUtils.clamp(integerModule.MIN_INTEGER, entryEntryValue, integerModule.MAX_INTEGER);
        break;
      case "lch":
        // Clamp lightness in [0,100], chromaticity in [0,∞]
        entryEntryValue = mathUtils.clamp(0, entryEntryValue, index === 0 ? 100 : integerModule.MAX_INTEGER);
        break;
      case "oklab":
        // Clamp lightness in [0,1], a and b in [-∞,∞]
        entryEntryValue =
          index === 0 ?
            mathUtils.clamp(0, entryEntryValue, 1) :
            mathUtils.clamp(integerModule.MIN_INTEGER, entryEntryValue, integerModule.MAX_INTEGER);
        break;
      case "oklch":
        // Clamp lightness in [0,1], chromaticity in [0,∞]
        entryEntryValue = index === 0 ? mathUtils.clamp(0, entryEntryValue, 1) : Math.max(0, entryEntryValue);
        break;
      case "rgb":
      case "rgba":
        // Clamp all channels in [0,255]
        entryEntryValue = mathUtils.clamp(0, entryEntryValue, 255);
        break;
    }
    channels.push(entryEntryValue);
    return channels;
  }, []);
  if (!resolved || source || originColor) {
    if (name === "rgba" || name === "hsla") {
      name = name.slice(0, -1);
    }
    value = value.map(entryValue => {
      return typeof entryValue === "number" ? serializeNumberFromPrimitive(entryValue) : entryValue;
    });
    if (source) {
      value.unshift(source);
    }
    if (alpha) {
      value.push(`/ ${alpha}`);
    }
    return `${name}(${value.join(" ")})`;
  }
  if (missing && colorSpace === "srgb") {
    if (name === "rgb" || name === "rgba") {
      name = "color";
      value = [
        "srgb",
        ...value.map(channel => {
          return typeof channel === "number" ? serializeNumberFromPrimitive(channel / 255) : channel;
        })
      ];
    } else {
      name = name === "hsla" ? "hsl" : name;
      value = value.map((channel, index) => {
        return typeof channel === "number" ? serializeNumberFromPrimitive(channel) + (index === 0 ? "" : "%") : channel;
      });
    }
    return `${name}(${value.join(" ")}${alpha === undefined ? "" : ` / ${alpha}`})`;
  }
  if (name === "hsl" || name === "hsla") {
    value = hslToRGB(value).map(mathUtils.toEightBit);
  } else if (name === "hwb") {
    value = hwbToRGB(value).map(mathUtils.toEightBit);
  } else if (name === "rgb" || name === "rgba") {
    value = value.map(Math.round);
  }
  value = value.map(entryValue => {
    return typeof entryValue === "number" ? serializeNumberFromPrimitive(entryValue) : entryValue;
  });
  if (alpha) {
    if (colorSpace === "srgb") {
      return `rgba(${value.join(", ")}, ${alpha})`;
    }
    return `${name}(${value.join(" ")} / ${alpha})`;
  }
  if (colorSpace === "srgb") {
    return `rgb(${value.join(", ")})`;
  }
  return `${name}(${value.join(" ")})`;
}

// https://drafts.csswg.org/css-images-4/#typedef-angular-color-stop
// https://drafts.csswg.org/css-images-4/#typedef-linear-color-stop
function serializeColorStop([color, position]) {
  color = serializeComponentValue(color);
  if (cssValues.isOmitted(position)) {
    return color;
  }
  if (position.length === 2) {
    const [p1, p2] = position.map(serializeComponentValue);
    return `${color} ${p1}, ${color} ${p2}`;
  }
  return `${color} ${serializeComponentValue(position)}`;
}

// https://drafts.csswg.org/css-images-4/#typedef-color-stripe
function serializeColorStripe(stripe) {
  const [color, thickness] = stripe.map(serializeComponentValue);
  if (thickness === "" || thickness === "1fr") {
    return color;
  }
  return `${color} ${thickness}`;
}

// https://drafts.csswg.org/css-color-4/#interpolation-space
function getDefaultGradientInterpolation(stops) {
  let unknown = false;
  let modern = false;
  function visit(node) {
    if (node.types.includes("<color>")) {
      if (node.types.includes("<named-color>") || node.types.includes("<hex-color>") || node.value === "transparent") {
        return;
      }
      if (["rgb", "rgba", "hsl", "hsla", "hwb"].includes(node.name)) {
        if (node.value.types.includes("<legacy-rgb-arguments>") ||
            node.value.types.includes("<legacy-hsl-arguments>") || cssValues.isOmitted(node.value[0])) {
          return;
        }
        unknown = true;
      } else if (node.types.includes("<color-function>")) {
        modern = true;
      } else {
        // `currentcolor`, system colors, and conditional colors need their computed context.
        unknown = true;
      }
    } else if (Array.isArray(node)) {
      node.forEach(visit);
    }
  }
  visit(stops);
  if (modern) {
    return "in oklab";
  }
  return unknown ? undefined : "in srgb";
}

// https://drafts.csswg.org/css-images-4/#typedef-conic-gradient-syntax
function serializeConicGradientSyntax([configuration, , stops]) {
  if (cssValues.isOmitted(configuration)) {
    return serializeComponentValue(stops);
  }
  const defaultInterpolation = getDefaultGradientInterpolation(stops);
  stops = serializeComponentValue(stops);
  const [line, interpolation] = configuration;
  const options = [];
  if (!cssValues.isOmitted(line)) {
    const [rotation, position] = line.map(serializeComponentValue);
    if (rotation && rotation !== "from 0deg") {
      options.push(rotation);
    }
    if (position && position !== "at center center" && position !== "at 50% 50%") {
      options.push(position);
    }
  }
  const method = serializeComponentValue(interpolation);
  if (method && method !== defaultInterpolation) {
    options.push(method);
  }
  if (options.length === 0) {
    return stops;
  }
  return `${options.join(" ")}, ${stops}`;
}

// https://drafts.csswg.org/cssom-1/#ref-for-typedef-counter
function serializeCounter({ name, value }) {
  const style = value.at(-1);
  if (cssValues.isOmitted(style) || style.value === "decimal") {
    value = value.slice(0, -2);
  }
  return `${name}(${serializeComponentValues(value)})`;
}

function serializeCustomFunctionDefinition(definition) {
  const strings = definition.map(serializeComponentValue);
  if (strings.at(-1) === "returns type(*)") {
    strings.pop();
  }
  return strings.join(" ");
}

function serializeDegenerate({ types, unit, value }) {
  let string;
  if (value === -Infinity) {
    string = "-infinity";
  } else if (value === Infinity) {
    string = "infinity";
  } else {
    string = "NaN";
  }
  if (types.includes("<number>")) {
    return string;
  }
  if (types.includes("<percentage>")) {
    return `${string} * 1%`;
  }
  for (const { canonicalUnit, units } of dimensionValues.definitions.values()) {
    if (units.includes(unit)) {
      return `${string} * 1${canonicalUnit}`;
    }
  }
  throw new RangeError("Unexpected dimension type");
}

// https://drafts.csswg.org/css-syntax-3/#serialization
// https://drafts.csswg.org/cssom-1/#ref-for-angle-value
// https://drafts.csswg.org/cssom-1/#ref-for-frequency-value
// https://drafts.csswg.org/cssom-1/#ref-for-length-value
// https://drafts.csswg.org/cssom-1/#ref-for-percentage-value
// https://drafts.csswg.org/cssom-1/#ref-for-resolution-value
// https://drafts.csswg.org/cssom-1/#ref-for-time-value
function serializeDimension(dimension) {
  const { types, unit } = dimension;
  const value = serializeNumber(dimension);
  if (types[0] === "<dimension-token>" || (unit !== "%" && types.length === 1)) {
    return value + serializeIdentifierFromPrimitive(unit);
  }
  return value + unit;
}

// https://drafts.csswg.org/css-shapes-1/#funcdef-basic-shape-circle
// https://drafts.csswg.org/css-shapes-1/#funcdef-basic-shape-ellipse
// https://drafts.csswg.org/motion-1/#typedef-offset-path
function serializeEllipse({ name, types, value }) {
  const [size, position] = value.map(serializeComponentValue);
  const options = [];
  if (size && size !== "closest-side") {
    options.push(size);
  }
  if (position && (position !== "at center center" || types.includes("<offset-path>"))) {
    options.push(position);
  }
  return `${name}(${options.join(" ")})`;
}

// https://drafts.csswg.org/css-fonts-4/#feature-tag-value
function serializeFeatureTagValue(feature) {
  const [name, value] = feature.map(serializeComponentValue);
  if (!value || value === "1" || value === "on") {
    return name;
  }
  return `${name} ${value === "off" ? "0" : value}`;
}

// https://drafts.csswg.org/css-values-5/#free-form-productions
function serializeFreeFormValue(value, context) {
  const string = serializeComponentValues(value, context);
  switch (context) {
    case undefined:
      return string;
    case "function-default": {
      let depth = 0;
      for (const token of value) {
        const type = token.types[0];
        if (depth === 0 && (cssValues.isComma(token) || cssValues.isOpenCurlyBrace(token))) {
          return `{${string}}`;
        }
        if (type === "<function-token>" || cssValues.isDelimiter(blockModule.openingTokens, token)) {
          ++depth;
        } else if (cssValues.isDelimiter(blockModule.closingTokens, token)) {
          --depth;
        }
      }
      return string;
    }
    case "var":
      return string.startsWith("{") ? `{${string}}` : string;
    default:
      return value.some(entryValue => cssValues.isComma(entryValue) || cssValues.isOpenCurlyBrace(entryValue)) ?
        `{${string}}` :
        string;
  }
}

function serializeFunction({ name, value }) {
  if (["scaleX", "scaleY", "scaleZ", "scale3d"].includes(name)) {
    value = scalePercentagesToNumbers(value);
  }
  return `${serializeIdentifierFromPrimitive(name)}(${serializeComponentValue(value, name)})`;
}

// https://drafts.csswg.org/mediaqueries-5/#typedef-general-enclosed
function serializeGeneralEnclosed({ name, types, value }) {
  value = `(${serializeComponentValue(value)})`;
  if (types[0] === "<function>") {
    value = `${serializeIdentifierFromPrimitive(name)}${value}`;
  }
  return value;
}

// https://drafts.csswg.org/css-syntax-3/#serialization
function serializeHash(hash) {
  return `#${hash.type === "id" ? serializeIdentifier(hash) : hash.value}`;
}

// https://drafts.csswg.org/cssom-1/#ref-for-value-def-identifier
function serializeIdentifier({ value }) {
  return serializeIdentifierFromPrimitive(value);
}

function serializeIdentifierFromPrimitive(value) {
  return [...value].reduce((identifier, character, index) => {
    const codePoint = character.codePointAt(0);
    if (codePoint === 0) {
      return `${identifier}�`;
    }
    if ((codePoint >= 0x1 && codePoint <= 0x1f) || codePoint === 0x7f) {
      return `${identifier}\\${codePoint.toString(16)} `;
    }
    if (index === 0) {
      if (stringUtils.isDigit(character)) {
        return `${identifier}\\${codePoint.toString(16)} `;
      }
      if (character === "-" && value.length === 1) {
        return `${identifier}\\-`;
      }
    } else if (index === 1 && stringUtils.isDigit(character) && identifier[0] === "-") {
      return `${identifier}\\${codePoint.toString(16)} `;
    }
    if (
      stringUtils.isNonASCIIIdentifierCharacter(character) ||
      stringUtils.isIdentifierCharacter(character) ||
      (codePoint >= 0xd800 && codePoint <= 0xdfff)
    ) {
      return identifier + character;
    }
    return `${identifier}\\${character}`;
  }, "");
}

// https://drafts.csswg.org/cssom-1/#ref-for-integer-value
//
// It clamps the integer into the 32 bits range (browser conformance).
function serializeInteger({ sign, types, value }) {
  value = `${mathUtils.clamp(integerModule.MIN_INTEGER, value, integerModule.MAX_INTEGER)}`;
  if (types.includes("<signed-integer>") && !value.startsWith("-")) {
    return `${sign}${value}`;
  }
  return `${value}`;
}

// https://drafts.csswg.org/css-animations-1/#typedef-keyframe-selector
//
// It serializes the selector with a percentage when declared with a keyword
// (browser conformance).
function serializeKeyframeSelector(selector) {
  switch (selector.types[0]) {
    case "<ident-token>":
      return selector.value === "from" ? "0%" : "100%";
    case "<function>":
      return serializeCalculationFunction(selector);
    case "<percentage-token>":
      return serializeDimension(selector);
    default:
      return serializeComponentValues(selector);
  }
}

// https://drafts.csswg.org/css-grid-2/#typedef-line-names
//
// It serializes an empty line name list to empty string (browser conformance).
function serializeLineNames(names, allowEmpty) {
  if (names.value.length === 0) {
    return allowEmpty ? "[]" : "";
  }
  return serializeBlock(names);
}

// https://drafts.csswg.org/css-grid-2/#typedef-line-name-list
//
// It serializes an empty line name list to empty string (browser conformance).
function serializeLineNameList(list) {
  return list
    .map(names => {
      if (names.types.includes("<line-names>")) {
        return serializeLineNames(names, true);
      }
      const {
        name,
        value: [multiplier, , repeated]
      } = names;
      return `${name}(${serializeComponentValue(multiplier)}, ${serializeLineNameList(repeated)})`;
    })
    .join(" ");
}

// https://drafts.csswg.org/css-images-4/#typedef-linear-gradient-syntax
function serializeLinearGradientSyntax([configuration, , stops]) {
  if (cssValues.isOmitted(configuration)) {
    return serializeComponentValue(stops);
  }
  const defaultInterpolation = getDefaultGradientInterpolation(stops);
  stops = serializeComponentValue(stops);
  const options = [];
  const [rotation, interpolation] = configuration.map(serializeComponentValue);
  if (rotation && rotation !== "to bottom") {
    options.push(rotation);
  }
  if (interpolation && interpolation !== defaultInterpolation) {
    options.push(interpolation);
  }
  if (options.length === 0) {
    return stops;
  }
  return `${options.join(" ")}, ${stops}`;
}

// https://drafts.csswg.org/cssom-1/#ref-for-number-value
// Use six significant digits, following browser behavior and the proposed CSSOM clarification.
// https://github.com/w3c/csswg-drafts/issues/7416
// https://github.com/w3c/csswg-drafts/issues/8538
// https://github.com/w3c/csswg-drafts/issues/6471
function serializeNumber({ value }) {
  return serializeNumberFromPrimitive(value);
}

function serializeNumberFromPrimitive(value) {
  return `${Number(value.toPrecision(6))}`;
}

// https://drafts.csswg.org/css-color-4/#typedef-opacity-opacity-value
function serializeOpacity(opacity) {
  switch (opacity.types[0]) {
    case "<function>":
      return serializeCalculationFunction(opacity);
    case "<number-token>":
      return serializeNumber(opacity);
    case "<percentage-token>":
      return serializeNumberFromPrimitive(opacity.value / 100);
    default:
      throw new RangeError("Unexpected opacity type");
  }
}

// https://drafts.csswg.org/css-shapes-1/#funcdef-basic-shape-path
function serializePath({ value, commands }) {
  const fillRule = serializeComponentValue(value[0]);
  const data = serializeStringFromPrimitive(commands.join(" "));
  if (fillRule && fillRule !== "nonzero") {
    return `path(${fillRule}, ${data})`;
  }
  return `path(${data})`;
}

// https://drafts.csswg.org/css-shapes-1/#funcdef-basic-shape-polygon
function serializePolygon({ value }) {
  const [fillRule, round, , vertices] = value.map(serializeComponentValue);
  const options = [];
  if (fillRule && fillRule !== "nonzero") {
    options.push(fillRule);
  }
  if (round && value[1][1].value !== 0) {
    options.push(round);
  }
  if (options.length > 0) {
    return `polygon(${options.join(" ")}, ${vertices})`;
  }
  return `polygon(${vertices})`;
}

// https://drafts.csswg.org/css-backgrounds-4/#typedef-bg-position
// https://drafts.csswg.org/css-values-5/#typedef-position
function serializePosition(position) {
  if (cssValues.isList(position)) {
    return serializeComponentValues(position);
  }
  let side;
  if (position.types.includes("<ident>")) {
    side = position.value;
    if (side === "top" || side === "bottom" || side.startsWith("y") || side.startsWith("inline")) {
      return `center ${side}`;
    }
  } else if (cssValues.isFunction(position)) {
    side = serializeCalculationFunction(position);
  } else {
    side = serializeDimension(position);
  }
  return `${side} center`;
}

// https://drafts.csswg.org/css-anchor-position-1/#typedef-position-area
// https://drafts.csswg.org/css-anchor-position-2/#typedef-position-area-query
function serializePositionArea(area, query) {
  let [a, b] = area.map(serializeComponentValue);
  if (!query) {
    if (!a || !b || a === b) {
      return a || b;
    }
    if (a === "span-all" && /bottom|inline|top|y/.test(b)) {
      return b;
    }
    if (b === "span-all" && /block|left|right|x/.test(a)) {
      return a;
    }
    return `${a} ${b}`;
  }
  if (!a) {
    if (/bottom|inline|top|y/.test(b)) {
      a = "any";
    } else {
      a = b;
    }
  } else if (!b) {
    if (/block|left|right|x/.test(a)) {
      b = "any";
    } else {
      b = a;
    }
  }
  return `${a} ${b}`.replace(/(block|inline)-/g, "");
}

// https://drafts.csswg.org/css-images-4/#typedef-radial-gradient-syntax
function serializeRadialGradientSyntax([configuration, , stops]) {
  if (cssValues.isOmitted(configuration)) {
    return serializeComponentValue(stops);
  }
  const defaultInterpolation = getDefaultGradientInterpolation(stops);
  stops = serializeComponentValue(stops);
  let [line, interpolation] = configuration;
  const options = [];
  if (!cssValues.isOmitted(line)) {
    let [aspect, position] = line;
    if (!cssValues.isOmitted(aspect)) {
      const [{ value: shape }, size] = aspect;
      if (!cssValues.isOmitted(size) && size.value !== "farthest-corner") {
        options.push(serializeComponentValue(size));
      }
      if (shape === "circle" && (options.length === 0 || !size[0]?.types.includes("<length-percentage>"))) {
        options.unshift("circle");
      }
    }
    position = serializeComponentValue(position);
    if (position && position !== "at center center" && position !== "at 50% 50%") {
      options.push(position);
    }
  }
  interpolation = serializeComponentValue(interpolation);
  if (interpolation && interpolation !== defaultInterpolation) {
    options.push(interpolation);
  }
  if (options.length === 0) {
    return stops;
  }
  return `${options.join(" ")}, ${stops}`;
}

// https://drafts.csswg.org/css-images-3/#typedef-radial-size
// https://drafts.csswg.org/css-images-4/#radial-size
function serializeRadialSize(size) {
  if (!cssValues.isList(size)) {
    return size.value;
  }
  const [radius] = size;
  // Two percentage radii refer to separate axes; a single radius can instead
  // refer to the scaled diagonal. Preserve that distinction inside calculations.
  if (radius.types.includes("<percentage>") ||
      (radius.types.includes("<calc-function>") && radius.type.percentHint)) {
    return serializeComponentValues(size);
  }
  return serializeSides(size);
}

// https://drafts.csswg.org/cssom-1/#ref-for-ratio-value
function serializeRatio([numerator, denominator]) {
  numerator = serializeComponentValue(numerator);
  denominator = cssValues.isOmitted(denominator) ? "1" : serializeComponentValue(denominator[1]);
  return `${numerator} / ${denominator}`;
}

// https://drafts.csswg.org/motion-1/#funcdef-ray
function serializeRay({ name, value }) {
  const [angle, size, contain, position] = value.map(serializeComponentValue);
  let string = `${name}(${angle}`;
  if (size && size !== "closest-side") {
    string += ` ${size}`;
  }
  if (contain) {
    string += ` ${contain}`;
  }
  if (position) {
    string += ` ${position}`;
  }
  string += ")";
  return string;
}

// https://drafts.csswg.org/css-shapes-2/#typedef-shape-relative-control-point
function serializeRelativeControlPoint(point) {
  const [coordinate, from] = point.map(serializeComponentValue);
  return !from || from === "from start" ? coordinate : `${coordinate} ${from}`;
}

// https://drafts.csswg.org/css-backgrounds-4/#typedef-repeat-style
function serializeRepeatStyle(style) {
  if (cssValues.isList(style)) {
    const [x, y] = style.map(serializeComponentValue);
    if (y) {
      if (x === y) {
        return x;
      }
      if (x === "repeat" && y === "no-repeat") {
        return "repeat-x";
      }
      if (x === "no-repeat" && y === "repeat") {
        return "repeat-y";
      }
      return `${x} ${y}`;
    }
    return x;
  }
  return style.value;
}

// https://drafts.csswg.org/css-values-4/#funcdef-round
function serializeRound(fn) {
  const [strategy, a, b] = fn.value.map(serializeComponentValue);
  const value = [];
  if (strategy && strategy !== "nearest") {
    value.push(strategy);
  }
  value.push(a);
  if (b && b !== "1") {
    value.push(b);
  }
  return `round(${value.join(", ")})`;
}

// https://drafts.csswg.org/css-transforms-2/#funcdef-scale
function scalePercentagesToNumbers(value) {
  if (cssValues.isList(value)) {
    return cssValues.list(value.map(scalePercentagesToNumbers), value.separator, value.types);
  }
  if (value.types.includes("<percentage>") && typeof value.value === "number") {
    return cssValues.number(value.value / 100);
  }
  return value;
}

function serializeScale({ value }) {
  const [x, y = x] = scalePercentagesToNumbers(value).map(serializeComponentValue);
  return x === y ? `scale(${x})` : `scale(${x}, ${y})`;
}

// https://drafts.csswg.org/scroll-animations-1/#funcdef-scroll
function serializeScroll({ value }) {
  const options = [];
  if (cssValues.isList(value)) {
    const [scroller, axis] = value.map(serializeComponentValue);
    if (scroller && scroller !== "nearest") {
      options.push(scroller);
    }
    if (axis && axis !== "block") {
      options.push(axis);
    }
  }
  return `scroll(${options.join(" ")})`;
}

// https://drafts.csswg.org/css-backgrounds-3/#typedef-shadow
// https://drafts.csswg.org/css-borders-4/#typedef-spread-shadow
// https://drafts.csswg.org/filter-effects-1/#funcdef-filter-drop-shadow
function serializeShadow(shadow) {
  const [color, offset, ...options] = shadow.flat(2).map(serializeComponentValue);
  const strings = [];
  if (offset === "none") {
    // Preserve the color: omitting it expands to `transparent`, even for initial longhand values.
    // https://github.com/w3c/csswg-drafts/issues/14621
    if (color && color !== "transparent") {
      strings.push(color);
    }
    strings.push(offset);
  } else if (!color || color === "currentcolor") {
    strings.push(offset, options.shift());
  } else {
    strings.push(color, offset, options.shift());
  }
  const [blur, spread, position] = options;
  if (blur && (blur !== "0px" || (spread && spread !== "0px"))) {
    strings.push(blur);
  }
  if (spread && spread !== "0px") {
    strings.push(spread);
  }
  if (position && position !== "outset") {
    strings.push(position);
  }
  return strings.join(" ");
}

// https://drafts.csswg.org/css-shapes-2/#funcdef-shape
function serializeShape({ value: [fillRule, ...tail] }) {
  tail = serializeComponentValues(tail);
  if (cssValues.isOmitted(fillRule) || fillRule.value === "nonzero") {
    return `shape(${tail})`;
  }
  return `shape(${serializeComponentValue(fillRule)} ${tail})`;
}

function serializeSides(sides) {
  return simplifySides(sides.map(serializeComponentValue));
}

// https://drafts.csswg.org/css-transforms-1/#funcdef-transform-skew
function serializeSkew({ value: [x, , y] }) {
  x = serializeComponentValue(x);
  y = serializeComponentValue(y);
  return y === "" || y === "0deg" ? `skew(${x})` : `skew(${x}, ${y})`;
}

// https://drafts.csswg.org/css-page-floats-3/#funcdef-float-snap-block
// https://drafts.csswg.org/css-page-floats-3/#funcdef-float-snap-inline
function serializeSnap({ name, value: [length, , position] }) {
  length = serializeComponentValue(length);
  if (cssValues.isOmitted(position) || position.value === "near") {
    return `${name}(${length})`;
  }
  return `${name}(${length}, ${serializeComponentValue(position)})`;
}

// https://drafts.csswg.org/css-easing-2/#typedef-step-easing-function
function serializeStepEasingFunction({ value }) {
  switch (value) {
    case "step-start":
      return "steps(1, start)";
    case "step-end":
      return "steps(1)";
    default: {
      const [count, , { value: position }] = value;
      const steps = serializeComponentValue(count);
      if (position && position !== "end" && position !== "jump-end") {
        return `steps(${steps}, ${position})`;
      }
      return `steps(${steps})`;
    }
  }
}

// https://drafts.csswg.org/cssom-1/#ref-for-string-value
function serializeString({ value }) {
  return serializeStringFromPrimitive(value);
}

function serializeStringFromPrimitive(value) {
  return [...value]
    .reduce((entryString, character) => {
      const codePoint = character.codePointAt(0);
      if (codePoint === 0) {
        character = "�";
      } else if ((codePoint >= 0x1 && codePoint <= 0x1f) || codePoint === 0x7f) {
        character = `\\${codePoint.toString(16)} `;
      } else if (character === '"' || character === "\\") {
        character = `\\${character}`;
      }
      return entryString + character;
    }, '"')
    .concat('"');
}

// https://github.com/w3c/csswg-drafts/issues/5846
function serializeFontFamilyName(value) {
  const name = cssValues.isList(value) ? value.map(part => part.value).join(" ") : value.value;
  const words = name.split(" ");
  if (
    !fontFamilyKeywords.has(stringUtils.toLowerCase(words[0])) &&
    (words.length > 1 || !customIdentifierKeywords.has(stringUtils.toLowerCase(words[0]))) &&
    words.every(word => {
      return word !== "" && serializeIdentifierFromPrimitive(word) === word;
    })
  ) {
    return name;
  }
  return serializeStringFromPrimitive(name);
}

// https://drafts.csswg.org/css-counter-styles-3/#funcdef-symbols
function serializeSymbols({ value }) {
  const [type, list] = value.map(serializeComponentValue);
  if (type === "" || type === "symbolic") {
    return `symbols(${list})`;
  }
  return `symbols(${type} ${list})`;
}

// https://drafts.csswg.org/css-transforms-1/#funcdef-transform-translate
function serializeTranslate({ value: [x, , y] }) {
  x = serializeComponentValue(x);
  y = serializeComponentValue(y);
  return y === "" || y === "0px" ? `translate(${x})` : `translate(${x}, ${y})`;
}

// https://drafts.csswg.org/cssom-1/#ref-for-url-value
function serializeURL({ value }) {
  return serializeURLFromPrimitive(value);
}

function serializeURLFromPrimitive(value) {
  return `url(${serializeStringFromPrimitive(value)})`;
}

// https://drafts.csswg.org/css-syntax-3/#typedef-unicode-range-token
function serializeUnicodeRange({ from, to }) {
  const string = `U+${from.toString(16).toUpperCase()}`;
  if (to === 0) {
    return string;
  }
  return `${string}-${to.toString(16).toUpperCase()}`;
}

// https://drafts.csswg.org/scroll-animations-1/#funcdef-view
function serializeView({ value }) {
  const options = [];
  if (cssValues.isList(value)) {
    const [axis, inset] = value.map(serializeComponentValue);
    if (axis && axis !== "block") {
      options.push(axis);
    }
    if (inset && inset !== "auto") {
      options.push(inset);
    }
  }
  return `view(${options.join(" ")})`;
}

function serializePageSelectorList(selectors) {
  return selectors.map(selector => {
    const parts = [];
    if (selector.name !== null) {
      parts.push(serializeIdentifierFromPrimitive(selector.name));
    }
    for (const pseudo of selector.pseudos) {
      if (typeof pseudo === "string") {
        parts.push(pseudo);
      } else {
        parts.push(":nth(", pseudo.notation);
        if (pseudo.of !== null) {
          parts.push(" of");
          const name = serializeIdentifierFromPrimitive(pseudo.of);
          if (name !== "") {
            parts.push(" ", name);
          }
        }
        parts.push(")");
      }
    }
    return parts.join("");
  }).join(", ");
}

// https://drafts.csswg.org/cssom-1/#serialize-a-css-component-value
function serializeComponentValue(value, context) {
  if (value.kind !== undefined) {
    return value.kind.startsWith("media-") ?
      require("./utils/serialize-media.js").serializeMedia(value, context) :
      require("./utils/serialize-selectors.js").serializeNativeSelector(value, context);
  }
  // Custom property value or pre-simplified value
  if (typeof value === "string") {
    return value;
  }
  if (value.representation !== undefined) {
    return value.representation;
  }
  if (cssValues.isOmitted(value)) {
    return "";
  }
  const { types } = value;
  for (let index = types.length - 1; index >= 0; index--) {
    switch (types[index]) {
      case "<'border-radius'>":
        return serializeBorderRadius(value);
      case "<alpha()>":
      case "<color()>":
      case "<hsl()>":
      case "<hsla()>":
      case "<hwb()>":
      case "<ictcp()>":
      case "<jzazbz()>":
      case "<jzczhz()>":
      case "<lab()>":
      case "<lch()>":
      case "<oklab()>":
      case "<oklch()>":
      case "<rgb()>":
      case "<rgba()>":
        return serializeColorModel(value, context);
      case "<alpha-value>":
        return serializeAlpha(value);
      case "<any-value>":
      case "<declaration-value>":
        return serializeFreeFormValue(value, context);
      case "<a-n-plus-b>":
        return serializeAnB(value);
      case "<angular-color-stop>":
      case "<linear-color-stop>":
        return serializeColorStop(value);
      case "<at-keyword-token>":
        return `@${serializeIdentifier(value)}`;
      case "<attr()>":
        return serializeAttrFunction(value);
      case "<attribute-selector>":
        return serializeAttributeSelector(value);
      case "<grid-line>":
        return serializeGridLine(value);
      case "<arc-command>":
        return serializeArcCommand(value);
      case "<bad-string-token>":
        return `"${value.value}`;
      case "<bad-url-token>":
        return `url(${value.value}`;
      case "<baseline-position>":
        return serializeBaselinePosition(value);
      case "<bg-position>":
      case "<position>":
        return serializePosition(value);
      case "<block>":
        return serializeBlock(value);
      case "<border-radius>":
        return serializeSides(value);
      case "<calc-function>":
        return serializeCalculationFunction(value);
      case "<calc-mix()>":
        return serializeCalcMix(value);
      case "<calc-invert>":
      case "<calc-product>":
      case "<calc-sum>":
      case "<calc-value>":
        return serializeCalculation(value);
      case "<circle()>":
      case "<ellipse()>":
        return serializeEllipse(value);
      case "<color-interpolation-method>":
        return serializeColorInterpolationMethod(value);
      case "<color-mix()>":
        return serializeColorMix(value);
      case "<color-stripe>":
        return serializeColorStripe(value);
      case "<conic-gradient-syntax>":
        return serializeConicGradientSyntax(value);
      case "<counter>":
        return serializeCounter(value);
      case "<custom-function-definition>":
        return serializeCustomFunctionDefinition(value);
      case "<ident>":
      case "<ident-token>":
        return serializeIdentifier(value);
      case "<declaration>":
        return serializeArbitraryDeclaration(value);
      case "<delimiter-token>":
      case "<keyword>":
        return value.value;
      case "<dimension>":
      case "<dimension-token>":
      case "<percentage>":
      case "<percentage-token>":
        return serializeDimension(value);
      case "<feature-tag-value>":
        return serializeFeatureTagValue(value);
      case "<function>":
        return serializeFunction(value);
      case "<function-parameter>":
        return serializeComponentValues(value, "function-default");
      case "<function-token>":
        return `${serializeIdentifier(value)}(`;
      case "<general-enclosed>":
        return serializeGeneralEnclosed(value);
      case "<hash-token>":
        return serializeHash(value);
      case "<hex-color>":
        return serializeColorHex(value);
      case "<hdr-color()>":
        return serializeColorHDR(value);
      case "<inset()>":
      case "<rect()>":
      case "<xywh()>":
        return serializeBasicShapeRect(value);
      case "<integer>":
      case "<signless-integer>":
      case "<signed-integer>":
        return serializeInteger(value);
      case "<keyframe-selector>":
        return serializeKeyframeSelector(value);
      case "<line-names>":
        return serializeLineNames(value);
      case "<line-name-list>":
        return serializeLineNameList(value);
      case "<linear-gradient-syntax>":
        return serializeLinearGradientSyntax(value);
      case "<number>":
      case "<number-token>":
        return serializeNumber(value);
      case "<opacity-value>":
        return serializeOpacity(value);
      case "<page-selector-list>":
        return serializePageSelectorList(value);
      case "<path()>":
        return serializePath(value);
      case "<polygon()>":
        return serializePolygon(value);
      case "<position-area>":
        return serializePositionArea(value);
      case "<position-area-query>":
        return serializePositionArea(value, true);
      case "<radial-gradient-syntax>":
        return serializeRadialGradientSyntax(value);
      case "<radial-size>":
        return serializeRadialSize(value);
      case "<ratio>":
        return serializeRatio(value);
      case "<ray()>":
        return serializeRay(value);
      case "<relative-control-point>":
        return serializeRelativeControlPoint(value);
      case "<repeat-style>":
        return serializeRepeatStyle(value);
      case "<round()>":
        return serializeRound(value);
      case "<scale()>":
        return serializeScale(value);
      case "<scroll()>":
        return serializeScroll(value);
      case "<shadow>":
        return serializeShadow(value);
      case "<shape()>":
        return serializeShape(value);
      case "<skew()>":
        return serializeSkew(value);
      case "<snap-block()>":
      case "<snap-inline()>":
        return serializeSnap(value);
      case "<src()>":
        return serializeFunction({ name: "url", value: value.value });
      case "<step-easing-function>":
        return serializeStepEasingFunction(value);
      case "<string>":
      case "<string-token>":
        return serializeString(value);
      case "<font-family-name>":
        return serializeFontFamilyName(value);
      case "<symbols()>":
        return serializeSymbols(value);
      case "<translate()>":
        return serializeTranslate(value);
      case "<urange>":
        return serializeUnicodeRange(value);
      case "<url-token>":
        if (types.includes("<url>") || types.includes("<url()>")) {
          return serializeURL(value);
        }
        // An unparsed URL token must remain a URL token when reparsed; quoted
        // url() syntax produces a function and a string token instead.
        return `url(${value.value.replace(/[\x00-\x20\x7F"'()\\]/g, character => {
          return /[\x00-\x1F\x7F]/.test(character) ?
            `\\${character.codePointAt(0).toString(16)} ` :
            `\\${character}`;
        })})`;
      case "<view()>":
        return serializeView(value);
      default:
        continue;
    }
  }
  if (cssValues.isList(value)) {
    return serializeComponentValues(value, context);
  }
  throw new RangeError("Unexpected component value to serialize");
}

// https://drafts.csswg.org/cssom-1/#serialize-a-css-value
// https://drafts.csswg.org/cssom-1/#serialize-a-comma-separated-list
// https://drafts.csswg.org/cssom-1/#serialize-a-whitespace-separated-list
//
// It is an abstraction of steps 3-5 of the procedures to serialize a CSS value,
// a comma separated list, and a whitespace separated list.
function serializeComponentValues(list, context) {
  const separator = list.separator ?? " ";
  return list.reduce((string, value, index) => {
    value = serializeComponentValue(value, context);
    if (index > 0) {
      switch (separator) {
        case " ":
          if (string && value && value[0] !== "," && value[0] !== ";" && value !== ":" && !value.startsWith(": ")) {
            string += separator;
          }
          break;
        case "":
          break;
        case ",":
        case ";":
          string += value ? `${separator} ` : separator;
          break;
        default:
          string += ` ${separator} `;
          break;
      }
    }
    string += value;
    return string;
  }, "");
}

// https://drafts.csswg.org/css-animations-2/#animation-shorthand
function representAnimation(declarations, computed) {
  const { length } = declarations[0].value;
  if (declarations.some(({ value }) => value.length !== length)) {
    return "";
  }
  const animations = [];
  for (let index = 0; index < length; ++index) {
    const values = declarations.map(({ value }) => serializeComponentValue(value[index]));
    const preserve = new Set();
    const name = declarations[7].value[index];
    if (name.types.includes("<custom-ident>")) {
      // These keywords would fill another component before `animation-name`.
      const component = {
        "auto": 0,
        "ease": 1,
        "linear": 1,
        "ease-in": 1,
        "ease-out": 1,
        "ease-in-out": 1,
        "step-start": 1,
        "step-end": 1,
        "infinite": 3,
        "normal": 4,
        "reverse": 4,
        "alternate": 4,
        "alternate-reverse": 4,
        "forwards": 5,
        "backwards": 5,
        "both": 5,
        "running": 6,
        "paused": 6
      }[stringUtils.toLowerCase(name.value)];
      if (component !== undefined) {
        preserve.add(component);
      }
    }
    if (values[2] !== propertyDefinitions["animation-delay-start"].initial) {
      preserve.add(0);
    }
    const timeline = declarations[8].value[index];
    if (timeline.types.includes("<dashed-ident>")) {
      preserve.add(7);
      if (values[7] === "none") {
        preserve.add(5);
      }
    } else if (timeline.value === "none") {
      preserve.add(5);
      preserve.add(7);
    }
    const initialDuration = computed && declarations[8].value.length === 1 && timeline.value === "auto" ?
      "0s" :
propertyDefinitions["animation-duration"].initial;
    const components = values.filter((value, component) => {
      const initial = component === 0 ? initialDuration : propertyDefinitions[declarations[component].name].initial;
      return preserve.has(component) || value !== initial;
    });
    animations.push(components.length ? components.join(" ") : "none");
  }
  return animations.join(", ");
}

// https://drafts.csswg.org/css-animations-1/#propdef-animation
function representAnimationDelay([{ value: starts }, { value: ends }]) {
  if (starts.length !== ends.length) {
    return "";
  }
  return starts
    .map((start, index) => {
      start = serializeComponentValue(start);
      const end = serializeComponentValue(ends[index]);
      if (end === propertyDefinitions["animation-delay-end"].initial) {
        return start;
      }
      return `${start} ${end}`;
    })
    .join(", ");
}

// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger-activation-range
// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger-active-range
// https://drafts.csswg.org/scroll-animations-1/#propdef-animation-range
function representAnimationRange([{ value: starts }, { value: ends }], initial) {
  if (starts.length !== ends.length) {
    return "";
  }
  return starts.map((start, index) => representAnimationRangeValue(start, ends[index], initial)).join(", ");
}

// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger-activation-range-start
// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger-active-range-start
// https://drafts.csswg.org/scroll-animations-1/#propdef-animation-range-start
function representAnimationRangeLonghand(range, origin) {
  const percentage = origin.endsWith("start") ? "0%" : "100%";
  return cssValues.map(range, value => {
    if (cssValues.isList(value)) {
      const [name, offset] = value.map(serializeComponentValue);
      if (offset === percentage) {
        return name;
      }
    }
    return value;
  });
}

function representAnimationRangeValue(start, end, initial) {
  let startRange, endRange;
  if (cssValues.isList(start)) {
    const [name, offset] = start.map(serializeComponentValue);
    startRange = name;
    if (offset && offset !== "0%") {
      startRange += ` ${offset}`;
    } else if (end.types.includes("<length-percentage>")) {
      startRange += " 0%";
    }
  } else {
    startRange = serializeComponentValue(start);
  }
  if (cssValues.isList(end)) {
    const [name, offset] = end.map(serializeComponentValue);
    endRange = name;
    if (offset && offset !== "100%") {
      endRange += ` ${offset}`;
    } else if (cssValues.isList(start) && start[0].value === endRange) {
      return startRange;
    }
  } else {
    endRange = serializeComponentValue(end);
    if (!cssValues.isList(start) && endRange === initial) {
      return startRange;
    }
  }
  return `${startRange} ${endRange}`;
}

// https://drafts.csswg.org/css-backgrounds-4/#propdef-background
// https://github.com/w3c/csswg-drafts/issues/418
function representBackground(declarations) {
  const x = declarations.find(declaration => declaration.name === "background-position-x");
  const y = declarations.find(declaration => declaration.name === "background-position-y");
  if (x.value.length !== y.value.length) {
    return "";
  }
  declarations = declarations.flatMap(declaration => {
    if (declaration === x) {
      return [
        {
          name: "background-position",
          value: cssValues.list(
            x.value.map((position, index) => combinePosition(position, y.value[index])),
            ","
          )
        }
      ];
    }
    return declaration === y ? [] : [declaration];
  });
  const {
    value: { length }
  } = declarations.find(declaration => declaration.name === "background-image");
  const clip = declarations.find(declaration => declaration.name === "background-clip");
  const layers = [];
  for (const { name, value } of declarations) {
    if (name === "background-color") {
      const serialized = serializeComponentValue(value);
      if (serialized !== propertyDefinitions["background-color"].initial) {
        layers.at(-1).push(serialized);
      }
      continue;
    }
    if (length !== value.length) {
      return "";
    }
    value.forEach((entryValue, index) => {
      entryValue = serializeDeclarationValue({
        name,
        value: cssValues.list([entryValue])
      });
      if (layers[index]) {
        layers[index].push(entryValue);
      } else {
        layers.push(cssValues.list([entryValue]));
      }
    });
  }
  // Simplification
  return layers
    .map((layer, layerIndex) => {
      let valueIndex = layer.length;
      while (valueIndex-- > 0 && layer.length > 1) {
        const {
          [valueIndex]: { name }
        } = declarations;
        const value = layer[valueIndex];
        const prev = layer[valueIndex - 1];
        if (name === "background-repeat-y") {
          if (value === prev) {
            layer.splice(valueIndex, 1);
          } else if (value === "no-repeat" && prev === "repeat") {
            layer.splice(--valueIndex, 2, "repeat-x");
          } else if (value === "repeat" && prev === "no-repeat") {
            layer.splice(--valueIndex, 2, "repeat-y");
          }
        } else if (value === propertyDefinitions[name].initial) {
          layer.splice(valueIndex, 1);
        } else if (name === "background-size") {
          layer.splice(valueIndex--, 1, `/ ${value}`);
        } else if (name === "background-clip" && value !== prev) {
          if (clip.value[layerIndex].types.includes("<visual-box>")) {
            if (prev === propertyDefinitions["background-origin"].initial) {
              valueIndex--;
            }
          } else if (prev === "border-box") {
            layer.splice(--valueIndex, 1);
          } else {
            valueIndex--;
          }
        }
      }
      return layer.join(" ");
    })
    .join(", ");
}

// https://drafts.csswg.org/css-backgrounds-4/#propdef-background-repeat
function representBackgroundPosition(declarations) {
  const [x, y] = declarations;
  if (x.value.length !== y.value.length) {
    return "";
  }
  return cssValues.list(
    x.value.map((position, index) => combinePosition(position, y.value[index])),
    ","
  );
}
function representBackgroundRepeat(declarations) {
  const {
    value: { length }
  } = declarations.find(({ name }) => name === "background-repeat-x");
  const repetitions = [];
  for (const { value } of declarations) {
    if (length !== value.length) {
      return "";
    }
    value.forEach((entryValue, index) => {
      entryValue = serializeComponentValue(entryValue);
      if (repetitions[index]) {
        repetitions[index].push(entryValue);
      } else {
        repetitions.push([entryValue]);
      }
    });
  }
  // Simplification
  return repetitions
    .map(([x, y]) => {
      if (x === y) {
        return x;
      }
      if (x === "repeat" && y === "no-repeat") {
        return "repeat-x";
      }
      if (x === "no-repeat" && y === "repeat") {
        return "repeat-y";
      }
      return `${x} ${y}`;
    })
    .join(", ");
}

// https://drafts.csswg.org/css-backgrounds-4/#propdef-background-size
// https://drafts.csswg.org/css-masking-1/#propdef-mask-size
function representBackgroundSize(size) {
  return cssValues.map(size, value => {
    if (cssValues.isList(value)) {
      const [width, height] = value;
      if (width.value !== "auto" && !height) {
        return cssValues.list([width, defaultsModule.auto]);
      }
      if (width.value === "auto" && height?.value === "auto") {
        return width;
      }
    }
    return value;
  });
}

// https://drafts.csswg.org/css-borders-4/#border-shorthands
// https://drafts.csswg.org/css-logical-1/#propdef-border-block
// https://drafts.csswg.org/css-logical-1/#propdef-border-inline
function representBorder(declarations, sides) {
  const values = [];
  for (const [index, declaration] of declarations.entries()) {
    const fallback = values[Math.floor((index / sides) % 3)];
    const value = serializeDeclarationValue(declaration);
    if (fallback) {
      if (fallback === value) {
        continue;
      }
      return "";
    }
    values.push(value);
  }
  return representWithoutInitialValues(values, shorthandProperties.get("border-top")[0]);
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-clip
// https://drafts.csswg.org/css-gaps-1/#propdef-column-rule-inset-start
// https://drafts.csswg.org/css-gaps-1/#propdef-row-rule-inset-start
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-break
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-color
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-inset-start
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-style
// https://drafts.csswg.org/css-gaps-1/#propdef-rule-width
// https://drafts.csswg.org/css-overflow-4/#propdef-overflow-clip-margin
// https://drafts.csswg.org/css-overflow-4/#propdef-overflow-clip-margin-block
// https://drafts.csswg.org/css-overflow-4/#propdef-overflow-clip-margin-inline
// https://svgwg.org/svg2-draft/painting.html#MarkerShorthand
function representCommonLonghandValue(declarations) {
  const [head, ...tail] = declarations.map(serializeDeclarationValue);
  return tail.every(value => value === head) ? head : "";
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-image
// https://drafts.csswg.org/css-masking-1/#propdef-mask-border
function representBorderImage(declarations) {
  const values = declarations.map(serializeDeclarationValue);
  let index = values.length;
  while (index-- > 0 && values.length > 1) {
    const {
      [index]: { name }
    } = declarations;
    const value = values[index];
    if (value === propertyDefinitions[name].initial && name.endsWith("width") && values[index + 1] === "/") {
      values[index] = "/";
    } else if (value === propertyDefinitions[name].initial && values[index + 1] !== "/") {
      values.splice(index, 1);
    } else if (name.endsWith("outset") || name.endsWith("width")) {
      values.splice(index, 0, "/");
    }
  }
  return values.join(" ");
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-image-slice
// https://drafts.csswg.org/css-masking-1/#propdef-mask-border-slice
function representBorderSlice([offsets, fill]) {
  offsets = serializeSides(offsets);
  return cssValues.isOmitted(fill) ? offsets : `${offsets} fill`;
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-radius
// https://drafts.csswg.org/css-borders-4/#propdef-border-top-radius
function representBorderRadius(declarations) {
  const horizontal = [];
  const vertical = [];
  declarations.forEach(({ value: [h, v = h] }) => {
    horizontal.push(h);
    vertical.push(v);
  });
  return serializeBorderRadius([horizontal, vertical]);
}

// https://drafts.csswg.org/css-borders-4/#propdef-box-shadow
function representBoxShadow(declarations) {
  const {
    value: { length }
  } = declarations.find(({ name }) => name === "box-shadow-offset");
  const shadows = [];
  for (const { value } of declarations) {
    if (length !== value.length) {
      return "";
    }
    value.forEach((entryValue, i) => shadows[i]?.push(entryValue) ?? shadows.push(cssValues.list([entryValue])));
  }
  return shadows.map(serializeShadow).join(", ");
}

// https://drafts.csswg.org/css-borders-4/#propdef-box-shadow-offset
function representBoxShadowOffset(offsets) {
  return offsets
    .map(offset => {
      const string = serializeComponentValue(offset);
      if (cssValues.isList(offset) && offset.length === 1) {
        return `${string} ${string}`;
      }
      return string;
    })
    .join(", ");
}

// https://drafts.csswg.org/css-break-4/#propdef-break-before
// https://drafts.csswg.org/css-break-4/#propdef-break-inside
// https://drafts.csswg.org/css2/#propdef-page-break-before
// https://drafts.csswg.org/css2/#propdef-page-break-inside
function representBreak({ value }, property) {
  const legacy = property.startsWith("page-");
  switch (value) {
    case "always":
    case "page":
      return legacy ? "always" : "page";
    case "avoid":
    case "auto":
    case "left":
    case "right":
      return value;
    default:
      return legacy ? "" : value;
  }
}

// https://drafts.csswg.org/css-masking-1/#propdef-clip-path
// https://drafts.csswg.org/motion-1/#propdef-offset-path
function representPath(path) {
  if (cssValues.isList(path)) {
    const [shape, box] = path.map(serializeComponentValue);
    if (!shape) {
      return box;
    }
    if (box && box !== "border-box") {
      return `${shape} ${box}`;
    }
    return shape;
  }
  return path;
}

// https://drafts.csswg.org/css-multicol-2/#propdef-columns
function representColumns(columns) {
  const [width, count, height] = columns.map(serializeDeclarationValue);
  if (count === "auto") {
    if (height === "auto") {
      return width;
    }
    return `${width} / ${height}`;
  }
  if (height === "auto") {
    if (width === "auto") {
      return count;
    }
    return `${width} ${count}`;
  }
  if (width === "auto") {
    return `${count} / ${height}`;
  }
  return `${width} ${count} / ${height}`;
}

// https://drafts.csswg.org/css-conditional-5/#propdef-container
function representContainer(declarations) {
  const values = declarations.map(serializeDeclarationValue);
  const [names, type] = values;
  if (type === propertyDefinitions["container-type"].initial) {
    return names;
  }
  return values.join(" / ");
}

// https://drafts.csswg.org/css-borders-4/#propdef-corner
// https://drafts.csswg.org/css-borders-4/#propdef-corner-top
function representCorner(declarations, longhands) {
  const half = longhands.length / 2;
  const radii = representBorderRadius(declarations.slice(0, half));
  const shape = simplifySides(declarations.slice(half).map(serializeDeclarationValue));
  if (shape === propertyDefinitions["corner-top-left-shape"].initial) {
    return radii;
  }
  if (radii === propertyDefinitions["border-top-left-radius"].initial) {
    return shape;
  }
  return `${radii} ${shape}`;
}

// https://drafts.csswg.org/css-lists-3/#propdef-counter-increment
// https://drafts.csswg.org/css-lists-3/#propdef-counter-reset
// https://drafts.csswg.org/css-lists-3/#propdef-counter-set
function representCounter(counters, property) {
  if (cssValues.isList(counters)) {
    return counters
      .map(([counterName, value]) => {
        const name = serializeComponentValue(counterName);
        if (!cssValues.isOmitted(value)) {
          return `${name} ${serializeComponentValue(value)}`;
        }
        if (cssValues.isFunction(counterName, "reversed")) {
          return name;
        }
        return `${name} ${property === "counter-increment" ? 1 : 0}`;
      })
      .join(" ");
  }
  return counters;
}

// https://drafts.csswg.org/css-display-4/#propdef-display
function representDisplay(type) {
  if (cssValues.isList(type)) {
    const values = type
      .map(serializeComponentValue)
      .filter(
        (value, index, entryValues) => {
          return value && value !== "flow" && (value !== "block" || entryValues[index + 1] === "ruby");
        }
      );
    if (values[0] === "inline") {
      switch (values[1]) {
        case "flex":
        case "grid":
        case "table":
          return values.join("-");
        case "flow-root":
          return values[2] ? values.join(" ") : "inline-block";
        case "ruby":
          return "ruby";
      }
    }
    if (values.length === 0) {
      return "block";
    }
    return values.join(" ");
  }
  return type;
}

// https://drafts.csswg.org/css-flexbox-2/#propdef-flex
function representFlex(declarations) {
  return declarations.map(serializeDeclarationValue).join(" ");
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font
function representFont(declarations, computed) {
  const systemFont = declarations.find(declaration => declaration.value.types.includes("<system-font()>"));
  if (systemFont) {
    const { value } = systemFont;
    if (declarations.every(declaration => declaration.value === value)) {
      return value.value;
    }
    return "";
  }
  const values = [];
  for (let index = 0; index < declarations.length; index++) {
    const declaration = declarations[index];
    const { name } = declaration;
    let serialized = serializeDeclarationValue(declaration);
    if (name.startsWith("font-variant")) {
      let variant = declarations[index + 1];
      serialized = [serialized];
      while (variant.name.startsWith("font-variant")) {
        index++;
        serialized.push(serializeDeclarationValue(variant));
        variant = declarations[index + 1];
      }
      serialized = representFontVariant(serialized);
      if (serialized === "normal") {
        continue;
      }
      if (serialized !== "small-caps") {
        return "";
      }
    } else if (name !== "font-family" && name !== "font-size") {
      if (serialized === propertyDefinitions[name].initial) {
        continue;
      }
      if (computed && name === "font-weight" && serialized === "400") {
        continue;
      }
      if (name === "font-width") {
        const { value } = declaration;
        if (value.types.includes("<calc-function>") && value.value.types[0] === "<percentage-token>") {
          serialized = serializeComponentValue(value.value);
        }
        serialized =
          {
            "50%": "ultra-condensed",
            "62.5%": "extra-condensed",
            "75%": "condensed",
            "87.5%": "semi-condensed",
            "100%": "normal",
            "112.5%": "semi-expanded",
            "125%": "expanded",
            "150%": "extra-expanded",
            "200%": "ultra-expanded"
          }[serialized] ?? serialized;
        if (serialized === "normal") {
          continue;
        }
        if (!valueDefinitions["<font-width-css3>"].split(" | ").includes(serialized)) {
          return "";
        }
      } else if (name === "line-height") {
        values.push("/");
      }
    }
    values.push(serialized);
  }
  return values.join(" ");
}

// https://drafts.csswg.org/css-fonts-4/#descdef-font-face-font-weight
// https://drafts.csswg.org/css-fonts-4/#descdef-font-face-font-width
// https://drafts.csswg.org/css-fonts-5/#descdef-font-face-font-size
function representFontRange(range) {
  return cssValues.isList(range) ? serializeSides(range) : range;
}

// https://drafts.csswg.org/css-fonts-5/#propdef-font-size-adjust
function representFontSizeAdjust(size) {
  if (cssValues.isList(size)) {
    const [metric, number] = size.map(serializeComponentValue);
    if (metric === "" || metric === "ex-height") {
      return number;
    }
    return `${metric} ${number}`;
  }
  return size;
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font-style
// https://drafts.csswg.org/css-fonts-4/#descdef-font-face-font-style
function representFontStyle(style) {
  if (cssValues.isList(style)) {
    let angle = style[1];
    if (cssValues.isOmitted(angle)) {
      return "oblique";
    }
    if (cssValues.isList(angle) ? angle.every(component => component.value === 0) : angle.value === 0) {
      return "normal";
    }
    angle = cssValues.isList(angle) ? serializeSides(angle) : serializeComponentValue(angle);
    return `oblique ${angle}`;
  }
  return style;
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font-synthesis
function representFontSynthesis(declarations) {
  const values = declarations.map(serializeDeclarationValue);
  const keywords = [];
  for (const [index, name] of shorthandProperties.get("font-synthesis")[0].entries()) {
    const value = values[index];
    switch (value) {
      case "oblique-only":
        return "";
      case "none":
        continue;
      default:
        keywords.push(name.replace("font-synthesis-", ""));
        break;
    }
  }
  return keywords.length > 0 ? keywords.join(" ") : "none";
}

// https://drafts.csswg.org/css-fonts-4/#propdef-font-variant
function representFontVariant(values) {
  if (values.every(value => value === "normal")) {
    return "normal";
  }
  const [ligatures, ...tail] = values;
  if (ligatures === "none") {
    if (tail.every(value => value === "normal")) {
      return "none";
    }
    return "";
  }
  return values.filter(value => value !== "" && value !== "normal").join(" ");
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid
function representGrid(declarations) {
  const [rows, columns, areas, autoFlow, autoRows, autoColumns] = declarations.map(serializeDeclarationValue);
  if (autoFlow === "row" && autoRows === "auto" && autoColumns === "auto") {
    const [entryRows, entryColumns, entryAreas] = declarations;
    return serializeComponentValue(representGridTemplate([entryRows, entryColumns, entryAreas]));
  }
  if (
    areas !== "none" ||
    (autoRows !== "auto" && autoColumns !== "auto") ||
    ((autoFlow === "row" || autoFlow === "dense") && (autoColumns !== "auto" || rows !== "none")) ||
    (autoFlow.startsWith("column") && (autoRows !== "auto" || columns !== "none"))
  ) {
    return "";
  }
  const flow = `auto-flow${autoFlow.endsWith("dense") ? " dense" : ""}`;
  if (autoFlow === "row" || autoFlow === "dense") {
    if (autoRows === "auto") {
      return `${flow} / ${columns}`;
    }
    return `${flow} ${autoRows} / ${columns}`;
  }
  if (autoColumns === "auto") {
    return `${rows} / ${flow}`;
  }
  return `${rows} / ${flow} ${autoColumns}`;
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid-area
// https://drafts.csswg.org/css-grid-2/#propdef-grid-column
// https://drafts.csswg.org/css-grid-2/#propdef-grid-row
function representGridArea(declarations) {
  const values = declarations.map(serializeDeclarationValue);
  const { initial } = propertyDefinitions["grid-row-start"];
  let index = values.length;
  while (index-- > 1) {
    const line = values[index];
    const source = Math.max(0, index - 2);
    const omitted = declarations[source].value.types.includes("<custom-ident>") ? values[source] : initial;
    if (line !== omitted) {
      break;
    }
    values.pop();
  }
  return values.join(" / ");
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid-auto-flow
function representGridAutoFlow(flow) {
  flow = serializeComponentValues(flow);
  return flow === "row dense" ? "dense" : flow;
}

// https://drafts.csswg.org/css-grid-2/#propdef-grid-template
function representGridTemplate(declarations) {
  const [rows, columns, areas] = declarations.map(({ value }) => value);
  if (areas.value === "none") {
    if (rows.value === "none" && columns.value === "none") {
      return "none";
    }
    return cssValues.list([rows, columns], "/");
  }
  if (
    !rows.types.includes("<explicit-track-list>") ||
    areas.length !== rows[0].length ||
    !(columns.value === "none" || columns.types.includes("<explicit-track-list>"))
  ) {
    return "";
  }
  const [rowTrackList, lineNames] = rows;
  const template = [];
  areas.forEach((area, index) => {
    const [entryLineNames, size] = rowTrackList[index] ?? ["", defaultsModule.auto];
    template.push(entryLineNames);
    template.push(area);
    if (size.value !== "auto") {
      template.push(size);
    }
  });
  template.push(lineNames);
  if (columns.value === "none") {
    return cssValues.list(template);
  }
  return cssValues.list([cssValues.list(template), columns], "/");
}

// https://drafts.csswg.org/css-text-4/#propdef-hyphenate-limit-chars
function representHyphenateLimitChars(limit) {
  const values = limit.map(serializeComponentValue);
  const [, before, after] = values;
  if (before && before === after) {
    values.pop();
    if (before === "auto") {
      values.pop();
    }
  }
  return values.join(" ");
}

// https://drafts.csswg.org/css-images-3/#propdef-image-orientation
function representImageOrientation(orientation) {
  if (cssValues.isList(orientation)) {
    const [angle, flip] = orientation.map(serializeComponentValue);
    if (angle === "" || angle === "0deg") {
      return flip;
    }
    return `${angle} ${flip}`;
  }
  return orientation;
}

// https://drafts.csswg.org/css-images-4/#propdef-image-resolution
function representImageResolution([resolution, snap]) {
  let [string, value] = resolution.map(serializeComponentValue);
  if (string === "") {
    string = value;
  } else if (value !== "" && value !== "1dppx") {
    string += ` ${value}`;
  }
  if (cssValues.isOmitted(snap)) {
    return string;
  }
  return `${string} snap`;
}

// https://drafts.csswg.org/css-inline-3/#propdef-initial-letter
function representInitialLetter(letter) {
  if (cssValues.isList(letter)) {
    const [head, tail] = letter.map(serializeComponentValue);
    if (tail && tail !== "drop") {
      return `${head} ${tail}`;
    }
    return head;
  }
  return letter;
}

// https://drafts.csswg.org/css-overflow-4/#propdef-line-clamp
// https://drafts.csswg.org/css-overflow-4/#propdef--webkit-line-clamp
function representLineClamp(declarations, legacy) {
  const [maxLines, blockEllipsis, fragment] = declarations.map(serializeDeclarationValue);
  if (legacy) {
    if (maxLines === "auto") {
      if (blockEllipsis === "ellipsis" && fragment === "normal") {
        return "none";
      }
    } else if (blockEllipsis === "ellipsis" && fragment === "-webkit-legacy") {
      return maxLines;
    }
  } else if (fragment === "normal") {
    if (maxLines === "auto" && blockEllipsis === "no-ellipsis") {
      return "none";
    }
  } else if (fragment === "collapse") {
    if (maxLines === "auto") {
      if (blockEllipsis !== "no-ellipsis") {
        return blockEllipsis;
      }
    } else if (blockEllipsis === "ellipsis") {
      return maxLines;
    } else {
      return `${maxLines} ${blockEllipsis}`;
    }
  } else if (fragment === "-webkit-legacy") {
    if (maxLines === "auto") {
      return `${blockEllipsis} ${fragment}`;
    }
    if (blockEllipsis === "ellipsis") {
      return `${maxLines} ${fragment}`;
    }
    return `${maxLines} ${blockEllipsis} ${fragment}`;
  }
  return "";
}

// https://drafts.csswg.org/css-lists-3/#propdef-list-style
function representListStyle(declarations, longhands) {
  const values = declarations.map(serializeDeclarationValue);
  const [position, image, type] = values;
  if (image === "none" && type === "none" && position === propertyDefinitions["list-style-type"].initial) {
    return "none";
  }
  const {
    "list-style-position": { initial, value }
  } = propertyDefinitions;
  if (position === initial && value.split(" | ").includes(type)) {
    if (image === propertyDefinitions["list-style-image"].initial) {
      return `${position} ${type}`;
    }
    return `${position} ${image} ${type}`;
  }
  return representWithoutInitialValues(values, longhands);
}

// https://drafts.csswg.org/css-masking-1/#propdef-mask
function representMask(declarations) {
  const {
    value: { length }
  } = declarations.find(declaration => declaration.name === "mask-image");
  const clip = declarations.find(declaration => declaration.name === "mask-clip");
  const layers = [];
  for (const { name, value } of declarations) {
    if (length !== value.length) {
      return "";
    }
    value.forEach((entryValue, index) => {
      entryValue = serializeDeclarationValue({
        name,
        value: cssValues.list([entryValue])
      });
      if (layers[index]) {
        layers[index].push(entryValue);
      } else {
        layers.push(cssValues.list([entryValue]));
      }
    });
  }
  // Simplification
  return layers
    .map((layer, layerIndex) => {
      let valueIndex = layer.length;
      while (valueIndex-- > 0 && layer.length > 1) {
        const {
          [valueIndex]: { name }
        } = declarations;
        const value = layer[valueIndex];
        const prev = layer[valueIndex - 1];
        if (value === propertyDefinitions[name].initial) {
          layer.splice(valueIndex, 1);
        } else if (name === "mask-size") {
          layer.splice(valueIndex--, 1, `/ ${value}`);
        } else if (name === "mask-clip") {
          if (value === prev) {
            layer.splice(valueIndex, 1);
          } else if (clip.value[layerIndex].types.includes("<geometry-box>")) {
            valueIndex--;
          }
        }
      }
      return layer.join(" ");
    })
    .join(", ");
}

// https://drafts.csswg.org/css-images-4/#propdef-object-fit
function representObjectFit(value) {
  if (cssValues.isList(value)) {
    const [strategy, scale] = value.map(serializeComponentValue);
    if (scale && strategy === "contain") {
      return scale;
    }
  }
  return value;
}

// https://drafts.csswg.org/motion-1/#propdef-offset
function representOffset(declarations) {
  let values = declarations.map(serializeDeclarationValue);
  const anchor = values.pop();
  const [position, path, distance, rotate] = values;
  if (rotate === propertyDefinitions["offset-rotate"].initial) {
    values.pop();
  }
  if (distance === propertyDefinitions["offset-distance"].initial) {
    values.splice(2, 1);
  }
  if (values.length === 2 && path === propertyDefinitions["offset-path"].initial) {
    values.pop();
  } else if (position === propertyDefinitions["offset-position"].initial) {
    values.shift();
  }
  values = values.join(" ");
  if (anchor === propertyDefinitions["offset-anchor"].initial) {
    return values;
  }
  return `${values} / ${anchor}`;
}

// https://drafts.csswg.org/motion-1/#propdef-offset-rotate
function representOffsetRotate(rotation) {
  if (rotation[1].value === 0 && !cssValues.isOmitted(rotation[0])) {
    return rotation[0].value;
  }
  const value = serializeComponentValues(rotation);
  switch (value) {
    case "auto 0deg":
    case "reverse 180deg":
    case "reverse -180deg":
      return "auto";
    case "auto 180deg":
    case "auto -180deg":
    case "reverse 0deg":
      return "reverse";
    default:
      return value;
  }
}

// https://drafts.csswg.org/css-overflow-4/#propdef-overflow-clip-margin-top
function representOverflowClipMargin(margin) {
  const [box, length] = margin.map(serializeComponentValue);
  if (box) {
    if (length === "" || length === "0px") {
      return box;
    }
    return `${box} ${length}`;
  }
  return length;
}

// https://svgwg.org/svg2-draft/painting.html#PaintOrder
function representPaintOrder(order) {
  order = serializeComponentValue(order);
  switch (order) {
    case "fill stroke":
    case "fill stroke markers":
      return "fill";
    case "fill markers stroke":
      return "fill markers";
    case "markers fill":
    case "markers fill stroke":
      return "markers";
    case "markers stroke fill":
      return "markers stroke";
    case "stroke fill":
    case "stroke fill markers":
      return "stroke";
    case "stroke markers fill":
      return "stroke markers";
    default:
      return order;
  }
}

// https://drafts.csswg.org/css-align-3/#propdef-place-content
function representPlaceContent(declarations) {
  const [align, justify] = declarations.map(serializeDeclarationValue);
  if (align === justify || (justify === "start" && declarations[0].value.types.includes("<baseline-position>"))) {
    return align;
  }
  return `${align} ${justify}`;
}

// https://drafts.csswg.org/css-align-3/#propdef-place-items
function representPlaceItems(declarations) {
  const [align, justify] = declarations.map(serializeDeclarationValue);
  return align === justify ? align : `${align} ${justify}`;
}

// https://drafts.csswg.org/css-anchor-position-1/#propdef-position-try
function representPositionTry(declarations) {
  const [order, options] = declarations.map(serializeDeclarationValue);
  return order === "normal" ? options : `${order} ${options}`;
}

// https://drafts.csswg.org/css-gaps-1/#propdef-column-rule
// https://drafts.csswg.org/css-gaps-1/#propdef-row-rule
// https://drafts.csswg.org/css-gaps-1/#propdef-rule
function representRule(declarations, longhands, shorthand) {
  if (shorthand === "rule") {
    const [rowWidth, columnWidth, rowStyle, columnStyle, rowColor, columnColor] = declarations;
    const rowRule = representRule([rowWidth, rowStyle, rowColor], shorthandProperties.get("row-rule")[0], "row-rule");
    if (rowRule === "") {
      return "";
    }
    const columnRule = representRule(
      [columnWidth, columnStyle, columnColor],
      shorthandProperties.get("column-rule")[0],
      "column-rule"
    );
    if (columnRule === "" || columnRule !== rowRule) {
      return "";
    }
    return rowRule;
  }
  const [{ value: widths }, { value: styles }, { value: colors }] = declarations;
  const rules = [...widths];
  const { length } = rules;
  if (length !== styles.length || length !== colors.length || styles.length !== colors.length) {
    return "";
  }
  for (let i = 0; i < length; i++) {
    let width = widths[i];
    let style = styles[i];
    let color = colors[i];
    if (width.name === "repeat") {
      if (style.name !== "repeat" || color.name !== "repeat") {
        return "";
      }
      const n = serializeComponentValue(width.value[0]);
      const o = serializeComponentValue(style.value[0]);
      const p = serializeComponentValue(color.value[0]);
      if (n !== o || n !== p || o !== n) {
        return "";
      }
      width = width.value[2];
      style = style.value[2];
      color = color.value[2];
      if (width.length !== style.length || width.length !== color.length || style.length !== color.length) {
        return "";
      }
      const values = [];
      for (let j = 0; j < width.length; j++) {
        const value = [
          serializeComponentValue(width[j]),
          serializeComponentValue(style[j]),
          serializeComponentValue(color[j])
        ];
        values.push(representWithoutInitialValues(value, longhands));
      }
      rules[i] = `repeat(${n}, ${values.join(", ")})`;
      continue;
    }
    if (style.name === "repeat" || color.name === "repeat") {
      return "";
    }
    const value = [serializeComponentValue(width), serializeComponentValue(style), serializeComponentValue(color)];
    rules[i] = representWithoutInitialValues(value, longhands);
  }
  return rules.join(", ");
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
function representRuleInset(declarations, longhands, shorthand) {
  const values = declarations.map(serializeDeclarationValue);
  if (shorthand.startsWith("rule")) {
    // [[row declarations, row longhands], [column declarations, column longhands]]
    const args = [
      [[], []],
      [[], []]
    ];
    declarations.forEach((declaration, index) => {
      args[index % 2][0].push(declaration);
      args[index % 2][1].push(longhands[index]);
    });
    const rows = representRuleInset(...args[0], `rows-${shorthand}`);
    const columns = representRuleInset(...args[1], `columns-${shorthand}`);
    if (rows === columns) {
      return rows;
    }
    return "";
  }
  if (shorthand.endsWith("inset")) {
    const [capStart, capEnd, junctionStart, junctionEnd] = values;
    if (capStart === capEnd && capStart === junctionStart && capStart === junctionEnd) {
      return capStart;
    }
    return `${capStart} ${capEnd} / ${junctionStart} ${junctionEnd}`;
  }
  const [start, end] = values;
  if (start === end) {
    return start;
  }
  return `${start} ${end}`;
}

// https://drafts.csswg.org/css-transforms-2/#propdef-scale
function representScale(scale) {
  if (cssValues.isList(scale)) {
    const [x, y = x, z = "1"] = scalePercentagesToNumbers(scale).map(serializeComponentValue);
    if (z === "1") {
      if (y === x) {
        return x;
      }
      return `${x} ${y}`;
    }
    return `${x} ${y} ${z}`;
  }
  return scale;
}

// https://drafts.csswg.org/css-scroll-snap-1/#propdef-scroll-snap-type
function representScrollSnapType(type) {
  if (cssValues.isList(type)) {
    const [axis, strictness] = type.map(serializeComponentValue);
    if (strictness === "" || strictness === "proximity") {
      return axis;
    }
    return `${axis} ${strictness}`;
  }
  return type;
}

// https://drafts.csswg.org/scroll-animations-1/#propdef-scroll-timeline
function representScrollTimeline(declarations, longhands) {
  const {
    value: { length }
  } = declarations.find(({ name }) => name === "scroll-timeline-name");
  const timelines = [];
  for (const { value } of declarations) {
    if (length !== value.length) {
      return "";
    }
    value.forEach((entryValue, index) => {
      entryValue = serializeComponentValue(entryValue);
      if (timelines[index]) {
        timelines[index].push(entryValue);
      } else {
        timelines.push(cssValues.list([entryValue]));
      }
    });
  }
  return timelines
    .map(timeline => representWithoutInitialValues(timeline, longhands, "scroll-timeline-name"))
    .join(", ");
}

// https://drafts.csswg.org/css-shapes-1/#propdef-shape-outside
function representShapeOutside(shape) {
  if (cssValues.isList(shape)) {
    const basicShape = shape.find(value => value.types.includes("<basic-shape>"));
    const box = shape.find(value => value.types.includes("<shape-box>"));
    if (!basicShape) {
      return box;
    }
    return box && box.value !== "margin-box" ? cssValues.list([basicShape, box]) : basicShape;
  }
  return shape;
}

// https://drafts.csswg.org/css-page-3/#descdef-page-size
function representSize(size) {
  if (cssValues.isList(size)) {
    if (size[0].types.includes("<length>")) {
      return serializeSides(size);
    }
    if (!cssValues.isOmitted(size[0]) && size[1].value === "portrait") {
      return size[0];
    }
  }
  return size;
}

// https://drafts.css-houdini.org/css-properties-values-api-1/#descdef-property-syntax
function representSyntax(syntax) {
  return `"${serializeComponentValue(syntax)}"`;
}

// https://drafts.csswg.org/css-counter-styles-3/#descdef-counter-style-system
function representSystem(value) {
  value = serializeComponentValue(value);
  return value === "fixed 1" ? "fixed" : value;
}

// https://drafts.csswg.org/css-text-4/#propdef-text-align
function representTextAlign(declarations) {
  const [all, last] = declarations.map(serializeDeclarationValue);
  if (last === propertyDefinitions["text-align-last"].initial) {
    return all === "match-parent" ? "" : all;
  }
  if (all === last) {
    if (all === "justify") {
      return "justify-all";
    }
    if (all === "match-parent") {
      return all;
    }
  }
  return "";
}

// https://drafts.csswg.org/css-inline-3/#propdef-text-box
function representTextBox(declarations) {
  const [trim, edge] = declarations.map(serializeDeclarationValue);
  if (edge === "auto") {
    if (trim === "none") {
      return "normal";
    }
    return trim;
  }
  if (trim === "trim-both") {
    return edge;
  }
  return `${trim} ${edge}`;
}

// https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration-skip
function representTextDecorationSkip(declarations, longhands) {
  const values = declarations.map(serializeDeclarationValue);
  if (values.every((value, i) => value === propertyDefinitions[longhands[i]].initial)) {
    return "auto";
  }
  const [self, ...tail] = values;
  if (self === "no-skip" && tail.every(value => value === "none")) {
    return "none";
  }
  return "";
}

// https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration-skip-self
function representTextDecorationSkipSelf(lines) {
  lines = serializeComponentValue(lines);
  return lines === "skip-underline skip-overline skip-line-through" ? "skip-all" : lines;
}

// https://drafts.csswg.org/css-text-decor-4/#propdef-text-emphasis-position
// https://github.com/w3c/csswg-drafts/issues/10167
function representTextEmphasisPosition(position) {
  if (!cssValues.isList(position)) {
    return position;
  }
  const [z, x] = position;
  return x.value === "right" ? z : position;
}

// https://drafts.csswg.org/css-text-4/#propdef-text-spacing
function representTextSpacing(declarations) {
  const [trim, autospace] = declarations.map(serializeDeclarationValue);
  if (autospace === "no-autospace" && trim === "space-all") {
    return "none";
  }
  if (autospace === "auto") {
    return trim === "auto" ? "auto" : "";
  }
  if (trim === "auto") {
    return autospace === "auto" ? "auto" : "";
  }
  if (autospace === "normal" || autospace === "ideograph-alpha ideograph-numeric") {
    return trim;
  }
  if (trim === "normal") {
    return autospace;
  }
  return `${trim} ${autospace}`;
}

// https://drafts.csswg.org/css-writing-modes-4/#propdef-text-orientation
// https://drafts.csswg.org/css-writing-modes-4/#propdef-glyph-orientation-vertical
function representTextOrientation({ value }, property) {
  const legacy = property === "glyph-orientation-vertical";
  switch (value) {
    case "auto":
    case "mixed":
      return legacy ? "auto" : "mixed";
    case 0:
    case "upright":
      return legacy ? "0deg" : "upright";
    case 90:
    case "sideways":
      return legacy ? "90deg" : "sideways";
    default:
      return legacy ? "" : value;
  }
}

// https://drafts.csswg.org/animation-triggers-1/#propdef-timeline-trigger
function representTimelineTrigger(declarations) {
  const names = declarations.find(({ name }) => name === "timeline-trigger-name").value;
  const length = Array.isArray(names) ? names.length : 1;
  const triggers = [];
  for (let { name, value } of declarations) {
    if (!Array.isArray(value)) {
      value = [value];
    }
    if (length !== value.length) {
      return "";
    }
    value.forEach((entry, index) => {
      switch (name) {
        case "timeline-trigger-name":
          triggers.push(cssValues.list([serializeComponentValue(entry)]));
          break;
        case "timeline-trigger-source":
          triggers[index].push(serializeComponentValue(entry));
          break;
        case "timeline-trigger-activation-range-end":
        case "timeline-trigger-active-range-end": {
          const trigger = triggers[index];
          const start = trigger.pop();
          const { initial } = propertyDefinitions[name];
          const range = representAnimationRangeValue(start, entry, initial);
          trigger.push(range);
          break;
        }
        default:
          triggers[index].push(entry);
          break;
      }
    });
  }
  // Simplification
  const serializedTriggers = triggers.map(trigger => {
    const [name, source, range, exitRange] = trigger;
    let string = `${name} ${source}`;
    if (range !== "normal" || exitRange !== "auto") {
      string += ` ${range.replace(" normal", "")}`;
    }
    if (exitRange !== "auto") {
      string += ` / ${exitRange}`;
    }
    return string;
  });
  if (serializedTriggers.length === 1 && serializedTriggers[0] === "none none") {
    return "none";
  }
  return serializedTriggers.join(", ");
}

// https://drafts.csswg.org/css-transitions-2/#transition-shorthand-property
function representTransition(declarations) {
  const { length } = declarations[0].value;
  if (declarations.some(({ value }) => value.length !== length)) {
    return "";
  }
  const transitions = [];
  for (let index = 0; index < length; ++index) {
    const values = declarations.map(({ value }) => serializeComponentValue(value[index]));
    const property = stringUtils.toLowerCase(declarations[4].value[index].value);
    const preserve = new Set();
    if (["ease", "linear", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"].includes(property)) {
      preserve.add(1);
    } else if (property === "normal" || property === "allow-discrete") {
      preserve.add(3);
    }
    if (values[2] !== propertyDefinitions["transition-delay"].initial) {
      preserve.add(0);
    }
    // Ambiguous names must follow the component that would otherwise consume them.
    const order = preserve.has(1) || preserve.has(3) ? [0, 1, 2, 3, 4] : [4, 0, 1, 2, 3];
    const components = order
      .filter(component => preserve.has(component) ||
        values[component] !== propertyDefinitions[declarations[component].name].initial)
      .map(component => values[component]);
    transitions.push(components.length ? components.join(" ") : "all");
  }
  return transitions.join(", ");
}

// https://drafts.csswg.org/css-transforms-2/#propdef-translate
function representTranslate(value) {
  if (cssValues.isList(value)) {
    const [x, y = "", z = ""] = value.flat().map(serializeComponentValue);
    if (z === "" || z === "0px") {
      if (y === "" || y === "0px") {
        return x;
      }
      return `${x} ${y}`;
    }
    return `${x} ${y} ${z}`;
  }
  return value;
}

// https://drafts.csswg.org/css-inline-3/#propdef-vertical-align
function representVerticalAlign(declarations, longhands) {
  const values = declarations.map(serializeDeclarationValue);
  const simplified = representWithoutInitialValues(values, longhands);
  if (simplified === propertyDefinitions["baseline-source"].initial) {
    return propertyDefinitions["alignment-baseline"].initial;
  }
  return simplified;
}

// https://drafts.csswg.org/scroll-animations-1/#propdef-view-timeline
function representViewTimeline(declarations, longhands) {
  const {
    value: { length }
  } = declarations.find(({ name }) => name === "view-timeline-name");
  const timelines = [];
  for (const { value } of declarations) {
    if (length !== value.length) {
      return "";
    }
    value.forEach((entryValue, index) => {
      entryValue = serializeComponentValue(entryValue);
      if (timelines[index]) {
        timelines[index].push(entryValue);
      } else {
        timelines.push(cssValues.list([entryValue]));
      }
    });
  }
  return timelines.map(timeline => representWithoutInitialValues(timeline, longhands, "view-timeline-name")).join(", ");
}

// https://drafts.csswg.org/scroll-animations-1/#propdef-view-timeline-inset
function representViewTimelineInset(inset) {
  return inset.map(serializeSides).join(", ");
}

// https://drafts.csswg.org/css-text-4/#propdef-white-space
function representWhiteSpace(declarations, longhands) {
  for (const [key, values] of whiteSpace.mapping) {
    if (values.every(({ value }, index) => value === declarations[index].value.value)) {
      return key;
    }
  }
  return representWithoutInitialValues(declarations.map(serializeDeclarationValue), longhands);
}

function representWithoutInitialValues(values, longhands, preserve) {
  let index = values.length;
  while (index-- > 0 && values.length > 1) {
    const name = longhands[index];
    if (name !== preserve && values[index] === propertyDefinitions[name].initial) {
      values.splice(index, 1);
    }
  }
  return values.join(" ");
}

// https://drafts.csswg.org/cssom-1/#serialize-a-css-value
//
// It is the implementation of step 2 of the procedure to serialize a CSS value.
//
// It represents the declaration as a list of component values, which can be
// omitted or replaced to serialize to a shorter representation.
function representDeclarationValue({ computed, name, pending, shorthand, source, value }) {
  if (name.startsWith("--")) {
    return source ?? value ?? "";
  }
  if (shorthand) {
    const [longhands, resetOnly] = shorthandProperties.get(name);
    const declarations = [];
    for (const declaration of value) {
      const { name: longhand, pending: entryEntryPending, value: longhandValue } = declaration;
      if (entryEntryPending) {
        // All longhands can only be represented if they are all declared with the same pending substitution
        // https://github.com/w3c/csswg-drafts/issues/3109
        return value.every(entryDeclaration => entryDeclaration.pending === name) || value.length === 1 ?
          (declaration.source ?? longhandValue) :
          "";
      }
      if (substitutionsModule.keywords.includes(longhandValue.value)) {
        const keyword = longhandValue.value;
        // All longhands can only be represented if they are all declared with the same CSS-wide keyword
        return value.every(entryDeclaration => entryDeclaration.value.value === keyword) ? keyword : "";
      }
      if (resetOnly?.includes(longhand)) {
        if (serializeDeclarationValue(declaration) === propertyDefinitions[longhand].initial) {
          continue;
        }
        // All longhands can only be represented if all reset-only longhands are declared to their initial value
        return "";
      }
      declarations.push(declaration);
    }

    // Sort in canonical order
    declarations.sort(({ name: a }, { name: b }) => longhands.indexOf(a) - longhands.indexOf(b));

    // Shorthand declared with a value matching its value definition
    switch (name) {
      case "-webkit-line-clamp":
        return representLineClamp(declarations, true);
      case "animation":
        return representAnimation(declarations, computed);
      case "animation-delay":
        return representAnimationDelay(declarations);
      case "animation-range":
      case "timeline-trigger-activation-range":
      case "timeline-trigger-active-range":
        return representAnimationRange(declarations, name.includes("active") ? "auto" : "normal");
      case "background":
        return representBackground(declarations);
      case "background-position":
        return representBackgroundPosition(declarations);
      case "background-repeat":
        return representBackgroundRepeat(declarations);
      case "border":
        return representBorder(declarations, 4);
      case "border-block":
      case "border-inline":
        return representBorder(declarations, 2);
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
      case "max-size":
      case "min-size":
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
      case "size":
        return simplifySides(declarations.map(serializeDeclarationValue));
      case "border-block-end-radius":
      case "border-block-start-radius":
      case "border-bottom-radius":
      case "border-inline-end-radius":
      case "border-inline-start-radius":
      case "border-left-radius":
      case "border-radius":
      case "border-right-radius":
      case "border-top-radius":
        return representBorderRadius(declarations);
      case "border-block-clip":
      case "border-clip":
      case "border-inline-clip":
      case "column-rule-inset-end":
      case "column-rule-inset-start":
      case "marker":
      case "overflow-clip-margin":
      case "overflow-clip-margin-block":
      case "overflow-clip-margin-inline":
      case "row-rule-inset-end":
      case "row-rule-inset-start":
      case "rule-break":
      case "rule-color":
      case "rule-inset-end":
      case "rule-inset-start":
      case "rule-style":
      case "rule-visibility-items":
      case "rule-width":
        return representCommonLonghandValue(declarations);
      case "border-image":
      case "mask-border":
        return representBorderImage(declarations);
      case "box-shadow":
        return representBoxShadow(declarations, longhands);
      case "column-rule":
      case "row-rule":
      case "rule":
        return representRule(declarations, longhands, name);
      case "column-rule-inset":
      case "column-rule-inset-cap":
      case "column-rule-inset-junction":
      case "row-rule-inset":
      case "row-rule-inset-cap":
      case "row-rule-inset-junction":
      case "rule-inset":
      case "rule-inset-cap":
      case "rule-inset-junction":
        return representRuleInset(declarations, longhands, name);
      case "columns":
        return representColumns(declarations);
      case "container":
        return representContainer(declarations);
      case "corner":
      case "corner-block-end":
      case "corner-block-start":
      case "corner-bottom":
      case "corner-inline-end":
      case "corner-inline-start":
      case "corner-left":
      case "corner-right":
      case "corner-top":
        return representCorner(declarations, longhands);
      case "flex":
        return representFlex(declarations);
      case "font":
        return representFont(declarations, computed);
      case "font-synthesis":
        return representFontSynthesis(declarations);
      case "font-variant":
        return representFontVariant(declarations.map(serializeDeclarationValue));
      case "glyph-orientation-vertical":
        return representTextOrientation(declarations[0].value, name);
      case "grid":
        return representGrid(declarations);
      case "grid-area":
      case "grid-column":
      case "grid-row":
        return representGridArea(declarations);
      case "grid-template":
        return representGridTemplate(declarations);
      case "line-clamp":
        return representLineClamp(declarations);
      case "list-style":
        return representListStyle(declarations, longhands);
      case "mask":
        return representMask(declarations);
      case "offset":
        return representOffset(declarations);
      case "page-break-after":
      case "page-break-before":
      case "page-break-inside":
        return representBreak(declarations[0].value, name);
      case "place-content":
        return representPlaceContent(declarations);
      case "place-items":
        return representPlaceItems(declarations);
      case "position-try":
        return representPositionTry(declarations);
      case "scroll-timeline":
        return representScrollTimeline(declarations, longhands);
      case "text-align":
        return representTextAlign(declarations);
      case "text-box":
        return representTextBox(declarations);
      case "text-decoration-skip":
        return representTextDecorationSkip(declarations, longhands);
      case "text-spacing":
        return representTextSpacing(declarations);
      case "timeline-trigger":
        return representTimelineTrigger(declarations);
      case "transition":
        return representTransition(declarations, longhands);
      case "vertical-align":
        return representVerticalAlign(declarations, longhands);
      case "view-timeline":
        return representViewTimeline(declarations, longhands);
      case "white-space":
        return representWhiteSpace(declarations, longhands);
      default:
        return representWithoutInitialValues(declarations.map(serializeDeclarationValue), longhands);
    }
  }

  // Longhand declared with a pending substitution
  if (pending) {
    // ... of its own or for its legacy shorthand
    // https://github.com/w3c/csswg-drafts/issues/3109
    if (pending === name || shorthandProperties.get(pending)?.flat().length === 1) {
      return source ?? value;
    }
    // ... for its shorthand
    return "";
  }
  // Longhand declared with a CSS-wide keyword
  if (substitutionsModule.keywords.includes(value.value)) {
    return value;
  }
  // Longhand declared with an internal system font value
  if (value.types.includes("<system-font()>")) {
    return "";
  }
  // Longhand declared with a value matching its value definition
  switch (name) {
    case "animation-range-end":
    case "animation-range-start":
    case "timeline-trigger-activation-range-end":
    case "timeline-trigger-activation-range-start":
    case "timeline-trigger-active-range-end":
    case "timeline-trigger-active-range-start":
      return representAnimationRangeLonghand(value, name);
    case "background-size":
    case "mask-size":
      return representBackgroundSize(value);
    case "ascent-override":
    case "border-bottom-left-radius":
    case "border-bottom-right-radius":
    case "border-end-end-radius":
    case "border-end-start-radius":
    case "border-image-outset":
    case "border-image-repeat":
    case "border-image-width":
    case "border-spacing":
    case "border-start-end-radius":
    case "border-start-start-radius":
    case "border-top-left-radius":
    case "border-top-right-radius":
    case "descent-override":
    case "line-gap-override":
    case "mask-border-outset":
    case "mask-border-repeat":
    case "mask-border-width":
    case "scroll-snap-align":
    case "subscript-position-override":
    case "subscript-size-override":
    case "superscript-position-override":
    case "superscript-size-override":
      return serializeSides(value);
    case "text-decoration-inset":
      return cssValues.isList(value) ? serializeSides(value) : value;
    case "border-image-slice":
    case "mask-border-slice":
      return representBorderSlice(value);
    case "box-shadow-offset":
      return representBoxShadowOffset(value);
    case "break-after":
    case "break-before":
    case "break-inside":
      return representBreak(value, name);
    case "caret-color":
      return computed && cssValues.isList(value) && value[1].value === "auto" ? value[0] : value;
    case "clip-path":
    case "offset-path":
      return representPath(value);
    case "counter-increment":
    case "counter-set":
    case "counter-reset":
      return representCounter(value, name);
    case "display":
      return representDisplay(value);
    case "font-size":
    case "font-weight":
    case "font-width":
      return representFontRange(value);
    case "font-size-adjust":
      return representFontSizeAdjust(value);
    case "font-style":
      return representFontStyle(value);
    case "grid-auto-flow":
      return representGridAutoFlow(value);
    case "hyphenate-limit-chars":
      return representHyphenateLimitChars(value);
    case "image-orientation":
      return representImageOrientation(value);
    case "image-resolution":
      return representImageResolution(value);
    case "initial-letter":
      return representInitialLetter(value);
    case "object-fit":
      return representObjectFit(value);
    case "offset-rotate":
      return representOffsetRotate(value);
    case "overflow-clip-margin-block-end":
    case "overflow-clip-margin-block-start":
    case "overflow-clip-margin-bottom":
    case "overflow-clip-margin-inline-end":
    case "overflow-clip-margin-inline-start":
    case "overflow-clip-margin-left":
    case "overflow-clip-margin-right":
    case "overflow-clip-margin-top":
      return representOverflowClipMargin(value);
    case "paint-order":
      return representPaintOrder(value);
    case "scale":
      return representScale(value);
    case "scroll-snap-type":
      return representScrollSnapType(value);
    case "shape-outside":
      return representShapeOutside(value);
    case "size":
      return representSize(value);
    case "syntax":
      return representSyntax(value);
    case "system":
      return representSystem(value);
    case "text-decoration-skip-self":
      return representTextDecorationSkipSelf(value);
    case "text-emphasis-position":
      return representTextEmphasisPosition(value);
    case "text-orientation":
      return representTextOrientation(value, name);
    case "translate":
      return representTranslate(value);
    case "view-timeline-inset":
      return representViewTimelineInset(value);
    default:
      return value;
  }
}

// https://drafts.csswg.org/cssom-1/#serialize-a-css-value
function serializeDeclarationValue(declaration) {
  return serializeComponentValue(representDeclarationValue(declaration));
}

// https://drafts.csswg.org/cssom-1/#serialize-a-css-declaration
function formatDeclaration(property, valueText, priority, appendSemicolon = true) {
  const name = property.startsWith("--") ? serializeIdentifierFromPrimitive(property) : property;
  let string = `${name}: ${valueText}`;
  if (priority) {
    string += " !important";
  }
  if (appendSemicolon) {
    string += ";";
  }
  return string;
}
const shorthandMetadata = new WeakMap();
function getShorthandMetadata(shorthands) {
  let metadata = shorthandMetadata.get(shorthands);
  if (metadata) {
    return metadata;
  }
  const byName = new Map();
  const byLonghand = new Map();
  metadata = { byName, byLonghand };
  for (const [name, groups] of shorthands) {
    const longhands = groups.flat();
    const shorthand = {
      name,
      longhands,
      names: new Set(longhands)
    };
    byName.set(name, shorthand);
    for (const longhand of longhands) {
      if (!byLonghand.has(longhand)) {
        byLonghand.set(longhand, []);
      }
      byLonghand.get(longhand).push(shorthand);
    }
  }
  shorthandMetadata.set(shorthands, metadata);
  return metadata;
}

// https://drafts.csswg.org/cssom-1/#serialize-a-css-declaration-block
function serializeDeclarationBlock(declarations, shorthands, serializeSpecifiedValue) {
  const list = [];
  const alreadySerialized = new Set();
  const attempted = new Set();
  const byName = new Map();
  for (let index = 0; index < declarations.length; index++) {
    byName.set(declarations[index].name, index);
  }
  const shorthandIndex = shorthands && getShorthandMetadata(shorthands).byLonghand;
  declarationLoop: for (let index = 0; index < declarations.length; index++) {
    const declaration = declarations[index];
    const { important, name } = declaration;
    if (alreadySerialized.has(name)) {
      continue;
    }
    shorthandLoop: for (const shorthand of shorthandIndex?.get(name) ?? []) {
      // Preserve `width` and `height` instead of introducing the newer `size` shorthand.
      // https://github.com/w3c/csswg-drafts/issues/14422
      if (shorthand.name === "size") {
        continue;
      }
      if (shorthand.longhands.length < 2 || shorthand.longhands.length > declarations.length ||
          attempted.has(shorthand)) {
        continue;
      }
      attempted.add(shorthand);
      const value = [];
      let lastIndex = index;
      for (const longhand of shorthand.longhands) {
        const longhandIndex = byName.get(longhand);
        if (longhandIndex === undefined || alreadySerialized.has(longhand) ||
            Boolean(declarations[longhandIndex].important) !== Boolean(important)) {
          continue shorthandLoop;
        }
        value.push(declarations[longhandIndex]);
        lastIndex = Math.max(lastIndex, longhandIndex);
      }

      // Moving a later physical/logical longhand before an overlapping
      // declaration would change the cascade, even if the shorthand parses.
      for (let i = index + 1; i < lastIndex; ++i) {
        const otherName = declarations[i].name;
        if (shorthand.names.has(otherName)) {
          continue;
        }
        const group = logicalGroups[propertyDefinitions[otherName]?.group];
        const mapping = group?.find(names => !names.includes(otherName));
        if (mapping?.some(longhand => shorthand.names.has(longhand) && byName.get(longhand) > i)) {
          continue shorthandLoop;
        }
      }
      const serializedValue = serializeSpecifiedValue({ name: shorthand.name, important, shorthand: true, value });
      if (serializedValue === "") {
        continue;
      }
      list.push(formatDeclaration(shorthand.name, serializedValue, important));
      for (const longhand of shorthand.longhands) {
        alreadySerialized.add(longhand);
      }
      continue declarationLoop;
    }
    list.push(formatDeclaration(name, serializeSpecifiedValue(declaration), important));
    alreadySerialized.add(name);
  }
  return list.join(" ");
}
