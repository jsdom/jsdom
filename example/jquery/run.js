var sys    = require("sys"),
    jsdom  = require(__dirname + "/../../lib/jsdom").jsdom,
    window = jsdom().createWindow(),
    head   = window.document.getElementsByTagName('head')[0],
    jQueryTag = window.document.createElement("script");

jQueryTag.src = "file://" + __dirname + "/jquery.js";

// this also works:
// jQueryTag.src = "http://code.jquery.com/jquery-1.4.2.js";

head.appendChild(jQueryTag);

jQueryTag.onload = function() {
  if (this.readyState === 'complete') {
    // jQuery is ready!
    window.jQuery('body').append("<div class='testing'>Hello World, It works!</div>");
    sys.puts(window.jQuery(".testing").text());
  }
};

