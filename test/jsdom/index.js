// var testcase = require('nodeunit').testCase;
var path = require("path");
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
      }
    });
	test.done();
  },

  env_with_html: function(test) {
    var html = "<html><body><p>hello world!</p></body></html>";
    jsdom.env({
      html: html,
      done: function(errors, window) {
		test.equal(errors, null, 'errors should be null');
        test.notEqual(window.location, null, 'window.location should not be null');
      }
    })
    test.done();
  },

  env_with_non_existant_script: function(test) {
    var html = "<html><body><p>hello world!</p></body></html>";
    jsdom.env({
      html: html,
      scripts: ['path/to/invalid.js', 'another/invalid.js'],
      done: function(errors, window) {
        test.notEqual(errors, null, 'errors should not be null');
        test.equal(errors.length, 2, 'errors is an array')
        test.notEqual(window.location, null, 'window.location should not be null');
      }
    });
    test.done();
  },

  env_with_url: function(test) {
    // spawn an http server
    var routes = {"/js": "window.attachedHere = 123", "/html": "<a href='/path/to/hello'>World</a>"},
        server = require("http").createServer(function(req, res) {
          res.writeHead(200, {"Content-length": routes[req.url].length});
          res.end(routes[req.url]);
        }),
        html = "<html><body><p>hello world!</p></body></html>";
    server.listen(64000);
    jsdom.env({
      html: "http://127.0.0.1:64000/html",
      scripts: "http://127.0.0.1:64000/js",
      done: function(errors, window) {
        server.close();
		test.equal(errors, null, 'errors should be null');
        test.notEqual(window.location, null, 'window.location should not be null');
        test.equal(window.attachedHere, 123, 'script should execute on our window');
        test.equal(window.document.getElementsByTagName("a").item(0).innerHTML, 'World', 'anchor text');
      }
    });
    test.done();
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
    var config = jsdom.env.processArguments(["<html></html>", ['script.js'], {features: []}, function(){}]);
    test.notEqual(config.done, null, 'config.done should not be null');
    test.notEqual(config.html, null, 'config.html should not be null');
    test.equal(config.scripts.length, 1, 'script length should be 1');
    test.notEqual(config.config.features, null, 'config.config.features should not be null');
    test.done();
  },

  plain_window_document: function(test) {
    var window = (jsdom.createWindow());
    assertTrue("jsdom.createWindow() should create a documentless window", typeof window.document === 'undefined');
    test.done();
  },

  appendChild_to_document_with_existing_documentElement: function(test) {
    test.expect(2);
    t = function(){
      try {
        var doc = jsdom.jsdom();
        doc.appendChild(doc.createElement('html'));
      }
      catch (e) {
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
      assertTrue("Document has all of the default features", doc.implementation.hasFeature(defaults[i]));
    }
    jsdom.applyDocumentFeatures(doc2, {'FetchExternalResources': false});
    assertTrue("Document has 'ProcessExternalResources'", doc2.implementation.hasFeature('ProcessExternalResources'));
    assertFalse("Document does not have 'FetchExternalResources'", doc2.implementation.hasFeature('FetchExternalResources'));
    test.done();
  },

  ensure_scripts_can_be_disabled_via_options_features: function(test) {
    var html = '\
<html>\
  <head>\
    <script type="text/javascript" src="./jsdom/files/hello.js"></script>\
  </head>\
  <body>\
    <span id="test">hello from html</span>\
  </body>\
</html>';

    var doc = jsdom.jsdom(html);
    doc.onload = function() {
      test.equal(doc.getElementById("test").innerHTML, 'hello from javascript', 'js should be executed');
    };

    var doc2 = jsdom.jsdom(html, null, {features: {FetchExternalResources: ['script'], ProcessExternalResources: false}});
    doc2.onload = function() {
      test.equal(doc2.getElementById("test").innerHTML, 'hello from html', 'js should not be executed (doc2)');
    }
    test.done();
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
    assertSame("p and first-p", div.children.item(0), element);
    var element2 = div.querySelector("p");
    assertSame("p and first-p", div.children.item(0), element2);
    test.done();
  },

  // TODO: look into breaking into a testcase
  queryselectorall: function(test) {
    var html = '<html><body><div id="main"><p>Foo</p><p>Bar</p></div></body></html>',
        document = jsdom.jsdom(html, null, {features: {'QuerySelector': true}}),
        div = document.body.children.item(0),
        elements = document.querySelectorAll("#main p");
    test.equal(elements.length, 2, 'two results');
    assertSame("p and first-p", div.children.item(0), elements.item(0));
    assertSame("p and second-p", div.children.item(1), elements.item(1));
    var elements2 = div.querySelectorAll("p");
    test.equal(elements2.length, 2, 'two results');
    assertSame("p and first-p", div.children.item(0), elements2.item(0));
    assertSame("p and second-p", div.children.item(1), elements2.item(1));
    var elements3 = div.querySelectorAll("#main p");
    test.equal(elements3.length, 2, 'two results');
    assertSame("p and first-p", div.children.item(0), elements3.item(0));
    assertSame("p and second-p", div.children.item(1), elements3.item(1));
    var topNode = document.createElement('p'),
        newNode = document.createElement('p');
    topNode.id = "fuz";
    newNode.id = "buz";
    topNode.appendChild(newNode);
    var elements4 = topNode.querySelectorAll("#fuz #buz");
    test.equal(elements4.length, 1, 'one result');
    assertSame("newNode and first-p", newNode, elements4.item(0));
    test.done();
  },

  // TODO: look into breaking into a testcase
  scripts_share_a_global_context: function(test) {
    var window = jsdom.jsdom('<html><head><script type="text/javascript">\
hello = "hello";\
window.bye = "good";\
var abc = 123;\
</script><script type="text/javascript">\
hello += " world";\
bye = bye + "bye";\
(function() { var hidden = "hidden"; window.exposed = hidden; })();\
</script></head><body></body></html>').createWindow();

   test.equal(window.hello, "hello world", 'window should be the global context');
   test.equal(window.bye, "goodbye", 'window should be the global context');
   test.equal(window.abc, 123, 'local vars should not leak out to the window');
   assertTrue('vars in a closure are safe', typeof window.hidden === 'undefined');
   test.equal(window.exposed, 'hidden', 'vars exposed to the window are global');
    test.done();
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
    var html = '\
            <html>\
              <body>\
                <td data-year="2011" data-month="0" data-day="9">\
                  <a href="#" class=" ">9</a> \
                </td>\
              </body>\
            </html>',
        document = jsdom.jsdom(html),
        a = document.body.children.item(0);
    a.innerHTML = 9;
    a.setAttribute('id', 123);
    assertTrue("Element stringify", "9" === a.innerHTML);
    assertTrue("Attribute stringify", "123" === a.getAttributeNode('id').nodeValue);
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
    assertTrue('document.location and window.location', window.document.location === window.location);
    test.done();
  }
};
