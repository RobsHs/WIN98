import React from 'react';
import { useDialog } from '../../context/DialogContext';
import type { MessageBoxOptions } from '../../context/DialogContext';
import { RetroIcon } from '../Icons/RetroIcons';
import { soundService } from '../../services/soundService';

export const MessageBoxContainer: React.FC = () => {
  const { messageBoxes, closeMessageBox } = useDialog();

  if (messageBoxes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-20 pointer-events-auto select-none">
      {messageBoxes.map((msg) => (
        <MessageBoxItem key={msg.id} msg={msg} onClose={() => closeMessageBox(msg.id)} />
      ))}
    </div>
  );
};

const MessageBoxItem: React.FC<{ msg: MessageBoxOptions; onClose: () => void }> = ({ msg, onClose }) => {
  let iconName = 'msg-info';
  if (msg.type === 'error') iconName = 'msg-error';
  else if (msg.type === 'warning') iconName = 'msg-warning';
  else if (msg.type === 'question') iconName = 'msg-question';

  const handleOk = () => {
    soundService.playClick();
    if (msg.onOk) msg.onOk();
    onClose();
  };

  const handleCancel = () => {
    soundService.playClick();
    if (msg.onCancel) msg.onCancel();
    onClose();
  };

  const handleYes = () => {
    soundService.playClick();
    if (msg.onYes) msg.onYes();
    onClose();
  };

  const handleNo = () => {
    soundService.playClick();
    if (msg.onNo) msg.onNo();
    onClose();
  };

  return (
    <div className="win-outset min-w-[320px] max-w-[440px] p-1 bg-[#c0c0c0] shadow-2xl flex flex-col text-[11px] m-4">
      {/* Title bar */}
      <div className="win-titlebar active flex items-center justify-between mb-2">
        <span className="font-bold">{msg.title}</span>
        <button className="win-titlebar-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex items-start space-x-3">
        <RetroIcon name={iconName} size={32} className="flex-shrink-0" />
        <div className="flex-1 text-[11px] leading-relaxed whitespace-pre-wrap select-text">
          {msg.message}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-3 p-2 border-t border-[#808080]">
        {msg.buttons === 'yes-no' ? (
          <>
            <button className="win-btn font-bold px-5" onClick={handleYes} autoFocus>
              Yes
            </button>
            <button className="win-btn px-5" onClick={handleNo}>
              No
            </button>
          </>
        ) : msg.buttons === 'ok-cancel' ? (
          <>
            <button className="win-btn font-bold px-5" onClick={handleOk} autoFocus>
              OK
            </button>
            <button className="win-btn px-5" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="win-btn font-bold px-6" onClick={handleOk} autoFocus>
            OK
          </button>
        )}
      </div>
    </div>
  );
};

