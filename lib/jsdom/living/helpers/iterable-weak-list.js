"use strict";

module.exports = class IterableWeakList {
  #refs = new Set();

  #finalizationRegistry = new FinalizationRegistry(ref => {
    this.#refs.delete(ref);
  });

  append(value) {
    const ref = new WeakRef(value);
    this.#refs.add(ref);
    this.#finalizationRegistry.register(value, ref, ref);
  }

  clear() {
    for (const ref of this.#refs) {
      this.#finalizationRegistry.unregister(ref);
    }
    this.#refs.clear();
  }

  * [Symbol.iterator]() {
    for (const ref of this.#refs) {
      const value = ref.deref();
      if (value === undefined) {
        this.#refs.delete(ref);
        this.#finalizationRegistry.unregister(ref);
      } else {
        yield value;
      }
    }
  }
};
