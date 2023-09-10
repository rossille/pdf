import { PDFDocument } from 'pdf-lib'
import { memo, useCallback, useRef, type ChangeEvent } from 'react'
import { RoundButton } from './round-button'

type FileInputFormProps = {
  onDocumentAdded: (document: PDFDocument) => void
}
export const FileInputForm = memo<FileInputFormProps>(function FileInputForm({ onDocumentAdded }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleAddClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) {
        return
      }
      ;(async () => {
        for (const file of files) {
          onDocumentAdded(await PDFDocument.load(await file.arrayBuffer()))
        }
      })().catch((err) => {
        console.error(err)
        alert('An error occured while adding documents, check console')
      })
    },
    [onDocumentAdded],
  )

  return (
    <>
      <input ref={inputRef} type="file" id="file-upload-button" onChange={handleChange} accept=".pdf" hidden />
      <RoundButton title="Click to add files" onClick={handleAddClick}>
        +
      </RoundButton>
    </>
  )
})
