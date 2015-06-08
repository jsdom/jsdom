"use strict";
const jsdom = require("../..").jsdom;

// Tests for node.cloneNode
// Spec: https://dom.spec.whatwg.org/#dom-node-clonenodedeep

exports["Should be able to clone elements with strange names containing colons"] = function (t) {
  // https://github.com/tmpvar/jsdom/issues/1142#issuecomment-108122608
  const doc = jsdom("KSL.com <http://KSL.com> has not verified the accuracy of the information provided with");

  // Parses as <http: ksl.com=""> has not verified ...</http:>

  let clone;
  t.doesNotThrow(function () {
    clone = doc.body.cloneNode(true);
  });

  t.equal(doc.body.outerHTML, clone.outerHTML);

  t.done();
};

exports["Should be able to clone elements with strange names containing angle brackets"] = function (t) {
  // https://github.com/tmpvar/jsdom/issues/1142#issuecomment-108122608
  const doc = jsdom("<p>Blah blah blah<p><Home-Schooling</b><p><p>In talking with parents who home-school");

  // Parses as <home-schooling< b=""></home-schooling>

  let clone;
  t.doesNotThrow(function () {
    clone = doc.body.cloneNode(true);
  });

  t.equal(doc.body.outerHTML, clone.outerHTML);

  t.done();
};
