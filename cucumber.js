/**
 * SPDX-License-Identifier: Apache-2.0
 */

 // cucumber.js
let common = [
  'features/**/*.feature',                   // Specify our feature files
  // '--require-module ts-node/register',       // Load TypeScript module
  '--require dist/logging.js',               // enable logging
  '--require dist/step-definitions/**/*.js',  // Load step definitions
  '--require dist/chaincodes.js',            // ensure chaincodes are in the correct directory
  '--format progress-bar',                   // Load custom formatter
].join(' ');

module.exports = {
  default: common
};
