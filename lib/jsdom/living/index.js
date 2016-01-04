"use strict";
const core = module.exports = require("../level1/core");

// These (because of how they were written) directly include level1/core and modify it.
// ORDER IS IMPORTANT
require("../level2/events");
require("../level2/html");
require("../level2/style");
require("../level3/core");
require("../level3/xpath");

require("./html-collection")(core);
require("./node-filter")(core);
require("./node-iterator")(core);
require("./node-list")(core);
require("./blob")(core);
require("./file")(core);
require("./filelist")(core);
require("./form-data")(core);
require("./xmlhttprequest-event-target")(core);
require("./xmlhttprequest-upload")(core);

core.Attr = require("./generated/Attr").interface;
core.CharacterData = require("./generated/CharacterData").interface;
core.Comment = require("./generated/Comment").interface;
core.DocumentType = require("./generated/DocumentType").interface;
core.DOMImplementation = require("./generated/DOMImplementation").interface;
core.ProcessingInstruction = require("./generated/ProcessingInstruction").interface;
core.Text = require("./generated/Text").interface;

core.DOMTokenList = require("./dom-token-list").DOMTokenList;
core.URL = require("whatwg-url-compat").createURLConstructor();
