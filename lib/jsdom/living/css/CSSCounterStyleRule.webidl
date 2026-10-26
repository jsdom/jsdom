
// https://drafts.csswg.org/css-counter-styles-3/#csscounterstylerule
[Exposed=Window]
interface CSSCounterStyleRule : CSSRule {
    attribute CSSOMString additiveSymbols;
    attribute CSSOMString fallback;
    attribute CSSOMString name;
    attribute CSSOMString negative;
    attribute CSSOMString pad;
    attribute CSSOMString prefix;
    attribute CSSOMString range;
    attribute CSSOMString speakAs;
    attribute CSSOMString suffix;
    attribute CSSOMString symbols;
    attribute CSSOMString system;
};
