var sys = require("sys");
exports.tests = {

  build_window : function() {
    sys.debug(sys.inspect(jsdom));
    var window = jsdom.jsdom().makeWindow();
    assertNotNull("window must be a new object!", window);
  }
};
