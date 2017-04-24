"use strict";
const jsdom = require("../../lib/old-api.js");

exports["a default window should have a history object with correct default values"] = t => {
  const window = jsdom.jsdom().defaultView;

  t.ok(window.history);
  t.strictEqual(window.history.state, null);
  t.strictEqual(window.history.length, 1);

  t.done();
};

exports["the history object should update correctly when calling pushState/replaceState"] = t => {
  const window = jsdom.jsdom("", { url: "http://www.example.org/" }).defaultView;

  window.addEventListener("popstate", () => {
    t.fail("popstate should not fire as a result of a pushState() or replaceState() call");
  });

  // Absolute path
  window.history.pushState({ foo: "one" }, "unused title", "/bar/baz#fuzz");
  t.strictEqual(window.history.length, 2);
  t.strictEqual(window.history.state.foo, "one");
  t.strictEqual(window.location.pathname, "/bar/baz");
  t.strictEqual(window.location.hash, "#fuzz");

  window.history.pushState({ foo: "two" }, "unused title 2", "/bar/foo#boo");
  t.strictEqual(window.history.length, 3);
  t.strictEqual(window.history.state.foo, "two");
  t.strictEqual(window.location.pathname, "/bar/foo");
  t.strictEqual(window.location.hash, "#boo");

  // Relative path
  window.history.pushState({ foo: "three" }, "unused title 3", "fizz");
  t.strictEqual(window.history.length, 4);
  t.strictEqual(window.history.state.foo, "three");
  t.strictEqual(window.location.pathname, "/bar/fizz");
  t.strictEqual(window.location.hash, "");

  window.history.replaceState({ foo: "four" }, "unused title 4", "/buzz");
  t.strictEqual(window.history.length, 4);
  t.strictEqual(window.history.state.foo, "four");
  t.strictEqual(window.location.pathname, "/buzz");

  t.done();
};

exports["the history object should update correctly when calling forward/back/go"] = t => {
  const window = jsdom.jsdom("", { url: "http://www.example.org/" }).defaultView;
  const initialPath = window.location.pathname;

  [
    [{ foo: "bar" }, "title 1", "/bar"],
    [{ foo: "baz" }, "title 2", "/baz"],
    [{ foo: "buzz" }, "title 3", "/buzz"]
  ].forEach(args => {
    window.history.pushState.apply(window.history, args);
  });

  // Sanity check
  t.strictEqual(window.history.length, 4);
  t.strictEqual(window.history.state.foo, "buzz");
  t.strictEqual(window.location.pathname, "/buzz");

  // Test forward boundary
  window.history.forward();
  t.strictEqual(window.history.length, 4);
  t.strictEqual(window.history.state.foo, "buzz");
  t.strictEqual(window.location.pathname, "/buzz");

  window.history.back();
  t.strictEqual(window.history.length, 4);

  // Should not change immediately.
  t.strictEqual(window.history.state.foo, "buzz");
  t.strictEqual(window.location.pathname, "/buzz");

  setTimeout(() => {
    // Should not even change after one task!
    t.strictEqual(window.history.state.foo, "buzz");
    t.strictEqual(window.location.pathname, "/buzz");

    setTimeout(() => {
      // It takes two tasks to change!
      t.strictEqual(window.history.state.foo, "baz");
      t.strictEqual(window.location.pathname, "/baz");

      // From hereon out we just assume this is correct and wait for it.

      window.history.back();
      waitForHistoryChange(() => {
        t.strictEqual(window.history.length, 4);
        t.strictEqual(window.history.state.foo, "bar");
        t.strictEqual(window.location.pathname, "/bar");

        window.history.back();

        waitForHistoryChange(() => {
          t.strictEqual(window.history.length, 4);
          t.strictEqual(window.history.state, null);
          t.strictEqual(window.location.pathname, initialPath);

          // Test backward boundary
          window.history.back();

          waitForHistoryChange(() => {
            t.strictEqual(window.history.length, 4);
            t.strictEqual(window.history.state, null);
            t.strictEqual(window.location.pathname, initialPath);

            window.history.go(2);

            waitForHistoryChange(() => {
              t.strictEqual(window.history.length, 4);
              t.strictEqual(window.history.state.foo, "baz");
              t.strictEqual(window.location.pathname, "/baz");

              t.done();
            });
          });
        });
      });
    }, 0);
  }, 0);
};

exports["the history object should update correctly when calling pushState with index behind length"] = t => {
  const window = jsdom.jsdom("", { url: "http://www.example.org/" }).defaultView;

  [
    [{ foo: "bar" }, "title 1", "/bar"],
    [{ foo: "baz" }, "title 2", "/baz"],
    [{ foo: "buzz" }, "title 3", "/buzz"]
  ].forEach(args => {
    window.history.pushState.apply(window.history, args);
  });

  // Sanity check
  t.strictEqual(window.history.length, 4);
  t.strictEqual(window.history.state.foo, "buzz");
  t.strictEqual(window.location.pathname, "/buzz");
  window.history.go(-2);

  waitForHistoryChange(() => {
    t.strictEqual(window.history.length, 4);
    t.strictEqual(window.history.state.foo, "bar");
    t.strictEqual(window.location.pathname, "/bar");

    // Call pushState when index is behind length
    window.history.pushState({ foo: "bar-b" }, "title 2b", "/bar/b");

    t.strictEqual(window.history.length, 3);
    t.strictEqual(window.history.state.foo, "bar-b");
    t.strictEqual(window.location.pathname, "/bar/b");

    t.done();
  });
};

exports["the history object should fire popstate on the window while navigating the history"] = t => {
  const window = jsdom.jsdom("", { url: "http://www.example.org/" }).defaultView;

  const state = { foo: "bar" };

  window.addEventListener("popstate", event => {
    t.strictEqual(event.bubbles, true);
    t.strictEqual(event.cancelable, false);
    t.strictEqual(event.state, state);

    t.done();
  });

  window.history.pushState(state, "title", "bar");
  window.history.pushState(null, "", "baz");
  window.history.back();
};

function waitForHistoryChange(fn) {
  // See notes above.
  setTimeout(() => setTimeout(fn, 0), 0);
}
