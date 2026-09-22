"use strict";

const { SaxesParser } = require("saxes");
const DOMException = require("../../../generated/idl/DOMException");

const { createElement } = require("../../living/helpers/create-element");

const DocumentFragment = require("../../../generated/idl/DocumentFragment");
const DocumentType = require("../../../generated/idl/DocumentType");
const CDATASection = require("../../../generated/idl/CDATASection");
const Comment = require("../../../generated/idl/Comment");
const ProcessingInstruction = require("../../../generated/idl/ProcessingInstruction");
const Text = require("../../../generated/idl/Text");

const attributes = require("../../living/attributes");
const { HTML_NS } = require("../../living/helpers/namespaces");

const HTML5_DOCTYPE = /<!doctype html>/i;
const PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;
const CUSTOM_NAME_DOCTYPE = /<!doctype\s+([^\s>]+)/i;

function parseDocType(globalObject, ownerDocument, html) {
  if (HTML5_DOCTYPE.test(html)) {
    return createDocumentType(globalObject, ownerDocument, "html", "", "");
  }

  const publicPieces = PUBLIC_DOCTYPE.exec(html);
  if (publicPieces) {
    return createDocumentType(globalObject, ownerDocument, publicPieces[1], publicPieces[2], publicPieces[3]);
  }

  const systemPieces = SYSTEM_DOCTYPE.exec(html);
  if (systemPieces) {
    return createDocumentType(globalObject, ownerDocument, systemPieces[1], "", systemPieces[2]);
  }

  const namePiece = CUSTOM_NAME_DOCTYPE.exec(html)[1] || "html";
  return createDocumentType(globalObject, ownerDocument, namePiece, "", "");
}

function createDocumentType(globalObject, ownerDocument, name, publicId, systemId) {
  return DocumentType.createImpl(globalObject, [], { ownerDocument, name, publicId, systemId });
}

function isHTMLTemplateElement(element) {
  return element.tagName === "template" && element.namespaceURI === HTML_NS;
}


function createParser(rootNode, globalObject, saxesOptions, onScript, signal) {
  const parser = new SaxesParser({
    ...saxesOptions,
    // Browsers always have namespace support.
    xmlns: true,
    // We force the parser to treat all documents (even documents declaring themselves to be XML 1.1 documents) as XML
    // 1.0 documents. See https://github.com/jsdom/jsdom/issues/2677 for a discussion of the stakes.
    defaultXMLVersion: "1.0",
    forceXMLVersion: true
  });
  const openStack = [rootNode];

  function on(event, handler) {
    if (signal === undefined) {
      parser.on(event, handler);
    } else {
      parser.on(event, data => {
        handler(data);
        // Saxes has no pause operation. Aborting from author callbacks must unwind its current write before
        // another token is inserted; the document parser catches this signal's abort reason below.
        signal.throwIfAborted();
      });
    }
  }

  function getOwnerDocument() {
    const currentElement = openStack[openStack.length - 1];

    return isHTMLTemplateElement(currentElement) ?
      currentElement._templateContents._ownerDocument :
      currentElement._ownerDocument;
  }

  function appendChild(child) {
    const parentElement = openStack[openStack.length - 1];

    if (isHTMLTemplateElement(parentElement)) {
      parentElement._templateContents._insert(child, null);
    } else {
      parentElement._insert(child, null);
    }
  }

  on("text", saxesOptions.fragment ?
    // In a fragment, all text events produced by saxes must result in a text
    // node.
    data => {
      const ownerDocument = getOwnerDocument();
      appendChild(Text.createImpl(globalObject, [], { data, ownerDocument }));
    } :
    // When parsing a whole document, we must ignore those text nodes that are
    // produced outside the root element. Saxes produces events for them,
    // but DOM trees do not record text outside the root element.
    data => {
      if (openStack.length > 1) {
        const ownerDocument = getOwnerDocument();
        appendChild(Text.createImpl(globalObject, [], { data, ownerDocument }));
      }
    });

  on("cdata", data => {
    const ownerDocument = getOwnerDocument();
    appendChild(CDATASection.createImpl(globalObject, [], { data, ownerDocument }));
  });

  on("opentag", tag => {
    const { local: tagLocal, attributes: tagAttributes } = tag;

    const ownerDocument = getOwnerDocument();
    const tagNamespace = tag.uri === "" ? null : tag.uri;
    const tagPrefix = tag.prefix === "" ? null : tag.prefix;
    const isValue = tagAttributes.is === undefined ? null : tagAttributes.is.value;

    const elem = createElement(ownerDocument, tagLocal, tagNamespace, tagPrefix, isValue, true);
    if (tagLocal === "style" && tagNamespace === HTML_NS) {
      elem._markAsParserInserted(saxesOptions.fragment ? null : rootNode._ownerDocument);
    }

    // https://html.spec.whatwg.org/multipage/xhtml.html#parsing-xhtml-documents
    if (tagLocal === "script" && tagNamespace === HTML_NS) {
      const document = rootNode._ownerDocument;
      elem._initializeFromParser(document);
      if (saxesOptions.fragment) {
        elem._markAsAlreadyStarted();
      }
    }

    for (const key of Object.keys(tagAttributes)) {
      const { prefix, local, uri, value } = tagAttributes[key];
      attributes.setAttributeValue(elem, local, value, prefix === "" ? null : prefix, uri === "" ? null : uri);
    }
    if (tagLocal === "link" && tagNamespace === HTML_NS && !saxesOptions.fragment) {
      elem._markAsParserInserted(rootNode._ownerDocument);
    }

    appendChild(elem);
    openStack.push(elem);
  });

  on("closetag", () => {
    const elem = openStack.pop();
    // Prepare scripts and update style blocks after their contents have been parsed.
    if (elem.localName === "script" && elem.namespaceURI === HTML_NS && onScript !== undefined) {
      onScript(elem);
    } else if (elem.localName === "style" && elem.namespaceURI === HTML_NS) {
      elem._poppedOffStackOfOpenElements();
    }
  });

  on("comment", data => {
    const ownerDocument = getOwnerDocument();
    appendChild(Comment.createImpl(globalObject, [], { data, ownerDocument }));
  });

  on("processinginstruction", ({ target, body }) => {
    const ownerDocument = getOwnerDocument();
    appendChild(ProcessingInstruction.createImpl(globalObject, [], { target, data: body, ownerDocument }));
  });

  on("doctype", dt => {
    const ownerDocument = getOwnerDocument();
    appendChild(parseDocType(globalObject, ownerDocument, `<!doctype ${dt}>`));

    const entityMatcher = /<!ENTITY ([^ ]+) "([^"]+)">/g;
    let result;
    while ((result = entityMatcher.exec(dt))) {
      const [, name, value] = result;
      if (!(name in parser.ENTITIES)) {
        parser.ENTITIES[name] = value;
      }
    }
  });

  on("error", err => {
    throw DOMException.create(globalObject, [err.message, "SyntaxError"]);
  });

  return parser;
}

