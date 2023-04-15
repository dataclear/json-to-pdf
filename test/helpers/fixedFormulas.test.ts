/* eslint-disable @typescript-eslint/no-var-requires */
const { fixedFormulas } = require('../../dist/lib/es5');


describe('fixedFormulas.getPageXofY', ()=> {
  test('invalid inputs', () => {
    expect(fixedFormulas.getPageXofY(undefined)).toBe(undefined);
    expect(fixedFormulas.getPageXofY(null)).toBe(undefined);
  });
  test('valid inputs', () => {
    expect(fixedFormulas.getPageXofY(1, 2)).toBe('1 of 2');
  });
});

describe('fixedFormulas.getPageX', ()=> {
  test('invalid inputs', () => {
    expect(fixedFormulas.getPageX(undefined)).toBe(undefined);
    expect(fixedFormulas.getPageX(null)).toBe(undefined);
  });
  test('valid inputs', () => {
    expect(fixedFormulas.getPageX(1)).toBe('1');
  });
});
