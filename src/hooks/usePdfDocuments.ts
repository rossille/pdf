import { PDFDocument } from 'pdf-lib';
import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { newId } from '../utils/id';

const idsMap = new Map<PDFDocument, number>();

/**
 * Get a stable ID for a PDF document
 */
export function getDocumentId(pdfDocument: PDFDocument): number {
  for(const [key, value] of idsMap.entries()) {
    if (key === pdfDocument) {
      return value;
    }
  }
  const id = newId();
  idsMap.set(pdfDocument, id);
  return id;
}

/**
 * Hook for managing PDF documents
 */
export function usePdfDocuments(): {
  pdfDocuments: PDFDocument[];
  selectedDocumentIndex: number | null;
  handleDocumentAdded: (pdfDocument: PDFDocument) => void;
  handleDocumentRemoved: (pdfDocument: PDFDocument) => void;
  handleReorderDocuments: (newDocuments: PDFDocument[]) => void;
  handleDocumentSelect: (index: number) => void;
  moveDocument: (dragIndex: number, hoverIndex: number) => void;
  setSelectedDocumentIndex: Dispatch<SetStateAction<number | null>>;
} {
  const [pdfDocuments, setPdfDocuments] = useState<PDFDocument[]>([]);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number | null>(null);
  const handleDocumentAdded = useCallback((pdfDocument: PDFDocument) => {
    setPdfDocuments((pdfDocuments) => [...pdfDocuments, pdfDocument]);
    setSelectedDocumentIndex(null);
  }, []);

  const handleDocumentRemoved = useCallback((pdfDocument: PDFDocument) => {
    setPdfDocuments((pdfDocuments) => pdfDocuments.filter((doc) => doc !== pdfDocument));
  }, []);

  const handleReorderDocuments = useCallback((newDocuments: PDFDocument[]) => {
    setPdfDocuments(newDocuments);
  }, []);

  const handleDocumentSelect = useCallback((index: number) => {
    setSelectedDocumentIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  // Function to move a document from one position to another
  const moveDocument = useCallback((dragIndex: number, hoverIndex: number) => {
    // Hide navigation buttons when documents are reordered
    setSelectedDocumentIndex(null);

    setPdfDocuments(currentDocs => currentDocs.map((_, idx, array) => {
      if (idx === hoverIndex) return array[dragIndex];
      if (idx === dragIndex) return array[hoverIndex];
      return array[idx];
    }));
  }, []);

  return {
    pdfDocuments,
    selectedDocumentIndex,
    handleDocumentAdded,
    handleDocumentRemoved,
    handleReorderDocuments,
    handleDocumentSelect,
    moveDocument,
    setSelectedDocumentIndex,
  };
}