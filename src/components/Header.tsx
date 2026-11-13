import React from 'react';
import { Cpu, ExternalLink, ShieldCheck } from 'lucide-react';

export function Header(): React.JSX.Element {
  return (
    <header className="w-full border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm">
            <Cpu className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-[#fafafa]">Tic-Tac-Toe AI</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3" />
                Unbeatable Engine
              </span>
            </div>
            <p className="text-[11px] text-[#71717a] hidden xs:block">
              Adversarial Search · Minimax with Alpha-Beta Pruning
            </p>
          </div>
        </div>

        {/* External Links & Metadata */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Atharv-2314/Tic-Tac-Toe-AI-An-Intelligent-Game-Agent-Using-Minimax-and-Alpha-Beta-Pruning"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] hover:bg-[#1c1c21] border border-[#27272a] hover:border-[#3f3f46] text-xs font-medium text-zinc-300 transition-all hover:text-white"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden sm:inline">GitHub Repository</span>
            <ExternalLink className="h-3 w-3 text-zinc-500" />
          </a>
        </div>
      </div>
    </header>
  );
}

