"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Specificity = require("@bramus/specificity").default;
const { LRUCache } = require("lru-cache");
const CSSImportRule = require("../../../../generated/idl/CSSImportRule.js");
const CSSMediaRule = require("../../../../generated/idl/CSSMediaRule.js");
const CSSStyleProperties = require("../../../../generated/idl/CSSStyleProperties.js");
const CSSStyleRule = require("../../../../generated/idl/CSSStyleRule.js");
const { asciiLowercase } = require("../../helpers/strings");
const { evaluateMediaList } = require("../MediaList-impl.js");
const { parseStyleSheet } = require("./css-parser");
const { isGlobalKeyword } = require("./css-values");
const csstree = require("./patched-csstree");
const { systemColors } = require("./system-colors");

// Cache
const lruCache = new LRUCache({
  max: 2048
});

const defaultStyleSheet = fs.readFileSync(
  path.resolve(__dirname, "../../../browser/default-stylesheet.css"),
  { encoding: "utf-8" }
);
const defaultStyleSheetCache = new WeakMap();

function getComputedStyleDeclaration(elementImpl) {
  const styleCache = elementImpl._ownerDocument._styleCache;
  if (styleCache.has(elementImpl)) {
    return cloneCachedDeclaration(styleCache.get(elementImpl), elementImpl);
  }
  const declaration = prepareComputedStyleDeclaration(elementImpl, styleCache);
  return cloneCachedDeclaration(declaration, elementImpl);
}

function prepareComputedStyleDeclaration(elementImpl, styleCache) {
  const declaration = CSSStyleProperties.createImpl(elementImpl._globalObject, [], {
    computed: true,
    ownerNode: elementImpl
  });
  applyStyleSheetRules(elementImpl, declaration);
  applyInlineStyles(elementImpl.style, declaration);
  declaration._readonly = true;
  styleCache.set(elementImpl, declaration);

  return declaration;
}

function cloneCachedDeclaration(cachedDeclaration, elementImpl) {
  const clonedDeclaration = CSSStyleProperties.createImpl(elementImpl._globalObject, [], {
    computed: true,
    ownerNode: elementImpl
  });

  for (let i = 0; i < cachedDeclaration.length; i++) {
    const property = cachedDeclaration.item(i);
    const value = cachedDeclaration.getPropertyValue(property);
    const priority = cachedDeclaration.getPropertyPriority(property);
    clonedDeclaration.setProperty(property, value, priority);
  }
  clonedDeclaration._readonly = true;

  return clonedDeclaration;
}

function applyStyleSheetRules(elementImpl, declaration) {
  const doc = elementImpl._ownerDocument;
  if (!doc._ruleIndexCache) {
    doc._ruleIndexCache = buildDocumentRuleIndex(doc, elementImpl._globalObject);
  }
  const index = doc._ruleIndexCache;
  const rulesToEvaluate = new Set();

  const id = elementImpl.getAttributeNS(null, "id");
  if (id && index.id.has(id)) {
    for (const rule of index.id.get(id)) {
      rulesToEvaluate.add(rule);
    }
  }

  const classAttr = elementImpl.getAttributeNS(null, "class");
  if (classAttr) {
    const classes = classAttr.trim().split(/[\t\n\f\r ]+/);
    for (const className of classes) {
      if (className && index.className.has(className)) {
        for (const rule of index.className.get(className)) {
          rulesToEvaluate.add(rule);
        }
      }
    }
  }

  const tag = elementImpl._localName;
  if (tag) {
    const lowerTag = asciiLowercase(tag);
    if (index.tag.has(lowerTag)) {
      for (const rule of index.tag.get(lowerTag)) {
        rulesToEvaluate.add(rule);
      }
    }
  }

  for (const rule of index.universal) {
    rulesToEvaluate.add(rule);
  }

  const specificities = new Map();
  const sortedRules = [...rulesToEvaluate].sort((a, b) => {
    return index.order.get(a) - index.order.get(b);
  });
  for (const ruleImpl of sortedRules) {
    handleRule(ruleImpl, elementImpl, declaration, specificities);
  }
}

function applyInlineStyles(style, declaration) {
  for (let i = 0; i < style.length; i++) {
    const property = style.item(i);
    const value = style.getPropertyValue(property);
    const priority = style.getPropertyPriority(property);
    if (!declaration.getPropertyPriority(property) || priority) {
      declaration.setProperty(property, value, priority);
    }
  }
}

