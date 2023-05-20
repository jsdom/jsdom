"use strict";

const domSelector = require("@asamuzakjp/dom-selector");
const DOMException = require("domexception/webidl2js-wrapper");
const idlUtils = require("../generated/utils");

exports.matchesDontThrow = (selectors, elementImpl) => {
  let matched;
  try {
    const element = idlUtils.wrapperForImpl(elementImpl);
    matched = domSelector.matches(selectors, element);
  } catch (e) {
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
    // override global DOMException
    if (e instanceof globalThis.DOMException) {
      throw DOMException.create(globalObject, [e.message, e.name]);
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
    // override global DOMException
    if (e instanceof globalThis.DOMException) {
      throw DOMException.create(globalObject, [e.message, e.name]);
    } else {
      throw e;
    }
  }
  return matched;
};

exports.querySelector = (selectors, refPointImpl, globalObject) => {
  let matched;
  try {
    const refPoint = idlUtils.wrapperForImpl(refPointImpl);
    matched = domSelector.querySelector(selectors, refPoint);
  } catch (e) {
    // override global DOMException
    if (e instanceof globalThis.DOMException) {
      throw DOMException.create(globalObject, [e.message, e.name]);
    } else {
      throw e;
    }
  }
  return matched;
};

exports.querySelectorAll = (selectors, refPointImpl, globalObject) => {
  const matched = [];
  try {
    const refPoint = idlUtils.wrapperForImpl(refPointImpl);
    const arr = domSelector.querySelectorAll(selectors, refPoint);
    matched.push(...arr);
  } catch (e) {
    // override global DOMException
    if (e instanceof globalThis.DOMException) {
      throw DOMException.create(globalObject, [e.message, e.name]);
    } else {
      throw e;
    }
  }
  return matched;
};
