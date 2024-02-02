"use strict";

const nwsapi = require("nwsapi");
const domSelector = require("@asamuzakjp/dom-selector");
const idlUtils = require("../generated/utils");

function initNwsapi(node) {
  const { _globalObject, _ownerDocument } = node;

  return nwsapi({
    document: idlUtils.wrapperForImpl(_ownerDocument),
    DOMException: _globalObject.DOMException
  });
}

exports.matchesDontThrow = (elImpl, selector) => {
  if (filterSelector(selector)) {
    const document = elImpl._ownerDocument;

    if (!document._nwsapiDontThrow) {
      document._nwsapiDontThrow = initNwsapi(elImpl);
      document._nwsapiDontThrow.configure({
        LOGERRORS: false,
        VERBOSITY: false,
        IDS_DUPES: true,
        MIXEDCASE: true
      });
    }

    return document._nwsapiDontThrow.match(selector, idlUtils.wrapperForImpl(elImpl));
  }
  return domSelector.matches(selector, idlUtils.wrapperForImpl(elImpl), {
    noexcept: true
  });
};

// nwsapi gets `document.documentElement` at creation-time, so we have to initialize lazily, since in the initial
// stages of Document initialization, there is no documentElement present yet.
function addNwsapi(parentNode) {
  const document = parentNode._ownerDocument;

  if (!document._nwsapi) {
    document._nwsapi = initNwsapi(parentNode);
    document._nwsapi.configure({
      LOGERRORS: false,
      IDS_DUPES: true,
      MIXEDCASE: true
    });
  }

  return document._nwsapi;
}

exports.matches = (selector, elImpl) => {
  if (filterSelector(selector)) {
    const matcher = addNwsapi(elImpl);
    return matcher.match(selector, idlUtils.wrapperForImpl(elImpl));
  }
  return domSelector.matches(selector, idlUtils.wrapperForImpl(elImpl));
};

exports.closest = (selector, elImpl) => {
  if (filterSelector(selector)) {
    const matcher = addNwsapi(elImpl);
    return matcher.closest(selector, idlUtils.wrapperForImpl(elImpl));
  }
  return domSelector.closest(selector, idlUtils.wrapperForImpl(elImpl));
};

exports.querySelector = (selector, parentNode) => {
  if (filterSelector(selector)) {
    const matcher = addNwsapi(parentNode);
    return matcher.first(selector, idlUtils.wrapperForImpl(parentNode));
  }
  return domSelector.querySelector(selector, idlUtils.wrapperForImpl(parentNode));
};

exports.querySelectorAll = (selector, parentNode) => {
  if (filterSelector(selector)) {
    const matcher = addNwsapi(parentNode);
    return matcher.select(selector, idlUtils.wrapperForImpl(parentNode));
  }
  return domSelector.querySelectorAll(selector, idlUtils.wrapperForImpl(parentNode));
};

// Filter selector that nwsapi does not support or cannot handle correctly.
function filterSelector(selector = "") {
  // Filter :not(complex selector)
  // See https://drafts.csswg.org/selectors/#grammar
  // type selector: *, tag (non-ASCII characters excluded)
  // \*|[\da-z_-]+
  // subclass selector: attr, class, id, pseudo-class (pseudo-class functions excluded)
  // \[.+\]|[.#:][\da-z_-]+
  // compound selector:
  // (?:\*|[\da-z_-]+|(?:\*|[\da-z_-]+)?(?:\[.+\]|[.#:][\da-z_-]+)+)
  // :not() that only contains compound selectors:
  // :not\(\s*(?:${compound}(?:\s*,\s*${compound})*)\s*\)
  // eslint-disable-next-line max-len
  const onlyCompoundSelectorsInNot = /:not\(\s*(?:(?:\*|[\da-z_-]+|(?:\*|[\da-z_-]+)?(?:\[.+\]|[.#:][\da-z_-]+)+)(?:\s*,\s*(?:\*|[\da-z_-]+|(?:\*|[\da-z_-]+)?(?:\[.+\]|[.#:][\da-z_-]+)+))*)\s*\)/i;
  if (selector.includes(":not") && !onlyCompoundSelectorsInNot.test(selector)) {
    return false;
  }

  // Filter namespaced selector e.g. ns|E, pseudo-element e.g. ::slotted,
  // :indeterminate, :placeholder-shown, :scope,
  // :dir(), :lang(), :has(), :is(), :where(),
  // :nth-child(an+b of selector), :nth-last-child(an+b of selector),
  // :host, :host(), :host-context(),
  // [attr i], [attr s]
  // eslint-disable-next-line max-len
  return !/\||:(?::|indeterminate|placeholder|scope|dir|lang|has|is|where|nth-(?:last-)?child\(.+\sof.+\)|host)|\s[is]\s*\]/i.test(selector);
}
