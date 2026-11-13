import React from 'react';
import type { Player } from '../lib/ai/types';
import { RotateCcw, Bot, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface ControlBarProps {
  playerSymbol: Player;
  gameMode: 'ai' | 'pvp';
  onReset: () => void;
  onSelectSymbol: (symbol: Player) => void;
  onSelectMode: (mode: 'ai' | 'pvp') => void;
}

export function ControlBar({
  playerSymbol,
  gameMode,
  onReset,
  onSelectSymbol,
  onSelectMode,
}: ControlBarProps): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
      {/* Symbol Selection (Play as X or O) */}
      <div className="inline-flex p-1 rounded-xl bg-[#121215] border border-[#27272a]">
        <button
          type="button"
          onClick={() => onSelectSymbol('X')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            playerSymbol === 'X'
              ? "bg-[#27272a] text-[#fafafa] shadow-sm"
              : "text-[#71717a] hover:text-[#fafafa]"
          )}
        >
          Play as X (1st)
        </button>
        <button
          type="button"
          onClick={() => onSelectSymbol('O')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            playerSymbol === 'O'
              ? "bg-[#27272a] text-[#fafafa] shadow-sm"
              : "text-[#71717a] hover:text-[#fafafa]"
          )}
        >
          Play as O (2nd)
        </button>
      </div>

      {/* Mode Selection (AI vs 2-Player) */}
      <div className="inline-flex p-1 rounded-xl bg-[#121215] border border-[#27272a]">
        <button
          type="button"
          onClick={() => onSelectMode('ai')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            gameMode === 'ai'
              ? "bg-[#27272a] text-[#fafafa] shadow-sm"
              : "text-[#71717a] hover:text-[#fafafa]"
          )}
        >
          <Bot className="h-3 w-3 text-cyan-400" />
          Minimax AI
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('pvp')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            gameMode === 'pvp'
              ? "bg-[#27272a] text-[#fafafa] shadow-sm"
              : "text-[#71717a] hover:text-[#fafafa]"
          )}
        >
          <Users className="h-3 w-3 text-zinc-400" />
          Pass & Play
        </button>
      </div>

      {/* Restart Button */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121215] hover:bg-[#1c1c21] border border-[#27272a] hover:border-[#3f3f46] text-xs font-medium text-[#fafafa] transition-all active:scale-95 cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5 text-[#71717a]" />
        Restart Game
      </button>
    </div>
  );
}

