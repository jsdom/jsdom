"use strict";
const whatwgURL = require("whatwg-url");
const { resolveEntry } = require("../file-api/blob-url-store");

module.exports = {
  ...whatwgURL,

  // https://html.spec.whatwg.org/multipage/urls-and-fetching.html#matches-about:blank
  matchesAboutBlank(url) {
    return url.scheme === "about" && url.path === "blank" &&
      url.username === "" && url.password === "" && url.host === null;
  },

  // https://url.spec.whatwg.org/#concept-url-parser
  parseURL(input, options) {
    const url = whatwgURL.parseURL(input, options);
    if (url !== null && url.scheme === "blob") {
      url.blobURLEntry = resolveEntry(url);
    }
    return url;
  },

  // https://url.spec.whatwg.org/#concept-url-origin
  serializeURLOrigin(url) {
    if (url.scheme === "blob" && url.blobURLEntry) {
      return url.blobURLEntry.environment._origin;
    }
    return whatwgURL.serializeURLOrigin(url);
  }
};
