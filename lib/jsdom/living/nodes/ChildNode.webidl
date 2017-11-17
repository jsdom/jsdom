[NoInterfaceObject,
 Exposed=Window]
interface ChildNode {
  [CEReactions, Unscopable] void before((Node or DOMString)... nodes);
  [CEReactions, Unscopable] void after((Node or DOMString)... nodes);
  [CEReactions, Unscopable] void replaceWith((Node or DOMString)... nodes);
  [CEReactions, Unscopable] void remove();
};
DocumentType implements ChildNode;
Element implements ChildNode;
CharacterData implements ChildNode;
