[Exposed=Window]
interface CustomElementRegistry {
  [CEReactions] void define(DOMString name, CustomElementConstructor constructor, optional ElementDefinitionOptions options);
  any get(DOMString name);
  Promise<void> whenDefined(DOMString name);
  [CEReactions] void upgrade(Node root);
};

callback CustomElementConstructor = any ();

dictionary ElementDefinitionOptions {
  DOMString extends;
};
