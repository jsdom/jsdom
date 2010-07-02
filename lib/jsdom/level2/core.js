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
	var doctype = new core.DocumentType(this._ownerDocument, qualifiedName);
	doctype.publicId = publicId ? publicId : '';
	doctype.systemId = systemId ? systemId : '';
	return doctype;
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


core.NamedNodeMap.prototype.getNamedItemNS = function(/* string */ namespaceURI,
                                                      /* string */ localName)
{

};

core.NamedNodeMap.prototype.setNamedItemNS = function(/* Node */ arg)
{

};

core.NamedNodeMap.prototype.removeNamedItemNS = function(/*string */ namespaceURI,
                                                         /* string */ localName)
{
};

core.Attr.prototype.__defineGetter__("ownerElement", function() {

});


core.Element.prototype.getAttributeNS = function(/* string */ namespaceURI,
                                                 /* string */ localName)
{

};

core.Element.prototype.setAttributeNS = function(/* string */ namespaceURI,
                                                 /* string */ qualifiedName,
                                                 /* string */ value)
{

};

core.Element.prototype.removeAttributeNS = function(/* string */ namespaceURI,
                                                    /* string */ localName)
{

};

core.Element.prototype.getAttributeNodeNS = function(/* string */ namespaceURI,
                                                     /* string */ localName)
{

};

core.Element.prototype.setAttributeNodeNS = function(/* Attr */ newAttr)
{

};

core.Element.prototype.getElementsByTagNameNS = function(/* string */ namespaceURI,
                                                         /* string */ localName)
{

};

core.Element.prototype.hasAttribute = function(/* string */name)
{

};

core.Element.prototype.hasAttributeNS = function(/* string */namespaceURI, 
                                                 /* string */localName)
{

};

core.DocumentType.prototype.__defineGetter__("publicId", function() {
  return this._publicId || "";
});

core.DocumentType.prototype.__defineGetter__("systemId", function() {
  return this._systemId || "";
});

core.DocumentType.prototype.__defineGetter__("internalSubset", function() {
  return this._internalSubset || "";
});

core.Document.prototype.importNode = function(/* Node */ importedNode, 
                                   /* bool */ deep)
{

};

core.Document.prototype.createElementNS = function(/* string */ namespaceURI, 
                                                   /* string */ qualifiedName)
{

};

core.Document.prototype.createAttributeNS = function(/* string */ namespaceURI, 
                                                     /* string */ qualifiedName)
{

};

core.Document.prototype.getElementsByTagNameNS = function(/* string */ namespaceURI, 
                                                          /* string */ localName)
{

};

core.Document.prototype.getElementById = function(/* string */ elementId)
{

};

exports.dom =
{
  level2 : {
    core : core
  }
};



