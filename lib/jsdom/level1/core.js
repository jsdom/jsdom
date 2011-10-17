/*
  ServerJS Javascript DOM Level 1
*/
var core = {

  mapper: function(parent, filter, recursive) {
    return function() {
      return core.mapDOMNodes(parent, recursive !== false, filter);
    };
  },

  // Returns Array
  mapDOMNodes : function(parent, recursive, callback) {
    function visit(parent, result) {
      return parent.childNodes.toArray().reduce(reducer, result);
    }

    function reducer(array, child) {
      if (callback(child)) {
        array.push(child);
      }
      if (recursive && child._childNodes) {
        visit(child, array);
      }
      return array;
    }

    return visit(parent, []);
  },

  visitTree: function(root, callback) {
    var cur = root; // TODO: Unroll this.

    function visit(el) {
      if (el) {
        callback(el);
        if (el._childNodes) {
          var i        = 0,
              children = el._childNodes,
              l        = children.length;

          for (i; i<l; i++) {
            visit(children[i]);
          }
        }
      }
    }
    visit(root);
  },

  markTreeReadonly: function(node) {
    function markLevel(el) {
      el._readonly = true;
      // also mark attributes and their children read-only
      if (el.attributes) {
        var attributes = el.attributes, l = attributes.length, i=0;
        attributes._readonly = true;

        for (i; i<l; i++) {
          core.visitTree(attributes[i], markLevel);
        }
      }
    }

    core.visitTree(node, markLevel);
  }
};

// ExceptionCode
var INDEX_SIZE_ERR              = core.INDEX_SIZE_ERR              = 1,
    DOMSTRING_SIZE_ERR          = core.DOMSTRING_SIZE_ERR          = 2,
    HIERARCHY_REQUEST_ERR       = core.HIERARCHY_REQUEST_ERR       = 3,
    WRONG_DOCUMENT_ERR          = core.WRONG_DOCUMENT_ERR          = 4,
    INVALID_CHARACTER_ERR       = core.INVALID_CHARACTER_ERR       = 5,
    NO_DATA_ALLOWED_ERR         = core.NO_DATA_ALLOWED_ERR         = 6,
    NO_MODIFICATION_ALLOWED_ERR = core.NO_MODIFICATION_ALLOWED_ERR = 7,
    NOT_FOUND_ERR               = core.NOT_FOUND_ERR               = 8,
    NOT_SUPPORTED_ERR           = core.NOT_SUPPORTED_ERR           = 9,
    INUSE_ATTRIBUTE_ERR         = core.INUSE_ATTRIBUTE_ERR         = 10,

// Node Types
    ELEMENT_NODE                = 1,
    ATTRIBUTE_NODE              = 2,
    TEXT_NODE                   = 3,
    CDATA_SECTION_NODE          = 4,
    ENTITY_REFERENCE_NODE       = 5,
    ENTITY_NODE                 = 6,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE                = 8,
    DOCUMENT_NODE               = 9,
    DOCUMENT_TYPE_NODE          = 10,
    DOCUMENT_FRAGMENT_NODE      = 11,
    NOTATION_NODE               = 12;

var messages = core.exceptionMessages = { };
messages[INDEX_SIZE_ERR]              = "Index size error";
messages[DOMSTRING_SIZE_ERR]          = "DOMString size error";
messages[HIERARCHY_REQUEST_ERR]       = "Hierarchy request error";
messages[WRONG_DOCUMENT_ERR]          = "Wrong document";
messages[INVALID_CHARACTER_ERR]       = "Invalid character";
messages[NO_DATA_ALLOWED_ERR]         = "No data allowed";
messages[NO_MODIFICATION_ALLOWED_ERR] = "No modification allowed";
messages[NOT_FOUND_ERR]               = "Not found";
messages[NOT_SUPPORTED_ERR]           = "Not supported";
messages[INUSE_ATTRIBUTE_ERR]         = "Attribute in use";

core.DOMException = function(code, message) {
  this.code = code;
  Error.call(this, core.exceptionMessages[code]);
  this.message = core.exceptionMessages[code];
  if(message) this.message = this.message + ": " + message;
  if(Error.captureStackTrace) Error.captureStackTrace(this, core.DOMException);
};

core.DOMException.INDEX_SIZE_ERR              = INDEX_SIZE_ERR;
core.DOMException.DOMSTRING_SIZE_ERR          = DOMSTRING_SIZE_ERR;
core.DOMException.HIERARCHY_REQUEST_ERR       = HIERARCHY_REQUEST_ERR;
core.DOMException.WRONG_DOCUMENT_ERR          = WRONG_DOCUMENT_ERR;
core.DOMException.INVALID_CHARACTER_ERR       = INVALID_CHARACTER_ERR;
core.DOMException.NO_DATA_ALLOWED_ERR         = NO_DATA_ALLOWED_ERR;
core.DOMException.NO_MODIFICATION_ALLOWED_ERR = NO_MODIFICATION_ALLOWED_ERR;
core.DOMException.NOT_FOUND_ERR               = NOT_FOUND_ERR;
core.DOMException.NOT_SUPPORTED_ERR           = NOT_SUPPORTED_ERR;
core.DOMException.INUSE_ATTRIBUTE_ERR         = INUSE_ATTRIBUTE_ERR;

core.DOMException.prototype = {
  INDEX_SIZE_ERR              : INDEX_SIZE_ERR,
  DOMSTRING_SIZE_ERR          : DOMSTRING_SIZE_ERR,
  HIERARCHY_REQUEST_ERR       : HIERARCHY_REQUEST_ERR,
  WRONG_DOCUMENT_ERR          : WRONG_DOCUMENT_ERR,
  INVALID_CHARACTER_ERR       : INVALID_CHARACTER_ERR,
  NO_DATA_ALLOWED_ERR         : NO_DATA_ALLOWED_ERR,
  NO_MODIFICATION_ALLOWED_ERR : NO_MODIFICATION_ALLOWED_ERR,
  NOT_FOUND_ERR               : NOT_FOUND_ERR,
  NOT_SUPPORTED_ERR           : NOT_SUPPORTED_ERR,
  INUSE_ATTRIBUTE_ERR         : INUSE_ATTRIBUTE_ERR
};

core.DOMException.prototype.__proto__ = Error.prototype;

