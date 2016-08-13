"use strict";
const lengthFromProperties = require("../utils").lengthFromProperties;
const getAttributeValue = require("./attributes").getAttributeValue;
const idlUtils = require("./generated/utils");

const privates = Symbol("HTMLCollection internal slots");

// workaround for element keys that conflicts with property and method name
const conflictKeys = {
  length: 1,
  item: 1,
  namedItem: 1
};

class HTMLCollection {
  constructor(secret, element, query) {
    if (secret !== privates) {
      throw new TypeError("Invalid constructor");
    }

    this[privates] = {
      element,
      query,
      snapshot: undefined,
      version: -1,
      keys: [],
      length: 0,
      conflictElements: {}    // elements with conflict keys
    };
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

    if (name in conflictKeys) {
      return this[privates].conflictElements[name] || null;
    }
    if (Object.prototype.hasOwnProperty.call(this, name)) {
      return this[name];
    }
    return null;
  }
}

function updateHTMLCollection(collection) {
  if (collection[privates].version < collection[privates].element._version) {
    collection[privates].snapshot = collection[privates].query();
    resetHTMLCollectionTo(collection, collection[privates].snapshot);
    collection[privates].version = collection[privates].element._version;
  }
}

function resetHTMLCollectionTo(collection, els) {
  const startingLength = lengthFromProperties(collection);
  for (let i = 0; i < startingLength; ++i) {
    delete collection[i];
  }

  for (let i = 0; i < els.length; ++i) {
    const wrapped = idlUtils.wrapperForImpl(els[i]);
    collection[i] = wrapped ? wrapped : els[i];
  }
  collection[privates].length = els.length;

  const keys = collection[privates].keys;
  for (let i = 0; i < keys.length; ++i) {
    if (keys[i] in conflictKeys) {
      delete collection[privates].conflictElements[keys[i]];
    } else {
      delete collection[keys[i]];
    }
  }
  keys.length = 0;

  for (let i = 0; i < els.length; ++i) {
    addIfAttrPresent(els[i], "name");
  }
  for (let i = 0; i < els.length; ++i) {
    addIfAttrPresent(els[i], "id");
  }

  function addIfAttrPresent(el, attr) {
    const impl = idlUtils.implForWrapper(el);
    const toTest = impl ? impl : el;
    const key = getAttributeValue(toTest, attr);

    const wrapped = idlUtils.wrapperForImpl(el);

    if (key === null || key === "") {
      return;
    }

    // Don't overwrite numeric indices with named ones.
    const keyAsNumber = Number(key);
    if (!Number.isNaN(keyAsNumber) && keyAsNumber >= 0) {
      return;
    }

    if (key in conflictKeys) {
      collection[privates].conflictElements[key] = wrapped ? wrapped : el;
    } else {
      collection[key] = wrapped ? wrapped : el;
    }
    keys.push(key);
  }
}

module.exports = function (core) {
  core.HTMLCollection = HTMLCollection;
};

module.exports.create = function (element, query) {
  return new HTMLCollection(privates, element, query);
};

module.exports.update = updateHTMLCollection;
