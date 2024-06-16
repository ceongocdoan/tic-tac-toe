import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { Database } from './src/db';
let mainWindow: BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('show-info', (event) => {
    event.reply('show-info-reply', 'Information message from the main process.');
});

ipcMain.on('game-start', (event) => {
    event.reply('game-start-reply');
});

ipcMain.on('game-restart', (event) => {
    event.reply('game-restart-reply');
});

ipcMain.on('show-leaderboard', async (event) => {
    const leaderboardData = await Database.getInstance().getLeaderboard();
    event.reply('leaderboard-data', leaderboardData);
});
