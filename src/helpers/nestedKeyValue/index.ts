/**
 * Recursively iterates through object to find given key and returns value
 * 
 * @since v0.0.1
 * @category Helper
 * @param {*} obj - The object to search
 * @param {*} key - The key to find
 * @returns {*}
 * @example
 * nestedKeyValue({a: {b: {c: 1}}}, 'c')  //=> 1
 * nestedKeyValue({a: {b: {c: 1}}}, 'd')  //=> undefined
 * nestedKeyValue({a: {b: {c: 1}}}, 'b')  //=> {c: 1}
 * isNill({}, 'anything')                 //=> undefined
 */

export const nestedKeyValue = (obj: object, key: string): unknown => {
  let result: unknown;
  if (typeof obj !== 'object'){
    return;
  }
  if (obj[key]){
    return obj[key];
  }
  for (const prop in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, prop) && typeof obj[prop] === 'object' ) {
      result = nestedKeyValue(obj[prop], key);
      if(result !== undefined){
        return result;
      }
    }
  }
  return result;
};