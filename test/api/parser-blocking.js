"use strict";
const assert = require("node:assert/strict");
const { once } = require("node:events");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM, VirtualConsole } = require("../..");
const { createServer, serverURL } = require("./helpers/servers");

describe("API: parser blocking", () => {
  for (const contentType of ["text/html", "application/xhtml+xml"]) {
    for (const runScripts of [undefined, "outside-only"]) {
      it(`stops parsing ${contentType} from a custom element with runScripts: ${runScripts}`, () => {
        const dom = new JSDOM(`<html xmlns="http://www.w3.org/1999/xhtml"><body>` +
          `<stop-parsing></stop-parsing><p id="after"></p></body></html>`, {
          contentType,
          runScripts,
          beforeParse(window) {
            window.customElements.define("stop-parsing", class extends window.HTMLElement {
              constructor() {
                super();
                window.stop();
              }
            });
          }
        });
        try {
          assert.notEqual(dom.window.document.querySelector("stop-parsing"), null);
          assert.equal(dom.window.document.getElementById("after"), null);
        } finally {
          dom.window.close();
        }
      });
    }
  }

  it("stops parsing when a virtual console listener calls window.stop()", () => {
    const virtualConsole = new VirtualConsole();
    let window, reportedError;
    virtualConsole.on("jsdomError", error => {
      reportedError = error;
      window.stop();
    });
    const dom = new JSDOM(`<style>@import "relative.css";</style><p id="after"></p>`, {
      virtualConsole,
      beforeParse(createdWindow) {
        window = createdWindow;
      }
    });
    try {
      assert.equal(reportedError.type, "resource-loading");
      assert.equal(reportedError.url, "relative.css");
      assert.equal(window.document.getElementById("after"), null);
    } finally {
      dom.window.close();
    }
  });

  it("returns the parsed prefix while an external script is pending", async () => {
    const requested = Promise.withResolvers();
    const server = await createServer((req, res) => requested.resolve(res));
    const dom = new JSDOM(`<p id="before"></p><script src="${serverURL(server)}/script.js"></script>` +
      `<p id="after"></p>`, { runScripts: "dangerously", resources: "usable" });
    try {
      const { document } = dom.window;
      assert.notEqual(document.getElementById("before"), null);
      assert.equal(document.getElementById("after"), null);
      assert.equal(document.readyState, "loading");

      const loaded = once(dom.window, "load");
      const response = await requested.promise;
      response.end("window.afterDuringScript = document.getElementById('after');");
      await loaded;
      assert.equal(dom.window.afterDuringScript, null);
      assert.notEqual(document.getElementById("after"), null);
      assert.equal(document.readyState, "complete");
    } finally {
      dom.window.close();
      await server.destroy();
    }
  });

  it("reports XML syntax errors encountered after a suspended constructor has returned", async () => {
    const requested = Promise.withResolvers();
    const server = await createServer((req, res) => requested.resolve(res));
    const virtualConsole = new VirtualConsole();
    const reported = once(virtualConsole, "jsdomError");
    let dom;
    try {
      dom = new JSDOM(`<html xmlns="http://www.w3.org/1999/xhtml">` +
        `<script src="${serverURL(server)}/script.js"/><broken></wrong>` +
        `<script>window.laterScriptRan = true;</script></html>`, {
        contentType: "application/xhtml+xml", runScripts: "dangerously", resources: "usable", virtualConsole
      });
      const loaded = once(dom.window, "load");
      const response = await requested.promise;
      response.end("window.scriptRan = true;");
      const [error] = await reported;
      assert.equal(error.type, "xml-parsing");
      assert.equal(error.cause.name, "SyntaxError");
      await loaded;
      assert.equal(dom.window.scriptRan, true);
      assert.equal(dom.window.laterScriptRan, undefined);
      assert.equal(dom.window.document.readyState, "complete");
    } finally {
      dom?.window.close();
      await server.destroy();
    }
  });

  for (const [contentType, prefix, thrown] of [
    ["text/html", "", undefined],
    ["text/html", '<script src="data:text/javascript,"></script>', null],
    ["application/xhtml+xml", '<script src="data:text/javascript,"/>', new Error("CSS reporter failed")]
  ]) {
    it(
      `releases frame load delays after an unexpected ${contentType} parsing error (${prefix ? "resumed" : "initial"})`,
      async () => {
        const virtualConsole = new VirtualConsole();
        const errors = [];
        virtualConsole.on("jsdomError", error => {
          if (error.type === "css-parsing") {
            throw thrown;
          }
          errors.push(error);
        });
        const source = `<html xmlns="http://www.w3.org/1999/xhtml"><head>${prefix}` +
          `<style>}</style></head><body></body></html>`;
        const url = `data:${contentType},${encodeURIComponent(source)}`;
        const dom = new JSDOM(`<iframe src="${url}"></iframe>`, {
          resources: "usable", runScripts: "dangerously", virtualConsole
        });
        try {
          const frame = dom.window.document.querySelector("iframe");
          const frameErrored = once(frame, "error");
          const loaded = once(dom.window, "load");
          await frameErrored;
          await loaded;
          assert.equal(errors.length, 1);
          assert.equal(errors[0].type, "resource-loading");
          assert.equal(errors[0].cause, thrown);
        } finally {
          dom.window.close();
        }
      }
    );
  }
});
