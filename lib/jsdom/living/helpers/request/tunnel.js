"use strict";

const tunnel = require("tunnel-agent");

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

function constructProxyHost(uriObject) {
  const { port } = uriObject;
  const { protocol } = uriObject;
  let proxyHost = uriObject.hostname + ":";

  if (port) {
    proxyHost += port;
  } else if (protocol === "https:") {
    proxyHost += "443";
  } else {
    proxyHost += "80";
  }

  return proxyHost;
}

function constructProxyHeaderWhiteList(headers, proxyHeaderWhiteList) {
  const whiteList = proxyHeaderWhiteList
    .reduce((set, header) => {
      set[header.toLowerCase()] = true;
      return set;
    }, {});

  return Object.keys(headers)
    .filter(header => {
      return whiteList[header.toLowerCase()];
    })
    .reduce((set, header) => {
      set[header] = headers[header];
      return set;
    }, {});
}

function constructTunnelOptions(request, proxyHeaders) {
  const { proxy } = request;

  const tunnelOptions = {
    proxy: {
      host: proxy.hostname,
      port: Number(proxy.port),
      proxyAuth: proxy.auth,
      headers: proxyHeaders
    },
    headers: request.headers,
    ca: request.ca,
    cert: request.cert,
    key: request.key,
    passphrase: request.passphrase,
    pfx: request.pfx,
    ciphers: request.ciphers,
    rejectUnauthorized: request.rejectUnauthorized,
    secureOptions: request.secureOptions,
    secureProtocol: request.secureProtocol
  };

  return tunnelOptions;
}

function constructTunnelFnName(uri, proxy) {
  const uriProtocol = uri.protocol === "https:" ? "https" : "http";
  const proxyProtocol = proxy.protocol === "https:" ? "Https" : "Http";
  return [uriProtocol, proxyProtocol].join("Over");
}

function getTunnelFn(request) {
  const { uri } = request;
  const { proxy } = request;
  const tunnelFnName = constructTunnelFnName(uri, proxy);
  return tunnel[tunnelFnName];
}

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

Tunnel.prototype.setup = function (options) {
  const self = this;
  const { request } = self;

  options = options || {};

  if (typeof request.proxy === "string") {
    request.proxy = new URL(request.proxy);
  }

  if (!request.proxy || !request.tunnel) {
    return false;
  }

  // Setup Proxy Header Exclusive List and White List
  if (options.proxyHeaderWhiteList) {
    self.proxyHeaderWhiteList = options.proxyHeaderWhiteList;
  }
  if (options.proxyHeaderExclusiveList) {
    self.proxyHeaderExclusiveList = options.proxyHeaderExclusiveList;
  }

  const proxyHeaderExclusiveList = self.proxyHeaderExclusiveList.concat(defaultProxyHeaderExclusiveList);
  const proxyHeaderWhiteList = self.proxyHeaderWhiteList.concat(proxyHeaderExclusiveList);

  // Setup Proxy Headers and Proxy Headers Host
  // Only send the Proxy White Listed Header names
  const proxyHeaders = constructProxyHeaderWhiteList(request.headers, proxyHeaderWhiteList);
  proxyHeaders.host = constructProxyHost(request.uri);

  proxyHeaderExclusiveList.forEach(request.removeHeader, request);

  // Set Agent from Tunnel Data
  const tunnelFn = getTunnelFn(request);
  const tunnelOptions = constructTunnelOptions(request, proxyHeaders);
  request.agent = tunnelFn(tunnelOptions);

  return true;
};

Tunnel.defaultProxyHeaderWhiteList = defaultProxyHeaderWhiteList;
Tunnel.defaultProxyHeaderExclusiveList = defaultProxyHeaderExclusiveList;
module.exports = Tunnel;
