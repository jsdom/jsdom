"use strict";
const suite = require("../document-suite");

exports.getComputedStyle = () => {
  let window, document;

  return suite({
    setup(doc) {
      window = doc.defaultView;
      document = doc;
    },
    fn() {
      window.getComputedStyle(document.body);
    }
  });
};
