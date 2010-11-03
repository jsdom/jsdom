var core      = require("./core").dom.level2.core,
    urlParse  = require("url").parse,
    request   = require("request");
    readFile  = require("fs").readFile;

require("./core").dom.level2.events;

function define(elementClass, def) {
  var tagName = def.tagName,
    tagNames = def.tagNames || (tagName? [tagName] : []),
    parentClass = def.parentClass || core.HTMLElement,
    attrs = def.attributes || [],
    proto = def.proto || {};
  
  var elem = core[elementClass] = function(document, name) {
    parentClass.call(this, document, name || tagName.toUpperCase());
  };
    
  elem.prototype = proto;
  elem.prototype.__proto__ = parentClass.prototype;

  attrs.forEach(function(n) {
      var prop = n.prop || n,
        attr = n.attr || prop.toLowerCase();
      
      if (!n.prop || n.read !== false) {
        elem.prototype.__defineGetter__(prop, function() {
          var s = this.getAttribute(attr);
          if (n.type && n.type == 'boolean') {
            return !!s;
          }
          if (n.type && n.type == 'long') {
            return +s;
          }
          return s;
        });
      }

      if (!n.prop || n.write !== false) {
        elem.prototype.__defineSetter__(prop, function(val) {
          if (!val) {
            this.removeAttribute(attr);
          }
          else {
            this.setAttribute(attr, val.toString());
          }
        });
      }
  });
  
  tagNames.forEach(function(tag) {
    core.Document.prototype._elementBuilders[tag.toLowerCase()] = function(doc, s) {
      var el = new elem(doc, s);

      if (def && def.init) {
        def.init.call(el);
      }

      return el;
    };
  });
}

core.DOMImplementation.prototype._features = {
  core : '2.0',
  html : '2.0',
  xhtml: '2.0',
  xml  : '2.0'
};


core.HTMLCollection = function(document, element, callback) {
  core.LiveNodeList.call(this, document, element, callback);
};

core.HTMLCollection.prototype = {
  namedItem : function(name) {
    var results = core.mapDOMNodes(this._element, true, this._callback),
        l       = results.length,
        node,
        matchingName = null;

    for (var i=0; i<l; i++) {
      node = results[i];
      if (node.getAttribute('id') === name) {
        return node;
      } else if (node.getAttribute('name') === name) {
        matchingName = node;
      }
    }
    return matchingName;
  },
  toString: function() {
    return '[ jsdom HTMLCollection ]: contains ' + this.length + ' items';
  }
};
core.HTMLCollection.prototype.__proto__ = core.LiveNodeList.prototype;

define('HTMLOptionsCollection', {
  parentClass: core.HTMLCollection // TODO: according to w3c, this is not inherited
});


core.HTMLDocument = function(url) {
  this._URL = url;
  core.Document.call(this);
};
core.HTMLDocument.prototype = {
  get referrer() {
    return "";
  },
  get domain() {
    return "";
  },
  _URL : "",
  get URL() {
    return this._URL;
  },
  
  // TODO TODO TODO TODO
  // WARNING: THIS IS NOT COVERED BY THE SPEC!
  set URL(val) {
    this._URL = val;
  },
  // TODO TODO TODO TODO
  
  get images() {
    return this.getElementsByTagName('IMG');
  },
  get applets() {
    return new (core.HTMLCollection)(this.ownerDocument, this, function(el) {
      if (el && el.tagName) {
        var upper = el.tagName.toUpperCase();
        if (upper === "APPLET") {
          return true;
        } else if (upper === "OBJECT" &&
          el.getElementsByTagName('APPLET').length > 0)
        {
          return true;
        }
      }
    });
  },
  get links() {
    return new (core.HTMLCollection)(this.ownerDocument, this, function(el) {
      if (el && el.tagName) {
        var upper = el.tagName.toUpperCase();
        if (upper === "AREA" || (upper === "A" && el.href)) {
          return true;
        }
      }
    });
  },
  get forms() {
    return this.getElementsByTagName('FORM');
  },
  get anchors() {
    return this.getElementsByTagName('A');
  },
  open  : function() {
    this._children = [];
  },
  close : function() {
  },
  write : function(text) {

  },

  writeln : function(text) {

  },

  getElementsByName : function(elementName) {
    return new (core.HTMLCollection)(this.ownerDocument, this, function(el) {
      return (el.getAttribute && el.getAttribute("name") === elementName);
    });
  },
  _title : "",
  get title() {
    var title = this.getElementsByTagName("title").item(0);
    if (!title) {
      return "";
    }
    return title.innerHTML;
  },
  set title(val) {
    
  
  },
  
  _body : null,
  get body() { return this.getElementsByTagName('BODY').item(0); },
  set body(el) { this.documentElement = el; },
  
  _cookie : "",
  get cookie() { return this._cookie; },
  set cookie(val) { this._cookie = val; }
};
core.HTMLDocument.prototype.__proto__ = core.Document.prototype;


