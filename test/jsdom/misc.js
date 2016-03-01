"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const path = require("path");
const fs = require("fs");
const jsdom = require("../..");
const toFileUrl = require("../util").toFileUrl(__dirname);
const http = require("http");
const https = require("https");
const EventEmitter = require("events").EventEmitter;
const zlib = require("zlib");

function tmpWindow() {
  return jsdom.jsdom().defaultView;
}

function testFunction(test, window, jQuery, checkVersion) {
  test.notEqual(window.jQuery.find, null, "window.jQuery.find should not be null");
  test.notEqual(jQuery.find, null, "jQuery.find should not be null");
  jQuery("body").html(`<p id="para"><a class="link">click <em class="emph">ME</em></a></p>`);
  const res = jQuery("#para .emph").text();
  const res2 = jQuery("a.link .emph").text();
  test.equal(jQuery("p#para a.link", window.document.body).attr("class"), "link", "selecting from body");

  if (checkVersion) {
    test.strictEqual(jQuery("body").jquery, "1.4.4", "jQuery version 1.4.4");
  }

  test.equal(res, "ME", "selector should work as expected");
  test.equal(res2, "ME", "selector should work as expected");
}


describe("jsdom/miscellaneous", () => {
  specify("build_window", () => {
    const window = jsdom.jsdom().defaultView;
    assert.notEqual(window, null, "window should not be null");
    assert.notEqual(window.document, null, "window.document should not be null");
  });

  specify("jsdom_takes_html", () => {
    const document = jsdom.jsdom(`<a id="test" href="#test">`);
    assert.equal(
      document.getElementById("test").getAttribute("href"),
      "#test",
      "Passing html into jsdom() should populate the resulting doc"
    );
  });

  specify("jsdom_empty_html", () => {
    const emptyDoc = jsdom.jsdom("");
    const blankDoc = jsdom.jsdom(" ");
    assert.equal(
      emptyDoc.innerHTML,
      blankDoc.innerHTML,
      "Passing blank and empty strings into jsdom() result in the same html"
    );
  });

  specify("jsdom_method_creates_default_document", () => {
    const doc = jsdom.jsdom();
    assert.equal(doc.documentElement.nodeName, "HTML", "Calling jsdom.jsdom() should automatically populate the doc");
  });

  specify("jsdom_method_works_with_referrer_under_document", () => {
    const doc = jsdom.jsdom(undefined, {
      document: {
        referrer: "http://example.com"
      }
    });

    assert.equal(doc.referrer, "http://example.com");
  });

  specify("jquerify_url", { async: true }, t => {
    const jQueryUrl = "http://code.jquery.com/jquery-1.4.4.min.js";
    jsdom.jQueryify(tmpWindow(), jQueryUrl, (window, jQuery) => {
      testFunction(assert, window, jQuery, true);
      t.done();
    });
  });

  specify("jquerify_invalid", { async: true }, t => {
    jsdom.jQueryify(jsdom.jsdom("", { url: "http://www.example.org" }).defaultView, 1, (window, jQuery) => {
      assert.strictEqual(window.jQuery, undefined);
      assert.strictEqual(jQuery, undefined);
      t.done();
    });
  });

  // This is in response to issue # 280 - scripts don"t load over https.
  // See: https://github.com/tmpvar/jsdom/issues/280
  //
  // When a transfer is done, HTTPS servers in the wild might emit "close", or
  // might emit "end".  Node"s HTTPS server always emits "end", so we need to
  // fake a "close" to test this fix.
  specify("env_with_https", { async: true }, t => {
    // Save the real https.request so we can restore it later.
    const oldRequest = https.request;

    // Mock response object
    const res = Object.create(EventEmitter.prototype);
    res.setEncoding = () => {};
    res.headers = {};

    // Monkey patch https.request so it emits "close" instead of "end.
    https.request = () => {
      // Mock the request object.
      const req = Object.create(EventEmitter.prototype);
      req.setHeader = () => {};
      req.end = () => {};
      process.nextTick(() => {
        req.emit("response", res);
        process.nextTick(() => {
          res.emit("data", "window.attachedHere = 123");
          res.emit("close");
        });
      });
      return req;
    };

    jsdom.env({
      html: `<a href="/path/to/hello">World</a>`,
      // The script url doesn"t matter as long as its https, since our mocked
      // request doens"t actually fetch anything.
      scripts: "https://doesntmatter.com/script.js",
      done(errors, window) {
        if (errors) {
          assert.ok(false, errors.message);
        } else {
          assert.notEqual(window.location, null, "window.location should not be null");
          assert.equal(window.attachedHere, 123, "script should execute on our window");
          assert.equal(window.document.getElementsByTagName("a").item(0).innerHTML, "World", "anchor text");
        }
        https.request = oldRequest;
        t.done();
      }
    });
  });

  specify("appendChild_to_document_with_existing_documentElement", () => {
    function t() {
      try {
        const doc = jsdom.jsdom();
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
      const doc1 = jsdom.jsdom(`<html><body><h1 id="headline">Hello <span id="world">World</span></h1></body></html>`);
      const doc2 = jsdom.jsdom();
      doc2.body.appendChild(doc2.importNode(doc1.getElementById("headline"), true));
      doc2.getElementById("world").className = "foo";
    });
  });

  specify("window_is_augmented_with_dom_features", () => {
    const document = jsdom.jsdom();
    const window = document.defaultView;
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
      const doc = jsdom.jsdom(html, { url });
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
      const doc = jsdom.jsdom(html, { url });
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
      const doc = jsdom.jsdom(html, { url });
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
    const document = jsdom.jsdom(html);
    const a = document.body.children.item(0);

    a.innerHTML = 9;
    a.setAttribute("id", 123);
    assert.strictEqual(a.innerHTML, "9", "Element stringify");
    assert.strictEqual(a.getAttributeNode("id").nodeValue, "123", "Attribute stringify");
  });

  specify("mutation_events", () => {
    const document = jsdom.jsdom();
    let created = "";
    let removed = "";
    document.addEventListener("DOMNodeInserted", ev => {
      created += ev.target.tagName;
    });
    document.addEventListener("DOMNodeRemoved", ev => {
      removed += ev.target.tagName;
    });
    const h1 = document.createElement("h1");
    const h2 = document.createElement("h2");
    const h3 = document.createElement("h3");

    document.body.appendChild(h2);
    document.body.insertBefore(h1, h2);
    document.body.insertBefore(h3, null);
    assert.strictEqual("H2H1H3", created, "an event should be dispatched for each created element");

    document.body.removeChild(h1);
    document.body.insertBefore(h3, h2);
    assert.strictEqual("H1H3", removed, "an event should be dispatched for each removed element");

    let text = h2.innerHTML = "foo";
    h2.addEventListener("DOMCharacterDataModified", ev => {
      text = ev.target.nodeValue;
    });
    h2.firstChild.nodeValue = "bar";
    assert.equal(h2.innerHTML, text, "ChactaterData changes should be captured");

    let event;
    h2.setAttribute("class", "foo");
    document.addEventListener("DOMAttrModified", ev => {
      event = ev;
    });
    h2.setAttribute("class", "bar");
    assert.ok(event, "Changing an attribute should trigger DOMAttrModified");
    assert.equal(event.attrName, "class", "attrName should be class");
    assert.equal(event.prevValue, "foo", "prevValue should be foo");
    assert.equal(event.newValue, "bar", "newValue should be bar");

    event = false;
    h2.setAttribute("class", "bar");
    assert.ok(!event, "Setting the same value again should not trigger an event");

    h2.removeAttribute("class");
    assert.ok(event, "Removing an attribute should trigger DOMAttrModified");
    assert.equal(event.attrName, "class", "attrName should be class");
    assert.equal(event.prevValue, "bar", "prevValue should be bar");
  });

  specify("DomSubtreeModifiedEvents", () => {
    const document = jsdom.jsdom();
    let firedAfterAddedChild = false;
    let firedAfterAddedTextNode = false;
    let firedAfterAddingAttr = false;
    let firedAfterChangingAttr = false;
    let firedAfterRemovedAttr = false;

    document.addEventListener("DOMSubtreeModified", () => {
      firedAfterAddedChild = true;
    });
    const div = document.createElement("div");
    document.body.appendChild(div);
    assert.ok(firedAfterAddedChild, "DOMSubtreeModified event should be fired for each created element");

    document.addEventListener("DOMSubtreeModified", () => {
      firedAfterAddedTextNode = true;
    });
    const textNode = document.createTextNode("text node test");
    document.getElementsByTagName("div")[0].appendChild(textNode);
    assert.ok(firedAfterAddedTextNode, "DOMSubtreeModified event should be fired when texnode value changed");
    document.addEventListener("DOMSubtreeModified", () => {
      firedAfterAddingAttr = true;
    });
    document.getElementsByTagName("div")[0].setAttribute("class", "test-class");
    assert.ok(firedAfterAddingAttr, "DOMSubtreeModified event should be fired when attribute added");

    document.addEventListener("DOMSubtreeModified", () => {
      firedAfterChangingAttr = true;
    });
    document.getElementsByTagName("div")[0].setAttribute("class", "test-class-2");
    assert.ok(firedAfterChangingAttr, "DOMSubtreeModified event should be fired when attribute value changed");

    firedAfterChangingAttr = false;
    document.getElementsByTagName("div")[0].setAttribute("class", "test-class-2");
    assert.ok(
      firedAfterChangingAttr === false,
      "DOMSubtreeModified not be fired when new attribute value same as old one"
    );

    document.addEventListener("DOMSubtreeModified", () => {
      firedAfterRemovedAttr = true;
    });
    document.getElementsByTagName("div")[0].removeAttribute("class");
    assert.ok(firedAfterRemovedAttr, "DOMSubtreeModified event should be fired when attribute removed");

    firedAfterRemovedAttr = false;
    document.getElementsByTagName("div")[0].removeAttribute("class");
    assert.ok(
      firedAfterRemovedAttr === false,
      "DOMSubtreeModified not be fired when try to remove attribute does not exists"
    );
  });

  specify("childNodes_updates_on_insertChild", () => {
    const window = jsdom.jsdom("").defaultView;
    const div = window.document.createElement("div");
    let text = window.document.createTextNode("bar");
    div.appendChild(text);
    assert.strictEqual(text, div.childNodes[0],
               "childNodes NodeList should update after appendChild");

    text = window.document.createTextNode("bar");
    div.insertBefore(text, null);
    assert.strictEqual(text, div.childNodes[1],
               "childNodes NodeList should update after insertBefore");
  });

  specify("option_set_selected", () => {
    const window = jsdom.jsdom("").defaultView;
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

  specify("children_should_be_available_right_after_document_creation", () => {
    const doc = jsdom.jsdom("<html><body><div></div></body></html>");
    assert.ok((doc.body.children[0] !== undefined), "there should be a body, and it should have a child");
  });

  specify("children_should_be_available_right_after_document_creation_scripts", () => {
    const html = `<html><body>
      <script type="text/javascript">
        const h = document.createElement("div");
        h.innerHTML = '<div style="opacity:0.8"></div>';
        window.myNode = h.childNodes[0];
      </script>
    </body></html>`;

    const window = jsdom.jsdom(html).defaultView;
    assert.ok(window.myNode.nodeType);
  });

  specify("fix_for_issue_172", () => {
    jsdom.env(`<html><body><script type="text/javascript"></script></body></html>`, [
      "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.2.js")
    ], () => {
      // ensure the callback gets called!
    });
  });

  specify("fix_for_issue_221", () => {
    const html = "<html><head></head><body></body></html>";
    const document = jsdom.jsdom(html);
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.appendChild(document.createTextNode("hello world"));
    assert.strictEqual(div.childNodes[0].nodeValue, "hello world",
               "Nodelist children should be populated immediately");
  });

  specify("parsing_and_serializing_entities", () => {
    const html = `<html><body><a href="http://example.com/?a=b&amp;c=d">&lt;&aelig;&#x263a;foo</a>`;
    const document = jsdom.jsdom(html);
    const anchor = document.getElementsByTagName("a")[0];

    assert.strictEqual(anchor.getAttribute("href"), "http://example.com/?a=b&c=d",
                     "href attribute value should be deentitified");

    assert.strictEqual(anchor.firstChild.nodeValue, "<æ☺foo",
                     "nodeValue of text node should be deentitified");

    assert.ok(anchor.outerHTML.indexOf("http://example.com/?a=b&amp;c=d") !== -1,
            "outerHTML of anchor href should be entitified");

    assert.ok(anchor.innerHTML.indexOf("&lt;") === 0,
            "innerHTML of anchor should begin with &lt;");
  });

  specify("parsing_and_serializing_unknown_entities", () => {
    const html = "<html><body>&nowayjose;&#x263a;&#xblah;&#9q;</body></html>";
    const document = jsdom.jsdom(html);
    assert.strictEqual(document.body.firstChild.nodeValue, "&nowayjose;☺lah;	q;",
                     "Unknown and unparsable entities should be handled like a browser would");
    assert.strictEqual(document.body.innerHTML, "&amp;nowayjose;☺lah;	q;",
                     "Unknown and unparsable entities should be handled like a browser would");
  });

  specify("entities_in_script_should_be_left_alone", () => {
    const html = `<!DOCTYPE html><html><head></head><body><script>alert("&quot;");</script></body></html>`;
    const document = jsdom.jsdom(html);
    assert.strictEqual(document.body.innerHTML, `<script>alert("&quot;");</script>`);
    assert.strictEqual(document.body.firstChild.innerHTML, `alert("&quot;");`);
  });

  specify("document_title_and_entities", () => {
    const html = "<html><head><title>&lt;b&gt;Hello&lt;/b&gt;</title></head><body></body></html>";
    const document = jsdom.jsdom(html);

    assert.strictEqual(document.title, "<b>Hello</b>",
      `document.title should be the deentitified version of what was in
      the original HTML`
    );

    document.title = "<b>World</b>";
    assert.strictEqual(document.title, "<b>World</b>",
      `When document.title is set programmatically to something looking like
      HTML tags, then read again, it should have the exact same value, no
      entification should take place`
    );

    document.title = "&lt;b&gt;World&lt;/b&gt;";
    assert.strictEqual(document.title, "&lt;b&gt;World&lt;/b&gt;",
      `When document.title is set programmatically to something looking like
      HTML entities, then read again, it should have the exact same value,
      no deentification should take place`
    );
  });

  specify("setting_and_getting_textContent", () => {
    const html = `<html><head>\n<title>&lt;foo&gt;</title></head>
                  <body>Hello<span><span>, </span>world</span>!</body></html>`;
    const document = jsdom.jsdom(html);

    assert.strictEqual(document.textContent, null,
      "textContent of document should be null"
    );

    assert.strictEqual(document.head.textContent, "\n<foo>",
      "textContent of document.head should be the initial whitespace plus the textContent of the document title"
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

    assert.strictEqual(div.textContent, "&lt;b&gt;\nWorld&lt;/b&gt;&lt;b&gt;W\orld&lt;/b&gt;",
      `textContent of complex programmatically created <div> should be the
      concatenation of the textContent values of its child nodes`
    );
  });

  specify("issues_230_259", () => {
    const instr = `<html><body style="color: #ffffff; foo: bar"></body></html>`;
    const doc = jsdom.jsdom(instr);
    assert.ok(jsdom.serializeDocument(doc).match(/0: *color/) === null);
  });

  // see: https://github.com/tmpvar/jsdom/issues/262
  specify("issue_262", () => {
    const document = jsdom.jsdom("<html><body></body></html>");
    const a = document.createElement("a");
    a.setAttribute("style", "color:blue");
    a.style.setProperty("color", "red");
    assert.equal(a.outerHTML.match(/style="/g).length, 1, "style attribute must not be serialized twice");
  });

  // see: https://github.com/tmpvar/jsdom/issues/267
  specify("issue_267", () => {
    const document = jsdom.jsdom("<html><body></body></html>");
    const a = document.createElement("a");
    a.style.width = "100%";
    assert.ok(a.getAttribute("style").match(/^\s*width\s*:\s*100%\s*;?\s*$/), "style attribute must contain width");
  });

  // Test inline event handlers set on the body.
  specify("test_body_event_handler_inline", { skipIfBrowser: true, async: true }, t => {
    // currently skipped in browsers because of an issue:
    // TODO: https://github.com/tmpvar/jsdom/issues/1379
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
    const doc = jsdom.jsdom(html, { deferClose: true });
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

  // Make sure traditional handlers on the body element set via script are
  // forwarded to the window.
  specify("test_body_event_handler_script", { async: true }, t => {
    const doc = jsdom.jsdom("<html><head></head><body></body></html>",
                          { deferClose: true });
    const window = doc.defaultView;
    assert.equal(window.onload, undefined);
    doc.body.onload = () => {
      t.done();
    };
    assert.notEqual(window.onload, undefined);
    doc.close();
  });

  // Test inline event handlers on a regular element.
  specify("test_element_inline_event_handler", () => {
    const doc = jsdom.jsdom(`
      <html>
        <head></head>
        <body>
          <div onclick="window.divClicked = true;"
               onmouseover="window.divMousedOver = true;"
               onmouseout="window.divCalledFrom = this.tagName;">
            <a></a>
          </div>
        </body>
      </html>`);

    const window = doc.defaultView;
    const div = doc.getElementsByTagName("div")[0];

    assert.equal(window.divClicked, undefined);
    assert.equal(window.divMousedOver, undefined);

    const click = doc.createEvent("MouseEvents");
    click.initEvent("click", false, false);
    div.dispatchEvent(click);
    assert.equal(window.divClicked, true);

    const mouseOver = doc.createEvent("MouseEvents");
    mouseOver.initEvent("mouseover", false, false);
    div.dispatchEvent(mouseOver);
    assert.equal(window.divMousedOver, true);

    const mouseOut = doc.createEvent("MouseEvents");
    mouseOut.initEvent("mouseout", false, false);
    div.dispatchEvent(mouseOut);
    assert.equal(window.divCalledFrom, "DIV");
  });

  // Test for issue 287 - element.onevent check doesn"t work
  // See: https://github.com/tmpvar/jsdom/issues/287
  specify("issue_287", () => {
    const doc = jsdom.jsdom();
    const elem = doc.createElement("form");
    elem.setAttribute("onsubmit", ";");
    assert.equal(typeof elem.onsubmit, "function");
  });

  specify("get_element_by_id", () => {
    const doc = jsdom.jsdom();
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
    const doc = jsdom.jsdom();
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
    const doc = jsdom.jsdom(`<a onclick="somefunction()">call some function</a>`);
    const a = doc.getElementsByTagName("a").item(0);
    const onclick = a.getAttribute("onclick");
    assert.notEqual(onclick, null);
    assert.equal(onclick, "somefunction()");
    assert.ok(jsdom.serializeDocument(doc).indexOf("onclick") > -1);
  });

  specify("issue_338_internal_nodelist_props", () => {
    const doc = jsdom.jsdom();
    const props = Object.keys(doc.body.childNodes);
    assert.equal(props.length, 0, "Internal properties must not be enumerable");
  });

  specify("setting_and_getting_script_element_text", () => {
    const doc = jsdom.jsdom("<script></script>");
    const script = doc.getElementsByTagName("script")[0];
    assert.equal(script.text, "");
    script.text = "const x = 3;";
    assert.equal(script.text, "const x = 3;");
    script.text = "const y = 2;";
    assert.equal(script.text, "const y = 2;");
  });

  specify("issue_239_replace_causes_script_execution", { async: true }, t => {
    jsdom.env({
      html: `<script type="text/javascript">window.a = 1;/* remove me */ console.log("executed?")</script>`,
      done(errors, window) {
        window.document.write(jsdom.serializeDocument(window.document).replace("/* remove me */", ""));
        window.document.close();
        assert.equal(typeof window.a, "undefined");
        t.done();
      }
    });
  });

  specify("issue_355_on_events_should_not_execute_js_when_disabled", { async: true }, t => {
    const html = `<html><body onload="undefined()">something</body></html>`;

    jsdom.env(html, e => {
      assert.equal(e, null);
      t.done();
    });
  });

  specify("issue_361_textarea_value_property", () => {
    const doc = jsdom.jsdom(`<html><body><textarea id="mytextarea"></textarea></body></html>`);

    doc.getElementById("mytextarea").value = "<foo>";
    assert.equal(doc.getElementById("mytextarea").value, "<foo>");
  });

  specify("on_events_should_be_called_in_bubbling_phase", () => {
    const doc = jsdom.jsdom(`
      <html>
        <head></head>
        <body>
          <div onclick="window.divClicked = true;"
               onmouseover="window.divMousedOver = true;">
            <a></a>
          </div>
        </body>
      </html>`);

    const window = doc.defaultView;
    const a = doc.getElementsByTagName("a")[0];

    assert.equal(window.divClicked, undefined);
    assert.equal(window.divMousedOver, undefined);

    const click = doc.createEvent("MouseEvents");
    click.initEvent("click", true, false);
    a.dispatchEvent(click);
    assert.equal(window.divClicked, true);

    const mouseOver = doc.createEvent("MouseEvents");
    mouseOver.initEvent("mouseover", true, false);
    a.dispatchEvent(mouseOver);
    assert.equal(window.divMousedOver, true);
  });

  specify("css_classes_should_be_attached_to_dom", () => {
    const dom = jsdom.jsdom().defaultView;

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
    const doc = jsdom.jsdom("<html><head></head><body></body></html>");
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
    const document = jsdom.jsdom("<iframe></iframe>");
    const iframeDocument = document.querySelector("iframe").contentWindow.document;

    assert.equal(jsdom.serializeDocument(iframeDocument), "<html><head></head><body></body></html>");
    assert.ok(iframeDocument.documentElement);
    assert.ok(iframeDocument.head);
    assert.ok(iframeDocument.body);
  });

  specify("issue_935_document_tostring_returns_null", () => {
    const document = jsdom.jsdom();
    assert.equal(document.toString(), "[object HTMLDocument]");
  });

  specify("addmetatohead", () => {
    const window = jsdom.jsdom().defaultView;
    const meta = window.document.createElement("meta");
    window.document.getElementsByTagName("head").item(0).appendChild(meta);
    const elements = window.document.getElementsByTagName("head").item(0).childNodes;
    assert.strictEqual(elements.item(elements.length - 1), meta, "last element should be the new meta tag");
    assert.ok(jsdom.serializeDocument(window.document).indexOf("<meta>") > -1, "meta should have open tag");
    assert.strictEqual(
      jsdom.serializeDocument(window.document).indexOf("</meta>"),
      -1,
      "meta should not be stringified with a closing tag"
    );
  });

  specify("no global leak when using window.location.reload", () => {
    // https://github.com/tmpvar/jsdom/pull/1032
    assert.equal("errors" in global, false, "there should be no errors global before the call");
    const window = jsdom.jsdom().defaultView;
    window.location.reload();
    assert.equal("errors" in global, false, "there should be no errors global after the call");
  });

  specify("custom userAgent inherits to iframes", () => {
    // https://github.com/tmpvar/jsdom/issues/1344#issuecomment-175272389

    const window = jsdom.jsdom("<!DOCTYPE html><iframe></iframe>", { userAgent: "custom user agent" }).defaultView;

    assert.strictEqual(window.navigator.userAgent, "custom user agent");
    assert.strictEqual(window.frames[0].navigator.userAgent, "custom user agent");
  });

  specify("script tags should be interpreted when type is in spec [ECMA262]", { async: true }, t => {
    const types = [
      "application/ecmascript",
      "application/javascript",
      "application/x-ecmascript",
      "application/x-javascript",
      "text/ecmascript",
      "text/javascript",
      "text/javascript1.0",
      "text/javascript1.1",
      "text/javascript1.2",
      "text/javascript1.3",
      "text/javascript1.4",
      "text/javascript1.5",
      "text/jscript",
      "text/livescript",
      "text/x-ecmascript",
      "text/x-javascript"
    ];

    types.forEach((type, i) => {
      jsdom.env({
        html: `<!DOCTYPE html><script type="${type}">window.interpreted = true</script></html>`,
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        },
        done: (err, window) => {
          if (err) {
            throw err;
          }

          assert.strictEqual(window.interpreted, true);

          if (i === types.length - 1) {
            t.done();
          }
        }
      });
    });
  });

  specify("script tags should not be interpreted when type is not in spec [ECMA262]", { async: true }, t => {
    const types = [
      "text/plain",
      "text/xml",
      "application/octet-stream",
      "application/xml"
    ];

    types.forEach((type, i) => {
      jsdom.env({
        html: `<!DOCTYPE html><script type="${type}">window.interpreted = true</script></html>`,
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        },
        done: (err, window) => {
          if (err) {
            throw err;
          }

          assert.strictEqual(window.interpreted, undefined);

          if (i === types.length - 1) {
            t.done();
          }
        }
      });
    });
  });

  specify("script tags should be interpreted when type is not set (ECMA262)", { async: true }, t => {
    jsdom.env({
      html: `<!DOCTYPE html><script>window.interpreted = true</script></html>`,
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      },
      done: (err, window) => {
        if (err) {
          throw err;
        }

        assert.strictEqual(window.interpreted, true);
        t.done();
      }
    });
  });

  // these tests require file system access or they start a http server
  describe("node specific tests", { skipIfBrowser: true }, () => {
    specify("jquerify_file", { async: true }, t => {
      const jQueryFile = path.resolve(__dirname, "../jquery-fixtures/jquery-1.4.4.js");
      jsdom.jQueryify(tmpWindow(), toFileUrl(jQueryFile), (window, jQuery) => {
        testFunction(assert, window, jQuery, true);
        t.done();
      });
    });

    specify("jquerify_attribute_selector_gh_400", { async: true }, t => {
      const window = jsdom.jsdom().defaultView;

      jsdom.jQueryify(window, "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"), () => {
        assert.doesNotThrow(() => {
          window.$("body").append(`<html><body><div data-foo="bar"/><div data-baz="foo"/></body></html>`);
        });

        assert.equal(window.$("*[data-foo]").length, 1);
        t.done();
      });
    });

    specify("env_with_compression", { async: true }, t => {
      const server = http.createServer((req, res) => {
        switch (req.url) {
          case "/":
            const text = "window.attachedHere = 123";
            const buf = new Buffer(text, "utf-8");
            zlib.gzip(buf, (_, result) => {
              res.writeHead(200, { "Content-Length": result.length, "Content-Encoding": "gzip" });
              res.emit("data", result);
              res.end(result);
            });
            break;
        }
      });

      server.listen(8001, "127.0.0.1", () => {
        jsdom.env({
          html: `<a href="/path/to/hello">World</a>`,
          scripts: "http://127.0.0.1:8001",
          done(errors, window) {
            server.close();
            if (errors) {
              assert.ok(false, errors.message);
            } else {
              assert.notEqual(window.location, null, "window.location should not be null");
              assert.equal(window.attachedHere, 123, "script should execute on our window");
              assert.equal(window.document.getElementsByTagName("a").item(0).innerHTML, "World", "anchor text");
            }
            t.done();
          }
        });
      });
    });

    specify("env_with_features_and_external_resources", { async: true }, t => {
      jsdom.env(
        "http://backbonejs.org/examples/todos/index.html",
        {
          features: {
            FetchExternalResources: ["script", "frame", "link"],
            ProcessExternalResources: ["script", "frame", "link"],
            MutationEvents: "2.0",
            QuerySelector: false
          }
        },
        (error, window) => {
          assert.ifError(error);
          assert.equal(typeof window._, "function", "Underscore loaded");
          assert.equal(typeof window.$, "function", "jQuery loaded");
          t.done();
        }
      );
    });

    specify("ensure_scripts_can_be_disabled_via_options_features", { async: true }, t => {
      const html = `<html><head><script src="./files/hello.js"></script></head>
                 <body><span id="test">hello from html</span></body></html>`;

      const doc2 = jsdom.jsdom(html, {
        url: toFileUrl(__filename),
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: false
        }
      });
      setTimeout(() => {
        assert.equal(doc2.getElementById("test").innerHTML, "hello from html", "js should not be executed (doc2)");
        t.done();
      }, 100);
    });

    specify("ensure_scripts_can_be_executed_via_options_features", { async: true }, t => {
      const html = `<html><head><script src="./files/hello.js"></script></head>
                    <body><span id="test">hello from html</span></body></html>`;

      const doc = jsdom.jsdom(html, {
        url: toFileUrl(__filename),
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        }
      });

      doc.defaultView.doCheck = () => {
        assert.equal(doc.getElementById("test").innerHTML, "hello from javascript");
        t.done();
      };
    });

    specify("ensure_resolution_is_not_thrown_off_by_hrefless_base_tag", { async: true }, t => {
      const html = `<html><head><base target="whatever">
                 <script src="./files/hello.js"></script></head><body>
                 <span id="test">hello from html</span></body></html>`;

      const doc = jsdom.jsdom(html, {
        url: toFileUrl(__filename),
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        }
      });

      doc.defaultView.doCheck = () => {
        assert.equal(doc.getElementById("test").innerHTML, "hello from javascript");
        t.done();
      };
    });

    specify("ensure_resources_can_be_skipped_via_options_features", { async: true }, t => {
      const html = `<html><head><script src="./files/hello.js"></script>
                 <script src="./files/nyan.js"></script></head>
                 <body><span id="test">hello from html</span><span id="cat">
                 hello from cat</body></html>`;

      const doc2 = jsdom.jsdom(html, {
        url: toFileUrl(__filename),
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"],
          SkipExternalResources: new RegExp(".*/files/h")
        }
      });
      doc2.defaultView.onload = () => {
        assert.equal(doc2.getElementById("test").innerHTML, "hello from html", "js should not be executed (doc2)");
        assert.equal(doc2.getElementById("cat").innerHTML, "hello from nyan cat", "js should be executed (doc2)");
        t.done();
      };
    });

    specify("understand_file_protocol", { async: true }, t => {
      const html = `
        <html>
          <head>
            <script type="text/javascript" src="` + toFileUrl("files/hello.js") + `"></script>
          </head>
          <body>
            <span id="test">hello from html</span>
          </body>
        </html>`;

      const doc = jsdom.jsdom(html);
      doc.onload = () => {
        assert.equal(
          doc.getElementById("test").innerHTML,
          "hello from javascript",
          "resource with file protocol should work"
        );
        t.done();
      };
    });

    specify("auto_tostring", () => {
      const buffer = fs.readFileSync(path.resolve(__dirname, "files/env.html"));
      let dom;
      assert.doesNotThrow(() => {
        dom = jsdom.jsdom(buffer);
      }, "buffers should automatically be stringified");
      assert.equal(dom.documentElement.getElementsByTagName("*").length, 3, "should parse as per usual");
    });

    specify("allow_ender_to_run", { async: true }, t => {
      jsdom.env("<a />", ["file:" + path.resolve(__dirname, "files/ender-qwery.js")], (e, w) => {
        assert.ok(!e, "no errors");
        assert.ok(w.ender, "ender exists");
        assert.ok(w.$, "window contains $");
        t.done();
      });
    });

    specify("issue_509_out_of_memory", () => {
      const html = fs.readFileSync(path.resolve(__dirname, "files/reddit.html"));
      jsdom.jsdom(html.toString());
    });

    specify("jquery_val_on_selects", { async: true }, t => {
      const window = jsdom.jsdom().defaultView;

      jsdom.jQueryify(window, "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"), () => {
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
      });
    });

    specify("jquery_attr_mixed_case", { async: true }, t => {
      const window = jsdom.jsdom().defaultView;

      jsdom.jQueryify(window, "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"), () => {
        const $el = window.$(`<div mixedcase="blah"></div>`);

        assert.equal($el.attr("mixedCase"), "blah");
        t.done();
      });
    });

    specify("Calling show() method in jQuery 1.11.0 (GH-709)", { async: true }, t => {
      const window = jsdom.jsdom("<!DOCTYPE html><html><head></head><body></body></html>").defaultView;

      jsdom.jQueryify(window, "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"), () => {
        const $el = window.$("<div></div>");

        assert.doesNotThrow(() => {
          $el.show();
        });

        t.done();
      });
    });

    specify("Calling show() method in jQuery 1.11.0, second case (GH-709)", { async: true }, t => {
      const window = jsdom.jsdom("<!DOCTYPE html><html><head></head><body></body></html>").defaultView;

      jsdom.jQueryify(window, "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"), () => {
        const $el1 = window.$("<div></div>");
        const $el2 = window.$("<span></span>");

        assert.doesNotThrow(() => {
          $el1.show();
          $el2.show();
        });

        t.done();
      });
    });

    specify("redirected_url_equal_to_location_href", { async: true }, t => {
      const html = "<p>Redirect</p>";
      const server = http.createServer((req, res) => {
        switch (req.url) {
          case "/":
            res.writeHead(302, { Location: "/redir" });
            res.end();
            break;
          case "/redir":
            res.writeHead(200, { "Content-Length": html.length });
            res.end(html);
            break;
        }
      });

      server.listen(8001, "127.0.0.1", () => {
        jsdom.env({
          url: "http://127.0.0.1:8001",
          done(errors, window) {
            server.close();
            if (errors) {
              assert.ok(false, errors.message);
            } else {
              assert.equal(window.document.body.innerHTML, html, "root page should be redirected");
              assert.equal(window.location.href, "http://127.0.0.1:8001/redir",
                "window.location.href should equal to redirected url");
            }
            t.done();
          }
        });
      });
    });

    specify("script_with_cookie", { async: true }, t => {
      const html = `<!DOCTYPE html><html><head><script src="/foo.js"></script></head><body>foo</body></html>`;

      const server = http.createServer((req, res) => {
        switch (req.url) {
          case "/":
            res.writeHead(200, { "Content-Length": html.length });
            res.end(html);
            break;
          case "/foo.js":
            const cookie = req.headers.cookie;
            const name = cookie ? cookie.split("=")[1] : "no cookie";
            const text = "document.body.innerHTML = 'Hello " + name + "'; window.doCheck();";
            res.writeHead(200, { "Content-Length": text.length });
            res.end(text);
            break;
        }
      });

      server.listen(8001, "127.0.0.1", () => {
        jsdom.env({
          url: "http://127.0.0.1:8001",
          document: { cookie: "name=world" },
          features: {
            FetchExternalResources: ["script"],
            ProcessExternalResources: ["script"]
          },
          created(err, window) {
            window.doCheck = () => {
              server.close();
              assert.ifError(err);
              assert.equal(window.document.body.innerHTML, "Hello world");
              t.done();
            };
          }
        });
      });
    });

    specify("xhr_with_cookie", { async: true }, t => {
      const html = `<!DOCTYPE html><html><head><script>
                 const xhr = new XMLHttpRequest();
                 xhr.onload = function () {
                   document.body.innerHTML = xhr.responseText;
                   window.doCheck();
                 };
                 xhr.open("GET", "/foo.txt", true);
                 xhr.send();
                 </script></head><body>foo</body></html>`;

      const server = http.createServer((req, res) => {
        switch (req.url) {
          case "/":
            res.writeHead(200, { "Content-Length": html.length });
            res.end(html);
            break;
          case "/foo.txt":
            const cookie = req.headers.cookie;
            const name = cookie ? cookie.split("=")[1] : "no cookie";
            const text = "Hello " + name;
            res.writeHead(200, { "Content-Length": text.length });
            res.end(text);
            break;
        }
      });

      server.listen(8001, "127.0.0.1", () => {
        jsdom.env({
          url: "http://127.0.0.1:8001",
          document: { cookie: "name=world" },
          features: {
            FetchExternalResources: ["script"],
            ProcessExternalResources: ["script"]
          },
          done(err, window) {
            window.doCheck = () => {
              server.close();
              assert.ifError(err);
              assert.equal(window.document.body.innerHTML, "Hello world");
              t.done();
            };
          }
        });
      });
    });
  }); // describe("node specific tests")
});
