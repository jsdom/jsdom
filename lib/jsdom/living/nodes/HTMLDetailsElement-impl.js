"use strict";

const { fireAnEvent } = require("../helpers/events");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLDetailsElementImpl extends HTMLElementImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._taskQueue = null;
  }

  _dispatchToggleEvent() {
    this._taskQueue = null;

    fireAnEvent("toggle", this);
  }

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && localName === "open" && this._taskQueue === null) {
      // Check that the attribute is added or removed, not merely changed
      if ((value !== oldValue && value !== null && oldValue === null) ||
          (value === null && oldValue !== null)) {
        this._taskQueue = this._globalObject._document._queueATask(() => this._dispatchToggleEvent());
      }
    }
  }
}

module.exports = {
  implementation: HTMLDetailsElementImpl
};