define('HTMLElement', {
  parentClass: core.Element,
  attributes: [
    'id',
    'title',
    'lang',
    'dir',
    {prop: 'className', attr: 'class'}
  ]
});

core.Document.prototype._defaultElementBuilder = function(document, tagName) {
  return new core.HTMLElement(document, tagName);
};

//http://www.w3.org/TR/html5/forms.html#category-listed
var listedElements = /button|fieldset|input|keygen|object|select|textarea/i;

define('HTMLFormElement', {
  tagName: 'FORM',
  proto: {
    get elements() {
      var queryFn = function(e) {
        return listedElements.test(e.nodeName) ; // TODO exclude <input type="image">
      };

      // REVIST Use HTMLCollection
      return new (core.HTMLCollection)(this.ownerDocument, this, queryFn);
    },
    get length() {
      return this.elements.length;
    },
    submit: function() {
    },
    reset: function() {
    }
  },
  attributes: [
    'name',
    {prop: 'acceptCharset', attr: 'accept-charset'},
    'action',
    'enctype',
    'method',
    'target'
  ]
});

define('HTMLLinkElement', {
  tagName: 'LINK',
  attributes: [
    {prop: 'disabled', type: 'boolean'},
    'charset',
    'href',
    'hreflang',
    'media',
    'rel',
    'rev',
    'target',
    'type'
  ]
});

define('HTMLMetaElement', {
  tagName: 'META',
  attributes: [
    'content',
    {prop: 'httpEquiv', attr: 'http-equiv'},
    'name',
    'scheme'
  ]
});

define('HTMLHtmlElement', {
  tagName: 'HTML',
  attributes: [
    'version'
  ]
});

define('HTMLHeadElement', {
  tagName: 'HEAD',
  attributes: [
    'profile'
  ]
});

define('HTMLTitleElement', {
  tagName: 'TITLE',
  proto: {
    get text() {
      return this.innerHTML;
    },
    set text(s) {
      this.innerHTML = s;
    }
  }
});

define('HTMLBaseElement', {
  tagName: 'BASE',
  attributes: [
    'href',
    'target'
  ]
});


//**Deprecated**
/*
  interface HTMLIsIndexElement : HTMLElement {
    readonly attribute HTMLFormElement form;
             attribute DOMString       prompt;
  };
*/

define('HTMLStyleElement', {
  tagName: 'STYLE',
  attributes: [
    {prop: 'disabled', type: 'boolean'},
    'media',
    'type',
  ]
});

define('HTMLBodyElement', {
  tagName: 'BODY',
  attributes: [
    'aLink',
    'background',
    'bgColor',
    'link',
    'text',
    'vLink'
  ]
});

function closest(e, tagName) {
  while (e) {
    if (e.nodeName.toUpperCase() == tagName) {
      return e;
    }
    e = e.parentNode;
  }
  return null;
}

