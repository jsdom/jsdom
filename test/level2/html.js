exports.tests = {
/**
*
    The accessKey attribute is a single character access key to give
    access to the form control.

    Retrieve the accessKey attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89647724
*/
HTMLAnchorElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement01") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("accessKeyLink","g",vaccesskey);

},
/**
*
    The charset attribute indicates the character encoding of the linked
    resource.

    Retrieve the charset attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67619266
*/
HTMLAnchorElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement02") != null) return;
    var nodeList;
      var testNode;
      var vcharset;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");

      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcharset = testNode.charset;

      assertEquals("charsetLink","US-ASCII",vcharset);

},
/**
*
    The coords attribute is a comma-seperated list of lengths, defining
    an active region geometry.

    Retrieve the coords attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92079539
*/
HTMLAnchorElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement03") != null) return;
    var nodeList;
      var testNode;
      var vcoords;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcoords = testNode.coords;

      assertEquals("coordsLink","0,0,100,100",vcoords);

},
/**
*
    The href attribute contains the URL of the linked resource.

    Retrieve the href attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88517319
*/
HTMLAnchorElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement04") != null) return;
    var nodeList;
      var testNode;
      var vhref;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhref = testNode.href;

      assertURIEquals("hrefLink",null,null,null,"submit.gif",null,null,null,null,vhref);

},
/**
*
    The hreflang attribute contains the language code of the linked resource.

    Retrieve the hreflang attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87358513
*/
HTMLAnchorElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement05") != null) return;
    var nodeList;
      var testNode;
      var vhreflink;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhreflink = testNode.hreflang;

      assertEquals("hreflangLink","en",vhreflink);

},
/**
*
    The name attribute contains the anchor name.

    Retrieve the name attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32783304
*/
HTMLAnchorElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement06") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","Anchor",vname);

},
/**
*
    The rel attribute contains the forward link type.

    Retrieve the rel attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-3815891
*/
HTMLAnchorElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement07") != null) return;
    var nodeList;
      var testNode;
      var vrel;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vrel = testNode.rel;

      assertEquals("relLink","GLOSSARY",vrel);

},
/**
*
    The rev attribute contains the reverse link type

    Retrieve the rev attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58259771
*/
HTMLAnchorElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement08") != null) return;
    var nodeList;
      var testNode;
      var vrev;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vrev = testNode.rev;

      assertEquals("revLink","STYLESHEET",vrev);

},
/**
*
    The shape attribute contains the shape of the active area.

    Retrieve the shape attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-49899808
*/
HTMLAnchorElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement09") != null) return;
    var nodeList;
      var testNode;
      var vshape;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vshape = testNode.shape;

      assertEquals("shapeLink","rect",vshape);

},
/**
*
    The tabIndex attribute contains an index that represents the elements
    position in the tabbing order.

    Retrieve the tabIndex attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-41586466
*/
HTMLAnchorElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement10") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",22,vtabindex);

},
/**
*
    The target attribute specifies the frame to render the source in.

    Retrieve the target attribute and examine it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6414197
*/
HTMLAnchorElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement11") != null) return;
    var nodeList;
      var testNode;
      var vtarget;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor2");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtarget = testNode.target;

      assertEquals("targetLink","dynamic",vtarget);

},
/**
*
    The type attribute contains the advisory content model.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63938221
*/
HTMLAnchorElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement12") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","image/gif",vtype);

},
/**
*
HTMLAnchorElement.blur should surrender input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-65068939
*/
HTMLAnchorElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement13") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      testNode.blur();

},
/**
*
HTMLAnchorElement.focus should capture input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47150313
*/
HTMLAnchorElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAnchorElement14") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      testNode.focus();

},
/**
*
    The align attribute specifies the alignment of the object(Vertically
    or Horizontally) with respect to its surrounding text.

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8049912
*/
HTMLAppletElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","bottom".toLowerCase(),valign.toLowerCase());

},
/**
*
    The alt attribute specifies the alternate text for user agents not
    rendering the normal context of this element.

    Retrieve the alt attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58610064
*/
HTMLAppletElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement02") != null) return;
    var nodeList;
      var testNode;
      var valt;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valt = testNode.alt;

      assertEquals("altLink","Applet Number 1",valt);

},
/**
*
    The archive attribute specifies a comma-seperated archive list.

    Retrieve the archive attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14476360
*/
HTMLAppletElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement03") != null) return;
    var nodeList;
      var testNode;
      var varchive;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      varchive = testNode.archive;

      assertEquals("archiveLink","",varchive);

},
/**
*
    The code attribute specifies the applet class file.

    Retrieve the code attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-61509645
*/
HTMLAppletElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement04") != null) return;
    var nodeList;
      var testNode;
      var vcode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcode = testNode.code;

      assertEquals("codeLink","org/w3c/domts/DOMTSApplet.class",vcode);

},
/**
*
    The codeBase attribute specifies an optional base URI for the applet.

    Retrieve the codeBase attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6581160
*/
HTMLAppletElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement05") != null) return;
    var nodeList;
      var testNode;
      var vcodebase;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcodebase = testNode.codeBase;

      assertEquals("codebase","applets",vcodebase);

},
/**
*
    The height attribute overrides the height.

    Retrieve the height attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90184867
*/
HTMLAppletElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement06") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vheight = testNode.height;

      assertEquals("heightLink","306",vheight);

},
/**
*
    The hspace attribute specifies the horizontal space to the left
    and right of this image, applet, or object.

    Retrieve the hspace attribute and examine it's value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-1567197
*/
HTMLAppletElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement07") != null) return;
    var nodeList;
      var testNode;
      var vhspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhspace = testNode.hspace;

      assertEquals("hspaceLink",0,vhspace);

},
/**
*
    The name attribute specifies the name of the applet.

    Retrieve the name attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39843695
*/
HTMLAppletElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement08") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","applet1",vname);

},
/**
*
    The vspace attribute specifies the vertical space above and below
    this image, applet or object.

    Retrieve the vspace attribute and examine it's value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-22637173
*/
HTMLAppletElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement09") != null) return;
    var nodeList;
      var testNode;
      var vvspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvspace = testNode.vspace;

      assertEquals("vspaceLink",0,vvspace);

},
/**
*
    The width attribute overrides the regular width.

    Retrieve the width attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16526327
*/
HTMLAppletElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement10") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","301",vwidth);

},
/**
*
    The object attribute specifies the serialized applet file.

    Retrieve the object attribute and examine its value.

* @author NIST
* @author Rick Rivello
* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93681523
*/
HTMLAppletElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAppletElement11") != null) return;
    var nodeList;
      var testNode;
      var vobject;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "applet2");
      nodeList = doc.getElementsByTagName("applet");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vobject = testNode.object;

      assertEquals("object","DOMTSApplet.dat",vobject);

},
/**
*
    The accessKey attribute specifies a single character access key to
    give access to the control form.

    Retrieve the accessKey attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57944457
*/
HTMLAreaElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement01") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("alignLink","a",vaccesskey);

},
/**
*
    The alt attribute specifies an alternate text for user agents not
    rendering the normal content of this element.

    Retrieve the alt attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39775416
*/
HTMLAreaElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement02") != null) return;
    var nodeList;
      var testNode;
      var valt;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valt = testNode.alt;

      assertEquals("altLink","Domain",valt);

},
/**
*
    The coords attribute specifies a comma-seperated list of lengths,
    defining an active region geometry.

    Retrieve the coords attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66021476
*/
HTMLAreaElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement03") != null) return;
    var nodeList;
      var testNode;
      var vcoords;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcoords = testNode.coords;

      assertEquals("coordsLink","0,2,45,45",vcoords);

},
/**
*
    The href attribute specifies the URI of the linked resource.

    Retrieve the href attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-34672936
*/
HTMLAreaElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement04") != null) return;
    var nodeList;
      var testNode;
      var vhref;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhref = testNode.href;

      assertURIEquals("hrefLink",null,null,null,"dletter.html",null,null,null,null,vhref);

},
/**
*
    The noHref attribute specifies that this area is inactive.

    Retrieve the noHref attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-61826871
*/
HTMLAreaElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement05") != null) return;
    var nodeList;
      var testNode;
      var vnohref;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vnohref = testNode.noHref;

      assertFalse("noHrefLink",vnohref);

},
/**
*
    The shape attribute specifies the shape of the active area.

    Retrieve the shape attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-85683271
*/
HTMLAreaElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement06") != null) return;
    var nodeList;
      var testNode;
      var vshape;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vshape = testNode.shape;

      assertEquals("shapeLink","rect".toLowerCase(),vshape.toLowerCase());

},
/**
*
    The tabIndex attribute specifies an index that represents the element's
    position in the tabbing order.

    Retrieve the tabIndex attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8722121
*/
HTMLAreaElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement07") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",10,vtabindex);

},
/**
*
    The target specifies the frame to render the resource in.

    Retrieve the target attribute and examine it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46054682
*/
HTMLAreaElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLAreaElement08") != null) return;
    var nodeList;
      var testNode;
      var vtarget;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area2");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtarget = testNode.target;

      assertEquals("targetLink","dynamic",vtarget);

},
/**
*
    The clear attribute specifies control flow of text around floats.

    Retrieve the clear attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82703081
*/
HTMLBRElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBRElement01") != null) return;
    var nodeList;
      var testNode;
      var vclear;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "br");
      nodeList = doc.getElementsByTagName("br");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclear = testNode.clear;

      assertEquals("clearLink","none",vclear);

},
/**
*
    The href attribute specifies the base URI.

    Retrieve the href attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-65382887
*/
HTMLBaseElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBaseElement01") != null) return;
    var nodeList;
      var testNode;
      var vhref;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "base");
      nodeList = doc.getElementsByTagName("base");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhref = testNode.href;

      assertEquals("hrefLink","about:blank",vhref);

},
/**
*
    The target attribute specifies the default target frame.

    Retrieve the target attribute and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73844298
*/
HTMLBaseElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBaseElement02") != null) return;
    var nodeList;
      var testNode;
      var vtarget;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "base2");
      nodeList = doc.getElementsByTagName("base");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtarget = testNode.target;

      assertEquals("targetLink","Frame1",vtarget);

},
/**
*
    The color attribute specifies the base font's color.

    Retrieve the color attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87502302
*/
HTMLBaseFontElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBaseFontElement01") != null) return;
    var nodeList;
      var testNode;
      var vcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "basefont");
      nodeList = doc.getElementsByTagName("basefont");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcolor = testNode.color;

      assertEquals("colorLink","#000000",vcolor);

},
/**
*
    The face attribute specifies the base font's face identifier.

    Retrieve the face attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88128969
*/
HTMLBaseFontElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBaseFontElement02") != null) return;
    var nodeList;
      var testNode;
      var vface;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "basefont");
      nodeList = doc.getElementsByTagName("basefont");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vface = testNode.face;

      assertEquals("faceLink","arial,helvitica",vface);

},
/**
*
    The size attribute specifies the base font's size.

    Retrieve the size attribute and examine it's value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-38930424
*/
HTMLBaseFontElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBaseFontElement03") != null) return;
    var nodeList;
      var testNode;
      var vsize;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "basefont");
      nodeList = doc.getElementsByTagName("basefont");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vsize = testNode.size;

      assertEquals("sizeLink",4,vsize);

},
/**
*
    The aLink attribute specifies the color of active links.

    Retrieve the aLink attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59424581
*/
HTMLBodyElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement01") != null) return;
    var nodeList;
      var testNode;
      var valink;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "body");
      nodeList = doc.getElementsByTagName("body");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valink = testNode.aLink;

      assertEquals("aLinkLink","#0000ff",valink);

},
/**
*
    The background attribute specifies the URI fo the background texture
    tile image.

    Retrieve the background attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-37574810
*/
HTMLBodyElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement02") != null) return;
    var nodeList;
      var testNode;
      var vbackground;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "body");
      nodeList = doc.getElementsByTagName("body");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vbackground = testNode.background;

      assertEquals("backgroundLink","./pix/back1.gif",vbackground);

},
/**
*
    The bgColor attribute specifies the document background color.

    Retrieve the bgColor attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-24940084
*/
HTMLBodyElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement03") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "body");
      nodeList = doc.getElementsByTagName("body");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vbgcolor = testNode.bgColor;

      assertEquals("bgColorLink","#ffff00",vbgcolor);

},
/**
*
    The link attribute specifies the color of links that are not active
    and unvisited.

    Retrieve the link attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-7662206
*/
HTMLBodyElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement04") != null) return;
    var nodeList;
      var testNode;
      var vlink;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "body");
      nodeList = doc.getElementsByTagName("body");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlink = testNode.link;

      assertEquals("linkLink","#ff0000",vlink);

},
/**
*
    The text attribute specifies the document text color.

    Retrieve the text attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73714763
*/
HTMLBodyElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement05") != null) return;
    var nodeList;
      var testNode;
      var vtext;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "body");
      nodeList = doc.getElementsByTagName("body");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtext = testNode.text;

      assertEquals("textLink","#000000",vtext);

},
/**
*
    The vLink attribute specifies the color of links that have been
    visited by the user.

    Retrieve the vLink attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83224305
*/
HTMLBodyElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement06") != null) return;
    var nodeList;
      var testNode;
      var vvlink;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "body");
      nodeList = doc.getElementsByTagName("body");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvlink = testNode.vLink;

      assertEquals("vLinkLink","#00ffff",vvlink);

},
/**
*
Checks that Node.isSupported("hTmL", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-62018039
*/
HTMLBodyElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement07") != null) return;
    var doc;
      var body;
      var state;
      var version = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      body = doc.body;

      state = body.isSupported("hTmL",version);
      assertTrue("isSupportedHTML",state);

},
/**
*
Checks that Node.isSupported("hTmL", "2.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-62018039
*/
HTMLBodyElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement08") != null) return;
    var doc;
      var body;
      var state;
      var version = "2.0";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      body = doc.body;

      state = body.isSupported("hTmL",version);
      assertTrue("isSupportedHTML",state);

},
/**
*
Checks that Node.isSupported("xhTmL", null) returns true if hasFeature("XML", null) is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-62018039
*/
HTMLBodyElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement09") != null) return;
    var doc;
      var body;
      var state;
      var hasXML;
      var version = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      body = doc.body;

      hasXML = body.isSupported("XML",version);
      state = body.isSupported("xhTmL",version);
      assertEquals("isSupportedXHTML",hasXML,state);

},
/**
*
Checks that Node.isSupported("xhTmL", "2.0") returns true if hasFeature("XML", "2.0") is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-62018039
*/
HTMLBodyElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement10") != null) return;
    var doc;
      var body;
      var state;
      var hasXML;
      var version = "2.0";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      body = doc.body;

      hasXML = body.isSupported("XML",version);
      state = body.isSupported("xhTmL",version);
      assertEquals("isSupportedXHTML",hasXML,state);

},
/**
*
Checks that Node.isSupported("cOrE", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-62018039
*/
HTMLBodyElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement11") != null) return;
    var doc;
      var body;
      var state;
      var version = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      body = doc.body;

      state = body.isSupported("cOrE",version);
      assertTrue("isSupportedCore",state);

},
/**
*
Checks that Node.isSupported("cOrE", "2.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-62018039
*/
HTMLBodyElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLBodyElement12") != null) return;
    var doc;
      var body;
      var state;
      var version = "2.0";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      body = doc.body;

      state = body.isSupported("cOrE",version);
      assertTrue("isSupportedCore",state);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
*/
HTMLButtonElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement01") != null) return;
    var nodeList;
      var testNode;
      var fNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form2",vform);

},
/**
*
    The form attribute returns null if control in not within the context of
    form.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
*/
HTMLButtonElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement02") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
/**
*
    The accessKey attribute returns a single character access key to
    give access to the form control.

    Retrieve the accessKey attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73169431
*/
HTMLButtonElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement03") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("accessKeyLink","f",vaccesskey);

},
/**
*
    The disabled attribute specifies whether the control is unavailable
    in this context.

    Retrieve the disabled attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92757155
*/
HTMLButtonElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement04") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vdisabled = testNode.disabled;

      assertTrue("disabledLink",vdisabled);

},
/**
*
    The name attribute is the form control or object name when submitted
    with a form.

    Retrieve the name attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11029910
*/
HTMLButtonElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement05") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","disabledButton",vname);

},
/**
*
    The tabIndex attribute specifies an index that represents the element's
    position in the tabbing order.

    Retrieve the tabIndex attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39190908
*/
HTMLButtonElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement06") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",20,vtabindex);

},
/**
*
    The type attribute specifies the type of button.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27430092
*/
HTMLButtonElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement07") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","reset",vtype);

},
/**
*
    The value attribute specifies the current control value.

    Retrieve the value attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72856782
*/
HTMLButtonElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLButtonElement08") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vvalue = testNode.value;

      assertEquals("valueLink","Reset Disabled Button",vvalue);

},
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
HTMLCollection01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection01") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      rowNode = rowsnodeList.item(0);
      vrowindex = rowNode.rowIndex;

      assertEquals("rowIndexLink",0,vrowindex);

},
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
HTMLCollection02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection02") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      formNode = formsnodeList.namedItem("select1");
      vname = formNode.nodeName;

      assertEqualsAutoCase("element", "nameIndexLink","SELECT",vname);

},
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
HTMLCollection03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection03") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      formNode = formsnodeList.namedItem("selectId");
      vname = formNode.nodeName;

      assertEqualsAutoCase("element", "nameIndexLink","select",vname);

},
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
HTMLCollection04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection04") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      rowLength1 = rowsnodeList.length;

      result[result.length] = rowLength1;
newRow = testNode.insertRow(4);
      rowLength2 = rowsnodeList.length;

      result[result.length] = rowLength2;
assertEqualsList("rowIndexLink",expectedResult,result);

},
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
HTMLCollection05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection05") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var rowLength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      rowLength = rowsnodeList.length;

      assertEquals("rowIndexLink",4,rowLength);

},
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
HTMLCollection06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection06") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      rowNode = rowsnodeList.item(0);
      vrowindex = rowNode.rowIndex;

      assertEquals("rowIndexLink",0,vrowindex);

},
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
HTMLCollection07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection07") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      rowNode = rowsnodeList.item(3);
      vrowindex = rowNode.rowIndex;

      assertEquals("rowIndexLink",3,vrowindex);

},
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
HTMLCollection08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection08") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      rowNode = rowsnodeList.item(2);
      vrowindex = rowNode.rowIndex;

      assertEquals("rowIndexLink",2,vrowindex);

},
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
HTMLCollection09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection09") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      rowNode = rowsnodeList.item(5);
      assertNull("rowIndexLink",rowNode);

},
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
HTMLCollection10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection10") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      formNode = formsnodeList.namedItem("select1");
      vname = formNode.nodeName;

      assertEqualsAutoCase("element", "nameIndexLink","SELECT",vname);

},
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
HTMLCollection11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection11") != null) return;
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
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      formNode = formsnodeList.namedItem("selectId");
      vname = formNode.nodeName;

      assertEqualsAutoCase("element", "nameIndexLink","select",vname);

},
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
HTMLCollection12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLCollection12") != null) return;
    var nodeList;
      var testNode;
      var formNode;
      var formsnodeList;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "collection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      formNode = formsnodeList.namedItem("select9");
      assertNull("nameIndexLink",formNode);

},
/**
*
    The compact attribute specifies a boolean value on whether to display
    the list more compactly.

    Retrieve the compact attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75317739
*/
HTMLDirectoryElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDirectoryElement01") != null) return;
    var nodeList;
      var testNode;
      var vcompact;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "directory");
      nodeList = doc.getElementsByTagName("dir");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcompact = testNode.compact;

      assertTrue("compactLink",vcompact);

},
/**
*
    The align attribute specifies the horizontal text alignment.

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-70908791
*/
HTMLDivElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDivElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "div");
      nodeList = doc.getElementsByTagName("div");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
    The compact attribute specifies a boolean value on whether to display
    the list more compactly.

    Retrieve the compact attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-21738539
