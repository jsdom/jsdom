var createSizzle = require("./sizzle");
exports.applyQuerySelectorPrototype = function(dom) {
  var addSizzle = function(document) {

    if (!document._sizzle) {
      document._sizzle = createSizzle(document);
    }
    return document._sizzle;
  };

  dom.Document.prototype.querySelector = function(selector) {
    return addSizzle(this)(selector, this)[0];
  };

  dom.Document.prototype.querySelectorAll = function(selector) {
    return new dom.NodeList(addSizzle(this)(selector, this));
  };

  dom.Element.prototype.querySelector = function(selector) {
    return addSizzle(this.ownerDocument)(selector, this)[0];
  };

  dom.Element.prototype.querySelectorAll = function(selector) {
    var el = this;
    if (!this.parentNode) {
      el = this.ownerDocument.createElement("div");
      el.appendChild(this);
    }
    return new dom.NodeList(addSizzle(this.ownerDocument)(selector, el.parentNode || el));
  };
};
