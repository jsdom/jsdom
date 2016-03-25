"use strict";

const parse5 = require("parse5");
const sax = require("sax");
const attributes = require("../living/attributes");
const DocumentType = require("../living/generated/DocumentType");
const adapter = require("./documentAdapter");

class HtmlToDom {
  constructor(core, parser, parsingMode) {
    if (!parser) {
      if (parsingMode === "xml") {
        parser = sax;
      } else {
        parser = parse5;
      }
    }

    this.core = core;
    this.parser = parser;
    this.parsingMode = parsingMode;

    if (parser.ParserStream && parser.treeAdapters) {
      this.parserType = "parse5";
    } else if (parser.parser) {
      this.parserType = "sax";
    } else {
      throw new Error("Provided an unsupported parser interface. Only parse5 2.0 and node-sax are supported.");
    }
  }

  appendHtmlToElement(html, element) {
    if (typeof html !== "string") {
      html = String(html);
    }

    return this["_parseWith" + this.parserType](html, true, element);
  }

  appendHtmlToDocument(html, element) {
    if (typeof html !== "string") {
      html = String(html);
    }

    return this["_parseWith" + this.parserType](html, false, element);
  }

  _parseWithparse5(html, fragment, element) {
    function executePendingParsing() {
      if (element._pendingParsingBlockingScript) {
        const script = element._pendingParsingBlockingScript;
        element._pendingParsingBlockingScript = null;
        if (script.tag._readyToParserExecute) {
          script.tag._eval(false, script.text, script.filename);
          return executePendingParsing();
        }

        return new Promise(resolve => {
          script.onload = () => {
            script.tag._eval(false, script.text, script.filename);
            resolve();
          };
        });
      }
    }

    if (this.parsingMode === "xml") {
      throw new Error("Can't parse XML with parse5, please use htmlparser2 instead.");
    }

    if (fragment) {
      const domFragment = this.parser.parseFragment(element, html, {
        treeAdapter: adapter(element.ownerDocument, true)
      });
      element.appendChild(domFragment);
    } else {
      const instance = new this.parser.ParserStream({
        treeAdapter: adapter(element),
        locationInfo: true
      });
      instance.on("script", (el, docWrite, resume) => {
        const oldWrite = element.write;
        element.write = docWrite;
        el._prepare();

        const promise = executePendingParsing();

        if (promise) {
          promise.then(() => {
            element.write = oldWrite;
            resume();
          });
        } else {
          element.write = oldWrite;
          resume();
        }
      });
      element._parserFinishedPromise = new Promise(resolve => {
        instance.on("finish", resolve);
        instance.end(html);
      });
    }

    return element;
  }

  _parseWithsax(html, fragment, element) {
    const SaxParser = this.parser.parser;
    const parser = new SaxParser(false, { xmlns: true });
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
    };
    parser.write(html).close();
  }
}

// utility function for forgiving parser
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

  if (node.attribs) {
    for (let localName in node.attribs) {
      const value = node.attribs[localName];
      let prefix = node["x-attribsPrefix"] && node["x-attribsPrefix"][localName] || null;
      const namespace = node["x-attribsNamespace"] && node["x-attribsNamespace"][localName] || null;
      if (prefix === "xmlns" && localName === "") {
        // intended weirdness in node-sax, see https://github.com/isaacs/sax-js/issues/165
        localName = prefix;
        prefix = null;
      }
      attributes.setAttributeValue(newNode, localName, value, prefix, namespace);
    }
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

exports.HtmlToDom = HtmlToDom;
