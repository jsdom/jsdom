"use strict";

const colorValues = require("../values/color.js");
const cssParser = require("./parser.js");
const numericTypes = require("./types.js");
const nodeUtils = require("./tree.js");
const cssValues = require("../values/value.js");
const simplify = require("../simplify.js");
// https://drafts.csswg.org/css-values-4/#calc-variables
function replaceCalcKeyword(node) {
  return replaceWithCalcSizeKeyword(node) ?? replaceWithColorComponentKeyword(node);
}

// https://drafts.csswg.org/selectors-4/#typedef-forgiving-selector-list
function replaceForgivingSelector(node) {
  const { context, input } = node;
  if (
    !context.strict &&
    nodeUtils.findContext(node, (entryNode) => entryNode.definition.type === "forgiving")
  ) {
    return cssParser.consumeUnparsedSelector(input, node);
  }
  return null;
}

function getReplacedNumericType({ definition: { name } }) {
  switch (name) {
    case "<dimension>":
      return numericTypes.dimensionTypes;
    case "<integer>":
      return "<number>";
    default:
      return name;
  }
}

function getPercentageResolutionType({ definition: { name }, parent }) {
  if (name === "<dimension>" || name === "<percentage>") {
    return null;
  }
  if (
    parent?.definition.type === "|" &&
    parent.definition.value.some((definition) => definition.name === "<percentage>")
  ) {
    return name;
  }
  return null;
}

// https://drafts.csswg.org/css-values-4/#math-function
// https://drafts.csswg.org/css-values-5/#tree-counting
function replaceNumeric(node) {
  const {
    definition: { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER, name },
    input,
    parent,
  } = node;
  const topLevel = !nodeUtils.isProducedBy(node, "<calc-value>");
  const token = input.next();
  if (token.types[0] !== "<function-token>") {
    if (name === "<number>" && topLevel) {
      return replaceWithColorComponentKeyword(node);
    }
    return null;
  }

  // An+B requires an integer token, not a math function.
  if (name === "<integer>" && nodeUtils.isProducedBy(node, "<a-n-plus-b>")) {
    return null;
  }

  // <dimension> produced by a specific dimension type
  if (name === "<dimension>" && parent?.definition.type === "non-terminal") {
    return null;
  }
  const match = cssParser.parseNumericFunction(input, node, name);
  if (match === undefined) {
    return null;
  }
  if (cssValues.isParseErrorInfo(match)) {
    return match;
  }

  // Validate the type and simplify calculations once from top to bottom
  if (topLevel) {
    return simplify.completeNumericFunction(
      match,
      getReplacedNumericType(node),
      getPercentageResolutionType(node),
      min,
      max,
      name === "<integer>",
    );
  }
  return match;
}

// https://drafts.csswg.org/css-conditional-5/#typedef-style-range-value
function replaceWithArbitrarySubstitution(node) {
  return cssParser.parseArbitrarySubstitution(node.input, node);
}

// https://drafts.csswg.org/css-values-5/#calc-size-calculation
function replaceWithCalcSizeKeyword(node) {
  const { context, input } = node;
  const basis = context.trees.findLast(
    (entryNode) => entryNode.context.definition.name === "calc-size",
  )?.children[0];
  if (basis && basis.value.value !== "any") {
    const match = cssParser.parseGrammar(input, "size", node, "lazy");
    if (!cssValues.isFailure(match)) {
      return {
        ...match,
        types: [...match.types, "<calc-keyword>"],
      };
    }
  }
  return null;
}

function isColorComponent(node) {
  return nodeUtils.findFunction(
    node,
    (entryNode) =>
      nodeUtils.findParent(entryNode, (entryNode2) => entryNode2.definition.name === "<color>"),
    Boolean,
  );
}

function resolveColorComponentDefinition(node) {
  // The complete argument recognizer owns relative component visibility.
  // Stop at another color function so its origin and absolute arguments cannot
  // inherit the enclosing relative color's channel keywords.
  const argumentsContext = nodeUtils.findContext(
    node,
    (entry) =>
      entry.definition.name === "<rgb-arguments>" || entry.definition.name === "<hsl-arguments>",
    (entry) =>
      entry.definition.type === "function" &&
      Object.hasOwn(colorValues.colorFunctions, entry.definition.name),
  );
  if (argumentsContext) {
    return argumentsContext.state.extended.get("color-components");
  }
  // Find the deepest replaced node representing a color component
  if (!isColorComponent(node)) {
    node = nodeUtils.findContext(
      node,
      (entryNode) => entryNode.state?.status === "replacing" && isColorComponent(entryNode),
    );
  }
  // There must be a source color for color component keywords to be valid
  if (node && nodeUtils.findSibling(node, (entryNode) => entryNode.definition.name === "<color>")) {
    const {
      definition: { name },
    } = nodeUtils.getFunction(node);
    if (name === "color") {
      const colorSpace = nodeUtils.findSibling(node, (entryNode) => {
        return colorValues.colorSpaces.includes(entryNode.definition.name);
      });
      return colorValues.colorSpaceKeywords[colorSpace.definition.name];
    }
    return colorValues.colorFunctions[name].keywords;
  }
  return undefined;
}

// https://drafts.csswg.org/css-color-5/#relative-color
function replaceWithColorComponentKeyword(node) {
  const definition = resolveColorComponentDefinition(node);
  if (definition) {
    const {
      definition: { name },
      input,
    } = node;
    const match = cssParser.parseGrammar(input, definition, node, "lazy");
    if (!cssValues.isFailure(match) && name === "<calc-keyword>") {
      return {
        ...match,
        types: [...match.types, name],
      };
    }
    return match;
  }
  return null;
}

// https://drafts.csswg.org/css-nesting-1/#selectordef-
function replaceWithNestingSelector(node) {
  return node.input.consumeIf(cssValues.isDelimiter("&"));
}
module.exports = {
  "<angle>": replaceNumeric,
  "<calc-keyword>": replaceCalcKeyword,
  "<complex-real-selector>": replaceForgivingSelector,
  "<dimension>": replaceNumeric,
  "<flex>": replaceNumeric,
  "<frequency>": replaceNumeric,
  "<integer>": replaceNumeric,
  "<length>": replaceNumeric,
  "<number>": replaceNumeric,
  "<percentage>": replaceNumeric,
  "<resolution>": replaceNumeric,
  "<style-range-value>": replaceWithArbitrarySubstitution,
  "<subclass-selector>": replaceWithNestingSelector,
  "<time>": replaceNumeric,
  "<type-selector>": replaceWithNestingSelector,
};
