"use strict";
const lengthFromProperties = require("../utils").lengthFromProperties;
const getAttributeValue = require("./attributes").getAttributeValue;
const idlUtils = require("./generated/utils");

const privates = Symbol("HTMLCollection internal slots");

const conflictKeys = new Set(["length", "item", "namedItem"]);

class HTMLCollection {
  constructor(secret, element, query) {
    if (secret !== privates) {
      throw new TypeError("Invalid constructor");
    }

    this[privates] = { element, query, keys: new Set(), length: 0, version: -1, conflictElements: Object.create(null) };
    updateHTMLCollection(this);
  }

  get length() {
    updateHTMLCollection(this);
    return this[privates].length;
  }

  item(index) {
    updateHTMLCollection(this);
    return this[index] || null;
  }

  namedItem(name) {
    updateHTMLCollection(this);

    if (conflictKeys.has(name)) {
      return this[privates].conflictElements[name] || null;
    }

    if (Object.prototype.hasOwnProperty.call(this, name)) {
      return this[name];
    }
    return null;
  }
}

HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
Object.defineProperty(HTMLCollection.prototype, Symbol.toStringTag, {
  value: "HTMLCollection",
  writable: false,
  enumerable: false,
  configurable: true
});

function updateHTMLCollection(collection) {
  if (collection[privates].version < collection[privates].element._version) {
    resetHTMLCollectionTo(collection, collection[privates].query());
    collection[privates].version = collection[privates].element._version;
  }
}

function resetHTMLCollectionTo(collection, impls) {
  const wrappers = impls.map(idlUtils.wrapperForImpl);

  const startingLength = lengthFromProperties(collection);
  for (let i = 0; i < startingLength; ++i) {
    delete collection[i];
  }

  for (let i = 0; i < wrappers.length; ++i) {
    collection[i] = wrappers[i];
  }
  collection[privates].length = wrappers.length;

  const keys = collection[privates].keys;
  for (let i = 0; i < keys.size; ++i) {
    delete collection[keys[i]];
  }
  keys.clear();

  for (let i = 0; i < impls.length; ++i) {
    addIfAttrPresent(impls[i], wrappers[i], "name");
  }
  for (let i = 0; i < impls.length; ++i) {
    addIfAttrPresent(impls[i], wrappers[i], "id");
  }

  function addIfAttrPresent(impl, wrapper, attr) {
    const value = getAttributeValue(impl, attr);

    if (value === null || value === "") {
      return;
    }

    // Don't overwrite numeric indices with named ones.
    const valueAsNumber = Number(value);
    if (!Number.isNaN(valueAsNumber) && valueAsNumber >= 0) {
      return;
    }

    // Don't override existing named ones
    if (keys.has(value)) {
      return;
    }

    if (conflictKeys.has(value)) {
      collection[privates].conflictElements[value] = wrapper;
    } else {
      collection[value] = wrapper;
    }
    keys.add(value);
  }
}

module.exports = function (core) {
  core.HTMLCollection = HTMLCollection;
};

module.exports.create = function (element, query) {
  return new HTMLCollection(privates, element, query);
};

module.exports.update = updateHTMLCollection;
