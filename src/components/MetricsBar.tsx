import React from 'react';
import type { AIMetrics } from '../lib/ai/types';
import { Activity, Clock, GitBranch, Scissors, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface MetricsBarProps {
  metrics: AIMetrics | null;
  isThinking: boolean;
}

interface MetricCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

function MetricCell({ icon, label, value, highlight = false }: MetricCellProps): React.JSX.Element {
  return (
    <div className={cn(
      'p-3 rounded-xl border transition-colors',
      highlight
        ? 'bg-blue-500/5 border-blue-500/25'
        : 'bg-[#18181b] border-[#27272a]'
    )}>
      <div className="flex items-center gap-1.5 text-[10px] text-[#71717a] font-mono uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className={cn(
        'text-base font-semibold font-mono mt-1 tracking-tight',
        highlight ? 'text-blue-300' : 'text-[#fafafa]'
      )}>
        {value}
      </div>
    </div>
  );
}

function scoreLabel(score: number): string {
  if (score === 1) return '+1 (X wins)';
  if (score === -1) return '−1 (O wins)';
  return '0 (Draw)';
}

export function MetricsBar({ metrics, isThinking }: MetricsBarProps): React.JSX.Element {
  return (
    <div className="rounded-2xl bg-[#121215] border border-[#27272a] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-zinc-400">
            Engine Telemetry
          </span>
        </div>
        <span className={cn(
          'text-[10px] font-mono px-2 py-0.5 rounded border',
          isThinking
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            : 'bg-zinc-800 border-zinc-700 text-zinc-400'
        )}>
          {isThinking ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> SEARCHING
            </span>
          ) : metrics ? 'SOLVED' : 'READY'}
        </span>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <MetricCell
          icon={<Clock className="h-3 w-3" />}
          label="Latency"
          value={metrics ? `${metrics.executionTimeMs} ms` : '—'}
        />
        <MetricCell
          icon={<GitBranch className="h-3 w-3" />}
          label="Nodes"
          value={metrics ? metrics.nodesEvaluated.toLocaleString() : '—'}
        />
        <MetricCell
          icon={<Scissors className="h-3 w-3" />}
          label="α-β Cutoffs"
          value={metrics ? metrics.cutoffsOccurred.toLocaleString() : '—'}
        />
        <MetricCell
          icon={<TrendingUp className="h-3 w-3" />}
          label="Game Value V"
          value={metrics ? scoreLabel(metrics.score) : '—'}
          highlight
        />
      </div>

      {/* Efficiency note */}
      {metrics && (
        <div className="text-[11px] text-[#71717a] font-mono leading-relaxed pt-1 border-t border-[#1e1e22]">
          Pruning efficiency:{' '}
          <span className="text-zinc-300">
            {metrics.nodesEvaluated > 0
              ? `${((metrics.cutoffsOccurred / metrics.nodesEvaluated) * 100).toFixed(1)}% branches cut`
              : 'n/a'}
          </span>
          {' '}— O(b<sup className="text-[9px]">m/2</sup>) vs O(b<sup className="text-[9px]">m</sup>)
        </div>
      )}
    </div>
  );
}

