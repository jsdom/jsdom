[NoInterfaceObject,
 Exposed=Window]
interface NonDocumentTypeChildNode {
  readonly attribute Element? previousElementSibling;
  readonly attribute Element? nextElementSibling;
};
Element implements NonDocumentTypeChildNode;
CharacterData implements NonDocumentTypeChildNode;