core.NodeList = function NodeList(element, query) {
  Object.defineProperties(this, {
    _element: {value: element},
    _query: {value: query},
    _snapshot: {writable: true},
    _length: {value: 0, writable: true},
    _version: {value: -1, writable: true}
  });
  this.update();
};
core.NodeList.prototype = {
  update: function() {
    if (this._element && this._version < this._element._version) {
      for (var i = 0; i < this._length; i++) {
        this[i] = undefined;
      }
      var nodes = this._snapshot = this._query();
      this._length = nodes.length;
      for (var i = 0; i < nodes.length; i++) {
        this[i] = nodes[i];
      }
      this._version = this._element._version;
    }
    return this._snapshot;
  },
  toArray: function() {
    return this.update() || [];
  },
  get length() {
    this.update();
    return this._length || 0;
  },
  item: function(index) {
    this.update();
    return this[index] || null;
  },
  toString: function() {
    return '[ jsdom NodeList ]: contains ' + this.length + ' items';
  },
  indexOf: function(node) {
    var len = this.update().length;

    for (var i = 0; i < len; i++) {
      if (this[i] == node) {
        return i;
      }
    }

    return -1; // not found
  }
};

core.DOMImplementation = function DOMImplementation(document, /* Object */ features) {
  this._ownerDocument = document;
  this._features = {};

  if (features) {
    for (var feature in features) {
      if (features.hasOwnProperty(feature)) {
        this.addFeature(feature.toLowerCase(), features[feature]);
      }
    }
  }
};

core.DOMImplementation.prototype = {
  get ownerDocument() { return this._ownerDocument },
  removeFeature : function(feature, version) {
    feature = feature.toLowerCase();
    if (this._features[feature]) {
      if (version) {
        var j        = 0,
            versions = this._features[feature],
            l        = versions.length;

        for (j; j<l; j++) {
          if (versions[j] === version) {
            versions.splice(j,1);
            return;
          }
        }
      } else {
        delete this._features[feature];
      }
    }
  },

  addFeature: function(feature, version) {
    feature = feature.toLowerCase();

    if (version) {

      if (!this._features[feature]) {
        this._features[feature] = [];
      }

      if (version instanceof Array) {
        Array.prototype.push.apply(this._features[feature], version);
      } else {
        this._features[feature].push(version);
      }
    }
  },

  hasFeature: function(/* string */ feature, /* string */ version) {
    feature = (feature) ? feature.toLowerCase() : '';
    var versions = (this._features[feature]) ?
                    this._features[feature]  :
                    false;

    if (!version && versions.length && versions.length > 0) {
      return true;
    } else if (typeof versions === 'string') {
      return versions === version;
    } else if (versions.indexOf && versions.length > 0) {
       return versions.indexOf(version) !== -1;
    } else {
      return false;
    }
  }
};


var attrCopy = function(src, dest, fn) {
  if (src.attributes) {
    var attrs = src.attributes, i, l = attrs.length, attr, copied;
    for (i=0;i<l;i++) {
      attr = attrs[i];
      // skip over default attributes
      if (!attr.specified) {
        continue;
      }
      // TODO: consider duplicating this code and moving it into level2/core
      if (attr.namespaceURI) {
        dest.setAttributeNS(attr.namespaceURI,
                                     attr.nodeName,
                                     attr.nodeValue);
        var localName = attr.nodeName.split(':').pop();
        copied = dest.getAttributeNodeNS(attr.namespaceURI, localName);
      } else {
        dest.setAttribute(attr.nodeName, attr.nodeValue);
        copied = dest.getAttributeNode(attr.nodeName);
      }
      if (typeof fn == "function") {
        fn(attr, copied);
      }

    }
  }
  return dest;
};

core.Node = function Node(ownerDocument) {
  var self = this;

  this._childNodes = [];
  this._ownerDocument = ownerDocument;
  this._attributes = new core.AttrNodeMap(ownerDocument, this);

  this._childrenList = new core.NodeList(this, function() {
    return self._childNodes.filter(function(node) {
      return node.tagName;
    });
  });

  this._childNodesList = new core.NodeList(this, function() {
    return self._childNodes;
  });

  this._version = 0;
  this._nodeValue = null;
  this._parentNode = null;
  this._nodeName = null;
  this._readonly = false;
};

core.Node.ELEMENT_NODE                = ELEMENT_NODE;
core.Node.ATTRIBUTE_NODE              = ATTRIBUTE_NODE;
core.Node.TEXT_NODE                   = TEXT_NODE;
core.Node.CDATA_SECTION_NODE          = CDATA_SECTION_NODE;
core.Node.ENTITY_REFERENCE_NODE       = ENTITY_REFERENCE_NODE;
core.Node.ENTITY_NODE                 = ENTITY_NODE;
core.Node.PROCESSING_INSTRUCTION_NODE = PROCESSING_INSTRUCTION_NODE;
core.Node.COMMENT_NODE                = COMMENT_NODE;
core.Node.DOCUMENT_NODE               = DOCUMENT_NODE;
core.Node.DOCUMENT_TYPE_NODE          = DOCUMENT_TYPE_NODE;
core.Node.DOCUMENT_FRAGMENT_NODE      = DOCUMENT_FRAGMENT_NODE;
core.Node.NOTATION_NODE               = NOTATION_NODE;

