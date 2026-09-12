"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();
  const element = document.createElement("div");
  element.innerHTML = '<label class="field"><span>Name</span><input value="initial"></label>'.repeat(100);

  const deep = document.createElement("div");
  let parent = deep;
  for (let i = 0; i < 100; ++i) {
    parent = parent.appendChild(document.createElement("div"));
  }

  const template = document.createElement("template");
  template.content.append(element.cloneNode(true));
  const otherDocument = document.implementation.createHTMLDocument("");

  bench.add("cloneNode: shallow element", () => {
    element.cloneNode(false);
  });

  bench.add("cloneNode: 100-field subtree", () => {
    element.cloneNode(true);
  });

  bench.add("cloneNode: 100-deep subtree", () => {
    deep.cloneNode(true);
  });

  bench.add("cloneNode: template contents", () => {
    template.cloneNode(true);
  });

  bench.add("importNode: 100-field subtree", () => {
    otherDocument.importNode(element, true);
  });

  bench.add("adoptNode: 100-field subtree round trip", () => {
    otherDocument.adoptNode(element);
    document.adoptNode(element);
  });

  return bench;
};
