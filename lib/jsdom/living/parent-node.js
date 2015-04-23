"use strict";

const defineGetter = require("../utils").defineGetter;

module.exports = function (core) {
  // https://dom.spec.whatwg.org/#interface-parentnode
  // Note that ParentNode is a "NoInterfaceObject"

  const implementors = [core.Document, core.DocumentFragment, core.Element];
  const ELEMENT_NODE = core.Node.ELEMENT_NODE;

  implementors.forEach(function (Interface) {

    defineGetter(Interface.prototype, "children", function () {

      if (!this._childrenList) {
        const self = this;
        this._childrenList = new core.HTMLCollection(this, function () {
          return self._childNodes.filter(function (node) {
            return node.tagName;
          });
        });
      }
      this._childrenList._update();
      return this._childrenList;
    });

    defineGetter(Interface.prototype, "firstElementChild", function () {

      for (let i = 0; i < this._childNodes.length; ++i) {
        const child = this._childNodes[i];
        if (child.nodeType === ELEMENT_NODE) {
          return child;
        }
      }

      return null;
    });
  });
};
