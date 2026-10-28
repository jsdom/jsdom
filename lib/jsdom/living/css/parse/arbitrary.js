"use strict";

const blockModule = require("../values/block.js");
const cssValues = require("../values/value.js");
const nodeUtils = require("./tree.js");
const cssParser = require("./parser.js");
const { ParseErrorInfo } = require("./errors.js");
const contextUtils = require("./declarations.js");
const { copySource, toLowerCase } = require("../utils/string.js");
const CSSStream = require("./stream.js");
const featureModule = require("../values/feature.js");
const descriptorDefinitions = require("../../../../generated/css-descriptor-definitions.js");
const compatibility = require("../compatibility.js");
const dimensionValues = require("../values/dimension.js");
const simplify = require("../simplify.js");
const colorValues = require("../values/color.js");
const matchSelector = require("./selectors.js");
function error({ definition: { name, value } }) {
  return new ParseErrorInfo(`Invalid ${name ?? value}`);
}

// https://drafts.csswg.org/css-syntax-3/#typedef-any-value
function matchAnyValue(node, stops, closingToken) {
  const { input } = node;
  const tokens = cssValues.list([], "");
  input.consumeIf(cssValues.isWhitespace);
  while (
    closingToken
      ? !input.atEnd() && !input.peek(cssValues.isDelimiter(closingToken))
      : !nodeUtils.isInputAtEnd(node) && !input.peek(cssValues.isDelimiter(stops))
  ) {
    const token = input.consume();
    const type = token.types[0];
    if (
      cssValues.isDelimiter(blockModule.closingTokens, token) ||
      type === "<bad-string-token>" ||
      type === "<bad-url-token>"
    ) {
      return error(node);
    }
    if (cssValues.isDelimiter(blockModule.openingTokens, token) || type === "<function-token>") {
      const associatedToken =
        type === "<delimiter-token>" ? blockModule.associatedTokens[token.value] : ")";
      const value = matchAnyValue(node, stops, associatedToken);
      if (!value) {
        break;
      }
      if (cssValues.isParseErrorInfo(value)) {
        return value;
      }
      tokens.push(
        token,
        ...value,
        input.consumeIf(cssValues.isDelimiter(associatedToken)) ??
          cssValues.delimiter(associatedToken),
      );
      continue;
    }
    tokens.push(token);
  }
  if (cssValues.isWhitespace(tokens.at(-1))) {
    tokens.pop();
  }

  // Allow empty value only if nested
  if (!closingToken && tokens.length === 0) {
    return null;
  }
  return tokens;
}

// https://drafts.csswg.org/css-values-5/#non-strict-free-form-production
// https://github.com/w3c/csswg-drafts/issues/11042
function isRestrictedFreeFormValue(node) {
  const fn = nodeUtils.getFunction(node);
  if (!fn) {
    return false;
  }
  switch (fn.definition.name) {
    case null:
    case "supports":
      return false;
    case undefined:
      return nodeUtils.isProducedBy(node, "<default-value>");
    case "var":
      return (
        node.parent.definition.type !== "optional" || node.input.peek(cssValues.isOpenCurlyBrace)
      );
    default:
      return true;
  }
}

function matchDeclaration(node) {
  const { input } = node;
  const token = input.next();
  if (token.types[0] === "<ident-token>") {
    const definition = contextUtils.getDeclarationDefinition(node, token.value);
    if (definition) {
      const declaration = cssParser.parseGrammar(input, definition, node);
      if (!cssValues.isFailure(declaration)) {
        declaration.representation = copySource(
          input.sliceSource(token.start, input.current.end)?.replace(/[\t\n\f\r ]+$/g, ""),
        );
      }
      return declaration;
    }
  }
  return null;
}

// https://drafts.csswg.org/css-syntax-3/#typedef-declaration-value
function matchDeclarationValue(node, stops = []) {
  return matchAnyValue(node, [...stops, ";", "!"]);
}

