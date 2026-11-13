/**
 * Production TypeScript Implementation of Minimax with Alpha-Beta Pruning.
 * 
 * Ported faithfully from academic literature & Python reference (src/ai.py & src/game.py):
 * - Finite, two-player, zero-sum game with perfect information (Zermelo's Theorem).
 * - Exact alpha-beta branch-and-bound pruning (beta <= alpha).
 * - Instruments real search metrics: latency, nodes evaluated, branch cutoffs.
 */

import type { Board, Player, WinningState, AIMetrics } from './types.ts';

export const WIN_COMBINATIONS: ReadonlyArray<[number, number, number]> = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Main diagonal
  [2, 4, 6], // Anti-diagonal
];

/**
 * Creates an empty 9-cell board.
 */
export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

/**
 * Evaluates whether any player has achieved a winning line.
 */
export function checkWinningState(board: Board): WinningState {
  for (const [a, b, c] of WIN_COMBINATIONS) {
    const valA = board[a];
    if (valA !== null && valA === board[b] && valA === board[c]) {
      return { winner: valA, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Checks whether the board has reached terminal draw.
 */
export function isDraw(board: Board): boolean {
  const { winner } = checkWinningState(board);
  return winner === null && board.every((cell) => cell !== null);
}

/**
 * Returns available cell indices (0-8) that are currently empty.
 */
export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

interface SearchStats {
  nodesEvaluated: number;
  cutoffsOccurred: number;
}

/**
 * Recursive Minimax algorithm with Alpha-Beta branch-and-bound pruning.
 * Utility values:
 *   +1: X wins (Maximizer)
 *   -1: O wins (Minimizer)
 *    0: Draw
 */
function minimaxRecursive(
  board: Board,
  player: Player,
  alpha: number,
  beta: number,
  stats: SearchStats
): [number, number | null] {
  stats.nodesEvaluated++;

  // 1. Terminal Node Check
  const { winner } = checkWinningState(board);
  if (winner !== null) {
    return [winner === 'X' ? 1 : -1, null];
  }
  if (isDraw(board)) {
    return [0, null];
  }

  const available = getAvailableMoves(board);

  if (player === 'X') {
    // Maximizer
    let bestValue = -Infinity;
    let bestMove: number | null = null;

    for (const move of available) {
      const nextBoard = [...board];
      nextBoard[move] = 'X';

      const [val] = minimaxRecursive(nextBoard, 'O', alpha, beta, stats);

      if (val > bestValue) {
        bestValue = val;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestValue);

      // Beta Cutoff
      if (beta <= alpha) {
        stats.cutoffsOccurred++;
        break;
      }
    }

    return [bestValue, bestMove];
  } else {
    // Minimizer (O)
    let bestValue = Infinity;
    let bestMove: number | null = null;

    for (const move of available) {
      const nextBoard = [...board];
      nextBoard[move] = 'O';

      const [val] = minimaxRecursive(nextBoard, 'X', alpha, beta, stats);

      if (val < bestValue) {
        bestValue = val;
        bestMove = move;
      }
      beta = Math.min(beta, bestValue);

      // Alpha Cutoff
      if (beta <= alpha) {
        stats.cutoffsOccurred++;
        break;
      }
    }

    return [bestValue, bestMove];
  }
}

/**
 * Solves the optimal move for the given player using Minimax + Alpha-Beta Pruning,
 * capturing high-precision diagnostics.
 */
export function findBestMove(
  board: Board,
  player: Player
): { bestMove: number | null; metrics: AIMetrics } {
  const startTime = performance.now();
  const stats: SearchStats = { nodesEvaluated: 0, cutoffsOccurred: 0 };

  const [score, bestMove] = minimaxRecursive(
    board,
    player,
    -Infinity,
    Infinity,
    stats
  );

  const endTime = performance.now();
  const executionTimeMs = parseFloat((endTime - startTime).toFixed(3));

  const metrics: AIMetrics = {
    executionTimeMs,
    nodesEvaluated: stats.nodesEvaluated,
    cutoffsOccurred: stats.cutoffsOccurred,
    score,
    bestMove,
  };

  return { bestMove, metrics };
}

/**
 * Converts a cell index (0-8) into a readable coordinate name.
 */
export function getCellLabel(index: number): { rowName: string; colName: string; position: string } {
  const row = Math.floor(index / 3);
  const col = index % 3;

  const rowNames = ['Top', 'Middle', 'Bottom'];
  const colNames = ['Left', 'Center', 'Right'];

  const rowName = rowNames[row];
  const colName = colNames[col];

  let position = `${rowName}-${colName}`;
  if (row === 1 && col === 1) position = 'Center';

  return { rowName, colName, position };
}
