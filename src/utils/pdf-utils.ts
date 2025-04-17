import { PDFDocument } from 'pdf-lib';
import { assert } from './assert';

/**
 * Merges multiple PDF documents into a single PDF and initiates download
 */
export async function mergeAndDownload(pdfDocuments: PDFDocument[]): Promise<void> {
  const newDocument = await PDFDocument.create();
  
  for (const pdfDocument of pdfDocuments) {
    const copiedPages = await newDocument.copyPages(
      pdfDocument, 
      Array.from({ length: pdfDocument.getPageCount() }, (_, i) => i)
    );
    copiedPages.forEach((copiedPage) => newDocument.addPage(copiedPage));
  }
  
  const pdfBytes = await newDocument.save();
  const bytes = new Uint8Array(pdfBytes);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  const fileName = prompt('Choose a name for the merged file', 'merged.pdf');
  assert(fileName, 'fileName null despite having a default value');
  link.download = fileName;
  link.click();
}