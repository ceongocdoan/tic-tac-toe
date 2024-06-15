import { Game } from "./Game"
import { Database } from './db';

declare global {
    interface Window {
        electron: {
            onGameStart: (callback: () => void) => void;
            onGameRestart: (callback: () => void) => void;
        };
    }
}

let game: Game;
let gameActive: boolean;
let currentPlayer: string;
let moves: number;

// Lấy phần tử status display
const statusDisplay = document.getElementById('statusDisplay');

function initializeGameVariables() {
    game = new Game();
    gameActive = true;
    currentPlayer = 'X';
    moves = 0;
}

// Khởi động lại trò chơi
function startGame() {
    initializeGameVariables();
    if (statusDisplay) {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
    // Xóa nội dung của các ô cờ
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
}

// Xử lý sự kiện click vào ô cờ
function handleCellClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const x = parseInt(target.getAttribute('data-x')!);
    const y = parseInt(target.getAttribute('data-y')!);

    if (gameActive && !target.textContent) {
        target.textContent = currentPlayer;
        game.Play(currentPlayer, x, y);
        moves++;

        const winner = game.Winner();
        if (winner) {
            if (statusDisplay) {
                statusDisplay.textContent = `Player ${winner} wins!`;
            }
            const db = Database.getInstance();
            db.saveWinner(winner, moves);
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
    }
}

// Đăng ký sự kiện click cho các ô cờ
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick as EventListener);
});

// Xử lý các sự kiện từ Electron
window.electron.onGameStart(() => startGame());
window.electron.onGameRestart(() => startGame());

// Bắt đầu trò chơi khi tải trang
startGame();
