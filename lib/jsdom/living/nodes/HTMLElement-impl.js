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
        this._settingCssText = true;
        this.setAttribute("style", newCssText);
        this._settingCssText = false;
      }
    });
  }


  // Add default event behavior (click link to navigate, click button to submit
  // form, etc). We start by wrapping dispatchEvent so we can forward events to
  // the element"s _eventDefault function (only events that did not incur
  // preventDefault).
  dispatchEvent(event) {
    const outcome = super.dispatchEvent(event);

    console.log('dispatchEvent', event.type)

    // 3:06 PM Domenic> jeffcarp: yes, although in theory per current spec I think dispatchEvent should not be calling those, so add a comment to that effect saying that this matches browser behavior but not the specs, and linking to https://www.w3.org/Bugs/Public/show_bug.cgi?id=12230

    // Run synthetic click activation steps
    if (!event.defaultPrevented && event.type === "click") {
      this.syntheticClickActivationSteps(event);
    }

/*
    if (!event.defaultPrevented &&
        event.target._eventDefaults[event.type] &&
        typeof event.target._eventDefaults[event.type] === "function") {
      event.target._eventDefaults[event.type](event);
    }
*/
    return outcome;
  }
  syntheticClickActivationSteps(event) {
    // TODO: If the element's click in progress flag is set to true, then abort these steps.

    // TODO: Set the click in progress flag on the element to true.

    if (event.target._preClickActivationSteps && 
        typeof event.target._preClickActivationSteps === "function") {
      event.target._preClickActivationSteps(event);
    }

    //Fire a click event at the element. If the run synthetic click activation steps algorithm was invoked because the click() method was invoked, then the isTrusted attribute must be initialised to false.
    if (event.target._activationBehavior && 
        typeof event.target._activationBehavior === "function") {
      event.target._activationBehavior(event);
    }

    // If this click event is not canceled, run post-click activation steps on the element.

    // If the event is canceled, the user agent must run canceled activation steps on the element instead.

    // Set the click in progress flag on the element to false.
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


    if (this.disabled) {
      return false;
    }

    const event = MouseEvent.createImpl(["click", { bubbles: true, cancelable: true }], {});

    // Run synthetic click activation steps. According to the spec, 
    // this should not be calling dispatchEvent, but it matches browser behavior.
    // 3:07 PM <Domenic> jeffcarp: hmm that will also require a comment in your implementation of https://html.spec.whatwg.org/multipage/interaction.html#run-synthetic-click-activation-steps saying that the pre-click activation steps and click behavior have been moved to dispatchEvent
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

module.exports = {
  implementation: HTMLElementImpl
};
