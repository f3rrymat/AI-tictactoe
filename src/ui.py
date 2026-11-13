"""
Interactive Web Application for Tic-Tac-Toe AI using Streamlit.
"""

import sys
from pathlib import Path

# Ensure package root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import streamlit as st
from src.game import TicTacToe
from src.ai import get_best_move
from src.utils import SYMBOL_MAP

# ---------------------------------------------------------
# Page Configuration & Theming
# ---------------------------------------------------------
st.set_page_config(
    page_title="Tic-Tac-Toe AI | Minimax with Alpha-Beta Pruning",
    page_icon="🎮",
    layout="centered",
    initial_sidebar_state="expanded"
)

# Custom CSS for polished, responsive game board buttons
st.markdown("""
<style>
    .main-title {
        text-align: center;
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
    }
    .subtitle {
        text-align: center;
        color: #6c757d;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
    }
    div[data-testid="column"] {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    div[data-testid="column"] button {
        width: 100px !important;
        height: 100px !important;
        font-size: 2.5rem !important;
        font-weight: 700 !important;
        border-radius: 12px !important;
        margin: 4px !important;
        transition: all 0.2s ease-in-out !important;
    }
    div[data-testid="column"] button:hover {
        transform: scale(1.03);
    }
    .status-container {
        margin-top: 1.5rem;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Session State Initialization
# ---------------------------------------------------------
if "game" not in st.session_state:
    st.session_state.game = TicTacToe()

if "move_history" not in st.session_state:
    st.session_state.move_history = []

game: TicTacToe = st.session_state.game

# ---------------------------------------------------------
# Sidebar: Theory, Metrics & Controls
# ---------------------------------------------------------
with st.sidebar:
    st.header("🧠 AI Architecture")
    st.markdown("""
    **Core Algorithm:**
    - **Minimax Decision Rule** with **Alpha-Beta ($\alpha$-$\beta$) Pruning**.
    - Search cuts branch evaluation from $O(b^m)$ to $O(b^{m/2})$.
    - **Guaranteed Outcome:** AI never loses (0% empirical loss rate).
    """)
    st.divider()

    st.subheader("📊 Live State Metrics")
    empty_cells = len(game.available_moves())
    st.metric(label="Empty Cells Remaining", value=f"{empty_cells} / 9")
    st.metric(label="Moves Played", value=9 - empty_cells)
    
    current_turn_str = "Player (X)" if game.current_player == TicTacToe.X else "AI (O)"
    st.metric(label="Turn", value=current_turn_str if not game.is_game_over() else "Terminal")

    st.divider()
    st.subheader("⚙️ Controls")
    if st.button("🔄 Reset Game", use_container_width=True, type="primary"):
        game.reset()
        st.session_state.move_history = []
        st.rerun()

# ---------------------------------------------------------
# Main UI Layout
# ---------------------------------------------------------
st.markdown('<div class="main-title">🎮 Tic-Tac-Toe AI</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="subtitle">Adversarial Search with Minimax & Alpha-Beta Pruning | Player (X) vs AI (O)</div>',
    unsafe_allow_html=True
)

# Render 3x3 Grid
for row in range(3):
    cols = st.columns(3)
    for col in range(3):
        idx = 3 * row + col
        cell_value = game.board[idx]
        cell_label = SYMBOL_MAP.get(cell_value, " ")

        # Visual button key
        button_clicked = cols[col].button(
            label=cell_label,
            key=f"cell_{idx}",
            disabled=game.is_game_over() or cell_value != TicTacToe.EMPTY
        )

        # Handle Human Move
        if button_clicked and not game.is_game_over() and cell_value == TicTacToe.EMPTY:
            # 1. Human (X) Move
            game.make_move(idx)
            st.session_state.move_history.append(f"Player (X) -> Cell {idx}")

            # 2. AI (O) Move (if game is still ongoing)
            if not game.is_game_over():
                ai_move = get_best_move(game.board, TicTacToe.O)
                if ai_move is not None:
                    game.make_move(ai_move)
                    st.session_state.move_history.append(f"AI (O) -> Cell {ai_move}")

            st.rerun()

# ---------------------------------------------------------
# Game Status Banner
# ---------------------------------------------------------
st.markdown('<div class="status-container">', unsafe_allow_html=True)
winner = game.check_winner()

if winner == TicTacToe.X:
    st.success("🎉 **Player X Wins!** (Exceptional Play)")
elif winner == TicTacToe.O:
    st.error("🤖 **AI (O) Wins!** The Minimax algorithm found the optimal sequence.")
elif game.is_draw():
    st.info("🤝 **It's a draw!** Perfect play achieved (Consistent with Zermelo's Theorem).")
else:
    st.caption("Click any empty cell to make your move as Player (X). AI will counter instantly.")
st.markdown('</div>', unsafe_allow_html=True)

# ---------------------------------------------------------
# Move History Expander
# ---------------------------------------------------------
if st.session_state.move_history:
    with st.expander("📜 Move Audit Trail", expanded=False):
        for step_num, step_desc in enumerate(st.session_state.move_history, 1):
            st.write(f"**Step {step_num}:** {step_desc}")

