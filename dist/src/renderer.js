"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var electron_1 = require("electron"); // Import electron IPC renderer
var game = new Game_1.Game();
var gameActive = true;
var currentPlayer = 'X';
var moves = 0;
var statusDisplay = document.getElementById('statusDisplay');
// Function to start a new game
function startGame() {
    game = new Game_1.Game();
    gameActive = true;
    currentPlayer = 'X';
    moves = 0;
    if (statusDisplay) {
        statusDisplay.textContent = "Player ".concat(currentPlayer, "'s turn");
    }
    document.querySelectorAll('.cell').forEach(function (cell) { return cell.textContent = ''; });
}
// Function to handle cell click event
function handleCellClick(event) {
    var target = event.target;
    var x = parseInt(target.getAttribute('data-x'));
    var y = parseInt(target.getAttribute('data-y'));
    if (gameActive && !target.textContent) {
        target.textContent = currentPlayer;
        try {
            game.Play(currentPlayer, x, y);
            moves++;
            var winner = game.Winner();
            if (winner) {
                if (statusDisplay) {
                    statusDisplay.textContent = "Player ".concat(winner, " wins!");
                }
                saveWinnerAndUpdateLeaderboard(winner, moves);
                gameActive = false;
            }
            else if (moves === 9) {
                if (statusDisplay) {
                    statusDisplay.textContent = "It's a draw!";
                }
                gameActive = false;
            }
            else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (statusDisplay) {
                    statusDisplay.textContent = "Player ".concat(currentPlayer, "'s turn");
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                alert(error.message);
                console.error(error.message);
            }
            else {
                alert('An unknown error occurred');
                console.error('An unknown error occurred');
            }
        }
    }
}
document.querySelectorAll('.cell').forEach(function (cell) {
    cell.addEventListener('click', handleCellClick);
});
// Function to save winner and update leaderboard
function saveWinnerAndUpdateLeaderboard(winner, moves) {
    electron_1.ipcRenderer.send('save-winner', { winner: winner, moves: moves }); // Send winner and moves to main process
}
// Attach click event for grid cells
document.querySelectorAll('.cell').forEach(function (cell) {
    cell.addEventListener('click', handleCellClick);
});
// Attach event listeners for Electron events
window.Electron.onShowInfo(function (_event, message) {
    alert(message);
});
window.Electron.onGameStart(function () {
    startGame();
});
window.Electron.onGameRestart(function () {
    startGame();
});
window.Electron.triggerGameStart = function () {
    startGame();
};
window.Electron.triggerGameRestart = function () {
    startGame();
};
window.Electron.saveWinner = saveWinnerAndUpdateLeaderboard;
// Listen for leaderboard data
window.Electron.on('leaderboard-data', function (data) {
    console.log(data);
});
// Start the game when the document is ready
document.addEventListener('DOMContentLoaded', function () {
    startGame();
});
