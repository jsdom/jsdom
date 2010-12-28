var core = require("../level1/core").dom.level1.core,
    sys  = require("sys");

var testNamespaceName = function(ns, nsuri) {
  if (!ns) {
    throw new core.DOMException(core.INVALID_CHARACTER_ERR, "namespace is undefined");
  }
  if(ns.match(/[^0-9a-z\.:\-_]/i) !== null) {
    throw new core.DOMException(core.INVALID_CHARACTER_ERR, ns);
  }
  if ((ns === 'xmlns' && nsuri !== "http://www.w3.org/2000/xmlns/") ||
      (ns === "xml"   && nsuri !== "http://www.w3.org/XML/1998/namespace") ||
      ns.indexOf('::') > -1 ||
      nsuri === null ||
      ns[ns.length-1] === ':' || // handle "namespace:"
      ns[0] === ':' ||
      ns.match(/.+:.+:/))
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
  var doctype = new core.DocumentType(null, qualifiedName);
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

core.Node.prototype.isSupported = function(/* string */ feature,
                                           /* string */ version)
{
  return this._ownerDocument._implementation.hasFeature(feature, version);
};

core.Node.prototype._namespaceURI = null;
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
  if (this._prefix === "xmlns") {
    throw new core.DOMException(core.NAMESPACE_ERR);
  }
  testNamespaceName(value, this._namespaceURI);

  this._prefix = value;
});

core.Node.prototype.__defineGetter__("localName", function() {
  return this._localName || null;
});

/* return boolean */
core.Node.prototype.hasAttributes = function() {
  return (this._attributes && this._attributes.length > 0);
};


core.NamedNodeMap.prototype.getNamedItemNS = function(/* string */ namespaceURI,
                                                      /* string */ localName)
{
  var defaultNode = null;
  return this._map(function(item) {

    if (namespaceURI === item.namespaceURI)
    {
      if (item.localName === localName) {
        return true;
      }
    } else if (!namespaceURI && !defaultNode) {
      defaultNode = true;
      return true;
    }
    return false;
  })[0] || null;
};

core.AttrNodeMap.prototype.setNamedItem = function(/* Node */ arg) {
  if (arg.nodeType !== this._ownerDocument.ATTRIBUTE_NODE) {
    throw new core.DOMException(core.HIERARCHY_REQUEST_ERR);
  }

  return core.NamedNodeMap.prototype.setNamedItem.call(this, arg);
};

core.NamedNodeMap.prototype.setNamedItemNS = function(/* Node */ arg)
{
  var owner = this._ownerDocument;
  if (this.parentNode &&
      this.parentNode.parentNode &&
      this.parentNode.parentNode.nodeType === owner.ENTITY_NODE)
  {
    throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
  }

  if (arg.nodeType !== owner.ATTRIBUTE_NODE) {
    throw new core.DOMException(core.HIERARCHY_REQUEST_ERR);
  }

  if (arg.parentNode) {
    throw new core.DOMException(core.INUSE_ATTRIBUTE_ERR);
  }
  return this.setNamedItem(arg);
};

core.NamedNodeMap.prototype.removeNamedItemNS = function(/*string */ namespaceURI,
                                                         /* string */ localName)
{
  if (this.parentNode &&
      this.parentNode.parentNode &&
      this.parentNode.parentNode.nodeType === this._ownerDocument.ENTITY_NODE)
  {
    throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
  }

  throw new core.DOMException(core.NOT_FOUND_ERR);
};

core.Attr.prototype.__defineGetter__("ownerElement", function() {
  return this._ownerElement || null;
});

core.Node.prototype.__defineSetter__("qualifiedName", function(qualifiedName) {
  testNamespaceName(qualifiedName, this._namespaceURI);
  qualifiedName       = qualifiedName || "";
  this._localName     = qualifiedName.split(":")[1] || null;
  this.prefix         = qualifiedName.split(":")[0] || null;
  this._qualifiedName = qualifiedName;
});

core.NamedNodeMap.prototype._map = function(fn) {

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

core.Document.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                          /* String */ localName)
{
  var nsPrefixCache = {};
  
  function filterByTagName(child) {
    if (child.nodeType && child.nodeType === this.ENTITY_REFERENCE_NODE) {
      child = child._entity;
    }

    var localMatch = child.localName === localName,
        nsMatch    = child.namespaceURI === namespaceURI;
    if ((localMatch || localName === "*") &&
        (nsMatch || namespaceURI === "*"))
    {
      return true;
    }
    return false;
  }

  return new core.NodeList(this.ownerDocument || this, core.mapper(this, filterByTagName));
};

core.Element.prototype.getAttributeNS = function(/* string */ namespaceURI,
                                                 /* string */ localName)
{
  var attr = this._attributes._map(function(attr) {
    if (namespaceURI === attr.namespaceURI &&
        attr.localName === localName)
    {
      return true;
    }
  })[0];

  return (attr) ? attr.nodeValue : null;
};

core.Element.prototype.setAttributeNS = function(/* string */ namespaceURI,
                                                 /* string */ qualifiedName,
                                                 /* string */ value)
{

  testNamespaceName(qualifiedName, namespaceURI);

  if (qualifiedName.split(':').shift() === "xml" &&
      namespaceURI !== "http://www.w3.org/XML/1998/namespace")
  {
    throw new core.DOMException(core.NAMESPACE_ERR);
  }


  var attr = this.setAttribute(qualifiedName, value);
  attr.namespaceURI = namespaceURI;
  var s = qualifiedName.split(':');
  attr._localName = s.pop();
  attr._prefix = (s.length > 0) ? s.pop() : null;


  return attr;
};

