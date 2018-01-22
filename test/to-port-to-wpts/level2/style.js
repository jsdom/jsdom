"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const { assert } = require("chai");
const { beforeEach, afterEach, describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../../lib/old-api.js");

describe("level2/style", { skipIfBrowser: true }, () => {
  specify("HTMLStyleElement01", (t) => {
    jsdom.env(
        "<html><head><style>p{color:red}</style></head><body>",
        function (err, win) {
      var style = win.document.head.lastChild;
      assert.equal(style.sheet.cssRules.length, 1);
      assert.equal(style.sheet.cssRules[0].selectorText, "p");
      assert.equal(style.sheet.cssRules[0].style.color, "red");
      t.done();
    });
  }, {
    async: true
  });

  specify("HTMLStyleElement02", (t) => {
    var pageHTML = '<!doctype html><html><head>' +
        '<style>p { color: green; }</style><style>div { color: red; }</style>' +
        '</head><body></body></html>';
    var removeScript = "var style2 = document.getElementsByTagName('style')[1]; " +
        "style2.parentNode.removeChild(style2);";
    jsdom.env({
      html: pageHTML,
      src: removeScript,
      done: function(err, window) {
        assert.ifError(err);
        assert.equal(window.document.getElementsByTagName("style").length, 1);
        assert.equal(window.document.styleSheets.length, 1);
        t.done();
      }
    });
  }, {
    async: true
  });

  specify("HTMLStyleAttribute01", (t) => {
    jsdom.env(
        "<html><body><p style=\"color:red; background-color: blue\">",
        function (err, win) {
      var p = win.document.body.lastChild;
      assert.equal(2, p.style.length);
      assert.equal("color", p.style[0]);
      assert.equal("red", p.style.color);
      assert.equal("background-color", p.style[1]);
      assert.equal("blue", p.style.backgroundColor);
      t.done();
    });
  }, {
    async: true
  });

  specify("HTMLCanvasStyleAttribute01", (t) => {
    jsdom.env(
        "<html><body><canvas style=\"background-color: blue; z-index:1\">",
        function (err, win) {
      var c = win.document.body.lastChild;
      assert.equal(2, c.style.length);
      assert.equal("background-color", c.style[0]);
      assert.equal("blue", c.style.backgroundColor);
      assert.equal("z-index", c.style[1]);
      assert.equal(1, c.style.zIndex);
      t.done();
    });
  }, {
    async: true
  });

  specify("StylePropertyReflectsStyleAttribute", (t) => {
    jsdom.env(
        "",
        function (err, win) {
      var p = win.document.createElement("p");
      p.setAttribute("style", "color:red");
      assert.equal(1, p.style.length);
      assert.equal("color", p.style[0]);
      assert.equal("red", p.style.color);
      p.setAttribute("style", "");
      assert.equal(0, p.style.length);
      assert.equal("", p.style.color);
      p.setAttribute("style", "color:blue");
      assert.equal("color", p.style[0]);
      assert.equal("blue", p.style.color);
      t.done();
    });
  }, {
    async: true
  });

  specify("StyleAttributeReflectsStyleProperty", (t) => {
    jsdom.env(
        "",
        function (err, win) {
      var p = win.document.createElement("p");
      p.style.setProperty("color", "red");
      assert.equal(p.getAttribute("style"), "color: red;");
      p.style.setProperty("width", "20px");
      assert.equal(p.getAttribute("style"), "color: red; width: 20px;");
      p.style.removeProperty("color");
      assert.equal(p.getAttribute("style"), "width: 20px;");
      p.style.removeProperty("width");
      assert.equal(p.getAttribute("style"), "");
      p.style.cssText = "background-color: blue; z-index: 12;";
      assert.equal(2, p.style.length);
      assert.equal("blue", p.style.backgroundColor);
      assert.equal("12", p.style.zIndex);
      p.style.removeProperty("z-index");
      assert.equal(1, p.style.length);
      p.style.backgroundColor = "green";
      assert.equal("background-color: green;", p.style.cssText);
      assert.equal("background-color", p.style.item(0));
      t.done();
    });
  }, {
    async: true
  });

  specify("StyleShorthandProperties", (t) => {
    jsdom.env(
        "",
        function (err, win) {
      var p = win.document.createElement("p");
      p.style.border = "1px solid black";
      assert.equal(1, p.style.length);
      assert.equal("1px solid black", p.style.border);
      assert.equal("1px", p.style.borderWidth);
      assert.equal("solid", p.style.borderStyle);
      assert.equal("black", p.style.borderColor);
      assert.equal("border: 1px solid black;", p.style.cssText);
      assert.equal('<p style="border: 1px solid black;"></p>', p.outerHTML);
      t.done();
    });
  }, {
    async: true
  });

  specify("retainOriginalStyleAttributeUntilStyleGetter", (t) => {
    jsdom.env(
        "",
        function (err, win) {
          var document = win.document;
          var div = document.createElement("div");
          div.setAttribute("style", "font-weight: bold; font-weight: normal;");
          assert.equal(div.getAttribute("style"), "font-weight: bold; font-weight: normal;");
          div.innerHTML = "<div style=\"color: red; color: blue;\"></div>";
          assert.equal(div.innerHTML, "<div style=\"color: red; color: blue;\"></div>");
          assert.equal(div.firstChild.getAttribute("style"), "color: red; color: blue;");
          div.firstChild.style.color = "maroon";
          assert.equal(div.firstChild.getAttribute("style"), "color: maroon;");
          t.done();
        }
     );
  }, {
    async: true
  });

  specify("getComputedStyleFromDefaultStylesheet1", () => {
    // browsers have default stylesheets, see https://github.com/tmpvar/jsdom/issues/994
    var doc = jsdom.jsdom("<html><head></head><body><div></div></body></html>");
    var win = doc.defaultView;
    var div = doc.getElementsByTagName("div")[0];
    var cs = win.getComputedStyle(div);
    assert.equal(cs.display, "block", "computed display of div is block by default");
  });

  specify("getComputedStyleFromDefaultStylesheet2", () => {
    // browsers have default stylesheets, see https://github.com/tmpvar/jsdom/issues/994
    var doc = jsdom.jsdom("<html><head></head><body><ul></ul></body></html>");
    var win = doc.defaultView;
    var ul = doc.getElementsByTagName("ul")[0];
    var cs = win.getComputedStyle(ul);
    assert.equal(cs.display, "block", "computed display of ul is block by default");
  });

  specify("getComputedStyleFromDefaultStylesheet3", (t) => {
    // browsers have default stylesheets, see https://github.com/tmpvar/jsdom/issues/994
    var doc = jsdom.jsdom("<html><head><style>div{display:none}</style></head>" +
                          "<body><div></div></body></html>");
    var win = doc.defaultView;
    jsdom.jQueryify(win, "file:" + path.resolve(__dirname, "../../jquery-fixtures/jquery-1.11.0.js"),
                    function (window, jQuery) {
      var div = jQuery("div");
      var cs = win.getComputedStyle(div.get(0));
      assert.equal(cs.display, "none", "computed display of hidden should is none");
      div.show();
      cs = win.getComputedStyle(div.get(0));
      assert.equal(cs.display, "block", "computed display of shown div is block");
      t.done();
    });
  }, {
    async: true
  });

  specify("getComputedStyleInline", () => {
    var doc = jsdom.jsdom();
    var win = doc.defaultView;
    var style = doc.createElement("style");
    style.innerHTML = "p { display: none; }";
    doc.getElementsByTagName("head")[0].appendChild(style);
    var p = doc.createElement("p");
    doc.body.appendChild(p);
    p = doc.getElementsByTagName("p")[0];
    var cs = win.getComputedStyle(p);
    assert.equal(cs.display, "none", "computed display of p is none");
  });

  specify("getComputedStyleFromEmbeddedSheet1", () => {
    var doc = jsdom.jsdom(
      "<html><head><style>#id1 .clazz { margin-left: 100px; }</style></head><body>" +
      "<div id=\"id1\"><p class=\"clazz\"></p></div>" +
      "</body></html>");
    var win = doc.defaultView;
    var p = doc.getElementsByTagName("p")[0];
    var cs = win.getComputedStyle(p);
    assert.equal(cs.marginLeft, "100px", "computed marginLeft of p[0] is 100px");
  });

  specify("getComputedStyleFromEmbeddedSheet2", () => {
    // use grouping, see http://www.w3.org/TR/CSS2/selector.html#grouping
    var doc = jsdom.jsdom(
        "<html><head><style>#id1 .clazz, #id2 .clazz { margin-left: 100px; }</style></head><body>" +
        "<div id=\"id1\"><p class=\"clazz\"></p></div>" +
        "<div id=\"id2\"><p class=\"clazz\"></p></div>" +
        "</body></html>");
    var win = doc.defaultView;
    var p = doc.getElementsByTagName("p")[0];
    var cs = win.getComputedStyle(p);
    assert.equal(cs.marginLeft, "100px", "computed marginLeft of p[0] is 100px");

    p = doc.getElementsByTagName("p")[1];
    cs = win.getComputedStyle(p);
    assert.equal(cs.marginLeft, "100px", "computed marginLeft of p[1] is 100px");
  });

  specify("getComputedStyleFromEmbeddedSheet3", () => {
    // use grouping with embedded quotes and commas, see https://github.com/tmpvar/jsdom/pull/541#issuecomment-18114747
    var doc = jsdom.jsdom(
        "<html><head><style>#id1 .clazz, button[onclick=\"ga(this, event)\"], " +
        "#id2 .clazz { margin-left: 100px; }</style></head><body>" +
        "<div id=\"id1\"><p class=\"clazz\"></p></div>" +
        "<div id=\"id2\"><p class=\"clazz\"></p></div>" +
        "<button onclick=\"ga(this, event)\">analytics button</button>" +
        "</body></html>");
    var win = doc.defaultView;
    var p = doc.getElementsByTagName("p")[1];
    var cs = win.getComputedStyle(p);
    assert.equal(cs.marginLeft, "100px", "computed marginLeft of p[1] is 100px");

    var button = doc.getElementsByTagName("button")[0];
    cs = win.getComputedStyle(button);
    assert.equal(cs.marginLeft, "100px", "computed marginLeft of button[0] is 100px");
  });

  specify("ensureRelativeStylesheetFilesAreLoaded", (t) => {
    var server = http.createServer(function (req, res) {
      try {
        var content = String(fs.readFileSync(path.resolve(__dirname, "style", req.url.substring(1))));
        res.writeHead(200, {
          "Content-type": req.url.endsWith(".css") ? "text/css" : "text/html",
          "Content-length": content.length
        });
        res.end(content);
      } catch (exc) {
        res.writeHead(404, "not found");
        res.end();
      }
    });

    server.listen(10100);

    jsdom.env({
      url: "http://127.0.0.1:10100/relative_import.html",
      features: {
        FetchExternalResources: ["link"]
      },
      created: function (error, win) {
        jsdom.getVirtualConsole(win).on("error", function (message) {
          console.error(message);
          assert.ok(false, message);
        });
      },
      done: function (error, win) {
        setTimeout(function () { // HACK: style imports haven"t been processed yet, different bug
          var doc = win.document;
          var style = win.getComputedStyle(doc.body);
          assert.equal(style.color, "red", "computed color of body is red");
          server.close();
          t.done();
        }, 100);
      }
    });
  }, {
    async: true
  });

  specify("ensureExternalStylesheetsAreLoadable", (t) => {
    var css = "body { border: 1px solid #f0f; }";
    var server = http.createServer(function (req, res) {
      res.writeHead(200, {
        "Content-type": "text/css",
        "Content-length": css.length
      });
      res.end(css);
    });

    server.listen(10099);

    jsdom.env(path.resolve(__dirname, "style/external_css.html"), function (err, win) {
      assert.ifError(err);
      server.close();
      t.done();
    });
  }, {
    async: true
  });

  specify("getComputedStyleExternal", (t) => {
    var css = "div { color: red; }";
    var server = http.createServer(function (req, res) {
      res.writeHead(200, {
        "Content-type": "text/css",
        "Content-length": css.length
      });
      res.end(css);
    });

    server.listen(10099);

    var html = fs.readFileSync(path.resolve(__dirname, "style/getComputedStyleExternal.html"), "utf8");
    var doc = jsdom.jsdom(html);
    var win = doc.defaultView;
    doc.onload = function () {
      var div = doc.getElementsByTagName("div")[0];
      var style = win.getComputedStyle(div);
      assert.equal(style.color, "red", "computed color of div is red");
      server.close();
      t.done();
    };
  }, {
    async: true
  });

  specify("getComputedStyleWithBadSelectors", (t) => {
    jsdom.env(
        "",
        function (err, win) {
          var doc = win.document;
          var style = doc.createElement("style");
          style.innerHTML = ";p { display: none; }";
          doc.getElementsByTagName("head")[0].appendChild(style);
          var p = doc.createElement("p");
          doc.body.appendChild(p);
          p = doc.getElementsByTagName("p")[0];
          assert.doesNotThrow(function () {
            win.getComputedStyle(p);
          });
          t.done();
        }
    );
  }, {
    async: true
  });

  specify("getComputedStyleWithMediaRules", (t) => {
    jsdom.env(
        "<html><head><style>@media screen,handheld { .citation { color: blue; } } " +
        "@media print { .citation { color: red; } }</style></head>" +
        "<body><p class=\"citation\">Hello</p></body></html>",
        function (err, win) {
          var style = win.getComputedStyle(win.document.querySelector(".citation"));
          assert.equal(style.color, "blue", "computed color of p is blue");
          t.done();
        }
    );
  }, {
    async: true
  });

  specify("getComputedStyleWithKeyframeRules", (t) => {
    jsdom.env(
        "<html><head><style>@-webkit-keyframes breaking {}</style></head>" +
        "<body><p>Hello</p></body></html>",
        function (err, win) {
          assert.doesNotThrow(function () {
            win.getComputedStyle(win.document.querySelector("p"));
          });
          t.done();
        }
    );
  }, {
    async: true
  });

  specify("setStyleToInvalidCSSSyntax", () => {
    const node = jsdom.jsdom().createElement("div");

    const invalidStyles = [
      "color: red; }",
      "color: \"red",
      "color: red;' ",
      "color: red; /*",
      "color: attr(",
      "color: ",
      "color: /*red"
    ];

    invalidStyles.forEach(function (style) {
      node.setAttribute("style", "color: red");
      assert.doesNotThrow(function () {
        node.setAttribute("style", style);
      });
      assert.strictEqual(node.getAttribute("style"), style);
      assert.strictEqual(node.style.color, "");
      assert.strictEqual(node.style.cssText, "");

      node.style.cssText = "color: red";
      assert.doesNotThrow(function () {
        node.style.cssText = style;
      });
      assert.strictEqual(node.style.color, "");
      assert.strictEqual(node.style.cssText, "");
    });

  });

  specify("getStyleSheetByItem", (t) => {
    jsdom.env(
        "<html><head><style>p{color:red}</style><style>div{color:green}</style></head><body>",
        function (err, win) {
          var sheets = win.document.styleSheets;
          assert.equal(2, sheets.length);
          assert.equal(sheets[0], sheets.item(0));
          assert.equal(sheets[1], sheets.item(1));
          assert.equal("red", sheets.item(0).cssRules[0].style.color);
          assert.equal("green", sheets.item(1).cssRules[0].style.color);
          t.done();
        });
  }, {
    async: true
  });

  specify("parseStyleWithBogusComment", () => {
    // https://github.com/tmpvar/jsdom/issues/1214
    const document = jsdom.jsdom(`<style>.block-title .block-title-inner a:visited { color: #48484d; } // MAIN MENU - (used to keep mobile menu options hidden and keep weather/search and menu on one line) // #tncms-region-nav-main-nav-right-nav { float:left; }</style>`);
    const window = document.defaultView;

    // Should not hang forever
    window.getComputedStyle(document.body);
  });

  specify("padding and margin component properties work correctly (GH-1353)", () => {
    const document = jsdom.jsdom();

    for (const prop of ["padding", "margin"]) {
      document.body.style[prop] = "1px 2px 3px 4px";

      assert.strictEqual(document.body.style[prop], "1px 2px 3px 4px");
      assert.strictEqual(document.body.style[prop + "Top"], "1px");
      assert.strictEqual(document.body.style[prop + "Right"], "2px");
      assert.strictEqual(document.body.style[prop + "Bottom"], "3px");
      assert.strictEqual(document.body.style[prop + "Left"], "4px");

      document.body.style[prop + "Top"] = "1em";
      document.body.style[prop + "Right"] = "2em";
      document.body.style[prop + "Bottom"] = "3em";
      document.body.style[prop + "Left"] = "4em";
      assert.strictEqual(document.body.style[prop], "1em 2em 3em 4em");

      document.body.style[prop] = "1mm";
      assert.strictEqual(document.body.style[prop], "1mm");
      assert.strictEqual(document.body.style[prop + "Top"], "1mm");
      assert.strictEqual(document.body.style[prop + "Right"], "1mm");
      assert.strictEqual(document.body.style[prop + "Bottom"], "1mm");
      assert.strictEqual(document.body.style[prop + "Left"], "1mm");

      document.body.style[prop] = "1% 2%";
      assert.strictEqual(document.body.style[prop], "1% 2%");
      assert.strictEqual(document.body.style[prop + "Top"], "1%");
      assert.strictEqual(document.body.style[prop + "Right"], "2%");
      assert.strictEqual(document.body.style[prop + "Bottom"], "1%");
      assert.strictEqual(document.body.style[prop + "Left"], "2%");

      document.body.style[prop] = "3pc 2pc 1pc";
      assert.strictEqual(document.body.style[prop], "3pc 2pc 1pc");
      assert.strictEqual(document.body.style[prop + "Top"], "3pc");
      assert.strictEqual(document.body.style[prop + "Right"], "2pc");
      assert.strictEqual(document.body.style[prop + "Bottom"], "1pc");
      assert.strictEqual(document.body.style[prop + "Left"], "2pc");
    }
  });

  specify("StyleSheetList.prototype.item returns null on index out of bounds", () => {
    const document = jsdom.jsdom();
    assert.strictEqual(document.styleSheets[0], undefined);
    assert.strictEqual(document.styleSheets.item(0), null);
  });

  specify("setting background to null works correctly (GH-1499)", () => {
    const document = jsdom.jsdom();
    document.body.innerHTML = `<div id="ctrl" style="background:#111;border:1px"></div>`;

    const div = document.body.firstChild;
    div.style.background = null;

    assert.strictEqual(div.style.background, "");
  });

  specify("setting width to auto works correctly (GH-1458)", () => {
    const document = jsdom.jsdom();

    document.body.style.width = "auto";

    assert.strictEqual(document.body.style.width, "auto");
    assert.strictEqual(document.body.style.cssText, "width: auto;");
  });
});
