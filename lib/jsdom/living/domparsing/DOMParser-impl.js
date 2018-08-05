"use strict";
const Document = require("../generated/Document");

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
        try {
          return createScriptingDisabledDocument("xml", contentType, string);
        } catch (error) {
          const document = createScriptingDisabledDocument("xml", contentType);
          const element = document.createElementNS("http://www.mozilla.org/newlayout/xml/parsererror.xml", "parsererror");

          element.textContent = error.message;

          document.appendChild(element);
          return document;
        }
      }

      default:
        throw new TypeError("Invalid contentType");
    }
  }
};

function createScriptingDisabledDocument(parsingMode, contentType, string) {
  const document = Document.createImpl([], {
    options: {
      parsingMode,
      encoding: "UTF-8",
      contentType,
      scriptingDisabled: true
      // TODO: somehow set URL to active document's URL
    }
  });

  if (string !== undefined) {
    document._htmlToDom.appendToDocument(string, document);
  }
  document.close();
  return document;
}
