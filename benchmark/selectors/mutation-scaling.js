"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  for (const count of [100, 1000, 10000]) {
    let window, parent, version;
    const options = {
      beforeAll() {
        ({ window } = new JSDOM());
        parent = window.document.createElement("main");
        parent.innerHTML = "<div class=item><span></span></div>".repeat(count);
        window.document.body.append(parent);
        version = 0;
      },
      afterAll() {
        window.close();
      },
    };

    bench.add(
      `cached nth-child query (${count} siblings)`,
      () => {
        return parent.querySelectorAll(".item:nth-child(3n)").length;
      },
      options,
    );

    bench.add(
      `reorder and nth-child query (${count} siblings)`,
      () => {
        parent.append(parent.firstElementChild);
        return parent.querySelectorAll(".item:nth-child(3n)").length;
      },
      options,
    );

    bench.add(
      `class mutation and :has() query (${count} siblings)`,
      () => {
        const child = parent.children[version++ % count].firstElementChild;
        child.classList.toggle("active");
        return parent.querySelectorAll(".item:has(> .active)").length;
      },
      options,
    );

    bench.add(
      `uncached attribute selector (${count} siblings)`,
      () => {
        return parent.querySelector(`.item[data-value="${version++}"]`);
      },
      options,
    );
  }

  for (const interleaved of [false, true]) {
    let window, parent;
    bench.add(
      `${interleaved ? "interleaved" : "batched"} 100 mutations and structural matching`,
      () => {
        let matches = 0;
        for (let i = 0; i < 100; i++) {
          parent.append(parent.firstElementChild);
          if (interleaved) {
            matches += parent.firstElementChild.matches(":nth-child(2n + 1)");
          }
        }
        if (!interleaved) {
          matches += parent.firstElementChild.matches(":nth-child(2n + 1)");
        }
        return matches;
      },
      {
        beforeAll() {
          ({ window } = new JSDOM());
          parent = window.document.createElement("main");
          parent.innerHTML = "<div></div>".repeat(1000);
          window.document.body.append(parent);
        },
        afterAll() {
          window.close();
        },
      },
    );
  }

  return bench;
};
