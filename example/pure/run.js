var browser = require("../../lib/browser");
var dom = new browser.browserAugmentation(require("../../lib/level1/core").dom.level1.core);
//var sax = require("./sax");

/**
  setup sax parser
*/
dom.Element.prototype.__defineSetter__('innerHTML', function(html) {
 

});



var doc = new dom.Document("html");  

var implementation = new dom.DOMImplementation(doc, {
  "HTML" : "1.0",
  "DisableLiveLists" : "1.0"
});

var notations = new dom.NotationNodeMap(
  doc,
  doc.createNotationNode("notation1","notation1File", null),
  doc.createNotationNode("notation2",null, "notation2File")
);

var entities = new dom.EntityNodeMap(doc);

var doctype = new dom.DocumentType(doc, "html", entities, notations);
doc.doctype = doctype;
doc.implementation = implementation;

var html      = doc.createElement("html");
var html      = doc.appendChild(html);
var head      = doc.createElement("head");
var head      = html.appendChild(head);

var meta      = doc.createElement("meta");
meta.setAttribute("http-equiv", "Content-Type");
meta.setAttribute("content", "text/html; charset=UTF-8");
head.appendChild(meta);

var title     = doc.createElement("title")
title.appendChild(doc.createTextNode("hc_staff"));
var title     = head.appendChild(title);

// make the tests work....
head.appendChild(doc.createElement("script"));
head.appendChild(doc.createElement("script"));
head.appendChild(doc.createElement("script"));

var body      = doc.createElement("body");
html.appendChild(body);
var ul = doc.createElement("ul");
body.appendChild(ul);
ul.appendChild(doc.createElement("li"));

var div = doc.createElement("div");
div.setAttribute("class", "who");
body.appendChild(div);

var sys = require("sys");
var window = { 
  alert : function() { sys.puts(sys.inspect(arguments)); },
  document : doc
};

window.Sizzle = require("../sizzle/sizzle").sizzleInit(window, doc);
var $   = require("./pure").pureInit(window, doc);





$("div").autoRender({"who":"Hello Wrrrld"});
var sys = require("sys");
sys.puts(div.outerHTML);



