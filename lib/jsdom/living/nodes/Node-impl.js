"use strict";

const vm = require("vm");

const EventTargetImpl = require("../events/EventTarget-impl").implementation;
const MutationEvent = require("../generated/MutationEvent").interface;

const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const DOMException = require("../../web-idl/DOMException");
const NODE_TYPE = require("../node-type");
const resetDOMTokenList = require("../dom-token-list").reset;
const createLiveNodeList = require("../node-list").createLive;
const updateNodeList = require("../node-list").update;
const updateHTMLCollection = require("../html-collection").update;
const namedPropertiesWindow = require("../named-properties-window");
const proxiedWindowEventHandlers = require("../helpers/proxied-window-event-handlers");

function attachId(id, elm, doc) {
  if (id && elm && doc) {
    if (!doc._ids[id]) {
      doc._ids[id] = [];
    }
    doc._ids[id].push(elm);
  }
}

function detachId(id, elm, doc) {
  if (id && elm && doc) {
    if (doc._ids && doc._ids[id]) {
      const elms = doc._ids[id];
      for (let i = 0; i < elms.length; i++) {
        if (elms[i] === elm) {
          elms.splice(i, 1);
          --i;
        }
      }
      if (elms.length === 0) {
        delete doc._ids[id];
      }
    }
  }
}

class NodeImpl extends EventTargetImpl {
  constructor(args, privateData) {
    super();

    domSymbolTree.initialize(this);

    this._ownerDocument = privateData.ownerDocument;
    this.readonly = false;

    this._childNodesList = null;
    this._childrenList = null;
    this._version = 0;
    this._memoizedQueries = {};
  }

  get nodeValue() {
    if (this.nodeType === NODE_TYPE.TEXT_NODE ||
      this.nodeType === NODE_TYPE.COMMENT_NODE ||
      this.nodeType === NODE_TYPE.PROCESSING_INSTRUCTION_NODE) {
      return this._data;
    }

    return null;
  }

  set nodeValue(value) {
    if (this.nodeType === NODE_TYPE.TEXT_NODE ||
      this.nodeType === NODE_TYPE.COMMENT_NODE ||
      this.nodeType === NODE_TYPE.PROCESSING_INSTRUCTION_NODE) {
      this.replaceData(0, this.length, value);
    }
  }

  get parentNode() {
    return domSymbolTree.parent(this);
  }

  get nodeName() {
    switch (this.nodeType) {
      case NODE_TYPE.ELEMENT_NODE:
        return this.tagName;
      case NODE_TYPE.TEXT_NODE:
        return "#text";
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
        return this.target;
      case NODE_TYPE.COMMENT_NODE:
        return "#comment";
      case NODE_TYPE.DOCUMENT_NODE:
        return "#document";
      case NODE_TYPE.DOCUMENT_TYPE_NODE:
        return this.name;
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
        return "#document-fragment";
    }
  }

  get firstChild() {
    return domSymbolTree.firstChild(this);
  }

  get ownerDocument() {
    // TODO: when we move nodeType to Node.prototype and add an internal _nodeType, consult that instead.
    return this.nodeType === NODE_TYPE.DOCUMENT_NODE ? null : this._ownerDocument;
  }

  get lastChild() {
    return domSymbolTree.lastChild(this);
  }

  get childNodes() {
    if (!this._childNodesList) {
      const self = this;
      this._childNodesList = createLiveNodeList(this, () => {
        return domSymbolTree.childrenToArray(self);
      });
    } else {
      updateNodeList(this._childNodesList);
    }

    return this._childNodesList;
  }

  get nextSibling() {
    return domSymbolTree.nextSibling(this);
  }

  get previousSibling() {
    return domSymbolTree.previousSibling(this);
  }

