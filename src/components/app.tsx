import { css } from '@emotion/react'
import { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useState } from 'react'
import { assert } from '../lib/assert'
import { DocumentsList } from './documents-list'
import { FileInputForm } from './file-input-form'
import { RoundButton } from './round-button'

export const App = memo(function App() {
  const [pdfDocuments, setPdfDocuments] = useState<PDFDocument[]>([])

  const handleDocumentAdded = useCallback((pdfDocument: PDFDocument) => {
    setPdfDocuments((pdfDocuments) => [...pdfDocuments, pdfDocument])
  }, [])

  const handleDocumentRemoved = useCallback((pdfDocument: PDFDocument) => {
    setPdfDocuments((pdfDocuments) => pdfDocuments.filter((doc) => doc !== pdfDocument))
  }, [])

  const downloadMerged = useCallback(() => {
    mergeAndDownload(pdfDocuments).catch((err) => {
      console.error(err)
      alert('Sorry, an error occured, please check logs')
    })
  }, [pdfDocuments])

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
      <DocumentsList documents={pdfDocuments} onDocumentRemoved={handleDocumentRemoved} />
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
        <RoundButton disabled={pdfDocuments.length === 0} onClick={downloadMerged}>
          ⬇
        </RoundButton>
      </div>
    </div>
  )
})


async function mergeAndDownload(pdfDocuments: PDFDocument[]): Promise<void> {
  const newDocument = await PDFDocument.create()
  for (const pdfDocument of pdfDocuments) {
    const copiedPages = await newDocument.copyPages(pdfDocument, Array.from({ length: pdfDocument.getPageCount() }, (_, i) => i))
    copiedPages.forEach((copiedPage) => newDocument.addPage(copiedPage))
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
