
import { Game } from './Game';

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('statusDisplay')!;
    let currentPlayer = 'O';  // User plays as O, computer plays as X
    let gameActive = true;

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (!gameActive || cell.textContent !== '') return;
            
            const x = parseInt(cell.getAttribute('data-x')!);
            const y = parseInt(cell.getAttribute('data-y')!);

            console.log(`Cell clicked: (${x}, ${y})`);

            try {
                game.Play(currentPlayer, x, y);
                cell.textContent = currentPlayer;
                console.log(`Player ${currentPlayer} moved to (${x}, ${y})`);

                const winner = game.Winner();
                if (winner !== ' ') {
                    statusDisplay.textContent = `Player ${winner} wins!`;
                    console.log(`Player ${winner} wins!`);
                    gameActive = false;
                } else if (game.getEmptyTiles().length === 0) {
                    statusDisplay.textContent = `It's a draw!`;
                    console.log(`It's a draw!`);
                    gameActive = false;
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;

                    if (currentPlayer === 'X') {
                        makeComputerMove();
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                    console.error(error.message);
                } else {
                    alert('An unknown error occurred');
                    console.error('An unknown error occurred');
                }
            }
        }, { once: true });
    });

    function makeComputerMove() {
        setTimeout(() => {
            const emptyTiles = game.getEmptyTiles();
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            const cell = document.querySelector(`.cell[data-x='${randomTile.X}'][data-y='${randomTile.Y}']`);
            
            game.Play('X', randomTile.X, randomTile.Y);
            if (cell) {
                cell.textContent = 'X';
            }

            const winner = game.Winner();
            if (winner !== ' ') {
                statusDisplay.textContent = `Player ${winner} wins!`;
                console.log(`Player ${winner} wins!`);
                gameActive = false;
            } else if (game.getEmptyTiles().length === 0) {
                statusDisplay.textContent = `It's a draw!`;
                console.log(`It's a draw!`);
                gameActive = false;
            } else {
                currentPlayer = 'O';
                statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
            }
        }, 500);  // Adding a slight delay to mimic human behavior
    }
});



