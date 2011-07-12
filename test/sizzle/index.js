var jsdom        = require('../../lib/jsdom');
var fs           = require('fs');
var jqueryString = fs.readFileSync(__dirname + '/support/jquery-1.6.2.js', 'utf-8');
var testFile     = fs.readFileSync(__dirname + '/files/index.html', 'utf-8');
var qunit        = require('./support/qunit').QUnit;

function test(fn) {
  // return a nodeunit compatible test case
  return function(test) {
    jsdom.env({
      html : testFile,
      src  : jqueryString,
      done : function(e, window) {
        var jQuery = window.jQuery;
        var document = window.document;

        /**
         * Returns an array of elements with the given IDs, eg.
         * @example q("main", "foo", "bar")
         * @result [<div id="main">, <span id="foo">, <input id="bar">]
         */
        function q() {
          var r = [];
          for ( var i = 0; i < arguments.length; i++ ) {
            r.push( document.getElementById( arguments[i] ) );
          }
          return r;
        }

        /**
         * Asserts that a select matches the given IDs * @example t(test,"Check for something", "//[a]", ["foo", "baar"]);
         * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
         */
        function t(a,b,c) {
          var f = jQuery(b).get(), s = "";

          for ( var i = 0; i < f.length; i++ ) {
            s += (s && ",") + '"' + f[i].id + '"';
          }

          var e = qunit.equiv(f, q.apply(q,c));
          test.strictEqual(e, true,  a + " (" + b + ")");
        }

        fn(test, window, jQuery, document, q, t);
      }
    });
  }
}




/**
 * Add random number to url to stop IE from caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url(value) {
  return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random()*100000);
}

module.exports = {};
module.exports['element'] = test(function(test, window, jQuery, document, q, t) {
  var all = jQuery("*"), good = true;
  for ( var i = 0; i < all.length; i++ )
    if ( all[i].nodeType == 8 )
      good = false;

  test.ok( good, "Select all elements, no comment nodes" );
  t( "Element Selector", "#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
  t( "Element Selector", "body", ["body"] );
  t( "Element Selector", "html", ["html"] );
  t( "Parent Element", "div p", ["firstp","ap","sndp","en","sap","first"] );
  test.strictEqual( jQuery("param", "#object1").length, 2, "Object/param as context" );

  test.deepEqual( jQuery("p", document.getElementsByTagName("div")).get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );
  test.deepEqual( jQuery("p", "div").get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );
  test.deepEqual( jQuery("p", jQuery("div")).get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );
  test.deepEqual( jQuery("div").find("p").get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );

  test.deepEqual( jQuery("#form").find("select").get(), q("select1","select2","select3","select4","select5"), "Finding selects with a context." );

  test.ok( jQuery("#length").length, '&lt;input name="length"&gt; cannot be found under IE, see #945' );
  test.ok( jQuery("#lengthtest input").length, '&lt;input name="length"&gt; cannot be found under IE, see #945' );

  // Check for unique-ness and sort order
  test.deepEqual( jQuery("p, div p").get(), jQuery("p").get(), "Check for duplicates: p, div p" );

  t( "Checking sort order", "h2, h1", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
  t( "Checking sort order", "h2:first, h1:first", ["qunit-header", "qunit-banner"] );
  t( "Checking sort order", "#qunit-fixture p, #qunit-fixture p a", ["firstp", "simon1", "ap", "google", "groups", "anchor1", "mark", "sndp", "en", "yahoo", "sap", "anchor2", "simon", "first"] );

  // Test Conflict ID
  test.deepEqual( jQuery("#lengthtest").find("#idTest").get(), q("idTest"), "Finding element with id of ID." );
  test.deepEqual( jQuery("#lengthtest").find("[name='id']").get(), q("idTest"), "Finding element with id of ID." );
  test.deepEqual( jQuery("#lengthtest").find("input[id='idTest']").get(), q("idTest"), "Finding elements with a context." );
  test.done();
});
/*
if ( location.protocol != "file:" ) {
  module.exports['XML Document Selectors'] = test(function(test, window, jQuery, document, q, t) {
    stop();
    test.ok(false, "needs xmldocument");
    jQuery.get("data/with_fries.xml", function(xml) {
      test.strictEqual( jQuery("foo_bar", xml).length, 1, "Element Selector with underscore" );
      test.strictEqual( jQuery(".component", xml).length, 1, "Class selector" );
      test.strictEqual( jQuery("[class*=component]", xml).length, 1, "Attribute selector for class" );
      test.strictEqual( jQuery("property[name=prop2]", xml).length, 1, "Attribute selector with name" );
      test.strictEqual( jQuery("[name=prop2]", xml).length, 1, "Attribute selector with name" );
      test.strictEqual( jQuery("#seite1", xml).length, 1, "Attribute selector with ID" );
      test.strictEqual( jQuery("component#seite1", xml).length, 1, "Attribute selector with ID" );
      test.strictEqual( jQuery("component", xml).filter("#seite1").length, 1, "Attribute selector filter with ID" );
      test.ok( jQuery( xml.lastChild ).is( "soap\\:Envelope" ), "Check for namespaced element" );
      start();
      test.done();
    });
    test.done()
});
}*/

