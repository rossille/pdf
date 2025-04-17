import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme, screen, fireEvent } from '../../tests/test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    renderWithTheme(<EmptyState onAddDocuments={() => {}} />);
    expect(screen.getByText('Merge PDF Files')).toBeInTheDocument();
  });

  it('renders the description', () => {
    renderWithTheme(<EmptyState onAddDocuments={() => {}} />);
    // Use a regex to match text that might be split across elements
    expect(screen.getByText(/Combine multiple PDFs into one document/)).toBeInTheDocument();
  });

  it('renders the Get Started section', () => {
    renderWithTheme(<EmptyState onAddDocuments={() => {}} />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('calls onAddDocuments when the button is clicked', () => {
    const handleAddDocuments = vi.fn();
    renderWithTheme(<EmptyState onAddDocuments={handleAddDocuments} />);
    
    fireEvent.click(screen.getByText('+ Add PDF Files'));
    
    expect(handleAddDocuments).toHaveBeenCalledTimes(1);
  });
});