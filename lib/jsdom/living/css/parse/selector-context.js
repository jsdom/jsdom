"use strict";

const pseudos = require("../values/pseudos.js");
const nodeUtils = require("./tree.js");
const { toLowerCase } = require("../utils/string.js");

function normalizeClassName(name) {
  name = toLowerCase(name);
  return pseudos.aliases.classes.get(name) ?? name;
}

function normalizeElementName(name) {
  return toLowerCase(name);
}

function getContext(node) {
  if (node.context.selectorContext) {
    return node.context.selectorContext;
  }
  const preceding = nodeUtils.findSibling(
    node,
    (sibling) => sibling.definition.name === "<pseudo-element-selector>",
    (sibling) =>
      sibling.definition.name === "<subclass-selector>" ||
      sibling.definition.name === "<complex-selector>" ||
      sibling.definition.name === "<complex-real-selector>" ||
      sibling.definition.name?.startsWith("<relative"),
    true,
  );
  let pseudoElement = null;
  if (preceding) {
    const pseudo = preceding.value;
    pseudoElement = pseudo.name ? `${pseudo.name}()` : pseudo.value;
  }
  return {
    strict: Boolean(node.context.strict),
    namespaces: node.context.namespaces,
    withinHas: Boolean(
      nodeUtils.findFunction(node, (context) => context.definition.name === "has"),
    ),
    compoundOnly: Boolean(
      nodeUtils.findFunction(
        node,
        (context) => ["host", "host-context", "slotted"].includes(context.definition.name),
        (context) => !["is", "where", "not"].includes(context.definition.name),
      ),
    ),
    pseudoElement,
  };
}

function enterFunction(context, name) {
  return {
    ...context,
    // Logical selectors test the same pseudo-element. Other selector arguments
    // describe ordinary elements, even when the containing pseudo-class cannot match.
    pseudoElement: pseudos.logical[`${name}()`] ? context.pseudoElement : null,
    withinHas: context.withinHas || name === "has",
    compoundOnly:
      name === "host" ||
      name === "host-context" ||
      name === "slotted" ||
      (context.compoundOnly && (name === "is" || name === "where" || name === "not")),
  };
}

function isValidClass(type, context) {
  if (!Object.hasOwn(pseudos.classes, type)) {
    return false;
  }
  if (pseudos.userActions[type] || pseudos.logical[type]) {
    return true;
  }
  if (type === "has()" && context.withinHas) {
    return false;
  }
  return (
    context.pseudoElement === null ||
    Boolean(pseudos.elements[context.pseudoElement]?.classes?.includes(type))
  );
}

function isValidElement(type, context) {
  if (context.withinHas) {
    return false;
  }
  const definition = Object.hasOwn(pseudos.elements, type);
  if (!definition && !(type.startsWith("-webkit-") && !type.endsWith("()") && !context.strict)) {
    return false;
  }
  if (context.pseudoElement !== null) {
    return (
      !type.startsWith("-webkit-") &&
      Boolean(pseudos.elements[context.pseudoElement]?.elements?.includes(type))
    );
  }
  return true;
}

function combinatorAllowed(context) {
  return (
    !context.compoundOnly &&
    (context.pseudoElement === null || Boolean(pseudos.elements[context.pseudoElement]?.structured))
  );
}

module.exports = {
  getContext,
  enterFunction,
  normalizeClassName,
  normalizeElementName,
  isValidClass,
  isValidElement,
  combinatorAllowed,
};
