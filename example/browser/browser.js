
var sys = require('sys');

var dom = require('../../lib/jsdom/level2/html').dom.level2.html;
var browser = require('../../lib/jsdom/browser/index').windowAugmentation(dom);

var document = browser.document;
var window = browser.window;
var self = browser.self;
var navigator = browser.navigator;
var location = browser.location;

document.title = 'Test Title';

//GLOBAL
var el = document.createElement('div');
el.id = 'foo';
el.innerHTML = '<em>This is a test</em> This <strong class="odd">is another</strong> test ';
document.body.appendChild(el);

//SCOPED
var el2 = browser.document.createElement('div');
el2.id = 'foo2bar';
el2.innerHTML = '<em class="odd">This is a test</em> This <strong>is another</strong> test ';
browser.document.body.appendChild(el2);

sys.puts('getElementByid(foo2bar): ' + browser.document.getElementById('foo2bar'));
sys.puts('getElementByid(foo): ' + browser.document.getElementById('foo'));
sys.puts('getElementByTagName(em): ' + browser.document.getElementsByTagName('em'));
sys.puts('getElementByClassName(odd): ' + browser.document.getElementsByClassName('odd'));

sys.puts('');
sys.puts('document.body.outerHTML: ');
sys.puts(document.body.outerHTML);

sys.puts('document.outerHTML: ');
sys.puts(document.outerHTML);
