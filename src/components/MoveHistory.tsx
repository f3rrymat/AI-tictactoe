import React from 'react';
import type { MoveRecord } from '../lib/ai/types';
import { Bot, User, ListOrdered } from 'lucide-react';
import { cn } from '../lib/utils';

interface MoveHistoryProps {
  history: MoveRecord[];
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

export function MoveHistory({ history }: MoveHistoryProps): React.JSX.Element {
  return (
    <div className="rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-semibold tracking-wider text-zinc-400">
            Move Audit Trail
          </span>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
          {history.length} / 9 moves
        </span>
      </div>

      {/* Timeline */}
      <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-1">
        {history.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-[#71717a]">No moves yet — click a cell to start.</p>
          </div>
        ) : (
          history.map((record) => {
            const isAI = record.metrics !== undefined;
            return (
              <div
                key={record.step}
                className={cn(
                  'flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors',
                  isAI ? 'bg-cyan-950/20 hover:bg-cyan-950/30' : 'bg-[#18181b] hover:bg-[#1c1c21]'
                )}
              >
                {/* Step number */}
                <span className="font-mono text-[11px] text-[#71717a] w-5 pt-0.5 shrink-0">
                  {record.step}.
                </span>

                {/* Actor badge */}
                <div className={cn(
                  'shrink-0 h-5 w-5 rounded-md flex items-center justify-center',
                  isAI ? 'bg-cyan-500/15 text-cyan-400' : 'bg-rose-500/15 text-rose-400'
                )}>
                  {isAI
                    ? <Bot className="h-3 w-3" />
                    : <User className="h-3 w-3" />
                  }
                </div>

                {/* Move description */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#e4e4e7] leading-tight truncate">
                    {record.description}
                  </p>
                  {record.metrics && (
                    <p className="text-[10px] text-[#71717a] font-mono mt-0.5">
                      {record.metrics.nodesEvaluated.toLocaleString()} nodes · {record.metrics.executionTimeMs}ms · {record.metrics.cutoffsOccurred} cuts
                    </p>
                  )}
                </div>

                {/* Timestamp */}
                <span className="font-mono text-[10px] text-[#52525b] shrink-0 pt-0.5">
                  {formatTime(record.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

