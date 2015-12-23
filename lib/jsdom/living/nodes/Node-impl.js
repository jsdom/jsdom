"use strict";
const vm = require("vm");

const EventTargetImpl = require("../events/EventTarget-impl").implementation;
const MutationEvent = require("../generated/MutationEvent").interface;
const idlUtils = require("../generated/utils");

const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const simultaneousIterators = require("../../utils").simultaneousIterators;
const DOMException = require("../../web-idl/DOMException");
const NODE_TYPE = require("../node-type");
const NODE_DOCUMENT_POSITION = require("../node-document-position");
const resetDOMTokenList = require("../dom-token-list").reset;
const createLiveNodeList = require("../node-list").createLive;
const updateNodeList = require("../node-list").update;
const updateHTMLCollection = require("../html-collection").update;
const namedPropertiesWindow = require("../named-properties-window");
const proxiedWindowEventHandlers = require("../helpers/proxied-window-event-handlers");
const documentBaseURL = require("../helpers/document-base-url").documentBaseURL;
const cloneNode = require("../node").clone;
const attributes = require("../attributes");


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

function getDocument(el) {
  return el.nodeType === NODE_TYPE.DOCUMENT_NODE ? el : el._ownerDocument;
}

function mutationEventsEnabled(el) {
  return el.nodeType !== NODE_TYPE.ATTRIBUTE_NODE &&
         getDocument(el).implementation._hasFeature("MutationEvents");
}

function isObsoleteNodeType(node) {
  return node.nodeType === NODE_TYPE.ENTITY_NODE ||
    node.nodeType === NODE_TYPE.ENTITY_REFERENCE_NODE ||
    node.nodeType === NODE_TYPE.NOTATION_NODE ||
    node.nodeType === NODE_TYPE.CDATA_SECTION_NODE;
}

function nodeEquals(a, b) {
  if (a.nodeType !== b.nodeType) {
    return false;
  }

  switch (a.nodeType) {
    case NODE_TYPE.DOCUMENT_TYPE_NODE:
      if (a.name !== b.name || a.publicId !== b.publicId ||
          a.systemId !== b.systemId) {
        return false;
      }
      break;
    case NODE_TYPE.ELEMENT_NODE:
      if (a._namespaceURI !== b._namespaceURI || a._prefix !== b._prefix || a._localName !== b._localName ||
          a._attributes.length !== b._attributes.length) {
        return false;
      }
      break;
    case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      if (a._target !== b._target || a._data !== b._data) {
        return false;
      }
      break;
    case NODE_TYPE.TEXT_NODE:
    case NODE_TYPE.COMMENT_NODE:
      if (a._data !== b._data) {
        return false;
      }
      break;
  }

  if (a.nodeType === NODE_TYPE.ELEMENT_NODE && !attributes.attributeListsEqual(a, b)) {
    return false;
  }

  for (const nodes of simultaneousIterators(domSymbolTree.childrenIterator(a), domSymbolTree.childrenIterator(b))) {
    if (!nodes[0] || !nodes[1]) {
      // mismatch in the amount of childNodes
      return false;
    }

    if (!nodeEquals(nodes[0], nodes[1])) {
      return false;
    }
  }

  return true;
}

