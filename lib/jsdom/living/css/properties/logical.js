"use strict";

module.exports = {
  "background-position": [
    ["background-position-inline", "background-position-block"],
    ["background-position-x", "background-position-y"]
  ],
  "background-repeat": [
    ["background-repeat-inline", "background-repeat-block"],
    ["background-repeat-x", "background-repeat-y"]
  ],
  "border-clip": [
    ["border-block-end-clip", "border-block-start-clip", "border-inline-end-clip", "border-inline-start-clip"],
    ["border-bottom-clip", "border-left-clip", "border-right-clip", "border-top-clip"]
  ],
  "border-color": [
    [
      "border-block-end-color",
      "border-block-start-color",
      "border-inline-end-color",
      "border-inline-start-color"
    ],
    ["border-bottom-color", "border-left-color", "border-right-color", "border-top-color"]
  ],
  "border-radius": [
    [
      "border-end-end-radius",
      "border-end-start-radius",
      "border-start-end-radius",
      "border-start-start-radius"
    ],
    [
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "border-top-left-radius",
      "border-top-right-radius"
    ]
  ],
  "border-style": [
    [
      "border-block-end-style",
      "border-block-start-style",
      "border-inline-end-style",
      "border-inline-start-style"
    ],
    ["border-bottom-style", "border-left-style", "border-right-style", "border-top-style"]
  ],
  "border-width": [
    [
      "border-block-end-width",
      "border-block-start-width",
      "border-inline-end-width",
      "border-inline-start-width"
    ],
    ["border-bottom-width", "border-left-width", "border-right-width", "border-top-width"]
  ],
  "contain-intrinsic-size": [
    ["contain-intrinsic-block-size", "contain-intrinsic-inline-size"],
    ["contain-intrinsic-height", "contain-intrinsic-width"]
  ],
  "corner-shape": [
    ["corner-end-end-shape", "corner-end-start-shape", "corner-start-end-shape", "corner-start-start-shape"],
    [
      "corner-bottom-left-shape",
      "corner-bottom-right-shape",
      "corner-top-left-shape",
      "corner-top-right-shape"
    ]
  ],
  "inset": [
    ["inset-block-end", "inset-block-start", "inset-inline-end", "inset-inline-start"],
    ["bottom", "left", "right", "top"]
  ],
  "margin": [
    ["margin-block-end", "margin-block-start", "margin-inline-end", "margin-inline-start"],
    ["margin-bottom", "margin-left", "margin-right", "margin-top"]
  ],
  "max-size": [["max-block-size", "max-inline-size"], ["max-height", "max-width"]],
  "min-size": [["min-block-size", "min-inline-size"], ["min-height", "min-width"]],
  "overflow": [["overflow-block", "overflow-inline"], ["overflow-x", "overflow-y"]],
  "overflow-clip-margin": [
    [
      "overflow-clip-margin-block-end",
      "overflow-clip-margin-block-start",
      "overflow-clip-margin-inline-end",
      "overflow-clip-margin-inline-start"
    ],
    [
      "overflow-clip-margin-bottom",
      "overflow-clip-margin-left",
      "overflow-clip-margin-right",
      "overflow-clip-margin-top"
    ]
  ],
  "overscroll-behavior": [
    ["overscroll-behavior-block", "overscroll-behavior-inline"],
    ["overscroll-behavior-x", "overscroll-behavior-y"]
  ],
  "padding": [
    ["padding-block-end", "padding-block-start", "padding-inline-end", "padding-inline-start"],
    ["padding-bottom", "padding-left", "padding-right", "padding-top"]
  ],
  "scroll-margin": [
    [
      "scroll-margin-block-end",
      "scroll-margin-block-start",
      "scroll-margin-inline-end",
      "scroll-margin-inline-start"
    ],
    ["scroll-margin-bottom", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top"]
  ],
  "scroll-padding": [
    [
      "scroll-padding-block-end",
      "scroll-padding-block-start",
      "scroll-padding-inline-end",
      "scroll-padding-inline-start"
    ],
    ["scroll-padding-bottom", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top"]
  ],
  "size": [["block-size", "inline-size"], ["height", "width"]]
};
