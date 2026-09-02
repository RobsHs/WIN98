import React, { useState, useEffect, useRef } from 'react';
import { useDialog } from '../../context/DialogContext';
import { soundService } from '../../services/soundService';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  isSynth?: boolean;
  synthType?: 'groove' | 'canyon' | 'passport';
  audioSrc?: string;
}

const SAMPLE_TRACKS: Track[] = [
  { id: 't1', title: 'Canyon.mid', artist: 'Windows 98 Audio', duration: 120, isSynth: true, synthType: 'canyon' },
  { id: 't2', title: 'Passport.mid', artist: 'Microsoft Sound', duration: 95, isSynth: true, synthType: 'passport' },
  { id: 't3', title: 'Retro98_Groove.wav', artist: 'Synthesizer Engine', duration: 80, isSynth: true, synthType: 'groove' },
];

export const MediaPlayer: React.FC = () => {
  const { showInfo } = useDialog();

  const [playlist, setPlaylist] = useState<Track[]>(SAMPLE_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || SAMPLE_TRACKS[0];

  // Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const drawVisualizer = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        const numBars = 24;
        const barWidth = Math.floor(canvas.width / numBars) - 2;

        for (let i = 0; i < numBars; i++) {
          const barHeight = Math.floor(Math.random() * (canvas.height - 10)) + 5;
          const x = i * (barWidth + 2) + 2;
          const y = canvas.height - barHeight;

          const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
          grad.addColorStop(0, '#22c55e');
          grad.addColorStop(0.6, '#eab308');
          grad.addColorStop(1, '#ef4444');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Track timer loop
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    soundService.playClick();
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      setIsPlaying(true);
      if (currentTrack.audioSrc && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleStop = () => {
    soundService.playClick();
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handlePrevTrack = () => {
    soundService.playClick();
    setCurrentTime(0);
    setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : playlist.length - 1));
  };

  const handleNextTrack = () => {
    soundService.playClick();
    setCurrentTime(0);
    setCurrentTrackIndex((prev) => (prev < playlist.length - 1 ? prev + 1 : 0));
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newTrack: Track = {
        id: `user_track_${Date.now()}`,
        title: file.name,
        artist: 'Local Media',
        duration: 180,
        audioSrc: url,
      };
      setPlaylist((prev) => [...prev, newTrack]);
      setCurrentTrackIndex(playlist.length);
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] p-2 overflow-hidden justify-between">
      {currentTrack.audioSrc && (
        <audio
          ref={audioRef}
          src={currentTrack.audioSrc}
          onEnded={handleNextTrack}
          onTimeUpdate={(e) => setCurrentTime(Math.floor(e.currentTarget.currentTime))}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleUploadFile}
      />

      {/* Menu Bar */}
      <div className="flex items-center space-x-3 pb-1 border-b border-[#808080] mb-2">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1" onClick={() => fileInputRef.current?.click()}>
          <u>F</u>ile
        </span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>V</u>iew</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>P</u>lay</span>
        <span
          className="cursor-default hover:bg-[#000080] hover:text-white px-1"
          onClick={() => showInfo('Windows Media Player 6.4 for Web Windows 98.', 'About Media Player')}
        >
          <u>H</u>elp
        </span>
      </div>

      {/* Visualizer Display Screen */}
      <div className="win-inset bg-black p-1 flex flex-col items-center justify-between mb-2">
        <div className="flex justify-between w-full text-white text-[10px] px-2 py-0.5 bg-[#1e293b]">
          <span className="truncate font-bold">{currentTrack.title}</span>
          <span className="font-mono">{formatTime(currentTime)} / {formatTime(currentTrack.duration)}</span>
        </div>
        <canvas ref={canvasRef} width={380} height={100} className="w-full h-[100px] my-1" />
      </div>

      {/* Track Seek Progress Bar */}
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="range"
          min="0"
          max={currentTrack.duration}
          value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          className="flex-1 accent-[#000080]"
        />
      </div>

      {/* Media Transport Controls */}
      <div className="flex items-center justify-between bg-[#c0c0c0] win-outset p-1.5 mb-2">
        <div className="flex items-center space-x-1">
          <button className="win-btn h-6 px-2 font-bold" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="win-btn h-6 px-2 font-bold" onClick={handleStop} title="Stop">
            ■
          </button>
          <button className="win-btn h-6 px-2 font-bold" onClick={handlePrevTrack} title="Previous">
            ⏮
          </button>
          <button className="win-btn h-6 px-2 font-bold" onClick={handleNextTrack} title="Next">
            ⏭
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-1.5 px-2">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 accent-[#000080]"
          />
        </div>
      </div>

      {/* Playlist List Box */}
      <div className="win-fieldset p-2 flex-1 flex flex-col">
        <legend className="win-legend">Playlist</legend>
        <div className="win-inset bg-white overflow-y-auto flex-1 p-1 text-[11px]">
          {playlist.map((track, idx) => {
            const isCurrent = idx === currentTrackIndex;
            return (
              <div
                key={track.id}
                className={`px-2 py-1 flex justify-between cursor-default ${
                  isCurrent ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'
                }`}
                onDoubleClick={() => {
                  setCurrentTrackIndex(idx);
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
              >
                <span>{track.title}</span>
                <span className="opacity-80 font-mono text-[10px]">{formatTime(track.duration)}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end pt-1">
          <button className="win-btn px-2 text-[10px]" onClick={() => fileInputRef.current?.click()}>
            + Open Media File...
          </button>
        </div>
      </div>
    </div>
  );
};

