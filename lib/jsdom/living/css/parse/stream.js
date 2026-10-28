"use strict";

function slice({ data, empty }, from, to) {
  data = data.slice(from, to);
  if (typeof empty === "string" && Array.isArray(data)) {
    return data.join("");
  }
  return data;
}
class Stream {
  index = -1;

  constructor(data, source) {
    if (Array.isArray(data)) {
      this.data = data;
      this.iterator = null;
      this.empty = [];
    } else if (typeof data === "string") {
      // Preserve code-point indexing without allocating a character array for BMP input.
      this.data = /[\uD800-\uDBFF]/.test(data) ? Array.from(data) : data;
      this.iterator = null;
      this.empty = "";
    } else {
      this.data = [];
      this.iterator = data.iterator;
      this.empty = data.empty;
    }
    if (source !== undefined) {
      this.source = typeof source === "string" ? { text: source } : source;
    }
  }

  // Token positions use UTF-16 offsets in preprocessed input. Only CRLF changes
  // its length; streams share that translation while parsing a stylesheet.
  sliceSource(start, end) {
    const { source } = this;
    if (source === undefined) {
      return undefined;
    }
    const { text } = source;
    if (source.offsets === undefined) {
      source.offsets = null;
      if (text.includes("\r\n")) {
        const offsets = [0];
        for (let index = 0; index < text.length;) {
          if (text[index] === "\r" && text[index + 1] === "\n") {
            index += 2;
          } else {
            ++index;
          }
          offsets.push(index);
        }
        source.offsets = offsets;
      }
    }
    if (source.offsets) {
      start = source.offsets[start];
      end = source.offsets[end];
    }
    return text.slice(start, end);
  }

  *[Symbol.iterator]() {
    while (!this.atEnd()) {
      yield this.consume();
    }
  }

  get current() {
    return this.data[this.index];
  }

  atEnd(offset = 0) {
    this.fill(1 + offset);
    return this.data.length <= this.index + 1 + offset;
  }

  backtrack(n) {
    if (this.index < n) {
      throw new RangeError("Unexpected backtrack index greater than current stream index");
    }
    this.index = n;
  }

  consume() {
    if (!this.atEnd()) {
      return this.data[++this.index];
    }
    return null;
  }

  consumeIf(predicate) {
    const { index } = this;
    if (!this.atEnd()) {
      const item = this.data[++this.index];
      if (item && predicate(item)) {
        return item;
      }
    }
    this.index = index;
    return null;
  }

  consumeExpected(character, fallback = null) {
    if (character === this.next()) {
      return this.data[++this.index];
    }
    if (fallback === Error) {
      throw new Error(`"${character}" was expected`);
    }
    return fallback;
  }

  consumeRunOf(item) {
    const start = this.index + 1;
    const matches = typeof item === "function" ? item : (value) => value === item;
    if (this.iterator === null) {
      while (this.index + 1 < this.data.length && matches(this.data[this.index + 1])) {
        this.index++;
      }
    } else {
      while (!this.atEnd() && matches(this.next())) {
        this.index++;
      }
    }
    return slice(this, start, this.index + 1);
  }

  consumeUntil(item) {
    let { data, empty, index: start } = this;
    while (!this.atEnd()) {
      if (this.next() === item) {
        return empty;
      }
      empty = empty.concat(data[++this.index]);
    }
    this.backtrack(start);
    throw new Error(`"${typeof item === "string" ? item : "(object)"}" was expected`);
  }

  fill(size) {
    const { data, index, iterator } = this;
    if (iterator === null) {
      return;
    }
    while (data.length <= index + size) {
      const { done, value } = iterator.next();
      if (done) {
        this.iterator = null;
        break;
      }
      data.push(value);
    }
  }

  next(size = 1, offset = 0) {
    this.fill(size + offset);
    if (size < 0) {
      return this.prev(Math.abs(size), offset);
    }
    switch (size) {
      case 0:
        return this.empty;
      case 1:
        return this.data[this.index + offset + size];
      default:
        return slice(
          this,
          Math.max(this.index + offset + 1, 0),
          Math.max(this.index + offset + 1 + size, 0),
        );
    }
  }

  peek(callback) {
    if (this.atEnd()) {
      return false;
    }
    return callback(this.next());
  }

  prev(size = 1, offset = 0) {
    if (size < 0) {
      return this.next(Math.abs(size), offset);
    }
    switch (size) {
      case 0:
        return this.empty;
      case 1:
        return this.data[this.index - offset - size];
      default:
        return slice(
          this,
          Math.max(this.index - offset - size, 0),
          Math.max(this.index - offset, 0),
        );
    }
  }

  reconsume(n = 1) {
    this.index -= n;
  }
}
module.exports = Stream;
