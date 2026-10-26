"use strict";

// https://drafts.csswg.org/selectors-4/#display-state-pseudos
const display = {
  "fullscreen": {},
  "modal": {},
  "open": {},
  "picture-in-picture": {},
  "popover-open": {}
};

// https://drafts.csswg.org/css-gcpm-4/#page-selector-pseudo-classes
// https://drafts.csswg.org/selectors-4/#child-index
// https://drafts.csswg.org/selectors-4/#typed-child-index
// https://drafts.csswg.org/selectors-5/#grid-structural-selectors
const indexed = {
  "first-child": {},
  "first-of-page": {},
  "first-of-type": {},
  "last-child": {},
  "last-of-page": {},
  "last-of-type": {},
  "nth-child()": {
    value: "<a-n-plus-b> [of <complex-real-selector-list>]?"
  },
  "nth-col()": {
    value: "<a-n-plus-b>"
  },
  "nth-last-child()": {
    value: "<a-n-plus-b> [of <complex-real-selector-list>]?"
  },
  "nth-last-col()": {
    value: "<a-n-plus-b>"
  },
  "nth-last-of-type()": {
    value: "<a-n-plus-b>"
  },
  "nth-of-page()": {
    value: "<a-n-plus-b>"
  },
  "nth-of-type()": {
    value: "<a-n-plus-b>"
  },
  "only-child": {},
  "only-of-type": {},
  "start-of-page": {}
};

// https://drafts.csswg.org/css-forms-1/
// https://drafts.csswg.org/selectors-4/#input-pseudos
// https://drafts.csswg.org/selectors-5/#input-pseudos
//
// Fully-styleable (tree-abiding) form pseudo-elements are located in the
// tree-abiding group.
const form = {
  classes: {
    "autofill": {},
    "blank": {},
    "checked": {},
    "default": {},
    "disabled": {},
    "enabled": {},
    "high-value": {},
    "in-range": {},
    "indeterminate": {},
    "invalid": {},
    "low-value": {},
    "optimal-value": {},
    "optional": {},
    "out-of-range": {},
    "placeholder-shown": {},
    "read-only": {},
    "read-write": {},
    "required": {},
    "unchecked": {},
    "user-invalid": {},
    "user-valid": {},
    "valid": {}
  },
  elements: {
    "clear-icon": {},
    "color-swatch": {},
    "field-component": {},
    "field-content": {
      elements: ["field-component", "field-separator"]
    },
    "field-separator": {},
    "reveal-icon": {}
  }
};

// https://drafts.csswg.org/selectors-4/#linguistic-pseudos
const linguistic = {
  "dir()": {
    value: "<ident>"
  },
  "lang()": {
    value: "[<ident> | <string>]#"
  }
};

// https://drafts.csswg.org/selectors-4/#logical-combination
const logical = exports.logical = {
  "is()": {
    value: "<forgiving-selector-list>"
  },
  "not()": {
    value: "<complex-real-selector-list>"
  },
  "where()": {
    value: "<forgiving-selector-list>"
  }
};

// https://drafts.csswg.org/selectors-4/#location
// https://drafts.csswg.org/selectors-5/#location
const navigation = {
  "any-link": {},
  "link": {},
  "local-link": {},
  "local-link()": {
    value: "<level>"
  },
  "target": {},
  "visited": {}
};

// https://drafts.csswg.org/selectors-4/#resource-pseudos
const resource = {
  "buffering": {},
  "muted": {},
  "paused": {},
  "playing": {},
  "seeking": {},
  "stalled": {},
  "volume-locked": {}
};

// https://drafts.csswg.org/css-scroll-snap-2/#snapped
const snapped = {
  "snapped": {},
  "snapped-block": {},
  "snapped-inline": {},
  "snapped-x": {},
  "snapped-y": {}
};

