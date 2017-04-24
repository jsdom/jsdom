"use strict";
const jsdom = require("../../lib/old-api.js");

exports["relative URLs resolved relative to file base URLs (GH-1141)"] = t => {
  const document = jsdom.jsdom(`<a href="/foo.pdf" id="one">one</a><a href="foo.pdf" id="two">two</a>`, {
    url: "file:///base/path.html"
  });

  t.strictEqual(document.querySelector("#one").href, "file:///foo.pdf");
  t.strictEqual(document.querySelector("#two").href, "file:///base/foo.pdf");
  t.done();
};
