"use strict";
const { assert } = require("chai");
const { describe, it, before, after } = require("mocha-sugar-free");
const { createServer, createHTTPSServer } = require("../util.js");

const { JSDOM, CookieJar } = require("../..");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

const testCookies = [
  "Test1=Basic; expires=Wed, 13-Jan-2051 22:23:01 GMT",
  "Test2=PathMatch; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/TestPath",
  "Test3=PathNotMatch; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/SomePath/",
  "Test4=DomainMatchButPubSuffixRejected; expires=Wed, 13-Jan-2051 22:23:01 GMT; domain=.com",
  "Test5=DomainNotMatch; expires=Wed, 13-Jan-2051 22:23:01 GMT; domain=.example.com",
  "Test6=HttpOnly; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/; HttpOnly",
  "Test7=Secure; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/; Secure",
  "Test8=Expired; expires=Wed, 13-Jan-1977 22:23:01 GMT; path=/",
  "Test9=Duplicate; One=More; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/",
  "Test10={\"prop1\":5,\"prop2\":\"value\"}; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/",
  "Malformed; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/"
];

let testHost;
let testSecuredHost;

describe("Cookie processing", { skipIfBrowser: true }, () => {
  let server;
  let securedServer;

  before(() => {
    return setupServer().then(s => {
      server = s;
      testHost = `http://127.0.0.1:${s.address().port}`;

      return setupSecuredServer();
    }).then(s => {
      securedServer = s;
      testSecuredHost = `https://127.0.0.1:${s.address().port}`;
    });
  });

  after(() => {
    return Promise.all([
      server.destroy(),
      securedServer.destroy()
    ]);
  });

  describe("document.cookie", () => {
    it("reflects back what is set to it", () => {
      const { window } = new JSDOM(``, { url: testHost + "/TestPath/test-page" });
      for (const cookieStr of testCookies) {
        window.document.cookie = cookieStr;
      }

      assertCookies(window.document.cookie, [
        "Test1=Basic",
        "Test2=PathMatch",
        "Test9=Duplicate",
        "Test10={\"prop1\":5,\"prop2\":\"value\"}",
        "Malformed"
      ]);
    });

    it("reflects back cookies set from the server while requesting the page", () => {
      return JSDOM.fromURL(testHost + "/TestPath/set-cookie-from-server").then(({ window }) => {
        assertCookies(window.document.cookie, [
          "Test1=Basic",
          "Test2=PathMatch",
          "Test9=Duplicate",
          "Test10={\"prop1\":5,\"prop2\":\"value\"}",
          "Malformed"
        ]);
      });
    });

    it("reflects back cookies set from the server while requesting a script", () => {
      const { window } = new JSDOM(``, {
        url: testHost + "/TestPath/test-page",
        resources: "usable",
        runScripts: "dangerously"
      });

      const script = window.document.createElement("script");

      const loadPromise = new Promise(resolve => {
        script.onload = () => {
          assertCookies(window.document.cookie, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);
          resolve();
        };
      });

      script.src = testHost + "/TestPath/set-cookie-from-server";
      window.document.body.appendChild(script);

      return loadPromise;
    });

    it("reflects back cookies set from the server on an XHR response", () => {
      const { window } = new JSDOM(``, { url: testHost + "/TestPath/test-page" });

      const xhr = new window.XMLHttpRequest();

      const loadPromise = new Promise(resolve => {
        xhr.onload = () => {
          assertCookies(window.document.cookie, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);
          resolve();
        };
      });

      xhr.open("GET", testHost + "/TestPath/set-cookie-from-server");
      xhr.send();

      return loadPromise;
    });

    it("should not crash or set cookies when requesting a file URL (GH-1180)", () => {
      const { window } = new JSDOM(``, { url: toFileUrl(__filename) });

      const xhr = new window.XMLHttpRequest();

      const loadPromise = new Promise(resolve => {
        xhr.onload = () => {
          assert.strictEqual(window.document.cookie, "");
          resolve();
        };
      });

      xhr.open("GET", toFileUrl(__filename));
      xhr.send();

      return loadPromise;
    });

    it("should not contain expired cookies (GH-1027)", () => {
      const { window } = new JSDOM();

      const timeNow = Date.now();
      const expiredDate = new Date(timeNow - 24 * 60 * 60 * 1000);
      window.document.cookie = "ExpiredCookie=FooBar; Expires=" + expiredDate.toGMTString();

      const futureDate = new Date(timeNow + 24 * 60 * 60 * 1000);
      window.document.cookie = "Test=FooBar; Expires=" + futureDate.toString();

      assert.strictEqual(window.document.cookie, "Test=FooBar");
    });
  });

  describe("sent with requests", () => {
    it("should send the Cookies header with a script request", () => {
      const options = { runScripts: "dangerously", resources: "usable" };
      return JSDOM.fromURL(testHost + "/TestPath/set-cookie-from-server", options).then(({ window }) => {
        const loadPromise = new Promise(resolve => {
          window.scriptCallback = cookiesHeader => {
            assertCookies(cookiesHeader, [
              "Test1=Basic",
              "Test2=PathMatch",
              "Test6=HttpOnly",
              "Test9=Duplicate",
              "Test10={\"prop1\":5,\"prop2\":\"value\"}",
              "Malformed"
            ]);
            resolve();
          };
        });

        const script = window.document.createElement("script");
        script.src = testHost + "/TestPath/get-cookie-header-via-script";
        window.document.body.appendChild(script);

        return loadPromise;
      });
    });

    it("should send the Cookies header with iframes", () => {
      const options = { resources: "usable" };
      return JSDOM.fromURL(testHost + "/TestPath/set-cookie-from-server", options).then(({ window }) => {
        const iframe = window.document.createElement("iframe");

        const loadPromise = new Promise(resolve => {
          iframe.onload = () => {
            assertCookies(iframe.contentDocument.cookie, [
              "Test1=Basic",
              "Test2=PathMatch",
              "Test9=Duplicate",
              "Test10={\"prop1\":5,\"prop2\":\"value\"}",
              "Malformed"
            ]);
            assertCookies(iframe.contentDocument.body.textContent, [
              "Test1=Basic",
              "Test2=PathMatch",
              "Test6=HttpOnly",
              "Test9=Duplicate",
              "Test10={\"prop1\":5,\"prop2\":\"value\"}",
              "Malformed"
            ]);
            resolve();
          };
        });

        iframe.src = testHost + "/TestPath/get-cookie-header";
        window.document.body.appendChild(iframe);

        return loadPromise;
      });
    });

    it("should send the Cookies header with an XHR request", () => {
      return JSDOM.fromURL(testHost + "/TestPath/set-cookie-from-server").then(({ window }) => {
        const xhr = new window.XMLHttpRequest();

        const loadPromise = new Promise(resolve => {
          xhr.onload = () => {
            assertCookies(xhr.responseText, [
              "Test1=Basic",
              "Test2=PathMatch",
              "Test6=HttpOnly",
              "Test9=Duplicate",
              "Test10={\"prop1\":5,\"prop2\":\"value\"}",
              "Malformed"
            ]);
            resolve();
          };
        });

        xhr.open("GET", testHost + "/TestPath/get-cookie-header");
        xhr.send();

        return loadPromise;
      });
    });

    it("should gather cookies from redirects (GH-1089)", () => {
      return JSDOM.fromURL(testHost + "/TestPath/set-cookie-redirect-chain").then(({ window }) => {
        assertCookies(window.document.cookie, [
          "Test1=Redirect1",
          "Test2=Redirect2",
          "Test3=Redirect3"
        ]);
      });
    });
  });

  it("should have correct secure and HTTP-only cookie semantics", () => {
    const url = testSecuredHost + "/TestPath/somewhere";

    const cookieJar = new CookieJar();
    cookieJar.setCookieSync("OptionsTest=FooBar; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/TestPath; HttpOnly", url);
    cookieJar.setCookieSync("SecureAliasUrlTest=Baz; Secure", url);

    const { window } = new JSDOM(``, { url, cookieJar });
    assertCookies(window.document.cookie, ["SecureAliasUrlTest=Baz"]);

    const xhr = new window.XMLHttpRequest();
    xhr.withCredentials = true;

    const loadPromise = new Promise(resolve => {
      xhr.onload = () => {
        assertCookies(xhr.responseText, ["OptionsTest=FooBar"]);
        resolve();
      };
    });

    xhr.open("GET", testHost + "/TestPath/get-cookie-header");
    xhr.send();

    return loadPromise;
  });

  it("should share cookies when a cookie jar is shared", () => {
    const cookieJar = new CookieJar();

    return JSDOM.fromURL(testHost + "/TestPath/set-cookie-from-server", { cookieJar }).then(() => {
      return JSDOM.fromURL(testHost + "/TestPath/html-get-cookie-header", { cookieJar });
    }).then(({ window }) => {
      const cookieHeader = window.document.querySelector(".cookie-header").innerHTML;

      assertCookies(cookieHeader, [
        "Test1=Basic",
        "Test2=PathMatch",
        "Test6=HttpOnly",
        "Test9=Duplicate",
        "Test10={\"prop1\":5,\"prop2\":\"value\"}",
        "Malformed"
      ]);

      assertCookies(window.document.cookie, [
        "Test1=Basic",
        "Test2=PathMatch",
        "Test9=Duplicate",
        "Test10={\"prop1\":5,\"prop2\":\"value\"}",
        "Malformed"
      ]);
    });
  });
});

