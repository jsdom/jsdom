exports.tests = {
/**
*
	The "getOwnerElement()" will return the Element node this attribute is attached to or
	null if this attribute is not in use.

   Retreive the default attribute defaultAttr and check its owner element.  Verify if the name
   the nodeName of the returned ownerElement is emp:employee.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Attr-ownerElement
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
attrgetownerelement01 : function () {
   var success;
    if(checkInitialization(builder, "attrgetownerelement01") != null) return;
    var doc;
      var attr;
      var element;
      var ownerElement;
      var ownerElementName;
      var elementList;
      var attributes;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");

      element = elementList.item(1);
      attributes = element.attributes;

      attr = attributes.getNamedItemNS(nullNS,"defaultAttr");

      ownerElement = attr.ownerElement;

      ownerElementName = ownerElement.nodeName;

      assertEquals("attrgetownerelement01","emp:employee",ownerElementName);

},
/**
*
  The "getOwnerElement()" will return the Element node this attribute
  is attached to or null if this attribute is not in use.

  Create a new element and attribute node, attach the attribute to the element.
  Check the value of owner element of the new attribute node

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Attr-ownerElement
*/
attrgetownerelement02 : function () {
   var success;
    if(checkInitialization(builder, "attrgetownerelement02") != null) return;
    var doc;
      var element;
      var ownerElement;
      var ownerElementName;
      var attr;
      var newAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      element = doc.createElement("root");
      attr = doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      newAttr = element.setAttributeNodeNS(attr);
      ownerElement = attr.ownerElement;

      ownerElementName = ownerElement.nodeName;

      assertEquals("attrgetownerelement02","root".toLowerCase(),ownerElementName.toLowerCase());

},
/**
*

  The "getOwnerElement()" will return the Element node this attribute

  is attached to or null if this attribute is not in use.



  Create a new attribute node for this document node.  Since the newly attribute is

  not it use its owner element should be null.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Attr-ownerElement
*/
attrgetownerelement03 : function () {
   var success;
    if(checkInitialization(builder, "attrgetownerelement03") != null) return;
    var doc;
      var ownerElement;
      var attr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      attr = doc.createAttributeNS("http://www.w3.org/DOM","dom:attr");
      ownerElement = attr.ownerElement;

      assertNull("attrgetownerelement03",ownerElement);

},
/**
*
  The "getOwnerElement()" will return the Element node this attribute is attached to or
  null if this attribute is not in use.
  Import an attribute node to another document.  If an Attr node is imported, its
  ownerElement attribute should be set to null.  Verify if the ownerElement has been set
  to null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Attr-ownerElement
*/
attrgetownerelement04 : function () {
   var success;
    if(checkInitialization(builder, "attrgetownerelement04") != null) return;
    var doc;
      var docImp;
      var ownerElement;
      var element;
      var attr;
      var attrImp;
      var addresses;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var docImpRef = null;
      if (typeof(this.docImp) != 'undefined') {
        docImpRef = this.docImp;
      }
      docImp = load(docImpRef, "docImp", "staff");
      addresses = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = addresses.item(1);
      assertNotNull("empAddressNotNull",element);
attr = element.getAttributeNodeNS("http://www.nist.gov","zone");
      attrImp = docImp.importNode(attr,true);
      ownerElement = attrImp.ownerElement;

      assertNull("attrgetownerelement04",ownerElement);

},
/**
*
  The "getOwnerElement()" will return the Element node this attribute is attached to
  or null if this attribute is not in use.

  Retreive an element and its attributes.  Then remove the element and check the name of
  the ownerElement of attribute of the attribute "street".

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Attr-ownerElement
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
attrgetownerelement05 : function () {
   var success;
    if(checkInitialization(builder, "attrgetownerelement05") != null) return;
    var doc;
      var element;
      var ownerElement;
      var parentElement;
      var elementList;
      var ownerElementName;
      var attr;
      var removedChild;
      var nodeMap;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      parentElement = element.parentNode;

      nodeMap = element.attributes;

      removedChild = parentElement.removeChild(element);
      attr = nodeMap.getNamedItemNS(nullNS,"street");
      ownerElement = attr.ownerElement;

      ownerElementName = ownerElement.nodeName;

      assertEquals("attrgetownerelement05","address",ownerElementName);

},
/**
*
    The "createAttributeNS(namespaceURI,qualifiedName)" method for a
   Document should raise NAMESPACE_ERR DOMException
   if qualifiedName is malformed.

   Invoke method createAttributeNS(namespaceURI,qualifiedName) on
   the XMLNS Document with namespaceURI being "http://www.ecommerce.org/",
   qualifiedName as "prefix::local".  Method should raise
   NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createAttributeNS01 : function () {
   var success;
    if(checkInitialization(builder, "createAttributeNS01") != null) return;
    var namespaceURI = "http://www.ecommerce.org/";
      var malformedName = "prefix::local";
      var doc;
      var newAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            newAttr = doc.createAttributeNS(namespaceURI,malformedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createAttributeNS(namespaceURI,qualifiedName)" method for a
   Document should raise NAMESPACE_ERR DOMException
   if qualifiedName has a prefix and namespaceURI is null.

   Invoke method createAttributeNS(namespaceURI,qualifiedName) on this document
   with namespaceURI being null and qualifiedName contains the prefix "person".
   Method should raise NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createAttributeNS02 : function () {
   var success;
    if(checkInitialization(builder, "createAttributeNS02") != null) return;
    var namespaceURI = null;

      var qualifiedName = "prefix:local";
      var doc;
      var newAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createAttributeNS(namespaceURI,qualifiedName)" method for a
   Document should raise INVALID_CHARACTER_ERR DOMException
   if qualifiedName contains an illegal character.

   Invoke method createAttributeNS(namespaceURI,qualifiedName) on this document
   with qualifiedName containing an illegal character from illegalChars[].
   Method should raise INVALID_CHARACTER_ERR DOMException for all
   characters in illegalChars[].

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
*/
createAttributeNS03 : function () {
   var success;
    if(checkInitialization(builder, "createAttributeNS03") != null) return;
    var namespaceURI = "http://www.wedding.com/";
      var qualifiedName;
      var doc;
      var newAttr;
      illegalQNames = new Array();
      illegalQNames[0] = "person:{";
      illegalQNames[1] = "person:}";
      illegalQNames[2] = "person:~";
      illegalQNames[3] = "person:'";
      illegalQNames[4] = "person:!";
      illegalQNames[5] = "person:@";
      illegalQNames[6] = "person:#";
      illegalQNames[7] = "person:$";
      illegalQNames[8] = "person:%";
      illegalQNames[9] = "person:^";
      illegalQNames[10] = "person:&";
      illegalQNames[11] = "person:*";
      illegalQNames[12] = "person:(";
      illegalQNames[13] = "person:)";
      illegalQNames[14] = "person:+";
      illegalQNames[15] = "person:=";
      illegalQNames[16] = "person:[";
      illegalQNames[17] = "person:]";
      illegalQNames[18] = "person:\\";
      illegalQNames[19] = "person:/";
      illegalQNames[20] = "person:;";
      illegalQNames[21] = "person:`";
      illegalQNames[22] = "person:<";
      illegalQNames[23] = "person:>";
      illegalQNames[24] = "person:,";
      illegalQNames[25] = "person:a ";
      illegalQNames[26] = "person:\"";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      for(var indexN10090 = 0;indexN10090 < illegalQNames.length; indexN10090++) {
      qualifiedName = illegalQNames[indexN10090];

	{
		success = false;
		try {
            newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

	}

},
/**
*
    The "createAttributeNS(namespaceURI,qualifiedName)" method for a
   Document should raise NAMESPACE_ERR DOMException
   if qualifiedName has the "xml" prefix and namespaceURI is different
   from "http://www.w3.org/XML/1998/namespace".

   Invoke method createAttributeNS(namespaceURI,qualifiedName) on this document
   with qualifiedName being "xml:attr1 and namespaceURI equals
   the string "http://www.w3.org/XML/1998/namespaces" (which differs from the required
       string "http://www.w3.org/XML/1998/namespace").
   Method should raise NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createAttributeNS04 : function () {
   var success;
    if(checkInitialization(builder, "createAttributeNS04") != null) return;
    var namespaceURI = "http://www.w3.org/XML/1998/namespaces";
      var qualifiedName = "xml:attr1";
      var doc;
      var newAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createAttributeNS(namespaceURI,qualifiedName)" method for a
   Document should return a new Attr object given that all parameters are
   valid and correctly formed.

   Invoke method createAttributeNS(namespaceURI,qualifiedName) on this document with
   parameters equal "http://www.ecommerce.org/" and "ecom:local"
   respectively. Method should return a new Attr object whose name is "ecom:local".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1112119403
*/
createAttributeNS05 : function () {
   var success;
    if(checkInitialization(builder, "createAttributeNS05") != null) return;
    var namespaceURI = "http://www.ecommerce.org/";
      var qualifiedName = "econm:local";
      var doc;
      var newAttr;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
      attrName = newAttr.name;

      assertEquals("throw_Equals",qualifiedName,attrName);

},
/**
*
Document.createAttributeNS with an empty qualified name should cause an INVALID_CHARACTER_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
*/
createAttributeNS06 : function () {
   var success;
    if(checkInitialization(builder, "createAttributeNS06") != null) return;
    var namespaceURI = "http://www.example.com/";
      var qualifiedName;
      var doc;
      var newAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");

	{
		success = false;
		try {
            newAttr = doc.createAttributeNS(namespaceURI,"");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
  The "createDocument(namespaceURI,qualifiedName,doctype)" method for a
  DOMImplementation should raise NAMESPACE_ERR DOMException
  if parameter qualifiedName is malformed.

  Retrieve the DOMImplementation on the XMLNS Document.
  Invoke method createDocument(namespaceURI,qualifiedName,doctype)
  on the retrieved DOMImplementation with namespaceURI being
  the literal string "http://www.ecommerce.org/", qualifiedName as
  "prefix::local", and doctype as null.  Method should raise
  NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocument')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createDocument01 : function () {
   var success;
    if(checkInitialization(builder, "createDocument01") != null) return;
    var namespaceURI = "http://www.ecommerce.org/";
      var malformedName = "prefix::local";
      var doc;
      var docType = null;

      var domImpl;
      var aNewDoc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            aNewDoc = domImpl.createDocument(namespaceURI,malformedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createDocument(namespaceURI,qualifiedName,doctype)" method for a
   DOMImplementation should raise NAMESPACE_ERR DOMException
   if qualifiedName has a prefix and namespaceURI is null.

   Invoke method createDocument(namespaceURI,qualifiedName,doctype) on
   this domimplementation with namespaceURI being null and qualifiedName
   equals "k:local". Method should raise NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocument')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createDocument02 : function () {
   var success;
    if(checkInitialization(builder, "createDocument02") != null) return;
    var namespaceURI = null;

      var qualifiedName = "k:local";
      var doc;
      var docType = null;

      var domImpl;
      var aNewDoc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createDocument(namespaceURI,qualifiedName,doctype)" method for a
   DOMImplementation should raise WRONG_DOCUMENT_ERR DOMException
   if parameter doctype has been used with a different document.

   Invoke method createDocument(namespaceURI,qualifiedName,doctype) on
   this domimplementation where doctype is the type of this document.
   Method should raise WRONG_DOCUMENT_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocument')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
*/
createDocument03 : function () {
   var success;
    if(checkInitialization(builder, "createDocument03") != null) return;
    var namespaceURI = "http://www.ecommerce.org/schema";
      var qualifiedName = "namespaceURI:x";
      var doc;
      var docType;
      var domImpl;
      var aNewDoc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      domImpl = doc.implementation;

	{
		success = false;
		try {
            aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
*
    The "createDocument(namespaceURI,qualifiedName,doctype)" method for a
   DOMImplementation should raise WRONG_DOCUMENT_ERR DOMException
   if parameter doctype was created from a different implementation.

   Invoke method createDocument(namespaceURI,qualifiedName,doctype) on
   a domimplementation that is different from this domimplementation.
   Doctype is the type of this document.
   Method should raise WRONG_DOCUMENT_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocument')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
*/
createDocument04 : function () {
   var success;
    if(checkInitialization(builder, "createDocument04") != null) return;
    var namespaceURI = "http://www.ecommerce.org/schema";
      var qualifiedName = "namespaceURI:x";
      var doc;
      var docType;
      var domImpl;
      var aNewDoc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      docType = doc.doctype;

      domImpl = aNewDoc.implementation;

	{
		success = false;
		try {
            aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
*
    The "createDocument(namespaceURI,qualifiedName,doctype)" method for a
   DOMImplementation should raise INVALID_CHARACTER_ERR DOMException
   if parameter qualifiedName contains an illegal character.

   Invoke method createDocument(namespaceURI,qualifiedName,doctype) on
   this domimplementation with namespaceURI equals "http://www.ecommerce.org/schema",
   doctype is null and qualifiedName contains an illegal character from
   illegalChars[].  Method should raise INVALID_CHARACTER_ERR DOMException
   for all characters in illegalChars[].

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#
*/
createDocument05 : function () {
   var success;
    if(checkInitialization(builder, "createDocument05") != null) return;
    var namespaceURI = "http://www.ecommerce.org/schema";
      var qualifiedName;
      var doc;
      var docType = null;

      var domImpl;
      var aNewDoc;
      var charact;
      illegalQNames = new Array();
      illegalQNames[0] = "namespaceURI:{";
      illegalQNames[1] = "namespaceURI:}";
      illegalQNames[2] = "namespaceURI:~";
      illegalQNames[3] = "namespaceURI:'";
      illegalQNames[4] = "namespaceURI:!";
      illegalQNames[5] = "namespaceURI:@";
      illegalQNames[6] = "namespaceURI:#";
      illegalQNames[7] = "namespaceURI:$";
      illegalQNames[8] = "namespaceURI:%";
      illegalQNames[9] = "namespaceURI:^";
      illegalQNames[10] = "namespaceURI:&";
      illegalQNames[11] = "namespaceURI:*";
      illegalQNames[12] = "namespaceURI:(";
      illegalQNames[13] = "namespaceURI:)";
      illegalQNames[14] = "namespaceURI:+";
      illegalQNames[15] = "namespaceURI:=";
      illegalQNames[16] = "namespaceURI:[";
      illegalQNames[17] = "namespaceURI:]";
      illegalQNames[18] = "namespaceURI:\\";
      illegalQNames[19] = "namespaceURI:/";
      illegalQNames[20] = "namespaceURI:;";
      illegalQNames[21] = "namespaceURI:`";
      illegalQNames[22] = "namespaceURI:<";
      illegalQNames[23] = "namespaceURI:>";
      illegalQNames[24] = "namespaceURI:,";
      illegalQNames[25] = "namespaceURI:a ";
      illegalQNames[26] = "namespaceURI:\"";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      for(var indexN1009A = 0;indexN1009A < illegalQNames.length; indexN1009A++) {
      qualifiedName = illegalQNames[indexN1009A];
      domImpl = doc.implementation;

	{
		success = false;
		try {
            aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

	}

},
/**
*
  The "createDocument(namespaceURI,qualifiedName,doctype)" method for a
  DOMImplementation should raise NAMESPACE_ERR DOMException
  if qualifiedName has the "xml" prefix and namespaceURI different from
  "http://www.w3.org/XML/1998/namespace"

  Invoke method createDocument(namespaceURI,qualifiedName,doctype) on
  this domimplementation with qualifiedName "xml:local"
  and namespaceURI as the string
  "http://www.ecommerce.org/schema" (which is different from the required
  "http://www.w3.org/XML/1998/namespace"). Method should raise
  NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocument')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createDocument06 : function () {
   var success;
    if(checkInitialization(builder, "createDocument06") != null) return;
    var namespaceURI = "http://ecommerce.org/schema";
      var qualifiedName = "xml:local";
      var doc;
      var docType = null;

      var domImpl;
      var aNewDoc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createDocument(namespaceURI,qualifiedName,doctype)" method for a
   DOMImplementation should return a new xml Document object of the
   specified type with its document element given that all parameters are
   valid and correctly formed.

   Invoke method createDocument(namespaceURI,qualifiedName,doctype) on
   this domimplementation. namespaceURI is "http://www.ecommerce.org/schema"
   qualifiedName is "y:x" and doctype is null.
   Method should return a new xml Document as specified by the listed parameters.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
*/
createDocument07 : function () {
   var success;
    if(checkInitialization(builder, "createDocument07") != null) return;
    var namespaceURI = "http://www.ecommerce.org/schema";
      var qualifiedName = "y:x";
      var doc;
      var docType = null;

      var domImpl;
      var aNewDoc;
      var nodeName;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
      nodeName = aNewDoc.nodeName;

      nodeValue = aNewDoc.nodeValue;

      assertEquals("nodeName","#document",nodeName);
       assertNull("nodeValue",nodeValue);

},
/**
*
DOMImplementation.createDocument with an empty qualified name should cause an INVALID_CHARACTER_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
*/
createDocument08 : function () {
   var success;
    if(checkInitialization(builder, "createDocument08") != null) return;
    var namespaceURI = "http://www.example.org/schema";
      var docType = null;

      var domImpl;
      var aNewDoc;
      var charact;
      var doc = load(null, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            aNewDoc = domImpl.createDocument(namespaceURI,"",docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
  The "createDocumentType(qualifiedName,publicId,systemId)" method for a
  DOMImplementation should raise NAMESPACE_ERR DOMException if
  qualifiedName is malformed.

  Retrieve the DOMImplementation on the XMLNS Document.
  Invoke method createDocumentType(qualifiedName,publicId,systemId)
  on the retrieved DOMImplementation with qualifiedName being the literal
  string "prefix::local", publicId as "STAFF", and systemId as "staff".
  Method should raise NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocType')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createDocumentType01 : function () {
   var success;
    if(checkInitialization(builder, "createDocumentType01") != null) return;
    var publicId = "STAFF";
      var systemId = "staff.xml";
      var malformedName = "prefix::local";
      var doc;
      var domImpl;
      var newType;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            newType = domImpl.createDocumentType(malformedName,publicId,systemId);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createDocumentType(qualifiedName,publicId,systemId)" method for a
   DOMImplementation should raise INVALID_CHARACTER_ERR DOMException if
   qualifiedName contains an illegal character.

   Invoke method createDocumentType(qualifiedName,publicId,systemId) on
   this domimplementation with qualifiedName containing an illegal character
   from illegalChars[]. Method should raise INVALID_CHARACTER_ERR
   DOMException for all characters in illegalChars[].

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocType')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
*/
createDocumentType02 : function () {
   var success;
    if(checkInitialization(builder, "createDocumentType02") != null) return;
    var publicId = "http://www.localhost.com/";
      var systemId = "myDoc.dtd";
      var qualifiedName;
      var doc;
      var docType = null;

      var domImpl;
      illegalQNames = new Array();
      illegalQNames[0] = "edi:{";
      illegalQNames[1] = "edi:}";
      illegalQNames[2] = "edi:~";
      illegalQNames[3] = "edi:'";
      illegalQNames[4] = "edi:!";
      illegalQNames[5] = "edi:@";
      illegalQNames[6] = "edi:#";
      illegalQNames[7] = "edi:$";
      illegalQNames[8] = "edi:%";
      illegalQNames[9] = "edi:^";
      illegalQNames[10] = "edi:&";
      illegalQNames[11] = "edi:*";
      illegalQNames[12] = "edi:(";
      illegalQNames[13] = "edi:)";
      illegalQNames[14] = "edi:+";
      illegalQNames[15] = "edi:=";
      illegalQNames[16] = "edi:[";
      illegalQNames[17] = "edi:]";
      illegalQNames[18] = "edi:\\";
      illegalQNames[19] = "edi:/";
      illegalQNames[20] = "edi:;";
      illegalQNames[21] = "edi:`";
      illegalQNames[22] = "edi:<";
      illegalQNames[23] = "edi:>";
      illegalQNames[24] = "edi:,";
      illegalQNames[25] = "edi:a ";
      illegalQNames[26] = "edi:\"";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      for(var indexN1009A = 0;indexN1009A < illegalQNames.length; indexN1009A++) {
      qualifiedName = illegalQNames[indexN1009A];
      domImpl = doc.implementation;

	{
		success = false;
		try {
            docType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

	}

},
/**
*
    The "createDocumentType(qualifiedName,publicId,systemId)" method for a
   DOMImplementation should return a new DocumentType node
   given that qualifiedName is valid and correctly formed.

   Invoke method createDocumentType(qualifiedName,publicId,systemId) on
   this domimplementation with qualifiedName "prefix:myDoc".
   Method should return a new DocumentType node.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
*/
createDocumentType03 : function () {
   var success;
    if(checkInitialization(builder, "createDocumentType03") != null) return;
    var namespaceURI = "http://ecommerce.org/schema";
      var qualifiedName = "prefix:myDoc";
      var publicId = "http://www.localhost.com";
      var systemId = "myDoc.dtd";
      var doc;
      var domImpl;
      var newType = null;

      var nodeName;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
      nodeName = newType.nodeName;

      assertEquals("nodeName","prefix:myDoc",nodeName);
       nodeValue = newType.nodeValue;

      assertNull("nodeValue",nodeValue);

},
/**
*
DOMImplementation.createDocumentType with an empty name should cause an INVALID_CHARACTER_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocType')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
*/
createDocumentType04 : function () {
   var success;
    if(checkInitialization(builder, "createDocumentType04") != null) return;
    var publicId = "http://www.example.com/";
      var systemId = "myDoc.dtd";
      var qualifiedName;
      var docType = null;

      var domImpl;
      domImpl = load(null, "doc", "staffNS").implementation;

	{
		success = false;
		try {
            docType = domImpl.createDocumentType("",publicId,systemId);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
    The "createElementNS(namespaceURI,qualifiedName)" method for a
   Document should raise NAMESPACE_ERR DOMException if
   qualifiedName is malformed.

   Invoke method createElementNS(namespaceURI,qualifiedName) on
   the XMLNS Document with namespaceURI being the literal string
   "http://www.ecommerce.org/", and qualifiedName as "prefix::local".
   Method should raise NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrElNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createElementNS01 : function () {
   var success;
    if(checkInitialization(builder, "createElementNS01") != null) return;
    var namespaceURI = "http://www.ecommerce.org/";
      var malformedName = "prefix::local";
      var doc;
      var newElement;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            newElement = doc.createElementNS(namespaceURI,malformedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createElementNS(namespaceURI,qualifiedName)" method for a
   Document should raise NAMESPACE_ERR DOMException if
   qualifiedName has a prefix and namespaceURI is null.

   Invoke method createElementNS(namespaceURI,qualifiedName) on this document
   with namespaceURI being null and qualifiedName being "elem:attr1".
   Method should raise NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrElNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createElementNS02 : function () {
   var success;
    if(checkInitialization(builder, "createElementNS02") != null) return;
    var namespaceURI = null;

      var qualifiedName = "prefix:local";
      var doc;
      var newElement;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            newElement = doc.createElementNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createElementNS(namespaceURI,qualifiedName)" method for a
   Document should raise INVALID_CHARACTER_ERR DOMException if
   qualifiedName contains an illegal character.

   Invoke method createElementNS(namespaceURI,qualifiedName) on this document
   with qualifiedName containing an illegal character from illegalChars[].
   Method should raise INVALID_CHARACTER_ERR DOMException for all characters
   in illegalChars[].

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrElNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
*/
createElementNS03 : function () {
   var success;
    if(checkInitialization(builder, "createElementNS03") != null) return;
    var namespaceURI = "http://www.wedding.com/";
      var qualifiedName;
      var doc;
      var done;
      var newElement;
      var charact;
      illegalQNames = new Array();
      illegalQNames[0] = "person:{";
      illegalQNames[1] = "person:}";
      illegalQNames[2] = "person:~";
      illegalQNames[3] = "person:'";
      illegalQNames[4] = "person:!";
      illegalQNames[5] = "person:@";
      illegalQNames[6] = "person:#";
      illegalQNames[7] = "person:$";
      illegalQNames[8] = "person:%";
      illegalQNames[9] = "person:^";
      illegalQNames[10] = "person:&";
      illegalQNames[11] = "person:*";
      illegalQNames[12] = "person:(";
      illegalQNames[13] = "person:)";
      illegalQNames[14] = "person:+";
      illegalQNames[15] = "person:=";
      illegalQNames[16] = "person:[";
      illegalQNames[17] = "person:]";
      illegalQNames[18] = "person:\\";
      illegalQNames[19] = "person:/";
      illegalQNames[20] = "person:;";
      illegalQNames[21] = "person:`";
      illegalQNames[22] = "person:<";
      illegalQNames[23] = "person:>";
      illegalQNames[24] = "person:,";
      illegalQNames[25] = "person:a ";
      illegalQNames[26] = "person:\"";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      for(var indexN10098 = 0;indexN10098 < illegalQNames.length; indexN10098++) {
      qualifiedName = illegalQNames[indexN10098];

	{
		success = false;
		try {
            newElement = doc.createElementNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

	}

},
/**
*
   The "createElementNS(namespaceURI,qualifiedName") method for
   a Document should raise NAMESPACE_ERR DOMException if the
   qualifiedName has an "xml" prefix and the namespaceURI is different
   from http://www.w3.org/XML/1998/namespace".

   Invoke method createElementNS(namespaceURI,qualifiedName) on this document
   with qualifiedName being "xml:element1" and namespaceURI equals the string
   "http://www.w3.org/XML/1997/namespace" (which differs from the required
   string "http://www.w3.org/XML/1998/namespace").
   Method should raise NAMESPACE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrElNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
createElementNS04 : function () {
   var success;
    if(checkInitialization(builder, "createElementNS04") != null) return;
    var namespaceURI = "http://www.w3.org/XML/1998/namespaces";
      var qualifiedName = "xml:element1";
      var doc;
      var newElement;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            newElement = doc.createElementNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "createElementNS(namespaceURI,qualifiedName)" method for a
   Document should return a new Element object given that all parameters
   are valid and correctly formed.

   Invoke method createElementNS(namespaceURI,qualifiedName on this document
   with namespaceURI as "http://www.nist.gov" and qualifiedName as "gov:faculty".
   Method should return a new Element object whose name is "gov:faculty".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-104682815
*/
createElementNS05 : function () {
   var success;
    if(checkInitialization(builder, "createElementNS05") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "gov:faculty";
      var doc;
      var newElement;
      var elementName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      newElement = doc.createElementNS(namespaceURI,qualifiedName);
      elementName = newElement.tagName;

      assertEquals("throw_Equals",qualifiedName,elementName);

},
/**
*
Document.createElementNS with an empty qualified name should cause an INVALID_CHARACTER_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrElNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
*/
createElementNS06 : function () {
   var success;
    if(checkInitialization(builder, "createElementNS06") != null) return;
    var namespaceURI = "http://www.example.com/";
      var qualifiedName;
      var doc;
      var done;
      var newElement;
      var charact;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");

	{
		success = false;
		try {
            newElement = doc.createElementNS(namespaceURI,"");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
	The method createAttributeNS creates an attribute of the given qualified name and namespace URI

	Invoke the createAttributeNS method on this Document object with a null
	namespaceURI, and a qualifiedName without a prefix.  This should return a valid Attr
	node object.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
*/
documentcreateattributeNS01 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateattributeNS01") != null) return;
    var doc;
      var attribute;
      var namespaceURI = null;

      var qualifiedName = "test";
      var name;
      var nodeName;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      attribute = doc.createAttributeNS(namespaceURI,qualifiedName);
      nodeName = attribute.nodeName;

      nodeValue = attribute.nodeValue;

      assertEquals("documentcreateattributeNS01","test",nodeName);

},
/**
*
	The method createAttributeNS creates an attribute of the given qualified name and namespace URI

	Invoke the createAttributeNS method on this Document object with a valid values for
	namespaceURI, and a qualifiedName as below.  This should return a valid Attr node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
*/
documentcreateattributeNS02 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateattributeNS02") != null) return;
    var doc;
      var attribute1;
      var attribute2;
      var name;
      var nodeName;
      var nodeValue;
      var prefix;
      var namespaceURI;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      attribute1 = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:xml");
      name = attribute1.name;

      nodeName = attribute1.nodeName;

      nodeValue = attribute1.nodeValue;

      prefix = attribute1.prefix;

      namespaceURI = attribute1.namespaceURI;

      assertEquals("documentcreateattributeNS02_att1_name","xml:xml",name);
       assertEquals("documentcreateattributeNS02_att1_nodeName","xml:xml",nodeName);
       assertEquals("documentcreateattributeNS02_att1_nodeValue","",nodeValue);
       assertEquals("documentcreateattributeNS02_att1_prefix","xml",prefix);
       assertEquals("documentcreateattributeNS02_att1_namespaceURI","http://www.w3.org/XML/1998/namespace",namespaceURI);
       attribute2 = doc.createAttributeNS("http://www.w3.org/2000/xmlns/","xmlns");
      name = attribute2.name;

      nodeName = attribute2.nodeName;

      nodeValue = attribute2.nodeValue;

      prefix = attribute2.prefix;

      namespaceURI = attribute2.namespaceURI;

      assertEquals("documentcreateattributeNS02_att2_name","xmlns",name);
       assertEquals("documentcreateattributeNS02_att2_nodeName","xmlns",nodeName);
       assertEquals("documentcreateattributeNS02_att2_nodeValue","",nodeValue);
       assertEquals("documentcreateattributeNS02_att2_namespaceURI","http://www.w3.org/2000/xmlns/",namespaceURI);

},
/**
*

	The method createAttributeNS raises an INVALID_CHARACTER_ERR if the specified

	qualified name contains an illegal character



	Invoke the createAttributeNS method on this Document object with a valid value for

	namespaceURI, and qualifiedNames that contain illegal characters.  Check if the an

	INVALID_CHARACTER_ERR was thrown.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
*/
documentcreateattributeNS03 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateattributeNS03") != null) return;
    var doc;
      var attribute;
      var namespaceURI = "http://www.w3.org/DOM/Test/Level2";
      var qualifiedName;
      qualifiedNames = new Array();
      qualifiedNames[0] = "/";
      qualifiedNames[1] = "//";
      qualifiedNames[2] = "\\";
      qualifiedNames[3] = ";";
      qualifiedNames[4] = "&";
      qualifiedNames[5] = "*";
      qualifiedNames[6] = "]]";
      qualifiedNames[7] = ">";
      qualifiedNames[8] = "<";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      for(var indexN1005A = 0;indexN1005A < qualifiedNames.length; indexN1005A++) {
      qualifiedName = qualifiedNames[indexN1005A];

	{
		success = false;
		try {
            attribute = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("documentcreateattributeNS03",success);
	}

	}

},
/**
*

	The method createAttributeNS raises a NAMESPACE_ERR if the specified qualified name

	is malformed.



	Invoke the createAttributeNS method on this Document object with a valid value for

	namespaceURI, and malformed qualifiedNames.  Check if the a NAMESPACE_ERR was thrown.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
*/
documentcreateattributeNS04 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateattributeNS04") != null) return;
    var doc;
      var attribute;
      var namespaceURI = "http://www.w3.org/DOM/Test/Level2";
      var qualifiedName;
      qualifiedNames = new Array();
      qualifiedNames[0] = "_:";
      qualifiedNames[1] = ":0a";
      qualifiedNames[2] = ":";
      qualifiedNames[3] = "a:b:c";
      qualifiedNames[4] = "_::a";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      for(var indexN1004E = 0;indexN1004E < qualifiedNames.length; indexN1004E++) {
      qualifiedName = qualifiedNames[indexN1004E];

	{
		success = false;
		try {
            attribute = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("documentcreateattributeNS04",success);
	}

	}

},
/**
*
	The method createAttributeNS raises a NAMESPACE_ERR if the qualifiedName has a prefix and
	the namespaceURI is null.

	Invoke the createAttributeNS method on a new Document object with a null value for
	namespaceURI, and a valid qualifiedName.  Check if a NAMESPACE_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
*/
documentcreateattributeNS05 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateattributeNS05") != null) return;
    var doc;
      var newDoc;
      var docType = null;

      var domImpl;
      var attribute;
      var namespaceURI = null;

      var qualifiedName = "abc:def";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","dom:doc",docType);

	{
		success = false;
		try {
            attribute = newDoc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("documentcreateattributeNS05",success);
	}

},
/**
*
	The method createAttributeNS raises a NAMESPACE_ERR if the qualifiedName has a prefix that
	is "xml" and the namespaceURI is different from "http://www.w3.org/XML/1998/namespace".

	Invoke the createAttributeNS method on a new DOMImplementation object with  the qualifiedName
	as xml:root and namespaceURI as http://www.w3.org/XML/1998 /namespace.
	Check if the NAMESPACE_ERR exception is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
*/
documentcreateattributeNS06 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateattributeNS06") != null) return;
    var doc;
      var newDoc;
      var docType = null;

      var domImpl;
      var attribute;
      var namespaceURI = "http://www.w3.org/XML/1998 /namespace";
      var qualifiedName = "xml:root";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","dom:doc",docType);

	{
		success = false;
		try {
            attribute = newDoc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("documentcreateattributeNS06",success);
	}

},
/**
*

	The method createAttributeNS raises a NAMESPACE_ERR if the qualifiedName is xmlns and

	the namespaceURI is different from http://www.w3.org/2000/xmlns



	Invoke the createAttributeNS method on this DOMImplementation object with

	the qualifiedName as xmlns and namespaceURI as http://www.W3.org/2000/xmlns.

	Check if the NAMESPACE_ERR exception is thrown.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
*/
documentcreateattributeNS07 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateattributeNS07") != null) return;
    var doc;
      var attribute;
      var namespaceURI = "http://www.W3.org/2000/xmlns";
      var qualifiedName = "xmlns";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            attribute = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("documentcreateattributeNS07",success);
	}

},
/**
*

	The method createElementNS creates an element of the given valid qualifiedName and NamespaceURI.



	Invoke the createElementNS method on this Document object with a valid namespaceURI

	and qualifiedName.  Check if a valid Element object is returned with the same node attributes.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
*/
documentcreateelementNS01 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateelementNS01") != null) return;
    var doc;
      var element;
      var namespaceURI = "http://www.w3.org/DOM/Test/level2";
      var qualifiedName = "XML:XML";
      var nodeName;
      var nsURI;
      var localName;
      var prefix;
      var tagName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS(namespaceURI,qualifiedName);
      nodeName = element.nodeName;

      nsURI = element.namespaceURI;

      localName = element.localName;

      prefix = element.prefix;

      tagName = element.tagName;

      assertEquals("documentcreateelementNS01_nodeName","XML:XML",nodeName);
       assertEquals("documentcreateelementNS01_namespaceURI","http://www.w3.org/DOM/Test/level2",nsURI);
       assertEquals("documentcreateelementNS01_localName","XML",localName);
       assertEquals("documentcreateelementNS01_prefix","XML",prefix);
       assertEquals("documentcreateelementNS01_tagName","XML:XML",tagName);

},
/**
*

	The method createElementNS creates an element of the given valid qualifiedName and NamespaceURI.



	Invoke the createElementNS method on this Document object with null values for namespaceURI,

	and a qualifiedName with an invalid character and check if an INVALID_CHARACTER_ERR is thrown.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
*/
documentcreateelementNS02 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateelementNS02") != null) return;
    var doc;
      var element;
      var namespaceURI = null;

      var qualifiedName = "^^";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            element = doc.createElementNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("documentcreateelementNS02",success);
	}

},
/**
*

	The method createElementNS raises a NAMESPACE_ERR if the qualifiedName has a prefix and

	the namespaceURI is null.



	Invoke the createElementNS method on a new Document object with a null value for

	namespaceURI, and a valid qualifiedName.  Check if a NAMESPACE_ERR is thrown.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
*/
documentcreateelementNS05 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateelementNS05") != null) return;
    var doc;
      var element;
      var namespaceURI = null;

      var qualifiedName = "null:xml";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            element = doc.createElementNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("documentcreateelementNS05",success);
	}

},
/**
*
    The method createElementNS raises a NAMESPACE_ERR if the qualifiedName
    has a prefix that is "xml" and the namespaceURI is different
    from http://www.w3.org/XML/1998/namespace

	Invoke the createElementNS method on this DOMImplementation object with
	the qualifiedName as xml:root and namespaceURI as http://www.w3.org/xml/1998/namespace
	Check if the NAMESPACE_ERR exception is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
*/
documentcreateelementNS06 : function () {
   var success;
    if(checkInitialization(builder, "documentcreateelementNS06") != null) return;
    var doc;
      var newDoc;
      var docType = null;

      var domImpl;
      var element;
      var namespaceURI = "http://www.w3.org/xml/1998/namespace ";
      var qualifiedName = "xml:root";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","dom:doc",docType);

	{
		success = false;
		try {
            element = newDoc.createElementNS(namespaceURI,qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("documentcreateelementNS06",success);
	}

},
/**
*

	The method getElementById returns the element whose ID is given by elementId.

	If not such element exists, returns null.



	Invoke the getElementById method on this Document object with an invalid elementId.

	This should return a null element.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBId
*/
documentgetelementbyid01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetelementbyid01") != null) return;
    var doc;
      var element;
      var elementId = "---";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.getElementById(elementId);
      assertNull("documentgetelementbyid01",element);

},
/**
*
	The method getElementsByTagNameNS returns a NodeList of all the Elements with
	a given local name and namespace URI in the order in which they are encountered
	in a preorder traversal of the Document tree.

	Invoke the getElementsByTagNameNS method on a new Document object with the values of
	namespaceURI=* and localName=*.  This should return a nodeList of 1 item.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
documentgetelementsbytagnameNS01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetelementsbytagnameNS01") != null) return;
    var doc;
      var newDoc;
      var docType = null;

      var domImpl;
      var childList;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument(nullNS,"root",docType);
      childList = newDoc.getElementsByTagNameNS("*","*");
      assertSize("documentgetelementsbytagnameNS01",1,childList);

},
/**
*
	The method getElementsByTagNameNS returns a NodeList of all the Elements with
	a given local name and namespace URI in the order in which they are encountered
	in a preorder traversal of the Document tree.


	Create a new element having a local name="employeeId" belonging to the namespace "test"
	and append it to this document.  Invoke the getElementsByTagNameNS method on a this
	Document object with the values of namespaceURI=* and localName="elementId".  This
	should return a nodeList of 6 item.  Check the length of the nodeList returned.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
documentgetelementsbytagnameNS02 : function () {
   var success;
    if(checkInitialization(builder, "documentgetelementsbytagnameNS02") != null) return;
    var doc;
      var docElem;
      var element;
      var childList;
      var appendedChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      element = doc.createElementNS("test","employeeId");
      appendedChild = docElem.appendChild(element);
      childList = doc.getElementsByTagNameNS("*","employeeId");
      assertSize("documentgetelementsbytagnameNS02",6,childList);

},
/**
*
	The method getElementsByTagNameNS returns a NodeList of all the Elements with
	a given local name and namespace URI in the order in which they are encountered
	in a preorder traversal of the Document tree.

	Invoke the getElementsByTagNameNS method on a new Document object with the values of
	namespaceURI=** and localName=**.  This should return a nodeList of 0 items.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
documentgetelementsbytagnameNS03 : function () {
   var success;
    if(checkInitialization(builder, "documentgetelementsbytagnameNS03") != null) return;
    var doc;
      var childList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("**","*");
      assertSize("documentgetelementsbytagnameNS03",0,childList);

},
/**
*
	The method getElementsByTagNameNS returns a NodeList of all the Elements with
	a given local name and namespace URI in the order in which they are encountered
	in a preorder traversal of the Document tree.

	Invoke the getElementsByTagNameNS method on a new Document object with the values of
	namespaceURI="null" and localName="0".  This should return a nodeList of 0 items.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
documentgetelementsbytagnameNS04 : function () {
   var success;
    if(checkInitialization(builder, "documentgetelementsbytagnameNS04") != null) return;
    var doc;
      var childList;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS(nullNS,"0");
      assertSize("documentgetelementsbytagnameNS04",0,childList);

},
/**
*
	The method getElementsByTagNameNS returns a NodeList of all the Elements with
	a given local name and namespace URI in the order in which they are encountered
	in a preorder traversal of the Document tree.


	Invoke the getElementsByTagNameNS method on a this Document object with the
	values of namespaceURI=null and localName="elementId".  This
	should return a nodeList of 0 item.  Check the length of the nodeList returned.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
documentgetelementsbytagnameNS05 : function () {
   var success;
    if(checkInitialization(builder, "documentgetelementsbytagnameNS05") != null) return;
    var doc;
      var childList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("null","elementId");
      assertSize("documentgetelementsbytagnameNS05",0,childList);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, import the attribute, "street" of the second
	element node, from a list of nodes whose local names are "address" and namespaceURI
	"http://www.nist.gov" into the same document.  Check the parentNode, nodeName,
	nodeType and nodeValue of the imported node to verify if it has been imported correctly.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode01 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode01") != null) return;
    var doc;
      var element;
      var attr;
      var childList;
      var importedAttr;
      var nodeName;
      var nodeType;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = childList.item(1);
      attr = element.getAttributeNode("street");
      importedAttr = doc.importNode(attr,false);
      nodeName = importedAttr.nodeName;

      nodeValue = importedAttr.nodeValue;

      nodeType = importedAttr.nodeType;

      assertEquals("documentimportnode01_nodeName","street",nodeName);
       assertEquals("documentimportnode01_nodeType",2,nodeType);
       assertEquals("documentimportnode01_nodeValue","Yes",nodeValue);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=false, import the attribute, "emp:zone" of the
	element node which is retreived by its elementId="CANADA", into the another document.
	Check the parentNode, nodeName, nodeType and nodeValue of the imported node to
	verify if it has been imported correctly.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode02 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode02") != null) return;
    var doc;
      var docImported;
      var element;
      var attr;
      var importedAttr;
      var nodeName;
      var nodeType;
      var nodeValue;
      var addresses;
      var attrsParent;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var docImportedRef = null;
      if (typeof(this.docImported) != 'undefined') {
        docImportedRef = this.docImported;
      }
      docImported = load(docImportedRef, "docImported", "staff");
      addresses = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = addresses.item(1);
      attr = element.getAttributeNodeNS("http://www.nist.gov","zone");
      importedAttr = docImported.importNode(attr,false);
      nodeName = importedAttr.nodeName;

      nodeType = importedAttr.nodeType;

      nodeValue = importedAttr.nodeValue;

      attrsParent = importedAttr.parentNode;

      assertNull("documentimportnode02_parentNull",attrsParent);
    assertEquals("documentimportnode02_nodeName","emp:zone",nodeName);
       assertEquals("documentimportnode02_nodeType",2,nodeType);
       assertEquals("documentimportnode02_nodeValue","CANADA",nodeValue);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=false, import the default Attribute attribute,
	"defaultAttr" of the second element node whose namespaceURI="http://www.nist.gov" and
	localName="defaultAttr", into the same document.
	Check the parentNode, nodeName, nodeType and nodeValue of the imported node to
	verify if it has been imported correctly.
* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode03 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode03") != null) return;
    var doc;
      var element;
      var attr;
      var childList;
      var importedAttr;
      var nodeName;
      var nodeType;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");
      element = childList.item(1);
      attr = element.getAttributeNode("defaultAttr");
      importedAttr = doc.importNode(attr,false);
      nodeName = importedAttr.nodeName;

      nodeValue = importedAttr.nodeValue;

      nodeType = importedAttr.nodeType;

      assertEquals("documentimportnode03_nodeName","defaultAttr",nodeName);
       assertEquals("documentimportnode03_nodeType",2,nodeType);
       assertEquals("documentimportnode03_nodeValue","defaultVal",nodeValue);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, import the default Attribute attribute,
	"defaultAttr" of the second element node whose namespaceURI="http://www.nist.gov" and
	localName="defaultAttr", into a new document.
	Check the parentNode, nodeName, nodeType and nodeValue of the imported node to
	verify if it has been imported correctly.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode04 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode04") != null) return;
    var doc;
      var newDoc;
      var docType = null;

      var domImpl;
      var element;
      var attr;
      var childList;
      var importedAttr;
      var nodeName;
      var nodeType;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","l2:root",docType);
      childList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");
      element = childList.item(1);
      attr = element.getAttributeNode("defaultAttr");
      importedAttr = newDoc.importNode(attr,true);
      nodeName = importedAttr.nodeName;

      nodeValue = importedAttr.nodeValue;

      nodeType = importedAttr.nodeType;

      assertEquals("documentimportnode04_nodeName","defaultAttr",nodeName);
       assertEquals("documentimportnode04_nodeType",2,nodeType);
       assertEquals("documentimportnode04_nodeValue","defaultVal",nodeValue);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=false, import a newly created attribute node,
	into the another document.
	Check the nodeName, nodeType and nodeValue namespaceURI of the imported node to
	verify if it has been imported correctly.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode05 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode05") != null) return;
    var doc;
      var docImported;
      var attr;
      var importedAttr;
      var nodeName;
      var nodeType;
      var nodeValue;
      var namespaceURI;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var docImportedRef = null;
      if (typeof(this.docImported) != 'undefined') {
        docImportedRef = this.docImported;
      }
      docImported = load(docImportedRef, "docImported", "staff");
      attr = doc.createAttributeNS("http://www.w3.org/DOM/Test","a_:b0");
      importedAttr = docImported.importNode(attr,false);
      nodeName = importedAttr.nodeName;

      nodeValue = importedAttr.nodeValue;

      nodeType = importedAttr.nodeType;

      namespaceURI = importedAttr.namespaceURI;

      assertEquals("documentimportnode05_nodeName","a_:b0",nodeName);
       assertEquals("documentimportnode05_nodeType",2,nodeType);
       assertEquals("documentimportnode05_nodeValue","",nodeValue);
       assertEquals("documentimportnode05_namespaceURI","http://www.w3.org/DOM/Test",namespaceURI);

},
/**
*
	The importNode method imports a node from another document to this document.
	A NOT_SUPPORTED_ERR is raised if the type of node being imported is
	not supported

	Using the method importNode with deep=false, try to import this document object to itself.
	Since Document nodes cannot be imported, a NOT_SUPPORTED_ERR should be raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode06 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode06") != null) return;
    var doc;
      var docImported;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

	{
		success = false;
		try {
            docImported = doc.importNode(doc,false);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
*
	The importNode method imports a node from another document to this document.
	A NOT_SUPPORTED_ERR is raised if the type of node being imported is
	not supported

	Using the method importNode with deep=true, try to import this Document's
	DocumentType object. Since DocumentType nodes cannot be imported, a
	NOT_SUPPORTED_ERR should be raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode07 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode07") != null) return;
    var doc;
      var imported;
      var docType;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;


	{
		success = false;
		try {
            imported = doc.importNode(docType,true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
*
	The importNode method imports a node from another document to this document.
	A NOT_SUPPORTED_ERR is raised if the type of node being imported is
	not supported

	Using the method importNode with deep=true, try to import a newly created DOcumentType
	node. Since DocumentType nodes cannot be imported, a NOT_SUPPORTED_ERR should be raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
documentimportnode08 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode08") != null) return;
    var doc;
      var imported;
      var docType;
      var domImpl;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docType = domImpl.createDocumentType("test:root",nullNS,nullNS);

	{
		success = false;
		try {
            imported = doc.importNode(docType,true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=false, import a newly created DocumentFragment node
	with the first address element from this Document appended to it into this document.
	Since deep=false, an empty DocumentFragment should be returned

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode09 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode09") != null) return;
    var doc;
      var docFragment;
      var childList;
      var success;
      var addressNode;
      var appendedChild;
      var importedDocFrag;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docFragment = doc.createDocumentFragment();
      childList = doc.getElementsByTagNameNS("*","address");
      addressNode = childList.item(0);
      appendedChild = docFragment.appendChild(addressNode);
      importedDocFrag = doc.importNode(docFragment,false);
      success = importedDocFrag.hasChildNodes();
      assertFalse("documentimportnode09",success);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=false, import a newly created DocumentFragment node
	with the first address element from this Document appended to it into this document.
	Since deep=true, a DocumentFragment with its child should be returned

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode10 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode10") != null) return;
    var doc;
      var docFragment;
      var childList;
      var success;
      var addressNode;
      var appendedChild;
      var importedDocFrag;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docFragment = doc.createDocumentFragment();
      childList = doc.getElementsByTagNameNS("*","address");
      addressNode = childList.item(0);
      appendedChild = docFragment.appendChild(addressNode);
      importedDocFrag = doc.importNode(docFragment,true);
      success = importedDocFrag.hasChildNodes();
      assertTrue("documentimportnode10",success);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=false, import this Document's documentElement
	node.  Verify if the node has been imported correctly by its nodeName atttribute and
	if the original document is not altered by checking if hasChildNodes returns false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode11 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode11") != null) return;
    var doc;
      var docElement;
      var imported;
      var success;
      var nodeNameOrig;
      var nodeNameImported;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElement = doc.documentElement;

      imported = doc.importNode(docElement,false);
      success = imported.hasChildNodes();
      assertFalse("documentimportnode11",success);
nodeNameImported = imported.nodeName;

      nodeNameOrig = docElement.nodeName;

      assertEquals("documentimportnode11_NodeName",nodeNameImported,nodeNameOrig);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, import the first address element node of this
	Document.  Verify if the node has been imported correctly by checking the length of the
	this elements childNode list before and after the import.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode12 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode12") != null) return;
    var doc;
      var childList;
      var imported;
      var addressElem;
      var addressElemChildren;
      var importedChildren;
      var addressElemLen;
      var importedLen;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("*","address");
      addressElem = childList.item(0);
      imported = doc.importNode(addressElem,true);
      addressElemChildren = addressElem.childNodes;

      importedChildren = imported.childNodes;

      addressElemLen = addressElemChildren.length;

      importedLen = importedChildren.length;

      assertEquals("documentimportnode12",importedLen,addressElemLen);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=false, import the first employee element node of this
	Document.  Verify if the node has been imported correctly by checking the length of the
	this elements childNode list before and after the import.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode13 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode13") != null) return;
    var doc;
      var childList;
      var imported;
      var importedList;
      var employeeElem;
      var importedLen;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("*","employee");
      employeeElem = childList.item(0);
      imported = doc.importNode(employeeElem,false);
      importedList = imported.childNodes;

      importedLen = importedList.length;

      assertEquals("documentimportnode13",0,importedLen);

},
/**
*
	Using the method importNode with deep=true, import the fourth employee element node of this
	Document.  Verify if the node has been imported correctly by checking
	if the default attribute present on this node has not been imported
	and an explicit attribute has been imported.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=402
*/
documentimportnode14 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode14") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var nullDocType = null;

      var childList;
      var imported;
      var employeeElem;
      var attrNode;
      var attrValue;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("*","employee");
      employeeElem = childList.item(3);
      domImpl = load(null, "doc", "staffNS").implementation;
newDoc = domImpl.createDocument(nullNS,"staff",nullDocType);
      imported = newDoc.importNode(employeeElem,true);
      attrNode = imported.getAttributeNodeNS(nullNS,"defaultAttr");
      assertNull("defaultAttrNotImported",attrNode);

    attrValue = imported.getAttributeNS("http://www.w3.org/2000/xmlns/","emp");
      assertEquals("explicitAttrImported","http://www.nist.gov",attrValue);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, import a newly created Text node for this
	Document.  Verify if the node has been imported correctly by checking the value of the
	imported text node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode15 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode15") != null) return;
    var doc;
      var docImp;
      var textImport;
      var textToImport;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var docImpRef = null;
      if (typeof(this.docImp) != 'undefined') {
        docImpRef = this.docImp;
      }
      docImp = load(docImpRef, "docImp", "staffNS");
      textToImport = doc.createTextNode("Document.importNode test for a TEXT_NODE");
      textImport = doc.importNode(textToImport,true);
      nodeValue = textImport.nodeValue;

      assertEquals("documentimportnode15","Document.importNode test for a TEXT_NODE",nodeValue);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, import a newly created Comment node for this
	Document.  Verify if the node has been imported correctly by checking the value of the
	imported Comment node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode17 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode17") != null) return;
    var doc;
      var docImp;
      var commentImport;
      var commentToImport;
      var nodeValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var docImpRef = null;
      if (typeof(this.docImp) != 'undefined') {
        docImpRef = this.docImp;
      }
      docImp = load(docImpRef, "docImp", "staffNS");
      commentToImport = doc.createComment("Document.importNode test for a COMMENT_NODE");
      commentImport = doc.importNode(commentToImport,true);
      nodeValue = commentImport.nodeValue;

      assertEquals("documentimportnode17","Document.importNode test for a COMMENT_NODE",nodeValue);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, import a newly created PI node for this
	Document.  Verify if the node has been imported correctly by checking the PITarget and
	PIData values of the imported PI node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode18 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode18") != null) return;
    var doc;
      var docImp;
      var piImport;
      var piToImport;
      var piData;
      var piTarget;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var docImpRef = null;
      if (typeof(this.docImp) != 'undefined') {
        docImpRef = this.docImp;
      }
      docImp = load(docImpRef, "docImp", "staffNS");
      piToImport = doc.createProcessingInstruction("Target","Data");
      piImport = doc.importNode(piToImport,false);
      piTarget = piImport.target;

      piData = piImport.data;

      assertEquals("documentimportnode18_Target","Target",piTarget);
       assertEquals("documentimportnode18_Data","Data",piData);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true/false, import a entity nodes ent2 and ent6
	from this document to a new document object.  Verify if the nodes have been
	imported correctly by checking the nodeNames of the imported nodes and public and system ids.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode19 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode19") != null) return;
    var doc;
      var docTypeNull = null;

      var docImp;
      var domImpl;
      var docType;
      var nodeMap;
      var entity2;
      var entity6;
      var entityImp2;
      var entityImp6;
      var nodeName;
      var systemId;
      var notationName;
      var nodeNameImp;
      var systemIdImp;
      var notationNameImp;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docType = doc.doctype;

      docImp = domImpl.createDocument("http://www.w3.org/DOM/Test","a:b",docTypeNull);
      nodeMap = docType.entities;

      assertNotNull("entitiesNotNull",nodeMap);
entity2 = nodeMap.getNamedItem("ent2");
      entity6 = nodeMap.getNamedItem("ent6");
      entityImp2 = docImp.importNode(entity2,false);
      entityImp6 = docImp.importNode(entity6,true);
      nodeName = entity2.nodeName;

      nodeNameImp = entityImp2.nodeName;

      assertEquals("documentimportnode19_Ent2NodeName",nodeName,nodeNameImp);
       nodeName = entity6.nodeName;

      nodeNameImp = entityImp6.nodeName;

      assertEquals("documentimportnode19_Ent6NodeName",nodeName,nodeNameImp);
       systemId = entity2.systemId;

      systemIdImp = entityImp2.systemId;

      assertEquals("documentimportnode19_Ent2SystemId",systemId,systemIdImp);
       systemId = entity6.systemId;

      systemIdImp = entityImp6.systemId;

      assertEquals("documentimportnode19_Ent6SystemId",systemId,systemIdImp);
       notationName = entity2.notationName;

      notationNameImp = entityImp2.notationName;

      assertEquals("documentimportnode19_Ent2NotationName",notationName,notationNameImp);
       notationName = entity6.notationName;

      notationNameImp = entityImp6.notationName;

      assertEquals("documentimportnode19_Ent6NotationName",notationName,notationNameImp);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, import a entity node ent4
	from this document to a new document object.  The replacement text of this entity is an element
	node, a cdata node and a pi.  Verify if the nodes have been
	imported correctly by checking the nodeNames of the imported element node, the data for the
	cdata nodes and the PItarget and PIData for the pi nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode20 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode20") != null) return;
    var doc;
      var docImp;
      var domImpl;
      var docType;
      var docTypeNull = null;

      var nodeMap;
      var entity4;
      var entityImp4;
      var element;
      var cdata;
      var pi;
      var childList;
      var elemchildList;
      var ent4Name;
      var ent4ImpName;
      var cdataVal;
      var piTargetVal;
      var piDataVal;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docType = doc.doctype;

      docImp = domImpl.createDocument("http://www.w3.org/DOM/Test","a:b",docTypeNull);
      nodeMap = docType.entities;

      entity4 = nodeMap.getNamedItem("ent4");
      entityImp4 = docImp.importNode(entity4,true);
      childList = entityImp4.childNodes;

      element = childList.item(0);
      elemchildList = element.childNodes;

      cdata = elemchildList.item(0);
      pi = childList.item(1);
      ent4Name = entity4.nodeName;

      ent4ImpName = entityImp4.nodeName;

      cdataVal = cdata.data;

      piTargetVal = pi.target;

      piDataVal = pi.data;

      assertEquals("documentimportnode20_Ent4NodeName",ent4Name,ent4ImpName);
       assertEquals("documentimportnode20_Cdata","Element data",cdataVal);
       assertEquals("documentimportnode20_PITarget","PItarget",piTargetVal);
       assertEquals("documentimportnode20_PIData","PIdata",piDataVal);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true, retreive the entity refs present in the
	second element node whose tagName is address and import these nodes into another document.
	Verify if the nodes have been imported correctly by checking the nodeNames of the
	imported nodes, since they are imported into a new document which doesnot have thes defined,
	the imported nodes should not have any children.
	Now import the entityRef nodes into the same document and verify if the nodes have been
	imported correctly by checking the nodeNames of the imported nodes, and by checking the
	value of the replacement text of the imported nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode21 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode21") != null) return;
    var doc;
      var docTypeNull = null;

      var docImp;
      var domImpl;
      var addressList;
      var addressChildList;
      var element;
      var entRef2;
      var entRefImp2;
      var entRef3;
      var entRefImp3;
      var nodeName2;
      var nodeName3;
      var nodeNameImp2;
      var nodeNameImp3;
      var nodes;
      var nodeImp3;
      var nodeImp2;
      var nodeValueImp2;
      var nodeValueImp3;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docImp = domImpl.createDocument("http://www.w3.org/DOM/Test","a:b",docTypeNull);
      addressList = doc.getElementsByTagName("address");
      element = addressList.item(1);
      addressChildList = element.childNodes;

      entRef2 = addressChildList.item(0);
      entRef3 = addressChildList.item(2);
      entRefImp2 = docImp.importNode(entRef2,true);
      entRefImp3 = docImp.importNode(entRef3,false);
      nodeName2 = entRef2.nodeName;

      nodeName3 = entRef3.nodeName;

      nodeNameImp2 = entRefImp2.nodeName;

      nodeNameImp3 = entRefImp3.nodeName;

      assertEquals("documentimportnode21_Ent2NodeName",nodeName2,nodeNameImp2);
       assertEquals("documentimportnode21_Ent3NodeName",nodeName3,nodeNameImp3);
       entRefImp2 = doc.importNode(entRef2,true);
      entRefImp3 = doc.importNode(entRef3,false);
      nodes = entRefImp2.childNodes;

      nodeImp2 = nodes.item(0);
      nodeValueImp2 = nodeImp2.nodeValue;

      nodes = entRefImp3.childNodes;

      nodeImp3 = nodes.item(0);
      nodeValueImp3 = nodeImp3.nodeValue;

      assertEquals("documentimportnode21_Ent2NodeValue","1900 Dallas Road",nodeValueImp2);
       assertEquals("documentimportnode21_Ent3Nodevalue","Texas",nodeValueImp3);

},
/**
*
	The importNode method imports a node from another document to this document.
	The returned node has no parent; (parentNode is null). The source node is not
	altered or removed from the original document but a new copy of the source node
	is created.

	Using the method importNode with deep=true/false, import two notaiton nodes into the
	same and different documnet objects.  In each case check if valid public and systemids
	are returned if any and if none, check if a null value was returned.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
documentimportnode22 : function () {
   var success;
    if(checkInitialization(builder, "documentimportnode22") != null) return;
    var doc;
      var docTypeNull = null;

      var docImp;
      var domImpl;
      var docType;
      var nodeMap;
      var notation1;
      var notation2;
      var notationImp1;
      var notationImp2;
      var notationImpNew1;
      var notationImpNew2;
      var publicId1;
      var publicId1Imp;
      var publicId1NewImp;
      var publicId2Imp;
      var publicId2NewImp;
      var systemId1Imp;
      var systemId1NewImp;
      var systemId2;
      var systemId2Imp;
      var systemId2NewImp;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docType = doc.doctype;

      docImp = domImpl.createDocument("http://www.w3.org/DOM/Test","a:b",docTypeNull);
      nodeMap = docType.notations;

      assertNotNull("notationsNotNull",nodeMap);
notation1 = nodeMap.getNamedItem("notation1");
      notation2 = nodeMap.getNamedItem("notation2");
      notationImp1 = doc.importNode(notation1,true);
      notationImp2 = doc.importNode(notation2,false);
      notationImpNew1 = docImp.importNode(notation1,false);
      notationImpNew2 = docImp.importNode(notation2,true);
      publicId1 = notation1.publicId;

      publicId1Imp = notation1.publicId;

      publicId1NewImp = notation1.publicId;

      systemId1Imp = notation1.systemId;

      systemId1NewImp = notation1.systemId;

      publicId2Imp = notation2.publicId;

      publicId2NewImp = notation2.publicId;

      systemId2 = notation2.systemId;

      systemId2Imp = notation2.systemId;

      systemId2NewImp = notation2.systemId;

      assertEquals("documentimportnode22_N1PID",publicId1,publicId1Imp);
       assertEquals("documentimportnode22_N1NPID",publicId1,publicId1NewImp);
       assertNull("documentimportnode22_N1SID",systemId1Imp);
    assertNull("documentimportnode22_N1NSID",systemId1NewImp);
    assertEquals("documentimportnode22_N2SID",systemId2,systemId2Imp);
       assertEquals("documentimportnode22_N2NSID",systemId2,systemId2NewImp);
       assertNull("documentimportnode22_N2PID",publicId2Imp);
    assertNull("documentimportnode22_N2NPID",publicId2Imp);

},
/**
*
    The method getInternalSubset() returns the internal subset as a string.

    Create a new DocumentType node with null values for publicId and systemId.
    Verify that its internal subset is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-internalSubset
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
documenttypeinternalSubset01 : function () {
   var success;
    if(checkInitialization(builder, "documenttypeinternalSubset01") != null) return;
    var doc;
      var docType;
      var domImpl;
      var internal;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docType = domImpl.createDocumentType("l2:root",nullNS,nullNS);
      internal = docType.internalSubset;

      assertNull("internalSubsetNull",internal);

},
/**
*
    The method getInternalSubset() returns the public identifier of the external subset.

    Create a new DocumentType node with the value "PUB" for its publicId.
    Check the value of the publicId attribute using getPublicId().

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-publicId
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
documenttypepublicid01 : function () {
   var success;
    if(checkInitialization(builder, "documenttypepublicid01") != null) return;
    var doc;
      var docType;
      var domImpl;
      var publicId;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docType = domImpl.createDocumentType("l2:root","PUB",nullNS);
      publicId = docType.publicId;

      assertEquals("documenttypepublicid01","PUB",publicId);

},
/**
*
    The method getInternalSubset() returns the public identifier of the external subset.

    Create a new DocumentType node with the value "SYS" for its systemId and PUB for
    its publicId.  Check the value of the systemId and pbulicId attributes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-systemId
*/
documenttypesystemid01 : function () {
   var success;
    if(checkInitialization(builder, "documenttypesystemid01") != null) return;
    var doc;
      var docType;
      var domImpl;
      var publicId;
      var systemId;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
docType = domImpl.createDocumentType("l2:root","PUB","SYS");
      publicId = docType.publicId;

      systemId = docType.systemId;

      assertEquals("documenttypepublicid01","PUB",publicId);
       assertEquals("documenttypesystemid01","SYS",systemId);

},
/**
*

    The createDocument method with valid arguments, should create a DOM Document of

    the specified type.



    Call the createDocument on this DOMImplementation with

    createDocument ("http://www.w3.org/DOMTest/L2",see the array below for valid QNames,null).

    Check if the returned Document object is is empty with no Document Element.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
*/
domimplementationcreatedocument03 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationcreatedocument03") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var docType = null;

      var namespaceURI = "http://www.w3.org/DOMTest/L2";
      var qualifiedName;
      qualifiedNames = new Array();
      qualifiedNames[0] = "_:_";
      qualifiedNames[1] = "_:h0";
      qualifiedNames[2] = "_:test";
      qualifiedNames[3] = "l_:_";
      qualifiedNames[4] = "ns:_0";
      qualifiedNames[5] = "ns:a0";
      qualifiedNames[6] = "ns0:test";
      qualifiedNames[7] = "a.b:c";
      qualifiedNames[8] = "a-b:c";
      qualifiedNames[9] = "a-b:c";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
for(var indexN1006B = 0;indexN1006B < qualifiedNames.length; indexN1006B++) {
      qualifiedName = qualifiedNames[indexN1006B];
      newDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
      assertNotNull("domimplementationcreatedocument03",newDoc);

	}

},
/**
*

	The createDocument method should throw a NAMESPACE_ERR if the qualifiedName has

	a prefix and the namespaceURI is null.



    Call the createDocument on this DOMImplementation with null namespaceURI and a

    qualifiedName that has a namespace prefix using this DOMImplementation.

    Check if the NAMESPACE_ERR is thrown.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
*/
domimplementationcreatedocument04 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationcreatedocument04") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var namespaceURI = null;

      var qualifiedName = "dom:root";
      var docType = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            newDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("domimplementationcreatedocument04",success);
	}

},
/**
*

	The createDocument method should throw a NAMESPACE_ERR if the qualifiedName has

	a prefix that is xml and the namespaceURI is different from

	http://www..w3.org/XML/1998/namespace.



	Call the createDocument on this DOMImplementation with namespaceURI that is

	http://www.w3.org/xml/1998/namespace and a qualifiedName that has the prefix xml

	Check if the NAMESPACE_ERR is thrown.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
*/
domimplementationcreatedocument05 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationcreatedocument05") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var namespaceURI = "http://www.w3.org/xml/1998/namespace";
      var qualifiedName = "xml:root";
      var docType = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            newDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("domimplementationcreatedocument05",success);
	}

},
/**
*

	The createDocument method should raise a NAMESPACE_ERR if the qualifiedName is malformed



	Invoke the createDocument method on this DOMImplementation object with null values

	for namespaceURI and docType and a malformed qualifiedName.

	The NAMESPACE_ERR should be raised.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
*/
domimplementationcreatedocument07 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationcreatedocument07") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var namespaceURI = "http://www.w3.org/DOMTest/level2";
      var docType = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;

	{
		success = false;
		try {
            newDoc = domImpl.createDocument(namespaceURI,":",docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("domimplementationcreatedocument07",success);
	}

},
/**
*
	The method createDocumentType with valid values for qualifiedName, publicId and
	systemId should create an empty DocumentType node.

	Invoke createDocument on this DOMImplementation with a valid qualifiedName and different
	publicIds and systemIds.  Check if the the DocumentType node was created with its
	ownerDocument attribute set to null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
*/
domimplementationcreatedocumenttype01 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationcreatedocumenttype01") != null) return;
    var doc;
      var domImpl;
      var newDocType;
      var ownerDocument;
      var qualifiedName = "test:root";
      var publicId;
      var systemId;
      publicIds = new Array();
      publicIds[0] = "1234";
      publicIds[1] = "test";

      systemIds = new Array();
      systemIds[0] = "";
      systemIds[1] = "test";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
for(var indexN1005D = 0;indexN1005D < publicIds.length; indexN1005D++) {
      publicId = publicIds[indexN1005D];
      for(var indexN10061 = 0;indexN10061 < systemIds.length; indexN10061++) {
      systemId = systemIds[indexN10061];
      newDocType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
      assertNotNull("domimplementationcreatedocumenttype01_newDocType",newDocType);
ownerDocument = newDocType.ownerDocument;

      assertNull("domimplementationcreatedocumenttype01_ownerDocument",ownerDocument);

	}

	}

},
/**
*

	The method createDocumentType with valid values for qualifiedName, publicId and

	systemId should create an empty DocumentType node.



	Invoke createDocument on this DOMImplementation with a different valid qualifiedNames

	and a valid publicId and systemId.  Check if the the DocumentType node was created

	with its ownerDocument attribute set to null.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
*/
domimplementationcreatedocumenttype02 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationcreatedocumenttype02") != null) return;
    var doc;
      var domImpl;
      var newDocType;
      var ownerDocument;
      var publicId = "http://www.w3.org/DOM/Test/dom2.dtd";
      var systemId = "dom2.dtd";
      var qualifiedName;
      qualifiedNames = new Array();
      qualifiedNames[0] = "_:_";
      qualifiedNames[1] = "_:h0";
      qualifiedNames[2] = "_:test";
      qualifiedNames[3] = "_:_.";
      qualifiedNames[4] = "_:a-";
      qualifiedNames[5] = "l_:_";
      qualifiedNames[6] = "ns:_0";
      qualifiedNames[7] = "ns:a0";
      qualifiedNames[8] = "ns0:test";
      qualifiedNames[9] = "ns:EEE.";
      qualifiedNames[10] = "ns:_-";
      qualifiedNames[11] = "a.b:c";
      qualifiedNames[12] = "a-b:c.j";
      qualifiedNames[13] = "a-b:c";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
for(var indexN10077 = 0;indexN10077 < qualifiedNames.length; indexN10077++) {
      qualifiedName = qualifiedNames[indexN10077];
      newDocType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
      assertNotNull("domimplementationcreatedocumenttype02_newDocType",newDocType);
ownerDocument = newDocType.ownerDocument;

      assertNull("domimplementationcreatedocumenttype02_ownerDocument",ownerDocument);

	}

},
/**
*

	The method createDocumentType should raise a INVALID_CHARACTER_ERR if the qualifiedName

	contains an illegal characters.



	Invoke createDocument on this DOMImplementation with qualifiedNames having illegal characters.

	Check if an INVALID_CHARACTER_ERR is raised in each case.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
*/
domimplementationcreatedocumenttype04 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationcreatedocumenttype04") != null) return;
    var doc;
      var domImpl;
      var newDocType;
      var publicId = "http://www.w3.org/DOM/Test/dom2.dtd";
      var systemId = "dom2.dtd";
      var qualifiedName;
      qualifiedNames = new Array();
      qualifiedNames[0] = "{";
      qualifiedNames[1] = "}";
      qualifiedNames[2] = "'";
      qualifiedNames[3] = "~";
      qualifiedNames[4] = "`";
      qualifiedNames[5] = "@";
      qualifiedNames[6] = "#";
      qualifiedNames[7] = "$";
      qualifiedNames[8] = "%";
      qualifiedNames[9] = "^";
      qualifiedNames[10] = "&";
      qualifiedNames[11] = "*";
      qualifiedNames[12] = "(";
      qualifiedNames[13] = ")";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
for(var indexN10073 = 0;indexN10073 < qualifiedNames.length; indexN10073++) {
      qualifiedName = qualifiedNames[indexN10073];

	{
		success = false;
		try {
            newDocType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("domimplementationcreatedocumenttype04",success);
	}

	}

},
/**
*

    The "feature" parameter in the

   "hasFeature(feature,version)" method is the package name

   of the feature.  Legal values are XML and HTML and CORE.

   (Test for feature core, lower case)



   Retrieve the entire DOM document and invoke its

   "load(null, "doc", "staffNS").implementation" method.  This should create a

   DOMImplementation object whose "hasFeature(feature,

   version)" method is invoked with feature equal to "core".

   The method should return a boolean "true".


* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
domimplementationfeaturecore : function () {
   var success;
    if(checkInitialization(builder, "domimplementationfeaturecore") != null) return;
    var doc;
      var domImpl;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      domImpl = doc.implementation;
state = domImpl.hasFeature("core","2.0");
assertTrue("domimplementationFeaturecoreAssert",state);

},
/**
*

    The "feature" parameter in the

   "hasFeature(feature,version)" method is the package name

   of the feature.  Legal values are XML and HTML.

   (Test for feature "xml" and version "2.0")



   Retrieve the entire DOM document and invoke its

   "load(null, "doc", "staffNS").implementation" method.  This should create a

   DOMImplementation object whose "hasFeature(feature,

   version)" method is invoked with "feature" equal to "xml".

   The method should return a boolean "true".


* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
domimplementationfeaturexmlversion2 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationfeaturexmlversion2") != null) return;
    var doc;
      var domImpl;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      domImpl = doc.implementation;
state = domImpl.hasFeature("xml","2.0");
assertTrue("domimplementationFeaturexmlVersion2Assert",state);

},
/**
*
	The method "hasFeature(feature,version)" tests if the DOMImplementation implements
	a specific feature and if so returns true.

	Call the hasFeature method on this DOMImplementation with a combination of features
	versions as below.  Valid feature names are case insensitive and versions "2.0",
	"1.0" and if the version is not specified, supporting any version of the feature
	should return true.  Check if the value returned value was true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
domimplementationhasfeature01 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationhasfeature01") != null) return;
    var doc;
      var domImpl;
      var version = "";
      var version1 = "1.0";
      var version2 = "2.0";
      var featureCore;
      var featureXML;
      var success;
      featuresXML = new Array();
      featuresXML[0] = "XML";
      featuresXML[1] = "xmL";

      featuresCore = new Array();
      featuresCore[0] = "Core";
      featuresCore[1] = "CORE";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
for(var indexN10063 = 0;indexN10063 < featuresXML.length; indexN10063++) {
      featureXML = featuresXML[indexN10063];
      success = domImpl.hasFeature(featureXML,version);
assertTrue("domimplementationhasfeature01_XML_1",success);
success = domImpl.hasFeature(featureXML,version1);
assertTrue("domimplementationhasfeature01_XML_2",success);

	}
   for(var indexN1007C = 0;indexN1007C < featuresCore.length; indexN1007C++) {
      featureCore = featuresCore[indexN1007C];
      success = domImpl.hasFeature(featureCore,version);
assertTrue("domimplementationhasfeature01_Core_1",success);
success = domImpl.hasFeature(featureCore,version1);
success = domImpl.hasFeature(featureCore,version2);
assertTrue("domimplementationhasfeature01_Core_3",success);

	}

},
/**
*
	The method "hasFeature(feature,version)" tests if the DOMImplementation implements
	a specific feature and if not returns false.

	Call the hasFeature method on this DOMImplementation with a unfimiliar values for
	feature and version.  Check if the value returned was false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
*/
domimplementationhasfeature02 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationhasfeature02") != null) return;
    var doc;
      var domImpl;
      var success;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
success = domImpl.hasFeature("Blah Blah","");
assertFalse("domimplementationhasfeature02",success);

},
/**
*
      The method getAttributeNodeNS retrieves an Attr node by local name and namespace URI.
      Create a new element node and add 2 new attribute nodes to it that have the same
      local name but different namespaceURIs and prefixes.
      Retrieve an attribute using namespace and localname and check its value, name and
      namespaceURI.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAtNodeNS
*/
elementgetattributenodens01 : function () {
   var success;
    if(checkInitialization(builder, "elementgetattributenodens01") != null) return;
    var doc;
      var element;
      var attribute1;
      var attribute2;
      var newAttribute1;
      var newAttribute2;
      var attribute;
      var attrValue;
      var attrName;
      var attNodeName;
      var attrLocalName;
      var attrNS;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("namespaceURI","root");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/Level2","l2:att");
      newAttribute1 = element.setAttributeNodeNS(attribute1);
      attribute2 = doc.createAttributeNS("http://www.w3.org/DOM/Level1","att");
      newAttribute2 = element.setAttributeNodeNS(attribute2);
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Level2","att");
      attrValue = attribute.nodeValue;

      attrName = attribute.name;

      attNodeName = attribute.nodeName;

      attrLocalName = attribute.localName;

      attrNS = attribute.namespaceURI;

      assertEquals("elementgetattributenodens01_attrValue","",attrValue);
       assertEquals("elementgetattributenodens01_attrName","l2:att",attrName);
       assertEquals("elementgetattributenodens01_attrNodeName","l2:att",attNodeName);
       assertEquals("elementgetattributenodens01_attrLocalName","att",attrLocalName);
       assertEquals("elementgetattributenodens01_attrNs","http://www.w3.org/DOM/Level2",attrNS);

},
/**
*
      The method getAttributeNodeNS retrieves an Attr node by local name and namespace URI.
      Create a new element node and add a new attribute node to it.  Using the getAttributeNodeNS,
      retrieve the newly added attribute node and check its value.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAtNodeNS
*/
elementgetattributenodens02 : function () {
   var success;
    if(checkInitialization(builder, "elementgetattributenodens02") != null) return;
    var doc;
      var element;
      var attribute;
      var newAttribute1;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("namespaceURI","root");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM/Level2","l2:att");
      newAttribute1 = element.setAttributeNodeNS(attribute);
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Level2","att");
      attrValue = attribute.nodeValue;

      assertEquals("elementgetattributenodens02","",attrValue);

},
/**
*
      The method getAttributeNodeNS retrieves an Attr node by local name and namespace URI.
      Using the getAttributeNodeNS, retrieve and verify the value of the default
      attribute node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAtNodeNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
elementgetattributenodens03 : function () {
   var success;
    if(checkInitialization(builder, "elementgetattributenodens03") != null) return;
    var doc;
      var element;
      var attribute;
      var attrValue;
      var childList;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");
      element = childList.item(1);
      attribute = element.getAttributeNodeNS(nullNS,"defaultAttr");
      attrValue = attribute.nodeValue;

      assertEquals("elementgetattributenodens03","defaultVal",attrValue);

},
/**
*
      The method getAttributeNS retrieves an attribute value by local name and namespace URI.
      Using the getAttributeNodeNS, retreive and verify the value of the default
      attribute node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAttrNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
elementgetattributens02 : function () {
   var success;
    if(checkInitialization(builder, "elementgetattributens02") != null) return;
    var doc;
      var element;
      var attrValue;
      var childList;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      childList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");
      element = childList.item(1);
      attrValue = element.getAttributeNS(nullNS,"defaultAttr");
      assertEquals("elementgetattributens02","defaultVal",attrValue);

},
/**
*

      The method getElementsByTagNameNS returns a NodeList of all the Elements with a given local

      name and namespace URI in the order in which they are encountered in a preorder traversal

      of the Document tree.

      Invoke getElementsByTagNameNS on the documentElement with values for namespaceURI '*' and

      localName '*'.  Verify if this returns a nodeList of 0 elements.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
elementgetelementsbytagnamens02 : function () {
   var success;
    if(checkInitialization(builder, "elementgetelementsbytagnamens02") != null) return;
    var doc;
      var element;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.documentElement;

      elementList = element.getElementsByTagNameNS("**","*");
      assertSize("elementgetelementsbytagnamens02",0,elementList);

},
/**
*
      Returns a NodeList of all the Elements with a given local name and namespace URI in the
      order in which they are encountered in a preorder traversal of the Document tree.
      Create a new element node ('root') and append three newly created child nodes (all have
      local name 'child' and defined in different namespaces).
      Test 1: invoke getElementsByTagNameNS to retrieve one of the children.
      Test 2: invoke getElementsByTagNameNS with the value of namespace equals to '*', and
      verify that the node list has length of 3.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
elementgetelementsbytagnamens04 : function () {
   var success;
    if(checkInitialization(builder, "elementgetelementsbytagnamens04") != null) return;
    var doc;
      var element;
      var child1;
      var child2;
      var child3;
      var appendedChild;
      var elementList;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM","root");
      child1 = doc.createElementNS("http://www.w3.org/DOM/Level1","dom:child");
      child2 = doc.createElementNS(nullNS,"child");
      child3 = doc.createElementNS("http://www.w3.org/DOM/Level2","dom:child");
      appendedChild = element.appendChild(child1);
      appendedChild = element.appendChild(child2);
      appendedChild = element.appendChild(child3);
      elementList = element.getElementsByTagNameNS(nullNS,"child");
      assertSize("elementgetelementsbytagnamens04_1",1,elementList);
elementList = element.getElementsByTagNameNS("*","child");
      assertSize("elementgetelementsbytagnamens04_2",3,elementList);

},
/**
*

      Returns a NodeList of all the Elements with a given local name and namespace URI in the

      order in which they are encountered in a preorder traversal of the Document tree.

      Invoke getElementsByTagNameNS on the documentElement with the following values:

      namespaceURI: 'http://www.altavista.com'

      localName: '*'.

      Verify if this returns a nodeList of 1 elements.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
elementgetelementsbytagnamens05 : function () {
   var success;
    if(checkInitialization(builder, "elementgetelementsbytagnamens05") != null) return;
    var doc;
      var element;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.documentElement;

      elementList = element.getElementsByTagNameNS("http://www.altavista.com","*");
      assertSize("elementgetelementsbytagnamens05",1,elementList);

},
/**
*

      The method hasAttribute returns true when an attribute with a given name is specified

      on this element or has a default value, false otherwise

      Invoke the hasAttribute method to check if the documentElement has attributres.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
elementhasattribute01 : function () {
   var success;
    if(checkInitialization(builder, "elementhasattribute01") != null) return;
    var doc;
      var element;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.documentElement;

      state = element.hasAttribute("");
      assertFalse("elementhasattribute01",state);

},
/**
*
      The method hasAttribute returns true when an attribute with a given name is specified
      on this element or has a default value, false otherwise
      Invoke the hasAttribute method to on an element with default attributes and verify if it
      returns true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
elementhasattribute02 : function () {
   var success;
    if(checkInitialization(builder, "elementhasattribute02") != null) return;
    var doc;
      var element;
      var state;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:employee");
      element = elementList.item(0);
      assertNotNull("empEmployeeNotNull",element);
state = element.hasAttribute("defaultAttr");
      assertTrue("elementhasattribute02",state);

},
/**
*
      The method hasAttribute returns true when an attribute with a given name is specified
      on this element or has a default value, false otherwise.

      Create an element Node and an attribute Node.  Invoke hasAttribute method
      to verify that there is no attribute. Append the attribute node to the element node.
      Invoke the hasAttribute method on the element and verify if it returns true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
elementhasattribute03 : function () {
   var success;
    if(checkInitialization(builder, "elementhasattribute03") != null) return;
    var doc;
      var element;
      var state;
      var attribute;
      var newAttribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElement("address");
      attribute = doc.createAttribute("domestic");
      state = element.hasAttribute("domestic");
      assertFalse("elementhasattribute03_False",state);
newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttribute("domestic");
      assertTrue("elementhasattribute03_True",state);

},
/**
*
      The method hasAttribute returns true when an attribute with a given name is specified
      on this element or has a default value, false otherwise.

      Create an element Node and an attribute Node and add the attribute node to the element.
      Invoke the hasAttribute method on the element and verify if the method returns true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
elementhasattribute04 : function () {
   var success;
    if(checkInitialization(builder, "elementhasattribute04") != null) return;
    var doc;
      var element;
      var state;
      var attribute;
      var newAttribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElement("address");
      attribute = doc.createAttribute("domestic");
      newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttribute("domestic");
      assertTrue("elementhasattribute04",state);

},
/**
*
      The method hasAttributeNS returns true when an attribute with a given local name
      and namespace
      URI is specified on this element or has a default value, false otherwise.

      Retreive the first employee element node.  Invoke the hasAttributeNS method to check if it
      has the xmlns attribute that belongs to the namespace http://www.w3.org/2000/xmlns/.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
*/
elementhasattributens01 : function () {
   var success;
    if(checkInitialization(builder, "elementhasattributens01") != null) return;
    var doc;
      var element;
      var state;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","employee");
      element = elementList.item(0);
      state = element.hasAttributeNS("http://www.w3.org/2000/xmlns/","xmlns");
      assertTrue("elementhasattributens01",state);

},
/**
*
      The method hasAttributeNS returns true when an attribute with a given local
      name and namespace URI is specified on this element or has a default value,
      false otherwise.

      Create a new element and attribute node that belong to the same namespace.
      Add the attribute node to the element node.  Check if the newly created element
      node has an attribute by invoking the hasAttributeNS method with appropriate
      values for the namespaceURI and localName parameters.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
*/
elementhasattributens02 : function () {
   var success;
    if(checkInitialization(builder, "elementhasattributens02") != null) return;
    var doc;
      var element;
      var state;
      var attribute;
      var newAttribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS("http://www.w3.org/DOM","address");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM","domestic");
      newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttributeNS("http://www.w3.org/DOM","domestic");
      assertTrue("hasDomesticAttr",state);

},
/**
*
      The method hasAttributeNS returns true when an attribute with a given local name
      and namespace URI is specified on this element or has a default value,
      false otherwise.

      Create a new element and an attribute node that has an empty namespace.
      Add the attribute node to the element node.  Check if the newly created element
      node has an attribute by invoking the hasAttributeNS method with appropriate
      values for the namespaceURI and localName parameters.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
elementhasattributens03 : function () {
   var success;
    if(checkInitialization(builder, "elementhasattributens03") != null) return;
    var doc;
      var element;
      var state;
      var attribute;
      var newAttribute;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS("http://www.w3.org/DOM","address");
      assertNotNull("createElementNotNull",element);
attribute = doc.createAttributeNS(nullNS,"domestic");
      newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttributeNS(nullNS,"domestic");
      assertTrue("elementhasattributens03",state);

},
/**
*
      The method removeAttributeNS removes an attribute by local name and namespace URI.
      Create a new element and add a new attribute node to it.
      Remove the attribute node using the removeAttributeNodeNS method.
      Check if the attribute was remove by invoking the hasAttributeNS
      method on the element and check if it returns false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElRemAtNS
*/
elementremoveattributens01 : function () {
   var success;
    if(checkInitialization(builder, "elementremoveattributens01") != null) return;
    var doc;
      var element;
      var state;
      var attribute;
      var newAttribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS("http://www.w3.org/DOM","elem");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM/Test/createAttributeNS","attr");
      newAttribute = element.setAttributeNodeNS(attribute);
      element.removeAttributeNS("http://www.w3.org/DOM/Test/createAttributeNS","attr");
      state = element.hasAttributeNS("http://www.w3.org/DOM/Test/createAttributeNS","attr");
      assertFalse("elementremoveattributens01",state);

},
/**
*
      Testing Element.setAttributeNodeNS: If an attribute with that local name
      and that namespace URI is already present in the element, it is replaced
      by the new one.

      Create a new element and two new attribute nodes (in the same namespace
      and same localNames).
      Add the two new attribute nodes to the element node using the
      setAttributeNodeNS method.  Check that only one attribute is added, check
      the value of this attribute.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
*/
elementsetattributenodens01 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributenodens01") != null) return;
    var doc;
      var element;
      var attribute1;
      var attribute2;
      var attrNode;
      var attrName;
      var attrNS;
      var attrValue;
      var attributes;
      var newAttribute;
      var length;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/Level2","new:element");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/Test/att1","p1:att");
      attribute2 = doc.createAttributeNS("http://www.w3.org/DOM/Test/att1","p2:att");
      attribute2.value = "value2";

      newAttribute = element.setAttributeNodeNS(attribute1);
      newAttribute = element.setAttributeNodeNS(attribute2);
      attrNode = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/att1","att");
      attrName = attrNode.nodeName;

      attrNS = attrNode.namespaceURI;

      assertEquals("elementsetattributenodens01_attrName","p2:att",attrName);
       assertEquals("elementsetattributenodens01_attrNS","http://www.w3.org/DOM/Test/att1",attrNS);
       attributes = element.attributes;

      length = attributes.length;

      assertEquals("length",1,length);

},
/**
*
      Test the setAttributeNodeNS method.
      Retreive the street attribute from the second address element node.
      Clone it and add it to the first address node.  The INUSE_ATTRIBUTE_ERR exception
      should not be thrown. Check the name and value of the newly added node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
elementsetattributenodens02 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributenodens02") != null) return;
    var doc;
      var element;
      var element2;
      var attribute;
      var attributeCloned;
      var newAttr;
      var elementList;
      var attrName;
      var attrValue;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attribute = element.getAttributeNodeNS(nullNS,"street");
      attributeCloned = attribute.cloneNode(true);
      element2 = elementList.item(2);
      newAttr = element2.setAttributeNodeNS(attributeCloned);
      attrName = newAttr.nodeName;

      attrValue = newAttr.nodeValue;

      assertEquals("elementsetattributenodens02_attrName","street",attrName);
       assertEquals("elementsetattributenodens02_attrValue","Yes",attrValue);

},
/**
*
      The method setAttributeNodeNS adds a new attribute and raises the
      INUSE_ATTRIBUTE_ERR exception if the newAttr is already an attribute of
      another Element object.

      Retreive an attribute node of an existing element node.  Attempt to add it to an another
      element node.  Check if the INUSE_ATTRIBUTE_ERR exception is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
*/
elementsetattributenodens03 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributenodens03") != null) return;
    var doc;
      var element1;
      var element2;
      var attribute;
      var newAttribute;
      var elementList;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element1 = elementList.item(1);
      attribute = element1.getAttributeNodeNS(nullNS,"street");
      element2 = elementList.item(2);

	{
		success = false;
		try {
            newAttribute = element2.setAttributeNodeNS(attribute);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 10);
		}
		assertTrue("elementsetattributenodens03",success);
	}

},
/**
*
      The method setAttributeNodeNS Adds a new attribute and raises an INUSE_ATTRIBUTE_ERR
      if newAttr is already an attribute of another Element object.

      Create two new element nodes and a new attribute node.  Attempt to add the same attribute
      node to the same two element nodes.
      Check if an INUSE_ATTRIBUTE_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
*/
elementsetattributenodens04 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributenodens04") != null) return;
    var doc;
      var element1;
      var element2;
      var attribute;
      var newAttribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element1 = doc.createElementNS("http://www.w3.org/DOM/Test","elem1");
      element2 = doc.createElementNS("http://www.w3.org/DOM/Test","elem2");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM/Test","attr");
      newAttribute = element1.setAttributeNodeNS(attribute);

	{
		success = false;
		try {
            newAttribute = element2.setAttributeNodeNS(attribute);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 10);
		}
		assertTrue("elementsetattributenodens04",success);
	}

},
/**
*
      The method setAttributeNodeNS Adds a new attribute and raises
      an WRONG_DOCUMENT_ERR if newAttr was created from a different document
      than the one that created the element.
      Create new element and attribute nodes in different documents.
      Attempt to add the attribute node to the element node.
      Check if an WRONG_DOCUMENT_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
*/
elementsetattributenodens05 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributenodens05") != null) return;
    var doc;
      var docAlt;
      var element;
      var attribute;
      var newAttribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var docAltRef = null;
      if (typeof(this.docAlt) != 'undefined') {
        docAltRef = this.docAlt;
      }
      docAlt = load(docAltRef, "docAlt", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test","elem1");
      attribute = docAlt.createAttributeNS("http://www.w3.org/DOM/Test","attr");

	{
		success = false;
		try {
            newAttribute = element.setAttributeNodeNS(attribute);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
*
	The method setAttributeNodeNS Adds a new attribute and raises an WRONG_DOCUMENT_ERR if this node
	is readonly.

	Attempt to add an attribute node to an element node which is part of the replacement text of
	a read-only EntityReference node.
	Check if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
*/
elementsetattributenodens06 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributenodens06") != null) return;
    var doc;
      var element;
      var attribute;
      var attribute2;
      var entRef;
      var elementList;
      var newAttribute;
      var newChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test","elem1");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM/Test","attr");
      entRef = doc.createEntityReference("ent4");
      newChild = attribute.appendChild(entRef);
      newAttribute = element.setAttributeNodeNS(attribute);
      elementList = entRef.childNodes;

      element = elementList.item(0);
      attribute2 = doc.createAttributeNS("http://www.w3.org/DOM/Test","attr2");

	{
		success = false;
		try {
            newAttribute = element.setAttributeNodeNS(attribute2);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("elementsetattributenodens06",success);
	}

},
/**
*
      The method setAttributeNS adds a new attribute.
      Create a new element and add a new attribute node to it using the setAttributeNS method.
      Check if the attribute was correctly set by invoking the getAttributeNodeNS method
      and checking the nodeName and nodeValue of the returned nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
*/
elementsetattributens01 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributens01") != null) return;
    var doc;
      var element;
      var attribute;
      var attrName;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS("http://www.w3.org/DOM","dom:elem");
      element.setAttributeNS("http://www.w3.org/DOM/Test/setAttributeNS","attr","value");
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/setAttributeNS","attr");
      attrName = attribute.nodeName;

      attrValue = attribute.nodeValue;

      assertEquals("elementsetattributens01_attrName","attr",attrName);
       assertEquals("elementsetattributens01_attrValue","value",attrValue);

},
/**
*
      The method setAttributeNS adds a new attribute.

      Retrieve an existing element node with attributes and add a new attribute node to it using
      the setAttributeNS method.   Check if the attribute was correctly set by invoking the
      getAttributeNodeNS method and checking the nodeName and nodeValue of the returned nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
*/
elementsetattributens02 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributens02") != null) return;
    var doc;
      var element;
      var attribute;
      var elementList;
      var attrName;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(0);
      element.setAttributeNS("http://www.w3.org/DOM/Test/setAttributeNS","this:street","Silver Street");
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/setAttributeNS","street");
      attrName = attribute.nodeName;

      attrValue = attribute.nodeValue;

      assertEquals("elementsetattributens02_attrName","this:street",attrName);
       assertEquals("elementsetattributens02_attrValue","Silver Street",attrValue);

},
/**
*
      The method setAttributeNS adds a new attribute.
      Retreive an existing element node with a default attribute node and
      add two new attribute nodes that have the same local name as the
      default attribute but different namespaceURI to it using the setAttributeNS method.
      Check if the attribute was correctly set by invoking the getAttributeNodeNS method
      and checking the nodeName and nodeValue of the returned nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
*/
elementsetattributens03 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributens03") != null) return;
    var doc;
      var element;
      var attribute;
      var elementList;
      var attrName;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:employee");
      element = elementList.item(0);
      assertNotNull("empEmployeeNotNull",element);
element.setAttributeNS("http://www.w3.org/DOM/Test/1","defaultAttr","default1");
      element.setAttributeNS("http://www.w3.org/DOM/Test/2","defaultAttr","default2");
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/1","defaultAttr");
      attrName = attribute.nodeName;

      attrValue = attribute.nodeValue;

      assertEquals("elementsetattributens03_attrName","defaultAttr",attrName);
       assertEquals("elementsetattributens03_attrValue","default1",attrValue);

},
/**
*
      The method setAttributeNS adds a new attribute and raises a INVALID_CHARACTER_ERR if
      the specified qualified name contains an illegal character.
      Invoke the setAttributeNS method on this Element object with a valid value for
      namespaceURI, and qualifiedNames that contain illegal characters.  Check if the an
      INVALID_CHARACTER_ERR was thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
*/
elementsetattributens04 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributens04") != null) return;
    var doc;
      var element;
      var qualifiedName;
      qualifiedNames = new Array();
      qualifiedNames[0] = "/";
      qualifiedNames[1] = "//";
      qualifiedNames[2] = "\\";
      qualifiedNames[3] = ";";
      qualifiedNames[4] = "&";
      qualifiedNames[5] = "*";
      qualifiedNames[6] = "]]";
      qualifiedNames[7] = ">";
      qualifiedNames[8] = "<";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/L2","dom:elem");
      for(var indexN10058 = 0;indexN10058 < qualifiedNames.length; indexN10058++) {
      qualifiedName = qualifiedNames[indexN10058];

	{
		success = false;
		try {
            element.setAttributeNS("http://www.w3.org/DOM/Test/L2",qualifiedName,"test");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("elementsetattributens04",success);
	}

	}

},
/**
*
      The method setAttributeNS adds a new attribute and raises a NAMESPACE_ERR if the
      qualifiedName has a prefix and the namespaceURI is null.
      Invoke the setAttributeNS method on a new Element object with null namespaceURI and a
      qualifiedName that has a namespace prefix.  Check if the NAMESPACE_ERR was thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
elementsetattributens05 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributens05") != null) return;
    var doc;
      var element;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/L2","dom:elem");

	{
		success = false;
		try {
            element.setAttributeNS(nullNS,"dom:root","test");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("elementsetattributens05",success);
	}

},
/**
*
      The method setAttributeNS adds a new attribute and raises a NAMESPACE_ERR
      if the qualifiedName, or its prefix, is "xmlns" and the namespaceURI is
      different from "http://www.w3.org/2000/xmlns/".

      Invoke the setAttributeNS method on a new Element object with namespaceURI that is
      http://www.w3.org/DOMTest/level2 and a qualifiedName that has the prefix xmlns and once
      again with a qualifiedName that is xmlns.
      Check if the NAMESPACE_ERR was thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
*/
elementsetattributens08 : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributens08") != null) return;
    var doc;
      var element;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOMTest/level2","dom:elem");

	{
		success = false;
		try {
            element.setAttributeNS("http://www.w3.org/DOMTest/level2","xmlns","test");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("elementsetattributens08_Err1",success);
	}

	{
		success = false;
		try {
            element.setAttributeNS("http://www.w3.org/DOMTest/level2","xmlns:root","test");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("elementsetattributens08_Err2",success);
	}

},
/**
*

    The "setAttributeNS(namespaceURI,qualifiedName,value)" method raises a

   NAMESPACE_ERR DOMException if the specified

   qualifiedName has a prefix and the namespaceURI is null.



   Attempt to add a new attribute on the first employee node.

   An exception should be raised since the "qualifiedName" has a

   prefix and the namespaceURI is null.


* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
elementsetattributensurinull : function () {
   var success;
    if(checkInitialization(builder, "elementsetattributensurinull") != null) return;
    var namespaceURI = null;

      var qualifiedName = "emp:qualifiedName";
      var doc;
      var elementList;
      var testAddr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("employee");
      testAddr = elementList.item(0);

	{
		success = false;
		try {
            testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "getAttributeNS(namespaceURI,localName)" method retrieves an
   attribute value by local name and NamespaceURI.

   Retrieve the first "emp:address" element.
   The value returned by the "getAttributeNS()" method should be the
   value "DISTRICT" since the attribute has a default value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAttrNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=238
*/
getAttributeNS01 : function () {
   var success;
    if(checkInitialization(builder, "getAttributeNS01") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var localName = "district";
      var qualifiedName = "emp:district";
      var doc;
      var elementList;
      var testAddr;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);
      assertEquals("attrValue","DISTRICT",attrValue);

},
/**
*
    The "getAttributeNS(namespaceURI,localName)" method retrieves an
   attribute value by local name and NamespaceURI.

   Retrieve the first "emp:address" element.
   Create a new attribute with the "createAttributeNS()" method.
   Add the new attribute with the "setAttributeNS()" method.
   The value returned by the "getAttributeNS()" method should be the
   empty string since the attribute does not have a default value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAttrNS
*/
getAttributeNS02 : function () {
   var success;
    if(checkInitialization(builder, "getAttributeNS02") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var localName = "district";
      var qualifiedName = "emp:district";
      var doc;
      var newAttribute;
      var elementList;
      var testAddr;
      var districtAttr;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      newAttribute = doc.createAttributeNS(namespaceURI,qualifiedName);
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
districtAttr = testAddr.setAttributeNodeNS(newAttribute);
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);
      assertEquals("throw_Equals","",attrValue);

},
/**
*
    The "getAttributeNS(namespaceURI,localName)" method retrieves an
   attribute value by local name and NamespaceURI.

   Retrieve the first "emp:address" element.
   The value returned by the "getAttributeNS()" method for the emp:domestic attribute
   should be the empty string since the attribute does not have a specified value
   because it was removed by the "removeAttributeNS()" method.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAttrNS
*/
getAttributeNS03 : function () {
   var success;
    if(checkInitialization(builder, "getAttributeNS03") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var localName = "domestic";
      var doc;
      var elementList;
      var testAddr;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
testAddr.removeAttributeNS(namespaceURI,localName);
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);
      assertEquals("throw_Equals","",attrValue);

},
/**
*
    The "getAttributeNS(namespaceURI,localName)" method retrieves an
   attribute value by local name and NamespaceURI.

   Retrieve the first "emp:address" element.
   Create a new attribute with the "createAttributeNS()" method.
   Add the new attribute and value with the "setAttributeNS()" method.
   The value returned by the "getAttributeNS()" method should be
   the string "NewValue" since the attribute had a specified value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAttrNS
*/
getAttributeNS04 : function () {
   var success;
    if(checkInitialization(builder, "getAttributeNS04") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var localName = "blank";
      var qualifiedName = "emp:blank";
      var doc;
      var newAttribute;
      var elementList;
      var testAddr;
      var districtAttr;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      newAttribute = doc.createAttributeNS(namespaceURI,qualifiedName);
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
testAddr.setAttributeNS(namespaceURI,qualifiedName,"NewValue");
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);
      assertEquals("throw_Equals","NewValue",attrValue);

},
/**
*
    The "getAttributeNS(namespaceURI,localName)" method retrieves an
   attribute value by local name and NamespaceURI.

   Retrieve the first emp:address element node
   and retrieve the emp:domestic attribute.  The method returns an
   Attr value as a string, the "value" can be examined to ensure the
   proper attribute value was retrieved.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAttrNS
*/
getAttributeNS05 : function () {
   var success;
    if(checkInitialization(builder, "getAttributeNS05") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
attrValue = testAddr.getAttributeNS("http://www.nist.gov","domestic");
      assertEquals("attrValue","Yes",attrValue);

},
/**
*
    The "getAttributeNodeNS(namespaceURI,localName)" method retrieves an
   attribute node by local name and NamespaceURI.

   Retrieve the first emp:address element node.
   The getAttributeNodeNS method returns an
   Attr node, the "value" can be examined to ensure the
   proper attribute node was retrieved.  This attribute
   value should be null since there is no such attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAtNodeNS
*/
getAttributeNodeNS01 : function () {
   var success;
    if(checkInitialization(builder, "getAttributeNodeNS01") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var localName = "invalidlocalname";
      var doc;
      var elementList;
      var testAddr;
      var attribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
attribute = testAddr.getAttributeNodeNS(namespaceURI,localName);
      assertNull("throw_Null",attribute);

},
/**
*
    The "getAttributeNodeNS(namespaceURI,localName)" method retrieves an
   attribute node by local name and NamespaceURI.

   Retrieve the first emp:address element node.
   The getAttributeNodeNS method returns an
   Attr node, the "value" can be examined to ensure the
   proper attribute node was retrieved.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D095
*/
getAttributeNodeNS02 : function () {
   var success;
    if(checkInitialization(builder, "getAttributeNodeNS02") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var attribute;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
attribute = testAddr.getAttributeNodeNS("http://www.nist.gov","domestic");
      attrName = attribute.nodeName;

      assertEquals("attrName","emp:domestic",attrName);

},
/**
*
    The "getElementById(elementId)" method for a
   Document should return an element whose ID matches elementId.

   Invoke method getElementById(elementId) on this document
   with elementId equals "CANADA".  Method should return an element
   whose tag name is "emp:address".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-104682815
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=383
*/
getElementById01 : function () {
   var success;
    if(checkInitialization(builder, "getElementById01") != null) return;
    var doc;
      var element;
      var tagname;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.getElementById("CANADA");
      tagname = element.tagName;

      assertEquals("throw_Equals","emp:address",tagname);

},
/**
*

   The "getElementById(elementId)" method for a
   Document should return null if elementId does not identify any
   elements in this document.

   Invoke method getElementById(elementId) on this document
   with elementId equals "Cancun". Method should return null.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBId
*/
getElementById02 : function () {
   var success;
    if(checkInitialization(builder, "getElementById02") != null) return;
    var doc;
      var element;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.getElementById("Cancun");
      assertNull("throw_Null",element);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method for a
   Document should return a new NodeList of all Elements that have a namespace
   when local name is specified as ' '.

   Invoke method getElementsByTagNameNS(namespaceURI,localName) on this document
   with namespaceURI and localName as " ".
   Method should return a new NodeList of 37 elements.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
getElementsByTagNameNS01 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS01") != null) return;
    var namespaceURI = "*";
      var localName = "*";
      var doc;
      var newList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      newList = doc.getElementsByTagNameNS(namespaceURI,localName);
      assertSize("throw_Size",37,newList);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method for a
   Document should return a new NodeList of all Elements with a given
   localName and namespaceURI in the order they were encountered in a preorder
   traversal of the document tree.

   Invoke method getElementsByTagNameNS(namespaceURI,localName) on this document
   with namespaceURI being " " and localName is "employee".
   Method should return a new NodeList containing five Elements.
   Retrieve the FOURTH element whose name should be "emp:employee".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
getElementsByTagNameNS02 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS02") != null) return;
    var doc;
      var newList;
      var newElement;
      var prefix;
      var lname;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      newList = doc.getElementsByTagNameNS("*","employee");
      assertSize("employeeCount",5,newList);
newElement = newList.item(3);
      prefix = newElement.prefix;

      assertEquals("prefix","emp",prefix);
       lname = newElement.localName;

      assertEquals("lname","employee",lname);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the "http://www.nist.gov" as the namespaceURI and the special value " " as the
   localName.
   The method should return a NodeList of elements that have "http://www.nist.gov
   as a namespace URI.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
getElementsByTagNameNS03 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS03") != null) return;
    var doc;
      var elementList;
      var child;
      var childName;
      var result = new Array();

      expectedResult = new Array();
      expectedResult[0] = "employee";
      expectedResult[1] = "employeeId";
      expectedResult[2] = "name";
      expectedResult[3] = "position";
      expectedResult[4] = "salary";
      expectedResult[5] = "gender";
      expectedResult[6] = "address";
      expectedResult[7] = "emp:employee";
      expectedResult[8] = "emp:employeeId";
      expectedResult[9] = "emp:position";
      expectedResult[10] = "emp:salary";
      expectedResult[11] = "emp:gender";
      expectedResult[12] = "emp:address";
      expectedResult[13] = "address";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","*");
      for(var indexN10076 = 0;indexN10076 < elementList.length; indexN10076++) {
      child = elementList.item(indexN10076);
      childName = child.nodeName;

      result[result.length] = childName;

	}
   assertEqualsList("nodeNames",expectedResult,result);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the special value " " as the namespaceURI and "address" as the
   localName.
   The method should return a NodeList of Elements that have
   "address" as the local name.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
getElementsByTagNameNS04 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS04") != null) return;
    var doc;
      var elementList;
      var child;
      var childName;
      var result = new Array();

      expectedResult = new Array();
      expectedResult[0] = "address";
      expectedResult[1] = "address";
      expectedResult[2] = "address";
      expectedResult[3] = "emp:address";
      expectedResult[4] = "address";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      for(var indexN10059 = 0;indexN10059 < elementList.length; indexN10059++) {
      child = elementList.item(indexN10059);
      childName = child.nodeName;

      result[result.length] = childName;

	}
   assertEqualsList("nodeNames",expectedResult,result);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the "http://www.nist.gov" as the namespaceURI and "nomatch" as the
   localName.
   The method should return a NodeList whose length is
   "0".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
getElementsByTagNameNS05 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS05") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var localName = "nomatch";
      var doc;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS(namespaceURI,localName);
      assertSize("throw_Size",0,elementList);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the "http://www.nomatch.com" as the namespaceURI and "address" as the
   localName.
   The method should return a NodeList whose length is
   "0".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
getElementsByTagNameNS06 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS06") != null) return;
    var doc;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nomatch.com","address");
      assertSize("matchSize",0,elementList);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the string "http://www.nist.gov" as the namespaceURI and "address" as the
   localName.
   The method should return a NodeList whose length is
   "3".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
*/
getElementsByTagNameNS07 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS07") != null) return;
    var doc;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      assertSize("addresses",3,elementList);

},
/**
*
    Element.getElementsByTagNameNS('*','*') should return all child
    elements.  There is some contention on whether this should match
    unqualified elements, this test reflects the interpretation that
    '*' should match elements in all namespaces and unqualified elements.

    Derived from getElementsByTagNameNS01 which tests similar functionality
    on the Document interface.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1938918D
*/
getElementsByTagNameNS08 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS08") != null) return;
    var doc;
      var docElem;
      var newList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      newList = docElem.getElementsByTagNameNS("*","*");
      assertSize("listSize",36,newList);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method for a
   Element should return a new NodeList of all descendant Elements with a given
   localName and namespaceURI in the order they were encountered in a preorder
   traversal of the document tree.

   Invoke method getElementsByTagNameNS(namespaceURI,localName) on the document
   element with namespaceURI being "*" and localName is "employee".
   Method should return a new NodeList containing five Elements.
   Retrieve the FOURTH element whose name should be "emp:employee".

   Derived from getElementsByTagNameNS02 and reflects its interpretation
   that namespace="*" matches namespace unqualified tagnames.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1938918D
*/
getElementsByTagNameNS09 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS09") != null) return;
    var doc;
      var newList;
      var newElement;
      var prefix;
      var lname;
      var docElem;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      newList = docElem.getElementsByTagNameNS("*","employee");
      assertSize("employeeCount",5,newList);
newElement = newList.item(3);
      prefix = newElement.prefix;

      assertEquals("prefix","emp",prefix);
       lname = newElement.localName;

      assertEquals("lname","employee",lname);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements of the document element
   using the "http://www.nist.gov" as the namespaceURI and the special value "*" as the
   localName.
   The method should return a NodeList of elements that have "http://www.nist.gov
   as a namespace URI.

   Derived from getElementsByTagNameNS03

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1938918D
*/
getElementsByTagNameNS10 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS10") != null) return;
    var doc;
      var docElem;
      var elementList;
      var child;
      var childName;
      var result = new Array();

      expectedResult = new Array();
      expectedResult[0] = "employee";
      expectedResult[1] = "employeeId";
      expectedResult[2] = "name";
      expectedResult[3] = "position";
      expectedResult[4] = "salary";
      expectedResult[5] = "gender";
      expectedResult[6] = "address";
      expectedResult[7] = "emp:employee";
      expectedResult[8] = "emp:employeeId";
      expectedResult[9] = "emp:position";
      expectedResult[10] = "emp:salary";
      expectedResult[11] = "emp:gender";
      expectedResult[12] = "emp:address";
      expectedResult[13] = "address";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nist.gov","*");
      for(var indexN1007E = 0;indexN1007E < elementList.length; indexN1007E++) {
      child = elementList.item(indexN1007E);
      childName = child.nodeName;

      result[result.length] = childName;

	}
   assertEqualsList("nodeNames",expectedResult,result);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the special value "*" as the namespaceURI and "address" as the
   localName.
   The method should return a NodeList of Elements that have
   "address" as the local name.

   This test is derived from getElementsByTagNameNS04

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1938918D
*/
getElementsByTagNameNS11 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS11") != null) return;
    var doc;
      var docElem;
      var elementList;
      var child;
      var childName;
      var result = new Array();

      expectedResult = new Array();
      expectedResult[0] = "address";
      expectedResult[1] = "address";
      expectedResult[2] = "address";
      expectedResult[3] = "emp:address";
      expectedResult[4] = "address";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("*","address");
      for(var indexN1005E = 0;indexN1005E < elementList.length; indexN1005E++) {
      child = elementList.item(indexN1005E);
      childName = child.nodeName;

      result[result.length] = childName;

	}
   assertEqualsList("nodeNames",expectedResult,result);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the "http://www.nist.gov" as the namespaceURI and "nomatch" as the
   localName.
   The method should return a NodeList whose length is "0".

   This test is a modification of getElementsByTagName05

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1938918D
*/
getElementsByTagNameNS12 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS12") != null) return;
    var doc;
      var docElem;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nist.gov","nomatch");
      assertSize("size",0,elementList);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the "http://www.nomatch.com" as the namespaceURI and "address" as the
   localName.
   The method should return a NodeList whose length is
   "0".

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1938918D
*/
getElementsByTagNameNS13 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS13") != null) return;
    var doc;
      var docElem;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nomatch.com","address");
      assertSize("matchSize",0,elementList);

},
/**
*
    The "getElementsByTagNameNS(namespaceURI,localName)" method returns a NodeList
   of all descendant Elements with a given local name and namespace URI in the
   order in which they are encountered in a preorder traversal of this Element tree.

   Create a NodeList of all the descendant elements
   using the string "http://www.nist.gov" as the namespaceURI and "address" as the
   localName.
   The method should return a NodeList whose length is
   "3".

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1938918D
*/
getElementsByTagNameNS14 : function () {
   var success;
    if(checkInitialization(builder, "getElementsByTagNameNS14") != null) return;
    var doc;
      var docElem;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nist.gov","address");
      assertSize("addresses",3,elementList);

},
/**
*
    The "getNamedItemNS(namespaceURI,localName)" method for a
   NamedNodeMap should return a node specified by localName and namespaceURI

   Retrieve a list of elements with tag name "address".
   Access the second element from the list and get its attributes.
   Try to retrieve the attribute node with local name "domestic"
   and namespace uri "http://www.usa.com" with
   method getNamedItemNS(namespaceURI,localName).

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D095
*/
getNamedItemNS01 : function () {
   var success;
    if(checkInitialization(builder, "getNamedItemNS01") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var attributes;
      var domesticAttr;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testEmployee = elementList.item(1);
      attributes = testEmployee.attributes;

      domesticAttr = attributes.getNamedItemNS("http://www.usa.com","domestic");
      attrName = domesticAttr.nodeName;

      assertEquals("attrName","dmstc:domestic",attrName);

},
/**
*
    The "getNamedItemNS(namespaceURI,localName)" method for a
   NamedNodeMap should return null
   if parameters do not identify any node in this map.

   Retrieve a list of elements with tag name "address".
   Access the second element from the list and get its attributes.
   Try to retrieve an attribute node with local name "domest"
   and namespace uri "http://www.usa.com" with
   method getNamedItemNS(namespaceURI,localName).
   This should return null because "domest" does not match any local names in this map.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
*/
getNamedItemNS02 : function () {
   var success;
    if(checkInitialization(builder, "getNamedItemNS02") != null) return;
    var namespaceURI = "http://www.usa.com";
      var localName = "domest";
      var doc;
      var elementList;
      var testEmployee;
      var attributes;
      var newAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testEmployee = elementList.item(1);
      attributes = testEmployee.attributes;

      newAttr = attributes.getNamedItemNS(namespaceURI,localName);
      assertNull("throw_Null",newAttr);

},
/**
*
Entity nodes are not namespaced and should not be retrievable using
getNamedItemNS.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
getNamedItemNS03 : function () {
   var success;
    if(checkInitialization(builder, "getNamedItemNS03") != null) return;
    var doc;
      var docType;
      var entities;
      var entity;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      entities = docType.entities;

      assertNotNull("entitiesNotNull",entities);
entity = entities.getNamedItemNS(nullNS,"ent1");
      assertNull("entityNull",entity);

},
/**
*
Notation nodes are not namespaced and should not be retrievable using
getNamedItemNS.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
getNamedItemNS04 : function () {
   var success;
    if(checkInitialization(builder, "getNamedItemNS04") != null) return;
    var doc;
      var docType;
      var notations;
      var notation;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      notations = docType.notations;

      assertNotNull("notationsNotNull",notations);
notation = notations.getNamedItemNS(nullNS,"notation1");
      assertNull("notationNull",notation);

},
/**
*
    The "hasAttribute()" method for an Element should
   return true if the element has an attribute with the given name.

   Retrieve the first "address" element and the "hasAttribute()" method
   should return false since the element does not have a default value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttr
*/
hasAttribute01 : function () {
   var success;
    if(checkInitialization(builder, "hasAttribute01") != null) return;
    var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(4);
      state = testNode.hasAttribute("domestic");
      assertFalse("throw_False",state);

},
/**
*
    The "hasAttribute()" method for an Element should
   return true if the element has an attribute with the given name.

   Retrieve the first "address" element and the "hasAttribute()" method
   should return true since the attribute "street" has a default value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttr
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=238
*/
hasAttribute02 : function () {
   var success;
    if(checkInitialization(builder, "hasAttribute02") != null) return;
    var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttribute("street");
      assertTrue("throw_True",state);

},
/**
*
    The "hasAttribute()" method for an Element should
   return false if the element does not have an attribute with the given name.

   Retrieve the first "address" element and the "hasAttribute()" method
   should return false since the element does not have "nomatch" as an attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttr
*/
hasAttribute03 : function () {
   var success;
    if(checkInitialization(builder, "hasAttribute03") != null) return;
    var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttribute("nomatch");
      assertFalse("throw_False",state);

},
/**
*
    The "hasAttribute()" method for an Element should
   return true if the element has an attribute with the given name.

   Retrieve the first "address" element and the "hasAttribute()" method
   should return true since the element has "domestic" as an attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttr
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=238
*/
hasAttribute04 : function () {
   var success;
    if(checkInitialization(builder, "hasAttribute04") != null) return;
    var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttribute("dmstc:domestic");
      assertTrue("hasDomesticAttr",state);

},
/**
*

   The "hasAttributeNS()" method for an Element should
   return false if the element does not have an attribute with the given local name
   and/or a namespace URI specified on this element or does not have a default value.

   Retrieve the first "address" element and the "hasAttributeNS()" method
   should return false since the element has "nomatch" as the local name
   and "http://www.usa.com" as the namespace URI.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
*/
hasAttributeNS01 : function () {
   var success;
    if(checkInitialization(builder, "hasAttributeNS01") != null) return;
    var localName = "nomatch";
      var namespaceURI = "http://www.usa.com";
      var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttributeNS(namespaceURI,localName);
      assertFalse("throw_False",state);

},
/**
*
    The "hasAttributeNS()" method for an Element should
   return false if the element does not have an attribute with the given local name
   and/or namespace URI specified on this element or does not have a default value.

   Retrieve the first "address" element and the "hasAttributeNS()" method
   should return false since the element has "domestic" as the local name
   and "http://www.nomatch.com" as the namespace URI.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
*/
hasAttributeNS02 : function () {
   var success;
    if(checkInitialization(builder, "hasAttributeNS02") != null) return;
    var localName = "domestic";
      var namespaceURI = "http://www.nomatch.com";
      var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttributeNS(namespaceURI,localName);
      assertFalse("throw_False",state);

},
/**
*
    The "hasAttributeNS()" method for an Element should
   return false if the element does not have an attribute with the given local name
   and/or namespace URI specified on this element or does not have a default value.

   Retrieve the first "emp:address" element.
   The boolean value returned by the "hasAttributeNS()" should be false
   since the attribute does not have a default value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
*/
hasAttributeNS03 : function () {
   var success;
    if(checkInitialization(builder, "hasAttributeNS03") != null) return;
    var localName = "blank";
      var namespaceURI = "http://www.nist.gov";
      var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testNode = elementList.item(0);
      assertNotNull("empAddrNotNull",testNode);
state = testNode.hasAttributeNS(namespaceURI,localName);
      assertFalse("throw_False",state);

},
/**
*
    The "hasAttributeNS()" method for an Element should
   return true if the attribute with the given local name
   and namespace URI has a default value.

   Retrieve the first "emp:address" element.
   The boolean value returned by the "hasAttributeNS()" should be true
   since the attribute has a default value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
*/
hasAttributeNS04 : function () {
   var success;
    if(checkInitialization(builder, "hasAttributeNS04") != null) return;
    var localName = "district";
      var namespaceURI = "http://www.nist.gov";
      var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testNode = elementList.item(0);
      assertNotNull("empAddressNotNull",testNode);
state = testNode.hasAttributeNS(namespaceURI,localName);
      assertTrue("hasAttribute",state);

},
/**
*
    The "hasAttributeNS()" method for an Element should
   return true if the element has an attribute with the given local name
   and the namespace URI is specified on this element or has a default value.

   Retrieve the first "address" element and the "hasAttributeNS()" method
   should return true since the element has "domestic" as the local name
   and "http://www.usa.com" as the namespace URI.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElHasAttrNS
*/
hasAttributeNS05 : function () {
   var success;
    if(checkInitialization(builder, "hasAttributeNS05") != null) return;
    var localName = "domestic";
      var namespaceURI = "http://www.usa.com";
      var doc;
      var elementList;
      var testNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttributeNS(namespaceURI,localName);
      assertTrue("hasAttribute",state);

},
/**
*
    The "hasAttributes()" method for a node should
    return false if the node does not have an attribute.

    Retrieve the first "name" node and invoke the "hasAttributes()" method.
    The method should return false since the node does not have an attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
hasAttributes01 : function () {
   var success;
    if(checkInitialization(builder, "hasAttributes01") != null) return;
    var doc;
      var addrList;
      var addrNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      addrList = doc.getElementsByTagName("name");
      addrNode = addrList.item(0);
      state = addrNode.hasAttributes();
      assertFalse("throw_False",state);

},
/**
*
    The "hasAttributes()" method for a node should
    return true if the node has attributes.

    Retrieve the first address node and the "hasAttributes()" method
    should return true since the node has "domestic" as an attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
hasAttributes02 : function () {
   var success;
    if(checkInitialization(builder, "hasAttributes02") != null) return;
    var doc;
      var addrList;
      var addrNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      addrList = doc.getElementsByTagName("address");
      addrNode = addrList.item(0);
      state = addrNode.hasAttributes();
      assertTrue("throw_True",state);

},
/**
*
An attempt to add remove an entity using removeNamedItemNS should result in
a NO_MODIFICATION_ERR or a NOT_FOUND_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1788794630
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-removeNamedItemNS
*/
hc_entitiesremovenameditemns1 : function () {
   var success;
    if(checkInitialization(builder, "hc_entitiesremovenameditemns1") != null) return;
    var doc;
      var entities;
      var docType;
      var retval;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;


	if(

	!(
	(builder.contentType == "text/html")
)

	) {
	assertNotNull("docTypeNotNull",docType);
entities = docType.entities;

      assertNotNull("entitiesNotNull",entities);

      try {
      retval = entities.removeNamedItemNS("http://www.w3.org/1999/xhtml","alpha");
      fail("throw_NO_MOD_OR_NOT_FOUND_ERR");

      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {
       switch(ex.code) {
       case /* NO_MODIFICATION_ALLOWED_ERR */ 7 :
       break;
      case /* NOT_FOUND_ERR */ 8 :
       break;
          default:
          throw ex;
          }
       } else {
       throw ex;
        }
         }

	}

},
/**
*
An attempt to add an element to the named node map returned by entities should
result in a NO_MODIFICATION_ERR or HIERARCHY_REQUEST_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1788794630
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
*/
hc_entitiessetnameditemns1 : function () {
   var success;
    if(checkInitialization(builder, "hc_entitiessetnameditemns1") != null) return;
    var doc;
      var entities;
      var docType;
      var retval;
      var elem;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;


	if(

	!(
	(builder.contentType == "text/html")
)

	) {
	assertNotNull("docTypeNotNull",docType);
entities = docType.entities;

      assertNotNull("entitiesNotNull",entities);
elem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");

      try {
      retval = entities.setNamedItemNS(elem);
      fail("throw_HIER_OR_NO_MOD_ERR");

      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NO_MODIFICATION_ALLOWED_ERR */ 7 :
       break;
          default:
          throw ex;
          }
       } else {
       throw ex;
        }
         }

	}

},
/**
*
Attempt to insert an element into an attribute list,
should raise a HIERARCHY_REQUEST_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
* @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
* @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-4
*/
hc_namednodemapinvalidtype1 : function () {
   var success;
    if(checkInitialization(builder, "hc_namednodemapinvalidtype1") != null) return;
    var doc;
      var attributes;
      var docElem;
      var newElem;
      var retval;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      attributes = docElem.attributes;

      newElem = doc.createElement("html");

	{
		success = false;
		try {
            retval = attributes.setNamedItem(newElem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
*
Create a document fragment with two adjacent text nodes, normalize and see if the text nodes
were combined.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D095
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-B63ED1A3
*/
hc_nodedocumentfragmentnormalize1 : function () {
   var success;
    if(checkInitialization(builder, "hc_nodedocumentfragmentnormalize1") != null) return;
    var doc;
      var docFragment;
      var nodeValue;
      var txtNode;
      var retval;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFragment = doc.createDocumentFragment();
      txtNode = doc.createTextNode("foo");
      retval = docFragment.appendChild(txtNode);
      txtNode = doc.createTextNode("bar");
      retval = docFragment.appendChild(txtNode);
      docFragment.normalize();
      txtNode = docFragment.firstChild;

      nodeValue = txtNode.nodeValue;

      assertEquals("normalizedNodeValue","foobar",nodeValue);
       retval = txtNode.nextSibling;

      assertNull("singleChild",retval);

},
/**
*
Create a document fragment with an empty text node, after normalization there should be no child nodes.
were combined.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D095
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-B63ED1A3
*/
hc_nodedocumentfragmentnormalize2 : function () {
   var success;
    if(checkInitialization(builder, "hc_nodedocumentfragmentnormalize2") != null) return;
    var doc;
      var docFragment;
      var nodeValue;
      var txtNode;
      var retval;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFragment = doc.createDocumentFragment();
      txtNode = doc.createTextNode("");
      retval = docFragment.appendChild(txtNode);
      docFragment.normalize();
      txtNode = docFragment.firstChild;

      assertNull("noChild",txtNode);

},
/**
*
An attempt to add remove an notation using removeNamedItemNS should result in
a NO_MODIFICATION_ERR or a NOT_FOUND_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D46829EF
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-removeNamedItemNS
*/
hc_notationsremovenameditemns1 : function () {
   var success;
    if(checkInitialization(builder, "hc_notationsremovenameditemns1") != null) return;
    var doc;
      var notations;
      var docType;
      var retval;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;


	if(

	!(
	(builder.contentType == "text/html")
)

	) {
	assertNotNull("docTypeNotNull",docType);
notations = docType.notations;

      assertNotNull("notationsNotNull",notations);

      try {
      retval = notations.removeNamedItemNS("http://www.w3.org/1999/xhtml","alpha");
      fail("throw_NO_MOD_OR_NOT_FOUND_ERR");

      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {
       switch(ex.code) {
       case /* NO_MODIFICATION_ALLOWED_ERR */ 7 :
       break;
      case /* NOT_FOUND_ERR */ 8 :
       break;
          default:
          throw ex;
          }
       } else {
       throw ex;
        }
         }

	}

},
/**
*
An attempt to add an element to the named node map returned by notations should
result in a NO_MODIFICATION_ERR or HIERARCHY_REQUEST_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D46829EF
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
*/
hc_notationssetnameditemns1 : function () {
   var success;
    if(checkInitialization(builder, "hc_notationssetnameditemns1") != null) return;
    var doc;
      var notations;
      var docType;
      var retval;
      var elem;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;


	if(

	!(
	(builder.contentType == "text/html")
)

	) {
	assertNotNull("docTypeNotNull",docType);
notations = docType.notations;

      assertNotNull("notationsNotNull",notations);
elem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");

      try {
      retval = notations.setNamedItemNS(elem);
      fail("throw_HIER_OR_NO_MOD_ERR");

      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NO_MODIFICATION_ALLOWED_ERR */ 7 :
       break;
          default:
          throw ex;
          }
       } else {
       throw ex;
        }
         }

	}

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Attr.
   The ownerElement is set to null. Specified flag is set to true.
   Children is imported.

   Create a new attribute whose name is "elem:attr1" in a different document.
   Create a child Text node with value "importedText" for the attribute node above.
   Invoke method importNode(importedNode,deep) on this document with
   importedNode being the newly created attribute.
   Method should return a node whose name matches "elem:attr1" and a child node
   whose value equals "importedText".
   The returned node should belong to this document whose systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode01 : function () {
   var success;
    if(checkInitialization(builder, "importNode01") != null) return;
    var doc;
      var aNewDoc;
      var newAttr;
      var importedChild;
      var aNode;
      var ownerDocument;
      var attrOwnerElement;
      var docType;
      var system;
      var specified;
      var childList;
      var nodeName;
      var child;
      var childValue;
      var result = new Array();

      expectedResult = new Array();
      expectedResult[0] = "elem:attr1";
      expectedResult[1] = "importedText";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      newAttr = aNewDoc.createAttribute("elem:attr1");
      importedChild = aNewDoc.createTextNode("importedText");
      aNode = newAttr.appendChild(importedChild);
      aNode = doc.importNode(newAttr,false);
      ownerDocument = aNode.ownerDocument;

      docType = ownerDocument.doctype;

      system = docType.systemId;

      assertNotNull("aNode",aNode);
assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
attrOwnerElement = aNode.ownerElement;

      assertNull("ownerElement",attrOwnerElement);
    specified = aNode.specified;

      assertTrue("specified",specified);
childList = aNode.childNodes;

      assertSize("childList",1,childList);
nodeName = aNode.nodeName;

      assertEquals("nodeName","elem:attr1",nodeName);
       child = aNode.firstChild;

      childValue = child.nodeValue;

      assertEquals("childValue","importedText",childValue);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type CData_Section.

   Create a CDATASection node with value being the string "this is CDATASection data" in
   a different document.  Invoke method importNode(importedNode,deep) on
   this document.  Method should return a CDATASection node whose value matches
   the above string. The returned node should belong to this document whose systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode02 : function () {
   var success;
    if(checkInitialization(builder, "importNode02") != null) return;
    var doc;
      var aNewDoc;
      var cDataSec;
      var aNode;
      var ownerDocument;
      var docType;
      var system;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      cDataSec = aNewDoc.createCDATASection("this is CDATASection data");
      aNode = doc.importNode(cDataSec,false);
      ownerDocument = aNode.ownerDocument;

      assertNotNull("ownerDocumentNotNull",ownerDocument);
docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("dtdSystemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
value = aNode.nodeValue;

      assertEquals("nodeValue","this is CDATASection data",value);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Comment.

   Create a comment node with value being the string "this is a comment" in
   a different document.  Invoke method importNode(importedNode,deep) on
   this document.  Method should return a comment node whose value matches
   the above string. The returned node should belong to this document whose
   systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode03 : function () {
   var success;
    if(checkInitialization(builder, "importNode03") != null) return;
    var doc;
      var aNewDoc;
      var comment;
      var aNode;
      var ownerDocument;
      var docType;
      var system;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      comment = aNewDoc.createComment("this is a comment");
      aNode = doc.importNode(comment,false);
      ownerDocument = aNode.ownerDocument;

      assertNotNull("ownerDocumentNotNull",ownerDocument);
docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
value = aNode.nodeValue;

      assertEquals("nodeValue","this is a comment",value);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Document_Fragment.

   Create a DocumentFragment in a different document.
   Create a Comment child node for the Document Fragment.
   Invoke method importNode(importedNode,deep) on this document
   with importedNode being the newly created DocumentFragment.
   Method should return a node of type DocumentFragment whose child has
   comment value "descendant1".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode04 : function () {
   var success;
    if(checkInitialization(builder, "importNode04") != null) return;
    var doc;
      var aNewDoc;
      var docFrag;
      var comment;
      var aNode;
      var children;
      var child;
      var childValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staff");
      docFrag = aNewDoc.createDocumentFragment();
      comment = aNewDoc.createComment("descendant1");
      aNode = docFrag.appendChild(comment);
      aNode = doc.importNode(docFrag,true);
      children = aNode.childNodes;

      assertSize("throw_Size",1,children);
child = aNode.firstChild;

      childValue = child.nodeValue;

      assertEquals("descendant1","descendant1",childValue);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Element.

   Retrieve element "emp:address" from staffNS.xml document.
   Invoke method importNode(importedNode,deep) on this document
   with importedNode being the element from above and deep is false.
   Method should return an element node whose name matches "emp:address"
   and whose children are not imported. The returned node should
   belong to this document whose systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode05 : function () {
   var success;
    if(checkInitialization(builder, "importNode05") != null) return;
    var doc;
      var aNewDoc;
      var element;
      var aNode;
      var hasChild;
      var ownerDocument;
      var docType;
      var system;
      var name;
      var addresses;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      addresses = aNewDoc.getElementsByTagName("emp:address");
      element = addresses.item(0);
      assertNotNull("empAddressNotNull",element);
aNode = doc.importNode(element,false);
      hasChild = aNode.hasChildNodes();
      assertFalse("hasChild",hasChild);
ownerDocument = aNode.ownerDocument;

      docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("dtdSystemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
name = aNode.nodeName;

      assertEquals("nodeName","emp:address",name);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Element.

   Retrieve element "emp:address" from staffNS.xml document.
   Invoke method importNode(importedNode,deep) on this document
   with importedNode being the element from above and deep is true.
   Method should return an element node whose name matches "emp:address" and
   whose descendant is imported.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode06 : function () {
   var success;
    if(checkInitialization(builder, "importNode06") != null) return;
    var doc;
      var aNewDoc;
      var element;
      var aNode;
      var hasChild;
      var name;
      var child;
      var value;
      var addresses;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      addresses = aNewDoc.getElementsByTagName("emp:address");
      element = addresses.item(0);
      assertNotNull("empAddressNotNull",element);
aNode = doc.importNode(element,true);
      hasChild = aNode.hasChildNodes();
      assertTrue("throw_True",hasChild);
name = aNode.nodeName;

      assertEquals("nodeName","emp:address",name);
       child = aNode.firstChild;

      value = child.nodeValue;

      assertEquals("nodeValue","27 South Road. Dallas, texas 98556",value);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Element.
   If this document defines default attributes for this element name (importedNode),
   those default attributes are assigned.

   Create an element whose name is "emp:employee" in a different document.
   Invoke method importNode(importedNode,deep) on this document which
   defines default attribute for the element name "emp:employee".
   Method should return an the imported element with an assigned default attribute.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=238
*/
importNode07 : function () {
   var success;
    if(checkInitialization(builder, "importNode07") != null) return;
    var doc;
      var aNewDoc;
      var element;
      var aNode;
      var attributes;
      var name;
      var attr;
      var lname;
      var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "emp:employee";

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staff");
      element = aNewDoc.createElementNS(namespaceURI,qualifiedName);
      aNode = doc.importNode(element,false);
      attributes = aNode.attributes;

      assertSize("throw_Size",1,attributes);
name = aNode.nodeName;

      assertEquals("nodeName","emp:employee",name);
       attr = attributes.item(0);
      lname = attr.localName;

      assertEquals("lname","defaultAttr",lname);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Document_Fragment.

   Create a DocumentFragment in a different document.
   Invoke method importNode(importedNode,deep) on this document
   with importedNode being the newly created DocumentFragment.
   Method should return an empty DocumentFragment that belongs
   to this document whose systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-systemId
*/
importNode08 : function () {
   var success;
    if(checkInitialization(builder, "importNode08") != null) return;
    var doc;
      var aNewDoc;
      var docFrag;
      var aNode;
      var hasChild;
      var ownerDocument;
      var docType;
      var system;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      docFrag = aNewDoc.createDocumentFragment();
      aNode = doc.importNode(docFrag,false);
      hasChild = aNode.hasChildNodes();
      assertFalse("hasChild",hasChild);
ownerDocument = aNode.ownerDocument;

      docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("system",null,null,null,"staffNS.dtd",null,null,null,null,system);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Entity.

   Retrieve entity "ent6" from staffNS.xml document.
   Invoke method importNode(importedNode,deep) on this document.
   Method should return a node of type Entity whose publicId, systemId and
   notationName attributes are copied.
   The returned node should belong to this document whose systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode09 : function () {
   var success;
    if(checkInitialization(builder, "importNode09") != null) return;
    var doc;
      var aNewDoc;
      var doc1Type;
      var entityList;
      var entity2;
      var entity1;
      var ownerDocument;
      var docType;
      var system;
      var entityName;
      var publicVal;
      var notationName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      docType = aNewDoc.doctype;

      entityList = docType.entities;

      assertNotNull("entitiesNotNull",entityList);
entity2 = entityList.getNamedItem("ent6");
      entity1 = doc.importNode(entity2,false);
      ownerDocument = entity1.ownerDocument;

      docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("dtdSystemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
entityName = entity1.nodeName;

      assertEquals("entityName","ent6",entityName);
       publicVal = entity1.publicId;

      assertEquals("entityPublicId","uri",publicVal);
       system = entity1.systemId;

      assertURIEquals("entitySystemId",null,null,null,"file",null,null,null,null,system);
notationName = entity1.notationName;

      assertEquals("notationName","notation2",notationName);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Entity_Reference.
   Only the EntityReference is copied, regardless of deep's value.

   Create an entity reference whose name is "entRef1" in a different document.
   Give it value "entRef1Value".
   Invoke method importNode(importedNode,deep) on this document with importedNode
   being "entRef1".
   Method should return a node of type Entity_Reference (whose value is null) that
   belongs to this document whose systemId is "staff.dtd".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode10 : function () {
   var success;
    if(checkInitialization(builder, "importNode10") != null) return;
    var doc;
      var aNewDoc;
      var entRef;
      var aNode;
      var ownerDocument;
      var docType;
      var system;
      var name;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      entRef = aNewDoc.createEntityReference("entRef1");
      assertNotNull("createdEntRefNotNull",entRef);
entRef.nodeValue = "entRef1Value";

      aNode = doc.importNode(entRef,false);
      ownerDocument = aNode.ownerDocument;

      docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
name = aNode.nodeName;

      assertEquals("nodeName","entRef1",name);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Entity_Reference.
   Only the EntityReference is copied, regardless of deep's value.
   If the Document provides a definition for the entity name, its value is assigned.

   Create an entity reference whose name is "ent3" in a different document.
   Invoke method importNode(importedNode,deep) on this document with importedNode
   being "ent3".
   Method should return a node of type Entity_Reference whose first child's value is "Texas" as defined
   in this document.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode11 : function () {
   var success;
    if(checkInitialization(builder, "importNode11") != null) return;
    var doc;
      var aNewDoc;
      var entRef;
      var aNode;
      var name;
      var child;
      var childValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staff");
      entRef = aNewDoc.createEntityReference("ent3");
      assertNotNull("createdEntRefNotNull",entRef);
aNode = doc.importNode(entRef,true);
      name = aNode.nodeName;

      assertEquals("entityName","ent3",name);
       child = aNode.firstChild;

      assertNotNull("child",child);
childValue = child.nodeValue;

      assertEquals("childValue","Texas",childValue);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Entity.

   Retrieve entity "ent4" from staffNS.xml document.
   Invoke method importNode(importedNode,deep) on this document with deep as false.
   Method should return a node of type Entity whose descendant is copied.
   The returned node should belong to this document whose systemId is "staffNS.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode12 : function () {
   var success;
    if(checkInitialization(builder, "importNode12") != null) return;
    var doc;
      var aNewDoc;
      var doc1Type;
      var entityList;
      var entity2;
      var entity1;
      var ownerDocument;
      var docType;
      var system;
      var entityName;
      var child;
      var childName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      doc1Type = aNewDoc.doctype;

      entityList = doc1Type.entities;

      assertNotNull("entitiesNotNull",entityList);
entity2 = entityList.getNamedItem("ent4");
      entity1 = doc.importNode(entity2,true);
      ownerDocument = entity1.ownerDocument;

      docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
entityName = entity1.nodeName;

      assertEquals("entityName","ent4",entityName);
       child = entity1.firstChild;

      assertNotNull("notnull",child);
childName = child.nodeName;

      assertEquals("childName","entElement1",childName);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Notation.

   Retrieve notation named "notation1" from document staffNS.xml.
   Invoke method importNode(importedNode,deep) where importedNode
   contains the retrieved notation and deep is false.  Method should
   return a node of type notation whose name is "notation1".
   The returned node should belong to this document whose systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode13 : function () {
   var success;
    if(checkInitialization(builder, "importNode13") != null) return;
    var doc;
      var aNewDoc;
      var doc1Type;
      var notationList;
      var notation;
      var aNode;
      var ownerDocument;
      var docType;
      var system;
      var publicVal;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      doc1Type = aNewDoc.doctype;

      notationList = doc1Type.notations;

      assertNotNull("notationsNotNull",notationList);
notation = notationList.getNamedItem("notation1");
      aNode = doc.importNode(notation,false);
      ownerDocument = aNode.ownerDocument;

      docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
publicVal = aNode.publicId;

      assertEquals("publicId","notation1File",publicVal);
       system = aNode.systemId;

      assertNull("notationSystemId",system);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Processing Instruction.

   Create a processing instruction with target as "target1" and data as "data1"
   in a different document. Invoke method importNode(importedNode,deep) on this document.
   Method should return a processing instruction whose target and data match the given
   parameters. The returned PI should belong to this document whose systemId is "staff.dtd".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode14 : function () {
   var success;
    if(checkInitialization(builder, "importNode14") != null) return;
    var doc;
      var aNewDoc;
      var pi;
      var aNode;
      var ownerDocument;
      var docType;
      var system;
      var target;
      var data;
      var result = new Array();


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      pi = aNewDoc.createProcessingInstruction("target1","data1");
      aNode = doc.importNode(pi,false);
      ownerDocument = aNode.ownerDocument;

      assertNotNull("ownerDocumentNotNull",ownerDocument);
docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
target = aNode.target;

      assertEquals("piTarget","target1",target);
       data = aNode.data;

      assertEquals("piData","data1",data);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should import the given importedNode into that Document.
   The importedNode is of type Text.

   Create a text node with value being the string "this is text data" in
   a different document.  Invoke method importNode(importedNode,deep) on
   this document.  Method should return a text node whose value matches
   the above string. The returned node should belong to this document
   whose systemId is "staff.dtd"

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
*/
importNode15 : function () {
   var success;
    if(checkInitialization(builder, "importNode15") != null) return;
    var doc;
      var aNewDoc;
      var text;
      var aNode;
      var ownerDocument;
      var docType;
      var system;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var aNewDocRef = null;
      if (typeof(this.aNewDoc) != 'undefined') {
        aNewDocRef = this.aNewDoc;
      }
      aNewDoc = load(aNewDocRef, "aNewDoc", "staffNS");
      text = aNewDoc.createTextNode("this is text data");
      aNode = doc.importNode(text,false);
      ownerDocument = aNode.ownerDocument;

      assertNotNull("ownerDocumentNotNull",ownerDocument);
docType = ownerDocument.doctype;

      system = docType.systemId;

      assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,system);
value = aNode.nodeValue;

      assertEquals("nodeValue","this is text data",value);

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should raise NOT_SUPPORTED_ERR DOMException if
   the type of node being imported is DocumentType.

   Retrieve document staff.xml and get its type.
   Invoke method importNode(importedNode,deep) where importedNode
   contains the document type of the staff.xml.
   Method should raise NOT_SUPPORT_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NOT_SUPPORTED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Core-Document-importNode')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_SUPPORTED_ERR'])
*/
importNode16 : function () {
   var success;
    if(checkInitialization(builder, "importNode16") != null) return;
    var doc;
      var anotherDoc;
      var docType;
      var node;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var anotherDocRef = null;
      if (typeof(this.anotherDoc) != 'undefined') {
        anotherDocRef = this.anotherDoc;
      }
      anotherDoc = load(anotherDocRef, "anotherDoc", "staffNS");
      docType = anotherDoc.doctype;


	{
		success = false;
		try {
            node = doc.importNode(docType,false);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
*
    The "importNode(importedNode,deep)" method for a
   Document should raise NOT_SUPPORTED_ERR DOMException if
   the type of node being imported is Document.

   Retrieve staff.xml document.
   Invoke method importNode(importedNode,deep) where importedNode
   contains staff.xml and deep is true.
   Method should raise NOT_SUPPORTED_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NOT_SUPPORTED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Core-Document-importNode
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Core-Document-importNode')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_SUPPORTED_ERR'])
*/
importNode17 : function () {
   var success;
    if(checkInitialization(builder, "importNode17") != null) return;
    var doc;
      var anotherDoc;
      var node;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var anotherDocRef = null;
      if (typeof(this.anotherDoc) != 'undefined') {
        anotherDocRef = this.anotherDoc;
      }
      anotherDoc = load(anotherDocRef, "anotherDoc", "staffNS");

	{
		success = false;
		try {
            node = doc.importNode(anotherDoc,false);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
*
    The "getInternalSubset()" method returns
   the internal subset as a string or null if there is none.
   This does not contain the delimiting brackets.

   Retrieve the documenttype.
   Apply the "getInternalSubset()" method.  Null is returned since there
   is not an internal subset.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-internalSubset
*/
internalSubset01 : function () {
   var success;
    if(checkInitialization(builder, "internalSubset01") != null) return;
    var doc;
      var docType;
      var internal;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff2");
      docType = doc.doctype;

      internal = docType.internalSubset;

      assertNull("internalSubsetNull",internal);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   XXX is NOT a legal value for the feature parameter.
    The method should return "false" since XXX is not a valid feature.

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "XXX" and version to "1.0".
    The method should return a boolean "false" since XXX is not a valid feature.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported01 : function () {
   var success;
    if(checkInitialization(builder, "isSupported01") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("XXX","1.0");
      assertFalse("throw_False",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   XML is a legal value for the feature parameter.
    The method should return "false" since 9.0 is not a valid version.

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "XML" and version to "9.0".
    The method should return a boolean "false" since 9.0 is not a valid version.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported02 : function () {
   var success;
    if(checkInitialization(builder, "isSupported02") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("XML","9.0");
      assertFalse("throw_False",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   XML is a legal value for the feature parameter
    (Test for xml, lower case).
    Legal values for the version parameter are 1.0 and 2.0
    (Test for 1.0).

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "xml" and the version equal to 1.0.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported04 : function () {
   var success;
    if(checkInitialization(builder, "isSupported04") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("xml","1.0");
      assertTrue("throw_True",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   Core is a legal value for the feature parameter
    (Test for core, lower case).
    Legal values for the version parameter are 1.0 and 2.0
    (Test for 2.0).

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "core" and the version equal to 2.0.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported05 : function () {
   var success;
    if(checkInitialization(builder, "isSupported05") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("core","2.0");
      assertTrue("throw_True",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   XML is a legal value for the feature parameter
    (Test for xml, lower case).
    Legal values for the version parameter are 1.0 and 2.0
    (Test for 2.0).

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "xml" and the version equal to 2.0.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported06 : function () {
   var success;
    if(checkInitialization(builder, "isSupported06") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("xml","2.0");
      assertTrue("throw_True",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   XML is a legal value for the feature parameter
    (Test for XML).
    If the version is not specified, supporting any version of the
    method to return true.

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "XML" and the version equal blank.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported07 : function () {
   var success;
    if(checkInitialization(builder, "isSupported07") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("XML","");
      assertTrue("throw_True",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   XML is a legal value for the feature parameter
    (Test for XML, upper case).
    Legal values for the version parameter are 1.0 and 2.0
    (Test for 1.0).

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "XML" and the version equal to 1.0.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported09 : function () {
   var success;
    if(checkInitialization(builder, "isSupported09") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("XML","1.0");
      assertTrue("throw_True",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   CORE is a legal value for the feature parameter
    (Test for CORE, upper case).
    Legal values for the version parameter are 1.0 and 2.0
    (Test for 2.0).

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "CORE" and the version equal to 2.0.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported10 : function () {
   var success;
    if(checkInitialization(builder, "isSupported10") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("CORE","2.0");
      assertTrue("throw_True",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   XML is a legal value for the feature parameter
    (Test for XML, upper case).
    Legal values for the version parameter are 1.0 and 2.0
    (Test for 2.0).

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "XML" and the version equal to 2.0.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported11 : function () {
   var success;
    if(checkInitialization(builder, "isSupported11") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("XML","2.0");
      assertTrue("throw_True",state);

},
/**
*
    The "feature" parameter in the
    isSupported(feature,version)" method is the name
    of the feature and the version is the version number of the
    feature to test.   CORE is a legal value for the feature parameter
    (Test for CORE, upper case).
    Legal values for the version parameter are 1.0 and 2.0
    (Test for 1.0).

    Retrieve the root node of the DOM document by invoking
    the "getDocumentElement()" method.   This should create a
    node object on which the "isSupported(feature,version)"
    method is invoked with "feature" equal to "CORE" and the version equal to 1.0.
    The method should return a boolean "true".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
isSupported12 : function () {
   var success;
    if(checkInitialization(builder, "isSupported12") != null) return;
    features = new Array();
      features[0] = "Core";
      features[1] = "XML";
      features[2] = "HTML";
      features[3] = "Views";
      features[4] = "StyleSheets";
      features[5] = "CSS";
      features[6] = "CSS2";
      features[7] = "Events";
      features[8] = "UIEvents";
      features[9] = "MouseEvents";
      features[10] = "MutationEvents";
      features[11] = "HTMLEvents";
      features[12] = "Range";
      features[13] = "Traversal";
      features[14] = "bogus.bogus.bogus";

      var doc;
      var rootNode;
      var featureElement;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("Core","2.0");
      assertTrue("Core2",state);
for(var indexN10078 = 0;indexN10078 < features.length; indexN10078++) {
      featureElement = features[indexN10078];
      state = rootNode.isSupported(featureElement,"1.0");

	}
   for(var indexN10083 = 0;indexN10083 < features.length; indexN10083++) {
      featureElement = features[indexN10083];
      state = rootNode.isSupported(featureElement,"2.0");

	}

},
/**
*
Calls isSupported("Core","") should return true for all implementations (by extension of core-14).

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
*/
isSupported13 : function () {
   var success;
    if(checkInitialization(builder, "isSupported13") != null) return;
    var doc;
      var rootNode;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("Core","");
      assertTrue("Core",state);

},
/**
*
Calls isSupported("Core",null) should return true for all implementations (by extension of core-14).

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
* @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
*/
isSupported14 : function () {
   var success;
    if(checkInitialization(builder, "isSupported14") != null) return;
    var doc;
      var rootNode;
      var state;
      var nullString = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      rootNode = doc.documentElement;

      state = rootNode.isSupported("Core",nullString);
      assertTrue("Core",state);

},
/**
*
    The "getLocalName()" method for a Node
    returns the local part of the qualified name of this node,
    and for nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE
    and nodes created with a DOM Level 1 method, this is null.

    Retrieve the first emp:address node and get the attributes of this node."
    Then apply the getLocalName() method to the emp:domestic attribute.
    The method should return "domestic".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSLocalN
*/
localName01 : function () {
   var success;
    if(checkInitialization(builder, "localName01") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var addrAttr;
      var localName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
addrAttr = testAddr.getAttributeNode("emp:domestic");
      localName = addrAttr.localName;

      assertEquals("localName","domestic",localName);

},
/**
*
  The "getLocalName()" method for a Node
  returns the local part of the qualified name of this node,
  and for nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE
  and nodes created with a DOM Level 1 method, this is null.

  Create an new Element with the createElement() method.
  Invoke the "getLocalName()" method on the newly created element
  node will cause "null" to be returned.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSLocalN
*/
localName02 : function () {
   var success;
    if(checkInitialization(builder, "localName02") != null) return;
    var doc;
      var createdNode;
      var localName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      createdNode = doc.createElement("test:employee");
      localName = createdNode.localName;

      assertNull("localNameNull",localName);

},
/**
*
    The "getLocalName()" method for a Node
    returns the local part of the qualified name of this node,
    and for nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE
    and nodes created with a DOM Level 1 method, this is null.

    Retrieve the first employeeId node and get the first child of this node.
    Since the first child is Text node invoking the "getLocalName()"
    method will cause "null" to be returned.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSLocalN
*/
localName03 : function () {
   var success;
    if(checkInitialization(builder, "localName03") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var textNode;
      var localName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employeeId");
      testEmployee = elementList.item(0);
      textNode = testEmployee.firstChild;

      localName = textNode.localName;

      assertNull("textNodeLocalName",localName);

},
/**
*
    The "getLocalName()" method for a Node
    returns the local part of the qualified name of this node,
    and for nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE
    and nodes created with a DOM Level 1 method, this is null.

    Retrieve the first employee node and invoke the "getLocalName()"
    method.   The method should return "employee".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSLocalN
*/
localName04 : function () {
   var success;
    if(checkInitialization(builder, "localName04") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var employeeLocalName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(0);
      employeeLocalName = testEmployee.localName;

      assertEquals("lname","employee",employeeLocalName);

},
/**
*
	Using the method getNamedItemNS, retreive the entity "ent1" and notation "notation1"
	from a NamedNodeMap of this DocumentTypes entities and notations.
	Both should be null since entities and notations are not namespaced.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=407
* @see http://lists.w3.org/Archives/Member/w3c-dom-ig/2003Nov/0016.html
*/
namednodemapgetnameditemns01 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapgetnameditemns01") != null) return;
    var doc;
      var docType;
      var entities;
      var notations;
      var entity;
      var notation;
      var entityName;
      var notationName;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      entities = docType.entities;

      assertNotNull("entitiesNotNull",entities);
notations = docType.notations;

      assertNotNull("notationsNotNull",notations);
entity = entities.getNamedItemNS(nullNS,"ent1");
      assertNull("entityNull",entity);
    notation = notations.getNamedItemNS(nullNS,"notation1");
      assertNull("notationNull",notation);

},
/**
*
	The method getNamedItemNS retrieves a node specified by local name and namespace URI.

	Using the method getNamedItemNS, retreive an attribute node having namespaceURI=http://www.nist.gov
	and localName=domestic, from a NamedNodeMap of attribute nodes, for the second element
	whose namespaceURI=http://www.nist.gov and localName=address.  Verify if the attr node
	has been retreived successfully by checking its nodeName atttribute.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
*/
namednodemapgetnameditemns02 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapgetnameditemns02") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var elementList;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("http://www.nist.gov","domestic");
      attrName = attribute.nodeName;

      assertEquals("namednodemapgetnameditemns02","emp:domestic",attrName);

},
/**
*
    The method getNamedItemNS retrieves a node specified by local name and namespace URI.

    Create a new Element node and add 2 new attribute nodes having the same local name but different
    namespace names and namespace prefixes to it.  Using the getNamedItemNS retreive the second attribute node.
    Verify if the attr node has been retreived successfully by checking its nodeName atttribute.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
*/
namednodemapgetnameditemns03 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapgetnameditemns03") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var newAttr1;
      var newAttr2;
      var newAttribute;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test","root");
      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      newAttr2 = doc.createAttributeNS("http://www.w3.org/DOM/L2","L2:att");
      newAttribute = element.setAttributeNodeNS(newAttr2);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L2","att");
      attrName = attribute.nodeName;

      assertEquals("namednodemapgetnameditemns03","L2:att",attrName);

},
/**
*
    The method getNamedItemNS retrieves a node specified by local name and namespace URI.

    Retreive the second address element node having localName=adrress.
    Create a new attribute node having the same name as an existing node but different namespaceURI
    and add it to this element.  Using the getNamedItemNS retreive the newly created attribute
    node from a nodemap of attributes of the retreive element node.
    Verify if the attr node has been retreived successfully by checking its nodeName atttribute.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
*/
namednodemapgetnameditemns04 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapgetnameditemns04") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var newAttr1;
      var newAttribute;
      var elementList;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","street");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L1","street");
      attrName = attribute.nodeName;

      assertEquals("namednodemapgetnameditemns04","street",attrName);

},
/**
*
	The method getNamedItemNS retrieves a node specified by local name and namespace URI.

	Retreieve the second address element and its attribute into a named node map.
	Try retreiving the street attribute from the namednodemap using the
	default namespace uri and the street attribute name.  Since the default
	namespace doesnot apply to attributes this should return null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
*/
namednodemapgetnameditemns05 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapgetnameditemns05") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("*","street");
      assertNull("namednodemapgetnameditemns05",attribute);

},
/**
*
    Retreive the second address element node having localName=adrress.  Retreive the attributes
    of this element into 2 nodemaps.  Create a new attribute node and add it to this element.
    Since NamedNodeMaps are live each one should get updated, using the getNamedItemNS retreive
    the newly created attribute from each node map.
    Verify if the attr node has been retreived successfully by checking its nodeName atttribute.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
*/
namednodemapgetnameditemns06 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapgetnameditemns06") != null) return;
    var doc;
      var attributesMap1;
      var attributesMap2;
      var element;
      var attribute;
      var newAttr1;
      var newAttribute;
      var elementList;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      attributesMap1 = element.attributes;

      attributesMap2 = element.attributes;

      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","street");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      attribute = attributesMap1.getNamedItemNS("http://www.w3.org/DOM/L1","street");
      attrName = attribute.nodeName;

      assertEquals("namednodemapgetnameditemnsMap106","street",attrName);
       attribute = attributesMap2.getNamedItemNS("http://www.w3.org/DOM/L1","street");
      attrName = attribute.nodeName;

      assertEquals("namednodemapgetnameditemnsMap206","street",attrName);

},
/**
*
	The method removeNamedItemNS removes a node specified by local name and namespace

	Retreive an attribute node and then remove from the NamedNodeMap.  Verify if the attribute
	node was actually remove from the node map.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
*/
namednodemapremovenameditemns01 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns01") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.removeNamedItemNS("http://www.nist.gov","domestic");
      attribute = attributes.getNamedItemNS("http://www.nist.gov","domestic");
      assertNull("namednodemapremovenameditemns01",attribute);

},
/**
*
   The method removeNamedItemNS removes a node specified by local name and namespace
   A removed attribute may be known to have a default value when this map contains the
   attributes attached to an element, as returned by the attributes attribute of the Node
   interface. If so, an attribute immediately appears containing the default value as well
   as the corresponding namespace URI, local name, and prefix when applicable.

	Retreive a default attribute node.  Remove it from the NodeMap.  Check if a new one immediately
	appears containing the default value.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
namednodemapremovenameditemns02 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns02") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var elementList;
      var attrValue;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.removeNamedItemNS(nullNS,"defaultAttr");
      attribute = attributes.getNamedItemNS(nullNS,"defaultAttr");
      attrValue = attribute.nodeValue;

      assertNotNull("namednodemapremovenameditemns02",attribute);
assertEquals("namednodemapremovenameditemns02_attrValue","defaultVal",attrValue);

},
/**
*
   The method removeNamedItemNS removes a node specified by local name and namespace

	Create a new element node and add 2 new attribute nodes to it that have the same localName
	but different namespaceURI's.  Remove the first attribute node from the namedNodeMap of the
	new element node and check to see that the second attribute still exists.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
*/
namednodemapremovenameditemns03 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns03") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var newAttribute;
      var attribute1;
      var attribute2;
      var nodeName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test","root");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      newAttribute = element.setAttributeNodeNS(attribute1);
      attribute2 = doc.createAttributeNS("http://www.w3.org/DOM/L2","L2:att");
      newAttribute = element.setAttributeNodeNS(attribute2);
      attributes = element.attributes;

      attribute = attributes.removeNamedItemNS("http://www.w3.org/DOM/L1","att");
      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L2","att");
      nodeName = attribute.nodeName;

      assertEquals("namednodemapremovenameditemns02","L2:att",nodeName);

},
/**
*
   The method removeNamedItemNS removes a node specified by local name and namespace

	Attempt to remove the xmlns and dmstc attributes of the first element node with the localName
	employee.  Verify if the 2 attributes were successfully removed.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
*/
namednodemapremovenameditemns04 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns04") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var attributeRemoved;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","employee");
      element = elementList.item(0);
      attributes = element.attributes;

      attributeRemoved = attributes.removeNamedItemNS("http://www.w3.org/2000/xmlns/","xmlns");
      attribute = attributes.getNamedItemNS("http://www.w3.org/2000/xmlns/","xmlns");
      assertNull("namednodemapremovenameditemns04_1",attribute);
    attributeRemoved = attributes.removeNamedItemNS("http://www.w3.org/2000/xmlns/","dmstc");
      attribute = attributes.getNamedItemNS("http://www.w3.org/2000/xmlns/","dmstc");
      assertNull("namednodemapremovenameditemns04_2",attribute);

},
/**
*
	Retreive an entity and notation node and remove the first notation from the
	entity node map and first entity node from the notation map.  Since both these
	maps are readonly, a NO_MODIFICATION_ALLOWED_ERR should be raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=407
* @see http://lists.w3.org/Archives/Member/w3c-dom-ig/2003Nov/0016.html
*/
namednodemapremovenameditemns05 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns05") != null) return;
    var doc;
      var docType;
      var entities;
      var notations;
      var removedNode;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      entities = docType.entities;

      assertNotNull("entitiesNotNull",entities);
notations = docType.notations;

      assertNotNull("notationsNotNull",notations);

      try {
      removedNode = entities.removeNamedItemNS(nullNS,"ent1");
      fail("entity_throw_DOMException");

      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
       break;
      case /* NO_MODIFICATION_ALLOWED_ERR */ 7 :
       break;
          default:
          throw ex;
          }
       } else {
       throw ex;
        }
         }

      try {
      removedNode = notations.removeNamedItemNS(nullNS,"notation1");
      fail("notation_throw_DOMException");

      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
       break;
      case /* NO_MODIFICATION_ALLOWED_ERR */ 7 :
       break;
          default:
          throw ex;
          }
       } else {
       throw ex;
        }
         }

},
/**
*
   The method removeNamedItemNS removes a node using its namespaceURI and localName and
   raises a NOT_FOUND_ERR if there is no node with the specified namespaceURI and
   localName in this map

	Retreive an attribute node into a namednodemap.  While removing it from the map specify
	an incorrect namespaceURI.  This should raise a NOT_FOUND_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
*/
namednodemapremovenameditemns06 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns06") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");
      element = elementList.item(1);
      attributes = element.attributes;


	{
		success = false;
		try {
            attribute = attributes.removeNamedItemNS("http://www.Nist.gov","domestic");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
*
   The method removeNamedItemNS removes a node using its namespaceURI and localName and
   raises a NOT_FOUND_ERR if there is no node with the specified namespaceURI and
   localName in this map

	Retreive an attribute node from a namednodemap.  While removing it from the map specify
	an incorrect localName.  This should raise a NOT_FOUND_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
*/
namednodemapremovenameditemns07 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns07") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","employee");
      element = elementList.item(1);
      attributes = element.attributes;


	{
		success = false;
		try {
            attribute = attributes.removeNamedItemNS("http://www.nist.gov","domestic");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
*
   The method removeNamedItemNS removes a node using its namespaceURI and localName and
   raises a NOT_FOUND_ERR if there is no node with the specified namespaceURI and
   localName in this map

	Retreive an attribute node from a namednodemap.  Remove the attribute node from the document
	object.  Since NamedNodeMaps are live it should also automatically get removed from
	the node map.  And so if an attempt is made to remove it using removeAttributeNS, this should
	raise a NOT_FOUND_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
*/
namednodemapremovenameditemns08 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns08") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      element.removeAttributeNS("http://www.nist.gov","domestic");

	{
		success = false;
		try {
            attribute = attributes.removeNamedItemNS("http://www.nist.gov","domestic");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
*
   The method removeNamedItemNS removes a node using its namespaceURI and localName and
   raises a NOT_FOUND_ERR if there is no node with the specified namespaceURI and
   localName in this map

	Retreive an attribute node.  Remove the attribute node from the node map.
	Check the element object to ensure that the attribute node has been removed from it.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
*/
namednodemapremovenameditemns09 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapremovenameditemns09") != null) return;
    var doc;
      var attributes;
      var newAttributes;
      var element;
      var attribute;
      var elementList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.removeNamedItemNS("http://www.nist.gov","domestic");
      newAttributes = element.attributes;

      attribute = newAttributes.getNamedItemNS("http://www.nist.gov","domestic");
      assertNull("namednodemapremovenameditemns09",attribute);

},
/**
*
	The method setNamedItemNS adds a node using its namespaceURI and localName. If a node with
	that namespace URI and that local name is already present in this map, it is replaced
	by the new one.

	Retreive the first element whose localName is address and namespaceURI http://www.nist.gov",
	and put its attributes into a named node map.  Create a new attribute node and add it to this map.
	Verify if the attr node was successfully added by checking the nodeName of the retreived atttribute.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getNamedItemNS
*/
namednodemapsetnameditemns01 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns01") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var newAttribute;
      var newAttr1;
      var elementList;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(0);
      attributes = element.attributes;

      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","streets");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L1","streets");
      attrName = attribute.nodeName;

      assertEquals("namednodemapsetnameditemns01","streets",attrName);

},
/**
*
	The method setNamedItemNS adds a node using its namespaceURI and localName. If a node with
	that namespace URI and that local name is already present in this map, it is replaced
	by the new one.

	Create a new element and attribute Node and add the newly created attribute node to the elements
	NamedNodeMap.  Verify if the new attr node has been successfully added to the map by checking
	the nodeName of the retreived atttribute from the list of attribute nodes in this map.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
*/
namednodemapsetnameditemns02 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns02") != null) return;
    var doc;
      var attributes;
      var element;
      var attribute;
      var attribute1;
      var newNode;
      var attrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test","root");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      attributes = element.attributes;

      newNode = attributes.setNamedItemNS(attribute1);
      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L1","att");
      attrName = attribute.nodeName;

      assertEquals("namednodemapsetnameditemns02","L1:att",attrName);

},
/**
*
	The method setNamedItemNS adds a node using its namespaceURI and localName and
	raises a WRONG_DOCUMENT_ERR if arg was created from a different document than the
	one that created this map.

	Retreieve the second element whose local name is address and its attribute into a named node map.
	Do the same for another document and retreive its street attribute.  Call the setNamedItemNS
	using the first namedNodeMap and the retreive street attribute of the second.  This should
	raise a WRONG_DOCUMENT_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=408
*/
namednodemapsetnameditemns03 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns03") != null) return;
    var doc;
      var docAlt;
      var attributes;
      var attributesAlt;
      var elementList;
      var elementListAlt;
      var element;
      var elementAlt;
      var attr;
      var newNode;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      attributes = element.attributes;


      var docAltRef = null;
      if (typeof(this.docAlt) != 'undefined') {
        docAltRef = this.docAlt;
      }
      docAlt = load(docAltRef, "docAlt", "staffNS");
      elementListAlt = docAlt.getElementsByTagNameNS("*","address");
      elementAlt = elementListAlt.item(1);
      attributesAlt = elementAlt.attributes;

      attr = attributesAlt.getNamedItemNS(nullNS,"street");
      newNode = attributesAlt.removeNamedItemNS(nullNS,"street");

	{
		success = false;
		try {
            newNode = attributes.setNamedItemNS(attr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
*
	The method setNamedItemNS adds a node using its namespaceURI and localName and
	raises a WRONG_DOCUMENT_ERR if arg was created from a different document than the
	one that created this map.

	Retreieve the second element whose local name is address and its attribute into a named node map.
	Create a new document and a new attribute node in it.  Call the setNamedItemNS using the first
	namedNodeMap and the new attribute node attribute of the new document.  This should
	raise a WRONG_DOCUMENT_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
namednodemapsetnameditemns04 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns04") != null) return;
    var doc;
      var domImpl;
      var docAlt;
      var docType = null;

      var attributes;
      var elementList;
      var element;
      var attrAlt;
      var newNode;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      attributes = element.attributes;

      domImpl = doc.implementation;
docAlt = domImpl.createDocument(nullNS,"newDoc",docType);
      attrAlt = docAlt.createAttributeNS(nullNS,"street");

	{
		success = false;
		try {
            newNode = attributes.setNamedItemNS(attrAlt);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
*
	Retreive an entity and notation node and add the first notation to the
	notation node map and first entity node to the entity map.  Since both these
	maps are for readonly node, a NO_MODIFICATION_ALLOWED_ERR should be raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=407
* @see http://lists.w3.org/Archives/Member/w3c-dom-ig/2003Nov/0016.html
*/
namednodemapsetnameditemns05 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns05") != null) return;
    var doc;
      var docType;
      var entities;
      var notations;
      var entity;
      var notation;
      var newNode;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      entities = docType.entities;

      assertNotNull("entitiesNotNull",entities);
notations = docType.notations;

      assertNotNull("notationsNotNull",notations);
entity = entities.getNamedItem("ent1");
      notation = notations.getNamedItem("notation1");

	{
		success = false;
		try {
            newNode = entities.setNamedItemNS(entity);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_entities",success);
	}

	{
		success = false;
		try {
            newNode = notations.setNamedItemNS(notation);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_notations",success);
	}

},
/**
*
	Retreieve the first element whose localName is address and its attributes into a named node map.
	Retreiving the domestic attribute from the namednodemap.
	Retreieve the second element whose localName is address and its attributes into a named node map.
	Invoke setNamedItemNS on the second NamedNodeMap specifying the first domestic attribute from
	the first map.  This should raise an INUSE_ATTRIBIUTE_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
*/
namednodemapsetnameditemns06 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns06") != null) return;
    var doc;
      var attributes;
      var elementList;
      var element;
      var attr;
      var newNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(0);
      attributes = element.attributes;

      attr = attributes.getNamedItemNS("http://www.usa.com","domestic");
      element = elementList.item(1);
      attributes = element.attributes;


	{
		success = false;
		try {
            newNode = attributes.setNamedItemNS(attr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 10);
		}
		assertTrue("namednodemapsetnameditemns06",success);
	}

},
/**
*
	The method setNamedItemNS adds a node using its namespaceURI and localName and
	raises a INUSE_ATTRIBUTE_ERR Raised if arg is an Attr that is already an
	attribute of another Element object.

	Retreieve the attributes of first element whose localName is address into a named node map.
	Retreive the attribute whose namespaceURI=http://www.usa.com and localName=domestic
	from the NamedNodeMap.  Retreieve the attributes of second element whose localName is address
	into a named node map.  Call the setNamedItemNS method on the second nodemap with the domestic
	attribute that was retreived and removed from the first nodeMap as an argument.
	Assuming that when an attribute is removed from a nodemap, it still remains in the domtree
	his should raise an INUSE_ATTRIBIUTE_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
*/
namednodemapsetnameditemns07 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns07") != null) return;
    var doc;
      var attributes;
      var elementList;
      var element;
      var attr;
      var newNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(0);
      attributes = element.attributes;

      attr = attributes.getNamedItemNS("http://www.usa.com","domestic");
      element = elementList.item(1);
      attributes = element.attributes;


	{
		success = false;
		try {
            newNode = attributes.setNamedItemNS(attr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 10);
		}
		assertTrue("namednodemapsetnameditemns07",success);
	}

},
/**
*
    raises a INUSE_ATTRIBUTE_ERR Raised if arg is an Attr that is already an
    attribute of another Element object.

	Retreieve the first element whose localName is address and its attributes into a named node map.
	Retreiving the domestic attribute from the namednodemap.	 Retreieve the second element whose
	localName is address and its attributes into a named node map.	Invoke setNamedItemNS on the
	second NamedNodeMap specifying the attribute from the first map.
	This should raise an INUSE_ATTRIBIUTE_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
*/
namednodemapsetnameditemns08 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns08") != null) return;
    var doc;
      var attributes;
      var elementList;
      var element;
      var attr;
      var newNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(0);
      attributes = element.attributes;

      attr = attributes.getNamedItemNS("http://www.usa.com","domestic");
      element = elementList.item(1);
      attributes = element.attributes;


	{
		success = false;
		try {
            newNode = attributes.setNamedItemNS(attr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 10);
		}
		assertTrue("namednodemapsetnameditemns08",success);
	}

},
/**
*
	The method setNamedItemNS adds a node using its namespaceURI and localName and
	raises a NO_MODIFICATION_ALLOWED_ERR if this map is readonly.

	Create a new attribute node and attempt to add it to the nodemap of entities and notations
	for this documenttype.  This should reaise a NO_MODIFICATION_ALLOWED_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
*/
namednodemapsetnameditemns09 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns09") != null) return;
    var doc;
      var docType;
      var entities;
      var notations;
      var attr;
      var newNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      entities = docType.entities;

      notations = docType.notations;

      attr = doc.createAttributeNS("http://www.w3.org/DOM/Test","test");

	{
		success = false;
		try {
            newNode = entities.setNamedItemNS(attr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_entities",success);
	}

	{
		success = false;
		try {
            newNode = notations.setNamedItemNS(attr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_notations",success);
	}

},
/**
*
    The method setNamedItemNS adds a node using its namespaceURI and localName and
    raises a HIERARCHY_REQUEST_ERR if an attempt is made to add a node doesn't belong
    in this NamedNodeMap.

	 Attempt to add an entity to a NamedNodeMap of attribute nodes,
	 Since nodes of this type cannot be added to the attribute node map a HIERARCHY_REQUEST_ERR
	 should be raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
namednodemapsetnameditemns10 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns10") != null) return;
    var doc;
      var docType;
      var entities;
      var attributes;
      var entity;
      var notation;
      var element;
      var elementList;
      var newNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      entities = docType.entities;

      assertNotNull("entitiesNotNull",entities);
entity = entities.getNamedItem("ent1");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(0);
      attributes = element.attributes;


	{
		success = false;
		try {
            newNode = attributes.setNamedItemNS(entity);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
*
    The method setNamedItemNS adds a node using its namespaceURI and localName and
    raises a HIERARCHY_REQUEST_ERR if an attempt is made to add a node doesn't belong
    in this NamedNodeMap.

	 Attempt to add a notation node to a NamedNodeMap of attribute nodes,
	 Since notations nodes do not belong in the attribute node map a HIERARCHY_REQUEST_ERR
	 should be raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
namednodemapsetnameditemns11 : function () {
   var success;
    if(checkInitialization(builder, "namednodemapsetnameditemns11") != null) return;
    var doc;
      var docType;
      var notations;
      var attributes;
      var notation;
      var element;
      var elementList;
      var newNode;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      notations = docType.notations;

      assertNotNull("notationsNotNull",notations);
notation = notations.getNamedItem("notation1");
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(0);
      attributes = element.attributes;


	{
		success = false;
		try {
            newNode = attributes.setNamedItemNS(notation);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
*
    The "getNamespaceURI()" method for an Attribute
    returns the namespace URI of this node, or null if unspecified.

    Retrieve the first "emp:address" node which has an attribute of "emp:district"
    that is specified in the DTD.
    Invoke the "getNamespaceURI()" method on the attribute.
    The method should return "http://www.nist.gov".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSname
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=238
*/
namespaceURI01 : function () {
   var success;
    if(checkInitialization(builder, "namespaceURI01") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var addrAttr;
      var attrNamespaceURI;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      addrAttr = testAddr.getAttributeNodeNS("http://www.nist.gov","district");
      attrNamespaceURI = addrAttr.namespaceURI;

      assertEquals("namespaceURI","http://www.nist.gov",attrNamespaceURI);

},
/**
*
    The "getNamespaceURI()" method for an Attribute
    returns the namespace URI of this node, or null if unspecified.

    Retrieve the first emp:address node and get the emp:domestic attribute.
    Invoke the "getNamespaceURI()" method on the attribute.
    The method should return "http://www.nist.gov".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSname
*/
namespaceURI02 : function () {
   var success;
    if(checkInitialization(builder, "namespaceURI02") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var addrAttr;
      var attrNamespaceURI;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddressNotNull",testAddr);
addrAttr = testAddr.getAttributeNodeNS("http://www.nist.gov","domestic");
      attrNamespaceURI = addrAttr.namespaceURI;

      assertEquals("namespaceURI","http://www.nist.gov",attrNamespaceURI);

},
/**
*
    The "getNamespaceURI()" method for a Node
    returns the namespace URI of this node, or null if unspecified.

    Retrieve the first employee node and invoke the "getNamespaceURI()"
    method.   The method should return "http://www.nist.gov".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSname
*/
namespaceURI03 : function () {
   var success;
    if(checkInitialization(builder, "namespaceURI03") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var employeeNamespace;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(0);
      assertNotNull("employeeNotNull",testEmployee);
employeeNamespace = testEmployee.namespaceURI;

      assertEquals("namespaceURI","http://www.nist.gov",employeeNamespace);

},
/**
*
    The "getNamespaceURI()" method for a Node
    returns the namespace URI of this node, or null if unspecified.

    Retrieve the second employee node and invoke the "getNamespaceURI()"
    method.   The method should return "null".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSname
*/
namespaceURI04 : function () {
   var success;
    if(checkInitialization(builder, "namespaceURI04") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var employeeNamespace;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(1);
      employeeNamespace = testEmployee.namespaceURI;

      assertNull("throw_Null",employeeNamespace);

},
/**
*
	The method getLocalName returns the local part of the qualified name of this node.

	Ceate two new element nodes and atribute nodes, with and without namespace prefixes.
	Retreive the local part of their qualified names using getLocalName and verrify
	if it is correct.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSLocalN
*/
nodegetlocalname03 : function () {
   var success;
    if(checkInitialization(builder, "nodegetlocalname03") != null) return;
    var doc;
      var element;
      var qelement;
      var attr;
      var qattr;
      var localElemName;
      var localQElemName;
      var localAttrName;
      var localQAttrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/elem","elem");
      qelement = doc.createElementNS("http://www.w3.org/DOM/Test/elem","qual:qelem");
      attr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","attr");
      qattr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","qual:qattr");
      localElemName = element.localName;

      localQElemName = qelement.localName;

      localAttrName = attr.localName;

      localQAttrName = qattr.localName;

      assertEquals("nodegetlocalname03_localElemName","elem",localElemName);
       assertEquals("nodegetlocalname03_localQElemName","qelem",localQElemName);
       assertEquals("nodegetlocalname03_localAttrName","attr",localAttrName);
       assertEquals("nodegetlocalname03_localQAttrName","qattr",localQAttrName);

},
/**
*
	The method getNamespaceURI returns the namespace URI of this node, or null if it is unspecified
	For nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE and nodes created with
	a DOM Level 1 method, such as createElement from the Document interface, this is always null.

	Ceate two new element nodes and atribute nodes, with and without namespace prefixes.
	Retreive their namespaceURI's using getNamespaceURI and verrify if it is correct.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSname
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
nodegetnamespaceuri03 : function () {
   var success;
    if(checkInitialization(builder, "nodegetnamespaceuri03") != null) return;
    var doc;
      var element;
      var elementNS;
      var attr;
      var attrNS;
      var elemNSURI;
      var elemNSURINull;
      var attrNSURI;
      var attrNSURINull;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS(nullNS,"elem");
      elementNS = doc.createElementNS("http://www.w3.org/DOM/Test/elem","qual:qelem");
      attr = doc.createAttributeNS(nullNS,"attr");
      attrNS = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","qual:qattr");
      elemNSURI = elementNS.namespaceURI;

      elemNSURINull = element.namespaceURI;

      attrNSURI = attrNS.namespaceURI;

      attrNSURINull = attr.namespaceURI;

      assertEquals("nodegetnamespaceuri03_elemNSURI","http://www.w3.org/DOM/Test/elem",elemNSURI);
       assertNull("nodegetnamespaceuri03_1",elemNSURINull);
    assertEquals("nodegetnamespaceuri03_attrNSURI","http://www.w3.org/DOM/Test/attr",attrNSURI);
       assertNull("nodegetnamespaceuri03_2",attrNSURINull);

},
/**
*
	The method getOwnerDocument returns the Document object associated with this node

	Create a new DocumentType node.  Since this node is not used with any Document yet
	verify if the ownerDocument is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#node-ownerDoc
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
nodegetownerdocument01 : function () {
   var success;
    if(checkInitialization(builder, "nodegetownerdocument01") != null) return;
    var doc;
      var ownerDoc;
      var domImpl;
      var docType;
      var nullID = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      domImpl = doc.implementation;
docType = domImpl.createDocumentType("mydoc",nullID,nullID);
      ownerDoc = docType.ownerDocument;

      assertNull("nodegetownerdocument01",ownerDoc);

},
/**
*
	The method getOwnerDocument returns the Document object associated with this node

	Create a new Document node.  Since this node is not used with any Document yet
	verify if the ownerDocument is null.  Create a new element Node on the new Document
	object.  Check the ownerDocument of the new element node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#node-ownerDoc
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
nodegetownerdocument02 : function () {
   var success;
    if(checkInitialization(builder, "nodegetownerdocument02") != null) return;
    var doc;
      var newDoc;
      var newElem;
      var ownerDocDoc;
      var ownerDocElem;
      var domImpl;
      var docType;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      domImpl = doc.implementation;
docType = domImpl.createDocumentType("mydoc",nullNS,nullNS);
      newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","mydoc",docType);
      ownerDocDoc = newDoc.ownerDocument;

      assertNull("nodegetownerdocument02_1",ownerDocDoc);
    newElem = newDoc.createElementNS("http://www.w3.org/DOM/Test","myelem");
      ownerDocElem = newElem.ownerDocument;

      assertNotNull("nodegetownerdocument02_2",ownerDocElem);

},
/**
*
    The method getPrefix returns the namespace prefix of this node, or null if it is unspecified.

	 Ceate two new element nodes and atribute nodes, with and without namespace prefixes.
	 Retreive the prefix part of their qualified names using getPrefix and verify
	 if it is correct.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodegetprefix03 : function () {
   var success;
    if(checkInitialization(builder, "nodegetprefix03") != null) return;
    var doc;
      var element;
      var qelement;
      var attr;
      var qattr;
      var elemNoPrefix;
      var elemPrefix;
      var attrNoPrefix;
      var attrPrefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/elem","elem");
      qelement = doc.createElementNS("http://www.w3.org/DOM/Test/elem","qual:qelem");
      attr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","attr");
      qattr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","qual:qattr");
      elemNoPrefix = element.prefix;

      elemPrefix = qelement.prefix;

      attrNoPrefix = attr.prefix;

      attrPrefix = qattr.prefix;

      assertNull("nodegetprefix03_1",elemNoPrefix);
    assertEquals("nodegetprefix03_2","qual",elemPrefix);
       assertNull("nodegetprefix03_3",attrNoPrefix);
    assertEquals("nodegetprefix03_4","qual",attrPrefix);

},
/**
*
	The method hasAttributes returns whether this node (if it is an element) has any attributes.

	Retreive an element node without attributes.  Verify if hasAttributes returns false.
	Retreive another element node with attributes.  Verify if hasAttributes returns true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
nodehasattributes01 : function () {
   var success;
    if(checkInitialization(builder, "nodehasattributes01") != null) return;
    var doc;
      var element;
      var elementList;
      var hasAttributes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("employee");
      element = elementList.item(0);
      hasAttributes = element.hasAttributes();
      assertFalse("nodehasattributes01_1",hasAttributes);
elementList = doc.getElementsByTagName("address");
      element = elementList.item(0);
      hasAttributes = element.hasAttributes();
      assertTrue("nodehasattributes01_2",hasAttributes);

},
/**
*

	The method hasAttributes returns whether this node (if it is an element) has any attributes.



	Retrieve the docType node.	 Since this is not an element node check if hasAttributes returns

	null.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
nodehasattributes02 : function () {
   var success;
    if(checkInitialization(builder, "nodehasattributes02") != null) return;
    var doc;
      var docType;
      var hasAttributes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      hasAttributes = docType.hasAttributes();
      assertFalse("nodehasattributes02",hasAttributes);

},
/**
*
	The method hasAttributes returns whether this node (if it is an element) has any attributes.

	Retreive an element node with a default attributes.  Verify if hasAttributes returns true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
nodehasattributes03 : function () {
   var success;
    if(checkInitialization(builder, "nodehasattributes03") != null) return;
    var doc;
      var element;
      var elementList;
      var hasAttributes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:employee");
      element = elementList.item(0);
      assertNotNull("empEmployeeNotNull",element);
hasAttributes = element.hasAttributes();
      assertTrue("hasAttributes",hasAttributes);

},
/**
*
	The method hasAttributes returns whether this node (if it is an element) has any attributes.

	Create a new Document, Element and Attr node.  Add the Attr to the Element and append the
	Element to the Document.  Retreive the newly created element node from the document and check
	if it has attributes using hasAttributes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
*/
nodehasattributes04 : function () {
   var success;
    if(checkInitialization(builder, "nodehasattributes04") != null) return;
    var doc;
      var newDoc;
      var docType = null;

      var domImpl;
      var element;
      var elementTest;
      var elementDoc;
      var attribute;
      var setNode;
      var appendedChild;
      var elementList;
      var hasAttributes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","test",docType);
      element = newDoc.createElementNS("http://www.w3.org/DOM/Test","dom:elem");
      attribute = newDoc.createAttribute("attr");
      setNode = element.setAttributeNode(attribute);
      elementDoc = newDoc.documentElement;

      appendedChild = elementDoc.appendChild(element);
      elementList = newDoc.getElementsByTagNameNS("http://www.w3.org/DOM/Test","elem");
      elementTest = elementList.item(0);
      hasAttributes = elementTest.hasAttributes();
      assertTrue("nodehasattributes04",hasAttributes);

},
/**
*
	The method "isSupported(feature,version)" Tests whether the DOM implementation
	implements a specific feature and that feature is supported by this node.

	Call the isSupported method on the document element node with a combination of features
	versions and versions as below.  Valid feature names are case insensitive and versions
	"2.0", "1.0" and if the version is not specified, supporting any version of the feature
	should return true.  Check if the value returned value was true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
nodeissupported01 : function () {
   var success;
    if(checkInitialization(builder, "nodeissupported01") != null) return;
    var doc;
      var element;
      var version = "";
      var version1 = "1.0";
      var version2 = "2.0";
      var featureCore;
      var featureXML;
      var success;
      featuresXML = new Array();
      featuresXML[0] = "XML";
      featuresXML[1] = "xmL";

      featuresCore = new Array();
      featuresCore[0] = "Core";
      featuresCore[1] = "CORE";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.documentElement;

      for(var indexN10063 = 0;indexN10063 < featuresXML.length; indexN10063++) {
      featureXML = featuresXML[indexN10063];
      success = element.isSupported(featureXML,version);
      assertTrue("nodeissupported01_XML1",success);
success = element.isSupported(featureXML,version1);
      assertTrue("nodeissupported01_XML2",success);

	}
   for(var indexN1007C = 0;indexN1007C < featuresCore.length; indexN1007C++) {
      featureCore = featuresCore[indexN1007C];
      success = element.isSupported(featureCore,version);
      assertTrue("nodeissupported01_Core1",success);
success = element.isSupported(featureCore,version1);
      success = element.isSupported(featureCore,version2);
      assertTrue("nodeissupported01_Core3",success);

	}

},
/**
*
	The method "isSupported(feature,version)" Tests whether the DOM implementation
	implements a specific feature and that feature is supported by this node.

	Call the isSupported method on a new attribute node with a combination of features
	versions and versions as below.  Valid feature names are case insensitive and versions
	"2.0", "1.0" and if the version is not specified, supporting any version of the feature
	should return true.  Check if the value returned value was true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
nodeissupported02 : function () {
   var success;
    if(checkInitialization(builder, "nodeissupported02") != null) return;
    var doc;
      var attribute;
      var version = "";
      var version1 = "1.0";
      var version2 = "2.0";
      var featureCore;
      var featureXML;
      var success;
      featuresXML = new Array();
      featuresXML[0] = "XML";
      featuresXML[1] = "xmL";

      featuresCore = new Array();
      featuresCore[0] = "Core";
      featuresCore[1] = "CORE";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      attribute = doc.createAttribute("TestAttr");
      for(var indexN10064 = 0;indexN10064 < featuresXML.length; indexN10064++) {
      featureXML = featuresXML[indexN10064];
      success = attribute.isSupported(featureXML,version);
      assertTrue("nodeissupported02_XML1",success);
success = attribute.isSupported(featureXML,version1);
      assertTrue("nodeissupported02_XML2",success);

	}
   for(var indexN1007D = 0;indexN1007D < featuresCore.length; indexN1007D++) {
      featureCore = featuresCore[indexN1007D];
      success = attribute.isSupported(featureCore,version);
      assertTrue("nodeissupported02_Core1",success);
success = attribute.isSupported(featureCore,version1);
      success = attribute.isSupported(featureCore,version2);
      assertTrue("nodeissupported02_Core3",success);

	}

},
/**
*

	The method "isSupported(feature,version)" Tests whether the DOM implementation

	implements a specific feature and that feature is supported by this node.



	Call the isSupported method specifying empty strings for feature and version on a docType

	Node.  Check if the value returned value was false.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
nodeissupported03 : function () {
   var success;
    if(checkInitialization(builder, "nodeissupported03") != null) return;
    var doc;
      var docType;
      var success;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      success = docType.isSupported("","");
      assertFalse("nodeissupported03",success);

},
/**
*
	The method "isSupported(feature,version)" Tests whether the DOM implementation
	implements a specific feature and that feature is supported by this node.

	Call the isSupported method specifying empty strings for feature and version on a
	new EntityReference node.  Check if the value returned value was false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
nodeissupported04 : function () {
   var success;
    if(checkInitialization(builder, "nodeissupported04") != null) return;
    var doc;
      var entRef;
      var success;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      entRef = doc.createEntityReference("ent1");
      assertNotNull("createdEntRefNotNull",entRef);
success = entRef.isSupported("XML CORE","");
      assertFalse("nodeissupported04",success);

},
/**
*

	The method "isSupported(feature,version)" Tests whether the DOM implementation

	implements a specific feature and that feature is supported by this node.



	Call the isSupported method specifying bad values for feature and version on a new

	Processing Instruction node.  Check if the value returned from this method value was false.


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-Node-supports
*/
nodeissupported05 : function () {
   var success;
    if(checkInitialization(builder, "nodeissupported05") != null) return;
    var doc;
      var pi;
      var success;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      pi = doc.createProcessingInstruction("PITarget","PIData");
      success = pi.isSupported("-","+");
      assertFalse("nodeissupported05",success);

},
/**
*
	The method "normalize" puts all Text nodes in the full depth of the sub-tree underneath
	this Node, including attribute nodes, into a "normal" form where only structure
	(e.g., elements, comments, processing instructions, CDATA sections, and entity references)
	separates Text nodes, i.e., there are neither adjacent Text nodes nor empty Text nodes.

	Create a dom tree consisting of elements, comments, processing instructions, CDATA sections,
	and entity references nodes seperated by text nodes.  Check the length of the node list of each
	before and after normalize has been called.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-normalize
*/
nodenormalize01 : function () {
   var success;
    if(checkInitialization(builder, "nodenormalize01") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var docType;
      var docTypeNull = null;

      var documentElement;
      var element1;
      var element2;
      var element3;
      var element4;
      var element5;
      var element6;
      var element7;
      var text1;
      var text2;
      var text3;
      var pi;
      var cData;
      var comment;
      var entRef;
      var elementList;
      var appendedChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","dom:root",docTypeNull);
      element1 = newDoc.createElement("element1");
      element2 = newDoc.createElement("element2");
      element3 = newDoc.createElement("element3");
      element4 = newDoc.createElement("element4");
      element5 = newDoc.createElement("element5");
      element6 = newDoc.createElement("element6");
      element7 = newDoc.createElement("element7");
      text1 = newDoc.createTextNode("text1");
      text2 = newDoc.createTextNode("text2");
      text3 = newDoc.createTextNode("text3");
      cData = newDoc.createCDATASection("Cdata");
      comment = newDoc.createComment("comment");
      pi = newDoc.createProcessingInstruction("PITarget","PIData");
      entRef = newDoc.createEntityReference("EntRef");
      assertNotNull("createdEntRefNotNull",entRef);
documentElement = newDoc.documentElement;

      appendedChild = documentElement.appendChild(element1);
      appendedChild = element2.appendChild(text1);
      appendedChild = element2.appendChild(text2);
      appendedChild = element2.appendChild(text3);
      appendedChild = element1.appendChild(element2);
      text1 = text1.cloneNode(false);
      text2 = text2.cloneNode(false);
      appendedChild = element3.appendChild(entRef);
      appendedChild = element3.appendChild(text1);
      appendedChild = element3.appendChild(text2);
      appendedChild = element1.appendChild(element3);
      text1 = text1.cloneNode(false);
      text2 = text2.cloneNode(false);
      appendedChild = element4.appendChild(cData);
      appendedChild = element4.appendChild(text1);
      appendedChild = element4.appendChild(text2);
      appendedChild = element1.appendChild(element4);
      text2 = text2.cloneNode(false);
      text3 = text3.cloneNode(false);
      appendedChild = element5.appendChild(comment);
      appendedChild = element5.appendChild(text2);
      appendedChild = element5.appendChild(text3);
      appendedChild = element1.appendChild(element5);
      text2 = text2.cloneNode(false);
      text3 = text3.cloneNode(false);
      appendedChild = element6.appendChild(pi);
      appendedChild = element6.appendChild(text2);
      appendedChild = element6.appendChild(text3);
      appendedChild = element1.appendChild(element6);
      entRef = entRef.cloneNode(false);
      text1 = text1.cloneNode(false);
      text2 = text2.cloneNode(false);
      text3 = text3.cloneNode(false);
      appendedChild = element7.appendChild(entRef);
      appendedChild = element7.appendChild(text1);
      appendedChild = element7.appendChild(text2);
      appendedChild = element7.appendChild(text3);
      appendedChild = element1.appendChild(element7);
      elementList = element1.childNodes;

      assertSize("nodeNormalize01_1Bef",6,elementList);
elementList = element2.childNodes;

      assertSize("nodeNormalize01_2Bef",3,elementList);
elementList = element3.childNodes;

      assertSize("nodeNormalize01_3Bef",3,elementList);
elementList = element4.childNodes;

      assertSize("nodeNormalize01_4Bef",3,elementList);
elementList = element5.childNodes;

      assertSize("nodeNormalize01_5Bef",3,elementList);
elementList = element6.childNodes;

      assertSize("nodeNormalize01_6Bef",3,elementList);
elementList = element7.childNodes;

      assertSize("nodeNormalize01_7Bef",4,elementList);
newDoc.normalize();
      elementList = element1.childNodes;

      assertSize("nodeNormalize01_1Aft",6,elementList);
elementList = element2.childNodes;

      assertSize("nodeNormalize01_2Aft",1,elementList);
elementList = element3.childNodes;

      assertSize("nodeNormalize01_3Aft",2,elementList);
elementList = element4.childNodes;

      assertSize("nodeNormalize01_4Aft",2,elementList);
elementList = element5.childNodes;

      assertSize("nodeNormalize01_5Aft",2,elementList);
elementList = element6.childNodes;

      assertSize("nodeNormalize01_6Aft",2,elementList);
elementList = element7.childNodes;

      assertSize("nodeNormalize01_7Aft",2,elementList);

},
/**
*
	The method setPrefix sets the namespace prefix of this node.  Note that setting this attribute,
	when permitted, changes the nodeName attribute, which holds the qualified name, as well as the
	tagName and name attributes of the Element and Attr interfaces, when applicable.

	Create a new element node with a namespace prefix.  Add it to a new DocumentFragment Node without
	a prefix.  Call setPrefix on the elemen node.  Check if the prefix was set correctly on the element.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix01 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix01") != null) return;
    var doc;
      var docFragment;
      var element;
      var elementTagName;
      var elementNodeName;
      var appendedChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      docFragment = doc.createDocumentFragment();
      element = doc.createElementNS("http://www.w3.org/DOM/Test","emp:address");
      appendedChild = docFragment.appendChild(element);
      element.prefix = "dmstc";

      elementTagName = element.tagName;

      elementNodeName = element.nodeName;

      assertEquals("nodesetprefix01_tagname","dmstc:address",elementTagName);
       assertEquals("nodesetprefix01_nodeName","dmstc:address",elementNodeName);

},
/**
*
	The method setPrefix sets the namespace prefix of this node.  Note that setting this attribute,
	when permitted, changes the nodeName attribute, which holds the qualified name, as well as the
	tagName and name attributes of the Element and Attr interfaces, when applicable.

	Create a new attribute node and add it to an element node with an existing attribute having
	the same localName as this attribute but different namespaceURI.  Change the prefix of the
	newly created attribute using setPrefix.  Check if the new attribute nodeName has changed
	and the existing attribute is the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix02 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix02") != null) return;
    var doc;
      var element;
      var attribute;
      var newAttribute;
      var setNode;
      var elementList;
      var attrName;
      var newAttrName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      element = elementList.item(1);
      newAttribute = doc.createAttributeNS("http://www.w3.org/DOM/Test","test:address");
      setNode = element.setAttributeNodeNS(newAttribute);
      newAttribute.prefix = "dom";

      attribute = element.getAttributeNodeNS("http://www.usa.com","domestic");
      attrName = attribute.nodeName;

      newAttrName = newAttribute.nodeName;

      assertEquals("nodesetprefix02_attrName","dmstc:domestic",attrName);
       assertEquals("nodesetprefix02_newAttrName","dom:address",newAttrName);

},
/**
*
	The method setPrefix raises a NAMESPACE_ERR if the namespaceURI of this node is null.

	Create a new element node without a namespace prefix.  Call setPrefix on the newly created elemenent node.
	Check if a NAMESPACE_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix03 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix03") != null) return;
    var doc;
      var element;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElement("address");

	{
		success = false;
		try {
            element.prefix = "test";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
	The method setPrefix raises a NAMESPACE_ERR if the namespaceURI of this node is null.

	Retreive the a default Attribute node which does not have a namespace prefix. Call the setPrefix
	method on it.  Check if a NAMESPACE_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
*/
nodesetprefix04 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix04") != null) return;
    var doc;
      var element;
      var attribute;
      var elementList;
      var nullNS = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:employee");
      element = elementList.item(0);
      assertNotNull("empEmployeeNotNull",element);
attribute = element.getAttributeNodeNS(nullNS,"defaultAttr");

	{
		success = false;
		try {
            attribute.prefix = "test";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("nodesetprefix04",success);
	}

},
/**
*
	The method setPrefix raises a NAMESPACE_ERR if the specified prefix is malformed.

	Create a new namespace aware element node and call the setPrefix method on it with several malformed
	prefix values.  Check if a NAMESPACE_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix05 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix05") != null) return;
    var doc;
      var element;
      var prefixValue;
      prefixValues = new Array();
      prefixValues[0] = "_:";
      prefixValues[1] = ":0";
      prefixValues[2] = ":";
      prefixValues[3] = "_::";
      prefixValues[4] = "a:0:c";


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/L2","dom:elem");
      for(var indexN10050 = 0;indexN10050 < prefixValues.length; indexN10050++) {
      prefixValue = prefixValues[indexN10050];

	{
		success = false;
		try {
            element.prefix = prefixValue;

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

	}

},
/**
*
	The method setPrefix raises a NAMESPACE_ERR if the specified prefix is "xml" and the namespaceURI
	of this node is different from "http://www.w3.org/XML/1998/namespace".

	Invoke the setPrefix method on this Element object with namespaceURI that is different from
	http://www..w3.org/xml/1998/namespace and a prefix whose values is xml.
	Check if the NAMESPACE_ERR was thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix06 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix06") != null) return;
    var doc;
      var element;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/L2","dom:elem");

	{
		success = false;
		try {
            element.prefix = "xml";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
	The method setPrefix raises a NAMESPACE_ERR if this node is an attribute and the specified
	prefix is "xmlns" and the namespaceURI of this node is different from
	"http://www.w3.org/2000/xmlns/".

	Create a new attribute node whose namespaceURI is different form "http://www.w3.org/2000/xmlns/"
	and node prefix is "xmlns".
	Check if the NAMESPACE_ERR was thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix07 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix07") != null) return;
    var doc;
      var attribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM/Test/L2","abc:elem");

	{
		success = false;
		try {
            attribute.prefix = "xmlns";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
	The method setPrefix raises a NAMESPACE_ERR if this node is an attribute and the qualifiedName
	of this node is "xmlns

	Retreive an attribute node whose qualifiedName is xmlns.  Try setting a prefix on this node.
	Check if the NAMESPACE_ERR was thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix08 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix08") != null) return;
    var doc;
      var element;
      var elementList;
      var attribute;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      element = elementList.item(0);
      attribute = element.getAttributeNode("xmlns");

	{
		success = false;
		try {
            attribute.prefix = "xml";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
	The method setPrefix raises a INVALID_CHARACTER_ERR if the specified prefix contains an illegal character.

	Create a new namespace aware element node and call the setPrefix method on it with a prefix having
	an invalid character.  Check if a NAMESPACE_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
nodesetprefix09 : function () {
   var success;
    if(checkInitialization(builder, "nodesetprefix09") != null) return;
    var doc;
      var value = "#$%&'()@";
      var element;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      element = doc.createElementNS("http://www.w3.org/DOM/Test/L2","dom:elem");

	{
		success = false;
		try {
            element.prefix = value;

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
    The "normalize()" method puts all the nodes in the full
    depth of the sub-tree underneath this element into a
    "normal" form.

    Retrieve the third employee and access its second child.
    This child contains a block of text that is spread
    across multiple lines.   The content of the "name" child
    should be parsed and treated as a single Text node.

    This appears to be a duplicate of elementnormalize.xml in DOM L1 Test Suite

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-normalize
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-72AB8359
*/
normalize01 : function () {
   var success;
    if(checkInitialization(builder, "normalize01") != null) return;
    var doc;
      var root;
      var elementList;
      var firstChild;
      var textList;
      var textNode;
      var data;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      root = doc.documentElement;

      root.normalize();
      elementList = root.getElementsByTagName("name");
      firstChild = elementList.item(2);
      textList = firstChild.childNodes;

      textNode = textList.item(0);
      data = textNode.data;

      assertEquals("data","Roger\n Jones",data);

},
/**
*
    The "getOwnerDocument()" method returns null if the target
    node itself is a DocumentType which is not used with any document yet.

    Invoke the "getOwnerDocument()" method on the master
    document.   The DocumentType returned should be null.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#node-ownerDoc
*/
ownerDocument01 : function () {
   var success;
    if(checkInitialization(builder, "ownerDocument01") != null) return;
    var doc;
      var ownerDocument;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      ownerDocument = doc.ownerDocument;

      assertNull("throw_Null",ownerDocument);

},
/**
*
    The "getOwnerElement()" will return the Element node this attribute
  is attached to or null if this attribute is not in use.
  Get the "domestic" attribute from the first "address" node.
  Apply the "getOwnerElement()" method to get the Element associated
  with the attribute.  The value returned should be "address".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D095
*/
ownerElement01 : function () {
   var success;
    if(checkInitialization(builder, "ownerElement01") != null) return;
    var doc;
      var addressList;
      var testNode;
      var attributes;
      var domesticAttr;
      var elementNode;
      var name;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      addressList = doc.getElementsByTagName("address");
      testNode = addressList.item(0);
      attributes = testNode.attributes;

      domesticAttr = attributes.getNamedItem("domestic");
      elementNode = domesticAttr.ownerElement;

      name = elementNode.nodeName;

      assertEquals("throw_Equals","address",name);

},
/**
*
    The "getOwnerElement()" will return the Element node this attribute
  is attached to or null if this attribute is not in use.
  Create a new attribute.
  Apply the "getOwnerElement()" method to get the Element associated
  with the attribute.  The value returned should be "null" since this
  attribute is not in use.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#Attr-ownerElement
*/
ownerElement02 : function () {
   var success;
    if(checkInitialization(builder, "ownerElement02") != null) return;
    var doc;
      var newAttr;
      var elementNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      newAttr = doc.createAttribute("newAttribute");
      elementNode = newAttr.ownerElement;

      assertNull("throw_Null",elementNode);

},
/**
*
    The "getPrefix()" method for a Node
    returns the namespace prefix of the node,
    and for nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE
    and nodes created with a DOM Level 1 method, this is null.

    Create an new Element with the createElement() method.
    Invoke the "getPrefix()" method on the newly created element
    node will cause "null" to be returned.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
prefix01 : function () {
   var success;
    if(checkInitialization(builder, "prefix01") != null) return;
    var doc;
      var createdNode;
      var prefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      createdNode = doc.createElement("test:employee");
      prefix = createdNode.prefix;

      assertNull("throw_Null",prefix);

},
/**
*
    The "getPrefix()" method
    returns the namespace prefix of this node, or null if unspecified.
    For nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE,
    this is always null.

    Retrieve the first emp:employeeId node and get the first child of this node.
    Since the first child is Text node invoking the "getPrefix()"
    method will cause "null" to be returned.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
prefix02 : function () {
   var success;
    if(checkInitialization(builder, "prefix02") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var textNode;
      var prefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:employeeId");
      testEmployee = elementList.item(0);
      assertNotNull("empEmployeeNotNull",testEmployee);
textNode = testEmployee.firstChild;

      prefix = textNode.prefix;

      assertNull("textNodePrefix",prefix);

},
/**
*
    The "getPrefix()" method for a node
    returns the namespace prefix of this node, or null if it is unspecified.

    Retrieve the first emp:employee node and invoke the getPrefix() method."
    The method should return "emp".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
prefix03 : function () {
   var success;
    if(checkInitialization(builder, "prefix03") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var prefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:employee");
      testEmployee = elementList.item(0);
      assertNotNull("empEmployeeNotNull",testEmployee);
prefix = testEmployee.prefix;

      assertEquals("prefix","emp",prefix);

},
/**
*
    The "getPrefix()" method for a node
    returns the namespace prefix of this node, or null if it is unspecified.

    Retrieve the first employee node and invoke the getPrefix() method."
    The method should return "null".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
*/
prefix04 : function () {
   var success;
    if(checkInitialization(builder, "prefix04") != null) return;
    var doc;
      var elementList;
      var testEmployee;
      var prefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(0);
      prefix = testEmployee.prefix;

      assertNull("throw_Null",prefix);

},
/**
*
    The "setPrefix(prefix)" method raises a
    NAMESPACE_ERR DOMException if the specified node is an attribute
    and the specified prefix is xmlns and the namespaceURI is different from
    http://www.w3.org/2000/xmlns.

    Attempt to insert "xmlns" as the new namespace prefix on the emp:domestic
    attribute within the emp:address node.
    An exception should be raised since the namespaceURI of this node is not
    http://www.w3.org/2000/xmlns.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-NodeNSPrefix')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
prefix05 : function () {
   var success;
    if(checkInitialization(builder, "prefix05") != null) return;
    var doc;
      var elementList;
      var addrNode;
      var addrAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      addrNode = elementList.item(0);
      assertNotNull("empAddrNotNull",addrNode);
addrAttr = addrNode.getAttributeNode("emp:domestic");

	{
		success = false;
		try {
            addrAttr.prefix = "xmlns";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "setPrefix(prefix)" method raises a
    INVALID_CHARACTER_ERR DOMException if the specified
    prefix contains an illegal character.

    Attempt to insert a new namespace prefix on the first employee node.
    An exception should be raised since the namespace prefix has an invalid
    character.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-NodeNSPrefix')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
*/
prefix06 : function () {
   var success;
    if(checkInitialization(builder, "prefix06") != null) return;
    var doc;
      var elementList;
      var employeeNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      employeeNode = elementList.item(0);

	{
		success = false;
		try {
            employeeNode.prefix = "pre^fix xmlns='http//www.nist.gov'";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
    The "setPrefix(prefix)" method raises a
    NAMESPACE_ERR DOMException if the specified
    prefix if malformed.

    Attempt to insert a new namespace prefix on the second employee node.
    An exception should be raised since the namespace prefix is malformed.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-NodeNSPrefix')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
prefix07 : function () {
   var success;
    if(checkInitialization(builder, "prefix07") != null) return;
    var doc;
      var elementList;
      var employeeNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      employeeNode = elementList.item(0);

	{
		success = false;
		try {
            employeeNode.prefix = "emp::";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
  The "setPrefix(prefix)" method causes the
  DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
  if the node is readonly.

  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Get the FIRST item
  from the entity reference and execute the "setPrefix(prefix)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-NodeNSPrefix')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
*/
prefix08 : function () {
   var success;
    if(checkInitialization(builder, "prefix08") != null) return;
    var doc;
      var genderList;
      var genderNode;
      var entRef;
      var entElement;
      var createdNode;
      var nodeType;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      genderList = doc.getElementsByTagName("gender");
      genderNode = genderList.item(2);
      entRef = genderNode.firstChild;

      nodeType = entRef.nodeType;


	if(
	(1 == nodeType)
	) {
	entRef = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",entRef);

	}
	entElement = entRef.firstChild;

      assertNotNull("entElement",entElement);
createdNode = doc.createElement("text3");

	{
		success = false;
		try {
            entElement.prefix = "newPrefix";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
*
    The "setPrefix(prefix)" method raises a
    NAMESPACE_ERR DOMException if the specified node is an attribute
    and the qualifiedName of this node is xmlns.

    Attempt to set the prefix on the xmlns attribute within the fourth address
    element.
    An exception should be raised since the qualifiedName of this attribute
    is "xmlns".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-NodeNSPrefix')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
prefix09 : function () {
   var success;
    if(checkInitialization(builder, "prefix09") != null) return;
    var doc;
      var elementList;
      var addrNode;
      var addrAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      addrNode = elementList.item(3);
      addrAttr = addrNode.getAttributeNode("xmlns");
	{
		success = false;
		try {
            addrAttr.prefix = "xxx";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "setPrefix(prefix)" method raises a
    NAMESPACE_ERR DOMException if the specified
    prefix is xml and the namespaceURI is different from
    http://www.w3.org/XML/1998/namespace.

    Attempt to insert "xml" as the new namespace prefix on the first employee node.
    An exception should be raised since the namespaceURI of this node is not
    http://www.w3.org/XML/1998/namespace.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeNSPrefix
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-NodeNSPrefix')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
prefix10 : function () {
   var success;
    if(checkInitialization(builder, "prefix10") != null) return;
    var doc;
      var elementList;
      var employeeNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      employeeNode = elementList.item(1);

	{
		success = false;
		try {
            employeeNode.prefix = "xml";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "setPrefix(prefix)" method raises a
    NAMESPACE_ERR DOMException if the specified
    prefix is set on a node with a namespaceURI that is null.

    Attempt to insert a new namespace prefix on the second employee node.
    An exception should be raised since the namespace prefix is set
    on a node whose namespaceURI is null.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
prefix11 : function () {
   var success;
    if(checkInitialization(builder, "prefix11") != null) return;
    var doc;
      var elementList;
      var employeeNode;
      var namespaceURI;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      employeeNode = elementList.item(1);
      namespaceURI = employeeNode.namespaceURI;


	{
		success = false;
		try {
            employeeNode.prefix = "employee1";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "getPublicId()" method of a documenttype node contains
   the public identifier associated with the external subset.

   Retrieve the documenttype.
   Apply the "getPublicId()" method.  The string "STAFF" should be
   returned.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-publicId
*/
publicId01 : function () {
   var success;
    if(checkInitialization(builder, "publicId01") != null) return;
    var doc;
      var docType;
      var publicId;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      publicId = docType.publicId;

      assertEquals("throw_Equals","STAFF",publicId);

},
/**
*
    The "removeAttributeNS(namespaceURI,localName)" method for an attribute causes the
   DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
   if the node is readonly.

   Obtain the children of the THIRD "gender" element.  The elements
   content is an entity reference.  Try to remove an attribute
   from the entity reference by executing the
   "removeAttributeNS(namespaceURI,localName)" method.
   This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElRemAtNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElRemAtNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
*/
removeAttributeNS01 : function () {
   var success;
    if(checkInitialization(builder, "removeAttributeNS01") != null) return;
    var doc;
      var genderList;
      var gender;
      var gen;
      var gList;
      var genElement;
      var nodeType;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      genderList = doc.getElementsByTagName("gender");
      gender = genderList.item(2);
      gen = gender.firstChild;

      nodeType = gen.nodeType;


	if(
	(1 == nodeType)
	) {
	gen = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",gen);

	}
	gList = gen.childNodes;

      genElement = gList.item(0);
      assertNotNull("notnull",genElement);

	{
		success = false;
		try {
            genElement.removeAttributeNS("www.xyz.com","local1");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
*
    The "removeAttributeNS(namespaceURI,localName)" removes an attribute by
   local name and namespace URI.  If the removed attribute has a
   default value it is immediately replaced.  The replacing attribute has the same
   namespace URI and local name, as well as the original prefix.

   Retrieve the attribute named "emp:local" from emp:address
   node, then remove the "emp:local"
   attribute by invoking the "removeAttributeNS(namespaceURI,localName)" method.
   The "emp:local" attribute has a default value defined in the
   DTD file, that value should immediately replace the old
   value.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElRemAtNS
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=238
*/
removeAttributeNS02 : function () {
   var success;
    if(checkInitialization(builder, "removeAttributeNS02") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var addrAttr;
      var attr;
      var namespaceURI;
      var localName;
      var prefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      testAddr.removeAttributeNS("http://www.nist.gov","local1");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      addrAttr = testAddr.getAttributeNodeNS("http://www.nist.gov","local1");
      attr = testAddr.getAttributeNS("http://www.nist.gov","local1");
      namespaceURI = addrAttr.namespaceURI;

      localName = addrAttr.localName;

      prefix = testAddr.prefix;

      assertEquals("attr","FALSE",attr);
       assertEquals("uri","http://www.nist.gov",namespaceURI);
       assertEquals("lname","local1",localName);
       assertEquals("prefix","emp",prefix);

},
/**
*
    The "removeNamedItemNS(namespaceURI,localName)" method for a
   NamedNodeMap should remove a node specified by localName and namespaceURI.

   Retrieve a list of elements with tag name "address".
   Access the second element from the list and get its attributes.
   Try to remove the attribute node with local name "domestic"
   and namespace uri "http://www.usa.com" with
   method removeNamedItemNS(namespaceURI,localName).
   Check to see if the node has been removed.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-1074577549
*/
removeNamedItemNS01 : function () {
   var success;
    if(checkInitialization(builder, "removeNamedItemNS01") != null) return;
    var doc;
      var elementList;
      var testAddress;
      var attributes;
      var newAttr;
      var removedNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testAddress = elementList.item(1);
      attributes = testAddress.attributes;

      removedNode = attributes.removeNamedItemNS("http://www.usa.com","domestic");
      assertNotNull("retval",removedNode);
newAttr = attributes.getNamedItem("dmstc:domestic");
      assertNull("nodeRemoved",newAttr);

},
/**
*
    The "removeNamedItemNS(namespaceURI,localName)" method for a
   NamedNodeMap should raise NOT_FOUND_ERR DOMException if
   there is no node with the specified namespaceURI and localName in this map.

   Retrieve a list of elements with tag name "address".
   Access the second element from the list and get its attributes.
   Try to remove an attribute node with local name "domest"
   and namespace uri "http://www.usa.com" with
   method removeNamedItemNS(namespaceURI,localName).
   This should raise NOT_FOUND_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-removeNamedItemNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-removeNamedItemNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
*/
removeNamedItemNS02 : function () {
   var success;
    if(checkInitialization(builder, "removeNamedItemNS02") != null) return;
    var namespaceURI = "http://www.usa.com";
      var localName = "domest";
      var doc;
      var elementList;
      var testAddress;
      var attributes;
      var removedNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      testAddress = elementList.item(1);
      attributes = testAddress.attributes;


	{
		success = false;
		try {
            removedNode = attributes.removeNamedItemNS(namespaceURI,localName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
*
  The "removeNamedItemNS(namespaceURI,localName)" method for a
  NamedNodeMap should raise NO_MODIFICATION_ALLOWED_ERR DOMException if
  this map is readonly.

  Retrieve a list of "gender" elements. Get access to the THIRD element
  which contains an ENTITY_REFERENCE child node.  Try to remove the attribute
  in the node's map with method removeNamedItemNS(namespaceURI,localName).
  This should result in NO_MODIFICATION_ALLOWED_ERR
  DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-removeNamedItemNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-removeNamedItemNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
*/
removeNamedItemNS03 : function () {
   var success;
    if(checkInitialization(builder, "removeNamedItemNS03") != null) return;
    var namespaceURI = "http://www.w3.org/2000/xmlns/";
      var localName = "local1";
      var doc;
      var elementList;
      var testAddress;
      var nList;
      var child;
      var n2List;
      var child2;
      var attributes;
      var removedNode;
      var nodeType;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("gender");
      testAddress = elementList.item(2);
      nList = testAddress.childNodes;

      child = nList.item(0);
      nodeType = child.nodeType;


	if(
	(1 == nodeType)
	) {
	child = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",child);

	}
	n2List = child.childNodes;

      child2 = n2List.item(0);
      assertNotNull("notnull",child2);
attributes = child2.attributes;


	{
		success = false;
		try {
            removedNode = attributes.removeNamedItemNS(namespaceURI,localName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
*
    The "setAttributeNS(namespaceURI,qualifiedName,Value)" method raises a
   INVALID_CHARACTER_ERR DOMException if the specified
   prefix contains an illegal character.

   Attempt to add a new attribute on the first employee node.
   An exception should be raised since the "qualifiedName" has an invalid
   character.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
*/
setAttributeNS01 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS01") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "emp:qual?name";
      var doc;
      var elementList;
      var testAddr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      testAddr = elementList.item(0);

	{
		success = false;
		try {
            testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
    The "setAttributeNS(namespaceURI,qualifiedName,value)" method raises a
   NAMESPACE_ERR DOMException if the specified
   qualifiedName if malformed.

   Attempt to add a new attribute on the second employee node.
   An exception should be raised since the "qualifiedName" is malformed.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
setAttributeNS02 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS02") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "emp:";
      var doc;
      var elementList;
      var testAddr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:employee");
      testAddr = elementList.item(0);

	{
		success = false;
		try {
            testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "setAttributeNS(namespaceURI,qualifiedName,value)" method for an attribute causes the
   DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
   if the node is readonly.

   Obtain the children of the THIRD "gender" element.  The elements
   content is an entity reference.  Try to set an attribute
   in the entity reference by executing the
   "setAttributeNS(namespaceURI,qualifiedName,value)" method.
   This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
*/
setAttributeNS03 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS03") != null) return;
    var namespaceURI = "www.xyz.com";
      var qualifiedName = "emp:local1";
      var doc;
      var genderList;
      var gender;
      var genList;
      var gen;
      var gList;
      var genElement;
      var nodeType;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      genderList = doc.getElementsByTagName("gender");
      gender = genderList.item(2);
      genList = gender.childNodes;

      gen = genList.item(0);
      nodeType = gen.nodeType;


	if(
	(1 == nodeType)
	) {
	gen = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",gen);

	}
	gList = gen.childNodes;

      genElement = gList.item(0);
      assertNotNull("notnull",genElement);

	{
		success = false;
		try {
            genElement.setAttributeNS(namespaceURI,qualifiedName,"newValue");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
*
    The "setAttributeNS(namespaceURI,qualifiedName,value)" method adds a new attribute.
   If an attribute with the same local name and namespace URI is already present
   on the element, its prefix is changed to be the prefix part of the "qualifiedName",
   and its vale is changed to be the "value" paramter.
   null value if no previously existing Attr node with the
   same name was replaced.

   Add a new attribute to the "emp:address" element.
   Check to see if the new attribute has been successfully added to the document
   by getting the attributes value, namespace URI, local Name and prefix.
   The prefix will be changed to the prefix part of the "qualifiedName"
   and its value changed to the "value" parameter.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#
*/
setAttributeNS04 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS04") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var addrAttr;
      var resultAttr;
      var resultNamespaceURI;
      var resultLocalName;
      var resultPrefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
testAddr.setAttributeNS("http://www.nist.gov","newprefix:zone","newValue");
      addrAttr = testAddr.getAttributeNodeNS("http://www.nist.gov","zone");
      resultAttr = testAddr.getAttributeNS("http://www.nist.gov","zone");
      assertEquals("attrValue","newValue",resultAttr);
       resultNamespaceURI = addrAttr.namespaceURI;

      assertEquals("nsuri","http://www.nist.gov",resultNamespaceURI);
       resultLocalName = addrAttr.localName;

      assertEquals("lname","zone",resultLocalName);
       resultPrefix = addrAttr.prefix;

      assertEquals("prefix","newprefix",resultPrefix);

},
/**
*
    The "setAttributeNS(namespaceURI,qualifiedName,value)" method adds a new attribute.
   If an attribute with the same local name and namespace URI is already present
   on the element, its prefix is changed to be the prefix part of the "qualifiedName",
   and its vale is changed to be the "value" paramter.
   null value if no previously existing Attr node with the
   same name was replaced.

   Add a new attribute to the "emp:address" element.
   Check to see if the new attribute has been successfully added to the document.
   The new attribute "<newValue>" contains markup and therefore is escaped
   by the implementation.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAttrNS
*/
setAttributeNS05 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS05") != null) return;
    var localName = "newAttr";
      var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var doc;
      var elementList;
      var testAddr;
      var addrAttr;
      var resultAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
testAddr.setAttributeNS(namespaceURI,qualifiedName,"<newValue>");
      resultAttr = testAddr.getAttributeNS(namespaceURI,localName);
      assertEquals("throw_Equals","<newValue>",resultAttr);

},
/**
*
    The "setAttributeNS(namespaceURI,localName,value)" method raises a
   NAMESPACE_ERR DOMException if the "qualifiedName" has a
   prefix of "xml" and the namespaceURI is different from
   http://www.w3.org/XML/1998/namespace.

   Attempt to add an attribute with a prefix of "xml" as the on the first employee node.
   An exception should be raised since the namespaceURI of this node is not
   http://www.w3.org/XML/1998/namespace.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
setAttributeNS06 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS06") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "xml:qualifiedName";
      var doc;
      var elementList;
      var testAddr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      testAddr = elementList.item(0);

	{
		success = false;
		try {
            testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "setAttributeNS(namespaceURI,localName,value)" method raises a
   NAMESPACE_ERR DOMException if the "qualifiedName" has a
   value of "xmlns" and the namespaceURI is different from
   http://www.w3.org/2000/xmlns.

   Attempt to add an attribute with a "qualifiedName" of "xmlns" as the
   on the first employee node.
   An exception should be raised since the namespaceURI of this node is not
   http://www.w3.org/2000/xmlns.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NAMESPACE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
*/
setAttributeNS07 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS07") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "xmlns";
      var doc;
      var elementList;
      var testAddr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("employee");
      testAddr = elementList.item(0);

	{
		success = false;
		try {
            testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
*
    The "setAttributeNS(namespaceURI,qualifiedName,value)" method adds a new attribute.
   If an attribute with the same local name and namespace URI is already present
   on the element, its prefix is changed to be the prefix part of the "qualifiedName",
   and its vale is changed to be the "value" paramter.
   null value if no previously existing Attr node with the
   same name was replaced.

   Add a new attribute to the "emp:address" element.
   Check to see if the new attribute has been successfully added to the document
   by getting the attributes value, namespace URI, local Name and prefix.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
*/
setAttributeNS09 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS09") != null) return;
    var localName = "newAttr";
      var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var doc;
      var elementList;
      var testAddr;
      var addrAttr;
      var resultAttr;
      var resultNamespaceURI;
      var resultLocalName;
      var resultPrefix;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
      addrAttr = testAddr.getAttributeNodeNS(namespaceURI,localName);
      resultAttr = testAddr.getAttributeNS(namespaceURI,localName);
      assertEquals("attrValue","newValue",resultAttr);
       resultNamespaceURI = addrAttr.namespaceURI;

      assertEquals("nsuri","http://www.newattr.com",resultNamespaceURI);
       resultLocalName = addrAttr.localName;

      assertEquals("lname","newAttr",resultLocalName);
       resultPrefix = addrAttr.prefix;

      assertEquals("prefix","emp",resultPrefix);

},
/**
*
Element.setAttributeNS with an empty qualified name should cause an INVALID_CHARACTER_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
*/
setAttributeNS10 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNS10") != null) return;
    var namespaceURI = "http://www.example.gov";
      var doc;
      var elementList;
      var testAddr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("em");
      testAddr = elementList.item(0);

	{
		success = false;
		try {
            testAddr.setAttributeNS(namespaceURI,"","newValue");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("throw_INVALID_CHARACTER_ERR",success);
	}

},
/**
*
    The "setAttributeNode(newAttr)" method raises an
   "INUSE_ATTRIBUTE_ERR DOMException if the "newAttr"
   is already an attribute of another element.

   Retrieve the first emp:address and append
   a newly created element.  The "createAttributeNS(namespaceURI,qualifiedName)"
   and "setAttributeNodeNS(newAttr)" methods are invoked
   to create and add a new attribute to the newly created
   Element.  The "setAttributeNodeNS(newAttr)" method is
   once again called to add the new attribute causing an
   exception to be raised since the attribute is already
   an attribute of another element.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAtNodeNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
*/
setAttributeNodeNS01 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNodeNS01") != null) return;
    var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var doc;
      var newElement;
      var newAttr;
      var elementList;
      var testAddr;
      var appendedChild;
      var setAttr1;
      var setAttr2;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
newElement = doc.createElement("newElement");
      appendedChild = testAddr.appendChild(newElement);
      newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
      setAttr1 = newElement.setAttributeNodeNS(newAttr);

	{
		success = false;
		try {
            setAttr2 = testAddr.setAttributeNodeNS(newAttr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 10);
		}
		assertTrue("throw_INUSE_ATTRIBUTE_ERR",success);
	}

},
/**
*
    The "setAttributeNodeNS(namespaceURI,qualifiedName,value)" method for an attribute causes the
   DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
   if the node is readonly.

   Obtain the children of the THIRD "gender" element.  The elements
   content is an entity reference.  Try to set an attribute
   in the entity reference by executing the
   "setAttributeNodeNS(newAttr)" method.
   This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAtNodeNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
*/
setAttributeNodeNS02 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNodeNS02") != null) return;
    var doc;
      var genderList;
      var gender;
      var genList;
      var gen;
      var gList;
      var genElement;
      var newAttr;
      var setAttr1;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      gen = doc.createEntityReference("ent4");
      gList = gen.childNodes;

      genElement = gList.item(0);
      assertNotNull("notnull",genElement);
newAttr = doc.createAttributeNS("www.xyz.com","emp:local1");

	{
		success = false;
		try {
            setAttr1 = genElement.setAttributeNodeNS(newAttr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
*
    The "setAttributeNodeNS(newAttr)" adds a new attribute.
   If an attribute with that local name and that namespaceURI is already
   present in the element, it is replaced by the new one.

   Retrieve the first emp:address element and add a new attribute
   to the element.  Since an attribute with the same local name
   and namespaceURI as the newly created attribute does not exist
   the value "null" is returned.
   This test uses the "createAttributeNS(namespaceURI,localName)
   method from the Document interface to create the new attribute to add.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
*/
setAttributeNodeNS03 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNodeNS03") != null) return;
    var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var doc;
      var elementList;
      var testAddr;
      var newAttr;
      var newAddrAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
      newAddrAttr = testAddr.setAttributeNodeNS(newAttr);
      assertNull("throw_Null",newAddrAttr);

},
/**
*
    The "setAttributeNodeNS(newAttr)" adds a new attribute.
   If an attribute with that local name and that namespaceURI is already
   present in the element, it is replaced by the new one.

   Retrieve the first emp:address element and add a new attribute
   to the element.  Since an attribute with the same local name
   and namespaceURI already exists, it is replaced by the new one and
   returns the replaced "Attr" node.
   This test uses the "createAttributeNS(namespaceURI,localName)
   method from the Document interface to create the new attribute to add.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D095
*/
setAttributeNodeNS04 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNodeNS04") != null) return;
    var doc;
      var elementList;
      var testAddr;
      var newAttr;
      var newAddrAttr;
      var newName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assertNotNull("empAddrNotNull",testAddr);
newAttr = doc.createAttributeNS("http://www.nist.gov","xxx:domestic");
      newAddrAttr = testAddr.setAttributeNodeNS(newAttr);
      newName = newAddrAttr.nodeName;

      assertEquals("nodeName","emp:domestic",newName);

},
/**
*
    The "setAttributeNodeNS(newAttr)" method raises an
   "WRONG_DOCUMENT_ERR DOMException if the "newAttr"
   was created from a different document than the one that
   created this document.

   Retrieve the first emp:address and attempt to set a new
   attribute node.  The new
   attribute was created from a document other than the
   one that created this element, therefore a
   WRONG_DOCUMENT_ERR DOMException should be raised.
   This test uses the "createAttributeNS(newAttr)" method
   from the Document interface.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAtNodeNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
*/
setAttributeNodeNS05 : function () {
   var success;
    if(checkInitialization(builder, "setAttributeNodeNS05") != null) return;
    var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var doc1;
      var doc2;
      var newAttr;
      var elementList;
      var testAddr;
      var setAttr1;

      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "staffNS");

      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "staffNS");
      newAttr = doc2.createAttributeNS(namespaceURI,qualifiedName);
      elementList = doc1.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);

	{
		success = false;
		try {
            setAttr1 = testAddr.setAttributeNodeNS(newAttr);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
*
    The "setNamedItemNS(arg)" method for a
   NamedNodeMap should raise INUSE_ATTRIBUTE_ERR DOMException if
   arg is an Attr that is already an attribute of another Element object.

   Retrieve an attr node from the third "address" element whose local name
   is "domestic" and namespaceURI is "http://www.netzero.com".
   Invoke method setNamedItemNS(arg) on the map of the first "address" element with
   arg being the attr node from above.  Method should raise
   INUSE_ATTRIBUTE_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-setNamedItemNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
*/
setNamedItemNS01 : function () {
   var success;
    if(checkInitialization(builder, "setNamedItemNS01") != null) return;
    var doc;
      var elementList;
      var anotherElement;
      var anotherMap;
      var arg;
      var testAddress;
      var map;
      var setNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("address");
      anotherElement = elementList.item(2);
      anotherMap = anotherElement.attributes;

      arg = anotherMap.getNamedItemNS("http://www.netzero.com","domestic");
      testAddress = elementList.item(0);
      map = testAddress.attributes;


	{
		success = false;
		try {
            setNode = map.setNamedItemNS(arg);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 10);
		}
		assertTrue("throw_INUSE_ATTRIBUTE_ERR",success);
	}

},
/**
*
    The "setNamedItemNS(arg)" method for a
   NamedNodeMap should raise WRONG_DOCUMENT_ERR DOMException if arg was
   created from a different document than the one that created this map.

   Create an attr node in a different document with qualifiedName equals
   "dmstc:domestic" and namespaceURI is "http://www.usa.com".
   Access the namednodemap of the first "address" element in this document.
   Invoke method setNamedItemNS(arg) with arg being the attr node from above.
   Method should raise WRONG_DOCUMENT_ERR DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-setNamedItemNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
*/
setNamedItemNS02 : function () {
   var success;
    if(checkInitialization(builder, "setNamedItemNS02") != null) return;
    var namespaceURI = "http://www.usa.com";
      var qualifiedName = "dmstc:domestic";
      var doc;
      var anotherDoc;
      var arg;
      var elementList;
      var testAddress;
      var attributes;
      var setNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");

      var anotherDocRef = null;
      if (typeof(this.anotherDoc) != 'undefined') {
        anotherDocRef = this.anotherDoc;
      }
      anotherDoc = load(anotherDocRef, "anotherDoc", "staffNS");
      arg = anotherDoc.createAttributeNS(namespaceURI,qualifiedName);
      arg.nodeValue = "Maybe";

      elementList = doc.getElementsByTagName("address");
      testAddress = elementList.item(0);
      attributes = testAddress.attributes;


	{
		success = false;
		try {
            setNode = attributes.setNamedItemNS(arg);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
*
    The "setNamedItemNS(arg)" method for a
   NamedNodeMap should add a node using its namespaceURI and localName given that
   there is no existing node with the same namespaceURI and localName in the map.

   Create an attr node with namespaceURI "http://www.nist.gov",qualifiedName
   "prefix:newAttr" and value "newValue".
   Invoke method setNamedItemNS(arg) on the map of the first "address"
   element where arg is identified by the namespaceURI and qualifiedName
   from above.  Method should return the newly added attr node.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D080
*/
setNamedItemNS03 : function () {
   var success;
    if(checkInitialization(builder, "setNamedItemNS03") != null) return;
    var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "prefix:newAttr";
      var doc;
      var arg;
      var elementList;
      var testAddress;
      var attributes;
      var retnode;
      var value;
      var setNode;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      arg = doc.createAttributeNS(namespaceURI,qualifiedName);
      arg.nodeValue = "newValue";

      elementList = doc.getElementsByTagName("address");
      testAddress = elementList.item(0);
      attributes = testAddress.attributes;

      setNode = attributes.setNamedItemNS(arg);
      retnode = attributes.getNamedItemNS(namespaceURI,"newAttr");
      value = retnode.nodeValue;

      assertEquals("throw_Equals","newValue",value);

},
/**
*
  The "setNamedItemNS(arg)" method for a
  NamedNodeMap should raise NO_MODIFICATION_ALLOWED_ERR DOMException if
  this map is readonly.

  Retrieve a list of "gender" elements. Get access to the THIRD element
  which contains an ENTITY_REFERENCE child node.  Get access to the node's
  map. Try to add an attribute node specified by arg with
  method setNamedItemNS(arg).  This should result in NO_MODIFICATION_ALLOWED_ERR
  DOMException.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-setNamedItemNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
*/
setNamedItemNS04 : function () {
   var success;
    if(checkInitialization(builder, "setNamedItemNS04") != null) return;
    var namespaceURI = "http://www.w3.org/2000/xmlns/";
      var localName = "local1";
      var doc;
      var elementList;
      var testAddress;
      var nList;
      var child;
      var n2List;
      var child2;
      var attributes;
      var arg;
      var setNode;
      var nodeType;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      elementList = doc.getElementsByTagName("gender");
      testAddress = elementList.item(2);
      nList = testAddress.childNodes;

      child = nList.item(0);
      nodeType = child.nodeType;


	if(
	(1 == nodeType)
	) {
	child = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",child);

	}
	n2List = child.childNodes;

      child2 = n2List.item(0);
      assertNotNull("notnull",child2);
attributes = child2.attributes;

      arg = attributes.getNamedItemNS(namespaceURI,localName);

	{
		success = false;
		try {
            setNode = attributes.setNamedItemNS(arg);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
*
    The "setNamedItemNS(arg)" method for a
   NamedNodeMap should replace an existing node n1 found in the map with arg if n1
   has the same namespaceURI and localName as arg and return n1.

   Create an attribute node in with namespaceURI "http://www.usa.com"
   and qualifiedName "dmstc:domestic" whose value is "newVal".
   Invoke method setNamedItemNS(arg) on the map of the first "address"
   element. Method should return the old attribute node identified
   by namespaceURI and qualifiedName from above,whose value is "Yes".

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAtNodeNS
*/
setNamedItemNS05 : function () {
   var success;
    if(checkInitialization(builder, "setNamedItemNS05") != null) return;
    var namespaceURI = "http://www.usa.com";
      var qualifiedName = "dmstc:domestic";
      var doc;
      var arg;
      var elementList;
      var testAddress;
      var attributes;
      var retnode;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      arg = doc.createAttributeNS(namespaceURI,qualifiedName);
      arg.nodeValue = "newValue";

      elementList = doc.getElementsByTagName("address");
      testAddress = elementList.item(0);
      attributes = testAddress.attributes;

      retnode = attributes.setNamedItemNS(arg);
      value = retnode.nodeValue;

      assertEquals("throw_Equals","Yes",value);

},
/**
*
    The "getSystemId()" method of a documenttype node contains
   the system identifier associated with the external subset.

   Retrieve the documenttype.
   Apply the "getSystemId()" method.  The string "staffNS.dtd" should be
   returned.

* @author NIST
* @author Mary Brady
* @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-systemId
*/
systemId01 : function () {
   var success;
    if(checkInitialization(builder, "systemId01") != null) return;
    var doc;
      var docType;
      var systemId;
      var index;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staffNS");
      docType = doc.doctype;

      systemId = docType.systemId;

      assertURIEquals("systemId",null,null,null,"staffNS.dtd",null,null,null,null,systemId);

}
};

