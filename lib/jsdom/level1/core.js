"use strict";
/*
  ServerJS Javascript DOM Level 1
*/
var inheritFrom = require("../utils").inheritFrom;
var domToHtml = require("../browser/domtohtml").domToHtml;
var memoizeQuery = require("../utils").memoizeQuery;
var HtmlToDom = require("../browser/htmltodom").HtmlToDom;
var Location = require("../browser/location");
var vm = require("vm");
var CookieJar = require('tough-cookie').CookieJar;
var attributes = require("../living/attributes");
var mapper = require("../utils").mapper;
var clone = require("../living/node").clone;
const URL = require("../utils").URL;
const domSymbolTree = require("../living/helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../living/node-type");
const createLiveNodeList = require("../living/node-list").createLive;

function setInnerHTML(document, node, html) {
  // Clear the children first:
  if (node._templateContents) {
    clearChildNodes(node._templateContents);
  } else {
    clearChildNodes(node);
  }

  if (html !== "") {
    if (node.nodeName === "#document") {
      document._htmlToDom.appendHtmlToDocument(html, node);
    } else {
      document._htmlToDom.appendHtmlToElement(html, node);
    }
  }
}

function clearChildNodes(node) {
  for (let child = null; child = domSymbolTree.firstChild(node);) {
    node.removeChild(child);
  }
}

var core = exports;

core.DOMException = require("../web-idl/DOMException");
core.NamedNodeMap = require("../living/attributes").NamedNodeMap;

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

const Node = require("../living/generated/Node");
core.Node = Node.interface;

core.Element = function Element(document, localName) {
  Node.setup(this, [], { ownerDocument: document });
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

  nodeType : NODE_TYPE.ELEMENT_NODE,
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
    return domToHtml([this]);
  },

  set outerHTML(html) {
    if (html === null) {
      html = "";
    }

    var parent = domSymbolTree.parent(this);
    var document = this._ownerDocument;

    if (!parent) {
      return;
    }

    var contextElement;
    if (parent.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      throw new core.DOMException(core.DOMException.NO_MODIFICATION_ALLOWED_ERR,
                                  "Modifications are not allowed for this document");
    } else if (parent.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      contextElement = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
    } else if (parent.nodeType === NODE_TYPE.ELEMENT_NODE) {
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
        return domToHtml(domSymbolTree.childrenIterator(this));
      }
    }

    // In case of <template> we should pass its "template contents" fragment as a serialization root if we have one
    if (this._templateContents) {
      return domToHtml(domSymbolTree.childrenIterator(this._templateContents));
    }

    return domToHtml(domSymbolTree.childrenIterator(this));
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
      if (child.nodeName && child.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return name === "*" || (child.nodeName.toLowerCase() === name);
      }

      return false;
    }
    return createLiveNodeList(this._ownerDocument || this, mapper(this, filterByTagName, true));
  }),
});

core.DocumentFragment = require("../living/generated/DocumentFragment").interface;

core.Document = function Document(options) {
  if (!options || !options.parsingMode || (options.parsingMode !== "html" && options.parsingMode !== "xml")) {
    throw new Error("options must exist and contain a parsingMode of html or xml");
  }

  Node.setup(this, [], { ownerDocument: this });
  this._parsingMode = options.parsingMode;
  this._htmlToDom = new HtmlToDom(core, options.parser, options.parsingMode);

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
  this._cookieJar = options.cookieJar === undefined ? new CookieJar(null, { looseMode: true }) : options.cookieJar;

  this._contentType = options.contentType;
  if (this._contentType === undefined) {
    this._contentType = this._parsingMode === "xml" ? "application/xml" : "text/html";
  }

  this._URL = options.url === undefined ? "about:blank" : new URL(options.url).href;
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

inheritFrom(core.Node, core.Document, {
  nodeType : NODE_TYPE.DOCUMENT_NODE,
  _elementBuilders : { },
  _defaultElementBuilder: function(document, tagName) {
    return new core.Element(document, tagName);
  },
  get contentType() { return this._contentType;},
  get compatMode() { return (this._parsingMode === "xml" || this.doctype) ? "CSS1Compat" : "BackCompat"; },
  get charset() { return "UTF-8"; },
  get characterSet() { return "UTF-8"; },
  get inputEncoding() { return "UTF-8"; },
  get doctype() {
    for (const childNode of domSymbolTree.childrenIterator(this)) {
      if (childNode.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
        return childNode;
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
    }

    for (const childNode of domSymbolTree.childrenIterator(this)) {
      if (childNode.nodeType === NODE_TYPE.ELEMENT_NODE) {
        this._documentElement = childNode;
        return childNode;
      }
    }

    return null;

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

  appendChild : function(/* Node */ arg) {
    if (this.documentElement && arg.nodeType == NODE_TYPE.ELEMENT_NODE) {
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

  _descendantRemoved: function(parent, child) {
    if (child.tagName === 'STYLE') {
      var index = this.styleSheets.indexOf(child.sheet);
      if (index > -1) {
        this.styleSheets.splice(index, 1);
      }
    }
  },

  /* returns NodeList */
  getElementsByTagName: memoizeQuery(function(/* string */ name) {
    function filterByTagName(child) {
      if (child.nodeName && child.nodeType === NODE_TYPE.ELEMENT_NODE)
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
    return createLiveNodeList(this.documentElement || this, mapper(this, filterByTagName, true));
  }),

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
      while (node.lastChild && node.lastChild.nodeType === NODE_TYPE.ELEMENT_NODE) {
        node = node.lastChild;
      }
      setInnerHTML(this, node, text);
    } else if (text) {
      setInnerHTML(this, this, text);
    }
  },

  writeln: function () {
    const args = [];
    for (let i = 0; i < arguments.length; ++i) {
      args.push(arguments[i]);
    }
    args.push("\n");
    this.write.apply(this, args);
  },

  _runRemovingSteps: function(oldNode, oldParent, oldPreviousSibling) {
    var listeners = core.Document._removingSteps;
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i](this, oldNode, oldParent, oldPreviousSibling);
    }
  }
});
