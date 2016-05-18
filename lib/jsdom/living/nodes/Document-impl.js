"use strict";

const CookieJar = require("tough-cookie").CookieJar;

const NodeImpl = require("./Node-impl").implementation;
const isNodeImpl = require("../generated/Node").isImpl;

const NODE_TYPE = require("../node-type");
const memoizeQuery = require("../../utils").memoizeQuery;
const mapper = require("../../utils").mapper;
const whatwgURL = require("whatwg-url");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const createLiveNodeList = require("../node-list").createLive;
const DOMException = require("../../web-idl/DOMException");
const HtmlToDom = require("../../browser/htmltodom").HtmlToDom;
const History = require("../generated/History");
const Location = require("../generated/Location");
const createHTMLCollection = require("../html-collection").create;
const idlUtils = require("../generated/utils");
const validateName = require("../helpers/validate-names").name;
const validateAndExtract = require("../helpers/validate-names").validateAndExtract;
const resourceLoader = require("../../browser/resource-loader");

const clone = require("../node").clone;
const generatedAttr = require("../generated/Attr");
const listOfElementsWithClassNames = require("../node").listOfElementsWithClassNames;
const Comment = require("../generated/Comment");
const ProcessingInstruction = require("../generated/ProcessingInstruction");
const Text = require("../generated/Text");
const DocumentFragment = require("../generated/DocumentFragment");
const DOMImplementation = require("../generated/DOMImplementation");
const ParentNodeImpl = require("./ParentNode-impl").implementation;
const HTMLElement = require("../generated/HTMLElement");
const HTMLUnknownElement = require("../generated/HTMLUnknownElement");
const TreeWalker = require("../generated/TreeWalker");

const CustomEvent = require("../generated/CustomEvent");
const ErrorEvent = require("../generated/ErrorEvent");
const Event = require("../generated/Event");
const FocusEvent = require("../generated/FocusEvent");
const HashChangeEvent = require("../generated/HashChangeEvent");
const KeyboardEvent = require("../generated/KeyboardEvent");
const MessageEvent = require("../generated/MessageEvent");
const MouseEvent = require("../generated/MouseEvent");
const PopStateEvent = require("../generated/PopStateEvent");
const ProgressEvent = require("../generated/ProgressEvent");
const TouchEvent = require("../generated/TouchEvent");
const UIEvent = require("../generated/UIEvent");

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
  const owner = recursive ? e._ownerDocument || e : e;
  return createHTMLCollection(owner, mapper(e, n => n.tagName === tagName, recursive));
}

function firstChild(e, tagName) {
  if (!e) {
    return null;
  }
  const c = descendants(e, tagName, false);
  return c.length > 0 ? idlUtils.implForWrapper(c[0]) : null;
}

class ResourceQueue {
  constructor(paused) {
    this.paused = Boolean(paused);
  }

  push(callback) {
    const q = this;
    const item = {
      prev: q.tail,
      check() {
        if (!q.paused && !this.prev && this.fired) {
          callback(this.err, this.data, this.response);
          if (this.next) {
            this.next.prev = null;
            this.next.check();
          } else { // q.tail===this
            q.tail = null;
          }
        }
      }
    };
    if (q.tail) {
      q.tail.next = item;
    }
    q.tail = item;
    return (err, data, response) => {
      item.fired = 1;
      item.err = err;
      item.data = data;
      item.response = response;
      item.check();
    };
  }

  resume() {
    if (!this.paused) {
      return;
    }
    this.paused = false;

    let head = this.tail;
    while (head && head.prev) {
      head = head.prev;
    }
    if (head) {
      head.check();
    }
  }
}

class RequestManager {
  constructor() {
    this.openedRequests = [];
  }

  add(req) {
    this.openedRequests.push(req);
  }

