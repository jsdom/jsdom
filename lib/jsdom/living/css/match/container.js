"use strict";

module.exports = match;
const resolver = require("../resolve.js");
const values = require("../values/value.js");
const serialization = require("../serialize.js");
// https://drafts.csswg.org/css-conditional-5/#typedef-container-query
function matchQuery(query) {
  return values.isOmitted(query);
}

// https://drafts.csswg.org/css-conditional-5/#typedef-container-name
function matchName(name, element) {
  return values.isOmitted(name) ||
    name.value === serialization.serializeComponentValue(resolver.getComputedValue("container-name", element));
}

// https://drafts.csswg.org/css-conditional-5/#typedef-container-condition
function match(conditions, element) {
  return conditions.some(([name, query]) => matchName(name, element) && matchQuery(query, element));
}
