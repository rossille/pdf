import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
import { gap, pageWidth } from '../utils/spaces';

// App Layout Styles
export const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-top: 70px;
  scrollbar-width: thin;
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: lightgray;
  }
  ::-webkit-scrollbar-thumb {
    background-color: gray;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 0;
  padding: 0;
  background: linear-gradient(65deg, #ffffff 0%, #eaf8ff 100%);
  font-family: 'Inter', sans-serif;
`;

export const FlexCenterBox = styled(Box)`
  display: flex;
  justify-content: center;
`;

export const CloseButtonStyles = css`
  position: absolute;
  right: 8px;
  top: 8px;
  color: grey;
`;

// Document List Styles
export const DocumentsListContainer = styled.div`
  display: flex;
  gap: ${gap}px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

export const DocumentItemWrapper = styled.div`
  position: relative;
  .action-bar {
    display: none;
  }
  :hover {
    .action-bar {
      display: block;
    }
  }
`;

// Empty State Styles
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

export const EmptyStateTitle = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`;

// Button Styles
export const ActionButton = styled(Button)`
  min-width: 36px !important;
  width: 36px;
  height: 36px;
  padding: 0 !important;
  border-radius: 4px;
`;

export const ActionButtonsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 5px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  gap: 10px;
`;

// Canvas Styles
export const CanvasStyles = css`
  border: 1px solid black;
  cursor: move;
  &.dragging {
    opacity: 0.1;
  }
`;

// Document Placeholder
export const StyledPlaceholderButton = styled(Button)`
  border: 2px dashed #aaa;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;