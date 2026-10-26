"use strict";

const CSSPseudoElement = require("../../../../generated/idl/CSSPseudoElement.js");
const CSSStyleProperties = require("../../../../generated/idl/CSSStyleProperties.js");
const { parsePseudoElementSelectors } = require("../parse/parser.js");
const { getResolvedPropertyValue } = require("../resolve.js");
const { serializeComponentValue } = require("../serialize.js");
const { isFailure } = require("../values/value.js");
const { elements: pseudoElements } = require("../values/pseudos.js");

// Internal callers share the resolver's cache without allocating a public declaration object.
exports.getComputedStylePropertyValue = (element, property) => {
  return getResolvedPropertyValue(property, element);
};

exports.getComputedStyleDeclaration = (element, pseudo) => {
  const globalObject = element._globalObject;
  let ownerNode = element;
  if (pseudo && pseudo.startsWith(":")) {
    const selectors = parsePseudoElementSelectors(pseudo, globalObject);
    if (isFailure(selectors)) {
      ownerNode = null;
    } else {
      for (const selector of selectors) {
        const token = selector;
        const name = token.name ?? token.value;
        const argument = token.name ? token.value : null;
        // Valid selector syntax need not identify a supported style target.
        if (name === "part" || name === "slotted" ||
            (argument?.types.includes("<pt-name-and-class-selector>") &&
              !argument[0].types.includes("<custom-ident>")) ||
            !Object.hasOwn(pseudoElements, token.name ? `${name}()` : name)) {
          ownerNode = null;
          break;
        }
        ownerNode = CSSPseudoElement.createImpl(globalObject, [], {
          element,
          parent: ownerNode,
          selectorText: serializeComponentValue(selector),
          type: `::${name}`
        });
      }
    }
  }
  return CSSStyleProperties.createImpl(globalObject, [], {
    computed: true,
    ownerNode,
    readOnly: true
  });
};
