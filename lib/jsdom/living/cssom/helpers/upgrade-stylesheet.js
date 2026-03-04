"use strict";

const { CSSStyleDeclaration } = require("../style-declaration/CSSStyleDeclaration");

// TODO: Remove this entire post-processing pass once @acemir/cssom provides a supported way to inject the declaration
// implementation at parser construction time.
//
// The better design is for @acemir/cssom to accept a CSSStyleDeclaration class via setup()/parse() options and use it
// consistently when constructing all rule.style objects.
function upgradeStyleDeclarations(sheet, globalObject) {
  if (!sheet?.cssRules) {
    return;
  }

  for (const rule of sheet.cssRules) {
    if (rule?.style && typeof rule.style.length === "number" && typeof rule.style.getPropertyValue === "function") {
      rule.style = cloneDeclaration(rule.style, rule, globalObject);
    }

    if (rule?.styleSheet) {
      upgradeStyleDeclarations(rule.styleSheet, globalObject);
    }

    if (rule?.cssRules) {
      upgradeNestedRules(rule.cssRules, globalObject);
    }
  }
}

function upgradeNestedRules(cssRules, globalObject) {
  for (const rule of cssRules) {
    if (rule?.style && typeof rule.style.length === "number" && typeof rule.style.getPropertyValue === "function") {
      rule.style = cloneDeclaration(rule.style, rule, globalObject);
    }

    if (rule?.styleSheet) {
      upgradeStyleDeclarations(rule.styleSheet, globalObject);
    }

    if (rule?.cssRules) {
      upgradeNestedRules(rule.cssRules, globalObject);
    }
  }
}

function cloneDeclaration(source, context, globalObject) {
  const declaration = new CSSStyleDeclaration(globalObject, undefined, { context });
  for (let i = 0; i < source.length; i++) {
    const property = source[i];
    declaration.setProperty(property, source.getPropertyValue(property), source.getPropertyPriority(property));
  }
  return declaration;
}

exports.upgradeStyleDeclarations = upgradeStyleDeclarations;
