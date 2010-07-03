/*
  ServerJS Javascript DOM Level 1
*/
var core = {
  
  // Returns Array
  mapDOMNodes : function(parent, recursive, callback) {

    var results = [], result, child, i;
    // mark children readonly
    if (parent.childNodes) {
      for (i=0;i<parent.childNodes.length;i++)
      {
        child = parent.childNodes.item(i);
        if (callback(child)) {
          results[results.length] = child;
        }

        if (recursive) {
          result = core.mapDOMNodes(child, true, callback);
          for (var a=0;a<result.length;a++) {
            results.push(result[a]);
          }
          //results.push.apply(results, result);
        }
      }
    }
    return results;
  },
  
  markTreeReadonly : function(el) {
    el._readonly = true;
    
    // mark children readonly
    if (el.children) {
      for (var i=0;i<el.children.length;i++) {
        core.markTreeReadonly(el.children.item(i));
      }
    }

    // also mark attributes and their children read-only
    if (el.attributes) {
      for (var i=0;i<el.attributes.length;i++) {
        core.markTreeReadonly(el.attributes.item(i));
      }
    }
  }
};
var sys = require("sys");

core.DOMException = function(code) {
  this._code = code;
};

core.DOMException.prototype = {
  get code() { return this._code;}
};

core.DOMException.prototype.__proto__ = Error.prototype;

// ExceptionCode
var INDEX_SIZE_ERR              = core.INDEX_SIZE_ERR              = 1;
var DOMSTRING_SIZE_ERR          = core.DOMSTRING_SIZE_ERR          = 2;
var HIERARCHY_REQUEST_ERR       = core.HIERARCHY_REQUEST_ERR       = 3;
var WRONG_DOCUMENT_ERR          = core.WRONG_DOCUMENT_ERR          = 4;
var INVALID_CHARACTER_ERR       = core.INVALID_CHARACTER_ERR       = 5;
var NO_DATA_ALLOWED_ERR         = core.NO_DATA_ALLOWED_ERR         = 6;
var NO_MODIFICATION_ALLOWED_ERR = core.NO_MODIFICATION_ALLOWED_ERR = 7;
var NOT_FOUND_ERR               = core.NOT_FOUND_ERR               = 8;
var NOT_SUPPORTED_ERR           = core.NOT_SUPPORTED_ERR           = 9;
var INUSE_ATTRIBUTE_ERR         = core.INUSE_ATTRIBUTE_ERR         = 10;

core.NodeList = function(document, element, tagName) {
  this._document = document;
  this._element  = element;
  this._tagName  = tagName;

};
core.NodeList.prototype = {
  /* returns Node */
  item : function(index) {
    return this[index] || null;
  },
  
  // Array Remove - By John Resig (MIT Licensed)
  remove : function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  },

  toString: function() {
    return '[ jsdom NodeList ]: contains ' + this.length + ' items';
  }
};
core.NodeList.prototype.__proto__ = Array.prototype;

core.LiveNodeList = function(document, element, callback) {
  this._callback = callback;
  this._element  = element;
  this._document = document || element;
  var results = core.mapDOMNodes(this._element, true, this._callback);
  for (var i = 0;i < results.length;i++) {
      this[i] = results[i];
  }
};

core.LiveNodeList.prototype = {
  /* returns Integer */
  get length() {
    var results = core.mapDOMNodes(this._element, true, this._callback);
    return results.length || 0;
  },
  
  /* returns Node */
  item : function(index) {
    var results = core.mapDOMNodes(this._element, true, this._callback);
    return results[index] || null;
  },
  toString: function() {
    return '[ jsdom LiveNodeList ]: contains ' + this.length + ' items';
  }
};

core.DOMImplementation = function(document, /* Object */ features) {
  this._ownerDocument = document;
  this._features = features;
};
core.DOMImplementation.prototype = {
  get ownerDocument() { return this._ownerDocument;},
  hasFeature: function(/* string */ feature, /* string */ version) {
    for (var i in this._features) {
      if (this._features.hasOwnProperty(i)          && 
          i.toLowerCase() === feature.toLowerCase() && 
          (this._features[i] === version || !version))
      {
        return true;
      }
    }
    return false;
  }
};


