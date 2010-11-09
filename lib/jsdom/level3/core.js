var core = require("../level2/core").dom.level2.core;

/*
  valuetype DOMString sequence<unsigned short>;
  typedef   unsigned long long DOMTimeStamp;
  typedef   any DOMUserData;
  typedef   Object DOMObject;

*/
  // ExceptionCode
  core.VALIDATION_ERR                 = 16;
  core.TYPE_MISMATCH_ERR              = 17;

/*
  // Introduced in DOM Level 3:
  interface DOMStringList {
    DOMString          item(in unsigned long index);
    readonly attribute unsigned long   length;
    boolean            contains(in DOMString str);
  };

  // Introduced in DOM Level 3:
  interface NameList {
    DOMString          getName(in unsigned long index);
    DOMString          getNamespaceURI(in unsigned long index);
    readonly attribute unsigned long   length;
    boolean            contains(in DOMString str);
    boolean            containsNS(in DOMString namespaceURI,
                                  in DOMString name);
  };

  // Introduced in DOM Level 3:
  interface DOMImplementationList {
    DOMImplementation  item(in unsigned long index);
    readonly attribute unsigned long   length;
  };

  // Introduced in DOM Level 3:
  interface DOMImplementationSource {
    DOMImplementation  getDOMImplementation(in DOMString features);
    DOMImplementationList getDOMImplementationList(in DOMString features);
  };

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
    // Introduced in DOM Level 3:
    DOMObject          getFeature(in DOMString feature,
                                  in DOMString version);
  };

  interface Node {
    // Modified in DOM Level 3:
    Node               insertBefore(in Node newChild,
                                    in Node refChild)
                                        raises(DOMException);
    // Modified in DOM Level 3:
    Node               replaceChild(in Node newChild,
                                    in Node oldChild)
                                        raises(DOMException);
    // Modified in DOM Level 3:
    Node               removeChild(in Node oldChild)
                                        raises(DOMException);
    // Modified in DOM Level 3:
    Node               appendChild(in Node newChild)
                                        raises(DOMException);
    boolean            hasChildNodes();
    Node               cloneNode(in boolean deep);
    // Modified in DOM Level 3:
    void               normalize();
    // Introduced in DOM Level 3:
    readonly attribute DOMString       baseURI;
*/

// Compare Document Position
var DOCUMENT_POSITION_DISCONNECTED = core.Node.prototype.DOCUMENT_POSITION_DISCONNECTED = 0x01;
var DOCUMENT_POSITION_PRECEDING    = core.Node.prototype.DOCUMENT_POSITION_PRECEDING    = 0x02;
var DOCUMENT_POSITION_FOLLOWING    = core.Node.prototype.DOCUMENT_POSITION_FOLLOWING    = 0x04;
var DOCUMENT_POSITION_CONTAINS     = core.Node.prototype.DOCUMENT_POSITION_CONTAINS     = 0x08;
var DOCUMENT_POSITION_CONTAINED_BY = core.Node.prototype.DOCUMENT_POSITION_CONTAINED_BY = 0x10;
var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = core.Node.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;

core.Node.prototype.compareDocumentPosition = function compareDocumentPosition( otherNode ) {
  if( !(otherNode instanceof core.Node) ) {
    throw Error("Comparing position against non-Node values is not allowed")
  }
  if( this === otherNode ) return 0
  if( this.ownerDocument !== otherNode.ownerDocument ) {
    return DOCUMENT_POSITION_DISCONNECTED
  }
  var point = this
  var parents = [ ]
  while( point ) {
    if( point == otherNode ) return DOCUMENT_POSITION_CONTAINS
    parents.push( point )
    point = point.parentNode
  }
  point = otherNode
  while( point ) {
    if( point == this ) return DOCUMENT_POSITION_CONTAINED_BY
    var location_index = parents.indexOf( point )
    if( location_index !== -1) {
     var smallest_common_ancestor = parents[ location_index ]
     var this_index = smallest_common_ancestor._childNodes.indexOf( this )
     var other_index = smallest_common_ancestor._childNodes.indexOf( otherNode )
     if( this_index > other_index ) {
           return DOCUMENT_POSITION_PRECEDING
     }
     else {
       return DOCUMENT_POSITION_FOLLOWING
     }
    }
    point = point.parentNode
  }
  return DOCUMENT_POSITION_DISCONNECTED
};
/*
    // Introduced in DOM Level 3:
             attribute DOMString       textContent;
                                        // raises(DOMException) on setting
                                        // raises(DOMException) on retrieval
*/
core.Node.prototype.isSameNode = function(other) {
  return (other === this);
};

