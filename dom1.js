/*
  ServerJS Javascript DOM
*/


// Utility methods
function defineConstant(obj, name, exception, value) {
    obj.__defineGetter__(name, function() { return value; });
    obj.__defineSetter__(name, function() {
        throw new exception();
    });
}

function defineReadOnly(obj, name){
	obj.__defineGetter__(name, function(){
		return this[name];
	});
  obj.__defineSetter__(name, function(){
    throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
  });
}



// Helper method for extending one object with another
function extend(base,extension) {
	for ( var member in extension )
	{
		var getter = extension.__lookupGetter__(member), 
            setter = extension.__lookupSetter__(member);
		
		if (getter || setter) 
		{
			if (getter) 
			{
				base.__defineGetter__(member, getter);
			}
			
			if (setter) 
			{
				base.__defineSetter__(member, setter);
			}
		} 
		else 
		{
			base[member] = extension[member];
		}
	}
	return base;
}

// End Utilities



var DOMException = function(code) {
  this.code = code;
};

DOMException.prototype = {
	code : -1
};

// ExceptionCode
var INDEX_SIZE_ERR     = 1;
var DOMSTRING_SIZE_ERR = 2;
var HIERARCHY_REQUEST_ERR = 3;
var WRONG_DOCUMENT_ERR = 4;
var INVALID_CHARACTER_ERR = 5;
var NO_DATA_ALLOWED_ERR = 6;
var NO_MODIFICATION_ALLOWED_ERR = 7;
var NOT_FOUND_ERR      = 8;
var NOT_SUPPORTED_ERR  = 9;
var INUSE_ATTRIBUTE_ERR = 10;

// ExceptionCode
var INDEX_SIZE_ERR     = 1;
var DOMSTRING_SIZE_ERR = 2;
var HIERARCHY_REQUEST_ERR = 3;
var WRONG_DOCUMENT_ERR = 4;
var INVALID_CHARACTER_ERR = 5;
var NO_DATA_ALLOWED_ERR = 6;
var NO_MODIFICATION_ALLOWED_ERR = 7;
var NOT_FOUND_ERR      = 8;
var NOT_SUPPORTED_ERR  = 9;
var INUSE_ATTRIBUTE_ERR = 10;


var constantSetException = function(){
	return new DOMException(NO_MODIFICATION_ALLOWED_ERR);
};


var DOMImplementation = function() {};
DOMImplementation.prototype = {
  hasFeature: function(/* string */ feature, /* string */ version) {}
};

var Node = function () {};
Node.prototype = {

  /* returns Node */ 
  insertBefore :  function(/* Node */ newChild, /* Node*/ refChild){}, // raises(DOMException);

  /* returns Node */
  replaceChild : function(/* Node */ newChild, /* Node */ oldChild){}, //raises(DOMException);

  /* returns Node */
  removeChild : function(/* Node */ oldChild){}, // raises(DOMException);
  
  /* returns Node */
  appendChild : function(/* Node */ newChild){}, // raises(DOMException);
  
  /* returns boolean */
  hasChildNodes : function() {},
  
  /* returns Node */  
  cloneNode : function(/* bool */ deep) {}
};

// Node ReadOnly Properties
defineReadOnly(Node.prototype, 'nodeType');
defineReadOnly(Node.prototype, 'nodeValue');
defineReadOnly(Node.prototype, 'parentNode');
defineReadOnly(Node.prototype, 'childNodes');
defineReadOnly(Node.prototype, 'firstChild');
defineReadOnly(Node.prototype, 'lastChild ');
defineReadOnly(Node.prototype, 'previousSibling');
defineReadOnly(Node.prototype, 'nextSibling');
defineReadOnly(Node.prototype, 'attributes');
defineReadOnly(Node.prototype, 'ownerDocument');

