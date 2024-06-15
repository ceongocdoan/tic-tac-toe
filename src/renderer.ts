import { Game } from "./Game"
import { Database } from './db';

// Đảm bảo rằng 'game' và 'gameActive' được định nghĩa trước đó
let game = new Game();
let gameActive = true;
let currentPlayer = 'X';
let moves = 0;

// Lấy phần tử status display
const statusDisplay = document.getElementById('statusDisplay');

// Khởi động lại trò chơi
function startGame() {
    game = new Game();
    gameActive = true;
    currentPlayer = 'X';
    moves = 0;
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
            statusDisplay!.textContent = `Player ${winner} wins!`;
            const db = Database.getInstance();
            db.saveWinner(winner, moves);
            gameActive = false;
        } else if (moves === 9) {
            statusDisplay!.textContent = `It's a draw!`;
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay!.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

// Đăng ký sự kiện click cho các ô cờ
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick as EventListener);
});

// Xử lý các sự kiện từ Electron


window.electron.onGameStart(startGame);
window.electron.onGameRestart(startGame);

// Bắt đầu trò chơi khi tải trang
startGame();
