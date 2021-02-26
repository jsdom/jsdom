"use strict";

const { CookieJar } = require("tough-cookie");

// Adapt the sometimes-Async api of tough.CookieJar to our requirements
function RequestJar(store) {
  this._jar = new CookieJar(store, { looseMode: true });
}

RequestJar.prototype.setCookie = function setCookie(cookieOrStr, uri, options) {
  return this._jar.setCookieSync(cookieOrStr, uri, options);
};

RequestJar.prototype.getCookieString = function getCookieString(uri) {
  return this._jar.getCookieStringSync(uri);
};

RequestJar.prototype.getCookies = function getCookies(uri) {
  return this._jar.getCookiesSync(uri);
};

module.exports = RequestJar;
