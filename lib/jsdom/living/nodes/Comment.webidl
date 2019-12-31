// https://dom.spec.whatwg.org/#interface-comment
[Exposed=Window]
interface Comment : CharacterData {
  constructor(optional DOMString data = "");
};
