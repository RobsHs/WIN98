import React, { useState, useEffect, useCallback } from 'react';
import { useDialog } from '../../context/DialogContext';
import { soundService } from '../../services/soundService';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const NUMBER_COLORS = [
  '',
  '#0000ff', // 1: Blue
  '#008000', // 2: Green
  '#ff0000', // 3: Red
  '#000080', // 4: Dark Blue
  '#800000', // 5: Dark Red
  '#008080', // 6: Teal
  '#000000', // 7: Black
  '#808080', // 8: Gray
];

export const Minesweeper: React.FC = () => {
  const { showInfo } = useDialog();

  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [minesCount, setMinesCount] = useState(10);

  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [timer, setTimer] = useState(0);
  const [flagsRemaining, setFlagsRemaining] = useState(10);
  const [isMouseDownOnTile, setIsMouseDownOnTile] = useState(false);

  // Initialize board
  const initBoard = useCallback(
    (r: number, c: number, m: number) => {
      const newBoard: Cell[][] = [];
      for (let i = 0; i < r; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < c; j++) {
          row.push({
            row: i,
            col: j,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          });
        }
        newBoard.push(row);
      }
      setBoard(newBoard);
      setGameState('idle');
      setTimer(0);
      setFlagsRemaining(m);
    },
    []
  );

  useEffect(() => {
    let r = 9;
    let c = 9;
    let m = 10;
    if (difficulty === 'intermediate') {
      r = 16;
      c = 16;
      m = 40;
    } else if (difficulty === 'expert') {
      r = 16;
      c = 30;
      m = 99;
    }
    setRows(r);
    setCols(c);
    setMinesCount(m);
    initBoard(r, c, m);
  }, [difficulty, initBoard]);

  // Timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer((t) => Math.min(999, t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Place mines ensuring first click is safe
  const populateMines = (startRow: number, startCol: number, currentBoard: Cell[][]) => {
    let placed = 0;
    while (placed < minesCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!currentBoard[r][c].isMine && !(Math.abs(r - startRow) <= 1 && Math.abs(c - startCol) <= 1)) {
        currentBoard[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && currentBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          currentBoard[r][c].neighborMines = count;
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    soundService.playClick();
    const nextBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (gameState === 'idle') {
      populateMines(r, c, nextBoard);
      setGameState('playing');
    }

    if (nextBoard[r][c].isMine) {
      soundService.playCriticalStop();
      revealAllMines(nextBoard);
      setGameState('lost');
      setBoard(nextBoard);
      return;
    }

    revealEmptyCells(r, c, nextBoard);
    setBoard(nextBoard);
    checkWinCondition(nextBoard);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = board[r][c];
    if (cell.isRevealed) return;

    soundService.playClick();
    const nextBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const target = nextBoard[r][c];

    if (target.isFlagged) {
      target.isFlagged = false;
      setFlagsRemaining((f) => f + 1);
    } else if (flagsRemaining > 0) {
      target.isFlagged = true;
      setFlagsRemaining((f) => f - 1);
    }

    setBoard(nextBoard);
  };

  const revealEmptyCells = (startR: number, startC: number, b: Cell[][]) => {
    const queue: [number, number][] = [[startR, startC]];
    b[startR][startC].isRevealed = true;

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      if (b[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !b[nr][nc].isRevealed && !b[nr][nc].isFlagged) {
              b[nr][nc].isRevealed = true;
              if (b[nr][nc].neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  };

  const revealAllMines = (b: Cell[][]) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (b[r][c].isMine) {
          b[r][c].isRevealed = true;
        }
      }
    }
  };

  const checkWinCondition = (b: Cell[][]) => {
    let unrevealedSafeCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!b[r][c].isMine && !b[r][c].isRevealed) {
          unrevealedSafeCount++;
        }
      }
    }
    if (unrevealedSafeCount === 0) {
      soundService.playAsterisk();
      setGameState('won');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] p-2 overflow-auto items-center justify-start">
      {/* Menu Bar */}
      <div className="flex items-center space-x-3 pb-1 border-b border-[#808080] mb-2 w-full">
        <select
          className="win-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
        >
          <option value="beginner">Game: Beginner (9x9)</option>
          <option value="intermediate">Game: Intermediate (16x16)</option>
          <option value="expert">Game: Expert (30x16)</option>
        </select>
        <span
          className="cursor-default hover:bg-[#000080] hover:text-white px-1"
          onClick={() => showInfo('Minesweeper for Windows 98.\nLeft-click to reveal, Right-click to flag mines.', 'About Minesweeper')}
        >
          <u>H</u>elp
        </span>
      </div>

      {/* Main Board Container Frame */}
      <div className="win-outset p-2 bg-[#c0c0c0] shadow-md flex flex-col items-center">
        {/* Top Header: Flag Counter, Smiley, Timer */}
        <div className="win-inset bg-[#dfdfdf] p-1 mb-2 flex items-center justify-between w-full">
          {/* Flag Counter LED */}
          <div className="bg-black text-[#ff0000] font-mono text-[18px] font-bold px-1.5 py-0.5 tracking-widest border border-gray-600">
            {Math.max(0, flagsRemaining).toString().padStart(3, '0')}
          </div>

          {/* Smiley Face Button */}
          <button
            className="win-btn h-7 w-7 p-0 flex items-center justify-center text-[16px]"
            onClick={() => initBoard(rows, cols, minesCount)}
          >
            {gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : isMouseDownOnTile ? '😮' : '🙂'}
          </button>

          {/* Timer LED */}
          <div className="bg-black text-[#ff0000] font-mono text-[18px] font-bold px-1.5 py-0.5 tracking-widest border border-gray-600">
            {timer.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Tiles Grid */}
        <div
          className="win-inset bg-[#808080] p-1 flex flex-col"
          onMouseDown={() => setIsMouseDownOnTile(true)}
          onMouseUp={() => setIsMouseDownOnTile(false)}
        >
          {board.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => {
                return (
                  <div
                    key={cIdx}
                    className={`w-5 h-5 flex items-center justify-center font-bold text-[12px] cursor-default select-none ${
                      cell.isRevealed
                        ? 'border border-[#808080] bg-[#dfdfdf]'
                        : 'win-btn p-0 min-w-[20px] min-h-[20px] bg-[#c0c0c0]'
                    }`}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    onContextMenu={(e) => handleRightClick(e, rIdx, cIdx)}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? (
                        '💣'
                      ) : cell.neighborMines > 0 ? (
                        <span style={{ color: NUMBER_COLORS[cell.neighborMines] }}>
                          {cell.neighborMines}
                        </span>
                      ) : (
                        ''
                      )
                    ) : cell.isFlagged ? (
                      '🚩'
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

