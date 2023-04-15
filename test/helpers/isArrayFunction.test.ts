/* eslint-disable @typescript-eslint/no-var-requires */
const { isArrayFunction } = require('../../dist/lib/es5');

describe('isArrayFunction', ()=> {
  test('invalid inputs', () => {
    expect(isArrayFunction(undefined)).toBe(false);
    expect(isArrayFunction(null)).toBe(false);
    expect(isArrayFunction('a')).toBe(false);
    expect(isArrayFunction(1)).toBe(false);
    expect(isArrayFunction((a) => {return a;})).toBe(false);
  });
  test('valid inputs', () => {
    expect(isArrayFunction({})).toBe(false);
    expect(isArrayFunction({a: []})).toBe(false);
    expect(isArrayFunction({'{{aaa}}': 1})).toBe(false);
    expect(isArrayFunction({'{{#if a}}': 1})).toBe(false);
    expect(isArrayFunction({'{{#not a}}': 1})).toBe(false);
    expect(isArrayFunction({'{{#each a}}': 1})).toBe(true);
  });
});