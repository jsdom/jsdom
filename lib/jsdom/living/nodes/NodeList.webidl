[Exposed=Window]
interface NodeList {
  [WebIDL2JSValueAsUnsupported=null] getter Node? item(unsigned long index);
  readonly attribute unsigned long length;
  iterable<Node>;
};