*/
HTMLDlistElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDlistElement01") != null) return;
    var nodeList;
      var testNode;
      var vcompact;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "dl");
      nodeList = doc.getElementsByTagName("dl");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcompact = testNode.compact;

      assertTrue("compactLink",vcompact);

},
/**
*
    The title attribute is the specified title as a string.

    Retrieve the title attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18446827
*/
HTMLDocument01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument01") != null) return;
    var nodeList;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vtitle = doc.title;

      assertEquals("titleLink","NIST DOM HTML Test - DOCUMENT",vtitle);

},
/**
*
    The referrer attribute returns the URI of the page that linked to this
    page.

    Retrieve the referrer attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95229140
*/
HTMLDocument02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument02") != null) return;
    var nodeList;
      var testNode;
      var vreferrer;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vreferrer = doc.referrer;

      assertEquals("referrerLink","",vreferrer);

},
/**
*
    The domain attribute specifies the domain name of the server that served
    the document, or null if the server cannot be identified by a domain name.

    Retrieve the domain attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-2250147
*/
HTMLDocument03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument03") != null) return;
    var nodeList;
      var testNode;
      var vdomain;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vdomain = doc.domain;

      assertEquals("domainLink","",vdomain);

},
/**
*
    The URL attribute specifies the absolute URI of the document.

    Retrieve the URL attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46183437
*/
HTMLDocument04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument04") != null) return;
    var nodeList;
      var testNode;
      var vurl;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vurl = doc.URL;

      assertURIEquals("URLLink",null,null,null,null,"document",null,null,true,vurl);

},
/**
*
    The body attribute is the element that contains the content for the
    document.

    Retrieve the body attribute and examine its value for the id attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-56360201
*/
HTMLDocument05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument05") != null) return;
    var nodeList;
      var testNode;
      var vbody;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vbody = doc.body;

      vid = vbody.id;

      assertEquals("idLink","TEST-BODY",vid);

},
/**
*
    The images attribute returns a collection of all IMG elements in a document.

    Retrieve the images attribute from the document and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90379117
*/
HTMLDocument07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument07") != null) return;
    var nodeList;
      var testNode;
      var vimages;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vimages = doc.images;

      vlength = vimages.length;

      assertEquals("lengthLink",1,vlength);

},
/**
*
    The applets attribute returns a collection of all OBJECT elements that
    include applets abd APPLET elements in a document.

    Retrieve the applets attribute from the document and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-85113862
*/
HTMLDocument08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument08") != null) return;
    var nodeList;
      var testNode;
      var vapplets;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vapplets = doc.applets;

      vlength = vapplets.length;

      assertEquals("length",4,vlength);

},
/**
*
    The links attribute returns a collection of all AREA and A elements
    in a document with a value for the href attribute.

    Retrieve the links attribute from the document and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-7068919
*/
HTMLDocument09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument09") != null) return;
    var nodeList;
      var testNode;
      var vlinks;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vlinks = doc.links;

      vlength = vlinks.length;

      assertEquals("lengthLink",3,vlength);

},
/**
*
    The forms attribute returns a collection of all the forms in a document.

    Retrieve the forms attribute from the document and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-1689064
*/
HTMLDocument10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument10") != null) return;
    var nodeList;
      var testNode;
      var vforms;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vforms = doc.forms;

      vlength = vforms.length;

      assertEquals("lengthLink",1,vlength);

},
/**
*
    The anchors attribute returns a collection of all A elements with values
    for the name attribute.

    Retrieve the anchors attribute from the document and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-7577272
*/
HTMLDocument11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument11") != null) return;
    var nodeList;
      var testNode;
      var vanchors;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vanchors = doc.anchors;

      vlength = vanchors.length;

      assertEquals("lengthLink",1,vlength);

},
/**
*
    The cookie attribute returns the cookies associated with this document.

    Retrieve the cookie attribute and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8747038
*/
HTMLDocument12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument12") != null) return;
    var nodeList;
      var vcookie;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      vcookie = doc.cookie;

      assertEquals("cookieLink","",vcookie);

},
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
HTMLDocument13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument13") != null) return;
    var nodeList;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      nodeList = doc.getElementsByName("mapid");
      assertSize("Asize",1,nodeList);

},
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
HTMLDocument14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument14") != null) return;
    var nodeList;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      nodeList = doc.getElementsByName("noid");
      assertSize("Asize",0,nodeList);

},
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
HTMLDocument15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument15") != null) return;
    var elementNode;
      var elementValue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      elementNode = doc.getElementById("mapid");
      elementValue = elementNode.nodeName;

      assertEqualsAutoCase("element", "elementId","map",elementValue);

},
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
HTMLDocument16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument16") != null) return;
    var elementNode;
      var elementValue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      elementNode = doc.getElementById("noid");
      assertNull("elementId",elementNode);

},
/**
*
Clears the current document using HTMLDocument.open immediately followed by close.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
*/
HTMLDocument17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument17") != null) return;
    var doc;
      var bodyElem;
      var bodyChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      doc.open();
      doc.close();
      bodyElem = doc.body;


	if(

	(bodyElem != null)

	) {
	bodyChild = bodyElem.firstChild;

      assertNull("bodyContainsChildren",bodyChild);

	}

},
/**
*
Calls HTMLDocument.close on a document that has not been opened for modification.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
*/
HTMLDocument18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument18") != null) return;
    var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      doc.close();

},
/**
*
Replaces the current document with a valid HTML document using HTMLDocument.open, write and close.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75233634
*/
HTMLDocument19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument19") != null) return;
    var doc;
      var docElem;
      var title;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      doc.open();

	if(

	(builder.contentType == "text/html")

	) {
	doc.write("&lt;html>");

	}

		else {
			doc.write("&lt;html xmlns='http://www.w3.org/1999/xhtml'>");

		}
	doc.write("&lt;body>");
      doc.write("&lt;title>Replacement&lt;/title>");
      doc.write("&lt;/body>");
      doc.write("&lt;p>");
      doc.write("Hello, World.");
      doc.write("&lt;/p>");
      doc.write("&lt;/body>");
      doc.write("&lt;/html>");
      doc.close();

},
/**
*
Replaces the current document with a valid HTML document using HTMLDocument.open, writeln and close.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35318390
*/
HTMLDocument20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument20") != null) return;
    var doc;
      var docElem;
      var title;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      doc.open();

	if(

	(builder.contentType == "text/html")

	) {
	doc.writeln("&lt;html>");

	}

		else {
			doc.writeln("&lt;html xmlns='http://www.w3.org/1999/xhtml'>");

		}
	doc.writeln("&lt;body>");
      doc.writeln("&lt;title>Replacement&lt;/title>");
      doc.writeln("&lt;/body>");
      doc.writeln("&lt;p>");
      doc.writeln("Hello, World.");
      doc.writeln("&lt;/p>");
      doc.writeln("&lt;/body>");
      doc.writeln("&lt;/html>");
      doc.close();

},
/**
*
Replaces the current document checks that writeln adds a new line.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72161170
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98948567
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75233634
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35318390
*/
HTMLDocument21 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument21") != null) return;
    var doc;
      var docElem;
      var preElems;
      var preElem;
      var preText;
      var preValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      doc.open();

	if(

	(builder.contentType == "text/html")

	) {
	doc.writeln("&lt;html>");

	}

		else {
			doc.writeln("&lt;html xmlns='http://www.w3.org/1999/xhtml'>");

		}
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

},
/**
*
Checks that Node.isSupported("hTmL", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
*/
HTMLDocument22 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument22") != null) return;
    var doc;
      var state;
      var version = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      state = doc.isSupported("hTmL",version);
      assertTrue("isSupportedHTML",state);

},
/**
*
Checks that Node.isSupported("hTmL", "2.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
*/
HTMLDocument23 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument23") != null) return;
    var doc;
      var state;
      var version = "2.0";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      state = doc.isSupported("hTmL",version);
      assertTrue("isSupportedHTML",state);

},
/**
*
Checks that Node.isSupported("xhTmL", null) returns true if hasFeature("XML", null) is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
*/
HTMLDocument24 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument24") != null) return;
    var doc;
      var state;
      var hasXML;
      var version = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      hasXML = doc.isSupported("XML",version);
      state = doc.isSupported("xhTmL",version);
      assertEquals("isSupportedXHTML",hasXML,state);

},
/**
*
Checks that Node.isSupported("xhTmL", "2.0") returns true if hasFeature("XML", "2.0") is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
*/
HTMLDocument25 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument25") != null) return;
    var doc;
      var state;
      var hasXML;
      var version = "2.0";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      hasXML = doc.isSupported("XML",version);
      state = doc.isSupported("xhTmL",version);
      assertEquals("isSupportedXHTML",hasXML,state);

},
/**
*
Checks that Node.isSupported("cOrE", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
*/
HTMLDocument26 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument26") != null) return;
    var doc;
      var state;
      var version = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      state = doc.isSupported("cOrE",version);
      assertTrue("isSupportedCore",state);

},
/**
*
Checks that Node.isSupported("cOrE", "2.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-26809268
*/
HTMLDocument27 : function () {
   var success;
    if(checkInitialization(builder, "HTMLDocument27") != null) return;
    var doc;
      var state;
      var version = "2.0";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "document");
      state = doc.isSupported("cOrE",version);
      assertTrue("isSupportedCore",state);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the HEAD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement01") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("head");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-HEAD",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the SUB element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement02") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sub");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-SUB",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the SUP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement03") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-SUP",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the SPAN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement04") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("span");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-SPAN",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the BDO element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement05") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("bdo");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-BDO",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the TT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement06") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("tt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-TT",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the I element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement07") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("i");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-I",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the B element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement08") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("b");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-B",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the U element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement09") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("u");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-U",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the S element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement10") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("s");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-S",vid);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the SMALL element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement100 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement100") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("small");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the EM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement101 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement101") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("em");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the STRONG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement102 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement102") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strong");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the DFN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement103 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement103") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dfn");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},

/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the CODE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement104 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement104") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("code");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the SAMP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement105 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement105") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("samp");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the KBD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement106 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement106") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("kbd");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the VAR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement107 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement107") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("var");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the CITE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement108 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement108") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("cite");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the ACRONYM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement109 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement109") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("acronym");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the STRIKE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement11") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strike");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-STRIKE",vid);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the ABBR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement110 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement110") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("abbr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the DD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement111 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement111") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dd");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the DT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement112 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement112") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the NOFRAMES element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement113 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement113") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noframes");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the NOSCRIPT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement114 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement114") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noscript");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the ADDRESS element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement115 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement115") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("address");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the CENTER element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement116 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement116") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("center");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the HEAD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement117 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement117") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("head");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","HEAD-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the SUB element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement118 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement118") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sub");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","SUB-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the SUP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement119 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement119") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","SUP-class",vclassname);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the BIG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement12") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("big");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-BIG",vid);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the SPAN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement120 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement120") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("span");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","SPAN-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the BDO element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement121 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement121") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("bdo");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","BDO-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the TT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement122 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement122") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("tt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","TT-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the I element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement123 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement123") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("i");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","I-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the B element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement124 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement124") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("b");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","B-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the U element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement125 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement125") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("u");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","U-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the S element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement126 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement126") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("s");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","S-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the STRIKE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement127 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement127") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strike");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","STRIKE-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the BIG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement128 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement128") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("big");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","BIG-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the SMALL element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement129 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement129") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("small");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","SMALL-class",vclassname);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the SMALL element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement13") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("small");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-SMALL",vid);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the EM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement130 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement130") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("em");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","EM-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the STRONG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement131 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement131") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strong");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","STRONG-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the DFN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement132 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement132") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dfn");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","DFN-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the CODE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement133 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement133") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("code");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","CODE-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the SAMP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement134 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement134") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("samp");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","SAMP-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the KBD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement135 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement135") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("kbd");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","KBD-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the VAR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement136 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement136") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("var");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","VAR-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the CITE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement137 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement137") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("cite");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","CITE-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the ACRONYM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement138 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement138") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("acronym");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","ACRONYM-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the ABBR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement139 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement139") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("abbr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","ABBR-class",vclassname);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the EM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement14") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("em");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-EM",vid);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the DD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement140 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement140") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dd");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","DD-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the DT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement141 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement141") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","DT-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.


    Retrieve the class attribute of the NOFRAMES element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement142 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement142") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noframes");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","NOFRAMES-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the NOSCRIPT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement143 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement143") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noscript");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","NOSCRIPT-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the ADDRESS element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement144 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement144") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("address");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","ADDRESS-class",vclassname);

},
/**
*
    The className attribute specifies the class attribute of the element.

    Retrieve the class attribute of the CENTER element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95362176
*/
HTMLElement145 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement145") != null) return;
    var nodeList;
      var testNode;
      var vclassname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("center");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vclassname = testNode.className;

      assertEquals("classNameLink","CENTER-class",vclassname);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the STRONG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement15") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strong");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-STRONG",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the DFN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement16") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dfn");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-DFN",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the CODE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement17") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("code");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-CODE",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the SAMP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement18") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("samp");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-SAMP",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the KBD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement19") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("kbd");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-KBD",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the VAR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement20") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("var");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-VAR",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the CITE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement21 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement21") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("cite");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-CITE",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the ACRONYM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement22 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement22") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("acronym");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-ACRONYM",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the ABBR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement23 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement23") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("abbr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-ABBR",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the DD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement24 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement24") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dd");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-DD",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the DT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement25 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement25") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-DT",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the NOFRAMES element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement26 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement26") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noframes");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-NOFRAMES",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the NOSCRIPT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement27 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement27") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noscript");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-NOSCRIPT",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the ADDRESS element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement28 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement28") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("address");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-ADDRESS",vid);

},
/**
*
    The id specifies the elements identifier.

    Retrieve the id attribute of the CENTER element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/
HTMLElement29 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement29") != null) return;
    var nodeList;
      var testNode;
      var vid;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("center");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vid = testNode.id;

      assertEquals("idLink","Test-CENTER",vid);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the HEAD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement30 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement30") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("head");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","HEAD Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the SUB element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement31 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement31") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sub");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","SUB Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the SUP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement32 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement32") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","SUP Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the SPAN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement33 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement33") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("span");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","SPAN Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the BDO element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement34 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement34") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("bdo");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","BDO Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the TT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement35 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement35") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("tt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","TT Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the I element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement36 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement36") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("i");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","I Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the B element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement37 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement37") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("b");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","B Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the U element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement38 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement38") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("u");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","U Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the S element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement39 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement39") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("s");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","S Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the STRIKE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement40 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement40") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strike");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","STRIKE Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the BIG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement41 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement41") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("big");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","BIG Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the SMALL element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement42 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement42") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("small");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","SMALL Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the EM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement43 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement43") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("em");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","EM Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the STRONG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement44 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement44") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strong");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","STRONG Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the DFN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement45 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement45") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dfn");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","DFN Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the CODE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement46 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement46") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("code");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","CODE Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the SAMP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement47 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement47") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("samp");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","SAMP Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the KBD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement48 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement48") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("kbd");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","KBD Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the VAR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement49 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement49") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("var");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","VAR Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the CITE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement50 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement50") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("cite");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","CITE Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the ACRONYM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement51 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement51") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("acronym");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","ACRONYM Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the ABBR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement52 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement52") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("abbr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","ABBR Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the DD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement53 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement53") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dd");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","DD Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the DT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement54 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement54") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","DT Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the NOFRAMES element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement55 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement55") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noframes");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","NOFRAMES Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the NOSCRIPT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement56 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement56") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noscript");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","NOSCRIPT Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the ADDRESS element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement57 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement57") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("address");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","ADDRESS Element",vtitle);

},
/**
*
    The title attribute specifies the elements advisory title.

    Retrieve the title attribute of the CENTER element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78276800
*/
HTMLElement58 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement58") != null) return;
    var nodeList;
      var testNode;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("center");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtitle = testNode.title;

      assertEquals("titleLink","CENTER Element",vtitle);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the HEAD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement59 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement59") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("head");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the SUB element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement60 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement60") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sub");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the SUP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement61 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement61") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the SPAN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement62 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement62") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("span");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the BDO element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement63 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement63") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("bdo");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the TT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement64 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement64") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("tt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the I element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement65 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement65") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("i");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the B element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement66 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement66") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("b");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the U element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement67 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement67") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("u");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the S element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement68 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement68") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("s");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the STRIKE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement69 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement69") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strike");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the BIG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement70 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement70") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("big");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the SMALL element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement71 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement71") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("small");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the EM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement72 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement72") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("em");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the STRONG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement73 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement73") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strong");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the DFN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement74 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement74") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dfn");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the CODE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement75 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement75") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("code");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the SAMP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement76 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement76") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("samp");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the KBD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement77 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement77") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("kbd");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the VAR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement78 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement78") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("var");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the CITE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement79 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement79") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("cite");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the ACRONYM element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement80 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement80") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("acronym");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the ABBR element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement81 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement81") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("abbr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the DD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement82 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement82") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dd");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the DT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement83 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement83") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("dt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the NOFRAMES element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement84 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement84") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noframes");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the NOSCRIPT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement85 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement85") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("noscript");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the ADDRESS element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement86 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement86") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("address");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The lang attribute specifies the language code defined in RFC 1766.

    Retrieve the lang attribute of the CENTER element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59132807
*/
HTMLElement87 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement87") != null) return;
    var nodeList;
      var testNode;
      var vlang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("center");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vlang = testNode.lang;

      assertEquals("langLink","en",vlang);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the HEAD element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement88 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement88") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("head");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the SUB element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement89 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement89") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sub");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the SUP element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement90 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement90") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("sup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the SPAN element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement91 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement91") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("span");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the BDO element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement92 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement92") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("bdo");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the TT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement93 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement93") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("tt");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the I element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement94 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement94") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("i");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the B element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement95 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement95") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("b");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the U element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement96 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement96") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("u");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the S element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement97 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement97") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("s");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the STRIKE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement98 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement98") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("strike");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The dir attribute specifies the base direction of directionally neutral text and the directionality of tables.

    Retrieve the dir attribute of the BIG element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52460740
*/
HTMLElement99 : function () {
   var success;
    if(checkInitialization(builder, "HTMLElement99") != null) return;
    var nodeList;
      var testNode;
      var vdir;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "element");
      nodeList = doc.getElementsByTagName("big");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdir = testNode.dir;

      assertEquals("dirLink","ltr",vdir);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75392630
*/
HTMLFieldSetElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFieldSetElement01") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "fieldset");
      nodeList = doc.getElementsByTagName("fieldset");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form2",vform);

},
/**
*
    The form attribute returns null if control in not within the context of
    form.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75392630
*/
HTMLFieldSetElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFieldSetElement02") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "fieldset");
      nodeList = doc.getElementsByTagName("fieldset");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
