import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const DOCUMENT_CARD_TYPE = 'document-card';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

/**
 * Hook for managing document drag and drop
 */
export function useDragDrop(
  index: number,
  moveDocument: (dragIndex: number, hoverIndex: number) => void,
  isSelected?: boolean,
  onSelect?: () => void
) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: DOCUMENT_CARD_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get horizontal center
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Dragging to right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging to left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveDocument(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: DOCUMENT_CARD_TYPE,
    item: () => {
      // When drag starts, hide this document's buttons by deselecting
      if (isSelected && onSelect) {
        onSelect();
      }
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return {
    ref,
    handlerId,
    isDragging,
  };
}