import { css } from '@emotion/react';
import { Button } from '@mui/material';
import { memo } from 'react';

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
      <Button
        variant="outlined"
        onClick={onClick}
        sx={{ 
          width: `${width}px`, 
          height: `${height}px`,
          borderRadius: '12px',
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderColor: 'primary.main',
          color: 'primary.main',
          fontSize: '1.1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          background: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            borderColor: 'secondary.main',
            color: 'secondary.main',
            background: 'rgba(255, 255, 255, 0.9)',
            transform: 'scale(1.03)',
          }
        }}
      >
        + Add PDF
      </Button>
    );
  }
);