/*
  ServerJS Javascript DOM
*/
var core = {};
var sys = require("sys");
// Utility methods
/*function defineConstant(obj, name, exception, value) {
    obj.__defineGetter__(name, function() { return value; });
    obj.__defineSetter__(name, function() {
        throw new exception();
    });
}

function // defineReadOnly(obj, name){
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
*/
// End Utilities



core.DOMException = function(code) {
  this.code = code;
};

core.DOMException.prototype = {
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


core.constantSetException = function(){
	return new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
};

core.NodeList = function() {
};
core.NodeList.prototype = {
  /* returns Node */
  item: function(index) {
    return this[index];
  }
};
core.NodeList.prototype.__proto__ = Array.prototype;

core.DOMImplementation = function() {};
core.DOMImplementation.prototype = {
  hasFeature: function(/* string */ feature, /* string */ version) {}
};

core.Node = function () {
	this.children = new core.NodeList();
};
core.Node.prototype = {
  nodeValue : null,
  parentNode : null,
  /* returns Node */ 
  insertBefore :  function(/* Node */ newChild, /* Node*/ refChild){}, // raises(DOMException);

  /* returns Node */
  replaceChild : function(/* Node */ newChild, /* Node */ oldChild){}, //raises(DOMException);

  /* returns Node */
  removeChild : function(/* Node */ oldChild){}, // raises(DOMException);
  
  /* returns Node */
  appendChild : function(/* Node */ newChild){
	this.children.push(newChild);
	// TODO: trigger an internal mutation event.
	
	// Attach the parent node.
	// TODO: this needs to somehow get into a "subsystem" behind the nodes.
	newChild.parentNode = this;
	
	return newChild;	
  }, // raises(DOMException);
  
  /* returns boolean */
  hasChildNodes : function() {},
  
  /* returns Node */  
  cloneNode : function(/* bool */ deep) {}
};

core.Node.prototype.__defineGetter__("firstChild", function() { return this.children.item(0); });
core.Node.prototype.__defineSetter__("firstChild", function() {
    throw new exception();
});

core.Node.prototype.__defineGetter__("childNodes", function() { return this.children; });
core.Node.prototype.__defineSetter__("childNodes", function() {
    throw new exception();
});

core.Node.prototype.__defineGetter__("nextSibling", function() { 
    // find this node's index in the parentNode, add one and call it a day
    var index = 0;
    
    if (!this.parentNode || !this.parentNode.childNodes || !this.childNodes.length || this.childNodes.length < 1) 
    {
        return null;
    }
    
    var currentNode;
    while ((currentNode = this.parentNode.childNodes[index]))
    {
        index++;
        if (currentNode === this) { break; }
    }
    
    return this.parentNode.childNodes[index];
});
core.Node.prototype.__defineSetter__("nextSibling", function() {
    throw new exception();
});

core.Node.prototype.__defineGetter__("previousSibling", function() { 
    // find this node's index in the parentNode, add one and call it a day
    var index = 0;

    if (!this.parentNode || !this.parentNode.childNodes || !this.childNodes.length || this.childNodes.length < 1) 
    {
        return null;
    }

    var currentNode;
    while ((currentNode = this.parentNode.childNodes[index]))
    {
        if (currentNode === this) { break; }
        index++;
    }
    
    return this.parentNode.childNodes[index-1];
});
core.Node.prototype.__defineSetter__("previousSibling", function() {
    throw new exception();
});

/*
core.Node.prototype.__defineGetter__("attributes", function() { 
  if (!this.attributes) {
    this.attributes = new core.NodeList();	
  }
  return this.attributes; 
});
core.Node.prototype.__defineSetter__("attributes", function() {
   throw new exception();
});

// Node ReadOnly Properties
/* defineReadOnly(core.Node.prototype, 'nodeType');
// defineReadOnly(core.Node.prototype, 'nodeValue');
// defineReadOnly(core.Node.prototype, 'parentNode');
// defineReadOnly(core.Node.prototype, 'childNodes');
// defineReadOnly(core.Node.prototype, 'firstChild');
// defineReadOnly(core.Node.prototype, 'lastChild ');
// defineReadOnly(core.Node.prototype, 'previousSibling');
// defineReadOnly(core.Node.prototype, 'nextSibling');
*/
//// defineReadOnly(core.Node, 'attributes');
/*// defineReadOnly(core.Node.prototype, 'ownerDocument');



// Node Constants
defineConstant(core.Node.prototype,'ELEMENT_NODE',core.constantSetException(), 1);
defineConstant(core.Node.prototype,'ATTRIBUTE_NODE',core.constantSetException(), 2);
defineConstant(core.Node.prototype,'TEXT_NODE',core.constantSetException(), 3);
defineConstant(core.Node.prototype,'CDATA_SECTION_NODE',core.constantSetException(), 4);
defineConstant(core.Node.prototype,'ENTITY_REFERENCE_NODE',core.constantSetException(), 5);
defineConstant(core.Node.prototype,'ENTITY_NODE',core.constantSetException(), 6);
defineConstant(core.Node.prototype,'PROCESSING_INSTRUCTION_NODE',core.constantSetException(), 7);
defineConstant(core.Node.prototype,'COMMENT_NODE',core.constantSetException(), 8);
defineConstant(core.Node.prototype,'DOCUMENT_NODE',core.constantSetException(), 9);
defineConstant(core.Node.prototype,'DOCUMENT_TYPE_NODE',core.constantSetException(), 10);
defineConstant(core.Node.prototype,'DOCUMENT_FRAGMENT_NODE',core.constantSetException(), 11);
defineConstant(core.Node.prototype,'NOTATION_NODE',core.constantSetException(), 12);

*/

core.NamedNodeMap = function() {
	this.length = 0;
	this.nodes = [];
	
};
core.NamedNodeMap.prototype = {
  
	/* returns Node */
	getNamedItem: function(/* string */ name) {
	    for (var i=0; i<this.nodes.length; i++)
	    {
	        if (this.nodes[i].name && this.nodes[i].name === name) {
	            return this.nodes[i];
	        }
	        
	    }
	},

	/* returns Node */
	setNamedItem: function(/* Node */ arg) {
	    this.nodes.push(arg);
	    
	    arg.parentNode = this;
	    
	}, // raises: function(DOMException) {},

	/* returns Node */
	removeNamedItem: function(/* string */ name) {
	    var minusNamed = [];
	    var node = null;
	    for (var i=0; i<this.nodes.length; i++)
	    {
	        if (!this.nodes[i].name || this.nodes[i].name !== name) {
	            minusNamed.push(this.nodes[i]);
	        } else {
	            node = this.nodes[i];
	        }
	    }
	    this.nodes = minusNamed;
	    return node;
	}, // raises: function(DOMException) {},

	/* returns Node */
	item: function(/* int */ index) {
		return this.nodes[index];
	}
};


core.AttrNodeMap = function() {
    core.NamedNodeMap.call(this);
};

core.AttrNodeMap.prototype = {
  
  getNamedItem : function(/* string */ name)
  {
    // TODO: use prototypal inheritance.
    var item = false;
    for (var i=0; i<this.nodes.length; i++)
    {
        if (this.nodes[i].name && this.nodes[i].name === name) {
            item = this.nodes[i];
            break;
        }    
    }      
      
    if (!item) {
        item = new core.Attr(name,false);
    
    }
    return item;
  },
  
  /* returns Node */
  setNamedItem: function(/* Node */ arg) {
    this.nodes.push(arg);
  }, // raises: function(DOMException) {}, 
};

core.AttrNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;

core.Element = function (tagName) {
	this.attributes = new core.AttrNodeMap();
	this.tagName = tagName;
	core.Node.call(this);
};

core.Element.prototype = {

  /* returns string */
  getAttribute: function(/* string */ name) {},

  /* returns string */
  setAttribute: function(/* string */ name, /* string */ value) {
	var attr = new core.Attr(name, value);
	
	this.attributes.setNamedItem(attr);
  }, //raises: function(DOMException) {},

  /* returns string */
  removeAttribute: function(/* string */ name) {
      this.attributes.removeNamedItem(name);
      return name;
  }, // raises: function(DOMException) {},

  /* returns Attr */
  getAttributeNode: function(/* string */ name) {},

  /* returns Attr */
  setAttributeNode: function(/* Attr */ newAttr) {}, //  raises: function(DOMException) {},

  /* returns Attr */
  removeAttributeNode: function(/* Attr */ oldAttr) {}, //raises: function(DOMException) {},
  
  /* returns NodeList */	
  getElementsByTagName: function(/* string */ name) {
    var ret = new core.NodeList();

    if (this.children && this.children.length) {      
      for (var i=0; i<this.children.length; i++)
      {
	    if (this.children[i].tagName && this.children[i].tagName === name) {
          ret.push(this.children[i]);
        }		
        if (this.children[i].getElementsByTagName)
        {
	      var nested = this.children[i].getElementsByTagName(name);
          if (nested && nested.length)
          {
              for (var idx = 0; idx<nested.length; idx++)
              {
                  ret.push(nested[idx]);
              }
          }
	
        }
	
      }
    }
    return ret;
  },

  /* returns string */
  normalize: function() {},
};

core.Element.prototype.__proto__ = core.Node.prototype;

// Element ReadOnly Properties
//core.Element.prototype.__defineGetter__("tagName", function(){	return this.tagName; });
/*core.Element.prototype.__defineSetter__(name, function(){
  throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
});*/

//// defineReadOnly(core.Element.prototype, 'tagName');

core.DocumentFragment = function() {
	core.Element.call(this, "documentFragment");
};
core.DocumentFragment.prototype = {};
core.DocumentFragment.prototype.__proto__ = core.Element.prototype;

core.Document = function() {
	core.Element.call(this, "document");
};
core.Document.prototype = {

  /* returns Element */
  createElement: function(/* string */ tagName) {
    return new core.Element(tagName);	
  }, //raises: function(DOMException) {},
  
  /* returns DocumentFragment */  
  createDocumentFragment: function() {
    return new core.DocumentFragment();	
  },
  
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
  createEntityReference: function(/* string */ name) {
      return new core.EntityReference(name);
  }, //raises: function(DOMException) {},
};
core.Document.prototype.__proto__ = core.Element.prototype;



// Document ReadOnly Properties
// defineReadOnly(core.Document.prototype, 'doctype');          // DocumentType
// defineReadOnly(core.Document.prototype, 'implementation');   // DOMImplementation
// defineReadOnly(core.Document.prototype, 'documentElement');  // Element


core.CharacterData = function(value) {
  this.nodeValue = value;
};
core.CharacterData.prototype = {

  get data() { return this.nodeValue; },
  set data(data) { 
    this.nodeValue = data; 
	},
	
  /* returns int */
  get length() { return this.nodeValue.length || 0; },
  
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
};

core.CharacterData.prototype.__proto__ = core.Node.prototype;


core.Attr = function(name, value) {
    
	this.nodeValue = value;
	this.name = name;
    this.specified = (value) ? true : false;

	
	core.Node.call(this);
    this.parentNode = null;
    this.nodeName = name;
};
core.Attr.prototype =  { /*nodeValue: null*/ 
};


core.Attr.prototype.__defineGetter__("value", function() { return this.nodeValue; });
core.Attr.prototype.__defineSetter__("value", function(value) { this.nodeValue = value; });
/*core.Attr.prototype.__defineGetter__("specified", function() { return this.nodeValue ? true : false; });
core.Attr.prototype.__defineSetter__("specified", function() {
    throw new exception();
});*/
core.Attr.prototype.__proto__ = core.Node.prototype;


// Attr ReadOnly Properties
//// defineReadOnly(core.Attr.prototype, 'name');
//// defineReadOnly(core.Attr.prototype, 'value'); // from node
//// defineReadOnly(core.Attr.prototype, 'specified');


core.Text = function(text) {
    core.CharacterData.call(this, text);
};
core.Text.prototype = {
	/* returns Text */
	splitText: function(offset) {
	    var newText = this.nodeValue.substring(offset);
	    this.nodeValue = this.nodeValue.substring(0, offset);
	    var newNode = new Text(newText);
	    this.parentNode.appendChild(newNode);
	    return newNode;
	} //raises: function(DOMException) {},
};

core.Attr.prototype.__defineGetter__("value", function() { return this.nodeValue; });
core.Attr.prototype.__defineSetter__("value", function(value) { this.nodeValue = value; });

core.Text.prototype.__proto__ = core.CharacterData.prototype

core.Comment = function() {};
core.Comment.prototype = {
};
core.Comment.prototype.__proto__ = core.Text.prototype

core.CDATASection = function() {};
core.CDATASection.prototype = {
};
core.CDATASection.prototype.__proto__ = core.Text.prototype

core.DocumentType = function(name, entities, notations) {
	this.name = name;
	this.entities = entities;
	this.notations = notations;
};
core.DocumentType.prototype = {
};

core.DocumentType.prototype.__proto__ = core.Node.prototype;

// DocumentType ReadOnly Properties
// defineReadOnly(core.DocumentType.prototype, 'name');
// defineReadOnly(core.DocumentType.prototype, 'entities');
// defineReadOnly(core.DocumentType.prototype, 'notations');


core.Notation = function(publicId, systemId){
  this.publicId = publicId;
	this.systemId = systemId;
};
core.Notation.prototype = {
};
core.Notation.prototype.__proto__ = core.Node.prototype;

// ProcessingInstruction ReadOnly Properties
// defineReadOnly(core.Notation.prototype, 'publicId');
// defineReadOnly(core.Notation.prototype, 'systemId');


core.Entity = function(publicId, systemId, notationName) {};
core.Entity.prototype = {
};

core.Entity.prototype.__proto__ = core.Node.prototype;

// Entity ReadOnly Properties
// defineReadOnly(core.Entity.prototype, 'publicId');
// defineReadOnly(core.Entity.prototype, 'systemId');
// defineReadOnly(core.Entity.prototype, 'notationName');


core.EntityReference = function() {
    core.Node.call(this);
};
core.EntityReference.prototype = {
};
core.EntityReference.prototype.__proto__ = core.Node.prototype;


core.ProcessingInstruction = function (target, data) {
	this.target = target;
	this.data = data;
}
core.ProcessingInstruction.prototype = {
};

core.ProcessingInstruction.prototype.__proto__ = core.Node.prototype;
// ProcessingInstruction ReadOnly Properties
// defineReadOnly(core.ProcessingInstruction.prototype, 'target');
// defineReadOnly(core.ProcessingInstruction.prototype, 'data');




/*
core.HTMLCollection = function() {
	this.items = [];
};

core.HTMLCollection.prototype = {

  //readonly attribute  unsigned long        length;
  /* returns Node * /
  item : function(/* integer * / index) {
    return this.items[index];	
  }
  
  //Node                      namedItem(in DOMString name);
};
/*
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
exports.dom = { "level1" : { "core" : core }};