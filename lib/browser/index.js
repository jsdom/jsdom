
exports.browserAugmentation = function(dom) {


  dom.Element.prototype.__defineSetter__("className", function(class) {
    this.setAttribute("class", class);
  });
  
  dom.Element.prototype.__defineGetter__("className",function() {
    return this.getAttribute("class");
  });
  
  dom.Element.prototype.getElementsByClassName = function(class) {

    var queryFunction = function(child) {
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
    }
    
    if (this.ownerDocument && 
        this.ownerDocument.implementation && 
        this.ownerDocument.implementation.hasFeature("DisableLiveLists")) 
    {
      return dom.mapDOMNodes(this, true, queryFunction);
    } else {
      return new dom.LiveNodeList(this._document, this, queryFunction);
    }
  };

  dom.Element.prototype.__defineSetter__("id", function(id) {
    this.setAttribute("id", id);
  });
  
  dom.Element.prototype.__defineGetter__("id",function() {
    return this.getAttribute("id");
  });
  
  dom.Document.prototype.getElementById = function(id) {
    var results = dom.mapDOMNodes(this, true, function(child) {

      if (child          &&
          child.nodeType && 
          child.nodeType === dom.Node.prototype.ENTITY_REFERENCE_NODE) 
      {
        child = child._entity;
      }
      
      if (!child || !child.getAttribute) {
        return false;
      }
      
      var childId = child.getAttribute("id");
      if (id === childId) {
        return true;
      }  
      return false;      

    });
    
    return (results && results.length > 0) ? results[0] : null;
  };  

  return dom;
}
