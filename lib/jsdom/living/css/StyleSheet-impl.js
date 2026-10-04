"use strict";

const MediaList = require("../../../generated/idl/MediaList.js");

class StyleSheetImpl {
  constructor(globalObject, args, privateData = {}) {
    this._globalObject = globalObject;

    this.type = "text/css";
    this.href = privateData.href || null;
    this.title = privateData.title || null;
    this.disabled = false;

    this.ownerNode = privateData.ownerNode || null;
    this.parentStyleSheet = privateData.parentStyleSheet || null;
    this.media = MediaList.createImpl(globalObject, [], {
      mediaText: privateData.mediaText || "",
      onChange: () => this._invalidateStyleCache()
    });
  }

  _invalidateStyleCache() {
    if (this.parentStyleSheet) {
      this.parentStyleSheet._invalidateStyleCache();
    } else if (this.ownerNode) {
      this.ownerNode._ownerDocument._clearStyleCache();
    }
  }
}

exports.implementation = StyleSheetImpl;
