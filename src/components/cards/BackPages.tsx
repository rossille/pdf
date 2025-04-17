import { css } from '@emotion/react';
import { memo } from 'react';
import type { PageTopology } from '../../hooks/useStackConfiguration';

interface BackPagesProps {
  backPages: PageTopology[];
  dimensions: { width: number; height: number };
}

/**
 * Visual representation of document pages stacked behind the first page
 */
export const BackPages = memo<BackPagesProps>(function BackPages({ backPages, dimensions }) {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        width: ${dimensions.width}px;
        height: ${dimensions.height}px;
        z-index: -1;
      `}
    >
      {backPages.map(({ pageIndex, offsetX, offsetY }) => (
        <div
          key={pageIndex}
          css={css`
            background-color: white;
            position: absolute;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 8px;
            box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.05);
            top: ${offsetY}px;
            left: ${offsetX}px;
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
          `}
        />
      ))}
    </div>
  );
});