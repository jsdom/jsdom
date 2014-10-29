"use strict";
var core = Object.create(require("../level3/core").dom.level3.core);
var html = Object.create(require("../level2/html").dom.level2.html);

require("./dom-implementation")(core);
require("./node")(core);

exports.dom = { living: { core: core, html: html } };
