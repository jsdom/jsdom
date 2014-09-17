"use strict";

var fs = require("fs");
var jsdom = require("../..");
var xmlString = fs.readFileSync(__dirname + "/files/xml.xml");

exports["should not throw if no parser is given"] = function (t) {
  var document = jsdom.jsdom("<!DOCTYPE html><html></html>");

  t.done();
};

exports["should not throw if invalid html document is given"] = function (t) {
  var document = jsdom.jsdom("<!DOCTYPE html><html</html>");

  t.done();
};

exports["should ignore self-closing of tags in html docs"] = function (t) {
  var document = jsdom.jsdom(xmlString, { parsingMode: "html" });

  var window = document.parentWindow;
  t.strictEqual(window.document.getElementsByTagName("CUSTOMTAG")[0].innerHTML.trim(), "a");

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .jsdom)"] = function (t) {
  var document = jsdom.jsdom(xmlString, { parsingMode: "xml" });

  var window = document.parentWindow;
  t.strictEqual(window.document.getElementsByTagName("CUSTOMTAG")[0].innerHTML.trim(), "");

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .env)"] = function (t) {
  var document = jsdom.env({
    html: xmlString,
    parsingMode: "xml",
    done: function (err, window) {
      t.strictEqual(window.document.getElementsByTagName("CUSTOMTAG")[0].innerHTML.trim(), "");

      t.done();
    }
  });
};
