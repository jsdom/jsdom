var core =  require("../level1/core").dom.level1.core;

core.INVALID_STATE_ERR        = 11;
core.SYNTAX_ERR               = 12
core.INVALID_MODIFICATION_ERR = 13;
core.NAMESPACE_ERR            = 14;
core.INVALID_ACCESS_ERR       = 15;

core.DOMImplementation.prototype.createDocumentType = function(/* String */ qualifiedName,
                                                              /* String */ publicId, 
                                                              /* String */ systemId)
{
  
};

/**
  Creates an XML Document object of the specified type with its document element. 
  HTML-only DOM implementations do not need to implement this method.
*/
core.DOMImplementation.prototype.createDocument = function(/* String */       namespaceURI,
                                                           /* String */       qualifiedName,
                                                           /* DocumentType */ doctype)
{
  
  
};


core.Element.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                         /* String */ localName)
{
   var queryFunction = function(child) {f
      if (!child) {
        return false;
      }

      if (child.nodeType && 
          child.nodeType === dom.Node.prototype.ENTITY_REFERENCE_NODE) 
      {
        child = child._entity;
      }

      var classString = child.className;
      if (classString) {
        var s = classString.split(" ");
        for (var i=0; i<s.length; i++) {
          if (s[i] === className) {
            return true;
          }
        }
      }
      return false;
    }

    if (this.ownerDocument &&
        this.ownerDocument.implementation &&
        this.ownerDocument.implementation.hasFeature("DisableLiveLists"))
    {
      return dom.mapDOMNodes(this, true, queryFunction);
    } else {
      return new dom.LiveNodeList(this._document, this, queryFunction);
    }
};

