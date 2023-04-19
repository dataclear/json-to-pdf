const jsonToPdf = require('../dist/lib/es5/index.js');

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

app.get('/file.pdf', (req, res) => {
  const pdfStream = jsonToPdf.renderPdfTemplate(template, data);
  res.type('pdf');
  pdfStream.pipe(res);
  pdfStream.end();
});