core.Node = function (ownerDocument) {
  this._children = new core.NodeList();
  this._nodeValue = null;
  this._parentNode = null;
  this._ownerDocument = ownerDocument;
  this._attributes = new core.AttrNodeMap(this.ownerDocument, this);
  this._nodeName   = null;
  this._readonly   = false;
  this.style = {
    position: 'static'
  };
};
core.Node.prototype = {
  get ELEMENT_NODE() { return 1;},
  get ATTRIBUTE_NODE() { return 2;},
  get TEXT_NODE() { return 3;},
  get CDATA_SECTION_NODE() { return 4;},
  get ENTITY_REFERENCE_NODE() { return 5;},  
  get ENTITY_NODE() { return 6;},
  get PROCESSING_INSTRUCTION_NODE() { return 7;},
  get COMMENT_NODE() { return 8;},
  get DOCUMENT_NODE() { return 9;},
  get DOCUMENT_TYPE_NODE() { return 10;},
  get DOCUMENT_FRAGMENT_NODE() { return 11;},
  get NOTATION_NODE() { return 12;},

  get children() { return this._children;},
  get nodeValue() { return this._nodeValue;},
  set nodeValue(value) { 
    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    this._nodeValue = value;
  },
  get parentNode() { return this._parentNode;},
  
  get nodeName() { 
    var name = this._nodeName || this._tagName;
    if (this.nodeType === this.ELEMENT_NODE &&
        this.ownerDocument                  && 
        this.ownerDocument.doctype          &&
        this.ownerDocument.doctype.name.indexOf("html") !== -1) 
    { 
      return name.toUpperCase();
    }
    return name;
  },
  set nodeName() { throw new core.DOMException();},  
  get attributes() { return this._attributes;},
  get firstChild() { 
    return (this._children && this._children.length && this._children.item(0)) ? 
            this._children.item(0)                    :
            null;
  },
  set firstChild() { throw new core.DOMException();},
  get ownerDocument() { return this._ownerDocument;},
  get readonly() { return this._readonly;},
  
  get lastChild() { 
    if (this._children && 
        this._children.length && 
        this._children[this._children.length-1])
    {
      return this._children.item(this._children.length-1);
    }
    return null;
  },
  set lastChild() { throw new core.DOMException();},

  get childNodes() { return this._children;},
  set childNodes() { throw new core.DOMException();},

  get nextSibling() { 
    // find this node's index in the parentNode, add one and call it a day
    var index = 0;

    if (!this._parentNode                   || 
        !this._parentNode.childNodes        || 
        !this._parentNode.childNodes.length || 
         this._parentNode.childNodes.length < 2) 
    {
      return null;
    }

    var currentNode;
    var index = 0;

    while ((currentNode = this._parentNode.childNodes[index])) {
      index++;
      if (currentNode === this) { break;}
    }
    
    // TODO: there is some subtle weirdness here.
    if (this._parentNode.childNodes.item(index) === this) {
      index++;
    }
    
    return this._parentNode.childNodes.item(index) || null;
  },
  set nextSibling() { throw new core.DOMException();},

  get previousSibling() { 
      // find this node's index in the parentNode, add one and call it a day
      var index = 0;

      if (!this._parentNode                   || 
          !this._parentNode.childNodes        || 
          !this._parentNode.childNodes.length || 
           this._parentNode.childNodes.length < 1) 
      {
          return null;
      }

      var currentNode;
      while ((currentNode = this._parentNode.childNodes[index])) {
        if (currentNode === this) { 
          break;
        }
        index++;
      }

      return this._parentNode.childNodes[index-1] || null;
  },
  set previousSibling() { throw new core.DOMException();},

  /* returns Node */ 
  insertBefore :  function(/* Node */ newChild, /* Node*/ refChild){

    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    if (newChild.nodeType && newChild.nodeType === this.ATTRIBUTE_NODE) {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }
    
    if (newChild.ownerDocument !== this.ownerDocument) {
      throw new core.DOMException(WRONG_DOCUMENT_ERR);
    }

    var found = false;
    
    // if the newChild is already in the tree elsewhere, remove it first
    if (newChild._parentNode) {
      newChild._parentNode.removeChild(newChild);
    }

    // if refChild is null, add to the end of the list
    if (refChild === null) {
      return this.appendChild(newChild);
    }

    for (var i=0;i<this._children.length;i++) {
      if (this._children[i] === refChild) {
        var current = this;
        // search for parents matching the newChild
        while ((current = current._parentNode))
        {
          if (current === newChild) {
            throw new core.DOMException(HIERARCHY_REQUEST_ERR);
          }
        }        

        // fragments are merged into the element
        if (newChild.nodeType === this.DOCUMENT_FRAGMENT_NODE) {
          var length = newChild.children.length;
          var j;
          var tmpNode;
          var child;
          
          for (j=0;j<length;j++)
          {
            tmpNode = newChild.removeChild(newChild.children.item(j));
            this.insertBefore(tmpNode, refChild);
          }
        } else {
          this._children.splice(i,0,newChild);
          newChild._parentNode = this;
        }
        found = true;
        break;
      }
    }
    
    if (!found) {
      throw new core.DOMException(NOT_FOUND_ERR);
    } else {
      return newChild;
    }    
  }, // raises(DOMException);

  /* returns Node */
  replaceChild : function(/* Node */ newChild, /* Node */ oldChild){

    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
    
    if (newChild.nodeType === this.ATTRIBUTE_NODE) {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }
    
    // moving elements across documents
    if (newChild.ownerDocument !== this.ownerDocument) {
      throw new core.DOMException(WRONG_DOCUMENT_ERR);
    }
    
    for (var i=0;i<this._children.length;i++)
    {
      if (this._children[i] === oldChild) {
        var current = this;
        // search for parents matching the newChild
        while ((current = current._parentNode)) {
          if (current === newChild) {
            throw new core.DOMException(HIERARCHY_REQUEST_ERR);
          }
        }
        
        this._children.remove(i,i);

        if (newChild.parentNode && newChild.parentNode.removeChild) {
          newChild.parentNode.removeChild(newChild);
        }
        newChild._parentNode = this;

        // insert the new child at this location
        if (newChild.nodeType === this.DOCUMENT_FRAGMENT_NODE) {
          var child;
          for (var j = 0;j<newChild.children.length;j++) {
            child = newChild.children.item(j);
            this._children.splice(i+j,0, child);
          }
        } else {
          this._children.splice(i,0, newChild);
        }
        
        return oldChild;
      }
    }
    throw new core.DOMException(NOT_FOUND_ERR);
  }, //raises(DOMException);

  /* returns Node */
  removeChild : function(/* Node */ oldChild){
    
    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
    
    var found = false;
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i] === oldChild) {
        found=true;
        this._children.remove(i,i);
        oldChild._parentNode = null;

        if (this.id) {
          if (this._ownerDocument._ids) {
            this._ownerDocument._ids[this.id] = null;
            delete this._ownerDocument._ids[this.id];
          }
        }
        
        if (this.nodeType === this.DOCUMENT_NODE) {
          if (this._documentElement === oldChild) {
            this._documentElement = null;// force a recalculation
          }
        }
        
        return oldChild;
      }
    }
    
    // node was not found.
    throw new core.DOMException(NOT_FOUND_ERR);
  }, // raises(DOMException);
  
  /* returns Node */
  appendChild : function(/* Node */ newChild){
    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
    
    if (newChild.nodeType === this.ATTRIBUTE_NODE) {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }
    
    // avoid recursion
    var cur = this;
    do {
      if (cur === newChild) {
        throw new core.DOMException(HIERARCHY_REQUEST_ERR);
      }
    } while ((cur = cur._parentNode))
    
    // only elements created with this.ownerDocument can be added here
    if (newChild.ownerDocument && 
        this.ownerDocument     && 
        newChild.ownerDocument !== this.ownerDocument) {
      throw new core.DOMException(WRONG_DOCUMENT_ERR);
    }
  
    try {
      this.removeChild(newChild);
    } catch (e) { /* do nothing */ }
    
    // fragments are merged into the element
    if (newChild.nodeType === this.DOCUMENT_FRAGMENT_NODE) {
    
    var transfer = [];
      var length = newChild.children.length;
      var i = length-1;
      var tmpNode;
      var child;
    // remove backwards so that item indexes stay stable while nodes are removed
      for (;i> -1;i--)
      {
        transfer.unshift(newChild.removeChild(newChild.children.item(i)));
      }
    for (i=0;i<transfer.length;i++)
      {
        this.appendChild(transfer[i]);
      }
  
    } else {
      if (newChild && newChild.parentNode) {
        newChild.parentNode.removeChild(newChild);
      }
    
      // Attach the parent node.
      newChild._parentNode = this;
      this._children.push(newChild);

      if (this.id) {
        if (!this._ownerDocument._ids) {
          this._ownerDocument._ids = {};
        }
        this._ownerDocument._ids[this.id] = this;
      }
    }
  
    return newChild;
  }, // raises(DOMException);
  
  /* returns boolean */
  hasChildNodes : function() {
    return this.childNodes.length > 0;
  },
  
  /* returns Node */  
  cloneNode : function(/* bool */ deep) {
    
    var object = null;
    
    var attrCopy = function(src, dest) {
      if (src.attributes && src.attributes.length) {
        for (var i=0;i<src.attributes.length;i++)
        {
          dest.setAttribute(src.attributes.item(i).nodeName, 
                            src.attributes.item(i).nodeValue);
        }
      }
      return dest;
    };
    
    switch (this.nodeType) {
    
      case this.ELEMENT_NODE:
        object = attrCopy(this,this.ownerDocument.createElement(this.tagName));
      break;

      case this.TEXT_NODE:
        object = attrCopy(this,this.ownerDocument.createTextNode(this.tagName));
        object.nodeValue = this.nodeValue;
      break;
      case this.CDATA_SECTION_NODE:
        object = this.ownerDocument.createCDATASection(this.tagName);
        object.nodeValue = this.nodeValue;
      break;
      case this.ENTITY_REFERENCE_NODE:
        var ref = this.ownerDocument.createEntityReference(this._entity.name);
        object = attrCopy(this, ref);
        object.nodeValue = this.nodeValue;
      break;
      case this.ATTRIBUTE_NODE:
        object = this.ownerDocument.createAttribute(this.name);
      break;
      case this.ENTITY_NODE:
        var entity = this.ownerDocument.createEntityNode(this._entity.name);
        object = attrCopy(this, entity);
        object.nodeValue = this.nodeValue;
      break;
      case this.PROCESSING_INSTRUCTION_NODE:
        var pi = this.ownerDocument.createProcessingInstruction(this._target, 
                                                                this._data);
        object = attrCopy(this, pi);
        object.nodeValue = this.nodeValue;
      break;
      case this.COMMENT_NODE:
        object = this.ownerDocument.createComment(this.tagName);
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
        object = this.ownerDocument.createDocumentFragment();
      break;
      case this.NOTATION_NODE:
        object = this.ownerDocument.createNotationNode(this._name, 
                                                       this._publicId, 
                                                       this._systemId);
        object = attrCopy(this,object);
        object.nodeValue = this.nodeValue;
      break;
      default:
        throw new core.DOMException(NOT_FOUND_ERR);
      break;
    }

    if (deep || this.nodeType === this.ATTRIBUTE_NODE) {
      var clone = null;
      for (var i=0;i<this.children.length;i++)
      {
        clone = this.children.item(i).cloneNode(true);
        if (!clone) {
          debug(this.children.item(i).nodeType);
        }
        if (clone.nodeType === this.ATTRIBUTE_NODE) {
          object.setAttributeNode(clone);
        } else {
          object.appendChild(clone);
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
        if (attr = this._attributes.item(i).normalize) {
          attr = this._attributes.item(i).normalize();
        }
      }
    }
    
    for (i=0;i<this._children.length;i++)
    {
      child = this._children[i];
      
      if (child.normalize) {
        child.normalize();
      }

      if (i>0) {
        prevChild = this._children[i-1];
        
        if (child.nodeType === this.TEXT_NODE && 
            prevChild.nodeType === this.TEXT_NODE)
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
            id += '.' + this.className;
        }
        return '[ ' + this.tagName + id + ' ]';
    }
};


core.NamedNodeMap = function(document) {
  this._nodes = {};
  this._length = 0;
  this._ownerDocument = document;
  this._readonly = false;
};
core.NamedNodeMap.prototype = {
  get readonly() { return this._readonly;},
  get ownerDocument() { this._ownerDocument;},
    get length() {
        var count = 0;
        for (var i in this._nodes) {
            count++;
        }
        this._length = count;
        return this._length;
    },

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
    if (arg && arg.ownerDocument !== this._ownerDocument) {
      throw new core.DOMException(WRONG_DOCUMENT_ERR);
    }

    // if this argument is already in use..
    if (arg && arg._parentNode) {
      throw new core.DOMException(INUSE_ATTRIBUTE_ERR);
    }
    
    var ret;
    if (!this._nodes[arg.name] || this._nodes[arg.name] === null) {
      this._length++;
      ret = null;
    } else {
      ret = this._nodes[arg.name];
    }
    arg._parentNode = this;
    arg._specified = true;
    this._nodes[arg.name] = arg;
    return ret;
  }, // raises: function(DOMException) {},

  /* returns Node */
  removeNamedItem: function(/* string */ name) {

    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
    
    if (!this._nodes.hasOwnProperty(name)) {
        throw new core.DOMException(NOT_FOUND_ERR);
    }
    
    var prev = this._nodes[name] || null;
    this._nodes[name] = null;
    delete this._nodes[name];
    
    this._length--;
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

core.AttrNodeMap = function(document, parentNode) {
  core.NamedNodeMap.call(this,document);
  this._parentNode = parentNode;
  
};
core.AttrNodeMap.prototype = {
  get parentNode() { return this._parentNode;},
  
  /* returns Node */
  removeNamedItem: function(/* string */ name) {

    var prev = core.NamedNodeMap.prototype.removeNamedItem.call(this, name);
    var doc = this._ownerDocument;
    
    // set default value if available
    if (doc && doc.doctype && doc.doctype.name.toLowerCase() !== "html") {
      var defaultValue = false;
      var elem = doc.doctype._attributes.getNamedItem(this.parentNode.nodeName);
      var defaultValue = elem.attributes.getNamedItem(name);

      if (defaultValue) {
        var attr = doc.createAttribute(name);
        attr.value = defaultValue.value;
        attr._specified = false;
        this._nodes[name] = attr;
        this._length++;
      }
    }
    return prev;
  }, // raises: function(DOMException) {},  
};
core.AttrNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;

core.NotationNodeMap = function(document) {
  core.NamedNodeMap.call(this,document);
  this._readonly = false;
  for (var i=1;i<arguments.length;i++) {
    this.setNamedItem(arguments[i]);
  }
  this._readonly = true;
};
core.NotationNodeMap.prototype = {};
core.NotationNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;

core.EntityNodeMap = function(document) {
  core.NamedNodeMap.call(this,document);
  this._readonly = false;
  for (var i=1;i<arguments.length;i++) {
    this.setNamedItem(arguments[i]);
  }
  this._readonly = true;
};
core.EntityNodeMap.prototype = {};
core.EntityNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;


core.Element = function (document, tagName) {
  this._attributes = null;
  this._ownerDocument = document;
  core.Node.call(this, document);
  this._nodeName = tagName;
  this._nodeType = this.ELEMENT_NODE;
  this._tagName = tagName;
};

core.Element.prototype = {
  
  get nodeValue() { return null;},
  set nodeValue(value) { /* do nothing */ },
  get tagName() { 
    if (this.nodeType === this.ELEMENT_NODE &&
        this.ownerDocument                  && 
        this.ownerDocument.doctype          &&
        this.ownerDocument.doctype.name.indexOf("html") !== -1) 
    { 
      return this.nodeName.toUpperCase();
    }
    return this.nodeName;
  },
  get nodeType() { return this._nodeType;},
  get attributes() { return this._attributes;},
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
  
    // readonly
    if (this.readonly === true) {
        throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
      
    if (this._attributes === null) {
        this._attributes = new core.AttrNodeMap(this.ownerDocument, this);
    }
      
    if (this.ownerDocument) {
      var attr = this.ownerDocument.createAttribute(name);
      attr.value = value;
    
      if (this.attributes.exists(name)) {
          this._attributes.removeNamedItem(name);
      }
      this._attributes.setNamedItem(attr);
      if (name === 'id') {
          this._ownerDocument._ids[value] = this;
      }
    }
    return value;
  }, //raises: function(DOMException) {},

  /* returns string */
  removeAttribute: function(/* string */ name) {

    // readonly
    if (this.readonly === true) {
        throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    if (!this._attributes.exists(name)) {
      return name;
    }

    this._attributes.removeNamedItem(name);
    return name;
  }, // raises: function(DOMException) {},

  /* returns Attr */
  getAttributeNode: function(/* string */ name) {
    if (!this._attributes.exists(name)) {
      return null;
    }
    
    return this._attributes.getNamedItem(name);
  },

  /* returns Attr */
  setAttributeNode: function(/* Attr */ newAttr) {

    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    if (this._attributes === null) {
      this._attributes = new core.AttrNodeMap(this.ownerDocument, this);
    }
    
    // only attributes created with this.ownerDocument can be added here
    if (newAttr.ownerDocument !== this.ownerDocument) {
      throw new core.DOMException(WRONG_DOCUMENT_ERR);
    }

    var prevNode = this._attributes.getNamedItem(newAttr.name);
    if (prevNode) {
      prevNode._parentNode = null;
    }

    this._attributes.setNamedItem(newAttr);

    return (prevNode && prevNode.specified) ? prevNode : null;
  }, //  raises: function(DOMException) {},

  /* returns Attr */
  removeAttributeNode: function(/* Attr */ oldAttr) {

    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    } 
    
    var existingAttr = this._attributes.getNamedItem(oldAttr.name);
    
    if (this._attributes && existingAttr === oldAttr) {
      this._attributes.removeNamedItem(oldAttr.name);
      return oldAttr;
    }
    throw new core.DOMException(NOT_FOUND_ERR);
  }, //raises: function(DOMException) {},
  
  /* returns NodeList */  
  getElementsByTagName: function(/* string */ name) {
    var queryFunction = function(child) {
      if (child.nodeType && child.nodeType === 
          core.Node.prototype.ENTITY_REFERENCE_NODE) 
      {
        child = child._entity;
      }

      if (child.nodeName && child.nodeType === core.Node.prototype.ELEMENT_NODE)
      {
        if (name === "*") {
          return true;
        
        // case insensitivity for html
        } else if (child.ownerDocument && child.ownerDocument.doctype && 
                   child.ownerDocument.doctype.name === "html" &&
                   child.nodeName.toLowerCase() === name.toLowerCase()) 
        {
          return true;
        } else if (child.nodeName.toLowerCase() === name.toLowerCase()) {
          return true;
        }
      }
      return false;
    }

    if (this.ownerDocument && 
        this.ownerDocument.implementation && 
        this.ownerDocument.implementation.hasFeature("DisableLiveLists")) 
    {
      return core.mapDOMNodes(this, true, queryFunction);
    } else {
      return new core.LiveNodeList(this._document, this, queryFunction);
    }
  },
};
core.Element.prototype.__proto__ = core.Node.prototype;

core.DocumentFragment = function(document) {
  core.Element.call(this, document, "#document-fragment");
  this._nodeType = this.DOCUMENT_FRAGMENT_NODE;
};
core.DocumentFragment.prototype = {
  get nodeValue() { return null;},
  set nodeValue() { /* do nothing */ },
  get attributes() { return null;}
};
core.DocumentFragment.prototype.__proto__ = core.Element.prototype;

core.ProcessingInstruction = function (document, target, data) {
  core.Node.call(this, document);
  this._nodeName = target;
  this._tagName = target;
  this._target = target;
  this._nodeValue = data;
}
core.ProcessingInstruction.prototype = {
  get target() { return this._target;},
  set target(value) { throw new core.DOMException(1);},
  get nodeType() { return this.PROCESSING_INSTRUCTION_NODE;},
  get nodeValue() { return this._nodeValue;},
  set nodeValue(value) { this._nodeValue = value},
  get data()   { return this._nodeValue;},
  set data()   { throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);},
  get attributes() { return null;}

};
core.ProcessingInstruction.prototype.__proto__ = core.Node.prototype;

core.Document = function(name, doctype, implementation, /* string */contentType)
{
  core.Element.call(this, "#document");
  this._nodeName = this._tagName = "#document";
  this._contentType = contentType || "text/xml";
  this._doctype = doctype;
  this._implementation = implementation || new core.DOMImplementation();
  this._documentElement = null;
  this._ids = {};
  this._ownerDocument = this;
  this._readonly = false;
};
core.Document.prototype = {
  get contentType() { return this._contentType;},
  get doctype() { return this._doctype || null;},
  set doctype(doctype) { this._doctype = doctype;},
  get documentElement() { 
    if (this._documentElement) {
      return this._documentElement;
    } else {
      var children = this._children, len = this._children.length, i=0;
      for (i;i<len;i++) {
        if (children[i].nodeType === this.ELEMENT_NODE) {
          this._documentElement = children[i];
          return children[i];
        }
      }
      return null;
    }
  },
  
  get implementation() { return this._implementation;},
  set implementation(implementation) { this._implementation = implementation;},
  get nodeType() { return this.DOCUMENT_NODE;},
  get nodeName() { 
    if (this.nodeType === this.ELEMENT_NODE &&
        this.ownerDocument                  && 
        this.ownerDocument.doctype          &&
        this.ownerDocument.doctype.name.indexOf("html") !== -1) 
    { 
      return this._nodeName.toUpperCase();
    }
    return this._nodeName;
  },
  get attributes() { return null;},
  get ownerDocument() { return null;},
  get readonly() { return this._readonly;},
  /* returns Element */
  createElement: function(/* string */ tagName) {
    if (!tagName || !tagName.match || tagName.match(/[^\w:\d_-]+/i)) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    var element =  new core.Element(this, tagName);

    // Check for and introduce default elements
    if (this.doctype && this.doctype._attributes && this.doctype.name.toLowerCase() !== "html") {
      var attrElement = this.doctype._attributes.getNamedItem(tagName);
      if (attrElement && attrElement.children) {

        attrs = attrElement.attributes;
        var attr;
        for (var i=0;i<attrs.length;i++) {
          attr = this.createAttribute(attrs.item(i).name);
          attr.value = attrs.item(i).value;
          element.setAttributeNode(attr);
          attr._specified = false;
        }
      }
    }    
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
    if (this.doctype && this.doctype.name === "html") {
      throw new core.DOMException(NOT_SUPPORTED_ERR);
    }
    
    return new core.CDATASection(this,data);
  }, // raises: function(DOMException) {},

  /* returns ProcessingInstruction */
  createProcessingInstruction: function(/* string */ target,/* string */ data) {
    
    if (this.doctype && this.doctype.name === "html") {
      throw new core.DOMException(NOT_SUPPORTED_ERR);
    }
    
    if (target.match(/[^\w\d_-]+/) || !target || !target.length) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    return new core.ProcessingInstruction(this, target, data);
  }, // raises: function(DOMException) {},

  /* returns Attr */
  createAttribute: function(/* string */ name) {
    if (!name || !name.length || name.match(/[^\w:\d_\.-]+/) ) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }
    return new core.Attr(this, name,false);
  }, // raises: function(DOMException) {},
  
  /* returns EntityReference */
  createEntityReference: function(/* string */ name) {

    if (this.doctype && this.doctype.name === "html") {
      throw new core.DOMException(NOT_SUPPORTED_ERR);
    }

    name = name.replace(/[&;]/g,"");
    if (!name || !name.length) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    if (name.match(/[^\w\d_-]+/)) {
      throw new core.DOMException(INVALID_CHARACTER_ERR);
    }

    var entity = this._doctype.entities.getNamedItem(name);

    if (!entity) {
      throw new core.DOMException(NOT_SUPPORTED_ERR);
    }
    return new core.EntityReference(this, entity);
  }, //raises: function(DOMException) {},

  /* returns Entity */
  createEntityNode : function(/* string */ name)
  {
    
    if (name.match(/[^\w\d_\-&;]+/) || !name || !name.length) {
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
    
    if (name.match(/[^\w\d_\-&;]+/) || !name || !name.length) {
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

  
  /* returns Node */
  appendChild : function(/* Node */ newChild){

    // readonly
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
   
    if (newChild.nodeType === this.ATTRIBUTE_NODE) {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }
    
    this._children.push(newChild);
    
    // Attach the parent node.
    newChild._parentNode = this;
    return newChild;
  } // raises(DOMException);
};
core.Document.prototype.__proto__ = core.Element.prototype;

core.CharacterData = function(document, value) {
  core.Node.call(this, document);
  this._nodeValue = value || "";
};
core.CharacterData.prototype = {

  get data() { return this._nodeValue;},
  set data(data) { 

    // readonly
    if (this.readonly === true) {
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
    if (this.readonly === true) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
    
    this._nodeValue+=arg;
    return this._nodeValue;
  }, // raises: function(DOMException) {},
  
  /* returns string */  
  insertData: function(/* int */ offset, /* string */ arg) {

    // readonly
    if (this.readonly === true) {
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
    if (this.readonly === true) {
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
    if (this.readonly === true) {
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


core.Attr = function(document, name, value) {
  core.Node.call(this, document);
  this._nodeValue = value;
  this._name = name;
  this._specified = (value) ? true : false;
  this._tagName   = name;
  this._nodeName  = name;
};
core.Attr.prototype =  {
  get nodeType() { return this.ATTRIBUTE_NODE;},
  get nodeValue() {
    var val = "", child, i, j;
    
    if (this._children.length > 0) {
      for (i=0;i<this._children.length;i++)
      {
        child = this._children.item(i);

        if (child.nodeType === this.ENTITY_REFERENCE_NODE) {
          for (j=0;j<child.childNodes.length;j++) {
            val+=(child.childNodes.item(j).nodeValue) ? 
                  child.childNodes.item(j).nodeValue  :
                  child.childNodes.item(j);
          }
        } else {
          val += child.nodeValue;
        }
      }
    }
    
    return val;
  },
  set nodeValue(value) { 
    // readonly
    if (this._readonly) {
      throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }

    this._children.length = 0;
    this._children.push(this.ownerDocument.createTextNode(value));
    this._specified = true;
    this._nodeValue = value;
  },
  get name() { return this._name;},
  get specified() { return this._specified;},
  get value() { 
    return this.nodeValue;
  },
  set value(value) { 
    this.nodeValue = value;
  },
  get parentNode() { return null;},
  get attributes() { return null;},
  
  insertBefore : function(/* Node */ newChild, /* Node*/ refChild){
    if (newChild.nodeType === this.CDATA_SECTION_NODE ||
        newChild.nodeType === this.ELEMENT_NODE) 
    {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }
    
    return core.Node.prototype.insertBefore.call(this, newChild, refChild);
  },
 
  appendChild : function(/* Node */ arg) {
   
    if (arg.nodeType === this.CDATA_SECTION_NODE ||
        arg.nodeType === this.ELEMENT_NODE) 
    {
      throw new core.DOMException(HIERARCHY_REQUEST_ERR);
    }
    
    return core.Node.prototype.appendChild.call(this, arg);
  }
  
};
core.Attr.prototype.__proto__ = core.Node.prototype;

core.Text = function(document, text, readonly) {
    core.CharacterData.call(this, document, text);
    this._nodeName = "#text";
    this._readonly = readonly ? true : false
};
core.Text.prototype = {
  
  get attributes() { return null;},
  get nodeType() { return this.TEXT_NODE;},
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
    var newNode = this.ownerDocument.createTextNode(newText);
    this._parentNode.appendChild(newNode);
    return newNode;
  }, //raises: function(DOMException) {},
  toString: function() {
    return this.nodeName;
  }
};
core.Text.prototype.__proto__ = core.CharacterData.prototype


core.Comment = function(document, text) {
  core.Text.call(this, document, text);
  this._nodeName = "#comment";
  this._tagName  = "#comment";
};
core.Comment.prototype = {
  get nodeType() { return this.COMMENT_NODE;}
};
core.Comment.prototype.__proto__ = core.Text.prototype


core.CDATASection = function(document, value) {
  core.Text.call(this, document, value);
  this._nodeName = "#cdata-section";
};
core.CDATASection.prototype = {
  get nodeType() { return this.CDATA_SECTION_NODE;}
};
core.CDATASection.prototype.__proto__ = core.Text.prototype

core.DocumentType = function(document, name, entities, notations, attributes) {
  core.Node.call(this, document);
  this._name = name;
  this._tagName = name;
  this._nodeName = name;
  this._entities = entities || new core.EntityNodeMap(document);
  this._notations = notations || new core.NotationNodeMap(document);
  
  core.markTreeReadonly(this._notations);
  
  this._attributes = attributes || new core.NamedNodeMap(document);
};
core.DocumentType.prototype = {
  get nodeValue() { return null;},
  set nodeValue() { /* do nothing */ },

  get nodeType() { return this.DOCUMENT_TYPE_NODE;},
  get name() { return this._name;},
  get entities() { return this._entities;},
  get notations() { return this._notations;},
  get attributes() { return null;}
};
core.DocumentType.prototype.__proto__ = core.Node.prototype;


core.Notation = function(document, name, publicId, systemId){
  core.Node.call(this, document);
  this._name = name;
  this._nodeName = name;
  this._nodeType = this.NOTATION_NODE;
  this._publicId = publicId || null;
  this._systemId = systemId || null;
  this._nodeValue = null;
};
core.Notation.prototype = {
  get publicId() { return this._publicId;},
  get systemId() { return this._systemId;},
  get name() { return this._name || this._nodeName;},
  get attributes() { /* as per spec */ return null;},
  set nodeValue() { /* intentionally left blank */ },
  get nodeValue() { return this._nodeValue;},
  get nodeType() { return this.NOTATION_NODE;}
};
core.Notation.prototype.__proto__ = core.Node.prototype;


core.Entity = function(document, name) {
  core.Node.call(this, document);
  this._name = name;
  this._nodeName = name;
  this._tagName = name;
  this._publicId = null;
  this._systemId = null;
  this._notationName = null;
  this._nodeType = this.ENTITY_NODE;
  this._readonly = true;
};
core.Entity.prototype = {
  get nodeValue() { return null;},
  set nodeValue() { 
    // readonly
    if (this.readonly === true) {
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
  get nodeType() { return this.ENTITY_NODE;},
  get attributes() { return null;},
 
};
core.Entity.prototype.__proto__ = core.Node.prototype;


core.EntityReference = function(document, entity) {
  core.Node.call(this, document);
  this._entity = entity;
  this._nodeName = entity.name;
  this._readonly = true;
};
core.EntityReference.prototype = {
  get nodeType()  { return this.ENTITY_REFERENCE_NODE;},
  get nodeValue() { return this._entity.nodeValue;},
  set nodeValue() { 
    // readonly
    if (this.readonly === true) {
      // TODO: is this needed?
      //throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
    }
    
    /* do nothing */ 
  },
  get attributes() { return null;},
  
  // Proxy to the entity
  get nodeName() { return this._entity.nodeName;},
  get firstChild() { return this._entity.firstChild || null;},
  get childNodes() { return this._entity.childNodes;},
  get lastChild() { return this._entity.lastChild || null;},
  
};
core.EntityReference.prototype.__proto__ = core.Node.prototype;

exports.dom = { "level1" : { "core" : core }};
