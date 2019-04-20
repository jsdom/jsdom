"use strict";

const PRIVILEGED_NO_CORS_REQUEST = new Set(["range"]);

const NO_CORS_SAFELISTED_REQUEST = new Set([
  `accept`,
  `accept-language`,
  `content-language`,
  `content-type`
]);

const FORBIDDEN = new Set([
  `accept-charset`,
  `accept-encoding`,
  `access-control-request-headers`,
  `access-control-request-method`,
  `connection`,
  `content-length`,
  `cookie`,
  `cookie2`,
  `date`,
  `dnt`,
  `expect`,
  `host`,
  `keep-alive`,
  `origin`,
  `referer`,
  `te`,
  `trailer`,
  `transfer-encoding`,
  `upgrade`,
  `via`
]);

const FORBIDDEN_RESPONSE = new Set(["set-cookie", "set-cookie2"]);

module.exports = {
  PRIVILEGED_NO_CORS_REQUEST,
  NO_CORS_SAFELISTED_REQUEST,
  FORBIDDEN,
  FORBIDDEN_RESPONSE
};
