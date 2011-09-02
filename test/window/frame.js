var jsdom = require('../../lib/jsdom');

exports.tests = {
  frame_parent: function(test) {
    var window = jsdom.jsdom('<html><head>\
      <script>\
        aGlobal=1;\
        var iframe = document.createElement("iframe");\
        iframe.src = "' + __dirname + '/files/iframe.html";\
        document.body.appendChild(iframe);\
      </script>\
      </head><body></body></html>',
      null,
      {
        features : {
          FetchExternalResources: ['script','iframe'], 
          ProcessExternalResources: ['script','iframe']
        }
      }).createWindow();
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
      null,
      {
        url : __dirname + "/test.html",
        features : {
          FetchExternalResources: ['script','iframe'], 
          ProcessExternalResources: ['script','iframe']
        }
      }).createWindow();
    window.document.onload = function(){
      test.strictEqual(window.LOADED_FRAME, 1);
      test.strictEqual(window.PARENT_IS_TOP, true);
      test.done();
    };
  }
};
