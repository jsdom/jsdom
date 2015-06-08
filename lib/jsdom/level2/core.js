var core         = require("../level1/core");
var defineGetter = require('../utils').defineGetter;
var defineSetter = require('../utils').defineSetter;
var memoizeQuery = require('../utils').memoizeQuery;
var validateAndExtract = require('../living/helpers/validate-names').validateAndExtract;
var mapper = require("../utils").mapper;

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
