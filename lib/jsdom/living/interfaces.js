/* eslint-disable global-require */
"use strict";

const registerElements = require("./register-elements");
const style = require("../level2/style");
const xpath = require("../level3/xpath");
const nodeFilter = require("./node-filter");

const generatedInterfaces = [
  require("domexception/webidl2js-wrapper"),

  require("whatwg-url/webidl2js-wrapper").URL,
  require("whatwg-url/webidl2js-wrapper").URLSearchParams,

  require("./generated/EventTarget"),

  require("./generated/NamedNodeMap"),
  require("./generated/Node"),
  require("./generated/Attr"),
  require("./generated/Element"),
  require("./generated/DocumentFragment"),
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

  require("./generated/HTMLElement.js"),
  require("./generated/HTMLHeadElement.js"),
  require("./generated/HTMLTitleElement.js"),
  require("./generated/HTMLBaseElement.js"),
  require("./generated/HTMLLinkElement.js"),
  require("./generated/HTMLMetaElement.js"),
  require("./generated/HTMLStyleElement.js"),
  require("./generated/HTMLBodyElement.js"),
  require("./generated/HTMLHeadingElement.js"),
  require("./generated/HTMLParagraphElement.js"),
  require("./generated/HTMLHRElement.js"),
  require("./generated/HTMLPreElement.js"),
  require("./generated/HTMLUListElement.js"),
  require("./generated/HTMLOListElement.js"),
  require("./generated/HTMLLIElement.js"),
  require("./generated/HTMLMenuElement.js"),
  require("./generated/HTMLDListElement.js"),
  require("./generated/HTMLDivElement.js"),
  require("./generated/HTMLAnchorElement.js"),
  require("./generated/HTMLAreaElement.js"),
  require("./generated/HTMLBRElement.js"),
  require("./generated/HTMLButtonElement.js"),
  require("./generated/HTMLCanvasElement.js"),
  require("./generated/HTMLDataElement.js"),
  require("./generated/HTMLDataListElement.js"),
  require("./generated/HTMLDetailsElement.js"),
  require("./generated/HTMLDialogElement.js"),
  require("./generated/HTMLDirectoryElement.js"),
  require("./generated/HTMLFieldSetElement.js"),
  require("./generated/HTMLFontElement.js"),
  require("./generated/HTMLFormElement.js"),
  require("./generated/HTMLHtmlElement.js"),
  require("./generated/HTMLImageElement.js"),
  require("./generated/HTMLInputElement.js"),
  require("./generated/HTMLLabelElement.js"),
  require("./generated/HTMLLegendElement.js"),
  require("./generated/HTMLMapElement.js"),
  require("./generated/HTMLMarqueeElement.js"),
  require("./generated/HTMLMediaElement.js"),
  require("./generated/HTMLMeterElement.js"),
  require("./generated/HTMLModElement.js"),
  require("./generated/HTMLOptGroupElement.js"),
  require("./generated/HTMLOptionElement.js"),
  require("./generated/HTMLOutputElement.js"),
  require("./generated/HTMLPictureElement.js"),
  require("./generated/HTMLProgressElement.js"),
  require("./generated/HTMLQuoteElement.js"),
  require("./generated/HTMLScriptElement.js"),
  require("./generated/HTMLSelectElement.js"),
  require("./generated/HTMLSlotElement.js"),
  require("./generated/HTMLSourceElement.js"),
  require("./generated/HTMLSpanElement.js"),
  require("./generated/HTMLTableCaptionElement.js"),
  require("./generated/HTMLTableCellElement.js"),
  require("./generated/HTMLTableColElement.js"),
  require("./generated/HTMLTableElement.js"),
  require("./generated/HTMLTimeElement.js"),
  require("./generated/HTMLTableRowElement.js"),
  require("./generated/HTMLTableSectionElement.js"),
  require("./generated/HTMLTemplateElement.js"),
  require("./generated/HTMLTextAreaElement.js"),
  require("./generated/HTMLUnknownElement.js"),
  require("./generated/HTMLFrameElement.js"),
  require("./generated/HTMLFrameSetElement.js"),
  require("./generated/HTMLIFrameElement.js"),
  require("./generated/HTMLEmbedElement.js"),
  require("./generated/HTMLObjectElement.js"),
  require("./generated/HTMLParamElement.js"),
  require("./generated/HTMLVideoElement.js"),
  require("./generated/HTMLAudioElement.js"),
  require("./generated/HTMLTrackElement.js"),

  require("./generated/SVGElement.js"),
  require("./generated/SVGGraphicsElement.js"),
  require("./generated/SVGSVGElement.js"),
  require("./generated/SVGTitleElement.js"),
  require("./generated/SVGAnimatedString"),
  require("./generated/SVGNumber"),
  require("./generated/SVGStringList"),

  require("./generated/Event"),
  require("./generated/CloseEvent"),
  require("./generated/CustomEvent"),
  require("./generated/MessageEvent"),
  require("./generated/ErrorEvent"),
  require("./generated/HashChangeEvent"),
  require("./generated/PopStateEvent"),
  require("./generated/StorageEvent"),
  require("./generated/ProgressEvent"),
  require("./generated/PageTransitionEvent"),

  require("./generated/UIEvent"),
  require("./generated/FocusEvent"),
  require("./generated/InputEvent"),
  require("./generated/MouseEvent"),
  require("./generated/KeyboardEvent"),
  require("./generated/TouchEvent"),
  require("./generated/CompositionEvent"),
  require("./generated/WheelEvent"),

  require("./generated/BarProp"),
  require("./generated/External"),
  require("./generated/Location"),
  require("./generated/History"),
  require("./generated/Screen"),
  require("./generated/Performance"),
  require("./generated/Navigator"),

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
  require("./generated/XMLSerializer"),

  require("./generated/FormData"),
  require("./generated/XMLHttpRequestEventTarget"),
  require("./generated/XMLHttpRequestUpload"),
  require("./generated/XMLHttpRequest"),
  require("./generated/WebSocket"),

  require("./generated/NodeIterator"),
  require("./generated/TreeWalker"),

  require("./generated/AbstractRange"),
  require("./generated/Range"),
  require("./generated/StaticRange"),
  require("./generated/Selection"),

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

exports.installInterfaces = function (window) {
  // Install generated interface.
  for (const generatedInterface of generatedInterfaces) {
    generatedInterface.install(window);
  }

  // Install legacy HTMLDocument interface
  // https://html.spec.whatwg.org/#htmldocument
  install(window, "HTMLDocument", window.Document);

  // Install Elements
  registerElements(window);

  // These need to be cleaned up...
  style.addToCore(window);
  xpath(window);

  // This one is OK but needs migration to webidl2js eventually.
  nodeFilter(window);
};
