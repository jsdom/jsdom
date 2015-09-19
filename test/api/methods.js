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

      assert.strictEqual(dom.serialize(),
                         `<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>`);
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
        start: 0,
        end: 12,
        startTag: { start: 0, end: 3 },
        endTag: { start: 8, end: 12 }
      });
    });

    it("should give the correct location for a text node", () => {
      const dom = new JSDOM(`<p>Hello</p>`, { includeNodeLocations: true });
      const node = dom.window.document.querySelector("p").firstChild;

      assert.deepEqual(dom.nodeLocation(node), { start: 3, end: 8 });
    });

    it("should give the correct location for a void element", () => {
      const dom = new JSDOM(`<p>Hello
        <img src="foo.jpg">
      </p>`, { includeNodeLocations: true });
      const node = dom.window.document.querySelector("img");

      assert.deepEqual(dom.nodeLocation(node), { start: 17, end: 36 });
    });
  });

  describe("runVMScript", () => {
    it("should throw when runScripts is left as the default", () => {
      const dom = new JSDOM();
      const script = new vm.Script("this.ran = true;");

      assert.throws(() => dom.runVMScript(script), TypeError);

      assert.strictEqual(dom.window.ran, undefined);
    });

    it("should work when runScripts is set to \"outside-only\"", () => {
      const dom = new JSDOM(``, { runScripts: "outside-only" });
      const script = new vm.Script("this.ran = true;");

      dom.runVMScript(script);

      assert.strictEqual(dom.window.ran, true);
    });

    it("should work when runScripts is set to \"dangerously\"", () => {
      const dom = new JSDOM(``, { runScripts: "dangerously" });
      const script = new vm.Script("this.ran = true;");

      dom.runVMScript(script);

      assert.strictEqual(dom.window.ran, true);
    });

    it("should return the result of the evaluation", () => {
      const dom = new JSDOM(``, { runScripts: "outside-only" });
      const script = new vm.Script("5;");

      const result = dom.runVMScript(script);

      assert.strictEqual(result, 5);
    });

    it("should work with the same script multiple times", () => {
      const dom = new JSDOM(``, { runScripts: "outside-only" });
      const script = new vm.Script("if (!this.ran) { this.ran = 0; } ++this.ran;");

      dom.runVMScript(script);
      dom.runVMScript(script);
      dom.runVMScript(script);

      assert.strictEqual(dom.window.ran, 3);
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
        const dom = new JSDOM(``, { runScripts: "dangerously" });
        const newTop = { is: "top" };

        dom.reconfigure({ windowTop: newTop });

        dom.window.document.body.innerHTML = `<script>
          window.topResult = top.is;
        </script>`;

        assert.strictEqual(dom.window.topResult, "top");
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
        const window = dom.window;

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
        const window = dom.window;

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
        const window = dom.window;

        assert.strictEqual(window.document.URL, "http://example.com/");

        assert.doesNotThrow(() => dom.reconfigure({ }));

        assert.strictEqual(window.location.href, "http://example.com/");
        assert.strictEqual(window.document.URL, "http://example.com/");
        assert.strictEqual(window.document.documentURI, "http://example.com/");
      });
    });
  });
});
