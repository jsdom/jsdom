"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  bench.add("createElement", () => {
    document.createElement("div");
  });

  bench.add("createTextNode", () => {
    document.createTextNode("foo");
  });

  bench.add("createComment", () => {
    document.createComment("foo");
  });

  bench.add("createDocumentFragment", () => {
    document.createDocumentFragment("foo");
  });

  bench.add("createNodeIterator", () => {
    document.createNodeIterator(document.documentElement);
  });

  bench.add("createEvent", () => {
    document.createEvent("Event");
  });

  bench.add("createProcessingInstruction", () => {
    document.createProcessingInstruction("php", "echo 123; ?");
  });

  return bench;
};
