import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { App } from './components/app'

const container = document.getElementById('react-root')
if (!container) {
  throw new Error('Element with id "react-root" not found')
}

const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
