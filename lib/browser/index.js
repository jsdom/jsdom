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
        var stripHTML = /<\S[^><]*>/g; 
        var out = this.innerHTML;
        //Encode all the spaces
        out = out.replace(/&nbsp;/g, ' ');
        //Remove all the HTML 
        out = out.replace(stripHTML, '');
        //Now decode the encoded text content
        out = html_entity_decode(out);
        return out;
    });
    dom.Element.prototype.__defineSetter__('textContent', function(txt) {
        //Un encode all the entities
        txt = htmlentities(txt);
        //Now replace all the spaces with non-breaking spaces
        txt = txt.replace(/ {2}/g, '&nbsp;&nbsp;');
        //Set the content
        this.innerHTML = txt;
        return txt;
    });

  return dom;
}

/* {{{ Encoding Methods borrowed from PHP.js
http://phpjs.org
*/
var htmlentities = function(string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: nobbler
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // -    depends on: get_html_translation_table
    // *     example 1: htmlentities('Kevin & van Zonneveld');
    // *     returns 1: 'Kevin &amp; van Zonneveld'
    // *     example 2: htmlentities("foo'bar","ENT_QUOTES");
    // *     returns 2: 'foo&#039;bar'

    var hash_map = {}, symbol = '', tmp_str = '', entity = '';
    tmp_str = string.toString();
    
    if (false === (hash_map = get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }
    hash_map["'"] = '&#039;';
    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(symbol).join(entity);
    }
    
    return tmp_str;
};

var html_entity_decode = function(string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: john (http://www.jd-tech.net)
    // +      input by: ger
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: marc andreu
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Ratheous
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Nick Kolosov (http://sammy.ru)
    // +   bugfixed by: Fox
    // -    depends on: get_html_translation_table
    // *     example 1: html_entity_decode('Kevin &amp; van Zonneveld');
    // *     returns 1: 'Kevin & van Zonneveld'
    // *     example 2: html_entity_decode('&amp;lt;');
    // *     returns 2: '&lt;'

    var hash_map = {}, symbol = '', tmp_str = '', entity = '';
    tmp_str = string.toString();
    
    if (false === (hash_map = get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }

    // fix &amp; problem
    // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
    delete(hash_map['&']);
    hash_map['&'] = '&amp;';

    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity).join(symbol);
    }
    tmp_str = tmp_str.split('&#039;').join("'");
    
    return tmp_str;
};


var get_html_translation_table = function(table, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Frank Forte
    // +   bugfixed by: T.Wild
    // +      input by: Ratheous
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js, meaning the constants are not
    // %          note: real constants, but strings instead. Integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
    
    var entities = {}, hash_map = {}, decimal = 0, symbol = '';
    var constMappingTable = {}, constMappingQuoteStyle = {};
    var useTable = {}, useQuoteStyle = {};
    
    // Translate arguments
    constMappingTable[0]      = 'HTML_SPECIALCHARS';
    constMappingTable[1]      = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable       = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: "+useTable+' not supported');
        // return false;
    }

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';


    // ascii decimals to real symbols
    for (decimal in entities) {
        symbol = String.fromCharCode(decimal);
        hash_map[symbol] = entities[decimal];
    }
    
    return hash_map;
};

/* }}} */

