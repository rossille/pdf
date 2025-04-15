import { css } from '@emotion/react'
import { Button, Typography } from '@mui/material'
import { memo } from 'react'

type EmptyStateProps = {
  onAddDocuments: () => void
}

export const EmptyState = memo<EmptyStateProps>(function EmptyState({ onAddDocuments }) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
      `}
    >
      <Typography variant="h2" component="h1">
        Merge PDF
      </Typography>
      
      <Typography 
        variant="subtitle1" 
        color="text.secondary"
        css={css`
          margin-top: 24px;
        `}
      >
        Combine multiple PDFs into one document, easily and securely
      </Typography>
      
      <div
        css={css`
          width: 200px;
          height: 200px;
          background-color: #f5f5f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 32px 0;
        `}
      >
        <Typography variant="body2" color="text.secondary">
          [Illustration Placeholder]
        </Typography>
      </div>
      
      <Button
        variant="contained"
        size="large"
        onClick={onAddDocuments}
        css={css`
          border-radius: 20px;
          padding: 12px 24px;
          font-size: 1.1rem;
        `}
      >
        Add Documents
      </Button>
    </div>
  )
})