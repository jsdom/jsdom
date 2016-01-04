"use strict";

const nwmatcher = require("nwmatcher/src/nwmatcher-noqsa");
const idlUtils = require("../generated/utils");
const NodeImpl = require("./Node-impl").implementation;
const ParentNodeImpl = require("./ParentNode-impl").implementation;
const attributes = require("../attributes");
const NODE_TYPE = require("../node-type");
const domToHtml = require("../../browser/domtohtml").domToHtml;
const memoizeQuery = require("../../utils").memoizeQuery;
const mapper = require("../../utils").mapper;
const clone = require("../node").clone;
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const createLiveNodeList = require("../node-list").createLive;
const DOMException = require("../../web-idl/DOMException");
const createDOMTokenList = require("../dom-token-list").create;
const attrGenerated = require("../generated/Attr");
const validateNames = require("../helpers/validate-names");
const listOfElementsWithClassNames = require("../node").listOfElementsWithClassNames;
const NonDocumentTypeChildNode = require("./NonDocumentTypeChildNode-impl").implementation;

// nwmatcher gets `document.documentElement` at creation-time, so we have to initialize lazily, since in the initial
// stages of Document initialization, there is no documentElement present yet.
function addNwmatcher(parentNode) {
  const document = parentNode._ownerDocument;

  if (!document._nwmatcher) {
    document._nwmatcher = nwmatcher({ document });
    document._nwmatcher.configure({ UNIQUE_ID: false });
  }

  return document._nwmatcher;
}

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

class ElementImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.nodeType = NODE_TYPE.ELEMENT_NODE;
    this.scrollTop = 0;
    this.scrollLeft = 0;

    this._namespaceURI = null;
    this._prefix = null;
    this._localName = privateData.localName;
    this._attributes = attributes.createNamedNodeMap(this);
  }

  get namespaceURI() {
    return this._namespaceURI;
  }
  get prefix() {
    return this._prefix;
  }
  get localName() {
    return this._localName;
  }
  get tagName() {
    let qualifiedName = this._prefix !== null ? this._prefix + ":" + this._localName : this._localName;
    if (this.namespaceURI === "http://www.w3.org/1999/xhtml" && this._ownerDocument._parsingMode === "html") {
      qualifiedName = qualifiedName.toUpperCase();
    }
    return qualifiedName;
  }

  get attributes() {
    return this._attributes;
  }

  get sourceIndex() {
    /*
    * According to QuirksMode:
    * Get the sourceIndex of element x. This is also the index number for
    * the element in the document.getElementsByTagName('*') array.
    * http://www.quirksmode.org/dom/w3c_core.html#t77
    */
    const items = this.ownerDocument.getElementsByTagName("*");

    for (let i = 0; i < items.length; i++) {
      if (items[i] === this) {
        return i;
      }
    }
  }

  get outerHTML() {
    return domToHtml([this]);
  }

  set outerHTML(html) {
    if (html === null) {
      html = "";
    }

    const parent = domSymbolTree.parent(this);
    const document = this._ownerDocument;

    if (!parent) {
      return;
    }

    let contextElement;
    if (parent.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      throw new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR,
                                  "Modifications are not allowed for this document");
    } else if (parent.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      contextElement = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
    } else if (parent.nodeType === NODE_TYPE.ELEMENT_NODE) {
      contextElement = clone(this._core, parent, undefined, false);
    } else {
      throw new TypeError("This should never happen");
    }

    document._htmlToDom.appendHtmlToElement(html, contextElement);

    while (contextElement.firstChild) {
      parent.insertBefore(contextElement.firstChild, this);
    }

    parent.removeChild(this);
  }

  get innerHTML() {
    const tagName = this.tagName;
    if (tagName === "SCRIPT" || tagName === "STYLE") {
      const type = this.getAttribute("type");
      if (!type || /^text\//i.test(type) || /\/javascript$/i.test(type)) {
        return domToHtml(domSymbolTree.childrenIterator(this));
      }
    }

    // In case of <template> we should pass its "template contents" fragment as a serialization root if we have one
    if (this._templateContents) {
      return domToHtml(domSymbolTree.childrenIterator(this._templateContents));
    }

    return domToHtml(domSymbolTree.childrenIterator(this));
  }

  set innerHTML(html) {
    if (html === null) {
      html = "";
    }

    setInnerHTML(this.ownerDocument, this, html);
  }

  get classList() {
    if (this._classList === undefined) {
      this._classList = createDOMTokenList(this, "class");
    }
    return this._classList;
  }

  hasAttributes() {
    return attributes.hasAttributes(this);
  }

  getAttribute(name) {
    return attributes.getAttributeValue(this, name);
  }

  getAttributeNS(namespace, localName) {
    return attributes.getAttributeValueByNameNS(this, namespace, localName);
  }

  setAttribute(name, value) {
    validateNames.name(name);

    if (this._namespaceURI === "http://www.w3.org/1999/xhtml" && this._ownerDocument._parsingMode === "html") {
      name = name.toLowerCase();
    }

    const attribute = attributes.getAttributeByName(this, name);

    if (attribute === null) {
      const newAttr = attrGenerated.createImpl([], { localName: name, value });
      attributes.appendAttribute(this, newAttr);
      return;
    }

    attributes.changeAttribute(this, attribute, value);
  }

  setAttributeNS(namespace, name, value) {
    const extracted = validateNames.validateAndExtract(namespace, name);

    attributes.setAttributeValue(this, extracted.localName, value, extracted.prefix, extracted.namespace);
  }

  removeAttribute(name) {
    attributes.removeAttributeByName(this, name);
  }

  removeAttributeNS(namespace, localName) {
    attributes.removeAttributeByNameNS(this, namespace, localName);
  }

  hasAttribute(name) {
    if (this._namespaceURI === "http://www.w3.org/1999/xhtml" && this._ownerDocument._parsingMode === "html") {
      name = name.toLowerCase();
    }

    return attributes.hasAttributeByName(this, name);
  }

  hasAttributeNS(namespace, localName) {
    if (namespace === "") {
      namespace = null;
    }

    return attributes.hasAttributeByNameNS(this, namespace, localName);
  }

  getAttributeNode(name) {
    return attributes.getAttributeByName(this, name);
  }

  getAttributeNodeNS(namespace, localName) {
    return attributes.getAttributeByNameNS(this, namespace, localName);
  }

  setAttributeNode(attr) {
    if (!attrGenerated.isImpl(attr)) {
      throw new TypeError("First argument to Element.prototype.setAttributeNode must be an Attr");
    }

    return attributes.setAttribute(this, attr);
  }

  setAttributeNodeNS(attr) {
    if (!attrGenerated.isImpl(attr)) {
      throw new TypeError("First argument to Element.prototype.setAttributeNodeNS must be an Attr");
    }

    return attributes.setAttribute(this, attr);
  }

  removeAttributeNode(attr) {
    if (!attrGenerated.isImpl(attr)) {
      throw new TypeError("First argument to Element.prototype.removeAttributeNode must be an Attr");
    }

    if (!attributes.hasAttribute(this, attr)) {
      throw new DOMException(DOMException.NOT_FOUND_ERR, "Tried to remove an attribute that was not present");
    }

    attributes.removeAttribute(this, attr);

    return attr;
  }
}

idlUtils.mixin(ElementImpl.prototype, NonDocumentTypeChildNode.prototype);
idlUtils.mixin(ElementImpl.prototype, ParentNodeImpl.prototype);

ElementImpl.prototype.getElementsByTagName = memoizeQuery(function (name) {
  name = name.toLowerCase();

  function filterByTagName(child) {
    if (child.nodeName && child.nodeType === NODE_TYPE.ELEMENT_NODE) {
      return name === "*" || (child.nodeName.toLowerCase() === name);
    }

    return false;
  }
  return createLiveNodeList(this._ownerDocument || this, mapper(this, filterByTagName, true));
});

ElementImpl.prototype.getElementsByTagNameNS = memoizeQuery(function (/* String */ namespaceURI,
                                                         /* String */ localName) {
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
});

ElementImpl.prototype.getElementsByClassName = memoizeQuery(function getElementsByClassName(classNames) {
  return listOfElementsWithClassNames(classNames, this);
});

ElementImpl.prototype.matches = memoizeQuery(function (selectors) {
  const matcher = addNwmatcher(this);

  try {
    return matcher.match(idlUtils.wrapperForImpl(this), selectors);
  } catch (e) {
    throw new DOMException(DOMException.SYNTAX_ERR, e.message);
  }
});

ElementImpl.prototype.webkitMatchesSelector = ElementImpl.prototype.matches;

module.exports = {
  implementation: ElementImpl
};
