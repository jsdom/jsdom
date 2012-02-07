var Sizzle = require("./sizzle").Sizzle;
exports.applyQuerySelectorPrototype = function(dom) {
  dom.Document.prototype.querySelector = function(selector) {
    return Sizzle(selector, this)[0];
  };

  dom.Document.prototype.querySelectorAll = function(selector) {
    var self = this;
    return new dom.NodeList(self, function() {
      return Sizzle(selector, self);
    });
  };

  dom.Element.prototype.querySelector = function(selector) {
    return Sizzle(selector, this)[0];
  };

  dom.Element.prototype.querySelectorAll = function(selector) {
    var self = this;
    return new dom.NodeList(self.ownerDocument, function() {
      return Sizzle(selector, self);
    });
  };
};
