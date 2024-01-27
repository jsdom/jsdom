"use strict";
const suite = require("../document-suite");

exports["getComputedStyle() on document.body"] = () => {
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

exports["getComputedStyle() on element with rgb color"] = () => {
  let window, node;

  return suite({
    setup(doc) {
      window = doc.defaultView;
      node = doc.createElement("div");
      node.style.color = "rgb(128, 0, 128)";
      doc.body.appendChild(node);
    },
    fn() {
      window.getComputedStyle(node);
    }
  });
};

exports["getComputedStyle() on element with non-rgb color"] = () => {
  let window, node;

  return suite({
    setup(doc) {
      window = doc.defaultView;
      node = doc.createElement("div");
      node.style.color = "color-mix(in srgb, red, blue)";
      doc.body.appendChild(node);
    },
    fn() {
      window.getComputedStyle(node);
    }
  });
};
