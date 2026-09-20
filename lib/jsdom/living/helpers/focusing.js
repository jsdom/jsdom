"use strict";
const FocusEvent = require("../../../generated/idl/FocusEvent.js");
const idlUtils = require("../../../generated/idl/utils.js");
const { isDisabled } = require("./form-controls.js");
const { firstChildWithLocalName } = require("./traversal");
const { createAnEvent } = require("./events");
const { HTML_NS, SVG_NS } = require("./namespaces");
const { isRenderedElement } = require("./svg/render");

const focusableFormElements = new Set(["input", "select", "textarea", "button"]);

// https://html.spec.whatwg.org/multipage/interaction.html#focusable-area, but also some of
// https://html.spec.whatwg.org/multipage/interaction.html#focusing-steps and some of
// https://svgwg.org/svg2-draft/interact.html#TermFocusable
exports.isFocusableAreaElement = elImpl => {
  // We implemented most of the suggested focusable elements found here:
  // https://html.spec.whatwg.org/multipage/interaction.html#tabindex-value
  // However, some suggested elements are not focusable in web browsers, as detailed here:
  // https://github.com/whatwg/html/issues/5490
  if (elImpl._namespaceURI === HTML_NS) {
    if (!elImpl._ownerDocument._defaultView) {
      return false;
    }

    if (!elImpl.isConnected) {
      return false;
    }

    // A tabindex cannot make disabled controls or hidden inputs focusable.
    if (focusableFormElements.has(elImpl._localName)) {
      if (elImpl._localName === "input" && elImpl.type === "hidden") {
        return false;
      }

      return !isDisabled(elImpl);
    }

    if (!Number.isNaN(parseInt(elImpl.getAttributeNS(null, "tabindex"), 10))) {
      return true;
    }

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

    if (elImpl.hasAttributeNS(null, "contenteditable")) {
      return true;
    }

    return false;

    // This does not check for a designMode Document as specified in
    // https://html.spec.whatwg.org/multipage/interaction.html#editing-host because the designMode
    // attribute is not implemented.
  }

  if (elImpl._namespaceURI === SVG_NS) {
    if (!Number.isNaN(parseInt(elImpl.getAttributeNS(null, "tabindex"), 10)) && isRenderedElement(elImpl)) {
      return true;
    }

    if (elImpl._localName === "a" && elImpl.hasAttributeNS(null, "href")) {
      return true;
    }

    return false;
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

// https://html.spec.whatwg.org/multipage/interaction.html#focusing-steps
exports.focusingSteps = target => {
  const document = target._ownerDocument;
  const oldTarget = document._lastFocusedElement;
  if (oldTarget === target) {
    return;
  }

  const oldChain = (oldTarget && oldTarget.nodeType === 1) ? getFocusChain(oldTarget) : [];
  const newChain = getFocusChain(target);

  focusUpdateSteps(document, oldChain, newChain, target);

  if (document.getSelection) {
    document.getSelection().collapse(target, 0);
  }
};

// https://html.spec.whatwg.org/multipage/interaction.html#unfocusing-steps
exports.unfocusingSteps = target => {
  const document = target._ownerDocument;
  if (document._lastFocusedElement !== target) {
    return;
  }

  const oldChain = getFocusChain(target);
  const newChain = [];

  focusUpdateSteps(document, oldChain, newChain, null);

  if (document.getSelection) {
    document.getSelection().empty();
  }
};

function getFocusChain(target) {
  const chain = [];
  let current = target;
  while (current) {
    chain.push(current);
    const root = current.getRootNode();
    if (root && root.nodeType === 11 && root.host) {
      current = root.host;
    } else if (root && root.nodeType === 9 && root._defaultView && root._defaultView._frameElement) {
      current = root._defaultView._frameElement;
    } else {
      current = null;
    }
  }
  return chain;
}

// https://html.spec.whatwg.org/multipage/interaction.html#focus-update-steps
function focusUpdateSteps(document, oldChain, newChain, newFocusTarget) {
  while (oldChain.length > 0 && newChain.length > 0) {
    const lastOld = oldChain.at(-1);
    const lastNew = newChain.at(-1);
    if (lastOld !== lastNew) {
      break;
    }

    oldChain.pop();
    newChain.pop();
  }

  document._lastFocusedElement = null;

  for (const entry of oldChain) {
    if (entry.nodeType === 1) {
      exports.fireFocusEventWithTargetAdjustment("blur", entry, newFocusTarget);
      exports.fireFocusEventWithTargetAdjustment("focusout", entry, newFocusTarget, { bubbles: true });
    }
  }

  if (document._lastFocusedElement !== null) {
    return;
  }

  if (newFocusTarget) {
    // TODO: jsdom does not yet implement Navigables and Top-level traversables.
    // We would set the top-level traversable's "hasFocus()" boolean to true here.

    document._lastFocusedElement = newFocusTarget;
  } else {
    document._lastFocusedElement = document.body || document.documentElement || null;
  }
  document._clearDOMSelector();

  for (let i = newChain.length - 1; i >= 0; i--) {
    const entry = newChain[i];
    if (entry.nodeType === 1) {
      const relatedTarget = oldChain.length > 0 ? oldChain[0] : null;
      exports.fireFocusEventWithTargetAdjustment("focus", entry, relatedTarget);
      exports.fireFocusEventWithTargetAdjustment("focusin", entry, relatedTarget, { bubbles: true });
    }
  }
}
