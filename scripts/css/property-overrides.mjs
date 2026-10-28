import syntaxData from "css-tree/definition-syntax-data";

// Unsupported feature families and properties whose longhands are not implemented.
// Keep these out of generated CSSOM accessors as well as declaration parsing.
export const excludedProperties = new Set([
  "animation-range-center",
  "background-tbd",
  "block-step",
  "bookmark-label",
  "copy-into",
  "cue",
  "cue-after",
  "cue-before",
  "event-trigger",
  "event-trigger-name",
  "event-trigger-source",
  "fill-break",
  "fill-color",
  "fill-image",
  "fill-origin",
  "fill-position",
  "fill-repeat",
  "fill-size",
  "fit-tolerance",
  "flow-into",
  "nav-down",
  "nav-left",
  "nav-right",
  "nav-up",
  "path-length",
  "pause",
  "pointer-timeline",
  "pointer-timeline-axis",
  "pointer-timeline-name",
  "rest",
  "shape-inside",
  "string-set",
  "stroke-align",
  "stroke-alignment",
  "stroke-break",
  "stroke-color",
  "stroke-dash-corner",
  "stroke-dash-justify",
  "stroke-dashadjust",
  "stroke-dashcorner",
  "stroke-image",
  "stroke-origin",
  "stroke-position",
  "stroke-repeat",
  "stroke-size",
  "timeline-trigger-range",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-volume",
]);

// Grammar differences, missing metadata, and implementation-defined defaults.
// Legacy box properties are independent of flex: https://github.com/whatwg/compat/issues/87
export const propertyOverrides = {
  "--*": {
    inherited: true,
    initial: null,
    value: "<declaration-value>?",
  },
  "-webkit-box-align": {
    initial: "stretch",
    value: syntaxData.properties["box-align"],
  },
  "-webkit-box-flex": {
    initial: "0",
    value: "<number [0,∞]>",
  },
  "-webkit-box-ordinal-group": {
    initial: "1",
    value: "<integer [1,∞]>",
  },
  "-webkit-box-orient": {
    initial: "horizontal",
    value: syntaxData.properties["box-orient"],
  },
  "-webkit-box-pack": {
    initial: "start",
    value: syntaxData.properties["box-pack"],
  },
  "background-position": {
    initial: "0% 0%",
  },
  "background-repeat": {
    initial: undefined,
  },
  "caption-side": {
    value: "top | bottom | inline-start | inline-end",
  },
  "column-width": {
    initial: "auto",
  },
  // Anchor Positioning 2 extends the Conditional 5 definition in the catalogs.
  // https://drafts.csswg.org/css-anchor-position-2/#container-type
  "container-type": {
    value: "normal | [[size | inline-size] || scroll-state || anchored]",
  },
  "font-family": {
    initial: "monospace",
  },
  "glyph-orientation-vertical": {
    value: "auto | <angle> | <number>",
  },
  "page-break-after": {
    value: "auto | always | avoid | left | right",
    initial: undefined,
  },
  "page-break-before": {
    value: "auto | always | avoid | left | right",
    initial: undefined,
  },
  "page-break-inside": {
    initial: undefined,
  },
  "stop-color": {
    initial: "black",
  },
  "stop-opacity": {
    initial: "1",
  },
  "stroke-dasharray": {
    value: "none | <dasharray>",
  },
  "text-box": {
    initial: undefined,
  },
  "timeline-trigger": {
    value:
      "none | [<'timeline-trigger-name'> <'timeline-trigger-source'> [<'timeline-trigger-activation-range'> [/ <'timeline-trigger-active-range'>]?]?]#",
  },
  "transition-property": {
    value: "[none | <single-transition-property>]#",
  },
  "view-transition-name": {
    value: "none | auto | match-element | <custom-ident>",
  },
  zoom: {
    // https://github.com/w3c/csswg-drafts/issues/14618
    value: "normal | <number [0,∞]> | <percentage [0,∞]>",
  },
};
