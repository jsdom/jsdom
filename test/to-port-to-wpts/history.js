"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("history", () => {
  specify(
    "a default window should have a history object with correct default values",
    () => {
      const { window } = new JSDOM();

      assert.ok(window.history);
      assert.strictEqual(window.history.state, null);
      assert.strictEqual(window.history.length, 1);
    }
  );

  specify(
    "the history object should update correctly when calling pushState/replaceState",
    () => {
      const { window } = new JSDOM(``, { url: "http://www.example.org/" });

      window.addEventListener("popstate", () => {
        assert.fail("popstate should not fire as a result of a pushState() or replaceState() call");
      });

      // Absolute path
      window.history.pushState({ foo: "one" }, "unused title", "/bar/baz#fuzz");
      assert.strictEqual(window.history.length, 2);
      assert.strictEqual(window.history.state.foo, "one");
      assert.strictEqual(window.location.pathname, "/bar/baz");
      assert.strictEqual(window.location.hash, "#fuzz");

      window.history.pushState({ foo: "two" }, "unused title 2", "/bar/foo#boo");
      assert.strictEqual(window.history.length, 3);
      assert.strictEqual(window.history.state.foo, "two");
      assert.strictEqual(window.location.pathname, "/bar/foo");
      assert.strictEqual(window.location.hash, "#boo");

      // Relative path
      window.history.pushState({ foo: "three" }, "unused title 3", "fizz");
      assert.strictEqual(window.history.length, 4);
      assert.strictEqual(window.history.state.foo, "three");
      assert.strictEqual(window.location.pathname, "/bar/fizz");
      assert.strictEqual(window.location.hash, "");

      window.history.replaceState({ foo: "four" }, "unused title 4", "/buzz");
      assert.strictEqual(window.history.length, 4);
      assert.strictEqual(window.history.state.foo, "four");
      assert.strictEqual(window.location.pathname, "/buzz");
    }
  );

  specify(
    "the history object should update correctly when calling forward/back/go",
    t => {
      const { window } = new JSDOM(``, { url: "http://www.example.org/" });
      const initialPath = window.location.pathname;

      [
        [{ foo: "bar" }, "title 1", "/bar"],
        [{ foo: "baz" }, "title 2", "/baz"],
        [{ foo: "buzz" }, "title 3", "/buzz"]
      ].forEach(args => {
        window.history.pushState(...args);
      });

      // Sanity check
      assert.strictEqual(window.history.length, 4);
      assert.strictEqual(window.history.state.foo, "buzz");
      assert.strictEqual(window.location.pathname, "/buzz");

      // Test forward boundary
      window.history.forward();
      assert.strictEqual(window.history.length, 4);
      assert.strictEqual(window.history.state.foo, "buzz");
      assert.strictEqual(window.location.pathname, "/buzz");

      window.history.back();
      assert.strictEqual(window.history.length, 4);

      // Should not change immediately.
      assert.strictEqual(window.history.state.foo, "buzz");
      assert.strictEqual(window.location.pathname, "/buzz");

      setTimeout(() => {
        // Should not even change after one task!
        assert.strictEqual(window.history.state.foo, "buzz");
        assert.strictEqual(window.location.pathname, "/buzz");

        setTimeout(() => {
          // It takes two tasks to change!
          assert.strictEqual(window.history.state.foo, "baz");
          assert.strictEqual(window.location.pathname, "/baz");

          // From hereon out we just assume this is correct and wait for it.

          window.history.back();
          waitForHistoryChange(() => {
            assert.strictEqual(window.history.length, 4);
            assert.strictEqual(window.history.state.foo, "bar");
            assert.strictEqual(window.location.pathname, "/bar");

            window.history.back();

            waitForHistoryChange(() => {
              assert.strictEqual(window.history.length, 4);
              assert.strictEqual(window.history.state, null);
              assert.strictEqual(window.location.pathname, initialPath);

              // Test backward boundary
              window.history.back();

              waitForHistoryChange(() => {
                assert.strictEqual(window.history.length, 4);
                assert.strictEqual(window.history.state, null);
                assert.strictEqual(window.location.pathname, initialPath);

                window.history.go(2);

                waitForHistoryChange(() => {
                  assert.strictEqual(window.history.length, 4);
                  assert.strictEqual(window.history.state.foo, "baz");
                  assert.strictEqual(window.location.pathname, "/baz");

                  t.done();
                });
              });
            });
          });
        }, 0);
      }, 0);
    }, {
      async: true
    }
  );

  specify(
    "the history object should update correctly when calling pushState with index behind length",
    t => {
      const { window } = new JSDOM(``, { url: "http://www.example.org/" });

      [
        [{ foo: "bar" }, "title 1", "/bar"],
        [{ foo: "baz" }, "title 2", "/baz"],
        [{ foo: "buzz" }, "title 3", "/buzz"]
      ].forEach(args => {
        window.history.pushState(...args);
      });

      // Sanity check
      assert.strictEqual(window.history.length, 4);
      assert.strictEqual(window.history.state.foo, "buzz");
      assert.strictEqual(window.location.pathname, "/buzz");
      window.history.go(-2);

      waitForHistoryChange(() => {
        assert.strictEqual(window.history.length, 4);
        assert.strictEqual(window.history.state.foo, "bar");
        assert.strictEqual(window.location.pathname, "/bar");

        // Call pushState when index is behind length
        window.history.pushState({ foo: "bar-b" }, "title 2b", "/bar/b");

        assert.strictEqual(window.history.length, 3);
        assert.strictEqual(window.history.state.foo, "bar-b");
        assert.strictEqual(window.location.pathname, "/bar/b");

        t.done();
      });
    }, {
      async: true
    }
  );

  specify(
    "the history object should fire popstate on the window while navigating the history",
    t => {
      const { window } = new JSDOM(``, { url: "http://www.example.org/" });

      const state = { foo: "bar" };

      window.addEventListener("popstate", event => {
        assert.strictEqual(event.bubbles, false);
        assert.strictEqual(event.cancelable, false);
        assert.strictEqual(event.state, state);

        t.done();
      });

      window.history.pushState(state, "title", "bar");
      window.history.pushState(null, "", "baz");
      window.history.back();
    }, {
      async: true
    }
  );

  function waitForHistoryChange(fn) {
    // See notes above.
    setTimeout(() => setTimeout(fn, 0), 0);
  }
});
