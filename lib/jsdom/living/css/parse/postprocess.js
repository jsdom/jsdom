"use strict";
const selectorSyntax = require("../utils/selector-syntax.js");

const compatibility = require("../compatibility.js");
const counterStyles = require("../values/counter-style.js");
const pseudos = require("../values/pseudos.js");
const selectorContext = require("./selector-context.js");
const numericTypes = require("./types.js");
const cssValues = require("../values/value.js");
const mediaSyntax = require("../values/media.js");
const dimensionValues = require("../values/dimension.js");
const featureModule = require("../values/feature.js");
const nodeUtils = require("./tree.js");
const stringUtils = require("../utils/string.js");
const cssParser = require("./parser.js");
const CSSStream = require("./stream.js");
const parsePath = require("./path.js");
const parseContext = require("./context.js");
const { ParseErrorInfo } = require("./errors.js");
const substitutionsModule = require("../values/substitutions.js");
const environmentModule = require("../values/environment.js");
const definitionUtils = require("./grammar.js");
const contextUtils = require("./declarations.js");
const defaultsModule = require("../values/defaults.js");
const serialize = require("../serialize.js");
const simplify = require("../simplify.js");
const valueDefinitions = require("../../../../generated/css-value-definitions.js");
const { compileRegistrationSyntax, isValidUniversalInitialValue } = require("./registration.js");
const hexLengths = [3, 4, 6, 8];
const legacyStringFontFormats = [
  "collection",
  "opentype",
  "opentype-variations",
  "truetype",
  "truetype-variations",
  "woff",
  "woff-variations",
  "woff2",
  "woff2-variations"
];
const reserved = {
  animateableFeature: ["all", "auto", "none", "will-change"],
  colorScheme: ["normal", "only"],
  containerName: ["and", "none", "not", "or"],
  counterName: ["none"],
  counterStyleName: ["none"],
  fontFamilyName: [
    ...valueDefinitions["<generic-font-complete>"].split(" | "),
    ...valueDefinitions["<generic-font-incomplete>"].split(" | ")
  ],
  keyframeName: ["none"],
  lineName: ["auto", "span"],
  mediaType: ["and", "layer", "not", "only", "or"],
  viewTransitionClass: ["none"],
  viewTransitionName: ["auto", "match-element"],
  viewTransitionType: ["none"]
};
const units = ["%", ...[...dimensionValues.definitions.values()].flatMap(dimension => dimension.units)];

function error({ definition: { name, value } }) {
  return new ParseErrorInfo(`Invalid ${name ?? value}`);
}

// https://drafts.csswg.org/css-counter-styles-3/#descdef-counter-style-additive-symbols
//
// It aborts parsing when the symbols are not in descending order of weights.
function postParseAdditiveSymbols(symbols, node) {
  for (const [index, [weight]] of symbols.entries()) {
    const next = symbols[index + 1];
    if (next && cssValues.isNumeric(weight) && cssValues.isNumeric(next[0]) && weight.value <= next[0].value) {
      return error(node);
    }
  }
  return symbols;
}

// https://drafts.csswg.org/css-will-change-1/#typedef-animateable-feature
//
// It aborts parsing when the name is a reserved keyword in the context.
function postParseAnimateableFeature(name, node) {
  return reserved.animateableFeature.includes(stringUtils.toLowerCase(name.value)) ? error(node) : name;
}

function postParseAnimationTimeline(timeline, node) {
  if (!nodeUtils.getRule(node)?.definition.elemental) {
    return error(node);
  }
  return timeline;
}

// https://drafts.csswg.org/css-values-5/#typedef-attr-unit
//
// It represents the unit in lowercase when it is a supported unit.
function postParseAttributeUnit(unit) {
  const lowercase = stringUtils.toLowerCase(unit.value);
  if (units.includes(unit.value.toLowerCase())) {
    return {
      ...unit,
      value: lowercase
    };
  }
  return unit;
}

// https://drafts.csswg.org/css-borders-4/#propdef-border-radius
//
// It represents the radii with explicit default values to simplify later
// processing.
function postParseBorderRadiusProperty(radii) {
  const [[h1, h2 = h1, h3 = h1, h4 = h2], vertical] = radii;
  const horizontal = cssValues.list([h1, h2, h3, h4]);
  if (cssValues.isOmitted(vertical)) {
    return cssValues.list([horizontal, horizontal], "/", radii.types);
  }
  const [, [v1 = h1, v2 = v1, v3 = v1, v4 = v2]] = vertical;
  return cssValues.list([horizontal, cssValues.list([v1, v2, v3, v4])], "/", radii.types);
}

// https://drafts.csswg.org/css-borders-4/#typedef-border-radius-syntax
//
// It represents the radii with a whitespace separated list to simplify later
// processing.
function postParseBorderRadiusType(radii) {
  if (radii.types.includes("<slash-separated-border-radius-syntax>")) {
    const [head, tail] = radii;
    return cssValues.list(cssValues.isOmitted(tail) ? [head] : [head, tail[1]], " ", [
      "<legacy-border-radius-syntax>",
      "<border-radius>"
    ]);
  }
  return radii;
}

// https://drafts.csswg.org/css-values-4/#typedef-calc-keyword
//
// It represents the keyword representing a constant as a <number>.
function postParseCalcKeyword(keyword) {
  switch (keyword.value) {
    case "-infinity":
      return cssValues.number(-Infinity, ["<calc-value>"]);
    case "infinity":
      return cssValues.number(Infinity, ["<calc-value>"]);
    case "e":
      return cssValues.number(Math.E, ["<calc-value>"]);
    case "pi":
      return cssValues.number(Math.PI, ["<calc-value>"]);
    case "nan":
      return cssValues.number(NaN, ["<calc-value>"]);
  }
  return keyword;
}

// https://drafts.csswg.org/css-values-4/#typedef-calc-product
// https://drafts.csswg.org/css-values-4/#parse-a-calculation
//
// It represents the product with a flat list of invert and leaf nodes (step 3)
// or with an unwrapped standalone node.
function postParseCalcProduct([left, tail]) {
  if (tail.length === 0) {
    return left;
  }
  return tail.reduce(
    (product, [operator, right]) => {
      if (operator.value === "/") {
        right = {
          types: ["<calc-invert>"],
          value: right
        };
      }
      product.push(right);
      return product;
    },
    cssValues.list([left], "*", ["<calc-product>"])
  );
}

// https://drafts.csswg.org/css-values-5/#funcdef-calc-size
//
// It aborts parsing when a calculation does not match <length-percentage>.
//
// It represents the size with simplified calculations.
function postParseCalcSize(size, node) {
  const values = [];
  for (let value of size.value) {
    if (cssValues.isCalculation(value)) {
      if (!numericTypes.matchNumericType(numericTypes.getCalculationType(value, "<length>"), "<length>", "<length>")) {
        return error(node);
      }
      value = simplify.simplifyCalculation(value, "<length>");
    }
    values.push(value);
  }
  return {
    ...size,
    value: cssValues.list(values)
  };
}

// https://drafts.csswg.org/css-values-4/#typedef-calc-sum
// https://drafts.csswg.org/css-values-4/#parse-a-calculation
//
// It represents the sum with a flat list of negate and product nodes (step 4)
// or with an unwrapped standalone node.
function postParseCalcSum([left, tail]) {
  if (tail.length === 0) {
    return left;
  }
  return tail.reduce(
    (sum, [operator, right]) => {
      if (operator.value === "-") {
        right = {
          types: ["<calc-negate>"],
          value: right
        };
      }
      sum.push(right);
      return sum;
    },
    cssValues.list([left], "+", ["<calc-sum>"])
  );
}

