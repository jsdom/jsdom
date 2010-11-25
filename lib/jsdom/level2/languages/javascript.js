exports.javascript = function(element, code, filename) {
  var document = element.ownerDocument,window = document.parentWindow;
  if (window) {
    try {
      process.binding('evals').Script.runInNewContext(
        code,
        window,
        filename
      );
    } catch(e) {
      console.log(e.stack);
    }
  }
};