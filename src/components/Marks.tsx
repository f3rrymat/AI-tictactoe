import React from 'react';
import { cn } from '../lib/utils';

interface MarkProps {
  className?: string;
  size?: number;
  isWinning?: boolean;
}

/**
 * Geometric, high-precision SVG Cross (Player X).
 */
export function MarkX({ className, size = 48, isWinning = false }: MarkProps): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-transform duration-200 ease-out",
        isWinning ? "text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]" : "text-rose-500",
        className
      )}
    >
      <path
        d="M12 12L36 36"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 12L12 36"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Geometric, high-precision SVG Ring (AI O).
 */
export function MarkO({ className, size = 48, isWinning = false }: MarkProps): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-transform duration-200 ease-out",
        isWinning ? "text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "text-cyan-400",
        className
      )}
    >
      <circle
        cx="24"
        cy="24"
        r="14"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

