import { css } from '@emotion/react';
import { Button, type ButtonProps } from '@mui/material';
import { memo } from 'react';

/**
 * A button with rounded corners
 */
export const RoundButton = memo<ButtonProps>(function RoundButton(props) {
  const { children, ...passedProps } = props;
  
  return (
    <Button
      css={css`
        border-radius: 20px;
        padding: 9px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      `}
      variant="contained"
      {...passedProps}
    >
      {children}
    </Button>
  );
});