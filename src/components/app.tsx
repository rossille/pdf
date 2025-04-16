import { css } from '@emotion/react'
import { Button, Typography } from '@mui/material'
import { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { assert } from '../lib/assert'
import { DocumentsList } from './documents-list'
import { EmptyState } from './empty-state'
import { FileInputForm } from './file-input-form'

export const App = memo(function App() {
  const [pdfDocuments, setPdfDocuments] = useState<PDFDocument[]>([])

  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number | null>(null)
  
  const handleDocumentAdded = useCallback((pdfDocument: PDFDocument) => {
    setPdfDocuments((pdfDocuments) => [...pdfDocuments, pdfDocument])
    setSelectedDocumentIndex(null)
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

  const handleAddDocumentsClick = useCallback(() => {
    const input = document.getElementById('file-upload-button') as HTMLInputElement;
    input?.click();
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 0;
          padding: 0;
          background: linear-gradient(65deg, #ffffff 0%, #eaf8ff 100%);
          font-family: 'Inter', sans-serif;
        `}
      >

        {pdfDocuments.length === 0 ? (
          <EmptyState onAddDocuments={handleAddDocumentsClick} />
        ) : (
          <DocumentsList
            documents={pdfDocuments}
            onDocumentRemoved={handleDocumentRemoved}
            onReorder={setPdfDocuments}
            onAddDocument={handleAddDocumentsClick}
            selectedDocumentIndex={selectedDocumentIndex}
            onDocumentSelect={setSelectedDocumentIndex}
          />
        )}

        {

        pdfDocuments.length > 0 ?<div
          css={css`
            display: flex;
            justify-content: center;
          `}
        >
          <Button variant='contained' disabled={pdfDocuments.length === 0} onClick={downloadMerged}>
            <Typography variant='h6'>💾 Merge & Download</Typography>
          </Button>
        </div> : null
        }


        <div style={{ display: 'none' }}>
          <FileInputForm onDocumentAdded={handleDocumentAdded} />
        </div>
      </div>
    </DndProvider>
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
