"use strict";
const fs = require("fs");
const jsdom = require("../..");
const toFileUrl = require("../util").toFileUrl(__dirname);

exports["Getting a file URL should work (from the same file URL)"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1180
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.strictEqual(xhr.responseText, fs.readFileSync(__filename, { encoding: "utf-8" }));
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Getting a file URL should have valid default response without setting responseType"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1183
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.strictEqual(xhr.response, fs.readFileSync(__filename, { encoding: "utf-8" }));
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Getting a file URL should not throw for getResponseHeader"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1180
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.doesNotThrow(function () {
      t.strictEqual(xhr.getResponseHeader("Blahblahblah"), null);
    });
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Getting a file URL should not throw for getAllResponseHeaders"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1183
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.doesNotThrow(function () {
      t.strictEqual(xhr.getAllResponseHeaders(), null);
    });
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};
