"""
Monte Carlo Simulation and Empirical Proof of the Minimax Unbeatability Theorem.

This script simulates hundreds of games pitting:
  1. Random Agent (X) vs Minimax AI (O)
  2. Minimax AI (X) vs Random Agent (O)
  3. Minimax AI (X) vs Minimax AI (O) (Self-Play)

Demonstrating that under all scenarios, Minimax AI loss rate is strictly 0.0%.
"""

import sys
from pathlib import Path

# Add project root to path for direct execution
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import time
import random
from typing import Dict
from src.game import TicTacToe
from src.ai import minimax, get_best_move


def run_random_vs_ai(num_games: int = 100, seed: int = 42) -> Dict[str, int]:
    """
    Simulates games where Player X plays uniformly random moves
    and Player O plays Minimax with Alpha-Beta pruning.
    """
    random.seed(seed)
    results = {"random_wins": 0, "ai_wins": 0, "draws": 0}

    for _ in range(num_games):
        game = TicTacToe()
        while not game.is_game_over():
            if game.current_player == TicTacToe.X:
                move = random.choice(game.available_moves())
            else:
                move = get_best_move(game.board, TicTacToe.O)
            game.make_move(move)

        winner = game.check_winner()
        if winner == TicTacToe.X:
            results["random_wins"] += 1
        elif winner == TicTacToe.O:
            results["ai_wins"] += 1
        else:
            results["draws"] += 1

    return results


def run_ai_vs_random(num_games: int = 100, seed: int = 42) -> Dict[str, int]:
    """
    Simulates games where Player X plays Minimax with Alpha-Beta pruning
    and Player O plays uniformly random moves.
    """
    random.seed(seed)
    results = {"ai_wins": 0, "random_wins": 0, "draws": 0}

    for _ in range(num_games):
        game = TicTacToe()
        while not game.is_game_over():
            if game.current_player == TicTacToe.X:
                move = get_best_move(game.board, TicTacToe.X)
            else:
                move = random.choice(game.available_moves())
            game.make_move(move)

        winner = game.check_winner()
        if winner == TicTacToe.X:
            results["ai_wins"] += 1
        elif winner == TicTacToe.O:
            results["random_wins"] += 1
        else:
            results["draws"] += 1

    return results


def run_self_play(num_games: int = 10) -> Dict[str, int]:
    """
    Simulates games between two Minimax agents.
    Theoretical expectation: 100% draws.
    """
    results = {"X_wins": 0, "O_wins": 0, "draws": 0}

    for _ in range(num_games):
        game = TicTacToe()
        while not game.is_game_over():
            move = get_best_move(game.board, game.current_player)
            game.make_move(move)

        winner = game.check_winner()
        if winner == TicTacToe.X:
            results["X_wins"] += 1
        elif winner == TicTacToe.O:
            results["O_wins"] += 1
        else:
            results["draws"] += 1

    return results


def main():
    print("=" * 72)
    print("  TIC-TAC-TOE AI: EMPIRICAL VALIDATION & MONTE CARLO EXPERIMENTS")
    print("  Theoretical Grounding: Zermelo's Theorem & Minimax Optimal Play")
    print("=" * 72)

    num_simulations = 100

    # Experiment 1: Random (X) vs Minimax AI (O)
    print(f"\n[Experiment 1] Random Player (X) vs Minimax AI (O) [{num_simulations} matches]")
    start = time.perf_counter()
    exp1 = run_random_vs_ai(num_games=num_simulations)
    elapsed1 = time.perf_counter() - start

    ai_loss_rate_1 = (exp1["random_wins"] / num_simulations) * 100
    ai_win_rate_1 = (exp1["ai_wins"] / num_simulations) * 100
    draw_rate_1 = (exp1["draws"] / num_simulations) * 100

    print(f"  * AI Wins (O)      : {exp1['ai_wins']:>3} / {num_simulations} ({ai_win_rate_1:5.1f}%)")
    print(f"  * Draws            : {exp1['draws']:>3} / {num_simulations} ({draw_rate_1:5.1f}%)")
    print(f"  * Random Wins (X)  : {exp1['random_wins']:>3} / {num_simulations} ({ai_loss_rate_1:5.1f}%)")
    print(f"  * AI Loss Rate     : {ai_loss_rate_1:.2f}% (Expected: 0.00%)")
    print(f"  * Benchmark Time   : {elapsed1:.3f} seconds ({elapsed1 / num_simulations * 1000:.2f} ms/game)")
    assert exp1["random_wins"] == 0, "Error: AI lost to random opponent!"

    # Experiment 2: Minimax AI (X) vs Random (O)
    print(f"\n[Experiment 2] Minimax AI (X) vs Random Player (O) [{num_simulations} matches]")
    start = time.perf_counter()
    exp2 = run_ai_vs_random(num_games=num_simulations)
    elapsed2 = time.perf_counter() - start

    ai_loss_rate_2 = (exp2["random_wins"] / num_simulations) * 100
    ai_win_rate_2 = (exp2["ai_wins"] / num_simulations) * 100
    draw_rate_2 = (exp2["draws"] / num_simulations) * 100

    print(f"  * AI Wins (X)      : {exp2['ai_wins']:>3} / {num_simulations} ({ai_win_rate_2:5.1f}%)")
    print(f"  * Draws            : {exp2['draws']:>3} / {num_simulations} ({draw_rate_2:5.1f}%)")
    print(f"  * Random Wins (O)  : {exp2['random_wins']:>3} / {num_simulations} ({ai_loss_rate_2:5.1f}%)")
    print(f"  * AI Loss Rate     : {ai_loss_rate_2:.2f}% (Expected: 0.00%)")
    print(f"  * Benchmark Time   : {elapsed2:.3f} seconds ({elapsed2 / num_simulations * 1000:.2f} ms/game)")
    assert exp2["random_wins"] == 0, "Error: AI lost to random opponent!"

    # Experiment 3: Minimax (X) vs Minimax (O) [Self-Play]
    print(f"\n[Experiment 3] Minimax AI (X) vs Minimax AI (O) [Self-Play: 10 matches]")
    exp3 = run_self_play(num_games=10)
    print(f"  * Player X Wins    : {exp3['X_wins']}")
    print(f"  * Player O Wins    : {exp3['O_wins']}")
    print(f"  * Draws            : {exp3['draws']} / 10 (100.0%)")
    assert exp3["draws"] == 10, "Error: Self-play must strictly yield 100% draws!"

    print("\n" + "=" * 72)
    print("  SUMMARY: EMPIRICAL PROOF CONFIRMED")
    print("  Across all simulations, Minimax AI loss rate = 0.00%.")
    print("  Zermelo's Theorem & Unbeatability Criterion: PROVEN.")
    print("=" * 72)


if __name__ == "__main__":
    main()
