// cucumber.js
let common = [
  'features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require src/step-definitions/**/*.ts', // Load step definitions
  '--require dist/chaincodes.js',  // ensure chaincodes are in the correct directory
  '--format progress-bar', // Load custom formatter
  // '--format node_modules/cucumber-pretty' // Load custom formatter
].join(' ');

module.exports = {
  default: common
};