function setupServer() {
  return createServer((req, res) => {
    switch (req.url) {
      case "/TestPath/set-cookie-from-server": {
        res.writeHead(200, testCookies.map(cookieStr => ["set-cookie", cookieStr]));
        res.end();
        break;
      }

      case "/TestPath/set-cookie-redirect-chain": {
        res.statusCode = 302;
        res.setHeader("set-cookie", "Test1=Redirect1; expires=Wed, 13-Jan-2051 22:23:01 GMT");
        res.setHeader("location", testHost + "/TestPath/set-cookie-redirect-chain-part2");
        res.end();
        break;
      }

      case "/TestPath/set-cookie-redirect-chain-part2": {
        res.statusCode = 302;
        res.setHeader("set-cookie", "Test2=Redirect2; expires=Wed, 13-Jan-2051 22:23:01 GMT");
        res.setHeader("location", testHost + "/TestPath/set-cookie-redirect-chain-part3");
        res.end();
        break;
      }

      case "/TestPath/set-cookie-redirect-chain-part3": {
        res.setHeader("set-cookie", "Test3=Redirect3; expires=Wed, 13-Jan-2051 22:23:01 GMT");
        res.end("<body></body>");
        break;
      }

      case "/TestPath/get-cookie-header": {
        res.setHeader("access-control-allow-origin", testSecuredHost);
        res.setHeader("access-control-allow-credentials", "true");
        res.end(req.headers.cookie);
        break;
      }

      case "/TestPath/html-get-cookie-header": {
        res.end("<div class=\"cookie-header\">" + req.headers.cookie + "</div>");
        break;
      }

      case "/TestPath/get-cookie-header-via-script": {
        res.end("window.scriptCallback('" + req.headers.cookie + "');");
        break;
      }

      default: {
        res.end("<body></body>");
      }
    }
  });
}

function setupSecuredServer() {
  return createHTTPSServer((req, res) => {
    switch (req.url) {
      case "/TestPath/set-cookie-from-server": {
        res.writeHead(200, testCookies.map(cookieStr => ["set-cookie", cookieStr]));
        res.end("<body></body>");
        break;
      }

      default: {
        res.end("<body></body>");
      }
    }
  });
}

function assertCookies(actualCookieStr, expectedCookies) {
  const actualCookies = actualCookieStr.split(/;\s*/);
  assert.deepEqual(actualCookies, expectedCookies);
}
