// jshint browser: true
document.getElementById("test").innerHTML = String(
  document.currentScript &&
  document.currentScript instanceof HTMLScriptElement &&
  document.currentScript.src.indexOf("files/current-script.js") !== -1
);
