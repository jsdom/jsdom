var sys = require("sys"), 
    dom = require("../../lib/level1/core").dom.level1.core,
    fs = require("fs");
window = global;
global.document =  new dom.Document();
global.navigator = { userAgent: "node-js" };

fs.readFile(__dirname + "/jquery.js", function(err, data) {

  for (var i = 0; i<10; i++)
  {
    var p = window.document.createElement("p")
    p.setAttribute("class", "paragraph-" + i);
    p.appendChild(window.document.createTextNode("Item #" + i));
  }

  sys.puts(jQuery("p#paragraph-5", window.document).length);
  
  global.document.documentElement.compareDocumentPosition = function() {};
  
  sys.puts(sys.inspect(eval(data)));

  

  //var jQuery = require("./node-jquery").jQueryInit(window, navigator);


})