/**
*
    The color attribute specifies the font's color.

    Retrieve the color attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53532975
*/
HTMLFontElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFontElement01") != null) return;
    var nodeList;
      var testNode;
      var vcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "font");
      nodeList = doc.getElementsByTagName("font");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcolor = testNode.color;

      assertEquals("colorLink","#000000",vcolor);

},
/**
*
    The face attribute specifies the font's face identifier.

    Retrieve the face attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-55715655
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#HTML-HTMLFormElement-length
*/
HTMLFontElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFontElement02") != null) return;
    var nodeList;
      var testNode;
      var vface;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "font");
      nodeList = doc.getElementsByTagName("font");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vface = testNode.face;

      assertEquals("faceLink","arial,helvetica",vface);

},
/**
*
    The size attribute specifies the font's size.

    Retrieve the size attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90127284
*/
HTMLFontElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFontElement03") != null) return;
    var nodeList;
      var testNode;
      var vsize;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "font");
      nodeList = doc.getElementsByTagName("font");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vsize = testNode.size;

      assertEquals("sizeLink","4",vsize);

},
/**
*
    The elements attribute specifies a collection of all control element
    in the form.

    Retrieve the elements attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76728479
*/
HTMLFormElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement01") != null) return;
    var nodeList;
      var elementnodeList;
      var testNode;
      var velements;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      elementnodeList = testNode.elements;

      velements = elementnodeList.length;

      assertEquals("elementsLink",3,velements);

},
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
HTMLFormElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement02") != null) return;
    var nodeList;
      var testNode;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlength = testNode.length;

      assertEquals("lengthLink",3,vlength);

},
/**
*
    The id(name) attribute specifies the name of the form.

    Retrieve the id attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-22051454
*/
HTMLFormElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement03") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.id;

      assertEquals("nameLink","form1",vname);

},
/**
*
    The acceptCharset attribute specifies the list of character sets
    supported by the server.

    Retrieve the acceptCharset attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-19661795
*/
HTMLFormElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement04") != null) return;
    var nodeList;
      var testNode;
      var vacceptcharset;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vacceptcharset = testNode.acceptCharset;

      assertEquals("acceptCharsetLink","US-ASCII",vacceptcharset);

},
/**
*
    The action attribute specifies the server-side form handler.

    Retrieve the action attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74049184
*/
HTMLFormElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement05") != null) return;
    var nodeList;
      var testNode;
      var vaction;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vaction = testNode.action;

      assertURIEquals("actionLink",null,null,null,"getData.pl",null,null,null,null,vaction);

},
/**
*
    The enctype attribute specifies the content of the submitted form.

    Retrieve the enctype attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84227810
*/
HTMLFormElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement06") != null) return;
    var nodeList;
      var testNode;
      var venctype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      venctype = testNode.enctype;

      assertEquals("enctypeLink","application/x-www-form-urlencoded",venctype);

},
/**
*
    The method attribute specifies the HTTP method used to submit the form.

    Retrieve the method attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82545539
*/
HTMLFormElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement07") != null) return;
    var nodeList;
      var testNode;
      var vmethod;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vmethod = testNode.method;

      assertEquals("methodLink","post",vmethod);

},
/**
*
    The target attribute specifies the frame to render the resource in.

    Retrieve the target attribute and examine it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6512890
*/
HTMLFormElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement08") != null) return;
    var nodeList;
      var testNode;
      var vtarget;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form2");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtarget = testNode.target;

      assertEquals("targetLink","dynamic",vtarget);

},
/**
*
HTMLFormElement.reset restores the forms default values.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76767677
*/
HTMLFormElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement09") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form2");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      testNode.reset();

},
/**
*
HTMLFormElement.submit submits the form.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76767676
*/
HTMLFormElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFormElement10") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "form3");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      testNode.submit();

},
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
HTMLFrameElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement01") != null) return;
    var nodeList;
      var testNode;
      var vframeborder;
      var doc;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vframeborder = testNode.frameBorder;

      assertEquals("frameborderLink","1",vframeborder);

},
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
HTMLFrameElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement02") != null) return;
    var nodeList;
      var testNode;
      var vlongdesc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vlongdesc = testNode.longDesc;

      assertEquals("longdescLink","about:blank",vlongdesc);

},
/**
*
    The marginHeight attribute specifies the frame margin height, in pixels.

    Retrieve the marginHeight attribute of the first FRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-55569778
*/
HTMLFrameElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement03") != null) return;
    var nodeList;
      var testNode;
      var vmarginheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vmarginheight = testNode.marginHeight;

      assertEquals("marginheightLink","10",vmarginheight);

},
/**
*
    The marginWidth attribute specifies the frame margin width, in pixels.

    Retrieve the marginWidth attribute of the first FRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8369969
*/
HTMLFrameElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement04") != null) return;
    var nodeList;
      var testNode;
      var vmarginwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vmarginwidth = testNode.marginWidth;

      assertEquals("marginwidthLink","5",vmarginwidth);

},
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
HTMLFrameElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement05") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","Frame1",vname);

},
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
HTMLFrameElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement06") != null) return;
    var nodeList;
      var testNode;
      var vnoresize;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vnoresize = testNode.noResize;

      assertTrue("noresizeLink",vnoresize);

},
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
HTMLFrameElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement07") != null) return;
    var nodeList;
      var testNode;
      var vscrolling;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vscrolling = testNode.scrolling;

      assertEquals("scrollingLink","yes",vscrolling);

},
/**
*
    The src attribute specifies a URI designating the initial frame contents.

    Retrieve the src attribute of the first FRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-78799535
*/
HTMLFrameElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement08") != null) return;
    var nodeList;
      var testNode;
      var vsrc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame");
      nodeList = doc.getElementsByTagName("frame");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vsrc = testNode.src;

      assertURIEquals("srcLink",null,null,null,null,"right",null,null,null,vsrc);

},
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
HTMLFrameElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameElement09") != null) return;
    var testNode;
      var cd;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frame2");
      doc.onload = function() {
        testNode = doc.getElementById("Frame1");
        cd = testNode.contentDocument;

        vtitle = cd.title;

        // Updated as per: http://lists.w3.org/Archives/Public/www-dom/2009JulSep/0026.html
        assertEquals("titleLink","NIST DOM HTML Test - FRAME",vtitle);
      };
},
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
HTMLFrameSetElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameSetElement01") != null) return;
    var nodeList;
      var testNode;
      var vcols;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frameset");
      nodeList = doc.getElementsByTagName("frameset");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vcols = testNode.cols;

      assertEquals("colsLink","20, 80",vcols);

},
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
HTMLFrameSetElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLFrameSetElement02") != null) return;
    var nodeList;
      var testNode;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "frameset");
      nodeList = doc.getElementsByTagName("frameset");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vrows = testNode.rows;

      assertEquals("rowsLink","100, 200",vrows);

},
/**
*
    The align attribute specifies the rule alignment on the page.

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-15235012
*/
HTMLHRElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHRElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hr");
      nodeList = doc.getElementsByTagName("hr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
    The noShade attribute specifies that the rule should be drawn as
    a solid color.

    Retrieve the noShade attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79813978
*/
HTMLHRElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHRElement02") != null) return;
    var nodeList;
      var testNode;
      var vnoshade;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hr");
      nodeList = doc.getElementsByTagName("hr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vnoshade = testNode.noShade;

      assertTrue("noShadeLink",vnoshade);

},
/**
*
    The size attribute specifies the height of the rule.

    Retrieve the size attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77612587
*/
HTMLHRElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHRElement03") != null) return;
    var nodeList;
      var testNode;
      var vsize;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hr");
      nodeList = doc.getElementsByTagName("hr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vsize = testNode.size;

      assertEquals("sizeLink","5",vsize);

},
/**
*
    The width attribute specifies the width of the rule.

    Retrieve the width attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87744198
*/
HTMLHRElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHRElement04") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hr");
      nodeList = doc.getElementsByTagName("hr");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","400",vwidth);

},
/**
*
    The profile attribute specifies a URI designating a metadata profile.

    Retrieve the profile attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96921909
*/
HTMLHeadElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHeadElement01") != null) return;
    var nodeList;
      var testNode;
      var vprofile;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "head");
      nodeList = doc.getElementsByTagName("head");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vprofile = testNode.profile;

      assertURIEquals("profileLink",null,null,null,"profile",null,null,null,null,vprofile);

},
/**
*
    The align attribute specifies the horizontal text alignment(H1).

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
*/
HTMLHeadingElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHeadingElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "heading");
      nodeList = doc.getElementsByTagName("h1");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
    The align attribute specifies the horizontal text alignment(H2).

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
*/
HTMLHeadingElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHeadingElement02") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "heading");
      nodeList = doc.getElementsByTagName("h2");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","left",valign);

},
/**
*
    The align attribute specifies the horizontal text alignment(H3).

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
*/
HTMLHeadingElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHeadingElement03") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "heading");
      nodeList = doc.getElementsByTagName("h3");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","right",valign);

},
/**
*
    The align attribute specifies the horizontal text alignment(H4).

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
*/
HTMLHeadingElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHeadingElement04") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "heading");
      nodeList = doc.getElementsByTagName("h4");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","justify",valign);

},
/**
*
    The align attribute specifies the horizontal text alignment(H5).

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
*/
HTMLHeadingElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHeadingElement05") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "heading");
      nodeList = doc.getElementsByTagName("h5");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
    The align attribute specifies the horizontal text alignment(H6).

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6796462
*/
HTMLHeadingElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHeadingElement06") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "heading");
      nodeList = doc.getElementsByTagName("h6");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","left",valign);

},
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
HTMLHtmlElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLHtmlElement01") != null) return;
    var nodeList;
      var testNode;
      var vversion;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "html");
      nodeList = doc.getElementsByTagName("html");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vversion = testNode.version;


	if(

	(builder.contentType == "text/html")

	) {
	assertEquals("versionLink","-//W3C//DTD HTML 4.01 Transitional//EN",vversion);

	}

},
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
HTMLIFrameElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","top",valign);

},
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
HTMLIFrameElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement02") != null) return;
    var nodeList;
      var testNode;
      var vframeborder;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vframeborder = testNode.frameBorder;

      assertEquals("frameborderLink","1",vframeborder);

},
/**
*
    The height attribute specifies the frame height.

    Retrieve the height attribute of the first IFRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-1678118
*/
HTMLIFrameElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement03") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vheight = testNode.height;

      assertEquals("heightLink","50",vheight);

},
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
HTMLIFrameElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement04") != null) return;
    var nodeList;
      var testNode;
      var vlongdesc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlongdesc = testNode.longDesc;

      assertEquals("longdescLink","about:blank",vlongdesc);

},
/**
*
    The marginWidth attribute specifies the frame margin width, in pixels.

    Retrieve the marginWidth attribute of the first FRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66486595
*/
HTMLIFrameElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement05") != null) return;
    var nodeList;
      var testNode;
      var vmarginwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vmarginwidth = testNode.marginWidth;

      assertEquals("marginwidthLink","5",vmarginwidth);

},
/**
*
    The marginHeight attribute specifies the frame margin height, in pixels.

    Retrieve the marginHeight attribute of the first IFRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-91371294
*/
HTMLIFrameElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement06") != null) return;
    var nodeList;
      var testNode;
      var vmarginheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vmarginheight = testNode.marginHeight;

      assertEquals("marginheightLink","10",vmarginheight);

},
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
HTMLIFrameElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement07") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","Iframe1",vname);

},
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
HTMLIFrameElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement08") != null) return;
    var nodeList;
      var testNode;
      var vscrolling;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vscrolling = testNode.scrolling;

      assertEquals("scrollingLink","yes",vscrolling);

},
/**
*
    The src attribute specifies a URI designating the initial frame contents.

    Retrieve the src attribute of the first FRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-43933957
*/
HTMLIFrameElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement09") != null) return;
    var nodeList;
      var testNode;
      var vsrc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vsrc = testNode.src;

      assertURIEquals("srcLink",null,null,null,null,"right",null,null,null,vsrc);

},
/**
*
    The width attribute specifies the frame width.

    Retrieve the width attribute of the first IFRAME element and examine
    it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67133005
*/
HTMLIFrameElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement10") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe");
      nodeList = doc.getElementsByTagName("iframe");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","60",vwidth);

},
/**
*
    Retrieve the contentDocument attribute of the second IFRAME element
    and examine its title.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-67133006
*/
HTMLIFrameElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIFrameElement11") != null) return;
    var testNode;
      var cd;
      var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "iframe2");
      doc.onload = function() {
        testNode = doc.getElementById("Iframe2");
        cd = testNode.contentDocument;

        vtitle = cd.title;

        assertEquals("titleLink","NIST DOM HTML Test - FRAME",vtitle);
      };
},
/**
*
    The name attribute specifies the name of the element.

    Retrieve the name attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47534097
*/
HTMLImageElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement01") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","IMAGE-1",vname);

},
/**
*
    The align attribute aligns this object with respect to its surrounding
    text.

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-3211094
*/
HTMLImageElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement02") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","middle",valign);

},
/**
*
    The alt attribute specifies an alternative text for user agenst not
    rendering the normal content of this element.

    Retrieve the alt attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95636861
*/
HTMLImageElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement03") != null) return;
    var nodeList;
      var testNode;
      var valt;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valt = testNode.alt;

      assertEquals("altLink","DTS IMAGE LOGO",valt);

},
/**
*
    The border attribute specifies the width of the border around the image.

    Retrieve the border attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-136671
*/
HTMLImageElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement04") != null) return;
    var nodeList;
      var testNode;
      var vborder;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vborder = testNode.border;

      assertEquals("borderLink","0",vborder);

},
/**
*
    The height attribute overrides the natural "height" of the image.

    Retrieve the height attribute and examine it's value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-91561496
*/
HTMLImageElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement05") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vheight = testNode.height;

      assertEquals("heightLink",47,vheight);

},
/**
*
    The hspace attribute specifies the horizontal space to the left and
    right of this image.

    Retrieve the hspace attribute and examine it's value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-53675471
*/
HTMLImageElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement06") != null) return;
    var nodeList;
      var testNode;
      var vhspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhspace = testNode.hspace;

      assertEquals("hspaceLink",4,vhspace);

},
/**
*
    The isMap attribute indicates the use of server-side image map.

    Retrieve the isMap attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58983880
*/
HTMLImageElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement07") != null) return;
    var nodeList;
      var testNode;
      var vismap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vismap = testNode.isMap;

      assertFalse("isMapLink",vismap);

},
/**
*
    The longDesc attribute contains an URI designating a long description
    of this image or frame.

    Retrieve the longDesc attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77376969
*/
HTMLImageElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement08") != null) return;
    var nodeList;
      var testNode;
      var vlongdesc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vlongdesc = testNode.longDesc;

      assertURIEquals("longDescLink",null,null,null,"desc.html",null,null,null,null,vlongdesc);

},
/**
*
    The src attribute contains an URI designating the source of this image.

    Retrieve the src attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87762984
*/
HTMLImageElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement09") != null) return;
    var nodeList;
      var testNode;
      var vsrc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vsrc = testNode.src;

      assertURIEquals("srcLink",null,null,null,"dts.gif",null,null,null,null,vsrc);

},
/**
*
    The useMap attribute specifies to use the client-side image map.

    Retrieve the useMap attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35981181
*/
HTMLImageElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement10") != null) return;
    var nodeList;
      var testNode;
      var vusemap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vusemap = testNode.useMap;

      assertEquals("useMapLink","#DTS-MAP",vusemap);

},
/**
*
    The vspace attribute specifies the vertical space above and below this
    image.

    Retrieve the vspace attribute and examine it's value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-85374897
*/
HTMLImageElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement11") != null) return;
    var nodeList;
      var testNode;
      var vvspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvspace = testNode.vspace;

      assertEquals("vspaceLink",10,vvspace);

},
/**
*
    The width attribute overrides the natural "width" of the image.

    Retrieve the width attribute and examine it's value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-13839076
*/
HTMLImageElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLImageElement12") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "img");
      nodeList = doc.getElementsByTagName("img");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink",115,vwidth);

},
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
HTMLInputElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement01") != null) return;
    var nodeList;
      var testNode;
      var vdefaultvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      vdefaultvalue = testNode.defaultValue;

      assertEquals("defaultValueLink","Password",vdefaultvalue);

},
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
HTMLInputElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement02") != null) return;
    var nodeList;
      var testNode;
      var vdefaultchecked;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(3);
      vdefaultchecked = testNode.defaultChecked;

      assertTrue("defaultCheckedLink",vdefaultchecked);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute of the 1st INPUT element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63239895
*/
HTMLInputElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement03") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form1",vform);

},
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
HTMLInputElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement04") != null) return;
    var nodeList;
      var testNode;
      var vaccept;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(8);
      vaccept = testNode.accept;

      assertEquals("acceptLink","GIF,JPEG",vaccept);

},
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
HTMLInputElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement05") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(1);
      vaccesskey = testNode.accessKey;

      assertEquals("accesskeyLink","c",vaccesskey);

},
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
HTMLInputElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement06") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(3);
      valign = testNode.align;

      assertEquals("alignLink","bottom".toLowerCase(),valign.toLowerCase());

},
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
HTMLInputElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement07") != null) return;
    var nodeList;
      var testNode;
      var valt;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      valt = testNode.alt;

      assertEquals("altLink","Password entry",valt);

},
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
HTMLInputElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement08") != null) return;
    var nodeList;
      var testNode;
      var vchecked;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(2);
      vchecked = testNode.checked;

      assertTrue("checkedLink",vchecked);

},
/**
*
    The disabled attribute has a TRUE value if it is explicitly set.

    Retrieve the disabled attribute of the 7th INPUT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-50886781
*/
HTMLInputElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement09") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(6);
      vdisabled = testNode.disabled;

      assertTrue("disabledLink",vdisabled);

},
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
HTMLInputElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement10") != null) return;
    var nodeList;
      var testNode;
      var vmaxlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      vmaxlength = testNode.maxLength;

      assertEquals("maxlengthLink",5,vmaxlength);

},
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
HTMLInputElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement11") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","Password",vname);

},
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
HTMLInputElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement12") != null) return;
    var nodeList;
      var testNode;
      var vreadonly;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      vreadonly = testNode.readOnly;

      assertTrue("readonlyLink",vreadonly);

},
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
HTMLInputElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement13") != null) return;
    var nodeList;
      var testNode;
      var vsize;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      vsize = testNode.size;

      assertEquals("size",25,vsize);

},
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
HTMLInputElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement14") != null) return;
    var nodeList;
      var testNode;
      var vsrc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(7);
      vsrc = testNode.src;

      assertURIEquals("srcLink",null,null,null,"submit.gif",null,null,null,null,vsrc);

},
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
HTMLInputElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement15") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(2);
      vtabindex = testNode.tabIndex;

      assertEquals("tabindexLink",9,vtabindex);

},
/**
*
    The type attribute is the type of control created.

    Retrieve the type attribute of the 1st INPUT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62883744
*/
HTMLInputElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement16") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","password",vtype);

},
/**
*
    The useMap attribute specifies the use of the client-side image map.

    Retrieve the useMap attribute of the 8th INPUT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32463706
*/
HTMLInputElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement17") != null) return;
    var nodeList;
      var testNode;
      var vusemap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(7);
      vusemap = testNode.useMap;

      assertEquals("usemapLink","#submit-map",vusemap);

},
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
HTMLInputElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement18") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(1);
      vvalue = testNode.value;

      assertEquals("valueLink","ReHire",vvalue);

},
/**
*
HTMLInputElement.blur should surrender input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-26838235
*/
HTMLInputElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement19") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(1);
      testNode.blur();

},
/**
*
HTMLInputElement.focus should capture input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-65996295
*/
HTMLInputElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement20") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(1);
      testNode.focus();

},
/**
*
HTMLInputElement.click should change the state of checked on a radio button.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-2651361
*/
HTMLInputElement21 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement21") != null) return;
    var nodeList;
      var testNode;
      var doc;
      var checked;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(1);
      checked = testNode.checked;

      assertFalse("notCheckedBeforeClick",checked);
