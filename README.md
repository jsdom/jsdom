# jsdom

CommonJS implementation of the DOM intended to be platform independent and as minimal/light as possible while completely adhering to the w3c DOM specifications.

Currently Implemented and w3c Compliant:

  - DOM Level 1 (html/svg/xml) 
  - Browser (BOM) Augmentation (getElementsByClassName, getElementById, etc..)


**Note**: Running the tests now requires [mjsunit.runner][]

see: [testlog][] for w3 test compliance

see: [plan][] for roadmap and thoughts about this project

see: [project site][] for additional information

  [project site]: http://www.jsdom.org
  [mjsunit.runner]: http://github.com/tmpvar/mjsunit.runner
  [testlog]: http://github.com/tmpvar/jsdom/blob/master/test/testlog.txt
  [plan]: http://github.com/tmpvar/jsdom/blob/master/PLAN.md


# Examples

## Creating a document-less window
<pre>
var jsdom  = require("jsdom"),
    window = jsdom.createWindow();

console.log(window.document);
// output: undefined
</pre>

## Creating a window+document with html

    var jsdom  = require("jsdom"),
        window = jsdom.createWindow("<html><head></head><body>hello world</body></html>", jsdom.defaultLevel);

    console.log(window.document.innerHTML);
    // output: '<html><head></head><body>hello world</body></html>'


## Creating a browser-like DOM/Window

    var jsdom  = require("jsdom"),
        window = jsdom.jsdom().createWindow();

    window.document.innerHTML = "<html><head></head><body>hello world</body></html>";
    console.log(window.document.innerHTML);
    // output: '<html><head></head><body>hello world</body></html>'

    console.log(window.innerWidth)
    // output: 1024

    console.log(typeof window.document.getElementsByClassName);
    // outputs: function

## jQuery

    var sys    = require("sys"),
        jsdom  = require(__dirname + "/../../lib/jsdom"),
        window = jsdom.jsdom().createWindow();
  
    jsdom.jQueryify(window, __dirname + "/jquery.js", function() {
      window.jQuery('body').append("&lt;div class='testing'&gt;Hello World, It works!&lt;/div&gt;");
      sys.puts(window.jQuery(".testing").text());
    });


  