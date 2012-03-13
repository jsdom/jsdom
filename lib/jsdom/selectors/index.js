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

  // @see http://ejohn.org/blog/thoughts-on-queryselectorall/
  dom.Element.prototype.querySelectorAll = function(selector) {
    var el = this;
    var topEl = el;
    var isInDocument = false;
    var context, rootEl;
    // Check whether this element is rooted in the document,
    // and determine what context should we use
    while (el = el.parentNode) {
        if (el === this.ownerDocument) {
            isInDocument = true;
            break;
        }
        topEl = el;
    }
    if (isInDocument) {
        context = this.ownerDocument;
    } else {
        // Add temporary parent element for topEl
        rootEl = this.ownerDocument.createElement('div');
        rootEl.appendChild(topEl);
        context = rootEl;
    }
    // Find all the elements that match the selector
    var nodes = addSizzle(this.ownerDocument)(selector, context);
    if (rootEl) {
        // Remove temporary parent element
        rootEl.removeChild(topEl);
        rootEl = null;
    }
    var base = this;
    // Filter out the elements that aren't descended from the base element
    return new dom.NodeList(nodes.filter(function(node){
        while (node = node.parentNode) {
            if (node === base) {
                return true;
            }
        }
        return false;
    }));
  };
};
