"use strict";

// https://drafts.csswg.org/css-shadow-1/#rules-for-parsing-a-list-of-part-mappings
function forwardedParts(element) {
  const queries = element._getMemoizedQueries();
  if (queries.forwardedParts === undefined) {
    const mappings = new Map();
    const attribute = element.getAttributeNS(null, "exportparts");
    if (attribute !== null) {
      for (const mapping of attribute.split(",")) {
        const match =
          /^[\t\n\f\r ]*([^\t\n\f\r :]+)[\t\n\f\r ]*(?::[\t\n\f\r ]*([^\t\n\f\r :]+)[\t\n\f\r ]*)?$/.exec(
            mapping,
          );
        if (match === null) {
          continue;
        }
        const inner = match[1];
        let names = mappings.get(inner);
        if (names === undefined) {
          names = new Set();
          mappings.set(inner, names);
        }
        names.add(match[2] ?? inner);
      }
    }
    queries.forwardedParts = mappings;
  }
  return queries.forwardedParts;
}

// Follow only the target's shadow ancestors instead of constructing every host's entire part map.
exports.getPartExposures = (element) => {
  let root = element.getRootNode();
  const attribute = element.getAttributeNS(null, "part");
  if (root._host === undefined || attribute === null) {
    return [];
  }
  let names = new Set(attribute.split(/[\t\n\f\r ]+/).filter(Boolean));
  const exposures = [];
  while (root._host !== undefined && names.size > 0) {
    const host = root._host;
    root = host.getRootNode();
    exposures.push({ host, root, names });
    if (root._host === undefined) {
      break;
    }
    const mappings = forwardedParts(host);
    const forwarded = new Set();
    for (const name of names) {
      const outerNames = mappings.get(name);
      if (outerNames !== undefined) {
        for (const outerName of outerNames) {
          forwarded.add(outerName);
        }
      }
    }
    names = forwarded;
  }
  return exposures;
};
