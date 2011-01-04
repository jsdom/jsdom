
exports.javascript = function(element, code, filename) {
  var document = element.ownerDocument,window = document.parentWindow;
  if (window) {
    var tracelimitbak=Error.stackTraceLimit;
    Error.stackTraceLimit = 100
    try {
      process.binding('evals').Script.runInContext(code,window,filename)
    } catch(e) {
      console.log(e.stack);
    }
    Error.stackTraceLimit = tracelimitbak;
  }
};
