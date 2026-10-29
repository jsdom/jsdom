
// https://drafts.csswg.org/cssom-1/#medialist
[Exposed=Window]
interface MediaList {

    readonly attribute unsigned long length;
    stringifier attribute [LegacyNullToEmptyString] CSSOMString mediaText;

    undefined appendMedium(CSSOMString medium);
    undefined deleteMedium(CSSOMString medium);
    getter CSSOMString? item(unsigned long index);
};
