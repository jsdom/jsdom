const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../../..");
const toPathname = require("../../util.js").toPathname(__dirname);
const toFileUrl = require("../../util.js").toFileUrl(__dirname);
const load = require("../../util.js").load(__dirname +  "/html/");

function getImplementation() {
  return (new JSDOM()).window.document.implementation;
}

describe("level2/html", { skipIfBrowser: true }, () => {
  /**
   *
   The accessKey attribute is a single character access key to give
   access to the form control.
   Retrieve the accessKey attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89647724
   */
  specify("HTMLAnchorElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "g", "accessKeyLink");
  });

  /**
   *
   The charset attribute indicates the character encoding of the linked
   resource.
   Retrieve the charset attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67619266
   */
  specify("HTMLAnchorElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharset;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcharset = testNode.charset;
    assert.equal(vcharset, "US-ASCII", "charsetLink");
  });

  /**
   *
   The coords attribute is a comma-seperated list of lengths, defining
   an active region geometry.
   Retrieve the coords attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92079539
   */
  specify("HTMLAnchorElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vcoords;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcoords = testNode.coords;
    assert.equal(vcoords, "0,0,100,100", "coordsLink");
  });

  /**
   *
   The href attribute contains the URL of the linked resource.
   Retrieve the href attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88517319
   */
  specify("HTMLAnchorElement04", () => {
    var doc = load("anchor");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).href, toFileUrl('html/files/pix/submit.gif'), 'hrefLink');
  });

  /**
   *
   The hreflang attribute contains the language code of the linked resource.
   Retrieve the hreflang attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87358513
   */
  specify("HTMLAnchorElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vhreflink;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vhreflink = testNode.hreflang;
    assert.equal(vhreflink, "en", "hreflangLink");
  });

  /**
   *
   The name attribute contains the anchor name.
   Retrieve the name attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32783304
   */
  specify("HTMLAnchorElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "Anchor", "nameLink");
  });

  /**
   *
   The rel attribute contains the forward link type.
   Retrieve the rel attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-3815891
   */
  specify("HTMLAnchorElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vrel;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vrel = testNode.rel;
    assert.equal(vrel, "GLOSSARY", "relLink");
  });

  /**
   *
   The rev attribute contains the reverse link type
   Retrieve the rev attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58259771
   */
  specify("HTMLAnchorElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vrev;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vrev = testNode.rev;
    assert.equal(vrev, "STYLESHEET", "revLink");
  });

  /**
   *
   The shape attribute contains the shape of the active area.
   Retrieve the shape attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-49899808
   */
  specify("HTMLAnchorElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vshape;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vshape = testNode.shape;
    assert.equal(vshape, "rect", "shapeLink");
  });

  /**
   *
   The tabIndex attribute contains an index that represents the elements
   position in the tabbing order.
   Retrieve the tabIndex attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-41586466
   */
  specify("HTMLAnchorElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 22, "tabIndexLink");
  });

  /**
   *
   The target attribute specifies the frame to render the source in.
   Retrieve the target attribute and examine it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6414197
   */
  specify("HTMLAnchorElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vtarget;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor2");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtarget = testNode.target;
    assert.equal(vtarget, "dynamic", "targetLink");
  });

  /**
   *
   The type attribute contains the advisory content model.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63938221
   */
  specify("HTMLAnchorElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "image/gif", "typeLink");
  });

  /**
   *
   HTMLAnchorElement.blur should surrender input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-65068939
   */
  specify("HTMLAnchorElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    testNode.blur();
  });

  /**
   *
   HTMLAnchorElement.focus should capture input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47150313
   */
  specify("HTMLAnchorElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    testNode.focus();
  });

  /**
   *
   HTMLAnchorElement.hostname should show the hostname of the href when relative
   * @author Avi Deitcher
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement15", () => {
    var doc = load("anchor2");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).hostname, '', 'a.hostname relative');
  });

  /**
   *
   HTMLAnchorElement.hostname should show the hostname of the href when absolute
   * @author Avi Deitcher
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement16", () => {
    var doc = load("anchor3");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).hostname, 'www.github.com', 'a.hostname absolute');
  });

  /**
   *
   HTMLAnchorElement.pathname should show the pathname of the href
   * @author Avi Deitcher
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement17", () => {
    var doc = load("anchor2");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).pathname, toPathname('html/files/pix/submit.gif'), 'a.pathname relative with ./');
  });

  /**
   *
   HTMLAnchorElement.pathname should show the pathname of the href
   * @author Avi Deitcher
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement18", () => {
    var doc = load("anchor3");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).pathname, '/jsdom/jsdom', 'a.pathname absolute');
  });

  /**
   *
   * HTMLAnchorElement.host should show the host and port if port is not default
   * @author Salvatore Porchia
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement19", () => {
    var doc = load("anchor3");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).host, 'www.github.com', 'a.host');
    var doc = load("anchor4");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).host, 'www.github.com:3020', 'a.host');
  });

  /**
   * HTMLAnchorElement.hash should show part of url after hash
   * @author Peter Culak
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement20", () => {
     var doc = load("anchor5");
     var nodeList = doc.getElementsByTagName("a");
     assert.equal(nodeList.length, 1, 'Asize');
     assert.equal(nodeList.item(0).host, 'www.github.com:3020', 'a.host');
     assert.equal(nodeList.item(0).hash, '#fragment-identifier', 'a.hash');
  });

  /**
   *
   * HTMLAnchorElement.port should show the port if port is not default
   * @author Salvatore Porchia
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement21", () => {
    var doc = load("anchor3");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).port, '', 'a.port');
    var doc = load("anchor4");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).port, '3020', 'a.port');
  });

  /**
   *
   * HTMLAnchorElement.protocol should show the protocol including trailing ':'.
   * @author Salvatore Porchia
   * @see https://developer.mozilla.org/en/DOM/HTMLAnchorElement
   */
  specify("HTMLAnchorElement22", () => {
    var doc = load("anchorEmpty");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    // Firefox shows 'http:' Chrome/Safari show ':' on empty href.
    assert.equal(nodeList.item(0).protocol, ':', 'a.protocol');
    var doc = load("anchor2");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).protocol, 'file:', 'a.protocol');
    var doc = load("anchor3");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).protocol, 'https:', 'a.protocol');
    var doc = load("anchor4");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).protocol, 'http:', 'a.protocol');
    var doc = load("anchor6");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).protocol, 'special:', 'a.protocol');
  });

  /**
   *
   HTMLAnchorElement.href should show the pathname of the href
   * @author eleith
   */
  specify("HTMLAnchorElement23", () => {
    var doc = load("anchorEmpty");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).href, '', 'A.href is empty');
  });

  /**
   *
   * HTMLAnchorElement.pathname should be the empty string when path is empty
   * @author Adam Faulkner
   * @see http://url.spec.whatwg.org/#dom-url-pathname
   */
  specify("HTMLAnchorElement24", () => {
    var doc = load("anchorEmpty");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).pathname, '', 'A.pathname is empty');
  });

  /**
   *
   * HTMLAnchorElement.username
   * @author Salvatore Porchia
   * @see http://url.spec.whatwg.org/#dom-url-username
   */
  specify("HTMLAnchorElement25", () => {
    var doc = load("anchor7");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).username, 'user', 'A.username');
  });

  /**
   *
   * HTMLAnchorElement.password
   * @author Salvatore Porchia
   * @see http://url.spec.whatwg.org/#dom-url-password
   */
  specify("HTMLAnchorElement26", () => {
    var doc = load("anchor7");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).password, 'pa%3Ass', 'A.password');
  });

  /**
   *
   * HTMLAnchorElement.origin
   * @author Salvatore Porchia
   * @see http://url.spec.whatwg.org/#dom-url-origin
   */
  specify("HTMLAnchorElement27", () => {
    var doc = load("anchorEmpty");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).origin, '', 'a.origin');
    var doc = load("anchor2");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).origin, 'null', 'a.origin');
    var doc = load("anchor3");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).origin, 'https://www.github.com', 'a.origin');
    var doc = load("anchor4");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).origin, 'http://www.github.com:3020', 'a.origin');
    var doc = load("anchor7");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).origin, 'http://www.github.com:500', 'a.origin');
  });

  /**
   *
   * HTMLAnchorElement.search
   * @author Salvatore Porchia
   * @see http://url.spec.whatwg.org/#dom-url-search
   */
  specify("HTMLAnchorElement28", () => {
    var doc = load("anchor6");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).search, '', 'a.search');
    var doc = load("anchor7");
    var nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'A size');
    assert.equal(nodeList.item(0).search, '?testing=tested', 'A.search');
  });

  /**
   *
   The accessKey attribute specifies a single character access key to
   give access to the control form.
   Retrieve the accessKey attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57944457
   */
  specify("HTMLAreaElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "a", "alignLink");
  });

  /**
   *
   The alt attribute specifies an alternate text for user agents not
   rendering the normal content of this element.
   Retrieve the alt attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39775416
   */
  specify("HTMLAreaElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var valt;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valt = testNode.alt;
    assert.equal(valt, "Domain", "altLink");
  });

  /**
   *
   The coords attribute specifies a comma-seperated list of lengths,
   defining an active region geometry.
   Retrieve the coords attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66021476
   */
  specify("HTMLAreaElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vcoords;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcoords = testNode.coords;
    assert.equal(vcoords, "0,2,45,45", "coordsLink");
  });

  /**
   *
   The href attribute specifies the URI of the linked resource.
   Retrieve the href attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-34672936
   */
  specify("HTMLAreaElement04", () => {
    var doc = load("area");
    var nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    assert.equal(nodeList.item(0).href, toFileUrl('html/files/files/dletter.html'), 'hrefLink');
  });

  /**
   *
   The noHref attribute specifies that this area is inactive.
   Retrieve the noHref attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-61826871
   */
  specify("HTMLAreaElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vnohref;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vnohref = testNode.noHref;
    assert.equal(vnohref, false, 'vnohref should be *false*');
  });

  /**
   *
   The shape attribute specifies the shape of the active area.
   Retrieve the shape attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-85683271
   */
  specify("HTMLAreaElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vshape;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vshape = testNode.shape;
    assert.equal(vshape.toLowerCase(), "rect".toLowerCase(), "shapeLink");
  });

  /**
   *
   The tabIndex attribute specifies an index that represents the element's
   position in the tabbing order.
   Retrieve the tabIndex attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8722121
   */
  specify("HTMLAreaElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 10, "tabIndexLink");
  });

  /**
   *
   The target specifies the frame to render the resource in.
   Retrieve the target attribute and examine it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46054682
   */
  specify("HTMLAreaElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vtarget;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area2");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtarget = testNode.target;
    assert.equal(vtarget, "dynamic", "targetLink");
  });

  /**
   *
   The clear attribute specifies control flow of text around floats.
   Retrieve the clear attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82703081
   */
  specify("HTMLBRElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vclear;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("br");
    nodeList = doc.getElementsByTagName("br");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclear = testNode.clear;
    assert.equal(vclear, "none", "clearLink");
  });

  /**
   *
   The href attribute specifies the base URI.
   Retrieve the href attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-65382887
   */
  specify("HTMLBaseElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vhref;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("base");
    nodeList = doc.getElementsByTagName("base");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vhref = testNode.href;
    assert.equal(vhref, "about:blank", "hrefLink");
  });

  /**
   *
   The target attribute specifies the default target frame.
   Retrieve the target attribute and examine its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73844298
   */
  specify("HTMLBaseElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vtarget;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("base2");
    nodeList = doc.getElementsByTagName("base");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtarget = testNode.target;
    assert.equal(vtarget, "Frame1", "targetLink");
  });

  /**
   *
   The aLink attribute specifies the color of active links.
   Retrieve the aLink attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59424581
   */
  specify("HTMLBodyElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valink;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("body");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valink = testNode.aLink;
    assert.equal(valink, "#0000ff", "aLinkLink");
  });

  /**
   *
   The background attribute specifies the URI fo the background texture
   tile image.
   Retrieve the background attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-37574810
   */
  specify("HTMLBodyElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vbackground;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("body");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vbackground = testNode.background;
    assert.equal(vbackground, "./pix/back1.gif", "backgroundLink");
  });

  /**
   *
   The bgColor attribute specifies the document background color.
   Retrieve the bgColor attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-24940084
   */
  specify("HTMLBodyElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("body");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor, "#ffff00", "bgColorLink");
  });

  /**
   *
   The link attribute specifies the color of links that are not active
   and unvisited.
   Retrieve the link attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-7662206
   */
  specify("HTMLBodyElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vlink;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("body");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlink = testNode.link;
    assert.equal(vlink, "#ff0000", "linkLink");
  });

  /**
   *
   The text attribute specifies the document text color.
   Retrieve the text attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73714763
   */
  specify("HTMLBodyElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vtext;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("body");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtext = testNode.text;
    assert.equal(vtext, "#000000", "textLink");
  });

  /**
   *
   The vLink attribute specifies the color of links that have been
   visited by the user.
   Retrieve the vLink attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83224305
   */
  specify("HTMLBodyElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vvlink;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("body");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvlink = testNode.vLink;
    assert.equal(vvlink, "#00ffff", "vLinkLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
   */
  specify("HTMLButtonElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var fNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form2", "formLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   form.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
   */
  specify("HTMLButtonElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The accessKey attribute returns a single character access key to
   give access to the form control.
   Retrieve the accessKey attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73169431
   */
  specify("HTMLButtonElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "f", "accessKeyLink");
  });

  /**
   *
   The disabled attribute specifies whether the control is unavailable
   in this context.
   Retrieve the disabled attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92757155
   */
  specify("HTMLButtonElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vdisabled;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vdisabled = testNode.disabled;
    assert.ok(vdisabled, 'disabledLink');
  });

  /**
   *
   The name attribute is the form control or object name when submitted
   with a form.
   Retrieve the name attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11029910
   */
  specify("HTMLButtonElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "disabledButton", "nameLink");
  });

  /**
   *
   The tabIndex attribute specifies an index that represents the element's
   position in the tabbing order.
   Retrieve the tabIndex attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39190908
   */
  specify("HTMLButtonElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 20, "tabIndexLink");
  });

  /**
   *
   The type attribute specifies the type of button.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27430092
   */
  specify("HTMLButtonElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "reset", "typeLink");
  });

  /**
   *
   The value attribute specifies the current control value.
   Retrieve the value attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72856782
   */
  specify("HTMLButtonElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vvalue = testNode.value;
    assert.equal(vvalue, "Reset Disabled Button", "valueLink");
  });

  /**
   *
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test ordinal index).
   Retrieve the first TABLE element and create a HTMLCollection by invoking
   the "rows" attribute.  The item located at ordinal index 0 is further
   retrieved and its "rowIndex" attribute is examined.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33262535
   */
  specify("HTMLCollection01", () => {
    var success;
    var nodeList;
    var testNode;
    var rowNode;
    var rowsnodeList;
    var vrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    rowNode = rowsnodeList.item(0);
    vrowindex = rowNode.rowIndex;
    assert.equal(vrowindex, 0, "rowIndexLink");
  });

  /**
   *
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test node name).
   Retrieve the first FORM element and create a HTMLCollection by invoking
   the elements attribute.  The first SELECT element is further retrieved
   using the elements name attribute.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76728479
   */
  specify("HTMLCollection02", () => {
    var success;
    var nodeList;
    var testNode;
    var formNode;
    var formsnodeList;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    formNode = formsnodeList.namedItem("select1");
    vname = formNode.nodeName;
    assert.equal(vname, 'SELECT', 'nameIndexLink');
  });

  /**
   *
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test id attribute).
   Retrieve the first FORM element and create a HTMLCollection by invoking
   the "element" attribute.  The first SELECT element is further retrieved
   using the elements id.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-21069976
   */
  specify("HTMLCollection03", () => {
    var success;
    var nodeList;
    var testNode;
    var formNode;
    var formsnodeList;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    formNode = formsnodeList.namedItem("selectId");
    vname = formNode.nodeName;
    assert.equal(vname, 'SELECT', 'nameIndexLink');
  });

  /**
   *
   HTMLCollections are live, they are automatically updated when the
   underlying document is changed.
   Create a HTMLCollection object by invoking the rows attribute of the
   first TABLE element and examine its length, then add a new row and
   re-examine the length.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40057551
   */
  specify("HTMLCollection04", () => {
    var success;
    var nodeList;
    var testNode;
    var rowLength1;
    var rowLength2;
    var rowsnodeList;
    var newRow;
    var vrowindex;
    var doc;
    var result = new Array();
    expectedResult = new Array();
    expectedResult[0] = 4;
    expectedResult[1] = 5;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    rowLength1 = rowsnodeList.length;
    result[result.length] = rowLength1;
    newRow = testNode.insertRow(4);
    rowLength2 = rowsnodeList.length;
    result[result.length] = rowLength2;
    assert.deepEqual(result, expectedResult, 'rowIndexLink');
  });

  /**
   *
   The length attribute specifies the length or size of the list.
   Retrieve the first TABLE element and create a HTMLCollection by invoking
   the "rows" attribute.  Retrieve the length attribute of the HTMLCollection
   object.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40057551
   */
  specify("HTMLCollection05", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var rowLength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    rowLength = rowsnodeList.length;
    assert.equal(rowLength, 4, "rowIndexLink");
  });

  /**
   *
   An item(index) method retrieves an item specified by ordinal index
   (Test for index=0).
   Retrieve the first TABLE element and create a HTMLCollection by invoking
   the "rows" attribute.  The item located at ordinal index 0 is further
   retrieved and its "rowIndex" attribute is examined.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6156016
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33262535
   */
  specify("HTMLCollection06", () => {
    var success;
    var nodeList;
    var testNode;
    var rowNode;
    var rowsnodeList;
    var vrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    rowNode = rowsnodeList.item(0);
    vrowindex = rowNode.rowIndex;
    assert.equal(vrowindex, 0, "rowIndexLink");
  });

  /**
   *
   An item(index) method retrieves an item specified by ordinal index
   (Test for index=3).
   Retrieve the first TABLE element and create a HTMLCollection by invoking
   the "rows" attribute.  The item located at ordinal index 3 is further
   retrieved and its "rowIndex" attribute is examined.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33262535
   */
  specify("HTMLCollection07", () => {
    var success;
    var nodeList;
    var testNode;
    var rowNode;
    var rowsnodeList;
    var vrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    rowNode = rowsnodeList.item(3);
    vrowindex = rowNode.rowIndex;
    assert.equal(vrowindex, 3, "rowIndexLink");
  });

  /**
   *
   Nodes in a HTMLCollection object are numbered in tree order.
   (Depth-first traversal order).
   Retrieve the first TABLE element and create a HTMLCollection by invoking
   the "rows" attribute.  Access the item in the third ordinal index.  The
   resulting rowIndex attribute is examined and should be two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33262535
   */
  specify("HTMLCollection08", () => {
    var success;
    var nodeList;
    var testNode;
    var rowNode;
    var rowsnodeList;
    var vrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    rowNode = rowsnodeList.item(2);
    vrowindex = rowNode.rowIndex;
    assert.equal(vrowindex, 2, "rowIndexLink");
  });

  /**
   *
   The item(index) method returns null if the index is out of range.
   Retrieve the first TABLE element and create a HTMLCollection by invoking
   the "rows" attribute.  Invoke the item(index) method with an index
   of 5.  This index is out of range and should return null.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33262535
   */
  specify("HTMLCollection09", () => {
    var success;
    var nodeList;
    var testNode;
    var rowNode;
    var rowsnodeList;
    var vrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    rowNode = rowsnodeList.item(5);
    assert.equal(rowNode, null, 'rowNode should be null');
  });

  /**
   *
   The namedItem(name) method retrieves a node using a name.  It first
   searches for a node with a matching id attribute.  If it doesn't find
   one, it then searches for a Node with a matching name attribute, but only
   on those elements that are allowed a name attribute.
   Retrieve the first FORM element and create a HTMLCollection by invoking
   the elements attribute.  The first SELECT element is further retrieved
   using the elements name attribute since the id attribute doesn't match.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-21069976
   */
  specify("HTMLCollection10", () => {
    var success;
    var nodeList;
    var testNode;
    var formNode;
    var formsnodeList;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    formNode = formsnodeList.namedItem("select1");
    vname = formNode.nodeName;
    assert.equal(vname, 'SELECT', 'nameIndexLink');
  });

  /**
   *
   The namedItem(name) method retrieves a node using a name.  It first
   searches for a node with a matching id attribute.  If it doesn't find
   one, it then searches for a Node with a matching name attribute, but only
   on those elements that are allowed a name attribute.
   Retrieve the first FORM element and create a HTMLCollection by invoking
   the elements attribute.  The first SELECT element is further retrieved
   using the elements id attribute.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76728479
   */
  specify("HTMLCollection11", () => {
    var success;
    var nodeList;
    var testNode;
    var formNode;
    var formsnodeList;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    formNode = formsnodeList.namedItem("selectId");
    vname = formNode.nodeName;
    assert.equal(vname, 'SELECT', 'nameIndexLink');
  });

  /**
   *
   The namedItem(name) method retrieves a node using a name.  It first
   searches for a node with a matching id attribute.  If it doesn't find
   one, it then searches for a Node with a matching name attribute, but only
   on those elements that are allowed a name attribute. If there isn't
   a matching node the method returns null.
   Retrieve the first FORM element and create a HTMLCollection by invoking
   the elements attribute.  The method returns null since there is not a
   match of the name or id attribute.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-21069976
   */
  specify("HTMLCollection12", () => {
    var success;
    var nodeList;
    var testNode;
    var formNode;
    var formsnodeList;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("collection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    formNode = formsnodeList.namedItem("select9");
    assert.equal(formNode, null, 'formNode should be null');
  });

  /**
   *
   The compact attribute specifies a boolean value on whether to display
   the list more compactly.
   Retrieve the compact attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75317739
   */
  specify("HTMLDirectoryElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcompact;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("directory");
    nodeList = doc.getElementsByTagName("dir");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcompact = testNode.compact;
    assert.ok(vcompact, 'compactLink');
  });

  /**
   *
   The align attribute specifies the horizontal text alignment.
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70908791
   */
  specify("HTMLDivElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("div");
    nodeList = doc.getElementsByTagName("div");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The compact attribute specifies a boolean value on whether to display
   the list more compactly.
   Retrieve the compact attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-21738539
   */
  specify("HTMLDlistElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcompact;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("dl");
    nodeList = doc.getElementsByTagName("dl");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcompact = testNode.compact;
    assert.ok(vcompact, 'compactLink');
  });

  /**
   *
   The title attribute is the specified title as a string.
   Retrieve the title attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18446827
   */
  specify("HTMLDocument01", () => {
    var success;
    var nodeList;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    vtitle = doc.title;
    assert.equal(vtitle, "NIST DOM HTML Test - DOCUMENT", "titleLink");
  });

  /**
   *
   The URL attribute specifies the absolute URI of the document.
   Retrieve the URL attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46183437
   */
  specify("HTMLDocument04", () => {
    var success;
    var nodeList;
    var testNode;
    var vurl;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    vurl = doc.URL;
    assert.equal(vurl, toFileUrl('html/files/document.html'), 'URLLink');
  });

  /**
   *
   The body attribute is the element that contains the content for the
   document.
   Retrieve the body attribute and examine its value for the id attribute.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-56360201
   */
  specify("HTMLDocument05", () => {
    var success;
    var nodeList;
    var testNode;
    var vbody;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    vbody = doc.body;
    vid = vbody.id;
    assert.equal(vid, "TEST-BODY", "idLink");
  });

  /**
   *
   The images attribute returns a collection of all IMG elements in a document.
   Retrieve the images attribute from the document and examine its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90379117
   */
  specify("HTMLDocument07", () => {
    var success;
    var nodeList;
    var testNode;
    var vimages;
    var vlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    vimages = doc.images;
    vlength = vimages.length;
    assert.equal(vlength, 1, "lengthLink");
  });

  /**
   *
   The links attribute returns a collection of all AREA and A elements
   in a document with a value for the href attribute.
   Retrieve the links attribute from the document and examine its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-7068919
   */
  specify("HTMLDocument09", () => {
    var success;
    var nodeList;
    var testNode;
    var vlinks;
    var vlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    vlinks = doc.links;
    vlength = vlinks.length;
    assert.equal(vlength, 3, "lengthLink");
  });

  /**
   *
   The forms attribute returns a collection of all the forms in a document.
   Retrieve the forms attribute from the document and examine its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-1689064
   */
  specify("HTMLDocument10", () => {
    var success;
    var nodeList;
    var testNode;
    var vforms;
    var vlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    vforms = doc.forms;
    vlength = vforms.length;
    assert.equal(vlength, 1, "lengthLink");
  });

  /**
   *
   The anchors attribute returns a collection of all A elements with values
   for the name attribute.
   Retrieve the anchors attribute from the document and examine its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-7577272
   */
  specify("HTMLDocument11", () => {
    var success;
    var nodeList;
    var testNode;
    var vanchors;
    var vlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    vanchors = doc.anchors;
    vlength = vanchors.length;
    assert.equal(vlength, 1, "lengthLink");
  });

  /**
   *
   The getElementsByName method returns the (possibly empty) collection
   of elements whose name value is given by the elementName.
   Retrieve all the elements whose name attribute is "mapid".
   Check the length of the nodelist.  It should be 1.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71555259
   */
  specify("HTMLDocument13", () => {
    var success;
    var nodeList;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    nodeList = doc.getElementsByName("mapid");
    assert.equal(nodeList.length, 1, 'Asize');
  });

  /**
   *
   The getElementsByName method returns the (possibly empty) collection
   of elements whose name value is given by the elementName.
   Retrieve all the elements whose name attribute is "noid".
   Check the length of the nodelist.  It should be 0 since
   the id "noid" does not exist.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71555259
   */
  specify("HTMLDocument14", () => {
    var success;
    var nodeList;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    nodeList = doc.getElementsByName("noid");
    assert.equal(nodeList.length, 0, 'Asize');
  });

  /**
   *
   The getElementById method returns the Element whose id is given by
   elementId.  If no such element exists, returns null.
   Retrieve the element whose id is "mapid".
   Check the value of the element.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36113835
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
   * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBId
   */
  specify("HTMLDocument15", () => {
    var success;
    var elementNode;
    var elementValue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    elementNode = doc.getElementById("mapid");
    elementValue = elementNode.nodeName;
    assert.equal(elementValue, 'MAP', 'elementId');
  });

  /**
   *
   The getElementById method returns the Element whose id is given by
   elementId.  If no such element exists, returns null.
   Retrieve the element whose id is "noid".
   The value returned should be null since there are not any elements with
   an id of "noid".
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36113835
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
   * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBId
   */
  specify("HTMLDocument16", () => {
    var success;
    var elementNode;
    var elementValue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    elementNode = doc.getElementById("noid");
    assert.equal(elementNode, null, 'elementNode should be null');
  });

  /**
   *
   Clears the current document using HTMLDocument.open immediately followed by close.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
   */
  specify("HTMLDocument17", () => {
    var success;
    var doc;
    var bodyElem;
    var bodyChild;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    doc.open();
    doc.close();
    bodyElem = doc.body;
    if(
      (bodyElem != null)
    ) {
      bodyChild = bodyElem.firstChild;
      assert.equal(bodyChild, null, 'bodyChild should be null');
    }
  });

  /**
   *
   Calls HTMLDocument.close on a document that has not been opened for modification.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
   */
  specify("HTMLDocument18", () => {
    var success;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("document");
    doc.close();
  });

  /**
   *
   Replaces the current document with a valid HTML document using HTMLDocument.open, write and close.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75233634
   */
  specify("HTMLDocument19", () => {
    var success;
    var doc;
    var docElem;
    var title;
    doc = load("document");
    doc.open();
    doc.write("&lt;html>");
    doc.write("&lt;body>");
    doc.write("&lt;title>Replacement&lt;/title>");
    doc.write("&lt;/body>");
    doc.write("&lt;p>");
    doc.write("Hello, World.");
    doc.write("&lt;/p>");
    doc.write("&lt;/body>");
    doc.write("&lt;/html>");
    doc.close();
  });

  /**
   *
   Replaces the current document with a valid HTML document using HTMLDocument.open, writeln and close.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35318390
   */
  specify("HTMLDocument20", () => {
    var success;
    var doc;
    var docElem;
    var title;
    doc = load("document");
    doc.open();
    doc.writeln("&lt;html>");
    doc.writeln("&lt;body>");
    doc.writeln("&lt;title>Replacement&lt;/title>");
    doc.writeln("&lt;/body>");
    doc.writeln("&lt;p>");
    doc.writeln("Hello, World.");
    doc.writeln("&lt;/p>");
    doc.writeln("&lt;/body>");
    doc.writeln("&lt;/html>");
    doc.close();
  });

  /**
   *
   Replaces the current document checks that writeln adds a new line.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75233634
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35318390
   */
  specify("HTMLDocument21", () => {
    var doc = load("document");
    doc.open();
    doc.writeln("&lt;html>");
    doc.writeln("&lt;body>");
    doc.writeln("&lt;title>Replacement&lt;/title>");
    doc.writeln("&lt;/body>");
    doc.write("&lt;pre>");
    doc.writeln("Hello, World.");
    doc.writeln("Hello, World.");
    doc.writeln("&lt;/pre>");
    doc.write("&lt;pre>");
    doc.write("Hello, World.");
    doc.write("Hello, World.");
    doc.writeln("&lt;/pre>");
    doc.writeln("&lt;/body>");
    doc.writeln("&lt;/html>");
    doc.close();
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the HEAD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("head");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-HEAD", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the SUB element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sub");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-SUB", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the SUP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-SUP", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the SPAN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("span");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-SPAN", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the BDO element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("bdo");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-BDO", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the TT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("tt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-TT", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the I element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("i");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-I", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the B element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("b");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-B", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the U element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("u");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-U", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the S element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("s");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-S", "idLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the SMALL element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement100", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("small");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the EM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement101", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("em");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the STRONG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement102", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strong");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the DFN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement103", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dfn");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the CODE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement104", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("code");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the SAMP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement105", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("samp");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the KBD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement106", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("kbd");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the VAR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement107", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("var");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the CITE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement108", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("cite");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the ACRONYM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement109", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("acronym");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the STRIKE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strike");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-STRIKE", "idLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the ABBR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement110", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("abbr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the DD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement111", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dd");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the DT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement112", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the NOFRAMES element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement113", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noframes");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the NOSCRIPT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement114", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noscript");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the ADDRESS element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement115", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("address");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the CENTER element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement116", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("center");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the HEAD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement117", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("head");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "HEAD-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the SUB element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement118", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sub");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "SUB-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the SUP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement119", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "SUP-class", "classNameLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the BIG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("big");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-BIG", "idLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the SPAN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement120", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("span");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "SPAN-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the BDO element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement121", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("bdo");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "BDO-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the TT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement122", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("tt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "TT-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the I element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement123", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("i");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "I-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the B element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement124", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("b");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "B-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the U element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement125", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("u");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "U-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the S element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement126", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("s");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "S-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the STRIKE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement127", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strike");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "STRIKE-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the BIG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement128", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("big");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "BIG-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the SMALL element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement129", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("small");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "SMALL-class", "classNameLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the SMALL element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("small");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-SMALL", "idLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the EM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement130", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("em");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "EM-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the STRONG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement131", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strong");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "STRONG-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the DFN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement132", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dfn");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "DFN-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the CODE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement133", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("code");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "CODE-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the SAMP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement134", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("samp");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "SAMP-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the KBD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement135", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("kbd");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "KBD-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the VAR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement136", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("var");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "VAR-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the CITE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement137", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("cite");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "CITE-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the ACRONYM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement138", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("acronym");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "ACRONYM-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the ABBR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement139", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("abbr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "ABBR-class", "classNameLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the EM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("em");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-EM", "idLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the DD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement140", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dd");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "DD-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the DT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement141", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "DT-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the NOFRAMES element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement142", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noframes");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "NOFRAMES-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the NOSCRIPT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement143", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noscript");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "NOSCRIPT-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the ADDRESS element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement144", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("address");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "ADDRESS-class", "classNameLink");
  });

  /**
   *
   The className attribute specifies the class attribute of the element.
   Retrieve the class attribute of the CENTER element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
   */
  specify("HTMLElement145", () => {
    var success;
    var nodeList;
    var testNode;
    var vclassname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("center");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vclassname = testNode.className;
    assert.equal(vclassname, "CENTER-class", "classNameLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the STRONG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strong");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-STRONG", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the DFN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dfn");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-DFN", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the CODE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("code");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-CODE", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the SAMP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("samp");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-SAMP", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the KBD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("kbd");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-KBD", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the VAR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement20", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("var");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-VAR", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the CITE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement21", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("cite");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-CITE", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the ACRONYM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement22", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("acronym");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-ACRONYM", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the ABBR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement23", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("abbr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-ABBR", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the DD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement24", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dd");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-DD", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the DT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement25", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-DT", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the NOFRAMES element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement26", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noframes");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-NOFRAMES", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the NOSCRIPT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement27", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noscript");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-NOSCRIPT", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the ADDRESS element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement28", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("address");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-ADDRESS", "idLink");
  });

  /**
   *
   The id specifies the elements identifier.
   Retrieve the id attribute of the CENTER element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("HTMLElement29", () => {
    var success;
    var nodeList;
    var testNode;
    var vid;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("center");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vid = testNode.id;
    assert.equal(vid, "Test-CENTER", "idLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the HEAD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement30", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("head");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "HEAD Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the SUB element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement31", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sub");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "SUB Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the SUP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement32", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "SUP Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the SPAN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement33", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("span");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "SPAN Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the BDO element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement34", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("bdo");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "BDO Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the TT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement35", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("tt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "TT Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the I element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement36", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("i");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "I Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the B element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement37", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("b");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "B Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the U element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement38", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("u");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "U Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the S element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement39", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("s");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "S Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the STRIKE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement40", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strike");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "STRIKE Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the BIG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement41", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("big");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "BIG Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the SMALL element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement42", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("small");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "SMALL Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the EM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement43", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("em");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "EM Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the STRONG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement44", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strong");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "STRONG Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the DFN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement45", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dfn");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "DFN Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the CODE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement46", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("code");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "CODE Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the SAMP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement47", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("samp");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "SAMP Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the KBD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement48", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("kbd");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "KBD Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the VAR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement49", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("var");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "VAR Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the CITE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement50", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("cite");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "CITE Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the ACRONYM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement51", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("acronym");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "ACRONYM Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the ABBR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement52", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("abbr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "ABBR Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the DD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement53", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dd");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "DD Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the DT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement54", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "DT Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the NOFRAMES element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement55", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noframes");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "NOFRAMES Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the NOSCRIPT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement56", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noscript");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "NOSCRIPT Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the ADDRESS element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement57", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("address");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "ADDRESS Element", "titleLink");
  });

  /**
   *
   The title attribute specifies the elements advisory title.
   Retrieve the title attribute of the CENTER element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
   */
  specify("HTMLElement58", () => {
    var success;
    var nodeList;
    var testNode;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("center");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtitle = testNode.title;
    assert.equal(vtitle, "CENTER Element", "titleLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the HEAD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement59", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("head");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the SUB element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement60", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sub");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the SUP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement61", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the SPAN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement62", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("span");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the BDO element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement63", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("bdo");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the TT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement64", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("tt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the I element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement65", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("i");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the B element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement66", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("b");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the U element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement67", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("u");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the S element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement68", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("s");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the STRIKE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement69", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strike");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the BIG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement70", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("big");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the SMALL element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement71", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("small");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the EM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement72", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("em");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the STRONG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement73", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strong");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the DFN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement74", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dfn");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the CODE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement75", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("code");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the SAMP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement76", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("samp");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the KBD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement77", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("kbd");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the VAR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement78", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("var");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the CITE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement79", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("cite");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the ACRONYM element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement80", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("acronym");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the ABBR element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement81", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("abbr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the DD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement82", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dd");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the DT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement83", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("dt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the NOFRAMES element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement84", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noframes");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the NOSCRIPT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement85", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("noscript");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the ADDRESS element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement86", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("address");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The lang attribute specifies the language code defined in RFC 1766.
   Retrieve the lang attribute of the CENTER element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
   */
  specify("HTMLElement87", () => {
    var success;
    var nodeList;
    var testNode;
    var vlang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("center");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vlang = testNode.lang;
    assert.equal(vlang, "en", "langLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the HEAD element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement88", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("head");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the SUB element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement89", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sub");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the SUP element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement90", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("sup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the SPAN element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement91", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("span");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the BDO element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement92", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("bdo");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the TT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement93", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("tt");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the I element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement94", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("i");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the B element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement95", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("b");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the U element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement96", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("u");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the S element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement97", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("s");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the STRIKE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement98", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("strike");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.
   Retrieve the dir attribute of the BIG element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
   */
  specify("HTMLElement99", () => {
    var success;
    var nodeList;
    var testNode;
    var vdir;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("element");
    nodeList = doc.getElementsByTagName("big");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdir = testNode.dir;
    assert.equal(vdir, "ltr", "dirLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75392630
   */
  specify("HTMLFieldSetElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var fNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("fieldset");
    nodeList = doc.getElementsByTagName("fieldset");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form2", "formLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   form.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75392630
   */
  specify("HTMLFieldSetElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("fieldset");
    nodeList = doc.getElementsByTagName("fieldset");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The color attribute specifies the font's color.
   Retrieve the color attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53532975
   */
  specify("HTMLFontElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("font");
    nodeList = doc.getElementsByTagName("font");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcolor = testNode.color;
    assert.equal(vcolor, "#000000", "colorLink");
  });

  /**
   *
   The face attribute specifies the font's face identifier.
   Retrieve the face attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-55715655
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTML-HTMLFormElement-length
   */
  specify("HTMLFontElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vface;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("font");
    nodeList = doc.getElementsByTagName("font");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vface = testNode.face;
    assert.equal(vface, "arial,helvetica", "faceLink");
  });

  /**
   *
   The size attribute specifies the font's size.
   Retrieve the size attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90127284
   */
  specify("HTMLFontElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vsize;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("font");
    nodeList = doc.getElementsByTagName("font");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vsize = testNode.size;
    assert.equal(vsize, "4", "sizeLink");
  });

  /**
   *
   The elements attribute specifies a collection of all control element
   in the form.
   Retrieve the elements attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76728479
   */
  specify("HTMLFormElement01", () => {
    var success;
    var nodeList;
    var elementnodeList;
    var testNode;
    var velements;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    elementnodeList = testNode.elements;
    velements = elementnodeList.length;
    assert.equal(velements, 3, "elementsLink");
  });

  /**
   *
   The length attribute specifies the number of form controls
   in the form.
   Retrieve the length attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40002357
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTML-HTMLFormElement-length
   */
  specify("HTMLFormElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlength = testNode.length;
    assert.equal(vlength, 3, "lengthLink");
  });

  /**
   *
   The id(name) attribute specifies the name of the form.
   Retrieve the id attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-22051454
   */
  specify("HTMLFormElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.id;
    assert.equal(vname, "form1", "nameLink");
  });

  /**
   *
   The acceptCharset attribute specifies the list of character sets
   supported by the server.
   Retrieve the acceptCharset attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-19661795
   */
  specify("HTMLFormElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vacceptcharset;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vacceptcharset = testNode.acceptCharset;
    assert.equal(vacceptcharset, "US-ASCII", "acceptCharsetLink");
  });

  /**
   *
   The enctype attribute specifies the content of the submitted form.
   Retrieve the enctype attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84227810
   */
  specify("HTMLFormElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var venctype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    venctype = testNode.enctype;
    assert.equal(venctype, "application/x-www-form-urlencoded", "enctypeLink");
  });

  /**
   *
   The method attribute specifies the HTTP method used to submit the form.
   Retrieve the method attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82545539
   */
  specify("HTMLFormElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vmethod;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vmethod = testNode.method;
    assert.equal(vmethod, "post", "methodLink");
  });

  /**
   *
   The target attribute specifies the frame to render the resource in.
   Retrieve the target attribute and examine it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6512890
   */
  specify("HTMLFormElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vtarget;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form2");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtarget = testNode.target;
    assert.equal(vtarget, "dynamic", "targetLink");
  });

  /**
   *
   HTMLFormElement.reset restores the forms default values.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76767677
   */
  specify("HTMLFormElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("form2");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    testNode.reset();
  });

  /**
   *
   The frameBorder attribute specifies the request for frame borders.
   (frameBorder=1 A border is drawn)
   (FrameBorder=0 A border is not drawn)
   Retrieve the frameBorder attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11858633
   */
  specify("HTMLFrameElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vframeborder;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vframeborder = testNode.frameBorder;
    assert.equal(vframeborder, "1", "frameborderLink");
  });

  /**
   *
   The longDesc attribute specifies a URI designating a long description
   of this image or frame.
   Retrieve the longDesc attribute of the first FRAME element and examine
   its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-7836998
   */
  specify("HTMLFrameElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vlongdesc;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vlongdesc = testNode.longDesc;
    assert.equal(vlongdesc, "about:blank", "longdescLink");
  });

  /**
   *
   The marginHeight attribute specifies the frame margin height, in pixels.
   Retrieve the marginHeight attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-55569778
   */
  specify("HTMLFrameElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vmarginheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vmarginheight = testNode.marginHeight;
    assert.equal(vmarginheight, "10", "marginheightLink");
  });

  /**
   *
   The marginWidth attribute specifies the frame margin width, in pixels.
   Retrieve the marginWidth attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8369969
   */
  specify("HTMLFrameElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vmarginwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vmarginwidth = testNode.marginWidth;
    assert.equal(vmarginwidth, "5", "marginwidthLink");
  });

  /**
   *
   The name attribute specifies the frame name(object of the target
   attribute).
   Retrieve the name attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-91128709
   */
  specify("HTMLFrameElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "Frame1", "nameLink");
  });

  /**
   *
   The noResize attribute specifies if the user can resize the frame.  When
   true, forbid user from resizing frame.
   Retrieve the noResize attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-80766578
   */
  specify("HTMLFrameElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vnoresize;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vnoresize = testNode.noResize;
    assert.ok(vnoresize, 'noresizeLink');
  });

  /**
   *
   The scrolling attribute specifies whether or not the frame should have
   scrollbars.
   Retrieve the scrolling attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-45411424
   */
  specify("HTMLFrameElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vscrolling;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vscrolling = testNode.scrolling;
    assert.equal(vscrolling, "yes", "scrollingLink");
  });

  /**
   *
   The src attribute specifies a URI designating the initial frame contents.
   Retrieve the src attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78799535
   */
  specify("HTMLFrameElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vsrc;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame");
    nodeList = doc.getElementsByTagName("frame");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vsrc = testNode.src;
    assert.equal(vsrc, toFileUrl('html/files/img/right.png'), 'srcLink');
  });

  /**
   *
   The contentDocument attribute specifies the document this frame contains,
   if there is any and it is available, or null otherwise.
   Retrieve the contentDocument attribute of the first FRAME element
   and examine its TITLE value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-78799536
   */
  specify("HTMLFrameElement09", { async: true }, t => {
    var success;
    var testNode;
    var cd;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frame2", { resources: "usable" });
    doc.onload = function() {
      testNode = doc.getElementById("Frame1");
      cd = testNode.contentDocument;
      vtitle = cd.title;
      // Updated as per: http://lists.w3.org/Archives/Public/www-dom/2009JulSep/0026.html
      assert.equal(vtitle, "NIST DOM HTML Test - FRAME", "titleLink");
      t.done();
    };
  });

  /**
   *
   The cols attribute specifies the number of columns of frames in the
   frameset.
   Retrieve the cols attribute of the first FRAMESET element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98869594
   */
  specify("HTMLFrameSetElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcols;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frameset");
    nodeList = doc.getElementsByTagName("frameset");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vcols = testNode.cols;
    assert.equal(vcols, "20, 80", "colsLink");
  });

  /**
   *
   The rows attribute specifies the number of rows of frames in the
   frameset.
   Retrieve the rows attribute of the second FRAMESET element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-19739247
   */
  specify("HTMLFrameSetElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("frameset");
    nodeList = doc.getElementsByTagName("frameset");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vrows = testNode.rows;
    assert.equal(vrows, "100, 200", "rowsLink");
  });

  /**
   *
   The align attribute specifies the rule alignment on the page.
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-15235012
   */
  specify("HTMLHRElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("hr");
    nodeList = doc.getElementsByTagName("hr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The noShade attribute specifies that the rule should be drawn as
   a solid color.
   Retrieve the noShade attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79813978
   */
  specify("HTMLHRElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vnoshade;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("hr");
    nodeList = doc.getElementsByTagName("hr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vnoshade = testNode.noShade;
    assert.ok(vnoshade, 'noShadeLink');
  });

  /**
   *
   The size attribute specifies the height of the rule.
   Retrieve the size attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77612587
   */
  specify("HTMLHRElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vsize;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("hr");
    nodeList = doc.getElementsByTagName("hr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vsize = testNode.size;
    assert.equal(vsize, "5", "sizeLink");
  });

  /**
   *
   The width attribute specifies the width of the rule.
   Retrieve the width attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87744198
   */
  specify("HTMLHRElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("hr");
    nodeList = doc.getElementsByTagName("hr");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, "400", "widthLink");
  });

  /**
   *
   The align attribute specifies the horizontal text alignment(H1).
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
   */
  specify("HTMLHeadingElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("heading");
    nodeList = doc.getElementsByTagName("h1");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal text alignment(H2).
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
   */
  specify("HTMLHeadingElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("heading");
    nodeList = doc.getElementsByTagName("h2");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "left", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal text alignment(H3).
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
   */
  specify("HTMLHeadingElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("heading");
    nodeList = doc.getElementsByTagName("h3");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "right", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal text alignment(H4).
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
   */
  specify("HTMLHeadingElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("heading");
    nodeList = doc.getElementsByTagName("h4");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "justify", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal text alignment(H5).
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
   */
  specify("HTMLHeadingElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("heading");
    nodeList = doc.getElementsByTagName("h5");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal text alignment(H6).
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
   */
  specify("HTMLHeadingElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("heading");
    nodeList = doc.getElementsByTagName("h6");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "left", "alignLink");
  });

  /**
   *
   The version attribute specifies version information about the document's
   DTD.
   Retrieve the version attribute and examine its value.
   Test is only applicable to HTML, version attribute is not supported in XHTML.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9383775
   */
  specify("HTMLHtmlElement01", () => {
    var nodeList;
    var testNode;
    var vversion;
    var doc;
    doc = load("html");
    nodeList = doc.getElementsByTagName("html");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vversion = testNode.version;
    assert.equal(vversion, "-//W3C//DTD HTML 4.01 Transitional//EN", "versionLink");
  });

  /**
   *
   The align attribute aligns this object(vertically or horizontally with
   respect to its surrounding text.
   Retrieve the align attribute of the first IFRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11309947
   */
  specify("HTMLIFrameElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "top", "alignLink");
  });

  /**
   *
   The frameBorder attribute specifies the request for frame borders.
   (frameBorder=1 A border is drawn)
   (FrameBorder=0 A border is not drawn)
   Retrieve the frameBorder attribute of the first IFRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-22463410
   */
  specify("HTMLIFrameElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vframeborder;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vframeborder = testNode.frameBorder;
    assert.equal(vframeborder, "1", "frameborderLink");
  });

  /**
   *
   The height attribute specifies the frame height.
   Retrieve the height attribute of the first IFRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-1678118
   */
  specify("HTMLIFrameElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vheight = testNode.height;
    assert.equal(vheight, "50", "heightLink");
  });

  /**
   *
   The longDesc attribute specifies a URI designating a long description
   of this image or frame.
   Retrieve the longDesc attribute of the first IFRAME element and examine
   its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70472105
   */
  specify("HTMLIFrameElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vlongdesc;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vlongdesc = testNode.longDesc;
    assert.equal(vlongdesc, "about:blank", "longdescLink");
  });

  /**
   *
   The marginWidth attribute specifies the frame margin width, in pixels.
   Retrieve the marginWidth attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66486595
   */
  specify("HTMLIFrameElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vmarginwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vmarginwidth = testNode.marginWidth;
    assert.equal(vmarginwidth, "5", "marginwidthLink");
  });

  /**
   *
   The marginHeight attribute specifies the frame margin height, in pixels.
   Retrieve the marginHeight attribute of the first IFRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-91371294
   */
  specify("HTMLIFrameElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vmarginheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vmarginheight = testNode.marginHeight;
    assert.equal(vmarginheight, "10", "marginheightLink");
  });

  /**
   *
   The name attribute specifies the frame name(object of the target
   attribute).
   Retrieve the name attribute of the first IFRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96819659
   */
  specify("HTMLIFrameElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "Iframe1", "nameLink");
  });

  /**
   *
   The scrolling attribute specifies whether or not the frame should have
   scrollbars.
   Retrieve the scrolling attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36369822
   */
  specify("HTMLIFrameElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vscrolling;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vscrolling = testNode.scrolling;
    assert.equal(vscrolling, "yes", "scrollingLink");
  });

  /**
   *
   The src attribute specifies a URI designating the initial frame contents.
   Retrieve the src attribute of the first FRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-43933957
   */
  specify("HTMLIFrameElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vsrc;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vsrc = testNode.src;
    assert.equal(vsrc, toFileUrl('html/files/img/right.png'), 'srcLink');
  });

  /**
   *
   The width attribute specifies the frame width.
   Retrieve the width attribute of the first IFRAME element and examine
   it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67133005
   */
  specify("HTMLIFrameElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe");
    nodeList = doc.getElementsByTagName("iframe");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, "60", "widthLink");
  });

  /**
   *
   Retrieve the contentDocument attribute of the second IFRAME element
   and examine its title.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-67133006
   */
  specify("HTMLIFrameElement11", { async: true }, t => {
    var success;
    var testNode;
    var cd;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("iframe2", { resources: "usable" });
    doc.onload = function() {
      testNode = doc.getElementById("Iframe2");
      cd = testNode.contentDocument;
      vtitle = cd.title;
      assert.equal(vtitle, "NIST DOM HTML Test - FRAME", "titleLink");
      t.done();
    };
  });

  /**
   *
   The name attribute specifies the name of the element.
   Retrieve the name attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47534097
   */
  specify("HTMLImageElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "IMAGE-1", "nameLink");
  });

  /**
   *
   The align attribute aligns this object with respect to its surrounding
   text.
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-3211094
   */
  specify("HTMLImageElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "middle", "alignLink");
  });

  /**
   *
   The alt attribute specifies an alternative text for user agenst not
   rendering the normal content of this element.
   Retrieve the alt attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95636861
   */
  specify("HTMLImageElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var valt;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valt = testNode.alt;
    assert.equal(valt, "DTS IMAGE LOGO", "altLink");
  });

  /**
   *
   The border attribute specifies the width of the border around the image.
   Retrieve the border attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-136671
   */
  specify("HTMLImageElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vborder;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vborder = testNode.border;
    assert.equal(vborder, "0", "borderLink");
  });

  /**
   *
   The height attribute overrides the natural "height" of the image.
   Retrieve the height attribute and examine it's value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-91561496
   */
  specify("HTMLImageElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vheight = testNode.height;
    assert.equal(vheight, 47, "heightLink");
  });

  /**
   *
   The hspace attribute specifies the horizontal space to the left and
   right of this image.
   Retrieve the hspace attribute and examine it's value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-53675471
   */
  specify("HTMLImageElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vhspace;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vhspace = testNode.hspace;
    assert.equal(vhspace, 4, "hspaceLink");
  });

  /**
   *
   The isMap attribute indicates the use of server-side image map.
   Retrieve the isMap attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58983880
   */
  specify("HTMLImageElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vismap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vismap = testNode.isMap;
    assert.equal(vismap, false, 'vismap should be *false*');
  });

  /**
   *
   The src attribute contains an URI designating the source of this image.
   Retrieve the src attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87762984
   */
  specify("HTMLImageElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vsrc;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vsrc = testNode.src;
    assert.equal(vsrc, toFileUrl('html/files/pix/dts.gif'), 'srcLink');
  });

  /**
   *
   The useMap attribute specifies to use the client-side image map.
   Retrieve the useMap attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35981181
   */
  specify("HTMLImageElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vusemap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vusemap = testNode.useMap;
    assert.equal(vusemap, "#DTS-MAP", "useMapLink");
  });

  /**
   *
   The vspace attribute specifies the vertical space above and below this
   image.
   Retrieve the vspace attribute and examine it's value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-85374897
   */
  specify("HTMLImageElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vvspace;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvspace = testNode.vspace;
    assert.equal(vvspace, 10, "vspaceLink");
  });

  /**
   *
   The width attribute overrides the natural "width" of the image.
   Retrieve the width attribute and examine it's value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-13839076
   */
  specify("HTMLImageElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("img");
    nodeList = doc.getElementsByTagName("img");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, 115, "widthLink");
  });

  /**
   *
   The defaultValue attribute represents the HTML value of the attribute
   when the type attribute has the value of "Text", "File" or "Password".
   Retrieve the defaultValue attribute of the 1st INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-26091157
   */
  specify("HTMLInputElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vdefaultvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    vdefaultvalue = testNode.defaultValue;
    assert.equal(vdefaultvalue, "Password", "defaultValueLink");
  });

  /**
   *
   The defaultChecked attribute represents the HTML checked attribute of
   the element when the type attribute has the value checkbox or radio.
   Retrieve the defaultValue attribute of the 4th INPUT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20509171
   */
  specify("HTMLInputElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vdefaultchecked;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(3);
    vdefaultchecked = testNode.defaultChecked;
    assert.ok(vdefaultchecked, 'defaultCheckedLink');
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute of the 1st INPUT element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63239895
   */
  specify("HTMLInputElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var fNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form1", "formLink");
  });

  /**
   *
   The accept attribute is a comma-seperated list of content types that
   a server processing this form will handle correctly.
   Retrieve the accept attribute of the 9th INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-15328520
   */
  specify("HTMLInputElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccept;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(8);
    vaccept = testNode.accept;
    assert.equal(vaccept, 'GIF,JPEG', 'acceptLink');
  });

  /**
   *
   The accessKey attribute is a single character access key to give access
   to the form control.
   Retrieve the accessKey attribute of the 2nd INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59914154
   */
  specify("HTMLInputElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(1);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "c", "accesskeyLink");
  });

  /**
   *
   The align attribute aligns this object(vertically or horizontally)
   with respect to the surrounding text.
   Retrieve the align attribute of the 4th INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96991182
   */
  specify("HTMLInputElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(3);
    valign = testNode.align;
    assert.equal(valign.toLowerCase(), "bottom".toLowerCase(), "alignLink");
  });

  /**
   *
   The alt attribute alternates text for user agents not rendering the
   normal content of this element.
   Retrieve the alt attribute of the 1st INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92701314
   */
  specify("HTMLInputElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var valt;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    valt = testNode.alt;
    assert.equal(valt, "Password entry", "altLink");
  });

  /**
   *
   The checked attribute represents the current state of the corresponding
   form control when type has the value Radio or Checkbox.
   Retrieve the accept attribute of the 3rd INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30233917
   */
  specify("HTMLInputElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vchecked;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(2);
    vchecked = testNode.checked;
    assert.ok(vchecked, 'checkedLink');
  });

  /**
   *
   The disabled attribute has a TRUE value if it is explicitly set.
   Retrieve the disabled attribute of the 7th INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-50886781
   */
  specify("HTMLInputElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vdisabled;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(6);
    vdisabled = testNode.disabled;
    assert.ok(vdisabled, 'disabledLink');
  });

  /**
   *
   The maxLength attribute is the maximum number of text characters for text
   fields, when type has the value of Text or Password.
   Retrieve the maxLenght attribute of the 1st INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-54719353
   */
  specify("HTMLInputElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vmaxlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    vmaxlength = testNode.maxLength;
    assert.equal(vmaxlength, 5, "maxlengthLink");
  });

  /**
   *
   The name attribute is the form control or object name when submitted with
   a form.
   Retrieve the name attribute of the 1st INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89658498
   */
  specify("HTMLInputElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "Password", "nameLink");
  });

  /**
   *
   The readOnly attribute indicates that this control is read-only when
   type has a value of text or password only.
   Retrieve the readOnly attribute of the 1st INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88461592
   */
  specify("HTMLInputElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vreadonly;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    vreadonly = testNode.readOnly;
    assert.ok(vreadonly, 'readonlyLink');
  });

  /**
   *
   The size attribute contains the size information.  Its precise meaning
   is specific to each type of field.
   Retrieve the size attribute of the 1st INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-79659438
   */
  specify("HTMLInputElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var vsize;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    vsize = testNode.size;
    assert.equal(vsize, 25, "size");
  });

  /**
   *
   The src attribute specifies the location of the image to decorate the
   graphical submit button when the type has the value Image.
   Retrieve the src attribute of the 8th INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-97320704
   */
  specify("HTMLInputElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var vsrc;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(7);
    vsrc = testNode.src;
    assert.isTrue(vsrc.endsWith('/pix/submit.gif'), 'srcLink');
  });

  /**
   *
   The tabIndex attribute is an index that represents the elements position
   in the tabbing order.
   Retrieve the tabIndex attribute of the 3rd INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62176355
   */
  specify("HTMLInputElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(2);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 9, "tabindexLink");
  });

  /**
   *
   The type attribute is the type of control created.
   Retrieve the type attribute of the 1st INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62883744
   */
  specify("HTMLInputElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "password", "typeLink");
  });

  /**
   *
   The useMap attribute specifies the use of the client-side image map.
   Retrieve the useMap attribute of the 8th INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32463706
   */
  specify("HTMLInputElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var vusemap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(7);
    vusemap = testNode.useMap;
    assert.equal(vusemap, "#submit-map", "usemapLink");
  });

  /**
   *
   The value attribute is the current content of the corresponding form
   control when the type attribute has the value Text, File or Password.
   Retrieve the value attribute of the 2nd INPUT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-49531485
   */
  specify("HTMLInputElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(1);
    vvalue = testNode.value;
    assert.equal(vvalue, "ReHire", "valueLink");
  });

  /**
   *
   HTMLInputElement.blur should surrender input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-26838235
   */
  specify("HTMLInputElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(1);
    testNode.blur();
  });

  /**
   *
   HTMLInputElement.focus should capture input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-65996295
   */
  specify("HTMLInputElement20", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(1);
    testNode.focus();
  });

  /**
   *
   HTMLInputElement.click should change the state of checked on a radio button.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-2651361
   */
  specify("HTMLInputElement21", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var checked;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(1);
    checked = testNode.checked;
    assert.equal(checked, false, 'checked should be *false*');
    testNode.click();
    checked = testNode.checked;
    assert.ok(checked, 'checkedAfterClick');
  });

  /**
   *
   HTMLInputElement.select should select the contents of a text area.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-34677168
   */
  specify("HTMLInputElement22", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var checked;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("input");
    nodeList = doc.getElementsByTagName("input");
    assert.equal(nodeList.length, 9, 'Asize');
    testNode = nodeList.item(0);
    testNode.select();
  });

  specify("HTMLInputElementCheckboxClickTogglesCheckedState", () => {
    var doc = load("input");
    var element = doc.querySelector("input[name='Check1']");
    assert.equal(element.checked, true);
    element.click();
    assert.equal(element.checked, false);
    element.click();
    assert.equal(element.checked, true);
  });

  specify("HTMLInputElementDefaultEventClickForCheckboxTogglesCheckedState", () => {
    var doc = load("input");
    var element = doc.querySelector("input[name='Check1']");
    var clickevent = doc.createEvent("MouseEvent");
    clickevent.initEvent("click", true, true);
    element.dispatchEvent(clickevent);
    assert.equal(element.checked, false);
    element.dispatchEvent(clickevent);
    assert.equal(element.checked, true);
    element.dispatchEvent(clickevent);
    assert.equal(element.checked, false);
  });

  // <isindex> tests removed because it's replaced by <label> and <input> in the parser stage now

  /**
   *
   The type attribute is a list item bullet style.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52387668
   */
  specify("HTMLLIElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("li");
    nodeList = doc.getElementsByTagName("li");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "square", "typeLink");
  });

  /**
   *
   The value attribute is a reset sequence number when used in OL.
   Retrieve the value attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-45496263
   */
  specify("HTMLLIElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("li");
    nodeList = doc.getElementsByTagName("li");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vvalue = testNode.value;
    assert.equal(vvalue, 2, "valueLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32480901
   */
  specify("HTMLLabelElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var fNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("label");
    nodeList = doc.getElementsByTagName("label");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form1", "formLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   form.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32480901
   */
  specify("HTMLLabelElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("label");
    nodeList = doc.getElementsByTagName("label");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The accessKey attribute is a single character access key to give access
   to the form control.
   Retrieve the accessKey attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-43589892
   */
  specify("HTMLLabelElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("label");
    nodeList = doc.getElementsByTagName("label");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "b", "accesskeyLink");
  });

  /**
   *
   The htmlFor attribute links this label with another form control by
   id attribute.
   Retrieve the htmlFor attribute of the first LABEL element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96509813
   */
  specify("HTMLLabelElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vhtmlfor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("label");
    nodeList = doc.getElementsByTagName("label");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vhtmlfor = testNode.htmlFor;
    assert.equal(vhtmlfor, "input1", "htmlForLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute from the first LEGEND element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-29594519
   */
  specify("HTMLLegendElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var fNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("legend");
    nodeList = doc.getElementsByTagName("legend");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form1", "formLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   form.
   Retrieve the second ELEMENT and examine its form element.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-29594519
   */
  specify("HTMLLegendElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("legend");
    nodeList = doc.getElementsByTagName("legend");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The accessKey attribute is a single character access key to give access
   to the form control.
   Retrieve the accessKey attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11297832
   */
  specify("HTMLLegendElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("legend");
    nodeList = doc.getElementsByTagName("legend");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "b", "accesskeyLink");
  });

  /**
   *
   The align attribute specifies the text alignment relative to FIELDSET.
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79538067
   */
  specify("HTMLLegendElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("legend");
    nodeList = doc.getElementsByTagName("legend");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "top", "alignLink");
  });

  /**
   *
   The charset attribute indicates the character encoding of the linked
   resource.
   Retrieve the charset attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63954491
   */
  specify("HTMLLinkElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharset;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vcharset = testNode.charset;
    assert.equal(vcharset, "Latin-1", "charsetLink");
  });

  /**
   *
   The href attribute specifies the URI of the linked resource.
   Retrieve the href attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33532588
   */
  specify("HTMLLinkElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vhref;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vhref = testNode.href;
    assert.equal(vhref, toFileUrl('html/files/files/glossary.html'), 'hrefLink');
  });

  /**
   *
   The hreflang attribute specifies the language code of the linked resource.
   Retrieve the hreflang attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-85145682
   */
  specify("HTMLLinkElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vhreflang;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vhreflang = testNode.hreflang;
    assert.equal(vhreflang, "en", "hreflangLink");
  });

  /**
   *
   The media attribute specifies the targeted media.
   Retrieve the media attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75813125
   */
  specify("HTMLLinkElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vmedia;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vmedia = testNode.media;
    assert.equal(vmedia, "screen", "mediaLink");
  });

  /**
   *
   The rel attribute specifies the forward link type.
   Retrieve the rel attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-41369587
   */
  specify("HTMLLinkElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vrel;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vrel = testNode.rel;
    assert.equal(vrel, "Glossary", "relLink");
  });

  /**
   *
   The rev attribute specifies the reverse link type.
   Retrieve the rev attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40715461
   */
  specify("HTMLLinkElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vrev;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vrev = testNode.rev;
    assert.equal(vrev, "stylesheet", "revLink");
  });

  /**
   *
   The type attribute specifies the advisory content type.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32498296
   */
  specify("HTMLLinkElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "text/html", "typeLink");
  });

  /**
   *
   The target attribute specifies the frame to render the resource in.
   Retrieve the target attribute and examine it's value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84183095
   */
  specify("HTMLLinkElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vtarget;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("link2");
    nodeList = doc.getElementsByTagName("link");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtarget = testNode.target;
    assert.equal(vtarget, "dynamic", "targetLink");
  });

  /**
   *
   The  areas attribute is a list of areas defined for the image map.
   Retrieve the areas attribute and find the number of areas defined.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71838730
   */
  specify("HTMLMapElement01", () => {
    var success;
    var nodeList;
    var areasnodeList;
    var testNode;
    var vareas;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("map");
    nodeList = doc.getElementsByTagName("map");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    areasnodeList = testNode.areas;
    vareas = areasnodeList.length;
    assert.equal(vareas, 3, "areasLink");
  });

  /**
   *
   The name attribute names the map(for use with usemap).
   Retrieve the name attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52696514
   */
  specify("HTMLMapElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("map");
    nodeList = doc.getElementsByTagName("map");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "mapid", "mapLink");
  });

  /**
   *
   The compact attribute specifies a boolean value on whether to display
   the list more compactly.
   Retrieve the compact attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68436464
   */
  specify("HTMLMenuElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcompact;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("menu");
    nodeList = doc.getElementsByTagName("menu");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcompact = testNode.compact;
    assert.ok(vcompact, 'compactLink');
  });

  /**
   *
   The content attribute specifies associated information.
   Retrieve the content attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87670826
   */
  specify("HTMLMetaElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcontent;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("meta");
    nodeList = doc.getElementsByTagName("meta");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcontent = testNode.content;
    assert.equal(vcontent, "text/html; CHARSET=utf-8", "contentLink");
  });

  /**
   *
   The httpEquiv attribute specifies an HTTP respnse header name.
   Retrieve the httpEquiv attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77289449
   */
  specify("HTMLMetaElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vhttpequiv;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("meta");
    nodeList = doc.getElementsByTagName("meta");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vhttpequiv = testNode.httpEquiv;
    assert.equal(vhttpequiv, "Content-Type", "httpEquivLink");
  });

  /**
   *
   The name attribute specifies the meta information name.
   Retrieve the name attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-31037081
   */
  specify("HTMLMetaElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("meta");
    nodeList = doc.getElementsByTagName("meta");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "Meta-Name", "nameLink");
  });

  /**
   *
   The scheme attribute specifies a select form of content.
   Retrieve the scheme attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35993789
   */
  specify("HTMLMetaElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vscheme;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("meta");
    nodeList = doc.getElementsByTagName("meta");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vscheme = testNode.scheme;
    assert.equal(vscheme, "NIST", "schemeLink");
  });

  /**
   *
   The cite attribute specifies an URI designating a document that describes
   the reason for the change.
   Retrieve the cite attribute of the INS element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75101708
   */
  specify("HTMLModElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcite;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("mod");
    nodeList = doc.getElementsByTagName("ins");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcite = testNode.cite;
    assert.isTrue(vcite.endsWith('/files/ins-reasons.html'), 'citeLink');
  });

  /**
   *
   The dateTime attribute specifies the date and time of the change.
   Retrieve the dateTime attribute of the INS element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88432678
   */
  specify("HTMLModElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vdatetime;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("mod");
    nodeList = doc.getElementsByTagName("ins");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdatetime = testNode.dateTime;
    assert.equal(vdatetime, "January 1, 2002", "dateTimeLink");
  });

  /**
   *
   The cite attribute specifies an URI designating a document that describes
   the reason for the change.
   Retrieve the cite attribute of the DEL element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75101708
   */
  specify("HTMLModElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vcite;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("mod");
    nodeList = doc.getElementsByTagName("del");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcite = testNode.cite;
    assert.isTrue(vcite.endsWith('/files/del-reasons.html'), 'citeLink');
  });

  /**
   *
   The dateTime attribute specifies the date and time of the change.
   Retrieve the dateTime attribute of the DEL element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88432678
   */
  specify("HTMLModElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vdatetime;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("mod");
    nodeList = doc.getElementsByTagName("del");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdatetime = testNode.dateTime;
    assert.equal(vdatetime, "January 2, 2002", "dateTimeLink");
  });

  /**
   *
   The compact attribute specifies a boolean value on whether to display
   the list more compactly.
   Retrieve the compact attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76448506
   */
  specify("HTMLOListElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcompact;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("olist");
    nodeList = doc.getElementsByTagName("ol");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcompact = testNode.compact;
    assert.ok(vcompact, 'compactLink');
  });

  /**
   *
   The start attribute specifies the starting sequence number.
   Retrieve the start attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14793325
   */
  specify("HTMLOListElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vstart;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("olist");
    nodeList = doc.getElementsByTagName("ol");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vstart = testNode.start;
    assert.equal(vstart, 1, "startLink");
  });

  /**
   *
   The type attribute specifies the numbering style.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40971103
   */
  specify("HTMLOListElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("olist");
    nodeList = doc.getElementsByTagName("ol");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "1", "typeLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46094773
   */
  specify("HTMLObjectElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var fNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object2");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "object2", "idLink");
  });

  /**
   *
   The code attribute specifies an Applet class file.
   Retrieve the code attribute of the second OBJECT element and examine
   its value.  Should be "" since CODE is not a valid attribute for OBJECT.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75241146
   */
  specify("HTMLObjectElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vcode = testNode.code;

    assert.strictEqual(vcode, "", "codeLink");
  });

  /**
   *
   The align attribute specifies the alignment of this object with respect
   to its surrounding text.
   Retrieve the align attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16962097
   */
  specify("HTMLObjectElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "middle", "alignLink");
  });

  /**
   *
   The archive attribute specifies a space-separated list of archives.
   Retrieve the archive attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47783837
   */
  specify("HTMLObjectElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var varchive;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    varchive = testNode.archive;
    assert.equal(varchive, "", "archiveLink");
  });

  /**
   *
   The border attribute specifies the widht of the border around the object.
   Retrieve the border attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82818419
   */
  specify("HTMLObjectElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vborder;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vborder = testNode.border;
    assert.equal(vborder, "0", "borderLink");
  });

  /**
   *
   The codeBase attribute specifies the base URI for the classid, data and
   archive attributes.
   Retrieve the codeBase attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25709136
   */
  specify("HTMLObjectElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vcodebase;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vcodebase = testNode.codeBase;
    // assertURIEquals("codebaseLink",null,"//xw2k.sdct.itl.nist.gov/brady/dom/",null,null,null,null,null,null,vcodebase);
  assert.equal(vcodebase, 'http://xw2k.sdct.itl.nist.gov/brady/dom/', 'codebaseLink');
  });

  /**
   *
   The codeType attribute specifies the data downloaded via the classid
   attribute.
   Retrieve the codeType attribute of the second OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-19945008
   */
  specify("HTMLObjectElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vcodetype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vcodetype = testNode.codeType;
    assert.equal(vcodetype, "image/gif", "codetypeLink");
  });

  /**
   *
   The data attribute specifies the URI of the location of the objects data.
   Retrieve the data attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-81766986
   */
  specify("HTMLObjectElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vdata;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vdata = testNode.data;
    assert.equal(vdata, toFileUrl('html/files/pix/logo.gif'), 'dataLink');
  });

  /**
   *
   The declare attribute specifies this object should be declared only and
   no instance of it should be created.
   Retrieve the declare attribute of the second OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-942770
   */
  specify("HTMLObjectElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vdeclare;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vdeclare = testNode.declare;
    assert.ok(vdeclare, 'declareLink');
  });

  /**
   *
   The height attribute overrides the value of the actual height of the
   object.
   Retrieve the height attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88925838
   */
  specify("HTMLObjectElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vheight = testNode.height;
    assert.equal(vheight, "60", "heightLink");
  });

  /**
   *
   The hspace attribute specifies the horizontal space to the left and right
   of this image, applet or object.
   Retrieve the hspace attribute of the first OBJECT element and examine
   it's value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-17085376
   */
  specify("HTMLObjectElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vhspace;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vhspace = testNode.hspace;
    assert.equal(vhspace, 0, "hspaceLink");
  });

  /**
   *
   The standby attribute specifies a message to render while loading the
   object.
   Retrieve the standby attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25039673
   */
  specify("HTMLObjectElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vstandby;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vstandby = testNode.standby;
    assert.equal(vstandby, "Loading Image ...", "alignLink");
  });

  /**
   *
   The tabIndex attribute specifies the elements position in the tabbing
   order.
   Retrieve the tabIndex attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27083787
   */
  specify("HTMLObjectElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 0, "tabIndexLink");
  });

  /**
   *
   The type attribute specifies the content type for data downloaded via
   the data attribute.
   Retrieve the type attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-91665621
   */
  specify("HTMLObjectElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "image/gif", "typeLink");
  });

  /**
   *
   The useMap attribute specifies the used client-side image map.
   Retrieve the useMap attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6649772
   */
  specify("HTMLObjectElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var vusemap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vusemap = testNode.useMap;
    assert.equal(vusemap, "#DivLogo-map", "useMapLink");
  });

  /**
   *
   The vspace attribute specifies the vertical space above or below this
   image, applet or object.
   Retrieve the vspace attribute of the first OBJECT element and examine
   it's value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-8682483
   */
  specify("HTMLObjectElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var vvspace;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vvspace = testNode.vspace;
    assert.equal(vvspace, 0, "vspaceLink");
  });

  /**
   *
   The width attribute overrides the original width value.
   Retrieve the width attribute of the first OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-38538620
   */
  specify("HTMLObjectElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, "550", "widthLink");
  });

  /**
   *
   The name attribute specifies form control or object name when submitted
   with a form.
   Retrieve the name attribute of the second OBJECT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20110362
   */
  specify("HTMLObjectElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vname = testNode.name;
    assert.equal(vname, "OBJECT2", "vspaceLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   form.
   Retrieve the form attribute and examine its value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46094773
   */
  specify("HTMLObjectElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object2");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The contentDocument attribute specifies the document this object contains,
   if there is any and it is available, or null otherwise.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-38538621
   */
  specify("HTMLObjectElement20", () => {
    var success;
    var testNode;
    var cd;
    var vtitle;
    var doc;
    var nodeList;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object2");
    nodeList = doc.getElementsByTagName("object");
    testNode = nodeList.item(1);
    cd = testNode.contentDocument;
    assert.equal(cd, null, 'cd should be null');
  });

  /**
   *
   The disabled attribute indicates that the control is unavailable in
   this context.
   Retrieve the disabled attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-15518803
   */
  specify("HTMLOptGroupElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vdisabled;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optgroup");
    nodeList = doc.getElementsByTagName("optgroup");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vdisabled = testNode.disabled;
    assert.ok(vdisabled, 'disabledLink');
  });

  /**
   *
   The label attribute specifies the label assigned to this option group.
   Retrieve the label attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95806054
   */
  specify("HTMLOptGroupElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vlabel;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optgroup");
    nodeList = doc.getElementsByTagName("optgroup");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vlabel = testNode.label;
    assert.equal(vlabel, "Regular Employees", "labelLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute from the first SELECT element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-17116503
   */
  specify("HTMLOptionElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var fNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form1", "formLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   a form.
   Retrieve the first OPTION attribute from the second select element and
   examine its form element.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-17116503
   */
  specify("HTMLOptionElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(6);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The defaultSelected attribute contains the value of the selected
   attribute.
   Retrieve the defaultSelected attribute from the first OPTION element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-37770574
   */
  specify("HTMLOptionElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vdefaultselected;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(0);
    vdefaultselected = testNode.defaultSelected;
    assert.ok(vdefaultselected, 'defaultSelectedLink');
  });

  /**
   *
   The text attribute contains the text contained within the option element.
   Retrieve the text attribute from the second OPTION element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48154426
   */
  specify("HTMLOptionElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vtext;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(1);
    vtext = testNode.text;
    assert.equal(vtext, "EMP10002", "textLink");
  });

  /**
   *
   The index attribute indicates th index of this OPTION in ints parent
   SELECT.
   Retrieve the index attribute from the seventh OPTION element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14038413
   */
  specify("HTMLOptionElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(6);
    vindex = testNode.index;
    assert.equal(vindex, 1, "indexLink");
  });

  /**
   *
   The disabled attribute indicates that this control is not available
   within this context.
   Retrieve the disabled attribute from the last OPTION element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-23482473
   */
  specify("HTMLOptionElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vdisabled;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(9);
    vdisabled = testNode.disabled;
    assert.ok(vdisabled, 'disabledLink');
  });

  /**
   *
   The label attribute is used in hierarchical menus.  It specifies
   a shorter label for an option that the content of the OPTION element.
   Retrieve the label attribute from the second OPTION element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40736115
   */
  specify("HTMLOptionElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vlabel;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(1);
    vlabel = testNode.label;
    assert.equal(vlabel, "l1", "labelLink");
  });

  /**
   *
   The selected attribute indicates the current state of the corresponding
   form control in an interactive user-agent.
   Retrieve the selected attribute from the first OPTION element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70874476
   */
  specify("HTMLOptionElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vselected;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(0);
    vselected = testNode.defaultSelected;
    assert.ok(vselected, 'selectedLink');
  });

  /**
   *
   The value attribute contains the current form control value.
   Retrieve the value attribute from the first OPTION element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6185554
   */
  specify("HTMLOptionElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("option");
    nodeList = doc.getElementsByTagName("option");
    assert.equal(nodeList.length, 10, 'Asize');
    testNode = nodeList.item(0);
    vvalue = testNode.value;
    assert.equal(vvalue, "10001", "valueLink");
  });

  /**
   *
   The selected attribute of an option should be true if no other option is
   selected in the SELECT.
   */
  specify("HTMLOptionElement10", () => {
    var doc;
    doc = load("option");
    var select = doc.getElementsByName('select2').item(0);
    Array.prototype.forEach.call(select.options, function(option, idx) {
      if (idx === 0) {
        assert.ok(option.selected);
      } else {
        assert.ok(!option.selected);
      }
    });
  });

  /**
   *
   The selected value of an option should be based on whether or not
   it has been selected and/or by default if it is at index 0
   */
  specify("HTMLOptionElement11", () => {
    var doc;
    doc = load("option");
    var select = doc.getElementsByName('select2').item(0);

    select.options.item(3).selected = true;

    Array.prototype.forEach.call(select.options, function(option, idx) {
      if (idx === 3) {
        assert.ok(option.selected);
      } else {
        assert.ok(!option.selected);
      }
    });
  });

  /**
   *
   An orphaned option element should maintain it's existing selected value.

   based on experiements in chrome
   */
  specify("HTMLOptionElement12", () => {
    var doc;
    doc = load("option");
    var select = doc.getElementsByName('select2').item(0);

    select.options.item(0).selected = true;

    var option = select.options.item(0);
    select.remove(0);

    assert.ok(!option.parentNode);
    assert.ok(option.selected);
    assert.ok(option !== select.options.item(0));
    assert.ok(select.options.item(0).selected);

  });

  /**
   *
   An HTMLOptionsCollection is a list of nodes representing HTML option
   element.
   The length attribute specifies the length or size of the list.
   Retrieve the first SELECT element and create a HTMLOptionsCollection
   of the OPTION elements.  Check the size of the length of OPTION elements.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTMLOptionsCollection-length
   */
  specify("HTMLOptionsCollection01", () => {
    var success;
    var nodeList;
    var testNode;
    var optionsList;
    var vlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optionscollection");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    optionsList = testNode.options;
    vlength = optionsList.length;
    assert.equal(vlength, 5, "lengthLink");
  });

  /**
   *
   An HTMLOptionsCollection is a list of nodes representing HTML option
   element.
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test ordinal index=3).
   The item() method retrieves a node specified by ordinal index.
   Nodes are numbered in tree order.  The index origin is 0.
   Retrieve the first SELECT element.  Create a HTMLOptionsCollection.
   Retrieve the fourth item in the list and examine its firstChild's
   nodeValue.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTMLOptionsCollection-item
   */
  specify("HTMLOptionsCollection02", () => {
    var success;
    var nodeList;
    var testNode;
    var optionsNode;
    var optionsValueNode;
    var optionsList;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optionscollection");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    optionsList = testNode.options;
    optionsNode = optionsList.item(3);
    optionsValueNode = optionsNode.firstChild;
    vvalue = optionsValueNode.nodeValue;
    assert.equal(vvalue, "EMP10004", "valueIndexLink");
  });

  /**
   *
   An HTMLOptionsCollection is a list of nodes representing HTML option
   element.
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test node name).
   The namedItem method retrieves a Node using a name.  It first searches
   for a node with a matching id attribute.  If it doesn't find one, it
   then searches for a Node with a matching name attribute, but only
   those elements that are allowed a name attribute.
   Retrieve the first FORM element.  Create a HTMLCollection of the elements.
   Search for an element that has select1 as the value for the name attribute.
   Get the nodeName of that element.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTMLOptionsCollection-namedItem
   */
  specify("HTMLOptionsCollection03", () => {
    var success;
    var nodeList;
    var testNode;
    var optionsNode;
    var formsnodeList;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optionscollection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    optionsNode = formsnodeList.namedItem("select1");
    vname = optionsNode.nodeName;
    assert.equal(vname, 'SELECT', 'nameIndexLink');
  });

  /**
   *
   An HTMLOptionsCollection is a list of nodes representing HTML option
   element.
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test node name).
   The namedItem method retrieves a Node using a name.  It first searches
   for a node with a matching id attribute.  If it doesn't find one, it
   then searches for a Node with a matching name attribute, but only
   those elements that are allowed a name attribute.
   Retrieve the first FORM element.  Create a HTMLCollection of the elements.
   Search for an element that has selectId as the value for the id attribute.
   Get the nodeName of that element.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTMLOptionsCollection-namedItem
   */
  specify("HTMLOptionsCollection04", () => {
    var success;
    var nodeList;
    var testNode;
    var optionsNode;
    var formsnodeList;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optionscollection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    optionsNode = formsnodeList.namedItem("selectId");
    vname = optionsNode.nodeName;
    assert.equal(vname, 'SELECT', 'nameIndexLink');
  });

  /**
   *
   An HTMLOptionsCollection is a list of nodes representing HTML option
   element.
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test node name).
   The namedItem method retrieves a Node using a name.  It first searches
   for a node with a matching id attribute.  If it doesn't find one, it
   then searches for a Node with a matching name attribute, but only
   those elements that are allowed a name attribute.  Upon failure(e.q., no
   node with this name exists), returns null.
   Retrieve the first FORM element.  Create a HTMLCollection of the elements.
   Search for an element that has select9 as the value for the name attribute.
   Null should be returned since there is not any name or id attribute with
   select9 as a value.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTMLOptionsCollection-namedItem
   */
  specify("HTMLOptionsCollection05", () => {
    var success;
    var nodeList;
    var testNode;
    var optionsNode;
    var formsnodeList;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optionscollection");
    nodeList = doc.getElementsByTagName("form");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    formsnodeList = testNode.elements;
    optionsNode = formsnodeList.namedItem("select9");
    assert.equal(optionsNode, null, 'optionsNode should be null');
  });

  /**
   *
   An HTMLOptionsCollection is a list of nodes representing HTML option
   element.
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test ordinal index).
   The item() method retrieves a node specified by ordinal index.
   A value of null is returned if the index is out of range.
   Retrieve the first SELECT element.  Create a HTMLOptionsCollection.
   Retrieve the tenth item in the list - null should be returned since
   there are not 10 items in the list.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTMLOptionsCollection-item
   */
  specify("HTMLOptionsCollection06", () => {
    var success;
    var nodeList;
    var testNode;
    var optionsNode;
    var optionsValueNode;
    var optionsList;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optionscollection");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    optionsList = testNode.options;
    optionsNode = optionsList.item(10);
    assert.equal(optionsNode, null, 'optionsNode should be null');
  });

  /**
   *
   An HTMLOptionsCollection is a list of nodes representing HTML option
   element.
   An individual node may be accessed by either ordinal index, the node's
   name or id attributes.  (Test ordinal index=0).
   The item() method retrieves a node specified by ordinal index. Nodes
   are numbered in tree order.  The index origin is 0.
   Retrieve the first SELECT element.  Create a HTMLOptionsCollection.
   Retrieve the first item in the list and examine its firstChild's
   nodeValue.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTMLOptionsCollection-item
   */
  specify("HTMLOptionsCollection07", () => {
    var success;
    var nodeList;
    var testNode;
    var optionsNode;
    var optionsValueNode;
    var optionsList;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("optionscollection");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    optionsList = testNode.options;
    optionsNode = optionsList.item(0);
    optionsValueNode = optionsNode.firstChild;
    vvalue = optionsValueNode.nodeValue;
    assert.equal(vvalue, "EMP10001", "valueIndexLink");
  });

  /**
   *
   The align attribute specifies the horizontal text alignment.
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53465507
   */
  specify("HTMLParagraphElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("paragraph");
    nodeList = doc.getElementsByTagName("p");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The  name attribute specifies the name of the run-time parameter.
   Retrieve the name attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59871447
   */
  specify("HTMLParamElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("param");
    nodeList = doc.getElementsByTagName("param");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "image3", "nameLink");
  });

  /**
   *
   The value attribute specifies the value of the run-time parameter.
   Retrieve the value attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77971357
   */
  specify("HTMLParamElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("param");
    nodeList = doc.getElementsByTagName("param");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvalue = testNode.value;
    assert.equal(vvalue, 'image/file.gif', 'valueLink');
  });

  /**
   *
   The valueType attribute specifies information about the meaning of the
   value specified by the value attribute.
   Retrieve the valueType attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-23931872
   */
  specify("HTMLParamElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vvaluetype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("param");
    nodeList = doc.getElementsByTagName("param");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvaluetype = testNode.valueType;
    assert.equal(vvaluetype, "ref", "valueTypeLink");
  });

  /**
   *
   The type attribute specifies the content type for the value attribute
   when valuetype has the value ref.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18179888
   */
  specify("HTMLParamElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("param");
    nodeList = doc.getElementsByTagName("param");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "image/gif", "typeLink");
  });

  /**
   *
   The width attribute specifies the fixed width for content.
   Retrieve the width attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-13894083
   */
  specify("HTMLPreElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("pre");
    nodeList = doc.getElementsByTagName("pre");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, 277, "widthLink");
  });

  /**
   *
   The cite attribute specifies a URI designating a source document
   or message.
   Retrieve the cite attribute from the Q element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53895598
   */
  specify("HTMLQuoteElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcite;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("quote");
    nodeList = doc.getElementsByTagName("q");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcite = testNode.cite;
    assert.isTrue(vcite.endsWith('/files/Q.html'), 'citeLink');
  });

  /**
   *
   The cite attribute specifies a URI designating a source document
   or message.
   Retrieve the cite attribute from the BLOCKQUOTE element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53895598
   */
  specify("HTMLQuoteElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcite;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("quote");
    nodeList = doc.getElementsByTagName("blockquote");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcite = testNode.cite;
    assert.isTrue(vcite.endsWith('/files/BLOCKQUOTE.html'), 'citeLink');
  });

  /**
   *
   The text attribute specifies the script content of the element.
   Retrieve the text attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46872999
   */
  specify("HTMLScriptElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vtext;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("script");
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtext = testNode.text;
    assert.equal(vtext, "var a=2;", "textLink");
  });

  /**
   *
   The charset attribute specifies the character encoding of the linked
   resource.
   Retrieve the charset attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35305677
   */
  specify("HTMLScriptElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharset;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("script");
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcharset = testNode.charset;
    assert.equal(vcharset, "US-ASCII", "charsetLink");
  });

  /**
   *
   The defer attribute specifies the user agent can defer processing of
   the script.
   Retrieve the defer attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93788534
   */
  specify("HTMLScriptElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vdefer;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("script");
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vdefer = testNode.defer;
    assert.ok(vdefer, 'deferLink');
  });

  /**
   *
   The src attribute specifies a URI designating an external script.
   Retrieve the src attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75147231
   */
  specify("HTMLScriptElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vsrc;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("script");
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vsrc = testNode.src;
    assert.equal(vsrc, toFileUrl('html/files/js/script1.js'), 'srcLink');
  });

  /**
   *
   The type attribute specifies the content of the script language.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30534818
   */
  specify("HTMLScriptElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("script");
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "text/javaScript", "typeLink");
  });

  /**
   *
   htmlFor is described as for future use.  Test accesses the value, but makes no assertions about its value.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66979266
   */
  specify("HTMLScriptElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var htmlFor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("script");
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    htmlFor = testNode.htmlFor;
  });

  /**
   *
   event is described as for future use.  Test accesses the value, but makes no assertions about its value.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-56700403
   */
  specify("HTMLScriptElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var event;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("script");
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    event = testNode.event;
  });

  /**
   *
   Tests that when document.write is used from within a script tag, the contents will be output after the script element.  Guards against regression
   * @author Kyle Blomquist
   */

  specify("HTMLScriptElement08", () => {
    var success;
    var scriptNode;
    var testNode;
    var isAfterScript;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("scriptinline", { runScripts: "dangerously", resources: "usable" });
    nodeList = doc.getElementsByTagName("script");
    assert.equal(nodeList.length, 1, 'Asize');
    scriptNode = nodeList.item(0);
    testNode = doc.getElementById("inlinetest");
    assert.equal(testNode.innerHTML, 'Test', '#inlinetest exists and contains correct text')
    isAfterScript = testNode.previousSibling.isEqualNode(scriptNode);
    assert.equal(isAfterScript, true, '#inlinetest is correctly placed after the script tag that created it');
  });

  /**
   *
   Tests that when document.write is used from within a script tag, the rest of the contents of the page will not be altered.  Guards against regression
   * @author Kyle Blomquist
   */

  specify("HTMLScriptElement09", () => {
    var success;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("scriptinline");
    testNode = doc.getElementById("existingtag");
    assert.equal(testNode.innerHTML, 'Hello World', '#inlinetest exists and contains correct text')
  });

  /**
   *
   The type attribute is the string "select-multiple" when multiple
   attribute is true.
   Retrieve the type attribute from the first SELECT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58783172
   */
  specify("HTMLSelectElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "select-multiple", "typeLink");
  });

  /**
   *
   The selectedIndex attribute specifies the ordinal index of the selected
   option.
   Retrieve the selectedIndex attribute from the first SELECT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-85676760
   */
  specify("HTMLSelectElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vselectedindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vselectedindex = testNode.selectedIndex;
    assert.equal(vselectedindex, 0, "selectedIndexLink");
  });

  /**
   *
   The selectedIndex attribute specifies the ordinal index of the selected
   option.  If no element is selected -1 is returned.
   Retrieve the selectedIndex attribute from the second SELECT element and
   examine its value.
   Per http://www.w3.org/TR/html401/interact/forms.html#h-17.6.1,
   without an explicit selected attribute, user agent behavior is
   undefined.  There is no way to coerce no option to be selected.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-85676760
   */
  specify("HTMLSelectElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vselectedindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vselectedindex = testNode.selectedIndex;
  });

  /**
   *
   The value attribute specifies the current form control value.
   Retrieve the value attribute from the first SELECT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59351919
   */
  specify("HTMLSelectElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vvalue = testNode.value;
    assert.equal(vvalue, "EMP1", "valueLink");
  });

  /**
   *
   The length attribute specifies the number of options in this select.
   Retrieve the length attribute from the first SELECT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-5933486
   */
  specify("HTMLSelectElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vlength;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vlength = testNode.length;
    assert.equal(vlength, 5, "lengthLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute from the first SELECT element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20489458
   */
  specify("HTMLSelectElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var fNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form1", "formLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   a form.
   Retrieve the second SELECT element and
   examine its form element.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20489458
   */
  specify("HTMLSelectElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The options attribute returns a collection of OPTION elements contained
   by this element.
   Retrieve the options attribute from the first SELECT element and
   examine the items of the returned collection.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30606413
   */
  specify("HTMLSelectElement08", () => {
    var expectedOptions = ['OPTION', 'OPTION', 'OPTION', 'OPTION', 'OPTION']
    var doc = load("select");
    var nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    var result = [];
    var options = nodeList.item(0).options;
    for(var i=0;i<options.length; i++) {
      result.push(options.item(i).nodeName);
    }
    assert.deepEqual(result, expectedOptions, 'optionsLink');
  });

  /**
   *
   The disabled attribute indicates that this control is not available
   within this context.
   Retrieve the disabled attribute from the third SELECT element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79102918
   */
  specify("HTMLSelectElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vdisabled;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(2);
    vdisabled = testNode.disabled;
    assert.ok(vdisabled, 'disabledLink');
  });

  /**
   *
   The multiple attribute(if true) indicates that multiple OPTION elements
   may be selected
   Retrieve the multiple attribute from the first SELECT element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-13246613
   */
  specify("HTMLSelectElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vmultiple;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vmultiple = testNode.multiple;
    assert.ok(vmultiple, 'multipleLink');
  });

  /**
   *
   The name attribute specifies the form control or object name when
   submitted with a form.
   Retrieve the name attribute from the first SELECT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-41636323
   */
  specify("HTMLSelectElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "select1", "nameLink");
  });

  /**
   *
   The size attribute specifies the number of visible rows.
   Retrieve the size attribute from the first SELECT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18293826
   */
  specify("HTMLSelectElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vsize;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vsize = testNode.size;
    assert.equal(vsize, 1, "sizeLink");
  });

  /**
   *
   The tabIndex attribute specifies an index that represents the elements
   position in the tabbing order.
   Retrieve the tabIndex attribute from the first SELECT element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40676705
   */
  specify("HTMLSelectElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 7, "tabIndexLink");
  });

  /**
   *
   focus should give the select element input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32130014
   */
  specify("HTMLSelectElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    testNode.focus();
  });

  /**
   *
   blur should surrender input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-28216144
   */
  specify("HTMLSelectElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    testNode.blur();
  });

  /**
   *
   Removes an option using HTMLSelectElement.remove.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33404570
   */
  specify("HTMLSelectElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var optLength;
    var selected;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    testNode.remove(0);
    optLength = testNode.length;
    assert.equal(optLength, 4, "optLength");
    selected = testNode.selectedIndex;
    assert.equal(selected, -1, "selected");
  });

  /**
   *
   Removes a non-existant option using HTMLSelectElement.remove.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33404570
   */
  specify("HTMLSelectElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var optLength;
    var selected;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    testNode.remove(6);
    optLength = testNode.length;
    assert.equal(optLength, 5, "optLength");
    selected = testNode.selectedIndex;
    assert.equal(selected, 0, "selected");
  });

  /**
   *
   Add a new option at the end of an select using HTMLSelectElement.add.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14493106
   */
  specify("HTMLSelectElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var optLength;
    var selected;
    var newOpt;
    var newOptText;
    var opt;
    var optText;
    var optValue;
    var retNode;
    var nullNode = null;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    newOpt = doc.createElement("option");
    newOptText = doc.createTextNode("EMP31415");
    retNode = newOpt.appendChild(newOptText);
    testNode.add(newOpt,nullNode);
    optLength = testNode.length;
    assert.equal(optLength, 6, "optLength");
    selected = testNode.selectedIndex;
    assert.equal(selected, 0, "selected");
    opt = testNode.lastChild;
    optText = opt.firstChild;
    optValue = optText.nodeValue;
    assert.equal(optValue, "EMP31415", "lastValue");
  });

  /**
   *
   Add a new option before the selected node using HTMLSelectElement.add.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14493106
   */
  specify("HTMLSelectElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var optLength;
    var selected;
    var newOpt;
    var newOptText;
    var opt;
    var optText;
    var optValue;
    var retNode;
    var options;
    var selectedNode;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    newOpt = doc.createElement("option");
    newOptText = doc.createTextNode("EMP31415");
    retNode = newOpt.appendChild(newOptText);
    options = testNode.options;
    selectedNode = options.item(0);
    testNode.add(newOpt,selectedNode);
    optLength = testNode.length;
    assert.equal(optLength, 6, "optLength");
    selected = testNode.selectedIndex;
    assert.equal(selected, 1, "selected");
    options = testNode.options;
    opt = options.item(0);
    optText = opt.firstChild;
    optValue = optText.nodeValue;
    assert.equal(optValue, "EMP31415", "lastValue");
  });

  /**
   *
   Attempting to add an new option using HTMLSelectElement.add before a node that is not a child of the select
   element should raise a NOT_FOUND_ERR.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-14493106
   */
  specify("HTMLSelectElement20", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var optLength;
    var selected;
    var newOpt;
    var newOptText;
    var retNode;
    var options;
    var otherSelect;
    var selectedNode;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("select");
    nodeList = doc.getElementsByTagName("select");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    otherSelect = nodeList.item(1);
    newOpt = doc.createElement("option");
    newOptText = doc.createTextNode("EMP31415");
    retNode = newOpt.appendChild(newOptText);
    options = otherSelect.options;
    selectedNode = options.item(0);
    {
      success = false;
      try {
        testNode.add(newOpt,selectedNode);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 8);
      }
      assert.ok(success, 'throw_NOT_FOUND_ERR');
    }
  });

  /**
   *
   The media attribute identifies the intended medium of the style info.
   Retrieve the media attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76412738
   */
  specify("HTMLStyleElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vmedia;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("style");
    nodeList = doc.getElementsByTagName("style");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vmedia = testNode.media;
    assert.equal(vmedia, "screen", "mediaLink");
  });

  /**
   *
   The type attribute specifies the style sheet language(Internet media type).
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-22472002
   */
  specify("HTMLStyleElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("style");
    nodeList = doc.getElementsByTagName("style");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "text/css", "typeLink");
  });

  /**
   *
   The align attribute specifies the caption alignment with respect to
   the table.
   Retrieve the align attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79875068
   */
  specify("HTMLTableCaptionElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecaption");
    nodeList = doc.getElementsByTagName("caption");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "top", "alignLink");
  });

  /**
   *
   The  cellIndex attribute specifies the index of this cell in the row(TH).
   Retrieve the cellIndex attribute of the first TH element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-80748363
   */
  specify("HTMLTableCellElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcellindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(0);
    vcellindex = testNode.cellIndex;
    assert.equal(vcellindex, 0, "cellIndexLink");
  });

  /**
   *
   The  cellIndex attribute specifies the index of this cell in the row(TD).
   Retrieve the cellIndex attribute of the first TD element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-80748363
   */
  specify("HTMLTableCellElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcellindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(0);
    vcellindex = testNode.cellIndex;
    assert.equal(vcellindex, 0, "cellIndexLink");
  });

  /**
   *
   The abbr attribute specifies the abbreviation for table header cells(TH).
   Retrieve the abbr attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74444037
   */
  specify("HTMLTableCellElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vabbr;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vabbr = testNode.abbr;
    assert.equal(vabbr, "hd1", "abbrLink");
  });

  /**
   *
   The abbr attribute specifies the abbreviation for table data cells(TD).
   Retrieve the abbr attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74444037
   */
  specify("HTMLTableCellElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vabbr;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vabbr = testNode.abbr;
    assert.equal(vabbr, "hd2", "abbrLink");
  });

  /**
   *
   The align attribute specifies the horizontal alignment for table
   header cells(TH).
   Retrieve the align attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98433879
   */
  specify("HTMLTableCellElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal alignment for table
   data cells(TD).
   Retrieve the align attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98433879
   */
  specify("HTMLTableCellElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The axis attribute specifies the names group of related headers for table
   header cells(TH).
   Retrieve the align attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76554418
   */
  specify("HTMLTableCellElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vaxis;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vaxis = testNode.axis;
    assert.equal(vaxis, "center", "axisLink");
  });

  /**
   *
   The axis attribute specifies the names group of related headers for table
   data cells(TD).
   Retrieve the axis attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76554418
   */
  specify("HTMLTableCellElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vaxis;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vaxis = testNode.axis;
    assert.equal(vaxis, "center", "axisLink");
  });

  /**
   *
   The bgColor attribute specifies the cells background color for
   table header cells(TH).
   Retrieve the bgColor attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88135431
   */
  specify("HTMLTableCellElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor.toLowerCase(), "#00FFFF".toLowerCase(), "bgColorLink");
  });

  /**
   *
   The bgColor attribute specifies the cells background color for table
   data cells(TD).
   Retrieve the bgColor attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88135431
   */
  specify("HTMLTableCellElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor.toLowerCase(), "#FF0000".toLowerCase(), "bgColorLink");
  });

  /**
   *
   The char attribute specifies the alignment character for cells in a column
   of table header cells(TH).
   Retrieve the char attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30914780
   */
  specify("HTMLTableCellElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vch = testNode.ch;
    assert.equal(vch, ":", "chLink");
  });

  /**
   *
   The char attribute specifies the alignment character for cells in a column
   of table data cells(TD).
   Retrieve the char attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30914780
   */
  specify("HTMLTableCellElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vch = testNode.ch;
    assert.equal(vch, ":", "chLink");
  });

  /**
   *
   The charoff attribute specifies the offset of alignment characacter
   of table header cells(TH).
   Retrieve the charoff attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20144310
   */
  specify("HTMLTableCellElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vcharoff = testNode.chOff;
    assert.equal(vcharoff, "1", "chOffLink");
  });

  /**
   *
   The charoff attribute specifies the offset of alignment character
   of table data cells(TD).
   Retrieve the charoff attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20144310
   */
  specify("HTMLTableCellElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vcharoff = testNode.chOff;
    assert.equal(vcharoff, "1", "chOffLink");
  });

  /**
   *
   The colSpan attribute specifies the number of columns spanned by a table
   header(TH) cell.
   Retrieve the colspan attribute of the second TH element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84645244
   */
  specify("HTMLTableCellElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var vcolspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vcolspan = testNode.colSpan;
    assert.equal(vcolspan, 1, "colSpanLink");
  });

  /**
   *
   The colSpan attribute specifies the number of columns spanned by a
   table data(TD) cell.
   Retrieve the colSpan attribute of the second TD element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84645244
   */
  specify("HTMLTableCellElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var vcolspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vcolspan = testNode.colSpan;
    assert.equal(vcolspan, 1, "colSpanLink");
  });

  /**
   *
   The headers attribute specifies a list of id attribute values for
   table header cells(TH).
   Retrieve the headers attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89104817
   */
  specify("HTMLTableCellElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var vheaders;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vheaders = testNode.headers;
    assert.equal(vheaders, "header-1", "headersLink");
  });

  /**
   *
   The headers attribute specifies a list of id attribute values for
   table data cells(TD).
   Retrieve the headers attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89104817
   */
  specify("HTMLTableCellElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var vheaders;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vheaders = testNode.headers;
    assert.equal(vheaders, "header-3", "headersLink");
  });

  /**
   *
   The height attribute specifies the cell height.
   Retrieve the height attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83679212
   */
  specify("HTMLTableCellElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var vheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vheight = testNode.height;
    assert.equal(vheight, "50", "heightLink");
  });

  /**
   *
   The height attribute specifies the cell height.
   Retrieve the height attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83679212
   */
  specify("HTMLTableCellElement20", () => {
    var success;
    var nodeList;
    var testNode;
    var vheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vheight = testNode.height;
    assert.equal(vheight, "50", "heightLink");
  });

  /**
   *
   The noWrap attribute supresses word wrapping.
   Retrieve the noWrap attribute of the second TH Element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62922045
   */
  specify("HTMLTableCellElement21", () => {
    var success;
    var nodeList;
    var testNode;
    var vnowrap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vnowrap = testNode.noWrap;
    assert.ok(vnowrap, 'noWrapLink');
  });

  /**
   *
   The noWrap attribute supresses word wrapping.
   Retrieve the noWrap attribute of the second TD Element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62922045
   */
  specify("HTMLTableCellElement22", () => {
    var success;
    var nodeList;
    var testNode;
    var vnowrap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vnowrap = testNode.noWrap;
    assert.ok(vnowrap, 'noWrapLink');
  });

  /**
   *
   The rowSpan attribute specifies the number of rows spanned by a table
   header(TH) cell.
   Retrieve the rowSpan attribute of the second TH element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48237625
   */
  specify("HTMLTableCellElement23", () => {
    var success;
    var nodeList;
    var testNode;
    var vrowspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vrowspan = testNode.rowSpan;
    assert.equal(vrowspan, 1, "rowSpanLink");
  });

  /**
   *
   The rowSpan attribute specifies the number of rows spanned by a
   table data(TD) cell.
   Retrieve the rowSpan attribute of the second TD element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48237625
   */
  specify("HTMLTableCellElement24", () => {
    var success;
    var nodeList;
    var testNode;
    var vrowspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vrowspan = testNode.rowSpan;
    assert.equal(vrowspan, 1, "rowSpanLink");
  });

  /**
   *
   The scope attribute specifies the scope covered by header cells.
   Retrieve the scope attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36139952
   */
  specify("HTMLTableCellElement25", () => {
    var success;
    var nodeList;
    var testNode;
    var vscope;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vscope = testNode.scope;
    assert.equal(vscope, "col", "scopeLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of data in cell.
   Retrieve the vAlign attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58284221
   */
  specify("HTMLTableCellElement27", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of data in cell.
   Retrieve the vAlign attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58284221
   */
  specify("HTMLTableCellElement28", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The width attribute specifies the cells width.
   Retrieve the width attribute from the second TH element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27480795
   */
  specify("HTMLTableCellElement29", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("th");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vwidth = testNode.width;
    assert.equal(vwidth, "170", "widthLink");
  });

  /**
   *
   The width attribute specifies the cells width.
   Retrieve the width attribute from the second TD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27480795
   */
  specify("HTMLTableCellElement30", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vwidth = testNode.width;
    assert.equal(vwidth, "175", "widthLink");
  });

  /**
   *
   The align attribute specifies the horizontal alignment of cell data
   in column(COL).
   Retrieve the align attribute from the COL element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-31128447
   */
  specify("HTMLTableColElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal alignment of cell data
   in column(COLGROUP).
   Retrieve the align attribute from the COLGROUP element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-31128447
   */
  specify("HTMLTableColElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("colgroup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The char attribute specifies the alignment character for cells
   in a column(COL).
   Retrieve the char attribute from the COL element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9447412
   */
  specify("HTMLTableColElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vch = testNode.ch;
    assert.equal(vch, "*", "chLink");
  });

  /**
   *
   The char attribute specifies the alignment character for cells
   in a column(COLGROUP).
   Retrieve the char attribute from the COLGROUP element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9447412
   */
  specify("HTMLTableColElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("colgroup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vch = testNode.ch;
    assert.equal(vch, "$", "chLink");
  });

  /**
   *
   The charoff attribute specifies offset of alignment character(COL).
   Retrieve the charoff attribute from the COL element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57779225
   */
  specify("HTMLTableColElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vchoff = testNode.chOff;
    assert.equal(vchoff, "20", "chLink");
  });

  /**
   *
   The charoff attribute specifies offset of alignment character(COLGROUP).
   Retrieve the charoff attribute from the COLGROUP element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57779225
   */
  specify("HTMLTableColElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("colgroup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vchoff = testNode.chOff;
    assert.equal(vchoff, "15", "chLink");
  });

  /**
   *
   The span attribute indicates the number of columns in a group or affected
   by a grouping(COL).
   Retrieve the span attribute of the COL element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96511335
   */
  specify("HTMLTableColElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vspan = testNode.span;
    assert.equal(vspan, 1, "spanLink");
  });

  /**
   *
   The span attribute indicates the number of columns in a group or affected
   by a grouping(COLGROUP).
   Retrieve the span attribute of the COLGROUP element and examine its
   value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96511335
   */
  specify("HTMLTableColElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("colgroup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vspan = testNode.span;
    assert.equal(vspan, 2, "spanLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of cell data
   in column(COL).
   Retrieve the vAlign attribute from the COL element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83291710
   */
  specify("HTMLTableColElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of cell data
   in column(COLGROUP).
   Retrieve the vAlign attribute from the COLGROUP element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83291710
   */
  specify("HTMLTableColElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("colgroup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The width attribute specifies the default column width(COL).
   Retrieve the width attribute from the COL element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25196799
   */
  specify("HTMLTableColElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, "20", "widthLink");
  });

  /**
   *
   The width attribute specifies the default column width(COLGORUP).
   Retrieve the width attribute from the COLGROUP element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25196799
   */
  specify("HTMLTableColElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("colgroup");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, "20", "widthLink");
  });

  /**
   *
   The caption attribute returns the tables CAPTION.
   Retrieve the align attribute of the CAPTION element from the second
   TABLE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14594520
   */
  specify("HTMLTableElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcaption;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vcaption = testNode.caption;
    valign = vcaption.align;
    assert.equal(valign, "top", "alignLink");
  });

  /**
   *
   The caption attribute returns the tables CAPTION or void if it does not
   exist.
   Retrieve the CAPTION element from within the first TABLE element.
   Since one does not exist it should be void.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14594520
   */
  specify("HTMLTableElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcaption;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vcaption = testNode.caption;
    assert.equal(vcaption, null, 'vcaption should be null');
  });

  /**
   *
   The tHead attribute returns the tables THEAD.
   Retrieve the align attribute of the THEAD element from the second
   TABLE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
   */
  specify("HTMLTableElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tHead;
    valign = vsection.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The tHead attribute returns the tables THEAD or null if it does not
   exist.
   Retrieve the THEAD element from within the first TABLE element.
   Since one does not exist it should be null.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
   */
  specify("HTMLTableElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vsection = testNode.tHead;
    assert.equal(vsection, null, 'vsection should be null');
  });

  /**
   *
   The tFoot attribute returns the tables TFOOT.
   Retrieve the align attribute of the TFOOT element from the second
   TABLE element and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("HTMLTableElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tFoot;
    valign = vsection.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The tFoot attribute returns the tables TFOOT or null if it does not
   exist.
   Retrieve the TFOOT element from within the first TABLE element.
   Since one does not exist it should be null.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("HTMLTableElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vsection = testNode.tFoot;
    assert.equal(vsection, null, 'vsection should be null');
  });

  /**
   *
   The rows attribute returns a collection of all the rows in the table,
   including al in THEAD, TFOOT, all TBODY elements.
   Retrieve the rows attribute from the second TABLE element and
   examine the items of the returned collection.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6156016
   */
  specify("HTMLTableElement07", () => {
    var expectedOptions = ['TR', 'TR' ,'TR' ,'TR'];
    var doc = load("table");
    var nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    var rows = nodeList.item(1).rows;
    var result = [];
    for(var i=0;i<rows.length;i++) {
      result.push(rows.item(i).nodeName);
    }
    assert.deepEqual(result, expectedOptions, 'rowsLink');
  });

  /**
   *
   The tBodies attribute returns a collection of all the defined
   table bodies.
   Retrieve the tBodies attribute from the second TABLE element and
   examine the items of the returned collection.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63206416
   */
  specify("HTMLTableElement08", () => {
    var expectedOptions = ["TBODY"];
    var doc = load("table");
    var nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    tbodies = nodeList.item(1).tBodies;
    var result = [];
    for(var i=0;i<tbodies.length;i++) {
      result.push(tbodies.item(i).nodeName);
    }
    assert.deepEqual(result, expectedOptions, 'tbodiesLink');
  });

  /**
   *
   The tBodies attribute returns a collection of all the defined
   table bodies.
   Retrieve the tBodies attribute from the third TABLE element and
   examine the items of the returned collection. Tests multiple TBODY
   elements.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63206416
   */
  specify("HTMLTableElement09", () => {
    var expectedOptions = ['TBODY', 'TBODY', 'TBODY'];
    var doc = load("table");
    var nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    var tbodies = nodeList.item(2).tBodies;
    var result = [];
    for(var i=0;i<tbodies.length;i++) {
      result.push(tbodies.item(i).nodeName);
    }
    assert.deepEqual(result, expectedOptions, 'tbodiesLink');
  });

  /**
   *
   The align attribute specifies the table's position with respect to the
   rest of the document.
   Retrieve the align attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-23180977
   */
  specify("HTMLTableElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The bgColor attribute specifies cell background color.
   Retrieve the bgColor attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83532985
   */
  specify("HTMLTableElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor, "#ff0000", "bgColorLink");
  });

  /**
   *
   The border attribute specifies the width of the border around the table.
   Retrieve the border attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-50969400
   */
  specify("HTMLTableElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vborder;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vborder = testNode.border;
    assert.equal(vborder, "4", "borderLink");
  });

  /**
   *
   The cellpadding attribute specifies the horizontal and vertical space
   between cell content and cell borders.
   Retrieve the cellpadding attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59162158
   */
  specify("HTMLTableElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var vcellpadding;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vcellpadding = testNode.cellPadding;
    assert.equal(vcellpadding, "2", "cellPaddingLink");
  });

  /**
   *
   The cellSpacing attribute specifies the horizontal and vertical separation
   between cells.
   Retrieve the cellSpacing attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68907883
   */
  specify("HTMLTableElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var cellSpacing;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    cellSpacing = testNode.cellSpacing;
    assert.equal(cellSpacing, "2", "cellSpacingLink");
  });

  /**
   *
   The frame attribute specifies which external table borders to render.
   Retrieve the frame attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64808476
   */
  specify("HTMLTableElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var vframe;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vframe = testNode.frame;
    assert.equal(vframe, "border", "frameLink");
  });

  /**
   *
   The rules attribute specifies which internal table borders to render.
   Retrieve the rules attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-26347553
   */
  specify("HTMLTableElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var vrules;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vrules = testNode.rules;
    assert.equal(vrules, "all", "rulesLink");
  });

  /**
   *
   The summary attribute is a description about the purpose or structure
   of a table.
   Retrieve the summary attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-44998528
   */
  specify("HTMLTableElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var vsummary;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsummary = testNode.summary;
    assert.equal(vsummary, "HTML Control Table", "summaryLink");
  });

  /**
   *
   The width attribute specifies the desired table width.
   Retrieve the width attribute of the first TABLE element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77447361
   */
  specify("HTMLTableElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vwidth = testNode.width;
    assert.equal(vwidth, "680", "widthLink");
  });

  /**
   *
   The createTHead() method creates a table header row or returns
   an existing one.
   Create a new THEAD element on the first TABLE element.  The first
   TABLE element should return null to make sure one doesn't exist.
   After creation of the THEAD element the value is once again
   checked and should not be null.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70313345
   */
  specify("HTMLTableElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection1;
    var vsection2;
    var newHead;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vsection1 = testNode.tHead;
    assert.equal(vsection1, null, 'vsection1 should be null');
    newHead = testNode.createTHead();
    vsection2 = testNode.tHead;
    assert.notEqual(vsection2, null, 'vsection2 should not be null');
  });

  /**
   *
   The createTHead() method creates a table header row or returns
   an existing one.
   Try to create a new THEAD element on the second TABLE element.
   Since a THEAD element already exists in the TABLE element a new
   THEAD element is not created and information from the already
   existing THEAD element is returned.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70313345
   */
  specify("HTMLTableElement20", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var newHead;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    newHead = testNode.createTHead();
    vsection = testNode.tHead;
    valign = vsection.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The deleteTHead() method deletes the header from the table.
   The deleteTHead() method will delete the THEAD Element from the
   second TABLE element.  First make sure that the THEAD element exists
   and then count the number of rows.  After the THEAD element is
   deleted there should be one less row.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-38310198
   */
  specify("HTMLTableElement21", () => {
    var success;
    var nodeList;
    var rowsnodeList;
    var testNode;
    var vsection1;
    var vsection2;
    var vrows;
    var doc;
    var result = new Array();
    expectedResult = new Array();
    expectedResult[0] = 4;
    expectedResult[1] = 3;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsection1 = testNode.tHead;
    assert.notEqual(vsection1, null, 'vsection1 should not be null');
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    result[result.length] = vrows;
    testNode.deleteTHead();
    vsection2 = testNode.tHead;
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    result[result.length] = vrows;
    assert.deepEqual(result, expectedResult, 'rowsLink');
  });

  /**
   *
   The createTFoot() method creates a table footer row or returns
   an existing one.
   Create a new TFOOT element on the first TABLE element.  The first
   TABLE element should return null to make sure one doesn't exist.
   After creation of the TFOOT element the value is once again
   checked and should not be null.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8453710
   */
  specify("HTMLTableElement22", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection1;
    var vsection2;
    var newFoot;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vsection1 = testNode.tFoot;
    assert.equal(vsection1, null, 'vsection1 should be null');
    newFoot = testNode.createTFoot();
    vsection2 = testNode.tFoot;
    assert.notEqual(vsection2, null, 'vsection2 should not be null');
  });

  /**
   *
   The createTFoot() method creates a table footer row or returns
   an existing one.
   Try to create a new TFOOT element on the second TABLE element.
   Since a TFOOT element already exists in the TABLE element a new
   TFOOT element is not created and information from the already
   existing TFOOT element is returned.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8453710
   */
  specify("HTMLTableElement23", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var newFoot;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    newFoot = testNode.createTFoot();
    vsection = testNode.tFoot;
    valign = vsection.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The deleteTFoot() method deletes the footer from the table.
   The deleteTFoot() method will delete the TFOOT Element from the
   second TABLE element.  First make sure that the TFOOT element exists
   and then count the number of rows.  After the TFOOT element is
   deleted there should be one less row.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78363258
   */
  specify("HTMLTableElement24", () => {
    var success;
    var nodeList;
    var rowsnodeList;
    var testNode;
    var vsection1;
    var vsection2;
    var vrows;
    var doc;
    var result = new Array();
    expectedResult = new Array();
    expectedResult[0] = 4;
    expectedResult[1] = 3;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsection1 = testNode.tFoot;
    assert.notEqual(vsection1, null, 'vsection1 should not be null');
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    result[result.length] = vrows;
    testNode.deleteTFoot();
    vsection2 = testNode.tFoot;
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    result[result.length] = vrows;
    assert.deepEqual(result, expectedResult, 'rowsLink');
  });

  /**
   *
   The createCaption() method creates a new table caption object or returns
   an existing one.
   Create a new CAPTION element on the first TABLE element.  Since
   one does not currently exist the CAPTION element is created.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96920263
   */
  specify("HTMLTableElement25", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection1;
    var vsection2;
    var newCaption;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vsection1 = testNode.caption;
    assert.equal(vsection1, null, 'vsection1 should be null');
    newCaption = testNode.createCaption();
    vsection2 = testNode.caption;
    assert.notEqual(vsection2, null, 'vsection2 should not be null');
  });

  /**
   *
   The createCaption() method creates a new table caption object or returns
   an existing one.
   Create a new CAPTION element on the first TABLE element.  Since
   one currently exists the CAPTION element is not created and you
   can get the align attribute from the CAPTION element that exists.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96920263
   */
  specify("HTMLTableElement26", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection1;
    var vcaption;
    var newCaption;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsection1 = testNode.caption;
    assert.notEqual(vsection1, null, 'vsection1 should not be null');
    newCaption = testNode.createCaption();
    vcaption = testNode.caption;
    valign = vcaption.align;
    assert.equal(valign, "top", "alignLink");
  });

  /**
   *
   The deleteCaption() method deletes the table caption.
   Delete the CAPTION element on the second TABLE element.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-22930071
   */
  specify("HTMLTableElement27", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection1;
    var vsection2;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsection1 = testNode.caption;
    assert.notEqual(vsection1, null, 'vsection1 should not be null');
    testNode.deleteCaption();
    vsection2 = testNode.caption;
    assert.equal(vsection2, null, 'vsection2 should be null');
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the second TABLE element and invoke the insertRow() method
   with an index of 0. Currently the zero indexed row is in the THEAD
   section of the TABLE.  The number of rows in the THEAD section before
   insertion of the new row is one.  After the new row is inserted the number
   of rows in the THEAD section is two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39872903
   */
  specify("HTMLTableElement28", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vsection1;
    var vsection2;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsection1 = testNode.tHead;
    rowsnodeList = vsection1.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    newRow = testNode.insertRow(0);
    vsection2 = testNode.tHead;
    rowsnodeList = vsection2.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink2");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the second TABLE element and invoke the insertRow() method
   with an index of two. Currently the 2nd indexed row is in the TBODY
   section of the TABLE.  The number of rows in the TBODY section before
   insertion of the new row is two.  After the new row is inserted the number
   of rows in the TBODY section is three.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39872903
   */
  specify("HTMLTableElement29", () => {
    var success;
    var nodeList;
    var tbodiesnodeList;
    var testNode;
    var bodyNode;
    var newRow;
    var rowsnodeList;
    var vsection1;
    var vsection2;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    tbodiesnodeList = testNode.tBodies;
    bodyNode = tbodiesnodeList.item(0);
    rowsnodeList = bodyNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink1");
    newRow = testNode.insertRow(2);
    tbodiesnodeList = testNode.tBodies;
    bodyNode = tbodiesnodeList.item(0);
    rowsnodeList = bodyNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 3, "rowsLink2");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the second TABLE element and invoke the insertRow() method
   with an index of four. After the new row is inserted the number of rows
   in the table should be five.
   Also the number of rows in the TFOOT section before
   insertion of the new row is one.  After the new row is inserted the number
   of rows in the TFOOT section is two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39872903
   */
  specify("HTMLTableElement30", () => {
    var success;
    var nodeList;
    var tbodiesnodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vsection1;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 4, "rowsLink1");
    vsection1 = testNode.tFoot;
    rowsnodeList = vsection1.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink");
    newRow = testNode.insertRow(4);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 5, "rowsLink2");
    vsection1 = testNode.tFoot;
    rowsnodeList = vsection1.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink3");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.  In addition, when
   the table is empty the row is inserted into a TBODY which is created
   and inserted into the table.
   Load the table1 file which has a non-empty table element.
   Create an empty TABLE element and append to the document.
   Check to make sure that the empty TABLE element doesn't
   have a TBODY element.  Insert a new row into the empty
   TABLE element.  Check for existence of the a TBODY element
   in the table.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39872903
   * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Aug/0019.html
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=502
   */
  specify("HTMLTableElement31", () => {
    var success;
    var nodeList;
    var testNode;
    var tableNode;
    var tbodiesnodeList;
    var newRow;
    var doc;
    var table;
    var tbodiesLength;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table1");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'tableSize1');
    testNode = nodeList.item(0);
    table = doc.createElement("table");
    tableNode = testNode.appendChild(table);
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'tableSize2');
    tbodiesnodeList = tableNode.tBodies;
    tbodiesLength = tbodiesnodeList.length;
    assert.equal(tbodiesLength, 0, "Asize3");
    newRow = tableNode.insertRow(0);
    tbodiesnodeList = tableNode.tBodies;
    tbodiesLength = tbodiesnodeList.length;
    assert.equal(tbodiesLength, 1, "Asize4");
  });

  /**
   *
   The deleteRow() method deletes a table row.
   Retrieve the second TABLE element and invoke the deleteRow() method
   with an index of 0(first row). Currently there are four rows in the
   table.  After the deleteRow() method is called there should be
   three rows in the table.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-13114938
   */
  specify("HTMLTableElement32", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 4, "rowsLink1");
    testNode.deleteRow(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 3, "rowsLink2");
  });

  /**
   *
   The deleteRow() method deletes a table row.
   Retrieve the second TABLE element and invoke the deleteRow() method
   with an index of 3(last row). Currently there are four rows in the
   table.  The deleteRow() method is called and now there should be three.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-13114938
   */
  specify("HTMLTableElement33", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 4, "rowsLink1");
    testNode.deleteRow(3);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 3, "rowsLink2");
  });

  /**
   *
   The insertRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is greater than the number of rows.
   Retrieve the second TABLE element which has four rows.  Try
   to insert a new row using an index of five.  This should throw
   a INDEX_SIZE_ERR DOMException since there are only four rows.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-39872903
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-39872903')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableElement34", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    {
      success = false;
      try {
        newRow = testNode.insertRow(5);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableElement34');
    }
  });

  /**
   *
   The insertRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is negative.
   Retrieve the second TABLE element which has four rows.  Try
   to insert a new row using an index of negative five.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is negative.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-39872903
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-39872903')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableElement35", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    {
      success = false;
      try {
        newRow = testNode.insertRow(-5);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableElement35');
    }
  });

  /**
   *
   The deleteRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is greater than the number of rows.
   Retrieve the second TABLE element which has four rows.  Try
   to delete a new row using an index of five.  This should throw
   a INDEX_SIZE_ERR DOMException since there are only four rows.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-13114938
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-13114938')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableElement36", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    {
      success = false;
      try {
        testNode.deleteRow(5);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableElement36');
    }
  });

  /**
   *
   The deleteRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is equal the number of rows.
   Retrieve the second TABLE element which has four rows.  Try
   to delete a new row using an index of four.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is equal to the
   number of rows.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-13114938
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-13114938')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableElement37", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    {
      success = false;
      try {
        testNode.deleteRow(4);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableElement37');
    }
  });

  /**
   *
   The deleteRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is negative.
   Retrieve the second TABLE element which has four rows.  Try
   to delete a new row using an index of negative five.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is negative.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-13114938
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-13114938')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableElement38", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    {
      success = false;
      try {
        testNode.deleteRow(-5);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableElement38');
    }
  });

  /**
   *
   The deleteRow() method deletes a table row.  If the index is -1
   the last row of the table is deleted.
   Retrieve the second TABLE element and invoke the deleteRow() method
   with an index of negative one. Currently there are four rows in the
   table.  The deleteRow() method is called and now there should be three.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-13114938
   */
  specify("HTMLTableElement40", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 4, "rowsLink1");
    testNode.deleteRow(-1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 3, "rowsLink2");
  });

  /**
   *
   The rowIndex attribute specifies the index of the row, relative to the
   entire table, starting from 0.  This is in document tree order and
   not display order.  The rowIndex does not take into account sections
   (THEAD, TFOOT, or TBODY) within the table.
   Retrieve the third TR element within the document and examine
   its rowIndex value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67347567
   */
  specify("HTMLTableRowElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    vrowindex = testNode.rowIndex;
    assert.equal(vrowindex, 1, "rowIndexLink");
  });

  /**
   *
   The sectionRowIndex attribute specifies the index of this row, relative
   to the current section(THEAD, TFOOT, or TBODY),starting from 0.
   Retrieve the second TR(1st In THEAD) element within the document and
   examine its sectionRowIndex value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79105901
   */
  specify("HTMLTableRowElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vsectionrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    vsectionrowindex = testNode.sectionRowIndex;
    assert.equal(vsectionrowindex, 0, "sectionRowIndexLink");
  });

  /**
   *
   The sectionRowIndex attribute specifies the index of this row, relative
   to the current section(THEAD, TFOOT, or TBODY),starting from 0.
   Retrieve the third TR(1st In TFOOT) element within the document and
   examine its sectionRowIndex value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79105901
   */
  specify("HTMLTableRowElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vsectionrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(2);
    vsectionrowindex = testNode.sectionRowIndex;
    assert.equal(vsectionrowindex, 0, "sectionRowIndexLink");
  });

  /**
   *
   The sectionRowIndex attribute specifies the index of this row, relative
   to the current section(THEAD, TFOOT, or TBODY),starting from 0.
   Retrieve the fifth TR(2nd In TBODY) element within the document and
   examine its sectionRowIndex value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79105901
   */
  specify("HTMLTableRowElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vsectionrowindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(4);
    vsectionrowindex = testNode.sectionRowIndex;
    assert.equal(vsectionrowindex, 1, "sectionRowIndexLink");
  });

  /**
   *
   The cells attribute specifies the collection of cells in this row.
   Retrieve the fourth TR element and examine the value of
   the cells length attribute.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67349879
   */
  specify("HTMLTableRowElement05", () => {
    var success;
    var nodeList;
    var cellsnodeList;
    var testNode;
    var vcells;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 6, "cellsLink");
  });

  /**
   *
   The align attribute specifies the horizontal alignment of data within
   cells of this row.
   Retrieve the align attribute of the second TR element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74098257
   */
  specify("HTMLTableRowElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The bgColor attribute specifies the background color of rows.
   Retrieve the bgColor attribute of the second TR element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18161327
   */
  specify("HTMLTableRowElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor.toLowerCase(), "#00FFFF".toLowerCase(), "bgColorLink");
  });

  /**
   *
   The ch attribute specifies the alignment character for cells in a column.
   Retrieve the char attribute of the second TR element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16230502
   */
  specify("HTMLTableRowElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    vch = testNode.ch;
    assert.equal(vch, "*", "chLink");
  });

  /**
   *
   The chOff attribute specifies the offset of alignment character.
   Retrieve the charoff attribute of the second TR element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68207461
   */
  specify("HTMLTableRowElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    vchoff = testNode.chOff;
    assert.equal(vchoff, "1", "charOffLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of data within
   cells of this row.
   Retrieve the vAlign attribute of the second TR element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90000058
   */
  specify("HTMLTableRowElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The insertCell() method inserts an empty TD cell into this row.
   Retrieve the fourth TR element and examine the value of
   the cells length attribute which should be set to six.
   Check the value of the first TD element.  Invoke the
   insertCell() which will create an empty TD cell at the
   zero index position.  Check the value of the newly created
   cell and make sure it is null and also the numbers of cells
   should now be seven.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68927016
   */
  specify("HTMLTableRowElement11", () => {
    var success;
    var nodeList;
    var cellsnodeList;
    var testNode;
    var trNode;
    var cellNode;
    var value;
    var newCell;
    var vcells;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 6, "cellsLink1");
    trNode = cellsnodeList.item(0);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "EMP0001", "value1Link");
    newCell = testNode.insertCell(0);
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 7, "cellsLink2");
    trNode = cellsnodeList.item(0);
    cellNode = trNode.firstChild;
    assert.equal(cellNode, null, 'cellNode should be null');
  });

  /**
   *
   The insertCell() method inserts an empty TD cell into this row.
   Retrieve the fourth TR element and examine the value of
   the cells length attribute which should be set to six.
   Check the value of the last TD element.  Invoke the
   insertCell() which will append the empty cell to the end of the list.
   Check the value of the newly created cell and make sure it is null
   and also the numbers of cells should now be seven.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68927016
   */
  specify("HTMLTableRowElement12", () => {
    var success;
    var nodeList;
    var cellsnodeList;
    var testNode;
    var trNode;
    var cellNode;
    var value;
    var newCell;
    var vcells;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 6, "cellsLink1");
    trNode = cellsnodeList.item(5);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "1230 North Ave. Dallas, Texas 98551", "value1Link");
    newCell = testNode.insertCell(6);
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 7, "cellsLink2");
    trNode = cellsnodeList.item(6);
    cellNode = trNode.firstChild;
    assert.equal(cellNode, null, 'cellNode should be null');
  });

  /**
   *
   The deleteCell() method deletes a cell from the current row.
   Retrieve the fourth TR element and examine the value of
   the cells length attribute which should be set to six.
   Check the value of the first TD element.  Invoke the
   deleteCell() method which will delete a cell from the current row.
   Check the value of the cell at the zero index and also check
   the number of cells which should now be five.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11738598
   */
  specify("HTMLTableRowElement13", () => {
    var success;
    var nodeList;
    var cellsnodeList;
    var testNode;
    var trNode;
    var cellNode;
    var value;
    var vcells;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 6, "cellsLink1");
    trNode = cellsnodeList.item(0);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "EMP0001", "value1Link");
    testNode.deleteCell(0);
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 5, "cellsLink2");
    trNode = cellsnodeList.item(0);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "Margaret Martin", "value2Link");
  });

  /**
   *
   The deleteCell() method deletes a cell from the current row.
   Retrieve the fourth TR element and examine the value of
   the cells length attribute which should be set to six.
   Check the value of the third(index 2) TD element.  Invoke the
   deleteCell() method which will delete a cell from the current row.
   Check the value of the third cell(index 2) and also check
   the number of cells which should now be five.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11738598
   */
  specify("HTMLTableRowElement14", () => {
    var success;
    var nodeList;
    var cellsnodeList;
    var testNode;
    var trNode;
    var cellNode;
    var value;
    var vcells;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 6, "cellsLink1");
    trNode = cellsnodeList.item(2);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "Accountant", "value1Link");
    testNode.deleteCell(2);
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 5, "cellsLink2");
    trNode = cellsnodeList.item(2);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "56,000", "value2Link");
  });

  /**
   *
   The insertCell() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is greater than the number of cells.
   Retrieve the fourth TR element which has six cells.  Try
   to insert a cell using an index of seven.  This should throw
   a INDEX_SIZE_ERR DOMException since there are only six cells.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-68927016
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-68927016')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableRowElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var newCell;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    {
      success = false;
      try {
        newCell = testNode.insertCell(7);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableRowElement15');
    }
  });

  /**
   *
   The insertCell() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is negative.
   Retrieve the fourth TR element which has six cells.  Try
   to insert a cell using an index of negative seven.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is negative.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-68927016
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-68927016')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableRowElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var newCell;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    {
      success = false;
      try {
        newCell = testNode.insertCell(-7);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableRowElement16');
    }
  });

  /**
   *
   The deleteCell() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is greater than the number of cells.
   Retrieve the fourth TR element which has six cells.  Try
   to delete a cell using an index of seven.  This should throw
   a INDEX_SIZE_ERR DOMException since there are only six cells.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-11738598
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-11738598')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableRowElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    {
      success = false;
      try {
        testNode.deleteCell(7);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableRowElement17');
    }
  });

  /**
   *
   The deleteCell() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is equal to the number of cells.
   Retrieve the fourth TR element which has six cells.  Try
   to delete a cell using an index of six.  This should throw
   a INDEX_SIZE_ERR DOMException since there are only six cells.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-11738598
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-11738598')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableRowElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    {
      success = false;
      try {
        testNode.deleteCell(6);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableRowElement18');
    }
  });

  /**
   *
   The deleteCell() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is negative.
   Retrieve the fourth TR element which has six cells.  Try
   to delete a cell using an index of negative six.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is negative.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-11738598
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-11738598')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableRowElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    {
      success = false;
      try {
        testNode.deleteCell(-6);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableRowElement19');
    }
  });

  /**
   *
   The insertCell() method inserts an empty TD cell into this row.
   If index is -1 or equal to the number of cells, the new cell is
   appended.
   Retrieve the fourth TR element and examine the value of
   the cells length attribute which should be set to six.
   Check the value of the last TD element.  Invoke the
   insertCell() with an index of negative one
   which will append the empty cell to the end of the list.
   Check the value of the newly created cell and make sure it is null
   and also the numbers of cells should now be seven.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-68927016
   */
  specify("HTMLTableRowElement20", () => {
    var success;
    var nodeList;
    var cellsnodeList;
    var testNode;
    var trNode;
    var cellNode;
    var value;
    var newCell;
    var vcells;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 6, "cellsLink1");
    trNode = cellsnodeList.item(5);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "1230 North Ave. Dallas, Texas 98551", "value1Link");
    newCell = testNode.insertCell(-1);
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 7, "cellsLink2");
    trNode = cellsnodeList.item(6);
    cellNode = trNode.firstChild;
    assert.equal(cellNode, null, 'cellNode should be null');
  });

  /**
   *
   The deleteCell() method deletes a cell from the currtent row.  If
   the index is -1 the last cell in the row is deleted.
   Retrieve the fourth TR element and examine the value of
   the cells length attribute which should be set to six.
   Check the value of the last TD element.  Invoke the
   deleteCell() with an index of negative one
   which will delete the last cell in the row.
   Check the value of the of the last cell
   and also the numbers of cells should now be five.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-11738598
   */
  specify("HTMLTableRowElement21", () => {
    var success;
    var nodeList;
    var cellsnodeList;
    var testNode;
    var trNode;
    var cellNode;
    var value;
    var vcells;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 6, "cellsLink1");
    trNode = cellsnodeList.item(5);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "1230 North Ave. Dallas, Texas 98551", "value1Link");
    testNode.deleteCell(-1);
    testNode = nodeList.item(3);
    cellsnodeList = testNode.cells;
    vcells = cellsnodeList.length;
    assert.equal(vcells, 5, "cellsLink2");
    trNode = cellsnodeList.item(4);
    cellNode = trNode.firstChild;
    value = cellNode.nodeValue;
    assert.equal(value, "Female", "value2Link");
  });

  /**
   *
   The align attribute specifies the horizontal alignment of data within
   cells.
   Retrieve the align attribute of the first THEAD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40530119
   */
  specify("HTMLTableSectionElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal alignment of data within
   cells.
   Retrieve the align attribute of the first TFOOT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40530119
   */
  specify("HTMLTableSectionElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The align attribute specifies the horizontal alignment of data within
   cells.
   Retrieve the align attribute of the first TBODY element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40530119
   */
  specify("HTMLTableSectionElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The ch attribute specifies the alignment character for cells in a
   column.
   Retrieve the char attribute of the first THEAD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83470012
   */
  specify("HTMLTableSectionElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vch = testNode.ch;
    assert.equal(vch, "*", "chLink");
  });

  /**
   *
   The ch attribute specifies the alignment character for cells in a
   column.
   Retrieve the char attribute of the first TFOOT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83470012
   */
  specify("HTMLTableSectionElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vch = testNode.ch;
    assert.equal(vch, "+", "chLink");
  });

  /**
   *
   The ch attribute specifies the alignment character for cells in a
   column.
   Retrieve the char attribute of the first TBODY element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83470012
   */
  specify("HTMLTableSectionElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vch = testNode.ch;
    assert.equal(vch, "$", "chLink");
  });

  /**
   *
   The chOff attribute specifies the offset of alignment character.
   Retrieve the charoff attribute of the first THEAD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53459732
   */
  specify("HTMLTableSectionElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcharoff = testNode.chOff;
    assert.equal(vcharoff, "1", "chOffLink");
  });

  /**
   *
   The chOff attribute specifies the offset of alignment character.
   Retrieve the charoff attribute of the first TFOOT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53459732
   */
  specify("HTMLTableSectionElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcharoff = testNode.chOff;
    assert.equal(vcharoff, "2", "chOffLink");
  });

  /**
   *
   The chOff attribute specifies the offset of alignment character.
   Retrieve the charoff attribute of the first TBODY element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53459732
   */
  specify("HTMLTableSectionElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vcharoff = testNode.chOff;
    assert.equal(vcharoff, "3", "chOffLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of cell data in
   column.
   Retrieve the vAlign attribute of the first THEAD element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-4379116
   */
  specify("HTMLTableSectionElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of cell data in
   column.
   Retrieve the vAlign attribute of the first TFOOT element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-4379116
   */
  specify("HTMLTableSectionElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The vAlign attribute specifies the vertical alignment of cell data in
   column.
   Retrieve the vAlign attribute of the first TBODY element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-4379116
   */
  specify("HTMLTableSectionElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   The rows attribute specifies the collection of rows in this table section.
   Retrieve the first THEAD element and examine the value of
   the rows length attribute.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52092650
   */
  specify("HTMLTableSectionElement13", () => {
    var success;
    var nodeList;
    var rowsnodeList;
    var testNode;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink");
  });

  /**
   *
   The rows attribute specifies the collection of rows in this table section.
   Retrieve the first TFOOT element and examine the value of
   the rows length attribute.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52092650
   */
  specify("HTMLTableSectionElement14", () => {
    var success;
    var nodeList;
    var rowsnodeList;
    var testNode;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink");
  });

  /**
   *
   The rows attribute specifies the collection of rows in this table section.
   Retrieve the first TBODY element and examine the value of
   the rows length attribute.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52092650
   */
  specify("HTMLTableSectionElement15", () => {
    var success;
    var nodeList;
    var rowsnodeList;
    var testNode;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the first THEAD element and invoke the insertRow() method
   with an index of 0.  The nuber of rows in the THEAD section before
   insertion of the new row is one.  After the new row is inserted the number
   of rows in the THEAD section is two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93995626
   */
  specify("HTMLTableSectionElement16", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    newRow = testNode.insertRow(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink2");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the first TFOOT element and invoke the insertRow() method
   with an index of 0.  The nuber of rows in the TFOOT section before
   insertion of the new row is one.  After the new row is inserted the number
   of rows in the TFOOT section is two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93995626
   */
  specify("HTMLTableSectionElement17", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    newRow = testNode.insertRow(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink2");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the first TBODY element and invoke the insertRow() method
   with an index of 0.  The nuber of rows in the TBODY section before
   insertion of the new row is two.  After the new row is inserted the number
   of rows in the TBODY section is three.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93995626
   */
  specify("HTMLTableSectionElement18", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink1");
    newRow = testNode.insertRow(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 3, "rowsLink2");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the first THEAD element and invoke the insertRow() method
   with an index of 1.  The nuber of rows in the THEAD section before
   insertion of the new row is one therefore the new row is appended.
   After the new row is inserted the number of rows in the THEAD
   section is two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93995626
   */
  specify("HTMLTableSectionElement19", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    newRow = testNode.insertRow(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink2");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the first TFOOT element and invoke the insertRow() method
   with an index of one.  The nuber of rows in the TFOOT section before
   insertion of the new row is one therefore the new row is appended.
   After the new row is inserted the number of rows in the TFOOT section
   is two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93995626
   */
  specify("HTMLTableSectionElement20", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    newRow = testNode.insertRow(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink2");
  });

  /**
   *
   The insertRow() method inserts a new empty table row.
   Retrieve the first TBODY element and invoke the insertRow() method
   with an index of two.  The number of rows in the TBODY section before
   insertion of the new row is two therefore the row is appended.
   After the new row is inserted the number of rows in the TBODY section is
   three.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93995626
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=502
   */
  specify("HTMLTableSectionElement21", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink1");
    newRow = testNode.insertRow(2);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 3, "rowsLink2");
  });

  /**
   *
   The deleteRow() method deletes a row from this section.
   Retrieve the first THEAD element and invoke the deleteRow() method
   with an index of 0.  The nuber of rows in the THEAD section before
   the deletion of the row is one.  After the row is deleted the number
   of rows in the THEAD section is zero.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-5625626
   */
  specify("HTMLTableSectionElement22", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    testNode.deleteRow(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 0, "rowsLink2");
  });

  /**
   *
   The deleteRow() method deletes a row from this section.
   Retrieve the first TFOOT element and invoke the deleteRow() method
   with an index of 0.  The nuber of rows in the TFOOT section before
   the deletion of the row is one.  After the row is deleted the number
   of rows in the TFOOT section is zero.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-5625626
   */
  specify("HTMLTableSectionElement23", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tfoot");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    testNode.deleteRow(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 0, "rowsLink2");
  });

  /**
   *
   The deleteRow() method deletes a row from this section.
   Retrieve the first TBODY element and invoke the deleteRow() method
   with an index of 0.  The nuber of rows in the TBODY section before
   the deletion of the row is two.  After the row is deleted the number
   of rows in the TBODY section is one.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-5625626
   */
  specify("HTMLTableSectionElement24", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink1");
    testNode.deleteRow(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink2");
  });

  /**
   *
   The insertRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is greater than the number of rows.
   Retrieve the first THEAD element which has one row.  Try
   to insert a new row using an index of two.  This should throw
   a INDEX_SIZE_ERR DOMException since there is only one row.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-93995626
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-93995626')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableSectionElement25", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    {
      success = false;
      try {
        newRow = testNode.insertRow(2);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableSectionElement25');
    }
  });

  /**
   *
   The insertRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is negative.
   Retrieve the first THEAD element which has one row.  Try
   to insert a new row using an index of negative two.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is negative.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-93995626
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-93995626')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableSectionElement26", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    {
      success = false;
      try {
        newRow = testNode.insertRow(-2);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableSectionElement26');
    }
  });

  /**
   *
   The deleteRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is greater than the number of rows.
   Retrieve the first THEAD element which has one row.  Try
   to delete a row using an index of two.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is greater than the
   number of rows.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-5625626
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-5625626')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableSectionElement27", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    {
      success = false;
      try {
        testNode.deleteRow(2);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableSectionElement27');
    }
  });

  /**
   *
   The deleteRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is equal to the number of rows.
   Retrieve the first THEAD element which has one row.  Try
   to delete a row using an index of 1.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is equal to the
   number of rows.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-5625626
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-5625626')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableSectionElement28", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    {
      success = false;
      try {
        testNode.deleteRow(1);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableSectionElement28');
    }
  });

  /**
   *
   The deleteRow() method throws a INDEX_SIZE_ERR DOMException
   if the specified index is negative.
   Retrieve the first THEAD element which has one row.  Try
   to delete a row using an index of negative two.  This should throw
   a INDEX_SIZE_ERR DOMException since the index is negative.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-5625626
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#xpointer(id('ID-5625626')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("HTMLTableSectionElement29", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    {
      success = false;
      try {
        testNode.deleteRow(-2);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assert.ok(success, 'HTMLTableSectionElement29');
    }
  });

  /**
   *
   The insertRow() method inserts a new empty table row.  The new
   row is inserted immediately before the current indexth row in this
   section.  If index is -1 or equal to the number of rows in this section,
   the new row is appended.
   Retrieve the first THEAD element and invoke the insertRow() method
   with an index of negative one.  Since the index is negative one the
   new row is appended.
   After the new row is appended the number of rows in the THEAD
   section is two.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-93995626
   */
  specify("HTMLTableSectionElement30", () => {
    var success;
    var nodeList;
    var testNode;
    var newRow;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("thead");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink1");
    newRow = testNode.insertRow(-1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink2");
  });

  /**
   *
   The deleteRow() method deletes a row from this section.  The index
   starts from 0 and is relative only to the rows contained inside
   this section, not all the rows in the table.  If the index is -1
   the last row will be deleted.
   Retrieve the second TBODY element and invoke the deleteRow() method
   with an index of -1.  The nuber of rows in the THEAD section before
   the deletion of the row is two.  After the row is deleted the number
   of rows in the TBODY section is one.
   * @author NIST
   * @author Rick Rivello
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-5625626
   */
  specify("HTMLTableSectionElement31", () => {
    var success;
    var nodeList;
    var testNode;
    var rowsnodeList;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("tbody");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 2, "rowsLink1");
    testNode.deleteRow(-1);
    rowsnodeList = testNode.rows;
    vrows = rowsnodeList.length;
    assert.equal(vrows, 1, "rowsLink2");
  });

  /**
   *
   The defaultValue attribute represents the HTML value of the attribute
   when the type attribute has the value of "Text", "File" or "Password".
   Retrieve the defaultValue attribute of the 2nd TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36152213
   */
  specify("HTMLTextAreaElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vdefaultvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vdefaultvalue = testNode.defaultValue;
    assert.equal(vdefaultvalue, "TEXTAREA2", "defaultValueLink");
  });

  /**
   *
   The form attribute returns the FORM element containing this control.
   Retrieve the form attribute from the first TEXTAREA element
   and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18911464
   */
  specify("HTMLTextAreaElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var fNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    fNode = testNode.form;
    vform = fNode.id;
    assert.equal(vform, "form1", "formLink");
  });

  /**
   *
   The form attribute returns null if control in not within the context of
   a form.
   Retrieve the second TEXTAREA element and
   examine its form element.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18911464
   */
  specify("HTMLTextAreaElement03", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The accessKey attribute specifies a single character access key to
   give access to the form control.
   Retrieve the accessKey attribute of the 1st TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93102991
   */
  specify("HTMLTextAreaElement04", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "c", "accessKeyLink");
  });

  /**
   *
   The cols attribute specifies the width of control(in characters).
   Retrieve the cols attribute of the 1st TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-51387225
   */
  specify("HTMLTextAreaElement05", () => {
    var success;
    var nodeList;
    var testNode;
    var vcols;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vcols = testNode.cols;
    assert.equal(vcols, 20, "colsLink");
  });

  /**
   *
   The disabled attribute specifies the control is unavailable in this
   context.
   Retrieve the disabled attribute from the 2nd TEXTAREA element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98725443
   */
  specify("HTMLTextAreaElement06", () => {
    var success;
    var nodeList;
    var testNode;
    var vdisabled;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vdisabled = testNode.disabled;
    assert.ok(vdisabled, 'disabledLink');
  });

  /**
   *
   The name attribute specifies the form control or object name when
   submitted with a form.
   Retrieve the name attribute of the 1st TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70715578
   */
  specify("HTMLTextAreaElement07", () => {
    var success;
    var nodeList;
    var testNode;
    var vname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vname = testNode.name;
    assert.equal(vname, "text1", "nameLink");
  });

  /**
   *
   The readOnly attribute specifies this control is read-only.
   Retrieve the readOnly attribute from the 3rd TEXTAREA element and
   examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39131423
   */
  specify("HTMLTextAreaElement08", () => {
    var success;
    var nodeList;
    var testNode;
    var vreadonly;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(2);
    vreadonly = testNode.readOnly;
    assert.ok(vreadonly, 'readOnlyLink');
  });

  /**
   *
   The rows attribute specifies the number of text rowns.
   Retrieve the rows attribute of the 1st TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46975887
   */
  specify("HTMLTextAreaElement09", () => {
    var success;
    var nodeList;
    var testNode;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vrows = testNode.rows;
    assert.equal(vrows, 7, "rowsLink");
  });

  /**
   *
   The tabIndex attribute is an index that represents the element's position
   in the tabbing order.
   Retrieve the tabIndex attribute of the 1st TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-60363303
   */
  specify("HTMLTextAreaElement10", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 5, "tabIndexLink");
  });

  /**
   *
   The type attribute specifies the type of this form control.
   Retrieve the type attribute of the 1st TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-24874179
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTML-HTMLTextAreaElement-type
   */
  specify("HTMLTextAreaElement11", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "textarea", "typeLink");
  });

  /**
   *
   The value attribute represents the current contents of the corresponding
   form control, in an interactive user agent.
   Retrieve the value attribute of the 1st TEXTAREA element and examine
   its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70715579
   */
  specify("HTMLTextAreaElement12", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    vvalue = testNode.value;
    assert.equal(vvalue, "TEXTAREA1", "valueLink");
  });

  /**
   *
   Calling HTMLTextAreaElement.blur should surrender input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6750689
   */
  specify("HTMLTextAreaElement13", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    testNode.blur();
  });

  /**
   *
   Calling HTMLTextAreaElement.focus should capture input focus.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39055426
   */
  specify("HTMLTextAreaElement14", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    testNode.focus();
  });

  /**
   *
   Calling HTMLTextAreaElement.select should select the text area.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48880622
   */
  specify("HTMLTextAreaElement15", () => {
    var success;
    var nodeList;
    var testNode;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("textarea");
    nodeList = doc.getElementsByTagName("textarea");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(0);
    testNode.select();
  });

  /**
   *
   The text attribute is the specified title as a string.
   Retrieve the text attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77500413
   */
  specify("HTMLTitleElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vtext;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("title");
    nodeList = doc.getElementsByTagName("title");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtext = testNode.text;
    assert.equal(vtext, "NIST DOM HTML Test - TITLE", "textLink");
  });

  /**
   *
   The compact attribute specifies whether to reduce spacing between list
   items.
   Retrieve the compact attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39864178
   */
  specify("HTMLUListElement01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcompact;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("ulist");
    nodeList = doc.getElementsByTagName("ul");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vcompact = testNode.compact;
    assert.ok(vcompact, 'compactLink');
  });

  /**
   *
   The type attribute specifies the bullet style.
   Retrieve the type attribute and examine its value.
   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96874670
   */
  specify("HTMLUListElement02", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("ulist");
    nodeList = doc.getElementsByTagName("ul");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "disc", "typeLink");
  });

  /**
   *
   A single character access key to give access to the form control.
   The value of attribute accessKey of the anchor element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89647724
   */
  specify("anchor01", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "g", "accessKeyLink");
  });

  /**
   *
   The character encoding of the linked resource.
   The value of attribute charset of the anchor element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67619266
   */
  specify("anchor02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcharset;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcharset = testNode.charset;
    assert.equal(vcharset, "US-ASCII", "charsetLink");
  });

  /**
   *
   Comma-separated list of lengths, defining an active region geometry.
   The value of attribute coords of the anchor element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92079539
   */
  specify("anchor03", () => {
    var success;
    var nodeList;
    var testNode;
    var vcoords;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcoords = testNode.coords;
    assert.equal(vcoords, "0,0,100,100", "coordsLink");
  });

  /**
   *
   The URI of the linked resource.
   The value of attribute href of the anchor element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88517319
   */
  specify("anchor04", () => {
    var success;
    var nodeList;
    var testNode;
    var vhref;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vhref = testNode.href;
    assert.equal(vhref, toFileUrl('html/files/pix/submit.gif'), 'hrefLink');
  });

  /**
   *
   Advisory content type.
   The value of attribute type of the anchor element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63938221
   */
  specify("anchor05", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "image/gif", "typeLink");
  });

  /**
   *
   The shape of the active area. The coordinates are given by coords
   The value of attribute shape of the anchor element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-49899808
   */
  specify("anchor06", () => {
    var success;
    var nodeList;
    var testNode;
    var vshape;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    nodeList = doc.getElementsByTagName("a");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vshape = testNode.shape;
    assert.equal(vshape, "rect", "shapeLink");
  });

  /**
   *
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66021476
   */
  specify("area01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcoords;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcoords = testNode.coords;
    assert.equal(vcoords, "0,2,45,45", "coordsLink");
  });

  /**
   *
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-61826871
   */
  specify("area02", () => {
    var success;
    var nodeList;
    var testNode;
    var vnohref;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vnohref = testNode.noHref;
    assert.equal(vnohref, false, 'vnohref should be *false*');
  });

  /**
   *
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8722121
   */
  specify("area03", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 10, "tabIndexLink");
  });

  /**
   *
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57944457
   */
  specify("area04", () => {
    var success;
    var nodeList;
    var testNode;
    var vaccesskey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("area");
    nodeList = doc.getElementsByTagName("area");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vaccesskey = testNode.accessKey;
    assert.equal(vaccesskey, "a", "accessKeyLink");
  });

  /**
   *
   Color of active links (after mouse-button down, but before mouse-button up).
   The value of attribute alink of the body element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59424581
   */
  specify("body01", () => {
    var success;
    var nodeList;
    var testNode;
    var valink;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("body");
    nodeList = doc.getElementsByTagName("body");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valink = testNode.aLink;
    assert.equal(valink, "#0000ff", "aLinkLink");
  });

  /**
   *
   Returns the FORM element containing this control. Returns null if this control is not within the context of a form.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
   */
  specify("button01", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   The value of attribute name of the form element which contains this button is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
   */
  specify("button02", () => {
    var success;
    var nodeList;
    var testNode;
    var formNode;
    var vfname;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    formNode = testNode.form;
    vfname = formNode.id;
    assert.equal(vfname, "form2", "formLink");
  });

  /**
   *
   The value of attribute method of the form element which contains this button is read and checked against the expected value
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82545539
   */
  specify("button04", () => {
    var success;
    var nodeList;
    var testNode;
    var formNode;
    var vfmethod;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    formNode = testNode.form;
    vfmethod = formNode.method;
    assert.equal(vfmethod.toLowerCase(), "POST".toLowerCase(), "formLink");
  });

  /**
   *
   A single character access key to give access to the form control.
   The value of attribute accessKey of the button element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73169431
   */
  specify("button05", () => {
    var success;
    var nodeList;
    var testNode;
    var vakey;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vakey = testNode.accessKey;
    assert.equal(vakey.toLowerCase(), "f".toLowerCase(), "accessKeyLink");
  });

  /**
   *
   Index that represents the element's position in the tabbing order.
   The value of attribute tabIndex of the button element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39190908
   */
  specify("button06", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabIndex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtabIndex = testNode.tabIndex;
    assert.equal(vtabIndex, 20, "tabIndexLink");
  });

  /**
   *
   The type of button
   The value of attribute type of the button element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27430092
   */
  specify("button07", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "reset", "typeLink");
  });

  /**
   *
   The control is unavailable in this context.
   The boolean value of attribute disabled of the button element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92757155
   */
  specify("button08", () => {
    var success;
    var nodeList;
    var testNode;
    var vdisabled;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vdisabled = testNode.disabled;
    assert.ok(vdisabled, 'disabledLink');
  });

  /**
   *
   The current form control value.
   The value of attribute value of the button element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72856782
   */
  specify("button09", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalue;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("button");
    nodeList = doc.getElementsByTagName("button");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vvalue = testNode.value;
    assert.equal(vvalue, "Reset Disabled Button", "typeLink");
  });

  /**
   *
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-21738539
   */
  specify("dlist01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcompact;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("dl");
    nodeList = doc.getElementsByTagName("dl");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcompact = testNode.compact;
    assert.ok(vcompact, 'compactLink');
  });

  /**
   *
   Retrieve the title attribute of HTMLDocument and examine it's value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18446827
   */
  specify("doc01", () => {
    var success;
    var vtitle;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    vtitle = doc.title;
    assert.equal(vtitle, "NIST DOM HTML Test - Anchor", "titleLink");
  });

  /**
   *
   hasFeature("hTmL", null) should return true.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
   */
  specify("hasFeature01", () => {
    var success;
    var doc;
    var domImpl;
    var version = null;
    var state;
    domImpl = getImplementation();
    state = domImpl.hasFeature("hTmL",version);
    assert.ok(state, 'hasHTMLnull');
  });

  /**
   *
   hasFeature("hTmL", "2.0") should return true.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
   */
  specify("hasFeature02", () => {
    var success;
    var doc;
    var domImpl;
    var version = "2.0";
    var state;
    domImpl = getImplementation();
    state = domImpl.hasFeature("hTmL",version);
    assert.ok(state, 'hasHTML2');
  });

  /**
   *
   hasFeature("xhTmL", null) should return true if hasFeature("XML", null) returns true.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
   */
  specify("hasFeature03", () => {
    var success;
    var doc;
    var domImpl;
    var version = null;
    var state;
    var hasXML;
    domImpl = getImplementation();
    hasXML = domImpl.hasFeature("XML",version);
    state = domImpl.hasFeature("xhTmL",version);
    assert.equal(state, hasXML, "hasXHTML");
  });

  /**
   *
   hasFeature("xhTmL", "2.0") should return true if hasFeature("XML", "2.0") returns true.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
   */
  specify("hasFeature04", () => {
    var success;
    var doc;
    var domImpl;
    var version = "2.0";
    var state;
    var hasXML;
    domImpl = getImplementation();
    hasXML = domImpl.hasFeature("XML",version);
    state = domImpl.hasFeature("xhTmL",version);
    assert.equal(state, hasXML, "hasXHTML");
  });

  /**
   *
   hasFeature("cOrE", null) should return true.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
   */
  specify("hasFeature05", () => {
    var success;
    var doc;
    var domImpl;
    var version = null;
    var state;
    domImpl = getImplementation();
    state = domImpl.hasFeature("cOrE",version);
    assert.ok(state, 'hasCore');
  });

  /**
   *
   hasFeature("cOrE", "2.0") should return true.
   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
   */
  specify("hasFeature06", () => {
    var success;
    var doc;
    var domImpl;
    var version = "2.0";
    var state;
    domImpl = getImplementation();
    state = domImpl.hasFeature("cOrE",version);
    assert.ok(state, 'hasCore');
  });

  /**
   *
   Returns the FORM element containing this control. Returns null if this control is not within the context of a form.
   The value of attribute form of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46094773
   */
  specify("object01", () => {
    var success;
    var nodeList;
    var testNode;
    var vform;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vform = testNode.form;
    assert.equal(vform, null, 'vform should be null');
  });

  /**
   *
   Aligns this object (vertically or horizontally) with respect to its surrounding text.
   The value of attribute align of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16962097
   */
  specify("object02", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "middle", "alignLink");
  });

  /**
   *
   Space-separated list of archives
   The value of attribute archive of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47783837
   */
  specify("object03", () => {
    var success;
    var nodeList;
    var testNode;
    var varchive;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    varchive = testNode.archive;
    assert.equal(varchive, "", "archiveLink");
  });

  /**
   *
   Width of border around the object.
   The value of attribute border of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82818419
   */
  specify("object04", () => {
    var success;
    var nodeList;
    var testNode;
    var vborder;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vborder = testNode.border;
    assert.equal(vborder, "0", "borderLink");
  });

  /**
   *
   Base URI for classid, data, and archive attributes.
   The value of attribute codebase of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25709136
   */
  specify("object05", () => {
    var success;
    var nodeList;
    var testNode;
    var vcodebase;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vcodebase = testNode.codeBase;
    assert.equal(vcodebase, "http://xw2k.sdct.itl.nist.gov/brady/dom/", "codebaseLink");
  });

  /**
   *
   A URI specifying the location of the object's data.
   The value of attribute data of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-81766986
   */
  specify("object06", () => {
    var success;
    var nodeList;
    var testNode;
    var vdata;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vdata = testNode.data;
    assert.equal(vdata, toFileUrl("html/files/pix/logo.gif"), "dataLink");
  });

  /**
   *
   The value of attribute height of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88925838
   */
  specify("object07", () => {
    var success;
    var nodeList;
    var testNode;
    var vheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vheight = testNode.height;
    assert.equal(vheight, "60", "heightLink");
  });

  /**
   *
   Horizontal space to the left and right of this image, applet, or object.
   The value of attribute hspace of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-17085376
   */
  specify("object08", () => {
    var success;
    var nodeList;
    var testNode;
    var vhspace;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vhspace = testNode.hspace;
    assert.equal(vhspace, 0, "hspaceLink");
  });

  /**
   *
   Message to render while loading the object.
   The value of attribute standby of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25039673
   */
  specify("object09", () => {
    var success;
    var nodeList;
    var testNode;
    var vstandby;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vstandby = testNode.standby;
    assert.equal(vstandby, "Loading Image ...", "standbyLink");
  });

  /**
   *
   Index that represents the element's position in the tabbing order.
   The value of attribute tabIndex of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27083787
   */
  specify("object10", () => {
    var success;
    var nodeList;
    var testNode;
    var vtabindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtabindex = testNode.tabIndex;
    assert.equal(vtabindex, 0, "tabIndexLink");
  });

  /**
   *
   Content type for data downloaded via data attribute.
   The value of attribute type of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-91665621
   */
  specify("object11", () => {
    var success;
    var nodeList;
    var testNode;
    var vtype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vtype = testNode.type;
    assert.equal(vtype, "image/gif", "typeLink");
  });

  /**
   *
   The value of attribute usemap of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6649772
   */
  specify("object12", () => {
    var success;
    var nodeList;
    var testNode;
    var vusemap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vusemap = testNode.useMap;
    assert.equal(vusemap, "#DivLogo-map", "useMapLink");
  });

  /**
   *
   Vertical space above and below this image, applet, or object.
   The value of attribute vspace of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-8682483
   */
  specify("object13", () => {
    var success;
    var nodeList;
    var testNode;
    var vvspace;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vvspace = testNode.vspace;
    assert.equal(vvspace, 0, "vspaceLink");
  });

  /**
   *
   The value of attribute width of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-38538620
   */
  specify("object14", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, "550", "widthLink");
  });

  /**
   *
   Content type for data downloaded via classid attribute.
   The value of attribute codetype of the object element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-19945008
   */
  specify("object15", () => {
    var success;
    var nodeList;
    var testNode;
    var vcodetype;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("object");
    nodeList = doc.getElementsByTagName("object");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vcodetype = testNode.codeType;
    assert.equal(vcodetype, "image/gif", "codeTypeLink");
  });

  /**
   *
   Returns the table's CAPTION, or void if none exists.
   The value of attribute caption of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14594520
   */
  specify("table01", () => {
    var success;
    var nodeList;
    var testNode;
    var vcaption;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table1");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vcaption = testNode.caption;
    assert.equal(vcaption, null, 'vcaption should be null');
  });

  /**
   *
   Caption alignment with respect to the table.
   The value of attribute align of the tablecaption element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14594520
   */
  specify("table02", () => {
    var success;
    var nodeList;
    var testNode;
    var vcaption;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vcaption = testNode.caption;
    valign = vcaption.align;
    assert.equal(valign, "top", "alignLink");
  });

  /**
   *
   Alignment character for cells in a column.
   The value of attribute ch of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
   */
  specify("table03", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tHead;
    vch = vsection.ch;
    assert.equal(vch, "*", "chLink");
  });

  /**
   *
   Horizontal alignment of data in cells.
   The value of attribute align of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
   */
  specify("table04", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tHead;
    valign = vsection.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   Vertical alignment of data in cells.
   The value of attribute valign of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("table06", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vvAlign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tFoot;
    vvAlign = vsection.vAlign;
    assert.equal(vvAlign, "middle", "vAlignLink");
  });

  /**
   *
   The collection of rows in this table section.
   The value of attribute rows of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("table07", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vcollection;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tFoot;
    vcollection = vsection.rows;
    vrows = vcollection.length;
    assert.equal(vrows, 1, "vrowsLink");
  });

  /**
   *
   Horizontal alignment of data in cells.
   The value of attribute align of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("table08", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tFoot;
    valign = vsection.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   Vertical alignment of data in cells.
   The value of attribute valign of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
   */
  specify("table09", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tHead;
    vvalign = vsection.vAlign;
    assert.equal(vvalign, "middle", "alignLink");
  });

  /**
   *
   Alignment character for cells in a column.
   The value of attribute ch of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("table10", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tFoot;
    vch = vsection.ch;
    assert.equal(vch, "+", "chLink");
  });

  /**
   *
   Offset of alignment character.
   The value of attribute choff of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("table12", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tHead;
    vchoff = vsection.chOff;
    assert.equal(vchoff, "1", "choffLink");
  });

  /**
   *
   The collection of rows in this table section.
   The value of attribute rows of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("table15", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vcollection;
    var vrows;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tHead;
    vcollection = vsection.rows;
    vrows = vcollection.length;
    assert.equal(vrows, 1, "vrowsLink");
  });

  /**
   *
   Offset of alignment character.
   The value of attribute chOff of the tablesection element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
   */
  specify("table17", () => {
    var success;
    var nodeList;
    var testNode;
    var vsection;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablesection");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 2, 'Asize');
    testNode = nodeList.item(1);
    vsection = testNode.tFoot;
    vchoff = vsection.chOff;
    assert.equal(vchoff, "2", "choffLink");
  });

  /**
   *
   The index of this cell in the row.
   The value of attribute cellIndex of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-80748363
   */
  specify("table18", () => {
    var success;
    var nodeList;
    var testNode;
    var vcindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vcindex = testNode.cellIndex;
    assert.equal(vcindex, 1, "cellIndexLink");
  });

  /**
   *
   Abbreviation for header cells.
   The index of this cell in the row.
   The value of attribute abbr of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74444037
   */
  specify("table19", () => {
    var success;
    var nodeList;
    var testNode;
    var vabbr;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vabbr = testNode.abbr;
    assert.equal(vabbr, "hd2", "abbrLink");
  });

  /**
   *
   Names group of related headers.
   The value of attribute axis of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76554418
   */
  specify("table20", () => {
    var success;
    var nodeList;
    var testNode;
    var vaxis;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vaxis = testNode.axis;
    assert.equal(vaxis, "center", "axisLink");
  });

  /**
   *
   Horizontal alignment of data in cell.
   The value of attribute align of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98433879
   */
  specify("table21", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   Cell background color.
   The value of attribute bgColor of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88135431
   */
  specify("table22", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor.toLowerCase(), "#FF0000".toLowerCase(), "bgcolorLink");
  });

  /**
   *
   Alignment character for cells in a column.
   The value of attribute char of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30914780
   */
  specify("table23", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vch = testNode.ch;
    assert.equal(vch, ":", "chLink");
  });

  /**
   *
   offset of alignment character.
   The value of attribute chOff of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20144310
   */
  specify("table24", () => {
    var success;
    var nodeList;
    var testNode;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vchoff = testNode.chOff;
    assert.equal(vchoff, "1", "chOffLink");
  });

  /**
   *
   Number of columns spanned by cell.
   The value of attribute colspan of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84645244
   */
  specify("table25", () => {
    var success;
    var nodeList;
    var testNode;
    var vcolspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vcolspan = testNode.colSpan;
    assert.equal(vcolspan, 1, "colSpanLink");
  });

  /**
   *
   The value of attribute height of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83679212
   */
  specify("table26", () => {
    var success;
    var nodeList;
    var testNode;
    var vheight;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vheight = testNode.height;
    assert.equal(vheight, "50", "heightLink");
  });

  /**
   *
   Suppress word wrapping.
   The value of attribute nowrap of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62922045
   */
  specify("table27", () => {
    var success;
    var nodeList;
    var testNode;
    var vnowrap;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vnowrap = testNode.noWrap;
    assert.ok(vnowrap, 'nowrapLink');
  });

  /**
   *
   Number of rows spanned by cell.
   The value of attribute rowspan of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48237625
   */
  specify("table28", () => {
    var success;
    var nodeList;
    var testNode;
    var vrowspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vrowspan = testNode.rowSpan;
    assert.equal(vrowspan, 1, "rowSpanLink");
  });

  /**
   *
   List of id attribute values for header cells.
   The value of attribute headers of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89104817
   */
  specify("table30", () => {
    var success;
    var nodeList;
    var testNode;
    var vheaders;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vheaders = testNode.headers;
    assert.equal(vheaders, "header-3", "headersLink");
  });

  /**
   *
   Vertical alignment of data in cell.
   The value of attribute valign of the tablecell element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58284221
   */
  specify("table31", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   cell width.
   The value of attribute width of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27480795
   */
  specify("table32", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecell");
    nodeList = doc.getElementsByTagName("td");
    assert.equal(nodeList.length, 4, 'Asize');
    testNode = nodeList.item(1);
    vwidth = testNode.width;
    assert.equal(vwidth, "175", "vwidthLink");
  });

  /**
   *
   Specifies the table's position with respect to the rest of the document.
   The value of attribute align of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-23180977
   */
  specify("table33", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   The width of the border around the table.
   The value of attribute border of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-50969400
   */
  specify("table34", () => {
    var success;
    var nodeList;
    var testNode;
    var vborder;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vborder = testNode.border;
    assert.equal(vborder, "4", "borderLink");
  });

  /**
   *
   Cell background color.
   The value of attribute bgcolor of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83532985
   */
  specify("table35", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor, "#ff0000", "bgcolorLink");
  });

  /**
   *
   Specifies which external table borders to render.
   The value of attribute frame of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64808476
   */
  specify("table36", () => {
    var success;
    var nodeList;
    var testNode;
    var vframe;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vframe = testNode.frame;
    assert.equal(vframe, "border", "frameLink");
  });

  /**
   *
   Specifies the horizontal and vertical space between cell content and cell borders. The value of attribute cellpadding of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59162158
   */
  specify("table37", () => {
    var success;
    var nodeList;
    var testNode;
    var vcellpadding;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vcellpadding = testNode.cellPadding;
    assert.equal(vcellpadding, "2", "cellpaddingLink");
  });

  /**
   *
   Specifies the horizontal and vertical separation between cells.
   The value of attribute cellspacing of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68907883
   */
  specify("table38", () => {
    var success;
    var nodeList;
    var testNode;
    var vcellspacing;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vcellspacing = testNode.cellSpacing;
    assert.equal(vcellspacing, "2", "cellspacingLink");
  });

  /**
   *
   Supplementary description about the purpose or structure of a table.
   The value of attribute summary of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-44998528
   */
  specify("table39", () => {
    var success;
    var nodeList;
    var testNode;
    var vsummary;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vsummary = testNode.summary;
    assert.equal(vsummary, "HTML Control Table", "summaryLink");
  });

  /**
   *
   Specifies which internal table borders to render.
   The value of attribute rules of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-26347553
   */
  specify("table40", () => {
    var success;
    var nodeList;
    var testNode;
    var vrules;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vrules = testNode.rules;
    assert.equal(vrules, "all", "rulesLink");
  });

  /**
   *
   Specifies the desired table width.
   The value of attribute width of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77447361
   */
  specify("table41", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("table");
    assert.equal(nodeList.length, 3, 'Asize');
    testNode = nodeList.item(1);
    vwidth = testNode.width;
    assert.equal(vwidth, "680", "widthLink");
  });

  /**
   *
   Horizontal alignment of data within cells of this row.
   The value of attribute align of the tablerow element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74098257
   */
  specify("table42", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 8, 'Asize');
    testNode = nodeList.item(1);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   Background color for rows.
   The value of attribute bgcolor of the tablerow element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18161327
   */
  specify("table43", () => {
    var success;
    var nodeList;
    var testNode;
    var vbgcolor;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 8, 'Asize');
    testNode = nodeList.item(1);
    vbgcolor = testNode.bgColor;
    assert.equal(vbgcolor.toLowerCase(), "#00FFFF".toLowerCase(), "bgcolorLink");
  });

  /**
   *
   Vertical alignment of data within cells of this row.
   The value of attribute valign of the tablerow element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90000058
   */
  specify("table44", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("table");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 8, 'Asize');
    testNode = nodeList.item(1);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "valignLink");
  });

  /**
   *
   Alignment character for cells in a column.
   The value of attribute ch of the tablerow element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16230502
   */
  specify("table45", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    vch = testNode.ch;
    assert.equal(vch, "*", "vchLink");
  });

  /**
   *
   Offset of alignment character.
   The value of attribute choff of the tablerow element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68207461
   */
  specify("table46", () => {
    var success;
    var nodeList;
    var testNode;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(1);
    vchoff = testNode.chOff;
    assert.equal(vchoff, "1", "choffLink");
  });

  /**
   *
   The index of this row, relative to the entire table.
   The value of attribute rowIndex of the table element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67347567
   */
  specify("table47", () => {
    var success;
    var nodeList;
    var testNode;
    var vrindex;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablerow");
    nodeList = doc.getElementsByTagName("tr");
    assert.equal(nodeList.length, 5, 'Asize');
    testNode = nodeList.item(4);
    vrindex = testNode.rowIndex;
    assert.equal(vrindex, 2, "rowIndexLink");
  });

  /**
   *
   Horizontal alignment of cell data in column.
   The value of attribute align of the tablecol element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74098257
   */
  specify("table48", () => {
    var success;
    var nodeList;
    var testNode;
    var valign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    valign = testNode.align;
    assert.equal(valign, "center", "alignLink");
  });

  /**
   *
   Alignment character for cells in a column.
   The value of attribute ch of the tablecol element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16230502
   */
  specify("table49", () => {
    var success;
    var nodeList;
    var testNode;
    var vch;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vch = testNode.ch;
    assert.equal(vch, "*", "chLink");
  });

  /**
   *
   Offset of alignment character.
   The value of attribute choff of the tablecol element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68207461
   */
  specify("table50", () => {
    var success;
    var nodeList;
    var testNode;
    var vchoff;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vchoff = testNode.chOff;
    assert.equal(vchoff, "20", "chOffLink");
  });

  /**
   *
   Indicates the number of columns in a group or affected by a grouping.
   The value of attribute span of the tablecol element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96511335
   */
  specify("table51", () => {
    var success;
    var nodeList;
    var testNode;
    var vspan;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vspan = testNode.span;
    assert.equal(vspan, 1, "spanLink");
  });

  /**
   *
   Vertical alignment of cell data in column.
   The value of attribute valign of the tablecol element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83291710
   */
  specify("table52", () => {
    var success;
    var nodeList;
    var testNode;
    var vvalign;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vvalign = testNode.vAlign;
    assert.equal(vvalign, "middle", "vAlignLink");
  });

  /**
   *
   Default column width.
   The value of attribute width of the tablecol element is read and checked against the expected value.
   * @author Netscape
   * @author Sivakiran Tummala
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25196799
   */
  specify("table53", () => {
    var success;
    var nodeList;
    var testNode;
    var vwidth;
    var doc;
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("tablecol");
    nodeList = doc.getElementsByTagName("col");
    assert.equal(nodeList.length, 1, 'Asize');
    testNode = nodeList.item(0);
    vwidth = testNode.width;
    assert.equal(vwidth, "20", "widthLink");
  });

  specify("event_default_action", () => {
    var success;
    var doc;
    var target;
    var evt;
    var canceled;
    var performedDefault = false;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load("anchor");
    var a = doc.getElementById("Anchor");
    a.addEventListener("foo", function() {}, true);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",false,false);
    canceled = !a.dispatchEvent(evt);
    assert.equal(canceled, false, 'canceled should be *false*');
  });

  specify("only_special_tags_have_name_and_it_reflects_the_attribute", () => {
    var doc = load("anchor");

    ['a', 'button', 'form', 'frame', 'iframe', 'img', 'input', 'map',
     'meta', 'object', 'param', 'select', 'textarea'].forEach(function (tagName) {
      var element = doc.createElement(tagName);
      // http://www.w3.org/html/wg/drafts/html/master/forms.html#attr-fe-name plus
      // http://www.w3.org/html/wg/drafts/html/master/infrastructure.html#reflect
      assert.strictEqual(element.name, '', '<' + tagName + '> elements should have empty string name properties by default.');

      element.name = 'foo';
      assert.strictEqual(element.name, 'foo', '<' + tagName + '> elements should allow setting and retrieving their name properties.');
      assert.strictEqual(element.name, element.getAttribute('name'), '<' + tagName + '> elements should have name properties equal to their name attributes.');
    });

    ['section', 'abbr', 'label', 'option', 'customTag'].forEach(function (tagName) {
      var element = doc.createElement(tagName);
      assert.strictEqual(element.name, undefined, '<' + tagName + '> elements should not have a value for the name property');
    });

  });

  specify("checked_property_is_boolean", () => {
    var doc = load("anchor");

    doc.body.innerHTML = '<input id="x" type="checkbox" checked>';
    var el1 = doc.getElementById("x");

    assert.strictEqual(el1.checked, true, "no attribute value");

    doc.body.innerHTML = '<input id="x" type="checkbox" checked="">';
    var el2 = doc.getElementById("x");

    assert.strictEqual(el2.checked, true, "empty attribute value");

    doc.body.innerHTML = '<input id="x" type="checkbox">';
    var el3 = doc.getElementById("x");
    el3.defaultChecked = false;

    assert.strictEqual(el3.hasAttribute("checked"), false, "staying false does not insert attribute");

    doc.body.innerHTML = '<input id="x" type="checkbox" checked="checked">';
    var el4 = doc.getElementById("x");
    el4.defaultChecked = false;

    assert.strictEqual(el4.hasAttribute("checked"), false, "changing to false removes attribute");

  });

  specify("memoized_queries_cleared_on_innerhtml_set", () => {
    var doc = load('menu');
    var oldCount = doc.getElementsByTagName('em').length;
    assert.equal(oldCount, 0, 'Count of <em> should be 0');
    doc.getElementsByTagName('li')[2].innerHTML = 'Give start <em>date</em>';
    var newCount = doc.getElementsByTagName('em').length;
    assert.equal(newCount, 1, 'Count of <em> should be 1');
  });

  specify("memoized_queries_cleared_on_element", () => {
    var doc = load('menu');
    var menu = doc.getElementsByTagName('menu')[0];
    var oldCount = menu.getElementsByTagName('li').length;
    assert.equal(oldCount, 3, 'Count of <li> should be 3');
    menu.innerHTML = '<li>one</li><li>two</li>';
    var newCount = menu.getElementsByTagName('li').length;
    assert.equal(newCount, 2, 'Count of <li> should be 2 after innerHTML is set');
  });

  specify("memoized_href_resolver_returns_valid_url", () => {
    var doc = load('anchor');
    var a = doc.getElementsByTagName('a')[0];
    assert.ok(a.href.match(/pix\/submit\.gif$/), "anchor href should be valid")
    assert.ok(a.href.match(/pix\/submit\.gif$/), "anchor href (2nd accession) should be valid")
  });

  specify("normalize_method_defined_on_string_prototype_should_not_affect_getting_attribute_properties", () => {
    var oldNormalize = String.prototype.normalize;
    String.prototype.normalize = function () {
      return "masked alt";
    };
    var doc = (new JSDOM("<img alt=\"alt\" />")).window.document;
    var img = doc.getElementsByTagName("img").item(0);

    assert.strictEqual(img.alt, "alt", "<img> elements should not have their attribute properties masked by defining " +
      "a normalize method on string instances");

    String.prototype.normalize = oldNormalize;
  });


  specify("normalize_method_defined_on_string_prototype_should_not_affect_setting_attribute_properties", () => {
    var oldNormalize = String.prototype.normalize;
    String.prototype.normalize = function () {
      return "masked action";
    };
    var doc = (new JSDOM("<form></form>")).window.document;
    var form = doc.getElementsByTagName("form").item(0);
    form.action = "test.html";

    assert.strictEqual(form.action, "test.html", "<form> elements should not have their attribute properties masked " +
      "by defining a normalize method on string instances when removing empty attributes");

    String.prototype.normalize = oldNormalize;
  });

  specify("rowIndex_on_detached_table_row_should_return_minus_one", () => {
    var doc = (new JSDOM()).window.document;
    var row = doc.createElement('tr');

    assert.strictEqual(row.rowIndex, -1, "rowIndex should equal -1");
  });

  specify("radio_group_with_same_name_in_several_forms_work", () => {
    var html = '<form>' +
        '<input type="radio" name="group1" value="3" checked="checked" id="form1-input1" />' +
        '<input type="radio" name="group1" value="2" id="form1-input2" />' +
        '</form><form>' +
        '<input type="radio" name="group1" value="1" checked="checked" id="form2-input1" />' +
        '<input type="radio" name="group1" value="5" id="form2-input2" /></form>';
    const { window }  = new JSDOM(html);
    var input1 = window.document.getElementById('form1-input1');
    var input2 = window.document.getElementById('form1-input2');
    var input3 = window.document.getElementById('form2-input1');

    input2.checked = true;

    assert.equal(input1.checked, false, 'Radio input in the same form should be unchecked');
    assert.ok(input2.checked, 'The radio input should be checked');
    assert.ok(input3.checked, 'Radio input in a different form should still be checked');
  });

  specify("radio_group_with_same_name_outside_form", () => {
    // NOTE: this is virtually the same as the radio_group_with_same_name_in_several_forms_work test,
    // however this test moves the first radio group outside of a form so they are siblings
    // of the form containing the other radio group.
    var html = '<div>' +
        '<input type="radio" name="group1" value="3" checked="checked" id="form1-input1" />' +
        '<input type="radio" name="group1" value="2" id="form1-input2" />' +
        '<form>' +
        '<input type="radio" name="group1" value="1" checked="checked" id="form2-input1" />' +
        '<input type="radio" name="group1" value="5" id="form2-input2" /></form>' +
        '</div>';
    const { window } = new JSDOM(html);
    var input1 = window.document.getElementById('form1-input1');
    var input2 = window.document.getElementById('form1-input2');
    var input3 = window.document.getElementById('form2-input1');

    input2.checked = true;

    assert.equal(input1.checked, false, 'Radio input in the same group should be unchecked');
    assert.ok(input2.checked, 'The radio input should be checked');
    assert.ok(input3.checked, 'Radio input in a sibling form should still be checked');
  });

  specify("htmlcollection_allows_index_access_for_name_and_id", () => {
    const { window } = new JSDOM('<form><input name="test"><input id="test2"></form>');
    var form = window.document.getElementsByTagName('form')[0];
    assert.ok(form.elements.test, 'form.elements by name');
    assert.ok(form.elements.test2, 'form.elements by id');
  });

  specify("parsing_with_bad_html_tag", () => {
    assert.doesNotThrow(function () {
      new JSDOM(
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://www.facebook.com/2008/fbml" ' +
                                                   'xmlns:og="xmlns:fb="http://ogp.me/ns/fb#"></html>');
    });

  });

  specify("option_element_id_attaching_on_id_change", () => {
    var doc = (new JSDOM('<html><head></head><body></body></html>')).window.document;
    var option = doc.createElement('option');
    option.setAttribute('id', 'foo');
    doc.body.appendChild(option);
    option.setAttribute('id', 'bar');

    assert.ok(!doc.getElementById('foo'), 'getElementById("foo") should not match after the id has been changed from foo to bar');
    assert.ok(doc.getElementById('bar') === option, 'getElementById("bar") should match after the id has been changed from foo to bar');
  });

  specify("div_element_to_string", () => {
    var doc = (new JSDOM('<html><head></head><body></body></html>')).window.document;
    var div = doc.createElement('div');

    assert.ok(div.toString() === '[object HTMLDivElement]', 'div.toString() should return "[object HTMLDivElement] just like a browser');
  });

  specify("document_open_return_self", () => {
    var doc = load("document");
    var docOpen = doc.open();
    doc.close();
    assert.ok(doc === docOpen, 'doc.open() should return the Document on which the method was invoked');
  });
});