module.exports['broken'] = test(function(test, window, jQuery, document, q, t) {

  function broken(name, selector) {
    try {
      jQuery(selector);
      test.ok( false, name + ": " + selector );
    } catch(e){
      test.ok( typeof e === "string" && e.indexOf("Syntax error") >= 0,
        name + ": " + selector );
    }
  }

  broken( "Broken Selector", "[", [] );
  broken( "Broken Selector", "(", [] );
  broken( "Broken Selector", "{", [] );
  broken( "Broken Selector", "<", [] );
  broken( "Broken Selector", "()", [] );
  broken( "Broken Selector", "<>", [] );
  broken( "Broken Selector", "{}", [] );
  broken( "Doesn't exist", ":visble", [] );
  broken( "Nth-child", ":nth-child", [] );
  // Sigh again. IE 9 thinks this is also a real selector
  // not super critical that we fix this case
  //broken( "Nth-child", ":nth-child(-)", [] );
  // Sigh. WebKit thinks this is a real selector in qSA
  // They've already fixed this and it'll be coming into
  // current browsers soon.
  //broken( "Nth-child", ":nth-child(asdf)", [] );
  broken( "Nth-child", ":nth-child(2n+-0)", [] );
  broken( "Nth-child", ":nth-child(2+0)", [] );
  broken( "Nth-child", ":nth-child(- 1n)", [] );
  broken( "Nth-child", ":nth-child(-1 n)", [] );
  broken( "First-child", ":first-child(n)", [] );
  broken( "Last-child", ":last-child(n)", [] );
  broken( "Only-child", ":only-child(n)", [] );

  // Make sure attribute value quoting works correctly. See: #6093
  var attrbad = jQuery('<input type="hidden" value="2" name="foo.baz" id="attrbad1"/><input type="hidden" value="2" name="foo[baz]" id="attrbad2"/>').appendTo("body");

  broken( "Attribute not escaped", "input[name=foo.baz]", [] );
  broken( "Attribute not escaped", "input[name=foo[baz]]", [] );

  attrbad.remove();
  test.done()
});


module.exports['id'] = test(function(test, window, jQuery, document, q, t) {
  t( "ID Selector", "#body", ["body"] );
  t( "ID Selector w/ Element", "body#body", ["body"] );
  t( "ID Selector w/ Element", "ul#first", [] );
  t( "ID selector with existing ID descendant", "#firstp #simon1", ["simon1"] );
  t( "ID selector with non-existant descendant", "#firstp #foobar", [] );
  t( "ID selector using UTF8", "#台北Táiběi", ["台北Táiběi"] );
  t( "Multiple ID selectors using UTF8", "#台北Táiběi, #台北", ["台北Táiběi","台北"] );
  t( "Descendant ID selector using UTF8", "div #台北", ["台北"] );
  t( "Child ID selector using UTF8", "form > #台北", ["台北"] );

  t( "Escaped ID", "#foo\\:bar", ["foo:bar"] );
  t( "Escaped ID", "#test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
  t( "Descendant escaped ID", "div #foo\\:bar", ["foo:bar"] );
  t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
  t( "Child escaped ID", "form > #foo\\:bar", ["foo:bar"] );
  t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );

  t( "ID Selector, child ID present", "#form > #radio1", ["radio1"] ); // bug #267
  t( "ID Selector, not an ancestor ID", "#form #first", [] );
  t( "ID Selector, not a child ID", "#form > #option1a", [] );

  t( "All Children of ID", "#foo > *", ["sndp", "en", "sap"] );
  t( "All Children of ID with no children", "#firstUL > *", [] );

  var a = jQuery('<div><a name="tName1">tName1 A</a><a name="tName2">tName2 A</a><div id="tName1">tName1 Div</div></div>').appendTo('#qunit-fixture');
  test.strictEqual( jQuery("#tName1")[0].id, 'tName1', "ID selector with same value for a name attribute" );
  test.strictEqual( jQuery("#tName2").length, 0, "ID selector non-existing but name attribute on an A tag" );
  a.remove();

  t( "ID Selector on Form with an input that has a name of 'id'", "#lengthtest", ["lengthtest"] );

  t( "ID selector with non-existant ancestor", "#asdfasdf #foobar", [] ); // bug #986

  test.deepEqual( jQuery("body").find("div#form").get(), [], "ID selector within the context of another element" );

  //#7533
  test.strictEqual( jQuery("<div id=\"A'B~C.D[E]\"><p>foo</p></div>").find("p").length, 1, "Find where context root is a node and has an ID with CSS3 meta characters" );

  t( "Underscore ID", "#types_all", ["types_all"] );
  t( "Dash ID", "#fx-queue", ["fx-queue"] );

  t( "ID with weird characters in it", "#name\\+value", ["name+value"] );
  test.done()
});