testNode.click();
      checked = testNode.checked;

      assertTrue("checkedAfterClick",checked);

},
/**
*
HTMLInputElement.select should select the contents of a text area.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-34677168
*/
HTMLInputElement22 : function () {
   var success;
    if(checkInitialization(builder, "HTMLInputElement22") != null) return;
    var nodeList;
      var testNode;
      var doc;
      var checked;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "input");
      nodeList = doc.getElementsByTagName("input");
      assertSize("Asize",9,nodeList);
testNode = nodeList.item(0);
      testNode.select();

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87069980
*/
HTMLIsIndexElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIsIndexElement01") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;
      var prompt;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "isindex");
      nodeList = doc.getElementsByTagName("isindex");
      testNode = nodeList.item(0);
      assertNotNull("notnull",testNode);
prompt = testNode.prompt;

      assertEquals("IsIndex.Prompt","New Employee: ",prompt);
       fNode = testNode.form;

      assertNotNull("formNotNull",fNode);
vform = fNode.id;

      assertEquals("formLink","form1",vform);
       assertSize("Asize",2,nodeList);

},
/**
*
    The form attribute returns null if control in not within the context of
    form.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87069980
*/
HTMLIsIndexElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIsIndexElement02") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;
      var prompt;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "isindex");
      nodeList = doc.getElementsByTagName("isindex");
      testNode = nodeList.item(1);
      assertNotNull("notnull",testNode);
prompt = testNode.prompt;

      assertEquals("IsIndex.Prompt","Old Employee: ",prompt);
       vform = testNode.form;

      assertNull("formNullLink",vform);
    assertSize("Asize",2,nodeList);

},
/**
*
    The prompt attribute specifies the prompt message.

    Retrieve the prompt attribute of the 1st isindex element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33589862
*/
HTMLIsIndexElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLIsIndexElement03") != null) return;
    var nodeList;
      var testNode;
      var vprompt;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "isindex");
      nodeList = doc.getElementsByTagName("isindex");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vprompt = testNode.prompt;

      assertEquals("promptLink","New Employee: ",vprompt);

},
/**
*
    The type attribute is a list item bullet style.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52387668
*/
HTMLLIElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLIElement01") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "li");
      nodeList = doc.getElementsByTagName("li");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","square",vtype);

},
/**
*
    The value attribute is a reset sequence number when used in OL.

    Retrieve the value attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-45496263
*/
HTMLLIElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLIElement02") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "li");
      nodeList = doc.getElementsByTagName("li");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vvalue = testNode.value;

      assertEquals("valueLink",2,vvalue);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32480901
*/
HTMLLabelElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLabelElement01") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "label");
      nodeList = doc.getElementsByTagName("label");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form1",vform);

},
/**
*
    The form attribute returns null if control in not within the context of
    form.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32480901
*/
HTMLLabelElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLabelElement02") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "label");
      nodeList = doc.getElementsByTagName("label");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
/**
*
    The accessKey attribute is a single character access key to give access
    to the form control.

    Retrieve the accessKey attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-43589892
*/
HTMLLabelElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLabelElement03") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "label");
      nodeList = doc.getElementsByTagName("label");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("accesskeyLink","b",vaccesskey);

},
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
HTMLLabelElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLabelElement04") != null) return;
    var nodeList;
      var testNode;
      var vhtmlfor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "label");
      nodeList = doc.getElementsByTagName("label");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vhtmlfor = testNode.htmlFor;

      assertEquals("htmlForLink","input1",vhtmlfor);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute from the first LEGEND element
    and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-29594519
*/
HTMLLegendElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLegendElement01") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "legend");
      nodeList = doc.getElementsByTagName("legend");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form1",vform);

},
/**
*
    The form attribute returns null if control in not within the context of
    form.

    Retrieve the second ELEMENT and examine its form element.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-29594519
*/
HTMLLegendElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLegendElement02") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "legend");
      nodeList = doc.getElementsByTagName("legend");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
/**
*
    The accessKey attribute is a single character access key to give access
    to the form control.

    Retrieve the accessKey attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-11297832
*/
HTMLLegendElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLegendElement03") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "legend");
      nodeList = doc.getElementsByTagName("legend");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("accesskeyLink","b",vaccesskey);

},
/**
*
    The align attribute specifies the text alignment relative to FIELDSET.

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79538067
*/
HTMLLegendElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLegendElement04") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "legend");
      nodeList = doc.getElementsByTagName("legend");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","top",valign);

},
/**
*
    The disabled attribute enables/disables the link.

    Retrieve the disabled attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87355129
*/
HTMLLinkElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement01") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vdisabled = testNode.disabled;

      assertFalse("disabled",vdisabled);

},
/**
*
    The charset attribute indicates the character encoding of the linked
    resource.

    Retrieve the charset attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63954491
*/
HTMLLinkElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement02") != null) return;
    var nodeList;
      var testNode;
      var vcharset;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vcharset = testNode.charset;

      assertEquals("charsetLink","Latin-1",vcharset);

},
/**
*
    The href attribute specifies the URI of the linked resource.

    Retrieve the href attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33532588
*/
HTMLLinkElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement03") != null) return;
    var nodeList;
      var testNode;
      var vhref;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vhref = testNode.href;

      assertURIEquals("hrefLink",null,null,null,"glossary.html",null,null,null,null,vhref);

},
/**
*
    The hreflang attribute specifies the language code of the linked resource.

    Retrieve the hreflang attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-85145682
*/
HTMLLinkElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement04") != null) return;
    var nodeList;
      var testNode;
      var vhreflang;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vhreflang = testNode.hreflang;

      assertEquals("hreflangLink","en",vhreflang);

},
/**
*
    The media attribute specifies the targeted media.

    Retrieve the media attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75813125
*/
HTMLLinkElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement05") != null) return;
    var nodeList;
      var testNode;
      var vmedia;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vmedia = testNode.media;

      assertEquals("mediaLink","screen",vmedia);

},
/**
*
    The rel attribute specifies the forward link type.

    Retrieve the rel attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-41369587
*/
HTMLLinkElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement06") != null) return;
    var nodeList;
      var testNode;
      var vrel;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vrel = testNode.rel;

      assertEquals("relLink","Glossary",vrel);

},
/**
*
    The rev attribute specifies the reverse link type.

    Retrieve the rev attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40715461
*/
HTMLLinkElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement07") != null) return;
    var nodeList;
      var testNode;
      var vrev;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vrev = testNode.rev;

      assertEquals("revLink","stylesheet",vrev);

},
/**
*
    The type attribute specifies the advisory content type.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32498296
*/
HTMLLinkElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement08") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","text/html",vtype);

},
/**
*
    The target attribute specifies the frame to render the resource in.

    Retrieve the target attribute and examine it's value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84183095
*/
HTMLLinkElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLLinkElement09") != null) return;
    var nodeList;
      var testNode;
      var vtarget;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "link2");
      nodeList = doc.getElementsByTagName("link");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtarget = testNode.target;

      assertEquals("targetLink","dynamic",vtarget);

},
/**
*
    The  areas attribute is a list of areas defined for the image map.

    Retrieve the areas attribute and find the number of areas defined.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71838730
*/
HTMLMapElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLMapElement01") != null) return;
    var nodeList;
      var areasnodeList;
      var testNode;
      var vareas;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "map");
      nodeList = doc.getElementsByTagName("map");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      areasnodeList = testNode.areas;

      vareas = areasnodeList.length;

      assertEquals("areasLink",3,vareas);

},
/**
*
    The name attribute names the map(for use with usemap).

    Retrieve the name attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52696514
*/
HTMLMapElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLMapElement02") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "map");
      nodeList = doc.getElementsByTagName("map");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("mapLink","mapid",vname);

},
/**
*
    The compact attribute specifies a boolean value on whether to display
    the list more compactly.

    Retrieve the compact attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68436464
*/
HTMLMenuElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLMenuElement01") != null) return;
    var nodeList;
      var testNode;
      var vcompact;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "menu");
      nodeList = doc.getElementsByTagName("menu");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcompact = testNode.compact;

      assertTrue("compactLink",vcompact);

},
/**
*
    The content attribute specifies associated information.

    Retrieve the content attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87670826
*/
HTMLMetaElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLMetaElement01") != null) return;
    var nodeList;
      var testNode;
      var vcontent;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "meta");
      nodeList = doc.getElementsByTagName("meta");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcontent = testNode.content;

      assertEquals("contentLink","text/html; CHARSET=utf-8",vcontent);

},
/**
*
    The httpEquiv attribute specifies an HTTP respnse header name.

    Retrieve the httpEquiv attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77289449
*/
HTMLMetaElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLMetaElement02") != null) return;
    var nodeList;
      var testNode;
      var vhttpequiv;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "meta");
      nodeList = doc.getElementsByTagName("meta");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhttpequiv = testNode.httpEquiv;

      assertEquals("httpEquivLink","Content-Type",vhttpequiv);

},
/**
*
    The name attribute specifies the meta information name.

    Retrieve the name attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-31037081
*/
HTMLMetaElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLMetaElement03") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "meta");
      nodeList = doc.getElementsByTagName("meta");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","Meta-Name",vname);

},
/**
*
    The scheme attribute specifies a select form of content.

    Retrieve the scheme attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35993789
*/
HTMLMetaElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLMetaElement04") != null) return;
    var nodeList;
      var testNode;
      var vscheme;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "meta");
      nodeList = doc.getElementsByTagName("meta");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vscheme = testNode.scheme;

      assertEquals("schemeLink","NIST",vscheme);

},
/**
*
    The cite attribute specifies an URI designating a document that describes
    the reason for the change.

    Retrieve the cite attribute of the INS element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75101708
*/
HTMLModElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLModElement01") != null) return;
    var nodeList;
      var testNode;
      var vcite;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "mod");
      nodeList = doc.getElementsByTagName("ins");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcite = testNode.cite;

      assertURIEquals("citeLink",null,null,null,"ins-reasons.html",null,null,null,null,vcite);

},
/**
*
    The dateTime attribute specifies the date and time of the change.

    Retrieve the dateTime attribute of the INS element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88432678
*/
HTMLModElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLModElement02") != null) return;
    var nodeList;
      var testNode;
      var vdatetime;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "mod");
      nodeList = doc.getElementsByTagName("ins");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdatetime = testNode.dateTime;

      assertEquals("dateTimeLink","January 1, 2002",vdatetime);

},
/**
*
    The cite attribute specifies an URI designating a document that describes
    the reason for the change.

    Retrieve the cite attribute of the DEL element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75101708
*/
HTMLModElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLModElement03") != null) return;
    var nodeList;
      var testNode;
      var vcite;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "mod");
      nodeList = doc.getElementsByTagName("del");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcite = testNode.cite;

      assertURIEquals("citeLink",null,null,null,"del-reasons.html",null,null,null,null,vcite);

},
/**
*
    The dateTime attribute specifies the date and time of the change.

    Retrieve the dateTime attribute of the DEL element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88432678
*/
HTMLModElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLModElement04") != null) return;
    var nodeList;
      var testNode;
      var vdatetime;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "mod");
      nodeList = doc.getElementsByTagName("del");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdatetime = testNode.dateTime;

      assertEquals("dateTimeLink","January 2, 2002",vdatetime);

},
/**
*
    The compact attribute specifies a boolean value on whether to display
    the list more compactly.

    Retrieve the compact attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76448506
*/
HTMLOListElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOListElement01") != null) return;
    var nodeList;
      var testNode;
      var vcompact;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "olist");
      nodeList = doc.getElementsByTagName("ol");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcompact = testNode.compact;

      assertTrue("compactLink",vcompact);

},
/**
*
    The start attribute specifies the starting sequence number.

    Retrieve the start attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14793325
*/
HTMLOListElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOListElement02") != null) return;
    var nodeList;
      var testNode;
      var vstart;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "olist");
      nodeList = doc.getElementsByTagName("ol");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vstart = testNode.start;

      assertEquals("startLink",1,vstart);

},
/**
*
    The type attribute specifies the numbering style.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-40971103
*/
HTMLOListElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOListElement03") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "olist");
      nodeList = doc.getElementsByTagName("ol");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","1",vtype);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46094773
*/
HTMLObjectElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement01") != null) return;
    var nodeList;
      var testNode;
      var fNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object2");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("idLink","object2",vform);

},
/**
*
The code attribute specifies an Applet class file.

Retrieve the code attribute of the second OBJECT element and examine
its value.  Should be "" since CODE is not a valid attribute for OBJECT.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75241146
*/
HTMLObjectElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement02") != null) return;
    var nodeList;
      var testNode;
      var vcode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vcode = testNode.code;

      assertEquals("codeLink","",vcode);

},
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
HTMLObjectElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement03") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","middle",valign);

},
/**
*
    The archive attribute specifies a space-separated list of archives.

    Retrieve the archive attribute of the first OBJECT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47783837
*/
HTMLObjectElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement04") != null) return;
    var nodeList;
      var testNode;
      var varchive;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      varchive = testNode.archive;

      assertEquals("archiveLink","",varchive);

},
/**
*
    The border attribute specifies the widht of the border around the object.

    Retrieve the border attribute of the first OBJECT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82818419
*/
HTMLObjectElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement05") != null) return;
    var nodeList;
      var testNode;
      var vborder;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vborder = testNode.border;

      assertEquals("borderLink","0",vborder);

},
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
HTMLObjectElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement06") != null) return;
    var nodeList;
      var testNode;
      var vcodebase;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vcodebase = testNode.codeBase;

      assertURIEquals("codebaseLink",null,"//xw2k.sdct.itl.nist.gov/brady/dom/",null,null,null,null,null,null,vcodebase);

},
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
HTMLObjectElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement07") != null) return;
    var nodeList;
      var testNode;
      var vcodetype;
      var doc;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vcodetype = testNode.codeType;

      assertEquals("codetypeLink","image/gif",vcodetype);

},
/**
*
    The data attribute specifies the URI of the location of the objects data.

    Retrieve the data attribute of the first OBJECT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-81766986
*/
HTMLObjectElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement08") != null) return;
    var nodeList;
      var testNode;
      var vdata;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vdata = testNode.data;

      assertURIEquals("dataLink",null,null,null,"logo.gif",null,null,null,null,vdata);

},
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
HTMLObjectElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement09") != null) return;
    var nodeList;
      var testNode;
      var vdeclare;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vdeclare = testNode.declare;

      assertTrue("declareLink",vdeclare);

},
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
HTMLObjectElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement10") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vheight = testNode.height;

      assertEquals("heightLink","60",vheight);

},
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
HTMLObjectElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement11") != null) return;
    var nodeList;
      var testNode;
      var vhspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vhspace = testNode.hspace;

      assertEquals("hspaceLink",0,vhspace);

},
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
HTMLObjectElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement12") != null) return;
    var nodeList;
      var testNode;
      var vstandby;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vstandby = testNode.standby;

      assertEquals("alignLink","Loading Image ...",vstandby);

},
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
HTMLObjectElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement13") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",0,vtabindex);

},
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
HTMLObjectElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement14") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","image/gif",vtype);

},
/**
*
    The useMap attribute specifies the used client-side image map.

    Retrieve the useMap attribute of the first OBJECT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6649772
*/
HTMLObjectElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement15") != null) return;
    var nodeList;
      var testNode;
      var vusemap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vusemap = testNode.useMap;

      assertEquals("useMapLink","#DivLogo-map",vusemap);

},
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
HTMLObjectElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement16") != null) return;
    var nodeList;
      var testNode;
      var vvspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vvspace = testNode.vspace;

      assertEquals("vspaceLink",0,vvspace);

},
/**
*
    The width attribute overrides the original width value.

    Retrieve the width attribute of the first OBJECT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-38538620
*/
HTMLObjectElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement17") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","550",vwidth);

},
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
HTMLObjectElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement18") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vname = testNode.name;

      assertEquals("vspaceLink","OBJECT2",vname);

},
/**
*
    The form attribute returns null if control in not within the context of
    form.

    Retrieve the form attribute and examine its value.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46094773
*/
HTMLObjectElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement19") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object2");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
/**
*
    The contentDocument attribute specifies the document this object contains,
    if there is any and it is available, or null otherwise.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-38538621
*/
HTMLObjectElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLObjectElement20") != null) return;
    var testNode;
      var cd;
      var vtitle;
      var doc;
      var nodeList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object2");
      nodeList = doc.getElementsByTagName("object");
      testNode = nodeList.item(1);
      cd = testNode.contentDocument;

      assertNull("noContentDocument",cd);

},
/**
*
    The disabled attribute indicates that the control is unavailable in
    this context.

    Retrieve the disabled attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-15518803
*/
HTMLOptGroupElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptGroupElement01") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "optgroup");
      nodeList = doc.getElementsByTagName("optgroup");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vdisabled = testNode.disabled;

      assertTrue("disabledLink",vdisabled);

},
/**
*
    The label attribute specifies the label assigned to this option group.

    Retrieve the label attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-95806054
*/
HTMLOptGroupElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptGroupElement02") != null) return;
    var nodeList;
      var testNode;
      var vlabel;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "optgroup");
      nodeList = doc.getElementsByTagName("optgroup");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vlabel = testNode.label;

      assertEquals("labelLink","Regular Employees",vlabel);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute from the first SELECT element
    and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-17116503
*/
HTMLOptionElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement01") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form1",vform);

},
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
HTMLOptionElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement02") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(6);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
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
HTMLOptionElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement03") != null) return;
    var nodeList;
      var testNode;
      var vdefaultselected;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(0);
      vdefaultselected = testNode.defaultSelected;

      assertTrue("defaultSelectedLink",vdefaultselected);

},
/**
*
    The text attribute contains the text contained within the option element.

    Retrieve the text attribute from the second OPTION element
    and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48154426
*/
HTMLOptionElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement04") != null) return;
    var nodeList;
      var testNode;
      var vtext;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(1);
      vtext = testNode.text;

      assertEquals("textLink","EMP10002",vtext);

},
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
HTMLOptionElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement05") != null) return;
    var nodeList;
      var testNode;
      var vindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(6);
      vindex = testNode.index;

      assertEquals("indexLink",1,vindex);

},
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
HTMLOptionElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement06") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(9);
      vdisabled = testNode.disabled;

      assertTrue("disabledLink",vdisabled);

},
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
HTMLOptionElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement07") != null) return;
    var nodeList;
      var testNode;
      var vlabel;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(1);
      vlabel = testNode.label;

      assertEquals("labelLink","l1",vlabel);

},
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
HTMLOptionElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement08") != null) return;
    var nodeList;
      var testNode;
      var vselected;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(0);
      vselected = testNode.defaultSelected;

      assertTrue("selectedLink",vselected);

},
/**
*
    The value attribute contains the current form control value.

    Retrieve the value attribute from the first OPTION element
    and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6185554
*/
HTMLOptionElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionElement09") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "option");
      nodeList = doc.getElementsByTagName("option");
      assertSize("Asize",10,nodeList);
