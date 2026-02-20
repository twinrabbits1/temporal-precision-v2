
import React from 'react';
import { Attempt, ScoreBoard } from '../types';

interface HistoryProps {
  scoreBoard: ScoreBoard;
  primaryColor: string;
  secondaryColor: string;
}

const History: React.FC<HistoryProps> = ({ scoreBoard, primaryColor, secondaryColor }) => {
  const { attempts, bestDelta } = scoreBoard;

  const formatDelta = (delta: number) => {
    const sign = delta >= 0 ? '+' : '';
    return `${sign}${delta.toFixed(4)}s`;
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">System Log</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-gray-600">Session Best:</span>
          <span className="font-mono text-sm font-bold neon-text" style={{ '--glow-color': primaryColor, color: primaryColor } as any}>
            {bestDelta !== null ? formatDelta(bestDelta) : '---'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {attempts.length === 0 ? (
          <div className="p-10 text-center text-gray-700 font-mono text-sm uppercase tracking-tighter">
            No data recorded
          </div>
        ) : (
          <table className="w-full text-left font-mono text-[10px] md:text-xs">
            <thead className="bg-black/40 text-gray-500 uppercase sticky top-0">
              <tr>
                <th className="px-4 py-2 font-normal">Target</th>
                <th className="px-4 py-2 font-normal text-right">Stopped</th>
                <th className="px-4 py-2 font-normal text-right">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-3 text-gray-400">{attempt.targetTime.toFixed(4)}s</td>
                  <td className="px-4 py-3 text-right text-gray-300">{attempt.stoppedTime.toFixed(4)}s</td>
                  <td className={`px-4 py-3 text-right font-bold transition-all ${Math.abs(attempt.delta) < 0.05 ? 'scale-110' : ''}`}
                      style={{ color: Math.abs(attempt.delta) < 0.05 ? secondaryColor : (attempt.delta < 0 ? '#ef4444' : '#3b82f6') }}>
                    {formatDelta(attempt.delta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;
