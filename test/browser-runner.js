require('colors');
var browserify = require('browserify');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var httpServer = require('http-server');
var nodeunit = require('nodeunit');
var optimist = require('./runner-options');
var portfinder = require('portfinder');
var Q = require('q');
var querystring = require('querystring');
var runnerDisplay = require('./browser-display');
var seleniumStandalone = require('selenium-standalone');
var wd = require('wd');

var browser;

optimist.
  usage('Run the jsdom test suite in a browser via WebDriver').
  describe('http-port', 'port to run test server on').
  describe('web-driver-port', 'port to run Selenium on').
  describe('verbose-web-driver', 'print verbose output from wd to stdout').
  describe('verbose-browser-console', 'print browser console to stdout');

var argv = optimist.argv;

if (argv.help) {
  optimist.showHelp();
  process.exit();
}

var httpPort = argv['http-port'];
var wdPort = argv['web-driver-port'];

/**
 * Return the body of a function as a string
 *
 * wd should do this for us, but it doesn't
 */
function getFnBody(fn) {
  var src = fn.toString();
  return src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
}

function run() {
  var passed = false;
  browser.init({
    browserName: 'chrome',
    name: 'Travis tmpvar/jsdom #' + process.env['TRAVIS_JOB_NUMBER'],
    'tunnel-identifier': process.env['TRAVIS_JOB_NUMBER'],
    build: process.env['TRAVIS_BUILD_NUMBER'],
    tags: ['tmpvar/jsdom', 'CI']
  }).then(function () {
      return browser.setAsyncScriptTimeout(5000);
    }).
    then(function () {
      return browser.get([
          'http://localhost:',
          httpPort,
          '/test?',
          querystring.stringify(argv)
        ].join(''));
    }).
    then(function (result) {
      function browserPoll() {
        var events = window._browserRunner.events;

        return events.splice(0, events.length);
      }

      var deferred = Q.defer();

      var runner = new EventEmitter();
      runnerDisplay(runner, argv, function (err) {
        passed = !err;
        deferred.resolve();
      });
      var nodeunitTypes = nodeunit.types;

      function poll() {
        browser.
          execute(getFnBody(browserPoll)).
          then(function (events) {
            var done = false;

            events.forEach(function (event) {
              switch (event.event) {
                case 'testDone':
                case 'moduleDone':
                  runner.emit(event.event,
                    event.detail[0],
                    nodeunitTypes.assertionList(
                      event.detail[1].map(nodeunitTypes.assertion)));
                  break;
                case 'log':
                  runner.emit(event.event,
                    nodeunitTypes.assertion(event.detail[0]));
                  break;
                case 'done':
                  runner.emit(event.event,
                    nodeunitTypes.assertionList(
                      event.detail[0].map(nodeunitTypes.assertion)));
                  break;
                case 'console':
                case 'http':
                case 'status':
                case 'command':
                  browser.
                    emit.apply(browser, [event.event].concat(event.detail));
                  break;
                default:
                  runner.emit.apply(runner, [event.event].concat(event.detail));
              }

              if (event.detail && event.event === 'done') {
                done = true;
              }
            });

            if (!done) {
              setTimeout(poll, 50);
            }
          });
      }

      poll();
      return deferred.promise;
    }).
    finally(function () {
      return browser.quit();
    }).
    finally(function () {
      process.exit(passed ? 0 : 1);
    }).
    done();
}

// browserify and run the tests
browserify('./test/worker.js').
  require('./test/browser-fs.js', { expose: 'fs' }).
  bundle().
  pipe(fs.createWriteStream('./test/worker-bundle.js')).
  on('finish', function () {
    Q.fcall(function () {
        return httpPort || Q.ninvoke(portfinder, 'getPort');
      }).
      then(function (port) {
        httpPort = port;

        // start web server
        console.log('starting http server on port', httpPort);
        var webServer = httpServer.createServer().listen(httpPort);

        return wdPort || Q.ninvoke(portfinder, 'getPort');
      }).
      then(function (port) {
        wdPort = port;

        var opts = {
          port: wdPort
        };

        if (process.env['TEST_SUITE'] === 'browser') {
          wdPort = 4445;

          opts = {
            port: wdPort,
            user: process.env['SAUCE_USERNAME'],
            pwd: process.env['SAUCE_ACCESS_KEY']
          };
        }

        // set up webdriver
        browser = wd.promiseRemote(opts);

        if (argv['verbose-web-driver']) {
          // really verbose wd logging
          browser.on('status', function (info) {
            console.log(info.cyan);
          });
          browser.on('command', function (eventType, command, response) {
            console.log(' > ' + eventType.cyan, command, (response || '').grey);
          });
          browser.on('http', function (method, path, data) {
            console.log(' > ' + method.magenta, path, (data || '').grey);
          });
        }

        if (argv['verbose-browser-console']) {
          browser.on('console', function (detail) {
            console[detail.level].apply(console, detail.message);
          });
        }
        
        if (process.env['TEST_SUITE'] !== 'browser') {
          // start selenium
          console.log('starting selenium server on port', wdPort);
          var selenium = seleniumStandalone;
          var wdServer = selenium({
            stdio: 'pipe'
          }, ['-port', wdPort]);

          // time out after a default of 30 seconds
          var h = setTimeout(function () {
            console.log('Timed out waiting for selenium server to start');
            wdServer.kill();
            process.exit(1);
          }, argv.wdTimeout || 30 * 1000);

          // Wait for selenium server to start.
          wdServer.stdout.on('data', function (output) {
            if (output.toString().indexOf('Started org.openqa.jetty.jetty.Server') >= 0) {
              clearTimeout(h);
              run();
            }
          });
          wdServer.stderr.on('data', function (output) {
            if (output.toString().indexOf('Started org.openqa.jetty.jetty.Server') >= 0) {
              clearTimeout(h);
              run();
            }
          });
        } else {
          run();
        }
      }).
      catch(function (err) {
        console.error('Failed to run browser tests', err);
        process.exit(1);
      }).
      done();
  });
