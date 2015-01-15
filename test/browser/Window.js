var jsdom = require("../..");
var dom = require("../level1/core");

exports.tests = {
  image_constructor_with_height_and_width: function(test) {
    var window = jsdom.jsdom().parentWindow;
    var image = new window.Image(100,200);

    test.equal(image.width, 100, "width is not set right");
    test.equal(image.height, 200, "height is not set right");
    test.done();
  }
};
