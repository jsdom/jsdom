var sys           = require('sys'),
    http          = require('http'),
    URL           = require('url'),
    HtmlToDom     = require('./htmltodom').HtmlToDom,
    domToHtml     = require('./domtohtml').domToHtml,
    htmlencoding  = require('./htmlencoding'),
    HTMLEncode    = htmlencoding.HTMLEncode,
    HTMLDecode    = htmlencoding.HTMLDecode,
    jsdom         = require('../../jsdom');

function NOT_IMPLEMENTED(target) {
  return function() {
    if (!jsdom.debugMode) {
      var trigger = target ? target.trigger : this.trigger;
      trigger.call(this, 'error', 'NOT IMPLEMENTED');
    }
  }
}

/**
 * Creates a window having a document. The document can be passed as option,
 * if omitted, a new document will be created.
 */
exports.windowAugmentation = function(dom, options) {
  options = options || {};
  var window = exports.createWindow(dom, options);

  if (!options.document) {
    var browser = browserAugmentation(dom, options);

    if (options.features && options.features.QuerySelector) {
      require(__dirname + "/../selectors/index").applyQuerySelectorPrototype(browser);
    }

    options.document = (browser.HTMLDocument)             ?
                        new browser.HTMLDocument(options) :
                        new browser.Document(options);



    options.document.write('<html><head></head><body></body></html>');
  }

  var doc = window.document = options.document;

  if (doc.addEventListener) {
    if (doc.readyState == 'complete') {
      var ev = doc.createEvent('HTMLEvents');
      ev.initEvent('load', false, false);
      window.dispatchEvent(ev);
    }
    else {
      doc.addEventListener('load', function(ev) {
        window.dispatchEvent(ev);
      });
    }
  }

  return window;
};

/**
 * Creates a document-less window.
 */
exports.createWindow = function(dom, options) {

  function DOMWindow(options) {
    this.frames = [this];
    this.contentWindow = this;
    this.window = this;
    this.self = this;
	
    var href = (options || {}).url || 'file://' + __filename;
    this.location = URL.parse(href);
    this.location.reload = NOT_IMPLEMENTED(this);
    this.location.replace = NOT_IMPLEMENTED(this);
    this.location.toString = function() {
      return href;
    };

    var window = this.console._window = this;

    if (options && options.document) {
      options.document.location = this.location;
    }
    this.addEventListener = function() {
      this.Node.prototype.addEventListener.apply(window, arguments);
    };
    this.dispatchEvent = function() {
      this.Node.prototype.dispatchEvent.apply(window, arguments);
    };
  }

  DOMWindow.prototype = {
    __proto__: dom,
    get document() {
      return this._document;
    },
    set document(value) {
      this._document = value;
      if (value) {
        value.parentWindow = this;
      }
    },
    trigger: function() {
      this.document.trigger.apply(this._document, arguments);
    },
    getComputedStyle: function(node) {
	//modif ew
      return node.style;
	  //modif ew
    },
    console: {
      log:   function(message) { this._window.trigger('log',   message);console.log('Log : '+message);},
      info:  function(message) { this._window.trigger('info',  message);console.log('Info : '+message); },
      warn:  function(message) { this._window.trigger('warn',  message);console.log('Warn : '+message); },
      error: function(message) { this._window.trigger('error', message);console.log('Error : '+message); }
    },
    navigator: {
      userAgent: 'Node.js (' + process.platform + '; U; rv:' + process.version + ')',
      appName: 'Node.js jsDom',
      platform: process.platform,
      appVersion: process.version
    },
    XMLHttpRequest: function XMLHttpRequest() {},
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    clearTimeout: clearTimeout,
    name: 'nodejs',
    innerWidth: 1024,
    innerHeight: 768,
    length: 1,
    outerWidth: 1024,
    outerHeight: 768,
    pageXOffset: 0,
    pageYOffset: 0,
    screenX: 0,
    screenY: 0,
    screenLeft: 0,
    screenTop: 0,
    scrollX: 0,
    scrollY: 0,
    scrollTop: 0,
    scrollLeft: 0,
    alert: NOT_IMPLEMENTED(),
    blur: NOT_IMPLEMENTED(),
    close: NOT_IMPLEMENTED(),
    confirm: NOT_IMPLEMENTED(),
    createPopup: NOT_IMPLEMENTED(),
    focus: NOT_IMPLEMENTED(),
    moveBy: NOT_IMPLEMENTED(),
    moveTo: NOT_IMPLEMENTED(),
    open: NOT_IMPLEMENTED(),
    print: NOT_IMPLEMENTED(),
    prompt: NOT_IMPLEMENTED(),
    resizeBy: NOT_IMPLEMENTED(),
    resizeTo: NOT_IMPLEMENTED(),
    scroll: NOT_IMPLEMENTED(),
    scrollBy: NOT_IMPLEMENTED(),
    scrollTo: NOT_IMPLEMENTED(),
    screen : {
      width : 0,
      height : 0
    },
    Image : NOT_IMPLEMENTED()
  };
  return new DOMWindow(options);
};

