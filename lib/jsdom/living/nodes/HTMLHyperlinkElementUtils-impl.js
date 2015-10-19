"use strict";
const whatwgURL = require("whatwg-url");
const documentBaseURL = require("../helpers/document-base-url").documentBaseURL;

exports.implementation = class HTMLHyperlinkElementUtilsImpl {
  _htmlHyperlinkElementUtilsSetup() {
    this.url = null;
  }

  toString() {
    return this.href;
  }

  get href() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null) {
      const href = this.getAttribute("href");
      return href === null ? "" : href;
    }

    return whatwgURL.serializeURL(url);
  }

  set href(v) {
    this.setAttribute("href", v);
  }

  get origin() {
    reinitializeURL(this);

    if (this.url === null) {
      return "";
    }

    return whatwgURL.serializeURLToUnicodeOrigin(this.url);
  }

  get protocol() {
    reinitializeURL(this);

    if (this.url === null) {
      return ":";
    }

    return this.url.scheme + ":";
  }

  set protocol(v) {
    if (this.url === null) {
      return;
    }

    whatwgURL.basicURLParse(v + ":", { url: this.url, stateOverride: "scheme start" });
    updateHref(this);
  }

  get username() {
    reinitializeURL(this);

    if (this.url === null) {
      return "";
    }

    return this.url.username;
  }

  set username(v) {
    const url = this.url;

    if (url === null || url.host === null || url.nonRelative) {
      return;
    }

    whatwgURL.setTheUsername(url, v);
    updateHref(this);
  }

  get password() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.password === null) {
      return "";
    }

    return url.password;
  }

  set password(v) {
    const url = this.url;

    if (url === null || url.host === null || url.nonRelative) {
      return;
    }

    whatwgURL.setThePassword(url, v);
    updateHref(this);
  }

  get host() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.host === null) {
      return "";
    }

    if (url.port === null) {
      return whatwgURL.serializeHost(url.host);
    }

    return whatwgURL.serializeHost(url.host) + ":" + whatwgURL.serializeInteger(url.port);
  }

  set host(v) {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.nonRelative) {
      return;
    }

    whatwgURL.basicURLParse(v, { url, stateOverride: "host" });
    updateHref(this);
  }

  get hostname() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.host === null) {
      return "";
    }

    return whatwgURL.serializeHost(url.host);
  }

  set hostname(v) {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.nonRelative) {
      return;
    }

    whatwgURL.basicURLParse(v, { url, stateOverride: "hostname" });
    updateHref(this);
  }

  get port() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.port === null) {
      return "";
    }

    return whatwgURL.serializeInteger(url.port);
  }

  set port(v) {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.host === null || url.nonRelative || url.scheme === "file") {
      return;
    }

    whatwgURL.basicURLParse(v, { url, stateOverride: "port" });
    updateHref(this);
  }

  get pathname() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null) {
      return "";
    }

    if (url.nonRelative) {
      return url.path[0];
    }

    return "/" + url.path.join("/");
  }

  set pathname(v) {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.nonRelative) {
      return;
    }

    url.path = [];
    whatwgURL.basicURLParse(v, { url, stateOverride: "path start" });
  }

  get search() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.query === null || url.query === "") {
      return "";
    }

    return "?" + url.query;
  }

  set search(v) {
    reinitializeURL(this);
    const url = this.url;

    if (url === null) {
      return;
    }

    if (v === "") {
      url.query = null;
    } else {
      const input = v[0] === "?" ? v.substring(1) : v;
      url.query = "";
      whatwgURL.basicURLParse(input, { url, stateOverride: "query" });
    }
    updateHref(this);
  }

  get hash() {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.fragment === null || url.fragment === "") {
      return "";
    }

    return "#" + url.fragment;
  }

  set hash(v) {
    reinitializeURL(this);
    const url = this.url;

    if (url === null || url.scheme === "javascript") {
      return;
    }

    if (v === "") {
      url.fragment = null;
    } else {
      const input = v[0] === "#" ? v.substring(1) : v;
      url.fragment = "";
      whatwgURL.basicURLParse(input, { url, stateOverride: "fragment" });
    }
    updateHref(this);
  }
};

function reinitializeURL(hheu) {
  const url = hheu.url;
  if (url !== null && url.nonRelative) {
    return;
  }

  setTheURL(hheu);
}

function setTheURL(hheu) {
  const href = hheu.getAttribute("href");
  try {
    hheu.url = resolveURLToResultingParsedURL(href, hheu);
  } catch (e) {
    hheu.url = null;
  }
}

function updateHref(hheu) {
  hheu.setAttribute("href", whatwgURL.serializeURL(hheu.url));
}

function resolveURLToResultingParsedURL(url, absoluteURLOrElement) {
  // https://html.spec.whatwg.org/#resolve-a-url

  // Encoding stuff ignored; always UTF-8 for us.

  const base = typeof absoluteURLOrElement === "string" ? absoluteURLOrElement :
               documentBaseURL(absoluteURLOrElement._ownerDocument);
  const baseURLRecord = whatwgURL.parseURL(base);

  return whatwgURL.parseURL(url, { baseURL: baseURLRecord });
  // This returns the resulting parsed URL; to get the resulting absolute URL, just serialize it.
}
