import { css } from '@emotion/react'
import { Button } from '@mui/material'
import { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Page } from '../lib/page'
import { PageCard } from './page-card'

const DOCUMENT_CARD_TYPE = 'document-card'

interface DragItem {
  index: number
  id: string
  type: string
}

type DocumentCardProps = {
  pdfDocument: PDFDocument
  scale: number
  index: number
  totalCount: number
  moveDocument: (dragIndex: number, hoverIndex: number) => void
  onRemove?: (document: PDFDocument) => void
  onSized: undefined | ((size: { width: number, height: number }) => void)
  isSelected?: boolean
  onSelect?: () => void
}

export const DocumentCard = memo<DocumentCardProps>(function DocumentCard({
  pdfDocument,
  scale,
  index,
  totalCount,
  moveDocument,
  onRemove,
  onSized,
  isSelected = false,
  onSelect
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<{width: number, height: number}|undefined>(undefined)

  const handleResized = useCallback((size:{width:number, height:number}) => {
    setDimensions(size)
    onSized?.(size)
  }, [onSized])

  const {page, depth} = useMemo(() => {
    const page = new Page(pdfDocument, 0)
    const depth = pdfDocument.getPageCount()
    return {page, depth}
  }, [pdfDocument])

  const handleClick = useCallback(() => {
    onSelect?.()
  }, [onSelect])

  const handleMoveLeft = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (index > 0) {
      moveDocument(index, index - 1)
    }
  }, [index, moveDocument])

  const handleMoveRight = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // Only move right if not the last document
    if (index < totalCount - 1) {
      moveDocument(index, index + 1)
    }
  }, [index, totalCount, moveDocument])
  
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.(pdfDocument)
  }, [pdfDocument, onRemove])

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: DOCUMENT_CARD_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get horizontal center
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return

      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging down, only move when the cursor is below 50%
      // When dragging up, only move when the cursor is above 50%

      // Dragging to right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }

      // Dragging to left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }

      // Time to actually perform the action
      moveDocument(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: DOCUMENT_CARD_TYPE,
    item: () => {
      // When drag starts, hide this document's buttons by deselecting
      if (isSelected && onSelect) {
        onSelect();
      }
      return { index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1
  drag(drop(ref))

  return (
    <div
      ref={ref}
      css={css`
        position: relative;
        opacity: ${opacity};
        cursor: pointer;
      `}
      data-handler-id={handlerId}
      onClick={handleClick}
    >
      {
        dimensions ? <BackPages depth={depth} dimensions={dimensions} /> : null
      }
      <PageCard css={
        css`
          position: relative;
          top: -${depth * 2}px;
          left: -${depth * 2}px;
        `
      } page={page} scale={1} onResized={handleResized} />

      {isSelected && dimensions && (
        <div
          css={css`
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            padding: 0 5px;
            z-index: 10;
          `}
          onClick={e => e.stopPropagation()}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={index === 0}
            onClick={handleMoveLeft}
            css={css`
              min-width: 30px !important;
              width: 60px;
              height: 60px;
              padding: 0 !important;
              border-radius: 50%;
              opacity: 0.9;
              box-shadow: 0 2px 4px rgba(0,0,0,0.4);
              font-size: 32px;
            `}
          >
            🡄
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleRemove}
            css={css`
              min-width: 30px !important;
              width: 60px;
              height: 60px;
              padding: 0 !important;
              border-radius: 50%;
              opacity: 0.9;
              box-shadow: 0 2px 4px rgba(0,0,0,0.4);
              font-size: 32px;
            `}
          >
            🗙
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={index >= totalCount - 1}
            onClick={handleMoveRight}
            css={css`
              min-width: 30px !important;
              width: 60px;
              height: 60px;
              padding: 0 !important;
              border-radius: 50%;
              opacity: 0.9;
              box-shadow: 0 2px 4px rgba(0,0,0,0.4);
              font-size: 32px;
            `}
          >
            🡆
          </Button>
        </div>
      )}
    </div>
  )
})

const BackPages = memo<{depth: number, dimensions: {width: number, height: number}}>(function BackPages({depth, dimensions}) {
  return <div css={css`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `}>
    {Array.from({length: depth}).map((_, index) => (
      <div key={index} css={css`
        background-color: white;
        position: absolute;
        border: 1px solid black;
        top: -${index * 2}px;
        left: -${index * 2}px;
        width: ${dimensions.width}px;
        height: ${dimensions.height}px;
      `} />
    ))}
  </div>
})
