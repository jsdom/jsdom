"use strict";
/* eslint-disable no-process-exit */
const util = require("util");
const { JSDOM } = require("../../..");
const tough = require("tough-cookie");
const xhrSymbols = require("./xmlhttprequest-symbols.js");

const dom = new JSDOM();
const xhr = new dom.window.XMLHttpRequest();

const chunks = [];

process.stdin.on("data", chunk => {
  chunks.push(chunk);
});

process.stdin.on("end", () => {
  const buffer = Buffer.concat(chunks);
  const flag = JSON.parse(buffer.toString(), (k, v) => {
    if (v && v.type === "Buffer" && v.data) {
      return new Buffer(v.data);
    }
    if (k === "cookieJar" && v) {
      return tough.CookieJar.fromJSON(v);
    }
    return v;
  });
  flag.synchronous = false;
  xhr[xhrSymbols.flag] = flag;
  const properties = xhr[xhrSymbols.properties];
  properties.readyState = xhr.OPENED;
  try {
    xhr.addEventListener("loadend", () => {
      if (properties.error) {
        properties.error = properties.error.stack || util.inspect(properties.error);
      }
      process.stdout.write(JSON.stringify({ properties }), () => {
        process.exit(0);
      });
    }, false);
    xhr.send(flag.body);
  } catch (error) {
    properties.error += error.stack || util.inspect(error);
    process.stdout.write(JSON.stringify({ properties }), () => {
      process.exit(0);
    });
  }
});
