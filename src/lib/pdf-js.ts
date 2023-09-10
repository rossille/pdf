// eslint-disable-next-line no-restricted-imports
import * as pdfjs from 'pdfjs-dist'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker?url'

// eslint-disable-next-line no-restricted-imports
export type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

export function getPdfJs(): typeof pdfjs {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl
  return pdfjs
}
