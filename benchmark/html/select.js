"use strict";
const suite = require("../document-suite");

exports.text = suite(document => {
  document.body.innerHTML = `
  <select>
    ${"<option value=\"volvo\">Volvo</option>".repeat(5000)}
  </select>`;
});
