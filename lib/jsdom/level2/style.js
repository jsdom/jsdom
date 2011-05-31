var core = require("./core").dom.level2.core,
    html = require("./html").dom.level2.html,
    cssom = require("cssom"),
    assert = require('assert'),
	fs = require('fs');
	
	var inheritPropList = ['color' , 'font-style' , 'font-variant' , 'font-weight' , 'font-size' , 'font-family' , 'letter-spacing' , 'line-height' , 'list-style-type' ,'list-style-position' , 'list-style-image' , 'text-align' , 'text-indent' , 'text-transform' , 'visibility' , 'white-space' , 'word-spacing'];

// What works now:
// - Accessing the rules defined in individual stylesheets
// - Modifications to style content attribute are reflected in style property
// TODO
// - Modifications to style property are reflected in style content attribute
// - Modifications to style element's textContent are reflected in sheet property.
// - Modifications to style element's sheet property are reflected in textContent.
// - Modifications to link.href property are reflected in sheet property.
// - Less-used features of link: disabled
// - Less-used features of style: disabled, scoped, title
// - CSSOM-View
//   - getComputedStyle(): requires default stylesheet, cascading, inheritance,
//     filtering by @media (screen? print?), layout for widths/heights
// - Load events are not in the specs, but apparently some browsers
//   implement something. Should onload only fire after all @imports have been
//   loaded, or only the primary sheet?

core.StyleSheet = cssom.StyleSheet;
core.MediaList = cssom.MediaList;
core.CSSStyleSheet = cssom.CSSStyleSheet;
core.CSSRule = cssom.CSSRule;
core.CSSStyleRule = cssom.CSSStyleRule;
core.CSSMediaRule = cssom.CSSMediaRule;
core.CSSImportRule = cssom.CSSImportRule;
core.CSSStyleDeclaration = cssom.CSSStyleDeclaration;

// Relavant specs
// http://www.w3.org/TR/DOM-Level-2-Style (2000)
// http://www.w3.org/TR/cssom-view/ (2008)
// http://dev.w3.org/csswg/cssom/ (2010) Meant to replace DOM Level 2 Style
// http://www.whatwg.org/specs/web-apps/current-work/multipage/ HTML5, of course
// http://dev.w3.org/csswg/css-style-attr/  not sure what's new here

// Objects that aren't in cssom library but should be:
//   CSSRuleList  (cssom just uses array)
//   CSSFontFaceRule
//   CSSPageRule

// These rules don't really make sense to implement, so CSSOM draft makes them
// obsolete.
//   CSSCharsetRule
//   CSSUnknownRule

// These objects are considered obsolete by CSSOM draft, although modern
// browsers implement them.
//   CSSValue
//   CSSPrimitiveValue
//   CSSValueList
//   RGBColor
//   Rect
//   Counter

// StyleSheetList has the same interface as NodeList, so we'll use the same
// object.
//core.StyleSheetList = core.NodeList;

//modifew ced
// styleSheetList core object
core.StyleSheetList = function(){
this._m_sheets = [];
this._r_sheets = [];
//console.log('create stylesheetList');
}

// StylesheetList getters/setters
core.StyleSheetList.prototype = {
   
  get length() {
    return this._m_sheets.length;
  },
  item: function(index) {
    return this._m_sheets[index] || null;
  }
}

// Default stylesheet object
core.defaultCSSStyleSheet = function(){
//console.log('Creating default Stylesheet');
var sheet = new core.CSSStyleSheet();
//FIXME default.css shoult not be in app folder
fs.readFile('./default.css', 'utf8',function(err,data){
if (err) throw err;
var newStyleSheet = cssom.parse(data);
var spliceArgs = newStyleSheet.cssRules;
spliceArgs.unshift(0, sheet.cssRules.length);
Array.prototype.splice.apply(sheet.cssRules, spliceArgs);
});
return sheet;
}

//tmp func
core.getStyle = function(node){
//console.log('core.getStyle');
return "";
}

// expose stylesheetlist to the dom document
core.Document.prototype.__defineGetter__('styleSheets', function() {
  return this._styleSheets;
});
//modifew ced

/**
 * @this {html.HTMLLinkElement|html.HTMLStyleElement}
 * @param {string} url
 * @param {cssom.CSSStyleSheet} sheet
 * @see http://dev.w3.org/csswg/cssom/#requirements-on-user-agents-implementing0
 */
function fetchStylesheet(url, sheet) {
  core.resourceLoader.load(this, url, function(data, filename) {
    // TODO: abort if the content-type is not text/css, and the document is
    // in strict mode
    evaluateStylesheet.call(this, data, sheet, url);
  });
}
/**
 * @this {html.HTMLLinkElement|html.HTMLStyleElement}
 * @param {string} data
 * @param {cssom.CSSStyleSheet} sheet
 * @param {string} baseUrl
 */
function evaluateStylesheet(data, sheet, baseUrl) {
  // this is the element
  var newStyleSheet = cssom.parse(data);
  var spliceArgs = newStyleSheet.cssRules;
  spliceArgs.unshift(0, sheet.cssRules.length);
  Array.prototype.splice.apply(sheet.cssRules, spliceArgs);
  scanForImportRules.call(this, sheet.cssRules, baseUrl);
}
/**
 * @this {html.HTMLLinkElement|html.HTMLStyleElement}
 * @param {cssom.CSSStyleSheet} sheet
 * @param {string} baseUrl
 */
