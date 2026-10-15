"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  let controls;
  bench.add("focus() between form controls", () => {
    for (const control of controls) {
      control.focus();
    }
  }, {
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
    }
  });

  bench.add("focus() on already focused control", () => {
    controls[0].focus();
  }, {
    beforeAll() {
      document.body.innerHTML = "<main><form><label>Email <input></label></form></main>";
      controls = document.querySelectorAll("input");
      controls[0].focus();
    }
  });

  return bench;
};
