var core      = require("./core").dom.level2.core,
    urlParse  = require("url").parse,
    request   = require("request");
    readFile  = require("fs").readFile,
    http          = require('http');

// Setup the javascript language processor
core.languageProcessors = {
  javascript : require(__dirname + "/languages/javascript").javascript
};

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

      if (def && def.init) {
        def.init(el);
      }

      var el = new elem(doc, s);
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


core.HTMLCollection = function(query) {
  core.NodeList.call(this, query);
};

core.HTMLCollection.prototype = {
  namedItem : function(name) {
    var results = this.toArray(),
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
core.HTMLCollection.prototype.__proto__ = core.NodeList.prototype;

core.HTMLOptionsCollection = core.HTMLCollection;

function closest(e, tagName) {
  tagName = tagName.toUpperCase();
  while (e) {
    if (e.nodeName.toUpperCase() == tagName || 
        (e.tagName && e.tagName.toUpperCase() === tagName))
    {
      return e;
    }
    e = e.parentNode;
  }
  return null;
}

function descendants(e, tagName, recursive) {
  return new core.HTMLCollection(core.mapper(e, function(n) {
    return n.nodeName === tagName;
  }, recursive));
}

function firstChild(e, tagName) {
  var c = descendants(e, tagName, false);
  return c.length > 0 ? c[0] : null;
}


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

  // Handle blocking elements ((i)frame, script, img, etc)
  // TODO: implement this in script, img, etc
  _onloadHandlers : [],
  _blockers : [],
  set onload(handler) {
    
  },
  addBlocker : function(el) {
    this._blockers.push(el);
  },
  removeBlocker : function(el) {
    var idx = this._blockers.indexOf(el);
    if (idx !== -1) {
      this._blockers = this._blockers.splice(idx);
    }
    if (this._blockers.length === 0) {
      while(_onloadHandlers.length > 0) {
        var fn = this._onloadHandlers.pop();
        if (typeof fn === "function") {
          fn();
        }
      }
    }
  },

  get images() {
    return this.getElementsByTagName('IMG');
  },
  get applets() {
    return new core.HTMLCollection(core.mapper(this, function(el) {
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
    }));
  },
  get links() {
    return new core.HTMLCollection(core.mapper(this, function(el) {
      if (el && el.tagName) {
        var upper = el.tagName.toUpperCase();
        if (upper === "AREA" || (upper === "A" && el.href)) {
          return true;
        }
      }
    }));
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
    return new core.HTMLCollection(core.mapper(this, function(el) {
      return (el.getAttribute && el.getAttribute("name") === elementName);
    }));
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
      return new core.HTMLCollection(core.mapper(this, function(e) {
        return listedElements.test(e.nodeName) ; // TODO exclude <input type="image">
      }));
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
define('HTMLIsIndexElement', {
  tagName : 'ISINDEX',
  parentClass : core.Element,
  proto : {
    get form() {
      return closest(this, 'FORM');
    }
  },
  attributes : [
    'prompt'
  ]
});


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

define('HTMLSelectElement', {
  tagName: 'SELECT',
  proto: {
    get options() {
      return new core.HTMLOptionsCollection(core.mapper(this, function(n) {
        return n.nodeName == 'OPTION';
      }));
    },
        
    get length() {
      return this.options.length;
    },
    
    get selectedIndex() {
      return this.options.toArray().reduceRight(function(prev, option, i) {
        return option.selected ? i : prev;
      }, -1);
    },
    
    set selectedIndex(index) {
      this.options.toArray().forEach(function(option, i) {
        option.selected = i === index;
      });
    },
    
    get value() {
      var i = this.selectedIndex;
      if (this.options.length && (i === -1)) {
        i = 0;
      }
      if (i === -1) {
        return '';
      }
      return this.options[i].value;
    },
    
    set value(val) {
      this.options.toArray().forEach(function(option) {
        if (option.value === val) {
          option.selected = true;
        }
      });
    },
    
    get form() {
      return closest(this, 'FORM');
    },
    
    get type() {
      return this.multiple ? 'select-multiple' : 'select';
    },
    
    add: function(opt, before) {
      if (before) {
        this.insertBefore(opt, before);
      }
      else {
        this.appendChild(opt);
      }
    },
    
    remove: function(index) {
      var opts = this.options.toArray();
      if (index >= 0 && index < opts.length) {
        var el = opts[index];
        el.parentNode.removeChild(el);
      }
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
        return (this.hasAttribute('value')) ? this.getAttribute('value') : this.innerHTML;
    },
    get value() {
        return (this.hasAttribute('value')) ? this.getAttribute('value') : this.innerHTML;
    },
    set value(val) {
      this.setAttribute('value', val);
    },
    get index() {
      return closest(this, 'SELECT').options.toArray().indexOf(this);
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
    {prop: 'declare', type: 'boolean'},
    {prop: 'height',  type: 'long'},
    {prop: 'hspace',  type: 'long'},
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

define('HTMLScriptElement', {
  tagName: 'SCRIPT',
  proto : {
    get src() {},
    set src(value) {
      this.setAttribute('src', value);
      var self = this;
      if (value.substring(0,7) === "file://") {
        realvalue = value.substring(7);
      } else {
        realvalue = value;
      }

      if (value.substring(0,7) === "file://") {

        require("fs").readFile(value.replace("file://",""), function(err, data)
        {
          if (err) throw err;
          core.languageProcessors.javascript(self, data);
        });

      } else {
        var host    = urlParse(value);

            server  = http.createClient(host.port || 80, host.hostname);
            path    = (host.search)                     ?
                      host.pathname + host.search :
                      host.pathname,
            request = server.request('GET', path, {'host': host.hostname });
        request.end();
        request.on('response', function (response) {
        response.setEncoding('utf8');
          var data = "";
          response.on('data', function (chunk) {
            data += chunk.toString();
          });
          response.on('end', function() {
            core.languageProcessors.javascript(self, data);
          });
        });
      }
    },
    get text() {
      return this.children.item(0).value;
    },
    set text(text) {
      if (!this.children.item(0)) {
        this.appendChild(this.ownerDocument.createTextNode(text));
      }

      // Execute the javascript
      var type = this.type || "text/javascript",
          lang = type.split("/").pop();

      if (!core.languageProcessors[lang]) {
        core.languageProcessors[lang](this.ownerDocument, text);
      }
    }
  },
  attributes : [
    {prop: 'defer', 'type': 'boolean'},
    'htmlFor',
    'event',
    'charset',
    'type',
    {prop: 'src', write: false, type:'string'},
  ]
})

define('HTMLTableElement', {
  tagName: 'TABLE',
  proto: {
    get caption() {
      return firstChild(this, 'CAPTION');
    },
    get tHead() {
      return firstChild(this, 'THEAD');
    },
    get tFoot() {
      return firstChild(this, 'TFOOT');
    },
    get rows() {
      if (!this._rows) {
        var table = this;
        this._rows = new core.HTMLCollection(function() {
          var sections = [table.tHead].concat(table.tBodies.toArray(), table.tFoot).filter(function(s) { return !!s });

          if (sections.length == 0) {
            return core.mapDOMNodes(table, false, function(el) {
              return el.tagName == 'TR';
            });
          }
          
          return sections.reduce(function(prev, s) {
            return prev.concat(s.rows.toArray());
          }, []);
          
        });
      }
      return this._rows;
    },
    get tBodies() {
      if (!this._tBodies) {
        this._tBodies = descendants(this, 'TBODY', false);
      }
      return this._tBodies;
    },
    createTHead: function() {
      var el = this.tHead;
      if (!el) {
        el = this.ownerDocument.createElement('THEAD');
        this.appendChild(el);
      }
      return el;
    },
    deleteTHead: function() {
      var el = this.tHead;
      if (el) {
        debugger;
        el.parentNode.removeChild(el);
      }
    },
    createTFoot: function() {
      var el = this.tFoot;
      if (!el) {
        el = this.ownerDocument.createElement('TFOOT');
        this.appendChild(el);
      }
      return el;
    },
    deleteTFoot: function() {
      var el = this.tFoot;
      if (el) {
        el.parentNode.removeChild(el);
      }
    },
    createCaption: function() {
      var el = this.caption;
      if (!el) {
        el = this.ownerDocument.createElement('CAPTION');
        this.appendChild(el);
      }
      return el;
    },
    deleteCaption: function() {
      var c = this.caption;
      if (c) {
        c.parentNode.removeChild(c);
      }
    },
    insertRow: function(index) {
      var tr = this.ownerDocument.createElement('TR');
      if (this.childNodes.length === 0) {
        this.appendChild(this.ownerDocument.createElement('TBODY'));
      }
      var rows = this.rows.toArray();
      if (index < -1 || index > rows.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      if (index == -1 || (index === 0 && rows.length === 0)) {
        this.tBodies.item(0).appendChild(tr);
      }
      else if (index == rows.length) {
        var ref = rows[index-1];
        ref.parentNode.appendChild(tr);
      }
      else {
        var ref = rows[index];
        ref.parentNode.insertBefore(tr, ref);
      }
      return tr;
    },
    deleteRow: function(index) {
      var rows = this.rows.toArray();
      if (index == -1) {
        index = rows.length-1;
      }
      if (index < 0 || index >= rows.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      var tr = this.rows[index];
      tr.parentNode.removeChild(tr);
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
  tagNames: ['COL','COLGROUP'],
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
      if (!this._rows) {
        this._rows = descendants(this, 'TR', false);
      }
      return this._rows;
    },
    insertRow: function(index) {
      var tr = this.ownerDocument.createElement('TR');
      var rows = this.rows.toArray();
      if (index < -1 || index > rows.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      if (index == -1 || index == rows.length) {
        this.appendChild(tr);
      }
      else {
        var ref = rows[index];
        this.insertBefore(tr, ref);
      }
      return tr;
    },
    deleteRow: function(index) {
      var rows = this.rows.toArray();
      if (index == -1) {
        index = rows.length-1;
      }
      if (index < 0 || index >= rows.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      var tr = this.rows[index];
      this.removeChild(tr);
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
      if (!this._cells) {
        this._cells = new core.HTMLCollection(core.mapper(this, function(n) {
          return n.nodeName == 'TD' || n.nodeName == 'TH';
        }, false));
      }
      return this._cells;
    },
    get rowIndex() {
      return closest(this, 'TABLE').rows.toArray().indexOf(this);
    },
    
    get sectionRowIndex() {
      return this.parentNode.rows.toArray().indexOf(this);
    },
    insertCell: function(index) {
      var td = this.ownerDocument.createElement('TD');
      var cells = this.cells.toArray();
      if (index < -1 || index > cells.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      if (index == -1 || index == cells.length) {
        this.appendChild(td);
      }
      else {
        var ref = cells[index];
        this.insertBefore(td, ref);
      }
      return td;
    },
    deleteCell: function(index) {
      var cells = this.cells.toArray();
      if (index == -1) {
        index = cells.length-1;
      }
      if (index < 0 || index >= cells.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      var td = this.cells[index];
      this.removeChild(td);
    }
  },
  attributes: [
    'align',
    'bgColor',
    {prop: 'ch', attr: 'char'},
    {prop: 'chOff', attr: 'charoff'},
    'vAlign'
  ]
});

define('HTMLTableCellElement', {
  tagNames: ['TH','TD'],
  proto: {
    get headers() {
      var cellIndex = this.cellIndex,
          headings  = [],
          siblings  = this.parentNode.getElementsByTagName(this.tagName);

      for (var i=0; i<siblings.length; i++) {
        if (siblings.item(i).cellIndex >= cellIndex) {
          break;
        }
        headings.push(siblings.item(i).id);
      }

      return headings.join(' ');
    },
    get cellIndex() {
      return closest(this, 'TR').cells.toArray().indexOf(this);
    }
  },
  attributes: [
    'abbr',
    'align',
    'axis',
    'bgColor',
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
  */
    var _setAttribute = core.HTMLFrameElement.prototype.setAttribute

    core.HTMLFrameElement.prototype.setAttribute = function(name, value) {
      _setAttribute.call(this, name, value);
      if (name === "src") {

        if (this._contentDocument) {
          delete this._contentDocument; // TODO: better cleanup
        }
        this._contentDocument = new (core.HTMLDocument)();
        this._contentDocument.URL = value;
        var self = this;

        this.ownerDocument.addBlocker(this);

        if (this.ownerDocument.URL.indexOf("file://") !== -1) {
          var pathToFile = this.ownerDocument.URL.replace("file://","");

          // handle relative links
          if (value.indexOf("://") === -1) {
            // Prepare for hack sauce
            var split = pathToFile.split('/');
            split.pop(); // clean off the filename
            split.push(value);
            pathToFile = split.join("/");
          }
          
          readFile(function(err, data) {
            if (err) {
              console.log(err);
              this.ownerDocument.removeBlocker(this);
              return;
            }

            parser    = require('htmlparser'),
            HtmlToDom = require(__dirname + '/../../../lib/jsdom/' +
                                'browser/htmltodom').HtmlToDom,
            html2dom  = new HtmlToDom(parser);

            html2dom.appendHtmlToElement(data.toString(), self._contentDocument);
            this.ownerDocument.removeBlocker(this);
          });

        // Handle Urls
        } else {
          
        }
      }
    };
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
