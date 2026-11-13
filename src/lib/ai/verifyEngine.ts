/**
 * Engine verification script testing algorithmic correctness in TypeScript.
 */

import {
  createEmptyBoard,
  checkWinningState,
  isDraw,
  findBestMove,
} from './engine.ts';
import type { Board } from './types.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('--- RUNNING TYPESCRIPT MINIMAX & ALPHA-BETA VERIFICATION ---');

// 1. Initial Empty Board Test (Draw Equilibrium, V=0)
const emptyBoard = createEmptyBoard();
const rootCheck = findBestMove(emptyBoard, 'X');
console.log(`[Test 1] Empty Board Root Evaluation: Score = ${rootCheck.metrics.score}, Move = ${rootCheck.bestMove}`);
console.log(`         Nodes Evaluated: ${rootCheck.metrics.nodesEvaluated}, Cutoffs: ${rootCheck.metrics.cutoffsOccurred}, Latency: ${rootCheck.metrics.executionTimeMs}ms`);
assert(rootCheck.metrics.score === 0, 'Empty board must have minimax value 0');
assert(rootCheck.bestMove !== null && rootCheck.bestMove >= 0 && rootCheck.bestMove < 9, 'Valid move required');

// 2. Immediate Win Detection for X
// X | X | .
// O | O | .
// . | . | .
const xWinBoard: Board = [
  'X', 'X', null,
  'O', 'O', null,
  null, null, null,
];
const xWin = findBestMove(xWinBoard, 'X');
console.log(`[Test 2] X Immediate Win: Move = ${xWin.bestMove}, Score = ${xWin.metrics.score}`);
assert(xWin.bestMove === 2, 'X must take index 2 to win immediately');
assert(xWin.metrics.score === 1, 'Winning score must be +1');

// 3. Immediate Win Detection for O
// X | X | .
// O | O | .
// X | . | .
const oWinBoard: Board = [
  'X', 'X', null,
  'O', 'O', null,
  'X', null, null,
];
const oWin = findBestMove(oWinBoard, 'O');
console.log(`[Test 3] O Immediate Win: Move = ${oWin.bestMove}, Score = ${oWin.metrics.score}`);
assert(oWin.bestMove === 5, 'O must take index 5 to win immediately');
assert(oWin.metrics.score === -1, 'Winning score for O must be -1');

// 4. Defensive Block by O
// X | X | .
// . | O | .
// . | . | .
const oBlockBoard: Board = [
  'X', 'X', null,
  null, 'O', null,
  null, null, null,
];
const oBlock = findBestMove(oBlockBoard, 'O');
console.log(`[Test 4] O Defensive Block: Move = ${oBlock.bestMove}, Score = ${oBlock.metrics.score}`);
assert(oBlock.bestMove === 2, 'O must block index 2 to prevent X win');

// 5. Self-Play Validation (Zermelo's Theorem: 100% Draws)
let simBoard = createEmptyBoard();
let currentPlayer: 'X' | 'O' = 'X';
let moves = 0;

while (checkWinningState(simBoard).winner === null && !isDraw(simBoard) && moves < 9) {
  const result = findBestMove(simBoard, currentPlayer);
  assert(result.bestMove !== null, 'Optimal move must exist');
  simBoard[result.bestMove!] = currentPlayer;
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  moves++;
}

const finalWinner = checkWinningState(simBoard).winner;
const finalDraw = isDraw(simBoard);
console.log(`[Test 5] Self-Play Result: Winner = ${finalWinner}, IsDraw = ${finalDraw}, Total Moves = ${moves}`);
assert(finalWinner === null, 'Self-play must have no winner');
assert(finalDraw === true, 'Self-play must strictly terminate in a draw');

console.log('--- ALL TYPESCRIPT MINIMAX & ALPHA-BETA TESTS PASSED SUCCESSFULLY! ---');
