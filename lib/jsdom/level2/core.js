var core         = require("../level1/core");
var defineGetter = require('../utils').defineGetter;
var defineSetter = require('../utils').defineSetter;
var memoizeQuery = require('../utils').memoizeQuery;
var validateAndExtract = require('../living/helpers/validate-names').validateAndExtract;
var mapper = require("../utils").mapper;
var visitTree = require("../utils").visitTree;

core.Element.prototype.getElementsByTagNameNS = memoizeQuery(function(/* String */ namespaceURI,
                                                         /* String */ localName)
{
  var nsPrefixCache = {};

  function filterByTagName(child) {
    var localMatch = child.localName === localName,
        nsMatch    = child.namespaceURI === namespaceURI;

    if ((localMatch || localName === "*") &&
        (nsMatch || namespaceURI === "*"))
    {
      if (child.nodeType === child.ELEMENT_NODE) {
        return true;
      }
    }
    return false;
  }

  return new core.NodeList(this.ownerDocument || this,
                           mapper(this, filterByTagName));
});

core.Document.prototype.importNode = function(/* Node */ importedNode,
                                              /* bool */ deep)
{
  if (importedNode && importedNode.nodeType) {
    if (importedNode.nodeType === this.DOCUMENT_NODE ||
        importedNode.nodeType === this.DOCUMENT_TYPE_NODE) {
      throw new core.DOMException(core.DOMException.NOT_SUPPORTED_ERR);
    }
  }

  var self = this,
      newNode = importedNode.cloneNode(deep, function(a, b) {
        b._prefix        = a._prefix;
        b._namespaceURI  = a._namespaceURI;
        b._localName     = a._localName;
      });

  function lastChance(el) {
    var attr, defaultEl, i, len;

    el._ownerDocument = self;
    if (el.id) {
      if (!self._ids) {self._ids = {};}
      if (!self._ids[el.id]) {self._ids[el.id] = [];}
      self._ids[el.id].push(el);
    }
    if (el._attributes) {
      for (i=0,len=el._attributes.length; i < len; i++) {
        attr = el._attributes[i];
        attr._ownerDocument = self;
      }
    }
  }

  if (deep) {
    visitTree(newNode, lastChance);
  }
  else {
    lastChance(newNode);
  }

  return newNode;
};

core.Document.prototype.createElementNS = function (namespace, qualifiedName) {
  namespace = namespace !== null ? String(namespace) : namespace;
  qualifiedName = String(qualifiedName);

  var extracted = validateAndExtract(namespace, qualifiedName);
  var element = this.createElement(extracted.localName);
  element._namespaceURI = extracted.namespace;
  element._prefix = extracted.prefix;

  return element;
};

core.Document.prototype.createAttributeNS = function (namespace, qualifiedName) {
  namespace = namespace !== null ? String(namespace) : namespace;
  qualifiedName = String(qualifiedName);

  var extracted = validateAndExtract(namespace, qualifiedName);
  attribute = this.createAttribute(extracted.qualifiedName);

  attribute._namespaceURI = extracted.namespace;
  attribute._prefix = extracted.prefix;
  attribute._localName = extracted.localName;
  attribute._name = extracted.qualifiedName;

  return attribute;
};

core.Document.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                          /* String */ localName)
{
  return core.Element.prototype.getElementsByTagNameNS.call(this,
                                                            namespaceURI,
                                                            localName);
};

core.Document.prototype.getElementById = function(id) {
  // return the first element
  return (this._ids && this._ids[id] && this._ids[id].length > 0 ? this._ids[id][0] : null);
};
