
const fixedFormulas: object = {
  getPageXofY: function(currentPage: number, pageCount: number) {
    return currentPage.toString() + ' of ' + pageCount;
  },
  getPageX: function(currentPage: number, _pageCount: number) {
    return currentPage.toString();
  }
};

/**
 * Finds fixed formula value within object and replaces with a function that replaces the fixed value with a live function
 * 
 * @since v0.0.1
 * @category Helpers
 * @param {unknown} node - The current object node
 * @param {object} data - The data to search for replacement values
 * @param {Settings} settings - Settings to control how they are
 * @returns {unknown}
 * @example
 * processDataNode({test: '{{a}}'}, {a: 'b'}, {})    //=> {test: 'b'}
 */
export const functionifyHeaderFooter = (node: unknown): unknown => {

  if (node == null || undefined === node) return undefined;

  // check if node contains function
  const nodeString = JSON.stringify(node);
  let found = '';
  for (const k in fixedFormulas){
    if (nodeString.indexOf('{{' + k + '}}') > -1){
      found = k;
      break;
    }
  }


  // guard clause
  if (!found) return node;


  // past guard clause, we must have found a function

  function newReturnFunction(currentPage: number, pageCount: number){
    return JSON.parse(nodeString.replace('{{' + found + '}}', fixedFormulas[found](currentPage, pageCount)));
  }


  return newReturnFunction;

};