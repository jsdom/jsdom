"use strict";

const idlUtils = require("../generated/utils");
const nwmatcher = require("nwmatcher/src/nwmatcher-noqsa");

exports.matchesDontThrow = (elImpl, selector) => {
  const document = elImpl._ownerDocument;

  if (!document._nwmatcherDontThrow) {
    document._nwmatcherDontThrow = nwmatcher({ document });
    document._nwmatcherDontThrow.configure({ UNIQUE_ID: false, LOGERRORS: false, VERBOSITY: false, SVG_LCASE: true });
  }

  return document._nwmatcherDontThrow.match(idlUtils.wrapperForImpl(elImpl), selector);
};

// nwmatcher gets `document.documentElement` at creation-time, so we have to initialize lazily, since in the initial
// stages of Document initialization, there is no documentElement present yet.
exports.addNwmatcher = parentNode => {
  const document = parentNode._ownerDocument;

  if (!document._nwmatcher) {
    document._nwmatcher = nwmatcher({ document });
    document._nwmatcher.configure({ UNIQUE_ID: false, LOGERRORS: false, SVG_LCASE: true });
  }

  return document._nwmatcher;
};