//Caching for HTMLParser require. HUGE performace boost.
/**
* 5000 iterations
* Without cache: ~1800+ms
* With cache: ~80ms
*/
var defaultParser = null;
function getDefaultParser() {
  if (defaultParser === null) {
    try {
      defaultParser = require('htmlparser');
    }
    catch (e) {
      try {
        defaultParser = require('node-htmlparser/lib/node-htmlparser');
      }
      catch (e2) {
        defaultParser = undefined;
      }
    }
  }
  return defaultParser;
}

/**
 * Augments the given DOM by adding browser-specific properties and methods (BOM).
 * Returns the augmented DOM.
 */
var browserAugmentation = exports.browserAugmentation = function(dom, options) {

  if (dom._augmented) {
    return dom;
  }

  if(!options) {
    options = {};
  }

  // set up html parser - use a provided one or try and load from library
  var htmltodom = new HtmlToDom(options.parser || getDefaultParser());

  if (!dom.HTMLDocument) {
    dom.HTMLDocument = dom.Document;
  }
  if (!dom.HTMLDocument.prototype.write) {
    dom.HTMLDocument.prototype.write = function(html) {
      this.innerHTML = html;
    };
  }

  dom.Element.prototype.getElementsByClassName = function(className) {

    function filterByClassName(child) {
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

    return new dom.NodeList(this.ownerDocument || this, dom.mapper(this, filterByClassName));
  };

  dom.Element.prototype.__defineGetter__('sourceIndex', function() {
    /*
    * According to QuirksMode:
    * Get the sourceIndex of element x. This is also the index number for
    * the element in the document.getElementsByTagName('*') array.
    * http://www.quirksmode.org/dom/w3c_core.html#t77
    */
    var items = this.ownerDocument.getElementsByTagName('*'),
        len = items.length;

    for (var i = 0; i < len; i++) {
      if (items[i] === this) {
        return i;
      }
    }
  });

  dom.Document.prototype.__defineGetter__('outerHTML', function() {
    return domToHtml(this);
  });

  dom.Element.prototype.__defineGetter__('outerHTML', function() {
    return domToHtml(this);
  });

  dom.Element.prototype.__defineGetter__('innerHTML', function() {
    return domToHtml(this._childNodes, true);
  });
  dom.Element.prototype.__defineSetter__('doctype', function() {
    throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
  });
  dom.Element.prototype.__defineGetter__('doctype', function() {
    var r = null;
    if (this.nodeName == '#document') {
        if (this._doctype) {
         r = this._doctype;
        }
    }
    return r;
  });

  dom.Element.prototype.__defineSetter__('innerHTML', function(html) {
    //Check for lib first

    if (html === null) {
      return null;
    }

    //Clear the children first:
    var child;
    while ((child = this._childNodes[0])) {
      this.removeChild(child);
    }

    if (this.nodeName === '#document') {
      parseDocType(this, html);
    }
    var nodes = htmltodom.appendHtmlToElement(html, this);
    return html;
  });

//modif

var lastChildCont=function() {

Array.prototype.inArray=function(xvalue)
{
for (var i=0; i < this.length; i++) {
if (this[i] === xvalue){
return true;
}
}
return false;
};

var isCont=function(obj) {

if (obj.nodeType!=obj.ELEMENT_NODE) {return false;};

var noCont=['script','style','br','head','meta','title','link','base','noscript','#text','#comment'];

if (noCont.inArray(obj.nodeName.toLowerCase()))
{
return false;
} else {
return true;
}

};

var dummyDiv=function(obj) {

var tmp=document.createElement('DIV');
obj.appendChild(tmp);
return tmp;

};

if (this.lastChild==null) {
return (null);
};

var tmp=[];

while (!isCont(this.lastChild)) //while lastChild is not a node container
{
tmp.push(this.lastChild);
this.removeChild(this.lastChild) //remove lastChild and check new last Child
};

var obj=null;

if (this.childNodes.length>0) //if one child node container found
{
obj=this.lastChild;
} else {
obj=dummyDiv(this); //if no child is a container, create dummy div
};

for (var i=0;i<tmp.length;i++) //reattach childs
{
this.appendChild(tmp[i]);
};

return obj;

};

dom.Document.prototype.__defineGetter__('lastChildCont', lastChildCont);

dom.Element.prototype.__defineGetter__('lastChildCont', lastChildCont);

var pixel=function(size,SIZE) {
var tmp=size.substr(size.length-2,2);
switch(tmp) {
case 'px': return size.substr(0,size.length-2);
case '%'||'em': return parseInt(size.substr(0,size.length-3)*SIZE/100);
};
return size;
};

dom.Element.prototype.__defineGetter__('offsetWidth', function() {
//approximation offsetwidth calculation
var tmp=this._ownerDocument.parentWindow.getComputedStyle(this).getPropertyValue('width');
if (!tmp) {
tmp=this.getAttribute('width');
}; 

if (!tmp) {
return 320;
} else {
return pixel(tmp,this._ownerDocument.parentWindow.screen.width);
};
});

dom.Element.prototype.__defineGetter__('offsetHeight', function() {
//approximation offsetheight calculation
var tmp=this._ownerDocument.parentWindow.getComputedStyle(this).getPropertyValue('height');
if (!tmp) {
tmp=this.getAttribute('height');
};

if (!tmp) {
return 480;
} else {
return pixel(tmp,this._ownerDocument.parentWindow.screen.height);
};
});

//modif

  dom.Document.prototype.__defineGetter__('innerHTML', function() {
    return domToHtml(this._childNodes, true);
  });

  dom.Document.prototype.__defineSetter__('innerHTML', function(html) {
    //Check for lib first

    if (html === null) {
      return null;
    }

    //Clear the children first:
    var child;
    while ((child = this._childNodes[0])) {
      this.removeChild(child);
    }

    if (this.nodeName === '#document') {
      parseDocType(this, html);
    }
	
    var nodes = htmltodom.appendHtmlToElement(html, this);
    return html;
  });

  var DOC_HTML5 = /<!doctype html>/i,
      DOC_TYPE = /<!DOCTYPE (\w.*)">/i;

  function parseDocType(doc, html) {
    var publicID = '',
        systemID = '',
        fullDT = '',
        name = 'HTML',
        set = true,
        html5DT = html.match(DOC_HTML5),
        dt = html.match(DOC_TYPE);

    //Default, No doctype === null
    doc._doctype = null;

    if (html5DT && html5DT[0]) { //Handle the HTML shorty doctype
      fullDT = html5DT[0];
    }
    else if (dt && dt[1]) { //Parse the doctype
      fullDT = dt[0];
      dt = dt[1].split(' "');
      var _id1 = dt.pop().replace(/"/g, ''),
          _id2 = dt.pop().replace(/"/g, '');

      if (_id1.indexOf('-//') !== -1) {
        publicID = _id1;
      }
      if (_id2.indexOf('-//') !== -1) {
        publicID = _id2;
      }
      if (_id1.indexOf('://') !== -1) {
        systemID = _id1;
      }
      if (_id2.indexOf('://') !== -1) {
        systemID = _id2;
      }
      if (dt.length) {
        dt = dt[0].split(' ');
        name = dt[0].toUpperCase();
      }
    }
    else {
      //No DocType found
      return;
    }
    doc._doctype = new dom.DOMImplementation().createDocumentType(name, publicID, systemID);
    doc._doctype._ownerDocument = doc;
    doc._doctype._fullDT = fullDT;
    doc._doctype.toString = function() {
      return this._fullDT;
    };
  }

  dom.Document.prototype.getElementsByClassName = function(className) {

    function filterByClassName(child) {
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

    return new dom.NodeList(this.ownerDocument || this, dom.mapper(this, filterByClassName));
  };

  dom.Element.prototype.__defineGetter__('nodeName', function(val) {
    return this._nodeName.toUpperCase();
  });

  dom.Element.prototype.__defineGetter__('tagName', function(val) {
    var t = this._tagName.toUpperCase();
    //Document should not return a tagName
    if (this.nodeName === '#document') {
      t = null;
    }
    return t;
  });

  dom.Element.prototype.scrollTop = 0;
  dom.Element.prototype.scrollLeft = 0;

  dom.Document.prototype.__defineGetter__('parentWindow', function() {
    if (!this._parentWindow) {
      this._parentWindow = exports.windowAugmentation(dom, {document: this, url: this.URL});
    }
    return this._parentWindow;
  });

  dom.Document.prototype.__defineSetter__('parentWindow', function(window) {
    this._parentWindow = window;
  });

  dom.Document.prototype.__defineGetter__('defaultView', function() {
    return this.parentWindow;
  });

  dom._augmented = true;
  return dom;
};
