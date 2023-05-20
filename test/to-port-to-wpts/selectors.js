"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

require("chai").use(require("../chai-helpers.js"));

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
describe("jsdom/selectors", () => {
  specify("div:last-child > span[title] (GH-972)", () => {
    const { document } = (new JSDOM("<div><div><span title='title text'>text</span></div></div>")).window;

    assert.doesNotThrow(() => {
      document.firstChild.querySelector("div:last-child > span[title]");
    });
  });

  specify("div[title=''] (GH-1163)", () => {
    const { document } = (new JSDOM(`<!doctype html><html><head></head><body>
      <div></div><div title=""></div><div title="yes"></div>
    </body></html>`)).window;

    assert.strictEqual(document.querySelectorAll("div[title='']").length, 1);
    assert.strictEqual(document.querySelectorAll("div[title][title='']").length, 1);
  });

  specify("matches smoke test", () => {
    const html = `<html><body><div id="main"><p class="foo">Foo</p><p>Bar</p></div></body></html>`;
    const { document } = (new JSDOM(html)).window;
    const div = document.body.children.item(0);

    const element = document.querySelector("#main p");
    assert.strictEqual(element.matches("#main p"), true, "p and first-p");
    assert.strictEqual(element.matches("#asdf"), false, "doesn't match wrong selector");

    const element2 = div.querySelector("p");
    assert.strictEqual(element2.matches("p"), true, "p and first-p");
    assert.strictEqual(element2.matches("#asdf"), false, "doesn't match wrong selector");

    const element3 = document.querySelector("#main p:not(.foo)");
    assert.strictEqual(element3.matches("#main p:not(.foo)"), true, "p and second-p");
    assert.strictEqual(element3.matches("#asdf"), false, "doesn't match wrong selector");
  });

  specify("querySelector smoke test", () => {
    const html = `<html><body><div id="main"><p class="foo">Foo</p><p>Bar</p></div></body></html>`;
    const { document } = (new JSDOM(html)).window;
    const div = document.body.children.item(0);

    const element = document.querySelector("#main p");
    assert.equal(element, div.children.item(0), "p and first-p");

    const element2 = div.querySelector("p");
    assert.equal(element2, div.children.item(0), "p and first-p");

    const element3 = document.querySelector("#main p:not(.foo)");
    assert.equal(element3, div.children.item(1), "p and second-p");

    const element4 = document.querySelector("#asdf");
    assert.strictEqual(element4, null, "nonexistent becomes null");
  });

  specify("querySelector smoke test on a document fragment", () => {
    const html = `<html><body><div id="main"><p class="foo">Foo</p><p>Bar</p></div></body></html>`;
    const { document } = (new JSDOM(html)).window;
    const div = document.body.children.item(0);
    const fragment = document.createDocumentFragment();

    fragment.appendChild(div);
    assert.strictEqual(document.body.firstChild, null);

    const element = fragment.querySelector("#main p");
    assert.strictEqual(element, div.children.item(0), "p and first-p");

    const element2 = fragment.querySelector("p");
    assert.strictEqual(element2, div.children.item(0), "p and first-p");

    const element3 = fragment.querySelector("#main p:not(.foo)");
    assert.strictEqual(element3, div.children.item(1), "p and second-p");

    const element4 = fragment.querySelector("#asdf");
    assert.strictEqual(element4, null, "nonexistent becomes null");
  });

  specify("querySelectorAll smoke test", () => {
    const { document } = (new JSDOM(`<html><body><div id="main"><p>Foo</p><p>Bar</p></div><div id="next">` +
                                 `<div id="next-child"><p>Baz</p></div></div></body></html>`)).window;
    const div = document.body.children.item(0);

    const elements = document.querySelectorAll("#main p");
    assert.equal(elements.length, 2, "two results");
    assert.equal(elements.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements.item(1), div.children.item(1), "p and second-p");

    const elements2 = div.querySelectorAll("p");
    assert.equal(elements2.length, 2, "two results");
    assert.equal(elements2.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements2.item(1), div.children.item(1), "p and second-p");

    assert.equal(div.querySelectorAll("#main").length, 0, "It should not return the base element");

    assert.equal(div.querySelectorAll("div").length, 0, "There are no div elements under div#main");

    const elements3 = div.querySelectorAll("#main p");
    assert.equal(elements3.length, 2, "two results");
    assert.equal(elements3.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements3.item(1), div.children.item(1), "p and second-p");

    const topNode = document.createElement("p");
    const newNode = document.createElement("p");
    topNode.id = "fuz";
    newNode.id = "buz";
    topNode.appendChild(newNode);
    assert.equal(topNode.querySelectorAll("#fuz").length, 0, "It should not return the base element that is orphaned");

    const elements4 = topNode.querySelectorAll("#fuz #buz");
    assert.equal(elements4.length, 1, "one result");
    assert.equal(elements4.item(0), newNode, "newNode and first-p");

    const elements5 = div.querySelectorAll("p");
    assert.equal(elements5.length, 2, "It should not return elements that are not within the base element's subtrees");
    assert.equal(elements5.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements5.item(1), div.children.item(1), "p and second-p");
    assert.strictEqual(topNode.parentNode, null, "topNode.parentNode is null");

    const nextChildDiv = document.getElementById("next-child");
    const elements6 = nextChildDiv.querySelectorAll("p");
    assert.equal(elements6.length, 1, "p under div#next-child");
    assert.equal(elements6.item(0), nextChildDiv.children.item(0), "child of div#next-child");
  });

  specify("querySelectorAll smoke test on a document fragment", () => {
    const html = `<html><body><div id="main"><p>Foo</p><p>Bar</p></div>` +
                 `<div id="next"><div id="next-child"><p>Baz</p></div></div></body></html>`;
    const { document } = (new JSDOM(html)).window;
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.body.firstChild);
    fragment.appendChild(document.body.firstChild);

    assert.strictEqual(document.body.firstChild, null, "The body should now be empty");

    const div = fragment.firstChild;

    const elements = fragment.querySelectorAll("#main p");
    assert.equal(elements.length, 2, "two results");
    assert.equal(elements.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements.item(1), div.children.item(1), "p and second-p");

    const elements2 = div.querySelectorAll("p");
    assert.equal(elements2.length, 2, "two results");
    assert.equal(elements2.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements2.item(1), div.children.item(1), "p and second-p");
    assert.equal(div.querySelectorAll("#main").length, 0, "It should not return the base element");
    assert.equal(div.querySelectorAll("div").length, 0, "There are no div elements under div#main");

    const elements3 = div.querySelectorAll("#main p");
    assert.equal(elements3.length, 2, "two results");
    assert.equal(elements3.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements3.item(1), div.children.item(1), "p and second-p");

    const topNode = document.createElement("p");
    const newNode = document.createElement("p");
    topNode.id = "fuz";
    newNode.id = "buz";
    topNode.appendChild(newNode);
    assert.equal(topNode.querySelectorAll("#fuz").length, 0, "It should not return the base element that is orphaned");

    const elements4 = topNode.querySelectorAll("#fuz #buz");
    assert.equal(elements4.length, 1, "one result");
    assert.equal(elements4.item(0), newNode, "newNode and first-p");

    const elements5 = div.querySelectorAll("p");
    assert.equal(elements5.length, 2, "It should not return elements that are not within the base element's subtrees");
    assert.equal(elements5.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements5.item(1), div.children.item(1), "p and second-p");
    assert.equal(topNode.parentNode, null, "topNode.parentNode is null");

    const nextChildDiv = fragment.querySelectorAll("#next-child").item(0);
    assert.notStrictEqual(nextChildDiv, null, "id selector on fragment not null");

    const elements6 = nextChildDiv.querySelectorAll("p");
    assert.equal(elements6.length, 1, "p under div#next-child");
    assert.equal(elements6.item(0), nextChildDiv.children.item(0), "child of div#next-child");

    const elements7 = fragment.querySelectorAll("p");
    assert.equal(elements7.length, 3, "all p");
    assert.equal(elements7.item(0), div.children.item(0), "p and first-p");
    assert.equal(elements7.item(1), div.children.item(1), "p and second-p");
    assert.equal(elements7.item(2), nextChildDiv.children.item(0), "child of div#next-child");
  });

  specify("invalid selector //MAIN MENU... (GH-1214)", () => {
    const { document } = (new JSDOM()).window;

    const selector = " //MAIN MENU - (used to keep mobile menu options hidden and keep weather/search and menu " +
                     "on one line) // #tncms-region-nav-main-nav-right-nav";

    assert.throwsDomException(() => document.querySelector(selector), document, "SyntaxError");
    assert.throwsDomException(() => document.querySelectorAll(selector), document, "SyntaxError");
    assert.throwsDomException(() => document.body.matches(selector), document, "SyntaxError");
  });
});

