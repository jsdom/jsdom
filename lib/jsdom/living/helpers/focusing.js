"use strict";
const nodeType = require("../node-type.js");
const FocusEvent = require("../generated/FocusEvent.js");
const idlUtils = require("../generated/utils.js");
const { isDisabled } = require("./form-controls.js");
const { firstChildWithLocalName } = require("./traversal");
const { createAnEvent } = require("./events");
const { HTML_NS } = require("./namespaces");

const focusableFormElements = new Set(["input", "select", "textarea", "button"]);

// https://html.spec.whatwg.org/multipage/interaction.html#focusable-area, but also some of
// https://html.spec.whatwg.org/multipage/interaction.html#focusing-steps: e.g., Documents are not actually focusable
// areas, but their viewports are, and the first step of the latter algorithm translates Documents to their viewports.
exports.isFocusableAreaElement = elImpl => {
  if (!elImpl._ownerDocument._defaultView && !elImpl._defaultView) {
    return false;
  }

  if (elImpl._nodeType === nodeType.DOCUMENT_NODE) {
    return true;
  }

  if (!Number.isNaN(parseInt(elImpl.getAttributeNS(null, "tabindex")))) {
    return true;
  }

  // We implemented most of the suggested focusable elements found here:
  // https://html.spec.whatwg.org/multipage/interaction.html#tabindex-value
  // However, some suggested elements are not focusable in web browsers, as detailed here:
  // https://github.com/whatwg/html/issues/5490
  if (elImpl._namespaceURI === HTML_NS) {
    if (elImpl._localName === "iframe") {
      return true;
    }

    if (elImpl._localName === "a" && elImpl.hasAttributeNS(null, "href")) {
      return true;
    }

    if (elImpl._localName === "summary" && elImpl.parentNode &&
        elImpl.parentNode._localName === "details" &&
        elImpl === firstChildWithLocalName(elImpl.parentNode, "summary")) {
      return true;
    }

    if (focusableFormElements.has(elImpl._localName) && !isDisabled(elImpl)) {
      if (elImpl._localName === "input" && elImpl.type === "hidden") {
        return false;
      }

      return true;
    }

    if (elImpl.hasAttributeNS(null, "contenteditable")) {
      return true;
    }
    // This does not check for a designMode Document as specified in
    // https://html.spec.whatwg.org/multipage/interaction.html#editing-host because the designMode
    // attribute is not implemented.
  }

  return false;
};

// https://html.spec.whatwg.org/multipage/interaction.html#fire-a-focus-event plus the steps of
// https://html.spec.whatwg.org/multipage/interaction.html#focus-update-steps that adjust Documents to Windows
// It's extended with the bubbles option to also handle focusin/focusout, which are "defined" in
// https://w3c.github.io/uievents/#event-type-focusin. See https://github.com/whatwg/html/issues/3514.
exports.fireFocusEventWithTargetAdjustment = (name, target, relatedTarget, { bubbles = false } = {}) => {
  if (target === null) {
    // E.g. firing blur with nothing previously focused.
    return;
  }

  const event = createAnEvent(name, target._globalObject, FocusEvent, {
    bubbles,
    composed: true,
    relatedTarget,
    view: target._ownerDocument._defaultView,
    detail: 0
  });

  if (target._defaultView) {
    target = idlUtils.implForWrapper(target._defaultView);
  }

  target._dispatch(event);
};
