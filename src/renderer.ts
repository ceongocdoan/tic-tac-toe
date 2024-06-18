import { Game } from './Game';
import { contextBridge, ipcRenderer } from 'electron';

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

function restartGame() {
    startGame(); // Gọi lại hàm startGame() để bắt đầu game mới khi restart
}

function stopGame() {
    gameActive = false;
    if (statusDisplay) {
        statusDisplay.textContent = `Game stopped`;
    }
}

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

function saveWinnerAndUpdateLeaderboard(winner: string, moves: number) {
    ipcRenderer.send('save-winner', { winner, moves });
}

interface ElectronAPI {
    onShowInfo: (callback: (info: any) => void) => void;
    onGameStart: (callback: () => void) => void;
    onGameRestart: (callback: () => void) => void;
    onGameStop: (callback: () => void) => void;
    triggerShowInfo: () => void;
    triggerGameStart: () => void;
    triggerGameRestart: () => void;
    triggerGameStop: () => void;
    saveWinner: (player: string, moves: number) => void;
    on: (channel: string, callback: (event: any, ...args: any[]) => void) => void;
}
declare global {
    interface Window {
        Electron: ElectronAPI;
    }
}

window.Electron.onShowInfo((info) => {
    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = `
        <p>Course Name: ${info.courseName}</p>
        <p>School: ${info.school}</p>
        <p>Department: ${info.department}</p>
        <p>End Date: ${info.endDate}</p>
        <ul>
            ${info.members.map((member: any) => `<li>${member.name} - ${member.id}</li>`).join('')}
        </ul>
    `;
    document.body.appendChild(infoDiv);
});

window.Electron.onGameStart(() => {
    startGame();
});

window.Electron.onGameRestart(() => {
    restartGame(); // Gọi lại hàm restartGame() khi nhận được sự kiện game-restart từ main process
});

window.Electron.onGameStop(() => {
    stopGame();
});

window.Electron.triggerGameStart = () => {
    startGame();
};

window.Electron.triggerGameRestart = () => {
    restartGame();
};

window.Electron.triggerGameStop = () => {
    stopGame();
};

window.Electron.saveWinner = saveWinnerAndUpdateLeaderboard;

// Listen for leaderboard data
window.Electron.on('leaderboard-data', (data: any) => {
    console.log(data);
});

// Start the game when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    startGame();
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'i') {
            window.Electron.triggerShowInfo();
        } else if (event.key === 'F1') {
            window.Electron.triggerShowInfo();
        } else if (event.ctrlKey && event.key === 'r') {
            window.Electron.triggerGameRestart(); // Trigger game restart on Ctrl+R
        } else if (event.ctrlKey && event.key === 'P') {
            window.Electron.triggerGameStart(); // Trigger game stop on Ctrl+P
        }
        
    });
});
