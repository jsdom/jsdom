var core = require("./core").dom.level2.core,
    html = require("./html").dom.level2.html,
    cssom = require("cssom"),
    assert = require('assert');

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
core.StyleSheetList = core.NodeList;

core.Document.prototype.__defineGetter__('styleSheets', function() {
  if (!this._styleSheets) {
    this._styleSheets = new core.StyleSheetList;
  }
  // TODO: each style and link element should register its sheet on creation
  // nad remove it on removal.
  return this._styleSheets;
});


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
  var styleSheet = cssom.parse('dummy{' + data + '}')
    , style = this.style;
  //console.log('evaluating style on ' + this.tagName + ': ' + data + '  ->')
  //console.log(styleSheet);
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

/**
 * Parses style attribute if it changes.
 *
 * @this {html.HTMLElement}
 * @param {Event} e
 */
function styleAttributeListener(e)
{
  //console.log('style modified')
  if ('style' === e.attrName) {
    evaluateStyleAttribute.call(this, e.newValue);
  }
}

/**
 * Update style attribute after calling a CSSStyleDeclaration method.
 *
 * @this {html.HTMLElement}
 * @param {Function} method  CSSStyleDeclaration method
 * @param {Array} args       Arguments to pass to method
 */
function callCSSOMAndUpdateStyle(method, args)
{
  method.apply(this._cssStyleDeclaration, args);

  // Bypass listener so style attribute isn't parsed
  this.removeEventListener('DOMAttrModified', styleAttributeListener);
  this.setAttribute('style', this.style.cssText);
  this.addEventListener('DOMAttrModified', styleAttributeListener);
}

html.HTMLElement.prototype.__defineGetter__('style', function() {
  if (!this._cssStyleDeclaration) {
    this._cssStyleDeclaration = new cssom.CSSStyleDeclaration;
    //console.log('creating style atribute on ' + this.nodeName)
    this.addEventListener('DOMAttrModified', styleAttributeListener);
    evaluateStyleAttribute.call(this, this.getAttribute('style'));

    // Override CSSOM to catch changes to properties and update style attribute
    var self = this;
    var oldSetProperty = this._cssStyleDeclaration.setProperty;
    var oldRemoveProperty = this._cssStyleDeclaration.removeProperty;

    this._cssStyleDeclaration.setProperty = function()
    {
      callCSSOMAndUpdateStyle.call(self, oldSetProperty, arguments);
    };

    this._cssStyleDeclaration.removeProperty = function()
    {
      callCSSOMAndUpdateStyle.call(self, oldRemoveProperty, arguments);
    };
  }
  return this._cssStyleDeclaration;
});
html.HTMLElement.prototype.__defineSetter__('style', function(val) {
  // copied from the define helper function within html.js to define reflected
  // attributes.
  if (!val) {
    this.removeAttribute(attr);
  }
  else {
    var s = val.toString();
    this.setAttribute('style', s);
  }
});
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
    }
  });
  this.addEventListener('DOMNodeRemovedFromDocument', function() {
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
  });
};
html.HTMLStyleElement.prototype.__defineGetter__('sheet', getOrCreateSheet);

exports.dom = {
  level2 : {
    html : html,
    core : core
  }
};