// https://drafts.csswg.org/css-values-5/#free-form-productions
function matchFreeFormValue(node, match) {
  // Do not restrict functions defined with a general notation except custom function definitions
  if (isRestrictedFreeFormValue(node)) {
    const { input, parent } = node;
    if (input.consumeIf(cssValues.isOpenCurlyBrace)) {
      const value = match(node, ["}"]);
      if (cssValues.isParseErrorInfo(value)) {
        return value;
      }
      if (!input.consumeIf(cssValues.isCloseCurlyBrace) && !input.atEnd()) {
        return error(node);
      }
      if (value) {
        return value;
      }
      if (parent?.definition.type === "optional") {
        return cssValues.omitted;
      }
      return error(node);
    }
    if (nodeUtils.isProducedBy(node, "<if-args-branch>") && parent.definition.type !== "optional") {
      return match(node, [",", "{", ":"]);
    }
    return match(node, [",", "{"]);
  }
  return match(node);
}
function getMediaFeatures(node) {
  const rule = nodeUtils.getRuleName(node);
  if (rule === "@container") {
    const groups = featureModule.definitions[rule];
    const parent = nodeUtils.findParent(node, (candidate) =>
      Object.hasOwn(groups, candidate.definition.name),
    );
    return groups[parent.definition.name];
  }
  if (rule === "@import" || rule === "@media" || rule === "@sheet") {
    return featureModule.definitions["@media"];
  }
  return descriptorDefinitions[`@${nodeUtils.getFunctionName(node)}`] ?? {};
}

function getMediaFeaturePolicy(token, form, features) {
  if (token?.types[0] !== "<ident-token>") {
    return null;
  }
  const lowercase = toLowerCase(token.value);
  const target =
    features === featureModule.definitions["@media"]
      ? compatibility.descriptors["@media"].aliases.get(lowercase)
      : undefined;
  const normalized = target ?? lowercase;
  const unprefixed = normalized.replace(/^(min|max)-/, "");
  if (!Object.hasOwn(features, unprefixed)) {
    return null;
  }
  const feature = features[unprefixed];
  if (
    (normalized !== unprefixed && (form !== "plain" || feature.type !== "range")) ||
    (form === "range" && feature.type !== "range")
  ) {
    return null;
  }
  return {
    name: lowercase,
    grammar: target ? "<number>" : feature.value,
  };
}

function trimMediaOperand({ input }, from, to) {
  while (from < to && cssValues.isWhitespace(input.data[from])) {
    ++from;
  }
  while (from < to && cssValues.isWhitespace(input.data[to - 1])) {
    --to;
  }
  return [from, to];
}

function matchMediaOperand(node, [from, to], grammar) {
  if (from === to) {
    return null;
  }
  const input = new CSSStream(node.input.data.slice(from, to));
  const substitution = cssParser.parseArbitrarySubstitution(input, node);
  if (substitution !== null) {
    while (input.consumeIf(cssValues.isWhitespace)) {
      // Substitutions can join independently authored whitespace tokens.
    }
    if (input.unclosed) {
      node.input.unclosed = true;
    }
    return input.atEnd() ? substitution : null;
  }
  const value = cssParser.parseGrammar(input, grammar, node);
  if (input.unclosed) {
    node.input.unclosed = true;
  }
  if (cssValues.isFailure(value)) {
    return value;
  }
  value.types.push("<mf-value>");
  return value;
}

