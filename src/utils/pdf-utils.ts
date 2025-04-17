import { PDFDocument } from 'pdf-lib';

/**
 * Generates and initiates download of a merged PDF
 * @param pdfDocuments The PDF documents to merge
 * @param fileName The name for the downloaded file
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