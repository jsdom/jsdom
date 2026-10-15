"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();
  const window = document.defaultView;
  let element;

  bench.add("inherited border longhand", () => {
    return window.getComputedStyle(element).borderLeftWidth;
  }, {
    beforeEach() {
      document.body.innerHTML = `
        <div style="border: 2px solid red">
          <div style="border-left-width: inherit; border-left-style: solid"></div>
        </div>
      `;
      element = document.body.firstElementChild.firstElementChild;
    }
  });

  bench.add("inherited background longhand", () => {
    return window.getComputedStyle(element).backgroundPositionX;
  }, {
    beforeEach() {
      document.body.innerHTML = `
        <div style="font-size: 20px; background: red 1em 2em / cover no-repeat">
          <div style="background-position-x: inherit"></div>
        </div>
      `;
      element = document.body.firstElementChild.firstElementChild;
    }
  });

  bench.add("cold shorthand reads", () => {
    const computed = window.getComputedStyle(element);
    return [computed.border, computed.background, computed.font, computed.margin, computed.flex];
  }, {
    beforeEach() {
      document.body.innerHTML = `
        <div style="border: 2px solid red; background: blue 1em 2em / cover no-repeat;
                    font: italic 20px / 30px serif; margin: 1em 2em; flex: 1 2 3em"></div>
      `;
      element = document.body.firstElementChild;
    }
  });

  return bench;
};
