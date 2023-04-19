/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-var-requires */
const { renderPdfTemplate } = require('../dist/lib/es5');

const testData = {
  title: 'Document Title',
  items: [
    {data1: 'First Line', data2: 'ABC001', data3: 100},
    {data1: 'Second Line', data2: 'ABC002', data3: 120},
    {data1: 'Third Line', data2: 'ABC003', data3: 99.2555},
    {data1: 'Fourth Line', data2: 'ABC004', data3: 1455.001},
    {data1: 'Fifth Line', data2: 'ABC005', data3: 30},
    {data1: 'Sixth Line', data2: 'ABC006', data3: 4001.5},
  ],
  total: 5805.7565
};

const testDocumentDefinition = {
  dateFormat: 'Do MMM YYYY',
  pageSize: 'A4',
  pageOrientation: 'portrait',
  pageMargins: [25, 155, 25, 100],
  header: {
    margin: [25,25,25,0],
    columns: [
      {
        width: 10,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
      },
      {
        width: '*',
        text: '{{title}}',
        style: {
          alignment: 'center',
          fontSize: 16
        }
      },
      {
        width: '*',
        text: 'Right Text',
        style: {
          alignment: 'right'
        }
      }
    ]
  },
  content: [
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.',
    {
      table: {
        headerRows: 1,
        widths: [250, 65, 65],
        body: [
          ['Header 1', 'Header 2', 'Header 3'],
          {
            '{{#each items:item}}': [
              '{{item.data1}}', 
              '{{item.data2}}', 
              {
                text: '{{item.data3.toFixed(2)}}',
                style: {
                  alignment: 'right'
                }
              }
            ]
          },
          ['Total', '', '{{total.toFixed(2)}}']
        ]
      }
    },
    {
      text: 'This text should appear on the second page',
      pageBreak: 'before'
    }
  ],
  footer: {
    margin: [25,25,25,25],
    style: {
      alignment:'center',
      fontSize: 12
    },
    stack: [
      'Here is some footer text',
      {
        text: ['Page ','{{getPageXofY}}']
      }
    ]
  },
};


describe('renderPdfTemplate', ()=> {

  it('returns a valid document stream', async () => {

    const pdfDoc = renderPdfTemplate(testDocumentDefinition, testData);

    pdfDoc.toArray().then(bufferData => {
      expect(bufferData).toBeInstanceOf(Buffer);
      expect(bufferData && bufferData[0]).toBe(0x25);
      expect(bufferData && bufferData[1]).toBe(0x50);
      expect(bufferData && bufferData[2]).toBe(0x44);
      expect(bufferData && bufferData[3]).toBe(0x46);
    });

  });

  

});