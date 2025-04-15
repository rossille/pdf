import { css } from '@emotion/react'
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
  moveDocument: (dragIndex: number, hoverIndex: number) => void
}

export const DocumentCard = memo<DocumentCardProps>(function DocumentCard({
  pdfDocument,
  scale,
  index,
  moveDocument
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<{width: number, height: number}|undefined>(undefined)
  const handleResized = useCallback((size:{width:number, height:number}) => {
    setDimensions(size)
  }, [])
  const {page, depth} = useMemo(() => {
    const page = new Page(pdfDocument, 0)
    const depth = pdfDocument.getPageCount()
    return {page, depth}
  }, [pdfDocument])

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
        cursor: move;
      `}
      data-handler-id={handlerId}
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
