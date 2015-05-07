"use strict";

const defineGetter = require("../utils").defineGetter;

module.exports = function (core) {
  // https://dom.spec.whatwg.org/#nondocumenttypechildnode

  const implementers = [core.Element, core.CharacterData];

  implementers.forEach(function (Constructor) {
    defineGetter(Constructor.prototype, "nextElementSibling", function () {
      if (!this._parentNode) {
        return null;
      }

      let sibling = null;
      let index = this._parentNode._indexOf(this) + 1;
      while (index < this._parentNode._childNodes.length) {
        sibling = this._parentNode._childNodes[index];
        if (sibling.nodeType === core.Node.ELEMENT_NODE) {
          return sibling;
        }
        index++;
      }
      return null;
    });

    defineGetter(Constructor.prototype, "previousElementSibling", function () {
      if (!this._parentNode) {
        return null;
      }

      let sibling = null;
      let index = this._parentNode._indexOf(this) - 1;
      while (index !== -1) {
        sibling = this._parentNode._childNodes[index];
        if (sibling.nodeType === core.Node.ELEMENT_NODE) {
          return sibling;
        }
        index--;
      }
      return null;
    });
  });
};
