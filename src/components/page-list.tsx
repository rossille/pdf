import { css } from '@emotion/react'
import { Button, type ButtonProps } from '@mui/material'
import { memo, useCallback } from 'react'
import { gap } from '../lib/spaces'
import type { Page } from '../lib/types'
import { PageCard } from './page-card'

type PageListProps = {
  pages: Page[]
  className?: string
  onPagesRemoved: (pages: Page[]) => void
  onPageMoved: (movedPageId: number, afterPageId: number) => void
}
export const PageList = memo<PageListProps>(function PageList({ pages, className, onPagesRemoved, onPageMoved }) {
  const onPageRemoved = useCallback((page: Page) => onPagesRemoved([page]), [onPagesRemoved])

  return (
    <div
      css={css`
        display: flex;
        gap: ${gap}px;
        flex-wrap: wrap;
      `}
      className={className}
    >
      {pages.map((page) => (
        <div
          key={page.id}
          css={css`
            position: relative;
            .action-bar {
              display: none;
            }
            :hover {
              .action-bar {
                display: block;
              }
            }
          `}
        >
          <PageCard page={page} scale={1} onPageMoved={onPageMoved} />
          <PageActionBar page={page} onPageRemoved={onPageRemoved} />
        </div>
      ))}
    </div>
  )
})

type PageActionBarProps = {
  page: Page
  onPageRemoved: (pages: Page) => void
}
const PageActionBar = memo<PageActionBarProps>(function PageActionBar({ page, onPageRemoved }) {
  return (
    <div className="action-bar">
      <ActionButton
        css={css`
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
        `}
        onClick={() => onPageRemoved(page)}
      >
        ❌
      </ActionButton>
    </div>
  )
})

const ActionButton = memo<ButtonProps>(function RoundButton(props) {
  const { children, ...passedProps } = props
  return (
    <Button variant="contained" {...passedProps}>
      {children}
    </Button>
  )
})
