"use strict";

/* eslint global-require: 0 */

const DocumentImpl = require("../living/nodes/Document-impl");

function define(core, name, tagNames) {
  const wrapper = require("../living/generated/" + name);
  core[name] = wrapper.interface;

  if (tagNames) {
    for (const tagName of tagNames) {
      DocumentImpl.implementation.prototype._elementBuilders[tagName] = (document, elName) => {
        return wrapper.create([], {
          core,
          ownerDocument: document,
          localName: elName || tagName.toUpperCase()
        });
      };
    }
  }
}

module.exports = core => {
  define(core, "HTMLElement");
  define(core, "HTMLAnchorElement", ["a"]);
  define(core, "HTMLAppletElement", ["applet"]);
  define(core, "HTMLAreaElement", ["area"]);
  define(core, "HTMLAudioElement", ["audio"]);
  define(core, "HTMLBaseElement", ["base"]);
  define(core, "HTMLBodyElement", ["body"]);
  define(core, "HTMLBRElement", ["br"]);
  define(core, "HTMLButtonElement", ["button"]);
  define(core, "HTMLCanvasElement", ["canvas"]);
  define(core, "HTMLDataElement", ["data"]);
  define(core, "HTMLDataListElement", ["datalist"]);
  define(core, "HTMLDialogElement", ["dialog"]);
  define(core, "HTMLDirectoryElement", ["dir"]);
  define(core, "HTMLDivElement", ["div"]);
  define(core, "HTMLDListElement", ["dl"]);
  define(core, "HTMLEmbedElement", ["embed"]);
  define(core, "HTMLFieldSetElement", ["fieldset"]);
  define(core, "HTMLFontElement", ["font"]);
  define(core, "HTMLFormElement", ["form"]);
  define(core, "HTMLFrameElement", ["frame"]);
  define(core, "HTMLFrameSetElement", ["frameset"]);
  define(core, "HTMLHeadingElement", ["h1", "h2", "h3", "h4", "h5", "h6"]);
  define(core, "HTMLHeadElement", ["head"]);
  define(core, "HTMLHRElement", ["hr"]);
  define(core, "HTMLHtmlElement", ["html"]);
  define(core, "HTMLIFrameElement", ["iframe"]);
  define(core, "HTMLImageElement", ["img"]);
  define(core, "HTMLInputElement", ["input"]);
  define(core, "HTMLLabelElement", ["label"]);
  define(core, "HTMLLegendElement", ["legend"]);
  define(core, "HTMLLIElement", ["li"]);
  define(core, "HTMLLinkElement", ["link"]);
  define(core, "HTMLMapElement", ["map"]);
  define(core, "HTMLMediaElement");
  define(core, "HTMLMenuElement", ["menu"]);
  define(core, "HTMLMetaElement", ["meta"]);
  define(core, "HTMLMeterElement", ["meter"]);
  define(core, "HTMLModElement", ["del", "ins"]);
  define(core, "HTMLObjectElement", ["object"]);
  define(core, "HTMLOListElement", ["ol"]);
  define(core, "HTMLOptGroupElement", ["optgroup"]);
  define(core, "HTMLOptionElement", ["option"]);
  define(core, "HTMLOutputElement", ["output"]);
  define(core, "HTMLParagraphElement", ["p"]);
  define(core, "HTMLParamElement", ["param"]);
  define(core, "HTMLPreElement", ["pre"]);
  define(core, "HTMLProgressElement", ["progress"]);
  define(core, "HTMLQuoteElement", ["blockquote", "q"]);
  define(core, "HTMLScriptElement", ["script"]);
  define(core, "HTMLSelectElement", ["select"]);
  define(core, "HTMLSourceElement", ["source"]);
  define(core, "HTMLSpanElement", ["span"]);
  define(core, "HTMLStyleElement", ["style"]);
  define(core, "HTMLTableCaptionElement", ["caption"]);
  define(core, "HTMLTableCellElement");
  define(core, "HTMLTableColElement", ["col", "colgroup"]);
  define(core, "HTMLTableDataCellElement", ["td"]);
  define(core, "HTMLTableElement", ["table"]);
  define(core, "HTMLTableHeaderCellElement", ["th"]);
  define(core, "HTMLTimeElement", ["time"]);
  define(core, "HTMLTitleElement", ["title"]);
  define(core, "HTMLTableRowElement", ["tr"]);
  define(core, "HTMLTableSectionElement", ["thead", "tbody", "tfoot"]);
  define(core, "HTMLTemplateElement", ["template"]);
  define(core, "HTMLTextAreaElement", ["textarea"]);
  define(core, "HTMLTrackElement", ["track"]);
  define(core, "HTMLUListElement", ["ul"]);
  define(core, "HTMLUnknownElement");
  define(core, "HTMLVideoElement", ["video"]);
};
