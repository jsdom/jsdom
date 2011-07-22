var jsdom = require('../../lib/jsdom');

function again() {
  jsdom.env('<a class="testing">test</a>', [
    __dirname + '/files/jquery.js'
  ], function(errors, window) {
    window.close();
    setTimeout(again, 0);
  });
}

again();
