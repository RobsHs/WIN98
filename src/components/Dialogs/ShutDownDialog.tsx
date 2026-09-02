import React, { useState } from 'react';
import { useDialog } from '../../context/DialogContext';
import { RetroIcon } from '../Icons/RetroIcons';
import { soundService } from '../../services/soundService';

interface ShutDownDialogProps {
  onShutDown: () => void;
  onRestart: () => void;
  onDosMode: () => void;
  onStandBy: () => void;
}

export const ShutDownDialog: React.FC<ShutDownDialogProps> = ({
  onShutDown,
  onRestart,
  onDosMode,
  onStandBy,
}) => {
  const { isShutDownDialogOpen, closeShutDownDialog } = useDialog();
  const [selectedOption, setSelectedOption] = useState<'shutdown' | 'restart' | 'dos' | 'standby'>('shutdown');

  if (!isShutDownDialogOpen) return null;

  const handleConfirm = () => {
    soundService.playClick();
    closeShutDownDialog();
    if (selectedOption === 'shutdown') {
      soundService.playShutdown();
      onShutDown();
    } else if (selectedOption === 'restart') {
      onRestart();
    } else if (selectedOption === 'dos') {
      onDosMode();
    } else if (selectedOption === 'standby') {
      onStandBy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-20 select-none"
      onClick={closeShutDownDialog}
    >
      <div
        className="win-outset w-[350px] p-1 bg-[#c0c0c0] shadow-2xl flex flex-col text-[11px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="win-titlebar active flex items-center justify-between mb-2">
          <span className="font-bold">Shut Down Windows</span>
          <button className="win-titlebar-btn" onClick={closeShutDownDialog}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col space-y-3">
          <div className="flex items-start space-x-3">
            <RetroIcon name="shut-down" size={36} className="flex-shrink-0" />
            <div className="flex flex-col space-y-2">
              <span className="font-bold">What do you want the computer to do?</span>

              <div className="flex flex-col space-y-1.5 pl-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown-option"
                    checked={selectedOption === 'shutdown'}
                    onChange={() => setSelectedOption('shutdown')}
                  />
                  <span><u>S</u>hut down</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown-option"
                    checked={selectedOption === 'restart'}
                    onChange={() => setSelectedOption('restart')}
                  />
                  <span><u>R</u>estart</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown-option"
                    checked={selectedOption === 'dos'}
                    onChange={() => setSelectedOption('dos')}
                  />
                  <span>Restart in <u>M</u>S-DOS mode</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown-option"
                    checked={selectedOption === 'standby'}
                    onChange={() => setSelectedOption('standby')}
                  />
                  <span>Stan<u>d</u> by</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-[#808080]">
            <button className="win-btn font-bold px-4" onClick={handleConfirm} autoFocus>
              OK
            </button>
            <button className="win-btn px-4" onClick={closeShutDownDialog}>
              Cancel
            </button>
            <button
              className="win-btn px-3"
              onClick={() => {
                alert('Windows 98 Help: To turn off your computer safely, select Shut down and click OK.');
              }}
            >
              Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

