[NoInterfaceObject,
 Exposed=Window]
interface NonElementParentNode {
  Element? getElementById(DOMString elementId); // TODO implement in NonElementParentNode-impl instead of in Document-impl
};
Document implements NonElementParentNode;
// DocumentFragment implements NonElementParentNode;