class NodeImpl extends EventTargetImpl {
  constructor(args, privateData) {
    super();

    domSymbolTree.initialize(this);

    this._core = privateData.core;
    this._ownerDocument = privateData.ownerDocument;
    this._readonly = false;

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
      this._childNodesList = createLiveNodeList(this, () => domSymbolTree.childrenToArray(self));
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

  insertBefore(newChildImpl, refChildImpl) {
    if (refChildImpl === undefined) {
      refChildImpl = null;
    }

    // TODO branding
    if (!newChildImpl || !(newChildImpl instanceof NodeImpl)) {
      throw new TypeError("First argument to Node.prototype.insertBefore must be a Node");
    }
    if (refChildImpl !== null && !(refChildImpl instanceof NodeImpl)) {
      throw new TypeError("Second argument to Node.prototype.insertBefore must be a Node or null or undefined");
    }

    if (this._readonly === true) {
      throw new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR, "Attempting to modify a read-only node");
    }

    // DocumentType must be implicitly adopted
    if (newChildImpl.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
      newChildImpl._ownerDocument = this._ownerDocument;
    }

    // TODO - if (!newChild) then?
    if (this.nodeName !== "#document" && newChildImpl._ownerDocument !== this._ownerDocument) {
      throw new DOMException(DOMException.WRONG_DOCUMENT_ERR);
    }

    if (newChildImpl.nodeType && newChildImpl.nodeType === NODE_TYPE.ATTRIBUTE_NODE) {
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
    }

    // search for parents matching the newChild
    for (const ancestor of domSymbolTree.ancestorsIterator(this)) {
      if (ancestor === newChildImpl) {
        throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
      }
    }

    // fragments are merged into the element (except parser-created fragments in <template>)
    if (newChildImpl.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      let grandChildImpl;
      while ((grandChildImpl = domSymbolTree.firstChild(newChildImpl))) {
        newChildImpl.removeChild(grandChildImpl);
        this.insertBefore(grandChildImpl, refChildImpl);
      }
    } else if (newChildImpl === refChildImpl) {
      return newChildImpl;
    } else {
      const oldParentImpl = domSymbolTree.parent(newChildImpl);
      // if the newChild is already in the tree elsewhere, remove it first
      if (oldParentImpl) {
        oldParentImpl.removeChild(newChildImpl);
      }

      if (refChildImpl === null) {
        domSymbolTree.appendChild(this, newChildImpl);
      } else {
        if (domSymbolTree.parent(refChildImpl) !== this) {
          throw new DOMException(DOMException.NOT_FOUND_ERR);
        }

        domSymbolTree.insertBefore(refChildImpl, newChildImpl);
      }

      this._modified();

      if (this._attached && newChildImpl._attach) {
        newChildImpl._attach();
      }

      this._descendantAdded(this, newChildImpl);
    }

    if (mutationEventsEnabled(this)) {
      const doc = getDocument(this);
      let ev = doc.createEvent("MutationEvents");
      ev.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
      newChildImpl.dispatchEvent(ev);

      ev = doc.createEvent("MutationEvents");
      ev.initMutationEvent("DOMSubtreeModified", true, false, this, null, null, null, null);
      this.dispatchEvent(ev);

      if (this.nodeType === NODE_TYPE.DOCUMENT_NODE || this._attachedToDocument) {
        ev = doc.createEvent("MutationEvents");
        ev.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);

        for (const el of domSymbolTree.treeIterator(newChildImpl)) {
          if (el.nodeType === NODE_TYPE.ELEMENT_NODE) {
            el.dispatchEvent(ev);
            el._attachedToDocument = true;
          }
        }
      }
    }

    return newChildImpl;
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

