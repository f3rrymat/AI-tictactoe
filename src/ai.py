"""
Adversarial search engine implementing Minimax with Alpha-Beta pruning.
"""

import math
from typing import List, Tuple, Optional
from src.game import TicTacToe


def minimax(
    board: List[int],
    player: int,
    alpha: float = -math.inf,
    beta: float = math.inf
) -> Tuple[int, Optional[int]]:
    """
    Perform Minimax search with Alpha-Beta pruning on the given board state.

    Args:
        board: 9-element list (0=empty, 1=X, -1=O).
        player: TicTacToe.X (1) or TicTacToe.O (-1) indicating whose turn it is.
        alpha: Maximizer's best guaranteed value on the search path.
        beta: Minimizer's best guaranteed value on the search path.

    Returns:
        Tuple of (utility_value, best_move), where utility_value is in {-1, 0, 1}.
    """
    game = TicTacToe()
    game.board = board.copy()
    winner = game.check_winner()

    # Terminal node evaluation
    if winner != TicTacToe.EMPTY or game.is_draw():
        if winner == TicTacToe.X:
            return (1, None)
        elif winner == TicTacToe.O:
            return (-1, None)
        else:
            return (0, None)

    available = game.available_moves()

    if player == TicTacToe.X:
        # Maximizer
        best_value = -math.inf
        best_move = None
        for move in available:
            new_board = board.copy()
            new_board[move] = player
            val, _ = minimax(new_board, TicTacToe.O, alpha, beta)
            if val > best_value:
                best_value = val
                best_move = move
            alpha = max(alpha, best_value)
            if beta <= alpha:
                break  # Beta cutoff
        return (int(best_value), best_move)
    else:
        # Minimizer
        best_value = math.inf
        best_move = None
        for move in available:
            new_board = board.copy()
            new_board[move] = player
            val, _ = minimax(new_board, TicTacToe.X, alpha, beta)
            if val < best_value:
                best_value = val
                best_move = move
            beta = min(beta, best_value)
            if beta <= alpha:
                break  # Alpha cutoff
        return (int(best_value), best_move)


def get_best_move(board: List[int], player: int) -> Optional[int]:
    """
    Convenience wrapper to retrieve solely the optimal move index for a player.
    """
    _, best_move = minimax(board, player)
    return best_move

