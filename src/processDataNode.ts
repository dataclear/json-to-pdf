import { isDeepStrictEqual } from 'util';
import { getObjectValue } from './helpers/getObjectValue';
import { getTemplateLiteral } from './helpers/getTemplateLiteral';
import { isArrayFunction } from './helpers/isArrayFunction';
import { inflateLiterals } from './inflateLiterals';
import type { Settings } from './types/interfaces';

/**
 * Used to process array and logic functions, returns inflated data or undefined
 * 
 * @since v0.0.1
 * @category Main
 * @param {string} functionKey - The function to perform
 * @param {object} object - The object to be inflated by the function
 * @param {object} data - The data used to inflate the object
 * @param {Settings} settings - Settings to control how items are processed
 * @returns {unknown}
 * @example
 * processFunction('{{#each items:item}}', {text: '{{item}}'}, {items: ['a', 'b', 'c']}, {})    //=> '[{text: 'a'},{text: 'b'},{text: 'c'}]'
 */
export const processFunction = (functionKey: string, object: object, data: object, settings: Settings) => {

  if (!functionKey) return undefined;

  // extract function parts
  const [_, functionName, ...elements] = getTemplateLiteral(functionKey).split(/[#: ]/);

  let returnVal: unknown;

  switch (functionName) {
    case 'each': {
      const dataPath = elements[0];
      const dataKey = elements[1];

      if (!dataPath || !dataKey) return undefined;

      let iterator = getObjectValue(data, dataPath);

      if (!iterator) return undefined;

      if (!Array.isArray(iterator)) iterator = Object.entries(iterator);

      returnVal = [];
      for (const e of (iterator as Array<unknown>)) {
        const newElement = processDataNode(object, {[dataKey]: e}, settings);
        if (undefined != newElement)
          (returnVal as Array<unknown>).push(newElement);
      }
      
      break;
    }

    case 'if': {

      const varName = elements[0];

      const truthyVal = getObjectValue(data, varName);
      if (truthyVal) {
        returnVal = processDataNode(object, data, settings);
      } else {
        returnVal = undefined;
      }
      break;
    }

    case 'not': {
      const varName = elements[0];
      const truthyVal = getObjectValue(data, varName);
      if (!truthyVal) {
        returnVal = processDataNode(object, data, settings);
      } else {
        returnVal = undefined;
      }
      break;
    }

    case 'equal': {

      let item1: object | string = elements[0];
      let item2: object | string = elements[1];

      if (getTemplateLiteral(item1)) item1 = getObjectValue(data, getTemplateLiteral(item1));
      if (getTemplateLiteral(item2)) item2 = getObjectValue(data, getTemplateLiteral(item2));


      if (typeof item1 == 'object' && isDeepStrictEqual(item1, item2)) {
        returnVal = processDataNode(object, data, settings);
        return returnVal;
      } 
      
      if (typeof item1 != 'object' && item1 == item2) {
        returnVal = processDataNode(object, data, settings);
        return returnVal;
      }
      returnVal = undefined;
      break;
    }

    case 'notequal': {

      let item1: object | string = elements[0];
      let item2: object | string = elements[1];

      if (getTemplateLiteral(item1)) item1 = getObjectValue(data, getTemplateLiteral(item1));
      if (getTemplateLiteral(item2)) item2 = getObjectValue(data, getTemplateLiteral(item2));


      if (typeof item1 == 'object' && isDeepStrictEqual(item1, item2)) {
        returnVal = undefined;
        return returnVal;
      } 
      
      if (typeof item1 != 'object' && item1 == item2) {
        returnVal = undefined;
        return returnVal;
      }
      returnVal = processDataNode(object, data, settings);
      break;
    }
    default:
      returnVal = undefined;
  }

  return returnVal;

};

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