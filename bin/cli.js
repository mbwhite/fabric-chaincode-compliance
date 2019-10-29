#!/usr/bin/env node

const { spawn }  = require('child_process');
const yargs = require('yargs') // eslint-disable-line

const settings =  yargs.scriptName("fcc")
  .option('chaincode-dir', {
    alias: 'd',
    type: 'string',
    description: 'Directory with chaincodes'
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
      choices: ['info','debug'],
      description: 'Set logging level',
      default: 'info'
  })
  .epilog('Thank for your compliance')
  .strict()
  .help()
  .argv;


const call = spawn('./node_modules/.bin/cucumber-js',['-p',settings.profile], { env: process.env, shell: false, stdio: ['inherit', 'inherit', 'inherit'],cwd:process.cwd()});
console.log(call);
console.log(settings);