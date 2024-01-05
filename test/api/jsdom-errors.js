"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const { JSDOM, VirtualConsole } = require("../..");

describe("API: virtual console jsdomErrors", () => {
  // Note that web-platform-tests do not log CSS parsing errors, so this has to be an API test.
  it("should not emit invalid stylesheet errors due to spaces (GH-2123)", () => {
    const virtualConsole = new VirtualConsole();

    const errors = [];
    virtualConsole.on("jsdomError", e => {
      errors.push(e);
    });

    // eslint-disable-next-line no-new
    new JSDOM(`
      <html>
        <head></head>
        <body>
          <style>
          .cool-class {
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          }
          </style>
          <p class="cool-class">
          Hello!
          </p>
        </body>
      </html>
      `, { virtualConsole });

    assert.deepEqual(errors, []);
  });

  it("should emit unhandled null value thrown in inline event handlers", (t, done) => {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert(error instanceof Error);
      assert.equal(error.message, "Uncaught null");
      assert.equal(error.detail, null);
      done();
    });

    const html = `<body onclick="throw null"></body>`;
    const doc = (new JSDOM(html, { virtualConsole, runScripts: "dangerously" })).window.document;

    doc.body.click();
  });
});
