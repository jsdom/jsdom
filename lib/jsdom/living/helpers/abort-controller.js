"use strict";

// Link an operation's controller to its enclosing lifetimes. Callers must invoke the returned function when the
// operation finishes, so a document's long-lived signal does not retain completed operations through these listeners.
//
// TODO: replace this linking machinery with `AbortSignal.any()` once we no longer support Node.js versions
// affected by https://github.com/nodejs/node/issues/65995. Explicit subscriptions prevent cancellation from being lost
// when an aborted source is garbage-collected.
exports.linkAbortController = (controller, ...signals) => {
  function onAbort(event) {
    controller.abort(event.target.reason);
  }
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }
    signal.addEventListener("abort", onAbort, { once: true });
  }
  return () => {
    for (const signal of signals) {
      signal.removeEventListener("abort", onAbort);
    }
  };
};
