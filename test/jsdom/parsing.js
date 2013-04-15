"use strict";

var jsdom = require("../..").jsdom;

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.

exports["unclosed <td> (GH-605)"] = function (t) {
  var doc = jsdom("<table><tr><td>first td<td>second td</tr></table>");

  var tds = doc.getElementsByTagName("td");

  t.equal(tds.length, 2);
  t.equal(tds[0].innerHTML, 'first td');
  t.equal(tds[1].innerHTML, 'second td');

  t.done();
};

exports["multiline attributes (GH-585)"] = function (t) {
  var doc = jsdom("<a data-title='<strong>hello \nworld</strong>' href='example.org</strong>'>link</a>");

  var as = doc.getElementsByTagName("a");

  t.equal(as.length, 1);
  t.equal(as[0].innerHTML, "link");
  t.equal(as[0].getAttribute("data-title"), "<strong>hello \nworld</strong>");
  t.equal(as[0].getAttribute("href"), "example.org</strong>");

  t.done();
};

exports["innerHTML of <script type='text/html'> (GH-575)"] = function (t) {
  var doc = jsdom("<script type='text/html'>script innerHTML</script>");

  var scripts = doc.getElementsByTagName("script");

  t.equal(scripts.length, 1);
  t.equal(scripts[0].innerHTML, "script innerHTML");

  t.done();
};

exports["attributes containing '<' and '>' (GH-494)"] = function (t) {
  var doc = jsdom("<p title='<'>stuff</p><p title='>'>more</p><p>just testing</p>");

  var ps = doc.getElementsByTagName("p");

  t.equal(ps.length, 3);
  t.equal(ps[0].getAttribute("title"), "<");
  t.equal(ps[1].getAttribute("title"), ">");

  t.done();
};

exports["empty attributes (GH-488)"] = function (t) {
  var doc = jsdom("<div ng-app></div>");

  var divs = doc.getElementsByTagName("div");

  t.equal(divs.length, 1);
  t.equal(divs[0].getAttribute("ng-app"), "");

  t.done();
};

exports["omitting optional closing tags (GH-482)"] = function (t) {
  var doc = jsdom("<p>First<p>Second<p>Third");

  var ps = doc.getElementsByTagName("p");

  t.equal(ps.length, 3);
  t.equal(ps[0].innerHTML, "First");
  t.equal(ps[1].innerHTML, "Second");
  t.equal(ps[2].innerHTML, "Third");

  t.done();
};
