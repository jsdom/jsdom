var jsdom  = require("../../lib/jsdom");

var options = {
  html: "<html><body></body></html>",
  scripts: ["ender.js"],
};
jsdom.env(options, function(errors, window) {
	if (errors) {
		console.error(errors);
		return;
	}
  window.$('body').append("<div class='testing'>Hello World, It works!</div>");
  console.log(window.$(".testing").text());
});
