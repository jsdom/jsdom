var path = require('path');
var fs = require('fs');
var jsdom = require('../../lib/jsdom');
var toFileUrl = require('../util').toFileUrl(__dirname);

exports.tests = {
  frame_parent: function(test) {
    var window = jsdom.jsdom('<html><head>\
      <script>\
        aGlobal=1;\
        var iframe = document.createElement("iframe");\
        iframe.src = "' + toFileUrl('files/iframe.html') + '";\
        document.body.appendChild(iframe);\
      </script>\
      </head><body></body></html>',
      {
        features : {
          FetchExternalResources: ['script','iframe'],
          ProcessExternalResources: ['script','iframe']
        }
      }).defaultView;
    window.iframe.onload = function() {
      test.strictEqual(window.DONE, 1);
      test.strictEqual(window.PARENT_IS_TOP, true);

      //insert a script tag to make sure the global set in the iframe is visible
      //in the parent window context
      var doc = window.document;
      var script = doc.createElement('script');
      script.textContent = 'results=[aGlobal, DONE, PARENT_IS_TOP]';
      doc.body.appendChild(script);
      //the script is executed asynchronously after insertion to the document,
      //so setTimeout is needed
      setTimeout(function(){
        test.deepEqual(window.results, [1, 1, true]);
        test.done();
      }, 0);
    };
  },

  frame_src_relative_to_parent_doc: function(test) {
    var window = jsdom.jsdom('<html><body>\
      <iframe src="./files/iframe.html"></iframe>\
      </body></html>',
      {
        url : toFileUrl("test.html"),
        features : {
          FetchExternalResources: ['script','iframe'],
          ProcessExternalResources: ['script','iframe']
        }
      }).defaultView;
    window.document.onload = function(){
      test.strictEqual(window.LOADED_FRAME, 1);
      test.strictEqual(window.PARENT_IS_TOP, true);
      test.done();
    };
  },

  'test iframe element existence' : function (test) {
    var iframeParentPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(iframeParentPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var elem = doc.getElementById('simpleIFrameID');
    test.notEqual(elem, null);
    test.equal(elem.name, 'simpleIFrame');
    test.equal(elem.id, 'simpleIFrameID');
    test.done();
  },

  'test iframe.contentDocument access' : function(test) {
    var iframeParentPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(iframeParentPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    doc.addEventListener('load', function () {
      var iframeElem = doc.getElementById('simpleIFrameID');
      test.notEqual(iframeElem, null);
      var iframeDoc = iframeElem.contentDocument;
      test.notEqual(iframeDoc, null);
      test.notStrictEqual(iframeDoc, doc);
      var iframeDiv = iframeDoc.getElementById('iframeDiv');
      test.notEqual(iframeDiv, null);
      test.equal(iframeDiv.innerHTML, "Initial Text");
      test.done();
    });
  },

  'test iframe load event' : function(test) {
    var doc = jsdom.jsdom(null, {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var iFrame = doc.createElement('iframe');
    iFrame.addEventListener('load', function () {
      test.notEqual(iFrame.contentDocument, null);
      test.done();
    });
    iFrame.src = 'files/simple_iframe.html';
    // Must insert into doc to force load.
    doc.documentElement.appendChild(iFrame);
  },

  'iframe loads blank document when src unspecified' : function(test) {
    var doc = jsdom.jsdom(null);
    var iFrame = doc.createElement('iframe');
    iFrame.addEventListener('load', function () {
      test.notEqual(iFrame.contentDocument, null);
      test.strictEqual(iFrame.contentDocument.readyState, 'complete');
      test.done();
    });
    doc.documentElement.appendChild(iFrame);
  },

  'test iframe.contentWindow acccess' : function(test) {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    doc.addEventListener('load', function () {
      var iframeElem = doc.getElementById('simpleIFrameID');
      test.notEqual(iframeElem, null);
      var iframeDoc = iframeElem.contentDocument;
      test.notEqual(iframeDoc, null);
      var iframeWindow = iframeElem.contentWindow;
      test.notStrictEqual(iframeWindow, doc.defaultView);
      test.equal(iframeWindow, iframeDoc.defaultView);
      test.done();
    });
  },

  'get iframe window via indexed frames access' : function(test) {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    doc.addEventListener('load', function () {
      var window = doc.defaultView;
      var iframeWindow = window.frames[0];
      test.notEqual(iframeWindow, null);
      test.notStrictEqual(iframeWindow, window);
      test.strictEqual(iframeWindow.parent, window);
      var iframeDoc = iframeWindow.document;
      test.notStrictEqual(iframeWindow.document, window.document);
      test.notEqual(iframeWindow.document.getElementById('iframeDiv'), null);
      test.done();
    });
  },

  'get iframe window via indexed frames access with setAttributeNode' : function(test) {
    var doc = jsdom.jsdom("<html><head></head><body><iframe name='simpleIFrame' id='simpleIFrameID'></iframe></body></html>", {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var iframe = doc.getElementById('simpleIFrameID');
    var attr = doc.createAttribute('src');
    attr.value = 'files/simple_iframe.html';
    iframe.setAttributeNode(attr);

    iframe.addEventListener('load', function () {
      var window = doc.defaultView;
      var iframeWindow = window.frames[0];
      test.notEqual(iframeWindow, null);
      test.notStrictEqual(iframeWindow, window);
      test.strictEqual(iframeWindow.parent, window);
      var iframeDoc = iframeWindow.document;
      test.notStrictEqual(iframeWindow.document, window.document);
      test.notEqual(iframeWindow.document.getElementById('iframeDiv'), null);
      test.done();
    });
  },

  'update named frames access on name change' : function(test) {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    doc.addEventListener('load', function () {
      var window = doc.defaultView;
      var iframeWindow = window.frames['simpleIFrame'];
      test.notEqual(iframeWindow, null);
      test.notStrictEqual(iframeWindow, window);
      test.strictEqual(iframeWindow.parent, window);
      doc.getElementById('simpleIFrameID').setAttribute('name', 'otherSimpleIFrame');
      test.ok(!window.frames['simpleIFrame'], 'remove old named property');
      test.ok(window.frames['otherSimpleIFrame'], 'add new named property');
      test.done();
    });
  },

  // See: http://www.whatwg.org/specs/web-apps/current-work/#dom-frames
  'test frames array identity' : function(test) {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    doc.addEventListener('load', function () {
      var window = doc.defaultView;
      test.strictEqual(window.frames, window);
      test.done();
    });
  },

  'test nested iframes' : function (test) {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var window = doc.defaultView;
    doc.addEventListener('load', function () {
      var topIFrameElem = doc.getElementById('simpleIFrameID');
      var topIFrameDoc = topIFrameElem.contentDocument;
      var topIFrameWindow = topIFrameElem.contentWindow;
      var bottomIFrameElem = topIFrameDoc.createElement('iframe');
      bottomIFrameElem.addEventListener('load', function () {
        var bottomIFrameDoc = bottomIFrameElem.contentDocument;
        test.notEqual(bottomIFrameDoc, null);
        var bottomIFrameWindow = bottomIFrameDoc.defaultView;
        test.notEqual(bottomIFrameWindow, null);

        // The real tests
        test.strictEqual(bottomIFrameWindow.parent, topIFrameWindow);
        test.strictEqual(bottomIFrameWindow.top, window);
        test.strictEqual(topIFrameWindow.parent, window);
        test.strictEqual(topIFrameWindow.top, window);
        test.strictEqual(window.frames[0], topIFrameWindow);
        test.strictEqual(topIFrameWindow.frames[0], bottomIFrameWindow);
        test.done();
      });
      bottomIFrameElem.src = 'simple_iframe.html';
      topIFrameDoc.documentElement.appendChild(bottomIFrameElem);
    });
  },

  'test multiple iframes' : function (test) {
    var htmlPath = path.resolve(__dirname, 'files', 'multiple_iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var window = doc.defaultView;
    doc.addEventListener('load', function () {
      var iframe1 = doc.getElementById('frame1ID');
      var iframe2 = doc.getElementById('frame2ID');
      var iframe3 = doc.getElementById('frame3ID');
      test.notEqual(window, iframe1.contentWindow);
      test.notEqual(window, iframe2.contentWindow);
      test.notEqual(window, iframe3.contentWindow);
      test.equal(iframe1.contentWindow.parent, window);
      test.equal(iframe2.contentWindow.parent, window);
      test.equal(iframe3.contentWindow.parent, window);
      test.equal(iframe1.contentWindow.top, window);
      test.equal(iframe2.contentWindow.top, window);
      test.equal(iframe3.contentWindow.top, window);
      test.done();
    });
  },

  'test named lookup' : function (test) {
    var htmlPath = path.resolve(__dirname, 'files', 'multiple_iframe_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var window = doc.defaultView;
    doc.addEventListener('load', function () {
      var iframe1 = doc.getElementById('frame1ID');
      var iframe2 = doc.getElementById('frame2ID');
      var iframe3 = doc.getElementById('frame3ID');
      test.equal(window['frame1'], iframe1.contentWindow);
      test.equal(window['frame2'], iframe2.contentWindow);
      test.equal(window['frame3'], iframe3.contentWindow);
      test.done();
    });
  },

  // This is based off of a test from the jQuery test suite that was failing.
  'test iframe without src' : function (test) {
    var doc = jsdom.jsdom(null, {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var window = doc.defaultView;
    window.loaded = function () {
      test.equal(window.testVal, 3);
      test.done();
    };

    var iframe = doc.createElement('iframe');
    doc.body.appendChild(iframe);

    var iframeDoc = iframe.contentDocument;
    test.notEqual(iframeDoc, null);
    iframeDoc.open();
    iframeDoc.write("<body onload='window.top.testVal = 3;window.parent.loaded()'>");
    iframeDoc.close();
  },

  'test setting src multiple times' : function (test) {
    var doc = jsdom.jsdom(null, {
      features : {
        FetchExternalResources   : ['script', 'iframe'],
        ProcessExternalResources : ['script', 'iframe']
      },
      url : toFileUrl(__filename)
    });
    var iframe = doc.createElement('iframe');
    iframe.addEventListener('load', function () {
      test.equal(iframe.src, 'files/simple_iframe.html');
      test.done();
    });
    iframe.src = 'garbage';
    iframe.src = 'files/simple_iframe.html';
    doc.body.appendChild(iframe);
  },

  'test framesets' : function (test) {
    var htmlPath = path.resolve(__dirname, 'files', 'frameset_parent.html');
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, 'utf8'), {
      features : {
        FetchExternalResources   : ['script', 'frame'],
        ProcessExternalResources : ['script', 'frame']
      },
      url : toFileUrl(__filename)
    });
    var window = doc.defaultView;
    doc.addEventListener('load', function () {
      var frame1 = doc.getElementById('frame1ID');
      var frame2 = doc.getElementById('frame2ID');
      test.notEqual(frame1, null);
      test.notEqual(frame2, null);

      var frame1doc = frame1.contentDocument;
      var frame2doc = frame2.contentDocument;
      test.notEqual(frame1doc, null);
      test.notEqual(frame2doc, null);

      test.strictEqual(frame1.contentWindow, frame1doc.defaultView);
      test.strictEqual(frame2.contentWindow, frame2doc.defaultView);
      test.strictEqual(window.frames[0], frame1.contentWindow);
      test.strictEqual(window.frames[1], frame2.contentWindow);
      test.strictEqual(window.frames['frame1'], frame1.contentWindow);
      test.strictEqual(window.frames['frame2'], frame2.contentWindow);
      test.equal(window, frame1.contentWindow.parent);
      test.equal(window, frame2.contentWindow.parent);

      test.done();
    });
  },

  'test frame references': function (test) {
    var document = jsdom.jsdom("<!doctype html><iframe name='foo'></iframe>");
    var window = document.defaultView;

    test.strictEqual(window.length, 1, "frame should exist (.length)");
    test.notEqual(window[0], undefined, "frame should exist (undefined check)");
    test.strictEqual(window[0], window.foo, "index access and name access should return same reference");

    test.done();
  },

  'remove frame': function (test) {
    var document = jsdom.jsdom("<!doctype html><iframe id='myFrame' name='foo'></iframe>");
    var window = document.defaultView;

    test.strictEqual(window.length, 1, "frame should exist (.length)");
    test.notEqual(window[0], undefined, "frame should exist (undefined check)");
    document.body.removeChild(document.getElementById("myFrame"));

    test.strictEqual(window.length, 0, "frame shouldn't exist (.length)");
    test.strictEqual(window[0], undefined, "frame shouldn't exist anymore (idx accessor)");
    test.strictEqual(window.foo, undefined, "frame shouldn't exist anymore (name accessor)");
    test.ok(!('0' in window), "'0' should not be in window anymore");

    test.done();
  },

  'remove middle frame': function (test) {
    var document = jsdom.jsdom("<!doctype html><iframe id='myFrame1' name='foo1'></iframe>"+
      "<iframe id='myFrame2' name='foo2'></iframe><iframe id='myFrame3' name='foo3'></iframe>");
    var window = document.defaultView;

    test.strictEqual(window.length, 3, "frames should exist (.length)");
    test.notEqual(window[0], undefined, "frame1 should exist (undefined check)");
    test.notEqual(window[1], undefined, "frame2 should exist (undefined check)");
    test.notEqual(window[2], undefined, "frame3 should exist (undefined check)");

    document.body.removeChild(document.getElementById("myFrame2"));
    test.strictEqual(window.length, 2, "frame shouldn't exist (.length)");
    test.strictEqual(window[2], undefined, "frame shouldn't exist anymore (idx accessor)");
    test.strictEqual(window.foo2, undefined, "frame shouldn't exist anymore (name accessor)");

    test.strictEqual(window.foo3, window[1], "frame index accessor should be moved down");
    
    document.body.removeChild(document.getElementById("myFrame1"));
    test.strictEqual(window.length, 1, "frame shouldn't exist (.length)");
    test.strictEqual(window[1], undefined, "frame shouldn't exist anymore (idx accessor)");
    test.strictEqual(window.foo1, undefined, "frame shouldn't exist anymore (name accessor)");

    test.strictEqual(window.foo3, window[0], "frame index accessor should be moved down");
    
    test.done();
  },

  'accessor should not exist before append': function(test) {
    var document = jsdom.jsdom();
    var el = document.createElement("iframe");
    el.setAttribute("name", "foo");

    test.strictEqual(document.defaultView.length, 0, "no frames should exist yet");
    test.strictEqual(document.defaultView[0], undefined, "indexed access should fail");
    test.strictEqual(document.defaultView.foo, undefined, "named access should fail");

    document.body.appendChild(el);

    test.strictEqual(document.defaultView.length, 1,
      "appended frame should increase window.length");
    test.notEqual(document.defaultView[0], undefined,
      "indexed access should succeed");
    test.notEqual(document.defaultView.foo, undefined,
      "named access should succeed");
    test.strictEqual(document.defaultView.foo, document.defaultView[0],
      "named and indexed access should return same object");

    document.body.removeChild(el);

    test.strictEqual(document.defaultView.length, 0, "no frames should exist yet");
    test.strictEqual(document.defaultView[0], undefined, "indexed access should fail");
    test.strictEqual(document.defaultView.foo, undefined, "named access should fail");

    document.body.appendChild(el);

    test.strictEqual(document.defaultView.length, 1,
      "appended frame should increase window.length");
    test.notEqual(document.defaultView[0], undefined,
      "indexed access should succeed");
    test.notEqual(document.defaultView.foo, undefined,
      "named access should succeed");
    test.strictEqual(document.defaultView.foo, document.defaultView[0],
      "named and indexed access should return same object");

    test.done();
  },

  'move frame': function (test) {
    var document = jsdom.jsdom("<!doctype html><iframe name='foo'></iframe>");
    var window = document.defaultView;

    var frame = document.querySelector("iframe");
    var beforeFrame = document.createElement("iframe");
    beforeFrame.setAttribute("name", "bar");
    document.body.insertBefore(beforeFrame, frame);

    test.strictEqual(window.length, 2, "should load 2 iframes");
    test.strictEqual(window.bar, window[0], "bar should be first frame");
    test.strictEqual(window.foo, window[1], "foo should be second frame");

    test.done();
  },

  'frame should not be loaded and accessor should not exist until in document, even with a parent node': function (t) {
    var document = jsdom.jsdom("<!doctype html>", { url: toFileUrl(__filename) });
    var window = document.defaultView;

    var frame = document.createElement("iframe");
    frame.onload = function () {
      t.ok(false, "onload should not be called");
    };
    var parentNode = document.createElement("div");
    parentNode.appendChild(frame);

    frame.src = "files/simple_iframe.html";
    frame.setAttribute("name", "foo");

    t.strictEqual(window.length, 0, "window length should be zero (no frames)");
    t.strictEqual(window[0], undefined, "window should not have a 0 property");
    t.strictEqual(window.foo, undefined, "window should not have a property for the iframe name");

    setTimeout(function () {
      t.done();
    }, 1000);
  }
};
