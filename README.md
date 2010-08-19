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

## jQuery
<pre>
  var sys    = require("sys"),
      jsdom  = require(__dirname + "/../../lib/jsdom"),
      window = jsdom.jsdom().createWindow();
  
  // this also works:
  // jQueryTag.src = "http://code.jquery.com/jquery-1.4.2.js";
  jsdom.jQueryify(window, __dirname + "/jquery.js", function() {
    window.jQuery('body').append("&lt;div class='testing'&gt;Hello World, It works!&lt;/div&gt;");
    sys.puts(window.jQuery(".testing").text());
  });
</pre>


  