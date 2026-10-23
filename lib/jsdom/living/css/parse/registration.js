"use strict";

const parseDefinition = require("./definition.js");
const substitutions = require("../values/substitutions.js");
const { toLowerCase } = require("../utils/string.js");
const { isList, isOmitted } = require("../values/value.js");

// Registration literals are case-sensitive custom identifiers, whereas ordinary
// grammar keywords are case-insensitive. Keep that distinction in the compiled
// grammar instead of adding registration state to the general parser.
exports.compileRegistrationSyntax = function compileRegistrationSyntax(syntax) {
  if (syntax.value === "*") {
    return "*";
  }
  const alternatives = [syntax[0], ...syntax[1].map(([, component]) => component)].map(component => {
    if (component.length === 3) {
      return parseDefinition("<transform-list>");
    }
    const [single, multiplier] = component;
    let definition = isList(single) ?
      parseDefinition(`<${single[1].value}>`) :
{
  name: "<registered-ident>",
  range: single.value,
  type: "non-terminal",
  value: "<custom-ident>"
};
    if (!isOmitted(multiplier)) {
      definition = {
        max: Infinity,
        min: 1,
        multiplier: multiplier.value,
        separator: multiplier.value === "#" ? "," : undefined,
        type: "repetition",
        value: definition
      };
    }
    return definition;
  });
  return alternatives.length === 1 ? alternatives[0] : { type: "|", value: alternatives };
};

function containsVariableReference(value) {
  if (isList(value)) {
    return value.some(containsVariableReference);
  }
  if (value.types[0] === "<function-token>") {
    return toLowerCase(value.value) === "var";
  }
  if (value.types[0] === "<function>") {
    return toLowerCase(value.name) === "var" || containsVariableReference(value.value);
  }
  return false;
}

// Universal syntax keeps dimensions and ordinary functions as untyped tokens.
// Variable references still need another property's value before substitution.
exports.isValidUniversalInitialValue = initial => {
  if (isOmitted(initial)) {
    return true;
  }
  if (initial.length === 1 && initial[0].types[0] === "<ident-token>" &&
      substitutions.keywords.includes(toLowerCase(initial[0].value))) {
    return false;
  }
  return !containsVariableReference(initial);
};
