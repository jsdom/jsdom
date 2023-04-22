"use strict";
const { assert } = require("chai");
const { describe, it, xit } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("CSS Selectors support", () => {
  describe("nodes starting with underscores #3015", () => {
    it("should get the queried node", () => {
      const options = {
        contentType: "text/xml"
      };
      const dom = new JSDOM("<data><_g><b>hey</b></_g></data>", options);
      const node = dom.window.document.querySelector("data > _g > b");

      assert.isNotNull(node);
      assert.strictEqual(node.textContent, "hey");
    });
  });

  describe(":scope selector is basically ignored #3067 ", () => {
    // FIXME: :scope is not yet implemented in selery
    xit("should get node list", () => {
      const dom = new JSDOM(`<ul>
        <li>Alpha</li>
        <li>
          Beta
          <ul>
            <li>Gamma</li>
            <li>Delta</li>
          </ul>
        </li>
      </ul>`);

      const ul = dom.window.document.body.querySelector("ul");
      const nodes = [];
      for (const li of ul.querySelectorAll(":scope > li")) {
        nodes.push(li.childNodes[0].textContent.trim());
      }

      assert.deepEqual(nodes, ["Alpha", "Beta"]);
    });
  });

  describe(":not() selector with multiple selectors #3297", () => {
    // FIXME: Error: Expected selector after combinator *
    xit("should get node list", () => {
      const dom = new JSDOM(`<!doctype html>
        <html>
          <body>
            <p>Foo</p>
            <button>Bar</button>
          </body>
        </html>`, { runScripts: "dangerously" });
      const nonSVGElements = dom.window.document.documentElement.querySelectorAll(":not(svg, svg *)");

      assert.strictEqual(nonSVGElements.length, 6);
    });
  });

  describe(":scope with an id beginning with number #3321, related #3067", () => {
    // FIXME: :scope is not yet implemented in selery
    xit("should get the queried element", () => {
      const dom = new JSDOM(`<a id="9a"><b/></a>`, {
        contentType: "application/xml"
      });
      const node = dom.window.document.documentElement.querySelector(":scope>b");

      assert.isNotNull(node);
      assert.strictEqual(node.localName, "b");
    });
  });

  describe("nesting Direct Child Selector #3362", () => {
    it("should get the queried element", () => {
      const HTML = `<!DOCTYPE html>
        <html>
          <body>
            <main id="main-content">
              <div>
                <div>
                  <div>
                    <h1>Hello, World!</h1>
                    <p>Paragraph</p>
                  </div>
                </div>
              </div>
            </main>
          </body>
        </html>`;
      const { window: { document } } = new JSDOM(HTML);
      const header = document.querySelector("#main-content > div > div > div h1");

      assert.isNotNull(header);
      assert.strictEqual(header.textContent, "Hello, World!");
    });

    it("should get the queried element", () => {
      const HTML = `<!DOCTYPE html>
        <html>
          <body>
            <main id="main-content">
              <div>
                <div>
                  <div>
                    <h1>Hello, World!</h1>
                    <p>Paragraph</p>
                  </div>
                </div>
              </div>
            </main>
          </body>
        </html>`;
      const { window: { document } } = new JSDOM(HTML);
      const header = document.querySelector("#main-content > div > div h1");

      assert.isNotNull(header);
      assert.strictEqual(header.textContent, "Hello, World!");
    });

    // FIXME: :nth-child is not yet implemented in selery
    xit("should get the queried element", () => {
      const HTML = `<!DOCTYPE html>
        <html>
          <body>
            <main id="main-content">
              <div>
                <div>
                  <div>
                    <h1>Hello, World!</h1>
                    <p>Paragraph</p>
                  </div>
                </div>
              </div>
            </main>
          </body>
        </html>`;
      const { window: { document } } = new JSDOM(HTML);
      const header = document.querySelector("#main-content > div > div:nth-child(1) h1");

      assert.isNotNull(header);
      assert.strictEqual(header.textContent, "Hello, World!");
    });

    it("should get the queried element", () => {
      const HTML = `<!DOCTYPE html>
        <html>
          <body>
            <main id="main-content">
              <div>
                <div>
                  <div>
                    <h1>Hello, World!</h1>
                    <p>Paragraph</p>
                  </div>
                </div>
              </div>
            </main>
          </body>
        </html>`;
      const { window: { document } } = new JSDOM(HTML);
      const header = document.querySelector("#main-content div div h1");

      assert.isNotNull(header);
      assert.strictEqual(header.textContent, "Hello, World!");
    });

    // FIXME: :nth-child is not yet implemented in selery
    xit("should get the queried element", () => {
      const HTML = `<!DOCTYPE html>
        <html>
          <body>
            <main id="main-content">
              <div>
                <div>
                  <div>
                    <h1>Hello, World!</h1>
                    <p>Paragraph</p>
                  </div>
                </div>
              </div>
            </main>
          </body>
        </html>`;
      const { window: { document } } = new JSDOM(HTML);
      const header = document.querySelector("#main-content div div:nth-child(1) h1");

      assert.isNotNull(header);
      assert.strictEqual(header.textContent, "Hello, World!");
    });
  });

  describe("case-insensitive attribute flag I #3370", () => {
    // FIXME: Error: Unclosed attribute selector
    xit("should get node list", () => {
      const dom = new JSDOM(`<div class="case"></div>`);

      const nodesLower = dom.window.document.querySelectorAll("div[class=CasE i]");
      const nodesUpper = dom.window.document.querySelectorAll("div[class=CasE I]");

      assert.strictEqual(nodesLower.length, 1);
      assert.strictEqual(nodesUpper.length, 1);
    });
  });

  describe("selectors are case-sensitive #3392", () => {
    // FIXME: AssertionError: expected null to not equal null
    xit("should get the queried element", () => {
      const { window: { document } } = new JSDOM("<p>");
      const P = document.querySelector("P");
      const p = document.querySelector("p");

      assert.isNotNull(P);
      assert.isNotNull(p);
    });
  });

  describe("two elements, one capitalized #3416", () => {
    it("should get the queried element", () => {
      const { window: { DOMParser } } = new JSDOM();
      const xml = "<Foo><bar>baz</bar></Foo>";
      const root = "Foo";
      const child = "bar";
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const rootNode = doc.querySelector(root);
      const childNode = doc.querySelector(child);
      const rootChildNode = doc.querySelector(`${root} ${child}`);

      assert.isNotNull(rootNode);
      assert.strictEqual(rootNode.textContent, "baz");
      assert.isNotNull(childNode);
      assert.strictEqual(childNode.textContent, "baz");
      assert.isNotNull(rootChildNode);
      assert.strictEqual(rootChildNode.textContent, "baz");
    });
  });

  describe(":focus-visible in querySelector and matches, #3426", () => {
    // FIXME: :focus-visible is not yet implemented in selery
    xit("should get matched element", () => {
      const dom = new JSDOM(`
        <div class="container">
          Focus me using tab key:
          <button>focus me</button>
        </div>
      `);
      const target = dom.window.document.querySelector(".container > button");
      target.focus();
      const node = dom.window.document.activeElement.matches(":focus-visible");

      assert.strictEqual(node.localName, "button");
      assert.strictEqual(node.textContent, "focus me");
    });
  });

  describe("nested namespaced tag names, #3427", () => {
    it("should get queried element", () => {
      const dom = new JSDOM(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <a xmlns:ns="http://schemas.openxmlformats.org/drawingml/2006/main">
          <ns:b>
            <ns:c></ns:c>
          </ns:b>
          <b>
            <c></c>
          </b>
        </a>`, { contentType: "application/xml" });
      const a = dom.window.document.querySelector("a");
      const nsB = a.querySelector("ns|b");
      const nsC = a.querySelector("ns|c");
      const nsBC = a.querySelector("ns|b ns|c");
      const b = a.querySelector("b");
      const c = a.querySelector("c");
      const bc = a.querySelector("b c");

      assert.isNotNull(a);
      assert.isNotNull(nsB);
      assert.isNotNull(nsC);
      assert.isNotNull(nsBC);
      assert.isNotNull(b);
      assert.isNotNull(c);
      assert.isNotNull(bc);
    });
  });

  describe("contains upper case tag, #3428, related #3416", () => {
    // FIXME: Error: Expected selector after combinator *
    xit("should get the queried node list", () => {
      const xml = `
        <root>
          <aB>
            <c></c>
          </aB>
          <cd>
            <e></e>
          </cd>
        </root>
      `;
      const { window: { document } } = new JSDOM(xml, { contentType: "application/xml" });
      const ko = document.querySelectorAll("aB *").length;
      const ok = document.querySelectorAll("cd *").length;

      assert.strictEqual(ko, 1);
      assert.setictEqual(ok, 1);
    });
  });

  describe("Nested :is(), #3432", () => {
    it("should get the queried element", () => {
      const dom = new JSDOM(`
        <button>hi</button>
        <input type="submit" value="weee" />
      `);
      const node = dom.window.document.querySelector(":is(:is(input), button)");

      assert.strictEqual(node.localName, "button");
      assert.strictEqual(node.textContent, "hi");
    });

    it("should get the queried element", () => {
      const { window: { document } } = new JSDOM(`
        <button>hi</button>
        <input type="submit" value="weee" />
      `);
      const sel = ":is(:is(button, input)[type=submit], button:not([type])):not([disabled])";
      const node = document.querySelector(sel);

      assert.strictEqual(node.localName, "button");
      assert.strictEqual(node.textContent, "hi");
    });
  });
});
