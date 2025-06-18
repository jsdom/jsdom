"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLDialogElementImpl extends HTMLElementImpl {
  // NOTE: This is a basic implementation of the open/close functionality
  // for HTMLDialogElement. It does not include all the features of the spec.
  constructor(args, privateData) {
    super(args, privateData);
    this._isOpen = false;
    this._isModal = false;
    this._returnValue = "";
    this._closedBy = "";
    this._previouslyFocusedElement = null;
  }

  get open() {
    return this._isOpen;
  }

  set open(value) {
    this._isOpen = Boolean(value);
    this.setAttributeNS(null, "open", this._isOpen ? "" : null);
    if (!this._isOpen) {
      this._isModal = false;
    }
  }

  get returnValue() {
    return this._returnValue;
  }

  set returnValue(value) {
    this._returnValue = String(value);
  }

  get closedBy() {
    return this._closedBy;
  }

  set closedBy(value) {
    const s = String(value);
    if (s === "any" || s === "closerequest" || s === "none") {
      this._closedBy = s;
    } else {
      this._closedBy = "auto";
    }
  }

  show() {
    if (this.open && !this._isModal) {
      return;
    }
    if (this.open) {
      throw new DOMException("The dialog is already open.", "InvalidStateError");
    }
    if (!this.dispatchEvent(new ToggleEvent("beforetoggle", {
      bubbles: true,
      cancelable: true,
      composed: true,
      oldState: "closed",
      newState: "open"
    }))) {
      return;
    }
    if (this.open) {
      return;
    }
    setTimeout(() => {
      this.dispatchEvent(new ToggleEvent("toggle", {
        bubbles: true,
        cancelable: false,
        composed: true,
        oldState: "closed",
        newState: "open"
      }));
    }, 0);
    this.setAttributeNS(null, "open", "");
    this._isOpen = true;
    if (this._ownerDocument._openDialogs === undefined) {
      this._ownerDocument._openDialogs = new Set();
    }
    if (this._ownerDocument._openDialogs.has(this)) {
      throw new DOMException("The dialog is already open.", "InvalidStateError");
    }
    this.ownerDocument._openDialogs.add(this);
    this._setCloseWatcher(this);
    this._previouslyFocusedElement = this.ownerDocument.activeElement;
    this._dialogFocusingSteps();
  }

  showModal(subject=null) {
    if (this.open && this._isModal) {
      return;
    }
    if (this.open) {
      throw new DOMException("The dialog is already open.", "InvalidStateError");
    }
    // if (!this._ownerDocument."is fully active") {
    //   throw new DOMException("The document is not fully active.", "InvalidStateError");
    // }
    if (!this.isConnected) {
      throw new DOMException("The dialog is not connected to the document.", "InvalidStateError");
    }
    // if (this."is in the popover showing state") {
    //   throw new DOMException("The dialog is already in the popover showing state.", "InvalidStateError");
    // }
    if (!this.dispatchEvent(new ToggleEvent("beforetoggle", {
      bubbles: true,
      cancelable: true,
      composed: true,
      oldState: "closed",
      newState: "open"
    }))) {
      return;
    }
    if (this.open) {
      return;
    }
    if (!this.isConnected) {
      return;
    }
    // if (this."is in the popover showing state") {
    //   return;
    // }
    setTimeout(() => {
      this.dispatchEvent(new ToggleEvent("toggle", {
        bubbles: true,
        cancelable: false,
        composed: true,
        oldState: "closed",
        newState: "open"
      }));
    }, 0);
    this.setAttributeNS(null, "open", "");
    this._isOpen = true;
    this._isModal = true;
    if (this._ownerDocument._openDialogs === undefined) {
      this._ownerDocument._openDialogs = new Set();
    }
    if (this._ownerDocument._openDialogs.has(this)) {
      throw new DOMException("The dialog is already open.", "InvalidStateError");
    }
    this._ownerDocument._openDialogs.add(this);
    // this._ownerDocument."blocked by modal dialog" = this;
    // if (!this._ownerDocument."top layer".contains(subject)) {
    //   this._ownerDocument."top layer".appendChild(subject);
    // }
    this._setCloseWatcher(subject);
    this._previouslyFocusedElement = this.ownerDocument.activeElement;
    // document = this._ownerDocument;
    // hideUntil = "topmost popover ancestor"(subject, document."showing auto popover list", null, false);
    // if (hideUntil == null) {
    //   hideUntil = document;
    // }
    // this._ownerDocument."hide all popovers until"(hideUntil);
    this._dialogFocusingSteps();
  }

  _setCloseWatcher() {
    // this._closeWatcher = this._establishCloseWatcher(this."relevant global object");
  }

  _establishCloseWatcher() {}

  _dialogFocusingSteps() {}

  close(result) {
    this.open = false;
    this._isModal = false;
    if (result !== undefined) {
      this.returnValue = result;
    } else {
      this.returnValue = null;
    }
    this.dispatchEvent(new Event("close", { bubbles: true, cancelable: false }));
  }

  requestClose() {
    if (this.dispatchEvent(new Event("cancel", { bubbles: true, cancelable: true }))) {
      this.close();
    }
    this.close();
  }
}

module.exports = {
  implementation: HTMLDialogElementImpl
};