module.exports['class'] = test(function(test, window, jQuery, document, q, t) {
  t( "Class Selector", ".blog", ["mark","simon"] );
  t( "Class Selector", ".GROUPS", ["groups"] );
  t( "Class Selector", ".blog.link", ["simon"] );
  t( "Class Selector w/ Element", "a.blog", ["mark","simon"] );
  t( "Parent Class Selector", "p .blog", ["mark","simon"] );

  test.deepEqual( jQuery(".blog", document.getElementsByTagName("p")).get(), q("mark", "simon"), "Finding elements with a context." );
  test.deepEqual( jQuery(".blog", "p").get(), q("mark", "simon"), "Finding elements with a context." );
  test.deepEqual( jQuery(".blog", jQuery("p")).get(), q("mark", "simon"), "Finding elements with a context." );
  test.deepEqual( jQuery("p").find(".blog").get(), q("mark", "simon"), "Finding elements with a context." );

  t( "Class selector using UTF8", ".台北Táiběi", ["utf8class1"] );
  //t( "Class selector using UTF8", ".台北", ["utf8class1","utf8class2"] );
  t( "Class selector using UTF8", ".台北Táiběi.台北", ["utf8class1"] );
  t( "Class selector using UTF8", ".台北Táiběi, .台北", ["utf8class1","utf8class2"] );
  t( "Descendant class selector using UTF8", "div .台北Táiběi", ["utf8class1"] );
  t( "Child class selector using UTF8", "form > .台北Táiběi", ["utf8class1"] );

  t( "Escaped Class", ".foo\\:bar", ["foo:bar"] );
  t( "Escaped Class", ".test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
  t( "Descendant scaped Class", "div .foo\\:bar", ["foo:bar"] );
  t( "Descendant scaped Class", "div .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
  t( "Child escaped Class", "form > .foo\\:bar", ["foo:bar"] );
  t( "Child escaped Class", "form > .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );

  var div = document.createElement("div");
  div.innerHTML = "<div class='test e'></div><div class='test'></div>";
  test.deepEqual( jQuery(".e", div).get(), [ div.firstChild ], "Finding a second class." );

  div.lastChild.className = "e";

  test.deepEqual( jQuery(".e", div).get(), [ div.firstChild, div.lastChild ], "Finding a modified class." );
  test.done()
});

module.exports['name'] = test(function(test, window, jQuery, document, q, t) {

  t( "Name selector", "input[name=action]", ["text1"] );
  t( "Name selector with single quotes", "input[name='action']", ["text1"] );
  t( "Name selector with double quotes", 'input[name="action"]', ["text1"] );

  t( "Name selector non-input", "[name=test]", ["length", "fx-queue"] );
  t( "Name selector non-input", "[name=div]", ["fadein"] );
  t( "Name selector non-input", "*[name=iframe]", ["iframe"] );

  t( "Name selector for grouped input", "input[name='types[]']", ["types_all", "types_anime", "types_movie"] )

  test.deepEqual( jQuery("#form").find("input[name=action]").get(), q("text1"), "Name selector within the context of another element" );
  test.deepEqual( jQuery("#form").find("input[name='foo[bar]']").get(), q("hidden2"), "Name selector for grouped form element within the context of another element" );

  var form = jQuery("<form><input name='id'/></form>").appendTo("body");

  test.strictEqual( form.find("input").length, 1, "Make sure that rooted queries on forms (with possible expandos) work." );

  form.remove();

  var a = jQuery('<div><a id="tName1ID" name="tName1">tName1 A</a><a id="tName2ID" name="tName2">tName2 A</a><div id="tName1">tName1 Div</div></div>').appendTo('#qunit-fixture').children();

  test.strictEqual( a.length, 3, "Make sure the right number of elements were inserted." );
  test.strictEqual( a[1].id, "tName2ID", "Make sure the right number of elements were inserted." );

  test.strictEqual( jQuery("[name=tName1]")[0], a[0], "Find elements that have similar IDs" );
  test.strictEqual( jQuery("[name=tName2]")[0], a[1], "Find elements that have similar IDs" );
  t( "Find elements that have similar IDs", "#tName2ID", ["tName2ID"] );

  a.remove();
  test.done()
});

module.exports['multiple'] = test(function(test, window, jQuery, document, q, t) {

  t( "Comma Support", "h2, #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"]);
  t( "Comma Support", "h2 , #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"]);
  t( "Comma Support", "h2 , #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"]);
  t( "Comma Support", "h2,#qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"]);
  test.done()
});

