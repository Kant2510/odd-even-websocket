# 🎯 TicTacToe React

A modern **React + TypeScript** implementation of the classic **TicTacToe** game — featuring an intelligent AI opponent, real-time score tracking, and persistent match history.
Built for both fun and performance, this project demonstrates strategic AI behavior, optimized React hooks, and a clean, interactive UI.

---

## ✨ Features

-   🎮 **2 Game Modes**

    -   **Player vs Player (PvP)** – Play locally with a friend.
    -   **Player vs AI (PvAI)** – Battle against a smart AI with two distinct difficulty levels.

-   🧠 **AI Difficulty**

    -   **Easy Mode** – Makes random valid moves; occasionally misses blocks.
    -   **Hard Mode** – Implements a full **Minimax algorithm**; unbeatable (worst-case: draw).

-   📈 **Score & History Tracking**

    -   Track **wins / losses / draws** across multiple games.
    -   Display the **current streak** and its owner.
    -   Persist all data in **localStorage** for continuity.
    -   View detailed match history in an **Ant Design Table**.

-   ⚙️ **Performance Metrics**

    -   Display the **number of positions evaluated** (Hard Mode only).
    -   Measure and show **AI “thinking time”** in milliseconds.
    -   Automatically update metrics after each AI move.

-   💾 **Persistent Storage**

    -   Automatically saves game stats, scores, and history in the browser.

-   🖥️ **Clean & Responsive UI**

    -   Modern, minimalistic interface.
    -   Easy to customize with **Ant Design**.

---

## 🏗️ Project Structure

```
src/
├── assets/
├── components/
├── game/
│   ├── constants.ts
│   ├── core.ts # Game core logic (minimax)
│   └── utils.ts
├── hooks/
├── types/
├── pages/
└── App.tsx
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** >= 20.19.0
-   **yarn** >= 4.0.0
-   **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Kant2510/tic-tac-toe.git
cd tic-tac-toe
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Development

Start all applications in development mode:

```bash
yarn run dev
```

---

## 🕹️ How to Play

1. **Select a Mode:**

    - PvP → Two local players alternate turns.
    - PvAI → Play against the AI (Easy or Hard).

2. **Gameplay Rules:**

    - Player X always goes first.
    - Get 3 in a row (horizontally, vertically, or diagonally) to win.
    - If the board fills up without a winner → it’s a draw.

3. **AI Mode:**

    - Choose difficulty before starting.
    - Watch the AI “think” in real time with metrics displayed.
    - Review match history and streaks after each round.

4. **Match History:**

    - View all past results in a table view.
    - Click 🗑️ **Reset** to clear all data instantly.

---

## 🧠 Explanation of AI Difficulty Levels

### 🟢 Easy Mode

-   Picks random available squares.
-   Occasionally ignores obvious winning or blocking moves.
-   Designed to be fun and easily beatable.

### 🔴 Hard Mode

-   Uses the **Minimax algorithm** to simulate every possible move.
-   Always selects the optimal strategy — **impossible to defeat**.

-   Displays:

    -   ⏱ **Thinking time (ms)**
    -   🔢 **Evaluated positions**

---

## 📬 Contact

-   Email: [auletuannhat@gmail.com](mailto:auletuannhat@gmail.com)
-   Github: [Kant2510](https://github.com/Kant2510/ielts-learning-backend-system)
-   LinkedIn: [Nhat Au](https://www.linkedin.com/in/nhat-au-73a629283)

---

**Happy coding!** 🚀✨
