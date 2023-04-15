/* eslint-disable @typescript-eslint/no-var-requires */
const { functionifyHeaderFooter } = require('../../dist/lib/es5');


describe('functionifyHeaderFooter', ()=> {
  test('invalid inputs', () => {
    expect(functionifyHeaderFooter(undefined)).toBe(undefined);
    expect(functionifyHeaderFooter(null)).toBe(undefined);
  });
  test('valid inputs', () => {
    expect(functionifyHeaderFooter({footer: {text: 'test text'}})).toStrictEqual({footer: {text: 'test text'}});
    expect(functionifyHeaderFooter({footer: {text: '{{getPageXofY}}'}})(1, 2)).toStrictEqual({footer: {text: '1 of 2'}});
  });
});