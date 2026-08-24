"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  // Setting time to zero keeps fixture setup for the first-read cases from making the suite excessively slow.
  const bench = new Bench({ time: 0, warmupTime: 0 });

  function createElements(document, count, classEvery, attributeCount = 0) {
    const root = document.createElement("main");
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; ++i) {
      const element = document.createElement("div");
      if (classEvery !== 0 && i % classEvery === 0) {
        element.className = "item target";
      }
      for (let j = 0; j < attributeCount; ++j) {
        element.setAttribute(`data-${j}`, `${j}`);
      }
      fragment.append(element);
    }

    root.append(fragment);
    return root;
  }

  function addFirstReadTask(name, classEvery) {
    const { document } = (new JSDOM()).window;
    let root;

    bench.add(name, () => root.getElementsByClassName("target").length, {
      beforeEach() {
        root = createElements(document, 1000, classEvery);
      }
    });
  }

  function addLiveRefreshTask(name, classEvery, attributeCount = 0) {
    const { document } = (new JSDOM()).window;
    const root = createElements(document, 5000, classEvery, attributeCount);
    const collection = root.getElementsByClassName("target");
    collection.item(0);

    bench.add(name, () => {
      root.toggleAttribute("data-mutated");
      return collection.length;
    });
  }

  addFirstReadTask("first read: 0/1000 elements have classes", 0);
  addFirstReadTask("first read: 100/1000 elements have classes", 10);
  addFirstReadTask("first read: 1000/1000 elements have classes", 1);
  addLiveRefreshTask("live refresh: 500/5000 elements have classes", 10);
  addLiveRefreshTask("live refresh: 0/5000 elements have classes and 10 other attributes", 0, 10);

  return bench;
};
