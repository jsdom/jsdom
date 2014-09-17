"use strict";

var jsdom = require("../..");

exports["should not throw if no parser is given"] = function (t) {
  var document = jsdom.jsdom("<!DOCTYPE html><html></html>");

  t.done();
};

exports["should not throw if invalid html document is given"] = function (t) {
  var document = jsdom.jsdom("<!DOCTYPE html><html</html>");

  t.done();
};

exports["should ignore self-closing of tags in html docs"] = function (t) {
  var document = jsdom.jsdom(
    "<?xml version='1.0' encoding='utf-8'?><html xmlns='http://www.w3.org/1999/xhtml'><head><title>T</title></head><body><CUSTOMTAG />a</body></html>",
    { parsingMode: "html" });

  var window = document.parentWindow;
  t.strictEqual(window.document.getElementsByTagName("CUSTOMTAG")[0].innerHTML, "a");

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .jsdom)"] = function (t) {
  var document = jsdom.jsdom(
    "<?xml version='1.0' encoding='utf-8'?><html xmlns='http://www.w3.org/1999/xhtml'><head><title>T</title></head><body><CUSTOMTAG />a</body></html>",
    { parsingMode: "xml" });

  var window = document.parentWindow;
  t.strictEqual(window.document.getElementsByTagName("CUSTOMTAG")[0].innerHTML, "");

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .env)"] = function (t) {
  var document = jsdom.env({
    html: "<?xml version='1.0' encoding='utf-8'?><html xmlns='http://www.w3.org/1999/xhtml'><head><title>T</title></head><body><CUSTOMTAG />a</body></html>",
    parsingMode: "xml",
    done: function (err, window) {
      t.strictEqual(window.document.getElementsByTagName("CUSTOMTAG")[0].innerHTML, "");

      t.done();
    }
  });
};
