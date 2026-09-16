"use strict";
const { Bench } = require("tinybench");
const { JSDOM, requestInterceptor } = require("../..");

module.exports = () => {
  const bench = new Bench();
  for (const [name, markup] of [
    ["20 inline style sheets", "<style>body { color: green }</style>".repeat(20)],
    ["20 external style sheets", '<link rel="stylesheet" href="data:text/css,body{color:green}">'.repeat(20)],
    ["10 child documents", '<iframe src="data:text/html,<p>hello</p>"></iframe>'.repeat(10)]
  ]) {
    bench.add(`load ${name}`, async () => {
      const { window } = new JSDOM(markup, { resources: "usable" });
      await new Promise(resolve => {
        window.addEventListener("load", resolve);
      });
      window.close();
    });
  }

  bench.add("close with 20 pending intercepted requests", async () => {
    const { window } = new JSDOM('<script async src="/pending.js"></script>'.repeat(20), {
      url: "https://example.test/", runScripts: "dangerously",
      resources: { interceptors: [requestInterceptor(() => new Promise(() => {}))] }
    });
    window.close();
    await new Promise(resolve => {
      setImmediate(resolve);
    });
  });

  return bench;
};
