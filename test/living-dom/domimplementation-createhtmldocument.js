"use strict";

var jsdom = require("../..");
var core  = require("../../lib/jsdom/living").dom.living.core;


// Tests adapted from https://github.com/w3c/web-platform-tests/blob/master/dom/nodes/DOMImplementation-createHTMLDocument.html
// Spec: https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument

function checkDoc(testName, title, expectedtitle) {
  exports[testName] = function(t) {
    var document = jsdom.jsdom(null);
    document.implementation = new (core.DOMImplementation)(document);
    var doc = document.implementation.createHTMLDocument(title);

    t.strictEqual(doc.doctype.name, "html");
    t.strictEqual(doc.doctype.publicId, "undefined");
    t.strictEqual(doc.doctype.systemId, "undefined");
    t.strictEqual(doc.documentElement.localName, "html");
    t.strictEqual(doc.documentElement.firstChild.localName, "head");
    if (title !== undefined && title !== null) {
      t.strictEqual(doc.documentElement.firstChild.childNodes.length, 1);
      t.strictEqual(doc.documentElement.firstChild.firstChild.localName, "title");
      t.strictEqual(doc.documentElement.firstChild.firstChild.firstChild.data,
                    expectedtitle);
    } else {
      t.strictEqual(doc.documentElement.firstChild.childNodes.length, 0);
    }
    t.strictEqual(doc.documentElement.lastChild.localName, "body");
    t.strictEqual(doc.documentElement.lastChild.childNodes.length, 0);
    t.done();
  };
}

checkDoc("createHTMLDocument(): Title argument is empty string", "", "", "");
checkDoc("createHTMLDocument(): Title argument is null", null, "null", "null");
checkDoc("createHTMLDocument(): Title argument is undefined", undefined, "", "");
checkDoc("createHTMLDocument(): Title argument contains spaces", "foo  bar baz", "foo  bar baz");
checkDoc("createHTMLDocument(): Title argument contains tabs", "foo\t\tbar baz", "foo\t\tbar baz");
checkDoc("createHTMLDocument(): Title argument contains new lines", "foo\n\nbar baz", "foo\n\nbar baz");
checkDoc("createHTMLDocument(): Title argument contains formfeeds", "foo\f\fbar baz", "foo\f\fbar baz");
checkDoc("createHTMLDocument(): Title argument contains carriage returns", "foo\r\rbar baz", "foo\r\rbar baz");


exports["createHTMLDocument(): Missing title argument"] = function (t) {
  var document = jsdom.jsdom(null);
  document.implementation = new (core.DOMImplementation)(document);
  var doc = document.implementation.createHTMLDocument();

  t.strictEqual(doc.doctype.name, "html");
  t.strictEqual(doc.doctype.publicId, "undefined");
  t.strictEqual(doc.doctype.systemId, "undefined");
  t.strictEqual(doc.documentElement.localName, "html");
  t.strictEqual(doc.documentElement.firstChild.localName, "head");
  t.strictEqual(doc.documentElement.firstChild.childNodes.length, 0);
  t.strictEqual(doc.documentElement.lastChild.localName, "body");
  t.strictEqual(doc.documentElement.lastChild.childNodes.length, 0);
  t.done();
};


exports["createHTMLDocument(): metadata"] = function (t) {
  var document = jsdom.jsdom(null);
  document.implementation = new (core.DOMImplementation)(document);
  var doc = document.implementation.createHTMLDocument("test");

  t.strictEqual(doc.URL, "about:blank");
  t.strictEqual(doc.documentURI, "about:blank");
  t.strictEqual(doc.compatMode, "CSS1Compat");
  // XXX Spec says "utf-8", browsers do "UTF-8".
  t.strictEqual(doc.characterSet.toUpperCase(), "UTF-8");
  t.strictEqual(doc.contentType, "text/html");
  t.strictEqual(doc.createElement("DIV").localName, "div");
  t.done();
};

