"use strict";

const DOMException = require("domexception");
const StorageEvent = require("../generated/StorageEvent");
const idlUtils = require("../generated/utils");

// https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface
class StorageImpl {
  constructor(args, { associatedWindow, storageArea, url, type }) {
    this._associatedWindow = associatedWindow;
    this._items = storageArea;
    this._url = url;
    this._type = type;

    // The spec suggests a default storage quota of 5 MB
    this._quota = 5000;
  }

  _dispatchStorageEvent(key, oldValue, newValue) {
    return this._associatedWindow._currentOriginData.windowsInSameOrigin
      .filter(target => target !== this._associatedWindow)
      .forEach(target => target.dispatchEvent(StorageEvent.create([
        "storage",
        {
          bubbles: false,
          cancelable: false,
          key,
          oldValue,
          newValue,
          url: this._url,
          storageArea: target["_" + this._type]
        }
      ])));
  }

  get length() {
    return this._items.size;
  }

  key(n) {
    if (n >= this._items.size) {
      return null;
    }
    return [...this._items.keys()][n];
  }

  getItem(key) {
    if (this._items.has(key)) {
      return this._items.get(key);
    }
    return null;
  }

  setItem(key, value) {
    const oldValue = this._items.get(key) || null;

    if (oldValue === value) {
      return;
    }

    // Concatenate all keys and values to measure their size against the quota
    let itemsConcat = key + value;
    this._items.forEach((v, k) => {
      itemsConcat += v + k;
    });
    if (Buffer.byteLength(itemsConcat) > this._quota) {
      throw new DOMException(`The ${this._quota} byte storage quota has been exceeded.`, "QuotaExceededError");
    }

    setTimeout(this._dispatchStorageEvent.bind(this), 0, key, oldValue, value);

    this._items.set(key, value);
  }

  removeItem(key) {
    if (this._items.has(key)) {
      setTimeout(this._dispatchStorageEvent.bind(this), 0, key, this._items.get(key), null);

      this._items.delete(key);
    }
  }

  clear() {
    if (this._items.size > 0) {
      setTimeout(this._dispatchStorageEvent.bind(this), 0, null, null, null);

      this._items.clear();
    }
  }

  get [idlUtils.supportedPropertyNames]() {
    return this._items.keys();
  }
}

module.exports = {
  implementation: StorageImpl
};
