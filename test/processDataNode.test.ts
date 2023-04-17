/* eslint-disable @typescript-eslint/no-var-requires */
const { processDataNode } = require('../dist/lib/es5');

const processDataNodeInputData = {
  documentNumber: 123,
  title: 'Document Title',
  items: [
    {description: 'Item 1', price: 3.5, qty: 1, lineTotal: 3.5},
    {description: 'Item 2', price: 2, qty: 2, lineTotal: 4},
    {description: 'Item 3', price: 1.23, qty: 3, lineTotal: 3.69},
  ]

};

const processDataNodeInput1 = {
  info: {
    title: 'Document {{documentNumber}}'
  },
  content: [
    '{{title}}',
    {
      table: {
        headerRows: 1,
        body: [
          ['Description', 'Price', 'Qty', 'Line Total'],
          {
            '{{#each items:itm}}': [
              '{{itm.description}}',
              '£{{itm.price.toFixed(2)}}',
              '{{itm.qty}}',
              '£{{itm.lineTotal.toFixed(2)}}'
            ]
          }
        ]
      }
    }
  ]
};

const processDataNodeOutput1 = {
  info: {
    title: 'Document 123'
  },
  content: [
    'Document Title',
    {
      table: {
        headerRows: 1,
        body: [
          ['Description', 'Price', 'Qty', 'Line Total'],
          ['Item 1', '£3.50', '1', '£3.50'],
          ['Item 2', '£2.00', '2', '£4.00'],
          ['Item 3', '£1.23', '3', '£3.69']
        ]
      }
    }
  ]
};

const processDataNodeInput2 = {
  content: [
    '{{title}}',
    {
      table: {
        headerRows: 1,
        body: [
          ['Description', 'Price', 'Qty', 'Line Total'],
          {
            '{{#each items:itm}}': {
              '{{#notequal {{itm.qty}}:2}}': [
                '{{itm.description}}',
                '£{{itm.price.toFixed(2)}}',
                '{{itm.qty}}',
                '£{{itm.lineTotal.toFixed(2)}}'
              ]
            }
          }
        ]
      }
    }
  ]
};

const processDataNodeOutput2 = {
  content: [
    'Document Title',
    {
      table: {
        headerRows: 1,
        body: [
          ['Description', 'Price', 'Qty', 'Line Total'],
          ['Item 1', '£3.50', '1', '£3.50'],
          ['Item 3', '£1.23', '3', '£3.69']
        ]
      }
    }
  ]
};


describe('processDataNode', ()=> {
  test('invalid inputs', () => {
    expect(processDataNode(null, {}, {})).toBe(undefined);
  });
  test('valid inputs', () => {
    expect(processDataNode(processDataNodeInput1, processDataNodeInputData, {})).toStrictEqual(processDataNodeOutput1);
    expect(processDataNode(processDataNodeInput2, processDataNodeInputData, {})).toStrictEqual(processDataNodeOutput2);
  });
});
