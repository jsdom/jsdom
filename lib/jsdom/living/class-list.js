"use strict";

var createDOMTokenList = require("./dom-token-list").createDOMTokenList;

exports.createClassList = function createClassList(el) {
  return createDOMTokenList(el, "class");
};
