/*
  ServerJS Javascript DOM Level 1
*/
var inheritFrom = require("../utils").inheritFrom;
var domToHtml = require("../browser/domtohtml").domToHtml;
var defineGetter = require("../utils").defineGetter;
var memoizeQuery = require("../utils").memoizeQuery;
var validateName = require('../living/helpers/validate-names').name;
var HtmlToDom = require("../browser/htmltodom").HtmlToDom;
var Location = require("../browser/location");
var vm = require("vm");
var CookieJar = require('tough-cookie').CookieJar;
var EventTarget = require("../events/EventTarget");
var attributes = require("../living/attributes");
var mapper = require("../utils").mapper;
var clone = require("../living/node").clone;
var namedPropertiesWindow = require("../living/named-properties-window");
var Window = require('../browser/Window');

// utility functions
var attachId = function(id,elm,doc) {
  if (id && elm && doc) {
    if (!doc._ids[id]) {
      doc._ids[id] = [];
    }
    doc._ids[id].push(elm);
  }
};
var detachId = function(id,elm,doc) {
  var elms, i;
  if (id && elm && doc) {
    if (doc._ids && doc._ids[id]) {
      elms = doc._ids[id];
      for (i=0;i<elms.length;i++) {
        if (elms[i] === elm) {
          elms.splice(i,1);
          i--;
        }
      }
      if (elms.length === 0) {
        delete doc._ids[id];
      }
    }
  }
};

function setInnerHTML(document, node, html) {
  //Clear the children first:
  var child;
  while ((child = node._childNodes[0])) {
    node.removeChild(child);
  }

  if (html !== "") {
    if (node.nodeName === "#document") {
      document._htmlToDom.appendHtmlToDocument(html, node);
    } else {
      document._htmlToDom.appendHtmlToElement(html, node);
    }
  }
}

var core = exports;

core.DOMException = require("../web-idl/DOMException");
core.NamedNodeMap = require("../living/attributes").NamedNodeMap;

// Node Types
var ELEMENT_NODE                = 1,
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

core.NodeList = function NodeList(element, query) {
  if (!query) {
    // Non-live NodeList
    if (Array.isArray(element)) {
      Array.prototype.push.apply(this, element);
    }
    Object.defineProperties(this, {
      _length: {value: element ? element.length : 0, writable:true}
    });
  } else {
    Object.defineProperties(this, {
      _element: {value: element},
      _query: {value: query},
      _snapshot: {writable: true},
      _length: {value: 0, writable: true},
      _version: {value: -1, writable: true}
    });
    this._update();
  }
};

function lengthFromProperties(arrayLike) {
  var max = -1;
  var keys = Object.keys(arrayLike);
  var highestKeyIndex = keys.length - 1;

  // abuses a v8 implementation detail for a very fast case
  // (if this implementation detail changes, this method will still
  //  return correct results)
  if (highestKeyIndex == keys[highestKeyIndex]) { // not ===
    return keys.length;
  }

  for (var i = highestKeyIndex; i >= 0 ; --i) {
    var asNumber = + keys[i];

    if (!isNaN(asNumber) && asNumber > max) {
      max = asNumber;
    }
  }
  return max + 1;
}
core.NodeList.prototype = {
  _update: function() {
    var i;

    if (!this._element) {
      this._length = lengthFromProperties(this);
    } else {
      if (this._version < this._element._version) {
        var nodes = this._snapshot = this._query();
        this._resetTo(nodes);
        this._version = this._element._version;
      }
    }
  },
  _resetTo: function(array) {
    var startingLength = lengthFromProperties(this);
    for (var i = 0; i < startingLength; ++i) {
      delete this[i];
    }

    for (var j = 0; j < array.length; ++j) {
      this[j] = array[j];
    }
    this._length = array.length;
  },
  _toArray: function() {
    if (this._element) {
      this._update();
      return this._snapshot;
    }

    return Array.prototype.slice.call(this);
  },
  get length() {
    this._update();
    return this._length || 0;
  },
  set length(length) {
    return this._length;
  },
  item: function(index) {
    this._update();
    return this[index] || null;
  },
  toString: function() {
    return '[ jsdom NodeList ]: contains ' + this.length + ' items';
  }
};
Object.defineProperty(core.NodeList.prototype, 'constructor', {
  value: core.NodeList,
  writable: true,
  configurable: true
});

