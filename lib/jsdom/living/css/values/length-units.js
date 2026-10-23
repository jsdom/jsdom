"use strict";

// https://drafts.csswg.org/css-values-4/#absolute-length
exports.absolute = ["cm", "in", "mm", "pc", "pt", "px", "q"];
// https://drafts.csswg.org/css-conditional-5/#container-query-length
exports.container = ["cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax"];
// https://drafts.csswg.org/css-values-4/#font-relative-length
exports.font = ["cap", "ch", "em", "ex", "ic", "lh", "rcap", "rch", "rem", "rex", "ric", "rlh"];
// @link {https://drafts.csswg.org/css-values-4/#viewport-percentage-lengths}
exports.viewport = [
  "dvb",
  "dvh",
  "dvi",
  "dvmax",
  "dvmin",
  "dvw",
  "lvb",
  "lvh",
  "lvi",
  "lvmax",
  "lvmin",
  "lvw",
  "svb",
  "svh",
  "svi",
  "svmax",
  "svmin",
  "svw",
  "vb",
  "vh",
  "vi",
  "vmax",
  "vmin",
  "vw"
];
