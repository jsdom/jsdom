"use strict";

const horizontal = [
  { blockStart: "top", blockEnd: "bottom", inlineStart: "left", inlineEnd: "right" },
  { blockStart: "top", blockEnd: "bottom", inlineStart: "right", inlineEnd: "left" },
];
const verticalRL = [
  { blockStart: "right", blockEnd: "left", inlineStart: "top", inlineEnd: "bottom" },
  { blockStart: "right", blockEnd: "left", inlineStart: "bottom", inlineEnd: "top" },
];
const verticalLR = [
  { blockStart: "left", blockEnd: "right", inlineStart: "top", inlineEnd: "bottom" },
  { blockStart: "left", blockEnd: "right", inlineStart: "bottom", inlineEnd: "top" },
];
const flowSides = {
  "horizontal-tb": horizontal,
  "vertical-rl": verticalRL,
  "vertical-lr": verticalLR,
  "sideways-rl": verticalRL,
  "sideways-lr": [verticalLR[1], verticalLR[0]],
};

// https://drafts.csswg.org/css-writing-modes-4/#logical-to-physical
exports.getFlowSides = (writingMode, direction) =>
  flowSides[writingMode][direction === "rtl" ? 1 : 0];
