var path = require("path");
var fs   = require("fs");
var jsdom = require('../../lib/jsdom');

exports.tests = {
  build_window: function(test) {
    var window = jsdom.jsdom().createWindow();
    test.notEqual(window, null, 'window should not be null');
    test.notEqual(window.document, null, 'window.document should not be null');
    test.done();
  },

  jsdom_takes_html: function(test) {
    var document = jsdom.jsdom('<a id="test" href="#test">');
    test.equal(document.getElementById("test").getAttribute("href"), '#test', 'Passing html into jsdom() should populate the resulting doc');
    test.done();
  },

  jsdom_method_creates_default_document: function(test) {
    var doc = jsdom.jsdom();
    test.equal(doc.documentElement.nodeName, 'HTML', 'Calling jsdom.jsdom() should automatically populate the doc');
    test.done();
  },

  jquerify: function(test) {
    var jQueryFile = __dirname + "/../../example/jquery/jquery.js",
    jQueryUrl = "http://code.jquery.com/jquery-1.4.4.min.js";

    function tmpWindow() {
      return jsdom.jsdom(null, null, {documentRoot: __dirname}).createWindow();
    }

    // TODO: may need to run this as two different tests... the test seems to be ending before the second callback is happening
    function testFunction(window, jQuery) {
      test.notEqual(window.jQuery.find, null, 'window.jQuery.find should not be null');
      test.notEqual(jQuery.find, null, 'jQuery.find should not be null');
      jQuery("body").html('<p id="para"><a class="link">click <em class="emph">ME</em></a></p>');
      var res = jQuery("#para .emph").text();
      var res2 = jQuery("a.link .emph").text();
      test.equal(jQuery('p#para a.link',window.document.body).attr('class'), 'link', "selecting from body");
      test.strictEqual(jQuery('body').jquery, '1.4.4', 'jQuery version 1.4.4');
      test.equal(res, "ME", "selector should work as expected");
      test.equal(res2, "ME", "selector should work as expected");
    };

    // test.expect(12);
    jsdom.jQueryify(tmpWindow(), jQueryFile, testFunction);
    jsdom.jQueryify(tmpWindow(), jQueryUrl, testFunction);
    test.done();
  },

  env_with_absolute_file: function(test) {
    jsdom.env({
      html: path.join(__dirname, 'files', 'env.html'),
      scripts: [path.join(__dirname, '..', '..', 'example', 'jquery', 'jquery.js')],
      done: function(errors, window) {
        test.equal(errors, null, 'errors should be null');
        var $ = window.jQuery, text = 'Let\'s Rock!';
        $('body').text(text);
        test.equal($('body').text(), text, 'jsdom.env() should load jquery, a document and add some text to the body');
        test.done();
      }
    });
  },

  env_with_html: function(test) {
    var html = "<html><body><p>hello world!</p></body></html>";
    jsdom.env({
      html: html,
      done: function(errors, window) {
  test.equal(errors, null, 'errors should be null');
        test.notEqual(window.location, null, 'window.location should not be null');
        test.done();
      }
    })
  },

  env_with_overridden_url : function(test) {
    var html = "<html><body><p>hello world!</p></body></html>";
    jsdom.env({
      html : html,
      url  : 'http://www.example.com/',
      done : function(errors, window) {
        test.ok(null === errors, "error should be null");
        test.equal("http://www.example.com/",
                   window.location.href,
                   "location can be overriden by config.url");
        test.done();
      }
    })
  },

  env_with_non_existant_script : function(test) {
    var html = "<html><body><p>hello world!</p></body></html>";
    jsdom.env({
      html: html,
      scripts: ['path/to/invalid.js', 'another/invalid.js'],
      done: function(errors, window) {
        test.notEqual(errors, null, 'errors should not be null');
        test.equal(errors.length, 2, 'errors is an array')
        test.notEqual(window.location, null, 'window.location should not be null');
        test.done();
      }
    });
  },

  env_with_url: function(test) {
    // spawn an http server
    var routes = {
      "/js": "window.attachedHere = 123",
      "/html": "<a href='/path/to/hello'>World</a>"
    };

    var server = require("http").createServer(function(req, res) {
      res.writeHead(200, {"Content-length": routes[req.url].length});
      res.end(routes[req.url]);
    });

    var cb = function() {
      jsdom.env({
        html: "http://127.0.0.1:64000/html",
        scripts: "http://127.0.0.1:64000/js",
        done: function(errors, window) {
          server.close();
          if (errors) {
            test.ok(false, errors.message)
          } else {
            test.notEqual(window.location, null, 'window.location should not be null');
            test.equal(window.attachedHere, 123, 'script should execute on our window');
            test.equal(window.document.getElementsByTagName("a").item(0).innerHTML, 'World', 'anchor text');
          }
          test.done();
        }
      });
    };
    server.listen(64000, '127.0.0.1', cb);
  },

  env_with_src : function(test) {
    var
    html = "<html><body><p>hello world!</p></body></html>",
    src  = "window.attachedHere = 123";

    jsdom.env({
      html    : html,
      src     : src,
      done    : function(errors, window) {
        test.ok(null === errors, "error should not be null");
        test.ok(null !== window.location, "window should be valid");
        test.equal(window.attachedHere, 123, "script should execute on our window")
        test.equal(window.document.getElementsByTagName("p").item(0).innerHTML, 'hello world!', "anchor text");
        test.done();
      }
    });
  },

  env_processArguments_invalid_args: function(test) {
    test.throws(function(){ jsdom.env.processArguments(); });
    test.throws(function(){ jsdom.env.processArguments({}); });
    test.throws(function(){ jsdom.env.processArguments([{html: 'abc123'}]); });
    test.throws(function(){ jsdom.env.processArguments([{done: function(){}}]); });
    test.done();
  },

  env_processArguments_config_object: function(test) {
    var config = jsdom.env.processArguments([{html: "", done: function(){}}]);
    test.notEqual(config.done, null, 'config.done should not be null');
    test.notEqual(config.html, null, 'config.html should not be null');
    test.done();
  },

  env_processArguments_object_and_callback : function(test) {
    var config = jsdom.env.processArguments([{
      html    : "",
      scripts : ['path/to/some.js', 'another/path/to.js'],
      url     : 'http://www.example.com/'
    },
    function() {}
    ]);

    test.notEqual(null, config.done, "has done");
    test.notEqual(null, config.html, "has html");
    test.notEqual(null, config.url, 'has url');
    test.equal(2, config.scripts.length, 'has code');
    test.done();
  },

  env_processArguments_object_and_callback: function(test) {
    var config = jsdom.env.processArguments([{html: "", scripts: ['path/to/some.js', 'another/path/to.js']}, function(){}]);
    test.notEqual(config.done, null, 'config.done should not be null');
    test.notEqual(config.html, null, 'config.html should not be null');
    test.equal(config.scripts.length, 2, 'has code');
    test.done();
  },

  env_processArguments_all_args_no_config: function(test) {
    var config = jsdom.env.processArguments(["<html></html>", ['script.js'], function(){}]);
    test.notEqual(config.done, null, 'config.done should not be null');
    test.notEqual(config.html, null, 'config.html should not be null');
    test.equal(config.scripts.length, 1, 'script length should be 1');
    test.done();
  },

  env_processArguments_all_args_with_config: function(test) {
    var config = jsdom.env.processArguments(
      ["<html></html>",
      ['script.js'],
      {features: [], url : 'http://www.example.com/'},
      function(){}
    ]);

    test.notEqual(config.done, null, 'config.done should not be null');
    test.notEqual(config.html, null, 'config.html should not be null');
    test.equal(config.scripts.length, 1, 'script length should be 1');
    test.equal(config.url, 'http://www.example.com/', 'has url');
    test.notEqual(config.config.features, null, 'config.config.features should not be null');
    test.done();
  },

  plain_window_document: function(test) {
    var window = (jsdom.createWindow());
    test.strictEqual(typeof window.document, 'undefined', 'jsdom.createWindow() should create a documentless window');
    test.done();
  },

  appendChild_to_document_with_existing_documentElement: function(test) {
    test.expect(2);
    t = function(){
      try {
        var doc = jsdom.jsdom();
        doc.appendChild(doc.createElement('html'));
      } catch (e) {
        test.equal(e.code, 3, 'Should throw HIERARCHY_ERR')
        code = e.code;
        throw(e);
      }
    };
    test.throws(t);
    test.done();
  },

  // TODO: break into two tests
  apply_jsdom_features_at_build_time: function(test) {
    var doc  = new (jsdom.defaultLevel.Document)(),
        doc2 = new (jsdom.defaultLevel.Document)(),
        defaults = jsdom.defaultDocumentFeatures;
    jsdom.applyDocumentFeatures(doc);
    for (var i=0; i<defaults.length; i++) {
      test.ok(doc.implementation.hasFeature(defaults[i]), 'Document has all of the default features');
    }
    jsdom.applyDocumentFeatures(doc2, {'FetchExternalResources': false});
    test.ok(doc2.implementation.hasFeature('ProcessExternalResources'), 'Document has ProcessExternalResources');
    test.equal(doc2.implementation.hasFeature('FetchExternalResources'), false, 'Document does not have \'FetchExternalResources\'');
    test.done();
  },

  ensure_scripts_can_be_disabled_via_options_features: function(test) {
    var html = '\
<html>\
  <head>\
    <script type="text/javascript" src="./files/hello.js"></script>\
  </head>\
  <body>\
    <span id="test">hello from html</span>\
  </body>\
</html>';

    var doc2 = jsdom.jsdom(html, null, {features: {FetchExternalResources: ['script'], ProcessExternalResources: false}});
    doc2.onload = function() {
      test.equal(doc2.getElementById("test").innerHTML, 'hello from html', 'js should not be executed (doc2)');
      test.done();
    }
  },

  load_mutiple_resources_with_defer_close: function(test) {
    var html = '<html><head></head><body>\
<frame src="../level2/html/files/iframe.html"></frame>\
<frame src="../level2/html/files/iframe.html"></frame>\
<frame src="../level2/html/files/iframe.html"></frame>\
</body></html>';

    var doc = jsdom.jsdom(html, null, {features: {FetchExternalResources: ['frame'], ProcessExternalResources: ['frame']}, 
      deferClose:true});
    
    test.ok(doc._queue.paused, 'resource queue should be paused');

    var check_handle, timeout_handle = setTimeout(function() {
        doc.onload=null;
        doc.parentWindow.close();
	if(check_handle) {
	  clearTimeout(check_handle);
	}
	test.ok(false, "timed out when waiting for onload to fire");
	test.done();
    }, 1000); //1 second timeout
    function check() {
      var q = doc._queue, h = q.tail, count=0;

      check_handle = null;
      while(h){
        if(h.fired) {
          count++;
          h = h.prev;
        } else {
          check_handle = setTimeout(check, 50);
          return;
        }
      }
      test.equal(count, 3, 'there should be 3 resources in the resource queue');
      doc.close();
    }
    check_handle = setTimeout(check, 50);
    doc.onload = function() {
      clearTimeout(timeout_handle);
      test.done();
    };
  },

  resource_queue: function(test) {
    //ResourceQueue is not exported, so grab it from a doc
    var doc = jsdom.jsdom(), q = doc._queue, counter = 0, increment=function() {counter++;};
    
    var queueHandles = [q.push(increment), q.push(increment)];
    queueHandles[0](null, true);
    queueHandles.push(q.push(increment));
    queueHandles[1](null, true);
    queueHandles[2](null, true);
    test.strictEqual(counter, 3);
    test.strictEqual(q.tail, null);
    test.done();
  },

  understand_file_protocol: function(test) {
    var html = '\
<html>\
  <head>\
    <script type="text/javascript" src="file://'+__dirname+'/files/hello.js"></script>\
  </head>\
  <body>\
    <span id="test">hello from html</span>\
  </body>\
</html>';

   var doc = jsdom.jsdom(html);
   doc.onload = function() {
     test.equal(doc.getElementById("test").innerHTML, 'hello from javascript', 'resource with file protocol should work');
     test.done();
   };
  },

  importNode: function(test) {
    test.doesNotThrow(function() {
      var doc1 = jsdom.jsdom('<html><body><h1 id="headline">Hello <span id="world">World</span></h1></body></html>'),
          doc2 = jsdom.jsdom();
      doc2.body.appendChild(doc2.importNode(doc1.getElementById('headline'), true));
      doc2.getElementById('world').className = 'foo';
    });
    test.done();
  },

  window_is_augmented_with_dom_features: function(test) {
    var document = jsdom.jsdom(),
        window   = document.createWindow();
    test.ok(window._augmented, 'window must be augmented');
    test.notEqual(window.Element, null, 'window.Element should not be null');
    test.done();
  },

  queryselector: function(test) {
    var html = '<html><body><div id="main"><p>Foo</p><p>Bar</p></div></body></html>',
        document = jsdom.jsdom(html, null, {features: {'QuerySelector': true}}),
        div = document.body.children.item(0);
    var element = document.querySelector("#main p");
    test.equal(element, div.children.item(0), 'p and first-p');
    var element2 = div.querySelector("p");
    test.equal(element2, div.children.item(0), 'p and first-p');
    test.done();
  },

  // TODO: look into breaking into a testcase
  queryselectorall: function(test) {
    var html = '<html><body><div id="main"><p>Foo</p><p>Bar</p></div></body></html>',
        document = jsdom.jsdom(html, null, {features: {'QuerySelector': true}}),
        div = document.body.children.item(0),
        elements = document.querySelectorAll("#main p");
    test.equal(elements.length, 2, 'two results');
    test.equal(elements.item(0), div.children.item(0), 'p and first-p');
    test.equal(elements.item(1), div.children.item(1), 'p and second-p');
    var elements2 = div.querySelectorAll("p");
    test.equal(elements2.length, 2, 'two results');
    test.equal(elements2.item(0), div.children.item(0), 'p and first-p');
    test.equal(elements2.item(1), div.children.item(1), 'p and second-p');
    var elements3 = div.querySelectorAll("#main p");
    test.equal(elements3.length, 2, 'two results');
    test.equal(elements3.item(0), div.children.item(0), 'p and first-p');
    test.equal(elements3.item(1), div.children.item(1), 'p and second-p');
    var topNode = document.createElement('p'),
        newNode = document.createElement('p');
    topNode.id = "fuz";
    newNode.id = "buz";
    topNode.appendChild(newNode);
    var elements4 = topNode.querySelectorAll("#fuz #buz");
    test.equal(elements4.length, 1, 'one result');
    test.equal(elements4.item(0), newNode, 'newNode and first-p');
    test.done();
  },

  // TODO: look into breaking into a testcase
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
    ).createWindow();

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

  global_is_window_in_scripts: function(test){
    var window = jsdom.jsdom('<html><head><script type="text/javascript">\
var results=[window===this, window===this.window, window.window===this, document.parentWindow===this];\
</script></head><body></body></html>').createWindow();

    test.strictEqual(window.results[0], true, "window should equal global this");
    test.strictEqual(window.results[1], true, "window should equal this.window");
    test.strictEqual(window.results[2], true, "this should equal window.window");
    test.strictEqual(window.results[3], true, "this should equal document.parentWindow");
    test.strictEqual(window.document.parentWindow, window, "outside window context, document.parentWindow should be window as well");
    test.done();
  },

  global_in_object_should_be_valid_in_other_scripts: function(test){
    var window = jsdom.jsdom('<html><head><script>\
aGlobal={win:this};\
</script><script>\
appVersion = aGlobal.win.navigator.appVersion\
</script></head><body></body></html>').createWindow();

    test.strictEqual(window.appVersion, process.version);
    test.done();
  },

  window_functions: function(test){
    var window = jsdom.jsdom('<html><head><script>function handle(){};\
window.addEventListener("load", handle, false);\
window.removeEventListener("load", handle, false);\
var ev = document.createEvent("MouseEvents");ev.initEvent("click", true, true);window.dispatchEvent(ev);\
console.log("ok");\
window.DONE=1;</script></head><body></body></html>').createWindow();
    test.strictEqual(window.DONE, 1);
    test.done();
  },

  frame_parent: function(test) {
    var window = jsdom.jsdom('<html><head><script>aGlobal=1;\
var iframe = document.createElement("iframe");\
iframe.src = "' + __dirname + '/files/iframe.html";\
document.body.appendChild(iframe);</script></head>\
<body></body></html>',null, {features:{FetchExternalResources: ['script','iframe'], 
      ProcessExternalResources: ['script','iframe']}}).createWindow();
    window.iframe.onload = function(){
      test.strictEqual(window.DONE, 1);
      test.strictEqual(window.PARENT_IS_TOP, true);

      //insert a script tag to make sure the global set in the iframe is visible
      //in the parent window context
      var doc = window.document, script = doc.createElement('script');
      script.textContent = 'results=[aGlobal, DONE, PARENT_IS_TOP]';
      doc.body.appendChild(script);
      //the script is executed asynchronously after insertion to the document, 
      //so setTimeout is needed
      setTimeout(function(){
        test.deepEqual(window.results, [1, 1, true]);
        test.done();
      },0);
    };
  },

  frame_src_relative_to_parent_doc: function(test) {
    var window = jsdom.jsdom('<html><body>\
<iframe src="./files/iframe.html"></iframe>\
</body></html>',null, {url:__dirname+"/test.html", features:{FetchExternalResources: ['script','iframe'], 
      ProcessExternalResources: ['script','iframe']}}).createWindow();
    window.document.onload = function(){
      test.strictEqual(window.LOADED_FRAME, 1);
      test.strictEqual(window.PARENT_IS_TOP, true);
      test.done();
    };
  },

  url_resolution: function(test) {
    var html = '\
  <html>\
    <head></head>\
    <body>\
      <a href="http://example.com" id="link1">link1</a>\
      <a href="/local.html" id="link2">link2</a>\
      <a href="local.html" id="link3">link3</a>\
      <a href="../../local.html" id="link4">link4</a>\
      <a href="#here" id="link5">link5</a>\
      <a href="//example.com/protocol/avoidance.html" id="link6">protocol</a>\
    </body>\
  </html>'

    function testLocal() {
      var url = '/path/to/docroot/index.html'
      var doc = jsdom.jsdom(html, null, {url: url});
      test.equal(doc.getElementById("link1").href, 'http://example.com', 'Absolute URL should be left alone');
      test.equal(doc.getElementById("link2").href, '/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link3").href, '/path/to/docroot/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link4").href, '/path/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link5").href, '/path/to/docroot/index.html#here', 'Relative URL should be resolved');
      //test.equal(doc.getElementById("link6").href, '//prototol/avoidance.html', 'Protocol-less URL should be resolved');
    }

    function testRemote() {
      var url = 'http://example.com/path/to/docroot/index.html'
      var doc = jsdom.jsdom(html, null, {url: url});
      test.equal(doc.getElementById("link1").href, 'http://example.com', 'Absolute URL should be left alone');
      test.equal(doc.getElementById("link2").href, 'http://example.com/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link3").href, 'http://example.com/path/to/docroot/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link4").href, 'http://example.com/path/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link5").href, 'http://example.com/path/to/docroot/index.html#here', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link6").href, 'http://example.com/protocol/avoidance.html', 'Relative URL should be resolved');
    }

    function testBase() {
      var url  = 'blahblahblah-invalid',
          doc  = jsdom.jsdom(html, null, {url: url}),
          base = doc.createElement("base");
      base.href = 'http://example.com/path/to/docroot/index.html';
      doc.getElementsByTagName("head").item(0).appendChild(base);
      test.equal(doc.getElementById("link1").href, 'http://example.com', 'Absolute URL should be left alone');
      test.equal(doc.getElementById("link2").href, 'http://example.com/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link3").href, 'http://example.com/path/to/docroot/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link4").href, 'http://example.com/path/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link5").href, 'http://example.com/path/to/docroot/index.html#here', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link6").href, 'http://example.com/protocol/avoidance.html', 'Relative URL should be resolved');
    }

    testLocal();
    testRemote();
    testBase();
    test.done();
  },

  numeric_values: function(test) {
    var html = '<html><body><td data-year="2011" data-month="0" data-day="9">\
                  <a href="#" class=" ">9</a> \
                </td></body></html>';
    var document = jsdom.jsdom(html);
    var a = document.body.children.item(0);

    a.innerHTML = 9;
    a.setAttribute('id', 123);
    test.strictEqual(a.innerHTML, '9', 'Element stringify');
    test.strictEqual(a.getAttributeNode('id').nodeValue, '123', 'Attribute stringify');
    test.done();
  },

  auto_tostring: function(test) {
    var buffer = require("fs").readFileSync(__dirname + "/files/env.html"),
        dom;
    test.doesNotThrow(function(){ dom = jsdom.jsdom(buffer); }, 'buffers should automatically be stringified');
    test.equal(dom.documentElement.getElementsByTagName("*").length, 3, 'should parse as per usual')
    test.done();
  },

  document_should_expose_location: function(test) {
    var window = jsdom.jsdom("").createWindow();
    test.strictEqual(window.document.location, window.location, 'document.location and window.location');
    test.done();
  },

  script_execution_in_body : function(test) {
    var window, caught = false;
    var html = '<html><body><script>document.body.innerHTML = "monkey"</script></body></html>';
    test.doesNotThrow(function() {
      jsdom.jsdom(html).createWindow();
    })
    test.done();
  },

  mutation_events : function(test) {
    var document = jsdom.jsdom();
    document.implementation.addFeature('MutationEvents', '2.0');
    var created = '';
    var removed = '';
    document.addEventListener('DOMNodeInserted', function(ev) {
      created += ev.target.tagName;
    });
    document.addEventListener('DOMNodeRemoved', function(ev) {
      removed += ev.target.tagName;
    });
    var h1 = document.createElement('h1');
    var h2 = document.createElement('h2');
    var h3 = document.createElement('h3');

    document.body.appendChild(h2);
    document.body.insertBefore(h1, h2);
    document.body.insertBefore(h3, null);
    test.strictEqual('H2H1H3', created, "an event should be dispatched for each created element");

    document.body.removeChild(h1);
    document.body.insertBefore(h3, h2);
    test.strictEqual('H1H3', removed, "an event should be dispatched for each removed element");
    test.done()
  },

  remove_listener_in_handler: function(test) {
    var document = jsdom.jsdom();
    var h1 = 0, h2 = 0;

    // Event handler that removes itself
    function handler1() {
      h1++;
      document.removeEventListener('click', handler1);
    }

    function handler2() {
      h2++;
    }

    document.addEventListener('click', handler1);
    document.addEventListener('click', handler2);

    var ev = document.createEvent('MouseEvents');
    ev.initEvent('click', true, true);

    document.dispatchEvent(ev);
    test.equal(1, h1, "handler1 must be called once");
    test.equal(1, h2, "handler2 must be called once");

    document.dispatchEvent(ev);
    test.equal(1, h1, "handler1 must be called once");
    test.equal(2, h2, "handler2 must be called twice");
    test.done();
  },

  childNodes_updates_on_insertChild : function(test) {
    var window = jsdom.jsdom("").createWindow();
    var div = window.document.createElement("div")
    var text = window.document.createTextNode("bar")
    div.appendChild(text);
    test.strictEqual(text, div.childNodes[0],
               "childNodes NodeList should update after appendChild");

    text = window.document.createTextNode("bar")
    div.insertBefore(text, null);
    test.strictEqual(text, div.childNodes[1],
               "childNodes NodeList should update after insertBefore");
    test.done();
  },

  option_set_selected : function(test) {
    var window = jsdom.jsdom("").createWindow();
    var select = window.document.createElement("select")

    var option0 = window.document.createElement('option');
    select.appendChild(option0);
    option0.setAttribute('selected', 'selected');

    var optgroup = window.document.createElement('optgroup');
    select.appendChild(optgroup);
    var option1 = window.document.createElement('option');
    optgroup.appendChild(option1);

    test.strictEqual(true, option0.selected, 'initially selected');
    test.strictEqual(false, option1.selected, 'initially not selected');
    test.strictEqual(option1, select.options[1], "options should include options inside optgroup");

    option1.defaultSelected = true;
    test.strictEqual(false, option0.selected, 'selecting other option should deselect this');
    test.strictEqual(true, option0.defaultSelected, 'default should not change');
    test.strictEqual(true, option1.selected, 'selected changes when defaultSelected changes');
    test.strictEqual(true, option1.defaultSelected, 'I just set this');

    option0.defaultSelected = false;
    option0.selected = true;
    test.strictEqual(true, option0.selected, 'I just set this');
    test.strictEqual(false, option0.defaultSelected, 'selected does not set default');
    test.strictEqual(false, option1.selected, 'should deselect others');
    test.strictEqual(true, option1.defaultSelected, 'unchanged');
    test.done();
  },
  case_sensitivity_of_markup_missing_html_and_body : function(test){
      var spaces = /[ \n]*/g,
          doc1 = jsdom.html("<HTML><BODY></BODY></HTML>").outerHTML.replace(spaces, ''),
          doc2 = jsdom.html("<html><BODY></Body></HTML>").outerHTML.replace(spaces, ''),
          doc3 = jsdom.html("<html><body></body></html>").outerHTML.replace(spaces, ''),
          doc4 = jsdom.html("<body></body>").outerHTML.replace(spaces, ''),
          doc5 = jsdom.html("").outerHTML.replace(spaces, '');

      test.ok(doc1 === doc2 && doc2 == doc3 && doc3 === doc4 && doc4 == doc5,
              'they should all serialize the same');
      test.done();
  },
  children_should_be_available_right_after_document_creation : function(test) {
    var doc = jsdom.jsdom("<html><body><div></div></body></html>");
    test.ok((doc.body.children[0] !== undefined), "there should be a body, and it should have a child");
    test.done();
  },
  children_should_be_available_right_after_document_creation_scripts : function(test) {
    var html = "<html><body>" +
      "<script type='text/javascript'>" +
        "var h = document.createElement('div');" +
        "h.innerHTML = '<div style=\"opacity:0.8\"></div>';" +
        "window.myNode = h.childNodes[0];" +
      "</script>" +
    "</body></html>";

    var window = jsdom.jsdom(html).createWindow();
    test.ok(!!window.myNode.nodeType);
    test.done();
  },
  fix_for_issue_172 : function(test) {
    jsdom.env("<html><body><script type='text/javascript'></script></body></html>", [
     'jquery.js'
    ], function () {
      // ensure the callback gets called!
      test.done()
    });
  },
  fix_for_issue_221 : function(test) {
    var html = '<html><head></head><body></body></html>';
    var document = jsdom.jsdom(html);
    var div = document.createElement("div");
    document.body.appendChild(div);
    div.appendChild(document.createTextNode("hello world"));
    test.strictEqual(div.childNodes[0].nodeValue, 'hello world',
               'Nodelist children should be populated immediately');
    test.done();
  },
  parsing_and_serializing_entities: function(test) {
      var html = '<html><body><a href="http://example.com/?a=b&amp;c=d">&lt;&aelig;&#x263a;foo</a>';
      var document = jsdom.jsdom(html);
      var anchor = document.getElementsByTagName('a')[0];

      test.strictEqual(anchor.getAttribute('href'), 'http://example.com/?a=b&c=d',
                       "href attribute value should be deentitified");

      test.strictEqual(anchor.firstChild.nodeValue, '<æ☺foo',
                       "nodeValue of text node should be deentitified");

      test.ok(anchor.outerHTML.indexOf('http://example.com/?a=b&amp;c=d') !== -1,
              "outerHTML of anchor href should be entitified");

      test.ok(anchor.innerHTML.indexOf("&lt;") === 0,
              "innerHTML of anchor should begin with &lt;");
      test.done();
  },
  document_title_and_entities: function (test) {
    var html = '<html><head><title>&lt;b&gt;Hello&lt;/b&gt;</title></head><body></body></html>';
    var document = jsdom.jsdom(html);

    test.strictEqual(document.title, "<b>Hello</b>",
      "document.title should be the deentitified version of what was in \
      the original HTML"
    );

    document.title = "<b>World</b>";
    test.strictEqual(document.title, "<b>World</b>",
      "When document.title is set programmatically to something looking like \
      HTML tags, then read again, it should have the exact same value, no \
      entification should take place"
    );

    document.title = "&lt;b&gt;World&lt;/b&gt;";
    test.strictEqual(document.title, "&lt;b&gt;World&lt;/b&gt;",
      "When document.title is set programmatically to something looking like \
      HTML entities, then read again, it should have the exact same value, \
      no deentification should take place"
    );

    test.done();
  },
  setting_and_getting_textContent: function (test) {
    var html = '<html><head>\n<title>&lt;foo&gt;</title></head><body>Hello<span><span>, </span>world</span>!</body></html>';
    var document = jsdom.jsdom(html);

    test.strictEqual(document.textContent, null,
      "textContent of document should be null"
    );

    test.strictEqual(document.head.textContent, '\n<foo>',
      "textContent of document.head should be the initial whitespace plus the textContent of the document title"
    );

    test.strictEqual(
      document.body.textContent,
      "Hello, world!",
      "textContent of document.body should be the concatenation of the textContent values of its child nodes"
    );

    test.strictEqual(
      document.createTextNode('&lt;b&gt;World&lt;/b&gt;').textContent,
      '&lt;b&gt;World&lt;/b&gt;',
      "textContent of programmatically created text node should be identical to its nodeValue"
    );

    test.strictEqual(
      document.createComment('&lt;b&gt;World&lt;/b&gt;').textContent,
      '&lt;b&gt;World&lt;/b&gt;',
      "textContent of programmatically created comment node should be identical to its nodeValue"
    );

    var frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode('&lt;foo&gt;<b></b>'));
    frag.appendChild(document.createElement('div')).appendChild(document.createTextNode('&lt;foo&gt;<b></b>'));

    test.strictEqual(frag.textContent, '&lt;foo&gt;<b></b>&lt;foo&gt;<b></b>',
      "textContent of programmatically created document fragment should be the concatenation of the textContent values of its child nodes"
    );

    var div = document.createElement('div');
    div.innerHTML = '&amp;lt;b&amp;gt;\nWorld&amp;lt;/b&amp;gt;<span></span><span><span></span></span><span>&amp;lt;b&amp;gt;World&amp;lt;/b&amp;gt;</span>';

    test.strictEqual(div.textContent, '&lt;b&gt;\nWorld&lt;/b&gt;&lt;b&gt;W\orld&lt;/b&gt;',
      "textContent of complex programmatically created <div> should be the \
      concatenation of the textContent values of its child nodes"
    );

    test.done();
  },
  allow_ender_to_run : function(test) {
    jsdom.env('<a />', [__dirname + '/files/ender-qwery.js'], function(e, w) {
      test.ok(!e, 'no errors');
      test.ok(w.ender, 'ender exists')
      test.ok(w.$, 'window contains $');
      test.done();
    })
  },

  // see: https://github.com/tmpvar/jsdom/issues/163
  issue_163 : function(test) {
    jsdom.env('<a />', [__dirname + '/files/163.js'], function(errors, window) {
      test.ok(!errors, 'no errors');
      test.ok(window.hasNativeObjects === true, 'window has the expected properties');
      test.done();
    });
  },

  // see: https://github.com/tmpvar/jsdom/issues/179
  issue_179 : function(test) {
    jsdom.env('<a />', [__dirname + '/files/179.js'], function(errors, window) {
      test.ok(!errors, 'no errors');
      test.ok(window.b === 42, 'local var gets hung off of the window');
      test.ok(window.exposed === 42, 'read local var from window and exposed it');
      test.done();
    });
  },

  timer_executes_in_context : function (test) {
    jsdom.env('<a />', [__dirname + '/files/timer_in_context.js'], function (errors, window) {
      setTimeout(function () {
        test.ok(window.x == 1);
        test.done();
      }, 1);
    });
  },

  // see: https://github.com/tmpvar/jsdom/issues/259
  issue_259 : function(test) {
    try {
      jsdom.jsdom('<!DOCTYPE svg>\n<svg version="1.1"></svg>');
    } catch (e) {
      console.log(e);
      test.ok(false, 'Incomplete doctype should not throw an error');
    }
    test.done();
  },

  issues_230_259 : function(test) {
    var instr = '<html><body style="color: #ffffff; foo: bar"></body></html>';
    var doc = jsdom.html(instr);
    test.ok(doc.outerHTML.match(/0: *color/) === null);
    test.done();
  },

  // see: https://github.com/tmpvar/jsdom/issues/262
  issues_262 : function(test) {
    var document = jsdom.html('<html><body></body></html>');
    var a = document.createElement('a');
    a.style.width = '100%';
    test.ok(a.getAttribute('style').match(/^\s*width\s*:\s*100%\s*;?\s*$/));
    test.done();
  }
};
