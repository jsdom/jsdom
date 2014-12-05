"use strict";

var fs = require("fs");
var http = require("http");
var jsdom = require("../..");
var xmlString = fs.readFileSync(__dirname + "/files/xml.xml");

function isParsedAsXml(document) {
  return document.getElementsByTagName("CUSTOMTAG")[0].innerHTML.trim() === "";
}

exports["should not throw if no parser is given"] = function (t) {
  jsdom.jsdom("<!DOCTYPE html><html></html>");

  t.done();
};

exports["should not throw if invalid html document is given"] = function (t) {
  jsdom.jsdom("<!DOCTYPE html><html</html>");

  t.done();
};

exports["should ignore self-closing of tags in html docs"] = function (t) {
  var document = jsdom.jsdom(xmlString, { parsingMode: "html" });

  var window = document.parentWindow;
  t.ok(!isParsedAsXml(window.document));

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .jsdom)"] = function (t) {
  var document = jsdom.jsdom(xmlString, { parsingMode: "xml" });

  var window = document.parentWindow;
  t.ok(isParsedAsXml(window.document));

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .env)"] = function (t) {
  jsdom.env({
    html: xmlString,
    parsingMode: "xml",
    done: function (err, window) {
      t.ok(isParsedAsXml(window.document));

      t.done();
    }
  });
};

exports["should auto-detect HTML documents based on header"] = function (t) {
  var server = http.createServer(function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.end(xmlString);
  });

  server.listen(0, function () {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done: function (err, window) {
        t.ok(!isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on application/xml header"] = function (t) {
  var server = http.createServer(function (req, res) {
    res.setHeader("Content-Type", "application/xml");
    res.end(xmlString);
  });

  server.listen(0, function () {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done: function (err, window) {
        t.ok(isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on text/xml header"] = function (t) {
  var server = http.createServer(function (req, res) {
    res.setHeader("Content-Type", "text/xml");
    res.end(xmlString);
  });

  server.listen(0, function () {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done: function (err, window) {
        t.ok(isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on application/xhtml+xml header"] = function (t) {
  var server = http.createServer(function (req, res) {
    res.setHeader("Content-Type", "application/xhtml+xml");
    res.end(xmlString);
  });

  server.listen(0, function () {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done: function (err, window) {
        t.ok(isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["parsingMode should take precedence over text/xml header"] = function (t) {
  var server = http.createServer(function (req, res) {
    res.setHeader("Content-Type", "text/xml");
    res.end(xmlString);
  });

  server.listen(0, function () {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      parsingMode: "html",
      done: function (err, window) {
        t.ok(!isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on .xml extension"] = function (t) {
  jsdom.env({
    file: __dirname + "/files/xml.xml",
    done: function (err, window) {
      t.ok(isParsedAsXml(window.document));

      t.done();
    }
  });
};

exports["parsingMode option should take precendence over .xml extension detection"] = function (t) {
  jsdom.env({
    file: __dirname + "/files/xml.xml",
    parsingMode: "html",
    done: function (err, window) {
      t.ok(!isParsedAsXml(window.document));

      t.done();
    }
  });
};
