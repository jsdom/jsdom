"use strict";

const NodeImpl = require("./Node-impl").implementation;

const NODE_TYPE = require("../node-type");
const memoizeQuery = require("../../utils").memoizeQuery;
const mapper = require("../../utils").mapper;
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const createLiveNodeList = require("../node-list").createLive;
const DOMException = require("../../web-idl/DOMException");

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

class DocumentImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this.nodeType = NODE_TYPE.DOCUMENT_NODE;
  }

  _defaultElementBuilder(document, tagName) {
    return new core.Element(document, tagName);
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
  get readonly() { return this._readonly; }

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
    // https://dom.spec.whatwg.org/#concept-element-interface
    // TODO: eventually we should re-write the element-builder system to be namespace aware, but for now it is not.
    return (this._elementBuilders[name.toLowerCase()] || this._defaultElementBuilder)(this, name, namespace);
  }

  appendChild(/* Node */ arg) {
    if (this.documentElement && arg.nodeType == NODE_TYPE.ELEMENT_NODE) {
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
    }
    return core.Node.prototype.appendChild.call(this, arg);
  }

  removeChild(/* Node */ arg) {
    var ret = core.Node.prototype.removeChild.call(this, arg);
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
}

DocumentImpl.prototype._elementBuilders = Object.create(null);

DocumentImpl.prototype.getElementsByTagName = memoizeQuery(function (name) {
  function filterByTagName(child) {
    if (child.nodeName && child.nodeType === NODE_TYPE.ELEMENT_NODE) {
      if (name === "*") {
        return true;

        // case insensitivity for html
      } else if (child._ownerDocument && child._ownerDocument._doctype &&
        //child._ownerDocument._doctype.name === "html" &&
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

module.exports = {
  implementation: DocumentImpl
};
