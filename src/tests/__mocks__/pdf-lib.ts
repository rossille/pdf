import { vi } from 'vitest';
import { MockPDFDocument } from './pdfMocks';

// Create a mock implementation for PDFDocument
export const PDFDocument = {
  create: vi.fn().mockResolvedValue(new MockPDFDocument())
};

// Export all props
export default {
  PDFDocument
};