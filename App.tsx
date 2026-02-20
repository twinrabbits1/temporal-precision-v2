
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Theme, Attempt, ScoreBoard } from './types';
import { THEMES, DEFAULT_TARGET_TIME, MAX_HISTORY_ITEMS, CELEBRATION_DURATION } from './constants';
import TimerDisplay from './components/TimerDisplay';
import Settings from './components/Settings';
import History from './components/History';
import CelebrationEffect from './components/CelebrationEffect';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.READY);
  const [targetTime, setTargetTime] = useState<number>(DEFAULT_TARGET_TIME);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard>({
    bestAbsoluteDelta: null,
    bestDelta: null,
    attempts: []
  });
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  const currentTheme = THEMES[themeIndex];
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Precision Loop
  const updateTimer = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    setElapsedTime(elapsed);
    timerRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const handleStart = () => {
    startTimeRef.current = performance.now();
    setElapsedTime(0);
    setGameState(GameState.RUNNING);
    timerRef.current = requestAnimationFrame(updateTimer);
  };

  const handleStop = () => {
    const stopTime = performance.now();
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    
    const finalElapsedTime = stopTime - startTimeRef.current;
    const finalSeconds = finalElapsedTime / 1000;
    const delta = finalSeconds - targetTime;
    const absDelta = Math.abs(delta);

    const newAttempt: Attempt = {
      id: Math.random().toString(36).substring(7),
      targetTime,
      stoppedTime: finalSeconds,
      delta,
      timestamp: Date.now()
    };

    setElapsedTime(finalElapsedTime);
    setGameState(GameState.REVIEW);

    // Update Scores
    setScoreBoard(prev => {
      const isRecord = prev.bestAbsoluteDelta === null || absDelta < prev.bestAbsoluteDelta;
      if (isRecord) {
        setIsNewBest(true);
        setTimeout(() => setIsNewBest(false), CELEBRATION_DURATION);
      }

      return {
        bestAbsoluteDelta: isRecord ? absDelta : prev.bestAbsoluteDelta,
        bestDelta: isRecord ? delta : prev.bestDelta,
        attempts: [newAttempt, ...prev.attempts].slice(0, MAX_HISTORY_ITEMS)
      };
    });

    // Cycle Theme
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  const handleReset = () => {
    setGameState(GameState.READY);
    setElapsedTime(0);
  };

  const handleAction = () => {
    if (gameState === GameState.READY) handleStart();
    else if (gameState === GameState.RUNNING) handleStop();
    else if (gameState === GameState.REVIEW) handleReset();
  };

  // Spacebar support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleAction]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 md:p-12 font-sans relative z-10">
      <CelebrationEffect color={currentTheme.primary} active={isNewBest} />

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-start opacity-70">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase font-mono italic">
            Temporal<span style={{ color: currentTheme.primary }}>Precision</span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] font-bold uppercase text-gray-500 mt-1">
            Blade Runner / V2.5.0
          </p>
        </div>
        <div className="text-right font-mono text-[10px] text-gray-500 uppercase">
          <div>Status: <span style={{ color: currentTheme.secondary }}>System Operational</span></div>
          <div>Clock: {new Date().toLocaleTimeString()}</div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl gap-12 lg:gap-24">
        
        <div className="relative group">
          <div 
            className="absolute -inset-4 bg-white/5 blur-3xl rounded-full opacity-20 pointer-events-none transition-all duration-1000"
            style={{ backgroundColor: currentTheme.primary }}
          ></div>
          <TimerDisplay 
            elapsedTime={elapsedTime} 
            primaryColor={currentTheme.primary} 
            secondaryColor={currentTheme.secondary} 
          />
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-12 items-center justify-center">
          
          <div className="flex-1 flex flex-col items-center gap-8 w-full">
            <Settings 
              targetTime={targetTime} 
              onTargetChange={setTargetTime} 
              secondaryColor={currentTheme.secondary}
              disabled={gameState === GameState.RUNNING}
            />

            <button
              onClick={handleAction}
              className="w-64 h-20 md:w-80 md:h-24 rounded-none skew-x-[-12deg] transition-all duration-150 active:scale-95 group relative overflow-hidden"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="skew-x-[12deg] font-mono font-bold text-2xl md:text-3xl tracking-widest text-black flex items-center justify-center h-full">
                {gameState === GameState.READY && "START"}
                {gameState === GameState.RUNNING && "STOP"}
                {gameState === GameState.REVIEW && "RETRY"}
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/50"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/50"></div>
            </button>
            
            <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest animate-pulse">
              {gameState === GameState.READY && "Press space or click to initiate sequence"}
              {gameState === GameState.RUNNING && "Capture the temporal shift"}
              {gameState === GameState.REVIEW && "Sequence completed. Analyze log below."}
            </p>
          </div>

          <div className="flex-1 w-full flex justify-center h-[300px] lg:h-[400px]">
            <History 
              scoreBoard={scoreBoard} 
              primaryColor={currentTheme.primary} 
              secondaryColor={currentTheme.secondary} 
            />
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full mt-12 pt-6 border-t border-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-6 items-center">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase text-gray-600 font-bold">Theme ID</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: currentTheme.primary }}>{currentTheme.name} // {currentTheme.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase text-gray-600 font-bold">Latency</span>
            <span className="text-[10px] font-mono font-bold text-green-800">0.00ms Nominal</span>
          </div>
        </div>
        <div className="text-[8px] uppercase text-gray-600 tracking-[0.2em] font-bold text-center md:text-right">
          Designate Target. Verify Alignment. Execute Stop.
          <br />
          Ref ID: TP-BR-2049-PRECISION
        </div>
      </footer>
    </div>
  );
};

export default App;
