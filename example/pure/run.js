var browser = require("../../lib/browser");
var dom = new browser.browserAugmentation(require("../../lib/level1/core").dom.level1.core);



var window = {};


var Sizzle = require("../sizzle/sizzle").sizzleInit(window, dom);
var pure   = require("./pure");


