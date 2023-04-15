/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getObjectValue } = require('../../dist/lib/es5');

describe('getObjectValue', ()=> {
  test('invalid inputs', () => {
    expect(getObjectValue(undefined, undefined)).toBe(undefined);
    expect(getObjectValue({}, undefined)).toBe(undefined);
    expect(getObjectValue(undefined, 'key')).toBe(undefined);
    expect(getObjectValue({a: {b: {c: 1}}}, 'a..b..c')).toBe(undefined);
  });
  test('valid inputs', () => {
    expect(getObjectValue({a: {b: {c: 1}}}, 'a.b.c')).toBe(1);
    expect(getObjectValue({a: {b: {c: 1}}}, 'a.b.c.d')).toBe(undefined);
    expect(getObjectValue({a: {b: {c: 1}}}, 'c')).toBe(undefined);
    expect(getObjectValue({a: null}, 'a')).toBe(null);
    expect(getObjectValue({a: {b: {c: 6}}}, 'a.b.c.toFixed(2)')).toBe('6.00');
    expect(getObjectValue({a: {b: 1}}, 'b')).toBe(undefined);
    expect(getObjectValue({a: {b: 123_456.789}}, 'a.b.toLocaleString(en-GB)')).toBe('123,456.789');
    expect(getObjectValue({a: {b: new Date(Date.UTC(2012, 11, 20, 3, 0, 0))}}, 'a.b.toLocaleString(ko-KR)')).toBe('2012. 12. 20. 오전 3:00:00');
    expect(getObjectValue({a: {b: [1]}}, 'a.b')).toStrictEqual([1]);
  });
});