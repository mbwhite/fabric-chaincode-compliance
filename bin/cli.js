#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process');
const yargs = require('yargs') // eslint-disable-line

const settings = yargs.scriptName("fcc")
  .option('chaincode-dir', {
    alias: 'd',
    type: 'string',
    description: 'Directory with chaincodes',
    required: true
  })
  .option('profile', {
    alias: 'p',
    type: 'string',
    default: ['default'],
    description: 'Which of the inbuilt test profiles to run'
  })
  .option('features', {
    type: 'array',
    description: 'Alternative set of feature files to use, array of globs'
  })
  .option('verbose', {
    choices: ['info', 'debug'],
    description: 'Set logging level',
    default: 'info'
  })
  .epilog('Thank for your compliance')
  .strict()
  .help()
  .argv;

// Need to start the cucumber-js test in it's own process, otherwise it's own
// module loading will just not work properly
// WorkingDir is within the fcc module
let workingDir = path.resolve(__dirname, '..');

// lets find out what directories have been given in the chaincode dir
// read the configuration file in the directory
const chaincodeDir = path.resolve(settings["chaincode-dir"]);
let rawData = fs.readFileSync(path.join(chaincodeDir,'cc.json'));
let cc = JSON.parse(rawData);

cc.chaincodeDir = chaincodeDir;
process.env.FCC_CONFIG = JSON.stringify(cc);

const call = spawnSync(path.resolve(workingDir, '../.bin/cucumber-js'),
  ['-p', settings.profile],
  { env: process.env, shell: true, stdio: ['inherit', 'inherit', 'inherit'], cwd: workingDir });
process.exit(call.exit);