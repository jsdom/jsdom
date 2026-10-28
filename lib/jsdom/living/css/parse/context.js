"use strict";

exports.createContext = createContext;
exports.createDeclarationContext = createDeclarationContext;
exports.createVirtualContext = createVirtualContext;
exports.enterVirtualContext = enterVirtualContext;
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSLayerStatementRule = require("../../../../generated/idl/CSSLayerStatementRule.js");
const CSSNamespaceRule = require("../../../../generated/idl/CSSNamespaceRule.js");
const CSSRule = require("../../../../generated/idl/CSSRule.js");
const CSSStyleSheet = require("../../../../generated/idl/CSSStyleSheet.js");
const nodeUtils = require("./tree.js");
const contextUtils = require("./declarations.js");
const ruleDefinitions = require("../rules/definitions.js");
const type = Symbol("context");

function createContext(value) {
  if (value?.type === type) {
    return value;
  }
  if (nodeUtils.isNode(value)) {
    return {
      ...value.context,
      ...value,
      type,
    };
  }
  const globalObject = value?._globalObject ?? value?.ownerDocument?.defaultView ?? value;
  const state = {
    extended: new Map(),
  };
  if (CSSRule.isImpl(value)) {
    const context = createContext(value.parentRule ?? value.parentStyleSheet ?? globalObject);
    const definition = value._definition;
    return {
      ...context,
      context,
      definition,
      globalObject,
      state,
      value,
    };
  }
  const namespaces = new Map();
  const context = {
    definition: ruleDefinitions,
    globalObject,
    namespaces,
    randomEvaluation: undefined,
    state,
    trees: [],
    type,
  };
  if (value === globalObject) {
    return context;
  }
  if (CSSStyleSheet.isImpl(value)) {
    for (const rule of value._rules ?? []) {
      if (CSSNamespaceRule.isImpl(rule)) {
        namespaces.set(rule.prefix, rule.namespaceURI);
      } else if (!CSSImportRule.isImpl(rule) && !CSSLayerStatementRule.isImpl(rule)) {
        // Namespace rules cannot follow ordinary rules.
        break;
      }
    }
    return {
      ...context,
      globalObject,
      value,
    };
  }
  // Assert: value is an Element
  const definition = ruleDefinitions.value.rules.find(
    (entryDefinition) => entryDefinition.qualified,
  );
  return {
    ...context,
    context,
    definition,
  };
}

function createDeclarationContext(context, definition) {
  context = createContext(context);
  if (typeof definition === "string") {
    definition = contextUtils.getDeclarationDefinition(context, definition);
    if (!definition) {
      return null;
    }
  }
  return {
    ...context,
    context,
    definition,
    state: { extended: new Map() },
  };
}

function createVirtualContext(globalObject, name) {
  if (typeof name === "string") {
    name = [name];
  }
  const namespaces = new Map();
  const state = {
    extended: new Map(),
  };
  const context = {
    definition: ruleDefinitions,
    globalObject,
    namespaces,
    randomEvaluation: undefined,
    state,
    trees: [],
    type,
  };
  return name.reduce((entryContext, entryName) => {
    const definition = entryContext.definition.value.rules.find((rule) => rule.name === entryName);
    return {
      ...entryContext,
      context: entryContext,
      definition,
      state: {
        extended: new Map(),
      },
    };
  }, context);
}

function enterVirtualContext(node, name) {
  const { context } = node;
  const definition = nodeUtils
    .getRoot(node)
    .definition.value.rules.find((rule) => rule.name === name);
  return {
    ...context,
    context,
    definition,
    state: {
      extended: new Map(),
    },
  };
}
