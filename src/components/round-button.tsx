import { css } from '@emotion/react'
import { Button, Typography, type ButtonProps } from '@mui/material'
import { memo } from 'react'

export const RoundButton = memo<ButtonProps>(function RoundButton(props) {
  const { children, ...passedProps } = props
  return (
    <Button
      css={css`
        border-radius: 100%;
        padding: 9px 16px;
      `}
      variant="contained"
      {...passedProps}
    >
      <Typography variant="h4">{children}</Typography>
    </Button>
  )
})
