var sys = require("sys");
exports.tests = {

  build_window : function() {
    var window = jsdom.jsdom().createWindow();
    assertNotNull("window must be a new object!", window);
  },
  
  /*
  Async tests and mjsunit dont play well..
  jquerify : function() {
    var window = jsdom.jQueryify("<html><head></head><body><p>it works</p></body></html>", false, false, 
    function() { 
      console.dir(window);
      assertEqual("jquery selectors should work at this point", window.jQuery("p").text(), "it works");
    });
  }*/
  
};
