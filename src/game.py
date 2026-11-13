"""
Core game engine implementing Tic-Tac-Toe rules and state management.
"""

from typing import List, Optional
from src.utils import WIN_COMBINATIONS, format_board


class TicTacToe:
    """
    Encapsulates Tic-Tac-Toe game state, rule enforcement, and validation.
    
    Representation:
        1: Player X (starts first)
       -1: Player O (second player / AI)
        0: Empty cell
    """
    X = 1
    O = -1
    EMPTY = 0
    WIN_COMBINATIONS = WIN_COMBINATIONS

    def __init__(self):
        # Initialize an empty 3x3 board (9-element list) with X to move first
        self.board: List[int] = [self.EMPTY] * 9
        self.current_player: int = self.X

    def available_moves(self) -> List[int]:
        """Return a list of indices (0-8) corresponding to empty cells."""
        return [i for i, v in enumerate(self.board) if v == self.EMPTY]

    def make_move(self, idx: int) -> None:
        """
        Place the current player's mark at index idx.
        
        Raises:
            IndexError: If idx is outside [0, 8].
            ValueError: If the cell at idx is already occupied.
        """
        if idx < 0 or idx > 8:
            raise IndexError(f"Move index {idx} out of range (must be 0-8)")
        if self.board[idx] != self.EMPTY:
            raise ValueError(f"Cell {idx} is already occupied")

        self.board[idx] = self.current_player
        self.current_player *= -1  # Switch turn (X <-> O)

    def check_winner(self) -> int:
        """
        Check for a winning terminal state.
        
        Returns:
            TicTacToe.X (1) if X wins,
            TicTacToe.O (-1) if O wins,
            TicTacToe.EMPTY (0) if there is no winner.
        """
        for a, b, c in self.WIN_COMBINATIONS:
            if (self.board[a] != self.EMPTY and
                    self.board[a] == self.board[b] == self.board[c]):
                return self.board[a]
        return self.EMPTY

    def is_draw(self) -> bool:
        """
        Determine if the game has ended in a draw (board is full with no winner).
        """
        return (self.check_winner() == self.EMPTY) and all(v != self.EMPTY for v in self.board)

    def is_game_over(self) -> bool:
        """Return True if there is a winner or the game ended in a draw."""
        return self.check_winner() != self.EMPTY or self.is_draw()

    def reset(self) -> None:
        """Reset the board to the initial empty state with X to move."""
        self.board = [self.EMPTY] * 9
        self.current_player = self.X

    def __str__(self) -> str:
        return format_board(self.board)

    def __repr__(self) -> str:
        return f"<TicTacToe board={self.board} turn={self.current_player}>"

