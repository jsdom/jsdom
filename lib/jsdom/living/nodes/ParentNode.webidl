[NoInterfaceObject,
 Exposed=Window]
interface ParentNode {
  [SameObject] readonly attribute HTMLCollection children;
  readonly attribute Element? firstElementChild;
  readonly attribute Element? lastElementChild;
  readonly attribute unsigned long childElementCount;

//  [Unscopeable] void prepend((Node or DOMString)... nodes);
//  [Unscopeable] void append((Node or DOMString)... nodes);

//  [Unscopeable] Element? query(DOMString relativeSelectors);
//  [NewObject, Unscopeable] Elements queryAll(DOMString relativeSelectors);
  Element? querySelector(DOMString selectors);
  [NewObject] NodeList querySelectorAll(DOMString selectors);
};
Document implements ParentNode;
DocumentFragment implements ParentNode;
Element implements ParentNode;
