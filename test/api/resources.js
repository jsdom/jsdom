"use strict";
const http = require("http");
const path = require("path");
const fs = require("fs");
const nodeURLParse = require("url").parse;
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { delay, createServer } = require("../util.js");
const canvas = require("../../lib/jsdom/utils.js").Canvas;
const { version: packageVersion } = require("../../package.json");

const { JSDOM, VirtualConsole, ResourceLoader } = require("../..");

describe("API: resource loading configuration", { skipIfBrowser: true }, () => {
  describe("defaults", () => {
    it("should not download images", { slow: 500 }, () => {
      const [url, neverRequestedPromise] = neverRequestedServer();
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

    it("should not download stylesheet links", { slow: 500 }, () => {
      const [url, neverRequestedPromise] = neverRequestedServer();
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

    it("should not download scripts (even with runScripts: \"dangerously\")", { slow: 500 }, () => {
      const [url, neverRequestedPromise] = neverRequestedServer();
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

    it("should not download iframes", { slow: 500 }, () => {
      const [url, neverRequestedPromise] = neverRequestedServer();
      const dom = new JSDOM();

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]).then(() => {
        // This may not be the optimal behavior for "not loading" iframes: it's fine to change this test in the future
        // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
        assert.strictEqual(
          dom.window.frames[0].document.documentElement, null,
          "The iframe must not have been downloaded"
        );
      });
    });

    it("should not download frames", { slow: 500 }, () => {
      const [url, neverRequestedPromise] = neverRequestedServer();
      const dom = new JSDOM(`<frameset></frameset>`);

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return Promise.all([
        assertNotLoaded(element),
        neverRequestedPromise
      ]).then(() => {
        // This may not be the optimal behavior for "not loading" iframes: it's fine to change this test in the future
        // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
        assert.strictEqual(
          dom.window.frames[0].document.documentElement, null,
          "The iframe must not have been downloaded"
        );
      });
    });
  });

  describe("set to \"usable\"", () => {
    if (canvas) {
      it("should download images [canvas is installed]", { slow: 500 }, () => {
        const url = imageServer();
        const dom = new JSDOM(``, { resources: "usable" });

        const element = dom.window.document.createElement("img");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element);
      });
    } else {
      it("should not download images [canvas is not installed]", { slow: 500 }, () => {
        const [url, neverRequestedPromise] = neverRequestedServer();
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

    it("should download stylesheet links", { slow: 500 }, () => {
      const sourceString = `body { color: blue; }`;
      const url = resourceServer(
        { "Content-Type": "text/css", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("link");
      setUpLoadingAsserts(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        // I think this should actually be "rgb(0, 0, 255)" per spec. It's fine to change the test in the future if we
        // fix that.
        assert.strictEqual(dom.window.getComputedStyle(dom.window.document.body).color, "blue");
      });
    });

    it("should download and run scripts, if runScripts: \"dangerously\" is also set", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer(
        { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, 5, "The script must have run");
      });
    });

    it("should not download or run scripts, if runScripts: \"outside-only\" is set", { slow: 500 }, () => {
      const [url, neverRequestedPromise] = neverRequestedServer();
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

    it("should not download or run scripts, if runScripts is not set", { slow: 500 }, () => {
      const [url, neverRequestedPromise] = neverRequestedServer();
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

    it("should download iframes", { slow: 500 }, () => {
      const url = htmlServer("Hello");
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(
          dom.window.frames[0].document.body.textContent, "Hello",
          "The iframe must have been downloaded"
        );
      });
    });

    it("should download frames", { slow: 500 }, () => {
      const url = htmlServer("Hello");
      const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable" });

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(
          dom.window.frames[0].document.body.textContent, "Hello",
          "The frame must have been downloaded"
        );
      });
    });

    describe("resources returns 404", () => {
      it(
        "should fire an error event downloading images if and only if canvas is installed",
        { slow: 500 },
        () => {
          const url = resourceServer404();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return canvas ? assertError(element) : assertNotLoaded(element);
        }
      );

      it("should fire an error event downloading stylesheets", { slow: 500 }, () => {
        const url = resourceServer404();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading scripts", { slow: 500 }, () => {
        const url = resourceServer404();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading iframes", { slow: 500 }, () => {
        const url = resourceServer404();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading frames", { slow: 500 }, () => {
        const url = resourceServer404();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading a file via file uri", () => {
        const { window } = new JSDOM(``, { url: "file:///" });

        const xhr = new window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", "file:///nonexisting.txt");
        xhr.send();

        return assertError(xhr).then(() => {
          assert.isTrue(xhr.errorFired);
        });
      });
    });

    describe("resources returns 503", () => {
      it(
        "should fire an error event downloading images if and only if canvas is installed",
        { slow: 500 },
        () => {
          const url = resourceServer503();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return canvas ? assertError(element) : assertNotLoaded(element);
        }
      );

      it("should fire an error event downloading stylesheets", { slow: 500 }, () => {
        const url = resourceServer503();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading scripts", { slow: 500 }, () => {
        const url = resourceServer503();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading iframes", { slow: 500 }, () => {
        const url = resourceServer503();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading frames", { slow: 500 }, () => {
        const url = resourceServer503();
        const virtualConsole = ignoreResourceLoadingErrorsVC();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });
    });

    describe("canceling requests", () => {
      it("should abort a script request when closing the window", () => {
        const sourceString = `window.x = 5;`;
        const url = resourceServer(
          { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
          sourceString
        );
        const dom = new JSDOM(`<script>window.y = 6;</script>`, { resources: "usable", runScripts: "dangerously" });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        dom.window.close();

        return assertNotLoaded(element).then(() => {
          assert.strictEqual(dom.window.x, undefined, "The external script must not have run");
          assert.strictEqual(dom.window.y, 6, "The inline script must have run");
        });
      });

      it("should cancel (with no event) an XHR request when closing the window", () => {
        const sourceString = `Hello`;
        const url = resourceServer(
          { "Content-Type": "text/plain", "Content-Length": sourceString.length },
          sourceString
        );
        const dom = new JSDOM();

        const xhr = new dom.window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        dom.window.close();

        return assertNotLoaded(xhr).then(() => {
          assert.isFalse(xhr.abortFired);
        });
      });

      // TODO: the "with no events" part of these tests may be wrong. Test what browsers do and fix if necessary.

      it("should abort a script request (with no events) when stopping the window", () => {
        const sourceString = `window.x = 5;`;
        const url = resourceServer(
          { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
          sourceString
        );
        const dom = new JSDOM(`<script>window.y = 6;</script>`, { resources: "usable", runScripts: "dangerously" });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        dom.window.stop();

        return assertNotLoaded(element).then(() => {
          assert.strictEqual(dom.window.x, undefined, "The script must not have run");
          assert.strictEqual(dom.window.y, 6, "The inline script must have run");
        });
      });

      it("should abort (with no events) an XHR request when stopping the window", () => {
        const sourceString = `Hello`;
        const url = resourceServer(
          { "Content-Type": "text/plain", "Content-Length": sourceString.length },
          sourceString
        );
        const dom = new JSDOM();

        const xhr = new dom.window.XMLHttpRequest();
        setUpLoadingAsserts(xhr);
        xhr.open("GET", url);
        xhr.send();

        dom.window.stop();

        return assertNotLoaded(xhr).then(() => {
          assert.isFalse(xhr.abortFired);
        });
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

    it("should intercept JSDOM.fromURL()'s initial request", () => {
      const url = htmlServer("Hello");
      const resourceLoader = new RecordingResourceLoader();

      return JSDOM.fromURL(url, { resources: resourceLoader }).then(dom => {
        assert.isTrue(resourceLoader.called);
        assert.strictEqual(dom.window.document.body.textContent, "Hello");
      });
    });

    // Just this one as a smoke test; no need to repeat all of the above.
    it("should intercept iframe fetches", () => {
      const url = htmlServer("Hello");
      const resourceLoader = new RecordingResourceLoader();

      const dom = new JSDOM(``, { resources: resourceLoader });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(
          dom.window.frames[0].document.body.textContent, "Hello",
          "The frame must have been downloaded"
        );
        assert.isTrue(resourceLoader.called, "The custom resource should be called");
      });
    });

    it("should be able to change the user agent", () => {
      const url = htmlServer("<iframe></iframe>");
      const resourceLoader = new ResourceLoader({ userAgent: "test user agent" });

      return JSDOM.fromURL(url, { resources: resourceLoader }).then(dom => {
        assert.strictEqual(dom.window.navigator.userAgent, "test user agent");
        dom.window.onload = () => {
          assert.strictEqual(dom.window.frames[0].navigator.userAgent, "test user agent");
        };
      });
    });

    it("should be able to customize the proxy option", () => {
      return threeRequestServer().then(([mainServer, mainHost]) => {
        let proxyServerRequestCount = 0;
        return createServer((proxyServerReq, proxyServerRes) => {
          ++proxyServerRequestCount;
          const options = nodeURLParse(proxyServerReq.url);
          options.headers = proxyServerReq.headers;
          options.method = proxyServerReq.method;

          const mainServerReq = http.request(options, mainServerRes => {
            proxyServerRes.writeHead(mainServerRes.statusCode, mainServerRes.headers);
            mainServerRes.pipe(proxyServerRes);
          });
          proxyServerReq.pipe(mainServerReq);
        }).then(proxyServer => {
          const resourceLoader = new ResourceLoader({ proxy: `http://127.0.0.1:${proxyServer.address().port}` });
          const options = { resources: resourceLoader, runScripts: "dangerously" };
          return JSDOM.fromURL(mainHost + "/html", options).then(dom => {
            return new Promise(resolve => {
              dom.window.done = resolve;
            });
          }).then(() => {
            assert.strictEqual(proxyServerRequestCount, 3);
            return Promise.all([
              mainServer.destroy(),
              proxyServer.destroy()
            ]);
          });
        });
      });
    });

    describe("element option", () => {
      it("should receive script elements in options", () => {
        const resourceLoader = new RecordingResourceLoader();
        const sourceString = `window.x = 5;`;
        const url = resourceServer(
          { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
          sourceString
        );

        const dom = new JSDOM(``, { resources: resourceLoader, runScripts: "dangerously" });
        const element = dom.window.document.createElement("script");

        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element).then(() => {
          assert.instanceOf(resourceLoader.options.element, dom.window.HTMLScriptElement);
        });
      });

      it("should receive stylesheet link elements in options", () => {
        const resourceLoader = new RecordingResourceLoader();
        const sourceString = `.foo {}`;
        const url = resourceServer(
          { "Content-Type": "text/css", "Content-Length": sourceString.length },
          sourceString
        );

        const dom = new JSDOM(``, { resources: resourceLoader });
        const element = dom.window.document.createElement("link");
        element.rel = "stylesheet";

        setUpLoadingAsserts(element);
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element).then(() => {
          assert.instanceOf(resourceLoader.options.element, dom.window.HTMLLinkElement);
        });
      });

      it("should receive frame elements in options", () => {
        const resourceLoader = new RecordingResourceLoader();
        const sourceString = `<!DOCTYPE html>`;
        const url = resourceServer(
          { "Content-Type": "text/html", "Content-Length": sourceString.length },
          sourceString
        );

        const dom = new JSDOM(``, { resources: resourceLoader });
        const element = dom.window.document.createElement("iframe");

        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertLoaded(element).then(() => {
          assert.instanceOf(resourceLoader.options.element, dom.window.HTMLIFrameElement);
        });
      });

      if (canvas) {
        it("should receive img elements in options [canvas is installed]", () => {
          const resourceLoader = new RecordingResourceLoader();
          const url = imageServer();

          const dom = new JSDOM(``, { resources: resourceLoader });
          const element = dom.window.document.createElement("img");

          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return assertLoaded(element).then(() => {
            assert.instanceOf(resourceLoader.options.element, dom.window.HTMLImageElement);
          });
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
        assert.strictEqual(dom.window.navigator.userAgent, expected);
      });

      it("should inherit the default user agent to iframes", () => {
        const dom = new JSDOM(`<iframe></iframe>`, { resources });
        assert.strictEqual(dom.window.frames[0].navigator.userAgent, expected);
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

function resourceServer(headers, body, { statusCode = 200 } = {}) {
  const server = http.createServer((req, res) => {
    res.writeHead(statusCode, headers);
    res.end(body);
    server.close();
  }).listen();

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

function neverRequestedServer() {
  let serverURL;
  const promise = new Promise((resolve, reject) => {
    const server = http.createServer(req => {
      reject(new Error(`${req.url} was requested, but should not have been`));
      server.close();
    }).listen();

    setTimeout(() => {
      server.close();
      resolve();
    }, 30);

    serverURL = `http://127.0.0.1:${server.address().port}/`;
  });

  return [serverURL, promise];
}

function imageServer() {
  // We can't do this at the top of the file since otherwise it won't be skipped when running these tests in the
  // browser.
  const pngBytes = fs.readFileSync(path.resolve(__dirname, "fixtures/resources/transparent.png"));

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
    assert.isFalse(loadable.loadFired, "The load event must not fire");
    assert.isFalse(loadable.errorFired, "The error event must not fire");
  });
}

function assertLoaded(loadable) {
  return loadable.loadPromise
    .then(() => {
      assert.isTrue(loadable.loadFired, "The load event must fire");
      assert.isFalse(loadable.errorFired, "The error event must not fire");
    });
}

function assertError(loadable) {
  return loadable.loadPromise
    .then(() => {
      assert.isFalse(loadable.loadFired, "The load event must not fire");
      assert.isTrue(loadable.errorFired, "The error event must fire");
    });
}

function ignoreResourceLoadingErrorsVC() {
  const vc = new VirtualConsole();
  vc.sendTo(console, { omitJSDOMErrors: true });
  vc.on("jsdomError", err => {
    if (err.type !== "resource loading") {
      // eslint-disable-next-line no-console
      console.error(err.stack, err.detail);
    }
  });
  return vc;
}
