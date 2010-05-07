var sys = require("sys"), 
    dom = require(__dirname +"/../../lib/level1/core").dom.level1.core,
    fs = require("fs");
    
var window = global.window = require(__dirname + "/../../lib/browser").windowAugmentation(dom);
var document = global.document = global.window.document;
var location = global.location = global.window.location;
var window = global;
var navigator = global.navigator = { userAgent: "node-js" };

fs.readFile(__dirname + "/jquery.js", function(err, data) {

  global.window.document.compareDocumentPosition = function() {};
  dom.Node.prototype.addEventListener = window.addEventListener = window.document.addEventListener = function() {};

  try {
    eval(data);
  } catch (e) {
    sys.puts(sys.inspect(e.stack, true));
  }

  // Doing this requires you setup a parser, easiest way is to put node-htmlparser.js into 
  // ~/.node_libraries/
  jQuery(document.body).append("<div class='testing'>Hello World, It works!</div>");
  sys.puts(jQuery(".testing").text());
 
})
