"use strict";

const { expect } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { VirtualConsole, JSDOM } = require("../..");
const { readTestFixture } = require("../util");

describe("scripts", () => {
  it("Should loading event handlers and script contents in correct order",
  { async: true, skipIfBrowser: false }, context => {
    readTestFixture("api/fixtures/scripts/running-order.html").then(html => {
      createWindow(context, html, logs => {
        expect(logs).deep.equal([
          "script-0 (readyState = loading)",
          "script-1 (readyState = loading)",
          "script-2 (readyState = loading)",
          "document#DOMContentLoaded (readyState = interactive)",
          "window#load-0 (readyState = complete)",
          "body#onload (readyState = complete)",
          "window#load-1 (readyState = complete)",
          "window#load-2 (readyState = complete)"
        ]);
      });
    });
  });
});

function createWindow(context, html, test) {
  const logs = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("log", text => {
    logs.push(text);
  });

  const opts = { runScripts: "dangerously", virtualConsole };
  const window = new JSDOM(html, opts).window;
  window.addEventListener("load", () => {
    try {
      test(logs);
      context.done();
    } catch (e) {
      context.done(e);
    }
  });
}
