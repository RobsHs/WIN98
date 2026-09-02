import React, { useState, useEffect } from 'react';
import { useDialog } from '../../context/DialogContext';
import { soundService } from '../../services/soundService';

export const Calculator: React.FC = () => {
  const { showInfo } = useDialog();

  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    soundService.playClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    soundService.playClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    soundService.playClick();
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleClearEntry = () => {
    soundService.playClick();
    setDisplay('0');
  };

  const handleBackspace = () => {
    soundService.playClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    soundService.playClick();
    const val = parseFloat(display);
    setDisplay((val * -1).toString());
  };

  const handleSqrt = () => {
    soundService.playClick();
    const val = parseFloat(display);
    if (val < 0) {
      setDisplay('Invalid input');
    } else {
      setDisplay(Math.sqrt(val).toString());
    }
    setWaitingForOperand(true);
  };

  const handlePercent = () => {
    soundService.playClick();
    const val = parseFloat(display);
    if (previousValue !== null) {
      setDisplay(((previousValue * val) / 100).toString());
    } else {
      setDisplay((val / 100).toString());
    }
  };

  const handleInverse = () => {
    soundService.playClick();
    const val = parseFloat(display);
    if (val === 0) {
      setDisplay('Cannot divide by zero');
    } else {
      setDisplay((1 / val).toString());
    }
    setWaitingForOperand(true);
  };

  const handleOperation = (op: string) => {
    soundService.playClick();
    const currentVal = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentVal);
    } else if (operation) {
      const result = calculate(previousValue, currentVal, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(op);
  };

  const handleEquals = () => {
    soundService.playClick();
    const currentVal = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, currentVal, operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  // Memory Handlers
  const handleMemoryClear = () => {
    soundService.playClick();
    setMemory(0);
    setHasMemory(false);
  };

  const handleMemoryRecall = () => {
    soundService.playClick();
    setDisplay(memory.toString());
    setWaitingForOperand(true);
  };

  const handleMemoryStore = () => {
    soundService.playClick();
    setMemory(parseFloat(display));
    setHasMemory(true);
  };

  const handleMemoryAdd = () => {
    soundService.playClick();
    setMemory(memory + parseFloat(display));
    setHasMemory(true);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] p-2 overflow-hidden">
      {/* Menu Bar */}
      <div className="flex items-center space-x-3 pb-1 border-b border-[#808080] mb-2">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>E</u>dit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>V</u>iew</span>
        <span
          className="cursor-default hover:bg-[#000080] hover:text-white px-1"
          onClick={() => showInfo('Calculator for Web Windows 98.\nStandard arithmetic calculator.', 'About Calculator')}
        >
          <u>H</u>elp
        </span>
      </div>

      {/* LCD Display */}
      <div className="win-inset bg-white p-1 text-right mb-2 font-mono text-[16px] overflow-hidden whitespace-nowrap">
        {display}
      </div>

      {/* Top controls: Memory Flag + Clear Buttons */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="win-inset-shallow w-6 h-6 flex items-center justify-center font-bold text-[#000080]">
          {hasMemory ? 'M' : ''}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-1">
          <button className="win-btn h-6 px-1 text-[10px] text-[#ef4444] font-bold" onClick={handleBackspace}>
            Backspace
          </button>
          <button className="win-btn h-6 px-1 text-[10px] text-[#ef4444] font-bold" onClick={handleClearEntry}>
            CE
          </button>
          <button className="win-btn h-6 px-1 text-[10px] text-[#ef4444] font-bold" onClick={handleClear}>
            C
          </button>
        </div>
      </div>

      {/* Main Buttons Grid */}
      <div className="grid grid-cols-5 gap-1.5 flex-1">
        {/* Row 1 */}
        <button className="win-btn font-bold text-[#ef4444]" onClick={handleMemoryClear}>MC</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('7')}>7</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('8')}>8</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('9')}>9</button>
        <button className="win-btn font-bold text-[#ef4444]" onClick={() => handleOperation('/')}>/</button>

        {/* Row 2 */}
        <button className="win-btn font-bold text-[#ef4444]" onClick={handleMemoryRecall}>MR</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('4')}>4</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('5')}>5</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('6')}>6</button>
        <button className="win-btn font-bold text-[#ef4444]" onClick={() => handleOperation('*')}>*</button>

        {/* Row 3 */}
        <button className="win-btn font-bold text-[#ef4444]" onClick={handleMemoryStore}>MS</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('1')}>1</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('2')}>2</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('3')}>3</button>
        <button className="win-btn font-bold text-[#ef4444]" onClick={() => handleOperation('-')}>-</button>

        {/* Row 4 */}
        <button className="win-btn font-bold text-[#ef4444]" onClick={handleMemoryAdd}>M+</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={() => handleDigit('0')}>0</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={handleToggleSign}>+/-</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={handleDecimal}>.</button>
        <button className="win-btn font-bold text-[#ef4444]" onClick={() => handleOperation('+')}>+</button>
      </div>

      {/* Bottom Equal Button */}
      <div className="grid grid-cols-4 gap-1.5 mt-1.5">
        <button className="win-btn font-bold text-[#0000ff]" onClick={handleSqrt}>sqrt</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={handlePercent}>%</button>
        <button className="win-btn font-bold text-[#0000ff]" onClick={handleInverse}>1/x</button>
        <button className="win-btn font-bold text-[#ef4444] bg-[#dfdfdf]" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
};