testNode = nodeList.item(0);
      vvalue = testNode.value;

      assertEquals("valueLink","10001",vvalue);

},
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
HTMLOptionsCollection01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionsCollection01") != null) return;
    var nodeList;
      var testNode;
      var optionsList;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "optionscollection");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      optionsList = testNode.options;

      vlength = optionsList.length;

      assertEquals("lengthLink",5,vlength);

},
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
HTMLOptionsCollection02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionsCollection02") != null) return;
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
      doc = load(docRef, "doc", "optionscollection");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      optionsList = testNode.options;

      optionsNode = optionsList.item(3);
      optionsValueNode = optionsNode.firstChild;

      vvalue = optionsValueNode.nodeValue;

      assertEquals("valueIndexLink","EMP10004",vvalue);

},
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
HTMLOptionsCollection03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionsCollection03") != null) return;
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
      doc = load(docRef, "doc", "optionscollection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      optionsNode = formsnodeList.namedItem("select1");
      vname = optionsNode.nodeName;

      assertEqualsAutoCase("element", "nameIndexLink","select",vname);

},
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
HTMLOptionsCollection04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionsCollection04") != null) return;
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
      doc = load(docRef, "doc", "optionscollection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      optionsNode = formsnodeList.namedItem("selectId");
      vname = optionsNode.nodeName;

      assertEqualsAutoCase("element", "nameIndexLink","select",vname);

},
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
HTMLOptionsCollection05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionsCollection05") != null) return;
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
      doc = load(docRef, "doc", "optionscollection");
      nodeList = doc.getElementsByTagName("form");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      formsnodeList = testNode.elements;

      optionsNode = formsnodeList.namedItem("select9");
      assertNull("nameIndexLink",optionsNode);

},
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
HTMLOptionsCollection06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionsCollection06") != null) return;
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
      doc = load(docRef, "doc", "optionscollection");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      optionsList = testNode.options;

      optionsNode = optionsList.item(10);
      assertNull("optionsIndexLink",optionsNode);

},
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
HTMLOptionsCollection07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLOptionsCollection07") != null) return;
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
      doc = load(docRef, "doc", "optionscollection");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      optionsList = testNode.options;

      optionsNode = optionsList.item(0);
      optionsValueNode = optionsNode.firstChild;

      vvalue = optionsValueNode.nodeValue;

      assertEquals("valueIndexLink","EMP10001",vvalue);

},
/**
*
    The align attribute specifies the horizontal text alignment.

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53465507
*/
HTMLParagraphElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLParagraphElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "paragraph");
      nodeList = doc.getElementsByTagName("p");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
    The  name attribute specifies the name of the run-time parameter.

    Retrieve the name attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59871447
*/
HTMLParamElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLParamElement01") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "param");
      nodeList = doc.getElementsByTagName("param");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","image3",vname);

},
/**
*
    The value attribute specifies the value of the run-time parameter.

    Retrieve the value attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77971357
*/
HTMLParamElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLParamElement02") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "param");
      nodeList = doc.getElementsByTagName("param");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvalue = testNode.value;

      assertURIEquals("valueLink",null,null,null,"file.gif",null,null,null,null,vvalue);

},
/**
*
    The valueType attribute specifies information about the meaning of the
    value specified by the value attribute.

    Retrieve the valueType attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-23931872
*/
HTMLParamElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLParamElement03") != null) return;
    var nodeList;
      var testNode;
      var vvaluetype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "param");
      nodeList = doc.getElementsByTagName("param");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvaluetype = testNode.valueType;

      assertEquals("valueTypeLink","ref",vvaluetype);

},
/**
*
    The type attribute specifies the content type for the value attribute
    when valuetype has the value ref.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18179888
*/
HTMLParamElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLParamElement04") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "param");
      nodeList = doc.getElementsByTagName("param");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","image/gif",vtype);

},
/**
*
    The width attribute specifies the fixed width for content.

    Retrieve the width attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-13894083
*/
HTMLPreElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLPreElement01") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "pre");
      nodeList = doc.getElementsByTagName("pre");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink",277,vwidth);

},
/**
*
    The cite attribute specifies a URI designating a source document
    or message.

    Retrieve the cite attribute from the Q element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53895598
*/
HTMLQuoteElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLQuoteElement01") != null) return;
    var nodeList;
      var testNode;
      var vcite;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "quote");
      nodeList = doc.getElementsByTagName("q");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcite = testNode.cite;

      assertURIEquals("citeLink",null,null,null,"Q.html",null,null,null,null,vcite);

},
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
HTMLQuoteElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLQuoteElement02") != null) return;
    var nodeList;
      var testNode;
      var vcite;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "quote");
      nodeList = doc.getElementsByTagName("blockquote");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcite = testNode.cite;

      assertURIEquals("citeLink",null,null,null,"BLOCKQUOTE.html",null,null,null,null,vcite);

},
/**
*
    The text attribute specifies the script content of the element.

    Retrieve the text attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46872999
*/
HTMLScriptElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLScriptElement01") != null) return;
    var nodeList;
      var testNode;
      var vtext;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "script");
      nodeList = doc.getElementsByTagName("script");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtext = testNode.text;

      assertEquals("textLink","var a=2;",vtext);

},
/**
*
    The charset attribute specifies the character encoding of the linked
    resource.

    Retrieve the charset attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-35305677
*/
HTMLScriptElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLScriptElement02") != null) return;
    var nodeList;
      var testNode;
      var vcharset;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "script");
      nodeList = doc.getElementsByTagName("script");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcharset = testNode.charset;

      assertEquals("charsetLink","US-ASCII",vcharset);

},
/**
*
    The defer attribute specifies the user agent can defer processing of
    the script.

    Retrieve the defer attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-93788534
*/
HTMLScriptElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLScriptElement03") != null) return;
    var nodeList;
      var testNode;
      var vdefer;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "script");
      nodeList = doc.getElementsByTagName("script");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdefer = testNode.defer;

      assertTrue("deferLink",vdefer);

},
/**
*
    The src attribute specifies a URI designating an external script.

    Retrieve the src attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-75147231
*/
HTMLScriptElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLScriptElement04") != null) return;
    var nodeList;
      var testNode;
      var vsrc;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "script");
      nodeList = doc.getElementsByTagName("script");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vsrc = testNode.src;

      assertURIEquals("srcLink",null,null,null,"script1.js",null,null,null,null,vsrc);

},
/**
*
    The type attribute specifies the content of the script language.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30534818
*/
HTMLScriptElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLScriptElement05") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "script");
      nodeList = doc.getElementsByTagName("script");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","text/javaScript",vtype);

},
/**
*
htmlFor is described as for future use.  Test accesses the value, but makes no assertions about its value.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66979266
*/
HTMLScriptElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLScriptElement06") != null) return;
    var nodeList;
      var testNode;
      var htmlFor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "script");
      nodeList = doc.getElementsByTagName("script");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      htmlFor = testNode.htmlFor;


},
/**
*
event is described as for future use.  Test accesses the value, but makes no assertions about its value.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-56700403
*/
HTMLScriptElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLScriptElement07") != null) return;
    var nodeList;
      var testNode;
      var event;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "script");
      nodeList = doc.getElementsByTagName("script");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      event = testNode.event;


},
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
HTMLSelectElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement01") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","select-multiple",vtype);

},
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
HTMLSelectElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement02") != null) return;
    var nodeList;
      var testNode;
      var vselectedindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vselectedindex = testNode.selectedIndex;

      assertEquals("selectedIndexLink",0,vselectedindex);

},
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
HTMLSelectElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement03") != null) return;
    var nodeList;
      var testNode;
      var vselectedindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vselectedindex = testNode.selectedIndex;


},
/**
*
    The value attribute specifies the current form control value.

    Retrieve the value attribute from the first SELECT element and
    examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59351919
*/
HTMLSelectElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement04") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vvalue = testNode.value;

      assertEquals("valueLink","EMP1",vvalue);

},
/**
*
    The length attribute specifies the number of options in this select.

    Retrieve the length attribute from the first SELECT element and
    examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-5933486
*/
HTMLSelectElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement05") != null) return;
    var nodeList;
      var testNode;
      var vlength;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vlength = testNode.length;

      assertEquals("lengthLink",5,vlength);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute from the first SELECT element
    and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20489458
*/
HTMLSelectElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement06") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form1",vform);

},
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
HTMLSelectElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement07") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
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
HTMLSelectElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement08") != null) return;
    var nodeList;
      var optionsnodeList;
      var testNode;
      var vareas;
      var doc;
      var optionName;
      var voption;
      var result = new Array();

      expectedOptions = new Array();
      expectedOptions[0] = "option";
      expectedOptions[1] = "option";
      expectedOptions[2] = "option";
      expectedOptions[3] = "option";
      expectedOptions[4] = "option";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      optionsnodeList = testNode.options;

      for(var indexN10070 = 0;indexN10070 < optionsnodeList.length; indexN10070++) {
      voption = optionsnodeList.item(indexN10070);
      optionName = voption.nodeName;

      result[result.length] = optionName;

	}
   assertEqualsListAutoCase("element", "optionsLink",expectedOptions,result);

},
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
HTMLSelectElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement09") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(2);
      vdisabled = testNode.disabled;

      assertTrue("disabledLink",vdisabled);

},
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
HTMLSelectElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement10") != null) return;
    var nodeList;
      var testNode;
      var vmultiple;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vmultiple = testNode.multiple;

      assertTrue("multipleLink",vmultiple);

},
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
HTMLSelectElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement11") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","select1",vname);

},
/**
*
    The size attribute specifies the number of visible rows.

    Retrieve the size attribute from the first SELECT element and
    examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18293826
*/
HTMLSelectElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement12") != null) return;
    var nodeList;
      var testNode;
      var vsize;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vsize = testNode.size;

      assertEquals("sizeLink",1,vsize);

},
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
HTMLSelectElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement13") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",7,vtabindex);

},
/**
*
focus should give the select element input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-32130014
*/
HTMLSelectElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement14") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      testNode.focus();

},
/**
*
blur should surrender input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-28216144
*/
HTMLSelectElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement15") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      testNode.blur();

},
/**
*
Removes an option using HTMLSelectElement.remove.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33404570
*/
HTMLSelectElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement16") != null) return;
    var nodeList;
      var testNode;
      var doc;
      var optLength;
      var selected;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      testNode.remove(0);
      optLength = testNode.length;

      assertEquals("optLength",4,optLength);
       selected = testNode.selectedIndex;

      assertEquals("selected",-1,selected);

},
/**
*
Removes a non-existant option using HTMLSelectElement.remove.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-33404570
*/
HTMLSelectElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement17") != null) return;
    var nodeList;
      var testNode;
      var doc;
      var optLength;
      var selected;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      testNode.remove(6);
      optLength = testNode.length;

      assertEquals("optLength",5,optLength);
       selected = testNode.selectedIndex;

      assertEquals("selected",0,selected);

},
/**
*
Add a new option at the end of an select using HTMLSelectElement.add.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14493106
*/
HTMLSelectElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement18") != null) return;
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
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      newOpt = doc.createElement("option");
      newOptText = doc.createTextNode("EMP31415");
      retNode = newOpt.appendChild(newOptText);
      testNode.add(newOpt,nullNode);
      optLength = testNode.length;

      assertEquals("optLength",6,optLength);
       selected = testNode.selectedIndex;

      assertEquals("selected",0,selected);
       opt = testNode.lastChild;

      optText = opt.firstChild;

      optValue = optText.nodeValue;

      assertEquals("lastValue","EMP31415",optValue);

},
/**
*
Add a new option before the selected node using HTMLSelectElement.add.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14493106
*/
HTMLSelectElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement19") != null) return;
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
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      newOpt = doc.createElement("option");
      newOptText = doc.createTextNode("EMP31415");
      retNode = newOpt.appendChild(newOptText);
      options = testNode.options;

      selectedNode = options.item(0);
      testNode.add(newOpt,selectedNode);
      optLength = testNode.length;

      assertEquals("optLength",6,optLength);
       selected = testNode.selectedIndex;

      assertEquals("selected",1,selected);
       options = testNode.options;

      opt = options.item(0);
      optText = opt.firstChild;

      optValue = optText.nodeValue;

      assertEquals("lastValue","EMP31415",optValue);

},
/**
*
Attempting to add an new option using HTMLSelectElement.add before a node that is not a child of the select
element should raise a NOT_FOUND_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-14493106
*/
HTMLSelectElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLSelectElement20") != null) return;
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
      doc = load(docRef, "doc", "select");
      nodeList = doc.getElementsByTagName("select");
      assertSize("Asize",3,nodeList);
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
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
*
    The disabled attribute enables/disables the stylesheet.

    Retrieve the disabled attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-51162010
