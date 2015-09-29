"use strict";
const path = require("path");
const jsdom = require("../..");

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
exports["<template> content document fragment (GH-942)"] = t => {
  const document = jsdom.jsdom("<ul><template><div>Hello world!</div></template></ul>");

  const tmpl = document.getElementsByTagName("template");

  t.equal(tmpl[0].childNodes[0].nodeType, 11);
  t.equal(tmpl[0].innerHTML, "<div>Hello world!</div>");

  t.done();
};

exports["unclosed <td> (GH-605)"] = t => {
  const document = jsdom.jsdom("<table><tr><td>first td<td>second td</tr></table>");

  const tds = document.getElementsByTagName("td");

  t.equal(tds.length, 2);
  t.equal(tds[0].innerHTML, "first td");
  t.equal(tds[1].innerHTML, "second td");

  t.done();
};

exports["multiline attributes (GH-585)"] = t => {
  const document = jsdom.jsdom("<a data-title='<strong>hello \nworld</strong>' href='example.org</strong>'>link</a>");

  const as = document.getElementsByTagName("a");

  t.equal(as.length, 1);
  t.equal(as[0].innerHTML, "link");
  t.equal(as[0].getAttribute("data-title"), "<strong>hello \nworld</strong>");
  t.equal(as[0].getAttribute("href"), "example.org</strong>");

  t.done();
};

exports["innerHTML of <script type='text/html'> (GH-575)"] = t => {
  const document = jsdom.jsdom("<script type='text/html'>script innerHTML</script>");

  const scripts = document.getElementsByTagName("script");

  t.equal(scripts.length, 1);
  t.equal(scripts[0].innerHTML, "script innerHTML");

  t.done();
};

exports["attributes containing '<' and '>' (GH-494)"] = t => {
  const document = jsdom.jsdom("<p title='<'>stuff</p><p title='>'>more</p><p>just testing</p>");

  const ps = document.getElementsByTagName("p");

  t.equal(ps.length, 3);
  t.equal(ps[0].getAttribute("title"), "<");
  t.equal(ps[1].getAttribute("title"), ">");

  t.done();
};

exports["empty attributes (GH-488)"] = t => {
  const document = jsdom.jsdom("<div ng-app></div>");

  const divs = document.getElementsByTagName("div");

  t.equal(divs.length, 1);
  t.equal(divs[0].getAttribute("ng-app"), "");

  t.done();
};

exports["omitting optional closing tags (GH-482)"] = t => {
  const document = jsdom.jsdom("<p>First<p>Second<p>Third");

  const ps = document.getElementsByTagName("p");

  t.equal(ps.length, 3);
  t.equal(ps[0].innerHTML, "First");
  t.equal(ps[1].innerHTML, "Second");
  t.equal(ps[2].innerHTML, "Third");

  t.done();
};

exports["crazy attribute names (GH-368)"] = t => {
  const document = jsdom.jsdom("<p <='' FAIL>stuff</p>");

  const ps = document.getElementsByTagName("p");

  t.equal(ps.length, 1);
  t.equal(ps[0].innerHTML, "stuff");
  t.equal(ps[0].getAttribute("<"), "");
  t.equal(ps[0].getAttribute("fail"), "");

  t.done();
};

exports["attribute named 'constructor' (GH-625)"] = t => {
  const document = jsdom.jsdom("<element constructor='Hello'></element>");

  const els = document.getElementsByTagName("element");

  t.equal(els.length, 1);
  t.equal(els[0].getAttribute("constructor"), "Hello");
  t.equal(els[0].attributes.length, 1);
  t.equal(els[0].outerHTML, "<element constructor=\"Hello\"></element>");

  t.done();
};

exports["CDATA should parse as bogus comments (GH-618)"] = t => {
  const document = jsdom.jsdom("<html><head></head><body><div><![CDATA[test]]></div></body></html>");

  const div = document.getElementsByTagName("div")[0];

  t.ok(div);
  t.equal(div.childNodes.length, 1);

  const comment = div.childNodes[0];
  t.equal(comment.nodeType, comment.COMMENT_NODE);
  t.equal(comment.nodeValue, "[CDATA[test]]");

  t.equal(document.documentElement.outerHTML, "<html><head></head><body><div><!--[CDATA[test]]--></div></body></html>");

  t.done();
};

