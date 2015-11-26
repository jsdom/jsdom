var parse5 = require('parse5');
var htmlparser2 = require('htmlparser2');
var attributes = require('../living/attributes');
var createDocumentTypeInternal = require('../living/document-type').create;
const locationInfo = require("../living/helpers/internal-constants").locationInfo;

function HtmlToDom(core, parser, parsingMode) {
  if (!parser) {
    if (parsingMode === "xml") {
      parser = htmlparser2;
    } else {
      parser = parse5;
    }
  }

  if (parser.DefaultHandler || (parser.Parser && parser.TreeAdapters)) {

    // Forgiving HTML parser

    if (parser.DefaultHandler){
      // fb55/htmlparser2

      parser.ParseHtml = function(rawHtml) {
        var handler = new parser.DefaultHandler();
        // Check if document is XML
        var isXML = parsingMode === "xml";
        var parserInstance = new parser.Parser(handler, {
          xmlMode: isXML,
          lowerCaseTags: !isXML,
          lowerCaseAttributeNames: !isXML,
          decodeEntities: true
        });

        parserInstance.includeLocation = false;
        parserInstance.parseComplete(rawHtml);
        return handler.dom;
      };
    } else if (parser.Parser && parser.TreeAdapters) {
      parser.ParseHtml = function (rawHtml) {
        if (parsingMode === 'xml') {
          throw new Error('Can\'t parse XML with parse5, please use htmlparser2 instead.');
        }
        var instance = new parser.Parser(parser.TreeAdapters.htmlparser2, { locationInfo: true });
        var dom = instance.parse(rawHtml);
        return dom.children;
      };
    }

    this.appendHtmlToElement = function(html, element) {

      if (typeof html !== 'string') {
        html +='';
      }

      var parsed = parser.ParseHtml(html);

      for (var i = 0; i < parsed.length; i++) {
        setChild(core, element, parsed[i]);
      }

      return element;
    };
    this.appendHtmlToDocument = this.appendHtmlToElement;

    if (parser.Parser && parser.TreeAdapters) {
      this.appendHtmlToElement = function (html, element) {

        if (typeof html !== 'string') {
          html += '';
        }

        var instance = new parser.Parser(parser.TreeAdapters.htmlparser2);
        var parentElement = parser.TreeAdapters.htmlparser2.createElement(element.tagName.toLowerCase(), element.namespaceURI, []);
        var dom = instance.parseFragment(html, parentElement);
        var parsed = dom.children;

        for (var i = 0; i < parsed.length; i++) {
          setChild(core, element, parsed[i]);
        }

        return element;
      };
    }

  } else if (parser.moduleName == 'HTML5') { /* HTML5 parser */
    this.appendHtmlToElement = function(html, element) {

      if (typeof html !== 'string') {
        html += '';
      }
      if (html.length > 0) {
        if (element.nodeType == 9) {
          new parser.Parser({document: element}).parse(html);
        }
        else {
          var p = new parser.Parser({document: element.ownerDocument});
          p.parse_fragment(html, element);
        }
      }
    };
  } else {
    this.appendHtmlToElement = function () {
      console.log('');
      console.log('###########################################################');
      console.log('#  WARNING: No compatible HTML parser was given.');
      console.log('#  Element.innerHTML setter support has been disabled');
      console.log('#  Element.innerHTML getter support will still function');
      console.log('###########################################################');
      console.log('');
    };
  }
};

// utility function for forgiving parser
function setChild(core, parent, node) {

  var c, newNode, currentDocument = parent._ownerDocument || parent;
  var isTemplateContents = false;

  switch (node.type)
  {
    case 'tag':
    case 'script':
    case 'style':
      newNode = currentDocument._createElementWithCorrectElementInterface(node.name, node.namespace);
      newNode._namespaceURI = node.namespace || "http://www.w3.org/1999/xhtml";
    break;

    case 'root':
      // If we are in <template> then add all children to the parent's _templateContents; skip this virtual root node.
      if (parent.tagName === 'TEMPLATE' && parent._namespaceURI === 'http://www.w3.org/1999/xhtml') {
        newNode = parent._templateContents;
        isTemplateContents = true;
      }
    break;

    case 'text':
      // HTML entities should already be decoded by the parser, so no need to decode them
      newNode = currentDocument.createTextNode(node.data);
    break;

    case 'comment':
      newNode = currentDocument.createComment(node.data);
    break;

    case 'directive':
      if (node.name[0] === '?' && node.name.toLowerCase() !== '?xml') {
        var data = node.data.slice(node.name.length + 1, -1);
        newNode = currentDocument.createProcessingInstruction(node.name.substring(1), data);
      } else if (node.name.toLowerCase() === '!doctype') {
        if (node['x-name'] !== undefined) { // parse5 supports doctypes directly
          newNode = createDocumentTypeInternal(core, currentDocument,
            node['x-name'] || '',
            node['x-publicId'] || '',
            node['x-systemId'] || '');
        } else {
          newNode = parseDocType(core, currentDocument, '<' + node.data + '>');
        }
      }
    break;

    default:
      return null;
    break;
  }

  if (!newNode)
    return null;

  newNode[locationInfo] = node.__location;

  newNode._localName = node.name;

  if (node.attribs) {
    for (var localName in node.attribs) {
      var value = node.attribs[localName];
      var prefix = node['x-attribsPrefix'] && node['x-attribsPrefix'][localName];
      var namespace = node['x-attribsNamespace'] && node['x-attribsNamespace'][localName] || null;

      attributes.setAttributeValue(newNode, localName, value, prefix, namespace);
    }
  }

  if (node.children) {
    for (c = 0; c < node.children.length; c++) {
      setChild(core, newNode, node.children[c]);
    }
  }

  if (!isTemplateContents) {
    if (parent._templateContents) {
      // Setting innerHTML on a <template>
      parent._templateContents.appendChild(newNode);
    } else {
      parent.appendChild(newNode);
    }
  }
}

var HTML5_DOCTYPE = /<!doctype html>/i;
var PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
var SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;

function parseDocType(core, doc, html) {
  if (HTML5_DOCTYPE.test(html)) {
    return createDocumentTypeInternal(core, doc, "html", "", "");
  }

  var publicPieces = PUBLIC_DOCTYPE.exec(html);
  if (publicPieces) {
    return createDocumentTypeInternal(core, doc, publicPieces[1], publicPieces[2], publicPieces[3]);
  }

  var systemPieces = SYSTEM_DOCTYPE.exec(html);
  if (systemPieces) {
    return createDocumentTypeInternal(core, doc, systemPieces[1], systemPieces[2], "");
  }

  // Shouldn't get here (the parser shouldn't let us know about invalid doctypes), but our logic likely isn't
  // real-world perfect, so let's fallback.
  return createDocumentTypeInternal(core, doc, "html", "", "");
}


exports.HtmlToDom = HtmlToDom;
