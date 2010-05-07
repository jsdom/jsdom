var sys = require("sys"), 
    dom = require("../../lib/level1/core").dom.level1.core,
    fs = require("fs");
    
global.window = require("../../lib/browser").windowAugmentation(dom);
global.document = global.window.document;
global.location = global.window.location;
var window = global;
global.navigator = { userAgent: "node-js" };

fs.readFile(__dirname + "/jquery.js", function(err, data) {
  for (var i = 0; i<10; i++)
  {
    var p = window.document.createElement("p")
    p.setAttribute("class", "paragraph-" + i);
    document.body.appendChild(window.document.createTextNode("Item #" + i));
  sys.puts(document.body.children.length);
  }
  
  
  global.window.document.compareDocumentPosition = function() {};
    dom.Node.prototype.addEventListener = 
    global.window.document.addEventListener = function() {};

  eval(data);
  
  jQuery("*").each(function() {
    sys.puts(sys.inspect(this.tagName));
  });
  
  sys.puts(jQuery("").length);
})