    if (mutationEventsEnabled(this) && value !== oldValue) {
      const doc = getDocument(this);
      const ev = doc.createEvent("MutationEvents");

      ev.initMutationEvent("DOMSubtreeModified", true, false, this, null, null, null, null);
      this.dispatchEvent(ev);
    }
  }

  replaceChild(node, child) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Node.prototype.replaceChild");
    }
    // TODO branding
    if (!node || !(node instanceof NodeImpl)) {
      throw new TypeError("First argument to Node.prototype.replaceChild must be a Node");
    }
    if (!child || !(child instanceof NodeImpl)) {
      throw new TypeError("Second argument to Node.prototype.replaceChild must be a Node");
    }

    this.insertBefore(node, child);
    return this.removeChild(child);
  }

  _attach() {
    this._attached = true;
    namedPropertiesWindow.nodeAttachedToDocument(this);

    const wrapper = idlUtils.wrapperForImpl(this);
    if (wrapper.id) {
      attachId(wrapper.id, this, this._ownerDocument);
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

  removeChild(/* Node */ oldChildImpl) {
    if (this._readonly === true) {
      throw new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR);
    }

    if (!oldChildImpl || domSymbolTree.parent(oldChildImpl) !== this) {
      throw new DOMException(DOMException.NOT_FOUND_ERR);
    }

    if (mutationEventsEnabled(this)) {
      const doc = getDocument(this);
      let ev = doc.createEvent("MutationEvents");

      ev.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
      oldChildImpl.dispatchEvent(ev);

      ev = doc.createEvent("MutationEvents");
      ev.initMutationEvent("DOMSubtreeModified", true, false, this, null, null, null, null);
      this.dispatchEvent(ev);

      ev = doc.createEvent("MutationEvents");
      ev.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
      for (const el of domSymbolTree.treeIterator(oldChildImpl)) {
        if (el.nodeType === NODE_TYPE.ELEMENT_NODE) {
          el.dispatchEvent(ev);
          el._attachedToDocument = false;
        }
      }
    }

    const oldPreviousSibling = oldChildImpl.previousSibling;
    domSymbolTree.remove(oldChildImpl);
    this._modified();
    oldChildImpl._detach();
    this._descendantRemoved(this, oldChildImpl);
    if (this._ownerDocument) {
      this._ownerDocument._runRemovingSteps(oldChildImpl, this, oldPreviousSibling);
    }
    return oldChildImpl;
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

  get parentElement() {
    const parentNode = domSymbolTree.parent(this);
    return parentNode !== null && parentNode.nodeType === NODE_TYPE.ELEMENT_NODE ? parentNode : null;
  }

  get baseURI() {
    return documentBaseURL(this._ownerDocument);
  }

  compareDocumentPosition(otherImpl) {
    // Let reference be the context object.
    const reference = this;

    if (!(otherImpl instanceof NodeImpl)) {
      throw new Error("Comparing position against non-Node values is not allowed");
    }

    if (isObsoleteNodeType(reference) || isObsoleteNodeType(otherImpl)) {
      throw new Error("Obsolete node type");
    }

    const result = domSymbolTree.compareTreePosition(reference, otherImpl);

    // “If other and reference are not in the same tree, return the result of adding DOCUMENT_POSITION_DISCONNECTED,
    //  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either DOCUMENT_POSITION_PRECEDING or
    // DOCUMENT_POSITION_FOLLOWING, with the constraint that this is to be consistent, together.”
    if (result === NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED) {
      // symbol-tree does not add these bits required by the spec:
      return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED |
        NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
        NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_FOLLOWING;
    }

    return result;
  }

  contains(other) {
    if (!(other instanceof NodeImpl)) {
      return false;
    } else if (this === other) {
      return true;
    }
    return Boolean(this.compareDocumentPosition(other) & NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_CONTAINED_BY);
  }

  isEqualNode(node) {
    if (node === undefined) {
      // this is what Node? means in the IDL
      node = null;
    }

    if (node === null) {
      return false;
    }

    // Fast-path, not in the spec
    if (this === node) {
      return true;
    }

    return nodeEquals(this, node);
  }

  cloneNode(deep) {
    deep = Boolean(deep);

    return cloneNode(this._core, this, undefined, deep);
  }

  get textContent() {
    let text;
    switch (this.nodeType) {
      case NODE_TYPE.COMMENT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE:
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.TEXT_NODE:
        return this.nodeValue;

      case NODE_TYPE.ATTRIBUTE_NODE:
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      case NODE_TYPE.ELEMENT_NODE:
        text = "";
        for (const child of domSymbolTree.treeIterator(this)) {
          if (child.nodeType === NODE_TYPE.TEXT_NODE) {
            text += child.nodeValue;
          }
        }
        return text;

      default:
        return null;
    }
  }

  set textContent(txt) {
    switch (this.nodeType) {
      case NODE_TYPE.COMMENT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE:
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.TEXT_NODE:
        this.nodeValue = String(txt);
        return;
    }

    let child = domSymbolTree.firstChild(this);
    while (child) {
      this.removeChild(child);
      child = domSymbolTree.firstChild(this);
    }

    if (txt !== "" && txt !== null) {
      this.appendChild(this._ownerDocument.createTextNode(txt));
    }
  }

  toString() {
    const wrapper = idlUtils.wrapperForImpl(this);
    return `[object ${wrapper.constructor.name}]`;
  }
}

module.exports = {
  implementation: NodeImpl
};