function buildDocumentRuleIndex(documentImpl, globalObject) {
  let parsedDefaultStyleSheet = defaultStyleSheetCache.get(globalObject);
  if (!parsedDefaultStyleSheet) {
    parsedDefaultStyleSheet = parseStyleSheet(defaultStyleSheet, globalObject);
    defaultStyleSheetCache.set(globalObject, parsedDefaultStyleSheet);
  }

  const index = {
    id: new Map(),
    className: new Map(),
    tag: new Map(),
    universal: [],
    order: new WeakMap()
  };
  const context = { sourceOrder: 0 };
  indexRulesWithOrder(parsedDefaultStyleSheet, index, context);
  for (const sheetImpl of documentImpl.styleSheets._list) {
    indexRulesWithOrder(sheetImpl, index, context);
  }

  return index;
}

// Extracted from buildDocumentRuleIndex to avoid creating nested functions
function indexRulesWithOrder(ruleContainer, index, context) {
  for (const ruleImpl of ruleContainer.cssRules._list) {
    if (CSSImportRule.isImpl(ruleImpl)) {
      if (ruleImpl.styleSheet !== null && evaluateMediaList(ruleImpl.media._list)) {
        indexRulesWithOrder(ruleImpl.styleSheet, index, context);
      }
    } else if (CSSMediaRule.isImpl(ruleImpl)) {
      if (evaluateMediaList(ruleImpl.media._list)) {
        indexRulesWithOrder(ruleImpl, index, context);
      }
    } else if (CSSStyleRule.isImpl(ruleImpl)) {
      index.order.set(ruleImpl, context.sourceOrder++);
      extractAndIndexRule(ruleImpl, index);
    }
  }
}

function extractAndIndexRule(ruleImpl, index) {
  const keysList = getParsedSelectorKeys(ruleImpl.selectorText);

  for (const keys of keysList) {
    if (keys.id) {
      addToMap(index.id, keys.id, ruleImpl);
    } else if (keys.className) {
      addToMap(index.className, keys.className, ruleImpl);
    } else if (keys.tag) {
      addToMap(index.tag, keys.tag, ruleImpl);
    } else {
      index.universal.push(ruleImpl);
    }
  }
}

function getParsedSelectorKeys(selectorText) {
  let keysList = lruCache.get(selectorText);
  if (keysList !== undefined) {
    return keysList;
  }

  keysList = [];
  try {
    const ast = csstree.parse(selectorText, { context: "selectorList" });
    for (const selectorNode of ast.children) {
      let idKey = null;
      let classKey = null;
      let tagKey = null;

      let current = selectorNode.children.tail;
      while (current) {
        const node = current.data;
        if (node.type === "Combinator") {
          break;
        }

        if (node.type === "IdSelector") {
          idKey = csstree.ident.decode(node.name);
        } else if (node.type === "ClassSelector") {
          classKey = csstree.ident.decode(node.name);
        } else if (node.type === "TypeSelector") {
          const decoded = csstree.ident.decode(node.name);
          if (decoded !== "*") {
            tagKey = asciiLowercase(decoded);
          }
        }
        current = current.prev;
      }
      keysList.push({ id: idKey, className: classKey, tag: tagKey });
    }
  } catch {
    keysList.push({ id: null, className: null, tag: null });
  }

  lruCache.set(selectorText, keysList);

  return keysList;
}

function addToMap(map, key, rule) {
  let rules = map.get(key);
  if (!rules) {
    rules = [];
    map.set(key, rules);
  }
  rules.push(rule);
}

function handleRule(ruleImpl, elementImpl, declaration, specificities) {
  const { ast, match } = matches(ruleImpl.selectorText, elementImpl);
  if (match) {
    handleStyle(ruleImpl.style, declaration, specificities, ast);
  }
}

function handleStyle(style, declaration, specificities, ast) {
  for (let i = 0; i < style.length; i++) {
    const property = style.item(i);
    handleProperty(property, declaration, style, specificities, ast);
  }
}

function handleProperty(property, declaration, style, specificities, ast) {
  const value = style.getPropertyValue(property);
  const priority = style.getPropertyPriority(property);
  if (priority) {
    declaration.setProperty(property, value, priority);
  } else if (!declaration.getPropertyPriority(property)) {
    const { value: specificity } = Specificity.max(...Specificity.calculate(ast));
    if (specificities.has(property)) {
      if (Specificity.compare(specificity, specificities.get(property)) >= 0) {
        specificities.set(property, specificity);
        declaration.setProperty(property, value);
      }
    } else {
      specificities.set(property, specificity);
      declaration.setProperty(property, value);
    }
  }
}