module.exports['child and adjacent'] = test(function(test, window, jQuery, document, q, t) {
  t( "Child", "p > a", ["simon1","google","groups","mark","yahoo","simon"] );
  t( "Child", "p> a", ["simon1","google","groups","mark","yahoo","simon"] );
  t( "Child", "p >a", ["simon1","google","groups","mark","yahoo","simon"] );
  t( "Child", "p>a", ["simon1","google","groups","mark","yahoo","simon"] );
  t( "Child w/ Class", "p > a.blog", ["mark","simon"] );
  t( "All Children", "code > *", ["anchor1","anchor2"] );
  t( "All Grandchildren", "p > * > *", ["anchor1","anchor2"] );
  t( "Adjacent", "#qunit-fixture a + a", ["groups"] );
  t( "Adjacent", "#qunit-fixture a +a", ["groups"] );
  t( "Adjacent", "#qunit-fixture a+ a", ["groups"] );
  t( "Adjacent", "#qunit-fixture a+a", ["groups"] );
  t( "Adjacent", "p + p", ["ap","en","sap"] );
  t( "Adjacent", "p#firstp + p", ["ap"] );
  t( "Adjacent", "p[lang=en] + p", ["sap"] );
  t( "Adjacent", "a.GROUPS + code + a", ["mark"] );
  t( "Comma, Child, and Adjacent", "#qunit-fixture a + a, code > a", ["groups","anchor1","anchor2"] );
  t( "Element Preceded By", "#qunit-fixture p ~ div", ["foo", "moretests","tabindex-tests", "liveHandlerOrder", "siblingTest"] );
  t( "Element Preceded By", "#first ~ div", ["moretests","tabindex-tests", "liveHandlerOrder", "siblingTest"] );
  t( "Element Preceded By", "#groups ~ a", ["mark"] );
  t( "Element Preceded By", "#length ~ input", ["idTest"] );
  t( "Element Preceded By", "#siblingfirst ~ em", ["siblingnext"] );
  test.deepEqual( jQuery("#siblingfirst").find("~ em").get(), q("siblingnext"), "Element Preceded By with a context." );
  test.deepEqual( jQuery("#siblingfirst").find("+ em").get(), q("siblingnext"), "Element Directly Preceded By with a context." );

  test.strictEqual( jQuery("#listWithTabIndex").length, 1, "Parent div for next test is found via ID (#8310)" );
  test.strictEqual( jQuery("#listWithTabIndex li:eq(2) ~ li").length, 1, "Find by general sibling combinator (#8310)" );
  test.strictEqual( jQuery("#__sizzle__").length, 0, "Make sure the temporary id assigned by sizzle is cleared out (#8310)" );
  test.strictEqual( jQuery("#listWithTabIndex").length, 1, "Parent div for previous test is still found via ID (#8310)" );

  t( "Verify deep class selector", "div.blah > p > a", [] );

  t( "No element deep selector", "div.foo > span > a", [] );

  test.deepEqual( jQuery("> :first", document.getElementById("nothiddendiv")).get(), q("nothiddendivchild"), "Verify child context positional selctor" );
  test.deepEqual( jQuery("> :eq(0)", document.getElementById("nothiddendiv")).get(), q("nothiddendivchild"), "Verify child context positional selctor" );
  test.deepEqual( jQuery("> *:first", document.getElementById("nothiddendiv")).get(), q("nothiddendivchild"), "Verify child context positional selctor" );

  t( "Non-existant ancestors", ".fototab > .thumbnails > a", [] );
  test.done()
});

