// TODO: add on other levels

exports.dom = require("./jsdom/level1/core").dom;
exports.browserAugmentation = require("./jsdom/browser").browserAugmentation;


/*
Proposed API

// builds a dom with level2/core features
var dom = jsdom({features:["level2/core"]});

// builds a window with a dom capable of level2/core
var window = jsdom({
  features : ["window", "level2/core"]
});

// builds a window swith a dom capable of level2/core and level2/events and no
// live node lists
var window = jsdom({
  features : ["level2/core", "window", "level2/events"]
  options : { livelists : false }
});

*/