// https://drafts.csswg.org/css-values-4/#typedef-calc-value
// https://drafts.csswg.org/css-values-4/#parse-a-calculation
//
// It represents the value with the corresponding dimension type.
//
// It represents the value without a simple block wrapper (step 5.1).
function postParseCalcValue(value, node) {
  if (cssValues.isBlock(value)) {
    return value.value;
  }
  if (value.types[0] === "<dimension-token>") {
    const type = dimensionValues.getTypeFromUnit(value.unit);
    if (type) {
      return {
        ...dimensionValues.canonicalize(value),
        types: [...value.types, type]
      };
    }
    return error(node);
  }
  return value;
}

// https://drafts.csswg.org/css-fonts-4/#descdef-font-palette-values-override-colors
//
// It aborts parsing when the color is relative whereas the context requires an
// absolute color.
function postParseColor(color, node) {
  if (nodeUtils.isDeclaredBy(node, "override-colors") && !color.types.includes("<color-base>")) {
    return error(node);
  }
  return color;
}

// https://drafts.csswg.org/css-color-adjust-1/#propdef-color-scheme
//
// It invalidates the schemes when they include a trailing `only`.
//
// It aborts parsing when some scheme is a reserved keyword in the context.
function postParseColorScheme(schemes, node) {
  if (cssValues.isList(schemes)) {
    for (const scheme of schemes[0]) {
      const lowercase = stringUtils.toLowerCase(scheme.value);
      if (lowercase === "only") {
        return undefined;
      }
      if (reserved.colorScheme.includes(lowercase)) {
        return error(node);
      }
    }
  }
  return schemes;
}

// https://drafts.csswg.org/css-conditional-5/#propdef-container-name
//
// It aborts parsing when some name is a reserved keyword in the context.
function postParseContainerNameProperty(names, node) {
  if (cssValues.isList(names) &&
      names.some(name => postParseContainerNameType(name) === null)) {
    return error(node);
  }
  return names;
}

// https://drafts.csswg.org/css-conditional-5/#typedef-container-name
//
// Reject reserved names without preventing an unnamed query from starting with `not`.
function postParseContainerNameType(name) {
  return reserved.containerName.includes(stringUtils.toLowerCase(name.value)) ? null : name;
}

// https://drafts.csswg.org/css-lists-3/#typedef-counter-name
//
// It aborts parsing or invalidates the name when it is a reserved keyword in
// the context.
function postParseCounterName(name, node) {
  if (reserved.counterName.includes(stringUtils.toLowerCase(name.value))) {
    if (nodeUtils.getFunctionName(node) === "reversed") {
      return error(node);
    }
    return undefined;
  }
  return name;
}

// https://drafts.csswg.org/css-counter-styles-3/#typedef-counter-style-name
//
// It aborts parsing when the name is `none` or a non-overridable predefined
// counter style name, in @counter-style.
//
// It invalidates the name when it is a reserved keyword in list-style or
// list-style-type properties.
//
// It represents the name with a keyword when it matches a predefined name.
function postParseCounterStyleName(name, node) {
  const lowercase = stringUtils.toLowerCase(name.value);
  if (reserved.counterStyleName.includes(lowercase)) {
    if (nodeUtils.getDeclarationName(node)?.startsWith("list-style")) {
      return undefined;
    }
    return error(node);
  }
  if (counterStyles.predefined.includes(lowercase)) {
    if (!nodeUtils.getDeclaration(node) && counterStyles.nonOverridable.includes(lowercase)) {
      return error(node);
    }
    return cssValues.keyword(lowercase, ["<counter-style-name>"]);
  }
  return name;
}

// https://drafts.csswg.org/css-mixins-1/#typedef-css-type
//
// It represents the type without a type() wrapper when it stands alone.
function postParseCSSType(type) {
  const { value } = type;
  if (cssValues.isFunction(type) && cssValues.isList(value) && cssValues.isOmitted(value[1])) {
    return value[0];
  }
  return type;
}

function postParseCustomFunctionDefinition(definition, node) {
  const name = { types: ["<ident-token>"], value: definition[0].name };
  if (cssValues.isFailure(cssParser.parseGrammar([name], "<dashed-ident>", node))) {
    return error(node);
  }
  return definition;
}

// https://drafts.csswg.org/css-values-4/#identifier-value
//
// It aborts parsing the identifier when it is a globally reserved keyword.
function postParseCustomIdentifier(identifier) {
  const lowercase = stringUtils.toLowerCase(identifier.value);
  if (substitutionsModule.keywords.includes(lowercase) || lowercase === "default") {
    return null;
  }
  return identifier;
}

// https://drafts.csswg.org/css-variables-2/#typedef-custom-property-name
//
// It aborts parsing the name when it is a reserved custom property name.
function postParseCustomPropertyName(name) {
  return name.value === "--" ? null : name;
}

// Unknown URL modifiers are ignored, but malformed known modifiers and repeated
// request modifiers invalidate the URL.
// https://github.com/w3c/csswg-drafts/issues/1603
// https://github.com/w3c/csswg-drafts/issues/12151
function postParseURL(url, node) {
  if (url.types[0] === "<url-token>") {
    return url;
  }
  const [resource, modifiers] = url.value;
  const known = [];
  const requests = new Set();
  for (const modifier of modifiers) {
    const name = modifier.name === undefined ? "" : stringUtils.toLowerCase(modifier.name);
    if (name === "cross-origin" || name === "integrity" || name === "referrer-policy") {
      if (!modifier.types.includes("<request-url-modifier>") || requests.has(name)) {
        return error(node);
      }
      requests.add(name);
      known.push(modifier);
    } else if (name === "param") {
      if (!modifier.types.includes("<param()>")) {
        return error(node);
      }
      known.push(modifier);
    }
  }
  if (known.length === modifiers.length) {
    return url;
  }
  return { ...url, value: cssValues.list([resource, cssValues.list(known, " ")], " ") };
}

// https://drafts.csswg.org/css-syntax-3/#typedef-dashndashdigit-ident
//
// It aborts parsing the identifier when it does not match the expected pattern.
//
// It represents the identifier in lowercase.
function postParseDashNDashDigitIdentifier(identifier) {
  const lowercase = stringUtils.toLowerCase(identifier.value);
  if (/^-n-\d+$/.test(lowercase)) {
    return {
      ...identifier,
      value: lowercase
    };
  }
  return null;
}

// https://drafts.csswg.org/css-values-4/#typedef-dashed-ident
//
// It aborts parsing the identifier when it does not start with `--`.
function postParseDashedIdentifier(identifier) {
  return identifier.value.startsWith("--") ? identifier : null;
}

// https://drafts.csswg.org/css-grid-2/#typedef-flex
// https://drafts.csswg.org/css-values-4/#angle-value
// https://drafts.csswg.org/css-values-4/#frequency-value
// https://drafts.csswg.org/css-values-4/#length-value
// https://drafts.csswg.org/css-values-4/#resolution-value
// https://drafts.csswg.org/css-values-4/#time-value
//
// It aborts parsing the dimension when its unit is unknown or when its value is
// outside a defined range.
function postParseDimension(dimension, { definition: { max, min, name } }) {
  return dimensionValues.validate(dimension, name, min, max);
}

// https://drafts.csswg.org/css-flexbox-2/#valdef-flex-flex-basis
//
// It invalidates the basis when it is `0px` declared as `0`, which was first
// claimed by <'flex-shrink'> before backtracking.
function postParseFlexBasis(basis, { parent: { children } }) {
  if (
    basis.types.includes("<length>") &&
    basis.start === undefined &&
    (children.length === 0 || cssValues.isOmitted(children[0].value[1]))
  ) {
    return null;
  }
  return basis;
}

