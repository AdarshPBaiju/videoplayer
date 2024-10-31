import { useEffect, useRef } from 'react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  onClose: () => void;
}

export default function SpeedControl({ speed, onSpeedChange, onClose }: SpeedControlProps) {
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ',' && speed > 0.25) {
        onSpeedChange(Math.max(0.25, speed - 0.25));
      } else if (event.key === '.' && speed < 2) {
        onSpeedChange(Math.min(2, speed + 0.25));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, speed, onSpeedChange]);

  useEffect(() => {
    // Scroll to the active speed button
    const activeButton = buttonRefs.current[speeds.indexOf(speed)];
    if (activeButton) {
      activeButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

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
        {speeds.map((value, index) => (
          <button
            key={value}
            ref={(el) => (buttonRefs.current[index] = el)}
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
