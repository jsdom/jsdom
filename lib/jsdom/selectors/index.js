var nwmatcher = require("nwmatcher/src/nwmatcher-noqsa");
var memoizeQuery = require("../utils").memoizeQuery;

function addNwmatcher(document) {
  if (!document._nwmatcher) {
    document._nwmatcher = nwmatcher({ document: document });
    document._nwmatcher.configure({ UNIQUE_ID: false });
  }
  return document._nwmatcher;
}

exports.applyQuerySelectorPrototype = function(dom) {
  dom.Document.prototype.querySelector = memoizeQuery(function(selector) {
    return addNwmatcher(this).first(selector, this);
  });

  dom.Document.prototype.querySelectorAll = memoizeQuery(function(selector) {
    return new dom.NodeList(addNwmatcher(this).select(String(selector), this));
  });

  dom.DocumentFragment.prototype.querySelector = memoizeQuery(function(selector) {
    return addNwmatcher(this.ownerDocument).first(selector, this);
  });

  dom.DocumentFragment.prototype.querySelectorAll = memoizeQuery(function(selector) {
    return new dom.NodeList(addNwmatcher(this.ownerDocument).select(selector, this));
  });

  dom.Element.prototype.querySelector = memoizeQuery(function(selector) {
    return addNwmatcher(this.ownerDocument).first(selector, this);
  });

  dom.Element.prototype.querySelectorAll = memoizeQuery(function(selector) {
    return new dom.NodeList(addNwmatcher(this.ownerDocument).select(selector, this));
  });

  dom.Element.prototype.matchesSelector = memoizeQuery(function(selector) {
    return addNwmatcher(this.ownerDocument).match(this, selector);
  });
};
