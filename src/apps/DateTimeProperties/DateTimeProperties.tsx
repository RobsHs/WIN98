import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { soundService } from '../../services/soundService';

interface DateTimePropertiesProps {
  windowId?: string;
}

export const DateTimeProperties: React.FC<DateTimePropertiesProps> = ({ windowId }) => {
  const { closeWindow } = useWindowManager();
  const [activeTab, setActiveTab] = useState<'datetime' | 'timezone'>('datetime');
  const [date, setDate] = useState<Date>(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update analog clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Draw Analog Clock
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 4;

    // Clock Face
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hour Ticks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * (radius - 6), cy + Math.sin(angle) * (radius - 6));
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.lineWidth = i % 3 === 0 ? 2 : 1;
      ctx.stroke();
    }

    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Hour Hand
    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(hourAngle) * (radius * 0.5), cy + Math.sin(hourAngle) * (radius * 0.5));
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Minute Hand
    const minAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(minAngle) * (radius * 0.75), cy + Math.sin(minAngle) * (radius * 0.75));
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Second Hand
    const secAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(secAngle) * (radius * 0.85), cy + Math.sin(secAngle) * (radius * 0.85));
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();

    // Center pin
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
  }, [date]);

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] p-2 overflow-hidden justify-between">
      {/* Tabs */}
      <div className="win-tab-container">
        <button
          className={`win-tab ${activeTab === 'datetime' ? 'active' : ''}`}
          onClick={() => setActiveTab('datetime')}
        >
          Date &amp; Time
        </button>
        <button
          className={`win-tab ${activeTab === 'timezone' ? 'active' : ''}`}
          onClick={() => setActiveTab('timezone')}
        >
          Time Zone
        </button>
      </div>

      {/* Tab Content */}
      <div className="win-tab-content flex-1 p-3 flex flex-col justify-between">
        {activeTab === 'datetime' ? (
          <div className="grid grid-cols-2 gap-3 items-center">
            {/* Calendar Side */}
            <div className="win-fieldset p-2 flex flex-col items-center">
              <legend className="win-legend">Date</legend>
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-[11px]">
                  {date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="win-inset bg-white p-2 w-full text-center text-[10px]">
                <div className="grid grid-cols-7 font-bold text-gray-500 border-b border-gray-300 pb-1 mb-1">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <span
                      key={i}
                      className={`p-0.5 ${i + 1 === date.getDate() ? 'bg-[#000080] text-white font-bold' : ''}`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Analog Clock Side */}
            <div className="win-fieldset p-2 flex flex-col items-center">
              <legend className="win-legend">Time</legend>
              <canvas ref={canvasRef} width={90} height={90} className="my-1" />
              <div className="win-input font-mono text-[12px] font-bold text-center px-2 py-0.5 mt-1">
                {date.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <span className="font-bold">Select system time zone:</span>
            <select className="win-select w-full" defaultValue="auto">
              <option value="auto">(GMT) Coordinated Universal Time / Local System</option>
              <option value="pst">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
              <option value="est">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
              <option value="gmt">(GMT+00:00) London, Dublin, Lisbon</option>
              <option value="cet">(GMT+01:00) Amsterdam, Berlin, Paris, Rome</option>
              <option value="wib">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
              <option value="jst">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
            </select>
            <div className="win-inset bg-white p-2 text-[10px] text-gray-600">
              Automatically adjust clock for daylight saving changes.
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <button
          className="win-btn font-bold px-4"
          onClick={() => {
            soundService.playClick();
            if (windowId) closeWindow(windowId);
          }}
        >
          OK
        </button>
        <button
          className="win-btn px-4"
          onClick={() => {
            soundService.playClick();
            if (windowId) closeWindow(windowId);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

