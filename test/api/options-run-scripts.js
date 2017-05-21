"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("API: runScripts constructor option", () => {
  describe("<script>s and eval()", () => {
    it("should not execute any scripts by default", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`);

      assert.strictEqual(dom.window.document.body.children.length, 1);
      assert.strictEqual(dom.window.eval, undefined);
    });

    it("should not execute any scripts, even in iframes, by default (GH-1821)", () => {
      const dom = new JSDOM(`<iframe></iframe>`);
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.document.open();
      frameWindow.document.write(`<script>parent.prop = "i was executed";</script>`);
      frameWindow.document.close();

      assert.strictEqual(dom.window.prop, undefined);
      assert.strictEqual(frameWindow.eval, undefined);
    });

    it("should execute <script>s and eval when set to \"dangerously\"", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`, { runScripts: "dangerously" });
      dom.window.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.strictEqual(dom.window.document.body.children.length, 3);
    });

    it("should only run eval when set to \"outside-only\"", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`, { runScripts: "outside-only" });
      dom.window.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.strictEqual(dom.window.document.body.children.length, 2);
    });

    it("should ensure eval exists on iframes when set to \"outside-only\"", () => {
      const dom = new JSDOM(`<iframe></iframe>`, { runScripts: "outside-only" });
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.strictEqual(frameWindow.document.body.children.length, 1);
    });

    it("should execute <script>s in iframes when set to \"dangerously\"", () => {
      const dom = new JSDOM(`<iframe></iframe>`, { runScripts: "dangerously" });
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.document.open();
      frameWindow.document.write(`<script>parent.prop = "i was executed";</script>`);
      frameWindow.document.close();

      assert.strictEqual(dom.window.prop, "i was executed");
    });
  });

  it("should disallow other values", () => {
    assert.throws(() => new JSDOM(``, { runScripts: null }), RangeError);
    assert.throws(() => new JSDOM(``, { runScripts: "asdf" }), RangeError);
    assert.throws(() => new JSDOM(``, { runScripts: true }), RangeError);
    assert.throws(() => new JSDOM(``, { runScripts: false }), RangeError);
  });
});
