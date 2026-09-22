"use strict";
const FocusEvent = require("../../../generated/idl/FocusEvent.js");
const idlUtils = require("../../../generated/idl/utils.js");
const { isDisabled } = require("./form-controls.js");
const { firstChildWithLocalName } = require("./traversal");
const { createAnEvent } = require("./events");
const { HTML_NS, SVG_NS } = require("./namespaces");
const { isRenderedElement } = require("./svg/render");
const NODE_TYPE = require("../node-type");

const focusableFormElements = new Set(["input", "select", "textarea", "button"]);

// https://html.spec.whatwg.org/multipage/interaction.html#focusable-area and
// https://svgwg.org/svg2-draft/interact.html#TermFocusable
exports.isFocusableAreaElement = elImpl => {
  // TODO: Exclude inert elements and shadow hosts whose shadow root has `delegatesFocus` set.
  // TODO: Account for HTML rendering, including relevant canvas fallback content and `display: contents`.
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

function isFocusableArea(target) {
  // jsdom represents a document's viewport with the document itself.
  if (target.nodeType === NODE_TYPE.DOCUMENT_NODE) {
    return target._defaultView !== null;
  }
  return exports.isFocusableAreaElement(target);
}

// https://html.spec.whatwg.org/multipage/interaction.html#get-the-focusable-area
// The optional `focusTrigger` parameter to this algorithm and the focusing steps is omitted until
// shadow roots support `delegatesFocus`.
function getFocusableArea(focusTarget) {
  // TODO: Resolve image-map shapes and scrollable regions once we have a layout model.

  const document = focusTarget._ownerDocument;
  if (focusTarget === document.documentElement) {
    return document._defaultView === null ? null : document;
  }

  // TODO: Resolve navigables to their active documents once we have a navigable model.

  if (focusTarget._contentDocument) {
    return focusTarget._contentDocument;
  }

  // TODO: Resolve shadow hosts with `delegatesFocus`.

  return null;
}

// https://html.spec.whatwg.org/multipage/interaction.html#focusing-steps
exports.focusingSteps = (newFocusTarget, fallbackTarget) => {
  if (!isFocusableArea(newFocusTarget)) {
    newFocusTarget = getFocusableArea(newFocusTarget);
  }

  if (newFocusTarget === null) {
    if (fallbackTarget === undefined) {
      return;
    }
    newFocusTarget = fallbackTarget;
  }

  if (newFocusTarget._contentDocument) {
    newFocusTarget = newFocusTarget._contentDocument;
  }

  // TODO: Return if the new focus target's DOM anchor is inert.

  const document = newFocusTarget._ownerDocument;
  const topDocument = getTopDocument(document);
  const oldTarget = getCurrentFocusTarget(topDocument);
  if (oldTarget === newFocusTarget) {
    return;
  }

  const oldChain = getFocusChain(oldTarget);
  const newChain = getFocusChain(newFocusTarget);

  focusUpdateSteps(oldChain, newChain, newFocusTarget);
};

// https://html.spec.whatwg.org/multipage/interaction.html#unfocusing-steps
exports.unfocusingSteps = oldFocusTarget => {
  // TODO: Resolve shadow hosts with `delegatesFocus` to the currently focused area when appropriate.
  // TODO: Return if the old focus target is inert.
  // TODO: Resolve image-map shapes and scrollable regions once we have a layout model.

  const document = oldFocusTarget._ownerDocument;
  const oldChain = getFocusChain(getCurrentFocusTarget(getTopDocument(document)));
  if (!oldChain.includes(oldFocusTarget)) {
    return;
  }

  if (!isFocusableArea(oldFocusTarget)) {
    return;
  }

  const topDocument = oldChain.at(-1);
  // TODO: Handle the alternative for a top-level traversable without system focus. jsdom does not model that state.
  exports.focusingSteps(topDocument);
};

function getTopDocument(document) {
  while (document._parentDocument) {
    document = document._parentDocument;
  }
  return document;
}

// https://html.spec.whatwg.org/multipage/interaction.html#currently-focused-area-of-a-top-level-traversable
function getCurrentFocusTarget(document) {
  // TODO: Return null if the top-level traversable does not have system focus.
  let target = document._lastFocusedElement;
  while (target && target._contentDocument) {
    document = target._contentDocument;
    target = document._lastFocusedElement;
  }
  return target || document;
}

// https://html.spec.whatwg.org/multipage/interaction.html#focus-chain
function getFocusChain(target) {
  const chain = [];
  if (target.nodeType === NODE_TYPE.ELEMENT_NODE) {
    chain.push(target);
  }

  // Documents also represent their viewports, so those two entries are collapsed into one.
  // TODO: Traverse navigable parents when jsdom has a navigable model; for now traverse their documents.
  // Shadow hosts receive retargeted events from dispatch; they are not entries in the focus chain.
  for (let document = target._ownerDocument; document; document = document._parentDocument) {
    chain.push(document);
  }
  return chain;
}

// https://html.spec.whatwg.org/multipage/interaction.html#focus-update-steps
function focusUpdateSteps(oldChain, newChain, newFocusTarget) {
  const topDocument = oldChain.at(-1);
  while (oldChain.length > 0 && newChain.length > 0 && oldChain.at(-1) === newChain.at(-1)) {
    oldChain.pop();
    newChain.pop();
  }

  // The spec does not describe when to clear the old focused area. Clear it before blur dispatch,
  // as required by the `activeElement` assertions in WPT's `focus-management/focus-events.html`.
  // See https://github.com/whatwg/html/issues/1569.
  for (const entry of oldChain) {
    const document = entry._ownerDocument;
    document._lastFocusedElement = null;
    document._clearDOMSelector();
    if (entry.nodeType === NODE_TYPE.DOCUMENT_NODE && document._parentDocument) {
      document._parentDocument._lastFocusedElement = null;
      document._parentDocument._clearDOMSelector();
    }
  }
  const focusDuringBlur = getCurrentFocusTarget(topDocument);

  for (const entry of oldChain) {
    // TODO: Commit uncommitted user edits and update user validity when user editing is implemented.
    const relatedTarget = entry === oldChain.at(-1) && entry.nodeType === NODE_TYPE.ELEMENT_NODE &&
      newChain.at(-1)?.nodeType === NODE_TYPE.ELEMENT_NODE ?
      newChain.at(-1) :
      null;
    exports.fireFocusEventWithTargetAdjustment("blur", entry, relatedTarget);
    if (entry.nodeType === NODE_TYPE.ELEMENT_NODE) {
      exports.fireFocusEventWithTargetAdjustment("focusout", entry, relatedTarget, { bubbles: true });
    }
  }

  // The spec omits this reentrancy check. A focus change from a blur listener takes precedence,
  // as required by WPT's `css/selectors/focus-within-focus-move.html` and implemented by browsers.
  // See https://github.com/whatwg/html/issues/12329 and, for related `:focus-within` state issues,
  // https://github.com/whatwg/html/issues/11835.
  if (getCurrentFocusTarget(topDocument) !== focusDuringBlur) {
    return;
  }

  // Apply jsdom's selection convention at the platform-specific focusing step, before focus events.
  if (newFocusTarget !== null && newFocusTarget.nodeType === NODE_TYPE.ELEMENT_NODE) {
    newFocusTarget._ownerDocument.getSelection().collapse(newFocusTarget, 0);
  }

  // A viewport can be the new target even when its Document was removed as a shared chain entry.
  if (newFocusTarget !== null && newFocusTarget.nodeType === NODE_TYPE.DOCUMENT_NODE) {
    newFocusTarget._lastFocusedElement = newFocusTarget;
    newFocusTarget._clearDOMSelector();
  }

  for (let i = newChain.length - 1; i >= 0; i--) {
    const entry = newChain[i];
    const document = entry._ownerDocument;
    if (isFocusableArea(entry) && document._lastFocusedElement !== entry) {
      // TODO: Set the navigation API's "focus changed during ongoing navigation" flag.
      document._lastFocusedElement = entry;
      document._clearDOMSelector();
    }
    // Reflect child-document focus in the parent until navigables have their own focus state.
    if (entry.nodeType === NODE_TYPE.DOCUMENT_NODE && document._parentDocument) {
      document._parentDocument._lastFocusedElement = document._defaultView._frameElement;
      document._parentDocument._clearDOMSelector();
    }

    const relatedTarget = entry === newChain.at(-1) && entry.nodeType === NODE_TYPE.ELEMENT_NODE &&
      oldChain.at(-1)?.nodeType === NODE_TYPE.ELEMENT_NODE ?
      oldChain.at(-1) :
      null;
    exports.fireFocusEventWithTargetAdjustment("focus", entry, relatedTarget);
    if (entry.nodeType === NODE_TYPE.ELEMENT_NODE) {
      exports.fireFocusEventWithTargetAdjustment("focusin", entry, relatedTarget, { bubbles: true });
    }

    // Likewise, do not overwrite a focus change made while dispatching the new chain's events.
    if (getCurrentFocusTarget(topDocument) !== entry) {
      return;
    }
  }
}
