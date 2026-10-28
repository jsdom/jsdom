"use strict";

exports.createDeclarationBlockRule = createDeclarationBlockRule;
exports.createRule = createRule;
exports.createRuleContents = createRuleContents;
exports.getRuleList = getRuleList;
exports.insertRule = insertRule;
exports.isImportOrNamespaceRule = isImportOrNamespaceRule;
exports.isInvalidIndexForRule = isInvalidIndexForRule;
exports.isInvalidNamespaceRule = isInvalidNamespaceRule;
exports.removeRule = removeRule;
exports.replaceRules = replaceRules;
const CSSGroupingRule = require("../../../../generated/idl/CSSGroupingRule.js");
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSNamespaceRule = require("../../../../generated/idl/CSSNamespaceRule.js");
const CSSRule = require("../../../../generated/idl/CSSRule.js");
const CSSRuleList = require("../../../../generated/idl/CSSRuleList.js");
const DOMException = require("../../../../generated/idl/DOMException.js");
const dom = require("../parse/tree.js");
const parser = require("../parse/parser.js");
const contexts = require("../parse/context.js");
const values = require("../values/value.js");
const { invalidateStyle } = require("./style.js");
const ruleOrder = require("../rules/order.js");

// A rule list is a live public view of its owner's child rules. Internal
// traversal and mutation use that same array without creating the public view.
function getRuleList(owner) {
  owner._cssRules ??= CSSRuleList.createImpl(owner._globalObject, undefined, {
    rules: owner._rules,
  });
  return owner._cssRules;
}

function getRuleType(rule) {
  return rule._definition.cssom;
}
function isImportOrNamespaceRule(rule) {
  return CSSImportRule.isImpl(rule) || CSSNamespaceRule.isImpl(rule);
}

function isInvalidIndexForRule(list, rule, index) {
  return ruleOrder.isInvalidIndexForRule(list, rule, index, getRuleType);
}

function isInvalidNamespaceRule(list, rule) {
  return ruleOrder.isInvalidNamespaceRule(list, rule, getRuleType);
}

// https://drafts.csswg.org/cssom-1/#insert-a-css-rule
function insertRule(owner, input, index, allowImport) {
  const { _globalObject, _rules: list } = owner;
  if (list.length < index) {
    throw DOMException.create(_globalObject, [
      `Cannot insert a rule at index ${index} in a list of ${list.length} rules.`,
      "IndexSizeError",
    ]);
  }
  const context = contexts.createContext(owner);
  let rule = parser.parseRule(input, context);
  if (values.isParseErrorInfo(rule)) {
    if (CSSGroupingRule.isImpl(context.value)) {
      const topLevelRule = parser.parseRule(input, dom.getRoot(context));
      if (CSSRule.isImpl(topLevelRule)) {
        throw DOMException.create(_globalObject, [
          "Cannot insert this rule inside the parent grouping rule.",
          "HierarchyRequestError",
        ]);
      }
      const name = context.definition.value.rules[0]?.cssom;
      const declarations =
        name === "CSSNestedDeclarations" || name === "CSSFunctionDeclarations"
          ? parser.parseDeclarations(input, context)
          : [];
      if (declarations.length > 0) {
        rule = createDeclarationBlockRule(name, declarations, context.value);
        list.splice(index, 0, rule);
        invalidateStyle(_globalObject, rule.parentStyleSheet);
        return index;
      }
    }
    throw DOMException.create(_globalObject, [rule.message, "SyntaxError"]);
  }
  if (!allowImport && CSSImportRule.isImpl(rule)) {
    rule._abort();
    throw DOMException.create(_globalObject, [
      "Cannot insert @import in a constructed stylesheet.",
      "SyntaxError",
    ]);
  }
  if (isInvalidIndexForRule(list, rule, index)) {
    if (CSSImportRule.isImpl(rule)) {
      rule._abort();
    }
    throw DOMException.create(_globalObject, [
      `Cannot insert this rule at index ${index} because it would violate the stylesheet's rule order.`,
      "HierarchyRequestError",
    ]);
  }
  if (isInvalidNamespaceRule(list, rule)) {
    throw DOMException.create(_globalObject, [
      "Cannot insert @namespace when rules other than @import or @namespace already exist.",
      "InvalidStateError",
    ]);
  }
  list.splice(index, 0, rule);
  if (CSSImportRule.isImpl(rule)) {
    rule._fetch();
  }
  invalidateStyle(_globalObject, rule.parentStyleSheet);
  return index;
}

// https://drafts.csswg.org/cssom-1/#remove-a-css-rule
function removeRule({ _globalObject, _rules: list }, index) {
  if (list.length <= index) {
    throw DOMException.create(_globalObject, [
      `Cannot delete a rule at index ${index} from a list of ${list.length} rules.`,
      "IndexSizeError",
    ]);
  }
  const rule = list[index];
  if (isInvalidNamespaceRule(list, rule)) {
    throw DOMException.create(_globalObject, [
      "Cannot delete @namespace when rules other than @import or @namespace already exist.",
      "InvalidStateError",
    ]);
  }
  list.splice(index, 1);
  if (CSSImportRule.isImpl(rule)) {
    rule._abort();
  }
  const sheet = rule.parentStyleSheet;
  detachRule(rule);
  rule.parentRule = null;
  invalidateStyle(_globalObject, sheet);
}

function replaceRules(sheet, rules) {
  for (const rule of sheet._rules) {
    if (CSSImportRule.isImpl(rule)) {
      rule._abort();
    }
    detachRule(rule);
    rule.parentRule = null;
  }
  // The CSSRuleList keeps this array, including across replacement.
  sheet._rules.length = 0;
  for (const rule of rules) {
    sheet._rules.push(rule);
  }
  invalidateStyle(sheet._globalObject, sheet);
}

function detachRule(rule) {
  rule.parentStyleSheet = null;
  if (CSSImportRule.isImpl(rule) && rule.styleSheet) {
    // https://github.com/w3c/csswg-drafts/issues/13291
    rule.styleSheet.parentStyleSheet = null;
  }
  if (rule._rules) {
    for (const child of rule._rules) {
      detachRule(child);
    }
  }
}

function createDeclarationBlockRule(name, declarations, parentRule) {
  const { _globalObject, parentStyleSheet } = parentRule;
  return createRule(
    _globalObject,
    {
      declarations,
      definition: parentRule._definition.value.rules.find((rule) => rule.cssom === name),
    },
    parentRule,
    parentStyleSheet,
  );
}

function createRule(globalObject, syntax, parentRule, parentStyleSheet) {
  // Load the concrete rule interface after its base implementations have initialized.
  return require(`../../../../generated/idl/${syntax.definition.cssom}.js`).createImpl(
    globalObject,
    undefined,
    {
      ...syntax,
      parentRule,
      parentStyleSheet,
    },
  );
}

function createRuleContents(contents, parentRule) {
  return contents.map((content) => {
    if (Array.isArray(content)) {
      return content.slice();
    }
    return createRule(parentRule._globalObject, content, parentRule, parentRule.parentStyleSheet);
  });
}
