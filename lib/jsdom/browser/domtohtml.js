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


var blockTags = [
  'address', 'article', 'aside', 'audio', 'blockquote', 'canvas', 'dd', 'div',
  'dl', 'fieldset', 'figcaption', 'figure', 'figcaption', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'noscript',
  'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot', 'ul', 'video'
];

var closingOpeningTags = {
  'body': [ 'body' ],
  'colgroup': [ 'colgroup', 'tr' ],
  'dd': [ 'dd', 'dt' ],
  'dt': [ 'dd', 'dt' ],
  'head': [ 'body' ],
  'li': [ 'li' ],
  'optgroup': [ 'optgroup' ],
  'option': [ 'optgroup', 'option' ],
  'p': blockTags,
  'tbody': [ 'tbody' ],
  'td': [ 'td', 'th' ],
  'tfoot': [ 'tbody' ],
  'th': [ 'td', 'th' ],
  'thead': [ 'tfoot', 'tbody' ],
  'tr': [ 'tfoot', 'tbody', 'tr' ]
};


var expr = {
  upperCaseChars: /([A-Z])/g,
  breakBetweenTags: /(<(\/?\w+).*?>)(?=<(?!\/\2))/gi,
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

exports.stringifyElement = function stringifyElement(element, optionalClosing) {
  var tagName = element.tagName.toLowerCase(),
      ret = {
        start: "<" + tagName,
        end:''
      },
      attributes = [],
      i,
      attribute = null;

  if (element.attributes.length) {
    ret.start += " ";
    for (i = 0; i<element.attributes.length; i++) {
      attribute = element.attributes.item(i);
      attributes.push(attribute.name + '="' +
                      HTMLEncode(attribute.nodeValue, true) + '"');
    }
  }
  ret.start += attributes.join(" ");

  if (singleTags[tagName]) {
    ret.start += " />";
    ret.end = '';
  } else {
    ret.start += ">";
    ret.end = "</" + tagName + ">";

    if (optionalClosing) {
      // Determine whether the closing tag is optional or not.
      var terminatingSiblings = closingOpeningTags[tagName];
      if (terminatingSiblings) {
        var node = element.nextSibling;
        if (!node) {
          ret.end = '';
        }
        while (node) {
          if (node.nodeType === node.TEXT_NODE) {
            break;
          }
          if (node.nodeType === node.ELEMENT_NODE) {
            if (terminatingSiblings.indexOf(node.tagName.toLowerCase()) !== -1) {
              ret.end = '';
            }
            break;
          }
          node = node.nextSibling
        }
      }
    }
  }

  return ret;
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
    dt += ' SYSTEM ';
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

exports.makeHtmlGenerator = function makeHtmlGenerator(indentUnit, eol, optionalClosing) {
  indentUnit = indentUnit || "";
  eol = eol || "";

  return function generateHtmlRecursive(node, rawText, curIndent) {
    var ret = "", parent, current, i;
    curIndent = curIndent || "";
    if (node) {
      if (node.nodeType &&
          node.nodeType === node.ENTITY_REFERENCE_NODE) {
        node = node._entity;
      }

      var childNodesRawText = rawText || rawTextElements.test(node.nodeName);

      switch (node.nodeType) {
        case node.ELEMENT_NODE:
          current = exports.stringifyElement(node, optionalClosing);
          if (childNodesRawText) {
            ret += curIndent + current.start;
          } else {
            ret += curIndent + current.start;
          }
          if (node._childNodes.length > 0) {
            if (node._childNodes[0].nodeType !== node.TEXT_NODE) {
              ret += eol;
            }
            for (i=0; i<node._childNodes.length; i++) {
              ret += generateHtmlRecursive(node._childNodes[i], childNodesRawText, curIndent + indentUnit);
            }
            if (node._childNodes[node._childNodes.length - 1].nodeType !== node.TEXT_NODE) {
              ret += curIndent;
            }
            ret += current.end + eol;
          } else {
            ret += ((rawText ? node.nodeValue : HTMLEncode(node.nodeValue, false)) || '') + current.end + eol;
          }
          break;
        case node.TEXT_NODE:
          // Skip pure whitespace nodes if we're indenting
          if (!indentUnit || !/^[\s\n]*$/.test(node.nodeValue)) {
            ret += (rawText ? node.nodeValue : HTMLEncode(node.nodeValue, false)) || '';
          }
          break;
        case node.COMMENT_NODE:
          ret += curIndent + '<!--' + node.nodeValue + '-->' + eol;
          break;
        case node.DOCUMENT_NODE:
          for (i=0; i<node._childNodes.length; i++) {
            ret += generateHtmlRecursive(node._childNodes[i], childNodesRawText, curIndent);
          }
          break;
        case node.DOCUMENT_TYPE_NODE:
          ret += stringifyDoctype(node);
        break;
      }
    }
    return ret;
  };
};

exports.domToHtml = function(dom, noformat, raw, optionalClosing) {
  var htmlGenerator = exports.makeHtmlGenerator(noformat ? "" : "  ",
                                                noformat ? "" : "\n",
                                                optionalClosing);
  if (dom.toArray) {
    // node list
    dom = dom.toArray();
  }
  if (typeof dom.length !== 'undefined') {
    var ret = "";
    for (var i=0,len=dom.length; i<len; i++) {
      ret += htmlGenerator(dom[i], raw);
    }
    return ret;
  } else {
    // single node
    return htmlGenerator(dom, raw);
  }
};
