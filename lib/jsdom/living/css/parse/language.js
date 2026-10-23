"use strict";

const { parse, stringify } = require("bcp-47");
const { extendedFilter } = require("bcp-47-match");
const strings = require("../utils/string.js");
const languageMappings = require("../../../../generated/language-mappings.js");
const { redundant, extlangs } = languageMappings;

// https://www.rfc-editor.org/rfc/rfc5646#section-2.2.9
function canonicalizeSubtag(subtag, type) {
  subtag = strings.toLowerCase(subtag);
  if (Object.hasOwn(languageMappings[type], subtag)) {
    return languageMappings[type][subtag];
  }
  if (languageMappings.privateUse[type].some(([start, end]) => {
    return subtag.length === start.length && start <= subtag && subtag <= end;
  })) {
    return subtag;
  }
  return null;
}

// https://drafts.csswg.org/selectors-4/#the-lang-pseudo
exports.parseLanguageTag = (input, allowWildcard = false) => {
  input = strings.toLowerCase(input);
  let wildcard = false;
  if (allowWildcard) {
    const subtags = input.split("-");
    wildcard = subtags[0] === "*";
    // Noninitial wildcards are ignored by extended filtering. Use a registered language to parse an
    // initial wildcard, then restore it after validation and canonicalization.
    if (wildcard) {
      subtags[0] = "und";
    }
    input = subtags.filter((subtag, index) => index === 0 || subtag !== "*").join("-");
  }
  if (Object.hasOwn(redundant, input)) {
    input = redundant[input];
  }
  const tag = parse(input);

  if (tag.irregular || tag.regular) {
    return tag.irregular || tag.regular;
  }
  if (!tag.language) {
    return tag.privateuse.length > 0 ? stringify(tag) : null;
  }

  for (const [field, type] of [["language", "languages"], ["script", "scripts"], ["region", "regions"]]) {
    if (tag[field]) {
      const subtag = canonicalizeSubtag(tag[field], type);
      if (!subtag) {
        return null;
      }
      tag[field] = subtag;
    }
  }
  if (tag.extendedLanguageSubtags.some(subtag => !Object.hasOwn(extlangs, subtag))) {
    return null;
  }
  if (new Set(tag.variants).size !== tag.variants.length ||
      new Set(tag.extensions.map(extension => extension.singleton)).size !== tag.extensions.length) {
    return null;
  }
  tag.variants = tag.variants.map(subtag => canonicalizeSubtag(subtag, "variants"));
  if (tag.variants.includes(null)) {
    return null;
  }

  // CSS requires extlang form: `yue` becomes `zh-yue`, so `:lang(zh)` matches Cantonese.
  // https://github.com/w3c/csswg-drafts/issues/4154#issuecomment-3818950415
  if (wildcard) {
    tag.language = "*";
  } else if (Object.hasOwn(extlangs, tag.language)) {
    tag.extendedLanguageSubtags.unshift(tag.language);
    tag.language = extlangs[tag.language];
  }
  tag.extensions.sort((a, b) => {
    return a.singleton < b.singleton ? -1 : 1;
  });
  return stringify(tag);
};

// https://www.rfc-editor.org/rfc/rfc4647#section-3.3.2
exports.matchesLanguageRange = (tag, range) => extendedFilter(tag, range).length > 0;
