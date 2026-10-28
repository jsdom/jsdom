"use strict";

exports.serializeSelector = serializeSelector;
exports.serializeNativeSelector = serializeNativeSelector;

const {
  serializeAttributeSelector,
  serializeComponentValue,
  serializeIdentifier,
  serializeIdentifierFromPrimitive,
} = require("../serialize.js");
const { getStyleSheetPlan } = require("./rule-index.js");
const noNamespaces = new Map();

function serializeType(type, namespaces, omitUniversal) {
  if (type === null) {
    return "";
  }
  if (type.kind === "nesting") {
    return "&";
  }
  let { prefix } = type;
  if (namespaces !== undefined && prefix !== undefined && prefix !== "") {
    const namespace = prefix === null ? undefined : namespaces.get(prefix);
    if ((prefix === null || namespaces.has(prefix)) && namespace === namespaces.get("")) {
      prefix = undefined;
    }
  }
  if (omitUniversal && prefix === undefined && type.universal) {
    return "";
  }
  let namespace = "";
  if (prefix !== undefined) {
    const name = prefix === null ? "*" : serializeIdentifierFromPrimitive(prefix);
    namespace = `${name}|`;
  }
  return namespace + (type.universal ? "*" : serializeIdentifier(type));
}

function serializeCompound(compound, context) {
  const namespaces = context?.selectorNamespaces;
  const hasHost = compound.subclasses.some(
    (subclass) =>
      subclass.kind === "pseudo-class" &&
      (subclass.value === "host" || subclass.name === "host" || subclass.name === "host-context"),
  );
  const omitUniversal =
    namespaces !== undefined &&
    !hasHost &&
    (Boolean(compound.pseudos) || compound.subclasses.length > 0);
  let text = serializeType(compound.type, namespaces, omitUniversal);
  for (const subclass of compound.subclasses) {
    text += serializeNativeSelector(subclass, context);
  }
  if (compound.pseudos) {
    for (const pseudo of compound.pseudos) {
      text += serializeNativeSelector(pseudo, context);
      if (pseudo.classes !== null) {
        for (const pseudoClass of pseudo.classes) {
          text += serializeNativeSelector(pseudoClass, context);
        }
      }
    }
  }
  return text;
}

function serializeCombinator(combinator, context) {
  return typeof combinator === "string"
    ? combinator
    : serializeComponentValue(combinator.value, context);
}

function serializeNativeSelector(value, context) {
  if (value.representation !== undefined) {
    return value.representation;
  }
  switch (value.kind) {
    case "selector-list":
      return value.map((selector) => serializeNativeSelector(selector, context)).join(", ");
    case "selector":
      return value.units
        .map((unit, index) => {
          const relation = unit.combinator;
          let prefix = "";
          if (index > 0) {
            prefix = relation === null ? " " : ` ${serializeCombinator(relation, context)} `;
          } else if (value.relative && relation !== null) {
            prefix = `${serializeCombinator(relation, context)} `;
          }
          return prefix + serializeCompound(unit, context);
        })
        .join("");
    case "compound":
      return serializeCompound(value, context);
    case "nesting":
      return "&";
    case "type":
      return serializeType(value, context?.selectorNamespaces, false);
    case "class":
      return `.${serializeIdentifier(value)}`;
    case "id":
      return `#${serializeIdentifier(value)}`;
    case "pseudo-class":
    case "pseudo-element": {
      const prefix = value.kind === "pseudo-element" ? "::" : ":";
      return value.name === undefined
        ? prefix + serializeIdentifier(value)
        : `${prefix}${value.name}(${serializeComponentValue(value.value, context)})`;
    }
    case "attribute":
      return serializeAttributeSelector(value);
    case "invalid-selector":
      return serializeComponentValue(value.value, context);
    default:
      throw new RangeError("Unexpected native selector kind");
  }
}

// Namespace/universal canonicalization affects emitted text only. The retained
// syntax continues to preserve matching constraints and featureless-host rules.
// https://github.com/w3c/csswg-drafts/issues/1606
function serializeSelector(selector, sheet) {
  return serializeNativeSelector(selector, {
    selectorNamespaces: sheet ? getStyleSheetPlan(sheet).namespaces : noNamespaces,
  });
}
