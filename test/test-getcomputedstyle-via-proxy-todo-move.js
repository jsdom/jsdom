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

function stringOfStyle(style) {
  return JSON.stringify(Object.values(style).reduce((acc, key) => {
    acc[key] = style[key];
    return acc;
  }, {}))
}

const e = o.window.document.querySelector('div');
const inlineStyle = e.style;
const computedStyle = o.window.getComputedStyle(e);

test(() => inlineStyle.constructor.name == 'CSSStyleDeclaration');
test(() => computedStyle.constructor.name == 'CSSStyleDeclaration');
test(() => computedStyle.display == 'block');
test(() => computedStyle['display'] == 'block');

console.log("set inlineStyle.display = 'inline'");
inlineStyle.display = 'inline';

test(() => computedStyle.display == 'inline');
test(() => computedStyle['display'] == 'inline');

console.log("set inlineStyle = 'color: red; font-size: 20px'");
e.style = 'color: red; font-size: 20px';

test(() => computedStyle.color == 'red');
test(() => computedStyle['color'] == 'red');
test(() => computedStyle.fontSize == '20px');
test(() => computedStyle['font-size'] == '20px');
// display was reset to default
// TODO is this right?
test(() => computedStyle.display == 'block');
test(() => computedStyle['display'] == 'block');

// test interface. keys should be strings of numbers
test(() => Object.keys(computedStyle).find(s => s !== String(parseInt(s, 10))) == undefined);

console.log("set inlineStyle = 'display: inline'");
e.style = 'display: inline';

test(() => computedStyle.display == 'inline');
test(() => computedStyle.color != 'red');

// write to computedStyle style
try {
  computedStyle.display = 'flex';
}
catch (e) {
  console.log("pass: computedStyle throws error on write: computedStyle.display = 'flex'")
  console.dir(e);
}

console.log('test interface. values should be strings');
test(() => Object.values(computedStyle).filter(s => typeof(s) !== 'string').length == 0);

console.log('test interface. values should be kebab-case inlineStyleName strings');
try {
  test(() => Object.values(computedStyle).find(s => s !== s.toLowerCase()) == undefined);
}
catch (e) {
  console.log('fail: Object.values(computedStyle):')
  console.dir(Object.values(computedStyle));
  throw e;
}

console.log('JSON.stringify:');
console.log('computedStyle: '+JSON.stringify(computedStyle))
console.log('computedStyle._inlineStyle: '+JSON.stringify(computedStyle._inlineStyle))
console.log('computedStyle._sheetStyle: '+JSON.stringify(computedStyle._sheetStyle))
console.log('computedStyle._defaultStyle: '+JSON.stringify(computedStyle._defaultStyle))

console.log('stringOfStyle:');
console.log('computedStyle = '+stringOfStyle(computedStyle));
console.log('computedStyle._inlineStyle: '+stringOfStyle(computedStyle._inlineStyle))
console.log('computedStyle._sheetStyle: '+stringOfStyle(computedStyle._sheetStyle))
console.log('computedStyle._defaultStyle: '+stringOfStyle(computedStyle._defaultStyle))

console.log('add stylesheet');
const styleElm = o.window.document.createElement('style');
// innerText currently not working, see issue #3052
//styleElm.innerText = 'div { font-weight: bold }';
styleElm.innerHTML = 'div { font-weight: bold }';
o.window.document.head.appendChild(styleElm);
test(() => computedStyle.fontWeight == 'bold');
test(() => Object.values(computedStyle).includes('font-weight'));

// these tests fail ....

console.log('remove element');
e.remove();
// display was reset to default or empty
test(() => computedStyle.display != 'inline');
console.log('computedStyle.display = '+computedStyle.display);
console.log('computedStyle = '+stringOfStyle(computedStyle));
console.log('computedStyle._inlineStyle: '+stringOfStyle(computedStyle._inlineStyle))
console.log('computedStyle._sheetStyle: '+stringOfStyle(computedStyle._sheetStyle))
console.log('computedStyle._defaultStyle: '+stringOfStyle(computedStyle._defaultStyle))

console.log('call getComputedStyle without window');
o = new jsd.JSDOM(`
  <html>
    <body>
      <div>hello</div>
      <script>
        const e = document.querySelector('div');
        window.computedStyleWindow = window.getComputedStyle(e);
        window.computedStyleNoWindow = getComputedStyle(e);
      </script>
    </body>
  </html>
`, {runScripts: 'dangerously'});
const {computedStyleWindow, computedStyleNoWindow} = o.window;
test(() => computedStyleWindow.display == computedStyleNoWindow.display);

if (computedStyleWindow.display == computedStyleNoWindow.display) {
  console.log('pass');
} else {
  console.log('fail');
  console.log('computedStyleWindow:'); console.dir(computedStyleWindow);
  console.log('computedStyleNoWindow:'); console.dir(computedStyleNoWindow);
}
