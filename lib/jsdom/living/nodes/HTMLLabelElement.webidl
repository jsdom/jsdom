[Exposed=Window,
 HTMLConstructor]
interface HTMLLabelElement : HTMLElement {
  readonly attribute HTMLFormElement? form;
  [CEReactions, Reflect="for"] attribute DOMString htmlFor;
  readonly attribute HTMLElement? control;
};
