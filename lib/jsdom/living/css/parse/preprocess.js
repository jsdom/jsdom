"use strict";

const selectorContext = require("./selector-context.js");
const nodeUtils = require("./tree.js");
const cssValues = require("../values/value.js");
const { ParseErrorInfo } = require("./errors.js");
const { groupsByProperty } = require("../properties/groups.js");
const stringUtils = require("../utils/string.js");
// https://drafts.csswg.org/css-values-4/#calc-syntax
const MAX_CALCULATION_NESTING = 32;

function error({ definition: { name, value } }) {
  return new ParseErrorInfo(`Invalid ${name ?? value}`);
}

// A property can reuse another property's grammar without inheriting the
// contexts in which anchor functions are allowed (for example, `flex-basis`).
// https://drafts.csswg.org/css-anchor-position-1/#sizing
function preParseAnchorFunction(node) {
  const property = nodeUtils.getDeclarationName(node);
  if (property !== undefined) {
    const allowed =
      node.definition.name === "<anchor()>" ? ["inset"] : ["inset", "sizing", "margin"];
    if (!groupsByProperty[property]?.some((group) => allowed.includes(group))) {
      return null;
    }
  }
  return undefined;
}

// https://drafts.csswg.org/css-values-4/#calc-syntax
//
// It aborts parsing when the next token is a sum operator that is not preceded
// by a whitespace.
function preParseCalcOperator(node) {
  const { input } = node;
  if (!cssValues.isWhitespace(input.current) && nodeUtils.isProducedBy(node, "<calc-sum>")) {
    if (input.peek(cssValues.isDelimiter(["-", "+"]))) {
      return error(node);
    }
    return null;
  }
  return undefined;
}

// https://drafts.csswg.org/css-values-4/#calc-syntax
//
// It bounds calculation nesting independently of grammar retries and term counts.
function preParseCalcValue(node) {
  let depth = 0;
  for (let { context } = node; context; context = context.context) {
    const { type } = context.definition;
    if (type === "function" && !nodeUtils.isProducedBy(context.context, "<calc-value>")) {
      break;
    }
    if ((type === "function" || type === "block") && ++depth > MAX_CALCULATION_NESTING) {
      return error(node);
    }
  }
  return undefined;
}

// https://drafts.csswg.org/selectors-4/#pseudo-element-structure
// https://drafts.csswg.org/selectors-5/#typedef-combinator
//
// It aborts parsing a combinator when complex selectors are invalid in the
// context.
//
// It aborts parsing when the input is at the back of a pseudo-element with no
// internal structure, or in a functional pseudo compounded to it, but is not at
// its end. It simply aborts parsing the combinator if the input is at its end.
//
// It aborts parsing when the grammar wants a relative selector but the context
// only allows a compound selector.
function preParseCombinator(node) {
  if (nodeUtils.isInputAtEnd(node)) {
    return null;
  }
  if (!selectorContext.combinatorAllowed(selectorContext.getContext(node))) {
    return cssValues.isComma(node.input.next()) ? null : error(node);
  }
  return undefined;
}

function hasArbitrarySibling(
  {
    definition,
    parent: {
      definition: { type, value },
    },
  },
  direction,
) {
  let token = type === "repetition" ? value : value[value.indexOf(definition) + direction];
  if (token?.type === "repetition") {
    token = token.value;
  }
  if (token?.type === "optional") {
    const {
      value: { name },
    } = token;
    return name === "<any-value>" || name === "<declaration-value>";
  }
  return false;
}

// https://drafts.csswg.org/css-values-4/#comb-comma
// https://drafts.csswg.org/css-variables-2/#funcdef-var
// https://github.com/w3c/csswg-drafts/issues/8387
//
// It aborts parsing when the next token is a leading, adjacent, or trailing
// comma (with some exceptions).
//
// It accepts an omitted value as replacing a comma except between a repetition
// of values.
function preParseComma(node) {
  const { input, parent } = node;
  let { current } = input;
  if (cssValues.isWhitespace(current)) {
    current = input.prev();
  }
  if (nodeUtils.isInputAtStart(node) || cssValues.isComma(current)) {
    const comma = input.consumeIf(cssValues.isComma);
    if (comma) {
      return hasArbitrarySibling(node, -1) ? comma : error(node);
    }
    return parent.definition.type === "repetition" ? null : cssValues.omitted;
  }
  const comma = input.consumeIf(cssValues.isComma);
  if (comma) {
    if (nodeUtils.isInputAtEnd(node) && !hasArbitrarySibling(node, 1)) {
      return error(node);
    }
    return comma;
  }
  if (nodeUtils.isInputAtEnd(node) && parent.definition.type !== "repetition") {
    const siblings = parent.definition.value;
    const next = siblings[siblings.indexOf(node.definition) + 1];
    // A repeated optional value still represents an item when it is empty.
    // Its preceding separator cannot disappear with the empty item.
    if (next?.type === "repetition" && hasArbitrarySibling(node, 1)) {
      return null;
    }
    return cssValues.omitted;
  }
  return null;
}

// https://drafts.csswg.org/css-images-4/#funcdef-image-set
//
// It aborts parsing when the next token is a nested image set.
function preParseImageSet(node) {
  const token = node.input.next();
  if (
    token?.types[0] === "<function-token>" &&
    stringUtils.toLowerCase(token.value) === "image-set" &&
    nodeUtils.findFunction(node, (entryNode) => entryNode.definition.name === "image-set")
  ) {
    return error(node);
  }
  return undefined;
}

// https://drafts.csswg.org/css-ui-4/#typedef-cursor-url-set
//
// It aborts parsing when the next token is not an url or a string whereas an
// url set option is expected.
function preParseImageSetOption(node) {
  const token = node.input.next();
  if (token) {
    const name =
      token.types[0] === "<function-token>" ? stringUtils.toLowerCase(token.value) : token.name;
    if (
      nodeUtils.isProducedBy(nodeUtils.getFunction(node).parent, "<url-set>") &&
      name !== "src" &&
      name !== "url" &&
      token.types[0] !== "<string-token>"
    ) {
      return error(node);
    }
  }
  return undefined;
}

// https://drafts.csswg.org/css-values-4/#length-value
//
// It aborts parsing a length when the next token is 0 and the context allows a
// number or an integer.
//
// It accepts 0 as replacing 0px.
function preParseLength(node) {
  const { input, definition, parent } = node;
  const token = input.next();
  if (token?.types[0] === "<number-token>" && token.value === 0) {
    if (parent) {
      const {
        definition: { type, value },
      } = parent;
      if (
        (type === "|" || type === "||") &&
        value.some(({ name }) => name === "<integer>" || name === "<number>")
      ) {
        return null;
      }
    }
    input.consume();
    if (definition.name === "<length-percentage>") {
      return cssValues.length(0, "px", ["<length-percentage>"]);
    }
    return cssValues.length(0, "px");
  }
  return undefined;
}

module.exports = {
  "+": preParseCalcOperator,
  ",": preParseComma,
  "-": preParseCalcOperator,
  "<anchor()>": preParseAnchorFunction,
  "<anchor-size()>": preParseAnchorFunction,
  "<calc-value>": preParseCalcValue,
  "<combinator>": preParseCombinator,
  "<image-set()>": preParseImageSet,
  "<image-set-option>": preParseImageSetOption,
  "<length-percentage>": preParseLength,
  "<length>": preParseLength,
};
