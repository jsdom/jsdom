"use strict";

var jsdom = require("../..");
var toFileUrl = require("../util").toFileUrl(__dirname);

exports["document.currentScript is null when not executing <script>"] = function (t) {
  var window = jsdom.jsdom().defaultView;
  t.strictEqual(window.document.currentScript, null);
  t.done();
};

exports["document.currentScript is currently executing <script> element"] = function (t) {
  t.expect(2);
  var html = "<html><head><script src='./files/current-script.js'></script></head>" +
             "<body><span id='test'>hello from html</span></body></html>";

  var document = jsdom.jsdom(html, {
    url: toFileUrl(__filename),
    features: {
      FetchExternalResources: ["script"],
      ProcessExternalResources: ["script"]
    }
  });

  document.onload = function () {
    t.strictEqual(document.getElementById("test").innerHTML, "true",
                  "currentScript is the currently executing script element");
    t.strictEqual(document.currentScript, null, "currentScript is still null at top-level");
    t.done();
  };
};
