[Exposed=Window,
 HTMLConstructor]
interface HTMLScriptElement : HTMLElement {
  [CEReactions] attribute USVString src;
  [CEReactions, Reflect] attribute DOMString type;
//  [CEReactions, Reflect] attribute boolean noModule;
//  [CEReactions] attribute boolean async;
  [CEReactions, Reflect] attribute boolean defer;
  [CEReactions, Reflect] attribute DOMString? crossOrigin;
  [CEReactions] attribute DOMString text;
  [CEReactions, Reflect] attribute DOMString nonce;
//  [CEReactions, Reflect] attribute DOMString integrity;


  // also has obsolete members
};

partial interface HTMLScriptElement {
  [CEReactions, Reflect] attribute DOMString charset;
  [CEReactions, Reflect] attribute DOMString event;
  [CEReactions, Reflect=for] attribute DOMString htmlFor;
};
