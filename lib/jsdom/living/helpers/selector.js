"use strict";

const selery = require("selery");
const idlUtils = require("../generated/utils");

exports.matchesDontThrow = (elImpl, selector) => {
  const document = elImpl._ownerDocument;
  if (!document._seleryDontThrow) {
    document._seleryDontThrow = selery;
  }
  let matched;
  try {
    document._seleryDontThrow.matches(idlUtils.wrapperForImpl(elImpl), selector);
  } catch (e) {
    matched = false;
  }
  return 
}
exports.addSelery = parentNode => {
  const document = parentNode._ownerDocument;
  if (!document._selery) {
    document._selery = selery;
  }
  return document._selery;
};
