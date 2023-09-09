import { css } from '@emotion/react'
import { Typography } from '@mui/material'
import { memo, StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

const App = memo(function App() {
  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Typography className="rotating" variant="h4">
        Yo
      </Typography>
    </div>
  )
})

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
