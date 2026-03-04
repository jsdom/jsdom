"use strict";
const { CSSStyleDeclaration } = require("../living/cssom/style-declaration/CSSStyleDeclaration");

exports.addToCore = core => {
  // What works now:
  // - Accessing the rules defined in individual stylesheets
  // - Modifications to style content attribute are reflected in style property
  // - Modifications to style property are reflected in style content attribute
  // TODO
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
  const cssom = require("@acemir/cssom").setup({ globalObject: core._globalObject });

  core.StyleSheet = cssom.StyleSheet;
  core.MediaList = cssom.MediaList;
  core.CSSStyleSheet = cssom.CSSStyleSheet;
  core.CSSRule = cssom.CSSRule;
  core.CSSGroupingRule = cssom.CSSGroupingRule;
  core.CSSNestedDeclarations = cssom.CSSNestedDeclarations;
  core.CSSStyleRule = cssom.CSSStyleRule;
  core.CSSMediaRule = cssom.CSSMediaRule;
  core.CSSImportRule = cssom.CSSImportRule;
  core.CSSConditionRule = cssom.CSSConditionRule;
  core.CSSContainerRule = cssom.CSSContainerRule;
  core.CSSScopeRule = cssom.CSSScopeRule;
  core.CSSSupportsRule = cssom.CSSSupportsRule;
  core.CSSLayerBlockRule = cssom.CSSLayerBlockRule;
  core.CSSLayerStatementRule = cssom.CSSLayerStatementRule;
  core.CSSStyleDeclaration = CSSStyleDeclaration;

  // @acemir/cssom's CSSNestedDeclarations uses its own basic CSSStyleDeclaration (the cssstyle fallback is gone),
  // which doesn't validate property names. Wrap insertRule to upgrade the style declaration after insertion, so
  // invalid-property checks work correctly. The wrapper must not close over `core` since addToCore runs per-Window
  // and the prototype is shared — closing over core would create a closure chain retaining every Window.
  if (!cssom.CSSGroupingRule.prototype._originalInsertRule) {
    const originalInsertRule = cssom.CSSGroupingRule.prototype.insertRule;
    cssom.CSSGroupingRule.prototype._originalInsertRule = originalInsertRule;
    cssom.CSSGroupingRule.prototype.insertRule = function insertRule(rule, index) {
      const result = originalInsertRule.call(this, rule, index);
      const insertedRule = this.cssRules[result];

      if (insertedRule.constructor.name === "CSSNestedDeclarations") {
        const globalObject = this.parentStyleSheet.__globalObject;
        const oldStyle = insertedRule.style;
        const newStyle = new CSSStyleDeclaration(globalObject, undefined, { context: insertedRule });
        for (let i = 0; i < oldStyle.length; i++) {
          const property = oldStyle[i];
          newStyle.setProperty(property, oldStyle.getPropertyValue(property), oldStyle.getPropertyPriority(property));
        }
        insertedRule.style = newStyle;

        if (newStyle.length === 0) {
          this.cssRules.splice(result, 1);
          const ruleToParse = String(rule).trim().replace(/^\/\*[\s\S]*?\*\/\s*/, "");
          throw new globalObject.DOMException(
            "Failed to execute 'insertRule' on '" + this.constructor.name +
            "': Failed to parse the rule '" + ruleToParse + "'.",
            "SyntaxError"
          );
        }
      }

      return result;
    };
  }

  // Relevant specs
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
};