function matches(selectorText, elementImpl) {
  const domSelector = elementImpl._ownerDocument._getDOMSelector();
  const { ast, match, pseudoElement } = domSelector.check(selectorText, elementImpl);
  // `pseudoElement` is a pseudo-element selector (e.g. `::before`).
  // However, we do not support getComputedStyle(element, pseudoElement), so `match` is set to `false`.
  if (pseudoElement) {
    return {
      match: false
    };
  }
  return { ast, match, pseudoElement };
}

function replaceEmptyValueAndKeywords(property, value, elementImpl, { inherit, initial, isColor, longhands }) {
  if (value === "") {
    if (longhands) {
      return "";
    } else if (!inherit || !elementImpl.parentElement) {
      return initial;
    }
    value = getInheritedPropertyValue(property, elementImpl, { inherit, initial, isColor });
  }

  if (isGlobalKeyword(value)) {
    value = replaceGlobalKeywords(property, value, elementImpl, { inherit, initial, isColor });
  }

  return value;
}

function getInheritedPropertyValue(property, elementImpl, { inherit, initial, isColor }) {
  const styleCache = elementImpl._ownerDocument._styleCache;
  const { parentElement } = elementImpl;
  if (!parentElement) {
    return initial;
  }

  let parent = parentElement;
  while (parent) {
    let declaration;
    if (styleCache.has(parent)) {
      declaration = styleCache.get(parent);
    } else {
      declaration = prepareComputedStyleDeclaration(parent, styleCache);
    }
    // For color-related properties, unset the _computed flag to retrieve the specified value.
    // @asamuzakjp/css-color handles the resolution of the specified value.
    if (isColor) {
      declaration._computed = false;
    }
    let value = declaration.getPropertyValue(property);
    if (isColor) {
      // Restore the _computed flag.
      declaration._computed = true;
      // If the value is a system color value, retrieve it again as a computed value.
      if (value && systemColors.has(asciiLowercase(value))) {
        value = declaration.getPropertyValue(property);
      }
      if (isGlobalKeyword(value)) {
        return replaceGlobalKeywords(property, value, parent, { inherit, initial, isColor });
      }
    }
    if (value) {
      return value;
    }
    if (!parent.parentElement || !inherit) {
      break;
    }
    parent = parent.parentElement;
  }

  return initial;
}

function replaceGlobalKeywords(property, value, elementImpl, { inherit, initial, isColor }) {
  let element = elementImpl;
  while (element) {
    switch (value) {
      case "initial": {
        return initial;
      }
      case "inherit": {
        if (!element.parentElement) {
          return initial;
        }
        value = getInheritedPropertyValue(property, element, { inherit, initial, isColor });
        break;
      }
      case "unset": {
        if (!inherit || !element.parentElement) {
          return initial;
        }
        value = getInheritedPropertyValue(property, element, { inherit, initial, isColor });
        break;
      }
      case "revert-layer": {
        // TODO: https://drafts.csswg.org/css-cascade-5/#revert-layer
        return value;
      }
      case "revert": {
        // TODO: https://drafts.csswg.org/css-cascade-5/#default
        return value;
      }
      default: {
        // noop; value is not a CSS-wide keyword.
      }
    }
    if (element.parentElement) {
      if (!value) {
        element = element.parentElement;
      } else if (isGlobalKeyword(value)) {
        return replaceGlobalKeywords(property, value, element, { inherit, initial, isColor });
      } else {
        return value;
      }
    } else {
      return initial;
    }
  }

  return value;
}

function invalidateStyleCache(elementImpl) {
  if (elementImpl._attached) {
    const doc = elementImpl._ownerDocument;
    doc._styleCache = new WeakMap();
    doc._ruleIndexCache = null;
  }
}

exports.SHADOW_DOM_PSEUDO_REGEXP = /^::(?:part|slotted)\(/i;
exports.getComputedStyleDeclaration = getComputedStyleDeclaration;
exports.getInheritedPropertyValue = getInheritedPropertyValue;
exports.invalidateStyleCache = invalidateStyleCache;
exports.replaceEmptyValueAndKeywords = replaceEmptyValueAndKeywords;
