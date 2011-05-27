exports.tests = {};

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
exports.testPopFuncWithSpaces = function(test) {
  var s = new xpath.Stream('f(n-s(" "), 2, 3)');
  test.equals('f', s.trypopfuncname());
  test.equals('(', s.pop());
  test.equals('n-s', s.trypopfuncname());
  test.equals('(', s.pop());
  test.equals(' ', s.trypopliteral());
  test.equals(')', s.pop());
  test.equals(',', s.pop());
  test.equals('2', s.pop());
  test.equals(',', s.pop());
  test.equals('3', s.pop());
  test.equals(')', s.pop());
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
exports.testParseFunctionOfEmptyString = function(test) {
  var s = new xpath.Stream('string("")');
  test.deepEqual(['FunctionCall', 'string', [""]], xpath.parse(s, astFactory));
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
exports.testEvaluateExtraParens = function(test) {
  var x = xpath.evaluateImpl('(((3)))', null, 'CTX');
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
  test.deepEqual(xpath.stringifyObject({nodes:[div0,div1], pos: [[1],[2]], lasts: [[2],[2]]}), xpath.stringifyObject(x));
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
  test.deepEqual(xpath.stringifyObject({nodes:[doc]}), xpath.stringifyObject(x));
  test.done();
};
exports.testEvaluateSelf = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div></body></html>'),
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1];
  var newCtx = xpath.axes.self([doc, div0, div1], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [div0, div1],
       pos: [[1], [1]],
       lasts: [[1],[1]]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testEvaluateParent = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><span></span></body></html>'),
      div0 = doc.getElementsByTagName('div')[0],
      span = doc.getElementsByTagName('span')[0],
      body = div0.parentNode;
  var newCtx = xpath.axes.parent([doc, div0, span], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [body],
       pos: [[1]],
       lasts: [[1]]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testSortUniqDocumentOrder = function(test) {
  var doc = jsdom.jsdom('<html><body><div id=x><a></a><div>b</div></div><span></span></body></html>'),
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      id = doc.getElementById('x').getAttributeNode('id'),
      a = doc.getElementsByTagName('a')[0],
      span = doc.getElementsByTagName('span')[0];
  var ctx = {nodes: [id, body, span, div0, a, span]};
  var ctx2 = {nodes: xpath.sortUniqDocumentOrder(ctx.nodes)};
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [body, div0, id, a, span]}),
    xpath.stringifyObject(ctx2));
  test.done();
};
exports.testId = function(test) {
  var doc = jsdom.jsdom(
    '<html><body><div id=test>b c d</div><br id=b><br id=c><br id=d></body></html>'),
      b = doc.getElementById('b'),
      c = doc.getElementById('c'),
      d = doc.getElementById('d');
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [b,c,d]}),
    xpath.stringifyObject(
      xpath.evaluateImpl('id(id("test"))', doc, doc)));
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
exports.testDescendantDfs1 = function(test) {
  var doc = jsdom.jsdom('<html><body><a><b><i></i></b></a><u></u></body></html>');
  var body = doc.getElementsByTagName('body')[0],
      a = doc.getElementsByTagName('a')[0],
      b = doc.getElementsByTagName('b')[0],
      i = doc.getElementsByTagName('i')[0],
      u = doc.getElementsByTagName('u')[0];
  var newCtx = xpath.axes.descendant([body], xpath.nodeTypes.element, null, true).simplify();
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [a, b, i, u],
       pos:[[1],[2],[3],[4]],lasts:[[4],[4],[4],[4]]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testDescendantOrSelfChild = function(test) {
  // from http://trac.webkit.org/export/73247/trunk/LayoutTests/fast/xpath/xpath-functional-test.html
  var doc = jsdom.jsdom(
    '<html><body>' +
    '<blockquote id="n12" title="12" class="15">' + 
    '  <!--blockquoteComment-->' + 
    '  blockquoteText1:' + 
    '  <br id="n13" title="13" class="10">' + 
    '  blockquoteText2' + 
    '  <p id="n14" title="14" class="13">' + 
    '    <del id="n15" title="15" class="11">del</del>' + 
    '    <ins id="n16" title="16" class="12">ins</ins>' + 
    '  </p>' + 
    '  <!--?pi name="value"?-->' + 
    '  <font id="n17" title="17" class="14" face="n8 n26">font</font>' + 
    '</blockquote>' +
    '</html></body>'
  );
  var newCtx = xpath.evaluateImpl('.//*[ancestor::blockquote]', doc, doc);
  var nodeNames = newCtx.nodes
    .map(function(n) {return n.nodeName;})
    .join(' ').toLowerCase();
  test.deepEqual('br p del ins font', nodeNames);
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
    xpath.stringifyObject(
      {nodes: expectedNodes, pos: expectedPos, lasts: expectedLasts}),
    xpath.stringifyObject(newCtx));
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
    xpath.stringifyObject(
      {nodes: [body, div0, div1], pos: [[1], [2], [3, 1]],
               lasts: [[3], [3], [3, 1]]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testFollowing = function(test) {
  var doc = jsdom.jsdom(
    '<html><head><title></title></head>' +
    '<body>' +
      '<div><a></a><b></b></div>' +
      '<div><i></i><u></u></div>' +
    '</body></html>');
  var body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      a = doc.getElementsByTagName('a')[0],
      b = doc.getElementsByTagName('b')[0],
      div1 = doc.getElementsByTagName('div')[1],
      i = doc.getElementsByTagName('i')[0],
      u = doc.getElementsByTagName('u')[0];
  var newCtx = xpath.axes.following([body, div0, a], xpath.nodeTypes.element, null, true).simplify();
  test.deepEqual(
    xpath.stringifyObject(
      { nodes: 
        [ b, div1, i, u ],
        pos: [ [ 1 ], [ 2, 1 ], [ 3, 2 ], [ 4, 3 ] ],
        lasts: [ [ 4 ], [ 4, 3 ], [ 4, 3 ], [ 4, 3 ] ] }),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testPreceding = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.axes.preceding([img], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [div0,div1], pos: [[2], [1]], lasts:[[2],[2]] }),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testPreceding2 = function(test) {
  var doc = jsdom.jsdom(
    '<html><head><title></title></head>' +
    '<body>' +
      '<div><a></a><b></b></div>' +
      '<div><i></i><u></u></div>' +
    '</body></html>');
  var head = doc.getElementsByTagName('head')[0],
      title = doc.getElementsByTagName('title')[0],
      a = doc.getElementsByTagName('a')[0],
      b = doc.getElementsByTagName('b')[0],
      i = doc.getElementsByTagName('i')[0],
      u = doc.getElementsByTagName('u')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1];
  var newCtx = xpath.axes.preceding([b, i], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [head, title, div0, a, b],
       pos: [ [ 5, 3 ], [ 4, 2 ], [ 3 ], [ 2, 1 ], [ 1 ] ],
       lasts: [[5, 3], [5, 3], [5], [5, 3], [5]]}),
    xpath.stringifyObject(newCtx));
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
    xpath.stringifyObject({nodes:[four,five,six]}),
    xpath.stringifyObject(newCtx));
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
    xpath.stringifyObject({nodes:[one,two]}),
    xpath.stringifyObject(newCtx));
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
    xpath.stringifyObject(
      {nodes: [html, body, div0],
       pos:   [ [ 3, 2 ], [ 2, 1 ], [ 1 ] ],
       lasts: [ [ 3, 2 ], [ 3, 2 ], [ 3 ] ]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testChild = function(test) {
  var doc = jsdom.jsdom('<html><body><div>a<div>b</div></div><img></body></html>');
  var html = doc.getElementsByTagName('html')[0],
      body = doc.getElementsByTagName('body')[0],
      div0 = doc.getElementsByTagName('div')[0],
      div1 = doc.getElementsByTagName('div')[1],
      img = doc.getElementsByTagName('img')[0];
  var newCtx = xpath.axes.child([body], xpath.nodeTypes.element, null, true);
  test.deepEqual(
    xpath.stringifyObject(
      {nodes: [div0, img], pos: [[1], [2]], lasts: [[2],[2]] }),
    xpath.stringifyObject(newCtx));
  test.done();
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
    xpath.stringifyObject({nodes:[one,two,three,six]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testAttributePredicate = function(test) {
  var doc = jsdom.jsdom('<html><body><a href="x" rel=alternate>a</a></body></html>');
  var a = doc.getElementsByTagName('a')[0];
  var newCtx = xpath.evaluateImpl('//*[@href="x"]', doc, doc.body);
  test.deepEqual(
    xpath.stringifyObject({nodes:[a]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testMorePredicates = function(test) {
  var doc = jsdom.jsdom('<html><body><blockquote><a></a></blockquote></body></html>');
  var blockquote = doc.getElementsByTagName('blockquote')[0],
      a = doc.getElementsByTagName('a')[0];
  var newCtx = xpath.evaluateImpl('//*[ancestor::blockquote]', doc, doc.body);
  test.deepEqual(
    xpath.stringifyObject({nodes:[a]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testAttributeWildcard = function(test) {
  var doc = jsdom.jsdom('<html><body><a href="x" rel=alternate>a</a></body></html>');
  var a = doc.getElementsByTagName('a')[0];
  var newCtx = xpath.evaluateImpl('//*[@*="alternate"]', doc, doc.body);
  test.deepEqual(
    xpath.stringifyObject({nodes:[a]}),
    xpath.stringifyObject(newCtx));
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
    xpath.stringifyObject(
      {nodes: [div1], pos: [[1]], lasts: [[1]]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testEvaluateName = function(test) {
  var doc = jsdom.jsdom('<html><head></head><body></body></html>');
  test.equal('body', xpath.evaluateImpl('name()', doc, doc.body));
  test.equal('body', xpath.evaluateImpl('local-name()', doc, doc.body));
  test.done();
};
exports.testEvaluateSubstringBefore = function(test) {
  var doc = jsdom.jsdom('<html></html>');
  var newCtx = xpath.evaluateImpl('substring-before("1999/04/01","/")', doc, doc.body);
  test.equal('1999', newCtx);
  test.done();
};
exports.testEvaluateSubstringAfter = function(test) {
  var doc = jsdom.jsdom('<html></html>');
  var newCtx = xpath.evaluateImpl('substring-after("1999/04/01","/")', doc, doc.body);
  test.deepEqual('04/01', newCtx);
  test.done();
};
exports.testEvaluateSubstring = function(test) {
  var doc = jsdom.jsdom('<html></html>');
  test.equal('04', xpath.evaluateImpl('substring("1999/04/01", 6, 2)', doc, doc));
  test.equal('04/01', xpath.evaluateImpl('substring("1999/04/01", 6)', doc, doc));
  test.done();
};
exports.testEvaluateContains = function(test) {
  var doc = jsdom.jsdom('<html></html>');
  test.equal(true, xpath.evaluateImpl('contains("hello", "el")', doc, doc));
  test.equal(false, xpath.evaluateImpl('contains("hello", "mm")', doc, doc));
  test.done();
};
exports.testEvaluateTranslate = function(test) {
  var doc = jsdom.jsdom('<html></html>');
  test.equal('BAr', xpath.evaluateImpl('translate("bar","abc","ABC")', doc, doc));
  test.equal('AAA', xpath.evaluateImpl('translate("--aaa--", "abc-", "ABC")', doc, doc));
  test.equal('sub', xpath.evaluateImpl('translate(normalize-space(" s u b"), " ", "")', doc, doc));
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
    xpath.stringifyObject(
      {nodes: [div1, img]}),
    xpath.stringifyObject(newCtx));
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
    xpath.stringifyObject(
      {nodes: [div0]}),
    xpath.stringifyObject(newCtx));
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
    xpath.stringifyObject(
      {nodes: [div0]}),
    xpath.stringifyObject(newCtx));
  test.done();
};
exports.testAttributesHaveNoChildren = function(test) {
  var doc = jsdom.jsdom('<html><body><a></a><b id=hi>btext</b><i></i></body></html>');
  var a = doc.getElementsByTagName('a')[0],
      b = doc.getElementsByTagName('b')[0],
      btext = b.firstChild,
      attr = b.getAttributeNode('id'),
      i = doc.getElementsByTagName('i')[0];
  test.deepEqual(
    xpath.stringifyObject({nodes: [b], pos: [[1]], lasts: [[1]]}),
    xpath.stringifyObject(xpath.evaluateImpl('parent::node()', doc, attr)));
  test.deepEqual(
    xpath.stringifyObject({nodes: [attr], pos: [[1]], lasts: [[1]]}),
    xpath.stringifyObject(xpath.evaluateImpl('self::node()', doc, attr)));
  test.deepEqual(
    xpath.stringifyObject({nodes: [], pos: [], lasts: []}),
    xpath.stringifyObject(xpath.evaluateImpl('child::node()', doc, attr)));
  test.deepEqual(
    xpath.stringifyObject({nodes: []}),
    xpath.stringifyObject(xpath.evaluateImpl('descendant::node()', doc, attr)));
  test.deepEqual(
    xpath.stringifyObject({nodes: [attr]}),
    xpath.stringifyObject(xpath.evaluateImpl('descendant-or-self::node()', doc, attr)));
  // Note: following DOES include the children of the element that the
  // attribute belongs to.
  test.deepEqual(
    xpath.stringifyObject({nodes: [btext, i]}),
    xpath.stringifyObject(xpath.evaluateImpl('following::node()', doc, attr)));
  test.deepEqual(
    xpath.stringifyObject({nodes: []}),
    xpath.stringifyObject(xpath.evaluateImpl('following-sibling::node()', doc, attr)));
  test.deepEqual(
    xpath.stringifyObject({nodes: [a], pos: [[1]], lasts: [[1]]}),
    xpath.stringifyObject(xpath.evaluateImpl('preceding::node()', doc, attr)));
  test.deepEqual(
    xpath.stringifyObject({nodes: []}),
    xpath.stringifyObject(xpath.evaluateImpl('preceding-sibling::node()', doc, attr)));
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
  var result = xpath.evaluateImpl(".//@id[false]", doc, root);
  test.deepEqual(xpath.stringifyObject({nodes:[]}), xpath.stringifyObject(result));
  result = xpath.evaluateImpl(".//@id[1]/parent::*", doc, root);
  test.deepEqual(
    xpath.stringifyObject({nodes:[child21, child22, child23],
                      pos: [ [ 1 ], [ 1 ], [ 1 ] ],
                      lasts: [ [ 1 ], [ 1 ], [ 1 ] ]}),
    xpath.stringifyObject(result));
  result = xpath.evaluateImpl(".//@id[2]/parent::*", doc, root);
  test.deepEqual(xpath.stringifyObject({nodes:[],pos:[],lasts:[]}), xpath.stringifyObject(result));
  result = xpath.evaluateImpl(".//@id[string()='21']/parent::*", doc, root);
  test.deepEqual(
    xpath.stringifyObject({nodes:[child21], pos:[[1]],lasts:[[1]]}),
    xpath.stringifyObject(result));
  result = xpath.evaluateImpl(".//@id[string()='22']/parent::*", doc, root);
  test.deepEqual(
    xpath.stringifyObject({nodes:[child22], pos:[[1]],lasts:[[1]]}),
    xpath.stringifyObject(result));
  test.done();
};


// The following test cases are taken from the NIST XSLT/XPath test suite.
// http://web.archive.org/web/20041019015748/http://xw2k.sdct.itl.nist.gov/xml/page5.html
// Only test cases applicable to XPath are included.

var nistTestCases = [
        {
            name: "NIST_coreFunction001",
            xpath: "substring(substring('internalexternalcorrect substring',9),9)",
            expected: "correct substring"
        },
        {
            name: "NIST_coreFunction002",
            xpath: "substring(substring('internalexternalcorrect substring',9,25),9,17)",
            expected: "correct substring"
        },
        {
            name: "NIST_coreFunction003",
            xpath: "concat(concat('A ','N','e'),'w ','Concatenated String')",
            expected: "A New Concatenated String"
        },
        {
            name: "NIST_coreFunction004",
            xpath: "string(string('Unchanged String'))",
            expected: "Unchanged String"
        },
        {
            name: "NIST_coreFunction005",
            xpath: "substring-after(substring-after('wrongnogoodCorrect Substring After','wrong'),'nogood')",
            expected: "Correct Substring After"
        },
        {
            name: "NIST_coreFunction006",
            xpath: "substring-before(substring-before('correct substring Beforenogoodwrong','wrong'),'nogood')",
            expected: "correct substring Before"
        },
        {
            name: "NIST_coreFunction007",
            xpath: "translate(translate('old string','old','123'),'123','new')",
            expected: "new string"
        },
        {
            name: "NIST_coreFunction008",
            xpath: "translate('old string',translate('123','123','old'),'new')",
            expected: "new string"
        },
        {
            name: "NIST_coreFunction009",
            xpath: "translate(translate('old string','old string','old string'),translate('123','123','old'),translate('123','123','new'))",
            expected: "new string"
        },
        {
            name: "NIST_coreFunction010",
            xpath: "translate(translate('old string','old string','old string'),translate('123','123','old'),translate('123','123','new'))",
            expected: "new string"
        },
        {
            name: "NIST_coreFunction011",
            xpath: "concat('A New ',concat('Conca','tena','ted '),'String')",
            expected: "A New Concatenated String"
        },
        {
            name: "NIST_coreFunction012",
            xpath: "concat('A New ','Concatenated ',concat('St','ri','ng'))",
            expected: "A New Concatenated String"
        },
        {
            name: "NIST_coreFunction013",
            xpath: "concat(concat('A ','Ne','w '),concat('Conca','tena','ted '),concat('St','ri','ng'))",
            expected: "A New Concatenated String"
        },
        {
            name: "NIST_coreFunction014",
            xpath: "substring-after('wrongCorrect Substring After',substring-after('nogoodstringwrong','nogoodstring'))",
            expected: "Correct Substring After"
        },
        {
            name: "NIST_coreFunction015",
            xpath: "substring-after(substring-after('nogoodwrongCorrect Substring After','nogood'),substring-after('nogoodstringwrong','nogoodstring'))",
            expected: "Correct Substring After"
        },
        {
            name: "NIST_coreFunction016",
            xpath: "substring-before('Correct Substring Beforewrong',substring-before('wrongnogood','nogood'))",
            expected: "Correct Substring Before"
        },
        {
            name: "NIST_coreFunction017",
            xpath: "substring-before(substring-before('Correct Substring Beforewrongcut here','cut here'),substring-before('wrongnogood','nogood'))",
            expected: "Correct Substring Before"
        },
        {
            name: "NIST_coreFunction018",
            xpath: "string($variable1)",
            expected: "String From Variable"
        },
        {
            name: "NIST_coreFunction019",
            xpath: "concat($variable1,'From ','Variable')",
            expected: "String From Variable"
        },
        {
            name: "NIST_coreFunction020",
            xpath: "concat('String ',$variable1,'Variable')",
            expected: "String From Variable"
        },
        {
            name: "NIST_coreFunction021",
            xpath: "concat('String ','From ',$variable1)",
            expected: "String From Variable"
        },
        {
            name: "NIST_coreFunction022",
            xpath: "concat($variable1,$variable2,$variable3)",
            expected: "String From Variable"
        },
        {
            name: "NIST_coreFunction023",
            xpath: "substring-before($variable1,'cut this')",
            expected: "substring-before with variable"
        },
        {
            name: "NIST_coreFunction024",
            xpath: "substring-before('substring-before with variablecut this',$variable1)",
            expected: "substring-before with variable"
        },
        {
            name: "NIST_coreFunction025",
            xpath: "substring-before($variable1,$variable2)",
            expected: "substring before with variable"
        },
        {
            name: "NIST_coreFunction026",
            xpath: "substring-after($variable1,'cut this')",
            expected: "substring-after with variable"
        },
        {
            name: "NIST_coreFunction027",
            xpath: "substring-after('cut thissubstring after with variable',$variable1)",
            expected: "substring after with variable"
        },
        {
            name: "NIST_coreFunction028",
            xpath: "substring-after($variable1,$variable2)",
            expected: "substring-after with variable"
        },
        {
            name: "NIST_coreFunction029",
            xpath: "substring($variable1,9)",
            expected: "substring with variable"
        },
        {
            name: "NIST_coreFunction030",
            xpath: "substring($variable1,9,23)",
            expected: "substring with variable"
        },
        {
            name: "NIST_coreFunction031",
            xpath: "string-length($variable1)",
            expected: 26
        },
        {
            name: "NIST_coreFunction032",
            xpath: "translate($variable1,'1234','with')",
            expected: "translate with variable"
        },
        {
            name: "NIST_coreFunction033",
            xpath: "translate('translate 1234 variable',$variable1,'with')",
            expected: "translate with variable"
        },
        {
            name: "NIST_coreFunction034",
            xpath: "translate('translate 1234 variable','1234',$variable1)",
            expected: "translate with variable"
        },
        {
            name: "NIST_coreFunction035",
            xpath: "translate($variable1,$variable2,$variable3)",
            expected: "translate with variable"
        },
        {
            name: "NIST_coreFunction036",
            xpath: "string($param1)",
            expected: "string with param"
        },
        {
            name: "NIST_coreFunction037",
            xpath: "concat($param1,' with',' param')",
            expected: "concat with param"
        },
        {
            name: "NIST_coreFunction038",
            xpath: "concat('concat ',$param1,' param')",
            expected: "concat with param"
        },
        {
            name: "NIST_coreFunction039",
            xpath: "concat('concat ','with ',$param1)",
            expected: "concat with param"
        },
        {
            name: "NIST_coreFunction040",
            xpath: "concat($param1,$param2,$param3)",
            expected: "concat with param"
        },
        {
            name: "NIST_coreFunction041",
            xpath: "starts-with($param1,'This')",
            expected: true
        },
        {
            name: "NIST_coreFunction042",
            xpath: "starts-with('This is a string',$param1)",
            expected: true
        },
        {
            name: "NIST_coreFunction043",
            xpath: "starts-with($param1,$param2)",
            expected: true
        },
        {
            name: "NIST_coreFunction044",
            xpath: "contains($param1,'This')",
            expected: true
        },
        {
            name: "NIST_coreFunction045",
            xpath: "contains('This is a string',$param1)",
            expected: true
        },
        {
            name: "NIST_coreFunction046",
            xpath: "contains($param1,$param2)",
            expected: true
        },
        {
            name: "NIST_coreFunction047",
            xpath: "substring-before($param1,'cut this')",
            expected: "substring-before with param"
        },
        {
            name: "NIST_coreFunction048",
            xpath: "substring-before('substring-before with paramcutthis',$param1)",
            expected: "substring-before with param"
        },
        {
            name: "NIST_coreFunction049",
            xpath: "substring-before($param1,$param2)",
            expected: ""
        },
        {
            name: "NIST_coreFunction050",
            xpath: "substring-after($param1,'cut this')",
            expected: "substring-after with param"
        },
        {
            name: "NIST_coreFunction051",
            xpath: "substring-after('cut thissubstring-after with param',$param1)",
            expected: "substring-after with param"
        },
        {
            name: "NIST_coreFunction052",
            xpath: "substring-after($param1,$param2)",
            expected: "substring-after with param"
        },
        {
            name: "NIST_coreFunction053",
            xpath: "substring($param1,16)",
            expected: "substring with param"
        },
        {
            name: "NIST_coreFunction054",
            xpath: "substring($param1,16,20)",
            expected: "substring with param"
        },
        {
            name: "NIST_coreFunction055",
            xpath: "string-length($param1)",
            expected: 15
        },
        {
            name: "NIST_coreFunction056",
            xpath: "translate($param1,'1234','with')",
            expected: "translate with param"
        },
        {
            name: "NIST_coreFunction057",
            xpath: "translate('translate 1234 param',$param1,'with')",
            expected: "translate with param"
        },
        {
            name: "NIST_coreFunction058",
            xpath: "translate('translate 1234 param','1234',$param1)",
            expected: "translate with param"
        },
        {
            name: "NIST_coreFunction059",
            xpath: "translate($param1,$param2,$param3)",
            expected: "translate with param"
        },
        {
            name: "NIST_coreFunction060",
            xpath: "floor(-1.99999)",
            expected: -2
        },
        {
            name: "NIST_coreFunction061",
            xpath: "floor(-1.0001)",
            expected: -2
        },
        {
            name: "NIST_coreFunction062",
            xpath: "floor($variable1)",
            expected: 3
        },
        {
            name: "NIST_coreFunction063",
            xpath: "floor($param1)",
            expected: 4
        },
        {
            name: "NIST_coreFunction064",
            xpath: "floor(ceiling(1.2))",
            expected: 2
        },
        {
            name: "NIST_coreFunction065",
            xpath: "floor(round(1.2))",
            expected: 1
        },
        {
            name: "NIST_coreFunction066",
            xpath: "floor(floor(1.2))",
            expected: 1
        },
        {
            name: "NIST_coreFunction067",
            xpath: "floor((((((2*10)-4)+9) div 5) mod 2))",
            expected: 1
        },
        {
            name: "NIST_coreFunction068",
            xpath: "ceiling(-1.0001)",
            expected: -1
        },
        {
            name: "NIST_coreFunction069",
            xpath: "ceiling(-1.9999)",
            expected: -1
        },
        {
            name: "NIST_coreFunction070",
            xpath: "ceiling($variable1)",
            expected: 3
        },
        {
            name: "NIST_coreFunction071",
            xpath: "ceiling(floor(2.2))",
            expected: 2
        },
        {
            name: "NIST_coreFunction072",
            xpath: "ceiling(ceiling(3.2))",
            expected: 4
        },
        {
            name: "NIST_coreFunction073",
            xpath: "ceiling($param1)",
            expected: 4
        },
        {
            name: "NIST_coreFunction074",
            xpath: "ceiling((((((2*10)-4)+9) div 5) div 2))",
            expected: 3
        },
        {
            name: "NIST_coreFunction075",
            xpath: "round(-1.9999)",
            expected: -2
        },
        {
            name: "NIST_coreFunction076",
            xpath: "round($variable1)",
            expected: 2
        },
        {
            name: "NIST_coreFunction077",
            xpath: "round($param1)",
            expected: 2
        },
        {
            name: "NIST_coreFunction078",
            xpath: "round(ceiling(3.2))",
            expected: 4
        },
        {
            name: "NIST_coreFunction079",
            xpath: "round((((((2*10)-4)+9) div 5) div 2))",
            expected: 3
        },
        {
            name: "NIST_coreFunction080",
            xpath: "string(round(NaN))",
            expected: "NaN"
        },
        {
            name: "NIST_coreFunction081",
            xpath: "round(-0)",
            expected: 0
        },
        {
            name: "NIST_coreFunction082",
            xpath: "round(-0.25)",
            expected: 0
        },
        {
            name: "NIST_coreFunction083",
            xpath: "round(round(2.3))",
            expected: 2
        },
        {
            name: "NIST_coreFunction084",
            xpath: "round(2.3 div 0)",
            expected: Number.POSITIVE_INFINITY
        },
        {
            name: "NIST_coreFunction085",
            xpath: "round(-2.3 div 0)",
            expected: Number.NEGATIVE_INFINITY
        },
        {
            name: "NIST_coreFunction086",
            xpath: "number('-1.9999')",
            expected: -1.9999
        },
        {
            name: "NIST_coreFunction087",
            xpath: "number('1.9999')",
            expected: 1.9999
        },
        {
            name: "NIST_coreFunction088",
            xml: function() {
                var document = getImplementation().createDocument();
                var doc = document.createElement("doc");
                document.appendChild(doc);
                var element1 = document.createElement("element1");
                doc.appendChild(element1);
                var child1 = document.createElement("child1");
                element1.appendChild(child1);
                var text = document.createTextNode("Test executed Successfully!!");
                child1.appendChild(text);
                var element2 = document.createElement("element2");
                doc.appendChild(element2);
                child1 = document.createElement("child1");
                text = document.createTextNode("Incorrect execution!!");
                child1.appendChld(text);
                return document;
            },
            xpath: "count(//child1[ancestor::element1])",
            expected: 1
        },
        {
            name: "NIST_coreFunction089",
            xml: function() {
                var document = getImplementation().createDocument();
                var doc = document.createElement("doc");
                document.appendChild(doc);
                var element1 = document.createElement("element1");
                doc.appendChild(element1);
                var text = document.createTextNode("Incorrect Execution!!");
                element1.appendChild(text);
                element1 = document.createElement("element1");
                text = document.createTextNode("Test executed Successfully!!");
                element1.appendChild(text);
                return document;
            },
            xpath: "string(element1[2])",
            expected: "Test executed Successfully!!"
        },
        {
            name: "NIST_dataManipulation001a",
            xpath: "2 > 1",
            expected: true
        },
        {
            name: "NIST_dataManipulation001b",
            xpath: "9 mod 3 = 0",
            expected: true
        },
        {
            name: "NIST_dataManipulation002a",
            xpath: "2 > 3",
            expected: false
        },
        {
            name: "NIST_dataManipulation003",
            xpath: "(((((2*10)-4)+9) div 5) div 2) > 2",
            expected: true
        },
        {
            name: "NIST_dataManipulation004",
            xpath: "(((((2*10)-4)+9) div 5) div 2) > 4",
            expected: false
        },
        {
            name: "NIST_dataManipulation007",
            xpath: "(round(3.7) > 3)",
            expected: true
        },
        {
            name: "NIST_dataManipulation009",
            xml: function() {
                var document = getImplementation().createDocument();
                var doc = document.createElement("doc");
                document.appendChild(doc);
                var element1 = document.createElement("element1");
                doc.appendChild(element1);
                var text = document.createTextNode("Test executed successfully!!");
                element1.appendChild(text);
                var element2 = document.createElement("element2");
                text = document.createTextNode("Incorrect execution!!");
                element2.appendChild(text);
                return document;
            },
            xpath: "string(doc/element1)",
            expected: "Test executed successfully!!"
        },
        {
            name: "NIST_dataManipulation013",
            xml: function() {
                var document = getImplementation().createDocument();
                var doc = document.createElement("doc");
                document.appendChild(doc);
                var element1 = document.createElement("element1");
                doc.appendChild(element1);
                var text = document.createTextNode("Incorrect execution!!");
                element1.appendChild(text);
                element1 = document.createElement("element1");
                doc.appendChild(element1);
                text = document.createTextNode("Incorrect execution!!");
                element1.appendChild(text);
                element1 = document.createElement("element1");
                doc.appendChild(element1);
                text = document.createTextNode("Test Executed Successfully!!");
                element1.appendChild(text);
                var element2 = document.createElement("element2");
                doc.appendChild(element2);
                text = document.createTextNode("Incorrect execution!!");
                element2.appendChild(text);
                return document;
            },
            xpath: "string(doc/element1[last()])",
            expected: "Test Executed Successfully!!"
        },
        {
            name: "NIST_dataManipulation014",
            xml: function() {
                var document = getImplementation().createDocument();
                var doc = document.createElement("doc");
                document.appendChild(doc);
                var element1 = document.createElement("element1");
                doc.appendChild(element1);
                var text = document.createTextNode("Incorrect execution!!");
                element1.appendChild(text);
                element1 = document.createElement("element1");
                doc.appendChild(element1);
                text = document.createTextNode("Incorrect execution!!");
                element1.appendChild(text);
                element1 = document.createElement("element1");
                doc.appendChild(element1);
                text = document.createTextNode("Test Executed Successfully!!");
                element1.appendChild(text);
                var element2 = document.createElement("element2");
                doc.appendChild(element2);
                text = document.createTextNode("Incorrect execution!!");
                element2.appendChild(text);
                return document;
            },
            xpath: "string(doc/element1[((((((2*10)-4)+9) div 5) mod 3)+1)])",
            expected: "Test Executed Successfully!!"
        },
        {
            name: "NIST_dataManipulation016",
            xml: function() {
                var document = getImplementation().createDocument();
                var doc = document.createElement("doc");
                document.appendChild(doc);
                var element1 = document.createElement("element1");
                doc.appendChild(element1);
                var child1 = document.createElement("child1");
                element1.appendChild(child1);
                var text = document.createTextNode("Test Executed Successfully!!");
                child1.appendChild(text);
                var element2 = document.createElement("element2");
                doc.appendChild(element2);
                child1 = document.createElement("child1");
                element2.appendChild(child1);
                text = document.createTextNode("Incorrect Execution!!");
                child1.appendChild(text);
                return document;
            },
            xpath: "string(//child1[ancestor::element1])",
            expected: "Test Executed Successfully!!"
        }];

function registerNistTestCase(test) {
    exports.tests[test.name] = function() {
        var document;
        if (test.xml) {
            document = test.xml();
        } else {
            document = getImplementation().createDocument();
        }
        var result = xpath.evaluateImpl(test.xpath, document, document);
        assertEquals("", test.expected, result);
    };
}

for (var i=0; i<nistTestCases.length; ++i) {
    registerNistTestCase(nistTestCases[i]);
}
