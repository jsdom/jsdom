"use strict";
const http = require("http");
const portfinder = require("portfinder");
const jsdom = require("../..");
const toFileUrl = require("../util").toFileUrl(__dirname);

let server;
let testHost;

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

function assertCookies(t, actualCookieStr, expectedCookies) {
  const actualCookies = actualCookieStr.split(/;\s*/);

  t.strictEqual(actualCookies.length, expectedCookies.length);

  expectedCookies.forEach((expected, i) => {
    t.strictEqual(actualCookies[i], expected);
  });
}

exports.setUp = done => {
  portfinder.getPort((err, port) => {
    if (err) {
      return done(err);
    }

    server = http.createServer((req, res) => {
      switch (req.url) {
        case "/TestPath/set-cookie-from-server":
          res.writeHead(200, testCookies.map(cookieStr => ["set-cookie", cookieStr]));
          res.end("<body></body>");
          break;

        case "/TestPath/set-cookie-redirect-chain":
          res.statusCode = 302;
          res.setHeader("set-cookie", "Test1=Redirect1; expires=Wed, 13-Jan-2051 22:23:01 GMT");
          res.setHeader("location", testHost + "/TestPath/set-cookie-redirect-chain-part2");
          res.end();
          break;

        case "/TestPath/set-cookie-redirect-chain-part2":
          res.statusCode = 302;
          res.setHeader("set-cookie", "Test2=Redirect2; expires=Wed, 13-Jan-2051 22:23:01 GMT");
          res.setHeader("location", testHost + "/TestPath/set-cookie-redirect-chain-part3");
          res.end();
          break;

        case "/TestPath/set-cookie-redirect-chain-part3":
          res.setHeader("set-cookie", "Test3=Redirect3; expires=Wed, 13-Jan-2051 22:23:01 GMT");
          res.end("<body></body>");
          break;

        case "/TestPath/get-cookie-header":
          res.end(req.headers.cookie);
          break;

        case "/TestPath/html-get-cookie-header":
          res.end("<div class=\"cookie-header\">" + req.headers.cookie + "</div>");
          break;

        case "/TestPath/get-cookie-header-via-script":
          res.end("window.scriptCallback('" + req.headers.cookie + "');");
          break;

        default:
          res.end("<body></body>");
      }
    });

    server.listen(port);
    testHost = "http://127.0.0.1:" + port;
    done();
  });
};

exports.tearDown = done => {
  server.close();
  done();
};

exports["Set cookie by client"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/test-page",
    done(err, window) {
      t.ifError(err);

      for (const cookieStr of testCookies) {
        window.document.cookie = cookieStr;
      }

      assertCookies(t, window.document.cookie, [
        "Test1=Basic",
        "Test2=PathMatch",
        "Test9=Duplicate",
        "Test10={\"prop1\":5,\"prop2\":\"value\"}",
        "Malformed"
      ]);
      t.done();
    }
  });
};

exports["Set cookie by page request"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    done(err, window) {
      t.ifError(err);

      assertCookies(t, window.document.cookie, [
        "Test1=Basic",
        "Test2=PathMatch",
        "Test9=Duplicate",
        "Test10={\"prop1\":5,\"prop2\":\"value\"}",
        "Malformed"
      ]);
      t.done();
    }
  });
};

exports["Set cookie by resource request"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/test-page",
    features: {
      FetchExternalResources: ["script"]
    },
    done(err, window) {
      t.ifError(err);

      const script = window.document.createElement("script");
      script.src = testHost + "/TestPath/set-cookie-from-server";

      script.onload = () => {
        assertCookies(t, window.document.cookie, [
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
};

exports["Set cookie by XHR"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/test-page",
    done(err, window) {
      t.ifError(err);

      const xhr = new window.XMLHttpRequest();

      xhr.onload = () => {
        assertCookies(t, window.document.cookie, [
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
};

exports["Getting a file URL should not set any cookies"] = t => {
  // From https://github.com/tmpvar/jsdom/pull/1180
  const window = jsdom.jsdom(undefined, { url: "http://example.com/" }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = () => {
    t.strictEqual(window.document.cookie, "");
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Send Cookies header via resource request"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    features: {
      FetchExternalResources: ["script"],
      ProcessExternalResources: ["script"]
    },
    done(err, window) {
      t.ifError(err);

      const script = window.document.createElement("script");
      script.src = testHost + "/TestPath/get-cookie-header-via-script";

      window.scriptCallback = cookiesHeader => {
        assertCookies(t, cookiesHeader, [
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
};

exports["Send Cookies header via XHR"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    done(err, window) {
      t.ifError(err);

      const xhr = new window.XMLHttpRequest();

      xhr.onload = () => {
        assertCookies(t, xhr.responseText, [
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
};

exports["Share cookies with <iframe>"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    features: {
      FetchExternalResources: ["script", "iframe"],
      ProcessExternalResources: ["script"]
    },
    done(err, window) {
      t.ifError(err);

      const iframe = window.document.createElement("iframe");
      iframe.src = testHost + "/TestPath/iframe-content";

      iframe.onload = () => {
        assertCookies(t, iframe.contentWindow.document.cookie, [
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
};


exports["options.document.cookie"] = t => {
  jsdom.env({
    html: "<body></body>",
    url: "https://127.0.0.1/TestPath/set-cookie-from-server",
    document: {
      cookie: [
        "OptionsTest=FooBar; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/TestPath; HttpOnly",
        "SecureAliasUrlTest=Baz; Secure"
      ]
    },
    done(err, window) {
      t.ifError(err);

      assertCookies(t, window.document.cookie, ["SecureAliasUrlTest=Baz"]);

      const xhr = new window.XMLHttpRequest();

      xhr.onload = () => {
        assertCookies(t, xhr.responseText, ["OptionsTest=FooBar"]);
        t.done();
      };

      xhr.open("GET", testHost + "/TestPath/get-cookie-header", true);
      xhr.send();
    }
  });
};

exports["options.cookieJar"] = t => {
  const cookieJar = jsdom.createCookieJar();

  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    cookieJar,
    done(err) {
      t.ifError(err);

      jsdom.env({
        url: testHost + "/TestPath/html-get-cookie-header",
        cookieJar,
        done(err2, window) {
          t.ifError(err2);

          const cookieHeader = window.document.querySelector(".cookie-header").innerHTML;

          assertCookies(t, cookieHeader, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test6=HttpOnly",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}",
            "Malformed"
          ]);

          assertCookies(t, window.document.cookie, [
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
};

exports["Regression: Expired cookie is still present in document.cookie(GH-1027)"] = t => {
  jsdom.env({
    html: "<body></body>",
    done(err, window) {
      t.ifError(err);

      const timeNow = new Date().getTime();

      const expiredDate = new Date(timeNow - 24 * 60 * 60 * 1000);
      window.document.cookie = "ExpiredCookie=FooBar; Expires=" + expiredDate.toGMTString();

      const futureDate = new Date(timeNow + 24 * 60 * 60 * 1000);
      window.document.cookie = "Test=FooBar; Expires=" + futureDate.toGMTString();

      t.strictEqual(window.document.cookie, "Test=FooBar");
      t.done();
    }
  });
};

exports["Regression: Cookies are not stored between redirects(GH-1089)"] = t => {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-redirect-chain",
    done(err, window) {
      t.ifError(err);

      assertCookies(t, window.document.cookie, [
        "Test1=Redirect1",
        "Test2=Redirect2",
        "Test3=Redirect3"
      ]);
      t.done();
    }
  });
};
