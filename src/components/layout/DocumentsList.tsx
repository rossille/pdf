import { memo, useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import type { PDFDocument } from 'pdf-lib';
import { getDocumentId } from '../../hooks/usePdfDocuments';
import { DocumentCard } from '../cards/DocumentCard';
import { DocumentPlaceholder } from '../cards/DocumentPlaceholder';
import { DocumentsListContainer, DocumentItemWrapper } from '../../styles/common';

interface DocumentsListProps {
  documents: PDFDocument[];
  className?: string;
  onDocumentRemoved: (document: PDFDocument) => void;
  onReorder: (documents: PDFDocument[]) => void;
  onAddDocument: () => void;
  selectedDocumentIndex: number | null;
  onDocumentSelect: Dispatch<SetStateAction<number | null>>;
}

/**
 * List of PDF documents with drag and drop reordering
 */
export const DocumentsList = memo<DocumentsListProps>(function DocumentsList({
  documents,
  className,
  onReorder,
  onAddDocument,
  onDocumentRemoved,
  selectedDocumentIndex,
  onDocumentSelect
}) {
  const [firstDocumentDimensions, setFirstDocumentDimensions] = useState<{ width: number, height: number } | undefined>(undefined);

  const moveDocument = useCallback((dragIndex: number, hoverIndex: number) => {
    // Hide navigation buttons when documents are reordered
    onDocumentSelect(null);

    onReorder(
      documents.map((_, idx, array) => {
        if (idx === hoverIndex) return array[dragIndex];
        if (idx === dragIndex) return array[hoverIndex];
        return array[idx];
      })
    );
  }, [documents, onReorder, onDocumentSelect]);

  const handleFirstDocumentSized = useCallback((dimensions: { width: number, height: number }) => {
    setFirstDocumentDimensions(dimensions);
  }, []);

  const handleDocumentSelect = useCallback((index: number) => {
    onDocumentSelect(prevIndex => prevIndex === index ? null : index);
  }, [onDocumentSelect]);
  
  const handleSplitDocument = useCallback((document: PDFDocument, singlePageDocuments: PDFDocument[]) => {
    // Remove the original multi-page document
    const currentIndex = documents.indexOf(document);
    const newDocuments = [...documents];
    
    // Replace the multi-page document with single-page documents
    newDocuments.splice(currentIndex, 1, ...singlePageDocuments);
    
    // Update the document list
    onReorder(newDocuments);
    
    // Deselect any selected document
    onDocumentSelect(null);
  }, [documents, onReorder, onDocumentSelect]);

  return (
    <DocumentsListContainer className={className}>
      {documents.map((pdfDocument, index) => (
        <DocumentItemWrapper key={getDocumentId(pdfDocument)}>
          <DocumentCard
            pdfDocument={pdfDocument}
            scale={1}
            index={index}
            totalCount={documents.length}
            moveDocument={moveDocument}
            onRemove={onDocumentRemoved}
            onSplit={handleSplitDocument}
            onSized={index === 0 ? handleFirstDocumentSized : undefined}
            isSelected={selectedDocumentIndex === index}
            onSelect={() => handleDocumentSelect(index)}
          />
        </DocumentItemWrapper>
      ))}
      
      {firstDocumentDimensions && (
        <DocumentPlaceholder 
          onClick={onAddDocument} 
          dimensions={firstDocumentDimensions} 
        />
      )}
    </DocumentsListContainer>
  );
});