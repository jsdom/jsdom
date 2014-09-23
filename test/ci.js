#!/usr/bin/env node

"use strict";

if (process.env.TEST_SUITE === "node") {
  require("./runner");
} else if (process.env.TEST_SUITE === "browser") {
  require("./browser-runner");
} else {
  process.exit(1);
}
