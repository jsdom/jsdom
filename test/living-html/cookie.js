"use strict";

var http = require("http");
var URL = require("url");
var portfinder = require("portfinder");
var jsdom = require("../..");

var server = [];
var testHost = null;

var testCookies = [
  "Test1=Basic; expires=Wed, 13-Jan-2051 22:23:01 GMT",
  "Test2=PathMatch; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/TestPath",
  "Test3=PathNotMatch; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/SomePath/",
  "Test4=DomainMatchButPubSuffixRejected; expires=Wed, 13-Jan-2051 22:23:01 GMT; domain=.com",
  "Test5=DomainNotMatch; expires=Wed, 13-Jan-2051 22:23:01 GMT; domain=.example.com",
  "Test6=HttpOnly; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/; HttpOnly",
  "Test7=Secure; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/; Secure",
  "Test8=Expired; expires=Wed, 13-Jan-1977 22:23:01 GMT; path=/",
  "Test9=Duplicate; One=More; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/",
  "Test10={\"prop1\":5,\"prop2\":\"value\"}; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/"
];

function assertCookies(t, actualCookieStr, expectedCookies) {
  var actualCookies = actualCookieStr.split(/;\s*/);

  t.strictEqual(actualCookies.length, expectedCookies.length);

  expectedCookies.forEach(function (expected, i) {
    t.strictEqual(actualCookies[i], expected);
  });
}

exports.setUp = function (done) {
  portfinder.getPort(function (err, port) {
    server = http.createServer(function (req, res) {
      switch (URL.parse(req.url).path) {
        case "/TestPath/set-cookie-from-server":
          res.writeHead(200, testCookies.map(function (cookieStr) {
            return ["set-cookie", cookieStr];
          }));
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

exports.tearDown = function (done) {
  server.close();
  done();
};

exports["Set cookie by client"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/test-page",
    done: function (err, window) {
      testCookies.forEach(function (cookieStr) {
        window.document.cookie = cookieStr;
      });

      assertCookies(t, window.document.cookie, [
        "Test1=Basic",
        "Test2=PathMatch",
        "Test9=Duplicate",
        "Test10={\"prop1\":5,\"prop2\":\"value\"}"
      ]);
      t.done();
    }
  });
};

exports["Set cookie by page request"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    done: function (err, window) {
      assertCookies(t, window.document.cookie, [
        "Test1=Basic",
        "Test2=PathMatch",
        "Test9=Duplicate",
        "Test10={\"prop1\":5,\"prop2\":\"value\"}"
      ]);
      t.done();
    }
  });
};

exports["Set cookie by resource request"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/test-page",
    features: {
      FetchExternalResources: ["script"]
    },
    done: function (err, window) {
      var script = window.document.createElement("script");
      script.src = testHost + "/TestPath/set-cookie-from-server";

      script.onload = function () {
        assertCookies(t, window.document.cookie, [
          "Test1=Basic",
          "Test2=PathMatch",
          "Test9=Duplicate",
          "Test10={\"prop1\":5,\"prop2\":\"value\"}"
        ]);
        t.done();
      };

      window.document.documentElement.appendChild(script);
    }
  });
};

exports["Set cookie by XHR"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/test-page",
    done: function (err, window) {
      var xhr = new window.XMLHttpRequest();

      xhr.onload = function () {
        assertCookies(t, window.document.cookie, [
          "Test1=Basic",
          "Test2=PathMatch",
          "Test9=Duplicate",
          "Test10={\"prop1\":5,\"prop2\":\"value\"}"
        ]);
        t.done();
      };

      xhr.open("GET", testHost + "/TestPath/set-cookie-from-server", true);
      xhr.send();
    }
  });
};

exports["Send Cookies header via resource request"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    features: {
      FetchExternalResources: ["script"],
      ProcessExternalResources: ["script"]
    },
    done: function (err, window) {
      var script = window.document.createElement("script");
      script.src = testHost + "/TestPath/get-cookie-header-via-script";

      window.scriptCallback = function (cookiesHeader) {
        assertCookies(t, cookiesHeader, [
          "Test1=Basic",
          "Test2=PathMatch",
          "Test6=HttpOnly",
          "Test9=Duplicate",
          "Test10={\"prop1\":5,\"prop2\":\"value\"}"
        ]);
        t.done();
      };

      window.document.documentElement.appendChild(script);
    }
  });
};

