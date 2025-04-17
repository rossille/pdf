import { memo } from 'react';
import { StyledPlaceholderButton } from '../../styles/common';

interface DocumentPlaceholderProps {
  onClick: () => void;
  dimensions: { width: number; height: number };
}

/**
 * Placeholder button for adding new documents
 */
export const DocumentPlaceholder = memo<DocumentPlaceholderProps>(
  function DocumentPlaceholder({ onClick, dimensions }) {
    const { width, height } = dimensions;

    return (
      <StyledPlaceholderButton
        variant="outlined"
        sx={{ width: `${width}px`, height: `${height}px` }}
        onClick={onClick}
      >
        + Add PDF
      </StyledPlaceholderButton>
    );
  }
);