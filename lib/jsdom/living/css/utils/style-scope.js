"use strict";

const CSSContainerRule = require("../../../../generated/idl/CSSContainerRule.js");
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSLayerBlockRule = require("../../../../generated/idl/CSSLayerBlockRule.js");
const CSSLayerStatementRule = require("../../../../generated/idl/CSSLayerStatementRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const CSSPropertyRule = require("../../../../generated/idl/CSSPropertyRule.js");
const CSSScopeRule = require("../../../../generated/idl/CSSScopeRule.js");
const CSSStartingStyleRule = require("../../../../generated/idl/CSSStartingStyleRule.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const CSSSupportsRule = require("../../../../generated/idl/CSSSupportsRule.js");
const media = require("../match/media.js");
const { getDocumentStyleState, getStyleSheets } = require("./style.js");

// DOM mutations discard element styles, but layer order and registrations can survive if
// the conditions used to collect them still match. Check those once per style generation.
function getStyleSheetState(document) {
  const style = getDocumentStyleState(document);
  if (style.styleSheets === null) {
    let state = document._styleSheetCache;
    if (state !== null) {
      for (const [queries, matched] of state.media) {
        if (media(queries, document._globalObject) !== matched) {
          state = null;
          break;
        }
      }
    }
    if (state === null) {
      state = document._styleSheetCache = {
        scopes: new WeakMap(),
        registeredProperties: null,
        media: new Map(),
      };
    }
    style.styleSheets = state;
  }
  return style.styleSheets;
}

function createLayer() {
  return { children: new Map(), order: Infinity };
}

function registerLayer(name, layer) {
  const segments =
    name === null
      ? [Symbol("anonymous layer")]
      : [name[0].value, ...name[1].map(([, identifier]) => identifier.value)];
  for (const segment of segments) {
    let child = layer.children.get(segment);
    if (!child) {
      child = createLayer();
      layer.children.set(segment, child);
    }
    layer = child;
  }
  return layer;
}

// Layer order and name-defining rules belong to a tree scope, independently of which
// elements match its style rules, scopes, or container queries.
function getStyleScope(root) {
  const document = root.nodeType === 9 ? root : root._ownerDocument;
  const state = getStyleSheetState(document);
  const { scopes } = state;
  let scope = scopes.get(root);
  if (scope) {
    return scope;
  }
  const globalObject = document._globalObject;
  scope = { layer: createLayer(), ruleLayers: new Map(), registrations: [] };

  function matchesMedia(queries) {
    const matched = media(queries, globalObject);
    if (queries.length > 0) {
      state.media.set(queries, matched);
    }
    return matched;
  }

  function collectRules(rules, layer) {
    for (const rule of rules) {
      if (CSSImportRule.isImpl(rule)) {
        if (rule._supports && matchesMedia(rule.media._list)) {
          let importedLayer = layer;
          // An import establishes its layer even if the stylesheet cannot be loaded.
          if (rule.layerName !== null) {
            importedLayer = registerLayer(rule._layerName, layer);
            scope.ruleLayers.set(rule, importedLayer);
          }
          if (rule.styleSheet) {
            collectSheet(rule.styleSheet, importedLayer);
          }
        }
      } else if (CSSLayerStatementRule.isImpl(rule)) {
        for (const name of rule._names) {
          registerLayer(name, layer);
        }
      } else if (CSSLayerBlockRule.isImpl(rule)) {
        const child = registerLayer(rule._name, layer);
        scope.ruleLayers.set(rule, child);
        collectRules(rule._rules, child);
      } else if (CSSMediaRule.isImpl(rule)) {
        if (matchesMedia(rule.media._list)) {
          collectRules(rule._rules, layer);
        }
      } else if (CSSSupportsRule.isImpl(rule)) {
        if (rule.matches) {
          collectRules(rule._rules, layer);
        }
      } else if (CSSPropertyRule.isImpl(rule)) {
        scope.registrations.push({ rule, layer });
      } else if (
        CSSStyleRule.isImpl(rule) ||
        CSSScopeRule.isImpl(rule) ||
        CSSContainerRule.isImpl(rule) ||
        CSSStartingStyleRule.isImpl(rule)
      ) {
        collectRules(rule._rules, layer);
      }
    }
  }

  function collectSheet(sheet, layer) {
    if (!sheet.disabled && matchesMedia(sheet.media._list)) {
      collectRules(sheet._rules, layer);
    }
  }

  for (const sheet of getStyleSheets(root)) {
    collectSheet(sheet, scope.layer);
  }

  let order = 0;
  function orderLayers(layer) {
    for (const child of layer.children.values()) {
      orderLayers(child);
    }
    // Declarations directly in a layer take precedence over all of its sublayers.
    layer.order = order++;
  }
  for (const layer of scope.layer.children.values()) {
    orderLayers(layer);
  }
  // Stable sorting preserves source order within each layer.
  scope.registrations.sort((a, b) => a.layer.order - b.layer.order);
  scopes.set(root, scope);
  return scope;
}

exports.getStyleScope = getStyleScope;
exports.getStyleSheetState = getStyleSheetState;
