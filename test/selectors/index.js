var jsdom        = require('../../lib/jsdom');
var fs           = require('fs');
var testFile     = fs.readFileSync(__dirname + '/files/css3-compat.html', 'utf-8');


module.exports.tests = {
  "ensure all tests run successfully" : function(t) {
    jsdom.env(testFile, function(e, window) {
      var document = window.document;

      var testString = document.getElementById('teststyle').innerHTML;
      var testLines = testString.split('\n');

      // remove comments
      testLines.pop();
      testLines.shift();

      testLines.forEach(function(line) {
        if (line.indexOf('background-color') > -1) {
          var lineParts = line.split('{')
          var selector = lineParts.shift().trim();
          var cssString = lineParts.pop().replace('}','').trim();

          var statements = cssString.match(/[a-z\-]+\W*:\W*[^;]+/gi);
          var toSet = [];

          statements.forEach(function(statement) {
            var parts = statement.split(':');
            var property = parts[0].trim();

            var dash = property.indexOf('-');
            if (dash > -1) {
              property = property.replace('-','');
              property = property.substring(0,dash) + property[dash].toUpperCase() + property.substring(dash+1);
            }
            toSet.push([property, parts[1].trim()]);
          });


          try {
            var matches = document.querySelectorAll(selector);

            for (var i=0; i<matches.length; i++) {
              var el = matches[i];
              toSet.forEach(function(set) {
                el.style[set[0]] = set[1];
              });
            }
          } catch (e) {
            console.log(selector, e);
          }
        }
      });

      var results = document.body.getElementsByClassName('unitTest');
      t.equal(results.length, 106);

      // Ensure all the .unitTests are lime
      for (var i=0; i<results.length; i++) {
        var bg = results.item(i).style.backgroundColor;
        t.ok(bg === 'lime' || bg === 'green');
      }

      t.done();
    });
  }
}