// https://drafts.csswg.org/css-fonts-4/#font-family-name-value
//
// It aborts parsing the name when it is a reserved keyword in the context.
function postParseFontFamilyName(name) {
  if (name.types.includes("<string>")) {
    return name;
  }
  if (reserved.fontFamilyName.includes(stringUtils.toLowerCase(name[0].value))) {
    return null;
  }
  return name.length > 1 || postParseCustomIdentifier(name[0]) ? name : null;
}

// https://drafts.csswg.org/css-fonts-4/#font-format-values
//
// It aborts parsing when the format is an unknown legacy format string.
function postParseFontFormat(format, node) {
  if (format.types.includes("<string>") && !legacyStringFontFormats.includes(format.value)) {
    return error(node);
  }
  return format;
}

// https://drafts.csswg.org/css-fonts-4/#at-ruledef-font-palette-values
//
// It aborts parsing the rule when it is missing a declaration for
// `font-family`.
function postParseFontPaletteValues(rule, node) {
  return rule.block[0]?.some(declaration => declaration.name === "font-family") ? rule : error(node);
}

// https://drafts.csswg.org/css-fonts-4/#descdef-font-face-src
//
// It aborts parsing when the list is empty (ignoring invalid font sources).
//
// It represents the list without invalid font sources.
function postParseFontSourceList(list, node) {
  list = cssValues.filter(list, Boolean);
  return list.length > 0 ? list : error(node);
}

// https://drafts.csswg.org/selectors-4/#typedef-forgiving-selector-list
//
// It aborts parsing when some selector is invalid and the context disallows
// forgiving parsing (strict).
function postParseForgivingSelectorList(selectors, node) {
  if (selectors.length === 0 && node.context.strict) {
    return error(node);
  }
  const valid = [];
  for (const selector of selectors) {
    if (selector) {
      valid.push(selector);
    } else if (node.context.strict) {
      return error(node);
    }
  }
  const list = selectorSyntax.list(valid);
  if (selectors.serialized) {
    list.representation = selectors.serialized.map(selector => {
      return typeof selector === "string" ? selector : serialize.serializeComponentValue(selector);
    }).join(", ");
  }
  return list;
}

function postParseFunctionToken(token, node) {
  const {
    definition: { range }
  } = node;
  if (range) {
    const name = cssParser.parseGrammar([{ ...token, types: ["<ident-token>"] }], range, node);
    if (cssValues.isFailure(name)) {
      return name;
    }
    token = {
      ...token,
      value: name.value
    };
  }
  return token;
}

// https://drafts.csswg.org/css-mixins-1/#typedef-function-parameter
//
// It aborts parsing when the parameter has the same name as a preceding one,
// or when its default value is invalid according to its type.
//
// It represents the parameter without the default type.
function postParseFunctionParameter(parameter, node) {
  const [name, type, defaultValue] = parameter;
  if (
    node.parent?.children.some(
      (entryParameter, index) => (index + 1) % 2 && entryParameter.value[0].value === name.value
    )
  ) {
    return error(node);
  }
  if (!cssValues.isOmitted(type)) {
    if (cssValues.isFunction(type) && type.value.value === "*") {
      return cssValues.list([name, cssValues.omitted, defaultValue]);
    }
    if (!cssValues.isOmitted(defaultValue)) {
      const definition = serialize.serializeComponentValue(cssValues.isFunction(type) ? type.value : type);
      if (cssValues.isFailure(cssParser.parseGrammar(defaultValue[1], definition, node))) {
        return error(node);
      }
    }
  }
  return parameter;
}

// https://drafts.csswg.org/css-writing-modes-4/#propdef-glyph-orientation-vertical
//
// It aborts parsing when the orientation is neither `auto`, `0`, `0deg`, `90`,
// `90deg`.
function postParseGlyphOrientationVertical(orientation, node) {
  const { types, unit, value } = orientation;
  switch (value) {
    case "auto":
      return orientation;
    case 0:
    case 90:
      return types.includes("<number>") || (types.includes("<angle>") && unit === "deg") ? orientation : error(node);
    default:
      return error(node);
  }
}

function postParseGeneralEnclosed(value, node) {
  // Preserve unknown container query source to match Chromium, Firefox, and WPT. WebKit supports
  // standardizing this behavior, but the issue is unresolved and Conditional 5 still permits normalization.
  // https://github.com/w3c/csswg-drafts/issues/7266#issuecomment-5098285332
  // The `@container` restriction limits this compatibility choice: existing `@supports` tests require
  // normalized escapes. A shared policy for unknown query syntax still needs investigation.
  // When parsing supplied implicit EOF closers, reconstruct the value instead of returning incomplete source.
  if (nodeUtils.getRuleName(node) === "@container" && !node.input.unclosed) {
    return { ...value, representation: stringUtils.copySource(node.input.sliceSource(value.start, value.end)) };
  }
  return value;
}

// https://drafts.csswg.org/css-grid-2/#typedef-grid-row-start-grid-line
//
// It aborts parsing or invalidates the line when its name is is a reserved
// keyword in the context.
function postParseGridLine(line, node) {
  if (cssValues.isList(line)) {
    if (line[0].types.includes("<integer>") && line[0].value === 0) {
      return error(node);
    }
    const identifier = line.flat().at(-1);
    if (!cssValues.isOmitted(identifier)) {
      const name = stringUtils.toLowerCase(identifier.value);
      if (name === "auto") {
        return error(node);
      }
      if (name === "span") {
        return undefined;
      }
    }
    return line;
  }
  if (line.types.includes("<custom-ident>") && stringUtils.toLowerCase(line.value) === "span") {
    return undefined;
  }
  return line;
}

function postParseGapAutoRuleList([before, , repeat, , after]) {
  return cssValues.list([
    ...cssValues.isOmitted(before) ? [] : before,
    repeat,
    ...cssValues.isOmitted(after) ? [] : after
  ], ",");
}

function postParseGridTemplate(template, node) {
  if (!cssValues.isList(template) || template[0].types.includes("<'grid-template-rows'>")) {
    return template;
  }
  const rows = template[0];
  const areas = postParseGridTemplateAreas(cssValues.list(rows.map(([, area]) => area)), node);
  if (cssValues.isFailure(areas)) {
    return areas;
  }
  const normalized = cssValues.list(rows.map((row, index) => {
    return cssValues.list([row[0], areas[index], ...row.slice(2)], row.separator, row.types);
  }), rows.separator, rows.types);
  return cssValues.list([normalized, ...template.slice(1)], template.separator, template.types);
}

// https://drafts.csswg.org/css-grid-2/#valdef-grid-template-areas-string
//
// It aborts parsing when the areas are defined with:
// - no cell
// - a trash token
// - a non-rectangular named area
// - rows of non-equal lengths
//
// It represents the areas with collapsed null cell tokens and with cell tokens
// joined with a whitespace.
function postParseGridTemplateAreas(areas, node) {
  if (cssValues.isList(areas)) {
    const strings = [];
    const named = new Map();
    for (const [row, { value }] of areas.entries()) {
      const cells = [];
      const string = new CSSStream(value);
      while (!string.atEnd()) {
        if (string.consumeRunOf(stringUtils.isWhitespace)) {
          continue;
        }
        if (string.consumeRunOf(".")) {
          cells.push(".");
          continue;
        }
        const cell = string.consumeRunOf(stringUtils.isIdentifierCharacter);
        if (cell) {
          // NamedCells => Map { [Name]: [Row] }
          // Row        => [Position]
          // Position   => [Number, Number]
          const position = [cells.length, row];
          if (named.has(cell)) {
            const rows = named.get(cell);
            const lastRow = rows.at(-1);
            if (row === lastRow[0][1]) {
              lastRow.push(position);
            } else {
              rows.push([position]);
            }
          } else {
            named.set(cell, [[position]]);
          }
          cells.push(cell);
          continue;
        }
        return error(node);
      }
      const { length } = cells;
      // All strings must define the same number of cells and at least one cell
      if (length === 0 || strings.some(entryString => length !== entryString.length)) {
        return error(node);
      }
      strings.push(cells);
    }
    // Search for invalid non-rectangular named areas
    for (const rows of named.values()) {
      const firstRow = rows[0];
      const columnLength = firstRow.length;
      const startColumn = firstRow[0][0];
      for (const [startRow, row] of rows.entries()) {
        const { length } = row;
        // Not the same number of cells
        if (length !== columnLength) {
          return error(node);
        }
        const [[x, y]] = row;
        // Not the same start column or row gap
        if (x !== startColumn || (startRow > 0 && y !== rows[startRow - 1][0][1] + 1)) {
          return error(node);
        }
        // Column gap
        for (let index = 1; index < length; index++) {
          if (row[index][0] !== row[index - 1][0] + 1) {
            return error(node);
          }
        }
      }
    }
    return cssValues.list(
      strings.map(cells => cssValues.string(cells.join(" "))),
      areas.separator,
      areas.types
    );
  }
  return areas;
}

