var vm = require('vm');

exports.javascript = function(element, code, filename) {

  if (element.ownerDocument && element.ownerDocument.parentWindow) {
    var document = element.ownerDocument,
        window = document.parentWindow;


    var script = vm.createScript(code, filename);

    if (!window.__scriptContext) {
      var ctx = vm.createContext({});
      ctx.__proto__ = window;
      window.__scriptContext = ctx;
    }

    try {
      script.runInContext(window.__scriptContext);

      var keys = Object.keys(window.__scriptContext);
      var current = keys.length;
      var key;

      // Copy any new values from the context back onto the window
      // TODO: this could probably be fixed if we could call runInContext
      //       with a different `this`. Unfortunately this is the best we can
      //       do for the time being
      while (current--) {
        key = keys[current];
        window[key] = window.__scriptContext[key];
      }

    } catch (e) {
      element.trigger(
        'error', 'Running ' + filename + ' failed.',
        {error: e, filename: filename}
      );
    }
  }
};
