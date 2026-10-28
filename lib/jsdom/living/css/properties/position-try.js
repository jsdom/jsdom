"use strict";

const groups = require("./groups.js");
const definitions = require("../../../../generated/css-property-definitions.js");
// https://drafts.csswg.org/css-anchor-position-1/#accepted-position-try-properties
const acceptedGroups = ["inset", "margin", "self-alignment", "sizing"];
const included = ["position-anchor", "position-area"];
Object.entries(groups.groupsByProperty).forEach(([property, propertyGroups]) => {
  if (propertyGroups.some((group) => acceptedGroups.includes(group))) {
    included.push(property);
  }
});
module.exports = Object.fromEntries(included.map((name) => [name, definitions[name]]));
