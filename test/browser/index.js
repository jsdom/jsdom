var sys = require("sys");

var dom = require("../../lib/level1/core").dom.level1.core;
var browser = require("../../lib/browser").browserAugmentation(dom);


exports.tests = {

  basic_getelementbyclassname : function() {

      var doc = new browser.Document();
   
      var html = doc.createElement("html");
      doc.appendChild(html);
      
      var body = doc.createElement("body");
      html.appendChild(body);
      
      var p = doc.createElement("p");
      p.className = "first-p";
      body.appendChild(p);
      
      var elements = doc.getElementsByClassName("first-p");
      assertSame("p and first-p", p, elements.item(0));
  },

  testclassnameworksasexpected : function() {
      var doc = new browser.Document();
      var p = doc.createElement("p");
      p.setAttribute("class", "first-p");
      assertSame("class attribute is same as className", p.className,"first-p");
      
      p.className += " second";
      assertSame("className getter/setter", p.className,"first-p second");
  }

};
