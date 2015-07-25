"use strict";

const defineGetter = require("../utils").defineGetter;
const domSymbolTree = require("../living/helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../living/node-type");

module.exports = function (core) {
  // https://dom.spec.whatwg.org/#interface-parentnode
  // Note that ParentNode is a "NoInterfaceObject"

  const implementers = [core.Document, core.DocumentFragment, core.Element];

  implementers.forEach(function (Constructor) {
    defineGetter(Constructor.prototype, "children", function () {
      if (!this._childrenList) {
        const self = this;
        this._childrenList = new core.HTMLCollection(this, function () {
          return domSymbolTree.childrenToArray(self, {filter: function (node) {
            return node.nodeType === NODE_TYPE.ELEMENT_NODE;
          }});
        });
      }
      this._childrenList._update();
      return this._childrenList;
    });

    defineGetter(Constructor.prototype, "firstElementChild", function () {
      for (const child of domSymbolTree.childrenIterator(this)) {
        if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
          return child;
        }
      }

      return null;
    });

    defineGetter(Constructor.prototype, "lastElementChild", function () {
      for (const child of domSymbolTree.childrenIterator(this, {reverse: true})) {
        if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
          return child;
        }
      }

      return null;
    });

    defineGetter(Constructor.prototype, "childElementCount", function () {
      return this.children.length;
    });
  });
};
