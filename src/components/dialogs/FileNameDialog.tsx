import { css } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { memo, useCallback, useState } from 'react';

interface FileNameDialogProps {
  open: boolean;
  defaultFileName: string;
  onConfirm: (fileName: string) => void;
  onCancel: () => void;
}

/**
 * Dialog for entering a filename before download
 */
export const FileNameDialog = memo<FileNameDialogProps>(function FileNameDialog({
  open,
  defaultFileName,
  onConfirm,
  onCancel
}) {
  const [fileName, setFileName] = useState(defaultFileName);
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFileName(value);
    
    // Basic validation
    if (!value.trim()) {
      setError('Filename is required');
    } else if (!value.endsWith('.pdf')) {
      setError('Filename must end with .pdf');
    } else {
      setError('');
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (fileName.trim() && fileName.endsWith('.pdf')) {
      onConfirm(fileName);
    }
  }, [fileName, onConfirm]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && fileName.trim() && fileName.endsWith('.pdf')) {
      onConfirm(fileName);
    }
  }, [fileName, onConfirm]);

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFE)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          pb: 1, 
          background: 'linear-gradient(45deg, #4361EE 30%, #4CC9F0 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}
      >
        Save Merged PDF
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please enter a name for your merged PDF file:
        </Typography>
        
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          label="File Name"
          value={fileName}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error}
          InputProps={{
            sx: {
              borderRadius: 2,
              '&.Mui-focused': {
                boxShadow: '0 0 0 3px rgba(67, 97, 238, 0.15)',
              },
            }
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onCancel}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!!error || !fileName.trim()}
          sx={{ 
            borderRadius: 2, 
            px: 3,
            py: 1,
            fontWeight: 600,
            ml: 2,
          }}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
});