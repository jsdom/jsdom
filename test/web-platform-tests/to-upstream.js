"use strict";
const path = require("path");
const readdirRecursive = require("fs-readdir-recursive");

const testsPath = path.resolve(__dirname, "to-upstream");
const runWebPlatformTest = require("./run-to-upstream-web-platform-test")(exports, testsPath);

readdirRecursive(testsPath).forEach(runWebPlatformTest);
