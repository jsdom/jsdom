
exports.javascript = function(element, code, filename) {
  var document = element.ownerDocument,window = document.parentWindow;
  if (window) {
    if (!window.__javascriptEval) {
      // Yeah, its hackery, but it works
      var Script     = process.binding('evals').Script,
          setupCode  = "function __javascriptEval(c, w, f) { runInNewContext(c, w, f); }";

      window.runInNewContext = Script.runInNewContext;
      Script.runInNewContext(setupCode, window);
    }

    try {
      window.__javascriptEval(code, window, filename);
    } catch(e) {
      console.log(e.stack);
    }
  }
};