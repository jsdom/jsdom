var EventEmitter = require('events').EventEmitter;
var nodeunit = require('nodeunit');

module.exports = function runModules(toRun) {
  var emitter = new EventEmitter();

  process.nextTick(function () {
    nodeunit.runModules(toRun, {
      moduleStart: function (name) {
        emitter.emit('moduleStart', name);
      },
      moduleDone: function (name, assertions) {
        emitter.emit('moduleDone', name, assertions);
      },
      testStart: function (name) {
        emitter.emit('testStart', name);
      },
      testReady: function (name) {
        emitter.emit('testReady', name);
      },
      testDone: function (test, assertions) {
        emitter.emit('testDone', test, assertions);
      },
      log: function (assertion) {
        emitter.emit('log', assertion);
      },
      done: function (assertions) {
        emitter.emit('done', assertions);
      }
    });
  });

  return emitter;
};
