"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const { readTestFixture } = require("../util.js");

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
describe("jsdom/parsing", () => {
  specify("<template> content document fragment (GH-942)", () => {
    const { document } = (new JSDOM("<ul><template><div>Hello world!</div></template></ul>")).window;

    const tmpl = document.getElementsByTagName("template");

    assert.equal(tmpl[0].content.nodeType, 11);
    assert.equal(tmpl[0].innerHTML, "<div>Hello world!</div>");
  });

  specify("unclosed <td> (GH-605)", () => {
    const { document } = (new JSDOM("<table><tr><td>first td<td>second td</tr></table>")).window;

    const tds = document.getElementsByTagName("td");

    assert.equal(tds.length, 2);
    assert.equal(tds[0].innerHTML, "first td");
    assert.equal(tds[1].innerHTML, "second td");
  });

  specify("multiline attributes (GH-585)", () => {
    const html = "<a data-title='<strong>hello \nworld</strong>' href='example.org</strong>'>link</a>";
    const { document } = (new JSDOM(html)).window;

    const as = document.getElementsByTagName("a");

    assert.equal(as.length, 1);
    assert.equal(as[0].innerHTML, "link");
    assert.equal(as[0].getAttribute("data-title"), "<strong>hello \nworld</strong>");
    assert.equal(as[0].getAttribute("href"), "example.org</strong>");
  });

  specify("innerHTML of <script type='text/html'> (GH-575)", () => {
    const { document } = (new JSDOM("<script type='text/html'>script innerHTML</script>")).window;

    const scripts = document.getElementsByTagName("script");

    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].innerHTML, "script innerHTML");
  });

  specify("attributes containing '<' and '>' (GH-494)", () => {
    const { document } = (new JSDOM("<p title='<'>stuff</p><p title='>'>more</p><p>just testing</p>")).window;

    const ps = document.getElementsByTagName("p");

    assert.equal(ps.length, 3);
    assert.equal(ps[0].getAttribute("title"), "<");
    assert.equal(ps[1].getAttribute("title"), ">");
  });

  specify("empty attributes (GH-488)", () => {
    const { document } = (new JSDOM("<div ng-app></div>")).window;

    const divs = document.getElementsByTagName("div");

    assert.equal(divs.length, 1);
    assert.equal(divs[0].getAttribute("ng-app"), "");
  });

  specify("omitting optional closing tags (GH-482)", () => {
    const { document } = (new JSDOM("<p>First<p>Second<p>Third")).window;

    const ps = document.getElementsByTagName("p");

    assert.equal(ps.length, 3);
    assert.equal(ps[0].innerHTML, "First");
    assert.equal(ps[1].innerHTML, "Second");
    assert.equal(ps[2].innerHTML, "Third");
  });

  specify("crazy attribute names (GH-368)", () => {
    const { document } = (new JSDOM("<p <='' FAIL>stuff</p>")).window;

    const ps = document.getElementsByTagName("p");

    assert.equal(ps.length, 1);
    assert.equal(ps[0].innerHTML, "stuff");
    assert.equal(ps[0].getAttribute("<"), "");
    assert.equal(ps[0].getAttribute("fail"), "");
  });

  specify("attribute named 'constructor' (GH-625)", () => {
    const { document } = (new JSDOM("<element constructor='Hello'></element>")).window;

    const els = document.getElementsByTagName("element");

    assert.equal(els.length, 1);
    assert.equal(els[0].getAttribute("constructor"), "Hello");
    assert.equal(els[0].attributes.length, 1);
    assert.equal(els[0].outerHTML, "<element constructor=\"Hello\"></element>");
  });

  specify("attribute inherited from Object (GH-1442)", () => {
    // eslint-disable-next-line no-extend-native
    Object.prototype.attribute = "value";

    const { document } = (new JSDOM("<element></element>")).window;

    delete Object.prototype.attribute;
    const els = document.getElementsByTagName("element");

    assert.equal(els.length, 1);
    assert.equal(els[0].getAttribute("attribute"), undefined);
    assert.equal(els[0].attributes.length, 0);
    assert.equal(els[0].outerHTML, "<element></element>");
  });

  specify("prefix on attribute named 'hasOwnProperty' (GH-1444)", () => {
    const options = { contentType: "application/xml" };
    const { document } = (new JSDOM(`<element xmlns:prefix="https://example.com/" prefix:hasOwnProperty='value'></element>`, options)).window;

    const els = document.getElementsByTagName("element");

    assert.equal(els.length, 1);
    assert.equal(els[0].attributes.length, 2);
    assert.equal(els[0].attributes[1].prefix, "prefix");
    assert.equal(els[0].getAttribute("prefix:hasOwnProperty"), "value");
    assert.equal(
      els[0].outerHTML,
      `<element xmlns:prefix="https://example.com/" prefix:hasOwnProperty="value"/>`
    );
  });

  specify("CDATA should parse as bogus comments (GH-618)", () => {
    const { document } = (new JSDOM("<html><head></head><body><div><![CDATA[test]]></div></body></html>")).window;

    const div = document.getElementsByTagName("div")[0];

    assert.ok(div);
    assert.equal(div.childNodes.length, 1);

    const comment = div.childNodes[0];
    assert.equal(comment.nodeType, comment.COMMENT_NODE);
    assert.equal(comment.nodeValue, "[CDATA[test]]");

    assert.equal(
      document.documentElement.outerHTML,
      "<html><head></head><body><div><!--[CDATA[test]]--></div></body></html>"
    );
  });

  specify("innerHTML behavior in <script> vs. <p> (GH-652)", () => {
    const { document } = (new JSDOM()).window;

    const script = document.createElement("script");
    script.innerHTML = "3 < 5";
    assert.equal(script.innerHTML, "3 < 5");

    const p = document.createElement("p");
    p.innerHTML = "3 < 5";
    assert.equal(p.innerHTML, "3 &lt; 5");
  });

  specify("lower-cases tags in outerHTML and innerHTML", () => {
    const { document } = (new JSDOM("<HTML><HEAD></HEAD><BODY><P ALIGN='RIGHT'>test</P></BODY></HTML>")).window;

    assert.equal(
      document.documentElement.outerHTML,
      "<html><head></head><body><p align=\"RIGHT\">test</p></body></html>"
    );

    document.body.innerHTML = "<DIV>test</DIV>";

    assert.equal(document.body.innerHTML, "<div>test</div>");
  });

  specify("HTML entities without ; (GH-821)", () => {
    const { document } = (new JSDOM("<a>&#x61</a>")).window;

    assert.strictEqual(document.getElementsByTagName("a")[0].textContent, "a");
  });

  specify("Added < and > near <script> tags (GH-826)", () => {
    const { document } = (new JSDOM("<<script>alert(1);//<</script>")).window;

    assert.strictEqual(document.body.innerHTML, "&lt;<script>alert(1);//<</script>");
  });

  specify("Chinese characters as a 'tag name' (GH-719)", () => {
    const { window } = new JSDOM(`<div>chinese here:<中文></div>`);
    assert.strictEqual(window.document.body.innerHTML, "<div>chinese here:&lt;中文&gt;</div>");
  });

  specify("A single <html> tag (GH-827)", () => {
    const { document } = (new JSDOM("<html>")).window;

    assert.strictEqual(document.documentElement.innerHTML, "<head></head><body></body>");
  });

  specify("Missing <html> tags (GH-555)", () => {
    const doctype = "<!DOCTYPE html PUBLIC\"-//W3C//DTD HTML 4.0//EN\">";
    const docA = (new JSDOM(doctype + "<html><head><title></title></head><p>")).window.document;
    const docB = (new JSDOM(doctype + "<head><title></title></head><p>")).window.document;

    assert.strictEqual(docA.querySelectorAll("p").length, 1);
    assert.strictEqual(docB.querySelectorAll("p").length, 1);
  });

  specify("More missing <html> and <body> tag tests (GH-88)", () => {
    const doc1 = (new JSDOM("<html><body></body></html>")).window.document;
    assert.strictEqual(doc1.body.innerHTML, "");

    const doc2 = (new JSDOM("<body></body>")).window.document;
    assert.strictEqual(doc2.body.innerHTML, "");

    const doc3 = (new JSDOM("gavin!")).window.document;
    assert.strictEqual(doc3.body.innerHTML, "gavin!");
  });

  specify(".innerHTML with < character (GH-652)", () => {
    const { document } = (new JSDOM(`<html>`)).window;

    const script = document.createElement("script");
    script.innerHTML = "5 < 3";
    assert.strictEqual(script.innerHTML, "5 < 3");

    const p = document.createElement("p");
    p.innerHTML = "5 < 3";
    assert.strictEqual(p.innerHTML, "5 &lt; 3");
  });

  specify("whitespace after <!DOCTYPE> (GH-160)", () => {
    const { document } = (new JSDOM("<!DOCTYPE html>\n<html></html>")).window;

    assert.strictEqual(document.firstChild.nodeName, "html");
  });

  specify("pre tag with < and > characters (GH-755)", () => {
    const { document } = (new JSDOM("<pre>[task.h:277] - RunnableMethod<DOMStorageDispatcherHost,void " +
      "( DOMStorageDispatcherHost::*)(DOMStorageType,IPC::Message *),Tuple2<DOMStorageType,IPC::Message *>>" +
      "::Run()</pre>")).window;

    assert.strictEqual(document.body.innerHTML, "<pre>[task.h:277] - RunnableMethod<domstoragedispatcherhost,void " +
      "(=\"\" domstoragedispatcherhost::*)(domstoragetype,ipc::message=\"\" *),tuple2" +
      "<domstoragetype,ipc::message=\"\" *=\"\">&gt;::Run()</domstoragedispatcherhost,void></pre>");
  });

  specify("querySelector applied to document fragments (GH-523)", () => {
    const { document } = (new JSDOM("<a href='http://foo'></a>")).window;

    assert.strictEqual(document.querySelector("[href]").tagName, "A");
  });

  specify("real-world page with < inside a text node (GH-800)", () => {
    return readTestFixture("to-port-to-wpts/files/steam.html").then(content => {
      const doc = (new JSDOM(content)).window.document;
      assert.notEqual(doc.querySelector(".badge_card_set_text"), null);
    });
  });

  specify("void tags with innerHTML (GH-863)", () => {
    const { document } = (new JSDOM()).window;
    document.body.innerHTML = "<p>hello <img src=\"test\"> world</p>";

    assert.strictEqual(document.body.firstChild.childNodes.length, 3, "paragraph should contain 3 children");
  });

  specify("void tags set by innerHTML from createElement (GH-863/872)", () => {
    const { document } = (new JSDOM()).window;
    const div = document.createElement("div");
    div.innerHTML = "first <img src=\"test\"> third";

    assert.equal(div.childNodes.length, 3);
    assert.equal(div.childNodes[0].textContent, "first ");
    assert.equal(div.childNodes[1].nodeName, "IMG");
    assert.equal(div.childNodes[2].textContent, " third");
  });

  specify("<template> with whitespace inside (GH-1004)", () => {
    const { document } = (new JSDOM("<template>    <div></div>    </template>")).window;

    assert.equal(
      document.documentElement.innerHTML,
      "<head><template>    <div></div>    </template></head><body></body>"
    );
  });

  specify("doctype parsing should work for simple cases (GH-1066)", () => {
    const { document } = (new JSDOM("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">")).window;

    assert.strictEqual(document.doctype.name, "html");
    assert.strictEqual(document.doctype.systemId, "");
    assert.strictEqual(document.doctype.publicId, "-//W3C//DTD HTML 4.01 Transitional//EN");
  });

  specify("completely empty <!DOCTYPE> (GH-1204)", () => {
    const { document } = (new JSDOM("<!DOCTYPE>")).window;

    assert.strictEqual(document.doctype.name, "");
    assert.strictEqual(document.doctype.systemId, "");
    assert.strictEqual(document.doctype.publicId, "");
  });

  specify("incomplete SVG doctype (GH-259)", () => {
    const { document } = (new JSDOM(`<!DOCTYPE svg>\n<svg version="1.1"></svg>`)).window;

    assert.strictEqual(document.doctype.name, "svg");
    assert.strictEqual(document.doctype.systemId, "");
    assert.strictEqual(document.doctype.publicId, "");
  });

  specify("extra HTML after </html> (GH-319)", () => {
    const { document } = (new JSDOM("<!DOCTYPE html><html><head><title>Title</title></head>" +
                                    "<body>My body</body></html><div></div>")).window;

    assert.strictEqual(document.body.childNodes.length, 2);
    assert.strictEqual(document.querySelector("div").parentNode, document.body);
  });

  specify("<%= stuff %> inside <script> tags (GH-58)", () => {
    const content = "<%= cid %>";
    const script = `<script type="text/x-underscore-tmpl">${content}</script>`;
    const html = `<html><head>${script}</head><body><p>hello world!</p></body></html>`;
    const { document } = (new JSDOM(html)).window;

    document.write(html);
    document.close();

    assert.strictEqual(document.head.childNodes[0].innerHTML, content);
  });

  specify("xmlns doesn't cause empty prefix", () => {
    const html = "<!DOCTYPE html><math xmlns=\"http://www.w3.org/1998/Math/MathML\"></math>";
    const expected = "<!DOCTYPE html><html><head></head>" +
      "<body><math xmlns=\"http://www.w3.org/1998/Math/MathML\"></math></body></html>";
    const dom = new JSDOM(html);
    assert.strictEqual(dom.serialize(), expected);
  });
});
