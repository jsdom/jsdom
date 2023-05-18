"use strict";

const domSelector = require("@asamuzakjp/dom-selector");
const DOMException = require("domexception/webidl2js-wrapper");

exports.matchesWithOutThrow = (selectors, context) => {
  let matched;
  try {
    matched = domSelector.matches(selectors, context);
  } catch (e) {
    matched = false;
  }
  return matched;
};

exports.matches = (selectors, context, globalObject) => {
  let matched;
  try {
    matched = domSelector.matches(selectors, context);
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

exports.closest = (selectors, context, globalObject) => {
  let matched;
  try {
    matched = domSelector.closest(selectors, context);
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

exports.querySelector = (selectors, context, globalObject) => {
  let matched;
  try {
    matched = domSelector.querySelector(selectors, context);
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

exports.querySelectorAll = (selectors, context, globalObject) => {
  const matched = [];
  try {
    const arr = domSelector.querySelectorAll(selectors, context);
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
