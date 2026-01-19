"use strict";

const MIMEType = require("whatwg-mimetype");
const { asciiLowercase, asciiUppercase } = require("../helpers/strings");
const { getDecodeAndSplit } = require("../fetch/header-types");

const READY_STATES = Object.freeze({
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
});

function headerListContains(list, name) {
  const lowerName = asciiLowercase(name);
  return list.some(header => asciiLowercase(header.name) === lowerName);
}

function headerListGet(list, name) {
  const lowerName = asciiLowercase(name);
  const values = [];
  for (const header of list) {
    if (asciiLowercase(header.name) === lowerName) {
      values.push(header.value);
    }
  }
  if (values.length === 0) {
    return null;
  }
  return values.join(", ");
}

function headerListGetDecodeAndSplit(list, name) {
  const value = headerListGet(list, name);
  if (value === null) {
    return null;
  }
  return getDecodeAndSplit(value);
}

function headerListAppend(list, name, value) {
  const lowerName = asciiLowercase(name);
  for (const header of list) {
    if (asciiLowercase(header.name) === lowerName) {
      name = header.name;
      break;
    }
  }
  list.push({ name, value });
}

function headerListSet(list, name, value) {
  const lowerName = asciiLowercase(name);
  let seen = false;
  for (let i = list.length - 1; i >= 0; i--) {
    if (asciiLowercase(list[i].name) === lowerName) {
      if (seen) {
        list.splice(i, 1);
      } else {
        list[i].value = value;
        seen = true;
      }
    }
  }
  if (!seen) {
    list.push({ name, value });
  }
}

function headerListDelete(list, name) {
  const lowerName = asciiLowercase(name);
  for (let i = list.length - 1; i >= 0; i--) {
    if (asciiLowercase(list[i].name) === lowerName) {
      list.splice(i, 1);
    }
  }
}

function headerListCombine(list, name, value) {
  const lowerName = asciiLowercase(name);
  for (const header of list) {
    if (asciiLowercase(header.name) === lowerName) {
      header.value = header.value + ", " + value;
      return;
    }
  }
  list.push({ name, value });
}

function convertHeaderNamesToSortedLowercaseSet(names) {
  const set = new Set();
  for (const name of names) {
    set.add(asciiLowercase(name));
  }
  return [...set].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function headerListSortAndCombine(list) {
  const headers = [];
  const names = convertHeaderNamesToSortedLowercaseSet(list.map(header => header.name));

  for (const name of names) {
    if (name === "set-cookie") {
      for (const header of list) {
        if (asciiLowercase(header.name) === name) {
          headers.push({ name, value: header.value });
        }
      }
      continue;
    }

    const value = headerListGet(list, name);
    if (value !== null) {
      headers.push({ name, value });
    }
  }

  return headers;
}

function legacyUppercaseByteLessThan(a, b) {
  const A = asciiUppercase(a);
  const B = asciiUppercase(b);
  const min = Math.min(A.length, B.length);
  for (let i = 0; i < min; i++) {
    const ac = A.charCodeAt(i);
    const bc = B.charCodeAt(i);
    if (ac !== bc) {
      return ac < bc;
    }
  }
  return A.length < B.length;
}

function sortByLegacyUppercase(headerList) {
  return [...headerList].sort((a, b) => {
    if (a.name === b.name) {
      return 0;
    }
    return legacyUppercaseByteLessThan(a.name, b.name) ? -1 : 1;
  });
}

function extractLength(headers) {
  const values = headerListGetDecodeAndSplit(headers, "Content-Length");
  if (values === null) {
    return null;
  }

  let candidateValue = null;
  for (const value of values) {
    if (candidateValue === null) {
      candidateValue = value;
    } else if (value !== candidateValue) {
      return "failure";
    }
  }

  if (candidateValue === "") {
    return null;
  }

  for (let i = 0; i < candidateValue.length; i++) {
    const code = candidateValue.charCodeAt(i);
    if (code < 0x30 || code > 0x39) {
      return null;
    }
  }

  return Number(candidateValue);
}

function extractMIMEType(headers) {
  let charset = null;
  let essence = null;
  let mimeType = null;

  const values = headerListGetDecodeAndSplit(headers, "Content-Type");
  if (values === null) {
    return "failure";
  }

  for (const value of values) {
    const temporaryMimeType = MIMEType.parse(value);
    if (!temporaryMimeType || temporaryMimeType.essence === "*/*") {
      continue;
    }

    mimeType = temporaryMimeType;

    if (mimeType.essence !== essence) {
      charset = null;
      if (mimeType.parameters.has("charset")) {
        charset = mimeType.parameters.get("charset");
      }
      essence = mimeType.essence;
    } else if (!mimeType.parameters.has("charset") && charset !== null) {
      mimeType.parameters.set("charset", charset);
    }
  }

  return mimeType || "failure";
}

module.exports = {
  READY_STATES,
  headerListContains,
  headerListGet,
  headerListGetDecodeAndSplit,
  headerListAppend,
  headerListSet,
  headerListDelete,
  headerListCombine,
  headerListSortAndCombine,
  sortByLegacyUppercase,
  extractLength,
  extractMIMEType
};
