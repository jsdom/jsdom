"use strict";

const assert = require("node:assert/strict");
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  for (const count of [100, 10000]) {
    for (const [selector, expected] of [
      [":has(span)", true],
      [":has(SPAN + FINAL)", true],
      [":has(nonexistent + span)", false],
      [":has(div div span)", false],
      [":has(> div > final)", true],
      [":has(+ aside)", true],
      [":has(~ footer)", true],
    ]) {
      let window, main;
      bench.add(`${selector} (${count} descendants)`, () => main.matches(selector), {
        beforeAll() {
          ({ window } = new JSDOM(
            `<main><div>${"<span></span>".repeat(count)}<final></final></div></main>` +
              "<!-- sibling gap --><aside></aside><footer></footer>",
          ));
          main = window.document.querySelector("main");
          assert.equal(main.matches(selector), expected);
        },
        afterAll() {
          window.close();
        },
      });
    }
  }

  for (const contentType of ["text/html", "application/xhtml+xml"]) {
    let window, element, revision;
    bench.add(
      `parse and match a new type selector (${contentType})`,
      () => element.matches(`SPAN[data-revision="${++revision}"]`),
      {
        beforeAll() {
          ({ window } = new JSDOM('<span xmlns="http://www.w3.org/1999/xhtml"/>', {
            contentType,
          }));
          element = window.document.querySelector("span");
          assert.equal(element.matches("SPAN"), contentType === "text/html");
          revision = 0;
        },
        afterAll() {
          window.close();
        },
      },
    );
  }

  // The DOM mutations and seven style reads from the `has-complexity.html` WPT.
  let window, container, subject;
  function complexityWorkload() {
    const { document } = window;
    const colors = [];
    function readColor() {
      colors.push(window.getComputedStyle(subject).color);
    }
    function appendSpans(parent, count) {
      for (let i = 0; i < count; ++i) {
        parent.appendChild(document.createElement("span"));
      }
    }

    appendSpans(container, 1);
    readColor();
    appendSpans(container, 25000);
    readColor();
    appendSpans(container, 24999);
    container.appendChild(document.createElement("final"));
    readColor();
    const div = document.createElement("div");
    appendSpans(div, 25000);
    container.appendChild(div);
    readColor();
    div.remove();
    readColor();
    for (let i = 0; i < 25000; ++i) {
      container.lastChild.remove();
    }
    readColor();
    container.replaceChildren();
    readColor();
    return colors;
  }

  bench.add("has-complexity mutations and computed styles (75000 elements)", complexityWorkload, {
    beforeAll() {
      ({ window } = new JSDOM(`<!doctype html><style>
        div, main { color: grey }
        main:has(span) .subject { color: red }
        main:has(span + span) .subject { color: green }
        main:has(span + final) .subject { color: blue }
        main:has(nonexistent + span) .subject { color: black }
        main:has(span) span { color: black }
        main:has(nonexistent) span { color: black }
        main:has(div div span) .subject { color: purple }
      </style><main><div></div><div class="subject"></div></main>`));
      container = window.document.querySelector("main > div");
      subject = container.nextElementSibling;
      assert.deepEqual(complexityWorkload(), [
        "rgb(255, 0, 0)",
        "rgb(0, 128, 0)",
        "rgb(0, 0, 255)",
        "rgb(128, 0, 128)",
        "rgb(0, 0, 255)",
        "rgb(0, 128, 0)",
        "rgb(128, 128, 128)",
      ]);
    },
    afterAll() {
      window.close();
    },
  });

  return bench;
};
