"use strict";

const domSelector = require("@asamuzakjp/dom-selector");
const { wrapperForImpl } = require("../generated/utils");

exports.matchesDontThrow = (selectors, elementImpl) => {
  const element = wrapperForImpl(elementImpl);
  try {
    return domSelector.matches(selectors, element);
  } catch {
    return false;
  }
};

exports.matches = (selectors, elementImpl) => {
  const element = wrapperForImpl(elementImpl);
  return domSelector.matches(selectors, element);
};

exports.closest = (selectors, elementImpl) => {
  const element = wrapperForImpl(elementImpl);
  return domSelector.closest(selectors, element);
};

exports.querySelector = (selectors, parentNodeImpl) => {
  const node = wrapperForImpl(parentNodeImpl);
  return domSelector.querySelector(selectors, node);
};

exports.querySelectorAll = (selectors, parentNodeImpl) => {
  const node = wrapperForImpl(parentNodeImpl);
  return domSelector.querySelectorAll(selectors, node);
};
