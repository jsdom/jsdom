"use strict";

const { newPromise, resolvePromise } = require("./helpers/webidl.js");
const { extractHighWaterMark, extractSizeAlgorithm } = require("./abstract-ops/queuing-strategy.js");
const aos = require("./abstract-ops/transform-streams.js");

const Transformer = require("../generated/Transformer.js");

exports.implementation = class TransformStreamImpl {
  constructor(globalObject, [transformer, writableStrategy, readableStrategy]) {
    this._globalObject = globalObject;
    if (transformer === undefined) {
      transformer = null;
    }
    const transformerDict = Transformer.convert(transformer);
    if ("readableType" in transformerDict) {
      throw new RangeError("Invalid readableType specified");
    }
    if ("writableType" in transformerDict) {
      throw new RangeError("Invalid writableType specified");
    }

    const readableHighWaterMark = extractHighWaterMark(readableStrategy, 0);
    const readableSizeAlgorithm = extractSizeAlgorithm(readableStrategy);
    const writableHighWaterMark = extractHighWaterMark(writableStrategy, 1);
    const writableSizeAlgorithm = extractSizeAlgorithm(writableStrategy);

    const startPromise = newPromise();

    aos.initializeTransformStream(
      this._globalObject,
      this,
      startPromise,
      writableHighWaterMark,
      writableSizeAlgorithm,
      readableHighWaterMark,
      readableSizeAlgorithm
    );
    aos.setUpTransformStreamDefaultControllerFromTransformer(this._globalObject, this, transformer, transformerDict);

    if ("start" in transformerDict) {
      resolvePromise(startPromise, transformerDict.start.call(transformer, this._controller));
    } else {
      resolvePromise(startPromise, undefined);
    }
  }

  get readable() {
    return this._readable;
  }

  get writable() {
    return this._writable;
  }
};
