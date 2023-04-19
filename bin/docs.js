/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

const headerString = fs.existsSync('./README_HEAD.md') ? fs.readFileSync('./README_HEAD.md', 'utf-8') : '';
const templateString = fs.readFileSync('./README.hbt', 'utf-8');
const footerString = fs.existsSync('./README_FOOT.md') ? fs.readFileSync('./README_FOOT.md', 'utf-8') : '';

let data = jsdoc2md.renderSync({
  files: './src/**/*.ts',
  template: templateString,
  configure: './jsdoc2md.json',
  separators: true
});

if (headerString) data = headerString + '\n' + data;
if (footerString) data = data + '\n' + footerString;

fs.writeFileSync('./README.md', data, {encoding: 'utf8'});
fs.writeFileSync('./dist/README.md', data, {encoding: 'utf8'});