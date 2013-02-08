var jsdom = require('../../lib/jsdom');

function again() {
  var options = {
    html: '<a class="testing">test</a>',
    scripts: [ __dirname + '/files/jquery.js' ],
  };
  jsdom.env(options, function(errors, window) {
    window.close();
    setTimeout(again, 0);
  });
}

again();