// Node Constants
defineConstant(Node.prototype,'ELEMENT_NODE',constantSetException(), 1);
defineConstant(Node.prototype,'ATTRIBUTE_NODE',constantSetException(), 2);
defineConstant(Node.prototype,'TEXT_NODE',constantSetException(), 3);
defineConstant(Node.prototype,'CDATA_SECTION_NODE',constantSetException(), 4);
defineConstant(Node.prototype,'ENTITY_REFERENCE_NODE',constantSetException(), 5);
defineConstant(Node.prototype,'ENTITY_NODE',constantSetException(), 6);
defineConstant(Node.prototype,'PROCESSING_INSTRUCTION_NODE',constantSetException(), 7);
defineConstant(Node.prototype,'COMMENT_NODE',constantSetException(), 8);
defineConstant(Node.prototype,'DOCUMENT_NODE',constantSetException(), 9);
defineConstant(Node.prototype,'DOCUMENT_TYPE_NODE',constantSetException(), 10);
defineConstant(Node.prototype,'DOCUMENT_FRAGMENT_NODE',constantSetException(), 11);
defineConstant(Node.prototype,'NOTATION_NODE',constantSetException(), 12);


var DocumentFragment = function() {};
DocumentFragment.prototype = extend(new Node(), {
});


var Document = function() {};
Document.prototype = extend(new Node(), {

  /* returns Element */
  createElement: function(/* string */ tagName) {}, //raises: function(DOMException) {},
  
	/* returns DocumentFragment */  
	createDocumentFragment: function() {},
  
	/* returns Text */  
  createTextNode: function(/* string */ data) {},
  
	/* returns Comment */
  createComment: function(/* string */ data) {},
  
  /* returns CDATASection */	
  createCDATASection: function(/* string */ data) {}, // raises: function(DOMException) {},

  /* returns ProcessingInstruction */
  createProcessingInstruction: function(/* string */ target,/* string */ data) {}, // raises: function(DOMException) {},

  /* returns Attr */
  createAttribute: function(/* string */ name) {}, // raises: function(DOMException) {},
  
  /* returns EntityReference */
  createEntityReference: function(/* string */ name) {}, //raises: function(DOMException) {},
  
  /* returns NodeList */
  getElementsByTagName: function(/* string */ tagname) {}
});

// Document ReadOnly Properties
defineReadOnly(Document.prototype, 'doctype');          // DocumentType
defineReadOnly(Document.prototype, 'implementation');   // DOMImplementation
defineReadOnly(Document.prototype, 'documentElement');  // Element


var NodeList = function() {};
NodeList.prototype = extend([], { 
  
	/* returns Node */
	item: function(index) {
		return this[index];
	}
});


var NamedNodeMap = function() {
	this.length = 0;
	
};
NamedNodeMap.prototype = extend([], {
  
	/* returns Node */
	getNamedItem: function(/* string */ name) {},

	/* returns Node */
	setNamedItem: function(/* Node */ arg) {}, // raises: function(DOMException) {},

	/* returns Node */
	removeNamedItem: function(/* string */ name) {}, // raises: function(DOMException) {},

	/* returns Node */
	item: function(/* int */ index) {
		return this[index];
	}
});


var CharacterData = function() {}
  this.data = "";
;
CharacterData.prototype = extend(Node, {

  get data() { return this.data; },
  set data(data) { 
    this.data = data; 
	},
	
	/* returns int */
  get length() { return this.data.length || 0; },
  
	/* returns string */
	substringData: function(/* int */ offset, /* int */ count) {}, // raises: function(DOMException) {},

  /* returns string */
  appendData: function(/* string */ arg) {}, // raises: function(DOMException) {},
  
  /* returns string */	
	insertData: function(/* int */ offset, /* string */ arg) {}, //raises: function(DOMException) {},
	
	/* returns void */
  deleteData: function(/* int */ offset, /* int */ count) {}, // raises: function(DOMException) {},
  
	/* returns void */
  replaceData: function(/* int */ offset, /* int */ count, /* string */ arg) {} // raises: function(DOMException) {},
});


var Attr = function(name, value) {
	
	this.name = name;
	this.value = value;
	if (value) {
		this.specified = true;
	}

};
Attr.Prototype = extend(new Node(), {
});

// Attr ReadOnly Properties
defineReadOnly(Attr.prototype, 'name');
defineReadOnly(Attr.prototype, 'value');
defineReadOnly(Attr.prototype, 'specified');

