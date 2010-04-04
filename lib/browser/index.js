var htmlparser = require('node-htmlparser'),
    sys = require('sys');

//Needed so Node doesn't bomb on printing the Array-like objects

Array.prototype.toString = function() {
    return '[ Array ]: ' + this.length;
};


exports.browserAugmentation = function(dom) {

    var formatHTML = function(html) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        html = html.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        html.split('\r\n').forEach(function(node, index) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

    //Make configurable from docType??
    var isXHTML = false;

    //List from node-htmlparser
    var singleTags = {
        area: 1,
        base: 1,
        basefont: 1,
        br: 1,
        col: 1,
        frame: 1,
        hr: 1,
        img: 1,
        input: 1,
        isindex: 1,
        link: 1,
        meta: 1,
        param: 1,
        embed: 1       
    };

  /***************************************
  * Utility Functions                    *
  ***************************************/
    var stringifyElement = function(element) {
        //sys.puts('Stringify HTML for: ' + element);
        var tagName = element.tagName.toLowerCase(),
        ret = {
            start: "<" + tagName,
            end:''
        }, attributes = [], i,
        attribute = null;
    
        //sys.puts('Checking Attributes: ' + element._attributes.length);
        //sys.puts(sys.inspect(element));
        if (element.attributes.length) {
            ret.start += " ";
            for (i = 0; i<element.attributes.length; i++) {
                attribute = element.attributes.item(i);
                attributes.push(attribute.name + '="' + attribute.nodeValue + '"');
            }
            //sys.puts('attributes: ' + sys.inspect(attributes));
        }
        ret.start += attributes.join(" ");

        if (isXHTML) {
            if (singleTags[tagName]) {
                ret.start += "/";
            }
        }
        ret.start += ">";
        if (!singleTags[tagName]) {
            ret.end = "</" + tagName + ">";
        }
        return ret;
    };

  var generateHtmlRecursive = function(element) {
        //sys.puts('Generating HTML for: ' + element);
    if (element          &&
        element.nodeType && 
        element.nodeType === dom.Node.prototype.ENTITY_REFERENCE_NODE) 
    {
      element = element._entity;
    }

    // TODO: Optimize me.
    var ret = "";
    switch (element.nodeType)
    {
      case dom.Node.prototype.ELEMENT_NODE:
        var current = stringifyElement(element);
        ret += current.start;

        if (element.childNodes.length > 0) {
          for (var i=0; i<element.childNodes.length; i++)
          {
             ret += generateHtmlRecursive(element.childNodes.item(i));  
          }
        } else {
          ret += element.nodeValue || "" ;
        }
        ret += current.end;
      break;
      case dom.Node.prototype.TEXT_NODE:

        ret += element.nodeValue;
        
      break; 
    }      
    return ret;
  };


  /***************************************
  * Browser Augmentation                 *
  ***************************************/
  
  dom.Element.prototype.getElementsByClassName = function(class) {

    var queryFunction = function(child) {
      if (!child) {
        return false;
      }
      
      if (child.nodeType && 
          child.nodeType === dom.Node.prototype.ENTITY_REFERENCE_NODE) 
      {
        child = child._entity;
      }
      
      var className = child.className;
      if (className) {
        var s = className.split(" ");
        for (var i=0; i<s.length; i++) {
          if (s[i] === class) {
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

  dom.Element.prototype.__defineSetter__("id", function(id) {
    this.setAttribute("id", id);
    id = this.getAttribute("id"); //Passed validation
    if (!this._ownerDocument._ids) {
        this._ownerDocument._ids = {};
    }
    if (id === '') {
        delete this._ownerDocument._ids[id];
    } else {
        this._ownerDocument._ids[id] = this;
    }
  });
  
  dom.Element.prototype.__defineGetter__("id",function() {
    return this.getAttribute("id");
  });

  dom.Document.prototype.getElementById = function(id) {
    return this._ids[id];
  };
  
  dom.Element.prototype.__defineGetter__('sourceIndex', function() {
    return 0;
  });

  dom.Element.prototype.__defineGetter__('outerHTML', function() {
    return formatHTML(generateHtmlRecursive(this));
  });

  dom.Element.prototype.__defineGetter__('innerHTML', function() {
    var children = this.childNodes,
        length   = children.length,
        i        = 0,
        ret      = "",
        child;
    for (i;i<length;i++)
    {
      child = children.item(i);
      ret  += generateHtmlRecursive(child);      
    }
    return ret;
  });

dom.Element.prototype.__defineSetter__('innerHTML', function(rawHtml) {
    //sys.puts('innerHTML Setter');
    if (rawHtml === null) {
        return null;
    }
    if (typeof rawHtml !== 'string') {
        rawHtml +='';
    }
    rawHtml = rawHtml.replace(/\n/gm, '');
    rawHtml = rawHtml.replace(/  /gm, '');

    //Clear the children first:
    for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].parentNode) {
            this.childNodes[i].parentNode.removeChild(this.childNodes[i]);
        }
    }
    
    var htmlDom = htmlparser.ParseHtml(rawHtml);
    var count = 0;
    
    //sys.puts(sys.inspect(htmlDom, false, null));
    
    var setChild = function(node) {
        //sys.puts('setChild: ' + node.type + ' :: ' + node.raw);
        var newNode;
        if (node.type == 'tag') {
            newNode = this.ownerDocument.createElement(node.name);
        }
        if (node.type == 'text') {
            newNode = this.ownerDocument.createTextNode(node.data);
        }
        if (node.attribs && newNode) {
            for (var c in node.attribs) {
                if (c == 'id') {
                    count++;
                    //sys.puts('setting id: ' + node.attribs[c]);
                }
                newNode.setAttribute(c, node.attribs[c]);
            }
        }
        if (node.children && newNode) {
            for (var c = 0; c < node.children.length; c++) {
                setChild.call(newNode, node.children[c]);
            }
        }
        return this.appendChild(newNode);
    };
    for (var i = 0; i < htmlDom.length; i++) {
        setChild.call(this, htmlDom[i]);
    }
    //sys.puts('set (' + count + ') ids');
    //sys.puts('OUT: ' + this.outerHTML);
    return this.outerHTML;
});


  dom.Document.prototype.__defineGetter__("body", function() {
    return this.getElementsByTagName("body").item(0);
  });
  


    dom.Element.prototype.focus = function() {
    };
    dom.Element.prototype.blur = function() {
    };

    dom.Element.prototype.__defineGetter__('nodeName', function(val) {
        return this._nodeName.toUpperCase();
    });
    dom.Element.prototype.__defineGetter__('tagName', function(val) {
        return this._tagName.toUpperCase();
    });
  
    dom.Element.prototype.__defineSetter__("lang", function(val) {
        this.setAttribute("lang", val);
    });
  
    dom.Element.prototype.__defineGetter__("lang",function() {
        return this.getAttribute("lang");
    });
    dom.Element.prototype.__defineSetter__("className", function(className) {
        this.setAttribute("class", className);
    });
  
    dom.Element.prototype.__defineGetter__("className",function() {
        return this.getAttribute("class");
    });

    dom.Element.prototype.__defineGetter__('disabled', function() {
        return this.getAttribute('disabled') || false;
    });

    dom.Element.prototype.__defineSetter__('disabled', function(val) {
        return this.setAttribute('disabled', val);
    });

    dom.Element.prototype.__defineGetter__('selected', function() {
        return this.getAttribute('selected') || false;
    });

    dom.Element.prototype.__defineSetter__('selected', function(val) {
        return this.setAttribute('selected', val);
    });

    dom.Element.prototype.__defineGetter__('checked', function() {
        return this.getAttribute('checked') || false;
    });

    dom.Element.prototype.__defineSetter__('checked', function(val) {
        return this.setAttribute('checked', val);
    });

    dom.Element.prototype.__defineGetter__('name', function() {
        return this.getAttribute('name');
    });

    dom.Element.prototype.__defineSetter__('name', function(val) {
        return this.setAttribute('name', val);
    });

    dom.Element.prototype.__defineGetter__('type', function() {
        return this.getAttribute('type');
    });

    dom.Element.prototype.__defineSetter__('type', function(val) {
        return this.setAttribute('type', val);
    });

    dom.Element.prototype.__defineGetter__('selected', function() {
        return this.getAttribute('selected') || false;
    });

    dom.Element.prototype.__defineSetter__('selected', function(val) {
        return this.setAttribute('selected', val);
    });


    dom.Element.prototype.__defineGetter__('selectedIndex', function() {
        if (this.tagName.toUpperCase() == 'SELECT') {
        } else {
            //Throw Error
        }
    });

    dom.Element.prototype.__defineSetter__('selectedIndex', function() {

    });

    dom.Element.prototype.__defineGetter__('value', function() {
        var val = this.getAttribute('value') || this.nodeValue;
        if (this.tagName.toUpperCase() == 'TEXTAREA') {
            val = this.innerHTML;
        }
        if (this.tagName.toUpperCase() == 'SELECT') {
            val = this.innerHTML;
        }
        return val;
    });

    dom.Element.prototype.__defineSetter__('value', function(val) {
        this.nodeValue = this.innerHTML = val;
        return this.setAttribute('value', val);
    });

    dom.Element.prototype.__defineGetter__('textContent', function() {
        //sys.puts('get textContent');
        var stripHTML = /<\S[^><]*>/g;
        //sys.puts(this.innerHTML);
        return this.innerHTML.replace(stripHTML, '');
        //return this.innerHTML;
    });
    dom.Element.prototype.__defineSetter__('textContent', function(txt) {
        //sys.puts('set textContent');
        this.innerHTML = txt;
        return txt;
    });

  return dom;
}
