const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../../..");
const xpath = require('../../../lib/jsdom/level3/xpath')((new JSDOM()).window);
const domTestHelper = require('../files/DOMTestCase');

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

describe("xpath", { skipIfBrowser: true }, () => {
  specify("testTokenizeRegexp", function() {
    var re = xpath.Stream.prototype.re;
    assert.deepEqual(['8', 'a'], all1(re, '8a'));
    assert.deepEqual(['8', 'a'], all1(re, ' 8a'));
    assert.deepEqual(['fun'], all1(re, 'fun'));
    assert.deepEqual(['hi', '+', '3'], all1(re, 'hi+3'));
    assert.deepEqual(['fun', '(', ')'], all1(re, 'fun()'));
    assert.deepEqual(['..', '/', 'a', '//', 'b'], all1(re, '../a//b'));
    assert.deepEqual(['1', '<=', '2', '<', '3', '>=', '4', '=', '5', '!=', '6'], all1(re, '1<=2<3>=4=5!=6'));
    assert.deepEqual(['<', '='], all1(re, '< ='));
    assert.deepEqual(['a','::','b'], all1(re, 'a::b'));
    assert.deepEqual(['a','::','b'], all1(re, 'a :: b'));
    assert.deepEqual(['a:b'], all1(re, 'a:b'));
    assert.deepEqual(['a'], all1(re, 'a : b'));  // can't tokenize : alone
    assert.deepEqual(['a:b', '::', 'c'], all1(re, 'a:b::c'));
    assert.deepEqual(['a', '::', 'b:c'], all1(re, 'a::b:c'));
    assert.deepEqual(['a', '::', 'b:c'], all1(re, 'a::b:c'));
    assert.deepEqual(['"hi there\'"'], all1(re, '"hi there\'"'));
    assert.deepEqual(['*'], all1(re, '*'));
    assert.deepEqual(['ncname:*'], all1(re, 'ncname:*'));
    assert.deepEqual(['q:name'], all1(re, 'q:name:*'));  // can't tokenize : alone
    assert.deepEqual(['-', 'b'], all1(re, '-b'));
    assert.deepEqual(['a-b'], all1(re, 'a-b'));
    assert.deepEqual(['a', '-', 'b'], all1(re, 'a -b'));
    assert.deepEqual(['a', '-', 'b'], all1(re, 'a - b'));
    assert.deepEqual(['.3'], all1(re, '.3'));
  });
  specify("testPeekPop", function() {
    var s = new xpath.Stream('a b c');
    assert.equal('a', s.peek());
    assert.equal(' b c', s.str);
    assert.equal('a', s.pop());
    assert.equal('b', s.pop());
    assert.equal('c', s.pop());
    assert.equal(null, s.pop());
  });
  specify("testPopFuncName", function() {
    var s = new xpath.Stream('f( node( mod( string( comment()))))');
    assert.equal('f', s.trypopfuncname());
    assert.equal('(', s.pop());
    assert.equal(null, s.trypopfuncname());
    assert.equal('node', s.pop());
    assert.equal('(', s.pop());
    assert.equal('mod', s.trypopfuncname());
    assert.equal('(', s.pop());
    assert.equal('string', s.trypopfuncname());
    assert.equal('(', s.pop());
    assert.equal(null, s.trypopfuncname());
    assert.equal('comment', s.pop());
    assert.equal('(', s.pop());
    assert.equal(')', s.pop());
    assert.equal(')', s.pop());
    assert.equal(')', s.pop());
    assert.equal(')', s.pop());
    assert.equal(')', s.pop());
    assert.equal(null, s.trypopfuncname());
    assert.equal(null, s.pop());
  });
  specify("testPopFuncWithSpaces", function() {
    var s = new xpath.Stream('f(n-s(" "), 2, 3)');
    assert.equal('f', s.trypopfuncname());
    assert.equal('(', s.pop());
    assert.equal('n-s', s.trypopfuncname());
    assert.equal('(', s.pop());
    assert.equal(' ', s.trypopliteral());
    assert.equal(')', s.pop());
    assert.equal(',', s.pop());
    assert.equal('2', s.pop());
    assert.equal(',', s.pop());
    assert.equal('3', s.pop());
    assert.equal(')', s.pop());
    assert.equal(null, s.pop());
  });
  specify("testTryPopNameTest", function() {
    var s = new xpath.Stream('a:b + c:* + *');
    assert.equal('a:b', s.trypopnametest());
    assert.equal(null, s.trypopnametest());
    assert.equal('+', s.pop());
    assert.equal('c:*', s.trypopnametest());
    assert.equal(null, s.trypopnametest());
    assert.equal('+', s.pop());
    assert.equal('*', s.trypopnametest());
    assert.equal(null, s.trypopnametest());
    assert.equal(null, s.pop());
  });
  specify("testTryPopLiteral", function() {
    var s = new xpath.Stream('"ab" + \'c d\' e "');  // dangling " at end
    assert.equal('ab', s.trypopliteral());
    assert.equal(null, s.trypopliteral());
    assert.equal('+', s.pop());
    assert.equal('c d', s.trypopliteral());
    assert.equal(null, s.trypopliteral());
    assert.equal('e', s.pop());
    assert.equal(null, s.trypopliteral());  // dangling " doesn't become a token.
    assert.equal(null, s.pop());
  });
  specify("testTryPopNumber", function() {
    var s = new xpath.Stream('.2 + 3.4 -5 .');
    assert.equal(.2, s.trypopnumber());
    assert.equal(null, s.trypopnumber());
    assert.equal('+', s.pop());
    assert.equal('3.4', s.trypopnumber());
    assert.equal(null, s.trypopnumber());
    assert.equal('-', s.pop());
    assert.equal('5', s.trypopnumber());

    // . by itself isn't a number.
    assert.equal(null, s.trypopnumber());
    assert.equal('.', s.pop());

    assert.equal(null, s.trypopnumber());  // dangling " doesn't become a token.
    assert.equal(null, s.pop());
  });
  specify("testTryPopVarRef", function() {
    var s = new xpath.Stream('$a + $b:c $');
    assert.equal('a', s.trypopvarref());
    assert.equal(null, s.trypopvarref());
    assert.equal('+', s.pop());
    assert.equal('b:c', s.trypopvarref());
    assert.equal(null, s.trypopvarref());
    assert.equal(null, s.pop());
  });
  var astFactory = {
    node: function() {return Array.prototype.slice.call(arguments);},
    i: 0,
  };
  specify("testParseNumber", function() {
    var s = new xpath.Stream('32');
    assert.deepEqual(32, xpath.parse(s, astFactory));
  });
  specify("testParseLiteral", function() {
    var s = new xpath.Stream('"hi"');
    assert.deepEqual("hi", xpath.parse(s, astFactory));
  });
  specify("testParseFunctionCall", function() {
    var s = new xpath.Stream('concat(1, 1+1, "hi")');
    assert.deepEqual(['FunctionCall', 'concat', [1, ['+', 1, 1], 'hi']], xpath.parse(s, astFactory));
  });
  specify("testParseFunctionOfEmptyString", function() {
    var s = new xpath.Stream('string("")');
    assert.deepEqual(['FunctionCall', 'string', [""]], xpath.parse(s, astFactory));
  });
  specify("testParseVariableReference", function() {
    var s = new xpath.Stream('$hi');
    assert.deepEqual(['VariableReference', 'hi'], xpath.parse(s, astFactory));
  });
  specify("testParsePrimative", function() {
    var s = new xpath.Stream('32 + -1 + "3"');
    assert.deepEqual(['+', ['+', 32, ['UnaryMinus', 1]], '3'], xpath.parse(s, astFactory));
  });
  specify("testPrimaryParens", function() {
    var s = new xpath.Stream('(div)');
    assert.deepEqual(['PathExpr', ['Axis', 'child', 'element', 'div']], xpath.parse(s, astFactory));
  });
  specify("testParseStepShorthands", function() {
    var s = new xpath.Stream('../.');
    assert.deepEqual(
      [ 'PathExpr',
        [ '/',
          [ 'Axis', 'parent', 'node' ],
          [ 'Axis', 'self', 'node' ] ] ],
      xpath.parse(s, astFactory));
  });
  specify("testParseWildcard", function() {
    var s = new xpath.Stream('*/self::*/@*');
    assert.deepEqual(
      [ 'PathExpr',
        [ '/',
          [ '/',
            [ 'Axis', 'child', 'element', '*' ],
            [ 'Axis', 'self', 'element', '*' ] ],
          [ 'Axis', 'attribute', 'attribute', '*' ] ] ],
      xpath.parse(s, astFactory));
  });
  specify("testParseFilter", function() {
    // tests FilterExpr, which is Primary followed by predicates.
    // Not to be confused with Step, which is node test followed by predicate.
    var s = new xpath.Stream('1[2][3]');
    assert.deepEqual(['Predicate', ['Predicate', 1, 2], 3],
                  xpath.parse(s, astFactory));
  });
  specify("testParseStepWithPredicate", function() {
    // tests  Step, which is node test followed by predicate.
    // Not to be confused with FilterExpr, which is Primary followed by predicates.
    var s = new xpath.Stream('a[2][3]');
    assert.deepEqual(['PathExpr',
                    ['Predicate',
                      ['Predicate',
                        ['Axis', 'child', 'element', 'a'],
                        2],
                      3]],
                  xpath.parse(s, astFactory));
  });
  specify("testParsePathWithPredicate", function() {
    // tests  Step, which is node test followed by predicate.
    // Not to be confused with FilterExpr, which is Primary followed by predicates.
    var s = new xpath.Stream('a/b[1]');
    assert.deepEqual(['PathExpr', [ '/',
                    [ 'Axis', 'child', 'element', 'a' ],
                    [ 'Predicate', [ 'Axis', 'child', 'element', 'b' ], 1 ] ]],
                  xpath.parse(s, astFactory));
  });
  specify("testParseAbsoluteLocationPath", function() {
    var s = new xpath.Stream('/a/b/c');
    assert.deepEqual(
        ['PathExpr',
          [ '/',
            [ '/',
              [ '/',
                [ 'Root' ],
                ['Axis', 'child', 'element', 'a' ] ],
              [ 'Axis', 'child', 'element', 'b' ] ],
            [ 'Axis', 'child', 'element', 'c' ] ] ],
        xpath.parse(s, astFactory));
  });
  specify("testParseRelativeLocationPath", function() {
    var s = new xpath.Stream('a/b/c');
    assert.deepEqual(
        ['PathExpr',
          [ '/',
            [ '/',
              [ 'Axis', 'child', 'element', 'a' ],
              [ 'Axis', 'child', 'element', 'b' ] ],
            [ 'Axis', 'child', 'element', 'c' ] ] ],
        xpath.parse(s, astFactory));
  });
  specify("testParseNodeTest", function() {
    var s = new xpath.Stream('self::node()');
    assert.deepEqual(['PathExpr', ['Axis', 'self', 'node', undefined]],
                  xpath.parse(s, astFactory));
  });
  specify("testParseAbsoluteShorthand", function() {
    var s2 = new xpath.Stream('/descendant-or-self::node()/a');
    var s1 = new xpath.Stream('//a');
    assert.deepEqual(xpath.parse(s2, astFactory), xpath.parse(s1, astFactory));
  });
  specify("testParseLocationShorthand", function() {
    var s1 = new xpath.Stream('a//b');
    var s2 = new xpath.Stream('a/descendant-or-self::node()/b');
    assert.deepEqual(xpath.parse(s2, astFactory), xpath.parse(s1, astFactory));
  });
  specify("testParseRoot", function() {
    var s = new xpath.Stream('/');
    assert.deepEqual(['PathExpr', ['Root']], xpath.parse(s, astFactory));
  });

  specify("testEvaluateNumber", function() {
    var x = xpath.evaluate('3', null, 'CTX');
    assert.deepEqual(3, x);
  });
  specify("testEvaluateExtraParens", function() {
    var x = xpath.evaluate('(((3)))', null, 'CTX');
    assert.deepEqual(3, x);
  });
  specify("testEvaluateNumberFunction", function() {
    var x = xpath.evaluate('number("3")', null, 'CTX');
    assert.equal(3, x);
  });
  specify("testEvaluateUnaryMinus", function() {
    var x = xpath.evaluate('-3', null, 'CTX');
    assert.deepEqual(-3, x);
  });
  specify("testEvaluateUnaryMinusCoerced", function() {
    var x = xpath.evaluate('--"3"', null, 'CTX');
    assert.deepEqual(3, x);
  });
  specify("testEvaluateArithmetic", function() {
    var x = xpath.evaluate('(2*11 + 5)mod 10', null, 'CTX');
    assert.deepEqual(7, x);
  });
  specify("testEvaluateArithmetic2", function() {
    var x = xpath.evaluate(
      '1>.5 and 1>=.5 and (2=6div 3) and false()<.5 and true()>.5', null, 'CTX');
    assert.deepEqual(true, x);
  });
  specify("testEvaluateWildcardChild", function() {
    const doc = (new JSDOM('<html><body><div>3</div><div>4</div></body></html>')).window.document,
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1];
    var x = xpath.evaluate('*', doc, body);
    assert.deepEqual(xpath.stringifyObject({nodes:[div0,div1], pos: [[1],[2]], lasts: [[2],[2]]}), xpath.stringifyObject(x));
  });
  specify("testEvaluateArithmetic3", function() {
    const doc = (new JSDOM('<html><body><div>3</div><div>4</div></body></html>')).window.document,
        body = doc.getElementsByTagName('body')[0];
    var x = xpath.evaluate(
      '*<*', doc, body);
    assert.deepEqual(true, x);
  });
  specify("testEvaluateSelf", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div></body></html>')).window.document,
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1];
    var newCtx = xpath.axes.self([doc, div0, div1], xpath.nodeTypes.element, null, true);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [div0, div1],
        pos: [[1], [1]],
        lasts: [[1],[1]]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testEvaluateParent", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><span></span></body></html>')).window.document,
        div0 = doc.getElementsByTagName('div')[0],
        span = doc.getElementsByTagName('span')[0],
        body = div0.parentNode;
    var newCtx = xpath.axes.parent([doc, div0, span], xpath.nodeTypes.element, null, true);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [body],
        pos: [[1]],
        lasts: [[1]]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testSortUniqDocumentOrder", function() {
    const doc = (new JSDOM('<html><body><div id=x><a></a><div>b</div></div><span></span></body></html>')).window.document,
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        id = doc.getElementById('x').getAttributeNode('id'),
        a = doc.getElementsByTagName('a')[0],
        span = doc.getElementsByTagName('span')[0];
    var ctx = {nodes: [id, body, span, div0, a, span]};
    var ctx2 = {nodes: xpath.sortUniqDocumentOrder(ctx.nodes)};
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [body, div0, id, a, span]}),
      xpath.stringifyObject(ctx2));
  });
  specify("testId", function() {
    const doc = (new JSDOM('<html><body><div id=test>b c d</div><br id=b><br id=c><br id=d></body></html>')).window.document,
        b = doc.getElementById('b'),
        c = doc.getElementById('c'),
        d = doc.getElementById('d');
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [b,c,d]}),
      xpath.stringifyObject(
        xpath.evaluate('id(id("test"))', doc, doc)));
  });
  function outerHtml(node) { return node.outerHTML; }
  specify("testEvaluateChildAxis", function() {
    const doc = (new JSDOM('<html><body>Hello.</body></html>')).window.document;
    var ctx = doc.body;
    var x = xpath.evaluate('child::text()', doc, ctx);
    assert.deepEqual([doc.body.firstChild], x.nodes);
  });
  specify("testDescendantDfs1", function() {
    const doc = (new JSDOM('<html><body><a><b><i></i></b></a><u></u></body></html>')).window.document;
    var body = doc.getElementsByTagName('body')[0],
        a = doc.getElementsByTagName('a')[0],
        b = doc.getElementsByTagName('b')[0],
        i = doc.getElementsByTagName('i')[0],
        u = doc.getElementsByTagName('u')[0];
    var newCtx = xpath.axes.descendant([body], xpath.nodeTypes.element, null, true).simplify();
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [a, b, i, u],
        pos:[[1],[2],[3],[4]],lasts:[[4],[4],[4],[4]]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testDescendantOrSelfChild", function() {
    // from http://trac.webkit.org/export/73247/trunk/LayoutTests/fast/xpath/xpath-functional-test.html
    var doc = (new JSDOM(
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
    )).window.document;
    var newCtx = xpath.evaluate('.//*[ancestor::blockquote]', doc, doc);
    var nodeNames = newCtx.nodes
      .map(function(n) {return n.nodeName;})
      .join(' ').toLowerCase();
    assert.deepEqual('br p del ins font', nodeNames);
  });

  function testDescendantDfsAndSelfBase(test, andSelf) {
    var andSelf = !!andSelf;
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div></body></html>')).window.document;
    var div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1];
    if (andSelf) fn = xpath.axes['descendant-or-self'];
    else fn = xpath.axes.descendant;
    var newCtx = fn([div0], xpath.nodeTypes.element, 'div', true).simplify();
    var expectedNodes = andSelf ? [div0, div1] : [div1];
    var expectedPos = andSelf ? [[1], [2]] : [[1]];
    var expectedLasts = andSelf ? [[2], [2]] : [[1]];
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: expectedNodes, pos: expectedPos, lasts: expectedLasts}),
      xpath.stringifyObject(newCtx));
  };
  specify("testDescendantDfs", function(t) {
    testDescendantDfsAndSelfBase(t, false);
  });
  specify("testDescendantDfsAndSelf", function(t) {
    testDescendantDfsAndSelfBase(t, true);
  });
  specify("testFollowing", function() {
    var doc = (new JSDOM(
      '<html><head><title></title></head>' +
      '<body>' +
        '<div><a></a><b></b></div>' +
        '<div><i></i><u></u></div>' +
      '</body></html>')).window.document;
    var body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        a = doc.getElementsByTagName('a')[0],
        b = doc.getElementsByTagName('b')[0],
        div1 = doc.getElementsByTagName('div')[1],
        i = doc.getElementsByTagName('i')[0],
        u = doc.getElementsByTagName('u')[0];
    var newCtx = xpath.axes.following([body, div0, a], xpath.nodeTypes.element, null, true).simplify();
    assert.deepEqual(
      xpath.stringifyObject(
        { nodes:
          [ b, div1, i, u ],
          pos: [ [ 1 ], [ 2, 1 ], [ 3, 2 ], [ 4, 3 ] ],
          lasts: [ [ 4 ], [ 4, 3 ], [ 4, 3 ], [ 4, 3 ] ] }),
      xpath.stringifyObject(newCtx));
  });
  specify("testPreceding2", function() {
    var doc = (new JSDOM(
      '<html><head><title></title></head>' +
      '<body>' +
        '<div><a></a><b></b></div>' +
        '<div><i></i><u></u></div>' +
      '</body></html>')).window.document;
    var head = doc.getElementsByTagName('head')[0],
        title = doc.getElementsByTagName('title')[0],
        a = doc.getElementsByTagName('a')[0],
        b = doc.getElementsByTagName('b')[0],
        i = doc.getElementsByTagName('i')[0],
        u = doc.getElementsByTagName('u')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1];
    var newCtx = xpath.axes.preceding([b, i], xpath.nodeTypes.element, null, true);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [head, title, div0, a, b],
        pos: [ [ 5, 3 ], [ 4, 2 ], [ 3 ], [ 2, 1 ], [ 1 ] ],
        lasts: [[5, 3], [5, 3], [5], [5, 3], [5]]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testFollowingSibling", function() {
    const doc = (new JSDOM('<html><body><a>one</a><a>two</a><a>three</a><a>four</a><a>five</a><a>six</a></body></html>')).window.document;
    var one = doc.getElementsByTagName('a')[0],
        two = doc.getElementsByTagName('a')[1],
        three = doc.getElementsByTagName('a')[2],
        four = doc.getElementsByTagName('a')[3],
        five = doc.getElementsByTagName('a')[4],
        six = doc.getElementsByTagName('a')[5];
    var newCtx = xpath.evaluate('a[3]/following-sibling::*', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[four,five,six]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testPrecedingSibling", function() {
    const doc = (new JSDOM('<html><body><a>one</a><a>two</a><a>three</a><a>four</a><a>five</a><a>six</a></body></html>')).window.document;
    var one = doc.getElementsByTagName('a')[0],
        two = doc.getElementsByTagName('a')[1],
        three = doc.getElementsByTagName('a')[2],
        four = doc.getElementsByTagName('a')[3],
        five = doc.getElementsByTagName('a')[4],
        six = doc.getElementsByTagName('a')[5];
    var newCtx = xpath.evaluate('a[3]/preceding-sibling::*', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[one,two]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testAncestor", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var newCtx = xpath.axes.ancestor([div1, img], xpath.nodeTypes.element, null, true);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [html, body, div0],
        pos:   [ [ 3, 2 ], [ 2, 1 ], [ 1 ] ],
        lasts: [ [ 3, 2 ], [ 3, 2 ], [ 3 ] ]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testChild", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var newCtx = xpath.axes.child([body], xpath.nodeTypes.element, null, true);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [div0, img], pos: [[1], [2]], lasts: [[2],[2]] }),
      xpath.stringifyObject(newCtx));
  })

  // TODO: 'concat(a[1], a[1][1])'
  // TODO: 'concat(a[1], a[position()>1][1])'
  specify("testEvaluatePosition", function() {
    const doc = (new JSDOM('<html><body><a>one</a><a>two</a><a>three</a></body></html>')).window.document;
    var x = xpath.evaluate('concat(a[1], a[1][1])', doc, doc.body);
    assert.deepEqual('oneone', x);
  });
  specify("testEvaluatePositionAndLast", function() {
    const doc = (new JSDOM('<html><body><a>one</a><a>two</a><a>three</a><a>four</a><a>five</a><a>six</a></body></html>')).window.document;
    var one = doc.getElementsByTagName('a')[0],
        two = doc.getElementsByTagName('a')[1],
        three = doc.getElementsByTagName('a')[2],
        four = doc.getElementsByTagName('a')[3],
        five = doc.getElementsByTagName('a')[4],
        six = doc.getElementsByTagName('a')[5];
    var newCtx = xpath.evaluate('//a[last() mod position()=0]', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[one,two,three,six]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testAttributePredicate", function() {
    const doc = (new JSDOM('<html><body><a href="x" rel=alternate>a</a></body></html>')).window.document;
    var a = doc.getElementsByTagName('a')[0];
    var newCtx = xpath.evaluate('//*[@href="x"]', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[a]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testMorePredicates", function() {
    const doc = (new JSDOM('<html><body><blockquote><a></a></blockquote></body></html>')).window.document;
    var blockquote = doc.getElementsByTagName('blockquote')[0],
        a = doc.getElementsByTagName('a')[0];
    var newCtx = xpath.evaluate('//*[ancestor::blockquote]', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[a]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testAttributeWildcard", function() {
    const doc = (new JSDOM('<html><body><a href="x" rel=alternate>a</a></body></html>')).window.document;
    var a = doc.getElementsByTagName('a')[0];
    var newCtx = xpath.evaluate('//*[@*="alternate"]', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[a]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testEvaluatePath", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var newCtx = xpath.evaluate('div/div', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [div1], pos: [[1]], lasts: [[1]]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testEvaluateSubstringBefore", function() {
    const doc = (new JSDOM('<html></html>')).window.document;
    var newCtx = xpath.evaluate('substring-before("1999/04/01","/")', doc, doc.body);
    assert.equal('1999', newCtx);
  });
  specify("testEvaluateSubstringAfter", function() {
    const doc = (new JSDOM('<html></html>')).window.document;
    var newCtx = xpath.evaluate('substring-after("1999/04/01","/")', doc, doc.body);
    assert.deepEqual('04/01', newCtx);
  });
  specify("testEvaluateSubstring", function() {
    const doc = (new JSDOM('<html></html>')).window.document;
    assert.equal('04', xpath.evaluate('substring("1999/04/01", 6, 2)', doc, doc));
    assert.equal('04/01', xpath.evaluate('substring("1999/04/01", 6)', doc, doc));
  });
  specify("testEvaluateContains", function() {
    const doc = (new JSDOM('<html></html>')).window.document;
    assert.equal(true, xpath.evaluate('contains("hello", "el")', doc, doc));
    assert.equal(false, xpath.evaluate('contains("hello", "mm")', doc, doc));
  });
  specify("testEvaluateTranslate", function() {
    const doc = (new JSDOM('<html></html>')).window.document;
    assert.equal('BAr', xpath.evaluate('translate("bar","abc","ABC")', doc, doc));
    assert.equal('AAA', xpath.evaluate('translate("--aaa--", "abc-", "ABC")', doc, doc));
    assert.equal('sub', xpath.evaluate('translate(normalize-space(" s u b"), " ", "")', doc, doc));
  });
  specify("testUnion", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var newCtx = xpath.evaluate('img|div/div', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [div1, img]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testUnion2", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var newCtx = xpath.evaluate('div|zz', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [div0]}),
      xpath.stringifyObject(newCtx));
  });
  specify("testUnion3", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var newCtx = xpath.evaluate('zz|div', doc, doc.body);
    assert.deepEqual(
      xpath.stringifyObject(
        {nodes: [div0]}),
      xpath.stringifyObject(newCtx));
  });
  function stringifyNodeList(l) {
    var r = [];
    for (var i = 0; i < l.length; ++i) {
      r.push(l[i].outerHTML);
    }
    return r;
  }
  specify("testDocumentEvaluate", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var res = doc.evaluate('img', doc.body, null, 0, null);
    var r = [], x;
    while (x = res.iterateNext())
      r.push(x);
    assert.deepEqual(
      stringifyNodeList([img]),
      stringifyNodeList(r));
  });
  specify("testDocumentEvaluate2", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var res = doc.evaluate('//div', doc, null, 0, null);
    var r = [], x;
    while (x = res.iterateNext())
      r.push(x);
    assert.deepEqual(
      stringifyNodeList([div0, div1]),
      stringifyNodeList(r));
  });
  specify("testDocumentEvaluateWildcard", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var res = doc.evaluate('//div/*', doc, null, 0, null);
    var r = [], x;
    while (x = res.iterateNext())
      r.push(x);
    assert.deepEqual(
      stringifyNodeList([div1]),
      stringifyNodeList(r));
  });
  specify("testDocumentEvaluateStringPred", function() {
    const doc = (new JSDOM('<html><body><div>a<div>b</div></div><img></body></html>')).window.document;
    var html = doc.getElementsByTagName('html')[0],
        body = doc.getElementsByTagName('body')[0],
        div0 = doc.getElementsByTagName('div')[0],
        div1 = doc.getElementsByTagName('div')[1],
        img = doc.getElementsByTagName('img')[0];
    var res = doc.evaluate('//div[1]', doc, null, 0, null);
    var r = [], x;
    while (x = res.iterateNext())
      r.push(x);
    assert.deepEqual(
      stringifyNodeList([div0, div1]),
      stringifyNodeList(r));
  });
  specify("testAttributeNodePredicate", function() {
    // copied from Webkit LayoutTests/fast/xpath/attribute-node-predicate.html
    const doc = (new JSDOM('<html></html>')).window.document;
    var root = doc.createElement('div');
    root.innerHTML =
      '<p>a</p><div><span id="21"></span><span id="22"></span><span id="23"></span></div>';
    var child1 = root.firstChild,
        child1text = child1.firstChild,
        child2 = root.lastChild,
        child21 = child2.firstChild,
        child22 = child21.nextSibling,
        child23 = child22.nextSibling;
    var result = xpath.evaluate(".//@id[false]", doc, root);
    assert.deepEqual(xpath.stringifyObject({nodes:[]}), xpath.stringifyObject(result));
    result = xpath.evaluate(".//@id[1]/parent::*", doc, root);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[child21, child22, child23],
                        pos: [ [ 1 ], [ 1 ], [ 1 ] ],
                        lasts: [ [ 1 ], [ 1 ], [ 1 ] ]}),
      xpath.stringifyObject(result));
    result = xpath.evaluate(".//@id[2]/parent::*", doc, root);
    assert.deepEqual(xpath.stringifyObject({nodes:[],pos:[],lasts:[]}), xpath.stringifyObject(result));
    result = xpath.evaluate(".//@id[string()='21']/parent::*", doc, root);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[child21], pos:[[1]],lasts:[[1]]}),
      xpath.stringifyObject(result));
    result = xpath.evaluate(".//@id[string()='22']/parent::*", doc, root);
    assert.deepEqual(
      xpath.stringifyObject({nodes:[child22], pos:[[1]],lasts:[[1]]}),
      xpath.stringifyObject(result));
  });


  // The following test cases are taken from the NIST XSLT/XPath test suite.
  // http://web.archive.org/web/20041019015748/http://xw2k.sdct.itl.nist.gov/xml/page5.html
  // Only test cases applicable to XPath are included.

  specify("NIST_coreFunction001", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("correct substring",
            xpath.evaluate("substring(substring('internalexternalcorrect substring',9),9)", document, document), "correct substring");
  });

  specify("NIST_coreFunction002", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("correct substring",
            xpath.evaluate("substring(substring('internalexternalcorrect substring',9,25),9,17)", document, document), "correct substring");
  });

  specify("NIST_coreFunction003", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("A New Concatenated String",
            xpath.evaluate("concat(concat('A ','N','e'),'w ','Concatenated String')", document, document));
  });

  specify("NIST_coreFunction004", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("Unchanged String",
            xpath.evaluate("string(string('Unchanged String'))", document, document));
  });

  specify("NIST_coreFunction005", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("Correct Substring After",
            xpath.evaluate("substring-after(substring-after('wrongnogoodCorrect Substring After','wrong'),'nogood')", document, document));
  });

  specify("NIST_coreFunction006", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("correct substring Before",
            xpath.evaluate("substring-before(substring-before('correct substring Beforenogoodwrong','wrong'),'nogood')", document, document));
  });

  specify("NIST_coreFunction007", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("new string",
            xpath.evaluate("translate(translate('old string','old','123'),'123','new')", document, document));
  });

  specify("NIST_coreFunction008", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("new string",
            xpath.evaluate("translate('old string',translate('123','123','old'),'new')", document, document));
  });

  specify("NIST_coreFunction009", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("new string",
            xpath.evaluate("translate(translate('old string','old string','old string'),translate('123','123','old'),translate('123','123','new'))", document, document));
  });

  specify("NIST_coreFunction010", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("new string",
            xpath.evaluate("translate(translate('old string','old string','old string'),translate('123','123','old'),translate('123','123','new'))", document, document));
  });

  specify("NIST_coreFunction011", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("A New Concatenated String",
            xpath.evaluate("concat('A New ',concat('Conca','tena','ted '),'String')", document, document));
  });

  specify("NIST_coreFunction012", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("A New Concatenated String",
            xpath.evaluate("concat('A New ','Concatenated ',concat('St','ri','ng'))", document, document));
  });

  specify("NIST_coreFunction013", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("A New Concatenated String",
            xpath.evaluate("concat(concat('A ','Ne','w '),concat('Conca','tena','ted '),concat('St','ri','ng'))", document, document));
  });

  specify("NIST_coreFunction014", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("Correct Substring After",
            xpath.evaluate("substring-after('wrongCorrect Substring After',substring-after('nogoodstringwrong','nogoodstring'))", document, document));
  });

  specify("NIST_coreFunction015", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("Correct Substring After",
            xpath.evaluate("substring-after(substring-after('nogoodwrongCorrect Substring After','nogood'),substring-after('nogoodstringwrong','nogoodstring'))", document, document));
  });

  specify("NIST_coreFunction016", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("Correct Substring Before",
            xpath.evaluate("substring-before('Correct Substring Beforewrong',substring-before('wrongnogood','nogood'))", document, document));
  });

  specify("NIST_coreFunction017", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal("Correct Substring Before",
            xpath.evaluate("substring-before(substring-before('Correct Substring Beforewrongcut here','cut here'),substring-before('wrongnogood','nogood'))", document, document));
  });

  // coreFunction018 thru coreFunction035 are omitted because they test XPath
  // variables, but DOM 3 XPath does not provide any facility to set variables.
  //
  // The tests are reproduced here anyway in case in the future jsdom provides
  // some non-standard mechanism for setting variables.
  //
  //
  // exports.NIST_coreFunction018 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "String From Variable"
  //     test.equal("String From Variable",
  //             xpath.evaluate("string($variable1)", document, document));
  // };
  //
  // exports.NIST_coreFunction019 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "String "
  //     test.equal("String From Variable",
  //             xpath.evaluate("concat($variable1,'From ','Variable')", document, document));
  // };
  //
  // exports.NIST_coreFunction020 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "From "
  //     test.equal("String From Variable",
  //             xpath.evaluate("concat('String ',$variable1,'Variable')", document, document));
  // };
  //
  // exports.NIST_coreFunction021 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "Variable"
  //     test.equal("String From Variable",
  //             xpath.evaluate("concat('String ','From ',$variable1)", document, document));
  // };
  //
  // exports.NIST_coreFunction022 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "String "
  //     // set $variable2 = "From "
  //     // set $variable3 = "Variable"
  //     test.equal("String From Variable",
  //             xpath.evaluate("concat($variable1,$variable2,$variable3)", document, document));
  // };
  //
  // exports.NIST_coreFunction023 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "substring-before with variablecut this"
  //     test.equal("substring-before with variable",
  //             xpath.evaluate("substring-before($variable1,'cut this')", document, document));
  // };
  //
  // exports.NIST_coreFunction024 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "cut this"
  //     test.equal("substring-before with variable",
  //             xpath.evaluate("substring-before('substring-before with variablecut this',$variable1)", document, document));
  // };
  //
  // exports.NIST_coreFunction025 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "substring before with variablecut this"
  //     // set $variable2 = "cut this"
  //     test.equal("substring before with variable",
  //             xpath.evaluate("substring-before($variable1,$variable2)", document, document));
  // };
  //
  // exports.NIST_coreFunction026 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "cut thissubstring-after with variable"
  //     test.equal("substring-after with variable",
  //             xpath.evaluate("substring-after($variable1,'cut this')", document, document));
  // };
  //
  // exports.NIST_coreFunction027 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "cut this"
  //     test.equal("substring after with variable",
  //             xpath.evaluate("substring-after('cut thissubstring after with variable',$variable1)", document, document));
  // };
  //
  // exports.NIST_coreFunction028 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "cut thissubstring-after with variable"
  //     // set $variable2 = "cut this"
  //     test.equal("substring-after with variable",
  //             xpath.evaluate("substring-after($variable1,$variable2)", document, document));
  // };
  //
  // exports.NIST_coreFunction029 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "cut thissubstring with variable"
  //     test.equal("substring with variable",
  //             xpath.evaluate("substring($variable1,9)", document, document));
  // };
  //
  // exports.NIST_coreFunction030 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "cut thissubstring with variable"
  //     test.equal("substring with variable",
  //             xpath.evaluate("substring($variable1,9,23)", document, document));
  // };
  //
  // exports.NIST_coreFunction031 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "should return the value 26"
  //     test.equal(26,
  //             xpath.evaluate("string-length($variable1)", document, document));
  // };
  //
  // exports.NIST_coreFunction032 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "translate 1234 variable"
  //     test.equal("translate with variable",
  //             xpath.evaluate("translate($variable1,'1234','with')", document, document));
  // };
  //
  // exports.NIST_coreFunction033 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "1234"
  //     test.equal("translate with variable",
  //             xpath.evaluate("translate('translate 1234 variable',$variable1,'with')", document, document));
  // };
  //
  // exports.NIST_coreFunction034 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "with"
  //     test.equal("translate with variable",
  //             xpath.evaluate("translate('translate 1234 variable','1234',$variable1)", document, document));
  // };
  //
  // exports.NIST_coreFunction035 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "translate 1234 variable"
  //     // set $variable2 = "1234"
  //     // set $variable3 = "with"
  //     test.equal("translate with variable",
  //             xpath.evaluate("translate($variable1,$variable2,$variable3)", document, document));
  // };


  // coreFunction036 thru coreFunction059 are omitted since they test XSLT
  // parameters. Outside the context of XSLT, they are effectively redundant
  // with coreFunction018 thru coreFunction035.


  specify("NIST_coreFunction060", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(-2,
            xpath.evaluate("floor(-1.99999)", document, document));
  });

  specify("NIST_coreFunction061", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(-2,
            xpath.evaluate("floor(-1.0001)", document, document));
  });


  // coreFunction062 is omitted because it tests XPath variables, as above.

  // exports.NIST_coreFunction062 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "3.1"
  //     test.equal(3,
  //             xpath.evaluate("floor($variable1)", document, document));
  // };


  // coreFunction063 is omitted because it tests XSLT parameters, as above.


  specify("NIST_coreFunction064", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(2,
            xpath.evaluate("floor(ceiling(1.2))", document, document));
  });

  specify("NIST_coreFunction065", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(1,
            xpath.evaluate("floor(round(1.2))", document, document));
  });

  specify("NIST_coreFunction066", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(1,
            xpath.evaluate("floor(floor(1.2))", document, document));
  });

  specify("NIST_coreFunction067", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(1,
            xpath.evaluate("floor((((((2*10)-4)+9) div 5) mod 2))", document, document));
  });

  specify("NIST_coreFunction068", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(-1,
            xpath.evaluate("ceiling(-1.0001)", document, document));
  });

  specify("NIST_coreFunction069", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(-1,
            xpath.evaluate("ceiling(-1.9999)", document, document));
  });

  // coreFunction070 is omitted because it tests XPath variables, as above.
  //
  // exports.NIST_coreFunction070 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "2.5"
  //     test.equal(3,
  //             xpath.evaluate("ceiling($variable1)", document, document));
  // };

  specify("NIST_coreFunction071", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(2,
            xpath.evaluate("ceiling(floor(2.2))", document, document));
  });

  specify("NIST_coreFunction072", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(4,
            xpath.evaluate("ceiling(ceiling(3.2))", document, document));
  });


  // coreFunction073 is omitted because it tests XSLT parameters, as above.


  specify("NIST_coreFunction074", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(3,
            xpath.evaluate("ceiling((((((2*10)-4)+9) div 5) div 2))", document, document));
  });

  specify("NIST_coreFunction075", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(-2,
            xpath.evaluate("round(-1.9999)", document, document));
  });

  // coreFunction076 is omitted because it tests XPath variables, as above.
  //
  // exports.NIST_coreFunction076 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     // set $variable1 = "2.3"
  //     test.equal(2
  //             xpath.evaluate("round($variable1)", document, document));
  // };


  // coreFunction077 is omitted because it tests XSLT parameters, as above.


  specify("NIST_coreFunction078", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(4,
            xpath.evaluate("round(ceiling(3.2))", document, document));
  });

  specify("NIST_coreFunction079", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(3,
            xpath.evaluate("round((((((2*10)-4)+9) div 5) div 2))", document, document));
  });

  specify("NIST_coreFunction080", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.ok(isNaN(xpath.evaluate("round(NaN)", document, document)));
  });

  specify("NIST_coreFunction081", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(0,
            xpath.evaluate("round(-0)", document, document));
  });

  specify("NIST_coreFunction082", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(0,
            xpath.evaluate("round(-0.25)", document, document));
  });

  specify("NIST_coreFunction083", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(2,
            xpath.evaluate("round(round(2.3))", document, document));
  });

  specify("NIST_coreFunction084", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(Number.POSITIVE_INFINITY,
            xpath.evaluate("round(2.3 div 0)", document, document));
  });

  specify("NIST_coreFunction085", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(Number.NEGATIVE_INFINITY,
            xpath.evaluate("round(-2.3 div 0)", document, document));
  });

  specify("NIST_coreFunction086", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(-1.9999,
            xpath.evaluate("number('-1.9999')", document, document));
  });

  specify("NIST_coreFunction087", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(1.9999,
            xpath.evaluate("number('1.9999')", document, document));
  });

  specify("NIST_coreFunction088", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
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
    child1.appendChild(text);

    assert.equal(1,
            xpath.evaluate("count(//child1[ancestor::element1])", document, doc));
  });

  specify("NIST_coreFunction089", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1 = document.createElement("element1");
    doc.appendChild(element1);
    var text = document.createTextNode("Incorrect Execution!!");
    element1.appendChild(text);
    element1 = document.createElement("element1");
    doc.appendChild(element1);
    text = document.createTextNode("Test executed Successfully!!");
    element1.appendChild(text);

    domTestHelper.arrayEqual(assert, [element1],
            xpath.evaluate("element1[2]", document, doc).nodes);
  });


  // Many of the NIST dataManipulation tests include more than one XPath query,
  // so here they're split into multiple test cases.
  //
  // Some dataManipulation tests test XSLT features that aren't part of XPath,
  // so those tests are omitted here.

  specify("NIST_dataManipulation001a", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true,
            xpath.evaluate("2 > 1", document, document));
  });

  specify("NIST_dataManipulation001b", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true,
            xpath.evaluate("9 mod 3 = 0", document, document));
  });

  specify("NIST_dataManipulation002a", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(false,
            xpath.evaluate("2 > 3", document, document));
  });

  specify("NIST_dataManipulation003", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true,
            xpath.evaluate("(((((2*10)-4)+9) div 5) div 2) > 2", document, document));
  });

  specify("NIST_dataManipulation004", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(false,
            xpath.evaluate("(((((2*10)-4)+9) div 5) div 2) > 4", document, document));
  });

  specify("NIST_dataManipulation007", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true,
            xpath.evaluate("(round(3.7) > 3)", document, document));
  });

  specify("NIST_dataManipulation009", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1 = document.createElement("element1");
    doc.appendChild(element1);
    var text = document.createTextNode("Test executed successfully!!");
    element1.appendChild(text);
    var element2 = document.createElement("element2");
    text = document.createTextNode("Incorrect execution!!");
    element2.appendChild(text);

    domTestHelper.arrayEqual(assert, [element1],
            xpath.evaluate("doc/element1", document, document).nodes);
  });

  specify("NIST_dataManipulation013", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
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

    domTestHelper.arrayEqual(assert, [element1],
            xpath.evaluate("doc/element1[last()]", document, document).nodes);
  });

  specify("NIST_dataManipulation014", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
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

    domTestHelper.arrayEqual(assert, [element1],
            xpath.evaluate("doc/element1[((((((2*10)-4)+9) div 5) mod 3)+1)]", document, document).nodes);
  });

  specify("NIST_dataManipulation016", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1 = document.createElement("element1");
    doc.appendChild(element1);
    var good_child1 = document.createElement("child1");
    element1.appendChild(good_child1);
    var text = document.createTextNode("Test Executed Successfully!!");
    good_child1.appendChild(text);
    var element2 = document.createElement("element2");
    doc.appendChild(element2);
    child1 = document.createElement("child1");
    element2.appendChild(child1);
    text = document.createTextNode("Incorrect Execution!!");
    child1.appendChild(text);

    domTestHelper.arrayEqual(assert, [good_child1],
            xpath.evaluate("//child1[ancestor::element1]", document, document).nodes);
  });


  specify("NIST_expression001", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("child1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("child2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1,child2],
            xpath.evaluate("/doc/sub1/child1|/doc/sub2/child2", document, doc).nodes);
  });

  specify("NIST_expression002", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("child1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("child2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1,child2],
            xpath.evaluate("sub1/child1|/doc/sub2/child2", document, doc).nodes);
  });

  specify("NIST_expression003", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("descendant number 1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("descendant number 2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1,child2],
            xpath.evaluate("//child1|//child2", document, doc).nodes);

    domTestHelper.arrayEqual(assert, [sub1],
            xpath.evaluate("ancestor::sub1|ancestor::sub2", document, child1).nodes);

    domTestHelper.arrayEqual(assert, [sub2],
            xpath.evaluate("ancestor::sub1|ancestor::sub2", document, child2).nodes);
  });

  specify("NIST_expression004", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("descendant number 1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("descendant number 2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1,child2],
            xpath.evaluate("//child1|//child2", document, doc).nodes);

    domTestHelper.arrayEqual(assert, [sub1],
            xpath.evaluate("ancestor-or-self::sub1|ancestor-or-self::sub2", document, child1).nodes);

    domTestHelper.arrayEqual(assert, [sub2],
            xpath.evaluate("ancestor-or-self::sub1|ancestor-or-self::sub2", document, child2).nodes);
  });

  specify("NIST_expression005", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var book1 = document.createElement("book");
    doc.appendChild(book1);
    var author1 = document.createElement("author");
    book1.appendChild(author1);
    var name = document.createElement("name");
    author1.appendChild(name);
    name.setAttribute("real", "no");
    var text = document.createTextNode("Carmelo Montanez");
    name.appendChild(text);
    var chapters = document.createElement("chapters");
    author1.appendChild(chapters);
    text = document.createTextNode("Nine");
    chapters.appendChild(text);
    var bibliography = document.createElement("bibliography");
    author1.appendChild(bibliography);
    var book2 = document.createElement("book");
    doc.appendChild(book2);
    var author2 = document.createElement("author");
    book2.appendChild(author2);
    name = document.createElement("name");
    author2.appendChild(name);
    name.setAttribute("real", "na");
    text = document.createTextNode("David Marston");
    name.appendChild(text);
    chapters = document.createElement("chapters");
    author2.appendChild(chapters);
    text = document.createTextNode("Seven");
    chapters.appendChild(text);
    bibliography = document.createElement("bibliography");
    author2.appendChild(bibliography);
    var book3 = document.createElement("book");
    doc.appendChild(book3);
    var author3 = document.createElement("author");
    book3.appendChild(author3);
    name = document.createElement("name");
    author3.appendChild(name);
    name.setAttribute("real", "yes");
    text = document.createTextNode("Mary Brady");
    name.appendChild(text);
    chapters = document.createElement("chapters");
    author3.appendChild(chapters);
    text = document.createTextNode("Ten");
    bibliography = document.createElement("bibliography");
    author3.appendChild(bibliography);

    domTestHelper.arrayEqual(assert, [author1],
            xpath.evaluate("author[name/@real='no']|author[name/@real='yes']", document, book1).nodes);

    domTestHelper.arrayEqual(assert, [],
            xpath.evaluate("author[name/@real='no']|author[name/@real='yes']", document, book2).nodes);

    domTestHelper.arrayEqual(assert, [author3],
            xpath.evaluate("author[name/@real='no']|author[name/@real='yes']", document, book3).nodes);
  });

  specify("NIST_expression006", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    doc.setAttribute("attr1", "attribute 1 ");
    doc.setAttribute("attr2", "attribute 2");
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("child number 1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    text = document.createTextNode("child number 2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [doc.getAttributeNode("attr1"), doc.getAttributeNode("attr2")],
            xpath.evaluate("attribute::attr1|attribute::attr2", document, doc).nodes);
  });

  specify("NIST_expression007", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    doc.setAttribute("attr1", "attribute 1 ");
    doc.setAttribute("attr2", "attribute 2");
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("child number 1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    text = document.createTextNode("child number 2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [sub1, sub2],
            xpath.evaluate("child::sub1|child::sub2", document, doc).nodes);
  });

  specify("NIST_expression008", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var book1 = document.createElement("book");
    doc.appendChild(book1);
    var author1 = document.createElement("author");
    book1.appendChild(author1);
    var name = document.createElement("name");
    author1.appendChild(name);
    name.setAttribute("real", "no");
    var text = document.createTextNode("Carmelo Montanez");
    name.appendChild(text);
    var chapters = document.createElement("chapters");
    author1.appendChild(chapters);
    text = document.createTextNode("Nine");
    chapters.appendChild(text);
    var bibliography = document.createElement("bibliography");
    author1.appendChild(bibliography);
    var book2 = document.createElement("book");
    doc.appendChild(book2);
    var author2 = document.createElement("author");
    book2.appendChild(author2);
    name = document.createElement("name");
    author2.appendChild(name);
    name.setAttribute("real", "na");
    text = document.createTextNode("David Marston");
    name.appendChild(text);
    chapters = document.createElement("chapters");
    author2.appendChild(chapters);
    text = document.createTextNode("Seven");
    chapters.appendChild(text);
    bibliography = document.createElement("bibliography");
    author2.appendChild(bibliography);
    var book3 = document.createElement("book");
    doc.appendChild(book3);
    var author3 = document.createElement("author");
    book3.appendChild(author3);
    name = document.createElement("name");
    author3.appendChild(name);
    name.setAttribute("real", "yes");
    text = document.createTextNode("Mary Brady");
    name.appendChild(text);
    chapters = document.createElement("chapters");
    author3.appendChild(chapters);
    text = document.createTextNode("Ten");
    bibliography = document.createElement("bibliography");
    author3.appendChild(bibliography);

    domTestHelper.arrayEqual(assert, [author1],
            xpath.evaluate("author[(name/@real='no' and position()=1)]|author[(name/@real='yes' and position()=last())]", document, book1).nodes);

    domTestHelper.arrayEqual(assert, [],
            xpath.evaluate("author[(name/@real='no' and position()=1)]|author[(name/@real='yes' and position()=last())]", document, book2).nodes);

    domTestHelper.arrayEqual(assert, [author3],
            xpath.evaluate("author[(name/@real='no' and position()=1)]|author[(name/@real='yes' and position()=last())]", document, book3).nodes);
  });

  specify("NIST_expression009", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("descendant number 1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("descendant number 2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1,child2],
            xpath.evaluate("descendant::child1|descendant::child2", document, doc).nodes);
  });

  specify("NIST_expression010", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("descendant number 1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("descendant number 2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [doc],
            xpath.evaluate("descendant-or-self::doc|descendant-or-self::doc", document, doc).nodes);
  });

  specify("NIST_expression011", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var book1 = document.createElement("book");
    doc.appendChild(book1);
    var author1 = document.createElement("author");
    book1.appendChild(author1);
    var name = document.createElement("name");
    author1.appendChild(name);
    name.setAttribute("real", "no");
    var text = document.createTextNode("Carmelo Montanez");
    name.appendChild(text);
    var chapters = document.createElement("chapters");
    author1.appendChild(chapters);
    text = document.createTextNode("Nine");
    chapters.appendChild(text);
    var bibliography = document.createElement("bibliography");
    author1.appendChild(bibliography);
    var book2 = document.createElement("book");
    doc.appendChild(book2);
    var author2 = document.createElement("author");
    book2.appendChild(author2);
    name = document.createElement("name");
    author2.appendChild(name);
    name.setAttribute("real", "na");
    text = document.createTextNode("David Marston");
    name.appendChild(text);
    chapters = document.createElement("chapters");
    author2.appendChild(chapters);
    text = document.createTextNode("Seven");
    chapters.appendChild(text);
    bibliography = document.createElement("bibliography");
    author2.appendChild(bibliography);
    var book3 = document.createElement("book");
    doc.appendChild(book3);
    var author3 = document.createElement("author");
    book3.appendChild(author3);
    name = document.createElement("name");
    author3.appendChild(name);
    name.setAttribute("real", "yes");
    text = document.createTextNode("Mary Brady");
    name.appendChild(text);
    chapters = document.createElement("chapters");
    author3.appendChild(chapters);
    text = document.createTextNode("Ten");
    bibliography = document.createElement("bibliography");
    author3.appendChild(bibliography);

    domTestHelper.arrayEqual(assert, [author1],
            xpath.evaluate("author[name='Mary Brady']|author[name/@real='no']", document, book1).nodes);

    domTestHelper.arrayEqual(assert, [],
            xpath.evaluate("author[name='Mary Brady']|author[name/@real='no']", document, book2).nodes);

    domTestHelper.arrayEqual(assert, [author3],
            xpath.evaluate("author[name='Mary Brady']|author[name/@real='no']", document, book3).nodes);
  });

  // expression012 tests XPath variables, amongst other features, and is
  // omitted as above for other tests. A modified version that does not test
  // variables is included below.
  //
  // exports.NIST_expression012 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     var doc = document.documentElement;
  //     var child1 = document.createElement("child1");
  //     doc.appendChild(child1);
  //     var text = document.createTextNode("child number 1");
  //     child.appendChild(text);
  //     var child2 = document.createElement("child2");
  //     doc.appendChild(child2);
  //     text = document.createTextNode("child number 2");
  //     child2.appendChild(text);
  //     var child3 = document.createElement("child3");
  //     doc.appendChild(child3);
  //     text = document.createTextNode("Selection of this child is an error.");
  //     child3.appendChild(text);
  //
  //     var result1 = xpath.evaluate("//noChild1", document, doc);
  //     domTestHelper.arrayEqual(test, [], result1.nodes);
  //
  //     var result2 = xpath.evaluate("//noChild2", document, doc);
  //     domTestHelper.arrayEqual(test, [], result2.nodes);
  //
  //     // set $var1 = result1.nodes
  //     // set $var2 = result2.nodes
  //
  //     domTestHelper.arrayEqual(test, [],
  //             xpath.evaluate("$var1|$var2", document, docu));
  // };

  specify("NIST_expression012_noVariables", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var child1 = document.createElement("child1");
    doc.appendChild(child1);
    var text = document.createTextNode("child number 1");
    child1.appendChild(text);
    var child2 = document.createElement("child2");
    doc.appendChild(child2);
    text = document.createTextNode("child number 2");
    child2.appendChild(text);
    var child3 = document.createElement("child3");
    doc.appendChild(child3);
    text = document.createTextNode("Selection of this child is an error.");
    child3.appendChild(text);

    domTestHelper.arrayEqual(assert, [],
            xpath.evaluate("//noChild1", document, doc).nodes);

    domTestHelper.arrayEqual(assert, [],
            xpath.evaluate("//noChild2", document, doc).nodes);

    domTestHelper.arrayEqual(assert, [],
            xpath.evaluate("//noChild1|//noChild2", document, doc).nodes);
  });

  specify("NIST_expression013", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("preceding sibling number 1");
    child1.appendChild(text);
    var child2 = document.createElement("child2");
    sub1.appendChild(child2);
    text = document.createTextNode("current node");
    child2.appendChild(text);
    var child3 = document.createElement("child3");
    sub1.appendChild(child3);
    text = document.createTextNode("following sibling number 3");
    child3.appendChild(text);

    domTestHelper.arrayEqual(assert, [child2],
            xpath.evaluate("//child2", document, doc).nodes);

    domTestHelper.arrayEqual(assert, [child1, child3],
            xpath.evaluate("preceding-sibling::child1|following-sibling::child3", document, child2).nodes);
  });

  // expression014 and expression015 are omitted because they test the XSLT
  // key() function.

  specify("NIST_expression016", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var book1 = document.createElement("book");
    doc.appendChild(book1);
    var author1 = document.createElement("author");
    book1.appendChild(author1);
    var name1 = document.createElement("name");
    author1.appendChild(name1);
    name1.setAttribute("real", "no");
    var text = document.createTextNode("Carmelo Montanez");
    name1.appendChild(text);
    var chapters = document.createElement("chapters");
    author1.appendChild(chapters);
    text = document.createTextNode("Nine");
    chapters.appendChild(text);
    var bibliography = document.createElement("bibliography");
    author1.appendChild(bibliography);
    var book2 = document.createElement("book");
    doc.appendChild(book2);
    var author2 = document.createElement("author");
    book2.appendChild(author2);
    var name2 = document.createElement("name");
    author2.appendChild(name2);
    name2.setAttribute("real", "na");
    text = document.createTextNode("David Marston");
    name2.appendChild(text);
    chapters = document.createElement("chapters");
    author2.appendChild(chapters);
    text = document.createTextNode("Seven");
    chapters.appendChild(text);
    bibliography = document.createElement("bibliography");
    author2.appendChild(bibliography);
    var book3 = document.createElement("book");
    doc.appendChild(book3);
    var author3 = document.createElement("author");
    book3.appendChild(author3);
    var name3 = document.createElement("name");
    author3.appendChild(name3);
    name3.setAttribute("real", "yes");
    text = document.createTextNode("Mary Brady");
    name3.appendChild(text);
    chapters = document.createElement("chapters");
    author3.appendChild(chapters);
    text = document.createTextNode("Ten");
    bibliography = document.createElement("bibliography");
    author3.appendChild(bibliography);
    var author4 = document.createElement("author");
    bibliography.appendChild(author4);
    var name4 = document.createElement("name");
    author4.appendChild(name4);
    text = document.createTextNode("Lynne Rosenthal");
    name4.appendChild(text);
    chapters = document.createElement("chapters");
    author4.appendChild(chapters);
    text = document.createTextNode("Five");
    chapters.appendChild(text);

    domTestHelper.arrayEqual(assert, [name1],
            xpath.evaluate("author/name|author/bibliography/author/name", document, book1).nodes);

    domTestHelper.arrayEqual(assert, [name2],
            xpath.evaluate("author/name|author/bibliography/author/name", document, book2).nodes);

    domTestHelper.arrayEqual(assert, [name3, name4],
            xpath.evaluate("author/name|author/bibliography/author/name", document, book3).nodes);
  });

  specify("NIST_expression017", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var book1 = document.createElement("book");
    doc.appendChild(book1);
    var author1 = document.createElement("author");
    book1.appendChild(author1);
    var name1 = document.createElement("name");
    author1.appendChild(name1);
    name1.setAttribute("real", "no");
    var text = document.createTextNode("Carmelo Montanez");
    name1.appendChild(text);
    var chapters = document.createElement("chapters");
    author1.appendChild(chapters);
    text = document.createTextNode("Nine");
    chapters.appendChild(text);
    var bibliography = document.createElement("bibliography");
    author1.appendChild(bibliography);
    var book2 = document.createElement("book");
    doc.appendChild(book2);
    var author2 = document.createElement("author");
    book2.appendChild(author2);
    var name2 = document.createElement("name");
    author2.appendChild(name2);
    name2.setAttribute("real", "na");
    text = document.createTextNode("David Marston");
    name2.appendChild(text);
    chapters = document.createElement("chapters");
    author2.appendChild(chapters);
    text = document.createTextNode("Seven");
    chapters.appendChild(text);
    bibliography = document.createElement("bibliography");
    author2.appendChild(bibliography);
    var book3 = document.createElement("book");
    doc.appendChild(book3);
    var author3 = document.createElement("author");
    book3.appendChild(author3);
    var name3 = document.createElement("name");
    author3.appendChild(name3);
    name3.setAttribute("real", "yes");
    text = document.createTextNode("Mary Brady");
    name3.appendChild(text);
    chapters = document.createElement("chapters");
    author3.appendChild(chapters);
    text = document.createTextNode("Ten");
    bibliography = document.createElement("bibliography");
    author3.appendChild(bibliography);
    var author4 = document.createElement("author");
    bibliography.appendChild(author4);
    var name4 = document.createElement("name");
    author4.appendChild(name4);
    text = document.createTextNode("Lynne Rosenthal");
    name4.appendChild(text);
    chapters = document.createElement("chapters");
    author4.appendChild(chapters);
    text = document.createTextNode("Five");
    chapters.appendChild(text);

    domTestHelper.arrayEqual(assert, [name1],
            xpath.evaluate("author/name|author/bibliography/author/chapters", document, book1).nodes);

    domTestHelper.arrayEqual(assert, [name2],
            xpath.evaluate("author/name|author/bibliography/author/chapters", document, book2).nodes);

    domTestHelper.arrayEqual(assert, [name3, chapters],
            xpath.evaluate("author/name|author/bibliography/author/chapters", document, book3).nodes);
  });

  specify("NIST_expression018", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var book1 = document.createElement("book");
    doc.appendChild(book1);
    var author1 = document.createElement("author");
    book1.appendChild(author1);
    var name1 = document.createElement("name");
    author1.appendChild(name1);
    name1.setAttribute("real", "na");
    var text = document.createTextNode("David Marston");
    name1.appendChild(text);
    var chapters1 = document.createElement("chapters");
    author1.appendChild(chapters1);
    text = document.createTextNode("Seven");
    chapters1.appendChild(text);
    var bibliography1 = document.createElement("bibliography");
    author1.appendChild(bibliography1);
    var book2 = document.createElement("book");
    doc.appendChild(book2);
    var author2 = document.createElement("author");
    book2.appendChild(author2);
    var name2 = document.createElement("name");
    author2.appendChild(name2);
    name2.setAttribute("real", "yes");
    text = document.createTextNode("Mary Brady");
    name2.appendChild(text);
    var chapters2 = document.createElement("chapters");
    author2.appendChild(chapters2);
    text = document.createTextNode("Ten");
    chapters2.appendChild(text);
    var bibliography2 = document.createElement("bibliography");
    author2.appendChild(bibliography2);

    domTestHelper.arrayEqual(assert, [name1],
            xpath.evaluate("author/name|author/noElement", document, book1).nodes);

    domTestHelper.arrayEqual(assert, [name2],
            xpath.evaluate("author/name|author/noElement", document, book2).nodes);
  });

  // expression019 tests XPath variables, amongst other features, and is
  // omitted as above for other tests. A modified version that does not test
  // variables is included below.
  //
  // exports.NIST_expression019 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     var doc = document.documentElement;
  //     var child1 = document.createElement("child1");
  //     doc.appendChild(child1);
  //     var text = document.createTextNode("Text for variable 1.");
  //     child1.appendChild(text);
  //     var child2 = document.createElement("child2");
  //     doc.appendChild(child2);
  //     text = document.createTextNode("Selection of this child is an error.");
  //     child2.appendChild(text);
  //     var child3 = document.createElement("child3");
  //     doc.appendChild(child3);
  //     text = document.createTextNode("Selection of this child is an error.");
  //     child3.appendChild(text);
  //
  //     var result = xpath.evaluate("//child1", document, doc);
  //     domTestHelper.arrayEqual(test, [child1], result.nodes);
  //
  //     // set $var1 = result.nodes
  //     // set $var2 = result.nodes
  //
  //     domTestHelper.arrayEqual(test, [child1],
  //             xpath.evaluate("$var1|$var2", document, doc));
  // };

  specify("NIST_expression019_noVariables", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var child1 = document.createElement("child1");
    doc.appendChild(child1);
    var text = document.createTextNode("Text for variable 1.");
    child1.appendChild(text);
    var child2 = document.createElement("child2");
    doc.appendChild(child2);
    text = document.createTextNode("Selection of this child is an error.");
    child2.appendChild(text);
    var child3 = document.createElement("child3");
    doc.appendChild(child3);
    text = document.createTextNode("Selection of this child is an error.");
    child3.appendChild(text);

    var result = xpath.evaluate("//child1", document, doc);
    domTestHelper.arrayEqual(assert, [child1], result.nodes);

    domTestHelper.arrayEqual(assert, [child1],
            xpath.evaluate("//child1|//child1", document, doc).nodes);
  });

  specify("NIST_expression020", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("child1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("child2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1, child2],
            xpath.evaluate("sub1/child1|sub2/child2", document, doc).nodes);
  });

  specify("NIST_expression021", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var sub1 = document.createElement("sub1");
    doc.appendChild(sub1);
    var child1 = document.createElement("child1");
    sub1.appendChild(child1);
    var text = document.createTextNode("self content number 1");
    child1.appendChild(text);
    var sub2 = document.createElement("sub2");
    doc.appendChild(sub2);
    var child2 = document.createElement("child2");
    sub2.appendChild(child2);
    text = document.createTextNode("self content number 2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1, child2],
            xpath.evaluate("//child1|//child2", document, doc).nodes);

    domTestHelper.arrayEqual(assert, [child1],
            xpath.evaluate("self::child1|self::child2", document, child1).nodes);

    domTestHelper.arrayEqual(assert, [child2],
            xpath.evaluate("self::child1|self::child2", document, child2).nodes);
  });

  specify("NIST_expression022", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var child1 = document.createElement("child1");
    doc.appendChild(child1);
    var text = document.createTextNode("1");
    child1.appendChild(text);
    var child2 = document.createElement("child2");
    doc.appendChild(child2);
    text = document.createTextNode("2");
    child2.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1, child2],
            xpath.evaluate("//child1|//child2", document, doc).nodes);
  });

  specify("NIST_expression023", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var child1 = document.createElement("child1");
    doc.appendChild(child1);
    var text = document.createTextNode("1");
    child1.appendChild(text);
    var child2 = document.createElement("child2");
    doc.appendChild(child2);
    text = document.createTextNode("2");
    child2.appendChild(text);
    var child3 = document.createElement("child3");
    doc.appendChild(child3);
    text = document.createTextNode("3");
    child3.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1, child2, child3],
            xpath.evaluate("//child1|//child2|//child3", document, doc).nodes);
  });

  // expression024 is omitted because it tests the XSLT key() function.

  // expression025 tests XPath variables, amongst other features, and is
  // omitted as above for other tests. A modified version that does not test
  // variables is included below.
  //
  // exports.NIST_expression025 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     var doc = document.documentElement;
  //     var child1 = document.createElement("child1");
  //     doc.appendChild(child1);
  //     var text = document.createTextNode("Text for variable");
  //     child1.appendChild(text);
  //     var child2 = document.createElement("child2");
  //     doc.appendChild(child2);
  //     text = document.createTextNode("Text for location Path");
  //     child2.appendChild(text);
  //     var child3 = document.createElement("child3");
  //     text = document.createTextNode("Selection of this child is an error");
  //     child3.appendChild(text);
  //
  //     var result = xpath.evaluate("//child1", document, doc);
  //     domTestHelper.arrayEqual(test, [child1], result.nodes);
  //
  //     // set $var1 = result.nodes
  //
  //     domTestHelper.arrayEqual(test, [child1, child2],
  //             xpath.evaluate("$var1|child::child2", document, doc).nodes);
  // };

  specify("NIST_expression025_noVariables", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var child1 = document.createElement("child1");
    doc.appendChild(child1);
    var text = document.createTextNode("Text for variable");
    child1.appendChild(text);
    var child2 = document.createElement("child2");
    doc.appendChild(child2);
    text = document.createTextNode("Text for location Path");
    child2.appendChild(text);
    var child3 = document.createElement("child3");
    text = document.createTextNode("Selection of this child is an error");
    child3.appendChild(text);

    var result = xpath.evaluate("//child1", document, doc);
    domTestHelper.arrayEqual(assert, [child1], result.nodes);

    domTestHelper.arrayEqual(assert, [child1, child2],
            xpath.evaluate("//child1|child::child2", document, doc).nodes);
  });

  // expression026 tests XPath variables, so it is omitted as above. There is no
  // modified version of this test that does not use variables, because it would
  // be redundant with other tests.
  //
  // exports.NIST_expression026 = function(test) {
  //     const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
  //     var doc = document.documentElement;
  //     var child1 = document.createElement("child1");
  //     doc.appendChild(child1);
  //     var text = document.createTextNode("child number 1");
  //     child1.appendChild(text);
  //     var child2 = document.createElement("child2");
  //     doc.appendChild(child2);
  //     text = document.createTextNode("child number 2");
  //     child2.appendChild(text);
  //     var child3 = document.createElement("child3");
  //     text = document.createTextNode("Selection of this child is an error");
  //     child3.appendChild(text);
  //
  //     var result1 = xpath.evaluate("//child1", document, doc);
  //     domTestHelper.arrayEqual(test, [child1], result1.nodes);
  //
  //     var result2 = xpath.evaluate("//child2", document, doc);
  //     domTestHelper.arrayEqual(test, [child2], result2.nodes);
  //
  //     // set $var1 = result1.nodes
  //     // set $var2 = result2.nodes
  //
  //     domTestHelper.arrayEqual(test, [child1, child2],
  //             xpath.evaluate("$var1|$var2", document, doc).nodes);
  // };

  specify("NIST_expression027", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true, xpath.evaluate("(-0 = 0)", document, document));
  });

  specify("NIST_expression028", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(false, xpath.evaluate("(-0 < 0)", document, document));
  });

  specify("NIST_expression029", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(false, xpath.evaluate("(-0 > 0)", document, document));
  });

  specify("NIST_expression030", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true, xpath.evaluate("(-0 >= 0)", document, document));
  });

  specify("NIST_expression031", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true, xpath.evaluate("(-0 <= 0)", document, document));
  });

  specify("NIST_expression032", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(false, xpath.evaluate("(-0 != 0)", document, document));
  });

  specify("NIST_expression033", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true, xpath.evaluate("2.1 > 2.0", document, document));
    assert.equal(false, xpath.evaluate("2.1 < 2.0", document, document));
    assert.equal(false, xpath.evaluate("2.1 = 2.0", document, document));
    assert.equal(false, xpath.evaluate("2.1 > NaN", document, document));
  });

  specify("NIST_expression034", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true, xpath.evaluate("2.0 < 2.1", document, document));
    assert.equal(false, xpath.evaluate("2.0 > 2.1", document, document));
    assert.equal(false, xpath.evaluate("2.0 = 2.1", document, document));
    assert.equal(false, xpath.evaluate("2.0 < NaN", document, document));
  });

  specify("NIST_expression035", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true, xpath.evaluate("2.0 <= 2.0", document, document));
    assert.equal(false, xpath.evaluate("2.0 > 2.0", document, document));
    assert.equal(true, xpath.evaluate("2.0 = 2.0", document, document));
    assert.equal(false, xpath.evaluate("2.0 <= NaN", document, document));
  });

  specify("NIST_expression036", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    assert.equal(true, xpath.evaluate("2.0 >= 2.0", document, document));
    assert.equal(false, xpath.evaluate("2.0 < 2.0", document, document));
    assert.equal(true, xpath.evaluate("2.0 = 2.0", document, document));
    assert.equal(false, xpath.evaluate("2.0 <= NaN", document, document));
  });

  specify("NIST_locationPath001", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var child1 = document.createElement("child1");
    doc.appendChild(child1);
    var text = document.createTextNode("Text from child1");
    child1.appendChild(text);
    var child2 = document.createElement("child2");
    child1.appendChild(child2);

    domTestHelper.arrayEqual(assert, [child1],
            xpath.evaluate("child1[child::child2]", document, doc).nodes);
  });

  specify("NIST_locationPath002", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1 = document.createElement("element1");
    var text = document.createTextNode("Text from first element");
    element1.appendChild(text);
    var child1a = document.createElement("child1");
    element1.appendChild(child1a);
    text = document.createTextNode("Text from child1 of first element");
    child1a.appendChild(text);
    var child2a = document.createElement("child2");
    element1.appendChild(child2a);
    text = document.createTextNode("Text from child2 of first element");
    child2a.appendChild(text);
    var element2 = document.createElement("element2");
    doc.appendChild(element2);
    text = document.createTextNode("Text from second element");
    element2.appendChild(text);
    var child1b = document.createElement("child1");
    element2.appendChild(child1b);
    text = document.createTextNode("Text from child1 of second element");
    child1b.appendChild(text);
    var child2b = document.createElement("child2");
    element2.appendChild(child2b);
    text = document.createTextNode("Text from child2 of second element (corect execution!!)");
    child2b.appendChild(text);

    domTestHelper.arrayEqual(assert, [child2b],
            xpath.evaluate("//child2[ancestor::element2]", document, doc).nodes);
  });

  specify("NIST_locationPath003", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1 = document.createElement("element1");
    var text = document.createTextNode("Text from first element");
    element1.appendChild(text);
    var child1a = document.createElement("child1");
    element1.appendChild(child1a);
    text = document.createTextNode("Text from child1 of first element");
    child1a.appendChild(text);
    var child2a = document.createElement("child2");
    element1.appendChild(child2a);
    text = document.createTextNode("Text from child2 of first element");
    child2a.appendChild(text);
    var element2 = document.createElement("element2");
    doc.appendChild(element2);
    text = document.createTextNode("Text from second element");
    element2.appendChild(text);
    var child1b = document.createElement("child1");
    element2.appendChild(child1b);
    text = document.createTextNode("Text from child1 of second element");
    child1b.appendChild(text);
    var child2b = document.createElement("child2");
    element2.appendChild(child2b);
    text = document.createTextNode("Text from child2 of second element (corect execution!!)");
    child2b.appendChild(text);

    domTestHelper.arrayEqual(assert, [child2b],
            xpath.evaluate("//child2[ancestor-or-self::element2]", document, doc).nodes);
  });

  specify("NIST_locationPath004", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1 = document.createElement("element1");
    var text = document.createTextNode("Text from first element");
    element1.appendChild(text);
    var child1a = document.createElement("child1");
    element1.appendChild(child1a);
    text = document.createTextNode("Text from child1 of first element");
    child1a.appendChild(text);
    var child2a = document.createElement("child2");
    element1.appendChild(child2a);
    text = document.createTextNode("Text from child2 of first element");
    child2a.appendChild(text);
    var element2 = document.createElement("element2");
    doc.appendChild(element2);
    text = document.createTextNode("Text from second element");
    element2.appendChild(text);
    var child1b = document.createElement("child1");
    element2.appendChild(child1b);
    text = document.createTextNode("Text from child1 of second element");
    child1b.appendChild(text);
    var child2b = document.createElement("child2");
    child2b.setAttribute("attr1", "yes");
    element2.appendChild(child2b);
    text = document.createTextNode("Text from child2 of second element (corect execution!!)");
    child2b.appendChild(text);

    domTestHelper.arrayEqual(assert, [child2b],
            xpath.evaluate("//child2[attribute::attr1]", document, doc).nodes);
  });

  specify("NIST_locationPath005", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1a = document.createElement("element1");
    doc.appendChild(element1a);
    var text = document.createTextNode("Text from first element (correct execution)!!!");
    element1a.appendChild(text);
    var child1 = document.createElement("child1");
    element1a.appendChild(child1);
    var child2 = document.createElement("child2");
    element1a.appendChild(child2);
    var element1b = document.createElement("element1");
    doc.appendChild(element1b);
    text = document.createTextNode("Text from second element");
    element1b.appendChild(text);
    child1 = document.createElement("child1");
    element1b.appendChild(child1);
    text = document.createTextNode("Text from child1 of second element");
    child1.appendChild(text);

    domTestHelper.arrayEqual(assert, [element1a],
            xpath.evaluate("element1[descendant-or-self::child2]", document, doc).nodes);
  });

  specify("NIST_locationPath006", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1 = document.createElement("element1");
    doc.appendChild(element1);
    var child1a = document.createElement("child1");
    element1.appendChild(child1a);
    var text = document.createTextNode("Test executed successfully!!")
    child1a.appendChild(text);
    var child2 = document.createElement("child2");
    element1.appendChild(child2);
    text = document.createTextNode("child2");
    child2.appendChild(text);
    var element2 = document.createElement("element2");
    doc.appendChild(element2);
    var child1b = document.createElement("child1");
    element2.appendChild(child1b);
    text = document.createTextNode("Wrong node selected!!");
    child1b.appendChild(text);
    var element3 = document.createElement("element3");
    doc.appendChild(element3);
    var child1c = document.createElement("child1");
    element3.appendChild(child1c);
    text = document.createTextNode("Wrong node selected!!");
    child1c.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1a],
            xpath.evaluate("//child1[parent::element1]", document, doc).nodes);
  });

  specify("NIST_locationPath007", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1a = document.createElement("element1");
    doc.appendChild(element1a);
    var text = document.createTextNode("Wrong node selected!!");
    element1a.appendChild(text);
    var element1b = document.createElement("element1");
    doc.appendChild(element1b);
    text = document.createTextNode("Test executed successfully!!");
    element1b.appendChild(text);
    var element1c = document.createElement("element1");
    doc.appendChild(element1c);
    text = document.createTextNode("Wrong node selected!!");
    element1c.appendChild(text);

    domTestHelper.arrayEqual(assert, [element1b],
            xpath.evaluate("element1[(((((2*10)-4)+9) div 5) mod 3 )]", document, doc).nodes);
  });

  specify("NIST_locationPath008", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1a = document.createElement("element1");
    doc.appendChild(element1a);
    var text = document.createTextNode("Wrong node selected!!");
    element1a.appendChild(text);
    var element1b = document.createElement("element1");
    doc.appendChild(element1b);
    text = document.createTextNode("Test executed successfully!!");
    element1b.appendChild(text);
    var element1c = document.createElement("element1");
    doc.appendChild(element1c);
    text = document.createTextNode("Wrong node selected!!");
    element1c.appendChild(text);

    domTestHelper.arrayEqual(assert, [element1b],
            xpath.evaluate("element1[(((((2*10)-4)+9) div 5) mod floor(3))]", document, doc).nodes);
  });

  specify("NIST_locationPath009", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1a = document.createElement("element1");
    doc.appendChild(element1a);
    var text = document.createTextNode("Wrong node selected!!");
    element1a.appendChild(text);
    var element1b = document.createElement("element1");
    doc.appendChild(element1b);
    text = document.createTextNode("Test executed successfully!!");
    element1b.appendChild(text);
    var element1c = document.createElement("element1");
    doc.appendChild(element1c);
    text = document.createTextNode("Wrong node selected!!");
    element1c.appendChild(text);

    domTestHelper.arrayEqual(assert, [element1b],
            xpath.evaluate("element1[floor(2)]", document, doc).nodes);
  });

  specify("NIST_locationPath010", function() {
    const document = (new JSDOM("<doc/>", { contentType: "application/xml" })).window.document;
    var doc = document.documentElement;
    var element1a = document.createElement("element1");
    doc.appendChild(element1a);
    var text = document.createTextNode("Wrong Node Selected!!");
    element1a.appendChild(text);
    var element1b = document.createElement("element1");
    doc.appendChild(element1b);
    var child1a = document.createElement("child1");
    element1b.appendChild(child1a);
    text = document.createTextNode("Wrong Node Selected!!");
    child1a.appendChild(text);
    var child1b = document.createElement("child1");
    element1b.appendChild(child1b);
    text = document.createTextNode("Wrong Node Selected!!");
    child1b.appendChild(text);
    var child1c = document.createElement("child1");
    element1b.appendChild(child1c);
    text = document.createTextNode("Test Executed Successfully!!");
    child1c.appendChild(text);
    var element1c = document.createElement("element1");
    doc.appendChild(element1c);
    text = document.createTextNode("Wrong Node Selected!!");
    element1c.appendChild(text);

    domTestHelper.arrayEqual(assert, [child1c],
            xpath.evaluate("doc/element1[(((((2*10)-4)+9) div 5) mod 3)]/child1[last()]", document, document).nodes);
  });
});
