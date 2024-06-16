import { Game } from './Game';
import { ipcRenderer } from 'electron'; // Import electron IPC renderer

let game = new Game();
let gameActive = true;
let currentPlayer = 'X';
let moves = 0;

const statusDisplay = document.getElementById('statusDisplay') as HTMLElement;

// Function to start a new game
function startGame() {
    game = new Game();
    gameActive = true;
    currentPlayer = 'X';
    moves = 0;
    if (statusDisplay) {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
}


// Function to handle cell click event
function handleCellClick(event: Event) {
    const target = event.target as HTMLElement;
    const x = parseInt(target.getAttribute('data-x')!);
    const y = parseInt(target.getAttribute('data-y')!);

    if (gameActive && !target.textContent) {
        target.textContent = currentPlayer;
        try {
            game.Play(currentPlayer, x, y);
            moves++;

            const winner = game.Winner();
            if (winner) {
                if (statusDisplay) {
                    statusDisplay.textContent = `Player ${winner} wins!`;
                }
                saveWinnerAndUpdateLeaderboard(winner, moves);
                gameActive = false;
            } else if (moves === 9) {
                if (statusDisplay) {
                    statusDisplay.textContent = `It's a draw!`;
                }
                gameActive = false;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (statusDisplay) {
                    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
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
    }
}

        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

// Function to save winner and update leaderboard
function saveWinnerAndUpdateLeaderboard(winner: string, moves: number) {
    ipcRenderer.send('save-winner', { winner, moves }); // Send winner and moves to main process
}

// Attach click event for grid cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Declare the Electron API interface
interface ElectronAPI {
    onShowInfo: (callback: (event: any, message: string) => void) => void;
    onGameStart: (callback: () => void) => void;
    onGameRestart: (callback: () => void) => void;
    triggerShowInfo: () => void;
    triggerGameStart: () => void;
    triggerGameRestart: () => void;
    saveWinner: (player: string, moves: number) => void;
    on: (channel: string, callback: (event: any, ...args: any[]) => void) => void;
}

// Extend the Window interface to include ElectronAPI
declare global {
    interface Window {
        Electron: ElectronAPI; // Change 'electron' to 'Electron'
    }
}

// Attach event listeners for Electron events
window.Electron.onShowInfo((_event: any, message: string) => {
    alert(message);
});

window.Electron.onGameStart(() => {
    startGame();
});

window.Electron.onGameRestart(() => {
    startGame();
});

window.Electron.triggerGameStart = () => {
    startGame();
};

window.Electron.triggerGameRestart = () => {
    startGame();
};

window.Electron.saveWinner = saveWinnerAndUpdateLeaderboard;

// Listen for leaderboard data
window.Electron.on('leaderboard-data', (data: any) => {
    console.log(data);
});

// Start the game when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    startGame();
});
