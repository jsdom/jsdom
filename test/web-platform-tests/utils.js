"use strict";
const { Canvas } = require("../../lib/jsdom/utils.js");

const nodeMajor = Number(process.versions.node.split(".", 1)[0]);
const hasNode14 = nodeMajor >= 14;
const hasCanvas = Boolean(Canvas);

exports.resolveReason = reason => {
  if (["fail-slow", "timeout", "flaky"].includes(reason) ||
    (["fail-with-canvas", "needs-canvas"].includes(reason) && !hasCanvas)) {
    return "skip";
  }

  if (reason === "fail" ||
    (reason === "fail-with-canvas" && hasCanvas) ||
    (reason === "needs-node14" && !hasNode14)) {
    return "expect-fail";
  }

  return "run";
};
