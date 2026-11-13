import React from 'react';
import type { Board, Player } from '../lib/ai/types';
import { Cell } from './Cell';

interface GameBoardProps {
  board: Board;
  winningLine: [number, number, number] | null;
  disabled: boolean;
  currentPlayer: Player;
  onMove: (index: number) => void;
}

export function GameBoard({
  board,
  winningLine,
  disabled,
  currentPlayer,
  onMove,
}: GameBoardProps): React.JSX.Element {
  const isWinningCell = (index: number): boolean => {
    return winningLine !== null && winningLine.includes(index);
  };

  return (
    <div className="relative inline-block p-4 sm:p-5 rounded-2xl bg-[#0e0e11] border border-[#27272a] shadow-xl">
      <div
        className="grid grid-cols-3 gap-3 sm:gap-3.5"
        role="grid"
        aria-label="Tic-Tac-Toe Game Board"
      >
        {board.map((cellValue, idx) => (
          <Cell
            key={`cell_${idx}`}
            index={idx}
            value={cellValue}
            isWinning={isWinningCell(idx)}
            disabled={disabled}
            currentPlayer={currentPlayer}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}

