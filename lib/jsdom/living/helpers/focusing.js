"use strict";
const FocusEvent = require("../generated/FocusEvent.js");
const idlUtils = require("../generated/utils.js");
const { isDisabled } = require("./form-controls.js");
const { createAnEvent } = require("./events");
const { HTML_NS, SVG_NS } = require("./namespaces");
const { isRenderedElement } = require("./svg/render");
const { isShadowInclusiveAncestor } = require("./shadow-dom.js");
const { firstChildWithLocalName, depthFirstIterator } = require("./traversal.js");
const Document = require("../generated/Document.js");
const Node = require("../generated/Node.js");
const { ELEMENT_NODE } = require("../node-type.js");

const focusableFormElements = new Set(["input", "select", "textarea", "button"]);

function isClickFocusable(target) {
  return !Number.isNaN(parseInt(target.getAttributeNS(null, "tabindex")));
}

function isUnopenedDialog(target) {
  return target.localName === "dialog" && !target.hasAttributeNS(null, "open");
}

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

    if (isUnopenedDialog(elImpl)) {
      return false;
    }

    if (elImpl.hasAttributeNS(null, "hidden")) {
      return false;
    }

    if (isClickFocusable(elImpl)) {
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

    if (focusableFormElements.has(elImpl._localName) && !isDisabled(elImpl)) {
      if (elImpl._localName === "input" && elImpl.type === "hidden") {
        return false;
      }

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
    if (!Number.isNaN(parseInt(elImpl.getAttributeNS(null, "tabindex"))) && isRenderedElement(elImpl)) {
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

function isHTMLAreaElement(target) {
  return require("../generated/HTMLAreaElement.js").is(target); // circular dependency, lazy load
}

exports.getFocusableArea = (target, trigger = "other") => {
  if (isHTMLAreaElement(target)) {
    return firstAreaWithImg(target);
  }

  const first = firstFocusableArea(target);

  if (first) {
    return first;
  }

  if (Document.is(target)) {
    return target.viewport;
  }

  // if (isBrowsingContext(target)) {
  //   return target.activeDocument;
  // }

  // if (isBrowsingContextContainer(target) && target.browsingContext) {
  //   return target.browsingContext.activeDocument;
  // }

  if (target.shadowRoot && target.shadowRoot.delegatesFocus) {
    if (isShadowInclusiveAncestor(target, target._ownerDocument.activeElement)) {
      return null;
    }

    return exports.focusDelegate(target, trigger);
  }

  return null;
};

function firstAreaWithImg(parent) {
  const iterator = depthFirstIterator(parent, isUnopenedDialog);
  for (const child of iterator) {
    if (exports.isFocusableAreaElement(child) && firstChildWithLocalName(child, "img")) {
      return child;
    }
  }
  return null;
}

function firstFocusableArea(parent) {
  const iterator = depthFirstIterator(parent, isUnopenedDialog);
  for (const child of iterator) {
    if (exports.isFocusableAreaElement(child)) {
      return child;
    }
  }
  return null;
}

function autoFocusDelegate(target, trigger) {
  const iterator = depthFirstIterator(target, isUnopenedDialog);
  for (const child of iterator) {
    if (child.nodeType === ELEMENT_NODE && child.hasAttributeNS(null, "autofocus")) {
      if (child.hasAttributeNS(null, "hidden")) {
        continue;
      }

      let delegate = child;
      if (!exports.isFocusableAreaElement(delegate)) {
        delegate = exports.getFocusableArea(delegate);
      }

      if (!delegate) {
        continue;
      }

      if (!isClickFocusable(delegate) && trigger === "click") {
        continue;
      }

      return delegate;
    }
  }
  return null;
}

exports.focusDelegate = (target, trigger = "other") => {
  const delegate = autoFocusDelegate(target, trigger);

  if (delegate) {
    return delegate;
  }

  if (target.shadowRoot && !target.shadowRoot.delegatesFocus) {
    return null;
  }


  const parent = target.shadowRoot || target;

  for (const child of parent.children) {
    if (isUnopenedDialog(child)) {
      continue;
    }

    if (exports.isFocusableAreaElement(child)) {
      return child;
    }

    const childDelegate = exports.getFocusableArea(child, trigger);

    if (childDelegate) {
      return childDelegate;
    }
  }

  return null;
};

exports.focusingSteps = (target, fallback, trigger) => {
  if (!exports.isFocusableAreaElement(target)) {
    target = exports.getFocusableArea(target, trigger);
  }

  target ||= fallback;

  if (!target) {
    return;
  }

  // if (isBrowsingContextContainer(target) && target.browsingContext) {
  //   return target.browsingContext.activeDocument;
  // }

  if (exports.isFocusableAreaElement(target) && (Node.is(target) ? target : target.anchorNode)?.inert) {
    return;
  }

  if (target === target._ownerDocument.activeElement) {
    return;
  }

  target.focus();
};
