var sys = require("sys"), fs = require("fs"); 

var dom = require("../../lib/level1/core").dom.level1.core;
var window = require("../../lib/browser").windowAugmentation(dom).window;
var document = window.document;
var location = window.location;
var navigator = window.navigator;

fs.readFile(__dirname + "/jquery.js", function(err, data) {

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