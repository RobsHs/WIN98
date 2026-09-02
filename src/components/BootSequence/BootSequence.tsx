import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';

interface BootSequenceProps {
  onComplete: () => void;
  isRestart?: boolean;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'bios' | 'splash'>('bios');
  const [memoryCount, setMemoryCount] = useState(0);

  // BIOS POST sequence
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const countInterval = setInterval(() => {
      setMemoryCount((prev) => {
        if (prev >= 65536) {
          clearInterval(countInterval);
          return 65536;
        }
        return prev + 8192;
      });
    }, 40);

    timer = setTimeout(() => {
      setStage('splash');
      soundService.playStartup();
    }, 1800);

    return () => {
      clearInterval(countInterval);
      clearTimeout(timer);
    };
  }, []);

  // Splash screen transition to desktop
  useEffect(() => {
    if (stage === 'splash') {
      const splashTimer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(splashTimer);
    }
  }, [stage, onComplete]);

  const handleSkip = () => {
    soundService.playStartup();
    onComplete();
  };

  if (stage === 'bios') {
    return (
      <div className="fixed inset-0 z-[9999999] bg-black text-white font-mono p-6 select-none flex flex-col justify-between text-[13px] leading-relaxed">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-300 font-bold">Award Modular BIOS v4.51PG, An Energy Star Ally</div>
              <div className="text-gray-400 text-[11px]">Copyright (C) 1984-98, Award Software, Inc.</div>
            </div>
            <div className="border border-green-500 text-green-400 p-1 text-[10px] text-center font-bold">
              EPA POLLUTION PREVENTER
            </div>
          </div>

          <div className="space-y-1 text-gray-300">
            <div>PENTIUM-II CPU at 450MHz</div>
            <div>
              Memory Test : <span className="text-white font-bold">{memoryCount}</span> KB OK
            </div>
            <div className="pt-2 text-gray-400">Award Plug and Play BIOS Extension v1.0A</div>
            <div>Detecting IDE Primary Master ... QUANTUM FIREBALL CR 8.4GB</div>
            <div>Detecting IDE Secondary Master ... ATAPI CD-ROM 48X</div>
            <div className="pt-2 text-white font-bold">Starting Windows 98...</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-gray-500 text-[11px]">
          <span>Press &lt;DEL&gt; to enter SETUP</span>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white border border-gray-700 px-2 py-0.5 bg-gray-900 cursor-pointer"
          >
            [ Skip Boot Sequence ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999999] bg-[#008080] flex flex-col items-center justify-center select-none overflow-hidden pattern-clouds">
      {/* Windows 98 Splash Center Box */}
      <div className="win-outset p-6 bg-[#c0c0c0] shadow-2xl flex flex-col items-center max-w-[460px] w-full mx-4">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center my-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <path d="M 4 8 C 8 6 12 11 15 9 L 15 17 C 12 19 8 14 4 16 Z" fill="#ef4444" />
                <path d="M 17 9 C 20 7 24 11 28 8 L 28 16 C 24 19 20 15 17 17 Z" fill="#22c55e" />
                <path d="M 4 18 C 8 16 12 21 15 19 L 15 27 C 12 29 8 24 4 26 Z" fill="#0284c7" />
                <path d="M 17 19 C 20 17 24 21 28 18 L 28 26 C 24 29 20 25 17 27 Z" fill="#eab308" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#000080] tracking-wider uppercase">Microsoft</span>
              <span className="text-[28px] font-black tracking-tight text-[#000080] leading-none font-sans">
                Windows<span className="text-[#eab308] font-light ml-1">98</span>
              </span>
            </div>
          </div>
          <span className="text-[10px] text-gray-600 font-sans tracking-wide">Web Desktop Edition</span>
        </div>

        {/* Animated Moving Progress Bar */}
        <div className="w-full win-inset p-1 bg-black my-4 h-[24px] overflow-hidden relative">
          <div className="win98-progress-blocks absolute inset-y-1 left-0 flex space-x-1 animate-pulse">
            <div className="w-4 h-full bg-[#00ffff]" />
            <div className="w-4 h-full bg-[#00ffff]" />
            <div className="w-4 h-full bg-[#00ffff]" />
          </div>
        </div>

        <div className="flex justify-between w-full items-center pt-2">
          <span className="text-[10px] text-gray-500">Starting up desktop environment...</span>
          <button
            onClick={handleSkip}
            className="win-btn text-[10px] px-3 py-0.5"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

