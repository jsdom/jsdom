"use strict";

exports.getDeclarationDefinition = getDeclarationDefinition;
exports.getDeclarationValueDefinition = getDeclarationValueDefinition;
exports.getRuleDefinition = getRuleDefinition;
const compatibility = require("../compatibility.js");
const nodeUtils = require("./tree.js");
const strings = require("../utils/string.js");
const declarationDefinitions = new WeakMap();

function getDeclarationDefinition(context, name) {
  const rule = context.definition.type === "rule" ? context : nodeUtils.getRule({ context });
  let cache = declarationDefinitions.get(rule.definition);
  if (!cache) {
    cache = new Map();
    declarationDefinitions.set(rule.definition, cache);
  }
  const cached = cache.get(name);
  if (cached) {
    return cached;
  }
  const definition = createDeclarationDefinition(rule, name);
  // Only finite, predefined names are cached; caller-provided custom names stay ephemeral.
  if (definition && !definition.wildcard && !name.startsWith("--") &&
      (rule.definition.value.properties?.[definition.name] ||
       rule.definition.value.descriptors?.[definition.name])) {
    cache.set(definition.name, definition);
  }
  return definition;
}

function getDeclarationValueDefinition(definition) {
  return {
    ...definition,
    name: definition.wildcard ? undefined : definition.name,
    type: "non-terminal"
  };
}

function createDeclarationDefinition(rule, name) {
  const {
    definition: {
      name: ruleName,
      value: {
        descriptors,
        properties
      }
    }
  } = rule;
  if (properties) {
    if (name.startsWith("--")) {
      const definition = properties["--*"];
      if (definition && name !== "--") {
        return {
          name,
          type: "declaration",
          value: definition.value,
          custom: true
        };
      }
      return null;
    }
    name = strings.toLowerCase(name);
    name = compatibility.properties.aliases.get(name) ?? name;
    const value = properties[name]?.value;
    if (value) {
      return {
        name,
        type: "declaration",
        value
      };
    }
  }
  if (descriptors) {
    if (descriptors["*"] !== undefined) {
      return { name, type: "declaration", value: descriptors["*"], wildcard: true };
    }
    if (name.startsWith("--")) {
      const definition = descriptors["--*"];
      if (definition && name !== "--") {
        return {
          name,
          type: "declaration",
          value: definition.value,
          custom: true
        };
      }
      return null;
    }
    name = strings.toLowerCase(name);
    name = compatibility.descriptors[ruleName]?.aliases.get(name) ?? name;
    const target = compatibility.descriptors[ruleName]?.mappings?.get(name);
    const value = descriptors[target]?.value ?? descriptors[name]?.value;
    if (value) {
      return {
        name,
        type: "declaration",
        value
      };
    }
  }
  return null;
}

function getRuleDefinition({ definition }, name) {
  const { rules } = definition.type === "rule" ? definition.value : definition;
  if (!rules) {
    return null;
  }
  if (name) {
    name = `@${strings.toLowerCase(name)}`;
    const alias = compatibility.rules.aliases.get(name);
    if (alias) {
      name = alias;
    }
    const definitions = rules.filter(rule => rule.name === name || rule.names?.includes(name));
    if (definitions.length > 1) {
      return {
        type: "|",
        value: definitions
      };
    }
    return definitions[0];
  }
  return rules.find(rule => rule.qualified);
}
