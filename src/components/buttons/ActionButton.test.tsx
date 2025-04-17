import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme, screen, fireEvent } from '../../tests/test-utils';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('renders with children', () => {
    renderWithTheme(<ActionButton>Test</ActionButton>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    renderWithTheme(<ActionButton onClick={handleClick}>Click Me</ActionButton>);
    
    fireEvent.click(screen.getByText('Click Me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    renderWithTheme(<ActionButton disabled>Disabled Button</ActionButton>);
    expect(screen.getByText('Disabled Button')).toBeDisabled();
  });

  it('uses primary color by default', () => {
    renderWithTheme(<ActionButton>Primary Button</ActionButton>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('MuiButton-containedPrimary', { exact: false });
  });

  it('uses the specified color when provided', () => {
    renderWithTheme(<ActionButton color="error">Error Button</ActionButton>);
    const button = screen.getByText('Error Button');
    expect(button).toHaveClass('MuiButton-containedError', { exact: false });
  });
});