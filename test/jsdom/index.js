var path = require("path"),
    fs   = require("fs");
    
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
        jQueryUrl = "http://code.jquery.com/jquery-1.4.4.min.js",
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

      assertEquals("selecting from body",
                   jQuery('p#para a.link',window.document.body).attr('class'),
                   'link');

      assertTrue('jQuery version 1.4.4', jQuery('body').jquery === '1.4.4');

      assertEquals("selector should work as expected", "ME", res);
      assertEquals("selector should work as expected", "ME", res2);
      assertFalse("compareDocumentPosition should not fail", caught);
    };

    jsdom.jQueryify(tmpWindow(), jQueryFile, testFunction);
    jsdom.jQueryify(tmpWindow(), jQueryUrl, testFunction);
  },

  env_with_absolute_file : function() {
    jsdom.env({
      html : path.join(__dirname, 'files', 'env.html'),
      scripts : [
        path.join(__dirname, '..', '..', 'example', 'jquery', 'jquery.js')
      ],
      done : function(errors, window) {
        assertNull('there should have been no errors', errors)
        var $ = window.jQuery, text = 'Let\'s Rock!';
        $('body').text(text);
        assertEquals("jsdom.env() should load jquery, a document and add some text to the body.",
                   $('body').text(), text);
      }
    });
  },

  env_with_html : function() {
    var html = "<html><body><p>hello world!</p></body></html>";
    jsdom.env({
      html : html,
      done : function(errors, window) {
        assertNull("error should be null", errors);
        assertNotNull("window should be valid", window.location);
      }
    })
  },

  env_with_non_existant_script : function() {
    var html = "<html><body><p>hello world!</p></body></html>";
    jsdom.env({
      html    : html,
      scripts : ['path/to/invalid.js', 'another/invalid.js'],
      done    : function(errors, window) {
        assertNotNull("error should not be null", errors);
        assertEquals("errors is an array", errors.length, 2)
        assertNotNull("window should be valid", window.location);
      }
    });
  },

  env_with_url : function() {
    // spawn an http server
    var
    routes = {
      "/js" : "window.attachedHere = 123",
      "/html" : "<a href='/path/to/hello'>World</a>"
    },
    server = require("http").createServer(function(req, res) {
      res.writeHead(200, {
        "Content-length" : routes[req.url].length
      });
      res.end(routes[req.url]);
    }),
    html = "<html><body><p>hello world!</p></body></html>";

    server.listen(64000);

    jsdom.env({
      html    : "http://127.0.0.1:64000/html",
      scripts : "http://127.0.0.1:64000/js",
      done    : function(errors, window) {
        server.close();
        assertNull("error should not be null", errors);
        assertNotNull("window should be valid", window.location);
        assertEquals("script should execute on our window", window.attachedHere, 123);
        assertEquals("anchor text", window.document.getElementsByTagName("a").item(0).innerHTML, 'World');
      }
    });
  },
  
  env_processArguments_invalid_args : function() {
    var caught = 0;

    try {
      jsdom.env.processArguments();
    } catch (e) {
      caught++;
    }

    try {
      jsdom.env.processArguments({});
    } catch (e) {
      caught++;
    }

    try {
      jsdom.env.processArguments([{
        html : 'abc123'
      }]);
    } catch (e) {
      caught++;
    }

    try {
      jsdom.env.processArguments([{
        done : function() {}
      }]);
    } catch (e) {
      caught++;
    }

    assertEquals("the previous ops should be caught", caught, 4);
  },
  
  env_processArguments_config_object : function() {
    var config = jsdom.env.processArguments([{
      html : "",
      done : function() {}
    }]);

    assertNotNull("has done", config.done);
    assertNotNull("has html", config.html);
  },

  env_processArguments_object_and_callback : function() {
    var config = jsdom.env.processArguments([{
      html    : "",
      scripts : ['path/to/some.js', 'another/path/to.js']
    },
    function() {}
    ]);

    assertNotNull("has done", config.done);
    assertNotNull("has html", config.html);
    assertEquals('has code', 2, config.scripts.length);
  },

  env_processArguments_all_args_no_config : function() {
    var config = jsdom.env.processArguments([
      "<html></html>",
      ['script.js'],
      function() {}
    ]);

    assertNotNull("has done", config.done);
    assertNotNull("has html", config.html);
    assertEquals('script length should be 1', 1, config.scripts.length);
  },

  env_processArguments_all_args_with_config : function() {
    var config = jsdom.env.processArguments([
      "<html></html>",
      ['script.js'],
      { features : [] },
      function() {},
    ]);

    assertNotNull("has done", config.done);
    assertNotNull("has html", config.html);
    assertEquals('script length should be 1', 1, config.scripts.length);
    assertNotNull("has config.features", config.config.features);
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
    assertEquals('Should throw HIERARCHY_ERR', 3, caught.code);
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
      assertEquals("js should not be executed (doc2)",
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
    assertEquals("two results", 2, elements2.length);
    assertSame("p and first-p", div.children.item(0), elements2.item(0));
    assertSame("p and second-p", div.children.item(1), elements2.item(1));

    var elements3 = div.querySelectorAll("#main p");
    assertEquals("two results", 2, elements3.length);
    assertSame("p and first-p", div.children.item(0), elements3.item(0));
    assertSame("p and second-p", div.children.item(1), elements3.item(1));

    var topNode = document.createElement('p'),
        newNode = document.createElement('p');
    topNode.id = "fuz";
    newNode.id = "buz";

    topNode.appendChild(newNode);
    var elements4 = topNode.querySelectorAll("#fuz #buz");
    assertEquals("one result", 1, elements4.length);
    assertSame("newNode and first-p", newNode, elements4.item(0));
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
    numeric_values : function() {

      var html = '\
            <html>\
              <body>\
                <td data-year="2011" data-month="0" data-day="9">\
                  <a href="#" class=" ">9</a> \
                </td>\
              </body>\
            </html>',
          document = jsdom.jsdom(html),
          a        = document.body.children.item(0);

      a.innerHTML = 9;
      a.setAttribute('id', 123);

      assertTrue("Element stringify", "9" === a.innerHTML);
      assertTrue("Attribute stringify",
                 "123" === a.getAttributeNode('id').nodeValue);
    },
    auto_tostring : function() {
      var buffer = fs.readFileSync(__dirname + "/files/env.html"),
          caught = false,
          dom    = null,
          count  = 0;

      try {
        dom = jsdom.jsdom(buffer);
      } catch (e) {
        caught = true;
      }

      assertFalse("buffer's should automatically be stringified", caught);
      count = dom.documentElement.getElementsByTagName("*").length;
      assertEquals("should parse as per usual", count, 3)
    },

    document_should_expose_location : function() {
      var window = jsdom.jsdom("").createWindow();
      assertTrue('document.location and window.location', 
                   window.document.location === window.location);
    },

    script_execution_in_body : function() {
      var window, caught = false;
      
      try {
        window = jsdom.jsdom('<html><body><script>document.body.innerHTML = "monkey"</script></body></html>').createWindow();
      } catch (e) {
        console.log(e.stack)
        caught = true;
      }
      assertFalse('execution should work as expected', caught);
    },

    mutation_events : function() {
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
      assertEquals("an event should be dispatched for each created element", 'H2H1H3', created);
      document.body.removeChild(h1);
      document.body.insertBefore(h3, h2);
      assertEquals("an event should be dispatched for each removed element", 'H1H3', removed);
    },

    remove_listener_in_handler: function() {
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
      assertEquals("handler1 must be called once", 1, h1);
      assertEquals("handler2 must be called once", 1, h2);

      document.dispatchEvent(ev);
      assertEquals("handler1 must be called once", 1, h1);
      assertEquals("handler2 must be called twice", 2, h2);
    },

    childNodes_updates_on_insertChild : function() {
      var window = jsdom.jsdom("").createWindow();
      var div = window.document.createElement("div")
      var text = window.document.createTextNode("bar")
      div.appendChild(text);
      assertEquals("childNodes NodeList should update after appendChild",
                   text, div.childNodes[0])

      text = window.document.createTextNode("bar")
      div.insertBefore(text, null);
      assertEquals("childNodes NodeList should update after insertBefore",
                   text, div.childNodes[1])
    },

    option_set_selected : function() {
      var window = jsdom.jsdom("").createWindow();
      var select = window.document.createElement("select")

      var option0 = window.document.createElement('option');
      select.appendChild(option0);
      option0.setAttribute('selected', 'selected');

      var optgroup = window.document.createElement('optgroup');
      select.appendChild(optgroup);
      var option1 = window.document.createElement('option');
      optgroup.appendChild(option1);

      assertEquals('initially selected', true, option0.selected);
      assertEquals('initially not selected', false, option1.selected);
      assertEquals("options should include options inside optgroup",
                   option1, select.options[1]);

      option1.defaultSelected = true;
      assertEquals('selecting other option should deselect this', false, option0.selected);
      assertEquals('default should not change', true, option0.defaultSelected);
      assertEquals('selected changes when defaultSelected changes', true, option1.selected);
      assertEquals('I just set this', true, option1.defaultSelected);

      option0.defaultSelected = false;
      option0.selected = true;
      assertEquals('I just set this', true, option0.selected);
      assertEquals('selected does not set default', false, option0.defaultSelected);
      assertEquals('should deselect others', false, option1.selected);
      assertEquals('unchanged', true, option1.defaultSelected);
    },
    case_sensitivity_of_markup_missing_html_and_body : function(){
        var spaces = /[ \n]*/g,
            doc1 = jsdom.html("<HTML><BODY></BODY></HTML>").outerHTML.replace(spaces, ''),
            doc2 = jsdom.html("<html><BODY></Body></HTML>").outerHTML.replace(spaces, ''),
            doc3 = jsdom.html("<html><body></body></html>").outerHTML.replace(spaces, ''),
            doc4 = jsdom.html("<body></body>").outerHTML.replace(spaces, ''),
            doc5 = jsdom.html("").outerHTML.replace(spaces, '');

        assertTrue('they should all serialize the same',
            doc1 === doc2 && doc2 == doc3 && doc3 === doc4 && doc4 == doc5)
        
    }
};
