"use strict";

const QuotaExceededError = require("../../../generated/idl/QuotaExceededError");
const StorageEvent = require("../../../generated/idl/StorageEvent");
const idlUtils = require("../../../generated/idl/utils");
const { fireAnEvent } = require("../helpers/events");

// https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface
class StorageImpl {
  constructor(globalObject, args, privateData) {
    const { associatedWindow, storageArea, url, type, storageQuota } = privateData;

    this._associatedWindow = associatedWindow;
    this._items = storageArea;
    this._url = url;
    this._type = type;
    this._quota = storageQuota;

    this._globalObject = globalObject;
  }

  // Select recipients now, then queue a task associated with each recipient's document.
  // https://html.spec.whatwg.org/multipage/webstorage.html#concept-storage-broadcast
  _broadcast(key, oldValue, newValue) {
    return this._associatedWindow._currentOriginData.windowsInSameOrigin
      .filter(target => target !== this._associatedWindow)
      .forEach(target => {
        target._document._queueATask(() => {
          fireAnEvent("storage", target, StorageEvent, {
            key,
            oldValue,
            newValue,
            url: this._url,
            storageArea: target["_" + this._type]
          });
        });
      });
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

    // Concatenate all keys and values to measure their length against the quota
    let itemsTotalLength = key.length + value.length;
    for (const [curKey, curValue] of this._items) {
      // If the key already exists, skip it as it will be set to the new value instead
      if (key !== curKey) {
        itemsTotalLength += curKey.length + curValue.length;
      }
    }
    if (itemsTotalLength > this._quota) {
      throw QuotaExceededError.create(this._globalObject, [
        `The ${this._quota}-code unit storage quota has been exceeded.`,
        {}
      ]);
    }

    this._items.set(key, value);
    this._broadcast(key, oldValue, value);
  }

  removeItem(key) {
    if (this._items.has(key)) {
      const oldValue = this._items.get(key);
      this._items.delete(key);
      this._broadcast(key, oldValue, null);
    }
  }

  clear() {
    if (this._items.size > 0) {
      this._items.clear();
      this._broadcast(null, null, null);
    }
  }

  get [idlUtils.supportedPropertyNames]() {
    return this._items.keys();
  }
}

module.exports = {
  implementation: StorageImpl
};
