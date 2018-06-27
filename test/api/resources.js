"use strict";
const http = require("http");
const path = require("path");
const fs = require("fs");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { delay } = require("../util.js");
const canvas = require("../../lib/jsdom/utils.js").Canvas;
const ResourceLoader = require("../../lib/jsdom/browser/resources/resource-loader.js");

const { JSDOM, VirtualConsole } = require("../..");

describe("API: resource loading configuration", { skipIfBrowser: true }, () => {
  describe("defaults", () => {
    it("should not download images", { slow: 500 }, () => {
      const url = imageServer();
      const dom = new JSDOM(``);

      const element = dom.window.document.createElement("img");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element);
    });

    it("should not download stylesheet links", { slow: 500 }, () => {
      const sourceString = `body { color: blue; }`;
      const url = resourceServer(
        { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(``);

      const element = dom.window.document.createElement("link");
      setUpLoadingAsserts(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        // I think this should actually be "rgb(0, 0, 0)" per spec. It's fine to change the test in the future if we
        // fix that.
        assert.strictEqual(dom.window.getComputedStyle(dom.window.document.body).color, "");
      });
    });

    it("should not download scripts (even with runScripts: \"dangerously\")", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer(
        { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(``, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, undefined, "The script must not have run");
      });
    });

    it("should not download iframes", { slow: 500 }, () => {
      const sourceString = `Hello`;
      const url = resourceServer(
        { "Content-Type": "text/html", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(``, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        // This may not be the optimal behavior for "not loading" iframes: it's fine to change this test in the future
        // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
        assert.strictEqual(
          dom.window.frames[0].document.documentElement, null,
          "The iframe must not have been downloaded"
        );
      });
    });

    it("should not download frames", { slow: 500 }, () => {
      const sourceString = `Hello`;
      const url = resourceServer(
        { "Content-Type": "text/html", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(`<frameset></frameset>`, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        // This may not be the optimal behavior for "not loading" frames: it's fine to change this test in the future
        // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
        assert.strictEqual(
          dom.window.frames[0].document.documentElement, null,
          "The iframe must not have been downloaded"
        );
      });
    });
  });

  describe("set to \"usable\"", () => {
    it("should download images if and only if canvas is installed", { slow: 500 }, () => {
      const url = imageServer();
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("img");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return canvas ? assertLoaded(element) : assertNotLoaded(element);
    });

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
      const sourceString = `window.x = 5;`;
      const url = resourceServer(
        { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(``, { resources: "usable", runScripts: "outside-only" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, undefined, "The script must not have run");
      });
    });

    it("should not download or run scripts, if runScripts is not set", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer(
        { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, undefined, "The script must not have run");
      });
    });

    it("should download iframes", { slow: 500 }, () => {
      const sourceString = `Hello`;
      const url = resourceServer(
        { "Content-Type": "text/html", "Content-Length": sourceString.length },
        sourceString
      );
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
      const sourceString = `Hello`;
      const url = resourceServer(
        { "Content-Type": "text/html", "Content-Length": sourceString.length },
        sourceString
      );
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

    it("should use the custom resource loader when specified", { slow: 500 }, () => {
      let called = false;

      class CustomResource extends ResourceLoader {
        fetch(url, options) {
          called = true;

          return super.fetch(url, options);
        }
      }
      const sourceString = `Hello`;
      const url = resourceServer(
        { "Content-Type": "text/html", "Content-Length": sourceString.length },
        sourceString
      );
      const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", resourceLoader: new CustomResource() });

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(
          dom.window.frames[0].document.body.textContent, "Hello",
          "The frame must have been downloaded"
        );
        assert.isTrue(called, "The custom resource should be called");
      });
    });

    describe("resources returns 404", () => {
      it(
        "should fire an error event downloading images if and only if canvas is installed",
        { slow: 500 },
        () => {
          const url = resourceNotFound();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return canvas ? assertError(element) : assertNotLoaded(element);
        }
      );

      it("should fire an error event downloading stylesheets", { slow: 500 }, () => {
        const url = resourceNotFound();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading scripts", { slow: 500 }, () => {
        const url = resourceNotFound();

        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading iframes", { slow: 500 }, () => {
        const url = resourceNotFound();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading frames", { slow: 500 }, () => {
        const url = resourceNotFound();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });
    });

    describe("resources returns 503", () => {
      it(
        "should fire an error event downloading images if and only if canvas is installed",
        { slow: 500 },
        () => {
          const url = resourceServerError();
          const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = url;
          dom.window.document.body.appendChild(element);

          return canvas ? assertError(element) : assertNotLoaded(element);
        }
      );

      it("should fire an error event downloading stylesheets", { slow: 500 }, () => {
        const url = resourceServerError();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading scripts", { slow: 500 }, () => {
        const url = resourceServerError();

        const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading iframes", { slow: 500 }, () => {
        const url = resourceServerError();
        const dom = new JSDOM(``, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });

      it("should fire an error event downloading frames", { slow: 500 }, () => {
        const url = resourceServerError();
        const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable", virtualConsole: ignoreResourceLoadingErrorsVC() });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        return assertError(element);
      });
    });
  });

  it("should disallow other values for resources", () => {
    assert.throws(() => new JSDOM(``, { resources: null }), RangeError);
    assert.throws(() => new JSDOM(``, { resources: "asdf" }), RangeError);
    assert.throws(() => new JSDOM(``, { resources: true }), RangeError);
    assert.throws(() => new JSDOM(``, { resources: false }), RangeError);
  });

  it("should disallow custom resource loaders if they doesn't implement ResourceLoader", () => {
    assert.throws(() => new JSDOM(``, {
      resourceLoader: {
        fetch() { }
      }
    }), Error);

    class MyResourceLoader {
      fetch() { }
    }

    assert.throws(() => new JSDOM(``, {
      resourceLoader: new MyResourceLoader()
    }), RangeError);

    function MyResourceLoaderFunction() {
      this.fetch = function () { };
    }

    assert.throws(() => new JSDOM(``, {
      resourceLoader: new MyResourceLoaderFunction()
    }), Error);
  });
});

