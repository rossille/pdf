import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateMergedPdf, splitPdfIntoPages } from './pdf-utils';
import { PDFDocument } from 'pdf-lib';

// Mock PDFDocument
vi.mock('pdf-lib', () => {
  return {
    PDFDocument: {
      create: vi.fn().mockImplementation(() => ({
        copyPages: vi.fn().mockImplementation(() => Promise.resolve([{}, {}])),
        addPage: vi.fn(),
        getPageCount: vi.fn().mockReturnValue(2),
        save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
      })),
    }
  };
});

describe('PDF Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMergedPdf', () => {
    it('should create a new document and copy pages from all source documents', async () => {
      // Create mock documents
      const doc1 = await PDFDocument.create();
      const doc2 = await PDFDocument.create();
      
      const result = await generateMergedPdf([doc1, doc2]);
      
      // Should create a new document
      expect(PDFDocument.create).toHaveBeenCalledTimes(3); // 2 for test setup + 1 for the function
      
      // Should copy pages from both documents
      expect(doc1.copyPages).toHaveBeenCalledTimes(1);
      expect(doc2.copyPages).toHaveBeenCalledTimes(1);
      
      // Should return a Uint8Array
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe('splitPdfIntoPages', () => {
    it('should split a multi-page document into individual single-page documents', async () => {
      const mockDocument = await PDFDocument.create();
      
      const result = await splitPdfIntoPages(mockDocument);
      
      // Should create a new document for each page
      expect(PDFDocument.create).toHaveBeenCalledTimes(3); // 1 for mock + 2 for the pages
      
      // Should create an array of documents
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2); // Based on our mock returning 2 pages
      
      // Each document should have copied and added a single page
      expect(mockDocument.copyPages).toHaveBeenCalledTimes(2);
      expect(result[0].addPage).toHaveBeenCalledTimes(1);
      expect(result[1].addPage).toHaveBeenCalledTimes(1);
    });
  });
});