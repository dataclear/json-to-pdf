import * as moment from 'moment';

import { getTemplateLiteral } from './helpers/getTemplateLiteral';
import { fixedFormulas } from './helpers/fixedFormulas';
import { getObjectValue } from './helpers/getObjectValue';
import { nestedKeyValue } from './helpers/nestedKeyValue';
import type { Settings } from './types/interfaces';

const REGEX_LITERAL_TEMPLATE = /{{[A-z0-9.]+[()A-z0-9.]*}}/gi;


/**
 * Takes a string template and replaces template literals with the corresponding value from the "data" object
 * 
 * @since v0.0.1
 * @category Main
 * @param {string} template - The string to search and replace within
 * @param {object} data - The data to search for replacement values
 * @param {Settings} settings - Settings to control how they are
 * @returns {string}
 * @example
 * inflateLiterals('test', {}, {})    //=> 'test'
 * inflateLiterals('here is a {{val}}', {val: 'test'}, {})    //=> 'here is a test'
 * inflateLiterals('here is another {{val}}{{val}}', {val: 'test'}, {})    //=> 'here is a testtest'
 * inflateLiterals('here is a {{val.0}}', {val: ['test1', 'test2]}, {})    //=> 'here is a test1'
 */
export const inflateLiterals = (template: string, data: object, settings: Settings) : string | (() => string) => {

  if (!template) return '';

  const fullLiteral = getTemplateLiteral(template);

  if (fullLiteral && fixedFormulas[fullLiteral]){
    return fixedFormulas[fullLiteral];
  }

  const matches = template.match(REGEX_LITERAL_TEMPLATE);
  if (matches && matches.length > 0){

    matches.forEach(m => {

      const matchText : string = m.slice(2, -2);
      let objectValue: unknown = getObjectValue(data, matchText);
      if (Array.isArray(objectValue)){
        const arrayItems = objectValue.map(a => {
          if (typeof a === 'string'){
            return a;
          } else {
            return nestedKeyValue(a, 'name');
          }
        });
        objectValue = arrayItems.join('\n');
      } else if (objectValue instanceof Date && typeof objectValue.getMonth === 'function'){
        //convert from date
        objectValue = `${moment(objectValue).format(settings.dateFormat)}`;
      }

      template = template.replace(m, String(objectValue));

    });

    return template;

  } else {
    return template;
  }

};