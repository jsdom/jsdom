"use strict";
const fs = require("fs");
const http = require("http");
const path = require("path");
const jsdom = require("../..");

const xmlString = fs.readFileSync(path.resolve(__dirname, "files/xml.xml"));

function isParsedAsXml(document) {
  return document.getElementsByTagName("CUSTOMTAG")[0].innerHTML.trim() === "";
}

exports["should not throw if no parser is given"] = t => {
  jsdom.jsdom("<!DOCTYPE html><html></html>");

  t.done();
};

exports["should not throw if invalid html document is given"] = t => {
  jsdom.jsdom("<!DOCTYPE html><html</html>");

  t.done();
};

exports["should ignore self-closing of tags in html docs"] = t => {
  const document = jsdom.jsdom(xmlString, { parsingMode: "html" });

  const window = document.defaultView;
  t.ok(!isParsedAsXml(window.document));

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .jsdom)"] = t => {
  const document = jsdom.jsdom(xmlString, { parsingMode: "xml" });

  const window = document.defaultView;
  t.ok(isParsedAsXml(window.document));

  t.done();
};

exports["should handle self-closing tags properly in xml docs (in .env)"] = t => {
  jsdom.env({
    html: xmlString,
    parsingMode: "xml",
    done(err, window) {
      t.ifError(err);
      t.ok(isParsedAsXml(window.document));

      t.done();
    }
  });
};

exports["should auto-detect HTML documents based on header"] = t => {
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end(xmlString);
  });

  server.listen(0, () => {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done(err, window) {
        t.ifError(err);
        t.ok(!isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on application/xml header"] = t => {
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/xml");
    res.end(xmlString);
  });

  server.listen(0, () => {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done(err, window) {
        t.ifError(err);
        t.ok(isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on text/xml header"] = t => {
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/xml");
    res.end(xmlString);
  });

  server.listen(0, () => {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done(err, window) {
        t.ifError(err);
        t.ok(isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on application/xhtml+xml header"] = t => {
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/xhtml+xml");
    res.end(xmlString);
  });

  server.listen(0, () => {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      done(err, window) {
        t.ifError(err);
        t.ok(isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["parsingMode should take precedence over text/xml header"] = t => {
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/xml");
    res.end(xmlString);
  });

  server.listen(0, () => {
    jsdom.env({
      url: "http://127.0.0.1:" + server.address().port + "/",
      parsingMode: "html",
      done(err, window) {
        t.ifError(err);
        t.ok(!isParsedAsXml(window.document));

        t.done();
      }
    });
  });
};

exports["should auto-detect XML documents based on .xml extension"] = t => {
  jsdom.env({
    file: path.resolve(__dirname, "files/xml.xml"),
    done(err, window) {
      t.ifError(err);
      t.ok(isParsedAsXml(window.document));

      t.done();
    }
  });
};

exports["parsingMode option should take precendence over .xml extension detection"] = t => {
  jsdom.env({
    file: path.resolve(__dirname, "files/xml.xml"),
    parsingMode: "html",
    done(err, window) {
      t.ifError(err);
      t.ok(!isParsedAsXml(window.document));

      t.done();
    }
  });
};
