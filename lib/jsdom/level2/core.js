var core =  require("../level1/core").dom.level1.core;

var INVALID_STATE_ERR        = core.INVALID_STATE_ERR        = 11;
var SYNTAX_ERR               = core.SYNTAX_ERR               = 12
var INVALID_MODIFICATION_ERR = core.INVALID_MODIFICATION_ERR = 13;
var NAMESPACE_ERR            = core.NAMESPACE_ERR            = 14;
var INVALID_ACCESS_ERR       = core.INVALID_ACCESS_ERR       = 15;

core.DOMImplementation.prototype.createDocumentType = function(/* String */ qualifiedName,
                                                              /* String */ publicId, 
                                                              /* String */ systemId)
{
  
};

/**
  Creates an XML Document object of the specified type with its document element. 
  HTML-only DOM implementations do not need to implement this method.
*/
core.DOMImplementation.prototype.createDocument = function(/* String */       namespaceURI,
                                                           /* String */       qualifiedName,
                                                           /* DocumentType */ doctype)
{
  
  
};


core.Element.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                         /* String */ localName)
{
   var queryFunction = function(child) {f
      if (!child) {
        return false;
      }

      if (child.nodeType && 
          child.nodeType === dom.Node.prototype.ENTITY_REFERENCE_NODE) 
      {
        child = child._entity;
      }

      var classString = child.className;
      if (classString) {
        var s = classString.split(" ");
        for (var i=0; i<s.length; i++) {
          if (s[i] === className) {
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


core.Node.prototype.__defineGetter__("ownerDocument", function() {
  
});

core.Node.prototype.isSupported = function(/* string */ feature, /* string */ version) {
  
  
};

core.Node.prototype.__defineGetter__("namespaceURI", function() {
  
});

core.Node.prototype.__defineGetter__("prefix", function() {
  
});

core.Node.prototype.__defineSetter__("prefix", function() {
  throw new core.DOMException();
});

core.Node.prototype.__defineGetter__("localName", function() {
  
});

/* return boolean */
core.Node.prototype.hasAttributes = function() {
  
};


core.NamedNodeMap.prototype.getNamedItemNS = function(/* string */ namespaceURI,/* string */ localName) {

};

core.NamedNodeMap.prototype.setNamedItemNS = function(/* Node */ arg)  { // raises(DOMException)

};

core.NamedNodeMap.prototype.removeNamedItemNS = function(/*string */ namespaceURI, /* string */ localName) {
};

core.Attr.prototype.__defineGetter__("ownerElement", function() {

});
/*
  interface Element : Node {
    // Introduced in DOM Level 2:
    DOMString          getAttributeNS(in DOMString namespaceURI, in DOMString localName);
    // Introduced in DOM Level 2:
    void               setAttributeNS(in DOMString namespaceURI, 
                                      in DOMString qualifiedName, 
                                      in DOMString value)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    void               removeAttributeNS(in DOMString namespaceURI, 
                                         in DOMString localName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Attr               getAttributeNodeNS(in DOMString namespaceURI, 
                                          in DOMString localName);
    // Introduced in DOM Level 2:
    Attr               setAttributeNodeNS(in Attr newAttr)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    NodeList           getElementsByTagNameNS(in DOMString namespaceURI, 
                                              in DOMString localName);
    // Introduced in DOM Level 2:
    boolean            hasAttribute(in DOMString name);
    // Introduced in DOM Level 2:
    boolean            hasAttributeNS(in DOMString namespaceURI, 
                                      in DOMString localName);
  };

  interface DocumentType : Node {
    // Introduced in DOM Level 2:
    readonly attribute DOMString        publicId;
    // Introduced in DOM Level 2:
    readonly attribute DOMString        systemId;
    // Introduced in DOM Level 2:
    readonly attribute DOMString        internalSubset;
  };

  interface Document : Node {
    // Introduced in DOM Level 2:
    Node               importNode(in Node importedNode, 
                                  in boolean deep)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Element            createElementNS(in DOMString namespaceURI, 
                                       in DOMString qualifiedName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Attr               createAttributeNS(in DOMString namespaceURI, 
                                         in DOMString qualifiedName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    NodeList           getElementsByTagNameNS(in DOMString namespaceURI, 
                                              in DOMString localName);
    // Introduced in DOM Level 2:
    Element            getElementById(in DOMString elementId);
  };
};
*/

exports.dom = 
{
  level2 : {
    core : core
  }
};



