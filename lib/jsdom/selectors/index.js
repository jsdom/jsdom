var createSizzle = require("./sizzle");
exports.applyQuerySelector = function(doc, dom) {
  var addSizzle = function(document) {

    if (!document._sizzle) {
      document._sizzle = createSizzle(document);
    }
    return document._sizzle;
  };

  doc.querySelector = function(selector) {
    return addSizzle(this)(selector, this)[0];
  };

  doc.querySelectorAll = function(selector) {
    return new dom.NodeList(addSizzle(this)(selector, this));
  };

  var matchingSelector = false;
  doc.matchesSelector = function(selector) {
    matchingSelector = true;
    var matches = addSizzle(doc).matchesSelector(this, selector);
    matchingSelector = false;
    return matches;
  };

  var _createElement = doc.createElement;
  doc.createElement = function() {
      var element = _createElement.apply(this, arguments);

      element.querySelector = function(selector) {
        return addSizzle(this.ownerDocument)(selector, this)[0];
      };

      element.querySelectorAll = function(selector) {
        var el = this;
        if (!this.parentNode) {
          el = this.ownerDocument.createElement("div");
          el.appendChild(this);
        }
        return new dom.NodeList(addSizzle(this.ownerDocument)(selector, el.parentNode || el));
      };

      element.matchesSelector = function(selector) {
        if (!matchingSelector) { // prevent infinite loop
          return doc.matchesSelector.call(this, selector);
        }
        return false;
      };

      return element;
  };

};
