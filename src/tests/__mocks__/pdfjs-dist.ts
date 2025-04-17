import { vi } from 'vitest';
import { mockPDFJs } from './pdfMocks';

export const getDocument = vi.fn().mockImplementation(mockPDFJs.getDocument);
export const GlobalWorkerOptions = mockPDFJs.GlobalWorkerOptions;

export default {
  getDocument,
  GlobalWorkerOptions
};