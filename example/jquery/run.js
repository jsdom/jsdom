var sys = require("sys");
process.mixin(GLOBAL, require("../../src/level1/core").dom.level1.core);

var window = {document: new Document()};
var navigator = { userAgent: "node-js" };

var jQuery = require("./node-jquery").jQueryInit(window, navigator);

for (var i = 0; i<10; i++)
{
  var p = window.document.createElement("p")
  p.setAttribute("class", "paragraph-" + i);
  p.appendChild(window.document.createTextNode("Item #" + i));
  
}

sys.puts(jQuery("p#paragraph-5", window.document).length);

