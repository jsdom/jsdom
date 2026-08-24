"use strict";

function resolveFontWeight(value, { getInheritedWeight, resolveDefault }) {
  if (value === "normal") {
    return "400";
  }
  if (value === "bold") {
    return "700";
  }
  if (value !== "bolder" && value !== "lighter") {
    return resolveDefault(value);
  }

  const inheritedValue = getInheritedWeight();
  const inheritedWeight = Number(inheritedValue);

  if (value === "bolder") {
    if (inheritedWeight < 350) {
      return "400";
    }
    if (inheritedWeight < 550) {
      return "700";
    }
    if (inheritedWeight < 900) {
      return "900";
    }
    return inheritedValue;
  }

  if (inheritedWeight < 100) {
    return inheritedValue;
  }
  if (inheritedWeight < 550) {
    return "100";
  }
  if (inheritedWeight < 750) {
    return "400";
  }
  return "700";
}

exports.resolveFontWeight = resolveFontWeight;