  insertBefore(newChild, refChild) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Node.prototype.insertBefore");
    }
    if (refChild === undefined) {
      refChild = null;
    }

    // TODO branding
    if (!newChild || !("nodeType" in newChild)) {
      throw new TypeError("First argument to Node.prototype.insertBefore must be a Node");
    }
    if (refChild !== null && !("nodeType" in refChild)) {
      throw new TypeError("Second argument to Node.prototype.insertBefore must be a Node or null or undefined");
    }

    if (this.readonly === true) {
      throw new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR, "Attempting to modify a read-only node");
    }

    // DocumentType must be implicitly adopted
    if (newChild.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
      newChild._ownerDocument = this._ownerDocument;
    }

    // TODO - if (!newChild) then?
    if (this.nodeName !== "#document" && newChild._ownerDocument !== this._ownerDocument) {
      throw new DOMException(DOMException.WRONG_DOCUMENT_ERR);
    }

    if (newChild.nodeType && newChild.nodeType === NODE_TYPE.ATTRIBUTE_NODE) {
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
    }

    // search for parents matching the newChild
    for (const ancestor of domSymbolTree.ancestorsIterator(this)) {
      if (ancestor === newChild) {
        throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
      }
    }

    // fragments are merged into the element (except parser-created fragments in <template>)
    if (newChild.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      let grandChild;
      while ((grandChild = domSymbolTree.firstChild(newChild))) {
        newChild.removeChild(grandChild);
        this.insertBefore(grandChild, refChild);
      }
    } else if (newChild === refChild) {
      return newChild;
    } else {
      const oldParent = domSymbolTree.parent(newChild);
      // if the newChild is already in the tree elsewhere, remove it first
      if (oldParent) {
        oldParent.removeChild(newChild);
      }

      if (refChild === null) {
        domSymbolTree.appendChild(this, newChild);
      } else {
        if (domSymbolTree.parent(refChild) !== this) {
          throw new DOMException(DOMException.NOT_FOUND_ERR);
        }

        domSymbolTree.insertBefore(refChild, newChild);
      }

      this._modified();

      if (this._attached && newChild._attach) {
        newChild._attach();
      }

      this._descendantAdded(this, newChild);
    }

    return newChild;
  } // raises(DOMException);

  _modified() {
    this._version++;
    if (this._ownerDocument) {
      this._ownerDocument._version++;
    }

    if (this._childrenList) {
      updateHTMLCollection(this._childrenList);
    }
    if (this._childNodesList) {
      updateNodeList(this._childNodesList);
    }
    this._clearMemoizedQueries();
  }

  _clearMemoizedQueries() {
    this._memoizedQueries = {};
    const myParent = domSymbolTree.parent(this);
    if (myParent) {
      myParent._clearMemoizedQueries();
    }
  }

  _descendantRemoved(parent, child) {
    const myParent = domSymbolTree.parent(this);
    if (myParent) {
      myParent._descendantRemoved(parent, child);
    }
  }

  _descendantAdded(parent, child) {
    const myParent = domSymbolTree.parent(this);
    if (myParent) {
      myParent._descendantAdded(parent, child);
    }
  }

  _attrModified(name, value, oldValue) {
    this._modified();
    namedPropertiesWindow.elementAttributeModified(this, name, value, oldValue);

    if (name === "id" && this._attached) {
      const doc = this._ownerDocument;
      detachId(oldValue, this, doc);
      attachId(value, this, doc);
    }

    // TODO event handlers:
    // The correct way to do this is lazy, and a bit more complicated; see
    // https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-content-attributes
    // It would only be possible if we had proper getters/setters for every event handler, which we don't right now.
    if (name.length > 2 && name[0] === "o" && name[1] === "n") {
      if (value) {
        const w = this._ownerDocument._global;
        const self = proxiedWindowEventHandlers.has(name) && this._localName === "body" ? w : this;
        const vmOptions = { filename: this._ownerDocument._URL, displayErrors: false };

        // The handler code probably refers to functions declared globally on the window, so we need to run it in
        // that context. In fact, it's worse; see
        // https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/bindings/core/v8/V8LazyEventListener.cpp
        // plus the spec, which show how multiple nested scopes are technically required. We won't implement that
        // until someone asks for it, though.

        // https://html.spec.whatwg.org/multipage/webappapis.html#the-event-handler-processing-algorithm

        if (name === "onerror" && self === w) {
          // https://html.spec.whatwg.org/multipage/webappapis.html#getting-the-current-value-of-the-event-handler
          // step 10

          self[name] = function (event, source, lineno, colno, error) {
            w.__tempEventHandlerThis = this;
            w.__tempEventHandlerEvent = event;
            w.__tempEventHandlerSource = source;
            w.__tempEventHandlerLineno = lineno;
            w.__tempEventHandlerColno = colno;
            w.__tempEventHandlerError = error;

            try {
              return vm.runInContext(`
                (function (event, source, lineno, colno, error) {
                  ${value}
                }).call(__tempEventHandlerThis, __tempEventHandlerEvent, __tempEventHandlerSource,
                        __tempEventHandlerLineno, __tempEventHandlerColno, __tempEventHandlerError)`, w, vmOptions);
            } finally {
              delete w.__tempEventHandlerThis;
              delete w.__tempEventHandlerEvent;
              delete w.__tempEventHandlerSource;
              delete w.__tempEventHandlerLineno;
              delete w.__tempEventHandlerColno;
              delete w.__tempEventHandlerError;
            }
          };
        } else {
          self[name] = function (event) {
            w.__tempEventHandlerThis = this;
            w.__tempEventHandlerEvent = event;

            try {
              return vm.runInContext(`
                (function (event) {
                  ${value}
                }).call(__tempEventHandlerThis, __tempEventHandlerEvent)`, w, vmOptions);
            } finally {
              delete w.__tempEventHandlerThis;
              delete w.__tempEventHandlerEvent;
            }
          };
        }
      } else {
        this[name] = null;
      }
    }

    // TODO remove MutationEvents completely at some point
    if (value !== oldValue && this._ownerDocument &&
      this._ownerDocument.implementation._hasFeature("MutationEvents")) {
      const ev = this._ownerDocument.createEvent("MutationEvents");

      let attrChange = MutationEvent.MODIFICATION;
      if (value === null) {
        attrChange = MutationEvent.REMOVAL;
      }
      if (oldValue === null) {
        attrChange = MutationEvent.ADDITION;
      }

      ev.initMutationEvent("DOMAttrModified", true, false, this, oldValue, value, name, attrChange);
      this.dispatchEvent(ev);
    }

    // update classList
    if (name === "class" && value !== this.classList.toString()) {
      resetDOMTokenList(this.classList, value);
    }
  }

  replaceChild(node, child) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Node.prototype.replaceChild");
    }
    // TODO branding
    if (!node || !("nodeType" in node)) {
      throw new TypeError("First argument to Node.prototype.replaceChild must be a Node");
    }
    if (!child || !("nodeType" in child)) {
      throw new TypeError("Second argument to Node.prototype.replaceChild must be a Node");
    }

    this.insertBefore(node, child);
    return this.removeChild(child);
  }

  _attach() {
    this._attached = true;
    namedPropertiesWindow.nodeAttachedToDocument(this);

    if (this.id) {
      attachId(this.id, this, this._ownerDocument);
    }

    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child._attach) {
        child._attach();
      }
    }
  }

  _detach() {
    this._attached = false;

    namedPropertiesWindow.nodeDetachedFromDocument(this);

    if (this.id) {
      detachId(this.id, this, this._ownerDocument);
    }

    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child._detach) {
        child._detach();
      }
    }
  }

  removeChild(/* Node */ oldChild) {
    if (this._readonly === true) {
      throw new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR);
    }

    if (!oldChild || domSymbolTree.parent(oldChild) !== this) {
      throw new DOMException(DOMException.NOT_FOUND_ERR);
    }

    const oldPreviousSibling = oldChild.previousSibling;
    domSymbolTree.remove(oldChild);
    this._modified();
    oldChild._detach();
    this._descendantRemoved(this, oldChild);
    if (this._ownerDocument) {
      this._ownerDocument._runRemovingSteps(oldChild, this, oldPreviousSibling);
    }
    return oldChild;
  } // raises(DOMException);

  appendChild(newChild) {
    if (!("nodeType" in newChild)) {
      throw new TypeError("First argument to Node.prototype.appendChild must be a Node");
    }

    return this.insertBefore(newChild, null);
  }

  hasChildNodes() {
    return domSymbolTree.hasChildren(this);
  }

  /* returns void */
  normalize() {
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.normalize) {
        child.normalize();
      }

      // Level2/core clean off empty nodes
      if (child.nodeValue === "") {
        this.removeChild(child);
        continue;
      }

      const prevChild = domSymbolTree.previousSibling(child);

      if (prevChild && prevChild.nodeType === NODE_TYPE.TEXT_NODE && child.nodeType === NODE_TYPE.TEXT_NODE) {
        // merge text nodes
        prevChild.appendData(child.nodeValue);
        this.removeChild(child);
      }
    }
  }

  toString() {
    let id = "";
    if (this.id) {
      id = "#" + this.id;
    }
    if (this.className) {
      const classes = this.className.split(/\s+/);
      for (let i = 0; i < classes.length; i++) {
        id += "." + classes[i];
      }
    }
    return "[ " + this.tagName + id + " ]";
  }
}

module.exports = {
  implementation: NodeImpl
};
