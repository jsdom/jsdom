"use strict";

const groups = require("../properties/logical.js");
const { getFlowSides } = require("./writing-mode.js");

const logicalNames = new Set(Object.values(groups).flatMap(([logical]) => logical));
const mappings = new WeakMap();

function physicalName(property, sides) {
  const horizontal = sides.blockStart === "top";
  if (property.includes("-start-start-") || property.includes("-start-end-") ||
      property.includes("-end-start-") || property.includes("-end-end-")) {
    return property.replace(/-(start|end)-(start|end)-/, (_, block, inline) => {
      const blockSide = sides[block === "start" ? "blockStart" : "blockEnd"];
      const inlineSide = sides[inline === "start" ? "inlineStart" : "inlineEnd"];
      return horizontal ? `-${blockSide}-${inlineSide}-` : `-${inlineSide}-${blockSide}-`;
    });
  }
  if (/(?:block|inline)-(?:start|end)/.test(property)) {
    return property.replace(/(block|inline)-(start|end)/, (_, axis, edge) => {
      return sides[`${axis}${edge === "start" ? "Start" : "End"}`];
    }).replace(/^inset-/, "");
  }
  if (property.endsWith("-size")) {
    return property.replace(/(block|inline)-size$/, (_, axis) => {
      return (axis === "block") === horizontal ? "height" : "width";
    });
  }
  return property.replace(/(block|inline)$/, (_, axis) => {
    return (axis === "block") === horizontal ? "y" : "x";
  });
}

function getPairs(writingMode, direction) {
  const sides = getFlowSides(writingMode, direction);
  let pairs = mappings.get(sides);
  if (!pairs) {
    pairs = new Map();
    for (const logical of logicalNames) {
      const physical = physicalName(logical, sides);
      pairs.set(logical, physical);
      pairs.set(physical, logical);
    }
    mappings.set(sides, pairs);
  }
  return pairs;
}

exports.isLogical = property => logicalNames.has(property);
exports.getPairs = getPairs;
