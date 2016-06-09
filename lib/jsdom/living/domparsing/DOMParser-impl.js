"use strict";
const Document = require("../generated/Document");
const core = require("..");
const applyDocumentFeatures = require("../../browser/documentfeatures").applyDocumentFeatures;

exports.implementation = class DOMParserImpl {
  parseFromString(string, contentType) {
    switch (String(contentType)) {
      case "text/html": {
        return createScriptingDisabledDocument("html", contentType, string);
      }

      case "text/xml":
      case "application/xml":
      case "application/xhtml+xml":
      case "image/svg+xml": {
        // TODO: use a strict XML parser (sax's strict mode might work?) and create parsererror elements
        return createScriptingDisabledDocument("xml", contentType, string);
      }

      default:
        throw new TypeError("Invalid contentType");
    }
  }
};

function createScriptingDisabledDocument(parsingMode, contentType, string) {
  const document = Document.createImpl([], {
    core,
    options: {
      parsingMode,
      encoding: "UTF-8",
      contentType
      // TODO: somehow set URL to active document's URL
    }
  });

  // "scripting enabled" set to false
  applyDocumentFeatures(document, {
    FetchExternalResources: [],
    ProcessExternalResources: false,
    SkipExternalResources: false
  });

  document._htmlToDom.appendHtmlToDocument(string, document);
  document.close();
  return document;
}
