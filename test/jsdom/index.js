var path = require("path");
var fs   = require("fs");
var jsdom = require('../../lib/jsdom');
var inheritFrom = require("../../lib/jsdom/utils").inheritFrom;
var toFileUrl = require('../util').toFileUrl(__dirname);
var http = require("http");
var URL = require('url');

var serializeDocument = require('../../lib/jsdom').serializeDocument;

function tmpWindow() {
  return jsdom.jsdom().defaultView;
}

function testFunction(test, window, jQuery, checkVersion) {
  test.notEqual(window.jQuery.find, null, 'window.jQuery.find should not be null');
  test.notEqual(jQuery.find, null, 'jQuery.find should not be null');
  jQuery("body").html('<p id="para"><a class="link">click <em class="emph">ME</em></a></p>');
  var res = jQuery("#para .emph").text();
  var res2 = jQuery("a.link .emph").text();
  test.equal(jQuery('p#para a.link', window.document.body).attr('class'), 'link', "selecting from body");

  if (checkVersion) {
    test.strictEqual(jQuery('body').jquery, '1.4.4', 'jQuery version 1.4.4');
  }

  test.equal(res, "ME", "selector should work as expected");
  test.equal(res2, "ME", "selector should work as expected");
};

exports.tests = {
  build_window: function(test) {
    var window = jsdom.jsdom().defaultView;
    test.notEqual(window, null, 'window should not be null');
    test.notEqual(window.document, null, 'window.document should not be null');
    test.done();
  },

  jsdom_takes_html: function(test) {
    var document = jsdom.jsdom('<a id="test" href="#test">');
    test.equal(document.getElementById("test").getAttribute("href"), '#test', 'Passing html into jsdom() should populate the resulting doc');
    test.done();
  },

  jsdom_empty_html: function(test) {
    var emptyDoc = jsdom.jsdom('');
    var blankDoc = jsdom.jsdom(' ');
    test.equal(emptyDoc.innerHTML, blankDoc.innerHTML, 'Passing blank and empty strings into jsdom() result in the same html');
    test.done();
  },

  jsdom_method_creates_default_document: function(test) {
    var doc = jsdom.jsdom();
    test.equal(doc.documentElement.nodeName, 'HTML', 'Calling jsdom.jsdom() should automatically populate the doc');
    test.done();
  },

  jsdom_method_works_with_referrer_under_document(t) {
    var doc = jsdom.jsdom(undefined, {
      document: {
        referrer: "http://example.com"
      }
    });

    t.equal(doc.referrer, "http://example.com");
    t.done();
  },

  jquerify_file: function(test) {
    var jQueryFile = path.resolve(__dirname, '../jquery-fixtures/jquery-1.4.4.js');

    test.expect(6);
    jsdom.jQueryify(tmpWindow(), toFileUrl(jQueryFile), function(window, jQuery) {
      testFunction(test, window, jQuery, true);
      test.done();
    });
  },

  jquerify_url: function(test) {
    var jQueryUrl = 'http://code.jquery.com/jquery-1.4.4.min.js';

    test.expect(6);
    jsdom.jQueryify(tmpWindow(), jQueryUrl, function (window, jQuery) {
      testFunction(test, window, jQuery, true);
      test.done();
    });
  },

  jquerify_invalid: function (test) {
    test.expect(2);
    jsdom.jQueryify(jsdom.jsdom("", { url: "http://www.example.org" }).defaultView, 1, function (window, jQuery) {
      test.strictEqual(window.jQuery, undefined);
      test.strictEqual(jQuery, undefined);
      test.done();
    });
  },

  jquerify_attribute_selector_gh_400: function(test) {
    var window = jsdom.jsdom().defaultView;

    jsdom.jQueryify(window, 'file:' + path.resolve(__dirname, '../jquery-fixtures/jquery-1.11.0.js'), function () {
      try {
          window.$("body").append('<html><body><div data-foo="bar"/><div data-baz="foo"/></body></html>');

          test.equal(window.$('*[data-foo]').length, 1);
          test.done();
      }
      catch(ex) {
          console.log(ex);
          test.ok(false, "Encountered an error");
          test.done();
      }
    });
  },

  // This is in response to issue # 280 - scripts don't load over https.
  // See: https://github.com/tmpvar/jsdom/issues/280
  //
  // When a transfer is done, HTTPS servers in the wild might emit 'close', or
  // might emit 'end'.  Node's HTTPS server always emits 'end', so we need to
  // fake a 'close' to test this fix.
  env_with_https : function (test) {
    var https = require('https');
    // Save the real https.request so we can restore it later.
    var oldRequest = https.request;
    var EventEmitter = require('events').EventEmitter;

    // Mock response object
    var res = Object.create(EventEmitter.prototype);
    res.setEncoding = function () {};
    res.headers = {};

    // Monkey patch https.request so it emits 'close' instead of 'end.
    https.request = function () {
      // Mock the request object.
      var req = Object.create(EventEmitter.prototype);
      req.setHeader = function () {};
      req.end = function () {};
      process.nextTick(function () {
        req.emit('response', res);
        process.nextTick(function () {
          res.emit('data', 'window.attachedHere = 123');
          res.emit('close');
        });
      });
      return req;
    };

    jsdom.env({
      html: "<a href='/path/to/hello'>World</a>",
      // The script url doesn't matter as long as its https, since our mocked
      // request doens't actually fetch anything.
      scripts: 'https://doesntmatter.com/script.js',
      done: function(errors, window) {
        if (errors) {
          test.ok(false, errors.message);
        } else {
          test.notEqual(window.location, null, 'window.location should not be null');
          test.equal(window.attachedHere, 123, 'script should execute on our window');
          test.equal(window.document.getElementsByTagName("a").item(0).innerHTML, 'World', 'anchor text');
        }
        https.request = oldRequest;
        test.done();
      }
    });
  },

  env_with_compression : function (test) {
    var zlib = require('zlib');

    var server = http.createServer(function (req, res) {
      switch (req.url) {
        case "/":
          var text = 'window.attachedHere = 123';
          var buf = new Buffer(text, 'utf-8');
          zlib.gzip(buf, function (_, result) {
            res.writeHead(200, { "Content-Length": result.length, 'Content-Encoding':'gzip' });
            res.emit('data', result);
            res.end(result);
          });
          break;
      }
    });

    server.listen(8001, "127.0.0.1", function () {
      jsdom.env({
        html: "<a href='/path/to/hello'>World</a>",
        scripts: 'http://127.0.0.1:8001',
        done: function(errors, window) {
          server.close();
          if (errors) {
            test.ok(false, errors.message);
          } else {
            test.notEqual(window.location, null, 'window.location should not be null');
            test.equal(window.attachedHere, 123, 'script should execute on our window');
            test.equal(window.document.getElementsByTagName("a").item(0).innerHTML, 'World', 'anchor text');
          }
          test.done();
        }
      });
    });
  },

  env_with_features_and_external_resources: function(test) {
    jsdom.env(
      'http://backbonejs.org/examples/todos/index.html',
      {
        features: {
          FetchExternalResources   : ['script', 'frame', 'link'],
          ProcessExternalResources : ['script', 'frame', 'link'],
          MutationEvents           : '2.0',
          QuerySelector            : false
        }
      },
      function(error, window) {
        test.ifError(error);
        test.equal(typeof window._, 'function', 'Underscore loaded');
        test.equal(typeof window.$, 'function', 'jQuery loaded');
        test.done();
      }
    );
  },

  appendChild_to_document_with_existing_documentElement: function(test) {
    test.expect(2);
    t = function(){
      try {
        var doc = jsdom.jsdom();
        doc.appendChild(doc.createElement('html'));
      } catch (e) {
        test.equal(e.code, 3, 'Should throw HIERARCHY_ERR');
        code = e.code;
        throw(e);
      }
    };
    test.throws(t);
    test.done();
  },

  ensure_scripts_can_be_disabled_via_options_features: function(test) {
    var html = '<html><head><script src="./files/hello.js"></script></head>' +
               '<body><span id="test">hello from html</span></body></html>';

    var doc2 = jsdom.jsdom(html, {
      url: toFileUrl(__filename),
      features: {
        FetchExternalResources: ['script'],
        ProcessExternalResources: false
      }
    });
    setTimeout(function() {
      test.equal(doc2.getElementById("test").innerHTML, 'hello from html', 'js should not be executed (doc2)');
      test.done();
    }, 100);
  },

  ensure_scripts_can_be_executed_via_options_features: function (t) {
    var html = "<html><head><script src='./files/hello.js'></script></head>" +
               "<body><span id='test'>hello from html</span></body></html>";

    var doc = jsdom.jsdom(html, {
      url: toFileUrl(__filename),
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });

    doc.defaultView.doCheck = function () {
      t.equal(doc.getElementById("test").innerHTML, "hello from javascript");
      t.done();
    };
  },

  ensure_resolution_is_not_thrown_off_by_hrefless_base_tag: function (t) {
    var html = "<html><head><base target='whatever'>" +
               "<script src='./files/hello.js'></script></head><body>" +
               "<span id='test'>hello from html</span></body></html>";

    var doc = jsdom.jsdom(html, {
      url: toFileUrl(__filename),
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });

    doc.defaultView.doCheck = function () {
      t.equal(doc.getElementById("test").innerHTML, "hello from javascript");
      t.done();
    };
  },

  ensure_resources_can_be_skipped_via_options_features: function(test) {
    var html = '<html><head><script src="./files/hello.js"></script>' +
               '<script src="./files/nyan.js"></script></head>' +
               '<body><span id="test">hello from html</span><span id="cat">' +
               'hello from cat</body></html>';

    var doc2 = jsdom.jsdom(html, {
      url: toFileUrl(__filename),
      features: {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
        SkipExternalResources: new RegExp('.*/files/h')
      }
    });
    doc2.defaultView.onload = function () {
      test.equal(doc2.getElementById("test").innerHTML, 'hello from html', 'js should not be executed (doc2)');
      test.equal(doc2.getElementById("cat").innerHTML, 'hello from nyan cat', 'js should be executed (doc2)');
      test.done();
    };
  },

  load_multiple_resources_with_defer_close: function(test) {
    var html = '<html><head></head><frameset>' +
      '<frame src="../level2/html/files/iframe.html"></frame>' +
      '<frame src="../level2/html/files/iframe.html"></frame>' +
      '<frame src="../level2/html/files/iframe.html"></frame>' +
      '</frameset></html>';

    var doc = jsdom.jsdom(html,
      {
        url: toFileUrl(__filename),
        features: {
          FetchExternalResources: ['frame'],
          ProcessExternalResources: ['frame','script']
        },
        deferClose: true
      });
    // iframe.html sets onload handler to call loadComplete, so we mock it.
    var window = doc.defaultView;
    doc.parent = window;
    window.loadComplete = function () {};

    test.ok(doc._queue.paused, 'resource queue should be paused');

    var check_handle;
    var timeout_handle = setTimeout(function() {
      doc.onload = null;
      doc.defaultView.close();
      if (check_handle) {
        clearTimeout(check_handle);
      }
      test.ok(false, "timed out when waiting for onload to fire");
      test.done();
    }, 1000); //1 second timeout

    function check() {
      var q = doc._queue, h = q.tail, count=0;

      check_handle = null;
      while (h) {
        if (h.fired) {
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
          <script type="text/javascript" src="' + toFileUrl('files/hello.js') + '"></script>\
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
        window   = document.defaultView;
    test.notEqual(window.Element, null, 'window.Element should not be null');
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
  </html>';

    function testLocal() {
      var url = 'file:///path/to/docroot/index.html';
      var doc = jsdom.jsdom(html, {url: url});
      test.equal(doc.getElementById("link1").href, 'http://example.com/', 'Absolute URL should be left alone except for possible trailing slash');
      test.equal(doc.getElementById("link2").href, 'file:///local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link3").href, 'file:///path/to/docroot/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link4").href, 'file:///path/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link5").href, 'file:///path/to/docroot/index.html#here', 'Relative URL should be resolved');
      //test.equal(doc.getElementById("link6").href, '//prototol/avoidance.html', 'Protocol-less URL should be resolved');
    }

    function testRemote() {
      var url = 'http://example.com/path/to/docroot/index.html';
      var doc = jsdom.jsdom(html, {url: url});
      test.equal(doc.getElementById("link1").href, 'http://example.com/', 'Absolute URL should be left alone except for possible trailing slash');
      test.equal(doc.getElementById("link2").href, 'http://example.com/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link3").href, 'http://example.com/path/to/docroot/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link4").href, 'http://example.com/path/local.html', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link5").href, 'http://example.com/path/to/docroot/index.html#here', 'Relative URL should be resolved');
      test.equal(doc.getElementById("link6").href, 'http://example.com/protocol/avoidance.html', 'Relative URL should be resolved');
    }

    function testBase() {
      var url  = 'about:blank',
      doc  = jsdom.jsdom(html, {url: url}),
      base = doc.createElement("base");
      base.href = 'http://example.com/path/to/docroot/index.html';
      doc.getElementsByTagName("head").item(0).appendChild(base);
      test.equal(doc.getElementById("link1").href, 'http://example.com/', 'Absolute URL should be left alone except for possible trailing slash');
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
    test.equal(dom.documentElement.getElementsByTagName("*").length, 3, 'should parse as per usual');
    test.done();
  },

  mutation_events : function(test) {
    var document = jsdom.jsdom();
    document.implementation._addFeature('MutationEvents', '2.0');
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

    var text = h2.innerHTML = 'foo';
    h2.addEventListener('DOMCharacterDataModified', function(ev) {
      text = ev.target.nodeValue;
    });
    h2.firstChild.nodeValue = 'bar';
    test.equal(h2.innerHTML, text, 'ChactaterData changes should be captured');

    var event;
    h2.setAttribute('class', 'foo');
    document.addEventListener('DOMAttrModified', function(ev) {
      event = ev;
    });
    h2.setAttribute('class', 'bar');
    test.ok(!!event, 'Changing an attribute should trigger DOMAttrModified');
    test.equal(event.attrName, 'class', 'attrName should be class');
    test.equal(event.prevValue, 'foo', 'prevValue should be foo');
    test.equal(event.newValue, 'bar', 'newValue should be bar');

    event = false;
    h2.setAttribute('class', 'bar');
    test.ok(!event, 'Setting the same value again should not trigger an event');

    h2.removeAttribute('class');
    test.ok(!!event, 'Removing an attribute should trigger DOMAttrModified');
    test.equal(event.attrName, 'class', 'attrName should be class');
    test.equal(event.prevValue, 'bar', 'prevValue should be bar');

    test.done();
  },

  DomSubtreeModifiedEvents : function(test){
    var document = jsdom.jsdom()
    var firedAfterAddedChild = false;
    var firedAfterAddedTextNode = false;
    var firedAfterAddingAttr = false;
    var firedAfterChangingAttr = false;
    var firedAfterRemovedAttr = false;

    document.addEventListener("DOMSubtreeModified", function(ev){
       firedAfterAddedChild = true;
    });
    var div = document.createElement("div");
    document.body.appendChild(div);
    test.ok(firedAfterAddedChild, "DOMSubtreeModified event should be fired for each created element");

    document.addEventListener("DOMSubtreeModified", function(){
      firedAfterAddedTextNode = true;
    });
    var textNode = document.createTextNode("text node test");
    document.getElementsByTagName("div")[0].appendChild(textNode);
    test.ok(firedAfterAddedTextNode, "DOMSubtreeModified event should be fired when texnode value changed");
    document.addEventListener("DOMSubtreeModified", function(){
      firedAfterAddingAttr = true;
    });
    document.getElementsByTagName("div")[0].setAttribute("class", "test-class");
    test.ok(firedAfterAddingAttr, "DOMSubtreeModified event should be fired when attribute added");

    document.addEventListener("DOMSubtreeModified", function(){
      firedAfterChangingAttr = true;
    });
    document.getElementsByTagName("div")[0].setAttribute("class", "test-class-2");
    test.ok(firedAfterChangingAttr, "DOMSubtreeModified event should be fired when attribute value changed");

    firedAfterChangingAttr = false;
    document.getElementsByTagName("div")[0].setAttribute("class", "test-class-2");
    test.ok(firedAfterChangingAttr == false, "DOMSubtreeModified not be fired when new attribute value same as old one");

    document.addEventListener("DOMSubtreeModified", function(){
      firedAfterRemovedAttr = true;
    });
    document.getElementsByTagName("div")[0].removeAttribute("class");
    test.ok(firedAfterRemovedAttr, "DOMSubtreeModified event should be fired when attribute removed");

    firedAfterRemovedAttr = false;
    document.getElementsByTagName("div")[0].removeAttribute("class");
    test.ok(firedAfterRemovedAttr == false, "DOMSubtreeModified not be fired when try to remove attribute doesn't exists");

    test.done();
  },

  childNodes_updates_on_insertChild : function(test) {
    var window = jsdom.jsdom("").defaultView;
    var div = window.document.createElement("div");
    var text = window.document.createTextNode("bar");
    div.appendChild(text);
    test.strictEqual(text, div.childNodes[0],
               "childNodes NodeList should update after appendChild");

    text = window.document.createTextNode("bar");
    div.insertBefore(text, null);
    test.strictEqual(text, div.childNodes[1],
               "childNodes NodeList should update after insertBefore");
    test.done();
  },

  option_set_selected : function(test) {
    var window = jsdom.jsdom("").defaultView;
    var select = window.document.createElement("select");

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

    var window = jsdom.jsdom(html).defaultView;
    test.ok(!!window.myNode.nodeType);
    test.done();
  },

  fix_for_issue_172 : function(test) {
    jsdom.env("<html><body><script type='text/javascript'></script></body></html>", [
      'file:' + path.resolve(__dirname, '../jquery-fixtures/jquery-1.6.2.js')
    ], function () {
      // ensure the callback gets called!
      test.done();
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

  parsing_and_serializing_unknown_entities: function (test) {
    var html = '<html><body>&nowayjose;&#x263a;&#xblah;&#9q;</body></html>';
    var document = jsdom.jsdom(html);
    test.strictEqual(document.body.firstChild.nodeValue, "&nowayjose;☺lah;	q;",
                     "Unknown and unparsable entities should be handled like a browser would");
    test.strictEqual(document.body.innerHTML, "&amp;nowayjose;☺lah;	q;",
                     "Unknown and unparsable entities should be handled like a browser would");
    test.done();
  },

  entities_in_script_should_be_left_alone: function (test) {
    var html = '<!DOCTYPE html><html><head></head><body><script>alert("&quot;");</script></body></html>';
    var document = jsdom.jsdom(html);
    test.strictEqual(document.body.innerHTML, '<script>alert("&quot;");</script>');
    test.strictEqual(document.body.firstChild.innerHTML, 'alert("&quot;");');
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
    jsdom.env('<a />', ['file:' + __dirname + '/files/ender-qwery.js'], function(e, w) {
      test.ok(!e, 'no errors');
      test.ok(w.ender, 'ender exists');
      test.ok(w.$, 'window contains $');
      test.done();
    });
  },

  issues_230_259 : function(test) {
    var instr = '<html><body style="color: #ffffff; foo: bar"></body></html>';
    var doc = jsdom.jsdom(instr);
    test.ok(serializeDocument(doc).match(/0: *color/) === null);
    test.done();
  },

  // see: https://github.com/tmpvar/jsdom/issues/262
  issue_262 : function(test) {
    var document = jsdom.jsdom('<html><body></body></html>');
    var a = document.createElement('a');
    a.setAttribute("style", "color:blue");
    a.style.setProperty("color", "red");
    test.equal(a.outerHTML.match(/style="/g).length, 1, 'style attribute must not be serialized twice');
    test.done();
  },

  // see: https://github.com/tmpvar/jsdom/issues/267
  issue_267 : function(test) {
    var document = jsdom.jsdom('<html><body></body></html>');
    var a = document.createElement('a');
    a.style.width = '100%';
    test.ok(!!a.getAttribute('style').match(/^\s*width\s*:\s*100%\s*;?\s*$/), 'style attribute must contain width');
    test.done();
  },

  // Test inline event handlers set on the body.
  test_body_event_handler_inline : function (test) {
    var html = "\
      <html>\
        <head>\
          <script>\
            function loader () {\
              window.loader_called = true;\
            }\
          </script>\
        </head>\
        <body onload='loader()'></body>\
      </html>";
    var doc = jsdom.jsdom(html, { deferClose : true });
    var window = doc.defaultView;
    // In JSDOM, listeners registered with addEventListener are called before
    // "traditional" listeners, so listening for 'load' will fire before our
    // inline listener.  This means we have to check the value on the next
    // tick.
    window.addEventListener('load', function () {
      process.nextTick(function () {
        test.equal(window.loader_called, true);
        test.done();
      });
    });
    doc.close();
  },

  // Make sure traditional handlers on the body element set via script are
  // forwarded to the window.
  test_body_event_handler_script : function (test) {
    test.expect(2);
    var doc = jsdom.jsdom("<html><head></head><body></body></html>",
                          {deferClose : true});
    var window = doc.defaultView;
    test.equal(window.onload, undefined);
    doc.body.onload = function () {
      test.done();
    };
    test.notEqual(window.onload, undefined);
    doc.close();
  },

  // Test inline event handlers on a regular element.
  test_element_inline_event_handler : function (test) {
    var doc = jsdom.jsdom(
      "<html>" +
        "<head></head>" +
        "<body>" +
        "  <div onclick='window.divClicked = true;'" +
        "       onmouseover='window.divMousedOver = true;'" +
        "       onmouseout='window.divCalledFrom = this.tagName;'>" +
        "    <a></a>" +
        "  </div>" +
        "</body>" +
      "</html>");

    var window = doc.defaultView;
    var div    = doc.getElementsByTagName('div')[0];

    test.equal(window.divClicked,    undefined);
    test.equal(window.divMousedOver, undefined);

    var click = doc.createEvent('MouseEvents');
    click.initEvent('click', false, false);
    div.dispatchEvent(click);
    test.equal(window.divClicked, true);

    var mouseOver = doc.createEvent('MouseEvents');
    mouseOver.initEvent('mouseover', false, false);
    div.dispatchEvent(mouseOver);
    test.equal(window.divMousedOver, true);

    var mouseOut = doc.createEvent('MouseEvents');
    mouseOut.initEvent('mouseout', false, false);
    div.dispatchEvent(mouseOut);
    test.equal(window.divCalledFrom, "DIV");

    test.done();
  },

  // Test for issue 287 - element.onevent check doesn't work
  // See: https://github.com/tmpvar/jsdom/issues/287
  issue_287 : function (test) {
    var doc = jsdom.jsdom();
    var elem = doc.createElement('form');
    elem.setAttribute('onsubmit', ';');
    test.equal(typeof elem.onsubmit, 'function');
    test.done();
  },

  get_element_by_id : function (test) {
    var doc = jsdom.jsdom();
    var el = doc.createElement('div');
    el.setAttribute('id', 'foo');
    test.equal(doc.getElementById('foo'), null, 'Element must not be found until it has been added to the DOM');

    doc.body.appendChild(el);
    test.equal(doc.getElementById('foo'), el, 'Element must be found after being added');

    el.id = 'bar';
    test.equal(doc.getElementById('foo'), null, 'Element must not be found by its previous id');
    test.equal(doc.getElementById('bar'), el, 'Element must be found by its new id');

    el.setAttribute('id', 'baz');
    test.equal(doc.getElementById('bar'), null, 'Element must not be found by its previous id');
    test.equal(doc.getElementById('baz'), el, 'Element must be found by its new id');

    el.getAttributeNode('id').nodeValue = 'boo';
    test.equal(doc.getElementById('boo'), el, 'Element must be found by its new id');

    doc.body.removeChild(el);
    test.equal(doc.getElementById(el.id), null, 'Element must not be found after it has been removed');

    test.done();
  },

  get_element_by_id_multi_id : function(test) {
    var doc = jsdom.jsdom(), div, span;
    div = doc.createElement('div');
    div.setAttribute('id', 'foo');
    doc.body.appendChild(div);
	span = doc.createElement('span');
    span.setAttribute('id', 'foo');
    doc.body.appendChild(span);

	// now if we remove the second element, we should still find the first
	doc.body.removeChild(span);
    test.equal(doc.getElementById('foo'), div, 'Original div#foo must be found after removing invalid span#foo');

    test.done();
  },

  issue_335_inline_event_handlers : function(test) {
    var doc = jsdom.jsdom('<a onclick="somefunction()">call some function</a>');
    var a = doc.getElementsByTagName('a').item(0);
    var onclick = a.getAttribute('onclick');
    test.notEqual(onclick, null);
    test.equal(onclick, 'somefunction()');
    test.ok(serializeDocument(doc).indexOf('onclick') > -1);
    test.done();
  },

  issue_338_internal_nodelist_props : function(test) {
    var doc = jsdom.jsdom();
    var props = Object.keys(doc.body.childNodes);
    test.equal(props.length, 0, 'Internal properties must not be enumerable');
    test.done();
  },

  setting_and_getting_script_element_text : function (test) {
    var doc = jsdom.jsdom("<script></script>");
    var script = doc.getElementsByTagName('script')[0];
    test.equal(script.text, '');
    script.text = 'var x = 3;';
    test.equal(script.text, 'var x = 3;');
    script.text = 'var y = 2;';
    test.equal(script.text, 'var y = 2;');
    test.done();
  },

  issue_239_replace_causes_script_execution : function(test) {
    jsdom.env({
      html : '<script type="text/javascript">window.a = 1;/* remove me */ console.log("executed?")</script>',
      done : function(errors, window) {
        window.document.write(serializeDocument(window.document).replace('/* remove me */',''));
        window.document.close();
        test.equal(typeof window.a, 'undefined');
        test.done();
      }
    });
  },

  issue_355_on_events_should_not_execute_js_when_disabled : function(test) {
    var html = '<html><body onload="undefined()">something</body></html>';

    jsdom.env(html, function(e) {
      test.equal(e, null);
      test.done();
    });
  },

  issue_361_textarea_value_property: function (test) {
     var doc = jsdom.jsdom('<html><body><textarea id="mytextarea"></textarea></body></html>');

     doc.getElementById('mytextarea').value = '<foo>';
     test.equal(doc.getElementById('mytextarea').value, '<foo>');
     test.done();
  },

  on_events_should_be_called_in_bubbling_phase : function (test) {
    var doc = jsdom.jsdom(
      "<html>" +
        "<head></head>" +
        "<body>" +
        "  <div onclick='window.divClicked = true;'" +
        "       onmouseover='window.divMousedOver = true;'>" +
        "    <a></a>" +
        "  </div>" +
        "</body>" +
      "</html>");

    var window = doc.defaultView;
    var div    = doc.getElementsByTagName('div')[0];
    var a      = doc.getElementsByTagName('a')[0];

    test.equal(window.divClicked,    undefined);
    test.equal(window.divMousedOver, undefined);

    var click = doc.createEvent('MouseEvents');
    click.initEvent('click', true, false);
    a.dispatchEvent(click);
    test.equal(window.divClicked, true);

    var mouseOver = doc.createEvent('MouseEvents');
    mouseOver.initEvent('mouseover', true, false);
    a.dispatchEvent(mouseOver);
    test.equal(window.divMousedOver, true);
    test.done();
  },

  css_classes_should_be_attached_to_dom: function (test) {
    var dom = jsdom.jsdom().defaultView;

    test.notEqual(dom.StyleSheet, undefined);
    test.notEqual(dom.MediaList, undefined);
    test.notEqual(dom.CSSStyleSheet, undefined);
    test.notEqual(dom.CSSRule, undefined);
    test.notEqual(dom.CSSStyleRule, undefined);
    test.notEqual(dom.CSSMediaRule, undefined);
    test.notEqual(dom.CSSImportRule, undefined);
    test.notEqual(dom.CSSStyleDeclaration, undefined);

    test.done();
  },

  issue_509_out_of_memory : function(test) {
    var fs = require("fs");

    var html = fs.readFileSync(path.resolve(__dirname, "files/reddit.html"));
    jsdom.jsdom(html.toString());

    test.done();
  },

  issue_530_async_load_events : function(test) {
    test.expect(1);

    var doc = jsdom.jsdom('<html><head></head><body></body></html>');
    var window = doc.defaultView;

    // Add the load event after the document is already created; it shouldn't
    // fire until nextTick. The test will fail (with a timeout) if it has
    // already fired.
    window.addEventListener('load', function () {
      test.ok(true);
      test.done();
    });
  },

  iframe_contents: function (test) {
    var document = jsdom.jsdom("<iframe></iframe>");
    var iframeDocument = document.querySelector("iframe").contentWindow.document;

    test.equal(serializeDocument(iframeDocument), "<html><head></head><body></body></html>");
    test.ok(iframeDocument.documentElement);
    test.ok(iframeDocument.head);
    test.ok(iframeDocument.body);
    test.done();
  },

  jquery_val_on_selects : function(test) {
    var window = jsdom.jsdom().defaultView;

    jsdom.jQueryify(window, 'file:' + path.resolve(__dirname, '../jquery-fixtures/jquery-1.11.0.js'), function () {
      window.$("body").append('<html><body><select id="foo"><option value="first">f</option><option value="last">l</option></select></body></html>');

      test.equal(window.document.querySelector("[value='first']").selected, true, "`selected` property should be `true` for first");
      test.equal(window.document.querySelector("[value='last']").selected, false, "`selected` property should be `false` for last");

      test.equal(window.$("[value='first']").val(), "first", "`val()` on first <option> should return its value");
      test.equal(window.$("[value='last']").val(), "last", "`val()` on last <option> should return its value");

      var f = window.$("#foo");
      test.equal(f.val(), "first", "`val()` on <select> should return first <option>'s value");

      window.$('#foo').val("last");
      test.equal(window.document.querySelector("[value='first']").selected, false, "`selected` property should be `false` for first");
      test.equal(window.document.querySelector("[value='last']").selected, true, "`selected` property should be `true` for last");
      test.equal(window.$('#foo').val(), "last", "`val()` should return last <option>'s value");

      test.done();
    });
  },

  jquery_attr_mixed_case : function(test) {
    var window = jsdom.jsdom().defaultView;

    jsdom.jQueryify(window, 'file:' + path.resolve(__dirname, '../jquery-fixtures/jquery-1.11.0.js'), function () {
      var $el = window.$('<div mixedcase="blah"></div>');

      test.equal($el.attr('mixedCase'), 'blah');

      test.done();
    });
  },

  "Calling show() method in jQuery 1.11.0 (GH-709)": function (t) {
    var window = jsdom.jsdom("<!DOCTYPE html><html><head></head><body></body></html>").defaultView;

    jsdom.jQueryify(window, 'file:' + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"), function () {
      var $el = window.$("<div></div>");

      t.doesNotThrow(function () {
        $el.show();
      });

      t.done();
    });
  },

  "Calling show() method in jQuery 1.11.0, second case (GH-709)": function (t) {
    var window = jsdom.jsdom("<!DOCTYPE html><html><head></head><body></body></html>").defaultView;

    jsdom.jQueryify(window, 'file:' + path.resolve(__dirname, "../jquery-fixtures/jquery-1.11.0.js"), function () {
      var $el1 = window.$("<div></div>");
      var $el2 = window.$("<span></span>");

      t.doesNotThrow(function () {
        $el1.show();
        $el2.show();
      });

      t.done();
    });
  },

  redirected_url_equal_to_location_href : function(test) {
    var html = "<p>Redirect</p>";
    var server = http.createServer(function(req, res) {
      switch (req.url) {
        case "/":
          res.writeHead(302, { Location: "/redir" });
          res.end();
          break;
        case "/redir":
          res.writeHead(200, { "Content-Length": html.length });
          res.end(html);
          break;
      }
    });

    server.listen(8001, "127.0.0.1", function() {
      jsdom.env({
        url: "http://127.0.0.1:8001",
        done: function(errors, window) {
          server.close();
          if (errors) {
            test.ok(false, errors.message);
          }
          else {
            test.equal(window.document.body.innerHTML, html, "root page should be redirected");
            test.equal(window.location.href, "http://127.0.0.1:8001/redir",
              "window.location.href should equal to redirected url");
          }
          test.done()
        }
      });
    });
  },

  issue_935_document_tostring_returns_null: function(test) {
    var document = jsdom.jsdom();
    test.equal(document.toString(), "[object HTMLDocument]");
    test.done();
  },

  script_with_cookie: function (t) {
    var html = "<!DOCTYPE html><html><head><script src='/foo.js'></script></head><body>foo</body></html>";

    var server = http.createServer(function (req, res) {
      switch (req.url) {
        case "/":
          res.writeHead(200, { "Content-Length": html.length });
          res.end(html);
          break;
        case "/foo.js":
          var cookie = req.headers["cookie"];
          var name = cookie ? cookie.split("=")[1] : "no cookie";
          var text = "document.body.innerHTML = 'Hello " + name + "'; window.doCheck();";
          res.writeHead(200, { "Content-Length": text.length });
          res.end(text);
          break;
      }
    });

    server.listen(8001, "127.0.0.1", function () {
      jsdom.env({
        url: "http://127.0.0.1:8001",
        document: { cookie: "name=world" },
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        },
        created: function (err, window) {
          window.doCheck = function () {
            server.close();
            t.ifError(err);
            t.equal(window.document.body.innerHTML, "Hello world");
            t.done();
          };
        }
      });
    });
  },

  xhr_with_cookie: function (t) {
    var html = "<!DOCTYPE html><html><head><script>" +
               "var xhr = new XMLHttpRequest();" +
               "xhr.onload = function () {" +
               "  document.body.innerHTML = xhr.responseText;" +
               "  window.doCheck();" +
               "};" +
               "xhr.open('GET', '/foo.txt', true);" +
               "xhr.send();" +
               "</script></head><body>foo</body></html>";

    var server = http.createServer(function (req, res) {
      switch (req.url) {
        case "/":
          res.writeHead(200, { "Content-Length": html.length });
          res.end(html);
          break;
        case "/foo.txt":
          var cookie = req.headers["cookie"];
          var name = cookie ? cookie.split("=")[1] : "no cookie";
          var text = "Hello " + name;
          res.writeHead(200, { "Content-Length": text.length });
          res.end(text);
          break;
      }
    });

    server.listen(8001, "127.0.0.1", function() {
      jsdom.env({
        url: "http://127.0.0.1:8001",
        document: { cookie: "name=world" },
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        },
        done: function (err, window) {
          window.doCheck = function () {
            server.close();
            t.ifError(err);
            t.equal(window.document.body.innerHTML, "Hello world");
            t.done();
          };
        }
      });
    });
  },

  addmetatohead: function(test) {
    var window = jsdom.jsdom().defaultView;
    var meta = window.document.createElement("meta");
    window.document.getElementsByTagName("head").item(0).appendChild(meta);
    var elements = window.document.getElementsByTagName("head").item(0).childNodes;
    test.strictEqual(elements.item(elements.length-1), meta, "last element should be the new meta tag");
    test.ok(serializeDocument(window.document).indexOf("<meta>") > -1, "meta should have open tag");
    test.strictEqual(serializeDocument(window.document).indexOf("</meta>"), -1, "meta should not be stringified with a closing tag");
    test.done();
  },

  "no global leak when using window.location.reload": function (t) {
    // https://github.com/tmpvar/jsdom/pull/1032
    t.equal("errors" in global, false, "there should be no errors global before the call");
    var window = jsdom.jsdom().defaultView;
    window.location.reload();
    t.equal("errors" in global, false, "there should be no errors global after the call");
    t.done();
  }
};
