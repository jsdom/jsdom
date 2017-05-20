"use strict";
const idlUtils = require("../generated/utils");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const WindowEventHandlersImpl = require("./WindowEventHandlers-impl").implementation;

class HTMLFrameSetElementImpl extends HTMLElementImpl {
  constructor(...args) {
    super(...args);
    this._initWindowEvents();
  }

  _attrModified(name) {
    super._attrModified(...arguments);

    if (name.startsWith("on")) {
      this._windowEventChanged(name.substring(2));
    }
  }
}

idlUtils.mixin(HTMLFrameSetElementImpl.prototype, WindowEventHandlersImpl.prototype);

module.exports = {
  implementation: HTMLFrameSetElementImpl
};
