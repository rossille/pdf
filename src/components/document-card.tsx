import { css } from '@emotion/react'
import { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useMemo, useState } from 'react'
import { Page } from '../lib/page'
import { PageCard } from './page-card'

type DocumentCardProps = {
  pdfDocument: PDFDocument
  scale: number
}
export const DocumentCard = memo<DocumentCardProps>(function DocumentCard({ pdfDocument, scale }) {
  const [dimensions, setDimensions] = useState<{width: number, height: number}|undefined>(undefined)
  const handleResized = useCallback((size:{width:number, height:number}) => {
    setDimensions(size)
  }, [])
  const {page, depth} = useMemo(() => {
    const page = new Page(pdfDocument, 0)
    const depth = pdfDocument.getPageCount()
    return {page, depth}
  }, [pdfDocument])
  return <div css={css`
    position: relative;
  `}>
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