// A media feature fills its enclosing block or function. Recognize its complete
// shape before parsing each final operand against the selected feature grammar.
function matchMediaFeature(node) {
  const { input } = node;
  const start = input.index + 1;
  const closing = [];
  const operators = [];
  let colon = -1;
  let invalid = false;
  while (!input.atEnd() && (closing.length > 0 || !nodeUtils.isInputAtEnd(node))) {
    const token = input.consume();
    const type = token.types[0];
    if (type === "<function-token>") {
      closing.push(")");
      continue;
    }
    if (type !== "<delimiter-token>") {
      if (type === "<bad-string-token>" || type === "<bad-url-token>") {
        return error(node);
      }
      continue;
    }
    const associated = blockModule.associatedTokens[token.value];
    if (associated) {
      closing.push(associated);
      continue;
    }
    if (blockModule.closingTokens.includes(token.value)) {
      if (closing.pop() !== token.value) {
        return error(node);
      }
      continue;
    }
    if (closing.length > 0) {
      continue;
    }
    if (token.value === ":") {
      invalid ||= colon !== -1;
      colon = input.index;
    } else if (token.value === "<" || token.value === ">" || token.value === "=") {
      const from = input.index;
      if (token.value !== "=") {
        input.consumeIf(cssValues.isDelimiter("="));
      }
      operators.push({ from, to: input.index + 1, sign: token.value });
    }
  }
  const end = input.index + 1;
  const features = getMediaFeatures(node);
  const whole = trimMediaOperand(node, start, end);
  function nameAt(span) {
    return span[1] - span[0] === 1 ? input.data[span[0]] : undefined;
  }
  function operand(span, policy) {
    const value = matchMediaOperand(node, span, policy.grammar);
    // Comparison syntax accepts numeric values: https://github.com/w3c/csswg-drafts/issues/8998.
    if (operators.length > 0 && !cssValues.isFailure(value) && value.types[0] === "<ident-token>") {
      return null;
    }
    return value;
  }
  function comparison(operator) {
    return operator.sign + (operator.to - operator.from === 2 ? "=" : "");
  }
  if (invalid || (colon !== -1 && operators.length > 0) || operators.length > 2) {
    return error(node);
  }
  if (colon !== -1) {
    const name = trimMediaOperand(node, start, colon);
    const policy = getMediaFeaturePolicy(nameAt(name), "plain", features);
    if (!policy) {
      return error(node);
    }
    const value = operand(trimMediaOperand(node, colon + 1, end), policy);
    return cssValues.isFailure(value)
      ? error(node)
      : { kind: "media-feature", name: policy.name, value };
  }
  if (operators.length === 0) {
    const policy = getMediaFeaturePolicy(nameAt(whole), "boolean", features);
    if (!policy) {
      return error(node);
    }
    return { kind: "media-feature", name: policy.name };
  }
  const [first, second] = operators;
  const left = trimMediaOperand(node, start, first.from);
  if (second === undefined) {
    const right = trimMediaOperand(node, first.to, end);
    const leftPolicy = getMediaFeaturePolicy(nameAt(left), "range", features);
    const rightPolicy = getMediaFeaturePolicy(nameAt(right), "range", features);
    const policy = leftPolicy ?? rightPolicy;
    if (!policy) {
      return error(node);
    }
    const value = operand(leftPolicy ? right : left, policy);
    if (cssValues.isFailure(value)) {
      return error(node);
    }
    const operator = comparison(first);
    return leftPolicy
      ? { kind: "media-feature", name: policy.name, rightOperator: operator, right: value }
      : { kind: "media-feature", name: policy.name, left: value, leftOperator: operator };
  }
  if (first.sign === "=" || second.sign !== first.sign) {
    return error(node);
  }
  const middle = trimMediaOperand(node, first.to, second.from);
  const policy = getMediaFeaturePolicy(nameAt(middle), "range", features);
  if (!policy) {
    return error(node);
  }
  const leftValue = operand(left, policy);
  if (cssValues.isFailure(leftValue)) {
    return error(node);
  }
  const rightValue = operand(trimMediaOperand(node, second.to, end), policy);
  if (cssValues.isFailure(rightValue)) {
    return error(node);
  }
  return {
    kind: "media-feature",
    name: policy.name,
    left: leftValue,
    leftOperator: comparison(first),
    rightOperator: comparison(second),
    right: rightValue,
  };
}