function scanForImportRules(cssRules, baseUrl) {
  if (!cssRules) return;
  for (var i = 0; i < cssRules.length; ++i) {
    if (cssRules[i].cssRules) {
      // @media rule: keep searching inside it.
      scanForImportRules.call(this, cssRules[i].cssRules, baseUrl);
    } else if (cssRules[i].href) {
      // @import rule: fetch the resource and evaluate it.
      // See http://dev.w3.org/csswg/cssom/#css-import-rule
      //     If loading of the style sheet fails its cssRules list is simply
      //     empty. I.e. an @import rule always has an associated style sheet.
      fetchStylesheet.call(this, cssRules[i].href, self.sheet);
    }
  }
}

/**
 * @param {string} data
 * @param {cssom.CSSStyleDeclaration} style
 */
function evaluateStyleAttribute(data) {
  // this is the element.

  // currently, cssom's parse doesn't really work if you pass in
  // {state: 'name'}, so instead we just build a dummy sheet.
  
  //console.log('evaluating style on ' + this.tagName + ': ' + data + '  ->')
  
  var styleSheet = cssom.parse('dummy{' + data + '}')
    , style = this._cssStyleDeclaration?this.style:this;
	//modifew to be called from Proxy
  while (style.length > 0) {
    // TODO: find a non-n^2 way to remove all properties (this calls splice
    // n times).
    style.removeProperty(style[0]);
  }
  if (styleSheet.cssRules.length > 0 && styleSheet.cssRules[0].style) {
    var newStyle = styleSheet.cssRules[0].style;
    for (var i = 0; i < newStyle.length; ++i) {
      var prop = newStyle[i];
      style.setProperty(
          prop,
          newStyle.getPropertyValue(prop),
          newStyle.getPropertyPriority(prop));
    }
  }
}

//modifew
cssom.CSSStyleDeclaration.evaluateStyleAttribute=evaluateStyleAttribute;
//modifew

html.HTMLElement.prototype.__defineGetter__('style', function() {
  if (!this._cssStyleDeclaration) {

  // Case <Tag style='xxx'> in html
  // parser htmltodom creates style attributes
    this._cssStyleDeclaration = new cssom.CSSStyleDeclaration;
   // console.log('creating style atribute on ' + this.nodeName)
  // monitor changes of style attribute (htmltodom)
    this.addEventListener('DOMAttrModified', function(e) {
    if ('style' === e.attrName) {
	//console.log('style modified on '+this.nodeName+' '+e.newValue);
	
    evaluateStyleAttribute.call(this, e.newValue);
	
	//this.removeAttribute(e.attrName); // remove style node attribute after element.style CSSStyleDeclaration creation
	
    }
    });
	
    evaluateStyleAttribute.call(this, this.getAttribute('style'));

  }
  
  return this._cssStyleDeclaration;

});
//html.HTMLElement.prototype.__defineSetter__('style', function(val) {
  // copied from the define helper function within html.js to define reflected
  // attributes.
  //console.log('set style'+val);
  //if (!val) {
  //  this.removeAttribute(attr);
  //}
  //else {
  //  var s = val.toString();
  //  this.setAttribute('style', s);
  //}
//});
assert.equal(undefined, html.HTMLLinkElement._init)
html.HTMLLinkElement._init = function() {
  this.addEventListener('DOMNodeInsertedIntoDocument', function() {
    if (!/(?:[ \t\n\r\f]|^)stylesheet(?:[ \t\n\r\f]|$)/i.test(this.rel)) {
      // rel is a space-separated list of tokens, and the original rel types
      // are case-insensitive.
      return;
    }
    if (this.href) {
      fetchStylesheet.call(this, this.href, this.sheet);
	  
		//modifew ced
		//Add stylesheet to  the  stylesheets list
		this._ownerDocument._styleSheets._m_sheets.push(this.sheet);
	  
    }
  });
  this.addEventListener('DOMNodeRemovedFromDocument', function() {
  //modifew ced
  //todo remove stylesheet from styleSheetList
  });
};
/**
 * @this {HTMLStyleElement|HTMLLinkElement}
 */
var getOrCreateSheet = function() {
  if (!this._cssStyleSheet) {
    this._cssStyleSheet = new cssom.CSSStyleSheet;
  }
  return this._cssStyleSheet;
};
html.HTMLLinkElement.prototype.__defineGetter__('sheet', getOrCreateSheet);

assert.equal(undefined, html.HTMLStyleElement._init)
html.HTMLStyleElement._init = function() {
  //console.log('init style')
  this.addEventListener('DOMNodeInsertedIntoDocument', function() {
    //console.log('style inserted')
    //console.log('sheet: ', this.sheet);
    if (this.type && this.type !== 'text/css') {
      //console.log('bad type: ' + this.type)
      return;
    }
    evaluateStylesheet.call(this, this.textContent, this.sheet, this._ownerDocument.URL);

  //modifew ced
  //Add stylesheet to  the  stylesheets list
  this._ownerDocument._styleSheets._m_sheets.push(this.sheet);

  });
};
html.HTMLStyleElement.prototype.__defineGetter__('sheet', getOrCreateSheet);

//modifew
exports.evaluateStyleAttribute = evaluateStyleAttribute;
//modifew

exports.dom = {
  level2 : {
    html : html,
    core : core
  }
};


//modifew
html.HTMLElement._init=function() {
// creates CSSStyledeclaration on node.style
// for testing, to remove
//try {if (this.nodeName=='IMG') {var tmp=this.style;}} catch(ee) {};
}; //set style attribute of element
//modifew