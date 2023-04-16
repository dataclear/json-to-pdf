
/**
 * Extracts a literal value by removing double curly braces
 * 
 * @since v0.0.1
 * @category Helpers
 * @param {string} val - The string to process
 * @returns {string}
 * @example
 * getTemplateLiteral('test')    //=> ''
 * getTemplateLiteral('{{test}}')    //=> 'test'
 * getTemplateLiteral('{{{test}}}')    //=> '{test}'
 * getTemplateLiteral('{{}}test')    //=> ''
 * getTemplateLiteral('{{}}')    //=> ''
 */


export const getTemplateLiteral = (val: string): string => {
  if (String(val).startsWith('{{') && String(val).endsWith('}}')){
    return String(val).slice(2,-2);
  }
  return '';
};