"use strict";
var path = require("path");

exports.toFileUrl = function (fileName) {
  // Beyond just the `path.resolve`, this is mostly for the benefit of Windows,
  // where we need to convert "\" to "/" and add an extra "/" prefix before the
  // drive letter.
  var pathname = path.resolve(process.cwd(), fileName).replace(/\\/g, "/");
  if (pathname[0] !== "/") {
    pathname = "/" + pathname;
  }

  return "file://" + pathname;
};

/**
 * Define a setter on an object
 *
 * This method replaces any existing setter but leaves getters in place.
 *
 * - `object` {Object} the object to define the setter on
 * - `property` {String} the name of the setter
 * - `setterFn` {Function} the setter
 */
exports.defineSetter = function defineSetter(object, property, setterFn) {
  var descriptor = Object.getOwnPropertyDescriptor(object, property) || {
    configurable: true,
    enumerable: true
  };

  descriptor.set = setterFn;

  Object.defineProperty(object, property, descriptor);
};

/**
 * Define a getter on an object
 *
 * This method replaces any existing getter but leaves setters in place.
 *
 * - `object` {Object} the object to define the getter on
 * - `property` {String} the name of the getter
 * - `getterFn` {Function} the getter
 */
exports.defineGetter = function defineGetter(object, property, getterFn) {
  var descriptor = Object.getOwnPropertyDescriptor(object, property) || {
    configurable: true,
    enumerable: true
  };

  descriptor.get = getterFn;

  Object.defineProperty(object, property, descriptor);
};

/**
 * Create an object with the given prototype
 *
 * Optionally augment the created object.
 *
 * - `prototype` {Object} the created object's prototype
 * - `[properties]` {Object} properties to attach to the created object
 */
exports.createFrom = function createFrom(prototype, properties) {
  properties = properties || {};

  var descriptors = {};
  Object.getOwnPropertyNames(properties).forEach(function (name) {
    descriptors[name] = Object.getOwnPropertyDescriptor(properties, name);
  });

  return Object.create(prototype, descriptors);
};

/**
 * Create an inheritance relationship between two classes
 *
 * Optionally augment the inherited prototype.
 *
 * - `Superclass` {Function} the inherited class
 * - `Subclass` {Function} the inheriting class
 * - `[properties]` {Object} properties to attach to the inherited prototype
 */
exports.inheritFrom = function inheritFrom(Superclass, Subclass, properties) {
  properties = properties || {};

  Object.defineProperty(properties, "constructor", {
    value: Subclass,
    writable: true,
    configurable: true
  });

  Subclass.prototype = exports.createFrom(Superclass.prototype, properties);
};

/**
 * Define a list of constants on a constructor and its .prototype
 * - `Constructor` {Function} the constructor to define the constants on
 * - `propertyMap` {Object}  key/value map of properties to define
 */
exports.addConstants = function addConstants(Constructor, propertyMap) {
  for (var property in propertyMap) {
    var value = propertyMap[property];
    addConstant(Constructor, property, value);
    addConstant(Constructor.prototype, property, value);
  }
};

function addConstant(object, property, value) {
  Object.defineProperty(object, property, {
    configurable: false,
    enumerable: true,
    value: value,
    writable: false
  });
}
