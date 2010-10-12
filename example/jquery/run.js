var sys    = require("sys"),
    jsdom  = require("../../lib/jsdom"),
    window = jsdom.jsdom().createWindow();

// this also works:
// jQueryTag.src = "http://code.jquery.com/jquery-1.4.2.js";
jsdom.jQueryify(window, __dirname + "/jquery.js", function() {
  window.jQuery('body').append("<div class='testing'>Hello World, It works!</div>");
  sys.puts(window.jQuery(".testing").text());
});
