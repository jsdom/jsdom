"use strict";

var path = require("path");
var jsdom = require("../..").jsdom;

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
exports["<template> content document fragment (GH-942)"] = function (t) {
  var doc = jsdom("<ul><template><div>Hello world!</div></template></ul>");

  var tmpl = doc.getElementsByTagName("template");

  t.equal(tmpl[0].childNodes[0].nodeType, 11);
  t.equal(tmpl[0].innerHTML, "<div>Hello world!</div>");

  t.done();
};

exports["unclosed <td> (GH-605)"] = function (t) {
  var doc = jsdom("<table><tr><td>first td<td>second td</tr></table>");

  var tds = doc.getElementsByTagName("td");

  t.equal(tds.length, 2);
  t.equal(tds[0].innerHTML, "first td");
  t.equal(tds[1].innerHTML, "second td");

  t.done();
};

exports["multiline attributes (GH-585)"] = function (t) {
  var doc = jsdom("<a data-title='<strong>hello \nworld</strong>' href='example.org</strong>'>link</a>");

  var as = doc.getElementsByTagName("a");

  t.equal(as.length, 1);
  t.equal(as[0].innerHTML, "link");
  t.equal(as[0].getAttribute("data-title"), "<strong>hello \nworld</strong>");
  t.equal(as[0].getAttribute("href"), "example.org</strong>");

  t.done();
};

exports["innerHTML of <script type='text/html'> (GH-575)"] = function (t) {
  var doc = jsdom("<script type='text/html'>script innerHTML</script>");

  var scripts = doc.getElementsByTagName("script");

  t.equal(scripts.length, 1);
  t.equal(scripts[0].innerHTML, "script innerHTML");

  t.done();
};

exports["attributes containing '<' and '>' (GH-494)"] = function (t) {
  var doc = jsdom("<p title='<'>stuff</p><p title='>'>more</p><p>just testing</p>");

  var ps = doc.getElementsByTagName("p");

  t.equal(ps.length, 3);
  t.equal(ps[0].getAttribute("title"), "<");
  t.equal(ps[1].getAttribute("title"), ">");

  t.done();
};

exports["empty attributes (GH-488)"] = function (t) {
  var doc = jsdom("<div ng-app></div>");

  var divs = doc.getElementsByTagName("div");

  t.equal(divs.length, 1);
  t.equal(divs[0].getAttribute("ng-app"), "");

  t.done();
};

exports["omitting optional closing tags (GH-482)"] = function (t) {
  var doc = jsdom("<p>First<p>Second<p>Third");

  var ps = doc.getElementsByTagName("p");

  t.equal(ps.length, 3);
  t.equal(ps[0].innerHTML, "First");
  t.equal(ps[1].innerHTML, "Second");
  t.equal(ps[2].innerHTML, "Third");

  t.done();
};

exports["crazy attribute names (GH-368)"] = function (t) {
  var doc = jsdom("<p <='' FAIL>stuff</p>");

  var ps = doc.getElementsByTagName("p");

  t.equal(ps.length, 1);
  t.equal(ps[0].innerHTML, "stuff");
  t.equal(ps[0].getAttribute("<"), "");
  t.equal(ps[0].getAttribute("fail"), "");

  t.done();
};

exports["attribute named 'constructor' (GH-625)"] = function (t) {
  var doc = jsdom("<element constructor='Hello'></element>");

  var els = doc.getElementsByTagName("element");

  t.equal(els.length, 1);
  t.equal(els[0].getAttribute("constructor"), "Hello");
  t.equal(els[0].attributes.length, 1);
  t.equal(els[0].outerHTML, "<element constructor=\"Hello\"></element>");

  t.done();
};

exports["CDATA should parse as bogus comments (GH-618)"] = function (t) {
  var doc = jsdom("<html><head></head><body><div><![CDATA[test]]></div></body></html>");

  var div = doc.getElementsByTagName("div")[0];

  t.ok(div);
  t.equal(div.childNodes.length, 1);

  var comment = div.childNodes[0];
  t.equal(comment.nodeType, comment.COMMENT_NODE);
  t.equal(comment.nodeValue, "[CDATA[test]]");

  t.equal(doc.documentElement.outerHTML, "<html><head></head><body><div><!--[CDATA[test]]--></div></body></html>");

  t.done();
};

exports["innerHTML behavior in <script> vs. <p> (GH-652)"] = function (t) {
  var doc = jsdom();

  var script = doc.createElement("script");
  script.innerHTML = "3 < 5";
  t.equal(script.innerHTML, "3 < 5");

  var p = doc.createElement("p");
  p.innerHTML = "3 < 5";
  t.equal(p.innerHTML, "3 &lt; 5");

  t.done();
};

exports["lower-cases tags in outerHTML and innerHTML"] = function (t) {
  var doc = jsdom("<HTML><HEAD></HEAD><BODY><P ALIGN='RIGHT'>test</P></BODY></HTML>");

  t.equal(doc.documentElement.outerHTML, "<html><head></head><body><p align=\"RIGHT\">test</p></body></html>");

  doc.body.innerHTML = "<DIV>test</DIV>";

  t.equal(doc.body.innerHTML, "<div>test</div>");

  t.done();
};

