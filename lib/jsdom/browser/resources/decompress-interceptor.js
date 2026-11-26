"use strict";
const { DecoratorHandler, interceptors } = require("undici");

const decompress = interceptors.decompress();

module.exports = () => (dispatch) => (opts, handler) => {
  let originalHeaders, originalRawHeaders;
  const restoreHeadersHandler = new DecoratorHandler(handler);
  restoreHeadersHandler.onResponseStart = (controller, statusCode, headers, statusMessage) => {
    // XHR and user interceptors need the wire headers even though the body is decoded.
    controller.rawHeaders = originalRawHeaders;
    return handler.onResponseStart?.(controller, statusCode, originalHeaders, statusMessage);
  };

  return decompress((dispatchOpts, decompressHandler) => {
    const captureHeadersHandler = new DecoratorHandler(decompressHandler);
    captureHeadersHandler.onResponseStart = (controller, statusCode, headers, statusMessage) => {
      originalHeaders = { ...headers };
      const { rawHeaders } = controller;
      originalRawHeaders = Array.isArray(rawHeaders)
        ? [...rawHeaders]
        : rawHeaders && { ...rawHeaders };
      return decompressHandler.onResponseStart(controller, statusCode, headers, statusMessage);
    };
    return dispatch(dispatchOpts, captureHeadersHandler);
  })(opts, restoreHeadersHandler);
};
