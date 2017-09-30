interface DOMTokenList {
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=null] getter DOMString? item(unsigned long index);
  boolean contains(DOMString token);
  [CEReactions] void add(DOMString... tokens);
  [CEReactions] void remove(DOMString... tokens);
  [CEReactions] boolean toggle(DOMString token, optional boolean force);
  [CEReactions] void replace(DOMString token, DOMString newToken);
  boolean supports(DOMString token);
  [CEReactions] stringifier attribute DOMString value;
  iterable<DOMString>;
};
