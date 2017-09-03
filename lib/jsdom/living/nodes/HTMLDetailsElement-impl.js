"use strict";

const Event = require("../generated/Event.js");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLDetailsElementImpl extends HTMLElementImpl {
  _dispatchToggleEvent() {
    const event = Event.createImpl(
      ["toggle",
      { bubbles: false, cancelable: false }],
      { isTrusted: true }
    );
    this._dispatch(event);
  }

  _attrModified(name, value, oldValue) {
    super._attrModified(name, value, oldValue);

    if (name === "open") {
      this._dispatchToggleEvent();
    }
  }
}

module.exports = {
  implementation: HTMLDetailsElementImpl
};
