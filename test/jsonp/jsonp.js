/*
 * Test making a jsonp request from jsdom window using jqery.
 */
var jsdom = require('../../lib/jsdom'),
    url = require('url'),
    targetUrl = "http://localhost:43213?jsoncallback=?",
    assert = require('assert'),
    server = require("http").createServer(function(req, res) {
      res.writeHead(200);
      var u = url.parse(req.url);
      var q = require('querystring').parse(u.query);
      if(q.jsoncallback){
          res.write(q.jsoncallback + "({'message':'jsonp works!'});");
      }
      res.end();
    }),
    jQueryFile = __dirname + "/jquery-1.6.4.min.js";


exports.tests = {

    test_jquery_getJSON : function(test){

        var done = false;

        // Allow a the jsonp request a few seconds to complete.
        var wait = function(time, maxTime){
            if(done){
                complete(true);
                return;
            }
            if(time<maxTime){
                setTimeout(function(){wait(time+100, maxTime);}, 100);
            }else{
                complete(false, 'expected jsonp to complete within ' + maxTime + ' milliseconds');
            }
        }

        var complete = function(success, message){
            if(done){
                return;
            }
            done=true;
            assert.ok(success, message);
            server.close();
            test.done();
        }

        var runTest = function(){
            jsdom.env("<html><head></head><body></body></html>",
                [jQueryFile],
                function(errors, window){
                    var ok = false;
                    if(errors) {
                        complete(false, 'jsdom setup failed: ');
                    }
                    window.jQuery.getJSON(targetUrl, function(data){
                            assert.equal(data.message, 'jsonp works!');
                            complete(true);
                        })
                    wait(0, 3000);
                });
        };

        // run the test against the server
        server.listen(43213, '127.0.0.1', runTest);
    }
}