core.Element.prototype.removeAttributeNS = function(/* string */ namespaceURI,
                                                    /* string */ localName)
{
  var qualifiedName = this._attributes._map(function(attr) {
    if (namespaceURI === attr.namespaceURI &&
        attr.localName === localName)
    {
      return true;
    }
  })[0] || null;
  return this.removeAttribute(qualifiedName);
};

core.Element.prototype.getAttributeNodeNS = function(/* string */ namespaceURI,
                                                     /* string */ localName)
{
  return this._attributes._map(function(attr) {
    if (namespaceURI === attr.namespaceURI &&
        attr.localName === localName)
    {
      return true;
    }
  })[0] || null;
};

core.Element.prototype.setAttributeNodeNS = function(/* Attr */ newAttr)
{
  if (newAttr.ownerElement) {
    throw new core.DOMException(core.INUSE_ATTRIBUTE_ERR);
  }

  newAttr._ownerElement = this;
  return this.setAttributeNode(newAttr);
};

core.Element.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                         /* String */ localName)
{
  var nsPrefixCache = {};
  
  function filterByTagName(child) {
    if (child.nodeType && child.nodeType === this.ENTITY_REFERENCE_NODE) {
      child = child._entity;
    }

    var localMatch = child.localName === localName,
        nsMatch    = child.namespaceURI === namespaceURI;
    if ((localMatch || localName === "*") &&
        (nsMatch || namespaceURI === "*"))
    {
      return true;
    }
    return false;
  }

  return new core.NodeList(this.ownerDocument || this, core.mapper(this, filterByTagName));
};

core.Element.prototype.hasAttribute = function(/* string */name)
{
  if (!this.attributes) {
    return false;
  }
  return this.attributes.exists(name);
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
  return this._internalSubset || null;
});

core.Document.prototype.importNode = function(/* Node */ importedNode,
                                              /* bool */ deep)
{
  if (importedNode && importedNode.nodeType) {
    if (importedNode.nodeType === this.DOCUMENT_NODE ||
        importedNode.nodeType === this.DOCUMENT_TYPE_NODE) {
      throw new core.DOMException(core.NOT_SUPPORTED_ERR);
    }
  }

  var self = this,
      newNode = importedNode.cloneNode(deep);

  function setOwnerDocument(el) {
    el._ownerDocument = self;
    if (el.id) {
      self._ids[el.id] = el;
    }
    if (el.attributes) {
      el.attributes._ownerDocument = self;
      for (var i=0,len=el.attributes.length; i < len; i++) {
        el.attributes.item(i)._ownerDocument = self;
      }
    }
  }
  if (deep) {
    core.visitTree(newNode, setOwnerDocument);
  }
  else {
    setOwnerDocument(newNode);
  }
  return newNode;
};

core.Document.prototype.createElementNS = function(/* string */ namespaceURI,
                                                   /* string */ qualifiedName)
{
  testNamespaceName(qualifiedName, namespaceURI);

  var element = this.createElement(qualifiedName),
      sploded = qualifiedName.split(':');

  element.namespaceURI = namespaceURI;
  element.qualifiedName = qualifiedName;

  element._localName = sploded.pop();

  if (sploded.length > 0) {
    element.prefix = sploded.pop();
  } else if (namespaceURI === "http://www.w3.org/2000/xmlns/") {
    element.prefix = "xmlns";
  } else if (namespaceURI === "http://www.w3.org/XML/1998/namespace") {
    element.prefix = "xml";
  }

  return element;
};

core.Document.prototype.createAttributeNS = function(/* string */ namespaceURI,
                                                     /* string */ qualifiedName)
{
  testNamespaceName(qualifiedName, namespaceURI);
  var attribute = this.createAttribute(qualifiedName);
  attribute.qualifiedName = qualifiedName;
  attribute.namespaceURI = namespaceURI;
  var s = qualifiedName.split(':');
  attribute._localName = s.pop();
  attribute._prefix = (s.length > 0) ? s.pop() : null;
  return attribute;
};

core.Document.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                          /* String */ localName)
{
  var nsPrefixCache = {};
  
  function filterByTagName(child) {
    if (child.nodeType && child.nodeType === this.ENTITY_REFERENCE_NODE) {
      child = child._entity;
    }

    var localMatch = child.localName === localName,
        nsMatch    = child.namespaceURI === namespaceURI;
    if ((localMatch || localName === "*") &&
        (nsMatch || namespaceURI === "*"))
    {
      return true;
    }
    return false;
  }

  return new core.NodeList(this.ownerDocument || this, core.mapper(this, filterByTagName));
};

core.Element.prototype.__defineSetter__("id", function(id) {
  this.setAttribute("id", id);
  id = this.getAttribute("id"); //Passed validation
  if (!this._ownerDocument._ids) {
      this._ownerDocument._ids = {};
  }
  if (id === '') {
      delete this._ownerDocument._ids[id];
  } else {
      this._ownerDocument._ids[id] = this;
  }
});

core.Element.prototype.__defineGetter__("id",function() {
  return this.getAttribute("id");
});

core.Document.prototype.getElementById = function(id) {
  return this._ids[id] || null;
};


exports.dom =
{
  level2 : {
    core : core
  }
};
