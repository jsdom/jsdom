var vm = require('vm');

exports.javascript = function(element, code, filename) {
  var doc = element.ownerDocument, window = doc && doc.parentWindow;
  if (window) {
    //document.parentWindow will be set to the global scrop within the context (so 
    //document.parentWindow === window evaluates to true in the context), however,
    //when frame/iframe is created, the parent has to be set to the real context,
    //so remember the real context in doc.__scriptContext
    doc.__scriptContext = window;

    try {
      vm.createScript('document.parentWindow=this;\n'+code, filename).runInContext(window);
    } catch (e) {
      element.trigger(
        'error', 'Running ' + filename + ' failed.',
        {error: e, filename: filename}
      );
    }
    //reset the parentWindow back to the context
    window.document.parentWindow = window;
    delete window.document.__scriptContext;
  }
};
