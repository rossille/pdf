import { css } from '@emotion/react'
import type { PDFDocument } from 'pdf-lib'
import { memo } from 'react'
import { newId } from '../lib/id'
import { gap } from '../lib/spaces'
import { DocumentCard } from './document-card'

type DocumentsListProps = {
  documents: PDFDocument[]
  className?: string
  onDocumentRemoved: (document: PDFDocument) => void
}

const idsMap = new Map<PDFDocument, number>()
function getDocumentId(pdfDocument: PDFDocument): number {
  let id = idsMap.get(pdfDocument)
  if(!id) {
    id = newId()
    idsMap.set(pdfDocument, id)
  }
  return id
}


export const DocumentsList = memo<DocumentsListProps>(function DocumentsList({ documents, className, onDocumentRemoved }) {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        gap: ${gap}px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
      `}
      className={className}
    >
      {documents.map((pdfDocument) => (
        <div
          key={getDocumentId(pdfDocument)}
          css={css`
            position: relative;
            .action-bar {
              display: none;
            }
            :hover {
              .action-bar {
                display: block;
              }
            }
          `}
        >
          <DocumentCard pdfDocument={pdfDocument} scale={1} />
        </div>
      ))}
    </div>
  )
})
