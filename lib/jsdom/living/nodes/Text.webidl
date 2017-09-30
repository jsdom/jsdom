[Constructor(optional DOMString data = ""),
 Exposed=Window]
interface Text : CharacterData {
  [NewObject] Text splitText(unsigned long offset);
  readonly attribute DOMString wholeText;
};
