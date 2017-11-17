[Exposed=Window,
 HTMLConstructor]
interface HTMLMapElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString name;
  [SameObject] readonly attribute HTMLCollection areas;
};
