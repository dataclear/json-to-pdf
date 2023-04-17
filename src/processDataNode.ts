import { processFunction } from './processFunction';
import { isArrayFunction } from './helpers/isArrayFunction';
import { inflateLiterals } from './inflateLiterals';
import type { Settings } from './types/interfaces';

/**
 * Recursively moves through an object or individual element to replace literals, inflate data and process functions
 * 
 * @since v0.0.1
 * @category Main
 * @param {unknown} val - The current object node
 * @param {object} data - The data to search for replacement values
 * @param {Settings} settings - Settings to control how they are
 * @returns {unknown}
 * @example
 * processDataNode({test: '{{a}}'}, {a: 'b'}, {})    //=> {test: 'b'}
 */
export const processDataNode = (val: unknown, data: object, settings: Settings): unknown => {

  if (undefined == val || null == val) return undefined;

  let returnValue: unknown;

  // array element
  if (Array.isArray(val)){
    returnValue = [];

    for (let i = 0; i < val.length; i++) {
      const el = val[i];
      const elValue = processDataNode(el, data, settings);
      if (typeof elValue !== 'undefined'){
        if (isArrayFunction(el)) {
          returnValue = (returnValue as Array<unknown>).concat(elValue);
        } else {
          (returnValue as Array<unknown>).push(elValue);
        }
      }
    }

  } else if (typeof val == 'object'){
    const functionKey = Object.keys(val).find(k => k.startsWith('{{#'));
    if (functionKey) {
      returnValue = processFunction(functionKey, val[functionKey], data, settings);
      
    } else {
      returnValue = {};

      Object.keys(val).forEach(k => {
        returnValue[k] = processDataNode(val[k], data, settings);
      });

    }
  } else if (typeof val == 'string'){
    // check for literal
    returnValue = inflateLiterals(val, data, settings);

  } else {

    // all other cases, return original value
    returnValue = val;
  }

  return returnValue;

};
