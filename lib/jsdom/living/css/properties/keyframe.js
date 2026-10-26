"use strict";

const definitions = require("../../../../generated/css-property-definitions.js");
// https://drafts.csswg.org/css-animations-1/#keyframes
const excluded = [
  "-webkit-animation",
  "-webkit-animation-delay",
  "-webkit-animation-direction",
  "-webkit-animation-duration",
  "-webkit-animation-fill-mode",
  "-webkit-animation-iteration-count",
  "-webkit-animation-name",
  "-webkit-animation-play-state",
  "animation",
  "animation-composition",
  "animation-delay",
  "animation-delay-end",
  "animation-delay-start",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-range",
  "animation-range-end",
  "animation-range-start",
  "animation-timeline",
  "animation-trigger"
];
const entries = Object.entries(definitions).filter(([property]) => !excluded.includes(property));
module.exports = Object.fromEntries(entries);
