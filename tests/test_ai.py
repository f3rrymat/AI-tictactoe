"""
Unit tests for Minimax adversarial search and Alpha-Beta pruning (src/ai.py).
"""

import pytest
from src.game import TicTacToe
from src.ai import minimax, get_best_move


def test_initial_position():
    """
    Theoretical guarantee: From an empty board, optimal play by both sides
    strictly yields a draw (Utility = 0).
    """
    val, move = minimax([TicTacToe.EMPTY] * 9, TicTacToe.X)
    assert val == 0
    assert move in range(9)


def test_empty_board_minimizer():
    """Verify O playing on empty board also yields draw valuation."""
    val, move = minimax([TicTacToe.EMPTY] * 9, TicTacToe.O)
    assert val == 0
    assert move in range(9)


def test_immediate_win_detection_x():
    """
    Maximizer (X) must identify and seize an immediate winning move.
    Board:
    X | X | .
    O | O | .
    . | . | .
    """
    board = [
        TicTacToe.X, TicTacToe.X, TicTacToe.EMPTY,
        TicTacToe.O, TicTacToe.O, TicTacToe.EMPTY,
        TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY
    ]
    val, move = minimax(board, TicTacToe.X)
    assert move == 2
    assert val == 1


def test_immediate_win_detection_o():
    """
    Minimizer (O) must identify and seize an immediate winning move.
    Board:
    X | X | .
    O | O | .
    X | . | .
    """
    board = [
        TicTacToe.X, TicTacToe.X, TicTacToe.EMPTY,
        TicTacToe.O, TicTacToe.O, TicTacToe.EMPTY,
        TicTacToe.X, TicTacToe.EMPTY, TicTacToe.EMPTY
    ]
    val, move = minimax(board, TicTacToe.O)
    assert move == 5
    assert val == -1


def test_forcing_block():
    """
    Test that O blocks X's winning threat.
    Board:
    X | X | .
    O | . | O
    . | . | .
    X's threat is at index 2. If it's X's turn, X plays 2 to win.
    """
    board = [
        TicTacToe.X, TicTacToe.X, TicTacToe.EMPTY,
        TicTacToe.O, TicTacToe.EMPTY, TicTacToe.O,
        TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY
    ]
    val, move = minimax(board, TicTacToe.X)
    assert move == 2


def test_defensive_block_by_o():
    """
    O must block X when X has two in a row and it is O's turn.
    Board:
    X | X | .
    . | O | .
    . | . | .
    """
    board = [
        TicTacToe.X, TicTacToe.X, TicTacToe.EMPTY,
        TicTacToe.EMPTY, TicTacToe.O, TicTacToe.EMPTY,
        TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY
    ]
    val, move = minimax(board, TicTacToe.O)
    assert move == 2


def test_convenience_wrapper():
    """Verify get_best_move returns the correct index."""
    board = [
        TicTacToe.X, TicTacToe.X, TicTacToe.EMPTY,
        TicTacToe.O, TicTacToe.O, TicTacToe.EMPTY,
        TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY
    ]
    assert get_best_move(board, TicTacToe.X) == 2


def test_ai_vs_ai_guaranteed_draw():
    """
    Mathematical validation of Zermelo's theorem:
    Self-play between two optimal Minimax agents must invariably result in a draw.
    """
    game = TicTacToe()
    while not game.is_game_over():
        move = get_best_move(game.board, game.current_player)
        assert move is not None
        game.make_move(move)

    assert game.check_winner() == TicTacToe.EMPTY
    assert game.is_draw() is True

