"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");

describe("history", () => {
  test(
    "a default window should have a history object with correct default values",
    () => {
      const { window } = new JSDOM();

      assert.ok(window.history);
      assert.equal(window.history.state, null);
      assert.equal(window.history.length, 1);
    }
  );

  test(
    "the history object should update correctly when calling pushState/replaceState",
    () => {
      const { window } = new JSDOM(``, { url: "http://www.example.org/" });

      window.addEventListener("popstate", () => {
        assert.fail("popstate should not fire as a result of a pushState() or replaceState() call");
      });

      // Absolute path
      window.history.pushState({ foo: "one" }, "unused title", "/bar/baz#fuzz");
      assert.equal(window.history.length, 2);
      assert.equal(window.history.state.foo, "one");
      assert.equal(window.location.pathname, "/bar/baz");
      assert.equal(window.location.hash, "#fuzz");

      window.history.pushState({ foo: "two" }, "unused title 2", "/bar/foo#boo");
      assert.equal(window.history.length, 3);
      assert.equal(window.history.state.foo, "two");
      assert.equal(window.location.pathname, "/bar/foo");
      assert.equal(window.location.hash, "#boo");

      // Relative path
      window.history.pushState({ foo: "three" }, "unused title 3", "fizz");
      assert.equal(window.history.length, 4);
      assert.equal(window.history.state.foo, "three");
      assert.equal(window.location.pathname, "/bar/fizz");
      assert.equal(window.location.hash, "");

      window.history.replaceState({ foo: "four" }, "unused title 4", "/buzz");
      assert.equal(window.history.length, 4);
      assert.equal(window.history.state.foo, "four");
      assert.equal(window.location.pathname, "/buzz");
    }
  );

  test(
    "the history object should update correctly when calling forward/back/go",
    (t, done) => {
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
      assert.equal(window.history.length, 4);
      assert.equal(window.history.state.foo, "buzz");
      assert.equal(window.location.pathname, "/buzz");

      // Test forward boundary
      window.history.forward();
      assert.equal(window.history.length, 4);
      assert.equal(window.history.state.foo, "buzz");
      assert.equal(window.location.pathname, "/buzz");

      window.history.back();
      assert.equal(window.history.length, 4);

      // Should not change immediately.
      assert.equal(window.history.state.foo, "buzz");
      assert.equal(window.location.pathname, "/buzz");

      setTimeout(() => {
        // Should not even change after one task!
        assert.equal(window.history.state.foo, "buzz");
        assert.equal(window.location.pathname, "/buzz");

        setTimeout(() => {
          // It takes two tasks to change!
          assert.equal(window.history.state.foo, "baz");
          assert.equal(window.location.pathname, "/baz");

          // From hereon out we just assume this is correct and wait for it.

          window.history.back();
          waitForHistoryChange(() => {
            assert.equal(window.history.length, 4);
            assert.equal(window.history.state.foo, "bar");
            assert.equal(window.location.pathname, "/bar");

            window.history.back();

            waitForHistoryChange(() => {
              assert.equal(window.history.length, 4);
              assert.equal(window.history.state, null);
              assert.equal(window.location.pathname, initialPath);

              // Test backward boundary
              window.history.back();

              waitForHistoryChange(() => {
                assert.equal(window.history.length, 4);
                assert.equal(window.history.state, null);
                assert.equal(window.location.pathname, initialPath);

                window.history.go(2);

                waitForHistoryChange(() => {
                  assert.equal(window.history.length, 4);
                  assert.equal(window.history.state.foo, "baz");
                  assert.equal(window.location.pathname, "/baz");

                  done();
                });
              });
            });
          });
        }, 0);
      }, 0);
    }
  );

  test(
    "the history object should update correctly when calling pushState with index behind length",
    (t, done) => {
      const { window } = new JSDOM(``, { url: "http://www.example.org/" });

      [
        [{ foo: "bar" }, "title 1", "/bar"],
        [{ foo: "baz" }, "title 2", "/baz"],
        [{ foo: "buzz" }, "title 3", "/buzz"]
      ].forEach(args => {
        window.history.pushState(...args);
      });

      // Sanity check
      assert.equal(window.history.length, 4);
      assert.equal(window.history.state.foo, "buzz");
      assert.equal(window.location.pathname, "/buzz");
      window.history.go(-2);

      waitForHistoryChange(() => {
        assert.equal(window.history.length, 4);
        assert.equal(window.history.state.foo, "bar");
        assert.equal(window.location.pathname, "/bar");

        // Call pushState when index is behind length
        window.history.pushState({ foo: "bar-b" }, "title 2b", "/bar/b");

        assert.equal(window.history.length, 3);
        assert.equal(window.history.state.foo, "bar-b");
        assert.equal(window.location.pathname, "/bar/b");

        done();
      });
    }
  );

  test(
    "the history object should fire popstate on the window while navigating the history",
    (t, done) => {
      const { window } = new JSDOM(``, { url: "http://www.example.org/" });

      const state = { foo: "bar" };

      window.addEventListener("popstate", event => {
        assert.equal(event.bubbles, false);
        assert.equal(event.cancelable, false);
        assert.equal(event.state, state);

        done();
      });

      window.history.pushState(state, "title", "bar");
      window.history.pushState(null, "", "baz");
      window.history.back();
    }
  );

  function waitForHistoryChange(fn) {
    // See notes above.
    setTimeout(() => setTimeout(fn, 0), 0);
  }
});