// Read a length without constructing its alias and token grammar nodes.
// `undefined` means a different component can start here; `null` means the
// recognized length is invalid, including a consumed function of the wrong type.
function readShadowLength(node, min, max) {
  if (nodeUtils.isInputAtEnd(node)) {
    return undefined;
  }
  const { input } = node;
  const token = input.next();
  let value;
  switch (token.types[0]) {
    case "<number-token>":
      if (token.value !== 0) {
        return null;
      }
      input.consume();
      value = cssValues.length(0, "px");
      break;
    case "<dimension-token>":
      if (!dimensionValues.validate(token, "<length>", min, max)) {
        return null;
      }
      input.consume();
      value = { ...token, types: [...token.types, "<dimension>", "<length>"] };
      break;
    case "<function-token>": {
      const match = cssParser.parseNumericFunction(input, node, "<length>");
      if (match === undefined || cssValues.isParseErrorInfo(match)) {
        return match;
      }
      value = simplify.completeNumericFunction(match, "<length>", null, min, max);
      if (value === null) {
        return null;
      }
      break;
    }
    default:
      return cssParser.getInvalidTokenError(token) ?? undefined;
  }
  cssParser.consumeWhitespace(input);
  return value;
}

function matchSpreadShadow(node) {
  const { input } = node;
  let color = cssValues.omitted;
  let geometry = cssValues.omitted;
  let position = cssValues.omitted;
  while (!nodeUtils.isInputAtEnd(node) && !cssValues.isComma(input.next())) {
    const token = input.next();
    const keyword = token.types[0] === "<ident-token>" ? toLowerCase(token.value) : undefined;
    if (keyword === "inset" || keyword === "outset") {
      if (position !== cssValues.omitted) {
        return null;
      }
      input.consume();
      position = { ...token, types: [...token.types, "<ident>", "<keyword>"], value: keyword };
      cssParser.consumeWhitespace(input);
      continue;
    }
    if (geometry === cssValues.omitted) {
      let offset;
      if (keyword === "none") {
        input.consume();
        offset = { ...token, types: [...token.types, "<ident>", "<keyword>"], value: keyword };
        cssParser.consumeWhitespace(input);
      } else {
        const first = readShadowLength(node);
        if (first === null || cssValues.isParseErrorInfo(first)) {
          return first;
        }
        if (first !== undefined) {
          const second = readShadowLength(node);
          if (second === undefined || second === null) {
            return null;
          }
          if (cssValues.isParseErrorInfo(second)) {
            return second;
          }
          offset = cssValues.list([first, second]);
        }
      }
      if (offset !== undefined) {
        // The length group is contiguous. A consumed invalid optional component
        // rejects the item instead of being mistaken for an omitted component.
        let options = cssValues.omitted;
        const blur = readShadowLength(node, 0, Infinity);
        if (blur === null || cssValues.isParseErrorInfo(blur)) {
          return blur;
        }
        if (blur !== undefined) {
          const spread = readShadowLength(node);
          if (spread === null || cssValues.isParseErrorInfo(spread)) {
            return spread;
          }
          options = cssValues.list([blur, spread ?? cssValues.omitted]);
        }
        geometry = cssValues.list([offset, options]);
        continue;
      }
    }
    if (color !== cssValues.omitted) {
      return null;
    }
    color = cssParser.parseGrammar(input, "<color>", node, "lazy");
    if (cssValues.isFailure(color)) {
      return color;
    }
    cssParser.consumeWhitespace(input);
  }
  return geometry === cssValues.omitted ? null : cssValues.list([color, geometry, position]);
}