core.Node.prototype = {
  _attributes: null,
  _childNodes: null,
  _childNodesList: null,
  _childrenList: null,
  _version: 0,
  _nodeValue: null,
  _parentNode: null,
  _ownerDocument: null,
  _attributes: null,
  _nodeName: null,
  _readonly: false,
  style: null,
  ELEMENT_NODE                : ELEMENT_NODE,
  ATTRIBUTE_NODE              : ATTRIBUTE_NODE,
  TEXT_NODE                   : TEXT_NODE,
  CDATA_SECTION_NODE          : CDATA_SECTION_NODE,
  ENTITY_REFERENCE_NODE       : ENTITY_REFERENCE_NODE,
  ENTITY_NODE                 : ENTITY_NODE,
  PROCESSING_INSTRUCTION_NODE : PROCESSING_INSTRUCTION_NODE,
  COMMENT_NODE                : COMMENT_NODE,
  DOCUMENT_NODE               : DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE          : DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE      : DOCUMENT_FRAGMENT_NODE,
  NOTATION_NODE               : NOTATION_NODE,

  get children() {
    return this._childrenList;
  },
  get nodeValue() {
    return this._nodeValue;
  },
  set nodeValue(value) {
    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR, 'Attempting to modify a read-only node');
    }

    this._nodeValue = value;
  },
  get parentNode() { return this._parentNode;},

  get nodeName() {
    var name = this._nodeName || this._tagName;
    if (this.nodeType === ELEMENT_NODE &&
        this._ownerDocument                  &&
        this._ownerDocument._doctype          &&
        this._ownerDocument._doctype.name.toLowerCase().indexOf("html") !== -1)
    {
      return name.toUpperCase();
    }
    return name;
  },
  set nodeName() { throw new core.DOMException();},
  get attributes() { return this._attributes;},
  get firstChild() {
    return this._childNodes.length > 0 ? this._childNodes[0] : null;
  },
  set firstChild() { throw new core.DOMException();},
  get ownerDocument() { return this._ownerDocument;},
  get readonly() { return this._readonly;},

  get lastChild() {
    var len = this._childNodes.length;
    return len > 0 ? this._childNodes[len -1] : null;
  },
  set lastChild() { throw new core.DOMException();},

  get childNodes() {
    return this._childNodesList;
  },
  set childNodes() { throw new core.DOMException();},

  _indexOf: function(/*Node*/ child) {
    if (!this._childNodes ||
	!this._childNodes.length) {
      return -1;
    }

    var currentNode, index = 0, children = this._childNodes;

    while ((currentNode = children[index])) {
      if (currentNode == child) {
        break;
      }
      index++;
    }

    if (currentNode == child) {
      return index;
    }
    return -1;
  },

  get nextSibling() {
    // find this node's index in the parentNode, add one and call it a day
    if (!this._parentNode || !this._parentNode._indexOf) {
      return null;
    }

    var index = this._parentNode._indexOf(this);

    if (index == -1 || index+1 >= this._parentNode._childNodes.length) {
      return null;
    }

    return this._parentNode._childNodes[index+1] || null;
  },
  set nextSibling() { throw new core.DOMException();},

  get previousSibling() {
    if (!this._parentNode || !this._parentNode._indexOf) {
      return null;
    }

    var index = this._parentNode._indexOf(this);

    if (index == -1 || index-1 < 0) {
      return null;
    }

    return this._parentNode._childNodes[index-1] || null;
  },
  set previousSibling() { throw new core.DOMException();},

  /* returns Node */
  insertBefore :  function(/* Node */ newChild, /* Node*/ refChild) {
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR, 'Attempting to modify a read-only node');
    }

    // Adopt unowned children, for weird nodes like DocumentType
    if (!newChild._ownerDocument) newChild._ownerDocument = this._ownerDocument;

    // TODO - if (!newChild) then?
    if (newChild._ownerDocument !== this._ownerDocument) {
      throw new core.DOMException(WRONG_DOCUMENT_ERR);
    }

    if (newChild.nodeType && newChild.nodeType === ATTRIBUTE_NODE) {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }

    // search for parents matching the newChild
    var current = this;
    do {
      if (current === newChild) {
        throw new core.DOMException(HIERARCHY_REQUEST_ERR);
      }
    } while((current = current._parentNode));

    // fragments are merged into the element
    if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
      var tmpNode;
      while (newChild._childNodes.length > 0) {
        tmpNode = newChild.removeChild(newChild.firstChild);
        this.insertBefore(tmpNode, refChild);
      }
    } else if (newChild === refChild) {
      return newChild;
    } else {
      // if the newChild is already in the tree elsewhere, remove it first
      if (newChild._parentNode) {
        newChild._parentNode.removeChild(newChild);
      }

      if (refChild == null) {
        var refChildIndex = this._childNodes.length;
      } else {
        var refChildIndex = this._indexOf(refChild);
        if (refChildIndex == -1) {
          throw new core.DOMException(NOT_FOUND_ERR);
        }
      }

      this._childNodes.splice(refChildIndex, 0, newChild);
      newChild._parentNode = this;
      if (this._attached && newChild._attach) {
        newChild._attach();
      }

      this._modified();
    }

    return newChild;
  }, // raises(DOMException);

  _modified: function() {
    this._version++;
    if (this._ownerDocument) {
      this._ownerDocument._version++;
    }

    this._childrenList.update();
    this._childNodesList.update();
  },

  _attrModified: function(name, value, oldValue) {
    if (name == 'id' && this._attached) {
      var doc = this._ownerDocument;
      var ids = doc._ids;
      if (!ids) ids = doc._ids = {};
      if (oldValue && ids[oldValue]) delete ids[oldValue];
      if (value) ids[value] = this;
    }
  },

  /* returns Node */
  replaceChild : function(/* Node */ newChild, /* Node */ oldChild){
    this.insertBefore(newChild, oldChild);
    return this.removeChild(oldChild);
  }, //raises(DOMException);

  /* returns void */
  _attach : function() {
    this._attached = true;
    if (this.id) {
      if (this._ownerDocument._ids) {
        this._ownerDocument._ids[this.id] = this;
      }
    }
    for (var i=0;i<this._childNodes.length;i++) {
      if (this._childNodes[i]._attach) {
       this._childNodes[i]._attach();
      }
    }
  },
  /* returns void */
  _detach : function() {
    this._attached = false;
    if (this.id) {
      if (this._ownerDocument._ids) {
        this._ownerDocument._ids[this.id] = null;
        delete this._ownerDocument._ids[this.id];
      }
    }
    for (var i=0;i<this._childNodes.length;i++) {
      this._childNodes[i]._detach();
    }
  },

  /* returns Node */
  removeChild : function(/* Node */ oldChild){
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    // TODO - if (!oldChild) then?
    var oldChildIndex = this._indexOf(oldChild);
    if (oldChildIndex == -1) {
      throw new core.DOMException(NOT_FOUND_ERR);
    }

    this._childNodes.splice(oldChildIndex, 1);
    oldChild._parentNode = null;
    this._modified();
    oldChild._detach();
    return oldChild;
  }, // raises(DOMException);

  /* returns Node */
  appendChild : function(/* Node */ newChild) {
    return this.insertBefore(newChild, null);
  }, // raises(DOMException);

  /* returns boolean */
  hasChildNodes : function() {
    return this._childNodes.length > 0;
  },

  /* returns Node */
  cloneNode : function(/* bool */ deep, fn) {

    var object = null;
    switch (this.nodeType) {

      case this.ELEMENT_NODE:
        object = attrCopy(this,this._ownerDocument.createElement(this.tagName), fn);
      break;

      case this.TEXT_NODE:
        object = attrCopy(this,this._ownerDocument.createTextNode(this.tagName));
        object.nodeValue = this.nodeValue;
      break;
      case this.CDATA_SECTION_NODE:
        object = this._ownerDocument.createCDATASection(this.tagName);
        object.nodeValue = this.nodeValue;
      break;
      case this.ENTITY_REFERENCE_NODE:
        var name = (this._entity) ? this._entity.name : this._entityName,
            ref  = this._ownerDocument.createEntityReference(name);

        object = attrCopy(this, ref);
        object.nodeValue = this.nodeValue;
      break;
      case this.ATTRIBUTE_NODE:
        object = this._ownerDocument.createAttribute(this.name);
      break;
      case this.ENTITY_NODE:
        var entity = this._ownerDocument.createEntityNode(this.name);
        object = attrCopy(this, entity);
        object.nodeValue = this.nodeValue;
        object._publicId = this._publicId;
        object._systemId = this._systemId;
        object._notationName = this.notationName;
      break;
      case this.PROCESSING_INSTRUCTION_NODE:
        var pi = this._ownerDocument.createProcessingInstruction(this._target,
                                                                this._data);
        object = attrCopy(this, pi);
        object.nodeValue = this.nodeValue;
      break;
      case this.COMMENT_NODE:
        object = this._ownerDocument.createComment(this.tagName);
        object.nodeValue = this.nodeValue;
      break;
      case this.DOCUMENT_NODE:
        object = attrCopy(this, new core.Document());
        // TODO: clone the doctype/entities/notations/etc?
      break;
      case this.DOCUMENT_TYPE_NODE:
        object = attrCopy(this, new core.DocumentType());
        object.nodeValue = this.nodeValue;
      break;
      case this.DOCUMENT_FRAGMENT_NODE:
        object = this._ownerDocument.createDocumentFragment();
      break;
      case this.NOTATION_NODE:
        object = this._ownerDocument.createNotationNode(this._name,
                                                       this._publicId,
                                                       this._systemId);
        object = attrCopy(this,object);
        object.nodeValue = this.nodeValue;
      break;
      default:
        throw new core.DOMException(NOT_FOUND_ERR);
      break;
    }

    if (typeof fn === "function") {
      fn(this, object);
    }

    if (deep || this.nodeType === ATTRIBUTE_NODE) {
      var clone = null;
      for (var i=0,len=this._childNodes.length;i<len;i++)
      {
        clone = this._childNodes[i].cloneNode(true);
        if (clone.nodeType === ATTRIBUTE_NODE) {
          object.setAttributeNode(clone);
        } else {
          var readonly = object._readonly;
          object._readonly = false;
          object.appendChild(clone);
          object._readonly = readonly;
        }
      }
    }

    return object;
  },

  /* returns void */
  normalize: function() {
    var prevChild, child, attr,i;

    if (this._attributes && this._attributes.length) {
      for (i=0;i<this._attributes.length;i++)
      {
        if (this._attributes.item(i)) {
          attr = this._attributes.item(i).normalize();
        }
      }
    }

    for (i=0;i<this._childNodes.length;i++)
    {
      child = this._childNodes[i];

      if (child.normalize) {
        child.normalize();
      }

      // Level2/core clean off empty nodes
      if (child.value === "") {
        this.removeChild(child);
        i--;
        continue;
      }

      if (i>0) {
        prevChild = this._childNodes[i-1];

        if (child.nodeType === TEXT_NODE &&
            prevChild.nodeType === TEXT_NODE)
        {

          // remove the child and decrement i
          prevChild.appendData(child.value);

          this.removeChild(child);
          i--;
        }
      }
    }
  },
  toString: function() {
    var id = '';
    if (this.id) {
        id = '#' + this.id;
    }
    if (this.className) {
        var classes = this.className.split(/\s+/);
	for (var i = 0, len = classes.length; i < len; i++) {
	    id += '.' + classes[i];
	}
    }
    return '[ ' + this.tagName + id + ' ]';
  },
  trigger: function(type, message, data) {
    var text = type + ": " + message;

    if (data) {
      if (data.exception) {
        text = data.exception.stack;
      } else {
        text += ' - More:\n' + data;
      }
    }

    if (type === "error") {
      if (!this.errors) {
        this.errors = [];
      }
      // TODO: consider using actual `Error` objects or `DOMException`s even..
      var err = {
        type    : type,
        message : message || "No message",
        data    : data || null
      };

      this.errors.push(err);

      if (this._ownerDocument        &&
          this._ownerDocument.trigger &&
          this !== this._ownerDocument)
      {
        this._ownerDocument.trigger(type, message, data);
      }
    }

    console.log(text);
    if (data && data.error) {
      console.log(data.error.stack);
    }
  }
};