function firstChild(e, tagName) {
  var c = e.getElementsByTagName(tagName);
  if (c.length > 0) {
    return c[0];
  }
}

define('HTMLSelectElement', {
  tagName: 'SELECT',
  proto: {
    get options() {
      return this.getElementsByTagName('OPTION');
    },
    _getOptionsSnapshot: function() {
      return core.mapDOMNodes(this, false, function(n) {
        return n.nodeName == 'OPTION';
      });
    },
    
    get length() {
      return this.options.length;
    },
    
    get selectedIndex() {
      var opts = this._getOptionsSnapshot();
      opts.forEach(function(option, i) {
        if (option.selected) {
          return i;
        }
      });
      return -1;
    },
    
    set selectedIndex(index) {
      this._getOptionsSnapshot().forEach(function(option, i) {
        option.selected = i === index;
      });
    },
    
    get value() {
      if (this.selectedIndex === -1) {
        return '';
      }
      return this.options[this.selectedIndex].value;
    },
    
    set value(val) {
      this._getOptionsSnapshot().forEach(function(option, i) {
        if (option.value === val) {
          this.selectedIndex = i;
        }
      });
    },
    
    get form() {
      return closest(this, 'FORM');
    },
    
    get type() {
      return this.multiple ? 'select-multiple' : 'select';
    },
    
    add: function() {
      //TODO
    },
    
    remove: function(index) {
      var opts = this._getOptionsSnapshot();
      var el = opts[index];
      el.parentNode.removeChild(el);
    },
    
    blur: function() {
      //TODO
    },
    
    focus: function() {
      //TODO
    }
  },
  attributes: [
    {prop: 'disabled', type: 'boolean'},
    {prop: 'multiple', type: 'boolean'},
    'name',
    {prop: 'size', type: 'long'},
    {prop: 'tabIndex', type: 'long'},
  ]
});

define('HTMLOptGroupElement', {
  tagName: 'OPTGROUP',
  attributes: [
    {prop: 'disabled', type: 'boolean'},
    'label'
  ]
});

define('HTMLOptionElement', {
  tagName: 'OPTION',
  proto: {
    _initDefaultSelected: function() {
      if (this._defaultSelected === undefined) {
        this._defaultSelected = !!this.getAttribute('selected');
      }
      return this._defaultSelected;
    },
    get form() {
      return closest(this, 'FORM');
    },
    get defaultSelected() {
      return this._initDefaultSelected();
    },
    get text() {
      return this.innerHTML;
    },
    get value() {
      return this.getAttribute('value') || this.innerHTML;
    },
    set value(val) {
      this.setAttribute('value', val);
    },
    get index() {
      return closest(this, 'SELECT')._getOptionsSnapshot().indexOf(this);
    },
    get selected() {
      return !!this.getAttribute('selected');
    },
    set selected(s) {
      this._initDefaultSelected();
      if (s) {
        this.setAttribute('selected', 'selected');
      }
      else {
        this.removeAttribute('selected');
      }
    }
  },
  attributes: [
    {prop: 'disabled', type: 'boolean'},
    'label'
  ]
});

define('HTMLInputElement', {
  tagName: 'INPUT',
  proto: {
    _initDefaultValue: function() {
      if (this._defaultValue === undefined) {
        this._defaultValue = this.getAttribute('value');
      }
      return this._defaultValue;
    },
    _initDefaultChecked: function() {
      if (this._defaultChecked === undefined) {
        this._defaultChecked = !!this.getAttribute('checked');
      }
      return this._defaultChecked;
    },
    get form() {
      return closest(this, 'FORM');
    },
    get defaultValue() {
      return this._initDefaultValue();
    },
    get defaultChecked() {
      return this._initDefaultChecked();
    },
    get checked() {
      return !!this.getAttribute('checked');
    },
    set checked(checked) {
      this._initDefaultChecked();
      this.setAttribute('checked', checked);
    },
    get value() {
      return this.getAttribute('value');
    },
    set value(val) {
      this._initDefaultValue();
      this.setAttribute('value', value);
    },
    blur: function() {
    },
    focus: function() {
    },
    select: function() {
    },
    click: function() {
      this.checked = !this.checked;
    }
  },
  attributes: [
    'accept',
    'accessKey',
    'align',
    'alt',
    {prop: 'disabled', type: 'boolean'},
    {prop: 'maxLength', type: 'long'},
    'name',
    {prop: 'readOnly', type: 'boolean'},
    {prop: 'size', type: 'long'},
    'src',
    {prop: 'tabIndex', type: 'long'},
    'type',
    'useMap',
    'value'
  ]
});