module.exports['attributes'] = test(function(test, window, jQuery, document, q, t) {

  t( "Attribute Exists", "a[title]", ["google"] );
  t( "Attribute Exists", "*[title]", ["google"] );
  t( "Attribute Exists", "[title]", ["google"] );
  t( "Attribute Exists", "a[ title ]", ["google"] );

  t( "Attribute Equals", "a[rel='bookmark']", ["simon1"] );
  t( "Attribute Equals", 'a[rel="bookmark"]', ["simon1"] );
  t( "Attribute Equals", "a[rel=bookmark]", ["simon1"] );
  t( "Attribute Equals", "a[href='http://www.google.com/']", ["google"] );
  t( "Attribute Equals", "a[ rel = 'bookmark' ]", ["simon1"] );

  document.getElementById("anchor2").href = "#2";
  t( "href Attribute", "p a[href^=#]", ["anchor2"] );
  t( "href Attribute", "p a[href*=#]", ["simon1", "anchor2"] );

  t( "for Attribute", "form label[for]", ["label-for"] );
  t( "for Attribute in form", "#form [for=action]", ["label-for"] );

  t( "Attribute containing []", "input[name^='foo[']", ["hidden2"] );
  t( "Attribute containing []", "input[name^='foo[bar]']", ["hidden2"] );
  t( "Attribute containing []", "input[name*='[bar]']", ["hidden2"] );
  t( "Attribute containing []", "input[name$='bar]']", ["hidden2"] );
  t( "Attribute containing []", "input[name$='[bar]']", ["hidden2"] );
  t( "Attribute containing []", "input[name$='foo[bar]']", ["hidden2"] );
  t( "Attribute containing []", "input[name*='foo[bar]']", ["hidden2"] );

  t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type='hidden']", ["radio1", "radio2", "hidden1"] );
  t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=\"hidden\"]", ["radio1", "radio2", "hidden1"] );
  t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=hidden]", ["radio1", "radio2", "hidden1"] );

  t( "Attribute selector using UTF8", "span[lang=中文]", ["台北"] );

  t( "Attribute Begins With", "a[href ^= 'http://www']", ["google","yahoo"] );
  t( "Attribute Ends With", "a[href $= 'org/']", ["mark"] );
  t( "Attribute Contains", "a[href *= 'google']", ["google","groups"] );
  t( "Attribute Is Not Equal", "#ap a[hreflang!='en']", ["google","groups","anchor1"] );

  var opt = document.getElementById("option1a"),
    match = (window.Sizzle || window.jQuery.find).matchesSelector;

  opt.setAttribute("test", "");

  test.ok( match( opt, "[id*=option1][type!=checkbox]" ), "Attribute Is Not Equal Matches" );
  test.ok( match( opt, "[id*=option1]" ), "Attribute With No Quotes Contains Matches" );
  test.ok( match( opt, "[test=]" ), "Attribute With No Quotes No Content Matches" );
  test.ok( match( opt, "[id=option1a]" ), "Attribute With No Quotes Equals Matches" );
  test.ok( match( document.getElementById("simon1"), "a[href*=#]" ), "Attribute With No Quotes Href Contains Matches" );
  return test.done();
  t("Empty values", "#select1 option[value='']", ["option1a"]);
  t("Empty values", "#select1 option[value!='']", ["option1b","option1c","option1d"]);

  t("Select options via :selected", "#select1 option:selected", ["option1a"] );
  t("Select options via :selected", "#select2 option:selected", ["option2d"] );
  t("Select options via :selected", "#select3 option:selected", ["option3b", "option3c"] );

  t( "Grouped Form Elements", "input[name='foo[bar]']", ["hidden2"] );

  // Make sure attribute value quoting works correctly. See: #6093
  var attrbad = jQuery('<input type="hidden" value="2" name="foo.baz" id="attrbad1"/><input type="hidden" value="2" name="foo[baz]" id="attrbad2"/>').appendTo("body");

  t("Find escaped attribute value", "input[name=foo\\.baz]", ["attrbad1"]);
  t("Find escaped attribute value", "input[name=foo\\[baz\\]]", ["attrbad2"]);

  t("input[type=text]", "#form input[type=text]", ["text1", "text2", "hidden2", "name"]);
  t("input[type=search]", "#form input[type=search]", ["search"]);

  attrbad.remove();

  //#6428
  t("Find escaped attribute value", "#form input[name=foo\\[bar\\]]", ["hidden2"]);

  //#3279
  var div = document.createElement("div");
  div.innerHTML = "<div id='foo' xml:test='something'></div>";

  test.deepEqual( jQuery( "[xml\\:test]", div ).get(), [ div.firstChild ], "Finding by attribute with escaped characters." );
  test.done()
});

