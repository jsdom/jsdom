
exports.browserAugmentation = function(dom) {


  dom.Element.prototype.__defineSetter__("className", function(class) {
    this.setAttribute("class", class);
  });
  
  dom.Element.prototype.__defineGetter__("className",function() {
    var attr = this.attributes.getNamedItem("class");

    if (attr) {

      return attr.nodeValue;
    }
    return "";
  });
  
  dom.Element.prototype.getElementsByClassName = function(class) {
    return new dom.LiveNodeList(this._document, this, function(child) {
      if (!child) {
        return false;
      }
      
      if (child.nodeType && 
          child.nodeType === dom.Node.prototype.ENTITY_REFERENCE_NODE) 
      {
        child = child._entity;
      }
      
      var className = child.className;
      if (className) {
        var s = className.split(" ");
        for (var i=0; i<s.length; i++) {
          if (s[i] === class) {
            return true;
          }
        }
      }  
      return false;      
    });
  };
  return dom;
}