define('HTMLTextAreaElement', {
  tagName: 'TEXTAREA',
  proto: {
    _initDefaultValue: function() {
      if (this._defaultValue === undefined) {
        this._defaultValue = this.innerHTML;
      }
      return this._defaultValue;
    },
    get form() {
      return closest(this, 'FORM');
    },
    get defaultValue() {
      return this._initDefaultValue();
    },
    get value() {
      return this.innerHTML;
    },
    set value(val) {
      this._initDefaultValue();
      this.innerHTML = val;
    },
    get type() {
      return 'textarea';
    },
    blur: function() {
    },
    focus: function() {
    },
    select: function() {
    }
  },
  attributes: [
    'accessKey',
    {prop: 'cols', type: 'long'},
    {prop: 'disabled', type: 'boolean'},
    {prop: 'maxLength', type: 'long'},
    'name',
    {prop: 'readOnly', type: 'boolean'},
    {prop: 'rows', type: 'long'},
    {prop: 'tabIndex', type: 'long'}
  ]
});

define('HTMLButtonElement', {
  tagName: 'BUTTON',
  proto: {
    get form() {
      return closest(this, 'FORM');
    }
  },
  attributes: [
    'accessKey',
    {prop: 'disabled', type: 'boolean'},
    'name',
    {prop: 'tabIndex', type: 'long'},
    'type',
    'value'
  ]
});

define('HTMLLabelElement', {
  tagName: 'LABEL',
  proto: {
    get form() {
      return closest(this, 'FORM');
    }
  },
  attributes: [
    'accessKey',
    {prop: 'htmlFor', attr: 'for'}
  ]
});

define('HTMLFieldSetElement', {
  tagName: 'FIELDSET',
  proto: {
    get form() {
      return closest(this, 'FORM');
    }
  }
});

define('HTMLLegendElement', {
  tagName: 'LEGEND',
  proto: {
    get form() {
      return closest(this, 'FORM');
    }
  },
  attributes: [
    'accessKey',
    'align'
  ]
});

define('HTMLUListElement', {
  tagName: 'UL',
  attributes: [
    {prop: 'compact', type: 'boolean'},
    'type'
  ]
});

define('HTMLOListElement', {
  tagName: 'OL',
  attributes: [
    {prop: 'compact', type: 'boolean'},
    {prop: 'start', type: 'long'},
    'type'
  ]
});

define('HTMLDListElement', {
  tagName: 'DL',
  attributes: [
    {prop: 'compact', type: 'boolean'}
  ]
});

define('HTMLDirectoryElement', {
  tagName: 'DIR',
  attributes: [
    {prop: 'compact', type: 'boolean'}
  ]
});

define('HTMLMenuElement', {
  tagName: 'MENU',
  attributes: [
    {prop: 'compact', type: 'boolean'}
  ]
});

define('HTMLLIElement', {
  tagName: 'LI',
  attributes: [
    'type',
    {prop: 'value', type: 'long'}
  ]
});

define('HTMLDivElement', {
  tagName: 'DIV',
  attributes: [
    'align'
  ]
});

define('HTMLParagraphElement', {
  tagName: 'P',
  attributes: [
    'align'
  ]
});

define('HTMLHeadingElement', {
  tagNames: ['H1','H2','H3','H4','H5','H6'],
  attributes: [
    'align'
  ]
});