core.DOMImplementation = function DOMImplementation(document, /* Object */ features) {
  throw new TypeError("Illegal constructor");
};

core.DOMImplementation.prototype = {
  // All of these are legacy, left because jsdom uses them internally :(. jsdom confused the idea of browser features
  // and jsdom features
  _removeFeature : function(feature, version) {
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

  _addFeature: function(feature, version) {
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

      if (feature === "processexternalresources" &&
          (version === "script" || (version.indexOf && version.indexOf("script") !== -1)) &&
          !vm.isContext(this._ownerDocument._global)) {
        vm.createContext(this._ownerDocument._global);
        this._ownerDocument._defaultView._globalProxy = vm.runInContext("this", this._ownerDocument._global);
        this._ownerDocument._defaultView = this._ownerDocument._defaultView._globalProxy;
      }
    }
  },

  // The real hasFeature is in living/dom-implementation.js, and returns true always.
  // This one is used internally
  _hasFeature: function(/* string */ feature, /* string */ version) {
    feature = (feature) ? feature.toLowerCase() : '';
    var versions = (this._features[feature]) ?
                    this._features[feature]  :
                    false;

    if (!version && versions.length && versions.length > 0) {
      return true;
    } else if (typeof versions === 'string') {
      return versions === version;
    } else if (versions.indexOf && versions.length > 0) {
      for (var i = 0; i < versions.length; i++) {
        var found = versions[i] instanceof RegExp ?
          versions[i].test(version) :
          versions[i] === version;
        if (found) { return true; }
      }
      return false;
    } else {
      return false;
    }
  }
};

