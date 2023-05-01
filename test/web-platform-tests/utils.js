"use strict";
const { Canvas } = require("../../lib/jsdom/utils.js");

const hasCanvas = Boolean(Canvas);

const nodeMajorVersion = process.versions.node.split(".")[0];

exports.resolveReason = reason => {
  if (["fail-slow", "timeout", "flaky"].includes(reason)) {
    return "skip";
  }

  if (["fail-with-canvas", "needs-canvas"].includes(reason) && !hasCanvas) {
    return "skip";
  }

  if (reason === "fail-node18" && nodeMajorVersion === "18") {
    return "skip";
  }

  if (reason === "fail" ||
    (reason === "fail-with-canvas" && hasCanvas)) {
    return "expect-fail";
  }

  return "run";
};
