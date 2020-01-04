"use strict";
const path = require("path");
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

describe("jsdom/miscellaneous", () => {
  specify("DOMContentLoaded should not be fired after window.close() (GH-1479)", () => {
    const { window } = new JSDOM(`<html><head>
      <script>
        window.a = 0;
        document.addEventListener("DOMContentLoaded", () => window.a++, false);
      </script>
      </head><body></body></html>`, { runScripts: "dangerously" });

    window.close();
    assert.equal(window.a, 0);
  });

  specify("appendChild_to_document_with_existing_documentElement", () => {
    function t() {
      try {
        const doc = (new JSDOM()).window.document;
        doc.appendChild(doc.createElement("html"));
      } catch (e) {
        assert.equal(e.code, 3, "Should throw HIERARCHY_ERR");
        throw e;
      }
    }
    assert.throws(t);
  });

  specify("importNode", () => {
    assert.doesNotThrow(() => {
      const html1 = `<html><body><h1 id="headline">Hello <span id="world">World</span></h1></body></html>`;
      const doc1 = (new JSDOM(html1)).window.document;
      const doc2 = (new JSDOM()).window.document;
      doc2.body.appendChild(doc2.importNode(doc1.getElementById("headline"), true));
      doc2.getElementById("world").className = "foo";
    });
  });

  specify("window_is_augmented_with_dom_features", () => {
    const { window } = new JSDOM();
    assert.notEqual(window.Element, null, "window.Element should not be null");
  });

  specify("url_resolution", () => {
    const html = `
  <html>
    <head></head>
    <body>
      <a href="http://example.com" id="link1">link1</a>
      <a href="/local.html" id="link2">link2</a>
      <a href="local.html" id="link3">link3</a>
      <a href="../../local.html" id="link4">link4</a>
      <a href="#here" id="link5">link5</a>
      <a href="//example.com/protocol/avoidance.html" id="link6">protocol</a>
    </body>\
  </html>`;

    function testLocal() {
      const url = "file:///path/to/docroot/index.html";
      const doc = (new JSDOM(html, { url })).window.document;
      assert.equal(
        doc.getElementById("link1").href,
        "http://example.com/",
        "Absolute URL should be left alone except for possible trailing slash"
      );
      assert.equal(
        doc.getElementById("link2").href,
        "file:///local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link3").href,
        "file:///path/to/docroot/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link4").href,
        "file:///path/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link5").href,
        "file:///path/to/docroot/index.html#here",
        "Relative URL should be resolved"
      );
      // test.equal(
      //   doc.getElementById("link6").href,
      //   "//prototol/avoidance.html",
      //   "Protocol-less URL should be resolved"
      // );
    }

    function testRemote() {
      const url = "http://example.com/path/to/docroot/index.html";
      const doc = (new JSDOM(html, { url })).window.document;
      assert.equal(
        doc.getElementById("link1").href,
        "http://example.com/",
        "Absolute URL should be left alone except for possible trailing slash"
      );
      assert.equal(
        doc.getElementById("link2").href,
        "http://example.com/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link3").href,
        "http://example.com/path/to/docroot/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link4").href,
        "http://example.com/path/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link5").href,
        "http://example.com/path/to/docroot/index.html#here",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link6").href,
        "http://example.com/protocol/avoidance.html",
        "Relative URL should be resolved"
      );
    }

    function testBase() {
      const url = "about:blank";
      const doc = (new JSDOM(html, { url })).window.document;
      const base = doc.createElement("base");
      base.href = "http://example.com/path/to/docroot/index.html";
      doc.getElementsByTagName("head").item(0).appendChild(base);
      assert.equal(
        doc.getElementById("link1").href,
        "http://example.com/",
        "Absolute URL should be left alone except for possible trailing slash"
      );
      assert.equal(
        doc.getElementById("link2").href,
        "http://example.com/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link3").href,
        "http://example.com/path/to/docroot/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link4").href,
        "http://example.com/path/local.html",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link5").href,
        "http://example.com/path/to/docroot/index.html#here",
        "Relative URL should be resolved"
      );
      assert.equal(
        doc.getElementById("link6").href,
        "http://example.com/protocol/avoidance.html",
        "Relative URL should be resolved"
      );
    }

    testLocal();
    testRemote();
    testBase();
  });

  specify("numeric_values", () => {
    const html = `<html><body><td data-year="2011" data-month="0" data-day="9">
                  <a href="#" class=" ">9</a>
                </td></body></html>`;
    const { document } = (new JSDOM(html)).window;
    const a = document.body.children.item(0);

    a.innerHTML = 9;
    a.setAttribute("id", 123);
    assert.strictEqual(a.innerHTML, "9", "Element stringify");
    assert.strictEqual(a.getAttributeNode("id").nodeValue, "123", "Attribute stringify");
  });

  specify("childNodes_updates_on_insertChild", () => {
    const { window } = new JSDOM();
    const div = window.document.createElement("div");
    let text = window.document.createTextNode("bar");
    div.appendChild(text);
    assert.strictEqual(
      text, div.childNodes[0],
      "childNodes NodeList should update after appendChild"
    );

    text = window.document.createTextNode("bar");
    div.insertBefore(text, null);
    assert.strictEqual(
      text, div.childNodes[1],
      "childNodes NodeList should update after insertBefore"
    );
  });

  specify("option_set_selected", () => {
    const { window } = new JSDOM();
    const select = window.document.createElement("select");

    const option0 = window.document.createElement("option");
    select.appendChild(option0);
    option0.setAttribute("selected", "selected");

    const optgroup = window.document.createElement("optgroup");
    select.appendChild(optgroup);
    const option1 = window.document.createElement("option");
    optgroup.appendChild(option1);

    assert.strictEqual(true, option0.selected, "initially selected");
    assert.strictEqual(false, option1.selected, "initially not selected");
    assert.strictEqual(option1, select.options[1], "options should include options inside optgroup");

    option1.defaultSelected = true;
    assert.strictEqual(false, option0.selected, "selecting other option should deselect this");
    assert.strictEqual(true, option0.defaultSelected, "default should not change");
    assert.strictEqual(true, option1.selected, "selected changes when defaultSelected changes");
    assert.strictEqual(true, option1.defaultSelected, "I just set this");

    option0.defaultSelected = false;
    option0.selected = true;
    assert.strictEqual(true, option0.selected, "I just set this");
    assert.strictEqual(false, option0.defaultSelected, "selected does not set default");
    assert.strictEqual(false, option1.selected, "should deselect others");
    assert.strictEqual(true, option1.defaultSelected, "unchanged");
  });

  specify("fix_for_issue_221", () => {
    const html = "<html><head></head><body></body></html>";
    const { document } = (new JSDOM(html)).window;
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.appendChild(document.createTextNode("hello world"));
    assert.strictEqual(
      div.childNodes[0].nodeValue, "hello world",
      "Nodelist children should be populated immediately"
    );
  });

  specify("parsing_and_serializing_entities", () => {
    const html = `<html><body><a href="http://example.com/?a=b&amp;c=d">&lt;&aelig;&#x263a;foo</a>`;
    const { document } = (new JSDOM(html)).window;
    const anchor = document.getElementsByTagName("a")[0];

    assert.strictEqual(
      anchor.getAttribute("href"), "http://example.com/?a=b&c=d",
      "href attribute value should be deentitified"
    );

    assert.strictEqual(
      anchor.firstChild.nodeValue, "<æ☺foo",
      "nodeValue of text node should be deentitified"
    );

    assert.ok(
      anchor.outerHTML.indexOf("http://example.com/?a=b&amp;c=d") !== -1,
      "outerHTML of anchor href should be entitified"
    );

    assert.ok(
      anchor.innerHTML.indexOf("&lt;") === 0,
      "innerHTML of anchor should begin with &lt;"
    );
  });

  specify("parsing_and_serializing_unknown_entities", () => {
    const html = "<html><body>&nowayjose;&#x263a;&#xblah;&#9q;</body></html>";
    const { document } = (new JSDOM(html)).window;
    assert.strictEqual(
      document.body.firstChild.nodeValue, "&nowayjose;☺lah;\tq;",
      "Unknown and unparsable entities should be handled like a browser would"
    );
    assert.strictEqual(
      document.body.innerHTML, "&amp;nowayjose;☺lah;\tq;",
      "Unknown and unparsable entities should be handled like a browser would"
    );
  });

  specify("entities_in_script_should_be_left_alone", () => {
    const html = `<!DOCTYPE html><html><head></head><body><script>alert("&quot;");</script></body></html>`;
    const { document } = (new JSDOM(html)).window;
    assert.strictEqual(document.body.innerHTML, `<script>alert("&quot;");</script>`);
    assert.strictEqual(document.body.firstChild.innerHTML, `alert("&quot;");`);
  });

  specify("document_title_and_entities", () => {
    const html = "<html><head><title>&lt;b&gt;Hello&lt;/b&gt;</title></head><body></body></html>";
    const { document } = (new JSDOM(html)).window;

    assert.strictEqual(
      document.title, "<b>Hello</b>",
      `document.title should be the deentitified version of what was in
      the original HTML`
    );

    document.title = "<b>World</b>";
    assert.strictEqual(
      document.title, "<b>World</b>",
      `When document.title is set programmatically to something looking like
      HTML tags, then read again, it should have the exact same value, no
      entification should take place`
    );

    document.title = "&lt;b&gt;World&lt;/b&gt;";
    assert.strictEqual(
      document.title, "&lt;b&gt;World&lt;/b&gt;",
      `When document.title is set programmatically to something looking like
      HTML entities, then read again, it should have the exact same value,
      no deentification should take place`
    );
  });

  specify("setting_and_getting_textContent", () => {
    const html = `<html><head>\n<title>&lt;foo&gt;</title></head>
                  <body>Hello<span><span>, </span>world</span>!</body></html>`;
    const { document } = (new JSDOM(html)).window;

    assert.strictEqual(
      document.textContent, null,
      "textContent of document should be null"
    );

    assert.strictEqual(
      document.head.textContent, "\n<foo>",
      "textContent of document.head should be the initial whitespace plus the textContent " +
                       "of the document title"
    );

    assert.strictEqual(
      document.body.textContent,
      "Hello, world!",
      "textContent of document.body should be the concatenation of the textContent values of its child nodes"
    );

    assert.strictEqual(
      document.createTextNode("&lt;b&gt;World&lt;/b&gt;").textContent,
      "&lt;b&gt;World&lt;/b&gt;",
      "textContent of programmatically created text node should be identical to its nodeValue"
    );

    assert.strictEqual(
      document.createComment("&lt;b&gt;World&lt;/b&gt;").textContent,
      "&lt;b&gt;World&lt;/b&gt;",
      "textContent of programmatically created comment node should be identical to its nodeValue"
    );

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode("&lt;foo&gt;<b></b>"));
    frag.appendChild(document.createElement("div")).appendChild(document.createTextNode("&lt;foo&gt;<b></b>"));

    assert.strictEqual(
      frag.textContent,
      "&lt;foo&gt;<b></b>&lt;foo&gt;<b></b>",
      "textContent of programmatically created document fragment should be the concatenation " +
      "of the textContent values of its child nodes"
    );

    const div = document.createElement("div");
    div.innerHTML = "&amp;lt;b&amp;gt;\nWorld&amp;lt;/b&amp;gt;<span></span><span>" +
                    "<span></span></span><span>&amp;lt;b&amp;gt;World&amp;lt;/b&amp;gt;</span>";

    assert.strictEqual(
      div.textContent, "&lt;b&gt;\nWorld&lt;/b&gt;&lt;b&gt;World&lt;/b&gt;",
      `textContent of complex programmatically created <div> should be the
      concatenation of the textContent values of its child nodes`
    );
  });

  specify("issues_230_259", () => {
    const instr = `<html><body style="color: #ffffff; foo: bar"></body></html>`;
    const dom = new JSDOM(instr);
    assert.ok(dom.serialize().match(/0: *color/) === null);
  });

  // see: https://github.com/jsdom/jsdom/issues/262
  specify("issue_262", () => {
    const { document } = (new JSDOM()).window;
    const a = document.createElement("a");
    a.setAttribute("style", "color:blue");
    a.style.setProperty("color", "red");
    assert.equal(a.outerHTML.match(/style="/g).length, 1, "style attribute must not be serialized twice");
  });

  // see: https://github.com/jsdom/jsdom/issues/267
  specify("issue_267", () => {
    const { document } = (new JSDOM()).window;
    const a = document.createElement("a");
    a.style.width = "100%";
    assert.ok(a.getAttribute("style").match(/^\s*width\s*:\s*100%\s*;?\s*$/), "style attribute must contain width");
  });

  // Test inline event handlers set on the body.
  // TODO this currently fails!?
  specify.skip("test_body_event_handler_inline", { skipIfBrowser: true, async: true }, t => {
    // currently skipped in browsers because of an issue:
    // TODO: https://github.com/jsdom/jsdom/issues/1379
    const html = `
      <html>
        <head>
          <script>
            function loader () {
              window.loader_called = true;
            }
          </script>
        </head>
        <body onload="loader()"></body>
      </html>`;
    const doc = (new JSDOM(html, { runScripts: "dangerously" })).window.document;
    const window = doc.defaultView;
    // In JSDOM, listeners registered with addEventListener are called before
    // "traditional" listeners, so listening for "load" will fire before our
    // inline listener.  This means we have to check the value on the next
    // tick.
    window.addEventListener("load", () => {
      process.nextTick(() => {
        assert.equal(window.loader_called, true);
        t.done();
      });
    });
    doc.close();
  });

  specify("get_element_by_id", () => {
    const doc = (new JSDOM()).window.document;
    const el = doc.createElement("div");
    el.setAttribute("id", "foo");
    assert.equal(doc.getElementById("foo"), null, "Element must not be found until it has been added to the DOM");

    doc.body.appendChild(el);
    assert.equal(doc.getElementById("foo"), el, "Element must be found after being added");

    el.id = "bar";
    assert.equal(doc.getElementById("foo"), null, "Element must not be found by its previous id");
    assert.equal(doc.getElementById("bar"), el, "Element must be found by its new id");

    el.setAttribute("id", "baz");
    assert.equal(doc.getElementById("bar"), null, "Element must not be found by its previous id");
    assert.equal(doc.getElementById("baz"), el, "Element must be found by its new id");

    el.getAttributeNode("id").nodeValue = "boo";
    assert.equal(doc.getElementById("boo"), el, "Element must be found by its new id");

    doc.body.removeChild(el);
    assert.equal(doc.getElementById(el.id), null, "Element must not be found after it has been removed");
  });

  specify("get_element_by_id_multi_id", () => {
    const doc = (new JSDOM()).window.document;
    const div = doc.createElement("div");
    div.setAttribute("id", "foo");
    doc.body.appendChild(div);
    const span = doc.createElement("span");
    span.setAttribute("id", "foo");
    doc.body.appendChild(span);

    // now if we remove the second element, we should still find the first
    doc.body.removeChild(span);
    assert.equal(doc.getElementById("foo"), div, "Original div#foo must be found after removing invalid span#foo");
  });

  specify("issue_335_inline_event_handlers", () => {
    const dom = new JSDOM(`<a onclick="somefunction()">call some function</a>`);
    const a = dom.window.document.getElementsByTagName("a").item(0);
    const onclick = a.getAttribute("onclick");
    assert.notEqual(onclick, null);
    assert.equal(onclick, "somefunction()");
    assert.ok(dom.serialize().indexOf("onclick") > -1);
  });

  specify("issue_338_internal_nodelist_props", () => {
    const doc = (new JSDOM()).window.document;
    const props = Object.keys(doc.body.childNodes);
    assert.equal(props.length, 0, "Internal properties must not be enumerable");
  });

  specify("setting_and_getting_script_element_text", () => {
    const doc = (new JSDOM("<script></script>")).window.document;
    const script = doc.getElementsByTagName("script")[0];
    assert.equal(script.text, "");
    script.text = "const x = 3;";
    assert.equal(script.text, "const x = 3;");
    script.text = "const y = 2;";
    assert.equal(script.text, "const y = 2;");
  });

  specify("issue_361_textarea_value_property", () => {
    const doc = (new JSDOM(`<html><body><textarea id="mytextarea"></textarea></body></html>`)).window.document;

    doc.getElementById("mytextarea").value = "<foo>";
    assert.equal(doc.getElementById("mytextarea").value, "<foo>");
  });

  specify("css_classes_should_be_attached_to_dom", () => {
    const dom = (new JSDOM()).window;

    assert.notEqual(dom.StyleSheet, undefined);
    assert.notEqual(dom.MediaList, undefined);
    assert.notEqual(dom.CSSStyleSheet, undefined);
    assert.notEqual(dom.CSSRule, undefined);
    assert.notEqual(dom.CSSStyleRule, undefined);
    assert.notEqual(dom.CSSMediaRule, undefined);
    assert.notEqual(dom.CSSImportRule, undefined);
    assert.notEqual(dom.CSSStyleDeclaration, undefined);
  });

  specify("issue_530_async_load_events", { async: true }, t => {
    const doc = (new JSDOM("<html><head></head><body></body></html>")).window.document;
    const window = doc.defaultView;

    // Add the load event after the document is already created; it shouldn"t
    // fire until nextTick. The test will fail (with a timeout) if it has
    // already fired.
    window.addEventListener("load", () => {
      assert.ok(true);
      t.done();
    });
  });

  specify("iframe_contents", () => {
    const { document } = (new JSDOM("<iframe></iframe>")).window;
    const iframeDocument = document.querySelector("iframe").contentWindow.document;

    assert.equal(iframeDocument.documentElement.outerHTML, "<html><head></head><body></body></html>");
    assert.ok(iframeDocument.documentElement);
    assert.ok(iframeDocument.head);
    assert.ok(iframeDocument.body);
  });

  specify("addmetatohead", () => {
    const dom = new JSDOM();
    const { window } = dom;
    const meta = window.document.createElement("meta");
    window.document.getElementsByTagName("head").item(0).appendChild(meta);
    const elements = window.document.getElementsByTagName("head").item(0).childNodes;
    assert.strictEqual(elements.item(elements.length - 1), meta, "last element should be the new meta tag");
    assert.ok(dom.serialize().indexOf("<meta>") > -1, "meta should have open tag");
    assert.strictEqual(
      dom.serialize().indexOf("</meta>"),
      -1,
      "meta should not be stringified with a closing tag"
    );
  });

  // these tests require file system access or they start a http server
  describe("node specific tests", { skipIfBrowser: true }, () => {
    specify("ensure_resolution_is_not_thrown_off_by_hrefless_base_tag", { async: true }, t => {
      const html = `<html><head><base target="whatever"></head><body>
                 <span id="test">hello from html</span>
                 <script src="./files/hello.js"></script></body></html>`;

      const { window } = new JSDOM(html, {
        url: toFileUrl(__filename),
        runScripts: "dangerously",
        resources: "usable"
      });

      window.doCheck = () => {
        assert.equal(window.document.getElementById("test").innerHTML, "hello from javascript");
        t.done();
      };
    });

    specify("understand_file_protocol", { async: true }, t => {
      const html = `
        <html>
          <head>
          </head>
          <body>
            <span id="test">hello from html</span>
            <script type="text/javascript" src="` + toFileUrl("files/hello.js") + `"></script>
          </body>
        </html>`;

      const { window } = new JSDOM(html, { resources: "usable", runScripts: "dangerously" });
      window.doCheck = () => {
        assert.equal(
          window.document.getElementById("test").innerHTML,
          "hello from javascript",
          "resource with file protocol should work"
        );
        t.done();
      };
    });

    specify("jquery_val_on_selects", { async: true }, t => {
      const { window } = new JSDOM(``, { resources: "usable", runScripts: "dangerously" });

      const script = window.document.createElement("script");
      script.src = "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js");
      script.onload = () => {
        window.$("body").append(`<html><body><select id="foo"><option value="first">f</option>
                                 <option value="last">l</option></select></body></html>`);

        assert.equal(
          window.document.querySelector("[value='first']").selected, true,
          "`selected` property should be `true` for first"
        );
        assert.equal(
          window.document.querySelector("[value='last']").selected, false,
          "`selected` property should be `false` for last"
        );

        assert.equal(window.$("[value='first']").val(), "first", "`val()` on first <option> should return its value");
        assert.equal(window.$("[value='last']").val(), "last", "`val()` on last <option> should return its value");

        const f = window.$("#foo");
        assert.equal(f.val(), "first", "`val()` on <select> should return first <option>'s value");

        window.$("#foo").val("last");
        assert.equal(
          window.document.querySelector("[value='first']").selected, false,
          "`selected` property should be `false` for first"
        );
        assert.equal(
          window.document.querySelector("[value='last']").selected, true,
          "`selected` property should be `true` for last"
        );
        assert.equal(window.$("#foo").val(), "last", "`val()` should return last <option>'s value");
        t.done();
      };
      window.document.body.appendChild(script);
    });

    specify("jquery_attr_mixed_case", { async: true }, t => {
      const { window } = new JSDOM(``, { resources: "usable", runScripts: "dangerously" });

      const script = window.document.createElement("script");
      script.src = "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js");
      script.onload = () => {
        const $el = window.$(`<div mixedcase="blah"></div>`);

        assert.equal($el.attr("mixedCase"), "blah");
        t.done();
      };
      window.document.body.appendChild(script);
    });

    specify("Calling show() method in jQuery 1.11.0 (GH-709)", { async: true }, t => {
      const { window } = new JSDOM(``, { resources: "usable", runScripts: "dangerously" });

      const script = window.document.createElement("script");
      script.src = "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js");
      script.onload = () => {
        const $el = window.$("<div></div>");

        assert.doesNotThrow(() => {
          $el.show();
        });

        t.done();
      };
      window.document.body.appendChild(script);
    });

    specify("Calling show() method in jQuery 1.11.0, second case (GH-709)", { async: true }, t => {
      const { window } = new JSDOM(``, { resources: "usable", runScripts: "dangerously" });

      const script = window.document.createElement("script");
      script.src = "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js");
      script.onload = () => {
        const $el1 = window.$("<div></div>");
        const $el2 = window.$("<span></span>");

        assert.doesNotThrow(() => {
          $el1.show();
          $el2.show();
        });

        t.done();
      };
      window.document.body.appendChild(script);
    });
  }); // describe("node specific tests")
});
