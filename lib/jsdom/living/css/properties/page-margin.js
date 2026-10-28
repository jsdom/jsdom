"use strict";

const page = require("./page.js");
const definitions = require("../../../../generated/css-property-definitions.js");
// https://drafts.csswg.org/css-page-3/#page-margin-property
const included = ["content", "overflow", "unicode-bidi", "vertical-align", "z-index"];
const entries = included.map((name) => [name, definitions[name]]);
module.exports = {
  ...page,
  ...Object.fromEntries(entries),
};
