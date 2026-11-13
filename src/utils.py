"""
Utility constants and helper functions for Tic-Tac-Toe.
"""

PLAYER_X = 1
PLAYER_O = -1
EMPTY = 0

SYMBOL_MAP = {
    PLAYER_X: "X",
    PLAYER_O: "O",
    EMPTY: " "
}

WIN_COMBINATIONS = [
    (0, 1, 2),  # Top row
    (3, 4, 5),  # Middle row
    (6, 7, 8),  # Bottom row
    (0, 3, 6),  # Left column
    (1, 4, 7),  # Middle column
    (2, 5, 8),  # Right column
    (0, 4, 8),  # Main diagonal
    (2, 4, 6)   # Anti-diagonal
]


def format_board(board):
    """
    Format a 9-element list into a readable 3x3 text grid.
    """
    chars = [SYMBOL_MAP.get(cell, " ") for cell in board]
    lines = [
        f" {chars[0]} | {chars[1]} | {chars[2]} ",
        "---+---+---",
        f" {chars[3]} | {chars[4]} | {chars[5]} ",
        "---+---+---",
        f" {chars[6]} | {chars[7]} | {chars[8]} "
    ]
    return "\n".join(lines)

