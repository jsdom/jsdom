"use strict";

const defineGetter = require("../utils").defineGetter;
const domSymbolTree = require("./helpers/internal-constants").domSymbolTree;

module.exports = function (core) {
  // https://dom.spec.whatwg.org/#nondocumenttypechildnode

  const implementers = [core.Element, core.CharacterData];

  implementers.forEach(function (Constructor) {
    defineGetter(Constructor.prototype, "nextElementSibling", function () {
      for (const sibling of domSymbolTree.nextSiblingsIterator(this)) {
        if (sibling.nodeType === core.Node.ELEMENT_NODE) {
          return sibling;
        }
      }
      return null;
    });

    defineGetter(Constructor.prototype, "previousElementSibling", function () {
      for (const sibling of domSymbolTree.previousSiblingsIterator(this)) {
        if (sibling.nodeType === core.Node.ELEMENT_NODE) {
          return sibling;
        }
      }
      return null;
    });
  });
};
