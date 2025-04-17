import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme, screen, fireEvent } from '../../tests/test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    renderWithTheme(<EmptyState onAddDocuments={() => {}} />);
    expect(screen.getByText('Merge PDF')).toBeInTheDocument();
  });

  it('renders the description', () => {
    renderWithTheme(<EmptyState onAddDocuments={() => {}} />);
    expect(screen.getByText('Combine multiple PDFs into one document, easily and securely')).toBeInTheDocument();
  });

  it('renders a document placeholder button', () => {
    renderWithTheme(<EmptyState onAddDocuments={() => {}} />);
    expect(screen.getByText('+ Add PDF')).toBeInTheDocument();
  });

  it('calls onAddDocuments when the placeholder is clicked', () => {
    const handleAddDocuments = vi.fn();
    renderWithTheme(<EmptyState onAddDocuments={handleAddDocuments} />);
    
    fireEvent.click(screen.getByText('+ Add PDF'));
    
    expect(handleAddDocuments).toHaveBeenCalledTimes(1);
  });
});