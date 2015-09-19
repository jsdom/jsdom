"use strict";
const jsdom = require("../../lib/old-api.js");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

exports["document.currentScript is null when not executing <script>"] = t => {
  const window = jsdom.jsdom().defaultView;
  t.strictEqual(window.document.currentScript, null);
  t.done();
};

exports["document.currentScript is currently executing <script> element"] = t => {
  t.expect(2);
  const html = "<html><head><script src='./files/current-script.js'></script></head>" +
               "<body><span id='test'>hello from html</span></body></html>";

  const document = jsdom.jsdom(html, {
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