core.NamedNodeMap = function NamedNodeMap(document) {
  this._nodes = {};
  this._nsStore = {};
  this.length = 0;
  this._ownerDocument = document;
  this._readonly = false;
};
core.NamedNodeMap.prototype = {
  get readonly() { return this._readonly;},
  get ownerDocument() { this._ownerDocument;},

  exists : function(name) {
    return (this._nodes[name] || this._nodes[name] === null) ? true : false;
  },

  /* returns Node */
  getNamedItem: function(/* string */ name) {
    return this._nodes[name] || null;
  },

  /* returns Node */
  setNamedItem: function(/* Node */ arg) {

    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    // arg is from a different document
    if (arg && arg._ownerDocument !== this._ownerDocument) {
      throw new core.DOMException(WRONG_DOCUMENT_ERR);
    }

    // if this argument is already in use..
    if (arg && arg._ownerElement) {
      throw new core.DOMException(INUSE_ATTRIBUTE_ERR);
    }

    var ret;
    if (!this._nodes[arg.name] || this._nodes[arg.name] === null) {
      this.length++;
      ret = null;
    } else {
      ret = this._nodes[arg.name];
    }
    arg._specified = true;
    this._nodes[arg.name] = arg;
    return ret;
  }, // raises: function(DOMException) {},

  /* returns Node */
  removeNamedItem: function(/* string */ name) {

    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    if (!this._nodes.hasOwnProperty(name)) {
        throw new core.DOMException(NOT_FOUND_ERR);
    }

    var prev = this._nodes[name] || null;
    this._nodes[name] = null;
    delete this._nodes[name];

    this.length--;
    return prev;
  }, // raises: function(DOMException) {},

  /* returns Node */
  item: function(/* int */ index) {
    var current = 0;
    for (var member in this._nodes) {
      if (this._nodes.hasOwnProperty(member)) {
        if (current === index && this._nodes[member]) {
          return this._nodes[member];
        }
        current++;
      }
    }
    return null;
  }
};

