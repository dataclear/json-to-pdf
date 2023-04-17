/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

const data = jsdoc2md.renderSync({
  files: './src/**/*.ts',
  plugin: ['plugins/markdown', 'node_modules/jsdoc-babel'],
  separators: true
});

fs.writeFileSync('./README.md', data, {encoding: 'utf8'});