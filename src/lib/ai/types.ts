/**
 * Core domain types for Tic-Tac-Toe AI engine and UI state.
 */

export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export interface AIMetrics {
  executionTimeMs: number;
  nodesEvaluated: number;
  cutoffsOccurred: number;
  score: number; // +1 for X win, -1 for O win, 0 for Draw
  bestMove: number | null;
}

export interface WinningState {
  winner: Player | null;
  line: [number, number, number] | null;
}

export interface MoveRecord {
  step: number;
  player: Player;
  cellIndex: number;
  row: number;
  col: number;
  description: string;
  timestamp: number;
  metrics?: AIMetrics;
}

export type GameStatus =
  | 'idle'
  | 'player_turn'
  | 'ai_thinking'
  | 'won_player'
  | 'won_ai'
  | 'draw';

