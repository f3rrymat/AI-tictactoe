import { useState, useCallback, useEffect, useRef } from 'react';
import type { Board, Player, MoveRecord, AIMetrics, GameStatus } from '../lib/ai/types.ts';
import {
  createEmptyBoard,
  checkWinningState,
  isDraw as checkIsDraw,
  findBestMove,
  getCellLabel,
} from '../lib/ai/engine.ts';

export interface UseGameStateReturn {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  winningLine: [number, number, number] | null;
  isDraw: boolean;
  isGameOver: boolean;
  isAiThinking: boolean;
  aiMetrics: AIMetrics | null;
  moveHistory: MoveRecord[];
  gameStatus: GameStatus;
  playerSymbol: Player;
  aiSymbol: Player;
  gameMode: 'ai' | 'pvp';
  makeMove: (index: number) => void;
  resetGame: () => void;
  setPlayerSymbol: (symbol: Player) => void;
  setGameMode: (mode: 'ai' | 'pvp') => void;
}

export function useGameState(): UseGameStateReturn {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<[number, number, number] | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [aiMetrics, setAiMetrics] = useState<AIMetrics | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [playerSymbol, setPlayerSymbolState] = useState<Player>('X');
  const [gameMode, setGameModeState] = useState<'ai' | 'pvp'>('ai');

  const aiSymbol: Player = playerSymbol === 'X' ? 'O' : 'X';
  const isGameOver = winner !== null || isDraw;

  // Prevent multiple scheduled AI responses
  const aiTimeoutRef = useRef<number | null>(null);

  // Compute active status
  let gameStatus: GameStatus = 'idle';
  if (winner !== null) {
    gameStatus = winner === playerSymbol ? 'won_player' : 'won_ai';
  } else if (isDraw) {
    gameStatus = 'draw';
  } else if (isAiThinking) {
    gameStatus = 'ai_thinking';
  } else {
    gameStatus = 'player_turn';
  }

  const clearAiTimeout = () => {
    if (aiTimeoutRef.current !== null) {
      window.clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
  };

  /**
   * Resets game state to initial empty board.
   */
  const resetGame = useCallback(() => {
    clearAiTimeout();
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setIsAiThinking(false);
    setAiMetrics(null);
    setMoveHistory([]);
  }, []);

  const setPlayerSymbol = useCallback((symbol: Player) => {
    setPlayerSymbolState(symbol);
    resetGame();
  }, [resetGame]);

  const setGameMode = useCallback((mode: 'ai' | 'pvp') => {
    setGameModeState(mode);
    resetGame();
  }, [resetGame]);

  /**
   * Dispatches the AI move calculation and updates the board.
   */
  const triggerAiMove = useCallback(
    (currentBoard: Board, currentHistory: MoveRecord[]) => {
      setIsAiThinking(true);

      // Micro-delay (180ms) to provide tactile visual rhythm without lagging
      aiTimeoutRef.current = window.setTimeout(() => {
        const { bestMove, metrics } = findBestMove(currentBoard, aiSymbol);

        if (bestMove !== null && currentBoard[bestMove] === null) {
          const nextBoard = [...currentBoard];
          nextBoard[bestMove] = aiSymbol;

          const { rowName, colName, position } = getCellLabel(bestMove);
          const aiRecord: MoveRecord = {
            step: currentHistory.length + 1,
            player: aiSymbol,
            cellIndex: bestMove,
            row: Math.floor(bestMove / 3),
            col: bestMove % 3,
            description: `AI (${aiSymbol}) claimed ${position} (${rowName}, ${colName})`,
            timestamp: Date.now(),
            metrics,
          };

          const newHistory = [...currentHistory, aiRecord];
          const winState = checkWinningState(nextBoard);
          const drawState = checkIsDraw(nextBoard);

          setBoard(nextBoard);
          setMoveHistory(newHistory);
          setAiMetrics(metrics);
          setCurrentPlayer(playerSymbol);
          setIsAiThinking(false);

          if (winState.winner) {
            setWinner(winState.winner);
            setWinningLine(winState.line);
          } else if (drawState) {
            setIsDraw(true);
          }
        } else {
          setIsAiThinking(false);
        }
      }, 180);
    },
    [aiSymbol, playerSymbol]
  );

  /**
   * Main player move handler.
   */
  const makeMove = useCallback(
    (index: number) => {
      // Disallow moves if out of bounds, cell occupied, game over, or AI thinking
      if (index < 0 || index > 8) return;
      if (board[index] !== null || isGameOver || isAiThinking) return;

      const activePlayer = currentPlayer;
      const nextBoard = [...board];
      nextBoard[index] = activePlayer;

      const { rowName, colName, position } = getCellLabel(index);
      const playerRecord: MoveRecord = {
        step: moveHistory.length + 1,
        player: activePlayer,
        cellIndex: index,
        row: Math.floor(index / 3),
        col: index % 3,
        description: `Player (${activePlayer}) claimed ${position} (${rowName}, ${colName})`,
        timestamp: Date.now(),
      };

      const newHistory = [...moveHistory, playerRecord];
      const winState = checkWinningState(nextBoard);
      const drawState = checkIsDraw(nextBoard);

      setBoard(nextBoard);
      setMoveHistory(newHistory);

      if (winState.winner) {
        setWinner(winState.winner);
        setWinningLine(winState.line);
        return;
      }

      if (drawState) {
        setIsDraw(true);
        return;
      }

      // Switch turn
      const nextPlayer: Player = activePlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);

      // Trigger AI if in AI mode and it's AI's turn
      if (gameMode === 'ai' && nextPlayer === aiSymbol) {
        triggerAiMove(nextBoard, newHistory);
      }
    },
    [board, isGameOver, isAiThinking, currentPlayer, moveHistory, gameMode, aiSymbol, triggerAiMove]
  );

  // If AI goes first (Player selected 'O' and board is empty)
  useEffect(() => {
    if (
      gameMode === 'ai' &&
      playerSymbol === 'O' &&
      board.every((c) => c === null) &&
      !isAiThinking
    ) {
      triggerAiMove(board, moveHistory);
    }
  }, [gameMode, playerSymbol, board, isAiThinking, moveHistory, triggerAiMove]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearAiTimeout();
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    winningLine,
    isDraw,
    isGameOver,
    isAiThinking,
    aiMetrics,
    moveHistory,
    gameStatus,
    playerSymbol,
    aiSymbol,
    gameMode,
    makeMove,
    resetGame,
    setPlayerSymbol,
    setGameMode,
  };
}

