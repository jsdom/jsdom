"use strict";
// https://heycam.github.io/webidl/#idl-named-properties

const IS_NAMED_PROPERTY = Symbol();
const TRACKER = Symbol();

exports.create = function (object, resolverFunc) {
  if (object[TRACKER]) {
    throw Error("A NamedPropertiesTracker has already been created for this object");
  }

  const tracker = new NamedPropertiesTracker(object, resolverFunc);
  object[TRACKER] = tracker;
  return tracker;
};

exports.get = function (object) {
  if (!object) {
    return null;
  }

  return object[TRACKER] || null;
};

function NamedPropertiesTracker(object, resolverFunc) {
  this.object = object;
  this.resolverFunc = resolverFunc;
}

function newPropertyDescriptor(object, resolverFunc, name) {
  const descriptor = {
    enumerable: true,
    configurable: true,
    get: function () {
      return resolverFunc(object, name);
    },
    set: function (value) {
      Object.defineProperty(object, name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: value
      });
    }
  };

  descriptor.get[IS_NAMED_PROPERTY] = true;
  descriptor.set[IS_NAMED_PROPERTY] = true;
  return descriptor;
}

NamedPropertiesTracker.prototype.track = function (name) {
  if (name === undefined || name === null || name === "") {
    return;
  }

  if (name in this.object) {
    // already tracked or it is not a named property (e.g. "addEventListener")
    return;
  }

  const descriptor = newPropertyDescriptor(this.object, this.resolverFunc, name);
  Object.defineProperty(this.object, name, descriptor);
};

NamedPropertiesTracker.prototype.maybeUntrack = function (name) {
  if (name === undefined || name === null || name === "") {
    return;
  }

  const descriptor = Object.getOwnPropertyDescriptor(this.object, name);

  if (!descriptor || !descriptor.get || descriptor.get[IS_NAMED_PROPERTY] !== true) {
    // Not defined by NamedPropertyTracker
    return;
  }

  const value = this.object[name];
  if (value !== undefined) {
    // still associated with a value
    return;
  }

  // note: delete puts the object in dictionary mode.
  // if this turns out to be a performance issue, maybe add:
  // https://github.com/petkaantonov/bluebird/blob/3e36fc861ac5795193ba37935333eb6ef3716390/src/util.js#L177
  delete this.object[name];
};
