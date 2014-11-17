var nwmatcher = require("nwmatcher/src/nwmatcher-noqsa");
var core = require("../level2/core").dom.level2.core;

function addNwmatcher(document) {
  if (!document._nwmatcher) {
    document._nwmatcher = nwmatcher({ document: document });
    document._nwmatcher.configure({ UNIQUE_ID: false });
  }
  return document._nwmatcher;
}

exports.applyQuerySelectorPrototype = function(dom) {
  dom.Document.prototype.querySelector = core.memoizeQuery(function(selector) {
    return addNwmatcher(this).first(selector, this);
  });

  dom.Document.prototype.querySelectorAll = core.memoizeQuery(function(selector) {
    return new dom.NodeList(addNwmatcher(this).select(String(selector), this));
  });

  dom.DocumentFragment.prototype.querySelector = core.memoizeQuery(function(selector) {
    return addNwmatcher(this.ownerDocument).first(selector, this);
  });

  dom.DocumentFragment.prototype.querySelectorAll = core.memoizeQuery(function(selector) {
    return new dom.NodeList(addNwmatcher(this.ownerDocument).select(selector, this));
  });

  dom.Element.prototype.querySelector = core.memoizeQuery(function(selector) {
    return addNwmatcher(this.ownerDocument).first(selector, this);
  });

  dom.Element.prototype.querySelectorAll = core.memoizeQuery(function(selector) {
    return new dom.NodeList(addNwmatcher(this.ownerDocument).select(selector, this));
  });

  dom.Element.prototype.matchesSelector = core.memoizeQuery(function(selector) {
    return addNwmatcher(this.ownerDocument).match(this, selector);
  });
};
