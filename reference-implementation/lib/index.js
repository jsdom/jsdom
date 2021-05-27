'use strict';
// This file is used as the entry point for browserifying the reference implementation to allow it
// to run inside the wpt-runner "browser like" context.

window.gc = gc;

require('../generated/ByteLengthQueuingStrategy.js').install(window, ['Window']);
require('../generated/CountQueuingStrategy.js').install(window, ['Window']);

require('../generated/ReadableStream.js').install(window, ['Window']);
require('../generated/ReadableStreamDefaultReader.js').install(window, ['Window']);
require('../generated/ReadableStreamBYOBReader.js').install(window, ['Window']);
require('../generated/ReadableStreamDefaultController.js').install(window, ['Window']);
require('../generated/ReadableByteStreamController.js').install(window, ['Window']);
require('../generated/ReadableStreamBYOBRequest.js').install(window, ['Window']);

require('../generated/WritableStream.js').install(window, ['Window']);
require('../generated/WritableStreamDefaultWriter.js').install(window, ['Window']);
require('../generated/WritableStreamDefaultController.js').install(window, ['Window']);

require('../generated/TransformStream.js').install(window, ['Window']);
require('../generated/TransformStreamDefaultController.js').install(window, ['Window']);