*/
HTMLStyleElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLStyleElement01") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "style");
      nodeList = doc.getElementsByTagName("style");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vdisabled = testNode.disabled;

      assertFalse("disabledLink",vdisabled);

},
/**
*
    The media attribute identifies the intended medium of the style info.

    Retrieve the media attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76412738
*/
HTMLStyleElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLStyleElement02") != null) return;
    var nodeList;
      var testNode;
      var vmedia;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "style");
      nodeList = doc.getElementsByTagName("style");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vmedia = testNode.media;

      assertEquals("mediaLink","screen",vmedia);

},
/**
*
    The type attribute specifies the style sheet language(Internet media type).

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-22472002
*/
HTMLStyleElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLStyleElement03") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "style");
      nodeList = doc.getElementsByTagName("style");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","text/css",vtype);

},
/**
*
    The align attribute specifies the caption alignment with respect to
    the table.

    Retrieve the align attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-79875068
*/
HTMLTableCaptionElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCaptionElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecaption");
      nodeList = doc.getElementsByTagName("caption");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","top",valign);

},
/**
*
    The  cellIndex attribute specifies the index of this cell in the row(TH).

    Retrieve the cellIndex attribute of the first TH element and examine its
    value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-80748363
*/
HTMLTableCellElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement01") != null) return;
    var nodeList;
      var testNode;
      var vcellindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(0);
      vcellindex = testNode.cellIndex;

      assertEquals("cellIndexLink",0,vcellindex);

},
/**
*
    The  cellIndex attribute specifies the index of this cell in the row(TD).

    Retrieve the cellIndex attribute of the first TD element and examine its
    value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-80748363
*/
HTMLTableCellElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement02") != null) return;
    var nodeList;
      var testNode;
      var vcellindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(0);
      vcellindex = testNode.cellIndex;

      assertEquals("cellIndexLink",0,vcellindex);

},
/**
*
    The abbr attribute specifies the abbreviation for table header cells(TH).

    Retrieve the abbr attribute from the second TH element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74444037
*/
HTMLTableCellElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement03") != null) return;
    var nodeList;
      var testNode;
      var vabbr;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vabbr = testNode.abbr;

      assertEquals("abbrLink","hd1",vabbr);

},
/**
*
    The abbr attribute specifies the abbreviation for table data cells(TD).

    Retrieve the abbr attribute from the second TD element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74444037
*/
HTMLTableCellElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement04") != null) return;
    var nodeList;
      var testNode;
      var vabbr;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vabbr = testNode.abbr;

      assertEquals("abbrLink","hd2",vabbr);

},
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
HTMLTableCellElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement05") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableCellElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement06") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableCellElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement07") != null) return;
    var nodeList;
      var testNode;
      var vaxis;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vaxis = testNode.axis;

      assertEquals("axisLink","center",vaxis);

},
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
HTMLTableCellElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement08") != null) return;
    var nodeList;
      var testNode;
      var vaxis;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vaxis = testNode.axis;

      assertEquals("axisLink","center",vaxis);

},
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
HTMLTableCellElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement09") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vbgcolor = testNode.bgColor;

      assertEquals("bgColorLink","#00FFFF".toLowerCase(),vbgcolor.toLowerCase());

},
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
HTMLTableCellElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement10") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vbgcolor = testNode.bgColor;

      assertEquals("bgColorLink","#FF0000".toLowerCase(),vbgcolor.toLowerCase());

},
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
HTMLTableCellElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement11") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vch = testNode.ch;

      assertEquals("chLink",":",vch);

},
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
HTMLTableCellElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement12") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vch = testNode.ch;

      assertEquals("chLink",":",vch);

},
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
HTMLTableCellElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement13") != null) return;
    var nodeList;
      var testNode;
      var vcharoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vcharoff = testNode.chOff;

      assertEquals("chOffLink","1",vcharoff);

},
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
HTMLTableCellElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement14") != null) return;
    var nodeList;
      var testNode;
      var vcharoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vcharoff = testNode.chOff;

      assertEquals("chOffLink","1",vcharoff);

},
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
HTMLTableCellElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement15") != null) return;
    var nodeList;
      var testNode;
      var vcolspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vcolspan = testNode.colSpan;

      assertEquals("colSpanLink",1,vcolspan);

},
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
HTMLTableCellElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement16") != null) return;
    var nodeList;
      var testNode;
      var vcolspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vcolspan = testNode.colSpan;

      assertEquals("colSpanLink",1,vcolspan);

},
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
HTMLTableCellElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement17") != null) return;
    var nodeList;
      var testNode;
      var vheaders;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vheaders = testNode.headers;

      assertEquals("headersLink","header-1",vheaders);

},
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
HTMLTableCellElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement18") != null) return;
    var nodeList;
      var testNode;
      var vheaders;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vheaders = testNode.headers;

      assertEquals("headersLink","header-3",vheaders);

},
/**
*
    The height attribute specifies the cell height.

    Retrieve the height attribute from the second TH element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83679212
*/
HTMLTableCellElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement19") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vheight = testNode.height;

      assertEquals("heightLink","50",vheight);

},
/**
*
    The height attribute specifies the cell height.

    Retrieve the height attribute from the second TD element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83679212
*/
HTMLTableCellElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement20") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vheight = testNode.height;

      assertEquals("heightLink","50",vheight);

},
/**
*
    The noWrap attribute supresses word wrapping.

    Retrieve the noWrap attribute of the second TH Element and
    examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62922045
*/
HTMLTableCellElement21 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement21") != null) return;
    var nodeList;
      var testNode;
      var vnowrap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vnowrap = testNode.noWrap;

      assertTrue("noWrapLink",vnowrap);

},
/**
*
    The noWrap attribute supresses word wrapping.

    Retrieve the noWrap attribute of the second TD Element and
    examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62922045
*/
HTMLTableCellElement22 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement22") != null) return;
    var nodeList;
      var testNode;
      var vnowrap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vnowrap = testNode.noWrap;

      assertTrue("noWrapLink",vnowrap);

},
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
HTMLTableCellElement23 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement23") != null) return;
    var nodeList;
      var testNode;
      var vrowspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vrowspan = testNode.rowSpan;

      assertEquals("rowSpanLink",1,vrowspan);

},
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
HTMLTableCellElement24 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement24") != null) return;
    var nodeList;
      var testNode;
      var vrowspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vrowspan = testNode.rowSpan;

      assertEquals("rowSpanLink",1,vrowspan);

},
/**
*
    The scope attribute specifies the scope covered by header cells.

    Retrieve the scope attribute from the second TH element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36139952
*/
HTMLTableCellElement25 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement25") != null) return;
    var nodeList;
      var testNode;
      var vscope;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vscope = testNode.scope;

      assertEquals("scopeLink","col",vscope);

},
/**
*
    The scope attribute specifies the scope covered by data cells.

    Retrieve the scope attribute from the second TD element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36139952
*/
HTMLTableCellElement26 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement26") != null) return;
    var nodeList;
      var testNode;
      var vscope;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vscope = testNode.scope;

      assertEquals("scopeLink","col",vscope);

},
/**
*
    The vAlign attribute specifies the vertical alignment of data in cell.

    Retrieve the vAlign attribute from the second TH element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58284221
*/
HTMLTableCellElement27 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement27") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
/**
*
    The vAlign attribute specifies the vertical alignment of data in cell.

    Retrieve the vAlign attribute from the second TD element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58284221
*/
HTMLTableCellElement28 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement28") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
/**
*
    The width attribute specifies the cells width.

    Retrieve the width attribute from the second TH element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27480795
*/
HTMLTableCellElement29 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement29") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("th");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vwidth = testNode.width;

      assertEquals("widthLink","170",vwidth);

},
/**
*
    The width attribute specifies the cells width.

    Retrieve the width attribute from the second TD element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27480795
*/
HTMLTableCellElement30 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableCellElement30") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vwidth = testNode.width;

      assertEquals("widthLink","175",vwidth);

},
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
HTMLTableColElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableColElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement02") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("colgroup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableColElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement03") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vch = testNode.ch;

      assertEquals("chLink","*",vch);

},
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
HTMLTableColElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement04") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("colgroup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vch = testNode.ch;

      assertEquals("chLink","$",vch);

},
/**
*
    The charoff attribute specifies offset of alignment character(COL).

    Retrieve the charoff attribute from the COL element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57779225
*/
HTMLTableColElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement05") != null) return;
    var nodeList;
      var testNode;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vchoff = testNode.chOff;

      assertEquals("chLink","20",vchoff);

},
/**
*
    The charoff attribute specifies offset of alignment character(COLGROUP).

    Retrieve the charoff attribute from the COLGROUP element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57779225
*/
HTMLTableColElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement06") != null) return;
    var nodeList;
      var testNode;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("colgroup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vchoff = testNode.chOff;

      assertEquals("chLink","15",vchoff);

},
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
HTMLTableColElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement07") != null) return;
    var nodeList;
      var testNode;
      var vspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vspan = testNode.span;

      assertEquals("spanLink",1,vspan);

},
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
HTMLTableColElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement08") != null) return;
    var nodeList;
      var testNode;
      var vspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("colgroup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vspan = testNode.span;

      assertEquals("spanLink",2,vspan);

},
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
HTMLTableColElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement09") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
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
HTMLTableColElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement10") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("colgroup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
/**
*
    The width attribute specifies the default column width(COL).

    Retrieve the width attribute from the COL element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25196799
*/
HTMLTableColElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement11") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","20",vwidth);

},
/**
*
    The width attribute specifies the default column width(COLGORUP).

    Retrieve the width attribute from the COLGROUP element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25196799
*/
HTMLTableColElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableColElement12") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("colgroup");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","20",vwidth);

},
/**
*
    The caption attribute returns the tables CAPTION.

    Retrieve the align attribute of the CAPTION element from the second
    TABLE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14594520
*/
HTMLTableElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement01") != null) return;
    var nodeList;
      var testNode;
      var vcaption;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vcaption = testNode.caption;

      valign = vcaption.align;

      assertEquals("alignLink","top",valign);

},
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
HTMLTableElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement02") != null) return;
    var nodeList;
      var testNode;
      var vcaption;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vcaption = testNode.caption;

      assertNull("captionLink",vcaption);

},
/**
*
    The tHead attribute returns the tables THEAD.

    Retrieve the align attribute of the THEAD element from the second
    TABLE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
*/
HTMLTableElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement03") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tHead;

      valign = vsection.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement04") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vsection = testNode.tHead;

      assertNull("sectionLink",vsection);

},
/**
*
    The tFoot attribute returns the tables TFOOT.

    Retrieve the align attribute of the TFOOT element from the second
    TABLE element and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
HTMLTableElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement05") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tFoot;

      valign = vsection.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement06") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vsection = testNode.tFoot;

      assertNull("sectionLink",vsection);

},
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
HTMLTableElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement07") != null) return;
    var nodeList;
      var rowsnodeList;
      var testNode;
      var doc;
      var rowName;
      var vrow;
      var result = new Array();

      expectedOptions = new Array();
      expectedOptions[0] = "tr";
      expectedOptions[1] = "tr";
      expectedOptions[2] = "tr";
      expectedOptions[3] = "tr";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      for(var indexN10069 = 0;indexN10069 < rowsnodeList.length; indexN10069++) {
      vrow = rowsnodeList.item(indexN10069);
      rowName = vrow.nodeName;

      result[result.length] = rowName;

	}
   assertEqualsListAutoCase("element", "rowsLink",expectedOptions,result);

},
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
HTMLTableElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement08") != null) return;
    var nodeList;
      var tbodiesnodeList;
      var testNode;
      var doc;
      var tbodiesName;
      var vtbodies;
      var result = new Array();

      expectedOptions = new Array();
      expectedOptions[0] = "tbody";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      tbodiesnodeList = testNode.tBodies;

      for(var indexN10060 = 0;indexN10060 < tbodiesnodeList.length; indexN10060++) {
      vtbodies = tbodiesnodeList.item(indexN10060);
      tbodiesName = vtbodies.nodeName;

      result[result.length] = tbodiesName;

	}
   assertEqualsListAutoCase("element", "tbodiesLink",expectedOptions,result);

},
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
HTMLTableElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement09") != null) return;
    var nodeList;
      var tbodiesnodeList;
      var testNode;
      var doc;
      var tbodiesName;
      var vtbodies;
      var result = new Array();

      expectedOptions = new Array();
      expectedOptions[0] = "tbody";
      expectedOptions[1] = "tbody";
      expectedOptions[2] = "tbody";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(2);
      tbodiesnodeList = testNode.tBodies;

      for(var indexN10066 = 0;indexN10066 < tbodiesnodeList.length; indexN10066++) {
      vtbodies = tbodiesnodeList.item(indexN10066);
      tbodiesName = vtbodies.nodeName;

      result[result.length] = tbodiesName;

	}
   assertEqualsListAutoCase("element", "tbodiesLink",expectedOptions,result);

},
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
HTMLTableElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement10") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
    The bgColor attribute specifies cell background color.

    Retrieve the bgColor attribute of the first TABLE element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83532985
*/
HTMLTableElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement11") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vbgcolor = testNode.bgColor;

      assertEquals("bgColorLink","#ff0000",vbgcolor);

},
/**
*
    The border attribute specifies the width of the border around the table.

    Retrieve the border attribute of the first TABLE element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-50969400
*/
HTMLTableElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement12") != null) return;
    var nodeList;
      var testNode;
      var vborder;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vborder = testNode.border;

      assertEquals("borderLink","4",vborder);

},
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
HTMLTableElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement13") != null) return;
    var nodeList;
      var testNode;
      var vcellpadding;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vcellpadding = testNode.cellPadding;

      assertEquals("cellPaddingLink","2",vcellpadding);

},
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
HTMLTableElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement14") != null) return;
    var nodeList;
      var testNode;
      var cellSpacing;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      cellSpacing = testNode.cellSpacing;

      assertEquals("cellSpacingLink","2",cellSpacing);

},
/**
*
    The frame attribute specifies which external table borders to render.

    Retrieve the frame attribute of the first TABLE element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64808476
*/
HTMLTableElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement15") != null) return;
    var nodeList;
      var testNode;
      var vframe;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vframe = testNode.frame;

      assertEquals("frameLink","border",vframe);

},
/**
*
    The rules attribute specifies which internal table borders to render.

    Retrieve the rules attribute of the first TABLE element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-26347553
*/
HTMLTableElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement16") != null) return;
    var nodeList;
      var testNode;
      var vrules;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vrules = testNode.rules;

      assertEquals("rulesLink","all",vrules);

},
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
HTMLTableElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement17") != null) return;
    var nodeList;
      var testNode;
      var vsummary;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsummary = testNode.summary;

      assertEquals("summaryLink","HTML Control Table",vsummary);

},
/**
*
    The width attribute specifies the desired table width.

    Retrieve the width attribute of the first TABLE element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77447361
*/
HTMLTableElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement18") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vwidth = testNode.width;

      assertEquals("widthLink","680",vwidth);

},
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
HTMLTableElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement19") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vsection1 = testNode.tHead;

      assertNull("vsection1Id",vsection1);
    newHead = testNode.createTHead();
      vsection2 = testNode.tHead;

      assertNotNull("vsection2Id",vsection2);

},
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
HTMLTableElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement20") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      newHead = testNode.createTHead();
      vsection = testNode.tHead;

      valign = vsection.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableElement21 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement21") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsection1 = testNode.tHead;

      assertNotNull("vsection1Id",vsection1);
rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      result[result.length] = vrows;
testNode.deleteTHead();
      vsection2 = testNode.tHead;

      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      result[result.length] = vrows;
assertEqualsList("rowsLink",expectedResult,result);

},
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
HTMLTableElement22 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement22") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vsection1 = testNode.tFoot;

      assertNull("vsection1Id",vsection1);
    newFoot = testNode.createTFoot();
      vsection2 = testNode.tFoot;

      assertNotNull("vsection2Id",vsection2);

},
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
HTMLTableElement23 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement23") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      newFoot = testNode.createTFoot();
      vsection = testNode.tFoot;

      valign = vsection.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableElement24 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement24") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsection1 = testNode.tFoot;

      assertNotNull("vsection1Id",vsection1);
rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      result[result.length] = vrows;
testNode.deleteTFoot();
      vsection2 = testNode.tFoot;

      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      result[result.length] = vrows;
assertEqualsList("rowsLink",expectedResult,result);

},
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
HTMLTableElement25 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement25") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vsection1 = testNode.caption;

      assertNull("vsection1Id",vsection1);
    newCaption = testNode.createCaption();
      vsection2 = testNode.caption;

      assertNotNull("vsection2Id",vsection2);

},
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
HTMLTableElement26 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement26") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsection1 = testNode.caption;

      assertNotNull("vsection1Id",vsection1);
newCaption = testNode.createCaption();
      vcaption = testNode.caption;

      valign = vcaption.align;

      assertEquals("alignLink","top",valign);

},
/**
*
    The deleteCaption() method deletes the table caption.

    Delete the CAPTION element on the second TABLE element.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-22930071
*/
HTMLTableElement27 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement27") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsection1 = testNode.caption;

      assertNotNull("vsection1Id",vsection1);
testNode.deleteCaption();
      vsection2 = testNode.caption;

      assertNull("vsection2Id",vsection2);

},
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
HTMLTableElement28 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement28") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsection1 = testNode.tHead;

      rowsnodeList = vsection1.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       newRow = testNode.insertRow(0);
      vsection2 = testNode.tHead;

      rowsnodeList = vsection2.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",2,vrows);

},
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
HTMLTableElement29 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement29") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      tbodiesnodeList = testNode.tBodies;

      bodyNode = tbodiesnodeList.item(0);
      rowsnodeList = bodyNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",2,vrows);
       newRow = testNode.insertRow(2);
      tbodiesnodeList = testNode.tBodies;

      bodyNode = tbodiesnodeList.item(0);
      rowsnodeList = bodyNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",3,vrows);

},
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
HTMLTableElement30 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement30") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",4,vrows);
       vsection1 = testNode.tFoot;

      rowsnodeList = vsection1.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink",1,vrows);
       newRow = testNode.insertRow(4);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",5,vrows);
       vsection1 = testNode.tFoot;

      rowsnodeList = vsection1.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink3",2,vrows);

},
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
HTMLTableElement31 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement31") != null) return;
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
      doc = load(docRef, "doc", "table1");
      nodeList = doc.getElementsByTagName("body");
      assertSize("tableSize1",1,nodeList);
testNode = nodeList.item(0);
      table = doc.createElement("table");
      tableNode = testNode.appendChild(table);
      nodeList = doc.getElementsByTagName("table");
      assertSize("tableSize2",2,nodeList);
tbodiesnodeList = tableNode.tBodies;

      tbodiesLength = tbodiesnodeList.length;

      assertEquals("Asize3",0,tbodiesLength);
       newRow = tableNode.insertRow(0);
      tbodiesnodeList = tableNode.tBodies;

      tbodiesLength = tbodiesnodeList.length;

      assertEquals("Asize4",1,tbodiesLength);

},
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
HTMLTableElement32 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement32") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",4,vrows);
       testNode.deleteRow(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",3,vrows);

},
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
HTMLTableElement33 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement33") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",4,vrows);
       testNode.deleteRow(3);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",3,vrows);

},
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
HTMLTableElement34 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement34") != null) return;
    var nodeList;
      var testNode;
      var newRow;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);

	{
		success = false;
		try {
            newRow = testNode.insertRow(5);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableElement34",success);
	}

},

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
HTMLTableElement35 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement35") != null) return;
    var nodeList;
      var testNode;
      var newRow;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);

	{
		success = false;
		try {
            newRow = testNode.insertRow(-5);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableElement35",success);
	}

},
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
HTMLTableElement36 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement36") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);

	{
		success = false;
		try {
            testNode.deleteRow(5);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableElement36",success);
	}

},
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
HTMLTableElement37 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement37") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);

	{
		success = false;
		try {
            testNode.deleteRow(4);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableElement37",success);
	}

},
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
HTMLTableElement38 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement38") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);

	{
		success = false;
		try {
            testNode.deleteRow(-5);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableElement38",success);
	}

},
/**
*
    The insertRow() method inserts a new empty table row.
    If index is -1 or equal to the number of rows, the new row
    is appended.

    Retrieve the second TABLE element and invoke the insertRow() method
    with an index of negative one.
    The number of rows in the TBODY section before insertion with an index
    of negative one is two.  After the new row is inserted the number
    of rows in the TBODY section is three.

* @author NIST
* @author Rick Rivello
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-39872903
*/
HTMLTableElement39 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement39") != null) return;
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
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      tbodiesnodeList = testNode.tBodies;

      bodyNode = tbodiesnodeList.item(0);
      rowsnodeList = bodyNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",2,vrows);
       newRow = testNode.insertRow(-1);
      tbodiesnodeList = testNode.tBodies;

      bodyNode = tbodiesnodeList.item(0);
      rowsnodeList = bodyNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",3,vrows);

},
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
HTMLTableElement40 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableElement40") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",4,vrows);

       testNode.deleteRow(-1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",3,vrows);

},
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
HTMLTableRowElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement01") != null) return;
    var nodeList;
      var testNode;
      var vrowindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      vrowindex = testNode.rowIndex;

      assertEquals("rowIndexLink",1,vrowindex);

},
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
HTMLTableRowElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement02") != null) return;
    var nodeList;
      var testNode;
      var vsectionrowindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      vsectionrowindex = testNode.sectionRowIndex;

      assertEquals("sectionRowIndexLink",0,vsectionrowindex);

},
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
HTMLTableRowElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement03") != null) return;
    var nodeList;
      var testNode;
      var vsectionrowindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(2);
      vsectionrowindex = testNode.sectionRowIndex;

      assertEquals("sectionRowIndexLink",0,vsectionrowindex);

},
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
HTMLTableRowElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement04") != null) return;
    var nodeList;
      var testNode;
      var vsectionrowindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(4);
      vsectionrowindex = testNode.sectionRowIndex;

      assertEquals("sectionRowIndexLink",1,vsectionrowindex);

},
/**
*
    The cells attribute specifies the collection of cells in this row.

    Retrieve the fourth TR element and examine the value of
    the cells length attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67349879
*/
HTMLTableRowElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement05") != null) return;
    var nodeList;
      var cellsnodeList;
      var testNode;
      var vcells;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink",6,vcells);

},
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
HTMLTableRowElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement06") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
    The bgColor attribute specifies the background color of rows.

    Retrieve the bgColor attribute of the second TR element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18161327
