"use strict";

function StateEntry(data, title, url) {
  this.data = data;
  this.title = title;
  this.url = url;
}

module.exports = History;

function History(window) {
  this._states = [];
  this._index = -1;
  this._window = window;
  this._location = window.location;
}

History.prototype = {
  constructor: History,

  get length() {
    return this._states.length;
  },

  get state() {
    var state = this._states[this._index];
    return state ? state.data : null;
  },

  back: function () {
    this.go(-1);
  },

  forward: function () {
    this.go(1);
  },

  go: function (delta) {
    if (typeof delta === "undefined" || delta === 0) {
      this._location.reload();
      return;
    }

    var newIndex = this._index + delta;

    if (newIndex < 0 || newIndex >= this.length) {
      return;
    }

    this._index = newIndex;
    this._applyState(this._states[this._index]);
  },

  pushState: function (data, title, url) {
    var state = new StateEntry(data, title, url);
    if (this._index + 1 !== this._states.length) {
      this._states = this._states.slice(0, this._index + 1);
    }
    this._states.push(state);
    this._applyState(state);
    this._index++;
  },

  replaceState: function (data, title, url) {
    var state = new StateEntry(data, title, url);
    this._states[this._index] = state;
    this._applyState(state);
  },

  _applyState: function(state) {
    var url = state.url;
    var pathname;

    // Absolute path
    if (state.url.charAt(0) === "/") {
      pathname = state.url;
    } else {
      pathname = [this._location.pathname, state.url].join("/");
    }

    this._location._url.pathname = pathname;
    this._signalPopstate(state);
  },

  _signalPopstate: function(state) {
    if (this._window.document) {
      var ev = this._window.document.createEvent("HTMLEvents");
      ev.initEvent("popstate", false, false);
      ev.state = state.data;
      process.nextTick(function () {
        this._window.dispatchEvent(ev);
      }.bind(this));
    }
  },

  toString: function () {
    return "[object History]";
  }
};
