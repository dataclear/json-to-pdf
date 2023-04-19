/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

const templateString = fs.readFileSync('./README_HEAD.hbt', 'utf-8');

const data = jsdoc2md.renderSync({
  files: './src/**/*.ts',
  template: templateString,
  configure: './jsdoc2md.json',
  separators: true
});

fs.writeFileSync('./README.md', data, {encoding: 'utf8'});
fs.writeFileSync('./dist/README.md', data, {encoding: 'utf8'});