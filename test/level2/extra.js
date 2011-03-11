/* Contains extra test cases for parts of DOM Level 2 that aren't covered by
 * the standard W3C test cases. */
exports.tests = {
  create_empty_document: function () {
    var dom = new DOMImplementation();
    var document = dom.createDocument(null, null, null);
    assertEquals("Document shouldn't contain any nodes",
        0, document.childNodes.length);
  },
  create_document_with_namespaceURI_but_not_qualifiedName: function () {
    var dom = new DOMImplementation();
    assertThrows('createDocument accepted invalid arguments',
        function () {
          dom.createDocument("http://example.org/motorcycle", null, null);
        },
        DOMException, DOMException.NAMESPACE_ERR);
  },
  doctype_ownerDocument: function () {
    var dom = new DOMImplementation();
    var doctype = dom.createDocumentType("bananas");
    var document = dom.createDocument(null, null, doctype);
    assertEquals('Doctype does not belong to the document',
        document, doctype.ownerDocument);
  },
  doctype_child_of_ownerDocument: function () {
    var dom = new DOMImplementation();
    var doctype = dom.createDocumentType("hatstand");
    var document = dom.createDocument(null, null, doctype);
    assertEquals('Doctype is not a child of the document',
        doctype, document.firstChild);
  }
}
