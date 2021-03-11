"use strict";
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");
const { http, https } = require("./follow-redirects");

function getRequest(uri, rejectUnauthorized) {
  const isHttps = uri.substr(0, 6) === "https:";
  if (isHttps) {
    return (url, options) => https.request(url, Object.assign({}, options, { rejectUnauthorized }));
  }
  return http.request;
}

function agentFactory(proxy, rejectUnauthorized) {
  const agentOpts = { keepAlive: true, rejectUnauthorized };
  if (proxy) {
    const url = new URL(proxy);
    const proxyOpts = { ...url, ...agentOpts };
    return { https: new HttpsProxyAgent(proxyOpts), http: new HttpProxyAgent(proxyOpts) };
  }
  return { http: new http.Agent(agentOpts), https: new https.Agent(agentOpts) };
}

function cookieHandlerFactory(addCookie, client) {
  return function setCookies(res) {
    try {
      if (Array.isArray(res.headers["set-cookie"])) {
        res.headers["set-cookie"].forEach(addCookie);
      } else {
        addCookie(res.headers["set-cookie"]);
      }
    } catch (e) {
      client.emit("error", e);
    }
  };
}

module.exports = { agentFactory, getRequest, cookieHandlerFactory };