exports["innerHTML behavior in <script> vs. <p> (GH-652)"] = t => {
  const document = jsdom.jsdom();

  const script = document.createElement("script");
  script.innerHTML = "3 < 5";
  t.equal(script.innerHTML, "3 < 5");

  const p = document.createElement("p");
  p.innerHTML = "3 < 5";
  t.equal(p.innerHTML, "3 &lt; 5");

  t.done();
};

exports["lower-cases tags in outerHTML and innerHTML"] = t => {
  const document = jsdom.jsdom("<HTML><HEAD></HEAD><BODY><P ALIGN='RIGHT'>test</P></BODY></HTML>");

  t.equal(document.documentElement.outerHTML, "<html><head></head><body><p align=\"RIGHT\">test</p></body></html>");

  document.body.innerHTML = "<DIV>test</DIV>";

  t.equal(document.body.innerHTML, "<div>test</div>");

  t.done();
};

exports["HTML entities without ; (GH-821)"] = t => {
  const document = jsdom.jsdom("<a>&#x61</a>");

  t.strictEqual(document.getElementsByTagName("a")[0].textContent, "a");

  t.done();
};

exports["Added < and > near <script> tags (GH-826)"] = t => {
  const document = jsdom.jsdom("<<script>alert(1);//<</script>");

  t.strictEqual(document.body.innerHTML, "&lt;<script>alert(1);//<</script>");

  t.done();
};

exports["Chinese characters as a 'tag name' (GH-719)"] = t => {
  jsdom.env({
    html: "<div>chinese here:<中文></div>",
    done(err, window) {
      t.ifError(err);

      t.strictEqual(window.document.body.innerHTML, "<div>chinese here:&lt;中文&gt;</div>");

      t.done();
    }
  });
};

exports["A single <html> tag (GH-827)"] = t => {
  const document = jsdom.jsdom("<html>");

  t.strictEqual(document.documentElement.innerHTML, "<head></head><body></body>");

  t.done();
};

exports["Missing <html> tags (GH-555)"] = t => {
  const doctype = "<!DOCTYPE html PUBLIC\"-//W3C//DTD HTML 4.0//EN\">";
  const docA = jsdom.jsdom(doctype + "<html><head><title></title></head><p>");
  const docB = jsdom.jsdom(doctype + "<head><title></title></head><p>");

  t.strictEqual(docA.querySelectorAll("p").length, 1);
  t.strictEqual(docB.querySelectorAll("p").length, 1);

  t.done();
};

exports["Missing <body> tag with script src (GH-389)"] = t => {
  t.expect(1);

  jsdom.env({
    html: "<html></html>",
    src: "''",
    done(err) {
      t.ifError(err);
      t.done();
    }
  });
};

exports["More missing <html> and <body> tag tests (GH-88)"] = t => {
  const doc1 = jsdom.jsdom("<html><body></body></html>");
  t.strictEqual(doc1.body.innerHTML, "");

  const doc2 = jsdom.jsdom("<body></body>");
  t.strictEqual(doc2.body.innerHTML, "");

  const doc3 = jsdom.jsdom("gavin!");
  t.strictEqual(doc3.body.innerHTML, "gavin!");

  t.done();
};

exports[".innerHTML with < character (GH-652)"] = t => {
  jsdom.env({
    html: "<html>",
    done(err, window) {
      t.ifError(err);

      const document = window.document;

      const script = document.createElement("script");
      script.innerHTML = "5 < 3";
      t.strictEqual(script.innerHTML, "5 < 3");

      const p = document.createElement("p");
      p.innerHTML = "5 < 3";
      t.strictEqual(p.innerHTML, "5 &lt; 3");

      t.done();
    }
  });
};

exports["whitespace after <!DOCTYPE> (GH-160)"] = t => {
  const document = jsdom.jsdom("<!DOCTYPE html>\n<html></html>");

  const firstChild = document.firstChild;
  t.strictEqual(firstChild.nodeName, "html");

  t.done();
};

