var sys = require("sys"), fs = require("fs");

var dom = require("../../lib/jsdom/level1/core").dom.level1.core;
var window = require("../../lib/jsdom/browser").windowAugmentation(dom).window;
var Script = process.binding('evals').Script;

fs.readFile(__dirname + "/jquery.js", function(err, data) {
  
  try {
    Script.runInNewContext(data.toString(), {window: window, location: window.location, navigator: window.navigator});
  } catch(e){
    sys.puts(sys.inspect(e));
  }
  window.jQuery('body').append("<div class='testing'>Hello World, It works!</div>");
  sys.puts(window.jQuery(".testing").text());
  
});