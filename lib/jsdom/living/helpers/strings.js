"use strict";

// https://infra.spec.whatwg.org/#ascii-lowercase
exports.asciiLowercase = s => {
  return s.replace(/[A-Z]/g, l => l.toLowerCase());
};

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

// https://infra.spec.whatwg.org/#ascii-case-insensitive
exports.asciiCaseInsensitiveMatch = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if ((a.charCodeAt(i) | 32) !== (b.charCodeAt(i) | 32)) {
      return false;
    }
  }

  return true;
};
