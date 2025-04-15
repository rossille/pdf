import { css } from '@emotion/react'
import { Typography } from '@mui/material'
import { memo } from 'react'
import { DocumentPlaceholder } from './documents-list'

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
          margin-bottom: 24px;
        `}
      >
        Combine multiple PDFs into one document, easily and securely
      </Typography>

      <DocumentPlaceholder onClick={onAddDocuments} dimensions={{ width: 200, height: 300 }} />
    </div>
  )
})