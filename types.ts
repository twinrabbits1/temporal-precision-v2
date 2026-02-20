
export enum GameState {
  READY = 'READY',
  RUNNING = 'RUNNING',
  REVIEW = 'REVIEW'
}

export interface Theme {
  id: string;
  name: string;
  primary: string; // Action Button, Timer Glow, Best Score
  secondary: string; // Borders, Quick Select, Separator
}

export interface Attempt {
  id: string;
  targetTime: number;
  stoppedTime: number;
  delta: number;
  timestamp: number;
}

export interface ScoreBoard {
  bestAbsoluteDelta: number | null;
  bestDelta: number | null;
  attempts: Attempt[];
}
