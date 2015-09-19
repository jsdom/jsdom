// For: nodeunit
global.window = global;

function postConsole(level) {
  var message = Array.prototype.slice.call(arguments, 1);
  postMessage({
    jsonrpc: '2.0',
    method: 'console',
    params: {
      level: level,
      message: message
    }
  });
}

self.console = {
  log: postConsole.bind(self.console, 'log'),
  warn: postConsole.bind(self.console, 'warn'),
  error: postConsole.bind(self.console, 'error')
};

self.process = self.process || {};

var stream = require('stream');
process.stdout = new stream.Writable();
process.stdout._write = function (chunk, encoding, cb) {
  var s = '';
  for (var i = 0; i < chunk.length; i++) {
    s += String.fromCharCode(chunk[i]);
  }
  console.log('stdout: ', s);

  cb();
};

process.on = function () {
  console.log('process.on called with:',
    JSON.stringify(Array.prototype.slice.call(arguments)));
};

// set up runner
require('./worker-runner');

postMessage({
  jsonrpc: '2.0',
  method: 'ready'
});
