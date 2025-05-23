import { css } from '@emotion/react'
import { Button } from '@mui/material'
import type { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useState, type Dispatch, type SetStateAction } from 'react'
import { newId } from '../lib/id'
import { gap } from '../lib/spaces'
import { DocumentCard } from './document-card'

type DocumentsListProps = {
  documents: PDFDocument[]
  className?: string
  onDocumentRemoved: (document: PDFDocument) => void
  onReorder: (documents: PDFDocument[]) => void
  onAddDocument: () => void
  selectedDocumentIndex: number | null
  onDocumentSelect: Dispatch<SetStateAction<number | null>>
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


export const DocumentPlaceholder = memo<{ onClick: () => void, dimensions: { width: number, height: number } }>(function DocumentPlaceholder({ onClick, dimensions }) {
  const { width, height } = dimensions


  return (
    <Button
      variant="outlined"
      css={css`
        width: ${width}px;
        height: ${height}px;
        border: 2px dashed #aaa;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
      onClick={onClick}
    >
        + Add PDF
    </Button>
  )
})

export const DocumentsList = memo<DocumentsListProps>(function DocumentsList({
  documents,
  className,
  onReorder,
  onAddDocument,
  onDocumentRemoved,
  selectedDocumentIndex,
  onDocumentSelect
}) {
  const [firstDocumentDimensions, setFirstDocumentDimensions] = useState<{ width: number, height: number } | undefined>(undefined)

  const moveDocument = useCallback((dragIndex: number, hoverIndex: number) => {
    // Hide navigation buttons when documents are reordered
    onDocumentSelect(null);

    onReorder(
      documents.map((_, idx, array) => {
        if (idx === hoverIndex) return array[dragIndex]
        if (idx === dragIndex) return array[hoverIndex]
        return array[idx]
      })
    )
  }, [documents, onReorder, onDocumentSelect])

  const handleFirstDocumentSized = useCallback((dimensions: { width: number, height: number }) => {
    setFirstDocumentDimensions(dimensions)
  }, [])

  const handleDocumentSelect = useCallback((index: number) => {
    onDocumentSelect(prevIndex => prevIndex === index ? null : index)
  }, [onDocumentSelect])

  return (
    <div
      css={css`
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
            totalCount={documents.length}
            moveDocument={moveDocument}
            onRemove={onDocumentRemoved}
            onSized={index === 0 ? handleFirstDocumentSized : undefined}
            isSelected={selectedDocumentIndex === index}
            onSelect={() => handleDocumentSelect(index)}
          />
        </div>
      ))}
      {firstDocumentDimensions
       ? <DocumentPlaceholder onClick={onAddDocument} dimensions={firstDocumentDimensions} /> : null}
    </div>
  )
})
