import { type ButtonProps } from '@mui/material';
import { memo } from 'react';
import { ActionButton as StyledActionButton } from '../../styles/common';

interface ActionButtonProps extends ButtonProps {
  disabled?: boolean;
}

/**
 * Action button used for document controls
 */
export const ActionButton = memo<ActionButtonProps>(function ActionButton({
  children,
  disabled = false,
  onClick,
  color = 'primary',
  ...rest
}) {
  return (
    <StyledActionButton
      variant="contained"
      color={color}
      size="small"
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledActionButton>
  );
});