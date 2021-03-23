"use strict";
const { Canvas } = require("../../lib/jsdom/utils.js");

const nodeMajor = Number(process.versions.node.split(".", 1)[0]);
const hasNode10 = nodeMajor >= 10;
const hasNode11 = nodeMajor >= 11;
const hasNode12 = nodeMajor >= 12;
const hasCanvas = Boolean(Canvas);

exports.resolveReason = reason => {
  if (["fail-slow", "timeout", "flaky"].includes(reason) ||
    (["fail-with-canvas", "needs-canvas"].includes(reason) && !hasCanvas)) {
    return "skip";
  }

  if (reason === "fail" ||
    (reason === "fail-with-canvas" && hasCanvas) ||
    (reason === "needs-node10" && !hasNode10) ||
    (reason === "needs-node11" && !hasNode11) ||
    (reason === "needs-node12" && !hasNode12)) {
    return "expect-fail";
  }

  return "run";
};
