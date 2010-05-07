var sys = require("sys");
var dom = require("../../lib/level1/core").dom.level1.core;

var window = {document: new dom.Document()};
var navigator = { userAgent: "node-js" };

//var jQuery = require("./node-jquery").jQueryInit(window, navigator);
var jQuery = require("./node-jquery");

for (var i = 0; i<10; i++)
{
  var p = window.document.createElement("p")
  p.setAttribute("class", "paragraph-" + i);
  p.appendChild(window.document.createTextNode("Item #" + i));
  
}

sys.puts(jQuery.dollar("p#paragraph-5", window.document).length);

