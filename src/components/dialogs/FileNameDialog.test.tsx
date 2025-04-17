import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme, screen, fireEvent } from '../../tests/test-utils';
import { FileNameDialog } from './FileNameDialog';

describe('FileNameDialog', () => {
  it('renders with default file name', () => {
    const defaultFileName = 'test.pdf';
    renderWithTheme(
      <FileNameDialog 
        open={true} 
        defaultFileName={defaultFileName} 
        onConfirm={() => {}} 
        onCancel={() => {}} 
      />
    );
    
    const input = screen.getByLabelText('File Name');
    expect(input).toHaveValue(defaultFileName);
  });

  it('calls onConfirm with file name when Download button is clicked', () => {
    const handleConfirm = vi.fn();
    const defaultFileName = 'test.pdf';
    
    renderWithTheme(
      <FileNameDialog 
        open={true} 
        defaultFileName={defaultFileName} 
        onConfirm={handleConfirm} 
        onCancel={() => {}} 
      />
    );
    
    fireEvent.click(screen.getByText('Download'));
    expect(handleConfirm).toHaveBeenCalledWith(defaultFileName);
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const handleCancel = vi.fn();
    
    renderWithTheme(
      <FileNameDialog 
        open={true} 
        defaultFileName="test.pdf" 
        onConfirm={() => {}} 
        onCancel={handleCancel} 
      />
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('shows error when file name does not end with .pdf', () => {
    renderWithTheme(
      <FileNameDialog 
        open={true} 
        defaultFileName="test.pdf" 
        onConfirm={() => {}} 
        onCancel={() => {}} 
      />
    );
    
    const input = screen.getByLabelText('File Name');
    fireEvent.change(input, { target: { value: 'test.txt' } });
    
    expect(screen.getByText('Filename must end with .pdf')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeDisabled();
  });

  it('shows error when file name is empty', () => {
    renderWithTheme(
      <FileNameDialog 
        open={true} 
        defaultFileName="test.pdf" 
        onConfirm={() => {}} 
        onCancel={() => {}} 
      />
    );
    
    const input = screen.getByLabelText('File Name');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(screen.getByText('Filename is required')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeDisabled();
  });
});