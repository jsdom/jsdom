var EventEmitter = require('events').EventEmitter;
var nodeunit = require('nodeunit');

var assert = require('nodeunit/lib/assert');

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) {
    if (actual && actual.nodeType) {
      actual = actual.toString();
    }

    if (expected && expected.nodeType) {
      expected = expected.toString();
    }

    assert.fail(actual, expected, message, '==', assert.equal);
  }
};

assert.domSame = function(actual, expected, message) {
  if(expected != actual) {
    assert.equal(expected.nodeType, actual.nodeType);
    assert.equal(expected.nodeValue, actual.nodeValue);
  }
};

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
