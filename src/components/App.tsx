import { AppBar, Box, Button, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePdfDocuments } from '../hooks/usePdfDocuments';
import { AppContainer, FlexCenterBox } from '../styles/common';
import { theme } from '../styles/theme';
import { downloadPdf, generateMergedPdf } from '../utils/pdf-utils';
import { FileNameDialog } from './dialogs/FileNameDialog';
import { AboutDialog } from './layout/AboutDialog';
import { BackgroundDecoration } from './layout/BackgroundDecoration';
import { DocumentsList } from './layout/DocumentsList';
import { EmptyState } from './layout/EmptyState';
import { FileInputForm } from './layout/FileInputForm';

/**
 * Main application component
 */
export const App = memo(function App() {
  const {
    pdfDocuments,
    selectedDocumentIndex,
    handleDocumentAdded,
    handleDocumentRemoved,
    handleReorderDocuments,
    setSelectedDocumentIndex
  } = usePdfDocuments();

  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [fileNameDialogOpen, setFileNameDialogOpen] = useState(false);
  const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null);

  const handleDownloadMerged = useCallback(async () => {
    try {
      const pdfBytes = await generateMergedPdf(pdfDocuments);
      setMergedPdfBytes(pdfBytes);
      setFileNameDialogOpen(true);
    } catch (err) {
      console.error(err);
      alert('Sorry, an error occurred, please check logs');
    }
  }, [pdfDocuments]);

  const handleFileNameConfirm = useCallback((fileName: string) => {
    if (mergedPdfBytes) {
      downloadPdf(mergedPdfBytes, fileName);
      setFileNameDialogOpen(false);
      setMergedPdfBytes(null);
    }
  }, [mergedPdfBytes]);

  const handleFileNameCancel = useCallback(() => {
    setFileNameDialogOpen(false);
    setMergedPdfBytes(null);
  }, []);

  const handleAddDocumentsClick = useCallback(() => {
    const input = document.getElementById('file-upload-button') as HTMLInputElement;
    input?.click();
  }, []);

  const handleOpenAboutDialog = useCallback(() => {
    setAboutDialogOpen(true);
  }, []);

  const handleCloseAboutDialog = useCallback(() => {
    setAboutDialogOpen(false);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <AppContainer>
          <BackgroundDecoration />

          <AppBar position="fixed">
            <Toolbar>
              <div style={{ width: '200px' }}>
                <Typography variant="h5" component="div" sx={{ flexGrow: 0, fontWeight: 700 }}>
                  Merge PDF
                </Typography>
              </div>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="subtitle1">
                  The easy and secure PDF tool
                </Typography>
              </Box>
              <div style={{ width: '200px', textAlign: 'right' }}>
                <Button color="inherit" onClick={handleOpenAboutDialog}>About</Button>
              </div>
            </Toolbar>
          </AppBar>

          <AboutDialog open={aboutDialogOpen} onClose={handleCloseAboutDialog} />
          
          <FileNameDialog
            open={fileNameDialogOpen}
            defaultFileName="merged.pdf"
            onConfirm={handleFileNameConfirm}
            onCancel={handleFileNameCancel}
          />

          {pdfDocuments.length === 0 ? (
            <EmptyState onAddDocuments={handleAddDocumentsClick} />
          ) : (
            <DocumentsList
              documents={pdfDocuments}
              onDocumentRemoved={handleDocumentRemoved}
              onReorder={handleReorderDocuments}
              onAddDocument={handleAddDocumentsClick}
              selectedDocumentIndex={selectedDocumentIndex}
              onDocumentSelect={setSelectedDocumentIndex}
            />
          )}

          {pdfDocuments.length > 0 && (
            <FlexCenterBox>
              <Button
                variant="contained"
                onClick={handleDownloadMerged}
                size="large"
                sx={{
                  py: 1.5,
                  px: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                💾 Merge & Download
              </Button>
            </FlexCenterBox>
          )}

          <div style={{ display: 'none' }}>
            <FileInputForm onDocumentAdded={handleDocumentAdded} />
          </div>
        </AppContainer>
      </DndProvider>
    </ThemeProvider>
  );
});