import { Typography } from '@mui/material';
import { memo } from 'react';
import { EmptyStateContainer, EmptyStateTitle } from '../../styles/common';
import { DocumentPlaceholder } from '../cards/DocumentPlaceholder';

interface EmptyStateProps {
  onAddDocuments: () => void;
}

/**
 * Empty state shown when no documents are loaded
 */
export const EmptyState = memo<EmptyStateProps>(function EmptyState({ onAddDocuments }) {
  return (
    <EmptyStateContainer>
      <Typography variant="h2" component="h1">
        Merge PDF
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        css={EmptyStateTitle}
      >
        Combine multiple PDFs into one document, easily and securely
      </Typography>

      <DocumentPlaceholder onClick={onAddDocuments} dimensions={{ width: 200, height: 300 }} />
    </EmptyStateContainer>
  );
});