"use strict";

const { LRUCache } = require("lru-cache");
const DOMException = require("../../../../generated/idl/DOMException.js");
const parser = require("../parse/parser.js");
const matcher = require("../match/selector.js");
const { isFailure } = require("../values/value.js");
const { syntaxSize } = require("../utils/syntax-size.js");
const { copyString } = require("../utils/string.js");

const parsedSelectors = new WeakMap();

function parseSelectors(element, source) {
  const document = element._ownerDocument;
  let cache = parsedSelectors.get(document);
  if (cache === undefined) {
    cache = new LRUCache({
      max: 1024,
      maxSize: 1024 * 1024,
      maxEntrySize: 64 * 1024,
      sizeCalculation: (value, key) => Math.max(1, key.length * 2 + syntaxSize(value)),
    });
    parsedSelectors.set(document, cache);
  }
  let selectors = cache.get(source);
  if (selectors === undefined) {
    selectors = parser.parseGrammar(source, "<selector-list>", element._globalObject);
    selectors = isFailure(selectors) ? null : selectors;
    if (source.length * 2 <= cache.maxEntrySize) {
      cache.set(copyString(source), selectors);
    }
  }
  if (selectors === null) {
    throw DOMException.create(element._globalObject, ["Invalid selector", "SyntaxError"]);
  }
  return selectors;
}

function createContext(scope) {
  return {
    root: scope.getRootNode(),
    scopes: { roots: [scope] },
  };
}

exports.matches = (element, source) => {
  const selectors = parseSelectors(element, source);
  return matcher.matchElementAgainstSelectors(element, selectors, createContext(element)) !== null;
};

exports.closest = (element, source) => {
  const selectors = parseSelectors(element, source);
  const context = createContext(element);
  const options = { selectorCache: new Map(), siblingIndexes: new Map() };
  for (let ancestor = element; ancestor !== null; ancestor = ancestor.parentElement) {
    if (matcher.matchElementAgainstSelectors(ancestor, selectors, context, options) !== null) {
      return ancestor;
    }
  }
  return null;
};

exports.query = (scope, source, first) => {
  const selectors = parseSelectors(scope, source);
  return matcher.matchTreesAgainstSelectors([scope], selectors, createContext(scope), { first });
};
