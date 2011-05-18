var xpath = require('./xpath');
var jsdom = require('../../jsdom');
function all1(re, s) {
  var l = [];
  while (s.length) {
    var m = re.exec(s);
    if (!m) break;
    l.push(m[1]);
    s = s.substr(m[0].length);
  }
  return l;
}
exports.testTokenizeRegexp = function(test) {
  var re = xpath.Stream.prototype.re;
  test.deepEqual(['8', 'a'], all1(re, '8a'));
  test.deepEqual(['8', 'a'], all1(re, ' 8a'));
  test.deepEqual(['fun'], all1(re, 'fun'));
  test.deepEqual(['hi', '+', '3'], all1(re, 'hi+3'));
  test.deepEqual(['fun', '(', ')'], all1(re, 'fun()'));
  test.deepEqual(['..', '/', 'a', '//', 'b'], all1(re, '../a//b'));
  test.deepEqual(['1', '<=', '2', '<', '3', '>=', '4', '=', '5', '!=', '6'], all1(re, '1<=2<3>=4=5!=6'));
  test.deepEqual(['<', '='], all1(re, '< ='));
  test.deepEqual(['a','::','b'], all1(re, 'a::b'));
  test.deepEqual(['a','::','b'], all1(re, 'a :: b'));
  test.deepEqual(['a:b'], all1(re, 'a:b'));
  test.deepEqual(['a'], all1(re, 'a : b'));  // can't tokenize : alone
  test.deepEqual(['a:b', '::', 'c'], all1(re, 'a:b::c'));
  test.deepEqual(['a', '::', 'b:c'], all1(re, 'a::b:c'));
  test.deepEqual(['a', '::', 'b:c'], all1(re, 'a::b:c'));
  test.deepEqual(['"hi there\'"'], all1(re, '"hi there\'"'));
  test.deepEqual(['*'], all1(re, '*'));
  test.deepEqual(['ncname:*'], all1(re, 'ncname:*'));
  test.deepEqual(['q:name'], all1(re, 'q:name:*'));  // can't tokenize : alone
  test.deepEqual(['-', 'b'], all1(re, '-b'));
  test.deepEqual(['a-b'], all1(re, 'a-b'));
  test.deepEqual(['a', '-', 'b'], all1(re, 'a -b'));
  test.deepEqual(['a', '-', 'b'], all1(re, 'a - b'));
  test.deepEqual(['.3'], all1(re, '.3'));
  test.done();
};
exports.testPeekPop = function(test) {
  var s = new xpath.Stream('a b c');
  test.equals('a', s.peek());
  test.equals(' b c', s.str);
  test.equals('a', s.pop());
  test.equals('b', s.pop());
  test.equals('c', s.pop());
  test.equals(null, s.pop());
  test.done();
};
exports.testPopFuncName = function(test) {
  var s = new xpath.Stream('f( node( mod( string( comment()))))');
  test.equals('f', s.trypopfuncname());
  test.equals('(', s.pop());
  test.equals(null, s.trypopfuncname());
  test.equals('node', s.pop());
  test.equals('(', s.pop());
  test.equals('mod', s.trypopfuncname());
  test.equals('(', s.pop());
  test.equals('string', s.trypopfuncname());
  test.equals('(', s.pop());
  test.equals(null, s.trypopfuncname());
  test.equals('comment', s.pop());
  test.equals('(', s.pop());
  test.equals(')', s.pop());
  test.equals(')', s.pop());
  test.equals(')', s.pop());
  test.equals(')', s.pop());
  test.equals(')', s.pop());
  test.equals(null, s.trypopfuncname());
  test.equals(null, s.pop());
  test.done();
};
exports.testTryPopNameTest = function(test) {
  var s = new xpath.Stream('a:b + c:* + *');
  test.equals('a:b', s.trypopnametest());
  test.equals(null, s.trypopnametest());
  test.equals('+', s.pop());
  test.equals('c:*', s.trypopnametest());
  test.equals(null, s.trypopnametest());
  test.equals('+', s.pop());
  test.equals('*', s.trypopnametest());
  test.equals(null, s.trypopnametest());
  test.equals(null, s.pop());
  test.done();
};
exports.testTryPopLiteral = function(test) {
  var s = new xpath.Stream('"ab" + \'c d\' e "');  // dangling " at end
  test.equals('ab', s.trypopliteral());
  test.equals(null, s.trypopliteral());
  test.equals('+', s.pop());
  test.equals('c d', s.trypopliteral());
  test.equals(null, s.trypopliteral());
  test.equals('e', s.pop());
  test.equals(null, s.trypopliteral());  // dangling " doesn't become a token.
  test.equals(null, s.pop());
  test.done();
};
exports.testTryPopNumber = function(test) {
  var s = new xpath.Stream('.2 + 3.4 -5 .');
  test.equals(.2, s.trypopnumber());
  test.equals(null, s.trypopnumber());
  test.equals('+', s.pop());
  test.equals('3.4', s.trypopnumber());
  test.equals(null, s.trypopnumber());
  test.equals('-', s.pop());
  test.equals('5', s.trypopnumber());

  // . by itself isn't a number.
  test.equals(null, s.trypopnumber());
  test.equals('.', s.pop());

  test.equals(null, s.trypopnumber());  // dangling " doesn't become a token.
  test.equals(null, s.pop());
  test.done();
};
exports.testTryPopVarRef = function(test) {
  var s = new xpath.Stream('$a + $b:c $');
  test.equals('a', s.trypopvarref());
  test.equals(null, s.trypopvarref());
  test.equals('+', s.pop());
  test.equals('b:c', s.trypopvarref());
  test.equals(null, s.trypopvarref());
  test.equals(null, s.pop());
  test.done();
};
var astFactory = {
  node: function() {return Array.prototype.slice.call(arguments);},
  i: 0,
};
exports.testParseNumber = function(test) {
  var s = new xpath.Stream('32');
  test.deepEqual(32, xpath.parse(s, astFactory));
  test.done();
};
exports.testParseLiteral = function(test) {
  var s = new xpath.Stream('"hi"');
  test.deepEqual("hi", xpath.parse(s, astFactory));
  test.done();
};
exports.testParseFunctionCall = function(test) {
  var s = new xpath.Stream('concat(1, 1+1, "hi")');
  test.deepEqual(['FunctionCall', 'concat', [1, ['+', 1, 1], 'hi']], xpath.parse(s, astFactory));
  test.done();
};
exports.testParseVariableReference = function(test) {
  var s = new xpath.Stream('$hi');
  test.deepEqual(['VariableReference', 'hi'], xpath.parse(s, astFactory));
  test.done();
};
exports.testParsePrimative = function(test) {
  var s = new xpath.Stream('32 + -1 + "3"');
  test.deepEqual(['+', ['+', 32, ['UnaryMinus', 1]], '3'], xpath.parse(s, astFactory));
  test.done();
};
exports.testPrimaryParens = function(test) {
  var s = new xpath.Stream('(div)');
  test.deepEqual(['PathExpr', ['Axis', 'child', 'element', 'div']], xpath.parse(s, astFactory));
  test.done();
};
exports.testParseStepShorthands = function(test) {
  var s = new xpath.Stream('../.');
  test.deepEqual(
    [ 'PathExpr',
      [ '/',
        [ 'Axis', 'parent', 'node' ],
        [ 'Axis', 'self', 'node' ] ] ],
    xpath.parse(s, astFactory));
  test.done();
};
exports.testParseWildcard = function(test) {
  var s = new xpath.Stream('*/self::*/@*');
  test.deepEqual(
    [ 'PathExpr',
      [ '/',
        [ '/',
          [ 'Axis', 'child', 'element', '*' ],
          [ 'Axis', 'self', 'element', '*' ] ],
        [ 'Axis', 'attribute', 'attribute', '*' ] ] ],
    xpath.parse(s, astFactory));
  test.done();
};
exports.testParseFilter = function(test) {
  // tests FilterExpr, which is Primary followed by predicates.
  // Not to be confused with Step, which is node test followed by predicate.
  var s = new xpath.Stream('1[2][3]');
  test.deepEqual(['Predicate', ['Predicate', 1, 2], 3],
                 xpath.parse(s, astFactory));
  test.done();
};
exports.testParseStepWithPredicate = function(test) {
  // tests  Step, which is node test followed by predicate.
  // Not to be confused with FilterExpr, which is Primary followed by predicates.
  var s = new xpath.Stream('a[2][3]');
  test.deepEqual(['PathExpr',
                   ['Predicate',
                     ['Predicate',
                       ['Axis', 'child', 'element', 'a'],
                       2],
                     3]],
                 xpath.parse(s, astFactory));
  test.done();
};
exports.testParsePathWithPredicate = function(test) {
  // tests  Step, which is node test followed by predicate.
  // Not to be confused with FilterExpr, which is Primary followed by predicates.
  var s = new xpath.Stream('a/b[1]');
  test.deepEqual(['PathExpr', [ '/',
                  [ 'Axis', 'child', 'element', 'a' ],
                  [ 'Predicate', [ 'Axis', 'child', 'element', 'b' ], 1 ] ]],
                 xpath.parse(s, astFactory));
  test.done();
};
exports.testParseAbsoluteLocationPath = function(test) {
  var s = new xpath.Stream('/a/b/c');
  test.deepEqual(
      ['PathExpr',
        [ '/',
          [ '/',
            [ '/',
              [ 'Root' ],
              ['Axis', 'child', 'element', 'a' ] ],
            [ 'Axis', 'child', 'element', 'b' ] ],
          [ 'Axis', 'child', 'element', 'c' ] ] ],
      xpath.parse(s, astFactory));
  test.done();
};
exports.testParseRelativeLocationPath = function(test) {
  var s = new xpath.Stream('a/b/c');
  test.deepEqual(
      ['PathExpr',
        [ '/',
          [ '/',
            [ 'Axis', 'child', 'element', 'a' ],
            [ 'Axis', 'child', 'element', 'b' ] ],
          [ 'Axis', 'child', 'element', 'c' ] ] ],
      xpath.parse(s, astFactory));
  test.done();
};
exports.testParseNodeTest = function(test) {
  var s = new xpath.Stream('self::node()');
  test.deepEqual(['PathExpr', ['Axis', 'self', 'node', undefined]],
                 xpath.parse(s, astFactory));
  test.done();
};
exports.testParseAbsoluteShorthand = function(test) {
  var s2 = new xpath.Stream('/descendant-or-self::node()/a');
  var s1 = new xpath.Stream('//a');
  test.deepEqual(xpath.parse(s2, astFactory), xpath.parse(s1, astFactory));
  test.done();
};
exports.testParseLocationShorthand = function(test) {
  var s1 = new xpath.Stream('a//b');
  var s2 = new xpath.Stream('a/descendant-or-self::node()/b');
  test.deepEqual(xpath.parse(s2, astFactory), xpath.parse(s1, astFactory));
  test.done();
};
exports.testParseRoot = function(test) {
  var s = new xpath.Stream('/');
  test.deepEqual(['PathExpr', ['Root']], xpath.parse(s, astFactory));
  test.done();
};

