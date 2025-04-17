import { memo } from 'react';
import { useDocumentRender } from '../../hooks/useDocumentRender';
import { Page } from '../../utils/page';
import { pageWidth } from '../../utils/spaces';
import { CanvasStyles } from '../../styles/common';

interface PageCardProps {
  page: Page;
  scale: number;
  onResized: (size: { width: number; height: number }) => void;
  className?: string;
}

/**
 * Card displaying a single PDF page
 */
export const PageCard = memo<PageCardProps>(function PageCard({
  page,
  scale,
  className,
  onResized,
}) {
  const pageScale = pageWidth / page.width;
  const width = page.width * pageScale * scale;
  const height = page.height * pageScale * scale;

  const { canvasRef } = useDocumentRender(page, scale, width, onResized);

  return (
    <canvas
      className={className}
      ref={canvasRef}
      css={CanvasStyles}
      width={width}
      height={height}
    />
  );
});