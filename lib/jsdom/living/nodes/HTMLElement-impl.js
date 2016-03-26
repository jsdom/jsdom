"use strict";

const ElementImpl = require("./Element-impl").implementation;
const MouseEvent = require("../generated/MouseEvent");

class HTMLElementImpl extends ElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._tabIndex = 0;

    this._settingCssText = false;
    this._clickInProgress = false;

    this._style = new this._core.CSSStyleDeclaration(newCssText => {
      if (!this._settingCssText) {
        this._settingCssText = true;
        this.setAttribute("style", newCssText);
        this._settingCssText = false;
      }
    });
  }

  // Add default event behavior (click link to navigate, click button to submit
  // form, etc). We start by wrapping dispatchEvent so we can forward events to
  // the element's default functions (only events that did not incur
  // preventDefault).
  dispatchEvent(event) {
    const outcome = super.dispatchEvent(event);

    if (event.type === "click") {
      callEventBehaviorHook(event, "_preClickActivationSteps");

      if (event.defaultPrevented) {
        callEventBehaviorHook(event, "_canceledActivationSteps");
      } else {
        callEventBehaviorHook(event, "_activationBehavior");
      }
    }

    return outcome;
  }

  focus() {
    this._ownerDocument._lastFocusedElement = this;
  }
  blur() {
    this._ownerDocument._lastFocusedElement = null;
  }
  click() {
    // https://html.spec.whatwg.org/multipage/interaction.html#dom-click
    // https://html.spec.whatwg.org/multipage/interaction.html#run-synthetic-click-activation-steps
    // Not completely spec compliant due to e.g. incomplete implementations of disabled for form controls, or no
    // implementation at all of isTrusted.

    if (this._clickInProgress) {
      return false;
    }

    this._clickInProgress = true;

    if (this.hasAttribute("disabled")) {
      return false;
    }

    const event = MouseEvent.createImpl(["click", { bubbles: true, cancelable: true }], {});

    // Run synthetic click activation steps. According to the spec,
    // this should not be calling dispatchEvent, but it matches browser behavior.
    // See: https://www.w3.org/Bugs/Public/show_bug.cgi?id=12230
    // See also: https://github.com/whatwg/html/issues/805
    this.dispatchEvent(event);


    this._clickInProgress = false;
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

  // TODO this should be [Reflect]able if we added default value support to webidl2js's [Reflect]
  get tabIndex() {
    if (!this.hasAttribute("tabindex")) {
      return -1;
    }
    return parseInt(this.getAttribute("tabindex"));
  }

  set tabIndex(value) {
    this.setAttribute("tabIndex", String(value));
  }
}

function callEventBehaviorHook(event, name) {
  if (event && event.target && typeof event.target[name] === "function") {
    event.target[name](event);
  }
}

module.exports = {
  implementation: HTMLElementImpl
};