// https://drafts.csswg.org/css-color-4/#typedef-hex-color
//
// It aborts parsing the color when its value is not hexadecimal.
function postParseHexColor(color) {
  const { value } = color;
  if ([...value].every(entryValue => /[a-f\d]/i.test(entryValue)) && hexLengths.includes(value.length)) {
    return color;
  }
  return null;
}

// https://drafts.csswg.org/selectors-4/#typedef-id-selector
//
// It aborts parsing when the unprefixed selector hash is not a valid identifier.
function postParseIDSelector(selector, node) {
  return selector.type === "id" ? selector : error(node);
}

// https://drafts.csswg.org/css-values-4/#integer-value
//
// It aborts parsing the integer when its value is not an integer or is outside
// a defined range.
function postParseInteger(integer, node) {
  if (integer.integer !== false && Number.isInteger(integer.value)) {
    return postParseNumeric(integer, node);
  }
  return null;
}

// https://drafts.csswg.org/css-animations-1/#typedef-keyframes-name
//
// It aborts parsing when the name is a reserved keyword in the context or the
// empty string.
function postParseKeyframesName(name, node) {
  if (name.types.includes("<custom-ident>") && reserved.keyframeName.includes(stringUtils.toLowerCase(name.value))) {
    return error(node);
  }
  if (name.types.includes("<string>") && name.value === "") {
    return error(node);
  }
  return name;
}

// https://drafts.csswg.org/css-values-4/#css-keyword
//
// It aborts parsing the keyword when it does not match the expected value or
// any legacy mapped value.
//
// It represents the keyword in lowercase, with an alias name replaced with its
// target name.
function postParseKeyword(keyword, node) {
  const lowercase = stringUtils.toLowerCase(keyword.value);
  const {
    definition: { range }
  } = node;
  if (lowercase === stringUtils.toLowerCase(range)) {
    return {
      ...keyword,
      value: lowercase
    };
  }
  if (nodeUtils.getFunctionName(node) === range) {
    const {
      values: {
        functions: { aliases, mappings }
      }
    } = compatibility;
    if (aliases?.get(lowercase) === range) {
      return {
        ...keyword,
        value: range
      };
    }
    if (mappings?.has(lowercase) === range) {
      return {
        ...keyword,
        value: lowercase
      };
    }
    return null;
  }
  const { aliases, mappings } = compatibility.values.keywords[nodeUtils.getDeclarationName(node)] ?? {};
  if (aliases?.get(lowercase) === range) {
    return {
      ...keyword,
      value: range
    };
  }
  if (mappings?.get(lowercase) === range) {
    return {
      ...keyword,
      value: lowercase
    };
  }
  return null;
}

// https://drafts.csswg.org/css-cascade-5/#typedef-layer-name
//
// It aborts parsing when the name includes a globally reserved keyword.
function postParseLayerName(name, node) {
  const [head, tail] = name;
  if (
    substitutionsModule.keywords.includes(head.value) ||
    tail.some(([, entryName]) => substitutionsModule.keywords.includes(entryName.value))
  ) {
    return error(node);
  }
  return name;
}

// https://drafts.csswg.org/css-grid-2/#auto-repeat
function postParseLineNameList(names, node) {
  let autoFill = false;
  for (const name of names) {
    if (cssValues.isFunction(name, "repeat") && name.value[0].value === "auto-fill") {
      if (autoFill) {
        return error(node);
      }
      autoFill = true;
    }
  }
  return names;
}

// https://drafts.csswg.org/css-grid-2/#typedef-line-names
//
// It aborts parsing when some name is a reserved keyword in the context.
function postParseLineNames(names, node) {
  if (names.value.some(name => reserved.lineName.includes(stringUtils.toLowerCase(name.value)))) {
    return error(node);
  }
  return names;
}

// https://drafts.csswg.org/css-easing-2/#funcdef-linear
//
// It represents the linear function with explicit control points.
function postParseLinear({ value, ...props }) {
  const points = [];
  value.forEach(point => {
    const [output, input] = point;
    if (input.length === 2) {
      const [x1, x2] = input;
      points.push(cssValues.list([output, x1]), cssValues.list([output, x2]));
    } else {
      points.push(point);
    }
  });
  return {
    ...props,
    value: cssValues.list(points, ",")
  };
}

// https://drafts.csswg.org/css-anchor-position-1/#typedef-position-try-fallbacks-try-tactic
// https://svgwg.org/svg2-draft/painting.html#PaintOrderProperty
//
// It represents the list items in the same order as declared.
function postParseListToDeclaredOrder(list) {
  return list.sort((a, b) => {
    if (cssValues.isOmitted(a)) {
      return 1;
    }
    if (cssValues.isOmitted(b)) {
      return -1;
    }
    return a.start < b.start ? -1 : 1;
  });
}

// https://drafts.csswg.org/css-values-4/#funcdef-log
//
// It represents the log with its base and the preceding comma replaced with
// omitted values when the base is equal to the base of natural logarithms, to
// simplify later processing.
function postParseLog(log) {
  const { value } = log;
  const base = value.at(-1);
  if (cssValues.isNumeric(base) && base.value === Math.E) {
    value.splice(-2, 2, cssValues.omitted, cssValues.omitted);
  }
  return log;
}

// https://drafts.csswg.org/cssom-1/#parse-a-media-query-list
// https://drafts.csswg.org/mediaqueries-5/#typedef-media-query-list
//
// It represents the list with invalid media queries replaced with `not all`.
function postParseMediaQueryList(list) {
  return cssValues.map(list, media => media ?? defaultsModule.notAll);
}

function postParseMediaCondition(value) {
  if (value.types.includes("<media-not>")) {
    return mediaSyntax.not(value[1]);
  }
  const [first, rest] = value;
  return mediaSyntax.condition(rest[0]?.[0].value, [first, ...rest.map(entry => entry[1])]);
}

function postParseMediaQuery(value) {
  if (mediaSyntax.isMedia(value)) {
    return value;
  }
  const [modifier, type, tail] = value;
  return mediaSyntax.query(
    cssValues.isOmitted(modifier) ? null : modifier.value,
    type.value,
    cssValues.isOmitted(tail) ? null : tail[1]
  );
}

// https://drafts.csswg.org/mediaqueries-5/#typedef-media-type
//
// It aborts parsing when the type is a reserved keyword in the context.
//
// It represents the identifier in lowercase.
function postParseMediaType(type, node) {
  const lowercase = stringUtils.toLowerCase(type.value);
  return reserved.mediaType.includes(lowercase) ?
    error(node) :
    {
      ...type,
      value: lowercase
    };
}

// https://drafts.csswg.org/css-syntax-3/#typedef-ndashdigit-dimension
//
// It aborts parsing the dimension when its unit does not match the expected
// pattern.
function postParseNDashDigitDimension(dimension) {
  if (/^n-\d+$/.test(dimension.unit) && dimension.integer !== false && Number.isInteger(dimension.value)) {
    return dimension;
  }
  return null;
}

