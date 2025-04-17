import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
import { gap } from '../utils/spaces';

// App Layout Styles
export const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #F9FAFE 0%, #EDF1FF 50%, #E1EFFF 100%);
  font-family: 'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 90px 20px 40px;
  gap: 30px;
  width: 100%;

  /* Custom scrollbar styling */
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: rgba(240, 242, 255, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(67, 97, 238, 0.3);
    border-radius: 3px;
    &:hover {
      background-color: rgba(67, 97, 238, 0.5);
    }
  }
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
  margin: 20px 0;
  padding: 20px;
  max-width: 1200px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
`;

export const DocumentItemWrapper = styled.div`
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;

  .action-bar {
    display: none;
  }

  :hover {
    transform: translateY(-5px);

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
  width: 100%;
  max-width: 1200px;
  text-align: center;
  padding: 30px;
`;

export const EmptyStateTitle = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`;

// Button Styles
export const ActionButton = styled(Button)`
  min-width: 40px !important;
  width: 40px;
  height: 40px;
  padding: 0 !important;
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const ActionButtonsContainer = styled.div`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  gap: 12px;
`;

// Canvas Styles
export const CanvasStyles = css`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  cursor: move;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background-color: white;

  &.dragging {
    opacity: 0.3;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