core.Node = function Node(ownerDocument) {
  EventTarget.call(this);

  this._childNodes = [];
  this._childNodesList = null;
  this._ownerDocument = ownerDocument;
  this._childrenList = null;
  this._version = 0;
  this._parentNode = null;
  this._memoizedQueries = {};
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

  get nodeValue() {
    if (this.nodeType === core.Node.TEXT_NODE ||
        this.nodeType === core.Node.COMMENT_NODE ||
        this.nodeType === core.Node.PROCESSING_INSTRUCTION_NODE) {
      return this._data;
    }

    return null;
  },
  set nodeValue(value) {
    if (this.nodeType === core.Node.TEXT_NODE ||
        this.nodeType === core.Node.COMMENT_NODE ||
        this.nodeType === core.Node.PROCESSING_INSTRUCTION_NODE) {
      this.replaceData(0, this.length, value);
    }
  },
  get parentNode() { return this._parentNode;},

  get nodeName() {
    switch (this.nodeType) {
      case ELEMENT_NODE:
        return this.tagName;
      case TEXT_NODE:
        return "#text";
      case PROCESSING_INSTRUCTION_NODE:
        return this.target;
      case COMMENT_NODE:
        return "#comment";
      case DOCUMENT_NODE:
        return "#document";
      case DOCUMENT_TYPE_NODE:
        return this.name;
      case DOCUMENT_FRAGMENT_NODE:
        return "#document-fragment";
      case ATTRIBUTE_NODE:
        // TODO Attr: remove this; attributes should not be nodes and should not have a nodeName property
        // Removing it breaks some legit-seeming xpath tests :-/
        return this.name;
    }
  },
  set nodeName(unused) { throw new core.DOMException();},
  get firstChild() {
    return this._childNodes.length > 0 ? this._childNodes[0] : null;
  },
  get ownerDocument() {
    // TODO: when we move nodeType to Node.prototype and add an internal _nodeType, consult that instead.
    return this.nodeType === DOCUMENT_NODE ? null : this._ownerDocument;
  },
  get readonly() { return this._readonly;},

  get lastChild() {
    var len = this._childNodes.length;
    return len > 0 ? this._childNodes[len -1] : null;
  },

  get childNodes() {
    if (!this._childNodesList) {
      var self = this;
      this._childNodesList = new core.NodeList(this, function() {
        return self._childNodes.slice();
      });
    }
    this._childNodesList._update();
    return this._childNodesList;
  },
  set childNodes(unused) { throw new core.DOMException();},

  _indexOf: function(/*Node*/ child) {
    return this._childNodes.indexOf(child);
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
  set nextSibling(unused) { throw new core.DOMException();},

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
  set previousSibling(unused) { throw new core.DOMException();},

  /* returns Node */
  insertBefore :  function(/* Node */ newChild, /* Node*/ refChild) {
    if (this._readonly === true) {
      throw new core.DOMException(core.DOMException.NO_MODIFICATION_ALLOWED_ERR, 'Attempting to modify a read-only node');
    }

    // DocumentType must be implicitly adopted
    if (newChild.nodeType === DOCUMENT_TYPE_NODE) newChild._ownerDocument = this._ownerDocument;

    // TODO - if (!newChild) then?
    if (!(this instanceof core.Document) && newChild._ownerDocument !== this._ownerDocument) {
      throw new core.DOMException(core.DOMException.WRONG_DOCUMENT_ERR);
    }

    if (newChild.nodeType && newChild.nodeType === ATTRIBUTE_NODE) {
      throw new core.DOMException(core.DOMException.HIERARCHY_REQUEST_ERR);
    }

    // search for parents matching the newChild
    var current = this;
    do {
      if (current === newChild) {
        throw new core.DOMException(core.DOMException.HIERARCHY_REQUEST_ERR);
      }
    } while((current = current._parentNode));

    // fragments are merged into the element (except parser-created fragments in <template>)
    if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE && !newChild._templateContent) {
      var tmpNode, i = newChild._childNodes.length;
      while (i-- > 0) {
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
        this._childNodes.push(newChild);
      } else {
        var refChildIndex = this._indexOf(refChild);
        if (refChildIndex == -1) {
          throw new core.DOMException(core.DOMException.NOT_FOUND_ERR);
        }
        this._childNodes.splice(refChildIndex, 0, newChild);
      }

      newChild._parentNode = this;

      this._modified();

      if (this._attached && newChild._attach) {
        newChild._attach();
      }

      this._descendantAdded(this, newChild);
    }

    return newChild;
  }, // raises(DOMException);

  _modified: function() {
    this._version++;
    if (this._ownerDocument) {
      this._ownerDocument._version++;
    }

    if (this._childrenList) {
      this._childrenList._update();
    }
    if (this._childNodesList) {
      this._childNodesList._update();
    }
    this._clearMemoizedQueries();
  },

  _clearMemoizedQueries: function() {
    this._memoizedQueries = {};
    if (this._parentNode && this._parentNode !== this) {
      this._parentNode._clearMemoizedQueries();
    }
  },

  _descendantRemoved: function(parent, child) {
    if (this._parentNode && this._parentNode !== this) {
      this._parentNode._descendantRemoved(parent, child);
    }
  },

  _descendantAdded: function(parent, child) {
    if (this._parentNode && this._parentNode !== this) {
      this._parentNode._descendantAdded(parent, child);
    }
  },

  _attrModified: function(name, value, oldValue) {
    this._clearMemoizedQueries();
    namedPropertiesWindow.elementAttributeModified(this, name, value, oldValue);

    if (name == 'id' && this._attached) {
      var doc = this._ownerDocument;
      detachId(oldValue,this,doc);
      attachId(value,this,doc);
    }

    // Check for inline event handlers.
    // We can't set these like other attributes then look it up in
    // dispatchEvent() because that would create 2 'traditional' event handlers
    // in the case where there's an inline event handler attribute, plus one
    // set using element.on* in a script.
    //
    // @see http://www.w3.org/TR/2011/WD-html5-20110405/webappapis.html#event-handler-content-attributes
    if (name.length > 2 && name[0] === 'o' && name[1] === 'n') {
      if (value) {
        var self = this;
        // Check whether we're the window. This can happen because inline
        // handlers on the body are proxied to the window.
        var w = vm.isContext(self) ? self : self._ownerDocument._global;

        self[name] = function (event) {
            // The handler code probably refers to functions declared in the
            // window context, so we need to call run().

            // Use awesome hacks to get the correct `this` context for the
            // inline event handler. This would only be necessary if we're an
            // element, but for the sake of simplicity we also do it on window.

            // Also set event variable and support `return false`.
            w.__tempContextForInlineEventHandler = self;
            w.__tempEvent = event;
            vm.runInContext("if ((function (event) {" + value + "}).call(" +
              "window.__tempContextForInlineEventHandler, window.__tempEvent) === false) {" +
              "window.__tempEvent.preventDefault()}", w);
            delete w.__tempContextForInlineEventHandler;
            delete w.__tempEvent;
        };
      } else {
        this[name] = null;
      }
    }

    // TODO remove MutationEvents completely at some point
    if (value !== oldValue && this._ownerDocument &&
        this._ownerDocument.implementation._hasFeature('MutationEvents')) {
      var ev = this._ownerDocument.createEvent("MutationEvents");

      var attrChange = core.MutationEvent.MODIFICATION;
      if (value === null) {
        attrChange = core.MutationEvent.REMOVAL;
      }
      if (oldValue === null) {
        attrChange = core.MutationEvent.ADDITION;
      }

      ev.initMutationEvent("DOMAttrModified", true, false, this, oldValue, value, name, attrChange);
      this.dispatchEvent(ev);
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
    namedPropertiesWindow.nodeAttachedToDocument(this);

    if (this.id) {
      attachId(this.id,this,this._ownerDocument);
    }
    for (var i = 0, len = this._childNodes.length; i < len; i++) {
      if (this._childNodes[i]._attach) {
        this._childNodes[i]._attach();
      }
    }
  },
  /* returns void */
  _detach : function() {
    this._attached = false;

    namedPropertiesWindow.nodeDetachedFromDocument(this);

    if (this.id) {
      detachId(this.id,this,this._ownerDocument);
    }
    for (var i = 0, len = this._childNodes.length; i < len; i++) {
      this._childNodes[i]._detach();
    }
  },

  /* returns Node */
  removeChild : function(/* Node */ oldChild){
    if (this._readonly === true) {
      throw new core.DOMException(core.DOMException.NO_MODIFICATION_ALLOWED_ERR);
    }

    // TODO - if (!oldChild) then?

    // Use lastIndexOf so that removing all the children by
    // going backwards through childNodes is fast
    // (because of splice)
    var oldChildIndex = this._childNodes.lastIndexOf(oldChild);
    if (oldChildIndex == -1) {
      throw new core.DOMException(core.DOMException.NOT_FOUND_ERR);
    }

    var oldPreviousSibling = oldChild.previousSibling;

    this._childNodes.splice(oldChildIndex, 1);
    oldChild._parentNode = null;
    this._modified();
    oldChild._detach();
    this._descendantRemoved(this, oldChild);
    if (this._ownerDocument) {
      this._ownerDocument._runRemovingSteps(oldChild, this, oldPreviousSibling);
    }
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

  /* returns void */
  normalize: function() {
    var prevChild, child, attr,i;

    if (this._attributes && this._attributes.length) {
      for (i=0;i<this._attributes.length;i++)
      {
        if (this._attributes[i]) {
          attr = this._attributes[i].normalize();
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
      if (child.nodeValue === "") {
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
          prevChild.appendData(child.nodeValue);

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
  raise: function(type, message, data) {
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
          this._ownerDocument.raise &&
          this !== this._ownerDocument)
      {
        this._ownerDocument.raise(type, message, data);
      }
    }
  }
};

core.Element = function Element(document, localName) {
  core.Node.call(this, document);
  this._namespaceURI = null;
  this._prefix = null;
  this._localName = localName;
  this._attributes = attributes.createNamedNodeMap(this);
};

inheritFrom(core.Node, core.Element, {
  get namespaceURI() {
    return this._namespaceURI;
  },
  get prefix() {
    return this._prefix;
  },
  get localName() {
    return this._localName;
  },
  get tagName() {
    var qualifiedName = this._prefix !== null ? this._prefix + ":" + this._localName : this._localName;
    if (this.namespaceURI === "http://www.w3.org/1999/xhtml" && this._ownerDocument._parsingMode === "html") {
      qualifiedName = qualifiedName.toUpperCase();
    }
    return qualifiedName;
  },

  get id() {
    var idAttr = this.getAttribute("id");
    if (idAttr === null) {
      return "";
    }
    return idAttr;
  },

  nodeType : ELEMENT_NODE,
  get attributes() {
    return this._attributes;
  },

  get sourceIndex() {
    /*
    * According to QuirksMode:
    * Get the sourceIndex of element x. This is also the index number for
    * the element in the document.getElementsByTagName('*') array.
    * http://www.quirksmode.org/dom/w3c_core.html#t77
    */
    var items = this.ownerDocument.getElementsByTagName('*'),
        len = items.length;

    for (var i = 0; i < len; i++) {
      if (items[i] === this) {
        return i;
      }
    }
  },

  get outerHTML() {
    return domToHtml(this, true);
  },

  set outerHTML(html) {
    if (html === null) {
      html = "";
    }

    var parent = this._parentNode;
    var document = this._ownerDocument;

    if (!parent) {
      return;
    }

    var contextElement;
    if (parent.nodeType === DOCUMENT_NODE) {
      throw new core.DOMException(core.DOMException.NO_MODIFICATION_ALLOWED_ERR,
                                  "Modifications are not allowed for this document");
    } else if (parent.nodeType === DOCUMENT_FRAGMENT_NODE) {
      contextElement = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
    } else if (parent.nodeType === ELEMENT_NODE) {
      contextElement = clone(core, parent, undefined, false);
    } else {
      throw new TypeError("This should never happen");
    }

    document._htmlToDom.appendHtmlToElement(html, contextElement);

    while (contextElement.firstChild) {
      parent.insertBefore(contextElement.firstChild, this);
    }

    parent.removeChild(this);
  },

  get innerHTML() {
    var tagName = this.tagName;
    if (tagName === 'SCRIPT' || tagName === 'STYLE') {
      var type = this.getAttribute('type');
      if (!type || /^text\//i.test(type) || /\/javascript$/i.test(type)) {
        return domToHtml(this._childNodes, true, true);
      }
    }

    // In case of <template> we should pass it's content fragment as a serialization root if we have one
    if(tagName === 'TEMPLATE' &&
       this._namespaceURI === 'http://www.w3.org/1999/xhtml' &&
       this._childNodes[0] && this._childNodes[0]._templateContent) {
      return domToHtml(this._childNodes[0]._childNodes, true);
    }

    return domToHtml(this._childNodes, true);
  },

  set innerHTML(html) {
    if (html === null) {
      html = "";
    }

    setInnerHTML(this.ownerDocument, this, html);
  },

  scrollTop: 0,
  scrollLeft: 0,

  /* returns NodeList */
  getElementsByTagName: memoizeQuery(function(/* string */ name) {
    name = name.toLowerCase();

    function filterByTagName(child) {
      if (child.nodeName && child.nodeType === ELEMENT_NODE) {
        return name === "*" || (child.nodeName.toLowerCase() === name);
      }

      return false;
    }
    return new core.NodeList(this._ownerDocument || this, mapper(this, filterByTagName, true));
  }),

  getElementsByClassName: function (className) {

    function filterByClassName(child) {
      if (!child) {
        return false;
      }

      var classString = child.className;
      if (classString) {
        var s = classString.split(" ");
        for (var i = 0; i < s.length; i++) {
          if (s[i] === className) {
            return true;
          }
        }
      }
      return false;
    }

    return new core.NodeList(this.ownerDocument || this, mapper(this, filterByClassName));
  }
});

core.DocumentFragment = function DocumentFragment(document) {
  core.Node.call(this, document);
};
inheritFrom(core.Node, core.DocumentFragment, {
  nodeType : DOCUMENT_FRAGMENT_NODE
});

core.Document = function Document(options) {
  if (!options || !options.parsingMode || (options.parsingMode !== "html" && options.parsingMode !== "xml")) {
    throw new Error("options must exist and contain a parsingMode of html or xml");
  }

  core.Node.call(this, this);
  this._parsingMode = options.parsingMode;
  this._htmlToDom = new HtmlToDom(options.parser, options.parsingMode);

  this._implementation = Object.create(core.DOMImplementation.prototype);
  this._implementation._ownerDocument = this;
  this._implementation._features = {};

  this._defaultView = options.defaultView || null;
  this._global = options.global;
  this._documentElement = null;
  this._ids = Object.create(null);
  this._attached = true;
  this._readonly = false;
  this._currentScript = null;
  this._cookieJar = options.cookieJar === undefined ? new CookieJar() : options.cookieJar;

  this._contentType = options.contentType;
  if (this._contentType === undefined) {
    this._contentType = this._parsingMode === "xml" ? "application/xml" : "text/html";
  }

  this._URL = options.url;
  if (this._URL === undefined) {
    this._URL = "about:blank";
  }
  this._location = new Location(this._URL, this);

  if (options.cookie) {
    var cookies = Array.isArray(options.cookie) ? options.cookie: [options.cookie];
    var document = this;

    cookies.forEach(function(cookieStr) {
      document._cookieJar.setCookieSync(cookieStr, document._URL, { ignoreError : true });
    });
  }

  this._activeNodeIterators = [];
  this._activeNodeIteratorsMax = options.concurrentNodeIterators === undefined ?
                                 10 :
                                 Number(options.concurrentNodeIterators);

  if (isNaN(this._activeNodeIteratorsMax)) {
    throw new TypeError("The 'concurrentNodeIterators' option must be a Number");
  }

  if (this._activeNodeIteratorsMax < 0) {
    throw new RangeError("The 'concurrentNodeIterators' option must be a non negative Number");
  }
};

core.Document._removingSteps = [];

var tagRegEx = /[^\w:\d_\.-]+/i;
var entRegEx = /[^\w\d_\-&;]+/;
var invalidAttrRegEx = /[\s"'>/=\u0000-\u001A]/;

inheritFrom(core.Node, core.Document, {
  nodeType : DOCUMENT_NODE,
  _elementBuilders : { },
  _defaultElementBuilder: function(document, tagName) {
    return new core.Element(document, tagName);
  },
  get contentType() { return this._contentType;},
  get compatMode() { return (this._parsingMode === "xml" || this.doctype) ? "CSS1Compat" : "BackCompat"; },
  get characterSet() { return "UTF-8"; },
  get inputEncoding() { return "UTF-8"; },
  get doctype() {
    for (var i = 0; i < this._childNodes.length; ++i) {
      if (this._childNodes[i].nodeType === DOCUMENT_TYPE_NODE) {
        return this._childNodes[i];
      }
    }
    return null;
  },
  get URL() {
    return this._URL;
  },
  get documentURI() {
    return this._URL;
  },
  get location() {
    return this._defaultView ? this._location : null;
  },
  get documentElement() {
    if (this._documentElement) {
      return this._documentElement;
    } else {
      for (var i = 0; i < this._childNodes.length; ++i) {
        if (this._childNodes[i].nodeType === ELEMENT_NODE) {
          this._documentElement = this._childNodes[i];
          return this._documentElement;
        }
      }
      return null;
    }
  },

  get implementation() { return this._implementation;},
  set implementation(implementation) { this._implementation = implementation;},
  get readonly() { return this._readonly;},

  get defaultView() {
    return this._defaultView;
  },

  get currentScript() {
    return this._currentScript;
  },

  toString: function () {
    return '[object HTMLDocument]';
  },

  _createElementWithCorrectElementInterface: function (name, namespace) {
    // https://dom.spec.whatwg.org/#concept-element-interface
    // TODO: eventually we should re-write the element-builder system to be namespace aware, but for now it is not.
    return (this._elementBuilders[name.toLowerCase()] || this._defaultElementBuilder)(this, name, namespace);
  },

  /* returns Attr */
  createAttribute: function (localName) {
    localName = String(localName);
    validateName(localName);

    return this._createAttributeNoNameValidation(localName);
  }, // raises: function(DOMException) {},

  _createAttributeNoNameValidation: function (localName) {
    return new core.Attr(this, localName, "");
  },

  appendChild : function(/* Node */ arg) {
    if (this.documentElement && arg.nodeType == ELEMENT_NODE) {
      throw new core.DOMException(core.DOMException.HIERARCHY_REQUEST_ERR);
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
  getElementsByTagName: memoizeQuery(function(/* string */ name) {
    function filterByTagName(child) {
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
    return new core.NodeList(this.documentElement || this, mapper(this, filterByTagName, true));
  }),

  getElementsByClassName: function (className) {

    function filterByClassName(child) {
      if (!child) {
        return false;
      }

      var classString = child.className;
      if (classString) {
        var s = classString.split(" ");
        for (var i = 0; i < s.length; i++) {
          if (s[i] === className) {
            return true;
          }
        }
      }
      return false;
    }

    return new core.NodeList(this.ownerDocument || this, mapper(this, filterByClassName));
  },

  write: function () {
    var text = "";
    for (var i = 0; i < arguments.length; ++i) {
      text += String(arguments[i]);
    }

    if (this._parsingMode === "xml") {
      throw new core.DOMException(core.DOMException.INVALID_STATE_ERR, "Cannot use document.write on XML documents");
    }

    if (this._writeAfterElement) {
      // If called from an script element directly (during the first tick),
      // the new elements are inserted right after that element.
      var tempDiv = this.createElement('div');
      setInnerHTML(this, tempDiv, text);

      var child = tempDiv.firstChild;
      var previous = this._writeAfterElement;
      var parent = this._writeAfterElement.parentNode;

      while (child) {
        var node = child;
        child = child.nextSibling;
        parent.insertBefore(node, previous.nextSibling);
        previous = node;
      }
    } else if (this.readyState === "loading") {
      // During page loading, document.write appends to the current element
      // Find the last child that has been added to the document.
      var node = this;
      while (node.lastChild && node.lastChild.nodeType === this.ELEMENT_NODE) {
        node = node.lastChild;
      }
      setInnerHTML(this, node, text);
    } else if (text) {
      setInnerHTML(this, this, text);
    }
  },
  _runRemovingSteps: function(oldNode, oldParent, oldPreviousSibling) {
    var listeners = core.Document._removingSteps;
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i](this, oldNode, oldParent, oldPreviousSibling);
    }
  }
});

core.Attr = function Attr(document, name, value) {
  core.Node.call(this, document);
  this._valueForAttrModified = value;
  this._name = name;
  this._ownerElement = null;
  this._namespaceURI = null;
  this._localName = name;
  this._prefix = null;
};
inheritFrom(core.Node, core.Attr, {
  nodeType : ATTRIBUTE_NODE,
  get namespaceURI() {
    return this._namespaceURI;
  },
  get prefix() {
    return this._prefix;
  },
  get localName() {
    return this._localName;
  },
  get name() {
    return this._name;
  },
  get ownerElement() {
    return this._ownerElement;
  },
  get nodeValue() {
    var val = '';
    for (var i=0,len=this._childNodes.length;i<len;i++) {
      var child = this._childNodes[i];
      val += child.nodeValue;
    }
    return val;
  },
  set nodeValue(value) {
    // readonly
    if (this._readonly) {
      throw new core.DOMException(core.DOMException.NO_MODIFICATION_ALLOWED_ERR);
    }

    this._childNodes.length = 1;
    this._childNodes[0] = this._ownerDocument.createTextNode(value);
    this._modified();
    var prev = this._valueForAttrModified;
    this._valueForAttrModified = value;
    this._nodeValue = value;
    if (this._ownerElement) {
      this._ownerElement._attrModified(this._name, value, prev);
    }
  },
  get specified() {
    return true;
  },
  get value() {
    return this.nodeValue;
  },
  set value(value) {
    this.nodeValue = value;
  },
  get parentNode() { return null;},

  insertBefore : function(/* Node */ newChild, /* Node*/ refChild){
    if (newChild.nodeType === CDATA_SECTION_NODE ||
        newChild.nodeType === ELEMENT_NODE)
    {
      throw new core.DOMException(core.DOMException.HIERARCHY_REQUEST_ERR);
    }

    return core.Node.prototype.insertBefore.call(this, newChild, refChild);
  },

  appendChild : function(/* Node */ arg) {

    if (arg.nodeType === CDATA_SECTION_NODE ||
        arg.nodeType === ELEMENT_NODE)
    {
      throw new core.DOMException(core.DOMException.HIERARCHY_REQUEST_ERR);
    }

    return core.Node.prototype.appendChild.call(this, arg);
  }

});
