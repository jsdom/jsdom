"use strict";
/* eslint-env browser */

document.getElementById("test").innerHTML = String(
  document.currentScript &&
  document.currentScript instanceof HTMLScriptElement &&
  document.currentScript.src.includes("files/current-script.js")
);