  remove(req) {
    const idx = this.openedRequests.indexOf(req);
    if (idx !== -1) {
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

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

function toLastModifiedString(date) {
  return pad(date.getMonth() + 1) +
    "/" + pad(date.getDate()) +
    "/" + date.getFullYear() +
    " " + pad(date.getHours()) +
    ":" + pad(date.getMinutes()) +
    ":" + pad(date.getSeconds());
}

const nonInheritedTags = new Set([
  "article", "section", "nav", "aside", "hgroup", "header", "footer", "address", "dt",
  "dd", "figure", "figcaption", "main", "em", "strong", "small", "s", "cite", "dfn", "abbr",
  "ruby", "rt", "rp", "code", "var", "samp", "kbd", "i", "b", "u", "mark", "bdi", "bdo", "wbr"
]);

const eventInterfaceTable = {
  customevent: CustomEvent,
  errorevent: ErrorEvent,
  event: Event,
  events: Event,
  focusevent: FocusEvent,
  hashchangeevent: HashChangeEvent,
  htmlevents: Event,
  keyboardevent: KeyboardEvent,
  messageevent: MessageEvent,
  mouseevent: MouseEvent,
  mouseevents: MouseEvent,
  popstateevent: PopStateEvent,
  progressevent: ProgressEvent,
  svgevents: Event,
  touchevent: TouchEvent,
  uievent: UIEvent,
  uievents: UIEvent
};

class DocumentImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._ownerDocument = this;
    this.nodeType = NODE_TYPE.DOCUMENT_NODE;
    if (!privateData.options) {
      privateData.options = {};
    }
    if (!privateData.options.parsingMode) {
      privateData.options.parsingMode = "xml";
    }

    this._parsingMode = privateData.options.parsingMode;
    this._htmlToDom = new HtmlToDom(privateData.core, privateData.options.parser, privateData.options.parsingMode);

    this._implementation = DOMImplementation.createImpl([], {
      core: this._core,
      ownerDocument: this
    });

    this._defaultView = privateData.options.defaultView || null;
    this._global = privateData.options.global;
    this._documentElement = null;
    this._ids = Object.create(null);
    this._attached = true;
    this._currentScript = null;
    this._cookieJar = privateData.options.cookieJar;
    if (this._cookieJar === undefined) {
      this._cookieJar = new CookieJar(null, { looseMode: true });
    }

    this._contentType = privateData.options.contentType;
    this._encoding = privateData.options.encoding;

    const urlOption = privateData.options.url === undefined ? "about:blank" : privateData.options.url;
    this._URL = whatwgURL.parseURL(urlOption);
    this._origin = new whatwgURL.URL(urlOption).origin;
    this._location = Location.createImpl([], { relevantDocument: this });
    this._history = History.createImpl([], {
      window: this._defaultView,
      document: this,
      actAsIfLocationReloadCalled: () => this._location.reload()
    });

    if (privateData.options.cookie) {
      const cookies = Array.isArray(privateData.options.cookie) ?
        privateData.options.cookie : [privateData.options.cookie];
      const document = this;

      cookies.forEach(cookieStr => {
        document._cookieJar.setCookieSync(cookieStr, document.URL, { ignoreError: true });
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

    this._referrer = privateData.options.referrer || "";
    this._lastModified = toLastModifiedString(privateData.options.lastModified || new Date());
    this._queue = new ResourceQueue(privateData.options.deferClose);
    this._customResourceLoader = privateData.options.resourceLoader;
    this._pool = privateData.options.pool;
    this._agentOptions = privateData.options.agentOptions;
    this._strictSSL = privateData.options.strictSSL;
    this._proxy = privateData.options.proxy;
    this._requestManager = new RequestManager();
    this.readyState = "loading";

    this._lastFocusedElement = null;

    // Add level2 features
    this.implementation._addFeature("core", "2.0");
    this.implementation._addFeature("html", "2.0");
    this.implementation._addFeature("xhtml", "2.0");
    this.implementation._addFeature("xml", "2.0");
  }

  _defaultElementBuilder(document, tagName) {
    if (nonInheritedTags.has(tagName.toLowerCase())) {
      return HTMLElement.create([], {
        core: this._core,
        ownerDocument: this,
        localName: tagName
      });
    }
    return HTMLUnknownElement.create([], {
      core: this._core,
      ownerDocument: this,
      localName: tagName
    });
  }

  get contentType() {
    return this._contentType || (this._parsingMode === "xml" ? "application/xml" : "text/html");
  }
  get compatMode() {
    return this._parsingMode === "xml" || this.doctype ? "CSS1Compat" : "BackCompat";
  }
  get charset() {
    return this._encoding;
  }
  get characterSet() {
    return this._encoding;
  }
  get inputEncoding() {
    return this._encoding;
  }
  get doctype() {
    for (const childNode of domSymbolTree.childrenIterator(this)) {
      if (childNode.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
        return childNode;
      }
    }
    return null;
  }
  get URL() {
    return whatwgURL.serializeURL(this._URL);
  }
  get documentURI() {
    return whatwgURL.serializeURL(this._URL);
  }
  get origin() {
    return this._origin;
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

  get implementation() {
    return this._implementation;
  }
  set implementation(implementation) {
    this._implementation = implementation;
  }

  get defaultView() {
    return this._defaultView;
  }

  get currentScript() {
    return this._currentScript;
  }

  get activeElement() {
    if (this._lastFocusedElement) {
      return this._lastFocusedElement;
    }

    return this.body;
  }

  toString() {
    return "[object HTMLDocument]";
  }

  _createElementWithCorrectElementInterface(name, namespace) {
    // https://dom.spec.whatwg.org/#concept-element-interface
    // TODO: eventually we should re-write the element-builder system to be namespace aware, but for now it is not.
    const builder = this._elementBuilders[name.toLowerCase()] || this._defaultElementBuilder.bind(this);
    const elem = builder(this, name, namespace);
    return idlUtils.implForWrapper(elem);
  }

  appendChild(/* Node */ arg) {
    if (this.documentElement && arg.nodeType === NODE_TYPE.ELEMENT_NODE) {
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
    }
    return super.appendChild(arg);
  }

  removeChild(/* Node */ arg) {
    const ret = super.removeChild(arg);
    if (arg === this._documentElement) {
      this._documentElement = null;// force a recalculation
    }
    return ret;
  }

  _descendantRemoved(parent, child) {
    if (child.tagName === "STYLE") {
      const index = this.styleSheets.indexOf(child.sheet);
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
      const tempDiv = this.createElement("div");
      setInnerHTML(this, tempDiv, text);

      let child = tempDiv.firstChild;
      let previous = this._writeAfterElement;
      const parent = this._writeAfterElement.parentNode;

      while (child) {
        const node = child;
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
    return this._ids[id] && this._ids[id].length > 0 ? this._ids[id][0] : null;
  }

  getElementsByTagNameNS(namespaceURI, localName) {
    function filterByTagName(child) {
      const localMatch = child.localName === localName;
      const nsMatch = child.namespaceURI === namespaceURI;

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
    return this._referrer || "";
  }
  get lastModified() {
    return this._lastModified;
  }
  get images() {
    return this.getElementsByTagName("IMG");
  }
  get applets() {
    return createHTMLCollection(this, mapper(this, el => {
      if (el && el.tagName) {
        const upper = el.tagName.toUpperCase();
        if (upper === "APPLET") {
          return true;
        } else if (upper === "OBJECT" && el.getElementsByTagName("APPLET").length > 0) {
          return true;
        }
      }

      return false;
    }));
  }
  get links() {
    return createHTMLCollection(this, mapper(this, el => {
      if (el && el.tagName) {
        const upper = el.tagName.toUpperCase();
        if (upper === "AREA" || (upper === "A" && el.href)) {
          return true;
        }
      }

      return false;
    }));
  }
  get forms() {
    return this.getElementsByTagName("FORM");
  }
  get anchors() {
    return this.getElementsByTagName("A");
  }
  open() {
    let child = domSymbolTree.firstChild(this);
    while (child) {
      this.removeChild(child);
      child = domSymbolTree.firstChild(this);
    }
    this._documentElement = null;
    this._modified();
    return this;
  }
  close() {
    this._queue.resume();

    // Set the readyState to 'complete' once all resources are loaded.
    // As a side-effect the document's load-event will be dispatched.
    resourceLoader.enqueue(this, null, function () {
      this.readyState = "complete";
      const ev = this.createEvent("HTMLEvents");
      ev.initEvent("DOMContentLoaded", false, false);
      this.dispatchEvent(ev);
    })(null, true);
  }

  getElementsByName(elementName) {
    return createHTMLCollection(this, mapper(this, el => el.getAttribute && el.getAttribute("name") === elementName));
  }

  get title() {
    const head = this.head;
    const title = head ? firstChild(head, "TITLE") : null;
    return title ? title.textContent : "";
  }

  set title(val) {
    let title = firstChild(this.head, "TITLE");
    if (!title) {
      title = this.createElement("TITLE");
      let head = this.head;
      if (!head) {
        head = this.createElement("HEAD");
        this.documentElement.insertBefore(head, this.documentElement.firstChild);
      }
      head.appendChild(title);
    }
    title.textContent = val;
  }

  get head() {
    return firstChild(this.documentElement, "HEAD");
  }

  get body() {
    let body = firstChild(this.documentElement, "BODY");
    if (!body) {
      body = firstChild(this.documentElement, "FRAMESET");
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
    const eventWrapper = eventInterfaceTable[typeLower] || null;

    if (!eventWrapper) {
      throw new DOMException(DOMException.NOT_SUPPORTED_ERR,
        "The provided event type (\"" + type + "\") is invalid");
    }

    const impl = eventWrapper.createImpl([""]);
    impl._initializedFlag = false;
    return impl;
  }

  createProcessingInstruction(target, data) {
    validateName(target);

    if (data.indexOf("?>") !== -1) {
      throw new DOMException(DOMException.INVALID_CHARACTER_ERR,
        "Processing instruction data cannot contain the string \"?>\"");
    }

    return ProcessingInstruction.createImpl([], {
      core: this._core,
      ownerDocument: this,
      target,
      data
    });
  }

  createTextNode(data) {
    return Text.createImpl([], {
      core: this._core,
      ownerDocument: this,
      data
    });
  }

  createComment(data) {
    return Comment.createImpl([], {
      core: this._core,
      ownerDocument: this,
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
    return DocumentFragment.createImpl([], { ownerDocument: this });
  }

  createAttribute(localName) {
    validateName(localName);

    if (this._parsingMode === "html") {
      localName = localName.toLowerCase();
    }

    return generatedAttr.createImpl([], { localName });
  }

  createAttributeNS(namespace, name) {
    if (namespace === undefined) {
      namespace = null;
    }
    namespace = namespace !== null ? String(namespace) : namespace;

    const extracted = validateAndExtract(namespace, name);
    return generatedAttr.createImpl([], {
      namespace: extracted.namespace,
      namespacePrefix: extracted.prefix,
      localName: extracted.localName
    });
  }

  // TODO: Add callback interface support to `webidl2js`
  createTreeWalker(root, whatToShow, filter) {
    if (!isNodeImpl(root)) {
      throw new TypeError("First argument to createTreeWalker must be a Node");
    }

    return TreeWalker.createImpl([], {
      root,
      whatToShow,
      filter
    });
  }

  importNode(node, deep) {
    if (!isNodeImpl(node)) {
      throw new TypeError("First argument to importNode must be a Node");
    }
    deep = Boolean(deep);

    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "Cannot import a document node");
    }

    return clone(this._core, node, this, deep);
  }

  adoptNode(node) {
    if (!isNodeImpl(node)) {
      throw new TypeError("First argument to adoptNode must be a Node");
    }
    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "Cannot adopt a document node");
    }
    // TODO: Determine correct way to detect a shadow root
    // See also https://github.com/w3c/webcomponents/issues/182

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
    node._ownerDocument = this;
    for (const descendant of domSymbolTree.treeIterator(node)) {
      descendant._ownerDocument = this;
    }

    return node;
  }

  get cookie() {
    return this._cookieJar.getCookieStringSync(this.URL, { http: false });
  }
  set cookie(cookieStr) {
    cookieStr = String(cookieStr);
    this._cookieJar.setCookieSync(cookieStr, this.URL, {
      http: false,
      ignoreError: true
    });
  }

  get styleSheets() {
    if (!this._styleSheets) {
      this._styleSheets = new this._core.StyleSheetList();
    }

    // TODO: each style and link element should register its sheet on creation
    // and remove it on removal.
    return this._styleSheets;
  }

  get hidden() {
    return true;
  }

  get visibilityState() {
    return "prerender";
  }
}

idlUtils.mixin(DocumentImpl.prototype, ParentNodeImpl.prototype);

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
