"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../lib/old-api.js");
const { readTestFixture } = require("../util.js");

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
describe("jsdom/parsing", () => {
  specify("<template> content document fragment (GH-942)", () => {
    const document = jsdom.jsdom("<ul><template><div>Hello world!</div></template></ul>");

    const tmpl = document.getElementsByTagName("template");

    assert.equal(tmpl[0].content.nodeType, 11);
    assert.equal(tmpl[0].innerHTML, "<div>Hello world!</div>");
  });

  specify("unclosed <td> (GH-605)", () => {
    const document = jsdom.jsdom("<table><tr><td>first td<td>second td</tr></table>");

    const tds = document.getElementsByTagName("td");

    assert.equal(tds.length, 2);
    assert.equal(tds[0].innerHTML, "first td");
    assert.equal(tds[1].innerHTML, "second td");
  });

  specify("multiline attributes (GH-585)", () => {
    const document = jsdom.jsdom("<a data-title='<strong>hello \nworld</strong>' href='example.org</strong>'>link</a>");

    const as = document.getElementsByTagName("a");

    assert.equal(as.length, 1);
    assert.equal(as[0].innerHTML, "link");
    assert.equal(as[0].getAttribute("data-title"), "<strong>hello \nworld</strong>");
    assert.equal(as[0].getAttribute("href"), "example.org</strong>");
  });

  specify("innerHTML of <script type='text/html'> (GH-575)", () => {
    const document = jsdom.jsdom("<script type='text/html'>script innerHTML</script>");

    const scripts = document.getElementsByTagName("script");

    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].innerHTML, "script innerHTML");
  });

  specify("attributes containing '<' and '>' (GH-494)", () => {
    const document = jsdom.jsdom("<p title='<'>stuff</p><p title='>'>more</p><p>just testing</p>");

    const ps = document.getElementsByTagName("p");

    assert.equal(ps.length, 3);
    assert.equal(ps[0].getAttribute("title"), "<");
    assert.equal(ps[1].getAttribute("title"), ">");
  });

  specify("empty attributes (GH-488)", () => {
    const document = jsdom.jsdom("<div ng-app></div>");

    const divs = document.getElementsByTagName("div");

    assert.equal(divs.length, 1);
    assert.equal(divs[0].getAttribute("ng-app"), "");
  });

  specify("omitting optional closing tags (GH-482)", () => {
    const document = jsdom.jsdom("<p>First<p>Second<p>Third");

    const ps = document.getElementsByTagName("p");

    assert.equal(ps.length, 3);
    assert.equal(ps[0].innerHTML, "First");
    assert.equal(ps[1].innerHTML, "Second");
    assert.equal(ps[2].innerHTML, "Third");
  });

  specify("crazy attribute names (GH-368)", () => {
    const document = jsdom.jsdom("<p <='' FAIL>stuff</p>");

    const ps = document.getElementsByTagName("p");

    assert.equal(ps.length, 1);
    assert.equal(ps[0].innerHTML, "stuff");
    assert.equal(ps[0].getAttribute("<"), "");
    assert.equal(ps[0].getAttribute("fail"), "");
  });

  specify("attribute named 'constructor' (GH-625)", () => {
    const document = jsdom.jsdom("<element constructor='Hello'></element>");

    const els = document.getElementsByTagName("element");

    assert.equal(els.length, 1);
    assert.equal(els[0].getAttribute("constructor"), "Hello");
    assert.equal(els[0].attributes.length, 1);
    assert.equal(els[0].outerHTML, "<element constructor=\"Hello\"></element>");
  });

  specify("attribute inherited from Object (GH-1442)", () => {
    // eslint-disable-next-line no-extend-native
    Object.prototype.attribute = "value";

    const document = jsdom.jsdom("<element></element>");

    delete Object.prototype.attribute;
    const els = document.getElementsByTagName("element");

    assert.equal(els.length, 1);
    assert.equal(els[0].getAttribute("attribute"), undefined);
    assert.equal(els[0].attributes.length, 0);
    assert.equal(els[0].outerHTML, "<element></element>");
  });

  specify("prefix on attribute named 'hasOwnProperty' (GH-1444)", () => {
    const options = { parsingMode: "xml" };
    const document = jsdom.jsdom(
      `<element xmlns:prefix="https://example.com/" prefix:hasOwnProperty='value'></element>`, options);

    const els = document.getElementsByTagName("element");

    assert.equal(els.length, 1);
    assert.equal(els[0].attributes.length, 2);
    assert.equal(els[0].attributes[1].prefix, "prefix");
    assert.equal(els[0].getAttribute("prefix:hasOwnProperty"), "value");
    assert.equal(els[0].outerHTML,
                 `<element xmlns:prefix="https://example.com/" prefix:hasOwnProperty="value"></element>`);
  });

  specify("CDATA should parse as bogus comments (GH-618)", () => {
    const document = jsdom.jsdom("<html><head></head><body><div><![CDATA[test]]></div></body></html>");

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
    const document = jsdom.jsdom();

    const script = document.createElement("script");
    script.innerHTML = "3 < 5";
    assert.equal(script.innerHTML, "3 < 5");

    const p = document.createElement("p");
    p.innerHTML = "3 < 5";
    assert.equal(p.innerHTML, "3 &lt; 5");
  });

  specify("lower-cases tags in outerHTML and innerHTML", () => {
    const document = jsdom.jsdom("<HTML><HEAD></HEAD><BODY><P ALIGN='RIGHT'>test</P></BODY></HTML>");

    assert.equal(
      document.documentElement.outerHTML,
      "<html><head></head><body><p align=\"RIGHT\">test</p></body></html>"
    );

    document.body.innerHTML = "<DIV>test</DIV>";

    assert.equal(document.body.innerHTML, "<div>test</div>");
  });

  specify("HTML entities without ; (GH-821)", () => {
    const document = jsdom.jsdom("<a>&#x61</a>");

    assert.strictEqual(document.getElementsByTagName("a")[0].textContent, "a");
  });

  specify("Added < and > near <script> tags (GH-826)", () => {
    const document = jsdom.jsdom("<<script>alert(1);//<</script>");

    assert.strictEqual(document.body.innerHTML, "&lt;<script>alert(1);//<</script>");
  });

  specify("Chinese characters as a 'tag name' (GH-719)", { async: true }, t => {
    jsdom.env({
      html: "<div>chinese here:<中文></div>",
      done(err, window) {
        assert.ifError(err);

        assert.strictEqual(window.document.body.innerHTML, "<div>chinese here:&lt;中文&gt;</div>");

        t.done();
      }
    });
  });

  specify("A single <html> tag (GH-827)", () => {
    const document = jsdom.jsdom("<html>");

    assert.strictEqual(document.documentElement.innerHTML, "<head></head><body></body>");
  });

  specify("Missing <html> tags (GH-555)", () => {
    const doctype = "<!DOCTYPE html PUBLIC\"-//W3C//DTD HTML 4.0//EN\">";
    const docA = jsdom.jsdom(doctype + "<html><head><title></title></head><p>");
    const docB = jsdom.jsdom(doctype + "<head><title></title></head><p>");

    assert.strictEqual(docA.querySelectorAll("p").length, 1);
    assert.strictEqual(docB.querySelectorAll("p").length, 1);
  });

  specify("Missing <body> tag with script src (GH-389)", { async: true }, t => {
    jsdom.env({
      html: "<html></html>",
      src: "''",
      done(err) {
        assert.ifError(err);
        t.done();
      }
    });
  });

  specify("More missing <html> and <body> tag tests (GH-88)", () => {
    const doc1 = jsdom.jsdom("<html><body></body></html>");
    assert.strictEqual(doc1.body.innerHTML, "");

    const doc2 = jsdom.jsdom("<body></body>");
    assert.strictEqual(doc2.body.innerHTML, "");

    const doc3 = jsdom.jsdom("gavin!");
    assert.strictEqual(doc3.body.innerHTML, "gavin!");
  });

  specify(".innerHTML with < character (GH-652)", { async: true }, t => {
    jsdom.env({
      html: "<html>",
      done(err, window) {
        assert.ifError(err);

        const document = window.document;

        const script = document.createElement("script");
        script.innerHTML = "5 < 3";
        assert.strictEqual(script.innerHTML, "5 < 3");

        const p = document.createElement("p");
        p.innerHTML = "5 < 3";
        assert.strictEqual(p.innerHTML, "5 &lt; 3");

        t.done();
      }
    });
  });

  specify("whitespace after <!DOCTYPE> (GH-160)", () => {
    const document = jsdom.jsdom("<!DOCTYPE html>\n<html></html>");

    const firstChild = document.firstChild;
    assert.strictEqual(firstChild.nodeName, "html");
  });

  specify("pre tag with < and > characters (GH-755)", () => {
    const document = jsdom.jsdom("<pre>[task.h:277] - RunnableMethod<DOMStorageDispatcherHost,void " +
      "( DOMStorageDispatcherHost::*)(DOMStorageType,IPC::Message *),Tuple2<DOMStorageType,IPC::Message *>>" +
      "::Run()</pre>");

    assert.strictEqual(document.body.innerHTML, "<pre>[task.h:277] - RunnableMethod<domstoragedispatcherhost,void " +
      "(=\"\" domstoragedispatcherhost::*)(domstoragetype,ipc::message=\"\" *),tuple2" +
      "<domstoragetype,ipc::message=\"\" *=\"\">&gt;::Run()</domstoragedispatcherhost,void></pre>");
  });

  specify("querySelector applied to document fragments (GH-523)", () => {
    const document = jsdom.jsdom("<a href='http://foo'></a>");

    assert.strictEqual(document.querySelector("[href]").tagName, "A");
  });

  specify("real-world page with < inside a text node (GH-800)", () => {
    return readTestFixture("to-port-to-wpts/files/steam.html").then(content => {
      const doc = jsdom.jsdom(content);
      assert.notEqual(doc.querySelector(".badge_card_set_text"), null);
    });
  });

  specify("void tags with innerHTML (GH-863)", () => {
    const document = jsdom.jsdom();
    document.body.innerHTML = "<p>hello <img src=\"test\"> world</p>";

    assert.strictEqual(document.body.firstChild.childNodes.length, 3, "paragraph should contain 3 children");
  });

  specify("void tags set by innerHTML from createElement (GH-863/872)", () => {
    const document = jsdom.jsdom();
    const div = document.createElement("div");
    div.innerHTML = "first <img src=\"test\"> third";

    assert.equal(div.childNodes.length, 3);
    assert.equal(div.childNodes[0].textContent, "first ");
    assert.equal(div.childNodes[1].nodeName, "IMG");
    assert.equal(div.childNodes[2].textContent, " third");
  });

  specify("<template> with whitespace inside (GH-1004)", () => {
    const document = jsdom.jsdom("<template>    <div></div>    </template>");

    assert.equal(
      document.documentElement.innerHTML,
      "<head><template>    <div></div>    </template></head><body></body>"
    );
  });

  specify("doctype parsing should work for simple cases (GH-1066)", () => {
    const document = jsdom.jsdom("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");

    assert.strictEqual(document.doctype.name, "html");
    assert.strictEqual(document.doctype.systemId, "");
    assert.strictEqual(document.doctype.publicId, "-//W3C//DTD HTML 4.01 Transitional//EN");
  });

  specify("completely empty <!DOCTYPE> (GH-1204)", () => {
    const document = jsdom.jsdom("<!DOCTYPE>");

    assert.strictEqual(document.doctype.name, "");
    assert.strictEqual(document.doctype.systemId, "");
    assert.strictEqual(document.doctype.publicId, "");
  });

  specify("incomplete SVG doctype (GH-259)", () => {
    const document = jsdom.jsdom(`<!DOCTYPE svg>\n<svg version="1.1"></svg>`);

    assert.strictEqual(document.doctype.name, "svg");
    assert.strictEqual(document.doctype.systemId, "");
    assert.strictEqual(document.doctype.publicId, "");
  });

  specify("extra HTML after </html> (GH-319)", () => {
    const document = jsdom.jsdom("<!DOCTYPE html><html><head><title>Title</title></head>" +
                                 "<body>My body</body></html><div></div>");

    assert.strictEqual(document.body.childNodes.length, 2);
    assert.strictEqual(document.querySelector("div").parentNode, document.body);
  });

  specify("<%= stuff %> inside <script> tags (GH-58)", () => {
    const content = "<%= cid %>";
    const script = `<script type="text/x-underscore-tmpl">${content}</script>`;
    const html = `<html><head>${script}</head><body><p>hello world!</p></body></html>`;
    const document = jsdom.jsdom(html);

    document.write(html);
    document.close();

    assert.strictEqual(document.head.childNodes[0].innerHTML, content);
  });

  specify("xmlns doesn't cause empty prefix", { async: true }, t => {
    const html = "<!DOCTYPE html><math xmlns=\"http://www.w3.org/1998/Math/MathML\"></math>";
    const expected = "<!DOCTYPE html><html><head></head>" +
      "<body><math xmlns=\"http://www.w3.org/1998/Math/MathML\"></math></body></html>";
    jsdom.env(html, (err, window) => {
      assert.ifError(err);
      assert.strictEqual(jsdom.serializeDocument(window.document), expected);
      t.done();
    });
  });
});
