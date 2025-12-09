"use strict";
const http = require("http");
const path = require("path");
const fs = require("fs");
const nodeURLParse = require("url").parse;
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { HttpProxyAgent } = require("http-proxy-agent");
const { delay, createServer } = require("../util.js");
const canvas = require("../../lib/jsdom/utils.js").Canvas;
const { version: packageVersion } = require("../../package.json");
const { JSDOM, VirtualConsole, ResourceLoader } = require("../..");

const pngBytes = fs.readFileSync(path.resolve(__dirname, "fixtures/resources/transparent.png"));

describe("API: resource loading configuration", () => {
  describe("defaults", () => {
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

  describe("set to \"usable\"", () => {
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
        it("should fire an error event downloading images [canvas is installed]", async () => {
          const url = await resourceServer404();
          const virtualConsole = resourceLoadingErrorRecordingVC();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return assertError(element, virtualConsole);
        });
      }

      it("should fire an error event downloading stylesheets", { slow: 500 }, async () => {
        const url = await resourceServer404();
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
        const url = await resourceServer404();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading iframes", { slow: 500 }, async () => {
        const url = await resourceServer404();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading frames", { slow: 500 }, async () => {
        const url = await resourceServer404();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire a load event downloading via XHR", { slow: 500 }, async () => {
        const url = await resourceServer404();
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
          const url = await resourceServer503();
          const virtualConsole = resourceLoadingErrorRecordingVC();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return assertError(element, virtualConsole);
        });
      }

      it("should fire an error event downloading stylesheets", { slow: 500 }, async () => {
        const url = await resourceServer503();
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
        const url = await resourceServer503();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading iframes", { slow: 500 }, async () => {
        const url = await resourceServer503();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire an error event downloading frames", { slow: 500 }, async () => {
        const url = await resourceServer503();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element, virtualConsole);
      });

      it("should fire a load event downloading via XHR", { slow: 500 }, async () => {
        const url = await resourceServer503();
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const { window } = new JSDOM(``, { resources: "usable", virtualConsole, url });

        const xhr = new window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        return assertLoaded(xhr, virtualConsole);
      });
    });

    describe("resource is a nonexistant file: URL", () => {
      const url = "file:///nonexistant-asdf-1234.txt"; // hope nobody has a file named this on their system

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
        const dom = new JSDOM(`<script>window.y = 6;</script>`, { resources: "usable", runScripts: "dangerously" });

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
        const dom = new JSDOM();

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
        const dom = new JSDOM(`<script>window.y = 6;</script>`, { resources: "usable", runScripts: "dangerously" });

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
        const dom = new JSDOM();

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

  describe("With a custom resource loader", () => {
    class RecordingResourceLoader extends ResourceLoader {
      fetch(url, options) {
        this.called = true;
        this.options = options;
        return super.fetch(url, options);
      }
    }

    it("should intercept JSDOM.fromURL()'s initial request", async () => {
      const url = await htmlServer("Hello");
      const resourceLoader = new RecordingResourceLoader();

      const dom = await JSDOM.fromURL(url, { resources: resourceLoader });
      assert.equal(resourceLoader.called, true);
      assert.equal(dom.window.document.body.textContent, "Hello");
    });

    // Just this one as a smoke test; no need to repeat all of the above.
    it("should intercept iframe fetches", async () => {
      const url = await htmlServer("Hello");
      const resourceLoader = new RecordingResourceLoader();

      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(``, { resources: resourceLoader, virtualConsole });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(
        dom.window.frames[0].document.body.textContent,
        "Hello",
        "The frame must have been downloaded"
      );
      assert.equal(resourceLoader.called, true, "The custom resource should be called");
    });

    it("should be able to change the user agent", async () => {
      const url = await htmlServer("<iframe></iframe>");
      const resourceLoader = new ResourceLoader({ userAgent: "test user agent" });

      const dom = await JSDOM.fromURL(url, { resources: resourceLoader });

      assert.equal(dom.window.navigator.userAgent, "test user agent");
      return new Promise(resolve => {
        dom.window.onload = () => {
          assert.equal(dom.window.frames[0].navigator.userAgent, "test user agent");
          resolve();
        };
      });
    });

    it("should be able to customize the httpAgent option for proxying", async () => {
      const [mainServer, mainHost] = await threeRequestServer();

      let proxyServerRequestCount = 0;
      const proxyServer = await createServer((proxyServerReq, proxyServerRes) => {
        ++proxyServerRequestCount;
        const options = nodeURLParse(proxyServerReq.url);
        options.headers = proxyServerReq.headers;
        options.method = proxyServerReq.method;

        const mainServerReq = http.request(options, mainServerRes => {
          proxyServerRes.writeHead(mainServerRes.statusCode, mainServerRes.headers);
          mainServerRes.pipe(proxyServerRes);
        });
        proxyServerReq.pipe(mainServerReq);
      });

      const proxyAgent = new HttpProxyAgent(`http://127.0.0.1:${proxyServer.address().port}`);
      const resourceLoader = new ResourceLoader({ httpAgent: proxyAgent });
      const options = { resources: resourceLoader, runScripts: "dangerously" };
      const dom = await JSDOM.fromURL(mainHost + "/html", options);

      return new Promise(resolve => {
        dom.window.done = resolve;
      }).then(() => {
        assert.equal(proxyServerRequestCount, 3);
        return Promise.all([
          mainServer.destroy(),
          proxyServer.destroy()
        ]);
      });
    });

    describe("element option", () => {
      it("should receive script elements in options", async () => {
        const resourceLoader = new RecordingResourceLoader();
        const sourceString = `window.x = 5;`;
        const url = await resourceServer(
          { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
          sourceString
        );

        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: resourceLoader, runScripts: "dangerously", virtualConsole });
        const element = dom.window.document.createElement("script");

        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert(resourceLoader.options.element instanceof dom.window.HTMLScriptElement);
      });

      it("should receive stylesheet link elements in options", async () => {
        const resourceLoader = new RecordingResourceLoader();
        const sourceString = `.foo {}`;
        const url = await resourceServer(
          { "Content-Type": "text/css", "Content-Length": sourceString.length },
          sourceString
        );

        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: resourceLoader, virtualConsole });
        const element = dom.window.document.createElement("link");
        element.rel = "stylesheet";

        setUpLoadingAsserts(element);
        element.href = url;
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert(resourceLoader.options.element instanceof dom.window.HTMLLinkElement);
      });

      it("should receive frame elements in options", async () => {
        const resourceLoader = new RecordingResourceLoader();
        const sourceString = `<!DOCTYPE html>`;
        const url = await resourceServer(
          { "Content-Type": "text/html", "Content-Length": sourceString.length },
          sourceString
        );

        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, { resources: resourceLoader, virtualConsole });
        const element = dom.window.document.createElement("iframe");

        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert(resourceLoader.options.element instanceof dom.window.HTMLIFrameElement);
      });

      if (canvas) {
        it("should receive img elements in options [canvas is installed]", async () => {
          const resourceLoader = new RecordingResourceLoader();
          const url = await imageServer();

          const dom = new JSDOM(``, { resources: resourceLoader });
          const element = dom.window.document.createElement("img");

          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          const virtualConsole = resourceLoadingErrorRecordingVC();
          await assertLoaded(element, virtualConsole);
          assert(resourceLoader.options.element instanceof dom.window.HTMLImageElement);
        });
      }
    });
  });

  for (const resources of [undefined, "usable"]) {
    describe(`User agent (resources set to ${resources})`, () => {
      const expected = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                       `(KHTML, like Gecko) jsdom/${packageVersion}`;

      it("should have a default user agent following the correct pattern", () => {
        const dom = new JSDOM(``, { resources });
        assert.equal(dom.window.navigator.userAgent, expected);
      });

      it("should inherit the default user agent to iframes", () => {
        const dom = new JSDOM(`<iframe></iframe>`, { resources });
        assert.equal(dom.window.frames[0].navigator.userAgent, expected);
      });
    });
  }

  it("should disallow other values for resources", () => {
    assert.throws(() => new JSDOM(``, { resources: null }), TypeError);
    assert.throws(() => new JSDOM(``, { resources: "asdf" }), TypeError);
    assert.throws(() => new JSDOM(``, { resources: true }), TypeError);
    assert.throws(() => new JSDOM(``, { resources: false }), TypeError);
  });

  it("should disallow custom resource loaders if they doesn't implement ResourceLoader", () => {
    assert.throws(() => new JSDOM(``, {
      resources: {
        fetch() { }
      }
    }), TypeError);

    class MyResourceLoader {
      fetch() { }
    }

    assert.throws(() => new JSDOM(``, {
      resources: new MyResourceLoader()
    }), TypeError);

    function MyResourceLoaderFunction() {
      this.fetch = function () { };
    }

    assert.throws(() => new JSDOM(``, {
      resources: new MyResourceLoaderFunction()
    }), TypeError);
  });
});

