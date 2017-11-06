"use strict";

const idlUtils = require("../generated/utils");
const nwsapi = require("nwsapi"); // TODO: rename nwmatcher -> nwsapi everywhere
const DOMException = require("domexception");

// TODO: consider making this work, or getting nwsapi to switch to a different way of detecting XML documents
function dummyXMLDocument() { }

exports.matchesDontThrow = (elImpl, selector) => {
  const document = elImpl._ownerDocument;

  if (!document._nwmatcherDontThrow) {
    document._nwmatcherDontThrow = nwsapi({
      document,
      DOMException,
      XMLDocument: dummyXMLDocument
    });
    document._nwmatcherDontThrow.configure({ LOGERRORS: false, VERBOSITY: false, SVG_LCASE: true });
  }

  return document._nwmatcherDontThrow.match(selector, idlUtils.wrapperForImpl(elImpl));
};

// nwmatcher gets `document.documentElement` at creation-time, so we have to initialize lazily, since in the initial
// stages of Document initialization, there is no documentElement present yet.
exports.addNwmatcher = parentNode => {
  const document = parentNode._ownerDocument;

  if (!document._nwmatcher) {
    document._nwmatcher = nwsapi({
      document,
      DOMException,
      XMLDocument: dummyXMLDocument
    });
    document._nwmatcher.configure({ LOGERRORS: false, SVG_LCASE: true });
  }

  return document._nwmatcher;
};
