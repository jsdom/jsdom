"use strict";

const nodes = require("../parse/tree.js");
function resolveScopeStart(node) {
  if (nodes.findRule(nodes.getRule(node), ({ definition: { name } }) => name === "@scope" || name === "@style")) {
    return "<relative-real-selector-list>";
  }
  return "<complex-real-selector-list>";
}

// https://drafts.csswg.org/css-values-5/#typedef-size-keyword
function resolveSizeKeyword(node) {
  switch (nodes.getDeclaration(node)?.definition.name) {
    case "block-size":
    case "inline-size":
    case "min-block-size":
    case "min-inline-size":
    case "height":
    case "min-height":
    case "min-width":
    case "width":
      return "auto | min-content | max-content | stretch | fit-content | " +
        "fit-content(<length-percentage [0,∞]>) | contain";
    case "max-block-size":
    case "max-inline-size":
    case "max-height":
    case "max-width":
      return "min-content | max-content | stretch | fit-content | fit-content(<length-percentage [0,∞]>) | contain";
    case "flex-basis":
    case "flex":
      return "auto | content | min-content | max-content | stretch | fit-content | " +
        "fit-content(<length-percentage [0,∞]>) | contain";
    default:
      throw new RangeError("Unexpected size keyword");
  }
}

function resolveBooleanTest(node) {
  // Parenthesized expressions start a separate parse tree. Follow both grammar
  // parents and parsing contexts to find the concrete parameter binding.
  for (let ancestor = node; ancestor; ancestor = ancestor.parent ?? ancestor.context) {
    const { test } = ancestor.definition;
    if (test !== undefined && test.trim() !== "<test>") {
      return test;
    }
  }
  throw new RangeError("Missing boolean expression test grammar");
}
module.exports = {
  "<scope-start>": resolveScopeStart,
  "<size-keyword>": resolveSizeKeyword,
  "<test>": resolveBooleanTest
};
