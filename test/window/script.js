var jsdom = require('../../lib/jsdom'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    jQueryPath = 'file:' + path.resolve(__dirname, '../jquery-fixtures/jquery-1.4.2.js');

exports.tests = {
  scripts_share_a_global_context: function(test) {
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

    test.equal(window.confirmTheLocalIsOnTheWindow, window.localOnWindow, 'local variables should be attached to the window');
    test.equal(window.hello, "hello world", 'window should be the global context');
    test.equal(window.bye, "goodbye", 'window should be the global context');
    test.equal(window.abc, 123, 'local vars should not leak out to the window');
    test.strictEqual(window.hidden, undefined, 'vars in a closure are safe');
    test.equal(window.exposed, 'hidden', 'vars exposed to the window are global');
    test.equal(window.imOnAWindow, true, 'setting this in the outer context should apply to the window');
    test.equal(window.object.a, 1, 'prototypes should be maintained across contexts');
    test.done();
  },

  scripts_jquerify_have_jsdom_class: function(test) {
    var window = jsdom.jsdom().defaultView;
    jsdom.jQueryify(window, jQueryPath, function (dom) {
      test.ok(dom.window.$('script').hasClass("jsdom"));
      test.done();
    });
  },

  scripts_env_have_jsdom_class: function(test) {
    var htmlString = '<html><head></head><body></body></html>';

    jsdom.env(htmlString, [jQueryPath] , function(error, dom) {
      test.ok(dom.window.$('script').hasClass("jsdom"));
      test.done();
    });
  },

  global_is_window_in_scripts: function(test){
    var window = jsdom.jsdom('<html><head>\
      <script type="text/javascript">\
        var results=[window===this,\
                     window===this.window,\
                     window.window===this,\
                     document.defaultView===this];\
      </script>\
      </head><body></body></html>').defaultView;

    test.strictEqual(window.results[0], true, "window should equal global this");
    test.strictEqual(window.results[1], true, "window should equal this.window");
    test.strictEqual(window.results[2], true, "this should equal window.window");
    test.strictEqual(window.results[3], true, "this should equal document.defaultView");
    test.strictEqual(window.document.defaultView, window, "outside window context, document.defaultView should be window as well");
    test.done();
  },

  global_in_object_should_be_valid_in_other_scripts: function(test){
    var window = jsdom.jsdom('<html><head>\
      <script>\
        aGlobal={win:this};\
      </script>\
      <script>\
        appVersion = aGlobal.win.navigator.appVersion\
      </script>\
      </head><body></body></html>').defaultView;

    test.strictEqual(window.appVersion, process.version);
    test.done();
  },

  window_functions: function(test){
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
    test.strictEqual(window.DONE, 1);
    test.done();
  },

  script_execution_in_body : function(test) {
    var window, caught = false;
    var html = '<html><body>\
      <script>\
        document.body.innerHTML = "monkey"\
      </script></body></html>';
    test.doesNotThrow(function() {
      jsdom.jsdom(html).defaultView;
    })
    test.done();
  },

  // see: https://github.com/tmpvar/jsdom/issues/163
  issue_163 : function(test) {
    jsdom.env('<a />', ['file:' + __dirname + '/files/163.js'], function(errors, window) {
      test.ok(!errors, 'no errors');
      test.ok(window.hasNativeObjects === true, 'window has the expected properties');
      test.done();
    });
  },

  // see: https://github.com/tmpvar/jsdom/issues/179
  issue_179 : function(test) {
    jsdom.env('<a />', ['file:' + __dirname + '/files/179.js'], function(errors, window) {
      test.ok(!errors, 'no errors');
      test.ok(window.b === 42, 'local var gets hung off of the window');
      test.ok(window.exposed === 42, 'read local var from window and exposed it');
      test.done();
    });
  },

  env_external_scripts_with_src: function (test) {
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
          test.strictEqual(err, null, 'no errors should occur');

          test.strictEqual(window.a, 'test', 'given src wasn\'t executed');
          test.strictEqual(window.b, 'other', 'external script wasn\'t executed');

          test.done();
          app.close();
        }
      });
    });
  },

  env_external_scripts_no_src: function (test) {
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
          test.strictEqual(err, null, 'no errors should occur');
          test.strictEqual(window.b, 'other', 'external script wasn\'t executed');

          test.done();
          app.close();
        }
      });
    });
  },

  timer_executes_in_context : function (test) {
    jsdom.env('<a />', ['file:' + __dirname + '/files/timer_in_context.js'], function (errors, window) {
      setTimeout(function () {
        test.ok(window.x == 1);
        test.done();
      }, 1);
    });
  }
};
