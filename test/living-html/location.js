"use strict";
const jsdom = require("../..");

exports["window.location and document.location should be equal"] = t => {
  const window = jsdom.jsdom().defaultView;

  t.strictEqual(window.document.location, window.location);
  t.done();
};

exports["window.location.href for a default window is about:blank"] = t => {
  const window = jsdom.jsdom().defaultView;

  t.equal(window.location.href, "about:blank");
  t.done();
};

exports["window.location.port for an about:blank window"] = t => {
  const window = jsdom.jsdom().defaultView;

  t.equal(window.location.port, "");
  t.done();
};

exports["window.location.hash is manipulable"] = t => {
  const window = jsdom.jsdom("", {
    url: "http://www.example.com"
  }).defaultView;
  const defaultHref = window.location.href;

  t.equals(window.location.hash, "");

  window.location.href += "#foobar";
  t.equals(window.location.hash, "#foobar");

  window.location.hash = "#baz";
  t.equals(window.location.hash, "#baz");
  t.equals(window.location.href, defaultHref + "#baz");

  t.done();
};

exports["window.location.search is manipulable"] = t => {
  const window = jsdom.jsdom("", {
    url: "http://www.example.com"
  }).defaultView;
  const defaultSearch = window.location.search;

  t.equals(window.location.search, "");

  window.location.search += "?foo=bar";
  t.equals(window.location.search, "?foo=bar");

  window.location.search = "?baz=qux";
  t.equals(window.location.search, "?baz=qux");
  t.equals(window.location.search, defaultSearch + "?baz=qux");

  t.done();
};

exports["window.location.search can be set without messing up the location's hash"] = t => {
  const window = jsdom.jsdom("", {
    url: "http://www.example.com"
  }).defaultView;

  window.location.href += "#foo";
  window.location.search = "?foo=bar";
  t.equals(window.location.href.split("?")[1], "foo=bar#foo");

  window.location.search = "";
  t.equals(window.location.href.indexOf("?"), -1);

  t.done();
};

exports["when changing window.location.href by adding a hash, should fire a hashchange event"] = t => {
  const window = jsdom.jsdom("", {
    url: "http://www.example.com"
  }).defaultView;
  window.addEventListener("hashchange", () => {
    t.ok(true, "hashchange event was fired");
    t.done();
  });

  window.location.href += "#foo";
};

exports["when changing window.location.hash directly, should fire a hashchange event"] = t => {
  const window = jsdom.jsdom("", {
    url: "http://www.example.com"
  }).defaultView;
  window.addEventListener("hashchange", () => {
    t.ok(true, "hashchange event was fired");
    t.done();
  });

  window.location.hash = "#foo";
};

exports["window.location components are correct"] = t => {
  const window = jsdom.jsdom("", {
    url: "http://www.example.com:1234/path/to/foo.txt?blahblah#hash"
  }).defaultView;

  t.strictEqual(window.location.href, "http://www.example.com:1234/path/to/foo.txt?blahblah#hash");
  t.strictEqual(window.location.origin, "http://www.example.com:1234");
  t.strictEqual(window.location.protocol, "http:");
  t.strictEqual(window.location.host, "www.example.com:1234");
  t.strictEqual(window.location.hostname, "www.example.com");
  t.strictEqual(window.location.port, "1234");
  t.strictEqual(window.location.pathname, "/path/to/foo.txt");
  t.strictEqual(window.location.search, "?blahblah");
  t.strictEqual(window.location.hash, "#hash");
  t.done();
};
