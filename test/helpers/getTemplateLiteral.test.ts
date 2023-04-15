/* eslint-disable @typescript-eslint/no-var-requires */
const { getTemplateLiteral } = require('../../dist/lib/es5');

describe('getTemplateLiteral', ()=> {
  test('invalid inputs', () => {
    expect(getTemplateLiteral(undefined)).toBe('');
    expect(getTemplateLiteral({})).toBe('');
    expect(getTemplateLiteral(null)).toBe('');
  });
  test('valid inputs', () => {
    expect(getTemplateLiteral('test')).toBe('');
    expect(getTemplateLiteral('{{test}}')).toBe('test');
    expect(getTemplateLiteral('{{{test}}}')).toBe('{test}');
    expect(getTemplateLiteral('{{}}test')).toBe('');
    expect(getTemplateLiteral('{{}}')).toBe('');
  });
});