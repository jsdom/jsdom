"use strict";
const { domSymbolTree } = require("./living/helpers/internal-constants");
const SYMBOL_TREE_POSITION = require("symbol-tree").TreePosition;

/**
 * Define a set of properties on an object, by copying the property descriptors
 * from the original object.
 *
 * - `object` {Object} the target object
 * - `properties` {Object} the source from which to copy property descriptors
 */
exports.define = function define(object, properties) {
  for (const name of Object.getOwnPropertyNames(properties)) {
    const propDesc = Object.getOwnPropertyDescriptor(properties, name);
    Object.defineProperty(object, name, propDesc);
  }
};

exports.mixin = (target, source) => {
  const keys = Reflect.ownKeys(source);
  for (let i = 0; i < keys.length; ++i) {
    if (keys[i] in target) {
      continue;
    }

    Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
  }
};

exports.simultaneousIterators = function* (first, second) {
  for (;;) {
    const firstResult = first.next();
    const secondResult = second.next();

    if (firstResult.done && secondResult.done) {
      return;
    }

    yield [
      firstResult.done ? null : firstResult.value,
      secondResult.done ? null : secondResult.value
    ];
  }
};

exports.treeOrderSorter = function (a, b) {
  const compare = domSymbolTree.compareTreePosition(a, b);

  if (compare & SYMBOL_TREE_POSITION.PRECEDING) { // b is preceding a
    return 1;
  }

  if (compare & SYMBOL_TREE_POSITION.FOLLOWING) {
    return -1;
  }

  // disconnected or equal:
  return 0;
};

try {
  exports.Canvas = require("canvas");
} catch {
  exports.Canvas = null;
}
