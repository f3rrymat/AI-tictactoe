import React from 'react';
import type { GameStatus as GameStatusType, Player } from '../lib/ai/types';
import { Bot, User, Award, Equal, Loader2 } from 'lucide-react';

interface GameStatusProps {
  status: GameStatusType;
  currentPlayer: Player;
  playerSymbol: Player;
  aiSymbol: Player;
  isAiThinking: boolean;
}

export function GameStatus({
  status,
  playerSymbol,
  aiSymbol,
  isAiThinking,
}: GameStatusProps): React.JSX.Element {
  if (status === 'won_ai') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-sm font-medium animate-in fade-in duration-200 w-full max-w-md">
        <Bot className="h-4 w-4 text-cyan-400 shrink-0" />
        <span>AI ({aiSymbol}) Won — Unbeatable Minimax Solution</span>
      </div>
    );
  }

  if (status === 'won_player') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm font-medium animate-in fade-in duration-200 w-full max-w-md">
        <Award className="h-4 w-4 text-rose-400 shrink-0" />
        <span>Player ({playerSymbol}) Won — Exceptional Play</span>
      </div>
    );
  }

  if (status === 'draw') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-sm font-medium animate-in fade-in duration-200 w-full max-w-md">
        <Equal className="h-4 w-4 text-blue-400 shrink-0" />
        <span className="leading-snug">Forced Draw — Zermelo's Theorem (1913)</span>
      </div>
    );
  }

  if (isAiThinking) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-medium w-full max-w-md">
        <Loader2 className="h-4 w-4 text-cyan-400 animate-spin shrink-0" />
        <span>AI ({aiSymbol}) evaluating game tree with α-β pruning…</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-zinc-300 text-sm font-medium w-full max-w-md">
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <User className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <span>Your Turn ({playerSymbol}) — Click any empty cell</span>
    </div>
  );
}
