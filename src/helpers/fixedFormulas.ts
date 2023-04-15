export const fixedFormulas = {
  getPageXofY: function(currentPage: number, pageCount: number) : string {
    if (!currentPage || !pageCount) return undefined;
    return currentPage.toString() + ' of ' + pageCount;
  },
  getPageX: function(currentPage: number, _pageCount: number) : string {
    if (!currentPage) return undefined;
    return currentPage.toString();
  }
};