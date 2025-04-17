import { css } from '@emotion/react';
import { memo } from 'react';

interface BackPagesProps {
  depth: number;
  dimensions: { width: number; height: number };
}

/**
 * Visual representation of document pages stacked behind the first page
 */
export const BackPages = memo<BackPagesProps>(function BackPages({ depth, dimensions }) {
  const backPagesCount = Math.min(depth - 1, 5);
  console.log('backPagesCount', backPagesCount);
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      {Array.from({ length: backPagesCount }).map((_, index) => (
        <div
          key={index}
          css={css`
            background-color: white;
            position: absolute;
            border: 1px solid black;
            top: -${index * 2}px;
            left: -${index * 2}px;
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
          `}
        />
      ))}
    </div>
  );
});