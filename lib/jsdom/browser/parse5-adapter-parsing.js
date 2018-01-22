"use strict";
const DocumentType = require("../living/generated/DocumentType");
const DocumentFragment = require("../living/generated/DocumentFragment");
const Text = require("../living/generated/Text");
const Comment = require("../living/generated/Comment");
const attributes = require("../living/attributes");
const nodeTypes = require("../living/node-type");
const serializationAdapter = require("./parse5-adapter-serialization");

module.exports = class JSDOMParse5Adapter {
  constructor(documentImpl) {
    this._documentImpl = documentImpl;

    // When text gets inserted into a <script> element, we track that element here. Then, when any other mutation
    // occurs, we know the <script> element's close tag has been encountered, so we should run the script first.
    // This is a hack around not doing proper per-spec script evaluation semantics; we should eventually be able to
    // clear it up.
    this._lastScriptElement = null;
  }

  finalize() {
    this._potentiallyRunLastScriptElement();
  }

  _potentiallyRunLastScriptElement() {
    const element = this._lastScriptElement;
    if (element) {
      this._lastScriptElement = null;
      element._eval();
    }
  }

  createDocument() {
    // parse5's model assumes that parse(html) will call into here to create the new Document, then return it. However,
    // jsdom's model assumes we can create a Window (and through that create an empty Document), do some other setup
    // stuff, and then parse, stuffing nodes into that Document as we go. So to adapt between these two models, we just
    // return the already-created Document when asked by parse5 to "create" a Document.
    return this._documentImpl;
  }

  createDocumentFragment() {
    return DocumentFragment.createImpl([], { ownerDocument: this._documentImpl });
  }

  createElement(localName, namespace, attrs) {
    this._potentiallyRunLastScriptElement();

    const element = this._documentImpl._createElementWithCorrectElementInterface(localName, namespace);
    element._namespaceURI = namespace;
    this.adoptAttributes(element, attrs);

    return element;
  }

  createCommentNode(data) {
    this._potentiallyRunLastScriptElement();

    return Comment.createImpl([], { data, ownerDocument: this._documentImpl });
  }

  appendChild(parentNode, newNode) {
    this._potentiallyRunLastScriptElement();

    parentNode.appendChild(newNode);
  }

  insertBefore(parentNode, newNode, referenceNode) {
    this._potentiallyRunLastScriptElement();

    parentNode.insertBefore(newNode, referenceNode);
  }

  setTemplateContent(templateElement, contentFragment) {
    this._potentiallyRunLastScriptElement();

    templateElement._templateContents = contentFragment;
  }

  setDocumentType(document, name, publicId, systemId) {
    // parse5 sometimes gives us these as null.
    if (name === null) {
      name = "";
    }
    if (publicId === null) {
      publicId = "";
    }
    if (systemId === null) {
      systemId = "";
    }

    const documentType = DocumentType.createImpl([], { name, publicId, systemId, ownerDocument: this._documentImpl });
    document.appendChild(documentType);
  }

  setDocumentMode(document, mode) {
    // TODO: the rest of jsdom ignores this
    document._mode = mode;
  }

  detachNode(node) {
    this._potentiallyRunLastScriptElement();

    node.remove();
  }

  insertText(parentNode, text) {
    if (parentNode._eval) {
      this._lastScriptElement = parentNode;
    } else {
      this._potentiallyRunLastScriptElement();
    }

    const { lastChild } = parentNode;
    if (lastChild && lastChild.nodeType === nodeTypes.TEXT_NODE) {
      lastChild.data += text;
    } else {
      const textNode = Text.createImpl([], { data: text, ownerDocument: this._documentImpl });

      parentNode.appendChild(textNode);
    }
  }

  insertTextBefore(parentNode, text, referenceNode) {
    if (parentNode._eval) {
      this._lastScriptElement = parentNode;
    } else {
      this._potentiallyRunLastScriptElement();
    }

    const { previousSibling } = referenceNode;
    if (previousSibling && previousSibling.nodeType === nodeTypes.TEXT_NODE) {
      previousSibling.data += text;
    } else {
      const textNode = Text.createImpl([], { data: text, ownerDocument: this._documentImpl });

      parentNode.insertBefore(textNode, referenceNode);
    }
  }

  adoptAttributes(element, attrs) {
    for (const attr of attrs) {
      const prefix = attr.prefix === "" ? null : attr.prefix;
      attributes.setAttributeValue(element, attr.name, attr.value, prefix, attr.namespace);
    }
  }
};

Object.assign(module.exports.prototype, serializationAdapter);
