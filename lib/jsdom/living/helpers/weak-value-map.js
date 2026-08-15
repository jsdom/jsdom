"use strict";

/**
 * A Map-like collection which holds its values weakly.
 */
module.exports = class WeakValueMap {
  constructor() {
    this._refMap = new Map();

    this._finalizationRegistry = new FinalizationRegistry(({ key, ref }) => {
      // The key might have been assigned a newer value since this target died.
      if (this._refMap.get(key) === ref) {
        this._refMap.delete(key);
      }
    });
  }

  set(key, value) {
    const previousRef = this._refMap.get(key);
    if (previousRef !== undefined) {
      this._finalizationRegistry.unregister(previousRef);
    }

    const ref = new WeakRef(value);
    this._refMap.set(key, ref);
    this._finalizationRegistry.register(value, { key, ref }, ref);

    return this;
  }

  get(key) {
    const ref = this._refMap.get(key);
    if (ref === undefined) {
      return undefined;
    }

    const value = ref.deref();
    if (value === undefined) {
      // FinalizationRegistry callbacks are not guaranteed to run promptly, so
      // clean up opportunistically too.
      this._refMap.delete(key);
      this._finalizationRegistry.unregister(ref);
    }

    return value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    const ref = this._refMap.get(key);
    if (ref === undefined) {
      return false;
    }

    this._refMap.delete(key);
    this._finalizationRegistry.unregister(ref);
    return true;
  }

  clear() {
    for (const ref of this._refMap.values()) {
      this._finalizationRegistry.unregister(ref);
    }

    this._refMap.clear();
  }
};
