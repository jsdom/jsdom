exports.javascript = function(element, data) {
  var document = element.ownerDocument;

  try {
    process.binding('evals').Script.runInNewContext(
      data,
      document.parentWindow || { document: document }
    );
  } catch(e) {
    console.log(e.stack);
  }

  element.readyState = 'complete';
  if (element.onload) {
    element.onload();
  }
};