import { css } from '@emotion/react';
import { memo } from 'react';

interface BackgroundDecorationProps {
  className?: string;
}

/**
 * Decorative background elements for the application
 */
export const BackgroundDecoration = memo<BackgroundDecorationProps>(function BackgroundDecoration({ className }) {
  return (
    <div
      className={className}
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      `}
    >
      {/* Top-left decoration */}
      <div
        css={css`
          position: absolute;
          top: -150px;
          left: -150px;
          width: 450px;
          height: 450px;
          background-image: url('/pdf/decoration-top-left.svg');
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.7;
          z-index: -1;
        `}
      />

      {/* Bottom-right decoration */}
      <div
        css={css`
          position: absolute;
          bottom: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background-image: url('/pdf/decoration-bottom-right.svg');
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.7;
          z-index: -1;
        `}
      />

      {/* Center decoration for empty state */}
      <div
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -40%);
          width: 200px;
          height: 200px;
          background-image: url('/pdf/decoration-center.svg');
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.3;
          z-index: -1;
        `}
      />
    </div>
  );
});