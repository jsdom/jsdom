var path = require('path');
var fs = require('fs');

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
var toFileUrl = require('../util.js').toFileUrl(__dirname);

describe("frame", { skipIfBrowser: true }, () => {
  specify('frame_parent', (t) => {
    var { window } = new JSDOM('<html><body>\
      <script>\
        aGlobal=1;\
        var iframe = document.createElement("iframe");\
        iframe.src = "' + toFileUrl('files/iframe.html') + '";\
        document.body.appendChild(iframe);\
      </script>',
      { resources: "usable", runScripts: "dangerously" });
    window.iframe.onload = function() {
      assert.strictEqual(window.DONE, 1);
      assert.strictEqual(window.PARENT_IS_TOP, true);

      //insert a script tag to make sure the global set in the iframe is visible
      //in the parent window context
      var doc = window.document;
      var script = doc.createElement('script');
      script.textContent = 'results=[aGlobal, DONE, PARENT_IS_TOP]';
      doc.body.appendChild(script);
      //the script is executed asynchronously after insertion to the document,
      //so setTimeout is needed
      setTimeout(function(){
        assert.deepEqual(window.results, [1, 1, true]);
        t.done();
      }, 0);
    };
  }, {
    async: true
  });

  specify('frame_src_relative_to_parent_doc', (t) => {
    var { window } = new JSDOM('<html><body>\
      <iframe src="./files/iframe.html"></iframe>\
      </body></html>',
      {
        url: toFileUrl("test.html"),
        resources: "usable",
        runScripts: "dangerously"
      });
    window.document.onload = function(){
      assert.strictEqual(window.LOADED_FRAME, 1);
      assert.strictEqual(window.PARENT_IS_TOP, true);
      t.done();
    };
  }, {
    async: true
  });

  specify('test iframe element existence', () => {
    var iframeParentPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var { window } = new JSDOM(fs.readFileSync(iframeParentPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    var elem = window.document.getElementById('simpleIFrameID');
    assert.notEqual(elem, null);
    assert.equal(elem.name, 'simpleIFrame');
    assert.equal(elem.id, 'simpleIFrameID');
  });

  specify('test iframe.contentDocument access', (t) => {
    var iframeParentPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var { window } = new JSDOM(fs.readFileSync(iframeParentPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    window.document.addEventListener('load', function () {
      var iframeElem = window.document.getElementById('simpleIFrameID');
      assert.notEqual(iframeElem, null);
      var iframeDoc = iframeElem.contentDocument;
      assert.notEqual(iframeDoc, null);
      assert.notStrictEqual(iframeDoc, window.document);
      var iframeDiv = iframeDoc.getElementById('iframeDiv');
      assert.notEqual(iframeDiv, null);
      assert.equal(iframeDiv.innerHTML, "Initial Text");
      t.done();
    });
  }, {
    async: true
  });

  specify('test iframe load event', (t) => {
    var { window } = new JSDOM(``, {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    var iFrame = window.document.createElement('iframe');
    iFrame.addEventListener('load', function () {
      assert.notEqual(iFrame.contentDocument, null);
      t.done();
    });
    iFrame.src = 'files/simple_iframe.html';
    // Must insert into doc to force load.
    window.document.documentElement.appendChild(iFrame);
  }, {
    async: true
  });

  specify('iframe loads blank document when src unspecified', (t) => {
    var doc = (new JSDOM(``, { resources: "usable" })).window.document;
    var iFrame = doc.createElement('iframe');
    iFrame.addEventListener('load', function () {
      assert.notEqual(iFrame.contentDocument, null);
      assert.strictEqual(iFrame.contentDocument.readyState, 'complete');
      t.done();
    });
    doc.documentElement.appendChild(iFrame);
  }, {
    async: true
  });

  specify('test iframe.contentWindow acccess', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var { window } = new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    window.document.addEventListener('load', function () {
      var iframeElem = window.document.getElementById('simpleIFrameID');
      assert.notEqual(iframeElem, null);
      var iframeDoc = iframeElem.contentDocument;
      assert.notEqual(iframeDoc, null);
      var iframeWindow = iframeElem.contentWindow;
      assert.notStrictEqual(iframeWindow, window.document.defaultView);
      assert.equal(iframeWindow, iframeDoc.defaultView);
      t.done();
    });
  }, {
    async: true
  });

  specify('get iframe window via indexed frames access', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var { window } = new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    window.document.addEventListener('load', function () {
      var iframeWindow = window.frames[0];
      assert.notEqual(iframeWindow, null);
      assert.notStrictEqual(iframeWindow, window);
      assert.strictEqual(iframeWindow.parent, window);
      var iframeDoc = iframeWindow.document;
      assert.notStrictEqual(iframeWindow.document, window.document);
      assert.strictEqual(iframeWindow.document, iframeDoc);
      assert.notEqual(iframeWindow.document.getElementById('iframeDiv'), null);
      t.done();
    });
  }, {
    async: true
  });

  specify('get iframe window via indexed frames access with setAttributeNode', (t) => {
    var { window } = new JSDOM("<html><head></head><body><iframe name='simpleIFrame' id='simpleIFrameID'></iframe></body></html>", {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    const doc = window.document;
    var iframe = doc.getElementById('simpleIFrameID');
    var attr = doc.createAttribute('src');
    attr.value = 'files/simple_iframe.html';
    iframe.setAttributeNode(attr);

    iframe.addEventListener('load', function () {
      var window = doc.defaultView;
      var iframeWindow = window.frames[0];
      assert.notEqual(iframeWindow, null);
      assert.notStrictEqual(iframeWindow, window);
      assert.strictEqual(iframeWindow.parent, window);
      var iframeDoc = iframeWindow.document;
      assert.notStrictEqual(iframeWindow.document, window.document);
      assert.notEqual(iframeWindow.document.getElementById('iframeDiv'), null);
      t.done();
    });
  }, {
    async: true
  });

  specify('update named frames access on name change', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = (new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    })).window.document;

    doc.addEventListener('load', function () {
      var window = doc.defaultView;
      var iframeWindow = window.frames['simpleIFrame'];
      assert.notEqual(iframeWindow, null);
      assert.notStrictEqual(iframeWindow, window);
      assert.strictEqual(iframeWindow.parent, window);
      doc.getElementById('simpleIFrameID').setAttribute('name', 'otherSimpleIFrame');
      assert.ok(!window.frames['simpleIFrame'], 'remove old named property');
      assert.ok(window.frames['otherSimpleIFrame'], 'add new named property');
      t.done();
    });
  }, {
    async: true
  });

  // See: http://www.whatwg.org/specs/web-apps/current-work/#dom-frames
  specify('test frames array identity', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var doc = (new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    })).window.document;
    doc.addEventListener('load', function () {
      var window = doc.defaultView;
      assert.strictEqual(window.frames, window);
      t.done();
    });
  }, {
    async: true
  });

  specify('test nested iframes', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'iframe_parent.html');
    var { window } = new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    const doc = window.document;
    doc.addEventListener('load', function () {
      var topIFrameElem = doc.getElementById('simpleIFrameID');
      var topIFrameDoc = topIFrameElem.contentDocument;
      var topIFrameWindow = topIFrameElem.contentWindow;
      var bottomIFrameElem = topIFrameDoc.createElement('iframe');
      bottomIFrameElem.addEventListener('load', function () {
        var bottomIFrameDoc = bottomIFrameElem.contentDocument;
        assert.notEqual(bottomIFrameDoc, null);
        var bottomIFrameWindow = bottomIFrameDoc.defaultView;
        assert.notEqual(bottomIFrameWindow, null);

        // The real tests
        assert.strictEqual(bottomIFrameWindow.parent, topIFrameWindow);
        assert.strictEqual(bottomIFrameWindow.top, window);
        assert.strictEqual(topIFrameWindow.parent, window);
        assert.strictEqual(topIFrameWindow.top, window);
        assert.strictEqual(window.frames[0], topIFrameWindow);
        assert.strictEqual(topIFrameWindow.frames[0], bottomIFrameWindow);
        t.done();
      });
      bottomIFrameElem.src = 'simple_iframe.html';
      topIFrameDoc.documentElement.appendChild(bottomIFrameElem);
    });
  }, {
    async: true
  });

  specify('test multiple iframes', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'multiple_iframe_parent.html');
    var { window } = new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    var doc = window.document;
    doc.addEventListener('load', function () {
      var iframe1 = doc.getElementById('frame1ID');
      var iframe2 = doc.getElementById('frame2ID');
      var iframe3 = doc.getElementById('frame3ID');
      assert.notEqual(window, iframe1.contentWindow);
      assert.notEqual(window, iframe2.contentWindow);
      assert.notEqual(window, iframe3.contentWindow);
      assert.equal(iframe1.contentWindow.parent, window);
      assert.equal(iframe2.contentWindow.parent, window);
      assert.equal(iframe3.contentWindow.parent, window);
      assert.equal(iframe1.contentWindow.top, window);
      assert.equal(iframe2.contentWindow.top, window);
      assert.equal(iframe3.contentWindow.top, window);
      t.done();
    });
  }, {
    async: true
  });

  specify('test named lookup', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'multiple_iframe_parent.html');
    var { window } = new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(__filename)
    });
    var doc = window.document;
    doc.addEventListener('load', function () {
      var iframe1 = doc.getElementById('frame1ID');
      var iframe2 = doc.getElementById('frame2ID');
      var iframe3 = doc.getElementById('frame3ID');
      assert.equal(window['frame1'], iframe1.contentWindow);
      assert.equal(window['frame2'], iframe2.contentWindow);
      assert.equal(window['frame3'], iframe3.contentWindow);
      t.done();
    });
  }, {
    async: true
  });

  // This is based off of a test from the jQuery test suite that was failing.
  specify('test iframe without src', (t) => {
    var { window } = new JSDOM(``, {
      resources: "usable",
      url : toFileUrl(__filename),
      runScripts: "dangerously"
    });
    var doc = window.document;
    window.loaded = function () {
      assert.equal(window.testVal, 3);
      t.done();
    };

    var iframe = doc.createElement('iframe');
    doc.body.appendChild(iframe);

    var iframeDoc = iframe.contentDocument;
    assert.notEqual(iframeDoc, null);
    iframeDoc.open();
    iframeDoc.write("<body onload='window.top.testVal = 3;window.parent.loaded()'>");
    iframeDoc.close();
  }, {
    async: true
  });

  specify('test setting src multiple times', (t) => {
    var doc = (new JSDOM(null, {
      resources: "usable",
      url : toFileUrl(__filename)
    })).window.document;
    var iframe = doc.createElement('iframe');
    iframe.addEventListener('load', function () {
      assert.equal(iframe.src, toFileUrl('files/simple_iframe.html'));
      t.done();
    });
    iframe.src = 'garbage';
    iframe.src = 'files/simple_iframe.html';
    doc.body.appendChild(iframe);
  }, {
    async: true
  });

  specify('test framesets', (t) => {
    var htmlPath = path.resolve(__dirname, 'files', 'frameset_parent.html');
    var { window } = new JSDOM(fs.readFileSync(htmlPath, 'utf8'), {
      resources: "usable",
      url : toFileUrl(htmlPath)
    });
    var doc = window.document;
    doc.addEventListener('load', function () {
      var frame1 = doc.getElementById('frame1ID');
      var frame2 = doc.getElementById('frame2ID');
      assert.notEqual(frame1, null);
      assert.notEqual(frame2, null);

      var frame1doc = frame1.contentDocument;
      var frame2doc = frame2.contentDocument;
      assert.notEqual(frame1doc, null);
      assert.notEqual(frame2doc, null);

      assert.strictEqual(frame1.contentWindow, frame1doc.defaultView);
      assert.strictEqual(frame2.contentWindow, frame2doc.defaultView);
      assert.strictEqual(window.frames[0], frame1.contentWindow);
      assert.strictEqual(window.frames[1], frame2.contentWindow);
      assert.strictEqual(window.frames['frame1'], frame1.contentWindow);
      assert.strictEqual(window.frames['frame2'], frame2.contentWindow);
      assert.equal(window, frame1.contentWindow.parent);
      assert.equal(window, frame2.contentWindow.parent);

      t.done();
    });
  }, {
    async: true
  });

  specify('test frame references', () => {
    var { window } = new JSDOM("<!doctype html><iframe name='foo'></iframe>");

    assert.strictEqual(window.length, 1, "frame should exist (.length)");
    assert.notEqual(window[0], undefined, "frame should exist (undefined check)");
    assert.strictEqual(window[0], window.foo, "index access and name access should return same reference");
  });

  specify('remove frame', () => {
    var { window } = new JSDOM("<!doctype html><iframe id='myFrame' name='foo'></iframe>");

    assert.strictEqual(window.length, 1, "frame should exist (.length)");
    assert.notEqual(window[0], undefined, "frame should exist (undefined check)");
    window.document.body.removeChild(window.document.getElementById("myFrame"));

    assert.strictEqual(window.length, 0, "frame shouldn't exist (.length)");
    assert.strictEqual(window[0], undefined, "frame shouldn't exist anymore (idx accessor)");
    assert.strictEqual(window.foo, undefined, "frame shouldn't exist anymore (name accessor)");
    assert.ok(!('0' in window), "'0' should not be in window anymore");
  });

  specify('remove middle frame', () => {
    var { window } = new JSDOM("<!doctype html><iframe id='myFrame1' name='foo1'></iframe>"+
      "<iframe id='myFrame2' name='foo2'></iframe><iframe id='myFrame3' name='foo3'></iframe>");

    assert.strictEqual(window.length, 3, "frames should exist (.length)");
    assert.notEqual(window[0], undefined, "frame1 should exist (undefined check)");
    assert.notEqual(window[1], undefined, "frame2 should exist (undefined check)");
    assert.notEqual(window[2], undefined, "frame3 should exist (undefined check)");

    window.document.body.removeChild(window.document.getElementById("myFrame2"));
    assert.strictEqual(window.length, 2, "frame shouldn't exist (.length)");
    assert.strictEqual(window[2], undefined, "frame shouldn't exist anymore (idx accessor)");
    assert.strictEqual(window.foo2, undefined, "frame shouldn't exist anymore (name accessor)");

    assert.strictEqual(window.foo3, window[1], "frame index accessor should be moved down");

    window.document.body.removeChild(window.document.getElementById("myFrame1"));
    assert.strictEqual(window.length, 1, "frame shouldn't exist (.length)");
    assert.strictEqual(window[1], undefined, "frame shouldn't exist anymore (idx accessor)");
    assert.strictEqual(window.foo1, undefined, "frame shouldn't exist anymore (name accessor)");

    assert.strictEqual(window.foo3, window[0], "frame index accessor should be moved down");
  });

  specify('accessor should not exist before append', () => {
    var { document } = (new JSDOM()).window;
    var el = document.createElement("iframe");
    el.setAttribute("name", "foo");

    assert.strictEqual(document.defaultView.length, 0, "no frames should exist yet");
    assert.strictEqual(document.defaultView[0], undefined, "indexed access should fail");
    assert.strictEqual(document.defaultView.foo, undefined, "named access should fail");

    document.body.appendChild(el);

    assert.strictEqual(document.defaultView.length, 1,
      "appended frame should increase window.length");
    assert.notEqual(document.defaultView[0], undefined,
      "indexed access should succeed");
    assert.notEqual(document.defaultView.foo, undefined,
      "named access should succeed");
    assert.strictEqual(document.defaultView.foo, document.defaultView[0],
      "named and indexed access should return same object");

    document.body.removeChild(el);

    assert.strictEqual(document.defaultView.length, 0, "no frames should exist yet");
    assert.strictEqual(document.defaultView[0], undefined, "indexed access should fail");
    assert.strictEqual(document.defaultView.foo, undefined, "named access should fail");

    document.body.appendChild(el);

    assert.strictEqual(document.defaultView.length, 1,
      "appended frame should increase window.length");
    assert.notEqual(document.defaultView[0], undefined,
      "indexed access should succeed");
    assert.notEqual(document.defaultView.foo, undefined,
      "named access should succeed");
    assert.strictEqual(document.defaultView.foo, document.defaultView[0],
      "named and indexed access should return same object");
  });

  specify('move frame', () => {
    var { window } = new JSDOM("<!doctype html><iframe name='foo'></iframe>");
    var document = window.document;

    var frame = document.querySelector("iframe");
    var beforeFrame = document.createElement("iframe");
    beforeFrame.setAttribute("name", "bar");
    document.body.insertBefore(beforeFrame, frame);

    assert.strictEqual(window.length, 2, "should load 2 iframes");
    assert.strictEqual(window.bar, window[0], "bar should be first frame");
    assert.strictEqual(window.foo, window[1], "foo should be second frame");
  });

  specify('frame should not be loaded and accessor should not exist until in document, even with a parent node', (t) => {
    var { window } = new JSDOM("<!doctype html>", { url: toFileUrl(__filename) });
    var document = window.document;

    var frame = document.createElement("iframe");
    frame.onload = function () {
      assert.ok(false, "onload should not be called");
    };
    var parentNode = document.createElement("div");
    parentNode.appendChild(frame);

    frame.src = "files/simple_iframe.html";
    frame.setAttribute("name", "foo");

    assert.strictEqual(window.length, 0, "window length should be zero (no frames)");
    assert.strictEqual(window[0], undefined, "window should not have a 0 property");
    assert.strictEqual(window.foo, undefined, "window should not have a property for the iframe name");

    setTimeout(function () {
      t.done();
    }, 1000);
  }, {
    async: true
  });
});