exports["pre tag with < and > characters (GH-755)"] = t => {
  const document = jsdom.jsdom("<pre>[task.h:277] - RunnableMethod<DOMStorageDispatcherHost,void " +
    "( DOMStorageDispatcherHost::*)(DOMStorageType,IPC::Message *),Tuple2<DOMStorageType,IPC::Message *>>" +
    "::Run()</pre>");

  t.strictEqual(document.body.innerHTML, "<pre>[task.h:277] - RunnableMethod<domstoragedispatcherhost,void " +
    "(=\"\" domstoragedispatcherhost::*)(domstoragetype,ipc::message=\"\" *),tuple2" +
    "<domstoragetype,ipc::message=\"\" *=\"\">&gt;::Run()</domstoragedispatcherhost,void></pre>");

  t.done();
};

exports["querySelector applied to document fragments (GH-523)"] = t => {
  const document = jsdom.jsdom("<a href='http://foo'></a>");

  t.strictEqual(document.querySelector("[href]").tagName, "A");

  t.done();
};

exports["real-world page with < inside a text node (GH-800)"] = t => {
  t.expect(2);

  jsdom.env(
    path.resolve(__dirname, "files", "steam.html"),
    (err, window) => {
      t.ifError(err);
      t.notEqual(window.document.querySelector(".badge_card_set_text"), null);

      t.done();
    });
};

exports["void tags with innerHTML (GH-863)"] = t => {
  const document = jsdom.jsdom();
  document.body.innerHTML = "<p>hello <img src=\"test\"> world</p>";

  t.strictEqual(document.body.firstChild.childNodes.length, 3, "paragraph should contain 3 children");

  t.done();
};

exports["void tags set by innerHTML from createElement (GH-863/872)"] = t => {
  const document = jsdom.jsdom();
  const div = document.createElement("div");
  div.innerHTML = "first <img src=\"test\"> third";

  t.equal(div.childNodes.length, 3);
  t.equal(div.childNodes[0].textContent, "first ");
  t.equal(div.childNodes[1].nodeName, "IMG");
  t.equal(div.childNodes[2].textContent, " third");

  t.done();
};

exports["<template> with whitespace inside (GH-1004)"] = t => {
  const document = jsdom.jsdom("<template>    <div></div>    </template>");

  t.equal(document.documentElement.innerHTML, "<head><template>    <div></div>    </template></head><body></body>");
  t.done();
};

exports["doctype parsing should work for simple cases (GH-1066)"] = t => {
  const document = jsdom.jsdom("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");

  t.strictEqual(document.doctype.name, "html");
  t.strictEqual(document.doctype.systemId, "");
  t.strictEqual(document.doctype.publicId, "-//W3C//DTD HTML 4.01 Transitional//EN");
  t.done();
};

exports["completely empty <!DOCTYPE> (GH-1204)"] = t => {
  const document = jsdom.jsdom("<!DOCTYPE>");

  t.strictEqual(document.doctype.name, "");
  t.strictEqual(document.doctype.systemId, "");
  t.strictEqual(document.doctype.publicId, "");
  t.done();
};

exports["incomplete SVG doctype (GH-259)"] = t => {
  const document = jsdom.jsdom(`<!DOCTYPE svg>\n<svg version="1.1"></svg>`);

  t.strictEqual(document.doctype.name, "svg");
  t.strictEqual(document.doctype.systemId, "");
  t.strictEqual(document.doctype.publicId, "");
  t.done();
};

exports["extra HTML after </html> (GH-319)"] = t => {
  const document = jsdom.jsdom("<!DOCTYPE html><html><head><title>Title</title></head>" +
                               "<body>My body</body></html><div></div>");

  t.strictEqual(document.body.childNodes.length, 2);
  t.strictEqual(document.querySelector("div").parentNode, document.body);
  t.done();
};

exports["<%= stuff %> inside <script> tags (GH-58)"] = t => {
  const content = "<%= cid %>";
  const script = `<script type="text/x-underscore-tmpl">${content}</script>`;
  const html = `<html><head>${script}</head><body><p>hello world!</p></body></html>`;
  const document = jsdom.jsdom(html);

  document.write(html);
  document.close();

  t.strictEqual(document.head.childNodes[0].innerHTML, content);
  t.done();
};
