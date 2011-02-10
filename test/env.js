
var jsdom = require('../lib/jsdom');

jsdom.env({

    scripts: ['/../example/jquery/jquery.js'],
    document: '/../test/env.html'

  },

  function(window) {

    var $ = window.jQuery;

    $('body').html('Let\'s Rock!')

    return $('html')[0].outerHTML;

  }

);