function parseFragment(markup, contextElement) {
  const { _globalObject, _ownerDocument } = contextElement;

  const fragment = DocumentFragment.createImpl(_globalObject, [], { ownerDocument: _ownerDocument });

  // Only parseFragment needs resolvePrefix per the saxes documentation:
  // https://github.com/lddubeau/saxes#parsing-xml-fragments
  const parser = createParser(fragment, _globalObject, {
    fragment: true,
    resolvePrefix(prefix) {
      // saxes wants undefined as the return value if the prefix is not defined, not null.
      return contextElement.lookupNamespaceURI(prefix) || undefined;
    }
  });

  parser.write(markup).close();

  return fragment;
}

function parseIntoDocument(markup, ownerDocument) {
  const { _globalObject } = ownerDocument;

  const parser = createParser(ownerDocument, _globalObject, {
    fileName: ownerDocument.location && ownerDocument.location.href
  }, script => script._prepare());

  parser.write(markup).close();

  return ownerDocument;
}

// https://html.spec.whatwg.org/multipage/xhtml.html#parsing-xhtml-documents
class XMLDocumentParser {
  #ownerDocument;
  #signal;
  #onEnd;
  #onError;
  #parser;
  #pendingScript;
  #scriptTagPending = false;
  #stopped = false;

  constructor(ownerDocument, { signal, onEnd, onError }) {
    this.#ownerDocument = ownerDocument;
    this.#signal = signal;
    this.#onEnd = onEnd;
    this.#onError = onError;
    this.#parser = createParser(ownerDocument, ownerDocument._globalObject, {
      fileName: ownerDocument.URL
    }, script => {
      this.#scriptTagPending = false;
      this.#pendingScript = script._prepare(this.#signal);
    }, signal);
  }

  get stopped() {
    return this.#stopped;
  }

  end(markup) {
    this.#pump(markup);
  }

  #reportError(error) {
    this.#stopped = true;
    this.#onError(error);
    this.#onEnd();
  }

  #pump(markup, position = 0) {
    try {
      while (!this.#signal.aborted && position < markup.length) {
        // A script can end with either an end tag or an empty-element tag, including a namespace prefix.
        // Keep yielding at `>` until saxes closes the script; quoted attributes and CDATA can contain false matches.
        let delimiter = -1;
        if (!this.#scriptTagPending) {
          const candidate = /<\/?(?:[^\t\n\r <>/:]+:)?script(?=[\t\n\r />])/g;
          candidate.lastIndex = position;
          const match = candidate.exec(markup);
          if (match !== null) {
            this.#scriptTagPending = true;
            delimiter = markup.indexOf(">", match.index);
          }
        } else {
          delimiter = markup.indexOf(">", position);
        }
        const end = delimiter === -1 ? markup.length : delimiter + 1;
        this.#parser.write(markup.slice(position, end));
        position = end;
        if (this.#pendingScript !== undefined) {
          const execution = this.#ownerDocument._runParsingBlockingScript(this.#pendingScript, this.#signal);
          this.#pendingScript = undefined;
          if (execution !== undefined) {
            execution.then(() => this.#pump(markup, end)).catch(error => this.#reportError(error));
            return;
          }
        }
      }
      if (!this.#signal.aborted) {
        this.#parser.close();
        this.#stopped = true;
        this.#onEnd();
      }
    } catch (error) {
      if (!this.#signal.aborted || error !== this.#signal.reason) {
        throw error;
      }
    }
  }
}

module.exports = {
  parseFragment,
  parseIntoDocument,
  XMLDocumentParser
};