/*
    // Introduced in DOM Level 3:
    DOMString          lookupPrefix(in DOMString namespaceURI);
    // Introduced in DOM Level 3:
    boolean            isDefaultNamespace(in DOMString namespaceURI);
    // Introduced in DOM Level 3:
    DOMString          lookupNamespaceURI(in DOMString prefix);
    // Introduced in DOM Level 3:
    boolean            isEqualNode(in Node arg);
    // Introduced in DOM Level 3:
    DOMObject          getFeature(in DOMString feature,
                                  in DOMString version);
    // Introduced in DOM Level 3:
    DOMUserData        setUserData(in DOMString key,
                                   in DOMUserData data,
                                   in UserDataHandler handler);
    // Introduced in DOM Level 3:
    DOMUserData        getUserData(in DOMString key);
  };

  interface NodeList {
    Node               item(in unsigned long index);
    readonly attribute unsigned long   length;
  };

  interface NamedNodeMap {
    Node               getNamedItem(in DOMString name);
    Node               setNamedItem(in Node arg)
                                        raises(DOMException);
    Node               removeNamedItem(in DOMString name)
                                        raises(DOMException);
    Node               item(in unsigned long index);
    readonly attribute unsigned long   length;
    // Introduced in DOM Level 2:
    Node               getNamedItemNS(in DOMString namespaceURI,
                                      in DOMString localName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Node               setNamedItemNS(in Node arg)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Node               removeNamedItemNS(in DOMString namespaceURI,
                                         in DOMString localName)
                                        raises(DOMException);
  };

  interface CharacterData : Node {
             attribute DOMString       data;
                                        // raises(DOMException) on setting
                                        // raises(DOMException) on retrieval

    readonly attribute unsigned long   length;
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
    readonly attribute DOMString       name;
    readonly attribute boolean         specified;
             attribute DOMString       value;
                                        // raises(DOMException) on setting

    // Introduced in DOM Level 2:
    readonly attribute Element         ownerElement;
    // Introduced in DOM Level 3:
    readonly attribute TypeInfo        schemaTypeInfo;

*/
    // Introduced in DOM Level 3:
core.Attr.prototype.__defineGetter__('isId', function() {
  return (this.name.toLowerCase() === 'id');
});
/*
  };

  interface Element : Node {
    readonly attribute DOMString       tagName;
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
                                      in DOMString localName)
                                        raises(DOMException);
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
                                          in DOMString localName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    Attr               setAttributeNodeNS(in Attr newAttr)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    NodeList           getElementsByTagNameNS(in DOMString namespaceURI,
                                              in DOMString localName)
                                        raises(DOMException);
    // Introduced in DOM Level 2:
    boolean            hasAttribute(in DOMString name);
    // Introduced in DOM Level 2:
    boolean            hasAttributeNS(in DOMString namespaceURI,
                                      in DOMString localName)
                                        raises(DOMException);
    // Introduced in DOM Level 3:
    readonly attribute TypeInfo        schemaTypeInfo;
    // Introduced in DOM Level 3:
    void               setIdAttribute(in DOMString name,
                                      in boolean isId)
                                        raises(DOMException);
    // Introduced in DOM Level 3:
    void               setIdAttributeNS(in DOMString namespaceURI,
                                        in DOMString localName,
                                        in boolean isId)
                                        raises(DOMException);
    // Introduced in DOM Level 3:
    void               setIdAttributeNode(in Attr idAttr,
                                          in boolean isId)
                                        raises(DOMException);
  };

  interface Text : CharacterData {
    Text               splitText(in unsigned long offset)
                                        raises(DOMException);
    // Introduced in DOM Level 3:
    readonly attribute boolean         isElementContentWhitespace;
    // Introduced in DOM Level 3:
    readonly attribute DOMString       wholeText;
    // Introduced in DOM Level 3:
    Text               replaceWholeText(in DOMString content)
                                        raises(DOMException);
  };

  interface Comment : CharacterData {
  };

  // Introduced in DOM Level 3:
  interface TypeInfo {
    readonly attribute DOMString       typeName;
    readonly attribute DOMString       typeNamespace;

    // DerivationMethods
    const unsigned long       DERIVATION_RESTRICTION         = 0x00000001;
    const unsigned long       DERIVATION_EXTENSION           = 0x00000002;
    const unsigned long       DERIVATION_UNION               = 0x00000004;
    const unsigned long       DERIVATION_LIST                = 0x00000008;

    boolean            isDerivedFrom(in DOMString typeNamespaceArg,
                                     in DOMString typeNameArg,
                                     in unsigned long derivationMethod);
  };

  // Introduced in DOM Level 3:
  interface UserDataHandler {

    // OperationType
    const unsigned short      NODE_CLONED                    = 1;
    const unsigned short      NODE_IMPORTED                  = 2;
    const unsigned short      NODE_DELETED                   = 3;
    const unsigned short      NODE_RENAMED                   = 4;
    const unsigned short      NODE_ADOPTED                   = 5;

    void               handle(in unsigned short operation,
                              in DOMString key,
                              in DOMUserData data,
                              in Node src,
                              in Node dst);
  };
*/
  // Introduced in DOM Level 3:
