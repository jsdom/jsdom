"use strict";

class GenerationalCache {
  #max;
  #boundary;
  #current;
  #old;

  constructor(max) {
    this.#current = new Map();
    this.#old = new Map();
    this.max = max;
  }

  get size() {
    return this.#current.size + this.#old.size;
  }

  get max() {
    return this.#max;
  }

  set max(value) {
    if (Number.isFinite(value) && value > 4) {
      this.#max = value;
      this.#boundary = Math.ceil(value / 2);
    } else {
      this.#max = 4;
      this.#boundary = 2;
    }
    this.clear();
  }

  get(key) {
    if (this.#current.has(key)) {
      return this.#current.get(key);
    }
    const value = this.#old.get(key);
    if (value !== undefined) {
      this.set(key, value);
    }
    return value;
  }

  set(key, value) {
    this.#current.set(key, value);
    if (this.#current.size >= this.#boundary) {
      this.#old = this.#current;
      this.#current = new Map();
    }
  }

  has(key) {
    return this.#current.has(key) || this.#old.has(key);
  }

  delete(key) {
    this.#current.delete(key);
    this.#old.delete(key);
  }

  clear() {
    this.#current.clear();
    this.#old.clear();
  }
}

exports.GenerationalCache = GenerationalCache;
