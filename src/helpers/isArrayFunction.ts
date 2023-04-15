const arrayFunctions: Array<string> = ['{{#each'];


/**
 * Takes a string template and replaces template literals with the corresponding value from the "data" object
 * 
 * @since v0.0.1
 * @category Helpers
 * @param {object} element - The object to look for array function key
 * @returns {boolean}
 * @example
 * isArrayFunction({a: 1, '{{#each a:b}}': {b: 2}, c: 3})    //=> true
 * isArrayFunction({a: 1, b: 2, c: 3})    //=> false
 */
export const isArrayFunction = (element: object): boolean => {

  if (typeof element != 'object' || element === null) return false;

  const keys = Object.keys(element);
  return keys.some(k => arrayFunctions.some(a => k.startsWith(a)));

};