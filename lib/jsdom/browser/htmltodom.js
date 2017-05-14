"use strict";

const parse5 = require("parse5");
const sax = require("sax");
const attributes = require("../living/attributes");
const DocumentType = require("../living/generated/DocumentType");
const { locationInfo } = require("../living/helpers/internal-constants");

module.exports = class HTMLToDOM {
  constructor(core, parsingMode) {
    this.core = core;
    this.parser = parsingMode === "xml" ? sax : parse5;
  }

  appendToElement(html, element) {
    html = String(html);

    return this._doParse(html, true, element);
  }

  appendToDocument(html, documentImpl) {
    html = String(html);

    return this._doParse(html, false, documentImpl, documentImpl._parseOptions);
  }

  _doParse(...args) {
    return this.parser === parse5 ? this._parseWithParse5(...args) : this._parseWithSax(...args);
  }

  _parseWithParse5(html, fragment, element, options = {}) {
    const htmlparser2Adapter = parse5.treeAdapters.htmlparser2;

    let dom;
    if (fragment) {
      const parentElement = htmlparser2Adapter.createElement(
        element.tagName.toLowerCase(), element.namespaceURI, []
      );

      options.treeAdapter = htmlparser2Adapter;
      dom = this.parser.parseFragment(parentElement, html, options);
    } else {
      options.treeAdapter = htmlparser2Adapter;
      dom = this.parser.parse(html, options);
    }

    const parsed = dom.children;
    for (let i = 0; i < parsed.length; i++) {
      setChild(this.core, element, parsed[i]);
    }

    return element;
  }

  _parseWithSax(html, fragment, element) {
    const SaxParser = this.parser.parser;
    const parser = new SaxParser(/* strict = */true, { xmlns: true });
    parser.noscript = false;
    parser.looseCase = "toString";
    const openStack = [element];
    parser.ontext = text => {
      setChild(this.core, openStack[openStack.length - 1], {
        type: "text",
        data: text
      });
    };
    parser.onopentag = arg => {
      const attrValues = {};
      const attrPrefixes = {};
      const attrNamespaces = {};
      Object.keys(arg.attributes).forEach(key => {
        const localName = arg.attributes[key].local;
        attrValues[localName] = arg.attributes[key].value;
        attrPrefixes[localName] = arg.attributes[key].prefix || null;
        attrNamespaces[localName] = arg.attributes[key].uri || null;
      });

      if (arg.local === "script" && arg.uri === "http://www.w3.org/1999/xhtml") {
        openStack.push({
          type: "tag",
          name: arg.local,
          prefix: arg.prefix,
          namespace: arg.uri,
          attribs: attrValues,
          "x-attribsPrefix": attrPrefixes,
          "x-attribsNamespace": attrNamespaces
        });
      } else {
        const elem = setChild(this.core, openStack[openStack.length - 1], {
          type: "tag",
          name: arg.local,
          prefix: arg.prefix,
          namespace: arg.uri,
          attribs: attrValues,
          "x-attribsPrefix": attrPrefixes,
          "x-attribsNamespace": attrNamespaces
        });
        openStack.push(elem);
      }
    };
    parser.onclosetag = () => {
      const elem = openStack.pop();
      if (elem.constructor.name === "Object") { // we have an empty script tag
        setChild(this.core, openStack[openStack.length - 1], elem);
      }
    };
    parser.onscript = scriptText => {
      const tag = openStack.pop();
      tag.children = [{ type: "text", data: scriptText }];
      const elem = setChild(this.core, openStack[openStack.length - 1], tag);
      openStack.push(elem);
    };
    parser.oncomment = comment => {
      setChild(this.core, openStack[openStack.length - 1], {
        type: "comment",
        data: comment
      });
    };
    parser.onprocessinginstruction = pi => {
      setChild(this.core, openStack[openStack.length - 1], {
        type: "directive",
        name: "?" + pi.name,
        data: "?" + pi.name + " " + pi.body + "?"
      });
    };
    parser.ondoctype = dt => {
      setChild(this.core, openStack[openStack.length - 1], {
        type: "directive",
        name: "!doctype",
        data: "!doctype " + dt
      });

      const entityMatcher = /<!ENTITY ([^ ]+) "([^"]+)">/g;
      let result;
      while ((result = entityMatcher.exec(dt))) {
        const [, name, value] = result;
        if (!(name in parser.ENTITIES)) {
          parser.ENTITIES[name] = value;
        }
      }
    };

    parser.onerror = err => {
      throw err;
    };
    parser.write(html).close();
  }
};

