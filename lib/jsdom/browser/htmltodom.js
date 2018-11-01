"use strict";

const parse5 = require("parse5");
const saxes = require("saxes");
const attributes = require("../living/attributes");
const DocumentType = require("../living/generated/DocumentType");
const JSDOMParse5Adapter = require("./parse5-adapter-parsing");
const { HTML_NS } = require("../living/helpers/namespaces");

// Horrible monkey-patch to implement https://github.com/inikulin/parse5/issues/237
const OpenElementStack = require("parse5/lib/parser/open-element-stack");
const originalPop = OpenElementStack.prototype.pop;
OpenElementStack.prototype.pop = function (...args) {
  const before = this.items[this.stackTop];
  originalPop.apply(this, args);
  if (before._poppedOffStackOfOpenElements) {
    before._poppedOffStackOfOpenElements();
  }
};

const originalPush = OpenElementStack.prototype.push;
OpenElementStack.prototype.push = function (...args) {
  originalPush.apply(this, args);
  const after = this.items[this.stackTop];
  if (after._pushedOnStackOfOpenElements) {
    after._pushedOnStackOfOpenElements();
  }
};

module.exports = class HTMLToDOM {
  constructor(parsingMode) {
    this.parser = parsingMode === "xml" ? saxes : parse5;
  }

  appendToNode(html, node) {
    html = String(html);

    return this._doParse(html, true, node);
  }

  appendToDocument(html, documentImpl) {
    html = String(html);

    return this._doParse(html, false, documentImpl, documentImpl._parseOptions);
  }

  _doParse(...args) {
    return this.parser === parse5 ? this._parseWithParse5(...args) : this._parseWithSaxes(...args);
  }

  _parseWithParse5(html, isFragment, contextNode, options = {}) {
    const adapter = new JSDOMParse5Adapter(contextNode._ownerDocument || contextNode);
    options.treeAdapter = adapter;

    if (isFragment) {
      const fragment = this.parser.parseFragment(contextNode, html, options);

      if (contextNode._templateContents) {
        contextNode._templateContents.appendChild(fragment);
      } else {
        contextNode.appendChild(fragment);
      }
    } else {
      this.parser.parse(html, options);
    }

    return contextNode;
  }

  _parseWithSaxes(html, isFragment, contextNode) {
    const parserOptions = { xmlns: true };
    if (isFragment) {
      parserOptions.fragment = true;

      parserOptions.resolvePrefix = prefix => {
        // saxes wants undefined as the return value if the prefix is not
        // defined, not null.
        return contextNode.lookupNamespaceURI(prefix) || undefined;
      };
    }
    const parser = new this.parser.SaxesParser(parserOptions);
    const openStack = [contextNode];
    const currentDocument = contextNode._ownerDocument || contextNode;

    parser.ontext = isFragment ?
      // In a fragment, all text events produced by saxes must result in a text
      // node.
      text => {
        appendChild(
          openStack[openStack.length - 1],
          currentDocument.createTextNode(text)
        );
      } :
      // When parsing a whole document, we must ignore those text nodes that are
      // produced outside the root element. Saxes produces events for them,
      // but DOM trees do not record text outside the root element.
      text => {
        if (openStack.length > 1) {
          appendChild(
            openStack[openStack.length - 1],
            currentDocument.createTextNode(text)
          );
        }
      };
    parser.oncdata = cdata => {
      appendChild(
        openStack[openStack.length - 1],
        currentDocument.createCDATASection(cdata)
      );
    };
    parser.onopentag = tag => {
      const { local: tagLocal, uri: tagURI, prefix: tagPrefix, attributes: tagAttributes } = tag;
      const elem = currentDocument._createElementWithCorrectElementInterface(tagLocal, tagURI);
      elem._prefix = tagPrefix || null;
      elem._namespaceURI = tagURI || null;
      // We mark a script element as "parser-inserted", which prevents it from
      // being immediately executed.
      if (tagLocal === "script" && tagURI === HTML_NS) {
        elem._parserInserted = true;
      }

      for (const key of Object.keys(tagAttributes)) {
        const { prefix, local, uri, value } = tagAttributes[key];
        attributes.setAttributeValue(
          elem, local, value, prefix === "" ? null : prefix,
          uri === "" ? null : uri
        );
      }

      appendChild(openStack[openStack.length - 1], elem);
      openStack.push(elem);
    };
    parser.onclosetag = () => {
      const elem = openStack.pop();
      // Once a script is populated, we can execute it.
      if (elem.localName === "script" && elem.namespaceURI === HTML_NS) {
        elem._eval();
      }
    };
    parser.oncomment = comment => {
      appendChild(
        openStack[openStack.length - 1],
        currentDocument.createComment(comment)
      );
    };
    parser.onprocessinginstruction = ({ target, body }) => {
      appendChild(
        openStack[openStack.length - 1],
        currentDocument.createProcessingInstruction(target, body)
      );
    };
    parser.ondoctype = dt => {
      appendChild(
        openStack[openStack.length - 1],
        parseDocType(currentDocument, `<!doctype ${dt}>`)
      );

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

function appendChild(parent, child) {
  if (parent._templateContents) {
    // Template elements do not have children but instead store their content
    // in a separate hierarchy.
    parent._templateContents._insert(child, null);
  } else {
    parent._insert(child, null);
  }
}

const HTML5_DOCTYPE = /<!doctype html>/i;
const PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;

function parseDocType(doc, html) {
  if (HTML5_DOCTYPE.test(html)) {
    return createDocumentTypeInternal(doc, "html", "", "");
  }

  const publicPieces = PUBLIC_DOCTYPE.exec(html);
  if (publicPieces) {
    return createDocumentTypeInternal(doc, publicPieces[1], publicPieces[2], publicPieces[3]);
  }

  const systemPieces = SYSTEM_DOCTYPE.exec(html);
  if (systemPieces) {
    return createDocumentTypeInternal(doc, systemPieces[1], "", systemPieces[2]);
  }

  // Shouldn't get here (the parser shouldn't let us know about invalid doctypes), but our logic likely isn't
  // real-world perfect, so let's fallback.
  return createDocumentTypeInternal(doc, "html", "", "");
}

function createDocumentTypeInternal(ownerDocument, name, publicId, systemId) {
  return DocumentType.createImpl([], { ownerDocument, name, publicId, systemId });
}
