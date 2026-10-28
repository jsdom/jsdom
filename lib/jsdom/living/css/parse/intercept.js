"use strict";

const cssParser = require("./parser.js");
const cssValues = require("../values/value.js");
const mediaSyntax = require("../values/media.js");
const nodeUtils = require("./tree.js");
// https://drafts.csswg.org/selectors-4/#typedef-forgiving-selector-list
//
// It stops propagating an error resulting from parsing an item of a forgiving
// selector list, to serialize the list with the invalid selector.
function interceptInvalidSelector(error, node) {
  const { context, input } = node;
  if (
    !context.strict &&
    nodeUtils.findContext(node, (entryNode) => entryNode.definition.type === "forgiving")
  ) {
    return cssParser.consumeUnparsedSelector(input, node);
  }
  return error;
}

// https://drafts.csswg.org/css-anchor-position-2/#typedef-anchored-in-parens
// https://drafts.csswg.org/css-conditional-3/#typedef-supports-in-parens
// https://drafts.csswg.org/css-conditional-5/#typedef-query-in-parens
// https://drafts.csswg.org/css-conditional-5/#typedef-scroll-state-in-parens
// https://drafts.csswg.org/css-conditional-5/#typedef-style-in-parens
// https://drafts.csswg.org/mediaqueries-5/#typedef-media-in-parens
//
// It stops propagating an error resulting from parsing a query in parens, to
// fallback with <general-enclosed>.
function interceptQueryInParensError(error, node) {
  const value = cssParser.parseGrammar(node.input, "<general-enclosed>", node, "lazy");
  if (value === null || cssValues.isParseErrorInfo(value)) {
    return value ?? error;
  }
  return node.definition.name === "<media-in-parens>"
    ? mediaSyntax.unknown(value)
    : { ...value, types: [...value.types, node.definition.name] };
}

// Unsupported declarations in an import condition remain valid syntax and
// evaluate to false, including the form without an extra pair of parentheses.
function interceptImportConditionError(error, node) {
  return cssParser.parseGrammar(node.input, "supports(<any-value>)", node, "lazy") ?? error;
}
module.exports = {
  "<anchored-in-parens>": interceptQueryInParensError,
  "<complex-real-selector>": interceptInvalidSelector,
  "<media-in-parens>": interceptQueryInParensError,
  "<query-in-parens>": interceptQueryInParensError,
  "<scroll-state-in-parens>": interceptQueryInParensError,
  "<style-in-parens>": interceptQueryInParensError,
  "<supports-import-condition>": interceptImportConditionError,
  "<supports-in-parens>": interceptQueryInParensError,
};
