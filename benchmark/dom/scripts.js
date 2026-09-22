"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();
  const { window } = new JSDOM("", { runScripts: "dangerously" });
  const { document } = window;
  window.scriptCount = 0;
  const source = "window.scriptCount++;";

  bench.add("execute a dynamic inline script", () => {
    const script = document.createElement("script");
    script.text = source;
    document.body.appendChild(script);
    script.remove();
  });

  bench.add("prepare an unsupported script type", () => {
    const script = document.createElement("script");
    script.type = "application/json";
    script.text = "{}";
    document.body.appendChild(script);
    script.remove();
  });

  bench.add("parse and execute 100 inline scripts", () => {
    const dom = new JSDOM(`<script>${source}</script>`.repeat(100), {
      runScripts: "dangerously",
      beforeParse(scriptWindow) {
        scriptWindow.scriptCount = 0;
      }
    });
    dom.window.close();
  });

  bench.add("parse and execute 100 inline XML scripts", () => {
    const dom = new JSDOM(`<html xmlns="http://www.w3.org/1999/xhtml">` +
      `<script>${source}</script>`.repeat(100) + `</html>`, {
      contentType: "application/xhtml+xml",
      runScripts: "dangerously",
      beforeParse(scriptWindow) {
        scriptWindow.scriptCount = 0;
      }
    });
    dom.window.close();
  });

  for (const attribute of ["", " async", " defer"]) {
    bench.add(`load 20 external scripts${attribute || " (blocking)"}`, async () => {
      const dom = new JSDOM(`<script${attribute} src="data:text/javascript,${source}"></script>`.repeat(20), {
        runScripts: "dangerously",
        resources: "usable",
        beforeParse(scriptWindow) {
          scriptWindow.scriptCount = 0;
        }
      });
      await new Promise(resolve => {
        dom.window.addEventListener("load", resolve);
      });
      dom.window.close();
    });
  }

  return bench;
};
