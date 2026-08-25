"use strict";

module.exports = class IterableWeakList {
  #refs = [];

  append(value) {
    this.#refs.push(new WeakRef(value));
  }

  clear() {
    this.#refs = [];
  }

  * [Symbol.iterator]() {
    const liveRefs = [];

    for (const ref of this.#refs) {
      const value = ref.deref();
      if (value !== undefined) {
        liveRefs.push(ref);
        yield value;
      }
    }

    this.#refs = liveRefs;
  }
};
