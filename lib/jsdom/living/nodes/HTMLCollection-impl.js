"use strict";

const idlUtils = require("../../../generated/idl/utils.js");
const { HTML_NS } = require("../helpers/namespaces");

exports.implementation = class HTMLCollectionImpl {
  #namedElements = null;

  constructor(globalObject, args, privateData) {
    this._list = [];
    this._version = -1;
    this._element = privateData.element;
    this._query = privateData.query;

    this._globalObject = globalObject;

    this._update();
  }
  get length() {
    this._update();
    return this._list.length;
  }
  item(index) {
    this._update();
    return this._list[index] || null;
  }
  namedItem(key) {
    if (key === "") {
      return null;
    }
    this._update();
    return this.#getNamedElements().get(key) ?? null;
  }
  #getNamedElements() {
    if (this.#namedElements === null) {
      const namedElements = new Map();
      for (const element of this._list) {
        const id = element.getAttributeNS(null, "id");
        if (id && !namedElements.has(id)) {
          namedElements.set(id, element);
        }
        if (element._namespaceURI === HTML_NS) {
          const name = element.getAttributeNS(null, "name");
          if (name && !namedElements.has(name)) {
            namedElements.set(name, element);
          }
        }
      }
      this.#namedElements = namedElements;
    }
    return this.#namedElements;
  }
  _invalidate() {
    // Drop stale nodes without rebuilding the collection so removed subtrees can be collected.
    this._list.length = 0;
    this.#namedElements = null;
  }
  _update() {
    if (this._version < this._element._version) {
      const snapshot = this._query();
      for (let i = 0; i < snapshot.length; i++) {
        this._list[i] = snapshot[i];
      }
      this._list.length = snapshot.length;
      this._version = this._element._version;
      this.#namedElements = null;
    }
  }
  get [idlUtils.supportedPropertyIndices]() {
    this._update();
    return this._list.keys();
  }
  get [idlUtils.supportedPropertyNames]() {
    this._update();
    return this.#getNamedElements().keys();
  }

  // Inherit some useful functions from Array.
  [Symbol.iterator]() {
    this._update();
    return this._list[Symbol.iterator]();
  }
  entries() {
    this._update();
    return this._list.entries();
  }
  filter(...args) {
    this._update();
    return this._list.filter(...args);
  }
  map(...args) {
    this._update();
    return this._list.map(...args);
  }
  indexOf(...args) {
    this._update();
    return this._list.indexOf(...args);
  }
};
