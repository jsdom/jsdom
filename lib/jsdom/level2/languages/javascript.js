var Context = process.binding('evals').Context,
    Script = process.binding('evals').NodeScript || process.binding('evals').Script;

exports.javascript = function(element, code, filename) {
  var document = element.ownerDocument,
      window = document.parentWindow;

  if (window) {
    var ctx = window.__scriptContext;
    if (!ctx) {
      window.__scriptContext = ctx = new Context();
      ctx.__proto__ = window;
    }
    var tracelimitbak = Error.stackTraceLimit;
    Error.stackTraceLimit = 100;
    try {
      Script.runInContext(code, ctx, filename);
    }
    catch(e) {
      document.trigger(
        'error', 'Running ' + filename + ' failed.', 
        {error: e, filename: filename}
      );
    }
    Error.stackTraceLimit = tracelimitbak;
  }
};
