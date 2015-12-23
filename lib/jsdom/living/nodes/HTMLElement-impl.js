"use strict";

const ElementImpl = require("./Element-impl").implementation;
const MouseEvent = require("../generated/MouseEvent");

class HTMLElementImpl extends ElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._tabIndex = 0;
    this._eventDefaults = Object.create(null);

    this._settingCssText = false;

    this._style = new this._core.CSSStyleDeclaration(newCssText => {
      if (!this._settingCssText) {
        this.setAttribute("style", newCssText);
      }
    });
  }


  // Add default event behavior (click link to navigate, click button to submit
  // form, etc). We start by wrapping dispatchEvent so we can forward events to
  // the element"s _eventDefault function (only events that did not incur
  // preventDefault).
  dispatchEvent(event) {
    const outcome = super.dispatchEvent(event);

    if (!event.defaultPrevented &&
        event.target._eventDefaults[event.type] &&
        typeof event.target._eventDefaults[event.type] === "function") {
      event.target._eventDefaults[event.type](event);
    }
    return outcome;
  }
  getBoundingClientRect() {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    };
  }
  focus() {
    this._ownerDocument.activeElement = this;
  }
  blur() {
    this._ownerDocument.activeElement = this._ownerDocument.body;
  }
  click() {
    // https://html.spec.whatwg.org/multipage/interaction.html#dom-click
    // https://html.spec.whatwg.org/multipage/interaction.html#run-synthetic-click-activation-steps
    // Not completely spec compliant due to e.g. incomplete implementations of disabled for form controls, or no
    // implementation at all of isTrusted.

    if (this.disabled) {
      return false;
    }

    const event = MouseEvent.createImpl(["click", { bubbles: true, cancelable: true }], {});
    this.dispatchEvent(event);
  }

  get style() {
    return this._style;
  }
  set style(value) {
    this._style.cssText = value;
  }

  _attrModified(name, value, oldValue) {
    if (name === "style" && value !== oldValue && !this._settingCssText) {
      this._settingCssText = true;
      this._style.cssText = value;
      this._settingCssText = false;
    }

    super._attrModified.apply(this, arguments);
  }

  get tabIndex() {
    if (!this.hasAttribute("tabindex")) {
      return -1;
    }
    return parseInt(this.getAttribute("tabindex"));
  }

  set tabIndex(value) {
    this.setAttribute("tabIndex", String(value));
  }
  // TODO
}

module.exports = {
  implementation: HTMLElementImpl
};
