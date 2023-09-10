import { css } from '@emotion/react'
import { PDFDocument } from 'pdf-lib'
import type { PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist'
import { memo, useCallback, useEffect, useRef, type DragEvent } from 'react'
import { assert } from '../lib/assert'
import { createDeferred, type Deferred } from '../lib/deferred'
import { getPdfJs } from '../lib/pdf-js'
import { gap, pageHeight } from '../lib/spaces'
import type { Page } from '../lib/types'

type PageCardProps = {
  page: Page
  scale: number
  onPageMoved: (movedPageId: number, afterPageId: number) => void
}
export const PageCard = memo<PageCardProps>(function PageCard({ page, scale, onPageMoved }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pageScale = pageHeight / page.height

  const width = page.width * pageScale * scale
  const height = pageHeight * scale

  useEffect(() => {
    let cancelled = false
    let pdfJsLoadingTask: PDFDocumentLoadingTask | undefined = undefined
    let renderTask: RenderTask | undefined = undefined

    const dispose = () => {
      cancelled = true
      if (pdfJsLoadingTask) pdfJsLoadingTask.destroy().catch((err) => console.error())
      if (renderTask) renderTask.cancel()
    }

    ;(async () => {
      const canvas = canvasRef.current
      if (!canvas) {
        // Component has been unmounted, nothing else to do
        return
      }

      await acquireLock()

      const newDocument = await PDFDocument.create()

      if (cancelled) return

      const [copiedPage] = await newDocument.copyPages(page.srcDocument, [page.pageIndex])

      if (cancelled) return

      newDocument.addPage(copiedPage)

      const pdfBytes = await newDocument.save()

      if (cancelled) return

      const bytes = new Uint8Array(pdfBytes)

      // saveByteArray(bytes)

      pdfJsLoadingTask = getPdfJs().getDocument(bytes)

      const pdfJsDocumentProxy = await pdfJsLoadingTask.promise

      const pdfJsPageProxy = await pdfJsDocumentProxy.getPage(1)

      const pageWidth = pdfJsPageProxy.getViewport({ scale: 1 }).width
      const scale = width / pageWidth
      const viewport = pdfJsPageProxy.getViewport({ scale })
      const canvasContext = canvas.getContext('2d')
      assert(canvasContext, 'canvas should have had a 2d context')

      // Taking into account the device pixel ratio allows for a sharper rendering on high DPI screens
      const outputScale = window.devicePixelRatio
      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      canvas.style.width = Math.floor(viewport.width) + 'px'
      canvas.style.height = Math.floor(viewport.height) + 'px'
      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined

      const renderContext = {
        canvasContext,
        transform,
        viewport,
      }

      renderTask = pdfJsPageProxy.render(renderContext)
      await renderTask.promise
    })()
      .catch((err) => {
        if (cancelled) return
        dispose()
      })
      .finally(() => {
        releaseLock()
      })

    return dispose
  }, [page, width])

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLCanvasElement>) => {
      event.dataTransfer.setData('page', page.id.toString())
      const div = event.target as HTMLCanvasElement
      div.classList.add('dragging')
    },
    [page],
  )

  const handleDragEnd = useCallback((event: DragEvent<HTMLCanvasElement>) => {
    const div = event.target as HTMLCanvasElement
    div.classList.remove('dragging')
  }, [])

  const handleDragOverSide = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnterSide = useCallback((event: DragEvent<HTMLDivElement>) => {
    const div = event.target as HTMLDivElement
    div.classList.add('dragover')
  }, [])

  const handleDragLeaveSide = useCallback((event: DragEvent<HTMLDivElement>) => {
    const div = event.target as HTMLDivElement
    div.classList.remove('dragover')
  }, [])

  const handleDropAfter = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      const droppedPageIdStr = event.dataTransfer.getData('page')
      const droppedPageId = parseInt(droppedPageIdStr, 10)
      const div = event.target as HTMLDivElement
      div.classList.remove('dragover')
      onPageMoved(droppedPageId, page.id)
    },
    [onPageMoved, page.id],
  )

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <canvas
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        ref={canvasRef}
        css={css`
          border: 1px solid black;
          cursor: move;
          &.dragging {
            opacity: 0.1;
          }
        `}
        width={width}
        height={height}
      />
      <div
        css={css`
          position: absolute;
          top: 0;
          bottom: 0;
          left: 100%;
          width: ${gap}px;
          &.dragover {
            background-color: pink;
          }
        `}
        onDragOver={handleDragOverSide}
        onDragEnter={handleDragEnterSide}
        onDragLeave={handleDragLeaveSide}
        onDrop={handleDropAfter}
      />
    </div>
  )
})

let currentLock: Deferred<undefined> | undefined = undefined

async function acquireLock() {
  while (currentLock) await currentLock.promise
  currentLock = createDeferred()
}

function releaseLock() {
  assert(currentLock, 'Not currently locked')
  currentLock.resolve(undefined)
  currentLock = undefined
}
