exports.tests = {
  /**
  * 
  Attr nodes may be associated with Element nodes contained within a DocumentFragment.
  Create a new DocumentFragment and add a newly created Element node(with one attribute).  
  Once the element is added, its attribute should be available as an attribute associated 
  with an Element within a DocumentFragment.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-35CB04B5
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
  */
  attrcreatedocumentfragment : function () {
    var success;
    if(checkInitialization(builder, "attrcreatedocumentfragment") != null) return;
    var doc;
    var docFragment;
    var newOne;
    var domesticNode;
    var domesticAttr;
    var attrs;
    var attrName;
    var appendedChild;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docFragment = doc.createDocumentFragment();
    newOne = doc.createElement("newElement");
    newOne.setAttribute("newdomestic","Yes");
    appendedChild = docFragment.appendChild(newOne);
    domesticNode = docFragment.firstChild;

    domesticAttr = domesticNode.attributes;

    attrs = domesticAttr.item(0);
    attrName = attrs.name;

    assertEquals("attrCreateDocumentFragmentAssert","newdomestic",attrName);

  },
  /**
  * 
  The "setValue()" method for an attribute creates a 
  Text node with the unparsed content of the string.
  Retrieve the attribute named "street" from the last 
  child of of the fourth employee and assign the "Y&ent1;" 
  string to its value attribute.  This value is not yet
  parsed and therefore should still be the same upon
  retrieval. This test uses the "getNamedItem(name)" method
  from the NamedNodeMap interface.  

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Apr/0057.html
  */
  attrcreatetextnode : function () {
    var success;
    if(checkInitialization(builder, "attrcreatetextnode") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var value;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(3);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    streetAttr.value = "Y&ent1;";

    value = streetAttr.value;

    assertEquals("value","Y&ent1;",value);
    value = streetAttr.nodeValue;

    assertEquals("nodeValue","Y&ent1;",value);

  },
  /**
  * 
  The "setNodeValue()" method for an attribute creates a 
  Text node with the unparsed content of the string.
  Retrieve the attribute named "street" from the last 
  child of of the fourth employee and assign the "Y&ent1;" 
  string to its value attribute.  This value is not yet
  parsed and therefore should still be the same upon
  retrieval. This test uses the "getNamedItem(name)" method
  from the NamedNodeMap interface. 

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Apr/0057.html
  */
  attrcreatetextnode2 : function () {
    var success;
    if(checkInitialization(builder, "attrcreatetextnode2") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var value;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(3);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    streetAttr.nodeValue = "Y&ent1;";

    value = streetAttr.value;

    assertEquals("value","Y&ent1;",value);
    value = streetAttr.nodeValue;

    assertEquals("nodeValue","Y&ent1;",value);

  },
  /**
  * 
  If there is not an explicit value assigned to an attribute
  and there is a declaration for this attribute and that
  declaration includes a default value, then that default
  value is the attributes default value.
  Retrieve the attribute named "street" from the last 
  child of of the first employee and examine its 
  value.  That value should be the value given the
  attribute in the DTD file.  The test uses the 
  "getNamedItem(name)" method from the NamedNodeMap 
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
  */
  attrdefaultvalue : function () {
    var success;
    if(checkInitialization(builder, "attrdefaultvalue") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var value;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    value = streetAttr.nodeValue;

    assertEquals("attrDefaultValueAssert","Yes",value);

  },
  /**
  * 
  If an Attr is explicitly assigned any value, then that value is the attributes effective value.
  Retrieve the attribute named "domestic" from the last child of of the first employee 
  and examine its nodeValue attribute.  This test uses the "getNamedItem(name)" method 
  from the NamedNodeMap interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
  */
  attreffectivevalue : function () {
    var success;
    if(checkInitialization(builder, "attreffectivevalue") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var domesticAttr;
    var value;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    value = domesticAttr.nodeValue;

    assertEquals("attrEffectiveValueAssert","Yes",value);

  },
  /**
  * 
  The "getValue()" method will return the value of the
  attribute as a string.  The general entity references
  are replaced with their values.
  Retrieve the attribute named "street" from the last 
  child of of the fourth employee and examine the string 
  returned by the "getValue()" method.  The value should
  be set to "Yes" after the EntityReference is
  replaced with its value.  This test uses the  
  "getNamedItem(name)" method from the NamedNodeMap 
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
  */
  attrentityreplacement : function () {
    var success;
    if(checkInitialization(builder, "attrentityreplacement") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var value;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(3);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    value = streetAttr.value;

    assertEquals("streetYes","Yes",value);

  },
  /**
  * 
  The getNodeName() method of an Attribute node. 
  Retrieve the attribute named street from the last 
  child of of the second employee and examine its 
  NodeName.  This test uses the getNamedItem(name) method from the NamedNodeMap 
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1112119403
  */
  attrname : function () {
    var success;
    if(checkInitialization(builder, "attrname") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var name;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(1);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    name = streetAttr.nodeName;

    assertEquals("nodeName","street",name);
    name = streetAttr.name;

    assertEquals("name","street",name);

  },
  /**
  * 
  The "getNextSibling()" method for an Attr node should return null.
  Retrieve the attribute named "domestic" from the last child of of the
  first employee and examine its NextSibling node.  This test uses the
  "getNamedItem(name)" method from the NamedNodeMap interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6AC54C2F
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
  */
  attrnextsiblingnull : function () {
    var success;
    if(checkInitialization(builder, "attrnextsiblingnull") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var domesticAttr;
    var s;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    s = domesticAttr.nextSibling;

    assertNull("attrNextSiblingNullAssert",s);

  },
  /**
  * 
  The "getSpecified()" method for an Attr node should 
  be set to false if the attribute was not explicitly given
  a value.
  Retrieve the attribute named "street" from the last 
  child of of the first employee and examine the value 
  returned by the "getSpecified()" method.  This test uses 
  the "getNamedItem(name)" method from the NamedNodeMap 
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-862529273
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
  */
  attrnotspecifiedvalue : function () {
    var success;
    if(checkInitialization(builder, "attrnotspecifiedvalue") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var state;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    state = streetAttr.specified;

    assertFalse("streetNotSpecified",state);

  },
  /**
  * 
  The "getParentNode()" method for an Attr node should return null.  Retrieve
  the attribute named "domestic" from the last child of the first employee
  and examine its parentNode attribute.  This test also uses the "getNamedItem(name)"
  method from the NamedNodeMap interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1060184317
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
  */
  attrparentnodenull : function () {
    var success;
    if(checkInitialization(builder, "attrparentnodenull") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var domesticAttr;
    var s;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    s = domesticAttr.parentNode;

    assertNull("attrParentNodeNullAssert",s);

  },
  /**
  * 
  The "getPreviousSibling()" method for an Attr node should return null.
  Retrieve the attribute named "domestic" from the last child of of the
  first employee and examine its PreviousSibling node.  This test uses the
  "getNamedItem(name)" method from the NamedNodeMap interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-640FB3C8
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
  */
  attrprevioussiblingnull : function () {
    var success;
    if(checkInitialization(builder, "attrprevioussiblingnull") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var domesticAttr;
    var s;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    s = domesticAttr.previousSibling;

    assertNull("attrPreviousSiblingNullAssert",s);

  },
  /**
  * 
  Removing a child node from an attribute in an entity reference
  should result in an NO_MODIFICATION_ALLOWED_ERR DOMException.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1734834066')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  */
  attrremovechild1 : function () {
    var success;
    if(checkInitialization(builder, "attrremovechild1") != null) return;
    var doc;
    var entRef;
    var entElement;
    var attrNode;
    var textNode;
    var removedNode;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    entRef = doc.createEntityReference("ent4");
    assertNotNull("createdEntRefNotNull",entRef);
    entElement = entRef.firstChild;

    assertNotNull("entElementNotNull",entElement);
    attrNode = entElement.getAttributeNode("domestic");
    textNode = attrNode.firstChild;

    assertNotNull("attrChildNotNull",textNode);

    {
      success = false;
      try {
        removedNode = attrNode.removeChild(textNode);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("setValue_throws_NO_MODIFICATION_ERR",success);
    }

  },
  /**
  * 
  Replacing a child node from an attribute in an entity reference
  should result in an NO_MODIFICATION_ALLOWED_ERR DOMException.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  */
  attrreplacechild1 : function () {
    var success;
    if(checkInitialization(builder, "attrreplacechild1") != null) return;
    var doc;
    var entRef;
    var entElement;
    var attrNode;
    var textNode;
    var removedNode;
    var newChild;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    entRef = doc.createEntityReference("ent4");
    assertNotNull("createdEntRefNotNull",entRef);
    entElement = entRef.firstChild;

    assertNotNull("entElementNotNull",entElement);
    attrNode = entElement.getAttributeNode("domestic");
    textNode = attrNode.firstChild;

    assertNotNull("attrChildNotNull",textNode);
    newChild = doc.createTextNode("Yesterday");

    {
      success = false;
      try {
        removedNode = attrNode.replaceChild(newChild,textNode);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("setValue_throws_NO_MODIFICATION_ERR",success);
    }

  },
  /**
  * 
  The "setValue()" method for an attribute causes the 
  DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
  if the node is readonly.
  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Get the "domestic" attribute
  from the entity reference and execute the "setValue()" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core#ID-221662474
  * @see http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core#xpointer(id('ID-221662474')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/DOM/updates/REC-DOM-Level-1-19981001-errata.html
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
  */
  attrsetvaluenomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "attrsetvaluenomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var gender;
    var genList;
    var gen;
    var gList;
    var g;
    var attrList;
    var attrNode;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    gender = genderList.item(2);
    assertNotNull("genderNotNull",gender);
    genList = gender.childNodes;

    gen = genList.item(0);
    assertNotNull("genderFirstChildNotNull",gen);
    gList = gen.childNodes;

    g = gList.item(0);
    assertNotNull("genderFirstGrandchildNotNull",g);
    attrList = g.attributes;

    assertNotNull("attributesNotNull",attrList);
    attrNode = attrList.getNamedItem("domestic");
    assertNotNull("attrNotNull",attrNode);

    {
      success = false;
      try {
        attrNode.value = "newvalue";

      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("setValue_throws_NO_MODIFICATION",success);
    }

    {
      success = false;
      try {
        attrNode.nodeValue = "newvalue2";

      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("setNodeValue_throws_NO_MODIFICATION",success);
    }

  },
  /**
  * 
  The "setValue()" method for an attribute causes the 
  DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
  if the node is readonly.

  Create an entity reference using document.createEntityReference()
  Get the "domestic" attribute from the entity 
  reference and execute the "setValue()" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core#ID-221662474
  * @see http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core#xpointer(id('ID-221662474')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/DOM/updates/REC-DOM-Level-1-19981001-errata.html
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/attrsetvaluenomodificationallowederr.xml
  */
  attrsetvaluenomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "attrsetvaluenomodificationallowederrEE") != null) return;
    var doc;
    var entRef;
    var entElement;
    var attrList;
    var attrNode;
    var gender;
    var genderList;
    var appendedChild;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    gender = genderList.item(2);
    assertNotNull("genderNotNull",gender);
    entRef = doc.createEntityReference("ent4");
    assertNotNull("entRefNotNull",entRef);
    appendedChild = gender.appendChild(entRef);
    entElement = entRef.firstChild;

    assertNotNull("entElementNotNull",entElement);
    attrList = entElement.attributes;

    attrNode = attrList.getNamedItem("domestic");

    {
      success = false;
      try {
        attrNode.value = "newvalue";

      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("setValue_throws_NO_MODIFICATION",success);
    }

    {
      success = false;
      try {
        attrNode.nodeValue = "newvalue2";

      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("setNodeValue_throws_NO_MODIFICATION",success);
    }

  },
  /**
  * 
  The "getSpecified()" method for an Attr node should 
  be set to true if the attribute was explicitly given
  a value.
  Retrieve the attribute named "domestic" from the last 
  child of of the first employee and examine the value 
  returned by the "getSpecified()" method.  This test uses 
  the "getNamedItem(name)" method from the NamedNodeMap 
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-862529273
  */
  attrspecifiedvalue : function () {
    var success;
    if(checkInitialization(builder, "attrspecifiedvalue") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var domesticAttr;
    var state;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    state = domesticAttr.specified;

    assertTrue("domesticSpecified",state);

  },
  /**
  * 
  The "getSpecified()" method for an Attr node should return true if the 
  value of the attribute is changed. 
  Retrieve the attribute named "street" from the last 
  child of of the THIRD employee and change its 
  value to "Yes"(which is the default DTD value).  This
  should cause the "getSpecified()" method to be true.
  This test uses the "setAttribute(name,value)" method
  from the Element interface and the "getNamedItem(name)"
  method from the NamedNodeMap interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-862529273
  */
  attrspecifiedvaluechanged : function () {
    var success;
    if(checkInitialization(builder, "attrspecifiedvaluechanged") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var state;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(2);
    testNode.setAttribute("street","Yes");
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    state = streetAttr.specified;

    assertTrue("streetSpecified",state);

  },
  /**
  * 
  To respecify the attribute to its default value from
  the DTD, the attribute must be deleted.  This will then
  make a new attribute available with the "getSpecified()"
  method value set to false.
  Retrieve the attribute named "street" from the last
  child of of the THIRD employee and delete it.  This
  should then create a new attribute with its default
  value and also cause the "getSpecified()" method to
  return false.
  This test uses the "removeAttribute(name)" method
  from the Element interface and the "getNamedItem(name)"
  method from the NamedNodeMap interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D6AC0F9
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
  */
  attrspecifiedvalueremove : function () {
    var success;
    if(checkInitialization(builder, "attrspecifiedvalueremove") != null) return;
    var doc;
    var addressList;
    var testNode;
    var attributes;
    var streetAttr;
    var state;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(2);
    testNode.removeAttribute("street");
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    assertNotNull("streetAttrNotNull",streetAttr);
    state = streetAttr.specified;

    assertFalse("attrSpecifiedValueRemoveAssert",state);

  },
  /**
  * 
  Retrieve the last CDATASection node located inside the
  second child of the second employee and examine its
  content.  Since the CDATASection interface inherits
  from the CharacterData interface(via the Text node),
  the "getData()" method can be used to access the
  CDATA content.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  */
  cdatasectiongetdata : function () {
    var success;
    if(checkInitialization(builder, "cdatasectiongetdata") != null) return;
    var doc;
    var nameList;
    var child;
    var lastChild;
    var data;
    var nodeType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    nameList = doc.getElementsByTagName("name");
    child = nameList.item(1);
    lastChild = child.lastChild;

    nodeType = lastChild.nodeType;

    assertEquals("isCDATA",4,nodeType);
    data = lastChild.data;

    assertEquals("data","This is an adjacent CDATASection with a reference to a tab &tab;",data);

  },
  /**
  * 
  Adjacent CDATASection nodes cannot be merged together by
  use of the "normalize()" method from the Element interface.
  Retrieve second child of the second employee and invoke
  the "normalize()" method.  The Element under contains
  two CDATASection nodes that should not be merged together
  by the "normalize()" method.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-162CF083
  */
  cdatasectionnormalize : function () {
    var success;
    if(checkInitialization(builder, "cdatasectionnormalize") != null) return;
    var doc;
    var nameList;
    var lChild;
    var childNodes;
    var cdataN;
    var data;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    nameList = doc.getElementsByTagName("name");
    lChild = nameList.item(1);
    lChild.normalize();
    childNodes = lChild.childNodes;

    cdataN = childNodes.item(1);
    assertNotNull("firstCDATASection",cdataN);
    data = cdataN.data;

    assertEquals("data1","This is a CDATASection with EntityReference number 2 &ent2;",data);
    cdataN = childNodes.item(3);
    assertNotNull("secondCDATASection",cdataN);
    data = cdataN.data;

    assertEquals("data3","This is an adjacent CDATASection with a reference to a tab &tab;",data);

  },
  /**
  * 
  The "appendData(arg)" method appends a string to the end 
  of the character data of the node.

  Retrieve the character data from the second child 
  of the first employee.  The appendData(arg) method is
  called with arg=", Esquire".  The method should append 
  the specified data to the already existing character  
  data.  The new value return by the "getLength()" method
  should be 24.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
  */
  characterdataappenddata : function () {
    var success;
    if(checkInitialization(builder, "characterdataappenddata") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childValue;
    var childLength;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.appendData(", Esquire");
    childValue = child.data;

    childLength = childValue.length;
    assertEquals("characterdataAppendDataAssert",24,childLength);

  },
  /**
  * 
  On successful invocation of the "appendData(arg)" 
  method the "getData()" method provides access to the
  concatentation of data and the specified string.

  Retrieve the character data from the second child 
  of the first employee.  The appendData(arg) method is
  called with arg=", Esquire".  The method should append 
  the specified data to the already existing character  
  data.  The new value return by the "getData()" method
  should be "Margaret Martin, Esquire".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
  */
  characterdataappenddatagetdata : function () {
    var success;
    if(checkInitialization(builder, "characterdataappenddatagetdata") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.appendData(", Esquire");
    childData = child.data;

    assertEquals("characterdataAppendDataGetDataAssert","Margaret Martin, Esquire",childData);

  },
  /**
  * 
  The "appendData(arg)" method raises a NO_MODIFICATION_ALLOWED_ERR 
  DOMException if the node is readonly.  
  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Get the FIRST item 
  from the entity reference and execute the "appendData(arg)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-32791A2F')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
  */
  characterdataappenddatanomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "characterdataappenddatanomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entElement;
    var entElementContent;
    var entReference;
    var nodeType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = genderNode.firstChild;

    assertNotNull("entReferenceNotNull",entReference);
    nodeType = entReference.nodeType;


    if(
      (1 == nodeType)
    ) {
      entReference = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",entReference);

    }
    entElement = entReference.firstChild;

    assertNotNull("entElementNotNull",entElement);
    entElementContent = entElement.firstChild;

    assertNotNull("entElementContentNotNull",entElementContent);

    {
      success = false;
      try {
        entElementContent.appendData("newString");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  Create an ent3 entity reference and call appendData on a text child, should thrown a NO_MODIFICATION_ALLOWED_ERR. 

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-32791A2F')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/characterdataappenddatanomodificationallowederr.xml
  */
  characterdataappenddatanomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "characterdataappenddatanomodificationallowederrEE") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entText;
    var entReference;
    var appendedChild;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = doc.createEntityReference("ent3");
    assertNotNull("createdEntRefNotNull",entReference);
    appendedChild = genderNode.appendChild(entReference);
    entText = entReference.firstChild;

    assertNotNull("entTextNotNull",entText);

    {
      success = false;
      try {
        entText.appendData("newString");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "deleteData(offset,count)" method removes a range of
  characters from the node.  Delete data at the beginning
  of the character data.

  Retrieve the character data from the last child of the
  first employee.  The "deleteData(offset,count)"
  method is then called with offset=0 and count=16.
  The method should delete the characters from position
  0 thru position 16.  The new value of the character data
  should be "Dallas, Texas 98551".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  */
  characterdatadeletedatabegining : function () {
    var success;
    if(checkInitialization(builder, "characterdatadeletedatabegining") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(0,16);
    childData = child.data;

    assertEquals("characterdataDeleteDataBeginingAssert","Dallas, Texas 98551",childData);

  },
  /**
  * 
  The "deleteData(offset,count)" method removes a range of 
  characters from the node.  Delete data at the end 
  of the character data.

  Retrieve the character data from the last child of the
  first employee.  The "deleteData(offset,count)"
  method is then called with offset=30 and count=5.
  The method should delete the characters from position
  30 thru position 35.  The new value of the character data
  should be "1230 North Ave. Dallas, Texas".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  */
  characterdatadeletedataend : function () {
    var success;
    if(checkInitialization(builder, "characterdatadeletedataend") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(30,5);
    childData = child.data;

    assertEquals("characterdataDeleteDataEndAssert","1230 North Ave. Dallas, Texas ",childData);

  },
  /**
  * 
  If the sum of the offset and count used in the        
  "deleteData(offset,count) method is greater than the
  length of the character data then all the characters
  from the offset to the end of the data are deleted. 

  Retrieve the character data from the last child of the
  first employee.  The "deleteData(offset,count)"
  method is then called with offset=4 and count=50.
  The method should delete the characters from position 4
  to the end of the data since the offset+count(50+4)
  is greater than the length of the character data(35).
  The new value of the character data should be "1230".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  */
  characterdatadeletedataexceedslength : function () {
    var success;
    if(checkInitialization(builder, "characterdatadeletedataexceedslength") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(4,50);
    childData = child.data;

    assertEquals("characterdataDeleteDataExceedsLengthAssert","1230",childData);

  },
  /**
  * 
  On successful invocation of the "deleteData(offset,count)"
  method, the "getData()" and "getLength()" methods reflect
  the changes. 

  Retrieve the character data from the last child of the
  first employee.  The "deleteData(offset,count)"
  method is then called with offset=30 and count=5.
  The method should delete the characters from position
  30 thru position 35.  The new value of the character data
  should be "1230 North Ave. Dallas, Texas" which is
  returned by the "getData()" method and "getLength()"
  method should return 30".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7D61178C
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  */
  characterdatadeletedatagetlengthanddata : function () {
    var success;
    if(checkInitialization(builder, "characterdatadeletedatagetlengthanddata") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;
    var childLength;
    var result = new Array();


    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(30,5);
    childData = child.data;

    assertEquals("data","1230 North Ave. Dallas, Texas ",childData);
    childLength = child.length;

    assertEquals("length",30,childLength);

  },
  /**
  * 
  The "deleteData(offset,count)" method removes a range of 
  characters from the node.  Delete data in the middle 
  of the character data.

  Retrieve the character data from the last child of the
  first employee.  The "deleteData(offset,count)"
  method is then called with offset=16 and count=8.
  The method should delete the characters from position
  16 thru position 24.  The new value of the character data
  should be "1230 North Ave. Texas 98551".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  */
  characterdatadeletedatamiddle : function () {
    var success;
    if(checkInitialization(builder, "characterdatadeletedatamiddle") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(16,8);
    childData = child.data;

    assertEquals("characterdataDeleteDataMiddleAssert","1230 North Ave. Texas 98551",childData);

  },
  /**
  * 
  The "deleteData(offset,count)" method raises a NO_MODIFICATION_ALLOWED_ERR 
  DOMException if the node is readonly.   
  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Get the FIRST item 
  from the entity reference and execute the "deleteData(offset,count)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  */
  characterdatadeletedatanomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "characterdatadeletedatanomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entElement;
    var entElementContent;
    var nodeType;
    var entReference;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = genderNode.firstChild;

    assertNotNull("entReferenceNotNull",entReference);
    nodeType = entReference.nodeType;


    if(
      (3 == nodeType)
    ) {
      entReference = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",entReference);

    }
    entElement = entReference.firstChild;

    assertNotNull("entElementNotNull",entElement);
    entElementContent = entElement.firstChild;

    assertNotNull("entElementContentNotNull",entElementContent);

    {
      success = false;
      try {
        entElementContent.deleteData(1,3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  Create an ent3 entity reference and call deleteData on a text child, should thrown a NO_MODIFICATION_ALLOWED_ERR. 

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/characterdatadeletedatanomodificationallowederr.xml
  */
  characterdatadeletedatanomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "characterdatadeletedatanomodificationallowederrEE") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entText;
    var entReference;
    var appendedChild;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = doc.createEntityReference("ent3");
    assertNotNull("createdEntRefNotNull",entReference);
    appendedChild = genderNode.appendChild(entReference);
    entText = entReference.firstChild;

    assertNotNull("entTextNotNull",entText);

    {
      success = false;
      try {
        entText.deleteData(1,3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 

  The "getData()" method retrieves the character data 

  currently stored in the node.

  Retrieve the character data from the second child 

  of the first employee and invoke the "getData()" 

  method.  The method returns the character data 

  string.


  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  */
  characterdatagetdata : function () {
    var success;
    if(checkInitialization(builder, "characterdatagetdata") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    childData = child.data;

    assertEquals("characterdataGetDataAssert","Margaret Martin",childData);

  },
  /**
  * 
  The "getLength()" method returns the number of characters 
  stored in this nodes data.
  Retrieve the character data from the second 
  child of the first employee and examine the 
  value returned by the getLength() method.  

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7D61178C
  */
  characterdatagetlength : function () {
    var success;
    if(checkInitialization(builder, "characterdatagetlength") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childValue;
    var childLength;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    childValue = child.data;

    childLength = childValue.length;
    assertEquals("characterdataGetLengthAssert",15,childLength);

  },
  /**
  * 
  The "deleteData(offset,count)" method raises an
  INDEX_SIZE_ERR DOMException if the specified count 
  is negative. 

  Retrieve the character data of the last child of the
  first employee and invoke its "deleteData(offset,count)"
  method with offset=10 and count=-3.  It should raise the
  desired exception since the count is negative.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  */
  characterdataindexsizeerrdeletedatacountnegative : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrdeletedatacountnegative") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(10,-3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throws_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "deleteData(offset,count)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is greater that the number of characters in the string. 

  Retrieve the character data of the last child of the
  first employee and invoke its "deleteData(offset,count)"
  method with offset=40 and count=3.  It should raise the
  desired exception since the offset is greater than the
  number of characters in the string.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  characterdataindexsizeerrdeletedataoffsetgreater : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrdeletedataoffsetgreater") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(40,3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throw_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "deleteData(offset,count)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is negative. 

  Retrieve the character data of the last child of the
  first employee and invoke its "deleteData(offset,count)"
  method with offset=-5 and count=3.  It should raise the
  desired exception since the offset is negative.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  */
  characterdataindexsizeerrdeletedataoffsetnegative : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrdeletedataoffsetnegative") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(-5,3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throws_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "insertData(offset,arg)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is greater than the number of characters in the string. 

  Retrieve the character data of the last child of the
  first employee and invoke its insertData"(offset,arg)"
  method with offset=40 and arg="ABC".  It should raise
  the desired exception since the offset is greater than
  the number of characters in the string.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  characterdataindexsizeerrinsertdataoffsetgreater : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrinsertdataoffsetgreater") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.insertData(40,"ABC");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throw_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "insertData(offset,arg)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is negative. 

  Retrieve the character data of the last child of the
  first employee and invoke its insertData"(offset,arg)"
  method with offset=-5 and arg="ABC".  It should raise
  the desired exception since the offset is negative.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-E5CBA7FB')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  */
  characterdataindexsizeerrinsertdataoffsetnegative : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrinsertdataoffsetnegative") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.insertData(-5,"ABC");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throws_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method raises an
  INDEX_SIZE_ERR DOMException if the specified count
  is negative. 

  Retrieve the character data of the last child of the
  first employee and invoke its
  "replaceData(offset,count,arg) method with offset=10
  and count=-3 and arg="ABC".  It should raise the
  desired exception since the count is negative.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  */
  characterdataindexsizeerrreplacedatacountnegative : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrreplacedatacountnegative") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.replaceData(10,-3,"ABC");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throws_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is greater than the length of the string. 

  Retrieve the character data of the last child of the
  first employee and invoke its
  "replaceData(offset,count,arg) method with offset=40
  and count=3 and arg="ABC".  It should raise the
  desired exception since the offset is greater than the
  length of the string.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  characterdataindexsizeerrreplacedataoffsetgreater : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrreplacedataoffsetgreater") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.replaceData(40,3,"ABC");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throw_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is negative. 

  Retrieve the character data of the last child of the
  first employee and invoke its
  "replaceData(offset,count,arg) method with offset=-5
  and count=3 and arg="ABC".  It should raise the
  desired exception since the offset is negative.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-E5CBA7FB')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  */
  characterdataindexsizeerrreplacedataoffsetnegative : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrreplacedataoffsetnegative") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.replaceData(-5,3,"ABC");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throws_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "substringData(offset,count)" method raises an
  INDEX_SIZE_ERR DOMException if the specified count 
  is negative. 

  Retrieve the character data of the last child of the
  first employee and invoke its "substringData(offset,count)
  method with offset=10 and count=-3.  It should raise the
  desired exception since the count is negative.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  */
  characterdataindexsizeerrsubstringcountnegative : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrsubstringcountnegative") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var badSubstring;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        badSubstring = child.substringData(10,-3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throws_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "substringData(offset,count)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is negative. 

  Retrieve the character data of the last child of the
  first employee and invoke its "substringData(offset,count)
  method with offset=-5 and count=3.  It should raise the
  desired exception since the offset is negative.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  */
  characterdataindexsizeerrsubstringnegativeoffset : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrsubstringnegativeoffset") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var badString;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        badString = child.substringData(-5,3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throws_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "substringData(offset,count)" method raises an
  INDEX_SIZE_ERR DOMException if the specified offset
  is greater than the number of characters in the string.

  Retrieve the character data of the last child of the
  first employee and invoke its "substringData(offset,count)
  method with offset=40 and count=3.  It should raise the
  desired exception since the offsets value is greater
  than the length.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  characterdataindexsizeerrsubstringoffsetgreater : function () {
    var success;
    if(checkInitialization(builder, "characterdataindexsizeerrsubstringoffsetgreater") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var badString;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        badString = child.substringData(40,3);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 1);
      }
      assertTrue("throw_INDEX_SIZE_ERR",success);
    }

  },
  /**
  * 
  The "insertData(offset,arg)" method will insert a string
  at the specified character offset.  Insert the data at
  the beginning of the character data.

  Retrieve the character data from the second child of
  the first employee.  The "insertData(offset,arg)"
  method is then called with offset=0 and arg="Mss.".
  The method should insert the string "Mss." at position 0.
  The new value of the character data should be
  "Mss. Margaret Martin".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
  */
  characterdatainsertdatabeginning : function () {
    var success;
    if(checkInitialization(builder, "characterdatainsertdatabeginning") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(0,"Mss. ");
    childData = child.data;

    assertEquals("characterdataInsertDataBeginningAssert","Mss. Margaret Martin",childData);

  },
  /**
  * 
  The "insertData(offset,arg)" method will insert a string 
  at the specified character offset.  Insert the data at 
  the end of the character data. 

  Retrieve the character data from the second child of  
  the first employee.  The "insertData(offset,arg)"
  method is then called with offset=15 and arg=", Esquire".
  The method should insert the string ", Esquire" at 
  position 15.  The new value of the character data should
  be "Margaret Martin, Esquire".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
  */
  characterdatainsertdataend : function () {
    var success;
    if(checkInitialization(builder, "characterdatainsertdataend") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(15,", Esquire");
    childData = child.data;

    assertEquals("characterdataInsertDataEndAssert","Margaret Martin, Esquire",childData);

  },
  /**
  * 
  The "insertData(offset,arg)" method will insert a string 
  at the specified character offset.  Insert the data in 
  the middle of the character data. 

  Retrieve the character data from the second child of  
  the first employee.  The "insertData(offset,arg)"
  method is then called with offset=9 and arg="Ann".
  The method should insert the string "Ann" at position 9.
  The new value of the character data should be
  "Margaret Ann Martin".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
  */
  characterdatainsertdatamiddle : function () {
    var success;
    if(checkInitialization(builder, "characterdatainsertdatamiddle") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(9,"Ann ");
    childData = child.data;

    assertEquals("characterdataInsertDataMiddleAssert","Margaret Ann Martin",childData);

  },
  /**
  * 
  The "insertData(offset,arg)" method raises a NO_MODIFICATION_ALLOWED_ERR 
  DOMException if the node is readonly.   
  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Get the FIRST item 
  from the entity reference and execute the "insertData(offset,arg)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-3EDB695F')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
  */
  characterdatainsertdatanomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "characterdatainsertdatanomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entElement;
    var nodeType;
    var entElementContent;
    var entReference;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = genderNode.firstChild;

    assertNotNull("entReferenceNotNull",entReference);
    nodeType = entReference.nodeType;


    if(
      (1 == nodeType)
    ) {
      entReference = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",entReference);

    }
    entElement = entReference.firstChild;

    assertNotNull("entElementNotNull",entElement);
    entElementContent = entElement.firstChild;

    assertNotNull("entElementContentNotNull",entElementContent);

    {
      success = false;
      try {
        entElementContent.insertData(1,"newArg");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  Create an ent3 entity reference and call insertData on a text child, should thrown a NO_MODIFICATION_ALLOWED_ERR. 

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-3EDB695F')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/characterdatainsertdatanomodificationallowederr.xml
  */
  characterdatainsertdatanomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "characterdatainsertdatanomodificationallowederrEE") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entText;
    var entReference;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = doc.createEntityReference("ent3");
    assertNotNull("createdEntRefNotNull",entReference);
    entText = entReference.firstChild;

    assertNotNull("entTextNotNull",entText);

    {
      success = false;
      try {
        entText.insertData(1,"newArg");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method replaces the
  characters starting at the specified offset with the
  specified string.  Test for replacement in the
  middle of the data.

  Retrieve the character data from the last child of the
  first employee.  The "replaceData(offset,count,arg)"
  method is then called with offset=5 and count=5 and
  arg="South".  The method should replace characters five
  thru 9 of the character data with "South".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  */
  characterdatareplacedatabegining : function () {
    var success;
    if(checkInitialization(builder, "characterdatareplacedatabegining") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0,4,"2500");
    childData = child.data;

    assertEquals("characterdataReplaceDataBeginingAssert","2500 North Ave. Dallas, Texas 98551",childData);

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method replaces the 
  characters starting at the specified offset with the
  specified string.  Test for replacement at the 
  end of the data.

  Retrieve the character data from the last child of the
  first employee.  The "replaceData(offset,count,arg)"
  method is then called with offset=30 and count=5 and
  arg="98665".  The method should replace characters 30  
  thru 34 of the character data with "98665".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  */
  characterdatareplacedataend : function () {
    var success;
    if(checkInitialization(builder, "characterdatareplacedataend") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(30,5,"98665");
    childData = child.data;

    assertEquals("characterdataReplaceDataEndAssert","1230 North Ave. Dallas, Texas 98665",childData);

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method replaces the 
  characters starting at the specified offset with the
  specified string.  Test the situation where the length 
  of the arg string is greater than the specified offset.

  Retrieve the character data from the last child of the
  first employee.  The "replaceData(offset,count,arg)"
  method is then called with offset=0 and count=4 and
  arg="260030".  The method should replace characters one  
  thru four with "260030".  Note that the length of the
  specified string is greater that the specified offset.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  */
  characterdatareplacedataexceedslengthofarg : function () {
    var success;
    if(checkInitialization(builder, "characterdatareplacedataexceedslengthofarg") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0,4,"260030");
    childData = child.data;

    assertEquals("characterdataReplaceDataExceedsLengthOfArgAssert","260030 North Ave. Dallas, Texas 98551",childData);

  },
  /**
  * 
  If the sum of the offset and count exceeds the length then 
  all the characters to the end of the data are replaced.

  Retrieve the character data from the last child of the
  first employee.  The "replaceData(offset,count,arg)"
  method is then called with offset=0 and count=50 and
  arg="2600".  The method should replace all the characters
  with "2600". This is because the sum of the offset and
  count exceeds the length of the character data.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  */
  characterdatareplacedataexceedslengthofdata : function () {
    var success;
    if(checkInitialization(builder, "characterdatareplacedataexceedslengthofdata") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0,50,"2600");
    childData = child.data;

    assertEquals("characterdataReplaceDataExceedsLengthOfDataAssert","2600",childData);

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method replaces the 
  characters starting at the specified offset with the
  specified string.  Test for replacement in the 
  middle of the data.

  Retrieve the character data from the last child of the
  first employee.  The "replaceData(offset,count,arg)"
  method is then called with offset=5 and count=5 and
  arg="South".  The method should replace characters five  
  thru 9 of the character data with "South".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  */
  characterdatareplacedatamiddle : function () {
    var success;
    if(checkInitialization(builder, "characterdatareplacedatamiddle") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(5,5,"South");
    childData = child.data;

    assertEquals("characterdataReplaceDataMiddleAssert","1230 South Ave. Dallas, Texas 98551",childData);

  },
  /**
  * 
  The "replaceData(offset,count,arg)" method raises a NO_MODIFICATION_ALLOWED_ERR 
  DOMException if the node is readonly.

  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Get the FIRST item 
  from the entity reference and execute the "replaceData(offset,count,arg)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-E5CBA7FB')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  */
  characterdatareplacedatanomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "characterdatareplacedatanomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entElement;
    var entElementContent;
    var entReference;
    var nodeType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = genderNode.firstChild;

    assertNotNull("entReferenceNotNull",entReference);
    nodeType = entReference.nodeType;


    if(
      (1 == nodeType)
    ) {
      entReference = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",entReference);

    }
    entElement = entReference.firstChild;

    assertNotNull("entElementNotNull",entElement);
    entElementContent = entElement.firstChild;

    assertNotNull("entElementContentNotNull",entElementContent);

    {
      success = false;
      try {
        entElementContent.replaceData(1,3,"newArg");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  Create an ent3 entity reference and call replaceData on a text child, should thrown a NO_MODIFICATION_ALLOWED_ERR. 

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-E5CBA7FB')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/characterdatareplacedatanomodificationallowederr.xml
  */
  characterdatareplacedatanomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "characterdatareplacedatanomodificationallowederrEE") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entText;
    var entReference;
    var appendedNode;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = doc.createEntityReference("ent3");
    assertNotNull("createdEntRefNotNull",entReference);
    appendedNode = genderNode.appendChild(entReference);
    entText = entReference.firstChild;

    assertNotNull("entTextNotNull",entText);

    {
      success = false;
      try {
        entText.replaceData(1,3,"newArg");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "setData(data)" method raises a NO_MODIFICATION_ALLOWED_ERR 
  DOMException if the node is readonly.
  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Get the FIRST item 
  from the entity reference and execute the "setData(data)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-72AB8359')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  */
  characterdatasetdatanomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "characterdatasetdatanomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entElement;
    var entElementContent;
    var entReference;
    var nodeType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(2);
    entReference = genderNode.firstChild;

    assertNotNull("entReferenceNotNull",entReference);
    nodeType = entReference.nodeType;


    if(
      (1 == nodeType)
    ) {
      entReference = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",entReference);

    }
    entElement = entReference.firstChild;

    assertNotNull("entElementNotNull",entElement);
    entElementContent = entElement.firstChild;

    assertNotNull("entElementContentNotNull",entElementContent);

    {
      success = false;
      try {
        entElementContent.data = "newData";

      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  Create an ent3 entity reference and call setData on a text child, should thrown a NO_MODIFICATION_ALLOWED_ERR. 

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-72AB8359')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/characterdatasetdatanomodificationallowederr.xml
  */
  characterdatasetdatanomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "characterdatasetdatanomodificationallowederrEE") != null) return;
    var doc;
    var genderList;
    var genderNode;
    var entText;
    var entReference;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    genderNode = genderList.item(4);
    entReference = doc.createEntityReference("ent3");
    assertNotNull("createdEntRefNotNull",entReference);
    entText = entReference.firstChild;

    assertNotNull("entTextNotNull",entText);

    {
      success = false;
      try {
        entText.data = "newData";

      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "setNodeValue()" method changes the character data 
  currently stored in the node.
  Retrieve the character data from the second child 
  of the first employee and invoke the "setNodeValue()" 
  method, call "getData()" and compare.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
  */
  characterdatasetnodevalue : function () {
    var success;
    if(checkInitialization(builder, "characterdatasetnodevalue") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var childData;
    var childValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.nodeValue = "Marilyn Martin";

    childData = child.data;

    assertEquals("data","Marilyn Martin",childData);
    childValue = child.nodeValue;

    assertEquals("value","Marilyn Martin",childValue);

  },
  /**
  * 
  If the sum of the "offset" and "count" exceeds the
  "length" then the "substringData(offset,count)" method
  returns all the characters to the end of the data. 

  Retrieve the character data from the second child 
  of the first employee and access part of the data 
  by using the substringData(offset,count) method
  with offset=9 and count=10.  The method should return 
  the substring "Martin" since offset+count > length
  (19 > 15).

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
  */
  characterdatasubstringexceedsvalue : function () {
    var success;
    if(checkInitialization(builder, "characterdatasubstringexceedsvalue") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var substring;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    substring = child.substringData(9,10);
    assertEquals("characterdataSubStringExceedsValueAssert","Martin",substring);

  },
  /**
  * 
  The "substringData(offset,count)" method returns the 
  specified string.

  Retrieve the character data from the second child 
  of the first employee and access part of the data 
  by using the substringData(offset,count) method.  The
  method should return the specified substring starting 
  at position "offset" and extract "count" characters.
  The method should return the string "Margaret".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
  */
  characterdatasubstringvalue : function () {
    var success;
    if(checkInitialization(builder, "characterdatasubstringvalue") != null) return;
    var doc;
    var elementList;
    var nameNode;
    var child;
    var substring;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    substring = child.substringData(0,8);
    assertEquals("characterdataSubStringValueAssert","Margaret",substring);

  },
  /**
  * 
  A comment is all the characters between the starting
  '<!--' and ending '-->' 
  Retrieve the nodes of the DOM document.  Search for a 
  comment node and the content is its value.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1334481328
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
  */
  commentgetcomment : function () {
    var success;
    if(checkInitialization(builder, "commentgetcomment") != null) return;
    var doc;
    var elementList;
    var child;
    var childName;
    var childValue;
    var commentCount = 0;
    var childType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.childNodes;

    for(var indexN10057 = 0;indexN10057 < elementList.length; indexN10057++) {
      child = elementList.item(indexN10057);
      childType = child.nodeType;


      if(
        (8 == childType)
      ) {
        childName = child.nodeName;

        assertEquals("nodeName","#comment",childName);
        childValue = child.nodeValue;

        assertEquals("nodeValue"," This is comment number 1.",childValue);
        commentCount = commentCount + 1;

      }

    }
    assertEquals("commentCount",1,commentCount);

  },
  /**
  * 
  The "createAttribute(name)" method creates an Attribute 
  node of the given name.

  Retrieve the entire DOM document and invoke its 
  "createAttribute(name)" method.  It should create a  
  new Attribute node with the given name. The name, value
  and type of the newly created object are retrieved and
  output.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  */
  documentcreateattribute : function () {
    var success;
    if(checkInitialization(builder, "documentcreateattribute") != null) return;
    var doc;
    var newAttrNode;
    var attrValue;
    var attrName;
    var attrType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newAttrNode = doc.createAttribute("district");
    attrValue = newAttrNode.nodeValue;

    assertEquals("value","",attrValue);
    attrName = newAttrNode.nodeName;

    assertEquals("name","district",attrName);
    attrType = newAttrNode.nodeType;

    assertEquals("type",2,attrType);

  },
  /**
  * 
  The "createCDATASection(data)" method creates a new 
  CDATASection node whose value is the specified string.
  Retrieve the entire DOM document and invoke its 
  "createCDATASection(data)" method.  It should create a
  new CDATASection node whose "data" is the specified 
  string.  The content, name and type are retrieved and
  output.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D26C0AF8
  */
  documentcreatecdatasection : function () {
    var success;
    if(checkInitialization(builder, "documentcreatecdatasection") != null) return;
    var doc;
    var newCDATASectionNode;
    var newCDATASectionValue;
    var newCDATASectionName;
    var newCDATASectionType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newCDATASectionNode = doc.createCDATASection("This is a new CDATASection node");
    newCDATASectionValue = newCDATASectionNode.nodeValue;

    assertEquals("nodeValue","This is a new CDATASection node",newCDATASectionValue);
    newCDATASectionName = newCDATASectionNode.nodeName;

    assertEquals("nodeName","#cdata-section",newCDATASectionName);
    newCDATASectionType = newCDATASectionNode.nodeType;

    assertEquals("nodeType",4,newCDATASectionType);

  },
  /**
  * 
  The "createComment(data)" method creates a new Comment
  node given the specified string. 
  Retrieve the entire DOM document and invoke its 
  "createComment(data)" method.  It should create a new
  Comment node whose "data" is the specified string.
  The content, name and type are retrieved and output.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1334481328
  */
  documentcreatecomment : function () {
    var success;
    if(checkInitialization(builder, "documentcreatecomment") != null) return;
    var doc;
    var newCommentNode;
    var newCommentValue;
    var newCommentName;
    var newCommentType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newCommentNode = doc.createComment("This is a new Comment node");
    newCommentValue = newCommentNode.nodeValue;

    assertEquals("value","This is a new Comment node",newCommentValue);
    newCommentName = newCommentNode.nodeName;

    assertEquals("name","#comment",newCommentName);
    newCommentType = newCommentNode.nodeType;

    assertEquals("type",8,newCommentType);

  },
  /**
  * 
  The "createDocumentFragment()" method creates an empty 
  DocumentFragment object.
  Retrieve the entire DOM document and invoke its 
  "createDocumentFragment()" method.  The content, name, 
  type and value of the newly created object are output.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-35CB04B5
  */
  documentcreatedocumentfragment : function () {
    var success;
    if(checkInitialization(builder, "documentcreatedocumentfragment") != null) return;
    var doc;
    var newDocFragment;
    var children;
    var length;
    var newDocFragmentName;
    var newDocFragmentType;
    var newDocFragmentValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newDocFragment = doc.createDocumentFragment();
    children = newDocFragment.childNodes;

    length = children.length;

    assertEquals("length",0,length);
    newDocFragmentName = newDocFragment.nodeName;

    assertEquals("name","#document-fragment",newDocFragmentName);
    newDocFragmentType = newDocFragment.nodeType;

    assertEquals("type",11,newDocFragmentType);
    newDocFragmentValue = newDocFragment.nodeValue;

    assertNull("value",newDocFragmentValue);

  },
  /**
  * 
  The "createElement(tagName)" method creates an Element 
  of the type specified.
  Retrieve the entire DOM document and invoke its 
  "createElement(tagName)" method with tagName="address".
  The method should create an instance of an Element node
  whose tagName is "address".  The NodeName, NodeType 
  and NodeValue are returned.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  */
  documentcreateelement : function () {
    var success;
    if(checkInitialization(builder, "documentcreateelement") != null) return;
    var doc;
    var newElement;
    var newElementName;
    var newElementType;
    var newElementValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newElement = doc.createElement("address");
    newElementName = newElement.nodeName;

    assertEquals("name","address",newElementName);
    newElementType = newElement.nodeType;

    assertEquals("type",1,newElementType);
    newElementValue = newElement.nodeValue;

    assertNull("valueInitiallyNull",newElementValue);

  },
  /**
  * 
  The tagName parameter in the "createElement(tagName)"
  method is case-sensitive for XML documents.
  Retrieve the entire DOM document and invoke its 
  "createElement(tagName)" method twice.  Once for tagName
  equal to "address" and once for tagName equal to "ADDRESS"
  Each call should create a distinct Element node.  The
  newly created Elements are then assigned attributes 
  that are retrieved.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  */
  documentcreateelementcasesensitive : function () {
    var success;
    if(checkInitialization(builder, "documentcreateelementcasesensitive") != null) return;
    var doc;
    var newElement1;
    var newElement2;
    var attribute1;
    var attribute2;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newElement1 = doc.createElement("ADDRESS");
    newElement2 = doc.createElement("address");
    newElement1.setAttribute("district","Fort Worth");
    newElement2.setAttribute("county","Dallas");
    attribute1 = newElement1.getAttribute("district");

    attribute2 = newElement2.getAttribute("county");
    assertEquals("attrib1","Fort Worth",attribute1);
    assertEquals("attrib2","Dallas",attribute2);

  },
  /**
  * 
  The "createElement(tagName)" method creates an Element 
  of the type specified.  In addition, if there are known attributes
  with default values, Attr nodes representing them are automatically
  created and attached to the element.
  Retrieve the entire DOM document and invoke its 
  "createElement(tagName)" method with tagName="address".
  The method should create an instance of an Element node
  whose tagName is "address".  The tagName "address" has an 
  attribute with default values, therefore the newly created element
  will have them.  

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
  */
  documentcreateelementdefaultattr : function () {
    var success;
    if(checkInitialization(builder, "documentcreateelementdefaultattr") != null) return;
    var doc;
    var newElement;
    var defaultAttr;
    var child;
    var name;
    var value;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newElement = doc.createElement("address");
    defaultAttr = newElement.attributes;

    child = defaultAttr.item(0);
    assertNotNull("defaultAttrNotNull",child);
    name = child.nodeName;

    assertEquals("attrName","street",name);
    value = child.nodeValue;

    assertEquals("attrValue","Yes",value);
    assertSize("attrCount",1,defaultAttr);

  },
  /**
  * 
  The "createEntityReference(name)" method creates an 
  EntityReferrence node.

  Retrieve the entire DOM document and invoke its 
  "createEntityReference(name)" method.  It should create 
  a new EntityReference node for the Entity with the 
  given name.  The name, value and type are retrieved and
  output.

  * @author NIST
  * @author Mary Brady
  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-392B75AE
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
  */
  documentcreateentityreference : function () {
    var success;
    if(checkInitialization(builder, "documentcreateentityreference") != null) return;
    var doc;
    var newEntRefNode;
    var entRefValue;
    var entRefName;
    var entRefType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newEntRefNode = doc.createEntityReference("ent1");
    assertNotNull("createdEntRefNotNull",newEntRefNode);
    entRefValue = newEntRefNode.nodeValue;

    assertNull("value",entRefValue);
    entRefName = newEntRefNode.nodeName;

    assertEquals("name","ent1",entRefName);
    entRefType = newEntRefNode.nodeType;

    assertEquals("type",5,entRefType);

  },
  /**
  * 
  The "createEntityReference(name)" method creates an 
  EntityReference node.  In addition, if the referenced entity
  is known, the child list of the "EntityReference" node
  is the same as the corresponding "Entity" node.

  Retrieve the entire DOM document and invoke its 
  "createEntityReference(name)" method.  It should create 
  a new EntityReference node for the Entity with the 
  given name.  The referenced entity is known, therefore the child
  list of the "EntityReference" node is the same as the corresponding
  "Entity" node.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-392B75AE
  */
  documentcreateentityreferenceknown : function () {
    var success;
    if(checkInitialization(builder, "documentcreateentityreferenceknown") != null) return;
    var doc;
    var newEntRefNode;
    var newEntRefList;
    var child;
    var name;
    var value;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newEntRefNode = doc.createEntityReference("ent3");
    assertNotNull("createdEntRefNotNull",newEntRefNode);
    newEntRefList = newEntRefNode.childNodes;

    assertSize("size",1,newEntRefList);
    child = newEntRefNode.firstChild;

    name = child.nodeName;

    assertEquals("name","#text",name);
    value = child.nodeValue;

    assertEquals("value","Texas",value);

  },
  /**
  * 
  The "createProcessingInstruction(target,data)" method 
  creates a new ProcessingInstruction node with the
  specified name and data string.

  Retrieve the entire DOM document and invoke its 
  "createProcessingInstruction(target,data)" method.  
  It should create a new PI node with the specified target 
  and data.  The target, data and type are retrieved and
  output.

  * @author NIST
  * @author Mary Brady
  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2001Apr/0020.html
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-135944439
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  documentcreateprocessinginstruction : function () {
    var success;
    if(checkInitialization(builder, "documentcreateprocessinginstruction") != null) return;
    var doc;
    var newPINode;
    var piValue;
    var piName;
    var piType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newPINode = doc.createProcessingInstruction("TESTPI","This is a new PI node");
    assertNotNull("createdPINotNull",newPINode);
    piName = newPINode.nodeName;

    assertEquals("name","TESTPI",piName);
    piValue = newPINode.nodeValue;

    assertEquals("value","This is a new PI node",piValue);
    piType = newPINode.nodeType;

    assertEquals("type",7,piType);

  },
  /**
  * 
  The "createTextNode(data)" method creates a Text node 
  given the specfied string.
  Retrieve the entire DOM document and invoke its 
  "createTextNode(data)" method.  It should create a 
  new Text node whose "data" is the specified string.
  The NodeName and NodeType are also checked.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1975348127
  */
  documentcreatetextnode : function () {
    var success;
    if(checkInitialization(builder, "documentcreatetextnode") != null) return;
    var doc;
    var newTextNode;
    var newTextName;
    var newTextValue;
    var newTextType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newTextNode = doc.createTextNode("This is a new Text node");
    newTextValue = newTextNode.nodeValue;

    assertEquals("value","This is a new Text node",newTextValue);
    newTextName = newTextNode.nodeName;

    assertEquals("name","#text",newTextName);
    newTextType = newTextNode.nodeType;

    assertEquals("type",3,newTextType);

  },
  /**
  * 
  The "getDoctype()" method returns the Document 
  Type Declaration associated with this document.
  Retrieve the entire DOM document and invoke its 
  "getDoctype()" method.  The name of the document
  type should be returned.  The "getName()" method
  should be equal to "staff" or "svg".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  documentgetdoctype : function () {
    var success;
    if(checkInitialization(builder, "documentgetdoctype") != null) return;
    var doc;
    var docType;
    var docTypeName;
    var nodeValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docType = doc.doctype;

    assertNotNull("docTypeNotNull",docType);
    docTypeName = docType.name;


    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertEquals("doctypeNameSVG","svg",docTypeName);

    }

    else {
      assertEquals("doctypeName","staff",docTypeName);

    }
    nodeValue = docType.nodeValue;

    assertNull("initiallyNull",nodeValue);

  },
  /**
  * 
  The "getDoctype()" method returns null for XML documents
  without a document type declaration.
  Retrieve the XML document without a DTD and invoke the 
  "getDoctype()" method.  It should return null. 

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
  */
  documentgetdoctypenodtd : function () {
    var success;
    if(checkInitialization(builder, "documentgetdoctypenodtd") != null) return;
    var doc;
    var docType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_nodtdstaff");
    docType = doc.doctype;

    assertNull("documentGetDocTypeNoDTDAssert",docType);

  },
  /**
  * 
  The "getElementsByTagName(tagName)" method returns a 
  NodeList of all the Elements with a given tagName.

  Retrieve the entire DOM document and invoke its 
  "getElementsByTagName(tagName)" method with tagName
  equal to "name".  The method should return a NodeList 
  that contains 5 elements.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-A6C9094
  */
  documentgetelementsbytagnamelength : function () {
    var success;
    if(checkInitialization(builder, "documentgetelementsbytagnamelength") != null) return;
    var doc;
    var nameList;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    nameList = doc.getElementsByTagName("name");
    assertSize("documentGetElementsByTagNameLengthAssert",5,nameList);

  },
  /**
  * 
  Retrieve the entire DOM document, invoke
  getElementsByTagName("*") and check the length of the NodeList. 

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-A6C9094
  */
  documentgetelementsbytagnametotallength : function () {
    var success;
    if(checkInitialization(builder, "documentgetelementsbytagnametotallength") != null) return;
    var doc;
    var nameList;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    nameList = doc.getElementsByTagName("*");

    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertSize("elementCountSVG",39,nameList);

    }

    else {
      assertSize("documentGetElementsByTagNameTotalLengthAssert",37,nameList);

    }

  },
  /**
  * 
  The "getElementsByTagName(tagName)" method returns a 
  NodeList of all the Elements with a given tagName
  in a pre-order traversal of the tree.

  Retrieve the entire DOM document and invoke its 
  "getElementsByTagName(tagName)" method with tagName
  equal to "name".  The method should return a NodeList 
  that contains 5 elements.  The FOURTH item in the
  list is retrieved and output.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-A6C9094
  */
  documentgetelementsbytagnamevalue : function () {
    var success;
    if(checkInitialization(builder, "documentgetelementsbytagnamevalue") != null) return;
    var doc;
    var nameList;
    var nameNode;
    var firstChild;
    var childValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    nameList = doc.getElementsByTagName("name");
    nameNode = nameList.item(3);
    firstChild = nameNode.firstChild;

    childValue = firstChild.nodeValue;

    assertEquals("documentGetElementsByTagNameValueAssert","Jeny Oconnor",childValue);

  },
  /**
  * 
  The "getImplementation()" method returns the 
  DOMImplementation object that handles this document. 
  Retrieve the entire DOM document and invoke its 
  "getImplementation()" method.  It should return a 
  DOMImplementation whose "hasFeature("XML","1.0")
  method returns the boolean value "true".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1B793EBA
  */
  documentgetimplementation : function () {
    var success;
    if(checkInitialization(builder, "documentgetimplementation") != null) return;
    var doc;
    var docImpl;
    var state;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docImpl = doc.implementation;
    state = docImpl.hasFeature("XML","1.0");
    assertTrue("documentGetImplementationAssert",state);

  },
  /**
  * 
  The "getDocumentElement()" method provides direct access 
  to the child node that is the root element of the document.
  Retrieve the entire DOM document and invoke its 
  "getDocumentElement()" method.  It should return an
  Element node whose NodeName is "staff" (or "svg").

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-87CD092
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
  */
  documentgetrootnode : function () {
    var success;
    if(checkInitialization(builder, "documentgetrootnode") != null) return;
    var doc;
    var root;
    var rootName;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    root = doc.documentElement;

    rootName = root.nodeName;


    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertEquals("svgRootNode","svg",rootName);

    }

    else {
      assertEquals("documentGetRootNodeAssert","staff",rootName);

    }

  },
  /**
  * 
  The "createAttribute(tagName)" method raises an
  INVALID_CHARACTER_ERR DOMException if the specified
  tagName contains an invalid character. 

  Retrieve the entire DOM document and invoke its 
  "createAttribute(tagName)" method with the tagName equal
  to the string "invalid^Name".  Due to the invalid 
  character the desired EXCEPTION should be raised.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1084891198')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  documentinvalidcharacterexceptioncreateattribute : function () {
    var success;
    if(checkInitialization(builder, "documentinvalidcharacterexceptioncreateattribute") != null) return;
    var doc;
    var createdAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");

    {
      success = false;
      try {
        createdAttr = doc.createAttribute("invalid^Name");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 5);
      }
      assertTrue("throw_INVALID_CHARACTER_ERR",success);
    }

  },
  /**
  * 
  The "createElement(tagName)" method raises an
  INVALID_CHARACTER_ERR DOMException if the specified
  tagName contains an invalid character. 

  Retrieve the entire DOM document and invoke its 
  "createElement(tagName)" method with the tagName equal
  to the string "invalid^Name".  Due to the invalid 
  character the desired EXCEPTION should be raised.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-2141741547')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  documentinvalidcharacterexceptioncreateelement : function () {
    var success;
    if(checkInitialization(builder, "documentinvalidcharacterexceptioncreateelement") != null) return;
    var doc;
    var badElement;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");

    {
      success = false;
      try {
        badElement = doc.createElement("invalid^Name");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 5);
      }
      assertTrue("throw_INVALID_CHARACTER_ERR",success);
    }

  },
  /**
  * 
  The "createEntityReference(tagName)" method raises an
  INVALID_CHARACTER_ERR DOMException if the specified
  tagName contains an invalid character. 

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-392B75AE
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-392B75AE')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  documentinvalidcharacterexceptioncreateentref : function () {
    var success;
    if(checkInitialization(builder, "documentinvalidcharacterexceptioncreateentref") != null) return;
    var doc;
    var badEntityRef;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    if(

      (builder.contentType == "text/html")

    ) {

      {
        success = false;
        try {
          badEntityRef = doc.createEntityReference("foo");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 9);
        }
        assertTrue("throw_NOT_SUPPORTED_ERR",success);
      }

    }

    else {

      {
        success = false;
        try {
          badEntityRef = doc.createEntityReference("invalid^Name");
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
  Creating an entity reference with an empty name should cause an INVALID_CHARACTER_ERR.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-392B75AE
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-392B75AE')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
  */
  documentinvalidcharacterexceptioncreateentref1 : function () {
    var success;
    if(checkInitialization(builder, "documentinvalidcharacterexceptioncreateentref1") != null) return;
    var doc;
    var badEntityRef;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    if(

      (builder.contentType == "text/html")

    ) {

      {
        success = false;
        try {
          badEntityRef = doc.createEntityReference("foo");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 9);
        }
        assertTrue("throw_NOT_SUPPORTED_ERR",success);
      }

    }

    else {

      {
        success = false;
        try {
          badEntityRef = doc.createEntityReference("");
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
  The "createProcessingInstruction(target,data) method 
  raises an INVALID_CHARACTER_ERR DOMException if the
  specified tagName contains an invalid character. 

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-135944439
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-135944439')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  documentinvalidcharacterexceptioncreatepi : function () {
    var success;
    if(checkInitialization(builder, "documentinvalidcharacterexceptioncreatepi") != null) return;
    var doc;
    var badPI;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    if(

      (builder.contentType == "text/html")

    ) {

      {
        success = false;
        try {
          badPI = doc.createProcessingInstruction("foo","data");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 9);
        }
        assertTrue("throw_NOT_SUPPORTED_ERR",success);
      }

    }

    else {

      {
        success = false;
        try {
          badPI = doc.createProcessingInstruction("invalid^Name","data");
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
  Creating a processing instruction with an empty target should cause an INVALID_CHARACTER_ERR.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-135944439
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-135944439')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
  */
  documentinvalidcharacterexceptioncreatepi1 : function () {
    var success;
    if(checkInitialization(builder, "documentinvalidcharacterexceptioncreatepi1") != null) return;
    var doc;
    var badPI;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    if(

      (builder.contentType == "text/html")

    ) {

      {
        success = false;
        try {
          badPI = doc.createProcessingInstruction("foo","data");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 9);
        }
        assertTrue("throw_NOT_SUPPORTED_ERR",success);
      }

    }

    else {

      {
        success = false;
        try {
          badPI = doc.createProcessingInstruction("","data");
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
  The "getName()" method contains the name of the DTD. 

  Retrieve the Document Type for this document and examine
  the string returned by the "getName()" method.
  It should be set to "staff".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1844763134
  */
  documenttypegetdoctype : function () {
    var success;
    if(checkInitialization(builder, "documenttypegetdoctype") != null) return;
    var doc;
    var docType;
    var name;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docType = doc.doctype;

    assertNotNull("docTypeNotNull",docType);
    name = docType.name;


    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertEquals("doctypeName","svg",name);

    }

    else {
      assertEquals("documenttypeGetDocTypeAssert","staff",name);

    }

  },
  /**
  * 
  The "getEntities()" method is a NamedNodeMap that contains
  the general entities for this document. 

  Retrieve the Document Type for this document and create 
  a NamedNodeMap of all its entities.  The entire map is
  traversed and the names of the entities are retrieved.
  There should be 5 entities.  Duplicates should be ignored.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1788794630
  */
  documenttypegetentities : function () {
    var success;
    if(checkInitialization(builder, "documenttypegetentities") != null) return;
    var doc;
    var docType;
    var entityList;
    var name;
    expectedResult = new Array();
    expectedResult[0] = "ent1";
    expectedResult[1] = "ent2";
    expectedResult[2] = "ent3";
    expectedResult[3] = "ent4";
    expectedResult[4] = "ent5";

    expectedResultSVG = new Array();
    expectedResultSVG[0] = "ent1";
    expectedResultSVG[1] = "ent2";
    expectedResultSVG[2] = "ent3";
    expectedResultSVG[3] = "ent4";
    expectedResultSVG[4] = "ent5";
    expectedResultSVG[5] = "svgunit";
    expectedResultSVG[6] = "svgtest";

    var nameList = new Array();

    var entity;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docType = doc.doctype;

    assertNotNull("docTypeNotNull",docType);
    entityList = docType.entities;

    assertNotNull("entitiesNotNull",entityList);
    for(var indexN1007B = 0;indexN1007B < entityList.length; indexN1007B++) {
      entity = entityList.item(indexN1007B);
      name = entity.nodeName;

      nameList[nameList.length] = name;

    }

    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertEqualsCollection("entityNamesSVG",expectedResultSVG,nameList);

    }

    else {
      assertEqualsCollection("entityNames",expectedResult,nameList);

    }

  },
  /**
  * 
  Duplicate entities are to be discarded. 
  Retrieve the Document Type for this document and create 
  a NamedNodeMap of all its entities.  The entity named 
  "ent1" is defined twice and therefore that last 
  occurrance should be discarded.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1788794630
  */
  documenttypegetentitieslength : function () {
    var success;
    if(checkInitialization(builder, "documenttypegetentitieslength") != null) return;
    var doc;
    var docType;
    var entityList;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docType = doc.doctype;

    assertNotNull("docTypeNotNull",docType);
    entityList = docType.entities;

    assertNotNull("entitiesNotNull",entityList);

    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertSize("entitySizeSVG",7,entityList);

    }

    else {
      assertSize("entitySize",5,entityList);

    }

  },
  /**
  * 
  Every node in the map returned by the "getEntities()"
  method implements the Entity interface.

  Retrieve the Document Type for this document and create 
  a NamedNodeMap of all its entities.  Traverse the 
  entire list and examine the NodeType of each node
  in the list.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1788794630
  */
  documenttypegetentitiestype : function () {
    var success;
    if(checkInitialization(builder, "documenttypegetentitiestype") != null) return;
    var doc;
    var docType;
    var entityList;
    var entity;
    var entityType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docType = doc.doctype;

    assertNotNull("docTypeNotNull",docType);
    entityList = docType.entities;

    assertNotNull("entitiesNotNull",entityList);
    for(var indexN10049 = 0;indexN10049 < entityList.length; indexN10049++) {
      entity = entityList.item(indexN10049);
      entityType = entity.nodeType;

      assertEquals("documenttypeGetEntitiesTypeAssert",6,entityType);

    }

  },
  /**
  * 
  The "getNotations()" method creates a NamedNodeMap that   
  contains all the notations declared in the DTD.

  Retrieve the Document Type for this document and create
  a NamedNodeMap object of all the notations.  There
  should be two items in the list (notation1 and notation2).

  * @author NIST
  * @author Mary Brady
  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D46829EF
  */
  documenttypegetnotations : function () {
    var success;
    if(checkInitialization(builder, "documenttypegetnotations") != null) return;
    var doc;
    var docType;
    var notationList;
    var notation;
    var notationName;
    var actual = new Array();

    expected = new Array();
    expected[0] = "notation1";
    expected[1] = "notation2";


    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docType = doc.doctype;

    assertNotNull("docTypeNotNull",docType);
    notationList = docType.notations;

    assertNotNull("notationsNotNull",notationList);
    for(var indexN1005B = 0;indexN1005B < notationList.length; indexN1005B++) {
      notation = notationList.item(indexN1005B);
      notationName = notation.nodeName;

      actual[actual.length] = notationName;

    }
    assertEqualsCollection("names",expected,actual);

  },
  /**
  * 
  Every node in the map returned by the "getNotations()"
  method implements the Notation interface.

  Retrieve the Document Type for this document and create
  a NamedNodeMap object of all the notations.  Traverse
  the entire list and examine the NodeType of each node.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D46829EF
  */
  documenttypegetnotationstype : function () {
    var success;
    if(checkInitialization(builder, "documenttypegetnotationstype") != null) return;
    var doc;
    var docType;
    var notationList;
    var notation;
    var notationType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    docType = doc.doctype;

    assertNotNull("docTypeNotNull",docType);
    notationList = docType.notations;

    assertNotNull("notationsNotNull",notationList);
    for(var indexN10049 = 0;indexN10049 < notationList.length; indexN10049++) {
      notation = notationList.item(indexN10049);
      notationType = notation.nodeType;

      assertEquals("documenttypeGetNotationsTypeAssert",12,notationType);

    }

  },
  /**
  * 
  hasFeature("XML", "") should return true for implementations that can read staff files.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
  * @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
  */
  domimplementationfeaturenoversion : function () {
    var success;
    if(checkInitialization(builder, "domimplementationfeaturenoversion") != null) return;
    var doc;
    var domImpl;
    var state;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    domImpl = doc.implementation;
    state = domImpl.hasFeature("XML","");
    assertTrue("hasXMLEmpty",state);

  },
  /**
  * 
  hasFeature("XML", null) should return true for implementations that can read staff documents.

  * @author NIST
  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
  * @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
  */
  domimplementationfeaturenull : function () {
    var success;
    if(checkInitialization(builder, "domimplementationfeaturenull") != null) return;
    var doc;
    var domImpl;
    var state;
    var nullVersion = null;


    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    domImpl = doc.implementation;
    state = domImpl.hasFeature("XML",nullVersion);
    assertTrue("hasXMLnull",state);

  },
  /**
  * 
  hasFeature("xml", "1.0") should return true for implementations that can read staff documents.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
  */
  domimplementationfeaturexml : function () {
    var success;
    if(checkInitialization(builder, "domimplementationfeaturexml") != null) return;
    var doc;
    var domImpl;
    var state;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    domImpl = doc.implementation;
    state = domImpl.hasFeature("xml","1.0");
    assertTrue("hasXML1",state);

  },
  /**
  * 
  The "setAttribute(name,value)" method adds a new attribute
  to the Element 

  Retrieve the last child of the last employee, then 
  add an attribute to it by invoking the             
  "setAttribute(name,value)" method.  It should create
  a "name" attribute with an assigned value equal to 
  "value".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
  */
  elementaddnewattribute : function () {
    var success;
    if(checkInitialization(builder, "elementaddnewattribute") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var attrValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(4);
    testEmployee.setAttribute("district","dallas");
    attrValue = testEmployee.getAttribute("district");
    assertEquals("elementAddNewAttributeAssert","dallas",attrValue);

  },
  /**
  * 
  Elements may have attributes associated with them.

  Retrieve the first attribute from the last child of
  the first employee and invoke the "getSpecified()" 
  method.  This test is only intended to show that   
  Elements can actually have attributes.  This test uses  
  the "getNamedItem(name)" method from the NamedNodeMap
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
  */
  elementassociatedattribute : function () {
    var success;
    if(checkInitialization(builder, "elementassociatedattribute") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var attributes;
    var domesticAttr;
    var specified;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(0);
    attributes = testEmployee.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    specified = domesticAttr.specified;

    assertTrue("domesticSpecified",specified);

  },
  /**
  * 
  The "setAttribute(name,value)" method adds a new attribute
  to the Element.  If the "name" is already present, then
  its value should be changed to the new one that is in
  the "value" parameter. 

  Retrieve the last child of the fourth employee, then add 
  an attribute to it by invoking the 
  "setAttribute(name,value)" method.  Since the name of the
  used attribute("street") is already present in this     
  element, then its value should be changed to the new one
  of the "value" parameter.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
  */
  elementchangeattributevalue : function () {
    var success;
    if(checkInitialization(builder, "elementchangeattributevalue") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var attrValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(3);
    testEmployee.setAttribute("street","Neither");
    attrValue = testEmployee.getAttribute("street");
    assertEquals("elementChangeAttributeValueAssert","Neither",attrValue);

  },
  /**
  * 
  The "setAttributeNode(newAttr)" method adds a new 
  attribute to the Element.  

  Retrieve first address element and add
  a new attribute node to it by invoking its         
  "setAttributeNode(newAttr)" method.  This test makes use
  of the "createAttribute(name)" method from the Document
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
  */
  elementcreatenewattribute : function () {
    var success;
    if(checkInitialization(builder, "elementcreatenewattribute") != null) return;
    var doc;
    var elementList;
    var testAddress;
    var newAttribute;
    var oldAttr;
    var districtAttr;
    var attrVal;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(0);
    newAttribute = doc.createAttribute("district");
    oldAttr = testAddress.setAttributeNode(newAttribute);
    assertNull("old_attr_doesnt_exist",oldAttr);
    districtAttr = testAddress.getAttributeNode("district");
    assertNotNull("new_district_accessible",districtAttr);
    attrVal = testAddress.getAttribute("district");
    assertEquals("attr_value","",attrVal);

  },
  /**
  * 
  The "getAttributeNode(name)" method retrieves an
  attribute node by name.

  Retrieve the attribute "domestic" from the last child
  of the first employee.  Since the method returns an
  Attr object, the "name" can be examined to ensure the
  proper attribute was retrieved.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-217A91B8
  */
  elementgetattributenode : function () {
    var success;
    if(checkInitialization(builder, "elementgetattributenode") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var domesticAttr;
    var name;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(0);
    domesticAttr = testEmployee.getAttributeNode("domestic");
    name = domesticAttr.nodeName;

    assertEquals("elementGetAttributeNodeAssert","domestic",name);

  },
  /**
  * 
  The "getAttributeNode(name)" method retrieves an
  attribute node by name.  It should return null if the
  "name" attribute does not exist.

  Retrieve the last child of the first employee and attempt
  to retrieve a non-existing attribute.  The method should
  return "null".  The non-existing attribute to be used
  is "invalidAttribute".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-217A91B8
  */
  elementgetattributenodenull : function () {
    var success;
    if(checkInitialization(builder, "elementgetattributenodenull") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var domesticAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(0);
    domesticAttr = testEmployee.getAttributeNode("invalidAttribute");
    assertNull("elementGetAttributeNodeNullAssert",domesticAttr);

  },
  /**
  * 
  The "getAttribute(name)" method returns an empty 
  string if no value was assigned to an attribute and 
  no default value was given in the DTD file.

  Retrieve the last child of the last employee, then
  invoke "getAttribute(name)" method, where "name" is an
  attribute without a specified or DTD default value. 
  The "getAttribute(name)" method should return the empty
  string.  This method makes use of the
  "createAttribute(newAttr)" method from the Document
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-666EE0F9
  */
  elementgetelementempty : function () {
    var success;
    if(checkInitialization(builder, "elementgetelementempty") != null) return;
    var doc;
    var newAttribute;
    var elementList;
    var testEmployee;
    var domesticAttr;
    var attrValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    newAttribute = doc.createAttribute("district");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(3);
    domesticAttr = testEmployee.setAttributeNode(newAttribute);
    attrValue = testEmployee.getAttribute("district");
    assertEquals("elementGetElementEmptyAssert","",attrValue);

  },
  /**
  * 
  The "getElementsByTagName(name)" method returns a list
  of all descendant Elements with the given tag name.
  Test for an empty list.

  Create a NodeList of all the descendant elements
  using the string "noMatch" as the tagName.
  The method should return a NodeList whose length is
  "0" since there are not any descendant elements
  that match the given tag name.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
  */
  elementgetelementsbytagname : function () {
    var success;
    if(checkInitialization(builder, "elementgetelementsbytagname") != null) return;
    var doc;
    var elementList;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("employee");
    assertSize("elementGetElementsByTagNameAssert",5,elementList);

  },
  /**
  * 
  Element.getElementsByTagName("employee") should return a NodeList whose length is
  "5" in the order the children were encountered.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
  */
  elementgetelementsbytagnameaccessnodelist : function () {
    var success;
    if(checkInitialization(builder, "elementgetelementsbytagnameaccessnodelist") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var child;
    var childName;
    var childValue;
    var childType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("employee");
    testEmployee = elementList.item(3);
    child = testEmployee.firstChild;

    childType = child.nodeType;


    if(
      (3 == childType)
    ) {
      child = child.nextSibling;


    }
    childName = child.nodeName;

    assertEquals("nodename","employeeId",childName);
    child = child.firstChild;

    childValue = child.nodeValue;

    assertEquals("emp0004","EMP0004",childValue);

  },
  /**
  * 
  The "getElementsByTagName(name)" method returns a list
  of all descendant Elements with the given tag name.

  Create a NodeList of all the descendant elements
  using the string "employee" as the tagName.
  The method should return a NodeList whose length is
  "5".

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
  */
  elementgetelementsbytagnamenomatch : function () {
    var success;
    if(checkInitialization(builder, "elementgetelementsbytagnamenomatch") != null) return;
    var doc;
    var elementList;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("noMatch");
    assertSize("elementGetElementsByTagNameNoMatchNoMatchAssert",0,elementList);

  },
  /**
  * 
  The "getElementsByTagName(name)" method may use the
  special value "*" to match all tags in the element
  tree.

  Create a NodeList of all the descendant elements
  of the last employee by using the special value "*".
  The method should return all the descendant children(6)
  in the order the children were encountered.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
  */
  elementgetelementsbytagnamespecialvalue : function () {
    var success;
    if(checkInitialization(builder, "elementgetelementsbytagnamespecialvalue") != null) return;
    var doc;
    var elementList;
    var lastEmployee;
    var lastempList;
    var child;
    var childName;
    var result = new Array();

    expectedResult = new Array();
    expectedResult[0] = "employeeId";
    expectedResult[1] = "name";
    expectedResult[2] = "position";
    expectedResult[3] = "salary";
    expectedResult[4] = "gender";
    expectedResult[5] = "address";


    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("employee");
    lastEmployee = elementList.item(4);
    lastempList = lastEmployee.getElementsByTagName("*");
    for(var indexN1006A = 0;indexN1006A < lastempList.length; indexN1006A++) {
      child = lastempList.item(indexN1006A);
      childName = child.nodeName;

      result[result.length] = childName;

    }
    assertEqualsList("tagNames",expectedResult,result);

  },
  /**
  * 

  The "getTagName()" method returns the 

  tagName of an element.    



  Invoke the "getTagName()" method one the 

  root node. The value returned should be "staff". 


  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-104682815
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
  */
  elementgettagname : function () {
    var success;
    if(checkInitialization(builder, "elementgettagname") != null) return;
    var doc;
    var root;
    var tagname;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    root = doc.documentElement;

    tagname = root.tagName;


    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertEquals("svgTagName","svg",tagname);

    }

    else {
      assertEquals("elementGetTagNameAssert","staff",tagname);

    }

  },
  /**
  * 
  The "setAttributeNode(newAttr)" method raises an 
  "INUSE_ATTRIBUTE_ERR DOMException if the "newAttr" 
  is already an attribute of another element.

  Retrieve the last child of the second employee and append
  a newly created element.  The "createAttribute(name)"
  and "setAttributeNode(newAttr)" methods are invoked
  to create and add a new attribute to the newly created
  Element.  The "setAttributeNode(newAttr)" method is
  once again called to add the new attribute causing an
  exception to be raised since the attribute is already
  an attribute of another element.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-887236154')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
  */
  elementinuseattributeerr : function () {
    var success;
    if(checkInitialization(builder, "elementinuseattributeerr") != null) return;
    var doc;
    var newAttribute;
    var addressElementList;
    var testAddress;
    var newElement;
    var appendedChild;
    var setAttr1;
    var setAttr2;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressElementList = doc.getElementsByTagName("address");
    testAddress = addressElementList.item(1);
    newElement = doc.createElement("newElement");
    appendedChild = testAddress.appendChild(newElement);
    newAttribute = doc.createAttribute("newAttribute");
    setAttr1 = newElement.setAttributeNode(newAttribute);

    {
      success = false;
      try {
        setAttr2 = testAddress.setAttributeNode(newAttribute);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 10);
      }
      assertTrue("throw_INUSE_ATTRIBUTE_ERR",success);
    }

  },
  /**
  * 

  The "setAttribute(name,value)" method raises an 

  "INVALID_CHARACTER_ERR DOMException if the specified 

  name contains an invalid character.



  Retrieve the last child of the first employee and 

  call its "setAttribute(name,value)" method with    

  "name" containing an invalid character. 


  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68F082')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  elementinvalidcharacterexception : function () {
    var success;
    if(checkInitialization(builder, "elementinvalidcharacterexception") != null) return;
    var doc;
    var elementList;
    var testAddress;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(0);

    {
      success = false;
      try {
        testAddress.setAttribute("invalid^Name","value");
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
  across multiple lines.  The content of the "name" child
  should be parsed and treated as a single Text node.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-162CF083
  */
  elementnormalize : function () {
    var success;
    if(checkInitialization(builder, "elementnormalize") != null) return;
    var doc;
    var root;
    var elementList;
    var testName;
    var firstChild;
    var childValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    root = doc.documentElement;

    root.normalize();
    elementList = root.getElementsByTagName("name");
    testName = elementList.item(2);
    firstChild = testName.firstChild;

    childValue = firstChild.nodeValue;

    assertEquals("elementNormalizeAssert","Roger\n Jones",childValue);

  },
  /**
  * 
  The "removeAttributeNode(oldAttr)" method raises a
  NOT_FOUND_ERR DOMException if the "oldAttr" attribute
  is not an attribute of the element.

  Retrieve the last employee and attempt to remove
  a non existing attribute node.  This should cause the
  intended exception to be raised.  This test makes use
  of the "createAttribute(name)" method from the Document 
  interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-D589198')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  elementnotfounderr : function () {
    var success;
    if(checkInitialization(builder, "elementnotfounderr") != null) return;
    var doc;
    var oldAttribute;
    var addressElementList;
    var testAddress;
    var attrAddress;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    addressElementList = doc.getElementsByTagName("address");
    testAddress = addressElementList.item(4);
    oldAttribute = doc.createAttribute("oldAttribute");

    {
      success = false;
      try {
        attrAddress = testAddress.removeAttributeNode(oldAttribute);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 8);
      }
      assertTrue("throw_NOT_FOUND_ERR",success);
    }

  },
  /**
  * 
  The "removeAttribute(name)" removes an attribute by name.
  If the attribute has a default value, it is immediately
  replaced.

  Retrieve the attribute named "street" from the last child
  of the fourth employee, then remove the "street" 
  attribute by invoking the "removeAttribute(name)" method.
  The "street" attribute has a default value defined in the
  DTD file, that value should immediately replace the old
  value.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D6AC0F9
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
  */
  elementremoveattribute : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattribute") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var attrValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(3);
    testEmployee.removeAttribute("street");
    attrValue = testEmployee.getAttribute("street");
    assertEquals("streetYes","Yes",attrValue);

  },
  /**
  * 
  The "removeAttributeNode(oldAttr)" method removes the 
  specified attribute. 

  Retrieve the last child of the third employee, add a
  new "district" node to it and then try to remove it. 
  To verify that the node was removed use the
  "getNamedItem(name)" method from the NamedNodeMap
  interface.  It also uses the "getAttributes()" method
  from the Node interface.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  */
  elementremoveattributeaftercreate : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattributeaftercreate") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var newAttribute;
    var attributes;
    var districtAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("district");
    districtAttr = testEmployee.setAttributeNode(newAttribute);
    districtAttr = testEmployee.removeAttributeNode(newAttribute);
    attributes = testEmployee.attributes;

    districtAttr = attributes.getNamedItem("district");
    assertNull("elementRemoveAttributeAfterCreateAssert",districtAttr);

  },
  /**
  * 
  The "removeAttributeNode(oldAttr)" method returns the
  node that was removed. 

  Retrieve the last child of the third employee and
  remove its "street" Attr node.  The method should  
  return the old attribute node.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  */
  elementremoveattributenode : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattributenode") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var streetAttr;
    var removedAttr;
    var removedValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    streetAttr = testEmployee.getAttributeNode("street");
    removedAttr = testEmployee.removeAttributeNode(streetAttr);
    removedValue = removedAttr.value;

    assertEquals("elementRemoveAttributeNodeAssert","No",removedValue);

  },
  /**
  * 
  The "removeAttributeNode(oldAttr)" method for an attribute causes the 
  DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
  if the node is readonly.

  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Try to remove the "domestic" attribute
  from the entity reference by executing the "removeAttributeNode(oldAttr)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-D589198')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  */
  elementremoveattributenodenomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattributenodenomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var gender;
    var genList;
    var gen;
    var nodeType;
    var gList;
    var genElement;
    var attrList;
    var attrNode;
    var removedAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    gender = genderList.item(2);
    genList = gender.childNodes;

    gen = genList.item(0);
    assertNotNull("genNotNull",gen);
    nodeType = gen.nodeType;


    if(
      (1 == nodeType)
    ) {
      gen = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",gen);

    }
    gList = gen.childNodes;

    genElement = gList.item(0);
    assertNotNull("genElementNotNull",genElement);
    attrList = genElement.attributes;

    attrNode = attrList.getNamedItem("domestic");

    {
      success = false;
      try {
        removedAttr = genElement.removeAttributeNode(attrNode);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "removeAttributeNode(oldAttr)" method for an attribute causes the 
  DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
  if the node is readonly.

  Create an entity reference and add it to the children of the THIRD "gender" element.
  Try to remove the "domestic" attribute from the entity 
  reference by executing the "removeAttributeNode(oldAttr)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-D589198')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/elementremoveattributenodenomodificationallowederr.xml
  */
  elementremoveattributenodenomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattributenodenomodificationallowederrEE") != null) return;
    var doc;
    var genderList;
    var gender;
    var entRef;
    var entElement;
    var attrList;
    var attrNode;
    var nodeType;
    var removedAttr;
    var appendedChild;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    gender = genderList.item(2);
    entRef = doc.createEntityReference("ent4");
    assertNotNull("createdEntRefNotNull",entRef);
    appendedChild = gender.appendChild(entRef);
    entElement = entRef.firstChild;

    assertNotNull("entElementNotNull",entElement);
    attrList = entElement.attributes;

    attrNode = attrList.getNamedItem("domestic");
    assertNotNull("attrNodeNotNull",attrNode);

    {
      success = false;
      try {
        removedAttr = entElement.removeAttributeNode(attrNode);
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "removeAttribute(name)" method for an attribute causes the 
  DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
  if the node is readonly.

  Obtain the children of the THIRD "gender" element.  The elements
  content is an entity reference.  Try to remove the "domestic" attribute
  from the entity reference by executing the "removeAttribute(name)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D6AC0F9
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6D6AC0F9')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D6AC0F9
  */
  elementremoveattributenomodificationallowederr : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattributenomodificationallowederr") != null) return;
    var doc;
    var genderList;
    var gender;
    var genList;
    var gen;
    var gList;
    var nodeType;
    var genElement;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    gender = genderList.item(2);
    genList = gender.childNodes;

    gen = genList.item(0);
    assertNotNull("genNotNull",gen);
    nodeType = gen.nodeType;


    if(
      (1 == nodeType)
    ) {
      gen = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",gen);

    }
    gList = gen.childNodes;

    genElement = gList.item(0);
    assertNotNull("genElementNotNull",genElement);

    {
      success = false;
      try {
        genElement.removeAttribute("domestic");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "removeAttribute(name)" method for an attribute causes the 
  DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
  if the node is readonly.

  Create an reference the entity ent4 and add it to the THIRD "gender" element.  
  Try to remove the "domestic" attribute from the entity reference by executing the "removeAttribute(name)" method.
  This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D6AC0F9
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6D6AC0F9')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D6AC0F9
  * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/elementremoveattributenomodificationallowederr.xml
  */
  elementremoveattributenomodificationallowederrEE : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattributenomodificationallowederrEE") != null) return;
    var doc;
    var genderList;
    var gender;
    var entRef;
    var entElement;
    var appendedChild;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    genderList = doc.getElementsByTagName("gender");
    gender = genderList.item(2);
    entRef = doc.createEntityReference("ent4");
    assertNotNull("createdEntRefNotNull",entRef);
    appendedChild = gender.appendChild(entRef);
    entElement = entRef.firstChild;

    assertNotNull("entElementNotNull",entElement);

    {
      success = false;
      try {
        entElement.removeAttribute("domestic");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 7);
      }
      assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
    }

  },
  /**
  * 
  The "removeAttributeNode(oldAttr)" method removes the
  specified attribute node and restores any default values. 

  Retrieve the last child of the third employeed and 
  remove its "street" Attr node.  Since this node has a
  default value defined in the DTD file, that default
  should immediately be the new value.

  * @author NIST
  * @author Mary Brady
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
  */
  elementremoveattributerestoredefaultvalue : function () {
    var success;
    if(checkInitialization(builder, "elementremoveattributerestoredefaultvalue") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var streetAttr;
    var attribute;
    var removedAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    streetAttr = testEmployee.getAttributeNode("street");
    removedAttr = testEmployee.removeAttributeNode(streetAttr);
    attribute = testEmployee.getAttribute("street");
    assertEquals("streetYes","Yes",attribute);

  },
  /**
  * 
  This test calls setAttributeNode to replace an attribute with itself.  
  Since the node is not an attribute of another Element, it would
  be inappropriate to throw an INUSE_ATTRIBUTE_ERR.

  This test was derived from elementinuserattributeerr which
  inadvertanly made this test.

  * @author Curt Arnold
  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
  */
  elementreplaceattributewithself : function () {
    var success;
    if(checkInitialization(builder, "elementreplaceattributewithself") != null) return;
    var doc;
    var elementList;
    var testEmployee;
    var streetAttr;
    var replacedAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "staff");
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    streetAttr = testEmployee.getAttributeNode("street");
    replacedAttr = testEmployee.setAttributeNode(streetAttr);
    assertSame("replacedAttr",streetAttr,replacedAttr);

  },
  /**
  * 
  The "setAttributeNode(newAttr)" method adds a new
  attribute to the Element.  If the "newAttr" Attr node is
  already present in this element, it should replace the
  existing one. 

  Retrieve the last child of the third employee and add a 
  new attribute node by invoking the "setAttributeNode(new 
    Attr)" method.  The new attribute node to be added is 
    "street", which is already present in this element.  The
    method should replace the existing Attr node with the 
    new one.  This test uses the "createAttribute(name)"
    method from the Document interface. 

    * @author NIST
    * @author Mary Brady
    */
    elementreplaceexistingattribute : function () {
      var success;
      if(checkInitialization(builder, "elementreplaceexistingattribute") != null) return;
      var doc;
      var elementList;
      var testEmployee;
      var newAttribute;
      var name;
      var setAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("address");
      testEmployee = elementList.item(2);
      newAttribute = doc.createAttribute("street");
      setAttr = testEmployee.setAttributeNode(newAttribute);
      name = testEmployee.getAttribute("street");
      assertEquals("elementReplaceExistingAttributeAssert","",name);

    },
    /**
    * 
    If the "setAttributeNode(newAttr)" method replaces an
    existing Attr node with the same name, then it should
    return the previously existing Attr node.

    Retrieve the last child of the third employee and add a
    new attribute node.  The new attribute node is "street",
    which is already present in this Element.  The method
    should return the existing Attr node(old "street" Attr).
    This test uses the "createAttribute(name)" method
    from the Document interface.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
    */
    elementreplaceexistingattributegevalue : function () {
      var success;
      if(checkInitialization(builder, "elementreplaceexistingattributegevalue") != null) return;
      var doc;
      var elementList;
      var testEmployee;
      var newAttribute;
      var streetAttr;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("address");
      testEmployee = elementList.item(2);
      newAttribute = doc.createAttribute("street");
      streetAttr = testEmployee.setAttributeNode(newAttribute);
      value = streetAttr.value;

      assertEquals("streetNo","No",value);

    },
    /**
    * 
    The "getAttributes()" method(Node Interface) may
    be used to retrieve the set of all attributes of an
    element. 

    Create a list of all the attributes of the last child
    of the first employee by using the "getAttributes()"
    method.  Examine the length of the attribute list.  
    This test uses the "getLength()" method from the        
    NameNodeMap interface.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
    * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
    */
    elementretrieveallattributes : function () {
      var success;
      if(checkInitialization(builder, "elementretrieveallattributes") != null) return;
      var doc;
      var addressList;
      var testAddress;
      var attributes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      addressList = doc.getElementsByTagName("address");
      testAddress = addressList.item(0);
      attributes = testAddress.attributes;

      assertSize("elementRetrieveAllAttributesAssert",2,attributes);

    },
    /**
    * 
    The "getAttribute(name)" method returns an attribute
    value by name.

    Retrieve the second address element, then
    invoke the 'getAttribute("street")' method.  This should
    return the value of the attribute("No").

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-666EE0F9
    */
    elementretrieveattrvalue : function () {
      var success;
      if(checkInitialization(builder, "elementretrieveattrvalue") != null) return;
      var doc;
      var elementList;
      var testAddress;
      var attrValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("address");
      testAddress = elementList.item(2);
      attrValue = testAddress.getAttribute("street");
      assertEquals("attrValue","No",attrValue);

    },
    /**
    * 
    The "getElementsByTagName()" method returns a NodeList 
    of all descendant elements with a given tagName.    

    Invoke the "getElementsByTagName()" method and create
    a NodeList of "position" elements.  Retrieve the second 
    "position" element in the list and return the NodeName. 

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-104682815
    */
    elementretrievetagname : function () {
      var success;
      if(checkInitialization(builder, "elementretrievetagname") != null) return;
      var doc;
      var elementList;
      var testEmployee;
      var name;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("position");
      testEmployee = elementList.item(1);
      name = testEmployee.nodeName;

      assertEquals("nodename","position",name);
      name = testEmployee.tagName;

      assertEquals("tagname","position",name);

    },
    /**
    * 
    The "setAttributeNode(newAttr)" method for an attribute causes the 
    DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
    if the node is readonly.

    Obtain the children of the THIRD "gender" element.  The elements
    content is an entity reference.  Try to remove the "domestic" attribute
    from the entity reference by executing the "setAttributeNode(newAttr)" method.
    This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-887236154')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
    */
    elementsetattributenodenomodificationallowederr : function () {
      var success;
      if(checkInitialization(builder, "elementsetattributenodenomodificationallowederr") != null) return;
      var doc;
      var genderList;
      var gender;
      var entRef;
      var entElement;
      var newAttr;
      var nodeType;
      var badAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      genderList = doc.getElementsByTagName("gender");
      gender = genderList.item(2);
      entRef = gender.firstChild;

      assertNotNull("entRefNotNull",entRef);
      nodeType = entRef.nodeType;


      if(
        (1 == nodeType)
      ) {
        entRef = doc.createEntityReference("ent4");
        assertNotNull("createdEntRefNotNull",entRef);

      }
      entElement = entRef.firstChild;

      assertNotNull("entElementNotNull",entElement);
      newAttr = doc.createAttribute("newAttr");

      {
        success = false;
        try {
          badAttr = entElement.setAttributeNode(newAttr);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 7);
        }
        assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
      }

    },
    /**
    * 
    The "setAttributeNode(newAttr)" method for an attribute causes the 
    DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
    if the node is readonly.

    Create an entity reference and add to the THIRD "gender" element.  The elements
    content is an entity reference.  Try to remove the "domestic" attribute
    from the entity reference by executing the "setAttributeNode(newAttr)" method.
    This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-887236154')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
    * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/elementsetattributenodenomodificationallowederr.xml
    */
    elementsetattributenodenomodificationallowederrEE : function () {
      var success;
      if(checkInitialization(builder, "elementsetattributenodenomodificationallowederrEE") != null) return;
      var doc;
      var genderList;
      var gender;
      var entRef;
      var entElement;
      var newAttr;
      var badAttr;
      var appendedChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      genderList = doc.getElementsByTagName("gender");
      gender = genderList.item(2);
      entRef = doc.createEntityReference("ent4");
      assertNotNull("createdEntRefNotNull",entRef);
      appendedChild = gender.appendChild(entRef);
      entElement = entRef.firstChild;

      assertNotNull("entElementNotNull",entElement);
      newAttr = doc.createAttribute("newAttr");

      {
        success = false;
        try {
          badAttr = entElement.setAttributeNode(newAttr);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 7);
        }
        assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
      }

    },
    /**
    * 
    The "setAttributeNode(newAttr)" method returns the
    null value if no previously existing Attr node with the
    same name was replaced.

    Retrieve the last child of the third employee and add a 
    new attribute to it.  The new attribute node added is 
    "district", which is not part of this Element.  The   
    method should return the null value.   
    This test uses the "createAttribute(name)"
    method from the Document interface. 

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
    */
    elementsetattributenodenull : function () {
      var success;
      if(checkInitialization(builder, "elementsetattributenodenull") != null) return;
      var doc;
      var elementList;
      var testEmployee;
      var newAttribute;
      var districtAttr;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("address");
      testEmployee = elementList.item(2);
      newAttribute = doc.createAttribute("district");
      districtAttr = testEmployee.setAttributeNode(newAttribute);
      assertNull("elementSetAttributeNodeNullAssert",districtAttr);

    },
    /**
    * 
    The "setAttribute(name,value)" method for an attribute causes the 
    DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
    if the node is readonly.

    Obtain the children of the THIRD "gender" element.  The elements
    content is an entity reference.  Try to remove the "domestic" attribute
    from the entity reference by executing the "setAttribute(name,value)" method.
    This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68F082')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
    */
    elementsetattributenomodificationallowederr : function () {
      var success;
      if(checkInitialization(builder, "elementsetattributenomodificationallowederr") != null) return;
      var doc;
      var genderList;
      var gender;
      var entRef;
      var entElement;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      genderList = doc.getElementsByTagName("gender");
      gender = genderList.item(2);
      entRef = gender.firstChild;

      assertNotNull("entRefNotNull",entRef);
      entElement = entRef.firstChild;

      assertNotNull("entElementNotNull",entElement);

      {
        success = false;
        try {
          entElement.setAttribute("newAttr","newValue");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 7);
        }
        assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
      }

    },
    /**
    * 
    The "setAttribute(name,value)" method for an attribute causes the 
    DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
    if the node is readonly.

    Add an ent4 reference to the children of the THIRD "gender" element.  
    Try to remove the "domestic" attribute
    from the entity reference by executing the "setAttribute(name,value)" method.
    This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68F082')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
    * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/elementsetattributenomodificationallowederr.xml
    */
    elementsetattributenomodificationallowederrEE : function () {
      var success;
      if(checkInitialization(builder, "elementsetattributenomodificationallowederrEE") != null) return;
      var doc;
      var genderList;
      var gender;
      var entRef;
      var entElement;
      var appendedChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      genderList = doc.getElementsByTagName("gender");
      gender = genderList.item(2);
      entRef = doc.createEntityReference("ent4");
      appendedChild = gender.appendChild(entRef);
      entElement = entRef.firstChild;

      assertNotNull("entElementNotNull",entElement);

      {
        success = false;
        try {
          entElement.setAttribute("newAttr","newValue");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 7);
        }
        assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
      }

    },
    /**
    * 

    The "setAttributeNode(newAttr)" method raises an 

    "WRONG_DOCUMENT_ERR DOMException if the "newAttr" 

    was created from a different document than the one that

    created this document.



    Retrieve the last employee and attempt to set a new

    attribute node for its "employee" element.  The new

    attribute was created from a document other than the

    one that created this element, therefore a

    WRONG_DOCUMENT_ERR DOMException should be raised.

    This test uses the "createAttribute(newAttr)" method

    from the Document interface.


    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-887236154')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
    */
    elementwrongdocumenterr : function () {
      var success;
      if(checkInitialization(builder, "elementwrongdocumenterr") != null) return;
      var doc1;
      var doc2;
      var newAttribute;
      var addressElementList;
      var testAddress;
      var attrAddress;

      var doc1Ref = null;
      if (typeof(this.doc1) != 'undefined') {
        doc1Ref = this.doc1;
      }
      doc1 = load(doc1Ref, "doc1", "staff");

      var doc2Ref = null;
      if (typeof(this.doc2) != 'undefined') {
        doc2Ref = this.doc2;
      }
      doc2 = load(doc2Ref, "doc2", "staff");
      newAttribute = doc2.createAttribute("newAttribute");
      addressElementList = doc1.getElementsByTagName("address");
      testAddress = addressElementList.item(4);

      {
        success = false;
        try {
          attrAddress = testAddress.setAttributeNode(newAttribute);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 4);
        }
        assertTrue("throw_WRONG_DOCUMENT_ERR",success);
      }

    },
    /**
    * 
    The nodeName attribute that is inherited from Node  
    contains the name of the entity.

    Retrieve the entity named "ent1" and access its name by 
    invoking the "getNodeName()" method inherited from
    the Node interface.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-527DCFF2
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
    */
    entitygetentityname : function () {
      var success;
      if(checkInitialization(builder, "entitygetentityname") != null) return;
      var doc;
      var docType;
      var entityList;
      var entityNode;
      var entityName;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      docType = doc.doctype;

      assertNotNull("docTypeNotNull",docType);
      entityList = docType.entities;

      assertNotNull("entitiesNotNull",entityList);
      entityNode = entityList.getNamedItem("ent1");
      entityName = entityNode.nodeName;

      assertEquals("entityGetEntityNameAssert","ent1",entityName);

    },
    /**
    * 
    The "getPublicId()" method of an Entity node contains
    the public identifier associated with the entity, if
    one was specified.

    Retrieve the entity named "ent5" and access its  
    public identifier.  The string "entityURI" should be
    returned.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D7303025
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6ABAEB38
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D7C29F3E
    */
    entitygetpublicid : function () {
      var success;
      if(checkInitialization(builder, "entitygetpublicid") != null) return;
      var doc;
      var docType;
      var entityList;
      var entityNode;
      var publicId;
      var systemId;
      var notation;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      docType = doc.doctype;

      assertNotNull("docTypeNotNull",docType);
      entityList = docType.entities;

      assertNotNull("entitiesNotNull",entityList);
      entityNode = entityList.getNamedItem("ent5");
      publicId = entityNode.publicId;

      assertEquals("publicId","entityURI",publicId);
      systemId = entityNode.systemId;

      assertURIEquals("systemId",null,null,null,"entityFile",null,null,null,null,systemId);
      notation = entityNode.notationName;

      assertEquals("notation","notation1",notation);

    },
    /**
    * 
    The "getPublicId()" method of an Entity node contains
    the public identifier associated with the entity, if
    one was not specified a null value should be returned.

    Retrieve the entity named "ent1" and access its  
    public identifier.  Since a public identifier was not
    specified for this entity, the "getPublicId()" method 
    should return null.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D7303025
    */
    entitygetpublicidnull : function () {
      var success;
      if(checkInitialization(builder, "entitygetpublicidnull") != null) return;
      var doc;
      var docType;
      var entityList;
      var entityNode;
      var publicId;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      docType = doc.doctype;

      assertNotNull("docTypeNotNull",docType);
      entityList = docType.entities;

      assertNotNull("entitiesNotNull",entityList);
      entityNode = entityList.getNamedItem("ent1");
      publicId = entityNode.publicId;

      assertNull("entityGetPublicIdNullAssert",publicId);

    },
    /**
    * 
    Appends a text node to an attribute and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
    */
    hc_attrappendchild1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrappendchild1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var lastChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = doc.createTextNode("terday");
      retval = titleAttr.appendChild(textNode);
      value = titleAttr.value;

      assertEquals("attrValue","Yesterday",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Yesterday",value);
      value = retval.nodeValue;

      assertEquals("retvalValue","terday",value);
      lastChild = titleAttr.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","terday",value);

    },
    /**
    * 
    Attempts to append an element to the child nodes of an attribute.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
    */
    hc_attrappendchild2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrappendchild2") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var newChild;
      var retval;
      var lastChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      newChild = doc.createElement("terday");

      {
        success = false;
        try {
          retval = titleAttr.appendChild(newChild);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 3);
        }
        assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
      }

    },
    /**
    * 
    Appends a document fragment to an attribute and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
    */
    hc_attrappendchild3 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrappendchild3") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var terNode;
      var dayNode;
      var retval;
      var lastChild;
      var docFrag;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      terNode = doc.createTextNode("ter");
      dayNode = doc.createTextNode("day");
      docFrag = doc.createDocumentFragment();
      retval = docFrag.appendChild(terNode);
      retval = docFrag.appendChild(dayNode);
      retval = titleAttr.appendChild(docFrag);
      value = titleAttr.value;

      assertEquals("attrValue","Yesterday",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Yesterday",value);
      value = retval.nodeValue;

      assertNull("retvalValue",value);
      lastChild = titleAttr.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","day",value);

    },
    /**
    * 
    Attempt to append a CDATASection to an attribute which should result
    in a HIERARCHY_REQUEST_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
    */
    hc_attrappendchild4 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrappendchild4") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var lastChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");

      if(

        (builder.contentType == "text/html")

      ) {

        {
          success = false;
          try {
            textNode = doc.createCDATASection("terday");
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 9);
          }
          assertTrue("throw_NOT_SUPPORTED_ERR",success);
        }

      }

      else {
        textNode = doc.createCDATASection("terday");

        {
          success = false;
          try {
            retval = titleAttr.appendChild(textNode);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      }

    },
    /**
    * 
    Attempt to append a node from another document to an attribute which should result
    in a WRONG_DOCUMENT_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
    */
    hc_attrappendchild5 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrappendchild5") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var lastChild;
      var otherDoc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");

      var otherDocRef = null;
      if (typeof(this.otherDoc) != 'undefined') {
        otherDocRef = this.otherDoc;
      }
      otherDoc = load(otherDocRef, "otherDoc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = otherDoc.createTextNode("terday");

      {
        success = false;
        try {
          retval = titleAttr.appendChild(textNode);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 4);
        }
        assertTrue("throw_WRONG_DOCUMENT_ERR",success);
      }

    },
    /**
    * 
    Creates an new attribute node and appends a text node.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
    */
    hc_attrappendchild6 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrappendchild6") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var lastChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      titleAttr = doc.createAttribute("title");
      textNode = doc.createTextNode("Yesterday");
      retval = titleAttr.appendChild(textNode);
      value = titleAttr.value;

      assertEquals("attrValue","Yesterday",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Yesterday",value);
      value = retval.nodeValue;

      assertEquals("retvalValue","Yesterday",value);
      lastChild = titleAttr.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","Yesterday",value);

    },
    /**
    * 
    Checks that Node.childNodes for an attribute node contains
    the expected text node.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
    */
    hc_attrchildnodes1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrchildnodes1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var childNodes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      childNodes = titleAttr.childNodes;

      assertSize("childNodesSize",1,childNodes);
      textNode = childNodes.item(0);
      value = textNode.nodeValue;

      assertEquals("child1IsYes","Yes",value);
      textNode = childNodes.item(1);
      assertNull("secondItemIsNull",textNode);

    },
    /**
    * 
    Checks Node.childNodes for an attribute with multiple child nodes.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
    */
    hc_attrchildnodes2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrchildnodes2") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var childNodes;
      var retval;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      childNodes = titleAttr.childNodes;

      textNode = doc.createTextNode("terday");
      retval = titleAttr.appendChild(textNode);
      assertSize("childNodesSize",2,childNodes);
      textNode = childNodes.item(0);
      value = textNode.nodeValue;

      assertEquals("child1IsYes","Yes",value);
      textNode = childNodes.item(1);
      value = textNode.nodeValue;

      assertEquals("child2IsTerday","terday",value);
      textNode = childNodes.item(2);
      assertNull("thirdItemIsNull",textNode);

    },
    /**
    * 
    Appends a text node to an attribute and clones the node.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
    */
    hc_attrclonenode1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrclonenode1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var lastChild;
      var clonedTitle;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");

      textNode = doc.createTextNode("terday");
      retval = titleAttr.appendChild(textNode);

      clonedTitle = titleAttr.cloneNode(false);

      textNode.nodeValue = "text_node_not_cloned";

      value = clonedTitle.value;

      assertEquals("attrValue","Yesterday",value);
      value = clonedTitle.nodeValue;

      assertEquals("attrNodeValue","Yesterday",value);
      lastChild = clonedTitle.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","terday",value);

    },
    /**
    * 
    Create a new DocumentFragment and add a newly created Element node(with one attribute).  
    Once the element is added, its attribute should be available as an attribute associated 
    with an Element within a DocumentFragment.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-35CB04B5
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
    * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=184
    */
    hc_attrcreatedocumentfragment : function () {
      var success;
      if(checkInitialization(builder, "hc_attrcreatedocumentfragment") != null) return;
      var doc;
      var docFragment;
      var newOne;
      var domesticNode;
      var attributes;
      var attribute;
      var attrName;
      var appendedChild;
      var langAttrCount = 0;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docFragment = doc.createDocumentFragment();
      newOne = doc.createElement("html");
      newOne.setAttribute("lang","EN");

      appendedChild = docFragment.appendChild(newOne);

      domesticNode = docFragment.firstChild;

      attributes = domesticNode.attributes;

      for(var indexN10078 = 0;indexN10078 < attributes.length; indexN10078++) {
        attribute = attributes.item(indexN10078);
        attrName = attribute.nodeName;


        if(
          equalsAutoCase("attribute", "lang", attrName)
        ) {
          langAttrCount += 1;

        }

      }
      assertEquals("hasLangAttr",1,langAttrCount);

    },
    /**
    * 
    The "setValue()" method for an attribute creates a 
    Text node with the unparsed content of the string.
    Retrieve the attribute named "class" from the last 
    child of of the fourth employee and assign the "Y&ent1;" 
    string to its value attribute.  This value is not yet
    parsed and therefore should still be the same upon
    retrieval. This test uses the "getNamedItem(name)" method
    from the NamedNodeMap interface.  

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
    * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Apr/0057.html
    */
    hc_attrcreatetextnode : function () {
      var success;
      if(checkInitialization(builder, "hc_attrcreatetextnode") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var streetAttr;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(3);
      attributes = testNode.attributes;

      streetAttr = attributes.getNamedItem("class");
      streetAttr.value = "Y&ent1;";

      value = streetAttr.value;

      assertEquals("value","Y&ent1;",value);
      value = streetAttr.nodeValue;

      assertEquals("nodeValue","Y&ent1;",value);

    },
    /**
    * 
    The "setNodeValue()" method for an attribute creates a 
    Text node with the unparsed content of the string.
    Retrieve the attribute named "class" from the last 
    child of of the fourth employee and assign the "Y&ent1;" 
    string to its value attribute.  This value is not yet
    parsed and therefore should still be the same upon
    retrieval. This test uses the "getNamedItem(name)" method
    from the NamedNodeMap interface. 

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
    * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Apr/0057.html
    */
    hc_attrcreatetextnode2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrcreatetextnode2") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var streetAttr;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(3);
      attributes = testNode.attributes;

      streetAttr = attributes.getNamedItem("class");
      streetAttr.nodeValue = "Y&ent1;";

      value = streetAttr.value;

      assertEquals("value","Y&ent1;",value);
      value = streetAttr.nodeValue;

      assertEquals("nodeValue","Y&ent1;",value);

    },
    /**
    * 
    If an Attr is explicitly assigned any value, then that value is the attributes effective value.
    Retrieve the attribute named "domestic" from the last child of of the first employee 
    and examine its nodeValue attribute.  This test uses the "getNamedItem(name)" method 
    from the NamedNodeMap interface.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
    */
    hc_attreffectivevalue : function () {
      var success;
      if(checkInitialization(builder, "hc_attreffectivevalue") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var domesticAttr;
      var value;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(0);
      attributes = testNode.attributes;

      domesticAttr = attributes.getNamedItem("title");
      value = domesticAttr.nodeValue;

      assertEquals("attrEffectiveValueAssert","Yes",value);

    },
    /**
    * 
    Checks that Node.firstChild for an attribute node contains
    the expected text node.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-169727388
    */
    hc_attrfirstchild : function () {
      var success;
      if(checkInitialization(builder, "hc_attrfirstchild") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var otherChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = titleAttr.firstChild;

      assertNotNull("textNodeNotNull",textNode);
      value = textNode.nodeValue;

      assertEquals("child1IsYes","Yes",value);
      otherChild = textNode.nextSibling;

      assertNull("nextSiblingIsNull",otherChild);
      otherChild = textNode.previousSibling;

      assertNull("previousSiblingIsNull",otherChild);

    },
    /**
    * 
    Checks the value of an attribute that contains entity references.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
    */
    hc_attrgetvalue1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrgetvalue1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var lastChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("class");
      value = titleAttr.value;

      assertEquals("attrValue1","Yα",value);

    },
    /**
    * 
    Checks the value of an attribute that contains entity references.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
    */
    hc_attrgetvalue2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrgetvalue2") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var firstChild;
      var alphaRef;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("class");

      if(

        (builder.contentType == "text/html")

      ) {

        {
          success = false;
          try {
            alphaRef = doc.createEntityReference("alpha");
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 9);
          }
          assertTrue("throw_NOT_SUPPORTED_ERR",success);
        }

      }

      else {
        alphaRef = doc.createEntityReference("alpha");
        firstChild = titleAttr.firstChild;

        retval = titleAttr.insertBefore(alphaRef,firstChild);
        value = titleAttr.value;

        assertEquals("attrValue1","αYα",value);

      }

    },
    /**
    * 
    Checks that Node.hasChildNodes() is true for an attribute with content.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-810594187
    */
    hc_attrhaschildnodes : function () {
      var success;
      if(checkInitialization(builder, "hc_attrhaschildnodes") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var hasChildNodes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }


      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");

      hasChildNodes = titleAttr.hasChildNodes();
      assertTrue("hasChildrenIsTrue",hasChildNodes);

    },
    /**
    * 
    Appends a text node to an attribute and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
    */
    hc_attrinsertbefore1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrinsertbefore1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var firstChild;
      var lastChild;
      var refChild = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = doc.createTextNode("terday");
      retval = titleAttr.insertBefore(textNode,refChild);
      value = titleAttr.value;

      assertEquals("attrValue","Yesterday",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Yesterday",value);
      value = retval.nodeValue;

      assertEquals("retvalValue","terday",value);
      firstChild = titleAttr.firstChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","Yes",value);
      lastChild = titleAttr.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","terday",value);

    },
    /**
    * 
    Prepends a text node to an attribute and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
    */
    hc_attrinsertbefore2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrinsertbefore2") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var lastChild;
      var firstChild;
      var refChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = doc.createTextNode("terday");
      refChild = titleAttr.firstChild;

      retval = titleAttr.insertBefore(textNode,refChild);
      value = titleAttr.value;

      assertEquals("attrValue","terdayYes",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","terdayYes",value);
      value = retval.nodeValue;

      assertEquals("retvalValue","terday",value);
      firstChild = titleAttr.firstChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","terday",value);
      lastChild = titleAttr.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","Yes",value);

    },
    /**
    * 
    Appends a document fragment to an attribute and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
    */
    hc_attrinsertbefore3 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrinsertbefore3") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var terNode;
      var dayNode;
      var docFrag;
      var retval;
      var firstChild;
      var lastChild;
      var refChild = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      terNode = doc.createTextNode("ter");
      dayNode = doc.createTextNode("day");
      docFrag = doc.createDocumentFragment();
      retval = docFrag.appendChild(terNode);
      retval = docFrag.appendChild(dayNode);
      retval = titleAttr.insertBefore(docFrag,refChild);
      value = titleAttr.value;

      assertEquals("attrValue","Yesterday",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Yesterday",value);
      value = retval.nodeValue;

      assertNull("retvalValue",value);
      firstChild = titleAttr.firstChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","Yes",value);
      lastChild = titleAttr.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","day",value);

    },
    /**
    * 
    Prepends a document fragment to an attribute and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
    */
    hc_attrinsertbefore4 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrinsertbefore4") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var terNode;
      var dayNode;
      var docFrag;
      var retval;
      var firstChild;
      var lastChild;
      var refChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      terNode = doc.createTextNode("ter");
      dayNode = doc.createTextNode("day");
      docFrag = doc.createDocumentFragment();
      retval = docFrag.appendChild(terNode);
      retval = docFrag.appendChild(dayNode);
      refChild = titleAttr.firstChild;

      retval = titleAttr.insertBefore(docFrag,refChild);
      value = titleAttr.value;

      assertEquals("attrValue","terdayYes",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","terdayYes",value);
      value = retval.nodeValue;

      assertNull("retvalValue",value);
      firstChild = titleAttr.firstChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","ter",value);
      lastChild = titleAttr.lastChild;

      value = lastChild.nodeValue;

      assertEquals("lastChildValue","Yes",value);

    },
    /**
    * 
    Attempt to append a CDATASection to an attribute which should result
    in a HIERARCHY_REQUEST_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
    */
    hc_attrinsertbefore5 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrinsertbefore5") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var refChild = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");

      if(

        (builder.contentType == "text/html")

      ) {

        {
          success = false;
          try {
            textNode = doc.createCDATASection("terday");
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 9);
          }
          assertTrue("throw_NOT_SUPPORTED_ERR",success);
        }

      }

      else {
        textNode = doc.createCDATASection("terday");

        {
          success = false;
          try {
            retval = titleAttr.insertBefore(textNode,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      }

    },
    /**
    * 
    Attempt to append a text node from another document to an attribute which should result
    in a WRONG_DOCUMENT_ERR.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
    */
    hc_attrinsertbefore6 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrinsertbefore6") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var refChild = null;

      var otherDoc;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");

      var otherDocRef = null;
      if (typeof(this.otherDoc) != 'undefined') {
        otherDocRef = this.otherDoc;
      }
      otherDoc = load(otherDocRef, "otherDoc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = otherDoc.createTextNode("terday");

      {
        success = false;
        try {
          retval = titleAttr.insertBefore(textNode,refChild);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 4);
        }
        assertTrue("throw_WRONG_DOCUMENT_ERR",success);
      }

    },
    /**
    * 
    Appends a document fragment containing a CDATASection to an attribute.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
    */
    hc_attrinsertbefore7 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrinsertbefore7") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var terNode;
      var dayNode;
      var docFrag;
      var retval;
      var firstChild;
      var lastChild;
      var refChild = null;


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      terNode = doc.createTextNode("ter");

      if(

        (builder.contentType == "text/html")

      ) {

        {
          success = false;
          try {
            dayNode = doc.createCDATASection("day");
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 9);
          }
          assertTrue("throw_NOT_SUPPORTED_ERR",success);
        }

      }

      else {
        dayNode = doc.createCDATASection("day");
        docFrag = doc.createDocumentFragment();
        retval = docFrag.appendChild(terNode);
        retval = docFrag.appendChild(dayNode);

        {
          success = false;
          try {
            retval = titleAttr.insertBefore(docFrag,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      }

    },
    /**
    * 
    Checks that Node.lastChild for an attribute node contains
    the expected text node.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-61AD09FB
    */
    hc_attrlastchild : function () {
      var success;
      if(checkInitialization(builder, "hc_attrlastchild") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var otherChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = titleAttr.firstChild;

      assertNotNull("textNodeNotNull",textNode);
      value = textNode.nodeValue;

      assertEquals("child1IsYes","Yes",value);
      otherChild = textNode.nextSibling;

      assertNull("nextSiblingIsNull",otherChild);
      otherChild = textNode.previousSibling;

      assertNull("previousSiblingIsNull",otherChild);

    },
    /**
    * 
    Retrieve the attribute named class from the last 
    child of of the second "p" element and examine its 
    NodeName.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1112119403
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
    * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
    */
    hc_attrname : function () {
      var success;
      if(checkInitialization(builder, "hc_attrname") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var streetAttr;
      var strong1;
      var strong2;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(1);
      attributes = testNode.attributes;

      streetAttr = attributes.getNamedItem("class");
      strong1 = streetAttr.nodeName;

      strong2 = streetAttr.name;

      assertEqualsAutoCase("attribute", "nodeName","class",strong1);
      assertEqualsAutoCase("attribute", "name","class",strong2);

    },
    /**
    * 
    The "getNextSibling()" method for an Attr node should return null.
    Retrieve the attribute named "domestic" from the last child of of the
    first employee and examine its NextSibling node.  This test uses the
    "getNamedItem(name)" method from the NamedNodeMap interface.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6AC54C2F
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    */
    hc_attrnextsiblingnull : function () {
      var success;
      if(checkInitialization(builder, "hc_attrnextsiblingnull") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var domesticAttr;
      var s;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(0);
      attributes = testNode.attributes;

      domesticAttr = attributes.getNamedItem("title");
      s = domesticAttr.nextSibling;

      assertNull("attrNextSiblingNullAssert",s);

    },
    /**
    * 
    Appends a text node to an attribute, normalizes the attribute
    and checks for a single child node.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-162CF083
    */
    hc_attrnormalize : function () {
      var success;
      if(checkInitialization(builder, "hc_attrnormalize") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var firstChild;
      var secondChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = doc.createTextNode("terday");
      retval = titleAttr.appendChild(textNode);
      textNode = doc.createTextNode("");
      retval = titleAttr.appendChild(textNode);
      testNode.normalize();
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Yesterday",value);
      firstChild = titleAttr.firstChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","Yesterday",value);
      secondChild = firstChild.nextSibling;

      assertNull("secondChildIsNull",secondChild);

    },
    /**
    * 
    The "getParentNode()" method for an Attr node should return null.  Retrieve
    the attribute named "domestic" from the last child of the first employee
    and examine its parentNode attribute.  This test also uses the "getNamedItem(name)"
    method from the NamedNodeMap interface.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1060184317
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    */
    hc_attrparentnodenull : function () {
      var success;
      if(checkInitialization(builder, "hc_attrparentnodenull") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var domesticAttr;
      var s;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(0);
      attributes = testNode.attributes;

      domesticAttr = attributes.getNamedItem("title");
      s = domesticAttr.parentNode;

      assertNull("attrParentNodeNullAssert",s);

    },
    /**
    * 
    The "getPreviousSibling()" method for an Attr node should return null.
    Retrieve the attribute named "domestic" from the last child of of the
    first employee and examine its PreviousSibling node.  This test uses the
    "getNamedItem(name)" method from the NamedNodeMap interface.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-640FB3C8
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    */
    hc_attrprevioussiblingnull : function () {
      var success;
      if(checkInitialization(builder, "hc_attrprevioussiblingnull") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var domesticAttr;
      var s;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(0);
      attributes = testNode.attributes;

      domesticAttr = attributes.getNamedItem("title");
      s = domesticAttr.previousSibling;

      assertNull("attrPreviousSiblingNullAssert",s);

    },
    /**
    * 
    Removes the child node of an attribute and checks that the value is empty.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
    */
    hc_attrremovechild1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrremovechild1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var firstChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = titleAttr.firstChild;

      assertNotNull("attrChildNotNull",textNode);
      retval = titleAttr.removeChild(textNode);

      value = titleAttr.value;

      assertEquals("attrValue","",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","",value);
      value = retval.nodeValue;

      assertEquals("retvalValue","Yes",value);
      firstChild = titleAttr.firstChild;

      assertNull("firstChildNull",firstChild);

    },
    /**
    * 
    Attempts to remove a freshly created text node which should result in a NOT_FOUND_ERR exception.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
    */
    hc_attrremovechild2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrremovechild2") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = doc.createTextNode("Yesterday");

      {
        success = false;
        try {
          retval = titleAttr.removeChild(textNode);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 8);
        }
        assertTrue("throw_NOT_FOUND_ERR",success);
      }

    },
    /**
    * 
    Replaces a text node of an attribute and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
    */
    hc_attrreplacechild1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrreplacechild1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var firstChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = doc.createTextNode("terday");
      firstChild = titleAttr.firstChild;

      assertNotNull("attrChildNotNull",firstChild);
      retval = titleAttr.replaceChild(textNode,firstChild);
      value = titleAttr.value;

      assertEquals("attrValue","terday",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","terday",value);
      value = retval.nodeValue;

      assertEquals("retvalValue","Yes",value);
      firstChild = titleAttr.firstChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","terday",value);

    },
    /**
    * 
    Replaces a text node of an attribute with a document fragment and checks if the value of
    the attribute is changed.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
    */
    hc_attrreplacechild2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrreplacechild2") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var terNode;
      var dayNode;
      var docFrag;
      var retval;
      var firstChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      terNode = doc.createTextNode("ter");
      dayNode = doc.createTextNode("day");
      docFrag = doc.createDocumentFragment();
      retval = docFrag.appendChild(terNode);
      retval = docFrag.appendChild(dayNode);
      firstChild = titleAttr.firstChild;

      assertNotNull("attrChildNotNull",firstChild);
      retval = titleAttr.replaceChild(docFrag,firstChild);
      value = titleAttr.value;

      assertEquals("attrValue","terday",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","terday",value);
      value = retval.nodeValue;

      assertEquals("retvalValue","Yes",value);
      firstChild = titleAttr.firstChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","ter",value);

    },
    /**
    * 
    Sets Attr.value on an attribute that only has a simple value.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
    */
    hc_attrsetvalue1 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrsetvalue1") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var retval;
      var firstChild;
      var otherChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      firstChild = titleAttr.firstChild;

      assertNotNull("attrChildNotNull",firstChild);
      titleAttr.value = "Tomorrow";

      firstChild.nodeValue = "impl reused node";

      value = titleAttr.value;

      assertEquals("attrValue","Tomorrow",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Tomorrow",value);
      firstChild = titleAttr.lastChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","Tomorrow",value);
      otherChild = firstChild.nextSibling;

      assertNull("nextSiblingIsNull",otherChild);

    },
    /**
    * 
    Sets Attr.value on an attribute that should contain multiple child nodes.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-221662474
    */
    hc_attrsetvalue2 : function () {
      var success;
      if(checkInitialization(builder, "hc_attrsetvalue2") != null) return;
      var doc;
      var acronymList;
      var testNode;
      var attributes;
      var titleAttr;
      var value;
      var textNode;
      var retval;
      var firstChild;
      var otherChild;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      acronymList = doc.getElementsByTagName("acronym");
      testNode = acronymList.item(3);
      attributes = testNode.attributes;

      titleAttr = attributes.getNamedItem("title");
      textNode = doc.createTextNode("terday");
      retval = titleAttr.appendChild(textNode);
      firstChild = titleAttr.firstChild;

      assertNotNull("attrChildNotNull",firstChild);
      titleAttr.value = "Tomorrow";

      firstChild.nodeValue = "impl reused node";

      value = titleAttr.value;

      assertEquals("attrValue","Tomorrow",value);
      value = titleAttr.nodeValue;

      assertEquals("attrNodeValue","Tomorrow",value);
      firstChild = titleAttr.lastChild;

      value = firstChild.nodeValue;

      assertEquals("firstChildValue","Tomorrow",value);
      otherChild = firstChild.nextSibling;

      assertNull("nextSiblingIsNull",otherChild);

    },
    /**
    * 
    The "getSpecified()" method for an Attr node should 
    be set to true if the attribute was explicitly given
    a value.
    Retrieve the attribute named "domestic" from the last 
    child of of the first employee and examine the value 
    returned by the "getSpecified()" method.  This test uses 
    the "getNamedItem(name)" method from the NamedNodeMap 
    interface.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-862529273
    */
    hc_attrspecifiedvalue : function () {
      var success;
      if(checkInitialization(builder, "hc_attrspecifiedvalue") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var domesticAttr;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(0);
      attributes = testNode.attributes;

      domesticAttr = attributes.getNamedItem("title");
      state = domesticAttr.specified;

      assertTrue("acronymTitleSpecified",state);

    },
    /**
    * 
    The "getSpecified()" method for an Attr node should return true if the 
    value of the attribute is changed. 
    Retrieve the attribute named "class" from the last 
    child of of the THIRD employee and change its 
    value to "Yes"(which is the default DTD value).  This
    should cause the "getSpecified()" method to be true.
    This test uses the "setAttribute(name,value)" method
    from the Element interface and the "getNamedItem(name)"
    method from the NamedNodeMap interface.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-862529273
    */
    hc_attrspecifiedvaluechanged : function () {
      var success;
      if(checkInitialization(builder, "hc_attrspecifiedvaluechanged") != null) return;
      var doc;
      var addressList;
      var testNode;
      var attributes;
      var streetAttr;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      addressList = doc.getElementsByTagName("acronym");
      testNode = addressList.item(2);
      testNode.setAttribute("class","Yα");
      attributes = testNode.attributes;

      streetAttr = attributes.getNamedItem("class");
      state = streetAttr.specified;

      assertTrue("acronymClassSpecified",state);

    },
    /**
    * 
    The "appendData(arg)" method appends a string to the end 
    of the character data of the node.

    Retrieve the character data from the second child 
    of the first employee.  The appendData(arg) method is
    called with arg=", Esquire".  The method should append 
    the specified data to the already existing character  
    data.  The new value return by the "getLength()" method
    should be 24.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
    */
    hc_characterdataappenddata : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataappenddata") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childValue;
      var childLength;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.appendData(", Esquire");
      childValue = child.data;

      childLength = childValue.length;
      assertEquals("characterdataAppendDataAssert",24,childLength);

    },
    /**
    * 
    On successful invocation of the "appendData(arg)" 
    method the "getData()" method provides access to the
    concatentation of data and the specified string.

    Retrieve the character data from the second child 
    of the first employee.  The appendData(arg) method is
    called with arg=", Esquire".  The method should append 
    the specified data to the already existing character  
    data.  The new value return by the "getData()" method
    should be "Margaret Martin, Esquire".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-32791A2F
    */
    hc_characterdataappenddatagetdata : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataappenddatagetdata") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.appendData(", Esquire");
      childData = child.data;

      assertEquals("characterdataAppendDataGetDataAssert","Margaret Martin, Esquire",childData);

    },
    /**
    * 
    The "deleteData(offset,count)" method removes a range of
    characters from the node.  Delete data at the beginning
    of the character data.

    Retrieve the character data from the last child of the
    first employee.  The "deleteData(offset,count)"
    method is then called with offset=0 and count=16.
    The method should delete the characters from position
    0 thru position 16.  The new value of the character data
    should be "Dallas, Texas 98551".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    */
    hc_characterdatadeletedatabegining : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatadeletedatabegining") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.deleteData(0,16);
      childData = child.data;

      assertEquals("data","Dallas, Texas 98551",childData);

    },
    /**
    * 
    The "deleteData(offset,count)" method removes a range of 
    characters from the node.  Delete data at the end 
    of the character data.

    Retrieve the character data from the last child of the
    first employee.  The "deleteData(offset,count)"
    method is then called with offset=30 and count=5.
    The method should delete the characters from position
    30 thru position 35.  The new value of the character data
    should be "1230 North Ave. Dallas, Texas".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    */
    hc_characterdatadeletedataend : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatadeletedataend") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.deleteData(30,5);
      childData = child.data;

      assertEquals("characterdataDeleteDataEndAssert","1230 North Ave. Dallas, Texas ",childData);

    },
    /**
    * 
    If the sum of the offset and count used in the        
    "deleteData(offset,count) method is greater than the
    length of the character data then all the characters
    from the offset to the end of the data are deleted. 

    Retrieve the character data from the last child of the
    first employee.  The "deleteData(offset,count)"
    method is then called with offset=4 and count=50.
    The method should delete the characters from position 4
    to the end of the data since the offset+count(50+4)
    is greater than the length of the character data(35).
    The new value of the character data should be "1230".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    */
    hc_characterdatadeletedataexceedslength : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatadeletedataexceedslength") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.deleteData(4,50);
      childData = child.data;

      assertEquals("characterdataDeleteDataExceedsLengthAssert","1230",childData);

    },
    /**
    * 
    On successful invocation of the "deleteData(offset,count)"
    method, the "getData()" and "getLength()" methods reflect
    the changes. 

    Retrieve the character data from the last child of the
    first employee.  The "deleteData(offset,count)"
    method is then called with offset=30 and count=5.
    The method should delete the characters from position
    30 thru position 35.  The new value of the character data
    should be "1230 North Ave. Dallas, Texas" which is
    returned by the "getData()" method and "getLength()"
    method should return 30".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7D61178C
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    */
    hc_characterdatadeletedatagetlengthanddata : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatadeletedatagetlengthanddata") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;
      var childLength;
      var result = new Array();


      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.deleteData(30,5);
      childData = child.data;

      assertEquals("data","1230 North Ave. Dallas, Texas ",childData);
      childLength = child.length;

      assertEquals("length",30,childLength);

    },
    /**
    * 
    The "deleteData(offset,count)" method removes a range of 
    characters from the node.  Delete data in the middle 
    of the character data.

    Retrieve the character data from the last child of the
    first employee.  The "deleteData(offset,count)"
    method is then called with offset=16 and count=8.
    The method should delete the characters from position
    16 thru position 24.  The new value of the character data
    should be "1230 North Ave. Texas 98551".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    */
    hc_characterdatadeletedatamiddle : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatadeletedatamiddle") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.deleteData(16,8);
      childData = child.data;

      assertEquals("characterdataDeleteDataMiddleAssert","1230 North Ave. Texas 98551",childData);

    },
    /**
    * 

    The "getData()" method retrieves the character data 

    currently stored in the node.

    Retrieve the character data from the second child 

    of the first employee and invoke the "getData()" 

    method.  The method returns the character data 

    string.


    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    */
    hc_characterdatagetdata : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatagetdata") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      childData = child.data;

      assertEquals("characterdataGetDataAssert","Margaret Martin",childData);

    },
    /**
    * 
    The "getLength()" method returns the number of characters 
    stored in this nodes data.
    Retrieve the character data from the second 
    child of the first employee and examine the 
    value returned by the getLength() method.  

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7D61178C
    */
    hc_characterdatagetlength : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatagetlength") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childValue;
      var childLength;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      childValue = child.data;

      childLength = childValue.length;
      assertEquals("characterdataGetLengthAssert",15,childLength);

    },
    /**
    * 
    The "deleteData(offset,count)" method raises an
    INDEX_SIZE_ERR DOMException if the specified count 
    is negative. 

    Retrieve the character data of the last child of the
    first employee and invoke its "deleteData(offset,count)"
    method with offset=10 and count=-3.  It should raise the
    desired exception since the count is negative.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    */
    hc_characterdataindexsizeerrdeletedatacountnegative : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrdeletedatacountnegative") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childSubstring;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          childSubstring = child.substringData(10,-3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throws_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "deleteData(offset,count)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is greater that the number of characters in the string. 

    Retrieve the character data of the last child of the
    first employee and invoke its "deleteData(offset,count)"
    method with offset=40 and count=3.  It should raise the
    desired exception since the offset is greater than the
    number of characters in the string.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
    */
    hc_characterdataindexsizeerrdeletedataoffsetgreater : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrdeletedataoffsetgreater") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          child.deleteData(40,3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throw_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "deleteData(offset,count)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is negative. 

    Retrieve the character data of the last child of the
    first employee and invoke its "deleteData(offset,count)"
    method with offset=-5 and count=3.  It should raise the
    desired exception since the offset is negative.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    */
    hc_characterdataindexsizeerrdeletedataoffsetnegative : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrdeletedataoffsetnegative") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          child.deleteData(-5,3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throws_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "insertData(offset,arg)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is greater than the number of characters in the string. 

    Retrieve the character data of the last child of the
    first employee and invoke its insertData"(offset,arg)"
    method with offset=40 and arg="ABC".  It should raise
    the desired exception since the offset is greater than
    the number of characters in the string.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
    */
    hc_characterdataindexsizeerrinsertdataoffsetgreater : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrinsertdataoffsetgreater") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          child.deleteData(40,3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throw_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "insertData(offset,arg)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is negative. 

    Retrieve the character data of the last child of the
    first employee and invoke its insertData"(offset,arg)"
    method with offset=-5 and arg="ABC".  It should raise
    the desired exception since the offset is negative.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-E5CBA7FB')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    */
    hc_characterdataindexsizeerrinsertdataoffsetnegative : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrinsertdataoffsetnegative") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          child.replaceData(-5,3,"ABC");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throws_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "replaceData(offset,count,arg)" method raises an
    INDEX_SIZE_ERR DOMException if the specified count
    is negative. 

    Retrieve the character data of the last child of the
    first employee and invoke its
    "replaceData(offset,count,arg) method with offset=10
    and count=-3 and arg="ABC".  It should raise the
    desired exception since the count is negative.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    */
    hc_characterdataindexsizeerrreplacedatacountnegative : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrreplacedatacountnegative") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var badString;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          badString = child.substringData(10,-3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throws_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "replaceData(offset,count,arg)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is greater than the length of the string. 

    Retrieve the character data of the last child of the
    first employee and invoke its
    "replaceData(offset,count,arg) method with offset=40
    and count=3 and arg="ABC".  It should raise the
    desired exception since the offset is greater than the
    length of the string.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-7C603781
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-7C603781')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=242
    */
    hc_characterdataindexsizeerrreplacedataoffsetgreater : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrreplacedataoffsetgreater") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          child.deleteData(40,3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throw_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "replaceData(offset,count,arg)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is negative. 

    Retrieve the character data of the last child of the
    first employee and invoke its
    "replaceData(offset,count,arg) method with offset=-5
    and count=3 and arg="ABC".  It should raise the
    desired exception since the offset is negative.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-E5CBA7FB')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    */
    hc_characterdataindexsizeerrreplacedataoffsetnegative : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrreplacedataoffsetnegative") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          child.replaceData(-5,3,"ABC");
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throws_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "substringData(offset,count)" method raises an
    INDEX_SIZE_ERR DOMException if the specified count 
    is negative. 

    Retrieve the character data of the last child of the
    first employee and invoke its "substringData(offset,count)
    method with offset=10 and count=-3.  It should raise the
    desired exception since the count is negative.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    */
    hc_characterdataindexsizeerrsubstringcountnegative : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrsubstringcountnegative") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var badSubstring;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          badSubstring = child.substringData(10,-3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throws_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "substringData(offset,count)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is negative. 

    Retrieve the character data of the last child of the
    first employee and invoke its "substringData(offset,count)
    method with offset=-5 and count=3.  It should raise the
    desired exception since the offset is negative.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    */
    hc_characterdataindexsizeerrsubstringnegativeoffset : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrsubstringnegativeoffset") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var badString;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          badString = child.substringData(-5,3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throws_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "substringData(offset,count)" method raises an
    INDEX_SIZE_ERR DOMException if the specified offset
    is greater than the number of characters in the string.

    Retrieve the character data of the last child of the
    first employee and invoke its "substringData(offset,count)
    method with offset=40 and count=3.  It should raise the
    desired exception since the offsets value is greater
    than the length.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
    */
    hc_characterdataindexsizeerrsubstringoffsetgreater : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdataindexsizeerrsubstringoffsetgreater") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var badString;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;


      {
        success = false;
        try {
          badString = child.substringData(40,3);
        }
        catch(ex) {
          success = (typeof(ex.code) != 'undefined' && ex.code == 1);
        }
        assertTrue("throw_INDEX_SIZE_ERR",success);
      }

    },
    /**
    * 
    The "insertData(offset,arg)" method will insert a string
    at the specified character offset.  Insert the data at
    the beginning of the character data.

    Retrieve the character data from the second child of
    the first employee.  The "insertData(offset,arg)"
    method is then called with offset=0 and arg="Mss.".
    The method should insert the string "Mss." at position 0.
    The new value of the character data should be
    "Mss. Margaret Martin".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
    */
    hc_characterdatainsertdatabeginning : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatainsertdatabeginning") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.insertData(0,"Mss. ");
      childData = child.data;

      assertEquals("characterdataInsertDataBeginningAssert","Mss. Margaret Martin",childData);

    },
    /**
    * 
    The "insertData(offset,arg)" method will insert a string 
    at the specified character offset.  Insert the data at 
    the end of the character data. 

    Retrieve the character data from the second child of  
    the first employee.  The "insertData(offset,arg)"
    method is then called with offset=15 and arg=", Esquire".
    The method should insert the string ", Esquire" at 
    position 15.  The new value of the character data should
    be "Margaret Martin, Esquire".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
    */
    hc_characterdatainsertdataend : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatainsertdataend") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.insertData(15,", Esquire");
      childData = child.data;

      assertEquals("characterdataInsertDataEndAssert","Margaret Martin, Esquire",childData);

    },
    /**
    * 
    The "insertData(offset,arg)" method will insert a string 
    at the specified character offset.  Insert the data in 
    the middle of the character data. 

    Retrieve the character data from the second child of  
    the first employee.  The "insertData(offset,arg)"
    method is then called with offset=9 and arg="Ann".
    The method should insert the string "Ann" at position 9.
    The new value of the character data should be
    "Margaret Ann Martin".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3EDB695F
    */
    hc_characterdatainsertdatamiddle : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatainsertdatamiddle") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.insertData(9,"Ann ");
      childData = child.data;

      assertEquals("characterdataInsertDataMiddleAssert","Margaret Ann Martin",childData);

    },
    /**
    * 
    The "replaceData(offset,count,arg)" method replaces the
    characters starting at the specified offset with the
    specified string.  Test for replacement in the
    middle of the data.

    Retrieve the character data from the last child of the
    first employee.  The "replaceData(offset,count,arg)"
    method is then called with offset=5 and count=5 and
    arg="South".  The method should replace characters five
    thru 9 of the character data with "South".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    */
    hc_characterdatareplacedatabegining : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatareplacedatabegining") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.replaceData(0,4,"2500");
      childData = child.data;

      assertEquals("characterdataReplaceDataBeginingAssert","2500 North Ave. Dallas, Texas 98551",childData);

    },
    /**
    * 
    The "replaceData(offset,count,arg)" method replaces the 
    characters starting at the specified offset with the
    specified string.  Test for replacement at the 
    end of the data.

    Retrieve the character data from the last child of the
    first employee.  The "replaceData(offset,count,arg)"
    method is then called with offset=30 and count=5 and
    arg="98665".  The method should replace characters 30  
    thru 34 of the character data with "98665".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    */
    hc_characterdatareplacedataend : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatareplacedataend") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.replaceData(30,5,"98665");
      childData = child.data;

      assertEquals("characterdataReplaceDataEndAssert","1230 North Ave. Dallas, Texas 98665",childData);

    },
    /**
    * 
    The "replaceData(offset,count,arg)" method replaces the 
    characters starting at the specified offset with the
    specified string.  Test the situation where the length 
    of the arg string is greater than the specified offset.

    Retrieve the character data from the last child of the
    first employee.  The "replaceData(offset,count,arg)"
    method is then called with offset=0 and count=4 and
    arg="260030".  The method should replace characters one  
    thru four with "260030".  Note that the length of the
    specified string is greater that the specified offset.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    */
    hc_characterdatareplacedataexceedslengthofarg : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatareplacedataexceedslengthofarg") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.replaceData(0,4,"260030");
      childData = child.data;

      assertEquals("characterdataReplaceDataExceedsLengthOfArgAssert","260030 North Ave. Dallas, Texas 98551",childData);

    },
    /**
    * 
    If the sum of the offset and count exceeds the length then 
    all the characters to the end of the data are replaced.

    Retrieve the character data from the last child of the
    first employee.  The "replaceData(offset,count,arg)"
    method is then called with offset=0 and count=50 and
    arg="2600".  The method should replace all the characters
    with "2600". This is because the sum of the offset and
    count exceeds the length of the character data.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    */
    hc_characterdatareplacedataexceedslengthofdata : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatareplacedataexceedslengthofdata") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.replaceData(0,50,"2600");
      childData = child.data;

      assertEquals("characterdataReplaceDataExceedsLengthOfDataAssert","2600",childData);

    },
    /**
    * 
    The "replaceData(offset,count,arg)" method replaces the 
    characters starting at the specified offset with the
    specified string.  Test for replacement in the 
    middle of the data.

    Retrieve the character data from the last child of the
    first employee.  The "replaceData(offset,count,arg)"
    method is then called with offset=5 and count=5 and
    arg="South".  The method should replace characters five  
    thru 9 of the character data with "South".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E5CBA7FB
    */
    hc_characterdatareplacedatamiddle : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatareplacedatamiddle") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("acronym");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.replaceData(5,5,"South");
      childData = child.data;

      assertEquals("characterdataReplaceDataMiddleAssert","1230 South Ave. Dallas, Texas 98551",childData);

    },
    /**
    * 
    The "setNodeValue()" method changes the character data 
    currently stored in the node.
    Retrieve the character data from the second child 
    of the first employee and invoke the "setNodeValue()" 
    method, call "getData()" and compare.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-72AB8359
    */
    hc_characterdatasetnodevalue : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatasetnodevalue") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var childData;
      var childValue;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      child.nodeValue = "Marilyn Martin";

      childData = child.data;

      assertEquals("data","Marilyn Martin",childData);
      childValue = child.nodeValue;

      assertEquals("value","Marilyn Martin",childValue);

    },
    /**
    * 
    If the sum of the "offset" and "count" exceeds the
    "length" then the "substringData(offset,count)" method
    returns all the characters to the end of the data. 

    Retrieve the character data from the second child 
    of the first employee and access part of the data 
    by using the substringData(offset,count) method
    with offset=9 and count=10.  The method should return 
    the substring "Martin" since offset+count > length
    (19 > 15).

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
    */
    hc_characterdatasubstringexceedsvalue : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatasubstringexceedsvalue") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var substring;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      substring = child.substringData(9,10);
      assertEquals("characterdataSubStringExceedsValueAssert","Martin",substring);

    },
    /**
    * 
    The "substringData(offset,count)" method returns the 
    specified string.

    Retrieve the character data from the second child 
    of the first employee and access part of the data 
    by using the substringData(offset,count) method.  The
    method should return the specified substring starting 
    at position "offset" and extract "count" characters.
    The method should return the string "Margaret".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
    */
    hc_characterdatasubstringvalue : function () {
      var success;
      if(checkInitialization(builder, "hc_characterdatasubstringvalue") != null) return;
      var doc;
      var elementList;
      var nameNode;
      var child;
      var substring;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.getElementsByTagName("strong");
      nameNode = elementList.item(0);
      child = nameNode.firstChild;

      substring = child.substringData(0,8);
      assertEquals("characterdataSubStringValueAssert","Margaret",substring);

    },
    /**
    * 
    A comment is all the characters between the starting
    '<!--' and ending '-->' 
    Retrieve the nodes of the DOM document.  Search for a 
    comment node and the content is its value.

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1334481328
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=509
    */
    hc_commentgetcomment : function () {
      var success;
      if(checkInitialization(builder, "hc_commentgetcomment") != null) return;
      var doc;
      var elementList;
      var child;
      var childName;
      var childValue;
      var commentCount = 0;
      var childType;
      var attributes;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      elementList = doc.childNodes;

      for(var indexN1005E = 0;indexN1005E < elementList.length; indexN1005E++) {
        child = elementList.item(indexN1005E);
        childType = child.nodeType;


        if(
          (8 == childType)
        ) {
          childName = child.nodeName;

          assertEquals("nodeName","#comment",childName);
          childValue = child.nodeValue;

          assertEquals("nodeValue"," This is comment number 1.",childValue);
          attributes = child.attributes;

          assertNull("attributes",attributes);
          commentCount += 1;

        }

      }
      assertTrue("atMostOneComment",

      (commentCount < 2)
    );

  },
  /**
  * 
  Retrieve the entire DOM document and invoke its 
  "createAttribute(name)" method.  It should create a  
  new Attribute node with the given name. The name, value
  and type of the newly created object are retrieved and
  output.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
  * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
  */
  hc_documentcreateattribute : function () {
    var success;
    if(checkInitialization(builder, "hc_documentcreateattribute") != null) return;
    var doc;
    var newAttrNode;
    var attrValue;
    var attrName;
    var attrType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    newAttrNode = doc.createAttribute("title");
    attrValue = newAttrNode.nodeValue;

    assertEquals("value","",attrValue);
    attrName = newAttrNode.nodeName;

    assertEqualsAutoCase("attribute", "name","title",attrName);
    attrType = newAttrNode.nodeType;

    assertEquals("type",2,attrType);

  },
  /**
  * 
  The "createComment(data)" method creates a new Comment
  node given the specified string. 
  Retrieve the entire DOM document and invoke its 
  "createComment(data)" method.  It should create a new
  Comment node whose "data" is the specified string.
  The content, name and type are retrieved and output.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1334481328
  */
  hc_documentcreatecomment : function () {
    var success;
    if(checkInitialization(builder, "hc_documentcreatecomment") != null) return;
    var doc;
    var newCommentNode;
    var newCommentValue;
    var newCommentName;
    var newCommentType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    newCommentNode = doc.createComment("This is a new Comment node");
    newCommentValue = newCommentNode.nodeValue;

    assertEquals("value","This is a new Comment node",newCommentValue);
    newCommentName = newCommentNode.nodeName;

    assertEquals("strong","#comment",newCommentName);
    newCommentType = newCommentNode.nodeType;

    assertEquals("type",8,newCommentType);

  },
  /**
  * 
  The "createDocumentFragment()" method creates an empty 
  DocumentFragment object.
  Retrieve the entire DOM document and invoke its 
  "createDocumentFragment()" method.  The content, name, 
  type and value of the newly created object are output.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-35CB04B5
  */
  hc_documentcreatedocumentfragment : function () {
    var success;
    if(checkInitialization(builder, "hc_documentcreatedocumentfragment") != null) return;
    var doc;
    var newDocFragment;
    var children;
    var length;
    var newDocFragmentName;
    var newDocFragmentType;
    var newDocFragmentValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    newDocFragment = doc.createDocumentFragment();
    children = newDocFragment.childNodes;

    length = children.length;

    assertEquals("length",0,length);
    newDocFragmentName = newDocFragment.nodeName;

    assertEquals("strong","#document-fragment",newDocFragmentName);
    newDocFragmentType = newDocFragment.nodeType;

    assertEquals("type",11,newDocFragmentType);
    newDocFragmentValue = newDocFragment.nodeValue;

    assertNull("value",newDocFragmentValue);

  },
  /**
  * 
  The "createElement(tagName)" method creates an Element 
  of the type specified.
  Retrieve the entire DOM document and invoke its 
  "createElement(tagName)" method with tagName="acronym".
  The method should create an instance of an Element node
  whose tagName is "acronym".  The NodeName, NodeType 
  and NodeValue are returned.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  */
  hc_documentcreateelement : function () {
    var success;
    if(checkInitialization(builder, "hc_documentcreateelement") != null) return;
    var doc;
    var newElement;
    var newElementName;
    var newElementType;
    var newElementValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    newElement = doc.createElement("acronym");
    newElementName = newElement.nodeName;

    assertEqualsAutoCase("element", "strong","acronym",newElementName);
    newElementType = newElement.nodeType;

    assertEquals("type",1,newElementType);
    newElementValue = newElement.nodeValue;

    assertNull("valueInitiallyNull",newElementValue);

  },
  /**
  * 
  The tagName parameter in the "createElement(tagName)"
  method is case-sensitive for XML documents.
  Retrieve the entire DOM document and invoke its 
  "createElement(tagName)" method twice.  Once for tagName
  equal to "acronym" and once for tagName equal to "ACRONYM"
  Each call should create a distinct Element node.  The
  newly created Elements are then assigned attributes 
  that are retrieved.

  Modified on 27 June 2003 to avoid setting an invalid style
  values and checked the node names to see if they matched expectations.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
  */
  hc_documentcreateelementcasesensitive : function () {
    var success;
    if(checkInitialization(builder, "hc_documentcreateelementcasesensitive") != null) return;
    var doc;
    var newElement1;
    var newElement2;
    var attribute1;
    var attribute2;
    var nodeName1;
    var nodeName2;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    newElement1 = doc.createElement("ACRONYM");
    newElement2 = doc.createElement("acronym");
    newElement1.setAttribute("lang","EN");
    newElement2.setAttribute("title","Dallas");
    attribute1 = newElement1.getAttribute("lang");
    attribute2 = newElement2.getAttribute("title");
    assertEquals("attrib1","EN",attribute1);
    assertEquals("attrib2","Dallas",attribute2);
    nodeName1 = newElement1.nodeName;

    nodeName2 = newElement2.nodeName;

    assertEqualsAutoCase("element", "nodeName1","ACRONYM",nodeName1);
    assertEqualsAutoCase("element", "nodeName2","acronym",nodeName2);

  },
  /**
  * 
  The "createTextNode(data)" method creates a Text node 
  given the specfied string.
  Retrieve the entire DOM document and invoke its 
  "createTextNode(data)" method.  It should create a 
  new Text node whose "data" is the specified string.
  The NodeName and NodeType are also checked.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1975348127
  */
  hc_documentcreatetextnode : function () {
    var success;
    if(checkInitialization(builder, "hc_documentcreatetextnode") != null) return;
    var doc;
    var newTextNode;
    var newTextName;
    var newTextValue;
    var newTextType;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    newTextNode = doc.createTextNode("This is a new Text node");
    newTextValue = newTextNode.nodeValue;

    assertEquals("value","This is a new Text node",newTextValue);
    newTextName = newTextNode.nodeName;

    assertEquals("strong","#text",newTextName);
    newTextType = newTextNode.nodeType;

    assertEquals("type",3,newTextType);

  },
  /**
  * 
  Access Document.doctype for hc_staff, if not text/html should return DocumentType node.
  HTML implementations may return null.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
  */
  hc_documentgetdoctype : function () {
    var success;
    if(checkInitialization(builder, "hc_documentgetdoctype") != null) return;
    var doc;
    var docType;
    var docTypeName;
    var nodeValue;
    var attributes;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    docType = doc.doctype;


    if(!((builder.contentType == "text/html"))) {
      assertNotNull("docTypeNotNull",docType);
    }

    if((docType != null)) {
      docTypeName = docType.name;
      if((builder.contentType == "image/svg+xml")) {
        assertEquals("nodeNameSVG","svg",docTypeName);
      } else if (builder.contentType === "text/xml") {
        
        // this was not an xml test originally.
      } else {
        assertEquals("nodeName","html",docTypeName);
      }
      nodeValue = docType.nodeValue;

      assertNull("nodeValue",nodeValue);
      attributes = docType.attributes;

      assertNull("attributes",attributes);

    }

  },
  /**
  * 
  The "getElementsByTagName(tagName)" method returns a 
  NodeList of all the Elements with a given tagName.

  Retrieve the entire DOM document and invoke its 
  "getElementsByTagName(tagName)" method with tagName
  equal to "strong".  The method should return a NodeList 
  that contains 5 elements.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-A6C9094
  */
  hc_documentgetelementsbytagnamelength : function () {
    var success;
    if(checkInitialization(builder, "hc_documentgetelementsbytagnamelength") != null) return;
    var doc;
    var nameList;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    nameList = doc.getElementsByTagName("strong");
    assertSize("documentGetElementsByTagNameLengthAssert",5,nameList);

  },
  /**
  * 
  Retrieve the entire DOM document and invoke its 
  "getElementsByTagName(tagName)" method with tagName
  equal to "*".  The method should return a NodeList 
  that contains all the elements of the document. 

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-A6C9094
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
  */
  hc_documentgetelementsbytagnametotallength : function () {
    var success;
    if(checkInitialization(builder, "hc_documentgetelementsbytagnametotallength") != null) return;
    var doc;
    var nameList;
    expectedNames = new Array();
    expectedNames[0] = "html";
    expectedNames[1] = "head";
    expectedNames[2] = "meta";
    expectedNames[3] = "title";
    expectedNames[4] = "script";
    expectedNames[5] = "script";
    expectedNames[6] = "script";
    expectedNames[7] = "body";
    expectedNames[8] = "p";
    expectedNames[9] = "em";
    expectedNames[10] = "strong";
    expectedNames[11] = "code";
    expectedNames[12] = "sup";
    expectedNames[13] = "var";
    expectedNames[14] = "acronym";
    expectedNames[15] = "p";
    expectedNames[16] = "em";
    expectedNames[17] = "strong";
    expectedNames[18] = "code";
    expectedNames[19] = "sup";
    expectedNames[20] = "var";
    expectedNames[21] = "acronym";
    expectedNames[22] = "p";
    expectedNames[23] = "em";
    expectedNames[24] = "strong";
    expectedNames[25] = "code";
    expectedNames[26] = "sup";
    expectedNames[27] = "var";
    expectedNames[28] = "acronym";
    expectedNames[29] = "p";
    expectedNames[30] = "em";
    expectedNames[31] = "strong";
    expectedNames[32] = "code";
    expectedNames[33] = "sup";
    expectedNames[34] = "var";
    expectedNames[35] = "acronym";
    expectedNames[36] = "p";
    expectedNames[37] = "em";
    expectedNames[38] = "strong";
    expectedNames[39] = "code";
    expectedNames[40] = "sup";
    expectedNames[41] = "var";
    expectedNames[42] = "acronym";

    svgExpectedNames = new Array();
    svgExpectedNames[0] = "svg";
    svgExpectedNames[1] = "rect";
    svgExpectedNames[2] = "script";
    svgExpectedNames[3] = "head";
    svgExpectedNames[4] = "meta";
    svgExpectedNames[5] = "title";
    svgExpectedNames[6] = "body";
    svgExpectedNames[7] = "p";
    svgExpectedNames[8] = "em";
    svgExpectedNames[9] = "strong";
    svgExpectedNames[10] = "code";
    svgExpectedNames[11] = "sup";
    svgExpectedNames[12] = "var";
    svgExpectedNames[13] = "acronym";
    svgExpectedNames[14] = "p";
    svgExpectedNames[15] = "em";
    svgExpectedNames[16] = "strong";
    svgExpectedNames[17] = "code";
    svgExpectedNames[18] = "sup";
    svgExpectedNames[19] = "var";
    svgExpectedNames[20] = "acronym";
    svgExpectedNames[21] = "p";
    svgExpectedNames[22] = "em";
    svgExpectedNames[23] = "strong";
    svgExpectedNames[24] = "code";
    svgExpectedNames[25] = "sup";
    svgExpectedNames[26] = "var";
    svgExpectedNames[27] = "acronym";
    svgExpectedNames[28] = "p";
    svgExpectedNames[29] = "em";
    svgExpectedNames[30] = "strong";
    svgExpectedNames[31] = "code";
    svgExpectedNames[32] = "sup";
    svgExpectedNames[33] = "var";
    svgExpectedNames[34] = "acronym";
    svgExpectedNames[35] = "p";
    svgExpectedNames[36] = "em";
    svgExpectedNames[37] = "strong";
    svgExpectedNames[38] = "code";
    svgExpectedNames[39] = "sup";
    svgExpectedNames[40] = "var";
    svgExpectedNames[41] = "acronym";

    var actualNames = new Array();

    var thisElement;
    var thisTag;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    nameList = doc.getElementsByTagName("*");
    for(var indexN10148 = 0;indexN10148 < nameList.length; indexN10148++) {
      thisElement = nameList.item(indexN10148);
      thisTag = thisElement.tagName;

      actualNames[actualNames.length] = thisTag;

    }

    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertEqualsListAutoCase("element", "svgTagNames",svgExpectedNames,actualNames);

    }

    else {
      assertEqualsListAutoCase("element", "tagNames",expectedNames,actualNames);

    }

  },
  /**
  * 
  The "getElementsByTagName(tagName)" method returns a 
  NodeList of all the Elements with a given tagName
  in a pre-order traversal of the tree.

  Retrieve the entire DOM document and invoke its 
  "getElementsByTagName(tagName)" method with tagName
  equal to "strong".  The method should return a NodeList 
  that contains 5 elements.  The FOURTH item in the
  list is retrieved and output.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-A6C9094
  */
  hc_documentgetelementsbytagnamevalue : function () {
    var success;
    if(checkInitialization(builder, "hc_documentgetelementsbytagnamevalue") != null) return;
    var doc;
    var nameList;
    var nameNode;
    var firstChild;
    var childValue;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    nameList = doc.getElementsByTagName("strong");
    nameNode = nameList.item(3);
    firstChild = nameNode.firstChild;

    childValue = firstChild.nodeValue;

    assertEquals("documentGetElementsByTagNameValueAssert","Jeny Oconnor",childValue);

  },
  /**
  * 
  Retrieve the entire DOM document and invoke its 
  "getImplementation()" method.  If contentType="text/html", 
  DOMImplementation.hasFeature("HTML","1.0") should be true.  
  Otherwise, DOMImplementation.hasFeature("XML", "1.0")
  should be true.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1B793EBA
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=245
  */
  hc_documentgetimplementation : function () {
    var success;
    if(checkInitialization(builder, "hc_documentgetimplementation") != null) return;
    var doc;
    var docImpl;
    var xmlstate;
    var htmlstate;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    docImpl = doc.implementation;
    xmlstate = docImpl.hasFeature("XML","1.0");
    htmlstate = docImpl.hasFeature("HTML","1.0");

    if(

      (builder.contentType == "text/html")

    ) {
      assertTrue("supports_HTML_1.0",htmlstate);

    }

    else {
      assertTrue("supports_XML_1.0",xmlstate);

    }

  },
  /**
  * 
  Load a document and invoke its 
  "getDocumentElement()" method.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-87CD092
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
  */
  hc_documentgetrootnode : function () {
    var success;
    if(checkInitialization(builder, "hc_documentgetrootnode") != null) return;
    var doc;
    var root;
    var rootName;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    root = doc.documentElement;

    rootName = root.nodeName;


    if(

      (builder.contentType == "image/svg+xml")

    ) {
      assertEquals("svgTagName","svg",rootName);

    }

    else {
      assertEqualsAutoCase("element", "docElemName","html",rootName);

    }

  },
  /**
  * 
  The "createAttribute(tagName)" method raises an
  INVALID_CHARACTER_ERR DOMException if the specified
  tagName contains an invalid character. 

  Retrieve the entire DOM document and invoke its 
  "createAttribute(tagName)" method with the tagName equal
  to the string "invalid^Name".  Due to the invalid 
  character the desired EXCEPTION should be raised.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1084891198')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  hc_documentinvalidcharacterexceptioncreateattribute : function () {
    var success;
    if(checkInitialization(builder, "hc_documentinvalidcharacterexceptioncreateattribute") != null) return;
    var doc;
    var createdAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    {
      success = false;
      try {
        createdAttr = doc.createAttribute("invalid^Name");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 5);
      }
      assertTrue("throw_INVALID_CHARACTER_ERR",success);
    }

  },
  /**
  * 
  Creating an attribute with an empty name should cause an INVALID_CHARACTER_ERR.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1084891198')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1084891198
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
  */
  hc_documentinvalidcharacterexceptioncreateattribute1 : function () {
    var success;
    if(checkInitialization(builder, "hc_documentinvalidcharacterexceptioncreateattribute1") != null) return;
    var doc;
    var createdAttr;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    {
      success = false;
      try {
        createdAttr = doc.createAttribute("");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 5);
      }
      assertTrue("throw_INVALID_CHARACTER_ERR",success);
    }

  },
  /**
  * 
  The "createElement(tagName)" method raises an
  INVALID_CHARACTER_ERR DOMException if the specified
  tagName contains an invalid character. 

  Retrieve the entire DOM document and invoke its 
  "createElement(tagName)" method with the tagName equal
  to the string "invalid^Name".  Due to the invalid 
  character the desired EXCEPTION should be raised.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-2141741547')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
  */
  hc_documentinvalidcharacterexceptioncreateelement : function () {
    var success;
    if(checkInitialization(builder, "hc_documentinvalidcharacterexceptioncreateelement") != null) return;
    var doc;
    var badElement;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    {
      success = false;
      try {
        badElement = doc.createElement("invalid^Name");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 5);
      }
      assertTrue("throw_INVALID_CHARACTER_ERR",success);
    }

  },
  /**
  * 
  Creating an element with an empty name should cause an INVALID_CHARACTER_ERR.

  * @author Curt Arnold
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-2141741547')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
  * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-2141741547
  * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
  */
  hc_documentinvalidcharacterexceptioncreateelement1 : function () {
    var success;
    if(checkInitialization(builder, "hc_documentinvalidcharacterexceptioncreateelement1") != null) return;
    var doc;
    var badElement;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");

    {
      success = false;
      try {
        badElement = doc.createElement("");
      }
      catch(ex) {
        success = (typeof(ex.code) != 'undefined' && ex.code == 5);
      }
      assertTrue("throw_INVALID_CHARACTER_ERR",success);
    }

  },
  /**
  * 
  Load a document and invoke its 
  "getImplementation()" method.  This should create a
  DOMImplementation object whose "hasFeature(feature,
    version)" method is invoked with version equal to "".
    If the version is not specified, supporting any version
    feature will cause the method to return "true".

    * @author Curt Arnold
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
    * @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
    * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=245
    */
    hc_domimplementationfeaturenoversion : function () {
      var success;
      if(checkInitialization(builder, "hc_domimplementationfeaturenoversion") != null) return;
      var doc;
      var domImpl;
      var state;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domImpl = doc.implementation;

      if(

        (builder.contentType == "text/html")

      ) {
        state = domImpl.hasFeature("HTML","");

      }

      else {
        state = domImpl.hasFeature("XML","");

      }
      assertTrue("hasFeatureBlank",state);

    },
    /**
    * 
    Load a document and invoke its 
    "getImplementation()" method.  This should create a
    DOMImplementation object whose "hasFeature(feature,
      version)" method is invoked with version equal to null.
      If the version is not specified, supporting any version
      feature will cause the method to return "true".

      * @author Curt Arnold
      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
      * @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=245
      */
      hc_domimplementationfeaturenull : function () {
        var success;
        if(checkInitialization(builder, "hc_domimplementationfeaturenull") != null) return;
        var doc;
        var domImpl;
        var state;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "hc_staff");
        domImpl = doc.implementation;

        if(

          (builder.contentType == "text/html")

        ) {
          state = domImpl.hasFeature("HTML",null);
          assertTrue("supports_HTML_null",state);

        }

        else {
          state = domImpl.hasFeature("XML",null);
          assertTrue("supports_XML_null",state);

        }

      },
      /**
      * 
      Retrieve the entire DOM document and invoke its 
      "getImplementation()" method.  This should create a
      DOMImplementation object whose "hasFeature(feature,
        version)" method is invoked with "feature" equal to "html" or "xml".
        The method should return a boolean "true".

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=245
        */
        hc_domimplementationfeaturexml : function () {
          var success;
          if(checkInitialization(builder, "hc_domimplementationfeaturexml") != null) return;
          var doc;
          var domImpl;
          var state;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          domImpl = doc.implementation;

          if(

            (builder.contentType == "text/html")

          ) {
            state = domImpl.hasFeature("html","1.0");
            assertTrue("supports_html_1.0",state);

          }

          else {
            state = domImpl.hasFeature("xml","1.0");
            assertTrue("supports_xml_1.0",state);

          }

        },
        /**
        * 
        The "setAttribute(name,value)" method adds a new attribute
        to the Element 

        Retrieve the last child of the last employee, then 
        add an attribute to it by invoking the             
        "setAttribute(name,value)" method.  It should create
        a "strong" attribute with an assigned value equal to 
        "value".

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
        */
        hc_elementaddnewattribute : function () {
          var success;
          if(checkInitialization(builder, "hc_elementaddnewattribute") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var attrValue;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(4);
          testEmployee.setAttribute("lang","EN-us");
          attrValue = testEmployee.getAttribute("lang");
          assertEquals("attrValue","EN-us",attrValue);

        },
        /**
        * 
        Retrieve the first attribute from the last child of
        the first employee and invoke the "getSpecified()" 
        method.  This test is only intended to show that   
        Elements can actually have attributes.  This test uses  
        the "getNamedItem(name)" method from the NamedNodeMap
        interface.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
        */
        hc_elementassociatedattribute : function () {
          var success;
          if(checkInitialization(builder, "hc_elementassociatedattribute") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var attributes;
          var domesticAttr;
          var specified;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(0);
          attributes = testEmployee.attributes;

          domesticAttr = attributes.getNamedItem("title");
          specified = domesticAttr.specified;

          assertTrue("acronymTitleSpecified",specified);

        },
        /**
        * 
        The "setAttribute(name,value)" method adds a new attribute
        to the Element.  If the "strong" is already present, then
        its value should be changed to the new one that is in
        the "value" parameter. 

        Retrieve the last child of the fourth employee, then add 
        an attribute to it by invoking the 
        "setAttribute(name,value)" method.  Since the name of the
        used attribute("class") is already present in this     
        element, then its value should be changed to the new one
        of the "value" parameter.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
        */
        hc_elementchangeattributevalue : function () {
          var success;
          if(checkInitialization(builder, "hc_elementchangeattributevalue") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var attrValue;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(3);
          testEmployee.setAttribute("class","Neither");
          attrValue = testEmployee.getAttribute("class");
          assertEquals("elementChangeAttributeValueAssert","Neither",attrValue);

        },
        /**
        * 
        The "setAttributeNode(newAttr)" method adds a new 
        attribute to the Element.  

        Retrieve first address element and add
        a new attribute node to it by invoking its         
        "setAttributeNode(newAttr)" method.  This test makes use
        of the "createAttribute(name)" method from the Document
        interface.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
        */
        hc_elementcreatenewattribute : function () {
          var success;
          if(checkInitialization(builder, "hc_elementcreatenewattribute") != null) return;
          var doc;
          var elementList;
          var testAddress;
          var newAttribute;
          var oldAttr;
          var districtAttr;
          var attrVal;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testAddress = elementList.item(0);
          newAttribute = doc.createAttribute("lang");
          oldAttr = testAddress.setAttributeNode(newAttribute);
          assertNull("old_attr_doesnt_exist",oldAttr);
          districtAttr = testAddress.getAttributeNode("lang");
          assertNotNull("new_district_accessible",districtAttr);
          attrVal = testAddress.getAttribute("lang");
          assertEquals("attr_value","",attrVal);

        },
        /**
        * 
        Retrieve the attribute "title" from the last child
        of the first "p" element and check its node name.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-217A91B8
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
        * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
        */
        hc_elementgetattributenode : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgetattributenode") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var domesticAttr;
          var nodeName;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(0);
          domesticAttr = testEmployee.getAttributeNode("title");
          nodeName = domesticAttr.nodeName;

          assertEqualsAutoCase("attribute", "nodeName","title",nodeName);

        },
        /**
        * 
        The "getAttributeNode(name)" method retrieves an
        attribute node by name.  It should return null if the
        "strong" attribute does not exist.

        Retrieve the last child of the first employee and attempt
        to retrieve a non-existing attribute.  The method should
        return "null".  The non-existing attribute to be used
        is "invalidAttribute".

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-217A91B8
        */
        hc_elementgetattributenodenull : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgetattributenodenull") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var domesticAttr;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(0);
          domesticAttr = testEmployee.getAttributeNode("invalidAttribute");
          assertNull("elementGetAttributeNodeNullAssert",domesticAttr);

        },
        /**
        * 
        The "getAttribute(name)" method returns an empty 
        string if no value was assigned to an attribute and 
        no default value was given in the DTD file.

        Retrieve the last child of the last employee, then
        invoke "getAttribute(name)" method, where "strong" is an
        attribute without a specified or DTD default value. 
        The "getAttribute(name)" method should return the empty
        string.  This method makes use of the
        "createAttribute(newAttr)" method from the Document
        interface.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-666EE0F9
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
        */
        hc_elementgetelementempty : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgetelementempty") != null) return;
          var doc;
          var newAttribute;
          var elementList;
          var testEmployee;
          var domesticAttr;
          var attrValue;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          newAttribute = doc.createAttribute("lang");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(3);
          domesticAttr = testEmployee.setAttributeNode(newAttribute);
          attrValue = testEmployee.getAttribute("lang");
          assertEquals("elementGetElementEmptyAssert","",attrValue);

        },
        /**
        * 
        The "getElementsByTagName(name)" method returns a list
        of all descendant Elements with the given tag name.
        Test for an empty list.

        Create a NodeList of all the descendant elements
        using the string "noMatch" as the tagName.
        The method should return a NodeList whose length is
        "0" since there are not any descendant elements
        that match the given tag name.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
        */
        hc_elementgetelementsbytagname : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgetelementsbytagname") != null) return;
          var doc;
          var elementList;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("p");
          assertSize("elementGetElementsByTagNameAssert",5,elementList);

        },
        /**
        * 
        The "getElementsByTagName(name)" method returns a list
        of all descendant Elements in the order the children
        were encountered in a pre order traversal of the element
        tree.

        Create a NodeList of all the descendant elements
        using the string "p" as the tagName.
        The method should return a NodeList whose length is
        "5" in the order the children were encountered.
        Access the FOURTH element in the NodeList.  The FOURTH
        element, the first or second should be an "em" node with
        the content "EMP0004".

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
        */
        hc_elementgetelementsbytagnameaccessnodelist : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgetelementsbytagnameaccessnodelist") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var firstC;
          var childName;
          var nodeType;
          var employeeIDNode;
          var employeeID;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("p");
          testEmployee = elementList.item(3);
          firstC = testEmployee.firstChild;

          nodeType = firstC.nodeType;


          while(
            (3 == nodeType)
          ) {
            firstC = firstC.nextSibling;

            nodeType = firstC.nodeType;


          }
          childName = firstC.nodeName;

          assertEqualsAutoCase("element", "childName","em",childName);
          employeeIDNode = firstC.firstChild;

          employeeID = employeeIDNode.nodeValue;

          assertEquals("employeeID","EMP0004",employeeID);

        },
        /**
        * 
        The "getElementsByTagName(name)" method returns a list
        of all descendant Elements with the given tag name.

        Create a NodeList of all the descendant elements
        using the string "employee" as the tagName.
        The method should return a NodeList whose length is
        "5".

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
        */
        hc_elementgetelementsbytagnamenomatch : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgetelementsbytagnamenomatch") != null) return;
          var doc;
          var elementList;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("noMatch");
          assertSize("elementGetElementsByTagNameNoMatchNoMatchAssert",0,elementList);

        },
        /**
        * 
        The "getElementsByTagName(name)" method may use the
        special value "*" to match all tags in the element
        tree.

        Create a NodeList of all the descendant elements
        of the last employee by using the special value "*".
        The method should return all the descendant children(6)
        in the order the children were encountered.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
        */
        hc_elementgetelementsbytagnamespecialvalue : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgetelementsbytagnamespecialvalue") != null) return;
          var doc;
          var elementList;
          var lastEmployee;
          var lastempList;
          var child;
          var childName;
          var result = new Array();

          expectedResult = new Array();
          expectedResult[0] = "em";
          expectedResult[1] = "strong";
          expectedResult[2] = "code";
          expectedResult[3] = "sup";
          expectedResult[4] = "var";
          expectedResult[5] = "acronym";


          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("p");
          lastEmployee = elementList.item(4);
          lastempList = lastEmployee.getElementsByTagName("*");
          for(var indexN10067 = 0;indexN10067 < lastempList.length; indexN10067++) {
            child = lastempList.item(indexN10067);
            childName = child.nodeName;

            result[result.length] = childName;

          }
          assertEqualsListAutoCase("element", "tagNames",expectedResult,result);

        },
        /**
        * 
        Invoke the "getTagName()" method one the 
        root node. The value returned should be "html" or "svg". 

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-104682815
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
        */
        hc_elementgettagname : function () {
          var success;
          if(checkInitialization(builder, "hc_elementgettagname") != null) return;
          var doc;
          var root;
          var tagname;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          root = doc.documentElement;

          tagname = root.tagName;


          if(

            (builder.contentType == "image/svg+xml")

          ) {
            assertEquals("svgTagname","svg",tagname);

          }

          else {
            assertEqualsAutoCase("element", "tagname","html",tagname);

          }

        },
        /**
        * 
        The "setAttributeNode(newAttr)" method raises an 
        "INUSE_ATTRIBUTE_ERR DOMException if the "newAttr" 
        is already an attribute of another element.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-887236154')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=244
        */
        hc_elementinuseattributeerr : function () {
          var success;
          if(checkInitialization(builder, "hc_elementinuseattributeerr") != null) return;
          var doc;
          var newAttribute;
          var addressElementList;
          var testAddress;
          var newElement;
          var attrAddress;
          var appendedChild;
          var setAttr1;
          var setAttr2;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          addressElementList = doc.getElementsByTagName("body");
          testAddress = addressElementList.item(0);
          newElement = doc.createElement("p");
          appendedChild = testAddress.appendChild(newElement);
          newAttribute = doc.createAttribute("title");
          setAttr1 = newElement.setAttributeNode(newAttribute);

          {
            success = false;
            try {
              setAttr2 = testAddress.setAttributeNode(newAttribute);
            }
            catch(ex) {
              success = (typeof(ex.code) != 'undefined' && ex.code == 10);
            }
            assertTrue("throw_INUSE_ATTRIBUTE_ERR",success);
          }

        },
        /**
        * 
        The "setAttribute(name,value)" method raises an 
        "INVALID_CHARACTER_ERR DOMException if the specified 
        name contains an invalid character.   

        Retrieve the last child of the first employee and 
        call its "setAttribute(name,value)" method with    
        "strong" containing an invalid character. 

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68F082')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
        */
        hc_elementinvalidcharacterexception : function () {
          var success;
          if(checkInitialization(builder, "hc_elementinvalidcharacterexception") != null) return;
          var doc;
          var elementList;
          var testAddress;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testAddress = elementList.item(0);

          {
            success = false;
            try {
              testAddress.setAttribute("invalid^Name","value");
            }
            catch(ex) {
              success = (typeof(ex.code) != 'undefined' && ex.code == 5);
            }
            assertTrue("throw_INVALID_CHARACTER_ERR",success);
          }

        },
        /**
        * 
        Calling Element.setAttribute with an empty name will cause an INVALID_CHARACTER_ERR.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68F082')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
        */
        hc_elementinvalidcharacterexception1 : function () {
          var success;
          if(checkInitialization(builder, "hc_elementinvalidcharacterexception1") != null) return;
          var doc;
          var elementList;
          var testAddress;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testAddress = elementList.item(0);

          {
            success = false;
            try {
              testAddress.setAttribute("","value");
            }
            catch(ex) {
              success = (typeof(ex.code) != 'undefined' && ex.code == 5);
            }
            assertTrue("throw_INVALID_CHARACTER_ERR",success);
          }

        },
        /**
        * 
        Append a couple of text nodes to the first sup element, normalize the
        document element and check that the element has been normalized.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-162CF083
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=546
        */
        hc_elementnormalize : function () {
          var success;
          if(checkInitialization(builder, "hc_elementnormalize") != null) return;
          var doc;
          var root;
          var elementList;
          var testName;
          var firstChild;
          var childValue;
          var textNode;
          var retNode;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("sup");
          testName = elementList.item(0);
          textNode = doc.createTextNode("");
          retNode = testName.appendChild(textNode);
          textNode = doc.createTextNode(",000");
          retNode = testName.appendChild(textNode);
          root = doc.documentElement;

          root.normalize();
          elementList = doc.getElementsByTagName("sup");
          testName = elementList.item(0);
          firstChild = testName.firstChild;

          childValue = firstChild.nodeValue;

          assertEquals("elementNormalizeAssert","56,000,000",childValue);

        },
        /**
        * 
        Add an empty text node to an existing attribute node, normalize the containing element
        and check that the attribute node has eliminated the empty text.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-162CF083
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=482
        */
        hc_elementnormalize2 : function () {
          var success;
          if(checkInitialization(builder, "hc_elementnormalize2") != null) return;
          var doc;
          var root;
          var elementList;
          var element;
          var firstChild;
          var secondChild;
          var childValue;
          var emptyText;
          var attrNode;
          var retval;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          root = doc.documentElement;

          emptyText = doc.createTextNode("");
          elementList = root.getElementsByTagName("acronym");
          element = elementList.item(0);
          attrNode = element.getAttributeNode("title");
          retval = attrNode.appendChild(emptyText);
          element.normalize();
          attrNode = element.getAttributeNode("title");
          firstChild = attrNode.firstChild;

          childValue = firstChild.nodeValue;

          assertEquals("firstChild","Yes",childValue);
          secondChild = firstChild.nextSibling;

          assertNull("secondChildNull",secondChild);

        },
        /**
        * 
        The "removeAttributeNode(oldAttr)" method raises a
        NOT_FOUND_ERR DOMException if the "oldAttr" attribute
        is not an attribute of the element.

        Retrieve the last employee and attempt to remove
        a non existing attribute node.  This should cause the
        intended exception to be raised.  This test makes use
        of the "createAttribute(name)" method from the Document 
        interface.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-D589198')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
        */
        hc_elementnotfounderr : function () {
          var success;
          if(checkInitialization(builder, "hc_elementnotfounderr") != null) return;
          var doc;
          var oldAttribute;
          var addressElementList;
          var testAddress;
          var attrAddress;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          addressElementList = doc.getElementsByTagName("acronym");
          testAddress = addressElementList.item(4);
          oldAttribute = doc.createAttribute("title");

          {
            success = false;
            try {
              attrAddress = testAddress.removeAttributeNode(oldAttribute);
            }
            catch(ex) {
              success = (typeof(ex.code) != 'undefined' && ex.code == 8);
            }
            assertTrue("throw_NOT_FOUND_ERR",success);
          }

        },
        /**
        * 
        The "removeAttribute(name)" removes an attribute by name.
        If the attribute has a default value, it is immediately
        replaced.  However, there is no default values in the HTML
        compatible tests, so its value is "".

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D6AC0F9
        * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
        */
        hc_elementremoveattribute : function () {
          var success;
          if(checkInitialization(builder, "hc_elementremoveattribute") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var attrValue;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(3);
          testEmployee.removeAttribute("class");
          attrValue = testEmployee.getAttribute("class");
          assertEquals("attrValue","",attrValue);

        },
        /**
        * 
        The "removeAttributeNode(oldAttr)" method removes the 
        specified attribute. 

        Retrieve the last child of the third employee, add a
        new "lang" attribute to it and then try to remove it. 
        To verify that the node was removed use the
        "getNamedItem(name)" method from the NamedNodeMap
        interface.  It also uses the "getAttributes()" method
        from the Node interface.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
        * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
        */
        hc_elementremoveattributeaftercreate : function () {
          var success;
          if(checkInitialization(builder, "hc_elementremoveattributeaftercreate") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var newAttribute;
          var attributes;
          var districtAttr;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(2);
          newAttribute = doc.createAttribute("lang");
          districtAttr = testEmployee.setAttributeNode(newAttribute);
          districtAttr = testEmployee.removeAttributeNode(newAttribute);
          attributes = testEmployee.attributes;

          districtAttr = attributes.getNamedItem("lang");
          assertNull("removed_item_null",districtAttr);

        },
        /**
        * 
        The "removeAttributeNode(oldAttr)" method returns the
        node that was removed. 

        Retrieve the last child of the third employee and
        remove its "class" Attr node.  The method should  
        return the old attribute node.

        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D589198
        */
        hc_elementremoveattributenode : function () {
          var success;
          if(checkInitialization(builder, "hc_elementremoveattributenode") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var streetAttr;
          var removedAttr;
          var removedValue;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(2);
          streetAttr = testEmployee.getAttributeNode("class");
          removedAttr = testEmployee.removeAttributeNode(streetAttr);
          assertNotNull("removedAttrNotNull",removedAttr);
          removedValue = removedAttr.value;

          assertEquals("elementRemoveAttributeNodeAssert","No",removedValue);

        },
        /**
        * 
        This test calls setAttributeNode to replace an attribute with itself.  
        Since the node is not an attribute of another Element, it would
        be inappropriate to throw an INUSE_ATTRIBUTE_ERR.

        This test was derived from elementinuserattributeerr which
        inadvertanly made this test.

        * @author Curt Arnold
        * @author Curt Arnold
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
        */
        hc_elementreplaceattributewithself : function () {
          var success;
          if(checkInitialization(builder, "hc_elementreplaceattributewithself") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var streetAttr;
          var replacedAttr;
          var value;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "hc_staff");
          elementList = doc.getElementsByTagName("acronym");
          testEmployee = elementList.item(2);
          streetAttr = testEmployee.getAttributeNode("class");
          replacedAttr = testEmployee.setAttributeNode(streetAttr);
          assertSame("replacedAttr",streetAttr,replacedAttr);

        },
        /**
        * 
        The "setAttributeNode(newAttr)" method adds a new
        attribute to the Element.  If the "newAttr" Attr node is
        already present in this element, it should replace the
        existing one. 

        Retrieve the last child of the third employee and add a 
        new attribute node by invoking the "setAttributeNode(new 
          Attr)" method.  The new attribute node to be added is 
          "class", which is already present in this element.  The
          method should replace the existing Attr node with the 
          new one.  This test uses the "createAttribute(name)"
          method from the Document interface. 

          * @author Curt Arnold
          */
          hc_elementreplaceexistingattribute : function () {
            var success;
            if(checkInitialization(builder, "hc_elementreplaceexistingattribute") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var newAttribute;
            var strong;
            var setAttr;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(2);
            newAttribute = doc.createAttribute("class");
            setAttr = testEmployee.setAttributeNode(newAttribute);
            strong = testEmployee.getAttribute("class");
            assertEquals("replacedValue","",strong);

          },
          /**
          * 
          If the "setAttributeNode(newAttr)" method replaces an
          existing Attr node with the same name, then it should
          return the previously existing Attr node.

          Retrieve the last child of the third employee and add a
          new attribute node.  The new attribute node is "class",
          which is already present in this Element.  The method
          should return the existing Attr node(old "class" Attr).
          This test uses the "createAttribute(name)" method
          from the Document interface.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
          */
          hc_elementreplaceexistingattributegevalue : function () {
            var success;
            if(checkInitialization(builder, "hc_elementreplaceexistingattributegevalue") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var newAttribute;
            var streetAttr;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(2);
            newAttribute = doc.createAttribute("class");
            streetAttr = testEmployee.setAttributeNode(newAttribute);
            assertNotNull("previousAttrNotNull",streetAttr);
            value = streetAttr.value;

            assertEquals("previousAttrValue","No",value);

          },
          /**
          * 
          Create a list of all the attributes of the last child
          of the first "p" element by using the "getAttributes()"
          method.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=184
          */
          hc_elementretrieveallattributes : function () {
            var success;
            if(checkInitialization(builder, "hc_elementretrieveallattributes") != null) return;
            var doc;
            var addressList;
            var testAddress;
            var attributes;
            var attribute;
            var attributeName;
            var actual = new Array();

            htmlExpected = new Array();
            htmlExpected[0] = "title";

            expected = new Array();
            expected[0] = "title";
            expected[1] = "dir";


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            addressList = doc.getElementsByTagName("acronym");
            testAddress = addressList.item(0);
            attributes = testAddress.attributes;

            for(var indexN1006B = 0;indexN1006B < attributes.length; indexN1006B++) {
              attribute = attributes.item(indexN1006B);
              attributeName = attribute.nodeName;

              actual[actual.length] = attributeName;

            }

            if(

              (builder.contentType == "text/html")

            ) {
              assertEqualsCollection("htmlAttributeNames",toLowerArray(htmlExpected),toLowerArray(actual));

            }

            else {
              assertEqualsCollection("attributeNames",toLowerArray(expected),toLowerArray(actual));

            }

          },
          /**
          * 
          The "getAttribute(name)" method returns an attribute
          value by name.

          Retrieve the second address element, then
          invoke the 'getAttribute("class")' method.  This should
          return the value of the attribute("No").

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-666EE0F9
          */
          hc_elementretrieveattrvalue : function () {
            var success;
            if(checkInitialization(builder, "hc_elementretrieveattrvalue") != null) return;
            var doc;
            var elementList;
            var testAddress;
            var attrValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddress = elementList.item(2);
            attrValue = testAddress.getAttribute("class");
            assertEquals("attrValue","No",attrValue);

          },
          /**
          * 
          The "getElementsByTagName()" method returns a NodeList 
          of all descendant elements with a given tagName.    

          Invoke the "getElementsByTagName()" method and create
          a NodeList of "code" elements.  Retrieve the second 
          "code" element in the list and return the NodeName. 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-104682815
          */
          hc_elementretrievetagname : function () {
            var success;
            if(checkInitialization(builder, "hc_elementretrievetagname") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var strong;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("code");
            testEmployee = elementList.item(1);
            strong = testEmployee.nodeName;

            assertEqualsAutoCase("element", "nodename","code",strong);
            strong = testEmployee.tagName;

            assertEqualsAutoCase("element", "tagname","code",strong);

          },
          /**
          * 
          The "setAttributeNode(newAttr)" method returns the
          null value if no previously existing Attr node with the
          same name was replaced.

          Retrieve the last child of the third employee and add a 
          new attribute to it.  The new attribute node added is 
          "lang", which is not part of this Element.  The   
          method should return the null value.   
          This test uses the "createAttribute(name)"
          method from the Document interface. 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
          */
          hc_elementsetattributenodenull : function () {
            var success;
            if(checkInitialization(builder, "hc_elementsetattributenodenull") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var newAttribute;
            var districtAttr;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(2);
            newAttribute = doc.createAttribute("lang");
            districtAttr = testEmployee.setAttributeNode(newAttribute);
            assertNull("elementSetAttributeNodeNullAssert",districtAttr);

          },
          /**
          * 
          The "setAttributeNode(newAttr)" method raises an 
          "WRONG_DOCUMENT_ERR DOMException if the "newAttr" 
          was created from a different document than the one that
          created this document.

          Retrieve the last employee and attempt to set a new
          attribute node for its "employee" element.  The new
          attribute was created from a document other than the
          one that created this element, therefore a
          WRONG_DOCUMENT_ERR DOMException should be raised.

          This test uses the "createAttribute(newAttr)" method
          from the Document interface.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-887236154
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-887236154')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          hc_elementwrongdocumenterr : function () {
            var success;
            if(checkInitialization(builder, "hc_elementwrongdocumenterr") != null) return;
            var doc1;
            var doc2;
            var newAttribute;
            var addressElementList;
            var testAddress;
            var attrAddress;

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
            newAttribute = doc2.createAttribute("newAttribute");
            addressElementList = doc1.getElementsByTagName("acronym");
            testAddress = addressElementList.item(4);

            {
              success = false;
              try {
                attrAddress = testAddress.setAttributeNode(newAttribute);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 4);
              }
              assertTrue("throw_WRONG_DOCUMENT_ERR",success);
            }

          },
          /**
          * 
          An attempt to add remove an entity should result in a NO_MODIFICATION_ERR.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1788794630
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          */
          hc_entitiesremovenameditem1 : function () {
            var success;
            if(checkInitialization(builder, "hc_entitiesremovenameditem1") != null) return;
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

              {
                success = false;
                try {
                  retval = entities.removeNamedItem("alpha");
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
          An attempt to add an element to the named node map returned by entities should 
          result in a NO_MODIFICATION_ERR or HIERARCHY_REQUEST_ERR.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1788794630
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          */
          hc_entitiessetnameditem1 : function () {
            var success;
            if(checkInitialization(builder, "hc_entitiessetnameditem1") != null) return;
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
              elem = doc.createElement("br");

              try {
                retval = entities.setNamedItem(elem);
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
          Create a NamedNodeMap object from the attributes of the
          last child of the third "p" element and traverse the
          list from index 0 thru length -1.  All indices should
          be valid.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D0FB19E
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=250
          */
          hc_namednodemapchildnoderange : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapchildnoderange") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var child;
            var strong;
            var length;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(2);
            attributes = testEmployee.attributes;

            length = attributes.length;


            if(

              (builder.contentType == "text/html")

            ) {
              assertEquals("htmlLength",2,length);

            }

            else {
              assertEquals("length",3,length);
              child = attributes.item(2);
              assertNotNull("attr2",child);

            }
            child = attributes.item(0);
            assertNotNull("attr0",child);
            child = attributes.item(1);
            assertNotNull("attr1",child);
            child = attributes.item(3);
            assertNull("attr3",child);

          },
          /**
          * 
          Retrieve the second "p" element and create a NamedNodeMap 
          listing of the attributes of the last child.  Once the
          list is created an invocation of the "getNamedItem(name)"
          method is done with name="title".  This should result
          in the title Attr node being returned.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
          */
          hc_namednodemapgetnameditem : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapgetnameditem") != null) return;
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
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(1);
            attributes = testEmployee.attributes;

            domesticAttr = attributes.getNamedItem("title");
            attrName = domesticAttr.nodeName;

            assertEqualsAutoCase("attribute", "nodeName","title",attrName);

          },
          /**
          * 
          The "setNamedItem(arg)" method raises a
          INUSE_ATTRIBUTE_ERR DOMException if "arg" is an
          Attr that is already in an attribute of another Element.

          Create a NamedNodeMap object from the attributes of the
          last child of the third employee and attempt to add
          an attribute that is already being used by the first
          employee.  This should raise the desired exception.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1025163788')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          hc_namednodemapinuseattributeerr : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapinuseattributeerr") != null) return;
            var doc;
            var elementList;
            var firstNode;
            var testNode;
            var attributes;
            var domesticAttr;
            var setAttr;
            var setNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            firstNode = elementList.item(0);
            domesticAttr = doc.createAttribute("title");
            domesticAttr.value = "Yα";

            setAttr = firstNode.setAttributeNode(domesticAttr);
            elementList = doc.getElementsByTagName("acronym");
            testNode = elementList.item(2);
            attributes = testNode.attributes;


            {
              success = false;
              try {
                setNode = attributes.setNamedItem(domesticAttr);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 10);
              }
              assertTrue("throw_INUSE_ATTRIBUTE_ERR",success);
            }

          },
          /**
          * 
          The "removeNamedItem(name)" method raises a 
          NOT_FOUND_ERR DOMException if there is not a node
          named "strong" in the map.

          Create a NamedNodeMap object from the attributes of the
          last child of the third employee and attempt to remove
          the "lang" attribute.  There is not a node named
          "lang" in the list and therefore the desired   
          exception should be raised.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-D58B193')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
          */
          hc_namednodemapnotfounderr : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapnotfounderr") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var removedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(2);
            attributes = testEmployee.attributes;


            {
              success = false;
              try {
                removedNode = attributes.removeNamedItem("lang");
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 8);
              }
              assertTrue("throw_NOT_FOUND_ERR",success);
            }

          },
          /**
          * 
          Retrieve the second "p" element and evaluate Node.attributes.length.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D0FB19E
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=250
          */
          hc_namednodemapnumberofnodes : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapnumberofnodes") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var length;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(2);
            attributes = testEmployee.attributes;

            length = attributes.length;


            if(

              (builder.contentType == "text/html")

            ) {
              assertEquals("htmlLength",2,length);

            }

            else {
              assertEquals("length",3,length);

            }

          },
          /**
          * 
          The "removeNamedItem(name)" method removes a node 
          specified by name. 

          Retrieve the third employee and create a NamedNodeMap 
          object of the attributes of the last child.  Once the
          list is created invoke the "removeNamedItem(name)"
          method with name="class".  This should result
          in the removal of the specified attribute.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
          */
          hc_namednodemapremovenameditem : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapremovenameditem") != null) return;
            var doc;
            var elementList;
            var newAttribute;
            var testAddress;
            var attributes;
            var streetAttr;
            var specified;
            var removedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddress = elementList.item(2);
            attributes = testAddress.attributes;

            removedNode = attributes.removeNamedItem("class");
            streetAttr = attributes.getNamedItem("class");
            assertNull("isnull",streetAttr);

          },
          /**
          * 
          Retrieve the second p element and create a NamedNodeMap 
          listing of the attributes of the last child.  Once the
          list is created an invocation of the "getNamedItem(name)"
          method is done with name="class".  This should result
          in the method returning an Attr node.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1112119403
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          */
          hc_namednodemapreturnattrnode : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapreturnattrnode") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var streetAttr;
            var attrName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(1);
            attributes = testEmployee.attributes;

            streetAttr = attributes.getNamedItem("class");
            assertInstanceOf("typeAssert","Attr",streetAttr);
            attrName = streetAttr.nodeName;

            assertEqualsAutoCase("attribute", "nodeName","class",attrName);
            attrName = streetAttr.name;

            assertEqualsAutoCase("attribute", "name","class",attrName);

          },
          /**
          * 
          The "item(index)" method returns the indexth item in 
          the map(test for first item). 

          Retrieve the second "acronym" get the NamedNodeMap of the attributes. Since the
          DOM does not specify an order of these nodes the contents
          of the FIRST node can contain either "title", "class" or "dir".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=184
          */
          hc_namednodemapreturnfirstitem : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapreturnfirstitem") != null) return;
            var doc;
            var elementList;
            var testAddress;
            var attributes;
            var child;
            var nodeName;
            htmlExpected = new Array();
            htmlExpected[0] = "title";
            htmlExpected[1] = "class";

            expected = new Array();
            expected[0] = "title";
            expected[1] = "class";
            expected[2] = "dir";

            var actual = new Array();


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddress = elementList.item(1);
            attributes = testAddress.attributes;

            for(var indexN10070 = 0;indexN10070 < attributes.length; indexN10070++) {
              child = attributes.item(indexN10070);
              nodeName = child.nodeName;

              actual[actual.length] = nodeName;

            }

            if(

              (builder.contentType == "text/html")

            ) {
              assertEqualsCollection("attrName_html",toLowerArray(htmlExpected),toLowerArray(actual));

            }

            else {
              assertEqualsCollection("attrName",expected,actual);

            }

          },
          /**
          * 
          The "item(index)" method returns the indexth item in 
          the map(test for last item). 

          Retrieve the second "acronym" and get the attribute name. Since the
          DOM does not specify an order of these nodes the contents
          of the LAST node can contain either "title" or "class".
          The test should return "true" if the LAST node is either
          of these values.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=184
          */
          hc_namednodemapreturnlastitem : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapreturnlastitem") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var child;
            var nodeName;
            htmlExpected = new Array();
            htmlExpected[0] = "title";
            htmlExpected[1] = "class";

            expected = new Array();
            expected[0] = "title";
            expected[1] = "class";
            expected[2] = "dir";

            var actual = new Array();


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(1);
            attributes = testEmployee.attributes;

            for(var indexN10070 = 0;indexN10070 < attributes.length; indexN10070++) {
              child = attributes.item(indexN10070);
              nodeName = child.nodeName;

              actual[actual.length] = nodeName;

            }

            if(

              (builder.contentType == "text/html")

            ) {
              assertEqualsCollection("attrName_html",toLowerArray(htmlExpected),toLowerArray(actual));

            }

            else {
              assertEqualsCollection("attrName",expected,actual);

            }

          },
          /**
          * 
          The "getNamedItem(name)" method returns null of the 
          specified name did not identify any node in the map. 

          Retrieve the second employee and create a NamedNodeMap 
          listing of the attributes of the last child.  Once the
          list is created an invocation of the "getNamedItem(name)"
          method is done with name="lang".  This name does not 
          match any names in the list therefore the method should
          return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          hc_namednodemapreturnnull : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapreturnnull") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var districtNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testEmployee = elementList.item(1);
            attributes = testEmployee.attributes;

            districtNode = attributes.getNamedItem("lang");
            assertNull("langAttrNull",districtNode);

          },
          /**
          * 
          Retrieve the second "p" element and create a NamedNodeMap 
          object from the attributes of the last child by
          invoking the "getAttributes()" method.  Once the
          list is created an invocation of the "setNamedItem(arg)"
          method is done with arg=newAttr, where newAttr is a
          new Attr Node previously created.  The "setNamedItem(arg)"
          method should add then new node to the NamedNodeItem 
          object by using its "nodeName" attribute("lang').
          This node is then retrieved using the "getNamedItem(name)"
          method.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
          */
          hc_namednodemapsetnameditem : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapsetnameditem") != null) return;
            var doc;
            var elementList;
            var newAttribute;
            var testAddress;
            var attributes;
            var districtNode;
            var attrName;
            var setNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddress = elementList.item(1);
            newAttribute = doc.createAttribute("lang");
            attributes = testAddress.attributes;

            setNode = attributes.setNamedItem(newAttribute);
            districtNode = attributes.getNamedItem("lang");
            attrName = districtNode.nodeName;

            assertEqualsAutoCase("attribute", "nodeName","lang",attrName);

          },
          /**
          * 
          If the "setNamedItem(arg)" method replaces an already 
          existing node with the same name then the already 
          existing node is returned.

          Retrieve the third employee and create a NamedNodeMap 
          object from the attributes of the last child by
          invoking the "getAttributes()" method.  Once the
          list is created an invocation of the "setNamedItem(arg)"
          method is done with arg=newAttr, where newAttr is a
          new Attr Node previously created and whose node name
          already exists in the map.  The "setNamedItem(arg)"
          method should replace the already existing node with
          the new one and return the existing node.   
          This test uses the "createAttribute(name)" method from
          the document interface.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          */
          hc_namednodemapsetnameditemreturnvalue : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapsetnameditemreturnvalue") != null) return;
            var doc;
            var elementList;
            var newAttribute;
            var testAddress;
            var attributes;
            var newNode;
            var attrValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddress = elementList.item(2);
            newAttribute = doc.createAttribute("class");
            attributes = testAddress.attributes;

            newNode = attributes.setNamedItem(newAttribute);
            assertNotNull("previousAttrNotNull",newNode);
            attrValue = newNode.nodeValue;

            assertEquals("previousAttrValue","No",attrValue);

          },
          /**
          * 
          If the node to be added by the "setNamedItem(arg)" method 
          already exists in the NamedNodeMap, it is replaced by
          the new one.

          Retrieve the second employee and create a NamedNodeMap 
          object from the attributes of the last child by
          invoking the "getAttributes()" method.  Once the
          list is created an invocation of the "setNamedItem(arg)"
          method is done with arg=newAttr, where newAttr is a
          new Attr Node previously created and whose node name
          already exists in the map.  The "setNamedItem(arg)"
          method should replace the already existing node with
          the new one.   
          This node is then retrieved using the "getNamedItem(name)"
          method.  This test uses the "createAttribute(name)"
          method from the document interface

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          */
          hc_namednodemapsetnameditemthatexists : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapsetnameditemthatexists") != null) return;
            var doc;
            var elementList;
            var newAttribute;
            var testAddress;
            var attributes;
            var districtNode;
            var attrValue;
            var setNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddress = elementList.item(1);
            newAttribute = doc.createAttribute("class");
            attributes = testAddress.attributes;

            setNode = attributes.setNamedItem(newAttribute);
            districtNode = attributes.getNamedItem("class");
            attrValue = districtNode.nodeValue;

            assertEquals("namednodemapSetNamedItemThatExistsAssert","",attrValue);

          },
          /**
          * 
          If the "setNamedItem(arg)" method does not replace an 
          existing node with the same name then it returns null. 

          Retrieve the third employee and create a NamedNodeMap 
          object from the attributes of the last child.
          Once the list is created the "setNamedItem(arg)" method
          is invoked with arg=newAttr, where newAttr is a
          newly created Attr Node and whose node name
          already exists in the map.  The "setNamedItem(arg)"
          method should add the new node and return null.
          This test uses the "createAttribute(name)" method from
          the document interface.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=243
          */
          hc_namednodemapsetnameditemwithnewvalue : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapsetnameditemwithnewvalue") != null) return;
            var doc;
            var elementList;
            var newAttribute;
            var testAddress;
            var attributes;
            var newNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddress = elementList.item(2);
            newAttribute = doc.createAttribute("lang");
            attributes = testAddress.attributes;

            newNode = attributes.setNamedItem(newAttribute);
            assertNull("prevValueNull",newNode);

          },
          /**
          * 
          The "setNamedItem(arg)" method raises a 
          WRONG_DOCUMENT_ERR DOMException if "arg" was created
          from a different document than the one that created
          the NamedNodeMap. 

          Create a NamedNodeMap object from the attributes of the
          last child of the third employee and attempt to add
          another Attr node to it that was created from a 
          different DOM document.  This should raise the desired
          exception.  This method uses the "createAttribute(name)"
          method from the Document interface.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1025163788')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          hc_namednodemapwrongdocumenterr : function () {
            var success;
            if(checkInitialization(builder, "hc_namednodemapwrongdocumenterr") != null) return;
            var doc1;
            var doc2;
            var elementList;
            var testAddress;
            var attributes;
            var newAttribute;
            var strong;
            var setNode;

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
            elementList = doc1.getElementsByTagName("acronym");
            testAddress = elementList.item(2);
            newAttribute = doc2.createAttribute("newAttribute");
            attributes = testAddress.attributes;


            {
              success = false;
              try {
                setNode = attributes.setNamedItem(newAttribute);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 4);
              }
              assertTrue("throw_WRONG_DOCUMENT_ERR",success);
            }

          },
          /**
          * 
          Retrieve the second "p" and append a "br" Element
          node to the list of children.   The last node in the list
          is then retrieved and its NodeName examined.   The
          "getNodeName()" method should return "br".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeappendchild : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeappendchild") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var createdNode;
            var lchild;
            var childName;
            var appendedChild;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            createdNode = doc.createElement("br");
            appendedChild = employeeNode.appendChild(createdNode);
            lchild = employeeNode.lastChild;

            childName = lchild.nodeName;

            assertEqualsAutoCase("element", "nodeName","br",childName);

          },
          /**
          * 
          If the "newChild" is already in the tree, it is first
          removed before the new one is appended.

          Retrieve the "em" second employee and   
          append the first child to the end of the list.   After
          the "appendChild(newChild)" method is invoked the first 
          child should be the one that was second and the last
          child should be the one that was first.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodeappendchildchildexists : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeappendchildchildexists") != null) return;
            var doc;
            var elementList;
            var childList;
            var childNode;
            var newChild;
            var memberNode;
            var memberName;
            var refreshedActual = new Array();

            var actual = new Array();

            var nodeType;
            expected = new Array();
            expected[0] = "strong";
            expected[1] = "code";
            expected[2] = "sup";
            expected[3] = "var";
            expected[4] = "acronym";
            expected[5] = "em";

            var appendedChild;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            childNode = elementList.item(1);
            childList = childNode.getElementsByTagName("*");
            newChild = childList.item(0);
            appendedChild = childNode.appendChild(newChild);
            for(var indexN10085 = 0;indexN10085 < childList.length; indexN10085++) {
              memberNode = childList.item(indexN10085);
              memberName = memberNode.nodeName;

              actual[actual.length] = memberName;

            }
            assertEqualsListAutoCase("element", "liveByTagName",expected,actual);
            childList = childNode.childNodes;

            for(var indexN1009C = 0;indexN1009C < childList.length; indexN1009C++) {
              memberNode = childList.item(indexN1009C);
              nodeType = memberNode.nodeType;


              if(
                (1 == nodeType)
              ) {
                memberName = memberNode.nodeName;

                refreshedActual[refreshedActual.length] = memberName;

              }

            }
            assertEqualsListAutoCase("element", "refreshedChildNodes",expected,refreshedActual);

          },
          /**
          * 
          If the "newChild" is a DocumentFragment object then
          all its content is added to the child list of this node.

          Create and populate a new DocumentFragment object and
          append it to the second employee.   After the 
          "appendChild(newChild)" method is invoked retrieve the
          new nodes at the end of the list, they should be the
          two Element nodes from the DocumentFragment.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeappendchilddocfragment : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeappendchilddocfragment") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var newdocFragment;
            var newChild1;
            var newChild2;
            var child;
            var childName;
            var result = new Array();

            var appendedChild;
            var nodeType;
            expected = new Array();
            expected[0] = "em";
            expected[1] = "strong";
            expected[2] = "code";
            expected[3] = "sup";
            expected[4] = "var";
            expected[5] = "acronym";
            expected[6] = "br";
            expected[7] = "b";


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            newdocFragment = doc.createDocumentFragment();
            newChild1 = doc.createElement("br");
            newChild2 = doc.createElement("b");
            appendedChild = newdocFragment.appendChild(newChild1);
            appendedChild = newdocFragment.appendChild(newChild2);
            appendedChild = employeeNode.appendChild(newdocFragment);
			
            for(var indexN100A2 = 0;indexN100A2 < childList.length; indexN100A2++) {
              child = childList.item(indexN100A2);
              nodeType = child.nodeType;


              if(
                (1 == nodeType)
              ) {
                childName = child.nodeName;

                result[result.length] = childName;

              }

            }
            assertEqualsListAutoCase("element", "nodeNames",expected,result);

          },
          /**
          * 
          The "appendChild(newChild)" method returns the node
          added.

          Append a newly created node to the child list of the 
          second employee and check the NodeName returned.   The
          "getNodeName()" method should return "br".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeappendchildgetnodename : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeappendchildgetnodename") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var newChild;
            var appendNode;
            var childName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            newChild = doc.createElement("br");
            appendNode = employeeNode.appendChild(newChild);
            childName = appendNode.nodeName;

            assertEqualsAutoCase("element", "nodeName","br",childName);

          },
          /**
          * 
          The "appendChild(newChild)" method raises a 
          HIERARCHY_REQUEST_ERR DOMException if this node is of
          a type that does not allow children of the type "newChild"
          to be inserted.

          Retrieve the root node and attempt to append a newly
          created Attr node.   An Element node cannot have children
          of the "Attr" type, therefore the desired exception
          should be raised.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          hc_nodeappendchildinvalidnodetype : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeappendchildinvalidnodetype") != null) return;
            var doc;
            var rootNode;
            var newChild;
            var appendedChild;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            rootNode = doc.documentElement;

            newChild = doc.createAttribute("newAttribute");

            {
              success = false;
              try {
                appendedChild = rootNode.appendChild(newChild);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 3);
              }
              assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
            }

          },
          /**
          * 
          The "appendChild(newChild)" method raises a 
          WRONG_DOCUMENT_ERR DOMException if the "newChild" was
          created from a different document than the one that 
          created this node.

          Retrieve the second employee and attempt to append    
          a node created from a different document.   An attempt 
          to make such a replacement should raise the desired 
          exception.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeappendchildnewchilddiffdocument : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeappendchildnewchilddiffdocument") != null) return;
            var doc1;
            var doc2;
            var newChild;
            var elementList;
            var elementNode;
            var appendedChild;

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
            newChild = doc1.createElement("br");
            elementList = doc2.getElementsByTagName("p");
            elementNode = elementList.item(1);

            {
              success = false;
              try {
                appendedChild = elementNode.appendChild(newChild);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 4);
              }
              assertTrue("throw_WRONG_DOCUMENT_ERR",success);
            }

          },
          /**
          * 
          The "appendChild(newChild)" method raises a 
          HIERARCHY_REQUEST_ERR DOMException if the node to 
          append is one of this node's ancestors.

          Retrieve the second employee and attempt to append 
          an ancestor node(root node) to it.
          An attempt to make such an addition should raise the 
          desired exception.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          */
          hc_nodeappendchildnodeancestor : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeappendchildnodeancestor") != null) return;
            var doc;
            var newChild;
            var elementList;
            var employeeNode;
            var childList;
            var oldChild;
            var appendedChild;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            newChild = doc.documentElement;

            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);

            {
              success = false;
              try {
                appendedChild = employeeNode.appendChild(newChild);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 3);
              }
              assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
            }

          },
          /**
          * 
          The "getAttributes()" method invoked on an Attribute
          Node returns null.

          Retrieve the first attribute from the last child of the
          first employee and invoke the "getAttributes()" method
          on the Attribute Node.  It should return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
          */
          hc_nodeattributenodeattribute : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeattributenodeattribute") != null) return;
            var doc;
            var elementList;
            var testAddr;
            var addrAttr;
            var attrNode;
            var attrList;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddr = elementList.item(0);
            addrAttr = testAddr.attributes;

            attrNode = addrAttr.item(0);
            attrList = attrNode.attributes;

            assertNull("nodeAttributeNodeAttributeAssert1",attrList);

          },
          /**
          * 
          Retrieve the Attribute named "title" from the last 
          child of the first p element and check the string returned 
          by the "getNodeName()" method.   It should be equal to 
          "title". 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          */
          hc_nodeattributenodename : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeattributenodename") != null) return;
            var doc;
            var elementList;
            var testAddr;
            var addrAttr;
            var attrName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddr = elementList.item(0);
            addrAttr = testAddr.getAttributeNode("title");
            attrName = addrAttr.nodeName;

            assertEqualsAutoCase("attribute", "nodeName","title",attrName);

          },
          /**
          * 

          The "getNodeType()" method for an Attribute Node

          returns the constant value 2.



          Retrieve the first attribute from the last child of

          the first employee and invoke the "getNodeType()"   

          method.   The method should return 2. 


          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
          */
          hc_nodeattributenodetype : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeattributenodetype") != null) return;
            var doc;
            var elementList;
            var testAddr;
            var addrAttr;
            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddr = elementList.item(0);
            addrAttr = testAddr.getAttributeNode("title");
            nodeType = addrAttr.nodeType;

            assertEquals("nodeAttrNodeTypeAssert1",2,nodeType);

          },
          /**
          * 

          The string returned by the "getNodeValue()" method for an 
          Attribute Node is the value of the Attribute.

          Retrieve the Attribute named "title" from the last 
          child of the first "p" and check the string returned 
          by the "getNodeValue()" method.   It should be equal to 
          "Yes". 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          */
          hc_nodeattributenodevalue : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeattributenodevalue") != null) return;
            var doc;
            var elementList;
            var testAddr;
            var addrAttr;
            var attrValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddr = elementList.item(0);
            addrAttr = testAddr.getAttributeNode("title");
            attrValue = addrAttr.nodeValue;

            assertEquals("nodeValue","Yes",attrValue);

          },
          /**
          * 

          The "getChildNodes()" method returns a NodeList
          that contains all children of this node. 

          Retrieve the second employee and check the NodeList
          returned by the "getChildNodes()" method.   The
          length of the list should be 13.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodechildnodes : function () {
            var success;
            if(checkInitialization(builder, "hc_nodechildnodes") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childNode;
            var childNodes;
            var nodeType;
            var childName;
            var actual = new Array();

            expected = new Array();
            expected[0] = "em";
            expected[1] = "strong";
            expected[2] = "code";
            expected[3] = "sup";
            expected[4] = "var";
            expected[5] = "acronym";


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childNodes = employeeNode.childNodes;

            for(var indexN1006C = 0;indexN1006C < childNodes.length; indexN1006C++) {
              childNode = childNodes.item(indexN1006C);
              nodeType = childNode.nodeType;

              childName = childNode.nodeName;


              if(
                (1 == nodeType)
              ) {
                actual[actual.length] = childName;

              }

              else {
                assertEquals("textNodeType",3,nodeType);

              }

            }
            assertEqualsListAutoCase("element", "elementNames",expected,actual);

          },
          /**
          * 
          The NodeList returned by the "getChildNodes()" method
          is live.   Changes on the node's children are immediately
          reflected on the nodes returned in the NodeList.

          Create a NodeList of the children of the second employee
          and then add a newly created element that was created
          by the "createElement()" method(Document Interface) to
          the second employee by using the "appendChild()" method.
          The length of the NodeList should reflect this new
          addition to the child list.   It should return the value 14.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodechildnodesappendchild : function () {
            var success;
            if(checkInitialization(builder, "hc_nodechildnodesappendchild") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var createdNode;
            var childNode;
            var childName;
            var childType;
            var textNode;
            var actual = new Array();

            expected = new Array();
            expected[0] = "em";
            expected[1] = "strong";
            expected[2] = "code";
            expected[3] = "sup";
            expected[4] = "var";
            expected[5] = "acronym";
            expected[6] = "br";


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            createdNode = doc.createElement("br");
            employeeNode = employeeNode.appendChild(createdNode);
            for(var indexN10087 = 0;indexN10087 < childList.length; indexN10087++) {
              childNode = childList.item(indexN10087);
              childName = childNode.nodeName;

              childType = childNode.nodeType;


              if(
                (1 == childType)
              ) {
                actual[actual.length] = childName;

              }

              else {
                assertEquals("textNodeType",3,childType);

              }

            }
            assertEqualsListAutoCase("element", "childElements",expected,actual);

          },
          /**
          * 
          The "getChildNodes()" method returns a NodeList
          that contains all children of this node.   If there
          are not any children, this is a NodeList that does not 
          contain any nodes. 

          Retrieve the character data of the second "em" node and
          invoke the "getChildNodes()" method.   The
          NodeList returned should not have any nodes.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodechildnodesempty : function () {
            var success;
            if(checkInitialization(builder, "hc_nodechildnodesempty") != null) return;
            var doc;
            var elementList;
            var childList;
            var employeeNode;
            var textNode;
            var length;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("em");
            employeeNode = elementList.item(1);
            textNode = employeeNode.firstChild;

            childList = textNode.childNodes;

            length = childList.length;

            assertEquals("length_zero",0,length);

          },
          /**
          * 
          Retrieve the second acronym element and invoke
          the cloneNode method.   The
          duplicate node returned by the method should copy the
          attributes associated with this node.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=184
          */
          hc_nodecloneattributescopied : function () {
            var success;
            if(checkInitialization(builder, "hc_nodecloneattributescopied") != null) return;
            var doc;
            var elementList;
            var addressNode;
            var clonedNode;
            var attributes;
            var attributeNode;
            var attributeName;
            var result = new Array();

            htmlExpected = new Array();
            htmlExpected[0] = "class";
            htmlExpected[1] = "title";

            expected = new Array();
            expected[0] = "class";
            expected[1] = "title";
            expected[2] = "dir";


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            addressNode = elementList.item(1);
            clonedNode = addressNode.cloneNode(false);
            attributes = clonedNode.attributes;

            for(var indexN10076 = 0;indexN10076 < attributes.length; indexN10076++) {
              attributeNode = attributes.item(indexN10076);
              attributeName = attributeNode.nodeName;

              result[result.length] = attributeName;

            }

            if(

              (builder.contentType == "text/html")

            ) {
              assertEqualsCollection("nodeNames_html",toLowerArray(htmlExpected),toLowerArray(result));

            }

            else {
              assertEqualsCollection("nodeNames",expected,result);

            }

          },
          /**
          * 
          The "cloneNode(deep)" method does not copy text unless it
          is deep cloned.(Test for deep=false)

          Retrieve the fourth child of the second employee and
          the "cloneNode(deep)" method with deep=false.   The
          duplicate node returned by the method should not copy
          any text data contained in this node.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
          */
          hc_nodeclonefalsenocopytext : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeclonefalsenocopytext") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var childNode;
            var clonedNode;
            var lastChildNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            childNode = childList.item(3);
            clonedNode = childNode.cloneNode(false);
            lastChildNode = clonedNode.lastChild;

            assertNull("nodeCloneFalseNoCopyTextAssert1",lastChildNode);

          },
          /**
          * 
          The duplicate node returned by the "cloneNode(deep)"
          method does not have a ParentNode.

          Retrieve the second employee and invoke the
          "cloneNode(deep)" method with deep=false.   The
          duplicate node returned should return null when the
          "getParentNode()" is invoked.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
          */
          hc_nodeclonegetparentnull : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeclonegetparentnull") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var clonedNode;
            var parentNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            clonedNode = employeeNode.cloneNode(false);
            parentNode = clonedNode.parentNode;

            assertNull("nodeCloneGetParentNullAssert1",parentNode);

          },
          /**
          * 
          The "cloneNode(deep)" method returns a copy of the node
          only if deep=false.

          Retrieve the second employee and invoke the
          "cloneNode(deep)" method with deep=false.   The
          method should only clone this node.   The NodeName and
          length of the NodeList are checked.   The "getNodeName()"
          method should return "employee" and the "getLength()"
          method should return 0.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
          */
          hc_nodeclonenodefalse : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeclonenodefalse") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var clonedNode;
            var cloneName;
            var cloneChildren;
            var length;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            clonedNode = employeeNode.cloneNode(false);
            cloneName = clonedNode.nodeName;

            assertEqualsAutoCase("element", "strong","p",cloneName);
            cloneChildren = clonedNode.childNodes;

            length = cloneChildren.length;

            assertEquals("length",0,length);

          },
          /**
          * 
          The "cloneNode(deep)" method returns a copy of the node
          and the subtree under it if deep=true.

          Retrieve the second employee and invoke the
          "cloneNode(deep)" method with deep=true.   The
          method should clone this node and the subtree under it.
          The NodeName of each child in the returned node is 
          checked to insure the entire subtree under the second
          employee was cloned.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodeclonenodetrue : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeclonenodetrue") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var clonedNode;
            var clonedList;
            var clonedChild;
            var clonedChildName;
            var origList;
            var origChild;
            var origChildName;
            var result = new Array();

            var expected = new Array();


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            origList = employeeNode.childNodes;

            for(var indexN10065 = 0;indexN10065 < origList.length; indexN10065++) {
              origChild = origList.item(indexN10065);
              origChildName = origChild.nodeName;

              expected[expected.length] = origChildName;

            }
            clonedNode = employeeNode.cloneNode(true);
            clonedList = clonedNode.childNodes;

            for(var indexN1007B = 0;indexN1007B < clonedList.length; indexN1007B++) {
              clonedChild = clonedList.item(indexN1007B);
              clonedChildName = clonedChild.nodeName;

              result[result.length] = clonedChildName;

            }
            assertEqualsList("clone",expected,result);

          },
          /**
          * 
          The "cloneNode(deep)" method does not copy text unless it
          is deep cloned.(Test for deep=true)

          Retrieve the eighth child of the second employee and
          the "cloneNode(deep)" method with deep=true.   The
          duplicate node returned by the method should copy
          any text data contained in this node.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodeclonetruecopytext : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeclonetruecopytext") != null) return;
            var doc;
            var elementList;
            var childNode;
            var clonedNode;
            var lastChildNode;
            var childValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("sup");
            childNode = elementList.item(1);
            clonedNode = childNode.cloneNode(true);
            lastChildNode = clonedNode.lastChild;

            childValue = lastChildNode.nodeValue;

            assertEquals("cloneContainsText","35,000",childValue);

          },
          /**
          * 
          The "getAttributes()" method invoked on a Comment 
          Node returns null.

          Find any comment that is an immediate child of the root
          and assert that Node.attributes is null.  Then create
          a new comment node (in case they had been omitted) and
          make the assertion.    

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=248
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=263
          */
          hc_nodecommentnodeattributes : function () {
            var success;
            if(checkInitialization(builder, "hc_nodecommentnodeattributes") != null) return;
            var doc;
            var commentNode;
            var nodeList;
            var attrList;
            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            nodeList = doc.childNodes;

            for(var indexN10043 = 0;indexN10043 < nodeList.length; indexN10043++) {
              commentNode = nodeList.item(indexN10043);
              nodeType = commentNode.nodeType;


              if(
                (8 == nodeType)
              ) {
                attrList = commentNode.attributes;

                assertNull("existingCommentAttributesNull",attrList);

              }

            }
            commentNode = doc.createComment("This is a comment");
            attrList = commentNode.attributes;

            assertNull("createdCommentAttributesNull",attrList);

          },
          /**
          * 
          The string returned by the "getNodeName()" method for a 
          Comment Node is "#comment".

          Retrieve the Comment node in the XML file 
          and check the string returned by the "getNodeName()" 
          method.   It should be equal to "#comment".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=248
          */
          hc_nodecommentnodename : function () {
            var success;
            if(checkInitialization(builder, "hc_nodecommentnodename") != null) return;
            var doc;
            var elementList;
            var commentNode;
            var nodeType;
            var commentName;
            var commentNodeName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.childNodes;

            for(var indexN10044 = 0;indexN10044 < elementList.length; indexN10044++) {
              commentNode = elementList.item(indexN10044);
              nodeType = commentNode.nodeType;


              if(
                (8 == nodeType)
              ) {
                commentNodeName = commentNode.nodeName;

                assertEquals("existingNodeName","#comment",commentNodeName);

              }

            }
            commentNode = doc.createComment("This is a comment");
            commentNodeName = commentNode.nodeName;

            assertEquals("createdNodeName","#comment",commentNodeName);

          },
          /**
          * 
          The "getNodeType()" method for a Comment Node
          returns the constant value 8.

          Retrieve the nodes from the document and check for
          a comment node and invoke the "getNodeType()" method.   This should   
          return 8. 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=248
          */
          hc_nodecommentnodetype : function () {
            var success;
            if(checkInitialization(builder, "hc_nodecommentnodetype") != null) return;
            var doc;
            var testList;
            var commentNode;
            var commentNodeName;
            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            testList = doc.childNodes;

            for(var indexN10040 = 0;indexN10040 < testList.length; indexN10040++) {
              commentNode = testList.item(indexN10040);
              commentNodeName = commentNode.nodeName;


              if(
                ("#comment" == commentNodeName)
              ) {
                nodeType = commentNode.nodeType;

                assertEquals("existingCommentNodeType",8,nodeType);

              }

            }
            commentNode = doc.createComment("This is a comment");
            nodeType = commentNode.nodeType;

            assertEquals("createdCommentNodeType",8,nodeType);

          },
          /**
          * 
          The string returned by the "getNodeValue()" method for a 
          Comment Node is the content of the comment.

          Retrieve the comment in the XML file and   
          check the string returned by the "getNodeValue()" method. 
          It should be equal to "This is comment number 1".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=248
          */
          hc_nodecommentnodevalue : function () {
            var success;
            if(checkInitialization(builder, "hc_nodecommentnodevalue") != null) return;
            var doc;
            var elementList;
            var commentNode;
            var commentName;
            var commentValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.childNodes;

            for(var indexN10040 = 0;indexN10040 < elementList.length; indexN10040++) {
              commentNode = elementList.item(indexN10040);
              commentName = commentNode.nodeName;


              if(
                ("#comment" == commentName)
              ) {
                commentValue = commentNode.nodeValue;

                assertEquals("value"," This is comment number 1.",commentValue);

              }

            }
            commentNode = doc.createComment(" This is a comment");
            commentValue = commentNode.nodeValue;

            assertEquals("createdCommentNodeValue"," This is a comment",commentValue);

          },
          /**
          * 
          The string returned by the "getNodeName()" method for a 
          DocumentFragment Node is "#document-frament".

          Retrieve the DOM document and invoke the
          "createDocumentFragment()" method and check the string      
          returned by the "getNodeName()" method.   It should be 
          equal to "#document-fragment".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
          */
          hc_nodedocumentfragmentnodename : function () {
            var success;
            if(checkInitialization(builder, "hc_nodedocumentfragmentnodename") != null) return;
            var doc;
            var docFragment;
            var documentFragmentName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            docFragment = doc.createDocumentFragment();
            documentFragmentName = docFragment.nodeName;

            assertEquals("nodeDocumentFragmentNodeNameAssert1","#document-fragment",documentFragmentName);

          },
          /**
          * 
          The "getNodeType()" method for a DocumentFragment Node
          returns the constant value 11.

          Invoke the "createDocumentFragment()" method and    
          examine the NodeType of the document fragment
          returned by the "getNodeType()" method.   The method 
          should return 11. 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
          */
          hc_nodedocumentfragmentnodetype : function () {
            var success;
            if(checkInitialization(builder, "hc_nodedocumentfragmentnodetype") != null) return;
            var doc;
            var documentFragmentNode;
            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            documentFragmentNode = doc.createDocumentFragment();
            nodeType = documentFragmentNode.nodeType;

            assertEquals("nodeDocumentFragmentNodeTypeAssert1",11,nodeType);

          },
          /**
          * 
          The string returned by the "getNodeValue()" method for a 
          DocumentFragment Node is null.

          Retrieve the DOM document and invoke the
          "createDocumentFragment()" method and check the string      
          returned by the "getNodeValue()" method.   It should be 
          equal to null.

          * @author Curt Arnold
          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          */
          hc_nodedocumentfragmentnodevalue : function () {
            var success;
            if(checkInitialization(builder, "hc_nodedocumentfragmentnodevalue") != null) return;
            var doc;
            var docFragment;
            var attrList;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            docFragment = doc.createDocumentFragment();
            attrList = docFragment.attributes;

            assertNull("attributesNull",attrList);
            value = docFragment.nodeValue;

            assertNull("initiallyNull",value);

          },
          /**
          * 
          The "getAttributes()" method invoked on a Document
          Node returns null.

          Retrieve the DOM Document and invoke the
          "getAttributes()" method on the Document Node.
          It should return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
          */
          hc_nodedocumentnodeattribute : function () {
            var success;
            if(checkInitialization(builder, "hc_nodedocumentnodeattribute") != null) return;
            var doc;
            var attrList;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            attrList = doc.attributes;

            assertNull("doc_attributes_is_null",attrList);

          },
          /**
          * 
          The string returned by the "getNodeName()" method for a 
          Document Node is "#document".

          Retrieve the DOM document and check the string returned
          by the "getNodeName()" method.   It should be equal to 
          "#document".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          */
          hc_nodedocumentnodename : function () {
            var success;
            if(checkInitialization(builder, "hc_nodedocumentnodename") != null) return;
            var doc;
            var documentName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            documentName = doc.nodeName;

            assertEquals("documentNodeName","#document",documentName);

          },
          /**
          * 
          The "getNodeType()" method for a Document Node
          returns the constant value 9.

          Retrieve the document and invoke the "getNodeType()" 
          method.   The method should return 9. 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
          */
          hc_nodedocumentnodetype : function () {
            var success;
            if(checkInitialization(builder, "hc_nodedocumentnodetype") != null) return;
            var doc;
            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            nodeType = doc.nodeType;

            assertEquals("nodeDocumentNodeTypeAssert1",9,nodeType);

          },
          /**
          * 
          The string returned by the "getNodeValue()" method for a 
          Document Node is null.

          Retrieve the DOM Document and check the string returned
          by the "getNodeValue()" method.   It should be equal to 
          null. 


          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          */
          hc_nodedocumentnodevalue : function () {
            var success;
            if(checkInitialization(builder, "hc_nodedocumentnodevalue") != null) return;
            var doc;
            var documentValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            documentValue = doc.nodeValue;

            assertNull("documentNodeValue",documentValue);

          },
          /**
          * 
          Retrieve the third "acronym" element and evaluate Node.attributes.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=184
          */
          hc_nodeelementnodeattributes : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeelementnodeattributes") != null) return;
            var doc;
            var elementList;
            var testAddr;
            var addrAttr;
            var attrNode;
            var attrName;
            var attrList = new Array();

            htmlExpected = new Array();
            htmlExpected[0] = "title";
            htmlExpected[1] = "class";

            expected = new Array();
            expected[0] = "title";
            expected[1] = "class";
            expected[2] = "dir";


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            testAddr = elementList.item(2);
            addrAttr = testAddr.attributes;

            for(var indexN10070 = 0;indexN10070 < addrAttr.length; indexN10070++) {
              attrNode = addrAttr.item(indexN10070);
              attrName = attrNode.nodeName;

              attrList[attrList.length] = attrName;

            }

            if(

              (builder.contentType == "text/html")

            ) {
              assertEqualsCollection("attrNames_html",toLowerArray(htmlExpected),toLowerArray(attrList));

            }

            else {
              assertEqualsCollection("attrNames",expected,attrList);

            }

          },
          /**
          * 
          Retrieve the first Element Node(Root Node) of the   
          DOM object and check the string returned by the            
          "getNodeName()" method.   It should be equal to its
          tagName. 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
          */
          hc_nodeelementnodename : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeelementnodename") != null) return;
            var doc;
            var elementNode;
            var elementName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementNode = doc.documentElement;

            elementName = elementNode.nodeName;


            if(

              (builder.contentType == "image/svg+xml")

            ) {
              assertEquals("svgNodeName","svg",elementName);

            }

            else {
              assertEqualsAutoCase("element", "nodeName","html",elementName);

            }

          },
          /**
          * 
          The "getNodeType()" method for an Element Node
          returns the constant value 1.

          Retrieve the root node and invoke the "getNodeType()"   
          method.   The method should return 1. 

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
          */
          hc_nodeelementnodetype : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeelementnodetype") != null) return;
            var doc;
            var rootNode;
            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            rootNode = doc.documentElement;

            nodeType = rootNode.nodeType;

            assertEquals("nodeElementNodeTypeAssert1",1,nodeType);

          },
          /**
          * 
          The string returned by the "getNodeValue()" method for an 
          Element Node is null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          */
          hc_nodeelementnodevalue : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeelementnodevalue") != null) return;
            var doc;
            var elementNode;
            var elementValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementNode = doc.documentElement;

            elementValue = elementNode.nodeValue;

            assertNull("elementNodeValue",elementValue);

          },
          /**
          * 
          The "getFirstChild()" method returns the first child
          of this node. 

          Retrieve the second employee and invoke the
          "getFirstChild()" method.   The NodeName returned
          should be "#text" or "EM".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-169727388
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodegetfirstchild : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetfirstchild") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var fchildNode;
            var childName;
            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            fchildNode = employeeNode.firstChild;

            childName = fchildNode.nodeName;


            if(
              ("#text" == childName)
            ) {
              assertEquals("firstChild_w_whitespace","#text",childName);

            }

            else {
              assertEqualsAutoCase("element", "firstChild_wo_whitespace","em",childName);

            }

          },
          /**
          * 
          If there is not a first child then the "getFirstChild()"
          method returns null.

          Retrieve the text of the first "em" element and invoke the "getFirstChild()" method.   It
          should return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-169727388
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodegetfirstchildnull : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetfirstchildnull") != null) return;
            var doc;
            var emList;
            var emNode;
            var emText;
            var nullChild;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            emList = doc.getElementsByTagName("em");
            emNode = emList.item(0);
            emText = emNode.firstChild;

            nullChild = emText.firstChild;

            assertNull("nullChild",nullChild);

          },
          /**
          * 
          The "getLastChild()" method returns the last child
          of this node. 

          Retrieve the second employee and invoke the
          "getLastChild()" method.   The NodeName returned
          should be "#text".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-61AD09FB
          */
          hc_nodegetlastchild : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetlastchild") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var lchildNode;
            var childName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            lchildNode = employeeNode.lastChild;

            childName = lchildNode.nodeName;

            assertEquals("whitespace","#text",childName);

          },
          /**
          * 

          If there is not a last child then the "getLastChild()"
          method returns null.

          Retrieve the text of the first "em" element and invoke the "getFirstChild()" method.   It
          should return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-61AD09FB
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodegetlastchildnull : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetlastchildnull") != null) return;
            var doc;
            var emList;
            var emNode;
            var emText;
            var nullChild;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            emList = doc.getElementsByTagName("em");
            emNode = emList.item(0);
            emText = emNode.firstChild;

            nullChild = emText.lastChild;

            assertNull("nullChild",nullChild);

          },
          /**
          * 
          The "getNextSibling()" method returns the node immediately
          following this node. 

          Retrieve the first child of the second employee and
          invoke the "getNextSibling()" method.   It should return
          a node with the NodeName of "#text".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6AC54C2F
          */
          hc_nodegetnextsibling : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetnextsibling") != null) return;
            var doc;
            var elementList;
            var emNode;
            var nsNode;
            var nsName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("em");
            emNode = elementList.item(1);
            nsNode = emNode.nextSibling;

            nsName = nsNode.nodeName;

            assertEquals("whitespace","#text",nsName);

          },
          /**
          * 

          If there is not a node immediately following this node the

          "getNextSibling()" method returns null.



          Retrieve the first child of the second employee and

          invoke the "getNextSibling()" method.   It should

          be set to null. 


          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6AC54C2F
          */
          hc_nodegetnextsiblingnull : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetnextsiblingnull") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var lcNode;
            var nsNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            lcNode = employeeNode.lastChild;

            nsNode = lcNode.nextSibling;

            assertNull("nodeGetNextSiblingNullAssert1",nsNode);

          },
          /**
          * 
          Evaluate Node.ownerDocument on the second "p" element.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#node-ownerDoc
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
          */
          hc_nodegetownerdocument : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetownerdocument") != null) return;
            var doc;
            var elementList;
            var docNode;
            var ownerDocument;
            var docElement;
            var elementName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            docNode = elementList.item(1);
            ownerDocument = docNode.ownerDocument;

            docElement = ownerDocument.documentElement;

            elementName = docElement.nodeName;


            if(

              (builder.contentType == "image/svg+xml")

            ) {
              assertEquals("svgNodeName","svg",elementName);

            }

            else {
              assertEqualsAutoCase("element", "ownerDocElemTagName","html",elementName);

            }

          },
          /**
          * 

          The "getOwnerDocument()" method returns null if the target

          node itself is a document.



          Invoke the "getOwnerDocument()" method on the master 

          document.   The Document returned should be null.


          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#node-ownerDoc
          */
          hc_nodegetownerdocumentnull : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetownerdocumentnull") != null) return;
            var doc;
            var ownerDocument;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            ownerDocument = doc.ownerDocument;

            assertNull("nodeGetOwnerDocumentNullAssert1",ownerDocument);

          },
          /**
          * 
          The "getPreviousSibling()" method returns the node
          immediately preceding this node. 

          Retrieve the second child of the second employee and    
          invoke the "getPreviousSibling()" method.   It should
          return a node with a NodeName of "#text".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-640FB3C8
          */
          hc_nodegetprevioussibling : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetprevioussibling") != null) return;
            var doc;
            var elementList;
            var nameNode;
            var psNode;
            var psName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("strong");
            nameNode = elementList.item(1);
            psNode = nameNode.previousSibling;

            psName = psNode.nodeName;

            assertEquals("whitespace","#text",psName);

          },
          /**
          * 

          If there is not a node immediately preceding this node the

          "getPreviousSibling()" method returns null.



          Retrieve the first child of the second employee and

          invoke the "getPreviousSibling()" method.   It should

          be set to null. 


          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-640FB3C8
          */
          hc_nodegetprevioussiblingnull : function () {
            var success;
            if(checkInitialization(builder, "hc_nodegetprevioussiblingnull") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var fcNode;
            var psNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(2);
            fcNode = employeeNode.firstChild;

            psNode = fcNode.previousSibling;

            assertNull("nodeGetPreviousSiblingNullAssert1",psNode);

          },
          /**
          * 
          The "hasChildNodes()" method returns true if the node
          has children.

          Retrieve the root node("staff") and invoke the 
          "hasChildNodes()" method.   It should return the boolean
          value "true".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-810594187
          */
          hc_nodehaschildnodes : function () {
            var success;
            if(checkInitialization(builder, "hc_nodehaschildnodes") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var state;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            state = employeeNode.hasChildNodes();
            assertTrue("nodeHasChildAssert1",state);

          },
          /**
          * 
          The "hasChildNodes()" method returns false if the node
          does not have any children.

          Retrieve the text of the first "em" element and invoke the "hasChildNodes()" method.   It
          should return false.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-810594187
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodehaschildnodesfalse : function () {
            var success;
            if(checkInitialization(builder, "hc_nodehaschildnodesfalse") != null) return;
            var doc;
            var emList;
            var emNode;
            var emText;
            var hasChild;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            emList = doc.getElementsByTagName("em");
            emNode = emList.item(0);
            emText = emNode.firstChild;

            hasChild = emText.hasChildNodes();
            assertFalse("hasChild",hasChild);

          },
          /**
          * 
          The "insertBefore(newChild,refChild)" method inserts the
          node "newChild" before the node "refChild". 

          Insert a newly created Element node before the second
          sup element in the document and check the "newChild"
          and "refChild" after insertion for correct placement.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=261
          */
          hc_nodeinsertbefore : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbefore") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var refChild;
            var newChild;
            var child;
            var childName;
            var insertedNode;
            var actual = new Array();

            expected = new Array();
            expected[0] = "em";
            expected[1] = "strong";
            expected[2] = "code";
            expected[3] = "br";
            expected[4] = "sup";
            expected[5] = "var";
            expected[6] = "acronym";

            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("sup");
            refChild = elementList.item(2);
            employeeNode = refChild.parentNode;

            childList = employeeNode.childNodes;

            newChild = doc.createElement("br");
            insertedNode = employeeNode.insertBefore(newChild,refChild);
            for(var indexN10091 = 0;indexN10091 < childList.length; indexN10091++) {
              child = childList.item(indexN10091);
              nodeType = child.nodeType;


              if(
                (1 == nodeType)
              ) {
                childName = child.nodeName;

                actual[actual.length] = childName;

              }

            }
            assertEqualsListAutoCase("element", "nodeNames",expected,actual);

          },
          /**
          * 
          If the "newChild" is a DocumentFragment object then all
          its children are inserted in the same order before the
          the "refChild". 

          Create a DocumentFragment object and populate it with
          two Element nodes.   Retrieve the second employee and
          insert the newly created DocumentFragment before its
          fourth child.   The second employee should now have two
          extra children("newChild1" and "newChild2") at 
          positions fourth and fifth respectively.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeinsertbeforedocfragment : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforedocfragment") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var refChild;
            var newdocFragment;
            var newChild1;
            var newChild2;
            var child;
            var childName;
            var appendedChild;
            var insertedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            refChild = childList.item(3);
            newdocFragment = doc.createDocumentFragment();
            newChild1 = doc.createElement("br");
            newChild2 = doc.createElement("b");
            appendedChild = newdocFragment.appendChild(newChild1);
            appendedChild = newdocFragment.appendChild(newChild2);
            insertedNode = employeeNode.insertBefore(newdocFragment,refChild);
            child = childList.item(3);
            childName = child.nodeName;

            assertEqualsAutoCase("element", "childName3","br",childName);
            child = childList.item(4);
            childName = child.nodeName;

            assertEqualsAutoCase("element", "childName4","b",childName);

          },
          /**
          * 
          The "insertBefore(newChild,refChild)" method raises a 
          HIERARCHY_REQUEST_ERR DOMException if this node is of
          a type that does not allow children of the type "newChild"
          to be inserted.

          Retrieve the root node and attempt to insert a newly
          created Attr node.   An Element node cannot have children
          of the "Attr" type, therefore the desired exception
          should be raised.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=406
          */
          hc_nodeinsertbeforeinvalidnodetype : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforeinvalidnodetype") != null) return;
            var doc;
            var rootNode;
            var newChild;
            var elementList;
            var refChild;
            var insertedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            newChild = doc.createAttribute("title");
            elementList = doc.getElementsByTagName("p");
            refChild = elementList.item(1);
            rootNode = refChild.parentNode;


            {
              success = false;
              try {
                insertedNode = rootNode.insertBefore(newChild,refChild);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 3);
              }
              assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
            }

          },
          /**
          * 
          The "insertBefore(newChild,refChild)" method raises a 
          WRONG_DOCUMENT_ERR DOMException if the "newChild" was
          created from a different document than the one that 
          created this node.

          Retrieve the second employee and attempt to insert a new 
          child that was created from a different document than the
          one that created the second employee.   An attempt to
          insert such a child should raise the desired exception.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeinsertbeforenewchilddiffdocument : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforenewchilddiffdocument") != null) return;
            var doc1;
            var doc2;
            var refChild;
            var newChild;
            var elementList;
            var elementNode;
            var insertedNode;

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
            newChild = doc1.createElement("br");
            elementList = doc2.getElementsByTagName("p");
            elementNode = elementList.item(1);
            refChild = elementNode.firstChild;


            {
              success = false;
              try {
                insertedNode = elementNode.insertBefore(newChild,refChild);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 4);
              }
              assertTrue("throw_WRONG_DOCUMENT_ERR",success);
            }

          },
          /**
          * 
          If the "newChild" is already in the tree, the
          "insertBefore(newChild,refChild)" method must first
          remove it before the insertion takes place.

          Insert a node Element ("em") that is already
          present in the tree.   The existing node should be 
          removed first and the new one inserted.   The node is
          inserted at a different position in the tree to assure
          that it was indeed inserted.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
          */
          hc_nodeinsertbeforenewchildexists : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforenewchildexists") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var refChild;
            var newChild;
            var child;
            var childName;
            var insertedNode;
            expected = new Array();
            expected[0] = "strong";
            expected[1] = "code";
            expected[2] = "sup";
            expected[3] = "var";
            expected[4] = "em";
            expected[5] = "acronym";

            var result = new Array();

            var nodeType;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.getElementsByTagName("*");
            refChild = childList.item(5);
            newChild = childList.item(0);
            insertedNode = employeeNode.insertBefore(newChild,refChild);
            for(var indexN1008C = 0;indexN1008C < childList.length; indexN1008C++) {
              child = childList.item(indexN1008C);
              nodeType = child.nodeType;


              if(
                (1 == nodeType)
              ) {
                childName = child.nodeName;

                result[result.length] = childName;

              }

            }
            assertEqualsListAutoCase("element", "childNames",expected,result);

          },
          /**
          * 
          The "insertBefore(newChild,refChild)" method raises a 
          HIERARCHY_REQUEST_ERR DOMException if the node to be
          inserted is one of this nodes ancestors.

          Retrieve the second employee and attempt to insert a
          node that is one of its ancestors(root node).   An 
          attempt to insert such a node should raise the 
          desired exception.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          */
          hc_nodeinsertbeforenodeancestor : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforenodeancestor") != null) return;
            var doc;
            var newChild;
            var elementList;
            var employeeNode;
            var childList;
            var refChild;
            var insertedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            newChild = doc.documentElement;

            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            refChild = childList.item(0);

            {
              success = false;
              try {
                insertedNode = employeeNode.insertBefore(newChild,refChild);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 3);
              }
              assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
            }

          },
          /**
          * 
          The "insertBefore(newChild,refchild)" method returns 
          the node being inserted.

          Insert an Element node before the fourth
          child of the second employee and check the node
          returned from the "insertBefore(newChild,refChild)" 
          method.   The node returned should be "newChild".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeinsertbeforenodename : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforenodename") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var refChild;
            var newChild;
            var insertedNode;
            var childName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            refChild = childList.item(3);
            newChild = doc.createElement("br");
            insertedNode = employeeNode.insertBefore(newChild,refChild);
            childName = insertedNode.nodeName;

            assertEqualsAutoCase("element", "nodeName","br",childName);

          },
          /**
          * 
          The "insertBefore(newChild,refChild)" method raises a 
          NOT_FOUND_ERR DOMException if the reference child is
          not a child of this node.

          Retrieve the second employee and attempt to insert a
          new node before a reference node that is not a child
          of this node.   An attempt to insert before a non child
          node should raise the desired exception.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          hc_nodeinsertbeforerefchildnonexistent : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforerefchildnonexistent") != null) return;
            var doc;
            var refChild;
            var newChild;
            var elementList;
            var elementNode;
            var insertedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            newChild = doc.createElement("br");
            refChild = doc.createElement("b");
            elementList = doc.getElementsByTagName("p");
            elementNode = elementList.item(1);

            {
              success = false;
              try {
                insertedNode = elementNode.insertBefore(newChild,refChild);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 8);
              }
              assertTrue("throw_NOT_FOUND_ERR",success);
            }

          },
          /**
          * 
          If the "refChild" is null then the
          "insertBefore(newChild,refChild)" method inserts the
          node "newChild" at the end of the list of children. 

          Retrieve the second employee and invoke the
          "insertBefore(newChild,refChild)" method with
          refChild=null.   Since "refChild" is null the "newChild"
          should be added to the end of the list.   The last item
          in the list is checked after insertion.   The last Element
          node of the list should be "newChild".

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
          */
          hc_nodeinsertbeforerefchildnull : function () {
            var success;
            if(checkInitialization(builder, "hc_nodeinsertbeforerefchildnull") != null) return;
            var doc;
            var elementList;
            var employeeNode;
            var childList;
            var refChild = null;

            var newChild;
            var child;
            var childName;
            var insertedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("p");
            employeeNode = elementList.item(1);
            childList = employeeNode.childNodes;

            newChild = doc.createElement("br");
            insertedNode = employeeNode.insertBefore(newChild,refChild);
            child = employeeNode.lastChild;

            childName = child.nodeName;

            assertEqualsAutoCase("element", "nodeName","br",childName);

          },
          /**
          * 
          Create a list of all the children elements of the third
          employee and access its first child by using an index
          of 0.  This should result in the whitspace before "em" being
          selected (em when ignoring whitespace).  
          Further we evaluate its content(by using
            the "getNodeName()" method) to ensure the proper
            element was accessed.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodelistindexequalzero : function () {
              var success;
              if(checkInitialization(builder, "hc_nodelistindexequalzero") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var employeeList;
              var child;
              var childName;
              var length;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(2);
              employeeList = employeeNode.childNodes;

              length = employeeList.length;

              child = employeeList.item(0);
              childName = child.nodeName;


              if(
                (13 == length)
              ) {
                assertEquals("childName_w_whitespace","#text",childName);

              }

              else {
                assertEqualsAutoCase("element", "childName_wo_whitespace","em",childName);

              }

            },
            /**
            * 
            The "getLength()" method returns the number of nodes
            in the list.

            Create a list of all the children elements of the third
            employee and invoke the "getLength()" method. 
            It should contain the value 13.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-203510337
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodelistindexgetlength : function () {
              var success;
              if(checkInitialization(builder, "hc_nodelistindexgetlength") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var employeeList;
              var length;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(2);
              employeeList = employeeNode.childNodes;

              length = employeeList.length;


              if(
                (6 == length)
              ) {
                assertEquals("length_wo_space",6,length);

              }

              else {
                assertEquals("length_w_space",13,length);

              }

            },
            /**
            * 
            The "getLength()" method returns the number of nodes
            in the list.(Test for EMPTY list)

            Create a list of all the children of the Text node 
            inside the first child of the third employee and
            invoke the "getLength()" method.   It should contain
            the value 0.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-203510337
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodelistindexgetlengthofemptylist : function () {
              var success;
              if(checkInitialization(builder, "hc_nodelistindexgetlengthofemptylist") != null) return;
              var doc;
              var emList;
              var emNode;
              var textNode;
              var textList;
              var length;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              emList = doc.getElementsByTagName("em");
              emNode = emList.item(2);
              textNode = emNode.firstChild;

              textList = textNode.childNodes;

              length = textList.length;

              assertEquals("length",0,length);

            },
            /**
            * 
            The items in the list are accessible via an integral
            index starting from zero.
            (Index not equal 0)

            Create a list of all the children elements of the third
            employee and access its fourth child by using an index
            of 3 and calling getNodeName() which should return
            "strong" (no whitespace)  or "#text" (with whitespace).

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodelistindexnotzero : function () {
              var success;
              if(checkInitialization(builder, "hc_nodelistindexnotzero") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var employeeList;
              var child;
              var childName;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(2);
              employeeList = employeeNode.childNodes;

              child = employeeList.item(3);
              childName = child.nodeName;


              if(
                ("#text" == childName)
              ) {
                assertEquals("childName_space","#text",childName);

              }

              else {
                assertEqualsAutoCase("element", "childName_strong","strong",childName);

              }

            },
            /**
            * 
            Create a list of all the children elements of the third
            employee and access its first child by invoking the 
            "item(index)" method with an index=0.  This should
            result in node with a nodeName of "#text" or "em".

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodelistreturnfirstitem : function () {
              var success;
              if(checkInitialization(builder, "hc_nodelistreturnfirstitem") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var employeeList;
              var child;
              var childName;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(2);
              employeeList = employeeNode.childNodes;

              child = employeeList.item(0);
              childName = child.nodeName;


              if(
                ("#text" == childName)
              ) {
                assertEquals("nodeName_w_space","#text",childName);

              }

              else {
                assertEqualsAutoCase("element", "nodeName_wo_space","em",childName);

              }

            },
            /**
            * 
            Create a list of all the children elements of the third
            employee and access its last child by invoking the 
            "item(index)" method with an index=length-1.  This should
            result in node with nodeName="#text" or acronym.
            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodelistreturnlastitem : function () {
              var success;
              if(checkInitialization(builder, "hc_nodelistreturnlastitem") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var employeeList;
              var child;
              var childName;
              var index;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(2);
              employeeList = employeeNode.childNodes;

              index = employeeList.length;

              index -= 1;
              child = employeeList.item(index);
              childName = child.nodeName;


              if(
                (12 == index)
              ) {
                assertEquals("lastNodeName_w_whitespace","#text",childName);

              }

              else {
                assertEqualsAutoCase("element", "lastNodeName","acronym",childName);
                assertEquals("index",5,index);

              }

            },
            /**
            * 
            The range of valid child node indices is 0 thru length -1

            Create a list of all the children elements of the third
            employee and traverse the list from index=0 thru
            length -1.     

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-203510337
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodelisttraverselist : function () {
              var success;
              if(checkInitialization(builder, "hc_nodelisttraverselist") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var employeeList;
              var child;
              var childName;
              var nodeType;
              var result = new Array();

              expected = new Array();
              expected[0] = "em";
              expected[1] = "strong";
              expected[2] = "code";
              expected[3] = "sup";
              expected[4] = "var";
              expected[5] = "acronym";


              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(2);
              employeeList = employeeNode.childNodes;

              for(var indexN10073 = 0;indexN10073 < employeeList.length; indexN10073++) {
                child = employeeList.item(indexN10073);
                nodeType = child.nodeType;

                childName = child.nodeName;


                if(
                  (1 == nodeType)
                ) {
                  result[result.length] = childName;

                }

                else {
                  assertEquals("textNodeType",3,nodeType);
                  assertEquals("textNodeName","#text",childName);

                }

              }
              assertEqualsListAutoCase("element", "nodeNames",expected,result);

            },
            /**
            * 
            The "getParentNode()" method returns the parent
            of this node. 

            Retrieve the second employee and invoke the 
            "getParentNode()" method on this node.   It should
            be set to "body".

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1060184317
            */
            hc_nodeparentnode : function () {
              var success;
              if(checkInitialization(builder, "hc_nodeparentnode") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var parentNode;
              var parentName;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(1);
              parentNode = employeeNode.parentNode;

              parentName = parentNode.nodeName;

              assertEqualsAutoCase("element", "parentNodeName","body",parentName);

            },
            /**
            * 
            The "getParentNode()" method invoked on a node that has
            just been created and not yet added to the tree is null. 

            Create a new "employee" Element node using the             
            "createElement(name)" method from the Document interface.
            Since this new node has not yet been added to the tree,
            the "getParentNode()" method will return null.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1060184317
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
            */
            hc_nodeparentnodenull : function () {
              var success;
              if(checkInitialization(builder, "hc_nodeparentnodenull") != null) return;
              var doc;
              var createdNode;
              var parentNode;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              createdNode = doc.createElement("br");
              parentNode = createdNode.parentNode;

              assertNull("parentNode",parentNode);

            },
            /**
            * 
            The "removeChild(oldChild)" method removes the child node
            indicated by "oldChild" from the list of children and
            returns it. 

            Remove the first employee by invoking the
            "removeChild(oldChild)" method an checking the
            node returned by the "getParentNode()" method.   It
            should be set to null.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
            */
            hc_noderemovechild : function () {
              var success;
              if(checkInitialization(builder, "hc_noderemovechild") != null) return;
              var doc;
              var rootNode;
              var childList;
              var childToRemove;
              var removedChild;
              var parentNode;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              rootNode = doc.documentElement;

              childList = rootNode.childNodes;

              childToRemove = childList.item(1);
              removedChild = rootNode.removeChild(childToRemove);
              parentNode = removedChild.parentNode;

              assertNull("parentNodeNull",parentNode);

            },
            /**
            * 
            The "removeChild(oldChild)" method returns 
            the node being removed.

            Remove the first child of the second employee 
            and check the NodeName returned by the 
            "removeChild(oldChild)" method.   The returned node
            should have a NodeName equal to "#text".

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_noderemovechildgetnodename : function () {
              var success;
              if(checkInitialization(builder, "hc_noderemovechildgetnodename") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var childList;
              var oldChild;
              var removedChild;
              var childName;
              var oldName;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(1);
              childList = employeeNode.childNodes;

              oldChild = childList.item(0);
              oldName = oldChild.nodeName;

              removedChild = employeeNode.removeChild(oldChild);
              assertNotNull("notnull",removedChild);
              childName = removedChild.nodeName;

              assertEquals("nodeName",oldName,childName);

            },
            /**
            * 
            The "removeChild(oldChild)" method removes the node
            indicated by "oldChild". 

            Retrieve the second p element and remove its first child.
            After the removal, the second p element should have 5 element
            children and the first child should now be the child
            that used to be at the second position in the list.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_noderemovechildnode : function () {
              var success;
              if(checkInitialization(builder, "hc_noderemovechildnode") != null) return;
              var doc;
              var elementList;
              var emList;
              var employeeNode;
              var childList;
              var oldChild;
              var child;
              var childName;
              var length;
              var removedChild;
              var removedName;
              var nodeType;
              expected = new Array();
              expected[0] = "strong";
              expected[1] = "code";
              expected[2] = "sup";
              expected[3] = "var";
              expected[4] = "acronym";

              var actual = new Array();


              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(1);
              childList = employeeNode.childNodes;

              emList = employeeNode.getElementsByTagName("em");
              oldChild = emList.item(0);
              removedChild = employeeNode.removeChild(oldChild);
              removedName = removedChild.nodeName;

              assertEqualsAutoCase("element", "removedName","em",removedName);
              for(var indexN10098 = 0;indexN10098 < childList.length; indexN10098++) {
                child = childList.item(indexN10098);
                nodeType = child.nodeType;

                childName = child.nodeName;


                if(
                  (1 == nodeType)
                ) {
                  actual[actual.length] = childName;

                }

                else {
                  assertEquals("textNodeType",3,nodeType);
                  assertEquals("textNodeName","#text",childName);

                }

              }
              assertEqualsListAutoCase("element", "childNames",expected,actual);

            },
            /**
            * 
            The "removeChild(oldChild)" method raises a 
            NOT_FOUND_ERR DOMException if the old child is
            not a child of this node.

            Retrieve the second employee and attempt to remove a
            node that is not one of its children.   An attempt to
            remove such a node should raise the desired exception.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1734834066')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
            */
            hc_noderemovechildoldchildnonexistent : function () {
              var success;
              if(checkInitialization(builder, "hc_noderemovechildoldchildnonexistent") != null) return;
              var doc;
              var oldChild;
              var elementList;
              var elementNode;
              var removedChild;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              oldChild = doc.createElement("br");
              elementList = doc.getElementsByTagName("p");
              elementNode = elementList.item(1);

              {
                success = false;
                try {
                  removedChild = elementNode.removeChild(oldChild);
                }
                catch(ex) {
                  success = (typeof(ex.code) != 'undefined' && ex.code == 8);
                }
                assertTrue("throw_NOT_FOUND_ERR",success);
              }

            },
            /**
            * 
            The "replaceChild(newChild,oldChild)" method replaces 
            the node "oldChild" with the node "newChild". 

            Replace the first element of the second employee with
            a newly created Element node.   Check the first position
            after the replacement operation is completed.   The new
            Element should be "newChild".

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
            */
            hc_nodereplacechild : function () {
              var success;
              if(checkInitialization(builder, "hc_nodereplacechild") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var childList;
              var oldChild;
              var newChild;
              var child;
              var childName;
              var replacedNode;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(1);
              childList = employeeNode.childNodes;

              oldChild = childList.item(0);
              newChild = doc.createElement("br");
              replacedNode = employeeNode.replaceChild(newChild,oldChild);
              child = childList.item(0);
              childName = child.nodeName;

              assertEqualsAutoCase("element", "nodeName","br",childName);

            },
            /**
            * 
            The "replaceChild(newChild,oldChild)" method raises a 
            HIERARCHY_REQUEST_ERR DOMException if this node is of
            a type that does not allow children of the type "newChild"
            to be inserted.

            Retrieve the root node and attempt to replace 
            one of its children with a newly created Attr node.
            An Element node cannot have children of the "Attr"
            type, therefore the desired exception should be raised.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=406
            */
            hc_nodereplacechildinvalidnodetype : function () {
              var success;
              if(checkInitialization(builder, "hc_nodereplacechildinvalidnodetype") != null) return;
              var doc;
              var rootNode;
              var newChild;
              var elementList;
              var oldChild;
              var replacedChild;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              newChild = doc.createAttribute("lang");
              elementList = doc.getElementsByTagName("p");
              oldChild = elementList.item(1);
              rootNode = oldChild.parentNode;


              {
                success = false;
                try {
                  replacedChild = rootNode.replaceChild(newChild,oldChild);
                }
                catch(ex) {
                  success = (typeof(ex.code) != 'undefined' && ex.code == 3);
                }
                assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
              }

            },
            /**
            * 
            The "replaceChild(newChild,oldChild)" method raises a 
            WRONG_DOCUMENT_ERR DOMException if the "newChild" was
            created from a different document than the one that 
            created this node.

            Retrieve the second employee and attempt to replace one   
            of its children with a node created from a different 
            document.   An attempt to make such a replacement 
            should raise the desired exception.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
            */
            hc_nodereplacechildnewchilddiffdocument : function () {
              var success;
              if(checkInitialization(builder, "hc_nodereplacechildnewchilddiffdocument") != null) return;
              var doc1;
              var doc2;
              var oldChild;
              var newChild;
              var elementList;
              var elementNode;
              var replacedChild;

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
              newChild = doc1.createElement("br");
              elementList = doc2.getElementsByTagName("p");
              elementNode = elementList.item(1);
              oldChild = elementNode.firstChild;


              {
                success = false;
                try {
                  replacedChild = elementNode.replaceChild(newChild,oldChild);
                }
                catch(ex) {
                  success = (typeof(ex.code) != 'undefined' && ex.code == 4);
                }
                assertTrue("throw_WRONG_DOCUMENT_ERR",success);
              }

            },
            /**
            * 
            If the "newChild" is already in the tree, it is first
            removed before the new one is added.

            Retrieve the second "p" and replace "acronym" with its "em".

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
            */
            hc_nodereplacechildnewchildexists : function () {
              var success;
              if(checkInitialization(builder, "hc_nodereplacechildnewchildexists") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var childList;
              var oldChild = null;

              var newChild = null;

              var child;
              var childName;
              var childNode;
              var actual = new Array();

              expected = new Array();
              expected[0] = "strong";
              expected[1] = "code";
              expected[2] = "sup";
              expected[3] = "var";
              expected[4] = "em";

              var replacedChild;
              var nodeType;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(1);
              childList = employeeNode.getElementsByTagName("*");
              newChild = childList.item(0);
              oldChild = childList.item(5);
              replacedChild = employeeNode.replaceChild(newChild,oldChild);
              assertSame("return_value_same",oldChild,replacedChild);
              for(var indexN10094 = 0;indexN10094 < childList.length; indexN10094++) {
                childNode = childList.item(indexN10094);
                childName = childNode.nodeName;

                nodeType = childNode.nodeType;


                if(
                  (1 == nodeType)
                ) {
                  actual[actual.length] = childName;

                }

                else {
                  assertEquals("textNodeType",3,nodeType);
                  assertEquals("textNodeName","#text",childName);

                }

              }
              assertEqualsListAutoCase("element", "childNames",expected,actual);

            },
            /**
            * 
            The "replaceChild(newChild,oldChild)" method raises a 
            HIERARCHY_REQUEST_ERR DOMException if the node to put
            in is one of this node's ancestors.

            Retrieve the second employee and attempt to replace
            one of its children with an ancestor node(root node).
            An attempt to make such a replacement should raise the 
            desired exception.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            */
            hc_nodereplacechildnodeancestor : function () {
              var success;
              if(checkInitialization(builder, "hc_nodereplacechildnodeancestor") != null) return;
              var doc;
              var newChild;
              var elementList;
              var employeeNode;
              var childList;
              var oldChild;
              var replacedNode;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              newChild = doc.documentElement;

              elementList = doc.getElementsByTagName("p");
              employeeNode = elementList.item(1);
              childList = employeeNode.childNodes;

              oldChild = childList.item(0);

              {
                success = false;
                try {
                  replacedNode = employeeNode.replaceChild(newChild,oldChild);
                }
                catch(ex) {
                  success = (typeof(ex.code) != 'undefined' && ex.code == 3);
                }
                assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
              }

            },
            /**
            * 
            The "replaceChild(newChild,oldChild)" method returns 
            the node being replaced.

            Replace the second Element of the second employee with
            a newly created node Element and check the NodeName 
            returned by the "replaceChild(newChild,oldChild)"
            method.   The returned node should have a NodeName equal
            to "em".

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
            */
            hc_nodereplacechildnodename : function () {
              var success;
              if(checkInitialization(builder, "hc_nodereplacechildnodename") != null) return;
              var doc;
              var elementList;
              var employeeNode;
              var childList;
              var oldChild;
              var newChild;
              var replacedNode;
              var childName;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("p");

              employeeNode = elementList.item(1);
              childList = employeeNode.getElementsByTagName("em");
              oldChild = childList.item(0);
              newChild = doc.createElement("br");
              replacedNode = employeeNode.replaceChild(newChild,oldChild);
              childName = replacedNode.nodeName;

              assertEqualsAutoCase("element", "replacedNodeName","em",childName);

            },
            /**
            * 
            The "replaceChild(newChild,oldChild)" method raises a 
            NOT_FOUND_ERR DOMException if the old child is
            not a child of this node.

            Retrieve the second employee and attempt to replace a
            node that is not one of its children.   An attempt to
            replace such a node should raise the desired exception.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
            * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=247
            */
            hc_nodereplacechildoldchildnonexistent : function () {
              var success;
              if(checkInitialization(builder, "hc_nodereplacechildoldchildnonexistent") != null) return;
              var doc;
              var oldChild;
              var newChild;
              var elementList;
              var elementNode;
              var replacedNode;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              newChild = doc.createElement("br");
              oldChild = doc.createElement("b");
              elementList = doc.getElementsByTagName("p");
              elementNode = elementList.item(1);

              {
                success = false;
                try {
                  replacedNode = elementNode.replaceChild(newChild,oldChild);
                }
                catch(ex) {
                  success = (typeof(ex.code) != 'undefined' && ex.code == 8);
                }
                assertTrue("throw_NOT_FOUND_ERR",success);
              }

            },
            /**
            * 
            The "getAttributes()" method invoked on a Text
            Node returns null.

            Retrieve the Text node from the last child of the
            first employee and invoke the "getAttributes()" method
            on the Text Node.  It should return null.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1312295772
            */
            hc_nodetextnodeattribute : function () {
              var success;
              if(checkInitialization(builder, "hc_nodetextnodeattribute") != null) return;
              var doc;
              var elementList;
              var testAddr;
              var textNode;
              var attrList;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("acronym");
              testAddr = elementList.item(0);
              textNode = testAddr.firstChild;

              attrList = textNode.attributes;

              assertNull("text_attributes_is_null",attrList);

            },
            /**
            * 
            The string returned by the "getNodeName()" method for a 
            Text Node is "#text".

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
            */
            hc_nodetextnodename : function () {
              var success;
              if(checkInitialization(builder, "hc_nodetextnodename") != null) return;
              var doc;
              var elementList;
              var testAddr;
              var textNode;
              var textName;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("acronym");
              testAddr = elementList.item(0);
              textNode = testAddr.firstChild;

              textName = textNode.nodeName;

              assertEquals("textNodeName","#text",textName);

            },
            /**
            * 

            The "getNodeType()" method for a Text Node

            returns the constant value 3.



            Retrieve the Text node from the last child of

            the first employee and invoke the "getNodeType()"   

            method.   The method should return 3. 


            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
            */
            hc_nodetextnodetype : function () {
              var success;
              if(checkInitialization(builder, "hc_nodetextnodetype") != null) return;
              var doc;
              var elementList;
              var testAddr;
              var textNode;
              var nodeType;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("acronym");
              testAddr = elementList.item(0);
              textNode = testAddr.firstChild;

              nodeType = textNode.nodeType;

              assertEquals("nodeTextNodeTypeAssert1",3,nodeType);

            },
            /**
            * 
            The string returned by the "getNodeValue()" method for a 
            Text Node is the content of the Text node.

            Retrieve the Text node from the last child of the first 
            employee and check the string returned by the 
            "getNodeValue()" method.   It should be equal to 
            "1230 North Ave. Dallas, Texas 98551". 

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
            */
            hc_nodetextnodevalue : function () {
              var success;
              if(checkInitialization(builder, "hc_nodetextnodevalue") != null) return;
              var doc;
              var elementList;
              var testAddr;
              var textNode;
              var textValue;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              elementList = doc.getElementsByTagName("acronym");
              testAddr = elementList.item(0);
              textNode = testAddr.firstChild;

              textValue = textNode.nodeValue;

              assertEquals("textNodeValue","1230 North Ave. Dallas, Texas 98551",textValue);

            },
            /**
            * 
            An element is created, setNodeValue is called with a non-null argument, but getNodeValue
            should still return null.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
            */
            hc_nodevalue01 : function () {
              var success;
              if(checkInitialization(builder, "hc_nodevalue01") != null) return;
              var doc;
              var newNode;
              var newValue;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              newNode = doc.createElement("acronym");
              newValue = newNode.nodeValue;

              assertNull("initiallyNull",newValue);
              newNode.nodeValue = "This should have no effect";

              newValue = newNode.nodeValue;

              assertNull("nullAfterAttemptedChange",newValue);

            },
            /**
            * 
            An comment is created, setNodeValue is called with a non-null argument, but getNodeValue
            should still return null.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
            */
            hc_nodevalue02 : function () {
              var success;
              if(checkInitialization(builder, "hc_nodevalue02") != null) return;
              var doc;
              var newNode;
              var newValue;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              newNode = doc.createComment("This is a new Comment node");
              newValue = newNode.nodeValue;

              assertEquals("initial","This is a new Comment node",newValue);
              newNode.nodeValue = "This should have an effect";

              newValue = newNode.nodeValue;

              assertEquals("afterChange","This should have an effect",newValue);

            },
            /**
            * 
            An entity reference is created, setNodeValue is called with a non-null argument, but getNodeValue
            should still return null.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-11C98490
            */
            hc_nodevalue03 : function () {
              var success;
              if(checkInitialization(builder, "hc_nodevalue03") != null) return;
              var doc;
              var newNode;
              var newValue;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");

              // TODO: rework this when we go html

              if(

                (builder.contentType == "text/html" || true)

              ) {

                {
                  success = false;
                  try {
                    newNode = doc.createEntityReference("ent1");
                  }
                  catch(ex) {
                    success = (typeof(ex.code) != 'undefined' && ex.code == 9);
                  }
                  assertTrue("throw_NOT_SUPPORTED_ERR",success);
                }

              }

              else {
                // this code path is invalid... hc_staff is always html and doesn't 
                // include an entity=ent1
                newNode = doc.createEntityReference("ent1");

                assertNotNull("createdEntRefNotNull",newNode);

                newValue = newNode.nodeValue;

                assertNull("initiallyNull",newValue);
                newNode.nodeValue = "This should have no effect";

                newValue = newNode.nodeValue;

                assertNull("nullAfterAttemptedChange",newValue);

              }

            },
            /**
            * 
            An document type accessed, setNodeValue is called with a non-null argument, but getNodeValue
            should still return null.

            * @author Curt Arnold
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
            * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
            */
            hc_nodevalue04 : function () {
              var success;
              if(checkInitialization(builder, "hc_nodevalue04") != null) return;
              var doc;
              var newNode;
              var newValue;

              var docRef = null;
              if (typeof(this.doc) != 'undefined') {
                docRef = this.doc;
              }
              doc = load(docRef, "doc", "hc_staff");
              newNode = doc.doctype;

              assertTrue("docTypeNotNullOrDocIsHTML",

              (
                (newNode != null)
                || 
                (builder.contentType == "text/html")
              )
            );

            if(

              (newNode != null)

            ) {
              assertNotNull("docTypeNotNull",newNode);
              newValue = newNode.nodeValue;

              assertNull("initiallyNull",newValue);
              newNode.nodeValue = "This should have no effect";

              newValue = newNode.nodeValue;

              assertNull("nullAfterAttemptedChange",newValue);

            }

          },
          /**
          * 
          A document fragment is created, setNodeValue is called with a non-null argument, but getNodeValue
          should still return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
          */
          hc_nodevalue05 : function () {
            var success;
            if(checkInitialization(builder, "hc_nodevalue05") != null) return;
            var doc;
            var newNode;
            var newValue;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            newNode = doc.createDocumentFragment();
            newValue = newNode.nodeValue;

            assertNull("initiallyNull",newValue);
            newNode.nodeValue = "This should have no effect";

            newValue = newNode.nodeValue;

            assertNull("nullAfterAttemptedChange",newValue);

          },
          /**
          * 
          An document is accessed, setNodeValue is called with a non-null argument, but getNodeValue
          should still return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
          */
          hc_nodevalue06 : function () {
            var success;
            if(checkInitialization(builder, "hc_nodevalue06") != null) return;
            var newNode;
            var newValue;

            var newNodeRef = null;
            if (typeof(this.newNode) != 'undefined') {
              newNodeRef = this.newNode;
            }
            newNode = load(newNodeRef, "newNode", "hc_staff");
            newValue = newNode.nodeValue;

            assertNull("initiallyNull",newValue);
            newNode.nodeValue = "This should have no effect";

            newValue = newNode.nodeValue;

            assertNull("nullAfterAttemptedChange",newValue);

          },
          /**
          * 
          An Entity is accessed, setNodeValue is called with a non-null argument, but getNodeValue
          should still return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-527DCFF2
          */
          hc_nodevalue07 : function () {
            var success;
            if(checkInitialization(builder, "hc_nodevalue07") != null) return;
            var doc;
            var newNode;
            var newValue;
            var nodeMap;
            var docType;

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
              nodeMap = docType.entities;

              assertNotNull("entitiesNotNull",nodeMap);
              newNode = nodeMap.getNamedItem("alpha");
              assertNotNull("entityNotNull",newNode);
              newValue = newNode.nodeValue;

              assertNull("initiallyNull",newValue);
              newNode.nodeValue = "This should have no effect";

              newValue = newNode.nodeValue;

              assertNull("nullAfterAttemptedChange",newValue);

            }

          },
          /**
          * 
          An notation is accessed, setNodeValue is called with a non-null argument, but getNodeValue
          should still return null.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5431D1B9
          */
          hc_nodevalue08 : function () {
            var success;
            if(checkInitialization(builder, "hc_nodevalue08") != null) return;
            var doc;
            var docType;
            var newNode;
            var newValue;
            var nodeMap;

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
              nodeMap = docType.notations;

              assertNotNull("notationsNotNull",nodeMap);
              newNode = nodeMap.getNamedItem("notation1");
              assertNotNull("notationNotNull",newNode);
              newValue = newNode.nodeValue;

              assertNull("initiallyNull",newValue);
              newNode.nodeValue = "This should have no effect";

              newValue = newNode.nodeValue;

              assertNull("nullAfterAttemptedChange",newValue);

            }

          },
          /**
          * 
          An attempt to add remove an notation should result in a NO_MODIFICATION_ERR.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D46829EF
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          */
          hc_notationsremovenameditem1 : function () {
            var success;
            if(checkInitialization(builder, "hc_notationsremovenameditem1") != null) return;
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

              {
                success = false;
                try {
                  retval = notations.removeNamedItem("notation1");
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
          An attempt to add an element to the named node map returned by notations should 
          result in a NO_MODIFICATION_ERR or HIERARCHY_REQUEST_ERR.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D46829EF
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          */
          hc_notationssetnameditem1 : function () {
            var success;
            if(checkInitialization(builder, "hc_notationssetnameditem1") != null) return;
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
              elem = doc.createElement("br");

              try {
                retval = notations.setNamedItem(elem);
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
          The "splitText(offset)" method raises an
          INDEX_SIZE_ERR DOMException if the specified offset is
          negative.

          Retrieve the textual data from the second child of the 
          third employee and invoke the "splitText(offset)" method.
          The desired exception should be raised since the offset
          is a negative number.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-38853C1D')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
          */
          hc_textindexsizeerrnegativeoffset : function () {
            var success;
            if(checkInitialization(builder, "hc_textindexsizeerrnegativeoffset") != null) return;
            var doc;
            var elementList;
            var nameNode;
            var textNode;
            var splitNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("strong");
            nameNode = elementList.item(2);
            textNode = nameNode.firstChild;


            {
              success = false;
              try {
                splitNode = textNode.splitText(-69);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 1);
              }
              assertTrue("throws_INDEX_SIZE_ERR",success);
            }

          },
          /**
          * 
          The "splitText(offset)" method raises an
          INDEX_SIZE_ERR DOMException if the specified offset is
          greater than the number of characters in the Text node.

          Retrieve the textual data from the second child of the 
          third employee and invoke the "splitText(offset)" method.
          The desired exception should be raised since the offset
          is a greater than the number of characters in the Text
          node.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-38853C1D')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          hc_textindexsizeerroffsetoutofbounds : function () {
            var success;
            if(checkInitialization(builder, "hc_textindexsizeerroffsetoutofbounds") != null) return;
            var doc;
            var elementList;
            var nameNode;
            var textNode;
            var splitNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("strong");
            nameNode = elementList.item(2);
            textNode = nameNode.firstChild;


            {
              success = false;
              try {
                splitNode = textNode.splitText(300);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 1);
              }
              assertTrue("throw_INDEX_SIZE_ERR",success);
            }

          },
          /**
          * 
          Retrieve the textual data from the last child of the 
          second employee.   That node is composed of two   
          EntityReference nodes and two Text nodes.   After
          the content node is parsed, the "acronym" Element
          should contain four children with each one of the
          EntityReferences containing one child.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-11C98490
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-745549614
          */
          hc_textparseintolistofelements : function () {
            var success;
            if(checkInitialization(builder, "hc_textparseintolistofelements") != null) return;
            var doc;
            var elementList;
            var addressNode;
            var childList;
            var child;
            var value;
            var grandChild;
            var length;
            var result = new Array();

            expectedNormal = new Array();
            expectedNormal[0] = "β";
            expectedNormal[1] = " Dallas, ";
            expectedNormal[2] = "γ";
            expectedNormal[3] = "\n 98554";

            expectedExpanded = new Array();
            expectedExpanded[0] = "β Dallas, γ\n 98554";


            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            addressNode = elementList.item(1);
            childList = addressNode.childNodes;

            length = childList.length;

            for(var indexN1007C = 0;indexN1007C < childList.length; indexN1007C++) {
              child = childList.item(indexN1007C);
              value = child.nodeValue;


              if(

                (value == null)

              ) {
                grandChild = child.firstChild;

                assertNotNull("grandChildNotNull",grandChild);
                value = grandChild.nodeValue;

                result[result.length] = value;

              }

              else {
                result[result.length] = value;

              }

            }

            if(
              (1 == length)
            ) {
              assertEqualsList("assertEqCoalescing",expectedExpanded,result);

            }

            else {
              assertEqualsList("assertEqNormal",expectedNormal,result);

            }

          },
          /**
          * 
          The "splitText(offset)" method returns the new Text node.

          Retrieve the textual data from the last child of the 
          first employee and invoke the "splitText(offset)" method.
          The method should return the new Text node.   The offset
          value used for this test is 30.   The "getNodeValue()"
          method is called to check that the new node now contains
          the characters at and after position 30.
          (Starting count at 0)

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
          */
          hc_textsplittextfour : function () {
            var success;
            if(checkInitialization(builder, "hc_textsplittextfour") != null) return;
            var doc;
            var elementList;
            var addressNode;
            var textNode;
            var splitNode;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("acronym");
            addressNode = elementList.item(0);
            textNode = addressNode.firstChild;

            splitNode = textNode.splitText(30);
            value = splitNode.nodeValue;

            assertEquals("textSplitTextFourAssert","98551",value);

          },
          /**
          * 
          The "splitText(offset)" method breaks the Text node into
          two Text nodes at the specified offset keeping each node
          as siblings in the tree.

          Retrieve the textual data from the second child of the 
          third employee and invoke the "splitText(offset)" method.
          The method splits the Text node into two new sibling
          Text nodes keeping both of them in the tree.   This test
          checks the "nextSibling()" method of the original node
          to ensure that the two nodes are indeed siblings.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
          */
          hc_textsplittextone : function () {
            var success;
            if(checkInitialization(builder, "hc_textsplittextone") != null) return;
            var doc;
            var elementList;
            var nameNode;
            var textNode;
            var splitNode;
            var secondPart;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("strong");
            nameNode = elementList.item(2);
            textNode = nameNode.firstChild;

            splitNode = textNode.splitText(7);
            secondPart = textNode.nextSibling;

            value = secondPart.nodeValue;

            assertEquals("textSplitTextOneAssert","Jones",value);

          },
          /**
          * 
          After the "splitText(offset)" method breaks the Text node
          into two Text nodes, the new Text node contains all the
          content at and after the offset point.

          Retrieve the textual data from the second child of the 
          third employee and invoke the "splitText(offset)" method.
          The new Text node should contain all the content
          at and after the offset point.   The "getNodeValue()"
          method is called to check that the new node now contains
          the characters at and after position seven.
          (Starting count at 0)

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
          */
          hc_textsplittextthree : function () {
            var success;
            if(checkInitialization(builder, "hc_textsplittextthree") != null) return;
            var doc;
            var elementList;
            var nameNode;
            var textNode;
            var splitNode;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("strong");
            nameNode = elementList.item(2);
            textNode = nameNode.firstChild;

            splitNode = textNode.splitText(6);
            value = splitNode.nodeValue;

            assertEquals("textSplitTextThreeAssert"," Jones",value);

          },
          /**
          * 
          After the "splitText(offset)" method breaks the Text node
          into two Text nodes, the original node contains all the
          content up to the offset point.

          Retrieve the textual data from the second child of the 
          third employee and invoke the "splitText(offset)" method.
          The original Text node should contain all the content
          up to the offset point.   The "getNodeValue()" method
          is called to check that the original node now contains
          the first five characters.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
          */
          hc_textsplittexttwo : function () {
            var success;
            if(checkInitialization(builder, "hc_textsplittexttwo") != null) return;
            var doc;
            var elementList;
            var nameNode;
            var textNode;
            var splitNode;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("strong");
            nameNode = elementList.item(2);
            textNode = nameNode.firstChild;

            splitNode = textNode.splitText(5);
            value = textNode.nodeValue;

            assertEquals("textSplitTextTwoAssert","Roger",value);

          },
          /**
          * 
          If there is not any markup inside an Element or Attr node
          content, then the text is contained in a single object   
          implementing the Text interface that is the only child
          of the element.

          Retrieve the textual data from the second child of the 
          third employee.   That Text node contains a block of 
          multiple text lines without markup, so they should be
          treated as a single Text node.   The "getNodeValue()"    
          method should contain the combination of the two lines.

          * @author Curt Arnold
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1312295772
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
          */
          hc_textwithnomarkup : function () {
            var success;
            if(checkInitialization(builder, "hc_textwithnomarkup") != null) return;
            var doc;
            var elementList;
            var nameNode;
            var nodeV;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "hc_staff");
            elementList = doc.getElementsByTagName("strong");
            nameNode = elementList.item(2);
            nodeV = nameNode.firstChild;

            value = nodeV.nodeValue;

            assertEquals("textWithNoMarkupAssert","Roger\n Jones",value);

          },
          /**
          * 
          The range of valid child node indices is 0 to Length -1.

          Create a NamedNodeMap object from the attributes of the
          last child of the third employee and traverse the
          list from index 0 thru length -1.  All indices should
          be valid.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D0FB19E
          */
          namednodemapchildnoderange : function () {
            var success;
            if(checkInitialization(builder, "namednodemapchildnoderange") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var child;
            var length;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testEmployee = elementList.item(2);
            attributes = testEmployee.attributes;

            length = attributes.length;

            assertEquals("length",2,length);
            child = attributes.item(0);
            child = attributes.item(1);

          },
          /**
          * 
          The "getNamedItem(name)" method retrieves a node 
          specified by name. 

          Retrieve the second employee and create a NamedNodeMap 
          listing of the attributes of the last child.  Once the
          list is created an invocation of the "getNamedItem(name)"
          method is done with name="domestic".  This should result
          in the domestic Attr node being returned.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          */
          namednodemapgetnameditem : function () {
            var success;
            if(checkInitialization(builder, "namednodemapgetnameditem") != null) return;
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
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testEmployee = elementList.item(1);
            attributes = testEmployee.attributes;

            domesticAttr = attributes.getNamedItem("domestic");
            attrName = domesticAttr.nodeName;

            assertEquals("namednodemapGetNamedItemAssert","domestic",attrName);

          },
          /**
          * 
          The "setNamedItem(arg)" method raises a
          INUSE_ATTRIBUTE_ERR DOMException if "arg" is an
          Attr that is already in an attribute of another Element.

          Create a NamedNodeMap object from the attributes of the
          last child of the third employee and attempt to add
          an attribute that is already being used by the first
          employee.  This should raise the desired exception.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1025163788')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
          * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
          */
          namednodemapinuseattributeerr : function () {
            var success;
            if(checkInitialization(builder, "namednodemapinuseattributeerr") != null) return;
            var doc;
            var elementList;
            var firstNode;
            var testNode;
            var attributes;
            var domesticAttr;
            var setAttr;
            var setNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            firstNode = elementList.item(0);
            domesticAttr = doc.createAttribute("domestic");
            domesticAttr.value = "Yes";

            setAttr = firstNode.setAttributeNode(domesticAttr);
            elementList = doc.getElementsByTagName("address");
            testNode = elementList.item(2);
            attributes = testNode.attributes;


            {
              success = false;
              try {
                setNode = attributes.setNamedItem(domesticAttr);
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 10);
              }
              assertTrue("throw_INUSE_ATTRIBUTE_ERR",success);
            }

          },
          /**
          * 
          The "removeNamedItem(name)" method raises a 
          NOT_FOUND_ERR DOMException if there is not a node
          named "name" in the map.

          Create a NamedNodeMap object from the attributes of the
          last child of the third employee and attempt to remove
          the "district" attribute.  There is not a node named
          "district" in the list and therefore the desired   
          exception should be raised.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INUSE_ATTRIBUTE_ERR'])
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-D58B193')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INUSE_ATTRIBUTE_ERR'])
          */
          namednodemapnotfounderr : function () {
            var success;
            if(checkInitialization(builder, "namednodemapnotfounderr") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var removedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testEmployee = elementList.item(2);
            attributes = testEmployee.attributes;


            {
              success = false;
              try {
                removedNode = attributes.removeNamedItem("district");
              }
              catch(ex) {
                success = (typeof(ex.code) != 'undefined' && ex.code == 8);
              }
              assertTrue("throw_NOT_FOUND_ERR",success);
            }

          },
          /**
          * 
          The "getLength()" method returns the number of nodes
          in the map. 

          Retrieve the second employee and create a NamedNodeMap 
          listing of the attributes of the last child.  Once the
          list is created an invocation of the "getLength()"
          method is executed.  The number of nodes should be 2.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6D0FB19E
          */
          namednodemapnumberofnodes : function () {
            var success;
            if(checkInitialization(builder, "namednodemapnumberofnodes") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var length;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testEmployee = elementList.item(2);
            attributes = testEmployee.attributes;

            length = attributes.length;

            assertEquals("length",2,length);

          },
          /**
          * 
          The "removeNamedItem(name)" method removes a node 
          specified by name. 

          Retrieve the third employee and create a NamedNodeMap 
          object of the attributes of the last child.  Once the
          list is created invoke the "removeNamedItem(name)"
          method with name="street".  This should result
          in the removal of the specified attribute and
          the "getSpecified()" method should return false.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
          */
          namednodemapremovenameditem : function () {
            var success;
            if(checkInitialization(builder, "namednodemapremovenameditem") != null) return;
            var doc;
            var elementList;
            var testAddress;
            var attributes;
            var streetAttr;
            var specified;
            var removedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testAddress = elementList.item(2);
            attributes = testAddress.attributes;

            assertNotNull("attributesNotNull",attributes);
            removedNode = attributes.removeNamedItem("street");
            streetAttr = attributes.getNamedItem("street");
            assertNotNull("streetAttrNotNull",streetAttr);
            specified = streetAttr.specified;

            assertFalse("attrNotSpecified",specified);

          },
          /**
          * 
          If the node removed by the "removeNamedItem(name)" method 
          is an Attr node with a default value it is immediately
          replaced. 

          Retrieve the third employee and create a NamedNodeMap 
          object of the attributes of the last child.  Once the
          list is created invoke the "removeNamedItem(name)"
          method with name="street".  The "removeNamedItem(name)"
          method should remove the "street" attribute and since
          it has a default value of "Yes", that value should
          immediately be the attributes value.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Mar/0002.html
          */
          namednodemapremovenameditemgetvalue : function () {
            var success;
            if(checkInitialization(builder, "namednodemapremovenameditemgetvalue") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var streetAttr;
            var value;
            var removedNode;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testEmployee = elementList.item(2);
            attributes = testEmployee.attributes;

            assertNotNull("attributesNotNull",attributes);
            removedNode = attributes.removeNamedItem("street");
            streetAttr = attributes.getNamedItem("street");

            assertNotNull("streetAttrNotNull",streetAttr);
            value = streetAttr.value;

            assertEquals("namednodemapRemoveNamedItemGetValueAssert","Yes",value);

          },
          /**
          * 
          The "removeNamedItem(name)" method returns the node
          removed from the map.  

          Retrieve the third employee and create a NamedNodeMap 
          object of the attributes of the last child.  Once the
          list is created invoke the "removeNamedItem(name)"
          method with name="street".  The "removeNamedItem(name)"
          method should remove the existing "street" attribute
          and return it.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-D58B193
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          */
          namednodemapremovenameditemreturnnodevalue : function () {
            var success;
            if(checkInitialization(builder, "namednodemapremovenameditemreturnnodevalue") != null) return;
            var doc;
            var elementList;
            var testAddress;
            var attributes;
            var removedNode;
            var value;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testAddress = elementList.item(2);
            attributes = testAddress.attributes;

            removedNode = attributes.removeNamedItem("street");
            value = removedNode.nodeValue;

            assertEquals("namednodemapRemoveNamedItemReturnNodeValueAssert","No",value);

          },
          /**
          * 
          The "getNamedItem(name)" method returns a node of any 
          type specified by name. 

          Retrieve the second employee and create a NamedNodeMap 
          listing of the attributes of the last child.  Once the
          list is created an invocation of the "getNamedItem(name)"
          method is done with name="street".  This should result
          in the method returning an Attr node.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1112119403
          */
          namednodemapreturnattrnode : function () {
            var success;
            if(checkInitialization(builder, "namednodemapreturnattrnode") != null) return;
            var doc;
            var elementList;
            var testEmployee;
            var attributes;
            var streetAttr;
            var attrName;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testEmployee = elementList.item(1);
            attributes = testEmployee.attributes;

            streetAttr = attributes.getNamedItem("street");
            assertInstanceOf("typeAssert","Attr",streetAttr);
            attrName = streetAttr.nodeName;

            assertEquals("nodeName","street",attrName);
            attrName = streetAttr.name;

            assertEquals("attrName","street",attrName);

          },
          /**
          * 
          The "item(index)" method returns the indexth item in 
          the map(test for first item). 

          Retrieve the second employee and create a NamedNodeMap 
          listing of the attributes of the last child. Since the
          DOM does not specify an order of these nodes the contents
          of the FIRST node can contain either "domestic" or "street".
          The test should return "true" if the FIRST node is either
          of these values.

          * @author NIST
          * @author Mary Brady
          * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
          */
          namednodemapreturnfirstitem : function () {
            var success;
            if(checkInitialization(builder, "namednodemapreturnfirstitem") != null) return;
            var doc;
            var elementList;
            var testAddress;
            var attributes;
            var child;
            var name;

            var docRef = null;
            if (typeof(this.doc) != 'undefined') {
              docRef = this.doc;
            }
            doc = load(docRef, "doc", "staff");
            elementList = doc.getElementsByTagName("address");
            testAddress = elementList.item(1);
            attributes = testAddress.attributes;

            child = attributes.item(0);
            name = child.nodeName;

            assertTrue("namednodemapReturnFirstItemAssert",

            (("domestic" == name) || ("street" == name))
          );

        },
        /**
        * 
        The "item(index)" method returns the indexth item in 
        the map(test for last item). 

        Retrieve the second employee and create a NamedNodeMap 
        listing of the attributes of the last child. Since the
        DOM does not specify an order of these nodes the contents
        of the LAST node can contain either "domestic" or "street".
        The test should return "true" if the LAST node is either
        of these values.

        * @author NIST
        * @author Mary Brady
        * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
        */
        namednodemapreturnlastitem : function () {
          var success;
          if(checkInitialization(builder, "namednodemapreturnlastitem") != null) return;
          var doc;
          var elementList;
          var testEmployee;
          var attributes;
          var child;
          var name;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "staff");
          elementList = doc.getElementsByTagName("address");
          testEmployee = elementList.item(1);
          attributes = testEmployee.attributes;

          child = attributes.item(1);
          name = child.nodeName;

          assertTrue("namednodemapReturnLastItemAssert",

          (("domestic" == name) || ("street" == name))
        );

      },
      /**
      * 
      The "getNamedItem(name)" method returns null of the 
      specified name did not identify any node in the map. 

      Retrieve the second employee and create a NamedNodeMap 
      listing of the attributes of the last child.  Once the
      list is created an invocation of the "getNamedItem(name)"
      method is done with name="district".  This name does not 
      match any names in the list therefore the method should
      return null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1074577549
      */
      namednodemapreturnnull : function () {
        var success;
        if(checkInitialization(builder, "namednodemapreturnnull") != null) return;
        var doc;
        var elementList;
        var testEmployee;
        var attributes;
        var districtNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testEmployee = elementList.item(1);
        attributes = testEmployee.attributes;

        districtNode = attributes.getNamedItem("district");
        assertNull("namednodemapReturnNullAssert",districtNode);

      },
      /**
      * 
      The "setNamedItem(arg)" method adds a node using its 
      nodeName attribute. 

      Retrieve the second employee and create a NamedNodeMap 
      object from the attributes of the last child by
      invoking the "getAttributes()" method.  Once the
      list is created an invocation of the "setNamedItem(arg)"
      method is done with arg=newAttr, where newAttr is a
      new Attr Node previously created.  The "setNamedItem(arg)"
      method should add then new node to the NamedNodeItem 
      object by using its "nodeName" attribute("district').
      This node is then retrieved using the "getNamedItem(name)"
      method.  This test uses the "createAttribute(name)"
      method from the document interface.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
      */
      namednodemapsetnameditem : function () {
        var success;
        if(checkInitialization(builder, "namednodemapsetnameditem") != null) return;
        var doc;
        var elementList;
        var newAttribute;
        var testAddress;
        var attributes;
        var districtNode;
        var attrName;
        var setNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddress = elementList.item(1);
        newAttribute = doc.createAttribute("district");
        attributes = testAddress.attributes;

        setNode = attributes.setNamedItem(newAttribute);
        districtNode = attributes.getNamedItem("district");
        attrName = districtNode.nodeName;

        assertEquals("namednodemapSetNamedItemAssert","district",attrName);

      },
      /**
      * 
      If the "setNamedItem(arg)" method replaces an already 
      existing node with the same name then the already 
      existing node is returned.

      Retrieve the third employee and create a NamedNodeMap 
      object from the attributes of the last child by
      invoking the "getAttributes()" method.  Once the
      list is created an invocation of the "setNamedItem(arg)"
      method is done with arg=newAttr, where newAttr is a
      new Attr Node previously created and whose node name
      already exists in the map.  The "setNamedItem(arg)"
      method should replace the already existing node with
      the new one and return the existing node.   
      This test uses the "createAttribute(name)" method from
      the document interface.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
      */
      namednodemapsetnameditemreturnvalue : function () {
        var success;
        if(checkInitialization(builder, "namednodemapsetnameditemreturnvalue") != null) return;
        var doc;
        var elementList;
        var newAttribute;
        var testAddress;
        var attributes;
        var newNode;
        var attrValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddress = elementList.item(2);
        newAttribute = doc.createAttribute("street");
        attributes = testAddress.attributes;

        newNode = attributes.setNamedItem(newAttribute);
        attrValue = newNode.nodeValue;

        assertEquals("returnedNodeValue","No",attrValue);

      },
      /**
      * 
      If the node to be added by the "setNamedItem(arg)" method 
      already exists in the NamedNodeMap, it is replaced by
      the new one.

      Retrieve the second employee and create a NamedNodeMap 
      object from the attributes of the last child by
      invoking the "getAttributes()" method.  Once the
      list is created an invocation of the "setNamedItem(arg)"
      method is done with arg=newAttr, where newAttr is a
      new Attr Node previously created and whose node name
      already exists in the map.  The "setNamedItem(arg)"
      method should replace the already existing node with
      the new one.   
      This node is then retrieved using the "getNamedItem(name)"
      method.  This test uses the "createAttribute(name)"
      method from the document interface

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
      */
      namednodemapsetnameditemthatexists : function () {
        var success;
        if(checkInitialization(builder, "namednodemapsetnameditemthatexists") != null) return;
        var doc;
        var elementList;
        var newAttribute;
        var testAddress;
        var attributes;
        var districtNode;
        var attrValue;
        var setNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddress = elementList.item(1);
        newAttribute = doc.createAttribute("street");
        attributes = testAddress.attributes;

        setNode = attributes.setNamedItem(newAttribute);
        districtNode = attributes.getNamedItem("street");
        attrValue = districtNode.nodeValue;

        assertEquals("streetValue","",attrValue);

      },
      /**
      * 
      If the "setNamedItem(arg)" method does not replace an 
      existing node with the same name then it returns null. 

      Retrieve the third employee and create a NamedNodeMap 
      object from the attributes of the last child.
      Once the list is created the "setNamedItem(arg)" method
      is invoked with arg=newAttr, where newAttr is a
      newly created Attr Node and whose node name
      already exists in the map.  The "setNamedItem(arg)"
      method should add the new node and return null.
      This test uses the "createAttribute(name)" method from
      the document interface.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-349467F9
      */
      namednodemapsetnameditemwithnewvalue : function () {
        var success;
        if(checkInitialization(builder, "namednodemapsetnameditemwithnewvalue") != null) return;
        var doc;
        var elementList;
        var newAttribute;
        var testAddress;
        var attributes;
        var newNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddress = elementList.item(2);
        newAttribute = doc.createAttribute("district");
        attributes = testAddress.attributes;

        newNode = attributes.setNamedItem(newAttribute);
        assertNull("returnedNodeNull",newNode);

      },
      /**
      * 
      The "setNamedItem(arg)" method raises a 
      WRONG_DOCUMENT_ERR DOMException if "arg" was created
      from a different document than the one that created
      the NamedNodeMap. 

      Create a NamedNodeMap object from the attributes of the
      last child of the third employee and attempt to add
      another Attr node to it that was created from a 
      different DOM document.  This should raise the desired
      exception.  This method uses the "createAttribute(name)"
      method from the Document interface.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1025163788
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1025163788')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      namednodemapwrongdocumenterr : function () {
        var success;
        if(checkInitialization(builder, "namednodemapwrongdocumenterr") != null) return;
        var doc1;
        var doc2;
        var elementList;
        var testAddress;
        var attributes;
        var newAttribute;
        var setNode;

        var doc1Ref = null;
        if (typeof(this.doc1) != 'undefined') {
          doc1Ref = this.doc1;
        }
        doc1 = load(doc1Ref, "doc1", "staff");

        var doc2Ref = null;
        if (typeof(this.doc2) != 'undefined') {
          doc2Ref = this.doc2;
        }
        doc2 = load(doc2Ref, "doc2", "staff");
        elementList = doc1.getElementsByTagName("address");
        testAddress = elementList.item(2);
        newAttribute = doc2.createAttribute("newAttribute");
        attributes = testAddress.attributes;


        {
          success = false;
          try {
            setNode = attributes.setNamedItem(newAttribute);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 4);
          }
          assertTrue("throw_WRONG_DOCUMENT_ERR",success);
        }

      },
      /**
      * 
      The "appendChild(newChild)" method adds the node
      "newChild" to the end of the list of children of the
      node.

      Retrieve the second employee and append a new Element
      node to the list of children.   The last node in the list
      is then retrieved and its NodeName examined.   The
      "getNodeName()" method should return "newChild".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      */
      nodeappendchild : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchild") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var createdNode;
        var lchild;
        var childName;
        var appendedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        createdNode = doc.createElement("newChild");
        appendedChild = employeeNode.appendChild(createdNode);
        lchild = employeeNode.lastChild;

        childName = lchild.nodeName;

        assertEquals("nodeAppendChildAssert1","newChild",childName);

      },
      /**
      * 
      If the "newChild" is already in the tree, it is first
      removed before the new one is appended.

      Retrieve the first child of the second employee and   
      append the first child to the end of the list.   After
      the "appendChild(newChild)" method is invoked the first 
      child should be the one that was second and the last
      child should be the one that was first.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      */
      nodeappendchildchildexists : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchildchildexists") != null) return;
        var doc;
        var elementList;
        var childNode;
        var newChild;
        var lchild;
        var fchild;
        var lchildName;
        var fchildName;
        var appendedChild;
        var initialName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        childNode = elementList.item(1);
        newChild = childNode.firstChild;

        initialName = newChild.nodeName;

        appendedChild = childNode.appendChild(newChild);
        fchild = childNode.firstChild;

        fchildName = fchild.nodeName;

        lchild = childNode.lastChild;

        lchildName = lchild.nodeName;


        if(
          ("employeeId" == initialName)
        ) {
          assertEquals("assert1_nowhitespace","name",fchildName);
          assertEquals("assert2_nowhitespace","employeeId",lchildName);

        }

        else {
          assertEquals("assert1","employeeId",fchildName);
          assertEquals("assert2","#text",lchildName);

        }

      },
      /**
      * 
      Create and populate a new DocumentFragment object and
      append it to the second employee.   After the 
      "appendChild(newChild)" method is invoked retrieve the
      new nodes at the end of the list, they should be the
      three (Jos: was two) Element nodes from the DocumentFragment.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * MODIFIED BY Jos Shepherd - added a third new child 
      */
      nodeappendchilddocfragment : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchilddocfragment") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var newdocFragment;
        var newChild1;
        var newChild2;
        var newChild3;

        var child;
        var childName;
        var result = new Array();

        var nodeType;
        var appendedChild;
        expected = new Array();
        expected[0] = "employeeId";
        expected[1] = "name";
        expected[2] = "position";
        expected[3] = "salary";
        expected[4] = "gender";
        expected[5] = "address";
        expected[6] = "newChild1";
        expected[7] = "newChild2";
        expected[8] = "newChild3";


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        newdocFragment = doc.createDocumentFragment();
        newChild1 = doc.createElement("newChild1");
        newChild2 = doc.createElement("newChild2");
        newChild3 = doc.createElement("newChild3");

        appendedChild = newdocFragment.appendChild(newChild1);
        appendedChild = newdocFragment.appendChild(newChild2);
        appendedChild = newdocFragment.appendChild(newChild3);

        appendedChild = employeeNode.appendChild(newdocFragment);

        for(var indexN1009F = 0;indexN1009F < childList.length; indexN1009F++) {
          child = childList.item(indexN1009F);
          nodeType = child.nodeType;


          if(
            (1 == nodeType)
          ) {
            childName = child.nodeName;

            result[result.length] = childName;

          }

        }
        assertEqualsList("elementNames",expected,result);

      },
      /**
      * 
      The "appendChild(newChild)" method returns the node
      added.

      Append a newly created node to the child list of the 
      second employee and check the NodeName returned.   The
      "getNodeName()" method should return "newChild".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      */
      nodeappendchildgetnodename : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchildgetnodename") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var newChild;
        var appendNode;
        var childName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        newChild = doc.createElement("newChild");
        appendNode = employeeNode.appendChild(newChild);
        childName = appendNode.nodeName;

        assertEquals("nodeAppendChildGetNodeNameAssert1","newChild",childName);

      },
      /**
      * 
      The "appendChild(newChild)" method raises a 
      HIERARCHY_REQUEST_ERR DOMException if this node is of
      a type that does not allow children of the type "newChild"
      to be inserted.

      Retrieve the root node and attempt to append a newly
      created Attr node.   An Element node cannot have children
      of the "Attr" type, therefore the desired exception
      should be raised.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodeappendchildinvalidnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchildinvalidnodetype") != null) return;
        var doc;
        var rootNode;
        var newChild;
        var appendedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        rootNode = doc.documentElement;

        newChild = doc.createAttribute("newAttribute");

        {
          success = false;
          try {
            appendedChild = rootNode.appendChild(newChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      },
      /**
      * 
      The "appendChild(newChild)" method raises a 
      WRONG_DOCUMENT_ERR DOMException if the "newChild" was
      created from a different document than the one that 
      created this node.

      Retrieve the second employee and attempt to append    
      a node created from a different document.   An attempt 
      to make such a replacement should raise the desired 
      exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodeappendchildnewchilddiffdocument : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchildnewchilddiffdocument") != null) return;
        var doc1;
        var doc2;
        var newChild;
        var elementList;
        var elementNode;
        var appendedChild;

        var doc1Ref = null;
        if (typeof(this.doc1) != 'undefined') {
          doc1Ref = this.doc1;
        }
        doc1 = load(doc1Ref, "doc1", "staff");

        var doc2Ref = null;
        if (typeof(this.doc2) != 'undefined') {
          doc2Ref = this.doc2;
        }
        doc2 = load(doc2Ref, "doc2", "staff");
        newChild = doc1.createElement("newChild");
        elementList = doc2.getElementsByTagName("employee");
        elementNode = elementList.item(1);

        {
          success = false;
          try {
            appendedChild = elementNode.appendChild(newChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 4);
          }
          assertTrue("throw_WRONG_DOCUMENT_ERR",success);
        }

      },
      /**
      * 
      The "appendChild(newChild)" method raises a 
      HIERARCHY_REQUEST_ERR DOMException if the node to 
      append is one of this node's ancestors.

      Retrieve the second employee and attempt to append 
      an ancestor node(root node) to it.
      An attempt to make such an addition should raise the 
      desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodeappendchildnodeancestor : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchildnodeancestor") != null) return;
        var doc;
        var newChild;
        var elementList;
        var employeeNode;
        var appendedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newChild = doc.documentElement;

        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);

        {
          success = false;
          try {
            appendedChild = employeeNode.appendChild(newChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      },
      /**
      * 
      The "appendChild(newChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Obtain the children of the THIRD "gender" element.   The elements
      content is an entity reference.   Get the FIRST item 
      from the entity reference and execute the "appendChild(newChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      */
      nodeappendchildnomodificationallowederr : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchildnomodificationallowederr") != null) return;
        var doc;
        var genderList;
        var genderNode;
        var entRef;
        var entElement;
        var createdNode;
        var appendedNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        genderList = doc.getElementsByTagName("gender");
        genderNode = genderList.item(2);
        entRef = genderNode.firstChild;

        assertNotNull("entRefNotNull",entRef);
        nodeType = entRef.nodeType;


        if(
          (1 == nodeType)
        ) {
          entRef = doc.createEntityReference("ent4");
          assertNotNull("createdEntRefNotNull",entRef);

        }
        entElement = entRef.firstChild;

        assertNotNull("entElementNotNull",entElement);
        createdNode = doc.createElement("text3");

        {
          success = false;
          try {
            appendedNode = entElement.appendChild(createdNode);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "appendChild(newChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Create an ent4 entity reference and  the "appendChild(newChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-184E7107')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/nodeappendchildnomodificationallowederr.xml
      */
      nodeappendchildnomodificationallowederrEE : function () {
        var success;
        if(checkInitialization(builder, "nodeappendchildnomodificationallowederrEE") != null) return;
        var doc;
        var entRef;
        var createdNode;
        var appendedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        entRef = doc.createEntityReference("ent4");
        assertNotNull("createdEntRefNotNull",entRef);
        createdNode = doc.createElement("text3");

        {
          success = false;
          try {
            appendedNode = entRef.appendChild(createdNode);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "getAttributes()" method invoked on an Attribute
      Node returns null.

      Retrieve the first attribute from the last child of the
      first employee and invoke the "getAttributes()" method
      on the Attribute Node.  It should return null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-637646024
      */
      nodeattributenodeattribute : function () {
        var success;
        if(checkInitialization(builder, "nodeattributenodeattribute") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var addrAttr;
        var attrNode;
        var attrList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        addrAttr = testAddr.attributes;

        attrNode = addrAttr.item(0);
        attrList = attrNode.attributes;

        assertNull("nodeAttributeNodeAttributeAssert1",attrList);

      },
      /**
      * 

      The string returned by the "getNodeName()" method for an 

      Attribute Node is the name of the Attribute.



      Retrieve the Attribute named "domestic" from the last 

      child of the first employee and check the string returned 

      by the "getNodeName()" method.   It should be equal to 

      "domestic". 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodeattributenodename : function () {
        var success;
        if(checkInitialization(builder, "nodeattributenodename") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var addrAttr;
        var attrName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        addrAttr = testAddr.getAttributeNode("domestic");
        attrName = addrAttr.nodeName;

        assertEquals("nodeAttributeNodeNameAssert1","domestic",attrName);

      },
      /**
      * 

      The "getNodeType()" method for an Attribute Node

      returns the constant value 2.



      Retrieve the first attribute from the last child of

      the first employee and invoke the "getNodeType()"   

      method.   The method should return 2. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodeattributenodetype : function () {
        var success;
        if(checkInitialization(builder, "nodeattributenodetype") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var addrAttr;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        addrAttr = testAddr.getAttributeNode("domestic");
        nodeType = addrAttr.nodeType;

        assertEquals("nodeAttrNodeTypeAssert1",2,nodeType);

      },
      /**
      * 

      The string returned by the "getNodeValue()" method for an 

      Attribute Node is the value of the Attribute.



      Retrieve the Attribute named "domestic" from the last 

      child of the first employee and check the string returned 

      by the "getNodeValue()" method.   It should be equal to 

      "Yes". 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodeattributenodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodeattributenodevalue") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var addrAttr;
        var attrValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        addrAttr = testAddr.getAttributeNode("domestic");
        attrValue = addrAttr.nodeValue;

        assertEquals("nodeAttributeNodeValueAssert1","Yes",attrValue);

      },
      /**
      * 
      The "getAttributes()" method invoked on a CDATASection
      Node returns null.

      Retrieve the CDATASection node contained inside the
      second child of the second employee and invoke the
      "getAttributes()" method on the CDATASection node.
      It should return null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-667469212
      */
      nodecdatasectionnodeattribute : function () {
        var success;
        if(checkInitialization(builder, "nodecdatasectionnodeattribute") != null) return;
        var doc;
        var elementList;
        var cdataName;
        var cdataNode;
        var attrList;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        cdataName = elementList.item(1);
        cdataNode = cdataName.lastChild;

        nodeType = cdataNode.nodeType;


        if(
          !(4 == nodeType)
        ) {
          cdataNode = doc.createCDATASection("");

        }
        attrList = cdataNode.attributes;

        assertNull("cdataSection",attrList);

      },
      /**
      * 
      The string returned by the "getNodeName()" method for a 
      CDATASection Node is #cdata-section".

      Retrieve the CDATASection node inside the second child
      of the second employee and check the string returned 
      by the "getNodeName()" method.   It should be equal to 
      "#cdata-section". 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-667469212
      */
      nodecdatasectionnodename : function () {
        var success;
        if(checkInitialization(builder, "nodecdatasectionnodename") != null) return;
        var doc;
        var elementList;
        var cdataName;
        var cdataNode;
        var nodeType;
        var cdataNodeName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        cdataName = elementList.item(1);
        cdataNode = cdataName.lastChild;

        nodeType = cdataNode.nodeType;


        if(
          !(4 == nodeType)
        ) {
          cdataNode = doc.createCDATASection("");

        }
        cdataNodeName = cdataNode.nodeName;

        assertEquals("cdataNodeName","#cdata-section",cdataNodeName);

      },
      /**
      * 
      The "getNodeType()" method for a CDATASection Node
      returns the constant value 4.

      Retrieve the CDATASection node contained inside the
      second child of the second employee and invoke the 
      "getNodeType()" method.   The method should return 4. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-667469212
      */
      nodecdatasectionnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodecdatasectionnodetype") != null) return;
        var doc;
        var elementList;
        var testName;
        var cdataNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        testName = elementList.item(1);
        cdataNode = testName.lastChild;

        nodeType = cdataNode.nodeType;


        if(
          (3 == nodeType)
        ) {
          cdataNode = doc.createCDATASection("");
          nodeType = cdataNode.nodeType;


        }
        assertEquals("nodeTypeCDATA",4,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      CDATASection Node is the content of the CDATASection. 

      Retrieve the CDATASection node inside the second child
      of the second employee and check the string returned 
      by the "getNodeValue()" method.   It should be equal to 
      "This is a CDATA Section with EntityReference number 2 
      &ent2;".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-667469212
      */
      nodecdatasectionnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodecdatasectionnodevalue") != null) return;
        var doc;
        var elementList;
        var cdataName;
        var childList;
        var child;
        var cdataNodeValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        cdataName = elementList.item(1);
        childList = cdataName.childNodes;

        child = childList.item(1);

        if(

          (child == null)

        ) {
          child = doc.createCDATASection("This is a CDATASection with EntityReference number 2 &ent2;");

        }
        cdataNodeValue = child.nodeValue;

        assertEquals("value","This is a CDATASection with EntityReference number 2 &ent2;",cdataNodeValue);

      },
      /**
      * 
      Collect the element names from Node.childNodes and check against expectations.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
      */
      nodechildnodes : function () {
        var success;
        if(checkInitialization(builder, "nodechildnodes") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childNodes;
        var childNode;
        var childType;
        var childName;
        var elementNames = new Array();

        expectedElementNames = new Array();
        expectedElementNames[0] = "employeeId";
        expectedElementNames[1] = "name";
        expectedElementNames[2] = "position";
        expectedElementNames[3] = "salary";
        expectedElementNames[4] = "gender";
        expectedElementNames[5] = "address";


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childNodes = employeeNode.childNodes;

        for(var indexN1006C = 0;indexN1006C < childNodes.length; indexN1006C++) {
          childNode = childNodes.item(indexN1006C);
          childType = childNode.nodeType;


          if(
            (1 == childType)
          ) {
            childName = childNode.nodeName;

            elementNames[elementNames.length] = childName;

          }

        }
        assertEqualsList("elementNames",expectedElementNames,elementNames);

      },
      /**
      * 
      Add an element and check that the previously retrieved childNodes NodeList
      is live.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
      */
      nodechildnodesappendchild : function () {
        var success;
        if(checkInitialization(builder, "nodechildnodesappendchild") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var createdNode;
        var expectedLength;
        var length;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        expectedLength = childList.length;

        expectedLength += 1;
        createdNode = doc.createElement("text3");
        employeeNode = employeeNode.appendChild(createdNode);
        length = childList.length;

        assertEquals("childNodeLength",expectedLength,length);

      },
      /**
      * 
      The "getChildNodes()" method returns a NodeList
      that contains all children of this node.   If there
      are not any children, this is a NodeList that does not 
      contain any nodes. 

      Retrieve the Text node from the second child of the second
      employee and invoke the "getChildNodes()" method.   The
      NodeList returned should not have any nodes.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
      */
      nodechildnodesempty : function () {
        var success;
        if(checkInitialization(builder, "nodechildnodesempty") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var secondCNode;
        var textNode;
        var childNodesList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        secondCNode = childList.item(1);
        textNode = secondCNode.firstChild;

        childNodesList = textNode.childNodes;

        assertSize("nodeChildNodesEmptyAssert1",0,childNodesList);

      },
      /**
      * 
      If the cloneNode method is used to clone an
      Element node, all the attributes of the Element are
      copied along with their values.

      Retrieve the last child of the second employee and invoke
      the cloneNode method.   The
      duplicate node returned by the method should copy the
      attributes associated with this node.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      */
      nodecloneattributescopied : function () {
        var success;
        if(checkInitialization(builder, "nodecloneattributescopied") != null) return;
        var doc;
        var elementList;
        var addressNode;
        var clonedNode;
        var attributes;
        var attributeNode;
        var attributeName;
        var result = new Array();

        expectedResult = new Array();
        expectedResult[0] = "domestic";
        expectedResult[1] = "street";


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        addressNode = elementList.item(1);
        clonedNode = addressNode.cloneNode(false);
        attributes = clonedNode.attributes;

        for(var indexN10065 = 0;indexN10065 < attributes.length; indexN10065++) {
          attributeNode = attributes.item(indexN10065);
          attributeName = attributeNode.nodeName;

          result[result.length] = attributeName;

        }
        assertEqualsCollection("nodeCloneAttributesCopiedAssert1",expectedResult,result);

      },
      /**
      * 
      The "cloneNode(deep)" method does not copy text unless it
      is deep cloned.(Test for deep=false)

      Retrieve the fourth child of the second employee and
      the "cloneNode(deep)" method with deep=false.   The
      duplicate node returned by the method should not copy
      any text data contained in this node.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
      */
      nodeclonefalsenocopytext : function () {
        var success;
        if(checkInitialization(builder, "nodeclonefalsenocopytext") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var childNode;
        var clonedNode;
        var lastChildNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        childNode = childList.item(3);
        clonedNode = childNode.cloneNode(false);
        lastChildNode = clonedNode.lastChild;

        assertNull("noTextNodes",lastChildNode);

      },
      /**
      * 
      The duplicate node returned by the "cloneNode(deep)"
      method does not have a ParentNode.

      Retrieve the second employee and invoke the
      "cloneNode(deep)" method with deep=false.   The
      duplicate node returned should return null when the
      "getParentNode()" is invoked.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
      */
      nodeclonegetparentnull : function () {
        var success;
        if(checkInitialization(builder, "nodeclonegetparentnull") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var clonedNode;
        var parentNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        clonedNode = employeeNode.cloneNode(false);
        parentNode = clonedNode.parentNode;

        assertNull("nodeCloneGetParentNullAssert1",parentNode);

      },
      /**
      * 
      The "cloneNode(deep)" method returns a copy of the node
      only if deep=false.

      Retrieve the second employee and invoke the
      "cloneNode(deep)" method with deep=false.   The
      method should only clone this node.   The NodeName and
      length of the NodeList are checked.   The "getNodeName()"
      method should return "employee" and the "getLength()"
      method should return 0.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
      */
      nodeclonenodefalse : function () {
        var success;
        if(checkInitialization(builder, "nodeclonenodefalse") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var clonedNode;
        var cloneName;
        var cloneChildren;
        var length;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        clonedNode = employeeNode.cloneNode(false);
        cloneName = clonedNode.nodeName;

        assertEquals("name","employee",cloneName);
        cloneChildren = clonedNode.childNodes;

        length = cloneChildren.length;

        assertEquals("length",0,length);

      },
      /**
      * 
      The "cloneNode(deep)" method returns a copy of the node
      and the subtree under it if deep=true.

      Retrieve the second employee and invoke the
      "cloneNode(deep)" method with deep=true.   The
      method should clone this node and the subtree under it.
      The NodeName of each child in the returned node is 
      checked to insure the entire subtree under the second
      employee was cloned.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
      */
      nodeclonenodetrue : function () {
        var success;
        if(checkInitialization(builder, "nodeclonenodetrue") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var clonedNode;
        var clonedList;
        var clonedChild;
        var clonedChildName;
        var length;
        var result = new Array();

        expectedWhitespace = new Array();
        expectedWhitespace[0] = "#text";
        expectedWhitespace[1] = "employeeId";
        expectedWhitespace[2] = "#text";
        expectedWhitespace[3] = "name";
        expectedWhitespace[4] = "#text";
        expectedWhitespace[5] = "position";
        expectedWhitespace[6] = "#text";
        expectedWhitespace[7] = "salary";
        expectedWhitespace[8] = "#text";
        expectedWhitespace[9] = "gender";
        expectedWhitespace[10] = "#text";
        expectedWhitespace[11] = "address";
        expectedWhitespace[12] = "#text";

        expectedNoWhitespace = new Array();
        expectedNoWhitespace[0] = "employeeId";
        expectedNoWhitespace[1] = "name";
        expectedNoWhitespace[2] = "position";
        expectedNoWhitespace[3] = "salary";
        expectedNoWhitespace[4] = "gender";
        expectedNoWhitespace[5] = "address";


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        length = childList.length;

        clonedNode = employeeNode.cloneNode(true);
        clonedList = clonedNode.childNodes;
        for(var indexN100AE = 0;indexN100AE < clonedList.length; indexN100AE++) {
          clonedChild = clonedList.item(indexN100AE);
          clonedChildName = clonedChild.nodeName;

          result[result.length] = clonedChildName;

        }

        if(
          (6 == length)
        ) {
          assertEqualsList("nowhitespace",expectedNoWhitespace,result);

        }

        else {
          assertEqualsList("whitespace",expectedWhitespace,result);

        }

      },
      /**
      * 
      Retrieve the second salary and
      the "cloneNode(deep)" method with deep=true.   The
      duplicate node returned by the method should copy
      any text data contained in this node.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-3A0ED0A4
      */
      nodeclonetruecopytext : function () {
        var success;
        if(checkInitialization(builder, "nodeclonetruecopytext") != null) return;
        var doc;
        var elementList;
        var childList;
        var childNode;
        var clonedNode;
        var lastChildNode;
        var childValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("salary");
        childNode = elementList.item(1);
        clonedNode = childNode.cloneNode(true);
        lastChildNode = clonedNode.lastChild;

        childValue = lastChildNode.nodeValue;

        assertEquals("nodeCloneTrueCopyTextAssert1","35,000",childValue);

      },
      /**
      * 
      The "getAttributes()" method invoked on a Comment 
      Node returns null.

      Find any comment that is an immediate child of the root
      and assert that Node.attributes is null.  Then create
      a new comment node (in case they had been omitted) and
      make the assertion.    

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=248
      */
      nodecommentnodeattributes : function () {
        var success;
        if(checkInitialization(builder, "nodecommentnodeattributes") != null) return;
        var doc;
        var childList;
        var childNode;
        var attrList;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        childList = doc.childNodes;

        for(var indexN10043 = 0;indexN10043 < childList.length; indexN10043++) {
          childNode = childList.item(indexN10043);
          nodeType = childNode.nodeType;


          if(
            (8 == nodeType)
          ) {
            attrList = childNode.attributes;

            assertNull("attributesNull",attrList);

          }

        }
        childNode = doc.createComment("This is a comment");
        attrList = childNode.attributes;

        assertNull("createdAttributesNull",attrList);

      },
      /**
      * 
      The string returned by the "getNodeName()" method for a 
      Comment Node is "#comment".

      Retrieve the Comment node in the XML file 
      and check the string returned by the "getNodeName()" 
      method.   It should be equal to "#comment".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
      */
      nodecommentnodename : function () {
        var success;
        if(checkInitialization(builder, "nodecommentnodename") != null) return;
        var doc;
        var elementList;
        var commentNode;
        var nodeType;
        var commentNodeName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.childNodes;

        for(var indexN10040 = 0;indexN10040 < elementList.length; indexN10040++) {
          commentNode = elementList.item(indexN10040);
          nodeType = commentNode.nodeType;


          if(
            (8 == nodeType)
          ) {
            commentNodeName = commentNode.nodeName;

            assertEquals("commentNodeName","#comment",commentNodeName);

          }

        }

      },
      /**
      * 
      The "getNodeType()" method for a Comment Node
      returns the constant value 8.

      Retrieve the nodes from the document and check for
      a comment node and invoke the "getNodeType()" method.   This should   
      return 8. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
      */
      nodecommentnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodecommentnodetype") != null) return;
        var doc;
        var testList;
        var commentNode;
        var commentNodeName;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        testList = doc.childNodes;

        for(var indexN10040 = 0;indexN10040 < testList.length; indexN10040++) {
          commentNode = testList.item(indexN10040);
          commentNodeName = commentNode.nodeName;


          if(
            ("#comment" == commentNodeName)
          ) {
            nodeType = commentNode.nodeType;

            assertEquals("nodeCommentNodeTypeAssert1",8,nodeType);

          }

        }

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      Comment Node is the content of the comment.

      Retrieve the comment in the XML file and   
      check the string returned by the "getNodeValue()" method. 
      It should be equal to "This is comment number 1".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
      */
      nodecommentnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodecommentnodevalue") != null) return;
        var doc;
        var elementList;
        var commentNode;
        var commentName;
        var commentValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.childNodes;

        for(var indexN10040 = 0;indexN10040 < elementList.length; indexN10040++) {
          commentNode = elementList.item(indexN10040);
          commentName = commentNode.nodeName;


          if(
            ("#comment" == commentName)
          ) {
            commentValue = commentNode.nodeValue;

            assertEquals("value"," This is comment number 1.",commentValue);

          }

        }

      },
      /**
      * 
      The string returned by the "getNodeName()" method for a 
      DocumentFragment Node is "#document-frament".

      Retrieve the DOM document and invoke the
      "createDocumentFragment()" method and check the string      
      returned by the "getNodeName()" method.   It should be 
      equal to "#document-fragment".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
      */
      nodedocumentfragmentnodename : function () {
        var success;
        if(checkInitialization(builder, "nodedocumentfragmentnodename") != null) return;
        var doc;
        var docFragment;
        var documentFragmentName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docFragment = doc.createDocumentFragment();
        documentFragmentName = docFragment.nodeName;

        assertEquals("nodeDocumentFragmentNodeNameAssert1","#document-fragment",documentFragmentName);

      },
      /**
      * 
      The "getNodeType()" method for a DocumentFragment Node
      returns the constant value 11.

      Invoke the "createDocumentFragment()" method and    
      examine the NodeType of the document fragment
      returned by the "getNodeType()" method.   The method 
      should return 11. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
      */
      nodedocumentfragmentnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodedocumentfragmentnodetype") != null) return;
        var doc;
        var documentFragmentNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        documentFragmentNode = doc.createDocumentFragment();
        nodeType = documentFragmentNode.nodeType;

        assertEquals("nodeDocumentFragmentNodeTypeAssert1",11,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      DocumentFragment Node is null.

      Retrieve the DOM document and invoke the
      "createDocumentFragment()" method and check the string      
      returned by the "getNodeValue()" method.   It should be 
      equal to null.

      * @author NIST
      * @author Mary Brady
      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      */
      nodedocumentfragmentnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodedocumentfragmentnodevalue") != null) return;
        var doc;
        var docFragment;
        var attrList;
        var value;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docFragment = doc.createDocumentFragment();
        attrList = docFragment.attributes;

        assertNull("attributesNull",attrList);
        value = docFragment.nodeValue;

        assertNull("initiallyNull",value);

      },
      /**
      * 
      The "getAttributes()" method invoked on a Document
      Node returns null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
      */
      nodedocumentnodeattribute : function () {
        var success;
        if(checkInitialization(builder, "nodedocumentnodeattribute") != null) return;
        var doc;
        var attrList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        attrList = doc.attributes;

        assertNull("documentAttributesNull",attrList);

      },
      /**
      * 
      The string returned by the "getNodeName()" method for a 
      Document Node is "#document".

      Retrieve the DOM document and check the string returned
      by the "getNodeName()" method.   It should be equal to 
      "#document".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodedocumentnodename : function () {
        var success;
        if(checkInitialization(builder, "nodedocumentnodename") != null) return;
        var doc;
        var documentName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        documentName = doc.nodeName;

        assertEquals("documentNodeName","#document",documentName);

      },
      /**
      * 
      The "getNodeType()" method for a Document Node
      returns the constant value 9.

      Retrieve the document and invoke the "getNodeType()" 
      method.   The method should return 9. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodedocumentnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodedocumentnodetype") != null) return;
        var doc;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        nodeType = doc.nodeType;

        assertEquals("nodeDocumentNodeTypeAssert1",9,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      Document Node is null.

      Retrieve the DOM Document and check the string returned
      by the "getNodeValue()" method.   It should be equal to 
      null. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodedocumentnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodedocumentnodevalue") != null) return;
        var doc;
        var documentValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        documentValue = doc.nodeValue;

        assertNull("documentNodeValueNull",documentValue);

      },
      /**
      * 
      Retrieve the DOCTYPE declaration from the XML file and
      check the string returned by the "getNodeName()" 
      method.   It should be equal to "staff" or "svg". 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodedocumenttypenodename : function () {
        var success;
        if(checkInitialization(builder, "nodedocumenttypenodename") != null) return;
        var doc;
        var docType;
        var documentTypeName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        documentTypeName = docType.nodeName;


        if(

          (builder.contentType == "image/svg+xml")

        ) {
          assertEquals("doctypeNameSVG","svg",documentTypeName);

        }

        else {
          assertEquals("documentName","staff",documentTypeName);

        }

      },
      /**
      * 
      The "getNodeType()" method for a DocumentType Node
      returns the constant value 10.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodedocumenttypenodetype : function () {
        var success;
        if(checkInitialization(builder, "nodedocumenttypenodetype") != null) return;
        var doc;
        var documentTypeNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        documentTypeNode = doc.doctype;

        assertNotNull("doctypeNotNull",documentTypeNode);
        nodeType = documentTypeNode.nodeType;

        assertEquals("nodeType",10,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      DocumentType Node is null.

      * @author NIST
      * @author Mary Brady
      */
      nodedocumenttypenodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodedocumenttypenodevalue") != null) return;
        var doc;
        var docType;
        var attrList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        attrList = docType.attributes;

        assertNull("doctypeAttributesNull",attrList);

      },
      /**
      * 
      The "getAttributes()" method invoked on an Element
      Node returns a NamedNodeMap containing the attributes
      of this node.

      Retrieve the last child of the third employee and
      invoke the "getAttributes()" method.   It should return
      a NamedNodeMap containing the attributes of the Element
      node. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      */
      nodeelementnodeattributes : function () {
        var success;
        if(checkInitialization(builder, "nodeelementnodeattributes") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var addrAttr;
        var attrNode;
        var attrName;
        var attrList = new Array();

        expected = new Array();
        expected[0] = "domestic";
        expected[1] = "street";


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(2);
        addrAttr = testAddr.attributes;

        for(var indexN1005C = 0;indexN1005C < addrAttr.length; indexN1005C++) {
          attrNode = addrAttr.item(indexN1005C);
          attrName = attrNode.nodeName;

          attrList[attrList.length] = attrName;

        }
        assertEqualsCollection("nodeElementNodeValueAssert1",expected,attrList);

      },
      /**
      * 

      The string returned by the "getNodeName()" method for an 

      Element Node is its tagName. 



      Retrieve the first Element Node(Root Node) of the   

      DOM object and check the string returned by the            

      "getNodeName()" method.   It should be equal to its

      tagName. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
      */
      nodeelementnodename : function () {
        var success;
        if(checkInitialization(builder, "nodeelementnodename") != null) return;
        var doc;
        var elementNode;
        var elementName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementNode = doc.documentElement;

        elementName = elementNode.nodeName;


        if(

          (builder.contentType == "image/svg+xml")

        ) {
          assertEquals("svgNodeName","svg",elementName);

        }

        else {
          assertEquals("nodeElementNodeNameAssert1","staff",elementName);

        }

      },
      /**
      * 
      The "getNodeType()" method for an Element Node
      returns the constant value 1.

      Retrieve the root node and invoke the "getNodeType()"   
      method.   The method should return 1. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodeelementnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodeelementnodetype") != null) return;
        var doc;
        var rootNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        rootNode = doc.documentElement;

        nodeType = rootNode.nodeType;

        assertEquals("nodeElementNodeTypeAssert1",1,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for an 
      Element Node is null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodeelementnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodeelementnodevalue") != null) return;
        var doc;
        var elementNode;
        var elementValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementNode = doc.documentElement;

        elementValue = elementNode.nodeValue;

        assertNull("elementNodeValueNull",elementValue);

      },
      /**
      * 
      The "getAttributes()" method invoked on an Entity 
      Node returns null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      */
      nodeentitynodeattributes : function () {
        var success;
        if(checkInitialization(builder, "nodeentitynodeattributes") != null) return;
        var doc;
        var docType;
        var entities;
        var entityNode;
        var attrList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        entities = docType.entities;

        assertNotNull("entitiesNotNull",entities);
        entityNode = entities.getNamedItem("ent1");
        assertNotNull("ent1NotNull",entityNode);
        attrList = entityNode.attributes;

        assertNull("entityAttributesNull",attrList);

      },
      /**
      * 
      Check the nodeName of the entity returned by DocumentType.entities.getNamedItem("ent1").

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodeentitynodename : function () {
        var success;
        if(checkInitialization(builder, "nodeentitynodename") != null) return;
        var doc;
        var docType;
        var entities;
        var entityNode;
        var entityName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        entities = docType.entities;

        assertNotNull("entitiesNotNull",entities);
        entityNode = entities.getNamedItem("ent1");
        assertNotNull("entityNodeNotNull",entityNode);
        entityName = entityNode.nodeName;

        assertEquals("entityNodeName","ent1",entityName);

      },
      /**
      * 
      The "getNodeType()" method for an Entity Node
      returns the constant value 6.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodeentitynodetype : function () {
        var success;
        if(checkInitialization(builder, "nodeentitynodetype") != null) return;
        var doc;
        var docType;
        var entities;
        var entityNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        entities = docType.entities;

        assertNotNull("entitiesNotNull",entities);
        entityNode = entities.getNamedItem("ent1");
        assertNotNull("ent1NotNull",entityNode);
        nodeType = entityNode.nodeType;

        assertEquals("entityNodeType",6,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for an 
      Entity Node is null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodeentitynodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodeentitynodevalue") != null) return;
        var doc;
        var docType;
        var entities;
        var entityNode;
        var entityValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        entities = docType.entities;

        assertNotNull("entitiesNotNull",entities);
        entityNode = entities.getNamedItem("ent1");
        assertNotNull("ent1NotNull",entityNode);
        entityValue = entityNode.nodeValue;

        assertNull("entityNodeValue",entityValue);

      },
      /**
      * 
      The "getAttributes()" method invoked on an EntityReference 
      Node returns null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      */
      nodeentityreferencenodeattributes : function () {
        var success;
        if(checkInitialization(builder, "nodeentityreferencenodeattributes") != null) return;
        var doc;
        var elementList;
        var entRefAddr;
        var entRefNode;
        var attrList;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        entRefAddr = elementList.item(1);
        entRefNode = entRefAddr.firstChild;

        nodeType = entRefNode.nodeType;


        if(
          !(5 == nodeType)
        ) {
          entRefNode = doc.createEntityReference("ent2");
          assertNotNull("createdEntRefNotNull",entRefNode);

        }
        attrList = entRefNode.attributes;

        assertNull("attrList",attrList);

      },
      /**
      * 
      The string returned by the "getNodeName()" method for an 
      EntityReference Node is the name of the entity referenced.

      Retrieve the first Entity Reference node from the last
      child of the second employee and check the string 
      returned by the "getNodeName()" method.   It should be 
      equal to "ent2". 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodeentityreferencenodename : function () {
        var success;
        if(checkInitialization(builder, "nodeentityreferencenodename") != null) return;
        var doc;
        var elementList;
        var entRefAddr;
        var entRefNode;
        var entRefName;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        entRefAddr = elementList.item(1);
        entRefNode = entRefAddr.firstChild;

        nodeType = entRefNode.nodeType;


        if(
          !(5 == nodeType)
        ) {
          entRefNode = doc.createEntityReference("ent2");
          assertNotNull("createdEntRefNotNull",entRefNode);

        }
        entRefName = entRefNode.nodeName;

        assertEquals("nodeEntityReferenceNodeNameAssert1","ent2",entRefName);

      },
      /**
      * 
      The "getNodeType()" method for an EntityReference Node
      returns the constant value 5.

      Retrieve the EntityReference node from the last child
      of the second employee and invoke the "getNodeType()"   
      method.   The method should return 5. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodeentityreferencenodetype : function () {
        var success;
        if(checkInitialization(builder, "nodeentityreferencenodetype") != null) return;
        var doc;
        var elementList;
        var entRefAddr;
        var entRefNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        entRefAddr = elementList.item(1);
        entRefNode = entRefAddr.firstChild;

        nodeType = entRefNode.nodeType;


        if(
          (3 == nodeType)
        ) {
          entRefNode = doc.createEntityReference("ent2");
          assertNotNull("createdEntRefNotNull",entRefNode);
          nodeType = entRefNode.nodeType;


        }
        assertEquals("entityNodeType",5,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for an 
      EntityReference Node is null.

      Retrieve the first Entity Reference node from the last
      child of the second employee and check the string 
      returned by the "getNodeValue()" method.   It should be 
      equal to null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodeentityreferencenodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodeentityreferencenodevalue") != null) return;
        var doc;
        var elementList;
        var entRefAddr;
        var entRefNode;
        var entRefValue;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        entRefAddr = elementList.item(1);
        entRefNode = entRefAddr.firstChild;

        nodeType = entRefNode.nodeType;


        if(
          (3 == nodeType)
        ) {
          entRefNode = doc.createEntityReference("ent2");
          assertNotNull("createdEntRefNotNull",entRefNode);

        }
        entRefValue = entRefNode.nodeValue;

        assertNull("entRefNodeValue",entRefValue);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for an 
      Entity Node is always null and "setNodeValue" should have no effect.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-527DCFF2
      */
      nodeentitysetnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodeentitysetnodevalue") != null) return;
        var doc;
        var docType;
        var entities;
        var entityNode;
        var entityValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        entities = docType.entities;

        assertNotNull("entitiesNotNull",entities);
        entityNode = entities.getNamedItem("ent1");
        assertNotNull("ent1NotNull",entityNode);
        entityNode.nodeValue = "This should have no effect";

        entityValue = entityNode.nodeValue;

        assertNull("nodeValueNull",entityValue);

      },
      /**
      * 
      The "getFirstChild()" method returns the first child
      of this node. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-169727388
      */
      nodegetfirstchild : function () {
        var success;
        if(checkInitialization(builder, "nodegetfirstchild") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var fchildNode;
        var childName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        fchildNode = employeeNode.firstChild;

        childName = fchildNode.nodeName;


        if(
          ("#text" == childName)
        ) {
          fchildNode = fchildNode.nextSibling;

          childName = fchildNode.nodeName;


        }
        assertEquals("nodeName","employeeId",childName);

      },
      /**
      * 

      If there is not a first child then the "getFirstChild()"

      method returns null.



      Retrieve the Text node form the second child of the first

      employee and invoke the "getFirstChild()" method.   It

      should return null.


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-169727388
      */
      nodegetfirstchildnull : function () {
        var success;
        if(checkInitialization(builder, "nodegetfirstchildnull") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var secondChildNode;
        var textNode;
        var noChildNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(0);
        employeeList = employeeNode.childNodes;

        secondChildNode = employeeList.item(1);
        textNode = secondChildNode.firstChild;

        noChildNode = textNode.firstChild;

        assertNull("nodeGetFirstChildNullAssert1",noChildNode);

      },
      /**
      * 
      The "getLastChild()" method returns the last child
      of this node. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-61AD09FB
      */
      nodegetlastchild : function () {
        var success;
        if(checkInitialization(builder, "nodegetlastchild") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var lchildNode;
        var childName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        lchildNode = employeeNode.lastChild;

        childName = lchildNode.nodeName;


        if(
          ("#text" == childName)
        ) {
          lchildNode = lchildNode.previousSibling;

          childName = lchildNode.nodeName;


        }
        assertEquals("nodeName","address",childName);

      },
      /**
      * 

      If there is not a last child then the "getLastChild()"

      method returns null.



      Retrieve the Text node from the second child of the first

      employee and invoke the "getLastChild()" method.   It

      should return null.


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-61AD09FB
      */
      nodegetlastchildnull : function () {
        var success;
        if(checkInitialization(builder, "nodegetlastchildnull") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var secondChildNode;
        var textNode;
        var noChildNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(0);
        employeeList = employeeNode.childNodes;

        secondChildNode = employeeList.item(1);
        textNode = secondChildNode.firstChild;

        noChildNode = textNode.lastChild;

        assertNull("nodeGetLastChildNullAssert1",noChildNode);

      },
      /**
      * 
      The "getNextSibling()" method returns the node immediately
      following this node. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6AC54C2F
      */
      nodegetnextsibling : function () {
        var success;
        if(checkInitialization(builder, "nodegetnextsibling") != null) return;
        var doc;
        var elementList;
        var employeeIdNode;
        var nsNode;
        var nsName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employeeId");
        employeeIdNode = elementList.item(1);
        nsNode = employeeIdNode.nextSibling;

        nsName = nsNode.nodeName;


        if(
          ("#text" == nsName)
        ) {
          nsNode = nsNode.nextSibling;

          nsName = nsNode.nodeName;


        }
        assertEquals("nodeName","name",nsName);

      },
      /**
      * 

      If there is not a node immediately following this node the

      "getNextSibling()" method returns null.



      Retrieve the first child of the second employee and

      invoke the "getNextSibling()" method.   It should

      be set to null. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6AC54C2F
      */
      nodegetnextsiblingnull : function () {
        var success;
        if(checkInitialization(builder, "nodegetnextsiblingnull") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var lcNode;
        var nsNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        lcNode = employeeNode.lastChild;

        nsNode = lcNode.nextSibling;

        assertNull("nodeGetNextSiblingNullAssert1",nsNode);

      },
      /**
      * 
      The "getOwnerDocument()" method returns the Document
      object associated with this node.

      Retrieve the second employee and examine Document 
      returned by the "getOwnerDocument()" method.   Invoke
      the "getDocumentElement()" on the Document which will
      return an Element that is equal to "staff".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#node-ownerDoc
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
      */
      nodegetownerdocument : function () {
        var success;
        if(checkInitialization(builder, "nodegetownerdocument") != null) return;
        var doc;
        var elementList;
        var docNode;
        var ownerDocument;
        var docElement;
        var elementName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        docNode = elementList.item(1);
        ownerDocument = docNode.ownerDocument;

        docElement = ownerDocument.documentElement;

        elementName = docElement.nodeName;


        if(

          (builder.contentType == "image/svg+xml")

        ) {
          assertEquals("svgTagName","svg",elementName);

        }

        else {
          assertEquals("nodeGetOwnerDocumentAssert1","staff",elementName);

        }

      },
      /**
      * 
      The "getOwnerDocument()" method returns null if the target
      node itself is a document.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#node-ownerDoc
      */
      nodegetownerdocumentnull : function () {
        var success;
        if(checkInitialization(builder, "nodegetownerdocumentnull") != null) return;
        var doc;
        var ownerDocument;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        ownerDocument = doc.ownerDocument;

        assertNull("documentOwnerDocumentNull",ownerDocument);

      },
      /**
      * 
      The "getPreviousSibling()" method returns the node
      immediately preceding this node. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-640FB3C8
      */
      nodegetprevioussibling : function () {
        var success;
        if(checkInitialization(builder, "nodegetprevioussibling") != null) return;
        var doc;
        var elementList;
        var nameNode;
        var psNode;
        var psName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        nameNode = elementList.item(1);
        psNode = nameNode.previousSibling;

        psName = psNode.nodeName;


        if(
          ("#text" == psName)
        ) {
          psNode = psNode.previousSibling;

          psName = psNode.nodeName;


        }
        assertEquals("nodeName","employeeId",psName);

      },
      /**
      * 

      If there is not a node immediately preceding this node the

      "getPreviousSibling()" method returns null.



      Retrieve the first child of the second employee and

      invoke the "getPreviousSibling()" method.   It should

      be set to null. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-640FB3C8
      */
      nodegetprevioussiblingnull : function () {
        var success;
        if(checkInitialization(builder, "nodegetprevioussiblingnull") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var fcNode;
        var psNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(2);
        fcNode = employeeNode.firstChild;

        psNode = fcNode.previousSibling;

        assertNull("nodeGetPreviousSiblingNullAssert1",psNode);

      },
      /**
      * 
      The "hasChildNodes()" method returns true if the node
      has children.

      Retrieve the root node("staff") and invoke the 
      "hasChildNodes()" method.   It should return the boolean
      value "true".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-810594187
      */
      nodehaschildnodes : function () {
        var success;
        if(checkInitialization(builder, "nodehaschildnodes") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var state;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        state = employeeNode.hasChildNodes();
        assertTrue("nodeHasChildAssert1",state);

      },
      /**
      * 
      The "hasChildNodes()" method returns false if the node
      does not have any children.

      Retrieve the Text node inside the first child of the 
      second employee and invoke the "hasChildNodes()" method.
      It should return the boolean value "false".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-810594187
      */
      nodehaschildnodesfalse : function () {
        var success;
        if(checkInitialization(builder, "nodehaschildnodesfalse") != null) return;
        var doc;
        var elementList;
        var child;
        var employeeIdList;
        var employeeNode;
        var textNode;
        var state;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        child = elementList.item(1);
        employeeIdList = child.childNodes;

        employeeNode = employeeIdList.item(1);
        textNode = employeeNode.firstChild;

        state = textNode.hasChildNodes();
        assertFalse("nodeHasChildFalseAssert1",state);

      },
      /**
      * 
      The "insertBefore(newChild,refChild)" method inserts the
      node "newChild" before the node "refChild". 

      Insert a newly created Element node before the eigth
      child of the second employee and check the "newChild"
      and "refChild" after insertion for correct placement.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      */
      nodeinsertbefore : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbefore") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var refChild;
        var newChild;
        var child;
        var childName;
        var length;
        var insertedNode;
        var actual = new Array();

        expectedWithWhitespace = new Array();
        expectedWithWhitespace[0] = "#text";
        expectedWithWhitespace[1] = "employeeId";
        expectedWithWhitespace[2] = "#text";
        expectedWithWhitespace[3] = "name";
        expectedWithWhitespace[4] = "#text";
        expectedWithWhitespace[5] = "position";
        expectedWithWhitespace[6] = "#text";
        expectedWithWhitespace[7] = "newChild";
        expectedWithWhitespace[8] = "salary";
        expectedWithWhitespace[9] = "#text";
        expectedWithWhitespace[10] = "gender";
        expectedWithWhitespace[11] = "#text";
        expectedWithWhitespace[12] = "address";
        expectedWithWhitespace[13] = "#text";

        expectedWithoutWhitespace = new Array();
        expectedWithoutWhitespace[0] = "employeeId";
        expectedWithoutWhitespace[1] = "name";
        expectedWithoutWhitespace[2] = "position";
        expectedWithoutWhitespace[3] = "newChild";
        expectedWithoutWhitespace[4] = "salary";
        expectedWithoutWhitespace[5] = "gender";
        expectedWithoutWhitespace[6] = "address";

        var expected = new Array();


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        length = childList.length;


        if(
          (6 == length)
        ) {
          refChild = childList.item(3);
          expected =  expectedWithoutWhitespace;

        }

        else {
          refChild = childList.item(7);
          expected =  expectedWithWhitespace;

        }
        newChild = doc.createElement("newChild");
        insertedNode = employeeNode.insertBefore(newChild,refChild);
        for(var indexN100DC = 0;indexN100DC < childList.length; indexN100DC++) {
          child = childList.item(indexN100DC);
          childName = child.nodeName;

          actual[actual.length] = childName;

        }
        assertEqualsList("nodeNames",expected,actual);

      },
      /**
      * 
      If the "newChild" is a DocumentFragment object then all
      its children are inserted in the same order before the
      the "refChild". 

      Create a DocumentFragment object and populate it with
      two Element nodes.   Retrieve the second employee and
      insert the newly created DocumentFragment before its
      fourth child.   The second employee should now have two
      extra children("newChild1" and "newChild2") at 
      positions fourth and fifth respectively.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      */
      nodeinsertbeforedocfragment : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforedocfragment") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var refChild;
        var newdocFragment;
        var newChild1;
        var newChild2;
        var child;
        var childName;
        var appendedChild;
        var insertedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        refChild = childList.item(3);
        newdocFragment = doc.createDocumentFragment();
        newChild1 = doc.createElement("newChild1");
        newChild2 = doc.createElement("newChild2");
        appendedChild = newdocFragment.appendChild(newChild1);
        appendedChild = newdocFragment.appendChild(newChild2);
        insertedNode = employeeNode.insertBefore(newdocFragment,refChild);
        child = childList.item(3);
        childName = child.nodeName;

        assertEquals("childName3","newChild1",childName);
        child = childList.item(4);
        childName = child.nodeName;

        assertEquals("childName4","newChild2",childName);

      },
      /**
      * 
      The "insertBefore(newChild,refChild)" method raises a 
      HIERARCHY_REQUEST_ERR DOMException if this node is of
      a type that does not allow children of the type "newChild"
      to be inserted.

      Retrieve the root node and attempt to insert a newly
      created Attr node.   An Element node cannot have children
      of the "Attr" type, therefore the desired exception
      should be raised.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodeinsertbeforeinvalidnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforeinvalidnodetype") != null) return;
        var doc;
        var rootNode;
        var newChild;
        var elementList;
        var refChild;
        var insertedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        rootNode = doc.documentElement;

        newChild = doc.createAttribute("newAttribute");
        elementList = doc.getElementsByTagName("employee");
        refChild = elementList.item(1);

        {
          success = false;
          try {
            insertedNode = rootNode.insertBefore(newChild,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      },
      /**
      * 
      The "insertBefore(newChild,refChild)" method raises a 
      WRONG_DOCUMENT_ERR DOMException if the "newChild" was
      created from a different document than the one that 
      created this node.

      Retrieve the second employee and attempt to insert a new 
      child that was created from a different document than the
      one that created the second employee.   An attempt to
      insert such a child should raise the desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='WRONG_DOCUMENT_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='WRONG_DOCUMENT_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      */
      nodeinsertbeforenewchilddiffdocument : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforenewchilddiffdocument") != null) return;
        var doc1;
        var doc2;
        var refChild;
        var newChild;
        var elementList;
        var elementNode;
        var insertedNode;

        var doc1Ref = null;
        if (typeof(this.doc1) != 'undefined') {
          doc1Ref = this.doc1;
        }
        doc1 = load(doc1Ref, "doc1", "staff");

        var doc2Ref = null;
        if (typeof(this.doc2) != 'undefined') {
          doc2Ref = this.doc2;
        }
        doc2 = load(doc2Ref, "doc2", "staff");
        newChild = doc1.createElement("newChild");
        elementList = doc2.getElementsByTagName("employee");
        elementNode = elementList.item(1);
        refChild = elementNode.firstChild;


        {
          success = false;
          try {
            insertedNode = elementNode.insertBefore(newChild,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 4);
          }
          assertTrue("throw_WRONG_DOCUMENT_ERR",success);
        }

      },
      /**
      * 
      If the "newChild" is already in the tree, the
      "insertBefore(newChild,refChild)" method must first
      remove it before the insertion takes place.

      Insert a node Element ("employeeId") that is already
      present in the tree.   The existing node should be 
      removed first and the new one inserted.   The node is
      inserted at a different position in the tree to assure
      that it was indeed inserted.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      */
      nodeinsertbeforenewchildexists : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforenewchildexists") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var refChild;
        var newChild;
        var child;
        var length;
        var childName;
        var insertedNode;
        expectedWhitespace = new Array();
        expectedWhitespace[0] = "#text";
        expectedWhitespace[1] = "#text";
        expectedWhitespace[2] = "name";
        expectedWhitespace[3] = "#text";
        expectedWhitespace[4] = "position";
        expectedWhitespace[5] = "#text";
        expectedWhitespace[6] = "salary";
        expectedWhitespace[7] = "#text";
        expectedWhitespace[8] = "gender";
        expectedWhitespace[9] = "#text";
        expectedWhitespace[10] = "employeeId";
        expectedWhitespace[11] = "address";
        expectedWhitespace[12] = "#text";

        expectedNoWhitespace = new Array();
        expectedNoWhitespace[0] = "name";
        expectedNoWhitespace[1] = "position";
        expectedNoWhitespace[2] = "salary";
        expectedNoWhitespace[3] = "gender";
        expectedNoWhitespace[4] = "employeeId";
        expectedNoWhitespace[5] = "address";

        var expected = new Array();

        var result = new Array();


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        length = childList.length;


        if(
          (6 == length)
        ) {
          expected =  expectedNoWhitespace;
          refChild = childList.item(5);
          newChild = childList.item(0);

        }

        else {
          expected =  expectedWhitespace;
          refChild = childList.item(11);
          newChild = childList.item(1);

        }
        insertedNode = employeeNode.insertBefore(newChild,refChild);
        for(var indexN100DD = 0;indexN100DD < childList.length; indexN100DD++) {
          child = childList.item(indexN100DD);
          childName = child.nodeName;

          result[result.length] = childName;

        }
        assertEqualsList("childNames",expected,result);

      },
      /**
      * 
      The "insertBefore(newChild,refChild)" method raises a 
      HIERARCHY_REQUEST_ERR DOMException if the node to be
      inserted is one of this nodes ancestors.

      Retrieve the second employee and attempt to insert a
      node that is one of its ancestors(root node).   An 
      attempt to insert such a node should raise the 
      desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodeinsertbeforenodeancestor : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforenodeancestor") != null) return;
        var doc;
        var newChild;
        var elementList;
        var employeeNode;
        var childList;
        var refChild;
        var insertedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newChild = doc.documentElement;

        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        refChild = childList.item(0);

        {
          success = false;
          try {
            insertedNode = employeeNode.insertBefore(newChild,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      },
      /**
      * 
      The "insertBefore(newChild,refchild)" method returns 
      the node being inserted.

      Insert an Element node before the fourth
      child of the second employee and check the node
      returned from the "insertBefore(newChild,refChild)" 
      method.   The node returned should be "newChild".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      */
      nodeinsertbeforenodename : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforenodename") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var refChild;
        var newChild;
        var insertedNode;
        var childName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        refChild = childList.item(3);
        newChild = doc.createElement("newChild");
        insertedNode = employeeNode.insertBefore(newChild,refChild);
        childName = insertedNode.nodeName;

        assertEquals("nodeInsertBeforeNodeNameAssert1","newChild",childName);

      },
      /**
      * 
      The "insertBefore(newChild,refChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Obtain the children of the THIRD "gender" element.   The elements
      content is an entity reference.   Get the FIRST item 
      from the entity reference and execute the "insertBefore(newChild,refChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      */
      nodeinsertbeforenomodificationallowederr : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforenomodificationallowederr") != null) return;
        var doc;
        var genderList;
        var genderNode;
        var entRef;
        var entElement;
        var createdNode;
        var insertedNode;
        var refChild = null;

        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        genderList = doc.getElementsByTagName("gender");
        genderNode = genderList.item(2);
        entRef = genderNode.firstChild;

        assertNotNull("entRefNotNull",entRef);
        nodeType = entRef.nodeType;


        if(
          (1 == nodeType)
        ) {
          entRef = doc.createEntityReference("ent4");
          assertNotNull("createdEntRefNotNull",entRef);

        }
        entElement = entRef.firstChild;

        assertNotNull("entElementNotNull",entElement);
        createdNode = doc.createElement("text3");

        {
          success = false;
          try {
            insertedNode = entElement.insertBefore(createdNode,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NOT_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "insertBefore(newChild,refChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Create an ent4 entity reference and and execute the "insertBefore(newChild,refChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/nodeinsertbeforenomodificationallowederr.xml
      */
      nodeinsertbeforenomodificationallowederrEE : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforenomodificationallowederrEE") != null) return;
        var doc;
        var entRef;
        var createdNode;
        var insertedNode;
        var refChild = null;


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        entRef = doc.createEntityReference("ent4");
        assertNotNull("createdEntRefNotNull",entRef);
        createdNode = doc.createElement("text3");

        {
          success = false;
          try {
            insertedNode = entRef.insertBefore(createdNode,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "insertBefore(newChild,refChild)" method raises a 
      NOT_FOUND_ERR DOMException if the reference child is
      not a child of this node.

      Retrieve the second employee and attempt to insert a
      new node before a reference node that is not a child
      of this node.   An attempt to insert before a non child
      node should raise the desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-952280727')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodeinsertbeforerefchildnonexistent : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforerefchildnonexistent") != null) return;
        var doc;
        var refChild;
        var newChild;
        var elementList;
        var elementNode;
        var insertedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newChild = doc.createElement("newChild");
        refChild = doc.createElement("refChild");
        elementList = doc.getElementsByTagName("employee");
        elementNode = elementList.item(1);

        {
          success = false;
          try {
            insertedNode = elementNode.insertBefore(newChild,refChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 8);
          }
          assertTrue("throw_NOT_FOUND_ERR",success);
        }

      },
      /**
      * 
      If the "refChild" is null then the
      "insertBefore(newChild,refChild)" method inserts the
      node "newChild" at the end of the list of children. 

      Retrieve the second employee and invoke the
      "insertBefore(newChild,refChild)" method with
      refChild=null.   Since "refChild" is null the "newChild"
      should be added to the end of the list.   The last item
      in the list is checked after insertion.   The last Element
      node of the list should be "newChild".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-952280727
      */
      nodeinsertbeforerefchildnull : function () {
        var success;
        if(checkInitialization(builder, "nodeinsertbeforerefchildnull") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var refChild = null;

        var newChild;
        var child;
        var childName;
        var insertedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        newChild = doc.createElement("newChild");
        insertedNode = employeeNode.insertBefore(newChild,refChild);
        child = employeeNode.lastChild;

        childName = child.nodeName;

        assertEquals("nodeInsertBeforeRefChildNullAssert1","newChild",childName);

      },
      /**
      * 
      Create a list of all the children elements of the third
      employee and access its first child by using an index
      of 0.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
      */
      nodelistindexequalzero : function () {
        var success;
        if(checkInitialization(builder, "nodelistindexequalzero") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var child;
        var childName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(2);
        employeeList = employeeNode.childNodes;

        child = employeeList.item(0);
        childName = child.nodeName;


        if(
          !("#text" == childName)
        ) {
          assertEquals("childName","employeeId",childName);

        }

      },
      /**
      * 
      The "getLength()" method returns the number of nodes
      in the list should be 6 (no whitespace) or 13.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-203510337
      */
      nodelistindexgetlength : function () {
        var success;
        if(checkInitialization(builder, "nodelistindexgetlength") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var length;
        var expectedCount = 0;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(2);
        employeeList = employeeNode.childNodes;

        length = employeeList.length;

        assertTrue("lengthIs6or13",

        ((6 == length) || (13 == length))
      );

    },
    /**
    * 
    The "getLength()" method returns the number of nodes
    in the list.(Test for EMPTY list)

    Create a list of all the children of the Text node 
    inside the first child of the third employee and
    invoke the "getLength()" method.   It should contain
    the value 0.

    * @author NIST
    * @author Mary Brady
    * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-203510337
    */
    nodelistindexgetlengthofemptylist : function () {
      var success;
      if(checkInitialization(builder, "nodelistindexgetlengthofemptylist") != null) return;
      var doc;
      var elementList;
      var employeeNode;
      var employeeList;
      var childNode;
      var textNode;
      var textList;

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "staff");
      elementList = doc.getElementsByTagName("employee");
      employeeNode = elementList.item(2);
      employeeList = employeeNode.childNodes;

      childNode = employeeList.item(1);
      textNode = childNode.firstChild;

      textList = textNode.childNodes;

      assertSize("nodelistIndexGetLengthOfEmptyListAssert",0,textList);

    },
    /**
    * 
    Create a list of all the children elements of the third
    employee and access its fourth child by using an index
    of 3.  This should result in "name" being
    selected.  Further we evaluate its content(by using
      the "getNodeName()" method) to ensure the proper
      element was accessed.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
      */
      nodelistindexnotzero : function () {
        var success;
        if(checkInitialization(builder, "nodelistindexnotzero") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var child;
        var length;
        var childName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(2);
        employeeList = employeeNode.childNodes;

        length = employeeList.length;


        if(
          (6 == length)
        ) {
          child = employeeList.item(1);

        }

        else {
          child = employeeList.item(3);

        }
        childName = child.nodeName;

        assertEquals("nodeName","name",childName);

      },
      /**
      * 
      Get the first child of the third employee using NodeList.item(0)
      which will either be a Text node (whitespace) or employeeId element.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
      */
      nodelistreturnfirstitem : function () {
        var success;
        if(checkInitialization(builder, "nodelistreturnfirstitem") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var child;
        var childName;
        var length;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(2);
        employeeList = employeeNode.childNodes;

        child = employeeList.item(0);
        childName = child.nodeName;

        length = employeeList.length;


        if(
          (6 == length)
        ) {
          assertEquals("firstChildNoWhitespace","employeeId".toLowerCase(),childName.toLowerCase());

        }

        else {
          assertEquals("firstChildWithWhitespace","#text".toLowerCase(),childName.toLowerCase());

        }

      },
      /**
      * 
      Get this last child of the third employee using NodeList.item(NodeList.length - 1)
      and check that it is either a Text element (with whitespace) or an address element.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
      */
      nodelistreturnlastitem : function () {
        var success;
        if(checkInitialization(builder, "nodelistreturnlastitem") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var child;
        var childName;
        var length;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(2);
        employeeList = employeeNode.childNodes;

        length = employeeList.length;


        if(
          (6 == length)
        ) {
          child = employeeList.item(5);
          childName = child.nodeName;

          assertEquals("nodeName1","address",childName);

        }

        else {
          child = employeeList.item(12);
          childName = child.nodeName;

          assertEquals("nodeName2","#text",childName);

        }

      },
      /**
      * 
      The range of valid child node indices is 0 thru length -1

      Create a list of all the children elements of the third
      employee and traverse the list from index=0 thru
      length -1.     

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-203510337
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
      */
      nodelisttraverselist : function () {
        var success;
        if(checkInitialization(builder, "nodelisttraverselist") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var employeeList;
        var child;
        var childName;
        var result = new Array();

        var length;
        expectedWhitespace = new Array();
        expectedWhitespace[0] = "#text";
        expectedWhitespace[1] = "employeeId";
        expectedWhitespace[2] = "#text";
        expectedWhitespace[3] = "name";
        expectedWhitespace[4] = "#text";
        expectedWhitespace[5] = "position";
        expectedWhitespace[6] = "#text";
        expectedWhitespace[7] = "salary";
        expectedWhitespace[8] = "#text";
        expectedWhitespace[9] = "gender";
        expectedWhitespace[10] = "#text";
        expectedWhitespace[11] = "address";
        expectedWhitespace[12] = "#text";

        expectedNoWhitespace = new Array();
        expectedNoWhitespace[0] = "employeeId";
        expectedNoWhitespace[1] = "name";
        expectedNoWhitespace[2] = "position";
        expectedNoWhitespace[3] = "salary";
        expectedNoWhitespace[4] = "gender";
        expectedNoWhitespace[5] = "address";


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(2);
        employeeList = employeeNode.childNodes;

        length = employeeList.length;

        for(var indexN100A4 = 0;indexN100A4 < employeeList.length; indexN100A4++) {
          child = employeeList.item(indexN100A4);
          childName = child.nodeName;

          result[result.length] = childName;

        }

        if(
          (6 == length)
        ) {
          assertEqualsList("nowhitespace",expectedNoWhitespace,result);

        }

        else {
          assertEqualsList("whitespace",expectedWhitespace,result);

        }

      },
      /**
      * 
      The "getAttributes()" method invoked on a Notation 
      Node returns null.

      Retrieve the Notation declaration inside the DocumentType
      node and invoke the "getAttributes()" method on the 
      Notation Node.   It should return null. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      */
      nodenotationnodeattributes : function () {
        var success;
        if(checkInitialization(builder, "nodenotationnodeattributes") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var attrList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation1");
        assertNotNull("notationNotNull",notationNode);
        attrList = notationNode.attributes;

        assertNull("nodeNotationNodeAttributesAssert1",attrList);

      },
      /**
      * 
      The string returned by the "getNodeName()" method for a 
      Notation Node is the name of the notation.

      Retrieve the Notation declaration inside the   
      DocumentType node and check the string returned 
      by the "getNodeName()" method.   It should be equal to 
      "notation1". 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodenotationnodename : function () {
        var success;
        if(checkInitialization(builder, "nodenotationnodename") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var notationName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation1");
        assertNotNull("notationNotNull",notationNode);
        notationName = notationNode.nodeName;

        assertEquals("nodeName","notation1",notationName);

      },
      /**
      * 
      The "getNodeType()" method for an Notation Node
      returns the constant value 12.

      Retrieve the Notation declaration in the DocumentType 
      node and invoke the "getNodeType()" method.   The method
      should return 12. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodenotationnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodenotationnodetype") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation1");
        assertNotNull("notationNotNull",notationNode);
        nodeType = notationNode.nodeType;

        assertEquals("nodeNotationNodeTypeAssert1",12,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      Notation Node is null.

      Retrieve the Notation declaration inside the 
      DocumentType node and check the string returned 
      by the "getNodeValue()" method.   It should be equal to 
      null. 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodenotationnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodenotationnodevalue") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var notationValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation1");
        assertNotNull("notationNotNull",notationNode);
        notationValue = notationNode.nodeValue;

        assertNull("nodeValue",notationValue);

      },
      /**
      * 
      The "getParentNode()" method returns the parent
      of this node. 

      Retrieve the second employee and invoke the 
      "getParentNode()" method on this node.   It should
      be set to "staff".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1060184317
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
      */
      nodeparentnode : function () {
        var success;
        if(checkInitialization(builder, "nodeparentnode") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var parentNode;
        var parentName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        parentNode = employeeNode.parentNode;

        parentName = parentNode.nodeName;


        if(

          (builder.contentType == "image/svg+xml")

        ) {
          assertEquals("svgTagName","svg",parentName);

        }

        else {
          assertEquals("nodeParentNodeAssert1","staff",parentName);

        }

      },
      /**
      * 
      The "getParentNode()" method invoked on a node that has
      just been created and not yet added to the tree is null. 

      Create a new "employee" Element node using the             
      "createElement(name)" method from the Document interface.
      Since this new node has not yet been added to the tree,
      the "getParentNode()" method will return null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1060184317
      */
      nodeparentnodenull : function () {
        var success;
        if(checkInitialization(builder, "nodeparentnodenull") != null) return;
        var doc;
        var createdNode;
        var parentNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        createdNode = doc.createElement("employee");
        parentNode = createdNode.parentNode;

        assertNull("parentNode",parentNode);

      },
      /**
      * 

      The "getAttributes()" method invoked on a Processing 

      Instruction Node returns null.



      Retrieve the Processing Instruction node and invoke 

      the "getAttributes()" method.   It should return null. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      */
      nodeprocessinginstructionnodeattributes : function () {
        var success;
        if(checkInitialization(builder, "nodeprocessinginstructionnodeattributes") != null) return;
        var doc;
        var testList;
        var piNode;
        var attrList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        testList = doc.childNodes;

        piNode = testList.item(0);
        attrList = piNode.attributes;

        assertNull("nodeProcessingInstructionNodeAttrAssert1",attrList);

      },
      /**
      * 

      The string returned by the "getNodeName()" method for a 

      Processing Instruction Node is the target.



      Retrieve the Processing Instruction Node in the XML file 

      and check the string returned by the "getNodeName()" 

      method.   It should be equal to "XML-STYLE". 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodeprocessinginstructionnodename : function () {
        var success;
        if(checkInitialization(builder, "nodeprocessinginstructionnodename") != null) return;
        var doc;
        var testList;
        var piNode;
        var piName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        testList = doc.childNodes;

        piNode = testList.item(0);
        piName = piNode.nodeName;

        assertEquals("nodeProcessingInstructionNodeNameAssert1","TEST-STYLE",piName);

      },
      /**
      * 

      The "getNodeType()" method for a Processing Instruction 

      node returns the constant value 7.



      Retrieve a NodeList of child elements from the document.

      Retrieve the first child and invoke the "getNodeType()"   

      method.   The method should return 7. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodeprocessinginstructionnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodeprocessinginstructionnodetype") != null) return;
        var doc;
        var testList;
        var piNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        testList = doc.childNodes;

        piNode = testList.item(0);
        nodeType = piNode.nodeType;

        assertEquals("nodeProcessingInstructionNodeTypeAssert1",7,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      Processing Instruction Node is the content of the
      Processing Instruction(exclude the target).

      Retrieve the Processing Instruction node in the XML file 
      and check the string returned by the "getNodeValue()" 
      method.   It should be equal to "PIDATA".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodeprocessinginstructionnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodeprocessinginstructionnodevalue") != null) return;
        var doc;
        var testList;
        var piNode;
        var piValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        testList = doc.childNodes;

        piNode = testList.item(0);
        piValue = piNode.nodeValue;

        assertEquals("value","PIDATA",piValue);

      },
      /**
      * 
      Setting the nodeValue should change the value returned by
      nodeValue and ProcessingInstruction.getData.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1004215813
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-837822393
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=181
      */
      nodeprocessinginstructionsetnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodeprocessinginstructionsetnodevalue") != null) return;
        var doc;
        var testList;
        var piNode;
        var piValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        testList = doc.childNodes;

        piNode = testList.item(0);
        piNode.nodeValue = "Something different";

        piValue = piNode.nodeValue;

        assertEquals("nodeValue","Something different",piValue);
        piValue = piNode.data;

        assertEquals("data","Something different",piValue);

      },
      /**
      * 
      The "removeChild(oldChild)" method removes the child node
      indicated by "oldChild" from the list of children and
      returns it. 

      Remove the first employee by invoking the
      "removeChild(oldChild)" method an checking the
      node returned by the "getParentNode()" method.   It
      should be set to null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      */
      noderemovechild : function () {
        var success;
        if(checkInitialization(builder, "noderemovechild") != null) return;
        var doc;
        var rootNode;
        var childList;
        var childToRemove;
        var removedChild;
        var parentNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        rootNode = doc.documentElement;

        childList = rootNode.childNodes;

        childToRemove = childList.item(1);
        removedChild = rootNode.removeChild(childToRemove);
        parentNode = removedChild.parentNode;

        assertNull("nodeRemoveChildAssert1",parentNode);

      },
      /**
      * 
      Remove the first child of the second employee 
      and check the NodeName returned by the 
      "removeChild(oldChild)" method.   The returned node
      should have a NodeName equal to "#text" or employeeId depending on whitespace.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      */
      noderemovechildgetnodename : function () {
        var success;
        if(checkInitialization(builder, "noderemovechildgetnodename") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var oldChild;
        var removedChild;
        var childName;
        var length;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        length = childList.length;

        oldChild = childList.item(0);
        removedChild = employeeNode.removeChild(oldChild);
        childName = removedChild.nodeName;


        if(
          (6 == length)
        ) {
          assertEquals("nowhitespace","employeeId",childName);

        }

        else {
          assertEquals("whitespace","#text",childName);

        }

      },
      /**
      * 
      Retrieve the second employee and remove its first child.
      After the removal, the second employee should have five or twelve 
      children and the first child should now be the child
      that used to be at the second position in the list.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      */
      noderemovechildnode : function () {
        var success;
        if(checkInitialization(builder, "noderemovechildnode") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var oldChild;
        var child;
        var childName;
        var length;
        var removedChild;
        var removedName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        oldChild = childList.item(0);
        removedChild = employeeNode.removeChild(oldChild);
        removedName = removedChild.nodeName;

        child = childList.item(0);
        childName = child.nodeName;

        length = childList.length;


        if(
          (5 == length)
        ) {
          assertEquals("removedNameNoWhitespace","employeeId",removedName);
          assertEquals("childNameNoWhitespace","name",childName);

        }

        else {
          assertEquals("removedName","#text",removedName);
          assertEquals("childName","employeeId",childName);
          assertEquals("length",12,length);

        }

      },
      /**
      * 
      The "removeChild(oldChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Obtain the children of the THIRD "gender" element.   The elements
      content is an entity reference.   Get the FIRST item 
      from the entity reference and execute the "removeChild(oldChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1734834066')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      */
      noderemovechildnomodificationallowederr : function () {
        var success;
        if(checkInitialization(builder, "noderemovechildnomodificationallowederr") != null) return;
        var doc;
        var genderList;
        var genderNode;
        var entRef;
        var entElement;
        var removedNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        genderList = doc.getElementsByTagName("gender");
        genderNode = genderList.item(2);
        entRef = genderNode.firstChild;

        assertNotNull("entRefNotNull",entRef);
        nodeType = entRef.nodeType;


        if(
          (1 == nodeType)
        ) {
          entRef = doc.createEntityReference("ent4");
          assertNotNull("createdEntRefNotNull",entRef);

        }
        entElement = entRef.firstChild;

        assertNotNull("entElementNotNull",entElement);

        {
          success = false;
          try {
            removedNode = entRef.removeChild(entElement);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "removeChild(oldChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Create an entity reference and execute the "removeChild(oldChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1734834066')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/noderemovechildnomodificationallowederr.xml
      */
      noderemovechildnomodificationallowederrEE : function () {
        var success;
        if(checkInitialization(builder, "noderemovechildnomodificationallowederrEE") != null) return;
        var doc;
        var entRef;
        var entText;
        var removedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        entRef = doc.createEntityReference("ent4");
        assertNotNull("createdEntRefNotNull",entRef);
        entText = entRef.firstChild;

        assertNotNull("entTextNotNull",entText);

        {
          success = false;
          try {
            removedNode = entRef.removeChild(entText);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "removeChild(oldChild)" method raises a 
      NOT_FOUND_ERR DOMException if the old child is
      not a child of this node.

      Retrieve the second employee and attempt to remove a
      node that is not one of its children.   An attempt to
      remove such a node should raise the desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-1734834066')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1734834066
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      noderemovechildoldchildnonexistent : function () {
        var success;
        if(checkInitialization(builder, "noderemovechildoldchildnonexistent") != null) return;
        var doc;
        var oldChild;
        var elementList;
        var elementNode;
        var removedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        oldChild = doc.createElement("oldChild");
        elementList = doc.getElementsByTagName("employee");
        elementNode = elementList.item(1);

        {
          success = false;
          try {
            removedChild = elementNode.removeChild(oldChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 8);
          }
          assertTrue("throw_NOT_FOUND_ERR",success);
        }

      },
      /**
      * 
      The "replaceChild(newChild,oldChild)" method replaces 
      the node "oldChild" with the node "newChild". 

      Replace the first element of the second employee with
      a newly created Element node.   Check the first position
      after the replacement operation is completed.   The new
      Element should be "newChild".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      */
      nodereplacechild : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechild") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var oldChild;
        var newChild;
        var child;
        var childName;
        var replacedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        oldChild = childList.item(0);
        newChild = doc.createElement("newChild");
        replacedNode = employeeNode.replaceChild(newChild,oldChild);
        child = childList.item(0);
        childName = child.nodeName;

        assertEquals("nodeReplaceChildAssert1","newChild",childName);

      },
      /**
      * 
      The "replaceChild(newChild,oldChild)" method raises a 
      HIERARCHY_REQUEST_ERR DOMException if this node is of
      a type that does not allow children of the type "newChild"
      to be inserted.

      Retrieve the root node and attempt to replace 
      one of its children with a newly created Attr node.
      An Element node cannot have children of the "Attr"
      type, therefore the desired exception should be raised.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodereplacechildinvalidnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildinvalidnodetype") != null) return;
        var doc;
        var rootNode;
        var newChild;
        var elementList;
        var oldChild;
        var replacedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        rootNode = doc.documentElement;

        newChild = doc.createAttribute("newAttribute");
        elementList = doc.getElementsByTagName("employee");
        oldChild = elementList.item(1);

        {
          success = false;
          try {
            replacedChild = rootNode.replaceChild(newChild,oldChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      },
      /**
      * 
      The "replaceChild(newChild,oldChild)" method raises a 
      WRONG_DOCUMENT_ERR DOMException if the "newChild" was
      created from a different document than the one that 
      created this node.

      Retrieve the second employee and attempt to replace one   
      of its children with a node created from a different 
      document.   An attempt to make such a replacement 
      should raise the desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      */
      nodereplacechildnewchilddiffdocument : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildnewchilddiffdocument") != null) return;
        var doc1;
        var doc2;
        var oldChild;
        var newChild;
        var elementList;
        var elementNode;
        var replacedChild;

        var doc1Ref = null;
        if (typeof(this.doc1) != 'undefined') {
          doc1Ref = this.doc1;
        }
        doc1 = load(doc1Ref, "doc1", "staff");

        var doc2Ref = null;
        if (typeof(this.doc2) != 'undefined') {
          doc2Ref = this.doc2;
        }
        doc2 = load(doc2Ref, "doc2", "staff");
        newChild = doc1.createElement("newChild");
        elementList = doc2.getElementsByTagName("employee");
        elementNode = elementList.item(1);
        oldChild = elementNode.firstChild;


        {
          success = false;
          try {
            replacedChild = elementNode.replaceChild(newChild,oldChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 4);
          }
          assertTrue("throw_WRONG_DOCUMENT_ERR",success);
        }

      },
      /**
      * 
      Retrieve the second employee and replace its TWELFTH 
      child(address) with its SECOND child(employeeId).   After the
      replacement the second child should now be the one that used   
      to be at the third position and the TWELFTH child should be the
      one that used to be at the SECOND position.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      */
      nodereplacechildnewchildexists : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildnewchildexists") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var oldChild = null;

        var newChild = null;

        var childName;
        var childNode;
        var length;
        var actual = new Array();

        var expected = new Array();

        expectedWithoutWhitespace = new Array();
        expectedWithoutWhitespace[0] = "name";
        expectedWithoutWhitespace[1] = "position";
        expectedWithoutWhitespace[2] = "salary";
        expectedWithoutWhitespace[3] = "gender";
        expectedWithoutWhitespace[4] = "employeeId";

        expectedWithWhitespace = new Array();
        expectedWithWhitespace[0] = "#text";
        expectedWithWhitespace[1] = "#text";
        expectedWithWhitespace[2] = "name";
        expectedWithWhitespace[3] = "#text";
        expectedWithWhitespace[4] = "position";
        expectedWithWhitespace[5] = "#text";
        expectedWithWhitespace[6] = "salary";
        expectedWithWhitespace[7] = "#text";
        expectedWithWhitespace[8] = "gender";
        expectedWithWhitespace[9] = "#text";
        expectedWithWhitespace[10] = "employeeId";
        expectedWithWhitespace[11] = "#text";

        var replacedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        length = childList.length;


        if(
          (13 == length)
        ) {
          newChild = childList.item(1);
          oldChild = childList.item(11);
          expected =  expectedWithWhitespace;

        }

        else {
          newChild = childList.item(0);
          oldChild = childList.item(5);
          expected =  expectedWithoutWhitespace;

        }

        replacedChild = employeeNode.replaceChild(newChild,oldChild);
        assertSame("return_value_same",oldChild,replacedChild);

        for(var indexN100DE = 0;indexN100DE < childList.length; indexN100DE++) {

          childNode = childList.item(indexN100DE);

          childName = childNode.nodeName;
          actual[actual.length] = childName;

        }
        assertEqualsList("childNames",expected,actual);

      },
      /**
      * 
      The "replaceChild(newChild,oldChild)" method raises a 
      HIERARCHY_REQUEST_ERR DOMException if the node to put
      in is one of this node's ancestors.

      Retrieve the second employee and attempt to replace
      one of its children with an ancestor node(root node).
      An attempt to make such a replacement should raise the 
      desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='HIERARCHY_REQUEST_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodereplacechildnodeancestor : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildnodeancestor") != null) return;
        var doc;
        var newChild;
        var elementList;
        var employeeNode;
        var childList;
        var oldChild;
        var replacedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newChild = doc.documentElement;

        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        oldChild = childList.item(0);

        {
          success = false;
          try {
            replacedNode = employeeNode.replaceChild(newChild,oldChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 3);
          }
          assertTrue("throw_HIERARCHY_REQUEST_ERR",success);
        }

      },
      /**
      * 
      Replace the second Element of the second employee with
      a newly created node Element and check the NodeName 
      returned by the "replaceChild(newChild,oldChild)"
      method.   The returned node should have a NodeName equal
      to "employeeId".

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      */
      nodereplacechildnodename : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildnodename") != null) return;
        var doc;
        var elementList;
        var employeeNode;
        var childList;
        var oldChild;
        var newChild;
        var replacedNode;
        var length;
        var childName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("employee");
        employeeNode = elementList.item(1);
        childList = employeeNode.childNodes;

        length = childList.length;

        oldChild = childList.item(1);
        newChild = doc.createElement("newChild");
        replacedNode = employeeNode.replaceChild(newChild,oldChild);
        childName = replacedNode.nodeName;


        if(
          (6 == length)
        ) {
          assertEquals("nowhitespace","name",childName);

        }

        else {
          assertEquals("whitespace","employeeId",childName);

        }

      },
      /**
      * 
      The "replaceChild(newChild,oldChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Obtain the children of the THIRD "gender" element.   The elements
      content is an entity reference.   Get the FIRST item 
      from the entity reference and execute the "replaceChild(newChild,oldChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author NIST
      * @author Mary Brady
      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      */
      nodereplacechildnomodificationallowederr : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildnomodificationallowederr") != null) return;
        var doc;
        var genderList;
        var genderNode;
        var entRef;
        var entElement;
        var createdNode;
        var replacedChild;
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

        createdNode = doc.createElement("newChild");

        {
          success = false;
          try {
            replacedChild = entRef.replaceChild(createdNode,entElement);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "replaceChild(newChild,oldChild)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Create an entity reference execute the "replaceChild(newChild,oldChild)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/nodereplacechildnomodificationallowederr.xml
      */
      nodereplacechildnomodificationallowederrEE : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildnomodificationallowederrEE") != null) return;
        var doc;
        var entRef;
        var entText;
        var createdNode;
        var replacedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        entRef = doc.createEntityReference("ent4");
        assertNotNull("createdEntRefNotNull",entRef);
        entText = entRef.firstChild;

        createdNode = doc.createElement("newChild");

        {
          success = false;
          try {
            replacedChild = entRef.replaceChild(createdNode,entText);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "replaceChild(newChild,oldChild)" method raises a 
      NOT_FOUND_ERR DOMException if the old child is
      not a child of this node.

      Retrieve the second employee and attempt to replace a
      node that is not one of its children.   An attempt to
      replace such a node should raise the desired exception.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-785887307')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NOT_FOUND_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      nodereplacechildoldchildnonexistent : function () {
        var success;
        if(checkInitialization(builder, "nodereplacechildoldchildnonexistent") != null) return;
        var doc;
        var oldChild;
        var newChild;
        var elementList;
        var elementNode;
        var replacedNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newChild = doc.createElement("newChild");
        oldChild = doc.createElement("oldChild");
        elementList = doc.getElementsByTagName("employee");
        elementNode = elementList.item(1);

        {
          success = false;
          try {
            replacedNode = elementNode.replaceChild(newChild,oldChild);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 8);
          }
          assertTrue("throw_NOT_FOUND_ERR",success);
        }

      },
      /**
      * 
      The "setNodeValue(nodeValue)" method causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Obtain the children of the THIRD "gender" element.   The elements
      content is an entity reference.   Get the SECOND item 
      from the entity reference and execute the "setNodeValue(nodeValue)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author NIST
      * @author Mary Brady
      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68D080')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodesetnodevaluenomodificationallowederr : function () {
        var success;
        if(checkInitialization(builder, "nodesetnodevaluenomodificationallowederr") != null) return;
        var doc;
        var genderList;
        var genderNode;
        var entRef;
        var entElement;
        var entElementText;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        genderList = doc.getElementsByTagName("gender");
        genderNode = genderList.item(2);
        entRef = genderNode.firstChild;

        assertNotNull("entRefNotNull",entRef);
        nodeType = entRef.nodeType;


        if(
          (1 == nodeType)
        ) {
          entRef = doc.createEntityReference("ent4");
          assertNotNull("createdEntRefNotNull",entRef);

        }
        entElement = entRef.firstChild;

        assertNotNull("entElementNotNull",entElement);
        entElementText = entElement.firstChild;

        assertNotNull("entElementTextNotNull",entElementText);

        {
          success = false;
          try {
            entElementText.nodeValue = "newValue";

          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      Create an entity reference and execute the "setNodeValue(nodeValue)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68D080')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/nodesetnodevaluenomodificationallowederr.xml
      */
      nodesetnodevaluenomodificationallowederrEE : function () {
        var success;
        if(checkInitialization(builder, "nodesetnodevaluenomodificationallowederrEE") != null) return;
        var doc;
        var entRef;
        var entText;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        entRef = doc.createEntityReference("ent3");
        assertNotNull("createdEntRefNotNull",entRef);
        entText = entRef.firstChild;

        assertNotNull("entTextNotNull",entText);

        {
          success = false;
          try {
            entText.nodeValue = "newValue";

          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "getAttributes()" method invoked on a Text
      Node returns null.

      Retrieve the Text node from the last child of the
      first employee and invoke the "getAttributes()" method
      on the Text Node.  It should return null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1312295772
      */
      nodetextnodeattribute : function () {
        var success;
        if(checkInitialization(builder, "nodetextnodeattribute") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var textNode;
        var attrList;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        textNode = testAddr.firstChild;

        attrList = textNode.attributes;

        assertNull("nodeTextNodeAttributesAssert1",attrList);

      },
      /**
      * 

      The string returned by the "getNodeName()" method for a 

      Text Node is "#text".



      Retrieve the Text Node from the last child of the

      first employee and check the string returned 

      by the "getNodeName()" method.   It should be equal to 

      "#text". 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      */
      nodetextnodename : function () {
        var success;
        if(checkInitialization(builder, "nodetextnodename") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var textNode;
        var textName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        textNode = testAddr.firstChild;

        textName = textNode.nodeName;

        assertEquals("nodeTextNodeNameAssert1","#text",textName);

      },
      /**
      * 

      The "getNodeType()" method for a Text Node

      returns the constant value 3.



      Retrieve the Text node from the last child of

      the first employee and invoke the "getNodeType()"   

      method.   The method should return 3. 


      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
      */
      nodetextnodetype : function () {
        var success;
        if(checkInitialization(builder, "nodetextnodetype") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var textNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        textNode = testAddr.firstChild;

        nodeType = textNode.nodeType;

        assertEquals("nodeTextNodeTypeAssert1",3,nodeType);

      },
      /**
      * 
      The string returned by the "getNodeValue()" method for a 
      Text Node is the content of the Text node.

      Retrieve the Text node from the last child of the first 
      employee and check the string returned by the 
      "getNodeValue()" method.   It should be equal to 
      "1230 North Ave. Dallas, Texas 98551". 

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      nodetextnodevalue : function () {
        var success;
        if(checkInitialization(builder, "nodetextnodevalue") != null) return;
        var doc;
        var elementList;
        var testAddr;
        var textNode;
        var textValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        testAddr = elementList.item(0);
        textNode = testAddr.firstChild;

        textValue = textNode.nodeValue;

        assertEquals("nodeTextNodeValueAssert1","1230 North Ave. Dallas, Texas 98551",textValue);

      },
      /**
      * 
      An element is created, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
      */
      nodevalue01 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue01") != null) return;
        var doc;
        var newNode;
        var newValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newNode = doc.createElement("address");
        newValue = newNode.nodeValue;

        assertNull("initiallyNull",newValue);
        newNode.nodeValue = "This should have no effect";

        newValue = newNode.nodeValue;

        assertNull("nullAfterAttemptedChange",newValue);

      },
      /**
      * 
      An comment is created, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
      */
      nodevalue02 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue02") != null) return;
        var doc;
        var newNode;
        var newValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newNode = doc.createComment("This is a new Comment node");
        newValue = newNode.nodeValue;

        assertEquals("initial","This is a new Comment node",newValue);
        newNode.nodeValue = "This should have an effect";

        newValue = newNode.nodeValue;

        assertEquals("afterChange","This should have an effect",newValue);

      },
      /**
      * 
      An entity reference is created, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-11C98490
      */
      nodevalue03 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue03") != null) return;
        var doc;
        var newNode;
        var newValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newNode = doc.createEntityReference("ent1");
        assertNotNull("createdEntRefNotNull",newNode);
        newValue = newNode.nodeValue;

        assertNull("initiallyNull",newValue);
        newNode.nodeValue = "This should have no effect";

        newValue = newNode.nodeValue;

        assertNull("nullAfterAttemptedChange",newValue);

      },
      /**
      * 
      An document type accessed, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
      */
      nodevalue04 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue04") != null) return;
        var doc;
        var newNode;
        var newValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newNode = doc.doctype;

        assertNotNull("docTypeNotNull",newNode);
        newValue = newNode.nodeValue;

        assertNull("initiallyNull",newValue);
        newNode.nodeValue = "This should have no effect";

        newValue = newNode.nodeValue;

        assertNull("nullAfterAttemptedChange",newValue);

      },
      /**
      * 
      A document fragment is created, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
      */
      nodevalue05 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue05") != null) return;
        var doc;
        var newNode;
        var newValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newNode = doc.createDocumentFragment();
        newValue = newNode.nodeValue;

        assertNull("initiallyNull",newValue);
        newNode.nodeValue = "This should have no effect";

        newValue = newNode.nodeValue;

        assertNull("nullAfterAttemptedChange",newValue);

      },
      /**
      * 
      An document is accessed, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
      */
      nodevalue06 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue06") != null) return;
        var newNode;
        var newValue;

        var newNodeRef = null;
        if (typeof(this.newNode) != 'undefined') {
          newNodeRef = this.newNode;
        }
        newNode = load(newNodeRef, "newNode", "staff");
        newValue = newNode.nodeValue;

        assertNull("initiallyNull",newValue);
        newNode.nodeValue = "This should have no effect";

        newValue = newNode.nodeValue;

        assertNull("nullAfterAttemptedChange",newValue);

      },
      /**
      * 
      An Entity is accessed, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-527DCFF2
      */
      nodevalue07 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue07") != null) return;
        var doc;
        var newNode;
        var newValue;
        var nodeMap;
        var docType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        nodeMap = docType.entities;

        assertNotNull("entitiesNotNull",nodeMap);
        newNode = nodeMap.getNamedItem("ent1");
        assertNotNull("entityNotNull",newNode);
        newValue = newNode.nodeValue;

        assertNull("initiallyNull",newValue);
        newNode.nodeValue = "This should have no effect";

        newValue = newNode.nodeValue;

        assertNull("nullAfterAttemptedChange",newValue);

      },
      /**
      * 
      An notation is accessed, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5431D1B9
      */
      nodevalue08 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue08") != null) return;
        var doc;
        var docType;
        var newNode;
        var newValue;
        var nodeMap;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        nodeMap = docType.notations;

        assertNotNull("notationsNotNull",nodeMap);
        newNode = nodeMap.getNamedItem("notation1");
        assertNotNull("notationNotNull",newNode);
        newValue = newNode.nodeValue;

        assertNull("initiallyNull",newValue);
        newNode.nodeValue = "This should have no effect";

        newValue = newNode.nodeValue;

        assertNull("nullAfterAttemptedChange",newValue);

      },
      /**
      * 
      An processing instruction is created, setNodeValue is called with a non-null argument, but getNodeValue
      should still return null.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1004215813
      */
      nodevalue09 : function () {
        var success;
        if(checkInitialization(builder, "nodevalue09") != null) return;
        var doc;
        var newNode;
        var newValue;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        newNode = doc.createProcessingInstruction("TARGET","DATA");
        newValue = newNode.nodeValue;

        assertEquals("initial","DATA",newValue);
        newNode.nodeValue = "This should have an effect";

        newValue = newNode.nodeValue;

        assertEquals("after","This should have an effect",newValue);

      },
      /**
      * 
      Retrieve the notation named "notation1" and access its 
      name by invoking the "getNodeName()" method inherited
      from the Node interface.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5431D1B9
      */
      notationgetnotationname : function () {
        var success;
        if(checkInitialization(builder, "notationgetnotationname") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var notationName;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation1");
        notationName = notationNode.nodeName;

        assertEquals("notationGetNotationNameAssert","notation1",notationName);

      },
      /**
      * 
      Retrieve the notation named "notation1" and access its  
      public identifier.  The string "notation1File" should be
      returned.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-54F2B4D0
      */
      notationgetpublicid : function () {
        var success;
        if(checkInitialization(builder, "notationgetpublicid") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var publicId;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation1");
        publicId = notationNode.publicId;

        assertEquals("publicId","notation1File",publicId);

      },
      /**
      * 
      The "getPublicId()" method of a Notation node contains
      the public identifier associated with the notation, if
      one was not specified a null value should be returned.

      Retrieve the notation named "notation2" and access its  
      public identifier.  Since a public identifier was not
      specified for this notation, the "getPublicId()" method
      should return null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-54F2B4D0
      */
      notationgetpublicidnull : function () {
        var success;
        if(checkInitialization(builder, "notationgetpublicidnull") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var publicId;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation2");
        publicId = notationNode.publicId;

        assertNull("publicId",publicId);

      },
      /**
      * 
      The "getSystemId()" method of a Notation node contains
      the system identifier associated with the notation, if
      one was specified.

      Retrieve the notation named "notation2" and access its  
      system identifier.  The string "notation2File" should be
      returned.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E8AAB1D0
      */
      notationgetsystemid : function () {
        var success;
        if(checkInitialization(builder, "notationgetsystemid") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var systemId;
        var index;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation2");
        systemId = notationNode.systemId;

        assertURIEquals("uriEquals",null,null,null,"notation2File",null,null,null,null,systemId);

      },
      /**
      * 
      Retrieve the notation named "notation1" and access its  
      system identifier.  Since a system identifier was not
      specified for this notation, the "getSystemId()" method
      should return null.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-E8AAB1D0
      */
      notationgetsystemidnull : function () {
        var success;
        if(checkInitialization(builder, "notationgetsystemidnull") != null) return;
        var doc;
        var docType;
        var notations;
        var notationNode;
        var systemId;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        docType = doc.doctype;

        assertNotNull("docTypeNotNull",docType);
        notations = docType.notations;

        assertNotNull("notationsNotNull",notations);
        notationNode = notations.getNamedItem("notation1");
        systemId = notationNode.systemId;

        assertNull("systemId",systemId);

      },
      /**
      * 
      The "getData()" method returns the content of the  
      processing instruction.  It starts at the first non
      white character following the target and ends at the
      character immediately preceding the "?>".

      Retrieve the ProcessingInstruction node located  
      immediately after the prolog.  Create a nodelist of the 
      child nodes of this document.  Invoke the "getData()"
      method on the first child in the list. This should
      return the content of the ProcessingInstruction.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-837822393
      */
      processinginstructiongetdata : function () {
        var success;
        if(checkInitialization(builder, "processinginstructiongetdata") != null) return;
        var doc;
        var childNodes;
        var piNode;
        var data;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        childNodes = doc.childNodes;

        piNode = childNodes.item(0);
        data = piNode.data;

        assertEquals("processinginstructionGetTargetAssert","PIDATA",data);

      },
      /**
      * 
      The "getTarget()" method returns the target of the  
      processing instruction.  It is the first token following
      the markup that begins the processing instruction.

      Retrieve the ProcessingInstruction node located  
      immediately after the prolog.  Create a nodelist of the 
      child nodes of this document.  Invoke the "getTarget()"
      method on the first child in the list. This should
      return the target of the ProcessingInstruction.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1478689192
      */
      processinginstructiongettarget : function () {
        var success;
        if(checkInitialization(builder, "processinginstructiongettarget") != null) return;
        var doc;
        var childNodes;
        var piNode;
        var target;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        childNodes = doc.childNodes;

        piNode = childNodes.item(0);
        target = piNode.target;

        assertEquals("processinginstructionGetTargetAssert","TEST-STYLE",target);

      },
      /**
      * 
      The "setData(data)" method for a processing instruction causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Obtain the children of the THIRD "gender" element.  The elements
      content is an entity reference.  Try to remove the "domestic" attribute
      from the entity reference by executing the "setData(data)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-837822393
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-837822393')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-837822393
      */
      processinginstructionsetdatanomodificationallowederr : function () {
        var success;
        if(checkInitialization(builder, "processinginstructionsetdatanomodificationallowederr") != null) return;
        var doc;
        var genderList;
        var gender;
        var entRef;
        var piNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        genderList = doc.getElementsByTagName("gender");
        gender = genderList.item(2);
        entRef = gender.firstChild;

        assertNotNull("entRefNotNull",entRef);
        piNode = entRef.lastChild;

        assertNotNull("piNodeNotNull",piNode);

        {
          success = false;
          try {
            piNode.data = "newData";

          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "setData(data)" method for a processing instruction causes the 
      DOMException NO_MODIFICATION_ALLOWED_ERR to be raised
      if the node is readonly.

      Create an ent4 entity reference and add to document of the THIRD "gender" element.  The elements
      content is an entity reference.  Try to remove the "domestic" attribute
      from the entity reference by executing the "setData(data)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-837822393
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-837822393')/setraises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-837822393
      * @see http://lists.w3.org/Archives/Public/www-dom-ts/2002Apr/0053.html
      * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/processinginstructionsetdatanomodificationallowederr.xml
      */
      processinginstructionsetdatanomodificationallowederrEE : function () {
        var success;
        if(checkInitialization(builder, "processinginstructionsetdatanomodificationallowederrEE") != null) return;
        var doc;
        var genderList;
        var gender;
        var entRef;
        var piNode;
        var appendedChild;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        genderList = doc.getElementsByTagName("gender");
        gender = genderList.item(2);
        entRef = doc.createEntityReference("ent4");
        appendedChild = gender.appendChild(entRef);
        entRef = gender.lastChild;

        assertNotNull("entRefNotNull",entRef);
        piNode = entRef.lastChild;

        assertNotNull("piNodeNotNull",piNode);

        {
          success = false;
          try {
            piNode.data = "newData";

          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "splitText(offset)" method raises an
      INDEX_SIZE_ERR DOMException if the specified offset is
      negative.

      Retrieve the textual data from the second child of the 
      third employee and invoke the "splitText(offset)" method.
      The desired exception should be raised since the offset
      is a negative number.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-38853C1D')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
      */
      textindexsizeerrnegativeoffset : function () {
        var success;
        if(checkInitialization(builder, "textindexsizeerrnegativeoffset") != null) return;
        var doc;
        var elementList;
        var nameNode;
        var textNode;
        var splitNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        nameNode = elementList.item(2);
        textNode = nameNode.firstChild;


        {
          success = false;
          try {
            splitNode = textNode.splitText(-69);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 1);
          }
          assertTrue("throws_INDEX_SIZE_ERR",success);
        }

      },
      /**
      * 
      The "splitText(offset)" method raises an
      INDEX_SIZE_ERR DOMException if the specified offset is
      greater than the number of characters in the Text node.

      Retrieve the textual data from the second child of the 
      third employee and invoke the "splitText(offset)" method.
      The desired exception should be raised since the offset
      is a greater than the number of characters in the Text
      node.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-38853C1D')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
      * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=249
      */
      textindexsizeerroffsetoutofbounds : function () {
        var success;
        if(checkInitialization(builder, "textindexsizeerroffsetoutofbounds") != null) return;
        var doc;
        var elementList;
        var nameNode;
        var textNode;
        var splitNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        nameNode = elementList.item(2);
        textNode = nameNode.firstChild;


        {
          success = false;
          try {
            splitNode = textNode.splitText(300);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 1);
          }
          assertTrue("throw_INDEX_SIZE_ERR",success);
        }

      },
      /**
      * 
      Retrieve the textual data from the last child of the 
      second employee.   That node is composed of two   
      EntityReference nodes and two Text nodes.   After
      the content node is parsed, the "address" Element
      should contain four children with each one of the
      EntityReferences containing one child.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-11C98490
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-745549614
      */
      textparseintolistofelements : function () {
        var success;
        if(checkInitialization(builder, "textparseintolistofelements") != null) return;
        var doc;
        var elementList;
        var addressNode;
        var childList;
        var child;
        var length;
        var value;
        var grandChild;
        var result = new Array();

        expectedNormal = new Array();
        expectedNormal[0] = "1900 Dallas Road";
        expectedNormal[1] = " Dallas, ";
        expectedNormal[2] = "Texas";
        expectedNormal[3] = "\n 98554";

        expectedExpanded = new Array();
        expectedExpanded[0] = "1900 Dallas Road Dallas, Texas\n 98554";


        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        addressNode = elementList.item(1);
        childList = addressNode.childNodes;

        length = childList.length;

        for(var indexN1007F = 0;indexN1007F < childList.length; indexN1007F++) {
          child = childList.item(indexN1007F);
          value = child.nodeValue;


          if(

            (value == null)

          ) {
            grandChild = child.firstChild;

            assertNotNull("grandChildNotNull",grandChild);
            value = grandChild.nodeValue;

            result[result.length] = value;

          }

          else {
            result[result.length] = value;

          }

        }

        if(
          (4 == length)
        ) {
          assertEqualsList("assertEqNormal",expectedNormal,result);

        }

        else {
          assertEqualsList("assertEqCoalescing",expectedExpanded,result);

        }

      },
      /**
      * 
      The "splitText(offset)" method returns the new Text node.

      Retrieve the textual data from the last child of the 
      first employee and invoke the "splitText(offset)" method.
      The method should return the new Text node.   The offset
      value used for this test is 30.   The "getNodeValue()"
      method is called to check that the new node now contains
      the characters at and after position 30.
      (Starting count at 0)

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      */
      textsplittextfour : function () {
        var success;
        if(checkInitialization(builder, "textsplittextfour") != null) return;
        var doc;
        var elementList;
        var addressNode;
        var textNode;
        var splitNode;
        var value;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("address");
        addressNode = elementList.item(0);
        textNode = addressNode.firstChild;

        splitNode = textNode.splitText(30);
        value = splitNode.nodeValue;

        assertEquals("textSplitTextFourAssert","98551",value);

      },
      /**
      * 
      The "splitText(offset)" method raises a 
      NO_MODIFICATION_ALLOWED_ERR DOMException if the
      node is readonly.

      Obtain the children of the THIRD "gender" element.   The elements
      content is an entity reference.   Get the element content of the FIRST
      Text Node of the entity reference and execute the "splitText(offset)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-38853C1D')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      */
      textsplittextnomodificationallowederr : function () {
        var success;
        if(checkInitialization(builder, "textsplittextnomodificationallowederr") != null) return;
        var doc;
        var genderList;
        var gender;
        var entRef;
        var entElement;
        var entElementText;
        var splitNode;
        var nodeType;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        genderList = doc.getElementsByTagName("gender");
        gender = genderList.item(2);
        entRef = gender.firstChild;

        assertNotNull("entRefNotNull",entRef);
        nodeType = entRef.nodeType;


        if(
          (1 == nodeType)
        ) {
          entRef = doc.createEntityReference("ent4");
          assertNotNull("createdEntRefNotNull",entRef);

        }
        entElement = entRef.firstChild;

        assertNotNull("entElementNotNull",entElement);
        entElementText = entElement.firstChild;

        assertNotNull("entElementTextNotNull",entElementText);

        {
          success = false;
          try {
            splitNode = entElementText.splitText(2);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      Create an ent3 reference and execute the "splitText(offset)" method.
      This causes a NO_MODIFICATION_ALLOWED_ERR DOMException to be thrown.

      * @author Curt Arnold
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-38853C1D')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='NO_MODIFICATION_ALLOWED_ERR'])
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      * @see http://www.w3.org/2001/DOM-Test-Suite/level1/core/textsplittextnomodificationallowederr.xml
      */
      textsplittextnomodificationallowederrEE : function () {
        var success;
        if(checkInitialization(builder, "textsplittextnomodificationallowederrEE") != null) return;
        var doc;
        var entRef;
        var entText;
        var splitNode;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        entRef = doc.createEntityReference("ent3");
        assertNotNull("createdEntRefNotNull",entRef);
        entText = entRef.firstChild;

        assertNotNull("entTextNotNull",entText);

        {
          success = false;
          try {
            splitNode = entText.splitText(2);
          }
          catch(ex) {
            success = (typeof(ex.code) != 'undefined' && ex.code == 7);
          }
          assertTrue("throw_NO_MODIFICATION_ALLOWED_ERR",success);
        }

      },
      /**
      * 
      The "splitText(offset)" method breaks the Text node into
      two Text nodes at the specified offset keeping each node
      as siblings in the tree.

      Retrieve the textual data from the second child of the 
      third employee and invoke the "splitText(offset)" method.
      The method splits the Text node into two new sibling
      Text nodes keeping both of them in the tree.   This test
      checks the "nextSibling()" method of the original node
      to ensure that the two nodes are indeed siblings.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      */
      textsplittextone : function () {
        var success;
        if(checkInitialization(builder, "textsplittextone") != null) return;
        var doc;
        var elementList;
        var nameNode;
        var textNode;
        var splitNode;
        var secondPart;
        var value;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        nameNode = elementList.item(2);
        textNode = nameNode.firstChild;

        splitNode = textNode.splitText(7);
        secondPart = textNode.nextSibling;

        value = secondPart.nodeValue;

        assertEquals("textSplitTextOneAssert","Jones",value);

      },
      /**
      * 
      After the "splitText(offset)" method breaks the Text node
      into two Text nodes, the new Text node contains all the
      content at and after the offset point.

      Retrieve the textual data from the second child of the 
      third employee and invoke the "splitText(offset)" method.
      The new Text node should contain all the content
      at and after the offset point.   The "getNodeValue()"
      method is called to check that the new node now contains
      the characters at and after position seven.
      (Starting count at 0)

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      */
      textsplittextthree : function () {
        var success;
        if(checkInitialization(builder, "textsplittextthree") != null) return;
        var doc;
        var elementList;
        var nameNode;
        var textNode;
        var splitNode;
        var value;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        nameNode = elementList.item(2);
        textNode = nameNode.firstChild;

        splitNode = textNode.splitText(6);
        value = splitNode.nodeValue;

        assertEquals("textSplitTextThreeAssert"," Jones",value);

      },
      /**
      * 
      After the "splitText(offset)" method breaks the Text node
      into two Text nodes, the original node contains all the
      content up to the offset point.

      Retrieve the textual data from the second child of the 
      third employee and invoke the "splitText(offset)" method.
      The original Text node should contain all the content
      up to the offset point.   The "getNodeValue()" method
      is called to check that the original node now contains
      the first five characters.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-38853C1D
      */
      textsplittexttwo : function () {
        var success;
        if(checkInitialization(builder, "textsplittexttwo") != null) return;
        var doc;
        var elementList;
        var nameNode;
        var textNode;
        var splitNode;
        var value;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        nameNode = elementList.item(2);
        textNode = nameNode.firstChild;

        splitNode = textNode.splitText(5);
        value = textNode.nodeValue;

        assertEquals("textSplitTextTwoAssert","Roger",value);

      },
      /**
      * 
      If there is not any markup inside an Element or Attr node
      content, then the text is contained in a single object   
      implementing the Text interface that is the only child
      of the element.

      Retrieve the textual data from the second child of the 
      third employee.   That Text node contains a block of 
      multiple text lines without markup, so they should be
      treated as a single Text node.   The "getNodeValue()"    
      method should contain the combination of the two lines.

      * @author NIST
      * @author Mary Brady
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1312295772
      * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
      */
      textwithnomarkup : function () {
        var success;
        if(checkInitialization(builder, "textwithnomarkup") != null) return;
        var doc;
        var elementList;
        var nameNode;
        var nodeV;
        var value;

        var docRef = null;
        if (typeof(this.doc) != 'undefined') {
          docRef = this.doc;
        }
        doc = load(docRef, "doc", "staff");
        elementList = doc.getElementsByTagName("name");
        nameNode = elementList.item(2);
        nodeV = nameNode.firstChild;

        value = nodeV.nodeValue;

        assertEquals("textNodeValue","Roger\n Jones",value);

        },
        
        maintainfeatures : function() {
          var success;
          if(checkInitialization(builder, "maintainfeatures") != null) return;
          var doc;
          var elementList;
          var nameNode;
          var nodeV;
          var value;

          var docRef = null;
          if (typeof(this.doc) != 'undefined') {
            docRef = this.doc;
          }
          doc = load(docRef, "doc", "staff");
          doc.implementation.addFeature("TestingFeature", 1);
          doc.implementation.addFeature("TestingFeature", 2);
          doc.implementation.addFeature("TestingFeature", 3);
          
          assertTrue("document has 'TestingFeature'",
                      doc.implementation.hasFeature('TestingFeature'));

          doc.implementation.removeFeature("TestingFeature", 2);
          assertFalse("document no longer has 'TestingFeature v2'",
                      doc.implementation.hasFeature('TestingFeature', 2));

          assertTrue("document has 'TestingFeature' v1 and v3",
                      doc.implementation.hasFeature('TestingFeature', 1) &&
                      doc.implementation.hasFeature('TestingFeature', 3));

          doc.implementation.removeFeature("TestingFeature");
          assertFalse("document no longer has 'TestingFeature'",
                      doc.implementation.hasFeature('TestingFeature'));
          
          
        }
		};
