"use strict";

const domSelector = require("@asamuzakjp/dom-selector");

exports.addDomSelector = parentNode => {
  const document = parentNode._ownerDocument;

  if (!document._domSelector) {
    document._domSelector = domSelector;
  }

  return document._domSelector;
};
