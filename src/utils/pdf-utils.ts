import { PDFDocument } from 'pdf-lib';

/**
 * Generates a merged PDF from multiple documents
 * @param pdfDocuments The PDF documents to merge
 * @returns Binary data of the merged PDF
 */
export async function generateMergedPdf(pdfDocuments: PDFDocument[]): Promise<Uint8Array> {
  const newDocument = await PDFDocument.create();
  
  for (const pdfDocument of pdfDocuments) {
    const copiedPages = await newDocument.copyPages(
      pdfDocument, 
      Array.from({ length: pdfDocument.getPageCount() }, (_, i) => i)
    );
    copiedPages.forEach((copiedPage) => newDocument.addPage(copiedPage));
  }
  
  const pdfBytes = await newDocument.save();
  return new Uint8Array(pdfBytes);
}

/**
 * Splits a PDF document into individual single-page documents
 * @param pdfDocument The PDF document to split
 * @returns Array of single-page PDF documents
 */
export async function splitPdfIntoPages(pdfDocument: PDFDocument): Promise<PDFDocument[]> {
  const pageCount = pdfDocument.getPageCount();
  const singlePageDocuments: PDFDocument[] = [];
  
  for (let i = 0; i < pageCount; i++) {
    const newDocument = await PDFDocument.create();
    const [copiedPage] = await newDocument.copyPages(pdfDocument, [i]);
    newDocument.addPage(copiedPage);
    singlePageDocuments.push(newDocument);
  }
  
  return singlePageDocuments;
}

/**
 * Initiates download of a PDF file
 * @param pdfBytes Binary data of the PDF
 * @param fileName The name for the downloaded file
 */
export function downloadPdf(pdfBytes: Uint8Array, fileName: string): void {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}