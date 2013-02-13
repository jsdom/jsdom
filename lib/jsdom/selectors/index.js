var nwmatcher = require("nwmatcher/src/nwmatcher-noqsa");

function addNwmatcher(document) {
  if (!document._nwmatcher) {
    document._nwmatcher = nwmatcher({ document: document });
    document._nwmatcher.configure({ UNIQUE_ID: false });
  }
  return document._nwmatcher;
}

exports.applyQuerySelector = function(doc, dom) {
  doc.querySelector = function(selector) {
    return addNwmatcher(this).first(selector, this);
  };

  doc.querySelectorAll = function(selector) {
    return new dom.NodeList(addNwmatcher(this).select(selector, this));
  };

  var _createElement = doc.createElement;
  doc.createElement = function() {
      var element = _createElement.apply(this, arguments);

      element.querySelector = function(selector) {
        return addNwmatcher(this.ownerDocument).first(selector, this);
      };

      element.querySelectorAll = function(selector) {
        return new dom.NodeList(addNwmatcher(this.ownerDocument).select(selector, this));
      };

      element.matchesSelector = function(selector) {
        return addNwmatcher(this.ownerDocument).match(this, selector);
      };

      return element;
  };
};
