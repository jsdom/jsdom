'use strict';
/* eslint-disable no-console, no-process-exit */
const { mkdirSync } = require('fs');
const path = require('path');
const Transformer = require('webidl2js');

const input = path.resolve(__dirname, './lib');
const output = path.resolve(__dirname, './generated');

mkdirSync(output, { recursive: true });

const transformer = new Transformer({
  implSuffix: '-impl',
  suppressErrors: true // until https://github.com/jsdom/webidl2js/pull/123 lands
});

transformer.addSource(input, input);
transformer.generate(output)
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