exports["HTML entities without ; (GH-821)"] = function (t) {
  var doc = jsdom("<a>&#x61</a>");

  t.strictEqual(doc.getElementsByTagName("a")[0].textContent, "a");

  t.done();
};

exports["Added < and > near <script> tags (GH-826)"] = function (t) {
  var doc = jsdom("<<script>alert(1);//<</script>");

  t.strictEqual(doc.body.innerHTML, "&lt;<script>alert(1);//<</script>");

  t.done();
};

exports["Chinese characters as a 'tag name' (GH-719)"] = function (t) {
  jsdom.env({
    html: "<div>chinese here:<中文></div>",
    done: function (errs, window) {
      t.ifError(errs);

      t.strictEqual(window.document.body.innerHTML, "<div>chinese here:&lt;中文&gt;</div>");

      t.done();
    }
  });
};

exports["A single <html> tag (GH-827)"] = function (t) {
  var doc = jsdom("<html>");

  t.strictEqual(doc.documentElement.innerHTML, "<head></head><body></body>");

  t.done();
};

exports["Missing <html> tags (GH-555)"] = function (t) {
  var doctype = "<!DOCTYPE html PUBLIC\"-//W3C//DTD HTML 4.0//EN\">";
  var docA = jsdom(doctype + "<html><head><title></title></head><p>");
  var docB = jsdom(doctype + "<head><title></title></head><p>");

  t.strictEqual(docA.querySelectorAll("p").length, 1);
  t.strictEqual(docB.querySelectorAll("p").length, 1);

  t.done();
};

exports["Missing <body> tag with script src (GH-389)"] = function (t) {
  t.expect(1);

  jsdom.env({
    html: "<html></html>",
    src: "''",
    done: function (errs) {
      t.ifError(errs);

      t.done();
    }
  });
};

exports["More missing <html> and <body> tag tests (GH-88)"] = function (t) {
  var doc;

  doc = jsdom("<html><body></body></html>");
  t.strictEqual(doc.body.innerHTML, "");

  doc = jsdom("<body></body>");
  t.strictEqual(doc.body.innerHTML, "");

  doc = jsdom("gavin!");
  t.strictEqual(doc.body.innerHTML, "gavin!");

  t.done();
};

exports[".innerHTML with < character (GH-652)"] = function (t) {
  jsdom.env({
    html: "<html>",
    done: function (errs, window) {
      t.ifError(errs);

      var doc = window.document;

      var script = doc.createElement("script");
      script.innerHTML = "5 < 3";
      t.strictEqual(script.innerHTML, "5 < 3");

      var p = doc.createElement("p");
      p.innerHTML = "5 < 3";
      t.strictEqual(p.innerHTML, "5 &lt; 3");

      t.done();
    }
  });
};

exports["whitespace after <!DOCTYPE> (GH-160)"] = function (t) {
  var doc = jsdom("<!DOCTYPE html>\n<html></html>");

  var firstChild = doc.firstChild;
  t.strictEqual(firstChild.nodeName, "html");

  t.done();
};

exports["pre tag with < and > characters (GH-755)"] = function (t) {
  var doc = jsdom("<pre>[task.h:277] - RunnableMethod<DOMStorageDispatcherHost,void " +
    "( DOMStorageDispatcherHost::*)(DOMStorageType,IPC::Message *),Tuple2<DOMStorageType,IPC::Message *>>" +
    "::Run()</pre>");

  t.strictEqual(doc.body.innerHTML, "<pre>[task.h:277] - RunnableMethod<domstoragedispatcherhost,void " +
    "(=\"\" domstoragedispatcherhost::*)(domstoragetype,ipc::message=\"\" *),tuple2" +
    "<domstoragetype,ipc::message=\"\" *=\"\">&gt;::Run()</domstoragedispatcherhost,void></pre>");

  t.done();
};

exports["querySelector applied to document fragments (GH-523)"] = function (t) {
  var doc = jsdom("<a href='http://foo'></a>");

  t.strictEqual(doc.querySelector("[href]").tagName, "A");

  t.done();
};

exports["real-world page with < inside a text node (GH-800)"] = function (t) {
  t.expect(2);

  jsdom.env(
    path.resolve(__dirname, "files", "steam.html"),
    function (errors, window) {
      t.ifError(errors);
      t.notEqual(window.document.querySelector(".badge_card_set_text"), null);

      t.done();
    });
};

exports["void tags with innerHTML (GH-863)"] = function (t) {
  var doc = jsdom();
  doc.body.innerHTML = "<p>hello <img src=\"test\"> world</p>";

  t.strictEqual(doc.body.firstChild.childNodes.length, 3, "paragraph should contain 3 children");

  t.done();
};

exports["void tags set by innerHTML from createElement (GH-863/872)"] = function (t) {
  var doc = jsdom();
  var div = doc.createElement("div");
  div.innerHTML = "first <img src=\"test\"> third";

  t.equal(div.childNodes.length, 3);
  t.equal(div.childNodes[0].textContent, "first ");
  t.equal(div.childNodes[1].nodeName, "IMG");
  t.equal(div.childNodes[2].textContent, " third");

  t.done();
};

exports["<template> with whitespace inside (GH-1004)"] = function (t) {
  var doc = jsdom("<template>    <div></div>    </template>");

  t.equal(doc.documentElement.innerHTML, "<head><template>    <div></div>    </template></head><body></body>");
  t.done();
};
