var HTMLDecode = require('./htmlencoding').HTMLDecode;

var HtmlToDom = function(parser){
  
  if(parser && parser.write) {
    // sax parser
    this.appendHtmlToElement = function(html, element){

      var currentElement = element, currentLevel = 0;

      parser.onerror = function (e) {};

      parser.ontext = function (t) {
        var ownerDocument = currentElement.ownerDocument || currentElement;
        var newText = ownerDocument.createTextNode(t);
        currentElement.appendChild(newText);
      };

      parser.onopentag = function (node) {
        var nodeName  = node.name.toLowerCase(),
            document   = currentElement.ownerDocument || currentElement,
            newElement = document.createElement(nodeName),
            i          = 0,
            length     = (node.attributes && node.attributes.length) ? 
                          node.attributes.length                     :
                          0;
	
        for (i in node.attributes)
        {
          if (node.attributes.hasOwnProperty(i)) {
            newElement.setAttribute(i, node.attributes[i]);
          }
        }
	
	for (var i=0; i<node.attributes.length; i++) {
	    newElement.setAttribute(i, node.attributes.item(i));
	}
        currentElement.appendChild(newElement);
        currentElement = newElement;
      };

      parser.onclosetag = function(node) {
        currentElement = currentElement.parentNode;
      }

      parser.write(html).close();

      return element;
    }
    
  } else if(parser && (parser.ParseHtml || parser.DefaultHandler)) {
    
    // Forgiving HTML parser
    
    if(parser.ParseHtml){
      // davglass/node-htmlparser
    } else if(parser.DefaultHandler){
      // tautologistics/node-htmlparser
      parser.ParseHtml = function(rawHtml){
        var handler = new this.DefaultHandler();
        var parser = new this.Parser(handler);
        parser.parseComplete(rawHtml);
        return handler.dom;
      }
    }
    
    this.appendHtmlToElement = function(html, element){

      if (typeof html !== 'string') {
          html +='';
      }

      var parsed = parser.ParseHtml(html);

      for (var i = 0; i < parsed.length; i++) {
          setChild.call(element, parsed[i]);
      }

      return element;
      
    }
    
  } else if(parser && parser.moduleName == 'HTML5') { /* HTML5 parser */
    this.appendHtmlToElement = function(html, element) {
      if(typeof html !== 'string') html += '';
      var p = new parser.Parser({document: element.ownerDocument});
      p.parse_fragment(html, element);
      element.appendChild(p.fragment);
    }
  } else {
    
    this.appendHtmlToElement = function(){
      var sys = require('sys');
      sys.puts('');
      sys.puts('###########################################################');
      sys.puts('#  WARNING: No HTML parser could be found.');
      sys.puts('#  Element.innerHTML setter support has been disabled');
      sys.puts('#  Element.innerHTML getter support will still function');
      sys.puts('#  Download: http://github.com/tautologistics/node-htmlparser');
      sys.puts('###########################################################');
      sys.puts('');

    }

  } 
}

// utility function for forgiving parser
var setChild = function(node) {

    var newNode, currentDocument = this._ownerDocument || this;
    
    if (node.type == 'tag' || node.type == 'script' || node.type == 'style') {
	try{
            newNode = currentDocument.createElement(node.name);
	}catch (err) {
	    //console.log("raw: "+node.raw);
	}
    }
    if (node.type == 'text') {
      newNode = currentDocument.createTextNode(HTMLDecode(node.data));
    }
    if (node.type == 'comment') {
        newNode = currentDocument.createComment(node.data);
    }
    if (node.attribs && newNode) {
        for (var c in node.attribs) {
	    // catchin errors here helps with improperly escaped attributes
	    // but properly fixing this should (can only?) be done in the htmlparser itself
	    try{
	      newNode.setAttribute(c.toLowerCase(), HTMLDecode(node.attribs[c]));
	    }catch(err) {
		//console.log("raw: "+node.raw);
		//console.log(node.attribs);
		//console.log("offender: "+node.attribs[c]);
	    }
        }
    }
    if (node.children && newNode) {
        for (var c = 0; c < node.children.length; c++) {
            setChild.call(newNode, node.children[c]);
        }
    }
    if (newNode) {
        return this.appendChild(newNode);
    } else {
        return null;
    }
};

exports.HtmlToDom = HtmlToDom;