*/
HTMLTableRowElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement07") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      vbgcolor = testNode.bgColor;

      assertEquals("bgColorLink","#00FFFF".toLowerCase(),vbgcolor.toLowerCase());

},
/**
*
    The ch attribute specifies the alignment character for cells in a column.

    Retrieve the char attribute of the second TR element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16230502
*/
HTMLTableRowElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement08") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      vch = testNode.ch;

      assertEquals("chLink","*",vch);

},
/**
*
    The chOff attribute specifies the offset of alignment character.

    Retrieve the charoff attribute of the second TR element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68207461
*/
HTMLTableRowElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement09") != null) return;
    var nodeList;
      var testNode;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      vchoff = testNode.chOff;

      assertEquals("charOffLink","1",vchoff);

},
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
HTMLTableRowElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement10") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
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
HTMLTableRowElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement11") != null) return;
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
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink1",6,vcells);
       trNode = cellsnodeList.item(0);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value1Link","EMP0001",value);
       newCell = testNode.insertCell(0);
      testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink2",7,vcells);
       trNode = cellsnodeList.item(0);
      cellNode = trNode.firstChild;

      assertNull("value2Link",cellNode);

},
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
HTMLTableRowElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement12") != null) return;
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
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink1",6,vcells);
       trNode = cellsnodeList.item(5);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value1Link","1230 North Ave. Dallas, Texas 98551",value);
       newCell = testNode.insertCell(6);
      testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink2",7,vcells);
       trNode = cellsnodeList.item(6);
      cellNode = trNode.firstChild;

      assertNull("value2Link",cellNode);

},
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
HTMLTableRowElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement13") != null) return;
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
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink1",6,vcells);
       trNode = cellsnodeList.item(0);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value1Link","EMP0001",value);
       testNode.deleteCell(0);
      testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink2",5,vcells);
       trNode = cellsnodeList.item(0);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value2Link","Margaret Martin",value);

},
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
HTMLTableRowElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement14") != null) return;
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
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink1",6,vcells);
       trNode = cellsnodeList.item(2);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value1Link","Accountant",value);
       testNode.deleteCell(2);
      testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink2",5,vcells);
       trNode = cellsnodeList.item(2);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value2Link","56,000",value);

},
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
HTMLTableRowElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement15") != null) return;
    var nodeList;
      var testNode;
      var newCell;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);

	{
		success = false;
		try {
            newCell = testNode.insertCell(7);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableRowElement15",success);
	}

},
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
HTMLTableRowElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement16") != null) return;
    var nodeList;
      var testNode;
      var newCell;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);

	{
		success = false;
		try {
            newCell = testNode.insertCell(-7);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableRowElement16",success);
	}

},
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
HTMLTableRowElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement17") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);

	{
		success = false;
		try {
            testNode.deleteCell(7);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableRowElement17",success);
	}

},
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
HTMLTableRowElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement18") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);

	{
		success = false;
		try {
            testNode.deleteCell(6);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableRowElement18",success);
	}

},
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
HTMLTableRowElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement19") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);

	{
		success = false;
		try {
            testNode.deleteCell(-6);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableRowElement19",success);
	}

},
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
HTMLTableRowElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement20") != null) return;
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
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink1",6,vcells);
       trNode = cellsnodeList.item(5);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value1Link","1230 North Ave. Dallas, Texas 98551",value);
       newCell = testNode.insertCell(-1);
      testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink2",7,vcells);
       trNode = cellsnodeList.item(6);
      cellNode = trNode.firstChild;

      assertNull("value2Link",cellNode);

},
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
HTMLTableRowElement21 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableRowElement21") != null) return;
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
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink1",6,vcells);
       trNode = cellsnodeList.item(5);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value1Link","1230 North Ave. Dallas, Texas 98551",value);
       testNode.deleteCell(-1);
      testNode = nodeList.item(3);
      cellsnodeList = testNode.cells;

      vcells = cellsnodeList.length;

      assertEquals("cellsLink2",5,vcells);
       trNode = cellsnodeList.item(4);
      cellNode = trNode.firstChild;

      value = cellNode.nodeValue;

      assertEquals("value2Link","Female",value);

},
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
HTMLTableSectionElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement01") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableSectionElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement02") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableSectionElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement03") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
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
HTMLTableSectionElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement04") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vch = testNode.ch;

      assertEquals("chLink","*",vch);

},
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
HTMLTableSectionElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement05") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vch = testNode.ch;

      assertEquals("chLink","+",vch);

},
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
HTMLTableSectionElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement06") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vch = testNode.ch;

      assertEquals("chLink","$",vch);

},
/**
*
    The chOff attribute specifies the offset of alignment character.

    Retrieve the charoff attribute of the first THEAD element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53459732
*/
HTMLTableSectionElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement07") != null) return;
    var nodeList;
      var testNode;
      var vcharoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcharoff = testNode.chOff;

      assertEquals("chOffLink","1",vcharoff);

},
/**
*
    The chOff attribute specifies the offset of alignment character.

    Retrieve the charoff attribute of the first TFOOT element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53459732
*/
HTMLTableSectionElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement08") != null) return;
    var nodeList;
      var testNode;
      var vcharoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcharoff = testNode.chOff;

      assertEquals("chOffLink","2",vcharoff);

},
/**
*
    The chOff attribute specifies the offset of alignment character.

    Retrieve the charoff attribute of the first TBODY element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-53459732
*/
HTMLTableSectionElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement09") != null) return;
    var nodeList;
      var testNode;
      var vcharoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vcharoff = testNode.chOff;

      assertEquals("chOffLink","3",vcharoff);

},
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
HTMLTableSectionElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement10") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
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
HTMLTableSectionElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement11") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
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
HTMLTableSectionElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement12") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
/**
*
    The rows attribute specifies the collection of rows in this table section.

    Retrieve the first THEAD element and examine the value of
    the rows length attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52092650
*/
HTMLTableSectionElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement13") != null) return;
    var nodeList;
      var rowsnodeList;
      var testNode;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink",1,vrows);

},
/**
*
    The rows attribute specifies the collection of rows in this table section.

    Retrieve the first TFOOT element and examine the value of
    the rows length attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52092650
*/
HTMLTableSectionElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement14") != null) return;
    var nodeList;
      var rowsnodeList;
      var testNode;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink",1,vrows);

},
/**
*
    The rows attribute specifies the collection of rows in this table section.

    Retrieve the first TBODY element and examine the value of
    the rows length attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-52092650
*/
HTMLTableSectionElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement15") != null) return;
    var nodeList;
      var rowsnodeList;
      var testNode;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink",2,vrows);

},
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
HTMLTableSectionElement16 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement16") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       newRow = testNode.insertRow(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",2,vrows);

},
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
HTMLTableSectionElement17 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement17") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       newRow = testNode.insertRow(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",2,vrows);

},
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
HTMLTableSectionElement18 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement18") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",2,vrows);
       newRow = testNode.insertRow(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",3,vrows);

},
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
HTMLTableSectionElement19 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement19") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       newRow = testNode.insertRow(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",2,vrows);

},
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
HTMLTableSectionElement20 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement20") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       newRow = testNode.insertRow(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",2,vrows);

},
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
HTMLTableSectionElement21 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement21") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",2,vrows);
       newRow = testNode.insertRow(2);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",3,vrows);

},
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
HTMLTableSectionElement22 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement22") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       testNode.deleteRow(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",0,vrows);

},
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
HTMLTableSectionElement23 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement23") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tfoot");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       testNode.deleteRow(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",0,vrows);

},
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
HTMLTableSectionElement24 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement24") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",2,vrows);
       testNode.deleteRow(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",1,vrows);

},
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
HTMLTableSectionElement25 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement25") != null) return;
    var nodeList;
      var testNode;
      var newRow;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);

	{
		success = false;
		try {
            newRow = testNode.insertRow(2);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableSectionElement25",success);
	}

},
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
HTMLTableSectionElement26 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement26") != null) return;
    var nodeList;
      var testNode;
      var newRow;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);

	{
		success = false;
		try {
            newRow = testNode.insertRow(-2);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableSectionElement26",success);
	}

},
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
HTMLTableSectionElement27 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement27") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);

	{
		success = false;
		try {
            testNode.deleteRow(2);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableSectionElement27",success);
	}

},
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
HTMLTableSectionElement28 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement28") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);

	{
		success = false;
		try {
            testNode.deleteRow(1);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableSectionElement28",success);
	}

},
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
HTMLTableSectionElement29 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement29") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);

	{
		success = false;
		try {
            testNode.deleteRow(-2);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 1);
		}
		assertTrue("HTMLTableSectionElement29",success);
	}

},
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
HTMLTableSectionElement30 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement30") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("thead");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",1,vrows);
       newRow = testNode.insertRow(-1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",2,vrows);

},
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
HTMLTableSectionElement31 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTableSectionElement31") != null) return;
    var nodeList;
      var testNode;
      var rowsnodeList;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("tbody");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink1",2,vrows);
       testNode.deleteRow(-1);
      rowsnodeList = testNode.rows;

      vrows = rowsnodeList.length;

      assertEquals("rowsLink2",1,vrows);

},
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
HTMLTextAreaElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement01") != null) return;
    var nodeList;
      var testNode;
      var vdefaultvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vdefaultvalue = testNode.defaultValue;

      assertEquals("defaultValueLink","TEXTAREA2",vdefaultvalue);

},
/**
*
    The form attribute returns the FORM element containing this control.

    Retrieve the form attribute from the first TEXTAREA element
    and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18911464
*/
HTMLTextAreaElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement02") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var fNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      fNode = testNode.form;

      vform = fNode.id;

      assertEquals("formLink","form1",vform);

},
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
HTMLTextAreaElement03 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement03") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vform = testNode.form;

      assertNull("formNullLink",vform);

},
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
HTMLTextAreaElement04 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement04") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("accessKeyLink","c",vaccesskey);

},
/**
*
    The cols attribute specifies the width of control(in characters).

    Retrieve the cols attribute of the 1st TEXTAREA element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-51387225
*/
HTMLTextAreaElement05 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement05") != null) return;
    var nodeList;
      var testNode;
      var vcols;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vcols = testNode.cols;

      assertEquals("colsLink",20,vcols);

},
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
HTMLTextAreaElement06 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement06") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vdisabled = testNode.disabled;

      assertTrue("disabledLink",vdisabled);

},
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
HTMLTextAreaElement07 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement07") != null) return;
    var nodeList;
      var testNode;
      var vname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vname = testNode.name;

      assertEquals("nameLink","text1",vname);

},
/**
*
    The readOnly attribute specifies this control is read-only.

    Retrieve the readOnly attribute from the 3rd TEXTAREA element and
    examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39131423
*/
HTMLTextAreaElement08 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement08") != null) return;
    var nodeList;
      var testNode;
      var vreadonly;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(2);
      vreadonly = testNode.readOnly;

      assertTrue("readOnlyLink",vreadonly);

},
/**
*
    The rows attribute specifies the number of text rowns.

    Retrieve the rows attribute of the 1st TEXTAREA element and examine
    its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46975887
*/
HTMLTextAreaElement09 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement09") != null) return;
    var nodeList;
      var testNode;
      var vrows;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vrows = testNode.rows;

      assertEquals("rowsLink",7,vrows);

},
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
HTMLTextAreaElement10 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement10") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",5,vtabindex);

},
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
HTMLTextAreaElement11 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement11") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","textarea",vtype);

},
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
HTMLTextAreaElement12 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement12") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      vvalue = testNode.value;

      assertEquals("valueLink","TEXTAREA1",vvalue);

},
/**
*
Calling HTMLTextAreaElement.blur should surrender input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6750689
*/
HTMLTextAreaElement13 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement13") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      testNode.blur();

},
/**
*
Calling HTMLTextAreaElement.focus should capture input focus.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39055426
*/
HTMLTextAreaElement14 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement14") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      testNode.focus();

},
/**
*
Calling HTMLTextAreaElement.select should select the text area.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48880622
*/
HTMLTextAreaElement15 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTextAreaElement15") != null) return;
    var nodeList;
      var testNode;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "textarea");
      nodeList = doc.getElementsByTagName("textarea");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(0);
      testNode.select();

},
/**
*
    The text attribute is the specified title as a string.

    Retrieve the text attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77500413
*/
HTMLTitleElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLTitleElement01") != null) return;
    var nodeList;
      var testNode;
      var vtext;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "title");
      nodeList = doc.getElementsByTagName("title");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtext = testNode.text;

      assertEquals("textLink","NIST DOM HTML Test - TITLE",vtext);

},
/**
*
    The compact attribute specifies whether to reduce spacing between list
    items.

    Retrieve the compact attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39864178
*/
HTMLUListElement01 : function () {
   var success;
    if(checkInitialization(builder, "HTMLUListElement01") != null) return;
    var nodeList;
      var testNode;
      var vcompact;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "ulist");
      nodeList = doc.getElementsByTagName("ul");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vcompact = testNode.compact;

      assertTrue("compactLink",vcompact);

},
/**
*
    The type attribute specifies the bullet style.

    Retrieve the type attribute and examine its value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96874670
*/
HTMLUListElement02 : function () {
   var success;
    if(checkInitialization(builder, "HTMLUListElement02") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "ulist");
      nodeList = doc.getElementsByTagName("ul");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","disc",vtype);

},
/**
*
A single character access key to give access to the form control.
The value of attribute accessKey of the anchor element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89647724
*/
anchor01 : function () {
   var success;
    if(checkInitialization(builder, "anchor01") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("accessKeyLink","g",vaccesskey);

},
/**
*
The character encoding of the linked resource.
The value of attribute charset of the anchor element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67619266
*/
anchor02 : function () {
   var success;
    if(checkInitialization(builder, "anchor02") != null) return;
    var nodeList;
      var testNode;
      var vcharset;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcharset = testNode.charset;

      assertEquals("charsetLink","US-ASCII",vcharset);

},
/**
*
Comma-separated list of lengths, defining an active region geometry.
The value of attribute coords of the anchor element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92079539
*/
anchor03 : function () {
   var success;
    if(checkInitialization(builder, "anchor03") != null) return;
    var nodeList;
      var testNode;
      var vcoords;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcoords = testNode.coords;

      assertEquals("coordsLink","0,0,100,100",vcoords);

},
/**
*
The URI of the linked resource.
The value of attribute href of the anchor element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88517319
*/
anchor04 : function () {
   var success;
    if(checkInitialization(builder, "anchor04") != null) return;
    var nodeList;
      var testNode;
      var vhref;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vhref = testNode.href;

      assertURIEquals("hrefLink",null,null,null,"submit.gif",null,null,null,true,vhref);

},
/**
*
Advisory content type.
The value of attribute type of the anchor element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63938221
*/
anchor05 : function () {
   var success;
    if(checkInitialization(builder, "anchor05") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","image/gif",vtype);

},
/**
*
The shape of the active area. The coordinates are given by coords
The value of attribute shape of the anchor element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-49899808
*/
anchor06 : function () {
   var success;
    if(checkInitialization(builder, "anchor06") != null) return;
    var nodeList;
      var testNode;
      var vshape;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      nodeList = doc.getElementsByTagName("a");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vshape = testNode.shape;

      assertEquals("shapeLink","rect",vshape);

},
/**
*


* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-66021476
*/
area01 : function () {
   var success;
    if(checkInitialization(builder, "area01") != null) return;
    var nodeList;
      var testNode;
      var vcoords;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcoords = testNode.coords;

      assertEquals("coordsLink","0,2,45,45",vcoords);

},
/**
*


* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-61826871
*/
area02 : function () {
   var success;
    if(checkInitialization(builder, "area02") != null) return;
    var nodeList;
      var testNode;
      var vnohref;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vnohref = testNode.noHref;

      assertFalse("noHrefLink",vnohref);

},
/**
*


* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-8722121
*/
area03 : function () {
   var success;
    if(checkInitialization(builder, "area03") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",10,vtabindex);

},
/**
*


* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-57944457
*/
area04 : function () {
   var success;
    if(checkInitialization(builder, "area04") != null) return;
    var nodeList;
      var testNode;
      var vaccesskey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "area");
      nodeList = doc.getElementsByTagName("area");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vaccesskey = testNode.accessKey;

      assertEquals("accessKeyLink","a",vaccesskey);

},
/**
*
The value of attribute color of the basefont element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-87502302
*/
basefont01 : function () {
   var success;
    if(checkInitialization(builder, "basefont01") != null) return;
    var nodeList;
      var testNode;
      var vcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "basefont");
      nodeList = doc.getElementsByTagName("basefont");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcolor = testNode.color;

      assertEquals("colorLink","#000000",vcolor);

},
/**
*
Color of active links (after mouse-button down, but before mouse-button up).
The value of attribute alink of the body element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59424581
*/
body01 : function () {
   var success;
    if(checkInitialization(builder, "body01") != null) return;
    var nodeList;
      var testNode;
      var valink;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "body");
      nodeList = doc.getElementsByTagName("body");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valink = testNode.aLink;

      assertEquals("aLinkLink","#0000ff",valink);

},
/**
*
Returns the FORM element containing this control. Returns null if this control is not within the context of a form.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
*/
button01 : function () {
   var success;
    if(checkInitialization(builder, "button01") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vform = testNode.form;

      assertNull("formLink",vform);

},
/**
*
The value of attribute name of the form element which contains this button is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-63534901
*/

button02 : function () {
   var success;
    if(checkInitialization(builder, "button02") != null) return;
    var nodeList;
      var testNode;
      var formNode;
      var vfname;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      formNode = testNode.form;

      vfname = formNode.id;

      assertEquals("formLink","form2",vfname);

},
/**
*
The value of attribute action of the form element which contains this button is read and checked against the expected value

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74049184
*/
button03 : function () {
   var success;
    if(checkInitialization(builder, "button03") != null) return;
    var nodeList;
      var testNode;
      var formNode;
      var vfaction;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      formNode = testNode.form;

      vfaction = formNode.action;

      assertEquals("formLink","...",vfaction);

},
/**
*
The value of attribute method of the form element which contains this button is read and checked against the expected value

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-71254493
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82545539
*/
button04 : function () {
   var success;
    if(checkInitialization(builder, "button04") != null) return;
    var nodeList;
      var testNode;
      var formNode;
      var vfmethod;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      formNode = testNode.form;

      vfmethod = formNode.method;

      assertEquals("formLink","POST".toLowerCase(),vfmethod.toLowerCase());

},
/**
*
A single character access key to give access to the form control.
The value of attribute accessKey of the button element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-73169431
*/
button05 : function () {
   var success;
    if(checkInitialization(builder, "button05") != null) return;
    var nodeList;
      var testNode;
      var vakey;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vakey = testNode.accessKey;

      assertEquals("accessKeyLink","f".toLowerCase(),vakey.toLowerCase());

},
/**
*
Index that represents the element's position in the tabbing order.
The value of attribute tabIndex of the button element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-39190908
*/
button06 : function () {
   var success;
    if(checkInitialization(builder, "button06") != null) return;
    var nodeList;
      var testNode;
      var vtabIndex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtabIndex = testNode.tabIndex;

      assertEquals("tabIndexLink",20,vtabIndex);

},
/**
*
The type of button
The value of attribute type of the button element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27430092
*/
button07 : function () {
   var success;
    if(checkInitialization(builder, "button07") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","reset",vtype);

},
/**
*
The control is unavailable in this context.
The boolean value of attribute disabled of the button element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-92757155
*/
button08 : function () {
   var success;
    if(checkInitialization(builder, "button08") != null) return;
    var nodeList;
      var testNode;
      var vdisabled;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vdisabled = testNode.disabled;

      assertTrue("disabledLink",vdisabled);

},
/**
*
The current form control value.
The value of attribute value of the button element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-72856782
*/
button09 : function () {
   var success;
    if(checkInitialization(builder, "button09") != null) return;
    var nodeList;
      var testNode;
      var vvalue;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "button");
      nodeList = doc.getElementsByTagName("button");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vvalue = testNode.value;

      assertEquals("typeLink","Reset Disabled Button",vvalue);

},
/**
*


* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-21738539
*/
dlist01 : function () {
   var success;
    if(checkInitialization(builder, "dlist01") != null) return;
    var nodeList;
      var testNode;
      var vcompact;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "dl");
      nodeList = doc.getElementsByTagName("dl");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcompact = testNode.compact;

      assertTrue("compactLink",vcompact);

},
/**
*
Retrieve the title attribute of HTMLDocument and examine it's value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18446827
*/
doc01 : function () {
   var success;
    if(checkInitialization(builder, "doc01") != null) return;
    var vtitle;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "anchor");
      vtitle = doc.title;

      assertEquals("titleLink","NIST DOM HTML Test - Anchor",vtitle);

},
/**
*
hasFeature("hTmL", null) should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
*/
hasFeature01 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature01") != null) return;
    var doc;
      var domImpl;
      var version = null;

      var state;
      domImpl = getImplementation();
