"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM, VirtualConsole } = require("../..");

describe("API: virtual console jsdomErrors", () => {
  // Note that web-platform-tests do not log CSS parsing errors, so this has to be an API test.
  it("should not omit invalid stylesheet errors due to spaces (GH-2123)", () => {
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

    assert.isEmpty(errors);
  });
});