// https://drafts.csswg.org/css-syntax-3/#typedef-ndashdigit-ident
//
// It aborts parsing the identifier when it does not match the expected pattern.
//
// It represents the identifier in lowercase.
function postParseNDashDigitIdentifier(identifier) {
  const lowercase = stringUtils.toLowerCase(identifier.value);
  if (/^n-\d+$/.test(lowercase)) {
    return {
      ...identifier,
      value: lowercase
    };
  }
  return null;
}

// https://drafts.csswg.org/css-syntax-3/#typedef-ndash-dimension
//
// It aborts parsing the dimension when its unit does not match the expected
// pattern.
function postParseNDashDimension(dimension) {
  if (dimension.unit === "n-" && dimension.integer !== false && Number.isInteger(dimension.value)) {
    return dimension;
  }
  return null;
}

// https://drafts.csswg.org/css-syntax-3/#typedef-n-dimension
//
// It aborts parsing the dimension when its unit does not match the expected
// pattern.
function postParseNDimension(dimension) {
  if (dimension.unit === "n" && dimension.integer !== false && Number.isInteger(dimension.value)) {
    return dimension;
  }
  return null;
}

// https://drafts.csswg.org/selectors-4/#typedef-ns-prefix
//
// It aborts parsing when the prefix is undeclared.
function postParseNSPrefix(prefix, node) {
  const name = prefix[0];
  if (cssValues.isOmitted(name) || cssValues.isDelimiter("*", name) || node.context.namespaces.has(name.value)) {
    return prefix;
  }
  const block = nodeUtils.getBlock(node);
  if (block && nodeUtils.getProduction(block)?.definition.name === "<attribute-selector>") {
    return undefined;
  }
  return error(node);
}

// https://drafts.csswg.org/css-values-4/#integer-value
// https://drafts.csswg.org/css-values-4/#number-value
// https://drafts.csswg.org/css-values-4/#percentage-value
//
// It aborts parsing the numeric when its value is outside a defined range.
function postParseNumeric(numeric, { definition: { max = Infinity, min = -Infinity } }) {
  const { value } = numeric;
  if (min <= value && value <= max) {
    return numeric;
  }
  return null;
}

// https://drafts.csswg.org/css-fonts-4/#typedef-opentype-tag
//
// It aborts parsing when the tag has less or more than 4 characters or when it
// includes a non-ASCII character.
function postParseOpenTypeTag(tag, node) {
  if (/^[\u0020-\u007E]{4}$/.test(tag.value)) {
    return tag;
  }
  return error(node);
}

// https://svgwg.org/svg2-draft/painting.html#PaintOrderProperty
//
// It represents the paint operations in the same order as declared.
function postParsePaintOrder(paint) {
  return cssValues.isList(paint) ? postParseListToDeclaredOrder(paint) : paint;
}

// https://drafts.css-houdini.org/css-properties-values-api-1/#at-ruledef-property
//
// It aborts parsing the rule when its `initial-value` is invalid according to
// its `syntax`.
function postParseProperty(rule, node) {
  const declarations = rule.block[0] ?? [];
  const syntaxValue = declarations.find(declaration => declaration.name === "syntax")?.value;
  const syntax = syntaxValue ? serialize.serializeComponentValue(syntaxValue) : "*";
  const grammar = syntaxValue ? compileRegistrationSyntax(syntaxValue) : "*";
  const inherits = declarations.find(declaration => declaration.name === "inherits");
  const initialDeclaration = declarations.find(declaration => declaration.name === "initial-value");
  let initial = null;
  if (initialDeclaration) {
    const initialValue = serialize.serializeDeclarationValue(initialDeclaration);
    const context = parseContext.createVirtualContext(node.context.globalObject, "@style");
    if (syntax === "*") {
      if (isValidUniversalInitialValue(initialDeclaration.value)) {
        initial = initialDeclaration.value;
      }
    } else {
      const parsed = cssParser.parseGrammar(initialValue, grammar, context);
      if (!cssValues.isFailure(parsed) && cssValues.isComputationallyIndependent(parsed)) {
        initial = parsed;
      }
    }
    if (initial === null) {
      rule.block[0] = declarations.filter(declaration => declaration !== initialDeclaration);
    }
  }
  rule.registration = {
    syntax,
    grammar,
    inherits: inherits ? serialize.serializeDeclarationValue(inherits) === "true" : true,
    initialValue: initial
  };
  return rule;
}

// https://drafts.csswg.org/selectors-4/#typedef-pseudo-class-selector
//
// It aborts parsing when the selector:
// - is an unknown pseudo-class identifier
// - is invalid in the context
// - has an invalid argument
function postParsePseudoClassSelector(selector, node) {
  if (nodeUtils.isProducedBy(node, "<pseudo-element-selector>")) {
    return selector;
  }
  const [, pseudo] = selector;
  let { name, value } = pseudo;
  const context = selectorContext.getContext(node);
  if (name) {
    name = selectorContext.normalizeClassName(name);
    const type = `${name}()`;
    const definition = pseudos.classes[type];
    if (selectorContext.isValidClass(type, context)) {
      node = {
        ...node,
        selectorContext: selectorContext.enterFunction(context, name),
        definition: { name, type: "function", value: definition.value }
      };
      value = cssParser.parseGrammar(
        new CSSStream(cssValues.isOmitted(value) ? cssValues.list() : value, node.input.source),
        definition.value,
        node
      );
      if (!cssValues.isFailure(value)) {
        return selectorSyntax.pseudo("pseudo-class", { name, value, end: pseudo.end });
      }
    }
    return error(node);
  }
  value = selectorContext.normalizeClassName(value);
  return selectorContext.isValidClass(value, context) ?
    selectorSyntax.pseudo("pseudo-class", { value, end: pseudo.end }) :
null;
}

function postParsePseudoElementSelector(selector, node) {
  const pseudo = selector.types.includes("<legacy-pseudo-element-selector>") ? selector[1] : selector[1][1];
  let { name, value } = pseudo;
  const context = selectorContext.getContext(node);
  if (name) {
    name = selectorContext.normalizeElementName(name);
    const type = `${name}()`;
    const definition = pseudos.elements[type];
    if (selectorContext.isValidElement(type, context)) {
      node = {
        ...node,
        selectorContext: selectorContext.enterFunction(context, name),
        definition: { name, type: "function", value: definition.value }
      };
      value = cssParser.parseGrammar(cssValues.isOmitted(value) ? cssValues.list() : value, definition.value, node);
      if (!cssValues.isFailure(value)) {
        return selectorSyntax.pseudo("pseudo-element", { name, value, end: pseudo.end });
      }
    }
    return error(node);
  }
  value = selectorContext.normalizeElementName(value);
  return selectorContext.isValidElement(value, context) ?
    selectorSyntax.pseudo("pseudo-element", { value, end: pseudo.end }) :
error(node);
}

function postParseRadialGradient(gradient, node) {
  const configuration = gradient[0];
  if (!cssValues.isOmitted(configuration) && !cssValues.isOmitted(configuration[0])) {
    const aspect = configuration[0][0];
    if (!cssValues.isOmitted(aspect) && aspect.every(value => !cssValues.isOmitted(value))) {
      const [shape, size] = aspect;
      if (shape.value === "circle" && size.length > 1) {
        return error(node);
      }
    }
  }
  return gradient;
}

// https://drafts.csswg.org/css-shapes-1/#funcdef-basic-shape-circle
//
// It aborts parsing when the size is declared with two <radial-radius> for
// circle().
function postParseRadialSize(size, node) {
  if (size.length === 2 && nodeUtils.getFunctionName(node) === "circle") {
    return error(node);
  }
  return size;
}