// https://drafts.csswg.org/css-shadow-1/#selectordef-host
// https://drafts.csswg.org/css-shadow-1/#selectordef-host-context
// https://drafts.csswg.org/css-shadow-1/#selectordef-host-function
// https://drafts.csswg.org/selectors-4/#relational
// https://drafts.csswg.org/selectors-4/#scope-pseudo
// https://drafts.csswg.org/selectors-4/#structural-pseudos
const structural = exports.structural = {
  ...indexed,
  "empty": {},
  "has()": {
    value: "<relative-selector-list>"
  },
  "host": {},
  "host()": {
    value: "<compound-selector>"
  },
  "host-context()": {
    value: "<compound-selector>"
  },
  "root": {},
  "scope": {}
};

// https://drafts.csswg.org/selectors-5/#time-pseudos
const time = {
  "current": {},
  "current()": {
    value: "<compound-selector-list>"
  },
  "future": {},
  "past": {}
};

// https://drafts.csswg.org/selectors-4/#useraction-pseudos
// https://drafts.csswg.org/selectors-5/#useraction-pseudos
const userActions = exports.userActions = {
  "active": {},
  "focus": {},
  "focus-visible": {},
  "focus-within": {},
  "hover": {},
  "interest-source": {},
  "interest-target": {}
};

// https://drafts.csswg.org/css-view-transitions-2/#pseudo}
// https://drafts.csswg.org/css-view-transitions-2/#pseudo-classes-for-selective-vt}
const viewTransitions = {
  classes: {
    "active-view-transition": {},
    "active-view-transition-type()": {
      value: "<custom-ident>#"
    }
  },
  elements: {
    "view-transition": {},
    "view-transition-group()": {
      classes: ["only-child"],
      value: "<pt-name-and-class-selector>"
    },
    "view-transition-group-children()": {
      classes: ["only-child"],
      value: "<pt-name-and-class-selector>"
    },
    "view-transition-image-pair()": {
      classes: ["only-child"],
      value: "<pt-name-and-class-selector>"
    },
    "view-transition-new()": {
      classes: ["only-child"],
      value: "<pt-name-and-class-selector>"
    },
    "view-transition-old()": {
      classes: ["only-child"],
      value: "<pt-name-and-class-selector>"
    }
  }
};

// https://drafts.csswg.org/css-pseudo-4/#element-backed
const elemental = {
  "details-content": {
    classes: [/* filled at the bottom of the file */],
    elements: [/* filled at the bottom of the file */]
  },
  "file-selector-button": {
    classes: [/* filled at the bottom of the file */],
    elements: [/* filled at the bottom of the file */]
  },
  "part()": {
    classes: [/* filled at the bottom of the file */],
    elements: [/* filled at the bottom of the file */],
    value: "<ident>+"
  }
};

// https://drafts.csswg.org/css-pseudo-4/#highlight-selectors
const highlight = {
  "grammar-error": {},
  "highlight()": {
    value: "<highlight-name-selector>"
  },
  "search-text": {
    classes: ["current"]
  },
  "selection": {},
  "spelling-error": {},
  "target-text": {}
};

