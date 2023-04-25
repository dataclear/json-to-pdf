
import * as fs from 'fs';
import PdfPrinter from 'pdfmake';
import { TFontDictionary } from 'pdfmake/interfaces';

import { functionifyHeaderFooter } from './helpers/functionifyHeaderFooter';
import { processDataNode } from './processDataNode';
import { defaultFonts } from './helpers/defaultFonts';

import type { ExpandableDocDefinition } from './types/interfaces';

const DEFAULT_DATE_FORMAT = 'D MMM YY';

const keyBlacklist: Array<string> = [
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  '__proto__',
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf',
];

const blacklistReviver = (_key: unknown, value: unknown) => {

  if (value && typeof value == 'object'){
    Object.keys(value).forEach(k => {
      if (keyBlacklist.includes(k)) {
        console.info('Removed blacklisted key ' + String(k));
        return null;
      }
    });
  }

  return value;

};


/**
 * Inflates a json template into a PDFMake document definition, then renders the definition to a PDF file
 * 
 * @since v0.0.1
 * @category Main
 * @param {ExpandableDocDefinition} docDefinition - The JSON string or object definition to inflate
 * @param {object} data - The data to use for inflated values
 * @returns {stream}
 */
export const renderPdfTemplate = (docDefinition: ExpandableDocDefinition | string, data?: object, fontFile?: TFontDictionary): unknown => {


  try {

    const fonts: TFontDictionary = {};

    if (defaultFonts) Object.assign(fonts, defaultFonts);
    if (fontFile) Object.assign(fonts, fontFile);

    if (docDefinition === null) return undefined;
    if (docDefinition === undefined) return undefined;

    const printer = new PdfPrinter(fonts);

    if (docDefinition && typeof docDefinition == 'object' && docDefinition.path){
      // passed document location not template, inflate
      docDefinition = fs.readFileSync(docDefinition.path, 'utf8');
    }

    let expandableDocDefinition: ExpandableDocDefinition;
    
    if (typeof docDefinition == 'string') {
      expandableDocDefinition = JSON.parse(docDefinition, blacklistReviver);
    } else {

      if (typeof structuredClone == 'function'){
        expandableDocDefinition = structuredClone(docDefinition);
      } else {
        expandableDocDefinition = JSON.parse(JSON.stringify(docDefinition));
      }

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