import { css } from '@emotion/react'
import { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useState } from 'react'
import { assert } from '../lib/assert'
import { Page } from '../lib/types'
import { FileInputForm } from './file-input-form'
import { PageList } from './page-list'
import { RoundButton } from './round-button'

export const App = memo(function App() {
  const [pages, setPages] = useState<Page[]>([])

  const handleDocumentAdded = useCallback((pdfDocument: PDFDocument) => {
    setPages((pages) => addPdfDocumentDocument(pages, pdfDocument))
  }, [])

  const handlePagesRemoved = useCallback((pageToRemove: Page[]) => {
    setPages((pages) => pages.filter((page) => !pageToRemove.includes(page)))
  }, [])

  const downloadMerged = useCallback(() => {
    mergeAndDownload(pages).catch((err) => {
      console.error(err)
      alert('Sorry, an error occured, please check logs')
    })
  }, [pages])

  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 20px;
        scrollbar-width: thin;
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          background-color: lightgray;
        }
        ::-webkit-scrollbar-thumb {
          background-color: gray;
        }
      `}
    >
      <PageList pages={pages} onPagesRemoved={handlePagesRemoved} />
      <div
        css={css`
          position: fixed;
          bottom: 20px;
          right: 25px;
          display: flex;
          gap: 10px;
        `}
      >
        <FileInputForm onDocumentAdded={handleDocumentAdded} />
        <RoundButton disabled={pages.length === 0} onClick={downloadMerged}>
          ⬇
        </RoundButton>
      </div>
    </div>
  )
})

function addPdfDocumentDocument(pages: Page[], pdfDocument: PDFDocument) {
  return [...pages, ...pdfDocument.getPages().map((_pdfPage, index) => new Page(pdfDocument, index))]
}

async function mergeAndDownload(pages: Page[]): Promise<void> {
  const newDocument = await PDFDocument.create()
  for (const page of pages) {
    const [copiedPage] = await newDocument.copyPages(page.srcDocument, [page.pageIndex])
    newDocument.addPage(copiedPage)
  }
  const pdfBytes = await newDocument.save()
  const bytes = new Uint8Array(pdfBytes)
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  const fileName = prompt('Choose a name for the merged file', 'merged.pdf')
  assert(fileName, 'fileName null despite having a default value')
  link.download = fileName
  link.click()
}
