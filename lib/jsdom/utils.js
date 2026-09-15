"use strict";

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

try {
  exports.Canvas = require("canvas");
} catch {
  exports.Canvas = null;
}
