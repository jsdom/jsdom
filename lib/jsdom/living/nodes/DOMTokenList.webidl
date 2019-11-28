[Exposed=Window]
interface DOMTokenList {
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=_null] getter DOMString? item(unsigned long index);
  boolean contains(DOMString token);
  [CEReactions] void add(DOMString... tokens);
  [CEReactions] void remove(DOMString... tokens);
  [CEReactions] boolean toggle(DOMString token, optional boolean force);
  [CEReactions] boolean replace(DOMString token, DOMString newToken);
  boolean supports(DOMString token);
  [CEReactions] stringifier attribute DOMString value;
  iterable<DOMString>;
};
