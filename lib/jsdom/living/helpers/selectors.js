"use strict";

const domSelector = require("@asamuzakjp/dom-selector");
const DOMException = require("../generated/DOMException");
const idlUtils = require("../generated/utils");

exports.matchesDontThrow = (selectors, elementImpl) => {
  let matched;
  try {
    const element = idlUtils.wrapperForImpl(elementImpl);
    matched = domSelector.matches(selectors, element);
  } catch {
    matched = false;
  }
  return matched;
};

exports.matches = (selectors, elementImpl, globalObject) => {
  let matched;
  try {
    const element = idlUtils.wrapperForImpl(elementImpl);
    matched = domSelector.matches(selectors, element);
  } catch (e) {
    if (e instanceof globalThis.DOMException &&
        !(e instanceof globalObject.DOMException)) {
      throw DOMException.create(globalObject, [e.message, e.name]);
    } else if (e instanceof globalThis.TypeError &&
               !(e instanceof globalObject.TypeError)) {
      throw new globalObject.TypeError(e.message);
    } else {
      throw e;
    }
  }
  return matched;
};

exports.closest = (selectors, elementImpl, globalObject) => {
  let matched;
  try {
    const element = idlUtils.wrapperForImpl(elementImpl);
    matched = domSelector.closest(selectors, element);
  } catch (e) {
    if (e instanceof globalThis.DOMException &&
        !(e instanceof globalObject.DOMException)) {
      throw DOMException.create(globalObject, [e.message, e.name]);
    } else if (e instanceof globalThis.TypeError &&
               !(e instanceof globalObject.TypeError)) {
      throw new globalObject.TypeError(e.message);
    } else {
      throw e;
    }
  }
  return matched;
};

exports.querySelector = (selectors, parentNodeImpl, globalObject) => {
  let matched;
  try {
    const node = idlUtils.wrapperForImpl(parentNodeImpl);
    matched = domSelector.querySelector(selectors, node);
  } catch (e) {
    if (e instanceof globalThis.DOMException &&
        !(e instanceof globalObject.DOMException)) {
      throw DOMException.create(globalObject, [e.message, e.name]);
    } else if (e instanceof globalThis.TypeError &&
               !(e instanceof globalObject.TypeError)) {
      throw new globalObject.TypeError(e.message);
    } else {
      throw e;
    }
  }
  return matched;
};

exports.querySelectorAll = (selectors, parentNodeImpl, globalObject) => {
  let matched;
  try {
    const node = idlUtils.wrapperForImpl(parentNodeImpl);
    matched = domSelector.querySelectorAll(selectors, node);
  } catch (e) {
    if (e instanceof globalThis.DOMException &&
        !(e instanceof globalObject.DOMException)) {
      throw DOMException.create(globalObject, [e.message, e.name]);
    } else if (e instanceof globalThis.TypeError &&
               !(e instanceof globalObject.TypeError)) {
      throw new globalObject.TypeError(e.message);
    } else {
      throw e;
    }
  }
  return matched;
};
