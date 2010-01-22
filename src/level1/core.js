/*
  ServerJS Javascript DOM
*/
var core = {};
var sys = require("sys");

core.DOMException = function(code) {
  this._code = code;
};

core.DOMException.prototype = {
	get code() { return this._code; }
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


core.DOMImplementation = function(/* Object */ features) {
  this._features = features;
};
core.DOMImplementation.prototype = {
  hasFeature: function(/* string */ feature, /* string */ version) {
    for (var i in this._features)
    {
      if (this._features.hasOwnProperty(i) && 
          i.toLowerCase() === feature.toLowerCase() && 
          this._features[i] === version)
      {
        return true;
      }
    }
    return false;
  }
};


core.Node = function () {
	this._children = new core.NodeList();
	this._nodeValue = null;
  this._parentNode = null;
  this._attributes = new core.NamedNodeMap();
  this._nodeName   = null;
};
core.Node.prototype = {
  
  get ELEMENT_NODE() { return 1; },
  get ATTRIBUTE_NODE() { return 2; },
  get TEXT_NODE() { return 3; },
  get CDATA_SECTION_NODE() { return 4; },
  get ENTITY_REFERENCE_NODE() { return 5; },  
  get ENTITY_NODE() { return 6; },
  get PROCESSING_INSTRUCTION_NODE() { return 7; },
  get COMMENT_NODE() { return 8; },
  get DOCUMENT_NODE() { return 9; },
  get DOCUMENT_TYPE_NODE() { return 10; },
  get DOCUMENT_FRAGMENT_NODE() { return 11; },
  get NOTATION_NODE() { return 12; },

  get children() { return this._children; },
  get nodeValue() { return this._nodeValue; },
  set nodeValue(value) { this._nodeValue = value; },
  get parentNode() { return this._parentNode; },
  
  get nodeName() { return this._nodeName || this._tagName; },
  set nodeName() { throw new DOMException(); },  
  
  get attributes() { return this._attributes; },

  get firstChild() { return (this._children && this._children[0]) ? this._children.item(0) : null; },
  set firstChild() { throw new DOMException(); },

  get childNodes() { return this._children; },
  set childNodes() { throw new DOMException(); },

  get nextSibling() { 
    // find this node's index in the parentNode, add one and call it a day
    var index = 0;

    if (!this._parentNode || 
        !this._parentNode.childNodes || 
        !this._parentNode.childNodes.length || 
         this._parentNode.childNodes.length < 1) 
    {
      return null;
    }

    var currentNode;
    while ((currentNode = this._parentNode.childNodes[index]))
    {
      index++;
      if (currentNode === this) { break; }
    }

    return this._parentNode.childNodes[index];
  },
  set nextSibling() { throw new DOMException(); },

  get previousSibling() { 
      // find this node's index in the parentNode, add one and call it a day
      var index = 0;

      if (!this._parentNode || !this._parentNode.childNodes || !this._childNodes.length || this._childNodes.length < 1) 
      {
          return null;
      }

      var currentNode;
      while ((currentNode = this._parentNode.childNodes[index]))
      {
          if (currentNode === this) { break; }
          index++;
      }

      return this._parentNode.childNodes[index-1];
  },
  set previousSibling() { throw new DOMException(); },

  /* returns Node */ 
  insertBefore :  function(/* Node */ newChild, /* Node*/ refChild){
    
  }, // raises(DOMException);

  /* returns Node */
  replaceChild : function(/* Node */ newChild, /* Node */ oldChild){
    for (var i=0;i<this._children.length; i++)
    {
      if (this._children[i] === oldChild) {
        var current = this;
        // search for parents matching the newChild
        while ((current = current.parentNode))
        {
          if (current === newChild) {
            throw new DOMException(HIERARCHY_REQUEST_ERR);
          }
        }
        
        this._children[i] = newChild;
        return oldChild;
      }
    }
    throw new DOMException(NOT_FOUND_ERR);
  }, //raises(DOMException);

  /* returns Node */
  removeChild : function(/* Node */ oldChild){
    var newChildren = new core.NodeList();
    var found = false;
    for (var i=0;i<this._children.length; i++)
    {
      if (this._children[i] === oldChild) {
        found=true;
        continue;
      }
      newChildren.push(this._children[i]);
    }
    if (!found) {
      throw new DOMException(NOT_FOUND_ERR); 
    } else {
      this._children = newChildren;
      oldChild._parentNode = null;
      return oldChild;
    }
  }, // raises(DOMException);
  
  /* returns Node */
  appendChild : function(/* Node */ newChild){
	this._children.push(newChild);
	// TODO: trigger an internal mutation event.
	
	// Attach the parent node.
	newChild._parentNode = this;
	
	return newChild;	
  }, // raises(DOMException);
  
  /* returns boolean */
  hasChildNodes : function() {
    return this._children.length > 0;
  },
  
  /* returns Node */  
  cloneNode : function(/* bool */ deep) {}
};


core.NamedNodeMap = function() {
	this._nodes = [];
	
};
core.NamedNodeMap.prototype = {
  
  get length() { return this._nodes.length; },
  
	/* returns Node */
	getNamedItem: function(/* string */ name) {
	    for (var i=0; i<this._nodes.length; i++)
	    {
	        if (this._nodes[i].name && this._nodes[i].name === name) {
	            return this._nodes[i];
	        }
	    }
	},

	/* returns Node */
	setNamedItem: function(/* Node */ arg) {
	    this.removeNamedItem(arg.name);
	    this._nodes.push(arg);
	}, // raises: function(DOMException) {},

	/* returns Node */
	removeNamedItem: function(/* string */ name) {
	    var minusNamed = [];
	    var node = null;
	    for (var i=0; i<this._nodes.length; i++)
	    {
	        if (!this._nodes[i].name || this._nodes[i].name !== name) {
	            minusNamed.push(this._nodes[i]);
	        } else {
	            node = this._nodes[i];
	        }
	    }
	    this._nodes = minusNamed;
	    return node;
	}, // raises: function(DOMException) {},

	/* returns Node */
	item: function(/* int */ index) {
		return this._nodes[index];
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
    for (var i=0; i<this._nodes.length; i++)
    {
        if (this._nodes[i].name && this._nodes[i].name === name) {
            item = this._nodes[i];
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
    this.removeNamedItem(arg.name);
    this._nodes.push(arg);
  }, // raises: function(DOMException) {}, 
};

core.AttrNodeMap.prototype.__proto__ = core.NamedNodeMap.prototype;

core.Element = function (tagName) {
	this._attributes = null;
	this._tagName = tagName;
	core.Node.call(this);
	this._nodeName = tagName;
	this._nodeType = this.ELEMENT_NODE;
};

core.Element.prototype = {
  
  get nodeValue() { return null; },
  set nodeValue(value) { /* do nothing */ },
  get nodeName() { return this._tagName; },
  get tagName() { return this._tagName; },
  get nodeType() { return this._nodeType; },
  get attributes() { return this._attributes; },
  
  /* returns string */
  getAttribute: function(/* string */ name) {
    var attribute = this._attributes.getNamedItem(name);
    if (attribute) {
      return attribute.value;
    }
    return "";
  },

  /* returns string */
  setAttribute: function(/* string */ name, /* string */ value) {
	  if (this._attributes === null) {
	    this._attributes = new core.AttrNodeMap();
	  }
	  
	  var attr = new core.Attr(name, value);
	  this.removeAttribute(name);
	  this._attributes.setNamedItem(attr);
	  return value;
  }, //raises: function(DOMException) {},

  /* returns string */
  removeAttribute: function(/* string */ name) {
      this._attributes.removeNamedItem(name);
      return name;
  }, // raises: function(DOMException) {},

  /* returns Attr */
  getAttributeNode: function(/* string */ name) {
    return this._attributes.getNamedItem(name);
  },

  /* returns Attr */
  setAttributeNode: function(/* Attr */ newAttr) {
    this._attributes.setNamedItem(newAttr);
    return newAttr;
  }, //  raises: function(DOMException) {},

  /* returns Attr */
  removeAttributeNode: function(/* Attr */ oldAttr) {
    this._attributes.removeNamedItem(oldAttr.name);
    return oldAttr;
  }, //raises: function(DOMException) {},
  
  /* returns NodeList */	
  getElementsByTagName: function(/* string */ name) {
    var ret = new core.NodeList();

    if (this._children && this._children.length) {      
      for (var i=0; i<this._children.length; i++)
      {
	      if (this._children[i].tagName && this._children[i].tagName === name) {
          ret.push(this._children[i]);
        }		
        if (this._children[i].getElementsByTagName)
        {
	        var nested = this._children[i].getElementsByTagName(name);
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

  /* returns void */
  normalize: function() {
    var prevChild;
    var child;
    for (var i=0; i<this._children.length; i++)
    {
      if (i>0) {
        child = this._children[i];
        prevChild = this._children[i-1];
        
        if (child.nodeType === this._TEXT_NODE && prevChild.nodeType === this._TEXT_NODE)
        {
          // remove the child and decrement i
          prevChild.appendData(child.value);
          this.removeChild(child);
          i--;
        }
      }
    }
  },
};
core.Element.prototype.__proto__ = core.Node.prototype;


core.DocumentFragment = function() {
	core.Element.call(this, "#document-fragment");
	this._nodeType = this.DOCUMENT_FRAGMENT_NODE;
};
core.DocumentFragment.prototype = {};
core.DocumentFragment.prototype.__proto__ = core.Element.prototype;


core.ProcessingInstruction = function (target, data) {
	core.Node.call(this);
	this._nodeName = target;
	this._tagName = target;
	this._target = target;
	this._nodeValue = data;
}
core.ProcessingInstruction.prototype = {
  get target() { return this._target; },
  set target(value) { throw new DOMException(1); },
  get nodeType() { return this.PROCESSING_INSTRUCTION_NODE; },
  get nodeValue() { return this._nodeValue; },
  set nodeValue(value) { this._nodeValue = value},
  get data()   { return this._nodeValue; },
  set data()   { throw new DOMException(1); }

};
core.ProcessingInstruction.prototype.__proto__ = core.Node.prototype;


core.Document = function(name, doctype, implementation) {
	core.Element.call(this, "#document");
	this._nodeName = "#document";
	this._doctype = doctype || new DocumentType(name, new NamedNodeMap(), new NamedNodeMap());
	this._implementation = implementation || new DOMImplementation();
	this._documentElement = null
};
core.Document.prototype = {

  get doctype() { return this._doctype; },
  get documentElement() { return this._documentElement; },
  get implementation() { return this._implementation; },
  get nodeType() { return this.DOCUMENT_NODE; },
  /* returns Element */
  createElement: function(/* string */ tagName) {
    return new core.Element(tagName);	
  }, //raises: function(DOMException) {},
  
  /* returns DocumentFragment */  
  createDocumentFragment: function() {
    return new core.DocumentFragment();	
  },
  
  /* returns Text */  
  createTextNode: function(/* string */ data) {
    return new core.Text(data);
  },
  
  /* returns Comment */
  createComment: function(/* string */ data) {
    return new core.Comment(data);
  },
  
  /* returns CDATASection */	
  createCDATASection: function(/* string */ data) {
    return new core.CDATASection(data);
  }, // raises: function(DOMException) {},

  /* returns ProcessingInstruction */
  createProcessingInstruction: function(/* string */ target,/* string */ data) {
    return new core.ProcessingInstruction(target, data);
  }, // raises: function(DOMException) {},

  /* returns Attr */
  createAttribute: function(/* string */ name) {
    return new core.Attr(name,"");
  }, // raises: function(DOMException) {},
  
  /* returns EntityReference */
  createEntityReference: function(/* string */ name) {
      return new core.EntityReference(this._doctype.entities.getNamedItem(name));
  }, //raises: function(DOMException) {},

  /* returns Node */
  appendChild : function(/* Node */ newChild){
	  this._children.push(newChild);
	  // TODO: trigger an internal mutation event.
	  
	  if (!this._documentElement && newChild.nodeType === this.ELEMENT_NODE) {
	    this._documentElement = newChild;
	  }
	  
	  // Attach the parent node.
	  // TODO: this needs to somehow get into a "subsystem" behind the nodes.
	  newChild._parentNode = this;
	  return newChild;	
  }, // raises(DOMException);
  
  
};
core.Document.prototype.__proto__ = core.Element.prototype;

core.CharacterData = function(value) {
  core.Node.call(this);
  this._nodeValue = value;
};
core.CharacterData.prototype = {

  get data() { return this._nodeValue; },
  set data(data) { 
    this._nodeValue = data; 
	},
	
  /* returns int */
  get length() { return this._nodeValue.length || 0; },
  
  /* returns string */
  substringData: function(/* int */ offset, /* int */ count) {
    
    if (count < 0 || offset < 0 || offset > this._nodeValue.length) {
      throw new DOMException(INDEX_SIZE_ERR);
    }
    
    return (this._nodeValue.length < offset + count) ? 
            this._nodeValue.substring(offset) : 
            this._nodeValue.substring(offset, offset+count);
    
  }, // raises: function(DOMException) {},

  /* returns string */
  appendData: function(/* string */ arg) {
      this._nodeValue+=arg;
      return this._nodeValue;
  }, // raises: function(DOMException) {},
  
  /* returns string */	
  insertData: function(/* int */ offset, /* string */ arg) {
      if (offset < 0 || offset > this._nodeValue.length)
      {
          throw new DOMException(INDEX_SIZE_ERR);
      }

      var start = this._nodeValue.substring(0,offset);
      var end = this._nodeValue.substring(offset);
      
      this._nodeValue = start + arg + end;      
      
  }, //raises: function(DOMException) {},
	
	/* returns void */
  deleteData: function(/* int */ offset, /* int */ count) {
      
      if (offset       < 0                     || 
          offset       > this._nodeValue.length || 
          count        < 0)
      {
          throw new DOMException(INDEX_SIZE_ERR);
      }

      var start = this._nodeValue.substring(0,offset);

      this._nodeValue = (offset+count<this._nodeValue.length) ? 
                       start + this._nodeValue.substring(offset+count) :
                       start;
  }, // raises: function(DOMException) {},
  
	/* returns void */
  replaceData: function(/* int */ offset, /* int */ count, /* string */ arg) {
      if (offset       < 0                     || 
          offset       > this._nodeValue.length || 
          count        < 0                     || 
          offset+count > this._nodeValue.length)
      {
          throw new DOMException(INDEX_SIZE_ERR);
      }

      var start = this._nodeValue.substring(0,offset);
      var end = this._nodeValue.substring(offset+count);
      
      this._nodeValue = start + arg + end;      
  } // raises: function(DOMException) {},
};
core.CharacterData.prototype.__proto__ = core.Node.prototype;


core.Attr = function(name, value) {
	core.Node.call(this);
	
	this._nodeValue = value;
	this._name = name;
  this._specified = (value) ? true : false;
  this._tagName   = name;
  this._nodeName  = name;
};
core.Attr.prototype =  {
  get nodeType() { return this.ATTRIBUTE_NODE; },
  get nodeValue() { return this._nodeValue; },
  set nodeValue(value) { this._nodeValue = value; },
  get name() { return this._name; },
  get specified() { return this._specified; },
  set specified() { throw new DOMException(); },
  get value() { return this._nodeValue; },
  set value(value) { this._nodeValue = value; }
};
core.Attr.prototype.__proto__ = core.Node.prototype;

core.Text = function(text, readonly) {
    core.CharacterData.call(this, text);
    this._nodeName = "#text";
    this._readonly = readonly ? true : false
};
core.Text.prototype = {
	
	get attributes() { return null; },
	get nodeType() { return this.TEXT_NODE; },
	get value() { return this._nodeValue; },
	set value(value) { this._nodeValue = value; },
	
	
	/* returns Text */
	splitText: function(offset) {
	    
	    if (this._readonly) {
	      throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
	    }
	    
	    if (offset < 0 || offset > this._nodeValue.length) {
	      throw new DOMException(INDEX_SIZE_ERR);
	    }
	    
	    var newText = this._nodeValue.substring(offset);
	    this._nodeValue = this._nodeValue.substring(0, offset);
	    var newNode = new Text(newText);
	    this._parentNode.appendChild(newNode);
	    return newNode;
	} //raises: function(DOMException) {},
};
core.Text.prototype.__proto__ = core.CharacterData.prototype


core.Comment = function(text) {
  core.Text.call(this, text);
  this._nodeName = "#comment";
  this._tagName  = "#comment";
};
core.Comment.prototype = {
  get nodeType() { return this.COMMENT_NODE; }
};
core.Comment.prototype.__proto__ = core.Text.prototype


core.CDATASection = function(value) {
  core.Text.call(this, value);
  this._nodeType = this.CDATA_SECTION_NODE;
  this._nodeName = "#cdata-section";
};
core.CDATASection.prototype = {
};
core.CDATASection.prototype.__proto__ = core.Text.prototype

core.DocumentType = function(name, entities, notations) {
	core.Node.call(this);
	this._name = name;
	this._tagName = name;
	this._nodeName = name;
	this._entities = entities || new NamedNodeMap();
	this._notations = notations || new NamedNodeMap();
};
core.DocumentType.prototype = {
  get nodeValue() { return null; },
  set nodeValue() { /* do nothing */ },

  get nodeType() { return this.DOCUMENT_TYPE_NODE; },
  get name() { return this._name; },
  get entities() { return this._entities; },
  get notations() { return this._notations; }
};
core.DocumentType.prototype.__proto__ = core.Node.prototype;

core.Notation = function(publicId, systemId){
  core.Node.call(this);
  this._name = publicId;
  this._nodeType = this.NOTATION_NODE;
  this._publicId = publicId;
	this._systemId = systemId;
};
core.Notation.prototype = {
  get publicId() { return this._publicId; },
  get systemId() { return this._systemId; },
  get name() { return this._name; },
  get attributes() { /* as per spec */ return null; }
};
core.Notation.prototype.__proto__ = core.Node.prototype;


core.Entity = function(name, publicId, systemId, notationName, text) {
  core.Node.call(this);
  this._name = name;
  this._nodeName = name;
  this._tagName = name;
  this._publicId = publicId;
  this._systemId = systemId;
  this._notationName = notationName;
  this._nodeType = this.ENTITY_NODE;
  
  if (text) {
    text._readonly = true;
    this.appendChild(text);
  }
};
core.Entity.prototype = {
  get nodeValue() { return null; },
  set nodeValue() { /* do nothing */ },
  get name() { return this._name },
  get publicId() { return this._publicId; },
  get systemId() { return this._systemId; },
  get notationName() { return this._notationName; },
  
  appendChild : function(/* Node */ child) {

  }
  
};
core.Entity.prototype.__proto__ = core.Node.prototype;


core.EntityReference = function(entity) {
  core.Node.call(this);
  if (entity && entity.name)  {
    this._entity = entity;
    this._nodeName = entity.name;
  }
};
core.EntityReference.prototype = {
  get nodeType()  { return this.ENTITY_REFERENCE_NODE; },
  get nodeValue() { return null; },
  set nodeValue() { /* do nothing */ },

  get firstChild() { 
    return (this._entity.childNodes && this._entity.childNodes.item([0])) ? 
            this._entity.childNodes.item(0) : 
            null; 
  },
  set firstChild() { throw new DOMException(); },

  get childNodes() { return this._entity.childNodes; },
  set childNodes() { throw new DOMException(); },  
   
};
core.EntityReference.prototype.__proto__ = core.Node.prototype;


/*
core.HTMLCollection = function() {
	this._items = [];
};

core.HTMLCollection.prototype = {

  //readonly attribute  unsigned long        length;
  /* returns Node * /
  item : function(/* integer * / index) {
    return this._items[index];	
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