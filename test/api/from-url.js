"use strict";
const zlib = require("zlib");
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { createServer } = require("../util.js");

const jsdom = require("../..");
const { JSDOM } = require("../..");
const { version: packageVersion } = require("../../package.json");

describe("API: JSDOM.fromURL()", () => {
  describe("common tests", () => {
    it("should return a rejected promise for a bad URL", () => {
      return Promise.all([
        assert.rejects(JSDOM.fromURL("asdf"), TypeError),
        assert.rejects(JSDOM.fromURL(undefined), TypeError),
        assert.rejects(JSDOM.fromURL("fail.com"), TypeError)
      ]);
    });

    it("should reject when passing an invalid absolute URL for referrer", () => {
      assert.rejects(JSDOM.fromURL("http://example.com/", { referrer: "asdf" }), TypeError);
    });

    it("should disallow passing a URL manually", () => {
      return assert.rejects(JSDOM.fromURL("http://example.com/", { url: "https://example.org" }), TypeError);
    });

    it("should disallow passing a content type manually", () => {
      return assert.rejects(JSDOM.fromURL("http://example.com/", { contentType: "application/xml" }), TypeError);
    });
  });

  describe("tests that use a server", () => {
    it("should return a rejected promise for a 404", async () => {
      const url = await simpleServer(404);

      return assert.rejects(JSDOM.fromURL(url));
    });

    it("should return a rejected promise for a 500", async () => {
      const url = await simpleServer(500);

      return assert.rejects(JSDOM.fromURL(url));
    });

    it("should use the body of 200 responses", async () => {
      const url = await simpleServer(200, { "Content-Type": "text/html" }, "<p>Hello</p>");

      const dom = await JSDOM.fromURL(url);
      assert.equal(dom.serialize(), "<html><head></head><body><p>Hello</p></body></html>");
    });

    it("should use the body of 301 responses", async () => {
      const [requestURL] = await redirectServer("<p>Hello</p>", { "Content-Type": "text/html" });

      const dom = await JSDOM.fromURL(requestURL);
      assert.equal(dom.serialize(), "<html><head></head><body><p>Hello</p></body></html>");
    });

    it("should give an appropriate error for invalid redirect URLs (GH-3804)", async () => {
      const url = await badRedirectServer();

      assert.rejects(JSDOM.fromURL(url), "Invalid URL");
    });

    it("should be able to handle gzipped bodies", async () => {
      const body = zlib.gzipSync("<p>Hello world!</p>");
      const headers = { "Content-Type": "text/html", "Content-Length": body.byteLength, "Content-Encoding": "gzip" };
      const url = await simpleServer(200, headers, body);

      const dom = await JSDOM.fromURL(url);
      assert.equal(dom.serialize(), "<html><head></head><body><p>Hello world!</p></body></html>");
    });

    it("should send a HTML-preferring Accept header", async () => {
      let recordedHeader;
      const url = await requestRecordingServer(req => {
        recordedHeader = req.headers.accept;
      });

      await JSDOM.fromURL(url);
      assert.equal(recordedHeader, "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    });

    it("should send an Accept-Language: en header", async () => {
      let recordedHeader;
      const url = await requestRecordingServer(req => {
        recordedHeader = req.headers["accept-language"];
      });

      await JSDOM.fromURL(url);
      assert.equal(recordedHeader, "en");
    });

    describe("user agent", () => {
      it("should use the default user agent as the User-Agent header when none is given", async () => {
        const expected = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                        `(KHTML, like Gecko) jsdom/${packageVersion}`;

        let recordedHeader;
        const url = await requestRecordingServer(req => {
          recordedHeader = req.headers["user-agent"];
        });

        const dom = await JSDOM.fromURL(url);
        assert.equal(recordedHeader, expected);
        assert.equal(dom.window.navigator.userAgent, expected);
      });
    });

    describe("referrer", () => {
      it("should not send a Referer header when no referrer option is given", async () => {
        let hasHeader;
        const url = await requestRecordingServer(req => {
          hasHeader = "referer" in req.headers;
        });

        const dom = await JSDOM.fromURL(url);
        assert.equal(hasHeader, false);
        assert.equal(dom.window.document.referrer, "");
      });

      it("should use the supplied referrer option as a Referer header", async () => {
        let recordedHeader;
        const url = await requestRecordingServer(req => {
          recordedHeader = req.headers.referer;
        });

        const dom = await JSDOM.fromURL(url, { referrer: "http://example.com/" });
        assert.equal(recordedHeader, "http://example.com/");
        assert.equal(dom.window.document.referrer, "http://example.com/");
      });

      it("should canonicalize referrer URLs before using them as a Referer header", async () => {
        let recordedHeader;
        const url = await requestRecordingServer(req => {
          recordedHeader = req.headers.referer;
        });

        const dom = await JSDOM.fromURL(url, { referrer: "http:example.com" });
        assert.equal(recordedHeader, "http://example.com/");
        assert.equal(dom.window.document.referrer, "http://example.com/");
      });

      it("should preserve the provided referrer through redirects", async () => {
        let refererOnRedirectTarget;
        const [requestURL] = await refererRecordingRedirectServer(referer => {
          refererOnRedirectTarget = referer;
        });

        const dom = await JSDOM.fromURL(requestURL, { referrer: "http://example.com/" });
        // Browser behavior: referrer is preserved through redirects, not replaced with redirect source
        assert.equal(dom.window.document.referrer, "http://example.com/");
        // Verify the actual Referer header sent to the redirect target is the original referrer,
        // not the intermediate URL that redirected
        assert.equal(refererOnRedirectTarget, "http://example.com/");
      });
    });

    describe("inferring options from the response", () => {
      describe("url", () => {
        it("should use the URL fetched for a 200", async () => {
          const url = await simpleServer(200, { "Content-Type": "text/html" });

          const dom = await JSDOM.fromURL(url);
          assert.equal(dom.window.document.URL, url);
        });

        it("should preserve full request URL", async () => {
          const url = await simpleServer(200, { "Content-Type": "text/html" });
          const path = "t";
          const search = "?a=1";
          const fragment = "#fragment";
          const fullURL = url + path + search + fragment;

          const dom = await JSDOM.fromURL(fullURL);
          assert.equal(dom.window.document.URL, fullURL);
          assert.equal(dom.window.location.href, fullURL);
          assert.equal(dom.window.location.pathname, "/" + path);
          assert.equal(dom.window.location.search, search);
          assert.equal(dom.window.location.hash, fragment);
        });

        it("should use the ultimate response URL after a redirect", async () => {
          const [requestURL, responseURL] = await redirectServer("<p>Hello</p>", { "Content-Type": "text/html" });

          const dom = await JSDOM.fromURL(requestURL);
          assert.equal(dom.window.document.URL, responseURL);
        });

        it("should preserve fragments when processing redirects", async () => {
          const [requestURL, responseURL] = await redirectServer("<p>Hello</p>", { "Content-Type": "text/html" });

          const dom = await JSDOM.fromURL(requestURL + "#fragment");
          assert.equal(dom.window.document.URL, responseURL + "#fragment");
          assert.equal(dom.window.location.hash, "#fragment");
        });
      });

      describe("contentType", () => {
        it("should use the content type fetched for a 200", async () => {
          const url = await simpleServer(200, { "Content-Type": "application/xml" }, "<doc/>");

          const dom = await JSDOM.fromURL(url);
          assert.equal(dom.window.document.contentType, "application/xml");
        });

        it("should use the ultimate response content type after a redirect", async () => {
          const [requestURL] = await redirectServer(
            "<p>Hello</p>",
            { "Content-Type": "text/html" },
            { "Content-Type": "application/xml" }
          );

          const dom = await JSDOM.fromURL(requestURL);
          assert.equal(dom.window.document.contentType, "application/xml");
        });
      });
    });

    describe("cookie jar integration", () => {
      it("should send applicable cookies in a supplied cookie jar", async () => {
        let recordedHeader;
        const url = await requestRecordingServer(req => {
          recordedHeader = req.headers.cookie;
        });

        const cookieJar = new jsdom.CookieJar();
        cookieJar.setCookieSync("foo=bar", url);

        const dom = await JSDOM.fromURL(url, { cookieJar });
        assert.equal(recordedHeader, "foo=bar");
        assert.equal(dom.window.document.cookie, "foo=bar");
      });

      it("should store cookies set by the server in a supplied cookie jar", async () => {
        const url = await simpleServer(200, { "Set-Cookie": "bar=baz", "Content-Type": "text/html" });

        const cookieJar = new jsdom.CookieJar();

        const dom = await JSDOM.fromURL(url, { cookieJar });
        assert.equal(cookieJar.getCookieStringSync(url), "bar=baz");
        assert.equal(dom.window.document.cookie, "bar=baz");
      });

      it("should store cookies set by the server in a newly-created cookie jar", async () => {
        const url = await simpleServer(200, { "Set-Cookie": "baz=qux", "Content-Type": "text/html" });

        const dom = await JSDOM.fromURL(url);
        assert.equal(dom.cookieJar.getCookieStringSync(url), "baz=qux");
        assert.equal(dom.window.document.cookie, "baz=qux");
      });
    });
  });
});

async function simpleServer(responseCode, headers, body) {
  const server = await createServer((req, res) => {
    res.writeHead(responseCode, headers);
    res.end(body);
    server.destroy();
  });

  return `http://127.0.0.1:${server.address().port}/`;
}

async function requestRecordingServer(recorder) {
  const server = await createServer((req, res) => {
    recorder(req);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<p>Hello</p>");
    server.destroy();
  });

  return `http://127.0.0.1:${server.address().port}/`;
}

async function redirectServer(body, extraInitialResponseHeaders, ultimateResponseHeaders) {
  const server = await createServer((req, res) => {
    if (req.url.endsWith("/1")) {
      res.writeHead(301, { Location: "/2", ...extraInitialResponseHeaders });
      res.end();
    } else if (req.url.endsWith("/2")) {
      res.writeHead(200, ultimateResponseHeaders);
      res.end(body);
      server.destroy();
    } else {
      throw new Error("Unexpected route hit in redirect test server");
    }
  });

  const base = `http://127.0.0.1:${server.address().port}/`;

  return [base + "1", base + "2"];
}

async function refererRecordingRedirectServer(onReferer) {
  const server = await createServer((req, res) => {
    if (req.url.endsWith("/1")) {
      res.writeHead(301, { Location: "/2" });
      res.end();
    } else if (req.url.endsWith("/2")) {
      onReferer(req.headers.referer);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<p>Hello</p>");
      server.destroy();
    } else {
      throw new Error("Unexpected route hit in redirect test server");
    }
  });

  const base = `http://127.0.0.1:${server.address().port}/`;

  return [base + "1", base + "2"];
}

async function badRedirectServer() {
  const server = await createServer((req, res) => {
    res.writeHead(301, { Location: "https://" });
    res.end();
    server.destroy();
  });

  return `http://127.0.0.1:${server.address().port}/`;
}