define('HTMLQuoteElement', {
  tagNames: ['Q','BLOCKQUOTE'],
  attributes: [
    'cite'
  ]
});

define('HTMLPreElement', {
  tagName: 'PRE',
  attributes: [
    {prop: 'width', type: 'long'}
  ]
});

define('HTMLBRElement', {
  tagName: 'BR',
  attributes: [
    'clear'
  ]
});

define('HTMLBaseFontElement', {
  tagName: 'BASEFONT',
  attributes: [
    'color',
    'face',
    {prop: 'size', type: 'long'}
  ]
});

define('HTMLFontElement', {
  tagName: 'FONT',
  attributes: [
    'color',
    'face',
    'size'
  ]
});

define('HTMLHRElement', {
  tagName: 'HR',
  attributes: [
    'align',
    {prop: 'noShade', type: 'boolean'},
    'size',
    'width'
  ]
});

define('HTMLModElement', {
  tagNames: ['INS', 'DEL'],
  attributes: [
    'cite',
    'dateTime'
  ]
});

define('HTMLAnchorElement', {
  tagName: 'A',

  proto: {
    blur: function() {
    },
    focus: function() {
    },
    get href() {
      return this.getAttribute('href').replace(/^\.\//,'/');
    }
  },
  attributes: [
    'accessKey',
    'charset',
    'coords',
    {prop: 'href', type: 'string', read: false},
    'hreflang',
    'name',
    'rel',
    'rev',
    'shape',
    {prop: 'tabIndex', type: 'long'},
    'target',
    'type'
  ]
});

define('HTMLImageElement', {
  tagName: 'IMG',
  attributes: [
    'name',
    'align',
    'alt',
    'border',
    {prop: 'height', type: 'long'},
    {prop: 'hspace', type: 'long'},
    {prop: 'isMap', type: 'boolean'},
    'longDesc',
    'src',
    'useMap',
    {prop: 'vspace', type: 'long'},
    {prop: 'width', type: 'long'}
  ]
});

define('HTMLObjectElement', {
  tagName: 'OBJECT',
  proto: {
    get form() {
      return closest(this, 'FORM');
    },
    get contentDocument() {
      return null;
    }
  },
  attributes: [
    'code',
    'align',
    'archive',
    'border',
    'codeBase',
    'codeType',
    'data',
    'declare',
    {prop: 'height', type: 'long'},
    {prop: 'hspace', type: 'long'},
    'name',
    'standby',
    {prop: 'tabIndex', type: 'long'},
    'type',
    'useMap',
    {prop: 'vspace', type: 'long'},
    {prop: 'width', type: 'long'}
  ]
});

define('HTMLParamElement', {
  tagName: 'PARAM',
  attributes: [
    'name',
    'type',
    'value',
    'valueType'
  ]
});

define('HTMLAppletElement', {
  tagName: 'APPLET',
  attributes: [
    'align',
    'alt',
    'archive',
    'code',
    'codeBase',
    'height',
    {prop: 'hspace', type: 'long'},
    'name',
    'object',
    {prop: 'vspace', type: 'long'},
    'width'
  ]
});

define('HTMLMapElement', {
  tagName: 'MAP',
  proto: {
    get areas() {
      return this.getElementsByTagName("AREA");
    }
  },
  attributes: [
    'name'
  ]
});

define('HTMLAreaElement', {
  tagName: 'AREA',
  attributes: [
    'accessKey',
    'alt',
    'coords',
    'href',
    {prop: 'noHref', type: 'boolean'},
    'shape',
    {prop: 'tabIndex', type: 'long'},
    'target'
  ]
});

/*
  interface HTMLScriptElement : HTMLElement {
             attribute DOMString       text;
             attribute DOMString       htmlFor;
             attribute DOMString       event;
             attribute DOMString       charset;
             attribute boolean         defer;
             attribute DOMString       src;
             attribute DOMString       type;
  };
*/

define('HTMLTableElement', {
  tagName: 'TABLE',
  proto: {
    get caption() {
      return firstChild(this, 'CAPTION') || null;
    },
    get tHead() {
      return firstChild(this, 'THEAD') || null;
    },
    get tFoot() {
      return firstChild(this, 'TFOOT') || null;
    },
    get rows() {
      return this.getElementsByTagName('TR');
    },
    get tBodies() {
      return this.getElementsByTagName('TBODY');
    },
    createTHead: function() {
      //TODO
    },
    deleteTHead: function() {
      //TODO
    },
    createTFoot: function() {
      //TODO
    },
    deleteTFoot: function() {
      //TODO
    },
    createCaption: function(str) {
      var el = this.ownerDocument.createElement('CAPTION');
      el.innerHTML = str;
      return el;
    },
    deleteCaption: function() {
      //TODO
    },
    insertRow: function(index) {
      if (this.childNodes.length === 0) {
        var tbody = this.ownerDocument.createElement('TBODY');
        tbody.appendChild(this.ownerDocument.createElement('TR'));
        this.appendChild(tbody);
      } else {
        var rows       = this.getElementsByTagName('TR'),
            l          = rows.length,
            doc        = this.ownerDocument,
            targetRows = rows.item(index);

        // Append
        if (index === -1 || index === l) {
          rows.item(l-1).parentNode.appendChild(doc.createElement('TR'));

        // Insert before the selected index, in the same section
        } else {
          rows.item(index).parentNode.appendChild(doc.createElement('TR'));
        }
        
      }
    },
    deleteRow: function() {
      //TODO
    }
  },
  attributes: [
    'align',
    'bgColor',
    'border',
    'cellPadding',
    'cellSpacing',
    'frame',
    'rules',
    'summary',
    'width'
  ]
});

define('HTMLTableCaptionElement', {
  tagName: 'CAPTION',
  attributes: [
    'align'
  ]
});

define('HTMLTableColElement', {
  tagName: 'COL',
  attributes: [
    'align',
    {prop: 'ch', attr: 'char'},
    {prop: 'chOff', attr: 'charoff'},
    {prop: 'span', type: 'long'},
    'vAlign',
    'width',
  ]
});

define('HTMLTableSectionElement', {
  tagNames: ['THEAD','TBODY','TFOOT'],
  proto: {
    get rows() {
      return this.getElementsByTagName('TR');
    },
    insertRow: function() {
      //TODO
    },
    deleteRow: function() {
      //TODO
    }
  },
  attributes: [
    'align',
    {prop: 'ch', attr: 'char'},
    {prop: 'chOff', attr: 'charoff'},
    {prop: 'span', type: 'long'},
    'vAlign',
    'width',
  ]
});

define('HTMLTableRowElement', {
  tagName: 'TR',
  proto: {
    get cells() {
      return  this.getElementsByTagName('TD');
    },
    get rowIndex() {
      var table = this;
      while (table && table.tagName && table.tagName.toUpperCase() !== 'TABLE')
      {
        table = table.parentNode;
      }
      
      var idx           = 0,
          theadChildren = table.tHead.getElementsByTagName('TR'),
          theadLength   = theadChildren.length;
          theadI        = 0;
          tfootChildren = table.tHead.getElementsByTagName('TR'),
          tfootLength   = theadChildren.length;
          tfootI        = 0;
          
          // for searching tbodies
          allRows       = table.getElementsByTagName("TR");
          allLength     = allRows.length;
          allI          = 0;
          allChild      = null;


      // Search THEAD
      for (theadI; theadI<theadLength; theadI++) {
        if (theadChildren.item(theadI) === this) {
          return idx;
        }
        idx++;
      }

      // Search TBODIES
      for (allI; allI<allLength; allI++) {
        allChild = allRows.item(allI);
        if (allChild.parentNode.tagName.toUpperCase() === "TBODY") {
          idx++;
          if (allChild === this) {
            return idx;
          }
        }
      }

      // Search THEAD
      for (tfootI; tfootI<tfootLength; tfootI++) {
        if (tfootChildren.item(footI) === this) {
          return idx;
        }
        idx++;
      }

      return 0;
    },
    get sectionRowIndex() {
      var children = this.parentNode.getElementsByTagName('TR'),
          l        = children.length;

      for (var i=0; i<l; i++) {

        if (children.item(i) === this) {
          return i;
        }
      }
    
      return 0;
    },
    insertCell: function() {
      //TODO
    },
    deleteCell: function() {
      //TODO
    }
  },
  attributes: [
    'align',
    'bgcolor',
    {prop: 'ch', attr: 'char'},
    {prop: 'chOff', attr: 'charoff'},
    'vAlign'
  ]
});

define('HTMLTableCellElement', {
  tagNames: ['TH','TD'],
  proto: {
    get headers() {
      //TODO
    },
    get cellIndex() {
      //TODO
    }
  },
  attributes: [
    'abbr',
    'align',
    'axis',
    'bgcolor',
    {prop: 'ch', attr: 'char'},
    {prop: 'chOff', attr: 'charoff'},
    {prop: 'colSpan', type: 'long'},
    'height',
    {prop: 'noWrap', type: 'boolean'},
    {prop: 'rowSpan', type: 'long'},
    'scope',
    'vAlign',
    'width'
  ]
});

define('HTMLFrameSetElement', {
  tagName: 'FRAMESET',
  attributes: [
    'cols',
    'rows'
  ]
});

define('HTMLFrameElement', {
  tagName: 'FRAME',
  init   : function() {
  /*
    This is my shoddy attempt at frames. There are two problems here:
     + keeping the DOM free of BOM stuff (innerHTML, etc)
     + asynchronously loading the contents of the frame which should be fixable
       using the test suite's 'checkInitialization' method

    var _setAttribute = this.setAttribute

    this.setAttribute = function(name, value) {
      if (name === "src") {
        if (this._contentDocument) {
          delete this._contentDocument; // TODO: better cleanup
        }
        this._contentDocument = new (core.HTMLDocument)();
        this._contentDocument.URL = value;
        var self = this;

        // TODO: load the actual content
        if (this.ownerDocument.URL.indexOf("file://") !== -1) {
          if (value.indexOf("://") !== -1) {

          // relative
          } else {

            // Prepare for hack sauce
            var split = this.ownerDocument.URL.replace("file://","").split('/');
            split.pop(); // clean off the filename
            split.push(value);
            var data = readFile(split.join("/")).toString(),
                parser    = require('htmlparser'),
                HtmlToDom = require(__dirname + '/../../../lib/jsdom/' +
                                    'browser/htmltodom').HtmlToDom,
                html2dom  = new HtmlToDom(parser);

            html2dom.appendHtmlToElement(data.toString(), self._contentDocument);
          }
        } else {
          
        }
      }
      _setAttribute.call(this, name, value);
    };*/
  },
  proto: {
    _contentDocument : null,
    get contentDocument() {
      return this._contentDocument;
    },
    set src() {
      console.log("OH MAH GAWDDD");
    }
  },
  attributes: [
    'frameBorder',
    'longDesc',
    'marginHeight',
    'marginWidth',
    'name',
    {prop: 'noResize', type: 'boolean'},
    'scrolling',
    {prop: 'src', type: 'string', write: false}
  ]
});

define('HTMLIFrameElement', {
  tagName: 'IFRAME',
  proto: {
    _contentDocument : null,
    get contentDocument() {
      if (this._contentDocument === null) {
        this._contentDocument = new HTMLDocument();
      }
      return this._contentDocument;
    }
  },
  attributes: [
    'align',
    'frameBorder',
    'height',
    'longDesc',
    'marginHeight',
    'marginWidth',
    'name',
    'scrolling',
    'src',
    'width'
  ]
});

exports.define = define;
exports.dom = {
  level2 : {
    html : core
  }
}
