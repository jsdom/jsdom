"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("dom-implementation", () => {
  specify("new DOMImplementation() is not allowed", () => {
    const { DOMImplementation } = (new JSDOM()).window;

    assert.throws(() => new DOMImplementation(), /Illegal constructor/i);
  });

  specify("create an empty document", () => {
    const { implementation } = (new JSDOM()).window.document;
    const document = implementation.createDocument(null, null, null);
    assert.equal(document.childNodes.length, 0, "document should not contain any nodes");
  });

  specify("doctype ownerDocument", () => {
    const { document } = (new JSDOM()).window;
    const doctype = document.implementation.createDocumentType("bananas", "", "");
    assert.ok(
      doctype.ownerDocument === document,
      "doctype should belong to the document the implementation belongs to"
    );
    const newDocument = document.implementation.createDocument(null, null, doctype);
    assert.ok(doctype.ownerDocument === newDocument, "doctype should belong to the new document");
  });

  specify("doctype child of ownerDocument", () => {
    const { document } = (new JSDOM()).window;
    const doctype = document.implementation.createDocumentType("hatstand", "", "");
    const newDocument = document.implementation.createDocument(null, null, doctype);
    assert.ok(newDocument.firstChild === doctype, "doctype should be a child of the document");
  });

  specify("defaultView should be null", () => {
    const { document } = (new JSDOM()).window;
    const newDocument = document.implementation.createDocument(null, null, null);
    assert.strictEqual(newDocument.defaultView, null, "defaultView should be null");
  });

  specify("location should be null", () => {
    const { document } = (new JSDOM()).window;
    const newDocument = document.implementation.createHTMLDocument();
    assert.strictEqual(newDocument.location, null, "location should be null");
  });

  specify(
    "setting proxied event handlers on the body should have no effect",
    () => {
      const { document } = (new JSDOM()).window;
      const newDocument = document.implementation.createHTMLDocument();

      const proxiedEventHandlers = [
        "onafterprint", "onbeforeprint", "onbeforeunload", "onblur", "onerror", "onfocus",
        "onhashchange", "onload", "onmessage", "onoffline", "ononline", "onpagehide", "onpageshow", "onpopstate",
        "onresize", "onscroll", "onstorage", "onunload"
      ];

      for (const name of proxiedEventHandlers) {
        newDocument.body[name] = "1 + 2";
        assert.strictEqual(newDocument.body[name], null, name + " should always be null because there is no window");
      }
    }
  );

  specify("iframe added to a created Document should not load", () => {
    const { document } = (new JSDOM()).window;
    const newDocument = document.implementation.createHTMLDocument();

    const iframe = newDocument.createElement("iframe");
    // iframe's with a name are added as a property to the window, this line is added to see if things crash
    iframe.setAttribute("name", "foobar");
    newDocument.body.appendChild(iframe);
    assert.strictEqual(iframe.contentWindow, null, "contentWindow should be null, the iframe should never load");
    assert.strictEqual(iframe.contentDocument, null, "contentDocument should be null, the iframe should never load");

    iframe.src = "http://example.com/"; // try to trigger a load action
    assert.strictEqual(iframe.contentWindow, null, "contentWindow should be null, the iframe should never load");
    assert.strictEqual(iframe.contentDocument, null, "contentDocument should be null, the iframe should never load");
  });
});
