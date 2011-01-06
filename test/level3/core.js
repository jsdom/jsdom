exports.tests = {
/**
* 
Call getSchemaTypeInfo on title attribute for the first acronym element.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
attrgetschematypeinfo01 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo01") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var typeNS;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsCDATA","CDATA",typeName);
       typeNS = typeInfo.typeNamespace;

      assertEquals("nsIsXML","http://www.w3.org/TR/REC-xml",typeNS);
       
},
/**
* 
Call getSchemaTypeInfo on id attribute for the third acronym element.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
attrgetschematypeinfo02 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo02") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var typeNS;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("id");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsID","ID",typeName);
       typeNS = typeInfo.typeNamespace;

      assertEquals("nsIsXML","http://www.w3.org/TR/REC-xml",typeNS);
       
},
/**
* 
Call getSchemaTypeInfo on title attribute for the first acronym element.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
attrgetschematypeinfo03 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo03") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var typeNS;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","string",typeName);
       typeNS = typeInfo.typeNamespace;

      assertEquals("nsIsXML","http://www.w3.org/2001/XMLSchema",typeNS);
       
},
/**
* 
Call getSchemaTypeInfo on id attribute for the third acronym element.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
attrgetschematypeinfo04 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo04") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var typeNS;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("id");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsID","ID",typeName);
       typeNS = typeInfo.typeNamespace;

      assertEquals("nsIsXmlSchema","http://www.w3.org/2001/XMLSchema",typeNS);
       
},
/**
* 
Call getSchemaTypeInfo on class attribute for the third acronym element.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
attrgetschematypeinfo05 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo05") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var typeNS;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsClassType","classType",typeName);
       typeNS = typeInfo.typeNamespace;

      assertEquals("nsIsXHTML","http://www.w3.org/1999/xhtml",typeNS);
       
},
/**
* 
Attr.schemaTypeInfo should return null if not validating or schema validating.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
attrgetschematypeinfo06 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo06") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var elem;
      var attr;
      var typeInfo;
      var typeName;
      var typeNS;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_nodtdstaff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertNull("typeName",typeName);
    typeNS = typeInfo.typeNamespace;

      assertNull("typeNS",typeNS);
    
},
/**
* 
	The getSchemaTypeInfo method retrieves the type information associated with this attribute. 
     
	Load a valid document with an XML Schema.
        
	Invoke getSchemaTypeInfo method on an attribute having [type definition] property.  Expose {name} and {target namespace}
	properties of the [type definition] property.  Verity that the typeName and typeNamespace of the title attribute's
	schemaTypeInfo are correct. getSchemaTypeInfo on the 'id' attribute of the fourth 'acronym' element

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
*/
attrgetschematypeinfo07 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo07") != null) return;
    var doc;
      var elemList;
      var acElem;
      var attr;
      var attrTypeInfo;
      var typeName;
      var typeNamespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acElem = elemList.item(3);
      attr = acElem.getAttributeNode("id");
      attrTypeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",attrTypeInfo);
typeName = attrTypeInfo.typeName;

      typeNamespace = attrTypeInfo.typeNamespace;

      assertEquals("attrgetschematypeinfo07_typeName","ID",typeName);
       assertEquals("attrgetschematypeinfo07_typeNamespace","http://www.w3.org/2001/XMLSchema",typeNamespace);
       
},
/**
* 
	The getSchemaTypeInfo method retrieves the type information associated with this attribute. 

	Load a valid document with an XML Schema. 
	Invoke getSchemaTypeInfo method on an attribute having [type definition] property.  Expose {name} and {target namespace}
	properties of the [type definition] property.  Verity that the typeName and typeNamespace of the 'title' attribute's (of first 'acronym' element)
	schemaTypeInfo are correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-schemaTypeInfo
*/
attrgetschematypeinfo08 : function () {
   var success;
    if(checkInitialization(builder, "attrgetschematypeinfo08") != null) return;
    var doc;
      var elemList;
      var acElem;
      var attr;
      var attrTypeInfo;
      var typeName;
      var typeNamespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acElem = elemList.item(0);
      attr = acElem.getAttributeNode("title");
      attrTypeInfo = attr.schemaTypeInfo;

      typeName = attrTypeInfo.typeName;

      typeNamespace = attrTypeInfo.typeNamespace;

      assertEquals("attrgetschematypeinfo08_typeName","string",typeName);
       assertEquals("attrgetschematypeinfo08_typeNamespace","http://www.w3.org/2001/XMLSchema",typeNamespace);
       
},
/**
* 
	Retrieve the third acronyms element's class attribute, whose type is not ID.  
	Invoke isID on the class attribute, this should return false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-isId
*/
attrisid01 : function () {
   var success;
    if(checkInitialization(builder, "attrisid01") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      id = attr.isId;

      assertFalse("AttrIsIDFalse01",id);

},
/**
* 
	Invoke setIdAttribute on the third acronym element's new attribute and set 
	isID=true.  Verify by calling isID on the new attribute and check if the 
	value returned is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-isId
*/
attrisid02 : function () {
   var success;
    if(checkInitialization(builder, "attrisid02") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      var xmlNS = "http://www.w3.org/XML/1998/namespace";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      acronymElem.setAttributeNS(xmlNS,"xml:lang","FR-fr");
      acronymElem.setIdAttributeNS(xmlNS,"lang",true);
      attr = acronymElem.getAttributeNodeNS(xmlNS,"lang");
      id = attr.isId;

      assertTrue("AttrIsIDTrue02",id);

},
/**
* 
	Invoke setIdAttribute(false) on a newly created attribute and then check Attr.isID.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-isId
*/
attrisid03 : function () {
   var success;
    if(checkInitialization(builder, "attrisid03") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      var xmlNS = "http://www.w3.org/XML/1998/namespace";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      acronymElem.setAttributeNS(xmlNS,"xml:lang","FR-fr");
      acronymElem.setIdAttributeNS(xmlNS,"lang",false);
      attr = acronymElem.getAttributeNodeNS(xmlNS,"lang");
      id = attr.isId;

      assertFalse("AttrIsIDFalse03",id);

},
/**
* 
Attr.isID should return true for the id attribute on the fourth acronym node
since its type is ID.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-isId
*/
attrisid04 : function () {
   var success;
    if(checkInitialization(builder, "attrisid04") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var clonedacronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(3);
      attr = acronymElem.getAttributeNode("id");
      id = attr.isId;

      assertTrue("AttrIsIDTrue04",id);

},
/**
* 
	Retrieve the fourth acronym element's id attribute, whose type is ID.  
	Deep clone the element node and append it as a sibling of the acronym node.
	We now have two id attributes of type ID with identical values.   
	Invoke isID on the class attribute, should this return true???

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-isId
*/
attrisid05 : function () {
   var success;
    if(checkInitialization(builder, "attrisid05") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var clonedacronymElem;
      var acronymParentElem;
      var appendedNode;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(3);
      acronymParentElem = acronymElem.parentNode;

      clonedacronymElem = acronymElem.cloneNode(true);
      appendedNode = acronymParentElem.appendChild(clonedacronymElem);
      attr = acronymElem.getAttributeNode("id");
      id = attr.isId;

      assertTrue("AttrIsIDTrue05",id);

},
/**
* 
	Invoke isId on a new Attr node.  Check if the value returned is false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-isId
*/
attrisid06 : function () {
   var success;
    if(checkInitialization(builder, "attrisid06") != null) return;
    var doc;
      var attr;
      var id = false;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      id = attr.isId;

      assertFalse("AttrIsIDFalse06",id);

},
/**
* 
	The method isId returns whether this attribute is known to be of type ID or not.
	
	Add a new attribute of type ID to the third acronym element node of this document. Verify that the method
        isId returns true. The use of Element.setIdAttributeNS() makes 'isId' a user-determined ID attribute.
	Import the newly created attribute node into this document.  
        Since user data assocated to the imported node is not carried over, verify that the method isId
        returns false on the imported attribute node.        


* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Attr-isId
*/
attrisid07 : function () {
   var success;
    if(checkInitialization(builder, "attrisid07") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var attrImported;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","acronym");
      acronymElem = elemList.item(2);
      acronymElem.setAttributeNS("http://www.w3.org/DOM","dom3:newAttr","null");
      acronymElem.setIdAttributeNS("http://www.w3.org/DOM","newAttr",true);
      attr = acronymElem.getAttributeNodeNS("http://www.w3.org/DOM","newAttr");
      id = attr.isId;

      assertTrue("AttrIsIDTrue07_1",id);
attrImported = doc.importNode(attr,false);
      id = attrImported.isId;

      assertFalse("AttrIsID07_isFalseforImportedNode",id);

},
/**
* 
Normalize document with 'canonical-form' set to true, check that
entity references are expanded and unused entity declaration are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform01 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform01") != null) return;
    var doc;
      var pList;
      var pElem;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var entRef;
      var childValue;
      var entities;
      var ent2;
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = doc.createEntityReference("ent1");
      child = pElem.appendChild(entRef);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      child = pElem.lastChild;

      assertNotNull("lastChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChildName","#text",childName);
       childValue = child.nodeValue;

      assertEquals("firstChildValue","barfoo",childValue);
       
	}
	
},
/**
* 
Normalize document with normalize-characters set to false, check that
characters are not normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
canonicalform02 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform02") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
	}
	
},
/**
* 
Normalize a document with the 'canonical-form' parameter set to true and
check that a CDATASection has been eliminated.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform03 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform03") != null) return;
    var doc;
      var elemList;
      var elemName;
      var cdata;
      var text;
      var nodeName;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elemName = elemList.item(1);
      cdata = elemName.lastChild;

      nodeName = cdata.nodeName;

      assertEquals("documentnormalizedocument02","#cdata-section",nodeName);
       domConfig = doc.domConfig;

      domConfig.setParameter("error-handler", errorMonitor.handleError);
	 canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalization2Error", 2);
     elemList = doc.getElementsByTagName("strong");
      elemName = elemList.item(1);
      text = elemName.lastChild;

      nodeName = text.nodeName;

      assertEquals("documentnormalizedocument02_false","#text",nodeName);
       
	}
	
},
/**
* 
Normalize document with canonical-form set to true, check that
namespace declaration attributes are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform04 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform04") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var xmlnsAttr;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("error-handler", errorMonitor.handleError);
	 domConfig.setParameter("canonical-form", true);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     docElem = doc.documentElement;

      xmlnsAttr = docElem.getAttributeNode("xmlns");
      assertNotNull("xmlnsAttrNotNull",xmlnsAttr);

	}
	
},
/**
* 
Add a L1 element to a L2 namespace aware document and perform namespace normalization.  Should result
in an error.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/namespaces-algorithms#normalizeDocumentAlgo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform05 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform05") != null) return;
    var doc;
      var elem;
      var domConfig;
      var pList;
      var newChild;
      var retval;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      var problemNode;
      var location;
      var lineNumber;
      var columnNumber;
      var byteOffset;
      var utf16Offset;
      var uri;
      var type;
      var message;
      var relatedException;
      var relatedData;
      var length;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newChild = doc.createElement("br");
      retval = elem.appendChild(newChild);
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100C4 = 0;indexN100C4 < errors.length; indexN100C4++) {
      error = errors[indexN100C4];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	location = error.location;

      problemNode = location.relatedNode;

      assertSame("relatedNodeIsL1Node",newChild,problemNode);
lineNumber = location.lineNumber;

      assertEquals("lineNumber",-1,lineNumber);
       columnNumber = location.columnNumber;

      assertEquals("columnNumber",-1,columnNumber);
       byteOffset = location.byteOffset;

      assertEquals("byteOffset",-1,byteOffset);
       utf16Offset = location.utf16Offset;

      assertEquals("utf16Offset",-1,utf16Offset);
       uri = location.uri;

      assertNull("uri",uri);
    message = error.message;

      length = message.length;
      	assertTrue("messageNotEmpty",
      
	(length > 0)
);
type = error.type;

      relatedData = error.relatedData;

      relatedException = error.relatedException;

      errorCount += 1;

	}
	
		else {
			assertEquals("anyOthersShouldBeWarnings",1,severity);
       
		}
	
	}
   assertEquals("oneError",1,errorCount);
       
	}
	
},
/**
* 
Create a document with an XML 1.1 valid but XML 1.0 invalid element and
normalize document with canonical-form set to true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform06 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform06") != null) return;
    var domImpl;
      var nullString = null;

      var nullDoctype = null;

      var doc;
      var elem;
      var retval;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var locator;
      var relatedNode;
      var canSet;
      domImpl = getImplementation();
doc = domImpl.createDocument(nullString,nullString,nullDoctype);
      
	{
		success = false;
		try {
            elem = doc.createElementNS("http://www.example.org/domts/wellformed01","LegalNameࢎ");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("xml10InvalidName",success);
	}

      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        elem = doc.createElementNS("http://www.example.org/domts/wellformed01","LegalNameࢎ");
      retval = doc.appendChild(elem);
      doc.xmlVersion = "1.0";

      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100B7 = 0;indexN100B7 < errors.length; indexN100B7++) {
      error = errors[indexN100B7];
      severity = error.severity;

      assertEquals("severity",2,severity);
       type = error.type;

      assertEquals("type","wf-invalid-character-in-node-name",type);
       locator = error.location;

      relatedNode = locator.relatedNode;

      assertSame("relatedNode",elem,relatedNode);

	}
   assertSize("oneError",1,errors);

	}
	
},
/**
* 
Normalize document with canonical-form set to true and validation set to true, check that
whitespace in element content is preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform07 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform07") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var text;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 
	if(
	(getImplementationAttribute("ignoringElementContentWhitespace") == true)
	) {
	bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      text = doc.createTextNode("    ");
      child = body.insertBefore(text,child);
      
	}
	doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      assertNotNull("firstChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChild","#text",childName);
       child = child.nextSibling;

      assertNotNull("secondChildNotNull",child);
childName = child.nodeName;

      assertEquals("secondChild","p",childName);
       
	}
	
},
/**
* 
Normalize document based on section 3.1 with canonical-form set to true and check normalized document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform08 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform08") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var node;
      var nodeName;
      var nodeValue;
      var nodeType;
      var length;
      var text;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "canonicalform01");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     node = doc.firstChild;

      nodeType = node.nodeType;

      assertEquals("PIisFirstChild",7,nodeType);
       nodeValue = node.data;

      length = nodeValue.length;
      assertEquals("piDataLength",36,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisSecondChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("secondChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("ElementisThirdChild",1,nodeType);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisFourthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("fourthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("PIisFifthChild",7,nodeType);
       nodeValue = node.data;

      assertEquals("trailingPIData","",nodeValue);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisSixthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("sixthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("CommentisSeventhChild",8,nodeType);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisEighthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("eighthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("CommentisNinthChild",8,nodeType);
       node = node.nextSibling;

      assertNull("TenthIsNull",node);
    
	}
	
},
/**
* 
Normalize document based on section 3.1 with canonical-form set to true 
and comments to false and check normalized document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform09 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform09") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var node;
      var nodeName;
      var nodeValue;
      var nodeType;
      var length;
      var text;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "canonicalform01");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("error-handler", errorMonitor.handleError);
	 domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("comments", false);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     node = doc.firstChild;

      nodeType = node.nodeType;

      assertEquals("PIisFirstChild",7,nodeType);
       nodeValue = node.data;

      length = nodeValue.length;
      assertEquals("piDataLength",36,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisSecondChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("secondChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("ElementisThirdChild",1,nodeType);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisFourthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("fourthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("PIisFifthChild",7,nodeType);
       nodeValue = node.data;

      assertEquals("trailingPIData","",nodeValue);
       node = node.nextSibling;

      assertNull("SixthIsNull",node);
    
	}
	
},
/**
* 
Check elimination of unnecessary namespace prefixes when
normalized with canonical-form = true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform10 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform10") != null) return;
    var doc;
      var divList;
      var div;
      var domConfig;
      var canSet;
      errorMonitor = new DOMErrorMonitor();
      
      var node;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "canonicalform03");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("error-handler", errorMonitor.handleError);
	 domConfig.setParameter("canonical-form", true);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     divList = doc.getElementsByTagName("div");
      div = divList.item(5);
      node = div.getAttributeNode("xmlns");
      assertNotNull("xmlnsPresent",node);
node = div.getAttributeNode("xmlns:a");
      assertNull("xmlnsANotPresent",node);
    
	}
	
},
/**
* 
Check that default attributes are made explicitly specified.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform11 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform11") != null) return;
    var doc;
      var elemList;
      var elem;
      var domConfig;
      var canSet;
      errorMonitor = new DOMErrorMonitor();
      
      var attr;
      var attrValue;
      var attrSpecified;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "canonicalform03");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("error-handler", errorMonitor.handleError);
	 domConfig.setParameter("canonical-form", true);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      attr = elem.getAttributeNode("title");
      assertNotNull("titlePresent",attr);
attrSpecified = attr.specified;

      assertTrue("titleSpecified",attrSpecified);
attrValue = attr.nodeValue;

      assertEquals("titleValue","default",attrValue);
       
	}
	
},
/**
* 
Normalize document with 'canonical-form' set to true, check that
DocumentType nodes are removed.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
*/
canonicalform12 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform12") != null) return;
    var doc;
      var domConfig;
      var canSet;
      errorMonitor = new DOMErrorMonitor();
      
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     doctype = doc.doctype;

      assertNull("docTypeNull",doctype);
    
	}
	
},
/**
* 
Normalize a document using Node.normalize and check that
the value of the 'cdata-sections' parameter is ignored.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-cdata-sections
*/
cdatasections01 : function () {
   var success;
    if(checkInitialization(builder, "cdatasections01") != null) return;
    var doc;
      var elem;
      var newCdata;
      var cdata;
      var text;
      var nodeName;
      var nodeValue;
      var appendedChild;
      var domConfig;
      var pList;
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newCdata = doc.createCDATASection("CDATA");
      appendedChild = elem.appendChild(newCdata);
      domConfig = doc.domConfig;

      domConfig.setParameter("cdata-sections", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalize();
      errorMonitor.assertLowerSeverity("normalizationError", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      cdata = elem.lastChild;

      nodeName = cdata.nodeName;

      assertEquals("documentnormalizedocument03_true","#cdata-section",nodeName);
       
},
/**
* 
Normalize document with check-character-normalization set to false, check that
no errors are dispatched.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-check-character-normalization
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
checkcharacternormalization01 : function () {
   var success;
    if(checkInitialization(builder, "checkcharacternormalization01") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("error-handler", errorMonitor.handleError);
	 domConfig.setParameter("check-character-normalization", false);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
},
/**
* 
Normalize document with check-character-normalization set to true, check that
non-normalized characters are signaled.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-check-character-normalization
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
checkcharacternormalization02 : function () {
   var success;
    if(checkInitialization(builder, "checkcharacternormalization02") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var canSet;
      var errors = new Array();

      var error;
      var severity;
      var locator;
      var relatedNode;
      var errorCount = 0;
      var errorType;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("check-character-normalization",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("check-character-normalization", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100AA = 0;indexN100AA < errors.length; indexN100AA++) {
      error = errors[indexN100AA];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	errorCount += 1;
errorType = error.type;

      assertEquals("errorType","check-character-normalization-failure",errorType);
       locator = error.location;

      relatedNode = locator.relatedNode;

      assertSame("relatedNodeSame",text,relatedNode);

	}
	
	}
   assertEquals("oneError",1,errorCount);
       
	}
	
},
/**
* 
Normalize document using Node.normalize checking that "check-character-normalization"
is ignored.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-check-character-normalization
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
checkcharacternormalization03 : function () {
   var success;
    if(checkInitialization(builder, "checkcharacternormalization03") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("check-character-normalization",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("check-character-normalization", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
	}
	
},
/**
* 
Check that Node.normalize ignores the setting of configuration parameter 'comments'.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-comments
*/
comments01 : function () {
   var success;
    if(checkInitialization(builder, "comments01") != null) return;
    var doc;
      var elem;
      var newComment;
      var lastChild;
      var text;
      var nodeName;
      var appendedChild;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newComment = doc.createComment("COMMENT_NODE");
      appendedChild = elem.appendChild(newComment);
      domConfig = doc.domConfig;

      domConfig.setParameter("comments", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalize();
      errorMonitor.assertLowerSeverity("normalizationError", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      lastChild = elem.lastChild;

      nodeName = lastChild.nodeName;

      assertEquals("documentnormalizedocument04_true","#comment",nodeName);
       
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if double values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization01 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization01") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","double");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","+0003.141592600E+0000",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","+0003.141592600E+0000",str);
       str = element.textContent;

      assertEquals("firstList","-31415926.00E-7 2.718",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","NaN",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","NaN",str);
       str = element.textContent;

      assertEquals("secondList","INF -INF",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","1",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","1",str);
       str = element.textContent;

      assertEquals("thirdList","-0",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if decimal values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization02 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization02") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","decimal");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","+0003.141592600",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","+0003.141592600",str);
       str = element.textContent;

      assertEquals("firstList","+10 .1",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","01",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","01",str);
       str = element.textContent;

      assertEquals("secondList","-.001",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if boolean values were whitespace normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization03 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization03") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","boolean");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","true",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","false",str);
       str = element.textContent;

      assertEquals("firstList","false true false",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","1",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","0",str);
       str = element.textContent;

      assertEquals("secondList","0 1 0",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if float values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization04 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization04") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","float");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","+0003.141592600E+0000",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","+0003.141592600E+0000",str);
       str = element.textContent;

      assertEquals("firstList","-31415926.00E-7 2.718",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","NaN",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","NaN",str);
       str = element.textContent;

      assertEquals("secondList","INF -INF",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","1",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","1",str);
       str = element.textContent;

      assertEquals("thirdList","-0",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if dateTime values were correctly normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization05 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization05") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","dateTime");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","2004-01-21T15:30:00-05:00",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","2004-01-21T20:30:00-05:00",str);
       str = element.textContent;

      assertEquals("firstList","2004-01-21T15:30:00 2004-01-21T15:30:00Z",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","2004-01-21T15:30:00.0000-05:00",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","2004-01-21T15:30:00.0000-05:00",str);
       str = element.textContent;

      assertEquals("secondList","2004-01-21T15:30:00.0000",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","2004-01-21T15:30:00.0001-05:00",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","2004-01-21T15:30:00.0001-05:00",str);
       str = element.textContent;

      assertEquals("thirdList","2004-01-21T15:30:00.0001",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if time values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization06 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization06") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","time");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","15:30:00-05:00",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","15:30:00-05:00",str);
       str = element.textContent;

      assertEquals("firstList","15:30:00",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","15:30:00.0000-05:00",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","15:30:00.0000-05:00",str);
       str = element.textContent;

      assertEquals("secondList","15:30:00.0000",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","15:30:00.0001-05:00",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","15:30:00.0001-05:00",str);
       str = element.textContent;

      assertEquals("thirdList","15:30:00.0001",str);
       
	}
	
},
/**
* 
The default value for the double element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization07 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization07") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","double");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","3.1415926E0",str);
       
	}
	
},
/**
* 
The default value for the decimal element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization08 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization08") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","decimal");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","3.1415926",str);
       
	}
	
},
/**
* 
The default value for the boolean element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization09 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization09") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","boolean");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","true",str);
       
	}
	
},
/**
* 
The default value for the float element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization10 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization10") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","float");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","3.1415926E0",str);
       
	}
	
},
/**
* 
The default value for the dateTime element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization11 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization11") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","dateTime");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","2004-01-21T20:30:00Z",str);
       
	}
	
},
/**
* 
Default values must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization12 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization12") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","time");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","20:30:00Z",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if string values were normalized per default whitespace
facet of xsd:string.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization13 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization13") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      var childNode;
      var childValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization2");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","em");
      element = elemList.item(0);
      childNode = element.firstChild;

      assertNotNull("childNodeNotNull",childNode);
childValue = childNode.nodeValue;

      assertEquals("content","    EMP  0001   ",childValue);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if string values were normalized per explicit whitespace=preserve.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization14 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization14") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      var childNode;
      var childValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization2");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","acronym");
      element = elemList.item(0);
      childNode = element.firstChild;

      assertNotNull("childNodeNotNull",childNode);
childValue = childNode.nodeValue;

      assertEquals("content","    EMP  0001   ",childValue);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if string values were normalized per an explicit whitespace=collapse.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization15 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization15") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      var childNode;
      var childValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization2");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","code");
      element = elemList.item(0);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content1","EMP 0001",childValue);
       element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP 0001",childValue);
       element = elemList.item(2);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content3","EMP 0001",childValue);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.  
Check if string values were normalized per explicit whitespace=replace.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization16 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization16") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      var childNode;
      var childValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization2");
      domConfig = doc.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","sup");
      element = elemList.item(0);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content1","     EMP  0001 ",childValue);
       element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP  0001",childValue);
       element = elemList.item(2);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content3","EMP 0001",childValue);
       element = elemList.item(3);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content4","EMP 0001",childValue);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to false, string values
should not be normalized.  

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization17 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization17") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      var childNode;
      var childValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization2");
      domConfig = doc.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", false);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","code");
      element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP  0001",childValue);
       element = elemList.item(2);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content3","EMP 0001",childValue);
       element = elemList.item(0);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assert("content1","EMP 0001" != childValue);
      
	}
	
},
/**
* 
Normalize document using Node.normalize which is not affected by DOMConfiguration unlike 
Document.normalizeDocument.  Strings should not have been normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
*/
datatypenormalization18 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization18") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetValidate;
      var canSetXMLSchema;
      var canSetDataNorm;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      var childNode;
      var childValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization2");
      domConfig = doc.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      canSetDataNorm = domConfig.canSetParameter("datatype-normalization",true);
      
	if(
	
	(canSetValidate && canSetXMLSchema && canSetDataNorm)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","code");
      element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP  0001",childValue);
       element = elemList.item(2);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content3","EMP 0001",childValue);
       element = elemList.item(0);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assert("content1","EMP 0001" != childValue);
      
	}
	
},
/**
* 
	Adopt the class attribute node of the fourth acronym element.  Check if this attribute has been adopted successfully by verifying the
	nodeName, nodeType, nodeValue, specified and ownerElement attributes of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode01 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode01") != null) return;
    var doc;
      var attrOwnerElem;
      var element;
      var attr;
      var childList;
      var adoptedclass;
      var attrsParent;
      var nodeName;
      var nodeType;
      var nodeValue;
      var firstChild;
      var firstChildValue;
      var secondChild;
      var secondChildType;
      var secondChildName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(3);
      attr = element.getAttributeNode("class");
      adoptedclass = doc.adoptNode(attr);
      
	if(
	
	(adoptedclass != null)

	) {
	nodeName = adoptedclass.nodeName;

      nodeValue = adoptedclass.nodeValue;

      nodeType = adoptedclass.nodeType;

      attrOwnerElem = adoptedclass.ownerElement;

      assertEquals("documentadoptode01_nodeName","class",nodeName);
       assertEquals("documentadoptNode01_nodeType",2,nodeType);
       assertNull("documentadoptnode01_ownerDoc",attrOwnerElem);
    firstChild = adoptedclass.firstChild;

      assertNotNull("firstChildNotNull",firstChild);
firstChildValue = firstChild.nodeValue;

      
	if(
	("Y" == firstChildValue)
	) {
	secondChild = firstChild.nextSibling;

      assertNotNull("secondChildNotNull",secondChild);
secondChildType = secondChild.nodeType;

      assertEquals("secondChildIsEntityReference",5,secondChildType);
       secondChildName = secondChild.nodeName;

      assertEquals("secondChildIsEnt1Reference","alpha",secondChildName);
       
	}
	
		else {
			assertEquals("documentadoptnode01_nodeValue","Yα",nodeValue);
       
		}
	
	}
	
},
/**
* 
	Adopt the class attribute node of the fourth acronym element.  Check if this attribute has been adopted 
	successfully by verifying the nodeName, nodeType, ownerElement, specified attributes and child nodes 
	of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode02 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var attrOwnerElem;
      var element;
      var attr;
      var childList;
      var adoptedclass;
      var attrsParent;
      var nodeName;
      var nodeType;
      var nodeValue;
      var isSpecified;
      var nullDocType = null;

      var firstChild;
      var firstChildValue;
      var secondChild;
      var secondChildType;
      var secondChildName;
      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(3);
      attr = element.getAttributeNode("class");
      adoptedclass = newDoc.adoptNode(attr);
      
	if(
	
	(adoptedclass != null)

	) {
	nodeName = adoptedclass.nodeName;

      nodeValue = adoptedclass.nodeValue;

      nodeType = adoptedclass.nodeType;

      attrOwnerElem = adoptedclass.ownerElement;

      isSpecified = adoptedclass.specified;

      assertEquals("documentadoptnode02_nodeName","class",nodeName);
       assertEquals("documentadoptnode02_nodeType",2,nodeType);
       assertNull("documentadoptnode02_ownerDoc",attrOwnerElem);
    assertTrue("documentadoptnode02_specified",isSpecified);
firstChild = adoptedclass.firstChild;

      assertNotNull("firstChildNotNull",firstChild);
firstChildValue = firstChild.nodeValue;

      
	if(
	("Y" == firstChildValue)
	) {
	secondChild = firstChild.nextSibling;

      assertNotNull("secondChildNotNull",secondChild);
secondChildType = secondChild.nodeType;

      assertEquals("secondChildIsEntityReference",5,secondChildType);
       secondChildName = secondChild.nodeName;

      assertEquals("secondChildIsEnt1Reference","alpha",secondChildName);
       
	}
	
		else {
			assertEquals("documentadoptnode02_nodeValue","Yα",nodeValue);
       
		}
	
	}
	
},
/**
* 
	Invoke adoptNode on this document to adopt the a new namespace aware attribute node.  Check 
	if this attribute has been adopted successfully by verifying the nodeName, namespaceURI, prefix, 
	specified and ownerElement attributes of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode03 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode03") != null) return;
    var doc;
      var newAttr;
      var adoptedAttr;
      var nodeName;
      var nodeNamespaceURI;
      var nodePrefix;
      var attrOwnerElem;
      var isSpecified;
      var xmlNS = "http://www.w3.org/XML/1998/namespace";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      newAttr = doc.createAttributeNS(xmlNS,"xml:lang");
      adoptedAttr = doc.adoptNode(newAttr);
      
	if(
	
	(adoptedAttr != null)

	) {
	nodeName = adoptedAttr.nodeName;

      nodeNamespaceURI = adoptedAttr.namespaceURI;

      nodePrefix = adoptedAttr.prefix;

      attrOwnerElem = adoptedAttr.ownerElement;

      isSpecified = adoptedAttr.specified;

      assertEquals("documentadoptode03_nodeName","xml:lang",nodeName);
       assertEquals("documentadoptNode03_namespaceURI",xmlNS,nodeNamespaceURI);
       assertEquals("documentadoptnode03_prefix","xml",nodePrefix);
       assertNull("documentadoptnode03_ownerDoc",attrOwnerElem);
    assertTrue("documentadoptnode03_specified",isSpecified);

	}
	
},
/**
* 
	Invoke adoptNode on a new document to adopt a new namespace aware attribute node created by 
	this document.  Check if this attribute has been adopted successfully by verifying the nodeName, 
	namespaceURI, prefix, specified and ownerElement attributes of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode04 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode04") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var newAttr;
      var adoptedAttr;
      var nodeName;
      var nodeNamespaceURI;
      var nodePrefix;
      var attrOwnerElem;
      var isSpecified;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      var xmlNS = "http://www.w3.org/XML/1998/namespace";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newAttr = doc.createAttributeNS(xmlNS,"xml:lang");
      adoptedAttr = newDoc.adoptNode(newAttr);
      
	if(
	
	(adoptedAttr != null)

	) {
	nodeName = adoptedAttr.nodeName;

      nodeNamespaceURI = adoptedAttr.namespaceURI;

      nodePrefix = adoptedAttr.prefix;

      attrOwnerElem = adoptedAttr.ownerElement;

      isSpecified = adoptedAttr.specified;

      assertEquals("documentadoptnode04_nodeName","xml:lang",nodeName);
       assertEquals("documentadoptnode04_namespaceURI",xmlNS,nodeNamespaceURI);
       assertEquals("documentadoptnode04_prefix","xml",nodePrefix);
       assertNull("documentadoptnode04_ownerDoc",attrOwnerElem);
    assertTrue("documentadoptnode04_specified",isSpecified);

	}
	
},
/**
* 
	Invoke adoptNode on a new document to adopt the default attribute "dir".  Check if 
	this attribute has been adopted successfully by verifying the nodeName, namespaceURI, prefix, 
	specified and ownerElement attributes of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode05 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode05") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var elementEmp;
      var childList;
      var dir;
      var adoptedAttr;
      var nodeName;
      var nodeNamespaceURI;
      var nodePrefix;
      var attrOwnerElem;
      var isSpecified;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      childList = doc.getElementsByTagName("p");
      elementEmp = childList.item(3);
      dir = elementEmp.getAttributeNode("dir");
      adoptedAttr = newDoc.adoptNode(dir);
      
	if(
	
	(adoptedAttr != null)

	) {
	nodeName = adoptedAttr.nodeName;

      nodeNamespaceURI = adoptedAttr.namespaceURI;

      nodePrefix = adoptedAttr.prefix;

      attrOwnerElem = adoptedAttr.ownerElement;

      isSpecified = adoptedAttr.specified;

      assertEquals("documentadoptnode05_nodeName","dir",nodeName);
       assertNull("documentadoptnode05_namespaceURI",nodeNamespaceURI);
    assertNull("documentadoptnode05_prefix",nodePrefix);
    assertNull("documentadoptnode05_ownerDoc",attrOwnerElem);
    assertTrue("documentadoptnode05_specified",isSpecified);

	}
	
},
/**
* 
	Invoke adoptNode on a new document to adopt the a new Attribute node having a Text and an EntityReference 
	child.  Check if this attribute has been adopted successfully by verifying the nodeName, namespaceURI, prefix, 
	specified and ownerElement attributes of the adopted node.  Also verify the ownerDocument attribute
	of the adopted node and the adopted children of the attribute node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode06 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode06") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var newAttr;
      var newText;
      var newEntRef;
      var adoptedAttr;
      var adoptText;
      var adoptEntRef;
      var nodeList;
      var nodeName;
      var nodeNamespaceURI;
      var nodePrefix;
      var attrOwnerElem;
      var isSpecified;
      var adoptedTextNodeValue;
      var adoptedEntRefNodeValue;
      var nullDocType = null;

      var appendedChild;
      var docElem;
      var rootNS;
      var rootName;
      var xmlNS = "http://www.w3.org/XML/1998/namespace";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newAttr = doc.createAttributeNS(xmlNS,"xml:lang");
      newText = doc.createTextNode("Text Node");
      newEntRef = doc.createEntityReference("alpha");
      appendedChild = newAttr.appendChild(newText);
      appendedChild = newAttr.appendChild(newEntRef);
      adoptedAttr = newDoc.adoptNode(newAttr);
      
	if(
	
	(adoptedAttr != null)

	) {
	nodeName = adoptedAttr.nodeName;

      nodeNamespaceURI = adoptedAttr.namespaceURI;

      nodePrefix = adoptedAttr.prefix;

      attrOwnerElem = adoptedAttr.ownerElement;

      isSpecified = adoptedAttr.specified;

      assertEquals("documentadoptnode06_nodeName","xml:lang",nodeName);
       assertEquals("documentadoptnode06_namespaceURI",xmlNS,nodeNamespaceURI);
       assertEquals("documentadoptnode06_prefix","xml",nodePrefix);
       assertNull("documentadoptnode06_ownerDoc",attrOwnerElem);
    assertTrue("documentadoptnode06_specified",isSpecified);
nodeList = adoptedAttr.childNodes;

      adoptText = nodeList.item(0);
      adoptEntRef = nodeList.item(1);
      adoptedTextNodeValue = adoptText.nodeValue;

      adoptedEntRefNodeValue = adoptEntRef.nodeName;

      assertEquals("documentadoptnode06_TextNodeValue","Text Node",adoptedTextNodeValue);
       assertEquals("documentadoptnode06_EntRefNodeValue","alpha",adoptedEntRefNodeValue);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document with the value of the source parameter as itself.  
	Verify if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode07 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode07") != null) return;
    var doc;
      var adoptedDoc;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
	{
		success = false;
		try {
            adoptedDoc = doc.adoptNode(doc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on this document with a new document as the value of the 
	source parameter. 	Verify if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode08 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode08") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var adoptedDoc;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      
	{
		success = false;
		try {
            adoptedDoc = doc.adoptNode(newDoc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on a new document with this document as the value of the 
	source parameter. 	Verify if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode09 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode09") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var adoptedDoc;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      
	{
		success = false;
		try {
            adoptedDoc = newDoc.adoptNode(doc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on this document with the value of the source parameter as this 
	documents doctype node.  Verify if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode10 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode10") != null) return;
    var doc;
      var docType;
      var adoptedDocType;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      
	{
		success = false;
		try {
            adoptedDocType = doc.adoptNode(docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on this document with the value of the source parameter equal to a new 
	doctype node.  Verify if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode11 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode11") != null) return;
    var doc;
      var domImpl;
      var docType;
      var adoptedDocType;
      var nullPubID = null;

      var nullSysID = null;

      var docElem;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
docType = domImpl.createDocumentType(rootName,nullPubID,nullSysID);
      
	{
		success = false;
		try {
            adoptedDocType = doc.adoptNode(docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on a new document with the value of the source parameter equal to a new 
	doctype node.  Verify if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode12 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode12") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var docType;
      var adoptedDocType;
      var nullPubID = null;

      var nullSysID = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
docType = domImpl.createDocumentType(rootName,nullPubID,nullSysID);
      newDoc = domImpl.createDocument(rootNS,rootName,docType);
      
	{
		success = false;
		try {
            adoptedDocType = newDoc.adoptNode(docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Using the method adoptNode, adopt a newly created DocumentFragment node populated with
	with the first acronym element of this Document.  Since the decendants of a documentFragment
	are recursively adopted, check if the adopted node has children.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode13 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode13") != null) return;
    var doc;
      var docFragment;
      var childList;
      var success;
      var acronymNode;
      var appendedChild;
      var adoptedDocFrag;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFragment = doc.createDocumentFragment();
      childList = doc.getElementsByTagName("acronym");
      acronymNode = childList.item(0);
      appendedChild = docFragment.appendChild(acronymNode);
      adoptedDocFrag = doc.adoptNode(docFragment);
      
	if(
	
	(adoptedDocFrag != null)

	) {
	success = adoptedDocFrag.hasChildNodes();
      assertTrue("documentadoptnode13",success);

	}
	
},
/**
* 
	Using the method adoptNode in a new Document, adopt a newly created DocumentFragment node populated with
	with the first acronym element of this Document as its newChild.  Since the decendants of a documentFragment
	are recursively adopted, check if the adopted node has children.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode14 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode14") != null) return;
    var doc;
      var newDoc;
      var docElem;
      var domImpl;
      var docFragment;
      var childList;
      var success;
      var acronymNode;
      var adoptedDocFrag;
      var appendedChild;
      var nullDocType = null;

      var imported;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      docFragment = newDoc.createDocumentFragment();
      imported = newDoc.importNode(docElem,true);
      docElem = newDoc.documentElement;

      appendedChild = docElem.appendChild(imported);
      childList = newDoc.getElementsByTagName("acronym");
      acronymNode = childList.item(0);
      appendedChild = docFragment.appendChild(acronymNode);
      adoptedDocFrag = newDoc.adoptNode(docFragment);
      
	if(
	
	(adoptedDocFrag != null)

	) {
	success = adoptedDocFrag.hasChildNodes();
      assertTrue("documentadoptnode14",success);

	}
	
},
/**
* 
	Using the method adoptNode, adopt a newly created DocumentFragment node without any children.  
	Check if the adopted node has no children.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode15 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode15") != null) return;
    var doc;
      var docFragment;
      var success;
      var adoptedDocFrag;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFragment = doc.createDocumentFragment();
      adoptedDocFrag = doc.adoptNode(docFragment);
      
	if(
	
	(adoptedDocFrag != null)

	) {
	success = adoptedDocFrag.hasChildNodes();
      assertFalse("documentadoptnode15",success);

	}
	
},
/**
* 
Create a document fragment with an entity reference, adopt the node and check
that the entity reference value comes from the adopting documents DTD.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode16 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode16") != null) return;
    var doc;
      var docFragment;
      var childList;
      var parent;
      var child;
      var childsAttr;
      var entRef;
      var textNode;
      var adopted;
      var parentImp;
      var childImp;
      var attributes;
      var childAttrImp;
      var nodeValue;
      var appendedChild;
      var attrNode;
      var firstChild;
      var firstChildType;
      var firstChildName;
      var firstChildValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFragment = doc.createDocumentFragment();
      parent = doc.createElement("parent");
      child = doc.createElement("child");
      childsAttr = doc.createAttribute("state");
      entRef = doc.createEntityReference("gamma");
      textNode = doc.createTextNode("Test");
      appendedChild = childsAttr.appendChild(entRef);
      attrNode = child.setAttributeNode(childsAttr);
      appendedChild = child.appendChild(textNode);
      appendedChild = parent.appendChild(child);
      appendedChild = docFragment.appendChild(parent);
      adopted = doc.adoptNode(docFragment);
      
	if(
	
	(adopted != null)

	) {
	parentImp = adopted.firstChild;

      childImp = parentImp.firstChild;

      attributes = childImp.attributes;

      childAttrImp = attributes.getNamedItem("state");
      firstChild = childAttrImp.firstChild;

      assertNotNull("firstChildNotNull",firstChild);
firstChildName = firstChild.nodeName;

      firstChildValue = firstChild.nodeValue;

      firstChildType = firstChild.nodeType;

      
	if(
	(5 == firstChildType)
	) {
	assertEquals("firstChildEnt3Ref","gamma",firstChildName);
       
	}
	
		else {
			assertEquals("documentadoptnode16","Texas",firstChildValue);
       
		}
	
	}
	
},
/**
* 
	Invoke the adoptNode method on this document with the entity ent1 as the source.  Since this is 
	read-only verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode17 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode17") != null) return;
    var doc;
      var docType;
      var entityMap;
      var ent;
      var adoptedEnt;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entityMap = docType.entities;

      ent = entityMap.getNamedItem("alpha");
      
	{
		success = false;
		try {
            adoptedEnt = doc.adoptNode(ent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on a new document with the entity ent4 as the source.  Since this is 
	read-only verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode18 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode18") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var docType;
      var entityMap;
      var ent;
      var adoptedEnt;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      docType = doc.doctype;

      entityMap = docType.entities;

      ent = entityMap.getNamedItem("delta");
      
	{
		success = false;
		try {
            adoptedEnt = newDoc.adoptNode(ent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on this document with the notation notation1 as the source.  Since this is 
	read-only verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode19 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode19") != null) return;
    var doc;
      var docType;
      var notationMap;
      var notation;
      var adoptedNotaion;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      notationMap = docType.notations;

      notation = notationMap.getNamedItem("notation1");
      
	{
		success = false;
		try {
            adoptedNotaion = doc.adoptNode(notation);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Invoke the adoptNode method on a new document with the notation notation2 as the source.  Since this is 
	read-only verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode20 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode20") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var docType;
      var notationMap;
      var notation;
      var adoptedNotation;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      docType = doc.doctype;

      notationMap = docType.notations;

      notation = notationMap.getNamedItem("notation2");
      
	{
		success = false;
		try {
            adoptedNotation = newDoc.adoptNode(notation);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	The adoptNode method changes the ownerDocument of a node, its children, as well as the 
	attached attribute nodes if there are any. If the node has a parent it is first removed 
	from its parent child list. 
	
	Invoke the adoptNode method on this Document with the source node being an existing attribute
        that is a part of this Document.   Verify that the returned adopted node's nodeName, nodeValue
        and nodeType are as expected and that the ownerElement attribute of the returned attribute node 
        was set to null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode21 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode21") != null) return;
    var doc;
      var attrOwnerElem;
      var element;
      var attr;
      var childList;
      var adoptedTitle;
      var attrsParent;
      var nodeName;
      var nodeType;
      var nodeValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(0);
      attr = element.getAttributeNode("title");
      adoptedTitle = doc.adoptNode(attr);
      nodeName = adoptedTitle.nodeName;

      nodeValue = adoptedTitle.nodeValue;

      nodeType = adoptedTitle.nodeType;

      attrOwnerElem = adoptedTitle.ownerElement;

      assertEquals("documentadoptnode21_nodeName","title",nodeName);
       assertEquals("documentadoptnode21_nodeType",2,nodeType);
       assertEquals("documentadoptnode21_nodeValue","Yes",nodeValue);
       assertNull("documentadoptnode21_ownerDoc",attrOwnerElem);
    
},
/**
* 
	Invoke the adoptNode method on this document with the documentElement as the source.  
	Verify if the node has been adopted correctly by its nodeName.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode22 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode22") != null) return;
    var doc;
      var docElement;
      var adoptedNode;
      var success;
      var nodeNameOrig;
      var nodeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElement = doc.documentElement;

      adoptedNode = doc.adoptNode(docElement);
      
	if(
	
	(adoptedNode != null)

	) {
	success = adoptedNode.hasChildNodes();
      assertTrue("documentadoptnode22_1",success);
nodeName = adoptedNode.nodeName;

      nodeNameOrig = docElement.nodeName;

      assertEquals("documentadoptnode22_2",nodeName,nodeNameOrig);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document with the first acronym element node of this
	Document as the source.  Verify if the node has been adopted correctly by checking the 
	length of the this elements childNode list before and after.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode23 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode23") != null) return;
    var doc;
      var childList;
      var adoptedNode;
      var acronymElem;
      var acronymElemLen;
      var adoptedLen;
      var acronymElemChild;
      var adoptedNodeChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      acronymElem = childList.item(0);
      adoptedNode = doc.adoptNode(acronymElem);
      
	if(
	
	(adoptedNode != null)

	) {
	acronymElemChild = acronymElem.childNodes;

      acronymElemLen = acronymElemChild.length;

      adoptedNodeChild = adoptedNode.childNodes;

      adoptedLen = adoptedNodeChild.length;

      assertEquals("documentadoptnode23",adoptedLen,acronymElemLen);
       
	}
	
},
/**
* 
	The adoptNode method changes the ownerDocument of a node, its children, as well as the 
	attached attribute nodes if there are any. If the node has a parent it is first removed 
	from its parent child list. 
	For Element Nodes, specified attribute nodes of the source element are adopted, Default 
	attributes are discarded and descendants of the source element are recursively adopted. 

	Invoke the adoptNode method on a new document with the first code element node of this
	Document as the source.  Verify if the node has been adopted correctly by checking the 
	length of the this elements childNode list before and after.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode24 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode24") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var childList;
      var adoptedNode;
      var codeElem;
      var codeElemChildren;
      var adoptedChildren;
      var codeElemLen;
      var adoptedLen;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","dom:test",nullDocType);
      childList = doc.getElementsByTagNameNS("*","code");
      codeElem = childList.item(0);
      adoptedNode = newDoc.adoptNode(codeElem);
      codeElemChildren = codeElem.childNodes;

      adoptedChildren = adoptedNode.childNodes;

      codeElemLen = codeElemChildren.length;

      adoptedLen = adoptedChildren.length;

      assertEquals("documentadoptnode24",adoptedLen,codeElemLen);
       
},
/**
* 
	Invoke the adoptNode method on a new document with a new Element of this
	Document as the source.  Verify if the node has been adopted correctly by checking the 
	nodeName of the adopted Element.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode25 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode25") != null) return;
    var doc;
      var newElem;
      var newDoc;
      var domImpl;
      var adoptedNode;
      var adoptedName;
      var adoptedNS;
      var docElem;
      var rootNS;
      var rootName;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      newElem = doc.createElementNS("http://www.w3.org/1999/xhtml","th");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      adoptedNode = newDoc.adoptNode(newElem);
      
	if(
	
	(adoptedNode != null)

	) {
	adoptedName = adoptedNode.nodeName;

      adoptedNS = adoptedNode.namespaceURI;

      assertEquals("documentadoptnode25_1","th",adoptedName);
       assertEquals("documentadoptnode25_2","http://www.w3.org/1999/xhtml",adoptedNS);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using a new Element and a new attribute created in 
	a new Document as the source.  Verify if the node has been adopted correctly by checking the 
	nodeName of the adopted Element and by checking if the attribute was adopted.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode26 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode26") != null) return;
    var doc;
      var docElem;
      var newElem;
      var newDoc;
      var domImpl;
      var adoptedNode;
      var adoptedName;
      var adoptedNS;
      var nullDocType = null;

      var appendedChild;
      var rootNS;
      var rootTagname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootTagname,nullDocType);
      newElem = newDoc.createElementNS("http://www.w3.org/1999/xhtml","head");
      newElem.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang","en-US");
      docElem = newDoc.documentElement;

      appendedChild = docElem.appendChild(newElem);
      adoptedNode = doc.adoptNode(newElem);
      
	if(
	
	(adoptedNode != null)

	) {
	adoptedName = adoptedNode.nodeName;

      adoptedNS = adoptedNode.namespaceURI;

      assertEquals("documentadoptnode26_1","head",adoptedName);
       assertEquals("documentadoptnode26_2","http://www.w3.org/1999/xhtml",adoptedNS);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using a new imported Element and a new attribute created in 
	a new Document as the source.  Verify if the node has been adopted correctly by checking the 
	nodeName of the adopted Element and by checking if the attribute was adopted.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode27 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode27") != null) return;
    var doc;
      var docElem;
      var newElem;
      var newImpElem;
      var newDoc;
      var domImpl;
      var adoptedNode;
      var adoptedName;
      var adoptedNS;
      var appendedChild;
      var nullDocType = null;

      var rootNS;
      var rootTagname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootTagname,nullDocType);
      newElem = newDoc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:head");
      newElem.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang","en-US");
      docElem = newDoc.documentElement;

      appendedChild = docElem.appendChild(newElem);
      newImpElem = doc.importNode(newElem,true);
      adoptedNode = doc.adoptNode(newImpElem);
      
	if(
	
	(adoptedNode != null)

	) {
	adoptedName = adoptedNode.nodeName;

      adoptedNS = adoptedNode.namespaceURI;

      assertEquals("documentadoptnode27_1","xhtml:head",adoptedName);
       assertEquals("documentadoptnode27_2","http://www.w3.org/1999/xhtml",adoptedNS);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using the "p" element with the default 
	Attribute "dir" as the source.  Verify if the node has been adopted correctly by 
	checking the nodeName of the adopted Element and by checking if the attribute was adopted.
	Note the default attribute should be adopted in this case.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode28 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode28") != null) return;
    var doc;
      var childList;
      var adoptedNode;
      var employeeElem;
      var attrImp;
      var nodeName;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("p");
      employeeElem = childList.item(3);
      adoptedNode = doc.adoptNode(employeeElem);
      
	if(
	
	(adoptedNode != null)

	) {
	attrImp = adoptedNode.getAttributeNode("dir");
      nodeName = attrImp.nodeName;

      assertEquals("documentadoptnode28","dir",nodeName);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using a new Text node as the source.  Verify 
	if the node has been adopted correctly by checking the nodeValue of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode30 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode30") != null) return;
    var doc;
      var newText;
      var adoptedText;
      var nodeValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      newText = doc.createTextNode("Document.adoptNode test for a TEXT_NODE");
      adoptedText = doc.adoptNode(newText);
      
	if(
	
	(adoptedText != null)

	) {
	nodeValue = adoptedText.nodeValue;

      assertEquals("documentadoptnode30","Document.adoptNode test for a TEXT_NODE",nodeValue);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using a new Text node from a new Document as the 
	source.  Verify if the node has been adopted correctly by checking the nodeValue of the adopted 
	node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode31 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode31") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var newText;
      var adoptedText;
      var nodeValue;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newText = newDoc.createTextNode("new Document.adoptNode test for a TEXT_NODE");
      adoptedText = doc.adoptNode(newText);
      
	if(
	
	(adoptedText != null)

	) {
	nodeValue = adoptedText.nodeValue;

      assertEquals("documentadoptnode31","new Document.adoptNode test for a TEXT_NODE",nodeValue);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on another document using a new CDataSection node created in this
	Document as the source.  Verify if the node has been adopted correctly by checking the nodeValue 
	of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode32 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode32") != null) return;
    var doc;
      var docAdopter;
      var newCDATA;
      var adoptedCDATA;
      var nodeValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      var docAdopterRef = null;
      if (typeof(this.docAdopter) != 'undefined') {
        docAdopterRef = this.docAdopter;
      }
      docAdopter = load(docAdopterRef, "docAdopter", "hc_staff");
      newCDATA = doc.createCDATASection("Document.adoptNode test for a CDATASECTION_NODE");
      adoptedCDATA = docAdopter.adoptNode(newCDATA);
      
	if(
	
	(adoptedCDATA != null)

	) {
	nodeValue = adoptedCDATA.nodeValue;

      assertEquals("documentadoptnode32","Document.adoptNode test for a CDATASECTION_NODE",nodeValue);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using a new CDataSection node created in a new
	Document as the source.  Verify if the node has been adopted correctly by checking the nodeValue 
	of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode33 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode33") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var newCDATA;
      var adoptedCDATA;
      var nodeValue;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newCDATA = newDoc.createCDATASection("Document.adoptNode test for a CDATASECTION_NODE");
      adoptedCDATA = doc.adoptNode(newCDATA);
      
	if(
	
	(adoptedCDATA != null)

	) {
	nodeValue = adoptedCDATA.nodeValue;

      assertEquals("documentadoptnode33","Document.adoptNode test for a CDATASECTION_NODE",nodeValue);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on a new document using a new Comment node created in it
	as the source.  Verify if the node has been adopted correctly by checking the nodeValue 
	of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode34 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode34") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var newComment;
      var adoptedComment;
      var nodeValue;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newComment = newDoc.createComment("Document.adoptNode test for a COMMENT_NODE");
      adoptedComment = newDoc.adoptNode(newComment);
      
	if(
	
	(adoptedComment != null)

	) {
	nodeValue = adoptedComment.nodeValue;

      assertEquals("documentadoptnode34","Document.adoptNode test for a COMMENT_NODE",nodeValue);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using a new PI node created in a new doc
	as the source.  Verify if the node has been adopted correctly by checking the nodeValue 
	of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode35 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode35") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var newPI;
      var adoptedPI;
      var piTarget;
      var piData;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newPI = newDoc.createProcessingInstruction("PITarget","PIData");
      adoptedPI = doc.adoptNode(newPI);
      
	if(
	
	(adoptedPI != null)

	) {
	piTarget = adoptedPI.target;

      piData = adoptedPI.data;

      assertEquals("documentadoptnode35_Target","PITarget",piTarget);
       assertEquals("documentadoptnode35_Data","PIData",piData);
       
	}
	
},
/**
* 
	Invoke the adoptNode method on this document using a new PI node created in a new doc
	as the source.  Verify if the node has been adopted correctly by checking the nodeValue 
	of the adopted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-adoptNode
*/
documentadoptnode36 : function () {
   var success;
    if(checkInitialization(builder, "documentadoptnode36") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var newPI1;
      var newPI2;
      var adoptedPI1;
      var adoptedPI2;
      var piTarget;
      var piData;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newPI1 = newDoc.createProcessingInstruction("PITarget","PIData");
      newPI2 = doc.createProcessingInstruction("PITarget","PIData");
      adoptedPI1 = newDoc.adoptNode(newPI1);
      
	if(
	
	(adoptedPI1 != null)

	) {
	adoptedPI2 = newDoc.adoptNode(newPI2);
      
	if(
	
	(adoptedPI2 != null)

	) {
	piTarget = adoptedPI1.target;

      piData = adoptedPI1.data;

      assertEquals("documentadoptnode36_Target1","PITarget",piTarget);
       assertEquals("documentadoptnode36_Data1","PIData",piData);
       piTarget = adoptedPI2.target;

      piData = adoptedPI2.data;

      assertEquals("documentadoptnode36_Target2","PITarget",piTarget);
       assertEquals("documentadoptnode36_Data2","PIData",piData);
       
	}
	
	}
	
},
/**
* 
	Retreive the doctype node, create a new Doctype node, call replaceChild and try replacing the
	docType node with a new docType node.  Check if the docType node was correctly replaced with
	the new one.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-B63ED1A31
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
documentgetdoctype01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetdoctype01") != null) return;
    var doc;
      var docType;
      var newDocType;
      var replacedDocType;
      var domImpl;
      var newSysID;
      var nullPubID = null;

      var nullSysID = null;

      var replaced;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      rootName = docType.name;

      domImpl = doc.implementation;
newDocType = domImpl.createDocumentType(rootName,nullPubID,nullSysID);
      
      try {
      replaced = doc.replaceChild(newDocType,docType);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        replacedDocType = doc.doctype;

      newSysID = replacedDocType.systemId;

      assertNull("newSysIdNull",newSysID);
    
},
/**
* 
	Retreive the documentURI of this document, and verify if it is not null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-documentURI
*/
documentgetdocumenturi01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetdocumenturi01") != null) return;
    var doc;
      var docURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docURI = doc.documentURI;

      assertNotNull("documentgetdocumenturi01",docURI);

},
/**
* 
	Create a new Document, retreive its documentURI, and verify if it is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-documentURI
*/
documentgetdocumenturi02 : function () {
   var success;
    if(checkInitialization(builder, "documentgetdocumenturi02") != null) return;
    var doc;
      var newDoc;
      var docURI;
      var domImpl;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      docURI = newDoc.documentURI;

      assertNull("documentgetdocumenturi02",docURI);
    
},
/**
* 
	Import the documentElement node of this document into a new document.  Since this node is
	now owned by the importing document, its documentURI attribute value should be null

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-documentURI
*/
documentgetdocumenturi03 : function () {
   var success;
    if(checkInitialization(builder, "documentgetdocumenturi03") != null) return;
    var doc;
      var newDoc;
      var importedOwner;
      var docElem;
      var docElemImported;
      var docURI;
      var domImpl;
      var nullDocType = null;

      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      docElemImported = newDoc.importNode(docElem,false);
      importedOwner = docElemImported.ownerDocument;

      docURI = importedOwner.documentURI;

      assertNull("documentgetdocumenturi03",docURI);
    
},
/**
* 
	Call the getInputEncoding method on a UTF-8 encoded document and check if the 
	value returned is UTF-8.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-inputEncoding
*/
documentgetinputencoding01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetinputencoding01") != null) return;
    var doc;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      encodingName = doc.inputEncoding;

      assertEquals("documentgetinputencoding01","UTF-8".toLowerCase(),encodingName.toLowerCase());
       
},
/**
* 
	Call the getInputEncoding method on a new document and check if the value returned
	is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-inputEncoding
*/
documentgetinputencoding02 : function () {
   var success;
    if(checkInitialization(builder, "documentgetinputencoding02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var encodingName;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      encodingName = newDoc.inputEncoding;

      assertNull("documentgetinputencoding02",encodingName);
    
},
/**
* 
	Call the getInputEncoding method on a on a UTF-16 (BE) encoded document and check if the value returned
	is UTF-16BE.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-inputEncoding
*/
documentgetinputencoding03 : function () {
   var success;
    if(checkInitialization(builder, "documentgetinputencoding03") != null) return;
    var doc;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_utf16");
      encodingName = doc.inputEncoding;

      assertEquals("documentgetinputencoding03","UTF-16BE".toLowerCase(),encodingName.toLowerCase());
       
},
/**
* 
	Call the getInputEncoding method on a cloned UTF-8 encoded document 
	and check if the value returned is UTF-8 or null (implementation dependent).

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-inputEncoding
*/
documentgetinputencoding04 : function () {
   var success;
    if(checkInitialization(builder, "documentgetinputencoding04") != null) return;
    var doc;
      var cloned;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_utf8");
      cloned = doc.cloneNode(true);
      encodingName = cloned.inputEncoding;

      	assertTrue("documentgetinputencoding04",
      
	(("UTF-8".toUpperCase() == encodingName.toUpperCase()) || 
	(encodingName == null)
)
);

},
/**
* 
	Verify if the (default) value of the strictErrorChecking attribute of this document object is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-strictErrorChecking
*/
documentgetstricterrorchecking01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetstricterrorchecking01") != null) return;
    var doc;
      var strictErrorCheckingValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      strictErrorCheckingValue = doc.strictErrorChecking;

      assertTrue("documentgetstricterrorchecking01",strictErrorCheckingValue);

},
/**
* 
	Verify if the (default)value of the strictErrorChecking attribute of a new Document object is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-strictErrorChecking
*/
documentgetstricterrorchecking02 : function () {
   var success;
    if(checkInitialization(builder, "documentgetstricterrorchecking02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var strictErrorCheckingValue;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      strictErrorCheckingValue = newDoc.strictErrorChecking;

      assertTrue("documentgetstricterrorchecking02",strictErrorCheckingValue);

},
/**
* 
	Call the getXmlEncoding method on a UTF-8 encoded XML document in which the encoding pseudo 
	attribute in its XMLDecl is UTF-8 and check if the value returned is UTF-8.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-encoding
*/
documentgetxmlencoding01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlencoding01") != null) return;
    var doc;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_utf8");
      encodingName = doc.xmlEncoding;

      assertEquals("documentgetxmlencoding01","uTf-8",encodingName);
       
},
/**
* 
	Call the getXmlEncoding method on a new document and check if the value returned
	is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-encoding
*/
documentgetxmlencoding02 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlencoding02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var encodingName;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      encodingName = newDoc.xmlEncoding;

      assertNull("documentgetxmlencoding02",encodingName);
    
},
/**
* 
	Call the getXmlEncoding method on a UTF-16 encoded document and check if the value returned
	is UTF-16.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-encoding
*/
documentgetxmlencoding03 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlencoding03") != null) return;
    var doc;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_utf16");
      encodingName = doc.xmlEncoding;

      assertEquals("documentgetxmlencoding03","uTf-16",encodingName);
       
},
/**
* 
	Call the getXmlEncoding method on a UTF-8 encoded XML document that does not contain
	the encoding pseudo attribute in its XMLDecl and check if the value returend is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-encoding
*/
documentgetxmlencoding04 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlencoding04") != null) return;
    var doc;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      encodingName = doc.xmlEncoding;

      assertNull("documentgetxmlencoding04",encodingName);
    
},
/**
* 
	Call the getXmlEncoding method on a cloned UTF-8 encoded document 
	and check if the value returned is UTF-8 or null (implementation dependent).

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-encoding
*/
documentgetxmlencoding05 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlencoding05") != null) return;
    var doc;
      var cloned;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_utf8");
      cloned = doc.cloneNode(true);
      encodingName = cloned.xmlEncoding;

      	assertTrue("documentgetxmlencoding05",
      
	(("uTf-8" == encodingName) || 
	(encodingName == null)
)
);

},
/**
* 
	Retreive the xmlStandalone attribute of a document for which standalone was not specified, this 
	should return false since the default for standalone is no when external markup decls 
	are present.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-standalone
*/
documentgetxmlstandalone01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlstandalone01") != null) return;
    var doc;
      var standalone;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      standalone = doc.xmlStandalone;

      assertFalse("documentgetxmlstandalone01",standalone);

},
/**
* 
	The value of the standalone pesudo-attribute for a new Document should be false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-standalone
*/
documentgetxmlstandalone02 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlstandalone02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var standalone;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      standalone = newDoc.xmlStandalone;

      assertFalse("documentgetxmlstandalone02",standalone);

},
/**
* 
	The value of the standalone attribute for an XML document with the standalone="no"
	should be false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-standalone
*/
documentgetxmlstandalone03 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlstandalone03") != null) return;
    var doc;
      var standalone;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_standalone_no");
      standalone = doc.xmlStandalone;

      assertFalse("documentgetxmlstandalone03",standalone);

},
/**
* 
	Retreive the documentURI of a document for which standalone was specified as "yes", this 
	should return true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-standalone
*/
documentgetxmlstandalone04 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlstandalone04") != null) return;
    var doc;
      var standalone;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_standalone_yes");
      standalone = doc.xmlStandalone;

      assertTrue("documentgetxmlstandalone04",standalone);

},
/**
* 
	Cretae a new DocumentType node whose systemId is StaffNS.DTD.  Create a new Document 
	node.  Check if the value of the standalone attribute on the new Document is false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-standalone
*/
documentgetxmlstandalone05 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlstandalone05") != null) return;
    var doc;
      var newDoc;
      var newDocType;
      var domImpl;
      var standalone;
      var nullPubId = null;

      var docElem;
      var rootNS;
      var rootName;
      var docType;
      var sysId;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      docType = doc.doctype;

      sysId = docType.systemId;

      domImpl = doc.implementation;
newDocType = domImpl.createDocumentType(rootName,nullPubId,sysId);
      newDoc = domImpl.createDocument(rootNS,rootName,newDocType);
      standalone = newDoc.xmlStandalone;

      assertFalse("documentgetxmlstandalone05",standalone);

},
/**
* 
	Check if the value of the version attribute in the XML declaration of this document 
	obtained by parsing staffNS.xml is "1.0".

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-version
*/
documentgetxmlversion01 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlversion01") != null) return;
    var doc;
      var versionValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      versionValue = doc.xmlVersion;

      assertEquals("documentgetxmlversion01","1.0",versionValue);
       
},
/**
* 
	Check if the value of the version attribute in the XML declaration of a new document 
	is "1.0".

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-version
*/
documentgetxmlversion02 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlversion02") != null) return;
    var doc;
      var newDoc;
      var versionValue;
      var domImpl;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      versionValue = newDoc.xmlVersion;

      assertEquals("documentgetxmlversion02","1.0".toLowerCase(),versionValue.toLowerCase());
       
},
/**
* 
	Check if the value of the version attribute in a XML document without a XMLDecl is
	is "1.0".	    

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-version
*/
documentgetxmlversion03 : function () {
   var success;
    if(checkInitialization(builder, "documentgetxmlversion03") != null) return;
    var doc;
      var versionValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      versionValue = doc.xmlVersion;

      assertEquals("documentgetxmlversion03","1.0".toLowerCase(),versionValue.toLowerCase());
       
},
/**
* 
	Invoke the normalizeDocument method on this document.  Retreive the documentElement node
	and check the nodeName of this node to make sure it has not changed.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
*/
documentnormalizedocument01 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument01") != null) return;
    var doc;
      var docElem;
      var docElemNodeName;
      var origDocElemNodeName;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      origDocElemNodeName = docElem.nodeName;

      domConfig = doc.domConfig;

      domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     docElem = doc.documentElement;

      docElemNodeName = docElem.nodeName;

      assertEquals("documentnormalizedocument01",origDocElemNodeName,docElemNodeName);
       
},
/**
* 
Normalize a document with the 'cdata-sections' parameter set to false and
check if the CDATASection has been preserved.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-cdata-sections
*/
documentnormalizedocument02 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument02") != null) return;
    var doc;
      var elemList;
      var elemName;
      var cdata;
      var text;
      var nodeName;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elemName = elemList.item(1);
      cdata = elemName.lastChild;

      nodeName = cdata.nodeName;

      assertEquals("documentnormalizedocument02","#cdata-section",nodeName);
       domConfig = doc.domConfig;

      domConfig.setParameter("cdata-sections", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizationError", 2);
     elemList = doc.getElementsByTagName("strong");
      elemName = elemList.item(1);
      cdata = elemName.lastChild;

      nodeName = cdata.nodeName;

      assertEquals("documentnormalizedocument02_true","#cdata-section",nodeName);
       domConfig.setParameter("cdata-sections", false);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalization2Error", 2);
     elemList = doc.getElementsByTagName("strong");
      elemName = elemList.item(1);
      text = elemName.lastChild;

      nodeName = text.nodeName;

      assertEquals("documentnormalizedocument02_false","#text",nodeName);
       
},
/**
* 
Normalize a document with a created CDATA section with the 
'cdata-sections' parameter set to true then to false and check if
the CDATASection has been preserved and then coalesced.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=416
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-cdata-sections
*/
documentnormalizedocument03 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument03") != null) return;
    var doc;
      var elem;
      var newCdata;
      var cdata;
      var text;
      var nodeName;
      var nodeValue;
      var appendedChild;
      var domConfig;
      var pList;
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newCdata = doc.createCDATASection("CDATA");
      appendedChild = elem.appendChild(newCdata);
      domConfig = doc.domConfig;

      domConfig.setParameter("cdata-sections", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizationError", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      cdata = elem.lastChild;

      nodeName = cdata.nodeName;

      assertEquals("documentnormalizedocument03_true","#cdata-section",nodeName);
       domConfig.setParameter("cdata-sections", false);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalization2Error", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      text = elem.lastChild;

      nodeName = text.nodeName;

      assertEquals("documentnormalizedocument03_false","#text",nodeName);
       nodeValue = text.nodeValue;

      assertEquals("normalizedValue","barCDATA",nodeValue);
       
},
/**
* 
	Append a Comment node and normalize with "comments" set to false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=416
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-comments
*/
documentnormalizedocument04 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument04") != null) return;
    var doc;
      var elem;
      var newComment;
      var lastChild;
      var text;
      var nodeName;
      var appendedChild;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newComment = doc.createComment("COMMENT_NODE");
      appendedChild = elem.appendChild(newComment);
      domConfig = doc.domConfig;

      domConfig.setParameter("comments", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizationError", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      lastChild = elem.lastChild;

      nodeName = lastChild.nodeName;

      assertEquals("documentnormalizedocument04_true","#comment",nodeName);
       domConfig.setParameter("comments", false);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalization2Error", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      lastChild = elem.lastChild;

      nodeName = lastChild.nodeName;

      assertEquals("hasChildText","#text",nodeName);
       
},
/**
* 
Add a L1 element to a L2 namespace aware document and perform namespace normalization.  Should result
in an error.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/namespaces-algorithms#normalizeDocumentAlgo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespaces
*/
documentnormalizedocument05 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument05") != null) return;
    var doc;
      var elem;
      var domConfig;
      var pList;
      var newChild;
      var retval;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      var problemNode;
      var location;
      var lineNumber;
      var columnNumber;
      var byteOffset;
      var utf16Offset;
      var uri;
      var type;
      var message;
      var relatedException;
      var relatedData;
      var length;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newChild = doc.createElement("br");
      retval = elem.appendChild(newChild);
      domConfig = doc.domConfig;

      domConfig.setParameter("namespaces", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100B6 = 0;indexN100B6 < errors.length; indexN100B6++) {
      error = errors[indexN100B6];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	location = error.location;

      problemNode = location.relatedNode;

      assertSame("relatedNodeIsL1Node",newChild,problemNode);
lineNumber = location.lineNumber;

      assertEquals("lineNumber",-1,lineNumber);
       columnNumber = location.columnNumber;

      assertEquals("columnNumber",-1,columnNumber);
       byteOffset = location.byteOffset;

      assertEquals("byteOffset",-1,byteOffset);
       utf16Offset = location.utf16Offset;

      assertEquals("utf16Offset",-1,utf16Offset);
       uri = location.uri;

      assertNull("uri",uri);
    message = error.message;

      length = message.length;
      	assertTrue("messageNotEmpty",
      
	(length > 0)
);
type = error.type;

      relatedData = error.relatedData;

      relatedException = error.relatedException;

      errorCount += 1;

	}
	
		else {
			assertEquals("anyOthersShouldBeWarnings",1,severity);
       
		}
	
	}
   assertEquals("oneError",1,errorCount);
       
},
/**
* 
Add a CDATASection containing "]]>" perform normalization with split-cdata-sections=true.  Should result
in an warning.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-split-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-severity
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-message
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-type
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-relatedException
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-relatedData
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-location
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-line-number
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-column-number
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-byteOffset
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-utf16Offset
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-node
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-uri
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=542
*/
documentnormalizedocument06 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument06") != null) return;
    var doc;
      var elem;
      var domConfig;
      var elemList;
      var newChild;
      var oldChild;
      var retval;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var splittedCount = 0;
      var severity;
      var problemNode;
      var location;
      var lineNumber;
      var columnNumber;
      var byteOffset;
      var utf16Offset;
      var uri;
      var type;
      var message;
      var relatedException;
      var relatedData;
      var length;
      var nodeType;
      var nodeValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      newChild = doc.createCDATASection("this is not ]]> good");
      oldChild = elem.firstChild;

      retval = elem.replaceChild(newChild,oldChild);
      domConfig = doc.domConfig;

      domConfig.setParameter("split-cdata-sections", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      newChild = elem.firstChild;

      nodeValue = newChild.nodeValue;

      nodeType = newChild.nodeType;

      
			{
			assertFalse("wasSplit",
	((4 == nodeType) && (nodeValue.indexOf("]]>") >= 0))
);
errors = errorMonitor.allErrors;
for(var indexN1010C = 0;indexN1010C < errors.length; indexN1010C++) {
      error = errors[indexN1010C];
      type = error.type;

      severity = error.severity;

      
	if(
	("cdata-sections-splitted" == type)
	) {
	relatedData = error.relatedData;

      assertSame("relatedData",newChild,relatedData);
assertEquals("severity",1,severity);
       message = error.message;

      length = message.length;
      	assertTrue("messageNotEmpty",
      
	(length > 0)
);
relatedException = error.relatedException;

      location = error.location;

      problemNode = location.relatedNode;

      assertSame("relatedNode",newChild,problemNode);
lineNumber = location.lineNumber;

      columnNumber = location.columnNumber;

      byteOffset = location.byteOffset;

      utf16Offset = location.utf16Offset;

      uri = location.uri;

      splittedCount += 1;

	}
	
		else {
			assertEquals("anyOthersShouldBeWarnings",1,severity);
       
		}
	
	}
   assertEquals("oneSplittedWarning",1,splittedCount);
       
}},
/**
* 
Add a CDATASection containing "]]>" and perform normalization with split-cdata-sections=false.  Should result
in an error.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-split-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-severity
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-message
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-type
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-relatedException
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-relatedData
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ERROR-DOMError-location
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-line-number
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-column-number
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-byteOffset
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-utf16Offset
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-node
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMLocator-uri
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=542
*/
documentnormalizedocument07 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument07") != null) return;
    var doc;
      var elem;
      var domConfig;
      var elemList;
      var newChild;
      var oldChild;
      var retval;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      var problemNode;
      var location;
      var lineNumber;
      var columnNumber;
      var byteOffset;
      var utf16Offset;
      var uri;
      var type;
      var message;
      var relatedException;
      var relatedData;
      var length;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      oldChild = elem.firstChild;

      newChild = doc.createCDATASection("this is not ]]> good");
      retval = elem.replaceChild(newChild,oldChild);
      domConfig = doc.domConfig;

      domConfig.setParameter("split-cdata-sections", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100E0 = 0;indexN100E0 < errors.length; indexN100E0++) {
      error = errors[indexN100E0];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	location = error.location;

      problemNode = location.relatedNode;

      assertSame("relatedNode",newChild,problemNode);
lineNumber = location.lineNumber;

      columnNumber = location.columnNumber;

      byteOffset = location.byteOffset;

      utf16Offset = location.utf16Offset;

      uri = location.uri;

      message = error.message;

      length = message.length;
      	assertTrue("messageNotEmpty",
      
	(length > 0)
);
type = error.type;

      relatedData = error.relatedData;

      relatedException = error.relatedException;

      errorCount += 1;

	}
	
		else {
			assertEquals("anyOthersShouldBeWarnings",1,severity);
       
		}
	
	}
   assertEquals("oneError",1,errorCount);
       
},
/**
* 
Add two CDATASections containing "]]>" perform normalization with split-cdata-sections=true.
Should result in two warnings and at least 4 nodes.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-split-cdata-sections
*/
documentnormalizedocument08 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument08") != null) return;
    var doc;
      var elem;
      var domConfig;
      var elemList;
      var newChild;
      var oldChild;
      var retval;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var length;
      var childNodes;
      var type;
      var splittedCount = 0;
      var severity;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      newChild = doc.createCDATASection("this is not ]]> good");
      oldChild = elem.firstChild;

      retval = elem.replaceChild(newChild,oldChild);
      newChild = doc.createCDATASection("this is not ]]> good");
      retval = elem.appendChild(newChild);
      domConfig = doc.domConfig;

      domConfig.setParameter("split-cdata-sections", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100A3 = 0;indexN100A3 < errors.length; indexN100A3++) {
      error = errors[indexN100A3];
      type = error.type;

      severity = error.severity;

      
	if(
	("cdata-sections-splitted" == type)
	) {
	splittedCount += 1;

	}
	
		else {
			assertEquals("anyOthersShouldBeWarnings",1,severity);
       
		}
	
	}
   assertEquals("twoSplittedWarning",2,splittedCount);
       elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      childNodes = elem.childNodes;

      length = childNodes.length;

      	assertTrue("atLeast4ChildNodes",
      
	(length > 3)
);

},

/**
* 
	The normalizeDocument method method acts as if the document was going through a save 
	and load cycle, putting the document in a "normal" form. 

	Set the validate-if-schema feature to true.  Invoke the normalizeDocument method on this 
	document.  Retreive the documentElement node and check the nodeName of this node 
	to make sure it has not changed.  Now set validate to false and verify the same. 
	Register an error handler on this Document and in each case make sure that it does
	not get called.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-validate-if-schema
*/
documentnormalizedocument09 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument09") != null) return;
    var doc;
      var docElem;
      var docElemNodeName;
      var canSet;
      var errorHandler;
      errHandler = new DOMErrorHandlerN1003C();
	  
      var domConfig;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      domConfig.setParameter("error-handler", errHandler.handleError);
	 canSet = domConfig.canSetParameter("validate-if-schema",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate-if-schema", true);
	 doc.normalizeDocument();
      docElem = doc.documentElement;

      docElemNodeName = docElem.nodeName;

      assertEquals("documentnormalizedocument09_True","html",docElemNodeName);
       
	}
	domConfig.setParameter("validate-if-schema", false);
	 doc.normalizeDocument();
      docElem = doc.documentElement;

      docElemNodeName = docElem.nodeName;

      assertEquals("documentnormalizedocument09_False","html",docElemNodeName);
       
},
/**
* 
	The normalizeDocument method method acts as if the document was going through a save 
	and load cycle, putting the document in a "normal" form. 

	Create an Element and a text node and verify the nodeValue of this text node and append these to
	this Document.  If supported, invoke the setParameter method on this domconfiguration object to set the 
	"element-content-whitespace"  feature to false.  Invoke the normalizeDocument method and verify if 
	the text node has been discarded.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-element-content-whitespace
*/
documentnormalizedocument10 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument10") != null) return;
    var doc;
      var elem;
      var newText;
      var text;
      var nodeValue;
      var canSet;
      var appendedChild;
      var domConfig;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElement("newElem");
      newText = doc.createTextNode("Text          Node");
      appendedChild = elem.appendChild(newText);
      appendedChild = doc.appendChild(elem);
      text = elem.firstChild;

      nodeValue = text.nodeValue;

      assertEquals("documentnormalizedocument10","Text          Node",nodeValue);
       domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("element-content-whitespace",true);
      assertTrue("canSetElementContentWhitespaceTrue",canSet);
domConfig.setParameter("element-content-whitespace", true);
	 doc.normalizeDocument();
      text = elem.firstChild;

      nodeValue = text.nodeValue;

      assertEquals("documentnormalizedocument10_true1","Text          Node",nodeValue);
       canSet = domConfig.canSetParameter("element-content-whitespace",false);
      
	if(
	canSet
	) {
	domConfig.setParameter("element-content-whitespace", false);
	 doc.normalizeDocument();
      text = elem.firstChild;

      nodeValue = text.nodeValue;

      assertEquals("documentnormalizedocument10_true2","Text Node",nodeValue);
       
	}
	
},
/**
* 
	The normalizeDocument method method acts as if the document was going through a save 
	and load cycle, putting the document in a "normal" form. 
	The feature namespace-declarations when set to false, discards all namespace declaration attributes,
        although namespace prefixes are still retained.
	
	Set the normalization feature "namespace-declarations" to false, invoke normalizeDocument and verify 
        the nodeName of element acquired by tagname.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespace-declarations
*/
documentnormalizedocument11 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument11") != null) return;
    var doc;
      var elemList;
      var elemName;
      var nodeName;
      var canSet;
      var domConfig;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      domConfig.setParameter("namespace-declarations", true);
	 doc.normalizeDocument();
      elemList = doc.getElementsByTagNameNS("*","acronym");
      elemName = elemList.item(1);
      assertNotNull("documentnormalizedocument11_NotNullElem",elemName);
canSet = domConfig.canSetParameter("namespace-declarations",false);
      
	if(
	canSet
	) {
	domConfig.setParameter("namespace-declarations", false);
	 doc.normalizeDocument();
      elemList = doc.getElementsByTagNameNS("*","acronym");
      elemName = elemList.item(1);
      nodeName = elemName.nodeName;

      assertEquals("documentnormalizedocument11_namespaceDeclarations","address",nodeName);
       
	}
	
},
/**
* 
	The normalizeDocument method method acts as if the document was going through a save 
	and load cycle, putting the document in a "normal" form. 

	Set the validate feature to true.  Invoke the normalizeDocument method on this 
	document.  Retreive the documentElement node and check the nodeName of this node 
	to make sure it has not changed.  Now set validate to false and verify the same. 
	Register an error handler on this Document and in each case make sure that it does
	not get called.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-validate
*/
documentnormalizedocument12 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument12") != null) return;
    var doc;
      var docElem;
      var docElemNodeName;
      var canSet;
      var domConfig;
      var errorHandler;
      errHandler = new DOMErrorHandlerN10048();
	  
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      domConfig.setParameter("error-handler", errHandler.handleError);
	 canSet = domConfig.canSetParameter("validate",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate", true);
	 doc.normalizeDocument();
      docElem = doc.documentElement;

      docElemNodeName = docElem.nodeName;

      assertEquals("documentnormalizedocument08_True","html",docElemNodeName);
       
	}
	domConfig.setParameter("validate", false);
	 doc.normalizeDocument();
      docElem = doc.documentElement;

      docElemNodeName = docElem.nodeName;

      assertEquals("documentnormalizedocument08_False","html",docElemNodeName);
       
},
/**
* 
Add a L1 attribute to a L2 namespace aware document and perform namespace normalization.  Should result
in an error.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/namespaces-algorithms#normalizeDocumentAlgo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespaces
*/
documentnormalizedocument13 : function () {
   var success;
    if(checkInitialization(builder, "documentnormalizedocument13") != null) return;
    var doc;
      var elem;
      var domConfig;
      var pList;
      var newAttr;
      var retval;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      var problemNode;
      var location;
      var lineNumber;
      var columnNumber;
      var byteOffset;
      var utf16Offset;
      var uri;
      var type;
      var message;
      var relatedException;
      var relatedData;
      var length;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      elem.setAttribute("title","DOM L1 Attribute");
      newAttr = elem.getAttributeNode("title");
      domConfig = doc.domConfig;

      domConfig.setParameter("namespaces", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100B6 = 0;indexN100B6 < errors.length; indexN100B6++) {
      error = errors[indexN100B6];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	location = error.location;

      problemNode = location.relatedNode;

      assertSame("relatedNodeIsL1Node",newAttr,problemNode);
lineNumber = location.lineNumber;

      assertEquals("lineNumber",-1,lineNumber);
       columnNumber = location.columnNumber;

      assertEquals("columnNumber",-1,columnNumber);
       byteOffset = location.byteOffset;

      assertEquals("byteOffset",-1,byteOffset);
       utf16Offset = location.utf16Offset;

      assertEquals("utf16Offset",-1,utf16Offset);
       uri = location.uri;

      assertNull("uri",uri);
    message = error.message;

      length = message.length;
      	assertTrue("messageNotEmpty",
      
	(length > 0)
);
type = error.type;

      relatedData = error.relatedData;

      relatedException = error.relatedException;

      errorCount += 1;

	}
	
		else {
			assertEquals("anyOthersShouldBeWarnings",1,severity);
       
		}
	
	}
   assertEquals("oneError",1,errorCount);
       
},
/**
* 
	Invoke the renameNode method to rename the class attribute node of the 
	second element whose localName is acronym and namespaceURI http://www.nist.gov
	with the new namespaceURI as http://www.w3.org/DOM/Test and name as pre0fix:renamedNode. 
	Check if this attribute has been renamed successfully by verifying the
	nodeName, namespaceURI, nodeType attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode01 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode01") != null) return;
    var doc;
      var element;
      var attr;
      var childList;
      var renamedclass;
      var nodeName;
      var nodeType;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(1);
      attr = element.getAttributeNode("class");
      renamedclass = doc.renameNode(attr,"http://www.w3.org/DOM/Test","renamedNode");
      nodeName = renamedclass.nodeName;

      namespaceURI = renamedclass.namespaceURI;

      nodeType = renamedclass.nodeType;

      assertEquals("documentrenameode01_nodeName","renamedNode",nodeName);
       assertEquals("documentrenameNode01_nodeType",2,nodeType);
       assertEquals("documentrenamenode01_nodeValue","http://www.w3.org/DOM/Test",namespaceURI);
       
},
/**
* 
	Invoke the renameNode method to rename the class attribute node of the 
	second element whose localName is acronym and namespaceURI http://www.nist.gov
	with the new namespaceURI as http://www.w3.org/DOM/Test and name as prefi0x:renamedNode. 
	Check if this attribute has been renamed successfully by verifying the
	nodeName, namespaceURI, nodeType attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode02 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode02") != null) return;
    var doc;
      var element;
      var attr;
      var childList;
      var renamedclass;
      var nodeName;
      var nodeType;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(1);
      attr = element.getAttributeNode("class");
      renamedclass = doc.renameNode(attr,"http://www.w3.org/DOM/Test","prefi0x:renamedNode");
      nodeName = renamedclass.nodeName;

      namespaceURI = renamedclass.namespaceURI;

      nodeType = renamedclass.nodeType;

      assertEquals("documentrenamenode02_nodeName","prefi0x:renamedNode",nodeName);
       assertEquals("documentrenamenode02_namespaceURI","http://www.w3.org/DOM/Test",namespaceURI);
       
},
/**
* 
	Invoke the renameNode method to rename a new attribute node to one whose
	namespaceURI is http://www.w3.org/DOM/Test and name is pre0:fix1. 
	Check if this attribute has been renamed successfully by verifying the
	nodeName, namespaceURI, nodeType attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode03 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode03") != null) return;
    var doc;
      var attr;
      var renamedNode;
      var nodeName;
      var namespaceURI;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      attr = doc.createAttributeNS(nullNSURI,"test");
      renamedNode = doc.renameNode(attr,"http://www.w3.org/DOM/Test","pre0:fix1");
      nodeName = renamedNode.nodeName;

      namespaceURI = renamedNode.namespaceURI;

      assertEquals("documentrenamenode03_nodeName","pre0:fix1",nodeName);
       assertEquals("documentrenamenode02_namespaceURI","http://www.w3.org/DOM/Test",namespaceURI);
       
},
/**
* 
	Invoke the renameNode method to rename a new attribute node to one whose
	namespaceURI is null and name is pf. 
	Check if this attribute has been renamed successfully by verifying the
	nodeName, namespaceURI, nodeType attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode04 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode04") != null) return;
    var doc;
      var attr;
      var renamedNode;
      var nodeName;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      renamedNode = doc.renameNode(attr,"","title");
      nodeName = renamedNode.nodeName;

      namespaceURI = renamedNode.namespaceURI;

      assertEquals("documentrenamenode04_nodeName","title",nodeName);
       assertNull("documentrenamenode04_namespaceURI",namespaceURI);
    
},
/**
* 
	Invoke the renameNode method to rename a new attribute node to one whose
	namespaceURI is null and name is rened. 
	Check if this attribute has been renamed successfully by verifying the
	nodeName, namespaceURI, nodeType attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode05 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode05") != null) return;
    var doc;
      var attr;
      var renamedNode;
      var nodeName;
      var namespaceURI;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      renamedNode = doc.renameNode(attr,nullNSURI,"title");
      nodeName = renamedNode.nodeName;

      namespaceURI = renamedNode.namespaceURI;

      assertNull("documentrenamenode05_namespaceURI",namespaceURI);
    assertEquals("documentrenamenode05_nodeName","title",nodeName);
       
},
/**
* 
	Invoke the renameNode method to rename the default attribute "dir" to xsi:schemaLocation. 
	Check if this attribute has been renamed successfully by verifying the
	nodeName, namespaceURI, nodeType attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode06 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode06") != null) return;
    var doc;
      var element;
      var attr;
      var childList;
      var renamedclass;
      var nodeName;
      var nodeType;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("p");
      element = childList.item(3);
      attr = element.getAttributeNode("dir");
      renamedclass = doc.renameNode(attr,"http://www.w3.org/2001/XMLSchema-instance","xsi:schemaLocation");
      nodeName = renamedclass.nodeName;

      namespaceURI = renamedclass.namespaceURI;

      nodeType = renamedclass.nodeType;

      assertEquals("documentrenameode01_nodeName","xsi:schemaLocation",nodeName);
       assertEquals("documentrenameNode01_nodeType",2,nodeType);
       assertEquals("documentrenamenode01_nodeValue","http://www.w3.org/2001/XMLSchema-instance",namespaceURI);
       
},
/**
* 
	Invoke the renameNode method on a new document node to rename a new attribute node 
	to one whose namespaceURI is http://www.w3.org/XML/1998/namespace and name is xml:dom. 
	Check if this attribute has been renamed successfully by verifying the
	nodeName and namespaceURI attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode07 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode07") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var attr;
      var renamedNode;
      var nodeName;
      var namespaceURI;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      attr = newDoc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      renamedNode = newDoc.renameNode(attr,"http://www.w3.org/XML/1998/namespace","xml:dom");
      nodeName = renamedNode.nodeName;

      namespaceURI = renamedNode.namespaceURI;

      assertEquals("documentrenamenode07_nodeName","xml:dom",nodeName);
       assertEquals("documentrenamenode07_namespaceURI","http://www.w3.org/XML/1998/namespace",namespaceURI);
       
},
/**
* 
	Invoke the renameNode method on a new document node and try to rename the default
	attribute "dir"
	Check if a WRONG_DOCUMENT_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode08 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode08") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var element;
      var attr;
      var childList;
      var renamedNode;
      var nullDocType = null;

      var docElem;
      var docElemNS;
      var docElemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("p");
      element = childList.item(3);
      attr = element.getAttributeNode("dir");
      domImpl = doc.implementation;
docElem = doc.documentElement;

      docElemNS = docElem.namespaceURI;

      docElemName = docElem.tagName;

      newDoc = domImpl.createDocument(docElemNS,docElemName,nullDocType);
      
	{
		success = false;
		try {
            renamedNode = newDoc.renameNode(attr,"http://www.w3.org/XML/1998/namespace","xml:lang");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("documentrenamenode08_WRONG_DOCUMENT_ERR",success);
	}

},
/**
* 
	The method renameNode renames an existing node. When the specified node was created 
	from a different document than this document, a WRONG_DOCUMENT_ERR exception is thrown.
 
	Invoke the renameNode method on a new Document node to rename a new attribute node
	created in the original Document, but later adopted by this new document node.  The 
	ownerDocument attribute of this attribute has now changed, such that the attribute node is considered to 
        be created from this new document node. Verify that no exception is thrown upon renaming and verify
        the new nodeName of this attribute node. 

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode09 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode09") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var attr;
      var renamedNode;
      var adopted;
      var nullDocType = null;

      var attrNodeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","dom:newD",nullDocType);
      attr = doc.createAttributeNS("http://www.w3.org/DOM/Test","test");
      adopted = newDoc.adoptNode(attr);
      renamedNode = newDoc.renameNode(attr,"http://www.w3.org/2000/xmlns/","xmlns:xmlns");
      attrNodeName = renamedNode.nodeName;

      assertEquals("documentrenamenode09_1","xmlns:xmlns",attrNodeName);
       
},
/**
* 
	The method renameNode renames an existing node and raises a  NAMESPACE_ERR
	if the qualifiedName has a prefix and the namespaceURI is null but a 
	NOT_SUPPORTED_ERR should be raised since the the type of the specified node is 
	neither ELEMENT_NODE nor ATTRIBUTE_NODE.
 
	Invoke the renameNode method on a new document node to rename a node to nodes 
	with malformed qualifiedNames.
	Check if a NOT_SUPPORTED_ERR gets thrown instead of a NAMESPACE_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode10 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode10") != null) return;
    var doc;
      var textEntry = "hello";
      var textNode;
      var renamedNode;
      var qualifiedName;
      var nullDocType = null;

      qualifiedNames = new Array();
      qualifiedNames[0] = "_:";
      qualifiedNames[1] = ":0";
      qualifiedNames[2] = ":";
      qualifiedNames[3] = "a0:0";
      qualifiedNames[4] = "_:0;";
      qualifiedNames[5] = "a:::::c";

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textNode = doc.createTextNode(textEntry);
      for(var indexN10060 = 0;indexN10060 < qualifiedNames.length; indexN10060++) {
      qualifiedName = qualifiedNames[indexN10060];
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(textNode,"http://www.w3.org/XML/1998/namespace",qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode10_NOT_SUPPORTED_ERR",success);
	}

	}
   
},
/**
* 
	The method renameNode renames an existing node and raises a  NAMESPACE_ERR
	if the qualifiedName has a prefix and the namespaceURI is null but a 
	NOT_SUPPORTED_ERR should be raised since the the type of the specified node is 
	neither ELEMENT_NODE nor ATTRIBUTE_NODE.
 
	Invoke the renameNode method on this document node to rename a text node such that its
	qualifiedName has a prefix and namespaceURI is null.
	Check if a NOT_SUPPORTED_ERR gets thrown instead of a NAMESPACE_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode11 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode11") != null) return;
    var doc;
      var textEntry = "hello";
      var textNode;
      var renamedNode;
      var nullDocType = null;

      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textNode = doc.createTextNode(textEntry);
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(textNode,nullNSURI,"pre:fix");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode11_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	The method renameNode renames an existing node and raises a  NAMESPACE_ERR
	if the qualifiedName has a prefix and the namespaceURI is null but a 
	NOT_SUPPORTED_ERR should be raised since the the type of the specified node is 
	neither ELEMENT_NODE nor ATTRIBUTE_NODE.
 
	Invoke the renameNode method on this document node to rename a text node such that its
	qualifiedName has a prefix that is "xml" and namespaceURI is "http://www.w3.org/XML/1999/namespace".
	Check if a NOT_SUPPORTED_ERR gets thrown instead of a NAMESPACE_ERR since the type of node is not valid
        for this method.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode12 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode12") != null) return;
    var doc;
      var renamedNode;
      var textEntry = "hello";
      var textNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textNode = doc.createTextNode(textEntry);
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(textNode,"http://www.w3.org/XML/1999/namespace","xml:prefix");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode12_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	The method renameNode renames an existing node and raises a NAMESPACE_ERR
	if the qualifiedName has a prefix and the namespaceURI is null but a 
	NOT_SUPPORTED_ERR should be raised since the the type of the specified node is 
	neither ELEMENT_NODE nor ATTRIBUTE_NODE.
 
	Invoke the renameNode method on this document node to rename a text node such that its
	qualifiedName has a prefix that is "xmlns"and namespaceURI is "http://www.w3.org/XML/1998/namespace".
	Check if a NOT_SUPPORTED_ERR gets thrown instead of a NAMESPACE_ERR since the type of node is not valid
        for this method.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode13 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode13") != null) return;
    var doc;
      var textEntry = "hello";
      var textNode;
      var renamedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textNode = doc.createTextNode(textEntry);
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(textNode,"http://www.w3.org/XML/1998/namespace","xmlns:prefix");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode13_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	The method renameNode renames an existing node and raises a NAMESPACE_ERR
	if the qualifiedName has a prefix and the namespaceURI is null but a 
	NOT_SUPPORTED_ERR should be raised since the the type of the specified node is 
	neither ELEMENT_NODE nor ATTRIBUTE_NODE.
 
	Invoke the renameNode method on this document node to rename a text node such that its
	qualifiedName is "xmlns"and namespaceURI is "http://www.w3.org/2000/xmlns".
	Check if a NOT_SUPPORTED_ERR gets thrown instead of a NAMESPACE_ERR since the type of node is
        not valid for this method.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode14 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode14") != null) return;
    var doc;
      var renamedNode;
      var nullDocType = null;

      var textEntry = "hello";
      var textNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textNode = doc.createTextNode(textEntry);
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(textNode,"http://www.w3.org/2000/xmlns","xmlns");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode14_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Rename the fourth acronym element to svg:rect and verify the
	nodeName, namespaceURI, nodeType attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode15 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode15") != null) return;
    var doc;
      var element;
      var childList;
      var renamedclass;
      var nodeName;
      var nodeType;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(3);
      renamedclass = doc.renameNode(element,"http://www.w3.org/DOM/Test","qnam:renamedNode");
      nodeName = renamedclass.nodeName;

      namespaceURI = renamedclass.namespaceURI;

      nodeType = renamedclass.nodeType;

      assertEquals("documentrenamenode15_nodeName","qnam:renamedNode",nodeName);
       assertEquals("documentrenamenode15_nodeType",1,nodeType);
       assertEquals("documentrenamenode15_nodeValue","http://www.w3.org/DOM/Test",namespaceURI);
       
},
/**
* 
	Invoke the renameNode method to rename the fourth 
	acronym element with a new namespaceURI that is 
	null and qualifiedName that is renamedNode. 
	Check if this element has been renamed successfully by verifying the
	nodeName, attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode16 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode16") != null) return;
    var doc;
      var element;
      var childList;
      var renamedclass;
      var nodeName;
      var nodeType;
      var namespaceURI;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(3);
      renamedclass = doc.renameNode(element,nullNSURI,"renamedNode");
      nodeName = renamedclass.nodeName;

      namespaceURI = renamedclass.namespaceURI;

      nodeType = renamedclass.nodeType;

      assertEquals("documentrenamenode16_nodeName","renamedNode",nodeName);
       assertEquals("documentrenamenode16_nodeType",1,nodeType);
       assertNull("documentrenamenode16_nodeValue",namespaceURI);
    
},
/**
* 
	Invoke the renameNode method to rename a new element node of a new document so that 
	its namespaceURI is http://www.w3.org/2000/xmlns/ and qualifiedName is xmlns:xmlns.
	Check if this element has been renamed successfully by verifying the
	nodeName, attributes of the renamed node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode17 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode17") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var element;
      var renamedNode;
      var nodeName;
      var nodeType;
      var namespaceURI;
      var docElem;
      var rootNS;
      var rootTagname;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootTagname,nullDocType);
      element = newDoc.createElementNS("http://www.w3.org/1999/xhtml","body");
      renamedNode = newDoc.renameNode(element,"http://www.w3.org/1999/xhtml","xhtml:head");
      nodeName = renamedNode.nodeName;

      namespaceURI = renamedNode.namespaceURI;

      nodeType = renamedNode.nodeType;

      assertEquals("documentrenamenode16_nodeName","xhtml:head",nodeName);
       assertEquals("documentrenamenode16_nodeType",1,nodeType);
       assertEquals("documentrenamenode16_nodeValue","http://www.w3.org/1999/xhtml",namespaceURI);
       
},
/**
* 
	Invoke the renameNode method on this document and try to rename a new element 
	node of a new document.
	Check if a WRONG_DOCUMENT_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode18 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode18") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var element;
      var renamedNode;
      var docElem;
      var rootNS;
      var rootTagname;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootTagname,nullDocType);
      element = newDoc.createElementNS("http://www.w3.org/1999/xhtml","body");
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(element,"http://www.w3.org/1999/xhtml","head");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("documentrenamenode18_WRONG_DOCUMENT_ERR",success);
	}

},
/**
* 
	The method renameNode renames an existing node and raises a NAMESPACE_ERR
	if the qualifiedName is malformed per the Namespaces in XML specification.
	
	Invoke the renameNode method on a new document node to rename a node to nodes 
	with malformed qualifiedNames.
	Check if a NAMESPACE_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode19 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode19") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var element;
      var renamedNode;
      var qualifiedName;
      var nullDocType = null;

      qualifiedNames = new Array();
      qualifiedNames[0] = "a_:";
      qualifiedNames[1] = "_:";
      qualifiedNames[2] = ":";
      qualifiedNames[3] = "::0;";
      qualifiedNames[4] = "a:-:c";

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","newD",nullDocType);
      element = doc.createElementNS("http://www.w3.org/DOM/Test","test");
      for(var indexN1006C = 0;indexN1006C < qualifiedNames.length; indexN1006C++) {
      qualifiedName = qualifiedNames[indexN1006C];
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(element,"http://www.w3.org/2000/XMLNS",qualifiedName);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("documentrenamenode19_NAMESPACE_ERR",success);
	}

	}
   
},
/**
* 
	Invoke the renameNode method on this document node to rename a node such that its
	qualifiedName has a prefix that is "xml:html" and namespaceURI is 
	"http://www.example.com/namespace".
	Check if a NAMESPACE_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode20 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode20") != null) return;
    var doc;
      var element;
      var renamedNode;
      var docElem;
      var rootNS;
      var rootTagname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      element = doc.createElementNS(rootNS,rootTagname);
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(element,"http://www.example.com/xml","xml:html");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
* 
	Invoke the renameNode method on this document node to rename a node such that its
	qualifiedName has a prefix that is "xmlns:xml"and namespaceURI is "http://www.w3.org/2000/XMLNS/".
	Check if a NAMESPACE_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode21 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode21") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var attr;
      var renamedNode;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      attr = newDoc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      
	{
		success = false;
		try {
            renamedNode = newDoc.renameNode(attr,"http://www.w3.org/2000/XMLNS/","xmlns:xml");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
* 
	Invoke the renameNode method on this document node to rename a node such that its
	qualifiedName is "xmlns"and namespaceURI is "http://www.w3.org/1999/xmlns/".
	Check if a NAMESPACE_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode22 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode22") != null) return;
    var doc;
      var attr;
      var renamedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(attr,"http://www.w3.org/1999/xmlns/","xmlns");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("throw_NAMESPACE_ERR",success);
	}

},
/**
* 
	The method renameNode renames an existing node and raises a  NOT_SUPPORTED_ERR
	if the type of the specified node is neither ELEMENT_NODE nor ATTRIBUTE_NODE.
 
	Invoke the renameNode method on this document node to attempt to rename itself.
	Check if a NOT_SUPPORTED_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode23 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode23") != null) return;
    var doc;
      var renamedNode;
      var docowner;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(doc,"http://www.w3.org/DOM/Test","root");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode23_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	The method renameNode renames an existing node and raises a  NOT_SUPPORTED_ERR
	if the type of the specified node is neither ELEMENT_NODE nor ATTRIBUTE_NODE.
 
	Invoke the renameNode method on this document node to attempt to rename itself.
	The namespaceURI specified here is null and the name has a prefix.
	Check if a NOT_SUPPORTED_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode24 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode24") != null) return;
    var doc;
      var renamedNode;
      var nullNSURI = null;

      var docowner;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(doc,nullNSURI,"doc:root");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode24_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the renameNode method to attempt to rename a DOcumentType node of this Document.
	Check if a NOT_SUPPORTED_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode25 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode25") != null) return;
    var doc;
      var docType;
      var renamedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(docType,"http://www.w3.org/DOM/Test","root");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode25_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the renameNode method oto attempt to rename a new DocumentFragment node 
	of this Document.
	Check if a NOT_SUPPORTED_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode26 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode26") != null) return;
    var doc;
      var docFrag;
      var renamedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      
	{
		success = false;
		try {
            renamedNode = doc.renameNode(docFrag,"http://www.w3.org/DOM/Test","root");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode26_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the renameNode method to attempt to rename new Text, Comment, CDataSection,
	ProcessingInstruction and EntityReference nodes of a new Document.
	Check if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode27 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode27") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var text;
      var comment;
      var cdata;
      var pi;
      var entref;
      var renamedTxt;
      var renamedComment;
      var renamedCdata;
      var renamedPi;
      var renamedEntRef;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      text = newDoc.createTextNode("text");
      comment = newDoc.createComment("comment");
      cdata = newDoc.createCDATASection("cdata");
      pi = newDoc.createProcessingInstruction("pit","pid");
      entref = newDoc.createEntityReference("alpha");
      
	{
		success = false;
		try {
            renamedTxt = newDoc.renameNode(text,"http://www.w3.org/DOM/Test","text");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_1",success);
	}

	{
		success = false;
		try {
            renamedComment = newDoc.renameNode(comment,"http://www.w3.org/DOM/Test","comment");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_2",success);
	}

	{
		success = false;
		try {
            renamedCdata = newDoc.renameNode(cdata,"http://www.w3.org/DOM/Test","cdata");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_3",success);
	}

	{
		success = false;
		try {
            renamedPi = newDoc.renameNode(pi,"http://www.w3.org/DOM/Test","pi");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_4",success);
	}

	{
		success = false;
		try {
            renamedEntRef = newDoc.renameNode(entref,"http://www.w3.org/DOM/Test","entref");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_5",success);
	}

},
/**
* 
	Invoke the renameNode method to attempt to rename a Entity and Notation nodes of this Document.
	Check if a NOT_SUPPORTED_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode28 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode28") != null) return;
    var doc;
      var docType;
      var entityNodeMap;
      var notationNodeMap;
      var entity;
      var notation;
      var renamedEntityNode;
      var renamedNotationNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entityNodeMap = docType.entities;

      notationNodeMap = docType.notations;

      entity = entityNodeMap.getNamedItem("alpha");
      notation = notationNodeMap.getNamedItem("notation1");
      
	{
		success = false;
		try {
            renamedEntityNode = doc.renameNode(entity,"http://www.w3.org/DOM/Test","beta");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode28_ENTITY_NOT_SUPPORTED_ERR",success);
	}

	{
		success = false;
		try {
            renamedNotationNode = doc.renameNode(notation,"http://www.w3.org/DOM/Test","notation2");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("documentrenamenode28_NOTATION_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	Invoke the renameNode method to attempt to rename an Element node of a XML1.0 document 
	with a name that contains an invalid XML 1.0 character and check if a INVALID_CHARACTER_ERR 
	gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-renameNode
*/
documentrenamenode29 : function () {
   var success;
    if(checkInitialization(builder, "documentrenamenode29") != null) return;
    var doc;
      var docElem;
      var renamed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      
	{
		success = false;
		try {
            renamed = doc.renameNode(docElem,"http://www.w3.org/DOM/Test","@");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("documentrenamenode29_ENTITY_NOT_SUPPORTED_ERR",success);
	}

},
/**
* 
	The setDocmentURI method set the location of the document.
	    
	Set the documentURI to a valid string and retreive the documentURI of this 
	document and verify if it is was correctly set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-documentURI
*/
documentsetdocumenturi01 : function () {
   var success;
    if(checkInitialization(builder, "documentsetdocumenturi01") != null) return;
    var doc;
      var docURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.documentURI = "file:///test";

      docURI = doc.documentURI;

      assertEquals("documentsetdocumenturi01","file:///test",docURI);
       
},
/**
* 
	The setDocmentURI method set the location of the document.
	    
	Set the documentURI to null and retreive the documentURI of this document and verify 
	if it is was set to null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-documentURI
*/
documentsetdocumenturi02 : function () {
   var success;
    if(checkInitialization(builder, "documentsetdocumenturi02") != null) return;
    var doc;
      var docURI;
      var nullValue = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.documentURI = nullValue;

      docURI = doc.documentURI;

      assertNull("documentsetdocumenturi02",docURI);
    
},
/**
* 
	The setDocmentURI method set the location of the document.
	    
	Create a new document and set its documentURI to a valid string.  Retreive the documentURI 
	and verify if it is was correctly set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-documentURI
*/
documentsetdocumenturi03 : function () {
   var success;
    if(checkInitialization(builder, "documentsetdocumenturi03") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var docURI;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newDoc.documentURI = "somestring";

      docURI = newDoc.documentURI;

      assertEquals("documentsetdocumenturi03","somestring",docURI);
       
},
/**
* 
	Set the strictErrorChecking attribute value on this documentNode to false and then to true.
	Call the createAttributeNS method on this document with an illegal character in the qualifiedName
	and check if the INVALID_CHARACTER_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-strictErrorChecking
*/
documentsetstricterrorchecking01 : function () {
   var success;
    if(checkInitialization(builder, "documentsetstricterrorchecking01") != null) return;
    var doc;
      var newAttr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.strictErrorChecking = false;

      doc.strictErrorChecking = true;

      
	{
		success = false;
		try {
            newAttr = doc.createAttributeNS("http://www.w3.org/DOM/Test","@");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("INVALID_CHARACTER_ERR_documentsetstricterrorchecking01",success);
	}

},
/**
* 
	Set the strictErrorChecking attribute value on a new Document to true.
	Call the createAttributeNS method on this document with a a null namespaceURI and a qualified name
	with a prefix and check if the NAMESPACE_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-strictErrorChecking
*/
documentsetstricterrorchecking02 : function () {
   var success;
    if(checkInitialization(builder, "documentsetstricterrorchecking02") != null) return;
    var doc;
      var newAttr;
      var nullValue = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.strictErrorChecking = true;

      
	{
		success = false;
		try {
            newAttr = doc.createAttributeNS(nullValue,"dom:test");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 14);
		}
		assertTrue("NAMESPACE_ERR_documentsetstricterrorchecking02",success);
	}

},
/**
* 
	Set the strictErrorChecking attribute value on a new Document to false and check if it was 
	correctly set using getStrictErrorChecking.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-strictErrorChecking
*/
documentsetstricterrorchecking03 : function () {
   var success;
    if(checkInitialization(builder, "documentsetstricterrorchecking03") != null) return;
    var doc;
      var strictErrorCheckingValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.strictErrorChecking = false;

      strictErrorCheckingValue = doc.strictErrorChecking;

      assertFalse("documentsetstricterrorchecking03",strictErrorCheckingValue);

},
/**
* 
	Set the standalone attribute of this document to true and verify if the attribute was correctly
	set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-standalone
*/
documentsetxmlstandalone01 : function () {
   var success;
    if(checkInitialization(builder, "documentsetxmlstandalone01") != null) return;
    var doc;
      var standalone;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.xmlStandalone = true;

      standalone = doc.xmlStandalone;

      assertTrue("documentsetxmlstandalone01",standalone);

},
/**
* 
	Create a new document object and set standalone to false and check if it was correctly set.
	Then repeat this by setting it to true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-standalone
*/
documentsetxmlstandalone02 : function () {
   var success;
    if(checkInitialization(builder, "documentsetxmlstandalone02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var standalone;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newDoc.xmlStandalone = false;

      standalone = newDoc.xmlStandalone;

      assertFalse("documentsetxmlstandalone02_false",standalone);
newDoc.xmlStandalone = true;

      standalone = newDoc.xmlStandalone;

      assertTrue("documentsetxmlstandalone02_true",standalone);

},
/**
* 
	Set the value of the version attribute of the XML declaration of this document to 
	various invalid characters and  verify if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-version
*/
documentsetxmlversion01 : function () {
   var success;
    if(checkInitialization(builder, "documentsetxmlversion01") != null) return;
    var doc;
      var versionValue;
      illegalVersion = new Array();
      illegalVersion[0] = "{";
      illegalVersion[1] = "}";
      illegalVersion[2] = "~";
      illegalVersion[3] = "'";
      illegalVersion[4] = "!";
      illegalVersion[5] = "@";
      illegalVersion[6] = "#";
      illegalVersion[7] = "$";
      illegalVersion[8] = "%";
      illegalVersion[9] = "^";
      illegalVersion[10] = "&";
      illegalVersion[11] = "*";
      illegalVersion[12] = "(";
      illegalVersion[13] = ")";
      illegalVersion[14] = "+";
      illegalVersion[15] = "=";
      illegalVersion[16] = "[";
      illegalVersion[17] = "]";
      illegalVersion[18] = "\\";
      illegalVersion[19] = "/";
      illegalVersion[20] = ";";
      illegalVersion[21] = "`";
      illegalVersion[22] = "<";
      illegalVersion[23] = ">";
      illegalVersion[24] = ",";
      illegalVersion[25] = "a ";
      illegalVersion[26] = "\"";
      illegalVersion[27] = "---";

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      for(var indexN10087 = 0;indexN10087 < illegalVersion.length; indexN10087++) {
      versionValue = illegalVersion[indexN10087];
      
	{
		success = false;
		try {
            doc.xmlVersion = versionValue;

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("NOT_SUPPORTED_ERR_documentsetversion01",success);
	}

	}
   
},
/**
* 
	Set the value of the version attribute of the XML declaration of a new document to "1.0"
	and check if it was correctly set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-version
*/
documentsetxmlversion02 : function () {
   var success;
    if(checkInitialization(builder, "documentsetxmlversion02") != null) return;
    var doc;
      var versionValue;
      var newDoc;
      var domImpl;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newDoc.xmlVersion = "1.0";

      versionValue = newDoc.xmlVersion;

      assertEquals("documentsetxmlversion02","1.0",versionValue);
       
},
/**
* 
	Set the value of the version attribute of the XML declaration of a new document to "1.0"
	and check if it was correctly set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-version
*/
documentsetxmlversion03 : function () {
   var success;
    if(checkInitialization(builder, "documentsetxmlversion03") != null) return;
    var doc;
      var versionValue;
      var newDoc;
      var domImpl;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      newDoc.xmlVersion = "1.1";

      versionValue = newDoc.xmlVersion;

      assertEquals("documentsetxmlversion03","1.1",versionValue);
       
},
/**
* 
	Set the value of the version attribute of the XML declaration of a new document to "-"
	and check if a NOT_SUPPORTED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-version
*/
documentsetxmlversion05 : function () {
   var success;
    if(checkInitialization(builder, "documentsetxmlversion05") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      
	{
		success = false;
		try {
            newDoc.xmlVersion = "-";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}

},
/**
* Checks behavior of "canonical-form" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-property
*/
domconfigcanonicalform1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigcanonicalform1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "cAnOnical-form";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertFalse("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertFalse("setTrueNotEffective",state);

		}
	domConfig.setParameter(parameter, false);
	 
},
/**
* Checks behavior of "cdata-sections" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigcdatasections1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigcdatasections1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "cDaTa-sections";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);
domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

},
/**
* Checks behavior of "check-character-normalization" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-check-character-normalization
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigcheckcharacternormalization1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigcheckcharacternormalization1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "cHeCk-character-normalization";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertFalse("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertFalse("setTrueNotEffective",state);

		}
	domConfig.setParameter(parameter, false);
	 
},
/**
* Checks behavior of "comments" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-comments
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfigcomments1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigcomments1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "cOmments";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);
domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

},
/**
* Checks behavior of "datatype-normalization" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfigdatatypenormalization1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigdatatypenormalization1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "dAtAtype-normalization";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertFalse("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertFalse("setTrueNotEffective",state);

		}
	domConfig.setParameter(parameter, false);
	 
},
/**
* Setting "datatype-normalization" to true also forces "validate" to true.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfigdatatypenormalization2 : function () {
   var success;
    if(checkInitialization(builder, "domconfigdatatypenormalization2") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "datatype-normalization";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      domConfig.setParameter("validate", false);
	 canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter("validate");
      assertTrue("validateSet",state);

	}
	
},
/**
* Checks behavior of "element-content-whitespace" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-element-content-whitespace
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigelementcontentwhitespace1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigelementcontentwhitespace1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "eLeMent-content-whitespace";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
canSet = domConfig.canSetParameter(parameter,false);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertTrue("setFalseNotEffective",state);

		}
	domConfig.setParameter(parameter, true);
	 
},
/**
* Checks behavior of "entities" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-entities
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigentities1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigentities1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "eNtIties";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);
domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

},

/**
* Checks behavior of "error-handler" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-error-handler
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=544
*/
domconfigerrorhandler1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigerrorhandler1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var origHandler;
      var state;
      var parameter = "eRrOr-handler";
      errorHandler = new DOMErrorHandlerN10049();
	  
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      origHandler = domConfig.getParameter(parameter);
      canSet = domConfig.canSetParameter(parameter,errorHandler);
      assertTrue("canSetNewHandler",canSet);
canSet = domConfig.canSetParameter(parameter,origHandler);
      assertTrue("canSetOrigHandler",canSet);
domConfig.setParameter(parameter, errorHandler.handleError);
	 state = domConfig.getParameter(parameter);
      assertSame("setToNewHandlerEffective",errorHandler,state);
domConfig.setParameter(parameter, origHandler.handleError);
	 state = domConfig.getParameter(parameter);
      assertSame("setToOrigHandlerEffective",origHandler,state);
canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 
	}
	
},
/**
* Calls DOMConfiguration.setParameter("error-handler", null).  Spec
    does not explicitly address the case.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-error-handler
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigerrorhandler2 : function () {
   var success;
    if(checkInitialization(builder, "domconfigerrorhandler2") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var errorHandler = null;

      var parameter = "error-handler";
      var state;
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter(parameter,errorHandler);
      assertTrue("canSetNull",canSet);
domConfig.setParameter(parameter, errorHandler.handleError);
	 state = domConfig.getParameter(parameter);
      assertNull("errorHandlerIsNull",state);
    
},
/**
* Checks behavior of "infoset" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-entities
*/
domconfiginfoset1 : function () {
   var success;
    if(checkInitialization(builder, "domconfiginfoset1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "iNfOset";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertFalse("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueIsEffective",state);
state = domConfig.getParameter("entities");
      assertFalse("entitiesSetFalse",state);
state = domConfig.getParameter("cdata-sections");
      assertFalse("cdataSectionsSetFalse",state);
domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertTrue("setFalseIsNoOp",state);
domConfig.setParameter("entities", true);
	 state = domConfig.getParameter(parameter);
      assertFalse("setEntitiesTrueInvalidatesInfoset",state);

},
/**
* Checks behavior of "namespace-declarations" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespace-declarations
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfignamespacedeclarations1 : function () {
   var success;
    if(checkInitialization(builder, "domconfignamespacedeclarations1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "nAmEspace-declarations";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);
domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

},
/**
* Checks behavior of "namespaces" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespaces
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfignamespaces1 : function () {
   var success;
    if(checkInitialization(builder, "domconfignamespaces1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "nAmEspaces";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
canSet = domConfig.canSetParameter(parameter,false);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertTrue("setFalseNotEffective",state);

		}
	domConfig.setParameter(parameter, true);
	 
},
/**
* Document.getParameter("namespaces") should be true regardles if the
    parse that created the document was namespace aware.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespaces
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfignamespaces2 : function () {
   var success;
    if(checkInitialization(builder, "domconfignamespaces2") != null) return;
    var doc;
      var domConfig;
      var state;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      state = domConfig.getParameter("namespaces");
      assertTrue("namespacesTrue",state);

},
/**
* Checks behavior of "normalize-characters" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfignormalizecharacters1 : function () {
   var success;
    if(checkInitialization(builder, "domconfignormalizecharacters1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "nOrMalize-characters";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertFalse("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertFalse("setTrueNotEffective",state);

		}
	domConfig.setParameter(parameter, false);
	 
},
/**
* Checks getParameterNames and canSetParameter for Document.domConfig.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-domConfig
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-parameterNames
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-canonical-form
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-check-character-normalization
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-comments
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-datatype-normalization
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-entities
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-error-handler
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespaces
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespace-declarations
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-split-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-validate
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-validate-if-schema
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-well-formed
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-element-content-whitespace
*/
domconfigparameternames01 : function () {
   var success;
    if(checkInitialization(builder, "domconfigparameternames01") != null) return;
    var domImpl;
      var doc;
      var config;
      var state;
      var parameterNames;
      var parameterName;
      var matchCount = 0;
      var paramValue;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      config = doc.domConfig;

      assertNotNull("configNotNull",config);
parameterNames = config.parameterNames;

      assertNotNull("parameterNamesNotNull",parameterNames);
for(var indexN1008C = 0;indexN1008C < parameterNames.length; indexN1008C++) {
      parameterName = parameterNames.item(indexN1008C);
      paramValue = config.getParameter(parameterName);
      canSet = config.canSetParameter(parameterName,paramValue);
      assertTrue("canSetToDefaultValue",canSet);
config.setParameter(parameterName, paramValue);
	 
	if(
	
	(("canonical-form".toUpperCase() == parameterName.toUpperCase()) || ("cdata-sections".toUpperCase() == parameterName.toUpperCase()) || ("check-character-normalization".toUpperCase() == parameterName.toUpperCase()) || ("comments".toUpperCase() == parameterName.toUpperCase()) || ("datatype-normalization".toUpperCase() == parameterName.toUpperCase()) || ("entities".toUpperCase() == parameterName.toUpperCase()) || ("error-handler".toUpperCase() == parameterName.toUpperCase()) || ("infoset".toUpperCase() == parameterName.toUpperCase()) || ("namespaces".toUpperCase() == parameterName.toUpperCase()) || ("namespace-declarations".toUpperCase() == parameterName.toUpperCase()) || ("normalize-characters".toUpperCase() == parameterName.toUpperCase()) || ("split-cdata-sections".toUpperCase() == parameterName.toUpperCase()) || ("validate".toUpperCase() == parameterName.toUpperCase()) || ("validate-if-schema".toUpperCase() == parameterName.toUpperCase()) || ("well-formed".toUpperCase() == parameterName.toUpperCase()) || ("element-content-whitespace".toUpperCase() == parameterName.toUpperCase()))

	) {
	matchCount += 1;

	}
	
	}
   assertEquals("definedParameterCount",16,matchCount);
       
},
/**
* Checks behavior of "schema-location" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-schema-location
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigschemalocation1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigschemalocation1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "sChEma-location";
      var nullSchemaLocation = null;

      var sampleSchemaLocation = "http://www.example.com/schemas/sampleschema.xsd";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter(parameter,true);
      assertFalse("canSetTrue",canSet);

      try {
      state = domConfig.getParameter(parameter);
      assertNull("defaultSchemaLocation",state);
    
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        canSet = domConfig.canSetParameter(parameter,sampleSchemaLocation);
      assertTrue("canSetURI",canSet);
canSet = domConfig.canSetParameter(parameter,nullSchemaLocation);
      assertTrue("canSetNull",canSet);
domConfig.setParameter(parameter, sampleSchemaLocation);
	 state = domConfig.getParameter(parameter);
      assertEquals("setURIEffective",sampleSchemaLocation,state);
       domConfig.setParameter(parameter, nullSchemaLocation);
	 state = domConfig.getParameter(parameter);
      assertNull("setNullEffective",state);
    
},
/**
* Checks behavior of "schema-type" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-schema-type
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigschematype1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigschematype1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "sChEma-type";
      var xmlSchemaType = "http://www.w3.org/2001/XMLSchema";
      var dtdType = "http://www.w3.org/TR/REC-xml";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter(parameter,true);
      assertFalse("canSetTrue",canSet);

      try {
      state = domConfig.getParameter(parameter);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        canSet = domConfig.canSetParameter(parameter,dtdType);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, dtdType);
	 state = domConfig.getParameter(parameter);
      assertEquals("setDTDEffective",dtdType,state);
       
	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, dtdType);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_dtd",success);
	}

		}
	canSet = domConfig.canSetParameter(parameter,xmlSchemaType);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, xmlSchemaType);
	 state = domConfig.getParameter(parameter);
      assertEquals("setSchemaEffective",xmlSchemaType,state);
       
	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, xmlSchemaType);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_schema",success);
	}

		}
	
},
/**
* Checks behavior of "split-cdata-sections" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-split-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigsplitcdatasections1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigsplitcdatasections1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "sPlIt-cdata-sections";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);
domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

},
/**
* 
	The parameter commments is turned on by default.  Check to see if this feature can be set
	to false by invoking canSetParameter method.  Also check that this method does not change the
	value of parameter.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-canSetParameter
*/
domconfigurationcansetparameter01 : function () {
   var success;
    if(checkInitialization(builder, "domconfigurationcansetparameter01") != null) return;
    var doc;
      var domConfig;
      var canSet;
      var newCommentNode;
      var docElem;
      var appendedChild;
      var lastChild;
      var commentValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      newCommentNode = doc.createComment("This is a new Comment node");
      docElem = doc.documentElement;

      appendedChild = docElem.appendChild(newCommentNode);
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("comments",false);
      assertTrue("domconfigurationcansetparameter01",canSet);
doc.normalizeDocument();
      lastChild = docElem.lastChild;

      commentValue = lastChild.nodeValue;

      assertEquals("domconfigurationsetparameter02_2","This is a new Comment node",commentValue);
       
},
/**
* 
	The canSetParameter method checks if setting a parameter to a specific value is supported.
	
	The parameter cdata-section is turned on by default.  Check to see if this feature can be set
	to false by invoking canSetParameter method.  Also check that this method does not change the
	value of parameter by checking if the two cdata-section nodes still exist in the document.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfigurationcansetparameter02 : function () {
   var success;
    if(checkInitialization(builder, "domconfigurationcansetparameter02") != null) return;
    var doc;
      var domConfig;
      var strongList;
      var childList;
      var strongElem;
      var cdata1;
      var cdata2;
      var nodeType;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("cdata-sections",false);
      assertTrue("domconfigurationcansetparameter02_1",canSet);
doc.normalizeDocument();
      strongList = doc.getElementsByTagNameNS("*","strong");
      strongElem = strongList.item(1);
      childList = strongElem.childNodes;

      cdata1 = childList.item(1);
      nodeType = cdata1.nodeType;

      assertEquals("domconfigurationcansetparameter02_2",4,nodeType);
       cdata2 = childList.item(3);
      nodeType = cdata2.nodeType;

      assertEquals("domconfigurationcansetparameter02_3",4,nodeType);
       
},
/**
* 
	The canSetParameter method checks if setting a parameter to a specific value is supported.
	
	The parameter entities is turned on by default.  Check to see if this feature can be set
	to false by invoking canSetParameter method.  Also check that this method does not change the
	value of parameter by checking if entities still exist in the document.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfigurationcansetparameter03 : function () {
   var success;
    if(checkInitialization(builder, "domconfigurationcansetparameter03") != null) return;
    var doc;
      var domConfig;
      var docType;
      var entitiesMap;
      var nullNS = null;

      var entity;
      var entityName;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("entities",false);
      assertTrue("domconfigurationcansetparameter03_1",canSet);
doc.normalizeDocument();
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItemNS(nullNS,"epsilon");
      entityName = entity.nodeName;

      assertEquals("domconfigurationcansetparameter03_2","epsilon",entityName);
       
},
/**
* 
	The canSetParameter method checks if setting a parameter to a specific value is supported.
	
	The parameter entities is turned on by default.  Check to see if this feature can be set
	to false by invoking canSetParameter method.  Also check that this method does not change the
	value of parameter by checking if entity references still exist in the document.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfigurationcansetparameter04 : function () {
   var success;
    if(checkInitialization(builder, "domconfigurationcansetparameter04") != null) return;
    var doc;
      var domConfig;
      var acronymList;
      var acronymElem;
      var nodeType;
      var first;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("entities",false);
      assertTrue("domconfigurationcansetparameter04_1",canSet);
doc.normalizeDocument();
      acronymList = doc.getElementsByTagNameNS("*","acronym");
      acronymElem = acronymList.item(1);
      first = acronymElem.firstChild;

      nodeType = first.nodeType;

      assertEquals("domconfigurationcansetparameter04_2",5,nodeType);
       
},
/**
* 
	The canSetParameter method checks if setting a parameter to a specific value is supported.
	
	The parameter element-content-whitespace is turned on by default. Set this parameter to false will
	discard all Text nodes that contain whitespaces in element content, as described in [element content whitespace].
	Check to see if this feature can be set	to false by invoking canSetParameter method.  Verify that the text node
	still exist after invoking canSetParameter.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration
*/
domconfigurationcansetparameter06 : function () {
   var success;
    if(checkInitialization(builder, "domconfigurationcansetparameter06") != null) return;
    var doc;
      var domConfig;
      var itemList;
      var elementStrong;
      var textNode;
      var canSet;
      var hasWhitespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("element-content-whitespace",true);
      assertTrue("domconfigurationcansetparameter06_1",canSet);
itemList = doc.getElementsByTagNameNS("*","strong");
      elementStrong = itemList.item(0);
      textNode = elementStrong.firstChild;

      textNode.textContent = "                                                ";

      hasWhitespace = textNode.isElementContentWhitespace;

      assertTrue("domconfigurationsetparameter06_2",hasWhitespace);
doc.normalizeDocument();
      itemList = doc.getElementsByTagNameNS("*","strong");
      elementStrong = itemList.item(0);
      textNode = elementStrong.firstChild;

      hasWhitespace = textNode.isElementContentWhitespace;

      assertTrue("domconfigurationsetparameter06_3",hasWhitespace);

},
/**
* 
	The method getParameter returns the value of a parameter if known. 
	
	Get the DOMConfiguration object of a document and verify that the default required features are set
	to true.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
*/
domconfigurationgetparameter01 : function () {
   var success;
    if(checkInitialization(builder, "domconfigurationgetparameter01") != null) return;
    var doc;
      var domConfig;
      var param;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      param = domConfig.getParameter("comments");
      assertTrue("domconfigurationgetparameter01_1",param);
param = domConfig.getParameter("cdata-sections");
      assertTrue("domconfigurationgetparameter01_2",param);
param = domConfig.getParameter("entities");
      assertTrue("domconfigurationgetparameter01_3",param);
param = domConfig.getParameter("namespace-declarations");
      assertTrue("domconfigurationgetparameter01_4",param);
param = domConfig.getParameter("infoset");
      assertFalse("domconfigurationgetparameter01_5",param);

},
/**
* 
	The method getParameter returns the value of a parameter if known. 
	
	Get the DOMConfiguration object of a document and verify that a NOT_FOUND_ERR is thrown if the parameter
	is not found.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
*/
domconfigurationgetparameter02 : function () {
   var success;
    if(checkInitialization(builder, "domconfigurationgetparameter02") != null) return;
    var doc;
      var domConfig;
      var param;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      
	{
		success = false;
		try {
            param = domConfig.getParameter("not-found-param");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("domconfigurationgetparameter02_NOT_FOUND_ERR",success);
	}

},
/**
* Checks behavior of "validate" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-validate
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigvalidate1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigvalidate1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "vAlIdate";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertFalse("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertFalse("setTrueNotEffective",state);

		}
	domConfig.setParameter(parameter, false);
	 
},
/**
* Checks behavior of "validate-if-schema" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-validate-if-schema
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigvalidateifschema1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigvalidateifschema1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "vAlIdate-if-schema";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertFalse("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,false);
      assertTrue("canSetFalse",canSet);
canSet = domConfig.canSetParameter(parameter,true);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, true);
	 state = domConfig.getParameter(parameter);
      assertTrue("setTrueEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertFalse("setTrueNotEffective",state);

		}
	domConfig.setParameter(parameter, false);
	 
},
/**
* Checks behavior of "well-formed" configuration parameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-well-formed
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-getParameter
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-setParameter
*/
domconfigwellformed1 : function () {
   var success;
    if(checkInitialization(builder, "domconfigwellformed1") != null) return;
    var domImpl;
      var doc;
      var domConfig;
      var nullDocType = null;

      var canSet;
      var state;
      var parameter = "wElL-formed";
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      domConfig = doc.domConfig;

      state = domConfig.getParameter(parameter);
      assertTrue("defaultFalse",state);
canSet = domConfig.canSetParameter(parameter,true);
      assertTrue("canSetTrue",canSet);
canSet = domConfig.canSetParameter(parameter,false);
      
	if(
	canSet
	) {
	domConfig.setParameter(parameter, false);
	 state = domConfig.getParameter(parameter);
      assertFalse("setFalseEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            domConfig.setParameter(parameter, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR",success);
	}
state = domConfig.getParameter(parameter);
      assertTrue("setFalseNotEffective",state);

		}
	domConfig.setParameter(parameter, true);
	 
},
/**
* 
	Invoke getFeature method on this DOMImplementation with the value of the feature parameter
	as Core and version as 2.0.  This should return a DOMImplmentation object that's not null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMImplementation3-getFeature
*/
domimplementationgetfeature01 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationgetfeature01") != null) return;
    var doc;
      var domImpl;
      var domImplReturned;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
domImplReturned = domImpl.getFeature("Core","2.0");
      assertNotNull("domimplementationgetfeature01",domImplReturned);

},
/**
* 
	Invoke getFeature method on this DOMImplementation with the value of the feature parameter
	as Core and version as "".  This should return a DOMImplementation object that's not null.
	

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMImplementation3-getFeature
*/
domimplementationgetfeature02 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationgetfeature02") != null) return;
    var doc;
      var domImpl;
      var domImplReturned;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
domImplReturned = domImpl.getFeature("Core","");
      assertNotNull("domimplementationgetfeature02",domImplReturned);

},
/**
* 
	Invoke getFeature method on this DOMImplementation with the value of the feature parameter
	as Core and version as null.  This should return a DOMImplementation object that's not null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMImplementation3-getFeature
*/
domimplementationgetfeature03 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationgetfeature03") != null) return;
    var doc;
      var domImpl;
      var domImplReturned;
      var nodeName;
      var nullVersion = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
domImplReturned = domImpl.getFeature("Core",nullVersion);
      assertNotNull("domimplementationgetfeature03",domImplReturned);

},
/**
* 
	Invoke getFeature method on this DOMImplementation with the value of the feature parameter
	as "" and version equal to null.  This should return a null DOMObject.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMImplementation3-getFeature
*/
domimplementationgetfeature05 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationgetfeature05") != null) return;
    var doc;
      var domImpl;
      var domImplReturned;
      var nullVersion = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
domImplReturned = domImpl.getFeature("",nullVersion);
      assertNull("domimplementationgetFeature05",domImplReturned);
    
},
/**
* 
	Invoke getFeature method on this DOMImplementation with the value of the feature parameter
	as "1-1" (some junk) and version equal to "*".  This should return a null DOMObject.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMImplementation3-getFeature
*/
domimplementationgetfeature06 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationgetfeature06") != null) return;
    var doc;
      var domImpl;
      var domImplReturned;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
domImplReturned = domImpl.getFeature("1-1","*");
      assertNull("domimplementationgetfeature06",domImplReturned);
    
},
/**
* 
DOMImplementationRegistry.newInstance() (Java) or DOMImplementationRegistry global variable
(ECMAScript) should not be null.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
*/
domimplementationregistry01 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry01") != null) return;
    var domImplRegistry;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);

},
/**
* 
DOMImplementationRegistry.getDOMImplementation("cOrE") should return a DOMImplementation
where hasFeature("Core", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry02 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry02") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("cOrE");
         assertNotNull("domImplNotNull",domImpl);
hasFeature = domImpl.hasFeature("Core",nullVersion);
assertTrue("hasCore",hasFeature);

},
/**
* 
DOMImplementationRegistry.getDOMImplementation("cOrE 3.0") should return a DOMImplementation
where hasFeature("Core", "3.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry03 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry03") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("cOrE 3.0");
         assertNotNull("domImplNotNull",domImpl);
hasFeature = domImpl.hasFeature("Core","3.0");
assertTrue("hasCore",hasFeature);

},
/**
* 
DOMImplementationRegistry.getDOMImplementation("+cOrE") should return a DOMImplementation
where hasFeature("+Core", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry04 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry04") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("+cOrE");
         assertNotNull("domImplNotNull",domImpl);
hasFeature = domImpl.hasFeature("+Core",nullVersion);
assertTrue("hasCore",hasFeature);

},
/**
* 
DOMImplementationRegistry.getDOMImplementation("+cOrE 3.0") should return a DOMImplementation
where hasFeature("+Core", "3.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry05 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry05") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("+cOrE 3.0");
         assertNotNull("domImplNotNull",domImpl);
hasFeature = domImpl.hasFeature("+Core","3.0");
assertTrue("hasCore",hasFeature);

},
/**
* 
If the implementation supports "XML", DOMImplementationRegistry.getDOMImplementation("xMl 3.0 cOrE") should 
return a DOMImplementation where hasFeature("XML", "3.0"), and hasFeature("Core", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry06 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry06") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("xMl 3.0 cOrE");
         assertNotNull("domImplNotNull",domImpl);
hasFeature = domImpl.hasFeature("XML","3.0");
assertTrue("hasXML3",hasFeature);
hasFeature = domImpl.hasFeature("Core",nullVersion);
assertTrue("hasCore",hasFeature);

},
/**
* 
DOMImplementationRegistry.getDOMImplementation("http://www.example.com/bogus-feature 99.0") should return 
null.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry07 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry07") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("http://www.example.com/bogus-feature 99.0");
         assertNull("domImplNull",domImpl);
    
},
/**
* 
DOMImplementationRegistry.getDOMImplementation("SVG") should return null or a DOMImplementation
where hasFeature("SVG", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry08 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry08") != null) return;
    var domImplRegistry;
      var domImpl;
      var baseImpl;
      var hasFeature;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("SVG");
         
	if(
	
	(domImpl == null)

	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("SVG",null);
assertFalse("baseImplSupportsSVG",hasFeature);

	}
	
		else {
			hasFeature = domImpl.hasFeature("SVG",nullVersion);
assertTrue("hasCore",hasFeature);

		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementation("HTML") should return null or a DOMImplementation
where hasFeature("HTML", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry09 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry09") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var baseImpl;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("HTML");
         
	if(
	
	(domImpl == null)

	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("HTML",nullVersion);
assertFalse("baseImplSupportsHTML",hasFeature);

	}
	
		else {
			hasFeature = domImpl.hasFeature("HTML",nullVersion);
assertTrue("hasCore",hasFeature);

		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementation("LS") should return null or a DOMImplementation
where hasFeature("LS", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry10 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry10") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var baseImpl;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("LS");
         
	if(
	
	(domImpl == null)

	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("LS",nullVersion);
assertFalse("baseImplSupportsLS",hasFeature);

	}
	
		else {
			hasFeature = domImpl.hasFeature("LS",nullVersion);
assertTrue("hasCore",hasFeature);

		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementation("XPath") should return null or a DOMImplementation
where hasFeature("XPath", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry11 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry11") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var baseImpl;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("XPath");
         
	if(
	
	(domImpl == null)

	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("XPath",nullVersion);
assertFalse("baseImplSupportsLS",hasFeature);

	}
	
		else {
			hasFeature = domImpl.hasFeature("XPath",nullVersion);
assertTrue("hasCore",hasFeature);

		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementation("cOrE 3.0 xMl 3.0 eVeNts 2.0 lS") should return null 
or a DOMImplementation that implements the specified features.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpl
*/
domimplementationregistry12 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry12") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasCore;
      var hasXML;
      var hasEvents;
      var hasLS;
      var baseImpl;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("cOrE 3.0 xMl 3.0 eVeNts 2.0 lS");
         
	if(
	
	(domImpl == null)

	) {
	baseImpl = getImplementation();
hasCore = baseImpl.hasFeature("Core","3.0");
hasXML = baseImpl.hasFeature("XML","3.0");
hasEvents = baseImpl.hasFeature("Events","2.0");
hasLS = baseImpl.hasFeature("LS",nullVersion);

			{
			assertFalse("baseImplFeatures",
	(hasCore && hasXML && hasEvents && hasLS)
);

	}
	}
		else {
			hasCore = domImpl.hasFeature("Core","3.0");
assertTrue("hasCore",hasCore);
hasXML = domImpl.hasFeature("XML","3.0");
assertTrue("hasXML",hasXML);
hasEvents = domImpl.hasFeature("Events","2.0");
assertTrue("hasEvents",hasEvents);
hasLS = domImpl.hasFeature("LS",nullVersion);
assertTrue("hasLS",hasLS);

		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("cOrE") should return a 
list of at least one DOMImplementation
where hasFeature("Core", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMImplementationList-item
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMImplementationList-length
*/
domimplementationregistry13 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry13") != null) return;
    var domImplRegistry;
      var hasFeature;
      var domImpl;
      var domImplList;
      var length;
      var nullVersion = null;

      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("cOrE");
         length = domImplList.length;

      domImpl = domImplList.item(length);
      assertNull("item_Length_shouldBeNull",domImpl);
    	assertTrue("atLeastOne",
      
	(length > 0)
);
for(var indexN10067 = 0;indexN10067 < domImplList.length; indexN10067++) {
      domImpl = domImplList.item(indexN10067);
      hasFeature = domImpl.hasFeature("Core",nullVersion);
assertTrue("hasCore",hasFeature);

	}
   
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("cOrE 3.0") should return 
a list of DOMImplementation
where hasFeature("Core", "3.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry14 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry14") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("cOrE 3.0");
         length = domImplList.length;

      	assertTrue("atLeastOne",
      
	(length > 0)
);
for(var indexN10052 = 0;indexN10052 < domImplList.length; indexN10052++) {
      domImpl = domImplList.item(indexN10052);
      hasFeature = domImpl.hasFeature("Core","3.0");
assertTrue("hasCore",hasFeature);

	}
   
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("+cOrE") should return 
list of DOMImplementation
where hasFeature("+Core", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry15 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry15") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var nullVersion = null;

      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("+cOrE");
         length = domImplList.length;

      	assertTrue("atLeastOne",
      
	(length > 0)
);
for(var indexN10057 = 0;indexN10057 < domImplList.length; indexN10057++) {
      domImpl = domImplList.item(indexN10057);
      hasFeature = domImpl.hasFeature("+Core",nullVersion);
assertTrue("hasCore",hasFeature);

	}
   
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("+cOrE 3.0") should return 
a list of DOMImplementation
where hasFeature("+Core", "3.0") returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry16 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry16") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("+cOrE 3.0");
         length = domImplList.length;

      	assertTrue("atLeastOne",
      
	(length > 0)
);
for(var indexN10052 = 0;indexN10052 < domImplList.length; indexN10052++) {
      domImpl = domImplList.item(indexN10052);
      hasFeature = domImpl.hasFeature("+Core","3.0");
assertTrue("hasCore",hasFeature);

	}
   
},
/**
* 
If the implementation supports "XML", DOMImplementationRegistry.getDOMImplementationList("xMl 3.0 cOrE") should 
return a list of DOMImplementation where hasFeature("XML", "3.0"), and hasFeature("Core", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry17 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry17") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var nullVersion = null;

      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("xMl 3.0 cOrE");
         length = domImplList.length;

      	assertTrue("atLeastOne",
      
	(length > 0)
);
for(var indexN1005A = 0;indexN1005A < domImplList.length; indexN1005A++) {
      domImpl = domImplList.item(indexN1005A);
      hasFeature = domImpl.hasFeature("XML","3.0");
assertTrue("hasXML3",hasFeature);
hasFeature = domImpl.hasFeature("Core",nullVersion);
assertTrue("hasCore",hasFeature);

	}
   
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("http://www.example.com/bogus-feature 99.0") 
should return a zero-length list.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry18 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry18") != null) return;
    var domImplRegistry;
      var domImpl;
      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("http://www.example.com/bogus-feature 99.0");
         length = domImplList.length;

      assertEquals("emptyList",0,length);
       
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("SVG") should return 
zero-length list or a list of DOMImplementation
where hasFeature("SVG", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry19 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry19") != null) return;
    var domImplRegistry;
      var domImpl;
      var baseImpl;
      var hasFeature;
      var nullVersion = null;

      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("SVG");
         length = domImplList.length;

      
	if(
	(0 == length)
	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("SVG",null);
assertFalse("baseImplSupportsSVG",hasFeature);

	}
	
		else {
			for(var indexN10067 = 0;indexN10067 < domImplList.length; indexN10067++) {
      domImpl = domImplList.item(indexN10067);
      hasFeature = domImpl.hasFeature("SVG",nullVersion);
assertTrue("hasCore",hasFeature);

	}
   
		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("HTML") should return 
an empty list or a list of DOMImplementation
where hasFeature("HTML", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry20 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry20") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var baseImpl;
      var nullVersion = null;

      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("HTML");
         length = domImplList.length;

      
	if(
	(0 == length)
	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("HTML",nullVersion);
assertFalse("baseImplSupportsHTML",hasFeature);

	}
	
		else {
			for(var indexN10068 = 0;indexN10068 < domImplList.length; indexN10068++) {
      domImpl = domImplList.item(indexN10068);
      hasFeature = domImpl.hasFeature("HTML",nullVersion);
assertTrue("hasCore",hasFeature);

	}
   
		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("LS") should return 
a empty list or a list of DOMImplementation
where hasFeature("LS", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry21 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry21") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var baseImpl;
      var nullVersion = null;

      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("LS");
         length = domImplList.length;

      
	if(
	(0 == length)
	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("LS",nullVersion);
assertFalse("baseImplSupportsLS",hasFeature);

	}
	
		else {
			for(var indexN10068 = 0;indexN10068 < domImplList.length; indexN10068++) {
      domImpl = domImplList.item(indexN10068);
      hasFeature = domImpl.hasFeature("LS",nullVersion);
assertTrue("hasCore",hasFeature);

	}
   
		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("XPath") should return 
an empty list or a list of DOMImplementation
where hasFeature("XPath", null) returns true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry22 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry22") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasFeature;
      var baseImpl;
      var nullVersion = null;

      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("XPath");
         length = domImplList.length;

      
	if(
	(0 == length)
	) {
	baseImpl = getImplementation();
hasFeature = hasFeature("XPath",nullVersion);
assertFalse("baseImplSupportsLS",hasFeature);

	}
	
		else {
			for(var indexN10068 = 0;indexN10068 < domImplList.length; indexN10068++) {
      domImpl = domImplList.item(indexN10068);
      hasFeature = domImpl.hasFeature("XPath",nullVersion);
assertTrue("hasCore",hasFeature);

	}
   
		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("cOrE 3.0 xMl 3.0 eVeNts 2.0 lS") 
should return an empty list or a list of DOMImplementation that implements the specified features.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
*/
domimplementationregistry23 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry23") != null) return;
    var domImplRegistry;
      var domImpl;
      var hasCore;
      var hasXML;
      var hasEvents;
      var hasLS;
      var baseImpl;
      var nullVersion = null;

      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("cOrE 3.0 xMl 3.0 eVeNts 2.0 lS");
         length = domImplList.length;

      
	if(
	(0 == length)
	) {
	baseImpl = getImplementation();
hasCore = baseImpl.hasFeature("Core","3.0");
hasXML = baseImpl.hasFeature("XML","3.0");
hasEvents = baseImpl.hasFeature("Events","2.0");
hasLS = baseImpl.hasFeature("LS",nullVersion);

			{
			assertFalse("baseImplFeatures",
	(hasCore && hasXML && hasEvents && hasLS)
);

	}
	}
		else {
			for(var indexN10096 = 0;indexN10096 < domImplList.length; indexN10096++) {
      domImpl = domImplList.item(indexN10096);
      hasCore = domImpl.hasFeature("Core","3.0");
assertTrue("hasCore",hasCore);
hasXML = domImpl.hasFeature("XML","3.0");
assertTrue("hasXML",hasXML);
hasEvents = domImpl.hasFeature("Events","2.0");
assertTrue("hasEvents",hasEvents);
hasLS = domImpl.hasFeature("LS",nullVersion);
assertTrue("hasLS",hasLS);

	}
   
		}
	
},
/**
* 
DOMImplementationRegistry.getDOMImplementation("") should return an implementation.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
* @see http://lists.w3.org/Archives/Public/www-dom/2004JanMar/0111.html
*/
domimplementationregistry24 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry24") != null) return;
    var domImplRegistry;
      var domImpl;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImpl = domImplRegistry.getDOMImplementation("");
         assertNotNull("domImplNotNull",domImpl);

},
/**
* 
DOMImplementationRegistry.getDOMImplementationList("cOrE 3.0 xMl 3.0 eVeNts 2.0 lS") 
should return an empty list or a list of DOMImplementation that implements the specified features.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/java-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/ecma-script-binding
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-getDOMImpls
* @see http://lists.w3.org/Archives/Public/www-dom/2004JanMar/0111.html
*/
domimplementationregistry25 : function () {
   var success;
    if(checkInitialization(builder, "domimplementationregistry25") != null) return;
    var domImplRegistry;
      var domImplList;
      var length;
      domImplRegistry = DOMImplementationRegistry;
         assertNotNull("domImplRegistryNotNull",domImplRegistry);
domImplList = domImplRegistry.getDOMImplementationList("");
         length = domImplList.length;

      	assertTrue("atLeastOne",
      
	(length > 0)
);

},
/**
* 
Check implementation of DOMStringList.contains by searching DOMConfig parameter
names for "comments" and "".

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMStringList-contains
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-parameterNames
*/
domstringlistcontains01 : function () {
   var success;
    if(checkInitialization(builder, "domstringlistcontains01") != null) return;
    var doc;
      var paramList;
      var domConfig;
      var contains;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      paramList = domConfig.parameterNames;

      contains = paramList.contains("comments");
      assertTrue("paramsContainComments",contains);
contains = paramList.contains("");
      assertFalse("paramsDoesntContainEmpty",contains);

},
/**
* 
	The contains method of the DOMStringList tests if a string is part of this DOMStringList.  
	
	Invoke the contains method on the list searching for several of the parameters recognized by the 
        DOMConfiguration object.  
	Verify that the list contains features that are required and supported by this DOMConfiguration object.
        Verify that the contains method returns false for a string that is not contained in this DOMStringList. 

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMStringList-contains
*/
domstringlistcontains02 : function () {
   var success;
    if(checkInitialization(builder, "domstringlistcontains02") != null) return;
    var doc;
      var paramList;
      var domConfig;
      var contain;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      paramList = domConfig.parameterNames;

      contain = paramList.contains("comments");
      assertTrue("domstringlistcontains02_1",contain);
contain = paramList.contains("cdata-sections");
      assertTrue("domstringlistcontains02_2",contain);
contain = paramList.contains("entities");
      assertTrue("domstringlistcontains02_3",contain);
contain = paramList.contains("error-handler");
      assertTrue("domstringlistcontains02_4",contain);
contain = paramList.contains("infoset");
      assertTrue("domstringlistcontains02_5",contain);
contain = paramList.contains("namespace-declarations");
      assertTrue("domstringlistcontains02_6",contain);
contain = paramList.contains("element-content-whitespace");
      assertTrue("domstringlistcontains02_7",contain);
contain = paramList.contains("test");
      assertFalse("domstringlistcontains02_8",contain);

},
/**
* 
	The length attribute of the DOMStringList returns the number of DOMStrings in the list. 
	The range of valid child node indices is 0 to length-1 inclusive.

	Invoke the length on the list of parameters returned by the DOMConfiguration object.  
	Verify that the list is not null and length is not 0.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMStringList-length
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-parameterNames
*/
domstringlistgetlength01 : function () {
   var success;
    if(checkInitialization(builder, "domstringlistgetlength01") != null) return;
    var doc;
      var paramList;
      var domConfig;
      var listSize;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      paramList = domConfig.parameterNames;

      assertNotNull("domstringlistgetlength01_notNull",paramList);
listSize = paramList.length;

      assert("domstringlistgetlength01_notZero",0 != listSize);
      
},
/**
* 
Check implementation of DOMStringList.item by accessing items 0 and length-1 and expecting
a string and accessing items out of range and expecting null.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMStringList-item
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMConfiguration-parameterNames
*/
domstringlistitem01 : function () {
   var success;
    if(checkInitialization(builder, "domstringlistitem01") != null) return;
    var doc;
      var paramList;
      var domConfig;
      var contains;
      var length;
      var index;
      var parameter;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      paramList = domConfig.parameterNames;

      length = paramList.length;

      parameter = paramList.item(0);
      assertNotNull("item0NotNull",parameter);
parameter = paramList.item(length);
      assertNull("itemLengthNull",parameter);
    length -= 1;
parameter = paramList.item(length);
      assertNotNull("itemLengthMinus1NotNull",parameter);

},
/**
* 
	The item method of the DOMStringList Returns the indexth item in the collection. 
	If index is greater than or equal to the number of DOMStrings in the list, this returns null.
	
	Invoke the first item on the list of parameters returned by the DOMConfiguration object and
	make sure it is not null.  Then invoke the 100th item and verify that null is returned.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#DOMStringList-item
*/
domstringlistitem02 : function () {
   var success;
    if(checkInitialization(builder, "domstringlistitem02") != null) return;
    var doc;
      var paramList;
      var domConfig;
      var listSize;
      var retStr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      paramList = domConfig.parameterNames;

      retStr = paramList.item(0);
      assertNotNull("domstringlistitem02_notNull",retStr);
retStr = paramList.item(100);
      assertNull("domstringlistitem02_null",retStr);
    
},
/**
* 
Normalize document with element-content-whitespace set to true and validation set to true, check that
whitespace in element content is preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-element-content-whitespace
*/
elementcontentwhitespace01 : function () {
   var success;
    if(checkInitialization(builder, "elementcontentwhitespace01") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var text;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("element-content-whitespace", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 
	if(
	(getImplementationAttribute("ignoringElementContentWhitespace") == true)
	) {
	bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      text = doc.createTextNode("    ");
      child = body.insertBefore(text,child);
      
	}
	doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      assertNotNull("firstChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChild","#text",childName);
       child = child.nextSibling;

      assertNotNull("secondChildNotNull",child);
childName = child.nodeName;

      assertEquals("secondChild","p",childName);
       
},
/**
* 
Normalize document with element-content-whitespace set to false and validation set to true, check that
whitespace in element content is eliminated.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-element-content-whitespace
*/
elementcontentwhitespace02 : function () {
   var success;
    if(checkInitialization(builder, "elementcontentwhitespace02") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("element-content-whitespace",false);
      canSetValidate = domConfig.canSetParameter("validate",true);
      
	if(
	
	(canSetValidate && canSet)

	) {
	domConfig.setParameter("element-content-whitespace", false);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      assertNotNull("firstChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChild","p",childName);
       child = child.nextSibling;

      assertNull("secondChild",child);
    
	}
	
},
/**
* 
Normalize document using Node.normalize with element-content-whitespace set to false and validation set to true, check that
whitespace in element content is preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-element-content-whitespace
*/
elementcontentwhitespace03 : function () {
   var success;
    if(checkInitialization(builder, "elementcontentwhitespace03") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var text;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      
	if(
	(getImplementationAttribute("ignoringElementContentWhitespace") == true)
	) {
	bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      text = doc.createTextNode("    ");
      child = body.insertBefore(text,child);
      
	}
	canSet = domConfig.canSetParameter("element-content-whitespace",false);
      
	if(
	canSet
	) {
	domConfig.setParameter("element-content-whitespace", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      assertNotNull("firstChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChild","#text",childName);
       child = child.nextSibling;

      assertNotNull("secondChildNotNull",child);
childName = child.nodeName;

      assertEquals("secondChild","p",childName);
       
	}
	
},
/**
* 
Call getSchemaTypeInfo on title attribute for the first "em" element from DTD validated document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Element-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
elementgetschematypeinfo01 : function () {
   var success;
    if(checkInitialization(builder, "elementgetschematypeinfo01") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var typeNS;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertNull("nameIsNull",typeName);
    typeNS = typeInfo.typeNamespace;

      assertNull("nsIsNull",typeNS);
    
},
/**
* 
Call getSchemaTypeInfo on title attribute for the first "em" element from schema-validated document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Element-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
elementgetschematypeinfo02 : function () {
   var success;
    if(checkInitialization(builder, "elementgetschematypeinfo02") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var typeNS;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsEmType","emType",typeName);
       typeNS = typeInfo.typeNamespace;

      assertEquals("nsIsXML","http://www.w3.org/1999/xhtml",typeNS);
       
},
/**
* 
Element.schemaTypeInfo should return null if not validating or schema validating.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Element-schemaTypeInfo
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
elementgetschematypeinfo03 : function () {
   var success;
    if(checkInitialization(builder, "elementgetschematypeinfo03") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var typeName;
      var typeNS;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_nodtdstaff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertNull("typeName",typeName);
    typeNS = typeInfo.typeNamespace;

      assertNull("typeNS",typeNS);
    
},
/**
* 
	The getSchemaTypeInfo method retrieves the type information associated with this element. 

	Load a valid document with an XML Schema.
	Invoke getSchemaTypeInfo method on an element having [type definition] property.  Expose {name} and {target namespace}
	properties of the [type definition] property.  Verity that the typeName and typeNamespace of the code element's
	schemaTypeInfo are correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Element-schemaTypeInfo
*/
elementgetschematypeinfo04 : function () {
   var success;
    if(checkInitialization(builder, "elementgetschematypeinfo04") != null) return;
    var doc;
      var codeElem;
      var elemTypeInfo;
      var typeName;
      var typeNamespace;
      var elemList;
      var docElemNodeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("code");
      codeElem = elemList.item(1);
      elemTypeInfo = codeElem.schemaTypeInfo;

      typeName = elemTypeInfo.typeName;

      typeNamespace = elemTypeInfo.typeNamespace;

      assertEquals("elementgetschematypeinfo04_typeName","code",typeName);
       assertEquals("elementgetschematypeinfo04_typeNamespace","http://www.w3.org/1999/xhtml",typeNamespace);
       
},
/**
* 
	The getSchemaTypeInfo method retrieves the type information associated with this element. 

	Load a valid document with an XML Schema.
	Invoke getSchemaTypeInfo method on an element having [type definition] property.  Expose {name} and {target namespace}
	properties of the [type definition] property.  Verity that the typeName and typeNamespace of the acronym element's
	schemaTypeInfo are correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Element-schemaTypeInfo
*/
elementgetschematypeinfo05 : function () {
   var success;
    if(checkInitialization(builder, "elementgetschematypeinfo05") != null) return;
    var doc;
      var acElem;
      var elemTypeInfo;
      var typeName;
      var typeNamespace;
      var elemList;
      var docElemNodeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("span");
      acElem = elemList.item(0);
      elemTypeInfo = acElem.schemaTypeInfo;

      typeName = elemTypeInfo.typeName;

      typeNamespace = elemTypeInfo.typeNamespace;

      assertEquals("typeNameString","string",typeName);
       assertEquals("typeNsXSD","http://www.w3.org/2001/XMLSchema",typeNamespace);
       
},
/**
* 
	The getSchemaTypeInfo method retrieves the type information associated with this element. 

	Load a valid document with an XML Schema.
	Invoke getSchemaTypeInfo method on an element having [type definition] property.  Expose {name} and {target namespace}
	properties of the [type definition] property.  Verity that the typeName and typeNamespace of the strong element's
	schemaTypeInfo are correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Element-schemaTypeInfo
*/
elementgetschematypeinfo06 : function () {
   var success;
    if(checkInitialization(builder, "elementgetschematypeinfo06") != null) return;
    var doc;
      var strongElem;
      var elemTypeInfo;
      var typeName;
      var typeNamespace;
      var elemList;
      var docElemNodeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      strongElem = elemList.item(1);
      elemTypeInfo = strongElem.schemaTypeInfo;

      typeName = elemTypeInfo.typeName;

      typeNamespace = elemTypeInfo.typeNamespace;

      assertEquals("elementgetschematypeinfo06_typeName","strongType",typeName);
       assertEquals("elementgetschematypeinfo06_typeNamespace","http://www.w3.org/1999/xhtml",typeNamespace);
       
},
/**
* 
	The getSchemaTypeInfo method retrieves the type information associated with this element. 

	Load a valid document with an XML Schema.
	Invoke getSchemaTypeInfo method on an element having [type definition] property.  Expose {name} and {target namespace}
	properties of the [type definition] property.  Verity that the typeName and typeNamespace of the name element's
	schemaTypeInfo are correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Element-schemaTypeInfo
*/
elementgetschematypeinfo07 : function () {
   var success;
    if(checkInitialization(builder, "elementgetschematypeinfo07") != null) return;
    var doc;
      var supElem;
      var elemTypeInfo;
      var typeName;
      var typeNamespace;
      var docElemNodeName;
      var elemList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("sup");
      supElem = elemList.item(0);
      elemTypeInfo = supElem.schemaTypeInfo;

      typeName = elemTypeInfo.typeName;

      typeNamespace = elemTypeInfo.typeNamespace;

      assertEquals("elementgetschematypeinfo07_typeName","sup",typeName);
       assertEquals("elementgetschematypeinfo07_typeNamespace","http://www.w3.org/1999/xhtml",typeNamespace);
       
},
/**
* 
	Invoke setIdAttribute on the third acronym element's class attribute.  Verify by calling isID
	on the class attribute and getElementById on document. Invoke setIdAttribute again to reset.
	Calling isID should return false.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute01 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute01") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      acronymElem.setIdAttribute("class",true);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("class");
      id = attr.isId;

      assertTrue("elementsetidattributeIsIdTrue01",id);
elem = doc.getElementById("No");
      elemName = elem.tagName;

      assertEquals("elementsetidattributeGetElementById01","acronym",elemName);
       acronymElem.setIdAttribute("class",false);
      id = attr.isId;

      assertFalse("elementsetidattributeIsIdFalse01",id);

},
/**
* 
	First use setAttribute to change the class attribute of the third acronym element.  Invoke setIdAttribute
	on the newly set attribute. Verify by calling isID on the new attribute and getElementById on document.
	Invoke setIdAttribute again to reset.  Calling isID should return false.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute03 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute03") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      acronymElem.setAttribute("class","Maybe");
      acronymElem.setIdAttribute("class",true);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("class");
      id = attr.isId;

      assertTrue("elementsetidattributeIsIdTrue03",id);
elem = doc.getElementById("Maybe");
      elemName = elem.tagName;

      assertEquals("elementsetidattributeGetElementById03","acronym",elemName);
       acronymElem.setIdAttribute("class",false);
      id = attr.isId;

      assertFalse("elementsetidattributeIsIdFalse03",id);

},
/**
* 
	First use setAttribute to create a new attribute on the third strong element.  Invoke setIdAttribute
	on the new  attribute. Verify by calling isID on the new attribute and getElementById on document.
	Invoke setIdAttribute again to reset. Calling isID should return false.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute04 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute04") != null) return;
    var doc;
      var elemList;
      var nameElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem = elemList.item(2);
      nameElem.setAttribute("hasMiddleName","Antoine");
      nameElem.setIdAttribute("hasMiddleName",true);
      attributesMap = nameElem.attributes;

      attr = attributesMap.getNamedItem("hasMiddleName");
      id = attr.isId;

      assertTrue("elementsetidattributeIsIdTrue03",id);
elem = doc.getElementById("Antoine");
      elemName = elem.tagName;

      assertEquals("elementsetidattributeGetElementById03","strong",elemName);
       nameElem.setIdAttribute("hasMiddleName",false);
      id = attr.isId;

      assertFalse("elementsetidattributeIsIdFalse03",id);

},
/**
* 
	Invoke setIdAttribute on the third strong element with a non-existing attribute name.  Verify that
	NOT_FOUND_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute05 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute05") != null) return;
    var doc;
      var elemList;
      var nameElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem = elemList.item(2);
      
	{
		success = false;
		try {
            nameElem.setIdAttribute("hasMiddleName",true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Invoke setIdAttribute on the third strong element with an attribute name of the acronym element.
	Verify that NOT_FOUND_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute06 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute06") != null) return;
    var doc;
      var elemList;
      var nameElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem = elemList.item(2);
      
	{
		success = false;
		try {
            nameElem.setIdAttribute("class",true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	First use setAttribute to create two new attribute of the second and third strong element with different values.
	Invoke setIdAttribute on the new  attributes. Verify by calling isID on the new attributes and getElementById 
	with two different values on document.	

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute07 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute07") != null) return;
    var doc;
      var elemList;
      var nameElem1;
      var nameElem2;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem1 = elemList.item(2);
      nameElem2 = elemList.item(3);
      nameElem1.setAttribute("hasMiddleName","Antoine");
      nameElem1.setIdAttribute("hasMiddleName",true);
      nameElem2.setAttribute("hasMiddleName","Neeya");
      nameElem2.setIdAttribute("hasMiddleName",true);
      attributesMap = nameElem1.attributes;

      attr = attributesMap.getNamedItem("hasMiddleName");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId1True07",id);
attributesMap = nameElem2.attributes;

      attr = attributesMap.getNamedItem("hasMiddleName");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId2True07",id);
elem = doc.getElementById("Antoine");
      elemName = elem.tagName;

      assertEquals("elementsetidattribute1GetElementById07","strong",elemName);
       elem = doc.getElementById("Neeya");
      elemName = elem.tagName;

      assertEquals("elementsetidattribute2GetElementById07","strong",elemName);
       
},
/**
* 
	Invoke setIdAttribute class attribute on the second, third, and the fifth acronym element. 
	Verify by calling isID on the attributes and getElementById with the unique value "No" on document.
	
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute08 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute08") != null) return;
    var doc;
      var elemList;
      var acronymElem1;
      var acronymElem2;
      var acronymElem3;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem1 = elemList.item(1);
      acronymElem2 = elemList.item(2);
      acronymElem3 = elemList.item(4);
      acronymElem1.setIdAttribute("class",true);
      acronymElem2.setIdAttribute("class",true);
      acronymElem3.setIdAttribute("class",true);
      attributesMap = acronymElem1.attributes;

      attr = attributesMap.getNamedItem("class");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId1True08",id);
attributesMap = acronymElem2.attributes;

      attr = attributesMap.getNamedItem("class");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId2True08",id);
attributesMap = acronymElem3.attributes;

      attr = attributesMap.getNamedItem("class");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId3True08",id);
elem = doc.getElementById("No");
      elemName = elem.tagName;

      assertEquals("elementsetidattributeGetElementById08","acronym",elemName);
       
},
/**
* 
	First use setAttribute to create two new attributes on the second strong element and sup element.
	Invoke setIdAttribute on the new attributes. Verify by calling isID on the new attributes and getElementById 
	with two different values on document.	

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute09 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute09") != null) return;
    var doc;
      var elemList1;
      var elemList2;
      var nameElem;
      var salaryElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList1 = doc.getElementsByTagName("strong");
      elemList2 = doc.getElementsByTagName("sup");
      nameElem = elemList1.item(2);
      salaryElem = elemList2.item(2);
      nameElem.setAttribute("hasMiddleName","Antoine");
      salaryElem.setAttribute("annual","2002");
      nameElem.setIdAttribute("hasMiddleName",true);
      salaryElem.setIdAttribute("annual",true);
      attributesMap = nameElem.attributes;

      attr = attributesMap.getNamedItem("hasMiddleName");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId1True09",id);
attributesMap = salaryElem.attributes;

      attr = attributesMap.getNamedItem("annual");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId2True09",id);
elem = doc.getElementById("Antoine");
      elemName = elem.tagName;

      assertEquals("elementsetidattribute1GetElementById09","strong",elemName);
       elem = doc.getElementById("2002");
      elemName = elem.tagName;

      assertEquals("elementsetidattribute2GetElementById09","sup",elemName);
       
},
/**
* 
	Invoke setIdAttribute on the third acronym element's class attribute consecutively with different
	isId values. Verify by calling isId on the attribute. 

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute10 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute10") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      acronymElem.setIdAttribute("class",true);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("class");
      id = attr.isId;

      assertTrue("elementsetidattributeIsId1True10",id);
acronymElem.setIdAttribute("class",true);
      id = attr.isId;

      assertTrue("elementsetidattributeIsId2True10",id);
acronymElem.setIdAttribute("class",false);
      id = attr.isId;

      assertFalse("elementsetidattributeIsIdFalse10",id);
elem = doc.getElementById("No");
      assertNull("elementsetidattributeGetElementByIdNull10",elem);
    
},
/**
* 
	Invoke setIdAttribute on the 4th acronym element's class attribute which contains 
	an entity reference.  Verify by calling isID on the class attribute and getElementById 
	on document. Invoke setIdAttribute again to reset.  Calling isID should return false.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttr
*/
elementsetidattribute11 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattribute11") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(3);
      acronymElem.setIdAttribute("class",true);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("class");
      id = attr.isId;

      assertTrue("elementsetidattributeIsIdTrue01",id);
elem = doc.getElementById("Yα");
      assertNotNull("elemByIDNotNull",elem);
elemName = elem.tagName;

      assertEquals("elementsetidattributeGetElementById11","acronym",elemName);
       acronymElem.setIdAttribute("class",false);
      id = attr.isId;

      assertFalse("elementsetidattributeIsIdFalse11",id);

},
/**
* 
     Invoke setIdAttributeNode on the 3rd p element using the title attribute as a parameter .  Verify by calling
     isID on the attribute node and getElementById on document node. Call setIdAttributeNode again with isId=false
     to reset.  Invoke isId on the attribute node should return false.
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode01 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode01") != null) return;
    var doc;
      var elemList;
      var employeeElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      employeeElem = elemList.item(2);
      attributesMap = employeeElem.attributes;

      attr = attributesMap.getNamedItem("xmlns:dmstc");
      employeeElem.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsIdTrue01",id);
elem = doc.getElementById("http://www.netzero.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenodeGetElementById01","p",elemName);
       elem.setIdAttributeNode(attr,false);
      id = attr.isId;

      assertFalse("elementsetidattributenodeIsIdFalse01",id);

},
/**
* 
     Invoke setIdAttributeNode on the 3rd acronym element using the class attribute as a parameter .  Verify by calling
     isID on the attribute node and getElementById on document node.  Call setIdAttributeNode again with isId=false
     to reset.  Invoke isId on the attribute node should return false.
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode02 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode02") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("class");
      acronymElem.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsIdTrue02",id);
elem = doc.getElementById("No");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenodeGetElementById02","acronym",elemName);
       elem.setIdAttributeNode(attr,false);
      id = attr.isId;

      assertFalse("elementsetidattributenodeIsIdFalse02",id);

},
/**
* 
     Create a new attribute node on the second strong element.  Invoke setIdAttributeNode on a newly created 
     attribute node.  Verify by calling isID on the attribute node and getElementById on document node. 
     Call setIdAttributeNode again with isId=false to reset.  Invoke isId on the attribute node should return false.
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode03 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode03") != null) return;
    var doc;
      var elemList;
      var nameElem;
      var attributesMap;
      var attr;
      var newAttr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem = elemList.item(1);
      nameElem.setAttribute("title","Karen");
      attributesMap = nameElem.attributes;

      attr = attributesMap.getNamedItem("title");
      nameElem.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsIdTrue03",id);
elem = doc.getElementById("Karen");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenodeGetElementById03","strong",elemName);
       elem.setIdAttributeNode(attr,false);
      id = attr.isId;

      assertFalse("elementsetidattributenodeIsIdFalse03",id);

},
/**
* 
     Create a new namespace attribute on the second strong element.  Invoke setIdAttributeNode on a newly created 
     attribute node.  Verify by calling isID on the attribute node and getElementById on document node. 
     Call setIdAttributeNode again with isId=false to reset.  Invoke isId on the attribute node should return false.
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode04 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode04") != null) return;
    var doc;
      var elemList;
      var nameElem;
      var attributesMap;
      var attr;
      var newAttr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem = elemList.item(1);
      nameElem.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:middle","http://www.example.com/middle");
      attributesMap = nameElem.attributes;

      attr = attributesMap.getNamedItem("xmlns:middle");
      nameElem.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsIdTrue04",id);
elem = doc.getElementById("http://www.example.com/middle");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenodeGetElementById04","strong",elemName);
       elem.setIdAttributeNode(attr,false);
      id = attr.isId;

      assertFalse("elementsetidattributenodeIsIdFalse04",id);

},
/**
* 
     Invoke setIdAttributeNode on the third strong element but with the class attribute of the acronym
     element as a parameter.  Verify that NOT_FOUND_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode05 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode05") != null) return;
    var doc;
      var elemList1;
      var elemList2;
      var nameElem;
      var acronymElem;
      var attributesMap;
      var attr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList1 = doc.getElementsByTagName("strong");
      elemList2 = doc.getElementsByTagName("acronym");
      nameElem = elemList1.item(1);
      acronymElem = elemList2.item(1);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("class");
      
	{
		success = false;
		try {
            nameElem.setIdAttributeNode(attr,true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
     Invoke setIdAttributeNode on the third strong element but with the title attribute of the acronym
     element as a parameter.  Verify that NOT_FOUND_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode06 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode06") != null) return;
    var doc;
      var elemList1;
      var elemList2;
      var nameElem;
      var acronymElem;
      var attributesMap;
      var attr;
      var nameElement;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList1 = doc.getElementsByTagName("strong");
      elemList2 = doc.getElementsByTagName("acronym");
      nameElem = elemList1.item(1);
      acronymElem = elemList2.item(1);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      
	{
		success = false;
		try {
            nameElem.setIdAttributeNode(attr,true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
     Invoke setIdAttributeNode on the 2nd and 3rd acronym element using the class attribute as a parameter .  Verify by calling
     isID on the attribute node and getElementById on document node.  
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode07 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode07") != null) return;
    var doc;
      var elemList1;
      var elemList2;
      var acronymElem1;
      var acronymElem2;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList1 = doc.getElementsByTagName("acronym");
      elemList2 = doc.getElementsByTagName("acronym");
      acronymElem1 = elemList1.item(1);
      acronymElem2 = elemList2.item(2);
      attributesMap = acronymElem1.attributes;

      attr = attributesMap.getNamedItem("class");
      acronymElem1.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsId1True07",id);
attributesMap = acronymElem2.attributes;

      attr = attributesMap.getNamedItem("class");
      acronymElem2.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsId2True07",id);
elem = doc.getElementById("No");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenode1GetElementById07","acronym",elemName);
       elem = doc.getElementById("Yes");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenode2GetElementById07","acronym",elemName);
       
},
/**
* 
     This method declares the attribute specified by node to be of type ID. If the value of the specified attribute 
     is unique then this element node can later be retrieved using getElementById on Document. Note, however, 
     that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNode on the 2nd acronym element and 3rd p element using the title and xmlns:dmstc attributes respectively
     as parameters .  Verify by calling isID on the attribute node and getElementById on document node.  
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode08 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode08") != null) return;
    var doc;
      var elemList1;
      var elemList2;
      var acronymElem;
      var pElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList1 = doc.getElementsByTagNameNS("*","acronym");
      elemList2 = doc.getElementsByTagNameNS("*","p");
      acronymElem = elemList1.item(1);
      pElem = elemList2.item(2);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("title");
      acronymElem.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsId1True08",id);
attributesMap = pElem.attributes;

      attr = attributesMap.getNamedItem("xmlns:dmstc");
      pElem.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsId2True08",id);
elem = doc.getElementById("Yes");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenode1GetElementById08","acronym",elemName);
       elem = doc.getElementById("http://www.netzero.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenode2GetElementById08","p",elemName);
       
},
/**
* 
     This method declares the attribute specified by node to be of type ID. If the value of the specified attribute 
     is unique then this element node can later be retrieved using getElementById on Document. Note, however, 
     that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNode with the xmlns attribute of ent4.  Verify that NO_MODIFICATION_ALLOWED_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode09 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode09") != null) return;
    var doc;
      var elemList;
      var varElem;
      var entRef;
      var entElement;
      var attributesMap;
      var attr;
      var domConfig;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = doc.domConfig;

      domConfig.setParameter("entities", true);
	 doc.normalizeDocument();
      elemList = doc.getElementsByTagNameNS("*","var");
      varElem = elemList.item(2);
      entRef = varElem.firstChild;

      entElement = entRef.firstChild;

      attributesMap = entElement.attributes;

      attr = attributesMap.getNamedItem("xmlns");
      
	{
		success = false;
		try {
            entElement.setIdAttributeNode(attr,true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
     This method declares the attribute specified by node to be of type ID. If the value of the specified attribute 
     is unique then this element node can later be retrieved using getElementById on Document. Note, however, 
     that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNode on the 4th acronym element using the class attribute (containing entity reference)
     as a parameter .  Verify by calling isId on the attribute node and getElementById on document node.  
     Reset by invoking setIdAttributeNode with isId=false.  
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributenode10 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributenode10") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","acronym");
      acronymElem = elemList.item(3);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("class");
      acronymElem.setIdAttributeNode(attr,true);
      id = attr.isId;

      assertTrue("elementsetidattributenodeIsIdTrue10",id);
elem = doc.getElementById("Yα");
      elemName = elem.tagName;

      assertEquals("elementsetidattributenodeGetElementById10","acronym",elemName);
       acronymElem.setIdAttributeNode(attr,false);
      id = attr.isId;

      assertFalse("elementsetidattributenodeIsIdFalse10",id);

},
/**
* 
     Invoke setIdAttributeNS on an existing namespace attribute with a namespace URI and a qualified name.  Verify by calling
     isId on the attribute node and getElementById on document node.  Call setIdAttributeNS with isId=false to reset. 
     isId should now return false. 
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens01 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens01") != null) return;
    var doc;
      var elemList;
      var employeeElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      employeeElem = elemList.item(2);
      employeeElem.setIdAttributeNS("http://www.w3.org/2000/xmlns/","dmstc",true);
      attributesMap = employeeElem.attributes;

      attr = attributesMap.getNamedItem("xmlns:dmstc");
      id = attr.isId;

      assertTrue("elementsetidattributensIsIdTrue01",id);
elem = doc.getElementById("http://www.netzero.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributensGetElementById01","p",elemName);
       employeeElem.setIdAttributeNS("http://www.w3.org/2000/xmlns/","dmstc",false);
      id = attr.isId;

      assertFalse("elementsetidattributensIsIdFalse01",id);

},
/**
* 
     Invoke setIdAttributeNS on an existing attribute with a namespace URI and a qualified name.  Verify by calling
     isID on the attribute node and getElementById on document node. Assume the grammar has not defined any
     element of typeID. Call setIdAttributeNS with isId=false to reset. Method isId should now return false. 
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens02 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens02") != null) return;
    var doc;
      var elemList;
      var addressElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      var xsiNS = "http://www.w3.org/2001/XMLSchema-instance";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","acronym");
      addressElem = elemList.item(2);
      addressElem.setIdAttributeNS(xsiNS,"noNamespaceSchemaLocation",true);
      attributesMap = addressElem.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      id = attr.isId;

      assertTrue("elementsetidattributensIsIdTrue02",id);
elem = doc.getElementById("Yes");
      assertNotNull("getElementByIDNotNull",elem);
elemName = elem.tagName;

      assertEquals("elementsetidattributensGetElementById01","acronym",elemName);
       addressElem.setIdAttributeNS(xsiNS,"noNamespaceSchemaLocation",false);
      id = attr.isId;

      assertFalse("elementsetidattributensIsIdFalse02",id);

},
/**
* 
     Invoke setIdAttributeNS on a newly added namespace attribute on the first em element.  Verify by calling
     isID on the attribute node and getElementById on document node. Call setIdAttributeNS with isId=false to reset. 
     Method isId should now return false. 
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens03 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens03") != null) return;
    var doc;
      var elemList;
      var employeeIdElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      employeeIdElem = elemList.item(0);
      employeeIdElem.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:newAttr","newValue");
      employeeIdElem.setIdAttributeNS("http://www.w3.org/2000/xmlns/","newAttr",true);
      attributesMap = employeeIdElem.attributes;

      attr = attributesMap.getNamedItem("xmlns:newAttr");
      id = attr.isId;

      assertTrue("elementsetidattributensIsIdTrue03",id);
elem = doc.getElementById("newValue");
      elemName = elem.tagName;

      assertEquals("elementsetidattributensGetElementById03","em",elemName);
       employeeIdElem.setIdAttributeNS("http://www.w3.org/2000/xmlns/","newAttr",false);
      id = attr.isId;

      assertFalse("elementsetidattributensIsIdFalse03",id);

},
/**
* 
     The method setIdAttributeNS declares the attribute specified by local name and namespace URI to be of type ID. 
     If the value of the specified attribute is unique then this element node can later be retrieved using getElementById on Document. 
     Note, however, that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNS on newly added attribute on the third strong element.  Verify by calling
     isID on the attribute node and getElementById on document node.
     Call setIdAttributeNS with isId=false to reset. Method isId should now return false. 
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens04 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens04") != null) return;
    var doc;
      var elemList;
      var strongElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","strong");
      strongElem = elemList.item(2);
      strongElem.setAttributeNS("http://www.netzero.com","dmstc:newAttr","newValue");
      strongElem.setIdAttributeNS("http://www.netzero.com","newAttr",true);
      attributesMap = strongElem.attributes;

      attr = attributesMap.getNamedItem("dmstc:newAttr");
      id = attr.isId;

      assertTrue("elementsetidattributensIsIdTrue04",id);
elem = doc.getElementById("newValue");
      elemName = elem.tagName;

      assertEquals("elementsetidattributensGetElementById04","strong",elemName);
       strongElem.setIdAttributeNS("http://www.netzero.com","newAttr",false);
      id = attr.isId;

      assertFalse("elementsetidattributensIsIdFalse04",id);

},
/**
* 
     The method setIdAttributeNS declares the attribute specified by local name and namespace URI to be of type ID. 
     If the value of the specified attribute is unique then this element node can later be retrieved using getElementById on Document. 
     Note, however, that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNS on a changed attribute of  the third acronym element.  Verify by calling
     isID on the attribute node and getElementById on document node.
     Call setIdAttributeNS with isId=false to reset. Method isId should now return false. 
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens05 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens05") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","acronym");
      acronymElem = elemList.item(2);
      acronymElem.setAttributeNS("*","title","newValue");
      acronymElem.setIdAttributeNS("*","title",true);
      attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("title");
      id = attr.isId;

      assertTrue("elementsetidattributensIsIdTrue05",id);
elem = doc.getElementById("newValue");
      elemName = elem.tagName;

      assertEquals("elementsetidattributensGetElementById05","acronym",elemName);
       acronymElem.setIdAttributeNS("*","title",false);
      id = attr.isId;

      assertFalse("elementsetidattributensIsIdFalse05",id);

},
/**
* 
     Invoke setIdAttributeNS on the third strong element with a non-existing attribute name.  Verify that
     NOT_FOUND_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens06 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens06") != null) return;
    var doc;
      var elemList;
      var nameElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem = elemList.item(2);
      
	{
		success = false;
		try {
            nameElem.setIdAttributeNS("http://www.netzero.com","hasMiddleName",true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
     Invoke setIdAttributeNS on the second p element with a non-existing attribute.  Verify that
     NOT_FOUND_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens07 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens07") != null) return;
    var doc;
      var elemList;
      var employeeElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      employeeElem = elemList.item(1);
      
	{
		success = false;
		try {
            employeeElem.setIdAttributeNS("http://www.netzero.com","xsi",true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
     Invoke setIdAttributeNS on the second p element with a non-existing attribute.  Verify that
     NOT_FOUND_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNode
*/
elementsetidattributens08 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens08") != null) return;
    var doc;
      var elemList;
      var employeeElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      employeeElem = elemList.item(1);
      
	{
		success = false;
		try {
            employeeElem.setIdAttributeNS("http://www.usa.com","usa",true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
     The method setIdAttributeNS declares the attribute specified by local name and namespace URI to be of type ID. 
     If the value of the specified attribute is unique then this element node can later be retrieved using getElementById on Document. 
     Note, however, that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNS on the xmlns attribute of ent4.  Verify that NO_MODIFICATION_ALLOWED_ERR is raised.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens09 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens09") != null) return;
    var doc;
      var elemList;
      var varElem;
      var entRef;
      var entElement;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","var");
      varElem = elemList.item(2);
      entRef = varElem.firstChild;

      entElement = entRef.firstChild;

      
	{
		success = false;
		try {
            entElement.setIdAttributeNS("http://www.w3.org/2000/xmlns/","xmlns",true);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
     Declares the attribute specified by local name and namespace URI to be of type ID. If the value of the 
     specified attribute is unique then this element node can later be retrieved using getElementById on Document. 
     Note, however, that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNS on two existing namespace attributes with different values.  Verify by calling
     isId on the attributes and getElementById with different values on document node.  
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens10 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens10") != null) return;
    var doc;
      var elemList;
      var pElem1;
      var pElem2;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","p");
      pElem1 = elemList.item(2);
      pElem2 = elemList.item(3);
      pElem1.setIdAttributeNS("http://www.w3.org/2000/xmlns/","dmstc",true);
      pElem2.setIdAttributeNS("http://www.w3.org/2000/xmlns/","nm",true);
      attributesMap = pElem1.attributes;

      attr = attributesMap.getNamedItem("xmlns:dmstc");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId1True10",id);
attributesMap = pElem2.attributes;

      attr = attributesMap.getNamedItem("xmlns:nm");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId2True10",id);
elem = doc.getElementById("http://www.netzero.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributens1GetElementById10","p",elemName);
       elem = doc.getElementById("http://www.altavista.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributens2GetElementById10","p",elemName);
       
},
/**
* 
     Declares the attribute specified by local name and namespace URI to be of type ID. If the value of the 
     specified attribute is unique then this element node can later be retrieved using getElementById on Document. 
     Note, however, that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNS on two existing namespace attributes with same local name but different values.  Verify by calling
     isId on the attributes node and getElementById with different values on document node.  
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens11 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens11") != null) return;
    var doc;
      var elemList;
      var pElem1;
      var pElem2;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","p");
      pElem1 = elemList.item(1);
      pElem2 = elemList.item(2);
      pElem1.setIdAttributeNS("http://www.w3.org/2000/xmlns/","dmstc",true);
      pElem2.setIdAttributeNS("http://www.w3.org/2000/xmlns/","dmstc",true);
      attributesMap = pElem1.attributes;

      attr = attributesMap.getNamedItem("xmlns:dmstc");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId1True11",id);
attributesMap = pElem2.attributes;

      attr = attributesMap.getNamedItem("xmlns:dmstc");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId2True11",id);
elem = doc.getElementById("http://www.netzero.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributens1GetElementById11","p",elemName);
       elem = doc.getElementById("http://www.usa.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributens2GetElementById11","p",elemName);
       
},
/**
* 
     Declares the attribute specified by local name and namespace URI to be of type ID. If the value of the 
     specified attribute is unique then this element node can later be retrieved using getElementById on Document. 
     Note, however, that this simply affects this node and does not change any grammar that may be in use. 
     
     Set the noNamespaceSchemaLocation attribute on the first acronym element to "No".  Invoke setIdAttributeNS on the 
     noNamespaceSchemaLocation attribute of the first, second and third acronym element.  Verify by calling isId on 
     the attributes.  Calling getElementById with "No" as a value should return the acronym element.  
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens12 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens12") != null) return;
    var doc;
      var elemList;
      var acronymElem1;
      var acronymElem2;
      var acronymElem3;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","acronym");
      acronymElem1 = elemList.item(0);
      acronymElem2 = elemList.item(1);
      acronymElem3 = elemList.item(2);
      acronymElem1.setAttributeNS("http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation","No");
      acronymElem1.setIdAttributeNS("http://www.w3.org/2001/XMLSchema-instance","noNamespaceSchemaLocation",true);
      acronymElem2.setIdAttributeNS("http://www.w3.org/2001/XMLSchema-instance","noNamespaceSchemaLocation",true);
      acronymElem3.setIdAttributeNS("http://www.w3.org/2001/XMLSchema-instance","noNamespaceSchemaLocation",true);
      attributesMap = acronymElem1.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId1True12",id);
attributesMap = acronymElem2.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId2True12",id);
attributesMap = acronymElem3.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId3True12",id);
elem = doc.getElementById("No");
      elemName = elem.tagName;

      assertEquals("elementsetidattributensGetElementById10","acronym",elemName);
       
},
/**
* 
     Invoke setIdAttributeNS on newly added attribute on the third strong element.  Verify by calling
     isID on the attribute node and getElementById on document node.
     Call setIdAttributeNS on the same element to reset ID but with a non-existing attribute should generate
     NOT_FOUND_ERR
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens13 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens13") != null) return;
    var doc;
      var elemList;
      var nameElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      nameElem = elemList.item(2);
      nameElem.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:newAttr","newValue");
      nameElem.setIdAttributeNS("http://www.w3.org/2000/xmlns/","newAttr",true);
      attributesMap = nameElem.attributes;

      attr = attributesMap.getNamedItem("xmlns:newAttr");
      id = attr.isId;

      assertTrue("elementsetidattributensIsIdTrue13",id);
elem = doc.getElementById("newValue");
      elemName = elem.tagName;

      assertEquals("elementsetidattributensGetElementById13","strong",elemName);
       
	{
		success = false;
		try {
            nameElem.setIdAttributeNS("http://www.w3.org/XML/1998/namespace","lang",false);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
     Declares the attribute specified by local name and namespace URI to be of type ID. If the value of the 
     specified attribute is unique then this element node can later be retrieved using getElementById on Document. 
     Note, however, that this simply affects this node and does not change any grammar that may be in use. 
     
     Invoke setIdAttributeNS on two existing attributes of the second p element and the third
     acronym element.  Verify by calling isId on the attributes and getElementById with different values on document node.  
    
* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ElSetIdAttrNS
*/
elementsetidattributens14 : function () {
   var success;
    if(checkInitialization(builder, "elementsetidattributens14") != null) return;
    var doc;
      var elemList;
      var pElem;
      var acronymElem;
      var attributesMap;
      var attr;
      var id = false;
      var elem;
      var elemName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","p");
      pElem = elemList.item(1);
      elemList = doc.getElementsByTagNameNS("*","acronym");
      acronymElem = elemList.item(2);
      pElem.setIdAttributeNS("http://www.w3.org/2000/xmlns/","dmstc",true);
      acronymElem.setIdAttributeNS("http://www.w3.org/2001/XMLSchema-instance","noNamespaceSchemaLocation",true);
      attributesMap = pElem.attributes;

      attr = attributesMap.getNamedItem("xmlns:dmstc");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId1True14",id);
attributesMap = acronymElem.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      id = attr.isId;

      assertTrue("elementsetidattributensIsId2True14",id);
elem = doc.getElementById("Yes");
      elemName = elem.tagName;

      assertEquals("elementsetidattributens1GetElementById14","acronym",elemName);
       elem = doc.getElementById("http://www.usa.com");
      elemName = elem.tagName;

      assertEquals("elementsetidattributens2GetElementById14","p",elemName);
       
},
/**
* 
Normalize document with entities set to true, check that
entity references and unused entity declaration are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-entities
*/
entities01 : function () {
   var success;
    if(checkInitialization(builder, "entities01") != null) return;
    var doc;
      var pList;
      var pElem;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var entRef;
      var entities;
      var ent2;
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("entities", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = doc.createEntityReference("ent1");
      child = pElem.appendChild(entRef);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      child = pElem.lastChild;

      assertNotNull("lastChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChild","ent1",childName);
       doctype = doc.doctype;

      entities = doctype.entities;

      ent2 = entities.getNamedItem("ent2");
      assertNotNull("ent2NotNull",ent2);

},
/**
* 
Normalize document with entities set to false, check that
entity references are expanded and unused entity declaration are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-entities
*/
entities02 : function () {
   var success;
    if(checkInitialization(builder, "entities02") != null) return;
    var doc;
      var pList;
      var pElem;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var entRef;
      var childValue;
      var entities;
      var ent2;
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("entities", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = doc.createEntityReference("ent1");
      child = pElem.appendChild(entRef);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      child = pElem.lastChild;

      assertNotNull("lastChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChildName","#text",childName);
       childValue = child.nodeValue;

      assertEquals("firstChildValue","barfoo",childValue);
       doctype = doc.doctype;

      entities = doctype.entities;

      ent2 = entities.getNamedItem("ent2");
      assertNotNull("ent2NotNull",ent2);

},
/**
* 
Normalize document with entities set to false, check that
unbound entity references are preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-entities
*/
entities03 : function () {
   var success;
    if(checkInitialization(builder, "entities03") != null) return;
    var doc;
      var pList;
      var pElem;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var entRef;
      var childType;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("entities", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = doc.createEntityReference("ent3");
      child = pElem.appendChild(entRef);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      child = pElem.lastChild;

      assertNotNull("lastChildNotNull",child);
childType = child.nodeType;

      assertEquals("lastChildEntRef",5,childType);
       childName = child.nodeName;

      assertEquals("lastChildName","ent3",childName);
       
},
/**
* 
Normalize document using Node.normalize checking that "entities" parameter is ignored.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-entities
*/
entities04 : function () {
   var success;
    if(checkInitialization(builder, "entities04") != null) return;
    var doc;
      var pList;
      var pElem;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var entRef;
      var entities;
      var ent2;
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("entities", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = doc.createEntityReference("ent1");
      child = pElem.appendChild(entRef);
      doc.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      child = pElem.lastChild;

      assertNotNull("lastChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChild","ent1",childName);
       doctype = doc.doctype;

      entities = doctype.entities;

      ent2 = entities.getNamedItem("ent2");
      assertNotNull("ent2NotNull",ent2);

},
/**
* 
	Call the getInputEncoding method on a UTF-8 encoded document and check if the 
	value returned is null for a internal general entity.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-inputEncoding
*/
entitygetinputencoding01 : function () {
   var success;
    if(checkInitialization(builder, "entitygetinputencoding01") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("alpha");
      encodingName = entity.inputEncoding;

      assertNull("entitygetinputencoding01",encodingName);
    
},
/**
* 
	Call the getInputEncoding method on a UTF-16 encoded document that contains an external
	unparsed entity and check if the value returned is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-inputEncoding
*/
entitygetinputencoding02 : function () {
   var success;
    if(checkInitialization(builder, "entitygetinputencoding02") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_utf16");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent5");
      encodingName = entity.inputEncoding;

      assertNull("entitygetinputencoding02",encodingName);
    
},
/**
* 
Check the value of Entity.inputEncoding on an UTF-16 external entity 
is either UTF-16 or UTF-16LE

* @author IBM
* @author Neil Delima
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-inputEncoding
* @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Dec/0045.html
*/
entitygetinputencoding03 : function () {
   var success;
    if(checkInitialization(builder, "entitygetinputencoding03") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent1");
      encodingName = entity.inputEncoding;

      
	if(
	!("UTF-16LE".toUpperCase() == encodingName.toUpperCase())
	) {
	assertEquals("entityIsUTF16orUTF16LE","UTF-16".toLowerCase(),encodingName.toLowerCase());
       
	}
	encodingName = doc.inputEncoding;

      assertEquals("documentIsUTF8","UTF-8".toLowerCase(),encodingName.toLowerCase());
       
},
/**
* 
Check the value of Entity.inputEncoding on an UTF-8 external entity 
is UTF-8.

* @author IBM
* @author Neil Delima
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-inputEncoding
* @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Dec/0045.html
*/
entitygetinputencoding04 : function () {
   var success;
    if(checkInitialization(builder, "entitygetinputencoding04") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent2");
      encodingName = entity.inputEncoding;

      assertEquals("entityIsUTF8","UTF-8".toLowerCase(),encodingName.toLowerCase());
       encodingName = doc.inputEncoding;

      assertEquals("documentIsUTF8","UTF-8".toLowerCase(),encodingName.toLowerCase());
       
},
/**
* 
	Call the getXmlEncoding method on a UTF-8 encoded entity of a document that is not an 
	external parsed entity  and check if the value returned is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-encoding
*/
entitygetxmlencoding01 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlencoding01") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("alpha");
      encodingName = entity.xmlEncoding;

      assertNull("entitygetxmlencoding01",encodingName);
    
},
/**
* 
	Call the getencoding method on a document that contains an external
	unparsed entity and check if the value returned is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-encoding
*/
entitygetxmlencoding02 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlencoding02") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent5");
      encodingName = entity.xmlEncoding;

      assertNull("entitygetxmlencoding02",encodingName);
    
},
/**
* 
Check the value of Entity.xmlEncoding on an external entity with an encoding
declaration precisely matches the specified value.

* @author IBM
* @author Neil Delima
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-encoding
* @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Dec/0045.html
*/
entitygetxmlencoding03 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlencoding03") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent1");
      encodingName = entity.xmlEncoding;

      assertEquals("xmlEncoding","uTf-16",encodingName);
       
},
/**
* 
Check the value of Entity.xmlEncoding on an external entity without an encoding
declaration is null.

* @author IBM
* @author Neil Delima
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-encoding
* @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Dec/0045.html
*/
entitygetxmlencoding04 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlencoding04") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var encodingName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent2");
      encodingName = entity.xmlEncoding;

      assertNull("xmlEncoding",encodingName);
    
},
/**
* 
	Call the getXmlVersion method on entity that is not an external entity and check if
	the value returned is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-version
*/
entitygetxmlversion01 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlversion01") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var entityVersion;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("epsilon");
      entityVersion = entity.xmlVersion;

      assertNull("entitygetxmlversion01",entityVersion);
    
},
/**
* 
	Call the getXmlVersion method on a UTF-16 encoded document that contains an external
	unparsed entity declaration and check if the value returned is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-version
*/
entitygetxmlversion02 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlversion02") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var entityVersion;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_utf16");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent5");
      entityVersion = entity.xmlVersion;

      assertNull("entitygetxmlversion02",entityVersion);
    
},
/**
* 
    Check that the value of Entity.xmlVersion on an external entity without
    a version declaration is null.

* @author IBM
* @author Neil Delima
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-version
* @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Dec/0045.html
*/
entitygetxmlversion03 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlversion03") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var entityVersion;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent2");
      entityVersion = entity.xmlVersion;

      assertNull("xmlVersionNull",entityVersion);
    
},
/**
* 
    Check that the value of Entity.xmlVersion on an external entity with
    a version declaration is "1.0".

* @author IBM
* @author Neil Delima
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Entity3-version
* @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Dec/0045.html
*/
entitygetxmlversion04 : function () {
   var success;
    if(checkInitialization(builder, "entitygetxmlversion04") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var entityVersion;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("ent1");
      entityVersion = entity.xmlVersion;

      assertEquals("xmlVersion10","1.0",entityVersion);
       
},
/**
* 
Add two CDATASection containing "]]>" and call Node.normalize
with an error handler that stops processing.  Only one of the
CDATASections should be split.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-split-cdata-sections
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ERRORS-DOMErrorHandler-handleError
*/
handleerror01 : function () {
   var success;
    if(checkInitialization(builder, "handleerror01") != null) return;
    var doc;
      var elem;
      var domConfig;
      var elemList;
      var newChild;
      var oldChild;
      var child;
      var childValue;
      var childType;
      var retval;
      var errors = new Array();

      errorHandler = new DOMErrorHandlerN10054();
	  
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      oldChild = elem.firstChild;

      newChild = doc.createCDATASection("this is not ]]> good");
      retval = elem.replaceChild(newChild,oldChild);
      newChild = doc.createCDATASection("this is not ]]> bad");
      retval = elem.appendChild(newChild);
      domConfig = doc.domConfig;

      domConfig.setParameter("split-cdata-sections", true);
	 domConfig.setParameter("error-handler", errorHandler.handleError);
	 doc.normalizeDocument();
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      child = elem.lastChild;

      childValue = child.nodeValue;

      
	if(
	("this is not ]]> bad" == childValue)
	) {
	childType = child.nodeType;

      assertEquals("lastChildCDATA",4,childType);
       child = elem.firstChild;

      childValue = child.nodeValue;

      assert("firstChildNotIntact","this is not ]]> good" != childValue);
      
	}
	
		else {
			child = elem.firstChild;

      childValue = child.nodeValue;

      assertEquals("firstChildIntact","this is not ]]> good",childValue);
       
		}
	
},
/**
* 
Normalize document with two DOM L1 nodes.
Use an error handler to continue from errors and check that more than one
error was reported.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespaces
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-ERRORS-DOMErrorHandler-handleError
*/
handleerror02 : function () {
   var success;
    if(checkInitialization(builder, "handleerror02") != null) return;
    var doc;
      var docElem;
      var domConfig;
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var brElem;
      var errors = new Array();

      errorHandler = new DOMErrorHandlerN10053(errors);
	  
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("error-handler", errorHandler.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      brElem = doc.createElement("br");
      retval = pElem.appendChild(brElem);
      brElem = doc.createElement("br");
      retval = pElem.appendChild(brElem);
      doc.normalizeDocument();
      assertSize("twoErrors",2,errors);

},
/**
* 
DOMImplementation.hasFeature("XML", "3.0") should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-5CED94D7
*/
hasFeature01 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature01") != null) return;
    var impl;
      var state;
      impl = getImplementation();
state = impl.hasFeature("xMl","3.0");
assertTrue("hasXML30",state);

},
/**
* 
DOMImplementation.hasFeature("XML", "3.0") should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-5CED94D7
*/
hasFeature02 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature02") != null) return;
    var impl;
      var state;
      impl = getImplementation();
state = impl.hasFeature("cOrE","3.0");
assertTrue("hasCore30",state);

},
/**
* 
DOMImplementation.hasFeature("XML", "3.0") should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-5CED94D7
*/
hasFeature03 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature03") != null) return;
    var impl;
      var state;
      impl = getImplementation();
state = impl.hasFeature("+cOrE","3.0");
assertTrue("hasPlusCore30",state);

},
/**
* 
DOMImplementation.hasFeature("XML", "3.0") should return true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-5CED94D7
*/
hasFeature04 : function () {
   var success;
    if(checkInitialization(builder, "hasFeature04") != null) return;
    var impl;
      var state;
      impl = getImplementation();
state = impl.hasFeature("+xMl","3.0");
assertTrue("hasXML30",state);

},
/**
* 
Normalize document with infoset set to true, check that
entity references are expanded and unused entity declaration are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset01 : function () {
   var success;
    if(checkInitialization(builder, "infoset01") != null) return;
    var doc;
      var pList;
      var pElem;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var entRef;
      var childValue;
      var entities;
      var ent2;
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = doc.createEntityReference("ent1");
      child = pElem.appendChild(entRef);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      child = pElem.lastChild;

      assertNotNull("lastChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChildName","#text",childName);
       childValue = child.nodeValue;

      assertEquals("firstChildValue","barfoo",childValue);
       doctype = doc.doctype;

      entities = doctype.entities;

      ent2 = entities.getNamedItem("ent2");
      assertNotNull("ent2NotNull",ent2);

},
/**
* 
Normalize document with infoset set to true, check that
unbound entity references are preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset02 : function () {
   var success;
    if(checkInitialization(builder, "infoset02") != null) return;
    var doc;
      var pList;
      var pElem;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var entRef;
      var childType;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = doc.createEntityReference("ent3");
      child = pElem.appendChild(entRef);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      child = pElem.lastChild;

      assertNotNull("lastChildNotNull",child);
childType = child.nodeType;

      assertEquals("lastChildEntRef",5,childType);
       childName = child.nodeName;

      assertEquals("lastChildName","ent3",childName);
       
},
/**
* 
Normalize document with infoset set to true,  
check if string values were not normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset03 : function () {
   var success;
    if(checkInitialization(builder, "infoset03") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      errorMonitor = new DOMErrorMonitor();
      
      var childNode;
      var childValue;
      var childLength;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "datatype_normalization2");
      domConfig = doc.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("infoset", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","code");
      element = elemList.item(0);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      childLength = childValue.length;
      assertEquals("content1",18,childLength);
       element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP  0001",childValue);
       element = elemList.item(2);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content3","EMP 0001",childValue);
       
	}
	
},
/**
* 
Normalize a document with a created CDATA section with the 
'infoset' to true and check if
the CDATASection has been coalesced.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=416
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset04 : function () {
   var success;
    if(checkInitialization(builder, "infoset04") != null) return;
    var doc;
      var elem;
      var newCdata;
      var cdata;
      var text;
      var nodeName;
      var nodeValue;
      var appendedChild;
      var domConfig;
      var pList;
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newCdata = doc.createCDATASection("CDATA");
      appendedChild = elem.appendChild(newCdata);
      domConfig = doc.domConfig;

      domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalization2Error", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      text = elem.lastChild;

      nodeName = text.nodeName;

      assertEquals("documentnormalizedocument03_false","#text",nodeName);
       nodeValue = text.nodeValue;

      assertEquals("normalizedValue","barCDATA",nodeValue);
       
},
/**
* 
Normalize document with infoset set to true, check that
namespace declaration attributes are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset05 : function () {
   var success;
    if(checkInitialization(builder, "infoset05") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var xmlnsAttr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     docElem = doc.documentElement;

      xmlnsAttr = docElem.getAttributeNode("xmlns");
      assertNotNull("xmlnsAttrNotNull",xmlnsAttr);

},
/**
* 
Create a document with an XML 1.1 valid but XML 1.0 invalid element and
normalize document with infoset set to true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset06 : function () {
   var success;
    if(checkInitialization(builder, "infoset06") != null) return;
    var domImpl;
      var nullString = null;

      var nullDoctype = null;

      var doc;
      var elem;
      var retval;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var locator;
      var relatedNode;
      domImpl = getImplementation();
doc = domImpl.createDocument(nullString,nullString,nullDoctype);
      
	{
		success = false;
		try {
            elem = doc.createElementNS("http://www.example.org/domts/wellformed01","LegalNameࢎ");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("xml10InvalidName",success);
	}

      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        elem = doc.createElementNS("http://www.example.org/domts/wellformed01","LegalNameࢎ");
      retval = doc.appendChild(elem);
      doc.xmlVersion = "1.0";

      domConfig = doc.domConfig;

      domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100A9 = 0;indexN100A9 < errors.length; indexN100A9++) {
      error = errors[indexN100A9];
      severity = error.severity;

      assertEquals("severity",2,severity);
       type = error.type;

      assertEquals("type","wf-invalid-character-in-node-name",type);
       locator = error.location;

      relatedNode = locator.relatedNode;

      assertSame("relatedNode",elem,relatedNode);

	}
   assertSize("oneError",1,errors);

},
/**
* 
Create a document with an XML 1.1 valid but XML 1.0 invalid attribute and
normalize document with infoset set to true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset07 : function () {
   var success;
    if(checkInitialization(builder, "infoset07") != null) return;
    var domImpl;
      var nullDoctype = null;

      var doc;
      var docElem;
      var attr;
      var retval;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var locator;
      var relatedNode;
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDoctype);
      docElem = doc.documentElement;

      
	{
		success = false;
		try {
            attr = doc.createAttribute("LegalNameࢎ");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("xml10InvalidName",success);
	}

      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        docElem.setAttribute("LegalNameࢎ","foo");
      attr = docElem.getAttributeNode("LegalNameࢎ");
      doc.xmlVersion = "1.0";

      domConfig = doc.domConfig;

      domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100AA = 0;indexN100AA < errors.length; indexN100AA++) {
      error = errors[indexN100AA];
      severity = error.severity;

      assertEquals("severity",2,severity);
       type = error.type;

      assertEquals("type","wf-invalid-character-in-node-name",type);
       locator = error.location;

      relatedNode = locator.relatedNode;

      assertSame("relatedNode",attr,relatedNode);

	}
   assertSize("oneError",1,errors);

},
/**
* 
Normalize document with infoset and validation set to true, check that
whitespace in element content is preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset08 : function () {
   var success;
    if(checkInitialization(builder, "infoset08") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      errorMonitor = new DOMErrorMonitor();
      
      var child;
      var childName;
      var text;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 
	if(
	(getImplementationAttribute("ignoringElementContentWhitespace") == true)
	) {
	bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      text = doc.createTextNode("    ");
      child = body.insertBefore(text,child);
      
	}
	doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     bodyList = doc.getElementsByTagName("body");
      body = bodyList.item(0);
      child = body.firstChild;

      assertNotNull("firstChildNotNull",child);
childName = child.nodeName;

      assertEquals("firstChild","#text",childName);
       child = child.nextSibling;

      assertNotNull("secondChildNotNull",child);
childName = child.nodeName;

      assertEquals("secondChild","p",childName);
       
},
/**
* 
	Append a Comment node and normalize with "infoset" set to true.

* @author Curt Arnold
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-infoset
*/
infoset09 : function () {
   var success;
    if(checkInitialization(builder, "infoset09") != null) return;
    var doc;
      var elem;
      var newComment;
      var lastChild;
      var text;
      var nodeName;
      var appendedChild;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      newComment = doc.createComment("COMMENT_NODE");
      appendedChild = elem.appendChild(newComment);
      domConfig = doc.domConfig;

      domConfig.setParameter("comments", false);
	 domConfig.setParameter("infoset", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizationError", 2);
     pList = doc.getElementsByTagName("p");
      elem = pList.item(0);
      lastChild = elem.lastChild;

      nodeName = lastChild.nodeName;

      assertEquals("commentPreserved","#comment",nodeName);
       
},
/**
* 
Normalize document with namespace-declarations set to true, check that
namespace declaration attributes are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespace-declarations
*/
namespacedeclarations01 : function () {
   var success;
    if(checkInitialization(builder, "namespacedeclarations01") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var xmlnsAttr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("namespace-declarations", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     docElem = doc.documentElement;

      xmlnsAttr = docElem.getAttributeNode("xmlns");
      assertNotNull("xmlnsAttrNotNull",xmlnsAttr);

},
/**
* 
Normalize document with namespace-declarations set to true, check that
namespace declaration attributes are maintained.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-namespace-declarations
*/
namespacedeclarations02 : function () {
   var success;
    if(checkInitialization(builder, "namespacedeclarations02") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var xmlnsAttr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("namespace-declarations", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     docElem = doc.documentElement;

      xmlnsAttr = docElem.getAttributeNode("xmlns");
      assertNull("xmlnsAttrNull",xmlnsAttr);
    
},
/**
* 
An attempt to add a second doctype node should result in a HIERARCHY_REQUEST_ERR
or a NOT_SUPPORTED_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-184E7107
*/
nodeappendchild01 : function () {
   var success;
    if(checkInitialization(builder, "nodeappendchild01") != null) return;
    var doc;
      var domImpl;
      var docType;
      var nullPubId = null;

      var nullSysId = null;

      var appendedChild;
      var tagName;
      var docElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      tagName = docElem.tagName;

      domImpl = doc.implementation;
docType = domImpl.createDocumentType(tagName,nullPubId,nullSysId);
      
      try {
      appendedChild = doc.appendChild(docType);
      fail("throw_HIERARCHY_REQUEST_OR_NOT_SUPPORTED");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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
An attempt to add a second document element should result in a HIERARCHY_REQUEST_ERR
or a NOT_SUPPORTED_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-184E7107
*/
nodeappendchild02 : function () {
   var success;
    if(checkInitialization(builder, "nodeappendchild02") != null) return;
    var doc;
      var newElem;
      var appendedChild;
      var tagName;
      var rootNS;
      var docElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      tagName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      newElem = doc.createElementNS(rootNS,tagName);
      
      try {
      appendedChild = doc.appendChild(newElem);
      fail("throw_HIERARCHY_REQUEST_OR_NOT_SUPPORTED");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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


	
	Using compareDocumentPosition to check if a Document node contains and precedes its documentType and
	node and if the DocumentTypeNode is contained and follows its Document node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition01 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition01") != null) return;
    var doc;
      var docType;
      var documentPositionDoc;
      var documentPositionDocType;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      documentPositionDoc = doc.compareDocumentPosition(docType);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing01",20,documentPositionDoc);
       documentPositionDocType = docType.compareDocumentPosition(doc);
      assertEquals("nodecomparetreepositionContainsPRECEDING01",10,documentPositionDocType);
       
},
/**
* 
	Using compareDocumentPosition to check if a Document node contains and precedes its new DocumentType and
	node and if the new DocumentType Node is contained and follows its Document node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition02 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition02") != null) return;
    var doc;
      var domImpl;
      var newDocType;
      var docType;
      var documentPositionDoc;
      var documentPositionDocType;
      var nullPubId = null;

      var nullSysId = null;

      var replaced;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      rootName = docType.name;

      domImpl = doc.implementation;
newDocType = domImpl.createDocumentType(rootName,nullPubId,nullSysId);
      replaced = doc.replaceChild(newDocType,docType);
      documentPositionDoc = doc.compareDocumentPosition(newDocType);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing02",20,documentPositionDoc);
       documentPositionDocType = newDocType.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING02",10,documentPositionDocType);
       
},
/**
* 
	Using compareDocumentPosition check if the document position of two Document nodes obtained from the 
	same xml document is disconnected, implementation specific, and that the order of these two documents
	is reserved.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition03 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition03") != null) return;
    var doc;
      var docComp;
      var documentPosition1;
      var documentPosition2;
      var documentPosition3;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      var docCompRef = null;
      if (typeof(this.docComp) != 'undefined') {
        docCompRef = this.docComp;
      }
      docComp = load(docCompRef, "docComp", "hc_staff");
      documentPosition1 = doc.compareDocumentPosition(docComp);
      assertEquals("isImplSpecificDisconnected1",33,documentPosition1);
       documentPosition2 = docComp.compareDocumentPosition(doc);
      assert("notBothPreceding",documentPosition1 != documentPosition2);
      assert("notBothFollowing",documentPosition1 != documentPosition2);
      assertEquals("isImplSpecificDisconnected2",33,documentPosition2);
       documentPosition3 = doc.compareDocumentPosition(docComp);
      assertEquals("isConsistent",documentPosition1,documentPosition3);
       
},
/**
* 	
	Using compareDocumentPosition to check that no flags are set in return when the document position of a 
	Document node is compared with itself

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition04 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition04") != null) return;
    var doc;
      var documentPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      documentPosition = doc.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionNoFlags04",0,documentPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the document position of a Document and a new Document node
	are disconnected, implementation-specific and preceding/following.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition05 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition05") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var documentPosition1;
      var documentPosition2;
      var documentPosition3;
      var nullDocType = null;

      var rootName;
      var rootNS;
      var docElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      documentPosition1 = doc.compareDocumentPosition(newDoc);
      assertEquals("isImplSpecificDisconnected1",33,documentPosition1);
       documentPosition2 = newDoc.compareDocumentPosition(doc);
      assertEquals("isImplSpecificDisconnected2",33,documentPosition2);
       assert("notBothPreceding",documentPosition1 != documentPosition2);
      assert("notBothFollowing",documentPosition1 != documentPosition2);
      documentPosition3 = doc.compareDocumentPosition(newDoc);
      assertEquals("isConsistent",documentPosition1,documentPosition3);
       
},
/**
* 


	
	Using compareDocumentPosition check if the document position of a Document node contains and precedes 
	its DocumentElement, and the DocumentElement is contained and follows the Document node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition06 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition06") != null) return;
    var doc;
      var docElem;
      var documentPositionDoc;
      var documentPositionDocElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      documentPositionDoc = doc.compareDocumentPosition(docElem);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing06",20,documentPositionDoc);
       documentPositionDocElem = docElem.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpotionContainsPRECEDING06",10,documentPositionDocElem);
       
},
/**
* 
	Using compareDocumentPosition check if the document compared contains and precedes the new
	newElement, and the newElement is contained and follows the document.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition07 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition07") != null) return;
    var doc;
      var docElem;
      var newElem;
      var documentPosition;
      var documentElementPosition;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      newElem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");
      appendedChild = docElem.appendChild(newElem);
      documentPosition = doc.compareDocumentPosition(newElem);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing07",20,documentPosition);
       documentElementPosition = newElem.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionContainedPRECEDING07",10,documentElementPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the Document node contains and precedes an Element,
	and the Element is contained and follows the Document node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition08 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition08") != null) return;
    var doc;
      var elem;
      var elemList;
      var documentPosition;
      var elementPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      documentPosition = doc.compareDocumentPosition(elem);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing08",20,documentPosition);
       elementPosition = elem.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING08",10,elementPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the Element node is contained and follows the appended Document node, and
	if the Document node contains and precedes the Element node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition09 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition09") != null) return;
    var doc;
      var elem;
      var newElem;
      var elemList;
      var documentPosition;
      var documentElementPosition;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      newElem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");
      appendedChild = elem.appendChild(newElem);
      documentPosition = doc.compareDocumentPosition(newElem);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing09",20,documentPosition);
       documentElementPosition = newElem.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING09",10,documentElementPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the document node precedes and contains its default Attr node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition10 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition10") != null) return;
    var doc;
      var elem;
      var dir;
      var elemList;
      var attrPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      elemList = elem.getElementsByTagName("acronym") 
      elem = elemList.item(0);
      dir = elem.getAttributeNode("title");
      attrPosition = dir.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionPRECEDINGContains10",10,attrPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the Document node precedes and contains the Attr node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition11 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition11") != null) return;
    var doc;
      var elem;
      var newAttr;
      var elemList;
      var documentPosition;
      var attrPosition;
      var replacedAttr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      newAttr = doc.createAttribute("title");
      replacedAttr = elem.setAttributeNode(newAttr);
      attrPosition = newAttr.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionPRECEDINGContains11",10,attrPosition);
       
},
/**
* 
	Using compareDocumentPosition to check if a new ProcessingInstruction node is contained and follows the
	Document node, and that the Document node contains and precedes the ProcessingInstruction node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition12 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition12") != null) return;
    var doc;
      var pi;
      var documentPosition;
      var piPosition;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      pi = doc.createProcessingInstruction("PITarget","PIDATA");
      appendedChild = doc.appendChild(pi);
      documentPosition = doc.compareDocumentPosition(pi);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing12",20,documentPosition);
       piPosition = pi.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING12",10,piPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the Document node contains and precedes the new Comment node, 
	and if the Comment node is contained and follows the Document node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition13 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition13") != null) return;
    var doc;
      var comment;
      var elem;
      var elemList;
      var documentPosition;
      var commentPosition;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      comment = doc.createComment("Another Comment");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      appendedChild = elem.appendChild(comment);
      documentPosition = doc.compareDocumentPosition(comment);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing13",20,documentPosition);
       commentPosition = comment.compareDocumentPosition(doc);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING13",10,commentPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the DocumentFragment node contains and precedes 	an Element 
	node appended to it, and that the Element node is contained and follows the DocumentFragment node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition14 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition14") != null) return;
    var doc;
      var docFrag;
      var docElem;
      var docFragChild;
      var docFragPosition;
      var docFragChildPosition;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      docFrag = doc.createDocumentFragment();
      appendedChild = docFrag.appendChild(docElem);
      docFragChild = docFrag.firstChild;

      docFragPosition = docFrag.compareDocumentPosition(docFragChild);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING14",20,docFragPosition);
       docFragChildPosition = docFragChild.compareDocumentPosition(docFrag);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing14",10,docFragChildPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the Element node precedes and contains its Attr child, and that the Attr child
	is contained and follows the Element node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition15 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition15") != null) return;
    var doc;
      var docFrag;
      var docElem;
      var attr;
      var docFragChild;
      var attrPosition;
      var docFragChildPosition;
      var appendedChild;
      var attrNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      docFrag = doc.createDocumentFragment();
      attr = doc.createAttribute("title");
      docElem.setAttributeNode(attr);
      docFrag.appendChild(docElem);
      docFragChild = docFrag.firstChild;

      docFragChildPosition = docFragChild.compareDocumentPosition(attr);
      assertEquals("nodecomparedocumentpositionIsContainedFollows15",20,docFragChildPosition);
       attrPosition = attr.compareDocumentPosition(docFragChild);
      assertEquals("nodecomparedocumentpositionPRECEEDINGContains15",10,attrPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the document position of a DocumentFragment node compared with
	a cloned Attr node is disconnected and implementation specific, and that the order between these two
	nodes is preserved.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition16 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition16") != null) return;
    var doc;
      var docFrag;
      var attr;
      var attrCloned;
      var docFragPosition;
      var position1;
      var position2;
      var position3;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      attrCloned = attr.cloneNode(true);
      position1 = docFrag.compareDocumentPosition(attrCloned);
      assertEquals("isImplSpecificDisconnected1",33,position1);
       position2 = attrCloned.compareDocumentPosition(docFrag);
      assert("notBothPreceding",position1 != position2);
      assert("notBothFollowing",position1 != position2);
      assertEquals("isImplSpecificDisconnected2",33,position2);
       position3 = docFrag.compareDocumentPosition(attrCloned);
      assertEquals("isConsistent",position1,position3);
       
},
/**
* 
	Using compareDocumentPosition check if the document position of the first ProcessingInstruction node compared to 
	this second newly apended ProcessingInstruction node is PRECEDING, and FOLLOWING vice versa.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition17 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition17") != null) return;
    var doc;
      var pi1;
      var pi2;
      var pi1Position;
      var pi2Position;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      pi1 = doc.createProcessingInstruction("PI1","");
      pi2 = doc.createProcessingInstruction("PI2","");
      appendedChild = doc.appendChild(pi1);
      appendedChild = doc.appendChild(pi2);
      pi1Position = pi1.compareDocumentPosition(pi2);
      assertEquals("nodecomparedocumentpositionFollowing17",4,pi1Position);
       pi2Position = pi2.compareDocumentPosition(pi1);
      assertEquals("nodecomparedocumentpositionPRECEDING17",2,pi2Position);
       
},
/**
* 
	Using compareDocumentPosition check if the document position of the first new Text node compared to the
	second text node is PRECEDING and is FOLLOWING vice versa.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition18 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition18") != null) return;
    var doc;
      var docElem;
      var txt1;
      var txt2;
      var txt1Position;
      var txt2Position;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      txt1 = doc.createTextNode("T1");
      txt2 = doc.createTextNode("T2");
      appendedChild = docElem.appendChild(txt1);
      appendedChild = docElem.appendChild(txt2);
      txt1Position = txt1.compareDocumentPosition(txt2);
      assertEquals("nodecomparedocumentpositionFollowing18",4,txt1Position);
       txt2Position = txt2.compareDocumentPosition(txt1);
      assertEquals("nodecomparedocumentpositionPRECEDING18",2,txt2Position);
       
},
/**
* 
	The method compareDocumentPosition compares a node with this node with regard to their position in the 
	document and according to the document order.
	
	Using compareDocumentPosition check if the document position of the first CDATASection node
	of the second element whose localName is name compared with the second CDATASection node
	is PRECEDING and is FOLLOWING vice versa.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition19 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition19") != null) return;
    var doc;
      var elemList;
      var elemStrong;
      var cdata1;
      var cdata2;
      var aNode;
      var cdata1Position;
      var cdata2Position;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagNameNS("*","strong");
      elemStrong = elemList.item(1);
      cdata2 = elemStrong.lastChild;

      aNode = cdata2.previousSibling;

      cdata1 = aNode.previousSibling;

      cdata1Position = cdata1.compareDocumentPosition(cdata2);
      assertEquals("nodecomparedocumentposition19_cdata2Follows",4,cdata1Position);
       cdata2Position = cdata2.compareDocumentPosition(cdata1);
      assertEquals("nodecomparedocumentposition_cdata1Precedes",2,cdata2Position);
       
},
/**
* 
	Using compareDocumentPosition check if the document position of the first Text node
	of the second element whose localName is name compared with the next CDATASection node
	is PRECEDING and FOLLOWING vice versa.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition20 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition20") != null) return;
    var doc;
      var elemList;
      var elemName;
      var cdata;
      var txt;
      var txtPosition;
      var cdataPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elemName = elemList.item(1);
      txt = elemName.firstChild;

      cdata = elemName.lastChild;

      txtPosition = txt.compareDocumentPosition(cdata);
      assertEquals("nodecomparedocumentpositionFollowingg20",4,txtPosition);
       cdataPosition = cdata.compareDocumentPosition(txt);
      assertEquals("nodecomparedocumentpositionPRECEDING20",2,cdataPosition);
       
},
/**
* 
	Using compareDocumentPosition check the document position of the text node of the fist and second elements 
	whose localName is name.  The first text node should return FOLLOWING and the second text node should
	return PRECEDING when compareDocumentPosition is invoked with the other node as a parameter. 
	

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition21 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition21") != null) return;
    var doc;
      var elemList;
      var elemName1;
      var elemName2;
      var txt1;
      var txt2;
      var txt1Position;
      var txt2Position;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elemName1 = elemList.item(0);
      elemName2 = elemList.item(1);
      txt1 = elemName1.firstChild;

      txt2 = elemName2.firstChild;

      txt1Position = txt1.compareDocumentPosition(txt2);
      assertEquals("nodecomparedocumentpositionFollowing21",4,txt1Position);
       txt2Position = txt2.compareDocumentPosition(txt1);
      assertEquals("nodecomparedocumentpositionPRECEDING21",2,txt2Position);
       
},
/**
* 
	Using compareDocumentPosition check if the Entity node precedes the Notation node and the Notation
	node follows the Entity node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition22 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition22") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var notationsMap;
      var entity;
      var notation;
      var entityPosition;
      var notationPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      notationsMap = docType.notations;

      entity = entitiesMap.getNamedItem("alpha");
      notation = notationsMap.getNamedItem("notation1");
      entityPosition = entity.compareDocumentPosition(notation);
      assertEquals("nodecomparedocumentpositionFollowing22",4,entityPosition);
       notationPosition = notation.compareDocumentPosition(entity);
      assertEquals("nodecomparedocumentpositionPRECEDING22",2,notationPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the document position of an Entity node compared to another
	Entity node following it in DocumentType is implementation specific.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition23 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition23") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var entity2;
      var position1;
      var position2;
      var position3;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("alpha");
      entity2 = entitiesMap.getNamedItem("delta");
      position1 = entity.compareDocumentPosition(entity2);
      assertEquals("isImplSpecificDisconnected1",32,position1);
       position2 = entity2.compareDocumentPosition(entity);
      assert("notBothPreceding",position1 != position2);
      assert("notBothFollowing",position1 != position2);
      assertEquals("isImplSpecificDisconnected2",32,position2);
       position3 = entity.compareDocumentPosition(entity2);
      assertEquals("isConsistent",position1,position3);
       
},
/**
* 
	Using compareDocumentPosition check if the return value of document position of a Notation node compared to another
	that is the same is not flagged.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition24 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition24") != null) return;
    var doc;
      var docType;
      var notaionsMap;
      var notation;
      var notation2;
      var notationPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      notaionsMap = docType.notations;

      notation = notaionsMap.getNamedItem("notation1");
      notation2 = notaionsMap.getNamedItem("notation1");
      notationPosition = notation.compareDocumentPosition(notation2);
      assertEquals("nodecomparedocumentposition24",0,notationPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the EntityReference or Text node is contained and follows its 
	parent Element node, and that the Element node contains and precedes the 
	EntityReference or Text node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition25 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition25") != null) return;
    var doc;
      var elemList;
      var elemName;
      var entRef;
      var elementPosition;
      var entRefPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("var");
      elemName = elemList.item(2);
      entRef = elemName.firstChild;

      elementPosition = elemName.compareDocumentPosition(entRef);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing25",20,elementPosition);
       entRefPosition = entRef.compareDocumentPosition(elemName);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING25",10,entRefPosition);
       
},
/**
* 
	Using compareDocumentPosition check if the EntityReference node contains and precedes it's first
	childElement, and that the childElement is contained and follows the EntityReference node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition26 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition26") != null) return;
    var doc;
      var varList;
      var varElem;
      var entRef;
      var entRefChild1;
      var entRefPosition;
      var entRefChild1Position;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
	if(
	(getImplementationAttribute("expandEntityReferences") == false)
	) {
	varList = doc.getElementsByTagName("var");
      varElem = varList.item(2);
      assertNotNull("varElemNotNull",varElem);
entRef = varElem.firstChild;

      assertNotNull("entRefNotNull",entRef);

	}
	
		else {
			entRef = doc.createEntityReference("ent4");
      
		}
	entRefChild1 = entRef.firstChild;

      assertNotNull("entRefChild1NotNull",entRefChild1);
entRefPosition = entRef.compareDocumentPosition(entRefChild1);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing26",20,entRefPosition);
       entRefChild1Position = entRefChild1.compareDocumentPosition(entRef);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING26",10,entRefChild1Position);
       
},
/**
* 
	Using compareDocumentPosition to check if the EntityReference node contains and precedes it's last
	childElement, and that this childElement is contained and follows the EntityReference node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition27 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition27") != null) return;
    var doc;
      var varList;
      var varElem;
      var entRef;
      var entRefChild1;
      var entRefPosition;
      var entRefChild1Position;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
	if(
	(getImplementationAttribute("expandEntityReferences") == false)
	) {
	varList = doc.getElementsByTagName("var");
      varElem = varList.item(2);
      assertNotNull("varElemNotNull",varElem);
entRef = varElem.firstChild;

      assertNotNull("entRefNotNull",entRef);

	}
	
		else {
			entRef = doc.createEntityReference("ent4");
      
		}
	entRefChild1 = entRef.lastChild;

      assertNotNull("entRefChild1NotNull",entRefChild1);
entRefPosition = entRef.compareDocumentPosition(entRefChild1);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing27",20,entRefPosition);
       entRefChild1Position = entRefChild1.compareDocumentPosition(entRef);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING",10,entRefChild1Position);
       
},
/**
* 
	Using compareDocumentPosition check the document position of the EntityReference node ent4's
	first child and last child.  Invoke compareDocumentPositon on first child with last child as a parameter
	should return FOLLOWING, and should return PRECEDING vice versa.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition28 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition28") != null) return;
    var doc;
      var varList;
      var varElem;
      var entRef;
      var entRefChild1;
      var entRefChild2;
      var entRefChild1Position;
      var entRefChild2Position;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
	if(
	(getImplementationAttribute("expandEntityReferences") == false)
	) {
	varList = doc.getElementsByTagName("var");
      varElem = varList.item(2);
      assertNotNull("varElemNotNull",varElem);
entRef = varElem.firstChild;

      assertNotNull("entRefNotNull",entRef);

	}
	
		else {
			entRef = doc.createEntityReference("ent4");
      
		}
	entRefChild1 = entRef.firstChild;

      assertNotNull("entRefChild1NotNull",entRefChild1);
entRefChild2 = entRef.lastChild;

      assertNotNull("entRefChild2NotNull",entRefChild2);
entRefChild1Position = entRefChild1.compareDocumentPosition(entRefChild2);
      assertEquals("nodecomparedocumentpositionFollowing28",4,entRefChild1Position);
       entRefChild2Position = entRefChild2.compareDocumentPosition(entRefChild1);
      assertEquals("nodecomparedocumentpositionPRECEDING28",2,entRefChild2Position);
       
},
/**
* 
	Create two entity reference nodes. Using compareDocumentPosition to check if the child of the first Entity 
	Ref node precedes the child of the second Entity Ref node, and that the child of the second Entity Ref node
	follows the child of the first Entity Ref node.  

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition29 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition29") != null) return;
    var doc;
      var docElem;
      var entRef1;
      var entRef2;
      var entRefChild1;
      var entRefChild2;
      var entRefChild1Position;
      var entRefChild2Position;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      entRef1 = doc.createEntityReference("ent4");
      entRef2 = doc.createEntityReference("ent4");
      docElem = doc.documentElement;

      appendedChild = docElem.appendChild(entRef1);
      appendedChild = docElem.appendChild(entRef2);
      entRefChild1 = entRef1.firstChild;

      assertNotNull("entRefChild1NotNull",entRefChild1);
entRefChild2 = entRef2.lastChild;

      assertNotNull("entRefChild2NotNull",entRefChild2);
entRefChild1Position = entRefChild1.compareDocumentPosition(entRefChild2);
      assertEquals("nodecomparedocumentpositionFollowing29",4,entRefChild1Position);
       entRefChild2Position = entRefChild2.compareDocumentPosition(entRefChild1);
      assertEquals("nodecomparedocumentpositionPRECEDING29",2,entRefChild2Position);
       
},
/**
* 
	Using compareTreePosition check if comparedocumentposition invoked on the first name with 
	the first position node as a parameter returns FOLLOWING.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition30 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition30") != null) return;
    var doc;
      var nameList;
      var positionList;
      var strong;
      var code;
      var namePosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      nameList = doc.getElementsByTagName("strong");
      strong = nameList.item(0);
      positionList = doc.getElementsByTagName("code");
      code = positionList.item(0);
      namePosition = code.compareDocumentPosition(strong);
      assertEquals("nodecomparedocumentpositionFollowing30",2,namePosition);
       
},
/**
* 
	Using compareDocumentPosition to check if invoking the method on the first name node with
	a new node appended to the second position node as a parameter is FOLLOWING, and is PRECEDING vice versa

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition31 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition31") != null) return;
    var doc;
      var nameList;
      var positionList;
      var strong;
      var code;
      var newElem;
      var namePosition;
      var elemPosition;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      nameList = doc.getElementsByTagName("strong");
      strong = nameList.item(0);
      positionList = doc.getElementsByTagName("code");
      code = positionList.item(1);
      newElem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");
      appendedChild = code.appendChild(newElem);
      namePosition = strong.compareDocumentPosition(newElem);
      assertEquals("nodecomparedocumentpositionFollowing31",4,namePosition);
       elemPosition = newElem.compareDocumentPosition(strong);
      assertEquals("nodecomparedocumentpositionPRECEDING31",2,elemPosition);
       
},
/**
* 
	Using compareDocumentPosition to check if the document position returned by comparing the first name with
	a first position node of another document reference and adopted by the first as a parameter is FOLLOWING.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition32 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition32") != null) return;
    var doc;
      var doc2;
      var nameList;
      var positionList;
      var strong;
      var code;
      var documentPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc2 =  doc;
nameList = doc.getElementsByTagName("strong");
      strong = nameList.item(0);
      positionList = doc2.getElementsByTagName("code");
      code = positionList.item(0);
      documentPosition = strong.compareDocumentPosition(code);
      assertEquals("nodecomparedocumentpositionFollowing32",4,documentPosition);
       
},
/**
* 
	Create a new Element node, add a new atttribute node to it.  Compare the position 
	of the Element and the Document.  This should return disconnected, implementation specific, and that
	the order of these two nodes is preserved. 
	Also compare the position of the Element node with respect to the Attr node and this should
	be PRECEDING and contains, and the Attr node follows and is contained by the Element node

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition33 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition33") != null) return;
    var doc;
      var elem;
      var attr;
      var position1;
      var position2;
      var position3;
      var position4;
      var position5;
      var replacedAttr;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      replacedAttr = elem.setAttributeNodeNS(attr);
      position4 = elem.compareDocumentPosition(attr);
      assertEquals("nodecomparedocumentposition3FollowingisContained33",20,position4);
       position5 = attr.compareDocumentPosition(elem);
      assertEquals("nodecomparedocumentposition4ContainsPRECEDING33",10,position5);
       position1 = doc.compareDocumentPosition(elem);
      assertEquals("isImplSpecificDisconnected1",33,position1);
       position2 = elem.compareDocumentPosition(doc);
      assert("notBothPreceding",position1 != position2);
      assert("notBothFollowing",position1 != position2);
      assertEquals("isImplSpecificDisconnected2",33,position2);
       position3 = doc.compareDocumentPosition(elem);
      assertEquals("isConsistent",position1,position3);
       
},
/**
* 
	Create a new Element node, add new Text, Element and Processing Instruction nodes to it.
	Using compareDocumentPosition, compare the position of the Element with respect to the Text
	and the Text with respect to the Processing Instruction.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition34 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition34") != null) return;
    var doc;
      var elemMain;
      var elem;
      var txt;
      var pi;
      var elementToTxtPosition;
      var txtToPiPosition;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemMain = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");
      txt = doc.createTextNode("TEXT");
      pi = doc.createProcessingInstruction("PIT","PID");
      appendedChild = elemMain.appendChild(txt);
      appendedChild = elemMain.appendChild(elem);
      appendedChild = elemMain.appendChild(pi);
      elementToTxtPosition = txt.compareDocumentPosition(elem);
      assertEquals("nodecomparedocumentpositionFollowing34",4,elementToTxtPosition);
       txtToPiPosition = pi.compareDocumentPosition(txt);
      assertEquals("nodecomparedocumentpositionPRECEDING34",2,txtToPiPosition);
       
},
/**
* 
	Using compareDocumentPosition to check if the Element contains and precedes its default attribute 
	and that the attribute follows and iscontained by the Element

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition35 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition35") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr;
      var elementPosition;
      var attrPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attr = elem.getAttributeNode("dir");
      elementPosition = elem.compareDocumentPosition(attr);
      assertEquals("nodecomparedocumentpositionIsContainedFollowing35",20,elementPosition);
       attrPosition = attr.compareDocumentPosition(elem);
      assertEquals("nodecomparedocumentpositionPRECEDINGContains35",10,attrPosition);
       
},
/**
* 
	Using compareDocumentPosition to check if the document position of an Attribute compared with
	the element that follows its parent as a parameter is FOLLOWING, and is PRECEDING
	vice versa.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition36 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition36") != null) return;
    var doc;
      var elemList;
      var elem;
      var elemListFollows;
      var elemFollows;
      var attr;
      var attrPosition;
      var elemFollowsPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attr = doc.createAttribute("title");
      elem.setAttributeNode(attr);
      elemListFollows = doc.getElementsByTagName("strong");
      elemFollows = elemListFollows.item(3);
      attrPosition = attr.compareDocumentPosition(elemFollows);
      assertEquals("nodecomparedocumentpositionFollowing36",4,attrPosition);
       elemFollowsPosition = elemFollows.compareDocumentPosition(attr);
      assertEquals("nodecomparedocumentpositionPRECEEDING36",2,elemFollowsPosition);
       
},
/**
* 
	Using compareDocumentPosition to check if the document position of the first class attribute
	of the element acronym when compared with the elements text content as a parameter is 
	is FOLLOWING, and is PRECEDING vice versa.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition37 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition37") != null) return;
    var doc;
      var elemList;
      var elem;
      var txt;
      var attr;
      var attrPosition;
      var txtPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      attr = elem.getAttributeNode("class");
      txt = elem.firstChild;

      attrPosition = attr.compareDocumentPosition(txt);
      assertEquals("nodecomparetreepositionFollowing37",4,attrPosition);
       txtPosition = txt.compareDocumentPosition(attr);
      assertEquals("nodecomparetreepositionPRECEDING37",2,txtPosition);
       
},
/**
* 
	Using compareDocumentPosition to check if the class's attribute contains and precedes it's content, 
	and the content node is contained and follows the attribute node.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition38 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition38") != null) return;
    var doc;
      var elemList;
      var elem;
      var txt;
      var attr;
      var attrPosition;
      var attrChildPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      attr = elem.getAttributeNode("class");
      txt = attr.firstChild;
      attrPosition = attr.compareDocumentPosition(txt);
      assertEquals("nodecomparedocumentpositionIsContainsFollowing38",20,attrPosition);
       attrChildPosition = txt.compareDocumentPosition(attr);
      assertEquals("nodecomparedocumentpositionContainsPRECEDING38",10,attrChildPosition);
       
},
/**
* 
	Using compareDocumentPosition to check if the document position of the class's attribute 
	when compared with the local1 attribute node is implementation_specific.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition39 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition39") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr1;
      var attr2;
      var attrPosition;
      var swappedPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      attr1 = elem.getAttributeNode("class");
      attr2 = elem.getAttributeNode("xsi:noNamespaceSchemaLocation");
      attrPosition = attr1.compareDocumentPosition(attr2);
      assertEquals("isImplementationSpecific",32,attrPosition);
       assertEquals("otherBitsZero",0,attrPosition);
       assert("eitherFollowingOrPreceding",0 != attrPosition);
      swappedPosition = attr2.compareDocumentPosition(attr1);
      assert("onlyOnePreceding",swappedPosition != attrPosition);
      assert("onlyOneFollowing",swappedPosition != attrPosition);
      
},
/**
* 
	Using compareDocumentPosition to check if the document position of the class's attribute 
	when compared with a new attribute node is implementation_specific

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-compareDocumentPosition
*/
nodecomparedocumentposition40 : function () {
   var success;
    if(checkInitialization(builder, "nodecomparedocumentposition40") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr1;
      var attr2;
      var attrPosition;
      var swappedPosition;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      attr1 = elem.getAttributeNode("class");
      elem.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang","FR-fr");
      attr2 = elem.getAttributeNode("xml:lang");
      attrPosition = attr1.compareDocumentPosition(attr2);
      assertEquals("isImplementationSpecific",32,attrPosition);
       assertEquals("otherBitsZero",0,attrPosition);
       assert("eitherFollowingOrPreceding",0 != attrPosition);
      swappedPosition = attr2.compareDocumentPosition(attr1);
      assert("onlyOnePreceding",swappedPosition != attrPosition);
      assert("onlyOneFollowing",swappedPosition != attrPosition);
      
},
/**
* 
Call Node.getBaseURI() on a test document.  Should be not-null and same as Document.getDocumentURI().

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Document
*/
nodegetbaseuri01 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri01") != null) return;
    var doc;
      var baseURI;
      var documentURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      baseURI = doc.baseURI;

      assertURIEquals("notNull",null,null,null,null,"barfoo",null,null,true,baseURI);
documentURI = doc.documentURI;

      assertEquals("sameAsDocumentURI",documentURI,baseURI);
       
},
/**
* 
	Using getBaseURI check if the baseURI attribute of a new Document node is null
	and if affected by changes in Document.documentURI.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Document
*/
nodegetbaseuri02 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var baseURI;
      var rootNS;
      var rootName;
      var docElem;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      baseURI = newDoc.baseURI;

      assertNull("baseURIIsNull",baseURI);
    newDoc.documentURI = "http://www.example.com/sample.xml";

      baseURI = newDoc.baseURI;

      assertEquals("baseURISameAsDocURI","http://www.example.com/sample.xml".toLowerCase(),baseURI.toLowerCase());
       
},
/**
* 
Check that Node.baseURI is null for a DocumentType as defined in the Infoset Mapping (Appendix C).

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2DocumentType
*/
nodegetbaseuri03 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri03") != null) return;
    var doc;
      var docType;
      var baseURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docType = doc.doctype;

      baseURI = docType.baseURI;

      assertNull("nodegetbaseuri03",baseURI);
    
},
/**
* 
Node.baseURI for a document element without an xml:base attribute should be same as Document.documentURI.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Document
*/
nodegetbaseuri04 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri04") != null) return;
    var doc;
      var docElem;
      var baseURI;
      var documentURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      baseURI = docElem.baseURI;

      assertURIEquals("baseURI",null,null,null,null,"barfoo",null,null,true,baseURI);
documentURI = doc.documentURI;

      assertEquals("baseURIEqualsDocURI",documentURI,baseURI);
       
},
/**
* 
	Using getBaseURI check if the baseURI attribute of this DocumentElement is http://www.w3.org/DOM/L3Test.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Element
*/
nodegetbaseuri05 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri05") != null) return;
    var doc;
      var docElem;
      var baseURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      docElem = doc.documentElement;

      baseURI = docElem.baseURI;

      assertEquals("nodegetbaseuri05","http://www.w3.org/DOM/L3Test",baseURI);
       
},
/**
* 
	TODO Clarification: Create a new Element in this document.  Since its baseURI should be the baseURI of
	the Document Entity which I assume is not null, using getBaseURI check if the baseURI 
	attribute of this Element node is not null.???

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Element
*/
nodegetbaseuri06 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri06") != null) return;
    var doc;
      var newElement;
      var baseURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      newElement = doc.createElementNS("http://www.w3.org/1999/xhtml","br");
      baseURI = doc.baseURI;

      assertNotNull("nodegetbaseuri06",baseURI);

},
/**
* 
	Append a created element to a document and check that its baseURI
	is inherited from its parent.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Element
*/
nodegetbaseuri07 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri07") != null) return;
    var doc;
      var newElement;
      var baseURI;
      var appended;
      var bodyList;
      var bodyElem;
      var htmlNS = "http://www.w3.org/1999/xhtml";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      newElement = doc.createElementNS(htmlNS,"meta");
      newElement.setAttribute("content","text/xml");
      appended = bodyElem.appendChild(newElement);
      baseURI = newElement.baseURI;

      assertEquals("nodegetbaseuri07","http://www.w3.org/DOM/EmployeeID",baseURI);
       
},
/**
* 
Get the baseURI value on an element with an explicit xml:base attribute.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Element
*/
nodegetbaseuri09 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri09") != null) return;
    var doc;
      var bodyElem;
      var bodyList;
      var baseURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      baseURI = bodyElem.baseURI;

      assertEquals("nodegetbaseuri09","http://www.w3.org/DOM/EmployeeID",baseURI);
       
},
/**
* 
	Append as a child of this documentElement a new Processing Instruction.  Using getBaseURI 
	check if the baseURI attribute of the new Processing Instruction node is "'http://www.w3.org/DOM/L3Test".

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2ProcessingInstruction
*/
nodegetbaseuri10 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri10") != null) return;
    var doc;
      var docElem;
      var newPI;
      var baseURI;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      docElem = doc.documentElement;

      newPI = doc.createProcessingInstruction("TARGET","DATA");
      appendedChild = docElem.appendChild(newPI);
      baseURI = newPI.baseURI;

      assertEquals("nodegetbaseuri10","http://www.w3.org/DOM/L3Test",baseURI);
       
},
/**
* 
	Import a new Processing Instruction of a new Document after the document element.  Using getBaseURI 
	check if the baseURI attribute of the new Processing Instruction node is the same as Document.documentURI.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2ProcessingInstruction
*/
nodegetbaseuri11 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri11") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var newPI;
      var imported;
      var baseURI;
      var docURI;
      var appendedChild;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDocType);
      newPI = newDoc.createProcessingInstruction("TARGET","DATA");
      imported = doc.importNode(newPI,true);
      appendedChild = doc.appendChild(imported);
      baseURI = imported.baseURI;

      assertURIEquals("equalsBarfooBase",null,null,null,null,"barfoo_base",null,null,true,baseURI);
docURI = doc.documentURI;

      assertEquals("equalsDocURI",docURI,baseURI);
       
},
/**
* 
	Using getBaseURI verify if the entity epsilon is absolute
	and matches the URL of the document entity.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Entity
*/
nodegetbaseuri12 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri12") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var baseURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("epsilon");
      baseURI = entity.baseURI;

      assertURIEquals("entityBase",null,null,null,null,"hc_staff",null,null,true,baseURI);

},
/**
* 
	Using getBaseURI verify if the notation defined in an internal subset
	is the base URI of the document.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Notation
*/
nodegetbaseuri13 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri13") != null) return;
    var doc;
      var docType;
      var notationsMap;
      var notation;
      var baseURI;
      var docURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      notationsMap = docType.notations;

      notation = notationsMap.getNamedItem("notation1");
      baseURI = notation.baseURI;

      docURI = doc.documentURI;

      assertEquals("sameAsDocURI",docURI,baseURI);
       assertURIEquals("entityBase",null,null,null,null,"hc_staff",null,null,true,baseURI);

},
/**
* 
	Using getBaseURI verify if the imported notation notation2 is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Notation
*/
nodegetbaseuri14 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri14") != null) return;
    var doc;
      var newDoc;
      var docElem;
      var docElemNS;
      var docElemName;
      var domImpl;
      var docType;
      var notationsMap;
      var notation;
      var notationImported;
      var baseURI;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      docElemNS = docElem.namespaceURI;

      docElemName = docElem.localName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(docElemNS,docElemName,nullDocType);
      docType = doc.doctype;

      notationsMap = docType.notations;

      notation = notationsMap.getNamedItem("notation2");
      notationImported = newDoc.importNode(notation,true);
      baseURI = notationImported.baseURI;

      assertNull("nodegetbaseuri14",baseURI);
    
},
/**
* 
Node.getBaseURI for an Attr is null.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Attr
*/
nodegetbaseuri15 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri15") != null) return;
    var doc;
      var baseURI;
      var attrNode;
      var bodyList;
      var bodyElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      attrNode = bodyElem.getAttributeNode("id");
      baseURI = attrNode.baseURI;

      assertNull("baseURI",baseURI);
    
},
/**
* 
Node.getBaseURI for an EntityReference to should be the baseURI where the entity declaration occurs.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2EntityReference
*/
nodegetbaseuri16 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri16") != null) return;
    var doc;
      var baseURI;
      var entRef;
      var pList;
      var pElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      entRef = pElem.lastChild;

      baseURI = entRef.baseURI;

      assertURIEquals("baseURI",null,null,null,null,"external_barfoo",null,null,true,baseURI);

},
/**
* 
Node.getBaseURI for an text node is null.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Text
*/
nodegetbaseuri17 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri17") != null) return;
    var doc;
      var baseURI;
      var textNode;
      var pList;
      var pElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      textNode = pElem.firstChild;

      baseURI = textNode.baseURI;

      assertNull("baseURI",baseURI);
    
},
/**
* 
Node.getBaseURI for an comment node is null.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2Comment
*/
nodegetbaseuri18 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri18") != null) return;
    var doc;
      var baseURI;
      var comment;
      var pList;
      var pElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_base");
      pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      comment = pElem.nextSibling;

      baseURI = comment.baseURI;

      assertNull("baseURI",baseURI);
    
},
/**
* 
Checks baseURI for a text node is null.

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2DocumentType
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2EntityReference
*/
nodegetbaseuri19 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri19") != null) return;
    var doc;
      var baseURI;
      var entBaseURI;
      var entRef;
      var pList;
      var pElem;
      var textNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      assertNotNull("pElemNotNull",pElem);

	if(
	(getImplementationAttribute("expandEntityReferences") == true)
	) {
	textNode = pElem.firstChild;

      assertNotNull("expansionNotNull",textNode);

	}
	
		else {
			entRef = pElem.lastChild;

      assertNotNull("entRefNotNull",entRef);
textNode = entRef.firstChild;

      assertNotNull("entRefTextNotNull",textNode);

		}
	baseURI = textNode.baseURI;

      assertNull("baseURI",baseURI);
    
},
/**
* 
baseURI for an element from an entity reference should be the URI of the
external entity if there is now xml:base attribute. 

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-baseURI
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=419
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/infoset-mapping#Infoset2EntityReference
*/
nodegetbaseuri20 : function () {
   var success;
    if(checkInitialization(builder, "nodegetbaseuri20") != null) return;
    var doc;
      var baseURI;
      var pList;
      var pElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "external_barfoo");
      pList = doc.getElementsByTagName("p");
      pElem = pList.item(2);
      assertNotNull("pElemNotNull",pElem);
baseURI = pElem.baseURI;

      assertURIEquals("equalsExternalBarFoo",null,null,null,null,"external_widget",null,null,true,baseURI);

},
/**
* 
Check implementation of Node.getFeature on Document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature01 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature01") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node =  doc;
featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = doc.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = doc.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = doc.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = doc.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = doc.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = doc.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = doc.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = doc.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = doc.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on DocumentFragment.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature02 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature02") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.createDocumentFragment();
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on DocumentType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature03 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature03") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.doctype;

      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on EntityReference.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature04 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature04") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.createEntityReference("ent1");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on Element.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature05 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature05") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.documentElement;

      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on non-namespace attribute.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature06 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature06") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.createAttribute("title");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on namespaced attribute.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature07 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature07") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on ProcessingInstruction.

* @author Curt Arnold
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature08 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature08") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.createProcessingInstruction("test-pi","foo");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on Comment.

* @author Curt Arnold
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature09 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature09") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.createComment("test comment");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on Text.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature10 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature10") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      var nodeList;
      var elem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
nodeList = doc.getElementsByTagName("p");
      elem = nodeList.item(0);
      node = elem.firstChild;

      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on CDATASection.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature11 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature11") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
node = doc.createCDATASection("some text");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on Entity.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature12 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature12") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      var entities;
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
doctype = doc.doctype;

      entities = doctype.entities;

      node = entities.getNamedItem("ent1");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 
Check implementation of Node.getFeature on Notation.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getFeature
*/
nodegetfeature13 : function () {
   var success;
    if(checkInitialization(builder, "nodegetfeature13") != null) return;
    var doc;
      var node;
      var nullVersion = null;

      var featureImpl;
      var isSupported;
      var domImpl;
      var notations;
      var doctype;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
doctype = doc.doctype;

      notations = doctype.notations;

      node = notations.getNamedItem("notation1");
      featureImpl = node.getFeature("Core",nullVersion);
      assertSame("coreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("cOrE",nullVersion);
      assertSame("cOrEUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("+cOrE",nullVersion);
      assertSame("PlusCoreUnspecifiedVersion",node,featureImpl);
featureImpl = node.getFeature("org.w3c.domts.bogus.feature",nullVersion);
      assertNull("unrecognizedFeature",featureImpl);
    featureImpl = node.getFeature("cOrE","2.0");
      assertSame("Core20",node,featureImpl);
featureImpl = node.getFeature("cOrE","3.0");
      assertSame("Core30",node,featureImpl);
isSupported = node.isSupported("XML",nullVersion);
      featureImpl = node.getFeature("XML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("SVGUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("HTMLUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("Events",nullVersion);
      featureImpl = node.getFeature("Events",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("EventsUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS",nullVersion);
      featureImpl = node.getFeature("LS",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("LS-Async",nullVersion);
      featureImpl = node.getFeature("LS-Async",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("LSAsyncUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("XPath",nullVersion);
      featureImpl = node.getFeature("XPath",nullVersion);
      
	if(
	isSupported
	) {
	assertSame("XPathUnspecified",node,featureImpl);

	}
	isSupported = node.isSupported("+HTML",nullVersion);
      featureImpl = node.getFeature("HTML",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusHTMLUnspecified",featureImpl);

	}
	isSupported = node.isSupported("+SVG",nullVersion);
      featureImpl = node.getFeature("SVG",nullVersion);
      
	if(
	isSupported
	) {
	assertNotNull("PlusSVGUnspecified",featureImpl);

	}
	
},
/**
* 

	
	Using getTextContent on this Document node check if the value returned is Null .

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent01 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent01") != null) return;
    var doc;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textContent = doc.textContent;

      assertNull("nodegettextcontent01",textContent);
    
},
/**
* 

	
	Using getTextContent on a new Document node check if the value returned is Null .

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent02 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent02") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var textContent;
      var nullDocType = null;

      var docElem;
      var rootName;
      var rootNS;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      textContent = newDoc.textContent;

      assertNull("nodegettextcontent02",textContent);
    
},
/**
* 

	
	Using getTextContent on this DocumentType node check if the value returned is Null .

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent03 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent03") != null) return;
    var doc;
      var docType;
      var newDoc;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      textContent = docType.textContent;

      assertNull("nodegettextcontent03",textContent);
    
},
/**
* 

	
	Using getTextContent on a new DocumentType node check if the value returned is Null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent04 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent04") != null) return;
    var doc;
      var domImpl;
      var docType;
      var textContent;
      var nullPubId = null;

      var nullSysId = null;

      var oldDocType;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      oldDocType = doc.doctype;

      rootName = oldDocType.name;

      domImpl = doc.implementation;
docType = domImpl.createDocumentType(rootName,nullPubId,nullSysId);
      textContent = docType.textContent;

      assertNull("nodegettextcontent04",textContent);
    
},
/**
* 

	
	Using getTextContent on this DocumentType node check if the value returned is Null .

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent05 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent05") != null) return;
    var doc;
      var docType;
      var notationsMap;
      var notation1;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      notationsMap = docType.notations;

      notation1 = notationsMap.getNamedItem("notation1");
      textContent = docType.textContent;

      assertNull("nodegettextcontent05",textContent);
    
},
/**
* 

	
	Invoke the method getTextContent on a default Attr node and check if the value returned 
	is the attributes Value.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent06 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent06") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attr = elem.getAttributeNode("dir");
      textContent = attr.textContent;

      assertEquals("nodegettextcontent06","rtl",textContent);
       
},
/**
* 
	Invoke the method getTextContent on a new Attr node and check if the value returned 
	is the attributes Value.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent07 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent07") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      elem.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang","en-US");
      attr = elem.getAttributeNodeNS("http://www.w3.org/XML/1998/namespace","lang");
      textContent = attr.textContent;

      assertEquals("nodegettextcontent07","en-US",textContent);
       
},
/**
* 
	Invoke the method getTextContent on a new Attr node and check if the value returned 
	is the attributes Value.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent08 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent08") != null) return;
    var doc;
      var elemList;
      var elem;
      var att;
      var attr;
      var replacedAttr;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      att = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      replacedAttr = elem.setAttributeNodeNS(att);
      attr = elem.getAttributeNodeNS("http://www.w3.org/XML/1998/namespace","lang");
      textContent = attr.textContent;

      assertEquals("nodegettextcontent08","",textContent);
       
},
/**
* 
	Invoke the method getTextContent on a new Text node and check if the value returned 
	is the text content.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent09 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent09") != null) return;
    var doc;
      var elemList;
      var elem;
      var txt;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      txt = doc.createTextNode("Replacement Text");
      appendedChild = elem.appendChild(txt);
      textContent = txt.textContent;

      assertEquals("nodegettextcontent09","Replacement Text",textContent);
       
},
/**
* 

	
	Invoke the method getTextContent on an existing Text node and check if the value returned 
	is the elements Text content.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent10 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent10") != null) return;
    var doc;
      var elemList;
      var elem;
      var txt;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      txt = elem.firstChild;

      textContent = txt.textContent;

      assertEquals("nodegettextcontent10","EMP0001",textContent);
       
},
/**
* 

	
	Invoke the method getTextContent on an existing CDATASection node and check if the value returned 
	is the CDATASections content.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent11 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent11") != null) return;
    var doc;
      var elemList;
      var elem;
      var cdata;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(1);
      cdata = elem.lastChild;

      textContent = cdata.textContent;

      assertEquals("nodegettextcontent11","This is an adjacent CDATASection with a reference to a tab &tab;",textContent);
       
},
/**
* 
	Invoke the method getTextContent on a new Comment node and check if the value returned 
	is the Comments data.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent12 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent12") != null) return;
    var doc;
      var elemList;
      var elem;
      var comment;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","body");
      comment = doc.createComment("Comment");
      appendedChild = elem.appendChild(comment);
      textContent = comment.textContent;

      assertEquals("nodegettextcontent12","Comment",textContent);
       
},
/**
* 

	
	Invoke the method getTextContent on an existing Element node with Text and CDATA
	content and check if the value returned is a single concatenated String with its content.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent13 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent13") != null) return;
    var doc;
      var elemList;
      var elem;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(1);
      textContent = elem.textContent;

      assertEquals("nodegettextcontent13","Martha Raynolds\nThis is a CDATASection with EntityReference number 2 &ent2;\nThis is an adjacent CDATASection with a reference to a tab &tab;",textContent);
       
},
/**
* 
	Invoke the method getTextContent on an existing Element node with Child Element, Text 
	EntityReferences and Attributes and check if the value returned is a single 
	concatenated String with its content.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent14 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent14") != null) return;
    var doc;
      var elemList;
      var elem;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(2);
      textContent = elem.textContent;

      assertEquals("nodegettextcontent13","\n  EMP0003\n  Roger\n Jones\n  Department Manager\n  100,000\n  Element data\n  PO Box 27 Irving, texas 98553\n ",textContent);
       
},
/**
* 
	The method getTextContent returns the text content of this node and its descendants.
	
	Invoke the method getTextContent on a new Element node with new Text, EntityReferences  
	CDATASection, PI and Comment nodes and check if the value returned is a single 
	concatenated String with its content.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent15 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent15") != null) return;
    var doc;
      var elem;
      var txt;
      var comment;
      var entRef;
      var cdata;
      var pi;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/DOM/Test","dom3:elem");
      txt = doc.createTextNode("Text ");
      comment = doc.createComment("Comment ");
      entRef = doc.createEntityReference("beta");
      pi = doc.createProcessingInstruction("PIT","PIData ");
      cdata = doc.createCDATASection("CData");
      appendedChild = elem.appendChild(txt);
      appendedChild = elem.appendChild(comment);
      appendedChild = elem.appendChild(entRef);
      appendedChild = elem.appendChild(pi);
      appendedChild = elem.appendChild(cdata);
      textContent = elem.textContent;

      doc.normalizeDocument();
      assertEquals("nodegettextcontent15","Text βCData",textContent);
       
},
/**
* 
	The method getTextContent returns the text content of this node and its descendants.
	
	Invoke the method getTextContent on a new DocumentFragment node with new Text, EntityReferences  
	CDATASection, PI and Comment nodes and check if the value returned is a single 
	concatenated String with its content.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent16 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent16") != null) return;
    var doc;
      var docFrag;
      var elem;
      var elemChild;
      var txt;
      var comment;
      var entRef;
      var cdata;
      var pi;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      elem = doc.createElementNS("http://www.w3.org/DOM/Test","dom3:elem");
      txt = doc.createTextNode("Text ");
      comment = doc.createComment("Comment ");
      entRef = doc.createEntityReference("beta");
      pi = doc.createProcessingInstruction("PIT","PIData ");
      cdata = doc.createCDATASection("CData");
      appendedChild = elem.appendChild(txt);
      appendedChild = elem.appendChild(comment);
      appendedChild = elem.appendChild(entRef);
      appendedChild = elem.appendChild(pi);
      appendedChild = elem.appendChild(cdata);
      appendedChild = docFrag.appendChild(elem);
      doc.normalizeDocument();
      textContent = docFrag.textContent;

      assertEquals("nodegettextcontent16","Text βCData",textContent);
       
},
/**
* 
	Invoke the method getTextContent on a new EntityReference node and check if the 
	value returned is the EntityReference's content.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent17 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent17") != null) return;
    var doc;
      var elem;
      var entRef;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.documentElement;

      entRef = doc.createEntityReference("beta");
      appendedChild = elem.appendChild(entRef);
      textContent = entRef.textContent;

      assertEquals("nodegettextcontent17","β",textContent);
       
},
/**
* 
	Invoke the method getTextContent on an Entity node and check if the value returned
	is its replacement text.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodegettextcontent18 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent18") != null) return;
    var doc;
      var docType;
      var entity;
      var entitymap;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitymap = docType.entities;

      entity = entitymap.getNamedItem("delta");
      textContent = entity.textContent;

      assertEquals("nodegettextcontent18","δ",textContent);
       
},
/**
* 
Checks that element content whitespace is not added to textContent.  Determination
of element content whitespace is only assured if validating.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=538
*/
nodegettextcontent19 : function () {
   var success;
    if(checkInitialization(builder, "nodegettextcontent19") != null) return;
    var doc;
      var elemList;
      var elem;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elemList = doc.getElementsByTagName("body");
      elem = elemList.item(0);
      textContent = elem.textContent;

      assertEquals("textContent","bar",textContent);
       
},
/**
* 

	
	Using getUserData with a junk value for the key attempt to retreive the UserData object
	of this Document node without setting it and verify if null is returned.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getUserData
*/
nodegetuserdata01 : function () {
   var success;
    if(checkInitialization(builder, "nodegetuserdata01") != null) return;
    var doc;
      var userData;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      userData = doc.getUserData("key1");
      assertNull("nodegetuserdata01",userData);
    
},
/**
* 

	
	Using getUserData with a junk value for the key attempt to retreive the UserData object
	of this Document node without setting it and verify if null is returned.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getUserData
*/
nodegetuserdata02 : function () {
   var success;
    if(checkInitialization(builder, "nodegetuserdata02") != null) return;
    var doc;
      var userData;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      userData = doc.getUserData("key1");
      assertNull("nodegetuserdata02",userData);
    
},
/**
* 

	
	Invoke setUserData on this Document to set this Documents UserData to a new
	Element node and using getUserData and isEqualNode check if the returned 
	UserData object is the same as the object that was set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getUserData
*/
nodegetuserdata03 : function () {
   var success;
    if(checkInitialization(builder, "nodegetuserdata03") != null) return;
    var doc;
      var userData;
      var retUserData;
      var success;
      var elem;
      var returnedUserData;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","body");
      if (null == nullHandler) {
         doc.setUserData("something", elem, null);
      } else {
          doc.setUserData("something", elem, nullHandler.handle);
      }
       retUserData = doc.getUserData("something");
      success = retUserData.isEqualNode(elem);
      assertTrue("nodegetuserdata03",success);

},
/**
* 

	
	Invoke setUserData on this DocumentType to set this its UserData to a this
	Document node and using getUserData and isEqualNode check if the returned 
	UserData object is the same as the object that was set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getUserData
*/
nodegetuserdata04 : function () {
   var success;
    if(checkInitialization(builder, "nodegetuserdata04") != null) return;
    var doc;
      var docType;
      var userData;
      var retUserData;
      var success;
      var nullHandler = null;

      var prevUserData;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      if (null == nullHandler) {
         docType.setUserData("KeyDoc", doc, null);
      } else {
          docType.setUserData("KeyDoc", doc, nullHandler.handle);
      }
       retUserData = docType.getUserData("KeyDoc");
      success = retUserData.isEqualNode(doc);
      assertTrue("nodegetuserdata04",success);

},
/**
* 
	Invoke setUserData on this Entity node to set this its UserData to a new 
	Attr node and using getUserData with an invalid Key check if the returned 
	UserData object is Null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getUserData
*/
nodegetuserdata05 : function () {
   var success;
    if(checkInitialization(builder, "nodegetuserdata05") != null) return;
    var doc;
      var docType;
      var entities;
      var entity;
      var attr;
      var userData;
      var retUserData;
      var nullHandler = null;

      var prevUserData;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entities = docType.entities;

      entity = entities.getNamedItem("delta");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","lang");
      if (null == nullHandler) {
         entity.setUserData("key", attr, null);
      } else {
          entity.setUserData("key", attr, nullHandler.handle);
      }
       retUserData = entity.getUserData("Key");
      assertNull("nodegetuserdata05",retUserData);
    
},
/**
* 

	
	Invoke getUserData on a new Text node with an ampty Key check if the returned 
	UserData object is Null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getUserData
*/
nodegetuserdata06 : function () {
   var success;
    if(checkInitialization(builder, "nodegetuserdata06") != null) return;
    var doc;
      var txt;
      var retUserData;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      txt = doc.createTextNode("TEXT");
      retUserData = txt.getUserData("");
      assertNull("nodegetuserdata06",retUserData);
    
},
/**
* 

	
	Invoke setUserData on a new PI node to set this its UserData to itself 
	and using getUserData with an valid Key and isEqualsNode check if the 
	returned UserData object is the same as that was set.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-getUserData
*/
nodegetuserdata07 : function () {
   var success;
    if(checkInitialization(builder, "nodegetuserdata07") != null) return;
    var doc;
      var pi;
      var userData;
      var retUserData;
      var success;
      var nullHandler = null;

      var prevUserData;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      pi = doc.createProcessingInstruction("PITARGET","PIDATA");
      if (null == nullHandler) {
         pi.setUserData("key", pi, null);
      } else {
          pi.setUserData("key", pi, nullHandler.handle);
      }
       retUserData = pi.getUserData("key");
      success = retUserData.isEqualNode(pi);
      assertTrue("nodegetuserdata07",success);

},
/**
* 



	Using insertBefore on this Document node attempt to insert a new Comment node before
	this DocumentElement node and verify the name of the inserted Comment node.  Now
	attempt to insert a new Processing Instruction node before the new Comment and 
	verify the target of the inserted ProcessingInstruction.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore01 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore01") != null) return;
    var doc;
      var docElem;
      var newComment;
      var insertedComment;
      var data;
      var newPI;
      var insertedPI;
      var target;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      newComment = doc.createComment("Comment");
      newPI = doc.createProcessingInstruction("PITarget","PIData");
      insertedComment = doc.insertBefore(newComment,docElem);
      data = insertedComment.data;

      assertEquals("nodeinsertbefore01_1","Comment",data);
       insertedPI = doc.insertBefore(newPI,newComment);
      target = insertedPI.target;

      assertEquals("nodeinsertbefore01_2","PITarget",target);
       
},
/**
* 
	Using insertBefore on a new Document node attempt to insert a new Comment node before
	this DocumentType node and verify the name of the inserted Comment node.  Now
	attempt to insert a new Processing Instruction node before the new Comment and 
	verify the target of the inserted ProcessingInstruction.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore02 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore02") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var newDocType;
      var newComment;
      var insertedComment;
      var data;
      var newPI;
      var insertedPI;
      var target;
      var nullPubId = null;

      var nullSysId = null;

      var rootNS;
      var rootName;
      var docElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDocType = domImpl.createDocumentType(rootName,nullPubId,nullSysId);
      newDoc = domImpl.createDocument(rootNS,rootName,newDocType);
      newComment = newDoc.createComment("Comment");
      newPI = newDoc.createProcessingInstruction("PITarget","PIData");
      insertedComment = newDoc.insertBefore(newComment,newDocType);
      data = insertedComment.data;

      assertEquals("nodeinsertbefore02_1","Comment",data);
       insertedPI = newDoc.insertBefore(newPI,newComment);
      target = insertedPI.target;

      assertEquals("nodeinsertbefore02_2","PITarget",target);
       
},
/**
* 
	Using insertBefore on this Document node attempt to insert a new Attr node before
	this DocumentType node and verify if a HIERARCHY_REQUEST_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore03 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore03") != null) return;
    var doc;
      var docType;
      var newAttr;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      newAttr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      
	{
		success = false;
		try {
            inserted = doc.insertBefore(newAttr,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
	Using insertBefore on this Document node attempt to insert this Document node before
	this DocumentType node and verify if a HIERARCHY_REQUEST_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore04 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore04") != null) return;
    var doc;
      var docType;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      
	{
		success = false;
		try {
            inserted = doc.insertBefore(doc,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
    Attempt to insert a second DocumentType node in a document using Node.insertBefore,
    should raise either DOMException with either a HIERARCHY_REQUEST_ERR 
    or NOT_SUPPORTED_ERR code.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore05 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore05") != null) return;
    var doc;
      var docType;
      var domImpl;
      var newDocType;
      var inserted;
      var nullPubId = null;

      var nullSysId = null;

      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      rootName = docType.name;

      domImpl = doc.implementation;
newDocType = domImpl.createDocumentType(rootName,nullPubId,nullSysId);
      
      try {
      inserted = doc.insertBefore(newDocType,docType);
      fail("throw_DOMException");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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
	Using insertBefore on this Document node attempt to insert an Element node before
	the existing element node and verify if a HIERARCHY_REQUEST_ERR or NOT_SUPPORTED_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=415
*/
nodeinsertbefore06 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore06") != null) return;
    var doc;
      var docElem;
      var newElem;
      var inserted;
      var rootNS;
      var rootTagname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      newElem = doc.createElementNS(rootNS,rootTagname);
      
      try {
      inserted = doc.insertBefore(newElem,docElem);
      fail("throw_DOMException");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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



	Using insertBefore on this Document node attempt to insert a Comment node created by
	another Document before this DocumentElement node and verify if a WRONG_DOCUMENT_ERR 
	is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore07 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore07") != null) return;
    var doc;
      var docAlt;
      var docElem;
      var newComment;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      var docAltRef = null;
      if (typeof(this.docAlt) != 'undefined') {
        docAltRef = this.docAlt;
      }
      docAlt = load(docAltRef, "docAlt", "hc_staff");
      docElem = doc.documentElement;

      newComment = docAlt.createComment("Comment");
      
	{
		success = false;
		try {
            inserted = doc.insertBefore(newComment,docElem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("WRONG_DOCUMENT_ERR_nodeinsertbefore07",success);
	}

},
/**
* 



	Using insertBefore on this Document node attempt to insert a Comment node created by
	this Document before another Document's DocumentElement node and verify if a 
	NOT_FOUND_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore08 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore08") != null) return;
    var doc;
      var docAlt;
      var docElem;
      var newComment;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      var docAltRef = null;
      if (typeof(this.docAlt) != 'undefined') {
        docAltRef = this.docAlt;
      }
      docAlt = load(docAltRef, "docAlt", "hc_staff");
      docElem = docAlt.documentElement;

      newComment = doc.createComment("Comment");
      
	{
		success = false;
		try {
            inserted = doc.insertBefore(newComment,docElem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("NOT_FOUND_ERR_nodeinsertbefore08",success);
	}

},
/**
* 
	The method insertBefore inserts the node newChild before the existing child node refChild. 
	If refChild is null, insert newChild at the end of the list of children.
	If newChild is a DocumentFragment object, all of its children are inserted, in the same 
	order, before refChild.

	Using insertBefore on this Document node attempt to insert a new DocumentFragment node 
	before a Comment node and verify the contents of the Comment node that is a child 
	of the DocumentFragment.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore09 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore09") != null) return;
    var doc;
      var docFrag;
      var newComment;
      var insertComment;
      var comment;
      var inserted;
      var data;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      newComment = doc.createComment("Comment");
      appendedChild = doc.appendChild(newComment);
      docFrag = doc.createDocumentFragment();
      insertComment = doc.createComment("insertComment");
      appendedChild = docFrag.appendChild(insertComment);
      inserted = doc.insertBefore(docFrag,newComment);
      comment = newComment.previousSibling;

      data = comment.data;

      assertEquals("nodeinsertbefore09","insertComment",data);
       
},
/**
* 
	Using insertBefore on this Document node attempt to insert a new Element node before
	another Element node and verify a DOMException with a 
	HIERARCHY_REQUEST_ERR, NOT_FOUND_ERR or NOT_SUPPORTED_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=415
*/
nodeinsertbefore10 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore10") != null) return;
    var doc;
      var elemList;
      var elem;
      var newElem;
      var inserted;
      var docElem;
      var rootNS;
      var rootTagname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(1);
      newElem = doc.createElementNS(rootNS,rootTagname);
      
      try {
      inserted = doc.insertBefore(newElem,elem);
      fail("throw_DOMException");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NOT_FOUND_ERR */ 8 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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



	Using insertBefore on a DocumentFragment node attempt to insert a child nodes before
	other permissible nodes and verify the contents/name of each inserted node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore11 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore11") != null) return;
    var doc;
      var docFrag;
      var elem;
      var pi;
      var comment;
      var txt;
      var cdata;
      var eRef;
      var inserted;
      var insertedVal;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","body");
      pi = doc.createProcessingInstruction("PITarget","PIData");
      comment = doc.createComment("Comment");
      txt = doc.createTextNode("Text");
      cdata = doc.createCDATASection("CDATA");
      eRef = doc.createEntityReference("alpha");
      appendedChild = docFrag.appendChild(elem);
      appendedChild = docFrag.appendChild(pi);
      appendedChild = docFrag.appendChild(comment);
      appendedChild = docFrag.appendChild(txt);
      appendedChild = docFrag.appendChild(cdata);
      appendedChild = docFrag.appendChild(eRef);
      inserted = docFrag.insertBefore(comment,pi);
      insertedVal = inserted.data;

      assertEquals("nodeinsertbefore11_Comment","Comment",insertedVal);
       inserted = docFrag.insertBefore(txt,comment);
      insertedVal = inserted.data;

      assertEquals("nodeinsertbefore11_Text","Text",insertedVal);
       inserted = docFrag.insertBefore(cdata,txt);
      insertedVal = inserted.data;

      assertEquals("nodeinsertbefore11_CDATA","CDATA",insertedVal);
       inserted = docFrag.insertBefore(eRef,cdata);
      insertedVal = inserted.nodeName;

      assertEquals("nodeinsertbefore11_Ent1","alpha",insertedVal);
       
},
/**
* 
	The method insertBefore inserts the node newChild before the existing child node refChild. 
	If refChild is null, insert newChild at the end of the list of children.

	Using insertBefore on a DocumentFragment node attempt to insert a new DocumentFragment node 
	before this DocumentFragment's Element node and verify the last child is still the only child
	appended to docFrag.   

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore12 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore12") != null) return;
    var doc;
      var docFrag;
      var docFragNew;
      var elem;
      var inserted;
      var appendedChild;
      var last;
      var name;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      docFragNew = doc.createDocumentFragment();
      elem = doc.createElementNS("http://www.w3.org/DOM/Test","dom3:elem");
      appendedChild = docFrag.appendChild(elem);
      inserted = docFrag.insertBefore(docFragNew,elem);
      last = docFrag.lastChild;

      name = last.nodeName;

      assertEquals("nodeinsertbefore12","dom3:elem",name);
       
},
/**
* 



	Using insertBefore on a DocumentFragment node attempt to insert a new Element node 
	created by another Document, before this DocumentFragment's Element node and 
	verify if a WRONG_DOCUMENT_ERR is raised. 

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore13 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore13") != null) return;
    var doc;
      var docAlt;
      var docFrag;
      var elemAlt;
      var elem;
      var appendedChild;
      var inserted;
      var docElem;
      var rootNS;
      var rootTagname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootTagname = docElem.tagName;

      
      var docAltRef = null;
      if (typeof(this.docAlt) != 'undefined') {
        docAltRef = this.docAlt;
      }
      docAlt = load(docAltRef, "docAlt", "hc_staff");
      docFrag = doc.createDocumentFragment();
      elem = doc.createElementNS(rootNS,rootTagname);
      elemAlt = docAlt.createElementNS(rootNS,rootTagname);
      appendedChild = docFrag.appendChild(elem);
      
	{
		success = false;
		try {
            inserted = docFrag.insertBefore(elemAlt,elem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
* 
	The method insertBefore inserts the node newChild before the existing child node refChild. 
	If refChild is null, insert newChild at the end of the list of children.
	A NO_MODIFICATION_ALLOWED_ERR is raised if the node is read-only.

	Using insertBefore on this Document node attempt to insert a new Attr node before
	this DocumentType node and verfiy if a NO_MODIFICATION_ALLOWED_ERR is raised.
	(This can also raise a HIERARCHY_REQUEST_ERR and NOT_FOUND_ERR)

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore14 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore14") != null) return;
    var doc;
      var docType;
      var newAttr;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      newAttr = doc.createAttributeNS("http://www.w3.org/DOM/Test","dom3:attr");
      
	{
		success = false;
		try {
            inserted = docType.insertBefore(newAttr,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("NO_MODIFICATION_ALLOWED_ERR_nodeinsertbefore14",success);
	}

},
/**
* 
	A NO_MODIFICATION_ALLOWED_ERR is raised if the node is read-only.
	
	Using insertBefore on a new EntityReference node attempt to insert Element, Text,
	Comment, ProcessingInstruction and CDATASection nodes before an element child
	and verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore15 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore15") != null) return;
    var doc;
      var entRef;
      var elemChild;
      var txt;
      var elem;
      var comment;
      var pi;
      var cdata;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      entRef = doc.createEntityReference("delta");
      elemChild = entRef.firstChild;

      cdata = doc.createCDATASection("CDATASection");
      
	{
		success = false;
		try {
            inserted = entRef.insertBefore(cdata,elemChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_1",success);
	}
pi = doc.createProcessingInstruction("target","data");
      
	{
		success = false;
		try {
            inserted = entRef.insertBefore(pi,elemChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_2",success);
	}
comment = doc.createComment("Comment");
      
	{
		success = false;
		try {
            inserted = entRef.insertBefore(comment,elemChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_3",success);
	}
txt = doc.createTextNode("Text");
      
	{
		success = false;
		try {
            inserted = entRef.insertBefore(txt,elemChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_4",success);
	}
elem = doc.createElementNS("http://www.w3.org/1999/xhtml","body");
      
	{
		success = false;
		try {
            inserted = entRef.insertBefore(elem,elemChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_5",success);
	}

},
/**
* 
	Using insertBefore on an Element node attempt to insert a new Element, node before its 
	first element child and verify the name of the new first child node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore16 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore16") != null) return;
    var doc;
      var element;
      var newElem;
      var refElem;
      var firstChild;
      var insertedElem;
      var childList;
      var nodeName;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("p");
      element = childList.item(0);
      firstChild = element.firstChild;

      refElem = firstChild.nextSibling;

      newElem = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:br");
      inserted = element.insertBefore(newElem,refElem);
      childList = doc.getElementsByTagName("p");
      element = childList.item(0);
      firstChild = element.firstChild;

      insertedElem = firstChild.nextSibling;

      nodeName = insertedElem.nodeName;

      assertEquals("nodeinsertbefore16","xhtml:br",nodeName);
       
},
/**
* 
	The method insertBefore inserts the node newChild before the existing child node refChild. 
	If refChild is null, insert newChild at the end of the list of children.
	
	Using insertBefore on an Element node attempt to insert a text node before its 
	first element child and verify the name of the new first child node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore17 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore17") != null) return;
    var doc;
      var element;
      var newText;
      var refNode;
      var firstChild;
      var insertedText;
      var childList;
      var nodeName;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagNameNS("*","p");
      element = childList.item(1);
      refNode = element.firstChild;

      newText = doc.createTextNode("newText");
      inserted = element.insertBefore(newText,refNode);
      insertedText = element.firstChild;

      nodeName = insertedText.nodeName;

      assertEquals("nodeinsertbefore17","#text",nodeName);
       
},
/**
* 
	The method insertBefore inserts the node newChild before the existing child node refChild. 
	If refChild is null, insert newChild at the end of the list of children.
	
	Using insertBefore on an Element node attempt to insert new Comment/PI and CDATA nodes
	before each other and verify the names of the newly inserted nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore18 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore18") != null) return;
    var doc;
      var element;
      var newElem;
      var newComment;
      var newPI;
      var newCDATA;
      var insertedNode;
      var data;
      var target;
      var appendedChild;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      element = doc.createElement("element");
      newElem = doc.createElementNS("http://www.w3.org/DOM","dom3:elem");
      newComment = doc.createComment("Comment");
      newCDATA = doc.createCDATASection("CDATASection");
      newPI = doc.createProcessingInstruction("target","data");
      appendedChild = element.appendChild(newElem);
      appendedChild = element.appendChild(newComment);
      appendedChild = element.appendChild(newPI);
      appendedChild = element.appendChild(newCDATA);
      inserted = element.insertBefore(newComment,newElem);
      insertedNode = element.firstChild;

      data = insertedNode.data;

      assertEquals("nodeinsertbefore18","Comment",data);
       
},
/**
* 
	Using insertBefore on an Element node attempt to insert an EntityReference node, before 
	another new EntityReference node and verify the name of the new first child node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore19 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore19") != null) return;
    var doc;
      var refNode;
      var newNode;
      var inserted;
      var childList;
      var nodeName;
      var element;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("var");
      element = childList.item(2);
      refNode = element.firstChild;

      newNode = doc.createEntityReference("alpha");
      inserted = element.insertBefore(newNode,refNode);
      nodeName = inserted.nodeName;

      assertEquals("nodeinsertbefore19","alpha",nodeName);
       
},
/**
* 
	Using insertBefore on an Element node attempt to insert a new Attr node, before 
	an EntityReference child and verify if a HIERARCHY_REQUEST_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore20 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore20") != null) return;
    var doc;
      var element;
      var refNode;
      var newNode;
      var childList;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("var");
      element = childList.item(2);
      refNode = element.firstChild;

      newNode = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      
	{
		success = false;
		try {
            inserted = element.insertBefore(newNode,refNode);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
	Using insertBefore on an Element node attempt to insert the parent Element node, before 
	an EntityReference or Text child and verify if a HIERARCHY_REQUEST_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore21 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore21") != null) return;
    var doc;
      var element;
      var refNode;
      var newNode;
      var childList;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("var");
      element = childList.item(2);
      refNode = element.firstChild;

      newNode = element.parentNode;

      
	{
		success = false;
		try {
            inserted = element.insertBefore(newNode,refNode);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
	Using insertBefore on an Element node attempt to insert the ancestor of an Element node 
	before its child and verify if a HIERARCHY_REQUEST_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore22 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore22") != null) return;
    var doc;
      var element;
      var refNode;
      var ancestor;
      var childList;
      var appendedChild;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      element = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:body");
      refNode = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:a");
      ancestor = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      appendedChild = element.appendChild(refNode);
      appendedChild = ancestor.appendChild(element);
      
	{
		success = false;
		try {
            inserted = element.insertBefore(ancestor,refNode);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
	Using insertBefore on an Element node attempt to insert a Text node created by a different
	Document before an Element child and verify if a WRONG_DOCUMENT_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore23 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore23") != null) return;
    var doc;
      var doc2;
      var element;
      var refNode;
      var newNode;
      var childList;
      var appendedChild;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      element = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:body");
      refNode = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      newNode = doc2.createTextNode("TextNode");
      appendedChild = element.appendChild(refNode);
      
	{
		success = false;
		try {
            inserted = element.insertBefore(newNode,refNode);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
* 
	Using insertBefore on an Element node attempt to insert a Comment node before 
	a CDATASection node that is not a child and verify if a NOT_FOUND_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore24 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore24") != null) return;
    var doc;
      var element;
      var refNode;
      var newNode;
      var childList;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      element = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      refNode = doc.createCDATASection("CDATASection");
      newNode = doc.createComment("Comment");
      
	{
		success = false;
		try {
            inserted = element.insertBefore(newNode,refNode);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using insertBefore on a child Element of an EntityReference node attempt to insert 
	a new Element node, before a Text node child of an Entity Node's replacement 
	text and verify if a NO_MODIFICATION_ALLOWED_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-952280727
*/
nodeinsertbefore25 : function () {
   var success;
    if(checkInitialization(builder, "nodeinsertbefore25") != null) return;
    var doc;
      var element;
      var eRef;
      var span;
      var spanText;
      var newNode;
      var childList;
      var inserted;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("var");
      element = childList.item(2);
      eRef = element.firstChild;

      span = eRef.firstChild;

      assertNotNull("spanNotNull",span);
spanText = span.firstChild;

      assertNotNull("spanTextNotNull",spanText);
newNode = doc.createElementNS("http://www.w3.org/1999/xhtml","span");
      
	{
		success = false;
		try {
            inserted = span.insertBefore(newNode,spanText);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using isDefaultNamespace on this Document node with the
	namespace of the document element check if the value returned is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace01 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace01") != null) return;
    var doc;
      var isDefault;
      var docElem;
      var docElemNS;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      docElemNS = docElem.namespaceURI;

      isDefault = doc.isDefaultNamespace(docElemNS);
      assertTrue("nodeisdefaultnamespace01",isDefault);

},
/**
* 
	Using isDefaultNamespace on on a new Document node with the value of the namespaceURI 
	parameter equal to the namespaceURI of the newly created Document and check if the 
	value returned is false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace02 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace02") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var isDefault;
      var nullDocType = null;

      var nullNSURI = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.localName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      isDefault = newDoc.isDefaultNamespace(rootNS);
      assertTrue("nodeisdefaultnamespace02_true",isDefault);
isDefault = newDoc.isDefaultNamespace(nullNSURI);
      assertFalse("nodeisdefaultnamespace02_false",isDefault);

},
/**
* 



	Using isDefaultNamespace on this DocumentType node with the value of the namespaceURI parameter
	as null check if the value returned is false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace03 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace03") != null) return;
    var doc;
      var docType;
      var isDefault;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      isDefault = docType.isDefaultNamespace(nullNSURI);
      assertFalse("nodeisdefaultnamespace03",isDefault);

},
/**
* 



	Using isDefaultNamespace on a Notation and Entity node with the value of the namespaceURI parameter
	as null check if the value returned is false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace04 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace04") != null) return;
    var doc;
      var docType;
      var entity;
      var notation;
      var entitiesMap;
      var notationsMap;
      var isDefault;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      notationsMap = docType.notations;

      entity = entitiesMap.getNamedItem("alpha");
      notation = notationsMap.getNamedItem("notation1");
      isDefault = entity.isDefaultNamespace(nullNSURI);
      assertFalse("nodeisdefaultnamespace04_1",isDefault);
isDefault = notation.isDefaultNamespace(nullNSURI);
      assertFalse("nodeisdefaultnamespace04_2",isDefault);

},
/**
* 
	Using isDefaultNamespace on a DocumentElement of a new Document node with the value of the 
	namespaceURI parameter equal to the namespaceURI of the newly created Document and check if the 
	value returned is false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace05 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace05") != null) return;
    var doc;
      var elem;
      var domImpl;
      var newDoc;
      var isDefault;
      var nullDocType = null;

      var nullNSURI = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.localName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      elem = newDoc.documentElement;

      isDefault = elem.isDefaultNamespace(rootNS);
      assertTrue("nodeisdefaultnamespace05_1",isDefault);
isDefault = elem.isDefaultNamespace(nullNSURI);
      assertFalse("nodeisdefaultnamespace05_2",isDefault);

},
/**
* 
	Using isDefaultNamespace on an Element node with no prefix, which has a namespace
	attribute declaration with and without a namespace prefix and check if isDefaultNamespace 
	returns true with the namespaceURI that does not have a prefix as its parameter.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace06 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace06") != null) return;
    var doc;
      var elem;
      var elemList;
      var isDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      isDefault = elem.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertTrue("nodeisdefaultnamespace06_1",isDefault);
isDefault = elem.isDefaultNamespace("http://www.usa.com");
      assertFalse("nodeisdefaultnamespace06_2",isDefault);

},
/**
* 
	Using isDefaultNamespace on the child of an Element node with no prefix, which has a 
	namespace attribute declaration with and without a namespace prefix and check if isDefaultNamespace 
	returns true with the namespaceURI that does not have a prefix as its parameter.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace07 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace07") != null) return;
    var doc;
      var elem;
      var elemList;
      var isDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      isDefault = elem.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertTrue("nodeisdefaultnamespace07_1",isDefault);
isDefault = elem.isDefaultNamespace("http://www.usa.com");
      assertFalse("nodeisdefaultnamespace07_2",isDefault);

},
/**
* 



	Using isDefaultNamespace on an Element node with a prefix, which has a namespace 
	attribute declaration with a namespace prefix and check if isDefaultNamespace 
	returns false with this namespaceURI as its parameter.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace08 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace08") != null) return;
    var doc;
      var elem;
      var elemList;
      var isDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(3);
      isDefault = elem.isDefaultNamespace("http://www.altavista.com");
      assertFalse("nodeisdefaultnamespace08",isDefault);

},
/**
* 
	Using isDefaultNamespace on a new Child of a new Element node with a namespace URI
	and prefix and using the parents namespace URI as an argument, verify if the 
	value returned is false.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace09 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace09") != null) return;
    var doc;
      var parent;
      var child;
      var isDefault;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:body");
      child = doc.createElement("xhtml:p");
      appendedChild = parent.appendChild(child);
      isDefault = parent.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertFalse("nodeisdefaultnamespace09_1",isDefault);
isDefault = child.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertFalse("nodeisdefaultnamespace09_2",isDefault);

},
/**
* 
	Using isDefaultNamespace on a new Child of a new Element node with a namespace URI
	and prefix and using the childs namespace URI as an argument, verify if the 
	value returned is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace10 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace10") != null) return;
    var doc;
      var parent;
      var child;
      var isDefault;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:body");
      child = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      appendedChild = parent.appendChild(child);
      isDefault = child.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertTrue("nodeisdefaultnamespace10_1",isDefault);
isDefault = parent.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertFalse("nodeisdefaultnamespace10_2",isDefault);

},
/**
* 
	Using isDefaultNamespace on an imported new Element node with a namespace URI and prefix 
	in a new Document and using the parent's namespace URI as an argument, verify if the 
	value returned is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace11 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace11") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var elem;
      var importedNode;
      var isDefault;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      importedNode = newDoc.importNode(elem,true);
      isDefault = importedNode.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertTrue("nodeisdefaultnamespace11",isDefault);

},
/**
* 
	Using isDefaultNamespace on a Element's new Text node, which has a namespace attribute 
	declaration without a namespace prefix in its parent Element node and  verify if the 
	value returned is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace13 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace13") != null) return;
    var doc;
      var bodyElem;
      var elem;
      var txt;
      var isDefault;
      var appendedChild;
      var bodyList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      txt = doc.createTextNode("Text");
      appendedChild = elem.appendChild(txt);
      appendedChild = bodyElem.appendChild(elem);
      isDefault = txt.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertTrue("nodeisdefaultnamespace13",isDefault);

},
/**
* 
	Using isDefaultNamespace on a Element's new CDATASection node, which has a namespace attribute 
	declaration without a namespace prefix in its parent Element node and  verify if the 
	value returned is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace14 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace14") != null) return;
    var doc;
      var elem;
      var cdata;
      var isDefault;
      var appendedChild;
      var bodyList;
      var bodyElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      cdata = doc.createCDATASection("CDATASection");
      appendedChild = elem.appendChild(cdata);
      appendedChild = bodyElem.appendChild(elem);
      isDefault = cdata.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertTrue("nodeisdefaultnamespace14",isDefault);

},
/**
* 
	Using isDefaultNamespace on a Element's new cloned Comment node, which has a namespace attribute 
	declaration without a namespace prefix in its parent Element node and  verify if the 
	value returned is true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace15 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace15") != null) return;
    var doc;
      var bodyElem;
      var elem;
      var comment;
      var clonedComment;
      var isDefault;
      var appendedChild;
      var bodyList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      comment = doc.createComment("Text");
      clonedComment = comment.cloneNode(true);
      appendedChild = elem.appendChild(clonedComment);
      appendedChild = bodyElem.appendChild(elem);
      isDefault = clonedComment.isDefaultNamespace("http://www.w3.org/1999/xhtml");
      assertTrue("nodeisdefaultnamespace15",isDefault);

},
/**
* 
	Using isDefaultNamespace on a new Attribute node with with a namespace URI
	and no prefix and  verify if the value returned is false since default namespaces
	do not apply directly to attributes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isDefaultNamespace
*/
nodeisdefaultnamespace16 : function () {
   var success;
    if(checkInitialization(builder, "nodeisdefaultnamespace16") != null) return;
    var doc;
      var attr;
      var isDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","lang");
      isDefault = attr.isDefaultNamespace("http://www.w3.org/XML/1998/namespace");
      assertFalse("nodeisdefaultnamespace16",isDefault);

},
/**
* 

	
	Using isEqualNode check if 2 Document nodes created by parsing the same xml document
	are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode01 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode01") != null) return;
    var doc1;
      var doc2;
      var isEqual;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      isEqual = doc1.isEqualNode(doc2);
      assertTrue("nodeisequalnode01",isEqual);

},
/**
* 
	Using isEqualNode check if 2 newly created Document nodes having the same namespaceURI
	and qualifiedName are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode02 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode02") != null) return;
    var doc;
      var domImpl;
      var doc1;
      var doc2;
      var isEqual;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
doc1 = domImpl.createDocument(rootNS,rootName,nullDocType);
      doc2 = domImpl.createDocument(rootNS,rootName,nullDocType);
      isEqual = doc1.isEqualNode(doc2);
      assertTrue("nodeisequalnode02",isEqual);

},
/**
* 
	Using isEqualNode check if 2 Document nodes created by parsing
	documents only differing in declared encoding return false for isEqualNode on
	the document and true on the document element.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=528
*/
nodeisequalnode03 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode03") != null) return;
    var doc1;
      var doc2;
      var docElem1;
      var docElem2;
      var isEqual;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "barfoo_utf8");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "barfoo_utf16");
      isEqual = doc1.isEqualNode(doc2);
      assertTrue("docAreNotEquals",isEqual);
docElem1 = doc1.documentElement;

      docElem2 = doc2.documentElement;

      isEqual = docElem1.isEqualNode(docElem2);
      assertTrue("docElemsAreEquals",isEqual);

},
/**
* 
	Create a new Element node in this Document.  return its ownerDocument and check if the
	the ownerDocument is equal to this Document using isEqualNode.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode04 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode04") != null) return;
    var doc;
      var ownerDoc;
      var elem;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      ownerDoc = elem.ownerDocument;

      isEqual = doc.isEqualNode(ownerDoc);
      assertTrue("nodeisequalnode04",isEqual);

},
/**
* 
	Using isEqualNode check if 2 Document nodes created by parsing different xml document
	are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode05 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode05") != null) return;
    var doc1;
      var doc2;
      var isEqual;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "barfoo_standalone_yes");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "barfoo");
      isEqual = doc1.isEqualNode(doc2);
      assertFalse("nodeisequalnode05",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 Element nodes having the same nodeName and namespaceURI attribute
	are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode06 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode06") != null) return;
    var doc;
      var elem1;
      var elem2;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem1 = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:html");
      elem2 = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:html");
      isEqual = elem1.isEqualNode(elem2);
      assertTrue("nodeisequalnode06",isEqual);

},
/**
* 
	Using isEqualNode check if 2 Element nodes having the same nodeName and namespaceURI attribute
	created by two different Document objects obtained by parsing the same xml document are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode07 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode07") != null) return;
    var doc1;
      var doc2;
      var elem1;
      var elem2;
      var isEqual;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      elem1 = doc1.createElementNS("http://www.w3.org/1999/xhtml","xhtml:html");
      elem2 = doc2.createElementNS("http://www.w3.org/1999/xhtml","xhtml:html");
      isEqual = elem1.isEqualNode(elem2);
      assertTrue("nodeisequalnode07",isEqual);

},
/**
* 

	
	Retreive an element node of this Document having nodeName as employeeId and 
	namespaceURI as http://www.nist.gov.  Create a new Element node having the same attributes
	in this Document and using isEqualNode check if 2 Element nodes are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode08 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode08") != null) return;
    var doc;
      var elem1;
      var elem2;
      var employeeList;
      var text;
      var isEqual;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      employeeList = doc.getElementsByTagName("em");
      elem1 = employeeList.item(0);
      elem2 = doc.createElementNS("http://www.w3.org/1999/xhtml","em");
      text = doc.createTextNode("EMP0001");
      appendedChild = elem2.appendChild(text);
      isEqual = elem1.isEqualNode(elem2);
      assertTrue("nodeisequalnode08",isEqual);

},
/**
* 
Get the first "em" node, construct an equivalent in a new document and see if isEqualNode
returns true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode09 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode09") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var elem1;
      var elem2;
      var employeeList;
      var text;
      var isEqual;
      var nullDocType = null;

      var appendedChild;
      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.localName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      employeeList = doc.getElementsByTagName("em");
      elem1 = employeeList.item(0);
      elem2 = newDoc.createElementNS("http://www.w3.org/1999/xhtml","em");
      text = newDoc.createTextNode("EMP0001");
      appendedChild = elem2.appendChild(text);
      isEqual = elem1.isEqualNode(elem2);
      assertTrue("nodesAreEqual",isEqual);

},
/**
* 
	Retreive 2 different "em" nodes of this Document   Use isEqualNode 
	check if nodes are not equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode10 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode10") != null) return;
    var doc;
      var elem1;
      var elem2;
      var employeeList;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      employeeList = doc.getElementsByTagName("em");
      elem1 = employeeList.item(0);
      elem2 = employeeList.item(1);
      isEqual = elem1.isEqualNode(elem2);
      assertFalse("nodeisequalnode10",isEqual);

},
/**
* 
	Retreive the first element node whose localName is "p".  Import it into a new
	Document with deep=false.  Using isEqualNode check if the original and the imported
	Element Node are not equal the child nodes are different.
	Import with deep and the should still be unequal if
	validating since the
	new document does not provide the same default attributes.
	Import it into another instance of the source document
	and then the imported node and the source should be equal.   

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=529
*/
nodeisequalnode11 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode11") != null) return;
    var doc;
      var domImpl;
      var employeeList;
      var newDoc;
      var dupDoc;
      var elem1;
      var elem2;
      var elem3;
      var elem4;
      var isEqual;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      employeeList = doc.getElementsByTagName("p");
      elem1 = employeeList.item(0);
      elem2 = newDoc.importNode(elem1,false);
      isEqual = elem1.isEqualNode(elem2);
      assertFalse("nodeisequalnodeFalse11",isEqual);
elem3 = newDoc.importNode(elem1,true);
      isEqual = elem1.isEqualNode(elem3);
      
	if(
	(getImplementationAttribute("validating") == true)
	) {
	assertFalse("deepImportNoDTD",isEqual);

	}
	
      var dupDocRef = null;
      if (typeof(this.dupDoc) != 'undefined') {
        dupDocRef = this.dupDoc;
      }
      dupDoc = load(dupDocRef, "dupDoc", "hc_staff");
      elem4 = dupDoc.importNode(elem1,true);
      isEqual = elem1.isEqualNode(elem4);
      assertTrue("deepImportSameDTD",isEqual);

},
/**
* 

	
	Using isEqual verify if the 2 documentElement nodes of different documents created
	by parsing the same xml document are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode12 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode12") != null) return;
    var doc;
      var elem1;
      var elem2;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem1 = doc.documentElement;

      elem2 = doc.documentElement;

      isEqual = elem1.isEqualNode(elem2);
      assertTrue("nodeisequalnode12",isEqual);

},
/**
* 
	Retreive the first element node whose localName is "p".  Import it into a new
	Document with deep=false.  Using isEqualNode check if the original and the imported
	Element Node are not equal.  Now import it once more with deep=true and using isEqual
	verify if they are now equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode13 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode13") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var employeeList;
      var elem1;
      var elem2;
      var elem3;
      var isEqual;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      employeeList = doc.getElementsByTagName("p");
      elem1 = employeeList.item(0);
      elem2 = elem1.cloneNode(false);
      isEqual = elem1.isEqualNode(elem2);
      assertFalse("nodeisequalnodeFalse13",isEqual);
elem3 = elem1.cloneNode(true);
      isEqual = elem1.isEqualNode(elem3);
      assertTrue("nodeisequalnodeTrue13",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 Attr nodes having the same nodeName and a null namespaceURI 
	attribute, one created using createAttribute and the other createAttributeNS, are not equal.
	Note the localName for an Attr created with DOM Level 1 methods is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode14 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode14") != null) return;
    var doc;
      var attr1;
      var attr2;
      var isEqual;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      attr1 = doc.createAttribute("root");
      attr2 = doc.createAttributeNS(nullNSURI,"root");
      isEqual = attr1.isEqualNode(attr2);
      assertFalse("nodeisequalnode14",isEqual);

},
/**
* 
	Using isEqualNode check if 2 Attr nodes having the same nodeName and a null namespaceURI 
	attribute, one created using createAttributeNS and the other retreived from this document
	are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode15 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode15") != null) return;
    var doc;
      var attr1;
      var attr2;
      var addrElement;
      var elementList;
      var isEqual;
      var nullNS = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      addrElement = elementList.item(3);
      attr1 = addrElement.getAttributeNodeNS(nullNS,"title");
      
	if(
	(getImplementationAttribute("namespaceAware") == true)
	) {
	attr2 = doc.createAttributeNS(nullNS,"title");
      
	}
	
		else {
			attr2 = doc.createAttribute("title");
      
		}
	attr2.value = "Yes";

      isEqual = attr1.isEqualNode(attr2);
      assertTrue("nodeisequalnode15",isEqual);

},
/**
* 

	
	Using isEqualNode check if a default attribute node and a cloned default attribute
	node are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode16 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode16") != null) return;
    var doc;
      var attr1;
      var attr2;
      var addrElement;
      var elementList;
      var isEqual;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("p");
      addrElement = elementList.item(3);
      attr1 = addrElement.getAttributeNodeNS(nullNSURI,"dir");
      attr2 = attr1.cloneNode(true);
      isEqual = attr1.isEqualNode(attr2);
      assertTrue("nodeisequalnode16",isEqual);

},
/**
* 
	Using isEqualNode check if a new Attr node created in this Document is equal to 
	the imported node returned when it is imported into a new Document.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode17 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode17") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var attr1;
      var attr2;
      var isEqual;
      var nullDocType = null;

      var nullNSURI = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      attr1 = doc.createAttributeNS(nullNSURI,"root");
      attr2 = newDoc.importNode(attr1,true);
      isEqual = attr1.isEqualNode(attr2);
      assertTrue("nodeisequalnode17",isEqual);

},
/**
* 
	Using isEqualNode check if a new Attr node created in this Document is equal to 
	the attr node adopted by a new document.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode18 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode18") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var attr1;
      var attr2;
      var isEqual;
      var nullDocType = null;

      var nullNSURI = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      attr1 = doc.createAttributeNS(nullNSURI,"title");
      attr2 = newDoc.adoptNode(attr1);
      
	if(
	
	(attr2 != null)

	) {
	isEqual = attr1.isEqualNode(attr2);
      assertTrue("nodeisequalnode18",isEqual);

	}
	
},
/**
* 

	
	Using isEqualNode check if 2 Attr nodes having the same nodeName but different namespaceURIs 
	are not equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode19 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode19") != null) return;
    var doc;
      var attr1;
      var attr2;
      var isEqual;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      attr1 = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","lang");
      attr2 = doc.createAttributeNS(nullNSURI,"lang");
      isEqual = attr1.isEqualNode(attr2);
      assertFalse("nodeisequalnode19",isEqual);

},
/**
* 
	Using isEqualNode check if an Element and an Attr nodes having the same nodeName 
	and namsepaceURI are not equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode20 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode20") != null) return;
    var doc;
      var attr1;
      var elem1;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem1 = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:html");
      attr1 = doc.createAttributeNS("http://www.w3.org/1999/xhtml","xhtml:html");
      isEqual = attr1.isEqualNode(elem1);
      assertFalse("nodeisequalnode20",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 DocumentType nodes returned by parsing the same xml document
	are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode21 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode21") != null) return;
    var doc1;
      var doc2;
      var docType1;
      var docType2;
      var isEqual;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      docType1 = doc1.doctype;

      docType2 = doc2.doctype;

      isEqual = docType1.isEqualNode(docType2);
      assertTrue("nodeisequalnode21",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 new DocumentType having null public and system ids
	are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode22 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode22") != null) return;
    var doc1;
      var doc2;
      var domImpl1;
      var domImpl2;
      var docType1;
      var docType2;
      var isEqual;
      var nullPubId = null;

      var nullSysId = null;

      var oldDocType;
      var rootName;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "barfoo");
      oldDocType = doc1.doctype;

      rootName = oldDocType.name;

      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "barfoo");
      domImpl1 = doc1.implementation;
domImpl2 = doc2.implementation;
docType1 = domImpl1.createDocumentType(rootName,nullPubId,nullSysId);
      docType2 = domImpl2.createDocumentType(rootName,nullPubId,nullSysId);
      isEqual = docType1.isEqualNode(docType2);
      assertTrue("nodeisequalnode22",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 EntityNode having the same name of two DocumentType nodes 
	returned by parsing the same xml document are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode25 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode25") != null) return;
    var doc1;
      var doc2;
      var docType1;
      var docType2;
      var entitiesMap1;
      var entitiesMap2;
      var alpha;
      var beta;
      var isEqual;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      docType1 = doc1.doctype;

      docType2 = doc2.doctype;

      entitiesMap1 = docType1.entities;

      entitiesMap2 = docType2.entities;

      alpha = entitiesMap1.getNamedItem("delta");
      beta = entitiesMap2.getNamedItem("delta");
      isEqual = alpha.isEqualNode(beta);
      assertTrue("nodeisequalnode25",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 NotationNode having the same name of two DocumnotationType nodes 
	returned by parsing the same xml documnotation are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode26 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode26") != null) return;
    var doc1;
      var doc2;
      var docType1;
      var docType2;
      var notationsMap1;
      var notationsMap2;
      var notation1;
      var notation2;
      var isEqual;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      docType1 = doc1.doctype;

      docType2 = doc2.doctype;

      notationsMap1 = docType1.notations;

      notationsMap2 = docType2.notations;

      notation1 = notationsMap1.getNamedItem("notation1");
      notation2 = notationsMap2.getNamedItem("notation1");
      isEqual = notation1.isEqualNode(notation2);
      assertTrue("nodeisequalnode26",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 EntityNode having the same name of two DocumentType nodes 
	returned by parsing the same xml document are equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode27 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode27") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var notationsMap;
      var alpha;
      var notation1;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      notationsMap = docType.notations;

      alpha = entitiesMap.getNamedItem("alpha");
      notation1 = notationsMap.getNamedItem("notation1");
      isEqual = notation1.isEqualNode(alpha);
      assertFalse("nodeisequalnode27",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 new Text nodes having null text are equal and two others
	having different data are not equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode28 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode28") != null) return;
    var doc;
      var text1;
      var text2;
      var text3;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      text1 = doc.createTextNode("");
      text2 = doc.createTextNode("");
      text3 = doc.createTextNode("#Text");
      isEqual = text1.isEqualNode(text2);
      assertTrue("nodeisequalnodeTrue28",isEqual);
isEqual = text1.isEqualNode(text3);
      assertFalse("nodeisequalnodeFalse28",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 new Comment nodes having the same data are equal and two others
	having different data are not equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode29 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode29") != null) return;
    var doc;
      var comment1;
      var comment2;
      var comment3;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      comment1 = doc.createComment("comment");
      comment2 = doc.createComment("comment");
      comment3 = doc.createComment("#Comment");
      isEqual = comment1.isEqualNode(comment2);
      assertTrue("nodeisequalnodeTrue29",isEqual);
isEqual = comment1.isEqualNode(comment3);
      assertFalse("nodeisequalnodeFalse29",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 new CDATASection nodes having the same data are equal and two others
	having different data are not equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode31 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode31") != null) return;
    var doc;
      var cdata1;
      var cdata2;
      var cdata3;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      cdata1 = doc.createCDATASection("cdata");
      cdata2 = doc.createCDATASection("cdata");
      cdata3 = doc.createCDATASection("#CDATASection");
      isEqual = cdata1.isEqualNode(cdata2);
      assertTrue("nodeisequalnodeTrue29",isEqual);
isEqual = cdata1.isEqualNode(cdata3);
      assertFalse("nodeisequalnodeFalse29",isEqual);

},
/**
* 

	
	Using isEqualNode check if 2 new ProcessingInstruction nodes having the same data are equal and two others
	having different data are not equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isEqualNode
*/
nodeisequalnode32 : function () {
   var success;
    if(checkInitialization(builder, "nodeisequalnode32") != null) return;
    var doc;
      var pi1;
      var pi2;
      var pi3;
      var isEqual;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      pi1 = doc.createProcessingInstruction("Target1","pi");
      pi2 = doc.createProcessingInstruction("Target1","pi");
      pi3 = doc.createProcessingInstruction("Target1","#ProcessingInstruction");
      isEqual = pi1.isEqualNode(pi2);
      assertTrue("nodeisequalnodeTrue29",isEqual);
isEqual = pi1.isEqualNode(pi3);
      assertFalse("nodeisequalnodeFalse29",isEqual);

},
/**
* 

	
	Using isSameNode to check if 2 Document nodes that are equal but do not reference the
	same object are not the same

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode01 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode01") != null) return;
    var doc1;
      var doc2;
      var isSame;
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      isSame = doc1.isSameNode(doc2);
      assertFalse("nodeissamenode01",isSame);

},
/**
* 

	
	Using isSameNode check if 2 DocumentType nodes that reference the same object are 
	the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode02 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode02") != null) return;
    var doc;
      var docType1;
      var docType2;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType1 = doc.doctype;

      docType2 = doc.doctype;

      isSame = docType1.isSameNode(docType2);
      assertTrue("nodeissamenode02",isSame);

},
/**
* 
	Using isSameNode check if 2 Element nodes that reference the same object are 
	the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode03 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode03") != null) return;
    var doc;
      var element1;
      var element2;
      var childList;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("p");
      element1 = childList.item(0);
      element2 = childList.item(0);
      isSame = element2.isSameNode(element1);
      assertTrue("nodeissamenode03",isSame);

},
/**
* 
	Using isSameNode check if 2 Element nodes that are equal but do not reference the 
	same object are not the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode04 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode04") != null) return;
    var doc;
      var element1;
      var element2;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      element1 = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:br");
      element2 = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:br");
      isSame = element2.isSameNode(element1);
      assertFalse("nodeissamenode04",isSame);

},
/**
* 

	
	Using isSameNode check if 2 Document Element nodes that reference the same object are 
	the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode05 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode05") != null) return;
    var doc;
      var element1;
      var element2;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      element1 = doc.documentElement;

      element2 = doc.documentElement;

      isSame = element2.isSameNode(element1);
      assertTrue("nodeissamenode05",isSame);

},
/**
* 
	Using isSameNode check if 2 Document Element nodes that reference the same object are 
	the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode06 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode06") != null) return;
    var doc;
      var element;
      var element1;
      var attr1;
      var attr2;
      var childList;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      element = childList.item(2);
      element1 = childList.item(2);
      attr1 = element.getAttributeNode("class");
      attr2 = element1.getAttributeNode("class");
      isSame = attr1.isSameNode(attr2);
      assertTrue("nodeissamenode06",isSame);

},
/**
* 

	
	Using isSameNode check if 2 Entity nodes that reference the same object are 
	the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode07 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode07") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity1;
      var entity2;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity1 = entitiesMap.getNamedItem("delta");
      entity2 = entitiesMap.getNamedItem("delta");
      isSame = entity1.isSameNode(entity2);
      assertTrue("nodeissamenode07",isSame);

},
/**
* 

	
	Using isSameNode check if 2 Notation nodes that reference the same object are 
	the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode08 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode08") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var notation1;
      var notation2;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.notations;

      notation1 = entitiesMap.getNamedItem("notation1");
      notation2 = entitiesMap.getNamedItem("notation1");
      isSame = notation1.isSameNode(notation2);
      assertTrue("nodeissamenode08",isSame);

},
/**
* 

	
	Using isSameNode check if an Entity and its docType nodes are not the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode09 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode09") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var entity;
      var isSame;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      entity = entitiesMap.getNamedItem("alpha");
      isSame = docType.isSameNode(entity);
      assertFalse("nodeissamenode09",isSame);

},
/**
* 
	Using isSameNode check if an new Document and a new Element node are not the same.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-isSameNode
*/
nodeissamenode10 : function () {
   var success;
    if(checkInitialization(builder, "nodeissamenode10") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var element;
      var isSame;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      element = newDoc.createElementNS(rootNS,rootName);
      isSame = newDoc.isSameNode(element);
      assertFalse("nodeissamenode10",isSame);

},
/**
* 
Return value from lookupNamespaceURI(null) on a Document node with no default namespace should be null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri01 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri01") != null) return;
    var doc;
      var namespaceURI;
      var nullPrefix = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_nodefaultns");
      namespaceURI = doc.lookupNamespaceURI(nullPrefix);
      assertNull("nodelookupnamespaceuri01",namespaceURI);
    
},
/**
* 
	Using lookupNamespaceURI on a new Document node with a namespaceURI and prefix
	and check if the value returned is the same namespaceURI.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri02 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri02") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var namespaceURI;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      var qname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
qname = "dom3:" + rootName;
newDoc = domImpl.createDocument(rootNS,qname,nullDocType);
      namespaceURI = newDoc.lookupNamespaceURI("dom3");
      assertEquals("nodelookupnamespaceuri02",rootNS,namespaceURI);
       
},
/**
* 



	Using lookupNamespaceURI on this DocumentType node check if the value returned is Null .

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri03 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri03") != null) return;
    var doc;
      var docType;
      var namespaceURI;
      var nullPrefix = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      namespaceURI = docType.lookupNamespaceURI(nullPrefix);
      assertNull("nodelookupnamespaceuri03",namespaceURI);
    
},
/**
* 



	Using lookupNamespaceURI on an Entity and Notation node and check if the value returned is Null .

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri04 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri04") != null) return;
    var doc;
      var docType;
      var entity;
      var notation;
      var entitiesMap;
      var notationsMap;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      notationsMap = docType.notations;

      entity = entitiesMap.getNamedItem("alpha");
      notation = notationsMap.getNamedItem("notation1");
      namespaceURI = entity.lookupNamespaceURI("");
      assertNull("nodelookupnamespaceuri04",namespaceURI);
    
},
/**
* 
	Using lookupNamespaceURI on the DocumentElement node of a new document with a 
	namespaceURI and prefix and check if the namespaceURI value returned is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri05 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri05") != null) return;
    var doc;
      var elem;
      var domImpl;
      var newDoc;
      var namespaceURI;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      var qname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      qname = "dom3:" + rootName;
domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,qname,nullDocType);
      elem = newDoc.documentElement;

      namespaceURI = elem.lookupNamespaceURI("dom3");
      assertEquals("nodelookupnamespaceuri05",rootNS,namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on an Element node with no prefix, which has a namespace
	attribute declaration with a namespace prefix and check if the value of the namespaceURI
	returned by using its prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri06 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri06") != null) return;
    var doc;
      var elem;
      var elemList;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(2);
      namespaceURI = elem.lookupNamespaceURI("dmstc");
      assertEquals("nodelookupnamespaceuri06","http://www.netzero.com",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on an Element node with no prefix, which has a namespace
	attribute declaration with a namespace prefix in its parent Element node and check if 
	the value of the namespaceURI returned by using its prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri07 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri07") != null) return;
    var doc;
      var elem;
      var elemList;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(2);
      namespaceURI = elem.lookupNamespaceURI("dmstc");
      assertEquals("nodelookupnamespaceuri07","http://www.netzero.com",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on an Element node with no prefix, which has 2 namespace
	attribute declarations with and without namespace prefixes and check if the value of the prefix
	returned by using a valid prefix and an empty prefix as a parameter is a valid
	namespaceURI or null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri08 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri08") != null) return;
    var doc;
      var elem;
      var elemList;
      var namespaceURI;
      var namespaceURIEmpty;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      namespaceURI = elem.lookupNamespaceURI("dmstc");
      assertEquals("nodelookupnamespaceuri08","http://www.usa.com",namespaceURI);
       namespaceURIEmpty = elem.lookupNamespaceURI("");
      assertNull("nodelookupnamespaceprefixEmpty08",namespaceURIEmpty);
    
},
/**
* 
	Invoke lookupNamespaceURI on an Element node with no prefix, whose parent has no prefix and 
	2 namespace attribute declarations with and without namespace prefixes and check if the value of 
	the namespaceURI returned by using each prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri09 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri09") != null) return;
    var doc;
      var elem;
      var elemList;
      var namespaceURI;
      var namespaceURIEmpty;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      namespaceURI = elem.lookupNamespaceURI("dmstc");
      assertEquals("nodelookupnamespaceuri09","http://www.usa.com",namespaceURI);
       namespaceURIEmpty = elem.lookupNamespaceURI("");
      assertNull("nodelookupnamespaceprefixEmpty09",namespaceURIEmpty);
    
},
/**
* 
	Invoke lookupNamespaceURI on a new Child of a new Element node with a namespace URI
	and prefix and using the parents prefix as an argument, verify if the namespaceURI
	returned is a valid namespaceURI for the parent.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri10 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri10") != null) return;
    var doc;
      var parent;
      var child;
      var namespaceURI;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:body");
      child = doc.createElement("p");
      appendedChild = parent.appendChild(child);
      namespaceURI = child.lookupNamespaceURI("xhtml");
      assertEquals("nodelookupnamespaceuri10","http://www.w3.org/1999/xhtml",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on an imported new Element node with a namespace URI and prefix 
	in a new Document and using the parents prefix as an argument, verify if the namespaceURI
	returned is a valid namespaceURI of the parent.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri11 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri11") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var elem;
      var importedNode;
      var namespaceURI;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      importedNode = newDoc.importNode(elem,true);
      namespaceURI = importedNode.lookupNamespaceURI("dom3");
      assertEquals("nodelookupnamespaceuri11","http://www.w3.org/1999/xhtml",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on a Element's new Text node, which has a namespace attribute declaration 
	with a namespace prefix in its parent Element node and check if the value of the namespaceURI
	returned by using its prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri13 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri13") != null) return;
    var doc;
      var docElem;
      var elem;
      var txt;
      var namespaceURI;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      txt = doc.createTextNode("Text");
      appendedChild = elem.appendChild(txt);
      appendedChild = docElem.appendChild(elem);
      namespaceURI = txt.lookupNamespaceURI("dom3");
      assertEquals("nodelookupnamespaceuri13","http://www.w3.org/1999/xhtml",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on a Element's new Text node, which has a namespace attribute declaration 
	with a namespace prefix in its parent Element node and check if the value of the namespaceURI
	returned by using its prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri14 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri14") != null) return;
    var doc;
      var docElem;
      var elem;
      var cdata;
      var lookupNamespaceURI;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      cdata = doc.createCDATASection("Text");
      appendedChild = elem.appendChild(cdata);
      appendedChild = docElem.appendChild(elem);
      lookupNamespaceURI = cdata.lookupNamespaceURI("dom3");
      assertEquals("nodelookupnamespaceuri14","http://www.w3.org/1999/xhtml",lookupNamespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on a Element's new Comment node, which has a namespace attribute declaration 
	with a namespace prefix in its parent Element node and check if the value of the namespaceURI
	returned by using its prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri15 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri15") != null) return;
    var doc;
      var docElem;
      var elem;
      var comment;
      var clonedComment;
      var namespaceURI;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      comment = doc.createComment("Text");
      clonedComment = comment.cloneNode(true);
      appendedChild = elem.appendChild(clonedComment);
      appendedChild = docElem.appendChild(elem);
      namespaceURI = clonedComment.lookupNamespaceURI("dom3");
      assertEquals("nodelookupnamespaceuri15","http://www.w3.org/1999/xhtml",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on a new Attribute node with with a namespace URI
	and prefix and verify if the namespaceURI returned is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri16 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri16") != null) return;
    var doc;
      var elem;
      var attr;
      var attNode;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      attNode = elem.setAttributeNodeNS(attr);
      namespaceURI = attr.lookupNamespaceURI("xml");
      assertNull("nodelookupnamespaceuri16",namespaceURI);
    
},
/**
* 
	Invoke lookupNamespaceURI on the title attribute node of the acronym node with
	a namespaceURI and a node prefix and check if the value of the namespaceURI returned by 
	using its prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri17 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri17") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(2);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      namespaceURI = attr.lookupNamespaceURI("dmstc");
      assertEquals("nodelookupnamespaceuri17","http://www.netzero.com",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on the default attribute node of the p node with
	a namespaceURI and a node prefix and check if the value of the namespaceURI returned by 
	using its prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri18 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri18") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("dir");
      namespaceURI = attr.lookupNamespaceURI("nm");
      assertEquals("nodelookupnamespaceuri18","http://www.altavista.com",namespaceURI);
       
},
/**
* 
	Invoke lookupNamespaceURI on the an attribute node without a namespace prefix of
	an Element node that has a namespaceURI and prefix, and check if the value of the namespaceURI
	returned by using the Elements prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri19 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri19") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("class");
      namespaceURI = attr.lookupNamespaceURI("xsi");
      assertEquals("nodelookupnamespaceuri19","http://www.w3.org/2001/XMLSchema-instance",namespaceURI);
       
},
/**
* 



	Invoke lookupNamespaceURI on the an attribute node without a namespace prefix of
	an Element node that has a namespaceURI and prefix, and check if the value of the namespaceURI 
	returned by using the Elements prefix as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespaceURI
*/
nodelookupnamespaceuri20 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupnamespaceuri20") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var namespaceURI;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("xmlns:nm");
      namespaceURI = attr.lookupNamespaceURI("nm");
      assertEquals("nodelookupnamespaceuri20","http://www.altavista.com",namespaceURI);
       
},
/**
* 


	
	Using lookupPrefix on this Document node check if the value returned is Null .                

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix01 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix01") != null) return;
    var doc;
      var prefix;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      prefix = doc.lookupPrefix(nullNSURI);
      assertNull("nodelookupprefix01",prefix);
    
},
/**
* 
	Using lookupPrefix on a new Document node with a namespaceURI and prefix
	and check if the value returned is the same prefix.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix02 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix02") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var prefix;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      var qname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
qname = "dom3:" + rootName;
newDoc = domImpl.createDocument(rootNS,qname,nullDocType);
      prefix = newDoc.lookupPrefix(rootNS);
      assertEquals("nodelookupprefix02","dom3",prefix);
       
},
/**
* 



	Using lookupPrefix on this DocumentType node check if the value returned is Null .

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix03 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix03") != null) return;
    var doc;
      var docType;
      var prefix;
      var nullNSURI = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      prefix = docType.lookupPrefix(nullNSURI);
      assertNull("nodelookupprefix03",prefix);
    
},
/**
* 



	Using lookupPrefix on an Entity and Notation node and check if the value returned is Null .

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix04 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix04") != null) return;
    var doc;
      var docType;
      var entity;
      var notation;
      var entitiesMap;
      var notationsMap;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      notationsMap = docType.notations;

      entity = entitiesMap.getNamedItem("alpha");
      notation = notationsMap.getNamedItem("notation1");
      prefix = entity.lookupPrefix("");
      assertNull("nodelookupprefixEntity04",prefix);
    prefix = notation.lookupPrefix("");
      assertNull("nodelookupprefixNotation04",prefix);
    
},
/**
* 
	Using lookupPrefix on the DocumentElement node of a new document with a 
	namespaceURI and prefix and check if the prefix value returned is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix05 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix05") != null) return;
    var doc;
      var elem;
      var domImpl;
      var newDoc;
      var prefix;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      var qname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      qname = "dom3:" + rootName;
domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,qname,nullDocType);
      elem = newDoc.documentElement;

      prefix = elem.lookupPrefix(rootNS);
      assertEquals("nodelookupprefix05","dom3",prefix);
       
},
/**
* 
	Invoke lookupPrefix on an Element node with no prefix, which has a namespace
	attribute declaration with a namespace prefix and check if the value of the prefix
	returned by using its namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix06 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix06") != null) return;
    var doc;
      var elem;
      var elemList;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(2);
      prefix = elem.lookupPrefix("http://www.netzero.com");
      assertEquals("nodelookupprefix06","dmstc",prefix);
       
},
/**
* 
	Invoke lookupPrefix on an Element node with no prefix, which has a namespace
	attribute declaration with a namespace prefix in its parent Element node and check if the value of the prefix
	returned by using its namespaceURI as a parameter is valid.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix07 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix07") != null) return;
    var doc;
      var elem;
      var elemList;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(2);
      prefix = elem.lookupPrefix("http://www.netzero.com");
      assertEquals("nodelookupprefix07","dmstc",prefix);
       
},
/**
* 
	Invoke lookupPrefix on an Element node with no prefix, which has 2 namespace
	attribute declarations with and without namespace prefixes and check if the value of the prefix
	returned by using each namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix08 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix08") != null) return;
    var doc;
      var elem;
      var elemList;
      var prefix;
      var prefixEmpty;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      prefix = elem.lookupPrefix("http://www.usa.com");
      assertEquals("nodelookupprefix08","dmstc",prefix);
       prefixEmpty = elem.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertNull("nodelookupnamespaceprefixEmpty08",prefixEmpty);
    
},
/**
* 



	Invoke lookupPrefix on an Element node with no prefix, whose parent has no prefix and 
	2 namespace attribute declarations with and without namespace prefixes and check if the value of 
	the prefix returned by using each namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix09 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix09") != null) return;
    var doc;
      var elem;
      var elemList;
      var prefix;
      var prefixEmpty;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      prefix = elem.lookupPrefix("http://www.usa.com");
      assertEquals("nodelookupprefix09","dmstc",prefix);
       prefixEmpty = elem.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertNull("nodelookupprefixEmpty09",prefixEmpty);
    
},
/**
* 
	Invoke lookupPrefix on a new Child of a new Element node with a namespace URI
	and prefix and using the parents namespace URI as an argument, verify if the prefix
	returned is a valid prefix of the parent.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix10 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix10") != null) return;
    var doc;
      var parent;
      var child;
      var prefix;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      child = doc.createElement("br");
      appendedChild = parent.appendChild(child);
      prefix = child.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertEquals("nodelookupprefix10","dom3",prefix);
       
},
/**
* 
	Invoke lookupPrefix on an imported new Element node with a namespace URI
	and prefix in a new Document and using the parents namespace URI as an argument, verify if the prefix
	returned is a valid prefix of the parent.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix11 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix11") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var elem;
      var importedNode;
      var prefix;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      var qname;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      qname = "dom3doc:" + rootName;
domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,qname,nullDocType);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:br");
      importedNode = newDoc.importNode(elem,true);
      prefix = importedNode.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertEquals("nodelookupprefix11","dom3",prefix);
       
},
/**
* 
	Invoke lookupPrefix on an renamed new Element node with a namespace URI
	and prefix in a new Document and using the parents namespace URI as an argument, verify if the prefix
	returned is a valid prefix of the parent.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix12 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix12") != null) return;
    var doc;
      var domImpl;
      var elem;
      var renamedNode;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      renamedNode = doc.renameNode(elem,"http://www.w3.org/1999/xhtml","ren:br");
      prefix = renamedNode.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertEquals("nodelookupprefix12","ren",prefix);
       
},
/**
* 
	Invoke lookupPrefix on a Element's new Text node, which has a namespace attribute declaration 
	with a namespace prefix in its parent Element node and check if the value of the prefix
	returned by using its namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix13 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix13") != null) return;
    var doc;
      var bodyElem;
      var elem;
      var txt;
      var prefix;
      var appendedChild;
      var bodyList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      txt = doc.createTextNode("Text");
      appendedChild = elem.appendChild(txt);
      appendedChild = bodyElem.appendChild(elem);
      prefix = txt.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertEquals("nodelookupprefix13","dom3",prefix);
       
},
/**
* 
	Invoke lookupPrefix on a Element's new CDATA node, which has a namespace attribute declaration 
	with a namespace prefix in its parent Element node and check if the value of the prefix
	returned by using its namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix14 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix14") != null) return;
    var doc;
      var bodyElem;
      var elem;
      var cdata;
      var prefix;
      var appendedChild;
      var bodyList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      cdata = doc.createCDATASection("Text");
      appendedChild = elem.appendChild(cdata);
      appendedChild = bodyElem.appendChild(elem);
      prefix = cdata.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertEquals("nodelookupprefix14","dom3",prefix);
       
},
/**
* 
	Invoke lookupPrefix on a Element's new Comment node, which has a namespace attribute declaration 
	with a namespace prefix in its parent Element node and check if the value of the prefix
	returned by using its namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix15 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix15") != null) return;
    var doc;
      var bodyElem;
      var elem;
      var comment;
      var clonedComment;
      var prefix;
      var appendedChild;
      var bodyList;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      comment = doc.createComment("Text");
      clonedComment = comment.cloneNode(true);
      appendedChild = elem.appendChild(clonedComment);
      appendedChild = bodyElem.appendChild(elem);
      prefix = clonedComment.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertEquals("nodelookupprefix15","dom3",prefix);
       
},
/**
* 
	Invoke lookupPrefix on a new Attribute node with with a namespace URI
	and prefix and verify if the prefix returned is null.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix16 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix16") != null) return;
    var doc;
      var elem;
      var attr;
      var prefix;
      var attNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      attNode = elem.setAttributeNodeNS(attr);
      prefix = attr.lookupPrefix("http://www.w3.org/XML/1998/namespace");
      assertNull("nodelookupprefix16",prefix);
    
},
/**
* 
	Invoke lookupPrefix on the title attribute node of the acronym node with
	a namespaceURI and a node prefix and check if the value of the prefix returned by 
	using its namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix17 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix17") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(2);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      prefix = attr.lookupPrefix("http://www.netzero.com");
      assertEquals("nodelookupprefix17","dmstc",prefix);
       
},
/**
* 
	Invoke lookupPrefix on the default attribute node of the p node with
	a namespaceURI and a node prefix and check if the value of the prefix returned by 
	using its namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix18 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix18") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("dir");
      prefix = attr.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertNull("xhtmlPrefixIsNull",prefix);
    prefix = attr.lookupPrefix("http://www.altavista.com");
      assertEquals("nodelookupprefixB18","nm",prefix);
       
},
/**
* 
	Invoke lookupPrefix on the an attribute node without a namespace prefix of
	an Element node that has a namespaceURI and prefix, and check if the value of the prefix 
	returned by using the Elements namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix19 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix19") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo_nodefaultns");
      elemList = doc.getElementsByTagName("html:p");
      elem = elemList.item(0);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("class");
      prefix = attr.lookupPrefix("http://www.w3.org/1999/xhtml");
      assertEquals("nodelookupprefix19","html",prefix);
       
},
/**
* 



	Invoke lookupPrefix on the an attribute node without a namespace prefix of
	an Element node that has a namespaceURI and prefix, and check if the value of the prefix 
	returned by using the Elements namespaceURI as a parameter is valid.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-lookupNamespacePrefix
*/
nodelookupprefix20 : function () {
   var success;
    if(checkInitialization(builder, "nodelookupprefix20") != null) return;
    var doc;
      var elem;
      var elemList;
      var attributesMap;
      var attr;
      var prefix;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attributesMap = elem.attributes;

      attr = attributesMap.getNamedItem("xmlns:nm");
      prefix = attr.lookupPrefix("http://www.altavista.com");
      assertEquals("nodelookupprefix20","nm",prefix);
       
},
/**
* 



	Using removeChild on this Document node attempt to remove this Document node and
	verify if a NOT_FOUND_ERR error is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild01 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild01") != null) return;
    var doc;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
	{
		success = false;
		try {
            removed = doc.removeChild(doc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("NOT_FOUND_ERR_noderemovechild01",success);
	}

},
/**
* 
	Using removeChild on this Document node attempt to remove a new Document node and
	vice versa and verify if a NOT_FOUND_ERR error is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild02 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild02") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var removed;
      var nullDocType = null;

      var docElem;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDoc = domImpl.createDocument(rootNS,rootName,nullDocType);
      
	{
		success = false;
		try {
            removed = doc.removeChild(newDoc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR_1",success);
	}

	{
		success = false;
		try {
            removed = newDoc.removeChild(doc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR_2",success);
	}

},
/**
* 
	Using removeChild on this DocumentElement node attempt to remove this Document node and
	verify if the DocumentElement is null.  Now try the reverse and a NOT_FOUND_ERR should be
	thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild03 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild03") != null) return;
    var doc;
      var docElem;
      var removedChild;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      removed = doc.removeChild(docElem);
      removedChild = doc.documentElement;

      assertNull("noderemovechild03",removedChild);
    
	{
		success = false;
		try {
            removed = docElem.removeChild(doc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 



	Using removeChild on this Document node attempt to remove DocumentType node and
	verify if the DocumentType node is null.   Now try the reverse and a NOT_FOUND_ERR should be
	thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild04 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild04") != null) return;
    var doc;
      var docType;
      var removedDocType;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      removed = doc.removeChild(docType);
      removedDocType = doc.doctype;

      assertNull("noderemovechild04",removedDocType);
    
	{
		success = false;
		try {
            removed = docType.removeChild(doc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("NOT_FOUND_ERR_noderemovechild04",success);
	}

},
/**
* 
	Using removeChild on this Document node attempt to remove a new DocumentType node and
	verify if the DocumentType node is null.  Attempting to remove the DocumentType
	a second type should result in a NOT_FOUND_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=417
*/
noderemovechild05 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild05") != null) return;
    var doc;
      var domImpl;
      var docType;
      var removedDocType;
      var nullPubId = null;

      var nullSysId = null;

      var appendedChild;
      var removedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docType = doc.doctype;

      
      try {
      removedChild = doc.removeChild(docType);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        assertNotNull("removedChildNotNull",removedChild);
removedDocType = doc.doctype;

      assertNull("noderemovechild05",removedDocType);
    
	{
		success = false;
		try {
            removedChild = docType.removeChild(doc);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("NOT_FOUND_ERR_noderemovechild05",success);
	}

},
/**
* 
Attempts to remove a notation from a Document node.  Since notations are children of 
DocumentType, not Document the operation should fail with a NOT_FOUND_ERR.  Attempting
to remove Document from a Notation should also fail either with a NOT_FOUND_ERR
or a NO_MODIFICATION_ALLOWED_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=418
*/
noderemovechild07 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild07") != null) return;
    var doc;
      var docType;
      var notations;
      var notation;
      var removedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      notations = docType.notations;

      notation = notations.getNamedItem("notation1");
      
	{
		success = false;
		try {
            removedChild = doc.removeChild(notation);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("NOT_FOUND_ERR_noderemovechild07_1",success);
	}

      try {
      removedChild = notation.removeChild(doc);
      
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



	Using removeChild on this Document node attempt to remove a new Comment node and
	verify the data of the removed comment node..

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild08 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild08") != null) return;
    var doc;
      var comment;
      var removedCmt;
      var data;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      comment = doc.createComment("Comment");
      appendedChild = doc.appendChild(comment);
      removedCmt = doc.removeChild(comment);
      data = removedCmt.data;

      assertEquals("noderemovechild08","Comment",data);
       
},
/**
* 



	Using removeChild on this Document node attempt to remove a new ProcessingInstruction node and
	verify the target of the removed ProcessingInstruction node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild09 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild09") != null) return;
    var doc;
      var pi;
      var removedPi;
      var target;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      pi = doc.createProcessingInstruction("PIT","PID");
      appendedChild = doc.appendChild(pi);
      removedPi = doc.removeChild(pi);
      target = removedPi.target;

      assertEquals("noderemovechild09","PIT",target);
       
},
/**
* 
	Using removeChild on a new DocumentFragment node attempt to remove a new Element node and
	verify the name of the removed Element node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild10 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild10") != null) return;
    var doc;
      var docFrag;
      var elem;
      var removedElem;
      var elemName;
      var appendedChild;
      var removedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docFrag = doc.createDocumentFragment();
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:br");
      appendedChild = docFrag.appendChild(elem);
      removedElem = docFrag.removeChild(elem);
      elemName = removedElem.nodeName;

      assertEquals("noderemovechild10","dom3:br",elemName);
       
},
/**
* 



	Using removeChild on a new DocumentFragment node attempt to remove a new Text node and
	verify the name of the removed Element node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild11 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild11") != null) return;
    var doc;
      var docFrag;
      var txt;
      var removedTxt;
      var appendedChild;
      var removedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      txt = doc.createTextNode("TEXT");
      appendedChild = docFrag.appendChild(txt);
      removedChild = docFrag.removeChild(txt);
      removedTxt = docFrag.firstChild;

      assertNull("noderemovechild11",removedTxt);
    
},
/**
* 
	The method removeChild removes the child node indicated by oldChild from the list 
	of children, and returns it. 

	Using removeChild on a new DocumentFragment node attempt to remove a new EntityReference node.
        Also attempt to remove the document fragment node from the EntityReference.  Verify that a 
        NO_MODIFICATION_ALLOWED_ERR (EntityReference node is read-only) or a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild12 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild12") != null) return;
    var doc;
      var docFrag;
      var eRef;
      var removedERef;
      var appendedChild;
      var removedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      eRef = doc.createEntityReference("ent1");
      appendedChild = docFrag.appendChild(eRef);
      removedChild = docFrag.removeChild(eRef);
      removedERef = docFrag.firstChild;

      assertNull("noderemovechild12",removedERef);
    
      try {
      removedChild = eRef.removeChild(docFrag);
      
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
	Using removeChild on a new EntityReference node attempt to remove the first child 
	of this node and verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild13 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild13") != null) return;
    var doc;
      var txt;
      var eRef;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      eRef = doc.createEntityReference("alpha");
      txt = eRef.firstChild;

      assertNotNull("txtNotNull",txt);

	{
		success = false;
		try {
            removed = eRef.removeChild(txt);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using removeChild on a new EntityReference node attempt to remove its last ProcessingInstruction 
	child node and verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild14 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild14") != null) return;
    var doc;
      var removed;
      var eRef;
      var pi;
      var entName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      eRef = doc.createEntityReference("ent4");
      pi = eRef.lastChild;

      assertNotNull("piNotNull",pi);

	{
		success = false;
		try {
            removed = eRef.removeChild(pi);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using removeChild on a new EntityReference node attempt to remove an Element child 
	and verify if a NO_MODIFICATION_ALLOWED_ERR is thrown. 

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild15 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild15") != null) return;
    var doc;
      var eRef;
      var elem;
      var entName;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      eRef = doc.createEntityReference("ent4");
      elem = eRef.firstChild;

      assertNotNull("elemNotNull",elem);

	{
		success = false;
		try {
            removed = eRef.removeChild(elem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using removeChild on the first 'p' Element node attempt to remove its 'em'
	Element child and verify the name of the returned node that was removed.  Now attempt
	the reverse and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild16 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild16") != null) return;
    var doc;
      var parentList;
      var childList;
      var parent;
      var child;
      var removed;
      var removedName;
      var removedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("em");
      child = parentList.item(0);
      parent = child.parentNode;

      removed = parent.removeChild(child);
      removedName = removed.nodeName;

      assertEquals("noderemovechild16","em",removedName);
       
	{
		success = false;
		try {
            removedNode = child.removeChild(parent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("NOT_FOUND_ERR_noderemovechild16",success);
	}

},
/**
* 
	Using removeChild on the first 'p' Element node attempt to remove a Text 
	node child and verify the contents of the returned node that was removed.  Now attempt
	the reverse and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild17 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild17") != null) return;
    var doc;
      var parentList;
      var parent;
      var child;
      var removed;
      var removedValue;
      var removedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("em");
      parent = parentList.item(0);
      child = parent.firstChild;

      removed = parent.removeChild(child);
      removedValue = removed.nodeValue;

      assertEquals("noderemovechild17","EMP0001",removedValue);
       
	{
		success = false;
		try {
            removedNode = child.removeChild(parent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 



	Using removeChild on the first 'p' Element node attempt to remove a CDATASection 
	node child and verify the contents of the returned node that was removed.  Now attempt
	the reverse and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild18 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild18") != null) return;
    var doc;
      var parentList;
      var parent;
      var child;
      var removed;
      var removedValue;
      var removedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("strong");
      parent = parentList.item(1);
      child = parent.lastChild;

      removed = parent.removeChild(child);
      removedValue = removed.nodeValue;

      assertEquals("noderemovechild18","This is an adjacent CDATASection with a reference to a tab &tab;",removedValue);
       
	{
		success = false;
		try {
            removedNode = child.removeChild(parent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using removeChild on the first 'p' Element node attempt to remove a EntityReference 
	node child and verify the nodeName of the returned node that was removed.  Attempt
	to remove a non-child from an entity reference and expect either a NOT_FOUND_ERR or
	a NO_MODIFICATION_ALLOWED_ERR.  Renove a child from an entity reference and expect
	a NO_MODIFICATION_ALLOWED_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild19 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild19") != null) return;
    var doc;
      var parentList;
      var parent;
      var child;
      var removed;
      var removedName;
      var removedNode;
      var entRefChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("acronym");
      parent = parentList.item(1);
      child = parent.firstChild;

      removed = parent.removeChild(child);
      removedName = removed.nodeName;

      assertEquals("noderemovechild19","beta",removedName);
       
      try {
      removedNode = child.removeChild(parent);
      fail("throw_DOMException");
     
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
        entRefChild = child.firstChild;

      
	if(
	
	(entRefChild != null)

	) {
	
	{
		success = false;
		try {
            removedNode = child.removeChild(entRefChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

	}
	
},
/**
* 
	Using removeChild on the first 'p' Element node attempt to remove a new
	Element child and verify the name of the returned node that was removed.  Now attempt
	to do the same on a cloned child and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild20 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild20") != null) return;
    var doc;
      var parentList;
      var childList;
      var parent;
      var child;
      var clonedChild;
      var removed;
      var removedName;
      var appendedChild;
      var removedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("p");
      parent = parentList.item(0);
      child = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:br");
      appendedChild = parent.appendChild(child);
      removed = parent.removeChild(child);
      removedName = removed.nodeName;

      assertEquals("noderemovechild20","dom3:br",removedName);
       clonedChild = child.cloneNode(true);
      
	{
		success = false;
		try {
            removedNode = parent.removeChild(clonedChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using removeChild on a new Element node attempt to remove a new Element child 
	and verify the name of the returned node that was removed.  Now append the parent
	to the documentElement and attempt to remove the child using removeChild on the
	documentElement and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild21 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild21") != null) return;
    var doc;
      var docElem;
      var parent;
      var child;
      var removed;
      var removedName;
      var removedNode;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      child = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:br");
      appendedChild = parent.appendChild(child);
      appendedChild = docElem.appendChild(parent);
      removed = parent.removeChild(child);
      removedName = removed.nodeName;

      assertEquals("noderemovechild21","dom3:br",removedName);
       
	{
		success = false;
		try {
            removedNode = docElem.removeChild(child);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using removeChild on a new Element node attempt to remove a new Comment child 
	and verify the name of the rturned node that was removed.  Now to remove the child 
	using removeChild on the parent and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild22 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild22") != null) return;
    var doc;
      var parent;
      var child;
      var removed;
      var removedName;
      var removedNode;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      child = doc.createComment("DATA");
      appendedChild = parent.appendChild(child);
      removed = parent.removeChild(child);
      removedName = removed.nodeValue;

      assertEquals("noderemovechild22","DATA",removedName);
       
	{
		success = false;
		try {
            removedNode = parent.removeChild(child);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using removeChild on a new Element node attempt to remove a new ProcessingInstruction child 
	and verify the name of the returned node that was removed.  Now to remove the child 
	using removeChild on the parent and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild23 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild23") != null) return;
    var doc;
      var parent;
      var child;
      var removed;
      var removedName;
      var removedNode;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      child = doc.createProcessingInstruction("TARGET","DATA");
      appendedChild = parent.appendChild(child);
      removed = parent.removeChild(child);
      removedName = removed.target;

      assertEquals("noderemovechild23","TARGET",removedName);
       
	{
		success = false;
		try {
            removedNode = parent.removeChild(child);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using removeChild on an Entity node attempt to remove a Text child 
	and verify if a NO_MODIFICATION_ALLOWED_ERR gets thrown.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild24 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild24") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var alphaEntity;
      var alphaText;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      alphaEntity = entitiesMap.getNamedItem("alpha");
      assertNotNull("alphaEntityNotNull",alphaEntity);
alphaText = alphaEntity.firstChild;

      assertNotNull("alphaTextNotNull",alphaText);

	{
		success = false;
		try {
            removed = alphaEntity.removeChild(alphaText);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using removeChild on an Entity node attempt to remove an Element child 
	and verify if a NO_MODIFICATION_ALLOWED_ERR gets thrown.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild25 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild25") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var ent4;
      var span;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      ent4 = entitiesMap.getNamedItem("ent4");
      assertNotNull("ent4NotNull",ent4);
span = ent4.firstChild;

      assertNotNull("spanNotNull",span);

	{
		success = false;
		try {
            removed = ent4.removeChild(span);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using removeChild on an Entity node attempt to remove a ProcessingInstruction child 
	and verify if a NO_MODIFICATION_ALLOWED_ERR gets thrown.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild26 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild26") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var ent4;
      var pi;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      ent4 = entitiesMap.getNamedItem("ent4");
      assertNotNull("ent4NotNull",ent4);
pi = ent4.lastChild;

      assertNotNull("piNotNull",pi);

	{
		success = false;
		try {
            removed = ent4.removeChild(pi);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	The method removeChild removes the child node indicated by oldChild from the list 
	of children, and returns it. 

	Using removeChild on a Notation node attempt to remove an Entity node 
	and verify if a NO_MODIFICATION_ALLOWED_ERR or a NOT_FOUND_ERR gets thrown.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild27 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild27") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var notationsMap;
      var child;
      var parent;
      var removed;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      notationsMap = docType.notations;

      child = entitiesMap.getNamedItem("ent1");
      parent = notationsMap.getNamedItem("notation1");
      
      try {
      removed = parent.removeChild(child);
      
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
	Using removeChild on an Attribute node attempt to remove its Text child node and
	and verify the name of the returned node that was removed.  Now attempt the reverse
	and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild28 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild28") != null) return;
    var doc;
      var parentList;
      var attrsMap;
      var parent;
      var child;
      var elem;
      var removed;
      var removedName;
      var removedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("acronym");
      elem = parentList.item(0);
      attrsMap = elem.attributes;

      parent = attrsMap.getNamedItem("xsi:noNamespaceSchemaLocation");
      child = parent.firstChild;

      removed = parent.removeChild(child);
      removedName = removed.nodeValue;

      assertEquals("noderemovechild28","Yes",removedName);
       
	{
		success = false;
		try {
            removedNode = child.removeChild(parent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("NOT_FOUND_ERR_noderemovechild28",success);
	}

},
/**
* 
	Using removeChild on a namespace Attribute node attempt to remove its Text child node and
	and verify the name of the returned node that was removed.  Now attempt the reverse
	and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild29 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild29") != null) return;
    var doc;
      var parentList;
      var attrsMap;
      var parent;
      var child;
      var elem;
      var removed;
      var removedName;
      var removedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("p");
      elem = parentList.item(0);
      attrsMap = elem.attributes;

      parent = attrsMap.getNamedItem("xmlns:dmstc");
      child = parent.firstChild;

      removed = parent.removeChild(child);
      removedName = removed.nodeValue;

      assertEquals("noderemovechild29","http://www.usa.com",removedName);
       
	{
		success = false;
		try {
            removedNode = child.removeChild(parent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 



	Using removeChild on a default Attribute node attempt to remove its Text child node and
	and verify the name of the returned node that was removed.  Now attempt the reverse
	and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild30 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild30") != null) return;
    var doc;
      var parentList;
      var attrsMap;
      var parent;
      var child;
      var elem;
      var removed;
      var removedNode;
      var removedName;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("p");
      elem = parentList.item(3);
      attrsMap = elem.attributes;

      parent = attrsMap.getNamedItem("dir");
      child = parent.firstChild;

      removed = parent.removeChild(child);
      removedName = removed.nodeValue;

      assertEquals("noderemovechild30","rtl",removedName);
       
	{
		success = false;
		try {
            removedNode = child.removeChild(parent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using removeChild on a default Attribute node attempt to remove its EntityReference child node and
	and verify the name of the returned node that was removed.  Now attempt the reverse
	and verify if a NO_MODIFICATION_ALLOWED_ERR or NOT_FOUND_ERR is thrown.
	Then remove an child of the entity reference and expect a NO_MODIFICATION_ALLOWED_ERR.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-1734834066
*/
noderemovechild31 : function () {
   var success;
    if(checkInitialization(builder, "noderemovechild31") != null) return;
    var doc;
      var parentList;
      var attrsMap;
      var parent;
      var child;
      var entRef;
      var elem;
      var removed;
      var removedNode;
      var removedName;
      var appendedChild;
      var entRefChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parentList = doc.getElementsByTagName("acronym");
      elem = parentList.item(3);
      attrsMap = elem.attributes;

      parent = attrsMap.getNamedItem("class");
      entRef = doc.createEntityReference("delta");
      appendedChild = parent.appendChild(entRef);
      child = parent.lastChild;

      removed = parent.removeChild(child);
      removedName = removed.nodeName;

      assertEquals("noderemovechild31","delta",removedName);
       
      try {
      removedNode = child.removeChild(parent);
      fail("throw_DOMException");
     
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
        entRefChild = child.firstChild;

      
	if(
	
	(entRefChild != null)

	) {
	
	{
		success = false;
		try {
            removedNode = child.removeChild(entRefChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

	}
	
},
/**
* 
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.
      

	Using replaceChild on this Document node attempt to replace this Document node with itself
	and verify if a HIERARCHY_REQUEST_ERR error or a NOT_FOUND_ERR (since oldChild
        is not a child of this node) is thrown.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild01 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild01") != null) return;
    var doc;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      try {
      replaced = doc.replaceChild(doc,doc);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
       break;
      case /* HIERARCHY_REQUEST_ERR */ 3 :
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
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on this Document node attempt to replace this DocumentType node with 
	its DocumentType (replacing node with itself -- implementation dependent) 
        
* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild02 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild02") != null) return;
    var doc;
      var docType;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      replaced = doc.replaceChild(docType,docType);
      
},
/**
* 
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on this Document node attempt to replace this Document node with 
	a new DocumentNode and verify if a HIERARCHY_REQUEST_ERR, WRONG_DOCUMENT_ERR 
        or NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild03 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild03") != null) return;
    var doc;
      var newDoc;
      var domImpl;
      var nullDocType = null;

      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM","dom3:doc",nullDocType);
      
      try {
      replaced = doc.replaceChild(newDoc,doc);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
       break;
      case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* WRONG_DOCUMENT_ERR */ 4 :
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
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on this Document node attempt to replace this DocumentElement node with 
	this Document Node and verify if a HIERARCHY_REQUEST_ERR or a NOT_FOUND_ERR error is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild04 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild04") != null) return;
    var doc;
      var docElem;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      
      try {
      replaced = doc.replaceChild(doc,docElem);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
       break;
      case /* HIERARCHY_REQUEST_ERR */ 3 :
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
	Using replaceChild on this Document node attempt to replace this DocumentElement node 
	with one of its child elements and verify if the name of the replaced documentElement Node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild06 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild06") != null) return;
    var doc;
      var docElem;
      var replaced;
      var elem;
      var childList;
      var nodeName;
      var replacedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      childList = doc.getElementsByTagName("p");
      elem = childList.item(0);
      
      try {
      replacedNode = doc.replaceChild(elem,docElem);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        replaced = doc.documentElement;

      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild06","p",nodeName);
       
},
/**
* 
	Using replaceChild on this Document node attempt to replace this DocumentElement node 
	with  a new element and verify if the name of the replaced documentElement Node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild07 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild07") != null) return;
    var doc;
      var docElem;
      var replaced;
      var elem;
      var nodeName;
      var replacedNode;
      var rootNS;
      var rootName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      elem = doc.createElementNS(rootNS,rootName);
      
      try {
      replacedNode = doc.replaceChild(elem,docElem);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        replaced = doc.documentElement;

      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild07",rootName,nodeName);
       
},
/**
* 
	Using replaceChild on this Document node attempt to replace this DocumentElement node 
	with  a new element that was created in another document and verify if a
	WRONG_DOCUMENT_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild08 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild08") != null) return;
    var doc;
      var doc2;
      var docElem;
      var elem;
      var nodeName;
      var replaced;
      var rootNS;
      var rootName;
      var domImpl;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      domImpl = getImplementation();
doc2 = domImpl.createDocument(rootNS,rootName,nullDocType);
      elem = doc2.createElementNS(rootNS,rootName);
      
      try {
      replaced = doc.replaceChild(elem,docElem);
      fail("throw_WRONG_DOCUMENT_OR_NOT_SUPPORTED");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* WRONG_DOCUMENT_ERR */ 4 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on this Document node attempt to replace an Entity node with
	a notation node of retieved from the DTD of another document and verify if a
	NOT_FOUND_ERR or WRONG_DOCUMENT_ERR or HIERARCHY_REQUEST err is thrown.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild10 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild10") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var ent;
      var doc1;
      var docType1;
      var notationsMap;
      var notation;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      ent = entitiesMap.getNamedItem("alpha");
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      docType1 = doc1.doctype;

      notationsMap = docType1.notations;

      notation = notationsMap.getNamedItem("notation1");
      
      try {
      replaced = doc.replaceChild(notation,ent);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_FOUND_ERR */ 8 :
       break;
      case /* WRONG_DOCUMENT_ERR */ 4 :
       break;
      case /* HIERARCHY_REQUEST_ERR */ 3 :
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
	Using replaceChild on this Document node, attempt to replace a new ProcessingInstruction
	node with new Comment node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=416
*/
nodereplacechild12 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild12") != null) return;
    var doc;
      var pi;
      var replaced;
      var comment;
      var lastChild;
      var nodeName;
      var replacedNode;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      comment = doc.createComment("dom3:doc");
      pi = doc.createProcessingInstruction("PITarget","PIData");
      appendedChild = doc.appendChild(comment);
      appendedChild = doc.appendChild(pi);
      replacedNode = doc.replaceChild(comment,pi);
      assertNotNull("returnValueNotNull",replacedNode);
nodeName = replacedNode.nodeName;

      assertEquals("returnValueIsPI","PITarget",nodeName);
       lastChild = doc.lastChild;

      assertNotNull("lastChildNotNull",lastChild);
nodeName = lastChild.nodeName;

      assertEquals("lastChildIsComment","#comment",nodeName);
       
},
/**
* 
	Using replaceChild on this Document node attempt to replace this DocumentType node with 
	a new DocumentType and verify the name of the replaced DocumentType node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild13 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild13") != null) return;
    var doc;
      var docType;
      var newDocType;
      var replaced;
      var domImpl;
      var nodeName;
      var nullPubId = null;

      var nullSysId = null;

      var docElem;
      var docElemName;
      var docElemNS;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      docElemName = docElem.tagName;

      docElemNS = docElem.namespaceURI;

      docType = doc.doctype;

      domImpl = doc.implementation;
newDocType = domImpl.createDocumentType(docElemName,nullPubId,nullSysId);
      
      try {
      replaced = doc.replaceChild(newDocType,docType);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        nodeName = replaced.nodeName;

      assertEquals("nodereplacechild13",docElemName,nodeName);
       
},
/**
* 
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on the documentElement of a newly created Document node, attempt to replace an
        element child of this documentElement node with a child that was imported from another document.  
        Verify the nodeName of the replaced element node. 

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild14 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild14") != null) return;
    var doc;
      var newDoc;
      var docElem;
      var elem;
      var elem2;
      var imported;
      var replaced;
      var domImpl;
      var nodeName;
      var appendedChild;
      var nullDocType = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/DOM/Test","dom3:doc1elem");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/test","dom3:doc",nullDocType);
      elem2 = newDoc.createElementNS("http://www.w3.org/DOM/Test","dom3:doc2elem");
      imported = newDoc.importNode(elem,true);
      docElem = newDoc.documentElement;

      appendedChild = docElem.appendChild(imported);
      appendedChild = docElem.appendChild(elem2);
      replaced = docElem.replaceChild(imported,elem2);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild14","dom3:doc2elem",nodeName);
       
},
/**
* 
	Using replaceChild on a DocumentFragment node attempt to replace an Element node with 
	another Element and the replaced element.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild15 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild15") != null) return;
    var doc;
      var docFrag;
      var elem;
      var elem2;
      var replaced;
      var domImpl;
      var title;
      var appendedChild;
      var docElem;
      var rootName;
      var rootNS;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      elem = doc.createElementNS(rootNS,rootName);
      domImpl = doc.implementation;
docFrag = doc.createDocumentFragment();
      elem2 = doc.createElementNS(rootNS,rootName);
      elem2.setAttribute("title","new element");
      appendedChild = docFrag.appendChild(elem2);
      replaced = docFrag.replaceChild(elem,elem2);
      title = replaced.getAttribute("title");
      assertEquals("nodereplacechild15","new element",title);
       
},
/**
* 
	Using replaceChild on a DocumentFragment node attempt to replace an Element node with 
	another Element and verify the name of the replaced Element node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild16 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild16") != null) return;
    var doc;
      var docFrag;
      var elem;
      var txt;
      var replaced;
      var nodeName;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      docFrag = doc.createDocumentFragment();
      txt = doc.createTextNode("Comment");
      appendedChild = docFrag.appendChild(txt);
      appendedChild = docFrag.appendChild(elem);
      replaced = docFrag.replaceChild(txt,elem);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild16","dom3:p",nodeName);
       
},
/**
* 



	Using replaceChild on a DocumentFragment node attempt to replace a Comment node with 
	a ProcessingInstruction and vice versa verify the data of the replaced nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild17 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild17") != null) return;
    var doc;
      var docFrag;
      var pi;
      var cmt;
      var replacedCmt;
      var replacedPi;
      var data;
      var target;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      cmt = doc.createComment("Comment");
      pi = doc.createProcessingInstruction("target","Comment");
      appendedChild = docFrag.appendChild(pi);
      appendedChild = docFrag.appendChild(cmt);
      replacedCmt = docFrag.replaceChild(pi,cmt);
      data = replacedCmt.data;

      assertEquals("nodereplacechild17_1","Comment",data);
       replacedPi = docFrag.replaceChild(cmt,pi);
      target = replacedPi.target;

      assertEquals("nodereplacechild17_2","target",target);
       
},
/**
* 
	Using replaceChild on a DocumentFragment node attempt to replace a CDATASection node with 
	a EntityReference and vice versa verify the data of the replaced nodes.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild18 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild18") != null) return;
    var doc;
      var docFrag;
      var entRef;
      var cdata;
      var replacedCData;
      var replacedEref;
      var cdataName;
      var erefName;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      cdata = doc.createCDATASection("CDATASection");
      entRef = doc.createEntityReference("alpha");
      appendedChild = docFrag.appendChild(entRef);
      appendedChild = docFrag.appendChild(cdata);
      replacedCData = docFrag.replaceChild(entRef,cdata);
      cdataName = replacedCData.nodeValue;

      assertEquals("nodereplacechild18_1","CDATASection",cdataName);
       replacedEref = docFrag.replaceChild(cdata,entRef);
      erefName = replacedEref.nodeName;

      assertEquals("nodereplacechild18_2","alpha",erefName);
       
},
/**
* 
	Using replaceChild on a DocumentFragment node attempt to replace an Element node with 
	its EntityReference child verify the nodeName of the replaced node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild19 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild19") != null) return;
    var doc;
      var docFrag;
      var entRef;
      var elem;
      var replaced;
      var nodeName;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      entRef = doc.createEntityReference("alpha");
      appendedChild = elem.appendChild(entRef);
      appendedChild = docFrag.appendChild(elem);
      replaced = docFrag.replaceChild(entRef,elem);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild19","dom3:p",nodeName);
       
},
/**
* 
	Using replaceChild on a DocumentFragment node attempt to replace an Element node with 
	an Attr Node and verify if a HIERARCHY_REQUEST_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild20 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild20") != null) return;
    var doc;
      var docFrag;
      var attr;
      var elem;
      var replaced;
      var nodeName;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      appendedChild = docFrag.appendChild(elem);
      
	{
		success = false;
		try {
            replaced = docFrag.replaceChild(attr,elem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on this DocumentType node attempt to replace an Entity node with
	a notation node of retieved from the DTD of another document and verify if a
	NO_MODIFICATION_ALLOWED_ERR is thrown since DocumentType node is read-only.
	Also try replacing the docType with an entity node and see if the same exception gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild21 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild21") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var ent;
      var doc1;
      var docType1;
      var notationsMap;
      var notation;
      var replacedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      ent = entitiesMap.getNamedItem("alpha");
      
      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "hc_staff");
      docType1 = doc1.doctype;

      notationsMap = docType1.notations;

      notation = notationsMap.getNamedItem("notation1");
      
	{
		success = false;
		try {
            replacedChild = docType.replaceChild(notation,ent);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("NO_MODIFICATION_ALLOWED_ERR1_nodereplacechild21",success);
	}

	{
		success = false;
		try {
            replacedChild = docType.replaceChild(ent,docType);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("NO_MODIFICATION_ALLOWED_ERR2_nodereplacechild21",success);
	}

},
/**
* 
	Using replaceChild on a new EntityReference node attempt to replace an EntityReference node with 
	its Element parent, with itself and vice versa verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild22 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild22") != null) return;
    var doc;
      var entRefMain;
      var entRef;
      var elem;
      var appendedChild;
      var replacedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      entRefMain = doc.createEntityReference("delta");
      entRef = doc.createEntityReference("beta");
      appendedChild = elem.appendChild(entRef);
      
	{
		success = false;
		try {
            replacedChild = entRefMain.replaceChild(elem,entRef);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_1",success);
	}

	{
		success = false;
		try {
            replacedChild = entRefMain.replaceChild(entRef,elem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_2",success);
	}

	{
		success = false;
		try {
            replacedChild = entRefMain.replaceChild(entRefMain,entRef);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_3",success);
	}

},
/**
* 
	Using replaceChild on a new EntityReference node attempt to replace an Element, Text,
	Comment, ProcessingInstruction and CDATASection nodes with each other and in each case
	verify if a NO_MODIFICATION_ALLOWED_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild23 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild23") != null) return;
    var doc;
      var entRef;
      var txt;
      var elem;
      var comment;
      var pi;
      var cdata;
      var replaced;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:p");
      entRef = doc.createEntityReference("delta");
      txt = doc.createTextNode("Text");
      comment = doc.createComment("Comment");
      cdata = doc.createCDATASection("CDATASection");
      pi = doc.createProcessingInstruction("target","data");
      appendedChild = elem.appendChild(entRef);
      appendedChild = elem.appendChild(txt);
      appendedChild = elem.appendChild(comment);
      appendedChild = elem.appendChild(pi);
      appendedChild = elem.appendChild(cdata);
      
	{
		success = false;
		try {
            replaced = entRef.replaceChild(cdata,elem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_1",success);
	}

	{
		success = false;
		try {
            replaced = entRef.replaceChild(pi,cdata);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_2",success);
	}

	{
		success = false;
		try {
            replaced = entRef.replaceChild(comment,pi);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_3",success);
	}

	{
		success = false;
		try {
            replaced = entRef.replaceChild(txt,comment);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_4",success);
	}

	{
		success = false;
		try {
            replaced = entRef.replaceChild(elem,txt);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR_5",success);
	}

},
/**
* 
	Using replaceChild on an EntityReference node attempt to replace an Element node with 
	an EntityReference node verify if a NO_MODIFICATION_ALLOWED_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild24 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild24") != null) return;
    var doc;
      var childList;
      var entRef;
      var elem;
      var replaced;
      var nodeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      elem = childList.item(1);
      entRef = elem.firstChild;

      
	{
		success = false;
		try {
            replaced = entRef.replaceChild(entRef,elem);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using replaceChild on an Element node attempt to replace an 
	EntityReference or Text child node 
	with an Entity node and with itself and verify if a HIERARCHY_REQUEST_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild25 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild25") != null) return;
    var doc;
      var docType;
      var entities;
      var entity;
      var childList;
      var entRef;
      var elem;
      var replaced;
      var nodeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entities = docType.entities;

      entity = entities.getNamedItem("alpha");
      childList = doc.getElementsByTagName("acronym");
      elem = childList.item(1);
      entRef = elem.firstChild;

      
	{
		success = false;
		try {
            replaced = elem.replaceChild(entity,entRef);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR_1",success);
	}

	{
		success = false;
		try {
            replaced = elem.replaceChild(elem,entRef);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR_2",success);
	}

},
/**
* 
	Using replaceChild on an Element node attempt to replace a Text child node with an Element
	node that is an ancestor of this Element node and verify if a HIERARCHY_REQUEST_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild26 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild26") != null) return;
    var doc;
      var childList;
      var docElem;
      var elem;
      var firstChild;
      var nodeName;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      childList = doc.getElementsByTagName("p");
      elem = childList.item(0);
      firstChild = elem.firstChild;

      
	{
		success = false;
		try {
            replaced = elem.replaceChild(docElem,firstChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on an Element node attempt to replace an Element node with another 
	Element from another document and verify if a WRONG_DOCUMENT_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild27 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild27") != null) return;
    var doc;
      var doc2;
      var childList;
      var childList2;
      var elem2;
      var elem;
      var firstChild;
      var nodeName;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagNameNS("*","p");
      elem = childList.item(0);
      firstChild = elem.firstChild;

      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      childList2 = doc2.getElementsByTagNameNS("*","p");
      elem2 = childList2.item(0);
      
	{
		success = false;
		try {
            replaced = elem.replaceChild(elem2,firstChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("WRONG_DOCUMENT_ERR_nodereplacechild27",success);
	}

},
/**
* 
Attempt to replace a text node with a text node from an
entity reference. Since the replacing text node should be removed
from its current location first, a NO_MODIFICATION_ALLOWED_ERR should
be thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild28 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild28") != null) return;
    var doc;
      var childList;
      var acronym;
      var betaRef;
      var dallas;
      var betaText;
      var appendedChild;
      var replacedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("acronym");
      acronym = childList.item(1);
      betaRef = acronym.firstChild;

      assertNotNull("betaRefNotNull",betaRef);
betaText = betaRef.firstChild;

      assertNotNull("betaTextNotNull",betaText);
dallas = betaRef.nextSibling;

      assertNotNull("dallasNotNull",dallas);

	{
		success = false;
		try {
            replacedChild = acronym.replaceChild(betaText,dallas);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Using replaceChild on an Element node attempt to replace a new Element node with 
	another new Element node and verify if a NOT_FOUND_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild29 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild29") != null) return;
    var doc;
      var childList;
      var elem;
      var oldChild;
      var newChild;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("p");
      elem = childList.item(0);
      oldChild = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:br");
      newChild = doc.createElementNS("http://www.w3.org/1999/xhtml","dom3:span");
      
	{
		success = false;
		try {
            replaced = elem.replaceChild(newChild,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 



	Using replaceChild on an Element node attempt to replace a new Element child node with 
	new child nodes and vice versa and in each case verify the name of the replaced node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild30 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild30") != null) return;
    var doc;
      var parent;
      var oldChild;
      var newElement;
      var newText;
      var newComment;
      var newPI;
      var newCdata;
      var newERef;
      var replaced;
      var nodeName;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:html");
      oldChild = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:head");
      newElement = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:body");
      appendedChild = parent.appendChild(oldChild);
      appendedChild = parent.appendChild(newElement);
      newText = doc.createTextNode("Text");
      appendedChild = parent.appendChild(newText);
      newComment = doc.createComment("Comment");
      appendedChild = parent.appendChild(newComment);
      newPI = doc.createProcessingInstruction("target","data");
      appendedChild = parent.appendChild(newPI);
      newCdata = doc.createCDATASection("Cdata");
      appendedChild = parent.appendChild(newCdata);
      newERef = doc.createEntityReference("delta");
      appendedChild = parent.appendChild(newERef);
      replaced = parent.replaceChild(newElement,oldChild);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_1","xhtml:head",nodeName);
       replaced = parent.replaceChild(oldChild,newElement);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_2","xhtml:body",nodeName);
       replaced = parent.replaceChild(newText,oldChild);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_3","xhtml:head",nodeName);
       replaced = parent.replaceChild(oldChild,newText);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_4","#text",nodeName);
       replaced = parent.replaceChild(newComment,oldChild);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_5","xhtml:head",nodeName);
       replaced = parent.replaceChild(oldChild,newComment);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_6","#comment",nodeName);
       replaced = parent.replaceChild(oldChild,newPI);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_7","target",nodeName);
       replaced = parent.replaceChild(oldChild,newCdata);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_8","#cdata-section",nodeName);
       replaced = parent.replaceChild(oldChild,newERef);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild30_9","delta",nodeName);
       
},
/**
* 
	Using replaceChild on an Element node that is the replacement Text of an EntityReference
	node, attempt to replace its Text child node with a new Element node and verify if 
	a NO_MODIFICATION_ALLOWED_ERR gets thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild31 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild31") != null) return;
    var doc;
      var childList;
      var elem;
      var span;
      var ent4Ref;
      var spanText;
      var newChild;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      childList = doc.getElementsByTagName("var");
      elem = childList.item(2);
      ent4Ref = elem.firstChild;

      span = ent4Ref.firstChild;

      assertNotNull("spanNotNull",span);
spanText = span.firstChild;

      assertNotNull("spanTextNotNull",spanText);
newChild = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      
	{
		success = false;
		try {
            replaced = span.replaceChild(newChild,spanText);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	The method replaceChild replaces the child node oldChild with newChild in the list of 
	children, and returns the oldChild node.

	Using replaceChild on an Attr node to replace its EntityReference Child with a 
	new Text Node and verify the name of the replaced child.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild32 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild32") != null) return;
    var doc;
      var childList;
      var elem;
      var parent;
      var oldChild;
      var newChild;
      var replaced;
      var nodeName;
      var nodeType;
      var enRef;
      var enRefChild;
      var reference = "entity1";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      newChild = doc.createTextNode("Text");
      childList = doc.getElementsByTagNameNS("*","acronym");
      elem = childList.item(3);
      parent = elem.getAttributeNode("class");
      enRef = doc.createEntityReference(reference);
      enRefChild = parent.appendChild(enRef);
      replaced = parent.replaceChild(newChild,enRefChild);
      nodeName = replaced.nodeName;

      assertEquals("nodereplacechild32","entity1",nodeName);
       
},
/**
* 
	Using replaceChild on a default Attr node to replace its Text Child with a 
	new EntityReference Node and verify the value of the replaced child.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild33 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild33") != null) return;
    var doc;
      var childList;
      var elem;
      var parent;
      var oldChild;
      var newChild;
      var replaced;
      var nodeValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      newChild = doc.createEntityReference("delta");
      childList = doc.getElementsByTagName("p");
      elem = childList.item(3);
      parent = elem.getAttributeNode("dir");
      oldChild = parent.lastChild;

      replaced = parent.replaceChild(newChild,oldChild);
      nodeValue = replaced.nodeValue;

      assertEquals("nodereplacechild33","rtl",nodeValue);
       
},
/**
* 
	Using replaceChild on a new Attr node, replace its new EntityReference Child with a 
	new Text Node and verify the value of the new child.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild34 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild34") != null) return;
    var doc;
      var parent;
      var oldChild;
      var newChild;
      var nodeValue;
      var appendedChild;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      oldChild = doc.createEntityReference("delta");
      appendedChild = parent.appendChild(oldChild);
      newChild = doc.createTextNode("Text");
      replaced = parent.replaceChild(newChild,oldChild);
      nodeValue = parent.value;

      assertEquals("nodereplacechild34","Text",nodeValue);
       
},
/**
* 
	Using replaceChild on a new Attr node, replace its new EntityRefernece Child with a 
	new Attr Node and verify if a HIERARCHY_REQUEST_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild35 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild35") != null) return;
    var doc;
      var parent;
      var oldChild;
      var newChild;
      var nodeValue;
      var appendedChild;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      oldChild = doc.createEntityReference("delta");
      appendedChild = parent.appendChild(oldChild);
      newChild = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      
	{
		success = false;
		try {
            replaced = parent.replaceChild(newChild,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 3);
		}
		assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
	}

},
/**
* 
	Using replaceChild on a new Attr node, replace its new EntityRefernece node with a 
	new Text Node and verify if a NOT_FOUND_ERR is thrown.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild36 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild36") != null) return;
    var doc;
      var parent;
      var oldChild;
      var newChild;
      var nodeValue;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      parent = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      oldChild = doc.createEntityReference("delta");
      newChild = doc.createTextNode("Text");
      
	{
		success = false;
		try {
            replaced = parent.replaceChild(newChild,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 8);
		}
		assertTrue("throw_NOT_FOUND_ERR",success);
	}

},
/**
* 
	Using replaceChild on a new Attr node, replace its new Text node with a 
	new EntityReference Node created by another document and verify if a 
	WRONG_DOCUMENT_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild37 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild37") != null) return;
    var doc;
      var doc2;
      var parent;
      var oldChild;
      var newChild;
      var nodeValue;
      var replaced;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      parent = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      oldChild = doc.createTextNode("Text");
      newChild = doc2.createEntityReference("delta");
      appendedChild = parent.appendChild(oldChild);
      
	{
		success = false;
		try {
            replaced = parent.replaceChild(newChild,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 4);
		}
		assertTrue("throw_WRONG_DOCUMENT_ERR",success);
	}

},
/**
* 
	Using replaceChild on an Entity node attempt to replace its Text child with new Text,
	Comment, ProcessingInstruction and CDATASection nodes and in each case verify if 
	a NO_MODIFICATION_ALLOWED_ERR is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild38 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild38") != null) return;
    var doc;
      var docType;
      var entitiesMap;
      var ent;
      var oldChild;
      var entRef;
      var txt;
      var elem;
      var comment;
      var pi;
      var cdata;
      var replaced;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitiesMap = docType.entities;

      ent = entitiesMap.getNamedItem("alpha");
      assertNotNull("alphaEntity",ent);
oldChild = ent.firstChild;

      assertNotNull("alphaText",oldChild);
cdata = doc.createCDATASection("CDATASection");
      
	{
		success = false;
		try {
            replaced = ent.replaceChild(cdata,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR1",success);
	}
pi = doc.createProcessingInstruction("target","data");
      
	{
		success = false;
		try {
            replaced = ent.replaceChild(pi,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR2",success);
	}
comment = doc.createComment("Comment");
      
	{
		success = false;
		try {
            replaced = ent.replaceChild(comment,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR3",success);
	}
txt = doc.createTextNode("Text");
      
	{
		success = false;
		try {
            replaced = ent.replaceChild(txt,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR4",success);
	}
elem = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      
	{
		success = false;
		try {
            replaced = ent.replaceChild(elem,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR5",success);
	}
entRef = doc.createEntityReference("delta");
      
	{
		success = false;
		try {
            replaced = ent.replaceChild(entRef,oldChild);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR6",success);
	}

},
/**
* 
Attempt to add a second document element by a replacing a trailing comment.  The attempt should result
in a HIERARCHY_REQUEST_ERR or NOT_SUPPORTED_ERR. 

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild39 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild39") != null) return;
    var doc;
      var docElem;
      var rootName;
      var rootNS;
      var newComment;
      var newElement;
      var retNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      rootNS = docElem.namespaceURI;

      newElement = doc.createElementNS(rootNS,rootName);
      newComment = doc.createComment("second element goes here");
      retNode = doc.appendChild(newComment);
      
      try {
      retNode = doc.replaceChild(newElement,newComment);
      fail("throw_HIERARCHY_REQUEST_OR_NOT_SUPPORTED");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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
Attempt to add a second document element by a comment.  The attempt should result
in a HIERARCHY_REQUEST_ERR or NOT_SUPPORTED_ERR. 

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-785887307
*/
nodereplacechild40 : function () {
   var success;
    if(checkInitialization(builder, "nodereplacechild40") != null) return;
    var doc;
      var docElem;
      var rootName;
      var publicId = null;

      var systemId = null;

      var newComment;
      var newDocType;
      var domImpl;
      var retNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      docElem = doc.documentElement;

      rootName = docElem.tagName;

      domImpl = doc.implementation;
newDocType = domImpl.createDocumentType(rootName,publicId,systemId);
      newComment = doc.createComment("second element goes here");
      retNode = doc.insertBefore(newComment,docElem);
      
      try {
      retNode = doc.replaceChild(newDocType,newComment);
      fail("throw_HIERARCHY_REQUEST_OR_NOT_SUPPORTED");
     
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* HIERARCHY_REQUEST_ERR */ 3 :
       break;
      case /* NOT_SUPPORTED_ERR */ 9 :
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
Attempt to set textContent for a Document node and check that the document appears
to be unaffected.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent01 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent01") != null) return;
    var doc;
      var nodeName;
      var elemList;
      var elem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.textContent = "textContent";

      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      assertNotNull("stillHasAcronyms",elem);
nodeName = elem.nodeName;

      assertEquals("nodesettextcontent01","acronym",nodeName);
       
},
/**
* 
	The method setTextContent has no effect when the node is defined to be null.
	
	Using setTextContent on a new Document node, attempt to set the textContent of this
	new Document node to textContent.  Check if it was not set by checking the nodeName
	attribute of a new Element of this Document node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent02 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent02") != null) return;
    var doc;
      var domImpl;
      var newDoc;
      var nodeName;
      var elemChild;
      var newElem;
      var elemList;
      var nullDocType = null;

      var appendedChild;
      var documentElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;
newDoc = domImpl.createDocument("http://www.w3.org/DOM/Test","dom3:elem",nullDocType);
      newElem = newDoc.createElementNS("http://www.w3.org/DOM/Test","dom3:childElem");
      documentElem = newDoc.documentElement;

      appendedChild = documentElem.appendChild(newElem);
      newDoc.textContent = "textContent";

      elemList = newDoc.getElementsByTagNameNS("*","childElem");
      elemChild = elemList.item(0);
      nodeName = elemChild.nodeName;

      assertEquals("nodesettextcontent02","dom3:childElem",nodeName);
       
},
/**
* 

	
	Using setTextContent on this DocumentType node, attempt to set the textContent of this
	DocumentType node to textContent.  Retreive the textContent and verify if it is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent03 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent03") != null) return;
    var doc;
      var docType;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      docType.textContent = "textContent";

      textContent = docType.textContent;

      assertNull("nodesettextcontent03",textContent);
    
},
/**
* 

	
	Using setTextContent on this DocumentType node, attempt to set the textContent of a
	Notation node to textContent.  Retreive the textContent and verify if it is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent04 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent04") != null) return;
    var doc;
      var docType;
      var notationsMap;
      var notation1;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      notationsMap = docType.notations;

      notation1 = notationsMap.getNamedItem("notation1");
      notation1.textContent = "textContent";

      textContent = notation1.textContent;

      assertNull("nodesettextcontent04",textContent);
    
},
/**
* 

	
	Using setTextContent on a default Attr node, attempt to set its value to NA.  Retreive 
	the textContent and verify if it is was set to NA.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent05 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent05") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(3);
      attr = elem.getAttributeNode("dir");
      attr.textContent = "NA";

      textContent = attr.textContent;

      assertEquals("nodesettextcontent05","NA",textContent);
       
},
/**
* 

	
	Using setTextContent on a new Attr node with a null value, attempt to set its value to NA.  Retreive 
	the textContent and verify if it is was set to NA.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent06 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent06") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr;
      var attrNode;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","xml:lang");
      attrNode = elem.setAttributeNodeNS(attr);
      attr.textContent = "NA";

      textContent = attr.textContent;

      assertEquals("nodesettextcontent06","NA",textContent);
       
},
/**
* 

	
	Using setTextContent on an existing Text node, attempt to set its value to Text. 
	Retreive the textContent and verify if it is was set to Text.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent07 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent07") != null) return;
    var doc;
      var elemList;
      var elem;
      var txt;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      txt = elem.firstChild;

      txt.textContent = "Text";

      textContent = txt.textContent;

      assertEquals("nodegettextcontent10","Text",textContent);
       
},
/**
* 

	
	Using setTextContent on a new Processing Instruction node, attempt to set its data to PID.  
	Retreive the textContent and verify if it is was set to PID.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent08 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent08") != null) return;
    var doc;
      var elemList;
      var elem;
      var pi;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      pi = doc.createProcessingInstruction("PIT","PID");
      appendedChild = elem.appendChild(pi);
      pi.textContent = "PID";

      textContent = pi.textContent;

      assertEquals("nodesettextcontent08","PID",textContent);
       
},
/**
* 
	The method setTextContent has no effect when the node is defined to be null.
	
	Using setTextContent on a new Element node, attempt to set its content to ELEMENT.
	Retreive the textContent and verify if it is was set to ELEMENT.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent10 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent10") != null) return;
    var doc;
      var elem;
      var txt;
      var comment;
      var entRef;
      var cdata;
      var pi;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/DOM/Test","dom3:elem");
      txt = doc.createTextNode("Text ");
      comment = doc.createComment("Comment ");
      entRef = doc.createEntityReference("ent1");
      pi = doc.createProcessingInstruction("PIT","PIData ");
      cdata = doc.createCDATASection("CData");
      appendedChild = elem.appendChild(txt);
      appendedChild = elem.appendChild(comment);
      appendedChild = elem.appendChild(entRef);
      appendedChild = elem.appendChild(pi);
      appendedChild = elem.appendChild(cdata);
      elem.textContent = "ELEMENT";

      textContent = elem.textContent;

      assertEquals("nodesettextcontent10","ELEMENT",textContent);
       
},
/**
* 

	
	Using setTextContent on a new DocumentFragment node Element child, attempt to set its content to 
	DOCUMENTFRAGMENT.  Retreive the textContent and verify if it is was set to DOCUMENTFRAGMENT

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent11 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent11") != null) return;
    var doc;
      var docFrag;
      var elem;
      var elemChild;
      var txt;
      var comment;
      var entRef;
      var cdata;
      var pi;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFrag = doc.createDocumentFragment();
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      txt = doc.createTextNode("Text ");
      comment = doc.createComment("Comment ");
      entRef = doc.createEntityReference("alpha");
      pi = doc.createProcessingInstruction("PIT","PIData ");
      cdata = doc.createCDATASection("CData");
      appendedChild = elem.appendChild(txt);
      appendedChild = elem.appendChild(comment);
      appendedChild = elem.appendChild(entRef);
      appendedChild = elem.appendChild(pi);
      appendedChild = elem.appendChild(cdata);
      appendedChild = docFrag.appendChild(elem);
      elem.textContent = "DOCUMENTFRAGMENT";

      elemChild = docFrag.lastChild;

      textContent = elemChild.textContent;

      assertEquals("nodegettextcontent11","DOCUMENTFRAGMENT",textContent);
       
},
/**
* 

	
	Using setTextContent on a new EntityReference node, attempt to set its value.
	Since EntityReference nodes are ReadOnly, check if a NO_MODIFICATION_ALLOWED_ERR  
	is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent12 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent12") != null) return;
    var doc;
      var elem;
      var entRef;
      var textContent;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.documentElement;

      entRef = doc.createEntityReference("beta");
      appendedChild = elem.appendChild(entRef);
      
	{
		success = false;
		try {
            entRef.textContent = "NA";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("nodesettextcontent12",success);
	}

},
/**
* 

	
	Using setTextContent on an Entity node, attempt to set its replacement text.  
	Since Entity nodes are ReadOnly, check if a NO_MODIFICATION_ALLOWED_ERR  
	is raised.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-textContent
*/
nodesettextcontent13 : function () {
   var success;
    if(checkInitialization(builder, "nodesettextcontent13") != null) return;
    var doc;
      var docType;
      var entity;
      var entitymap;
      var textContent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entitymap = docType.entities;

      entity = entitymap.getNamedItem("delta");
      
	{
		success = false;
		try {
            entity.textContent = "NA";

        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("nodesettextcontent13",success);
	}

},
/**
* 

	
	Using setUserData with null values for the UserData and the handler parameters, check
	if returned the current userData object of this Document node is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata01 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata01") != null) return;
    var doc;
      var userData;
      var prevUserData;
      var nullHandler = null;

      var nullData = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      if (null == nullHandler) {
         doc.setUserData("something", nullData, null);
      } else {
          doc.setUserData("something", nullData, nullHandler.handle);
      }
       assertNull("nodesetuserdata01",prevUserData);
    
},
/**
* 

	
	Using setUserData with values for the UserData as this Document and the handler as null
	parameters, check if returned the current userData object of this Document node is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata02 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata02") != null) return;
    var doc;
      var userData;
      var prevUserData;
      var test = null;

      var str = "Junk";
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      if (null == nullHandler) {
         doc.setUserData("something", test, null);
      } else {
          doc.setUserData("something", test, nullHandler.handle);
      }
       assertNull("nodesetuserdata02",prevUserData);
    
},
/**
* 
	Invoke setUserData on this Document to set this Documents UserData to a new
	Element node.  Do the same with a new Text node and using isNodeEqual verify
	the returned Element UserData object.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata03 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata03") != null) return;
    var doc;
      var userData;
      var retUserData;
      var returnedUserData;
      var success;
      var elem;
      var txt;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","xhtml:p");
      txt = doc.createTextNode("TEXT");
      if (null == nullHandler) {
         doc.setUserData("Key1", elem, null);
      } else {
          doc.setUserData("Key1", elem, nullHandler.handle);
      }
       if (null == nullHandler) {
         doc.setUserData("Key1", txt, null);
      } else {
          doc.setUserData("Key1", txt, nullHandler.handle);
      }
       success = retUserData.isEqualNode(elem);
      assertTrue("nodesetuserdata03",success);

},
/**
* 

	
	Invoke setUserData on a new Element to set its UserData to a new Text node
	twice using different Keys.  Using getUserData with each Key and isNodeEqual 
	verify if the returned nodes are Equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata04 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata04") != null) return;
    var doc;
      var userData;
      var returned1;
      var returned2;
      var retUserData;
      var success;
      var elem;
      var txt;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      txt = doc.createTextNode("TEXT");
      if (null == nullHandler) {
         elem.setUserData("Key1", txt, null);
      } else {
          elem.setUserData("Key1", txt, nullHandler.handle);
      }
       if (null == nullHandler) {
         elem.setUserData("Key2", txt, null);
      } else {
          elem.setUserData("Key2", txt, nullHandler.handle);
      }
       returned1 = elem.getUserData("Key1");
      returned2 = elem.getUserData("Key2");
      success = returned1.isEqualNode(returned2);
      assertTrue("nodesetuserdata04",success);

},
/**
* 

	
	Invoke setUserData on a new Attr to set its UserData to two Document nodes
	obtained by parsing the same xml document.  Using getUserData and isNodeEqual 
	verify if the returned nodes are Equal.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata05 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata05") != null) return;
    var doc;
      var doc2;
      var userData;
      var returned1;
      var returned2;
      var retUserData;
      var success;
      var attr;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "hc_staff");
      attr = doc.createAttributeNS("http://www.w3.org/XML/1998/namespace","lang");
      if (null == nullHandler) {
         attr.setUserData("Key1", doc, null);
      } else {
          attr.setUserData("Key1", doc, nullHandler.handle);
      }
       if (null == nullHandler) {
         attr.setUserData("Key2", doc2, null);
      } else {
          attr.setUserData("Key2", doc2, nullHandler.handle);
      }
       returned1 = attr.getUserData("Key1");
      returned2 = attr.getUserData("Key2");
      success = returned1.isEqualNode(returned2);
      assertTrue("nodesetuserdata05",success);

},
/**
* 

	
	Invoke setUserData on a new Comment to set its UserData to an Entity node 
	twice using the same key.  Verify if the UserData object that was by the 
	second setUserData is the same as original Entity.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata06 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata06") != null) return;
    var doc;
      var docType;
      var entities;
      var entity;
      var comment;
      var userData;
      var returned;
      var retUserData;
      var success;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      entities = docType.entities;

      entity = entities.getNamedItem("delta");
      comment = doc.createComment("COMMENT_NODE");
      if (null == nullHandler) {
         comment.setUserData("Key1", entity, null);
      } else {
          comment.setUserData("Key1", entity, nullHandler.handle);
      }
       if (null == nullHandler) {
         comment.setUserData("Key1", entity, null);
      } else {
          comment.setUserData("Key1", entity, nullHandler.handle);
      }
       success = returned.isEqualNode(entity);
      assertTrue("nodesetuserdata06",success);

},
/**
* 

	
	Invoke setUserData on a Notation to set its UserData to a Comment node 
	twice using the same key.  Verify if the UserData object that was returned 
	by second setUserData is the Comment node set in the first setUserData call.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata07 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata07") != null) return;
    var doc;
      var docType;
      var notations;
      var notation;
      var comment;
      var userData;
      var returned;
      var success;
      var retUserData;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docType = doc.doctype;

      notations = docType.notations;

      notation = notations.getNamedItem("notation1");
      comment = doc.createComment("COMMENT_NODE");
      if (null == nullHandler) {
         notation.setUserData("Key1", comment, null);
      } else {
          notation.setUserData("Key1", comment, nullHandler.handle);
      }
       if (null == nullHandler) {
         notation.setUserData("Key1", comment, null);
      } else {
          notation.setUserData("Key1", comment, nullHandler.handle);
      }
       success = returned.isEqualNode(comment);
      assertTrue("nodesetuserdata07",success);

},
/**
* 
	Invoke setUserData on a CDATASection and EntityReference node to set their 
	UserData to this Document and DocumentElement node.  Verify if the UserData 
	object that was set for both nodes is different.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata08 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata08") != null) return;
    var doc;
      var docElem;
      var entRef;
      var cData;
      var elemList;
      var elemName;
      var userData;
      var returned1;
      var returned2;
      var success;
      var retUserData;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      entRef = doc.createEntityReference("delta");
      cData = doc.createCDATASection("CDATASection");
      if (null == nullHandler) {
         entRef.setUserData("Key1", doc, null);
      } else {
          entRef.setUserData("Key1", doc, nullHandler.handle);
      }
       if (null == nullHandler) {
         cData.setUserData("Key2", docElem, null);
      } else {
          cData.setUserData("Key2", docElem, nullHandler.handle);
      }
       returned1 = entRef.getUserData("Key1");
      returned2 = cData.getUserData("Key2");
      success = returned1.isEqualNode(returned2);
      assertFalse("nodesetuserdata08",success);

},
/**
* 

	
	Invoke setUserData on this documentElement node to set its UserData to 
	this Document node.  Invoke getUserData on this Document node with the same
	key of the UserData that was just set on the documentElement node and verify 
	if the returned node is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata09 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata09") != null) return;
    var doc;
      var docElem;
      var returned;
      var nullHandler = null;

      var retUserData;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      if (null == nullHandler) {
         docElem.setUserData("Key1", doc, null);
      } else {
          docElem.setUserData("Key1", doc, nullHandler.handle);
      }
       returned = doc.getUserData("Key1");
      assertNull("nodesetuserdata09",returned);
    
},
/**
* 
	Invoke setUserData on a CDATASection and EntityReference node to set their 
	UserData to this Document and DocumentElement node.  Verify if the UserData 
	object that was set for both nodes is different.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Node3-setUserData
*/
nodesetuserdata10 : function () {
   var success;
    if(checkInitialization(builder, "nodesetuserdata10") != null) return;
    var doc;
      var docElem;
      var entRef;
      var cData;
      var varList;
      var varElem;
      var userData;
      var returned1;
      var returned2;
      var success;
      var retUserData;
      var nullHandler = null;

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docElem = doc.documentElement;

      varList = doc.getElementsByTagName("var");
      varElem = varList.item(2);
      entRef = varElem.firstChild;

      cData = doc.createCDATASection("CDATASection");
      if (null == nullHandler) {
         entRef.setUserData("Key1", doc, null);
      } else {
          entRef.setUserData("Key1", doc, nullHandler.handle);
      }
       if (null == nullHandler) {
         cData.setUserData("Key2", docElem, null);
      } else {
          cData.setUserData("Key2", docElem, nullHandler.handle);
      }
       returned1 = entRef.getUserData("Key1");
      returned2 = cData.getUserData("Key2");
      success = returned1.isEqualNode(returned2);
      assertFalse("nodesetuserdata08",success);

},
/**
* 
Normalize document with normalize-characters set to false, check that
characters are not normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters01 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters01") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("normalize-characters", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
},
/**
* 
Normalize document with normalize-characters set to true, check that
characters are normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters02 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters02") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("normalize-characters",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("normalize-characters", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("charNormalized","barsuçon",textValue);
       
	}
	
},
/**
* 
Normalize an element with normalize-characters set to false, check that
characters are not normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters03 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters03") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("normalize-characters", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      pElem.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
},
/**
* 
Normalize an element with normalize-characters set to true, check that
characters are normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters04 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters04") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("normalize-characters",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("normalize-characters", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      pElem.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
	}
	
},
/**
* 
Normalize an document (using Node.normalize) with normalize-characters set to false, check that
characters are not normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters05 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters05") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("normalize-characters", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
},
/**
* 
Normalize a document (using Node.normalize) with normalize-characters set to true, check that
characters are normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters06 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters06") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("normalize-characters",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("normalize-characters", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      doc.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.firstChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","barsuçon",textValue);
       
	}
	
},
/**
* 
Normalize a text node with normalize-characters set to false, check that
characters are not normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters07 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters07") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      domConfig.setParameter("normalize-characters", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      retval.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.lastChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","suçon",textValue);
       
},
/**
* 
Normalize a text node with normalize-characters set to true, check that
characters are normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-normalize-characters
* @see http://www.w3.org/TR/2003/WD-charmod-20030822/
*/
normalizecharacters08 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters08") != null) return;
    var doc;
      var docElem;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var pList;
      var pElem;
      var text;
      var textValue;
      var retval;
      var canSet;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("normalize-characters",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("normalize-characters", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = doc.createTextNode("suçon");
      retval = pElem.appendChild(text);
      retval.normalize();
      errorMonitor.assertLowerSeverity("normalizeError", 2);
     pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      text = pElem.lastChild;

      textValue = text.nodeValue;

      assertEquals("noCharNormalization","suçon",textValue);
       
	}
	
},
/**
* 
Add a CDATASection containing "]]>" and call Node.normalize which should not
split or raise warning.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-normalize
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-split-cdata-sections
*/
splitcdatasections01 : function () {
   var success;
    if(checkInitialization(builder, "splitcdatasections01") != null) return;
    var doc;
      var elem;
      var domConfig;
      var elemList;
      var newChild;
      var oldChild;
      var retval;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      oldChild = elem.firstChild;

      newChild = doc.createCDATASection("this is not ]]> good");
      retval = elem.replaceChild(newChild,oldChild);
      domConfig = doc.domConfig;

      domConfig.setParameter("split-cdata-sections", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalize();
      errorMonitor.assertLowerSeverity("noErrors", 2);
     
},
/**
* 
	Invoke isElementContentWhitespace on a newly created Text Node that contains only whitespace.
Should be false since there is no content model to determine if the node appears within element content.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-isElementContentWhitespace
*/
textiselementcontentwhitespace01 : function () {
   var success;
    if(checkInitialization(builder, "textiselementcontentwhitespace01") != null) return;
    var doc;
      var newText;
      var hasWhitespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      newText = doc.createTextNode("   ");
      hasWhitespace = newText.isElementContentWhitespace;

      assertFalse("isWhitespace",hasWhitespace);

},
/**
* 
Get the text node child of the "p" element in barfoo.  isElementContentWhitespace should
be false since the node is neither whitespace or in element content.  

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-isElementContentWhitespace
*/
textiselementcontentwhitespace02 : function () {
   var success;
    if(checkInitialization(builder, "textiselementcontentwhitespace02") != null) return;
    var doc;
      var pList;
      var pElem;
      var textNode;
      var isElemContentWhitespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      textNode = pElem.firstChild;

      isElemContentWhitespace = textNode.isElementContentWhitespace;

      assertFalse("notElemContentOrWhitespace",isElemContentWhitespace);

},
/**
* 
Get the newline between the "body" and "p" element.  Since node is both in element content
and whitespace, isElementContentWhitespace should return true.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-isElementContentWhitespace
*/
textiselementcontentwhitespace03 : function () {
   var success;
    if(checkInitialization(builder, "textiselementcontentwhitespace03") != null) return;
    var doc;
      var pList;
      var pElem;
      var textNode;
      var isElemContentWhitespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      textNode = pElem.previousSibling;

      isElemContentWhitespace = textNode.isElementContentWhitespace;

      assertTrue("isElementContentWhitespace",isElemContentWhitespace);

},
/**
* 
Replace the text node child of the "p" element in barfoo with whitespace and normalize with validation.
isElementContentWhitespace should be false since the node is not in element content.  

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-isElementContentWhitespace
*/
textiselementcontentwhitespace04 : function () {
   var success;
    if(checkInitialization(builder, "textiselementcontentwhitespace04") != null) return;
    var doc;
      var pList;
      var pElem;
      var textNode;
      var blankNode;
      var returnedNode;
      var isElemContentWhitespace;
      var domConfig;
      var canSetValidation;
      var replacedNode;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSetValidation = domConfig.canSetParameter("validate",true);
      
	if(
	canSetValidation
	) {
	domConfig.setParameter("validate", true);
	 pList = doc.getElementsByTagName("p");
      pElem = pList.item(0);
      textNode = pElem.firstChild;

      blankNode = doc.createTextNode("   ");
      replacedNode = pElem.replaceChild(blankNode,textNode);
      doc.normalizeDocument();
      textNode = pElem.firstChild;

      isElemContentWhitespace = textNode.isElementContentWhitespace;

      assertFalse("notElemContent",isElemContentWhitespace);

	}
	
},
/**
* 
Replace the whitespace before the "p" element in barfoo with non-whitespace and normalize with validation.
isElementContentWhitespace should be false since the node is not whitespace.  

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-isElementContentWhitespace
*/
textiselementcontentwhitespace05 : function () {
   var success;
    if(checkInitialization(builder, "textiselementcontentwhitespace05") != null) return;
    var doc;
      var bodyList;
      var bodyElem;
      var textNode;
      var nonBlankNode;
      var returnedNode;
      var isElemContentWhitespace;
      var domConfig;
      var canSetValidation;
      var refChild;
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSetValidation = domConfig.canSetParameter("validate",true);
      
	if(
	canSetValidation
	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      refChild = bodyElem.firstChild;

      nonBlankNode = doc.createTextNode("not blank");
      returnedNode = bodyElem.insertBefore(nonBlankNode,refChild);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("noErrors", 2);
     bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      textNode = bodyElem.firstChild;

      isElemContentWhitespace = textNode.isElementContentWhitespace;

      assertFalse("notElemContent",isElemContentWhitespace);

	}
	
},
/**
* 
Insert whitespace before the "p" element in barfoo and normalize with validation.
isElementContentWhitespace should be true since the node is whitespace and in element content.  

* @author Curt Arnold
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-isElementContentWhitespace
*/
textiselementcontentwhitespace06 : function () {
   var success;
    if(checkInitialization(builder, "textiselementcontentwhitespace06") != null) return;
    var doc;
      var bodyList;
      var bodyElem;
      var refChild;
      var textNode;
      var blankNode;
      var returnedNode;
      var isElemContentWhitespace;
      var domConfig;
      var canSetValidation;
      var replacedNode;
      errorMonitor = new DOMErrorMonitor();
      
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domConfig = doc.domConfig;

      canSetValidation = domConfig.canSetParameter("validate",true);
      
	if(
	canSetValidation
	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      refChild = bodyElem.firstChild;

      blankNode = doc.createTextNode("     ");
      replacedNode = bodyElem.insertBefore(blankNode,refChild);
      doc.normalizeDocument();
      errorMonitor.assertLowerSeverity("noErrors", 2);
     bodyList = doc.getElementsByTagName("body");
      bodyElem = bodyList.item(0);
      textNode = bodyElem.firstChild;

      isElemContentWhitespace = textNode.isElementContentWhitespace;

      assertTrue("isElemContentWhitespace",isElemContentWhitespace);

	}
	
},
/**
* 
	Invoke replaceWholeText on an existing Text Node to replace its value with a 
	new value containing white space characters.  Verify the replaceWholeText by
	verifying the values returned by wholeText
	of the returned Text node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
*/
textreplacewholetext01 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext01") != null) return;
    var doc;
      var itemList;
      var elementName;
      var textNode;
      var replacedText;
      var wholeText;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      itemList = doc.getElementsByTagName("strong");
      elementName = itemList.item(0);
      textNode = elementName.firstChild;

      replacedText = textNode.replaceWholeText("New Content");
      wholeText = replacedText.wholeText;

      assertEquals("textreplacewholetext01_1","New Content",wholeText);
       
},
/**
* 
	Invoke replaceWholeText on an existing Text Node to replace its value with an 
	empty string value.  Verify the repalceWholeText method by verifying if the value 
	returned is null.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
*/
textreplacewholetext02 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext02") != null) return;
    var doc;
      var itemList;
      var elementName;
      var textNode;
      var replacedText;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      itemList = doc.getElementsByTagName("strong");
      elementName = itemList.item(0);
      textNode = elementName.firstChild;

      replacedText = textNode.replaceWholeText("");
      assertNull("textreplacewholetext02",replacedText);
    
},
/**
* 
	Invoke replaceWholeText on an new Text Node to replace its value with a 
	new value.  Verify the repalceWholeText by verifying the values returned by 
	wholeText of the returned Text node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
*/
textreplacewholetext03 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext03") != null) return;
    var doc;
      var textNode;
      var replacedText;
      var wholeText;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textNode = doc.createTextNode("New Text");
      replacedText = textNode.replaceWholeText(" a b c b ");
      wholeText = replacedText.wholeText;

      assertEquals("textreplacewholetext03"," a b c b ",wholeText);
       
},
/**
* 
	Invoke replaceWholeText on an new Text Node to replace its value with an 
	empty value.   

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
*/
textreplacewholetext04 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext04") != null) return;
    var doc;
      var textNode;
      var replacedText;
      var wholeText;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      textNode = doc.createTextNode("New Text");
      replacedText = textNode.replaceWholeText("");
      assertNull("retvalIsNull",replacedText);
    
},
/**
* 
	Invoke replaceWholeText on an existing text node with newly created text and CDATASection
	nodes appended as children of its parent element node.  Verify repalceWholeText by 
	verifying the values returned by wholeText.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
*/
textreplacewholetext05 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext05") != null) return;
    var doc;
      var itemList;
      var elementName;
      var textNode;
      var cdataNode;
      var replacedText;
      var wholeText;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      itemList = doc.getElementsByTagName("strong");
      elementName = itemList.item(0);
      textNode = doc.createTextNode("New Text");
      cdataNode = doc.createCDATASection("New CDATA");
      appendedChild = elementName.appendChild(textNode);
      appendedChild = elementName.appendChild(cdataNode);
      textNode = elementName.firstChild;

      replacedText = textNode.replaceWholeText("New Text and Cdata");
      wholeText = replacedText.wholeText;

      assertEquals("textreplacewholetext05","New Text and Cdata",wholeText);
       
},
/**
* 
	The method replaceWholeText substitutes the a specified text for the text of 
	the current node and all logically-adjacent text nodes.  This method raises
	a NO_MODIFICATION_ALLOWED_ERR if one of the Text nodes being replaced is readonly.
	
	Invoke replaceWholeText on an existing text node with newly created text and Entityreference
	nodes (whose replacement text is a character entity reference) appended as children of its parent element node.  
	Where the nodes to be removed are read-only descendants of an EntityReference, the EntityReference 
        must be removed instead of the read-only nodes. Only if any EntityReference to be removed has 
        descendants that are not EntityReference, Text, or CDATASection nodes, the replaceWholeText 
        method must fail, raising a NO_MODIFICATION_ALLOWED_ERR. Verify that the method does not raise
        an exception and verify the content of the returned text node.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
*/
textreplacewholetext06 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext06") != null) return;
    var doc;
      var itemList;
      var elementStrong;
      var textNode;
      var erefNode;
      var replacedText;
      var appendedChild;
      var nodeValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      itemList = doc.getElementsByTagName("strong");
      elementStrong = itemList.item(0);
      textNode = doc.createTextNode("New Text");
      erefNode = doc.createEntityReference("beta");
      appendedChild = elementStrong.appendChild(textNode);
      appendedChild = elementStrong.appendChild(erefNode);
      textNode = elementStrong.firstChild;

      replacedText = textNode.replaceWholeText("New Text and Cdata");
      nodeValue = textNode.nodeValue;

      assertEquals("textreplacewholetext06","New Text and Cdata",nodeValue);
       
},
/**
* 
Append an entity reference and a text node after to the content of the
first strong element.  Then call replaceWholeText on initial content
of that element.  Since the entity reference does not contain any 
logically-adjacent text content, only the initial text element should
be replaced. 

* @author IBM
* @author Neil Delima
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=425
*/
textreplacewholetext07 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext07") != null) return;
    var doc;
      var itemList;
      var elementName;
      var textNode;
      var erefNode;
      var replacedText;
      var appendedChild;
      var node;
      var nodeValue;
      var nodeType;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      itemList = doc.getElementsByTagName("strong");
      elementName = itemList.item(0);
      erefNode = doc.createEntityReference("ent4");
      textNode = doc.createTextNode("New Text");
      appendedChild = elementName.appendChild(erefNode);
      appendedChild = elementName.appendChild(textNode);
      textNode = elementName.firstChild;

      replacedText = textNode.replaceWholeText("New Text and Cdata");
      textNode = elementName.firstChild;

      assertSame("retval_same",textNode,replacedText);
nodeValue = textNode.nodeValue;

      assertEquals("nodeValueSame","New Text and Cdata",nodeValue);
       node = textNode.nextSibling;

      assertNotNull("secondChildNotNull",node);
nodeType = node.nodeType;

      assertEquals("secondChildIsEntRef",5,nodeType);
       
},
/**
* 
Appends an entity reference containing text and an element to an existing
text node, then calls Text.replaceWholeText on the existing text node.
A NO_MODIFICATION_ALLOWED_ERR should be thrown.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-replaceWholeText
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=425
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=540
*/
textreplacewholetext08 : function () {
   var success;
    if(checkInitialization(builder, "textreplacewholetext08") != null) return;
    var doc;
      var itemList;
      var p;
      var entRef;
      var node;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      itemList = doc.getElementsByTagName("p");
      p = itemList.item(0);
      entRef = doc.createEntityReference("ent2");
      node = p.appendChild(entRef);
      node = p.firstChild;

      
	{
		success = false;
		try {
            node = node.replaceWholeText("yo");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 7);
		}
		assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
	}

},
/**
* 
	Invoke wholetext on an existing Text Node that contains whitespace and verify if
	the value returned is correct.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-wholeText
*/
textwholetext01 : function () {
   var success;
    if(checkInitialization(builder, "textwholetext01") != null) return;
    var doc;
      var itemList;
      var elementName;
      var textNode;
      var nameWholeText;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      itemList = doc.getElementsByTagName("strong");
      elementName = itemList.item(0);
      textNode = elementName.firstChild;

      nameWholeText = textNode.wholeText;

      assertEquals("textwholetext01","Margaret Martin",nameWholeText);
       
},
/**
* 
	Invoke wholetext on an existing Text Node that contains whitespace and and verify if 
	the value returned is correct.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-wholeText
*/
textwholetext02 : function () {
   var success;
    if(checkInitialization(builder, "textwholetext02") != null) return;
    var doc;
      var itemList;
      var elementName;
      var textNode;
      var newTextNode;
      var wholeText;
      var appendedChild;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      itemList = doc.getElementsByTagName("strong");
      elementName = itemList.item(0);
      newTextNode = doc.createTextNode("New Text");
      appendedChild = elementName.appendChild(newTextNode);
      textNode = elementName.firstChild;

      wholeText = textNode.wholeText;

      assertEquals("textwholetext02","Margaret MartinNew Text",wholeText);
       
},
/**
* 
	Invoke wholetext on two newly created text nodes and verify if the value returned 
	is correct.

* @author IBM
* @author Neil Delima
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Text3-wholeText
*/
textwholetext03 : function () {
   var success;
    if(checkInitialization(builder, "textwholetext03") != null) return;
    var doc;
      var elem;
      var text1;
      var text2;
      var appendedChild;
      var combinedText;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elem = doc.createElementNS("http://www.w3.org/1999/xhtml","p");
      text1 = doc.createTextNode("Text I");
      text2 = doc.createTextNode(" Text II");
      appendedChild = elem.appendChild(text1);
      appendedChild = elem.appendChild(text2);
      combinedText = text1.wholeText;

      assertEquals("textwholetext03","Text I Text II",combinedText);
       
},
/**
* 
	The typeName attribute states the name of a type declared for the associated element or 
	attribute, or null if unknown. 

	Invoke getSchemaTypeInfo method on an attribute having [type definition] property.  Expose 
	{name} and {target namespace} properties of the [type definition] property.
	Verify that the typeName of id's schemaTypeInfo are correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
*/
typeinfogettypename03 : function () {
   var success;
    if(checkInitialization(builder, "typeinfogettypename03") != null) return;
    var doc;
      var elemList;
      var attrid;
      var acElem;
      var attrTypeInfo;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acElem = elemList.item(2);
      attrid = acElem.getAttributeNode("id");
      attrTypeInfo = attrid.schemaTypeInfo;

      typeName = attrTypeInfo.typeName;

      assertEquals("typeinfogettypename03_1","ID",typeName);
       
},
/**
* 
	The typeName attribute states the name of a type declared for the associated element or 
	attribute, or null if unknown. 

	Invoke getSchemaTypeInfo method on an attribute having [member type definition]property.  Expose 
	{name} and {target namespace} properties of the [member type definition] property.
	Verify that the typeName of an em element's schemaTypeInfo is correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
*/
typeinfogettypename04 : function () {
   var success;
    if(checkInitialization(builder, "typeinfogettypename04") != null) return;
    var doc;
      var docElem;
      var elemList;
      var emElem;
      var elemTypeInfo;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      emElem = elemList.item(0);
      elemTypeInfo = emElem.schemaTypeInfo;

      typeName = elemTypeInfo.typeName;

      assertEquals("typeinfogettypename04_1","emType",typeName);
       
},
/**
* 
	The typeNamespace attribute states the namespace of a type declared for the associated element or 
	attribute, or null if unknown. 

	Invoke getSchemaTypeInfo method on an attribute having [type definition] property.  Expose 
	{name} and {target namespace} properties of the [type definition] property.
	Verify that the typeNamespace of the attrib1 and attrib3's schemaTypeInfo are correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeNamespace
*/
typeinfogettypenamespace01 : function () {
   var success;
    if(checkInitialization(builder, "typeinfogettypenamespace01") != null) return;
    var doc;
      var elemList;
      var acElem;
      var titleAttr;
      var attrTypeInfo;
      var typeNamespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acElem = elemList.item(0);
      titleAttr = acElem.getAttributeNode("title");
      attrTypeInfo = titleAttr.schemaTypeInfo;

      typeNamespace = attrTypeInfo.typeNamespace;

      assertEquals("typeinfogettypename01_1","http://www.w3.org/2001/XMLSchema",typeNamespace);
       
},
/**
* 
	The typeNamespace attribute states the namespace of a type declared for the associated element or 
	attribute, or null if unknown. 

	Invoke getSchemaTypeInfo method on an attribute having [type definition] property.  Expose 
	{name} and {target namespace} properties of the [type definition] property.
	Verify that the typeName of class's schemaTypeInfo is correct.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
*/
typeinfogettypenamespace03 : function () {
   var success;
    if(checkInitialization(builder, "typeinfogettypenamespace03") != null) return;
    var doc;
      var elemList;
      var classAttr;
      var attrTypeInfo;
      var typeNamespace;
      var acElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acElem = elemList.item(1);
      classAttr = acElem.getAttributeNode("class");
      attrTypeInfo = classAttr.schemaTypeInfo;

      typeNamespace = attrTypeInfo.typeNamespace;

      assertEquals("typeinfogettypename03_1","http://www.w3.org/1999/xhtml",typeNamespace);
       
},
/**
* 
	The typeName attribute states the name of a type declared for the associated element or 
	attribute, or null if unknown. 

	Invoke getSchemaTypeInfo method on an attribute having [member type definition]property.  Expose 
	{name} and {target namespace} properties of the [member type definition] property.
	Verify that the typeNamespace of eldblUnionA's schemaTypeInfo is null??? (sv)

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-typeName
*/
typeinfogettypenamespace04 : function () {
   var success;
    if(checkInitialization(builder, "typeinfogettypenamespace04") != null) return;
    var doc;
      var elemList;
      var emElem;
      var elemTypeInfo;
      var typeNamespace;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      emElem = elemList.item(0);
      elemTypeInfo = emElem.schemaTypeInfo;

      typeNamespace = elemTypeInfo.typeNamespace;

      assertEquals("typeinfogettypenamespace04_1","http://www.w3.org/1999/xhtml",typeNamespace);
       
},
/**
* 
DTD types always return false for isDerivedFrom.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom01 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom01") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/TR/REC-xml","CDATA",0);
      assertFalse("isDerived0",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/TR/REC-xml","CDATA",15);
      assertFalse("isDerived15",isDerived);

},
/**
* 
Check how xsd:string is derived from itself.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom02 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom02") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",1);
      assertTrue("derivedFromSelfRestriction",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",14);
      assertFalse("derivedFromSelfOther",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",0);
      assertTrue("derivedFromSelfAny",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",15);
      assertTrue("derivedFromSelfAll",isDerived);

},
/**
* 
Check that isDerivedFrom does considers xsd:string to be derived from anySimpleType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom03 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom03") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","string",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",15);
      assertTrue("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if xsd:string is derived from xsd:anyType by any method.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom04 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom04") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","string",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",15);
      assertTrue("derivedFromAnyType",isDerived);

},
/**
* 
Check if xsd:string is derived from xsd:anyType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom05 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom05") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","string",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",1);
      assertTrue("derivedFromAnyTypeRestrictionOnly",isDerived);

},
/**
* 
Check if xsd:string is derived from xsd:anyType by any method except restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom06 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom06") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","string",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",14);
      assertFalse("derivedFromAnyTypeExceptRestriction",isDerived);

},
/**
* 
Check if xsd:string is derived from xsd:anyType using 0 as derivation method.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom07 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom07") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      attr = acronymElem.getAttributeNode("title");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","string",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",0);
      assertTrue("derivedFromAnyType0",isDerived);

},
/**
* 
Check if classType is derived from xsd:string by any method.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom08 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom08") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","classType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",15);
      assertTrue("derivedFromString",isDerived);

},
/**
* 
Check if classType is derived from xsd:anySimpleType by any method.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom09 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom09") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","classType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",15);
      assertTrue("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if classType is derived from anyType by any method.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom10 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom10") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","classType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",15);
      assertTrue("derivedFromAnyType",isDerived);

},
/**
* 
Check if classType is derived from xsd:anyType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom11 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom11") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","classType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",1);
      assertTrue("derivedFromAnyTypeRestrictionOnly",isDerived);

},
/**
* 
Check classType is derived from anyType specifying derivationMethod as 0.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom12 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom12") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("nameIsString","classType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",0);
      assertTrue("derivedFromAnyType0",isDerived);

},
/**
* 
Check if classType is derived from xsd:anyType by any method other than restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom13 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom13") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("name","classType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",14);
      assertFalse("derivedFromAnyTypeExceptRestriction",isDerived);

},
/**
* 
Check how classType is derived from itself.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom14 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom14") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      attr = acronymElem.getAttributeNode("class");
      typeInfo = attr.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("name","classType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","classType",1);
      assertTrue("derivedFromSelfRestriction",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","classType",14);
      assertFalse("notDerivedFromSelfOther",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","classType",15);
      assertTrue("derivedFromSelfAll",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","classType",0);
      assertTrue("derivedFromSelfAny",isDerived);

},
/**
* 
Check "emType" is derived from emp0001_3Type by any method.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom15 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom15") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("name","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emp0001_3Type",15);
      assertTrue("derivedFromEmp13AnyMethod",isDerived);

},
/**
* 
Check emType is derived from emp0001_3Type by union.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom16 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom16") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("name","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emp0001_3Type",4);
      assertTrue("derivedFromEmp13Union",isDerived);

},
/**
* 
Check if emType is derived from emp0001_3Type by any method other than union.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom17 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom17") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("name","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emp0001_3Type",11);
      assertFalse("derivedFromEmp13NotUnion",isDerived);

},
/**
* 
Check if emType is derived from xsd:ID by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom18 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom18") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","ID",1);
      assertFalse("derivedFromID",isDerived);

},
/**
* 
Check emType is derived from anySimpleType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom19 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom19") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",1);
      assertTrue("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if emType is derived from anyType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom20 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom20") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",1);
      assertTrue("derivedFromAnyType",isDerived);

},
/**
* 
Check if emType is derived from itself.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom21 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom21") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emType",1);
      assertTrue("derivedFromSelfByRestriction",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emType",14);
      assertFalse("notDerivedFromSelfOtherMethod",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emType",0);
      assertTrue("derivedFromSelfByAny",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emType",15);
      assertTrue("derivedFromSelfByAll",isDerived);

},
/**
* 
Check strongType is derived from xsd:string by any method.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom22 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom22") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",15);
      assertTrue("derivedFromStringAnyMethod",isDerived);

},
/**
* 
Check if strongType is derived from xsd:string by list.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom23 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom23") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",8);
      assertTrue("derivedFromStringList",isDerived);

},
/**
* 
Check if strongType is derived from xsd:string by any method other than list.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom24 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom24") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",7);
      assertFalse("derivedFromStringNotList",isDerived);

},
/**
* 
Check if strongType is derived from anySimpleType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom25 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom25") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",1);
      assertTrue("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if strongType is derived from anyType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom26 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom26") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",1);
      assertTrue("derivedFromAnyType",isDerived);

},
/**
* 
Check if strongType is derived from anyType by union or extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom27 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom27") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",6);
      assertFalse("derivedFromAnyType",isDerived);

},
/**
* 
Check how strongType is derived from itself.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom28 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom28") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","strongType",1);
      assertTrue("notDerivedFromSelfRestriction",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","strongType",14);
      assertFalse("notDerivedFromSelfOther",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","strongType",15);
      assertTrue("notDerivedFromSelfAll",isDerived);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","strongType",0);
      assertTrue("notDerivedFromSelfAny",isDerived);

},
/**
* 
Check if anonymous type for p element is derived from pType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom29 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom29") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","pType",15);
      assertTrue("derivedFromPTypeAnyMethod",isDerived);

},
/**
* 
Check if anonymous type for p element is derived from pType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom30 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom30") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","pType",1);
      assertTrue("derivedFromPTypeRestriction",isDerived);

},
/**
* 
Check anonymous type for p element is derived from pType by any method other than restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom31 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom31") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","pType",14);
      assertFalse("derivedFromPTypeNotRestriction",isDerived);

},
/**
* 
Check if anonymous type of p element is derived from part1.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom32 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom32") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","part1",15);
      assertTrue("derivedFromPart1AnyMethod",isDerived);

},
/**
* 
Check is anonymous type of p element is derived by extension from part1.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom33 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom33") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","part1",2);
      assertTrue("derivedFromPart1Extension",isDerived);

},
/**
* 
Check if anonymous type of p element is derived from part1 by any method other than extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom34 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom34") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","part1",13);
      assertFalse("derivedFromPart1NotExtension",isDerived);

},
/**
* 
Check if anonymous type of p element is derived from xsd:simpleType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom35 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom35") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",15);
      assertFalse("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if anonymous type of p element is derived from xsd:anyType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom36 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom36") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",15);
      assertTrue("derivedFromAnyTypeAnyMethod",isDerived);

},
/**
* 
Check if anonymous type of p element is derived from xsd:anyType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom37 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom37") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",1);
      assertFalse("derivedFromAnyTypeRestriction",isDerived);

},
/**
* 
Check if anonymous type of p element is derived from xsd:anyType by any method other
than extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom38 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom38") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",13);
      assertFalse("derivedFromAnyTypeNotExtension",isDerived);

},
/**
* 
Check if anonymous type of p element derives from itself.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom39 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom39") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      var typeNS;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      typeNS = typeInfo.typeNamespace;

      isDerived = typeInfo.isDerivedFrom(typeNS,typeName,15);
      assertFalse("notDerivedFromSelf",isDerived);

},
/**
* 
Check if emType is derived from xsd:ID by union.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom40 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom40") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","ID",4);
      assertTrue("derivedFromID",isDerived);

},
/**
* 
Check if emType is derived from xsd:ID by any method other than union or restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom41 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom41") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","emType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","ID",10);
      assertFalse("derivedFromID",isDerived);

},
/**
* 
Check if strongType is derived from anySimpleType by list.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom42 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom42") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      var typeName;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
typeName = typeInfo.typeName;

      assertEquals("typeName","strongType",typeName);
       isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",8);
      assertTrue("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if anonymous type of acronym element derived from anyType by restriction.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom43 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom43") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      typeInfo = acronymElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",1);
      assertFalse("derivedFromAnyType",isDerived);

},
/**
* 
Check if anonymous type of acronym element derived from anyType by any method other than extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom44 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom44") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      typeInfo = acronymElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",13);
      assertFalse("derivedFromAnyType",isDerived);

},
/**
* 
Check if anonymous type of acronym element derived from anySimpleType by extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom45 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom45") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      typeInfo = acronymElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",2);
      assertTrue("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if anonymous type of acronym element derived from anySimpleType by any method other than extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom46 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom46") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      typeInfo = acronymElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",13);
      assertFalse("derivedFromAnySimpleType",isDerived);

},
/**
* 
Check if anonymous type of acronym element derived from xsd:string by extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom47 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom47") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      typeInfo = acronymElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",2);
      assertTrue("derivedFromString",isDerived);

},
/**
* 
Check if anonymous type of acronym element derived from xsd:string by any method other than extension.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom48 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom48") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(2);
      typeInfo = acronymElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",13);
      assertFalse("derivedFromString",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns true
when asked if it derives by list from the item type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom49 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom49") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","double",8);
      assertTrue("derivedFromDoubleList",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns true
when asked if it derives by any method from the item type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom50 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom50") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","double",0);
      assertTrue("derivedFromDoubleAny",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns false
when asked if it derives by any method other than list from the item type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom51 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom51") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","double",7);
      assertFalse("derivedFromDoubleNonList",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns false
when asked if it derives by restriction from anySimpleType type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom52 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom52") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",1);
      assertFalse("derivedFromAnySimpleRestriction",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns true
when asked if it derives by extension from anySimpleType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom53 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom53") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",2);
      assertTrue("derivedFromAnySimpleExtension",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns true
when asked if it derives by list from anySimpleType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom54 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom54") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anySimpleType",8);
      assertTrue("derivedFromAnySimpleList",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns true
when asked if it derives by extension from anyType type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom55 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom55") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",2);
      assertTrue("derivedFromAnyRestriction",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns true
when asked if it derives by extension from anyType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom56 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom56") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",2);
      assertTrue("derivedFromAnyExtension",isDerived);

},
/**
* 
Check if a type derived by extension from a list of a item type returns true
when asked if it derives by list from anyType.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom57 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom57") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","anyType",8);
      assertTrue("derivedFromAnyList",isDerived);

},
/**
* 
Check if a type derived by extension from a union returns true
when asked if it derives by union from a member type of the union.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom58 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom58") != null) return;
    var doc;
      var elemList;
      var codeElem;
      var attr;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("code");
      codeElem = elemList.item(0);
      typeInfo = codeElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","unbounded",4);
      assertTrue("isDerived",isDerived);

},
/**
* 
Check if a type derived by extension from a union returns true
when asked if it derives by union from a restricted base of
a member of type union.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom59 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom59") != null) return;
    var doc;
      var elemList;
      var codeElem;
      var attr;
      var elem;
      var elemName;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("code");
      codeElem = elemList.item(0);
      typeInfo = codeElem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","integer",4);
      assertTrue("isDerived",isDerived);

},
/**
* 
Check if xs:IDREFS is derived by list from xs:IDREF.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom60 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom60") != null) return;
    var doc;
      var elemList;
      var elem;
      var attr;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("strong");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","IDREF",8);
      assertTrue("isDerived",isDerived);

},
/**
* 
Check if xs:byte is derived by restriction from xs:short
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom61 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom61") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","short",1);
      assertTrue("isDerived",isDerived);

},
/**
* 
Check if xs:byte is derived by restriction from xs:decimal
* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom62 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom62") != null) return;
    var doc;
      var elemList;
      var elem;
      var typeInfo;
      var isDerived;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "typeinfo");
      elemList = doc.getElementsByTagName("em");
      elem = elemList.item(0);
      typeInfo = elem.schemaTypeInfo;

      assertNotNull("typeInfoNotNull",typeInfo);
isDerived = typeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","decimal",1);
      assertTrue("isDerived",isDerived);

},
/**
* 
	The isDerivedFrom method checks if this TypeInfo derives from the specified ancestor type. 
	If the document's schema is a DTD or no schema is associated with the document, this method
	will always return false.  

	Get schemaTypeInfo on an element that belongs to a document with an XML DTD.  Invoke method
	isDerivedFrom and verify that returned the typeNamespace is null.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom63 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom63") != null) return;
    var doc;
      var elemList;
      var acronymElem;
      var retValue;
      var typeNamespace;
      var nullName = null;

      var elemTypeInfo;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acronymElem = elemList.item(0);
      elemTypeInfo = acronymElem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/TR/REC-xml",nullName,0);
      assertFalse("typeinfoisderivedfrom63",retValue);

},
/**
* 
Check that the simpleType of an attributes derives by restriction from itself
and from its base type. 

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom64 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom64") != null) return;
    var doc;
      var docElem;
      var elemList;
      var acElem;
      var classAttr;
      var attrTypeInfo;
      var typeName;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("acronym");
      acElem = elemList.item(1);
      classAttr = acElem.getAttributeNode("class");
      attrTypeInfo = classAttr.schemaTypeInfo;

      retValue = attrTypeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","classType",1);
      assertTrue("derivedFromClassType",retValue);
retValue = attrTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",1);
      assertTrue("derivedFromString",retValue);

},
/**
* 
	The isDerivedFrom method checks if this TypeInfo derives from the specified ancestor type. 
	
	Get schemaTypeInfo on a simple type attribute that belongs to a document with an XML schema.
	Invoke method isDerivedFrom with derivation method list and verify that the value returned is true.

* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom65 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom65") != null) return;
    var doc;
      var docElem;
      var elemTypeInfo;
      var elemList;
      var strongElem;
      var attrTypeInfo;
      var typeName;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("strong");
      strongElem = elemList.item(0);
      elemTypeInfo = strongElem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",8);
      assertTrue("lisrDerivedFromString",retValue);

},
/**
* 
	The isDerivedFrom method checks if this TypeInfo derives from the specified ancestor type. 
	
	Get schemaTypeInfo on an element of type Union that belongs to a document with an XML schema.
	Invoke method isDerivedFrom with derivation method union and verify that the value returned is true. 
      Verify that emType is derived from emp0004_5Type by union.


* @author IBM
* @author Jenny Hsu
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom66 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom66") != null) return;
    var doc;
      var unionElem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("em");
      unionElem = elemList.item(0);
      elemTypeInfo = unionElem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emp0004_5Type",0);
      assertTrue("typeinfoisderivedfrom66",retValue);

},
/**
* 
Checks that isDerivedFrom(...,METHOD_UNION) returns true when there
are multiple union derivation steps between the target and
ancestor type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom67 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom67") != null) return;
    var doc;
      var elem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("sup");
      elem = elemList.item(0);
      elemTypeInfo = elem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emp0004_5Type",4);
      assertTrue("isDerived",retValue);

},
/**
* 
Checks that isDerivedFrom(...,0) returns true when there
is more than one union derivation steps between the target and
ancestor type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom68 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom68") != null) return;
    var doc;
      var elem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("sup");
      elem = elemList.item(0);
      elemTypeInfo = elem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emp0004_5Type",0);
      assertTrue("isDerived",retValue);

},
/**
* 
Checks that isDerivedFrom(...,DERIVATION_UNION|DERIVATION_LIST) returns false when there
is both a union and list derivation steps between the target and
ancestor type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom69 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom69") != null) return;
    var doc;
      var elem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("sup");
      elem = elemList.item(0);
      elemTypeInfo = elem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","integer",12);
      assertFalse("isDerived",retValue);

},
/**
* 
Checks that isDerivedFrom(...,0) returns true when there
is both a union and list derivation steps between the target and
ancestor type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom70 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom70") != null) return;
    var doc;
      var elem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("sup");
      elem = elemList.item(0);
      elemTypeInfo = elem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema","string",0);
      assertTrue("isDerived",retValue);

},
/**
* 
Checks that isDerivedFrom(...,0) returns true when target type is a list
of an union of the ancestor type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom71 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom71") != null) return;
    var doc;
      var elem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("code");
      elem = elemList.item(0);
      elemTypeInfo = elem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","field",0);
      assertTrue("isDerived",retValue);

},
/**
* 
Checks that isDerivedFrom(...,DERIVATION_LIST|DERIVATION_UNION) returns false when target type is a list
of an union.
ancestor type.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom72 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom72") != null) return;
    var doc;
      var elem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("code");
      elem = elemList.item(0);
      elemTypeInfo = elem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","field",12);
      assertFalse("isDerived",retValue);

},
/**
* 
Checks that isDerivedFrom(...,0) returns true where the target type is a union
where the ancestor type is a member of the union and is a union itself.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#TypeInfo-isDerivedFrom
*/
typeinfoisderivedfrom73 : function () {
   var success;
    if(checkInitialization(builder, "typeinfoisderivedfrom73") != null) return;
    var doc;
      var elem;
      var elemTypeInfo;
      var typeName;
      var elemList;
      var retValue;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elemList = doc.getElementsByTagName("sup");
      elem = elemList.item(0);
      elemTypeInfo = elem.schemaTypeInfo;

      retValue = elemTypeInfo.isDerivedFrom("http://www.w3.org/1999/xhtml","emType",0);
      assertTrue("isDerived",retValue);

},
/**
* 
Call setUserData on a node providing a UserDataHandler and rename the node.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-handleUserDataEvent
*/
userdatahandler01 : function () {
   var success;
    if(checkInitialization(builder, "userdatahandler01") != null) return;
    var doc;
      var node;
      var pList;
      userDataMonitor = new UserDataMonitor();
      
      var oldUserData;
      var elementNS;
      var newNode;
      var notifications = new Array();

      var notification;
      var operation;
      var key;
      var data;
      var src;
      var dst;
      var greetingCount = 0;
      var salutationCount = 0;
      var hello = "Hello";
      var mister = "Mr.";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      node = pList.item(0);
      if (null == userDataMonitor) {
         node.setUserData("greeting", hello, null);
      } else {
          node.setUserData("greeting", hello, userDataMonitor.handle);
      }
       if (null == userDataMonitor) {
         node.setUserData("salutation", mister, null);
      } else {
          node.setUserData("salutation", mister, userDataMonitor.handle);
      }
       elementNS = node.namespaceURI;

      newNode = doc.renameNode(node,elementNS,"div");
      notifications = userDataMonitor.allNotifications;
assertSize("twoNotifications",2,notifications);
for(var indexN1009E = 0;indexN1009E < notifications.length; indexN1009E++) {
      notification = notifications[indexN1009E];
      operation = notification.operation;
assertEquals("operationIsRename",4,operation);
       key = notification.key;
data = notification.data;

	if(
	("greeting" == key)
	) {
	assertEquals("greetingDataHello",hello,data);
       greetingCount += 1;

	}
	
		else {
			assertEquals("saluationKey","salutation",key);
       assertEquals("salutationDataMr",mister,data);
       salutationCount += 1;

		}
	src = notification.src;
assertSame("srcIsNode",node,src);
dst = notification.dst;

	if(
	
	(dst == null)

	) {
	assertSame("ifDstNullRenameMustReuseNode",node,newNode);

	}
	
		else {
			assertSame("dstIsNewNode",newNode,dst);

		}
	
	}
   assertEquals("greetingCountIs1",1,greetingCount);
       assertEquals("salutationCountIs1",1,salutationCount);
       
},
/**
* 
Call setUserData on a node providing a UserDataHandler and clone the node.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-handleUserDataEvent
*/
userdatahandler02 : function () {
   var success;
    if(checkInitialization(builder, "userdatahandler02") != null) return;
    var doc;
      var node;
      var pList;
      userDataMonitor = new UserDataMonitor();
      
      var oldUserData;
      var elementNS;
      var newNode;
      var notifications = new Array();

      var notification;
      var operation;
      var key;
      var data;
      var src;
      var dst;
      var greetingCount = 0;
      var salutationCount = 0;
      var hello = "Hello";
      var mister = "Mr.";
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      pList = doc.getElementsByTagName("p");
      node = pList.item(0);
      if (null == userDataMonitor) {
         node.setUserData("greeting", hello, null);
      } else {
          node.setUserData("greeting", hello, userDataMonitor.handle);
      }
       if (null == userDataMonitor) {
         node.setUserData("salutation", mister, null);
      } else {
          node.setUserData("salutation", mister, userDataMonitor.handle);
      }
       elementNS = node.namespaceURI;

      newNode = node.cloneNode(true);
      notifications = userDataMonitor.allNotifications;
assertSize("twoNotifications",2,notifications);
for(var indexN1009C = 0;indexN1009C < notifications.length; indexN1009C++) {
      notification = notifications[indexN1009C];
      operation = notification.operation;
assertEquals("operationIsClone",1,operation);
       key = notification.key;
data = notification.data;

	if(
	("greeting" == key)
	) {
	assertEquals("greetingDataHello",hello,data);
       greetingCount += 1;

	}
	
		else {
			assertEquals("saluationKey","salutation",key);
       assertEquals("salutationDataMr",mister,data);
       salutationCount += 1;

		}
	src = notification.src;
assertSame("srcIsNode",node,src);
dst = notification.dst;
assertSame("dstIsNewNode",newNode,dst);

	}
   assertEquals("greetingCountIs1",1,greetingCount);
       assertEquals("salutationCountIs1",1,salutationCount);
       
},
/**
* 
Call setUserData on a node providing a UserDataHandler and import the node.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-handleUserDataEvent
*/
userdatahandler03 : function () {
   var success;
    if(checkInitialization(builder, "userdatahandler03") != null) return;
    var doc;
      var node;
      var pList;
      userDataMonitor = new UserDataMonitor();
      
      var oldUserData;
      var elementNS;
      var newNode;
      var notifications = new Array();

      var notification;
      var operation;
      var key;
      var data;
      var src;
      var dst;
      var greetingCount = 0;
      var salutationCount = 0;
      var hello = "Hello";
      var mister = "Mr.";
      var newDoc;
      var rootName;
      var rootNS;
      var domImpl;
      var docType = null;

      var docElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      newDoc = domImpl.createDocument(rootNS,rootName,docType);
      pList = doc.getElementsByTagName("p");
      node = pList.item(0);
      if (null == userDataMonitor) {
         node.setUserData("greeting", hello, null);
      } else {
          node.setUserData("greeting", hello, userDataMonitor.handle);
      }
       if (null == userDataMonitor) {
         node.setUserData("salutation", mister, null);
      } else {
          node.setUserData("salutation", mister, userDataMonitor.handle);
      }
       elementNS = node.namespaceURI;

      newNode = doc.importNode(node,true);
      notifications = userDataMonitor.allNotifications;
assertSize("twoNotifications",2,notifications);
for(var indexN100CE = 0;indexN100CE < notifications.length; indexN100CE++) {
      notification = notifications[indexN100CE];
      operation = notification.operation;
assertEquals("operationIsImport",2,operation);
       key = notification.key;
data = notification.data;

	if(
	("greeting" == key)
	) {
	assertEquals("greetingDataHello",hello,data);
       greetingCount += 1;

	}
	
		else {
			assertEquals("saluationKey","salutation",key);
       assertEquals("salutationDataMr",mister,data);
       salutationCount += 1;

		}
	src = notification.src;
assertSame("srcIsNode",node,src);
dst = notification.dst;
assertSame("dstIsNewNode",newNode,dst);

	}
   assertEquals("greetingCountIs1",1,greetingCount);
       assertEquals("salutationCountIs1",1,salutationCount);
       
},
/**
* 
Call setUserData on a node providing a UserDataHandler and adopt the node.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#ID-handleUserDataEvent
*/
userdatahandler04 : function () {
   var success;
    if(checkInitialization(builder, "userdatahandler04") != null) return;
    var doc;
      var node;
      var pList;
      userDataMonitor = new UserDataMonitor();
      
      var oldUserData;
      var elementNS;
      var newNode;
      var notifications = new Array();

      var notification;
      var operation;
      var key;
      var data;
      var src;
      var dst;
      var greetingCount = 0;
      var salutationCount = 0;
      var hello = "Hello";
      var mister = "Mr.";
      var newDoc;
      var rootName;
      var rootNS;
      var domImpl;
      var docType = null;

      var docElem;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "barfoo");
      domImpl = doc.implementation;
docElem = doc.documentElement;

      rootNS = docElem.namespaceURI;

      rootName = docElem.tagName;

      newDoc = domImpl.createDocument(rootNS,rootName,docType);
      pList = doc.getElementsByTagName("p");
      node = pList.item(0);
      if (null == userDataMonitor) {
         node.setUserData("greeting", hello, null);
      } else {
          node.setUserData("greeting", hello, userDataMonitor.handle);
      }
       if (null == userDataMonitor) {
         node.setUserData("salutation", mister, null);
      } else {
          node.setUserData("salutation", mister, userDataMonitor.handle);
      }
       elementNS = node.namespaceURI;

      newNode = doc.adoptNode(node);
      notifications = userDataMonitor.allNotifications;
assertSize("twoNotifications",2,notifications);
for(var indexN100CD = 0;indexN100CD < notifications.length; indexN100CD++) {
      notification = notifications[indexN100CD];
      operation = notification.operation;
assertEquals("operationIsImport",5,operation);
       key = notification.key;
data = notification.data;

	if(
	("greeting" == key)
	) {
	assertEquals("greetingDataHello",hello,data);
       greetingCount += 1;

	}
	
		else {
			assertEquals("saluationKey","salutation",key);
       assertEquals("salutationDataMr",mister,data);
       salutationCount += 1;

		}
	src = notification.src;
assertSame("srcIsNode",node,src);
dst = notification.dst;
assertNull("dstIsNull",dst);
    
	}
   assertEquals("greetingCountIs1",1,greetingCount);
       assertEquals("salutationCountIs1",1,salutationCount);
       
},
/**
* 
Create a document with an XML 1.1 valid but XML 1.0 invalid element and
normalize document with well-formed set to true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-well-formed
*/
wellformed01 : function () {
   var success;
    if(checkInitialization(builder, "wellformed01") != null) return;
    var domImpl;
      var nullString = null;

      var nullDoctype = null;

      var doc;
      var elem;
      var retval;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var locator;
      var relatedNode;
      domImpl = getImplementation();
doc = domImpl.createDocument(nullString,nullString,nullDoctype);
      
	{
		success = false;
		try {
            elem = doc.createElementNS("http://www.example.org/domts/wellformed01","LegalNameࢎ");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("xml10InvalidName",success);
	}

      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        elem = doc.createElementNS("http://www.example.org/domts/wellformed01","LegalNameࢎ");
      retval = doc.appendChild(elem);
      doc.xmlVersion = "1.0";

      domConfig = doc.domConfig;

      domConfig.setParameter("well-formed", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100A9 = 0;indexN100A9 < errors.length; indexN100A9++) {
      error = errors[indexN100A9];
      severity = error.severity;

      assertEquals("severity",2,severity);
       type = error.type;

      assertEquals("type","wf-invalid-character-in-node-name",type);
       locator = error.location;

      relatedNode = locator.relatedNode;

      assertSame("relatedNode",elem,relatedNode);

	}
   assertSize("oneError",1,errors);

},
/**
* 
Create a document with an XML 1.1 valid but XML 1.0 invalid element and
normalize document with well-formed set to false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-well-formed
*/
wellformed02 : function () {
   var success;
    if(checkInitialization(builder, "wellformed02") != null) return;
    var domImpl;
      var nullString = null;

      var nullDoctype = null;

      var doc;
      var elem;
      var retval;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var canSet;
      domImpl = getImplementation();
doc = domImpl.createDocument(nullString,nullString,nullDoctype);
      
	{
		success = false;
		try {
            elem = doc.createElementNS("http://www.example.org/domts/wellformed02","LegalNameࢎ");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("xml10InvalidName",success);
	}

      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        elem = doc.createElementNS("http://www.example.org/domts/wellformed02","LegalNameࢎ");
      retval = doc.appendChild(elem);
      doc.xmlVersion = "1.0";

      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("well-formed",false);
      
	if(
	canSet
	) {
	domConfig.setParameter("well-formed", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
assertSize("noError",0,errors);

	}
	
},
/**
* 
Create a document with an XML 1.1 valid but XML 1.0 invalid attribute and
normalize document with well-formed set to true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-well-formed
*/
wellformed03 : function () {
   var success;
    if(checkInitialization(builder, "wellformed03") != null) return;
    var domImpl;
      var nullDoctype = null;

      var doc;
      var docElem;
      var attr;
      var retval;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var locator;
      var relatedNode;
      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDoctype);
      docElem = doc.documentElement;

      
	{
		success = false;
		try {
            attr = doc.createAttribute("LegalNameࢎ");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("xml10InvalidName",success);
	}

      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        docElem.setAttribute("LegalNameࢎ","foo");
      attr = docElem.getAttributeNode("LegalNameࢎ");
      doc.xmlVersion = "1.0";

      domConfig = doc.domConfig;

      domConfig.setParameter("well-formed", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100AA = 0;indexN100AA < errors.length; indexN100AA++) {
      error = errors[indexN100AA];
      severity = error.severity;

      assertEquals("severity",2,severity);
       type = error.type;

      assertEquals("type","wf-invalid-character-in-node-name",type);
       locator = error.location;

      relatedNode = locator.relatedNode;

      assertSame("relatedNode",attr,relatedNode);

	}
   assertSize("oneError",1,errors);

},
/**
* 
Create a document with an XML 1.1 valid but XML 1.0 invalid attribute and
normalize document with well-formed set to false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#Document3-normalizeDocument
* @see http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core#parameter-well-formed
*/
wellformed04 : function () {
   var success;
    if(checkInitialization(builder, "wellformed04") != null) return;
    var domImpl;
      var nullDoctype = null;

      var doc;
      var docElem;
      var attr;
      var retval;
      var domConfig;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var canSet;
      var nullNS = null;

      domImpl = getImplementation();
doc = domImpl.createDocument("http://www.w3.org/1999/xhtml","html",nullDoctype);
      docElem = doc.documentElement;

      
	{
		success = false;
		try {
            attr = doc.createAttributeNS(nullNS,"LegalNameࢎ");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 5);
		}
		assertTrue("xml10InvalidName",success);
	}

      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        docElem.setAttributeNS(nullNS,"LegalNameࢎ","foo");
      doc.xmlVersion = "1.0";

      domConfig = doc.domConfig;

      canSet = domConfig.canSetParameter("well-formed",false);
      
	if(
	canSet
	) {
	domConfig.setParameter("well-formed", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 doc.normalizeDocument();
      errors = errorMonitor.allErrors;
for(var indexN100AA = 0;indexN100AA < errors.length; indexN100AA++) {
      error = errors[indexN100AA];
      assertNull("noErrorsExpected",error);
    
	}
   
	}
	
}}
