
import React from 'react';
import { QUICK_SELECT_OPTIONS } from '../constants';

interface SettingsProps {
  targetTime: number;
  onTargetChange: (newTarget: number) => void;
  secondaryColor: string;
  disabled: boolean;
}

const Settings: React.FC<SettingsProps> = ({ targetTime, onTargetChange, secondaryColor, disabled }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gray-500 font-bold">
        <span>Target Configuration</span>
        <span className="text-gray-400">Precision Req: 0.0001s</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {QUICK_SELECT_OPTIONS.map((opt) => (
          <button
            key={opt}
            disabled={disabled}
            onClick={() => onTargetChange(opt)}
            className={`py-2 text-sm font-mono border transition-all duration-200 ${
              targetTime === opt 
                ? 'bg-opacity-20 text-white' 
                : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-600'
            }`}
            style={{ 
              borderColor: targetTime === opt ? secondaryColor : undefined,
              color: targetTime === opt ? secondaryColor : undefined,
              backgroundColor: targetTime === opt ? `${secondaryColor}15` : undefined
            }}
          >
            {opt.toFixed(1)}s
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="number"
          step="0.0001"
          min="0.1"
          max="3600"
          disabled={disabled}
          value={targetTime || ''}
          onChange={(e) => onTargetChange(parseFloat(e.target.value))}
          placeholder="Custom Time (s)"
          className="w-full bg-black/50 border-b-2 border-gray-800 py-3 px-4 font-mono text-center focus:outline-none transition-colors"
          style={{ borderColor: disabled ? '#111' : secondaryColor }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase text-gray-600 font-bold pointer-events-none">
          Seconds
        </div>
      </div>
    </div>
  );
};

export default Settings;
