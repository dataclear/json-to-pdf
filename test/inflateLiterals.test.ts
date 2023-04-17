/* eslint-disable @typescript-eslint/no-var-requires */
const { inflateLiterals } = require('../dist/lib/es5');


describe('inflateLiterals', ()=> {
  test('invalid inputs', () => {
    expect(inflateLiterals(null, {}, {})).toBe('');
    expect(inflateLiterals(undefined, undefined, undefined)).toBe('');
    expect(inflateLiterals('test', undefined, null)).toBe('test');
  });
  test('valid inputs', () => {
    expect(inflateLiterals('test', {}, {})).toBe('test');
    expect(inflateLiterals('here is a {{val}}', {val: 'test'}, {})).toBe('here is a test');
    expect(inflateLiterals('here is another {{val}}{{val}}', {val: 'test'}, {})).toBe('here is another testtest');
    expect(inflateLiterals('here is a {{val.0}}', {val: ['test1', 'test2']}, {})).toBe('here is a test1');
    expect(inflateLiterals('here is a {{val}}', {val: ['test1', 'test2']}, {})).toBe('here is a test1, test2');
    expect(inflateLiterals('', {}, {})).toBe('');
    expect(inflateLiterals('{{getPageXofY}}', {}, {})(1, 2)).toBe('1 of 2');
  });
});