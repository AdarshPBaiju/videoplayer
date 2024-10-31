import { useEffect, useRef } from 'react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  onClose: () => void;
}

export default function SpeedControl({ speed, onSpeedChange, onClose }: SpeedControlProps) {
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSpeedChange = (value: number) => {
    onSpeedChange(value);
    onClose();
  };

  return (
    <div className="fixed max-w-[100px] bottom-9 right-20 p-1 rounded-t-lg backdrop-blur-sm bg-white/20">
      <div
        ref={menuRef}
        className="rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10 max-h-[100px] overflow-y-auto"
      >
        {speeds.map((value) => (
          <button
            key={value}
            className={`w-full px-3 py-0 text-sm text-left transition-colors 
                       hover:bg-blue-600/30 active:bg-blue-600/50 
                       font-medium tracking-wide rounded-md 
                       ${speed === value ? 'text-blue-500' : 'text-white'}`}
            onClick={() => handleSpeedChange(value)}
          >
            {value}x
          </button>
        ))}
      </div>
    </div>
  );
}
