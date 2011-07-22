var core      = require("./core").dom.level2.core,
    events    = require("./core").dom.level2.events,
    URL       = require("url"),
    Path      = require('path'),
    fs        = require("fs"),
    http      = require('http'),
    https      = require('https');

// Setup the javascript language processor
core.languageProcessors = {
  javascript : require("./languages/javascript").javascript
};

core.resourceLoader = {
  load: function(element, href, callback) {
    var ownerImplementation = element._ownerDocument.implementation;

    if (ownerImplementation.hasFeature('FetchExternalResources', element.tagName.toLowerCase())) {
      var full = this.resolve(element._ownerDocument, href);
      url = URL.parse(full);
      if (url.hostname) {
        this.download(url, this.baseUrl(element._ownerDocument), this.enqueue(element, callback, full));
      }
      else {
        this.readFile(url.pathname, this.enqueue(element, callback, full));
      }
    }
  },
  enqueue: function(element, callback, filename) {
    var loader = this,
        doc    = element.nodeType === core.Node.DOCUMENT_NODE ?
                 element                :
                 element._ownerDocument;

    if (!doc._queue) {
      return function() {};
    }

    return doc._queue.push(function(err, data) {
      var ev = doc.createEvent('HTMLEvents');

      if (!err) {
        try {
          callback.call(element, data, filename || doc.URL);
          ev.initEvent('load', false, false);
        }
        catch(e) {
          err = e;
        }
      }

      if (err) {
        ev.initEvent('error', false, false);
        ev.error = err;
      }

      element.dispatchEvent(ev);
    });
  },

  baseUrl: function(document) {
    var baseElements = document.getElementsByTagName('base'),
        baseUrl      = document.URL;

    if (baseElements.length > 0) {
      baseUrl = baseElements.item(0).href;
    }

    return baseUrl;
  },
  resolve: function(document, href) {
    if (href.match(/^\w+:\/\//)) {
      return href;
    }

    var baseUrl = this.baseUrl(document);

    // See RFC 2396 section 3 for this weirdness. URLs without protocol
    // have their protocol default to the current one.
    // http://www.ietf.org/rfc/rfc2396.txt
    if (href.match(/^\/\//)) {
      return baseUrl ? baseUrl.match(/^(\w+:)\/\//)[1] + href : null;
    } else if (!href.match(/^\/[^\/]/)) {
      href = href.replace(/^\//, "");
    }

    return URL.resolve(baseUrl, href);
  },
  download: function(url, referrer, callback) {
    var path    = url.pathname + (url.search || ''),
        options = {'method': 'GET', 'host': url.hostname, 'path': url.pathname},
        request;
    if (url.protocol === 'https:') {
      options.port = url.port || 443;
      request = https.request(options);
    } else {
      options.port = url.port || 80;
      request = http.request(options);
    }

    // set header.
    if(referrer) {
        request.setHeader('Referer', referrer);
    }

    request.on('response', function (response) {
      response.setEncoding('utf8');
      var data = '';
      response.on('data', function (chunk) {
        data += chunk.toString();
      });
      response.on('end', function() {
        if ([301, 302, 303, 307].indexOf(response.statusCode) > -1) {
          var redirect = URL.resolve(url, response.headers["location"]);
          core.resourceLoader.download(URL.parse(redirect), referrer, callback);
        } else {
          callback(null, data);
        }
      });
    });

    request.on('error', callback);
    request.end();
  },
  readFile: function(url, callback) {
    fs.readFile(url.replace(/^file:\/\//, ""), 'utf8', callback);
  }
};

core.CharacterData.prototype.__defineSetter__("_nodeValue", function(value) {
    this._text = value;
});

core.CharacterData.prototype.__defineGetter__("_nodeValue",function() {
  return this._text || "";
});

function define(elementClass, def) {
  var tagName = def.tagName,
    tagNames = def.tagNames || (tagName? [tagName] : []),
    parentClass = def.parentClass || core.HTMLElement,
    attrs = def.attributes || [],
    proto = def.proto || {};

  var elem = core[elementClass] = function(document, name) {
    parentClass.call(this, document, name || tagName.toUpperCase());
    if (elem._init) {
      elem._init.call(this);
    }
  };
  elem._init = def.init;

  elem.prototype = proto;
  elem.prototype.__proto__ = parentClass.prototype;

  attrs.forEach(function(n) {
      var prop = n.prop || n,
        attr = n.attr || prop.toLowerCase();

      if (!n.prop || n.read !== false) {
        elem.prototype.__defineGetter__(prop, function() {
          var s = this.getAttribute(attr);
          if (n.type && n.type === 'boolean') {
            return !!s;
          }
          if (n.type && n.type === 'long') {
            return +s;
          }
          if (n.normalize) {
            return n.normalize(s);
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
            var s = val.toString();
            if (n.normalize) {
              s = n.normalize(s);
            }
            this.setAttribute(attr, s);
          }
        });
      }
  });

  tagNames.forEach(function(tag) {
    core.Document.prototype._elementBuilders[tag.toLowerCase()] = function(doc, s) {
      var el = new elem(doc, s);
      return el;
    };
  });
}



core.HTMLCollection = function HTMLCollection(element, query) {
  core.NodeList.call(this, element, query);
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
    if (e.nodeName.toUpperCase() === tagName ||
        (e.tagName && e.tagName.toUpperCase() === tagName))
    {
      return e;
    }
    e = e._parentNode;
  }
  return null;
}

function descendants(e, tagName, recursive) {
  var owner = recursive ? e._ownerDocument || e : e;
  return new core.HTMLCollection(owner, core.mapper(e, function(n) {
    return n.nodeName === tagName;
  }, recursive));
}

function firstChild(e, tagName) {
  if (!e) {
    return null;
  }
  var c = descendants(e, tagName, false);
  return c.length > 0 ? c[0] : null;
}

function ResourceQueue(paused) {
  this.paused = !!paused;
}
ResourceQueue.prototype = {
  push: function(callback) {
    var q = this;
    var item = {
      prev: q.tail,
      check: function() {
        if (!q.paused && !this.prev &&
                         ((this.data !== null && this.data !== undefined) ||
                          (this.err !== null && this.err !== undefined))) {
          callback(this.err, this.data);
          q.tail = this.next;
          if (this.next) {
            this.next.prev = null;
            this.next.check();
          }
        }
      }
    };
    if (q.tail) {
      q.tail.next = item;
    }
    q.tail = item;
    return function(err, data) {
      item.err = err;
      item.data = data;
      item.check();
    };
  },
  resume: function() {
    this.paused = false;
    if (this.tail) {
      this.tail.check();
    }
  }
};

core.HTMLDocument = function HTMLDocument(options) {
  options = options || {};
  if (!options.contentType) {
    options.contentType = 'text/html';
  }
  core.Document.call(this, options);
  this._URL = options.url || '/';
  this._documentRoot = options.documentRoot || Path.dirname(this._URL);
  this._queue = new ResourceQueue(options.deferClose);
  this.readyState = 'loading';

  // Add level2 features
  this.implementation.addFeature('core'  , '2.0');
  this.implementation.addFeature('html'  , '2.0');
  this.implementation.addFeature('xhtml' , '2.0');
  this.implementation.addFeature('xml'   , '2.0');
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
  get images() {
    return this.getElementsByTagName('IMG');
  },
  get applets() {
    return new core.HTMLCollection(this, core.mapper(this, function(el) {
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
    return new core.HTMLCollection(this, core.mapper(this, function(el) {
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
    this._childNodes = [];
    this._documentElement = null;
    this._modified();
  },
  close : function() {
    this._queue.resume();
    // Set the readyState to 'complete' once all resources are loaded.
    // As a side-effect the document's load-event will be dispatched.
    core.resourceLoader.enqueue(this, function() {
      this.readyState = 'complete';
      var ev = this.createEvent('HTMLEvents');
      ev.initEvent('DOMContentLoaded', false, false);
      this.dispatchEvent(ev);
    })(null, true);
  },

  write : function(text) {
    if (this.readyState === "loading") {
      // During page loading, document.write appends to the current element
      // Find the last child that has been added to the document.
      var node = this;
      while (node.lastChild && node.lastChild.nodeType === this.ELEMENT_NODE) {
        node = node.lastChild;
      }
      node.innerHTML = text;
    } else {
      this.innerHTML = text;
    }
  },

  writeln : function(text) {
    this.write(text + '\n');
  },

  getElementsByName : function(elementName) {
    return new core.HTMLCollection(this, core.mapper(this, function(el) {
      return (el.getAttribute && el.getAttribute("name") === elementName);
    }));
  },

  get title() {
    var head = this.head,
      title = head ? firstChild(head, 'TITLE') : null;
    return title ? title.textContent : '';
  },

  set title(val) {
    var title = firstChild(this.head, 'TITLE');
    if (!title) {
      title = this.createElement('TITLE');
      var head = this.head;
      if (!head) {
        head = this.createElement('HEAD');
        this.documentElement.insertBefore(head, this.documentElement.firstChild);
      }
      head.appendChild(title);
    }
    title.textContent = val;
  },

  get head() {
    return firstChild(this.documentElement, 'HEAD');
  },

  set head() { /* noop */ },

  get body() {
    var body = firstChild(this.documentElement, 'BODY');
    if (!body) {
      body = firstChild(this.documentElement, 'FRAMESET');
    }
    return body;
  },

  get documentElement() {
    if (!this._documentElement) {
      this._documentElement = firstChild(this, 'HTML');
    }
    return this._documentElement;
  },

  _cookie : "",
  get cookie() { return this._cookie; },
  set cookie(val) { this._cookie = val; }
};
core.HTMLDocument.prototype.__proto__ = core.Document.prototype;

define('HTMLElement', {
  parentClass: core.Element,
  proto : {
    // Add default event behavior (click link to navigate, click button to submit
    // form, etc). We start by wrapping dispatchEvent so we can forward events to
    // the element's _eventDefault function (only events that did not incur
    // preventDefault).
    dispatchEvent : function (event) {
      var outcome = core.Node.prototype.dispatchEvent.call(this, event)

      if (!event._preventDefault     &&
          event.target._eventDefaults[event.type] &&
          typeof event.target._eventDefaults[event.type] === 'function')
      {
        event.target._eventDefaults[event.type](event)
      }
      return outcome;
    },
    _eventDefaults : {}
  },
  attributes: [
    'id',
    'title',
    'lang',
    'dir',
    {prop: 'className', attr: 'class', normalize: function(s) { return s || ''; }}
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
      return new core.HTMLCollection(this._ownerDocument, core.mapper(this, function(e) {
        return listedElements.test(e.nodeName) ; // TODO exclude <input type="image">
      }));
    },
    get length() {
      return this.elements.length;
    },
    _dispatchSubmitEvent: function() {
      var ev = this._ownerDocument.createEvent('HTMLEvents');
      ev.initEvent('submit', true, true);
      if (!this.dispatchEvent(ev)) {
        this.submit();
      };
    },
    submit: function() {
    },
    reset: function() {
      this.elements.toArray().forEach(function(el) {
        el.value = el.defaultValue;
      });
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
  proto: {
    get href() {
      return core.resourceLoader.resolve(this._ownerDocument, this.getAttribute('href'));
    }
  },
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
      return new core.HTMLOptionsCollection(this, core.mapper(this, function(n) {
        return n.nodeName === 'OPTION';
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
      var self = this;
      this.options.toArray().forEach(function(option) {
        if (option.value === val) {
          option.selected = true;
        } else {
          if (!self.hasAttribute('multiple')) {
            // Remove the selected bit from all other options in this group
            // if the multiple attr is not present on the select
            option.selected = false;
          }
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
        el._parentNode.removeChild(el);
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
  init: function() {
    this.addEventListener('DOMAttrModified', function(e) {
      if (e.attrName === 'selected')
        this.selected = this.defaultSelected;
    });
  },
  proto: {
    get form() {
      return closest(this, 'FORM');
    },
    get defaultSelected() {
      return !!this.getAttribute('selected');
    },
    set defaultSelected(s) {
      if (s) this.setAttribute('selected', 'selected');
      else this.removeAttribute('selected');
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
      if (this._selected === undefined) {
        this._selected = this.defaultSelected;
      }
      return this._selected;
    },
    set selected(s) {
      // TODO: The 'selected' content attribute is the initial value of the
      // IDL attribute, but the IDL attribute should not relfect the content
      this._selected = !!s;
      if (s) {
        //Remove the selected bit from all other options in this select
        var select = this._parentNode;
        if (!select) return;
        if (select.nodeName !== 'SELECT') {
          select = select._parentNode;
          if (!select) return;
          if (select.nodeName !== 'SELECT') return;
        }
        if (!select.multiple) {
          var o = select.options;
          for (var i = 0; i < o.length; i++) {
            if (o[i] !== this) {
                o[i].selected = false;
            }
          }
        }
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
        var attr = this.getAttributeNode('value');
        this._defaultValue = attr ? attr.value : null;
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
      if (val === null) {
        this.removeAttribute('value');
      }
      else {
        this.setAttribute('value', val);
      }
    },
    blur: function() {
    },
    focus: function() {
    },
    select: function() {
    },
    click: function() {
      if (this.type === 'checkbox' || this.type === 'radio') {
        this.checked = !this.checked;
      }
      else if (this.type === 'submit') {
        var form = this.form;
        if (form) {
          form._dispatchSubmitEvent();
        }
      }
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
    {prop: 'type', normalize: function(val) {
        return val ? val.toLowerCase() : 'text';
    }},
    'useMap'
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
      return core.resourceLoader.resolve(this._ownerDocument, this.getAttribute('href'));
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
  init: function() {
    this.addEventListener('DOMNodeInsertedIntoDocument', function() {
      if (this.src) {
        core.resourceLoader.load(this, this.src, this._eval);
      }
      else {
        var src = this.sourceLocation || {},
            filename = src.file || this._ownerDocument.URL;

        if (src) {
          filename += ':' + src.line + ':' + src.col;
        }
        filename += '<script>';

        core.resourceLoader.enqueue(this, this._eval, filename)(null, this.text);
      }
    });
  },
  proto: {
    _eval: function(text, filename) {
      if (this._ownerDocument.implementation.hasFeature("ProcessExternalResources", "script") &&
          this.language                                                                      &&
          core.languageProcessors[this.language])
      {
        core.languageProcessors[this.language](this, text, filename);
      }
    },
    get language() {
      var type = this.type || "text/javascript";
      return type.split("/").pop().toLowerCase();
    },
    get text() {
      var i=0, children = this.childNodes, l = children.length, ret = [];

      for (i; i<l; i++) {
        ret.push(children.item(i).value);
      }

      return ret.join("");
    },
    set text(text) {
      if (this.childNodes.length > 0) {
        var l = this.childNodes.length, i;
        for (i; i<l; i++) {
          this.removeChild(this.childNodes[i]);
        }
      }
      this.appendChild(this._ownerDocument.createTextNode(text));
    }
  },
  attributes : [
    {prop: 'defer', 'type': 'boolean'},
    'htmlFor',
    'event',
    'charset',
    'type',
    'src'
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
        this._rows = new core.HTMLCollection(this._ownerDocument, function() {
          var sections = [table.tHead].concat(table.tBodies.toArray(), table.tFoot).filter(function(s) { return !!s });

          if (sections.length === 0) {
            return core.mapDOMNodes(table, false, function(el) {
              return el.tagName === 'TR';
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
        el = this._ownerDocument.createElement('THEAD');
        this.appendChild(el);
      }
      return el;
    },
    deleteTHead: function() {
      var el = this.tHead;
      if (el) {
        el._parentNode.removeChild(el);
      }
    },
    createTFoot: function() {
      var el = this.tFoot;
      if (!el) {
        el = this._ownerDocument.createElement('TFOOT');
        this.appendChild(el);
      }
      return el;
    },
    deleteTFoot: function() {
      var el = this.tFoot;
      if (el) {
        el._parentNode.removeChild(el);
      }
    },
    createCaption: function() {
      var el = this.caption;
      if (!el) {
        el = this._ownerDocument.createElement('CAPTION');
        this.appendChild(el);
      }
      return el;
    },
    deleteCaption: function() {
      var c = this.caption;
      if (c) {
        c._parentNode.removeChild(c);
      }
    },
    insertRow: function(index) {
      var tr = this._ownerDocument.createElement('TR');
      if (this.childNodes.length === 0) {
        this.appendChild(this._ownerDocument.createElement('TBODY'));
      }
      var rows = this.rows.toArray();
      if (index < -1 || index > rows.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      if (index === -1 || (index === 0 && rows.length === 0)) {
        this.tBodies.item(0).appendChild(tr);
      }
      else if (index === rows.length) {
        var ref = rows[index-1];
        ref._parentNode.appendChild(tr);
      }
      else {
        var ref = rows[index];
        ref._parentNode.insertBefore(tr, ref);
      }
      return tr;
    },
    deleteRow: function(index) {
      var rows = this.rows.toArray(), l = rows.length;
      if (index === -1) {
        index = l-1;
      }
      if (index < 0 || index >= l) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      var tr = rows[index];
      tr._parentNode.removeChild(tr);
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
      var tr = this._ownerDocument.createElement('TR');
      var rows = this.rows.toArray();
      if (index < -1 || index > rows.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      if (index === -1 || index === rows.length) {
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
      if (index === -1) {
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
        this._cells = new core.HTMLCollection(this, core.mapper(this, function(n) {
          return n.nodeName === 'TD' || n.nodeName === 'TH';
        }, false));
      }
      return this._cells;
    },
    get rowIndex() {
      return closest(this, 'TABLE').rows.toArray().indexOf(this);
    },

    get sectionRowIndex() {
      return this._parentNode.rows.toArray().indexOf(this);
    },
    insertCell: function(index) {
      var td = this._ownerDocument.createElement('TD');
      var cells = this.cells.toArray();
      if (index < -1 || index > cells.length) {
        throw new core.DOMException(core.INDEX_SIZE_ERR);
      }
      if (index === -1 || index === cells.length) {
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
      if (index === -1) {
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
    _headers: null,
    set headers(h) {
      if (h === '') {
        //Handle resetting headers so the dynamic getter returns a query
        this._headers = null;
        return;
      }
      if (!(h instanceof Array)) {
        h = [h];
      }
      this._headers = h;
    },
    get headers() {
      if (this._headers) {
        return this._headers.join(' ');
      }
      var cellIndex = this.cellIndex,
          headings  = [],
          siblings  = this._parentNode.getElementsByTagName(this.tagName);

      for (var i=0; i<siblings.length; i++) {
        if (siblings.item(i).cellIndex >= cellIndex) {
          break;
        }
        headings.push(siblings.item(i).id);
      }
      this._headers = headings;
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
  proto: {
    setAttribute: function(name, value) {
      core.HTMLElement.prototype.setAttribute.call(this, name, value);
      if (name === "src") {
        if (this._contentDocument) {
          delete this._contentDocument; // TODO: better cleanup
        }
        this._contentDocument = new core.HTMLDocument({
          url: value,
          documentRoot: this._ownerDocument._documentRoot
        });

        core.resourceLoader.load(this, value, function(html, filename) {
          this._contentDocument.write(html);
          this._contentDocument.close();
        });
      }
    },
    _contentDocument : null,
    get contentDocument() {
      return this._contentDocument;
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
  parentClass: core.HTMLFrameElement,
  proto: {
    _contentDocument : null,
    get contentDocument() {
      if (this._contentDocument === null) {
        this._contentDocument = new core.HTMLDocument();
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

