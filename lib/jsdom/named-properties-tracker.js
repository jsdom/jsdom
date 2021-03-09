"use strict";
// https://heycam.github.io/webidl/#idl-named-properties

const IS_NAMED_PROPERTY = Symbol("is named property");
const TRACKER = Symbol("named property tracker");

/**
 * @callback ResolverFunc
 * @param {object} object is identical to the `object` parameter of the `NamedPropertiesTracker`.
 * @param {string} name is the name of the property.
 * @param {function(): Set} values is a function that returns a Set with all the tracked values for this name.
 *        The order of these values is undefined.
 * @returns {object}
 */

/**
 * TODO: Convert this to use an object in the prototype chain of the Window:
 */
class NamedPropertiesTracker {
  /**
   * @param {Object} object
   * @param {Object} objectProxy
   * @param {ResolverFunc} resolverFunc
   */
  constructor(object, objectProxy, resolverFunc) {
    this.object = object;
    this.objectProxy = objectProxy;
    this.resolverFunc = resolverFunc;
    /** @type {Map<string, Set>} */
    this.trackedValues = new Map();
  }

  /**
   * Track a value (e.g. a Node) for a specified name.
   *
   * Values can be tracked eagerly, which means that not all tracked values *have* to appear in the output.
   * The resolver function that was passed to the output may filter the value.
   *
   * Tracking the same `name` and `value` pair multiple times has no effect
   *
   * @param {String} name
   * @param {Object} value
   */
  track(name, value) {
    if (name === undefined || name === null || name === "") {
      return;
    }

    let valueSet = this.trackedValues.get(name);
    if (!valueSet) {
      valueSet = new Set();
      this.trackedValues.set(name, valueSet);
    }

    valueSet.add(value);

    if (name in this.objectProxy) {
      // already added our getter or it is not a named property (e.g. "addEventListener")
      return;
    }

    const descriptor = newPropertyDescriptor(this, name);
    Object.defineProperty(this.object, name, descriptor);
  }

  /**
   * Stop tracking a previously tracked `name` & `value` pair, see track().
   *
   * Untracking the same `name` and `value` pair multiple times has no effect
   *
   * @param {String} name
   * @param {Object} value
   */
  untrack(name, value) {
    if (name === undefined || name === null || name === "") {
      return;
    }

    const valueSet = this.trackedValues.get(name);
    if (!valueSet) {
      // the value is not present
      return;
    }

    if (!valueSet.delete(value)) {
      // the value was not present
      return;
    }

    if (valueSet.size === 0) {
      this.trackedValues.delete(name);
    }

    if (valueSet.size > 0) {
      // other values for this name are still present
      return;
    }

    // at this point there are no more values, delete the property

    const descriptor = Object.getOwnPropertyDescriptor(this.object, name);

    if (!descriptor || !descriptor.get || descriptor.get[IS_NAMED_PROPERTY] !== true) {
      // Not defined by NamedPropertyTracker
      return;
    }

    delete this.object[name];
  }
}

/**
 * Create a new NamedPropertiesTracker for the given `object`.
 *
 * Named properties are used in DOM to let you lookup (for example) a Node by accessing a property on another object.
 * For example `window.foo` might resolve to an image element with id "foo".
 *
 * This tracker is a workaround because the ES6 Proxy feature is not yet available.
 *
 * @param {Object} object Object used to write properties to
 * @param {Object} objectProxy Object used to check if a property is already defined
 * @param {ResolverFunc} resolverFunc Each time a property is accessed, this function is called to determine
 *        the value of the property.
 *
 * @returns {NamedPropertiesTracker}
 */
exports.create = (object, objectProxy, resolverFunc) => {
  if (object[TRACKER]) {
    throw Error("A NamedPropertiesTracker has already been created for this object");
  }

  const tracker = new NamedPropertiesTracker(object, objectProxy, resolverFunc);
  object[TRACKER] = tracker;
  return tracker;
};

/**
 * @param {Object} object
 * @returns {NamedPropertiesTracker | null}
 */
exports.get = function (object) {
  if (!object) {
    return null;
  }

  return object[TRACKER] || null;
};

/**
 * @param {NamedPropertiesTracker} tracker
 * @param {string} name
 */
function newPropertyDescriptor(tracker, name) {
  const emptySet = new Set();

  function getValues() {
    return tracker.trackedValues.get(name) || emptySet;
  }

  const descriptor = {
    enumerable: true,
    configurable: true,
    get() {
      return tracker.resolverFunc(tracker.object, name, getValues);
    },
    set(value) {
      Object.defineProperty(tracker.object, name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
      });
    }
  };

  descriptor.get[IS_NAMED_PROPERTY] = true;
  descriptor.set[IS_NAMED_PROPERTY] = true;
  return descriptor;
}
