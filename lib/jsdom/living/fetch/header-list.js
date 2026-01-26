"use strict";

/**
 * Provides utility functions for efficiently managing a collection of headers. Corresponds to
 * https://fetch.spec.whatwg.org/#concept-header-list.
 *
 * Notably, unlike `Headers`, this allows retrieving the original casing of header names and does no normalization of
 * inputs, which is important for implementing `XMLHttpRequest`. See discussions on, e.g.,
 * https://github.com/whatwg/fetch/pull/476.
 *
 */
class HeaderList {
  // Note: we can use normal `toLowerCase()` in this class, instead of `asciiLowercase()`, because we assume all inputs
  // are byte strings.

  constructor() {
    // Internal storage: Map<lowercaseName, {name: originalName, values: Array<value>}>
    this._headers = new Map();
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-append
  append(name, value) {
    const lower = name.toLowerCase();
    const existing = this._headers.get(lower);
    if (existing) {
      existing.values.push(value);
    } else {
      this._headers.set(lower, { name, values: [value] });
    }
  }

  // https://fetch.spec.whatwg.org/#header-list-contains
  contains(name) {
    return this._headers.has(name.toLowerCase());
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-get
  get(name) {
    const entry = this._headers.get(name.toLowerCase());
    if (!entry) {
      return null;
    }
    return entry.values.join(", ");
  }

  // No corresponding spec algorithm, but equivalent to e.g. the steps used in
  // https://fetch.spec.whatwg.org/#dom-headers-getsetcookie.
  getAll(name) {
    const entry = this._headers.get(name.toLowerCase());
    if (!entry) {
      return null;
    }
    return entry.values;
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-delete
  delete(name) {
    this._headers.delete(name.toLowerCase());
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-set
  set(name, value) {
    const lower = name.toLowerCase();
    this._headers.set(lower, { name, values: [value] });
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-combine
  combine(name, value) {
    const lower = name.toLowerCase();
    const existing = this._headers.get(lower);
    if (existing) {
      existing.values[0] += ", " + value;
    } else {
      this._headers.set(lower, { name, values: [value] });
    }
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-sort-and-combine
  sortAndCombine() {
    const names = [...this._headers.keys()].sort();

    const headers = [];
    for (const name of names) {
      const { values } = this._headers.get(name);
      if (name === "set-cookie") {
        for (const value of values) {
          headers.push([name, value]);
        }
      } else {
        headers.push([name, values.join(", ")]);
      }
    }

    return headers;
  }

  /**
   * Yields [name, value] pairs for iteration.
   * Each header with multiple values yields multiple pairs.
   * Preserves original casing.
   */
  * [Symbol.iterator]() {
    for (const { name, values } of this._headers.values()) {
      for (const value of values) {
        yield [name, value];
      }
    }
  }

  /**
   * Returns an array of header names (with original casing) that are not in the given set.
   * @param {Set<string>} lowercaseNames - Set of lowercase header names to exclude
   */
  headerNamesNotIn(lowercaseNames) {
    const names = [];
    for (const [lowerName, { name }] of this._headers) {
      if (!lowercaseNames.has(lowerName)) {
        names.push(name);
      }
    }
    return names;
  }

  /**
   * Serializes the header list to an array of [name, value] pairs.
   * Preserves original casing and order of insertion.
   * Format: [[name1, value1], [name1, value2], [name2, value1], ...]
   */
  toJSON() {
    const result = [];
    for (const { name, values } of this._headers.values()) {
      for (const value of values) {
        result.push([name, value]);
      }
    }
    return result;
  }

  /**
   * Creates a HeaderList from an array of [name, value] pairs.
   * @param {Array<[string, string]>} arr - Array of [name, value] pairs
   */
  static fromJSON(arr) {
    const list = new HeaderList();
    for (const [name, value] of arr) {
      list.append(name, value);
    }
    return list;
  }

  /**
   * Creates a copy of this HeaderList.
   */
  clone() {
    return HeaderList.fromJSON(this.toJSON());
  }
}

module.exports = HeaderList;
