"use strict";
const assert = require("node:assert/strict");
const { once } = require("node:events");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../..");
const { createServer, serverURL } = require("./helpers/servers.js");

describe("XMLHttpRequest network integration", () => {
  it("should cancel a replacement request after reopening a streaming request", async () => {
    const firstClosed = Promise.withResolvers();
    const secondClosed = Promise.withResolvers();
    const server = await createServer((req, res) => {
      res.on("close", req.url === "/first" ? firstClosed.resolve : secondClosed.resolve);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("partial response");
    });
    const { window } = new JSDOM("", { url: serverURL(server) });

    try {
      const xhr = new window.XMLHttpRequest();
      const firstProgress = once(xhr, "progress");
      xhr.open("GET", "/first");
      xhr.send();
      await firstProgress;

      const secondProgress = once(xhr, "progress");
      xhr.open("GET", "/second");
      xhr.send();
      await Promise.all([firstClosed.promise, secondProgress]);

      xhr.abort();
      assert.equal(xhr.readyState, xhr.UNSENT);
      // Observe the server-side disconnection, not just the synchronous `abort` event.
      await secondClosed.promise;
    } finally {
      window.close();
      await server.destroy();
    }
  });
});
