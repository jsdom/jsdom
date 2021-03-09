"use strict";

// This is a static function to improve memory usage when multiple
// `IterableWeakSet` instances are created, so that each `FinalizationRegistry`
// uses the same shared function:
function cleanup({ ref, set }) {
  set.delete(ref);
}

// An iterable WeakSet implementation inspired by the iterable WeakMap
// example code in the WeakRefs specification:
//
// @see https://github.com/tc39/proposal-weakrefs#iterable-weakmaps
module.exports = class IterableWeakSet {
  constructor() {
    this._refSet = new Set();
    this._refMap = new WeakMap();
    this._finalizationRegistry = new FinalizationRegistry(cleanup);
  }

  add(value) {
    if (!this._refMap.has(value)) {
      const ref = new WeakRef(value);
      this._refMap.set(value, ref);
      this._refSet.add(ref);
      this._finalizationRegistry.register(value, { ref, set: this._refSet }, ref);
    }

    return this;
  }

  delete(value) {
    const ref = this._refMap.get(value);
    if (!ref) {
      return false;
    }

    this._refMap.delete(value);
    this._refSet.delete(ref);
    this._finalizationRegistry.unregister(ref);
    return true;
  }

  has(value) {
    return this._refMap.has(value);
  }

  * [Symbol.iterator]() {
    for (const ref of this._refSet) {
      const value = ref.deref();
      if (value === undefined) {
        continue;
      }
      yield value;
    }
  }
};
