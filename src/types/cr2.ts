export type GamePhase = "idle" | "running" | "dead" | "won";
export type Difficulty = "easy" | "medium" | "hard" | "hardcore";
export type CellType = "empty" | "barrier" | "car" | "truck" | "bus" | "manhole" | "firetruck";

export interface GridCell {
  lane: number;   // row index, 0 = bottom start, increases upward
  col: number;    // column 0,1,2
  type: CellType;
  color?: string; // vehicle color
  mult?: number;  // multiplier label shown on manhole/obstacle
}

export interface Particle {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string;
  life: number; maxLife: number;
}

export interface DiffConfig {
  lanes: number;
  hitBase: number;
  step: number;
  label: string;
}

export interface RoundRecord {
  mult: number;
  won: boolean;
  lanes: number;
  payout: number;
  bet: number;
}

export interface GameState {
  phase: GamePhase;
  lane: number;         // current lane chicken is on
  totalLanes: number;
  bet: number;
  mult: number;
  balance: number;
  diff: Difficulty;
  wins: number;
  losses: number;
  pnl: number;
  history: RoundRecord[];
}