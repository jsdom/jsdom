"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require('../..');
const toFileUrl = require("../util.js").toFileUrl(__dirname);

describe("script", () => {
  test('scripts_share_a_global_context', () => {
    var { window } = new JSDOM('\
      <html><head>\
      <script type="text/javascript">\
        Object.prototype.a = 1;\
        hello = "hello";\
        window.bye = "good";\
        var abc = 123;\
        var localOnWindow = "look at me, im on a window";\
      </script>\
      \
      <script type="text/javascript">\
        window.object = new Object();\
        hello += " world";\
        bye = bye + "bye";\
        window.confirmTheLocalIsOnTheWindow = localOnWindow;\
        (function() {\
          var hidden = "hidden";\
          window.exposed = hidden;\
          this.imOnAWindow = true;\
        })();\
      </script>\
      </head><body></body></html>',
      { runScripts: "dangerously" }
    );

    assert.equal(window.confirmTheLocalIsOnTheWindow, window.localOnWindow, 'local variables should be attached to the window');
    assert.equal(window.hello, "hello world", 'window should be the global context');
    assert.equal(window.bye, "goodbye", 'window should be the global context');
    assert.equal(window.abc, 123, 'local vars should not leak out to the window');
    assert.equal(window.hidden, undefined, 'vars in a closure are safe');
    assert.equal(window.exposed, 'hidden', 'vars exposed to the window are global');
    assert.equal(window.imOnAWindow, true, 'setting this in the outer context should apply to the window');
    assert.equal(window.object.a, 1, 'prototypes should be maintained across contexts');
  });

  test('global_is_window_in_scripts', () => {
    var { window } = new JSDOM('<html><head>\
      <script type="text/javascript">\
        var results=[window===this,\
                     window===this.window,\
                     window.window===this,\
                     document.defaultView===this];\
      </script>\
      </head><body></body></html>',
    { runScripts: "dangerously" });

    assert.equal(window.results[0], true, "window should equal global this");
    assert.equal(window.results[1], true, "window should equal this.window");
    assert.equal(window.results[2], true, "this should equal window.window");
    assert.equal(window.results[3], true, "this should equal document.defaultView");
    assert.equal(window.document.defaultView, window, "outside window context, document.defaultView should be window as well");
  });

  test('global_in_object_should_be_valid_in_other_scripts', () => {
    var { window } = new JSDOM('<html><head>\
      <script>\
        aGlobal={win:this};\
      </script>\
      <script>\
        appVersion = aGlobal.win.navigator.product\
      </script>\
      </head><body></body></html>',
    { runScripts: "dangerously"});

    assert.equal(window.appVersion, "Gecko");
  });

  test('window_functions', () => {
    var { window } = new JSDOM('<html><head>\
      <script>\
        function handle(){};\
        window.addEventListener("load", handle, false);\
        window.removeEventListener("load", handle, false);\
        var ev = document.createEvent("MouseEvents");\
        ev.initEvent("click", true, true);\
        window.dispatchEvent(ev);\
        window.DONE=1;\
      </script>\
      </head><body></body></html>',
    { runScripts: "dangerously" });
    assert.equal(window.DONE, 1);
  });

  test('timer_executes_in_context', (t, done) => {
    const { window } = new JSDOM(``, { runScripts: "dangerously", resources: "usable" });
    const script = window.document.createElement("script");
    script.src = toFileUrl('./files/timer_in_context.js');
    script.onload = () => {
      setTimeout(() => {
        assert.equal(window.x, 1);
        done();
      }, 1);
    };
    window.document.body.appendChild(script);
  });
});