// https://drafts.csswg.org/css-values-5/#funcdef-random
//
// It aborts parsing when the key is element-dependent while the context is not
// elemental.
//
// It represents random():
// - with its value in a comma separated list, to simplify later processing
// - with an explicit default <random-key> when omitted
// - with `property-*-scoped` replaced with the appropriate <random-ua-ident>
// - with a `base` value only when it is explicitly fixed
function postParseRandom({ value: [key, , min, , max, , step], ...props }, node) {
  if (cssValues.isOmitted(key)) {
    if (!nodeUtils.getRule(node)?.definition.elemental) {
      return error(node);
    }
    key = cssValues.list(
      [cssValues.omitted, cssValues.keyword("element-scoped"), cssValues.keyword("property-index-scoped")],
      " ",
      ["<random-cache-key>", "<random-key>"]
    );
  }
  let base;
  // Assert: the key is a <random-cache-key> or a fixed <number>
  if (key.types.includes("<random-cache-key>")) {
    let [identifier, elementScoped, propertyScoped] = key;
    // Replace `property-*-scoped` with the corresponding `<random-ua-ident>`
    if (propertyScoped.types.includes("<keyword>")) {
      const declaration = nodeUtils.getDeclaration(node);
      // Property scope outside declarations is unresolved: https://github.com/w3c/csswg-drafts/issues/10982.
      if (!declaration) {
        return error(node);
      }
      const property = node.context.randomEvaluation ?
        `early-${node.context.randomEvaluation.property}` :
        declaration.definition.name;
      if (propertyScoped.value === "property-index-scoped") {
        const index = cssParser.getRandomFunctionIndex(node);
        propertyScoped = cssValues.customIdentifier(`ua-${property}-${index}`, ["<random-ua-ident>"]);
      } else {
        propertyScoped = cssValues.customIdentifier(`ua-${property}`, ["<random-ua-ident>"]);
      }
      key = cssValues.list([identifier, elementScoped, propertyScoped], " ", ["<random-cache-key>", "<random-key>"]);
    }
  } else {
    base = key[1].value;
  }
  return {
    ...props,
    base,
    value: cssValues.list(cssValues.isOmitted(step) ? [key, min, max] : [key, min, max, step], ",")
  };
}

// https://drafts.csswg.org/css-values-5/#typedef-random-cache-key
//
// It invalidates the key when it is the `fixed` keyword.
//
// It aborts parsing when the key is element-dependent while the context is not
// elemental.
function postParseRandomCacheKey(key, node) {
  const [, elementScoped, propertyScoped] = key;
  if (propertyScoped.value === "fixed") {
    return undefined;
  }
  if (
    (cssValues.isOmitted(elementScoped) && cssValues.isOmitted(propertyScoped)) ||
    nodeUtils.getRule(node)?.definition.elemental
  ) {
    return key;
  }
  return error(node);
}

// https://drafts.csswg.org/css-values-5/#typedef-random-key
//
// It aborts parsing when the key is element-dependent while the context is not
// elemental.
//
// It represents the key with `element-scoped property-index` when it is `auto`.
function postParseRandomKey(key, node) {
  if (key.value === "auto") {
    if (nodeUtils.getRule(node)?.definition.elemental) {
      return cssValues.list(
        [cssValues.omitted, cssValues.keyword("element-scoped"), cssValues.keyword("property-index-scoped")],
        " ",
        ["<random-cache-key>", "<random-key>"]
      );
    }
    return error(node);
  }
  return key;
}

// https://drafts.csswg.org/css-counter-styles-3/#descdef-counter-style-range
//
// It aborts parsing when the lower bound is lower than the higher bound.
function postParseRange(range, node) {
  if (
    cssValues.isList(range) &&
    range.some(bounds => bounds.every(bound => bound.types.includes("<integer>")) && bounds[1].value < bounds[0].value)
  ) {
    return error(node);
  }
  return range;
}

// https://drafts.csswg.org/css-values-4/#funcdef-round
//
// It represents round() with its arguments in a comma separated list and with
// explicit default values, to simplify later processing.
function postParseRound({ value: [strategy, , a, , b], ...props }) {
  if (cssValues.isOmitted(strategy)) {
    strategy = cssValues.keyword("nearest", ["<rounding-strategy>"]);
  }
  if (cssValues.isOmitted(b) && strategy.value !== "line-width") {
    b = cssValues.number(1, ["<calc-value>"]);
  }
  return {
    ...props,
    value: cssValues.list([strategy, a, b], ",")
  };
}

// https://drafts.csswg.org/css-syntax-3/#typedef-signed-integer
//
// It aborts parsing the integer when its value is not an integer or is not
// prefixed with `+` or `-`.
function postParseSignedInteger(integer) {
  if (integer.sign && integer.integer !== false && Number.isInteger(integer.value)) {
    return integer;
  }
  return null;
}

// https://drafts.csswg.org/css-syntax-3/#typedef-signless-integer
//
// It aborts parsing the integer when its value is not an integer or is prefixed
// with `+` or `-`.
function postParseSignlessInteger(integer) {
  if (!integer.sign && integer.integer !== false && Number.isInteger(integer.value)) {
    return integer;
  }
  return null;
}

// https://drafts.csswg.org/css-easing-2/#funcdef-steps
//
// It represents the steps count with a range that corresponds to its position.
//
// It aborts parsing when the step count is too low.
function postParseSteps(steps, node) {
  const {
    value: [count, , { value: position }]
  } = steps;
  if (count.types.includes("<calc-function>")) {
    count.range = [position === "jump-none" ? 2 : 1, Number.MAX_SAFE_INTEGER];
  } else if (count.value < 1 || (count.value < 2 && position === "jump-none")) {
    return error(node);
  }
  return steps;
}

// https://drafts.csswg.org/css-conditional-5/#typedef-style-feature-name
//
// It aborts parsing when the name is not a valid style property.
//
// It represents the name in lowercase if it is a standard property.
function postParseStyleFeatureName(name, node) {
  const definition = contextUtils.getDeclarationDefinition(nodeUtils.getRule(node), name.value);
  if (definition) {
    if (definition.name === "--*") {
      return definition;
    }
    return {
      ...name,
      value: definition.name
    };
  }
  return error(node);
}

// https://drafts.csswg.org/css-conditional-5/#typedef-style-feature-name
//
// It aborts parsing when the declaration value is `revert`, `revert-layer`, or
// `revert-rule`.
function postParseStyleFeaturePlain(declaration, node) {
  if (declaration.value.value?.startsWith?.("revert")) {
    return error(node);
  }
  // Match browsers and WPT by normalizing the declaration's identifier and colon spacing, e.g.
  // `style(--foo:bar)` becomes `style(--foo: bar)`. The custom property's value retains its source spelling,
  // including internal whitespace and numbers such as `2.100`. Conditional 5 permits normalization;
  // the issue below tracks the missing precise requirements, rather than a resolution mandating this choice.
  // https://github.com/w3c/csswg-drafts/issues/7266
  delete declaration.representation;
  return declaration;
}

// https://drafts.csswg.org/css-conditional-5/#typedef-supports-at-rule-fn
//
// It aborts parsing when the argument is not a defined at-rule.
//
// It represents the function with its argument in lowercase.
function postParseSupportsAtRule(fn, node) {
  const { value } = fn;
  const lowercase = stringUtils.toLowerCase(value.value);
  const definition = definitionUtils.findRule(`@${lowercase}`);
  if (definition && !definition.qualified) {
    return {
      ...fn,
      value: {
        ...value,
        value: lowercase
      }
    };
  }
  return error(node);
}

