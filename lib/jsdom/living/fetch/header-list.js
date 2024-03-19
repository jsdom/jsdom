"use strict";

/**
 * Provides some utility functions for somewhat efficiently modifying a
 * collection of headers.
 *
 * Note that this class only operates on ByteStrings (which is also why we use
 * toLowerCase internally).
 */
class HeaderList {
  constructor() {
    this.headers = new Map();
  }

  append(name, value) {
    const existing = this.headers.get(name.toLowerCase());
    if (existing) {
      existing.push(value);
    } else {
      this.headers.set(name.toLowerCase(), [value]);
    }
  }

  contains(name) {
    return this.headers.has(name.toLowerCase());
  }

  get(name) {
    name = name.toLowerCase();
    const values = this.headers.get(name);
    if (!values) {
      return null;
    }
    return values;
  }

  delete(name) {
    this.headers.delete(name.toLowerCase());
  }

  set(name, value) {
    const lowerName = name.toLowerCase();
    this.headers.delete(lowerName);
    this.headers.set(lowerName, [value]);
  }

  sortAndCombine() {
    const names = [...this.headers.keys()].sort();
    return names.reduce((ret, n) => {
      if (n === "set-cookie") {
        this.get(n).forEach(v => {
          ret.push([n, v]);
        });
      } else {
        ret.push([n, this.get(n).join(", ")]);
      }
      return ret;
    }, []);
  }
}

module.exports = HeaderList;
