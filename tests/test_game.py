"""
Unit tests for core game engine logic (src/game.py).
"""

import pytest
from src.game import TicTacToe


def test_initial_state():
    """Verify clean initialization of the game board."""
    game = TicTacToe()
    assert game.board == [TicTacToe.EMPTY] * 9
    assert game.current_player == TicTacToe.X
    assert len(game.available_moves()) == 9
    assert not game.is_game_over()
    assert not game.is_draw()
    assert game.check_winner() == TicTacToe.EMPTY


def test_valid_moves_and_turn_alternation():
    """Verify that moves update the board and alternate turns properly."""
    game = TicTacToe()
    game.make_move(0)  # X moves at index 0
    assert game.board[0] == TicTacToe.X
    assert game.current_player == TicTacToe.O
    assert 0 not in game.available_moves()
    assert len(game.available_moves()) == 8

    game.make_move(4)  # O moves at center (4)
    assert game.board[4] == TicTacToe.O
    assert game.current_player == TicTacToe.X


def test_invalid_move_out_of_bounds():
    """Verify IndexError is raised when index is out of bounds."""
    game = TicTacToe()
    with pytest.raises(IndexError):
        game.make_move(-1)
    with pytest.raises(IndexError):
        game.make_move(9)


def test_invalid_move_occupied_cell():
    """Verify ValueError is raised when trying to play in an occupied cell."""
    game = TicTacToe()
    game.make_move(0)
    with pytest.raises(ValueError):
        game.make_move(0)


def test_row_win_conditions():
    """Verify row win detection for Player X."""
    game = TicTacToe()
    # Row 0: 0, 1, 2
    game.board = [
        TicTacToe.X, TicTacToe.X, TicTacToe.X,
        TicTacToe.O, TicTacToe.O, TicTacToe.EMPTY,
        TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY
    ]
    assert game.check_winner() == TicTacToe.X
    assert game.is_game_over()
    assert not game.is_draw()


def test_column_win_conditions():
    """Verify column win detection for Player O."""
    game = TicTacToe()
    # Column 1: 1, 4, 7
    game.board = [
        TicTacToe.X, TicTacToe.O, TicTacToe.X,
        TicTacToe.X, TicTacToe.O, TicTacToe.EMPTY,
        TicTacToe.EMPTY, TicTacToe.O, TicTacToe.EMPTY
    ]
    assert game.check_winner() == TicTacToe.O
    assert game.is_game_over()
    assert not game.is_draw()


def test_diagonal_win_conditions():
    """Verify diagonal win detection."""
    game = TicTacToe()
    # Anti-diagonal: 2, 4, 6
    game.board = [
        TicTacToe.O, TicTacToe.EMPTY, TicTacToe.X,
        TicTacToe.EMPTY, TicTacToe.X, TicTacToe.O,
        TicTacToe.X, TicTacToe.EMPTY, TicTacToe.EMPTY
    ]
    assert game.check_winner() == TicTacToe.X
    assert game.is_game_over()


def test_draw_condition():
    """Verify draw detection when board is full with no winner."""
    game = TicTacToe()
    # Standard Cat's game (Draw)
    # X O X
    # X O O
    # O X X
    game.board = [
        TicTacToe.X, TicTacToe.O, TicTacToe.X,
        TicTacToe.X, TicTacToe.O, TicTacToe.O,
        TicTacToe.O, TicTacToe.X, TicTacToe.X
    ]
    assert game.check_winner() == TicTacToe.EMPTY
    assert game.is_draw()
    assert game.is_game_over()


def test_reset():
    """Verify reset clears board and restores Player X turn."""
    game = TicTacToe()
    game.make_move(0)
    game.make_move(4)
    game.reset()
    assert game.board == [TicTacToe.EMPTY] * 9
    assert game.current_player == TicTacToe.X
    assert len(game.available_moves()) == 9