core.DOMError = function(severity, message, type, relatedException, relatedData, location) {
  this._severity         = severity;
  this._message          = message;
  this._type             = type;
  this._relatedException = relatedException;
  this._relatedData      = relatedData;
  this._location         = location;
};
core.DOMError.prototype = {};
core.DOMError.prototype.SEVERITY_WARNING     = 1;
core.DOMError.prototype.SEVERITY_ERROR       = 2;
core.DOMError.prototype.SEVERITY_FATAL_ERROR = 3;
core.DOMError.prototype.__defineGetter__('severity', function() {
  return this._severity;
});
core.DOMError.prototype.__defineGetter__('message', function() {
  return this._message;
});
core.DOMError.prototype.__defineGetter__('type', function() {
  return this._type;
});
core.DOMError.prototype.__defineGetter__('relatedException', function() {
  return this._relatedException;
});
core.DOMError.prototype.__defineGetter__('relatedData', function() {
  return this._relatedData;
});
core.DOMError.prototype.__defineGetter__('location', function() {
  return this._location;
});

/*
  // Introduced in DOM Level 3:
  interface DOMErrorHandler {
    boolean            handleError(in DOMError error);
  };

  // Introduced in DOM Level 3:
  interface DOMLocator {
    readonly attribute long            lineNumber;
    readonly attribute long            columnNumber;
    readonly attribute long            byteOffset;
    readonly attribute long            utf16Offset;
    readonly attribute Node            relatedNode;
    readonly attribute DOMString       uri;
  };

  // Introduced in DOM Level 3:
  interface DOMConfiguration {
    void               setParameter(in DOMString name,
                                    in DOMUserData value)
                                        raises(DOMException);
    DOMUserData        getParameter(in DOMString name)
                                        raises(DOMException);
    boolean            canSetParameter(in DOMString name,
                                       in DOMUserData value);
    readonly attribute DOMStringList   parameterNames;
  };

  interface CDATASection : Text {
  };

  interface DocumentType : Node {
    readonly attribute DOMString       name;
    readonly attribute NamedNodeMap    entities;
    readonly attribute NamedNodeMap    notations;
    // Introduced in DOM Level 2:
    readonly attribute DOMString       publicId;
    // Introduced in DOM Level 2:
    readonly attribute DOMString       systemId;
    // Introduced in DOM Level 2:
    readonly attribute DOMString       internalSubset;
  };

  interface Notation : Node {
    readonly attribute DOMString       publicId;
    readonly attribute DOMString       systemId;
  };

  interface Entity : Node {
    readonly attribute DOMString       publicId;
    readonly attribute DOMString       systemId;
    readonly attribute DOMString       notationName;
    // Introduced in DOM Level 3:
    readonly attribute DOMString       inputEncoding;
    // Introduced in DOM Level 3:
    readonly attribute DOMString       xmlEncoding;
    // Introduced in DOM Level 3:
    readonly attribute DOMString       xmlVersion;
  };

  interface EntityReference : Node {
  };

  interface ProcessingInstruction : Node {
    readonly attribute DOMString       target;
             attribute DOMString       data;
                                        // raises(DOMException) on setting

  };

  interface DocumentFragment : Node {
  };

  interface Document : Node {
    // Modified in DOM Level 3:
    readonly attribute DocumentType    doctype;
    readonly attribute DOMImplementation implementation;
    readonly attribute Element         documentElement;
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
    // Introduced in DOM Level 3:
    readonly attribute DOMString       inputEncoding;
    // Introduced in DOM Level 3:
    readonly attribute DOMString       xmlEncoding;
    // Introduced in DOM Level 3:
             attribute boolean         xmlStandalone;
                                        // raises(DOMException) on setting

    // Introduced in DOM Level 3:
             attribute DOMString       xmlVersion;
                                        // raises(DOMException) on setting

    // Introduced in DOM Level 3:
             attribute boolean         strictErrorChecking;
    // Introduced in DOM Level 3:
             attribute DOMString       documentURI;
    // Introduced in DOM Level 3:
    Node               adoptNode(in Node source)
                                        raises(DOMException);
    // Introduced in DOM Level 3:
    readonly attribute DOMConfiguration domConfig;
    // Introduced in DOM Level 3:
    void               normalizeDocument();
    // Introduced in DOM Level 3:
    Node               renameNode(in Node n,
                                  in DOMString namespaceURI,
                                  in DOMString qualifiedName)
                                        raises(DOMException);
  };
};

#endif // _DOM_IDL_
*/

exports.dom = {
  level3 : {
    core: core
  }
};
