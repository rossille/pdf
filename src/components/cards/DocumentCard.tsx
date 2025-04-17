import { css } from '@emotion/react';
import { ArrowBack, ArrowForward, Clear, CallSplit } from '@mui/icons-material';
import { PDFDocument } from 'pdf-lib';
import { memo, useCallback, useMemo, useState } from 'react';
import { useDragDrop } from '../../hooks/useDragDrop';
import { useStackConfiguration } from '../../hooks/useStackConfiguration';
import { ActionButtonsContainer } from '../../styles/common';
import { Page } from '../../utils/page';
import { ActionButton } from '../buttons/ActionButton';
import { BackPages } from './BackPages';
import { PageCard } from './PageCard';

interface DocumentCardProps {
  pdfDocument: PDFDocument;
  scale: number;
  index: number;
  totalCount: number;
  moveDocument: (dragIndex: number, hoverIndex: number) => void;
  onRemove?: (document: PDFDocument) => void;
  onSplit?: (document: PDFDocument, singlePageDocuments: PDFDocument[]) => void;
  onSized: undefined | ((size: { width: number; height: number }) => void);
  isSelected?: boolean;
  onSelect?: () => void;
}

/**
 * Card representing a PDF document
 */
export const DocumentCard = memo<DocumentCardProps>(function DocumentCard({
  pdfDocument,
  scale,
  index,
  totalCount,
  moveDocument,
  onRemove,
  onSplit,
  onSized,
  isSelected = false,
  onSelect
}) {
  const [dimensions, setDimensions] = useState<{width: number, height: number}|undefined>(undefined);

  const handleResized = useCallback((size:{width:number, height:number}) => {
    setDimensions(size);
    onSized?.(size);
  }, [onSized]);

  const {page, depth} = useMemo(() => {
    const page = new Page(pdfDocument, 0);
    const depth = pdfDocument.getPageCount();
    return {page, depth};
  }, [pdfDocument]);

  const handleClick = useCallback(() => {
    onSelect?.();
  }, [onSelect]);

  const handleMoveLeft = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      moveDocument(index, index - 1);
    }
  }, [index, moveDocument]);

  const handleMoveRight = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Only move right if not the last document
    if (index < totalCount - 1) {
      moveDocument(index, index + 1);
    }
  }, [index, totalCount, moveDocument]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(pdfDocument);
  }, [pdfDocument, onRemove]);

  const handleSplit = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (depth > 1 && onSplit) {
      // Import here to avoid circular dependencies
      const { splitPdfIntoPages } = await import('../../utils/pdf-utils');
      const singlePageDocuments = await splitPdfIntoPages(pdfDocument);
      onSplit(pdfDocument, singlePageDocuments);
    }
  }, [pdfDocument, depth, onSplit]);

  const { ref, handlerId, isDragging } = useDragDrop(index, moveDocument, isSelected, onSelect);

  const opacity = isDragging ? 0.4 : 1;

  const { firstPageTopology, backPagesTopologies } = useStackConfiguration(depth);

  return (
    <div
      ref={ref}
      css={css`
        position: relative;
        opacity: ${opacity};
        cursor: pointer;
      `}
      data-handler-id={handlerId}
      onClick={handleClick}
    >
      {dimensions && <BackPages backPages={backPagesTopologies} dimensions={dimensions} />}

      <PageCard
        css={css`
          position: relative;
          top: ${firstPageTopology.offsetY}px;
          left: ${firstPageTopology.offsetX}px;
        `}
        page={page}
        scale={1}
        onResized={handleResized}
      />

      {isSelected && dimensions && (
        <ActionButtonsContainer onClick={e => e.stopPropagation()}>
          <ActionButton
            disabled={index === 0}
            onClick={handleMoveLeft}
          >
            <ArrowBack fontSize="small" />
          </ActionButton>

          <ActionButton
            color="error"
            onClick={handleRemove}
          >
            <Clear fontSize="small" />
          </ActionButton>

          {depth > 1 && (
            <ActionButton
              color="secondary"
              onClick={handleSplit}
              title="Split into individual pages"
            >
              <CallSplit fontSize="small" />
            </ActionButton>
          )}

          <ActionButton
            disabled={index >= totalCount - 1}
            onClick={handleMoveRight}
          >
            <ArrowForward fontSize="small" />
          </ActionButton>
        </ActionButtonsContainer>
      )}
    </div>
  );
});