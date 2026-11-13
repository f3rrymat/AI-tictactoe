import React, { useState } from 'react';
import type { Cell as CellType, Player } from '../lib/ai/types';
import { MarkX, MarkO } from './Marks';
import { cn } from '../lib/utils';

interface CellProps {
  index: number;
  value: CellType;
  isWinning: boolean;
  disabled: boolean;
  currentPlayer: Player;
  onMove: (index: number) => void;
}

export function Cell({
  index,
  value,
  isWinning,
  disabled,
  currentPlayer,
  onMove,
}: CellProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!disabled && value === null) {
      onMove(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && value === null) {
      e.preventDefault();
      onMove(index);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || value !== null}
      aria-label={`Cell ${index + 1}, ${value ? `occupied by ${value}` : 'empty'}`}
      className={cn(
        // Core — fluid square via aspect-ratio, min touch target ≥ 64px on mobile
        "relative flex items-center justify-center rounded-xl border transition-all duration-150 select-none",
        "w-20 h-20 xs:w-22 xs:h-22 sm:w-26 sm:h-26 md:w-28 md:h-28",
        // Default idle state
        "bg-[#121215] border-[#27272a] shadow-sm",
        // Interactive state
        !disabled && value === null && "hover:bg-[#1c1c21] hover:border-[#3f3f46] cursor-pointer active:scale-95",
        // Winning line highlight
        isWinning && "bg-blue-500/10 border-blue-500/50 ring-2 ring-blue-500/30",
        // Disabled non-clickable state
        (disabled || value !== null) && "cursor-default"
      )}
    >
      {/* Real placed mark */}
      {value === 'X' && <MarkX isWinning={isWinning} size={42} />}
      {value === 'O' && <MarkO isWinning={isWinning} size={42} />}

      {/* Subtle ghost preview on hover for empty interactive cells */}
      {value === null && isHovered && !disabled && (
        <div className="opacity-25 transition-opacity">
          {currentPlayer === 'X' ? <MarkX size={36} /> : <MarkO size={36} />}
        </div>
      )}
    </button>
  );
}