function setChild(core, parentImpl, node) {
  const currentDocument = parentImpl && parentImpl._ownerDocument || parentImpl;

  let newNode;
  let isTemplateContents = false;
  switch (node.type) {
    case "tag":
    case "script":
    case "style":
      newNode = currentDocument._createElementWithCorrectElementInterface(node.name, node.namespace);
      newNode._prefix = node.prefix || null;
      newNode._namespaceURI = node.namespace || null;
      break;

    case "root":
      // If we are in <template> then add all children to the parent's _templateContents; skip this virtual root node.
      if (parentImpl.tagName === "TEMPLATE" && parentImpl._namespaceURI === "http://www.w3.org/1999/xhtml") {
        newNode = parentImpl._templateContents;
        isTemplateContents = true;
      }
      break;

    case "text":
      // HTML entities should already be decoded by the parser, so no need to decode them
      newNode = currentDocument.createTextNode(node.data);
      break;

    case "comment":
      newNode = currentDocument.createComment(node.data);
      break;

    case "directive":
      if (node.name[0] === "?" && node.name.toLowerCase() !== "?xml") {
        const data = node.data.slice(node.name.length + 1, -1);
        newNode = currentDocument.createProcessingInstruction(node.name.substring(1), data);
      } else if (node.name.toLowerCase() === "!doctype") {
        if (node["x-name"] !== undefined) { // parse5 supports doctypes directly
          newNode = createDocumentTypeInternal(core, currentDocument,
            node["x-name"] || "",
            node["x-publicId"] || "",
            node["x-systemId"] || "");
        } else {
          newNode = parseDocType(core, currentDocument, "<" + node.data + ">");
        }
      }
      break;
  }

  if (!newNode) {
    return null;
  }

  newNode[locationInfo] = node.__location;

  if (node.attribs) {
    Object.keys(node.attribs).forEach(localName => {
      const value = node.attribs[localName];
      let prefix =
        node["x-attribsPrefix"] &&
        Object.prototype.hasOwnProperty.call(node["x-attribsPrefix"], localName) &&
        node["x-attribsPrefix"][localName] || null;
      const namespace =
        node["x-attribsNamespace"] &&
        Object.prototype.hasOwnProperty.call(node["x-attribsNamespace"], localName) &&
        node["x-attribsNamespace"][localName] || null;
      if (prefix === "xmlns" && localName === "") {
         // intended weirdness in node-sax, see https://github.com/isaacs/sax-js/issues/165
        localName = prefix;
        prefix = null;
      }
      attributes.setAttributeValue(newNode, localName, value, prefix, namespace);
    });
  }

  if (node.children) {
    for (let c = 0; c < node.children.length; c++) {
      setChild(core, newNode, node.children[c]);
    }
  }

  if (!isTemplateContents) {
    if (parentImpl._templateContents) {
      // Setting innerHTML on a <template>
      parentImpl._templateContents.appendChild(newNode);
    } else {
      parentImpl.appendChild(newNode);
    }
  }

  return newNode;
}

const HTML5_DOCTYPE = /<!doctype html>/i;
const PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;

function parseDocType(core, doc, html) {
  if (HTML5_DOCTYPE.test(html)) {
    return createDocumentTypeInternal(core, doc, "html", "", "");
  }

  const publicPieces = PUBLIC_DOCTYPE.exec(html);
  if (publicPieces) {
    return createDocumentTypeInternal(core, doc, publicPieces[1], publicPieces[2], publicPieces[3]);
  }

  const systemPieces = SYSTEM_DOCTYPE.exec(html);
  if (systemPieces) {
    return createDocumentTypeInternal(core, doc, systemPieces[1], "", systemPieces[2]);
  }

  // Shouldn't get here (the parser shouldn't let us know about invalid doctypes), but our logic likely isn't
  // real-world perfect, so let's fallback.
  return createDocumentTypeInternal(core, doc, "html", "", "");
}

function createDocumentTypeInternal(core, ownerDocument, name, publicId, systemId) {
  return DocumentType.createImpl([], { core, ownerDocument, name, publicId, systemId });
}
