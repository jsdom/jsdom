'use strict';

const { newPromise, resolvePromise } = require('./helpers/webidl.js');
const { ExtractHighWaterMark, ExtractSizeAlgorithm } = require('./abstract-ops/queuing-strategy.js');
const aos = require('./abstract-ops/transform-streams.js');

const Transformer = require('../../../generated/Transformer.js');

exports.implementation = class TransformStreamImpl {
  constructor(globalObject, [transformer, writableStrategy, readableStrategy]) {
    this._globalObject = globalObject;
    if (transformer === undefined) {
      transformer = null;
    }
    const transformerDict = Transformer.convert(transformer);
    if ('readableType' in transformerDict) {
      throw new RangeError('Invalid readableType specified');
    }
    if ('writableType' in transformerDict) {
      throw new RangeError('Invalid writableType specified');
    }

    const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
    const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
    const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
    const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);

    const startPromise = newPromise();

    aos.InitializeTransformStream(
      this._globalObject, this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm
    );
    aos.SetUpTransformStreamDefaultControllerFromTransformer(this._globalObject, this, transformer, transformerDict);

    if ('start' in transformerDict) {
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
