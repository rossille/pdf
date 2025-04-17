import { Button, Paper, Typography } from '@mui/material';
import { memo } from 'react';
import { EmptyStateContainer } from '../../styles/common';

interface EmptyStateProps {
  onAddDocuments: () => void;
}

/**
 * Empty state shown when no documents are loaded
 */
export const EmptyState = memo<EmptyStateProps>(function EmptyState({ onAddDocuments }) {
  return (
    <EmptyStateContainer>
      <Typography
        variant="h2"
        component="h1"
        sx={{
          background: 'linear-gradient(45deg, #4361EE 30%, #F72585 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          marginBottom: 1,
          textAlign: 'center'
        }}
      >
        Merge PDF Files
      </Typography>

      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: '600px', textAlign: 'center' }}
      >
        Combine multiple PDFs into one document,<br/>easily and securely
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          maxWidth: '500px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
          Get Started
        </Typography>

        <Typography variant="body1" paragraph>
          Add your PDF files to combine them into a single document.
          Your files stay private and never leave your device.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={onAddDocuments}
          sx={{
            mt: 2,
            py: 1.5,
            px: 4,
            fontSize: '1.1rem'
          }}
        >
          + Add PDF Files
        </Button>
      </Paper>
    </EmptyStateContainer>
  );
});