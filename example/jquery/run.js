var jsdom  = require("../../lib/jsdom"),
    window = jsdom.jsdom().createWindow();

// this also works:
// jQueryTag.src = "http://code.jquery.com/jquery-1.4.2.js";
jsdom.jQueryify(window, "jquery.js", function() {
  window.jQuery('body').append("<div class='testing'>Hello World, It works!</div>");
  console.log(window.jQuery(".testing").text());
});
