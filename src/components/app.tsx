import { css } from '@emotion/react'
import CloseIcon from '@mui/icons-material/Close'
import { AppBar, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Link, Toolbar, Typography } from '@mui/material'
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
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)

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

  const handleOpenAboutDialog = useCallback(() => {
    setAboutDialogOpen(true)
  }, [])

  const handleCloseAboutDialog = useCallback(() => {
    setAboutDialogOpen(false)
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
          padding-top: 70px;
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
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 0 }}>
              Merge PDF
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                The elegant and secure PDF tool
              </Typography>
            </Box>
            <Button color="inherit" onClick={handleOpenAboutDialog}>About</Button>
          </Toolbar>
        </AppBar>

        <Dialog maxWidth="md" open={aboutDialogOpen} onClose={handleCloseAboutDialog}>
          <DialogTitle>
            About Merge PDF
            <IconButton
              aria-label="close"
              onClick={handleCloseAboutDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              🛡️ Your PDFs Stay Private
            </Typography>
            <Typography paragraph>
              When you use Merge PDF, your documents never leave your computer. Everything happens right in your browser,
              so your sensitive documents aren't uploaded to any servers. It's like having a PDF workshop right on your own device!
            </Typography>
            <Typography paragraph>
              Unlike many online services, we don't store copies of your files or require you to create an account.
              Your documents remain completely in your control from start to finish.
            </Typography>
            <Typography variant="h6" gutterBottom>
              ⚙️ How It Works
            </Typography>
            <Typography paragraph>
              This tool uses JavaScript running in your web browser to combine your PDF files.
              Think of it as having a PDF toolkit that runs locally - no internet connection is needed for processing once the page loads.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              👋 About Me
            </Typography>
            <Typography paragraph>
              Hi there! I'm Samuel Rossille, a proud husband and dad of 3. When I'm not spending time with my amazing family,
              I'm the CTO and co-founder of <Link href="https://www.orus.eu/" target="_blank" rel="noopener">Orus</Link>,
              where we're working on some pretty cool stuff!
            </Typography>
            <Typography paragraph>
              I'm a passionate developer who loves creating useful tools like this one. If you'd like to connect,
              feel free to find me on <Link href="https://www.linkedin.com/in/samuel-rossille-9621301b/" target="_blank" rel="noopener">LinkedIn</Link>.
            </Typography>
          </DialogContent>
        </Dialog>

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
