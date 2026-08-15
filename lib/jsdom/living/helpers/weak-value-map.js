"use strict";

/**
 * A Map-like collection which holds its values weakly.
 */
module.exports = class WeakValueMap {
  #refMap = new Map();

  #finalizationRegistry = new FinalizationRegistry(({ key, ref }) => {
    // The key might have been assigned a newer value since this target died.
    if (this.#refMap.get(key) === ref) {
      this.#refMap.delete(key);
    }
  });

  set(key, value) {
    const previousRef = this.#refMap.get(key);
    if (previousRef !== undefined) {
      this.#finalizationRegistry.unregister(previousRef);
    }

    const ref = new WeakRef(value);
    this.#refMap.set(key, ref);
    this.#finalizationRegistry.register(value, { key, ref }, ref);

    return this;
  }

  get(key) {
    const ref = this.#refMap.get(key);
    if (ref === undefined) {
      return undefined;
    }

    const value = ref.deref();
    if (value === undefined) {
      // FinalizationRegistry callbacks are not guaranteed to run promptly, so
      // clean up opportunistically too.
      this.#refMap.delete(key);
      this.#finalizationRegistry.unregister(ref);
    }

    return value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    const ref = this.#refMap.get(key);
    if (ref === undefined) {
      return false;
    }

    this.#refMap.delete(key);
    this.#finalizationRegistry.unregister(ref);
    return true;
  }

  clear() {
    for (const ref of this.#refMap.values()) {
      this.#finalizationRegistry.unregister(ref);
    }

    this.#refMap.clear();
  }
};
