"use strict";

exports.isInvalidIndexForRule = isInvalidIndexForRule;
exports.isInvalidNamespaceRule = isInvalidNamespaceRule;

function isImportOrNamespace(name) {
  return name === "CSSImportRule" || name === "CSSNamespaceRule";
}

function isInvalidIndexForRule(rules, rule, index, getType) {
  const name = getType(rule);
  if (name === "CSSImportRule") {
    return !rules.slice(0, index).every((previous, previousIndex, previousRules) => {
      if (getType(previous) === "CSSLayerStatementRule") {
        return previousRules.slice(0, previousIndex).every(candidate => getType(candidate) === "CSSLayerStatementRule");
      }
      return getType(previous) === "CSSImportRule";
    });
  }
  if (name === "CSSLayerStatementRule") {
    return rules.slice(0, index).some(candidate => isImportOrNamespace(getType(candidate))) &&
      rules.slice(index).some(candidate => isImportOrNamespace(getType(candidate)));
  }
  if (name === "CSSNamespaceRule") {
    return !rules.slice(0, index).every((previous, previousIndex, previousRules) => {
      if (getType(previous) === "CSSLayerStatementRule") {
        return previousRules.slice(0, previousIndex).every(candidate => getType(candidate) === "CSSLayerStatementRule");
      }
      return isImportOrNamespace(getType(previous));
    }) || rules.slice(index).some(candidate => getType(candidate) === "CSSImportRule");
  }
  return rules.slice(index).some(candidate => isImportOrNamespace(getType(candidate)));
}

function isInvalidNamespaceRule(rules, rule, getType) {
  if (getType(rule) !== "CSSNamespaceRule") {
    return false;
  }
  return !rules.every(candidate => {
    const type = getType(candidate);
    return isImportOrNamespace(type) || type === "CSSLayerStatementRule";
  });
}
