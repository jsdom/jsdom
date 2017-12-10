[NoInterfaceObject,
 Exposed=Window]
interface ParentNode {
  [SameObject] readonly attribute HTMLCollection children;
  readonly attribute Element? firstElementChild;
  readonly attribute Element? lastElementChild;
  readonly attribute unsigned long childElementCount;

  [Unscopable] void prepend((Node or DOMString)... nodes);
  [Unscopable] void append((Node or DOMString)... nodes);

//  [Unscopable] Element? query(DOMString relativeSelectors);
//  [NewObject, Unscopable] Elements queryAll(DOMString relativeSelectors);
  Element? querySelector(DOMString selectors);
  [NewObject] NodeList querySelectorAll(DOMString selectors);
};
Document implements ParentNode;
DocumentFragment implements ParentNode;
Element implements ParentNode;