state = domImpl.hasFeature("hTmL",version);
assertTrue("hasHTMLnull",state);

},
/**
*
hasFeature("hTmL", "2.0") should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
hasFeature02 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature02") != null) return;
    var doc;
      var domImpl;
      var version = "2.0";
      var state;
      domImpl = getImplementation();
state = domImpl.hasFeature("hTmL",version);
assertTrue("hasHTML2",state);

},
/**
*
hasFeature("xhTmL", null) should return true if hasFeature("XML", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
hasFeature03 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature03") != null) return;
    var doc;
      var domImpl;
      var version = null;

      var state;
      var hasXML;
      domImpl = getImplementation();
hasXML = domImpl.hasFeature("XML",version);
state = domImpl.hasFeature("xhTmL",version);
assertEquals("hasXHTML",hasXML,state);

},
/**
*
hasFeature("xhTmL", "2.0") should return true if hasFeature("XML", "2.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
hasFeature04 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature04") != null) return;
    var doc;
      var domImpl;
      var version = "2.0";
      var state;
      var hasXML;
      domImpl = getImplementation();
hasXML = domImpl.hasFeature("XML",version);
state = domImpl.hasFeature("xhTmL",version);
assertEquals("hasXHTML",hasXML,state);

},
/**
*
hasFeature("cOrE", null) should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
hasFeature05 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature05") != null) return;
    var doc;
      var domImpl;
      var version = null;

      var state;
      domImpl = getImplementation();
state = domImpl.hasFeature("cOrE",version);
assertTrue("hasCore",state);

},
/**
*
hasFeature("cOrE", "2.0") should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
hasFeature06 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature06") != null) return;
    var doc;
      var domImpl;
      var version = "2.0";
      var state;
      domImpl = getImplementation();
state = domImpl.hasFeature("cOrE",version);
assertTrue("hasCore",state);

},
/**
*
Returns the FORM element containing this control. Returns null if this control is not within the context of a form.
The value of attribute form of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-46094773
*/
object01 : function () {
   var success;
    if(checkInitialization(builder, "object01") != null) return;
    var nodeList;
      var testNode;
      var vform;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vform = testNode.form;

      assertNull("formLink",vform);

},
/**
*
Aligns this object (vertically or horizontally) with respect to its surrounding text.
The value of attribute align of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16962097
*/
object02 : function () {
   var success;
    if(checkInitialization(builder, "object02") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","middle",valign);

},
/**
*
Space-separated list of archives
The value of attribute archive of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-47783837
*/
object03 : function () {
   var success;
    if(checkInitialization(builder, "object03") != null) return;
    var nodeList;
      var testNode;
      var varchive;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      varchive = testNode.archive;

      assertEquals("archiveLink","",varchive);

},
/**
*
Width of border around the object.
The value of attribute border of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-82818419
*/
object04 : function () {
   var success;
    if(checkInitialization(builder, "object04") != null) return;
    var nodeList;
      var testNode;
      var vborder;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vborder = testNode.border;

      assertEquals("borderLink","0",vborder);

},
/**
*
Base URI for classid, data, and archive attributes.
The value of attribute codebase of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25709136
*/
object05 : function () {
   var success;
    if(checkInitialization(builder, "object05") != null) return;
    var nodeList;
      var testNode;
      var vcodebase;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vcodebase = testNode.codeBase;

      assertEquals("codebaseLink","http://xw2k.sdct.itl.nist.gov/brady/dom/",vcodebase);

},
/**
*
A URI specifying the location of the object's data.
The value of attribute data of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-81766986
*/
object06 : function () {
   var success;
    if(checkInitialization(builder, "object06") != null) return;
    var nodeList;
      var testNode;
      var vdata;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vdata = testNode.data;

      assertEquals("dataLink","./pix/logo.gif",vdata);

},
/**
*
The value of attribute height of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88925838
*/
object07 : function () {
   var success;
    if(checkInitialization(builder, "object07") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vheight = testNode.height;

      assertEquals("heightLink","60",vheight);

},
/**
*
Horizontal space to the left and right of this image, applet, or object.
The value of attribute hspace of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-17085376
*/
object08 : function () {
   var success;
    if(checkInitialization(builder, "object08") != null) return;
    var nodeList;
      var testNode;
      var vhspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vhspace = testNode.hspace;

      assertEquals("hspaceLink",0,vhspace);

},
/**
*
Message to render while loading the object.
The value of attribute standby of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25039673
*/
object09 : function () {
   var success;
    if(checkInitialization(builder, "object09") != null) return;
    var nodeList;
      var testNode;
      var vstandby;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vstandby = testNode.standby;

      assertEquals("standbyLink","Loading Image ...",vstandby);

},
/**
*
Index that represents the element's position in the tabbing order.
The value of attribute tabIndex of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27083787
*/
object10 : function () {
   var success;
    if(checkInitialization(builder, "object10") != null) return;
    var nodeList;
      var testNode;
      var vtabindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtabindex = testNode.tabIndex;

      assertEquals("tabIndexLink",0,vtabindex);

},
/**
*
Content type for data downloaded via data attribute.
The value of attribute type of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-91665621
*/
object11 : function () {
   var success;
    if(checkInitialization(builder, "object11") != null) return;
    var nodeList;
      var testNode;
      var vtype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vtype = testNode.type;

      assertEquals("typeLink","image/gif",vtype);

},
/**
*
The value of attribute usemap of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-6649772
*/
object12 : function () {
   var success;
    if(checkInitialization(builder, "object12") != null) return;
    var nodeList;
      var testNode;
      var vusemap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vusemap = testNode.useMap;

      assertEquals("useMapLink","#DivLogo-map",vusemap);

},
/**
*
Vertical space above and below this image, applet, or object.
The value of attribute vspace of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/DOM-Level-2-HTML/html#ID-8682483
*/
object13 : function () {
   var success;
    if(checkInitialization(builder, "object13") != null) return;
    var nodeList;
      var testNode;
      var vvspace;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vvspace = testNode.vspace;

      assertEquals("vspaceLink",0,vvspace);

},
/**
*
The value of attribute width of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-38538620
*/
object14 : function () {
   var success;
    if(checkInitialization(builder, "object14") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","550",vwidth);

},
/**
*
Content type for data downloaded via classid attribute.
The value of attribute codetype of the object element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-19945008
*/
object15 : function () {
   var success;
    if(checkInitialization(builder, "object15") != null) return;
    var nodeList;
      var testNode;
      var vcodetype;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "object");
      nodeList = doc.getElementsByTagName("object");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vcodetype = testNode.codeType;

      assertEquals("codeTypeLink","image/gif",vcodetype);

},
/**
*
Returns the table's CAPTION, or void if none exists.
The value of attribute caption of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14594520
*/
table01 : function () {
   var success;
    if(checkInitialization(builder, "table01") != null) return;
    var nodeList;
      var testNode;
      var vcaption;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table1");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vcaption = testNode.caption;

      assertNull("captionLink",vcaption);

},
/**
*
Caption alignment with respect to the table.
The value of attribute align of the tablecaption element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-14594520
*/
table02 : function () {
   var success;
    if(checkInitialization(builder, "table02") != null) return;
    var nodeList;
      var testNode;
      var vcaption;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vcaption = testNode.caption;

      valign = vcaption.align;

      assertEquals("alignLink","top",valign);

},
/**
*
Alignment character for cells in a column.
The value of attribute ch of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
*/
table03 : function () {
   var success;
    if(checkInitialization(builder, "table03") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tHead;

      vch = vsection.ch;

      assertEquals("chLink","*",vch);

},
/**
*
Horizontal alignment of data in cells.
The value of attribute align of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
*/
table04 : function () {
   var success;
    if(checkInitialization(builder, "table04") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tHead;

      valign = vsection.align;

      assertEquals("alignLink","center",valign);

},
/**
*
Vertical alignment of data in cells.
The value of attribute valign of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
table06 : function () {
   var success;
    if(checkInitialization(builder, "table06") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var vvAlign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tFoot;

      vvAlign = vsection.vAlign;

      assertEquals("vAlignLink","middle",vvAlign);

},
/**
*
The collection of rows in this table section.
The value of attribute rows of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
table07 : function () {
   var success;
    if(checkInitialization(builder, "table07") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tFoot;

      vcollection = vsection.rows;

      vrows = vcollection.length;

      assertEquals("vrowsLink",1,vrows);

},
/**
*
Horizontal alignment of data in cells.
The value of attribute align of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
table08 : function () {
   var success;
    if(checkInitialization(builder, "table08") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tFoot;

      valign = vsection.align;

      assertEquals("alignLink","center",valign);

},
/**
*
Vertical alignment of data in cells.
The value of attribute valign of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-9530944
*/
table09 : function () {
   var success;
    if(checkInitialization(builder, "table09") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tHead;

      vvalign = vsection.vAlign;

      assertEquals("alignLink","middle",vvalign);

},
/**
*
Alignment character for cells in a column.
The value of attribute ch of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
table10 : function () {
   var success;
    if(checkInitialization(builder, "table10") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tFoot;

      vch = vsection.ch;

      assertEquals("chLink","+",vch);

},
/**
*
Offset of alignment character.
The value of attribute choff of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
table12 : function () {
   var success;
    if(checkInitialization(builder, "table12") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tHead;

      vchoff = vsection.chOff;

      assertEquals("choffLink","1",vchoff);

},
/**
*
The collection of rows in this table section.
The value of attribute rows of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
table15 : function () {
   var success;
    if(checkInitialization(builder, "table15") != null) return;
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
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tHead;

      vcollection = vsection.rows;

      vrows = vcollection.length;

      assertEquals("vrowsLink",1,vrows);

},
/**
*
Offset of alignment character.
The value of attribute chOff of the tablesection element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64197097
*/
table17 : function () {
   var success;
    if(checkInitialization(builder, "table17") != null) return;
    var nodeList;
      var testNode;
      var vsection;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablesection");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",2,nodeList);
testNode = nodeList.item(1);
      vsection = testNode.tFoot;

      vchoff = vsection.chOff;

      assertEquals("choffLink","2",vchoff);

},
/**
*
The index of this cell in the row.
The value of attribute cellIndex of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-80748363
*/
table18 : function () {
   var success;
    if(checkInitialization(builder, "table18") != null) return;
    var nodeList;
      var testNode;
      var vcindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vcindex = testNode.cellIndex;

      assertEquals("cellIndexLink",1,vcindex);

},
/**
*
Abbreviation for header cells.
The index of this cell in the row.
The value of attribute abbr of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74444037
*/
table19 : function () {
   var success;
    if(checkInitialization(builder, "table19") != null) return;
    var nodeList;
      var testNode;
      var vabbr;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vabbr = testNode.abbr;

      assertEquals("abbrLink","hd2",vabbr);

},
/**
*
Names group of related headers.
The value of attribute axis of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-76554418
*/
table20 : function () {
   var success;
    if(checkInitialization(builder, "table20") != null) return;
    var nodeList;
      var testNode;
      var vaxis;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vaxis = testNode.axis;

      assertEquals("axisLink","center",vaxis);

},
/**
*
Horizontal alignment of data in cell.
The value of attribute align of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-98433879
*/
table21 : function () {
   var success;
    if(checkInitialization(builder, "table21") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
Cell background color.
The value of attribute bgColor of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-88135431
*/
table22 : function () {
   var success;
    if(checkInitialization(builder, "table22") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vbgcolor = testNode.bgColor;

      assertEquals("bgcolorLink","#FF0000".toLowerCase(),vbgcolor.toLowerCase());

},
/**
*
Alignment character for cells in a column.
The value of attribute char of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-30914780
*/
table23 : function () {
   var success;
    if(checkInitialization(builder, "table23") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vch = testNode.ch;

      assertEquals("chLink",":",vch);

},
/**
*
offset of alignment character.
The value of attribute chOff of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-20144310
*/
table24 : function () {
   var success;
    if(checkInitialization(builder, "table24") != null) return;
    var nodeList;
      var testNode;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vchoff = testNode.chOff;

      assertEquals("chOffLink","1",vchoff);

},
/**
*
Number of columns spanned by cell.
The value of attribute colspan of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-84645244
*/
table25 : function () {
   var success;
    if(checkInitialization(builder, "table25") != null) return;
    var nodeList;
      var testNode;
      var vcolspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vcolspan = testNode.colSpan;

      assertEquals("colSpanLink",1,vcolspan);

},
/**
*
The value of attribute height of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83679212
*/
table26 : function () {
   var success;
    if(checkInitialization(builder, "table26") != null) return;
    var nodeList;
      var testNode;
      var vheight;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vheight = testNode.height;

      assertEquals("heightLink","50",vheight);

},
/**
*
Suppress word wrapping.
The value of attribute nowrap of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-62922045
*/
table27 : function () {
   var success;
    if(checkInitialization(builder, "table27") != null) return;
    var nodeList;
      var testNode;
      var vnowrap;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vnowrap = testNode.noWrap;

      assertTrue("nowrapLink",vnowrap);

},
/**
*
Number of rows spanned by cell.
The value of attribute rowspan of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-48237625
*/
table28 : function () {
   var success;
    if(checkInitialization(builder, "table28") != null) return;
    var nodeList;
      var testNode;
      var vrowspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vrowspan = testNode.rowSpan;

      assertEquals("rowSpanLink",1,vrowspan);

},
/**
*
Scope covered by header cells.
The value of attribute scope of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-36139952
*/
table29 : function () {
   var success;
    if(checkInitialization(builder, "table29") != null) return;
    var nodeList;
      var testNode;
      var vscope;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vscope = testNode.scope;

      assertEquals("scopeLink","col",vscope);

},
/**
*
List of id attribute values for header cells.
The value of attribute headers of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-89104817
*/
table30 : function () {
   var success;
    if(checkInitialization(builder, "table30") != null) return;
    var nodeList;
      var testNode;
      var vheaders;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vheaders = testNode.headers;

      assertEquals("headersLink","header-3",vheaders);

},
/**
*
Vertical alignment of data in cell.
The value of attribute valign of the tablecell element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-58284221
*/
table31 : function () {
   var success;
    if(checkInitialization(builder, "table31") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
/**
*
cell width.
The value of attribute width of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-27480795
*/
table32 : function () {
   var success;
    if(checkInitialization(builder, "table32") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecell");
      nodeList = doc.getElementsByTagName("td");
      assertSize("Asize",4,nodeList);
testNode = nodeList.item(1);
      vwidth = testNode.width;

      assertEquals("vwidthLink","175",vwidth);

},
/**
*
Specifies the table's position with respect to the rest of the document.
The value of attribute align of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-23180977
*/
table33 : function () {
   var success;
    if(checkInitialization(builder, "table33") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
The width of the border around the table.
The value of attribute border of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-50969400
*/
table34 : function () {
   var success;
    if(checkInitialization(builder, "table34") != null) return;
    var nodeList;
      var testNode;
      var vborder;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vborder = testNode.border;

      assertEquals("borderLink","4",vborder);

},
/**
*
Cell background color.
The value of attribute bgcolor of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83532985
*/
table35 : function () {
   var success;
    if(checkInitialization(builder, "table35") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vbgcolor = testNode.bgColor;

      assertEquals("bgcolorLink","#ff0000",vbgcolor);

},
/**
*
Specifies which external table borders to render.
The value of attribute frame of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-64808476
*/
table36 : function () {
   var success;
    if(checkInitialization(builder, "table36") != null) return;
    var nodeList;
      var testNode;
      var vframe;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vframe = testNode.frame;

      assertEquals("frameLink","border",vframe);

},
/**
*
Specifies the horizontal and vertical space between cell content and cell borders. The value of attribute cellpadding of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-59162158
*/
table37 : function () {
   var success;
    if(checkInitialization(builder, "table37") != null) return;
    var nodeList;
      var testNode;
      var vcellpadding;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vcellpadding = testNode.cellPadding;

      assertEquals("cellpaddingLink","2",vcellpadding);

},
/**
*
Specifies the horizontal and vertical separation between cells.
The value of attribute cellspacing of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68907883
*/
table38 : function () {
   var success;
    if(checkInitialization(builder, "table38") != null) return;
    var nodeList;
      var testNode;
      var vcellspacing;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vcellspacing = testNode.cellSpacing;

      assertEquals("cellspacingLink","2",vcellspacing);

},
/**
*
Supplementary description about the purpose or structure of a table.
The value of attribute summary of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-44998528
*/
table39 : function () {
   var success;
    if(checkInitialization(builder, "table39") != null) return;
    var nodeList;
      var testNode;
      var vsummary;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vsummary = testNode.summary;

      assertEquals("summaryLink","HTML Control Table",vsummary);

},
/**
*
Specifies which internal table borders to render.
The value of attribute rules of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-26347553
*/
table40 : function () {
   var success;
    if(checkInitialization(builder, "table40") != null) return;
    var nodeList;
      var testNode;
      var vrules;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vrules = testNode.rules;

      assertEquals("rulesLink","all",vrules);

},
/**
*
Specifies the desired table width.
The value of attribute width of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-77447361
*/
table41 : function () {
   var success;
    if(checkInitialization(builder, "table41") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("table");
      assertSize("Asize",3,nodeList);
testNode = nodeList.item(1);
      vwidth = testNode.width;

      assertEquals("widthLink","680",vwidth);

},
/**
*
Horizontal alignment of data within cells of this row.
The value of attribute align of the tablerow element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74098257
*/
table42 : function () {
   var success;
    if(checkInitialization(builder, "table42") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",8,nodeList);
testNode = nodeList.item(1);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
Background color for rows.
The value of attribute bgcolor of the tablerow element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-18161327
*/
table43 : function () {
   var success;
    if(checkInitialization(builder, "table43") != null) return;
    var nodeList;
      var testNode;
      var vbgcolor;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",8,nodeList);
testNode = nodeList.item(1);
      vbgcolor = testNode.bgColor;

      assertEquals("bgcolorLink","#00FFFF".toLowerCase(),vbgcolor.toLowerCase());

},
/**
*
Vertical alignment of data within cells of this row.
The value of attribute valign of the tablerow element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-90000058
*/
table44 : function () {
   var success;
    if(checkInitialization(builder, "table44") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "table");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",8,nodeList);
testNode = nodeList.item(1);
      vvalign = testNode.vAlign;

      assertEquals("valignLink","middle",vvalign);

},
/**
*
Alignment character for cells in a column.
The value of attribute ch of the tablerow element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16230502
*/
table45 : function () {
   var success;
    if(checkInitialization(builder, "table45") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      vch = testNode.ch;

      assertEquals("vchLink","*",vch);

},
/**
*
Offset of alignment character.
The value of attribute choff of the tablerow element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68207461
*/
table46 : function () {
   var success;
    if(checkInitialization(builder, "table46") != null) return;
    var nodeList;
      var testNode;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(1);
      vchoff = testNode.chOff;

      assertEquals("choffLink","1",vchoff);

},
/**
*
The index of this row, relative to the entire table.
The value of attribute rowIndex of the table element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-67347567
*/
table47 : function () {
   var success;
    if(checkInitialization(builder, "table47") != null) return;
    var nodeList;
      var testNode;
      var vrindex;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablerow");
      nodeList = doc.getElementsByTagName("tr");
      assertSize("Asize",5,nodeList);
testNode = nodeList.item(4);
      vrindex = testNode.rowIndex;

      assertEquals("rowIndexLink",2,vrindex);

},
/**
*
Horizontal alignment of cell data in column.
The value of attribute align of the tablecol element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-74098257
*/
table48 : function () {
   var success;
    if(checkInitialization(builder, "table48") != null) return;
    var nodeList;
      var testNode;
      var valign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      valign = testNode.align;

      assertEquals("alignLink","center",valign);

},
/**
*
Alignment character for cells in a column.
The value of attribute ch of the tablecol element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-16230502
*/
table49 : function () {
   var success;
    if(checkInitialization(builder, "table49") != null) return;
    var nodeList;
      var testNode;
      var vch;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vch = testNode.ch;

      assertEquals("chLink","*",vch);

},
/**
*
Offset of alignment character.
The value of attribute choff of the tablecol element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-68207461
*/
table50 : function () {
   var success;
    if(checkInitialization(builder, "table50") != null) return;
    var nodeList;
      var testNode;
      var vchoff;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vchoff = testNode.chOff;

      assertEquals("chOffLink","20",vchoff);

},
/**
*
Indicates the number of columns in a group or affected by a grouping.
The value of attribute span of the tablecol element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-96511335
*/
table51 : function () {
   var success;
    if(checkInitialization(builder, "table51") != null) return;
    var nodeList;
      var testNode;
      var vspan;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vspan = testNode.span;

      assertEquals("spanLink",1,vspan);

},
/**
*
Vertical alignment of cell data in column.
The value of attribute valign of the tablecol element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-83291710
*/
table52 : function () {
   var success;
    if(checkInitialization(builder, "table52") != null) return;
    var nodeList;
      var testNode;
      var vvalign;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vvalign = testNode.vAlign;

      assertEquals("vAlignLink","middle",vvalign);

},
/**
*
Default column width.
The value of attribute width of the tablecol element is read and checked against the expected value.

* @author Netscape
* @author Sivakiran Tummala
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-html#ID-25196799
*/
table53 : function () {
   var success;
    if(checkInitialization(builder, "table53") != null) return;
    var nodeList;
      var testNode;
      var vwidth;
      var doc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "tablecol");
      nodeList = doc.getElementsByTagName("col");
      assertSize("Asize",1,nodeList);
testNode = nodeList.item(0);
      vwidth = testNode.width;

      assertEquals("widthLink","20",vwidth);

},
document_write_before_loaded : function() {
  if(checkInitialization(builder, "table53") != null) return;
  var anchor, doc, docRef = null;
  if (typeof(this.doc) != 'undefined') {
    docRef = this.doc;
  }

  doc = load(docRef, "doc", "anchor");
  doc.innerHTML = "<html><body><p><a id='Anchor'>Anchor Text</a></body></html>";
  anchor = doc.getElementById("Anchor");
  doc.readyState = 'loading';
  doc.write("hello world");
  assertEquals("#Anchor's innerHTML should be set", 
               'hello world', anchor.innerHTML);
},
event_default_action : function() {
    var success;
    if(checkInitialization(builder, "event_default_action") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var performedDefault = false;
    
    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "anchor");

    var a = doc.getElementById("Anchor");
    a.addEventListener("foo", function() {}, true);
	  evt = doc.createEvent("Events");
    evt.initEvent("foo",false,false);
    
    a._eventDefaults['foo'] = function(event) {
      performedDefault = true;
    }
    preventDefault = a.dispatchEvent(evt);
    assertFalse("preventDefault", preventDefault);
    assertTrue("performedDefault", performedDefault);
}}