function resourceServer(headers, body, statusCode) {
  const server = http.createServer((req, res) => {
    res.writeHead(statusCode || 200, headers);
    res.end(body);
    server.close();
  }).listen();

  return `http://127.0.0.1:${server.address().port}/`;
}

function resourceNotFound() {
  const notFoundText = "Not found";

  return resourceServer({ "Content-Type": "text/html", "Content-Length": notFoundText.length }, notFoundText, 404);
}

function resourceServerError() {
  const serverErrorText = "Internal server error";

  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": serverErrorText.length },
    serverErrorText,
    503
  );
}

function imageServer() {
  // We can't do this at the top of the file since otherwise it won't be skipped when running these tests in the
  // browser.
  const pngBytes = fs.readFileSync(path.resolve(__dirname, "fixtures/resources/transparent.png"));

  return resourceServer({ "Content-Type": "image/png", "Content-Length": pngBytes.byteLength }, pngBytes);
}

function setUpLoadingAsserts(element) {
  element.loadFired = false;
  element.errorFired = false;

  element.loadPromise = new Promise(resolve => {
    element.addEventListener("load", () => {
      element.loadFired = true;
      resolve();
    });
    element.addEventListener("error", () => {
      element.errorFired = true;
      resolve();
    });
  });
}

function assertNotLoaded(element) {
  return delay(30).then(() => {
    assert.isFalse(element.loadFired, "The load event must not fire");
    assert.isFalse(element.errorFired, "The error event must not fire");
  });
}

function assertLoaded(element) {
  return element.loadPromise
    .then(() => {
      assert.isTrue(element.loadFired, "The load event must fire");
      assert.isFalse(element.errorFired, "The error event must not fire");
    });
}

function assertError(element) {
  return element.loadPromise
    .then(() => {
      assert.isFalse(element.loadFired, "The load event must not fire");
      assert.isTrue(element.errorFired, "The error event must fire");
    });
}

function ignoreResourceLoadingErrorsVC() {
  const vc = new VirtualConsole();
  vc.sendTo(console, { omitJSDOMErrors: true });
  vc.on("jsdomError", err => {
    if (err.type !== "resource loading") {
      console.error(err.stack, err.detail);
    }
  });
  return vc;
}
