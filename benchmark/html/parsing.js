"use strict";
const suite = require("../document-suite");

// Measures the time spent parsing and creating a large text node
// https://github.com/jsdom/jsdom/pull/2419

exports.text = suite(document => {
  document.body.innerHTML = `
  <p>
    ${"Some methods have unexpected implications for performance. ".repeat(5000)}
  </p>`;
});
