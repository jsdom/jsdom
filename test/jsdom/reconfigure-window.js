"use strict";
const jsdom = require("../..");

exports["Can reconfigure top"] = t => {
  const window = jsdom.jsdom().defaultView;

  const targetTop = { is: "top" };

  jsdom.reconfigureWindow(window, {
    top: targetTop
  });

  t.strictEqual(window.top, targetTop, "top should be changed (from the outside)");

  window.document.body.innerHTML = `<script>
    window.topResult = top.is;
  </script>`;

  t.strictEqual(window.topResult, "top", "top should be changed (from the inside)");

  t.done();
};

exports["Passing no top option does nothing"] = t => {
  const window = jsdom.jsdom().defaultView;

  jsdom.reconfigureWindow(window, { });

  t.strictEqual(window.top, window, "top should stay the same");
  t.done();
};