module.exports['pseudo - child'] = test(function(test, window, jQuery, document, q, t) {
  t( "First Child", "#qunit-fixture p:first-child", ["firstp","sndp"] );
  t( "Last Child", "p:last-child", ["sap"] );
  t( "Only Child", "#qunit-fixture a:only-child", ["simon1","anchor1","yahoo","anchor2","liveLink1","liveLink2"] );
  t( "Empty", "ul:empty", ["firstUL"] );
  t( "Is A Parent", "#qunit-fixture p:parent", ["firstp","ap","sndp","en","sap","first"] );

  t( "First Child", "p:first-child", ["firstp","sndp"] );
  t( "Nth Child", "p:nth-child(1)", ["firstp","sndp"] );
  t( "Nth Child With Whitespace", "p:nth-child( 1 )", ["firstp","sndp"] );
  t( "Not Nth Child", "#qunit-fixture p:not(:nth-child(1))", ["ap","en","sap","first"] );

  // Verify that the child position isn't being cached improperly
  jQuery("p:first-child").after("<div></div>");
  jQuery("p:first-child").before("<div></div>").next().remove();

  t( "First Child", "p:first-child", [] );


  t( "Last Child", "p:last-child", ["sap"] );
  t( "Last Child", "#qunit-fixture a:last-child", ["simon1","anchor1","mark","yahoo","anchor2","simon","liveLink1","liveLink2"] );

  t( "Nth-child", "#qunit-fixture form#form > *:nth-child(2)", ["text1"] );
  t( "Nth-child", "#qunit-fixture form#form > :nth-child(2)", ["text1"] );

  t( "Nth-child", "#form select:first option:nth-child(-1)", [] );
  t( "Nth-child", "#form select:first option:nth-child(3)", ["option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(0n+3)", ["option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(1n+0)", ["option1a", "option1b", "option1c", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(1n)", ["option1a", "option1b", "option1c", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(n)", ["option1a", "option1b", "option1c", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(+n)", ["option1a", "option1b", "option1c", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(even)", ["option1b", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(odd)", ["option1a", "option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(2n)", ["option1b", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(2n+1)", ["option1a", "option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(2n + 1)", ["option1a", "option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(+2n + 1)", ["option1a", "option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(3n)", ["option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(3n+1)", ["option1a", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(3n+2)", ["option1b"] );
  t( "Nth-child", "#form select:first option:nth-child(3n+3)", ["option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(3n-1)", ["option1b"] );
  t( "Nth-child", "#form select:first option:nth-child(3n-2)", ["option1a", "option1d"] );
  t( "Nth-child", "#form select:first option:nth-child(3n-3)", ["option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(3n+0)", ["option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(-1n+3)", ["option1a", "option1b", "option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(-n+3)", ["option1a", "option1b", "option1c"] );
  t( "Nth-child", "#form select:first option:nth-child(-1n + 3)", ["option1a", "option1b", "option1c"] );
  test.done()
});

module.exports['pseudo - misc'] = test(function(test, window, jQuery, document, q, t) {

  t( "Headers", ":header", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
  t( "Has Children - :has()", "p:has(a)", ["firstp","ap","en","sap"] );

  var select = document.getElementById("select1");
  test.ok( (window.Sizzle || window.jQuery.find).matchesSelector( select, ":has(option)" ), "Has Option Matches" );

  t( "Text Contains", "a:contains(Google)", ["google","groups"] );
  t( "Text Contains", "a:contains(Google Groups)", ["groups"] );

  t( "Text Contains", "a:contains(Google Groups (Link))", ["groups"] );
  t( "Text Contains", "a:contains((Link))", ["groups"] );

  var tmp = document.createElement("div");
  tmp.id = "tmp_input";
  document.body.appendChild( tmp );

  jQuery.each( [ "button", "submit", "reset" ], function( i, type ) {
    jQuery( tmp ).append(
      "<input id='input_T' type='T'/><button id='button_T' type='T'>test</button>".replace(/T/g, type) );

    t( "Input Buttons :" + type, "#tmp_input :" + type, [ "input_" + type, "button_" + type ] );

    test.ok( (window.Sizzle || window.jQuery.find).matchesSelector( jQuery("#input_" + type)[0], ":" + type ), "Input Matches :" + type );
    test.ok( (window.Sizzle || window.jQuery.find).matchesSelector( jQuery("#button_" + type)[0], ":" + type ), "Button Matches :" + type );
  });
  document.body.removeChild( tmp );

  var input = document.createElement("input");
  input.type = "text";
  input.id = "focus-input";

  document.body.appendChild( input );

  input.focus();
 
  t( "Element focused", "input:focus", [ "focus-input" ] );

  test.ok( (window.Sizzle || window.jQuery.find).matchesSelector( input, ":focus" ), ":focus Matches" );

  input.blur();
  test.ok( !(window.Sizzle || window.jQuery.find).matchesSelector( input, ":focus" ), ":focus Doesn't Match" );

  document.body.removeChild( input );
  test.done()
});


module.exports['pseudo - :not'] = test(function(test, window, jQuery, document, q, t) {
  t( "Not", "a.blog:not(.link)", ["mark"] );

  t( "Not - multiple", "#form option:not(:contains(Nothing),#option1b,:selected)", ["option1c", "option1d", "option2b", "option2c", "option3d", "option3e", "option4e", "option5b", "option5c"] );
  t( "Not - recursive", "#form option:not(:not(:selected))[id^='option3']", [ "option3b", "option3c"] );

  t( ":not() failing interior", "#qunit-fixture p:not(.foo)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not() failing interior", "#qunit-fixture p:not(div.foo)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not() failing interior", "#qunit-fixture p:not(p.foo)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not() failing interior", "#qunit-fixture p:not(#blargh)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not() failing interior", "#qunit-fixture p:not(div#blargh)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not() failing interior", "#qunit-fixture p:not(p#blargh)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not Multiple", "#qunit-fixture p:not(a)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not Multiple", "#qunit-fixture p:not(a, b)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not Multiple", "#qunit-fixture p:not(a, b, div)", ["firstp","ap","sndp","en","sap","first"] );
  t( ":not Multiple", "p:not(p)", [] );
  t( ":not Multiple", "p:not(a,p)", [] );
  t( ":not Multiple", "p:not(p,a)", [] );
  t( ":not Multiple", "p:not(a,p,b)", [] );
  t( ":not Multiple", ":input:not(:image,:input,:submit)", [] );

  t( "No element not selector", ".container div:not(.excluded) div", [] );

  t( ":not() Existing attribute", "#form select:not([multiple])", ["select1", "select2", "select5"]);
  t( ":not() Equals attribute", "#form select:not([name=select1])", ["select2", "select3", "select4","select5"]);
  t( ":not() Equals quoted attribute", "#form select:not([name='select1'])", ["select2", "select3", "select4", "select5"]);

  t( ":not() Multiple Class", "#foo a:not(.blog)", ["yahoo","anchor2"] );
  t( ":not() Multiple Class", "#foo a:not(.link)", ["yahoo","anchor2"] );
  t( ":not() Multiple Class", "#foo a:not(.blog.link)", ["yahoo","anchor2"] );
  test.done()
});

module.exports['pseudo - position'] = test(function(test, window, jQuery, document, q, t) {
  t( "nth Element", "#qunit-fixture p:nth(1)", ["ap"] );
  t( "First Element", "#qunit-fixture p:first", ["firstp"] );
  t( "Last Element", "p:last", ["first"] );
  t( "Even Elements", "#qunit-fixture p:even", ["firstp","sndp","sap"] );
  t( "Odd Elements", "#qunit-fixture p:odd", ["ap","en","first"] );
  t( "Position Equals", "#qunit-fixture p:eq(1)", ["ap"] );
  t( "Position Greater Than", "#qunit-fixture p:gt(0)", ["ap","sndp","en","sap","first"] );
  t( "Position Less Than", "#qunit-fixture p:lt(3)", ["firstp","ap","sndp"] );

  t( "Check position filtering", "div#nothiddendiv:eq(0)", ["nothiddendiv"] );
  t( "Check position filtering", "div#nothiddendiv:last", ["nothiddendiv"] );
  t( "Check position filtering", "div#nothiddendiv:not(:gt(0))", ["nothiddendiv"] );
  t( "Check position filtering", "#foo > :not(:first)", ["en", "sap"] );
  t( "Check position filtering", "select > :not(:gt(2))", ["option1a", "option1b", "option1c"] );
  t( "Check position filtering", "select:lt(2) :not(:first)", ["option1b", "option1c", "option1d", "option2a", "option2b", "option2c", "option2d"] );
  t( "Check position filtering", "div.nothiddendiv:eq(0)", ["nothiddendiv"] );
  t( "Check position filtering", "div.nothiddendiv:last", ["nothiddendiv"] );
  t( "Check position filtering", "div.nothiddendiv:not(:lt(0))", ["nothiddendiv"] );

  t( "Check element position", "div div:eq(0)", ["nothiddendivchild"] );
  t( "Check element position", "div div:eq(5)", ["t2037"] );
  t( "Check element position", "div div:eq(28)", ["hide"] );
  t( "Check element position", "div div:first", ["nothiddendivchild"] );
  t( "Check element position", "div > div:first", ["nothiddendivchild"] );
  t( "Check element position", "#dl div:first div:first", ["foo"] );
  t( "Check element position", "#dl div:first > div:first", ["foo"] );
  t( "Check element position", "div#nothiddendiv:first > div:first", ["nothiddendivchild"] );
  test.done()
});

module.exports['pseudo - visibility'] = test(function(test, window, jQuery, document, q, t) {

  if ( (window.Sizzle || jQuery.find).selectors.filters.visibility ) {
    t( "Is Visible", "#form input:visible", [] );
    t( "Is Visible", "div:visible:not(#qunit-testrunner-toolbar):lt(2)", ["nothiddendiv", "nothiddendivchild"] );
    t( "Is Hidden", "#form input:hidden", ["text1","text2","radio1","radio2","check1","check2","hidden1","hidden2","name","search"] );
    t( "Is Hidden", "#qunit-fixture:hidden", ["main"] );
    t( "Is Hidden", "#dl:hidden", ["dl"] );

    var $div = jQuery('<div/>').appendTo("body");
    $div.css({ fontSize: 0, lineHeight: 0});
    // IE also needs to set font-size and line-height to 0
    $div.width(1).height(0);
    t( "Is Visible", '#nothiddendivchild:visible', ['nothiddendivchild'] );
    t( "Is Not Visible", '#nothiddendivchild:hidden', [] );
    $div.width(0).height(1);
    t( "Is Visible", '#nothiddendivchild:visible', ['nothiddendivchild'] );
    t( "Is Not Visible", '#nothiddendivchild:hidden', [] );
    $div.width(1).height(1);
    t( "Is Visible", '#nothiddendivchild:visible', ['nothiddendivchild'] );
    t( "Is Not Visible", '#nothiddendivchild:hidden', [] );
    $div.remove();
  }
  test.done()
});

module.exports['pseudo - form'] = test(function(test, window, jQuery, document, q, t) {

  var implied = jQuery('<input id="impliedText"/>').appendTo("#form");

  t( "Form element :input", "#form :input", ["text1", "text2", "radio1", "radio2", "check1", "check2", "hidden1", "hidden2", "name", "search", "button", "area1", "select1", "select2", "select3", "select4", "select5", "impliedText"] );
  t( "Form element :radio", "#form :radio", ["radio1", "radio2"] );
  t( "Form element :checkbox", "#form :checkbox", ["check1", "check2"] );
  t( "Form element :text", "#form :text", ["text1", "text2", "hidden2", "name", "impliedText"] );
  t( "Form element :radio:checked", "#form :radio:checked", ["radio2"] );
  t( "Form element :checkbox:checked", "#form :checkbox:checked", ["check1"] );
  t( "Form element :radio:checked, :checkbox:checked", "#form :radio:checked, #form :checkbox:checked", ["radio2", "check1"] );

  t( "Selected Option Element", "#form option:selected", ["option1a","option2d","option3b","option3c","option4b","option4c","option4d","option5a"] );

  implied.remove();
  test.done()
});

module.exports['disconnected nodes'] = test(function(test, window, jQuery, document, q, t) {
  var $opt = jQuery('<option></option>').attr("value", "whipit").appendTo("#qunit-fixture").detach();
  test.strictEqual( $opt.val(), "whipit", "option value" );
  test.strictEqual( $opt.is(":selected"), false, "unselected option" );
  $opt.attr("selected", true);
  test.strictEqual( $opt.is(":selected"), true, "selected option" );

  var $div = jQuery( '<div/>' );
  test.strictEqual( $div.is("div"), true, "Make sure .is('nodeName') works on disconnect nodes." );
  test.done()
});
