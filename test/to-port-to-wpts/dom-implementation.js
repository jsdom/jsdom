"use strict";
const jsdom = require("../../lib/old-api.js");

exports["new DOMImplementation() is not allowed"] = t => {
  const DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;

  t.throws(() => new DOMImplementation(), /Illegal constructor/i);

  t.done();
};

exports["create an empty document"] = t => {
  const implementation = jsdom.jsdom().implementation;
  const document = implementation.createDocument(null, null, null);
  t.equal(document.childNodes.length, 0, "document should not contain any nodes");
  t.done();
};

exports["doctype ownerDocument"] = t => {
  const document = jsdom.jsdom();
  const doctype = document.implementation.createDocumentType("bananas", "", "");
  t.ok(doctype.ownerDocument === document, "doctype should belong to the document the implementation belongs to");
  const newDocument = document.implementation.createDocument(null, null, doctype);
  t.ok(doctype.ownerDocument === newDocument, "doctype should belong to the new document");
  t.done();
};

exports["doctype child of ownerDocument"] = t => {
  const document = jsdom.jsdom();
  const doctype = document.implementation.createDocumentType("hatstand", "", "");
  const newDocument = document.implementation.createDocument(null, null, doctype);
  t.ok(newDocument.firstChild === doctype, "doctype should be a child of the document");
  t.done();
};

exports["defaultView should be null"] = t => {
  const document = jsdom.jsdom();
  const newDocument = document.implementation.createDocument(null, null, null);
  t.strictEqual(newDocument.defaultView, null, "defaultView should be null");
  t.done();
};

exports["location should be null"] = t => {
  const document = jsdom.jsdom();
  const newDocument = document.implementation.createHTMLDocument();
  t.strictEqual(newDocument.location, null, "location should be null");
  t.done();
};

exports["setting proxied event handlers on the body should have no effect"] = t => {
  const document = jsdom.jsdom();
  const newDocument = document.implementation.createHTMLDocument();

  const proxiedEventHandlers = ["onafterprint", "onbeforeprint", "onbeforeunload", "onblur", "onerror", "onfocus",
    "onhashchange", "onload", "onmessage", "onoffline", "ononline", "onpagehide", "onpageshow", "onpopstate",
    "onresize", "onscroll", "onstorage", "onunload"];

  for (const name of proxiedEventHandlers) {
    newDocument.body[name] = "1 + 2";
    t.strictEqual(newDocument.body[name], null, name + " should always be null because there is no window");
  }
  t.done();
};

exports["iframe added to a created Document should not load"] = t => {
  const document = jsdom.jsdom();
  const newDocument = document.implementation.createHTMLDocument();

  const iframe = newDocument.createElement("iframe");
  // iframe's with a name are added as a property to the window, this line is added to see if things crash
  iframe.setAttribute("name", "foobar");
  newDocument.body.appendChild(iframe);
  t.strictEqual(iframe.contentWindow, null, "contentWindow should be null, the iframe should never load");
  t.strictEqual(iframe.contentDocument, null, "contentDocument should be null, the iframe should never load");

  iframe.src = "http://example.com/"; // try to trigger a load action
  t.strictEqual(iframe.contentWindow, null, "contentWindow should be null, the iframe should never load");
  t.strictEqual(iframe.contentDocument, null, "contentDocument should be null, the iframe should never load");

  t.done();
};
