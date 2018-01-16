"use strict";

exports.DOMException = require("domexception");

require("./register-elements")(exports);

// These need to be cleaned up...
require("../level2/style")(exports);
require("../level3/xpath")(exports);

// This one is OK but needs migration to webidl2js eventually.
require("./node-filter")(exports);

exports.URL = require("whatwg-url").URL;
exports.URLSearchParams = require("whatwg-url").URLSearchParams;
