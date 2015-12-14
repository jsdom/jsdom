"use strict";
/*
  ServerJS Javascript DOM Level 1
*/
var HtmlToDom = require("../browser/htmltodom").HtmlToDom;
var Location = require("../browser/location");
var vm = require("vm");
var CookieJar = require('tough-cookie').CookieJar;
const URL = require("../utils").URL;

var core = exports;

core.DOMException = require("../web-idl/DOMException");
core.NamedNodeMap = require("../living/attributes").NamedNodeMap;

core.DOMImplementation = function DOMImplementation(document, /* Object */ features) {
  throw new TypeError("Illegal constructor");
};

core.DOMImplementation.prototype = {
  // All of these are legacy, left because jsdom uses them internally :(. jsdom confused the idea of browser features
  // and jsdom features
  _removeFeature(feature, version) {
    feature = feature.toLowerCase();
    if (this._features[feature]) {
      if (version) {
        var j        = 0,
            versions = this._features[feature],
            l        = versions.length;

        for (j; j<l; j++) {
          if (versions[j] === version) {
            versions.splice(j,1);
            return;
          }
        }
      } else {
        delete this._features[feature];
      }
    }
  },

  _addFeature(feature, version) {
    feature = feature.toLowerCase();

    if (version) {

      if (!this._features[feature]) {
        this._features[feature] = [];
      }

      if (version instanceof Array) {
        Array.prototype.push.apply(this._features[feature], version);
      } else {
        this._features[feature].push(version);
      }

      if (feature === "processexternalresources" &&
          (version === "script" || (version.indexOf && version.indexOf("script") !== -1)) &&
          !vm.isContext(this._ownerDocument._global)) {
        vm.createContext(this._ownerDocument._global);
        this._ownerDocument._defaultView._globalProxy = vm.runInContext("this", this._ownerDocument._global);
        this._ownerDocument._defaultView = this._ownerDocument._defaultView._globalProxy;
      }
    }
  },

  // The real hasFeature is in living/dom-implementation.js, and returns true always.
  // This one is used internally
  _hasFeature(/* string */ feature, /* string */ version) {
    feature = (feature) ? feature.toLowerCase() : '';
    var versions = (this._features[feature]) ?
                    this._features[feature]  :
                    false;

    if (!version && versions.length && versions.length > 0) {
      return true;
    } else if (typeof versions === 'string') {
      return versions === version;
    } else if (versions.indexOf && versions.length > 0) {
      for (var i = 0; i < versions.length; i++) {
        var found = versions[i] instanceof RegExp ?
          versions[i].test(version) :
          versions[i] === version;
        if (found) { return true; }
      }
      return false;
    } else {
      return false;
    }
  }
};

const Node = require("../living/generated/Node");
core.Node = Node.interface;

const Element = require("../living/generated/Element");
core.Element = Element.interface;

core.DocumentFragment = require("../living/generated/DocumentFragment").interface;

core.Document = require("../living/generated/Document").interface;
