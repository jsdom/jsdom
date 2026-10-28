"use strict";

const { getCSSState } = require("../state.js");
const { getStyleScope, getStyleSheetState } = require("./style-scope.js");

exports.getRegisteredProperties = (document) => {
  const state = getStyleSheetState(document);
  if (state.registeredProperties !== null) {
    return state.registeredProperties;
  }
  const properties = new Map();
  for (const root of document._styleSheetScopes) {
    for (const { rule } of getStyleScope(root).registrations) {
      for (const name of rule.names) {
        properties.set(name, rule._registration);
      }
    }
  }
  for (const [name, registration] of getCSSState(document._globalObject).customProperties) {
    properties.set(name, registration);
  }
  state.registeredProperties = properties;
  return properties;
};
