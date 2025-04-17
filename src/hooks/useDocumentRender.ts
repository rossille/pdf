import { PDFDocument } from 'pdf-lib';
import type { PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';
import { assert } from '../utils/assert';
import { createDeferred, type Deferred } from '../utils/deferred';
import type { Page } from '../utils/page';
import { getPdfJs } from '../utils/pdf-js';

// Manage concurrent PDF rendering with a lock mechanism
let currentLock: Deferred<undefined> | undefined = undefined;

async function acquireLock() {
  while (currentLock) await currentLock.promise;
  currentLock = createDeferred();
}

function releaseLock() {
  assert(currentLock, 'Not currently locked');
  currentLock.resolve(undefined);
  currentLock = undefined;
}

/**
 * Hook for rendering a PDF page to a canvas
 */
export function useDocumentRender(
  page: Page, 
  scale: number, 
  width: number, 
  onResized?: (size: { width: number; height: number }) => void
) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pdfJsLoadingTask: PDFDocumentLoadingTask | undefined = undefined;
    let renderTask: RenderTask | undefined = undefined;

    const dispose = () => {
      cancelled = true;
      if (pdfJsLoadingTask) pdfJsLoadingTask.destroy().catch((err) => console.error(err));
      if (renderTask) renderTask.cancel();
    };

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        // Component has been unmounted, nothing else to do
        return;
      }

      await acquireLock();

      const newDocument = await PDFDocument.create();

      if (cancelled) return;

      const [copiedPage] = await newDocument.copyPages(page.srcDocument, [page.pageIndex]);

      if (cancelled) return;

      newDocument.addPage(copiedPage);

      const pdfBytes = await newDocument.save();

      if (cancelled) return;

      const bytes = new Uint8Array(pdfBytes);

      pdfJsLoadingTask = getPdfJs().getDocument(bytes);

      const pdfJsDocumentProxy = await pdfJsLoadingTask.promise;

      const pdfJsPageProxy = await pdfJsDocumentProxy.getPage(1);

      const pageWidth = pdfJsPageProxy.getViewport({ scale: 1 }).width;
      const canvasScale = width / pageWidth;
      const viewport = pdfJsPageProxy.getViewport({ scale: canvasScale });
      const canvasContext = canvas.getContext('2d');
      assert(canvasContext, 'canvas should have had a 2d context');

      // Taking into account the device pixel ratio allows for a sharper rendering on high DPI screens
      const outputScale = window.devicePixelRatio;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      const canvasOuterWidth = Math.floor(viewport.width);
      const canvasOuterHeight = Math.floor(viewport.height);
      canvas.style.width = canvasOuterWidth + 'px';
      canvas.style.height = canvasOuterHeight + 'px';
      
      const newDimensions = { width: canvasOuterWidth, height: canvasOuterHeight };
      setDimensions(newDimensions);
      
      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      const renderContext = {
        canvasContext,
        transform,
        viewport,
      };

      renderTask = pdfJsPageProxy.render(renderContext);
      await renderTask.promise;
    })()
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        dispose();
      })
      .finally(() => {
        releaseLock();
      });

    return dispose;
  }, [page, width]);

  useEffect(() => {
    if (dimensions && onResized) {
      onResized(dimensions);
    }
  }, [dimensions, onResized]);

  return {
    canvasRef,
    dimensions
  };
}