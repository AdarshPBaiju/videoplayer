import { Volume2, Volume1, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export default function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-3 group">
      <button
        onClick={onMuteToggle}
        className="text-white/90 hover:text-blue-400 transition-all duration-200 hover:scale-110"
        title="Toggle Mute (m)"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-6 h-6 drop-shadow" />
        ) : volume < 0.7 ? (
          <Volume1 className="w-6 h-6 drop-shadow" />
        ) : (
          <Volume2 className="w-6 h-6 drop-shadow" />
        )}
      </button>

      <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full accent-blue-500 bg-white/20 h-1 mb-3 rounded-full 
                     hover:accent-blue-400 transition-all cursor-pointer"
        />
      </div>
    </div>
  );
}