describe("tests for jsdom issues tagged with `selectors` label", () => {
  specify("#1750 - https://github.com/jsdom/jsdom/issues/1750", () => {
    const domStr = `<!DOCTYPE html>
    <html>
      <body>
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="100" viewBox="0 0 3 2" id="target">
          <rect width="1" height="2" x="0" fill="#008d46" />
          <rect width="1" height="2" x="1" fill="#ffffff" />
          <rect width="1" height="2" x="2" fill="#d2232c" />
        </svg>
      </body>
    </html>`;
    const { window: { document } } = new JSDOM(domStr);
    const node = document.getElementById("target");
    const res = document.querySelector("svg:not(:root)");
    assert.deepEqual(res, node, "result");
  });


  specify("#2159 - https://github.com/jsdom/jsdom/issues/2159", () => {
    const domStr = `<?xml version="1.0"?>
      <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" id="target">
        <dc:title></dc:title>
      </cp:coreProperties>`;
    const { window } = new JSDOM();
    const doc = new window.DOMParser().parseFromString(domStr, "application/xml");
    const node = doc.getElementById("target");
    const res = doc.querySelector("coreProperties");
    assert.deepEqual(res, node, "result");
  });

  specify("#2544 - https://github.com/jsdom/jsdom/issues/2544", () => {
    const domStr = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE mlt SYSTEM "https://raw.githubusercontent.com/mltframework/mlt/master/src/modules/xml/mlt-xml.dtd">
      <mlt>
        <producer id="producerqduAlody2X0FCLy2exeOG">
          <property name="resource">/mnt/c/xampp/htdocs/videoeditor/WORKER/1234/qduAlody2X0FCLy2exeOG.JPG</property>
          <property name="musecut:mime_type">image/jpeg</property>
        </producer>
        <playlist id="playlist0">
          <entry producer="producerqduAlody2X0FCLy2exeOG" in="0" out="99"/>
        </playlist>
        <tractor id="tractor0">
          <multitrack>
            <track producer="playlist0"/>
          </multitrack>
          <filter mlt_service="greyscale" track="0" id="target"/>
          <filter mlt_service="grayscale" track="0"/>
        </tractor>
        <playlist id="videotrack0">
          <entry producer="tractor0"/>
          <entry producer="producerqduAlody2X0FCLy2exeOG" in="0" out="99"/>
        </playlist>
        <tractor id="main">
          <multitrack>
            <track producer="videotrack0"/>
          </multitrack>
        </tractor>
      </mlt>`;
    const { window } = new JSDOM();
    const doc = new window.DOMParser().parseFromString(domStr, "application/xml");
    const node = doc.getElementById("target");
    const res = doc.querySelector('mlt>tractor[id="tractor0"]>filter[mlt_service="greyscale"][track="0"]');
    assert.deepEqual(res, node, "result");
  });

  specify("#2998 - https://github.com/jsdom/jsdom/issues/2998", () => {
    const domStr = `<!DOCTYPE html>
    <html>
      <body>
        <div id="refPoint">
          <div>
            <span id="target"></span>
          </div>
        </div>
      </body>
    </html>`;
    const { window: { document } } = new JSDOM(domStr);

    const refPoint = document.getElementById("refPoint");
    const res = refPoint.querySelector(":scope > span");
    assert.isNull(res, "result");

    const refPoint2 = document.getElementById("refPoint");
    const node2 = document.getElementById("target");
    const res2 = refPoint2.querySelector(":scope span");
    assert.deepEqual(res2, node2, "result");
  });

  specify("#3055 - https://github.com/jsdom/jsdom/issues/3055", () => {
    const domStr = `<!DOCTYPE html>
    <html>
      <body>
        <div class="container" id="target">
          Focus here:
          <button id="item">focus me</button>
        </div>
      </body>
    </html>`;
    const { window: { document } } = new JSDOM(domStr);
    const node = document.getElementById("target");
    const item = document.getElementById("item");
    item.focus();
    const res = node.matches(":focus-within");
    assert.isTrue(res, "result");
  });

  specify("#3321 - https://github.com/jsdom/jsdom/issues/3321", () => {
    const domStr = '<a id="9a"><b id="target"/></a>';
    const { window } = new JSDOM("");
    const doc = new window.DOMParser().parseFromString(domStr, "application/xml");
    const node = doc.getElementById("target");
    const res = doc.documentElement.querySelector(":scope > b");
    assert.deepEqual(res, node, "result");
  });

  specify("#3370 - https://github.com/jsdom/jsdom/issues/3370", () => {
    const domStr = `<!DOCTYPE html>
    <html>
      <body>
        <div class="case" id="target"></div>
      </body>
    </html>`;
    const { window: { document } } = new JSDOM(domStr);
    const node = document.getElementById("target");
    const res = document.querySelector("div[class=CasE i]");
    assert.deepEqual(res, node, "result");

    const node2 = document.getElementById("target");
    const res2 = document.querySelector("div[class=CasE I]");
    assert.deepEqual(res2, node2, "result");
  });

  specify("#3432 - https://github.com/jsdom/jsdom/issues/3432", () => {
    const domStr = `<!DOCTYPE html>
    <html>
      <body>
        <button>hi</button>
        <input type="submit" value="weee" id="target" />
      </body>
    </html>`;
    const { window: { document } } = new JSDOM(domStr);
    const node = document.getElementById("target");
    const res = document.querySelector(":is(:is(input), button)");
    assert.deepEqual(res, node, "result");
  });

  specify("#3506 - https://github.com/jsdom/jsdom/issues/3506", () => {
    const domStr = `<!DOCTYPE html>
    <html>
      <body>
        <p id="target">
          <span>123</span>
        </p>
      </body>
    </html>`;
    const { window: { document } } = new JSDOM(domStr);
    const node = document.getElementById("target");
    const res = document.querySelector("p:has(span)");
    assert.deepEqual(res, node, "result");
  });
});
