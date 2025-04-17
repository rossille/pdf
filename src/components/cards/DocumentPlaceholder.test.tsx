import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme, screen, fireEvent } from '../../tests/test-utils';
import { DocumentPlaceholder } from './DocumentPlaceholder';

describe('DocumentPlaceholder', () => {
  it('renders with the correct dimensions', () => {
    const dimensions = { width: 200, height: 300 };
    renderWithTheme(<DocumentPlaceholder onClick={() => {}} dimensions={dimensions} />);
    
    const button = screen.getByText('+ Add PDF');
    expect(button).toHaveStyle(`width: 200px`);
    expect(button).toHaveStyle(`height: 300px`);
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    renderWithTheme(<DocumentPlaceholder onClick={handleClick} dimensions={{ width: 200, height: 300 }} />);
    
    fireEvent.click(screen.getByText('+ Add PDF'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with the add PDF text', () => {
    renderWithTheme(<DocumentPlaceholder onClick={() => {}} dimensions={{ width: 200, height: 300 }} />);
    expect(screen.getByText('+ Add PDF')).toBeInTheDocument();
  });

  it('uses outlined variant for the button', () => {
    renderWithTheme(<DocumentPlaceholder onClick={() => {}} dimensions={{ width: 200, height: 300 }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-outlined', { exact: false });
  });
});