var Element = function (tagName) {
	this.tagName = tagName;
};
Element.prototype = extend(Node, {
  /* returns string */
	getAttribute: function(/* string */ name) {},

  /* returns string */
  setAttribute: function(/* string */ name, /* string */ value) {}, //raises: function(DOMException) {},

  /* returns string */
  removeAttribute: function(/* string */ name) {}, // raises: function(DOMException) {},

  /* returns Attr */
  getAttributeNode: function(/* string */ name) {},

  /* returns Attr */
  setAttributeNode: function(/* Attr */ newAttr) {}, //  raises: function(DOMException) {},

  /* returns Attr */
  removeAttributeNode: function(/* Attr */ oldAttr) {}, //raises: function(DOMException) {},
  
  /* returns NodeList */	
	getElementsByTagName: function(/* string */ name) {},

  /* returns string */
  normalize: function() {},
});

// Element ReadOnly Properties
defineReadOnly(Element.prototype, 'tagName');

var Text = function() {};
Text.prototype = extend(CharacterData, {
  /* returns Text */
	splitText: function(offset) {} //raises: function(DOMException) {},
});

var Comment = function() {};
Comment.prototype = extend(CharacterData, {
});

var CDATASection = function() {};
CDATASection.prototype = extend(Text, {
});

var DocumentType = function(name, entities, notations) {
	this.name = name;
	this.entities = entities;
	this.notations = notations;
};
DocumentType.prototype = extend(Node, {
});

// DocumentType ReadOnly Properties
defineReadOnly(DocumentType.prototype, 'name');
defineReadOnly(DocumentType.prototype, 'entities');
defineReadOnly(DocumentType.prototype, 'notations');


var Notation = function(publicId, systemId){
  this.publicId = publicId;
	this.systemId = systemId;
};
Notation.prototype = extend(Node, {
});

// ProcessingInstruction ReadOnly Properties
defineReadOnly(Notation.prototype, 'publicId');
defineReadOnly(Notation.prototype, 'systemId');


var Entity = function(publicId, systemId, notationName) {};
Entity.prototype = extend(new Node(), {
});
// Entity ReadOnly Properties
defineReadOnly(Entity.prototype, 'publicId');
defineReadOnly(Entity.prototype, 'systemId');
defineReadOnly(Entity.prototype, 'notationName');


var EntityReference = function() {};
EntityReference.prototype = extend(Node, {
});


var ProcessingInstruction = function (target, data) {
	this.target = target;
	this.data = data;
}
ProcessingInstruction.prototype = extend(Node, {
});

// ProcessingInstruction ReadOnly Properties
defineReadOnly(ProcessingInstruction.prototype, 'target');
defineReadOnly(ProcessingInstruction.prototype, 'data');



