var sys = require("sys");
exports.tests = {

  build_window : function() {
    var window = jsdom.jsdom().createWindow();
    assertNotNull("window must be a new object!", window);
    assertNotNull(window.document);
  },

  jsdom_takes_html : function() {
    var document = jsdom.jsdom('<a id="test" href="#test">');
    assertEquals("Passing html into jsdom() should populate the resulting doc",
                 document.getElementById("test").getAttribute("href"),
                 "#test");
  },

  jsdom_method_creates_default_document : function() {
    var doc = jsdom.jsdom();
    assertEquals("Calling jsdom.jsdom() should automatically populate the doc",
                 doc.documentElement.nodeName,
                 "HTML");
  },

  jquerify : function() {
    var jQueryFile = __dirname + "/../../example/jquery/jquery.js",
        jQueryUrl = "http://code.jquery.com/jquery-1.4.2.min.js",
        caught = false,
        res = null;

    function tmpWindow() {
      return jsdom.jsdom(null, null, {documentRoot: __dirname}).createWindow();
    }

    function testFunction(window, jQuery) {
      assertNotNull("jQuery should be attached to the window", window.jQuery.find);
      assertNotNull("jQuery should be attached to the window", jQuery.find);
      jQuery("body").html('<p id="para"><a class="link">click <em class="emph">ME</em></a></p>');
      res = jQuery("#para .emph").text();
      res2 = jQuery("a.link .emph").text();

      // TODO: there seems to be a problem when selecting from window.document.body

      assertEquals("selector should work as expected", "ME", res);
      assertEquals("selector should work as expected", "ME", res2);
      assertFalse("compareDocumentPosition should not fail", caught);
    };

    jsdom.jQueryify(tmpWindow(), jQueryFile, testFunction);
    jsdom.jQueryify(tmpWindow(), jQueryUrl, testFunction);
  },
  plain_window_document : function() {
    var window = (jsdom.createWindow());
    assertTrue("jsdom.createWindow() should create a documentless window",
               typeof window.document === 'undefined');
  },

  appendChild_to_document_with_existing_documentElement: function() {
    var caught;
    try {
      var doc = jsdom.jsdom();
      doc.appendChild(doc.createElement('html'));
    }
    catch (e) {
      caught = e;
    }
    assertEquals('Should throw HIERARCHY_ERR', 3, caught._code);
  },

  apply_jsdom_features_at_build_time : function() {
    var doc  = new (jsdom.defaultLevel.Document)(),
        doc2 = new (jsdom.defaultLevel.Document)(),
        i,
        defaults = jsdom.defaultDocumentFeatures,
        l = defaults.length;

    jsdom.applyDocumentFeatures(doc);
    for (i=0; i<l; i++) {
      assertTrue("Document has all of the default features",
                 doc.implementation.hasFeature(defaults[i]));
    }

    jsdom.applyDocumentFeatures(doc2, {
      'FetchExternalResources' : false
    });

    assertTrue("Document has 'ProcessExternalResources'",
               doc2.implementation.hasFeature('ProcessExternalResources'));
    assertFalse("Document does not have 'FetchExternalResources'",
                doc2.implementation.hasFeature('FetchExternalResources'));
  },
  ensure_scripts_can_be_disabled_via_options_features : function() {
    var html = '\
<html>\
  <head>\
    <script type="text/javascript" src="./jsdom/files/hello.js"></script>\
  </head>\
  <body>\
    <span id="test">hello from html</span>\
  </body>\
</html>';

    var doc = jsdom.jsdom(html), doc2;
    doc.onload = function() {
      assertEquals("js should be executed",
                   'hello from javascript',
                   doc.getElementById("test").innerHTML);
    };

    doc2 = jsdom.jsdom(html, null, {
      features : {
        FetchExternalResources   : ['script'],
        ProcessExternalResources : false
      }
    });

    doc2.onload = function() {
      assertEquals("js should not be executed",
                   'hello from html',
                   doc2.getElementById("test").innerHTML);
    }
  },

  importNode: function() {
    var caught = false;
    try {
      var doc1 = jsdom.jsdom('<html><body><h1 id="headline">Hello <span id="world">World</span></h1></body></html>'),
          doc2 = jsdom.jsdom();

      doc2.body.appendChild(doc2.importNode(doc1.getElementById('headline'), true));
      doc2.getElementById('world').className = 'foo';
    }
    catch (err) {
      caught = err;
    }
    assertFalse("Importing nodes should not fail", caught);

  },

  window_is_augmented_with_dom_features : function() {
    var document = jsdom.jsdom(),
        window   = document.createWindow();

    assertEquals("window must be augmented", true, window._augmented);
    assertNotNull("window must include Element", window.Element);
  },

  queryselector : function() {
    var html     = '<html><body><div id="main"><p>Foo</p><p>Bar</p></div></body></html>',
        document = jsdom.jsdom(html, null, {
          features : {
            'QuerySelector' : true
          }
        }),
        div      = document.body.children.item(0);

    var element = document.querySelector("#main p");

    assertSame("p and first-p", div.children.item(0), element);

    var element2 = div.querySelector("p");
    assertSame("p and first-p", div.children.item(0), element2);
  },

  queryselectorall : function() {
    var html     = '<html><body><div id="main"><p>Foo</p><p>Bar</p></div></body></html>',
        document = jsdom.jsdom(html, null, {
          features : {
            'QuerySelector' : true
          }
        }),
        div      = document.body.children.item(0),
        elements = document.querySelectorAll("#main p");

    assertEquals("two results", 2, elements.length);
    assertSame("p and first-p", div.children.item(0), elements.item(0));
    assertSame("p and second-p", div.children.item(1), elements.item(1));

    var elements2 = div.querySelectorAll("p");
    assertEquals("two results", 2, elements.length);
    assertSame("p and first-p", div.children.item(0), elements2.item(0));
    assertSame("p and second-p", div.children.item(1), elements2.item(1));
  },
  
  scripts_share_a_global_context : function() {
    var window = jsdom.jsdom('<html><head><script type="text/javascript">\
hello = "hello";\
window.bye = "good";\
var abc = 123;\
</script><script type="text/javascript">\
hello += " world";\
bye = bye + "bye";\
(function() { var hidden = "hidden"; window.exposed = hidden; })();\
</script></head><body></body></html>').createWindow();

   assertEquals("window should be the global context",
                "hello world", window.hello);

   assertEquals("window should be the global context",
                "goodbye", window.bye);

   assertEquals('local vars should not leak out to the window', 
                123, window.abc);

   assertTrue('vars in a closure are safe', typeof window.hidden === 'undefined');
   assertEquals('vars exposed to the window are global', 'hidden', window.exposed);
  },
  url_resolution: function() {
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
        assertEquals("Absolute URL should be left alone", 'http://example.com', doc.getElementById("link1").href);
        assertEquals("Relative URL should be resolved", '/local.html', doc.getElementById("link2").href);
        assertEquals("Relative URL should be resolved", '/path/to/docroot/local.html', doc.getElementById("link3").href);
        assertEquals("Relative URL should be resolved", '/path/local.html', doc.getElementById("link4").href);
        assertEquals("Relative URL should be resolved", '/path/to/docroot/index.html#here', doc.getElementById("link5").href);
        //assertEquals("Protocol-less URL should be resolved", '//prototol/avoidance.html', doc.getElementById("link6").href);
      }

      function testRemote() {
        var url = 'http://example.com/path/to/docroot/index.html'
        var doc = jsdom.jsdom(html, null, {url: url});
        assertEquals("Absolute URL should be left alone", 'http://example.com', 
                     doc.getElementById("link1").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/local.html', 
                     doc.getElementById("link2").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/path/to/docroot/local.html', 
                     doc.getElementById("link3").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/path/local.html', 
                     doc.getElementById("link4").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/path/to/docroot/index.html#here', 
                     doc.getElementById("link5").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/protocol/avoidance.html', 
                     doc.getElementById("link6").href);
      }

      function testBase() {
        var url  = 'blahblahblah-invalid', 
            doc  = jsdom.jsdom(html, null, {url: url}),
            base = doc.createElement("base");
            
        base.href = 'http://example.com/path/to/docroot/index.html';
        doc.getElementsByTagName("head").item(0).appendChild(base);
        
        assertEquals("Absolute URL should be left alone", 'http://example.com', 
                     doc.getElementById("link1").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/local.html', 
                     doc.getElementById("link2").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/path/to/docroot/local.html', 
                     doc.getElementById("link3").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/path/local.html', 
                     doc.getElementById("link4").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/path/to/docroot/index.html#here', 
                     doc.getElementById("link5").href);
        assertEquals("Relative URL should be resolved", 'http://example.com/protocol/avoidance.html', 
                     doc.getElementById("link6").href);
      }

      testLocal();
      testRemote();

      testBase();
    },  
};
