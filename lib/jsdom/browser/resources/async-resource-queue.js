"use strict";

/**
 * AsyncResourceQueue is the queue in charge of run the async scripts
 * and notify when they finish.
 */
module.exports = class AsyncResourceQueue {
  constructor() {
    this.items = new Set();
  }

  count() {
    return this.items.size;
  }

  _notify() {
    if (this._listener) {
      this._listener();
    }
  }

  setListener(listener) {
    this._listener = listener;
  }

  push(request, onLoad, onError) {
    const q = this;

    q.items.add(request);

    function check(error, data) {
      let promise;

      if (onError && error) {
        promise = onError(error);
      } else if (onLoad && data) {
        promise = onLoad(data);
      }

      promise
        .then(() => {
          q.items.delete(request);

          if (q.count() === 0) {
            q._notify();
          }
        });
    }

    return request
      .then(data => {
        if (onLoad) {
          return check(null, data);
        }

        q.items.delete(request);

        if (q.count() === 0) {
          q._notify();
        }

        return null;
      })
      .catch(err => {
        if (onError) {
          return check(err);
        }

        q.items.delete(request);

        if (q.count() === 0) {
          q._notify();
        }

        return null;
      });
  }
};