// Consume one color component without selecting its numeric completion policy.
// Math functions use the same parser and host context as generic numeric leaves.
function readColorComponent(node, expectedName) {
  if (nodeUtils.isInputAtEnd(node)) {
    return null;
  }
  const { input } = node;
  const token = input.next();
  let value;
  switch (token.types[0]) {
    case "<number-token>":
    case "<percentage-token>":
    case "<dimension-token>":
      value = input.consume();
      break;
    case "<ident-token>": {
      const keyword = toLowerCase(token.value);
      if (
        keyword !== "none" &&
        !node.state.extended.get("color-components")?.split(" | ").includes(keyword)
      ) {
        return null;
      }
      input.consume();
      value = { ...token, types: [...token.types, "<ident>", "<keyword>"], value: keyword };
      break;
    }
    case "<function-token>":
      value = cssParser.parseNumericFunction(input, node, expectedName);
      if (value === undefined || cssValues.isFailure(value)) {
        return value ?? null;
      }
      break;
    default:
      return cssParser.getInvalidTokenError(token) ?? null;
  }
  cssParser.consumeWhitespace(input);
  return value;
}

function completeColorNumeric(value, name, resolution = null) {
  const type = value.types[0];
  if (type === "<function>") {
    return simplify.completeNumericFunction(value, name, resolution);
  }
  if (name === "<number>" && type === "<ident-token>" && value.value !== "none") {
    return value;
  }
  if (
    (name === "<number>" && type === "<number-token>") ||
    (name === "<percentage>" && type === "<percentage-token>")
  ) {
    return -Infinity <= value.value && value.value <= Infinity
      ? { ...value, types: [...value.types, name] }
      : null;
  }
  if (name === "<angle>" && type === "<dimension-token>" && dimensionValues.validate(value, name)) {
    return { ...value, types: [...value.types, "<dimension>", name] };
  }
  return null;
}

function completeColorComponent(value, policy) {
  if (cssValues.isFailure(value)) {
    return value;
  }
  if (
    policy === "modern-rgb" ||
    policy === "modern-hsl" ||
    policy === "alpha" ||
    policy === "hue"
  ) {
    if (value.types[0] === "<ident-token>" && value.value === "none") {
      return value;
    }
  }
  switch (policy) {
    case "modern-rgb":
    case "alpha":
      return (
        completeColorNumeric(value, "<number>", "<number>") ??
        completeColorNumeric(value, "<percentage>")
      );
    case "modern-hsl":
      return (
        completeColorNumeric(value, "<percentage>") ??
        completeColorNumeric(value, "<number>", "<number>")
      );
    case "hue": {
      const hue = completeColorNumeric(value, "<number>") ?? completeColorNumeric(value, "<angle>");
      return hue && { ...hue, types: [...hue.types, "<hue>"] };
    }
    default:
      return completeColorNumeric(value, policy);
  }
}

