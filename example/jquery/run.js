var sys    = require("sys"),
    fs     = require("fs"),
    jsdom  = require(__dirname + "/../../lib/jsdom").jsdom,
    window = jsdom().makeWindow(),
    Script = process.binding('evals').Script;

fs.readFile(__dirname + "/jquery.js", function(err, data) {
  try {
    Script.runInNewContext(data.toString(), window);
  } catch(e){
    sys.puts(sys.inspect(e));
    process.exit();
  }

  window.jQuery('body').append("<div class='testing'>Hello World, It works!</div>");
  sys.puts(window.jQuery(".testing").text());
});
