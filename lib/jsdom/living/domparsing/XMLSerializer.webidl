// https://w3c.github.io/DOM-Parsing/#the-xmlserializer-interface
[Constructor,
 Exposed=Window]
interface XMLSerializer {
  DOMString serializeToString(Node root);
};
