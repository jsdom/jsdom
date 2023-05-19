"use strict";

const domSelector = require("@asamuzakjp/dom-selector");
const DOMException = require("domexception/webidl2js-wrapper");

exports.matchesDontThrow = (selectors, element) => {
  let matched;
  try {
    matched = domSelector.matches(selectors, element);
  } catch (e) {
    matched = false;
  }
  return matched;
};

exports.matches = (selectors, element, globalObject) => {
  let matched;
  try {
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

exports.closest = (selectors, element, globalObject) => {
  let matched;
  try {
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

exports.querySelector = (selectors, refPoint, globalObject) => {
  let matched;
  try {
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

exports.querySelectorAll = (selectors, refPoint, globalObject) => {
  const matched = [];
  try {
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
