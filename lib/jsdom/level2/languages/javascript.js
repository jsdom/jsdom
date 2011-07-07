var vm = require('vm');

exports.javascript = function(element, code, filename) {
  var document = element.ownerDocument,
      window = document.parentWindow;

  if (window) {
    var tracelimitbak = Error.stackTraceLimit;
    Error.stackTraceLimit = 100;
    try {
      vm.Script.runInNewContext(code, window, filename);
    }
    catch(e) {
      element.trigger(
        'error', 'Running ' + filename + ' failed.', 
        {error: e, filename: filename}
      );
    }
    Error.stackTraceLimit = tracelimitbak;
  }
};