// https://drafts.csswg.org/css-conditional-5/#typedef-supports-env-fn
//
// It aborts parsing when the argument is not a <dashed-ident> or a defined
// standard environment variable.
//
// It represents the function with its argument in lowercase.
function postParseSupportsEnvironmentVariable(fn, node) {
  const { value } = fn;
  if (value.value.startsWith("--")) {
    return fn;
  }
  const lowercase = stringUtils.toLowerCase(value.value);
  if (environmentModule[lowercase]) {
    return {
      ...fn,
      value: {
        ...value,
        value: lowercase
      }
    };
  }
  return error(node);
}

// https://drafts.csswg.org/css-conditional-5/#typedef-supports-font-format-fn
//
// It aborts parsing when the argument is a <string>.
function postParseSupportsFontFormat(fn, node) {
  if (fn.value.types.includes("<string>")) {
    return error(node);
  }
  return fn;
}

// https://drafts.csswg.org/css-conditional-5/#typedef-supports-named-feature-fn
//
// It aborts parsing when the argument is not a defined named feature.
//
// It represents the function with its argument in lowercase.
function postParseSupportsNamedFeature(fn, node) {
  const { value } = fn;
  const lowercase = stringUtils.toLowerCase(value.value);
  if (featureModule.named.includes(lowercase)) {
    return {
      ...fn,
      value: {
        ...value,
        value: lowercase
      }
    };
  }
  return error(node);
}

// https://drafts.csswg.org/css-counter-styles-3/#funcdef-symbols
//
// It aborts parsing when symbols are missing for the declared symbol type.
function postParseSymbols(symbols, node) {
  const {
    value: [{ value: type }, list]
  } = symbols;
  if ((type === "alphabetic" || type === "numeric") && list.length === 1) {
    return error(node);
  }
  return symbols;
}

// Preserve the source inside a supports declaration, including edge whitespace.
function postParseSupportsDeclaration(declaration, node) {
  return {
    ...declaration,
    representation: stringUtils.copySource(node.input.sliceSource(declaration.start, declaration.end))
  };
}

// https://drafts.css-houdini.org/css-properties-values-api-1/#descdef-property-syntax
// https://drafts.csswg.org/css-values-5/#typedef-syntax
//
// Registered type names use their literal lowercase spelling.
function postParseSyntax(syntax, node) {
  if (isRegistrationSyntax(node) && syntax.source === undefined && cssValues.isList(syntax)) {
    for (const component of [syntax[0], ...syntax[1].map(([, value]) => value)]) {
      const single = component.length === 3 ? component : component[0];
      if (cssValues.isList(single)) {
        const name = single[1];
        if (node.input.sliceSource(name.start, name.end) !== name.value) {
          return error(node);
        }
      }
    }
  }
  return syntax;
}

function isRegistrationSyntax(node) {
  return nodeUtils.getRuleName(node) === "@property" && nodeUtils.getDeclarationName(node) === "syntax";
}

function postParseRegisteredIdentifier(identifier, { definition }) {
  return identifier.value === definition.range ? identifier : null;
}

// https://drafts.csswg.org/css-values-5/#typedef-syntax-single-component
//
// Registration literals additionally exclude reserved custom identifiers.
function postParseSyntaxSingleComponent(component, node) {
  if (isRegistrationSyntax(node) && component.types.includes("<ident>")) {
    return postParseCustomIdentifier(component) ?? error(node);
  }
  return component;
}

// https://drafts.csswg.org/css-values-5/#typedef-syntax-string
//
// It aborts parsing when the syntax is invalid or uses unsupported features of
// the CSS value definition syntax.
function postParseSyntaxString(syntax, node) {
  const parsed = cssParser.parseGrammar(syntax.value, "<syntax>", node);
  if (cssValues.isFailure(parsed)) {
    return error(node);
  }
  parsed.source = syntax.value;
  return parsed;
}

// https://drafts.csswg.org/css-values-5/#typedef-syntax-type-name
//
// It aborts parsing when the name `url` is used in <attr-type>.
function postParseSyntaxTypeName(name, node) {
  const fn = nodeUtils.getFunction(node);
  if (name.value === "url" && fn && nodeUtils.isProducedBy(fn, "<attr-type>")) {
    return error(node);
  }
  return name;
}

// https://drafts.csswg.org/css-text-4/#propdef-text-align
// https://drafts.csswg.org/css-text-4/#propdef-text-align-all
//
// It aborts parsing when the alignment is not a single character string.
function postParseTextAlign(alignment, node) {
  if (alignment.types.includes("<string>") && alignment.value.length > 1) {
    return error(node);
  }
  return alignment;
}

// https://drafts.csswg.org/css-grid-2/#typedef-track-list
//
// It represents the list with an <explicit-track-list> when all track sizes are
// explicit, to simplify later processing.
function postParseTrackList(list) {
  if (list[0].every(([, size]) => size.types.includes("<track-size>"))) {
    list.types.push("<explicit-track-list>");
  }
  return list;
}

// https://drafts.csswg.org/css-syntax-3/#typedef-urange
//
// It aborts parsing when the range:
// - does not start with `U+` or `u+`
// - has its start or end value that has 0 or more than 6 hexadecimal digits
// - has its start and end values not separated with `-`
// - has its start value greater than its end value
// - has its end value greather than `10FFFF` (max. allowed code point)
// - includes an invalid wildcard `?`
//
// It represents the range with a custom representation.
function postParseUnicodeRange(range, node) {
  const MAXIMUM_CODE_POINT = 0x10ffff;
  const text = [];
  range.flat().forEach(({ end, start }) => {
    const representation = node.input.sliceSource(start, end);
    if (stringUtils.toLowerCase(representation) !== "u") {
      text.push(...representation);
    }
  });
  if (text.shift() !== "+") {
    return error(node);
  }
  let consumed = "";
  while (stringUtils.isHexadecimal(text[0])) {
    consumed += text.shift();
  }
  while (text[0] === "?") {
    consumed += text.shift();
  }
  const fromLength = consumed.length;
  if (fromLength === 0 || fromLength > 6) {
    return error(node);
  }
  const { length } = text;
  const { types } = range;
  if (consumed.endsWith("?")) {
    if (length > 0) {
      return error(node);
    }
    const to = Number(`0x${consumed.replaceAll("?", "F")}`);
    if (MAXIMUM_CODE_POINT < to) {
      return error(node);
    }
    return {
      from: Number(`0x${consumed.replaceAll("?", "0")}`),
      to,
      types
    };
  }
  const from = Number(`0x${consumed}`);
  if (length === 0) {
    if (MAXIMUM_CODE_POINT < from) {
      return error(node);
    }
    return {
      from,
      to: from,
      types
    };
  }
  if (text.shift() !== "-") {
    return error(node);
  }
  consumed = "";
  while (stringUtils.isHexadecimal(text[0])) {
    consumed += text.shift();
  }
  const toLength = consumed.length;
  if (toLength === 0 || toLength > 6 || text.length > 0 || MAXIMUM_CODE_POINT < consumed || consumed < from) {
    return error(node);
  }
  return {
    from,
    to: Number(`0x${consumed}`),
    types
  };
}

// https://drafts.csswg.org/css-view-transitions-2/#propdef-view-transition-class
//
// It aborts parsing when some name is a reserved keyword in the context.
function postParseViewTransitionClass(names, node) {
  if (
    cssValues.isList(names) &&
    names.some(name => reserved.viewTransitionClass.includes(stringUtils.toLowerCase(name.value)))
  ) {
    return error(node);
  }
  return names;
}

// https://drafts.csswg.org/css-view-transitions-2/#propdef-view-transition-name
//
// It aborts parsing when the name is a reserved keyword in the context.
function postParseViewTransitionName(name, node) {
  if (
    name.types.includes("<custom-ident>") && reserved.viewTransitionName.includes(stringUtils.toLowerCase(name.value))
  ) {
    return error(node);
  }
  return name;
}

