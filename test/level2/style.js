"use strict";

var jsdom = require("../../lib/jsdom");
var http = require("http");
var fs = require("fs");
var path = require("path");

exports.tests = {

  HTMLStyleElement01: function (test) {
    jsdom.env(
        "<html><head><style>p{color:red}</style></head><body>",
        function (err, win) {
      var style = win.document.head.lastChild;
      test.equal(1, style.sheet.cssRules.length);
      test.equal("p", style.sheet.cssRules[0].selectorText);
      test.equal("red", style.sheet.cssRules[0].style.color);
      test.done();
    });
  },

  HTMLStyleElement02: function(test) {
    var pageHTML = '<!doctype html><html><head>' +
        '<style>p { color: green; }</style><style>div { color: red; }</style>' +
        '</head><body></body></html>';
    var removeScript = "var style2 = document.getElementsByTagName('style')[1]; " +
        "style2.parentNode.removeChild(style2);";
    jsdom.env({
      html: pageHTML,
      src: removeScript,
      done: function(err, window) {
        test.ifError(err);
        test.equal(1, window.document.getElementsByTagName("style").length);
        test.equal(1, window.document.styleSheets.length);
        test.done();
      }
    });
  },

  HTMLStyleAttribute01: function (test) {
    jsdom.env(
        "<html><body><p style=\"color:red; background-color: blue\">",
        function (err, win) {
      var p = win.document.body.lastChild;
      test.equal(2, p.style.length);
      test.equal("color", p.style[0]);
      test.equal("red", p.style.color);
      test.equal("background-color", p.style[1]);
      test.equal("blue", p.style.backgroundColor);
      test.done();
    });
  },

  HTMLCanvasStyleAttribute01: function (test) {
    jsdom.env(
        "<html><body><canvas style=\"background-color: blue; z-index:1\">",
        function (err, win) {
      var c = win.document.body.lastChild;
      test.equal(2, c.style.length);
      test.equal("background-color", c.style[0]);
      test.equal("blue", c.style.backgroundColor);
      test.equal("z-index", c.style[1]);
      test.equal(1, c.style.zIndex);
      test.done();
    });
  },

  StylePropertyReflectsStyleAttribute: function (test) {
    jsdom.env(
        "",
        function (err, win) {
      var p = win.document.createElement("p");
      p.setAttribute("style", "color:red");
      test.equal(1, p.style.length);
      test.equal("color", p.style[0]);
      test.equal("red", p.style.color);
      p.setAttribute("style", "");
      test.equal(0, p.style.length);
      test.equal("", p.style.color);
      p.setAttribute("style", "color:blue");
      test.equal("color", p.style[0]);
      test.equal("blue", p.style.color);
      test.done();
    });
  },

  StyleAttributeReflectsStyleProperty: function (test) {
    jsdom.env(
        "",
        function (err, win) {
      var p = win.document.createElement("p");
      p.style.setProperty("color", "red");
      test.equal(p.getAttribute("style"), "color: red;");
      p.style.setProperty("width", "20px");
      test.equal(p.getAttribute("style"), "color: red; width: 20px;");
      p.style.removeProperty("color");
      test.equal(p.getAttribute("style"), "width: 20px;");
      p.style.removeProperty("width");
      test.equal(p.getAttribute("style"), "");
      p.style.cssText = "background-color: blue; z-index: 12;";
      test.equal(2, p.style.length);
      test.equal("blue", p.style.backgroundColor);
      test.equal("12", p.style.zIndex);
      p.style.removeProperty("z-index");
      test.equal(1, p.style.length);
      p.style.backgroundColor = "green";
      test.equal("background-color: green;", p.style.cssText);
      test.equal("background-color", p.style.item(0));
      test.done();
    });
  },

  retainOriginalStyleAttributeUntilStyleGetter: function (test) {
    jsdom.env(
        "",
        function (err, win) {
          var document = win.document;
          var div = document.createElement("div");
          div.setAttribute("style", "font-weight: bold; font-weight: normal;");
          test.equal(div.getAttribute("style"), "font-weight: bold; font-weight: normal;");
          div.innerHTML = "<div style=\"color: red; color: blue;\"></div>";
          test.equal(div.innerHTML, "<div style=\"color: red; color: blue;\"></div>");
          test.equal(div.firstChild.getAttribute("style"), "color: red; color: blue;");
          div.firstChild.style.color = "maroon";
          test.equal(div.firstChild.getAttribute("style"), "color: maroon;");
          test.done();
        }
     );
  },

  getComputedStyleFromDefaultStylesheet1: function (test) {
    // browsers have default stylesheets, see https://github.com/tmpvar/jsdom/issues/994
    var doc = jsdom.jsdom("<html><head></head><body><div></div></body></html>");
    var win = doc.defaultView;
    var div = doc.getElementsByTagName("div")[0];
    var cs = win.getComputedStyle(div);
    test.equal(cs.display, "block", "computed display of div is block by default");
    test.done();
  },

  getComputedStyleFromDefaultStylesheet2: function (test) {
    // browsers have default stylesheets, see https://github.com/tmpvar/jsdom/issues/994
    var doc = jsdom.jsdom("<html><head></head><body><ul></ul></body></html>");
    var win = doc.defaultView;
    var ul = doc.getElementsByTagName("ul")[0];
    var cs = win.getComputedStyle(ul);
    test.equal(cs.display, "block", "computed display of ul is block by default");
    test.done();
  },

  getComputedStyleFromDefaultStylesheet3: function (test) {
    // browsers have default stylesheets, see https://github.com/tmpvar/jsdom/issues/994
    var doc = jsdom.jsdom("<html><head><style>div{display:none}</style></head>" +
                          "<body><div></div></body></html>");
    var win = doc.defaultView;
    jsdom.jQueryify(win, "file:" + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"),
                    function (window, jQuery) {
      var div = jQuery("div");
      var cs = win.getComputedStyle(div.get(0));
      test.equal(cs.display, "none", "computed display of hidden should is none");
      div.show();
      cs = win.getComputedStyle(div.get(0));
      test.equal(cs.display, "block", "computed display of shown div is block");
      test.done();
    });
  },

  getComputedStyleInline: function (test) {
    var doc = jsdom.jsdom();
    var win = doc.defaultView;
    var style = doc.createElement("style");
    style.innerHTML = "p { display: none; }";
    doc.getElementsByTagName("head")[0].appendChild(style);
    var p = doc.createElement("p");
    doc.body.appendChild(p);
    p = doc.getElementsByTagName("p")[0];
    var cs = win.getComputedStyle(p);
    test.equal(cs.display, "none", "computed display of p is none");
    test.done();
  },

  getComputedStyleFromEmbeddedSheet1: function (test) {
    var doc = jsdom.jsdom(
      "<html><head><style>#id1 .clazz { margin-left: 100px; }</style></head><body>" +
      "<div id=\"id1\"><p class=\"clazz\"></p></div>" +
      "</body></html>");
    var win = doc.defaultView;
    var p = doc.getElementsByTagName("p")[0];
    var cs = win.getComputedStyle(p);
    test.equal(cs.marginLeft, "100px", "computed marginLeft of p[0] is 100px");
    test.done();
  },

  getComputedStyleFromEmbeddedSheet2: function (test) {
    // use grouping, see http://www.w3.org/TR/CSS2/selector.html#grouping
    var doc = jsdom.jsdom(
        "<html><head><style>#id1 .clazz, #id2 .clazz { margin-left: 100px; }</style></head><body>" +
        "<div id=\"id1\"><p class=\"clazz\"></p></div>" +
        "<div id=\"id2\"><p class=\"clazz\"></p></div>" +
        "</body></html>");
    var win = doc.defaultView;
    var p = doc.getElementsByTagName("p")[0];
    var cs = win.getComputedStyle(p);
    test.equal(cs.marginLeft, "100px", "computed marginLeft of p[0] is 100px");

    p = doc.getElementsByTagName("p")[1];
    cs = win.getComputedStyle(p);
    test.equal(cs.marginLeft, "100px", "computed marginLeft of p[1] is 100px");
    test.done();
  },

  getComputedStyleFromEmbeddedSheet3: function (test) {
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
    test.equal(cs.marginLeft, "100px", "computed marginLeft of p[1] is 100px");

    var button = doc.getElementsByTagName("button")[0];
    cs = win.getComputedStyle(button);
    test.equal(cs.marginLeft, "100px", "computed marginLeft of button[0] is 100px");
    test.done();
  },

  ensureRelativeStylesheetFilesAreLoaded: function (test) {
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
          test.ok(false, message);
        });
      },
      done: function (error, win) {
        setTimeout(function () { // HACK: style imports haven"t been processed yet, different bug
          var doc = win.document;
          var style = win.getComputedStyle(doc.body);
          test.equal(style.color, "red", "computed color of body is red");
          server.close();
          test.done();
        }, 100);
      }
    });
  },

  ensureExternalStylesheetsAreLoadable: function (test) {
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
      test.ifError(err);
      server.close();
      test.done();
    });
  },

  getComputedStyleExternal: function (test) {
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
      test.equal(style.color, "red", "computed color of div is red");
      server.close();
      test.done();
    };
  },

  getComputedStyleWithBadSelectors: function (test) {
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
          test.doesNotThrow(function () {
            win.getComputedStyle(p);
          });
          test.done();
        }
    );
  },

  getComputedStyleWithMediaRules: function (test) {
    jsdom.env(
        "<html><head><style>@media screen,handheld { .citation { color: blue; } } " +
        "@media print { .citation { color: red; } }</style></head>" +
        "<body><p class=\"citation\">Hello</p></body></html>",
        function (err, win) {
          var style = win.getComputedStyle(win.document.querySelector(".citation"));
          test.equal(style.color, "blue", "computed color of p is blue");
          test.done();
        }
    );
  },

  getComputedStyleWithKeyframeRules: function (test) {
    jsdom.env(
        "<html><head><style>@-webkit-keyframes breaking {}</style></head>" +
        "<body><p>Hello</p></body></html>",
        function (err, win) {
          test.doesNotThrow(function () {
            win.getComputedStyle(win.document.querySelector("p"));
          });
          test.done();
        }
    );
  },

  setStyleToInvalidCSSSyntax: function (test) {
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
      test.doesNotThrow(function () {
        node.setAttribute("style", style);
      });
      test.strictEqual(node.getAttribute("style"), style);
      test.strictEqual(node.style.color, "");
      test.strictEqual(node.style.cssText, "");

      node.style.cssText = "color: red";
      test.doesNotThrow(function () {
        node.style.cssText = style;
      });
      test.strictEqual(node.style.color, "");
      test.strictEqual(node.style.cssText, "");
    });

    test.done();
  },

  getStyleSheetByItem: function (test) {
    jsdom.env(
        "<html><head><style>p{color:red}</style><style>div{color:green}</style></head><body>",
        function (err, win) {
          var sheets = win.document.styleSheets;
          test.equal(2, sheets.length);
          test.equal(sheets[0], sheets.item(0));
          test.equal(sheets[1], sheets.item(1));
          test.equal("red", sheets.item(0).cssRules[0].style.color);
          test.equal("green", sheets.item(1).cssRules[0].style.color);
          test.done();
        });
  },

  parseStyleWithBogusComment(t) {
    // https://github.com/tmpvar/jsdom/issues/1214
    const document = jsdom.jsdom(`<style>.block-title .block-title-inner a:visited { color: #48484d; } // MAIN MENU - (used to keep mobile menu options hidden and keep weather/search and menu on one line) // #tncms-region-nav-main-nav-right-nav { float:left; }</style>`);
    const window = document.defaultView;

    // Should not hang forever
    window.getComputedStyle(document.body);

    t.done();
  }
};
