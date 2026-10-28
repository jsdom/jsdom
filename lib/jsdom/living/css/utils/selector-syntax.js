"use strict";

const values = require("../values/value.js");

// Selector structure is native syntax, separate from generic CSS value grammar.
// These records never retain parser nodes, contexts, owners or namespace maps.
const empty = Object.freeze([]);
const nesting = Object.freeze({ kind: "nesting" });

function list(selectors) {
  selectors.kind = "selector-list";
  return selectors;
}

// Compound-only and real selectors test the current target directly. Other
// complex-selector units first match their pseudo-element chain, with `null`
// meaning an ordinary element. `undefined` preserves the direct-target case.
function compound(type = null, subclasses = empty, pseudos = undefined, combinator = null) {
  return { kind: "compound", combinator, type, subclasses, pseudos };
}

function selector(units, relative = false) {
  return { kind: "selector", relative, units };
}

function pseudo(kind, token) {
  return { kind, name: token.name, value: token.value, end: token.end, classes: null };
}

function withoutSubjectPseudos(value) {
  const units = [...value.units];
  units[units.length - 1] = { ...units[units.length - 1], pseudos: null };
  return selector(units, value.relative);
}

function containsNestingSelector(value, includeScope = false) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  if (
    value.kind === "nesting" ||
    (includeScope &&
      value.kind === "pseudo-class" &&
      value.name === undefined &&
      value.value === "scope")
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some((component) => containsNestingSelector(component, includeScope));
  }
  if (value.kind === "selector") {
    return value.units.some((unit) => containsNestingSelector(unit, includeScope));
  }
  if (value.kind === "compound") {
    return (
      containsNestingSelector(value.type, includeScope) ||
      value.subclasses.some((component) => containsNestingSelector(component, includeScope)) ||
      Boolean(value.pseudos?.some((entry) => containsNestingSelector(entry, includeScope)))
    );
  }
  if (
    value.kind === "pseudo-element" &&
    value.classes?.some((entry) => containsNestingSelector(entry, includeScope))
  ) {
    return true;
  }
  if (value.kind === undefined && values.isDelimiter("&", value)) {
    return true;
  }
  // Generic token payloads, including An+B coefficients, are not selector
  // structure. Pseudo arguments can contain lists or a native compound child.
  const argument = value.value;
  return (
    (Array.isArray(argument) || argument?.kind !== undefined) &&
    containsNestingSelector(argument, includeScope)
  );
}

module.exports = {
  compound,
  containsNestingSelector,
  empty,
  list,
  nesting,
  pseudo,
  selector,
  withoutSubjectPseudos,
};