exports["Send Cookies header via XHR"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    done: function (err, window) {
      var xhr = new window.XMLHttpRequest();

      xhr.onload = function () {
        assertCookies(t, xhr.responseText, [
          "Test1=Basic",
          "Test2=PathMatch",
          "Test6=HttpOnly",
          "Test9=Duplicate",
          "Test10={\"prop1\":5,\"prop2\":\"value\"}"
        ]);
        t.done();
      };

      xhr.open("GET", testHost + "/TestPath/get-cookie-header", true);
      xhr.send();
    }
  });
};

exports["Share cookies with <iframe>"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    features: {
      FetchExternalResources: ["script", "iframe"],
      ProcessExternalResources: ["script"]
    },
    done: function (err, window) {
      var iframe = window.document.createElement("iframe");
      iframe.src = testHost + "/TestPath/iframe-content";

      iframe.onload = function () {
        assertCookies(t, iframe.contentWindow.document.cookie, [
          "Test1=Basic",
          "Test2=PathMatch",
          "Test9=Duplicate",
          "Test10={\"prop1\":5,\"prop2\":\"value\"}"
        ]);
        t.done();
      };

      window.document.documentElement.appendChild(iframe);
    }
  });
};


exports["options.document.cookie"] = function (t) {
  jsdom.env({
    html: "<body></body>",
    url: "https://127.0.0.1/TestPath/set-cookie-from-server",
    document: {
      cookie: [
        "OptionsTest=FooBar; expires=Wed, 13-Jan-2051 22:23:01 GMT; path=/TestPath; HttpOnly",
        "SecureAliasUrlTest=Baz; Secure"
      ]
    },
    done: function (err, window) {
      assertCookies(t, window.document.cookie, ["SecureAliasUrlTest=Baz"]);

      var xhr = new window.XMLHttpRequest();

      xhr.onload = function () {
        assertCookies(t, xhr.responseText, ["OptionsTest=FooBar"]);
        t.done();
      };

      xhr.open("GET", testHost + "/TestPath/get-cookie-header", true);
      xhr.send();
    }
  });
};

exports["options.cookieJar"] = function (t) {
  var cookieJar = jsdom.createCookieJar();

  jsdom.env({
    url: testHost + "/TestPath/set-cookie-from-server",
    cookieJar: cookieJar,
    done: function () {
      jsdom.env({
        url: testHost + "/TestPath/html-get-cookie-header",
        cookieJar: cookieJar,
        done: function (err, window) {
          var cookieHeader = window.document.querySelector(".cookie-header").innerHTML;

          assertCookies(t, cookieHeader, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test6=HttpOnly",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}"
          ]);

          assertCookies(t, window.document.cookie, [
            "Test1=Basic",
            "Test2=PathMatch",
            "Test9=Duplicate",
            "Test10={\"prop1\":5,\"prop2\":\"value\"}"
          ]);

          t.done();
        }
      });
    }
  });
};

exports["Regression: Expired cookie is still present in document.cookie(GH-1027)"] = function (t) {
  jsdom.env({
    html: "<body></body>",
    done: function (err, window) {
      var timeNow = new Date().getTime();

      var expiredDate = new Date(timeNow - 24 * 60 * 60 * 1000);
      window.document.cookie = "ExpiredCookie=FooBar; Expires=" + expiredDate.toGMTString();

      var futureDate = new Date(timeNow + 24 * 60 * 60 * 1000);
      window.document.cookie = "Test=FooBar; Expires=" + futureDate.toGMTString();

      t.strictEqual(window.document.cookie, "Test=FooBar");
      t.done();
    }
  });
};

exports["Regression: Cookies are not stored between redirects(GH-1089)"] = function (t) {
  jsdom.env({
    url: testHost + "/TestPath/set-cookie-redirect-chain",
    done: function (err, window) {
      assertCookies(t, window.document.cookie, [
        "Test1=Redirect1",
        "Test2=Redirect2",
        "Test3=Redirect3"
      ]);
      t.done();
    }
  });
};
