
var core = require(__dirname + "/../level1/core").dom.level1.core,
    sys  = require("sys");

var testNamespaceName = function(ns, nsuri) {
  if (!ns || 
      ns.match(/[^0-9a-z\.:\-_]/i) !== null) {
    throw new core.DOMException(core.INVALID_CHARACTER_ERR);
  }
  var containsColon = (ns.indexOf(":") > -1), 
      exploded      =  ns.split(":");
  
  if (exploded.length > 1) {
    ns = exploded[0];
  }

  if ((ns === 'xmlns' && nsuri !== "http://www.w3.org/2000/xmlns/") || 
      (ns === "xml"   && nsuri !== "http://www.w3.org/XML/1998/namespace") ||
      (ns.indexOf('::') > -1 || nsuri === null) || 
      (containsColon && exploded.length < 2))
  {
    throw new core.DOMException(core.NAMESPACE_ERR);
  }
}

var INVALID_STATE_ERR        = core.INVALID_STATE_ERR        = 11;
var SYNTAX_ERR               = core.SYNTAX_ERR               = 12
var INVALID_MODIFICATION_ERR = core.INVALID_MODIFICATION_ERR = 13;
var NAMESPACE_ERR            = core.NAMESPACE_ERR            = 14;
var INVALID_ACCESS_ERR       = core.INVALID_ACCESS_ERR       = 15;

core.DOMImplementation.prototype.createDocumentType = function(/* String */ qualifiedName,
                                                               /* String */ publicId, 
                                                               /* String */ systemId)
{
  testNamespaceName(qualifiedName);

  var doctype = new core.DocumentType(this._ownerDocument, qualifiedName);
  doctype._publicId = publicId ? publicId : '';
  doctype._systemId = systemId ? systemId : '';
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
  testNamespaceName(qualifiedName, namespaceURI);

  if (doctype && doctype.ownerDocuemnt !== null) {
    throw new core.DOMException(core.WRONG_DOCUMENT_ERR);
  }

  var document = new core.Document();
  document.namespaceURI = namespaceURI;
  document.qualifiedName = qualifiedName;
  document.doctype = doctype;
  document._ownerDocument = document;
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
  testNamespaceName(value, this._namespaceURI);
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
  throw new core.DOMException(core.NOT_FOUND_ERR);
};

core.Attr.prototype.__defineGetter__("ownerElement", function() {
  return this._ownerElement || null;
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
  testNamespaceName(qualifiedName, this._namespaceURI);
  qualifiedName       = qualifiedName || "";
  this._localName     = qualifiedName.split(":")[1] || null;
  this.prefix         = qualifiedName.split(":")[0] || null;
  this._qualifiedName = qualifiedName;
});

core.Element.prototype._mapAttributes = function(fn) {

  if (this._attributes && this._attributes.length) {
    var ret = [], l = this._attributes.length, i = 0, attribute;
    for(i; i<l; i++) {
      attribute = this._attributes.item(i);
      if (fn && fn(attribute)) {
        ret.push(attribute);
      }
    }
    
    return ret;
  }
  return [];

};

core.Element.prototype.getAttributeNS = function(/* string */ namespaceURI,
                                                 /* string */ localName)
{

};

core.Element.prototype.setAttributeNS = function(/* string */ namespaceURI,
                                                 /* string */ qualifiedName,
                                                 /* string */ value)
{
  testNamespaceName(qualifiedName, namespaceURI);
  var attr = this.setAttribute(qualifiedName, value);
  attr.namespaceURI = namespaceURI;
  return attr;
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
  newAttr._ownerElement = this;
  return this.setAttributeNode(newAttr);
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
  return this.hasAttribute(localName);
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
  var newNode = importedNode.cloneNode(deep);
  newNode._ownerDocument = this;
  newNode._ownerElement = null;
  newNode._prefix = importedNode.prefix;
  newNode._localName = importedNode.localName;
  newNode._namespaceURI = importedNode.namespaceURI;
  return newNode;
};

core.Document.prototype.createElementNS = function(/* string */ namespaceURI, 
                                                   /* string */ qualifiedName)
{
  testNamespaceName(qualifiedName, namespaceURI);

  var element = this.createElement(qualifiedName);
  element.namespaceURI = namespaceURI;
  element.qualifiedName = qualifiedName;
  return element;
};

core.Document.prototype.createAttributeNS = function(/* string */ namespaceURI, 
                                                     /* string */ qualifiedName)
{
  testNamespaceName(qualifiedName, namespaceURI);

  var attribute = this.createAttribute(qualifiedName);
  attribute.qualifiedName = qualifiedName;
  attribute.namespaceURI = namespaceURI;
  return attribute;
};

core.Document.prototype.getElementById = function(id) {
  return core.mapDOMNodes(this, true, function(element) {
    if (element && element.getAttribute) {
      var elementId = element.getAttribute("id");
      if (elementId === id) {
        return true;
      }
    }
  })[0] || null;
};

exports.dom =
{
  level2 : {
    core : core
  }
};
