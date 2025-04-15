import { css } from '@emotion/react'
import type { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useState } from 'react'
import { newId } from '../lib/id'
import { gap } from '../lib/spaces'
import { DocumentCard } from './document-card'
import { RoundButton } from './round-button'

type DocumentsListProps = {
  documents: PDFDocument[]
  className?: string
  onDocumentRemoved: (document: PDFDocument) => void
  onReorder: (documents: PDFDocument[]) => void
  onAddDocument: () => void
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


const DocumentPlaceholder = memo<{ onClick: () => void, dimensions: { width: number, height: number } }>(function DocumentPlaceholder({ onClick, dimensions }) {
  const { width, height } = dimensions


  return (
    <div
      css={css`
        width: ${width}px;
        height: ${height}px;
        border: 2px dashed #aaa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f8f8;
      `}
      onClick={onClick}
    >
      <RoundButton onClick={onClick}>
        + Add document
      </RoundButton>
    </div>
  )
})

export const DocumentsList = memo<DocumentsListProps>(function DocumentsList({
  documents,
  className,
  onReorder,
  onAddDocument
}) {
  const [firstDocumentDimensions, setFirstDocumentDimensions] = useState<{ width: number, height: number } | undefined>(undefined)
  const moveDocument = useCallback((dragIndex: number, hoverIndex: number) => {
    onReorder(
      documents.map((_, idx, array) => {
        if (idx === hoverIndex) return array[dragIndex]
        if (idx === dragIndex) return array[hoverIndex]
        return array[idx]
      })
    )
  }, [documents, onReorder])

  const handleFirstDocumentSized = useCallback((dimensions: { width: number, height: number }) => {
    setFirstDocumentDimensions(dimensions)
  }, [])

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
            onSized={index === 0 ? handleFirstDocumentSized : undefined}
          />
        </div>
      ))}
      {firstDocumentDimensions
       ? <DocumentPlaceholder onClick={onAddDocument} dimensions={firstDocumentDimensions} /> : null}
    </div>
  )
})
