const jsd = require('../');
let o;

o = new jsd.JSDOM(`
  <html>
    <head>
      <style>
        div { font-size: 80px; }
      </style>
    </head>
    <body>
      <div style="color:red">hello</div>
    </body>
  </html>
`);

function test(testFn) {
  const res = (testFn() === true)
    ? 'pass' : 'fail';
  console.log(res+': '+testFn.toString().replace(/^\(\) ?=> ?/, ''));
}

const e = o.window.document.querySelector('div');
const prop = e.style;
const comp = o.window.getComputedStyle(e);

test(() => prop.constructor.name == 'CSSStyleDeclaration');
test(() => comp.constructor.name == 'CSSStyleDeclaration');
test(() => comp.display == 'block');
test(() => comp['display'] == 'block');

console.log("set prop.display = 'inline'");
prop.display = 'inline';

test(() => comp.display == 'inline');
test(() => comp['display'] == 'inline');

console.log("set e.style = 'color: red; font-size: 20px'");
e.style = 'color: red; font-size: 20px';

test(() => comp.color == 'red');
test(() => comp['color'] == 'red');
test(() => comp.fontSize == '20px');
test(() => comp['font-size'] == '20px');
// display was reset to default
// TODO is this right?
test(() => comp.display == 'block');
test(() => comp['display'] == 'block');

// test interface. keys should be strings of numbers
test(() => Object.keys(comp).find(s => s !== String(parseInt(s, 10))) == undefined);

console.log("set e.style = 'display: inline'");
e.style = 'display: inline';

test(() => comp.display == 'inline');

// write to computed style
try {
  comp.display = 'flex';
}
catch (e) {
  console.log("pass: comp throws error on write: comp.display = 'flex'")
  console.dir(e);
}

console.log('test interface. values should be strings');
test(() => Object.values(comp).filter(s => typeof(s) !== 'string').length == 0);

console.log('test interface. values should be kebab-case propName strings');
try {
  test(() => Object.values(comp).find(s => s !== s.toLowerCase()) == undefined);
}
catch (e) {
  console.log('fail: Object.values(comp):')
  console.dir(Object.values(comp));
  throw e;
}

console.log('JSON.stringify:');
console.log('comp: '+JSON.stringify(comp))
console.log('comp._inlineStyle: '+JSON.stringify(comp._inlineStyle))
console.log('comp._customStyle: '+JSON.stringify(comp._customStyle))
console.log('comp._defaultStyle: '+JSON.stringify(comp._defaultStyle))

console.log('add stylesheet');
const styleElm = o.window.document.createElement('style');
// innerText currently not working, see issue #3052
//styleElm.innerText = 'div { font-weight: bold }';
styleElm.innerHTML = 'div { font-weight: bold }';
o.window.document.head.appendChild(styleElm);
test(() => comp.fontWeight == 'bold');

// these tests fail ....

console.log('remove element');
e.remove();
// display was reset to default or empty
test(() => comp.display != 'inline');

console.log('call getComputedStyle without window');
o = new jsd.JSDOM(`
  <html>
    <body>
      <div>hello</div>
      <script>
        const e = document.querySelector('div');
        window.compWindow = window.getComputedStyle(e);
        window.compNoWindow = getComputedStyle(e);
      </script>
    </body>
  </html>
`, {runScripts: 'dangerously'});
const {compWindow, compNoWindow} = o.window;
test(() => compWindow.display == compNoWindow.display);

if (compWindow.display == compNoWindow.display) {
  console.log('pass');
} else {
  console.log('fail');
  console.log('compWindow:'); console.dir(compWindow);
  console.log('compNoWindow:'); console.dir(compNoWindow);
}
