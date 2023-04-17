/* eslint-disable @typescript-eslint/no-var-requires */
const { processFunction } = require('../dist/lib/es5');


describe('processFunction', ()=> {
  test('invalid inputs', () => {
    expect(processFunction(null, {}, {}, {})).toBe(undefined);
    expect(processFunction('', {}, {}, {})).toBe(undefined);
    expect(processFunction('each', {}, {}, {})).toBe(undefined);
    expect(processFunction('{{#each', {}, {}, {})).toBe(undefined);
    expect(processFunction('{{#each}}', {}, {}, {})).toBe(undefined);
    expect(processFunction('{{#each x:y}}', {}, {}, {})).toBe(undefined);
  });
  test('valid inputs', () => {
    expect(
      processFunction(
        '{{#each items:item}}', 
        {text: '{{item}}'}, 
        {items: ['a', 'b', 'c']}, 
        {}
      )
    ).toStrictEqual([{text: 'a'},{text: 'b'},{text: 'c'}]);
    expect(
      processFunction(
        '{{#equal 3:{{length}}}}', 
        {text: '{{result}}'}, 
        {items: ['a', 'b', 'c'], length: 3, result: 'test'}, 
        {}
      )
    ).toStrictEqual({text: 'test'});
    expect(
      processFunction(
        '{{#if print}}', 
        {text: '{{result}}'}, 
        {items: ['a', 'b', 'c'], print: true, result: 'test'}, 
        {}
      )
    ).toStrictEqual({text: 'test'});
    expect(
      processFunction(
        '{{#if print}}', 
        {text: '{{result}}'}, 
        {items: ['a', 'b', 'c'], print: false, result: 'test'}, 
        {}
      )
    ).toBe(undefined);
  });
});
