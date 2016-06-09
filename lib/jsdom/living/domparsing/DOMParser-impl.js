"use strict";

exports.implementation = class DOMParserImpl {
  parseFromString(string, contenType) {
    // Create a new document, since we're supposed to always return one.
    const doc = document.implementation.createHTMLDocument("");
    const body = doc.body;
    let last = doc.lastChild;
    // Set the body's HTML, then change the DOM according the specs.
    body.innerHTML = string;
    // Remove all top-level children (<html><head/><body/></html>)
    while (last) {
      doc.removeChild(last);
      last = doc.lastChild;
    }
    // Insert the first child of the body at the top.
    doc.appendChild(body.firstChild);
    return doc;
  }
};
