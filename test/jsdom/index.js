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
    var jQueryFile = "/../../example/jquery/jquery.js",
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
      try {
        res = jQuery("#para .emph", window.document.body);
      } catch (e) {
        caught = true;
      }
      assertEquals("selector should work as expected", "ME", res.text());
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
  }

};
