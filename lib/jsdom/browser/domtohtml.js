//Make configurable from docType??
//Set in option
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

var singleTagsRegExp = (function() {
    var tags = [];
    for (var i in singleTags) {
        tags.push(i);
    }
    return new RegExp('<' + tags.join('|<'), 'i');
})();

var uncanon = function(str, letter) {
    return '-' + letter.toLowerCase();
};

var HTMLEncode = require('./htmlencoding').HTMLEncode;

var styleIgnore = { 
    top: 1,
    left: 1
};

exports.stringifyElement = function stringifyElement(element) {
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
            attributes.push(attribute.name + '="' + 
                            HTMLEncode(attribute.nodeValue) + '"');
        }
        //sys.puts('attributes: ' + sys.inspect(attributes));
    }
    ret.start += attributes.join(" ");
    if (element.style) {
        var styleAttrs = [];
        for (var i in element.style) {
            if (!styleIgnore[i]) {
                var use = true;
                //sys.puts('Style: ' + i + ' :: ' + element.style[i] );
                if (i === 'position' && element.style[i] === 'static') {
                    use = false;
                }
                if (element.style[i] === '') {
                    use = false;
                }
                if (use) {
                    styleAttrs.push(i.replace(/([A-Z])/g, uncanon) + ': ' + 
                                    HTMLEncode(element.style[i]));
                }
            }
        }
        if (styleAttrs.length) {
            ret.start += ' style="' + styleAttrs.join('; ') + '"';
        }
    }

    if (singleTags[tagName]) {
      if (isXHTML) {
          ret.start += "/";
      }
      ret.start += ">";
      ret.end = '';
    } else {
      ret.start += ">";
      ret.end = "</" + tagName + ">";
    }
    
    return ret;
};

exports.formatHTML = function formatHTML(html) {
    var formatted = '',
        pad = 0;

    html = html.replace(/(<(\/?\w+).*?>)(?=<(?!\/\2))/gi, '$1\r\n');
    html.split('\r\n').forEach(function(node, index) {
        var indent = 0, padding = '', i;

        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            if (!singleTagsRegExp.exec(node)) {
                indent = 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
};

exports.generateHtmlRecursive = function generateHtmlRecursive(element, rawText) {
  //sys.puts('Generating HTML for: ' + element);
  
  var ret = "";
  if (element) {
    if (element.nodeType && 
        element.nodeType === element.ENTITY_REFERENCE_NODE)
    {
      element = element._entity;
    }

    rawText = rawText || 
        element.parentNode && 
        element.parentNode.nodeName &&
        element.parentNode.nodeName.toUpperCase() === 'SCRIPT';
    
    switch (element.nodeType) {
      case element.ELEMENT_NODE:
        var current = exports.stringifyElement(element);
        ret += current.start;

        if (element.childNodes.length > 0) {
          for (var i=0; i<element.childNodes.length; i++) {
              ret += exports.generateHtmlRecursive(element.childNodes.item(i), rawText);
          }
        } else {
          ret += rawText ? element.nodeValue : HTMLEncode(element.nodeValue);
        }
        ret += current.end;
        break;
      case element.TEXT_NODE:
        ret += rawText ? element.nodeValue : HTMLEncode(element.nodeValue);
        break; 
      case element.COMMENT_NODE:
        ret += '<!--' + element.nodeValue + '-->';
        break;
      case element.DOCUMENT_NODE:
        ret += exports.generateHtmlRecursive(element.documentElement, rawText);
      break;
    }
  }
  //require('sys').puts(require('sys').inspect(ret));
  return ret;
};

exports.domToHtml = function(dom, noformat) {
  
  var ret = "";
  if(dom.item){
    // node list
    var length   = dom.length;
    for (var i=0; i<length; i++) {
      ret += exports.generateHtmlRecursive(dom.item(i));
    }
    
  } else {
    // single node
    ret = exports.generateHtmlRecursive(dom);
  }
  if (noformat) {
    return ret;
  } else {
    return exports.formatHTML(ret);
  }
  
};
