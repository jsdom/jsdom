"use strict";

/* globals describe, it */

const resourceLoader = require("../../../lib/jsdom/browser/resource-loader");
const ResourceQueue = require("../../../lib/jsdom/browser/resource-queue");
const expect = require("chai").expect;
const { JSDOM } = require("../../..");
const { CookieJar } = require("tough-cookie");
const idlUtils = require("../../../lib/jsdom/living/generated/utils");
const path = require("path").posix;
const fs = require("fs");

describe("resource-loader", () => {
  it("load a local file", done => {
    const document = createDocument();

    const fp = path.resolve(__dirname, "fixtures/a.js");
    const url = "file://" + fp;

    const fileContent = fs.readFileSync(fp, "utf-8");
    load(document, url, (text, filename) => {
      expect(text).to.equal(fileContent);
      expect(filename).to.equal(url);
      done();
    });
  });
  it("load a local file in blocking mode", done => {
    const document = createDocument();
    const queue = getResourceQueue(document);

    const fpA = path.resolve(__dirname, "fixtures/a.js");
    const urlA = "file://" + fpA;
    const fpB = path.resolve(__dirname, "fixtures/b.js");
    const urlB = "file://" + fpB;
    const fpC = path.resolve(__dirname, "fixtures/c.js");
    const urlC = "file://" + fpC;

    const logs = [];

    const pushed0 = queue.push(() => {
      logs.push("pushed0");
      load(document, urlA, () => {
        logs.push("urlA");
      });
    });
    const pushed1 = queue.push(() => {
      logs.push("pushed1");
      load(document, urlB, () => {
        logs.push("urlB");
      });
    });
    const pushed2 = queue.push(() => {
      logs.push("pushed2");
      load(document, urlC, () => {
        logs.push("urlC");
      });
    });
    const pushed3 = queue.push(() => {
      logs.push("pushed3");
    });

    pushed2();
    pushed0();
    pushed3();
    pushed1();

    setTimeout(() => {
      logs.push("before resume");
      queue.resume(() => {
        expect(logs).to.deep.equal([
          "pushed0",
          "urlA",
          "pushed1",
          "urlB",
          "pushed2",
          "urlC",
          "pushed3",
          "before resume"
        ]);
        done();
      });
    }, 100);
  });
  it("load a local file in async mode", done => {
    const document = createDocument();
    const queue = getResourceQueue(document);

    const fpA = path.resolve(__dirname, "fixtures/a.js");
    const urlA = "file://" + fpA;
    const fpB = path.resolve(__dirname, "fixtures/b.js");
    const urlB = "file://" + fpB;
    const fpC = path.resolve(__dirname, "fixtures/c.js");
    const urlC = "file://" + fpC;

    const logs = [];

    const pushed0 = queue.push(() => {
      logs.push("pushed0");
      load(document, urlA, () => {
        logs.push("urlA");
      }, "async");
    });
    const pushed1 = queue.push(() => {
      logs.push("pushed1");
      load(document, urlB, () => {
        logs.push("urlB");
      }, "async");
    });
    const pushed2 = queue.push(() => {
      logs.push("pushed2");
      load(document, urlC, () => {
        logs.push("urlC");
      }, "async");
    });
    const pushed3 = queue.push(() => {
      logs.push("pushed3");
    });

    pushed2();
    pushed0();
    pushed3();
    pushed1();

    setTimeout(() => {
      logs.push("before resume");
      queue.resume(() => {
        expect(logs).to.deep.equal([
          "pushed0",
          "pushed1",
          "pushed2",
          "pushed3",
          "urlA",
          "urlB",
          "urlC",
          "before resume"
        ]);
        done();
      });
    }, 100);
  });
  it("load a local file in defer mode", done => {
    const document = createDocument();
    const queue = getResourceQueue(document);

    const fpA = path.resolve(__dirname, "fixtures/a.js");
    const urlA = "file://" + fpA;
    const fpB = path.resolve(__dirname, "fixtures/b.js");
    const urlB = "file://" + fpB;
    const fpC = path.resolve(__dirname, "fixtures/c.js");
    const urlC = "file://" + fpC;

    const logs = [];

    const pushed0 = queue.push(() => {
      logs.push("pushed0");
      load(document, urlA, () => {
        logs.push("urlA");
      }, "defer");
    });
    const pushed1 = queue.push(() => {
      logs.push("pushed1");
      load(document, urlB, () => {
        logs.push("urlB");
      }, "defer");
    });
    const pushed2 = queue.push(() => {
      logs.push("pushed2");
      load(document, urlC, () => {
        logs.push("urlC");
      }, "defer");
    });
    const pushed3 = queue.push(() => {
      logs.push("pushed3");
    });

    pushed2();
    pushed0();
    pushed3();
    pushed1();

    setTimeout(() => {
      logs.push("before resume");
      queue.resume(() => {
        expect(logs).to.deep.equal([
          "pushed0",
          "pushed1",
          "pushed2",
          "pushed3",
          "before resume",
          "urlA",
          "urlB",
          "urlC"
        ]);
        done();
      });
    }, 100);
  });
});

function createDocument() {
  return new JSDOM("", {
    runScripts: "dangerously",
    resources: "usable",
    deferClose: true
  }).window.document;
}

function load(document, url, callback, async) {
  const options = {
    cookieJar: new CookieJar(null, { looseMode: true }),
    defaultEncoding: "UTF-8"
  };

  const script = document.createElement("script");
  const scriptImpl = idlUtils.implForWrapper(script);

  resourceLoader.load(scriptImpl, url, options, callback, async);
}

function getResourceQueue(document) {
  const documentImpl = idlUtils.implForWrapper(document);
  documentImpl._queue = new ResourceQueue();
  return documentImpl._queue;
}
