"use strict";
const { assert } = require("chai");
const { describe, specify, before, after } = require("mocha-sugar-free");
const { createServer, createHTTPSServer } = require("../util.js");

const jsdom = require("../../lib/old-api.js");
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

describe("jsdom/cookie", { skipIfBrowser: true }, () => {
  let server;
  let securedServer;

  before(() => {
    return setupServer().then(s => {
      server = s;
      testHost = `http://127.0.0.1:${s.address().port}`;

      return setupSecuredServer();
    })
    .then(s => {
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

  specify("set cookie by client", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/test-page",
      done(err, window) {
        assert.ifError(err);

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

        t.done();
      }
    });
  });

  specify("Set cookie by page request", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/set-cookie-from-server",
      done(err, window) {
        assert.ifError(err);

        assertCookies(window.document.cookie, [
          "Test1=Basic",
          "Test2=PathMatch",
          "Test9=Duplicate",
          "Test10={\"prop1\":5,\"prop2\":\"value\"}",
          "Malformed"
        ]);
        t.done();
      }
    });
  });

  specify("Set cookie by resource request", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/test-page",
      features: {
        FetchExternalResources: ["script"]
      },
      done(err, window) {
        assert.ifError(err);

        const script = window.document.createElement("script");
        script.src = testHost + "/TestPath/set-cookie-from-server";

        script.onload = () => {
          assertCookies(window.document.cookie, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);
          t.done();
        };

        window.document.documentElement.appendChild(script);
      }
    });
  });

  specify("Set cookie by XHR", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/test-page",
      done(err, window) {
        assert.ifError(err);

        const xhr = new window.XMLHttpRequest();

        xhr.onload = () => {
          assertCookies(window.document.cookie, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);
          t.done();
        };

        xhr.open("GET", testHost + "/TestPath/set-cookie-from-server", true);
        xhr.send();
      }
    });
  });

  specify("Getting a file URL should not set any cookies", { async: true }, t => {
    // From https://github.com/tmpvar/jsdom/pull/1180
    const window = jsdom.jsdom(undefined, { url: "http://example.com/" }).defaultView;

    const xhr = new window.XMLHttpRequest();
    xhr.onerror = () => {
      assert.equal(window.document.cookie, "");
      t.done();
    };

    xhr.open("GET", toFileUrl(__filename), true);
    xhr.send();
  });

  specify("Send Cookies header via resource request", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/set-cookie-from-server",
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      },
      done(err, window) {
        assert.ifError(err);

        const script = window.document.createElement("script");
        script.src = testHost + "/TestPath/get-cookie-header-via-script";

        window.scriptCallback = cookiesHeader => {
          assertCookies(cookiesHeader, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test6=HttpOnly",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);
          t.done();
        };

        window.document.documentElement.appendChild(script);
      }
    });
  });

  specify("Send Cookies header via XHR", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/set-cookie-from-server",
      done(err, window) {
        assert.ifError(err);

        const xhr = new window.XMLHttpRequest();

        xhr.onload = () => {
          assertCookies(xhr.responseText, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test6=HttpOnly",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);
          t.done();
        };

        xhr.open("GET", testHost + "/TestPath/get-cookie-header", true);
        xhr.send();
      }
    });
  });

  specify("Share cookies with <iframe>", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/set-cookie-from-server",
      features: {
        FetchExternalResources: ["script", "iframe"],
        ProcessExternalResources: ["script"]
      },
      done(err, window) {
        assert.ifError(err);

        const iframe = window.document.createElement("iframe");
        iframe.src = testHost + "/TestPath/iframe-content";

        iframe.onload = () => {
          assertCookies(iframe.contentWindow.document.cookie, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);
          t.done();
        };

        window.document.documentElement.appendChild(iframe);
      }
    });
  });


  specify("options.document.cookie", { async: true }, t => {
    jsdom.env({
      html: "<body></body>",
      url: testSecuredHost + "/TestPath/set-cookie-from-server",
      document: {
        cookie: [
          "OptionsTest=FooBar; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/TestPath; HttpOnly",
          "SecureAliasUrlTest=Baz; Secure"
        ]
      },
      strictSSL: false,
      done(err, window) {
        assert.ifError(err);

        assertCookies(window.document.cookie, ["SecureAliasUrlTest=Baz"]);

        const xhr = new window.XMLHttpRequest();

        xhr.withCredentials = true;

        xhr.onload = () => {
          assertCookies(xhr.responseText, ["OptionsTest=FooBar"]);
          t.done();
        };

        xhr.open("GET", testHost + "/TestPath/get-cookie-header", true);
        xhr.send();
      }
    });
  });

  specify("options.cookieJar", { async: true }, t => {
    const cookieJar = jsdom.createCookieJar();

    jsdom.env({
      url: testHost + "/TestPath/set-cookie-from-server",
      cookieJar,
      done(err) {
        assert.ifError(err);

        jsdom.env({
          url: testHost + "/TestPath/html-get-cookie-header",
          cookieJar,
          done(err2, window) {
            assert.ifError(err2);

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

            t.done();
          }
        });
      }
    });
  });

  specify("Regression: Expired cookie is still present in document.cookie(GH-1027)", { async: true }, t => {
    jsdom.env({
      html: "<body></body>",
      done(err, window) {
        assert.ifError(err);

        const timeNow = Date.now();

        const expiredDate = new Date(timeNow - 24 * 60 * 60 * 1000);
        window.document.cookie = "ExpiredCookie=FooBar; Expires=" + expiredDate.toGMTString();

        const futureDate = new Date(timeNow + 24 * 60 * 60 * 1000);
        window.document.cookie = "Test=FooBar; Expires=" + futureDate.toGMTString();

        assert.equal(window.document.cookie, "Test=FooBar");
        t.done();
      }
    });
  });

  specify("Regression: Cookies are not stored between redirects(GH-1089)", { async: true }, t => {
    jsdom.env({
      url: testHost + "/TestPath/set-cookie-redirect-chain",
      done(err, window) {
        assert.ifError(err);

        assertCookies(window.document.cookie, [
          "Test1=Redirect1",
          "Test2=Redirect2",
          "Test3=Redirect3"
        ]);
        t.done();
      }
    });
  });
});

function setupServer() {
  return createServer((req, res) => {
    switch (req.url) {
      case "/TestPath/set-cookie-from-server": {
        res.writeHead(200, testCookies.map(cookieStr => ["set-cookie", cookieStr]));
        res.end("<body></body>");
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
