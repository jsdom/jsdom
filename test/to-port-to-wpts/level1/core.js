"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const staff = require("./core/files/staff.xml");
const hc_staff = require("./core/files/hc_staff.xml");
const hc_nodtdstaff = require("./core/files/hc_nodtdstaff.xml");
const extra = require("./core/files/extra.xml");
const domTestHelper = require("../files/DOMTestCase");

// NB: these tests have been modified to be compliant with the modern DOM, instead of the "DOM Level 1" they were
// written for. Check the revision history.

describe("level1/core", () => {

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
  specify("attrcreatedocumentfragment", () => {
    let success;
    let doc;
    let docFragment;
    let newOne;
    let domesticNode;
    let domesticAttr;
    let attrs;
    let attrName;
    let appendedChild;

    doc = staff.staff();
    docFragment = doc.createDocumentFragment();
    newOne = doc.createElement("newElement");
    newOne.setAttribute("newdomestic", "Yes");
    appendedChild = docFragment.appendChild(newOne);
    domesticNode = docFragment.firstChild;

    domesticAttr = domesticNode.attributes;

    attrs = domesticAttr.item(0);
    attrName = attrs.name;

    assert.equal(attrName, "newdomestic", "attrCreateDocumentFragmentAssert");
  });

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
  specify("attrcreatetextnode", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let value;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(3);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    streetAttr.value = "Y&ent1;";

    value = streetAttr.value;

    assert.equal(value, "Y&ent1;", "value");
    value = streetAttr.nodeValue;

    assert.equal(value, "Y&ent1;", "nodeValue");
  });

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
  specify("attrcreatetextnode2", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let value;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(3);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    streetAttr.nodeValue = "Y&ent1;";

    value = streetAttr.value;

    assert.equal(value, "Y&ent1;", "value");
    value = streetAttr.nodeValue;

    assert.equal(value, "Y&ent1;", "nodeValue");
  });

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
  specify("attreffectivevalue", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let domesticAttr;
    let value;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    value = domesticAttr.nodeValue;

    assert.equal(value, "Yes", "attrEffectiveValueAssert");
  });

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
  specify("attrname", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let name;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(1);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    name = streetAttr.name;

    assert.equal(name, "street", "nodeName");
    name = streetAttr.name;

    assert.equal(name, "street", "name");
  });

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
  specify("attrnextsiblingnull", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let domesticAttr;
    let s;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    s = domesticAttr.nextSibling;

    assert.equal(s, null, "attrNextSiblingNullAssert");
  });

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
  specify("attrparentnodenull", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let domesticAttr;
    let s;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    s = domesticAttr.parentNode;

    assert.equal(s, null, "attrParentNodeNullAssert");
  });

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
  specify("attrprevioussiblingnull", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let domesticAttr;
    let s;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    s = domesticAttr.previousSibling;

    assert.equal(s, null, "attrPreviousSiblingNullAssert");
  });

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
  specify("attrspecifiedvalue", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let domesticAttr;
    let state;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    state = domesticAttr.specified;

    assert.ok(state, "domesticSpecified");
  });

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
  specify("attrspecifiedvaluechanged", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let state;

    doc = staff.staff();
    addressList = doc.getElementsByTagName("address");
    testNode = addressList.item(2);
    testNode.setAttribute("street", "Yes");
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("street");
    state = streetAttr.specified;

    assert.ok(state, "streetSpecified");
  });

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
  specify("characterdataappenddata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childValue;
    let childLength;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.appendData(", Esquire");
    childValue = child.data;

    childLength = childValue.length;
    assert.equal(childLength, 24, "characterdataAppendDataAssert");
  });

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
  specify("characterdataappenddatagetdata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.appendData(", Esquire");
    childData = child.data;

    assert.equal(childData, "Margaret Martin, Esquire", "characterdataAppendDataGetDataAssert");
  });

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
  specify("characterdatadeletedatabegining", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(0, 16);
    childData = child.data;

    assert.equal(childData, "Dallas, Texas 98551", "characterdataDeleteDataBeginingAssert");
  });

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
  specify("characterdatadeletedataend", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(30, 5);
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Dallas, Texas ", "characterdataDeleteDataEndAssert");
  });

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
  specify("characterdatadeletedataexceedslength", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(4, 50);
    childData = child.data;

    assert.equal(childData, "1230", "characterdataDeleteDataExceedsLengthAssert");
  });

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
  specify("characterdatadeletedatagetlengthanddata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;
    let childLength;
    let result = new Array();


    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(30, 5);
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Dallas, Texas ", "data");
    childLength = child.length;

    assert.equal(childLength, 30, "length");
  });

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
  specify("characterdatadeletedatamiddle", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(16, 8);
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Texas 98551", "characterdataDeleteDataMiddleAssert");
  });

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
  specify("characterdatagetdata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    childData = child.data;

    assert.equal(childData, "Margaret Martin", "characterdataGetDataAssert");
  });

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
  specify("characterdatagetlength", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childValue;
    let childLength;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    childValue = child.data;

    childLength = childValue.length;
    assert.equal(childLength, 15, "characterdataGetLengthAssert");
  });

  /**
   *
   The "deleteData(offset,count)" method works with negative counts.

   Retrieve the character data of the last child of the
   first employee and invoke its "deleteData(offset,count)"
   method with offset=10 and count=-3.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("characterdataindexsizeerrdeletedatacountnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(10, -3);

    assert.equal(child.data, "1230 North");
  });

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
  specify("characterdataindexsizeerrdeletedataoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(40, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("characterdataindexsizeerrdeletedataoffsetnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(-5, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

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
  specify("characterdataindexsizeerrinsertdataoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.insertData(40, "ABC");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("characterdataindexsizeerrinsertdataoffsetnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.insertData(-5, "ABC");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

  /**
   *
   The "replaceData(offset,count,arg)" method works with negative counts.

   Retrieve the character data of the last child of the
   first employee and invoke its
   "replaceData(offset,count,arg) method with offset=10
   and count=-3 and arg="ABC".

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("characterdataindexsizeerrreplacedatacountnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(10, -3, "ABC");

    assert.equal(child.data, "1230 NorthABC");
  });

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
  specify("characterdataindexsizeerrreplacedataoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.replaceData(40, 3, "ABC");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("characterdataindexsizeerrreplacedataoffsetnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.replaceData(-5, 3, "ABC");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

  /**
   *
   The "substringData(offset,count)" method works if count is negative.

   Retrieve the character data of the last child of the
   first employee and invoke its "substringData(offset,count)
   method with offset=10 and count=-3.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("characterdataindexsizeerrsubstringcountnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let badSubstring;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    badSubstring = child.substringData(10, -3);

    assert.equal(badSubstring, " Ave. Dallas, Texas 98551");
  });

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
  specify("characterdataindexsizeerrsubstringnegativeoffset", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let badString;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        badString = child.substringData(-5, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

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
  specify("characterdataindexsizeerrsubstringoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let badString;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        badString = child.substringData(40, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("characterdatainsertdatabeginning", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(0, "Mss. ");
    childData = child.data;

    assert.equal(childData, "Mss. Margaret Martin", "characterdataInsertDataBeginningAssert");
  });

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
  specify("characterdatainsertdataend", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(15, ", Esquire");
    childData = child.data;

    assert.equal(childData, "Margaret Martin, Esquire", "characterdataInsertDataEndAssert");
  });

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
  specify("characterdatainsertdatamiddle", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(9, "Ann ");
    childData = child.data;

    assert.equal(childData, "Margaret Ann Martin", "characterdataInsertDataMiddleAssert");
  });

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
  specify("characterdatareplacedatabegining", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0, 4, "2500");
    childData = child.data;

    assert.equal(childData, "2500 North Ave. Dallas, Texas 98551", "characterdataReplaceDataBeginingAssert");
  });

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
  specify("characterdatareplacedataend", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(30, 5, "98665");
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Dallas, Texas 98665", "characterdataReplaceDataEndAssert");
  });

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
  specify("characterdatareplacedataexceedslengthofarg", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0, 4, "260030");
    childData = child.data;

    assert.equal(
      childData,
      "260030 North Ave. Dallas, Texas 98551",
      "characterdataReplaceDataExceedsLengthOfArgAssert"
    );
  });

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
  specify("characterdatareplacedataexceedslengthofdata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0, 50, "2600");
    childData = child.data;

    assert.equal(childData, "2600", "characterdataReplaceDataExceedsLengthOfDataAssert");
  });

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
  specify("characterdatareplacedatamiddle", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(5, 5, "South");
    childData = child.data;

    assert.equal(childData, "1230 South Ave. Dallas, Texas 98551", "characterdataReplaceDataMiddleAssert");
  });

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
  specify("characterdatasetnodevalue", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;
    let childValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.nodeValue = "Marilyn Martin";

    childData = child.data;

    assert.equal(childData, "Marilyn Martin", "data");
    childValue = child.nodeValue;

    assert.equal(childValue, "Marilyn Martin", "value");
  });

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
  specify("characterdatasubstringexceedsvalue", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let substring;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    substring = child.substringData(9, 10);
    assert.equal(substring, "Martin", "characterdataSubStringExceedsValueAssert");
  });

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
  specify("characterdatasubstringvalue", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let substring;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    substring = child.substringData(0, 8);
    assert.equal(substring, "Margaret", "characterdataSubStringValueAssert");
  });

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
  specify("commentgetcomment", () => {
    let success;
    let doc;
    let elementList;
    let child;
    let childName;
    let childValue;
    let commentCount = 0;
    let childType;

    doc = staff.staff();
    elementList = doc.childNodes;

    for (let indexN10057 = 0; indexN10057 < elementList.length; indexN10057++) {
      child = elementList.item(indexN10057);
      childType = child.nodeType;


      if (
        (childType === 8)
      ) {
        childName = child.nodeName;

        assert.equal(childName, "#comment", "nodeName");
        childValue = child.nodeValue;

        assert.equal(childValue, " This is comment number 1.", "nodeValue");
        commentCount = commentCount + 1;

      }

    }
    assert.equal(commentCount, 1, "commentCount");
  });

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
  specify("documentcreateattribute", () => {
    let success;
    let doc;
    let newAttrNode;
    let attrValue;
    let attrName;

    doc = staff.staff();
    newAttrNode = doc.createAttribute("district");
    attrValue = newAttrNode.nodeValue;

    assert.equal(attrValue, "", "value");
    attrName = newAttrNode.name;

    assert.equal(attrName, "district", "name");
  });

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
  specify("documentcreatecomment", () => {
    let success;
    let doc;
    let newCommentNode;
    let newCommentValue;
    let newCommentName;
    let newCommentType;

    doc = staff.staff();
    newCommentNode = doc.createComment("This is a new Comment node");
    newCommentValue = newCommentNode.nodeValue;

    assert.equal(newCommentValue, "This is a new Comment node", "value");
    newCommentName = newCommentNode.nodeName;

    assert.equal(newCommentName, "#comment", "name");
    newCommentType = newCommentNode.nodeType;

    assert.equal(newCommentType, 8, "type");
  });

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
  specify("documentcreatedocumentfragment", () => {
    let success;
    let doc;
    let newDocFragment;
    let children;
    let length;
    let newDocFragmentName;
    let newDocFragmentType;
    let newDocFragmentValue;

    doc = staff.staff();
    newDocFragment = doc.createDocumentFragment();
    children = newDocFragment.childNodes;

    length = children.length;

    assert.equal(length, 0, "length");
    newDocFragmentName = newDocFragment.nodeName;

    assert.equal(newDocFragmentName, "#document-fragment", "name");
    newDocFragmentType = newDocFragment.nodeType;

    assert.equal(newDocFragmentType, 11, "type");
    newDocFragmentValue = newDocFragment.nodeValue;

    assert.equal(newDocFragmentValue, null, "value");
  });

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
  specify("documentcreateelement", () => {
    let success;
    let doc;
    let newElement;
    let newElementName;
    let newElementType;
    let newElementValue;

    doc = staff.staff();
    newElement = doc.createElement("address");
    newElementName = newElement.nodeName;

    assert.equal(newElementName, "address", "name");
    newElementType = newElement.nodeType;

    assert.equal(newElementType, 1, "type");
    newElementValue = newElement.nodeValue;

    assert.equal(newElementValue, null, "valueInitiallyNull");
  });

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
  specify("documentcreateelementcasesensitive", () => {
    let success;
    let doc;
    let newElement1;
    let newElement2;
    let attribute1;
    let attribute2;

    doc = staff.staff();
    newElement1 = doc.createElement("ADDRESS");
    newElement2 = doc.createElement("address");
    newElement1.setAttribute("district", "Fort Worth");
    newElement2.setAttribute("county", "Dallas");
    attribute1 = newElement1.getAttribute("district");

    attribute2 = newElement2.getAttribute("county");
    assert.equal(attribute1, "Fort Worth", "attrib1");
    assert.equal(attribute2, "Dallas", "attrib2");
  });

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
  specify("documentcreateprocessinginstruction", () => {
    let success;
    let doc;
    let newPINode;
    let piValue;
    let piName;
    let piType;

    doc = staff.staff();
    newPINode = doc.createProcessingInstruction("TESTPI", "This is a new PI node");
    assert.notEqual(newPINode, null, "createdPINotNull");
    piName = newPINode.nodeName;

    assert.equal(piName, "TESTPI", "name");
    piValue = newPINode.nodeValue;

    assert.equal(piValue, "This is a new PI node", "value");
    piType = newPINode.nodeType;

    assert.equal(piType, 7, "type");
  });

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
  specify("documentcreatetextnode", () => {
    let success;
    let doc;
    let newTextNode;
    let newTextName;
    let newTextValue;
    let newTextType;

    doc = staff.staff();
    newTextNode = doc.createTextNode("This is a new Text node");
    newTextValue = newTextNode.nodeValue;

    assert.equal(newTextValue, "This is a new Text node", "value");
    newTextName = newTextNode.nodeName;

    assert.equal(newTextName, "#text", "name");
    newTextType = newTextNode.nodeType;

    assert.equal(newTextType, 3, "type");
  });

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
  specify("documentgetdoctype", () => {
    let success;
    let doc;
    let docType;
    let docTypeName;
    let nodeValue;

    doc = staff.staff();
    docType = doc.doctype;
    assert.notEqual(docType, null, "docTypeNotNull");

    docTypeName = docType.name;
    assert.equal(docTypeName, "staff", "doctypeName");

    nodeValue = docType.nodeValue;
    assert.equal(nodeValue, null, "initiallyNull");

    assert.equal(docType.systemId, "staff.dtd");
  });

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
  specify("documentgetdoctypenodtd", () => {
    let success;
    let doc;
    let docType;

    doc = hc_nodtdstaff.hc_nodtdstaff();
    docType = doc.doctype;

    assert.equal(docType, null, "documentGetDocTypeNoDTDAssert");
  });

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
  specify("documentgetelementsbytagnamelength", () => {
    let success;
    let doc;
    let nameList;

    doc = staff.staff();
    nameList = doc.getElementsByTagName("name");
    assert.equal(nameList.length, 5, "documentGetElementsByTagNameLengthAssert");
  });

  /**
   *
   Retrieve the entire DOM document, invoke
   getElementsByTagName("*") and check the length of the NodeList.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-A6C9094
   */
  specify("documentgetelementsbytagnametotallength", () => {
    let success;
    let doc;
    let nameList;

    doc = staff.staff();
    nameList = doc.getElementsByTagName("*");

    // NB: 37 if entity expansion is supported (jsdom does not)
    assert.equal(nameList.length, 36, "documentGetElementsByTagNameTotalLengthAssert");
  });

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
  specify("documentgetelementsbytagnamevalue", () => {
    let success;
    let doc;
    let nameList;
    let nameNode;
    let firstChild;
    let childValue;

    doc = staff.staff();
    nameList = doc.getElementsByTagName("name");
    nameNode = nameList.item(3);
    firstChild = nameNode.firstChild;

    childValue = firstChild.nodeValue;

    assert.equal(childValue, "Jeny Oconnor", "documentGetElementsByTagNameValueAssert");
  });

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
  specify("documentgetimplementation", () => {
    let success;
    let doc;
    let docImpl;
    let state;

    doc = staff.staff();
    docImpl = doc.implementation;
    state = docImpl.hasFeature("XML", "1.0");
    assert.ok(state, "documentGetImplementationAssert");
  });

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
  specify("documentgetrootnode", () => {
    let success;
    let doc;
    let root;
    let rootName;

    doc = staff.staff();
    root = doc.documentElement;

    rootName = root.nodeName;


    assert.equal(rootName, "staff", "documentGetRootNodeAssert");
  });

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
  specify("documentinvalidcharacterexceptioncreateattribute", () => {
    let success;
    let doc;
    let createdAttr;

    doc = staff.staff();

    {
      success = false;
      try {
        createdAttr = doc.createAttribute("invalid'Name");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

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
  specify("documentinvalidcharacterexceptioncreateelement", () => {
    let success;
    let doc;
    let badElement;

    doc = staff.staff();

    {
      success = false;
      try {
        badElement = doc.createElement("invalid^Name");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

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
  specify("documentinvalidcharacterexceptioncreatepi", () => {
    let success;
    let doc;
    let badPI;

    doc = hc_staff.hc_staff();
    success = false;
    try {
      badPI = doc.createProcessingInstruction("invalid^Name", "data");
    }
    catch (ex) {
      success = (typeof (ex.code) !== "undefined" && ex.code === 5);
    }
    assert.ok(success, "throw_INVALID_CHARACTER_ERR");
  });

  /**
   *
   Creating a processing instruction with an empty target should cause an INVALID_CHARACTER_ERR.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-135944439
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-135944439')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
   */
  specify("documentinvalidcharacterexceptioncreatepi1", () => {
    let success;
    let doc;
    let badPI;

    doc = hc_staff.hc_staff();
    success = false;
    try {
      badPI = doc.createProcessingInstruction("", "data");
    }
    catch (ex) {
      success = (typeof (ex.code) !== "undefined" && ex.code === 5);
    }
    assert.ok(success, "throw_INVALID_CHARACTER_ERR");
  });

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
  specify("documenttypegetdoctype", () => {
    let success;
    let doc;
    let docType;
    let name;

    doc = staff.staff();
    docType = doc.doctype;

    assert.notEqual(docType, null, "docTypeNotNull");
    name = docType.name;


    assert.equal(name, "staff", "documenttypeGetDocTypeAssert");
  });

  /**
   *
   hasFeature("XML", "") should return true for implementations that can read staff files.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
   * @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
   */
  specify("domimplementationfeaturenoversion", () => {
    let success;
    let doc;
    let domImpl;
    let state;

    doc = staff.staff();
    domImpl = doc.implementation;
    state = domImpl.hasFeature("XML", "");
    assert.ok(state, "hasXMLEmpty");
  });

  /**
   *
   hasFeature("XML", null) should return true for implementations that can read staff documents.

   * @author NIST
   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
   * @see http://www.w3.org/2000/11/DOM-Level-2-errata#core-14
   */
  specify("domimplementationfeaturenull", () => {
    let success;
    let doc;
    let domImpl;
    let state;
    let nullVersion = null;


    doc = staff.staff();
    domImpl = doc.implementation;
    state = domImpl.hasFeature("XML", nullVersion);
    assert.ok(state, "hasXMLnull");
  });

  /**
   *
   hasFeature("xml", "1.0") should return true for implementations that can read staff documents.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-5CED94D7
   */
  specify("domimplementationfeaturexml", () => {
    let success;
    let doc;
    let domImpl;
    let state;

    doc = staff.staff();
    domImpl = doc.implementation;
    state = domImpl.hasFeature("xml", "1.0");
    assert.ok(state, "hasXML1");
  });

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
  specify("elementaddnewattribute", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attrValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(4);
    testEmployee.setAttribute("district", "dallas");
    attrValue = testEmployee.getAttribute("district");
    assert.equal(attrValue, "dallas", "elementAddNewAttributeAssert");
  });

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
  specify("elementassociatedattribute", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let domesticAttr;
    let specified;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(0);
    attributes = testEmployee.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    specified = domesticAttr.specified;

    assert.ok(specified, "domesticSpecified");
  });

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
  specify("elementchangeattributevalue", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attrValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(3);
    testEmployee.setAttribute("street", "Neither");
    attrValue = testEmployee.getAttribute("street");
    assert.equal(attrValue, "Neither", "elementChangeAttributeValueAssert");
  });

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
  specify("elementcreatenewattribute", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;
    let newAttribute;
    let oldAttr;
    let districtAttr;
    let attrVal;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(0);
    newAttribute = doc.createAttribute("district");
    oldAttr = testAddress.setAttributeNode(newAttribute);
    assert.equal(oldAttr, null, "old_attr_doesnt_exist");
    districtAttr = testAddress.getAttributeNode("district");
    assert.notEqual(districtAttr, null, "new_district_accessible");
    attrVal = testAddress.getAttribute("district");
    assert.equal(attrVal, "", "attr_value");
  });

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
  specify("elementgetattributenode", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let domesticAttr;
    let name;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(0);
    domesticAttr = testEmployee.getAttributeNode("domestic");
    name = domesticAttr.name;

    assert.equal(name, "domestic", "elementGetAttributeNodeAssert");
  });

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
  specify("elementgetattributenodenull", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let domesticAttr;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(0);
    domesticAttr = testEmployee.getAttributeNode("invalidAttribute");
    assert.equal(domesticAttr, null, "elementGetAttributeNodeNullAssert");
  });

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
  specify("elementgetelementsbytagname", () => {
    let success;
    let doc;
    let elementList;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    assert.equal(elementList.length, 5, "elementGetElementsByTagNameAssert");
  });

  /**
   *
   Element.getElementsByTagName("employee") should return a NodeList whose length is
   "5" in the order the children were encountered.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1938918D
   */
  specify("elementgetelementsbytagnameaccessnodelist", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let child;
    let childName;
    let childValue;
    let childType;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    testEmployee = elementList.item(3);
    child = testEmployee.firstChild;

    childType = child.nodeType;


    if (
      (childType === 3)
    ) {
      child = child.nextSibling;


    }
    childName = child.nodeName;

    assert.equal(childName, "employeeId", "nodename");
    child = child.firstChild;

    childValue = child.nodeValue;

    assert.equal(childValue, "EMP0004", "emp0004");
  });

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
  specify("elementgetelementsbytagnamenomatch", () => {
    let success;
    let doc;
    let elementList;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("noMatch");
    assert.equal(elementList.length, 0, "elementGetElementsByTagNameNoMatchNoMatchAssert");
  });

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
  specify("elementgetelementsbytagnamespecialvalue", () => {
    let success;
    let doc;
    let elementList;
    let lastEmployee;
    let lastempList;
    let child;
    let childName;
    let result = new Array();

    let expectedResult = new Array();
    expectedResult[0] = "employeeId";
    expectedResult[1] = "name";
    expectedResult[2] = "position";
    expectedResult[3] = "salary";
    expectedResult[4] = "gender";
    expectedResult[5] = "address";


    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    lastEmployee = elementList.item(4);
    lastempList = lastEmployee.getElementsByTagName("*");
    for (let indexN1006A = 0; indexN1006A < lastempList.length; indexN1006A++) {
      child = lastempList.item(indexN1006A);
      childName = child.nodeName;

      result[result.length] = childName;

    }
    assert.deepEqual(result, expectedResult, "tagNames");
  });

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
  specify("elementgettagname", () => {
    let success;
    let doc;
    let root;
    let tagname;

    doc = staff.staff();
    root = doc.documentElement;

    tagname = root.tagName;


    assert.equal(tagname, "staff", "elementGetTagNameAssert");
  });

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
  specify("elementinuseattributeerr", () => {
    let success;
    let doc;
    let newAttribute;
    let addressElementList;
    let testAddress;
    let newElement;
    let appendedChild;
    let setAttr1;
    let setAttr2;

    doc = staff.staff();
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
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 10);
      }
      assert.ok(success, "throw_INUSE_ATTRIBUTE_ERR");
    }
  });

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
  specify("elementinvalidcharacterexception", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(0);

    {
      success = false;
      try {
        testAddress.setAttribute("invalid'Name", "value");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

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
  specify("elementnormalize", () => {
    let success;
    let doc;
    let root;
    let elementList;
    let testName;
    let firstChild;
    let childValue;

    doc = staff.staff();
    root = doc.documentElement;

    root.normalize();
    elementList = root.getElementsByTagName("name");
    testName = elementList.item(2);
    firstChild = testName.firstChild;

    childValue = firstChild.nodeValue;

    assert.equal(childValue, "Roger\n Jones", "elementNormalizeAssert");
  });

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
  specify("elementnotfounderr", () => {
    let success;
    let doc;
    let oldAttribute;
    let addressElementList;
    let testAddress;
    let attrAddress;

    doc = staff.staff();
    addressElementList = doc.getElementsByTagName("address");
    testAddress = addressElementList.item(4);
    oldAttribute = doc.createAttribute("oldAttribute");

    {
      success = false;
      try {
        attrAddress = testAddress.removeAttributeNode(oldAttribute);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("elementremoveattributeaftercreate", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let attributes;
    let districtAttr;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("district");
    districtAttr = testEmployee.setAttributeNode(newAttribute);
    districtAttr = testEmployee.removeAttributeNode(newAttribute);
    attributes = testEmployee.attributes;

    districtAttr = attributes.getNamedItem("district");
    assert.equal(districtAttr, null, "elementRemoveAttributeAfterCreateAssert");
  });

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
  specify("elementremoveattributenode", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let streetAttr;
    let removedAttr;
    let removedValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    streetAttr = testEmployee.getAttributeNode("street");
    removedAttr = testEmployee.removeAttributeNode(streetAttr);
    removedValue = removedAttr.value;

    assert.equal(removedValue, "No", "elementRemoveAttributeNodeAssert");
  });

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
  specify("elementreplaceattributewithself", () => {
    let doc = staff.staff();
    let testEmployee = doc.getElementsByTagName("address").item(2);
    let streetAttr = testEmployee.getAttributeNode("street");
    let replacedAttr = testEmployee.setAttributeNode(streetAttr);
    assert.equal(replacedAttr, streetAttr, "replacedAttr");
  });

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
  specify("elementreplaceexistingattribute", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let name;
    let setAttr;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("street");
    setAttr = testEmployee.setAttributeNode(newAttribute);
    name = testEmployee.getAttribute("street");
    assert.equal(name, "", "elementReplaceExistingAttributeAssert");
  });

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
  specify("elementreplaceexistingattributegevalue", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let streetAttr;
    let value;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("street");
    streetAttr = testEmployee.setAttributeNode(newAttribute);
    value = streetAttr.value;

    assert.equal(value, "No", "streetNo");
  });

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
  specify("elementretrieveattrvalue", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;
    let attrValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(2);
    attrValue = testAddress.getAttribute("street");
    assert.equal(attrValue, "No", "attrValue");
  });

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
  specify("elementretrievetagname", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let name;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("position");
    testEmployee = elementList.item(1);
    name = testEmployee.nodeName;

    assert.equal(name, "position", "nodename");
    name = testEmployee.tagName;

    assert.equal(name, "position", "tagname");
  });

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
  specify("elementsetattributenodenull", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let districtAttr;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("district");
    districtAttr = testEmployee.setAttributeNode(newAttribute);
    assert.equal(districtAttr, null, "elementSetAttributeNodeNullAssert");
  });

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
  specify("hc_attrcreatedocumentfragment", () => {
    let success;
    let doc;
    let docFragment;
    let newOne;
    let domesticNode;
    let attributes;
    let attribute;
    let attrName;
    let appendedChild;
    let langAttrCount = 0;

    doc = hc_staff.hc_staff();
    docFragment = doc.createDocumentFragment();
    newOne = doc.createElement("html");
    newOne.setAttribute("lang", "EN");

    appendedChild = docFragment.appendChild(newOne);

    domesticNode = docFragment.firstChild;

    attributes = domesticNode.attributes;

    for (let indexN10078 = 0; indexN10078 < attributes.length; indexN10078++) {
      attribute = attributes.item(indexN10078);
      attrName = attribute.name;
      if (attrName === "lang") {
        langAttrCount += 1;
      }
    }
    assert.equal(langAttrCount, 1, "hasLangAttr");
  });

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
  specify("hc_attrcreatetextnode", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let value;

    doc = hc_staff.hc_staff();
    addressList = doc.getElementsByTagName("acronym");
    testNode = addressList.item(3);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("class");
    streetAttr.value = "Y&ent1;";

    value = streetAttr.value;

    assert.equal(value, "Y&ent1;", "value");
    value = streetAttr.nodeValue;

    assert.equal(value, "Y&ent1;", "nodeValue");
  });

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
  specify("hc_attrcreatetextnode2", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let value;

    doc = hc_staff.hc_staff();
    addressList = doc.getElementsByTagName("acronym");
    testNode = addressList.item(3);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("class");
    streetAttr.nodeValue = "Y&ent1;";

    value = streetAttr.value;

    assert.equal(value, "Y&ent1;", "value");
    value = streetAttr.nodeValue;

    assert.equal(value, "Y&ent1;", "nodeValue");
  });

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
  specify("hc_attreffectivevalue", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let domesticAttr;
    let value;

    doc = hc_staff.hc_staff();
    addressList = doc.getElementsByTagName("acronym");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("title");
    value = domesticAttr.nodeValue;

    assert.equal(value, "Yes", "attrEffectiveValueAssert");
  });

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
  specify("hc_attrname", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let strong1;
    let strong2;

    doc = hc_staff.hc_staff();
    addressList = doc.getElementsByTagName("acronym");
    testNode = addressList.item(1);
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("class");
    strong1 = streetAttr.name;

    strong2 = streetAttr.name;

    assert.equal(strong1, "class", "attribute nodeName");
    assert.equal(strong2, "class", "attribute name");
  });

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
  specify("hc_attrspecifiedvalue", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let domesticAttr;
    let state;

    doc = hc_staff.hc_staff();
    addressList = doc.getElementsByTagName("acronym");
    testNode = addressList.item(0);
    attributes = testNode.attributes;

    domesticAttr = attributes.getNamedItem("title");
    state = domesticAttr.specified;

    assert.ok(state, "acronymTitleSpecified");
  });

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
  specify("hc_attrspecifiedvaluechanged", () => {
    let success;
    let doc;
    let addressList;
    let testNode;
    let attributes;
    let streetAttr;
    let state;

    doc = hc_staff.hc_staff();
    addressList = doc.getElementsByTagName("acronym");
    testNode = addressList.item(2);
    testNode.setAttribute("class", "Yα");
    attributes = testNode.attributes;

    streetAttr = attributes.getNamedItem("class");
    state = streetAttr.specified;

    assert.ok(state, "acronymClassSpecified");
  });

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
  specify("hc_characterdataappenddata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childValue;
    let childLength;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.appendData(", Esquire");
    childValue = child.data;

    childLength = childValue.length;
    assert.equal(childLength, 24, "characterdataAppendDataAssert");
  });

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
  specify("hc_characterdataappenddatagetdata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.appendData(", Esquire");
    childData = child.data;

    assert.equal(childData, "Margaret Martin, Esquire", "characterdataAppendDataGetDataAssert");
  });

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
  specify("hc_characterdatadeletedatabegining", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(0, 16);
    childData = child.data;

    assert.equal(childData, "Dallas, Texas 98551", "data");
  });

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
  specify("hc_characterdatadeletedataend", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(30, 5);
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Dallas, Texas ", "characterdataDeleteDataEndAssert");
  });

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
  specify("hc_characterdatadeletedataexceedslength", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(4, 50);
    childData = child.data;

    assert.equal(childData, "1230", "characterdataDeleteDataExceedsLengthAssert");
  });

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
  specify("hc_characterdatadeletedatagetlengthanddata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;
    let childLength;
    let result = new Array();


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(30, 5);
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Dallas, Texas ", "data");
    childLength = child.length;

    assert.equal(childLength, 30, "length");
  });

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
  specify("hc_characterdatadeletedatamiddle", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.deleteData(16, 8);
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Texas 98551", "characterdataDeleteDataMiddleAssert");
  });

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
  specify("hc_characterdatagetdata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    childData = child.data;

    assert.equal(childData, "Margaret Martin", "characterdataGetDataAssert");
  });

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
  specify("hc_characterdatagetlength", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childValue;
    let childLength;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    childValue = child.data;

    childLength = childValue.length;
    assert.equal(childLength, 15, "characterdataGetLengthAssert");
  });

  /**
   *
   The "deleteData(offset,count)" method works if the specified count
   is negative.

   Retrieve the character data of the last child of the
   first employee and invoke its "deleteData(offset,count)"
   method with offset=10 and count=-3.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("hc_characterdataindexsizeerrdeletedatacountnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childSubstring;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    childSubstring = child.substringData(10, -3);

    assert.equal(childSubstring, " Ave. Dallas, Texas 98551");
  });

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
  specify("hc_characterdataindexsizeerrdeletedataoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(40, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_characterdataindexsizeerrdeletedataoffsetnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(-5, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_characterdataindexsizeerrinsertdataoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(40, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_characterdataindexsizeerrinsertdataoffsetnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.replaceData(-5, 3, "ABC");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

  /**
   *
   The "replaceData(offset,count,arg)" method works if the specified count
   is negative.

   Retrieve the character data of the last child of the
   first employee and invoke its
   "replaceData(offset,count,arg) method with offset=10
   and count=-3 and arg="ABC".

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("hc_characterdataindexsizeerrreplacedatacountnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let badString;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    badString = child.substringData(10, -3);

    assert.equal(badString, " Ave. Dallas, Texas 98551");
  });

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
  specify("hc_characterdataindexsizeerrreplacedataoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.deleteData(40, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_characterdataindexsizeerrreplacedataoffsetnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        child.replaceData(-5, 3, "ABC");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

  /**
   *
   The "substringData(offset,count)" method works if the specified count
   is negative.

   Retrieve the character data of the last child of the
   first employee and invoke its "substringData(offset,count)
   method with offset=10 and count=-3.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INDEX_SIZE_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6531BCCF
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-6531BCCF')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INDEX_SIZE_ERR'])
   */
  specify("hc_characterdataindexsizeerrsubstringcountnegative", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let badSubstring;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    badSubstring = child.substringData(10, -3);

    assert.equal(badSubstring, " Ave. Dallas, Texas 98551");
  });

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
  specify("hc_characterdataindexsizeerrsubstringnegativeoffset", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let badString;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        badString = child.substringData(-5, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_characterdataindexsizeerrsubstringoffsetgreater", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let badString;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;


    {
      success = false;
      try {
        badString = child.substringData(40, 3);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_characterdatainsertdatabeginning", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(0, "Mss. ");
    childData = child.data;

    assert.equal(childData, "Mss. Margaret Martin", "characterdataInsertDataBeginningAssert");
  });

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
  specify("hc_characterdatainsertdataend", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(15, ", Esquire");
    childData = child.data;

    assert.equal(childData, "Margaret Martin, Esquire", "characterdataInsertDataEndAssert");
  });

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
  specify("hc_characterdatainsertdatamiddle", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.insertData(9, "Ann ");
    childData = child.data;

    assert.equal(childData, "Margaret Ann Martin", "characterdataInsertDataMiddleAssert");
  });

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
  specify("hc_characterdatareplacedatabegining", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0, 4, "2500");
    childData = child.data;

    assert.equal(childData, "2500 North Ave. Dallas, Texas 98551", "characterdataReplaceDataBeginingAssert");
  });

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
  specify("hc_characterdatareplacedataend", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(30, 5, "98665");
    childData = child.data;

    assert.equal(childData, "1230 North Ave. Dallas, Texas 98665", "characterdataReplaceDataEndAssert");
  });

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
  specify("hc_characterdatareplacedataexceedslengthofarg", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0, 4, "260030");
    childData = child.data;

    assert.equal(
      childData,
      "260030 North Ave. Dallas, Texas 98551",
      "characterdataReplaceDataExceedsLengthOfArgAssert"
    );
  });

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
  specify("hc_characterdatareplacedataexceedslengthofdata", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(0, 50, "2600");
    childData = child.data;

    assert.equal(childData, "2600", "characterdataReplaceDataExceedsLengthOfDataAssert");
  });

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
  specify("hc_characterdatareplacedatamiddle", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.replaceData(5, 5, "South");
    childData = child.data;

    assert.equal(childData, "1230 South Ave. Dallas, Texas 98551", "characterdataReplaceDataMiddleAssert");
  });

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
  specify("hc_characterdatasetnodevalue", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let childData;
    let childValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    child.nodeValue = "Marilyn Martin";

    childData = child.data;

    assert.equal(childData, "Marilyn Martin", "data");
    childValue = child.nodeValue;

    assert.equal(childValue, "Marilyn Martin", "value");
  });

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
  specify("hc_characterdatasubstringexceedsvalue", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let substring;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    substring = child.substringData(9, 10);
    assert.equal(substring, "Martin", "characterdataSubStringExceedsValueAssert");
  });

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
  specify("hc_characterdatasubstringvalue", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let child;
    let substring;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(0);
    child = nameNode.firstChild;

    substring = child.substringData(0, 8);
    assert.equal(substring, "Margaret", "characterdataSubStringValueAssert");
  });

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
  specify("hc_commentgetcomment", () => {
    let doc = hc_staff.hc_staff();
    let elementList = doc.childNodes;
    let commentCount = 0;
    for (let i = 0; i < elementList.length; i++) {
      if (elementList.item(i).nodeType === 8) {
        assert.equal(elementList.item(i).nodeName, "#comment", "nodeName");
        assert.equal(elementList.item(i).nodeValue, " This is comment number 1.", "nodeValue");
        assert.equal(elementList.item(i).attributes, null, "attributes");
        commentCount += 1;
      }
    }
    assert.equal(commentCount, 1, "atMostOneComment");
  });

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
  specify("hc_documentcreateattribute", () => {
    let success;
    let doc;
    let newAttrNode;
    let attrValue;
    let attrName;

    doc = hc_staff.hc_staff();
    newAttrNode = doc.createAttribute("title");
    attrValue = newAttrNode.nodeValue;

    assert.equal(attrValue, "", "value");
    attrName = newAttrNode.name;

    assert.equal(attrName, "title", "attribute name");
  });

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
  specify("hc_documentcreatecomment", () => {
    let success;
    let doc;
    let newCommentNode;
    let newCommentValue;
    let newCommentName;
    let newCommentType;

    doc = hc_staff.hc_staff();
    newCommentNode = doc.createComment("This is a new Comment node");
    newCommentValue = newCommentNode.nodeValue;

    assert.equal(newCommentValue, "This is a new Comment node", "value");
    newCommentName = newCommentNode.nodeName;

    assert.equal(newCommentName, "#comment", "strong");
    newCommentType = newCommentNode.nodeType;

    assert.equal(newCommentType, 8, "type");
  });

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
  specify("hc_documentcreatedocumentfragment", () => {
    let success;
    let doc;
    let newDocFragment;
    let children;
    let length;
    let newDocFragmentName;
    let newDocFragmentType;
    let newDocFragmentValue;

    doc = hc_staff.hc_staff();
    newDocFragment = doc.createDocumentFragment();
    children = newDocFragment.childNodes;

    length = children.length;

    assert.equal(length, 0, "length");
    newDocFragmentName = newDocFragment.nodeName;

    assert.equal(newDocFragmentName, "#document-fragment", "strong");
    newDocFragmentType = newDocFragment.nodeType;

    assert.equal(newDocFragmentType, 11, "type");
    newDocFragmentValue = newDocFragment.nodeValue;

    assert.equal(newDocFragmentValue, null, "value");
  });

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
  specify("hc_documentcreateelement", () => {
    let success;
    let doc;
    let newElement;
    let newElementName;
    let newElementType;
    let newElementValue;

    doc = hc_staff.hc_staff();
    newElement = doc.createElement("acronym");
    newElementName = newElement.nodeName;

    assert.equal(newElementName, "acronym", "element strong");
    newElementType = newElement.nodeType;

    assert.equal(newElementType, 1, "type");
    newElementValue = newElement.nodeValue;

    assert.equal(newElementValue, null, "valueInitiallyNull");
  });

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
  specify("hc_documentcreateelementcasesensitive", () => {
    let success;
    let doc;
    let newElement1;
    let newElement2;
    let attribute1;
    let attribute2;
    let nodeName1;
    let nodeName2;

    doc = hc_staff.hc_staff();
    newElement1 = doc.createElement("ACRONYM");
    newElement2 = doc.createElement("acronym");
    newElement1.setAttribute("lang", "EN");
    newElement2.setAttribute("title", "Dallas");
    attribute1 = newElement1.getAttribute("lang");
    attribute2 = newElement2.getAttribute("title");
    assert.equal(attribute1, "EN", "attrib1");
    assert.equal(attribute2, "Dallas", "attrib2");
    nodeName1 = newElement1.nodeName;

    nodeName2 = newElement2.nodeName;

    assert.equal(nodeName1, "ACRONYM", "element nodeName1");
    assert.equal(nodeName2, "acronym", "element nodeName2");
  });

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
  specify("hc_documentcreatetextnode", () => {
    let success;
    let doc;
    let newTextNode;
    let newTextName;
    let newTextValue;
    let newTextType;

    doc = hc_staff.hc_staff();
    newTextNode = doc.createTextNode("This is a new Text node");
    newTextValue = newTextNode.nodeValue;

    assert.equal(newTextValue, "This is a new Text node", "value");
    newTextName = newTextNode.nodeName;

    assert.equal(newTextName, "#text", "strong");
    newTextType = newTextNode.nodeType;

    assert.equal(newTextType, 3, "type");
  });

  /**
   *
   Access Document.doctype for hc_staff, if not text/html should return DocumentType node.
   HTML implementations may return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
   */
  specify("hc_documentgetdoctype", () => {
    let success;
    let doc;
    let docType;
    let docTypeName;
    let nodeValue;
    let attributes;

    doc = hc_staff.hc_staff();
    docType = doc.doctype;
    assert.notEqual(docType, null, "docTypeNotNull");
    if (docType !== null) {
      docTypeName = docType.name;
      nodeValue = docType.nodeValue;
      assert.equal(nodeValue, null, "nodeValue");
      attributes = docType.attributes;
      assert.equal(attributes, null, "attributes");
    }
  });

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
  specify("hc_documentgetelementsbytagnamelength", () => {
    let success;
    let doc;
    let nameList;

    doc = hc_staff.hc_staff();
    nameList = doc.getElementsByTagName("strong");
    assert.equal(nameList.length, 5, "documentGetElementsByTagNameLengthAssert");
  });

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
  specify("hc_documentgetelementsbytagnamevalue", () => {
    let success;
    let doc;
    let nameList;
    let nameNode;
    let firstChild;
    let childValue;

    doc = hc_staff.hc_staff();
    nameList = doc.getElementsByTagName("strong");
    nameNode = nameList.item(3);
    firstChild = nameNode.firstChild;

    childValue = firstChild.nodeValue;

    assert.equal(childValue, "Jeny Oconnor", "documentGetElementsByTagNameValueAssert");
  });

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
  specify("hc_documentgetimplementation", () => {
    let success;
    let doc;
    let docImpl;
    let xmlstate;
    let htmlstate;

    doc = hc_staff.hc_staff();
    docImpl = doc.implementation;
    xmlstate = docImpl.hasFeature("XML", "1.0");
    htmlstate = docImpl.hasFeature("HTML", "1.0");

    assert.ok(xmlstate, "supports_XML_1.0");
  });

  /**
   *
   Load a document and invoke its
   "getDocumentElement()" method.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-87CD092
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
   */
  specify("hc_documentgetrootnode", () => {
    let success;
    let doc;
    let root;
    let rootName;

    doc = hc_staff.hc_staff();
    root = doc.documentElement;

    rootName = root.nodeName;


    assert.equal(rootName, "html", "element docElemName");
  });

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
  specify("hc_documentinvalidcharacterexceptioncreateattribute", () => {
    let success;
    let doc;
    let createdAttr;

    doc = hc_staff.hc_staff();

    {
      success = false;
      try {
        createdAttr = doc.createAttribute("invalid'Name");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

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
  specify("hc_documentinvalidcharacterexceptioncreateattribute1", () => {
    let success;
    let doc;
    let createdAttr;

    doc = hc_staff.hc_staff();

    {
      success = false;
      try {
        createdAttr = doc.createAttribute("");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

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
  specify("hc_documentinvalidcharacterexceptioncreateelement", () => {
    let success;
    let doc;
    let badElement;

    doc = hc_staff.hc_staff();

    {
      success = false;
      try {
        badElement = doc.createElement("invalid^Name");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

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
  specify("hc_documentinvalidcharacterexceptioncreateelement1", () => {
    let success;
    let doc;
    let badElement;

    doc = hc_staff.hc_staff();

    {
      success = false;
      try {
        badElement = doc.createElement("");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

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
  specify("hc_domimplementationfeaturenoversion", () => {
    let success;
    let doc;
    let domImpl;
    let state;

    doc = hc_staff.hc_staff();
    domImpl = doc.implementation;
    state = domImpl.hasFeature("XML", "");
    assert.ok(state, "hasFeatureBlank");
  });

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
  specify("hc_domimplementationfeaturenull", () => {
    let success;
    let doc;
    let domImpl;
    let state;

    doc = hc_staff.hc_staff();
    domImpl = doc.implementation;
    state = domImpl.hasFeature("XML", null);
    assert.ok(state, "supports_XML_null");
  });

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
  specify("hc_domimplementationfeaturexml", () => {
    let success;
    let doc;
    let domImpl;
    let state;

    doc = hc_staff.hc_staff();
    domImpl = doc.implementation;
    state = domImpl.hasFeature("xml", "1.0");
    assert.ok(state, "supports_xml_1.0");
  });

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
  specify("hc_elementaddnewattribute", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attrValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(4);
    testEmployee.setAttribute("lang", "EN-us");
    attrValue = testEmployee.getAttribute("lang");
    assert.equal(attrValue, "EN-us", "attrValue");
  });

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
  specify("hc_elementassociatedattribute", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let domesticAttr;
    let specified;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(0);
    attributes = testEmployee.attributes;

    domesticAttr = attributes.getNamedItem("title");
    specified = domesticAttr.specified;

    assert.ok(specified, "acronymTitleSpecified");
  });

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
  specify("hc_elementchangeattributevalue", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attrValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(3);
    testEmployee.setAttribute("class", "Neither");
    attrValue = testEmployee.getAttribute("class");
    assert.equal(attrValue, "Neither", "elementChangeAttributeValueAssert");
  });

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
  specify("hc_elementcreatenewattribute", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;
    let newAttribute;
    let oldAttr;
    let districtAttr;
    let attrVal;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(0);
    newAttribute = doc.createAttribute("lang");
    oldAttr = testAddress.setAttributeNode(newAttribute);
    assert.equal(oldAttr, null, "old_attr_doesnt_exist");
    districtAttr = testAddress.getAttributeNode("lang");
    assert.notEqual(districtAttr, null, "new_district_accessible");
    attrVal = testAddress.getAttribute("lang");
    assert.equal(attrVal, "", "attr_value");
  });

  /**
   *
   Retrieve the attribute "title" from the last child
   of the first "p" element and check its node name.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-217A91B8
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=236
   * @see http://lists.w3.org/Archives/Public/www-dom-ts/2003Jun/0011.html
   */
  specify("hc_elementgetattributenode", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let domesticAttr;
    let nodeName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(0);
    domesticAttr = testEmployee.getAttributeNode("title");
    nodeName = domesticAttr.name;

    assert.equal(nodeName, "title", "attribute nodeName");
  });

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
  specify("hc_elementgetattributenodenull", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let domesticAttr;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(0);
    domesticAttr = testEmployee.getAttributeNode("invalidAttribute");
    assert.equal(domesticAttr, null, "elementGetAttributeNodeNullAssert");
  });

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
  specify("hc_elementgetelementempty", () => {
    let success;
    let doc;
    let newAttribute;
    let elementList;
    let testEmployee;
    let domesticAttr;
    let attrValue;

    doc = hc_staff.hc_staff();
    newAttribute = doc.createAttribute("lang");
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(3);
    domesticAttr = testEmployee.setAttributeNode(newAttribute);
    attrValue = testEmployee.getAttribute("lang");
    assert.equal(attrValue, "", "elementGetElementEmptyAssert");
  });

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
  specify("hc_elementgetelementsbytagname", () => {
    let success;
    let doc;
    let elementList;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    assert.equal(elementList.length, 5, "elementGetElementsByTagNameAssert");
  });

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
  specify("hc_elementgetelementsbytagnameaccessnodelist", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let firstC;
    let childName;
    let nodeType;
    let employeeIDNode;
    let employeeID;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    testEmployee = elementList.item(3);
    firstC = testEmployee.firstChild;

    nodeType = firstC.nodeType;


    while (
      (nodeType === 3)
    ) {
      firstC = firstC.nextSibling;

      nodeType = firstC.nodeType;


    }
    childName = firstC.nodeName;

    assert.equal(childName, "em", "element childName");
    employeeIDNode = firstC.firstChild;

    employeeID = employeeIDNode.nodeValue;

    assert.equal(employeeID, "EMP0004", "employeeID");
  });

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
  specify("hc_elementgetelementsbytagnamenomatch", () => {
    let success;
    let doc;
    let elementList;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("noMatch");
    assert.equal(elementList.length, 0, "elementGetElementsByTagNameNoMatchNoMatchAssert");
  });

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
  specify("hc_elementgetelementsbytagnamespecialvalue", () => {
    let success;
    let doc;
    let elementList;
    let lastEmployee;
    let lastempList;
    let child;
    let childName;
    let result = new Array();

    let expectedResult = new Array();
    expectedResult[0] = "em";
    expectedResult[1] = "strong";
    expectedResult[2] = "code";
    expectedResult[3] = "sup";
    expectedResult[4] = "var";
    expectedResult[5] = "acronym";


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    lastEmployee = elementList.item(4);
    lastempList = lastEmployee.getElementsByTagName("*");
    for (let indexN10067 = 0; indexN10067 < lastempList.length; indexN10067++) {
      child = lastempList.item(indexN10067);
      childName = child.nodeName;

      result[result.length] = childName;

    }
    assert.deepEqual(result, expectedResult, "element tagNames");
  });

  /**
   *
   Invoke the "getTagName()" method one the
   root node. The value returned should be "html" or "svg".

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-104682815
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
   */
  specify("hc_elementgettagname", () => {
    let success;
    let doc;
    let root;
    let tagname;

    doc = hc_staff.hc_staff();
    root = doc.documentElement;

    tagname = root.tagName;


    assert.equal(tagname, "html", "element tagname");
  });

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
  specify("hc_elementinuseattributeerr", () => {
    let success;
    let doc;
    let newAttribute;
    let addressElementList;
    let testAddress;
    let newElement;
    let attrAddress;
    let appendedChild;
    let setAttr1;
    let setAttr2;

    doc = hc_staff.hc_staff();
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
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 10);
      }
      assert.ok(success, "throw_INUSE_ATTRIBUTE_ERR");
    }
  });

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
  specify("hc_elementinvalidcharacterexception", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(0);

    {
      success = false;
      try {
        testAddress.setAttribute("invalid'Name", "value");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

  /**
   *
   Calling Element.setAttribute with an empty name will cause an INVALID_CHARACTER_ERR.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-258A00AF')/constant[@name='INVALID_CHARACTER_ERR'])
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68F082
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#xpointer(id('ID-F68F082')/raises/exception[@name='DOMException']/descr/p[substring-before(.,':')='INVALID_CHARACTER_ERR'])
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=525
   */
  specify("hc_elementinvalidcharacterexception1", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(0);

    {
      success = false;
      try {
        testAddress.setAttribute("", "value");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 5);
      }
      assert.ok(success, "throw_INVALID_CHARACTER_ERR");
    }
  });

  /**
   *
   Append a couple of text nodes to the first sup element, normalize the
   document element and check that the element has been normalized.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-162CF083
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=546
   */
  specify("hc_elementnormalize", () => {
    let success;
    let doc;
    let root;
    let elementList;
    let testName;
    let firstChild;
    let childValue;
    let textNode;
    let retNode;

    doc = hc_staff.hc_staff();
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

    assert.equal(childValue, "56,000,000", "elementNormalizeAssert");
  });

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
  specify("hc_elementnotfounderr", () => {
    let success;
    let doc;
    let oldAttribute;
    let addressElementList;
    let testAddress;
    let attrAddress;

    doc = hc_staff.hc_staff();
    addressElementList = doc.getElementsByTagName("acronym");
    testAddress = addressElementList.item(4);
    oldAttribute = doc.createAttribute("title");

    {
      success = false;
      try {
        attrAddress = testAddress.removeAttributeNode(oldAttribute);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("hc_elementremoveattribute", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attrValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(3);
    testEmployee.removeAttribute("class");
    attrValue = testEmployee.getAttribute("class");

    // XXX SUPERSEDED BY DOM4
    //    test.equal(attrValue, "", 'attrValue');
    assert.strictEqual(attrValue, null, "attrValue");
  });

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
  specify("hc_elementremoveattributeaftercreate", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let attributes;
    let districtAttr;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("lang");
    districtAttr = testEmployee.setAttributeNode(newAttribute);
    districtAttr = testEmployee.removeAttributeNode(newAttribute);
    attributes = testEmployee.attributes;

    districtAttr = attributes.getNamedItem("lang");
    assert.equal(districtAttr, null, "removed_item_null");
  });

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
  specify("hc_elementremoveattributenode", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let streetAttr;
    let removedAttr;
    let removedValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(2);
    streetAttr = testEmployee.getAttributeNode("class");
    removedAttr = testEmployee.removeAttributeNode(streetAttr);
    assert.notEqual(removedAttr, null, "removedAttrNotNull");
    removedValue = removedAttr.value;

    assert.equal(removedValue, "No", "elementRemoveAttributeNodeAssert");
  });

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
  specify("hc_elementreplaceattributewithself", () => {
    let doc = hc_staff.hc_staff();
    let testEmployee = doc.getElementsByTagName("acronym").item(2);
    let streetAttr = testEmployee.getAttributeNode("class");
    let replacedAttr = testEmployee.setAttributeNode(streetAttr);
    assert.equal(replacedAttr, streetAttr, "replacedAttr");
  });

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
  specify("hc_elementreplaceexistingattribute", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let strong;
    let setAttr;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("class");
    setAttr = testEmployee.setAttributeNode(newAttribute);
    strong = testEmployee.getAttribute("class");
    assert.equal(strong, "", "replacedValue");
  });

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
  specify("hc_elementreplaceexistingattributegevalue", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let streetAttr;
    let value;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("class");
    streetAttr = testEmployee.setAttributeNode(newAttribute);
    assert.notEqual(streetAttr, null, "previousAttrNotNull");
    value = streetAttr.value;

    assert.equal(value, "No", "previousAttrValue");
  });

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
  specify("hc_elementretrieveattrvalue", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;
    let attrValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(2);
    attrValue = testAddress.getAttribute("class");
    assert.equal(attrValue, "No", "attrValue");
  });

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
  specify("hc_elementretrievetagname", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let strong;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("code");
    testEmployee = elementList.item(1);
    strong = testEmployee.nodeName;

    assert.equal(strong, "code", "element nodename");
    strong = testEmployee.tagName;

    assert.equal(strong, "code", "element tagname");
  });

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
  specify("hc_elementsetattributenodenull", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let newAttribute;
    let districtAttr;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(2);
    newAttribute = doc.createAttribute("lang");
    districtAttr = testEmployee.setAttributeNode(newAttribute);
    assert.equal(districtAttr, null, "elementSetAttributeNodeNullAssert");
  });

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
  specify("hc_namednodemapgetnameditem", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let domesticAttr;
    let attrName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(1);
    attributes = testEmployee.attributes;

    domesticAttr = attributes.getNamedItem("title");
    attrName = domesticAttr.name;

    assert.equal(attrName, "title", "attribute nodeName");
  });

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
  specify("hc_namednodemapinuseattributeerr", () => {
    let success;
    let doc;
    let elementList;
    let firstNode;
    let testNode;
    let attributes;
    let domesticAttr;
    let setAttr;
    let setNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    firstNode = elementList.item(0);
    domesticAttr = doc.createAttribute("title");
    domesticAttr.value = "YÎ?";

    setAttr = firstNode.setAttributeNode(domesticAttr);
    elementList = doc.getElementsByTagName("acronym");
    testNode = elementList.item(2);
    attributes = testNode.attributes;


    {
      success = false;
      try {
        setNode = attributes.setNamedItem(domesticAttr);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 10);
      }
      assert.ok(success, "throw_INUSE_ATTRIBUTE_ERR");
    }
  });

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
  specify("hc_namednodemapnotfounderr", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let removedNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(2);
    attributes = testEmployee.attributes;


    {
      success = false;
      try {
        removedNode = attributes.removeNamedItem("lang");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("hc_namednodemapremovenameditem", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let streetAttr;
    let specified;
    let removedNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(2);
    attributes = testAddress.attributes;

    removedNode = attributes.removeNamedItem("class");
    streetAttr = attributes.getNamedItem("class");
    assert.equal(streetAttr, null, "isnull");
  });

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
  specify("hc_namednodemapreturnattrnode", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let streetAttr;
    let attrName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(1);
    attributes = testEmployee.attributes;

    streetAttr = attributes.getNamedItem("class");
    attrName = streetAttr.name;

    assert.equal(attrName, "class", "attribute nodeName");
    attrName = streetAttr.name;

    assert.equal(attrName, "class", "attribute name");
  });

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
  specify("hc_namednodemapreturnnull", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let districtNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testEmployee = elementList.item(1);
    attributes = testEmployee.attributes;

    districtNode = attributes.getNamedItem("lang");
    assert.equal(districtNode, null, "langAttrNull");
  });

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
  specify("hc_namednodemapsetnameditem", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let districtNode;
    let attrName;
    let setNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(1);
    newAttribute = doc.createAttribute("lang");
    attributes = testAddress.attributes;

    setNode = attributes.setNamedItem(newAttribute);
    districtNode = attributes.getNamedItem("lang");
    attrName = districtNode.name;

    assert.equal(attrName, "lang", "attribute nodeName");
  });

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
  specify("hc_namednodemapsetnameditemreturnvalue", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let newNode;
    let attrValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(2);
    newAttribute = doc.createAttribute("class");
    attributes = testAddress.attributes;

    newNode = attributes.setNamedItem(newAttribute);
    assert.notEqual(newNode, null, "previousAttrNotNull");
    attrValue = newNode.nodeValue;

    assert.equal(attrValue, "No", "previousAttrValue");
  });

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
  specify("hc_namednodemapsetnameditemthatexists", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let districtNode;
    let attrValue;
    let setNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(1);
    newAttribute = doc.createAttribute("class");
    attributes = testAddress.attributes;

    setNode = attributes.setNamedItem(newAttribute);
    districtNode = attributes.getNamedItem("class");
    attrValue = districtNode.nodeValue;

    assert.equal(attrValue, "", "namednodemapSetNamedItemThatExistsAssert");
  });

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
  specify("hc_namednodemapsetnameditemwithnewvalue", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let newNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddress = elementList.item(2);
    newAttribute = doc.createAttribute("lang");
    attributes = testAddress.attributes;

    newNode = attributes.setNamedItem(newAttribute);
    assert.equal(newNode, null, "prevValueNull");
  });

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
  specify("hc_nodeappendchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let createdNode;
    let lchild;
    let childName;
    let appendedChild;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    createdNode = doc.createElement("br");
    appendedChild = employeeNode.appendChild(createdNode);
    lchild = employeeNode.lastChild;

    childName = lchild.nodeName;

    assert.equal(childName, "br", "element nodeName");
  });

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
  specify("hc_nodeappendchildchildexists", () => {
    let success;
    let doc;
    let elementList;
    let childList;
    let childNode;
    let newChild;
    let memberNode;
    let memberName;
    let refreshedActual = new Array();

    let actual = new Array();

    let nodeType;
    let expected = new Array();
    expected[0] = "strong";
    expected[1] = "code";
    expected[2] = "sup";
    expected[3] = "var";
    expected[4] = "acronym";
    expected[5] = "em";

    let appendedChild;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    childNode = elementList.item(1);
    childList = childNode.getElementsByTagName("*");
    newChild = childList.item(0);
    appendedChild = childNode.appendChild(newChild);
    for (let indexN10085 = 0; indexN10085 < childList.length; indexN10085++) {
      memberNode = childList.item(indexN10085);
      memberName = memberNode.nodeName;

      actual[actual.length] = memberName;

    }
    assert.deepEqual(actual, expected, "element liveByTagName");
    childList = childNode.childNodes;

    for (let indexN1009C = 0; indexN1009C < childList.length; indexN1009C++) {
      memberNode = childList.item(indexN1009C);
      nodeType = memberNode.nodeType;


      if (
        (nodeType === 1)
      ) {
        memberName = memberNode.nodeName;

        refreshedActual[refreshedActual.length] = memberName;

      }

    }
    assert.deepEqual(refreshedActual, expected, "element refreshedChildNodes");
  });

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
  specify("hc_nodeappendchilddocfragment", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let newdocFragment;
    let newChild1;
    let newChild2;
    let child;
    let childName;
    let result = new Array();

    let appendedChild;
    let nodeType;
    let expected = new Array();
    expected[0] = "em";
    expected[1] = "strong";
    expected[2] = "code";
    expected[3] = "sup";
    expected[4] = "var";
    expected[5] = "acronym";
    expected[6] = "br";
    expected[7] = "b";


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    newdocFragment = doc.createDocumentFragment();
    newChild1 = doc.createElement("br");
    newChild2 = doc.createElement("b");
    appendedChild = newdocFragment.appendChild(newChild1);
    appendedChild = newdocFragment.appendChild(newChild2);
    appendedChild = employeeNode.appendChild(newdocFragment);

    for (let indexN100A2 = 0; indexN100A2 < childList.length; indexN100A2++) {
      child = childList.item(indexN100A2);
      nodeType = child.nodeType;


      if (
        (nodeType === 1)
      ) {
        childName = child.nodeName;

        result[result.length] = childName;

      }

    }
    assert.deepEqual(result, expected, "element nodeNames");
  });

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
  specify("hc_nodeappendchildgetnodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let newChild;
    let appendNode;
    let childName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    newChild = doc.createElement("br");
    appendNode = employeeNode.appendChild(newChild);
    childName = appendNode.nodeName;

    assert.equal(childName, "br", "element nodeName");
  });

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
  specify("hc_nodeappendchildnodeancestor", () => {
    let success;
    let doc;
    let newChild;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let appendedChild;

    doc = hc_staff.hc_staff();
    newChild = doc.documentElement;

    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);

    {
      success = false;
      try {
        appendedChild = employeeNode.appendChild(newChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 3);
      }
      assert.ok(success, "throw_HIERARCHY_REQUEST_ERR");
    }
  });

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
  specify("hc_nodeattributenodeattribute", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let addrAttr;
    let attrNode;
    let attrList;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddr = elementList.item(0);
    addrAttr = testAddr.attributes;

    attrNode = addrAttr.item(0);
    attrList = attrNode.attributes;

    assert.equal(attrList, null, "nodeAttributeNodeAttributeAssert1");
  });

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
  specify("hc_nodeattributenodename", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let addrAttr;
    let attrName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddr = elementList.item(0);
    addrAttr = testAddr.getAttributeNode("title");
    attrName = addrAttr.name;

    assert.equal(attrName, "title", "attribute nodeName");
  });

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
  specify("hc_nodeattributenodevalue", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let addrAttr;
    let attrValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddr = elementList.item(0);
    addrAttr = testAddr.getAttributeNode("title");
    attrValue = addrAttr.nodeValue;

    assert.equal(attrValue, "Yes", "nodeValue");
  });

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
  specify("hc_nodechildnodes", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childNode;
    let childNodes;
    let nodeType;
    let childName;
    let actual = new Array();

    let expected = new Array();
    expected[0] = "em";
    expected[1] = "strong";
    expected[2] = "code";
    expected[3] = "sup";
    expected[4] = "var";
    expected[5] = "acronym";


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childNodes = employeeNode.childNodes;

    for (let indexN1006C = 0; indexN1006C < childNodes.length; indexN1006C++) {
      childNode = childNodes.item(indexN1006C);
      nodeType = childNode.nodeType;

      childName = childNode.nodeName;


      if (
        (nodeType === 1)
      ) {
        actual[actual.length] = childName;

      } else {
        assert.equal(nodeType, 3, "textNodeType");

      }

    }
    assert.deepEqual(actual, expected, "element elementNames");
  });

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
  specify("hc_nodechildnodesappendchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let createdNode;
    let childNode;
    let childName;
    let childType;
    let textNode;
    let actual = new Array();

    let expected = new Array();
    expected[0] = "em";
    expected[1] = "strong";
    expected[2] = "code";
    expected[3] = "sup";
    expected[4] = "var";
    expected[5] = "acronym";
    expected[6] = "br";


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    createdNode = doc.createElement("br");
    employeeNode = employeeNode.appendChild(createdNode);
    for (let indexN10087 = 0; indexN10087 < childList.length; indexN10087++) {
      childNode = childList.item(indexN10087);
      childName = childNode.nodeName;

      childType = childNode.nodeType;


      if (
        (childType === 1)
      ) {
        actual[actual.length] = childName;

      } else {
        assert.equal(childType, 3, "textNodeType");

      }

    }
    assert.deepEqual(actual, expected, "element childElements");
  });

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
  specify("hc_nodechildnodesempty", () => {
    let success;
    let doc;
    let elementList;
    let childList;
    let employeeNode;
    let textNode;
    let length;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("em");
    employeeNode = elementList.item(1);
    textNode = employeeNode.firstChild;

    childList = textNode.childNodes;

    length = childList.length;

    assert.equal(length, 0, "length_zero");
  });

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
  specify("hc_nodecloneattributescopied", () => {
    let doc = hc_staff.hc_staff();
    let attributes = doc.getElementsByTagName("acronym").item(1).cloneNode(false).attributes;
    let actual = [];
    for (let i = 0; i < attributes.length; i++) {
      actual.push(attributes.item(i).name);
    }
    assert.deepEqual(actual, ["title", "class"], "names");
  });

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
  specify("hc_nodeclonefalsenocopytext", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let childNode;
    let clonedNode;
    let lastChildNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    childNode = childList.item(3);
    clonedNode = childNode.cloneNode(false);
    lastChildNode = clonedNode.lastChild;

    assert.equal(lastChildNode, null, "nodeCloneFalseNoCopyTextAssert1");
  });

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
  specify("hc_nodeclonegetparentnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let clonedNode;
    let parentNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    clonedNode = employeeNode.cloneNode(false);
    parentNode = clonedNode.parentNode;

    assert.equal(parentNode, null, "nodeCloneGetParentNullAssert1");
  });

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
  specify("hc_nodeclonenodefalse", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let clonedNode;
    let cloneName;
    let cloneChildren;
    let length;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    clonedNode = employeeNode.cloneNode(false);
    cloneName = clonedNode.nodeName;

    assert.equal(cloneName, "p", "element strong");
    cloneChildren = clonedNode.childNodes;

    length = cloneChildren.length;

    assert.equal(length, 0, "length");
  });

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
  specify("hc_nodeclonenodetrue", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let clonedNode;
    let clonedList;
    let clonedChild;
    let clonedChildName;
    let origList;
    let origChild;
    let origChildName;
    let result = new Array();

    let expected = new Array();


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    origList = employeeNode.childNodes;

    for (let indexN10065 = 0; indexN10065 < origList.length; indexN10065++) {
      origChild = origList.item(indexN10065);
      origChildName = origChild.nodeName;

      expected[expected.length] = origChildName;

    }
    clonedNode = employeeNode.cloneNode(true);
    clonedList = clonedNode.childNodes;

    for (let indexN1007B = 0; indexN1007B < clonedList.length; indexN1007B++) {
      clonedChild = clonedList.item(indexN1007B);
      clonedChildName = clonedChild.nodeName;

      result[result.length] = clonedChildName;

    }
    assert.deepEqual(result, expected, "clone");
  });

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
  specify("hc_nodeclonetruecopytext", () => {
    let success;
    let doc;
    let elementList;
    let childNode;
    let clonedNode;
    let lastChildNode;
    let childValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("sup");
    childNode = elementList.item(1);
    clonedNode = childNode.cloneNode(true);
    lastChildNode = clonedNode.lastChild;

    childValue = lastChildNode.nodeValue;

    assert.equal(childValue, "35,000", "cloneContainsText");
  });

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
  specify("hc_nodecommentnodeattributes", () => {
    let success;
    let doc;
    let commentNode;
    let nodeList;
    let attrList;
    let nodeType;

    doc = hc_staff.hc_staff();
    nodeList = doc.childNodes;

    for (let indexN10043 = 0; indexN10043 < nodeList.length; indexN10043++) {
      commentNode = nodeList.item(indexN10043);
      nodeType = commentNode.nodeType;


      if (
        (nodeType === 8)
      ) {
        attrList = commentNode.attributes;

        assert.equal(attrList, null, "existingCommentAttributesNull");

      }

    }
    commentNode = doc.createComment("This is a comment");
    attrList = commentNode.attributes;

    assert.equal(attrList, null, "createdCommentAttributesNull");
  });

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
  specify("hc_nodecommentnodename", () => {
    let success;
    let doc;
    let elementList;
    let commentNode;
    let nodeType;
    let commentName;
    let commentNodeName;

    doc = hc_staff.hc_staff();
    elementList = doc.childNodes;

    for (let indexN10044 = 0; indexN10044 < elementList.length; indexN10044++) {
      commentNode = elementList.item(indexN10044);
      nodeType = commentNode.nodeType;


      if (
        (nodeType === 8)
      ) {
        commentNodeName = commentNode.nodeName;

        assert.equal(commentNodeName, "#comment", "existingNodeName");

      }

    }
    commentNode = doc.createComment("This is a comment");
    commentNodeName = commentNode.nodeName;

    assert.equal(commentNodeName, "#comment", "createdNodeName");
  });

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
  specify("hc_nodecommentnodetype", () => {
    let success;
    let doc;
    let testList;
    let commentNode;
    let commentNodeName;
    let nodeType;

    doc = hc_staff.hc_staff();
    testList = doc.childNodes;

    for (let indexN10040 = 0; indexN10040 < testList.length; indexN10040++) {
      commentNode = testList.item(indexN10040);
      commentNodeName = commentNode.nodeName;


      if (
        (commentNodeName === "#comment")
      ) {
        nodeType = commentNode.nodeType;

        assert.equal(nodeType, 8, "existingCommentNodeType");

      }

    }
    commentNode = doc.createComment("This is a comment");
    nodeType = commentNode.nodeType;

    assert.equal(nodeType, 8, "createdCommentNodeType");
  });

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
  specify("hc_nodecommentnodevalue", () => {
    let success;
    let doc;
    let elementList;
    let commentNode;
    let commentName;
    let commentValue;

    doc = hc_staff.hc_staff();
    elementList = doc.childNodes;

    for (let indexN10040 = 0; indexN10040 < elementList.length; indexN10040++) {
      commentNode = elementList.item(indexN10040);
      commentName = commentNode.nodeName;


      if (
        (commentName === "#comment")
      ) {
        commentValue = commentNode.nodeValue;

        assert.equal(commentValue, " This is comment number 1.", "value");

      }

    }
    commentNode = doc.createComment(" This is a comment");
    commentValue = commentNode.nodeValue;

    assert.equal(commentValue, " This is a comment", "createdCommentNodeValue");
  });

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
  specify("hc_nodedocumentfragmentnodename", () => {
    let success;
    let doc;
    let docFragment;
    let documentFragmentName;

    doc = hc_staff.hc_staff();
    docFragment = doc.createDocumentFragment();
    documentFragmentName = docFragment.nodeName;

    assert.equal(documentFragmentName, "#document-fragment", "nodeDocumentFragmentNodeNameAssert1");
  });

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
  specify("hc_nodedocumentfragmentnodetype", () => {
    let success;
    let doc;
    let documentFragmentNode;
    let nodeType;

    doc = hc_staff.hc_staff();
    documentFragmentNode = doc.createDocumentFragment();
    nodeType = documentFragmentNode.nodeType;

    assert.equal(nodeType, 11, "nodeDocumentFragmentNodeTypeAssert1");
  });

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
  specify("hc_nodedocumentfragmentnodevalue", () => {
    let success;
    let doc;
    let docFragment;
    let attrList;
    let value;

    doc = hc_staff.hc_staff();
    docFragment = doc.createDocumentFragment();
    attrList = docFragment.attributes;

    assert.equal(attrList, null, "attributesNull");
    value = docFragment.nodeValue;

    assert.equal(value, null, "initiallyNull");
  });

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
  specify("hc_nodedocumentnodeattribute", () => {
    let success;
    let doc;
    let attrList;

    doc = hc_staff.hc_staff();
    attrList = doc.attributes;

    assert.equal(attrList, null, "doc_attributes_is_null");
  });

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
  specify("hc_nodedocumentnodename", () => {
    let success;
    let doc;
    let documentName;

    doc = hc_staff.hc_staff();
    documentName = doc.nodeName;

    assert.equal(documentName, "#document", "documentNodeName");
  });

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
  specify("hc_nodedocumentnodetype", () => {
    let success;
    let doc;
    let nodeType;

    doc = hc_staff.hc_staff();
    nodeType = doc.nodeType;

    assert.equal(nodeType, 9, "nodeDocumentNodeTypeAssert1");
  });

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
  specify("hc_nodedocumentnodevalue", () => {
    let doc = hc_staff.hc_staff();
    assert.equal(doc.nodeValue, null, "documentNodeValue");
  });

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
  specify("hc_nodeelementnodename", () => {
    let success;
    let doc;
    let elementNode;
    let elementName;

    doc = hc_staff.hc_staff();
    elementNode = doc.documentElement;

    elementName = elementNode.nodeName;


    assert.equal(elementName, "html", "element nodeName");
  });

  /**
   *
   The "getNodeType()" method for an Element Node
   returns the constant value 1.

   Retrieve the root node and invoke the "getNodeType()"
   method.   The method should return 1.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
   */
  specify("hc_nodeelementnodetype", () => {
    let success;
    let doc;
    let rootNode;
    let nodeType;

    doc = hc_staff.hc_staff();
    rootNode = doc.documentElement;

    nodeType = rootNode.nodeType;

    assert.equal(nodeType, 1, "nodeElementNodeTypeAssert1");
  });

  /**
   *
   The string returned by the "getNodeValue()" method for an
   Element Node is null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   */
  specify("hc_nodeelementnodevalue", () => {
    let success;
    let doc;
    let elementNode;
    let elementValue;

    doc = hc_staff.hc_staff();
    elementNode = doc.documentElement;

    elementValue = elementNode.nodeValue;

    assert.equal(elementValue, null, "elementNodeValue");
  });

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
  specify("hc_nodegetfirstchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let fchildNode;
    let childName;
    let nodeType;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    fchildNode = employeeNode.firstChild;

    childName = fchildNode.nodeName;


    if (
      (childName === "#text")
    ) {
      assert.equal(childName, "#text", "firstChild_w_whitespace");

    } else {
      assert.equal(childName, "em", "element firstChild_wo_whitespace");

    }
  });

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
  specify("hc_nodegetfirstchildnull", () => {
    let success;
    let doc;
    let emList;
    let emNode;
    let emText;
    let nullChild;

    doc = hc_staff.hc_staff();
    emList = doc.getElementsByTagName("em");
    emNode = emList.item(0);
    emText = emNode.firstChild;

    nullChild = emText.firstChild;

    assert.equal(nullChild, null, "nullChild");
  });

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
  specify("hc_nodegetlastchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let lchildNode;
    let childName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    lchildNode = employeeNode.lastChild;

    childName = lchildNode.nodeName;

    assert.equal(childName, "#text", "whitespace");
  });

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
  specify("hc_nodegetlastchildnull", () => {
    let success;
    let doc;
    let emList;
    let emNode;
    let emText;
    let nullChild;

    doc = hc_staff.hc_staff();
    emList = doc.getElementsByTagName("em");
    emNode = emList.item(0);
    emText = emNode.firstChild;

    nullChild = emText.lastChild;

    assert.equal(nullChild, null, "nullChild");
  });

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
  specify("hc_nodegetnextsibling", () => {
    let success;
    let doc;
    let elementList;
    let emNode;
    let nsNode;
    let nsName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("em");
    emNode = elementList.item(1);
    nsNode = emNode.nextSibling;

    nsName = nsNode.nodeName;

    assert.equal(nsName, "#text", "whitespace");
  });

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
  specify("hc_nodegetnextsiblingnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let lcNode;
    let nsNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    lcNode = employeeNode.lastChild;

    nsNode = lcNode.nextSibling;

    assert.equal(nsNode, null, "nodeGetNextSiblingNullAssert1");
  });

  /**
   *
   Evaluate Node.ownerDocument on the second "p" element.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#node-ownerDoc
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=251
   */
  specify("hc_nodegetownerdocument", () => {
    let success;
    let doc;
    let elementList;
    let docNode;
    let ownerDocument;
    let docElement;
    let elementName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    docNode = elementList.item(1);
    ownerDocument = docNode.ownerDocument;

    docElement = ownerDocument.documentElement;

    elementName = docElement.nodeName;


    assert.equal(elementName, "html", "element ownerDocElemTagName");
  });

  /**
   *

   The "getOwnerDocument()" method returns null if the target

   node itself is a document.



   Invoke the "getOwnerDocument()" method on the master

   document.   The Document returned should be null.


   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#node-ownerDoc
   */
  specify("hc_nodegetownerdocumentnull", () => {
    let success;
    let doc;
    let ownerDocument;

    doc = hc_staff.hc_staff();
    ownerDocument = doc.ownerDocument;

    assert.equal(ownerDocument, null, "nodeGetOwnerDocumentNullAssert1");
  });

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
  specify("hc_nodegetprevioussibling", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let psNode;
    let psName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(1);
    psNode = nameNode.previousSibling;

    psName = psNode.nodeName;

    assert.equal(psName, "#text", "whitespace");
  });

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
  specify("hc_nodegetprevioussiblingnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let fcNode;
    let psNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(2);
    fcNode = employeeNode.firstChild;

    psNode = fcNode.previousSibling;

    assert.equal(psNode, null, "nodeGetPreviousSiblingNullAssert1");
  });

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
  specify("hc_nodehaschildnodes", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let state;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    state = employeeNode.hasChildNodes();
    assert.ok(state, "nodeHasChildAssert1");
  });

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
  specify("hc_nodehaschildnodesfalse", () => {
    let success;
    let doc;
    let emList;
    let emNode;
    let emText;
    let hasChild;

    doc = hc_staff.hc_staff();
    emList = doc.getElementsByTagName("em");
    emNode = emList.item(0);
    emText = emNode.firstChild;

    hasChild = emText.hasChildNodes();
    assert.equal(hasChild, false, "hasChild");
  });

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
  specify("hc_nodeinsertbefore", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newChild;
    let child;
    let childName;
    let insertedNode;
    let actual = new Array();

    let expected = new Array();
    expected[0] = "em";
    expected[1] = "strong";
    expected[2] = "code";
    expected[3] = "br";
    expected[4] = "sup";
    expected[5] = "var";
    expected[6] = "acronym";

    let nodeType;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("sup");
    refChild = elementList.item(2);
    employeeNode = refChild.parentNode;

    childList = employeeNode.childNodes;

    newChild = doc.createElement("br");
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    for (let indexN10091 = 0; indexN10091 < childList.length; indexN10091++) {
      child = childList.item(indexN10091);
      nodeType = child.nodeType;


      if (
        (nodeType === 1)
      ) {
        childName = child.nodeName;

        actual[actual.length] = childName;

      }

    }
    assert.deepEqual(actual, expected, "element nodeNames");
  });

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
  specify("hc_nodeinsertbeforedocfragment", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newdocFragment;
    let newChild1;
    let newChild2;
    let child;
    let childName;
    let appendedChild;
    let insertedNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    refChild = childList.item(3);
    newdocFragment = doc.createDocumentFragment();
    newChild1 = doc.createElement("br");
    newChild2 = doc.createElement("b");
    appendedChild = newdocFragment.appendChild(newChild1);
    appendedChild = newdocFragment.appendChild(newChild2);
    insertedNode = employeeNode.insertBefore(newdocFragment, refChild);
    child = childList.item(3);
    childName = child.nodeName;

    assert.equal(childName, "br", "element childName3");
    child = childList.item(4);
    childName = child.nodeName;

    assert.equal(childName, "b", "element childName4");
  });

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
  specify("hc_nodeinsertbeforenewchildexists", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newChild;
    let child;
    let childName;
    let insertedNode;
    let expected = new Array();
    expected[0] = "strong";
    expected[1] = "code";
    expected[2] = "sup";
    expected[3] = "var";
    expected[4] = "em";
    expected[5] = "acronym";

    let result = new Array();

    let nodeType;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.getElementsByTagName("*");
    refChild = childList.item(5);
    newChild = childList.item(0);
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    for (let indexN1008C = 0; indexN1008C < childList.length; indexN1008C++) {
      child = childList.item(indexN1008C);
      nodeType = child.nodeType;


      if (
        (nodeType === 1)
      ) {
        childName = child.nodeName;

        result[result.length] = childName;

      }

    }
    assert.deepEqual(result, expected, "element childNames");
  });

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
  specify("hc_nodeinsertbeforenodeancestor", () => {
    let success;
    let doc;
    let newChild;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let insertedNode;

    doc = hc_staff.hc_staff();
    newChild = doc.documentElement;

    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    refChild = childList.item(0);

    {
      success = false;
      try {
        insertedNode = employeeNode.insertBefore(newChild, refChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 3);
      }
      assert.ok(success, "throw_HIERARCHY_REQUEST_ERR");
    }
  });

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
  specify("hc_nodeinsertbeforenodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newChild;
    let insertedNode;
    let childName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    refChild = childList.item(3);
    newChild = doc.createElement("br");
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    childName = insertedNode.nodeName;

    assert.equal(childName, "br", "element nodeName");
  });

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
  specify("hc_nodeinsertbeforerefchildnonexistent", () => {
    let success;
    let doc;
    let refChild;
    let newChild;
    let elementList;
    let elementNode;
    let insertedNode;

    doc = hc_staff.hc_staff();
    newChild = doc.createElement("br");
    refChild = doc.createElement("b");
    elementList = doc.getElementsByTagName("p");
    elementNode = elementList.item(1);

    {
      success = false;
      try {
        insertedNode = elementNode.insertBefore(newChild, refChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

  /**
   * If the "refChild" is the same as the "newChild" then don't do anything.
   */
  specify("hc_nodeinsertbeforerefchildequal", () => {
    let doc = hc_staff.hc_staff();
    let elementList = doc.getElementsByTagName("p");
    let employeeNode = elementList.item(1);
    let childList = employeeNode.childNodes;

    let refChild = childList.item(3);

    employeeNode.insertBefore(refChild, refChild);
  });

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
  specify("hc_nodeinsertbeforerefchildnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild = null;

    let newChild;
    let child;
    let childName;
    let insertedNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    newChild = doc.createElement("br");
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    child = employeeNode.lastChild;

    childName = child.nodeName;

    assert.equal(childName, "br", "element nodeName");
  });

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
  specify("hc_nodelistindexequalzero", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;
    let length;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    length = employeeList.length;

    child = employeeList.item(0);
    childName = child.nodeName;


    if (
      (length === 13)
    ) {
      assert.equal(childName, "#text", "childName_w_whitespace");

    } else {
      assert.equal(childName, "em", "element childName_wo_whitespace");

    }
  });

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
  specify("hc_nodelistindexgetlength", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let length;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    length = employeeList.length;


    if (
      (length === 6)
    ) {
      assert.equal(length, 6, "length_wo_space");

    } else {
      assert.equal(length, 13, "length_w_space");

    }
  });

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
  specify("hc_nodelistindexgetlengthofemptylist", () => {
    let success;
    let doc;
    let emList;
    let emNode;
    let textNode;
    let textList;
    let length;

    doc = hc_staff.hc_staff();
    emList = doc.getElementsByTagName("em");
    emNode = emList.item(2);
    textNode = emNode.firstChild;

    textList = textNode.childNodes;

    length = textList.length;

    assert.equal(length, 0, "length");
  });

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
  specify("hc_nodelistindexnotzero", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    child = employeeList.item(3);
    childName = child.nodeName;


    if (
      (childName === "#text")
    ) {
      assert.equal(childName, "#text", "childName_space");

    } else {
      assert.equal(childName, "strong", "element childName_strong");

    }
  });

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
  specify("hc_nodelistreturnfirstitem", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    child = employeeList.item(0);
    childName = child.nodeName;


    if (
      (childName === "#text")
    ) {
      assert.equal(childName, "#text", "nodeName_w_space");

    } else {
      assert.equal(childName, "em", "element nodeName_wo_space");

    }
  });

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
  specify("hc_nodelistreturnlastitem", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;
    let index;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    index = employeeList.length;

    index -= 1;
    child = employeeList.item(index);
    childName = child.nodeName;


    if (
      (index === 12)
    ) {
      assert.equal(childName, "#text", "lastNodeName_w_whitespace");

    } else {
      assert.equal(childName, "acronym", "element lastNodeName");
      assert.equal(index, 5, "index");

    }
  });

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
  specify("hc_nodelisttraverselist", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;
    let nodeType;
    let result = new Array();

    let expected = new Array();
    expected[0] = "em";
    expected[1] = "strong";
    expected[2] = "code";
    expected[3] = "sup";
    expected[4] = "var";
    expected[5] = "acronym";


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    for (let indexN10073 = 0; indexN10073 < employeeList.length; indexN10073++) {
      child = employeeList.item(indexN10073);
      nodeType = child.nodeType;

      childName = child.nodeName;


      if (
        (nodeType === 1)
      ) {
        result[result.length] = childName;

      } else {
        assert.equal(nodeType, 3, "textNodeType");
        assert.equal(childName, "#text", "textNodeName");

      }

    }
    assert.deepEqual(result, expected, "element nodeNames");
  });

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
  specify("hc_nodeparentnode", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let parentNode;
    let parentName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    parentNode = employeeNode.parentNode;

    parentName = parentNode.nodeName;

    assert.equal(parentName, "body", "element parentNodeName");
  });

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
  specify("hc_nodeparentnodenull", () => {
    let success;
    let doc;
    let createdNode;
    let parentNode;

    doc = hc_staff.hc_staff();
    createdNode = doc.createElement("br");
    parentNode = createdNode.parentNode;

    assert.equal(parentNode, null, "parentNode");
  });

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
  specify("hc_noderemovechild", () => {
    let success;
    let doc;
    let rootNode;
    let childList;
    let childToRemove;
    let removedChild;
    let parentNode;

    doc = hc_staff.hc_staff();
    rootNode = doc.documentElement;

    childList = rootNode.childNodes;

    childToRemove = childList.item(1);
    removedChild = rootNode.removeChild(childToRemove);
    parentNode = removedChild.parentNode;

    assert.equal(parentNode, null, "parentNodeNull");
  });

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
  specify("hc_noderemovechildgetnodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let removedChild;
    let childName;
    let oldName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    oldChild = childList.item(0);
    oldName = oldChild.nodeName;

    removedChild = employeeNode.removeChild(oldChild);
    assert.notEqual(removedChild, null, "notnull");
    childName = removedChild.nodeName;

    assert.equal(childName, oldName, "nodeName");
  });

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
  specify("hc_noderemovechildnode", () => {
    let success;
    let doc;
    let elementList;
    let emList;
    let employeeNode;
    let childList;
    let oldChild;
    let child;
    let childName;
    let length;
    let removedChild;
    let removedName;
    let nodeType;
    let expected = new Array();
    expected[0] = "strong";
    expected[1] = "code";
    expected[2] = "sup";
    expected[3] = "var";
    expected[4] = "acronym";

    let actual = new Array();


    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    emList = employeeNode.getElementsByTagName("em");
    oldChild = emList.item(0);
    removedChild = employeeNode.removeChild(oldChild);
    removedName = removedChild.nodeName;

    assert.equal(removedName, "em", "element removedName");
    for (let indexN10098 = 0; indexN10098 < childList.length; indexN10098++) {
      child = childList.item(indexN10098);
      nodeType = child.nodeType;

      childName = child.nodeName;


      if (
        (nodeType === 1)
      ) {
        actual[actual.length] = childName;

      } else {
        assert.equal(nodeType, 3, "textNodeType");
        assert.equal(childName, "#text", "textNodeName");

      }

    }
    assert.deepEqual(actual, expected, "element childNames");
  });

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
  specify("hc_noderemovechildoldchildnonexistent", () => {
    let success;
    let doc;
    let oldChild;
    let elementList;
    let elementNode;
    let removedChild;

    doc = hc_staff.hc_staff();
    oldChild = doc.createElement("br");
    elementList = doc.getElementsByTagName("p");
    elementNode = elementList.item(1);

    {
      success = false;
      try {
        removedChild = elementNode.removeChild(oldChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("hc_nodereplacechild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let newChild;
    let child;
    let childName;
    let replacedNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    oldChild = childList.item(0);
    newChild = doc.createElement("br");
    replacedNode = employeeNode.replaceChild(newChild, oldChild);
    child = childList.item(0);
    childName = child.nodeName;

    assert.equal(childName, "br", "element nodeName");
  });

  /**
   *
   If the "newChild" is already in the tree, it is first
   removed before the new one is added.

   Retrieve the second "p" and replace "acronym" with its "em".

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-785887307
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=246
   */
  specify("hc_nodereplacechildnewchildexists", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild = null;

    let newChild = null;

    let child;
    let childName;
    let childNode;
    let actual = new Array();

    let expected = new Array();
    expected[0] = "strong";
    expected[1] = "code";
    expected[2] = "sup";
    expected[3] = "var";
    expected[4] = "em";

    let replacedChild;
    let nodeType;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.getElementsByTagName("*");
    newChild = childList.item(0);
    oldChild = childList.item(5);
    replacedChild = employeeNode.replaceChild(newChild, oldChild);
    assert.equal(replacedChild, oldChild, "return_value_same");
    for (let indexN10094 = 0; indexN10094 < childList.length; indexN10094++) {
      childNode = childList.item(indexN10094);
      childName = childNode.nodeName;

      nodeType = childNode.nodeType;


      if (
        (nodeType === 1)
      ) {
        actual[actual.length] = childName;

      } else {
        assert.equal(nodeType, 3, "textNodeType");
        assert.equal(childName, "#text", "textNodeName");

      }

    }
    assert.deepEqual(actual, expected, "element childNames");
  });

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
  specify("hc_nodereplacechildnodeancestor", () => {
    let success;
    let doc;
    let newChild;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let replacedNode;

    doc = hc_staff.hc_staff();
    newChild = doc.documentElement;

    elementList = doc.getElementsByTagName("p");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    oldChild = childList.item(0);

    {
      success = false;
      try {
        replacedNode = employeeNode.replaceChild(newChild, oldChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 3);
      }
      assert.ok(success, "throw_HIERARCHY_REQUEST_ERR");
    }
  });

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
  specify("hc_nodereplacechildnodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let newChild;
    let replacedNode;
    let childName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("p");

    employeeNode = elementList.item(1);
    childList = employeeNode.getElementsByTagName("em");
    oldChild = childList.item(0);
    newChild = doc.createElement("br");
    replacedNode = employeeNode.replaceChild(newChild, oldChild);
    childName = replacedNode.nodeName;

    assert.equal(childName, "em", "element replacedNodeName");
  });

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
  specify("hc_nodereplacechildoldchildnonexistent", () => {
    let success;
    let doc;
    let oldChild;
    let newChild;
    let elementList;
    let elementNode;
    let replacedNode;

    doc = hc_staff.hc_staff();
    newChild = doc.createElement("br");
    oldChild = doc.createElement("b");
    elementList = doc.getElementsByTagName("p");
    elementNode = elementList.item(1);

    {
      success = false;
      try {
        replacedNode = elementNode.replaceChild(newChild, oldChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("hc_nodetextnodeattribute", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let attrList;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    attrList = textNode.attributes;

    assert.equal(attrList, null, "text_attributes_is_null");
  });

  /**
   *
   The string returned by the "getNodeName()" method for a
   Text Node is "#text".

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
   */
  specify("hc_nodetextnodename", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let textName;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    textName = textNode.nodeName;

    assert.equal(textName, "#text", "textNodeName");
  });

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
  specify("hc_nodetextnodetype", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let nodeType;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    nodeType = textNode.nodeType;

    assert.equal(nodeType, 3, "nodeTextNodeTypeAssert1");
  });

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
  specify("hc_nodetextnodevalue", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let textValue;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    textValue = textNode.nodeValue;

    assert.equal(textValue, "1230 North Ave. Dallas, Texas 98551", "textNodeValue");
  });

  /**
   *
   An element is created, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
   */
  specify("hc_nodevalue01", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = hc_staff.hc_staff();
    newNode = doc.createElement("acronym");
    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

  /**
   *
   An comment is created, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
   */
  specify("hc_nodevalue02", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = hc_staff.hc_staff();
    newNode = doc.createComment("This is a new Comment node");
    newValue = newNode.nodeValue;

    assert.equal(newValue, "This is a new Comment node", "initial");
    newNode.nodeValue = "This should have an effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, "This should have an effect", "afterChange");
  });

  /**
   *
   An document type accessed, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
   */
  specify("hc_nodevalue04", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = hc_staff.hc_staff();
    newNode = doc.doctype;

    assert.notEqual(newNode, null, "docTypeNotNull");
    newValue = newNode.nodeValue;
    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";
    newValue = newNode.nodeValue;
    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

  /**
   *
   A document fragment is created, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
   */
  specify("hc_nodevalue05", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = hc_staff.hc_staff();
    newNode = doc.createDocumentFragment();
    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

  /**
   *
   An document is accessed, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
   */
  specify("hc_nodevalue06", () => {
    let success;
    let newNode;
    let newValue;
    newNode = hc_staff.hc_staff();
    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

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
  specify("hc_textindexsizeerrnegativeoffset", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;


    {
      success = false;
      try {
        splitNode = textNode.splitText(-69);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_textindexsizeerroffsetoutofbounds", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;


    {
      success = false;
      try {
        splitNode = textNode.splitText(300);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("hc_textsplittextfour", () => {
    let success;
    let doc;
    let elementList;
    let addressNode;
    let textNode;
    let splitNode;
    let value;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("acronym");
    addressNode = elementList.item(0);
    textNode = addressNode.firstChild;

    splitNode = textNode.splitText(30);
    value = splitNode.nodeValue;

    assert.equal(value, "98551", "textSplitTextFourAssert");
  });

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
  specify("hc_textsplittextone", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;
    let secondPart;
    let value;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;

    splitNode = textNode.splitText(7);
    secondPart = textNode.nextSibling;

    value = secondPart.nodeValue;

    assert.equal(value, "Jones", "textSplitTextOneAssert");
  });

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
  specify("hc_textsplittextthree", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;
    let value;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;

    splitNode = textNode.splitText(6);
    value = splitNode.nodeValue;

    assert.equal(value, " Jones", "textSplitTextThreeAssert");
  });

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
  specify("hc_textsplittexttwo", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;
    let value;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;

    splitNode = textNode.splitText(5);
    value = textNode.nodeValue;

    assert.equal(value, "Roger", "textSplitTextTwoAssert");
  });

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
  specify("hc_textwithnomarkup", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let nodeV;
    let value;

    doc = hc_staff.hc_staff();
    elementList = doc.getElementsByTagName("strong");
    nameNode = elementList.item(2);
    nodeV = nameNode.firstChild;

    value = nodeV.nodeValue;

    assert.equal(value, "Roger\n Jones", "textWithNoMarkupAssert");
  });

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
  specify("namednodemapchildnoderange", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let child;
    let length;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    attributes = testEmployee.attributes;

    length = attributes.length;

    assert.equal(length, 2, "length");
    child = attributes.item(0);
    child = attributes.item(1);
  });

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
  specify("namednodemapgetnameditem", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let domesticAttr;
    let attrName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(1);
    attributes = testEmployee.attributes;

    domesticAttr = attributes.getNamedItem("domestic");
    attrName = domesticAttr.name;

    assert.equal(attrName, "domestic", "namednodemapGetNamedItemAssert");
  });

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
  specify("namednodemapinuseattributeerr", () => {
    let success;
    let doc;
    let elementList;
    let firstNode;
    let testNode;
    let attributes;
    let domesticAttr;
    let setAttr;
    let setNode;

    doc = staff.staff();
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
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 10);
      }
      assert.ok(success, "throw_INUSE_ATTRIBUTE_ERR");
    }
  });

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
  specify("namednodemapnotfounderr", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let removedNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    attributes = testEmployee.attributes;


    {
      success = false;
      try {
        removedNode = attributes.removeNamedItem("district");
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("namednodemapnumberofnodes", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let length;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(2);
    attributes = testEmployee.attributes;

    length = attributes.length;

    assert.equal(length, 2, "length");
  });

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
  specify("namednodemapremovenameditemreturnnodevalue", () => {
    let success;
    let doc;
    let elementList;
    let testAddress;
    let attributes;
    let removedNode;
    let value;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(2);
    attributes = testAddress.attributes;

    removedNode = attributes.removeNamedItem("street");
    value = removedNode.nodeValue;

    assert.equal(value, "No", "namednodemapRemoveNamedItemReturnNodeValueAssert");
  });

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
  specify("namednodemapreturnattrnode", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let streetAttr;
    let attrName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(1);
    attributes = testEmployee.attributes;

    streetAttr = attributes.getNamedItem("street");
    attrName = streetAttr.name;

    assert.equal(attrName, "street", "nodeName");
    attrName = streetAttr.name;

    assert.equal(attrName, "street", "attrName");
  });

  /**
   * Correct value for first attribute of second employee
   */
  specify("namednodemapreturnfirstitem", () => {
    let doc = staff.staff();
    let child = doc.getElementsByTagName("address").item(1).attributes.item(0);
    assert.equal(child.name, "domestic");
  });

  /**
   *
   * Correct value for second attribute of second employee
   */
  specify("namednodemapreturnlastitem", () => {
    let doc = staff.staff();
    let child = doc.getElementsByTagName("address").item(1).attributes.item(1);
    assert.equal(child.name, "street");
  });

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
  specify("namednodemapreturnnull", () => {
    let success;
    let doc;
    let elementList;
    let testEmployee;
    let attributes;
    let districtNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testEmployee = elementList.item(1);
    attributes = testEmployee.attributes;

    districtNode = attributes.getNamedItem("district");
    assert.equal(districtNode, null, "namednodemapReturnNullAssert");
  });

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
  specify("namednodemapsetnameditem", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let districtNode;
    let attrName;
    let setNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(1);
    newAttribute = doc.createAttribute("district");
    attributes = testAddress.attributes;

    setNode = attributes.setNamedItem(newAttribute);
    districtNode = attributes.getNamedItem("district");
    attrName = districtNode.name;

    assert.equal(attrName, "district", "namednodemapSetNamedItemAssert");
  });

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
  specify("namednodemapsetnameditemreturnvalue", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let newNode;
    let attrValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(2);
    newAttribute = doc.createAttribute("street");
    attributes = testAddress.attributes;

    newNode = attributes.setNamedItem(newAttribute);
    attrValue = newNode.nodeValue;

    assert.equal(attrValue, "No", "returnedNodeValue");
  });

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
  specify("namednodemapsetnameditemthatexists", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let districtNode;
    let attrValue;
    let setNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(1);
    newAttribute = doc.createAttribute("street");
    attributes = testAddress.attributes;

    setNode = attributes.setNamedItem(newAttribute);
    districtNode = attributes.getNamedItem("street");
    attrValue = districtNode.nodeValue;

    assert.equal(attrValue, "", "streetValue");
  });

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
  specify("namednodemapsetnameditemwithnewvalue", () => {
    let success;
    let doc;
    let elementList;
    let newAttribute;
    let testAddress;
    let attributes;
    let newNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddress = elementList.item(2);
    newAttribute = doc.createAttribute("district");
    attributes = testAddress.attributes;

    newNode = attributes.setNamedItem(newAttribute);
    assert.equal(newNode, null, "returnedNodeNull");
  });

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
  specify("nodeappendchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let createdNode;
    let lchild;
    let childName;
    let appendedChild;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    createdNode = doc.createElement("newChild");
    appendedChild = employeeNode.appendChild(createdNode);
    lchild = employeeNode.lastChild;

    childName = lchild.nodeName;

    assert.equal(childName, "newChild", "nodeAppendChildAssert1");
  });

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
  specify("nodeappendchildchildexists", () => {
    let success;
    let doc;
    let elementList;
    let childNode;
    let newChild;
    let lchild;
    let fchild;
    let lchildName;
    let fchildName;
    let appendedChild;
    let initialName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    childNode = elementList.item(1);
    newChild = childNode.firstChild;

    initialName = newChild.nodeName;

    appendedChild = childNode.appendChild(newChild);
    fchild = childNode.firstChild;

    fchildName = fchild.nodeName;

    lchild = childNode.lastChild;

    lchildName = lchild.nodeName;


    if (
      (initialName === "employeeId")
    ) {
      assert.equal(fchildName, "name", "assert1_nowhitespace");
      assert.equal(lchildName, "employeeId", "assert2_nowhitespace");

    } else {
      assert.equal(fchildName, "employeeId", "assert1");
      assert.equal(lchildName, "#text", "assert2");

    }
  });

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
  specify("nodeappendchilddocfragment", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let newdocFragment;
    let newChild1;
    let newChild2;
    let newChild3;

    let child;
    let childName;
    let result = new Array();

    let nodeType;
    let appendedChild;
    let expected = new Array();
    expected[0] = "employeeId";
    expected[1] = "name";
    expected[2] = "position";
    expected[3] = "salary";
    expected[4] = "gender";
    expected[5] = "address";
    expected[6] = "newChild1";
    expected[7] = "newChild2";
    expected[8] = "newChild3";


    doc = staff.staff();
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

    for (let indexN1009F = 0; indexN1009F < childList.length; indexN1009F++) {
      child = childList.item(indexN1009F);
      nodeType = child.nodeType;


      if (
        (nodeType === 1)
      ) {
        childName = child.nodeName;

        result[result.length] = childName;

      }

    }
    assert.deepEqual(result, expected, "elementNames");
  });

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
  specify("nodeappendchildgetnodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let newChild;
    let appendNode;
    let childName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    newChild = doc.createElement("newChild");
    appendNode = employeeNode.appendChild(newChild);
    childName = appendNode.nodeName;

    assert.equal(childName, "newChild", "nodeAppendChildGetNodeNameAssert1");
  });

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
  specify("nodeappendchildnodeancestor", () => {
    let success;
    let doc;
    let newChild;
    let elementList;
    let employeeNode;
    let appendedChild;

    doc = staff.staff();
    newChild = doc.documentElement;

    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);

    {
      success = false;
      try {
        appendedChild = employeeNode.appendChild(newChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 3);
      }
      assert.ok(success, "throw_HIERARCHY_REQUEST_ERR");
    }
  });

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
  specify("nodeattributenodeattribute", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let addrAttr;
    let attrNode;
    let attrList;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(0);
    addrAttr = testAddr.attributes;

    attrNode = addrAttr.item(0);
    attrList = attrNode.attributes;

    assert.equal(attrList, null, "nodeAttributeNodeAttributeAssert1");
  });

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
  specify("nodeattributenodename", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let addrAttr;
    let attrName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(0);
    addrAttr = testAddr.getAttributeNode("domestic");
    attrName = addrAttr.name;

    assert.equal(attrName, "domestic", "nodeAttributeNodeNameAssert1");
  });

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
  specify("nodeattributenodevalue", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let addrAttr;
    let attrValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(0);
    addrAttr = testAddr.getAttributeNode("domestic");
    attrValue = addrAttr.nodeValue;

    assert.equal(attrValue, "Yes", "nodeAttributeNodeValueAssert1");
  });

  /**
   *
   Collect the element names from Node.childNodes and check against expectations.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
   */
  specify("nodechildnodes", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childNodes;
    let childNode;
    let childType;
    let childName;
    let elementNames = new Array();

    let expectedElementNames = new Array();
    expectedElementNames[0] = "employeeId";
    expectedElementNames[1] = "name";
    expectedElementNames[2] = "position";
    expectedElementNames[3] = "salary";
    expectedElementNames[4] = "gender";
    expectedElementNames[5] = "address";


    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childNodes = employeeNode.childNodes;

    for (let indexN1006C = 0; indexN1006C < childNodes.length; indexN1006C++) {
      childNode = childNodes.item(indexN1006C);
      childType = childNode.nodeType;


      if (
        (childType === 1)
      ) {
        childName = childNode.nodeName;

        elementNames[elementNames.length] = childName;

      }

    }
    assert.deepEqual(elementNames, expectedElementNames, "elementNames");
  });

  /**
   *
   Add an element and check that the previously retrieved childNodes NodeList
   is live.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1451460987
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-184E7107
   */
  specify("nodechildnodesappendchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let createdNode;
    let expectedLength;
    let length;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    expectedLength = childList.length;

    expectedLength += 1;
    createdNode = doc.createElement("text3");
    employeeNode = employeeNode.appendChild(createdNode);
    length = childList.length;

    assert.equal(length, expectedLength, "childNodeLength");
  });

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
  specify("nodechildnodesempty", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let secondCNode;
    let textNode;
    let childNodesList;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    secondCNode = childList.item(1);
    textNode = secondCNode.firstChild;

    childNodesList = textNode.childNodes;

    assert.equal(childNodesList.length, 0, "nodeChildNodesEmptyAssert1");
  });

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
  specify("nodecloneattributescopied", () => {
    let success;
    let doc;
    let elementList;
    let addressNode;
    let clonedNode;
    let attributes;
    let attributeNode;
    let attributeName;
    let result = new Array();

    let expectedResult = new Array();
    expectedResult[0] = "domestic";
    expectedResult[1] = "street";


    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    addressNode = elementList.item(1);
    clonedNode = addressNode.cloneNode(false);
    attributes = clonedNode.attributes;

    for (let indexN10065 = 0; indexN10065 < attributes.length; indexN10065++) {
      attributeNode = attributes.item(indexN10065);
      attributeName = attributeNode.name;

      result[result.length] = attributeName;

    }
    domTestHelper.assertEqualsCollection(assert, result, expectedResult, "nodeCloneAttributesCopiedAssert1");
  });

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
  specify("nodeclonefalsenocopytext", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let childNode;
    let clonedNode;
    let lastChildNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    childNode = childList.item(3);
    clonedNode = childNode.cloneNode(false);
    lastChildNode = clonedNode.lastChild;

    assert.equal(lastChildNode, null, "noTextNodes");
  });

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
  specify("nodeclonegetparentnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let clonedNode;
    let parentNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    clonedNode = employeeNode.cloneNode(false);
    parentNode = clonedNode.parentNode;

    assert.equal(parentNode, null, "nodeCloneGetParentNullAssert1");
  });

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
  specify("nodeclonenodefalse", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let clonedNode;
    let cloneName;
    let cloneChildren;
    let length;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    clonedNode = employeeNode.cloneNode(false);
    cloneName = clonedNode.nodeName;

    assert.equal(cloneName, "employee", "name");
    cloneChildren = clonedNode.childNodes;

    length = cloneChildren.length;

    assert.equal(length, 0, "length");
  });

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
  specify("nodeclonenodetrue", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let clonedNode;
    let clonedList;
    let clonedChild;
    let clonedChildName;
    let length;
    let result = new Array();

    let expectedWhitespace = new Array();
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

    let expectedNoWhitespace = new Array();
    expectedNoWhitespace[0] = "employeeId";
    expectedNoWhitespace[1] = "name";
    expectedNoWhitespace[2] = "position";
    expectedNoWhitespace[3] = "salary";
    expectedNoWhitespace[4] = "gender";
    expectedNoWhitespace[5] = "address";


    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    length = childList.length;

    clonedNode = employeeNode.cloneNode(true);
    clonedList = clonedNode.childNodes;
    for (let indexN100AE = 0; indexN100AE < clonedList.length; indexN100AE++) {
      clonedChild = clonedList.item(indexN100AE);
      clonedChildName = clonedChild.nodeName;

      result[result.length] = clonedChildName;

    }

    if (
      (length === 6)
    ) {
      assert.deepEqual(result, expectedNoWhitespace, "nowhitespace");

    } else {
      assert.deepEqual(result, expectedWhitespace, "whitespace");

    }
  });

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
  specify("nodeclonetruecopytext", () => {
    let success;
    let doc;
    let elementList;
    let childList;
    let childNode;
    let clonedNode;
    let lastChildNode;
    let childValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("salary");
    childNode = elementList.item(1);
    clonedNode = childNode.cloneNode(true);
    lastChildNode = clonedNode.lastChild;

    childValue = lastChildNode.nodeValue;

    assert.equal(childValue, "35,000", "nodeCloneTrueCopyTextAssert1");
  });

  /**
   *
   The "getAttributes()" method invoked on a Comment
   Node returns undefined.

   Find any comment that is an immediate child of the root
   and assert that Node.attributes is undefined.  Then create
   a new comment node (in case they had been omitted) and
   make the assertion.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
   * @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=248
   */
  specify("nodecommentnodeattributes", () => {
    let success;
    let doc;
    let childList;
    let childNode;
    let attrList;
    let nodeType;

    doc = staff.staff();
    childList = doc.childNodes;

    for (let indexN10043 = 0; indexN10043 < childList.length; indexN10043++) {
      childNode = childList.item(indexN10043);
      nodeType = childNode.nodeType;


      if (
        (nodeType === 8)
      ) {
        attrList = childNode.attributes;

        assert.equal(attrList, undefined, "attributesUndefined");

      }

    }
    childNode = doc.createComment("This is a comment");
    attrList = childNode.attributes;

    assert.equal(attrList, undefined, "createdAttributesUndefined");
  });

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
  specify("nodecommentnodename", () => {
    let success;
    let doc;
    let elementList;
    let commentNode;
    let nodeType;
    let commentNodeName;

    doc = staff.staff();
    elementList = doc.childNodes;

    for (let indexN10040 = 0; indexN10040 < elementList.length; indexN10040++) {
      commentNode = elementList.item(indexN10040);
      nodeType = commentNode.nodeType;


      if (
        (nodeType === 8)
      ) {
        commentNodeName = commentNode.nodeName;

        assert.equal(commentNodeName, "#comment", "commentNodeName");

      }

    }
  });

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
  specify("nodecommentnodetype", () => {
    let success;
    let doc;
    let testList;
    let commentNode;
    let commentNodeName;
    let nodeType;

    doc = staff.staff();
    testList = doc.childNodes;

    for (let indexN10040 = 0; indexN10040 < testList.length; indexN10040++) {
      commentNode = testList.item(indexN10040);
      commentNodeName = commentNode.nodeName;


      if (
        (commentNodeName === "#comment")
      ) {
        nodeType = commentNode.nodeType;

        assert.equal(nodeType, 8, "nodeCommentNodeTypeAssert1");

      }

    }
  });

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
  specify("nodecommentnodevalue", () => {
    let success;
    let doc;
    let elementList;
    let commentNode;
    let commentName;
    let commentValue;

    doc = staff.staff();
    elementList = doc.childNodes;

    for (let indexN10040 = 0; indexN10040 < elementList.length; indexN10040++) {
      commentNode = elementList.item(indexN10040);
      commentName = commentNode.nodeName;


      if (
        (commentName === "#comment")
      ) {
        commentValue = commentNode.nodeValue;

        assert.equal(commentValue, " This is comment number 1.", "value");

      }

    }
  });

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
  specify("nodedocumentfragmentnodename", () => {
    let success;
    let doc;
    let docFragment;
    let documentFragmentName;

    doc = staff.staff();
    docFragment = doc.createDocumentFragment();
    documentFragmentName = docFragment.nodeName;

    assert.equal(documentFragmentName, "#document-fragment", "nodeDocumentFragmentNodeNameAssert1");
  });

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
  specify("nodedocumentfragmentnodetype", () => {
    let success;
    let doc;
    let documentFragmentNode;
    let nodeType;

    doc = staff.staff();
    documentFragmentNode = doc.createDocumentFragment();
    nodeType = documentFragmentNode.nodeType;

    assert.equal(nodeType, 11, "nodeDocumentFragmentNodeTypeAssert1");
  });

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
  specify("nodedocumentfragmentnodevalue", () => {
    let success;
    let doc;
    let docFragment;
    let attrList;
    let value;

    doc = staff.staff();
    docFragment = doc.createDocumentFragment();
    attrList = docFragment.attributes;

    assert.equal(attrList, null, "attributesNull");
    value = docFragment.nodeValue;

    assert.equal(value, null, "initiallyNull");
  });

  /**
   *
   The "getAttributes()" method invoked on a Document
   Node returns null.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-84CF096
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
   */
  specify("nodedocumentnodeattribute", () => {
    let success;
    let doc;
    let attrList;

    doc = staff.staff();
    attrList = doc.attributes;

    assert.equal(attrList, null, "documentAttributesNull");
  });

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
  specify("nodedocumentnodename", () => {
    let success;
    let doc;
    let documentName;

    doc = staff.staff();
    documentName = doc.nodeName;

    assert.equal(documentName, "#document", "documentNodeName");
  });

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
  specify("nodedocumentnodetype", () => {
    let success;
    let doc;
    let nodeType;

    doc = staff.staff();
    nodeType = doc.nodeType;

    assert.equal(nodeType, 9, "nodeDocumentNodeTypeAssert1");
  });

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
  specify("nodedocumentnodevalue", () => {
    let success;
    let doc;
    let documentValue;

    doc = staff.staff();
    documentValue = doc.nodeValue;

    assert.equal(documentValue, null, "documentNodeValueNull");
  });

  /**
   *
   Retrieve the DOCTYPE declaration from the XML file and
   check the string returned by the "getNodeName()"
   method.   It should be equal to "staff" or "svg".

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D095
   */
  specify("nodedocumenttypenodename", () => {
    let success;
    let doc;
    let docType;
    let documentTypeName;

    doc = staff.staff();
    docType = doc.doctype;

    assert.notEqual(docType, null, "docTypeNotNull");
    documentTypeName = docType.nodeName;


    assert.equal(documentTypeName, "staff", "documentName");
  });

  /**
   *
   The "getNodeType()" method for a DocumentType Node
   returns the constant value 10.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-111237558
   */
  specify("nodedocumenttypenodetype", () => {
    let success;
    let doc;
    let documentTypeNode;
    let nodeType;

    doc = staff.staff();
    documentTypeNode = doc.doctype;

    assert.notEqual(documentTypeNode, null, "doctypeNotNull");
    nodeType = documentTypeNode.nodeType;

    assert.equal(nodeType, 10, "nodeType");
  });

  /**
   *
   The string returned by the "getNodeValue()" method for a
   DocumentType Node is null.

   * @author NIST
   * @author Mary Brady
   */
  specify("nodedocumenttypenodevalue", () => {
    let success;
    let doc;
    let docType;
    let attrList;

    doc = staff.staff();
    docType = doc.doctype;

    assert.notEqual(docType, null, "docTypeNotNull");
    attrList = docType.attributes;

    assert.equal(attrList, null, "doctypeAttributesNull");
  });

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
  specify("nodeelementnodeattributes", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let addrAttr;
    let attrNode;
    let attrName;
    let attrList = new Array();

    let expected = new Array();
    expected[0] = "domestic";
    expected[1] = "street";


    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(2);
    addrAttr = testAddr.attributes;

    for (let indexN1005C = 0; indexN1005C < addrAttr.length; indexN1005C++) {
      attrNode = addrAttr.item(indexN1005C);
      attrName = attrNode.name;

      attrList[attrList.length] = attrName;

    }
    domTestHelper.assertEqualsCollection(assert, attrList, expected, "nodeElementNodeValueAssert1");
  });

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
  specify("nodeelementnodename", () => {
    let success;
    let doc;
    let elementNode;
    let elementName;

    doc = staff.staff();
    elementNode = doc.documentElement;

    elementName = elementNode.nodeName;


    assert.equal(elementName, "staff", "nodeElementNodeNameAssert1");
  });

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
  specify("nodeelementnodetype", () => {
    let success;
    let doc;
    let rootNode;
    let nodeType;

    doc = staff.staff();
    rootNode = doc.documentElement;

    nodeType = rootNode.nodeType;

    assert.equal(nodeType, 1, "nodeElementNodeTypeAssert1");
  });

  /**
   *
   The string returned by the "getNodeValue()" method for an
   Element Node is null.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   */
  specify("nodeelementnodevalue", () => {
    let success;
    let doc;
    let elementNode;
    let elementValue;

    doc = staff.staff();
    elementNode = doc.documentElement;

    elementValue = elementNode.nodeValue;

    assert.equal(elementValue, null, "elementNodeValueNull");
  });

  /**
   *
   The "getFirstChild()" method returns the first child
   of this node.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-169727388
   */
  specify("nodegetfirstchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let fchildNode;
    let childName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    fchildNode = employeeNode.firstChild;

    childName = fchildNode.nodeName;


    if (
      (childName === "#text")
    ) {
      fchildNode = fchildNode.nextSibling;

      childName = fchildNode.nodeName;


    }
    assert.equal(childName, "employeeId", "nodeName");
  });

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
  specify("nodegetfirstchildnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let secondChildNode;
    let textNode;
    let noChildNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(0);
    employeeList = employeeNode.childNodes;

    secondChildNode = employeeList.item(1);
    textNode = secondChildNode.firstChild;

    noChildNode = textNode.firstChild;

    assert.equal(noChildNode, null, "nodeGetFirstChildNullAssert1");
  });

  /**
   *
   The "getLastChild()" method returns the last child
   of this node.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-61AD09FB
   */
  specify("nodegetlastchild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let lchildNode;
    let childName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    lchildNode = employeeNode.lastChild;

    childName = lchildNode.nodeName;


    if (
      (childName === "#text")
    ) {
      lchildNode = lchildNode.previousSibling;

      childName = lchildNode.nodeName;


    }
    assert.equal(childName, "address", "nodeName");
  });

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
  specify("nodegetlastchildnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let secondChildNode;
    let textNode;
    let noChildNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(0);
    employeeList = employeeNode.childNodes;

    secondChildNode = employeeList.item(1);
    textNode = secondChildNode.firstChild;

    noChildNode = textNode.lastChild;

    assert.equal(noChildNode, null, "nodeGetLastChildNullAssert1");
  });

  /**
   *
   The "getNextSibling()" method returns the node immediately
   following this node.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-6AC54C2F
   */
  specify("nodegetnextsibling", () => {
    let success;
    let doc;
    let elementList;
    let employeeIdNode;
    let nsNode;
    let nsName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employeeId");
    employeeIdNode = elementList.item(1);
    nsNode = employeeIdNode.nextSibling;

    nsName = nsNode.nodeName;


    if (
      (nsName === "#text")
    ) {
      nsNode = nsNode.nextSibling;

      nsName = nsNode.nodeName;


    }
    assert.equal(nsName, "name", "nodeName");
  });

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
  specify("nodegetnextsiblingnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let lcNode;
    let nsNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    lcNode = employeeNode.lastChild;

    nsNode = lcNode.nextSibling;

    assert.equal(nsNode, null, "nodeGetNextSiblingNullAssert1");
  });

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
  specify("nodegetownerdocument", () => {
    let success;
    let doc;
    let elementList;
    let docNode;
    let ownerDocument;
    let docElement;
    let elementName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    docNode = elementList.item(1);
    ownerDocument = docNode.ownerDocument;

    docElement = ownerDocument.documentElement;

    elementName = docElement.nodeName;


    assert.equal(elementName, "staff", "nodeGetOwnerDocumentAssert1");
  });

  /**
   *
   The "getOwnerDocument()" method returns null if the target
   node itself is a document.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#node-ownerDoc
   */
  specify("nodegetownerdocumentnull", () => {
    let success;
    let doc;
    let ownerDocument;

    doc = staff.staff();
    ownerDocument = doc.ownerDocument;

    assert.equal(ownerDocument, null, "documentOwnerDocumentNull");
  });

  /**
   *
   The "getPreviousSibling()" method returns the node
   immediately preceding this node.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-640FB3C8
   */
  specify("nodegetprevioussibling", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let psNode;
    let psName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(1);
    psNode = nameNode.previousSibling;

    psName = psNode.nodeName;


    if (
      (psName === "#text")
    ) {
      psNode = psNode.previousSibling;

      psName = psNode.nodeName;


    }
    assert.equal(psName, "employeeId", "nodeName");
  });

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
  specify("nodegetprevioussiblingnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let fcNode;
    let psNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(2);
    fcNode = employeeNode.firstChild;

    psNode = fcNode.previousSibling;

    assert.equal(psNode, null, "nodeGetPreviousSiblingNullAssert1");
  });

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
  specify("nodehaschildnodes", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let state;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    state = employeeNode.hasChildNodes();
    assert.ok(state, "nodeHasChildAssert1");
  });

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
  specify("nodehaschildnodesfalse", () => {
    let success;
    let doc;
    let elementList;
    let child;
    let employeeIdList;
    let employeeNode;
    let textNode;
    let state;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    child = elementList.item(1);
    employeeIdList = child.childNodes;

    employeeNode = employeeIdList.item(1);
    textNode = employeeNode.firstChild;

    state = textNode.hasChildNodes();
    assert.equal(state, false, "nodeHasChildFalseAssert1");
  });

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
  specify("nodeinsertbefore", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newChild;
    let child;
    let childName;
    let length;
    let insertedNode;
    let actual = new Array();

    let expectedWithWhitespace = new Array();
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

    let expectedWithoutWhitespace = new Array();
    expectedWithoutWhitespace[0] = "employeeId";
    expectedWithoutWhitespace[1] = "name";
    expectedWithoutWhitespace[2] = "position";
    expectedWithoutWhitespace[3] = "newChild";
    expectedWithoutWhitespace[4] = "salary";
    expectedWithoutWhitespace[5] = "gender";
    expectedWithoutWhitespace[6] = "address";

    let expected = new Array();


    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    length = childList.length;


    if (
      (length === 6)
    ) {
      refChild = childList.item(3);
      expected = expectedWithoutWhitespace;

    } else {
      refChild = childList.item(7);
      expected = expectedWithWhitespace;

    }
    newChild = doc.createElement("newChild");
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    for (let indexN100DC = 0; indexN100DC < childList.length; indexN100DC++) {
      child = childList.item(indexN100DC);
      childName = child.nodeName;

      actual[actual.length] = childName;

    }
    assert.deepEqual(actual, expected, "nodeNames");
  });

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
  specify("nodeinsertbeforedocfragment", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newdocFragment;
    let newChild1;
    let newChild2;
    let child;
    let childName;
    let appendedChild;
    let insertedNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    refChild = childList.item(3);
    newdocFragment = doc.createDocumentFragment();
    newChild1 = doc.createElement("newChild1");
    newChild2 = doc.createElement("newChild2");
    appendedChild = newdocFragment.appendChild(newChild1);
    appendedChild = newdocFragment.appendChild(newChild2);
    insertedNode = employeeNode.insertBefore(newdocFragment, refChild);
    child = childList.item(3);
    childName = child.nodeName;

    assert.equal(childName, "newChild1", "childName3");
    child = childList.item(4);
    childName = child.nodeName;

    assert.equal(childName, "newChild2", "childName4");
  });

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
  specify("nodeinsertbeforenewchildexists", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newChild;
    let child;
    let length;
    let childName;
    let insertedNode;
    let expectedWhitespace = new Array();
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

    let expectedNoWhitespace = new Array();
    expectedNoWhitespace[0] = "name";
    expectedNoWhitespace[1] = "position";
    expectedNoWhitespace[2] = "salary";
    expectedNoWhitespace[3] = "gender";
    expectedNoWhitespace[4] = "employeeId";
    expectedNoWhitespace[5] = "address";

    let expected = new Array();

    let result = new Array();


    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    length = childList.length;


    if (
      (length === 6)
    ) {
      expected = expectedNoWhitespace;
      refChild = childList.item(5);
      newChild = childList.item(0);

    } else {
      expected = expectedWhitespace;
      refChild = childList.item(11);
      newChild = childList.item(1);

    }
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    for (let indexN100DD = 0; indexN100DD < childList.length; indexN100DD++) {
      child = childList.item(indexN100DD);
      childName = child.nodeName;

      result[result.length] = childName;

    }
    assert.deepEqual(result, expected, "childNames");
  });

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
  specify("nodeinsertbeforenodeancestor", () => {
    let success;
    let doc;
    let newChild;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let insertedNode;

    doc = staff.staff();
    newChild = doc.documentElement;

    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    refChild = childList.item(0);

    {
      success = false;
      try {
        insertedNode = employeeNode.insertBefore(newChild, refChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 3);
      }
      assert.ok(success, "throw_HIERARCHY_REQUEST_ERR");
    }
  });

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
  specify("nodeinsertbeforenodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild;
    let newChild;
    let insertedNode;
    let childName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    refChild = childList.item(3);
    newChild = doc.createElement("newChild");
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    childName = insertedNode.nodeName;

    assert.equal(childName, "newChild", "nodeInsertBeforeNodeNameAssert1");
  });

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
  specify("nodeinsertbeforerefchildnonexistent", () => {
    let success;
    let doc;
    let refChild;
    let newChild;
    let elementList;
    let elementNode;
    let insertedNode;

    doc = staff.staff();
    newChild = doc.createElement("newChild");
    refChild = doc.createElement("refChild");
    elementList = doc.getElementsByTagName("employee");
    elementNode = elementList.item(1);

    {
      success = false;
      try {
        insertedNode = elementNode.insertBefore(newChild, refChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("nodeinsertbeforerefchildnull", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let refChild = null;

    let newChild;
    let child;
    let childName;
    let insertedNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    newChild = doc.createElement("newChild");
    insertedNode = employeeNode.insertBefore(newChild, refChild);
    child = employeeNode.lastChild;

    childName = child.nodeName;

    assert.equal(childName, "newChild", "nodeInsertBeforeRefChildNullAssert1");
  });

  /**
   *
   Create a list of all the children elements of the third
   employee and access its first child by using an index
   of 0.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
   */
  specify("nodelistindexequalzero", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    child = employeeList.item(0);
    childName = child.nodeName;


    if (
      !(childName === "#text")
    ) {
      assert.equal(childName, "employeeId", "childName");

    }
  });

  /**
   *
   The "getLength()" method returns the number of nodes
   in the list should be 13.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-203510337
   */
  specify("nodelistindexgetlength", () => {
    let doc = staff.staff();
    let employeeList = doc.getElementsByTagName("employee").item(2).childNodes;
    assert.equal(employeeList.length, 13);
  });

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
  specify("nodelistindexgetlengthofemptylist", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let childNode;
    let textNode;
    let textList;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    childNode = employeeList.item(1);
    textNode = childNode.firstChild;

    textList = textNode.childNodes;

    assert.equal(textList.length, 0, "nodelistIndexGetLengthOfEmptyListAssert");
  });

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
  specify("nodelistindexnotzero", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let length;
    let childName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    length = employeeList.length;


    if (
      (length === 6)
    ) {
      child = employeeList.item(1);

    } else {
      child = employeeList.item(3);

    }
    childName = child.nodeName;

    assert.equal(childName, "name", "nodeName");
  });

  /**
   *
   Get the first child of the third employee using NodeList.item(0)
   which will either be a Text node (whitespace) or employeeId element.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
   */
  specify("nodelistreturnfirstitem", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;
    let length;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    child = employeeList.item(0);
    childName = child.nodeName;

    length = employeeList.length;


    if (
      (length === 6)
    ) {
      assert.equal(childName, "employeeId", "firstChildNoWhitespace");

    } else {
      assert.equal(childName, "#text", "firstChildWithWhitespace");

    }
  });

  /**
   *
   Get this last child of the third employee using NodeList.item(NodeList.length - 1)
   and check that it is either a Text element (with whitespace) or an address element.

   * @author NIST
   * @author Mary Brady
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-844377136
   */
  specify("nodelistreturnlastitem", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;
    let length;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    length = employeeList.length;


    if (
      (length === 6)
    ) {
      child = employeeList.item(5);
      childName = child.nodeName;

      assert.equal(childName, "address", "nodeName1");

    } else {
      child = employeeList.item(12);
      childName = child.nodeName;

      assert.equal(childName, "#text", "nodeName2");

    }
  });

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
  specify("nodelisttraverselist", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let employeeList;
    let child;
    let childName;
    let result = new Array();

    let length;
    let expectedWhitespace = new Array();
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

    let expectedNoWhitespace = new Array();
    expectedNoWhitespace[0] = "employeeId";
    expectedNoWhitespace[1] = "name";
    expectedNoWhitespace[2] = "position";
    expectedNoWhitespace[3] = "salary";
    expectedNoWhitespace[4] = "gender";
    expectedNoWhitespace[5] = "address";


    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(2);
    employeeList = employeeNode.childNodes;

    length = employeeList.length;

    for (let indexN100A4 = 0; indexN100A4 < employeeList.length; indexN100A4++) {
      child = employeeList.item(indexN100A4);
      childName = child.nodeName;

      result[result.length] = childName;

    }

    if (
      (length === 6)
    ) {
      assert.deepEqual(result, expectedNoWhitespace, "nowhitespace");

    } else {
      assert.deepEqual(result, expectedWhitespace, "whitespace");

    }
  });

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
  specify("nodeparentnode", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let parentNode;
    let parentName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    parentNode = employeeNode.parentNode;

    parentName = parentNode.nodeName;


    assert.equal(parentName, "staff", "nodeParentNodeAssert1");
  });

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
  specify("nodeparentnodenull", () => {
    let success;
    let doc;
    let createdNode;
    let parentNode;

    doc = staff.staff();
    createdNode = doc.createElement("employee");
    parentNode = createdNode.parentNode;

    assert.equal(parentNode, null, "parentNode");
  });

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
  specify("nodeprocessinginstructionnodeattributes", () => {
    let success;
    let doc;
    let testList;
    let piNode;
    let attrList;

    doc = staff.staff();
    testList = doc.childNodes;

    piNode = testList.item(0);
    attrList = piNode.attributes;

    assert.equal(attrList, null, "nodeProcessingInstructionNodeAttrAssert1");
  });

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
  specify("nodeprocessinginstructionnodename", () => {
    let success;
    let doc;
    let testList;
    let piNode;
    let piName;

    doc = staff.staff();
    testList = doc.childNodes;

    piNode = testList.item(0);
    piName = piNode.nodeName;

    assert.equal(piName, "TEST-STYLE", "nodeProcessingInstructionNodeNameAssert1");
  });

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
  specify("nodeprocessinginstructionnodetype", () => {
    let success;
    let doc;
    let testList;
    let piNode;
    let nodeType;

    doc = staff.staff();
    testList = doc.childNodes;

    piNode = testList.item(0);
    nodeType = piNode.nodeType;

    assert.equal(nodeType, 7, "nodeProcessingInstructionNodeTypeAssert1");
  });

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
  specify("nodeprocessinginstructionnodevalue", () => {
    let success;
    let doc;
    let testList;
    let piNode;
    let piValue;

    doc = staff.staff();
    testList = doc.childNodes;

    piNode = testList.item(0);
    piValue = piNode.nodeValue;

    assert.equal(piValue, "PIDATA", "value");
  });

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
  specify("nodeprocessinginstructionsetnodevalue", () => {
    let success;
    let doc;
    let testList;
    let piNode;
    let piValue;

    doc = staff.staff();
    testList = doc.childNodes;

    piNode = testList.item(0);
    piNode.nodeValue = "Something different";

    piValue = piNode.nodeValue;

    assert.equal(piValue, "Something different", "nodeValue");
    piValue = piNode.data;

    assert.equal(piValue, "Something different", "data");
  });

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
  specify("noderemovechild", () => {
    let success;
    let doc;
    let rootNode;
    let childList;
    let childToRemove;
    let removedChild;
    let parentNode;

    doc = staff.staff();
    rootNode = doc.documentElement;

    childList = rootNode.childNodes;

    childToRemove = childList.item(1);
    removedChild = rootNode.removeChild(childToRemove);
    parentNode = removedChild.parentNode;

    assert.equal(parentNode, null, "nodeRemoveChildAssert1");
  });

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
  specify("noderemovechildgetnodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let removedChild;
    let childName;
    let length;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    length = childList.length;

    oldChild = childList.item(0);
    removedChild = employeeNode.removeChild(oldChild);
    childName = removedChild.nodeName;


    if (
      (length === 6)
    ) {
      assert.equal(childName, "employeeId", "nowhitespace");

    } else {
      assert.equal(childName, "#text", "whitespace");

    }
  });

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
  specify("noderemovechildnode", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let child;
    let childName;
    let length;
    let removedChild;
    let removedName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    oldChild = childList.item(0);
    removedChild = employeeNode.removeChild(oldChild);
    removedName = removedChild.nodeName;

    child = childList.item(0);
    childName = child.nodeName;

    length = childList.length;


    if (
      (length === 5)
    ) {
      assert.equal(removedName, "employeeId", "removedNameNoWhitespace");
      assert.equal(childName, "name", "childNameNoWhitespace");

    } else {
      assert.equal(removedName, "#text", "removedName");
      assert.equal(childName, "employeeId", "childName");
      assert.equal(length, 12, "length");

    }
  });

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
  specify("noderemovechildoldchildnonexistent", () => {
    let success;
    let doc;
    let oldChild;
    let elementList;
    let elementNode;
    let removedChild;

    doc = staff.staff();
    oldChild = doc.createElement("oldChild");
    elementList = doc.getElementsByTagName("employee");
    elementNode = elementList.item(1);

    {
      success = false;
      try {
        removedChild = elementNode.removeChild(oldChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("nodereplacechild", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let newChild;
    let child;
    let childName;
    let replacedNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    oldChild = childList.item(0);
    newChild = doc.createElement("newChild");
    replacedNode = employeeNode.replaceChild(newChild, oldChild);
    child = childList.item(0);
    childName = child.nodeName;

    assert.equal(childName, "newChild", "nodeReplaceChildAssert1");
  });

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
  specify("nodereplacechildnewchildexists", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild = null;

    let newChild = null;

    let childName;
    let childNode;
    let length;
    let actual = new Array();

    let expected = new Array();

    let expectedWithoutWhitespace = new Array();
    expectedWithoutWhitespace[0] = "name";
    expectedWithoutWhitespace[1] = "position";
    expectedWithoutWhitespace[2] = "salary";
    expectedWithoutWhitespace[3] = "gender";
    expectedWithoutWhitespace[4] = "employeeId";

    let expectedWithWhitespace = new Array();
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

    let replacedChild;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    length = childList.length;


    if (
      (length === 13)
    ) {
      newChild = childList.item(1);
      oldChild = childList.item(11);
      expected = expectedWithWhitespace;

    } else {
      newChild = childList.item(0);
      oldChild = childList.item(5);
      expected = expectedWithoutWhitespace;

    }

    replacedChild = employeeNode.replaceChild(newChild, oldChild);
    assert.equal(replacedChild, oldChild, "return_value_same");

    for (let indexN100DE = 0; indexN100DE < childList.length; indexN100DE++) {

      childNode = childList.item(indexN100DE);

      childName = childNode.nodeName;
      actual[actual.length] = childName;

    }
    assert.deepEqual(actual, expected, "childNames");
  });

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
  specify("nodereplacechildnodeancestor", () => {
    let success;
    let doc;
    let newChild;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let replacedNode;

    doc = staff.staff();
    newChild = doc.documentElement;

    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    oldChild = childList.item(0);

    {
      success = false;
      try {
        replacedNode = employeeNode.replaceChild(newChild, oldChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 3);
      }
      assert.ok(success, "throw_HIERARCHY_REQUEST_ERR");
    }
  });

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
  specify("nodereplacechildnodename", () => {
    let success;
    let doc;
    let elementList;
    let employeeNode;
    let childList;
    let oldChild;
    let newChild;
    let replacedNode;
    let length;
    let childName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("employee");
    employeeNode = elementList.item(1);
    childList = employeeNode.childNodes;

    length = childList.length;

    oldChild = childList.item(1);
    newChild = doc.createElement("newChild");
    replacedNode = employeeNode.replaceChild(newChild, oldChild);
    childName = replacedNode.nodeName;


    if (
      (length === 6)
    ) {
      assert.equal(childName, "name", "nowhitespace");

    } else {
      assert.equal(childName, "employeeId", "whitespace");

    }
  });

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
  specify("nodereplacechildoldchildnonexistent", () => {
    let success;
    let doc;
    let oldChild;
    let newChild;
    let elementList;
    let elementNode;
    let replacedNode;

    doc = staff.staff();
    newChild = doc.createElement("newChild");
    oldChild = doc.createElement("oldChild");
    elementList = doc.getElementsByTagName("employee");
    elementNode = elementList.item(1);

    {
      success = false;
      try {
        replacedNode = elementNode.replaceChild(newChild, oldChild);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 8);
      }
      assert.ok(success, "throw_NOT_FOUND_ERR");
    }
  });

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
  specify("nodetextnodeattribute", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let attrList;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    attrList = textNode.attributes;

    assert.equal(attrList, null, "nodeTextNodeAttributesAssert1");
  });

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
  specify("nodetextnodename", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let textName;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    textName = textNode.nodeName;

    assert.equal(textName, "#text", "nodeTextNodeNameAssert1");
  });

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
  specify("nodetextnodetype", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let nodeType;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    nodeType = textNode.nodeType;

    assert.equal(nodeType, 3, "nodeTextNodeTypeAssert1");
  });

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
  specify("nodetextnodevalue", () => {
    let success;
    let doc;
    let elementList;
    let testAddr;
    let textNode;
    let textValue;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    testAddr = elementList.item(0);
    textNode = testAddr.firstChild;

    textValue = textNode.nodeValue;

    assert.equal(textValue, "1230 North Ave. Dallas, Texas 98551", "nodeTextNodeValueAssert1");
  });

  /**
   *
   An element is created, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
   */
  specify("nodevalue01", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = staff.staff();
    newNode = doc.createElement("address");
    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

  /**
   *
   An comment is created, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1728279322
   */
  specify("nodevalue02", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = staff.staff();
    newNode = doc.createComment("This is a new Comment node");
    newValue = newNode.nodeValue;

    assert.equal(newValue, "This is a new Comment node", "initial");
    newNode.nodeValue = "This should have an effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, "This should have an effect", "afterChange");
  });

  /**
   *
   An document type accessed, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A31
   */
  specify("nodevalue04", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = staff.staff();
    newNode = doc.doctype;

    assert.notEqual(newNode, null, "docTypeNotNull");
    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

  /**
   *
   A document fragment is created, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-B63ED1A3
   */
  specify("nodevalue05", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = staff.staff();
    newNode = doc.createDocumentFragment();
    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

  /**
   *
   An document is accessed, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#i-Document
   */
  specify("nodevalue06", () => {
    let success;
    let newNode;
    let newValue;
    newNode = staff.staff();
    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "initiallyNull");
    newNode.nodeValue = "This should have no effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, null, "nullAfterAttemptedChange");
  });

  /**
   *
   An processing instruction is created, setNodeValue is called with a non-null argument, but getNodeValue
   should still return null.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-F68D080
   * @see http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core#ID-1004215813
   */
  specify("nodevalue09", () => {
    let success;
    let doc;
    let newNode;
    let newValue;

    doc = staff.staff();
    newNode = doc.createProcessingInstruction("TARGET", "DATA");
    newValue = newNode.nodeValue;

    assert.equal(newValue, "DATA", "initial");
    newNode.nodeValue = "This should have an effect";

    newValue = newNode.nodeValue;

    assert.equal(newValue, "This should have an effect", "after");
  });

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
  specify("processinginstructiongetdata", () => {
    let success;
    let doc;
    let childNodes;
    let piNode;
    let data;

    doc = staff.staff();
    childNodes = doc.childNodes;

    piNode = childNodes.item(0);
    data = piNode.data;

    assert.equal(data, "PIDATA", "processinginstructionGetTargetAssert");
  });

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
  specify("processinginstructiongettarget", () => {
    let success;
    let doc;
    let childNodes;
    let piNode;
    let target;

    doc = staff.staff();
    childNodes = doc.childNodes;

    piNode = childNodes.item(0);
    target = piNode.target;

    assert.equal(target, "TEST-STYLE", "processinginstructionGetTargetAssert");
  });

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
  specify("textindexsizeerrnegativeoffset", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;


    {
      success = false;
      try {
        splitNode = textNode.splitText(-69);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throws_INDEX_SIZE_ERR");
    }
  });

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
  specify("textindexsizeerroffsetoutofbounds", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;


    {
      success = false;
      try {
        splitNode = textNode.splitText(300);
      }
      catch (ex) {
        success = (typeof (ex.code) !== "undefined" && ex.code === 1);
      }
      assert.ok(success, "throw_INDEX_SIZE_ERR");
    }
  });

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
  specify("textsplittextfour", () => {
    let success;
    let doc;
    let elementList;
    let addressNode;
    let textNode;
    let splitNode;
    let value;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("address");
    addressNode = elementList.item(0);
    textNode = addressNode.firstChild;

    splitNode = textNode.splitText(30);
    value = splitNode.nodeValue;

    assert.equal(value, "98551", "textSplitTextFourAssert");
  });

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
  specify("textsplittextone", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;
    let secondPart;
    let value;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;

    splitNode = textNode.splitText(7);
    secondPart = textNode.nextSibling;

    value = secondPart.nodeValue;

    assert.equal(value, "Jones", "textSplitTextOneAssert");
  });

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
  specify("textsplittextthree", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;
    let value;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;

    splitNode = textNode.splitText(6);
    value = splitNode.nodeValue;

    assert.equal(value, " Jones", "textSplitTextThreeAssert");
  });

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
  specify("textsplittexttwo", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let textNode;
    let splitNode;
    let value;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(2);
    textNode = nameNode.firstChild;

    splitNode = textNode.splitText(5);
    value = textNode.nodeValue;

    assert.equal(value, "Roger", "textSplitTextTwoAssert");
  });

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
  specify("textwithnomarkup", () => {
    let success;
    let doc;
    let elementList;
    let nameNode;
    let nodeV;
    let value;

    doc = staff.staff();
    elementList = doc.getElementsByTagName("name");
    nameNode = elementList.item(2);
    nodeV = nameNode.firstChild;

    value = nodeV.nodeValue;

    assert.equal(value, "Roger\n Jones", "textNodeValue");
  });

  /*
    splitText

    Breaks this Text node into two Text nodes at the specified offset, keeping both in
    the tree as siblings. This node then only contains all the content up to the offset
    point. And a new Text node, which is inserted as the next sibling of this node,
    contains all the content at and after the offset point

    This test ensures that the new text node is inserted at the correct location. This
    test does not actually test the splitText offsets and other behavior as that is
    handled in previous tests.

  */
  specify("maintainsplittextlocation", () => {
    let doc;
    let children;
    let firstTextNode;

    doc = extra.extra();
    children = doc.getElementsByTagName("splitTextTest").item(0).childNodes;
    firstTextNode = children.item(0);
    assert.equal(children.length, 2, "Original children count should be 2");
    children.item(0).splitText("5");

    assert.equal(children.length, 3, "After split, the children count should be 3");
    assert.strictEqual(
      children.item(children.length - 1).nodeType,
      doc.ELEMENT_NODE,
      "After split, the last child should be an ELEMENT_NODE"
    );
    assert.strictEqual(
      children.item(0),
      firstTextNode,
      "After split the first child should still be the same object as before"
    );
    assert.strictEqual(children.item(1).nodeType, doc.TEXT_NODE, "After split the second child should be a text node");
  });

  specify("allow_empty_nodelists", () => {
    let doc = extra.extra();
    let element = doc.createElement("test");
    assert.strictEqual(element.children.length, 0);
  });

  specify("creating_text_nodes_with_falsy_values", () => {
    let doc = extra.extra();

    let txt1 = doc.createTextNode(0);
    assert.strictEqual(txt1.nodeValue, "0");

    let txt2 = doc.createTextNode(false);
    assert.strictEqual(txt2.nodeValue, "false");

    let txt3 = doc.createTextNode(null);
    assert.strictEqual(txt3.nodeValue, "null");

    let txt4 = doc.createTextNode(NaN);
    assert.strictEqual(txt4.nodeValue, "NaN");

    let txt5 = doc.createTextNode(undefined);
    assert.strictEqual(txt5.nodeValue, "undefined");

    let txt7 = doc.createTextNode("");
    assert.strictEqual(txt7.nodeValue, "");
  });
});