/*

interface HTMLCollection {
  readonly attribute  unsigned long        length;
  Node                      item(in unsigned long index);
  Node                      namedItem(in DOMString name);
};

interface HTMLDocument : Document {
           attribute  DOMString            title;
  readonly attribute  DOMString            referrer;
  readonly attribute  DOMString            domain;
  readonly attribute  DOMString            URL;
           attribute  HTMLElement          body;
  readonly attribute  HTMLCollection       images;
  readonly attribute  HTMLCollection       applets;
  readonly attribute  HTMLCollection       links;
  readonly attribute  HTMLCollection       forms;
  readonly attribute  HTMLCollection       anchors;
           attribute  DOMString            cookie;
  void                      open();
  void                      close();
  void                      write(in DOMString text);
  void                      writeln(in DOMString text);
  Element                   getElementById(in DOMString elementId);
  NodeList                  getElementsByName(in DOMString elementName);
};

interface HTMLElement : Element {
           attribute  DOMString            id;
           attribute  DOMString            title;
           attribute  DOMString            lang;
           attribute  DOMString            dir;
           attribute  DOMString            className;
};

interface HTMLHtmlElement : HTMLElement {
           attribute  DOMString            version;
};

interface HTMLHeadElement : HTMLElement {
           attribute  DOMString            profile;
};

interface HTMLLinkElement : HTMLElement {
           attribute  boolean              disabled;
           attribute  DOMString            charset;
           attribute  DOMString            href;
           attribute  DOMString            hreflang;
           attribute  DOMString            media;
           attribute  DOMString            rel;
           attribute  DOMString            rev;
           attribute  DOMString            target;
           attribute  DOMString            type;
};

interface HTMLTitleElement : HTMLElement {
           attribute  DOMString            text;
};

interface HTMLMetaElement : HTMLElement {
           attribute  DOMString            content;
           attribute  DOMString            httpEquiv;
           attribute  DOMString            name;
           attribute  DOMString            scheme;
};

interface HTMLBaseElement : HTMLElement {
           attribute  DOMString            href;
           attribute  DOMString            target;
};

interface HTMLIsIndexElement : HTMLElement {
  readonly attribute  HTMLFormElement      form;
           attribute  DOMString            prompt;
};

interface HTMLStyleElement : HTMLElement {
           attribute  boolean              disabled;
           attribute  DOMString            media;
           attribute  DOMString            type;
};

interface HTMLBodyElement : HTMLElement {
           attribute  DOMString            aLink;
           attribute  DOMString            background;
           attribute  DOMString            bgColor;
           attribute  DOMString            link;
           attribute  DOMString            text;
           attribute  DOMString            vLink;
};

interface HTMLFormElement : HTMLElement {
  readonly attribute  HTMLCollection       elements;
  readonly attribute  long                 length;
           attribute  DOMString            name;
           attribute  DOMString            acceptCharset;
           attribute  DOMString            action;
           attribute  DOMString            enctype;
           attribute  DOMString            method;
           attribute  DOMString            target;
  void                      submit();
  void                      reset();
};

interface HTMLSelectElement : HTMLElement {
  readonly attribute  DOMString            type;
           attribute  long                 selectedIndex;
           attribute  DOMString            value;
  readonly attribute  long                 length;
  readonly attribute  HTMLFormElement      form;
  readonly attribute  HTMLCollection       options;
           attribute  boolean              disabled;
           attribute  boolean              multiple;
           attribute  DOMString            name;
           attribute  long                 size;
           attribute  long                 tabIndex;
  void                      add(in HTMLElement element, 
                                in HTMLElement before);
  void                      remove(in long index);
  void                      blur();
  void                      focus();
};

interface HTMLOptGroupElement : HTMLElement {
           attribute  boolean              disabled;
           attribute  DOMString            label;
};

interface HTMLOptionElement : HTMLElement {
  readonly attribute  HTMLFormElement      form;
           attribute  boolean              defaultSelected;
  readonly attribute  DOMString            text;
           attribute  long                 index;
           attribute  boolean              disabled;
           attribute  DOMString            label;
  readonly attribute  boolean              selected;
           attribute  DOMString            value;
};

interface HTMLInputElement : HTMLElement {
           attribute  DOMString            defaultValue;
           attribute  boolean              defaultChecked;
  readonly attribute  HTMLFormElement      form;
           attribute  DOMString            accept;
           attribute  DOMString            accessKey;
           attribute  DOMString            align;
           attribute  DOMString            alt;
           attribute  boolean              checked;
           attribute  boolean              disabled;
           attribute  long                 maxLength;
           attribute  DOMString            name;
           attribute  boolean              readOnly;
           attribute  DOMString            size;
           attribute  DOMString            src;
           attribute  long                 tabIndex;
  readonly attribute  DOMString            type;
           attribute  DOMString            useMap;
           attribute  DOMString            value;
  void                      blur();
  void                      focus();
  void                      select();
  void                      click();
};

interface HTMLTextAreaElement : HTMLElement {
           attribute  DOMString            defaultValue;
  readonly attribute  HTMLFormElement      form;
           attribute  DOMString            accessKey;
           attribute  long                 cols;
           attribute  boolean              disabled;
           attribute  DOMString            name;
           attribute  boolean              readOnly;
           attribute  long                 rows;
           attribute  long                 tabIndex;
  readonly attribute  DOMString            type;
           attribute  DOMString            value;
  void                      blur();
  void                      focus();
  void                      select();
};

interface HTMLButtonElement : HTMLElement {
  readonly attribute  HTMLFormElement      form;
           attribute  DOMString            accessKey;
           attribute  boolean              disabled;
           attribute  DOMString            name;
           attribute  long                 tabIndex;
  readonly attribute  DOMString            type;
           attribute  DOMString            value;
};

interface HTMLLabelElement : HTMLElement {
  readonly attribute  HTMLFormElement      form;
           attribute  DOMString            accessKey;
           attribute  DOMString            htmlFor;
};

interface HTMLFieldSetElement : HTMLElement {
  readonly attribute  HTMLFormElement      form;
};

interface HTMLLegendElement : HTMLElement {
  readonly attribute  HTMLFormElement      form;
           attribute  DOMString            accessKey;
           attribute  DOMString            align;
};

interface HTMLUListElement : HTMLElement {
           attribute  boolean              compact;
           attribute  DOMString            type;
};

interface HTMLOListElement : HTMLElement {
           attribute  boolean              compact;
           attribute  long                 start;
           attribute  DOMString            type;
};

interface HTMLDListElement : HTMLElement {
           attribute  boolean              compact;
};

interface HTMLDirectoryElement : HTMLElement {
           attribute  boolean              compact;
};

interface HTMLMenuElement : HTMLElement {
           attribute  boolean              compact;
};

interface HTMLLIElement : HTMLElement {
           attribute  DOMString            type;
           attribute  long                 value;
};

interface HTMLBlockquoteElement : HTMLElement {
           attribute  DOMString            cite;
};

interface HTMLDivElement : HTMLElement {
           attribute  DOMString            align;
};

interface HTMLParagraphElement : HTMLElement {
           attribute  DOMString            align;
};

interface HTMLHeadingElement : HTMLElement {
           attribute  DOMString            align;
};

interface HTMLQuoteElement : HTMLElement {
           attribute  DOMString            cite;
};

interface HTMLPreElement : HTMLElement {
           attribute  long                 width;
};

interface HTMLBRElement : HTMLElement {
           attribute  DOMString            clear;
};

interface HTMLBaseFontElement : HTMLElement {
           attribute  DOMString            color;
           attribute  DOMString            face;
           attribute  DOMString            size;
};

interface HTMLFontElement : HTMLElement {
           attribute  DOMString            color;
           attribute  DOMString            face;
           attribute  DOMString            size;
};

interface HTMLHRElement : HTMLElement {
           attribute  DOMString            align;
           attribute  boolean              noShade;
           attribute  DOMString            size;
           attribute  DOMString            width;
};

interface HTMLModElement : HTMLElement {
           attribute  DOMString            cite;
           attribute  DOMString            dateTime;
};

interface HTMLAnchorElement : HTMLElement {
           attribute  DOMString            accessKey;
           attribute  DOMString            charset;
           attribute  DOMString            coords;
           attribute  DOMString            href;
           attribute  DOMString            hreflang;
           attribute  DOMString            name;
           attribute  DOMString            rel;
           attribute  DOMString            rev;
           attribute  DOMString            shape;
           attribute  long                 tabIndex;
           attribute  DOMString            target;
           attribute  DOMString            type;
  void                      blur();
  void                      focus();
};

interface HTMLImageElement : HTMLElement {
           attribute  DOMString            lowSrc;
           attribute  DOMString            name;
           attribute  DOMString            align;
           attribute  DOMString            alt;
           attribute  DOMString            border;
           attribute  DOMString            height;
           attribute  DOMString            hspace;
           attribute  boolean              isMap;
           attribute  DOMString            longDesc;
           attribute  DOMString            src;
           attribute  DOMString            useMap;
           attribute  DOMString            vspace;
           attribute  DOMString            width;
};

interface HTMLObjectElement : HTMLElement {
  readonly attribute  HTMLFormElement      form;
           attribute  DOMString            code;
           attribute  DOMString            align;
           attribute  DOMString            archive;
           attribute  DOMString            border;
           attribute  DOMString            codeBase;
           attribute  DOMString            codeType;
           attribute  DOMString            data;
           attribute  boolean              declare;
           attribute  DOMString            height;
           attribute  DOMString            hspace;
           attribute  DOMString            name;
           attribute  DOMString            standby;
           attribute  long                 tabIndex;
           attribute  DOMString            type;
           attribute  DOMString            useMap;
           attribute  DOMString            vspace;
           attribute  DOMString            width;
};

interface HTMLParamElement : HTMLElement {
           attribute  DOMString            name;
           attribute  DOMString            type;
           attribute  DOMString            value;
           attribute  DOMString            valueType;
};

interface HTMLAppletElement : HTMLElement {
           attribute  DOMString            align;
           attribute  DOMString            alt;
           attribute  DOMString            archive;
           attribute  DOMString            code;
           attribute  DOMString            codeBase;
           attribute  DOMString            height;
           attribute  DOMString            hspace;
           attribute  DOMString            name;
           attribute  DOMString            object;
           attribute  DOMString            vspace;
           attribute  DOMString            width;
};

interface HTMLMapElement : HTMLElement {
  readonly attribute  HTMLCollection       areas;
           attribute  DOMString            name;
};

interface HTMLAreaElement : HTMLElement {
           attribute  DOMString            accessKey;
           attribute  DOMString            alt;
           attribute  DOMString            coords;
           attribute  DOMString            href;
           attribute  boolean              noHref;
           attribute  DOMString            shape;
           attribute  long                 tabIndex;
           attribute  DOMString            target;
};

interface HTMLScriptElement : HTMLElement {
           attribute  DOMString            text;
           attribute  DOMString            htmlFor;
           attribute  DOMString            event;
           attribute  DOMString            charset;
           attribute  boolean              defer;
           attribute  DOMString            src;
           attribute  DOMString            type;
};

interface HTMLTableElement : HTMLElement {
           attribute  HTMLTableCaptionElement caption;
           attribute  HTMLTableSectionElement tHead;
           attribute  HTMLTableSectionElement tFoot;
  readonly attribute  HTMLCollection       rows;
  readonly attribute  HTMLCollection       tBodies;
           attribute  DOMString            align;
           attribute  DOMString            bgColor;
           attribute  DOMString            border;
           attribute  DOMString            cellPadding;
           attribute  DOMString            cellSpacing;
           attribute  DOMString            frame;
           attribute  DOMString            rules;
           attribute  DOMString            summary;
           attribute  DOMString            width;
  HTMLElement               createTHead();
  void                      deleteTHead();
  HTMLElement               createTFoot();
  void                      deleteTFoot();
  HTMLElement               createCaption();
  void                      deleteCaption();
  HTMLElement               insertRow(in long index);
  void                      deleteRow(in long index);
};

interface HTMLTableCaptionElement : HTMLElement {
           attribute  DOMString            align;
};

interface HTMLTableColElement : HTMLElement {
           attribute  DOMString            align;
           attribute  DOMString            ch;
           attribute  DOMString            chOff;
           attribute  long                 span;
           attribute  DOMString            vAlign;
           attribute  DOMString            width;
};

interface HTMLTableSectionElement : HTMLElement {
           attribute  DOMString            align;
           attribute  DOMString            ch;
           attribute  DOMString            chOff;
           attribute  DOMString            vAlign;
  readonly attribute  HTMLCollection       rows;
  HTMLElement               insertRow(in long index);
  void                      deleteRow(in long index);
};

interface HTMLTableRowElement : HTMLElement {
           attribute  long                 rowIndex;
           attribute  long                 sectionRowIndex;
           attribute  HTMLCollection       cells;
           attribute  DOMString            align;
           attribute  DOMString            bgColor;
           attribute  DOMString            ch;
           attribute  DOMString            chOff;
           attribute  DOMString            vAlign;
  HTMLElement               insertCell(in long index);
  void                      deleteCell(in long index);
};

interface HTMLTableCellElement : HTMLElement {
           attribute  long                 cellIndex;
           attribute  DOMString            abbr;
           attribute  DOMString            align;
           attribute  DOMString            axis;
           attribute  DOMString            bgColor;
           attribute  DOMString            ch;
           attribute  DOMString            chOff;
           attribute  long                 colSpan;
           attribute  DOMString            headers;
           attribute  DOMString            height;
           attribute  boolean              noWrap;
           attribute  long                 rowSpan;
           attribute  DOMString            scope;
           attribute  DOMString            vAlign;
           attribute  DOMString            width;
};

interface HTMLFrameSetElement : HTMLElement {
           attribute  DOMString            cols;
           attribute  DOMString            rows;
};

interface HTMLFrameElement : HTMLElement {
           attribute  DOMString            frameBorder;
           attribute  DOMString            longDesc;
           attribute  DOMString            marginHeight;
           attribute  DOMString            marginWidth;
           attribute  DOMString            name;
           attribute  boolean              noResize;
           attribute  DOMString            scrolling;
           attribute  DOMString            src;
};

interface HTMLIFrameElement : HTMLElement {
           attribute  DOMString            align;
           attribute  DOMString            frameBorder;
           attribute  DOMString            height;
           attribute  DOMString            longDesc;
           attribute  DOMString            marginHeight;
           attribute  DOMString            marginWidth;
           attribute  DOMString            name;
           attribute  DOMString            scrolling;
           attribute  DOMString            src;
           attribute  DOMString            width;
};

*/