async function resourceServer(headers, body, { statusCode = 200 } = {}) {
  const server = await createServer((req, res) => {
    res.writeHead(statusCode, headers);
    res.end(body);
    server.destroy();
  });

  return `http://127.0.0.1:${server.address().port}/`;
}

function resourceServer404() {
  const notFoundText = "Not found";

  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": notFoundText.length },
    notFoundText,
    { statusCode: 404 }
  );
}

function resourceServer503() {
  const serverErrorText = "Internal server error";

  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": serverErrorText.length },
    serverErrorText,
    { statusCode: 503 }
  );
}

async function neverRequestedServer() {
  let resolveReturnedPromise, rejectReturnedPromise;
  const returnedPromise = new Promise((resolve, reject) => {
    resolveReturnedPromise = resolve;
    rejectReturnedPromise = reject;
  });

  let destroyed = false;

  const server = await createServer(req => {
    rejectReturnedPromise(new Error(`${req.url} was requested, but should not have been`));
    server.destroy();
    destroyed = true;
  });

  setTimeout(() => {
    if (!destroyed) {
      server.destroy();
      resolveReturnedPromise();
    }
  }, 30);

  return [`http://127.0.0.1:${server.address().port}/`, returnedPromise];
}

function imageServer() {
  return resourceServer({ "Content-Type": "image/png", "Content-Length": pngBytes.byteLength }, pngBytes);
}

