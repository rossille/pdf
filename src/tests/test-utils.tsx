import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import React from 'react';

// Create a theme for consistent testing
export const theme = createTheme();

// Custom render function that includes the ThemeProvider
export function renderWithTheme(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
    ...options
  });
}

// Export everything from testing-library
export * from '@testing-library/react';
