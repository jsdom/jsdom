"use strict";

// https://infra.spec.whatwg.org/#strip-newlines
exports.stripNewlines = s => {
  return s.replace(/[\n\r]+/g, "");
};

// https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace
exports.stripLeadingAndTrailingASCIIWhitespace = s => {
  return s.replace(/^[ \t\n\f\r]+/, "").replace(/[ \t\n\f\r]+$/, "");
};

// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
exports.stripAndCollapseASCIIWhitespace = s => {
  return s.replace(/[ \t\n\f\r]+/g, " ").replace(/^[ \t\n\f\r]+/, "").replace(/[ \t\n\f\r]+$/, "");
};

// https://html.spec.whatwg.org/multipage/infrastructure.html#valid-simple-colour
exports.isValidSimpleColor = s => {
  return /^#[a-fA-F\d]{6}$/.test(s);
};
