"use strict";
var core = require("../level3/core").dom.level3.core;
var html = require("../level2/html").dom.level2.html;

require("./dom-implementation")(core, html);
require("./node-filter")(core, html);
require("./node")(core, html);

require("../selectors/index").applyQuerySelectorPrototype(html);

exports.dom = { living: { core: core, html: html } };
