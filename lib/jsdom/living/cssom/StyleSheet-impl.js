"use strict";

class StyleSheetImpl {
  constructor(globalObject, args, privateData) {
    this._globalObject = globalObject;

    this.type = "text/css";
    this.href = privateData.href || null;
    this.title = privateData.title || null;
    this.disabled = false;

    this._ownerNode = privateData.ownerNode || null;
    this._parentStyleSheet = privateData.parentStyleSheet || null;
    this._media = privateData.media || null;
  }

  get parentStyleSheet() {
    return this._parentStyleSheet;
  }

  get media() {
    return this._media;
  }
}

exports.implementation = StyleSheetImpl;
