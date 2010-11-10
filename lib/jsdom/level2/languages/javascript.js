exports.javascript = function(element, code, filename) {
  var document = element.ownerDocument;

  try {
    process.binding('evals').Script.runInNewContext(
      code,
      document.parentWindow || { document: document },
      filename
    );
  } catch(e) {
    console.log(e.stack);
  }
};