core.AttrNodeMap = function AttrNodeMap(document, parentNode) {
  core.NamedNodeMap.call(this, document);
  this._parentNode = parentNode;
};
core.AttrNodeMap.prototype = {
  get parentNode() { return this._parentNode;},

  /* returns Node */
  setNamedItem: function(/* Node */ arg) {
    var prev = core.NamedNodeMap.prototype.setNamedItem.call(this, arg);
    var p = this._parentNode;
    arg._ownerElement = p;
    p._attrModified(arg.name, arg.value, prev && prev.value || null);
    p._modified();
    return prev;
  },

  /* returns Node */
  removeNamedItem: function(/* string */ name) {
    var prev = core.NamedNodeMap.prototype.removeNamedItem.call(this, name);
    var p = this._parentNode;

    prev._ownerElement = null;
    p._attrModified(name);
    p._modified();

    var doc = this._ownerDocument;

    // set default value if available
    if (doc && doc._doctype && doc._doctype.name.toLowerCase() !== "html") {
      var defaultValue = false,
          elem         = doc._doctype._attributes
                                     .getNamedItem(this._parentNode.nodeName);

      if (elem) {
        var defaultValue = elem.attributes.getNamedItem(name);

        if (defaultValue) {
          var attr = doc.createAttribute(name);
          attr.value = defaultValue.value;
          attr._specified = false;
          this._nodes[name] = attr;
          this.length++;
        }
      }
    }
    return prev;
  }, // raises: function(DOMException) {},
};
core.AttrNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;

core.NotationNodeMap = function NotationNodeMap(document) {
  core.NamedNodeMap.call(this, document);
  this._readonly = false;
  for (var i=1;i<arguments.length;i++) {
    this.setNamedItem(arguments[i]);
  }
  this._readonly = true;
};
core.NotationNodeMap.prototype = {};
core.NotationNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;

core.EntityNodeMap = function EntityNodeMap(document) {
  core.NamedNodeMap.call(this,document);
  this._readonly = false;
  var i = 1, l = arguments.length;

  for (i=1; i<l; i++) {
    this.setNamedItem(arguments[i]);
  }
  core.markTreeReadonly(this);
};
core.EntityNodeMap.prototype = {};
core.EntityNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;


core.Element = function Element(document, tagName) {
  this._ownerDocument = document;
  core.Node.call(this, document);
  this._nodeName = tagName;
  this._tagName = tagName;
};

core.Element.prototype = {

  get nodeValue() { return null;},
  set nodeValue(value) { /* do nothing */ },
  get tagName() {
    if (this.nodeType === ELEMENT_NODE &&
        this._ownerDocument                  &&
        this._ownerDocument._doctype          &&
        this._ownerDocument._doctype.name.toLowerCase().indexOf("html") !== -1)
    {
      return this.nodeName.toUpperCase();
    }
    return this.nodeName;
  },
  nodeType : ELEMENT_NODE,
  get attributes() {
    for(var i=0; i<this._attributes.length; i++) {
      this._attributes[i] = this._attributes.item(i);
    }
    return this._attributes;
  },

  get name() { return this.nodeName;},
  /* returns string */
  getAttribute: function(/* string */ name) {
    var attribute = this._attributes.getNamedItem(name);
    if (attribute) {
      return attribute.value;
    }
    return "";
  },

  /* returns string */
  setAttribute: function(/* string */ name, /* string */ value) {
    // Check for inline event handlers.
    // We can't set these like other attributes then look it up in
    // dispatchEvent() because that would create 2 'traditional' event handlers
    // in the case where there's an inline event handler attribute, plus one
    // set using element.on* in a script.
    if ((name.length > 2) && (name[0] == 'o') && (name[1] == 'n')) {
        var self = this;
        self[name] = function () {
            // The handler code probably refers to functions declared in the
            // window context, so we need to call run().
            if (self.run != undefined) {
                // We're the window. This can happen because inline handlers
                // on the body are proxied to the window.
                self.run(value);
            } else {
                // We're an element.
                self._ownerDocument.parentWindow.run(value);
            }
        };
    }
    if (this._ownerDocument) {
      var attr = this._ownerDocument.createAttribute(name);
      attr.value = value;
      this._attributes.setNamedItem(attr);
    }

  }, //raises: function(DOMException) {},

  /* returns string */
  removeAttribute: function(/* string */ name) {
    if (!this._attributes.exists(name)) {
      return;
    }

    this._attributes.removeNamedItem(name);
  }, // raises: function(DOMException) {},

  /* returns Attr */
  getAttributeNode: function(/* string */ name) {
    return this._attributes.getNamedItem(name);
  },

  /* returns Attr */
  setAttributeNode: function(/* Attr */ newAttr) {
    var prevNode = this._attributes.getNamedItem(newAttr.name);
    if (prevNode) {
      prevNode._ownerElement = null;
    }

    this._attributes.setNamedItem(newAttr);

    return (prevNode && prevNode.specified) ? prevNode : null;
  }, //  raises: function(DOMException) {},

  /* returns Attr */
  removeAttributeNode: function(/* Attr */ oldAttr) {
    var existingAttr = this._attributes.getNamedItem(oldAttr.name);

    if (this._attributes && existingAttr === oldAttr) {
      this._attributes.removeNamedItem(oldAttr.name);
      return oldAttr;
    }

    throw new core.DOMException(NOT_FOUND_ERR);
  }, //raises: function(DOMException) {},

  /* returns NodeList */
  getElementsByTagName: function(/* string */ name) {
    name = name.toLowerCase();

    function filterByTagName(child) {
      child = (child.nodeType === ENTITY_REFERENCE_NODE) ?
               child._entity                             :
               child;

      if (child.nodeName && child.nodeType === ELEMENT_NODE) {
        return name === "*" || (child.nodeName.toLowerCase() === name);
      }

      return false;
    }
    return new core.NodeList(this._ownerDocument || this, core.mapper(this, filterByTagName, true));
  },
};
core.Element.prototype.__proto__ = core.Node.prototype;

