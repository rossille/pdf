import { Dialog, DialogContent, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { memo, useCallback } from 'react';
import { CloseButtonStyles } from '../../styles/common';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog showing information about the application
 */
export const AboutDialog = memo<AboutDialogProps>(function AboutDialog({ open, onClose }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle>
        About Merge PDF
        <IconButton
          aria-label="close"
          onClick={handleClose}
          css={CloseButtonStyles}
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
  );
});