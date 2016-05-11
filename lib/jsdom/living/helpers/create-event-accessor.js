"use strict";

const vm = require("vm");

const idlUtils = require("../generated/utils");

const ErrorEvent = require("../generated/ErrorEvent");

exports.appendHandler = function appendHandler(el, eventName) {
  el.addEventListener(eventName, event => {
    event = idlUtils.implForWrapper(event);

    const callback = el["on" + eventName];
    if (callback === null) {
      return;
    }

    const specialError = ErrorEvent.isImpl(event) && event.type === "error" &&
      event.currentTarget.constructor.name === "Window";

    let returnValue = null;
    if (specialError) {
      returnValue = callback.call(
        event.currentTarget, event.message,
        event.filename, event.lineno, event.colno, event.error
      );
    } else {
      returnValue = callback.call(event.currentTarget, event);
    }

    if (event.type === "beforeunload") {
      if (returnValue !== null) {
        event._canceledFlag = true;
        if (event.returnValue === "") {
          event.returnValue = returnValue;
        }
      }
    } else if (specialError) {
      if (returnValue === true) {
        event._canceledFlag = true;
      }
    } else if (returnValue === false) {
      event._canceledFlag = true;
    }
  });
};

// https://html.spec.whatwg.org/#event-handler-idl-attributes
exports.createEventAccessor = function createEventAccessor(obj, event) {
  Object.defineProperty(obj, "on" + event, {
    get() { // https://html.spec.whatwg.org/#getting-the-current-value-of-the-event-handler
      const value = this._eventHandlers[event];
      if (!value) {
        return null;
      }

      if (value.body !== undefined) {
        let element;
        let formOwner = null;
        let document;
        let window;
        if (this.constructor.name === "Window") {
          element = null;
          window = this;
          document = idlUtils.implForWrapper(this.document);
        } else {
          element = this;
          document = element.ownerDocument;
          window = document.defaultView;
        }
        const body = value.body;
        // TODO: location
        if (element !== null) {
          formOwner = element.form || null;
        }

        try {
          // eslint-disable-next-line no-new-func
          Function(body); // properly error out on syntax errors
        } catch (e) {
          // TODO: Report the error
          return null;
        }

        let fn;
        const createFunction = vm.isContext(document._global) ? document.defaultView._globalProxy.Function : Function;
        if (event === "error" && element === null) {
          // eslint-disable-next-line no-new-func
          fn = createFunction(`return function onerror(event, source, lineno, colno, error) {
  ${body}
};`)(document);
        } else {
          const argNames = [];
          const args = [];
          if (element !== null) {
            argNames.push("document");
            args.push(document);
          }
          if (formOwner !== null) {
            argNames.push("formOwner");
            args.push(formOwner);
          }
          if (element !== null) {
            argNames.push("element");
            args.push(element);
          }
          let wrapperBody = `
return function on${event}(event) {
  ${body}
};`;
          for (let i = argNames.length - 1; i >= 0; --i) {
            wrapperBody = `with (${argNames[i]}) { ${wrapperBody} }`;
          }
          argNames.push(wrapperBody);
          fn = createFunction(...argNames)(...args);
        }
        this._eventHandlers[event] = fn;
      }
      return this._eventHandlers[event];
    },
    set(val) {
      if (typeof val !== "function") { // we mix this into non-impl classes
        return;
      }

      // If we've never used the event attribute before, we now reserve a space in the list of
      // event handlers to make sure we always call them in the right order.
      if (!this._eventHandlers[event]) {
        exports.appendHandler(this, event);
      }
      this._eventHandlers[event] = val;
    }
  });
};
