

require.paths.unshift('spec', '/opt/local/lib/ruby/gems/1.8/gems/jspec-4.3.3/lib', 'lib')
require('jspec')
require('unit/spec.helper')

dom = require('../../../lib/jsdom/level1/core').dom.level1.core;
browser = require('../../../lib/jsdom/browser/index').windowAugmentation(dom);
jsdom  = require(__dirname + "/../../../lib/jsdom"),

document = browser.document;
window = browser.window;
self = browser.self;
navigator = browser.navigator;
location = browser.location;

jsdom.jQueryify(window, __dirname + "/../../jquery/jquery.js", function() {
	$ = window.jQuery;
	require('yourlib')
	
	JSpec
	  .exec('spec/unit/spec.js')
	  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
	  .report()

});
