
var core = require(__dirname + "/../level1/core").dom.level1.core,
    sys  = require("sys");

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
  var document = new core.Document();
  document.namespaceURI = namespaceURI;
  document.qualifiedName = qualifiedName;
  document.doctype = doctype;
  document.ownerDocument = document;
  return document;
};

core.Node.prototype.__defineGetter__("ownerDocument", function() {
  return this._ownerDocument || null;
});

core.Node.prototype.isSupported = function(/* string */ feature, /* string */ version) {
  return this.ownerDocument && 
          this.ownerDocument.implementation && 
          this.ownerDocument.implementation.hasFeature(feature, version);
};

core.Node.prototype.__defineGetter__("namespaceURI", function() {
  return this._namespaceURI || null;
});

core.Node.prototype.__defineSetter__("namespaceURI", function(value) {
  this._namespaceURI = value;
});

core.Node.prototype.__defineGetter__("prefix", function() {
  return this._prefix || null;
});

core.Node.prototype.__defineSetter__("prefix", function(value) {

  if (value === "xml" && 
      this._namespaceURI !== "http://www.w3.org/XML/1998/namespace")
  {
    throw new core.DOMException(core.NAMESPACE_ERR);
  }
  this._prefix = value;
});

core.Node.prototype.__defineGetter__("localName", function() {
  return this._localName;
});

/* return boolean */
core.Node.prototype.hasAttributes = function() {
  return (this._attributes && this._attributes.length > 0);
};


core.NamedNodeMap.prototype.getNamedItemNS = function(/* string */ namespaceURI,
                                                      /* string */ localName)
{
  return this.getNamedItem(localName);
};

core.NamedNodeMap.prototype.setNamedItemNS = function(/* Node */ arg)
{
  if (arg.parentNode && arg.parentNode.nodeType === arg.ENTITY_NODE) {
    throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
  }
  
  return this.setNamedItem(arg);
};

core.NamedNodeMap.prototype.removeNamedItemNS = function(/*string */ namespaceURI,
                                                         /* string */ localName)
{
};

core.Attr.prototype.__defineGetter__("ownerElement", function() {

});

core.Node.prototype.__constructor__ = function (document, tagName) {
  this._attributes = null;
  this._ownerDocument = document;
  core.Node.call(this, document);
  this._nodeName = tagName;
  this._nodeType = this.ELEMENT_NODE;
  this._tagName = tagName;
};

core.Node.prototype.__defineSetter__("qualifiedName", function(qualifiedName) {
  qualifiedName       = qualifiedName || "";
  this._localName     = qualifiedName.split(":")[1] || null;
  this.prefix         = qualifiedName.split(":")[0] || null;
  this._qualifiedName = qualifiedName;
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

core.Element.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                         /* String */ localName)
{
   var queryFunction = function(child) {
     if (!child) {
       return false;
     }

     if (child.nodeType && 
         child.nodeType === core.Node.prototype.ENTITY_REFERENCE_NODE) 
     {
       child = child._entity;
     }

     if (child.namespaceURI === namespaceURI && localName === child.nodeName) {
       return true;
     }
     return false;
  };

    if (this.ownerDocument &&
        this.ownerDocument.implementation &&
        this.ownerDocument.implementation.hasFeature("DisableLiveLists"))
    {
      return core.mapDOMNodes(this, true, queryFunction);
    } else {
      return new core.LiveNodeList(this._document, this, queryFunction);
    }
};

core.Element.prototype.hasAttribute = function(/* string */name)
{
  if (!this.attributes()) {
    return false;
  }
  return this.attributes().exists(name);
};

core.Element.prototype.hasAttributeNS = function(/* string */namespaceURI, 
                                                 /* string */localName)
{
  if (!this._attributes        ||
      !this._attributes.length ||
      this._attributes.length < 1)
  {
    return false;
  }

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
  var element = this.createElement(qualifiedName);
  element.namespaceURI = namespaceURI;
  element.qualifiedName = qualifiedName;
  return element;
};

core.Document.prototype.createAttributeNS = function(/* string */ namespaceURI, 
                                                     /* string */ qualifiedName)
{
  var attribute = this.createAttribute(qualifiedName);
  attribute.qualifiedName = qualifiedName;
  attribute.namespaceURI = namespaceURI;
  return attribute;
};

//core.Document.prototype.getElementById = function(/* string */ elementId)
//{

//};

exports.dom =
{
  level2 : {
    core : core
  }
};



