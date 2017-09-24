const { assert } = require("chai");
const { beforeEach, afterEach, describe, specify } = require("mocha-sugar-free");

describe("level2/core", () => {
  // NB: these tests have been modified to be compliant with the modern DOM, instead of the "DOM Level 2" they were
  // written for. Check the revision history.

  // The "getOwnerElement()" will return the Element node this attribute is attached to or null if this attribute is not in use.
  // @author IBM
  // @author Neil Delima
  // @see http://www.w3.org/TR/DOM-Level-2-Core/core#Attr-ownerElement
  describe('attrgetownerelement', () => {
    beforeEach(() => {
      this.doc = require('./core/files/staffNS.xml').staffNS();
    });

    afterEach(() => {
      delete(this.doc);
    });

    // Create a new element and attribute node, attach the attribute to the element. Check the value of owner element of the new attribute node
    specify('attrgetownerelement02', () => {
      var element = this.doc.createElement("root");
      var attr = this.doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      element.setAttributeNodeNS(attr);
      assert.equal(attr.ownerElement.nodeName.toLowerCase(), 'root');
    });

    // Create a new attribute node for this document node.  Since the newly attribute is not in use its owner element should be null.
    specify('attrgetownerelement03', () => {
      var attr = this.doc.createAttributeNS("http://www.w3.org/DOM","dom:attr");
      assert.equal(attr.ownerElement, null, 'should be null')
    });

    // Retreive an element and its attributes.  Then remove the element and check the name of the ownerElement of attribute of the attribute "street".
    // @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
    specify('attrgetownerelement05', () => {
      var element = this.doc.getElementsByTagNameNS("*","address").item(1);
      element.parentNode.removeChild(element);
      var attr = element.attributes.getNamedItemNS(null, "street");
      assert.equal(attr.ownerElement.nodeName, 'address');
    });
  });

  describe('createAttributeNS', () => {
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
    specify('createAttributeNS01', () => {
      var success;
      var namespaceURI = "http://www.ecommerce.org/";
      var malformedName = "prefix::local";
      var newAttr;


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          newAttr = doc.createAttributeNS(namespaceURI,malformedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
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
    specify('createAttributeNS02', () => {
      var success;
      var namespaceURI = null;

      var qualifiedName = "prefix:local";
      var newAttr;


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('createAttributeNS03', () => {
      var success;
      var namespaceURI = "http://www.wedding.com/";
      var qualifiedName;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
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
    assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
        }

      }
    });
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
    specify('createAttributeNS04', () => {
      var success;
      var namespaceURI = "http://www.w3.org/XML/1998/namespaces";
      var qualifiedName = "xml:attr1";
      var newAttr;


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('createAttributeNS05', () => {
      var success;
      var namespaceURI = "http://www.ecommerce.org/";
      var qualifiedName = "econm:local";
      var newAttr;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      newAttr = doc.createAttributeNS(namespaceURI,qualifiedName);
      attrName = newAttr.name;

    });
    /**
     *
     Document.createAttributeNS with an empty qualified name should cause an INVALID_CHARACTER_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrAttrNS
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
    */
    specify('createAttributeNS06', () => {
      var success;
      var namespaceURI = "http://www.example.com/";
      var qualifiedName;
      var newAttr;


      var doc = require('../level1/core/files/hc_staff.xml').hc_staff();

      {
        success = false;
        try {
          newAttr = doc.createAttributeNS(namespaceURI,"");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
  });

  describe('createDocument', () => {
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
    specify('createDocument01', () => {
      var success;
      var namespaceURI = "http://www.ecommerce.org/";
      var malformedName = "prefix::local";
      var docType = null;

      var domImpl;
      var aNewDoc;


      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      {
        success = false;
        try {
          aNewDoc = domImpl.createDocument(namespaceURI,malformedName,docType);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
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
    specify('createDocument02', () => {
      var success;
      var namespaceURI = null;

      var qualifiedName = "k:local";
      var docType = null;

      var domImpl;
      var aNewDoc;


      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      {
        success = false;
        try {
          aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('createDocument05', () => {
      var success;
      var namespaceURI = "http://www.ecommerce.org/schema";
      var qualifiedName;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
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
    assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
        }

      }
    });
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
    specify('createDocument06', () => {
      var success;
      var namespaceURI = "http://ecommerce.org/schema";
      var qualifiedName = "xml:local";
      var docType = null;

      var domImpl;
      var aNewDoc;


      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      {
        success = false;
        try {
          aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('createDocument07', () => {
      var success;
      var namespaceURI = "http://www.ecommerce.org/schema";
      var qualifiedName = "y:x";
      var docType = null;

      var domImpl;
      var aNewDoc;
      var nodeName;
      var nodeValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      aNewDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
      nodeName = aNewDoc.nodeName;

      nodeValue = aNewDoc.nodeValue;

      assert.equal(nodeName, "#document", "nodeName");
      assert.equal(nodeValue, null, 'nodeValue should not be null');
    });
    /**
     *
     DOMImplementation.createDocument with an empty qualified name should not create a document element.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
    */
    specify('createDocument08', () => {
      var success;
      var namespaceURI = "http://www.example.org/schema";
      var docType = null;

      var domImpl;
      var aNewDoc;
      var charact;
      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      aNewDoc = domImpl.createDocument(namespaceURI,"",docType);

      assert.equal(aNewDoc.documentElement, null);
    });
  });

  describe('createDocumentType', () => {
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
    specify('createDocumentType01', () => {
      var success;
      var publicId = "STAFF";
      var systemId = "staff.xml";
      var malformedName = "prefix::local";
      var domImpl;
      var newType;


      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      {
        success = false;
        try {
          newType = domImpl.createDocumentType(malformedName,publicId,systemId);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
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
    specify('createDocumentType02', () => {
      var success;
      var publicId = "http://www.localhost.com/";
      var systemId = "myDoc.dtd";
      var qualifiedName;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
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
    assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
        }

      }
    });
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
    specify('createDocumentType03', () => {
      var success;
      var namespaceURI = "http://ecommerce.org/schema";
      var qualifiedName = "prefix:myDoc";
      var publicId = "http://www.localhost.com";
      var systemId = "myDoc.dtd";
      var domImpl;
      var newType = null;

      var nodeName;
      var nodeValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      newType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
      nodeName = newType.nodeName;

      assert.equal(nodeName, "prefix:myDoc", "nodeName");
      nodeValue = newType.nodeValue;

      assert.equal(nodeValue, null, 'nodeValue should not be null');
    });
    /**
     *
     DOMImplementation.createDocumentType with an empty name should cause an INVALID_CHARACTER_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('Level-2-Core-DOM-createDocType')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
    */
    specify('createDocumentType04', () => {
      var success;
      var publicId = "http://www.example.com/";
      var systemId = "myDoc.dtd";
      var qualifiedName;
      var docType = null;
      var domImpl = require('./core/files/staffNS.xml').staffNS().implementation;

      {
        success = false;
        try {
          docType = domImpl.createDocumentType("",publicId,systemId);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
  });

  describe('createElementNS', () => {
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
    specify('createElementNS01', () => {
      var success;
      var namespaceURI = "http://www.ecommerce.org/";
      var malformedName = "prefix::local";
      var newElement;


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          newElement = doc.createElementNS(namespaceURI,malformedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
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
    specify('createElementNS02', () => {
      var success;
      var namespaceURI = null;

      var qualifiedName = "prefix:local";
      var newElement;


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          newElement = doc.createElementNS(namespaceURI,qualifiedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('createElementNS03', () => {
      var success;
      var namespaceURI = "http://www.wedding.com/";
      var qualifiedName;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
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
    assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
        }

      }
    });
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
    specify('createElementNS04', () => {
      var success;
      var namespaceURI = "http://www.w3.org/XML/1998/namespaces";
      var qualifiedName = "xml:element1";
      var newElement;


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          newElement = doc.createElementNS(namespaceURI,qualifiedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('createElementNS05', () => {
      var success;
      var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "gov:faculty";
      var newElement;
      var elementName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      newElement = doc.createElementNS(namespaceURI,qualifiedName);
      elementName = newElement.tagName;

      assert.equal(elementName, qualifiedName, "throw_Equals");
    });
    /**
     *
     Document.createElementNS with an empty qualified name should cause an INVALID_CHARACTER_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-DocCrElNS
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-DocCrElNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
    */
    specify('createElementNS06', () => {
      var success;
      var namespaceURI = "http://www.example.com/";
      var qualifiedName;
      var done;
      var newElement;
      var charact;


      var doc = require('../level1/core/files/hc_staff.xml').hc_staff();

      {
        success = false;
        try {
          newElement = doc.createElementNS(namespaceURI,"");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
  });

  describe('documentcreateattributeNS', () => {
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
    specify('documentcreateattributeNS01', () => {
      var success;
      var attribute;
      var namespaceURI = null;

      var qualifiedName = "test";
      var name;
      var nodeName;
      var nodeValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      attribute = doc.createAttributeNS(namespaceURI,qualifiedName);
      nodeName = attribute.name;

      nodeValue = attribute.nodeValue;

      assert.equal(nodeName, "test", "documentcreateattributeNS01");
    });
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
    specify('documentcreateattributeNS02', () => {
      var success;
      var attribute1;
      var attribute2;
      var name;
      var nodeName;
      var nodeValue;
      var prefix;
      var namespaceURI;


      var doc = require('./core/files/staffNS.xml').staffNS();
      attribute1 = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:xml");
      name = attribute1.name;

      nodeValue = attribute1.nodeValue;

      prefix = attribute1.prefix;

      namespaceURI = attribute1.namespaceURI;

      assert.equal(name, "xml:xml", "documentcreateattributeNS02_att1_name");
      assert.equal(nodeValue, "", "documentcreateattributeNS02_att1_nodeValue");
      assert.equal(prefix, "xml", "documentcreateattributeNS02_att1_prefix");
      assert.equal(namespaceURI, "http://www.w3.org/XML/1998/namespace", "documentcreateattributeNS02_att1_namespaceURI");
      attribute2 = doc.createAttributeNS("http://www.w3.org/2000/xmlns/","xmlns");
      name = attribute2.name;

      nodeValue = attribute2.nodeValue;

      prefix = attribute2.prefix;

      namespaceURI = attribute2.namespaceURI;

      assert.equal(name, "xmlns", "documentcreateattributeNS02_att2_name");
      assert.equal(nodeValue, "", "documentcreateattributeNS02_att2_nodeValue");
      assert.equal(namespaceURI, "http://www.w3.org/2000/xmlns/", "documentcreateattributeNS02_att2_namespaceURI");
    });
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
    specify('documentcreateattributeNS03', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
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
    assert.ok(success, 'documentcreateattributeNS03');
        }

      }
    });
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
    specify('documentcreateattributeNS04', () => {
      var success;
      var attribute;
      var namespaceURI = "http://www.w3.org/DOM/Test/Level2";
      var qualifiedName;
      qualifiedNames = new Array();
      qualifiedNames[0] = "_:";
      qualifiedNames[1] = ":0a";
      qualifiedNames[2] = ":";
      qualifiedNames[3] = "a:b:c";
      qualifiedNames[4] = "_::a";



      var doc = require('./core/files/staffNS.xml').staffNS();
      for(var indexN1004E = 0;indexN1004E < qualifiedNames.length; indexN1004E++) {
        qualifiedName = qualifiedNames[indexN1004E];

        {
    success = false;
    try {
            attribute = doc.createAttributeNS(namespaceURI,qualifiedName);
          }
    catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 5);
    }
    assert.ok(success, 'documentcreateattributeNS04');
        }

      }
    });
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
    specify('documentcreateattributeNS05', () => {
      var success;
      var newDoc;
      var docType = null;

      var domImpl;
      var attribute;
      var namespaceURI = null;

      var qualifiedName = "abc:def";


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'documentcreateattributeNS05');
      }
    });
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
    specify('documentcreateattributeNS06', () => {
      var success;
      var newDoc;
      var docType = null;

      var domImpl;
      var attribute;
      var namespaceURI = "http://www.w3.org/XML/1998 /namespace";
      var qualifiedName = "xml:root";


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'documentcreateattributeNS06');
      }
    });
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
    specify('documentcreateattributeNS07', () => {
      var success;
      var attribute;
      var namespaceURI = "http://www.W3.org/2000/xmlns";
      var qualifiedName = "xmlns";


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          attribute = doc.createAttributeNS(namespaceURI,qualifiedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'documentcreateattributeNS07');
      }
    });
  });

  describe('documentcreateelementNS', () => {
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
    specify('documentcreateelementNS01', () => {
      var success;
      var element;
      var namespaceURI = "http://www.w3.org/DOM/Test/level2";
      var qualifiedName = "XML:XML";
      var nodeName;
      var nsURI;
      var localName;
      var prefix;
      var tagName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS(namespaceURI,qualifiedName);
      nodeName = element.nodeName;

      nsURI = element.namespaceURI;

      localName = element.localName;

      prefix = element.prefix;

      tagName = element.tagName;

      assert.equal(nodeName, "XML:XML", "documentcreateelementNS01_nodeName");
      assert.equal(nsURI, "http://www.w3.org/DOM/Test/level2", "documentcreateelementNS01_namespaceURI");
      assert.equal(localName, "XML", "documentcreateelementNS01_localName");
      assert.equal(prefix, "XML", "documentcreateelementNS01_prefix");
      assert.equal(tagName, "XML:XML", "documentcreateelementNS01_tagName");
    });
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
    specify('documentcreateelementNS02', () => {
      var success;
      var element;
      var namespaceURI = null;

      var qualifiedName = "^^";


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          element = doc.createElementNS(namespaceURI,qualifiedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'documentcreateelementNS02');
      }
    });
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
    specify('documentcreateelementNS05', () => {
      var success;
      var element;
      var namespaceURI = null;

      var qualifiedName = "null:xml";


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          element = doc.createElementNS(namespaceURI,qualifiedName);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'documentcreateelementNS05');
      }
    });
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
    specify('documentcreateelementNS06', () => {
      var success;
      var newDoc;
      var docType = null;

      var domImpl;
      var element;
      var namespaceURI = "http://www.w3.org/xml/1998/namespace ";
      var qualifiedName = "xml:root";


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'documentcreateelementNS06');
      }
    });
  });

  describe('documentgetelementby', () => {
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
    specify('documentgetelementbyid01', () => {
      var success;
      var element;
      var elementId = "---";


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.getElementById(elementId);
      assert.equal(element, null, 'element should not be null');
    });
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
    specify('documentgetelementsbytagnameNS01', () => {
      var success;
      var newDoc;
      var docType = null;

      var domImpl;
      var childList;
      var nullNS = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      newDoc = domImpl.createDocument(nullNS,"root",docType);
      childList = newDoc.getElementsByTagNameNS("*","*");
      assert.equal(childList.length, 1, "documentgetelementsbytagnameNS01");
    });
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
    specify('documentgetelementsbytagnameNS02', () => {
      var success;
      var docElem;
      var element;
      var childList;
      var appendedChild;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      element = doc.createElementNS("test","employeeId");
      appendedChild = docElem.appendChild(element);
      childList = doc.getElementsByTagNameNS("*","employeeId");
      assert.equal(childList.length, 6, "documentgetelementsbytagnameNS02");
    });
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
    specify('documentgetelementsbytagnameNS03', () => {
      var success;
      var childList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      childList = doc.getElementsByTagNameNS("**","*");
      assert.equal(childList.length, 0, "documentgetelementsbytagnameNS03");
    });
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
    specify('documentgetelementsbytagnameNS04', () => {
      var success;
      var childList;
      var nullNS = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      childList = doc.getElementsByTagNameNS(nullNS,"0");
      assert.equal(childList.length, 0, "documentgetelementsbytagnameNS04");
    });
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
    specify('documentgetelementsbytagnameNS05', () => {
      var success;
      var childList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      childList = doc.getElementsByTagNameNS("null","elementId");
      assert.equal(childList.length, 0, "documentgetelementsbytagnameNS05");
    });
  });

  describe('documentimportnode', () => {
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
    specify('documentimportnode06', () => {
      var success;
      var docImported;


      var doc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          docImported = doc.importNode(doc,false);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 9);
        }
        assert.ok(success, 'throw_NOT_SUPPORTED_ERR');
      }
    });
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
    specify('documentimportnode09', () => {
      var success;
      var docFragment;
      var childList;
      var success;
      var addressNode;
      var appendedChild;
      var importedDocFrag;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docFragment = doc.createDocumentFragment();
      childList = doc.getElementsByTagNameNS("*","address");
      addressNode = childList.item(0);
      appendedChild = docFragment.appendChild(addressNode);
      importedDocFrag = doc.importNode(docFragment,false);
      success = importedDocFrag.hasChildNodes();
      assert.equal(success, false, 'success should be *false*');
    });
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
    specify('documentimportnode10', () => {
      var success;
      var docFragment;
      var childList;
      var success;
      var addressNode;
      var appendedChild;
      var importedDocFrag;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docFragment = doc.createDocumentFragment();
      childList = doc.getElementsByTagNameNS("*","address");
      addressNode = childList.item(0);
      appendedChild = docFragment.appendChild(addressNode);
      importedDocFrag = doc.importNode(docFragment,true);
      success = importedDocFrag.hasChildNodes();
      assert.ok(success, 'documentimportnode10');
    });
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
    specify('documentimportnode11', () => {
      var success;
      var docElement;
      var imported;
      var success;
      var nodeNameOrig;
      var nodeNameImported;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docElement = doc.documentElement;

      imported = doc.importNode(docElement,false);
      success = imported.hasChildNodes();
      assert.equal(success, false, 'success should be *false*');
      nodeNameImported = imported.nodeName;

      nodeNameOrig = docElement.nodeName;

      assert.equal(nodeNameOrig, nodeNameImported, "documentimportnode11_NodeName");
    });
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
    specify('documentimportnode12', () => {
      var success;
      var childList;
      var imported;
      var addressElem;
      var addressElemChildren;
      var importedChildren;
      var addressElemLen;
      var importedLen;


      var doc = require('./core/files/staffNS.xml').staffNS();
      childList = doc.getElementsByTagNameNS("*","address");
      addressElem = childList.item(0);
      imported = doc.importNode(addressElem,true);
      addressElemChildren = addressElem.childNodes;

      importedChildren = imported.childNodes;

      addressElemLen = addressElemChildren.length;

      importedLen = importedChildren.length;

      assert.equal(addressElemLen, importedLen, "documentimportnode12");
    });
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
    specify('documentimportnode13', () => {
      var success;
      var childList;
      var imported;
      var importedList;
      var employeeElem;
      var importedLen;


      var doc = require('./core/files/staffNS.xml').staffNS();
      childList = doc.getElementsByTagNameNS("*","employee");
      employeeElem = childList.item(0);
      imported = doc.importNode(employeeElem,false);
      importedList = imported.childNodes;

      importedLen = importedList.length;

      assert.equal(importedLen, 0, "documentimportnode13");
    });
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
    specify('documentimportnode15', () => {
      var success;
      var textImport;
      var textToImport;
      var nodeValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      var docImp = require('./core/files/staffNS.xml').staffNS();
      textToImport = doc.createTextNode("Document.importNode test for a TEXT_NODE");
      textImport = doc.importNode(textToImport,true);
      nodeValue = textImport.nodeValue;

      assert.equal(nodeValue, "Document.importNode test for a TEXT_NODE", "documentimportnode15");
    });
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
    specify('documentimportnode17', () => {
      var success;
      var commentImport;
      var commentToImport;
      var nodeValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      var docImp = require('./core/files/staffNS.xml').staffNS();
      commentToImport = doc.createComment("Document.importNode test for a COMMENT_NODE");
      commentImport = doc.importNode(commentToImport,true);
      nodeValue = commentImport.nodeValue;

      assert.equal(nodeValue, "Document.importNode test for a COMMENT_NODE", "documentimportnode17");
    });
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
    specify('documentimportnode18', () => {
      var success;
      var piImport;
      var piToImport;
      var piData;
      var piTarget;


      var doc = require('./core/files/staffNS.xml').staffNS();
      var docImp = require('./core/files/staffNS.xml').staffNS();
      piToImport = doc.createProcessingInstruction("Target","Data");
      piImport = doc.importNode(piToImport,false);
      piTarget = piImport.target;

      piData = piImport.data;

      assert.equal(piTarget, "Target", "documentimportnode18_Target");
      assert.equal(piData, "Data", "documentimportnode18_Data");
    });
  });

  describe('documenttypepublicid', () => {
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
    specify('documenttypepublicid01', () => {
      var success;
      var docType;
      var domImpl;
      var publicId;
      var nullNS = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      docType = domImpl.createDocumentType("l2:root","PUB",nullNS);
      publicId = docType.publicId;

      assert.equal(publicId, "PUB", "documenttypepublicid01");
    });
  });

  describe('documenttypesystemid', () => {
    /**
     *
     The method getInternalSubset() returns the public identifier of the external subset.

    Create a new DocumentType node with the value "SYS" for its systemId and PUB for
    its publicId.  Check the value of the systemId and pbulicId attributes.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-systemId
    */
    specify('documenttypesystemid01', () => {
      var success;
      var docType;
      var domImpl;
      var publicId;
      var systemId;


      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      docType = domImpl.createDocumentType("l2:root","PUB","SYS");
      publicId = docType.publicId;

      systemId = docType.systemId;

      assert.equal(publicId, "PUB", "documenttypepublicid01");
      assert.equal(systemId, "SYS", "documenttypesystemid01");
    });
  });

  describe('domimplementationcreatedocument', () => {
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
    specify('domimplementationcreatedocument03', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      for(var indexN1006B = 0;indexN1006B < qualifiedNames.length; indexN1006B++) {
        qualifiedName = qualifiedNames[indexN1006B];
        newDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        assert.notEqual(newDoc, null, 'newDoc should be null');

      }
    });
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
    specify('domimplementationcreatedocument04', () => {
      var success;
      var domImpl;
      var newDoc;
      var namespaceURI = null;

      var qualifiedName = "dom:root";
      var docType = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      {
        success = false;
        try {
          newDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'domimplementationcreatedocument04');
      }
    });
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
    specify('domimplementationcreatedocument05', () => {
      var success;
      var domImpl;
      var newDoc;
      var namespaceURI = "http://www.w3.org/xml/1998/namespace";
      var qualifiedName = "xml:root";
      var docType = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      {
        success = false;
        try {
          newDoc = domImpl.createDocument(namespaceURI,qualifiedName,docType);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'domimplementationcreatedocument05');
      }
    });
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
    specify('domimplementationcreatedocument07', () => {
      var success;
      var domImpl;
      var newDoc;
      var namespaceURI = "http://www.w3.org/DOMTest/level2";
      var docType = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;

      {
        success = false;
        try {
          newDoc = domImpl.createDocument(namespaceURI,":",docType);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'domimplementationcreatedocument07');
      }
    });
    /**
     *
     The method createDocumentType with valid values for qualifiedName, publicId and
    systemId should create an empty DocumentType node.

    Invoke createDocument on this DOMImplementation with a valid qualifiedName and different
    publicIds and systemIds.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocument
    */
    specify('domimplementationcreatedocumenttype01', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      for(var indexN1005D = 0;indexN1005D < publicIds.length; indexN1005D++) {
        publicId = publicIds[indexN1005D];
        for(var indexN10061 = 0;indexN10061 < systemIds.length; indexN10061++) {
          systemId = systemIds[indexN10061];
          newDocType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
          assert.notEqual(newDocType, null, 'newDocType should be null');
          ownerDocument = newDocType.ownerDocument;

          assert.equal(ownerDocument, doc, 'ownerDocument should not be null');

        }

      }
    });
    /**
     *

    The method createDocumentType with valid values for qualifiedName, publicId and

    systemId should create an empty DocumentType node.



    Invoke createDocument on this DOMImplementation with a different valid qualifiedNames

    and a valid publicId and systemId.  Check if the the DocumentType node was created

    with its ownerDocument attribute set to the document.


    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#Level-2-Core-DOM-createDocType
    */
    specify('domimplementationcreatedocumenttype02', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
      domImpl = doc.implementation;
      for(var indexN10077 = 0;indexN10077 < qualifiedNames.length; indexN10077++) {
        qualifiedName = qualifiedNames[indexN10077];
        newDocType = domImpl.createDocumentType(qualifiedName,publicId,systemId);
        assert.notEqual(newDocType, null, 'newDocType should be null');
        ownerDocument = newDocType.ownerDocument;

        assert.equal(ownerDocument, doc, 'ownerDocument should not be null ' + qualifiedName);

      }
    });
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
    specify('domimplementationcreatedocumenttype04', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
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
    assert.ok(success, 'domimplementationcreatedocumenttype04');
        }

      }
    });
  })

  describe('domimplementationfeaturecore', () => {
    /**
     *

    The "feature" parameter in the

    "hasFeature(feature,version)" method is the package name

    of the feature.  Legal values are XML and HTML and CORE.

    (Test for feature core, lower case)



    Retrieve the entire DOM document and invoke its

    "document.implementation" method.  This should create a

    DOMImplementation object whose "hasFeature(feature,

    version)" method is invoked with feature equal to "core".

    The method should return a boolean "true".


    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
    */
    specify('domimplementationfeaturecore', () => {
      var success;
      var domImpl;
      var state;


      var doc = require('../level1/core/files/staff.xml').staff();
      domImpl = doc.implementation;
      state = domImpl.hasFeature("core","2.0");
      assert.ok(state, 'domimplementationFeaturecore');
    });
  });

  describe('domimplementationfeaturexmlversion2', () => {
    /**
     *

    The "feature" parameter in the

    "hasFeature(feature,version)" method is the package name

    of the feature.  Legal values are XML and HTML.

    (Test for feature "xml" and version "2.0")



    Retrieve the entire DOM document and invoke its

    "document.implementation" method.  This should create a

    DOMImplementation object whose "hasFeature(feature,

    version)" method is invoked with "feature" equal to "xml".

    The method should return a boolean "true".


    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-5CED94D7
    */
    specify('domimplementationfeaturexmlversion2', () => {
      var success;
      var domImpl;
      var state;


      var doc = require('../level1/core/files/staff.xml').staff();
      domImpl = doc.implementation;
      state = domImpl.hasFeature("xml","2.0");
      assert.ok(state, 'domimplementationFeaturexmlVersion2');
    });
  })

  describe('elementgetattributenodens', () => {
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
    specify('elementgetattributenodens01', () => {
      var success;
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


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("namespaceURI","root");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/Level2","l2:att");
      newAttribute1 = element.setAttributeNodeNS(attribute1);
      attribute2 = doc.createAttributeNS("http://www.w3.org/DOM/Level1","att");
      newAttribute2 = element.setAttributeNodeNS(attribute2);
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Level2","att");
      attrValue = attribute.nodeValue;

      attrName = attribute.name;

      attNodeName = attribute.name;

      attrLocalName = attribute.localName;

      attrNS = attribute.namespaceURI;

      assert.equal(attrValue, "", "elementgetattributenodens01_attrValue");
      assert.equal(attrName, "l2:att", "elementgetattributenodens01_attrName");
      assert.equal(attNodeName, "l2:att", "elementgetattributenodens01_attrNodeName");
      assert.equal(attrLocalName, "att", "elementgetattributenodens01_attrLocalName");
      assert.equal(attrNS, "http://www.w3.org/DOM/Level2", "elementgetattributenodens01_attrNs");
    });
    /**
     *
     The method getAttributeNodeNS retrieves an Attr node by local name and namespace URI.
    Create a new element node and add a new attribute node to it.  Using the getAttributeNodeNS,
    retrieve the newly added attribute node and check its value.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElGetAtNodeNS
    */
    specify('elementgetattributenodens02', () => {
      var success;
      var element;
      var attribute;
      var newAttribute1;
      var attrValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("namespaceURI","root");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM/Level2","l2:att");
      newAttribute1 = element.setAttributeNodeNS(attribute);
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Level2","att");
      attrValue = attribute.nodeValue;

      assert.equal(attrValue, "", "elementgetattributenodens02");
    });
  })

  describe('elementgetelementsbytagnamens', () => {
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
    specify('elementgetelementsbytagnamens02', () => {
      var success;
      var element;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.documentElement;

      elementList = element.getElementsByTagNameNS("**","*");
      assert.equal(elementList.length, 0, "elementgetelementsbytagnamens02");
    });
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
    specify('elementgetelementsbytagnamens04', () => {
      var success;
      var element;
      var child1;
      var child2;
      var child3;
      var appendedChild;
      var elementList;
      var nullNS = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("http://www.w3.org/DOM","root");
      child1 = doc.createElementNS("http://www.w3.org/DOM/Level1","dom:child");
      child2 = doc.createElementNS(nullNS,"child");
      child3 = doc.createElementNS("http://www.w3.org/DOM/Level2","dom:child");
      appendedChild = element.appendChild(child1);
      appendedChild = element.appendChild(child2);
      appendedChild = element.appendChild(child3);
      elementList = element.getElementsByTagNameNS(nullNS,"child");
      assert.equal(elementList.length, 1, "elementgetelementsbytagnamens04_1");
      elementList = element.getElementsByTagNameNS("*","child");
      assert.equal(elementList.length, 3, "elementgetelementsbytagnamens04_2");
    });
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
    specify('elementgetelementsbytagnamens05', () => {
      var success;
      var element;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.documentElement;

      elementList = element.getElementsByTagNameNS("http://www.altavista.com","*");
      assert.equal(elementList.length, 1, "elementgetelementsbytagnamens05");
    });
  })

  describe('elementhasattribute', () => {
    /**
     *

    The method hasAttribute returns true when an attribute with a given name is specified

    on this element or has a default value, false otherwise

    Invoke the hasAttribute method to check if the documentElement has attributres.


    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
    */
    specify('elementhasattribute01', () => {
      var success;
      var element;
      var state;


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.documentElement;

      state = element.hasAttribute("");
      assert.equal(state, false, 'state should be *false*');
    });
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
    specify('elementhasattribute03', () => {
      var success;
      var element;
      var state;
      var attribute;
      var newAttribute;


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElement("address");
      attribute = doc.createAttribute("domestic");
      state = element.hasAttribute("domestic");
      assert.equal(state, false, 'state should be *false*');
      newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttribute("domestic");
      assert.ok(state, 'elementhasattribute03_True');
    });
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
    specify('elementhasattribute04', () => {
      var success;
      var element;
      var state;
      var attribute;
      var newAttribute;


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElement("address");
      attribute = doc.createAttribute("domestic");
      newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttribute("domestic");
      assert.ok(state, 'elementhasattribute04');
    });
  })

  describe('elementhasattributens', () => {
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
    specify('elementhasattributens01', () => {
      var success;
      var element;
      var state;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("*","employee");
      element = elementList.item(0);
      state = element.hasAttributeNS("http://www.w3.org/2000/xmlns/","xmlns");
      assert.ok(state, 'elementhasattributens01');
    });
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
    specify('elementhasattributens02', () => {
      var success;
      var element;
      var state;
      var attribute;
      var newAttribute;


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS("http://www.w3.org/DOM","address");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM","domestic");
      newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttributeNS("http://www.w3.org/DOM","domestic");
      assert.ok(state, 'hasDomesticAttr');
    });
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
    specify('elementhasattributens03', () => {
      var success;
      var element;
      var state;
      var attribute;
      var newAttribute;
      var nullNS = null;



      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS("http://www.w3.org/DOM","address");
      assert.notEqual(element, null, 'element should be null');
      attribute = doc.createAttributeNS(nullNS,"domestic");
      newAttribute = element.setAttributeNode(attribute);
      state = element.hasAttributeNS(nullNS,"domestic");
      assert.ok(state, 'elementhasattributens03');
    });
  })

  describe('elementremoveattributens', () => {
    /**
     *
     The method removeAttributeNS removes an attribute by local name and namespace URI.
    Create a new element and add a new attribute node to it.
    Remove the attribute node using the removeAttributeNodeNS method.
    Check if the attribute was removed by invoking the hasAttributeNS
    method on the element and check if it returns false.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElRemAtNS
    */
    specify('elementremoveattributens01', () => {
      var success;
      var element;
      var state;
      var attribute;
      var newAttribute;

      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS("http://www.w3.org/DOM","elem");
      attribute = doc.createAttributeNS("http://www.w3.org/DOM/Test/createAttributeNS","attr");
      newAttribute = element.setAttributeNodeNS(attribute);
      assert.equal(element.removeAttributeNS("http://www.w3.org/DOM/Test/createAttributeNS","attr"), undefined, "should be undefined");
      state = element.hasAttributeNS("http://www.w3.org/DOM/Test/createAttributeNS","attr");
      assert.equal(state, false, 'state should be *false*');
    });
  })

  describe('elementsetattributenodens', () => {
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
    specify('elementsetattributenodens01', () => {
      var success;
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


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS("http://www.w3.org/DOM/Test/Level2","new:element");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/Test/att1","p1:att");
      attribute2 = doc.createAttributeNS("http://www.w3.org/DOM/Test/att1","p2:att");
      attribute2.value = "value2";

      newAttribute = element.setAttributeNodeNS(attribute1);
      newAttribute = element.setAttributeNodeNS(attribute2);
      attrNode = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/att1","att");
      attrName = attrNode.name;

      attrNS = attrNode.namespaceURI;

      assert.equal(attrName, "p2:att", "elementsetattributenodens01_attrName");
      assert.equal(attrNS, "http://www.w3.org/DOM/Test/att1", "elementsetattributenodens01_attrNS");
      attributes = element.attributes;

      length = attributes.length;

      assert.equal(length, 1, "length");
    });
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
    specify('elementsetattributenodens03', () => {
      var success;
      var element1;
      var element2;
      var attribute;
      var newAttribute;
      var elementList;
      var nullNS = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'elementsetattributenodens03');
      }
    });
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
    specify('elementsetattributenodens04', () => {
      var success;
      var element1;
      var element2;
      var attribute;
      var newAttribute;


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'elementsetattributenodens04');
      }
    });
  });

  describe('elementsetattributens', () => {
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
    specify('elementsetattributens01', () => {
      var success;
      var element;
      var attribute;
      var attrName;
      var attrValue;


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS("http://www.w3.org/DOM","dom:elem");
      element.setAttributeNS("http://www.w3.org/DOM/Test/setAttributeNS","attr","value");
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/setAttributeNS","attr");
      attrName = attribute.name;

      attrValue = attribute.nodeValue;

      assert.equal(attrName, "attr", "elementsetattributens01_attrName");
      assert.equal(attrValue, "value", "elementsetattributens01_attrValue");
    });
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
    specify('elementsetattributens02', () => {
      var success;
      var element;
      var attribute;
      var elementList;
      var attrName;
      var attrValue;


      var doc = require('../level1/core/files/staff.xml').staff();
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(0);
      element.setAttributeNS("http://www.w3.org/DOM/Test/setAttributeNS","this:street","Silver Street");
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/setAttributeNS","street");
      attrName = attribute.name;

      attrValue = attribute.nodeValue;

      assert.equal(attrName, "this:street", "elementsetattributens02_attrName");
      assert.equal(attrValue, "Silver Street", "elementsetattributens02_attrValue");
    });
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
    specify('elementsetattributens03', () => {
      var success;
      var element;
      var attribute;
      var elementList;
      var attrName;
      var attrValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:employee");
      element = elementList.item(0);
      assert.notEqual(element, null, 'element should be null');
      element.setAttributeNS("http://www.w3.org/DOM/Test/1","defaultAttr","default1");
      element.setAttributeNS("http://www.w3.org/DOM/Test/2","defaultAttr","default2");
      attribute = element.getAttributeNodeNS("http://www.w3.org/DOM/Test/1","defaultAttr");
      attrName = attribute.name;

      attrValue = attribute.nodeValue;

      assert.equal(attrName, "defaultAttr", "elementsetattributens03_attrName");
      assert.equal(attrValue, "default1", "elementsetattributens03_attrValue");
    });
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
    specify('elementsetattributens04', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
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
    assert.ok(success, 'elementsetattributens04');
        }

      }
    });
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
    specify('elementsetattributens05', () => {
      var success;
      var element;
      var nullNS = null;



      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("http://www.w3.org/DOM/Test/L2","dom:elem");

      {
        success = false;
        try {
          element.setAttributeNS(nullNS,"dom:root","test");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'elementsetattributens05');
      }
    });
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
    specify('elementsetattributens08', () => {
      var success;
      var element;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("http://www.w3.org/DOMTest/level2","dom:elem");

      {
        success = false;
        try {
          element.setAttributeNS("http://www.w3.org/DOMTest/level2","xmlns","test");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'elementsetattributens08_Err1');
      }

      {
        success = false;
        try {
          element.setAttributeNS("http://www.w3.org/DOMTest/level2","xmlns:root","test");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 14);
        }
        assert.ok(success, 'elementsetattributens08_Err2');
      }
    });
    /**
     *
     The method setAttributeNS adds a new attribute in no namespace if
    the namespace URI is set to "".

    * @author Louis-Dominique Dubeau
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
    * @see http://dom.spec.whatwg.org/#dom-element-setattributens
    */
    specify('elementsetattributens09', () => {
      var element;

      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElement("elem");

      element.setAttributeNS("","x","test");
      assert.equal(element.getAttribute("x"), "test", "getAttribute");
      assert.equal(element.getAttributeNS("", "x"), "test",
                "getAttributeNS with ''");
      assert.equal(element.getAttributeNS(null, "x"), "test",
                "getAttributeNS with null");
    });
  });

  describe('elementsetattributensurinull', () => {
    /**
     *
     The "setAttributeNS(namespaceURI,qualifiedName,value)" method raises a NAMESPACE_ERR DOMException if the specified qualifiedName has a prefix and the namespaceURI is null.

    Attempt to add a new attribute on the first employee node.
    An exception should be raised since the "qualifiedName" has a prefix and the namespaceURI is null.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NAMESPACE_ERR'])
    */
    specify('elementsetattributensurinull', () => {
      var success;
      var namespaceURI = null;

      var qualifiedName = "emp:qualifiedName";
      var elementList;
      var testAddr;


      var doc = require('../level1/core/files/staff.xml').staff();
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
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
  });

  describe('getAttributeNS', () => {
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
    specify('getAttributeNS01', () => {
      var success;
      var namespaceURI = "http://www.nist.gov";
      var localName = "district";
      var qualifiedName = "emp:district";
      var elementList;
      var testAddr;
      var attrValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);
      assert.equal(attrValue, "DISTRICT", "attrValue");
    });
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
    specify('getAttributeNS02', () => {
      var success;
      var namespaceURI = "http://www.nist.gov";
      var localName = "district";
      var qualifiedName = "emp:district";
      var newAttribute;
      var elementList;
      var testAddr;
      var districtAttr;
      var attrValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      newAttribute = doc.createAttributeNS(namespaceURI,qualifiedName);
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      districtAttr = testAddr.setAttributeNodeNS(newAttribute);
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);
      assert.equal(attrValue, "", "throw_Equals");
    });
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
    specify('getAttributeNS03', () => {
      var success;
      var namespaceURI = "http://www.nist.gov";
      var localName = "domestic";
      var elementList;
      var testAddr;
      var attrValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      testAddr.removeAttributeNS(namespaceURI, localName);
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);

  // XXX SUPERSEDED BY DOM4
  //    test.equal(attrValue, "", "throw_Equals");
      assert.equal(attrValue, null, "throw_Equals");

    });
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
    specify('getAttributeNS04', () => {
      var success;
      var namespaceURI = "http://www.nist.gov";
      var localName = "blank";
      var qualifiedName = "emp:blank";
      var newAttribute;
      var elementList;
      var testAddr;
      var districtAttr;
      var attrValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      newAttribute = doc.createAttributeNS(namespaceURI,qualifiedName);
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      testAddr.setAttributeNS(namespaceURI,qualifiedName,"NewValue");
      attrValue = testAddr.getAttributeNS(namespaceURI,localName);
      assert.equal(attrValue, "NewValue", "throw_Equals");
    });
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
    specify('getAttributeNS05', () => {
      var success;
      var elementList;
      var testAddr;
      var attrValue;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      attrValue = testAddr.getAttributeNS("http://www.nist.gov","domestic");
      assert.equal(attrValue, "Yes", "attrValue");
    });
  });

  describe('getAttributeNodeNS', () => {
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
    specify('getAttributeNodeNS01', () => {
      var success;
      var namespaceURI = "http://www.nist.gov";
      var localName = "invalidlocalname";
      var elementList;
      var testAddr;
      var attribute;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      attribute = testAddr.getAttributeNodeNS(namespaceURI,localName);
      assert.equal(attribute, null, 'attribute should not be null');
    });
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
    specify('getAttributeNodeNS02', () => {
      var success;
      var elementList;
      var testAddr;
      var attribute;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      attribute = testAddr.getAttributeNodeNS("http://www.nist.gov","domestic");
      attrName = attribute.name;

      assert.equal(attrName, "emp:domestic", "attrName");
    });
  });

  describe('getElementById', () => {
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
    specify('getElementById01', () => {
      var success;
      var element;
      var tagname;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.getElementById("CANADA");
      tagname = element.tagName;

      assert.equal(tagname, "emp:address", "throw_Equals");
    });
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
    specify('getElementById02', () => {
      var success;
      var element;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.getElementById("Cancun");
      assert.equal(element, null, 'element should not be null');
    });
  });

  describe('getElementsByTagNameNS', () => {
    /**
     *
     The "getElementsByTagNameNS(namespaceURI,localName)" method for a
    Document should return a new NodeList of all Elements that have a namespace
    when local name is specified as ' '.

    Invoke method getElementsByTagNameNS(namespaceURI,localName) on this document
    with namespaceURI and localName as " ".
    Method should return a new NodeList of 36 elements.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-getElBTNNS
    */
    specify('getElementsByTagNameNS01', () => {
      var success;
      var namespaceURI = "*";
      var localName = "*";
      var newList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      newList = doc.getElementsByTagNameNS(namespaceURI,localName);

      // adjusted for lack of entity expansion support
      assert.equal(newList.length, 36, "throw_Size");
    });
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
    specify('getElementsByTagNameNS02', () => {
      var success;
      var newList;
      var newElement;
      var prefix;
      var lname;


      var doc = require('./core/files/staffNS.xml').staffNS();
      newList = doc.getElementsByTagNameNS("*","employee");
      assert.equal(newList.length, 5, "employeeCount");
      newElement = newList.item(3);
      prefix = newElement.prefix;

      assert.equal(prefix, "emp", "prefix");
      lname = newElement.localName;

      assert.equal(lname, "employee", "lname");
    });
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
    specify('getElementsByTagNameNS03', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","*");
      for(var indexN10076 = 0;indexN10076 < elementList.length; indexN10076++) {
        child = elementList.item(indexN10076);
        childName = child.nodeName;

        result[result.length] = childName;

      }
      assert.deepEqual(result, expectedResult, 'nodeNames');
    });
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
    specify('getElementsByTagNameNS04', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("*","address");
      for(var indexN10059 = 0;indexN10059 < elementList.length; indexN10059++) {
        child = elementList.item(indexN10059);
        childName = child.nodeName;

        result[result.length] = childName;

      }
      assert.deepEqual(result, expectedResult, 'nodeNames');
    });
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
    specify('getElementsByTagNameNS05', () => {
      var success;
      var namespaceURI = "http://www.nist.gov";
      var localName = "nomatch";
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS(namespaceURI,localName);
      assert.equal(elementList.length, 0, "throw_Size");
    });
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
    specify('getElementsByTagNameNS06', () => {
      var success;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nomatch.com","address");
      assert.equal(elementList.length, 0, "matchSize");
    });
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
    specify('getElementsByTagNameNS07', () => {
      var success;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      assert.equal(elementList.length, 3, "addresses");
    });
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
    specify('getElementsByTagNameNS08', () => {
      var success;
      var docElem;
      var newList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      newList = docElem.getElementsByTagNameNS("*","*");

      // adjusted for lack of entity expansion support
      assert.equal(newList.length, 35, "listSize");
    });
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
    specify('getElementsByTagNameNS09', () => {
      var success;
      var newList;
      var newElement;
      var prefix;
      var lname;
      var docElem;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      newList = docElem.getElementsByTagNameNS("*","employee");
      assert.equal(newList.length, 5, "employeeCount");
      newElement = newList.item(3);
      prefix = newElement.prefix;

      assert.equal(prefix, "emp", "prefix");
      lname = newElement.localName;

      assert.equal(lname, "employee", "lname");
    });
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
    specify('getElementsByTagNameNS10', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nist.gov","*");
      for(var indexN1007E = 0;indexN1007E < elementList.length; indexN1007E++) {
        child = elementList.item(indexN1007E);
        childName = child.nodeName;

        result[result.length] = childName;

      }
      assert.deepEqual(result, expectedResult, 'nodeNames');
    });
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
    specify('getElementsByTagNameNS11', () => {
      var success;
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



      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("*","address");
      for(var indexN1005E = 0;indexN1005E < elementList.length; indexN1005E++) {
        child = elementList.item(indexN1005E);
        childName = child.nodeName;

        result[result.length] = childName;

      }
      assert.deepEqual(result, expectedResult, 'nodeNames');
    });
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
    specify('getElementsByTagNameNS12', () => {
      var success;
      var docElem;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nist.gov","nomatch");
      assert.equal(elementList.length, 0, "size");
    });
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
    specify('getElementsByTagNameNS13', () => {
      var success;
      var docElem;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nomatch.com","address");
      assert.equal(elementList.length, 0, "matchSize");
    });
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
    specify('getElementsByTagNameNS14', () => {
      var success;
      var docElem;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docElem = doc.documentElement;

      elementList = docElem.getElementsByTagNameNS("http://www.nist.gov","address");
      assert.equal(elementList.length, 3, "addresses");
    });
  });

  describe('getNamedItemNS', () => {
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
    specify('getNamedItemNS01', () => {
      var success;
      var elementList;
      var testEmployee;
      var attributes;
      var domesticAttr;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("address");
      testEmployee = elementList.item(1);
      attributes = testEmployee.attributes;

      domesticAttr = attributes.getNamedItemNS("http://www.usa.com","domestic");
      attrName = domesticAttr.name;

      assert.equal(attrName, "dmstc:domestic", "attrName");
    });
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
    specify('getNamedItemNS02', () => {
      var success;
      var namespaceURI = "http://www.usa.com";
      var localName = "domest";
      var elementList;
      var testEmployee;
      var attributes;
      var newAttr;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("address");
      testEmployee = elementList.item(1);
      attributes = testEmployee.attributes;

      newAttr = attributes.getNamedItemNS(namespaceURI,localName);
      assert.equal(newAttr, null, 'newAttr should not be null');
    });
  });

  describe('hasAttribute', () => {
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
    specify('hasAttribute01', () => {
      var success;
      var elementList;
      var testNode;
      var state;


      var doc = require('../level1/core/files/staff.xml').staff();
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(4);
      state = testNode.hasAttribute("domestic");
      assert.equal(state, false, 'state should be *false*');
    });
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
    specify('hasAttribute03', () => {
      var success;
      var elementList;
      var testNode;
      var state;


      var doc = require('../level1/core/files/staff.xml').staff();
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttribute("nomatch");
      assert.equal(state, false, 'state should be *false*');
    });
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
    specify('hasAttribute04', () => {
      var success;
      var elementList;
      var testNode;
      var state;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttribute("dmstc:domestic");
      assert.ok(state, 'hasDomesticAttr');
    });
  });

  describe('hasAttributeNS', () => {
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
    specify('hasAttributeNS01', () => {
      var success;
      var localName = "nomatch";
      var namespaceURI = "http://www.usa.com";
      var elementList;
      var testNode;
      var state;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttributeNS(namespaceURI,localName);
      assert.equal(state, false, 'state should be *false*');
    });
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
    specify('hasAttributeNS02', () => {
      var success;
      var localName = "domestic";
      var namespaceURI = "http://www.nomatch.com";
      var elementList;
      var testNode;
      var state;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttributeNS(namespaceURI,localName);
      assert.equal(state, false, 'state should be *false*');
    });
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
    specify('hasAttributeNS03', () => {
      var success;
      var localName = "blank";
      var namespaceURI = "http://www.nist.gov";
      var elementList;
      var testNode;
      var state;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testNode = elementList.item(0);
      assert.notEqual(testNode, null, 'testNode should be null');
      state = testNode.hasAttributeNS(namespaceURI,localName);
      assert.equal(state, false, 'state should be *false*');
    });
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
    specify('hasAttributeNS05', () => {
      var success;
      var localName = "domestic";
      var namespaceURI = "http://www.usa.com";
      var elementList;
      var testNode;
      var state;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("address");
      testNode = elementList.item(0);
      state = testNode.hasAttributeNS(namespaceURI,localName);
      assert.ok(state, 'hasAttribute');
    });
    /**
     *
     The method hasAttributeNS checks in no namespace if the namespace
    URI is set to "".

    * @author Louis-Dominique Dubeau
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-ElHasAttrNS
    * @see http://dom.spec.whatwg.org/#dom-element-hasattributens
    */
    specify('hasAttributeNS06', () => {
      var element;

      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElement("elem");

      element.setAttribute("x","test");
      assert.ok(element.hasAttributeNS("", "x"), "getAttributeNS with ''");
      assert.ok(element.hasAttributeNS(null, "x"), "getAttributeNS with null");
    });
  });

  describe('hasAttributes', () => {
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
    specify('hasAttributes01', () => {
      var success;
      var addrList;
      var addrNode;
      var state;


      var doc = require('../level1/core/files/staff.xml').staff();
      addrList = doc.getElementsByTagName("name");
      addrNode = addrList.item(0);
      state = addrNode.hasAttributes();
      assert.equal(state, false, 'state should be *false*');
    });
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
    specify('hasAttributes02', () => {
      var success;
      var addrList;
      var addrNode;
      var state;


      var doc = require('../level1/core/files/staff.xml').staff();
      addrList = doc.getElementsByTagName("address");
      addrNode = addrList.item(0);
      state = addrNode.hasAttributes();
      assert.ok(state, 'throw_True');
    });
  });

  describe('importNode', () => {
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
    specify('importNode03', () => {
      var comment;
      var aNode;
      var ownerDocument;
      var doc = require('./core/files/staffNS.xml').staffNS();
      var aNewDoc = require('./core/files/staffNS.xml').staffNS();
      comment = aNewDoc.createComment("this is a comment");
      aNode = doc.importNode(comment,false);
      ownerDocument = aNode.ownerDocument;
      assert.notEqual(ownerDocument, null, 'ownerDocument should be null');
      assert.equal(doc.doctype.systemId, 'staffNS.dtd')
      assert.equal(aNode.nodeValue, "this is a comment", "nodeValue");
    });
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
    specify('importNode04', () => {
      var success;
      var docFrag;
      var comment;
      var aNode;
      var children;
      var child;
      var childValue;
      var doc = require('../level1/core/files/staff.xml').staff();
      var aNewDoc = require('../level1/core/files/staff.xml').staff();
      docFrag = aNewDoc.createDocumentFragment();
      comment = aNewDoc.createComment("descendant1");
      aNode = docFrag.appendChild(comment);
      aNode = doc.importNode(docFrag,true);
      children = aNode.childNodes;

      assert.equal(children.length, 1, "throw_Size");
      child = aNode.firstChild;

      childValue = child.nodeValue;

      assert.equal(childValue, "descendant1", "descendant1");
    });
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
    specify('importNode05', () => {
      var element;
      var aNode;
      var hasChild;
      var ownerDocument;
      var addresses;
      var doc = require('./core/files/staffNS.xml').staffNS();
      var aNewDoc = require('./core/files/staffNS.xml').staffNS();
      addresses = aNewDoc.getElementsByTagName("emp:address");
      element = addresses.item(0);
      assert.notEqual(element, null, 'element should be null');
      aNode = doc.importNode(element,false);
      hasChild = aNode.hasChildNodes();
      assert.equal(hasChild, false, 'hasChild should be *false*');
      ownerDocument = aNode.ownerDocument;
      assert.equal(doc.doctype.systemId, 'staffNS.dtd')
      assert.equal(aNode.nodeName, "emp:address", "nodeName");
    });
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
    specify('importNode06', () => {
      var success;
      var element;
      var aNode;
      var hasChild;
      var name;
      var child;
      var value;
      var addresses;


      var doc = require('./core/files/staffNS.xml').staffNS();
      var aNewDoc = require('./core/files/staffNS.xml').staffNS();
      addresses = aNewDoc.getElementsByTagName("emp:address");
      element = addresses.item(0);
      assert.notEqual(element, null, 'element should be null');
      aNode = doc.importNode(element,true);
      hasChild = aNode.hasChildNodes();
      assert.ok(hasChild, 'throw_True');
      name = aNode.nodeName;

      assert.equal(name, "emp:address", "nodeName");
      child = aNode.firstChild;

      value = child.nodeValue;

      assert.equal(value, "27 South Road. Dallas, texas 98556", "nodeValue");
    });
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
    specify('importNode08', () => {
      var docFrag;
      var aNode;
      var hasChild;
      var ownerDocument;
      var doc = require('./core/files/staffNS.xml').staffNS();
      var aNewDoc = require('./core/files/staffNS.xml').staffNS();
      docFrag = aNewDoc.createDocumentFragment();
      aNode = doc.importNode(docFrag,false);
      hasChild = aNode.hasChildNodes();
      assert.equal(hasChild, false, 'hasChild should be *false*');
      ownerDocument = aNode.ownerDocument;
      assert.equal(doc.doctype.systemId, 'staffNS.dtd')
    });
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
    specify('importNode14', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var aNewDoc = require('./core/files/staffNS.xml').staffNS();
      var pi = aNewDoc.createProcessingInstruction("target1","data1");
      var aNode = doc.importNode(pi,false);
      assert.notEqual(aNode.ownerDocument, null, 'ownerDocument should be null');
      assert.equal(aNode.ownerDocument.doctype.systemId, 'staffNS.dtd')
      target = aNode.target;
      assert.equal(target, "target1", "piTarget");
      data = aNode.data;
      assert.equal(data, "data1", "piData");
    });
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
    specify('importNode15', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var aNewDoc = require('./core/files/staffNS.xml').staffNS();
      var text = aNewDoc.createTextNode("this is text data");
      var aNode = doc.importNode(text,false);
      assert.notEqual(aNode.ownerDocument, null, 'ownerDocument should be null');
      assert.equal(aNode.ownerDocument.doctype.systemId, 'staffNS.dtd')
      assert.equal(aNode.nodeValue, "this is text data", "nodeValue");
    });
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
    specify('importNode17', () => {
      var success;
      var node;


      var doc = require('./core/files/staffNS.xml').staffNS();
      var anotherDoc = require('./core/files/staffNS.xml').staffNS();

      {
        success = false;
        try {
          node = doc.importNode(anotherDoc,false);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 9);
        }
        assert.ok(success, 'throw_NOT_SUPPORTED_ERR');
      }
    });
  });

  describe('localName', () => {
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
    specify('localName01', () => {
      var success;
      var elementList;
      var testAddr;
      var addrAttr;
      var localName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      addrAttr = testAddr.getAttributeNode("emp:domestic");
      localName = addrAttr.localName;

      assert.equal(localName, "domestic", "localName");
    });
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
    specify('localName02', () => {
      var success;
      var createdNode;
      var localName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      createdNode = doc.createElement("test:employee");
      localName = createdNode.localName;

      assert.equal(localName, 'test:employee', 'localName should be "test:employee"');
    });
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
    specify('localName03', () => {
      var success;
      var elementList;
      var testEmployee;
      var textNode;
      var localName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("employeeId");
      testEmployee = elementList.item(0);
      textNode = testEmployee.firstChild;

      localName = textNode.localName;

      assert.equal(localName, null, 'localName should not be null');
    });
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
    specify('localName04', () => {
      var success;
      var elementList;
      var testEmployee;
      var employeeLocalName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(0);
      employeeLocalName = testEmployee.localName;

      assert.equal(employeeLocalName, "employee", "lname");
    });
  });

  describe('namednodemapgetnameditemns', () => {
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
    specify('namednodemapgetnameditemns02', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var elementList;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("http://www.nist.gov","domestic");
      attrName = attribute.name;

      assert.equal(attrName, "emp:domestic", "namednodemapgetnameditemns02");
    });
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
    specify('namednodemapgetnameditemns03', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var newAttr1;
      var newAttr2;
      var newAttribute;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("http://www.w3.org/DOM/Test","root");
      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      newAttr2 = doc.createAttributeNS("http://www.w3.org/DOM/L2","L2:att");
      newAttribute = element.setAttributeNodeNS(newAttr2);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L2","att");
      attrName = attribute.name;

      assert.equal(attrName, "L2:att", "namednodemapgetnameditemns03");
    });
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
    specify('namednodemapgetnameditemns04', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var newAttr1;
      var newAttribute;
      var elementList;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","street");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L1","street");
      attrName = attribute.name;

      assert.equal(attrName, "street", "namednodemapgetnameditemns04");
    });
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
    specify('namednodemapgetnameditemns05', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.getNamedItemNS("*","street");
      assert.equal(attribute, null, 'attribute should not be null');
    });
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
    specify('namednodemapgetnameditemns06', () => {
      var success;
      var attributesMap1;
      var attributesMap2;
      var element;
      var attribute;
      var newAttr1;
      var newAttribute;
      var elementList;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("*","address");
      element = elementList.item(1);
      attributesMap1 = element.attributes;

      attributesMap2 = element.attributes;

      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","street");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      attribute = attributesMap1.getNamedItemNS("http://www.w3.org/DOM/L1","street");
      attrName = attribute.name;

      assert.equal(attrName, "street", "namednodemapgetnameditemnsMap106");
      attribute = attributesMap2.getNamedItemNS("http://www.w3.org/DOM/L1","street");
      attrName = attribute.name;

      assert.equal(attrName, "street", "namednodemapgetnameditemnsMap206");
    });
  });

  describe('namednodemapremovenameditemns', () => {
    /**
     *
     The method removeNamedItemNS removes a node specified by local name and namespace

    Retreive an attribute node and then remove from the NamedNodeMap.  Verify if the attribute
    node was actually remove from the node map.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
    */
    specify('namednodemapremovenameditemns01', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.removeNamedItemNS("http://www.nist.gov","domestic");
      attribute = attributes.getNamedItemNS("http://www.nist.gov","domestic");
      assert.equal(attribute, null, 'attribute should not be null');
    });
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
    specify('namednodemapremovenameditemns03', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var newAttribute;
      var attribute1;
      var attribute2;
      var nodeName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("http://www.w3.org/DOM/Test","root");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      newAttribute = element.setAttributeNodeNS(attribute1);
      attribute2 = doc.createAttributeNS("http://www.w3.org/DOM/L2","L2:att");
      newAttribute = element.setAttributeNodeNS(attribute2);
      attributes = element.attributes;

      attribute = attributes.removeNamedItemNS("http://www.w3.org/DOM/L1","att");
      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L2","att");
      nodeName = attribute.name;

      assert.equal(nodeName, "L2:att", "namednodemapremovenameditemns02");
    });
    /**
     *
     The method removeNamedItemNS removes a node specified by local name and namespace

    Attempt to remove the xmlns and dmstc attributes of the first element node with the localName
    employee.  Verify if the 2 attributes were successfully removed.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
    */
    specify('namednodemapremovenameditemns04', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var attributeRemoved;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("*","employee");
      element = elementList.item(0);
      attributes = element.attributes;

      attributeRemoved = attributes.removeNamedItemNS("http://www.w3.org/2000/xmlns/","xmlns");
      attribute = attributes.getNamedItemNS("http://www.w3.org/2000/xmlns/","xmlns");
      assert.equal(attribute, null, 'attribute should not be null');
      attributeRemoved = attributes.removeNamedItemNS("http://www.w3.org/2000/xmlns/","dmstc");
      attribute = attributes.getNamedItemNS("http://www.w3.org/2000/xmlns/","dmstc");
      assert.equal(attribute, null, 'attribute should not be null');
    });
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
    specify('namednodemapremovenameditemns06', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'throw_NOT_FOUND_ERR');
      }
    });
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
    specify('namednodemapremovenameditemns07', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'throw_NOT_FOUND_ERR');
      }
    });
    /**
     *
     The method removeNamedItemNS removes a node using its namespaceURI and localName and
    raises a NOT_FOUND_ERR if there is no node with the specified namespaceURI and
    localName in this map

    Retreive an attribute node from a namednodemap.  Remove the attribute node from the document
    object.  Since NamedNodeMaps are live it should also automatically get removed from
    the node map.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-D58B193
    */
    specify('namednodemapremovenameditemns08', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      assert.equal(element.removeAttributeNS("http://www.nist.gov","domestic"), undefined, "should be undefined");

      {
        success = false;
        try {
          attribute = attributes.removeNamedItemNS("http://www.nist.gov","domestic");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 8);
        }
        assert.ok(success, 'throw_NOT_FOUND_ERR');
      }
    });
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
    specify('namednodemapremovenameditemns09', () => {
      var success;
      var attributes;
      var newAttributes;
      var element;
      var attribute;
      var elementList;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(1);
      attributes = element.attributes;

      attribute = attributes.removeNamedItemNS("http://www.nist.gov","domestic");
      newAttributes = element.attributes;

      attribute = newAttributes.getNamedItemNS("http://www.nist.gov","domestic");
      assert.equal(attribute, null, 'attribute should not be null');
    });
  });

  describe('namednodemapsetnameditemns', () => {
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
    specify('namednodemapsetnameditemns01', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var newAttribute;
      var newAttr1;
      var elementList;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagNameNS("http://www.nist.gov","address");
      element = elementList.item(0);
      attributes = element.attributes;

      newAttr1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","streets");
      newAttribute = element.setAttributeNodeNS(newAttr1);
      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L1","streets");
      attrName = attribute.name;

      assert.equal(attrName, "streets", "namednodemapsetnameditemns01");
    });
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
    specify('namednodemapsetnameditemns02', () => {
      var success;
      var attributes;
      var element;
      var attribute;
      var attribute1;
      var newNode;
      var attrName;


      var doc = require('./core/files/staffNS.xml').staffNS();
      element = doc.createElementNS("http://www.w3.org/DOM/Test","root");
      attribute1 = doc.createAttributeNS("http://www.w3.org/DOM/L1","L1:att");
      attributes = element.attributes;

      newNode = attributes.setNamedItemNS(attribute1);
      attribute = attributes.getNamedItemNS("http://www.w3.org/DOM/L1","att");
      attrName = attribute.name;

      assert.equal(attrName, "L1:att", "namednodemapsetnameditemns02");
    });
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
    specify('namednodemapsetnameditemns06', () => {
      var success;
      var attributes;
      var elementList;
      var element;
      var attr;
      var newNode;


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'namednodemapsetnameditemns06');
      }
    });
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
    specify('namednodemapsetnameditemns07', () => {
      var success;
      var attributes;
      var elementList;
      var element;
      var attr;
      var newNode;


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'namednodemapsetnameditemns07');
      }
    });
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
    specify('namednodemapsetnameditemns08', () => {
      var success;
      var attributes;
      var elementList;
      var element;
      var attr;
      var newNode;


      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'namednodemapsetnameditemns08');
      }
    });
  });

  describe('namespaceURI', () => {
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
    specify('namespaceURI01', () => {
      var success;
      var elementList;
      var testAddr;
      var addrAttr;
      var attrNamespaceURI;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      addrAttr = testAddr.getAttributeNodeNS("http://www.nist.gov","district");
      attrNamespaceURI = addrAttr.namespaceURI;

      assert.equal(attrNamespaceURI, "http://www.nist.gov", "namespaceURI");
    });
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
    specify('namespaceURI02', () => {
      var success;
      var elementList;
      var testAddr;
      var addrAttr;
      var attrNamespaceURI;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should be null');
      addrAttr = testAddr.getAttributeNodeNS("http://www.nist.gov","domestic");
      attrNamespaceURI = addrAttr.namespaceURI;

      assert.equal(attrNamespaceURI, "http://www.nist.gov", "namespaceURI");
    });
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
    specify('namespaceURI03', () => {
      var success;
      var elementList;
      var testEmployee;
      var employeeNamespace;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(0);
      assert.notEqual(testEmployee, null, 'testEmployee should be null');
      employeeNamespace = testEmployee.namespaceURI;

      assert.equal(employeeNamespace, "http://www.nist.gov", "namespaceURI");
    });
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
    specify('namespaceURI04', () => {
      var success;
      var elementList;
      var testEmployee;
      var employeeNamespace;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(1);
      employeeNamespace = testEmployee.namespaceURI;

      assert.equal(employeeNamespace, null, 'employeeNamespace should not be null');
    });
  });

  describe('nodegetlocalname', () => {
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
    specify('nodegetlocalname03', () => {
      var success;
      var element;
      var qelement;
      var attr;
      var qattr;
      var localElemName;
      var localQElemName;
      var localAttrName;
      var localQAttrName;


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS("http://www.w3.org/DOM/Test/elem","elem");
      qelement = doc.createElementNS("http://www.w3.org/DOM/Test/elem","qual:qelem");
      attr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","attr");
      qattr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","qual:qattr");
      localElemName = element.localName;

      localQElemName = qelement.localName;

      localAttrName = attr.localName;

      localQAttrName = qattr.localName;

      assert.equal(localElemName, "elem", "nodegetlocalname03_localElemName");
      assert.equal(localQElemName, "qelem", "nodegetlocalname03_localQElemName");
      assert.equal(localAttrName, "attr", "nodegetlocalname03_localAttrName");
      assert.equal(localQAttrName, "qattr", "nodegetlocalname03_localQAttrName");
    });
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
    specify('nodegetnamespaceuri03', () => {
      var success;
      var element;
      var elementNS;
      var attr;
      var attrNS;
      var elemNSURI;
      var elemNSURINull;
      var attrNSURI;
      var attrNSURINull;
      var nullNS = null;



      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS(nullNS,"elem");
      elementNS = doc.createElementNS("http://www.w3.org/DOM/Test/elem","qual:qelem");
      attr = doc.createAttributeNS(nullNS,"attr");
      attrNS = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","qual:qattr");
      elemNSURI = elementNS.namespaceURI;

      elemNSURINull = element.namespaceURI;

      attrNSURI = attrNS.namespaceURI;

      attrNSURINull = attr.namespaceURI;

      assert.equal(elemNSURI, "http://www.w3.org/DOM/Test/elem", "nodegetnamespaceuri03_elemNSURI");
      assert.equal(elemNSURINull, null, 'elemNSURINull should not be null');
      assert.equal(attrNSURI, "http://www.w3.org/DOM/Test/attr", "nodegetnamespaceuri03_attrNSURI");
      assert.equal(attrNSURINull, null, 'attrNSURINull should not be null');
    });
    /**
     *
     The method getOwnerDocument returns the Document object associated with this node

    Create a new DocumentType node.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#node-ownerDoc
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=259
    */
    specify('nodegetownerdocument01', () => {
      var success;
      var ownerDoc;
      var domImpl;
      var docType;
      var nullID = null;



      var doc = require('../level1/core/files/staff.xml').staff();
      domImpl = doc.implementation;
      docType = domImpl.createDocumentType("mydoc",nullID,nullID);
      ownerDoc = docType.ownerDocument;

      assert.equal(ownerDoc, doc, 'ownerDoc should not be null');
    });
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
    specify('nodegetownerdocument02', () => {
      var success;
      var newDoc;
      var newElem;
      var ownerDocDoc;
      var ownerDocElem;
      var domImpl;
      var docType;
      var nullNS = null;



      var doc = require('../level1/core/files/staff.xml').staff();
      domImpl = doc.implementation;
      docType = domImpl.createDocumentType("mydoc",nullNS,nullNS);
      newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","mydoc",docType);
      ownerDocDoc = newDoc.ownerDocument;

      assert.equal(ownerDocDoc, null, 'ownerDocDoc should not be null');
      newElem = newDoc.createElementNS("http://www.w3.org/DOM/Test","myelem");
      ownerDocElem = newElem.ownerDocument;

      assert.notEqual(ownerDocElem, null, 'ownerDocElem should be null');
    });
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
    specify('nodegetprefix03', () => {
      var success;
      var element;
      var qelement;
      var attr;
      var qattr;
      var elemNoPrefix;
      var elemPrefix;
      var attrNoPrefix;
      var attrPrefix;


      var doc = require('../level1/core/files/staff.xml').staff();
      element = doc.createElementNS("http://www.w3.org/DOM/Test/elem","elem");
      qelement = doc.createElementNS("http://www.w3.org/DOM/Test/elem","qual:qelem");
      attr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","attr");
      qattr = doc.createAttributeNS("http://www.w3.org/DOM/Test/attr","qual:qattr");
      elemNoPrefix = element.prefix;

      elemPrefix = qelement.prefix;

      attrNoPrefix = attr.prefix;

      attrPrefix = qattr.prefix;

      assert.equal(elemNoPrefix, null, 'elemNoPrefix should not be null');
      assert.equal(elemPrefix, "qual", "nodegetprefix03_2");
      assert.equal(attrNoPrefix, null, 'attrNoPrefix should not be null');
      assert.equal(attrPrefix, "qual", "nodegetprefix03_4");
    });
  });

  describe('nodehasattributes', () => {
    /**
     *
     The method hasAttributes returns whether this node (if it is an element) has any attributes.

    Retreive an element node without attributes.  Verify if hasAttributes returns false.
    Retreive another element node with attributes.  Verify if hasAttributes returns true.

    * @author IBM
    * @author Neil Delima
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-NodeHasAttrs
    */
    specify('nodehasattributes01', () => {
      var success;
      var element;
      var elementList;
      var hasAttributes;


      var doc = require('../level1/core/files/staff.xml').staff();
      elementList = doc.getElementsByTagName("employee");
      element = elementList.item(0);
      hasAttributes = element.hasAttributes();
      assert.equal(hasAttributes, false, 'hasAttributes should be *false*');
      elementList = doc.getElementsByTagName("address");
      element = elementList.item(0);
      hasAttributes = element.hasAttributes();
      assert.ok(hasAttributes, 'nodehasattributes01_2');
    });
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
    specify('nodehasattributes04', () => {
      var success;
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


      var doc = require('./core/files/staffNS.xml').staffNS();
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
      assert.ok(hasAttributes, 'nodehasattributes04');
    });
  });

  describe('nodenormalize', () => {
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
    specify('normalize01', () => {
      var success;
      var root;
      var elementList;
      var firstChild;
      var textList;
      var textNode;
      var data;


      var doc = require('../level1/core/files/staff.xml').staff();
      root = doc.documentElement;

      root.normalize();
      elementList = root.getElementsByTagName("name");
      firstChild = elementList.item(2);
      textList = firstChild.childNodes;

      textNode = textList.item(0);
      data = textNode.data;

      assert.equal(data, "Roger\n Jones", "data");
    });
  });

  describe('ownerDocument', () => {
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
    specify('ownerDocument01', () => {
      var success;
      var ownerDocument;


      var doc = require('../level1/core/files/staff.xml').staff();
      ownerDocument = doc.ownerDocument;

      assert.equal(ownerDocument, null, 'ownerDocument should not be null');
    });
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
    specify('ownerElement01', () => {
      var success;
      var addressList;
      var testNode;
      var attributes;
      var domesticAttr;
      var elementNode;
      var name;


      var doc = require('../level1/core/files/staff.xml').staff();
      addressList = doc.getElementsByTagName("address");
      testNode = addressList.item(0);
      attributes = testNode.attributes;

      domesticAttr = attributes.getNamedItem("domestic");
      elementNode = domesticAttr.ownerElement;

      name = elementNode.nodeName;

      assert.equal(name, "address", "throw_Equals");
    });
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
    specify('ownerElement02', () => {
      var success;
      var newAttr;
      var elementNode;


      var doc = require('../level1/core/files/staff.xml').staff();
      newAttr = doc.createAttribute("newAttribute");
      elementNode = newAttr.ownerElement;

      assert.equal(elementNode, null, 'elementNode should not be null');
    });
  });

  describe('prefix', () => {
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
    specify('prefix01', () => {
      var success;
      var createdNode;
      var prefix;


      var doc = require('./core/files/staffNS.xml').staffNS();
      createdNode = doc.createElement("test:employee");
      prefix = createdNode.prefix;

      assert.equal(prefix, null, 'prefix should not be null');
    });
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
    specify('prefix02', () => {
      var success;
      var elementList;
      var testEmployee;
      var textNode;
      var prefix;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:employeeId");
      testEmployee = elementList.item(0);
      assert.notEqual(testEmployee, null, 'testEmployee should be null');
      textNode = testEmployee.firstChild;

      prefix = textNode.prefix;

      assert.equal(prefix, null, 'prefix should not be null');
    });
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
    specify('prefix03', () => {
      var success;
      var elementList;
      var testEmployee;
      var prefix;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:employee");
      testEmployee = elementList.item(0);
      assert.notEqual(testEmployee, null, 'testEmployee should be null');
      prefix = testEmployee.prefix;

      assert.equal(prefix, "emp", "prefix");
    });
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
    specify('prefix04', () => {
      var success;
      var elementList;
      var testEmployee;
      var prefix;


      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("employee");
      testEmployee = elementList.item(0);
      prefix = testEmployee.prefix;

      assert.equal(prefix, null, 'prefix should not be null');
    });
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
    specify('publicId01', () => {
      var success;
      var docType;
      var publicId;


      var doc = require('./core/files/staffNS.xml').staffNS();
      docType = doc.doctype;

      publicId = docType.publicId;

      assert.equal(publicId, "STAFF", "throw_Equals");
    });
  });

  describe('remove attribute or namedItem NS', () => {
    /**
     *
     (This test is not from the w3.org test suite but specific to jsdom.)

    The "removeAttributeNS(namespaceURI,localName)" does not raise
    NOT_FOUND_ERR if the attribute is not present.

    Remove the attribute "{http://nonexistent}local" from emp:address
    node by invoking the "removeAttributeNS(namespaceURI,localName)" method.

    * @author Louis-Dominique Dubeau
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElRemAtNS
    * @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-19
    * @see http://dom.spec.whatwg.org/#dom-element-removeattributens
    */
    specify('removeAttributeNS03', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var elementList = doc.getElementsByTagName("emp:address");
      var testAddr = elementList.item(0);
      assert.equal(testAddr.removeAttributeNS("http://nonexistent","nonexistent"), undefined, "should be undefined");
    });
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
    specify('removeNamedItemNS01', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var testAddress = doc.getElementsByTagName("address").item(1);
      var attributes = testAddress.attributes;
      var removedNode = attributes.removeNamedItemNS("http://www.usa.com","domestic");
      assert.notEqual(removedNode, null, 'removedNode should not be null');
      var newAttr = attributes.getNamedItem("dmstc:domestic");
      assert.equal(newAttr, null, 'newAttr should be null');
    });
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
    specify('removeNamedItemNS02', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var success;
      var namespaceURI = "http://www.usa.com";
      var localName = "domest";
      var elementList;
      var testAddress;
      var attributes;
      var removedNode;
      elementList = doc.getElementsByTagName("address");
      testAddress = elementList.item(1);
      attributes = testAddress.attributes;
      success = false;
      try {
        removedNode = attributes.removeNamedItemNS(namespaceURI,localName);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 8);
      }
      assert.ok(success, 'throw_NOT_FOUND_ERR')
    });
  });

  describe('setAttributeNS', () => {
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
    specify('setAttributeNS01', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var success;
      var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "emp:qual?name";
      var elementList;
      var testAddr;
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
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
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
    specify('setAttributeNS02', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var success;
      var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "emp:";
      var elementList;
      var testAddr;
      elementList = doc.getElementsByTagName("emp:employee");
      testAddr = elementList.item(0);
      {
        success = false;
        try {
          testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 5);
        }
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
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

    THE ABOVE IS INVALID. THE DOM STANDARD OVERRIDES THIS BEHAVIOR:
    now, the value is overridden, but the prefix is left alone.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#
    */
    specify('setAttributeNS04_modified', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var resultNamespaceURI;
      var resultLocalName;
      var resultPrefix;
      var testAddr = doc.getElementsByTagName("emp:address").item(0);
      assert.notEqual(testAddr, null, 'testAddr should not be null');
      testAddr.setAttributeNS("http://www.nist.gov","newprefix:zone","newValue");
      var addrAttr = testAddr.getAttributeNodeNS("http://www.nist.gov","zone");
      var resultAttr = testAddr.getAttributeNS("http://www.nist.gov","zone");
      assert.equal(resultAttr, 'newValue');
      assert.equal(addrAttr.namespaceURI, 'http://www.nist.gov')
      assert.equal(addrAttr.localName, 'zone');
      assert.equal(addrAttr.prefix, 'emp')
    });
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
    specify('setAttributeNS05', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var localName = "newAttr";
      var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var testAddr = doc.getElementsByTagName("emp:address").item(0);
      assert.notEqual(testAddr, null, 'testAddr should not be null');
      testAddr.setAttributeNS(namespaceURI, qualifiedName, "<newValue>");
      var resultAttr = testAddr.getAttributeNS(namespaceURI, localName);
      assert.equal(resultAttr, '<newValue>');
    });
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
    specify('setAttributeNS06', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var success;
      var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "xml:qualifiedName";
      var elementList;
      var testAddr;
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
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('setAttributeNS07', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var success;
      var namespaceURI = "http://www.nist.gov";
      var qualifiedName = "xmlns";
      var elementList;
      var testAddr;
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
        assert.ok(success, 'throw_NAMESPACE_ERR');
      }
    });
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
    specify('setAttributeNS09', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var localName = "newAttr";
      var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var elementList;
      var testAddr;
      var addrAttr;
      var resultAttr;
      var resultNamespaceURI;
      var resultLocalName;
      var resultPrefix;
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'testAddr should not be null');
      testAddr.setAttributeNS(namespaceURI,qualifiedName,"newValue");
      addrAttr = testAddr.getAttributeNodeNS(namespaceURI,localName);
      resultAttr = testAddr.getAttributeNS(namespaceURI,localName);
      assert.equal(resultAttr, 'newValue');
      assert.equal(addrAttr.namespaceURI, 'http://www.newattr.com');
      assert.equal(addrAttr.localName, 'newAttr');
      assert.equal(addrAttr.prefix, 'emp');
    });
    /**
     *
     Element.setAttributeNS with an empty qualified name should cause an INVALID_CHARACTER_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-ElSetAttrNS
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-ElSetAttrNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
    */
    specify('setAttributeNS10', () => {
      var doc = require('../level1/core/files/hc_staff.xml').hc_staff();
      var success;
      var namespaceURI = "http://www.example.gov";
      var elementList;
      var testAddr;
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
        assert.ok(success, 'throw_INVALID_CHARACTER_ERR');
      }
    });
  });

  describe('setAttributeNodeNS', () => {
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
    specify('setAttributeNodeNS01', () => {
      var success;
      var namespaceURI = "http://www.newattr.com";
      var qualifiedName = "emp:newAttr";
      var newElement;
      var newAttr;
      var elementList;
      var testAddr;
      var appendedChild;
      var setAttr1;
      var setAttr2;
      var doc = require('./core/files/staffNS.xml').staffNS();
      elementList = doc.getElementsByTagName("emp:address");
      testAddr = elementList.item(0);
      assert.notEqual(testAddr, null, 'empAddrNotNull');
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
        assert.ok(success, 'throw_INUSE_ATTRIBUTE_ERR');
      }
    });
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
    specify('setAttributeNodeNS03', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var testAddr = doc.getElementsByTagName("emp:address").item(0);
      assert.notEqual(testAddr, null, 'testAddr should not be null');
      var newAttr = doc.createAttributeNS('http://www.newattr.com', 'emp:newAttr');
      var newAddrAttr = testAddr.setAttributeNodeNS(newAttr);
      assert.equal(newAddrAttr, null, 'newAddrAttr should be null');
    });
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
    specify('setAttributeNodeNS04', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var testAddr = doc.getElementsByTagName("emp:address").item(0);
      assert.notEqual(testAddr, null, 'testAddr should not be null');
      var newAttr = doc.createAttributeNS("http://www.nist.gov","xxx:domestic");
      var newAddrAttr = testAddr.setAttributeNodeNS(newAttr);
      assert.equal(newAddrAttr.name, 'emp:domestic')
    });
  });

  describe('setNamedItemNS', () => {
    /**
     *
     The "setNamedItemNS(arg)" method for a NamedNodeMap should raise INUSE_ATTRIBUTE_ERR DOMException if arg is an Attr that is already an attribute of another Element object.

    Retrieve an attr node from the third "address" element whose local name is "domestic" and namespaceURI is "http://www.netzero.com".
    Invoke method setNamedItemNS(arg) on the map of the first "address" element with arg being the attr node from above.
    Method should raise INUSE_ATTRIBUTE_ERR DOMException.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-setNamedItemNS
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#xpointer(id('ID-setNamedItemNS')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
    */
    specify('setNamedItemNS01', () => {
      var success;
      var elementList;
      var anotherElement;
      var anotherMap;
      var arg;
      var testAddress;
      var map;
      var setNode;
      var doc = require('./core/files/staffNS.xml').staffNS();
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
        assert.ok(success, 'throw_INUSE_ATTRIBUTE_ERR');
        }
    });

    /**
     *
     The "setNamedItemNS(arg)" method for a NamedNodeMap should add a node using its namespaceURI and localName given that there is no existing node with the same namespaceURI and localName in the map.

    Create an attr node with namespaceURI "http://www.nist.gov",qualifiedName "prefix:newAttr" and value "newValue".
    Invoke method setNamedItemNS(arg) on the map of the first "address" element where arg is identified by the namespaceURI and qualifiedName from above.
    Method should return the newly added attr node.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-F68D080
    */
    specify('setNamedItemNS03', () => {
      var namespaceURI = "http://www.nist.gov";
      var doc = require('./core/files/staffNS.xml').staffNS();
      var arg = doc.createAttributeNS(namespaceURI, "prefix:newAttr");
      arg.nodeValue = "newValue";
      var attributes = doc.getElementsByTagName("address").item(0).attributes;
      attributes.setNamedItemNS(arg);
      var retnode = attributes.getNamedItemNS(namespaceURI,"newAttr");
      assert.equal(retnode.nodeValue, 'newValue');
    });


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
    specify('setNamedItemNS05', () => {
      var doc = require('./core/files/staffNS.xml').staffNS();
      var arg = doc.createAttributeNS("http://www.usa.com", "dmstc:domestic");
      arg.nodeValue = "newValue";
      var attributes = doc.getElementsByTagName("address").item(0).attributes;
      var retnode = attributes.setNamedItemNS(arg);
      assert.equal(retnode.nodeValue, 'Yes');
    });
  });

  // The "getSystemId()" method of a documenttype node contains the system identifier associated with the external subset.
  // Retrieve the documenttype.
  // Apply the "getSystemId()" method.  The string "staffNS.dtd" should be returned.
  // @author NIST
  // @author Mary Brady
  // @see http://www.w3.org/TR/DOM-Level-2-Core/core#ID-Core-DocType-systemId
  specify('systemId01', () => {
    var doc = require('./core/files/staffNS.xml').staffNS();
    assert.equal(doc.doctype.systemId, 'staffNS.dtd');
  });

  /**
   * Verify that `getElementsByTagNameNS` memoization is cleared
   * when the document is modified.
   *
   * @author Chris Carpita
   */
  specify('memoizationQueriesCleared', () => {
    var doc = require('./core/files/staffNS.xml').staffNS();
    var oldCount = doc.getElementsByTagNameNS("http://www.nist.gov", "address").length;
    var address = doc.createElementNS("http://www.nist.gov", "address");
    doc.getElementsByTagName('employee')[0].appendChild(address);
    var newCount = doc.getElementsByTagNameNS("http://www.nist.gov", "address").length;
    assert.equal(newCount, oldCount + 1, "address count should be incremented after adding element w/ matching NS");
  });
});