core.DocumentFragment = function DocumentFragment(document) {
  core.Node.call(this, document);
  this._nodeName = this._tagName = "#document-fragment";
};
core.DocumentFragment.prototype = {
  nodeType : DOCUMENT_FRAGMENT_NODE,
  get nodeValue() { return null;},
  set nodeValue() { /* do nothing */ },
  get attributes() { return null;}
};
core.DocumentFragment.prototype.__proto__ = core.Node.prototype;

core.ProcessingInstruction = function ProcessingInstruction(document, target, data) {
  this._ownerDocument = document;
  core.Node.call(this, document);
  this._nodeName = target;
  this._tagName = target;
  this._target = target;
  this._nodeValue = data;
}
core.ProcessingInstruction.prototype = {
  nodeType : PROCESSING_INSTRUCTION_NODE,
  get target() { return this._target;},
  set target(value) { throw new core.DOMException(1);},
  get nodeValue() { return this._nodeValue;},
  set nodeValue(value) { this._nodeValue = value},
  get data()   { return this._nodeValue;},
  set data()   { throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);},
  get attributes() { return null;}

};
core.ProcessingInstruction.prototype.__proto__ = core.Node.prototype;

core.Document = function Document(options) {
  if (!options) {
    options = {};
  }
  else if (typeof options == 'string') {
    options = {
      name: options
    };
  }
  core.Node.call(this, "#document");
  this._nodeName = this._tagName = "#document";
  this._contentType = options.contentType || "text/xml";
  this._doctype = options._doctype;
  this._implementation = options.implementation || new (core.DOMImplementation)();
  this._documentElement = null;
  this._ids = {};
  this._attached = true;
  this._ownerDocument = this;
  this._readonly = false;
};


var tagRegEx = /[^\w:\d_\.-]+/i;
var entRegEx = /[^\w\d_\-&;]+/;
var invalidAttrRegEx = /[^\w:\d_\.-]+/;

core.Document.prototype = {
  nodeType : DOCUMENT_NODE,
  _elementBuilders : {
    canvas : function(document, tagName) {
      var element = new core.Element(document, tagName),
          canvas;

      // require node-canvas and catch the error if it blows up
      try {
        canvas = new (require('canvas'))(0,0);
        for (attr in element) {
          if (!canvas[attr]) {
            canvas[attr] = element[attr];
          }
        }
        return canvas;
      } catch (e) {
        return element;
      }
    }
  },
  _defaultElementBuilder: function(document, tagName) {
    return new core.Element(document, tagName);
  },
  get contentType() { return this._contentType;},
  get doctype() { return this._doctype || null;},
  set doctype(doctype) { this._doctype = doctype;},
  get documentElement() {
    if (this._documentElement) {
      return this._documentElement;
    } else {
      var children = this._childNodes, len = this._childNodes.length, i=0;
      for (i;i<len;i++) {
        if (children[i].nodeType === ELEMENT_NODE) {
          this._documentElement = children[i];
          return children[i];
        }
      }
      return null;
    }
  },

  get implementation() { return this._implementation;},
  set implementation(implementation) { this._implementation = implementation;},
  get nodeName() { return '#document'; },
  get tagName() {
    return null;
  },
  get nodeValue() { return null; },
  set nodeValue() { /* noop */ },
  get attributes() { return null;},
  get ownerDocument() { return null;},
  get readonly() { return this._readonly;},
  /* returns Element */
  createElement: function(/* string */ tagName) {
    var c = [], lower = tagName.toLowerCase(), element;

    if (!tagName || !tagName.match || (c = tagName.match(tagRegEx))) {
      throw new core.DOMException(INVALID_CHARACTER_ERR, 'Invalid character in tag name: ' + c.pop());
    }

    element = (this._elementBuilders[lower] || this._defaultElementBuilder)(this, tagName);

    // Check for and introduce default elements
    if (this._doctype && this._doctype._attributes && this._doctype.name.toLowerCase() !== "html") {
      var attrElement = this._doctype._attributes.getNamedItem(tagName);
      if (attrElement && attrElement._childNodes) {

        attrs = attrElement.attributes;
        var attr, len = attrs.length, defaultAttr;
        for (var i = 0; i < len; i++) {
          defaultAttr = attrs.item(i);
          if (defaultAttr) {
            attr = this.createAttribute(defaultAttr.name);
            attr.value = defaultAttr.value;
            element.setAttributeNode(attr);
            attr._specified = false;
          }
        }
      }
    }

    element._created = true;
    return element;
  }, //raises: function(DOMException) {},

  /* returns DocumentFragment */
  createDocumentFragment: function() {
    return new core.DocumentFragment(this);
  },

  /* returns Text */
  createTextNode: function(/* string */ data) {
    return new core.Text(this,data);
  },

  /* returns Comment */
  createComment: function(/* string */ data) {
    return new core.Comment(this,data);
  },

  /* returns CDATASection */
  createCDATASection: function(/* string */ data) {
    if (this._doctype && this._doctype.name === "html") {
      throw new core.DOMException(NOT_SUPPORTED_ERR);
    }

    return new core.CDATASection(this,data);
  }, // raises: function(DOMException) {},

  /* returns ProcessingInstruction */
  createProcessingInstruction: function(/* string */ target,/* string */ data) {

    if (this._doctype && this._doctype.name === "html") {
      throw new core.DOMException(NOT_SUPPORTED_ERR);
    }

    if (target.match(tagRegEx) || !target || !target.length) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    return new core.ProcessingInstruction(this, target, data);
  }, // raises: function(DOMException) {},

  /* returns Attr */
  createAttribute: function(/* string */ name) {
    if (!name || !name.length || name.match(invalidAttrRegEx) ) {
      throw new core.DOMException(INVALID_CHARACTER_ERR, "attribute name: " + name);
    }
    return new core.Attr(this, name,false);
  }, // raises: function(DOMException) {},

  /* returns EntityReference */
  createEntityReference: function(/* string */ name) {

    if (this._doctype && this._doctype.name === "html") {
      throw new core.DOMException(NOT_SUPPORTED_ERR);
    }

    name = name.replace(/[&;]/g,"");
    if (!name || !name.length) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    if (name.match(tagRegEx)) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    var entity;
    if (this._doctype && this._doctype.entities) {
      entity = this._doctype.entities.getNamedItem(name);
    } else {
      entity = null;
    }

    var ref    = new core.EntityReference(this, entity);

    ref._entityName = name;

    return ref;
  }, //raises: function(DOMException) {},

  /* returns Entity */
  createEntityNode : function(/* string */ name)
  {

    if (name.match(entRegEx) || !name || !name.length) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    var ret = new core.Entity(this, name);
    ret._readonly = false;// TODO: fix me please.

    for (var i=1;i<arguments.length;i++)
    {
      ret.appendChild(arguments[i]);
    }

    core.markTreeReadonly(ret);

    return ret;
  },

  /* returns Notation */
  createNotationNode : function(/* string */ name,/* string */ publicId,/* string */ systemId)
  {

    if (name.match(entRegEx) || !name || !name.length) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    var ret = new core.Notation(this, name, publicId, systemId);
    ret._readonly = false;// TODO: fix me please.

    for (var i=3;i<arguments.length;i++)
    {
      ret.appendChild(arguments[i]);
    }

    core.markTreeReadonly(ret);

    return ret;
  },

  appendChild : function(/* Node */ arg) {
    if (this.documentElement && arg.nodeType == ELEMENT_NODE) {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }
    return core.Node.prototype.appendChild.call(this, arg);
  },

  removeChild : function(/* Node */ arg) {
    var ret = core.Node.prototype.removeChild.call(this, arg);
    if (arg == this._documentElement) {
      this._documentElement = null;// force a recalculation
    }
    return ret;
  },

  /* returns NodeList */
  getElementsByTagName: function(/* string */ name) {
    function filterByTagName(child) {
      if (child.nodeType && child.nodeType === ENTITY_REFERENCE_NODE)
      {
        child = child._entity;
      }

      if (child.nodeName && child.nodeType === ELEMENT_NODE)
      {
        if (name === "*") {
          return true;

        // case insensitivity for html
        } else if (child._ownerDocument && child._ownerDocument._doctype &&
                   //child._ownerDocument._doctype.name === "html" &&
                   child.nodeName.toLowerCase() === name.toLowerCase())
        {
          return true;
        } else if (child.nodeName.toLowerCase() === name.toLowerCase()) {
          return true;
        }
      }
      return false;
    }
    return new core.NodeList(this.documentElement || this, core.mapper(this, filterByTagName, true));
  }
};
core.Document.prototype.__proto__ = core.Node.prototype;

