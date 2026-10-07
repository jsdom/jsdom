"use strict";
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../..");
const { Canvas } = require("../../lib/jsdom/utils.js");
const { implForWrapper } = require("../../lib/generated/idl/utils.js");

describe("canvas backend integration", () => {
  it("keeps canvas optional and does not fall back to node-canvas", () => {
    execFileSync(process.execPath, [
      "-e", `
      const assert = require("node:assert/strict");
      const Module = require("node:module");
      const load = Module._load;
      let legacyRequests = 0;
      Module._load = function (name, ...args) {
        if (name === "canvas") {
          ++legacyRequests;
          return {};
        }
        if (name === "@napi-rs/canvas") {
          throw new Error("optional backend unavailable");
        }
        return load.call(this, name, ...args);
      };
      const { JSDOM, VirtualConsole } = require(process.argv[1]);
      const errors = [];
      const virtualConsole = new VirtualConsole().on("jsdomError", error => errors.push(error));
      const { window } = new JSDOM("", { virtualConsole });
      const canvas = window.document.createElement("canvas");
      assert.equal(canvas.width, 300);
      assert.equal(canvas.getContext("2d"), null);
      assert.equal(canvas.toDataURL(), null);
      canvas.toBlob(() => assert.fail("unimplemented toBlob must not call back"));
      assert.equal(errors.length, 3);
      for (const error of errors) {
        assert.ok(error.message.includes("@napi-rs/canvas"));
      }
      assert.equal(new window.Image().naturalWidth, 0);
      assert.equal("decode" in window.HTMLImageElement.prototype, false);
      assert.equal(legacyRequests, 0, "the legacy backend must not be loaded");
      window.close();
    `, require.resolve("../..")
    ]);
  });

  if (Canvas) {
    for (const failure of ["throw", "reject"]) {
      it(`calls toBlob back asynchronously with null when native encoding fails (${failure})`, async () => {
        const { window } = new JSDOM();
        try {
          const canvas = window.document.createElement("canvas");
          canvas.getContext("2d");
          implForWrapper(canvas)._canvas.encode = () => {
            if (failure === "throw") {
              throw new Error("native encoding failure");
            }
            return Promise.reject(new Error("native encoding failure"));
          };
          let synchronous = true;
          let calledSynchronously;
          const result = new Promise(resolve => {
            canvas.toBlob(blob => {
              calledSynchronously = synchronous;
              resolve(blob);
            });
          });
          synchronous = false;
          assert.equal(await result, null);
          assert.equal(calledSynchronously, false);
        } finally {
          window.close();
        }
      });
    }

    for (const replacement of ["image", "empty", "removed"]) {
      it(`discards an obsolete native decode when src is replaced with ${replacement}`, async () => {
        const originalDecode = Canvas.Image.prototype.decode;
        const { window } = new JSDOM("", { resources: "usable" });
        let releaseDecode, decodingStarted;
        const blocked = new Promise(resolve => {
          releaseDecode = resolve;
        });
        const started = new Promise(resolve => {
          decodingStarted = resolve;
        });
        let first = true;
        Canvas.Image.prototype.decode = async function () {
          await originalDecode.call(this);
          if (first) {
            first = false;
            decodingStarted();
            await blocked;
          }
        };
        try {
          const source = window.document.createElement("canvas");
          source.width = 2;
          source.height = 2;
          const ctx = source.getContext("2d");
          ctx.fillStyle = "red";
          ctx.fillRect(0, 0, 2, 2);
          const image = new window.Image();
          let loadCount = 0;
          image.addEventListener("load", () => ++loadCount);
          image.addEventListener("error", () => assert.fail("obsolete requests must not fire error"));
          image.src = source.toDataURL();
          await started;
          assert.equal(implForWrapper(window.document)._requestManager.size(), 1);
          assert.equal(image.complete, false);
          assert.equal(image.currentSrc, "");
          let finished;
          if (replacement === "image") {
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, 2, 2);
            finished = new Promise(resolve => {
              image.addEventListener("load", resolve, { once: true });
            });
            image.src = source.toDataURL();
          } else {
            if (replacement === "empty") {
              image.src = "";
            } else {
              image.removeAttribute("src");
            }
            finished = new Promise(resolve => {
              window.addEventListener("load", resolve, { once: true });
            });
          }
          releaseDecode();
          await finished;
          assert.equal(loadCount, replacement === "image" ? 1 : 0);
          assert.equal(image.complete, true);
          if (replacement === "image") {
            assert.equal(image.currentSrc, image.src);
            ctx.drawImage(image, 0, 0);
            assert.deepEqual([...ctx.getImageData(0, 0, 1, 1).data], [0, 0, 255, 255]);
          } else {
            assert.equal(image.currentSrc, "");
            assert.equal(image.naturalWidth, 0);
          }
        } finally {
          releaseDecode();
          Canvas.Image.prototype.decode = originalDecode;
          window.close();
        }
      });
    }
  }
});
