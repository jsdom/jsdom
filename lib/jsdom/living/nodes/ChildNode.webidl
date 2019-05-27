// https://dom.spec.whatwg.org/#childnode
interface mixin ChildNode {
  [CEReactions, Unscopable] void before((Node or DOMString)... nodes);
  [CEReactions, Unscopable] void after((Node or DOMString)... nodes);
  [CEReactions, Unscopable] void replaceWith((Node or DOMString)... nodes);
  [CEReactions, Unscopable] void remove();
};
DocumentType includes ChildNode;
Element includes ChildNode;
CharacterData includes ChildNode;
