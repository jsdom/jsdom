


exports.browserAugmentation = function(dom) {

  /***************************************
  * Utility Functions                    *
  ***************************************/
  var stringifyElement = function(element) {
    var ret = {start:"", end:""};
    ret.start = "<" + element.tagName.toLowerCase();
    var attributes = [];
    var attribute = null;
    
    if (element.attributes.length) {
      ret.start += " ";
      for (var i=0; i<element.attributes.length; i++) 
      {
        attribute = element.attributes.item(i);
        attributes.push(attribute.name + '="' + attribute.nodeValue + '"');
      }
    }
    ret.start += attributes.join(" ") + ">";
    
    ret.end = "</" + element.tagName.toLowerCase() + ">";
    return ret;
  };

  var generateHtmlRecursive = function(element) {
    if (element          &&
        element.nodeType && 
        element.nodeType === dom.Node.prototype.ENTITY_REFERENCE_NODE) 
    {
      element = element._entity;
    }

    // TODO: Optimize me.
    var ret = "";
    switch (element.nodeType)
    {
      case dom.Node.prototype.ELEMENT_NODE:
        var current = stringifyElement(element);
        ret += current.start;

        if (element.childNodes.length > 0) {
          for (var i=0; i<element.childNodes.length; i++)
          {
             ret += generateHtmlRecursive(element.childNodes.item(i));  
          }
        } else {
          ret += (element.nodeValue) ? element.nodeValue : "" ;
        }
        ret += current.end;
      break;
      case dom.Node.prototype.TEXT_NODE:
        var sys = require("sys");
        sys.puts(sys.inspect(element));
        ret += element.nodeValue;
        
      break; 
    }      
    return ret;
  };


  /***************************************
  * Browser Augmentation                 *
  ***************************************/

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
  
  dom.Element.prototype.__defineGetter__('outerHTML', function() {
    return generateHtmlRecursive(this);
  });

  dom.Element.prototype.__defineGetter__('innerHTML', function() {
    var children = this.childNodes,
        length   = children.length,
        i        = 0,
        ret      = "",
        child;
    for (i;i<length;i++)
    {
      child = children.item(i);
      ret  += generateHtmlRecursive(this);      
    }
    return ret;
  });

  return dom;
}
