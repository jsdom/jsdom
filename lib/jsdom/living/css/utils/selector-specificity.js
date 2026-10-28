"use strict";

const values = require("../values/value.js");
const zeroSpecificity = [0, 0, 0];

exports.compareSpecificities = compareSpecificities;
exports.getHighestSpecificity = getHighestSpecificity;
exports.getSelectorSpecificity = getSelectorSpecificity;

// https://drafts.csswg.org/selectors/#specificity-rules
function mergeSpecificities(...specificities) {
  return specificities.reduce((sum, specificity) =>
    sum.map((value, index) => value + specificity[index]),
  );
}

function compareSpecificities(a, b) {
  for (const [index, an] of a.entries()) {
    const bn = b[index];
    if (an < bn) {
      return -1;
    }
    if (bn < an) {
      return 1;
    }
  }
  return 0;
}

function getHighestSpecificity(specificities) {
  return specificities.reduce(
    (highest, specificity) => {
      return compareSpecificities(specificity, highest) > 0 ? specificity : highest;
    },
    [0, 0, 0],
  );
}

function getPseudoClassSelectorSpecificity({ name, value }, nestingSpecificity) {
  switch (name) {
    case "has":
    case "not":
      return getHighestSpecificity(
        value.map((selector) => getSelectorSpecificity(selector, nestingSpecificity)),
      );
    case "is":
      return getHighestSpecificity(
        value
          .filter((selector) => selector.kind !== "invalid-selector")
          .map((selector) => getSelectorSpecificity(selector, nestingSpecificity)),
      );
    case "host":
    case "host-context":
      return mergeSpecificities([0, 1, 0], getSelectorSpecificity(value, nestingSpecificity));
    case "nth-child":
    case "nth-last-child":
      if (!values.isOmitted(value[1])) {
        return mergeSpecificities(
          [0, 1, 0],
          getHighestSpecificity(
            value[1][1].map((selector) => getSelectorSpecificity(selector, nestingSpecificity)),
          ),
        );
      }
      break;
    case "where":
      return [0, 0, 0];
  }
  return [0, 1, 0];
}

function getPseudoElementSelectorSpecificity({ name, value }, nestingSpecificity) {
  switch (name) {
    case "highlight":
      return [0, 0, values.isDelimiter("*", value) ? 0 : 1];
    case "slotted":
      return mergeSpecificities([0, 0, 1], getSelectorSpecificity(value, nestingSpecificity));
    case "view-transition-group":
    case "view-transition-group-children":
    case "view-transition-image-pair":
    case "view-transition-new":
    case "view-transition-old":
      return [
        0,
        0,
        value.length === 0 || (values.isDelimiter("*", value[0]) && values.isOmitted(value[1]))
          ? 0
          : 1,
      ];
  }
  return [0, 0, 1];
}

const specificityCache = new WeakMap();

function getSelectorSpecificity(selector, nestingSpecificity = zeroSpecificity) {
  let cached = specificityCache.get(selector);
  if (!cached || compareSpecificities(cached.nestingSpecificity, nestingSpecificity) !== 0) {
    cached = {
      nestingSpecificity,
      value: calculateSelectorSpecificity(selector, nestingSpecificity),
    };
    specificityCache.set(selector, cached);
  }
  return cached.value;
}

function calculateSelectorSpecificity(selector, nestingSpecificity) {
  if (selector === null) {
    return [0, 0, 0];
  }
  switch (selector.kind) {
    case "nesting":
      return nestingSpecificity;
    case "attribute":
    case "class":
      return [0, 1, 0];
    case "id":
      return [1, 0, 0];
    case "type":
      return [0, 0, selector.universal ? 0 : 1];
    case "selector":
      return selector.units.reduce(
        (sum, unit) => {
          return mergeSpecificities(sum, getSelectorSpecificity(unit, nestingSpecificity));
        },
        [0, 0, 0],
      );
    case "compound": {
      let sum =
        selector.type === null
          ? [0, 0, 0]
          : getSelectorSpecificity(selector.type, nestingSpecificity);
      for (const subclass of selector.subclasses) {
        sum = mergeSpecificities(sum, getSelectorSpecificity(subclass, nestingSpecificity));
      }
      if (selector.pseudos) {
        for (const pseudo of selector.pseudos) {
          sum = mergeSpecificities(sum, getSelectorSpecificity(pseudo, nestingSpecificity));
        }
      }
      return sum;
    }
    case "pseudo-class":
      return getPseudoClassSelectorSpecificity(selector, nestingSpecificity);
    case "pseudo-element": {
      let sum = getPseudoElementSelectorSpecificity(selector, nestingSpecificity);
      if (selector.classes !== null) {
        for (const pseudo of selector.classes) {
          sum = mergeSpecificities(sum, getSelectorSpecificity(pseudo, nestingSpecificity));
        }
      }
      return sum;
    }
    default:
      throw new RangeError("Unexpected native selector kind");
  }
}
