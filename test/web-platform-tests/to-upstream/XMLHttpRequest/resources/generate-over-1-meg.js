"use strict";
/* eslint-env node */
const fs = require("fs");
const path = require("path");
// Node.js script. Run it using `node generate-over-1-meg.js`

const string = "abcd".repeat(290000);
fs.writeFileSync(path.resolve(__dirname, "over-1-meg.txt"), string);
