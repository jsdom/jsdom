"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { isConnected, descendantsByHTMLLocalNames } = require("../helpers/traversal");
const { domSymbolTree } = require("../helpers/internal-constants");
const HTMLCollection = require("../generated/HTMLCollection");
const notImplemented = require("../../browser/not-implemented");
const { reflectURLAttribute } = require("../../utils");

// http://www.whatwg.org/specs/web-apps/current-work/#category-listed
const listedElements = new Set(["button", "fieldset", "input", "keygen", "object", "select", "textarea"]);

const encTypes = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);

const methods = new Set([
  "get",
  "post",
  "dialog"
]);

class HTMLFormElementImpl extends HTMLElementImpl {
  _descendantAdded(parent, child) {
    const form = this;
    for (const el of domSymbolTree.treeIterator(child)) {
      if (typeof el._changedFormOwner === "function") {
        el._changedFormOwner(form);
      }
    }

    super._descendantAdded.apply(this, arguments);
  }

  _descendantRemoved(parent, child) {
    for (const el of domSymbolTree.treeIterator(child)) {
      if (typeof el._changedFormOwner === "function") {
        el._changedFormOwner(null);
      }
    }

    super._descendantRemoved.apply(this, arguments);
  }

  get elements() {
    return HTMLCollection.createImpl([], {
      element: this,
      query: () => descendantsByHTMLLocalNames(this, listedElements)
    });
  }

  get length() {
    return this.elements.length;
  }

  _doSubmit() {
    if (!isConnected(this)) {
      return;
    }
    const ev = this._ownerDocument.createEvent("HTMLEvents");
    ev.initEvent("submit", true, true);
    if (this.dispatchEvent(ev)) {
      this.submit();
    }
  }

  submit() {
    notImplemented("HTMLFormElement.prototype.submit", this._ownerDocument._defaultView);
  }

  reset() {
    for (const el of this.elements) {
      if (typeof el._formReset === "function") {
        el._formReset();
      }
    }
  }

  get method() {
    let method = this.getAttribute("method");
    if (method) {
      method = method.toLowerCase();
    }

    if (methods.has(method)) {
      return method;
    }
    return "get";
  }

  set method(V) {
    this.setAttribute("method", V);
  }

  get enctype() {
    let type = this.getAttribute("enctype");
    if (type) {
      type = type.toLowerCase();
    }

    if (encTypes.has(type)) {
      return type;
    }
    return "application/x-www-form-urlencoded";
  }

  set enctype(V) {
    this.setAttribute("enctype", V);
  }

  get action() {
    const attributeValue = this.getAttribute("action");
    if (attributeValue === null || attributeValue === "") {
      return this._ownerDocument.URL;
    }

    return reflectURLAttribute(this, "action");
  }

  set action(V) {
    this.setAttribute("action", V);
  }
}

module.exports = {
  implementation: HTMLFormElementImpl
};
