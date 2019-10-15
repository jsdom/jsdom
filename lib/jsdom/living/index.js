/* eslint-disable global-require */
"use strict";

const DOMException = require("domexception");
const { URL, URLSearchParams } = require("whatwg-url");
const XMLSerializer = require("w3c-xmlserializer/lib/XMLSerializer").interface;

const registerElements = require("./register-elements");
const style = require("../level2/style");
const xpath = require("../level3/xpath");
const nodeFilter = require("./node-filter");

const GENERATED_INTERFACES = [
  require("./generated/NamedNodeMap"),
  require("./generated/Attr"),
  require("./generated/Node"),
  require("./generated/Element"),
  require("./generated/DocumentFragment"),
  require("./generated/Document"),
  require("./generated/Document"),
  require("./generated/XMLDocument"),
  require("./generated/CharacterData"),
  require("./generated/Text"),
  require("./generated/CDATASection"),
  require("./generated/ProcessingInstruction"),
  require("./generated/Comment"),
  require("./generated/DocumentType"),
  require("./generated/DOMImplementation"),
  require("./generated/NodeList"),
  require("./generated/HTMLCollection"),
  require("./generated/HTMLOptionsCollection"),
  require("./generated/DOMStringMap"),
  require("./generated/DOMTokenList"),

  require("./generated/SVGAnimatedString"),
  require("./generated/SVGNumber"),
  require("./generated/SVGStringList"),

  require("./generated/Event"),
  require("./generated/CloseEvent"),
  require("./generated/CustomEvent"),
  require("./generated/MessageEvent"),
  require("./generated/ErrorEvent"),
  require("./generated/HashChangeEvent"),
  require("./generated/InputEvent"),
  require("./generated/FocusEvent"),
  require("./generated/PopStateEvent"),
  require("./generated/UIEvent"),
  require("./generated/MouseEvent"),
  require("./generated/KeyboardEvent"),
  require("./generated/TouchEvent"),
  require("./generated/PageTransitionEvent"),
  require("./generated/ProgressEvent"),
  require("./generated/StorageEvent"),
  require("./generated/CompositionEvent"),
  require("./generated/WheelEvent"),
  require("./generated/EventTarget"),

  require("./generated/BarProp"),
  require("./generated/External"),
  require("./generated/Location"),
  require("./generated/History"),
  require("./generated/Screen"),
  require("./generated/Performance"),

  require("./generated/PluginArray"),
  require("./generated/MimeTypeArray"),
  require("./generated/Plugin"),
  require("./generated/MimeType"),

  require("./generated/FileReader"),
  require("./generated/Blob"),
  require("./generated/File"),
  require("./generated/FileList"),
  require("./generated/ValidityState"),

  require("./generated/DOMParser"),

  require("./generated/FormData"),
  require("./generated/XMLHttpRequestEventTarget"),
  require("./generated/XMLHttpRequestUpload"),
  require("./generated/WebSocket"),

  require("./generated/NodeIterator"),
  require("./generated/TreeWalker"),

  require("./generated/Storage"),

  require("./generated/ShadowRoot"),

  require("./generated/MutationObserver"),
  require("./generated/MutationRecord"),

  require("./generated/Headers"),
  require("./generated/AbortController"),
  require("./generated/AbortSignal")
];

function install(window, name, interfaceConstructor) {
  Object.defineProperty(window, name, {
    configurable: true,
    writable: true,
    value: interfaceConstructor
  });
}


exports.installConstructors = function (window) {
  // Install interface originated from packages.
  install(window, "DOMException", DOMException);
  install(window, "URL", URL);
  install(window, "URLSearchParams", URLSearchParams);
  install(window, "XMLSerializer", XMLSerializer);

  // Install generated interface.
  for (const generatedInterface of GENERATED_INTERFACES) {
    generatedInterface.install(window);
  }

  // Install Elements
  registerElements(window);

  // These need to be cleaned up...
  style.addToCore(window);
  xpath(window);

  // This one is OK but needs migration to webidl2js eventually.
  nodeFilter(window);
};