// Parse a complete RGB or HSL argument list. The existing enclosing function
// keeps the complete grammar transaction, EOF recovery, and function metadata.
function matchColorArguments(node) {
  const { input } = node;
  const rgb = node.definition.name === "<rgb-arguments>";
  let origin = cssValues.omitted;
  const head = input.next();
  if (head?.types[0] === "<ident-token>" && toLowerCase(head.value) === "from") {
    input.consume();
    const from = { ...head, types: [...head.types, "<ident>", "<keyword>"], value: "from" };
    cssParser.consumeWhitespace(input);
    const color = cssParser.parseGrammar(input, "<color>", node, "lazy");
    if (cssValues.isFailure(color)) {
      return color;
    }
    cssParser.consumeWhitespace(input);
    origin = cssValues.list([from, color]);
    node.state.extended.set(
      "color-components",
      colorValues.colorFunctions[rgb ? "rgb" : "hsl"].keywords,
    );
  }

  let first = readColorComponent(
    node,
    rgb && origin === cssValues.omitted ? "<percentage>" : "<number>",
  );
  if (cssValues.isFailure(first)) {
    return first;
  }
  const legacy = cssValues.isComma(input.next());
  if (legacy && origin !== cssValues.omitted) {
    return null;
  }
  let policy;
  if (rgb) {
    if (legacy) {
      const percentage = completeColorNumeric(first, "<percentage>");
      policy = percentage ? "<percentage>" : "<number>";
      first = percentage ?? completeColorNumeric(first, policy);
    } else {
      policy = "modern-rgb";
      first = completeColorComponent(first, policy);
    }
  } else {
    policy = legacy ? "<percentage>" : "modern-hsl";
    first = completeColorComponent(first, "hue");
    if (legacy && first?.types[0] === "<ident-token>" && first.value === "none") {
      return null;
    }
  }
  if (cssValues.isFailure(first)) {
    return first;
  }
  const channels = [first];
  const commas = [];
  for (let index = 1; index < 3; ++index) {
    if (legacy) {
      const comma = input.consumeIf(cssValues.isComma);
      if (!comma) {
        return null;
      }
      commas.push(comma);
      cssParser.consumeWhitespace(input);
    }
    const expected = policy === "modern-rgb" || policy === "<number>" ? "<number>" : "<percentage>";
    const value = completeColorComponent(readColorComponent(node, expected), policy);
    if (cssValues.isFailure(value)) {
      return value;
    }
    channels.push(value);
  }
  let alpha = cssValues.omitted;
  let alphaSeparator = cssValues.omitted;
  const next = input.next();
  if (legacy ? cssValues.isComma(next) : next && cssValues.isDelimiter("/", next)) {
    alphaSeparator = input.consume();
    cssParser.consumeWhitespace(input);
    alpha = completeColorComponent(readColorComponent(node, "<number>"), "alpha");
    if (cssValues.isFailure(alpha)) {
      return alpha;
    }
    if (alpha.types[0] === "<ident-token>" && alpha.value === "none") {
      if (legacy) {
        return null;
      }
    } else {
      alpha = { ...alpha, types: [...alpha.types, "<alpha-value>"] };
    }
  }
  if (legacy) {
    return rgb
      ? cssValues.list([cssValues.list(channels, ","), alphaSeparator, alpha], " ", [
          "<legacy-rgb-arguments>",
        ])
      : cssValues.list(
          [first, commas[0], channels[1], commas[1], channels[2], alphaSeparator, alpha],
          " ",
          ["<legacy-hsl-arguments>"],
        );
  }
  const alphaGroup = alpha === cssValues.omitted ? alpha : cssValues.list([alphaSeparator, alpha]);
  return rgb
    ? cssValues.list([origin, cssValues.list(channels), alphaGroup], " ", [
        "<modern-rgb-arguments>",
      ])
    : cssValues.list([origin, ...channels, alphaGroup], " ", ["<modern-hsl-arguments>"]);
}

module.exports = {
  "<rgb-arguments>": matchColorArguments,
  "<hsl-arguments>": matchColorArguments,
  "<spread-shadow>": matchSpreadShadow,
  "<complex-selector>": matchSelector,
  "<complex-real-selector>": matchSelector,
  "<compound-selector>": matchSelector,
  "<relative-selector>": matchSelector,
  "<relative-real-selector>": matchSelector,
  "<selector-list>": matchSelector,
  "<complex-selector-list>": matchSelector,
  "<complex-real-selector-list>": matchSelector,
  "<compound-selector-list>": matchSelector,
  "<relative-selector-list>": matchSelector,
  "<relative-real-selector-list>": matchSelector,
  "<page-selector-list>": cssParser.matchPageSelectorList,
  "<media-feature>": matchMediaFeature,
  "<media-in-parens>": cssParser.matchMediaInParens,
  "<any-value>": (node) => matchFreeFormValue(node, matchAnyValue),
  "<at-rule-list>": cssParser.matchBlockContents,
  "<block-contents>": cssParser.matchBlockContents,
  "<declaration-list>": cssParser.matchBlockContents,
  "<declaration-rule-list>": cssParser.matchBlockContents,
  "<declaration-value>": (node) => matchFreeFormValue(node, matchDeclarationValue),
  "<declaration>": matchDeclaration,
  "<qualified-rule-list>": cssParser.matchBlockContents,
  "<rule-list>": (node) => {
    return nodeUtils.getRuleName(node) === "@sheet"
      ? cssParser.matchStyleSheet(node)
      : cssParser.matchBlockContents(node);
  },
};
