"use strict";
const followRedirects = require("follow-redirects");
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

followRedirects.maxRedirects = 21;
followRedirects.maxBodyLength = 9e15;
const { http, https } = followRedirects;

const ver = process.version.replace("v", "").split(".");
const majorNodeVersion = Number.parseInt(ver[0]);
const minorNodeVersion = Number.parseInt(ver[1]);

function abortRequest(reqClient) {
  reqClient._currentRequest.removeAllListeners();
  reqClient._currentRequest.on("error", () => {});
  if (majorNodeVersion > 13 || (majorNodeVersion === 13 && minorNodeVersion > 13)) {
    reqClient._currentRequest.destroy();
  } else {
    reqClient._currentRequest.abort();
  }
  reqClient.emit("abort");
  reqClient.removeAllListeners();
}

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
      const headerName = res.headers["Set-Cookie"];
      if (headerName !== undefined) {
        if (Array.isArray(res.headers[headerName])) {
          res.headers[headerName].forEach(addCookie);
        } else {
          addCookie(res.headers[headerName]);
        }
      }
    } catch (e) {
      client.emit("error", e);
    }
  };
}

module.exports = { abortRequest, agentFactory, getRequest, cookieHandlerFactory };
