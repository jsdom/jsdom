var optimist = require('optimist')
    .usage('Run the jsdom test suite')
    .alias('s', 'suites')
    .string('s')
    .describe('s', 'suites that you want to run. ie: -s level1/core,1/html,html')
    .alias('f', 'fail-fast')
    .describe('f', 'stop on the first failed test')
    .alias('h', 'help')
    .describe('h', 'show the help')
    .alias('t', 'tests')
    .describe('t', 'choose the test cases to run. ie: -t jquery')
    .alias('d', 'debug')
    .describe('d', 'run in node\'s interactive debugger mode')
    .alias('v', 'verbose')
    .describe('v', 'show all tests that are being run');

module.exports = optimist;
