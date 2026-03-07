"use strict";

class StyleSheetImpl {
  constructor(globalObject, args, privateData = {}) {
    this._globalObject = globalObject;

    this.type = "text/css";
    this.href = null;
    this.title = null;
    this.disabled = false;

    this._ownerNode = privateData.ownerNode || null;
    this.parentStyleSheet = privateData.parentStyleSheet || null;
  }
}

exports.implementation = StyleSheetImpl;
