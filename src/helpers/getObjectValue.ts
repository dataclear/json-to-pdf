const REGEX_IS_FORMULA = /[A-z0-9]+\([^)]+\)/;
const REGEX_FORMULA_PARAMS_GROUPS = /(?<name>[A-z0-9]+)\((?<params>[^)]*)\)/i;

/* istanbul ignore next */ 
const inflationWhitelist = {
  'toFixed': (val: number | string, dec: number) : string | undefined => {
    if (typeof val == 'string' && !isNaN(parseFloat(val)))
      return Number(val).toFixed(dec);
    if (typeof val == 'number')
      return val.toFixed(dec);
  },
  'toLocaleString': (val: number | string | Date, loc: string) : string | undefined => {
    if (val == null || val == undefined) return undefined;
    if (typeof val == 'number')
      return Number(val).toLocaleString(loc);
    if (val instanceof Date && !isNaN(val.getTime()))
      return (new Date(val)).toLocaleString(loc);
    return undefined;
  }
};

/**
 * Extracts a value from an object based on a string or array of paths
 * Inflates a set of fixed formula names with processed values
 * 
 * @since v0.0.1
 * @category Helpers
 * @param {object} obj - The object to search
 * @param {string | Array<string>} path - The path to traverse
 * @returns {*}
 * @example
 * getObjectValue({a: {b: {c: 1}}}, 'a.b.c')    //=> 1
 * getObjectValue({a: {b: {c: 1}}}, 'a.b.c.d')  //=> undefined
 * getObjectValue({a: {b: {c: 1}}}, 'a..b..c')  //=> undefined
 * getObjectValue({a: {b: {c: 1}}}, 'c')        //=> undefined
 * getObjectValue({a: {b: {c: [1,2,3]}}}, 'a.b.c.1')        //=> 2
 * getObjectValue({a: {b: {c: 6}}}, 'a.b.c.toFixed(2)')        //=> '6.00'
 */
export const getObjectValue = (obj: object, path: (string | Array<string>)) => {
  path = typeof path == 'string' ? path.split('.') : [].concat(path);
  const len = path.length;
  for (let i = 0; i < len; ++i) {
    // test for allowed functions
    if (REGEX_IS_FORMULA.test(path[i])){
      const regexResult = REGEX_FORMULA_PARAMS_GROUPS.exec(path[i]);
      const functionParts = (regexResult || {}).groups;
      if (functionParts && functionParts.name && inflationWhitelist[functionParts.name]){
        const params = functionParts.params.split(',').map(s => String(s));
        obj = inflationWhitelist[functionParts.name](obj, ...params);
      }
    } else if (typeof obj === 'object') {
      obj = obj[path[i]];
    } else {
      return undefined;
    }
  }
  return obj;
};