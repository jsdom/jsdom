"use strict";

var jsdom = require("../..");
var fs = require('fs');

exports["should recognize svg and not wrap in <body> (GH-779)"] = function (t) {
  var window = jsdom.env({
    html: fs.readFileSync(__dirname + '/files/svg.svg'),
    done: function (errs, window) {
      t.ok(window.document.outerHTML.indexOf('<body>') === -1, 'should not contain body');
      window.close();
      t.done();
    }
  });
};


exports["should allow inserting scripts into svg"] = function (t) {
  var window = jsdom.env({
    html: fs.readFileSync(__dirname + '/files/svg.svg'),
    scripts: [__dirname + '/../jquery-fixtures/jquery-1.11.0.js'],
    done: function (errs, window) {
      t.ifError(errs);

      t.notEqual(window.$, undefined, 'should load jQuery');
      window.close();
      t.done();
    }
  });
};
