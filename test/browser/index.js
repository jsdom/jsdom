exports.tests = {

  notfound_getelementsbyclassname : function() {

      var doc = new browser.Document();

      var html = doc.createElement("html");
      doc.appendChild(html);

      var body = doc.createElement("body");
      html.appendChild(body);

      var p = doc.createElement("p");
      p.className = "unknown";
      body.appendChild(p);

      var elements = doc.getElementsByClassName("first-p");
      assertEquals("no results", 0, elements.length);
  },


  basic_getelementsbyclassname : function() {

      var doc = new browser.Document();

      var html = doc.createElement("html");
      doc.appendChild(html);

      var body = doc.createElement("body");
      html.appendChild(body);

      var p = doc.createElement("p");
      p.className = "first-p";
      body.appendChild(p);

      var elements = doc.getElementsByClassName("first-p");
      assertSame("p and first-p", p, elements.item(0));
  },

  multiple_getelementsbyclassname : function() {

      var doc = new browser.Document();

      var html = doc.createElement("html");
      doc.appendChild(html);

      var body = doc.createElement("body");
      html.appendChild(body);

      var p = doc.createElement("p");
      p.className = "first-p second third";
      body.appendChild(p);

      var first = doc.getElementsByClassName("first-p");
      assertSame("p and first-p", p, first.item(0));

      var second = doc.getElementsByClassName("second");
      assertSame("p and second", p, second.item(0));

      var third = doc.getElementsByClassName("third");
      assertSame("p and third", p, third.item(0));
  },

  testclassnameworksasexpected : function() {
      var doc = new browser.Document();
      var p = doc.createElement("p");
      p.setAttribute("class", "first-p");
      assertSame("class attribute is same as className", p.className,"first-p");

      p.className += " second";
      assertSame("className getter/setter", p.className,"first-p second");
  },

  basic_getelementbyid : function() {

      var doc = new browser.Document();

      var html = doc.createElement("html");
      doc.appendChild(html);

      var body = doc.createElement("body");
      html.appendChild(body);

      var p = doc.createElement("p");
      p.id = "theid";
      body.appendChild(p);

      var element = doc.getElementById("theid");
      assertSame("p and #theid", p, element);
  },
  nonexistant_getelementbyid : function() {

      var doc = new browser.Document();

      var html = doc.createElement("html");
      doc.appendChild(html);

      var body = doc.createElement("body");
      html.appendChild(body);

      var p = doc.createElement("p");
      p.id = "theid";
      body.appendChild(p);

      var element = doc.getElementById("non-existant-id");
      assertSame("p and #theid", null, element);
  },
  remove_nonexistantattribute : function() {
      var doc = new browser.Document();

      var html = doc.createElement("html");
      doc.appendChild(html);

      var body = doc.createElement("body");
      html.appendChild(body);

      exception = false;
      try {
        removedNode = body.removeAttribute("non-existant");
      }
      catch(ex) {
        exception = true;
      }
      assertFalse("setValue_throws_NO_MODIFICATION_ERR", exception);
  },
  render_singletag : function() {
      var doc = new browser.Document();

      var p = doc.createElement("p");

      var img = doc.createElement("img");
      p.appendChild(img);
      var out = p.outerHTML;
      assertNull("end tag not included in output", out.match(/<\/img>/));
  },
  parse_scripttags : function() {
    var doc = new browser.Document();

    var head = doc.createElement("head");
    var scriptHtml = '<script>alert("hello world")</script>';
    head.innerHTML = scriptHtml;

    assertEquals("original and processed", head.innerHTML, scriptHtml);

  },
  parse_styletags : function() {
    var doc = new browser.Document();

    var head = doc.createElement("head");
    var styleHtml = '<style>body: {color: #fff;}</style>';
    head.innerHTML = styleHtml;

    assertEquals("original and processed", head.innerHTML, styleHtml);

  },
  parse_doublespacetags : function() {
    var doc = new browser.Document();

    var html = '<html><body  class="testing" /></html>';

    exception = false;
    try {
      doc.innerHTML = html;
    }
    catch(ex) {
      exception = true;
    }
    assertFalse("setValue_throws_INVALID_CHARACTER_ERR", exception);
  },
  serialize_styleattribute : function() {
    var doc = new browser.Document();
    doc.appendChild(doc.createElement('html'));
    doc.documentElement.style.color = 'black';
    doc.documentElement.style.backgroundColor = 'white';
    assertEquals('',
              '<html style="color: black; background-color: white"></html>\n',
              require('../../lib/jsdom/browser/domtohtml').domToHtml(doc));
  },
  innerhtml_removeallchildren: function() {
    var doc = new browser.HTMLDocument();
    doc.write('<html><body><p></p><p></p></body></html>');
    doc.body.innerHTML = '';
    assertTrue('still has children', doc.body.childNodes.length == 0);
  },
  serialize_html5_doctype : function () {
    var dom = new browser.DOMImplementation();
    var doctype = dom.createDocumentType('html');
    var document = dom.createDocument(null, null, doctype);
    assertTrue('HTML 5 doctype did not serialize correctly',
        /^\s*<!DOCTYPE html>/.test(document.outerHTML));
  },
  serialize_html4_strict_doctype : function () {
    var dom = new browser.DOMImplementation();
    var doctype = dom.createDocumentType('html',
        '-//W3C//DTD HTML 4.01//EN',
        'http://www.w3.org/TR/html4/strict.dtd');
    var document = dom.createDocument(null, null, doctype);
    assertTrue('HTML 4 strict doctype did not serialize correctly',
        /^\s*<!DOCTYPE html PUBLIC "-\/\/W3C\/\/DTD HTML 4.01\/\/EN" "http:\/\/www.w3.org\/TR\/html4\/strict.dtd">/.
            test(document.outerHTML));
  },
  serialize_system_doctype : function () {
    var dom = new browser.DOMImplementation();
    var doctype = dom.createDocumentType('foo', null, 'foo.dtd');
    var document = dom.createDocument(null, null, doctype);
    assertTrue('Doctype did not serialize correctly',
        /^\s*<!DOCTYPE foo SYSTEM "foo.dtd">/.test(document.outerHTML));
  },
  serialize_doctype_containing_quotes : function () {
    var dom = new browser.DOMImplementation();
    var doctype = dom.createDocumentType('foo', null, 'foo "bar".dtd');
    var document = dom.createDocument(null, null, doctype);
    assertTrue('Doctype did not serialize correctly',
        /^\s*<!DOCTYPE foo SYSTEM \'foo "bar".dtd\'>/.test(document.outerHTML));
  },
  parse_doctype_containing_newline : function() {
    var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"\n \
             "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html></html>',
        doc  = new browser.Document();
    doc.innerHTML = html;
    assertTrue('doctype should not be falsy', !!doc.doctype);
  },
  basic_nodelist_indexOf : function() {
    var doc = new browser.Document();

    var html = doc.createElement("html");
    doc.appendChild(html);

    var body = doc.createElement("body");
    html.appendChild(body);

    var p = doc.createElement("p");
    body.appendChild(p);

    var div = doc.createElement("div");
    body.appendChild(div);

    var span = doc.createElement("span");
    body.appendChild(span);

    var index = body.childNodes.indexOf(span);
    assertEquals("indexOf 'span' in childNodes", 2, index);
  },
  nonexistant_nodelist_indexOf : function() {
    var doc = new browser.Document();

    var html = doc.createElement("html");
    doc.appendChild(html);

    var body = doc.createElement("body");
    html.appendChild(body);

    var p = doc.createElement("p");
    body.appendChild(p);

    var div = doc.createElement("div");
    p.appendChild(div);

    var index = body.childNodes.indexOf(div);
    assertEquals("indexOf 'span' in childNodes", -1, index);
  }
};
