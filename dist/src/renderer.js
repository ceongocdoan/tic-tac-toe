"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var electron_1 = require("electron");
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
function restartGame() {
    startGame(); // Gọi lại hàm startGame() để bắt đầu game mới khi restart
}
function stopGame() {
    gameActive = false;
    if (statusDisplay) {
        statusDisplay.textContent = "Game stopped";
    }
}
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
function saveWinnerAndUpdateLeaderboard(winner, moves) {
    electron_1.ipcRenderer.send('save-winner', { winner: winner, moves: moves });
}
window.Electron.onShowInfo(function (info) {
    var infoDiv = document.createElement('div');
    infoDiv.innerHTML = "\n        <p>Course Name: ".concat(info.courseName, "</p>\n        <p>School: ").concat(info.school, "</p>\n        <p>Department: ").concat(info.department, "</p>\n        <p>End Date: ").concat(info.endDate, "</p>\n        <ul>\n            ").concat(info.members.map(function (member) { return "<li>".concat(member.name, " - ").concat(member.id, "</li>"); }).join(''), "\n        </ul>\n    ");
    document.body.appendChild(infoDiv);
});
window.Electron.onGameStart(function () {
    startGame();
});
window.Electron.onGameRestart(function () {
    restartGame(); // Gọi lại hàm restartGame() khi nhận được sự kiện game-restart từ main process
});
window.Electron.onGameStop(function () {
    stopGame();
});
// window.Electron.triggerGameStart = () => {
//     startGame();
// };
window.Electron.triggerGameRestart = function () {
    restartGame();
};
window.Electron.triggerGameStop = function () {
    stopGame();
};
window.Electron.saveWinner = saveWinnerAndUpdateLeaderboard;
// Listen for leaderboard data
window.Electron.on('leaderboard-data', function (data) {
    console.log(data);
});
// Start the game when the document is ready
document.addEventListener('DOMContentLoaded', function () {
    startGame();
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'i') {
            window.Electron.triggerShowInfo();
        }
        else if (event.key === 'F1') {
            window.Electron.triggerShowInfo();
        }
        else if (event.ctrlKey && event.key === 'r') {
            window.Electron.triggerGameRestart(); // Trigger game restart on Ctrl+R
        }
        else if (event.ctrlKey && event.key === 'P') {
            window.Electron.triggerGameStart(); // Trigger game stop on Ctrl+P
        }
    });
});
