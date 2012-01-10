var Sizzle = require("./sizzle").Sizzle;
exports.applyQuerySelectorPrototype = function(dom) {
  dom.Document.prototype.querySelector = function(selector) {
    return Sizzle(selector, this)[0];
  };

  dom.Document.prototype.querySelectorAll = function(selector) {
    return new dom.NodeList(Sizzle(selector, this));
  };

  dom.Element.prototype.querySelector = function(selector) {
    return Sizzle(selector, this)[0];
  };

  dom.Element.prototype.querySelectorAll = function(selector) {
    var el = this;
    if (!this.parentNode) {
      el = this.ownerDocument.createElement("div");
      el.appendChild(this);
    }
    return new dom.NodeList(Sizzle(selector, el.parentNode || el));
  };
};
