import React, { useRef } from 'react';

const TouchEditorEvent = ({ onTouchStart, onTouchMove, onTouchEnd, children }) => {
  const isTouching = useRef(false);

  const handleTouchStart = (e) => {
    e.preventDefault();
    isTouching.current = true;
    onTouchStart(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isTouching.current) {
      onTouchMove(e);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    isTouching.current = false;
    onTouchEnd(e);
  };

  return (
    <>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </>
  );
};

export default TouchEditorEvent;