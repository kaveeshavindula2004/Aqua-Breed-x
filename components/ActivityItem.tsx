import React, { useRef, useState, useEffect } from 'react';
import { TrashIcon } from './Icons';

interface ActivityItemProps {
  icon: React.ReactNode;
  bgColor: string;
  title: string;
  subtitle: string;
  time: string;
  onDelete: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, bgColor, title, subtitle, time, onDelete }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const currentTranslateX = useRef(0);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    currentTranslateX.current = translateX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX.current;
    let newTranslate = currentTranslateX.current + deltaX;

    // Constrain the swipe
    if (newTranslate > 0) newTranslate = 0;
    if (newTranslate < -90) newTranslate = -90;

    setTranslateX(newTranslate);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (translateX < -40) {
      setTranslateX(-80); // Snap open
    } else {
      setTranslateX(0); // Snap closed
    }
  };

  // Effect to handle mouse events on the window for smooth dragging
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
        document.body.style.cursor = '';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };

    // Only add listeners when dragging
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);


  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    handleDragStart(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDragMove(e.touches[0].clientX);
  };


  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete Button Background */}
      <div className="absolute top-0 right-0 h-full flex items-center bg-red-600">
        <button
          onClick={onDelete}
          className="flex items-center justify-center w-20 h-full text-white"
          tabIndex={translateX <= -40 ? 0 : -1} // Make focusable only when revealed
          aria-label="Delete activity"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Swipeable Content */}
      <div
        className="relative bg-white dark:bg-slate-800 p-3 flex items-center space-x-3 w-full cursor-grab"
        style={{ transform: `translateX(${translateX}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out', touchAction: 'pan-y' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div className={`flex-shrink-0 ${bgColor} p-2 rounded-full`}>
          {icon}
        </div>
        <div className="flex-grow">
          <p className="text-gray-900 dark:text-white text-sm font-semibold">{title}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{subtitle}</p>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-xs ml-auto self-start flex-shrink-0">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;