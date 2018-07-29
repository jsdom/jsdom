[Exposed=Window,
 HTMLConstructor]
interface HTMLSlotElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString name;
  sequence<Node> assignedNodes(optional AssignedNodesOptions options);
  sequence<Element> assignedElements(optional AssignedNodesOptions options);
};

dictionary AssignedNodesOptions {
  boolean flatten = false;
};
