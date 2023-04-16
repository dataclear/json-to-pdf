/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

const data = jsdoc2md.renderSync({ files: './dist/lib/es6/**/*.js' });

fs.writeFileSync('./README.md', data, {encoding: 'utf8'});