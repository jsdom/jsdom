
var dom = exports.dom = require("./jsdom/level1/core").dom;
exports.defaultLevel = dom.level1.core;
exports.browserAugmentation = require("./jsdom/browser").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser").windowAugmentation;

exports.jsdom = function(level) {
  level = level || exports.defaultLevel;
  var doc = new (level.Document)();
  doc.window =  function() {
    return exports.windowAugmentation(level, {document: doc});
  }
  return doc;
}


/*

exports.monkeyDong = {};
exports.dom = require("./jsdom/level1/core").dom;


var Window = exports.Window = function(dom) {
  dom = dom || exports.dom.level1.core;
  var window = windowAugmentation(dom);
  window.window = window;
  return window;
};
Window.prototype = {}

exports.browser = function() {

};

exports.jsdom = function() {


}



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
