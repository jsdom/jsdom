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
