/*
 * Test making a jsonp request from jsdom window using jqery.
 */
var
jsdom      = require('../../lib/jsdom'),
url        = require('url'),
jQueryFile = __dirname + "/jquery-1.6.4.min.js";

exports.tests = {

  test_jquery_getJSON : function(test){

    var server = require("http").createServer(function(req, res) {
      res.writeHead(200);
      var u = url.parse(req.url);
      var q = require('querystring').parse(u.query);
      res.write(q.jsoncallback + "({'message':'jsonp works!'});");
      res.end();
    });

    server.listen(43213, '127.0.0.1', function() {
      jsdom.env({
        html   : "<html><head></head><body></body></html>",
        scripts : [jQueryFile],
        features : {
          FetchExternalResources : ['script'],
          ProcessExternalResources: ['script']
        },
        done : function(errors, window){
          if(errors) {
            test.fail('jsdom setup failed');
          }

          window.jQuery.getJSON('http://localhost:43213?jsoncallback=?', function(data) {
            test.equal(data.message, 'jsonp works!');
            server.close();
            test.done();
          });
        }
      });
    });
  }
}
