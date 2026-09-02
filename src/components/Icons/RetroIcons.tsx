import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const RetroIcon: React.FC<IconProps> = ({ name, size = 32, className = '', style }) => {
  const s = size;

  switch (name) {
    case 'my-computer':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* CRT Monitor */}
          <rect x="5" y="3" width="22" height="17" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <rect x="7" y="5" width="18" height="13" fill="#000080" />
          <rect x="9" y="7" width="14" height="9" fill="#008080" />
          <rect x="6" y="4" width="20" height="1" fill="#fff" />
          <rect x="13" y="20" width="6" height="4" fill="#808080" stroke="#000" strokeWidth="1" />
          {/* Base / Case */}
          <rect x="4" y="23" width="24" height="6" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <rect x="4" y="23" width="24" height="1" fill="#fff" />
          {/* Floppy slot & Power LED */}
          <rect x="18" y="25" width="8" height="1.5" fill="#000" />
          <rect x="7" y="25.5" width="2" height="2" fill="#00ff00" />
          <rect x="10" y="25.5" width="2" height="2" fill="#ff0000" />
        </svg>
      );

    case 'drive-c':
    case 'hard-drive':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="4" y="8" width="24" height="16" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <rect x="4" y="8" width="24" height="1" fill="#fff" />
          <rect x="4" y="8" width="1" height="16" fill="#fff" />
          <rect x="7" y="12" width="18" height="4" fill="#808080" />
          <rect x="7" y="12" width="18" height="1" fill="#000" />
          <rect x="7" y="19" width="3" height="2" fill="#00ff00" />
          <rect x="12" y="19" width="13" height="2" fill="#000" />
        </svg>
      );

    case 'floppy':
    case 'drive-a':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="5" y="4" width="22" height="24" fill="#1b263b" stroke="#000" strokeWidth="1" />
          <path d="M 23 4 L 27 8 L 27 28 L 5 28 L 5 4 Z" fill="#2b3b55" />
          {/* Metal shutter */}
          <rect x="9" y="4" width="14" height="10" fill="#c0c0c0" stroke="#808080" strokeWidth="1" />
          <rect x="14" y="6" width="4" height="6" fill="#000" />
          {/* Paper Label */}
          <rect x="8" y="16" width="16" height="10" fill="#fff" stroke="#808080" strokeWidth="1" />
          <rect x="10" y="18" width="12" height="1.5" fill="#ff0000" />
          <rect x="10" y="21" width="12" height="1" fill="#000080" />
          <rect x="10" y="23" width="8" height="1" fill="#000080" />
        </svg>
      );

    case 'recycle-bin-empty':
    case 'recycle-bin':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* Mesh Wastebasket */}
          <polygon points="6,8 26,8 23,28 9,28" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          {/* Cross lines */}
          <line x1="10" y1="8" x2="11" y2="28" stroke="#808080" strokeWidth="1" />
          <line x1="16" y1="8" x2="16" y2="28" stroke="#808080" strokeWidth="1" />
          <line x1="22" y1="8" x2="21" y2="28" stroke="#808080" strokeWidth="1" />
          <line x1="7" y1="14" x2="25" y2="14" stroke="#808080" strokeWidth="1" />
          <line x1="8" y1="20" x2="24" y2="20" stroke="#808080" strokeWidth="1" />
          {/* Rim */}
          <ellipse cx="16" cy="8" rx="11" ry="3" fill="#808080" stroke="#000" strokeWidth="1" />
          <ellipse cx="16" cy="8" rx="9" ry="2" fill="#000" />
          {/* Recycle emblem */}
          <path d="M 14 16 L 18 16 L 16 13 Z" fill="#008000" />
        </svg>
      );

    case 'recycle-bin-full':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <polygon points="6,10 26,10 23,29 9,29" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <line x1="10" y1="10" x2="11" y2="29" stroke="#808080" strokeWidth="1" />
          <line x1="16" y1="10" x2="16" y2="29" stroke="#808080" strokeWidth="1" />
          <line x1="22" y1="10" x2="21" y2="29" stroke="#808080" strokeWidth="1" />
          {/* Papers overflowing */}
          <polygon points="10,3 17,1 19,10 11,9" fill="#ffffff" stroke="#808080" strokeWidth="1" />
          <polygon points="16,4 24,5 22,11 15,10" fill="#ffffd0" stroke="#808080" strokeWidth="1" />
          <polygon points="12,6 15,2 21,4 18,9" fill="#e0e0ff" stroke="#808080" strokeWidth="1" />
          <ellipse cx="16" cy="10" rx="11" ry="3" fill="#808080" stroke="#000" strokeWidth="1" />
        </svg>
      );

    case 'my-documents':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <path d="M 3 8 L 12 8 L 14 10 L 27 10 L 27 26 L 3 26 Z" fill="#e0a93b" stroke="#000" strokeWidth="1" />
          <rect x="7" y="5" width="16" height="18" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <line x1="10" y1="9" x2="20" y2="9" stroke="#000080" strokeWidth="1.5" />
          <line x1="10" y1="12" x2="20" y2="12" stroke="#808080" strokeWidth="1" />
          <line x1="10" y1="15" x2="18" y2="15" stroke="#808080" strokeWidth="1" />
          <line x1="10" y1="18" x2="20" y2="18" stroke="#808080" strokeWidth="1" />
          <polygon points="3,12 29,12 26,26 3,26" fill="#fcd976" stroke="#000" strokeWidth="1" />
        </svg>
      );

    case 'folder':
    case 'directory':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <path d="M 2 7 L 11 7 L 13 10 L 28 10 L 28 26 L 2 26 Z" fill="#f6c342" stroke="#000" strokeWidth="1" />
          <rect x="3" y="10" width="24" height="15" fill="#fde68a" />
          <polygon points="2,12 30,12 28,26 2,26" fill="#fcd34d" stroke="#000" strokeWidth="1" />
          <line x1="2" y1="12" x2="30" y2="12" stroke="#fff" strokeWidth="1" />
        </svg>
      );

    case 'folder-open':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <path d="M 2 7 L 11 7 L 13 10 L 25 10 L 25 24 L 2 24 Z" fill="#d97706" stroke="#000" strokeWidth="1" />
          {/* Inner papers */}
          <rect x="6" y="8" width="16" height="12" fill="#fff" stroke="#808080" strokeWidth="1" />
          <line x1="9" y1="11" x2="18" y2="11" stroke="#000080" strokeWidth="1" />
          <line x1="9" y1="14" x2="16" y2="14" stroke="#808080" strokeWidth="1" />
          {/* Tilted front flap */}
          <polygon points="1,15 25,15 31,27 7,27" fill="#fcd34d" stroke="#000" strokeWidth="1" />
          <line x1="2" y1="15" x2="25" y2="15" stroke="#fff" strokeWidth="1" />
        </svg>
      );

    case 'notepad':
    case 'txt':
    case 'text-document':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* Spiral notepad / Page */}
          <rect x="6" y="3" width="20" height="26" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="6" y="3" width="20" height="5" fill="#000080" />
          {/* Spiral binding rings */}
          <rect x="7" y="2" width="2" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
          <rect x="11" y="2" width="2" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
          <rect x="15" y="2" width="2" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
          <rect x="19" y="2" width="2" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
          <rect x="23" y="2" width="2" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
          {/* Text lines */}
          <line x1="9" y1="12" x2="23" y2="12" stroke="#333" strokeWidth="1.2" />
          <line x1="9" y1="15" x2="23" y2="15" stroke="#666" strokeWidth="1" />
          <line x1="9" y1="18" x2="20" y2="18" stroke="#666" strokeWidth="1" />
          <line x1="9" y1="21" x2="23" y2="21" stroke="#666" strokeWidth="1" />
          <line x1="9" y1="24" x2="17" y2="24" stroke="#666" strokeWidth="1" />
          {/* Pencil */}
          <polygon points="20,27 28,18 30,20 22,29" fill="#facc15" stroke="#000" strokeWidth="0.5" />
          <polygon points="19,28 20,27 22,29" fill="#1e293b" />
        </svg>
      );

    case 'paint':
    case 'bmp':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* Artists Palette */}
          <path
            d="M 16 3 C 23 3 29 8 29 15 C 29 20 25 24 20 24 C 18 24 17 23 16 23 C 15 23 14 24 14 26 C 14 27.5 13 29 11 29 C 6 29 3 23 3 16 C 3 9 9 3 16 3 Z"
            fill="#d4a373"
            stroke="#000"
            strokeWidth="1"
          />
          {/* Color dabs */}
          <circle cx="10" cy="9" r="2.5" fill="#ef4444" />
          <circle cx="16" cy="7" r="2.5" fill="#3b82f6" />
          <circle cx="22" cy="10" r="2.5" fill="#22c55e" />
          <circle cx="25" cy="16" r="2.5" fill="#eab308" />
          <circle cx="20" cy="20" r="2" fill="#a855f7" />
          {/* Thumb hole */}
          <ellipse cx="9" cy="22" rx="3" ry="4" fill="#008080" stroke="#000" strokeWidth="1" />
          {/* Paint brush */}
          <path d="M 28 2 L 18 16 L 20 18 L 30 4 Z" fill="#854d0e" stroke="#000" strokeWidth="0.5" />
          <polygon points="18,16 15,20 17,21 20,18" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
          <polygon points="15,20 12,25 15,24 17,21" fill="#ef4444" />
        </svg>
      );

    case 'calc':
    case 'calculator':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="5" y="3" width="22" height="26" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
          <rect x="5" y="3" width="22" height="1" fill="#fff" />
          <rect x="5" y="3" width="1" height="26" fill="#fff" />
          {/* LCD Display */}
          <rect x="8" y="6" width="16" height="5" fill="#ffffff" stroke="#808080" strokeWidth="1" />
          <rect x="9" y="7" width="14" height="3" fill="#e0f2fe" />
          <text x="21" y="9.5" fontSize="3.5" fontFamily="monospace" fill="#000" textAnchor="end">
            0.
          </text>
          {/* Keypad Grid */}
          <rect x="8" y="13" width="3.5" height="3" fill="#000080" />
          <rect x="12.5" y="13" width="3.5" height="3" fill="#000080" />
          <rect x="17" y="13" width="3.5" height="3" fill="#ef4444" />
          <rect x="21" y="13" width="3" height="3" fill="#ef4444" />

          <rect x="8" y="17" width="3.5" height="3" fill="#3b82f6" />
          <rect x="12.5" y="17" width="3.5" height="3" fill="#3b82f6" />
          <rect x="17" y="17" width="3.5" height="3" fill="#3b82f6" />
          <rect x="21" y="17" width="3" height="3" fill="#808080" />

          <rect x="8" y="21" width="3.5" height="3" fill="#3b82f6" />
          <rect x="12.5" y="21" width="3.5" height="3" fill="#3b82f6" />
          <rect x="17" y="21" width="3.5" height="3" fill="#3b82f6" />
          <rect x="21" y="21" width="3" height="3" fill="#808080" />

          <rect x="8" y="25" width="8" height="3" fill="#3b82f6" />
          <rect x="17" y="25" width="3.5" height="3" fill="#3b82f6" />
          <rect x="21" y="25" width="3" height="3" fill="#808080" />
        </svg>
      );

    case 'cmd':
    case 'msdos':
    case 'command-prompt':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="4" y="5" width="24" height="22" fill="#000000" stroke="#808080" strokeWidth="1" />
          <rect x="4" y="5" width="24" height="4" fill="#000080" />
          <rect x="6" y="6.5" width="8" height="1" fill="#fff" />
          {/* MS-DOS Prompt prompt */}
          <text x="7" y="15" fontSize="5" fontFamily="monospace" fill="#ffffff" fontWeight="bold">
            C:\&gt;
          </text>
          <rect x="19" y="11.5" width="3.5" height="4.5" fill="#ffffff" />
        </svg>
      );

    case 'control-panel':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <path d="M 2 7 L 11 7 L 13 10 L 28 10 L 28 26 L 2 26 Z" fill="#d97706" stroke="#000" strokeWidth="1" />
          <rect x="6" y="9" width="18" height="14" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
          {/* Gears / Sliders */}
          <circle cx="12" cy="16" r="3.5" fill="#475569" stroke="#000" strokeWidth="0.5" />
          <circle cx="12" cy="16" r="1.5" fill="#c0c0c0" />
          <rect x="18" y="13" width="5" height="2" fill="#000080" />
          <rect x="18" y="17" width="5" height="2" fill="#000080" />
          <polygon points="2,14 30,14 28,27 2,27" fill="#fcd34d" stroke="#000" strokeWidth="1" />
        </svg>
      );

    case 'internet-explorer':
    case 'browser':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* Classic IE 'e' with orbital ring */}
          <path
            d="M 2 22 C 8 32 26 28 30 14 C 31 10 27 5 20 5 C 10 5 4 12 4 18 C 4 23 8 27 15 27 C 22 27 26 23 27 19 L 21 19 C 20 21 18 23 15 23 C 10 23 8 19 8 16 L 27 16 C 27.5 12 24 9 19 9 C 12 9 8 13 8 18 C 8 20 9 22 11 23 Z"
            fill="#0284c7"
            stroke="#000"
            strokeWidth="0.5"
          />
          <path
            d="M 3 19 C 7 30 26 29 29 11"
            stroke="#eab308"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 6 12 C 12 3 24 3 29 10"
            stroke="#eab308"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'media-player':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="4" y="5" width="24" height="22" fill="#1e293b" stroke="#000" strokeWidth="1" />
          {/* Display */}
          <rect x="6" y="7" width="20" height="12" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <circle cx="16" cy="13" r="4" fill="#38bdf8" />
          <polygon points="15,11 18,13 15,15" fill="#ffffff" />
          {/* Filmstrip perforations */}
          <rect x="6" y="21" width="3" height="3" fill="#f97316" />
          <rect x="11" y="21" width="3" height="3" fill="#f97316" />
          <rect x="16" y="21" width="3" height="3" fill="#f97316" />
          <rect x="21" y="21" width="3" height="3" fill="#f97316" />
        </svg>
      );

    case 'minesweeper':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* Naval Mine */}
          <circle cx="16" cy="16" r="7" fill="#000000" />
          <rect x="15" y="5" width="2" height="22" fill="#000" />
          <rect x="5" y="15" width="22" height="2" fill="#000" />
          <line x1="8" y1="8" x2="24" y2="24" stroke="#000" strokeWidth="2" />
          <line x1="8" y1="24" x2="24" y2="8" stroke="#000" strokeWidth="2" />
          <circle cx="14" cy="14" r="2" fill="#ffffff" />
          {/* Red Flag on corner */}
          <polygon points="20,4 27,8 20,11" fill="#ef4444" />
          <line x1="20" y1="4" x2="20" y2="15" stroke="#000" strokeWidth="1.5" />
        </svg>
      );

    case 'help':
    case 'windows-help':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* Help Book */}
          <path d="M 6 5 L 26 5 L 26 26 L 6 26 Z" fill="#fef08a" stroke="#000" strokeWidth="1" />
          <path d="M 6 5 L 16 7 L 16 28 L 6 26 Z" fill="#fde047" stroke="#000" strokeWidth="0.5" />
          <path d="M 16 7 L 26 5 L 26 26 L 16 28 Z" fill="#fef08a" stroke="#000" strokeWidth="0.5" />
          {/* Purple question mark */}
          <text x="16" y="21" fontSize="16" fontFamily="sans-serif" fontWeight="bold" fill="#7c3aed" textAnchor="middle">
            ?
          </text>
        </svg>
      );

    case 'run':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="4" y="6" width="24" height="20" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="4" y="6" width="24" height="5" fill="#0284c7" />
          <polygon points="10,15 22,20 10,25" fill="#16a34a" stroke="#000" strokeWidth="0.5" />
        </svg>
      );

    case 'find':
    case 'search':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="5" y="4" width="16" height="20" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="#808080" strokeWidth="1" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="#808080" strokeWidth="1" />
          {/* Magnifying Glass */}
          <circle cx="19" cy="18" r="6" fill="#e0f2fe" stroke="#000" strokeWidth="1.5" />
          <line x1="24" y1="23" x2="29" y2="28" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'display':
    case 'display-properties':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="4" y="4" width="24" height="18" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <rect x="6" y="6" width="20" height="14" fill="#000080" />
          <rect x="13" y="22" width="6" height="4" fill="#808080" stroke="#000" strokeWidth="1" />
          <rect x="8" y="26" width="16" height="3" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          {/* Window in screen */}
          <rect x="8" y="8" width="10" height="8" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
          <rect x="8" y="8" width="10" height="2" fill="#000080" />
        </svg>
      );

    case 'sound':
    case 'speaker':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <polygon points="5,11 10,11 16,6 16,26 10,21 5,21" fill="#facc15" stroke="#000" strokeWidth="1" />
          {/* Sound waves */}
          <path d="M 19 11 C 21 13 21 19 19 21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 23 8 C 26 12 26 20 23 24" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'date-time':
    case 'clock':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="4" y="6" width="24" height="22" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="4" y="6" width="24" height="6" fill="#ef4444" stroke="#000" strokeWidth="1" />
          <circle cx="16" cy="19" r="6" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <line x1="16" y1="19" x2="16" y2="15" stroke="#000" strokeWidth="1.5" />
          <line x1="16" y1="19" x2="19" y2="19" stroke="#000" strokeWidth="1.5" />
        </svg>
      );

    case 'shut-down':
    case 'shutdown':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <circle cx="16" cy="16" r="12" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <path d="M 11 11 C 9 13 9 19 12 22 C 15 25 20 24 22 21 C 24 18 23 13 20 11" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <line x1="16" y1="7" x2="16" y2="15" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'log-off':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <circle cx="11" cy="12" r="5" fill="#facc15" stroke="#000" strokeWidth="1" />
          <path d="M 16 12 L 27 12 L 27 16 L 24 16 L 24 19 L 21 19 L 21 16 L 16 16 Z" fill="#facc15" stroke="#000" strokeWidth="1" />
          <circle cx="11" cy="12" r="2" fill="#ffffff" />
        </svg>
      );

    case 'win98-logo':
    case 'windows':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          {/* Windows 4-color wavy flag */}
          <path d="M 4 8 C 8 6 12 11 15 9 L 15 17 C 12 19 8 14 4 16 Z" fill="#ef4444" />
          <path d="M 17 9 C 20 7 24 11 28 8 L 28 16 C 24 19 20 15 17 17 Z" fill="#22c55e" />
          <path d="M 4 18 C 8 16 12 21 15 19 L 15 27 C 12 29 8 24 4 26 Z" fill="#0284c7" />
          <path d="M 17 19 C 20 17 24 21 28 18 L 28 26 C 24 29 20 25 17 27 Z" fill="#eab308" />
        </svg>
      );

    case 'msg-error':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <circle cx="16" cy="16" r="14" fill="#ef4444" stroke="#000" strokeWidth="1" />
          <line x1="10" y1="10" x2="22" y2="22" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="22" y1="10" x2="10" y2="22" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'msg-warning':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <polygon points="16,3 30,28 2,28" fill="#facc15" stroke="#000" strokeWidth="1" />
          <line x1="16" y1="11" x2="16" y2="20" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="24" r="1.5" fill="#000000" />
        </svg>
      );

    case 'msg-info':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <circle cx="16" cy="16" r="14" fill="#0284c7" stroke="#000" strokeWidth="1" />
          <circle cx="16" cy="9" r="2" fill="#ffffff" />
          <rect x="14.5" y="13" width="3" height="10" fill="#ffffff" />
          <rect x="12" y="13" width="3" height="2" fill="#ffffff" />
          <rect x="12" y="21" width="8" height="2" fill="#ffffff" />
        </svg>
      );

    case 'msg-question':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <circle cx="16" cy="16" r="14" fill="#000080" stroke="#000" strokeWidth="1" />
          <text x="16" y="22" fontSize="20" fontFamily="sans-serif" fontWeight="bold" fill="#ffffff" textAnchor="middle">
            ?
          </text>
        </svg>
      );

    case 'system-info':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="4" y="4" width="24" height="24" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <circle cx="16" cy="14" r="6" fill="#0284c7" />
          <text x="16" y="18" fontSize="10" fontFamily="sans-serif" fontWeight="bold" fill="#fff" textAnchor="middle">
            i
          </text>
          <line x1="8" y1="23" x2="24" y2="23" stroke="#000080" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} style={style}>
          <rect x="6" y="4" width="20" height="24" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="8" y="6" width="16" height="4" fill="#000080" />
          <line x1="9" y1="14" x2="23" y2="14" stroke="#808080" strokeWidth="1" />
          <line x1="9" y1="18" x2="23" y2="18" stroke="#808080" strokeWidth="1" />
          <line x1="9" y1="22" x2="19" y2="22" stroke="#808080" strokeWidth="1" />
        </svg>
      );
  }
};