// https://drafts.csswg.org/css-view-transitions-2/#typedef-view-transition-type
//
// It aborts parsing when the type is a reserved keyword in the context.
function postParseViewTransitionType(type, node) {
  const lowercase = stringUtils.toLowerCase(type.value);
  if (reserved.viewTransitionType.includes(lowercase) || type.value.startsWith("-ua-")) {
    return error(node);
  }
  return type;
}

// https://drafts.csswg.org/css-values-4/#zero-value
//
// It aborts parsing zero when its value is not zero.
//
// It represents zero with an angle when it is accepted as an alternative
// (browser conformance).
function postParseZero(zero, { parent }) {
  if (zero.value !== 0) {
    return null;
  }
  if (parent) {
    const {
      definition: { type, value }
    } = parent;
    if (type === "|" || type === "||") {
      for (const { name } of value) {
        if (name === "<angle-percentage>") {
          return cssValues.angle(0, "deg", [name]);
        }
        if (name === "<angle>") {
          return cssValues.angle(0, "deg");
        }
      }
    }
  }
  return zero;
}
function postParsePath(path) {
  const commands = parsePath(path.value[2].value);
  return commands === null ? null : { ...path, commands };
}

// Negative filter arguments are invalid, but values above the upper bound of
// these four functions are accepted and clamped, including in specified style.
// https://drafts.csswg.org/filter-effects-1/#supported-filter-functions
function postParseFilterFunction(filter) {
  if (filter.name === "drop-shadow") {
    const blur = filter.value[1][2];
    return blur && cssValues.isNumeric(blur, { literal: true }) && blur.value < 0 ? null : filter;
  }
  if (["grayscale", "invert", "opacity", "sepia"].includes(filter.name) &&
      cssValues.isNumeric(filter.value, { literal: true })) {
    const maximum = filter.value.types.includes("<percentage>") ? 100 : 1;
    return { ...filter, value: { ...filter.value, value: Math.min(filter.value.value, maximum) } };
  }
  return filter;
}

module.exports = {
  "<filter-function>": postParseFilterFunction,
  "<'animation-timeline'>": postParseAnimationTimeline,
  "<'border-radius'>": postParseBorderRadiusProperty,
  "<'color-scheme'>": postParseColorScheme,
  "<'flex-basis'>": postParseFlexBasis,
  "<angle>": postParseDimension,
  "<animateable-feature>": postParseAnimateableFeature,
  "<attr-unit>": postParseAttributeUnit,
  "<border-radius>": postParseBorderRadiusType,
  "<calc-keyword>": postParseCalcKeyword,
  "<calc-product>": postParseCalcProduct,
  "<calc-size()>": postParseCalcSize,
  "<calc-sum>": postParseCalcSum,
  "<calc-value>": postParseCalcValue,
  "<color>": postParseColor,
  "<'container-name'>": postParseContainerNameProperty,
  "<container-name>": postParseContainerNameType,
  "<counter-name>": postParseCounterName,
  "<counter-style-name>": postParseCounterStyleName,
  "<css-type>": postParseCSSType,
  "<custom-function-definition>": postParseCustomFunctionDefinition,
  "<custom-ident>": postParseCustomIdentifier,
  "<custom-property-name>": postParseCustomPropertyName,
  "<dashed-ident>": postParseDashedIdentifier,
  "<dashndashdigit-ident>": postParseDashNDashDigitIdentifier,
  "<flex>": postParseDimension,
  "<font-family-name>": postParseFontFamilyName,
  "<font-format>": postParseFontFormat,
  "<font-src-list>": postParseFontSourceList,
  "<forgiving-selector-list>": postParseForgivingSelectorList,
  "<gap-auto-rule-list>": postParseGapAutoRuleList,
  "<'grid-template'>": postParseGridTemplate,
  "<frequency>": postParseDimension,
  "<function-parameter>": postParseFunctionParameter,
  "<function-token>": postParseFunctionToken,
  "<general-enclosed>": postParseGeneralEnclosed,
  "<grid-line>": postParseGridLine,
  "<hex-color>": postParseHexColor,
  "<id-selector>": postParseIDSelector,
  "<integer>": postParseInteger,
  "<keyframes-name>": postParseKeyframesName,
  "<keyword>": postParseKeyword,
  "<layer-name>": postParseLayerName,
  "<length>": postParseDimension,
  "<level>": postParseInteger,
  "<line-name-list>": postParseLineNameList,
  "<line-names>": postParseLineNames,
  "<linear()>": postParseLinear,
  "<log()>": postParseLog,
  "<media-condition>": postParseMediaCondition,
  "<media-condition-without-or>": postParseMediaCondition,
  "<media-query>": postParseMediaQuery,
  "<media-query-list>": postParseMediaQueryList,
  "<media-type>": postParseMediaType,
  "<n-dimension>": postParseNDimension,
  "<ndash-dimension>": postParseNDashDimension,
  "<ndashdigit-dimension>": postParseNDashDigitDimension,
  "<ndashdigit-ident>": postParseNDashDigitIdentifier,
  "<ns-prefix>": postParseNSPrefix,
  "<number>": postParseNumeric,
  "<opentype-tag>": postParseOpenTypeTag,
  "<path()>": postParsePath,
  "<percentage>": postParseNumeric,
  "<pseudo-class-selector>": postParsePseudoClassSelector,
  "<pseudo-element-selector>": postParsePseudoElementSelector,
  "<radial-gradient-syntax>": postParseRadialGradient,
  "<radial-size>": postParseRadialSize,
  "<random()>": postParseRandom,
  "<random-cache-key>": postParseRandomCacheKey,
  "<random-key>": postParseRandomKey,
  "<resolution>": postParseDimension,
  "<round()>": postParseRound,
  "<signed-integer>": postParseSignedInteger,
  "<signless-integer>": postParseSignlessInteger,
  "<steps()>": postParseSteps,
  "<src()>": postParseURL,
  "<style-feature-name>": postParseStyleFeatureName,
  "<style-feature-plain>": postParseStyleFeaturePlain,
  "<supports-at-rule-fn>": postParseSupportsAtRule,
  "<supports-env-fn>": postParseSupportsEnvironmentVariable,
  "<supports-font-format-fn>": postParseSupportsFontFormat,
  "<supports-named-feature-fn>": postParseSupportsNamedFeature,
  "<symbols()>": postParseSymbols,
  "<registered-ident>": postParseRegisteredIdentifier,
  "<supports-decl>": postParseSupportsDeclaration,
  "<syntax-single-component>": postParseSyntaxSingleComponent,
  "<syntax-string>": postParseSyntaxString,
  "<syntax-type-name>": postParseSyntaxTypeName,
  "<syntax>": postParseSyntax,
  "<time>": postParseDimension,
  "<track-list>": postParseTrackList,
  "<try-tactic>": postParseListToDeclaredOrder,
  "<urange>": postParseUnicodeRange,
  "<url()>": postParseURL,
  "<view-transition-type>": postParseViewTransitionType,
  "<zero>": postParseZero,
  "@font-palette-values": postParseFontPaletteValues,
  "@property": postParseProperty,
  "additive-symbols": postParseAdditiveSymbols,
  "border-radius": postParseBorderRadiusProperty,
  "color-scheme": postParseColorScheme,
  "container-name": postParseContainerNameProperty,
  "glyph-orientation-vertical": postParseGlyphOrientationVertical,
  "grid-template": postParseGridTemplate,
  "grid-template-areas": postParseGridTemplateAreas,
  "paint-order": postParsePaintOrder,
  "range": postParseRange,
  "text-align": postParseTextAlign,
  "text-align-all": postParseTextAlign,
  "view-transition-class": postParseViewTransitionClass,
  "view-transition-name": postParseViewTransitionName
};
