"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

// Creates a list of globals from the JS environment (not the web), so that Window.js can alias them when necessary.
// The generated list should match https://tc39.es/ecma262/#sec-global-object, to the extent V8 implements the spec.
// We generate this at build time instead of runtime because we want to avoid the performance and memory overhead of
// creating a new context when scripting is disabled in the JSDOM.

const dest = path.resolve(__dirname, "../lib/jsdom/browser/js-globals.json");

const context = vm.createContext();
const globals = vm.runInContext("Object.getOwnPropertyNames(this)", context);

// I guess VM contexts have a console, from V8? That isn't a JS global and JSDOM will install its own, so don't include
// that.
const consoleIndex = globals.indexOf("console");
if (consoleIndex !== -1) {
  globals.splice(consoleIndex, 1);
}

fs.writeFileSync(dest, JSON.stringify(globals, undefined, 2) + "\n");
