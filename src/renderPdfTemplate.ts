
import * as fs from 'fs';
import PdfPrinter from 'pdfmake';

import { functionifyHeaderFooter } from './helpers/functionifyHeaderFooter';
import { processDataNode } from './processDataNode';
import { defaultFonts } from './helpers/defaultFonts';

import type { ExpandableDocDefinition } from './types/interfaces';

const DEFAULT_DATE_FORMAT = 'D MMM YY';

/**
 * Inflates a json template into a PDFMake document definition, then renders the definition to a PDF file
 * 
 * @since v0.0.1
 * @category Main
 * @param {ExpandableDocDefinition} docDefinition - The JSON string or object definition to inflate
 * @param {object} data - The data to use for inflated values
 * @returns {stream}
 */
export const renderPdfTemplate = async (docDefinition: ExpandableDocDefinition | string, data: object): Promise<unknown> => {


  try {

    if (docDefinition === null) return undefined;
    if (docDefinition === undefined) return undefined;

    const printer = new PdfPrinter(defaultFonts);

    if (docDefinition && typeof docDefinition == 'object' && docDefinition.path){
      // passed document location not template, inflate
      docDefinition = fs.readFileSync(docDefinition.path, 'utf8');
    }

    let expandableDocDefinition: ExpandableDocDefinition;
    
    if (typeof docDefinition == 'string') {
      expandableDocDefinition = JSON.parse(docDefinition);
    } else {
      expandableDocDefinition = structuredClone(docDefinition);

    }
    
    // convert header footer to functions
    if (expandableDocDefinition.header) expandableDocDefinition.header = functionifyHeaderFooter(expandableDocDefinition.header);
    if (expandableDocDefinition.footer) expandableDocDefinition.footer = functionifyHeaderFooter(expandableDocDefinition.footer);
    
    const settings = {
      dateFormat: expandableDocDefinition.dateFormat || DEFAULT_DATE_FORMAT
    };
    delete expandableDocDefinition.dateFormat;
    
    
    // Disable typescript no-explicit-any to prevent having to type processDataNode 
    // using PDFmake types as it's a recursive function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docDefinitionObject: any = processDataNode(expandableDocDefinition, data, settings);
  
    if (!docDefinitionObject.defaultStyle) docDefinitionObject.defaultStyle = {};
    if (!docDefinitionObject.defaultStyle.font) docDefinitionObject.defaultStyle.font = Object.keys(defaultFonts)[0];
  
  
    const pdfDocumentBuffer = printer.createPdfKitDocument(docDefinitionObject);
  
    return pdfDocumentBuffer;

  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }

};