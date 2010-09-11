var sys = require("sys");
exports.tests = {

  build_window : function() {
    var window = jsdom.jsdom().createWindow();
    assertNotNull("window must be a new object!", window);
  },

  jquerify : function() {
    jsdom.jQueryify(jsdom.jsdom().createWindow(), 
                    __dirname + "/../../example/jquery/jquery.js", 
                    function(window, jQuery) 
    {
      assertNotNull("jQuery should be attached to the window", window.jQuery.find);
      assertNotNull("jQuery should be attached to the window", jQuery.find);
      var caught = false;
      try {
        jQuery("#a .test", window.body);
      } catch (e) {
        caught = true;
      }
      assertFalse("compareDocumentPosition should not fail", caught);
    });
  }
};
