"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const LinkStyleImpl = require("./LinkStyle-impl").implementation;
const idlUtils = require("../generated/utils");
const resourceLoader = require("../../browser/resource-loader");
const fetchStylesheet = require("../helpers/stylesheets").fetchStylesheet;

class HTMLLinkElementImpl extends HTMLElementImpl {
  _attach() {
    const wrapper = idlUtils.wrapperForImpl(this);
    if (!/(?:[ \t\n\r\f]|^)stylesheet(?:[ \t\n\r\f]|$)/i.test(wrapper.rel)) {
      // rel is a space-separated list of tokens, and the original rel types
      // are case-insensitive.
      return;
    }
    if (this.href) {
      fetchStylesheet(this, this.href, this.sheet);
    }

    super._attach();
  }

  get _accept() {
    return "text/css,*/*;q=0.1";
  }

  get href() {
    return resourceLoader.resolveResourceUrl(this._ownerDocument, this.getAttribute("href"));
  }

  set href(value) {
    this.setAttribute("href", value);
  }
}

idlUtils.mixin(HTMLLinkElementImpl.prototype, LinkStyleImpl.prototype);

module.exports = {
  implementation: HTMLLinkElementImpl
};
