"use strict";

const defineGetter = require("../utils").defineGetter;

module.exports = function (core) {
  // https://dom.spec.whatwg.org/#interface-parentnode
  // Note that ParentNode is a "NoInterfaceObject"

  const implementers = [core.Document, core.DocumentFragment, core.Element];
  const ELEMENT_NODE = core.Node.ELEMENT_NODE;

  implementers.forEach(function (Constructor) {
    defineGetter(Constructor.prototype, "children", function () {
      if (!this._childrenList) {
        const self = this;
        this._childrenList = new core.HTMLCollection(this, function () {
          return self._childNodes.filter(function (node) {
            return node.nodeType === ELEMENT_NODE;
          });
        });
      }
      this._childrenList._update();
      return this._childrenList;
    });

    defineGetter(Constructor.prototype, "firstElementChild", function () {
      for (let i = 0; i < this._childNodes.length; ++i) {
        const child = this._childNodes[i];
        if (child.nodeType === ELEMENT_NODE) {
          return child;
        }
      }

      return null;
    });

    defineGetter(Constructor.prototype, "lastElementChild", function () {
      for (let i = this._childNodes.length - 1; i >= 0; --i) {
        const child = this._childNodes[i];
        if (child.nodeType === ELEMENT_NODE) {
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
