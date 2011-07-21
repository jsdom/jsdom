var vm = require('vm');

exports.javascript = function(element, code, filename) {

  if (element.ownerDocument && element.ownerDocument.parentWindow) {
    var window = element.ownerDocument.parentWindow;
    try {
      vm.createScript(code, filename).runInContext(window);
    } catch (e) {
      element.trigger(
        'error', 'Running ' + filename + ' failed.',
        {error: e, filename: filename}
      );
    }
  }
};
