"use strict";

class StyleSheetImpl {
  constructor(globalObject, args, privateData) {
    this._globalObject = globalObject;

    this.type = "text/css";
    this.href = privateData.href || null;
    this.title = privateData.title || null;
    this.disabled = false;

    this._ownerNode = privateData.ownerNode || null;
    this.parentStyleSheet = privateData.parentStyleSheet || null;
    this.media = privateData.media || null;
  }
}

exports.implementation = StyleSheetImpl;
