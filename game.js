const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    const reset = () => board = ["", "", "", "", "", "", "", "", ""];
    return { getBoard, updateBoard, reset };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const Game = (() => {
    let players = [];
    let activePlayerIndex = 0;
    let isGameOver = false;

    const start = (name1, name2) => {
        players = [
            Player(name1 || "Player 1", "X"),
            Player(name2 || "Player 2", "O")
        ];
        activePlayerIndex = 0;
        isGameOver = false;
        Gameboard.reset();
        DisplayController.render();
    };

    const checkWin = () => {
        const b = Gameboard.getBoard();
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return wins.some(p => p.every(i => b[i] === players[activePlayerIndex].marker));
    };

    const playRound = (index) => {
        if (isGameOver) return;
        if (Gameboard.updateBoard(index, players[activePlayerIndex].marker)) {
            if (checkWin()) {
                isGameOver = true;
                DisplayController.showEndGame(`${players[activePlayerIndex].name} Wins!`);
            } else if (Gameboard.getBoard().every(cell => cell !== "")) {
                isGameOver = true;
                DisplayController.showEndGame("It's a Tie!");
            } else {
                activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
            }
            DisplayController.render();
        }
    };

    return { start, playRound };
})();

const DisplayController = (() => {
    const boardElement = document.getElementById("gameboard");
    const startBtn = document.getElementById("start-button");
    const restartBtn = document.getElementById("restart-button");
    const modal = document.getElementById("game-modal");
    const modalText = document.getElementById("modal-text");
    const modalRestart = document.getElementById("modal-restart");

    const render = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((marker, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-marker", marker);
            cell.textContent = marker;
            cell.addEventListener("click", () => Game.playRound(index));
            boardElement.appendChild(cell);
        });
    };

    const showEndGame = (message) => {
        modalText.textContent = message;
        modal.style.display = "flex";
    };

    const handleStart = () => {
        const p1 = document.getElementById("player1").value;
        const p2 = document.getElementById("player2").value;
        Game.start(p1, p2);
    };

    startBtn.addEventListener("click", handleStart);
    restartBtn.addEventListener("click", handleStart);
    modalRestart.addEventListener("click", () => {
        modal.style.display = "none";
        handleStart();
    });

    return { render, showEndGame };
})();

// Initialize empty board on load
DisplayController.render();