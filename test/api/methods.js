"use strict";
const vm = require("vm");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("API: JSDOM class's methods", () => {
  describe("serialize", () => {
    it("should serialize the default document correctly", () => {
      const dom = new JSDOM();

      assert.strictEqual(dom.serialize(), `<html><head></head><body></body></html>`);
    });

    it("should serialize a text-only document correctly", () => {
      const dom = new JSDOM(`hello`);

      assert.strictEqual(dom.serialize(), `<html><head></head><body>hello</body></html>`);
    });

    it("should serialize a document with HTML correctly", () => {
      const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>`);

      assert.strictEqual(
        dom.serialize(),
        `<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>`
      );
    });

    it("should serialize documents with omitted and varying-case html or body tags correctly", () => {
      const inputs = [
        "<HTML><BODY></BODY></HTML>",
        "<html><BODY></Body></HTML>",
        "<html><body></body></html>",
        "<body></body>",
        ""
      ];

      const outputs = inputs.map(input => (new JSDOM(input)).serialize());

      for (const output of outputs) {
        assert.strictEqual(output, `<html><head></head><body></body></html>`);
      }
    });
  });

  describe("nodeLocation", () => {
    it("should throw when includeNodeLocations is left as the default (false)", () => {
      const dom = new JSDOM(`<p>Hello</p>`);
      const node = dom.window.document.querySelector("p");

      assert.throws(() => dom.nodeLocation(node));
    });

    it("should throw when includeNodeLocations is set explicitly to false", () => {
      const dom = new JSDOM(`<p>Hello</p>`, { includeNodeLocations: false });
      const node = dom.window.document.querySelector("p");

      assert.throws(() => dom.nodeLocation(node));
    });

    it("should give the correct location for an element", () => {
      const dom = new JSDOM(`<p>Hello</p>`, { includeNodeLocations: true });
      const node = dom.window.document.querySelector("p");

      assert.deepEqual(dom.nodeLocation(node), {
        endCol: 13,
        endLine: 1,
        startLine: 1,
        startCol: 1,
        startOffset: 0,
        endOffset: 12,
        startTag: { endCol: 4, endLine: 1, startLine: 1, startCol: 1, startOffset: 0, endOffset: 3 },
        endTag: { endCol: 13, endLine: 1, startLine: 1, startCol: 9, startOffset: 8, endOffset: 12 }
      });
    });

    it("should give the correct location for a text node", () => {
      const dom = new JSDOM(`<p>Hello</p>`, { includeNodeLocations: true });
      const node = dom.window.document.querySelector("p").firstChild;

      assert.deepEqual(dom.nodeLocation(node), {
        endCol: 9,
        endLine: 1,
        startLine: 1,
        startCol: 4,
        startOffset: 3,
        endOffset: 8
      });
    });

    it("should give the correct location for a void element", () => {
      const dom = new JSDOM(`<p>Hello
        <img src="foo.jpg">
      </p>`, { includeNodeLocations: true });
      const node = dom.window.document.querySelector("img");

      assert.deepEqual(dom.nodeLocation(node), {
        startTag: {
          attrs: {
            src: {
              endCol: 27,
              endLine: 2,
              startLine: 2,
              startCol: 14,
              startOffset: 22,
              endOffset: 35
            }
          },
          endCol: 28,
          endLine: 2,
          startLine: 2,
          startCol: 9,
          startOffset: 17,
          endOffset: 36
        },
        attrs: {
          src: {
            endCol: 27,
            endLine: 2,
            startLine: 2,
            startCol: 14,
            startOffset: 22,
            endOffset: 35
          }
        },
        endCol: 28,
        endLine: 2,
        startLine: 2,
        startCol: 9,
        startOffset: 17,
        endOffset: 36
      });
    });
  });

  describe("getInternalVMContext", { skipIfBrowser: true }, () => {
    it("should throw when runScripts is left as the default", () => {
      const dom = new JSDOM();

      assert.throws(() => dom.getInternalVMContext(), TypeError);

      assert.strictEqual(dom.window.ran, undefined);
    });

    it("should work when runScripts is set to \"outside-only\"", () => {
      const dom = new JSDOM(``, { runScripts: "outside-only" });
      const script = new vm.Script("this.ran = true;");

      script.runInContext(dom.getInternalVMContext());

      assert.strictEqual(dom.window.ran, true);
    });

    it("should work when runScripts is set to \"dangerously\"", () => {
      const dom = new JSDOM(``, { runScripts: "dangerously" });
      const script = new vm.Script("this.ran = true;");

      script.runInContext(dom.getInternalVMContext());

      assert.strictEqual(dom.window.ran, true);
    });

    it("should return the result of the evaluation", () => {
      const dom = new JSDOM(``, { runScripts: "outside-only" });
      const script = new vm.Script("5;");

      const result = script.runInContext(dom.getInternalVMContext());

      assert.strictEqual(result, 5);
    });

    it("should work with the same script multiple times", () => {
      const dom = new JSDOM(``, { runScripts: "outside-only" });
      const script = new vm.Script("if (!this.ran) { this.ran = 0; } ++this.ran;");

      script.runInContext(dom.getInternalVMContext());
      script.runInContext(dom.getInternalVMContext());
      script.runInContext(dom.getInternalVMContext());

      assert.strictEqual(dom.window.ran, 3);
    });

    it("should allow passing through options", () => {
      const dom = new JSDOM(``, { runScripts: "outside-only" });
      const script = new vm.Script("while(true) {}");

      assert.throws(
        () => script.runInContext(dom.getInternalVMContext(), { timeout: 50 }),
        /Script execution timed out(?: after 50ms|\.)/
      );
    });
  });

  describe("reconfigure", () => {
    describe("windowTop", () => {
      it("should reconfigure the window.top property (tested from the outside)", () => {
        const dom = new JSDOM();
        const newTop = { is: "top" };

        dom.reconfigure({ windowTop: newTop });

        assert.strictEqual(dom.window.top, newTop);
      });

      it("should reconfigure the window.top property (tested from the inside)", () => {
        const dom = new JSDOM(`<script>window.getTopResult = () => top.is;</script>`, { runScripts: "dangerously" });
        const newTop = { is: "top" };

        dom.reconfigure({ windowTop: newTop });

        assert.strictEqual(dom.window.getTopResult(), "top");
      });

      it("should do nothing when no options are passed", () => {
        const dom = new JSDOM();

        dom.reconfigure({ });

        assert.strictEqual(dom.window.top, dom.window);
      });

      it("should change window.top to undefined if passing undefined", () => {
        const dom = new JSDOM();

        dom.reconfigure({ windowTop: undefined });

        assert.strictEqual(dom.window.top, undefined);
      });
    });

    describe("url", () => {
      it("should successfully change the URL", () => {
        const dom = new JSDOM(``, { url: "http://example.com/" });
        const { window } = dom;

        assert.strictEqual(window.document.URL, "http://example.com/");

        function testPass(urlString, expected = urlString) {
          dom.reconfigure({ url: urlString });

          assert.strictEqual(window.location.href, expected);
          assert.strictEqual(window.document.URL, expected);
          assert.strictEqual(window.document.documentURI, expected);
        }

        testPass("http://localhost", "http://localhost/");
        testPass("http://www.localhost", "http://www.localhost/");
        testPass("http://www.localhost.com", "http://www.localhost.com/");
        testPass("https://localhost/");
        testPass("file://path/to/my/location/");
        testPass("http://localhost.subdomain.subdomain/");
        testPass("http://localhost:3000/");
        testPass("http://localhost/");
      });

      it("should throw and not impact the URL when trying to change to an unparseable URL", () => {
        const dom = new JSDOM(``, { url: "http://example.com/" });
        const { window } = dom;

        assert.strictEqual(window.document.URL, "http://example.com/");

        function testFail(url) {
          assert.throws(() => dom.reconfigure({ url }), TypeError);

          assert.strictEqual(window.location.href, "http://example.com/");
          assert.strictEqual(window.document.URL, "http://example.com/");
          assert.strictEqual(window.document.documentURI, "http://example.com/");
        }

        testFail("fail");
        testFail("/fail");
        testFail("fail.com");
        testFail(undefined);
      });


      it("should not throw and not impact the URL when no url option is given", () => {
        const dom = new JSDOM(``, { url: "http://example.com/" });
        const { window } = dom;

        assert.strictEqual(window.document.URL, "http://example.com/");

        assert.doesNotThrow(() => dom.reconfigure({ }));

        assert.strictEqual(window.location.href, "http://example.com/");
        assert.strictEqual(window.document.URL, "http://example.com/");
        assert.strictEqual(window.document.documentURI, "http://example.com/");
      });
    });
  });
});
