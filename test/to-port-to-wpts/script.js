"use strict";

const path = require('path');
const fs = require('fs');
const http = require('http');

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require('../../lib/old-api.js');
const jQueryPath = 'file:' + path.resolve(__dirname, '../jquery-fixtures/jquery-1.4.2.js');

describe("script", { skipIfBrowser: true }, () => {
  specify('scripts_share_a_global_context', () => {
    var window = jsdom.jsdom('\
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
      </head><body></body></html>'
    ).defaultView;

    assert.equal(window.confirmTheLocalIsOnTheWindow, window.localOnWindow, 'local variables should be attached to the window');
    assert.equal(window.hello, "hello world", 'window should be the global context');
    assert.equal(window.bye, "goodbye", 'window should be the global context');
    assert.equal(window.abc, 123, 'local vars should not leak out to the window');
    assert.strictEqual(window.hidden, undefined, 'vars in a closure are safe');
    assert.equal(window.exposed, 'hidden', 'vars exposed to the window are global');
    assert.equal(window.imOnAWindow, true, 'setting this in the outer context should apply to the window');
    assert.equal(window.object.a, 1, 'prototypes should be maintained across contexts');
  });

  specify('scripts_jquerify_have_jsdom_class', (t) => {
    var window = jsdom.jsdom().defaultView;
    jsdom.jQueryify(window, jQueryPath, function (dom) {
      assert.ok(dom.window.$('script').hasClass("jsdom"));
      t.done();
    });
  }, {
    async: true
  });

  specify('scripts_env_have_jsdom_class', (t) => {
    var htmlString = '<html><head></head><body></body></html>';

    jsdom.env(htmlString, [jQueryPath] , function(error, dom) {
      assert.ok(dom.window.$('script').hasClass("jsdom"));
      t.done();
    });
  }, {
    async: true
  });

  specify('global_is_window_in_scripts', () => {
    var window = jsdom.jsdom('<html><head>\
      <script type="text/javascript">\
        var results=[window===this,\
                     window===this.window,\
                     window.window===this,\
                     document.defaultView===this];\
      </script>\
      </head><body></body></html>').defaultView;

    assert.strictEqual(window.results[0], true, "window should equal global this");
    assert.strictEqual(window.results[1], true, "window should equal this.window");
    assert.strictEqual(window.results[2], true, "this should equal window.window");
    assert.strictEqual(window.results[3], true, "this should equal document.defaultView");
    assert.strictEqual(window.document.defaultView, window, "outside window context, document.defaultView should be window as well");
  });

  specify('global_in_object_should_be_valid_in_other_scripts', () => {
    var window = jsdom.jsdom('<html><head>\
      <script>\
        aGlobal={win:this};\
      </script>\
      <script>\
        appVersion = aGlobal.win.navigator.product\
      </script>\
      </head><body></body></html>').defaultView;

    assert.strictEqual(window.appVersion, "Gecko");
  });

  specify('window_functions', () => {
    var window = jsdom.jsdom('<html><head>\
      <script>\
        function handle(){};\
        window.addEventListener("load", handle, false);\
        window.removeEventListener("load", handle, false);\
        var ev = document.createEvent("MouseEvents");\
        ev.initEvent("click", true, true);\
        window.dispatchEvent(ev);\
        window.DONE=1;\
      </script>\
      </head><body></body></html>').defaultView;
    assert.strictEqual(window.DONE, 1);
  });

  specify('script_execution_in_body', () => {
    var window, caught = false;
    var html = '<html><body>\
      <script>\
        document.body.innerHTML = "monkey"\
      </script></body></html>';
    assert.doesNotThrow(function() {
      jsdom.jsdom(html).defaultView;
    })
  });

  // see: https://github.com/tmpvar/jsdom/issues/163
  specify('issue_163', (t) => {
    jsdom.env('<a />', ['file:' + __dirname + '/files/163.js'], function(errors, window) {
      assert.ok(!errors, 'no errors');
      assert.ok(window.hasNativeObjects === true, 'window has the expected properties');
      t.done();
    });
  }, {
    async: true
  });

  // see: https://github.com/tmpvar/jsdom/issues/179
  specify('issue_179', (t) => {
    jsdom.env('<a />', ['file:' + __dirname + '/files/179.js'], function(errors, window) {
      assert.ok(!errors, 'no errors');
      assert.ok(window.b === 42, 'local var gets hung off of the window');
      assert.ok(window.exposed === 42, 'read local var from window and exposed it');
      t.done();
    });
  }, {
    async: true
  });

  specify('env_external_scripts_with_src', (t) => {
    var app = http.createServer(function (req, res) {
      fs.createReadStream(__dirname + '/files' + req.url).pipe(res);
    }).listen(0, function () {
      jsdom.env({
        url: 'http://127.0.0.1:' + app.address().port + '/external_script.html',
        src: ['window.a = "test";'],
        features: {
          FetchExternalResources: ['script'],
          ProcessExternalResources: ['script'],
          SkipExternalResources: false
        },
        done: function (err, window) {
          assert.strictEqual(err, null, 'no errors should occur');

          assert.strictEqual(window.a, 'test', 'given src wasn\'t executed');
          assert.strictEqual(window.b, 'other', 'external script wasn\'t executed');

          t.done();
          app.close();
        }
      });
    });
  }, {
    async: true
  });

  specify('env_external_scripts_no_src', (t) => {
    var app = http.createServer(function (req, res) {
      fs.createReadStream(__dirname + '/files' + req.url).pipe(res);
    }).listen(0, function () {
      jsdom.env({
        url: 'http://127.0.0.1:' + app.address().port + '/external_script.html',
        features: {
          FetchExternalResources: ['script'],
          ProcessExternalResources: ['script'],
          SkipExternalResources: false
        },
        done: function (err, window) {
          assert.strictEqual(err, null, 'no errors should occur');
          assert.strictEqual(window.b, 'other', 'external script wasn\'t executed');

          t.done();
          app.close();
        }
      });
    });
  }, {
    async: true
  });

  specify('timer_executes_in_context', (t) => {
    jsdom.env('<a />', ['file:' + __dirname + '/files/timer_in_context.js'], function (errors, window) {
      setTimeout(function () {
        assert.ok(window.x == 1);
        t.done();
      }, 1);
    });
  }, {
    async: true
  });
});
