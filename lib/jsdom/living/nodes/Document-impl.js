"use strict";

const CookieJar = require("tough-cookie").CookieJar;

const NodeImpl = require("./Node-impl").implementation;

const NODE_TYPE = require("../node-type");
const memoizeQuery = require("../../utils").memoizeQuery;
const mapper = require("../../utils").mapper;
const URL = require("../../utils").URL;
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const createLiveNodeList = require("../node-list").createLive;
const DOMException = require("../../web-idl/DOMException");
const HtmlToDom = require("../../browser/htmltodom").HtmlToDom;
const Location = require("../../browser/location");
const internalConstants = require("../helpers/internal-constants");
const createHTMLCollection = require("../html-collection").create;
const idlUtils = require("../generated/utils");
const validateName = require("../helpers/validate-names").name;
const validateAndExtract = require("../helpers/validate-names").validateAndExtract;

const clone = require("../node").clone;
const generatedAttr = require("../generated/Attr");
const listOfElementsWithClassNames = require("../node").listOfElementsWithClassNames;
const Comment = require("../generated/Comment");
const ProcessingInstruction = require("../generated/ProcessingInstruction");
const Text = require("../generated/Text");

function clearChildNodes(node) {
  for (let child = domSymbolTree.firstChild(node); child; child = domSymbolTree.firstChild(node)) {
    node.removeChild(child);
  }
}

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

function descendants(e, tagName, recursive) {
  var owner = recursive ? e._ownerDocument || e : e;
  return createHTMLCollection(owner, mapper(e, function(n) {
    return n.tagName === tagName;
  }, recursive));
}

function firstChild(e, tagName) {
  if (!e) {
    return null;
  }
  var c = descendants(e, tagName, false);
  return c.length > 0 ? c[0] : null;
}

function ResourceQueue(paused) {
  this.paused = !!paused;
}
ResourceQueue.prototype = {
  push: function(callback) {
    var q = this;
    var item = {
      prev: q.tail,
      check: function() {
        if (!q.paused && !this.prev && this.fired){
          callback(this.err, this.data);
          if (this.next) {
            this.next.prev = null;
            this.next.check();
          }else{//q.tail===this
      q.tail = null;
    }
        }
      }
    };
    if (q.tail) {
      q.tail.next = item;
    }
    q.tail = item;
    return function(err, data) {
      item.fired = 1;
      item.err = err;
      item.data = data;
      item.check();
    };
  },
  resume: function() {
    if(!this.paused){
      return;
    }
    this.paused = false;
    var head = this.tail;
    while(head && head.prev){
      head = head.prev;
    }
    if(head){
      head.check();
    }
  }
};

class RequestManager {
  constructor() {
    this.openedRequests = [];
  }
  add(req) {
    this.openedRequests.push(req);
   }
  remove(req) {
    var idx = this.openedRequests.indexOf(req);
    if(idx !== -1) {
      this.openedRequests.splice(idx, 1);
    }
  }
  close() {
    for (const openedRequest of this.openedRequests) {
      openedRequest.abort();
    }
    this.openedRequests = [];
  }
  size() {
    return this.openedRequests.length;
  }
}

const nonInheritedTags = new Set([
  "article", "section", "nav", "aside", "hgroup", "header", "footer", "address", "dt",
  "dd", "figure", "figcaption", "main", "em", "strong", "small", "s", "cite", "dfn", "abbr",
  "ruby", "rt", "rp", "code", "var", "samp", "kbd", "i", "b", "u", "mark", "bdi", "bdo", "wbr"
]);

const Event = require("../generated/Event");
const CustomEvent = require("../generated/CustomEvent");
const MessageEvent = require("../generated/MessageEvent");
const UIEvent = require("../generated/UIEvent");
const MouseEvent = require("../generated/MouseEvent");
const KeyboardEvent = require("../generated/KeyboardEvent");
const TouchEvent = require("../generated/TouchEvent");
const MutationEvent = require("../generated/MutationEvent");
const eventInterfaceTable = {
  event: Event,
  events: Event,
  htmlevents: Event,
  mouseevent: MouseEvent,
  mouseevents: MouseEvent,
  uievent: UIEvent,
  uievents: UIEvent,
  messageevent: MessageEvent,

  customevent: CustomEvent,
  keyboardevent: KeyboardEvent,
  keyevents: KeyboardEvent,
  touchevent: TouchEvent,

  // old, not part of spec anymore
  mutationevents: MutationEvent
};

class DocumentImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._core = privateData.core;

    this.nodeType = NODE_TYPE.DOCUMENT_NODE;
    if (!privateData.options || !privateData.options.parsingMode ||
        (privateData.options.parsingMode !== "html" && privateData.options.parsingMode !== "xml")) {
      throw new Error("options must exist and contain a parsingMode of html or xml");
    }

    this._parsingMode = privateData.options.parsingMode;
    this._htmlToDom = new HtmlToDom(privateData.core, privateData.options.parser, privateData.options.parsingMode);

    this._implementation = Object.create(privateData.core.DOMImplementation.prototype);
    this._implementation._ownerDocument = this;
    this._implementation._features = {};

    this._defaultView = privateData.options.defaultView || null;
    this._global = privateData.options.global;
    this._documentElement = null;
    this._ids = Object.create(null);
    this._attached = true;
    this._currentScript = null;
    this._cookieJar = privateData.options.cookieJar === undefined ? new CookieJar(null, { looseMode: true }) : privateData.options.cookieJar;

    this._contentType = privateData.options.contentType;
    if (this._contentType === undefined) {
      this._contentType = this._parsingMode === "xml" ? "application/xml" : "text/html";
    }

    this._URL = privateData.options.url === undefined ? "about:blank" : new URL(privateData.options.url).href;
    this._location = new Location(this._URL, this);

    if (privateData.options.cookie) {
      var cookies = Array.isArray(privateData.options.cookie) ? privateData.options.cookie: [privateData.options.cookie];
      var document = this;

      cookies.forEach((cookieStr) => {
        document._cookieJar.setCookieSync(cookieStr, document._URL, { ignoreError: true });
      });
    }

    this._activeNodeIterators = [];
    this._activeNodeIteratorsMax = privateData.options.concurrentNodeIterators === undefined ?
                                  10 :
                                  Number(privateData.options.concurrentNodeIterators);

    if (isNaN(this._activeNodeIteratorsMax)) {
      throw new TypeError("The 'concurrentNodeIterators' option must be a Number");
    }

    if (this._activeNodeIteratorsMax < 0) {
      throw new RangeError("The 'concurrentNodeIterators' option must be a non negative Number");
    }

    this._referrer = privateData.options.referrer;
    this._queue = new ResourceQueue(privateData.options.deferClose);
    this._customResourceLoader = privateData.options.resourceLoader;
    this[internalConstants.pool] = privateData.options.pool;
    this[internalConstants.agentOptions] = privateData.options.agentOptions;
    this[internalConstants.requestManager] = new RequestManager();
    this.readyState = 'loading';

    // Add level2 features
    this.implementation._addFeature('core'  , '2.0');
    this.implementation._addFeature('html'  , '2.0');
    this.implementation._addFeature('xhtml' , '2.0');
    this.implementation._addFeature('xml'   , '2.0');

    this._referrer = "";
  }

  _defaultElementBuilder(document, tagName) {
    if (nonInheritedTags.has(tagName.toLowerCase())) {
      return new this._core.HTMLElement(document, tagName);
    } else {
      return new this._core.HTMLUnknownElement(document, tagName);
    }
  }

  get contentType() { return this._contentType; }
  get compatMode() { return (this._parsingMode === "xml" || this.doctype) ? "CSS1Compat" : "BackCompat"; }
  get charset() { return "UTF-8"; }
  get characterSet() { return "UTF-8"; }
  get inputEncoding() { return "UTF-8"; }
  get doctype() {
    for (const childNode of domSymbolTree.childrenIterator(this)) {
      if (childNode.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
        return childNode;
      }
    }
    return null;
  }
  get URL() {
    return this._URL;
  }
  get documentURI() {
    return this._URL;
  }
  get location() {
    return this._defaultView ? this._location : null;
  }
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
  }

  get implementation() { return this._implementation; }
  set implementation(implementation) { this._implementation = implementation; }

  get defaultView() {
    return this._defaultView;
  }

  get currentScript() {
    return this._currentScript;
  }

  toString() {
    return "[object HTMLDocument]";
  }

  _createElementWithCorrectElementInterface(name, namespace) {
    const wrapper = idlUtils.wrapperForImpl(this);
    // https://dom.spec.whatwg.org/#concept-element-interface
    // TODO: eventually we should re-write the element-builder system to be namespace aware, but for now it is not.
    return (this._elementBuilders[name.toLowerCase()] || this._defaultElementBuilder.bind(this))(wrapper, name, namespace);
  }

  appendChild(/* Node */ arg) {
    if (this.documentElement && arg.nodeType === NODE_TYPE.ELEMENT_NODE) {
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
    }
    return super.appendChild(arg);
  }

  removeChild(/* Node */ arg) {
    var ret = super.removeChild(arg);
    if (arg === this._documentElement) {
      this._documentElement = null;// force a recalculation
    }
    return ret;
  }

  _descendantRemoved(parent, child) {
    if (child.tagName === 'STYLE') {
      var index = this.styleSheets.indexOf(child.sheet);
      if (index > -1) {
        this.styleSheets.splice(index, 1);
      }
    }
  }

  write() {
    let text = "";
    for (let i = 0; i < arguments.length; ++i) {
      text += String(arguments[i]);
    }

    if (this._parsingMode === "xml") {
      throw new DOMException(DOMException.INVALID_STATE_ERR, "Cannot use document.write on XML documents");
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
      let node = this;
      while (node.lastChild && node.lastChild.nodeType === NODE_TYPE.ELEMENT_NODE) {
        node = node.lastChild;
      }
      setInnerHTML(this, node, text);
    } else if (text) {
      setInnerHTML(this, this, text);
    }
  }

  writeln() {
    const args = [];
    for (let i = 0; i < arguments.length; ++i) {
      args.push(arguments[i]);
    }
    args.push("\n");
    this.write.apply(this, args);
  }

  getElementById(id) {
    // return the first element
    return (this._ids && this._ids[id] && this._ids[id].length > 0 ? this._ids[id][0] : null);
  }

  getElementsByTagNameNS(namespaceURI, localName) {
    function filterByTagName(child) {
      var localMatch = child.localName === localName,
          nsMatch    = child.namespaceURI === namespaceURI;

      if ((localMatch || localName === "*") && (nsMatch || namespaceURI === "*")) {
        if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
          return true;
        }
      }
      return false;
    }

    return createLiveNodeList(this.ownerDocument || this, mapper(this, filterByTagName));
  }
  get referrer() {
    return this._referrer || '';
  }
  get domain() {
    return "";
  }
  get images() {
    return this.getElementsByTagName('IMG');
  }
  get applets() {
    return createHTMLCollection(this, mapper(this, function(el) {
      if (el && el.tagName) {
        var upper = el.tagName.toUpperCase();
        if (upper === "APPLET") {
          return true;
        } else if (upper === "OBJECT" &&
          el.getElementsByTagName('APPLET').length > 0)
        {
          return true;
        }
      }
    }));
  }
  get links() {
    return createHTMLCollection(this, mapper(this, function(el) {
      if (el && el.tagName) {
        var upper = el.tagName.toUpperCase();
        if (upper === "AREA" || (upper === "A" && el.href)) {
          return true;
        }
      }
    }));
  }
  get forms() {
    return this.getElementsByTagName('FORM');
  }
  get anchors() {
    return this.getElementsByTagName('A');
  }
  open() {
    for (let child = null; child = domSymbolTree.firstChild(this);) {
      this.removeChild(child);
    }
    this._documentElement = null;
    this._modified();
    return this;
  }
  close() {
    this._queue.resume();

    // Set the readyState to 'complete' once all resources are loaded.
    // As a side-effect the document's load-event will be dispatched.
    resourceLoader.enqueue(this, null, function() {
      this.readyState = 'complete';
      var ev = this.createEvent('HTMLEvents');
      ev.initEvent('DOMContentLoaded', false, false);
      this.dispatchEvent(ev);
    })(null, true);
  }

  getElementsByName(elementName) {
    return createHTMLCollection(this, mapper(this, function(el) {
      return (el.getAttribute && el.getAttribute("name") === elementName);
    }));
  }

  get title() {
    var head = this.head,
      title = head ? firstChild(head, 'TITLE') : null;
    return title ? title.textContent : '';
  }

  set title(val) {
    var title = firstChild(this.head, 'TITLE');
    if (!title) {
      title = this.createElement('TITLE');
      var head = this.head;
      if (!head) {
        head = this.createElement('HEAD');
        this.documentElement.insertBefore(head, this.documentElement.firstChild);
      }
      head.appendChild(title);
    }
    title.textContent = val;
  }

  get head() {
    return firstChild(this.documentElement, 'HEAD');
  }

  get body() {
    var body = firstChild(this.documentElement, 'BODY');
    if (!body) {
      body = firstChild(this.documentElement, 'FRAMESET');
    }
    return body;
  }

  _runRemovingSteps(oldNode, oldParent, oldPreviousSibling) {
    const listeners = DocumentImpl._removingSteps;
    for (let i = 0; i < listeners.length; ++i) {
      listeners[i](this, oldNode, oldParent, oldPreviousSibling);
    }
  }

  createEvent(type) {
    const typeLower = type.toLowerCase();
    const Event = eventInterfaceTable[typeLower] || null;

    if (!Event) {
      throw new DOMException(DOMException.NOT_SUPPORTED_ERR,
        "The provided event type (\"" + type + "\") is invalid");
    }

    return Event.create([""]);
  }

  createProcessingInstruction(target, data) {
    validateName(target);

    if (data.indexOf("?>") !== -1) {
      throw new DOMException(DOMException.INVALID_CHARACTER_ERR,
        "Processing instruction data cannot contain the string \"?>\"");
    }

    return ProcessingInstruction.create([], {
      ownerDocument: this,
      target,
      data
    });
  }

  createTextNode(data) {
    return Text.create([], {
      ownerDocument: idlUtils.wrapperForImpl(this),
      data
    });
  }

  createComment(data) {
    return Comment.create([], {
      ownerDocument: idlUtils.wrapperForImpl(this),
      data
    });
  }

  createElement(localName) {
    validateName(localName);
    if (this._parsingMode === "html") {
      localName = localName.toLowerCase();
    }

    const element = this._createElementWithCorrectElementInterface(localName, "http://www.w3.org/1999/xhtml");
    element._namespaceURI = "http://www.w3.org/1999/xhtml";
    element._localName = localName;

    return element;
  }

  createElementNS(namespace, qualifiedName) {
    namespace = namespace !== null ? String(namespace) : namespace;

    const extracted = validateAndExtract(namespace, qualifiedName);

    const element = this._createElementWithCorrectElementInterface(extracted.localName, extracted.namespace);
    element._namespaceURI = extracted.namespace;
    element._prefix = extracted.prefix;
    element._localName = extracted.localName;

    return element;
  }

  createDocumentFragment() {
    return new this._core.DocumentFragment(this);
  }

  createAttribute(localName) {
    if (arguments.length < 1) {
      throw new TypeError("not enough arguments to Document.prototype.createAttribute");
    }
    localName = String(localName);

    validateName(localName);

    if (this._parsingMode === "html") {
      localName = localName.toLowerCase();
    }

    return generatedAttr.create([], { localName });
  }

  createAttributeNS(namespace, name) {
    if (namespace === undefined) {
      namespace = null;
    }
    namespace = namespace !== null ? String(namespace) : namespace;

    const extracted = validateAndExtract(namespace, name);
    return generatedAttr.create([], {
      namespace: extracted.namespace,
      namespacePrefix: extracted.prefix,
      localName: extracted.localName
    });
  }

  importNode(node, deep) {
    if (!("_ownerDocument" in node)) {
      throw new TypeError("First argument to importNode must be a Node");
    }
    deep = Boolean(deep);

    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "Cannot import a document node");
    }

    return clone(this._core, node, this, deep);
  }

  get cookie() {
    return this._cookieJar.getCookieStringSync(this._URL, { http: false });
  }
  set cookie(cookieStr) {
    cookieStr = String(cookieStr);
    this._cookieJar.setCookieSync(cookieStr, this._URL, {
      http: false,
      ignoreError: true
    });
  }
}

DocumentImpl._removingSteps = [];

DocumentImpl.prototype._elementBuilders = Object.create(null);

DocumentImpl.prototype.getElementsByTagName = memoizeQuery(function (name) {
  function filterByTagName(child) {
    if (child.nodeName && child.nodeType === NODE_TYPE.ELEMENT_NODE) {
      if (name === "*") {
        return true;

        // case insensitivity for html
      } else if (child._ownerDocument && child._ownerDocument._doctype &&
        // child._ownerDocument._doctype.name === "html" &&
        child.nodeName.toLowerCase() === name.toLowerCase()) {
        return true;
      } else if (child.nodeName.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
  return createLiveNodeList(this.documentElement || this, mapper(this, filterByTagName, true));
});

DocumentImpl.prototype.getElementsByClassName = memoizeQuery(function getElementsByClassName(classNames) {
  return listOfElementsWithClassNames(classNames, this);
});

module.exports = {
  implementation: DocumentImpl
};
