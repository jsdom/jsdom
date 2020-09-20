const { JSDOM } = require('../');
let dom;

dom = new JSDOM(`
  <html>
    <head>
      <style>
        div { font-size: 1px }
        #id-2 { font-size: 2px }
        #id-4 { font-size: 4px }
        .class-8 { font-size: 8px }
        .class-16 { font-size: 16px }
        #id-32 { font-size: 32px }
        #id-64 { font-size: 64px }
      </style>
    </head>
    <body>
      <div style="color:red">hello</div>
      <script>
        const e = document.querySelector('div');

        window.computedStyleWindow = window.getComputedStyle(e);
        window.computedStyleNoWindow = getComputedStyle(e);
      </script>
    </body>
  </html>
`, {runScripts: 'dangerously'});

function test(testFn, failMsg = (() => '')) {
  const res = (testFn() === true)
    ? 'pass' : 'fail';
  console.log(res+': '+testFn.toString().replace(/^\(\) ?=> ?/, ''));
  if (res == 'fail') {
    const msg = failMsg();
    if (msg) console.log('  '+msg.replace(/\n/g, '\n  '));
  }
}

function stringOfStyle(style) {
  return JSON.stringify(Object.values(style).reduce((acc, key) => {
    acc[key] = style[key];
    return acc;
  }, {}))
}

const e = dom.window.document.querySelector('div');

const inlineStyle = e.style;
const computedStyle = dom.window.getComputedStyle(e);

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
catch (err) {
  console.log("pass: computedStyle throws error on write: computedStyle.display = 'flex'")

  // test standard API of DOMException
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMException
  test(() => err.code === 7);
  test(() => err.name === 'NoModificationAllowedError');
  test(() => typeof err.message == 'string');
  console.log('err.message = '+err.message);

  // jsdom internal
  test(() => err.stack.match(/^NoModificationAllowedError: /) != null)
  console.log('err.stack:');
  console.dir(err.stack);

  console.log('error object in console.dir:');
  console.dir(err);

  console.log('error object props:');
  console.dir(Object.getOwnPropertyNames(err));
  // props should be: code, name, message
  const propsNow = Object.getOwnPropertyNames(err);
  const propsShould = ['code', 'name', 'message'];
  test(() => propsNow.length == propsShould.length);
  propsShould.forEach(p => {
    test(eval(`() => propsNow.includes("${p}")`));
  })
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

/*
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
*/

console.log('add stylesheet');
const styleElm = dom.window.document.createElement('style');
// innerText currently not working, see issue #3052
//styleElm.innerText = 'div { font-weight: bold }';
styleElm.innerHTML = 'div { font-weight: bold }';
dom.window.document.head.appendChild(styleElm);
test(() => computedStyle.fontWeight == 'bold');
test(() => Object.values(computedStyle).includes('font-weight'));

console.log('change id');
e.id = 'id-2';
test(() => computedStyle.fontSize == '2px');
e.id = 'id-4';
test(() => computedStyle.fontSize == '4px');

// FAIL. id-style has precedence over class-style
// fontSize should stay at 4px
// instead, the last matching rule wins
console.log('change className');
e.className = 'class-8';
test(() => computedStyle.fontSize == '4px',
  () => 'computedStyle.fontSize = '+computedStyle.fontSize);
e.className = 'class-16';
test(() => computedStyle.fontSize == '4px',
  () => 'computedStyle.fontSize = '+computedStyle.fontSize);

console.log('change id');
e.id = 'id-32';
test(() => computedStyle.fontSize == '32px');
// FAIL. last matching class-style (class-16) wins over id-style
e.id = 'id-2';
test(() => computedStyle.fontSize == '2px',
  () => 'computedStyle.fontSize = '+computedStyle.fontSize);

console.log('remove element');
e.remove();
// display was reset to default or empty
test(() => computedStyle.display != 'inline');

console.log('call getComputedStyle without window');
const {computedStyleWindow, computedStyleNoWindow} = dom.window;
test(() => computedStyleWindow.display == computedStyleNoWindow.display);
