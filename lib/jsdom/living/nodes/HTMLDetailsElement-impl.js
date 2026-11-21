"use strict";

const { fireAnEvent } = require("../helpers/events");
const ToggleEvent = require("../../../generated/idl/ToggleEvent");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLDetailsElementImpl extends HTMLElementImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._detailsToggleTaskTracker = null;
  }

  // https://html.spec.whatwg.org/multipage/interactive-elements.html#queue-a-details-toggle-event-task
  _queueADetailsToggleEventTask(oldState, newState) {
    if (this._detailsToggleTaskTracker !== null) {
      oldState = this._detailsToggleTaskTracker.oldState;
      this._detailsToggleTaskTracker.controller.abort();
      this._detailsToggleTaskTracker = null;
    }

    const controller = new AbortController();
    this._globalObject._document._queueATask(
      () => {
        // Clear before dispatch to match browsers; the spec currently clears afterward.
        // https://github.com/whatwg/html/pull/13310
        this._detailsToggleTaskTracker = null;
        fireAnEvent("toggle", this, ToggleEvent, { oldState, newState });
      },
      { signal: controller.signal },
    );

    this._detailsToggleTaskTracker = { controller, oldState };
  }

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    // https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element
    if (namespace === null && localName === "open") {
      if (oldValue === null && value !== null) {
        this._queueADetailsToggleEventTask("closed", "open");
      } else if (oldValue !== null && value === null) {
        this._queueADetailsToggleEventTask("open", "closed");
      }
    }
  }
}

module.exports = {
  implementation: HTMLDetailsElementImpl,
};
