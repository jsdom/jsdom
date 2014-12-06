"use strict";
var core = require("../level1/core");
var html = core;

// These (because of how they were written) directly include level1/core and modify it.
// ORDER IS IMPORTANT
require("../level2/core");
require("../level2/events");
require("../level2/html");
require("../level2/style");
require("../level3/core");
require("../level3/ls");
require("../level3/xpath");

require("./dom-implementation")(core, html);
require("./node-filter")(core, html);
require("./node")(core, html);

require("../selectors/index").applyQuerySelectorPrototype(html);

module.exports = core;
