var sys = require("sys"), 
    dom = require(__dirname +"/../../lib/level1/core").dom.level1.core,
    fs = require("fs");

    
var window = require(__dirname + "/../../lib/browser").windowAugmentation(dom);
var document = window.document = window.document;
var location = window.location = window.location;
var navigator = window.navigator = { userAgent: "node-js" };
global.window = window;

fs.readFile(__dirname + "/jquery.js", function(err, data) {
  global.window.document.compareDocumentPosition = function() {};
  dom.Node.prototype.addEventListener = window.addEventListener = window.document.addEventListener = function() {};

  try {
    eval(data.toString());
  } catch (e) {
    sys.puts(sys.inspect(e.stack, true));
  }

  // Doing this requires you setup a parser, easiest way is to put node-htmlparser.js into 
  // ~/.node_libraries/

  window.jQuery(document.body).append("<div class='testing'>Hello World, It works!</div>");
  sys.puts(window.jQuery(".testing").text());
});