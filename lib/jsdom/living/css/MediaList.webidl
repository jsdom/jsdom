
// https://drafts.csswg.org/cssom-1/#medialist
[Exposed=Window]
interface MediaList {

    readonly attribute unsigned long length;
    // https://github.com/jsdom/webidl2js/issues/254
    stringifier attribute [LegacyNullToEmptyString] DOMString mediaText;

    undefined appendMedium(CSSOMString medium);
    undefined deleteMedium(CSSOMString medium);
    getter CSSOMString? item(unsigned long index);
};
