"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const MouseEvent = require("../../../generated/idl/MouseEvent");
const { isLabelable, isDisabled, isInteractiveContent } = require("../helpers/form-controls");
const { fireAnEvent } = require("../helpers/events");
const { firstElementWithId } = require("../helpers/traversal");

function sendClickToAssociatedNode(node) {
  fireAnEvent("click", node, MouseEvent, {
    bubbles: true,
    cancelable: true,
    view: node.ownerDocument ? node.ownerDocument.defaultView : null,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    button: 0,
    detail: 1,
    relatedTarget: null
  });
}

class HTMLLabelElementImpl extends HTMLElementImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._hasActivationBehavior = true;
  }

  get control() {
    if (this.hasAttributeNS(null, "for")) {
      const forValue = this.getAttributeNS(null, "for");
      if (forValue === "") {
        return null;
      }
      const firstElement = firstElementWithId(this.getRootNode(), forValue);
      return firstElement !== null && isLabelable(firstElement) ? firstElement : null;
    }
    for (const descendant of this._descendants()) {
      if (isLabelable(descendant)) {
        return descendant;
      }
    }
    return null;
  }

  get form() {
    const node = this.control;
    if (node) {
      return node.form;
    }
    return null;
  }

  _activationBehavior(event) {
    // Check if the event's target is an inclusive descendant of any interactive content descendant of this <label>.
    // If so, do nothing.
    if (event.target && event.target !== this && this.contains(event.target)) {
      for (let ancestor = event.target; ancestor !== null; ancestor = ancestor.parentNode) {
        if (ancestor === this) {
          break;
        }
        if (isInteractiveContent(ancestor)) {
          return;
        }
      }
    }

    const node = this.control;
    if (node && !isDisabled(node)) {
      // Check if the control is an inclusive ancestor of the event's target (and has already received this event).
      // If so, do nothing.
      // See https://github.com/whatwg/html/issues/5415.
      if (event.target && node.contains(event.target)) {
        return;
      }

      sendClickToAssociatedNode(node);
    }
  }
}

module.exports = {
  implementation: HTMLLabelElementImpl
};
