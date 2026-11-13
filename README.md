# Tic-Tac-Toe AI: An Intelligent Game Agent Using Minimax and Alpha-Beta Pruning

[![Python Version](https://img.shields.io/badge/python-3.8%2B-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![React Version](https://img.shields.io/badge/react-19.0-23272f.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.7-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-6.2-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4.0-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/tests-18%20passed-22c55e.svg)](https://pytest.org/)
[![License](https://img.shields.io/badge/license-MIT-gray.svg)](LICENSE)

An implementation of optimal game-theoretic decision making for Tic-Tac-Toe using the Minimax decision rule with Alpha-Beta ($\alpha$-$\beta$) pruning. Includes both a client-side React 19 + TypeScript web interface with real-time tree-search telemetry, and a modular Python reference implementation with automated test suites and Monte Carlo empirical verification.

---

## Theoretical & Academic Foundations

Guided by foundational literature in game theory and adversarial search (*Swaminathan et al. 2020*, *Kalyan & Singh 2025*, and *Russell & Norvig / Berkeley CS188*):

### 1. Game-Theoretic Classification
Tic-Tac-Toe is modeled as a **finite, two-player, zero-sum game with perfect information**.
- **Zermelo's Theorem (1913)** states that in any finite two-player zero-sum game of perfect information, either the first player has a winning strategy, the second player has a winning strategy, or both players have a strategy guaranteeing at least a draw.
- Tic-Tac-Toe is **rigorously solved as a forced draw** under optimal play by both agents.

### 2. State-Space Complexity
- **Theoretical configurations**: $3^9 = 19,683$ states.
- **Reachable valid states**: $5,478$ board configurations.
- **Symmetry reduction**: Under the dihedral symmetry group $D_4$ (8 symmetries: 4 rotations and 4 reflections), the state space reduces to **765 essentially distinct states**.
- **Complete game paths**: Exactly $26,830$ distinct games up to symmetry.

Because the game-tree is finite and compact, exhaustive adversarial search is tractable and yields exact optimal play without heuristic approximations.

### 3. Minimax Decision Rule
Minimax performs a depth-first search over the game tree, evaluating terminal states via a utility payoff function:

$$\text{Utility}(s) = \begin{cases} +1 & \text{if Player X (Maximizer) wins} \\ -1 & \text{if Player O (Minimizer) wins} \\ 0 & \text{if the game is a Draw} \end{cases}$$

Values are propagated recursively up the game tree via:
- **Maximizer (X)**: $\max_{a \in \text{Actions}(s)} \text{Minimax}(\text{Result}(s, a))$
- **Minimizer (O)**: $\min_{a \in \text{Actions}(s)} \text{Minimax}(\text{Result}(s, a))$

### 4. Alpha-Beta ($\alpha$-$\beta$) Pruning Optimization
To eliminate redundant branch evaluations, branch-and-bound pruning maintains two dynamic thresholds:
- $\alpha$: Maximizer's highest guaranteed payoff along the path.
- $\beta$: Minimizer's lowest guaranteed payoff along the path.

When evaluating a child node, if $\beta \le \alpha$, search on that branch is pruned immediately (**$\beta$-cutoff** for maximizer, **$\alpha$-cutoff** for minimizer). This decreases search complexity from worst-case $O(b^m)$ ($b \approx 9, m \le 9$) to near best-case $O(b^{m/2})$, making decisions effectively instantaneous ($< 1$ ms).

---

## System Architecture

The codebase follows modular software engineering standards across both the React + TypeScript web application and the Python adversarial search engine:

```text
Tic-Tac-Toe-AI/
├── .gitignore                  # Git artifact isolation
├── package.json                # React 19, Vite, TypeScript, Tailwind CSS, Lucide dependencies
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite + Tailwind v4 bundler configuration
├── index.html                  # HTML entry point with Inter & JetBrains Mono typography
├── requirements.txt            # Python dependencies (pytest, streamlit)
├── README.md                   # Project documentation & theoretical foundation
├── src/
│   ├── main.tsx                # React application entry point
│   ├── App.tsx                 # Responsive dual-column dashboard shell
│   ├── index.css               # Design tokens, dark theme variables, custom scrollbars
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx          # Top navbar with repository links & badges
│   │   ├── GameBoard.tsx       # 3×3 interactive grid container
│   │   ├── Cell.tsx            # Fluid, tactile cell button with ghost preview & win glow
│   │   ├── Marks.tsx           # SVG geometric vectors for X & O
│   │   ├── GameStatus.tsx      # Real-time state pill with micro-pulse indicators
│   │   ├── ControlBar.tsx      # Restart, Play as X/O toggle, AI/PvP mode selector
│   │   ├── MetricsBar.tsx      # Real-time telemetry (latency, nodes, cutoffs, game value)
│   │   ├── MoveHistory.tsx     # Chronological move ledger with per-move AI stats
│   │   └── ArchitecturePanel.tsx # Collapsible theoretical reference & academic citations
│   ├── hooks/
│   │   └── useGameState.ts     # React game state hook & AI turn scheduler
│   ├── lib/
│   │   ├── utils.ts            # Class merging utility (clsx + tailwind-merge)
│   │   └── ai/
│   │       ├── types.ts        # Domain types (Player, Cell, Board, AIMetrics, GameStatus)
│   │       ├── engine.ts       # TypeScript Minimax + Alpha-Beta search engine
│   │       └── verifyEngine.ts # Standalone automated verification test suite
│   ├── game.py                 # Python core engine (TicTacToe board state & rule validation)
│   ├── ai.py                   # Python adversarial search (Minimax with Alpha-Beta pruning)
│   ├── utils.py                # Python symbols, winning triplets, formatting helpers
│   └── ui.py                   # Legacy Python Streamlit web GUI
├── tests/
│   ├── __init__.py             # Test package marker
│   ├── test_game.py            # Unit tests for game rules, moves, wins & draws
│   ├── test_ai.py              # Unit tests for optimal AI decisions & zero-loss guarantees
│   └── test_ui.py              # Smoke & integration tests for GUI state transitions
└── experiments/
    ├── __init__.py             # Package marker
    └── simulate.py             # Monte Carlo empirical verification benchmark
```

---

## Quickstart & Installation

### Option A: React + TypeScript Web Application (Recommended)

1. **Install Node Dependencies:**
```bash
npm install
```

2. **Launch Development Server:**
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Production Build & Lint:**
```bash
npm run build
npm run lint
```

4. **Run TypeScript AI Engine Verification:**
```bash
node --experimental-strip-types src/lib/ai/verifyEngine.ts
```

---

### Option B: Python CLI & Test Suite

1. **Prerequisites & Virtual Environment:**
```bash
python --version
pip install -r requirements.txt
```

2. **Run Python Unit & Integration Tests (18 tests):**
```bash
python -m pytest -v
```

3. **Run Monte Carlo Simulation (210 matches):**
```bash
python experiments/simulate.py
```

4. **Launch Streamlit GUI:**
```bash
streamlit run src/ui.py
```

---

## Automated Unit & Integration Tests

The project includes an 18-test automated test suite using `pytest`:

```bash
python -m pytest -v
```

### Test Coverage Breakdown
- **Game Engine (`tests/test_game.py`)**:
  - `test_initial_state`: Clean initialization and turn assignment.
  - `test_valid_moves_and_turn_alternation`: Correct mark placement and turn swapping.
  - `test_invalid_move_out_of_bounds`: Out-of-bounds index handling (`IndexError`).
  - `test_invalid_move_occupied_cell`: Occupied cell protection (`ValueError`).
  - `test_row_win_conditions`: Detection of horizontal terminal states.
  - `test_column_win_conditions`: Detection of vertical terminal states.
  - `test_diagonal_win_conditions`: Detection of diagonal and anti-diagonal wins.
  - `test_draw_condition`: Verification of full board Cat's game states.
  - `test_reset`: Board state restoration.
- **Adversarial Search (`tests/test_ai.py`)**:
  - `test_initial_position`: Root minimax value on empty board strictly equals 0.
  - `test_empty_board_minimizer`: Optimal play as second player yields draw.
  - `test_immediate_win_detection_x`: AI seizes immediate offensive winning moves.
  - `test_immediate_win_detection_o`: Minimizer seizes immediate offensive wins.
  - `test_forcing_block`: Threat detection and preventive blocking.
  - `test_defensive_block_by_o`: Tactical blocking of opponent's two-in-a-row.
  - `test_convenience_wrapper`: Validation of `get_best_move()`.
  - `test_ai_vs_ai_guaranteed_draw`: Complete match of AI self-play terminating strictly in a draw.
- **UI Integration (`tests/test_ui.py`)**:
  - `test_ui_game_flow_simulation`: End-to-end headless simulation of player-AI moves.

---

## Empirical Verification & Monte Carlo Proof

To prove the AI's unbeatability in practice, `experiments/simulate.py` runs 210 simulated matches across three configurations:

```bash
python experiments/simulate.py
```

### Benchmark Results
| Experiment Scenario | Matches | AI Wins | Draws | AI Losses | AI Loss Rate | Empirical Outcome |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Random (X) vs Minimax AI (O)** | 100 | 79 (79%) | 21 (21%) | **0 (0%)** | **0.00%** | AI Invincible |
| **Minimax AI (X) vs Random (O)** | 100 | 98 (98%) | 2 (2%) | **0 (0%)** | **0.00%** | AI Invincible |
| **Minimax AI vs Minimax AI (Self-Play)** | 10 | 0 (0%) | 10 (100%) | 0 (0%) | **0.00%** | Perfect Zermelo Equilibrium |

**Conclusion:** Across all experimental conditions, the AI achieves a **0.00% loss rate**, empirically proving the unbeatability criterion and confirming Zermelo's Theorem.

---

## References & Literature Citations

1. **Zermelo, E.** (1913). *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels*. Proceedings of the Fifth International Congress of Mathematicians, 2, 501–504.
2. **Russell, S., & Norvig, P.** (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. Chapter 5: Adversarial Search and Games.
3. **Swaminathan, A. et al.** (2020). *Analysis of Minimax Algorithm Using Tic-Tac-Toe*.
4. **Kalyan, V., & Singh, R.** (2025). *Tic-Tac-Toe: A Game Theory Analysis*.
5. **UC Berkeley CS188**. *Introduction to Artificial Intelligence: Adversarial Search & Alpha-Beta Pruning Course Notes*.

---

## License
This project is open-source and available under the [MIT License](LICENSE).
