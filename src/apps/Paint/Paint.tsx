import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDialog } from '../../context/DialogContext';
import { soundService } from '../../services/soundService';

interface PaintProps {
  filePath?: string;
  windowId?: string;
}

type ToolType = 'pencil' | 'brush' | 'eraser' | 'fill' | 'line' | 'rect' | 'ellipse' | 'picker' | 'text';

const PALETTE_COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040', '#c08080', '#80c0c0'
];

export const Paint: React.FC<PaintProps> = ({ filePath, windowId }) => {
  const { readFile, createFile, writeFile } = useFileSystem();
  const { setWindowTitle } = useWindowManager();
  const { showInfo, showError } = useDialog();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('pencil');
  const [primaryColor, setPrimaryColor] = useState<string>('#000000');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ffffff');
  const [brushSize, setBrushSize] = useState<number>(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [currentFilePath, setCurrentFilePath] = useState<string | null>(filePath || null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveFileName, setSaveFileName] = useState('untitled.bmp');
  const [saveFolder, setSaveFolder] = useState('C:\\My Documents');

  const canvasWidth = 480;
  const canvasHeight = 320;

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (filePath) {
      const fileData = readFile(filePath);
      if (fileData && fileData.startsWith('data:image')) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          saveState();
        };
        img.src = fileData;
        setCurrentFilePath(filePath);
        if (windowId) setWindowTitle(windowId, `${filePath.split('\\').pop()} - Paint`);
        return;
      }
    }

    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(imgData);
    if (newHist.length > 20) newHist.shift();
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      soundService.playClick();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const prevIdx = historyIndex - 1;
      ctx.putImageData(history[prevIdx], 0, 0);
      setHistoryIndex(prevIdx);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      soundService.playClick();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const nextIdx = historyIndex + 1;
      ctx.putImageData(history[nextIdx], 0, 0);
      setHistoryIndex(nextIdx);
    }
  };

  const handleClear = () => {
    soundService.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  // Canvas Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    setIsDrawing(true);
    setStartPos({ x, y });

    const color = e.button === 2 ? secondaryColor : primaryColor;

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : color;
      ctx.fillStyle = activeTool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = activeTool === 'pencil' ? 1 : activeTool === 'eraser' ? brushSize * 4 : brushSize * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === 'picker') {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      if (e.button === 2) setSecondaryColor(hex);
      else setPrimaryColor(hex);
      soundService.playClick();
      setIsDrawing(false);
    } else if (activeTool === 'fill') {
      floodFill(ctx, x, y, color);
      saveState();
      setIsDrawing(false);
    }
  };

  // Canvas Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    const color = e.buttons === 2 ? secondaryColor : primaryColor;

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = activeTool === 'pencil' ? 1 : activeTool === 'eraser' ? brushSize * 4 : brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === 'line' || activeTool === 'rect' || activeTool === 'ellipse') {
      if (historyIndex >= 0 && history[historyIndex]) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        ctx.strokeRect(
          Math.min(startPos.x, x),
          Math.min(startPos.y, y),
          Math.abs(x - startPos.x),
          Math.abs(y - startPos.y)
        );
      } else if (activeTool === 'ellipse') {
        ctx.beginPath();
        const rx = Math.abs(x - startPos.x) / 2;
        const ry = Math.abs(y - startPos.y) / 2;
        const cx = Math.min(startPos.x, x) + rx;
        const cy = Math.min(startPos.y, y) + ry;
        ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  // Canvas Mouse Up
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPos(null);
      saveState();
    }
  };

  // Simple Flood Fill Algorithm
  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const canvas = ctx.canvas;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const tempDiv = document.createElement('div');
    tempDiv.style.color = fillColor;
    document.body.appendChild(tempDiv);
    const rgb = window.getComputedStyle(tempDiv).color.match(/\d+/g)!.map(Number);
    document.body.removeChild(tempDiv);

    const targetR = rgb[0];
    const targetG = rgb[1];
    const targetB = rgb[2];

    const startIndex = (startY * canvas.width + startX) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];

    if (startR === targetR && startG === targetG && startB === targetB) return;

    const stack: [number, number][] = [[startX, startY]];
    const width = canvas.width;
    const height = canvas.height;

    while (stack.length > 0) {
      const [curX, curY] = stack.pop()!;
      let y1 = curY;
      while (y1 >= 0 && matchColor(y1, curX)) y1--;
      y1++;

      let spanLeft = false;
      let spanRight = false;

      while (y1 < height && matchColor(y1, curX)) {
        setColor(y1, curX);

        if (!spanLeft && curX > 0 && matchColor(y1, curX - 1)) {
          stack.push([curX - 1, y1]);
          spanLeft = true;
        } else if (spanLeft && curX > 0 && !matchColor(y1, curX - 1)) {
          spanLeft = false;
        }

        if (!spanRight && curX < width - 1 && matchColor(y1, curX + 1)) {
          stack.push([curX + 1, y1]);
          spanRight = true;
        } else if (spanRight && curX < width - 1 && !matchColor(y1, curX + 1)) {
          spanRight = false;
        }

        y1++;
      }
    }

    function matchColor(y: number, x: number): boolean {
      const idx = (y * width + x) * 4;
      return data[idx] === startR && data[idx + 1] === startG && data[idx + 2] === startB;
    }

    function setColor(y: number, x: number) {
      const idx = (y * width + x) * 4;
      data[idx] = targetR;
      data[idx + 1] = targetG;
      data[idx + 2] = targetB;
      data[idx + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const handleSaveToVFS = () => {
    soundService.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    if (currentFilePath) {
      writeFile(currentFilePath, dataUrl);
      showInfo('Picture saved successfully.', 'Paint');
    } else {
      setShowSaveModal(true);
    }
  };

  const handleSaveModalSubmit = () => {
    soundService.playClick();
    const canvas = canvasRef.current;
    if (!canvas || !saveFileName.trim()) return;
    const dataUrl = canvas.toDataURL('image/png');

    const node = createFile(saveFolder, saveFileName.trim(), dataUrl, 'bmp');
    if (node) {
      setCurrentFilePath(node.path);
      setShowSaveModal(false);
      showInfo(`Picture saved to ${node.path}`, 'Paint');
    } else {
      showError('Failed to save picture.', 'Paint');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] overflow-hidden">
      {/* Menu Bar */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1" onClick={handleSaveToVFS}><u>F</u>ile</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1" onClick={handleUndo}><u>E</u>dit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1" onClick={handleClear}><u>I</u>mage</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1" onClick={() => showInfo('Paint for Web Windows 98.\nCanvas Drawing Tool.', 'About Paint')}><u>H</u>elp</span>
      </div>

      {/* Main Workspace: Left Tool Box + Center Canvas Frame */}
      <div className="flex-1 flex overflow-hidden p-1">
        {/* Left Tool Box */}
        <div className="w-[56px] win-outset p-1 flex flex-col items-center space-y-1 mr-1 bg-[#c0c0c0]">
          <div className="grid grid-cols-2 gap-1 w-full">
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'pencil' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('pencil')}
              title="Pencil"
            >
              ✏️
            </button>
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'brush' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('brush')}
              title="Brush"
            >
              🖌️
            </button>
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'eraser' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('eraser')}
              title="Eraser"
            >
              🧼
            </button>
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'fill' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('fill')}
              title="Fill With Color"
            >
              🪣
            </button>
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'picker' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('picker')}
              title="Pick Color"
            >
              🧪
            </button>
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'line' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('line')}
              title="Line"
            >
              ／
            </button>
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'rect' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('rect')}
              title="Rectangle"
            >
              ▭
            </button>
            <button
              className={`win-btn p-1 h-[24px] min-w-[24px] ${activeTool === 'ellipse' ? 'pressed bg-[#dfdfdf]' : ''}`}
              onClick={() => setActiveTool('ellipse')}
              title="Ellipse"
            >
              ◯
            </button>
          </div>

          {/* Stroke Width Selector */}
          <div className="w-full win-inset-shallow p-1 mt-2 flex flex-col items-center space-y-1">
            <button
              className={`w-full h-3 flex items-center justify-center hover:bg-gray-300 ${brushSize === 1 ? 'bg-black text-white' : ''}`}
              onClick={() => setBrushSize(1)}
            >
              <div className="w-6 h-[1px] bg-black" />
            </button>
            <button
              className={`w-full h-3 flex items-center justify-center hover:bg-gray-300 ${brushSize === 3 ? 'bg-black text-white' : ''}`}
              onClick={() => setBrushSize(3)}
            >
              <div className="w-6 h-[3px] bg-black" />
            </button>
            <button
              className={`w-full h-3 flex items-center justify-center hover:bg-gray-300 ${brushSize === 6 ? 'bg-black text-white' : ''}`}
              onClick={() => setBrushSize(6)}
            >
              <div className="w-6 h-[6px] bg-black" />
            </button>
          </div>
        </div>

        {/* Center Canvas with classic grey surround */}
        <div className="flex-1 win-inset bg-[#808080] overflow-auto p-3 flex items-start justify-start">
          <div className="bg-white shadow-md">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="cursor-crosshair bg-white"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>

      {/* Bottom Color Palette Bar */}
      <div className="flex items-center space-x-3 p-1.5 border-t border-[#808080] bg-[#c0c0c0]">
        {/* Active Color Preview */}
        <div className="win-inset w-[32px] h-[32px] relative bg-white p-1">
          <div
            className="absolute bottom-1 right-1 w-4 h-4 border border-black"
            style={{ backgroundColor: secondaryColor }}
            title="Secondary Color (Right Click)"
          />
          <div
            className="absolute top-1 left-1 w-4 h-4 border border-black z-10"
            style={{ backgroundColor: primaryColor }}
            title="Primary Color (Left Click)"
          />
        </div>

        {/* Palette Swatches */}
        <div className="grid grid-rows-2 grid-flow-col gap-0.5 win-inset p-0.5 bg-[#dfdfdf]">
          {PALETTE_COLORS.map((col, idx) => (
            <div
              key={idx}
              className="w-4 h-4 cursor-pointer border border-[#808080] hover:scale-105"
              style={{ backgroundColor: col }}
              onClick={() => {
                soundService.playClick();
                setPrimaryColor(col);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                soundService.playClick();
                setSecondaryColor(col);
              }}
            />
          ))}
        </div>

        <div className="flex-1" />

        <button className="win-btn px-2 text-[10px]" onClick={handleUndo} disabled={historyIndex <= 0}>
          Undo
        </button>
        <button className="win-btn px-2 text-[10px]" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
          Redo
        </button>
        <button className="win-btn px-2 text-[10px]" onClick={handleSaveToVFS}>
          Save
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-20">
          <div className="win-outset w-[360px] p-2 bg-[#c0c0c0] shadow-2xl flex flex-col space-y-3">
            <div className="win-titlebar active flex justify-between items-center">
              <span>Save As</span>
              <button className="win-titlebar-btn" onClick={() => setShowSaveModal(false)}>✕</button>
            </div>
            <div className="flex flex-col space-y-2 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="w-16">Save in:</span>
                <select className="win-select flex-1" value={saveFolder} onChange={(e) => setSaveFolder(e.target.value)}>
                  <option value="C:\My Documents">C:\My Documents</option>
                  <option value="C:\Desktop">C:\Desktop</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16">File name:</span>
                <input
                  type="text"
                  autoFocus
                  className="win-input flex-1"
                  value={saveFileName}
                  onChange={(e) => setSaveFileName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveModalSubmit()}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-[#808080]">
              <button className="win-btn font-bold px-4" onClick={handleSaveModalSubmit}>Save</button>
              <button className="win-btn px-4" onClick={() => setShowSaveModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