core.CharacterData = function CharacterData(document, value) {
  core.Node.call(this, document);

  this._nodeValue = (value) ? value + "" : "";
};
core.CharacterData.prototype = {

  get data() { return this._nodeValue;},
  set data(data) {

    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    this._nodeValue = data;
  },

  /* returns int */
  get length() { return this._nodeValue.length || 0;},

  /* returns string */
  substringData: function(/* int */ offset, /* int */ count) {

    if (count < 0 || offset < 0 || offset > this._nodeValue.length) {
      throw new core.DOMException(INDEX_SIZE_ERR);
    }

    return (this._nodeValue.length < offset + count) ?
            this._nodeValue.substring(offset) :
            this._nodeValue.substring(offset, offset+count);

  }, // raises: function(DOMException) {},

  /* returns string */
  appendData: function(/* string */ arg) {

    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    this._nodeValue+=arg;
    return this._nodeValue;
  }, // raises: function(DOMException) {},

  /* returns string */
  insertData: function(/* int */ offset, /* string */ arg) {

    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    if (offset < 0 || offset > this._nodeValue.length) {
      throw new core.DOMException(INDEX_SIZE_ERR);
    }

    var start = this._nodeValue.substring(0,offset);
    var end = this._nodeValue.substring(offset);

    this._nodeValue = start + arg + end;

  }, //raises: function(DOMException) {},

  /* returns void */
  deleteData: function(/* int */ offset, /* int */ count) {

    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    if (offset       < 0                     ||
        offset       > this._nodeValue.length ||
        count        < 0)
    {
      throw new core.DOMException(INDEX_SIZE_ERR);
    }

    var start = this._nodeValue.substring(0,offset);

    this._nodeValue = (offset+count<this._nodeValue.length) ?
                     start + this._nodeValue.substring(offset+count) :
                     start;
  }, // raises: function(DOMException) {},

  /* returns void */
  replaceData: function(/* int */ offset, /* int */ count, /* string */ arg) {

    // readonly
    if (this._readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    count = (offset+count > this._nodeValue.length) ?
             this.nodeValue.length-offset           :
             count;

    if (offset       < 0                     ||
        offset       > this._nodeValue.length ||
        count        < 0                     /*||
        offset+count > this._nodeValue.length*/)
    {
      throw new core.DOMException(INDEX_SIZE_ERR);
    }

    var start = this._nodeValue.substring(0,offset);
    var end = this._nodeValue.substring(offset+count);

    this._nodeValue = start + arg + end;
  } // raises: function(DOMException) {},
};
core.CharacterData.prototype.__proto__ = core.Node.prototype;


core.Attr = function Attr(document, name, value) {
  core.Node.call(this, document);
  this._nodeValue = value;
  this._name = name;
  this._specified = (value) ? true : false;
  this._tagName   = name;
  this._nodeName  = name;
};
core.Attr.prototype =  {
  nodeType : ATTRIBUTE_NODE,
  get nodeValue() {
    var val = '';
    for (var i=0,len=this._childNodes.length;i<len;i++) {
      var child = this._childNodes[i];
      if (child.nodeType === ENTITY_REFERENCE_NODE) {
        val += child.childNodes.toArray().reduce(function(prev, c) {
          return prev += (c.nodeValue || c);
        }, '');
      } else {
        val += child.nodeValue;
      }
    }
    return val;
  },
  set nodeValue(value) {
    // readonly
    if (this._readonly) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    this._childNodes.length = 0;
    this._childNodes.push(this._ownerDocument.createTextNode(value));
    this._modified();
    this._specified = true;
    var prev = this._nodeValue;
    this._nodeValue = value;
    if (this._ownerElement) {
      this._ownerElement._attrModified(this._name, value, prev);
    }
  },
  get name() { return this._name;},
  get specified() { return this._specified },
  get value() {
    return this.nodeValue;
  },
  set value(value) {
    this.nodeValue = value;
  },
  get parentNode() { return null;},
  get attributes() { return null;},

  insertBefore : function(/* Node */ newChild, /* Node*/ refChild){
    if (newChild.nodeType === CDATA_SECTION_NODE ||
        newChild.nodeType === ELEMENT_NODE)
    {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }

    return core.Node.prototype.insertBefore.call(this, newChild, refChild);
  },

  appendChild : function(/* Node */ arg) {

    if (arg.nodeType === CDATA_SECTION_NODE ||
        arg.nodeType === ELEMENT_NODE)
    {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }

    return core.Node.prototype.appendChild.call(this, arg);
  }

};
core.Attr.prototype.__proto__ = core.Node.prototype;

core.Text = function Text(document, text, readonly) {
    core.CharacterData.call(this, document, text);
    this._nodeName = "#text";
    this._readonly = readonly ? true : false
};
core.Text.prototype = {
  nodeType : TEXT_NODE,
  get attributes() { return null;},
  get value() { return this._nodeValue;},
  set value(value) { this.nodeValue = value;},

  /* returns Text */
  splitText: function(offset) {

    // readonly
    if (this._readonly) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    if (offset < 0 || offset > this._nodeValue.length) {
      throw new core.DOMException(INDEX_SIZE_ERR);
    }

    var newText = this._nodeValue.substring(offset);
    this._nodeValue = this._nodeValue.substring(0, offset);
    var newNode = this._ownerDocument.createTextNode(newText);

    if(this._parentNode.lastChild === this) {
      this._parentNode.appendChild(newNode);
    } else {
      this._parentNode.insertBefore(newNode, this.nextSibling);
    }

    return newNode;
  }, //raises: function(DOMException) {},
  toString: function() {
    return this.nodeName;
  }
};
core.Text.prototype.__proto__ = core.CharacterData.prototype


core.Comment = function Comment(document, text) {
  core.Text.call(this, document, text);
  this._nodeName = "#comment";
  this._tagName  = "#comment";
};
core.Comment.prototype = {
  nodeType : COMMENT_NODE
};
core.Comment.prototype.__proto__ = core.Text.prototype


core.CDATASection = function CDATASection(document, value) {
  core.Text.call(this, document, value);
  this._nodeName = "#cdata-section";
};
core.CDATASection.prototype = {
  nodeType : CDATA_SECTION_NODE
};
core.CDATASection.prototype.__proto__ = core.Text.prototype

core.DocumentType = function DocumentType(document, name, entities, notations, attributes) {
  core.Node.call(this, document);
  this._name = name;
  this._tagName = name;
  this._nodeName = name;
  this._entities = entities || new core.EntityNodeMap(document);
  this._notations = notations || new core.NotationNodeMap(document);

  core.markTreeReadonly(this._notations);

  this._attributes = attributes || new core.AttrNodeMap(document);
};
core.DocumentType.prototype = {
  nodeType : DOCUMENT_TYPE_NODE,
  get nodeValue() { return null;},
  set nodeValue() { /* do nothing */ },
  get name() { return this._name;},
  get entities() { return this._entities;},
  get notations() { return this._notations;},
  get attributes() { return null;}
};
core.DocumentType.prototype.__proto__ = core.Node.prototype;


core.Notation = function Notation(document, name, publicId, systemId){
  core.Node.call(this, document);
  this._name = name;
  this._nodeName = name;
  this._publicId = publicId || null;
  this._systemId = systemId || null;
  this._nodeValue = null;
};
core.Notation.prototype = {
  nodeType : NOTATION_NODE,
  get publicId() { return this._publicId;},
  get systemId() { return this._systemId;},
  get name() { return this._name || this._nodeName;},
  get attributes() { /* as per spec */ return null;},
  set nodeValue() { /* intentionally left blank */ },
  get nodeValue() { return this._nodeValue;},
};
core.Notation.prototype.__proto__ = core.Node.prototype;


core.Entity = function Entity(document, name) {
  core.Node.call(this, document);
  this._name = name;
  this._nodeName = name;
  this._tagName = name;
  this._publicId = null;
  this._systemId = null;
  this._notationName = null;
  this._readonly = true;
};
core.Entity.prototype = {
  nodeType : ENTITY_NODE,
  get nodeValue() { return null;},
  set nodeValue() {
    // readonly
    if (this._readonly === true) {
      // TODO: is this needed?
      // throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
    /* do nothing */
  },
  get name() { return this._name },
  get publicId() { return this._publicId;},
  get systemId() { return this._systemId;},

  set publicId(publicId) { this._publicId = publicId;},
  set systemId(systemId) { this._systemId = systemId;},
  set notationName(notationName) { this._notationName = notationName;},

  get notationName() { return this._notationName;},
  get attributes() { return null;},

};
core.Entity.prototype.__proto__ = core.Node.prototype;


core.EntityReference = function EntityReference(document, entity) {
  core.Node.call(this, document);
  this._entity = entity;
  this._nodeName = (entity) ? entity.name : null;
  this._readonly = true;
};
core.EntityReference.prototype = {
  nodeType : ENTITY_REFERENCE_NODE,
  get nodeValue() { return (this._entity) ? this._entity.nodeValue : null;},
  set nodeValue() {
    // readonly
    if (this._readonly === true) {
      // TODO: is this needed?
      //throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    /* do nothing */
  },
  get attributes() { return null;},

  // Proxy to the entity
  get nodeName() { return this._entityName;},
  get firstChild() { return this._entity.firstChild || null;},
  get childNodes() { return this._entity.childNodes;},
  get lastChild() { return this._entity.lastChild || null;},

};
core.EntityReference.prototype.__proto__ = core.Node.prototype;

exports.dom = { "level1" : { "core" : core }};
