var sys           = require('sys'),
    http          = require('http'),
    url           = require('url'),
    HtmlToDom     = require('./htmltodom').HtmlToDom,
    domToHtml     = require('./domtohtml').domToHtml,
    htmlencoding  = require('./htmlencoding'),
    HTMLEncode    = htmlencoding.HTMLEncode,
    HTMLDecode    = htmlencoding.HTMLDecode,
    _console      = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    };

exports.windowAugmentation = function(dom, options) {
  options = options || {};
  var window  = exports.createWindow(dom, options),
      setupDoc = (typeof options.document === 'undefined');

  if (setupDoc) {
    browser = browserAugmentation(dom, options),
    options.document = new (browser.Document)();
  }

  window.document = options.document;

  if (options.document.childNodes.length === 0) {
    window.document.appendChild(
        window.document.createElement("html")
    );
    var head = window.document.createElement('head');
    window.document.documentElement.appendChild(head);
    head.appendChild(
        window.document.createElement('title')
    );
    window.document.documentElement.appendChild(
      window.document.createElement('body')
    );
  }

  if (!window.document.addEventListener) {
      window.document.addEventListener = function() {};
  }

  window.console = _console;
  window.document.compareDocumentPosition = function() {};
  window.document.documentElement.style = {};
  window.document.documentElement.hasAttribute = true;
  return window;
}

exports.createWindow = function(dom, options) {
    options = options || {};
    var document,
        window = {
          get document() { return document },
          set document(doc) {
            document = doc;
            if (document) {
              document.defaultView  = window;
              document.parentWindow = window;
            }
          },
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
          scrollLeft: 0
        };

    window.frames = [window];
    window.contentWindow = window;
    window.addEventListener2 = function(type, fn, capture) {
      fn.apply(window);
    };

    window.getComputedStyle = function(node) {
    var s = node.style,
          cs = {};

      for (var n in s) {
          cs[n] = s[n];
      }
      cs.__proto__ = {
          getPropertyValue: function(name) {
              return node.style[name];
          }
      };
      return cs;
    };
    window.addEventListener = function() {};

    window.alert = function () {};
    window.blur = function () {};
    window.close = function () {};
    window.confirm = function () {};
    window.createPopup = function () {};
    window.focus = function () {};
    window.moveBy = function () {};
    window.moveTo = function () {};
    window.open = function () {};
    window.print = function () {};
    window.prompt = function () {};
    window.resizeBy = function () {};
    window.resizeTo = function () {};
    window.scroll = function () {};
    window.scrollBy = function () {};
    window.scrollTo = function () {};

    // Author: Swizec
    // some scripts expect a proper window.location; try parsing it from options.url
    if (options.url) {
  var host = options.url.split("://", 2)[1].split("/", 1)[0];
  window.location = { href: options.url,
          hash: (options.url.indexOf('#') > -1) ? "#"+options.url.split("#", 2)[1] : '',
          host: host,
          hostname: host.split(":", 2)[0],
          pathname: (function () {
        var path = options.url.split("://", 2)[1].split("/", 2)[1];
        return (path) ? path.split('#', 2)[0] : '';
          })(),
          port: (host.split(":", 2)[1]) ? host.split(":", 2)[1] : 80,
          protocol: options.url.split("://", 2)[0]+":",
          search: (options.url.indexOf('?') > -1) ? "?"+options.url.split("?", 2)[1] : '',
          // TODO: find a way to actually implement these
          reload: function () {},
          replace: function () {}
        }
    }else {
  window.location = { href: __filename };
    }

    window.navigator = {
      userAgent: 'Node.js (' + process.platform + '; U; rv:' + process.version + ')',
      appName: 'Node.js jsDom',
      platform: process.platform,
      appVersion: process.version
    };

    window.window = window;
    window.self   = window;

    window.close = function() {
        var len = document._nodes.length, i, el;
        for (i = 0; i < len; i++) {
            el = document._nodes[i];
            document._nodes[i] = null;
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
        delete document._attributes._parentNode;
        delete document._ownerDocument;
        delete document._children[0]._parentNode;
        delete document._children[0]._ownerDocument;
        delete document.defaultView;
        delete document.contentWindow;
        delete document.contentDocument;
        delete document.parentWindow;
        delete document._documentElement;

        delete window.self;
        delete window.window;
        delete window.contentWindow;
        delete window.document;
        len = window.frames.length;
        for (i = 0; i < len; i++) {
            if (window !== window.frames[i]) {
                window.frames[i].close();
            }
            delete window.frames[i];
        }
    };

    return window;
};

var htmlparser = null; //Caching for HTMLParser require. HUGE performace boost.
/**
* 5000 iterations
* Without cache: ~1800+ms
* With cache: ~80ms
*/

var browserAugmentation = exports.browserAugmentation = function(dom, options) {

  if(!options) options = {};

  // set up html parser - use a provided one or try and load from library

  var htmltodom;

  if(options.parser) {
    htmltodom = new HtmlToDom(options.parser);
  } else {
    try {
      if (!htmlparser) {//Only require once
          htmlparser = require('htmlparser');
      }
      htmltodom = new HtmlToDom(htmlparser);
    } catch(e) {
     try {
        htmlparser = require('node-htmlparser/lib/node-htmlparser');
        htmltodom = new HtmlToDom(htmlparser);
      } catch(e) {
        htmltodom = new HtmlToDom();
      }
    }
  }

  /***************************************
  * Browser Augmentation                 *
  ***************************************/


  if (!dom.Node.prototype.__proto__.addEventListener) {
      dom.Node.prototype.addEventListener = function(){};
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

    var disableLiveLists = this.ownerDocument &&
        this.ownerDocument.implementation &&
        this.ownerDocument.implementation.hasFeature("DisableLiveLists");

      return new dom.NodeList(dom.mapper(this, filterByClassName), !disableLiveLists);
  };

    dom.Document.prototype.__defineSetter__("title",function(value) {
        this.getElementsByTagName('title')[0].innerHTML = value;
        return value;
    });

    dom.Document.prototype.__defineGetter__("title",function() {
  // Swizec - sometimes there is no title
  var elements = this.getElementsByTagName('title');
  return (elements.length > 0) ? elements[0].innerHTML : '';
    });

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
    var html = domToHtml(this.documentElement);
    if (this.doctype) {
        html = this.doctype.toString() + '\n' + html;
    }
    return html;
  });

  dom.Element.prototype.__defineGetter__('outerHTML', function() {
    return domToHtml(this);
  });

  dom.Element.prototype.__defineGetter__('innerHTML', function() {
    return domToHtml(this.childNodes, true);
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
    for (var i = this.childNodes.length-1; i >= 0; i--) {
        if (this.childNodes[i].parentNode) {
            this.childNodes[i].parentNode.removeChild(this.childNodes[i]);
        }
    }
    if (this.nodeName === '#document') {
        parseDocType(this, html);
    }
    var nodes = htmltodom.appendHtmlToElement(html, this);
    return html;
});

