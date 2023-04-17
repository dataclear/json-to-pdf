import { isDeepStrictEqual } from 'util';
import { getObjectValue } from './helpers/getObjectValue';
import { getTemplateLiteral } from './helpers/getTemplateLiteral';
import { processDataNode } from './processDataNode';

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
export const processFunction = (functionKey: string, object: object, data: object, settings: Settings): unknown => {

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

    case 'unless': {
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
