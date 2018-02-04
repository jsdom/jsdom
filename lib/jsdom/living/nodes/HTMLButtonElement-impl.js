"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { closest } = require("../helpers/traversal");
const { isDisabled } = require("../helpers/form-controls");
const Event = require("../generated/Event");
const ValidityState = require("../generated/ValidityState");

class HTMLButtonElementImpl extends HTMLElementImpl {
  _activationBehavior() {
    const { form } = this;
    if (form) {
      if (this.type === "submit" && !isDisabled(this)) {
        form._doSubmit();
      }
    }
  }

  _getValue() {
    const valueAttr = this.getAttribute("value");
    return valueAttr === null ? "" : valueAttr;
  }

  get form() {
    return closest(this, "form");
  }

  get type() {
    const typeAttr = (this.getAttribute("type") || "").toLowerCase();
    switch (typeAttr) {
      case "submit":
      case "reset":
      case "button":
        return typeAttr;
      default:
        return "submit";
    }
  }

  set type(v) {
    v = String(v).toLowerCase();
    switch (v) {
      case "submit":
      case "reset":
      case "button":
        this.setAttribute("type", v);
        break;
      default:
        this.setAttribute("type", "submit");
        break;
    }
  }

  get willValidate() {
    return !isDisabled(this);
  }

  get validity() {
    if (!this._validity) {
      this._validity = ValidityState.createImpl({
        willValidate: () => this.willValidate,
        // Is a Boolean indicating the element's custom
        // validity message has been set to a non-empty string by
        // calling the element's setCustomValidity() method.
        customError: () => this._customValidityMessage != null &&
              this._customValidityMessage !== "",
      });
    }
    return this._validity;
  }

  checkValidity() {
    if (!this.willValidate) {
      return true;
    }
    const { validity } = this;
    if (!validity.valid) {
      this._dispatch(Event.createImpl(["invalid", { cancelable: false } ]));
    }
    return validity.valid;
  }

  setCustomValidity(message) {
    this._customValidityMessage = message;
  }

  reportValidity() {
    if (this.checkValidity()) {
      return true;
    }
    this._dispatch(Event.createImpl(["invalid", { cancelable: false }]));
    return false;
  }

  get validationMessage() {
    let message = "";
    const { validity } = this;
    if (!validity.valid) {
      if (validity.customError) {
        message = this._customValidityMessage;
      } else {
        message = "The input element does not satisfy its constraints";
      }
    }
    return message;
  }
}

module.exports = {
  implementation: HTMLButtonElementImpl
};
