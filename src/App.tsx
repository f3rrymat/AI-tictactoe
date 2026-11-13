import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { ControlBar } from './components/ControlBar';
import { MetricsBar } from './components/MetricsBar';
import { MoveHistory } from './components/MoveHistory';
import { ArchitecturePanel } from './components/ArchitecturePanel';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function App(): React.JSX.Element {
  const {
    board,
    currentPlayer,
    winningLine,
    isGameOver,
    isAiThinking,
    gameStatus,
    playerSymbol,
    aiSymbol,
    gameMode,
    aiMetrics,
    moveHistory,
    makeMove,
    resetGame,
    setPlayerSymbol,
    setGameMode,
  } = useGameState();

  // On mobile: telemetry panels are collapsed by default for clean initial view
  const [telemetryOpen, setTelemetryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col antialiased selection:bg-blue-500/20 selection:text-blue-300">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">

        {/* ── Desktop: Two-column grid. Mobile: Single stack ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column — Board & Controls */}
          <div className="lg:col-span-7 flex flex-col items-center gap-5">
            <GameStatus
              status={gameStatus}
              currentPlayer={currentPlayer}
              playerSymbol={playerSymbol}
              aiSymbol={aiSymbol}
              isAiThinking={isAiThinking}
            />

            <GameBoard
              board={board}
              winningLine={winningLine}
              disabled={isGameOver || isAiThinking}
              currentPlayer={currentPlayer}
              onMove={makeMove}
            />

            <ControlBar
              playerSymbol={playerSymbol}
              gameMode={gameMode}
              onReset={resetGame}
              onSelectSymbol={setPlayerSymbol}
              onSelectMode={setGameMode}
            />

            {/* Mobile-only toggle for telemetry panels */}
            <button
              type="button"
              onClick={() => setTelemetryOpen((p) => !p)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all w-full max-w-md justify-center"
            >
              {telemetryOpen ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  Hide Engine Telemetry & Theory
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  Show Engine Telemetry & Theory
                </>
              )}
            </button>
          </div>

          {/* Right Column — Telemetry Panels */}
          {/* Always visible on lg+; toggled on mobile */}
          <div className={`lg:col-span-5 space-y-5 ${telemetryOpen ? 'block' : 'hidden'} lg:block`}>
            <MetricsBar metrics={aiMetrics} isThinking={isAiThinking} />
            <MoveHistory history={moveHistory} />
            <ArchitecturePanel />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e22] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#52525b]">
          <span>Tic-Tac-Toe AI · Minimax with Alpha-Beta Pruning · Zermelo's Theorem (1913)</span>
          <span className="font-mono">Python Engine + React 19 · TypeScript · Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
