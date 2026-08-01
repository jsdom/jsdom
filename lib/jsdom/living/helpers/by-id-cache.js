"use strict";

const { treeOrderSorter } = require("../../utils.js");

// For use in implementing getElementById(). Notably it ensures that when you get the result, you will always get the
// first in tree order, not the most- or least-recently-inserted. Somewhat modeled after
// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/dom/tree_ordered_map.h.

module.exports = class ByIdCache {
  constructor() {
    // Keys are IDs (strings).
    // Values are `{ element, elements }` tuples. `element` is the first element in tree order, or `null` if it needs
    // to be recomputed. `elements` is `null` for unique IDs, or a set containing every element for duplicate IDs.
    this._map = new Map();
  }

  add(id, element) {
    const value = this._map.get(id);
    if (!value) {
      this._map.set(id, { element, elements: null });
    } else {
      if (value.elements === null) {
        value.elements = new Set([value.element]);
      }
      value.elements.add(element);
      value.element = null;
    }
  }

  delete(id, element) {
    const value = this._map.get(id);
    if (!value) {
      return;
    }

    if (value.elements === null) {
      this._map.delete(id);
      return;
    }

    value.elements.delete(element);
    if (value.elements.size === 1) {
      value.element = value.elements.values().next().value;
      value.elements = null;
    } else if (value.element === element) {
      value.element = null;
    }
  }

  get(id) {
    const value = this._map.get(id);
    if (!value) {
      return null;
    }

    if (value.element) {
      return value.element;
    }

    value.element = this.getAll(id)[0];
    return value.element;
  }

  getAll(id) {
    const value = this._map.get(id);
    if (!value) {
      return [];
    }

    if (value.elements === null) {
      return [value.element];
    }

    return [...value.elements].sort(treeOrderSorter);
  }
};
