"use strict";

const defaultProxyHeaderWhiteList = [
  "accept",
  "accept-charset",
  "accept-encoding",
  "accept-language",
  "accept-ranges",
  "cache-control",
  "content-encoding",
  "content-language",
  "content-location",
  "content-md5",
  "content-range",
  "content-type",
  "connection",
  "date",
  "expect",
  "max-forwards",
  "pragma",
  "referer",
  "te",
  "user-agent",
  "via"
];

const defaultProxyHeaderExclusiveList = ["proxy-authorization"];

function Tunnel(request) {
  this.request = request;
  this.proxyHeaderWhiteList = defaultProxyHeaderWhiteList;
  this.proxyHeaderExclusiveList = [];
  if (typeof request.tunnel !== "undefined") {
    this.tunnelOverride = request.tunnel;
  }
}

Tunnel.prototype.isEnabled = function () {
  const self = this;
  const { request } = self;
  // Tunnel HTTPS by default. Allow the user to override this setting.

  // If self.tunnelOverride is set (the user specified a value), use it.
  if (typeof self.tunnelOverride !== "undefined") {
    return self.tunnelOverride;
  }

  // If the destination is HTTPS, tunnel.
  if (request.uri.protocol === "https:") {
    return true;
  }

  // Otherwise, do not use tunnel.
  return false;
};

Tunnel.prototype.setup = function () {
  const self = this;
  const { request } = self;
  if (typeof request.proxy === "string") {
    request.proxy = new URL(request.proxy);
  }
  return false;
};

Tunnel.defaultProxyHeaderWhiteList = defaultProxyHeaderWhiteList;
Tunnel.defaultProxyHeaderExclusiveList = defaultProxyHeaderExclusiveList;
module.exports = Tunnel;