/*
// File: dom.idl

#ifndef _DOM_IDL_
#define _DOM_IDL_

#pragma prefix "w3c.org"
module dom
{

  valuetype DOMString sequence<unsigned short>;

  typedef   unsigned long long DOMTimeStamp;

  interface DocumentType;
  interface Document;
  interface NodeList;
  interface NamedNodeMap;
  interface Element;

  exception DOMException {
    unsigned short   code;
  };
  // ExceptionCode
  const unsigned short      INDEX_SIZE_ERR                 = 1;
  const unsigned short      DOMSTRING_SIZE_ERR             = 2;
  const unsigned short      HIERARCHY_REQUEST_ERR          = 3;
  const unsigned short      WRONG_DOCUMENT_ERR             = 4;
  const unsigned short      INVALID_CHARACTER_ERR          = 5;
  const unsigned short      NO_DATA_ALLOWED_ERR            = 6;
  const unsigned short      NO_MODIFICATION_ALLOWED_ERR    = 7;
  const unsigned short      NOT_FOUND_ERR                  = 8;
  const unsigned short      NOT_SUPPORTED_ERR              = 9;
  const unsigned short      INUSE_ATTRIBUTE_ERR            = 10;
  // Introduced in DOM Level 2:
  const unsigned short      INVALID_STATE_ERR              = 11;
  // Introduced in DOM Level 2:
  const unsigned short      SYNTAX_ERR                     = 12;
  // Introduced in DOM Level 2:
  const unsigned short      INVALID_MODIFICATION_ERR       = 13;
  // Introduced in DOM Level 2:
  const unsigned short      NAMESPACE_ERR                  = 14;
  // Introduced in DOM Level 2:
  const unsigned short      INVALID_ACCESS_ERR             = 15;


  interface DOMImplementation {
    boolean            hasFeature(in DOMString feature, 
                                  in DOMString version);
    // Introduced in DOM Level 2:
    DocumentType       createDocumentType(in DOMString qualifiedName, 
                                          in DOMString publicId, 
                                          in DOMString systemId)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Document           createDocument(in DOMString namespaceURI, 
                                      in DOMString qualifiedName, 
                                      in DocumentType doctype)
                                        raises(DOMException);
  };

  interface Node {

    // NodeType
    const unsigned short      ELEMENT_NODE                   = 1;
    const unsigned short      ATTRIBUTE_NODE                 = 2;
    const unsigned short      TEXT_NODE                      = 3;
    const unsigned short      CDATA_SECTION_NODE             = 4;
    const unsigned short      ENTITY_REFERENCE_NODE          = 5;
    const unsigned short      ENTITY_NODE                    = 6;
    const unsigned short      PROCESSING_INSTRUCTION_NODE    = 7;
    const unsigned short      COMMENT_NODE                   = 8;
    const unsigned short      DOCUMENT_NODE                  = 9;
    const unsigned short      DOCUMENT_TYPE_NODE             = 10;
    const unsigned short      DOCUMENT_FRAGMENT_NODE         = 11;
    const unsigned short      NOTATION_NODE                  = 12;

    readonly attribute DOMString        nodeName;
             attribute DOMString        nodeValue;
                                        // raises(DOMException) on setting
                                        // raises(DOMException) on retrieval

    readonly attribute unsigned short   nodeType;
    readonly attribute Node             parentNode;
    readonly attribute NodeList         childNodes;
    readonly attribute Node             firstChild;
    readonly attribute Node             lastChild;
    readonly attribute Node             previousSibling;
    readonly attribute Node             nextSibling;
    readonly attribute NamedNodeMap     attributes;
    // Modified in DOM Level 2:
    readonly attribute Document         ownerDocument;
    Node               insertBefore(in Node newChild, 
                                    in Node refChild)
                                        raises(DOMException);
    Node               replaceChild(in Node newChild, 
                                    in Node oldChild)
                                        raises(DOMException);
    Node               removeChild(in Node oldChild)
                                        raises(DOMException);
    Node               appendChild(in Node newChild)
                                        raises(DOMException);
    boolean            hasChildNodes();
    Node               cloneNode(in boolean deep);
    // Modified in DOM Level 2:
    void               normalize();
    // Introduced in DOM Level 2:
    boolean            isSupported(in DOMString feature, 
                                   in DOMString version);
    // Introduced in DOM Level 2:
    readonly attribute DOMString        namespaceURI;
    // Introduced in DOM Level 2:
             attribute DOMString        prefix;
                                        // raises(DOMException) on setting

    // Introduced in DOM Level 2:
    readonly attribute DOMString        localName;
    // Introduced in DOM Level 2:
    boolean            hasAttributes();
  };

  interface NodeList {
    Node               item(in unsigned long index);
    readonly attribute unsigned long    length;
  };

  interface NamedNodeMap {
    Node               getNamedItem(in DOMString name);
    Node               setNamedItem(in Node arg)
                                        raises(DOMException);
    Node               removeNamedItem(in DOMString name)
                                        raises(DOMException);
    Node               item(in unsigned long index);
    readonly attribute unsigned long    length;
    // Introduced in DOM Level 2:
    Node               getNamedItemNS(in DOMString namespaceURI, 
                                      in DOMString localName);
    // Introduced in DOM Level 2:
    Node               setNamedItemNS(in Node arg)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Node               removeNamedItemNS(in DOMString namespaceURI, 
                                         in DOMString localName)
                                        raises(DOMException);
  };

  interface CharacterData : Node {
             attribute DOMString        data;
                                        // raises(DOMException) on setting
                                        // raises(DOMException) on retrieval

    readonly attribute unsigned long    length;
    DOMString          substringData(in unsigned long offset, 
                                     in unsigned long count)
                                        raises(DOMException);
    void               appendData(in DOMString arg)
                                        raises(DOMException);
    void               insertData(in unsigned long offset, 
                                  in DOMString arg)
                                        raises(DOMException);
    void               deleteData(in unsigned long offset, 
                                  in unsigned long count)
                                        raises(DOMException);
    void               replaceData(in unsigned long offset, 
                                   in unsigned long count, 
                                   in DOMString arg)
                                        raises(DOMException);
  };

  interface Attr : Node {
    readonly attribute DOMString        name;
    readonly attribute boolean          specified;
             attribute DOMString        value;
                                        // raises(DOMException) on setting

    // Introduced in DOM Level 2:
    readonly attribute Element          ownerElement;
  };

  interface Element : Node {
    readonly attribute DOMString        tagName;
    DOMString          getAttribute(in DOMString name);
    void               setAttribute(in DOMString name, 
                                    in DOMString value)
                                        raises(DOMException);
    void               removeAttribute(in DOMString name)
                                        raises(DOMException);
    Attr               getAttributeNode(in DOMString name);
    Attr               setAttributeNode(in Attr newAttr)
                                        raises(DOMException);
    Attr               removeAttributeNode(in Attr oldAttr)
                                        raises(DOMException);
    NodeList           getElementsByTagName(in DOMString name);
    // Introduced in DOM Level 2:
    DOMString          getAttributeNS(in DOMString namespaceURI, 
                                      in DOMString localName);
    // Introduced in DOM Level 2:
    void               setAttributeNS(in DOMString namespaceURI, 
                                      in DOMString qualifiedName, 
                                      in DOMString value)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    void               removeAttributeNS(in DOMString namespaceURI, 
                                         in DOMString localName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Attr               getAttributeNodeNS(in DOMString namespaceURI, 
                                          in DOMString localName);
    // Introduced in DOM Level 2:
    Attr               setAttributeNodeNS(in Attr newAttr)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    NodeList           getElementsByTagNameNS(in DOMString namespaceURI, 
                                              in DOMString localName);
    // Introduced in DOM Level 2:
    boolean            hasAttribute(in DOMString name);
    // Introduced in DOM Level 2:
    boolean            hasAttributeNS(in DOMString namespaceURI, 
                                      in DOMString localName);
  };

  interface Text : CharacterData {
    Text               splitText(in unsigned long offset)
                                        raises(DOMException);
  };

  interface Comment : CharacterData {
  };

  interface CDATASection : Text {
  };

  interface DocumentType : Node {
    readonly attribute DOMString        name;
    readonly attribute NamedNodeMap     entities;
    readonly attribute NamedNodeMap     notations;
    // Introduced in DOM Level 2:
    readonly attribute DOMString        publicId;
    // Introduced in DOM Level 2:
    readonly attribute DOMString        systemId;
    // Introduced in DOM Level 2:
    readonly attribute DOMString        internalSubset;
  };

  interface Notation : Node {
    readonly attribute DOMString        publicId;
    readonly attribute DOMString        systemId;
  };

  interface Entity : Node {
    readonly attribute DOMString        publicId;
    readonly attribute DOMString        systemId;
    readonly attribute DOMString        notationName;
  };

  interface EntityReference : Node {
  };

  interface ProcessingInstruction : Node {
    readonly attribute DOMString        target;
             attribute DOMString        data;
                                        // raises(DOMException) on setting

  };

  interface DocumentFragment : Node {
  };

  interface Document : Node {
    readonly attribute DocumentType     doctype;
    readonly attribute DOMImplementation  implementation;
    readonly attribute Element          documentElement;
    Element            createElement(in DOMString tagName)
                                        raises(DOMException);
    DocumentFragment   createDocumentFragment();
    Text               createTextNode(in DOMString data);
    Comment            createComment(in DOMString data);
    CDATASection       createCDATASection(in DOMString data)
                                        raises(DOMException);
    ProcessingInstruction createProcessingInstruction(in DOMString target, 
                                                      in DOMString data)
                                        raises(DOMException);
    Attr               createAttribute(in DOMString name)
                                        raises(DOMException);
    EntityReference    createEntityReference(in DOMString name)
                                        raises(DOMException);
    NodeList           getElementsByTagName(in DOMString tagname);
    // Introduced in DOM Level 2:
    Node               importNode(in Node importedNode, 
                                  in boolean deep)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Element            createElementNS(in DOMString namespaceURI, 
                                       in DOMString qualifiedName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Attr               createAttributeNS(in DOMString namespaceURI, 
                                         in DOMString qualifiedName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    NodeList           getElementsByTagNameNS(in DOMString namespaceURI, 
                                              in DOMString localName);
    // Introduced in DOM Level 2:
    Element            getElementById(in DOMString elementId);
  };
};

#endif // _DOM_IDL_


*/



exports.dom = 
{
  level2 : {
    core : core
  }
};



