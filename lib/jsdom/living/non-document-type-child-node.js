"use strict";

const defineGetter = require("../utils").defineGetter;

module.exports = function (core) {
  // https://dom.spec.whatwg.org/#nondocumenttypechildnode

  const implementers = [core.Element, core.CharacterData];

  implementers.forEach(function (Constructor) {
    defineGetter(Constructor.prototype, "nextElementSibling", function () {
      var element = this;
      if (!element._parentNode) {
        return null;
      }
      var sibling = null;
      var index = element._parentNode._indexOf(element) + 1;
      while (index < element._parentNode._childNodes.length) {
        sibling = element._parentNode._childNodes[index];
        if (sibling.nodeType === core.Node.ELEMENT_NODE) {
          return sibling;
        }
        index++;
      }
      return null;
    });

    defineGetter(Constructor.prototype, "previousElementSibling", function () {
      var element = this;
      if (!element._parentNode) {
        return null;
      }
      var sibling = null;
      var index = element._parentNode._indexOf(element) - 1;
      while (index !== -1) {
        sibling = element._parentNode._childNodes[index];
        if (sibling.nodeType === core.Node.ELEMENT_NODE) {
          return sibling;
        }
        index--;
      }
      return null;
    });
  });
};
