"""
Unit and smoke tests for UI module integration and state consistency.
"""

from src.game import TicTacToe
from src.ai import get_best_move


def test_ui_game_flow_simulation():
    """
    Simulate the exact game flow executed by the UI:
    1. Human makes a move.
    2. Check win/draw.
    3. AI computes optimal counter-move.
    4. Board updates and state remains consistent.
    """
    game = TicTacToe()
    # Step 1: Human clicks cell 0 (top-left)
    human_move = 0
    game.make_move(human_move)
    assert game.board[human_move] == TicTacToe.X
    assert not game.is_game_over()

    # Step 2: AI (O) computes move
    ai_move = get_best_move(game.board, TicTacToe.O)
    assert ai_move is not None
    assert ai_move != human_move
    assert game.board[ai_move] == TicTacToe.EMPTY

    # Step 3: Apply AI move
    game.make_move(ai_move)
    assert game.board[ai_move] == TicTacToe.O

    # Step 4: Continue until terminal state, verify game concludes properly
    while not game.is_game_over():
        avail = game.available_moves()
        if not avail:
            break
        # Pick the first available move for human
        game.make_move(avail[0])
        if not game.is_game_over():
            ai_counter = get_best_move(game.board, TicTacToe.O)
            if ai_counter is not None:
                game.make_move(ai_counter)

    # Human should NEVER defeat the Minimax AI
    assert game.check_winner() != TicTacToe.X
    assert game.is_game_over()