exports.testEvaluateNumber = function(test) {
  var x = xpath.evaluateImpl('3', null, 'CTX');
  test.deepEqual(3, x);
  test.done();
};
exports.testEvaluateNumberFunction = function(test) {
  var x = xpath.evaluateImpl('number("3")', null, 'CTX');
  test.equal(3, x);
  test.done();
};
exports.testEvaluateUnaryMinus = function(test) {
  var x = xpath.evaluateImpl('-3', null, 'CTX');
  test.deepEqual(-3, x);
  test.done();
};
exports.testEvaluateUnaryMinusCoerced = function(test) {
  var x = xpath.evaluateImpl('--"3"', null, 'CTX');
  test.deepEqual(3, x);
  test.done();
};
exports.testEvaluateArithmetic = function(test) {
  var x = xpath.evaluateImpl('(2*11 + 5)mod 10', null, 'CTX');
  test.deepEqual(7, x);
  test.done();
};
exports.testEvaluateArithmetic2 = function(test) {
  var x = xpath.evaluateImpl(
    '1>.5 and 1>=.5 and (2=6div 3) and false()<.5 and true()>.5', null, 'CTX');
  test.deepEqual(true, x);
  test.done();
};
exports.testEvaluateWildcardChild = function(test) {
  var doc = jsdom.jsdom('<html><body><div>3</div><div>4</div></body></html>'),
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1];
  var x = xpath.evaluateImpl('*', doc, body);
  test.deepEqual(stringifyContext({nodes:[div0,div1]}), stringifyContext(x));
  test.done();
};
exports.testEvaluateArithmetic3 = function(test) {
  var doc = jsdom.jsdom('<html><body><div>3</div><div>4</div></body></html>'),
      body = doc.getElementsByTagName('body')[0];
  var x = xpath.evaluateImpl(
    '*<*', doc, body);
  test.deepEqual(true, x);
  test.done();
};
exports.testEvaluateRoot = function(test) {
  var doc = jsdom.jsdom('Hello.');
  var x = xpath.evaluateImpl('/', doc, doc);
  test.deepEqual(stringifyContext({nodes:[doc]}), stringifyContext(x));
  test.done();
};
exports.testEvaluateSelf = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div></body></html>'),
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1];
  var newCtx = xpath.axes.self([doc, div0, div1], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    stringifyContext(
      {nodes: [div0, div1],
       pos: [[1], [1]],
       lasts: [[1],[1]]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testEvaluateParent = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><span></span></body></html>'),
      div0 = doc.getElementsByTagName('div')[0],
      span = doc.getElementsByTagName('span')[0],
      body = div0.parentNode;
  var newCtx = xpath.axes.parent([doc, div0, span], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    stringifyContext(
      {nodes: [body],
       pos: [[1]],
       lasts: [[1]]}),
    stringifyContext(newCtx));
  test.done();
};
function outerHtml(node) { return node.outerHTML; }
exports.testEvaluateChildAxis = function(test) {
  var doc = jsdom.jsdom('<html><body>Hello.</body></html>');
  var ctx = doc.body;
  var x = xpath.evaluateImpl('child::text()', doc, ctx);
  test.deepEqual([doc.body.firstChild], x.nodes);
  test.done();
};
exports.testDescendantDfs = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div></body></html>');
  var newCtx = xpath.axes.descendant([doc], xpath.nodeTypes.element, 'div', true).simplify();
  var div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1];
  test.deepEqual(
    stringifyContext(
      {nodes: [div0, div1],
       pos: [[1], [2]],
       lasts: [[2],[2]]}),
    stringifyContext(newCtx));
  test.done();
};
function testDescendantDfsAndSelfBase(test, andSelf) {
  var andSelf = !!andSelf;
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div></body></html>');
  var div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1];
  if (andSelf) fn = xpath.axes['descendant-or-self'];
  else fn = xpath.axes.descendant;
  var newCtx = fn([div0], xpath.nodeTypes.element, 'div', true).simplify();
  var expectedNodes = andSelf ? [div0, div1] : [div1];
  var expectedPos = andSelf ? [[1], [2]] : [[1]];
  var expectedLasts = andSelf ? [[2], [2]] : [[1]];
  test.deepEqual(
    stringifyContext(
      {nodes: expectedNodes, pos: expectedPos, lasts: expectedLasts}),
    stringifyContext(newCtx));
  test.done();
};
exports.testDescendantDfs = function(test) {
  testDescendantDfsAndSelfBase(test, false);
};
exports.testDescendantDfsAndSelf = function(test) {
  testDescendantDfsAndSelfBase(test, true);
};
exports.testDescendantDfsMultipleRoots = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1];
  var newCtx = xpath.axes.descendant([html, div0], xpath.nodeTypes.element, null, true).simplify();
  test.deepEqual(
    stringifyContext(
      {nodes: [body, div0, div1], pos: [[1], [2], [3, 1]],
               lasts: [[3], [3], [3, 1]]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testFollowing = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.axes.following([div0], xpath.nodeTypes.element, null, true).simplify();
  test.deepEqual(
    stringifyContext(
      {nodes: [div1,img], pos: [[1], [2]], lasts: [[2],[2]] }),
    stringifyContext(newCtx));
  test.done();
};
exports.testPreceding = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.axes.preceding([img], xpath.nodeTypes.element, null, true).simplify();
  test.deepEqual(
    stringifyContext(
      {nodes: [html,body,div0,div1], pos: [[4], [3], [2], [1]], lasts:[[4],[4],[4],[4]] }),
    stringifyContext(newCtx));
  test.done();
};
exports.testFollowingSibling = function(test) {
  var doc = jsdom.jsdom('<html><body><a>one</a><a>two</a><a>three</a><a>four</a><a>five</a><a>six</a></body></html>');
  var one = doc.getElementsByTagName('a')[0],
      two = doc.getElementsByTagName('a')[1],
      three = doc.getElementsByTagName('a')[2],
      four = doc.getElementsByTagName('a')[3],
      five = doc.getElementsByTagName('a')[4],
      six = doc.getElementsByTagName('a')[5];
  var newCtx = xpath.evaluateImpl('a[3]/following-sibling::*', doc, doc.body);
  test.deepEqual(
    stringifyContext({nodes:[four,five,six]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testPrecedingSibling = function(test) {
  var doc = jsdom.jsdom('<html><body><a>one</a><a>two</a><a>three</a><a>four</a><a>five</a><a>six</a></body></html>');
  var one = doc.getElementsByTagName('a')[0],
      two = doc.getElementsByTagName('a')[1],
      three = doc.getElementsByTagName('a')[2],
      four = doc.getElementsByTagName('a')[3],
      five = doc.getElementsByTagName('a')[4],
      six = doc.getElementsByTagName('a')[5];
  var newCtx = xpath.evaluateImpl('a[3]/preceding-sibling::*', doc, doc.body);
  test.deepEqual(
    stringifyContext({nodes:[one,two]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testAncestor = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.axes.ancestor([div1, img], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    stringifyContext(
      {nodes: [html, body, div0],
       pos:   [ [ 3, 2 ], [ 2, 1 ], [ 1 ] ],
       lasts: [ [ 3, 2 ], [ 3, 2 ], [ 3 ] ]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testChild = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.axes.child([body], xpath.nodeTypes.element, null, true).simplify();
  test.deepEqual(
    stringifyContext(
      {nodes: [div0, img], pos: [[1], [2]], lasts: [[2],[2]] }),
    stringifyContext(newCtx));
  test.done();
}

function stringifyContext(ctx) {
  var nicer = {};
  for (var key in ctx) {
    nicer[key] = ctx[key];
  }
  nicer.nodes = ctx.nodes.map(outerHtml);
  return nicer;
}
// TODO: 'concat(a[1], a[1][1])'
// TODO: 'concat(a[1], a[position()>1][1])'
exports.testEvaluatePosition = function(test) {
  var doc = jsdom.jsdom('<html><body><a>one</a><a>two</a><a>three</a></body></html>');
  var x = xpath.evaluateImpl('concat(a[1], a[1][1])', doc, doc.body);
  test.deepEqual('oneone', x);
  test.done();
};
exports.testEvaluatePositionAndLast = function(test) {
  var doc = jsdom.jsdom('<html><body><a>one</a><a>two</a><a>three</a><a>four</a><a>five</a><a>six</a></body></html>');
  var one = doc.getElementsByTagName('a')[0],
      two = doc.getElementsByTagName('a')[1],
      three = doc.getElementsByTagName('a')[2],
      four = doc.getElementsByTagName('a')[3],
      five = doc.getElementsByTagName('a')[4],
      six = doc.getElementsByTagName('a')[5];
  var newCtx = xpath.evaluateImpl('//a[last() mod position()=0]', doc, doc.body);
  test.deepEqual(
    stringifyContext({nodes:[one,two,three,six]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testAttributePredicate = function(test) {
  var doc = jsdom.jsdom('<html><body><a href="x" rel=alternate>a</a></body></html>');
  var a = doc.getElementsByTagName('a')[0];
  var newCtx = xpath.evaluateImpl('//*[@href="x"]', doc, doc.body);
  test.deepEqual(
    stringifyContext({nodes:[a]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testAttributeWildcard = function(test) {
  var doc = jsdom.jsdom('<html><body><a href="x" rel=alternate>a</a></body></html>');
  var a = doc.getElementsByTagName('a')[0];
  var newCtx = xpath.evaluateImpl('//*[@*="alternate"]', doc, doc.body);
  test.deepEqual(
    stringifyContext({nodes:[a]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testEvaluatePath = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.evaluateImpl('div/div', doc, doc.body);
  test.deepEqual(
    stringifyContext(
      {nodes: [div1]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testEvaluateSubstringBefore = function(test) {
  var doc = jsdom.jsdom('<html></html>');
  var newCtx = xpath.evaluateImpl('substring-before("1999/04/01","/")', doc, doc.body);
  test.deepEqual(
    '1999',
    newCtx);
  test.done();
};
exports.testEvaluateSubstringAfter = function(test) {
  var doc = jsdom.jsdom('<html></html>');
  var newCtx = xpath.evaluateImpl('substring-after("1999/04/01","/")', doc, doc.body);
  test.deepEqual(
    '04/01',
    newCtx);
  test.done();
};
exports.testUnion = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.evaluateImpl('img|div/div', doc, doc.body);
  test.deepEqual(
    stringifyContext(
      {nodes: [div1, img]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testUnion2 = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.evaluateImpl('div|zz', doc, doc.body);
  test.deepEqual(
    stringifyContext(
      {nodes: [div0]}),
    stringifyContext(newCtx));
  test.done();
};
exports.testUnion3 = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.evaluateImpl('zz|div', doc, doc.body);
  test.deepEqual(
    stringifyContext(
      {nodes: [div0]}),
    stringifyContext(newCtx));
  test.done();
};
function stringifyNodeList(l) {
  var r = [];
  for (var i = 0; i < l.length; ++i) {
    r.push(l[i].outerHTML);
  }
  return r;
}
exports.testDocumentEvaluate = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var res = doc.evaluate('img', doc.body, null, 0, null);
  var r = [], x;
  while (x = res.iterateNext())
    r.push(x);
  test.deepEqual(
    stringifyNodeList([img]),
    stringifyNodeList(r));
  test.done();
};
exports.testDocumentEvaluate2 = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var res = doc.evaluate('//div', doc, null, 0, null);
  var r = [], x;
  while (x = res.iterateNext())
    r.push(x);
  test.deepEqual(
    stringifyNodeList([div0, div1]),
    stringifyNodeList(r));
  test.done();
};
exports.testDocumentEvaluateWildcard = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var res = doc.evaluate('//div/*', doc, null, 0, null);
  var r = [], x;
  while (x = res.iterateNext())
    r.push(x);
  test.deepEqual(
    stringifyNodeList([div1]),
    stringifyNodeList(r));
  test.done();
};
exports.testDocumentEvaluateStringPred = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var res = doc.evaluate('//div[1]', doc, null, 0, null);
  var r = [], x;
  while (x = res.iterateNext())
    r.push(x);
  test.deepEqual(
    stringifyNodeList([div0, div1]),
    stringifyNodeList(r));
  test.done();
};
exports.testAttributeNodePredicate = function(test) {
  // copied from Webkit LayoutTests/fast/xpath/attribute-node-predicate.html
  var doc = jsdom.jsdom('<html></html>');
  var root = doc.createElement('div');
  root.innerHTML =
    '<p>a</p><div><span id="21"></span><span id="22"></span><span id="23"></span></div>';
  var child1 = root.firstChild,
      child1text = child1.firstChild,
      child2 = root.lastChild,
      child21 = child2.firstChild,
      child22 = child21.nextSibling,
      child23 = child22.nextSibling;
  console.log(".//@id[false]");
  var result = xpath.evaluateImpl(".//@id[false]", doc, root);
  test.deepEqual(stringifyContext({nodes:[]}), stringifyContext(result));
  console.log(".//@id[1]/parent::*")
  result = xpath.evaluateImpl(".//@id[1]/parent::*", doc, root);
  test.deepEqual(
    stringifyContext({nodes:[child21, child22, child23],
                      pos: [ [ 1 ], [ 1 ], [ 1 ] ],
                      lasts: [ [ 1 ], [ 1 ], [ 1 ] ]}),
    stringifyContext(result));
  console.log(".//@id[2]/parent::*")
  result = xpath.evaluateImpl(".//@id[2]/parent::*", doc, root);
  test.deepEqual(stringifyContext({nodes:[],pos:[],lasts:[]}), stringifyContext(result));
  console.log(".//@id[string()='21']/parent::*")
  result = xpath.evaluateImpl(".//@id[string()='21']/parent::*", doc, root);
  test.deepEqual(
    stringifyContext({nodes:[child21], pos:[[1]],lasts:[[1]]}),
    stringifyContext(result));
  console.log(".//@id[string()='22']/parent::*")
  result = xpath.evaluateImpl(".//@id[string()='22']/parent::*", doc, root);
  test.deepEqual(
    stringifyContext({nodes:[child22], pos:[[1]],lasts:[[1]]}),
    stringifyContext(result));
  test.done();
};

