var vm = require('vm');

exports.javascript = function(element, code, filename) {
  var document = element.ownerDocument,
      window = document.parentWindow;

  if (window) {
    var ctx = window.__scriptContext;
    if (!ctx) {
      window.__scriptContext = ctx = vm.createContext({});
      ctx.__proto__ = window;
    }
    var tracelimitbak = Error.stackTraceLimit;
    Error.stackTraceLimit = 100;
    try {
      vm.Script.runInContext(code, ctx, filename);
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
