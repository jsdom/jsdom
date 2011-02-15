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

var expr = {
  upperCaseChars: /([A-Z])/g,
  breakBetweenTags: /(<(\/?\w+).*?>)(?=<(?!\/\2))/gi,
  endsWithEndTag: /.+<\/\w[^>]*>$/,
  startsWithEndTag: /^<\/\w/,
  startsWithStartTag: /^<\w[^>]*[^\/]>.*$/,
  singleTag: (function() {
      var tags = [];
      for (var i in singleTags) {
          tags.push(i);
      }
      return new RegExp('<' + tags.join('|<'), 'i');
  })()
};

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
                    styleAttrs.push(i.replace(expr.upperCaseChars, uncanon) + ': ' + 
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

    html = html.replace(expr.breakBetweenTags, '$1\r\n');
    html.split('\r\n').forEach(function(node, index) {
        var indent = 0, padding = '', i;

        if (node.match(expr.endsWithEndTag)) {
          indent = 0;
        } else if (node.match(expr.startsWithEndTag)) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match(expr.startsWithStartTag)) {
            if (!expr.singleTag.exec(node)) {
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

var rawTextElements = /SCRIPT|STYLE/i;

function stringifyDoctype (doctype) {
  if (doctype.ownerDocument && doctype.ownerDocument._fullDT) {
    return doctype.ownerDocument._fullDT;
  }
  
  var dt = '<!DOCTYPE ' + doctype.name;
  if (doctype.publicId) {
    // Public ID may never contain double quotes, so this is always safe.
    dt += ' PUBLIC "' + doctype.publicId + '" ';
  }
  if (!doctype.publicId && doctype.systemId) {
    dt += ' SYSTEM '
  }
  if (doctype.systemId) {
    // System ID may contain double quotes OR single quotes, not never both.
    if (doctype.systemId.indexOf('"') > -1) {
      dt += "'" + doctype.systemId + "'";
    } else {
      dt += '"' + doctype.systemId + '"';
    }
  }
  dt += '>';
  return dt;
}

exports.generateHtmlRecursive = function generateHtmlRecursive(node, rawText) {
  var ret = "", parent, current, i;
  if (node) {
    if (node.nodeType && 
        node.nodeType === node.ENTITY_REFERENCE_NODE)
    {
      node = node._entity;
    }

    if (!rawText && node._parentNode) {
      rawText = rawTextElements.test(node._parentNode.nodeName);
    }

    switch (node.nodeType) {
      case node.ELEMENT_NODE:
        current = exports.stringifyElement(node);
        ret += current.start;

        if (node._childNodes.length > 0) {
          for (i=0; i<node._childNodes.length; i++) {
              ret += exports.generateHtmlRecursive(node._childNodes[i], rawText);
          }
        } else {
          //ret += rawText ? node.nodeValue : HTMLEncode(node.nodeValue);
          ret += node.nodeValue || '';
        }
        ret += current.end;
        break;
      case node.TEXT_NODE:
        //ret += rawText ? node.nodeValue : HTMLEncode(node.nodeValue);
        ret += node.nodeValue;
        break; 
      case node.COMMENT_NODE:
        ret += '<!--' + node.nodeValue + '-->';
        break;
      case node.DOCUMENT_NODE:
        for (i=0; i<node._childNodes.length; i++) {
          ret += exports.generateHtmlRecursive(node._childNodes[i], rawText);
        }
        break;
      case node.DOCUMENT_TYPE_NODE:
        ret += stringifyDoctype(node);
      break;
    }
  }
  //require('sys').puts(require('sys').inspect(ret));
  return ret;
};

exports.domToHtml = function(dom, noformat, raw) {
  var ret = "";
  if (dom.toArray) {
    // node list
    dom = dom.toArray();
  }
  if (Array.isArray(dom)) {
    for (var i=0,len=dom.length; i<len; i++) {
      ret += exports.generateHtmlRecursive(dom[i], raw);
    }
  } else {
    // single node
    ret = exports.generateHtmlRecursive(dom, raw);
  }
  if (noformat) {
    return ret;
  } else {
    return exports.formatHTML(ret);
  }
};
