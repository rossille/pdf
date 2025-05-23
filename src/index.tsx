import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';

// Find the root element in the DOM
const container = document.getElementById('react-root');
if (!container) {
  throw new Error('Element with id "react-root" not found');
}

// Create a React root and render the App
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);