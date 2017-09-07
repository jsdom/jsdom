"use strict";

const _paused = Symbol("paused");
const _ending = Symbol("ending");
const _nested = Symbol("nested");
const _blocked = Symbol("blocked");
const _asynced = Symbol("asynced");
const _deferred = Symbol("deferred");

class ResourceQueue {
  constructor() {
    this[_paused] = true;
    this[_blocked] = [];
    this[_asynced] = {};
    this[_deferred] = [];
  }

  resume(callback) {
    this[_ending] = callback;

    if (!this[_paused]) {
      end(this);
      return;
    }
    this[_paused] = false;

    evaluateDeferred(this);
  }

  push(callback) {
    const q = this;

    const item = {
      evaluate() {
        if (!this.ready || q[_blocked][0] !== this) {
          return;
        }
        q[_blocked].shift();
        callback(this.err, this.data, this.response);
        if (q[_blocked].length) {
          q[_blocked][0].evaluate();
          return;
        }
        end(q);
      }
    };
    q[_blocked].push(item);

    return (err, data, response) => {
      item.ready = true;
      item.err = err;
      item.data = data;
      item.response = response;
      item.evaluate();
    };
  }

  soon(callback) {
    const q = this;

    const item = {
      evaluate() {
        if (!this.ready || q[_blocked][0] !== this) {
          return;
        }
        q[_blocked].shift();
        callback(this.err, this.data, this.response);
        if (q[_blocked].length) {
          q[_blocked][0].evaluate();
          return;
        }
        end(q);
      }
    };
    q[_blocked].unshift(item);

    return (err, data, response) => {
      item.ready = true;
      item.err = err;
      item.data = data;
      item.response = response;
      item.evaluate();
    };
  }

  nest() {
    const q = this;

    const nestedPrev = q[_nested];
    q[_nested] = true;

    if (!q[_blocked].length) {
      function unnest0() {
        delete q[_nested];
      }
      return unnest0;
    }

    const nestSymbol = Symbol("queue-nest-key");
    q[nestSymbol] = q[_blocked];
    q[_blocked] = [];

    function unnest() {
      q[_blocked] = q[_blocked].concat(q[nestSymbol]);
      delete q[nestSymbol];
      q[_nested] = nestedPrev;
    }
    return unnest;
  }

  defer(callback) {
    const q = this;

    const item = {
      evaluate() {
        if (!this.ready) {
          return;
        }
        callback(this.err, this.data, this.response);
      }
    };
    q[_deferred].push(item);

    return (err, data, response) => {
      item.ready = true;
      item.err = err;
      item.data = data;
      item.response = response;
      evaluateDeferred(q);
    };
  }

  async(callback) {
    const q = this;

    const key = Symbol("asynced-item-key");

    const item = {
      evaluate() {
        if (!this.ready) {
          return;
        }
        delete q[_asynced][key];
        callback(this.err, this.data, this.response);
        end(q);
      }
    };
    q[_asynced][key] = item;

    return (err, data, response) => {
      item.ready = true;
      item.err = err;
      item.data = data;
      item.response = response;
      item.evaluate();
    };
  }
}

function end(queue) {
  if (typeof queue[_ending] === "function" &&
      !queue[_nested] &&
      !queue[_blocked].length &&
      !queue[_deferred].length &&
      !Object.getOwnPropertySymbols(queue[_asynced]).length) {
    const ending = queue[_ending];
    delete queue[_ending];
    ending();
  }
}

function evaluateDeferred(queue) {
  if (queue[_paused] || queue[_blocked].length) {
    return;
  }
  queue[_deferred] = queue[_deferred].filter(evaluate);
  end(queue);
}

function evaluate(item) {
  if (!item.ready) {
    return true;
  }
  item.evaluate();
  return false;
}

module.exports = ResourceQueue;
