"use strict";

exports.findRule = findRule;
exports.isCSSType = isCSSType;
exports.isCombination = isCombination;
exports.isCompound = isCompound;
exports.isMultipliableWith = isMultipliableWith;
exports.isMultiplied = isMultiplied;
exports.isSequence = isSequence;
const definitions = require("../rules/definitions.js");
const sequences = ["||", "&&", " "];
const combinators = exports.combinators = ["|", ...sequences];
const compounds = ["block", "declaration", "function", "rule"];
const types = ["arbitrary", "forgiving", "non-terminal", "rule", "unsupported"];

function findRule(type, rules = definitions.value.rules, depth = 1) {
  if (depth < 3) {
    for (const rule of rules) {
      const {
        name,
        names,
        value
      } = rule;
      if (name === type || names?.includes(type)) {
        return rule;
      }
      if (value?.rules) {
        const child = findRule(type, value.rules, depth + 1);
        if (child) {
          return child;
        }
      }
    }
  }
  return undefined;
}

function isCSSType(definition) {
  return types.includes(definition.type);
}

function isCombination(definition) {
  return combinators.includes(definition.type);
}

function isCompound(definition) {
  return compounds.includes(definition.type);
}

function isMultipliableWith(definition, multiplier) {
  if (multiplier === "!") {
    return isCombination(definition);
  }
  if (definition.type === "repetition") {
    if (multiplier === "?") {
      // #? or #{A}? or {A}? but not *? or +?
      return definition.multiplier === "#" || definition.multiplier === "{";
    }
    if (multiplier.startsWith("#")) {
      // +# or +#{A}
      return definition.multiplier === "+";
    }
    return false;
  }
  return isCSSType(definition) || definition.type === "token";
}

function isMultiplied({ type }) {
  return type === "optional" || type === "required" || type === "repetition";
}

function isSequence({ type }) {
  return sequences.includes(type) || type === "repetition";
}
