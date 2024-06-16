"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
document.addEventListener("DOMContentLoaded", function () {
    var game = new Game_1.Game();
    var cells = document.querySelectorAll('.cell');
    var statusDisplay = document.getElementById('statusDisplay');
    var currentPlayer = 'O'; // User plays as O, computer plays as X
    var gameActive = true;
    cells.forEach(function (cell) {
        cell.addEventListener('click', function () {
            if (!gameActive || cell.textContent !== '')
                return;
            var x = parseInt(cell.getAttribute('data-x'));
            var y = parseInt(cell.getAttribute('data-y'));
            console.log("Cell clicked: (".concat(x, ", ").concat(y, ")"));
            try {
                game.Play(currentPlayer, x, y);
                cell.textContent = currentPlayer;
                console.log("Player ".concat(currentPlayer, " moved to (").concat(x, ", ").concat(y, ")"));
                var winner = game.Winner();
                if (winner !== ' ') {
                    statusDisplay.textContent = "Player ".concat(winner, " wins!");
                    console.log("Player ".concat(winner, " wins!"));
                    gameActive = false;
                }
                else if (game.getEmptyTiles().length === 0) {
                    statusDisplay.textContent = "It's a draw!";
                    console.log("It's a draw!");
                    gameActive = false;
                }
                else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    statusDisplay.textContent = "Player ".concat(currentPlayer, "'s turn");
                    if (currentPlayer === 'X') {
                        makeComputerMove();
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
        }, { once: true });
    });
    function makeComputerMove() {
        setTimeout(function () {
            var emptyTiles = game.getEmptyTiles();
            var randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            var cell = document.querySelector(".cell[data-x='".concat(randomTile.X, "'][data-y='").concat(randomTile.Y, "']"));
            game.Play('X', randomTile.X, randomTile.Y);
            if (cell) {
                cell.textContent = 'X';
            }
            var winner = game.Winner();
            if (winner !== ' ') {
                statusDisplay.textContent = "Player ".concat(winner, " wins!");
                console.log("Player ".concat(winner, " wins!"));
                gameActive = false;
            }
            else if (game.getEmptyTiles().length === 0) {
                statusDisplay.textContent = "It's a draw!";
                console.log("It's a draw!");
                gameActive = false;
            }
            else {
                currentPlayer = 'O';
                statusDisplay.textContent = "Player ".concat(currentPlayer, "'s turn");
            }
        }, 500); // Adding a slight delay to mimic human behavior
    }
});
