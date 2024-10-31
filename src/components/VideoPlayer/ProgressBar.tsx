import React, { useState, useRef } from 'react';
import { formatTime } from './utils';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export default function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const calculateProgress = (clientX: number) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const progress = Math.max(0, Math.min(1, position / rect.width));
    return progress * duration;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const time = calculateProgress(e.clientX);
    setHoverTime(time);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const time = calculateProgress(e.clientX);
    onSeek(time);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const time = calculateProgress(e.clientX);
          onSeek(time);
        }
      };

      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);

      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, [isDragging, onSeek]);

  const progress = (currentTime / duration) * 100;

  return (
    <div 
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverTime(null)}
    >
      {/* Hover preview */}
      {hoverTime !== null && (
        <div 
          className="absolute bottom-full mb-2 transform -translate-x-1/2 
                     bg-black/95 backdrop-blur-sm text-white/90 text-xs py-1.5 px-2.5 
                     rounded-md font-medium tracking-wide shadow-lg"
          style={{ left: `${(hoverTime / duration) * 100}%` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer 
                   group-hover:h-2 transition-all duration-200"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 relative"
          style={{ width: `${progress}%` }}
        >
          {/* Scrubber */}
          <div 
            className=""
          />
        </div>
      </div>
    </div>
  );
}