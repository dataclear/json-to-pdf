/* eslint-disable @typescript-eslint/no-var-requires */
const { nestedKeyValue } = require('../../dist/lib/es5');

describe('nestedKeyValue', ()=> {
  test('invalid inputs', () => {
    expect(nestedKeyValue(undefined, undefined)).toBe(undefined);
    expect(nestedKeyValue({}, undefined)).toBe(undefined);
    expect(nestedKeyValue(undefined, 'key')).toBe(undefined);
  });
  test('valid inputs', () => {
    expect(nestedKeyValue({}, 'a')).toBe(undefined);
    expect(nestedKeyValue({a: 1}, 'a')).toBe(1);
    expect(nestedKeyValue({a: undefined}, 'a')).toBe(undefined);
    expect(nestedKeyValue({a: null}, 'a')).toBe(null);
    expect(nestedKeyValue({a: {b: undefined}}, 'b')).toBe(undefined);
    expect(nestedKeyValue({a: {b: 1}}, 'b')).toBe(1);
    expect(nestedKeyValue({a: {b: [1]}}, 'b')).toStrictEqual([1]);
  });
});