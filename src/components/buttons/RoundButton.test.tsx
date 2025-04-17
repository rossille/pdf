import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme, screen, fireEvent } from '../../tests/test-utils';
import { RoundButton } from './RoundButton';

describe('RoundButton', () => {
  it('renders with the provided text', () => {
    renderWithTheme(<RoundButton>Test Button</RoundButton>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    renderWithTheme(<RoundButton onClick={handleClick}>Click Me</RoundButton>);
    
    fireEvent.click(screen.getByText('Click Me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant="contained" by default', () => {
    renderWithTheme(<RoundButton>Test Button</RoundButton>);
    
    const button = screen.getByText('Test Button');
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('passes additional props to the button', () => {
    renderWithTheme(<RoundButton disabled color="secondary">Test Button</RoundButton>);
    
    const button = screen.getByText('Test Button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('MuiButton-containedSecondary', { exact: false });
  });
});