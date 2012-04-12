var window,
    oldRequire = require;

exports.tests = {
  setUp: function(done) {
    window = require("../../lib/jsdom/browser/index").createWindow();
    done();
  },
  sandbox_methods_defined: function(test) {
    test.equal(typeof window.run, 'function', 'run function exists');
    test.equal(typeof window.getGlobal, 'function', 'getGlobal function exists');
    test.equal(typeof window.dispose, 'function', 'dispose function exists');
    test.done();
  },
  code_runs_in_context: function(test) {
    var result = window.run('location.protocol', 'test.vm');
    test.equal(result, 'file:', 'code runs in context');
    test.done();
  },
  context_global_is_returned: function(test) {
    test.equal(typeof window.getGlobal(), 'object', 'returns an object');
    test.done();
  },
  dispose_deacivates_context: function(test) {
    window.dispose();
    test.throws(function() { window.run(); }, 'run throws');
    test.throws(function() { window.getGlobal(); }, 'getGlobal throws');
    test.throws(function() { window.dispose(); }, 'dispose throws');
    test.done();
  }
};
