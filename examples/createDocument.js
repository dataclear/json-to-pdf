const jsonToPdf = require('../dist/lib/es5/index.js');
const { createWriteStream } = require('fs');

const data = {
  loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.',
  page2text: {
    text: 'This text should appear on the second page'
  }
};

const template = {
  pageSize:'A4',
  pageOrientation:'portrait',
  pageMargins:[25, 25, 25, 25],
  content:[
    '{{loremipsum}}',
    {
      text:'{{page2.text}}',
      pageBreak:'before'
    }
  ]
};

const pdfStream = jsonToPdf.renderPdfTemplate(template, data);

const fileStream = createWriteStream('./examples/example.pdf');

pdfStream.pipe(fileStream);

pdfStream.end();

