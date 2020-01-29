[Exposed=Window,
 HTMLConstructor]
interface HTMLMarqueeElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString behavior;
  [CEReactions, Reflect="bgcolor"] attribute DOMString bgColor;
  [CEReactions, Reflect] attribute DOMString direction;
  [CEReactions, Reflect] attribute DOMString height;
  [CEReactions, Reflect] attribute unsigned long hspace;
//  [CEReactions] attribute long loop;
  [CEReactions, Reflect="scrollamount"] attribute unsigned long scrollAmount;
  [CEReactions, Reflect="scrolldelay"] attribute unsigned long scrollDelay;
  [CEReactions, Reflect="truespeed"] attribute boolean trueSpeed;
  [CEReactions, Reflect] attribute unsigned long vspace;
  [CEReactions, Reflect] attribute DOMString width;

//  attribute EventHandler onbounce;
//  attribute EventHandler onfinish;
//  attribute EventHandler onstart;

//  void start();
//  void stop();
};
