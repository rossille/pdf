import { css } from '@emotion/react'
import type { PDFDocument } from 'pdf-lib'
import { memo, useCallback } from 'react'
import { newId } from '../lib/id'
import { gap } from '../lib/spaces'
import { DocumentCard } from './document-card'

type DocumentsListProps = {
  documents: PDFDocument[]
  className?: string
  onDocumentRemoved: (document: PDFDocument) => void
  onReorder: (documents: PDFDocument[]) => void
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


export const DocumentsList = memo<DocumentsListProps>(function DocumentsList({ 
  documents, 
  className, 
  onDocumentRemoved,
  onReorder 
}) {
  const moveDocument = useCallback((dragIndex: number, hoverIndex: number) => {
    onReorder(
      documents.map((_, idx, array) => {
        if (idx === hoverIndex) return array[dragIndex]
        if (idx === dragIndex) return array[hoverIndex]
        return array[idx]
      })
    )
  }, [documents, onReorder])

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
      {documents.map((pdfDocument, index) => (
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
          <DocumentCard 
            pdfDocument={pdfDocument} 
            scale={1} 
            index={index}
            moveDocument={moveDocument} 
          />
        </div>
      ))}
    </div>
  )
})
