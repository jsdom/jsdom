"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  let controls;
  bench.add(
    "focus() between form controls",
    () => {
      for (const control of controls) {
        control.focus();
      }
    },
    {
      beforeEach() {
        document.body.innerHTML = `
        <main>
          <form>
            <label>Email <input type="email"></label>
            <label>Password <input type="password"></label>
            <button>Sign in</button>
          </form>
        </main>
      `;
        controls = document.querySelectorAll("input, button");
      },
    },
  );

  bench.add(
    "focus() on already focused control",
    () => {
      controls[0].focus();
    },
    {
      beforeAll() {
        document.body.innerHTML = "<main><form><label>Email <input></label></form></main>";
        controls = document.querySelectorAll("input");
        controls[0].focus();
      },
    },
  );

  // https://github.com/jsdom/jsdom/issues/3984#issuecomment-6082073684
  for (const depth of [5, 25, 100]) {
    let buttons;
    bench.add(
      `focus() between buttons at depth ${depth} with utility styles`,
      () => {
        for (const button of buttons) {
          button.focus();
        }
      },
      {
        beforeAll() {
          const style = document.createElement("style");
          for (let i = 0; i < 40; i++) {
            style.textContent += `.p-${i} { padding: ${i}px } .text-${i} { font-size: ${i}px }`;
          }
          style.textContent +=
            "body { font-family: sans-serif; line-height: 1.5 } .wrap { display: flex }";
          document.body.append(style);

          let parent = document.body;
          for (let i = 0; i < depth; i++) {
            const div = document.createElement("div");
            div.className = `wrap p-${i % 40}`;
            parent.append(div);
            parent = div;
          }
          buttons = Array.from({ length: 50 }, (_, i) => {
            const button = document.createElement("button");
            button.textContent = `b${i}`;
            parent.append(button);
            return button;
          });
        },
      },
    );
  }

  return bench;
};
