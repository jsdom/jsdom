var jsdom = require('../../lib/jsdom');
var assert = require('assert');
var http = require('http');
var fs = require('fs');
exports.tests = {

  HTMLStyleElement01 : function (test) {
    jsdom.env(
        '<html><head><style>p{color:red}</style></head><body>',
        jsdom.defaultLevel, function(err, win) {
      var style = win.document.head.lastChild;
      test.equal(1, style.sheet.cssRules.length);
      test.equal('p', style.sheet.cssRules[0].selectorText);
      test.equal('red', style.sheet.cssRules[0].style.color);
      test.done();
    });
  },

  HTMLStyleAttribute01 : function (test) {
    jsdom.env(
        '<html><body><p style="color:red">',
        jsdom.defaultLevel, function(err, win) {
      var p = win.document.body.lastChild;
      test.equal(1, p.style.length);
      test.equal('color', p.style[0]);
      test.equal('red', p.style.color);
      test.done();
    });
  },

  StylePropertyReflectsStyleAttribute : function (test) {
    jsdom.env(
        '<html>',
        jsdom.defaultLevel, function(err, win) {
      var p = win.document.createElement('p');
      p.setAttribute('style', 'color:red');
      test.equal(1, p.style.length);
      test.equal('color', p.style[0]);
      test.equal('red', p.style.color);
      p.setAttribute('style', '');
      test.equal(0, p.style.length);
      test.equal('', p.style.color);
      p.setAttribute('style', 'color:blue');
      test.equal('color', p.style[0]);
      test.equal('blue', p.style.color);
      test.done();
    });
  },

  StyleAttributeReflectsStyleProperty : function (test) {
    jsdom.env(
        '<html>',
        jsdom.defaultLevel, function(err, win) {
      var p = win.document.createElement('p');
      p.style.setProperty('color', 'red');
      test.equal(p.getAttribute('style'), 'color: red;');
      p.style.setProperty('width', '20px');
      test.equal(p.getAttribute('style'), 'color: red; width: 20px;');
      p.style.removeProperty('color');
      test.equal(p.getAttribute('style'), 'width: 20px;');
      p.style.removeProperty('width');
      test.equal(p.getAttribute('style'), '');
      test.done();
    });
  },

  ensure_external_stylesheets_are_loadable : function(test) {
    var css = "body { border: 1px solid #f0f; }";
    var server = http.createServer(function(req, res) {
      req.writeHead(200, {
        'Content-type' : 'text/css',
        'Content-length' : css.length
      });
      req.end(css);
    });

    server.listen(10099);

    jsdom.env(__dirname + '/style/external_css.html', function(e, w) {
      test.equal(w.document.errors, null);
      server.close();
      test.done();
    });
  }
}
