import { PDFDocument } from 'pdf-lib';
import { memo, useCallback, useRef, type ChangeEvent } from 'react';
import { RoundButton } from '../buttons/RoundButton';

interface FileInputFormProps {
  onDocumentAdded: (document: PDFDocument) => void;
}

/**
 * Hidden form for file input handling
 */
export const FileInputForm = memo<FileInputFormProps>(function FileInputForm({ onDocumentAdded }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) {
        return;
      }
      
      try {
        for (const file of files) {
          const buffer = await file.arrayBuffer();
          const pdfDocument = await PDFDocument.load(buffer);
          onDocumentAdded(pdfDocument);
        }
        // Reset the input value so the same file can be selected again
        event.target.value = '';
      } catch (err) {
        console.error(err);
        alert('An error occured while adding documents, check console');
      }
    },
    [onDocumentAdded]
  );

  return (
    <>
      <input 
        ref={inputRef} 
        type="file" 
        id="file-upload-button" 
        onChange={handleChange} 
        accept=".pdf" 
        hidden 
      />
      <RoundButton title="Click to add files" onClick={handleAddClick}>
        + Add PDF
      </RoundButton>
    </>
  );
});