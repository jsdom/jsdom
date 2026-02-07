"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const canvas = require("../../lib/jsdom/utils.js").Canvas;
const { version: packageVersion } = require("../../package.json");
const { JSDOM } = require("../..");

const {
  emptyServer,
  resourceServer,
  neverRequestedServer,
  imageServer,
  htmlServer
} = require("./helpers/servers.js");
const {
  setUpLoadingAsserts,
  assertNotLoaded,
  assertLoaded,
  assertError,
  resourceLoadingErrorRecordingVC
} = require("./helpers/resources.js");

describe("API: resource loading configuration", () => {
  describe("defaults (no resources option)", () => {
    it("should not download images", { slow: 500 }, async () => {
      const [url, neverRequestedPromise] = await neverRequestedServer();
      const dom = new JSDOM();

      const element = dom.window.document.createElement("img");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]);
    });

    it("should not download stylesheet links", { slow: 500 }, async () => {
      const [url, neverRequestedPromise] = await neverRequestedServer();
      const dom = new JSDOM();

      const element = dom.window.document.createElement("link");
      setUpLoadingAsserts(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      return Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]);
    });

    it("should not download scripts (even with runScripts: \"dangerously\")", { slow: 500 }, async () => {
      const [url, neverRequestedPromise] = await neverRequestedServer();
      const dom = new JSDOM(``, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]);
    });

    it("should not download iframes", { slow: 500 }, async () => {
      const [url, neverRequestedPromise] = await neverRequestedServer();
      const dom = new JSDOM();

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]);

      // This may not be the optimal behavior for "not loading" iframes: it's fine to change this test in the future
      // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
      assert.equal(
        dom.window.frames[0].document.documentElement,
        null,
        "The iframe must not have been downloaded"
      );
    });

    it("should not download frames", { slow: 500 }, async () => {
      const [url, neverRequestedPromise] = await neverRequestedServer();
      const dom = new JSDOM(`<frameset></frameset>`);

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]);

      // This may not be the optimal behavior for "not loading" iframes: it's fine to change this test in the future
      // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
      assert.equal(
        dom.window.frames[0].document.documentElement,
        null,
        "The iframe must not have been downloaded"
      );
    });
  });

  describe("with resources: \"usable\"", () => {
    if (canvas) {
      it("should download images [canvas is installed]", { slow: 500 }, async () => {
        const url = await imageServer();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("img");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element, virtualConsole);
      });
    } else {
      it("should not download images [canvas is not installed]", { slow: 500 }, async () => {
        const [url, neverRequestedPromise] = await neverRequestedServer();
        const dom = new JSDOM(``, { resources: "usable" });

        const element = dom.window.document.createElement("img");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return Promise.all([
          assertNotLoaded(element),
          neverRequestedPromise
        ]);
      });
    }

    it("should download stylesheet links", { slow: 500 }, async () => {
      const sourceString = `body { color: blue; }`;
      const url = await resourceServer(
        { "Content-Type": "text/css", "Content-Length": sourceString.length },
        sourceString
      );
      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(``, { resources: "usable", virtualConsole });

      const element = dom.window.document.createElement("link");
      setUpLoadingAsserts(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);

      assert.equal(dom.window.getComputedStyle(dom.window.document.body).color, "rgb(0, 0, 255)");
    });

    it("should download and run scripts, if runScripts: \"dangerously\" is also set", { slow: 500 }, async () => {
      const sourceString = `window.x = 5;`;
      const url = await resourceServer(
        { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
        sourceString
      );
      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(dom.window.x, 5, "The script must have run");
    });

    it("should not download or run scripts, if runScripts: \"outside-only\" is set", { slow: 500 }, async () => {
      const [url, neverRequestedPromise] = await neverRequestedServer();
      const dom = new JSDOM(``, { resources: "usable", runScripts: "outside-only" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]);
    });

    it("should not download or run scripts, if runScripts is not set", { slow: 500 }, async () => {
      const [url, neverRequestedPromise] = await neverRequestedServer();
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]);
    });

    it("should download iframes", { slow: 500 }, async () => {
      const url = await htmlServer("Hello");
      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(``, { resources: "usable", virtualConsole });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(
        dom.window.frames[0].document.body.textContent,
        "Hello",
        "The iframe must have been downloaded"
      );
    });

    it("should download frames", { slow: 500 }, async () => {
      const url = await htmlServer("Hello");
      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(
        dom.window.frames[0].document.body.textContent,
        "Hello",
        "The frame must have been downloaded"
      );
    });

    describe("resource returns 404", () => {
      if (canvas) {
        it("should fire a load event downloading images [canvas is installed]", async () => {
          const url = await imageServer({ status: 404 });
          const virtualConsole = resourceLoadingErrorRecordingVC();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return assertLoaded(element, virtualConsole);
        });
      }

      it("should fire an error event downloading stylesheets", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 404 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading scripts", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 404 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire a load event downloading iframes", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 404 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element, virtualConsole);
      });

      it("should fire a load event downloading frames", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 404 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element, virtualConsole);
      });

      it("should fire a load event downloading via XHR", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 404 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const { window } = new JSDOM(``, { resources: "usable", virtualConsole, url });

        const xhr = new window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        return assertLoaded(xhr, virtualConsole);
      });
    });

    describe("resource returns 503", () => {
      if (canvas) {
        it("should fire an error event downloading images [canvas is installed]", async () => {
          const url = await imageServer({ status: 503 });
          const virtualConsole = resourceLoadingErrorRecordingVC();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return assertLoaded(element, virtualConsole);
        });
      }

      it("should fire an error event downloading stylesheets", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 503 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading scripts", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 503 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire a load event downloading iframes", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 503 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element, virtualConsole);
      });

      it("should fire a load event downloading frames", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 503 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element, virtualConsole);
      });

      it("should fire a load event downloading via XHR", { slow: 500 }, async () => {
        const url = await emptyServer({ status: 503 });
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const { window } = new JSDOM(``, { resources: "usable", virtualConsole, url });

        const xhr = new window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        return assertLoaded(xhr, virtualConsole);
      });
    });

    describe("resource is a nonexistent file: URL", () => {
      const url = "file:///nonexistent-asdf-1234.txt"; // hope nobody has a file named this on their system

      if (canvas) {
        it("should fire an error event downloading images [canvas is installed]", () => {
          const virtualConsole = resourceLoadingErrorRecordingVC();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return assertError(element, virtualConsole);
        });
      }

      it("should fire an error event downloading stylesheets", { slow: 500 }, () => {
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading scripts", { slow: 500 }, () => {
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading iframes", { slow: 500 }, () => {
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading frames", { slow: 500 }, () => {
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading via XHR", { slow: 500 }, () => {
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const { window } = new JSDOM(``, { resources: "usable", virtualConsole, url });

        const xhr = new window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        return assertError(xhr, virtualConsole, { isXHR: true });
      });
    });

    describe("canceling requests", () => {
      it("should abort a script request when closing the window", async () => {
        const [url, neverRequestedPromise] = await neverRequestedServer();
        const dom = new JSDOM(`<script>window.y = 6;</script>`, {
          resources: "usable",
          runScripts: "dangerously"
        });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        dom.window.close();

        await Promise.all([
          assertNotLoaded(element),
          neverRequestedPromise
        ]);
        assert.equal(dom.window.x, undefined, "The external script must not have run");
        assert.equal(dom.window.y, 6, "The inline script must have run");
      });

      it("should cancel (with no event) an XHR request when closing the window", async () => {
        const [url, neverRequestedPromise] = await neverRequestedServer();
        const dom = new JSDOM("", { resources: "usable" });

        const xhr = new dom.window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        dom.window.close();

        await Promise.all([
          assertNotLoaded(xhr),
          neverRequestedPromise
        ]);
        assert.equal(xhr.abortFired, false);
      });

      it("should abort an image request when closing the window", async () => {
        const [url, neverRequestedPromise] = await neverRequestedServer();
        const dom = new JSDOM("", { resources: "usable" });

        const element = dom.window.document.createElement("img");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        dom.window.close();

        return Promise.all([
          assertNotLoaded(element),
          neverRequestedPromise
        ]);
      });

      it("should abort a data: image request when closing the window", () => {
        const dom = new JSDOM("", { resources: "usable" });

        const element = dom.window.document.createElement("img");
        setUpLoadingAsserts(element);
        element.src = "data:image/png;base64," +
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";
        dom.window.document.body.appendChild(element);

        dom.window.close();

        return assertNotLoaded(element);
      });

      // TODO: the "with no events" part of these tests may be wrong. Test what browsers do and fix if necessary.

      it("should abort a script request (with no events) when stopping the window", async () => {
        const [url, neverRequestedPromise] = await neverRequestedServer();
        const dom = new JSDOM(`<script>window.y = 6;</script>`, {
          resources: "usable",
          runScripts: "dangerously"
        });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        dom.window.stop();

        await Promise.all([
          assertNotLoaded(element),
          neverRequestedPromise
        ]);
        assert.equal(dom.window.x, undefined, "The script must not have run");
        assert.equal(dom.window.y, 6, "The inline script must have run");
      });

      it("should abort (with no events) an XHR request when stopping the window", async () => {
        const [url, neverRequestedPromise] = await neverRequestedServer();
        const dom = new JSDOM("", { resources: "usable" });

        const xhr = new dom.window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        dom.window.stop();

        await Promise.all([
          assertNotLoaded(xhr),
          neverRequestedPromise
        ]);
        assert.equal(xhr.abortFired, false);
      });
    });
  });

  describe("userAgent option", () => {
    const expected = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                     `(KHTML, like Gecko) jsdom/${packageVersion}`;

    it("should have a default user agent following the correct pattern", () => {
      const dom = new JSDOM(``);
      assert.equal(dom.window.navigator.userAgent, expected);
    });

    it("should inherit the default user agent to iframes", () => {
      const dom = new JSDOM(`<iframe></iframe>`);
      assert.equal(dom.window.frames[0].navigator.userAgent, expected);
    });

    it("should be able to change the user agent", async () => {
      const url = await htmlServer("<iframe></iframe>");

      const dom = await JSDOM.fromURL(url, { resources: { userAgent: "test user agent" } });

      assert.equal(dom.window.navigator.userAgent, "test user agent");
      return new Promise(resolve => {
        dom.window.onload = () => {
          assert.equal(dom.window.frames[0].navigator.userAgent, "test user agent");
          resolve();
        };
      });
    });
  });
});
