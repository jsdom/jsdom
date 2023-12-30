"use strict";
const DOMException = require("domexception/webidl2js-wrapper");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { fireAnEvent } = require("../helpers/events");
const { focusDelegate, focusingSteps } = require("../helpers/focusing");

const ALREADY_OPEN = "Failed to execute 'showModal' on 'HTMLDialogElement': " +
                    "The element already has an 'open' attribute, and therefore cannot be opened modally.";

const NOT_CONNECTED = "Failed to execute 'showModal' on 'HTMLDialogElement': " +
                      "The element is not in a Document.";

class HTMLDialogElementImpl extends HTMLElementImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._isModal = false;
    this.returnValue = "";
    this._previousFocusElement = null;
  }

  show() {
    if (this.hasAttributeNS(null, "open")) {
      return;
    }

    this.setAttributeNS(null, "open", "");

    this._previousFocusElement = this._ownerDocument.activeElement;

    this._dialogFocusSteps();
  }

  showModal() {
    if (this.hasAttributeNS(null, "open")) {
      throw DOMException.create(this._globalObject, [ALREADY_OPEN, "InvalidStateError"]);
    }

    if (!this.isConnected) {
      throw DOMException.create(this._globalObject, [NOT_CONNECTED, "InvalidStateError"]);
    }

    this.setAttributeNS(null, "open", "");
    this._isModal = true;

    this._ownerDocument._modalBlock(this);

    this._previousFocusElement = this._ownerDocument.activeElement;

    this._dialogFocusSteps();
  }

  _dialogFocusSteps() {
    if (this.inert) {
      return;
    }

    const control = focusDelegate(this) ?? this;

    focusingSteps(control);

    this._ownerDocument._autoFocusCandidates = [];
    this._ownerDocument._autoFocusProcessed = true;
  }

  close(result) {
    if (!this.hasAttributeNS(null, "open")) {
      return;
    }

    this.removeAttributeNS(null, "open");
    this._isModal = false;

    if (result !== undefined) {
      this.returnValue = result;
    }

    this._ownerDocument._modalUnblock(this);

    if (this._previousFocusElement) {
      const element = this._previousFocusElement;
      this._previousFocusElement = null;
      element.focus();
    }

    setTimeout(() => fireAnEvent("close", this, undefined), 0);
  }
}

module.exports = {
  implementation: HTMLDialogElementImpl
};
