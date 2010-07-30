var sys    = require("sys"),
    fs     = require("fs"),
    jsdom  = require(__dirname + "/../../lib/jsdom").jsdom,
    window = jsdom().makeWindow(),
    Script = process.binding('evals').Script,
    jQueryTag = window.document.createElement("script");

jQueryTag.src = "file://" + __dirname + "/jquery.js";
window.document.getElementsByTagName('head')[0].appendChild(jQueryTag);

// jQuery is ready!
window.jQuery('body').append("<div class='testing'>Hello World, It works!</div>");
sys.puts(window.jQuery(".testing").text());