function htmlServer(sourceString) {
  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": sourceString.length },
    sourceString
  );
}

function threeRequestServer() {
  const routes = {
    "/html": `<!DOCTYPE html><script src="/js"></script>`,
    "/js": `const xhr = new window.XMLHttpRequest();
            xhr.open("GET", "/xhr");
            xhr.onload = () => {
              window.done();
            };
            xhr.send();`,
    "/xhr": "test"
  };

  return createServer((req, res) => {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  }).then(s => {
    s.numberOfConnections = 0;
    s.on("connection", () => {
      ++s.numberOfConnections;
    });

    return [s, `http://127.0.0.1:${s.address().port}`];
  });
}

function setUpLoadingAsserts(loadable) {
  loadable.loadFired = false;
  loadable.errorFired = false;
  loadable.abortFired = false;

  loadable.loadPromise = new Promise(resolve => {
    loadable.addEventListener("load", () => {
      loadable.loadFired = true;
      resolve();
    });
    loadable.addEventListener("error", () => {
      loadable.errorFired = true;
      resolve();
    });
    loadable.addEventListener("abort", () => {
      loadable.abortFired = true;
    });
  });
}

function assertNotLoaded(loadable) {
  return delay(30).then(() => {
    assert.equal(loadable.loadFired, false, "The load event must not fire");
    assert.equal(loadable.errorFired, false, "The error event must not fire");
  });
}

async function assertLoaded(loadable, virtualConsole) {
  await loadable.loadPromise;

  assert.equal(loadable.loadFired, true, "The load event must fire");
  assert.equal(loadable.errorFired, false, "The error event must not fire");

  assert.equal(virtualConsole.resourceLoadingErrors.length, 0);
}

async function assertError(loadable, virtualConsole, { isXHR = false } = {}) {
  await loadable.loadPromise;

  assert.equal(loadable.loadFired, false, "The load event must not fire");
  assert.equal(loadable.errorFired, true, "The error event must fire");

  // XHR doesn't emit jsdomError events, as it's expected that XHRs often fail.
  // This is similar to how browsers have, somewhat recently, stopped showing XHR failures in the console.
  if (isXHR) {
    assert.equal(virtualConsole.resourceLoadingErrors.length, 0);
  } else {
    assert.equal(virtualConsole.resourceLoadingErrors.length, 1);

    const error = virtualConsole.resourceLoadingErrors[0];
    assert(error instanceof Error);
    assert.equal(error.type, "resource-loading");
    assert.equal(error.url, loadable.src || loadable.href);
    assert(error.cause instanceof Error);
  }
}

function resourceLoadingErrorRecordingVC() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.resourceLoadingErrors = [];

  virtualConsole.forwardTo(console, { jsdomErrors: "none" });
  virtualConsole.on("jsdomError", err => {
    if (err.type === "resource-loading") {
      virtualConsole.resourceLoadingErrors.push(err);
    } else {
      // eslint-disable-next-line no-console
      console.error(err.stack);
    }
  });

  return virtualConsole;
}
