[Exposed=Window]
interface CustomElementRegistry {
  [CEReactions] undefined define(DOMString name, CustomElementConstructor constructor, optional ElementDefinitionOptions options = {});
  any get(DOMString name);
  Promise<void> whenDefined(DOMString name);
  [CEReactions] undefined upgrade(Node root);
};

callback CustomElementConstructor = any ();

dictionary ElementDefinitionOptions {
  DOMString extends;
};
