import { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import type { ResizableBoxProps } from 'react-resizable';
import { useWindowSize } from 'react-use';

interface ReSizeableProps {
  children: React.ReactNode;
  direction: 'vertical' | 'horizontal';
}

export const ReSizeable: React.FC<ReSizeableProps> = ({ children, direction }) => {
  let resizeProps: ResizableBoxProps;

  const { width, height } = useWindowSize();

  const [editorWidth, setEditorWidth] = useState<number>(width * 0.8);
  const [editorHeight, setEditorHeight] = useState<number>(300);

  if (width * 0.8 < editorWidth) {
    setEditorWidth(width * 0.8);
  }

  if (height * 0.9 < editorHeight) {
    setEditorHeight(height * 0.9);
  }

  if (direction === 'horizontal') {
    resizeProps = {
      className: 'resize-horizontal',
      minConstraints: [width * 0.2, Infinity],
      maxConstraints: [width * 0.8, Infinity],
      height: Infinity,
      width: editorWidth,
      resizeHandles: ['e'],
      onResizeStop: (_, data) => {
        setEditorWidth(data.size.width);
      },
    };
  } else {
    resizeProps = {
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, height * 0.9],
      height: editorHeight,
      width,
      resizeHandles: ['s'],
      onResizeStop: (_, data) => {
        setEditorHeight(data.size.height);
      },
    };
  }

  return (
    <ResizableBox
      // onResizeStop={(e, data) => {
      //   setCurrentHeight(data.size.height);
      //   console.log(data.size.height);
      // }}
      {...resizeProps}
    >
      {children}
    </ResizableBox>
  );
};
