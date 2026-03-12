"use strict";

const CSSConditionRuleImpl = require("./CSSConditionRule-impl.js").implementation;
const { serializeGroupingRuleBody } = require("./CSSGroupingRule-impl.js");
const csstree = require("./helpers/patched-csstree.js");

function evaluateSupportsCondition(node) {
  const children = node.children.toArray();

  // "not" prefix
  if (children[0].type === "Identifier" && children[0].name === "not") {
    return !evaluateSupportsItem(children[1]);
  }

  let result = evaluateSupportsItem(children[0]);

  // Remaining operator + item pairs
  for (let i = 1; i < children.length; i += 2) {
    const operator = children[i].name;
    const item = children[i + 1];
    if (operator === "and") {
      result &&= evaluateSupportsItem(item);
    } else if (operator === "or") {
      result ||= evaluateSupportsItem(item);
    }
  }

  return result;
}

function evaluateSupportsItem(node) {
  if (node.type === "SupportsDeclaration") {
    const { property } = node.declaration;
    const value = csstree.generate(node.declaration.value);
    return csstree.lexer.matchProperty(property, value).error === null;
  }
  if (node.type === "Condition") {
    return evaluateSupportsCondition(node);
  }
  return false;
}

// Evaluate a @supports condition string against csstree's lexer.
function evaluateSupportsText(conditionText) {
  try {
    const ast = csstree.parse(`@supports ${conditionText} {}`, { context: "atrule", atrule: "supports" });
    return evaluateSupportsCondition(ast.prelude.children.first);
  } catch {
    return false;
  }
}

class CSSSupportsRuleImpl extends CSSConditionRuleImpl {
  get type() {
    return 12; // SUPPORTS_RULE
  }

  get matches() {
    return evaluateSupportsText(this._conditionText);
  }

  get cssText() {
    return `@supports ${this._conditionText} ${serializeGroupingRuleBody(this.cssRules._list)}`;
  }
}

exports.implementation = CSSSupportsRuleImpl;
exports.evaluateSupportsText = evaluateSupportsText;
