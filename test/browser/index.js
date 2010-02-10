var sys = require("sys");

var dom = require("../../lib/level1/core").dom.level1.core;
var browser = require("../../lib/browser").browserAugmentation(dom);


exports.tests = {

  notfound_getelementsbyclassname : function() {

      var doc = new browser.Document();
   
      var html = doc.createElement("html");
      doc.appendChild(html);
      
      var body = doc.createElement("body");
      html.appendChild(body);
      
      var p = doc.createElement("p");
      p.className = "unknown";
      body.appendChild(p);
      
      var elements = doc.getElementsByClassName("first-p");
      assertEquals("no results", 0, elements.length);
  },


  basic_getelementsbyclassname : function() {

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

  multiple_getelementsbyclassname : function() {

      var doc = new browser.Document();
   
      var html = doc.createElement("html");
      doc.appendChild(html);
      
      var body = doc.createElement("body");
      html.appendChild(body);
      
      var p = doc.createElement("p");
      p.className = "first-p second third";
      body.appendChild(p);

      var first = doc.getElementsByClassName("first-p");
      assertSame("p and first-p", p, first.item(0));
      
      var second = doc.getElementsByClassName("second");
      assertSame("p and second", p, second.item(0));

      var third = doc.getElementsByClassName("third");
      assertSame("p and third", p, third.item(0));
  },

  testclassnameworksasexpected : function() {
      var doc = new browser.Document();
      var p = doc.createElement("p");
      p.setAttribute("class", "first-p");
      assertSame("class attribute is same as className", p.className,"first-p");
      
      p.className += " second";
      assertSame("className getter/setter", p.className,"first-p second");
  },
  
  basic_getelementbyid : function() {

      var doc = new browser.Document();
   
      var html = doc.createElement("html");
      doc.appendChild(html);
      
      var body = doc.createElement("body");
      html.appendChild(body);
      
      var p = doc.createElement("p");
      p.id = "theid";
      body.appendChild(p);
      
      var element = doc.getElementById("theid");
      assertSame("p and #theid", p, element);
  },  
  

};
