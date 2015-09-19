"use strict";
const http = require("http");
const zlib = require("zlib");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const jsdom = require("../..");
const { JSDOM } = require("../..");
const { version: packageVersion } = require("../../package.json");

require("chai").use(require("../chai-helpers.js"));

describe("API: JSDOM.fromURL()", { skipIfBrowser: true }, () => {
  it("should return a rejected promise for a bad URL", () => {
    return Promise.all([
      assert.isRejected(JSDOM.fromURL("asdf"), TypeError),
      assert.isRejected(JSDOM.fromURL(undefined), TypeError),
      assert.isRejected(JSDOM.fromURL("fail.com"), TypeError)
    ]);
  });

  it("should return a rejected promise for a 404", () => {
    const url = simpleServer(404);

    return assert.isRejected(JSDOM.fromURL(url));
  });

  it("should return a rejected promise for a 500", () => {
    const url = simpleServer(500);

    return assert.isRejected(JSDOM.fromURL(url));
  });

  it("should use the body of 200 responses", () => {
    const url = simpleServer(200, { "Content-Type": "text/html" }, "<p>Hello</p>");

    return JSDOM.fromURL(url).then(dom => {
      assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Hello</p></body></html>");
    });
  });

  it("should use the body of 301 responses", () => {
    const [requestURL] = redirectServer("<p>Hello</p>", { "Content-Type": "text/html" });

    return JSDOM.fromURL(requestURL).then(dom => {
      assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Hello</p></body></html>");
    });
  });

  it("should be able to handle gzipped bodies", () => {
    const body = zlib.gzipSync("<p>Hello world!</p>");
    const headers = { "Content-Type": "text/html", "Content-Length": body.byteLength, "Content-Encoding": "gzip" };
    const url = simpleServer(200, headers, body);

    return JSDOM.fromURL(url).then(dom => {
      assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Hello world!</p></body></html>");
    });
  });

  it("should send a HTML-preferring Accept header", () => {
    let recordedHeader;
    const url = requestRecordingServer(req => {
      recordedHeader = req.headers.accept;
    });

    return JSDOM.fromURL(url).then(() => {
      assert.strictEqual(recordedHeader, "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    });
  });

  it("should send an Accept-Language: en header", () => {
    let recordedHeader;
    const url = requestRecordingServer(req => {
      recordedHeader = req.headers["accept-language"];
    });

    return JSDOM.fromURL(url).then(() => {
      assert.strictEqual(recordedHeader, "en");
    });
  });

  describe("user agent", () => {
    it("should use the default user agent as the User-Agent header when none is given", () => {
      const expected = `Mozilla/5.0 (${process.platform}) AppleWebKit/537.36 ` +
                       `(KHTML, like Gecko) jsdom/${packageVersion}`;

      let recordedHeader;
      const url = requestRecordingServer(req => {
        recordedHeader = req.headers["user-agent"];
      });

      return JSDOM.fromURL(url).then(dom => {
        assert.strictEqual(recordedHeader, expected);
        assert.strictEqual(dom.window.navigator.userAgent, expected);
      });
    });

    it("should use the supplied userAgent option as a User-Agent header", () => {
      let recordedHeader;
      const url = requestRecordingServer(req => {
        recordedHeader = req.headers["user-agent"];
      });

      return JSDOM.fromURL(url, { userAgent: "the user agent" }).then(dom => {
        assert.strictEqual(recordedHeader, "the user agent");
        assert.strictEqual(dom.window.navigator.userAgent, "the user agent");
      });
    });
  });

  describe("referrer", () => {
    it("should reject when passing an invalid absolute URL for referrer", () => {
      assert.isRejected(JSDOM.fromURL("http://example.com/", { referrer: "asdf" }), TypeError);
    });

    it("should not send a Referer header when no referrer option is given", () => {
      let hasHeader;
      const url = requestRecordingServer(req => {
        hasHeader = "referer" in req.headers;
      });

      return JSDOM.fromURL(url).then(dom => {
        assert.strictEqual(hasHeader, false);
        assert.strictEqual(dom.window.document.referrer, "");
      });
    });

    it("should use the supplied referrer option as a Referer header", () => {
      let recordedHeader;
      const url = requestRecordingServer(req => {
        recordedHeader = req.headers.referer;
      });

      return JSDOM.fromURL(url, { referrer: "http://example.com/" }).then(dom => {
        assert.strictEqual(recordedHeader, "http://example.com/");
        assert.strictEqual(dom.window.document.referrer, "http://example.com/");
      });
    });

    it("should canonicalize referrer URLs before using them as a Referer header", () => {
      let recordedHeader;
      const url = requestRecordingServer(req => {
        recordedHeader = req.headers.referer;
      });

      return JSDOM.fromURL(url, { referrer: "http:example.com" }).then(dom => {
        assert.strictEqual(recordedHeader, "http://example.com/");
        assert.strictEqual(dom.window.document.referrer, "http://example.com/");
      });
    });

    it("should use the redirect source URL as the referrer, overriding a provided one", () => {
      const [requestURL] = redirectServer("<p>Hello</p>", { "Content-Type": "text/html" });

      return JSDOM.fromURL(requestURL, { referrer: "http://example.com/" }).then(dom => {
        assert.strictEqual(dom.window.document.referrer, requestURL);
      });
    });
  });

  describe("inferring options from the response", () => {
    describe("url", () => {
      it("should use the URL fetched for a 200", () => {
        const url = simpleServer(200, { "Content-Type": "text/html" });

        return JSDOM.fromURL(url).then(dom => {
          assert.strictEqual(dom.window.document.URL, url);
        });
      });

      it("should use the ultimate response URL after a redirect", () => {
        const [requestURL, responseURL] = redirectServer("<p>Hello</p>", { "Content-Type": "text/html" });

        return JSDOM.fromURL(requestURL).then(dom => {
          assert.strictEqual(dom.window.document.URL, responseURL);
        });
      });

      it("should disallow passing a URL manually", () => {
        return assert.isRejected(JSDOM.fromURL("http://example.com/", { url: "https://example.org" }), TypeError);
      });
    });

    describe("contentType", () => {
      it("should use the content type fetched for a 200", () => {
        const url = simpleServer(200, { "Content-Type": "application/xml" });

        return JSDOM.fromURL(url).then(dom => {
          assert.strictEqual(dom.window.document.contentType, "application/xml");
        });
      });

      it("should use the ultimate response content type after a redirect", () => {
        const [requestURL] = redirectServer(
          "<p>Hello</p>",
          { "Content-Type": "text/html" },
          { "Content-Type": "application/xml" }
        );

        return JSDOM.fromURL(requestURL).then(dom => {
          assert.strictEqual(dom.window.document.contentType, "application/xml");
        });
      });

      it("should disallow passing a content type manually", () => {
        return assert.isRejected(JSDOM.fromURL("http://example.com/", { contentType: "application/xml" }), TypeError);
      });
    });
  });

  describe("cookie jar integration", () => {
    it("should send applicable cookies in a supplied cookie jar", () => {
      let recordedHeader;
      const url = requestRecordingServer(req => {
        recordedHeader = req.headers.cookie;
      });

      const cookieJar = new jsdom.CookieJar();
      cookieJar.setCookieSync("foo=bar", url);

      return JSDOM.fromURL(url, { cookieJar }).then(dom => {
        assert.strictEqual(recordedHeader, "foo=bar");
        assert.strictEqual(dom.window.document.cookie, "foo=bar");
      });
    });

    it("should store cookies set by the server in a supplied cookie jar", () => {
      const url = simpleServer(200, { "Set-Cookie": "bar=baz", "Content-Type": "text/html" });

      const cookieJar = new jsdom.CookieJar();

      return JSDOM.fromURL(url, { cookieJar }).then(dom => {
        assert.strictEqual(cookieJar.getCookieStringSync(url), "bar=baz");
        assert.strictEqual(dom.window.document.cookie, "bar=baz");
      });
    });

    it("should store cookies set by the server in a newly-created cookie jar", () => {
      const url = simpleServer(200, { "Set-Cookie": "baz=qux", "Content-Type": "text/html" });

      return JSDOM.fromURL(url).then(dom => {
        assert.strictEqual(dom.cookieJar.getCookieStringSync(url), "baz=qux");
        assert.strictEqual(dom.window.document.cookie, "baz=qux");
      });
    });
  });
});

function simpleServer(responseCode, headers, body) {
  const server = http.createServer((req, res) => {
    res.writeHead(responseCode, headers);
    res.end(body);
    server.close();
  }).listen();

  return `http://127.0.0.1:${server.address().port}/`;
}

function requestRecordingServer(recorder) {
  const server = http.createServer((req, res) => {
    recorder(req);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<p>Hello</p>");
    server.close();
  }).listen();

  return `http://127.0.0.1:${server.address().port}/`;
}

function redirectServer(body, extraInitialResponseHeaders, ultimateResponseHeaders) {
  const server = http.createServer((req, res) => {
    if (req.url.endsWith("/1")) {
      res.writeHead(301, Object.assign({ Location: "/2" }, extraInitialResponseHeaders));
      res.end();
    } else if (req.url.endsWith("/2")) {
      res.writeHead(200, ultimateResponseHeaders);
      res.end(body);
      server.close();
    } else {
      throw new Error("Unexpected route hit in redirect test server");
    }
  }).listen();

  const base = `http://127.0.0.1:${server.address().port}/`;

  return [base + "1", base + "2"];
}
