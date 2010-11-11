var sys = require('sys'),
    dom = require("../../lib/jsdom/level1/core").dom.level1.core;

// git clone git://github.com/robrighter/node-xml.git into ~/.node_libraries
var xml = require("node-xml/lib/node-xml");

var doc = new dom.Document();
var currentElement = doc;
var totalElements = 0;
var parser = new xml.SaxParser(function(cb) {
  cb.onStartDocument(function() {
      
  });
  cb.onEndDocument(function() {
      sys.puts((doc.getElementsByTagName("*").length === totalElements) ? "success" : "fail");
  });
  cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
      totalElements++;
      var element = doc.createElement(elem);
      currentElement.appendChild(element);
      currentElement = element;
      sys.puts("=> Started: " + elem + " uri="+uri +" (Attributes: " + JSON.stringify(attrs) + " )");
  });
  cb.onEndElementNS(function(elem, prefix, uri) {
      currentElement = currentElement.parentNode;
      sys.puts("<= End: " + elem + " uri="+uri + "\n");
  });
  cb.onCharacters(function(chars) {
     
  });
  cb.onCdata(function(cdata) {
      sys.puts('<CDATA>'+cdata+"</CDATA>");
  });
  cb.onComment(function(msg) {
      sys.puts('<COMMENT>'+msg+"</COMMENT>");
  });
  cb.onWarning(function(msg) {
      sys.puts('<WARNING>'+msg+"</WARNING>");
  });
  cb.onError(function(msg) {
      sys.puts('<ERROR>'+JSON.stringify(msg)+"</ERROR>");
  });
});

//example read from file
parser.parseFile("example.xml");
