var sys = require("sys"), 
    dom = require("../../lib/level1/core").dom.level1.core,
    fs = require("fs");
    
var dom = require("../../lib/browser").windowAugmentation(dom);

var window = global;
global.window = global;
global.document =  new dom.Document();
global.navigator = { userAgent: "node-js" };

fs.readFile(__dirname + "/jquery.js", function(err, data) {
  var html = window.document.createElement("html");
  window.document.appendChild(html);
  for (var i = 0; i<10; i++)
  {
    var p = window.document.createElement("p")
    p.setAttribute("class", "paragraph-" + i);
    p.appendChild(window.document.createTextNode("Item #" + i));
  }
sys.puts(global.document.documentElement);
  global.document.compareDocumentPosition = function() {};
  
  eval.call(global, data);
  sys.puts(JSON.stringify(data));
  sys.puts(jQuery("p#paragraph-5", window.document).length);

  //var jQuery = require("./node-jquery").jQueryInit(window, navigator);


})
