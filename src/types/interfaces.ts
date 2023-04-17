import { TDocumentDefinitions } from 'pdfmake/interfaces';

export interface ExpandableDocDefinition extends TDocumentDefinitions {
  path: string,
  dateFormat: string
}

export interface Settings {
  dateFormat: string
}