"use strict";
const FocusEvent = require("../generated/FocusEvent.js");
const idlUtils = require("../generated/utils.js");
const { domSymbolTree } = require("./internal-constants");
const { isDisabled } = require("./form-controls.js");
const { closest, firstChildWithLocalName } = require("./traversal");
const { createAnEvent } = require("./events");
const { HTML_NS, SVG_NS } = require("./namespaces");
const { isRenderedElement } = require("./svg/render");
const { getDeclarationForElement } = require("./style-rules");

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

    if (!Number.isNaN(parseInt(elImpl.getAttributeNS(null, "tabindex")))) {
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

// https://html.spec.whatwg.org/multipage/webappapis.html#focus-fixup-rule
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-disabled
// https://html.spec.whatwg.org/multipage/form-elements.html#attr-fieldset-disabled
// https://html.spec.whatwg.org/multipage/interaction.html#attr-hidden
// https://drafts.csswg.org/css-display/#propdef-display
// https://drafts.csswg.org/css-display/#visibility
// https://drafts.csswg.org/css-contain/#content-visibility
exports.focusFixup = (elImpl, opt = {}) => {
  const { attribute, event } = opt;
  const { _lastFocusedElement: lastFocused, body } = elImpl._ownerDocument;
  if (!lastFocused || lastFocused === body) {
    return;
  }
  let fixup;
  if (event) {
    if (event.type !== "click" || lastFocused === elImpl) {
      return;
    }
    fixup = true;
  } else if (attribute) {
    if (lastFocused === elImpl ||
        domSymbolTree.ancestorsToArray(lastFocused).includes(elImpl)) {
      switch (attribute.name) {
        case "disabled": {
          if ((focusableFormElements.has(elImpl._localName) ||
               /^(?:fieldset|opt(?:group|ion))$/.test(elImpl._localName)) &&
              (elImpl.disabled || elImpl.hasAttributeNS(null, "disabled"))) {
            fixup = true;
          }
          break;
        }
        case "hidden": {
          if (elImpl.hidden || elImpl.hasAttributeNS(null, "hidden")) {
            const { display } = elImpl._style._values;
            if (display === "none") {
              fixup = true;
            } else if (!display) {
              const { _importants, _values } = getDeclarationForElement(elImpl);
              const declaredDisplay = _importants.display || _values.display;
              if (declaredDisplay === "none") {
                fixup = true;
              }
            }
          }
          break;
        }
        case "style": {
          const {
            "content-visibility": contentVisibility, display, visibility
          } = elImpl._style._values;
          if (display === "none" ||
              /^(?:collapse|hidden)$/.test(visibility ?? "") ||
              (contentVisibility === "hidden" && lastFocused !== elImpl)) {
            fixup = true;
          }
          break;
        }
        default: {
          if (!exports.isFocusableAreaElement(lastFocused)) {
            fixup = true;
          }
        }
      }
    }
  } else if (elImpl._localName === "legend") {
    const legend = closest(lastFocused, "legend");
    if (!legend || legend === elImpl) {
      return;
    }
    const fieldset = domSymbolTree.parent(elImpl);
    if (fieldset === domSymbolTree.parent(legend) &&
        (fieldset.disabled || fieldset.hasAttributeNS(null, "disabled"))) {
      const firstLegend = firstChildWithLocalName(fieldset, "legend");
      if (firstLegend !== legend) {
        fixup = true;
      }
    }
  }
  if (fixup) {
    lastFocused.blur();
    elImpl._ownerDocument._lastFocusedElement = body;
  }
};
