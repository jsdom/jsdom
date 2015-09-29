"use strict";
const jsdom = require("../..");

// These tests are regression tests, not systematic serialization tests. They are compiled from the bug tracker.

exports["style attribute should not appear when accessing style property (GH-1109)"] = t => {
  const document = jsdom.jsdom("<p>hello</p>");
  const p = document.querySelector("p");

  t.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear before");

  /* eslint-disable no-unused-expressions */
  p.style;
  /* eslint-enable no-unused-expressions */

  t.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear after");

  t.done();
};

exports["void elements should serialize correctly"] = t => {
  const html = "<html><head></head><body><div><br><hr><audio><source></audio></div></body></html>";
  const document = jsdom.jsdom(html);

  t.strictEqual(jsdom.serializeDocument(document), html);
  t.done();
};

exports["the case of html/body, or their omission, should not effect serialization"] = t => {
  const inputs = [
    "<HTML><BODY></BODY></HTML>",
    "<html><BODY></Body></HTML>",
    "<html><body></body></html>",
    "<body></body>",
    ""
  ];

  const outputs = inputs.map(input => jsdom.serializeDocument(jsdom.jsdom(input)));

  for (const output of outputs) {
    t.strictEqual(output, "<html><head></head><body></body></html>");
  }
  t.done();
};

exports["outerHTML should not format the HTML (GH-371)"] = t => {
  const originalHTML = "<li><span>A</span><span>B</span></li>";
  const document = jsdom.jsdom(originalHTML);
  const outerHTML = document.body.firstChild.outerHTML;

  t.strictEqual(outerHTML, originalHTML);
  t.done();
};