// https://drafts.csswg.org/css-forms-1/#selectordef-checkmark
// https://drafts.csswg.org/css-forms-1/#selectordef-file-selector-button
// https://drafts.csswg.org/css-forms-1/#selectordef-picker
// https://drafts.csswg.org/css-forms-1/#selectordef-picker-icon
// https://drafts.csswg.org/css-forms-1/#selectordef-slider-fill
// https://drafts.csswg.org/css-forms-1/#selectordef-slider-thumb
// https://drafts.csswg.org/css-forms-1/#selectordef-slider-track
// https://drafts.csswg.org/css-forms-1/#selectordef-step-control
// https://drafts.csswg.org/css-forms-1/#selectordef-step-down
// https://drafts.csswg.org/css-forms-1/#selectordef-step-up
// https://drafts.csswg.org/css-overflow-5/#selectordef-scroll-button---scroll-button-direction
// https://drafts.csswg.org/css-overflow-5/#selectordef-scroll-marker
// https://drafts.csswg.org/css-overflow-5/#selectordef-scroll-marker-group
// https://drafts.csswg.org/css-position-4/#selectordef-backdrop
// https://drafts.csswg.org/css-pseudo-4/#element-like
// https://drafts.csswg.org/css-pseudo-4/#treelike
// https://drafts.csswg.org/css-shadow-1/#selectordef-part
const treeAbiding = {
  ...elemental,
  ...viewTransitions.elements,
  "after": {
    elements: ["marker"]
  },
  "backdrop": {},
  "before": {
    elements: ["marker"]
  },
  "checkmark": {},
  "marker": {},
  "picker()": {
    value: "<form-control-identifier>+"
  },
  "picker-icon": {},
  "placeholder": {},
  "scroll-button()": {
    classes: ["disabled", "enabled"],
    value: "'*' | <scroll-button-direction>"
  },
  "scroll-marker": {},
  "scroll-marker-group": {},
  "slider-fill": {},
  "slider-thumb": {},
  "slider-track": {
    elements: ["slider-fill"]
  },
  "step-control": {
    elements: ["step-down", "step-up"]
  },
  "step-down": {},
  "step-up": {}
};

// https://drafts.csswg.org/css-pseudo-4/#typographic-pseudos
const typographic = {
  "first-letter": {
    elements: ["prefix", "suffix"]
  },
  "first-line": {},
  "prefix": {},
  "suffix": {}
};

// https://drafts.csswg.org/css-image-animation-1/#selectordef-animated-image
// https://drafts.csswg.org/css-overflow-5/#selectordef-target-after
// https://drafts.csswg.org/css-overflow-5/#selectordef-target-before
// https://drafts.csswg.org/css-overflow-5/#selectordef-target-current
// https://drafts.csswg.org/selectors-4/#compat
// https://drafts.csswg.org/selectors-4/#defined-pseudo
// https://drafts.csswg.org/selectors-5/#selectordef-state
// https://drafts.csswg.org/selectors-5/#heading-pseudo
// https://drafts.csswg.org/selectors-5/#heading-functional-pseudo
// https://drafts.csswg.org/css-shadow-1/#selectordef-has-slotted
// https://immersive-web.github.io/dom-overlays/#selectordef-xr-overlay
const classes = exports.classes = {
  ...display,
  ...form.classes,
  ...linguistic,
  ...logical,
  ...navigation,
  ...resource,
  ...snapped,
  ...structural,
  ...time,
  ...userActions,
  ...viewTransitions.classes,
  "animated-image": {},
  "defined": {},
  "has-slotted": {},
  "heading": {},
  "heading()": {
    value: "<level>#"
  },
  "state()": {
    value: "<ident>"
  },
  "target-after": {},
  "target-before": {},
  "target-current": {},
  "xr-overlay": {}
};

// https://drafts.csswg.org/css-multicol-2/#selectordef-column
// https://drafts.csswg.org/css-overflow-5/#selectordef-nth-fragment
// https://drafts.csswg.org/css-shadow-1/#selectordef-slotted
const elements = exports.elements = {
  ...form.elements,
  ...highlight,
  ...treeAbiding,
  ...typographic,
  "column": {
    elements: ["scroll-marker"]
  },
  "nth-fragment()": {
    value: "<a-n-plus-b>"
  },
  "slotted()": {
    elements: Object.keys(treeAbiding),
    value: "<compound-selector>"
  }
};
const pseudoClassNames = Object.keys(classes);
const pseudoElementNames = Object.keys(elements);
Object.values(elemental).forEach(pseudo => {
  pseudo.classes.push(...pseudoClassNames);
  pseudo.elements.push(...pseudoElementNames);
});
exports.aliases = {
  classes: new Map([["-webkit-autofill", "autofill"]])
};
