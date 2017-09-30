[OverrideBuiltins]
interface DOMStringMap {
  [WebIDL2JSValueAsUnsupported=undefined] getter DOMString (DOMString name);
  [CEReactions] setter void (DOMString name, DOMString value);
  [CEReactions] deleter void (DOMString name);
};
