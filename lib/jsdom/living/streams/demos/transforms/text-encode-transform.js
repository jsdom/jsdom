// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Polyfill for TextEncoderStream and TextDecoderStream

(function() {
  'use strict';

  if (typeof self.TextEncoderStream === 'function' &&
      typeof self.TextDecoderStream === 'function') {
    // The constructors exist. Assume that they work and don't replace them.
    return;
  }

  if (typeof self.TextEncoder !== 'function') {
    throw new ReferenceError('TextEncoder implementation required');
  }

  if (typeof self.TextDecoder !== 'function') {
    throw new ReferenceError('TextDecoder implementation required');
  }

  // These symbols end up being different for every realm, so mixing objects
  // created in one realm with methods created in another fails.
  const codec = Symbol('codec');
  const transform = Symbol('transform');

  class TextEncoderStream {
    constructor() {
      this[codec] = new TextEncoder();
      this[transform] =
          new TransformStream(new TextEncodeTransformer(this[codec]));
    }
  }

  class TextDecoderStream {
    constructor(label = undefined, options = undefined) {
      this[codec] = new TextDecoder(label, options);
      this[transform] = new TransformStream(
          new TextDecodeTransformer(this[codec]));
    }
  }

  // ECMAScript class syntax will create getters that are non-enumerable, but we
  // need them to be enumerable in WebIDL-style, so we add them manually.
  // "readable" and "writable" are always delegated to the TransformStream
  // object. Properties specified in |properties| are delegated to the
  // underlying TextEncoder or TextDecoder.
  function addDelegatingProperties(prototype, properties) {
    for (const transformProperty of ['readable', 'writable']) {
      addGetter(prototype, transformProperty, function() {
        return this[transform][transformProperty];
      });
    }

    for (const codecProperty of properties) {
      addGetter(prototype, codecProperty, function() {
        return this[codec][codecProperty];
      });
    }
  }

  function addGetter(prototype, property, getter) {
    Object.defineProperty(prototype, property,
                          {
                            configurable: true,
                            enumerable: true,
                            get: getter
                          });
  }

  addDelegatingProperties(TextEncoderStream.prototype, ['encoding']);
  addDelegatingProperties(TextDecoderStream.prototype,
                          ['encoding', 'fatal', 'ignoreBOM']);

  class TextEncodeTransformer {
    constructor() {
      this._encoder = new TextEncoder();
      this._carry = undefined;
    }

    transform(chunk, controller) {
      chunk = String(chunk);
      if (this._carry !== undefined) {
        chunk = this._carry + chunk;
        this._carry = undefined;
      }
      const terminalCodeUnit = chunk.charCodeAt(chunk.length - 1);
      if (terminalCodeUnit >= 0xD800 && terminalCodeUnit < 0xDC00) {
        this._carry = chunk.substring(chunk.length - 1);
        chunk = chunk.substring(0, chunk.length - 1);
      }
      const encoded = this._encoder.encode(chunk);
      if (encoded.length > 0) {
        controller.enqueue(encoded);
      }
    }

    flush(controller) {
      if (this._carry !== undefined) {
        controller.enqueue(this._encoder.encode(this._carry));
        this._carry = undefined;
      }
    }
  }

  class TextDecodeTransformer {
    constructor(decoder) {
      this._decoder = new TextDecoder(decoder.encoding, {
        fatal: decoder.fatal,
        ignoreBOM: decoder.ignoreBOM
      });
    }

    transform(chunk, controller) {
      const decoded = this._decoder.decode(chunk, {stream: true});
      if (decoded != '') {
        controller.enqueue(decoded);
      }
    }

    flush(controller) {
      // If {fatal: false} is in options (the default), then the final call to
      // decode() can produce extra output (usually the unicode replacement
      // character 0xFFFD). When fatal is true, this call is just used for its
      // side-effect of throwing a TypeError exception if the input is
      // incomplete.
      var output = this._decoder.decode();
      if (output !== '') {
        controller.enqueue(output);
      }
    }
  }

  function exportAs(name, value) {
    // Make it stringify as [object <name>] rather than [object Object].
    value.prototype[Symbol.toStringTag] = name;
    Object.defineProperty(self, name,
                          {
                            configurable: true,
                            enumerable: false,
                            writable: true,
                            value
                          });
  }

  exportAs('TextEncoderStream', TextEncoderStream);
  exportAs('TextDecoderStream', TextDecoderStream);
})();
