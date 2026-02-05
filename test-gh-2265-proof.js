/**
 * GH-2265: Browsers throw "Illegal invocation" when DOM methods are called
 * through a Proxy (brand check fails). JSDOM should do the same.
 */
const { JSDOM } = require("./lib/api.js");

const dom = new JSDOM("<body></body>");
const document = dom.window.document;

document.body.innerHTML = "<span></span>";
const span = document.querySelector("span");
const p = new Proxy(span, {}); // no handler = transparent proxy

// 1) Brand check path exists: calling setter with invalid this must throw
let badCall = null;
try {
  const desc = Object.getOwnPropertyDescriptor(dom.window.Element.prototype, "innerHTML");
  if (desc && desc.set) desc.set.call({}, "x"); // invalid this
} catch (e) {
  badCall = e;
}
console.log("1) innerHTML setter with invalid this throws?", badCall ? "yes" : "NO");
if (badCall) console.log("   message:", badCall.message.slice(0, 70));

// 2) Real element works (sanity)
span.innerHTML = "real";
console.log("2) Real span.textContent:", span.textContent);

// 3) Proxy: should throw in browser, does not in jsdom
let thrown = null;
try {
  p.innerHTML = "miami";
} catch (e) {
  thrown = e;
}
console.log("3) Proxy p.innerHTML = 'miami' threw?", thrown ? "yes" : "no");
if (!thrown) console.log("   p.textContent:", p.textContent);
else console.log("   (correct: getter would also throw)");

// 4) Why: implForWrapper(proxy) returns impl because proxy forwards implSymbol to target
const utils = require("./lib/jsdom/living/generated/utils.js");
const hasImpl = (o) => o && utils.implForWrapper(o) != null;
console.log("4) implForWrapper(span) has impl?", hasImpl(span));
console.log("   implForWrapper(proxy) has impl?", hasImpl(p), "<-- proxy forwards symbol to target, so check passes");

console.log("");
console.log("=== Conclusion ===");
console.log(thrown && /not a valid instance|Illegal invocation/i.test(thrown.message)
  ? "FIXED: jsdom throws like browser (GH-2265)"
  : !thrown && hasImpl(p)
    ? "BUG STILL THERE: proxy bypasses brand check"
    : "Other");
