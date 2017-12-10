[NoInterfaceObject,
 Exposed=Window]
interface ChildNode {
  [Unscopable] void before((Node or DOMString)... nodes);
  [Unscopable] void after((Node or DOMString)... nodes);
  [Unscopable] void replaceWith((Node or DOMString)... nodes);
  [Unscopable] void remove();
};
DocumentType implements ChildNode;
Element implements ChildNode;
CharacterData implements ChildNode;