var DOC_HTML5 = /<!doctype html>/is,
    DOC_TYPE = /<!DOCTYPE (\w.*)">/is;

var parseDocType = function(doc, html) {
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

    } else if (dt && dt[1]) { //Parse the doctype
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
    } else {
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

  dom.Document.prototype.__defineGetter__("body", function() {
    return this.getElementsByTagName("body").item(0);
  });

  dom.Document.prototype.__defineGetter__("head", function() {
    return this.getElementsByTagName("head").item(0);
  });

  // Author: Swizec
  // styleSheets is an interface to all of the css on a page
  // some scripts like readability.js expect this to exist
  dom.Document.prototype.__defineGetter__("styleSheets", function () {
    var styles = new Array(),
        nodes1 = this.getElementsByTagName("style"),
        nodes2 = (this.head) ? this.head.getElementsByTagName("link") : [],
        node;

    function StyleSheet(node) {
      this.cssText = node.textContent;
      this.disabled = false;
      this.href = (node.attributes['href']) ? node.attributes['href'] : '';
      this.media = (node.attributes['media']) ? node.attributes['media'] : 'screen';
      this.title = node.attributes['title'];
      this.type = node.attributes['type'];
    }

    for (var i=0; i < nodes1.length; i++ ) {
      node = nodes1.item(i);
      styles.push(new StyleSheet(node));
    }

    for (var i=0; i< nodes2.length; i++ ) {
      node = nodes2.item(i);
      if (node.attributes['rel'] == 'stylesheet') {
        styles.push(new StyleSheet(node));
      }
    }

    return styles;
  });

  dom.Document.prototype.console = _console;

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


    dom.Element.prototype.__defineGetter__('text', function() {
        if (this.attributes.getNamedItem('value')) {
            return this.value;
        } else {
            return this.innerHTML;
        }
    });
        
    dom.Element.prototype.__defineGetter__('textContent', function() {
        var stripHTML = /<\S[^><]*>/g;
        var out = this.innerHTML;
        //Remove all the HTML
        out = out.replace(stripHTML, '');
        //Now decode the encoded text content
        out = HTMLDecode(out);
        return out;
    });
    dom.Element.prototype.__defineSetter__('textContent', function(txt) {
        //Un encode all the entities
        txt = HTMLEncode(txt);
        //Set the content
        this.innerHTML = txt;
        return txt;
    });


  return dom;
}
