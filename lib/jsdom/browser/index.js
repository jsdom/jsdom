var sys = require('sys');

var HtmlToDom = require('./htmltodom').HtmlToDom;
var domToHtml = require('./domtohtml').domToHtml;

//Needed so Node doesn't bomb on printing the Array-like objects

Object.defineProperty(Array.prototype, 'toString', {value: function() {
    return '[ Array ]: ' + this.length;
}, enumberable: false});


exports.windowAugmentation = function(dom, options) {

    if(!options) options = {};

    var browser = browserAugmentation(dom, options);
    var Window = {
        document: new browser.Document(),
        setTimeout: setTimeout,
        setInterval: setInterval,
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
    Window.frames = [Window];
    Window.contentWindow = Window;
    Window.document.defaultView = Window;
    Window.document.parentWindow = Window;
    Window.addEventListener2 = function(type, fn, capture) {
        fn.apply(Window);
    };
	Window.document.compareDocumentPosition = function() {};
	Window.addEventListener = function() {};
	Window.document.addEventListener = function() {};

    var html = Window.document.createElement('html');
    Window.document.appendChild(html);
    Window.document.documentElement.appendChild(Window.document.createElement('head'));
    Window.document.documentElement.appendChild(Window.document.createElement('body'));

    Window.document.getElementsByTagName('head')[0].appendChild(Window.document.createElement('title'));

    Window.document.documentElement.style = {};
    Window.document.documentElement.hasAttribute = true;
    Window.location = { href: __filename };
    Window.navigator = {
        userAgent: 'Node.js (' + process.platform + '; U; rv:' + process.version + ')',
        platform: process.platform,
        appVersion: process.version
    };


    return {
        window: Window,
        self: Window,
        document: Window.document,
        navigator: Window.navigator,
        location: Window.location
    };
};

var browserAugmentation = exports.browserAugmentation = function(dom, options) {

  if(!options) options = {};

  // set up html parser - use a provided one or try and load from library

  var htmltodom;

  if(options.parser) {
    htmltodom = new HtmlToDom(options.parser);
  } else {
    try {
      var htmlparser = require('htmlparser');
      htmltodom = new HtmlToDom(htmlparser);
    } catch(e) {
      htmltodom = new HtmlToDom();
    }
  }

  /***************************************
  * Browser Augmentation                 *
  ***************************************/

  dom.Node.prototype.addEventListener = function(){};

  dom.Element.prototype.getElementsByClassName = function(className) {

    var queryFunction = function(child) {
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

    dom.Document.prototype.__defineSetter__("title",function(value) {
        this.getElementsByTagName('title')[0].innerHTML = value;
        return value;
    });

    dom.Document.prototype.__defineGetter__("title",function() {
        return this.getElementsByTagName('title')[0].innerHTML;
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
    return domToHtml(this.documentElement);
  });

  dom.Element.prototype.__defineGetter__('outerHTML', function() {
    return domToHtml(this);
  });

  dom.Element.prototype.__defineGetter__('innerHTML', function() {
    return domToHtml(this.childNodes);
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

    var nodes = htmltodom.appendHtmlToElement(html, this);

    //sys.puts('OUT: ' + this.outerHTML);

    return html;
});


  dom.Document.prototype.__defineGetter__("body", function() {
    return this.getElementsByTagName("body").item(0);
  });

    dom.Element.prototype.createCaption = function(str) {
        var el = document.createElement('caption');
        el.innerHTML = str;
        return el;
    };


    dom.Element.prototype.focus = function() {
    };
    dom.Element.prototype.blur = function() {
    };

    dom.Element.prototype.__defineGetter__('elements', function(val) {
        //TODO
        return {};
    });

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


    dom.Element.prototype.__defineSetter__("href", function(val) {
        this.setAttribute("href", val);
    });

    dom.Element.prototype.__defineGetter__("href",function() {
        return this.getAttribute("href");
    });


    dom.Element.prototype.__defineSetter__("height", function(val) {
        this.setAttribute("height", val);
    });

    dom.Element.prototype.__defineGetter__("height",function() {
        return this.getAttribute("height");
    });

    dom.Element.prototype.__defineSetter__("width", function(val) {
        this.setAttribute("width", val);
    });

    dom.Element.prototype.__defineGetter__("width",function() {
        return this.getAttribute("width");
    });
    dom.Element.prototype.__defineSetter__("src", function(val) {
        this.setAttribute("src", val);
    });

    dom.Element.prototype.__defineGetter__("src",function() {
        return this.getAttribute("src");
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


    dom.Element.prototype.__defineGetter__('options', function() {
        if (this.tagName.toUpperCase() == 'SELECT') {
            return this.getElementsByTagName('option');
        } else {
            //Throw Error
        }
    });
    dom.Element.prototype.__defineGetter__('selectedIndex', function() {
        if (this.tagName.toUpperCase() == 'SELECT') {
            var index = 0,
                options = this.getElementsByTagName('option');

            for (var i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    index = i;
                }
            }
            return index;
        } else {
            //Throw Error
        }
    });

    dom.Element.prototype.__defineSetter__('selectedIndex', function(index) {
        if (this.tagName.toUpperCase() == 'SELECT') {
            var options = this.getElementsByTagName('option');

            for (var i = 0; i < options.length; i++) {
                if (i === index) {
                    options[i].selected = true;
                } else if (options[i].selected) {
                    options[i].selected = false;
                }
            }
            return index;
        } else {
            //Throw Error
        }
    });

    dom.Element.prototype.__defineGetter__('text', function() {
        if (this.attributes.getNamedItem('value')) {
            return this.value;
        } else {
            return this.innerHTML;
        }
    });

    dom.Element.prototype.__defineGetter__('value', function() {

        var val = this.getAttribute('value') || this.nodeValue;

        if (this.tagName.toUpperCase() == 'TEXTAREA') {
            val = this.innerHTML;
        }
        if (this.tagName.toUpperCase() == 'OPTION') {
            if (val === null) {
                val = this.innerHTML;
            }
            if (this.getAttribute('value') === '') {
                val = '';
            }
        }

        if (this.tagName.toUpperCase() == 'SELECT') {
            var selected = this.options[this.selectedIndex];
            val = '';
            if (selected) {
                val = selected.value;
            }
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
http://phpjs.org/pages/license/#MIT

 * More info at: http://phpjs.org
 *
 * This is version: 3.09
 * php.js is copyright 2010 Kevin van Zonneveld.
 *
 * Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
 * (http://kevin.vanzonneveld.net), Onno Marsman, Theriault, Michael White
 * (http://getsprink.com), Waldo Malqui Silva, Paulo Ricardo F. Santos, Jack,
 * Jonas Raoni Soares Silva (http://www.jsfromhell.com), Philip Peterson,
 * Legaev Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous, Martijn
 * Wieringa, Nate, Philippe Baumann, lmeyrick
 * (https://sourceforge.net/projects/bcmath-js/), Enrique Gonzalez,
 * Webtoolkit.info (http://www.webtoolkit.info/), Jani Hartikainen, travc, Ole
 * Vrijenhoek, Ash Searle (http://hexmen.com/blog/), Carlos R. L. Rodrigues
 * (http://www.jsfromhell.com), d3x,
 * http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
 * pilus, stag019, WebDevHobo (http://webdevhobo.blogspot.com/), Michael
 * Grier, Erkekjetter, T.Wild, Andrea Giammarchi
 * (http://webreflection.blogspot.com), marrtins, GeekFG
 * (http://geekfg.blogspot.com), Johnny Mast (http://www.phpvrouwen.nl),
 * gorthaur, Michael White, majak, Steve Hilder, Oleg Eremeev, Martin
 * (http://www.erlenwiese.de/), gettimeofday, Joris, Steven Levithan
 * (http://blog.stevenlevithan.com), Tim de Koning (http://www.kingsquare.nl),
 * KELAN, Arpad Ray (mailto:arpad@php.net), Breaking Par Consulting Inc
 * (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
 * Josh Fraser
 * (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
 * Chris, Marc Palau, Public Domain (http://www.json.org/json2.js), saulius,
 * Aman Gupta, Pellentesque Malesuada, Mailfaker (http://www.weedem.fr/), Caio
 * Ariede (http://caioariede.com), Thunder.m, Alfonso Jimenez
 * (http://www.alfonsojimenez.com), AJ, mdsjack (http://www.mdsjack.bo.it),
 * Lars Fischer, Kankrelune (http://www.webfaktory.info/), Felix Geisendoerfer
 * (http://www.debuggable.com/felix), Tyler Akins (http://rumkin.com), Mirek
 * Slugen, Robin, Karol Kowalski, Paul Smith, Sakimori, David, noname, Marco,
 * Douglas Crockford (http://javascript.crockford.com), Scott Cariss,
 * class_exists, marc andreu, Steve Clay, Francois, nobbler, David James,
 * Arno, madipta, Fox, mktime, ger, Nathan, felix, Frank Forte, Slawomir
 * Kaniecki, john (http://www.jd-tech.net), Nick Kolosov (http://sammy.ru),
 * Mateusz "loonquawl" Zalega, ReverseSyntax, nord_ua, T. Wild, Thiago Mata
 * (http://thiagomata.blog.com), Linuxworld, lmeyrick
 * (https://sourceforge.net/projects/bcmath-js/this.), Jon Hohle, Pyerre,
 * MeEtc (http://yass.meetcweb.com), Peter-Paul Koch
 * (http://www.quirksmode.org/js/beat.html), T0bsn, Soren Hansen, djmix,
 * Lincoln Ramsay, Sanjoy Roy, sankai, Denny Wardhana, 0m3r, Subhasis Deb,
 * Bayron Guevara, paulo kuong, duncan, Gilbert, Brad Touesnard, Tim Wiel,
 * Marc Jansen, Francesco, Stoyan Kyosev (http://www.svest.org/), J A R, Paul,
 * Ole Vrijenhoek (http://www.nervous.nl/), Raphael (Ao RUDLER), kenneth, Hyam
 * Singer (http://www.impact-computing.com/), LH, JB, JT, Thomas Beaucourt
 * (http://www.webapp.fr), David Randall, Bryan Elliott, date, Ozh, Eugene
 * Bulkin (http://doubleaw.com/), Der Simon
 * (http://innerdom.sourceforge.net/), echo is bad, XoraX
 * (http://www.xorax.info), Matt Bradley, Itsacon (http://www.itsacon.net/),
 * Saulo Vallory, Kristof Coomans (SCK-CEN Belgian Nucleair Research Centre),
 * Pierre-Luc Paour, Kirk Strobeck, Martin Pool, Christoph, Daniel Esteban,
 * Artur Tchernychev, Wagner B. Soares, Valentina De Rosa, strftime, Jason
 * Wong (http://carrot.org/), Brant Messenger
 * (http://www.brantmessenger.com/), Rick Waldron, Bug?, Anton Ongson, Simon
 * Willison (http://simonwillison.net), Marco van Oort, Gabriel Paderni, Blues
 * (http://tech.bluesmoon.info/), Luke Godfrey, rezna, Mick@el, Tomasz
 * Wesolowski, Eric Nagel, Pul, Bobby Drake, uestla, Alan C, Ulrich, Yves
 * Sucaet, sowberry, Norman "zEh" Fuchs, hitwork, Zahlii, johnrembo, Nick
 * Callen, ejsanders, Aidan Lister (http://aidanlister.com/), Brian Tafoya
 * (http://www.premasolutions.com/), Philippe Jausions
 * (http://pear.php.net/user/jausions), Rob, Orlando, HKM, metjay, strcasecmp,
 * strcmp, Taras Bogach, jpfle, ChaosNo1, Alexander Ermolaev
 * (http://snippets.dzone.com/user/AlexanderErmolaev), dptr1988, kilops, Le
 * Torbi, James, DxGx, Pedro Tainha (http://www.pedrotainha.com), Philipp
 * Lenssen, penutbutterjelly, FGFEmperor, baris ozdil, Greg Frazier, Alexander
 * M Beedie, Tod Gentille, gabriel paderni, Yannoo, Maximusya, Atli Þór,
 * daniel airton wermann (http://wermann.com.br), jakes, 3D-GRAF, Riddler
 * (http://www.frontierwebdev.com/), T.J. Leahy, Matteo, stensi, Billy, Jalal
 * Berrami, vlado houba, Victor, fearphage
 * (http://http/my.opera.com/fearphage/), Luis Salazar
 * (http://www.freaky-media.com/), FremyCompany, Tim de Koning, taith, Cord,
 * Manish, davook, Benjamin Lupton, Russell Walker (http://www.nbill.co.uk/),
 * Garagoth, Andrej Pavlovic, rem, Dino, Jamie Beck (http://www.terabit.ca/),
 * DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html), Michael,
 * Christian Doebler, setcookie, YUI Library:
 * http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Andreas,
 * Blues at http://hacks.bluesmoon.info/strftime/strftime.js, meo, Greenseed,
 * Luke Smith (http://lucassmith.name), Rival, Diogo Resende, Allan Jensen
 * (http://www.winternet.no), Howard Yeend, Kheang Hok Chin
 * (http://www.distantia.ca/), Jay Klehr, Leslie Hoare, mk.keck, Ben Bryan,
 * booeyOH, Amir Habibi (http://www.residence-mixte.com/), Cagri Ekin
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
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

