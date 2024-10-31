import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  UndoDot,
  RedoDot,
  Settings,
  Captions,
} from "lucide-react";
import { VideoPlayerProps } from "./types";
import { formatTime } from "./utils";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import SpeedControl from "./SpeedControl";

export default function VideoPlayer({
  url,
  subtitleUrl,
  thumbnail,
  ...props
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [controlHeight, setControlHeight] = useState(0);
  const [isPlayed, setIsPlayed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number>();
  const controlsRef = useRef<HTMLDivElement>(null);

  const updateControlHeight = () => {
    if (controlsRef.current) {
      setControlHeight(controlsRef.current.clientHeight);
    }
  };

  

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Update subtitles based on currentTime if needed (if using cue-based subtitles)
    };

    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  // Update the video volume whenever it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume; // Mute or set the volume
    }
  }, [volume, isMuted]);

  // Controls visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 2000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isPlaying]);

  const handleFirstPlay = () => {
    setIsPlayed(true);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        updateControlHeight();
      })
    }
  };



  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Error attempting to toggle fullscreen:", error);
    }
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = videoRef.current.currentTime + seconds;
    videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
  };

  const toggleSubtitles = () => {
    setShowSubtitles((setShowSubtitles) => !setShowSubtitles);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlayed) return;
      switch (event.key) {
        case " ":
        case "k":
          event.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "ArrowRight":
          seek(10);
          break;
        case "ArrowLeft":
          seek(-10);
          break;
        case "c":
          toggleSubtitles();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isMuted, isFullscreen]);

  const handleSubtitleError = (error: unknown) => {
    console.error("Subtitle load error:", error);
  };

  return (
    <div
      ref={containerRef}
      className="relative group w-full max-w-full aspect-video bg-black rounded-xl overflow-hidden"
      {...props}
    >
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          poster={thumbnail}
          src={url}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          onContextMenu={(e) => e.preventDefault()}
        >
          {showSubtitles && subtitleUrl && (
            <track kind="subtitles" src={subtitleUrl}
            onError={handleSubtitleError}
             srcLang="ml" default />
          )}
        </video>

        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {isPlayed && (
          <button
            onClick={() => seek(-10)}
            className={`absolute top-1/2 left-1/4 transform -translate-y-1/2
      w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blue-500/10 backdrop-blur-sm rounded-full
      flex items-center justify-center transition-all duration-300
      hover:bg-blue-500/20 ${showControls ? "opacity-100" : "opacity-0"}`}
            title="Rewind 10 seconds"
          >
            <UndoDot className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
          </button>
        )}

        {/* Play/Pause Button */}
        {!isPlayed && (
          <button
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-blue-500/10 backdrop-blur-sm rounded-full 
      flex items-center justify-center 
      transition-all duration-300 hover:bg-blue-500/20`}
            onClick={handleFirstPlay}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
            ) : (
              <Play className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white ml-1 drop-shadow-lg" />
            )}
          </button>
        )}

        {/* Forward Button */}
        {isPlayed && (
        <button
          onClick={() => seek(10)}
          className={`absolute top-1/2 right-1/4 transform -translate-y-1/2 
            w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blue-500/10 backdrop-blur-sm rounded-full 
            flex items-center justify-center transition-all duration-300 hover:bg-blue-500/20 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          title="Forward 10 seconds"
        >
          <RedoDot className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
        </button>
        )}
        {isPlayed && (
        <div
          ref={controlsRef}
          className={`absolute bottom-0 left-4 right-4
                      px-4 py-4 transition-all duration-300 rounded-md transform
                      ${
                        showControls || !isPlaying
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
        >
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={(time) => {
              if (videoRef.current) videoRef.current.currentTime = time;
            }}
          />

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-6">
              <button
                onClick={togglePlay}
                className="text-white/90 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                title={isPlaying ? "Pause (k)" : "Play (k)"}
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
              {/* <button
                onClick={() => seek(-10)}
                className="hidden sm:block text-white/90 hover:text-blue-400 transition-all duration-200"
                title="Rewind 10 seconds"
              >
                <UndoDot />
              </button> */}

              {/* <button
                onClick={() => seek(10)}
                className="hidden sm:block text-white/90 hover:text-blue-400 transition-all duration-200"
                title="Forward 10 seconds"
              >
                <RedoDot />
              </button> */}

              <VolumeControl
                volume={volume}
                onVolumeChange={setVolume}
                isMuted={isMuted}
                onMuteToggle={toggleMute}
              />
              <div className="text-sm hidden sm:block font-medium tracking-tight text-white/70">
                <span>{formatTime(currentTime)}</span> /{" "}
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {subtitleUrl && (
                <button
                  onClick={toggleSubtitles}
                  className="text-white/90 hover:text-blue-400 transition-all duration-200"
                  title={showSubtitles ? "Hide Subtitles" : "Show Subtitles"}
                >
                  {showSubtitles ? (
                    <Captions className="text-blue-600" />
                  ) : (
                    <Captions />
                  )}
                </button>
              )}
              <button
                onClick={() => setShowSpeedControl(!showSpeedControl)}
                className="text-white/90 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                title="Playback Speed"
              >
                <Settings className="w-5 h-5 drop-shadow" />
              </button>

              {showSpeedControl && (
                <SpeedControl
                  speed={playbackSpeed}
                  onSpeedChange={(speed) => {
                    if (videoRef.current) {
                      videoRef.current.playbackRate = speed;
                      setPlaybackSpeed(speed);
                    }
                  }}
                  onClose={() => setShowSpeedControl(false)}
                />
              )}
              <button
                onClick={toggleFullscreen}
                className="text-white/90 hover:text-blue-400 transition-all duration-200"
                title={isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
              >
                {isFullscreen ? <Minimize /> : <Maximize />}
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
      {showControls && (
        <style>
          {`
        video::-webkit-media-text-track-container {
          bottom: ${controlHeight}px;
        }
      `}
        </style>
      )}
      {!showControls && (
        <style>
          {`
        video::-webkit-media-text-track-container {
          bottom: 15px;
        }
      `}
        </style>
      )}
    </div>
  );
}
