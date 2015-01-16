"use strict";

var jsdom = require("../..");

exports["image constructor should create a HTMLImageElement with specified width and height"] = function(test) {
  var window = jsdom.jsdom().parentWindow;
  var image = new window.Image(100,200);

  test.equal(image.width, 100, "width is not set right");
  test.equal(image.height, 200, "height is not set right");
  test.done();
};
