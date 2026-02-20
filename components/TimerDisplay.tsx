
import React from 'react';

interface TimerDisplayProps {
  elapsedTime: number;
  primaryColor: string;
  secondaryColor: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedTime, primaryColor, secondaryColor }) => {
  const seconds = Math.floor(elapsedTime / 1000);
  const decimals = (elapsedTime % 1000) / 1000;
  const decimalStr = decimals.toFixed(4).substring(2);

  return (
    <div className="flex items-center justify-center font-mono select-none" style={{ '--glow-color': primaryColor } as React.CSSProperties}>
      <div className="text-8xl md:text-9xl font-bold neon-text tabular-nums" style={{ color: primaryColor }}>
        {seconds}
      </div>
      <div className="text-6xl md:text-8xl font-bold mx-2" style={{ color: secondaryColor }}>
        .
      </div>
      <div className="text-6xl md:text-8xl font-bold opacity-80 tabular-nums" style={{ color: primaryColor }}>
        {decimalStr}
      </div>
    </div>
  );
};

export default TimerDisplay;
